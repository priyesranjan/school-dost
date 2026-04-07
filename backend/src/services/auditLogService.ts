import { randomInt } from 'node:crypto'
import { prisma } from '../db/prisma'
import { signAuditPayload } from './auditSignService'
import type { AppRole } from './authTokenService'

function maskValue(value: string) {
  const clean = value.trim()
  if (!clean) return clean
  if (clean.length <= 6) return '***'
  return `${clean.slice(0, 2)}***${clean.slice(-2)}`
}

export async function appendAuditLog(input: {
  action: string
  module: string
  actor_name: string
  actor_role: string
  target: string
  metadata: string
}) {
  const latest = await prisma.auditLog.findFirst({
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
  })

  const createdAt = new Date().toISOString()
  const prevHash = latest?.hash || 'GENESIS'
  const signatureVersion = 1
  const auditNonce = Date.now() * 1000 + randomInt(0, 1000)

  const hash = signAuditPayload({
    id: auditNonce,
    action: input.action,
    module: input.module,
    actor_name: input.actor_name,
    actor_role: input.actor_role,
    target: input.target,
    metadata: input.metadata,
    created_at: createdAt,
    prev_hash: prevHash,
    signature_version: signatureVersion,
  })

  await prisma.auditLog.create({
    data: {
      action: input.action,
      module: input.module,
      actorName: input.actor_name,
      actorRole: input.actor_role,
      target: input.target,
      metadata: input.metadata,
      auditNonce: BigInt(auditNonce),
      prevHash,
      hash,
      signatureVersion: 2,
      createdAt: new Date(createdAt),
    },
  })
}

export async function listAuditLogs(input: {
  page: number
  per_page: number
  module?: string
  action?: string
  role: AppRole
}) {
  const where = {
    module: input.module || undefined,
    action: input.action || undefined,
  }

  const [rows, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: (input.page - 1) * input.per_page,
      take: input.per_page,
    }),
    prisma.auditLog.count({ where }),
  ])

  const canViewRaw = input.role === 'admin'
  const items = rows.map((row) => ({
    id: String(row.id),
    action: row.action,
    module: row.module,
    actor_name: row.actorName,
    actor_role: row.actorRole,
    target: canViewRaw ? row.target : maskValue(row.target),
    metadata: canViewRaw ? row.metadata : maskValue(row.metadata),
    prev_hash: row.prevHash,
    hash: row.hash,
    signature_version: row.signatureVersion,
    created_at: row.createdAt.toISOString(),
  }))

  return {
    items,
    pagination: {
      page: input.page,
      per_page: input.per_page,
      total,
      total_pages: Math.max(1, Math.ceil(total / input.per_page)),
    },
  }
}

export async function verifyAuditIntegrity() {
  const rows = await prisma.auditLog.findMany({
    orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
  })

  let chain_break_count = 0
  let signature_mismatch_count = 0
  let unverifiable_legacy_count = 0
  let expectedPrevHash = 'GENESIS'

  for (const row of rows) {
    const rowWithNonce = row as typeof row & { auditNonce?: bigint | null }
    if (row.prevHash !== expectedPrevHash) {
      chain_break_count += 1
    }

    if (rowWithNonce.auditNonce == null || row.signatureVersion < 2) {
      unverifiable_legacy_count += 1
    } else {
      const expectedHash = signAuditPayload({
        id: Number(rowWithNonce.auditNonce),
        action: row.action,
        module: row.module,
        actor_name: row.actorName,
        actor_role: row.actorRole,
        target: row.target,
        metadata: row.metadata,
        created_at: row.createdAt.toISOString(),
        prev_hash: row.prevHash,
        signature_version: row.signatureVersion,
      })
      if (expectedHash !== row.hash) {
        signature_mismatch_count += 1
      }
    }

    expectedPrevHash = row.hash
  }

  const tampered = chain_break_count > 0 || signature_mismatch_count > 0
  let alert_emitted = false

  if (tampered) {
    const recentAlert = await prisma.auditLog.findFirst({
      where: {
        module: 'security',
        action: 'audit_tamper_detected',
        createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) },
      },
      orderBy: [{ createdAt: 'desc' }],
    })

    if (!recentAlert) {
      await appendAuditLog({
        action: 'audit_tamper_detected',
        module: 'security',
        actor_name: 'System Guard',
        actor_role: 'system',
        target: 'audit_register',
        metadata: `chain_break_count=${chain_break_count} signature_mismatch_count=${signature_mismatch_count}`,
      })
      alert_emitted = true
    }
  }

  return {
    status: tampered ? 'tampered' : 'ok',
    total_entries: rows.length,
    chain_break_count,
    signature_mismatch_count,
    unverifiable_legacy_count,
    alert_emitted,
  }
}

import { randomUUID } from 'node:crypto'
import type { PrismaClient } from '@prisma/client'

type PolicyInput = {
  password_min_length: number
  require_uppercase: boolean
  require_lowercase: boolean
  require_number: boolean
  require_special_char: boolean
  session_timeout_hours: number
  allow_concurrent_sessions: boolean
  enforce_ip_allowlist: boolean
  ip_allowlist: string[]
  two_factor_required_admins: boolean
}

function mapPolicy(row: any) {
  return {
    id: Number(row.id),
    password_min_length: row.passwordMinLength,
    require_uppercase: Boolean(row.requireUppercase),
    require_lowercase: Boolean(row.requireLowercase),
    require_number: Boolean(row.requireNumber),
    require_special_char: Boolean(row.requireSpecialChar),
    session_timeout_hours: row.sessionTimeoutHours,
    allow_concurrent_sessions: Boolean(row.allowConcurrentSessions),
    enforce_ip_allowlist: Boolean(row.enforceIpAllowlist),
    ip_allowlist: Array.isArray(row.ipAllowlist) ? row.ipAllowlist : [],
    two_factor_required_admins: Boolean(row.twoFactorRequiredAdmins),
    updated_by_name: row.updatedByName ?? null,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  }
}

function mapSession(row: any) {
  return {
    id: Number(row.id),
    session_id: row.sessionId ?? null,
    user_sub: row.userSub,
    name: row.name,
    role: row.role,
    email: row.email,
    ip_address: row.ipAddress ?? null,
    user_agent: row.userAgent ?? null,
    last_seen_at: row.lastSeenAt ? row.lastSeenAt.toISOString() : null,
    created_at: row.createdAt.toISOString(),
    expires_at: row.expiresAt.toISOString(),
    revoked_at: row.revokedAt ? row.revokedAt.toISOString() : null,
    is_active: !row.revokedAt && row.expiresAt.getTime() >= Date.now(),
  }
}

export function extractClientIp(source: { headers?: any; ip?: string | undefined }) {
  const forwarded = source.headers?.['x-forwarded-for']
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded
  const candidate = typeof raw === 'string' && raw.trim() ? raw.split(',')[0].trim() : source.ip || ''
  return candidate.replace('::ffff:', '').trim() || 'unknown'
}

export function buildSessionMetadata(source: { headers?: any; ip?: string | undefined }) {
  return {
    session_id: randomUUID(),
    user_agent: String(source.headers?.['user-agent'] || '').slice(0, 500) || null,
    ip_address: extractClientIp(source),
  }
}

export async function getOrCreateSecurityPolicy(db: PrismaClient) {
  const existing = await (db as any).securityPolicy.findFirst({
    orderBy: [{ id: 'asc' }],
  })
  if (existing) return mapPolicy(existing)

  const created = await (db as any).securityPolicy.create({
    data: {},
  })
  return mapPolicy(created)
}

export async function getSecurityPolicyEnforcement(db: PrismaClient) {
  const existing = await (db as any).securityPolicy.findFirst({
    orderBy: [{ id: 'asc' }],
    select: {
      enforceIpAllowlist: true,
      ipAllowlist: true,
      sessionTimeoutHours: true,
    },
  })
  return {
    enforce_ip_allowlist: Boolean(existing?.enforceIpAllowlist),
    ip_allowlist: Array.isArray(existing?.ipAllowlist) ? existing.ipAllowlist : [],
    session_timeout_hours: Number(existing?.sessionTimeoutHours || 168),
  }
}

export async function updateSecurityPolicy(db: PrismaClient, input: PolicyInput, actorName?: string | null) {
  const existing = await (db as any).securityPolicy.findFirst({
    orderBy: [{ id: 'asc' }],
    select: { id: true },
  })

  const payload = {
    passwordMinLength: input.password_min_length,
    requireUppercase: input.require_uppercase,
    requireLowercase: input.require_lowercase,
    requireNumber: input.require_number,
    requireSpecialChar: input.require_special_char,
    sessionTimeoutHours: input.session_timeout_hours,
    allowConcurrentSessions: input.allow_concurrent_sessions,
    enforceIpAllowlist: input.enforce_ip_allowlist,
    ipAllowlist: input.ip_allowlist,
    twoFactorRequiredAdmins: input.two_factor_required_admins,
    updatedByName: actorName || null,
  }

  const row = existing
    ? await (db as any).securityPolicy.update({
        where: { id: existing.id },
        data: payload,
      })
    : await (db as any).securityPolicy.create({
        data: payload,
      })

  return mapPolicy(row)
}

export async function listSecuritySessions(
  db: PrismaClient,
  input: {
    active_only?: boolean
    role?: string
  } = {},
) {
  const rows = await db.refreshToken.findMany({
    where: {
      ...(input.role ? { role: input.role } : {}),
      ...(input.active_only
        ? {
            revokedAt: null,
            expiresAt: { gte: new Date() },
          }
        : {}),
    },
    orderBy: [{ createdAt: 'desc' }],
    select: {
      id: true,
      sessionId: true,
      userSub: true,
      name: true,
      role: true,
      email: true,
      ipAddress: true,
      userAgent: true,
      lastSeenAt: true,
      createdAt: true,
      expiresAt: true,
      revokedAt: true,
    },
  })

  return {
    items: rows.map(mapSession),
    total: rows.length,
  }
}

export async function revokeSecuritySession(db: PrismaClient, id: number) {
  const row = await db.refreshToken.update({
    where: { id: BigInt(id) },
    data: { revokedAt: new Date() },
    select: {
      id: true,
      sessionId: true,
      userSub: true,
      name: true,
      role: true,
      email: true,
      ipAddress: true,
      userAgent: true,
      lastSeenAt: true,
      createdAt: true,
      expiresAt: true,
      revokedAt: true,
    },
  })

  return mapSession(row)
}

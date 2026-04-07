import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { AuditLog } from '@/types'
import { loadFromStorage, saveToStorage } from '@/utils/storage'
import { GENESIS_HASH, SIGNATURE_VERSION, computeLocalAuditHash, signAuditEntry, verifyAuditEntry } from '@/services/auditSignatureService'

const demoLogs: AuditLog[] = [
  {
    id: 1,
    action: 'notice_published',
    module: 'notices',
    actor_name: 'Admin User',
    actor_role: 'admin',
    target: 'Parent-Teacher Meeting',
    metadata: 'Published with SMS',
    created_at: '2026-04-02T09:12:00.000Z',
    prev_hash: GENESIS_HASH,
    hash: '',
    signature_version: SIGNATURE_VERSION,
  },
]

function stripHash(entry: AuditLog): Omit<AuditLog, 'hash'> {
  return {
    id: entry.id,
    action: entry.action,
    module: entry.module,
    actor_name: entry.actor_name,
    actor_role: entry.actor_role,
    target: entry.target,
    metadata: entry.metadata,
    created_at: entry.created_at,
    prev_hash: entry.prev_hash,
    signature_version: entry.signature_version,
  }
}

function normalizeLogs(raw: AuditLog[]) {
  const ordered = [...raw].reverse()
  let prev = GENESIS_HASH

  const normalized = ordered.map((l) => {
    const base: Omit<AuditLog, 'hash'> = {
      id: l.id,
      action: l.action,
      module: l.module,
      actor_name: l.actor_name,
      actor_role: l.actor_role,
      target: l.target,
      metadata: l.metadata,
      created_at: l.created_at,
      prev_hash: l.prev_hash || prev,
      signature_version: l.signature_version || SIGNATURE_VERSION,
    }
    const hash = l.hash || computeLocalAuditHash(base)
    prev = hash
    return {
      ...base,
      hash,
    }
  })

  return normalized.reverse()
}

export const useAuditStore = defineStore('audit', () => {
  const saved = loadFromStorage<AuditLog[]>('audit_logs')
  const logs = ref<AuditLog[]>(normalizeLogs(saved || demoLogs))
  let queue = Promise.resolve()

  watch(logs, (val) => saveToStorage('audit_logs', val), { deep: true })

  const latestLogs = computed(() => logs.value.slice(0, 100))

  function addLog(payload: Omit<AuditLog, 'id' | 'created_at' | 'prev_hash' | 'hash' | 'signature_version'>) {
    queue = queue.then(async () => {
      const prevHash = logs.value[0]?.hash || GENESIS_HASH
      const base: Omit<AuditLog, 'hash'> = {
        id: Date.now() * 1000 + Math.floor(Math.random() * 1000),
        created_at: new Date().toISOString(),
        ...payload,
        prev_hash: prevHash,
        signature_version: SIGNATURE_VERSION,
      }
      const signedHash = await signAuditEntry(base)
      const entry: AuditLog = {
        ...base,
        hash: signedHash,
      }
      logs.value.unshift(entry)
    })
    return queue
  }

  function verifyIntegrity() {
    const issues: string[] = []
    const ordered = [...logs.value].reverse()
    let prev = GENESIS_HASH

    for (const row of ordered) {
      if (row.prev_hash !== prev) {
        issues.push(`Chain mismatch at ${row.action} (${row.created_at})`)
      }
      if (!verifyAuditEntry({ ...stripHash(row), hash: row.hash })) {
        issues.push(`Signature mismatch at ${row.action} (${row.created_at})`)
      }
      prev = row.hash
    }

    return {
      ok: issues.length === 0,
      issues,
    }
  }

  return {
    logs,
    latestLogs,
    addLog,
    verifyIntegrity,
  }
})

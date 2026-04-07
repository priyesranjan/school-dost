import { getAuditSignatureEndpoint, getAuditSignatureMode } from '@/utils/runtimeConfig'
import { loadFromStorage, saveToStorage } from '@/utils/storage'
import { executeWithRetry, shouldRetryHttpStatus } from './retryService'
import { runWithCircuitBreaker } from './circuitBreakerService'

const SIGNATURE_VERSION = 1
const GENESIS_HASH = 'GENESIS'

function getSigningSalt() {
  const key = 'audit_signing_salt'
  const existing = loadFromStorage<string>(key)
  if (existing) return existing
  const created = `${Date.now()}-${Math.random().toString(36).slice(2)}`
  saveToStorage(key, created)
  return created
}

function signatureInput(entry: {
  id: number
  action: string
  module: string
  actor_name: string
  actor_role: string
  target: string
  metadata: string
  created_at: string
  prev_hash: string
  signature_version: number
}) {
  return [
    entry.id,
    entry.action,
    entry.module,
    entry.actor_name,
    entry.actor_role,
    entry.target,
    entry.metadata,
    entry.created_at,
    entry.prev_hash,
    entry.signature_version,
    getSigningSalt(),
  ].join('|')
}

function hashString(value: string) {
  // FNV-1a 32-bit: deterministic digest for local tamper-evidence.
  let hash = 0x811c9dc5
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}

export function computeLocalAuditHash(entry: {
  id: number
  action: string
  module: string
  actor_name: string
  actor_role: string
  target: string
  metadata: string
  created_at: string
  prev_hash: string
  signature_version: number
}) {
  return hashString(signatureInput(entry))
}

export async function signAuditEntry(entry: {
  id: number
  action: string
  module: string
  actor_name: string
  actor_role: string
  target: string
  metadata: string
  created_at: string
  prev_hash: string
  signature_version: number
}) {
  if (getAuditSignatureMode() === 'api') {
    try {
      const response = await runWithCircuitBreaker(
        'audit_sign',
        () =>
          executeWithRetry(
            async () => {
              const response = await fetch(getAuditSignatureEndpoint(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entry),
              })
              if (!response.ok) {
                const err = new Error(`Audit sign failed (${response.status})`) as Error & { status?: number }
                err.status = response.status
                throw err
              }
              return response
            },
            {
              retries: 2,
              initialDelayMs: 350,
              shouldRetry(error) {
                const status = (error as { status?: number })?.status
                if (!status) return true
                return shouldRetryHttpStatus(status)
              },
            },
          ),
        {
          threshold: 3,
          cooldownMs: 60000,
          shouldTrip(error) {
            const status = (error as { status?: number })?.status
            if (!status) return true
            return shouldRetryHttpStatus(status)
          },
        },
      )
      const data = (await response.json()) as { hash?: string }
      if (data.hash) return data.hash
      if (import.meta.env.PROD) {
        throw new Error('Audit signing endpoint returned invalid response')
      }
    } catch {
      // In development/demo, fallback keeps feature flow usable without backend.
      if (import.meta.env.PROD) {
        throw new Error('Audit signing failed in API mode')
      }
    }
  }

  return computeLocalAuditHash(entry)
}

export function verifyAuditEntry(entry: {
  id: number
  action: string
  module: string
  actor_name: string
  actor_role: string
  target: string
  metadata: string
  created_at: string
  prev_hash: string
  signature_version: number
  hash: string
}) {
  const expected = computeLocalAuditHash(entry)
  return expected === entry.hash
}

export { SIGNATURE_VERSION, GENESIS_HASH }

import { loadFromStorage, saveToStorage } from '@/utils/storage'

interface OpsNotification {
  id: number
  type: 'payment' | 'attendance' | 'student' | 'fee_due' | 'system'
  title: string
  message: string
  read: boolean
  timestamp: string
  severity?: 'info' | 'warning' | 'critical'
  source_key?: string | null
  muted_until?: string | null
}

const MAX_NOTIFICATIONS = 200
const NOTIFICATIONS_KEY = 'notifications'
const NOTIFICATION_EVENT = 'erp-notifications-updated'

interface EmitOptions {
  severity?: 'info' | 'warning' | 'critical'
  sourceKey?: string
  dedupWindowMs?: number
}

function findRecentDuplicate(
  list: OpsNotification[],
  sourceKey: string | undefined,
  dedupWindowMs: number,
) {
  if (!sourceKey) return null
  const now = Date.now()
  return list.find(
    (n) =>
      n.type === 'system' &&
      n.source_key === sourceKey &&
      now - new Date(n.timestamp).getTime() <= dedupWindowMs,
  )
}

export function emitSystemNotification(title: string, message: string, options?: EmitOptions) {
  const existing = loadFromStorage<OpsNotification[]>(NOTIFICATIONS_KEY) || []
  const dedupWindowMs = options?.dedupWindowMs ?? 5 * 60 * 1000
  const duplicate = findRecentDuplicate(existing, options?.sourceKey, dedupWindowMs)

  if (duplicate) {
    duplicate.message = message
    duplicate.timestamp = new Date().toISOString()
    duplicate.read = false
    duplicate.severity = options?.severity || duplicate.severity || 'warning'
    duplicate.muted_until = null
    saveToStorage(NOTIFICATIONS_KEY, existing)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(NOTIFICATION_EVENT))
    }
    return
  }

  const entry: OpsNotification = {
    id: Date.now() * 1000 + Math.floor(Math.random() * 1000),
    type: 'system',
    title,
    message,
    read: false,
    timestamp: new Date().toISOString(),
    severity: options?.severity || 'warning',
    source_key: options?.sourceKey || null,
    muted_until: null,
  }
  const next: OpsNotification[] = [
    entry,
    ...existing,
  ].slice(0, MAX_NOTIFICATIONS)

  saveToStorage(NOTIFICATIONS_KEY, next)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(NOTIFICATION_EVENT))
  }
}

export { NOTIFICATION_EVENT }

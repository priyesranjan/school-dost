import { clearAllStorage } from '@/utils/storage'

export interface ErpSnapshot {
  schema_version: number
  exported_at: string
  keys: Record<string, unknown>
}

const SCHEMA_VERSION = 2
const STORAGE_PREFIX = 'erp_'

export function exportErpSnapshot(): ErpSnapshot {
  const keys: Record<string, unknown> = {}

  Object.keys(localStorage)
    .filter((k) => k.startsWith(STORAGE_PREFIX))
    .forEach((key) => {
      const raw = localStorage.getItem(key)
      if (!raw) return
      try {
        keys[key] = JSON.parse(raw)
      } catch {
        keys[key] = raw
      }
    })

  return {
    schema_version: SCHEMA_VERSION,
    exported_at: new Date().toISOString(),
    keys,
  }
}

export function downloadErpSnapshot() {
  const snapshot = exportErpSnapshot()
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `erp-backup-v${snapshot.schema_version}-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importErpSnapshot(snapshot: ErpSnapshot, mode: 'replace' | 'merge') {
  if (!snapshot || typeof snapshot !== 'object') throw new Error('Invalid snapshot file')
  if (typeof snapshot.schema_version !== 'number') throw new Error('Invalid schema version')
  if (!snapshot.keys || typeof snapshot.keys !== 'object') throw new Error('Invalid snapshot keys')

  if (mode === 'replace') {
    clearAllStorage()
  }

  Object.entries(snapshot.keys).forEach(([key, value]) => {
    if (!key.startsWith(STORAGE_PREFIX)) return
    localStorage.setItem(key, JSON.stringify(value))
  })

  return {
    imported_keys: Object.keys(snapshot.keys).length,
    schema_version: snapshot.schema_version,
  }
}

export { SCHEMA_VERSION }

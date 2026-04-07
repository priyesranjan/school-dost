/**
 * LocalStorage persistence helpers for Pinia stores.
 * Saves/restores store data automatically so demo data survives page refreshes.
 */

const STORAGE_PREFIX = 'erp_'

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data))
  } catch {
    // Silently fail if localStorage is full
  }
}

export function loadFromStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function clearStorage(key: string): void {
  localStorage.removeItem(STORAGE_PREFIX + key)
}

export function clearAllStorage(): void {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith(STORAGE_PREFIX))
  keys.forEach((k) => localStorage.removeItem(k))
}

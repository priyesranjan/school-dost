import type { SchoolSettings } from '@/types'

function readSettings(): Partial<SchoolSettings> {
  try {
    const raw = localStorage.getItem('erp_settings') || localStorage.getItem('settings')
    return raw ? (JSON.parse(raw) as Partial<SchoolSettings>) : {}
  } catch {
    return {}
  }
}

function readBooleanEnv(value: unknown, fallback: boolean): boolean {
  if (typeof value !== 'string') return fallback
  return value.trim().toLowerCase() === 'true'
}

export function getOfflineMode(): boolean {
  const settings = readSettings()
  if (typeof settings.offline_mode === 'boolean') return settings.offline_mode
  return readBooleanEnv(import.meta.env.VITE_OFFLINE_MODE, true)
}

export function setOfflineMode(enabled: boolean): void {
  try {
    const raw = localStorage.getItem('erp_settings') || localStorage.getItem('settings')
    const current = raw ? (JSON.parse(raw) as Record<string, unknown>) : {}
    localStorage.setItem('erp_settings', JSON.stringify({ ...current, offline_mode: enabled }))
  } catch {
    localStorage.setItem('erp_settings', JSON.stringify({ offline_mode: enabled }))
  }
}

export function getOtpMode(): 'demo' | 'api' {
  const settings = readSettings()
  if (getOfflineMode()) return 'demo'
  if (settings.otp_mode === 'api') return 'api'
  if (settings.otp_mode === 'demo') return 'demo'
  return (import.meta.env.VITE_OTP_MODE || 'demo') === 'api' ? 'api' : 'demo'
}

export function getR2Mode(): 'demo' | 'api' {
  const settings = readSettings()
  if (getOfflineMode()) return 'demo'
  if (settings.r2_mode === 'api') return 'api'
  if (settings.r2_mode === 'demo') return 'demo'
  return (import.meta.env.VITE_R2_MODE || 'demo') === 'api' ? 'api' : 'demo'
}

export function getAuditSignatureMode(): 'local' | 'api' {
  const settings = readSettings()
  if (getOfflineMode()) return 'local'
  if (settings.audit_signature_mode === 'api') return 'api'
  if (settings.audit_signature_mode === 'local') return 'local'
  return (import.meta.env.VITE_AUDIT_SIGNATURE_MODE || 'local') === 'api' ? 'api' : 'local'
}

export function getAuditSignatureEndpoint(): string {
  const settings = readSettings()
  if (settings.audit_signature_endpoint && settings.audit_signature_endpoint.trim()) {
    return settings.audit_signature_endpoint.trim()
  }
  return import.meta.env.VITE_AUDIT_SIGNATURE_ENDPOINT || '/api/audit/sign'
}

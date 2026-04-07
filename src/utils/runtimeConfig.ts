import type { SchoolSettings } from '@/types'

function readSettings(): Partial<SchoolSettings> {
  try {
    const raw = localStorage.getItem('erp_settings')
    return raw ? (JSON.parse(raw) as Partial<SchoolSettings>) : {}
  } catch {
    return {}
  }
}

export function getOtpMode(): 'demo' | 'api' {
  const settings = readSettings()
  if (settings.otp_mode === 'api') return 'api'
  if (settings.otp_mode === 'demo') return 'demo'
  return (import.meta.env.VITE_OTP_MODE || 'demo') === 'api' ? 'api' : 'demo'
}

export function getR2Mode(): 'demo' | 'api' {
  const settings = readSettings()
  if (settings.r2_mode === 'api') return 'api'
  if (settings.r2_mode === 'demo') return 'demo'
  return (import.meta.env.VITE_R2_MODE || 'demo') === 'api' ? 'api' : 'demo'
}

export function getAuditSignatureMode(): 'local' | 'api' {
  const settings = readSettings()
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

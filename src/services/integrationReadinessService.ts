import type { SchoolSettings } from '@/types'

export interface ReadinessCheck {
  key: string
  ok: boolean
  message: string
}

export function evaluateIntegrationReadiness(settings: SchoolSettings): ReadinessCheck[] {
  const checks: ReadinessCheck[] = []

  if (settings.otp_mode === 'api') {
    checks.push({
      key: 'otp_api_key',
      ok: Boolean(settings.twofactor_api_key.trim()),
      message: settings.twofactor_api_key.trim() ? 'OTP API key configured' : 'OTP API key missing',
    })
    checks.push({
      key: 'otp_template',
      ok: Boolean(settings.twofactor_template_login.trim()),
      message: settings.twofactor_template_login.trim() ? 'OTP template configured' : 'OTP template missing',
    })
  }

  if (settings.r2_mode === 'api') {
    checks.push({
      key: 'r2_bucket',
      ok: Boolean(settings.r2_bucket.trim()),
      message: settings.r2_bucket.trim() ? 'R2 bucket configured' : 'R2 bucket missing',
    })
    checks.push({
      key: 'r2_public_url',
      ok: Boolean(settings.r2_public_base_url.trim()),
      message: settings.r2_public_base_url.trim() ? 'R2 public URL configured' : 'R2 public URL missing',
    })
  }

  if (settings.audit_signature_mode === 'api') {
    checks.push({
      key: 'audit_signature_endpoint',
      ok: Boolean(settings.audit_signature_endpoint.trim()),
      message: settings.audit_signature_endpoint.trim() ? 'Audit signature endpoint configured' : 'Audit signature endpoint missing',
    })
  }

  if (!checks.length) {
    checks.push({
      key: 'demo_mode',
      ok: true,
      message: 'System is in local/demo integration mode',
    })
  }

  return checks
}

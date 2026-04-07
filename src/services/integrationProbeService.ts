import type { SchoolSettings } from '@/types'

export interface EndpointProbeResult {
  key: string
  label: string
  url: string
  ok: boolean
  status: number | null
  message: string
}

async function probe(url: string): Promise<{ ok: boolean; status: number | null; message: string }> {
  try {
    const response = await fetch(url, {
      method: 'OPTIONS',
      credentials: 'include',
    })
    return {
      ok: true,
      status: response.status,
      message: response.status ? `HTTP ${response.status}` : 'Reachable',
    }
  } catch {
    return {
      ok: false,
      status: null,
      message: 'Network error / endpoint unreachable',
    }
  }
}

export async function runIntegrationEndpointProbes(settings: SchoolSettings): Promise<EndpointProbeResult[]> {
  const targets: Array<{ key: string; label: string; url: string }> = [
    { key: 'api_health', label: 'Core API Health', url: '/api/health' },
  ]

  if (settings.otp_mode === 'api') {
    targets.push({ key: 'otp_send', label: 'OTP Send Endpoint', url: '/api/auth/otp/send' })
  }

  if (settings.r2_mode === 'api') {
    targets.push({ key: 'r2_sign', label: 'R2 Sign Upload Endpoint', url: '/api/storage/r2/sign-upload' })
  }

  if (settings.audit_signature_mode === 'api') {
    targets.push({ key: 'audit_sign', label: 'Audit Signature Endpoint', url: settings.audit_signature_endpoint })
  }

  const results: EndpointProbeResult[] = []
  for (const t of targets) {
    const result = await probe(t.url)
    results.push({
      key: t.key,
      label: t.label,
      url: t.url,
      ok: result.ok,
      status: result.status,
      message: result.message,
    })
  }

  return results
}

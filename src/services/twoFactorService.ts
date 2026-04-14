import api from './api'
import type { OtpChallenge, AuthUser } from '@/types'
import { getOtpMode } from '@/utils/runtimeConfig'
import { executeWithRetry } from './retryService'
import { runWithCircuitBreaker } from './circuitBreakerService'

interface OtpSessionRecord {
  otp: string
  expires_at: number
  destination_masked: string
}

export interface OtpVerifyResult {
  ok: boolean
  access_token?: string
  refresh_token?: string
  user?: AuthUser
}

const OTP_DEMO_CODE = '123456'
const OTP_SESSIONS_KEY = 'erp_otp_sessions'

function maskPhone(phone: string): string {
  if (phone.length < 4) return '******'
  return `${'*'.repeat(Math.max(0, phone.length - 4))}${phone.slice(-4)}`
}

function readDemoSessions(): Record<string, OtpSessionRecord> {
  try {
    const raw = localStorage.getItem(OTP_SESSIONS_KEY)
    return raw ? (JSON.parse(raw) as Record<string, OtpSessionRecord>) : {}
  } catch {
    return {}
  }
}

function writeDemoSessions(data: Record<string, OtpSessionRecord>) {
  localStorage.setItem(OTP_SESSIONS_KEY, JSON.stringify(data))
}

export const twoFactorService = {
  async sendLoginOtp(phone: string, channel: 'sms' | 'whatsapp' = 'sms'): Promise<OtpChallenge> {
    const mode = getOtpMode()

    if (mode === 'api') {
      const res = await runWithCircuitBreaker(
        'otp_send',
        () =>
          executeWithRetry(() => api.post('/auth/otp/send', { phone, purpose: 'login', channel }), {
            retries: 2,
            initialDelayMs: 350,
          }),
        { threshold: 3, cooldownMs: 45000 },
      )
      return res.data.data as OtpChallenge
    }

    const sessionId = `otp_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    const expiresAt = Date.now() + 5 * 60 * 1000
    const sessions = readDemoSessions()
    sessions[sessionId] = {
      otp: OTP_DEMO_CODE,
      expires_at: expiresAt,
      destination_masked: maskPhone(phone),
    }
    writeDemoSessions(sessions)

    return {
      session_id: sessionId,
      destination_masked: maskPhone(phone),
      expires_at: expiresAt,
      channel,
    }
  },

  async verifyOtp(sessionId: string, otp: string): Promise<OtpVerifyResult> {
    const mode = getOtpMode()

    if (mode === 'api') {
      const res = await runWithCircuitBreaker(
        'otp_verify',
        () =>
          executeWithRetry(() => api.post('/auth/otp/verify', { session_id: sessionId, otp }), {
            retries: 2,
            initialDelayMs: 250,
            shouldRetry(error) {
              const status = (error as { response?: { status?: number } })?.response?.status
              if (status === 400 || status === 401 || status === 422) return false
              return true
            },
          }),
        {
          threshold: 3,
          cooldownMs: 45000,
          shouldTrip(error) {
            const status = (error as { response?: { status?: number } })?.response?.status
            if (status === 400 || status === 401 || status === 422) return false
            return true
          },
        },
      )
      const d = res.data?.data
      if (!d?.verified) return { ok: false }
      return {
        ok: true,
        access_token: d.access_token as string,
        refresh_token: d.refresh_token as string,
        user: d.user as AuthUser,
      }
    }

    const sessions = readDemoSessions()
    const session = sessions[sessionId]
    if (!session) return { ok: false }
    if (Date.now() > session.expires_at) {
      delete sessions[sessionId]
      writeDemoSessions(sessions)
      return { ok: false }
    }

    const ok = otp.trim() === session.otp
    if (ok) {
      delete sessions[sessionId]
      writeDemoSessions(sessions)
    }
    return { ok }
  },

  async loginDirect(email: string, password: string): Promise<OtpVerifyResult> {
    const res = await runWithCircuitBreaker(
      'login_direct',
      () =>
        executeWithRetry(() => api.post('/auth/login', { email, password }), {
          retries: 2,
          initialDelayMs: 250,
          shouldRetry(error) {
            const status = (error as { response?: { status?: number } })?.response?.status
            if (status === 401 || status === 422) return false
            return true
          },
        }),
      {
        threshold: 3,
        cooldownMs: 45000,
        shouldTrip(error) {
          const status = (error as { response?: { status?: number } })?.response?.status
          if (status === 401 || status === 422) return false
          return true
        },
      },
    )
    const d = res.data?.data
    if (!d?.verified) return { ok: false }
    return {
      ok: true,
      access_token: d.access_token as string,
      refresh_token: d.refresh_token as string,
      user: d.user as AuthUser,
    }
  },
}

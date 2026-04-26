import { Router } from 'express'
import { otpSendLimiter, otpVerifyLimiter } from '../middleware/rateLimit'
import { validateBody } from '../middleware/validation'
import { loginSchema, otpSendSchema, otpVerifySchema, refreshTokenSchema, logoutSchema } from '../validation/schemas'
import { requireAuth } from '../middleware/auth'
import { sendOtp, verifyOtp } from '../services/otpService'
import { loginWithPassword } from '../services/authService'
import { buildSessionMetadata } from '../services/securityService'
import {
  listRefreshSessionsForUser,
  revokeAllRefreshTokensForUser,
  revokeRefreshSessionById,
  revokeRefreshToken,
  rotateRefreshToken,
} from '../services/refreshTokenService'

const router = Router()

router.get('/ping', (req, res) => res.json({ ping: 'pong' }))

router.post('/login', otpVerifyLimiter, validateBody(loginSchema), async (req, res) => {
  const body = req.body as { email: string; password: string }
  try {
    const result = await loginWithPassword(
      req.tenantDb!,
      body.email,
      body.password,
      req.tenantSlug || '',
      buildSessionMetadata(req),
    )
    if (!result.ok) {
      res.status(401).json({ error: { code: result.code, message: result.message } })
      return
    }
    res.json({ data: result.data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed'
    res.status(500).json({ error: { code: 'LOGIN_FAILED', message } })
  }
})

router.post('/otp/send', otpSendLimiter, validateBody(otpSendSchema), async (req, res) => {
  const body = req.body as { phone: string; purpose: 'login'; channel?: 'sms' | 'whatsapp' }
  const phone = body.phone.trim()
  const channel = body.channel === 'whatsapp' ? 'whatsapp' : 'sms'
  try {
    const data = await sendOtp(req.tenantDb!, phone, 'login', channel)
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send OTP'
    res.status(500).json({ error: { code: 'OTP_SEND_FAILED', message } })
  }
})

router.post('/otp/verify', otpVerifyLimiter, validateBody(otpVerifySchema), async (req, res) => {
  const body = req.body as { session_id: string; otp: string }
  const sessionId = body.session_id.trim()
  const otp = body.otp.trim()
  try {
    const result = await verifyOtp(req.tenantDb!, sessionId, otp, req.tenantSlug || '')
    if (!result.ok) {
      res.status(400).json({ error: { code: result.code, message: result.message } })
      return
    }
    res.json({ data: result.data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to verify OTP'
    res.status(500).json({ error: { code: 'OTP_VERIFY_FAILED', message } })
  }
})

router.post('/refresh', otpVerifyLimiter, validateBody(refreshTokenSchema), async (req, res) => {
  const body = req.body as { refresh_token: string }
  try {
    const result = await rotateRefreshToken(req.tenantDb!, body.refresh_token, buildSessionMetadata(req))
    if (!result.ok) {
      res.status(401).json({ error: { code: result.code, message: result.message } })
      return
    }
    res.json({ data: result.data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to refresh token'
    res.status(500).json({ error: { code: 'TOKEN_REFRESH_FAILED', message } })
  }
})

router.post('/logout', validateBody(logoutSchema), async (req, res) => {
  const body = req.body as { refresh_token: string }
  try {
    await revokeRefreshToken(req.tenantDb!, body.refresh_token)
    res.json({ data: { ok: true } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to logout'
    res.status(500).json({ error: { code: 'LOGOUT_FAILED', message } })
  }
})

router.post('/logout-all', requireAuth, async (req, res) => {
  try {
    const data = await revokeAllRefreshTokensForUser(req.tenantDb!, req.auth!.sub)
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to logout all sessions'
    res.status(500).json({ error: { code: 'LOGOUT_ALL_FAILED', message } })
  }
})

router.get('/sessions', requireAuth, async (req, res) => {
  try {
    const data = await listRefreshSessionsForUser(req.tenantDb!, req.auth!.sub)
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list sessions'
    res.status(500).json({ error: { code: 'SESSIONS_LIST_FAILED', message } })
  }
})

router.post('/sessions/:session_id/revoke', requireAuth, async (req, res) => {
  try {
    const result = await revokeRefreshSessionById(req.tenantDb!, req.auth!.sub, String(req.params.session_id || ''))
    if (!result.ok) {
      const status = result.code === 'INVALID_REQUEST' ? 400 : result.code === 'SESSION_NOT_FOUND' ? 404 : 409
      res.status(status).json({ error: { code: result.code, message: result.message } })
      return
    }
    res.json({ data: result.data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to revoke session'
    res.status(500).json({ error: { code: 'SESSION_REVOKE_FAILED', message } })
  }
})

export default router

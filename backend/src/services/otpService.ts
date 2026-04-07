import { randomInt } from 'node:crypto'
import { prisma } from '../db/prisma'
import { createAccessToken } from './authTokenService'
import { issueRefreshToken } from './refreshTokenService'
import { env } from '../config/env'

type AppRole = 'admin' | 'accountant' | 'teacher' | 'receptionist'

const OTP_TTL_MS = 5 * 60 * 1000
const MAX_ATTEMPTS = 5

function maskPhone(phone: string) {
  const trimmed = phone.replace(/\s+/g, '')
  if (trimmed.length <= 4) return trimmed
  return `${'*'.repeat(Math.max(0, trimmed.length - 4))}${trimmed.slice(-4)}`
}

function generateOtp(): string {
  return randomInt(100000, 999999).toString()
}

function mapUserByPhone(phone: string) {
  const last = phone.slice(-2)
  const role: AppRole = last === '01' ? 'admin' : last === '02' ? 'accountant' : last === '04' ? 'receptionist' : 'teacher'
  return {
    name: role === 'admin' ? 'Admin User' : role === 'accountant' ? 'Accountant User' : role === 'receptionist' ? 'Reception User' : 'Teacher User',
    role,
    email: `${role}@school.com`,
    phone,
    profile_photo_url: null,
  }
}

export async function sendOtp(phone: string, purpose: 'login' = 'login') {
  const sessionId = `otp_${Date.now()}_${randomInt(100, 999)}`
  const expiresAt = new Date(Date.now() + OTP_TTL_MS)
  const otp = generateOtp()

  await prisma.otpSession.create({
    data: {
      sessionId,
      purpose,
      phone,
      destinationMasked: maskPhone(phone),
      expiresAt,
      otpCode: otp,
    },
  })

  // In production: OTP would be sent via SMS — do NOT expose it in the response.
  // In non-production: return the OTP directly so the demo/dev flow works.
  const demo_otp = env.nodeEnv !== 'production' ? otp : undefined

  return {
    session_id: sessionId,
    destination_masked: maskPhone(phone),
    expires_at: expiresAt.getTime(),
    ...(demo_otp !== undefined ? { demo_otp } : {}),
  }
}

export async function verifyOtp(sessionId: string, otp: string) {
  const session = await prisma.otpSession.findUnique({ where: { sessionId } })
  if (!session) return { ok: false as const, code: 'INVALID_OTP', message: 'OTP is invalid or expired' }
  if (session.verifiedAt) return { ok: false as const, code: 'INVALID_OTP', message: 'OTP already used' }
  if (session.expiresAt.getTime() < Date.now()) return { ok: false as const, code: 'INVALID_OTP', message: 'OTP is invalid or expired' }
  if (session.attempts >= MAX_ATTEMPTS) return { ok: false as const, code: 'OTP_MAX_ATTEMPTS', message: 'Maximum verification attempts exceeded. Request a new OTP.' }

  // Increment attempts atomically before checking the code
  await prisma.otpSession.update({
    where: { sessionId },
    data: { attempts: { increment: 1 } },
  })

  const isValid = session.otpCode !== null && otp === session.otpCode
  if (!isValid) {
    return { ok: false as const, code: 'INVALID_OTP', message: 'OTP is invalid or expired' }
  }

  await prisma.otpSession.update({
    where: { sessionId },
    data: { verifiedAt: new Date() },
  })

  const user = mapUserByPhone(session.phone)
  const claims = {
    sub: `otp:${session.sessionId}`,
    name: user.name,
    role: user.role,
    email: user.email,
  }
  const accessToken = createAccessToken(claims)
  const refreshToken = await issueRefreshToken(claims)

  return {
    ok: true as const,
    data: {
      verified: true,
      token: accessToken,
      access_token: accessToken,
      refresh_token: refreshToken,
      user,
    },
  }
}

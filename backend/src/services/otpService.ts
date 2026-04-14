import { randomInt } from 'node:crypto'
import type { PrismaClient } from '@prisma/client'
import { createAccessToken } from './authTokenService'
import { issueRefreshToken } from './refreshTokenService'
import { env } from '../config/env'

type AppRole = 'admin' | 'accountant' | 'teacher' | 'receptionist' | 'superadmin'

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
  const role: AppRole =
    last === '00'
      ? 'superadmin'
      : last === '01'
        ? 'admin'
        : last === '02'
          ? 'accountant'
          : last === '04'
            ? 'receptionist'
            : 'teacher'
  return {
    name:
      role === 'superadmin'
        ? 'Platform Operator'
        : role === 'admin'
          ? 'Admin User'
          : role === 'accountant'
            ? 'Accountant User'
            : role === 'receptionist'
              ? 'Reception User'
              : 'Teacher User',
    role,
    email: `${role}@school.com`,
    phone,
    profile_photo_url: null,
  }
}

export async function sendOtp(
  db: PrismaClient,
  phone: string,
  purpose: 'login' = 'login',
  channel: 'sms' | 'whatsapp' = 'sms',
) {
  const sessionId = `otp_${Date.now()}_${randomInt(100, 999)}`
  const expiresAt = new Date(Date.now() + OTP_TTL_MS)
  const otp = generateOtp()

  await db.otpSession.create({
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
    channel,
    ...(demo_otp !== undefined ? { demo_otp } : {}),
  }
}

export async function verifyOtp(db: PrismaClient, sessionId: string, otp: string, tenantSlug: string) {
  const session = await db.otpSession.findUnique({ where: { sessionId } })
  if (!session) return { ok: false as const, code: 'INVALID_OTP', message: 'OTP is invalid or expired' }
  if (session.verifiedAt) return { ok: false as const, code: 'INVALID_OTP', message: 'OTP already used' }
  if (session.expiresAt.getTime() < Date.now())
    return { ok: false as const, code: 'INVALID_OTP', message: 'OTP is invalid or expired' }
  if (session.attempts >= MAX_ATTEMPTS)
    return {
      ok: false as const,
      code: 'OTP_MAX_ATTEMPTS',
      message: 'Maximum verification attempts exceeded. Request a new OTP.',
    }

  // Increment attempts atomically before checking the code
  await db.otpSession.update({
    where: { sessionId },
    data: { attempts: { increment: 1 } },
  })

  const isValid = session.otpCode !== null && otp === session.otpCode
  if (!isValid) {
    return { ok: false as const, code: 'INVALID_OTP', message: 'OTP is invalid or expired' }
  }

  await db.otpSession.update({
    where: { sessionId },
    data: { verifiedAt: new Date() },
  })

  let user = mapUserByPhone(session.phone)
  let isRoot = false

  // Priority 1: Check if this phone exists in the Platform Team (SuperAdmins)
  try {
    const realSuperAdmin = await (db as any).superAdmin.findUnique({
      where: { phone: session.phone },
    })
    if (realSuperAdmin) {
      user = {
        name: realSuperAdmin.name,
        role: 'superadmin',
        email: realSuperAdmin.email,
        phone: session.phone,
        profile_photo_url: null,
      }
      isRoot = realSuperAdmin.isRoot
    }
  } catch (err) {
    console.error('SuperAdmin lookup error (ignoring for tenant flow):', err)
  }

  const claims = {
    sub: `otp:${session.sessionId}`,
    name: user.name,
    role: user.role,
    email: user.email,
    tenantSlug,
    isRoot,
  }
  const accessToken = createAccessToken(claims)
  const refreshToken = await issueRefreshToken(db, claims)

  return {
    ok: true as const,
    data: {
      verified: true,
      token: accessToken,
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        ...user,
        tenant_slug: tenantSlug,
      },
    },
  }
}

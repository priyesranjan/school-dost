import { createHash } from 'node:crypto'
import { Prisma } from '@prisma/client'
import { prisma } from '../db/prisma'
import { createAccessToken, createRefreshToken, type AuthClaims, verifyRefreshToken } from './authTokenService'
import { env } from '../config/env'

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export async function issueRefreshToken(claims: AuthClaims) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const token = createRefreshToken(claims)
    try {
      await prisma.refreshToken.create({
        data: {
          tokenHash: hashToken(token),
          userSub: claims.sub,
          name: claims.name,
          role: claims.role,
          email: claims.email,
          expiresAt,
        },
      })
      return token
    } catch (error) {
      const isUniqueViolation =
        error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
      if (!isUniqueViolation || attempt === 2) {
        throw error
      }
    }
  }

  throw new Error('Failed to issue refresh token')
}

export async function rotateRefreshToken(refreshToken: string) {
  const decoded = verifyRefreshToken(refreshToken)
  if (decoded.token_type !== 'refresh') {
    return { ok: false as const, code: 'INVALID_REFRESH_TOKEN', message: 'Invalid refresh token type' }
  }

  const tokenHash = hashToken(refreshToken)
  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } })
  if (!stored) {
    return { ok: false as const, code: 'INVALID_REFRESH_TOKEN', message: 'Refresh token is invalid or expired' }
  }

  if (stored.revokedAt) {
    await revokeAllRefreshTokensForUser(stored.userSub)
    return {
      ok: false as const,
      code: 'TOKEN_REUSE_DETECTED',
      message: 'Refresh token reuse detected; all active sessions were revoked',
    }
  }

  if (stored.expiresAt.getTime() < Date.now()) {
    return { ok: false as const, code: 'INVALID_REFRESH_TOKEN', message: 'Refresh token is invalid or expired' }
  }

  await prisma.refreshToken.update({
    where: { tokenHash },
    data: { revokedAt: new Date() },
  })

  const claims: AuthClaims = {
    sub: decoded.sub,
    name: decoded.name,
    role: decoded.role,
    email: decoded.email,
  }

  const access_token = createAccessToken(claims)
  const refresh_token = await issueRefreshToken(claims)

  return {
    ok: true as const,
    data: {
      access_token,
      refresh_token,
    },
  }
}

export async function revokeRefreshToken(refreshToken: string) {
  const tokenHash = hashToken(refreshToken)
  await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  })
}

export async function revokeAllRefreshTokensForUser(userSub: string) {
  const result = await prisma.refreshToken.updateMany({
    where: { userSub, revokedAt: null },
    data: { revokedAt: new Date() },
  })

  return { revoked_count: result.count }
}

export async function listRefreshSessionsForUser(userSub: string) {
  const rows = await prisma.refreshToken.findMany({
    where: { userSub },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      role: true,
      email: true,
      createdAt: true,
      expiresAt: true,
      revokedAt: true,
    },
  })

  return {
    sessions: rows.map((row: any) => ({
      id: String(row.id),
      name: row.name,
      role: row.role,
      email: row.email,
      created_at: row.createdAt.toISOString(),
      expires_at: row.expiresAt.toISOString(),
      revoked_at: row.revokedAt ? row.revokedAt.toISOString() : null,
      is_active: !row.revokedAt && row.expiresAt.getTime() >= Date.now(),
    })),
  }
}

export async function revokeRefreshSessionById(userSub: string, sessionId: string) {
  let id: bigint
  try {
    id = BigInt(sessionId)
  } catch {
    return { ok: false as const, code: 'INVALID_REQUEST', message: 'session_id must be a valid integer id' }
  }

  const row = await prisma.refreshToken.findFirst({ where: { id, userSub } })
  if (!row) {
    return { ok: false as const, code: 'SESSION_NOT_FOUND', message: 'Session not found for current user' }
  }

  if (row.revokedAt) {
    return { ok: true as const, data: { revoked: false, already_revoked: true, session_id: String(row.id) } }
  }

  await prisma.refreshToken.update({
    where: { id },
    data: { revokedAt: new Date() },
  })

  return { ok: true as const, data: { revoked: true, already_revoked: false, session_id: String(row.id) } }
}

export async function cleanupRefreshTokens() {
  const now = new Date()
  const retentionDays = Number.isFinite(env.refreshRevokedRetentionDays)
    ? env.refreshRevokedRetentionDays
    : 30
  const revokedBefore = new Date(now.getTime() - retentionDays * 24 * 60 * 60 * 1000)

  const result = await prisma.refreshToken.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: now } },
        {
          revokedAt: {
            not: null,
            lt: revokedBefore,
          },
        },
      ],
    },
  })

  return {
    deleted_count: result.count,
    retention_days: retentionDays,
  }
}

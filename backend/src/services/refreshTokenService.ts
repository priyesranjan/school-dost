import { createHash } from 'node:crypto'
import { Prisma, type PrismaClient } from '@prisma/client'
import { createAccessToken, createRefreshToken, type AuthClaims, verifyRefreshToken } from './authTokenService'
import { env } from '../config/env'
import { getSecurityPolicyEnforcement } from './securityService'

type SessionMetadata = {
  session_id?: string | null
  user_agent?: string | null
  ip_address?: string | null
}

type RefreshSessionRow = {
  id: bigint
  name: string
  role: string
  email: string
  createdAt: Date
  expiresAt: Date
  revokedAt: Date | null
  sessionId?: string | null
  userAgent?: string | null
  ipAddress?: string | null
  lastSeenAt?: Date | null
}

function isMissingColumnError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === 'P2022'
  }
  const message = error instanceof Error ? error.message : String(error)
  return /column .* does not exist|unknown argument/i.test(message)
}

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export async function issueRefreshToken(db: PrismaClient, claims: AuthClaims, metadata?: SessionMetadata) {
  let timeoutHours = 7 * 24
  try {
    const policy = await getSecurityPolicyEnforcement(db)
    const sessionTimeoutHours = Number((policy as Record<string, unknown> | null)?.session_timeout_hours)
    if (Number.isFinite(sessionTimeoutHours) && sessionTimeoutHours > 0) {
      timeoutHours = sessionTimeoutHours
    }
  } catch {}
  const expiresAt = new Date(Date.now() + timeoutHours * 60 * 60 * 1000)

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const token = createRefreshToken(claims)
    try {
      try {
        await db.refreshToken.create({
          data: {
            tokenHash: hashToken(token),
            userSub: claims.sub,
            name: claims.name,
            role: claims.role,
            email: claims.email,
            sessionId: metadata?.session_id || null,
            userAgent: metadata?.user_agent || null,
            ipAddress: metadata?.ip_address || null,
            lastSeenAt: new Date(),
            expiresAt,
          },
        })
      } catch (error) {
        // Backward compatibility for deployments still on old RefreshToken schema.
        if (!isMissingColumnError(error)) throw error
        await db.refreshToken.create({
          data: {
            tokenHash: hashToken(token),
            userSub: claims.sub,
            name: claims.name,
            role: claims.role,
            email: claims.email,
            expiresAt,
          },
        })
      }
      return token
    } catch (error) {
      const isUniqueViolation = error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
      if (!isUniqueViolation || attempt === 2) {
        throw error
      }
    }
  }

  throw new Error('Failed to issue refresh token')
}

export async function rotateRefreshToken(db: PrismaClient, refreshToken: string, metadata?: SessionMetadata) {
  const decoded = verifyRefreshToken(refreshToken)
  if (decoded.token_type !== 'refresh') {
    return { ok: false as const, code: 'INVALID_REFRESH_TOKEN', message: 'Invalid refresh token type' }
  }

  const tokenHash = hashToken(refreshToken)
  const stored = await db.refreshToken.findUnique({ where: { tokenHash } })
  if (!stored) {
    return { ok: false as const, code: 'INVALID_REFRESH_TOKEN', message: 'Refresh token is invalid or expired' }
  }

  if (stored.revokedAt) {
    await revokeAllRefreshTokensForUser(db, stored.userSub)
    return {
      ok: false as const,
      code: 'TOKEN_REUSE_DETECTED',
      message: 'Refresh token reuse detected; all active sessions were revoked',
    }
  }

  if (stored.expiresAt.getTime() < Date.now()) {
    return { ok: false as const, code: 'INVALID_REFRESH_TOKEN', message: 'Refresh token is invalid or expired' }
  }

  try {
    await db.refreshToken.update({
      where: { tokenHash },
      data: {
        revokedAt: new Date(),
        lastSeenAt: new Date(),
        userAgent: metadata?.user_agent || stored.userAgent || null,
        ipAddress: metadata?.ip_address || stored.ipAddress || null,
      },
    })
  } catch (error) {
    if (!isMissingColumnError(error)) throw error
    await db.refreshToken.update({
      where: { tokenHash },
      data: { revokedAt: new Date() },
    })
  }

  const claims: AuthClaims = {
    sub: decoded.sub,
    name: decoded.name,
    role: decoded.role,
    email: decoded.email,
    tenantSlug: decoded.tenantSlug,
    tenantId: decoded.tenantId,
    isRoot: Boolean(decoded.isRoot),
  }

  const access_token = createAccessToken(claims)
  const refresh_token = await issueRefreshToken(db, claims, {
    session_id: stored.sessionId || metadata?.session_id || null,
    user_agent: metadata?.user_agent || stored.userAgent || null,
    ip_address: metadata?.ip_address || stored.ipAddress || null,
  })

  return {
    ok: true as const,
    data: {
      access_token,
      refresh_token,
    },
  }
}

export async function revokeRefreshToken(db: PrismaClient, refreshToken: string) {
  const tokenHash = hashToken(refreshToken)
  await db.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  })
}

export async function revokeAllRefreshTokensForUser(db: PrismaClient, userSub: string) {
  const result = await db.refreshToken.updateMany({
    where: { userSub, revokedAt: null },
    data: { revokedAt: new Date() },
  })

  return { revoked_count: result.count }
}

export async function listRefreshSessionsForUser(db: PrismaClient, userSub: string) {
  let rows: RefreshSessionRow[] = []
  try {
    rows = await db.refreshToken.findMany({
      where: { userSub },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        role: true,
        email: true,
        sessionId: true,
        userAgent: true,
        ipAddress: true,
        lastSeenAt: true,
        createdAt: true,
        expiresAt: true,
        revokedAt: true,
      },
    })
  } catch (error) {
    if (!isMissingColumnError(error)) throw error
    rows = await db.refreshToken.findMany({
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
  }

  return {
    sessions: rows.map((row) => ({
      id: String(row.id),
      name: row.name,
      role: row.role,
      email: row.email,
      session_id: row.sessionId ?? null,
      user_agent: row.userAgent ?? null,
      ip_address: row.ipAddress ?? null,
      last_seen_at: row.lastSeenAt ? row.lastSeenAt.toISOString() : null,
      created_at: row.createdAt.toISOString(),
      expires_at: row.expiresAt.toISOString(),
      revoked_at: row.revokedAt ? row.revokedAt.toISOString() : null,
      is_active: !row.revokedAt && row.expiresAt.getTime() >= Date.now(),
    })),
  }
}

export async function revokeRefreshSessionById(db: PrismaClient, userSub: string, sessionId: string) {
  let id: bigint
  try {
    id = BigInt(sessionId)
  } catch {
    return { ok: false as const, code: 'INVALID_REQUEST', message: 'session_id must be a valid integer id' }
  }

  const row = await db.refreshToken.findFirst({ where: { id, userSub } })
  if (!row) {
    return { ok: false as const, code: 'SESSION_NOT_FOUND', message: 'Session not found for current user' }
  }

  if (row.revokedAt) {
    return { ok: true as const, data: { revoked: false, already_revoked: true, session_id: String(row.id) } }
  }

  await db.refreshToken.update({
    where: { id },
    data: { revokedAt: new Date() },
  })

  return { ok: true as const, data: { revoked: true, already_revoked: false, session_id: String(row.id) } }
}

export async function cleanupRefreshTokens(db: PrismaClient) {
  const now = new Date()
  const retentionDays = Number.isFinite(env.refreshRevokedRetentionDays) ? env.refreshRevokedRetentionDays : 30
  const revokedBefore = new Date(now.getTime() - retentionDays * 24 * 60 * 60 * 1000)

  const result = await db.refreshToken.deleteMany({
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

import jwt from 'jsonwebtoken'
import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { env } from '../config/env'

export type AppRole = 'admin' | 'accountant' | 'teacher' | 'receptionist' | 'hod' | 'parent' | 'student' | 'superadmin'

export type AuthClaims = {
  sub: string
  name: string
  role: AppRole
  email: string
  /** Tenant slug — e.g. "dps-delhi". Empty string for superadmin (platform-level). */
  tenantSlug: string
  tenantId?: string
  isRoot: boolean
}

type RefreshClaims = AuthClaims & { token_type: 'refresh' }

export function createAccessToken(payload: AuthClaims) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'] })
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.jwtSecret) as AuthClaims
}

export function createRefreshToken(payload: AuthClaims) {
  return jwt.sign({ ...payload, token_type: 'refresh' as const, jti: randomUUID() }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn as jwt.SignOptions['expiresIn'],
  })
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.jwtRefreshSecret) as RefreshClaims
}

// Backward compatible aliases for existing call-sites.
export const createAuthToken = createAccessToken
export const verifyAuthToken = verifyAccessToken

/** Hash a plain-text password (used during tenant seeding) */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12)
}

/** Verify a plain-text password against a stored hash */
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}

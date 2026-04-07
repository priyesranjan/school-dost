import jwt from 'jsonwebtoken'
import { randomUUID } from 'node:crypto'
import { env } from '../config/env'

export type AppRole = 'admin' | 'accountant' | 'teacher' | 'receptionist'

export type AuthClaims = {
  sub: string
  name: string
  role: AppRole
  email: string
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

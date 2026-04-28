import type { PrismaClient } from '@prisma/client'
import { verifyPassword, createAccessToken } from './authTokenService'
import { issueRefreshToken } from './refreshTokenService'
import { getOrCreateSecurityPolicy } from './securityService'

export async function loginWithPassword(
  db: PrismaClient,
  email: string,
  password: string,
  tenantSlug: string,
  tenantId?: string,
  sessionMeta?: { session_id?: string | null; user_agent?: string | null; ip_address?: string | null },
) {
  // 1. Try SuperAdmin lookup (Platform level)
  try {
    const superAdmin = await (db as any).superAdmin.findUnique({ where: { email } })
    if (superAdmin && superAdmin.isActive) {
      const isValid = await verifyPassword(password, superAdmin.passwordHash)
      if (isValid) {
        const claims = {
          sub: `superadmin:${superAdmin.id}`,
          name: superAdmin.name,
          role: 'superadmin' as const,
          email: superAdmin.email,
          tenantSlug: '',
          isRoot: superAdmin.isRoot,
        }
        const accessToken = createAccessToken(claims)
        const refreshToken = await issueRefreshToken(db, claims, sessionMeta)
        return {
          ok: true as const,
          data: {
            verified: true,
            token: accessToken,
            access_token: accessToken,
            refresh_token: refreshToken,
            user: {
              name: superAdmin.name,
              role: 'superadmin',
              email: superAdmin.email,
              phone: superAdmin.phone,
              tenant_slug: '',
            },
          },
        }
      }
    }
  } catch (err) {
    // SuperAdmin table might not exist in tenant DB if they used separate DBs, 
    // but in consolidated mode it will be there.
  }

  if (!tenantSlug) {
    return { ok: false as const, code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
  }

  // 2. Try User lookup (Tenant level)
  const user = await db.user.findUnique({ where: { email } })
  if (!user || user.status !== 'active' || !user.passwordHash) {
    return { ok: false as const, code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
  }

  try {
    const policy = await getOrCreateSecurityPolicy(db)
    if (policy.two_factor_required_admins && user.role === 'admin') {
      return { ok: false as const, code: 'TWO_FACTOR_REQUIRED', message: 'Admin accounts must use OTP login under current security policy' }
    }
  } catch {}

  const isValid = await verifyPassword(password, user.passwordHash)
  if (!isValid) {
    return { ok: false as const, code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
  }

  // Update last login
  await db.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  })

  const claims = {
    sub: `user:${user.id}`,
    name: user.name,
    role: user.role as any,
    email: user.email,
    tenantSlug,
    tenantId,
    isRoot: false,
  }

  const accessToken = createAccessToken(claims)
  const refreshToken = await issueRefreshToken(db, claims, sessionMeta)

  return {
    ok: true as const,
    data: {
      verified: true,
      token: accessToken,
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        name: user.name,
        role: user.role,
        email: user.email,
        phone: user.phone,
        tenant_id: tenantId,
        tenant_slug: tenantSlug,
      },
    },
  }
}

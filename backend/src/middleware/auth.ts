import type { NextFunction, Request, Response } from 'express'
import { verifyAuthToken, type AppRole, type AuthClaims } from '../services/authTokenService'
import { extractClientIp, getSecurityPolicyEnforcement } from '../services/securityService'

declare global {
  namespace Express {
    interface Request {
      auth?: AuthClaims
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = String(req.headers.authorization || '')
  if (!authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Missing bearer token',
      },
    })
    return
  }

  const token = authHeader.slice(7).trim()
  try {
    req.auth = verifyAuthToken(token)
    try {
      if (req.tenantDb && req.tenantSlug && req.auth.role !== 'superadmin') {
        const policy = await getSecurityPolicyEnforcement(req.tenantDb)
        if (policy.enforce_ip_allowlist && policy.ip_allowlist.length) {
          const clientIp = extractClientIp(req)
          if (!policy.ip_allowlist.includes(clientIp)) {
            res.status(403).json({
              error: {
                code: 'IP_NOT_ALLOWED',
                message: 'This network location is not allowed by the institution security policy',
              },
            })
            return
          }
        }
      }
    } catch {
      // Security policy is advisory unless the tenant schema and policy table are available.
    }
    next()
  } catch {
    res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token',
      },
    })
  }
}

export function requireRole(roles: AppRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Missing auth context',
        },
      })
      return
    }

    if (!roles.includes(req.auth.role)) {
      res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient role permission',
        },
      })
      return
    }

    next()
  }
}

export function requireRoot(req: Request, res: Response, next: NextFunction) {
  if (!req.auth) {
    res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Missing auth context' },
    })
    return
  }

  if (!req.auth.isRoot) {
    res.status(403).json({
      error: {
        code: 'ROOT_REQUIRED',
        message: 'This operation requires Master SuperAdmin status.',
      },
    })
    return
  }

  next()
}

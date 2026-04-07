import type { NextFunction, Request, Response } from 'express'
import { verifyAuthToken, type AppRole, type AuthClaims } from '../services/authTokenService'

declare global {
  namespace Express {
    interface Request {
      auth?: AuthClaims
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
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

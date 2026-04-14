import type { NextFunction, Request, Response } from 'express'
import type { ZodTypeAny } from 'zod'

export function validateBody(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only validate body for methods that typically have one
    if (req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'PATCH') {
      return next()
    }

    const parsed = schema.safeParse(req.body)
    if (!parsed.success) {
      const issues = parsed.error.issues.map((x) => x.message).join('; ')
      res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: issues || 'Invalid request body',
        },
      })
      return
    }
    req.body = parsed.data
    next()
  }
}

export function validateQuery(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query)
    if (!parsed.success) {
      const issues = parsed.error.issues.map((x) => x.message).join('; ')
      res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: issues || 'Invalid query parameters',
        },
      })
      return
    }
    req.query = parsed.data as Request['query']
    next()
  }
}

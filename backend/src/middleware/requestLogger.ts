import { randomUUID } from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const requestId = randomUUID()
  const start = Date.now()

  res.setHeader('X-Request-Id', requestId)

  res.on('finish', () => {
    const durationMs = Date.now() - start
    const log = {
      level: res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info',
      request_id: requestId,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration_ms: durationMs,
      ts: new Date().toISOString(),
    }
    console.log(JSON.stringify(log))
  })

  next()
}

import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { writeActionLimiter } from '../middleware/rateLimit'
import { validateBody } from '../middleware/validation'
import { auditSignSchema } from '../validation/schemas'
import { appendAuditLog, listAuditLogs, verifyAuditIntegrity } from '../services/auditLogService'
import { signAuditPayload } from '../services/auditSignService'

function parsePage(value: unknown, fallback: number) {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback
}
function parsePerPage(value: unknown, fallback: number) {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return fallback
  return Math.min(100, Math.floor(n))
}

const router = Router()

router.get('/logs', requireAuth, async (req, res) => {
  try {
    const data = await listAuditLogs(req.tenantDb!, {
      page: parsePage(req.query.page, 1),
      per_page: parsePerPage(req.query.per_page, 50),
      module: req.query.module ? String(req.query.module) : undefined,
      action: req.query.action ? String(req.query.action) : undefined,
      role: req.auth!.role,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list audit logs'
    res.status(500).json({ error: { code: 'AUDIT_LOG_LIST_FAILED', message } })
  }
})

router.get('/verify', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const data = await verifyAuditIntegrity(req.tenantDb!)
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to verify audit integrity'
    res.status(500).json({ error: { code: 'AUDIT_VERIFY_FAILED', message } })
  }
})

router.post(
  '/sign',
  requireAuth,
  requireRole(['admin']),
  writeActionLimiter,
  validateBody(auditSignSchema),
  (req, res) => {
    const safePayload = req.body as {
      id: number
      action: string
      module: string
      actor_name: string
      actor_role: string
      target: string
      metadata: string
      created_at: string
      prev_hash: string
      signature_version: number
    }
    const hash = signAuditPayload(safePayload)
    res.json({ data: { hash } })
  },
)

export default router

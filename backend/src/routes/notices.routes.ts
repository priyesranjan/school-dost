import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { writeActionLimiter } from '../middleware/rateLimit'
import { validateBody } from '../middleware/validation'
import { noticeCreateSchema } from '../validation/schemas'
import { createNotice, listNotices } from '../services/noticesService'
import { appendAuditLog } from '../services/auditLogService'

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

router.get('/', requireAuth, requireRole(['superadmin', 'admin', 'hod', 'teacher', 'receptionist', 'parent', 'student']), async (req, res) => {
  try {
    const data = await listNotices(req.tenantDb!, {
      page: parsePage(req.query.page, 1),
      per_page: parsePerPage(req.query.per_page, 20),
      status: req.query.status
        ? (String(req.query.status) as 'draft' | 'approved' | 'scheduled' | 'published' | 'rejected')
        : undefined,
      audience: req.query.audience ? (String(req.query.audience) as 'all' | 'class') : undefined,
      class_name: req.query.class_name ? String(req.query.class_name) : undefined,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list notices'
    res.status(500).json({ error: { code: 'NOTICE_LIST_FAILED', message } })
  }
})

router.post(
  '/',
  requireAuth,
  requireRole(['admin', 'teacher', 'hod', 'receptionist']),
  writeActionLimiter,
  validateBody(noticeCreateSchema),
  async (req, res) => {
    const body = req.body as {
      title: string
      message: string
      audience: 'all' | 'class'
      class_name?: string | null
      send_sms?: boolean
    }
    try {
      const data = await createNotice(req.tenantDb!, {
        title: body.title.trim(),
        message: body.message.trim(),
        audience: body.audience,
        class_name: body.class_name ? body.class_name.trim() : null,
        send_sms: Boolean(body.send_sms),
      })
      await appendAuditLog(req.tenantDb!, {
        action: 'notice_created',
        module: 'notices',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: data.title,
        metadata: `audience=${data.audience}${data.class_name ? ` class=${data.class_name}` : ''}`,
      })
      res.json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create notice'
      res.status(500).json({ error: { code: 'NOTICE_CREATE_FAILED', message } })
    }
  },
)

export default router

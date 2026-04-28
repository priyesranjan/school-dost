import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { writeActionLimiter } from '../middleware/rateLimit'
import { validateBody } from '../middleware/validation'
import { calendarEventCreateSchema } from '../validation/schemas'
import { createCalendarEvent, listCalendarEvents, deleteCalendarEvent } from '../services/calendarService'
import { appendAuditLog } from '../services/auditLogService'

function parsePage(v: unknown, fb: number) {
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fb
}
function parsePerPage(v: unknown, fb: number) {
  const n = Number(v)
  if (!Number.isFinite(n) || n <= 0) return fb
  return Math.min(200, Math.floor(n))
}

const router = Router()

router.get('/', requireAuth, requireRole(['superadmin', 'admin', 'hod', 'teacher', 'receptionist', 'parent', 'student']), async (req, res) => {
  try {
    const data = await listCalendarEvents(req.tenantDb!, {
      page: parsePage(req.query.page, 1),
      per_page: parsePerPage(req.query.per_page, 100),
      type: req.query.type ? (String(req.query.type) as any) : undefined,
      from: req.query.from ? String(req.query.from) : undefined,
      to: req.query.to ? String(req.query.to) : undefined,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list calendar events'
    res.status(500).json({ error: { code: 'CALENDAR_LIST_FAILED', message } })
  }
})

router.post(
  '/',
  requireAuth,
  requireRole(['admin']),
  writeActionLimiter,
  validateBody(calendarEventCreateSchema),
  async (req, res) => {
    const body = req.body as {
      title: string
      date: string
      end_date?: string | null
      type: string
      description?: string | null
    }
    try {
      const data = await createCalendarEvent(req.tenantDb!, { ...(body as any), title: body.title.trim() })
      await appendAuditLog(req.tenantDb!, {
        action: 'calendar_event_created',
        module: 'settings',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: data.title,
        metadata: `date=${data.date} type=${data.type}`,
      })
      res.json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create calendar event'
      res.status(500).json({ error: { code: 'CALENDAR_CREATE_FAILED', message } })
    }
  },
)

router.delete('/:id', requireAuth, requireRole(['admin']), writeActionLimiter, async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isFinite(id) || id <= 0) {
    res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Invalid event id' } })
    return
  }
  try {
    await deleteCalendarEvent(req.tenantDb!, id)
    await appendAuditLog(req.tenantDb!, {
      action: 'calendar_event_deleted',
      module: 'settings',
      actor_name: req.auth?.name || 'Unknown',
      actor_role: req.auth?.role || 'unknown',
      target: `event_id=${id}`,
      metadata: '',
    })
    res.json({ data: { deleted: true } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete calendar event'
    res.status(500).json({ error: { code: 'CALENDAR_DELETE_FAILED', message } })
  }
})

export default router

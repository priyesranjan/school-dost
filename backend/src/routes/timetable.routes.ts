import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { writeActionLimiter } from '../middleware/rateLimit'
import { validateBody } from '../middleware/validation'
import { timetableCreateSchema } from '../validation/schemas'
import { createTimetableEntry, listTimetableEntries } from '../services/timetableService'
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

router.get('/entries', requireAuth, async (req, res) => {
  try {
    const data = await listTimetableEntries({
      page: parsePage(req.query.page, 1),
      per_page: parsePerPage(req.query.per_page, 50),
      class_name: req.query.class_name ? String(req.query.class_name) : undefined,
      day: req.query.day ? (String(req.query.day) as 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday') : undefined,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list timetable entries'
    res.status(500).json({ error: { code: 'TIMETABLE_LIST_FAILED', message } })
  }
})

router.post('/entries', requireAuth, requireRole(['admin', 'teacher']), writeActionLimiter, validateBody(timetableCreateSchema), async (req, res) => {
  const body = req.body as {
    class_name: string; day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'
    period: string; subject: string; teacher: string; start_time: string; end_time: string; send_sms?: boolean
  }
  try {
    const result = await createTimetableEntry({
      class_name: body.class_name.trim(), day: body.day, period: body.period.trim(),
      subject: body.subject.trim(), teacher: body.teacher.trim(),
      start_time: body.start_time.trim(), end_time: body.end_time.trim(),
      send_sms: Boolean(body.send_sms),
    })
    if (!result.ok) {
      res.status(409).json({ error: { code: result.code, message: result.message } })
      return
    }
    await appendAuditLog({
      action: 'timetable_entry_created', module: 'timetable',
      actor_name: req.auth?.name || 'Unknown', actor_role: req.auth?.role || 'unknown',
      target: `${result.data.class_name} ${result.data.day} ${result.data.period}`,
      metadata: `${result.data.subject} by ${result.data.teacher}`,
    })
    res.json({ data: result.data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create timetable entry'
    res.status(500).json({ error: { code: 'TIMETABLE_CREATE_FAILED', message } })
  }
})

export default router

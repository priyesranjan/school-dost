import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { writeActionLimiter } from '../middleware/rateLimit'
import { validateBody } from '../middleware/validation'
import { attendanceCreateSchema, attendanceBulkCreateSchema } from '../validation/schemas'
import { createAttendance, listAttendance, bulkCreateAttendance } from '../services/attendanceService'
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

router.get('/', requireAuth, async (req, res) => {
  try {
    const data = await listAttendance({
      page: parsePage(req.query.page, 1),
      per_page: parsePerPage(req.query.per_page, 20),
      student_id: req.query.student_id ? Number(req.query.student_id) : undefined,
      date: req.query.date ? String(req.query.date) : undefined,
      status: req.query.status ? (String(req.query.status) as 'present' | 'absent' | 'late') : undefined,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list attendance records'
    res.status(500).json({ error: { code: 'ATTENDANCE_LIST_FAILED', message } })
  }
})

router.post('/', requireAuth, requireRole(['admin', 'teacher']), writeActionLimiter, validateBody(attendanceCreateSchema), async (req, res) => {
  const body = req.body as { student_id: number; date: string; status: 'present' | 'absent' | 'late' }
  try {
    const result = await createAttendance({ student_id: body.student_id, date: body.date.trim(), status: body.status })
    if (!result.ok) {
      res.status(409).json({ error: { code: result.code, message: result.message } })
      return
    }
    await appendAuditLog({
      action: 'attendance_recorded', module: 'students',
      actor_name: req.auth?.name || 'Unknown', actor_role: req.auth?.role || 'unknown',
      target: `student_id=${result.data.student_id}`,
      metadata: `date=${result.data.date} status=${result.data.status}`,
    })
    res.json({ data: result.data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create attendance record'
    res.status(500).json({ error: { code: 'ATTENDANCE_CREATE_FAILED', message } })
  }
})

router.post('/bulk', requireAuth, requireRole(['admin', 'teacher']), writeActionLimiter, validateBody(attendanceBulkCreateSchema), async (req, res) => {
  const body = req.body as { records: { student_id: number; date: string; status: 'present' | 'absent' | 'late' }[] }
  try {
    const data = await bulkCreateAttendance(body.records)
    await appendAuditLog({
      action: 'attendance_bulk_recorded', module: 'students',
      actor_name: req.auth?.name || 'Unknown', actor_role: req.auth?.role || 'unknown',
      target: `bulk count=${data.total}`,
      metadata: `saved=${data.saved} date=${body.records[0]?.date || 'unknown'}`,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to bulk record attendance'
    res.status(500).json({ error: { code: 'ATTENDANCE_BULK_FAILED', message } })
  }
})

export default router

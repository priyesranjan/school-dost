import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { writeActionLimiter } from '../middleware/rateLimit'
import { validateBody } from '../middleware/validation'
import { examCreateSchema, examResultUpsertSchema } from '../validation/schemas'
import { createExam, listExams, deleteExam, upsertExamResult, listExamResults } from '../services/examService'
import { appendAuditLog } from '../services/auditLogService'

function parsePage(v: unknown, fb: number) {
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fb
}
function parsePerPage(v: unknown, fb: number) {
  const n = Number(v)
  if (!Number.isFinite(n) || n <= 0) return fb
  return Math.min(100, Math.floor(n))
}

const router = Router()

router.get('/', requireAuth, async (req, res) => {
  try {
    const data = await listExams(req.tenantDb!, {
      page: parsePage(req.query.page, 1),
      per_page: parsePerPage(req.query.per_page, 50),
      class_name: req.query.class_name ? String(req.query.class_name) : undefined,
      academic_year: req.query.academic_year ? String(req.query.academic_year) : undefined,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list exams'
    res.status(500).json({ error: { code: 'EXAM_LIST_FAILED', message } })
  }
})

router.post(
  '/',
  requireAuth,
  requireRole(['admin', 'teacher']),
  writeActionLimiter,
  validateBody(examCreateSchema),
  async (req, res) => {
    const body = req.body as {
      name: string
      class_name: string
      subject: string
      date: string
      max_marks: number
      academic_year: string
    }
    try {
      const data = await createExam(req.tenantDb!, {
        ...body,
        name: body.name.trim(),
        class_name: body.class_name.trim(),
        subject: body.subject.trim(),
        academic_year: body.academic_year.trim(),
      })
      await appendAuditLog(req.tenantDb!, {
        action: 'exam_created',
        module: 'fees',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: data.name,
        metadata: `class=${data.class_name} subject=${data.subject}`,
      })
      res.json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create exam'
      res.status(500).json({ error: { code: 'EXAM_CREATE_FAILED', message } })
    }
  },
)

router.delete('/:id', requireAuth, requireRole(['admin']), writeActionLimiter, async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isFinite(id) || id <= 0) {
    res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Invalid exam id' } })
    return
  }
  try {
    await deleteExam(req.tenantDb!, id)
    await appendAuditLog(req.tenantDb!, {
      action: 'exam_deleted',
      module: 'fees',
      actor_name: req.auth?.name || 'Unknown',
      actor_role: req.auth?.role || 'unknown',
      target: `exam_id=${id}`,
      metadata: '',
    })
    res.json({ data: { deleted: true } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete exam'
    res.status(500).json({ error: { code: 'EXAM_DELETE_FAILED', message } })
  }
})

router.get('/:id/results', requireAuth, async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isFinite(id) || id <= 0) {
    res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Invalid exam id' } })
    return
  }
  try {
    const results = await listExamResults(req.tenantDb!, id)
    res.json({ data: { results } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list results'
    res.status(500).json({ error: { code: 'EXAM_RESULTS_FAILED', message } })
  }
})

router.post(
  '/results',
  requireAuth,
  requireRole(['admin', 'teacher']),
  writeActionLimiter,
  validateBody(examResultUpsertSchema),
  async (req, res) => {
    const body = req.body as { exam_id: number; student_id: number; marks_obtained: number }
    try {
      const data = await upsertExamResult(req.tenantDb!, body)
      await appendAuditLog(req.tenantDb!, {
        action: 'exam_result_recorded',
        module: 'fees',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: `exam_id=${body.exam_id} student_id=${body.student_id}`,
        metadata: `marks=${data.marks_obtained} grade=${data.grade}`,
      })
      res.json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save result'
      res.status(500).json({ error: { code: 'EXAM_RESULT_FAILED', message } })
    }
  },
)

export default router

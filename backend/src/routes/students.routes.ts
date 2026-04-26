import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { writeActionLimiter } from '../middleware/rateLimit'
import { validateBody } from '../middleware/validation'
import { studentCreateSchema, studentImportSchema } from '../validation/schemas'
import {
  createStudent,
  listStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  importStudentsFromCsv,
} from '../services/studentsService'
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
    const data = await listStudents(req.tenantDb!, {
      page: parsePage(req.query.page, 1),
      per_page: parsePerPage(req.query.per_page, 20),
      search: req.query.search ? String(req.query.search) : undefined,
      class_name: req.query.class_name ? String(req.query.class_name) : undefined,
      status: req.query.status ? (String(req.query.status) as 'active' | 'inactive') : undefined,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list students'
    res.status(500).json({ error: { code: 'STUDENT_LIST_FAILED', message } })
  }
})

router.post(
  '/import',
  requireAuth,
  requireRole(['admin', 'receptionist']),
  writeActionLimiter,
  validateBody(studentImportSchema),
  async (req, res) => {
    try {
      const data = await importStudentsFromCsv(req.tenantDb!, req.body)
      await appendAuditLog(req.tenantDb!, {
        action: 'students_imported',
        module: 'students',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: 'CSV import',
        metadata: `rows=${data.summary.total_rows} created=${data.summary.created} skipped=${data.summary.skipped} failed=${data.summary.failed}`,
      })
      res.status(201).json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to import students'
      res.status(500).json({ error: { code: 'STUDENT_IMPORT_FAILED', message } })
    }
  },
)

router.post(
  '/',
  requireAuth,
  requireRole(['admin', 'receptionist']),
  writeActionLimiter,
  validateBody(studentCreateSchema),
  async (req, res) => {
    const body = req.body as {
      name: string
      roll_number: string
      class_name: string
      section: string
      parent_name: string
      phone: string
      admission_date: string
      email?: string | null
      address?: string | null
      parent_user_id?: number | null
    }
    try {
      const result = await createStudent(req.tenantDb!, {
        name: body.name.trim(),
        roll_number: body.roll_number.trim(),
        class_name: body.class_name.trim(),
        section: body.section.trim(),
        parent_name: body.parent_name.trim(),
        phone: body.phone.trim(),
        admission_date: body.admission_date.trim(),
        email: body.email ? body.email.trim() : null,
        address: body.address ? body.address.trim() : null,
        parent_user_id: body.parent_user_id || null,
      })
      if (!result.ok) {
        res.status(409).json({ error: { code: result.code, message: result.message } })
        return
      }
      await appendAuditLog(req.tenantDb!, {
        action: 'student_created',
        module: 'students',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: `${result.data.name} (${result.data.roll_number})`,
        metadata: `${result.data.class_name}-${result.data.section}`,
      })
      res.json({ data: result.data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create student'
      res.status(500).json({ error: { code: 'STUDENT_CREATE_FAILED', message } })
    }
  },
)

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const data = await getStudent(req.tenantDb!, Number(req.params.id))
    if (!data) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Student not found' } })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get student'
    res.status(500).json({ error: { code: 'STUDENT_GET_FAILED', message } })
  }
})

router.patch('/:id', requireAuth, requireRole(['admin', 'receptionist']), writeActionLimiter, async (req, res) => {
  try {
    const data = await updateStudent(req.tenantDb!, Number(req.params.id), req.body)
    await appendAuditLog(req.tenantDb!, {
      action: 'student_updated',
      module: 'students',
      actor_name: req.auth?.name || 'Unknown',
      actor_role: req.auth?.role || 'unknown',
      target: data.name,
      metadata: `ID=${data.id}`,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update student'
    res.status(500).json({ error: { code: 'STUDENT_UPDATE_FAILED', message } })
  }
})

router.delete('/:id', requireAuth, requireRole(['admin']), writeActionLimiter, async (req, res) => {
  try {
    await deleteStudent(req.tenantDb!, Number(req.params.id))
    await appendAuditLog(req.tenantDb!, {
      action: 'student_deleted',
      module: 'students',
      actor_name: req.auth?.name || 'Unknown',
      actor_role: req.auth?.role || 'unknown',
      target: `Student ID ${req.params.id}`,
      metadata: '',
    })
    res.json({ data: { success: true } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete student'
    res.status(500).json({ error: { code: 'STUDENT_DELETE_FAILED', message } })
  }
})

export default router

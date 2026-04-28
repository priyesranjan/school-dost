import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { writeActionLimiter } from '../middleware/rateLimit'
import { validateBody } from '../middleware/validation'
import {
  classCreateSchema,
  classSectionCreateSchema,
  classSectionUpdateSchema,
  classUpdateSchema,
} from '../validation/schemas'
import {
  addClassSection,
  createClass,
  deleteClass,
  deleteClassSection,
  listClasses,
  updateClass,
  updateClassSection,
} from '../services/classesService'
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
const editorRoles = ['admin', 'hod'] as const

router.get('/', requireAuth, requireRole(['admin', 'hod', 'teacher']), async (req, res) => {
  try {
    const data = await listClasses(req.tenantDb!, {
      page: parsePage(req.query.page, 1),
      per_page: parsePerPage(req.query.per_page, 100),
      search: req.query.search ? String(req.query.search) : undefined,
      academic_year: req.query.academic_year ? String(req.query.academic_year) : undefined,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list classes'
    res.status(500).json({ error: { code: 'CLASS_LIST_FAILED', message } })
  }
})

router.post('/', requireAuth, requireRole([...editorRoles]), writeActionLimiter, validateBody(classCreateSchema), async (req, res) => {
  try {
    const data = await createClass(req.tenantDb!, req.body)
    await appendAuditLog(req.tenantDb!, {
      action: 'class_created',
      module: 'academic',
      actor_name: req.auth?.name || 'Unknown',
      actor_role: req.auth?.role || 'unknown',
      target: data.name,
      metadata: `grade=${data.grade} sections=${data.sections.length}`,
    })
    res.status(201).json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create class'
    const code = message.includes('Unique') || message.includes('unique') ? 'CLASS_DUPLICATE' : 'CLASS_CREATE_FAILED'
    res.status(code === 'CLASS_DUPLICATE' ? 409 : 500).json({ error: { code, message } })
  }
})

router.patch('/:id', requireAuth, requireRole([...editorRoles]), writeActionLimiter, validateBody(classUpdateSchema), async (req, res) => {
  try {
    const data = await updateClass(req.tenantDb!, Number(req.params.id), req.body)
    await appendAuditLog(req.tenantDb!, {
      action: 'class_updated',
      module: 'academic',
      actor_name: req.auth?.name || 'Unknown',
      actor_role: req.auth?.role || 'unknown',
      target: data.name,
      metadata: `id=${data.id}`,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update class'
    res.status(500).json({ error: { code: 'CLASS_UPDATE_FAILED', message } })
  }
})

router.delete('/:id', requireAuth, requireRole([...editorRoles]), writeActionLimiter, async (req, res) => {
  try {
    await deleteClass(req.tenantDb!, Number(req.params.id))
    await appendAuditLog(req.tenantDb!, {
      action: 'class_deleted',
      module: 'academic',
      actor_name: req.auth?.name || 'Unknown',
      actor_role: req.auth?.role || 'unknown',
      target: `Class ID ${req.params.id}`,
      metadata: '',
    })
    res.json({ data: { success: true } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete class'
    res.status(500).json({ error: { code: 'CLASS_DELETE_FAILED', message } })
  }
})

router.post(
  '/:id/sections',
  requireAuth,
  requireRole([...editorRoles]),
  writeActionLimiter,
  validateBody(classSectionCreateSchema),
  async (req, res) => {
    try {
      const data = await addClassSection(req.tenantDb!, Number(req.params.id), req.body)
      if (!data) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Class not found' } })
      await appendAuditLog(req.tenantDb!, {
        action: 'class_section_added',
        module: 'academic',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: data.name,
        metadata: `section=${req.body.name}`,
      })
      res.status(201).json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add section'
      res.status(500).json({ error: { code: 'CLASS_SECTION_CREATE_FAILED', message } })
    }
  },
)

router.patch(
  '/sections/:sectionId',
  requireAuth,
  requireRole([...editorRoles]),
  writeActionLimiter,
  validateBody(classSectionUpdateSchema),
  async (req, res) => {
    try {
      const data = await updateClassSection(req.tenantDb!, Number(req.params.sectionId), req.body)
      if (!data) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Section not found' } })
      res.json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update section'
      res.status(500).json({ error: { code: 'CLASS_SECTION_UPDATE_FAILED', message } })
    }
  },
)

router.delete('/:id/sections/:sectionId', requireAuth, requireRole([...editorRoles]), writeActionLimiter, async (req, res) => {
  try {
    const data = await deleteClassSection(req.tenantDb!, Number(req.params.id), Number(req.params.sectionId))
    if (!data) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Class not found' } })
    await appendAuditLog(req.tenantDb!, {
      action: 'class_section_deleted',
      module: 'academic',
      actor_name: req.auth?.name || 'Unknown',
      actor_role: req.auth?.role || 'unknown',
      target: data.name,
      metadata: `section_id=${req.params.sectionId}`,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete section'
    res.status(500).json({ error: { code: 'CLASS_SECTION_DELETE_FAILED', message } })
  }
})

export default router

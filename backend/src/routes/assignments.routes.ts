import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { writeActionLimiter } from '../middleware/rateLimit'
import { validateBody, validateQuery } from '../middleware/validation'
import {
  assignmentCreateSchema,
  assignmentListQuerySchema,
  assignmentStatusUpdateSchema,
  assignmentSubmissionCreateSchema,
  assignmentSubmissionReviewSchema,
  classroomResourceCreateSchema,
  classroomResourceListQuerySchema,
} from '../validation/schemas'
import {
  createClassroomResource,
  createAssignment,
  deleteAssignment,
  listClassroomResources,
  listAssignments,
  listAssignmentSubmissions,
  reviewAssignmentSubmission,
  updateAssignmentStatus,
  upsertAssignmentSubmission,
} from '../services/assignmentService'
import { appendAuditLog } from '../services/auditLogService'
import { dispatchWebhookEvent } from '../services/webhookService'

const teacherRoles = ['admin', 'teacher', 'hod'] as const

function singleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function parseId(value: string | string[] | undefined) {
  const resolved = singleParam(value)
  if (!resolved) return null
  const id = Number(resolved)
  return Number.isFinite(id) && id > 0 ? id : null
}

function parsePage(value: unknown, fallback: number) {
  const page = Number(value)
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : fallback
}

function parsePerPage(value: unknown, fallback: number) {
  const perPage = Number(value)
  if (!Number.isFinite(perPage) || perPage <= 0) return fallback
  return Math.min(100, Math.floor(perPage))
}

const router = Router()

router.get('/', requireAuth, requireRole(['admin', 'teacher', 'hod', 'parent', 'student']), validateQuery(assignmentListQuerySchema), async (req, res) => {
  try {
    const data = await listAssignments(
      req.tenantDb!,
      {
        page: parsePage(req.query.page, 1),
        per_page: parsePerPage(req.query.per_page, 50),
        class_name: req.query.class_name ? String(req.query.class_name) : undefined,
        status: req.query.status ? (String(req.query.status) as 'active' | 'completed' | 'archived') : undefined,
      },
      req.auth,
    )
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list assignments'
    res.status(500).json({ error: { code: 'ASSIGNMENT_LIST_FAILED', message } })
  }
})

router.get('/resources', requireAuth, requireRole(['admin', 'teacher', 'hod', 'parent', 'student']), validateQuery(classroomResourceListQuerySchema), async (req, res) => {
  try {
    const data = await listClassroomResources(req.tenantDb!, {
      page: parsePage(req.query.page, 1),
      per_page: parsePerPage(req.query.per_page, 50),
      class_name: req.query.class_name ? String(req.query.class_name) : undefined,
      subject: req.query.subject ? String(req.query.subject) : undefined,
      resource_type: req.query.resource_type
        ? (String(req.query.resource_type) as 'document' | 'worksheet' | 'video' | 'link')
        : undefined,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list classroom resources'
    res.status(500).json({ error: { code: 'CLASSROOM_RESOURCE_LIST_FAILED', message } })
  }
})

router.post(
  '/',
  requireAuth,
  requireRole([...teacherRoles]),
  writeActionLimiter,
  validateBody(assignmentCreateSchema),
  async (req, res) => {
    try {
      const data = await createAssignment(req.tenantDb!, req.body, req.auth)
      await appendAuditLog(req.tenantDb!, {
        action: 'assignment_created',
        module: 'academic',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: data.title,
        metadata: `class=${data.class_name} subject=${data.subject} due=${data.due_date}`,
      })
      void dispatchWebhookEvent(req.tenantDb!, {
        type: 'academic.assignment.created',
        tenant_slug: req.tenantSlug || null,
        data: {
          assignment: data,
          actor_name: req.auth?.name || 'Unknown',
        },
      })
      res.status(201).json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create assignment'
      res.status(500).json({ error: { code: 'ASSIGNMENT_CREATE_FAILED', message } })
    }
  },
)

router.post(
  '/resources',
  requireAuth,
  requireRole([...teacherRoles]),
  writeActionLimiter,
  validateBody(classroomResourceCreateSchema),
  async (req, res) => {
    try {
      const data = await createClassroomResource(req.tenantDb!, req.body, req.auth)
      await appendAuditLog(req.tenantDb!, {
        action: 'classroom_resource_created',
        module: 'academic',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: data.title,
        metadata: `class=${data.class_name} subject=${data.subject} type=${data.resource_type}`,
      })
      res.status(201).json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create classroom resource'
      res.status(500).json({ error: { code: 'CLASSROOM_RESOURCE_CREATE_FAILED', message } })
    }
  },
)

router.patch(
  '/:id/status',
  requireAuth,
  requireRole([...teacherRoles]),
  writeActionLimiter,
  validateBody(assignmentStatusUpdateSchema),
  async (req, res) => {
    const id = parseId(req.params.id)
    if (!id) {
      res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Invalid assignment id' } })
      return
    }
    try {
      const data = await updateAssignmentStatus(req.tenantDb!, id, req.body.status, req.auth)
      await appendAuditLog(req.tenantDb!, {
        action: 'assignment_status_updated',
        module: 'academic',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: data.title,
        metadata: `status=${data.status}`,
      })
      res.json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update assignment status'
      res.status(500).json({ error: { code: 'ASSIGNMENT_STATUS_UPDATE_FAILED', message } })
    }
  },
)

router.delete('/:id', requireAuth, requireRole([...teacherRoles]), writeActionLimiter, async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) {
    res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Invalid assignment id' } })
    return
  }
  try {
    await deleteAssignment(req.tenantDb!, id)
    await appendAuditLog(req.tenantDb!, {
      action: 'assignment_deleted',
      module: 'academic',
      actor_name: req.auth?.name || 'Unknown',
      actor_role: req.auth?.role || 'unknown',
      target: `assignment_id=${id}`,
      metadata: '',
    })
    res.json({ data: { success: true } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete assignment'
    res.status(500).json({ error: { code: 'ASSIGNMENT_DELETE_FAILED', message } })
  }
})

router.get('/:id/submissions', requireAuth, requireRole([...teacherRoles]), async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) {
    res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Invalid assignment id' } })
    return
  }
  try {
    const data = await listAssignmentSubmissions(req.tenantDb!, id)
    res.json({ data: { items: data } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load assignment submissions'
    res.status(500).json({ error: { code: 'ASSIGNMENT_SUBMISSIONS_FAILED', message } })
  }
})

router.post(
  '/:id/submissions',
  requireAuth,
  requireRole(['student']),
  writeActionLimiter,
  validateBody(assignmentSubmissionCreateSchema),
  async (req, res) => {
    const id = parseId(req.params.id)
    if (!id) {
      res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Invalid assignment id' } })
      return
    }
    try {
      const data = await upsertAssignmentSubmission(req.tenantDb!, id, req.body, req.auth!)
      await appendAuditLog(req.tenantDb!, {
        action: 'assignment_submitted',
        module: 'academic',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: `assignment_id=${id}`,
        metadata: `submission_id=${data.id}`,
      })
      void dispatchWebhookEvent(req.tenantDb!, {
        type: 'academic.assignment.submitted',
        tenant_slug: req.tenantSlug || null,
        data: {
          assignment_id: id,
          submission: data,
          actor_name: req.auth?.name || 'Unknown',
        },
      })
      res.status(201).json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit assignment'
      res.status(500).json({ error: { code: 'ASSIGNMENT_SUBMIT_FAILED', message } })
    }
  },
)

router.patch(
  '/:id/submissions/:submissionId/review',
  requireAuth,
  requireRole([...teacherRoles]),
  writeActionLimiter,
  validateBody(assignmentSubmissionReviewSchema),
  async (req, res) => {
    const id = parseId(req.params.id)
    const submissionId = parseId(req.params.submissionId)
    if (!id || !submissionId) {
      res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Invalid assignment submission id' } })
      return
    }
    try {
      const data = await reviewAssignmentSubmission(req.tenantDb!, id, submissionId, req.body)
      await appendAuditLog(req.tenantDb!, {
        action: 'assignment_submission_reviewed',
        module: 'academic',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: `assignment_id=${id}`,
        metadata: `submission_id=${submissionId} status=${data.status}`,
      })
      res.json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to review assignment submission'
      res.status(500).json({ error: { code: 'ASSIGNMENT_REVIEW_FAILED', message } })
    }
  },
)

export default router

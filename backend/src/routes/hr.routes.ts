import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { writeActionLimiter } from '../middleware/rateLimit'
import { validateBody, validateQuery } from '../middleware/validation'
import {
  appraisalCreateSchema,
  appraisalListQuerySchema,
  appraisalUpdateSchema,
  leaveRequestCreateSchema,
  leaveRequestListQuerySchema,
  leaveRequestReviewSchema,
} from '../validation/schemas'
import {
  cancelLeaveRequest,
  createAppraisal,
  createLeaveRequest,
  getHrSummary,
  listAppraisals,
  listLeaveRequests,
  reviewLeaveRequest,
  updateAppraisal,
} from '../services/hrService'
import { appendAuditLog } from '../services/auditLogService'
import { dispatchWebhookEvent } from '../services/webhookService'

const hrViewerRoles = ['admin', 'hod', 'teacher'] as const
const hrAdminRoles = ['admin', 'hod'] as const

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

router.get('/summary', requireAuth, requireRole([...hrViewerRoles]), async (req, res) => {
  try {
    const data = await getHrSummary(req.tenantDb!, req.auth!)
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load HR summary'
    res.status(500).json({ error: { code: 'HR_SUMMARY_FAILED', message } })
  }
})

router.get('/leave-requests', requireAuth, requireRole([...hrViewerRoles]), validateQuery(leaveRequestListQuerySchema), async (req, res) => {
  try {
    const data = await listLeaveRequests(
      req.tenantDb!,
      {
        staff_id: req.query.staff_id ? Number(req.query.staff_id) : undefined,
        status: req.query.status ? (String(req.query.status) as any) : undefined,
        page: parsePage(req.query.page, 1),
        per_page: parsePerPage(req.query.per_page, 50),
      },
      req.auth!,
    )
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list leave requests'
    res.status(500).json({ error: { code: 'LEAVE_REQUEST_LIST_FAILED', message } })
  }
})

router.post(
  '/leave-requests',
  requireAuth,
  requireRole([...hrViewerRoles]),
  writeActionLimiter,
  validateBody(leaveRequestCreateSchema),
  async (req, res) => {
    try {
      const data = await createLeaveRequest(req.tenantDb!, req.body, req.auth!)
      await appendAuditLog(req.tenantDb!, {
        action: 'leave_request_created',
        module: 'hr',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: `${data.staff_name} (${data.leave_type})`,
        metadata: `from=${data.start_date} to=${data.end_date} status=${data.status}`,
      })
      void dispatchWebhookEvent(req.tenantDb!, {
        type: 'hr.leave.requested',
        tenant_slug: req.tenantSlug || null,
        data: {
          leave_request: data,
          actor_name: req.auth?.name || 'Unknown',
        },
      })
      res.status(201).json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create leave request'
      res.status(500).json({ error: { code: 'LEAVE_REQUEST_CREATE_FAILED', message } })
    }
  },
)

router.post(
  '/leave-requests/:id/review',
  requireAuth,
  requireRole([...hrAdminRoles]),
  writeActionLimiter,
  validateBody(leaveRequestReviewSchema),
  async (req, res) => {
    const id = parseId(req.params.id)
    if (!id) {
      res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Invalid leave request id' } })
      return
    }
    try {
      const data = await reviewLeaveRequest(req.tenantDb!, id, req.body, req.auth!)
      await appendAuditLog(req.tenantDb!, {
        action: 'leave_request_reviewed',
        module: 'hr',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: `${data.staff_name} (${data.leave_type})`,
        metadata: `status=${data.status}`,
      })
      void dispatchWebhookEvent(req.tenantDb!, {
        type: 'hr.leave.reviewed',
        tenant_slug: req.tenantSlug || null,
        data: {
          leave_request: data,
          actor_name: req.auth?.name || 'Unknown',
        },
      })
      res.json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to review leave request'
      res.status(500).json({ error: { code: 'LEAVE_REQUEST_REVIEW_FAILED', message } })
    }
  },
)

router.post('/leave-requests/:id/cancel', requireAuth, requireRole([...hrViewerRoles]), writeActionLimiter, async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) {
    res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Invalid leave request id' } })
    return
  }
  try {
    const data = await cancelLeaveRequest(req.tenantDb!, id, req.auth!)
    await appendAuditLog(req.tenantDb!, {
      action: 'leave_request_cancelled',
      module: 'hr',
      actor_name: req.auth?.name || 'Unknown',
      actor_role: req.auth?.role || 'unknown',
      target: `${data.staff_name} (${data.leave_type})`,
      metadata: `status=${data.status}`,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to cancel leave request'
    res.status(500).json({ error: { code: 'LEAVE_REQUEST_CANCEL_FAILED', message } })
  }
})

router.get('/appraisals', requireAuth, requireRole([...hrViewerRoles]), validateQuery(appraisalListQuerySchema), async (req, res) => {
  try {
    const data = await listAppraisals(
      req.tenantDb!,
      {
        staff_id: req.query.staff_id ? Number(req.query.staff_id) : undefined,
        status: req.query.status ? (String(req.query.status) as any) : undefined,
        page: parsePage(req.query.page, 1),
        per_page: parsePerPage(req.query.per_page, 50),
      },
      req.auth!,
    )
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list appraisals'
    res.status(500).json({ error: { code: 'APPRAISAL_LIST_FAILED', message } })
  }
})

router.post(
  '/appraisals',
  requireAuth,
  requireRole([...hrAdminRoles]),
  writeActionLimiter,
  validateBody(appraisalCreateSchema),
  async (req, res) => {
    try {
      const data = await createAppraisal(req.tenantDb!, req.body, req.auth!)
      await appendAuditLog(req.tenantDb!, {
        action: 'appraisal_created',
        module: 'hr',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: `${data.staff_name} (${data.review_period})`,
        metadata: `rating=${data.overall_rating} status=${data.status}`,
      })
      if (data.status === 'published') {
        void dispatchWebhookEvent(req.tenantDb!, {
          type: 'hr.appraisal.published',
          tenant_slug: req.tenantSlug || null,
          data: {
            appraisal: data,
            actor_name: req.auth?.name || 'Unknown',
          },
        })
      }
      res.status(201).json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create appraisal'
      res.status(500).json({ error: { code: 'APPRAISAL_CREATE_FAILED', message } })
    }
  },
)

router.patch(
  '/appraisals/:id',
  requireAuth,
  requireRole([...hrAdminRoles]),
  writeActionLimiter,
  validateBody(appraisalUpdateSchema),
  async (req, res) => {
    const id = parseId(req.params.id)
    if (!id) {
      res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Invalid appraisal id' } })
      return
    }
    try {
      const data = await updateAppraisal(req.tenantDb!, id, req.body)
      await appendAuditLog(req.tenantDb!, {
        action: 'appraisal_updated',
        module: 'hr',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: `${data.staff_name} (${data.review_period})`,
        metadata: `rating=${data.overall_rating} status=${data.status}`,
      })
      if (data.status === 'published') {
        void dispatchWebhookEvent(req.tenantDb!, {
          type: 'hr.appraisal.published',
          tenant_slug: req.tenantSlug || null,
          data: {
            appraisal: data,
            actor_name: req.auth?.name || 'Unknown',
          },
        })
      }
      res.json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update appraisal'
      res.status(500).json({ error: { code: 'APPRAISAL_UPDATE_FAILED', message } })
    }
  },
)

export default router

import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { writeActionLimiter } from '../middleware/rateLimit'
import { validateBody, validateQuery } from '../middleware/validation'
import {
  payrollGenerateSchema,
  payrollMarkPaidSchema,
  payrollProfileUpsertSchema,
  payrollRecordsListQuerySchema,
  payrollSummaryQuerySchema,
} from '../validation/schemas'
import {
  generatePayrollMonth,
  getPayrollSummary,
  listPayrollProfiles,
  listPayrollRecords,
  markPayrollRecordPaid,
  upsertPayrollProfile,
} from '../services/payrollService'
import { appendAuditLog } from '../services/auditLogService'
import { dispatchWebhookEvent } from '../services/webhookService'

const router = Router()
const financeRoles = ['admin', 'accountant'] as const

function parseId(value: unknown) {
  const raw = Array.isArray(value) ? value[0] : value
  const id = Number(raw)
  return Number.isFinite(id) && id > 0 ? Math.floor(id) : null
}

function queueWebhook(task: unknown) {
  void Promise.resolve(task).catch(() => {})
}

router.get('/summary', requireAuth, requireRole(financeRoles as any), validateQuery(payrollSummaryQuerySchema), async (req, res) => {
  try {
    const query = req.query as { month?: string }
    const data = await getPayrollSummary(req.tenantDb!, query.month)
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load payroll summary'
    res.status(500).json({ error: { code: 'PAYROLL_SUMMARY_FAILED', message } })
  }
})

router.get('/profiles', requireAuth, requireRole(financeRoles as any), async (req, res) => {
  try {
    const data = await listPayrollProfiles(req.tenantDb!)
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load payroll profiles'
    res.status(500).json({ error: { code: 'PAYROLL_PROFILES_FAILED', message } })
  }
})

router.put(
  '/profiles/:staffId',
  requireAuth,
  requireRole(financeRoles as any),
  writeActionLimiter,
  validateBody(payrollProfileUpsertSchema),
  async (req, res) => {
    const staffId = parseId(req.params.staffId)
    if (!staffId) {
      res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Invalid staff id' } })
      return
    }

    try {
      const data = await upsertPayrollProfile(req.tenantDb!, staffId, req.body)
      await appendAuditLog(req.tenantDb!, {
        action: 'payroll_profile_upserted',
        module: 'hr',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: data.staff_name,
        metadata: `base_salary=${data.base_salary} allowances=${data.allowances} deductions=${data.deductions}`,
      })
      res.json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save payroll profile'
      res.status(500).json({ error: { code: 'PAYROLL_PROFILE_SAVE_FAILED', message } })
    }
  },
)

router.post(
  '/generate',
  requireAuth,
  requireRole(financeRoles as any),
  writeActionLimiter,
  validateBody(payrollGenerateSchema),
  async (req, res) => {
    try {
      const data = await generatePayrollMonth(req.tenantDb!, req.body)
      await appendAuditLog(req.tenantDb!, {
        action: 'payroll_generated',
        module: 'hr',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: data.month,
        metadata: `created=${data.created} updated=${data.updated} skipped_no_profile=${data.skipped_no_profile} locked_paid=${data.locked_paid}`,
      })
      queueWebhook(dispatchWebhookEvent(req.tenantDb!, {
        type: 'hr.payroll.generated',
        tenant_slug: req.tenant?.slug || req.tenantSlug || req.auth?.tenantSlug || null,
        data: {
          summary: data,
          actor: {
            name: req.auth?.name || 'Unknown',
            role: req.auth?.role || 'unknown',
          },
        },
      }))
      res.status(201).json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate payroll'
      res.status(500).json({ error: { code: 'PAYROLL_GENERATE_FAILED', message } })
    }
  },
)

router.get(
  '/records',
  requireAuth,
  requireRole(financeRoles as any),
  validateQuery(payrollRecordsListQuerySchema),
  async (req, res) => {
    try {
      const query = req.query as {
        month?: string
        status?: 'pending' | 'paid'
        page?: number
        per_page?: number
      }
      const data = await listPayrollRecords(req.tenantDb!, {
        month: query.month,
        status: query.status,
        page: query.page || 1,
        per_page: Math.min(100, query.per_page || 50),
      })
      res.json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load payroll records'
      res.status(500).json({ error: { code: 'PAYROLL_RECORDS_FAILED', message } })
    }
  },
)

router.post(
  '/records/:id/mark-paid',
  requireAuth,
  requireRole(financeRoles as any),
  writeActionLimiter,
  validateBody(payrollMarkPaidSchema),
  async (req, res) => {
    const id = parseId(req.params.id)
    if (!id) {
      res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Invalid payroll record id' } })
      return
    }

    try {
      const data = await markPayrollRecordPaid(req.tenantDb!, id, req.body)
      await appendAuditLog(req.tenantDb!, {
        action: 'payroll_paid',
        module: 'hr',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: `${data.staff_name} ${data.month}`,
        metadata: `net_pay=${data.net_pay} reference=${data.payment_reference || '-'}`,
      })
      queueWebhook(dispatchWebhookEvent(req.tenantDb!, {
        type: 'hr.payroll.paid',
        tenant_slug: req.tenant?.slug || req.tenantSlug || req.auth?.tenantSlug || null,
        data: {
          payroll_record: data,
          actor: {
            name: req.auth?.name || 'Unknown',
            role: req.auth?.role || 'unknown',
          },
        },
      }))
      res.json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to mark payroll as paid'
      res.status(500).json({ error: { code: 'PAYROLL_MARK_PAID_FAILED', message } })
    }
  },
)

export default router

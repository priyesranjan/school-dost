import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { writeActionLimiter } from '../middleware/rateLimit'
import { validateBody } from '../middleware/validation'
import { feeStructureCreateSchema, feePaymentCreateSchema, feePaymentCollectSchema } from '../validation/schemas'
import {
  collectFeePayment,
  createFeePayment,
  createFeeStructure,
  getFeePayment,
  listFeePayments,
  listFeeStructures,
} from '../services/feesService'
import { appendAuditLog } from '../services/auditLogService'
import { dispatchWebhookEvent } from '../services/webhookService'

function parsePage(value: unknown, fallback: number) {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback
}
function parsePerPage(value: unknown, fallback: number) {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return fallback
  return Math.min(100, Math.floor(n))
}

function queueWebhook(task: unknown) {
  void Promise.resolve(task).catch(() => {})
}

const router = Router()
const feeManagerRoles = ['admin', 'accountant'] as const
const feeCollectionRoles = ['admin', 'accountant', 'receptionist'] as const

router.get('/structures', requireAuth, requireRole(['admin', 'accountant', 'receptionist']), async (req, res) => {
  try {
    const data = await listFeeStructures(req.tenantDb!, {
      page: parsePage(req.query.page, 1),
      per_page: parsePerPage(req.query.per_page, 20),
      class_name: req.query.class_name ? String(req.query.class_name) : undefined,
      academic_year: req.query.academic_year ? String(req.query.academic_year) : undefined,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list fee structures'
    res.status(500).json({ error: { code: 'FEE_STRUCTURE_LIST_FAILED', message } })
  }
})

router.post(
  '/structures',
  requireAuth,
  requireRole([...feeManagerRoles]),
  writeActionLimiter,
  validateBody(feeStructureCreateSchema),
  async (req, res) => {
    const body = req.body as {
      name: string
      class_name: string
      amount: number
      due_date: string
      academic_year: string
    }
    try {
      const data = await createFeeStructure(req.tenantDb!, {
        name: body.name.trim(),
        class_name: body.class_name.trim(),
        amount: body.amount,
        due_date: body.due_date.trim(),
        academic_year: body.academic_year.trim(),
      })
      await appendAuditLog(req.tenantDb!, {
        action: 'fee_structure_created',
        module: 'fees',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: data.name,
        metadata: `${data.class_name} amount=${data.amount}`,
      })
      res.json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create fee structure'
      res.status(500).json({ error: { code: 'FEE_STRUCTURE_CREATE_FAILED', message } })
    }
  },
)

router.get('/payments', requireAuth, requireRole(['admin', 'accountant', 'receptionist']), async (req, res) => {
  try {
    const data = await listFeePayments(req.tenantDb!, {
      page: parsePage(req.query.page, 1),
      per_page: parsePerPage(req.query.per_page, 20),
      student_id: req.query.student_id ? Number(req.query.student_id) : undefined,
      status: req.query.status ? (String(req.query.status) as 'paid' | 'partial' | 'unpaid') : undefined,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list fee payments'
    res.status(500).json({ error: { code: 'FEE_PAYMENT_LIST_FAILED', message } })
  }
})

router.get('/due', requireAuth, requireRole(['admin', 'accountant', 'receptionist']), async (req, res) => {
  try {
    const partial = await listFeePayments(req.tenantDb!, {
      page: 1,
      per_page: parsePerPage(req.query.per_page, 100),
      status: 'partial',
    })
    const unpaid = await listFeePayments(req.tenantDb!, {
      page: 1,
      per_page: parsePerPage(req.query.per_page, 100),
      status: 'unpaid',
    })
    const items = [...partial.items, ...unpaid.items].sort((a, b) => b.due_amount - a.due_amount)
    res.json({ data: { items, total: items.length, page: 1, per_page: items.length || 100 } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list dues'
    res.status(500).json({ error: { code: 'FEE_DUE_LIST_FAILED', message } })
  }
})

router.get('/payments/:id/receipt', requireAuth, requireRole(['admin', 'accountant', 'receptionist']), async (req, res) => {
  try {
    const data = await getFeePayment(req.tenantDb!, Number(req.params.id))
    if (!data) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Fee payment not found' } })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load receipt'
    res.status(500).json({ error: { code: 'FEE_RECEIPT_FAILED', message } })
  }
})

router.post(
  '/payments',
  requireAuth,
  requireRole([...feeCollectionRoles]),
  writeActionLimiter,
  validateBody(feePaymentCreateSchema),
  async (req, res) => {
    const body = req.body as {
      student_id: number
      fee_structure_id?: number | null
      total_amount: number
      paid_amount: number
      payment_method?: 'cash' | 'upi' | 'bank_transfer' | 'cheque' | null
      payment_date?: string | null
    }
    try {
      const data = await createFeePayment(req.tenantDb!, {
        student_id: body.student_id,
        fee_structure_id: body.fee_structure_id ?? null,
        total_amount: body.total_amount,
        paid_amount: body.paid_amount,
        payment_method: body.payment_method ?? null,
        payment_date: body.payment_date ?? null,
      })
      await appendAuditLog(req.tenantDb!, {
        action: 'fee_payment_recorded',
        module: 'fees',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: data.receipt_number || `payment-${data.id}`,
        metadata: `student_id=${data.student_id} paid=${data.paid_amount} due=${data.due_amount}`,
      })
      queueWebhook(dispatchWebhookEvent(req.tenantDb!, {
        type: 'fees.payment.recorded',
        tenant_slug: req.tenant?.slug || req.tenantSlug || req.auth?.tenantSlug || null,
        data: {
          payment: data,
          actor: {
            name: req.auth?.name || 'Unknown',
            role: req.auth?.role || 'unknown',
          },
        },
      }))
      res.json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to record fee payment'
      res.status(500).json({ error: { code: 'FEE_PAYMENT_CREATE_FAILED', message } })
    }
  },
)

router.patch(
  '/payments/:id/collect',
  requireAuth,
  requireRole([...feeCollectionRoles]),
  writeActionLimiter,
  validateBody(feePaymentCollectSchema),
  async (req, res) => {
    try {
      const data = await collectFeePayment(req.tenantDb!, Number(req.params.id), req.body)
      await appendAuditLog(req.tenantDb!, {
        action: 'fee_payment_collected',
        module: 'fees',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: data.receipt_number || `payment-${data.id}`,
        metadata: `student_id=${data.student_id} amount=${req.body.amount} due=${data.due_amount}`,
      })
      queueWebhook(dispatchWebhookEvent(req.tenantDb!, {
        type: 'fees.payment.recorded',
        tenant_slug: req.tenant?.slug || req.tenantSlug || req.auth?.tenantSlug || null,
        data: {
          payment: data,
          actor: {
            name: req.auth?.name || 'Unknown',
            role: req.auth?.role || 'unknown',
          },
        },
      }))
      res.json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to collect payment'
      res.status(500).json({ error: { code: 'FEE_PAYMENT_COLLECT_FAILED', message } })
    }
  },
)

export default router

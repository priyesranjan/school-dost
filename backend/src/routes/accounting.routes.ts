import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { writeActionLimiter } from '../middleware/rateLimit'
import { validateBody, validateQuery } from '../middleware/validation'
import {
  bankAccountCreateSchema,
  bankReconciliationCreateSchema,
  bankReconciliationMatchSchema,
  expenseCreateSchema,
  manualJournalCreateSchema,
  trialBalanceQuerySchema,
} from '../validation/schemas'
import {
  createBankAccount,
  createBankReconciliationEntry,
  createExpense,
  createManualJournal,
  deleteExpense,
  getAccountingSummary,
  getTrialBalance,
  listBankAccounts,
  listBankReconciliationEntries,
  listExpenses,
  listLedgerAccounts,
  listLedgerEntries,
  matchBankReconciliationEntry,
} from '../services/accountingService'
import { appendAuditLog } from '../services/auditLogService'
import { dispatchWebhookEvent } from '../services/webhookService'

function parsePage(value: unknown, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback
}

function parsePerPage(value: unknown, fallback: number) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback
  return Math.min(100, Math.floor(parsed))
}

function queueWebhook(task: unknown) {
  void Promise.resolve(task).catch(() => {})
}

const financeRoles = ['admin', 'accountant'] as any
const router = Router()

router.get('/summary', requireAuth, requireRole(financeRoles), async (req, res) => {
  try {
    const data = await getAccountingSummary(req.tenantDb!)
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load accounting summary'
    res.status(500).json({ error: { code: 'ACCOUNTING_SUMMARY_FAILED', message } })
  }
})

router.get('/expenses', requireAuth, requireRole(financeRoles), async (req, res) => {
  try {
    const data = await listExpenses(req.tenantDb!, {
      page: parsePage(req.query.page, 1),
      per_page: parsePerPage(req.query.per_page, 50),
      category: req.query.category ? String(req.query.category) : undefined,
      from: req.query.from ? String(req.query.from) : undefined,
      to: req.query.to ? String(req.query.to) : undefined,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list expenses'
    res.status(500).json({ error: { code: 'EXPENSE_LIST_FAILED', message } })
  }
})

router.post(
  '/expenses',
  requireAuth,
  requireRole(financeRoles),
  writeActionLimiter,
  validateBody(expenseCreateSchema),
  async (req, res) => {
    try {
      const data = await createExpense(req.tenantDb!, req.body)
      await appendAuditLog(req.tenantDb!, {
        action: 'expense_created',
        module: 'finance',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: data.title,
        metadata: `amount=${data.amount} category=${data.category}`,
      })
      queueWebhook(dispatchWebhookEvent(req.tenantDb!, {
        type: 'accounting.expense.created',
        tenant_slug: req.tenant?.slug || req.tenantSlug || req.auth?.tenantSlug || null,
        data: {
          expense: data,
          actor: {
            name: req.auth?.name || 'Unknown',
            role: req.auth?.role || 'unknown',
          },
        },
      }))
      res.status(201).json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create expense'
      res.status(500).json({ error: { code: 'EXPENSE_CREATE_FAILED', message } })
    }
  },
)

router.post(
  '/manual-journals',
  requireAuth,
  requireRole(financeRoles),
  writeActionLimiter,
  validateBody(manualJournalCreateSchema),
  async (req, res) => {
    try {
      const data = await createManualJournal(req.tenantDb!, req.body)
      await appendAuditLog(req.tenantDb!, {
        action: 'manual_journal_created',
        module: 'finance',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: data.description,
        metadata: `journal_id=${data.journal_id} amount=${data.amount}`,
      })
      queueWebhook(dispatchWebhookEvent(req.tenantDb!, {
        type: 'accounting.manual_journal.created',
        tenant_slug: req.tenant?.slug || req.tenantSlug || req.auth?.tenantSlug || null,
        data: {
          journal: data,
          actor: {
            name: req.auth?.name || 'Unknown',
            role: req.auth?.role || 'unknown',
          },
        },
      }))
      res.status(201).json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create manual journal'
      res.status(500).json({ error: { code: 'MANUAL_JOURNAL_CREATE_FAILED', message } })
    }
  },
)

router.delete('/expenses/:id', requireAuth, requireRole(financeRoles), writeActionLimiter, async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isFinite(id) || id <= 0) {
    res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Invalid expense id' } })
    return
  }

  try {
    await deleteExpense(req.tenantDb!, id)
    await appendAuditLog(req.tenantDb!, {
      action: 'expense_deleted',
      module: 'finance',
      actor_name: req.auth?.name || 'Unknown',
      actor_role: req.auth?.role || 'unknown',
      target: `expense_id=${id}`,
      metadata: '',
    })
    queueWebhook(dispatchWebhookEvent(req.tenantDb!, {
      type: 'accounting.expense.deleted',
      tenant_slug: req.tenant?.slug || req.tenantSlug || req.auth?.tenantSlug || null,
      data: {
        expense_id: id,
        actor: {
          name: req.auth?.name || 'Unknown',
          role: req.auth?.role || 'unknown',
        },
      },
    }))
    res.json({ data: { deleted: true } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete expense'
    res.status(500).json({ error: { code: 'EXPENSE_DELETE_FAILED', message } })
  }
})

router.get('/accounts', requireAuth, requireRole(financeRoles), async (req, res) => {
  try {
    const data = await listLedgerAccounts(req.tenantDb!)
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list ledger accounts'
    res.status(500).json({ error: { code: 'LEDGER_ACCOUNTS_FAILED', message } })
  }
})

router.get('/trial-balance', requireAuth, requireRole(financeRoles), validateQuery(trialBalanceQuerySchema), async (req, res) => {
  try {
    const data = await getTrialBalance(req.tenantDb!, {
      from: req.query.from ? String(req.query.from) : undefined,
      to: req.query.to ? String(req.query.to) : undefined,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load trial balance'
    res.status(500).json({ error: { code: 'TRIAL_BALANCE_FAILED', message } })
  }
})

router.get('/bank-accounts', requireAuth, requireRole(financeRoles), async (req, res) => {
  try {
    const data = await listBankAccounts(req.tenantDb!)
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list bank accounts'
    res.status(500).json({ error: { code: 'BANK_ACCOUNTS_FAILED', message } })
  }
})

router.post('/bank-accounts', requireAuth, requireRole(financeRoles), writeActionLimiter, validateBody(bankAccountCreateSchema), async (req, res) => {
  try {
    const data = await createBankAccount(req.tenantDb!, req.body)
    await appendAuditLog(req.tenantDb!, {
      action: 'bank_account_created',
      module: 'finance',
      actor_name: req.auth?.name || 'Unknown',
      actor_role: req.auth?.role || 'unknown',
      target: `${data.bank_name} - ${data.account_name}`,
      metadata: `opening_balance=${data.opening_balance}`,
    })
    res.status(201).json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create bank account'
    res.status(500).json({ error: { code: 'BANK_ACCOUNT_CREATE_FAILED', message } })
  }
})

router.get('/ledger', requireAuth, requireRole(financeRoles), async (req, res) => {
  try {
    const data = await listLedgerEntries(req.tenantDb!, {
      page: parsePage(req.query.page, 1),
      per_page: parsePerPage(req.query.per_page, 50),
      account_id: req.query.account_id ? Number(req.query.account_id) : undefined,
      source_type: req.query.source_type ? String(req.query.source_type) : undefined,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list ledger entries'
    res.status(500).json({ error: { code: 'LEDGER_ENTRIES_FAILED', message } })
  }
})

router.get('/bank-reconciliation', requireAuth, requireRole(financeRoles), async (req, res) => {
  try {
    const matchedParam = req.query.matched
    const matched =
      matchedParam === undefined ? undefined : String(matchedParam).toLowerCase() === 'true'
    const data = await listBankReconciliationEntries(req.tenantDb!, {
      page: parsePage(req.query.page, 1),
      per_page: parsePerPage(req.query.per_page, 50),
      bank_account_id: req.query.bank_account_id ? Number(req.query.bank_account_id) : undefined,
      matched,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list bank reconciliation entries'
    res.status(500).json({ error: { code: 'BANK_RECONCILIATION_FAILED', message } })
  }
})

router.post('/bank-reconciliation', requireAuth, requireRole(financeRoles), writeActionLimiter, validateBody(bankReconciliationCreateSchema), async (req, res) => {
  try {
    const data = await createBankReconciliationEntry(req.tenantDb!, req.body)
    await appendAuditLog(req.tenantDb!, {
      action: 'bank_reconciliation_entry_created',
      module: 'finance',
      actor_name: req.auth?.name || 'Unknown',
      actor_role: req.auth?.role || 'unknown',
      target: data.description,
      metadata: `amount=${data.amount} direction=${data.direction}`,
    })
    res.status(201).json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create reconciliation entry'
    res.status(500).json({ error: { code: 'BANK_RECONCILIATION_CREATE_FAILED', message } })
  }
})

router.post('/bank-reconciliation/:id/match', requireAuth, requireRole(financeRoles), writeActionLimiter, validateBody(bankReconciliationMatchSchema), async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isFinite(id) || id <= 0) {
    res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Invalid reconciliation entry id' } })
    return
  }
  try {
    const data = await matchBankReconciliationEntry(req.tenantDb!, id, req.body)
    await appendAuditLog(req.tenantDb!, {
      action: 'bank_reconciliation_entry_matched',
      module: 'finance',
      actor_name: req.auth?.name || 'Unknown',
      actor_role: req.auth?.role || 'unknown',
      target: data.description,
      metadata: `matched=${data.matched} ledger_entry_id=${data.ledger_entry_id ?? ''}`,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to match reconciliation entry'
    res.status(500).json({ error: { code: 'BANK_RECONCILIATION_MATCH_FAILED', message } })
  }
})

export default router

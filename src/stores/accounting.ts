import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { loadFromStorage, saveToStorage } from '@/utils/storage'
import {
  accountingService,
  type AccountingBankAccount,
  type AccountingBankReconciliationEntry,
  type AccountingExpensePayload,
  type AccountingLedgerAccount,
  type AccountingLedgerEntry,
  type AccountingSummary,
  type AccountingTrialBalanceEntry,
} from '@/services/accountingService'
import { useAuditStore } from './audit'
import { useAuthStore } from './auth'
import { useToastStore } from './toast'

export type ExpenseCategory = 'salary' | 'maintenance' | 'utilities' | 'supplies' | 'events' | 'other'

export interface ExpenseRecord {
  id: number
  title: string
  category: ExpenseCategory
  amount: number
  date: string
  vendor_or_staff?: string
  payment_method: 'cash' | 'bank_transfer' | 'cheque' | 'card' | 'upi'
  reference_no?: string
  notes?: string
  created_at?: string
}

const demoExpenses: ExpenseRecord[] = [
  {
    id: 1,
    title: 'March Electricity Bill',
    category: 'utilities',
    amount: 45000,
    date: '2026-03-05',
    vendor_or_staff: 'State Electricity Board',
    payment_method: 'bank_transfer',
    reference_no: 'TXN89123',
  },
  {
    id: 2,
    title: 'Science Lab Equipment',
    category: 'supplies',
    amount: 120000,
    date: '2026-03-12',
    vendor_or_staff: 'EduTech Corp',
    payment_method: 'bank_transfer',
    reference_no: 'TXN89144',
  },
  {
    id: 3,
    title: 'Teacher Salaries March',
    category: 'salary',
    amount: 850000,
    date: '2026-04-01',
    payment_method: 'bank_transfer',
  },
  {
    id: 4,
    title: 'Plumbing Repair AC Block',
    category: 'maintenance',
    amount: 8500,
    date: '2026-04-03',
    vendor_or_staff: 'Ravi Plumbers',
    payment_method: 'cash',
  },
]

function restoreLocalExpenses() {
  return loadFromStorage<ExpenseRecord[]>('accounting_expenses') || [...demoExpenses]
}

function buildLocalDistribution(expenses: ExpenseRecord[]) {
  return expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )
}

function buildAuditMetadata(payload: Pick<ExpenseRecord, 'amount' | 'category'>) {
  return `Amount: Rs ${payload.amount} | Category: ${payload.category}`
}

export const useAccountingStore = defineStore('accounting', () => {
  const auditStore = useAuditStore()
  const authStore = useAuthStore()
  const toast = useToastStore()

  const expenses = ref<ExpenseRecord[]>(restoreLocalExpenses())
  const ledgerAccounts = ref<AccountingLedgerAccount[]>([])
  const ledgerEntries = ref<AccountingLedgerEntry[]>([])
  const trialBalance = ref<AccountingTrialBalanceEntry[]>([])
  const trialBalanceTotals = ref<{ total_debit: number; total_credit: number; balanced: boolean } | null>(null)
  const bankAccounts = ref<AccountingBankAccount[]>([])
  const bankReconciliationEntries = ref<AccountingBankReconciliationEntry[]>([])
  const summary = ref<AccountingSummary | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const loadedFromBackend = ref(false)

  watch(expenses, (value) => saveToStorage('accounting_expenses', value), { deep: true })

  const canUseBackend = computed(() => Boolean(localStorage.getItem('auth_token') && authStore.user?.tenant_id))

  const totalExpenses = computed(() => {
    if (summary.value) return summary.value.total_expenses
    return expenses.value.reduce((sum, expense) => sum + expense.amount, 0)
  })

  const expenseDistribution = computed(() => {
    if (summary.value?.expense_by_category?.length) {
      return Object.fromEntries(summary.value.expense_by_category.map((item) => [item.category, item.amount]))
    }
    return buildLocalDistribution(expenses.value)
  })

  const topExpenseCategory = computed(() => {
    const entries = Object.entries(expenseDistribution.value)
    if (!entries.length) return ''
    return entries.reduce((top, current) => (current[1] > top[1] ? current : top))[0]
  })

  async function fetchExpenses() {
    if (!canUseBackend.value) {
      loadedFromBackend.value = false
      return {
        items: expenses.value,
        total: expenses.value.length,
        page: 1,
        per_page: expenses.value.length,
      }
    }

    const response = await accountingService.getExpenses({ page: 1, per_page: 200 })
    expenses.value = response.items as ExpenseRecord[]
    loadedFromBackend.value = true
    return response
  }

  async function fetchSummary() {
    if (!canUseBackend.value) {
      summary.value = null
      return null
    }

    const response = await accountingService.getSummary()
    summary.value = response
    return response
  }

  async function fetchLedgerSnapshot() {
    if (!canUseBackend.value) {
      ledgerAccounts.value = []
      ledgerEntries.value = []
      trialBalance.value = []
      trialBalanceTotals.value = null
      bankAccounts.value = []
      bankReconciliationEntries.value = []
      return null
    }

    const [accounts, ledger, balance, banks, reconciliation] = await Promise.all([
      accountingService.getAccounts(),
      accountingService.getLedger({ page: 1, per_page: 50 }),
      accountingService.getTrialBalance(),
      accountingService.getBankAccounts(),
      accountingService.getBankReconciliation({ page: 1, per_page: 100 }),
    ])
    ledgerAccounts.value = accounts
    ledgerEntries.value = ledger.items
    trialBalance.value = balance.items
    trialBalanceTotals.value = {
      total_debit: balance.total_debit,
      total_credit: balance.total_credit,
      balanced: balance.balanced,
    }
    bankAccounts.value = banks
    bankReconciliationEntries.value = reconciliation.items
    return { accounts, ledger: ledger.items }
  }

  async function refresh() {
    if (!canUseBackend.value) {
      loadedFromBackend.value = false
      summary.value = null
      ledgerAccounts.value = []
      ledgerEntries.value = []
      trialBalance.value = []
      trialBalanceTotals.value = null
      bankAccounts.value = []
      bankReconciliationEntries.value = []
      return
    }

    loading.value = true
    try {
      await Promise.all([fetchExpenses(), fetchSummary(), fetchLedgerSnapshot()])
    } catch {
      toast.error('Failed to sync accounting data')
    } finally {
      loading.value = false
    }
  }

  async function addExpense(payload: Omit<ExpenseRecord, 'id'>) {
    if (!canUseBackend.value) {
      const localRecord: ExpenseRecord = { id: Date.now(), ...payload }
      expenses.value.unshift(localRecord)
      summary.value = null
      await auditStore.addLog({
        action: 'expense_added',
        module: 'finance',
        actor_name: authStore.user?.name || 'System User',
        actor_role: authStore.user?.role || 'admin',
        target: payload.title,
        metadata: buildAuditMetadata(payload),
      })
      toast.success('Expense logged locally')
      return localRecord
    }

    saving.value = true
    try {
      const record = (await accountingService.createExpense(payload as AccountingExpensePayload)) as ExpenseRecord
      expenses.value.unshift(record)
      await Promise.all([fetchSummary(), fetchLedgerSnapshot()])
      await auditStore.addLog({
        action: 'expense_added',
        module: 'finance',
        actor_name: authStore.user?.name || 'System User',
        actor_role: authStore.user?.role || 'admin',
        target: record.title,
        metadata: buildAuditMetadata(record),
      })
      toast.success('Expense logged successfully')
      return record
    } catch (error) {
      toast.error('Failed to log expense')
      throw error
    } finally {
      saving.value = false
    }
  }

  async function deleteExpense(id: number) {
    const existing = expenses.value.find((expense) => expense.id === id)
    if (!existing) return false

    if (!canUseBackend.value) {
      expenses.value = expenses.value.filter((expense) => expense.id !== id)
      summary.value = null
      await auditStore.addLog({
        action: 'expense_deleted',
        module: 'finance',
        actor_name: authStore.user?.name || 'System User',
        actor_role: authStore.user?.role || 'admin',
        target: existing.title,
        metadata: buildAuditMetadata(existing),
      })
      toast.success('Expense removed locally')
      return true
    }

    saving.value = true
    try {
      await accountingService.deleteExpense(id)
      expenses.value = expenses.value.filter((expense) => expense.id !== id)
      await Promise.all([fetchSummary(), fetchLedgerSnapshot()])
      await auditStore.addLog({
        action: 'expense_deleted',
        module: 'finance',
        actor_name: authStore.user?.name || 'System User',
        actor_role: authStore.user?.role || 'admin',
        target: existing.title,
        metadata: buildAuditMetadata(existing),
      })
      toast.success('Expense deleted successfully')
      return true
    } catch {
      toast.error('Failed to delete expense')
      return false
    } finally {
      saving.value = false
    }
  }

  async function addBankAccount(payload: {
    account_name: string
    bank_name: string
    account_number: string
    ifsc_code?: string | null
    opening_balance?: number | null
    notes?: string | null
  }) {
    if (!canUseBackend.value) {
      toast.warning('Bank accounts are only available in backend mode')
      return null
    }
    saving.value = true
    try {
      const data = await accountingService.createBankAccount(payload)
      bankAccounts.value.push(data)
      toast.success('Bank account created')
      return data
    } catch (error) {
      toast.error('Failed to create bank account')
      throw error
    } finally {
      saving.value = false
    }
  }

  async function addBankReconciliationEntry(payload: {
    bank_account_id: number
    transaction_date: string
    description: string
    reference_no?: string | null
    amount: number
    direction: 'inflow' | 'outflow'
    notes?: string | null
  }) {
    if (!canUseBackend.value) {
      toast.warning('Bank reconciliation is only available in backend mode')
      return null
    }
    saving.value = true
    try {
      const data = await accountingService.createBankReconciliation(payload)
      bankReconciliationEntries.value.unshift(data)
      await Promise.all([fetchSummary(), fetchLedgerSnapshot()])
      toast.success('Bank statement line added')
      return data
    } catch (error) {
      toast.error('Failed to add bank statement line')
      throw error
    } finally {
      saving.value = false
    }
  }

  async function matchBankReconciliationEntry(id: number, payload: { ledger_entry_id?: number | null; matched: boolean }) {
    if (!canUseBackend.value) {
      toast.warning('Bank reconciliation is only available in backend mode')
      return null
    }
    saving.value = true
    try {
      const data = await accountingService.matchBankReconciliation(id, payload)
      const idx = bankReconciliationEntries.value.findIndex((entry) => entry.id === id)
      if (idx !== -1) bankReconciliationEntries.value[idx] = data
      await Promise.all([fetchSummary(), fetchLedgerSnapshot()])
      toast.success('Reconciliation updated')
      return data
    } catch (error) {
      toast.error('Failed to update reconciliation')
      throw error
    } finally {
      saving.value = false
    }
  }

  async function addManualJournal(payload: {
    entry_date: string
    description: string
    reference_no?: string | null
    debit_account_id: number
    credit_account_id: number
    amount: number
    notes?: string | null
  }) {
    if (!canUseBackend.value) {
      toast.warning('Manual journals are only available in backend mode')
      return null
    }
    saving.value = true
    try {
      const data = await accountingService.createManualJournal(payload)
      await Promise.all([fetchLedgerSnapshot(), fetchSummary()])
      toast.success('Manual journal posted')
      return data
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || 'Failed to post manual journal')
      throw error
    } finally {
      saving.value = false
    }
  }

  return {
    expenses,
    ledgerAccounts,
    ledgerEntries,
    trialBalance,
    trialBalanceTotals,
    bankAccounts,
    bankReconciliationEntries,
    summary,
    loading,
    saving,
    loadedFromBackend,
    totalExpenses,
    expenseDistribution,
    topExpenseCategory,
    refresh,
    fetchExpenses,
    fetchSummary,
    fetchLedgerSnapshot,
    addExpense,
    deleteExpense,
    addBankAccount,
    addBankReconciliationEntry,
    matchBankReconciliationEntry,
    addManualJournal,
  }
})

import api from './api'

export interface AccountingExpensePayload {
  title: string
  category: string
  amount: number
  date: string
  vendor_or_staff?: string
  payment_method: 'cash' | 'bank_transfer' | 'cheque' | 'card' | 'upi'
  reference_no?: string
  notes?: string
}

export interface AccountingExpenseRecord extends AccountingExpensePayload {
  id: number
  created_at?: string
}

export interface AccountingSummary {
  fees_collected: number
  fees_pending: number
  total_invoiced: number
  total_expenses: number
  net_profit: number
  unreconciled_bank_entries?: number
  expense_by_category: Array<{ category: string; amount: number }>
}

export interface AccountingLedgerAccount {
  id: number
  code: string
  name: string
  type: 'asset' | 'liability' | 'income' | 'expense' | 'equity'
  is_system: boolean
}

export interface AccountingLedgerEntry {
  id: number
  account_id: number
  account_code?: string
  account_name?: string
  account_type?: AccountingLedgerAccount['type']
  entry_date: string
  description: string
  debit: number
  credit: number
  source_type?: string | null
  source_id?: string | null
  created_at?: string
}

export interface AccountingTrialBalanceEntry {
  account_id: number
  code: string
  name: string
  type: AccountingLedgerAccount['type']
  debit: number
  credit: number
  net: number
}

export interface AccountingBankAccount {
  id: number
  account_name: string
  bank_name: string
  account_number: string
  ifsc_code: string | null
  opening_balance: number
  notes: string | null
  last_reconciled_at: string | null
  created_at?: string
  updated_at?: string
}

export interface AccountingBankReconciliationEntry {
  id: number
  bank_account_id: number
  bank_account_name?: string | null
  ledger_entry_id?: number | null
  ledger_entry_description?: string | null
  transaction_date: string
  description: string
  reference_no?: string | null
  amount: number
  direction: 'inflow' | 'outflow'
  matched: boolean
  notes?: string | null
  created_at?: string
  updated_at?: string
}

export interface AccountingManualJournalRecord {
  journal_id: string
  entry_date: string
  description: string
  reference_no?: string | null
  notes?: string | null
  amount: number
  entries: AccountingLedgerEntry[]
}

export const accountingService = {
  async getExpenses(params?: { page?: number; per_page?: number; category?: string; from?: string; to?: string }) {
    const res = await api.get('/accounting/expenses', { params })
    return res.data.data as { items: AccountingExpenseRecord[]; total: number; page: number; per_page: number }
  },

  async createExpense(payload: AccountingExpensePayload) {
    const res = await api.post('/accounting/expenses', payload)
    return res.data.data as AccountingExpenseRecord
  },

  async deleteExpense(id: number) {
    await api.delete(`/accounting/expenses/${id}`)
  },

  async getSummary() {
    const res = await api.get('/accounting/summary')
    return res.data.data as AccountingSummary
  },

  async getAccounts() {
    const res = await api.get('/accounting/accounts')
    return res.data.data as AccountingLedgerAccount[]
  },

  async getTrialBalance(params?: { from?: string; to?: string }) {
    const res = await api.get('/accounting/trial-balance', { params })
    return res.data.data as {
      items: AccountingTrialBalanceEntry[]
      total_debit: number
      total_credit: number
      balanced: boolean
    }
  },

  async getLedger(params?: { page?: number; per_page?: number; account_id?: number; source_type?: string }) {
    const res = await api.get('/accounting/ledger', { params })
    return res.data.data as { items: AccountingLedgerEntry[]; total: number; page: number; per_page: number }
  },

  async createManualJournal(payload: {
    entry_date: string
    description: string
    reference_no?: string | null
    debit_account_id: number
    credit_account_id: number
    amount: number
    notes?: string | null
  }) {
    const res = await api.post('/accounting/manual-journals', payload)
    return res.data.data as AccountingManualJournalRecord
  },

  async getBankAccounts() {
    const res = await api.get('/accounting/bank-accounts')
    return res.data.data as AccountingBankAccount[]
  },

  async createBankAccount(payload: {
    account_name: string
    bank_name: string
    account_number: string
    ifsc_code?: string | null
    opening_balance?: number | null
    notes?: string | null
  }) {
    const res = await api.post('/accounting/bank-accounts', payload)
    return res.data.data as AccountingBankAccount
  },

  async getBankReconciliation(params?: { page?: number; per_page?: number; bank_account_id?: number; matched?: boolean }) {
    const res = await api.get('/accounting/bank-reconciliation', { params })
    return res.data.data as { items: AccountingBankReconciliationEntry[]; total: number; page: number; per_page: number }
  },

  async createBankReconciliation(payload: {
    bank_account_id: number
    transaction_date: string
    description: string
    reference_no?: string | null
    amount: number
    direction: 'inflow' | 'outflow'
    notes?: string | null
  }) {
    const res = await api.post('/accounting/bank-reconciliation', payload)
    return res.data.data as AccountingBankReconciliationEntry
  },

  async matchBankReconciliation(id: number, payload: { ledger_entry_id?: number | null; matched: boolean }) {
    const res = await api.post(`/accounting/bank-reconciliation/${id}/match`, payload)
    return res.data.data as AccountingBankReconciliationEntry
  },
}

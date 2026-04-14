import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { loadFromStorage, saveToStorage } from '@/utils/storage'
import { useAuditStore } from './audit'

export type ExpenseCategory = 'salary' | 'maintenance' | 'utilities' | 'supplies' | 'events' | 'other'

export interface ExpenseRecord {
  id: number
  title: string
  category: ExpenseCategory
  amount: number
  date: string
  vendor_or_staff?: string
  payment_method: 'cash' | 'bank_transfer' | 'cheque' | 'card'
  reference_no?: string
  notes?: string
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

export const useAccountingStore = defineStore('accounting', () => {
  const auditStore = useAuditStore()
  const saved = loadFromStorage<ExpenseRecord[]>('accounting_expenses')
  const expenses = ref<ExpenseRecord[]>(saved || demoExpenses)

  watch(expenses, (val) => saveToStorage('accounting_expenses', val), { deep: true })

  const totalExpenses = computed(() => expenses.value.reduce((sum, e) => sum + e.amount, 0))

  function addExpense(payload: Omit<ExpenseRecord, 'id'>) {
    const record: ExpenseRecord = { id: Date.now(), ...payload }
    expenses.value.unshift(record)
    auditStore.addLog({
      action: 'expense_added',
      module: 'finance',
      actor_name: 'System User',
      actor_role: 'admin',
      target: payload.title,
      metadata: `Amount: ₹${payload.amount} | Category: ${payload.category}`,
    })
  }

  function deleteExpense(id: number) {
    const existing = expenses.value.find((e) => e.id === id)
    if (existing) {
      expenses.value = expenses.value.filter((e) => e.id !== id)
      auditStore.addLog({
        action: 'expense_deleted',
        module: 'finance',
        actor_name: 'System User',
        actor_role: 'admin',
        target: existing.title,
        metadata: `Deleted expense amount: ₹${existing.amount} | Category: ${existing.category}`,
      })
    }
  }

  return {
    expenses,
    totalExpenses,
    addExpense,
    deleteExpense,
  }
})

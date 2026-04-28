import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { FeePayment, FeeStructure } from '@/types'
import { useToastStore } from './toast'
import { saveToStorage, loadFromStorage } from '@/utils/storage'
import { feeService } from '@/services/feeService'
import { getOfflineMode } from '@/utils/runtimeConfig'

const demoStructures: FeeStructure[] = [
  {
    id: 1,
    name: 'Tuition Fee',
    class_name: 'Class 10',
    amount: 15000,
    due_date: '2026-04-15',
    academic_year: '2025-26',
  },
  {
    id: 2,
    name: 'Tuition Fee',
    class_name: 'Class 9',
    amount: 13000,
    due_date: '2026-04-15',
    academic_year: '2025-26',
  },
  {
    id: 3,
    name: 'Tuition Fee',
    class_name: 'Class 8',
    amount: 11000,
    due_date: '2026-04-15',
    academic_year: '2025-26',
  },
  { id: 4, name: 'Lab Fee', class_name: 'Class 10', amount: 3000, due_date: '2026-04-15', academic_year: '2025-26' },
  { id: 5, name: 'Lab Fee', class_name: 'Class 9', amount: 2500, due_date: '2026-04-15', academic_year: '2025-26' },
  {
    id: 6,
    name: 'Transport Fee',
    class_name: 'All Classes',
    amount: 5000,
    due_date: '2026-04-15',
    academic_year: '2025-26',
  },
  {
    id: 7,
    name: 'Annual Fee',
    class_name: 'All Classes',
    amount: 8000,
    due_date: '2026-05-01',
    academic_year: '2025-26',
  },
]

const demoPayments: FeePayment[] = [
  {
    id: 1,
    student_id: 1,
    student_name: 'Aarav Sharma',
    class_name: 'Class 10',
    fee_name: 'Tuition Fee',
    total_amount: 15000,
    paid_amount: 15000,
    due_amount: 0,
    status: 'paid',
    payment_date: '2026-04-02',
    payment_method: 'upi',
    receipt_number: 'RCP-2026-001',
  },
  {
    id: 2,
    student_id: 2,
    student_name: 'Priya Patel',
    class_name: 'Class 10',
    fee_name: 'Tuition Fee',
    total_amount: 15000,
    paid_amount: 8000,
    due_amount: 7000,
    status: 'partial',
    payment_date: '2026-04-01',
    payment_method: 'cash',
    receipt_number: 'RCP-2026-002',
  },
  {
    id: 3,
    student_id: 3,
    student_name: 'Rohan Gupta',
    class_name: 'Class 9',
    fee_name: 'Tuition Fee',
    total_amount: 13000,
    paid_amount: 0,
    due_amount: 13000,
    status: 'unpaid',
    payment_date: null,
    payment_method: null,
    receipt_number: null,
  },
  {
    id: 4,
    student_id: 4,
    student_name: 'Ananya Singh',
    class_name: 'Class 9',
    fee_name: 'Tuition Fee',
    total_amount: 13000,
    paid_amount: 13000,
    due_amount: 0,
    status: 'paid',
    payment_date: '2026-03-30',
    payment_method: 'bank_transfer',
    receipt_number: 'RCP-2026-003',
  },
  {
    id: 5,
    student_id: 5,
    student_name: 'Karan Mehta',
    class_name: 'Class 8',
    fee_name: 'Tuition Fee',
    total_amount: 11000,
    paid_amount: 0,
    due_amount: 11000,
    status: 'unpaid',
    payment_date: null,
    payment_method: null,
    receipt_number: null,
  },
  {
    id: 6,
    student_id: 6,
    student_name: 'Sneha Reddy',
    class_name: 'Class 8',
    fee_name: 'Tuition Fee',
    total_amount: 11000,
    paid_amount: 5000,
    due_amount: 6000,
    status: 'partial',
    payment_date: '2026-04-01',
    payment_method: 'cash',
    receipt_number: 'RCP-2026-004',
  },
  {
    id: 7,
    student_id: 1,
    student_name: 'Aarav Sharma',
    class_name: 'Class 10',
    fee_name: 'Lab Fee',
    total_amount: 3000,
    paid_amount: 3000,
    due_amount: 0,
    status: 'paid',
    payment_date: '2026-04-02',
    payment_method: 'upi',
    receipt_number: 'RCP-2026-005',
  },
  {
    id: 8,
    student_id: 7,
    student_name: 'Arjun Kumar',
    class_name: 'Class 7',
    fee_name: 'Tuition Fee',
    total_amount: 9000,
    paid_amount: 0,
    due_amount: 9000,
    status: 'unpaid',
    payment_date: null,
    payment_method: null,
    receipt_number: null,
  },
  {
    id: 9,
    student_id: 9,
    student_name: 'Dev Nair',
    class_name: 'Class 6',
    fee_name: 'Tuition Fee',
    total_amount: 8000,
    paid_amount: 4000,
    due_amount: 4000,
    status: 'partial',
    payment_date: '2026-03-28',
    payment_method: 'cheque',
    receipt_number: 'RCP-2026-006',
  },
  {
    id: 10,
    student_id: 11,
    student_name: 'Aditya Verma',
    class_name: 'Class 10',
    fee_name: 'Tuition Fee',
    total_amount: 15000,
    paid_amount: 15000,
    due_amount: 0,
    status: 'paid',
    payment_date: '2026-04-01',
    payment_method: 'bank_transfer',
    receipt_number: 'RCP-2026-007',
  },
]

const RISK_DEMO_TAG = '[DEMO-RISK]'

export const useFeeStore = defineStore('fees', () => {
  const toast = useToastStore()
  const savedStructures = loadFromStorage<FeeStructure[]>('fee_structures')
  const savedPayments = loadFromStorage<FeePayment[]>('fee_payments')
  const structures = ref<FeeStructure[]>(savedStructures || [...demoStructures])
  const payments = ref<FeePayment[]>(savedPayments || [...demoPayments])
  const loading = ref(false)
  const searchQuery = ref('')
  const statusFilter = ref('')

  watch(structures, (val) => saveToStorage('fee_structures', val), { deep: true })
  watch(payments, (val) => saveToStorage('fee_payments', val), { deep: true })

  const filteredPayments = computed(() => {
    let result = payments.value
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(
        (p) =>
          p.student_name.toLowerCase().includes(q) ||
          p.fee_name.toLowerCase().includes(q) ||
          p.receipt_number?.toLowerCase().includes(q),
      )
    }
    if (statusFilter.value) {
      result = result.filter((p) => p.status === statusFilter.value)
    }
    return result
  })

  const duePayments = computed(() => payments.value.filter((p) => p.status === 'unpaid' || p.status === 'partial'))
  const riskDemoCount = computed(
    () =>
      payments.value.filter(
        (p) => p.fee_name.startsWith(RISK_DEMO_TAG) || (p.receipt_number || '').startsWith('DEMO-RISK-'),
      ).length,
  )
  const hasRiskDemoData = computed(() => riskDemoCount.value > 0)

  const totalCollected = computed(() => payments.value.reduce((sum, p) => sum + p.paid_amount, 0))

  const totalPending = computed(() => payments.value.reduce((sum, p) => sum + p.due_amount, 0))

  function shouldUseLocalMode() {
    return getOfflineMode() || !localStorage.getItem('auth_token')
  }

  async function fetchFees() {
    if (shouldUseLocalMode()) return
    loading.value = true
    try {
      const [structuresRes, paymentsRes] = await Promise.all([
        feeService.getStructures({ page: 1, per_page: 100 }),
        feeService.getPayments({ page: 1, per_page: 100 }),
      ])
      structures.value = (structuresRes.data as any).items || structuresRes.data
      payments.value = (paymentsRes.data as any).items || paymentsRes.data
    } catch {
      toast.error('Failed to load fee records')
    } finally {
      loading.value = false
    }
  }

  async function addStructure(data: Omit<FeeStructure, 'id'>) {
    if (!shouldUseLocalMode()) {
      loading.value = true
      try {
        const res = await feeService.createStructure(data)
        structures.value.push(res.data)
        toast.success('Fee structure created')
      } catch {
        toast.error('Failed to create fee structure')
      } finally {
        loading.value = false
      }
      return
    }

    structures.value.push({ ...data, id: Date.now() })
    toast.success('Fee structure created')
  }

  async function collectPayment(paymentId: number, amount: number, method: string) {
    const payment = payments.value.find((p) => p.id === paymentId)
    if (!payment) return

    // Cap amount to prevent overpayment
    const cappedAmount = Math.min(amount, payment.due_amount)
    if (cappedAmount <= 0) return

    if (!shouldUseLocalMode()) {
      loading.value = true
      try {
        const res = await feeService.collectPayment(
          {
            amount: cappedAmount,
            payment_method: method,
            payment_date: new Date().toISOString().split('T')[0],
          },
          paymentId,
        )
        const idx = payments.value.findIndex((p) => p.id === paymentId)
        if (idx !== -1) payments.value[idx] = res.data
        toast.success(`Payment of Rs ${cappedAmount.toLocaleString('en-IN')} collected`)
      } catch {
        toast.error('Failed to collect payment')
      } finally {
        loading.value = false
      }
      return
    }

    payment.paid_amount += cappedAmount
    payment.due_amount = payment.total_amount - payment.paid_amount
    payment.payment_method = method as FeePayment['payment_method']
    payment.payment_date = new Date().toISOString().split('T')[0]

    if (payment.due_amount <= 0) {
      payment.due_amount = 0
      payment.status = 'paid'
    } else {
      payment.status = 'partial'
    }

    if (!payment.receipt_number) {
      payment.receipt_number = `RCP-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`
    }

    toast.success(`Payment of ₹${amount.toLocaleString('en-IN')} collected`)
  }

  async function assignFee(studentId: number, studentName: string, className: string, structureId: number) {
    const structure = structures.value.find((s) => s.id === structureId)
    if (!structure) return

    const exists = payments.value.find((p) => p.student_id === studentId && p.fee_name === structure.name)
    if (exists) {
      toast.warning('Fee already assigned to this student')
      return
    }

    if (!shouldUseLocalMode()) {
      loading.value = true
      try {
        const res = await feeService.assignFee({
          student_id: studentId,
          fee_structure_id: structureId,
          total_amount: structure.amount,
          paid_amount: 0,
          payment_method: null,
          payment_date: null,
        })
        payments.value.push(res.data)
        toast.success('Fee assigned to student')
      } catch {
        toast.error('Failed to assign fee')
      } finally {
        loading.value = false
      }
      return
    }

    payments.value.push({
      id: Date.now(),
      student_id: studentId,
      student_name: studentName,
      class_name: className,
      fee_name: structure.name,
      total_amount: structure.amount,
      paid_amount: 0,
      due_amount: structure.amount,
      status: 'unpaid',
      payment_date: null,
      payment_method: null,
      receipt_number: null,
    })
    toast.success('Fee assigned to student')
  }

  function createRiskDemoData() {
    const existing = payments.value.filter((p) => p.fee_name.startsWith(RISK_DEMO_TAG))
    if (existing.length > 0) {
      toast.show('info', 'Risk demo data already exists')
      return
    }

    const today = new Date().toISOString().split('T')[0]
    const seed = Date.now()
    const records: FeePayment[] = [
      {
        id: seed + 1,
        student_id: 9001,
        student_name: 'Demo - Riya Kapoor',
        class_name: 'Class 10',
        fee_name: `${RISK_DEMO_TAG} Tuition`,
        total_amount: 24000,
        paid_amount: 3000,
        due_amount: 21000,
        status: 'partial',
        payment_date: today,
        payment_method: 'upi',
        receipt_number: 'DEMO-RISK-001',
      },
      {
        id: seed + 2,
        student_id: 9002,
        student_name: 'Demo - Kabir Das',
        class_name: 'Class 9',
        fee_name: `${RISK_DEMO_TAG} Annual`,
        total_amount: 12000,
        paid_amount: 0,
        due_amount: 12000,
        status: 'unpaid',
        payment_date: null,
        payment_method: null,
        receipt_number: null,
      },
      {
        id: seed + 3,
        student_id: 9003,
        student_name: 'Demo - Aarohi Jain',
        class_name: 'Class 8',
        fee_name: `${RISK_DEMO_TAG} Transport`,
        total_amount: 8000,
        paid_amount: 2500,
        due_amount: 5500,
        status: 'partial',
        payment_date: today,
        payment_method: 'cash',
        receipt_number: 'DEMO-RISK-003',
      },
      {
        id: seed + 4,
        student_id: 9004,
        student_name: 'Demo - Neel Verma',
        class_name: 'Class 7',
        fee_name: `${RISK_DEMO_TAG} Lab`,
        total_amount: 4500,
        paid_amount: 1000,
        due_amount: 3500,
        status: 'partial',
        payment_date: today,
        payment_method: 'cheque',
        receipt_number: 'DEMO-RISK-004',
      },
    ]

    payments.value.unshift(...records)
    toast.success(`Risk demo created (${records.length} records)`)
  }

  function clearRiskDemoData() {
    const before = payments.value.length
    payments.value = payments.value.filter(
      (p) => !p.fee_name.startsWith(RISK_DEMO_TAG) && !(p.receipt_number || '').startsWith('DEMO-RISK-'),
    )
    const removed = before - payments.value.length
    if (removed === 0) {
      toast.show('info', 'No risk demo data found')
      return
    }
    toast.success(`Risk demo cleaned (${removed} records removed)`)
  }

  return {
    structures,
    payments,
    loading,
    searchQuery,
    statusFilter,
    filteredPayments,
    duePayments,
    riskDemoCount,
    hasRiskDemoData,
    totalCollected,
    totalPending,
    fetchFees,
    addStructure,
    collectPayment,
    assignFee,
    createRiskDemoData,
    clearRiskDemoData,
  }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PayrollProfileRecord, PayrollRecord, PayrollSummary } from '@/types'
import { payrollService } from '@/services/payrollService'
import { useToastStore } from './toast'

export const usePayrollStore = defineStore('payroll', () => {
  const toast = useToastStore()
  const loading = ref(false)
  const summary = ref<PayrollSummary | null>(null)
  const profiles = ref<PayrollProfileRecord[]>([])
  const records = ref<PayrollRecord[]>([])

  async function loadDashboard(month: string, status?: 'pending' | 'paid') {
    loading.value = true
    try {
      const [summaryData, profilesData, recordsData] = await Promise.all([
        payrollService.getSummary(month),
        payrollService.listProfiles(),
        payrollService.listRecords({ month, status, page: 1, per_page: 100 }),
      ])
      summary.value = summaryData
      profiles.value = profilesData
      records.value = recordsData.items
    } catch {
      toast.error('Failed to load payroll workspace')
    } finally {
      loading.value = false
    }
  }

  async function saveProfile(
    staffId: number,
    payload: {
      base_salary: number
      allowances?: number
      deductions?: number
      payment_method?: string | null
      bank_name?: string | null
      bank_account_no?: string | null
      ifsc_code?: string | null
      pan_number?: string | null
      notes?: string | null
    },
  ) {
    loading.value = true
    try {
      const data = await payrollService.saveProfile(staffId, payload)
      const idx = profiles.value.findIndex((item) => item.staff_id === staffId)
      if (idx === -1) {
        profiles.value.unshift(data)
      } else {
        profiles.value[idx] = data
      }
      toast.success('Payroll profile saved')
      return data
    } catch {
      toast.error('Failed to save payroll profile')
      throw new Error('Failed to save payroll profile')
    } finally {
      loading.value = false
    }
  }

  async function generateMonth(month: string) {
    loading.value = true
    try {
      const data = await payrollService.generateMonth({ month })
      toast.success(
        `Payroll run complete: ${data.created} created, ${data.updated} refreshed, ${data.skipped_no_profile} missing profiles.`,
      )
      return data
    } catch {
      toast.error('Failed to generate payroll')
      throw new Error('Failed to generate payroll')
    } finally {
      loading.value = false
    }
  }

  async function markPaid(id: number, payload: { payment_reference?: string | null; notes?: string | null }) {
    loading.value = true
    try {
      const data = await payrollService.markPaid(id, payload)
      const idx = records.value.findIndex((item) => item.id === id)
      if (idx !== -1) {
        records.value[idx] = data
      }
      toast.success('Payroll marked as paid')
      return data
    } catch {
      toast.error('Failed to mark payroll as paid')
      throw new Error('Failed to mark payroll as paid')
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    summary,
    profiles,
    records,
    loadDashboard,
    saveProfile,
    generateMonth,
    markPaid,
  }
})

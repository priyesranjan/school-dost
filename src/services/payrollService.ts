import api from './api'
import type { PayrollGenerationReport, PayrollProfileRecord, PayrollRecord, PayrollSummary } from '@/types'

export const payrollService = {
  async getSummary(month: string) {
    const res = await api.get('/payroll/summary', { params: { month } })
    return res.data.data as PayrollSummary
  },

  async listProfiles() {
    const res = await api.get('/payroll/profiles')
    return res.data.data as PayrollProfileRecord[]
  },

  async saveProfile(
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
    const res = await api.put(`/payroll/profiles/${staffId}`, payload)
    return res.data.data as PayrollProfileRecord
  },

  async generateMonth(payload: { month: string; staff_ids?: number[] }) {
    const res = await api.post('/payroll/generate', payload)
    return res.data.data as PayrollGenerationReport
  },

  async listRecords(params: { month: string; status?: 'pending' | 'paid'; page?: number; per_page?: number }) {
    const res = await api.get('/payroll/records', { params })
    return res.data.data as {
      items: PayrollRecord[]
      total: number
      page: number
      per_page: number
    }
  },

  async markPaid(id: number, payload: { payment_reference?: string | null; notes?: string | null }) {
    const res = await api.post(`/payroll/records/${id}/mark-paid`, payload)
    return res.data.data as PayrollRecord
  },
}

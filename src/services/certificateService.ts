import api from './api'
import type { Certificate } from '@/types'

export interface CertificateVerificationResult {
  valid: boolean
  certificate_no: string
  student_name?: string
  class_name?: string
  type?: 'tc' | 'character'
  issue_date?: string
  issued_by?: string
}

export const certificateService = {
  async getAll(params?: { page?: number; per_page?: number; student_id?: number; type?: 'tc' | 'character' }) {
    const res = await api.get('/certificates', { params })
    return res.data.data
  },

  async issue(data: {
    certificate_no: string
    student_id: number
    type: 'tc' | 'character'
    issue_date: string
    issued_by?: string
    reason?: string | null
    conduct?: string | null
  }) {
    const res = await api.post('/certificates/issue', data)
    return res.data.data as Certificate
  },

  async verify(certificateNo: string) {
    const res = await api.get('/certificates/verify', {
      params: { no: certificateNo },
      skipAuthRefresh: true,
      skipLogoutOnAuthFailure: true,
    } as any)
    return res.data.data as CertificateVerificationResult
  },
}

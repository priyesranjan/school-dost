import api from './api'
import type { HrSummary, LeaveRequestRecord, PaginationParams, StaffAppraisalRecord } from '@/types'

export const hrService = {
  async getSummary() {
    const res = await api.get('/hr/summary')
    return res.data.data as HrSummary
  },

  async listLeaveRequests(
    params?: PaginationParams & {
      staff_id?: number
      status?: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed'
    },
  ) {
    const res = await api.get('/hr/leave-requests', { params })
    return res.data.data as {
      items: LeaveRequestRecord[]
      total: number
      page: number
      per_page: number
    }
  },

  async createLeaveRequest(payload: {
    staff_id?: number
    leave_type: string
    start_date: string
    end_date: string
    reason?: string | null
  }) {
    const res = await api.post('/hr/leave-requests', payload)
    return res.data.data as LeaveRequestRecord
  },

  async reviewLeaveRequest(
    id: number,
    payload: {
      status: 'approved' | 'rejected' | 'completed'
      decision_note?: string | null
    },
  ) {
    const res = await api.post(`/hr/leave-requests/${id}/review`, payload)
    return res.data.data as LeaveRequestRecord
  },

  async cancelLeaveRequest(id: number) {
    const res = await api.post(`/hr/leave-requests/${id}/cancel`)
    return res.data.data as LeaveRequestRecord
  },

  async listAppraisals(
    params?: PaginationParams & {
      staff_id?: number
      status?: 'draft' | 'published'
    },
  ) {
    const res = await api.get('/hr/appraisals', { params })
    return res.data.data as {
      items: StaffAppraisalRecord[]
      total: number
      page: number
      per_page: number
    }
  },

  async createAppraisal(payload: {
    staff_id: number
    review_period: string
    review_date: string
    overall_rating: number
    strengths?: string | null
    improvement_areas?: string | null
    goals?: string | null
    status?: 'draft' | 'published'
  }) {
    const res = await api.post('/hr/appraisals', payload)
    return res.data.data as StaffAppraisalRecord
  },

  async updateAppraisal(
    id: number,
    payload: {
      review_period?: string
      review_date?: string
      overall_rating?: number
      strengths?: string | null
      improvement_areas?: string | null
      goals?: string | null
      status?: 'draft' | 'published'
    },
  ) {
    const res = await api.patch(`/hr/appraisals/${id}`, payload)
    return res.data.data as StaffAppraisalRecord
  },
}

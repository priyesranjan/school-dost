import api from './api'
import type { AssignmentRecord, AssignmentSubmissionRecord, ClassroomResourceRecord, PaginationParams } from '@/types'

export const assignmentsService = {
  async list(params?: PaginationParams & { class_name?: string; status?: 'active' | 'completed' | 'archived' }) {
    const res = await api.get('/assignments', { params })
    return res.data.data as {
      items: AssignmentRecord[]
      total: number
      page: number
      per_page: number
    }
  },

  async create(payload: {
    title: string
    description?: string | null
    subject: string
    class_name: string
    due_date: string
    resource_url?: string | null
  }) {
    const res = await api.post('/assignments', payload)
    return res.data.data as AssignmentRecord
  },

  async listResources(params?: PaginationParams & { class_name?: string; subject?: string; resource_type?: ClassroomResourceRecord['resource_type'] }) {
    const res = await api.get('/assignments/resources', { params })
    return res.data.data as {
      items: ClassroomResourceRecord[]
      total: number
      page: number
      per_page: number
    }
  },

  async createResource(payload: {
    title: string
    description?: string | null
    class_name: string
    subject: string
    resource_type: ClassroomResourceRecord['resource_type']
    url: string
    assignment_id?: number | null
  }) {
    const res = await api.post('/assignments/resources', payload)
    return res.data.data as ClassroomResourceRecord
  },

  async updateStatus(id: number, status: 'active' | 'completed' | 'archived') {
    const res = await api.patch(`/assignments/${id}/status`, { status })
    return res.data.data as AssignmentRecord
  },

  async remove(id: number) {
    const res = await api.delete(`/assignments/${id}`)
    return res.data.data as { success: boolean }
  },

  async submit(
    id: number,
    payload: {
      submission_text?: string | null
      attachment_url?: string | null
    },
  ) {
    const res = await api.post(`/assignments/${id}/submissions`, payload)
    return res.data.data as AssignmentSubmissionRecord
  },

  async listSubmissions(id: number) {
    const res = await api.get(`/assignments/${id}/submissions`)
    return (res.data.data?.items || []) as AssignmentSubmissionRecord[]
  },

  async reviewSubmission(
    id: number,
    submissionId: number,
    payload: {
      status?: 'submitted' | 'reviewed' | 'returned'
      feedback?: string | null
      score?: number | null
    },
  ) {
    const res = await api.patch(`/assignments/${id}/submissions/${submissionId}/review`, payload)
    return res.data.data as AssignmentSubmissionRecord
  },
}

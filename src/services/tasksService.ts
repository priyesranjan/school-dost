import api from './api'
import type { StaffTask } from '@/types'

export const tasksService = {
  async getAll(params?: { page?: number; per_page?: number; staff_id?: number; status?: StaffTask['status'] }) {
    const res = await api.get('/tasks', { params })
    return res.data.data
  },

  async create(data: Omit<StaffTask, 'id' | 'created_at'>) {
    const res = await api.post('/tasks', data)
    return res.data.data as StaffTask
  },

  async updateStatus(id: number, status: StaffTask['status']) {
    const res = await api.patch(`/tasks/${id}/status`, { status })
    return res.data.data as StaffTask
  },
}

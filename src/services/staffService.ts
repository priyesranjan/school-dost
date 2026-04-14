import api from './api'
import type { StaffMember } from '@/stores/staff'

export const staffService = {
  async getAll(params?: { page?: number; per_page?: number; search?: string; role?: string }) {
    const res = await api.get('/staff', { params })
    return res.data.data
  },

  async getById(id: number) {
    const res = await api.get(`/staff/${id}`)
    return res.data.data
  },

  async create(data: Omit<StaffMember, 'id'>) {
    const res = await api.post('/staff', data)
    return res.data.data
  },

  async update(id: number, data: Partial<StaffMember>) {
    const res = await api.patch(`/staff/${id}`, data)
    return res.data.data
  },

  async delete(id: number) {
    await api.delete(`/staff/${id}`)
  },
}

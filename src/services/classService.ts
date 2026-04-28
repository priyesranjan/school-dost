import api from './api'
import type { ClassRecord } from '@/stores/classes'

export const classService = {
  async getAll(params?: { page?: number; per_page?: number; search?: string; academic_year?: string }) {
    const res = await api.get('/classes', { params })
    return res.data.data
  },

  async create(data: Omit<ClassRecord, 'id' | 'created_at'>) {
    const res = await api.post('/classes', data)
    return res.data.data as ClassRecord
  },

  async update(id: number, data: Partial<Omit<ClassRecord, 'id' | 'created_at' | 'sections'>>) {
    const res = await api.patch(`/classes/${id}`, data)
    return res.data.data as ClassRecord
  },

  async delete(id: number) {
    await api.delete(`/classes/${id}`)
  },

  async addSection(classId: number, data: { name: string; capacity: number }) {
    const res = await api.post(`/classes/${classId}/sections`, data)
    return res.data.data as ClassRecord
  },

  async updateSection(sectionId: number, data: { name?: string; capacity?: number }) {
    const res = await api.patch(`/classes/sections/${sectionId}`, data)
    return res.data.data as ClassRecord
  },

  async deleteSection(classId: number, sectionId: number) {
    const res = await api.delete(`/classes/${classId}/sections/${sectionId}`)
    return res.data.data as ClassRecord
  },
}

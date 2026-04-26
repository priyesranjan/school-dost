import api from './api'
import type { Student, StudentImportReport, ApiResponse, PaginationParams } from '@/types'

export const studentService = {
  getAll(params: PaginationParams): Promise<ApiResponse<Student[]>> {
    return api.get('/students', { params }).then((r) => r.data)
  },

  getById(id: number): Promise<ApiResponse<Student>> {
    return api.get(`/students/${id}`).then((r) => r.data)
  },

  create(data: Omit<Student, 'id'>): Promise<ApiResponse<Student>> {
    return api.post('/students', data).then((r) => r.data)
  },

  importCsv(data: { csv_text: string; skip_duplicates?: boolean }): Promise<ApiResponse<StudentImportReport>> {
    return api.post('/students/import', data).then((r) => r.data)
  },

  update(id: number, data: Partial<Student>): Promise<ApiResponse<Student>> {
    return api.patch(`/students/${id}`, data).then((r) => r.data)
  },

  delete(id: number): Promise<ApiResponse<null>> {
    return api.delete(`/students/${id}`).then((r) => r.data)
  },
}

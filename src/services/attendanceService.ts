import api from './api'
import type { AttendanceRecord, ApiResponse } from '@/types'

export const attendanceService = {
  getByDate(date: string, classId?: string): Promise<ApiResponse<AttendanceRecord[]>> {
    return api.get('/attendance', { params: { date, class: classId } }).then((r) => r.data)
  },

  markAttendance(records: { student_id: number; date: string; status: string }[]): Promise<ApiResponse<null>> {
    return api.post('/attendance/bulk', { records }).then((r) => r.data)
  },

  getReport(params: { from: string; to: string; class?: string }): Promise<ApiResponse<AttendanceRecord[]>> {
    return api.get('/attendance/report', { params }).then((r) => r.data)
  },
}

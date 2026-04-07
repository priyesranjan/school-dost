import api from './api'
import type { DashboardStats, ApiResponse } from '@/types'

export const dashboardService = {
  getStats(): Promise<ApiResponse<DashboardStats>> {
    return api.get('/dashboard/stats').then((r) => r.data)
  },
}

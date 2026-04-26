import api from './api'
import type { ApiResponse, EnterpriseAnalyticsOverview } from '@/types'

export const analyticsService = {
  getOverview(days = 30): Promise<ApiResponse<EnterpriseAnalyticsOverview>> {
    return api.get('/analytics/overview', { params: { days } }).then((r) => r.data)
  },
}
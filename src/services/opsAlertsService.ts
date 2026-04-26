import api from './api'
import type { ApiResponse, OpsAlertsSnapshot } from '@/types'

export const opsAlertsService = {
  getSnapshot(days = 7, limit = 200): Promise<ApiResponse<OpsAlertsSnapshot>> {
    return api.get('/ops-alerts', { params: { days, limit } }).then((r) => r.data)
  },
}
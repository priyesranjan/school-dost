import api from './api'
import type { ApiResponse, SmsLog } from '@/types'

export const smsService = {
  send(data: { phone: string; message: string }): Promise<ApiResponse<SmsLog>> {
    return api.post('/sms/send', data).then((r) => r.data)
  },

  sendBulk(data: { phones: string[]; message: string }): Promise<ApiResponse<SmsLog[]>> {
    return api.post('/sms/send-bulk', data).then((r) => r.data)
  },

  getLogs(params?: { page?: number; per_page?: number }): Promise<ApiResponse<SmsLog[]>> {
    return api.get('/sms/logs', { params }).then((r) => r.data)
  },
}

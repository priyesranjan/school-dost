import api from './api'
import type { ApiResponse, SmsLog } from '@/types'

export interface SendSmsPayload {
  phone: string
  student_name?: string
  message: string
  type?: SmsLog['type']
  channel?: 'sms' | 'whatsapp'
  template_id?: string
}

export interface SendBulkSmsPayload {
  recipients: Array<{
    phone: string
    student_name?: string
  }>
  message: string
  type?: SmsLog['type']
  channel?: 'sms' | 'whatsapp'
  template_id?: string
}

export const smsService = {
  send(data: SendSmsPayload): Promise<ApiResponse<SmsLog>> {
    return api.post('/sms/send', data).then((r) => r.data)
  },

  sendBulk(data: SendBulkSmsPayload): Promise<ApiResponse<SmsLog[]>> {
    return api.post('/sms/send-bulk', data).then((r) => r.data)
  },

  getLogs(params?: {
    page?: number
    per_page?: number
    status?: SmsLog['status']
    channel?: 'sms' | 'whatsapp'
    type?: SmsLog['type']
    phone?: string
  }): Promise<ApiResponse<{ items: SmsLog[]; total: number; page: number; per_page: number }>> {
    return api.get('/sms/logs', { params }).then((r) => r.data)
  },
}

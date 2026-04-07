import api from './api'
import type { FeeStructure, FeePayment, ApiResponse, PaginationParams } from '@/types'

export const feeService = {
  getStructures(params?: PaginationParams): Promise<ApiResponse<FeeStructure[]>> {
    return api.get('/fees/structures', { params }).then((r) => r.data)
  },

  createStructure(data: Omit<FeeStructure, 'id'>): Promise<ApiResponse<FeeStructure>> {
    return api.post('/fees/structures', data).then((r) => r.data)
  },

  getPayments(params: PaginationParams & { status?: string }): Promise<ApiResponse<FeePayment[]>> {
    return api.get('/fees/payments', { params }).then((r) => r.data)
  },

  collectPayment(data: {
    student_id: number
    fee_structure_id: number
    amount: number
    payment_method: string
  }): Promise<ApiResponse<FeePayment>> {
    return api.post('/fees/payments', data).then((r) => r.data)
  },

  getDueList(params?: PaginationParams): Promise<ApiResponse<FeePayment[]>> {
    return api.get('/fees/due', { params }).then((r) => r.data)
  },

  getReceipt(paymentId: number): Promise<ApiResponse<FeePayment>> {
    return api.get(`/fees/payments/${paymentId}/receipt`).then((r) => r.data)
  },
}

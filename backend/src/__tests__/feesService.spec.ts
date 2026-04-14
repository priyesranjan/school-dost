import { describe, it, expect, beforeEach } from 'vitest'
import { PrismaClient, Prisma } from '@prisma/client'
import { mockDeep, mockReset } from 'vitest-mock-extended'
import { createFeeStructure, createFeePayment, listFeeStructures, listFeePayments } from '../services/feesService'

const prismaMock = mockDeep<PrismaClient>()

describe('feesService', () => {
  beforeEach(() => {
    mockReset(prismaMock)
  })

  describe('createFeeStructure', () => {
    it('should create and return a formatted fee structure', async () => {
      const mockInput = {
        name: 'Tuition Term 1',
        class_name: 'Grade 10',
        amount: 5000,
        due_date: '2026-05-01',
        academic_year: '2026-27',
      }

      prismaMock.feeStructure.create.mockResolvedValue({
        id: 1n,
        name: mockInput.name,
        className: mockInput.class_name,
        amount: new Prisma.Decimal(mockInput.amount),
        dueDate: new Date(mockInput.due_date),
        academicYear: mockInput.academic_year,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const result = await createFeeStructure(prismaMock, mockInput)

      expect(prismaMock.feeStructure.create).toHaveBeenCalledOnce()
      expect(result.id).toBe(1)
      expect(result.amount).toBe(5000)
      expect(result.due_date).toBe('2026-05-01')
    })
  })

  describe('createFeePayment', () => {
    it('should mark status as paid when fully paid', async () => {
      const input = {
        student_id: 1,
        total_amount: 5000,
        paid_amount: 5000,
      }

      prismaMock.feePayment.create.mockResolvedValue({
        id: 42n,
        studentId: 1n,
        feeStructureId: null,
        totalAmount: new Prisma.Decimal(5000),
        paidAmount: new Prisma.Decimal(5000),
        dueAmount: new Prisma.Decimal(0),
        status: 'paid',
        paymentMethod: 'cash',
        paymentDate: new Date(),
        receiptNumber: 'RCPT-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const result = await createFeePayment(prismaMock, input)

      // It must be called with calculated dueAmount and status
      expect(prismaMock.feePayment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'paid',
            dueAmount: new Prisma.Decimal(0),
          }),
        }),
      )
      expect(result.status).toBe('paid')
      expect(result.due_amount).toBe(0)
    })

    it('should mark status as partial when partially paid', async () => {
      const input = {
        student_id: 1,
        total_amount: 5000,
        paid_amount: 2000,
      }

      prismaMock.feePayment.create.mockResolvedValue({
        id: 42n,
        studentId: 1n,
        feeStructureId: null,
        totalAmount: new Prisma.Decimal(5000),
        paidAmount: new Prisma.Decimal(2000),
        dueAmount: new Prisma.Decimal(3000),
        status: 'partial',
        paymentMethod: 'upi',
        paymentDate: new Date(),
        receiptNumber: 'RCPT-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const result = await createFeePayment(prismaMock, input)
      expect(prismaMock.feePayment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'partial',
            dueAmount: new Prisma.Decimal(3000),
          }),
        }),
      )
      expect(result.status).toBe('partial')
    })
  })
})

import { randomUUID } from 'node:crypto'
import { Prisma } from '@prisma/client'
import { prisma } from '../db/prisma'

type FeePaymentMethod = 'cash' | 'upi' | 'bank_transfer' | 'cheque'

function toDecimal(value: number | string) {
  return new Prisma.Decimal(value)
}

export async function createFeeStructure(input: {
  name: string
  class_name: string
  amount: number
  due_date: string
  academic_year: string
}) {
  const row = await prisma.feeStructure.create({
    data: {
      name: input.name,
      className: input.class_name,
      amount: toDecimal(input.amount),
      dueDate: new Date(input.due_date),
      academicYear: input.academic_year,
    },
  })

  return {
    id: Number(row.id),
    name: row.name,
    class_name: row.className,
    amount: Number(row.amount),
    due_date: row.dueDate.toISOString().slice(0, 10),
    academic_year: row.academicYear,
  }
}

export async function createFeePayment(input: {
  student_id: number
  fee_structure_id?: number | null
  total_amount: number
  paid_amount: number
  payment_method?: FeePaymentMethod | null
  payment_date?: string | null
}) {
  const dueAmount = Math.max(0, Number(input.total_amount) - Number(input.paid_amount))
  const status = dueAmount <= 0 ? 'paid' : input.paid_amount > 0 ? 'partial' : 'unpaid'

  const row = await prisma.feePayment.create({
    data: {
      studentId: BigInt(input.student_id),
      feeStructureId: input.fee_structure_id ? BigInt(input.fee_structure_id) : null,
      totalAmount: toDecimal(input.total_amount),
      paidAmount: toDecimal(input.paid_amount),
      dueAmount: toDecimal(dueAmount),
      status,
      paymentDate: input.payment_date ? new Date(input.payment_date) : new Date(),
      paymentMethod: input.payment_method || null,
      receiptNumber: `RCPT-${randomUUID().replace(/-/g, '').slice(0, 16).toUpperCase()}`,
    },
  })

  return {
    id: Number(row.id),
    student_id: Number(row.studentId),
    fee_structure_id: row.feeStructureId ? Number(row.feeStructureId) : null,
    total_amount: Number(row.totalAmount),
    paid_amount: Number(row.paidAmount),
    due_amount: Number(row.dueAmount),
    status: row.status,
    payment_date: row.paymentDate ? row.paymentDate.toISOString() : null,
    payment_method: row.paymentMethod,
    receipt_number: row.receiptNumber,
  }
}

export async function listFeeStructures(input: {
  page: number
  per_page: number
  class_name?: string
  academic_year?: string
}) {
  const where = {
    ...(input.class_name ? { className: input.class_name } : {}),
    ...(input.academic_year ? { academicYear: input.academic_year } : {}),
  }

  const [rows, total] = await Promise.all([
    prisma.feeStructure.findMany({
      where,
      orderBy: [{ dueDate: 'asc' }],
      skip: (input.page - 1) * input.per_page,
      take: input.per_page,
    }),
    prisma.feeStructure.count({ where }),
  ])

  return {
    items: rows.map((row) => ({
      id: Number(row.id),
      name: row.name,
      class_name: row.className,
      amount: Number(row.amount),
      due_date: row.dueDate.toISOString().slice(0, 10),
      academic_year: row.academicYear,
    })),
    total,
    page: input.page,
    per_page: input.per_page,
  }
}

export async function listFeePayments(input: {
  page: number
  per_page: number
  student_id?: number
  status?: 'paid' | 'partial' | 'unpaid'
}) {
  const where = {
    ...(input.student_id ? { studentId: BigInt(input.student_id) } : {}),
    ...(input.status ? { status: input.status } : {}),
  }

  const [rows, total] = await Promise.all([
    prisma.feePayment.findMany({
      where,
      include: {
        student: {
          select: { name: true, className: true },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
      skip: (input.page - 1) * input.per_page,
      take: input.per_page,
    }),
    prisma.feePayment.count({ where }),
  ])

  return {
    items: rows.map((row) => ({
      id: Number(row.id),
      student_id: Number(row.studentId),
      student_name: row.student.name,
      class_name: row.student.className,
      fee_structure_id: row.feeStructureId ? Number(row.feeStructureId) : null,
      total_amount: Number(row.totalAmount),
      paid_amount: Number(row.paidAmount),
      due_amount: Number(row.dueAmount),
      status: row.status,
      payment_date: row.paymentDate ? row.paymentDate.toISOString() : null,
      payment_method: row.paymentMethod,
      receipt_number: row.receiptNumber,
    })),
    total,
    page: input.page,
    per_page: input.per_page,
  }
}

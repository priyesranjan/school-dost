import { randomUUID } from 'node:crypto'
import { Prisma, type PrismaClient } from '@prisma/client'

type FeePaymentMethod = 'cash' | 'upi' | 'bank_transfer' | 'cheque'

function toDecimal(value: number | string) {
  return new Prisma.Decimal(value)
}

function mapFeeStructure(row: any) {
  return {
    id: Number(row.id),
    name: row.name,
    class_name: row.className,
    amount: Number(row.amount),
    due_date: row.dueDate.toISOString().slice(0, 10),
    academic_year: row.academicYear,
  }
}

function mapFeePayment(row: any) {
  return {
    id: Number(row.id),
    student_id: Number(row.studentId),
    student_name: row.student?.name || '',
    class_name: row.student?.className || '',
    fee_structure_id: row.feeStructureId ? Number(row.feeStructureId) : null,
    fee_name: row.feeStructure?.name || 'Custom Fee',
    total_amount: Number(row.totalAmount),
    paid_amount: Number(row.paidAmount),
    due_amount: Number(row.dueAmount),
    status: row.status,
    payment_date: row.paymentDate ? row.paymentDate.toISOString().slice(0, 10) : null,
    payment_method: row.paymentMethod,
    receipt_number: row.receiptNumber,
  }
}

export async function createFeeStructure(
  db: PrismaClient,
  input: {
    name: string
    class_name: string
    amount: number
    due_date: string
    academic_year: string
  },
) {
  const row = await db.feeStructure.create({
    data: {
      name: input.name,
      className: input.class_name,
      amount: toDecimal(input.amount),
      dueDate: new Date(input.due_date),
      academicYear: input.academic_year,
    },
  })

  return mapFeeStructure(row)
}

export async function createFeePayment(
  db: PrismaClient,
  input: {
    student_id: number
    fee_structure_id?: number | null
    total_amount: number
    paid_amount: number
    payment_method?: FeePaymentMethod | null
    payment_date?: string | null
  },
) {
  const dueAmount = Math.max(0, Number(input.total_amount) - Number(input.paid_amount))
  const status = dueAmount <= 0 ? 'paid' : input.paid_amount > 0 ? 'partial' : 'unpaid'

  const row = await db.feePayment.create({
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
    include: {
      student: { select: { name: true, className: true } },
      feeStructure: { select: { name: true } },
    },
  })

  return mapFeePayment(row)
}

export async function listFeeStructures(
  db: PrismaClient,
  input: {
    page: number
    per_page: number
    class_name?: string
    academic_year?: string
  },
) {
  const where = {
    ...(input.class_name ? { className: input.class_name } : {}),
    ...(input.academic_year ? { academicYear: input.academic_year } : {}),
  }

  const [rows, total] = await Promise.all([
    db.feeStructure.findMany({
      where,
      orderBy: [{ dueDate: 'asc' }],
      skip: (input.page - 1) * input.per_page,
      take: input.per_page,
    }),
    db.feeStructure.count({ where }),
  ])

  return {
    items: rows.map(mapFeeStructure),
    total,
    page: input.page,
    per_page: input.per_page,
  }
}

export async function listFeePayments(
  db: PrismaClient,
  input: {
    page: number
    per_page: number
    student_id?: number
    status?: 'paid' | 'partial' | 'unpaid'
  },
) {
  const where = {
    ...(input.student_id ? { studentId: BigInt(input.student_id) } : {}),
    ...(input.status ? { status: input.status } : {}),
  }

  const [rows, total] = await Promise.all([
    db.feePayment.findMany({
      where,
      include: {
        student: {
          select: { name: true, className: true },
        },
        feeStructure: {
          select: { name: true },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
      skip: (input.page - 1) * input.per_page,
      take: input.per_page,
    }),
    db.feePayment.count({ where }),
  ])

  return {
    items: rows.map(mapFeePayment),
    total,
    page: input.page,
    per_page: input.per_page,
  }
}

export async function getFeePayment(db: PrismaClient, id: number) {
  const row = await db.feePayment.findUnique({
    where: { id },
    include: {
      student: { select: { name: true, className: true } },
      feeStructure: { select: { name: true } },
    },
  })
  return row ? mapFeePayment(row) : null
}

export async function collectFeePayment(
  db: PrismaClient,
  id: number,
  input: {
    amount: number
    payment_method: FeePaymentMethod
    payment_date?: string | null
  },
) {
  const current = await db.feePayment.findUnique({ where: { id } })
  if (!current) throw new Error('Fee payment not found')

  const currentPaid = Number(current.paidAmount)
  const currentDue = Number(current.dueAmount)
  const amount = Math.min(Number(input.amount), currentDue)
  if (amount <= 0) throw new Error('Payment amount must be positive')

  const paidAmount = currentPaid + amount
  const dueAmount = Math.max(0, currentDue - amount)
  const status = dueAmount <= 0 ? 'paid' : 'partial'

  const row = await db.feePayment.update({
    where: { id },
    data: {
      paidAmount: toDecimal(paidAmount),
      dueAmount: toDecimal(dueAmount),
      status,
      paymentMethod: input.payment_method,
      paymentDate: input.payment_date ? new Date(input.payment_date) : new Date(),
      receiptNumber: current.receiptNumber || `RCPT-${randomUUID().replace(/-/g, '').slice(0, 16).toUpperCase()}`,
    },
    include: {
      student: { select: { name: true, className: true } },
      feeStructure: { select: { name: true } },
    },
  })

  return mapFeePayment(row)
}

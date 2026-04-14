import type { PrismaClient } from '@prisma/client'

export async function getDashboardSummary(db: PrismaClient) {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000)

  const [totalStudents, feeAgg, pendingAgg, attendanceToday, recentPayments, feeAlerts] = await Promise.all([
    db.student.count({ where: { status: 'active' } }),
    db.feePayment.aggregate({ _sum: { paidAmount: true } }),
    db.feePayment.aggregate({ _sum: { dueAmount: true } }),
    db.attendanceRecord.count({
      where: {
        date: { gte: start, lt: end },
        status: 'present',
      },
    }),
    db.feePayment.findMany({
      include: {
        student: { select: { name: true, className: true } },
      },
      orderBy: [{ paymentDate: 'desc' }, { createdAt: 'desc' }],
      take: 5,
    }),
    db.feePayment.findMany({
      where: { dueAmount: { gt: 0 } },
      include: {
        student: { select: { name: true, className: true } },
      },
      orderBy: [{ dueAmount: 'desc' }],
      take: 5,
    }),
  ])

  return {
    total_students: totalStudents,
    total_fees_collected: Number(feeAgg._sum.paidAmount || 0),
    pending_fees: Number(pendingAgg._sum.dueAmount || 0),
    attendance_today: attendanceToday,
    recent_payments: recentPayments.map((row) => ({
      id: Number(row.id),
      student_id: Number(row.studentId),
      student_name: row.student.name,
      class_name: row.student.className,
      fee_name: 'Fee Payment',
      total_amount: Number(row.totalAmount),
      paid_amount: Number(row.paidAmount),
      due_amount: Number(row.dueAmount),
      status: row.status,
      payment_date: row.paymentDate ? row.paymentDate.toISOString() : null,
      payment_method: row.paymentMethod,
      receipt_number: row.receiptNumber,
    })),
    fee_alerts: feeAlerts.map((row) => ({
      id: Number(row.id),
      student_id: Number(row.studentId),
      student_name: row.student.name,
      class_name: row.student.className,
      fee_name: 'Pending Fee',
      total_amount: Number(row.totalAmount),
      paid_amount: Number(row.paidAmount),
      due_amount: Number(row.dueAmount),
      status: row.status,
      payment_date: row.paymentDate ? row.paymentDate.toISOString() : null,
      payment_method: row.paymentMethod,
      receipt_number: row.receiptNumber,
    })),
  }
}

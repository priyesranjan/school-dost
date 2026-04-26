import type { PrismaClient } from '@prisma/client'

const DAY_MS = 24 * 60 * 60 * 1000

type RiskLevel = 'low' | 'medium' | 'high'

type ClassAccumulator = {
  class_name: string
  students: number
  collected: number
  outstanding: number
  attendance_present: number
  attendance_total: number
  exam_percentage_sum: number
  exam_attempts: number
}

function round2(value: number): number {
  return Math.round(value * 100) / 100
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function toMonthKey(date: Date): string {
  return date.toISOString().slice(0, 7)
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function upsertClass(map: Map<string, ClassAccumulator>, className: string): ClassAccumulator {
  const existing = map.get(className)
  if (existing) return existing

  const created: ClassAccumulator = {
    class_name: className,
    students: 0,
    collected: 0,
    outstanding: 0,
    attendance_present: 0,
    attendance_total: 0,
    exam_percentage_sum: 0,
    exam_attempts: 0,
  }
  map.set(className, created)
  return created
}

function calcRiskLevel(score: number): RiskLevel {
  if (score >= 75) return 'high'
  if (score >= 50) return 'medium'
  return 'low'
}

export async function getEnterpriseAnalyticsOverview(db: PrismaClient, requestedDays?: number) {
  const safeDays = clamp(Number.isFinite(requestedDays || NaN) ? Math.floor(Number(requestedDays)) : 30, 7, 365)

  const now = new Date()
  const endExclusive = new Date(now)
  endExclusive.setHours(0, 0, 0, 0)
  endExclusive.setDate(endExclusive.getDate() + 1)

  const periodStart = new Date(endExclusive.getTime() - safeDays * DAY_MS)
  const trendMonthStart = new Date(now.getFullYear(), now.getMonth() - 5, 1)

  const [activeStudents, classCounts, feeRows, attendanceRows, examRows] = await Promise.all([
    db.student.count({ where: { status: 'active' } }),
    db.student.groupBy({
      by: ['className'],
      where: { status: 'active' },
      _count: { _all: true },
    }),
    db.feePayment.findMany({
      select: {
        studentId: true,
        paidAmount: true,
        dueAmount: true,
        paymentDate: true,
        createdAt: true,
        student: { select: { className: true } },
      },
    }),
    db.attendanceRecord.findMany({
      where: {
        date: {
          gte: periodStart,
          lt: endExclusive,
        },
      },
      select: {
        studentId: true,
        date: true,
        status: true,
        student: { select: { className: true } },
      },
      orderBy: [{ date: 'asc' }],
    }),
    db.examResult.findMany({
      where: {
        exam: {
          date: {
            gte: periodStart,
            lt: endExclusive,
          },
        },
      },
      select: {
        examId: true,
        studentId: true,
        marksObtained: true,
        student: { select: { className: true } },
        exam: {
          select: {
            subject: true,
            maxMarks: true,
          },
        },
      },
    }),
  ])

  const classes = new Map<string, ClassAccumulator>()
  for (const row of classCounts) {
    const metric = upsertClass(classes, row.className)
    metric.students = row._count._all
  }

  const feesByMonth = new Map<string, { month: string; collected: number; due: number; transactions: number }>()
  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = toMonthKey(monthDate)
    feesByMonth.set(key, { month: key, collected: 0, due: 0, transactions: 0 })
  }

  let feesCollected = 0
  let feesPending = 0

  const dueByStudent = new Map<number, number>()
  const lastPaymentByStudent = new Map<number, Date>()

  for (const row of feeRows) {
    const paid = Number(row.paidAmount || 0)
    const due = Number(row.dueAmount || 0)
    const studentId = Number(row.studentId)
    const className = row.student.className

    feesCollected += paid
    feesPending += due

    const classMetric = upsertClass(classes, className)
    classMetric.collected += paid
    classMetric.outstanding += due

    dueByStudent.set(studentId, (dueByStudent.get(studentId) || 0) + due)

    if (paid > 0) {
      const paymentMoment = row.paymentDate || row.createdAt
      if (paymentMoment) {
        const previous = lastPaymentByStudent.get(studentId)
        if (!previous || paymentMoment > previous) {
          lastPaymentByStudent.set(studentId, paymentMoment)
        }
      }
    }

    const trendDate = row.paymentDate || row.createdAt
    if (trendDate >= trendMonthStart && trendDate < endExclusive) {
      const key = toMonthKey(trendDate)
      const bucket = feesByMonth.get(key)
      if (bucket) {
        bucket.collected += paid
        bucket.due += due
        bucket.transactions += 1
      }
    }
  }

  const attendanceByDay = new Map<
    string,
    {
      date: string
      present: number
      absent: number
      late: number
      attendance_rate: number
    }
  >()
  const absentByStudent = new Map<number, number>()

  let attendanceTotal = 0
  let attendancePresent = 0

  for (const row of attendanceRows) {
    const key = toDateKey(row.date)
    const bucket =
      attendanceByDay.get(key) ||
      ({ date: key, present: 0, absent: 0, late: 0, attendance_rate: 0 } as {
        date: string
        present: number
        absent: number
        late: number
        attendance_rate: number
      })

    if (row.status === 'present') bucket.present += 1
    if (row.status === 'absent') bucket.absent += 1
    if (row.status === 'late') bucket.late += 1
    attendanceByDay.set(key, bucket)

    const classMetric = upsertClass(classes, row.student.className)
    classMetric.attendance_total += 1
    if (row.status === 'present') {
      classMetric.attendance_present += 1
      attendancePresent += 1
    }
    if (row.status === 'absent') {
      absentByStudent.set(Number(row.studentId), (absentByStudent.get(Number(row.studentId)) || 0) + 1)
    }
    attendanceTotal += 1
  }

  for (const item of attendanceByDay.values()) {
    const total = item.present + item.absent + item.late
    item.attendance_rate = total > 0 ? round2((item.present / total) * 100) : 0
  }

  const subjectAccumulator = new Map<string, { total_percentage: number; attempts: number; exam_ids: Set<number> }>()
  const examByStudent = new Map<number, { total_percentage: number; attempts: number }>()

  let examTotalPercentage = 0
  let examTotalAttempts = 0

  for (const row of examRows) {
    if (row.exam.maxMarks <= 0) continue

    const percentage = (row.marksObtained / row.exam.maxMarks) * 100
    const classMetric = upsertClass(classes, row.student.className)
    classMetric.exam_percentage_sum += percentage
    classMetric.exam_attempts += 1

    examTotalPercentage += percentage
    examTotalAttempts += 1

    const subject = row.exam.subject
    const subjectRow =
      subjectAccumulator.get(subject) ||
      ({ total_percentage: 0, attempts: 0, exam_ids: new Set<number>() } as {
        total_percentage: number
        attempts: number
        exam_ids: Set<number>
      })
    subjectRow.total_percentage += percentage
    subjectRow.attempts += 1
    subjectRow.exam_ids.add(Number(row.examId))
    subjectAccumulator.set(subject, subjectRow)

    const studentId = Number(row.studentId)
    const studentExam = examByStudent.get(studentId) || { total_percentage: 0, attempts: 0 }
    studentExam.total_percentage += percentage
    studentExam.attempts += 1
    examByStudent.set(studentId, studentExam)
  }

  const classAnalytics = Array.from(classes.values())
    .map((row) => {
      const feeBase = row.collected + row.outstanding
      return {
        class_name: row.class_name,
        students: row.students,
        collected: round2(row.collected),
        outstanding: round2(row.outstanding),
        fee_recovery_rate: feeBase > 0 ? round2((row.collected / feeBase) * 100) : 0,
        attendance_rate: row.attendance_total > 0 ? round2((row.attendance_present / row.attendance_total) * 100) : 0,
        exam_average_score: row.exam_attempts > 0 ? round2(row.exam_percentage_sum / row.exam_attempts) : 0,
      }
    })
    .sort((a, b) => a.class_name.localeCompare(b.class_name, 'en', { numeric: true }))

  const subjects = Array.from(subjectAccumulator.entries())
    .map(([subject, row]) => ({
      subject,
      avg_percentage: row.attempts > 0 ? round2(row.total_percentage / row.attempts) : 0,
      exams_count: row.exam_ids.size,
      attempts: row.attempts,
    }))
    .sort((a, b) => b.avg_percentage - a.avg_percentage)

  const candidateIds = new Set<number>()
  dueByStudent.forEach((_, id) => candidateIds.add(id))
  absentByStudent.forEach((_, id) => candidateIds.add(id))
  examByStudent.forEach((_, id) => candidateIds.add(id))

  const candidateStudents =
    candidateIds.size > 0
      ? await db.student.findMany({
          where: {
            id: {
              in: Array.from(candidateIds).map((id) => BigInt(id)),
            },
            status: 'active',
          },
          select: {
            id: true,
            name: true,
            className: true,
          },
        })
      : []

  const riskStudents = candidateStudents
    .map((student) => {
      const id = Number(student.id)
      const dueAmount = dueByStudent.get(id) || 0
      const absentDays = absentByStudent.get(id) || 0
      const exam = examByStudent.get(id)
      const examAverage = exam && exam.attempts > 0 ? exam.total_percentage / exam.attempts : null
      const lastPayment = lastPaymentByStudent.get(id)

      const dueScore = clamp((dueAmount / 15000) * 45, 0, 45)
      const absenceScore = clamp((absentDays / safeDays) * 40, 0, 40)

      let inactivityScore = 0
      if (dueAmount > 0) {
        if (!lastPayment) {
          inactivityScore = 15
        } else {
          const inactiveDays = Math.max(0, Math.floor((now.getTime() - lastPayment.getTime()) / DAY_MS))
          if (inactiveDays >= 45) inactivityScore = 15
          else if (inactiveDays >= 20) inactivityScore = 10
          else if (inactiveDays >= 10) inactivityScore = 5
        }
      }

      let examScore = 0
      if (examAverage !== null) {
        if (examAverage < 40) examScore = 15
        else if (examAverage < 55) examScore = 10
        else if (examAverage < 65) examScore = 5
      }

      const riskScore = Math.round(clamp(dueScore + absenceScore + inactivityScore + examScore, 0, 100))
      const riskLevel = calcRiskLevel(riskScore)

      return {
        student_id: id,
        student_name: student.name,
        class_name: student.className,
        fee_due_amount: round2(dueAmount),
        absent_days: absentDays,
        last_payment_date: lastPayment ? toDateKey(lastPayment) : null,
        exam_average_score: examAverage === null ? null : round2(examAverage),
        risk_score: riskScore,
        risk_level: riskLevel,
      }
    })
    .filter((row) => row.risk_score >= 25 || row.fee_due_amount > 0 || row.absent_days >= 2)
    .sort((a, b) => b.risk_score - a.risk_score || b.fee_due_amount - a.fee_due_amount)
    .slice(0, 10)

  const feeRecoveryRateBase = feesCollected + feesPending
  const kpis = {
    students_active: activeStudents,
    fees_collected: round2(feesCollected),
    fees_pending: round2(feesPending),
    fee_recovery_rate: feeRecoveryRateBase > 0 ? round2((feesCollected / feeRecoveryRateBase) * 100) : 0,
    attendance_rate: attendanceTotal > 0 ? round2((attendancePresent / attendanceTotal) * 100) : 0,
    exam_average_score: examTotalAttempts > 0 ? round2(examTotalPercentage / examTotalAttempts) : 0,
  }

  return {
    period_days: safeDays,
    generated_at: now.toISOString(),
    kpis,
    trends: {
      fees_by_month: Array.from(feesByMonth.values()),
      attendance_by_day: Array.from(attendanceByDay.values()),
      exam_performance_by_subject: subjects,
    },
    class_analytics: classAnalytics,
    risk_students: riskStudents,
  }
}
import { Prisma, type PrismaClient } from '@prisma/client'

export async function createAttendance(
  db: PrismaClient,
  input: {
    student_id: number
    date: string
    status: 'present' | 'absent' | 'late'
  },
) {
  try {
    const row = await db.attendanceRecord.create({
      data: {
        studentId: BigInt(input.student_id),
        date: new Date(input.date),
        status: input.status,
      },
    })

    return {
      ok: true as const,
      data: {
        id: Number(row.id),
        student_id: Number(row.studentId),
        date: row.date.toISOString().slice(0, 10),
        status: row.status,
      },
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return {
        ok: false as const,
        code: 'ATTENDANCE_ALREADY_EXISTS',
        message: 'Attendance already recorded for this student and date',
      }
    }
    throw error
  }
}

export async function bulkCreateAttendance(
  db: PrismaClient,
  records: { student_id: number; date: string; status: 'present' | 'absent' | 'late' }[],
) {
  const results: { ok: boolean; student_id: number; date: string; status: string; error?: string }[] = []

  for (const rec of records) {
    try {
      const row = await db.attendanceRecord.upsert({
        where: {
          studentId_date: {
            studentId: BigInt(rec.student_id),
            date: new Date(rec.date),
          },
        },
        update: { status: rec.status },
        create: {
          studentId: BigInt(rec.student_id),
          date: new Date(rec.date),
          status: rec.status,
        },
      })
      results.push({
        ok: true,
        student_id: Number(row.studentId),
        date: row.date.toISOString().slice(0, 10),
        status: row.status,
      })
    } catch (err) {
      results.push({
        ok: false,
        student_id: rec.student_id,
        date: rec.date,
        status: rec.status,
        error: err instanceof Error ? err.message : 'Failed',
      })
    }
  }

  return { results, total: records.length, saved: results.filter((r) => r.ok).length }
}

export async function listAttendance(
  db: PrismaClient,
  input: {
    page: number
    per_page: number
    student_id?: number
    date?: string
    status?: 'present' | 'absent' | 'late'
  },
) {
  const where = {
    ...(input.student_id ? { studentId: BigInt(input.student_id) } : {}),
    ...(input.status ? { status: input.status } : {}),
    ...(input.date
      ? {
          date: {
            gte: new Date(input.date),
            lt: new Date(new Date(input.date).getTime() + 24 * 60 * 60 * 1000),
          },
        }
      : {}),
  }

  const [rows, total] = await Promise.all([
    db.attendanceRecord.findMany({
      where,
      include: {
        student: {
          select: { name: true, rollNumber: true },
        },
      },
      orderBy: [{ date: 'desc' }],
      skip: (input.page - 1) * input.per_page,
      take: input.per_page,
    }),
    db.attendanceRecord.count({ where }),
  ])

  return {
    items: rows.map((row) => ({
      id: Number(row.id),
      student_id: Number(row.studentId),
      student_name: row.student.name,
      roll_number: row.student.rollNumber,
      date: row.date.toISOString().slice(0, 10),
      status: row.status,
    })),
    total,
    page: input.page,
    per_page: input.per_page,
  }
}

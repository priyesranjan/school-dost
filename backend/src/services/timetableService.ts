import { Prisma, type PrismaClient } from '@prisma/client'

type TimetableDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'

export async function createTimetableEntry(
  db: PrismaClient,
  input: {
    class_name: string
    day: TimetableDay
    period: string
    subject: string
    teacher: string
    start_time: string
    end_time: string
    send_sms?: boolean
  },
) {
  try {
    const entry = await db.timetableEntry.create({
      data: {
        className: input.class_name,
        day: input.day,
        period: input.period,
        subject: input.subject,
        teacher: input.teacher,
        startTime: input.start_time,
        endTime: input.end_time,
      },
    })

    return {
      ok: true as const,
      data: {
        id: Number(entry.id),
        class_name: entry.className,
        day: entry.day,
        period: entry.period,
        subject: entry.subject,
        teacher: entry.teacher,
        start_time: entry.startTime,
        end_time: entry.endTime,
        send_sms: Boolean(input.send_sms),
        created_at: entry.createdAt.toISOString(),
      },
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return {
        ok: false as const,
        code: 'TIMETABLE_SLOT_EXISTS',
        message: 'Timetable slot already exists for class/day/period',
      }
    }
    throw error
  }
}

export async function listTimetableEntries(
  db: PrismaClient,
  input: {
    page: number
    per_page: number
    class_name?: string
    day?: TimetableDay
  },
) {
  const where = {
    ...(input.class_name ? { className: input.class_name } : {}),
    ...(input.day ? { day: input.day } : {}),
  }

  const [rows, total] = await Promise.all([
    db.timetableEntry.findMany({
      where,
      orderBy: [{ className: 'asc' }, { day: 'asc' }, { period: 'asc' }],
      skip: (input.page - 1) * input.per_page,
      take: input.per_page,
    }),
    db.timetableEntry.count({ where }),
  ])

  return {
    items: rows.map((row) => ({
      id: Number(row.id),
      class_name: row.className,
      day: row.day,
      period: row.period,
      subject: row.subject,
      teacher: row.teacher,
      start_time: row.startTime,
      end_time: row.endTime,
    })),
    total,
    page: input.page,
    per_page: input.per_page,
  }
}

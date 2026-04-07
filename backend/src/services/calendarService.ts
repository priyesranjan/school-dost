import { prisma } from '../db/prisma'

type EventType = 'holiday' | 'exam' | 'event' | 'pta' | 'sports'

export async function createCalendarEvent(input: {
  title: string
  date: string
  end_date?: string | null
  type: EventType
  description?: string | null
}) {
  const row = await prisma.calendarEvent.create({
    data: {
      title: input.title,
      date: new Date(input.date),
      endDate: input.end_date ? new Date(input.end_date) : null,
      type: input.type,
      description: input.description || null,
    },
  })
  return {
    id: Number(row.id),
    title: row.title,
    date: row.date.toISOString().slice(0, 10),
    end_date: row.endDate ? row.endDate.toISOString().slice(0, 10) : null,
    type: row.type,
    description: row.description,
  }
}

export async function listCalendarEvents(input: {
  page: number
  per_page: number
  type?: EventType
  from?: string
  to?: string
}) {
  const where = {
    ...(input.type ? { type: input.type } : {}),
    ...(input.from || input.to
      ? {
          date: {
            ...(input.from ? { gte: new Date(input.from) } : {}),
            ...(input.to ? { lte: new Date(input.to) } : {}),
          },
        }
      : {}),
  }
  const [rows, total] = await Promise.all([
    prisma.calendarEvent.findMany({
      where,
      orderBy: [{ date: 'asc' }],
      skip: (input.page - 1) * input.per_page,
      take: input.per_page,
    }),
    prisma.calendarEvent.count({ where }),
  ])
  return {
    items: rows.map((row) => ({
      id: Number(row.id),
      title: row.title,
      date: row.date.toISOString().slice(0, 10),
      end_date: row.endDate ? row.endDate.toISOString().slice(0, 10) : null,
      type: row.type,
      description: row.description,
    })),
    total,
    page: input.page,
    per_page: input.per_page,
  }
}

export async function deleteCalendarEvent(id: number) {
  await prisma.calendarEvent.delete({ where: { id: BigInt(id) } })
}

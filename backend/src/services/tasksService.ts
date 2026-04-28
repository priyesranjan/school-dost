import type { PrismaClient } from '@prisma/client'

function mapTask(row: any) {
  return {
    id: Number(row.id),
    staff_id: Number(row.staffId),
    title: row.title,
    description: row.description || '',
    priority: row.priority,
    status: row.status,
    due_date: row.dueDate.toISOString().slice(0, 10),
    created_at: row.createdAt.toISOString().slice(0, 10),
  }
}

export async function listStaffTasks(
  db: PrismaClient,
  input: { page: number; per_page: number; staff_id?: number; status?: string },
) {
  const where: any = {
    ...(input.staff_id ? { staffId: BigInt(input.staff_id) } : {}),
    ...(input.status ? { status: input.status } : {}),
  }

  const client = db as any
  const [rows, total] = await Promise.all([
    client.staffTask.findMany({
      where,
      orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
      skip: (input.page - 1) * input.per_page,
      take: input.per_page,
    }),
    client.staffTask.count({ where }),
  ])

  return { items: rows.map(mapTask), total, page: input.page, per_page: input.per_page }
}

export async function createStaffTask(
  db: PrismaClient,
  input: {
    staff_id: number
    title: string
    description?: string | null
    priority: 'low' | 'medium' | 'high'
    status?: 'pending' | 'in_progress' | 'completed'
    due_date: string
  },
) {
  const row = await (db as any).staffTask.create({
    data: {
      staffId: BigInt(input.staff_id),
      title: input.title.trim(),
      description: input.description?.trim() || null,
      priority: input.priority,
      status: input.status || 'pending',
      dueDate: new Date(input.due_date),
    },
  })
  return mapTask(row)
}

export async function updateStaffTaskStatus(db: PrismaClient, id: number, status: string) {
  const row = await (db as any).staffTask.update({
    where: { id },
    data: { status },
  })
  return mapTask(row)
}

import type { PrismaClient } from '@prisma/client'

type Audience = 'all' | 'class'

export async function createNotice(
  db: PrismaClient,
  input: {
    title: string
    message: string
    audience: Audience
    class_name?: string | null
    send_sms?: boolean
  },
) {
  const notice = await db.notice.create({
    data: {
      title: input.title,
      message: input.message,
      audience: input.audience,
      className: input.class_name || null,
      sendSmsOnPublish: Boolean(input.send_sms),
      status: 'draft',
    },
  })

  return {
    id: Number(notice.id),
    title: notice.title,
    message: notice.message,
    audience: notice.audience,
    class_name: notice.className,
    status: notice.status,
    send_sms_on_publish: notice.sendSmsOnPublish,
    created_at: notice.createdAt.toISOString(),
  }
}

export async function listNotices(
  db: PrismaClient,
  input: {
    page: number
    per_page: number
    status?: 'draft' | 'approved' | 'scheduled' | 'published' | 'rejected'
    audience?: 'all' | 'class'
    class_name?: string
  },
) {
  const where = {
    ...(input.status ? { status: input.status } : {}),
    ...(input.audience ? { audience: input.audience } : {}),
    ...(input.class_name ? { className: input.class_name } : {}),
  }

  const [rows, total] = await Promise.all([
    db.notice.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }],
      skip: (input.page - 1) * input.per_page,
      take: input.per_page,
    }),
    db.notice.count({ where }),
  ])

  return {
    items: rows.map((row) => ({
      id: Number(row.id),
      title: row.title,
      message: row.message,
      audience: row.audience,
      class_name: row.className,
      status: row.status,
      created_at: row.createdAt.toISOString(),
      publish_at: row.publishAt ? row.publishAt.toISOString() : null,
      published_at: row.publishedAt ? row.publishedAt.toISOString() : null,
      send_sms_on_publish: row.sendSmsOnPublish,
      sms_sent: row.smsSent,
    })),
    total,
    page: input.page,
    per_page: input.per_page,
  }
}

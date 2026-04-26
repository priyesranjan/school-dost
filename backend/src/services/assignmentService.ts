import type { PrismaClient } from '@prisma/client'
import type { AuthClaims } from './authTokenService'

function startOfToday() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

function resolveAssignmentStatus(row: { status: string; dueDate: Date }) {
  if (row.status === 'active' && row.dueDate.getTime() < startOfToday().getTime()) {
    return 'overdue'
  }
  return row.status
}

function mapSubmission(row: any) {
  return {
    id: Number(row.id),
    assignment_id: Number(row.assignmentId),
    user_id: Number(row.userId),
    user_name: row.userName,
    user_role: row.userRole,
    status: row.status,
    submission_text: row.submissionText ?? null,
    attachment_url: row.attachmentUrl ?? null,
    feedback: row.feedback ?? null,
    score: row.score === null || row.score === undefined ? null : Number(row.score),
    submitted_at: row.submittedAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  }
}

function mapResource(row: any) {
  return {
    id: Number(row.id),
    title: row.title,
    description: row.description ?? null,
    class_name: row.className,
    subject: row.subject,
    resource_type: row.resourceType,
    url: row.url,
    assignment_id: row.assignmentId === null || row.assignmentId === undefined ? null : Number(row.assignmentId),
    assignment_title: row.assignment?.title ?? null,
    published_by_name: row.publishedByName ?? null,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  }
}

function mapAssignment(row: any, viewerUserId?: bigint | null) {
  const submissions = Array.isArray(row.submissions) ? row.submissions : []
  const mySubmission = viewerUserId ? submissions.find((item: any) => item.userId === viewerUserId) : null

  return {
    id: Number(row.id),
    title: row.title,
    description: row.description ?? null,
    subject: row.subject,
    class_name: row.className,
    due_date: row.dueDate.toISOString().slice(0, 10),
    resource_url: row.resourceUrl ?? null,
    status: resolveAssignmentStatus(row),
    teacher_name: row.teacherName ?? null,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
    submission_count: Number(row._count?.submissions ?? submissions.length ?? 0),
    my_submission: mySubmission ? mapSubmission(mySubmission) : null,
  }
}

function toViewerUserId(auth?: Pick<AuthClaims, 'sub'> | null) {
  if (!auth?.sub) return null
  try {
    return BigInt(auth.sub)
  } catch {
    return null
  }
}

export async function listAssignments(
  db: PrismaClient,
  input: {
    page: number
    per_page: number
    class_name?: string
    status?: 'active' | 'completed' | 'archived'
  },
  auth?: Pick<AuthClaims, 'sub'> | null,
) {
  const where = {
    ...(input.class_name ? { className: input.class_name } : {}),
    ...(input.status ? { status: input.status } : {}),
  }
  const viewerUserId = toViewerUserId(auth)

  const [rows, total] = await Promise.all([
    (db as any).assignment.findMany({
      where,
      include: {
        _count: { select: { submissions: true } },
        ...(viewerUserId
          ? {
              submissions: {
                where: { userId: viewerUserId },
                orderBy: [{ updatedAt: 'desc' }],
                take: 1,
              },
            }
          : {}),
      },
      orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
      skip: (input.page - 1) * input.per_page,
      take: input.per_page,
    }),
    (db as any).assignment.count({ where }),
  ])

  return {
    items: rows.map((row: any) => mapAssignment(row, viewerUserId)),
    total,
    page: input.page,
    per_page: input.per_page,
  }
}

export async function createAssignment(
  db: PrismaClient,
  input: {
    title: string
    description?: string | null
    subject: string
    class_name: string
    due_date: string
    resource_url?: string | null
  },
  auth?: Pick<AuthClaims, 'sub' | 'name'> | null,
) {
  const viewerUserId = toViewerUserId(auth)
  const row = await (db as any).assignment.create({
    data: {
      title: input.title,
      description: input.description || null,
      subject: input.subject,
      className: input.class_name,
      dueDate: new Date(input.due_date),
      resourceUrl: input.resource_url || null,
      teacherName: auth?.name || null,
      createdByUserId: viewerUserId,
    },
    include: {
      _count: { select: { submissions: true } },
    },
  })
  return mapAssignment(row, viewerUserId)
}

export async function listClassroomResources(
  db: PrismaClient,
  input: {
    page: number
    per_page: number
    class_name?: string
    subject?: string
    resource_type?: 'document' | 'worksheet' | 'video' | 'link'
  },
) {
  const where = {
    ...(input.class_name ? { className: input.class_name } : {}),
    ...(input.subject ? { subject: input.subject } : {}),
    ...(input.resource_type ? { resourceType: input.resource_type } : {}),
  }

  const [rows, total] = await Promise.all([
    (db as any).classroomResource.findMany({
      where,
      include: {
        assignment: {
          select: {
            title: true,
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
      skip: (input.page - 1) * input.per_page,
      take: input.per_page,
    }),
    (db as any).classroomResource.count({ where }),
  ])

  return {
    items: rows.map(mapResource),
    total,
    page: input.page,
    per_page: input.per_page,
  }
}

export async function createClassroomResource(
  db: PrismaClient,
  input: {
    title: string
    description?: string | null
    class_name: string
    subject: string
    resource_type: 'document' | 'worksheet' | 'video' | 'link'
    url: string
    assignment_id?: number | null
  },
  auth?: Pick<AuthClaims, 'name'> | null,
) {
  const row = await (db as any).classroomResource.create({
    data: {
      title: input.title,
      description: input.description || null,
      className: input.class_name,
      subject: input.subject,
      resourceType: input.resource_type,
      url: input.url,
      assignmentId: input.assignment_id ? BigInt(input.assignment_id) : null,
      publishedByName: auth?.name || null,
    },
    include: {
      assignment: {
        select: {
          title: true,
        },
      },
    },
  })

  return mapResource(row)
}

export async function updateAssignmentStatus(
  db: PrismaClient,
  id: number,
  status: 'active' | 'completed' | 'archived',
  auth?: Pick<AuthClaims, 'sub'> | null,
) {
  const viewerUserId = toViewerUserId(auth)
  const row = await (db as any).assignment.update({
    where: { id: BigInt(id) },
    data: { status },
    include: {
      _count: { select: { submissions: true } },
      ...(viewerUserId
        ? {
            submissions: {
              where: { userId: viewerUserId },
              orderBy: [{ updatedAt: 'desc' }],
              take: 1,
            },
          }
        : {}),
    },
  })
  return mapAssignment(row, viewerUserId)
}

export async function deleteAssignment(db: PrismaClient, id: number) {
  await (db as any).assignment.delete({ where: { id: BigInt(id) } })
}

export async function upsertAssignmentSubmission(
  db: PrismaClient,
  assignmentId: number,
  input: {
    submission_text?: string | null
    attachment_url?: string | null
  },
  auth: Pick<AuthClaims, 'sub' | 'name' | 'role'>,
) {
  const viewerUserId = toViewerUserId(auth)
  if (!viewerUserId) {
    throw new Error('Assignment submissions require a valid user id')
  }

  const assignment = await (db as any).assignment.findUnique({
    where: { id: BigInt(assignmentId) },
    select: { id: true, title: true, status: true },
  })
  if (!assignment) {
    throw new Error('Assignment not found')
  }
  if (assignment.status === 'archived') {
    throw new Error('Archived assignments cannot accept submissions')
  }

  const row = await (db as any).assignmentSubmission.upsert({
    where: {
      assignmentId_userId: {
        assignmentId: BigInt(assignmentId),
        userId: viewerUserId,
      },
    },
    update: {
      submissionText: input.submission_text || null,
      attachmentUrl: input.attachment_url || null,
      status: 'submitted',
      userName: auth.name,
      userRole: auth.role,
      submittedAt: new Date(),
    },
    create: {
      assignmentId: BigInt(assignmentId),
      userId: viewerUserId,
      userName: auth.name,
      userRole: auth.role,
      status: 'submitted',
      submissionText: input.submission_text || null,
      attachmentUrl: input.attachment_url || null,
    },
  })

  return mapSubmission(row)
}

export async function listAssignmentSubmissions(db: PrismaClient, assignmentId: number) {
  const rows = await (db as any).assignmentSubmission.findMany({
    where: { assignmentId: BigInt(assignmentId) },
    orderBy: [{ submittedAt: 'desc' }],
  })
  return rows.map(mapSubmission)
}

export async function reviewAssignmentSubmission(
  db: PrismaClient,
  assignmentId: number,
  submissionId: number,
  input: {
    status?: 'submitted' | 'reviewed' | 'returned'
    feedback?: string | null
    score?: number | null
  },
) {
  const existing = await (db as any).assignmentSubmission.findUnique({
    where: { id: BigInt(submissionId) },
    select: { id: true, assignmentId: true },
  })
  if (!existing || existing.assignmentId !== BigInt(assignmentId)) {
    throw new Error('Assignment submission not found')
  }

  const row = await (db as any).assignmentSubmission.update({
    where: { id: BigInt(submissionId) },
    data: {
      ...(input.status ? { status: input.status } : {}),
      ...(input.feedback !== undefined ? { feedback: input.feedback || null } : {}),
      ...(input.score !== undefined ? { score: input.score } : {}),
    },
  })

  return mapSubmission(row)
}

import type { PrismaClient } from '@prisma/client'
import type { AuthClaims } from './authTokenService'

const HR_ADMIN_ROLES = new Set<AuthClaims['role']>(['admin', 'hod'])

function startOfDay(date = new Date()) {
  const value = new Date(date)
  value.setHours(0, 0, 0, 0)
  return value
}

function endOfDay(date = new Date()) {
  const value = new Date(date)
  value.setHours(23, 59, 59, 999)
  return value
}

function parseDateInput(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date')
  }
  return date
}

function toNumber(value: unknown) {
  return value === null || value === undefined ? null : Number(value)
}

function durationDays(startDate: Date, endDate: Date) {
  const diff = startOfDay(endDate).getTime() - startOfDay(startDate).getTime()
  return Math.floor(diff / 86400000) + 1
}

function mapLeaveRequest(row: any) {
  return {
    id: Number(row.id),
    staff_id: Number(row.staffMemberId),
    staff_name: row.staffMember?.name || null,
    staff_role: row.staffMember?.role || null,
    department: row.staffMember?.department || null,
    leave_type: row.leaveType,
    start_date: row.startDate.toISOString().slice(0, 10),
    end_date: row.endDate.toISOString().slice(0, 10),
    duration_days: durationDays(row.startDate, row.endDate),
    reason: row.reason ?? null,
    decision_note: row.decisionNote ?? null,
    status: row.status,
    requested_by_name: row.requestedByUser?.name || null,
    approved_by_name: row.approvedByUser?.name || null,
    requested_at: row.requestedAt.toISOString(),
    decided_at: row.decidedAt ? row.decidedAt.toISOString() : null,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  }
}

function mapAppraisal(row: any) {
  return {
    id: Number(row.id),
    staff_id: Number(row.staffMemberId),
    staff_name: row.staffMember?.name || null,
    staff_role: row.staffMember?.role || null,
    department: row.staffMember?.department || null,
    reviewer_name: row.reviewerUser?.name || null,
    review_period: row.reviewPeriod,
    review_date: row.reviewDate.toISOString().slice(0, 10),
    overall_rating: Number(row.overallRating),
    strengths: row.strengths ?? null,
    improvement_areas: row.improvementAreas ?? null,
    goals: row.goals ?? null,
    status: row.status,
    published_at: row.publishedAt ? row.publishedAt.toISOString() : null,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  }
}

async function resolveActorStaffMember(db: PrismaClient, auth: Pick<AuthClaims, 'name' | 'email'>) {
  const conditions = []
  if (auth.email) conditions.push({ email: auth.email })
  if (auth.name) conditions.push({ name: auth.name })
  if (!conditions.length) return null

  return db.staffMember.findFirst({
    where: {
      OR: conditions,
    },
  })
}

async function syncStaffAvailabilityStatus(db: PrismaClient, staffMemberId: bigint) {
  const todayStart = startOfDay()
  const todayEnd = endOfDay()

  const activeApprovedLeave = await (db as any).leaveRequest.findFirst({
    where: {
      staffMemberId,
      status: 'approved',
      startDate: { lte: todayEnd },
      endDate: { gte: todayStart },
    },
    select: { id: true },
  })

  await db.staffMember.update({
    where: { id: staffMemberId },
    data: {
      status: activeApprovedLeave ? 'on_leave' : 'active',
    },
  })
}

async function resolveScopedStaffId(
  db: PrismaClient,
  auth: Pick<AuthClaims, 'role' | 'name' | 'email'>,
  requestedStaffId?: number,
) {
  if (HR_ADMIN_ROLES.has(auth.role) && requestedStaffId) {
    return BigInt(requestedStaffId)
  }

  const actorStaff = await resolveActorStaffMember(db, auth)
  if (!actorStaff) {
    throw new Error('No linked staff record was found for this user')
  }

  if (requestedStaffId && actorStaff.id !== BigInt(requestedStaffId)) {
    throw new Error('You can only create leave requests for your own staff profile')
  }

  return actorStaff.id
}

export async function getHrSummary(
  db: PrismaClient,
  auth: Pick<AuthClaims, 'role' | 'name' | 'email'>,
) {
  let scopedStaffId: bigint | null = null
  if (!HR_ADMIN_ROLES.has(auth.role)) {
    const actorStaff = await resolveActorStaffMember(db, auth)
    if (!actorStaff) {
      return {
        pending_leave_requests: 0,
        approved_leave_requests: 0,
        staff_currently_on_leave: 0,
        published_appraisals: 0,
        draft_appraisals: 0,
      }
    }
    scopedStaffId = actorStaff.id
  }

  const leaveWhere = scopedStaffId ? { staffMemberId: scopedStaffId } : {}
  const appraisalWhere = scopedStaffId ? { staffMemberId: scopedStaffId } : {}

  const [pendingLeaveRequests, approvedLeaveRequests, currentLeave, publishedAppraisals, draftAppraisals] =
    await Promise.all([
      (db as any).leaveRequest.count({ where: { ...leaveWhere, status: 'pending' } }),
      (db as any).leaveRequest.count({ where: { ...leaveWhere, status: 'approved' } }),
      db.staffMember.count({ where: scopedStaffId ? { id: scopedStaffId, status: 'on_leave' } : { status: 'on_leave' } }),
      (db as any).staffAppraisal.count({ where: { ...appraisalWhere, status: 'published' } }),
      (db as any).staffAppraisal.count({ where: { ...appraisalWhere, status: 'draft' } }),
    ])

  return {
    pending_leave_requests: pendingLeaveRequests,
    approved_leave_requests: approvedLeaveRequests,
    staff_currently_on_leave: currentLeave,
    published_appraisals: publishedAppraisals,
    draft_appraisals: draftAppraisals,
  }
}

export async function listLeaveRequests(
  db: PrismaClient,
  input: {
    page: number
    per_page: number
    staff_id?: number
    status?: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed'
  },
  auth: Pick<AuthClaims, 'role' | 'name' | 'email'>,
) {
  let scopedStaffId: bigint | null = null
  if (!HR_ADMIN_ROLES.has(auth.role)) {
    const actorStaff = await resolveActorStaffMember(db, auth)
    if (!actorStaff) {
      return { items: [], total: 0, page: input.page, per_page: input.per_page }
    }
    scopedStaffId = actorStaff.id
  }

  const where: any = {
    ...(input.status ? { status: input.status } : {}),
    ...(scopedStaffId ? { staffMemberId: scopedStaffId } : {}),
    ...(input.staff_id && !scopedStaffId ? { staffMemberId: BigInt(input.staff_id) } : {}),
  }

  const [rows, total] = await Promise.all([
    (db as any).leaveRequest.findMany({
      where,
      include: {
        staffMember: { select: { name: true, role: true, department: true } },
        requestedByUser: { select: { name: true } },
        approvedByUser: { select: { name: true } },
      },
      orderBy: [{ startDate: 'desc' }, { createdAt: 'desc' }],
      skip: (input.page - 1) * input.per_page,
      take: input.per_page,
    }),
    (db as any).leaveRequest.count({ where }),
  ])

  return {
    items: rows.map(mapLeaveRequest),
    total,
    page: input.page,
    per_page: input.per_page,
  }
}

export async function createLeaveRequest(
  db: PrismaClient,
  input: {
    staff_id?: number
    leave_type: string
    start_date: string
    end_date: string
    reason?: string | null
  },
  auth: Pick<AuthClaims, 'sub' | 'role' | 'name' | 'email'>,
) {
  const startDate = parseDateInput(input.start_date)
  const endDate = parseDateInput(input.end_date)
  if (endDate.getTime() < startDate.getTime()) {
    throw new Error('End date cannot be before start date')
  }

  const staffMemberId = await resolveScopedStaffId(db, auth, input.staff_id)
  const overlapping = await (db as any).leaveRequest.findFirst({
    where: {
      staffMemberId,
      status: { in: ['pending', 'approved'] },
      startDate: { lte: endDate },
      endDate: { gte: startDate },
    },
    select: { id: true },
  })
  if (overlapping) {
    throw new Error('An overlapping leave request already exists for this staff member')
  }

  const requestedByUserId = auth.sub ? BigInt(auth.sub) : null
  const row = await (db as any).leaveRequest.create({
    data: {
      staffMemberId,
      requestedByUserId,
      leaveType: input.leave_type.trim(),
      startDate,
      endDate,
      reason: input.reason || null,
    },
    include: {
      staffMember: { select: { name: true, role: true, department: true } },
      requestedByUser: { select: { name: true } },
      approvedByUser: { select: { name: true } },
    },
  })

  return mapLeaveRequest(row)
}

export async function reviewLeaveRequest(
  db: PrismaClient,
  id: number,
  input: {
    status: 'approved' | 'rejected' | 'completed'
    decision_note?: string | null
  },
  auth: Pick<AuthClaims, 'sub'>,
) {
  const row = await (db as any).leaveRequest.update({
    where: { id: BigInt(id) },
    data: {
      status: input.status,
      decisionNote: input.decision_note || null,
      approvedByUserId: auth.sub ? BigInt(auth.sub) : null,
      decidedAt: new Date(),
    },
    include: {
      staffMember: { select: { id: true, name: true, role: true, department: true } },
      requestedByUser: { select: { name: true } },
      approvedByUser: { select: { name: true } },
    },
  })

  await syncStaffAvailabilityStatus(db, row.staffMember.id)
  return mapLeaveRequest(row)
}

export async function cancelLeaveRequest(
  db: PrismaClient,
  id: number,
  auth: Pick<AuthClaims, 'role' | 'name' | 'email'>,
) {
  const existing = await (db as any).leaveRequest.findUnique({
    where: { id: BigInt(id) },
    include: {
      staffMember: { select: { id: true } },
      requestedByUser: { select: { name: true } },
      approvedByUser: { select: { name: true } },
    },
  })
  if (!existing) {
    throw new Error('Leave request not found')
  }

  if (!HR_ADMIN_ROLES.has(auth.role)) {
    const actorStaff = await resolveActorStaffMember(db, auth)
    if (!actorStaff || actorStaff.id !== existing.staffMember.id) {
      throw new Error('You can only cancel your own leave requests')
    }
  }

  const row = await (db as any).leaveRequest.update({
    where: { id: BigInt(id) },
    data: {
      status: 'cancelled',
      decidedAt: new Date(),
    },
    include: {
      staffMember: { select: { id: true, name: true, role: true, department: true } },
      requestedByUser: { select: { name: true } },
      approvedByUser: { select: { name: true } },
    },
  })

  await syncStaffAvailabilityStatus(db, row.staffMember.id)
  return mapLeaveRequest(row)
}

export async function listAppraisals(
  db: PrismaClient,
  input: {
    page: number
    per_page: number
    staff_id?: number
    status?: 'draft' | 'published'
  },
  auth: Pick<AuthClaims, 'role' | 'name' | 'email'>,
) {
  let scopedStaffId: bigint | null = null
  if (!HR_ADMIN_ROLES.has(auth.role)) {
    const actorStaff = await resolveActorStaffMember(db, auth)
    if (!actorStaff) {
      return { items: [], total: 0, page: input.page, per_page: input.per_page }
    }
    scopedStaffId = actorStaff.id
  }

  const where: any = {
    ...(input.status ? { status: input.status } : {}),
    ...(scopedStaffId ? { staffMemberId: scopedStaffId } : {}),
    ...(input.staff_id && !scopedStaffId ? { staffMemberId: BigInt(input.staff_id) } : {}),
  }

  const [rows, total] = await Promise.all([
    (db as any).staffAppraisal.findMany({
      where,
      include: {
        staffMember: { select: { name: true, role: true, department: true } },
        reviewerUser: { select: { name: true } },
      },
      orderBy: [{ reviewDate: 'desc' }, { createdAt: 'desc' }],
      skip: (input.page - 1) * input.per_page,
      take: input.per_page,
    }),
    (db as any).staffAppraisal.count({ where }),
  ])

  return {
    items: rows.map(mapAppraisal),
    total,
    page: input.page,
    per_page: input.per_page,
  }
}

export async function createAppraisal(
  db: PrismaClient,
  input: {
    staff_id: number
    review_period: string
    review_date: string
    overall_rating: number
    strengths?: string | null
    improvement_areas?: string | null
    goals?: string | null
    status?: 'draft' | 'published'
  },
  auth: Pick<AuthClaims, 'sub'>,
) {
  const reviewDate = parseDateInput(input.review_date)
  const reviewerUserId = auth.sub ? BigInt(auth.sub) : null
  const status = input.status || 'draft'

  const row = await (db as any).staffAppraisal.create({
    data: {
      staffMemberId: BigInt(input.staff_id),
      reviewerUserId,
      reviewPeriod: input.review_period.trim(),
      reviewDate,
      overallRating: input.overall_rating,
      strengths: input.strengths || null,
      improvementAreas: input.improvement_areas || null,
      goals: input.goals || null,
      status,
      publishedAt: status === 'published' ? new Date() : null,
    },
    include: {
      staffMember: { select: { name: true, role: true, department: true } },
      reviewerUser: { select: { name: true } },
    },
  })

  return mapAppraisal(row)
}

export async function updateAppraisal(
  db: PrismaClient,
  id: number,
  input: {
    review_period?: string
    review_date?: string
    overall_rating?: number
    strengths?: string | null
    improvement_areas?: string | null
    goals?: string | null
    status?: 'draft' | 'published'
  },
) {
  const data: Record<string, unknown> = {}
  if (input.review_period !== undefined) data.reviewPeriod = input.review_period.trim()
  if (input.review_date !== undefined) data.reviewDate = parseDateInput(input.review_date)
  if (input.overall_rating !== undefined) data.overallRating = input.overall_rating
  if (input.strengths !== undefined) data.strengths = input.strengths || null
  if (input.improvement_areas !== undefined) data.improvementAreas = input.improvement_areas || null
  if (input.goals !== undefined) data.goals = input.goals || null
  if (input.status !== undefined) {
    data.status = input.status
    data.publishedAt = input.status === 'published' ? new Date() : null
  }

  const row = await (db as any).staffAppraisal.update({
    where: { id: BigInt(id) },
    data,
    include: {
      staffMember: { select: { name: true, role: true, department: true } },
      reviewerUser: { select: { name: true } },
    },
  })

  return mapAppraisal(row)
}

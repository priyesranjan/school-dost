import { type PrismaClient } from '@prisma/client'

function mapStaffToFrontend(row: any) {
  return {
    id: Number(row.id),
    name: row.name,
    role: row.role,
    department: row.department,
    phone: row.phone,
    email: row.email,
    join_date: row.joinDate.toISOString().slice(0, 10),
    status: row.status,
    address: row.address,
    profile_photo_url: row.profilePhotoUrl,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  }
}

export async function createStaff(db: PrismaClient, input: any) {
  const row = await db.staffMember.create({
    data: {
      name: input.name,
      role: input.role,
      department: input.department,
      phone: input.phone,
      email: input.email || null,
      joinDate: new Date(input.join_date || Date.now()),
      status: input.status || 'active',
      address: input.address || null,
      profilePhotoUrl: input.profile_photo_url || null,
    },
  })
  return mapStaffToFrontend(row)
}

export async function updateStaff(db: PrismaClient, id: number, input: any) {
  const data: any = {}
  if (input.name !== undefined) data.name = input.name
  if (input.role !== undefined) data.role = input.role
  if (input.department !== undefined) data.department = input.department
  if (input.phone !== undefined) data.phone = input.phone
  if (input.email !== undefined) data.email = input.email
  if (input.join_date !== undefined) data.joinDate = new Date(input.join_date)
  if (input.status !== undefined) data.status = input.status
  if (input.address !== undefined) data.address = input.address
  if (input.profile_photo_url !== undefined) data.profilePhotoUrl = input.profile_photo_url

  const row = await db.staffMember.update({
    where: { id },
    data,
  })
  return mapStaffToFrontend(row)
}

export async function getStaff(db: PrismaClient, id: number) {
  const row = await db.staffMember.findUnique({ where: { id } })
  return row ? mapStaffToFrontend(row) : null
}

export async function deleteStaff(db: PrismaClient, id: number) {
  await db.staffMember.delete({ where: { id } })
}

export async function listStaff(
  db: PrismaClient,
  input: {
    page: number
    per_page: number
    search?: string
    role?: string
  },
) {
  const where: any = {
    ...(input.role ? { role: input.role } : {}),
    ...(input.search
      ? {
          OR: [
            { name: { contains: input.search, mode: 'insensitive' as const } },
            { phone: { contains: input.search, mode: 'insensitive' as const } },
            { department: { contains: input.search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  }

  const [rows, total] = await Promise.all([
    db.staffMember.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }],
      skip: (input.page - 1) * input.per_page,
      take: input.per_page,
    }),
    db.staffMember.count({ where }),
  ])

  return {
    items: rows.map(mapStaffToFrontend),
    total,
    page: input.page,
    per_page: input.per_page,
  }
}

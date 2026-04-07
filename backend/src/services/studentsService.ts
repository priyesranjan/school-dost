import { Prisma } from '@prisma/client'
import { prisma } from '../db/prisma'

export async function createStudent(input: {
  name: string
  roll_number: string
  class_name: string
  section: string
  parent_name: string
  phone: string
  email?: string | null
  address?: string | null
  admission_date: string
}) {
  try {
    const row = await prisma.student.create({
      data: {
        name: input.name,
        rollNumber: input.roll_number,
        className: input.class_name,
        section: input.section,
        parentName: input.parent_name,
        phone: input.phone,
        email: input.email || null,
        address: input.address || null,
        admissionDate: new Date(input.admission_date),
        status: 'active',
      },
    })

    return {
      ok: true as const,
      data: {
        id: Number(row.id),
        name: row.name,
        roll_number: row.rollNumber,
        class_name: row.className,
        section: row.section,
        parent_name: row.parentName,
        phone: row.phone,
      },
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return {
        ok: false as const,
        code: 'STUDENT_ALREADY_EXISTS',
        message: 'Student with same roll/class/section already exists',
      }
    }
    throw error
  }
}

export async function listStudents(input: {
  page: number
  per_page: number
  search?: string
  class_name?: string
  status?: 'active' | 'inactive'
}) {
  const where = {
    ...(input.class_name ? { className: input.class_name } : {}),
    ...(input.status ? { status: input.status } : {}),
    ...(input.search
      ? {
          OR: [
            { name: { contains: input.search, mode: 'insensitive' as const } },
            { rollNumber: { contains: input.search, mode: 'insensitive' as const } },
            { parentName: { contains: input.search, mode: 'insensitive' as const } },
            { phone: { contains: input.search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  }

  const [rows, total] = await Promise.all([
    prisma.student.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }],
      skip: (input.page - 1) * input.per_page,
      take: input.per_page,
    }),
    prisma.student.count({ where }),
  ])

  return {
    items: rows.map((row) => ({
      id: Number(row.id),
      name: row.name,
      roll_number: row.rollNumber,
      class_name: row.className,
      section: row.section,
      parent_name: row.parentName,
      phone: row.phone,
      email: row.email,
      address: row.address,
      admission_date: row.admissionDate.toISOString().slice(0, 10),
      status: row.status,
      profile_photo_url: row.profilePhotoUrl,
    })),
    total,
    page: input.page,
    per_page: input.per_page,
  }
}

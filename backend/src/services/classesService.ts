import { type PrismaClient } from '@prisma/client'

type ClassInput = {
  name: string
  grade: number
  class_teacher?: string | null
  academic_year: string
  room?: string | null
  color?: string
  sections: Array<{ name: string; capacity: number }>
}

type ClassUpdateInput = Partial<Omit<ClassInput, 'sections'>>

function mapSection(row: any) {
  return {
    id: Number(row.id),
    name: row.name,
    capacity: row.capacity,
  }
}

function mapClass(row: any) {
  return {
    id: Number(row.id),
    name: row.name,
    grade: row.grade,
    sections: (row.sections || []).map(mapSection),
    class_teacher: row.classTeacher || '',
    academic_year: row.academicYear,
    room: row.room || '',
    color: row.color || 'slate',
    created_at: row.createdAt.toISOString().slice(0, 10),
    updated_at: row.updatedAt?.toISOString?.() || row.updatedAt,
  }
}

function normaliseSectionName(value: string) {
  return value.trim().toUpperCase()
}

export async function listClasses(
  db: PrismaClient,
  input: {
    page: number
    per_page: number
    search?: string
    academic_year?: string
  },
) {
  const where: any = {
    ...(input.academic_year ? { academicYear: input.academic_year } : {}),
    ...(input.search
      ? {
          OR: [
            { name: { contains: input.search, mode: 'insensitive' as const } },
            { classTeacher: { contains: input.search, mode: 'insensitive' as const } },
            { room: { contains: input.search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  }

  const client = db as any
  const [rows, total] = await Promise.all([
    client.schoolClass.findMany({
      where,
      include: { sections: { orderBy: { name: 'asc' } } },
      orderBy: [{ grade: 'asc' }, { name: 'asc' }],
      skip: (input.page - 1) * input.per_page,
      take: input.per_page,
    }),
    client.schoolClass.count({ where }),
  ])

  return {
    items: rows.map(mapClass),
    total,
    page: input.page,
    per_page: input.per_page,
  }
}

export async function createClass(db: PrismaClient, input: ClassInput) {
  const client = db as any
  const row = await client.schoolClass.create({
    data: {
      name: input.name.trim(),
      grade: input.grade,
      classTeacher: input.class_teacher?.trim() || null,
      academicYear: input.academic_year.trim(),
      room: input.room?.trim() || null,
      color: input.color || 'slate',
      sections: {
        create: input.sections.map((section) => ({
          name: normaliseSectionName(section.name),
          capacity: section.capacity,
        })),
      },
    },
    include: { sections: { orderBy: { name: 'asc' } } },
  })
  return mapClass(row)
}

export async function updateClass(db: PrismaClient, id: number, input: ClassUpdateInput) {
  const data: any = {}
  if (input.name !== undefined) data.name = input.name.trim()
  if (input.grade !== undefined) data.grade = input.grade
  if (input.class_teacher !== undefined) data.classTeacher = input.class_teacher?.trim() || null
  if (input.academic_year !== undefined) data.academicYear = input.academic_year.trim()
  if (input.room !== undefined) data.room = input.room?.trim() || null
  if (input.color !== undefined) data.color = input.color || 'slate'

  const row = await (db as any).schoolClass.update({
    where: { id },
    data,
    include: { sections: { orderBy: { name: 'asc' } } },
  })
  return mapClass(row)
}

export async function deleteClass(db: PrismaClient, id: number) {
  await (db as any).schoolClass.delete({ where: { id } })
}

export async function addClassSection(db: PrismaClient, classId: number, input: { name: string; capacity: number }) {
  const client = db as any
  await client.classSection.create({
    data: {
      classId,
      name: normaliseSectionName(input.name),
      capacity: input.capacity,
    },
  })
  const row = await client.schoolClass.findUnique({
    where: { id: classId },
    include: { sections: { orderBy: { name: 'asc' } } },
  })
  return row ? mapClass(row) : null
}

export async function updateClassSection(
  db: PrismaClient,
  sectionId: number,
  input: { name?: string; capacity?: number },
) {
  const data: any = {}
  if (input.name !== undefined) data.name = normaliseSectionName(input.name)
  if (input.capacity !== undefined) data.capacity = input.capacity

  const client = db as any
  const section = await client.classSection.update({ where: { id: sectionId }, data })
  const row = await client.schoolClass.findUnique({
    where: { id: section.classId },
    include: { sections: { orderBy: { name: 'asc' } } },
  })
  return row ? mapClass(row) : null
}

export async function deleteClassSection(db: PrismaClient, classId: number, sectionId: number) {
  const client = db as any
  const sectionCount = await client.classSection.count({ where: { classId } })
  if (sectionCount <= 1) {
    throw new Error('Cannot delete the last section')
  }

  await client.classSection.delete({ where: { id: sectionId } })
  const row = await client.schoolClass.findUnique({
    where: { id: classId },
    include: { sections: { orderBy: { name: 'asc' } } },
  })
  return row ? mapClass(row) : null
}

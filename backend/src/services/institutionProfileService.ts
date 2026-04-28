import type { PrismaClient } from '@prisma/client'

export async function getInstitutionProfile(db: PrismaClient) {
  const row = await (db as any).institutionProfile.findUnique({ where: { id: 1 } })
  return row?.data || null
}

export async function upsertInstitutionProfile(db: PrismaClient, data: Record<string, unknown>) {
  const row = await (db as any).institutionProfile.upsert({
    where: { id: 1 },
    create: { id: 1, data },
    update: { data },
  })
  return row.data
}

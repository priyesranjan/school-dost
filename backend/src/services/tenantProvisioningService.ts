/**
 * Tenant Provisioning Service
 *
 * Handles the full lifecycle of onboarding a new institution:
 *
 * 1. Validate slug uniqueness
 * 2. CREATE DATABASE  tenant_<slug>  (PostgreSQL)
 * 3. Run Prisma migrations on the new DB  (applies the full school schema)
 * 4. Seed default data  (settings, default admin user)
 * 5. Register tenant in platform master DB
 *
 * This is what runs when a superadmin clicks "Onboard New Institution"
 */

import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { env } from '../config/env'
import { getPlatformPrisma } from '../db/platformPool'
import { hashPassword } from './authTokenService'
import { seedDemoData } from './maintenanceService'

export interface OnboardTenantInput {
  name: string
  slug: string
  type: 'school' | 'college' | 'coaching'
  board?: string
  city: string
  state: string
  country?: string
  adminName: string
  adminEmail: string
  adminPhone?: string
  adminPasswordPlain: string
  plan: 'basic' | 'standard' | 'premium' | 'enterprise'
  institutionCode?: string
  seedDemo?: boolean
  performedBy: string // superadmin email
}

export interface ProvisionResult {
  tenantId: string
  slug: string
  dbName: string
  subdomain: string
  adminCredentials: {
    email: string
    password: string // shown once, never stored in plain
  }
}

/**
 * Sanitise slug — only lowercase letters, digits, hyphens
 */
export function sanitiseSlug(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40)
}

/**
 * Convert slug to a safe PostgreSQL database name
 * "delhi-public-school" → "tenant_delhi_public_school"
 */
function slugToDbName(slug: string): string {
  return 'tenant_' + slug.replace(/-/g, '_').slice(0, 50)
}

function createPrismaClientForTenant(dbName: string): PrismaClient {
  const dbUser = env.tenantDbUser
  const dbPass = env.tenantDbPass
  const url = `postgresql://${dbUser}:${encodeURIComponent(dbPass)}@localhost:5432/${dbName}?schema=public`

  return new PrismaClient({
    datasources: { db: { url } },
  })
}

/**
 * Create the PostgreSQL database for a new tenant.
 * Uses a pg Pool connected to the postgres admin DB.
 */
async function createTenantDatabase(dbName: string): Promise<void> {
  // Safe: dbName already sanitised to [a-z0-9_] pattern from slug
  const adminPool = new Pool({
    connectionString: env.platformDbAdminUrl,
    database: 'postgres', // connect to admin DB to run CREATE DATABASE
  })

  try {
    // Check if DB already exists
    const exists = await adminPool.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName])
    if (exists.rowCount && exists.rowCount > 0) {
      throw new Error(`Database "${dbName}" already exists`)
    }

    // CREATE DATABASE — cannot be parameterised in PostgreSQL
    // Safe because dbName comes from our own slug sanitisation
    await adminPool.query(`CREATE DATABASE "${dbName}"`)
  } finally {
    await adminPool.end()
  }
}

/**
 * Run Prisma migrations on the newly created tenant database.
 * This applies the full school schema (students, fees, attendance, etc.)
 */
function runMigrationsOnTenantDb(dbName: string): void {
  const dbUser = env.tenantDbUser
  const dbPass = env.tenantDbPass
  const dbHost = 'localhost'
  const dbPort = 5432

  const tenantDbUrl = `postgresql://${dbUser}:${encodeURIComponent(dbPass)}@${dbHost}:${dbPort}/${dbName}?schema=public`

  // Run prisma migrate deploy with the tenant DB URL
  execSync(`npx prisma migrate deploy --schema=./prisma/schema.prisma`, {
    env: { ...process.env, DATABASE_URL: tenantDbUrl },
    stdio: 'pipe',
    timeout: 60_000,
  })
}

/**
 * Seed the new tenant DB with the school's default settings and first admin user.
 */
async function seedTenantDb(dbName: string, input: OnboardTenantInput): Promise<void> {
  const { PrismaClient } = await import('@prisma/client')
  const dbUser = env.tenantDbUser
  const dbPass = env.tenantDbPass
  const url = `postgresql://${dbUser}:${encodeURIComponent(dbPass)}@localhost:5432/${dbName}?schema=public`

  const tenantPrisma = new PrismaClient({ datasources: { db: { url } } })

  try {
    const passwordHash = await hashPassword(input.adminPasswordPlain)

    // Create the first admin user in the school's own database
    await tenantPrisma.user.create({
      data: {
        name: input.adminName,
        email: input.adminEmail,
        phone: input.adminPhone || '',
        role: 'admin',
        status: 'active',
        passwordHash,
      },
    })
  } finally {
    await tenantPrisma.$disconnect()
  }
}

/**
 * Full onboarding pipeline — call this from the superadmin API route.
 */
export async function provisionTenant(input: OnboardTenantInput): Promise<ProvisionResult> {
  const slug = sanitiseSlug(input.slug || input.name)
  const dbName = slugToDbName(slug)
  const platformDb = getPlatformPrisma()

  // 1. Check slug uniqueness in platform DB
  const existing = await (platformDb as any).tenant.findUnique({ where: { slug } })
  if (existing) {
    throw new Error(`Institution slug "${slug}" is already taken. Choose a different name.`)
  }

  // 2. Create the isolated PostgreSQL database
  await createTenantDatabase(dbName)

  // 3. Run Prisma schema migrations on the new DB
  runMigrationsOnTenantDb(dbName)

  // 4. Seed: create default admin user in the tenant's own DB
  await seedTenantDb(dbName, input)

  // 4b. Optional: Seed demo data (students, staff, records)
  if (input.seedDemo) {
    const tenantDb = createPrismaClientForTenant(dbName)
    try {
      await seedDemoData(tenantDb)
    } finally {
      await tenantDb.$disconnect()
    }
  }

  // 5. Register in platform master DB
  const tenant = await (platformDb as any).tenant.create({
    data: {
      name: input.name,
      slug,
      type: input.type,
      board: input.board || '',
      city: input.city,
      state: input.state,
      country: input.country || 'India',
      dbName,
      dbHost: 'localhost',
      dbPort: 5432,
      plan: input.plan,
      status: input.plan === 'basic' ? 'trial' : 'active',
      trialEndsAt: input.plan === 'basic' ? new Date(Date.now() + 30 * 86400_000) : null,
      adminName: input.adminName,
      adminEmail: input.adminEmail,
      adminPhone: input.adminPhone || '',
      institutionCode: input.institutionCode || '001',
      auditLogs: {
        create: {
          action: 'ONBOARD',
          performedBy: input.performedBy,
          details: { plan: input.plan, type: input.type, city: input.city },
        },
      },
    },
  })

  return {
    tenantId: tenant.id,
    slug,
    dbName,
    subdomain: `https://${slug}.yourerp.com`,
    adminCredentials: {
      email: input.adminEmail,
      password: input.adminPasswordPlain, // shown once on screen — never stored again
    },
  }
}

/**
 * Suspend a tenant (school stops paying / violates ToS)
 * Their data is NOT deleted — just access is blocked via tenantResolver.
 */
export async function suspendTenant(tenantId: string, performedBy: string): Promise<void> {
  const platformDb = getPlatformPrisma()
  await (platformDb as any).tenant.update({
    where: { id: tenantId },
    data: {
      status: 'suspended',
      auditLogs: {
        create: { action: 'SUSPEND', performedBy },
      },
    },
  })
}

/**
 * Reactivate a suspended tenant
 */
export async function activateTenant(tenantId: string, performedBy: string): Promise<void> {
  const platformDb = getPlatformPrisma()
  await (platformDb as any).tenant.update({
    where: { id: tenantId },
    data: {
      status: 'active',
      auditLogs: {
        create: { action: 'ACTIVATE', performedBy },
      },
    },
  })
}

/**
 * List all tenants for superadmin dashboard
 */
export async function listTenants() {
  const platformDb = getPlatformPrisma()
  return (platformDb as any).tenant.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
      city: true,
      state: true,
      plan: true,
      status: true,
      adminName: true,
      adminEmail: true,
      totalStudents: true,
      totalStaff: true,
      createdAt: true,
      trialEndsAt: true,
      institutionCode: true,
    },
  })
}

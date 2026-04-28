import 'dotenv/config'
import { execSync } from 'child_process'
import { PrismaClient, type UserAppRole } from '@prisma/client'
import { Pool } from 'pg'
import { hashPassword } from '../services/authTokenService'

const prisma = new PrismaClient()

const password = 'test123'
const tenantSlug = 'delhi-public-school'
const tenantSchema = 'tenant_delhi_public_school'

function tenantUrl(schemaName: string) {
  const base = new URL(process.env.PLATFORM_DATABASE_URL || process.env.DATABASE_URL || '')
  base.searchParams.set('schema', schemaName)
  return base.toString()
}

async function ensureTenantSchema(schemaName: string) {
  const pool = new Pool({ connectionString: process.env.PLATFORM_DATABASE_URL || process.env.DATABASE_URL })
  try {
    await pool.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`)
  } finally {
    await pool.end()
  }

  execSync('npx prisma db push --schema=./prisma/schema.prisma --accept-data-loss --skip-generate', {
    env: { ...process.env, DATABASE_URL: tenantUrl(schemaName) },
    stdio: 'inherit',
    timeout: 60_000,
  })
}

const roleUsers: Array<{
  name: string
  email: string
  phone: string
  role: UserAppRole
}> = [
  { name: 'School Admin', email: 'admin@school.test', phone: '9876543201', role: 'admin' },
  { name: 'Accounts User', email: 'accountant@school.test', phone: '9876543202', role: 'accountant' },
  { name: 'Teacher User', email: 'teacher@school.test', phone: '9876543203', role: 'teacher' },
  { name: 'Reception User', email: 'reception@school.test', phone: '9876543204', role: 'receptionist' },
  { name: 'Student User', email: 'student@school.test', phone: '9876543205', role: 'student' },
  { name: 'Parent User', email: 'parent@school.test', phone: '9876543206', role: 'parent' },
  { name: 'HOD User', email: 'hod@school.test', phone: '9876543207', role: 'hod' },
]

async function main() {
  const passwordHash = await hashPassword(password)
  await ensureTenantSchema(tenantSchema)
  const tenantPrisma = new PrismaClient({ datasources: { db: { url: tenantUrl(tenantSchema) } } })

  await prisma.tenant.upsert({
    where: { slug: tenantSlug },
    update: {
      name: 'Delhi Public School',
      status: 'active',
      plan: 'premium',
      adminName: 'School Admin',
      adminEmail: 'admin@school.test',
      institutionCode: '001',
      dbName: tenantSchema,
      dbHost: '91.108.111.194',
      dbPort: 5555,
    },
    create: {
      id: 'tenant_delhi_public_school',
      name: 'Delhi Public School',
      slug: tenantSlug,
      type: 'school',
      city: 'New Delhi',
      state: 'Delhi',
      status: 'active',
      plan: 'premium',
      adminName: 'School Admin',
      adminEmail: 'admin@school.test',
      institutionCode: '001',
      dbName: tenantSchema,
      dbHost: '91.108.111.194',
      dbPort: 5555,
    },
  })

  await prisma.superAdmin.upsert({
    where: { email: 'superadmin@platform.test' },
    update: {
      name: 'Platform Super Admin',
      phone: '9876543200',
      passwordHash,
      isActive: true,
      isRoot: true,
    },
    create: {
      name: 'Platform Super Admin',
      email: 'superadmin@platform.test',
      phone: '9876543200',
      passwordHash,
      isActive: true,
      isRoot: true,
    },
  })

  for (const account of roleUsers) {
    await tenantPrisma.user.upsert({
      where: { email: account.email },
      update: {
        name: account.name,
        phone: account.phone,
        role: account.role,
        status: 'active',
        passwordHash,
      },
      create: {
        name: account.name,
        email: account.email,
        phone: account.phone,
        role: account.role,
        status: 'active',
        passwordHash,
      },
    })
  }

  await tenantPrisma.securityPolicy.upsert({
    where: { id: 1n },
    update: {
      passwordMinLength: 6,
      twoFactorRequiredAdmins: false,
      allowConcurrentSessions: true,
      sessionTimeoutHours: 168,
    },
    create: {
      id: 1n,
      passwordMinLength: 6,
      twoFactorRequiredAdmins: false,
      allowConcurrentSessions: true,
      sessionTimeoutHours: 168,
    },
  })

  console.log(
    JSON.stringify(
      {
        password,
        tenant_slug: tenantSlug,
        accounts: [
          { role: 'superadmin', email: 'superadmin@platform.test' },
          ...roleUsers.map(({ role, email }) => ({ role, email })),
        ],
      },
      null,
      2,
    ),
  )

  await tenantPrisma.$disconnect()
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

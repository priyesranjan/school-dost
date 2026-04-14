import 'dotenv/config'
import { Pool } from 'pg'
import { hashPassword } from '../services/authTokenService'

function getDbUrl(): string {
  return process.env.PLATFORM_DATABASE_URL || process.env.DATABASE_URL || ''
}

function parsePgInfo(dbUrl: string) {
  const url = new URL(dbUrl)
  const dbName = url.pathname.replace(/^\//, '')
  const host = url.hostname
  const port = Number(url.port || '5432')
  return { dbName, host, port }
}

async function ensureEnums(pool: Pool) {
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TenantStatus') THEN
        CREATE TYPE "TenantStatus" AS ENUM ('active', 'trial', 'suspended', 'cancelled');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TenantType') THEN
        CREATE TYPE "TenantType" AS ENUM ('school', 'college', 'coaching');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SubscriptionPlan') THEN
        CREATE TYPE "SubscriptionPlan" AS ENUM ('basic', 'standard', 'premium', 'enterprise');
      END IF;
    END
    $$;
  `)
}

async function ensureTables(pool: Pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "Tenant" (
      "id" TEXT PRIMARY KEY,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "name" TEXT NOT NULL,
      "slug" TEXT NOT NULL UNIQUE,
      "type" "TenantType" NOT NULL,
      "board" TEXT,
      "logoUrl" TEXT,
      "city" TEXT NOT NULL,
      "state" TEXT NOT NULL,
      "country" TEXT NOT NULL DEFAULT 'India',
      "address" TEXT,
      "pincode" TEXT,
      "phone" TEXT,
      "dbName" TEXT NOT NULL UNIQUE,
      "dbHost" TEXT NOT NULL DEFAULT 'localhost',
      "dbPort" INTEGER NOT NULL DEFAULT 5432,
      "plan" "SubscriptionPlan" NOT NULL DEFAULT 'basic',
      "status" "TenantStatus" NOT NULL DEFAULT 'trial',
      "trialEndsAt" TIMESTAMP(3),
      "subscriptionStart" TIMESTAMP(3),
      "subscriptionEnd" TIMESTAMP(3),
      "monthlyFeeInr" DECIMAL(10,2),
      "adminName" TEXT NOT NULL,
      "adminEmail" TEXT NOT NULL,
      "adminPhone" TEXT,
      "totalStudents" INTEGER NOT NULL DEFAULT 0,
      "totalStaff" INTEGER NOT NULL DEFAULT 0,
      "institutionCode" TEXT NOT NULL DEFAULT '001'
    );

    CREATE TABLE IF NOT EXISTS "TenantAuditLog" (
      "id" BIGSERIAL PRIMARY KEY,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "tenantId" TEXT NOT NULL,
      "action" TEXT NOT NULL,
      "performedBy" TEXT NOT NULL,
      "details" JSONB,
      CONSTRAINT "TenantAuditLog_tenantId_fkey"
        FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS "TenantAuditLog_tenantId_idx" ON "TenantAuditLog"("tenantId");
    CREATE INDEX IF NOT EXISTS "TenantAuditLog_createdAt_idx" ON "TenantAuditLog"("createdAt");

    CREATE TABLE IF NOT EXISTS "SuperAdmin" (
      "id" BIGSERIAL PRIMARY KEY,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL UNIQUE,
      "phone" TEXT UNIQUE,
      "passwordHash" TEXT NOT NULL,
      "lastLoginAt" TIMESTAMP(3),
      "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
      "isRoot" BOOLEAN NOT NULL DEFAULT FALSE
    );
  `)
}

async function seedTenant(pool: Pool, dbUrl: string) {
  const { dbName, host, port } = parsePgInfo(dbUrl)
  const slug = process.env.DEV_TENANT_SLUG || 'delhi-public-school'
  const tenantName = process.env.DEV_TENANT_NAME || 'Delhi Public School'
  const adminEmail = process.env.DEV_TENANT_ADMIN_EMAIL || 'admin@school.com'

  await pool.query(
    `
      INSERT INTO "Tenant" (
        "id", "name", "slug", "type", "city", "state",
        "dbName", "dbHost", "dbPort", "plan", "status",
        "adminName", "adminEmail", "institutionCode", "updatedAt"
      ) VALUES (
        $1, $2, $3, 'school', 'New Delhi', 'Delhi',
        $4, $5, $6, 'premium', 'active',
        'Admin User', $7, '001', CURRENT_TIMESTAMP
      )
      ON CONFLICT ("slug") DO UPDATE SET
        "dbName" = EXCLUDED."dbName",
        "dbHost" = EXCLUDED."dbHost",
        "dbPort" = EXCLUDED."dbPort",
        "status" = EXCLUDED."status",
        "plan" = EXCLUDED."plan",
        "adminEmail" = EXCLUDED."adminEmail",
        "updatedAt" = CURRENT_TIMESTAMP;
    `,
    [`tenant_${slug.replace(/-/g, '_')}`, tenantName, slug, dbName, host, port, adminEmail],
  )

  console.log(
    JSON.stringify(
      {
        data: {
          seededTenant: {
            slug,
            dbName,
            dbHost: host,
            dbPort: port,
          },
        },
      },
      null,
      2,
    ),
  )
}

async function seedSuperAdmin(pool: Pool) {
  const rootEmail = 'priyesranjan@gmail.com'
  const rootPass = await hashPassword('root123') // Should be changed on first login

  await pool.query(
    `
      INSERT INTO "SuperAdmin" (
        "name", "email", "phone", "passwordHash", "isRoot"
      ) VALUES (
        'Priyes Ranjan', $1, $2, $3, true
      )
      ON CONFLICT ("email") DO UPDATE SET
        "isRoot" = true,
        "phone" = EXCLUDED."phone";
    `,
    [rootEmail, '9288075422', rootPass],
  )
  console.log(`Seeded Root SuperAdmin: ${rootEmail}`)
}

async function main() {
  const dbUrl = getDbUrl()
  if (!dbUrl) {
    throw new Error('Set PLATFORM_DATABASE_URL (or DATABASE_URL) before running initPlatformDev')
  }

  const pool = new Pool({ connectionString: dbUrl })

  try {
    await ensureEnums(pool)
    await ensureTables(pool)
    await seedTenant(pool, dbUrl)
    await seedSuperAdmin(pool)
    console.log(JSON.stringify({ data: { pass: true } }, null, 2))
  } finally {
    await pool.end()
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : 'platform init failed'
  console.error(JSON.stringify({ error: { code: 'PLATFORM_INIT_FAILED', message } }, null, 2))
  process.exit(1)
})

/**
 * Platform Prisma Pool
 *
 * Singleton PrismaClient connected to the PLATFORM master database (erp_platform).
 * Used only for: Tenant lookups, superadmin auth, billing.
 * Never used for school data — school data lives in per-tenant DBs.
 */

let _platformClient: any = null

export function getPlatformPrisma() {
  if (_platformClient) return _platformClient

  // Use the standard PrismaClient since we merged the platform and tenant schemas.
  const { PrismaClient } = require('@prisma/client')

  _platformClient = new PrismaClient({
    datasources: {
      db: { url: process.env.PLATFORM_DATABASE_URL || process.env.DATABASE_URL },
    },
  })

  return _platformClient
}

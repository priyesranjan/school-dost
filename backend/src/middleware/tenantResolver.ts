/**
 * Tenant Resolver Middleware
 *
 * This is the CORE of the database-per-tenant architecture.
 *
 * Flow:
 *   Request hits  dps.yourERP.com/api/students
 *       ↓
 *   extractSlug()  →  "dps"  (from hostname or X-Tenant-Slug header)
 *       ↓
 *   platformDb.tenant.findUnique({ where: { slug: "dps" } })
 *       ↓
 *   tenant.dbName = "tenant_dps_delhi"
 *       ↓
 *   getTenantPrismaClient("tenant_dps_delhi")  →  PrismaClient for that DB
 *       ↓
 *   req.tenantDb = <PrismaClient pointing at dps_delhi DB>
 *   req.tenant   = <Tenant record>
 *       ↓
 *   Route handler runs — uses req.tenantDb — NEVER sees another school's data
 */

import type { NextFunction, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { getPlatformPrisma } from '../db/platformPool'
import { env } from '../config/env'

// ── Tenant Prisma client cache ────────────────────────────────────────────────
// We keep one PrismaClient per tenant DB alive — expensive to create each request
const clientCache = new Map<string, PrismaClient>()

function buildTenantUrl(schemaName: string, dbHost: string, dbPort: number): string {
  const base = new URL(env.platformDatabaseUrl || env.databaseUrl)
  base.username = env.tenantDbUser
  base.password = env.tenantDbPass
  base.hostname = dbHost
  base.port = String(dbPort)
  base.searchParams.set('schema', schemaName)
  return base.toString()
}

export function getTenantPrismaClient(dbName: string, dbHost: string, dbPort: number): PrismaClient {
  const cacheKey = `${dbHost}:${dbPort}/${dbName}`

  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey)!
  }

  const client = new PrismaClient({
    datasources: { db: { url: buildTenantUrl(dbName, dbHost, dbPort) } },
  })

  clientCache.set(cacheKey, client)
  return client
}

// ── Extract tenant slug from request ─────────────────────────────────────────
// Supports both:
//   1. Subdomain:  dps.yourerp.com  →  "dps"
//   2. Header:     X-Tenant-Slug: dps  (for local dev / Postman)
function extractSlug(req: Request): { slug: string; source: 'header' | 'host' } | null {
  // Header-based (dev / mobile clients)
  const headerSlug = req.headers['x-tenant-slug']
  if (headerSlug && typeof headerSlug === 'string') {
    return { slug: headerSlug.toLowerCase().trim(), source: 'header' }
  }

  // Subdomain-based (production)
  const host = req.hostname || ''
  const parts = host.split('.')

  // dps.yourerp.com  →  parts = ['dps', 'yourerp', 'com']  →  'dps'
  // api.yourerp.com  →  ignored (no tenant)
  // localhost        →  null (dev fallback)
  if (parts.length >= 3) {
    const sub = parts[0].toLowerCase()
    const platformSubs = ['www', 'api', 'app', 'admin', 'superadmin', 'mail', 'smtp']
    if (!platformSubs.includes(sub)) {
      return { slug: sub, source: 'host' }
    }
  }

  return null
}

// ── Augment Express Request type ─────────────────────────────────────────────
declare global {
  namespace Express {
    interface Request {
      tenantSlug?: string
      tenantDb?: PrismaClient
      tenant?: {
        id: string
        slug: string
        name: string
        dbName: string
        dbHost: string
        dbPort: number
        status: string
        plan: string
        institutionCode: string
      }
    }
  }
}

// ── The Middleware ────────────────────────────────────────────────────────────
export async function resolveTenant(req: Request, res: Response, next: NextFunction) {
  const extracted = extractSlug(req)

  if (!extracted) {
    // No tenant context — this is a platform-level request (health, superadmin, etc.)
    // We attach the platform DB as the tenantDb to support platform-level auth sessions.
    req.tenantDb = getPlatformPrisma() as any
    return next()
  }
  const { slug, source } = extracted

  req.tenantSlug = slug

  try {
    const platformDb = getPlatformPrisma()

    // Look up tenant in master platform DB
    const tenant = await (platformDb as any).tenant.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        name: true,
        dbName: true,
        dbHost: true,
        dbPort: true,
        status: true,
        plan: true,
        institutionCode: true,
      },
    })

    if (!tenant) {
      // In managed hosts (Coolify/sslip/etc), the public host subdomain is often random
      // and should not force tenant resolution. Keep strict behavior for explicit headers.
      if (source === 'host') {
        req.tenantSlug = undefined
        req.tenantDb = getPlatformPrisma() as any
        return next()
      }
      res.status(404).json({
        error: {
          code: 'TENANT_NOT_FOUND',
          message: `No institution found for subdomain "${slug}"`,
        },
      })
      return
    }

    if (tenant.status === 'suspended' || tenant.status === 'cancelled') {
      res.status(403).json({
        error: {
          code: 'TENANT_SUSPENDED',
          message: `This institution's account is ${tenant.status}. Please contact support.`,
        },
      })
      return
    }

    // Attach tenant info and its dedicated Prisma client to the request
    req.tenant = tenant
    req.tenantDb = getTenantPrismaClient(tenant.dbName, tenant.dbHost, tenant.dbPort)

    next()
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Tenant resolution failed'
    res.status(500).json({
      error: { code: 'TENANT_RESOLUTION_FAILED', message },
    })
  }
}

// Enforce that generic DB context exists (either platform or tenant)
export function requireAnyContext(req: Request, res: Response, next: NextFunction) {
  if (!req.tenantDb) {
    res.status(400).json({
      error: {
        code: 'DB_CONTEXT_REQUIRED',
        message: 'Database context could not be resolved.',
      },
    })
    return
  }
  next()
}

// Enforce that a SPECIFIC school tenant context exists
export function requireSchoolContext(req: Request, res: Response, next: NextFunction) {
  if (!req.tenantDb || !req.tenantSlug) {
    res.status(400).json({
      error: {
        code: 'TENANT_CONTEXT_REQUIRED',
        message: 'Tenant context (slug) is required for this school-specific endpoint.',
      },
    })
    return
  }
  if (!req.tenant?.dbName || req.tenant.dbName === 'public') {
    res.status(500).json({
      error: {
        code: 'UNSAFE_TENANT_STORAGE',
        message: 'This institution is not configured with isolated storage.',
      },
    })
    return
  }
  next()
}

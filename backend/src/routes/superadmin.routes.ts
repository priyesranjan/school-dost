/**
 * Superadmin Routes
 *
 * These routes are PLATFORM-LEVEL — they manage tenants, not school data.
 * Protected by superadmin JWT (role: 'superadmin').
 *
 * POST /api/superadmin/tenants/provision   — onboard a new institution
 * GET  /api/superadmin/tenants             — list all institutions
 * GET  /api/superadmin/tenants/:id         — get one institution detail
 * POST /api/superadmin/tenants/:id/suspend — suspend institution
 * POST /api/superadmin/tenants/:id/activate — reactivate institution
 * GET  /api/superadmin/stats               — platform-level stats
 */

import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import {
  provisionTenant,
  suspendTenant,
  activateTenant,
  listTenants,
  sanitiseSlug,
} from '../services/tenantProvisioningService'
import { getPlatformPrisma } from '../db/platformPool'

const router = Router()

// All superadmin routes require auth context first, THEN superadmin role
router.use(requireAuth)
router.use(requireRole(['superadmin'] as any))

// ── GET /api/superadmin/stats ────────────────────────────────────────────────
router.get('/stats', async (_req, res) => {
  try {
    const platformDb = getPlatformPrisma()
    const [total, active, trial, suspended] = await Promise.all([
      (platformDb as any).tenant.count(),
      (platformDb as any).tenant.count({ where: { status: 'active' } }),
      (platformDb as any).tenant.count({ where: { status: 'trial' } }),
      (platformDb as any).tenant.count({ where: { status: 'suspended' } }),
    ])

    const totals = await (platformDb as any).tenant.aggregate({
      _sum: { totalStudents: true, totalStaff: true },
    })

    res.json({
      data: {
        totalTenants: total,
        activeTenants: active,
        trialTenants: trial,
        suspendedTenants: suspended,
        totalStudentsAcross: totals._sum.totalStudents || 0,
        totalStaffAcross: totals._sum.totalStaff || 0,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load stats'
    res.status(500).json({ error: { code: 'STATS_FAILED', message } })
  }
})

// ── GET /api/superadmin/tenants ──────────────────────────────────────────────
router.get('/tenants', async (_req, res) => {
  try {
    const tenants = await listTenants()
    res.json({ data: tenants })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to list tenants'
    res.status(500).json({ error: { code: 'LIST_FAILED', message } })
  }
})

// ── GET /api/superadmin/tenants/:id ─────────────────────────────────────────
router.get('/tenants/:id', async (req, res) => {
  try {
    const platformDb = getPlatformPrisma()
    const tenant = await (platformDb as any).tenant.findUnique({
      where: { id: req.params.id },
      include: { auditLogs: { orderBy: { createdAt: 'desc' }, take: 20 } },
    })

    if (!tenant) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Tenant not found' } })
      return
    }

    res.json({ data: tenant })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to get tenant'
    res.status(500).json({ error: { code: 'GET_FAILED', message } })
  }
})

// ── POST /api/superadmin/tenants/provision ───────────────────────────────────
router.post('/tenants/provision', async (req, res) => {
  try {
    const {
      name,
      slug,
      type,
      board,
      city,
      state,
      country,
      adminName,
      adminEmail,
      adminPhone,
      adminPasswordPlain,
      plan,
      institutionCode,
      seedDemo,
    } = req.body

    if (!name || !type || !city || !state || !adminName || !adminEmail || !adminPasswordPlain) {
      res.status(400).json({
        error: {
          code: 'VALIDATION_FAILED',
          message: 'name, type, city, state, adminName, adminEmail and adminPasswordPlain are required',
        },
      })
      return
    }

    const result = await provisionTenant({
      name,
      slug: slug || sanitiseSlug(name),
      type: type as any,
      board,
      city,
      state,
      country,
      adminName,
      adminEmail,
      adminPhone,
      adminPasswordPlain,
      plan: (plan || 'basic') as any,
      institutionCode: institutionCode || '001',
      seedDemo: !!seedDemo,
      performedBy: req.auth?.email || 'superadmin',
    })

    res.status(201).json({ data: result })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Provisioning failed'
    const isConflict = message.includes('already taken') || message.includes('already exists')
    res.status(isConflict ? 409 : 500).json({ error: { code: 'PROVISION_FAILED', message } })
  }
})

// ── POST /api/superadmin/tenants/:id/suspend ────────────────────────────────
router.post('/tenants/:id/suspend', async (req, res) => {
  try {
    await suspendTenant(req.params.id, req.auth?.email || 'superadmin')
    res.json({ data: { success: true } })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to suspend tenant'
    res.status(500).json({ error: { code: 'SUSPEND_FAILED', message } })
  }
})

// ── POST /api/superadmin/tenants/:id/activate ───────────────────────────────
router.post('/tenants/:id/activate', async (req, res) => {
  try {
    await activateTenant(req.params.id, req.auth?.email || 'superadmin')
    res.json({ data: { success: true } })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to activate tenant'
    res.status(500).json({ error: { code: 'ACTIVATE_FAILED', message } })
  }
})

export default router

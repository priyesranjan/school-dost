import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { writeActionLimiter } from '../middleware/rateLimit'
import { seedDemoData, clearTenantData } from '../services/maintenanceService'
import { appendAuditLog } from '../services/auditLogService'

const router = Router()

// Only admins and superadmins can touch demo data
router.post(
  '/seed-demo',
  requireAuth,
  requireRole(['admin', 'superadmin'] as any),
  writeActionLimiter,
  async (req, res) => {
    try {
      await seedDemoData(req.tenantDb!)

      await appendAuditLog(req.tenantDb!, {
        action: 'maintenance_seed_demo',
        module: 'system',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: 'Tenant Database',
        metadata: 'Seeded with demo records',
      })

      res.json({ data: { success: true, message: 'Institution populated with demo data.' } })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Seeding failed'
      res.status(500).json({ error: { code: 'MAINTENANCE_SEED_FAILED', message } })
    }
  },
)

router.post(
  '/clear-data',
  requireAuth,
  requireRole(['admin', 'superadmin'] as any),
  writeActionLimiter,
  async (req, res) => {
    try {
      await clearTenantData(req.tenantDb!)

      await appendAuditLog(req.tenantDb!, {
        action: 'maintenance_clear_data',
        module: 'system',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: 'Tenant Database',
        metadata: 'Wiped all records',
      })

      res.json({ data: { success: true, message: 'All institutional data cleared.' } })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Clearing failed'
      res.status(500).json({ error: { code: 'MAINTENANCE_CLEAR_FAILED', message } })
    }
  },
)

export default router

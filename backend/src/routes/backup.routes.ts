import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { writeActionLimiter } from '../middleware/rateLimit'
import { createTenantBackup, restoreTenantBackup, listTenantBackups } from '../services/backupService'
import { appendAuditLog } from '../services/auditLogService'

const router = Router()

function singleParam(value: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

// Multi-tenant backup routes
// Note: These use tenantId from params, which is a PLATFORM ID, not a slug.
// These routes are PROTECTED: only superadmins (or school owners) should see them.

router.get('/:tenantId', requireAuth, requireRole(['superadmin', 'admin'] as any), async (req, res) => {
  try {
    const data = await listTenantBackups(singleParam(req.params.tenantId))
    res.json({ data })
  } catch (error) {
    res
      .status(500)
      .json({ error: { code: 'BACKUP_LIST_FAILED', message: error instanceof Error ? error.message : 'Failed' } })
  }
})

router.post(
  '/:tenantId',
  requireAuth,
  requireRole(['superadmin', 'admin'] as any),
  writeActionLimiter,
  async (req, res) => {
    try {
      const data = await createTenantBackup(singleParam(req.params.tenantId), req.auth?.email || 'unknown')

      await appendAuditLog(req.tenantDb!, {
        action: 'backup_created',
        module: 'system',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: 'Database Snapshot',
        metadata: `File=${data.fileName}`,
      })

      res.json({ data })
    } catch (error) {
      res
        .status(500)
        .json({ error: { code: 'BACKUP_CREATE_FAILED', message: error instanceof Error ? error.message : 'Failed' } })
    }
  },
)

router.post(
  '/:tenantId/restore/:backupId',
  requireAuth,
  requireRole(['superadmin'] as any),
  writeActionLimiter,
  async (req, res) => {
    try {
      await restoreTenantBackup(singleParam(req.params.tenantId), Number(singleParam(req.params.backupId)))

      await appendAuditLog(req.tenantDb!, {
        action: 'backup_restored',
        module: 'system',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: 'Database Restore',
        metadata: `BackupID=${req.params.backupId}`,
      })

      res.json({ data: { success: true, message: 'Institutional recovery complete.' } })
    } catch (error) {
      res
        .status(500)
        .json({ error: { code: 'BACKUP_RESTORE_FAILED', message: error instanceof Error ? error.message : 'Failed' } })
    }
  },
)

export default router

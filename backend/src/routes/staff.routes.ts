import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { writeActionLimiter } from '../middleware/rateLimit'
import { createStaff, listStaff, getStaff, updateStaff, deleteStaff } from '../services/staffService'
import { appendAuditLog } from '../services/auditLogService'

function parsePage(value: unknown, fallback: number) {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback
}

function parsePerPage(value: unknown, fallback: number) {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return fallback
  return Math.min(100, Math.floor(n))
}

const router = Router()

router.get('/', requireAuth, async (req, res) => {
  try {
    const data = await listStaff(req.tenantDb!, {
      page: parsePage(req.query.page, 1),
      per_page: parsePerPage(req.query.per_page, 20),
      search: req.query.search ? String(req.query.search) : undefined,
      role: req.query.role ? String(req.query.role) : undefined,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list staff'
    res.status(500).json({ error: { code: 'STAFF_LIST_FAILED', message } })
  }
})

router.post('/', requireAuth, requireRole(['admin']), writeActionLimiter, async (req, res) => {
  try {
    const data = await createStaff(req.tenantDb!, req.body)
    await appendAuditLog(req.tenantDb!, {
      action: 'staff_onboarded',
      module: 'staff',
      actor_name: req.auth?.name || 'Unknown',
      actor_role: req.auth?.role || 'unknown',
      target: data.name,
      metadata: `Role=${data.role}`,
    })
    res.status(201).json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to onboard staff'
    res.status(500).json({ error: { code: 'STAFF_CREATE_FAILED', message } })
  }
})

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const data = await getStaff(req.tenantDb!, Number(req.params.id))
    if (!data) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Staff member not found' } })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get staff'
    res.status(500).json({ error: { code: 'STAFF_GET_FAILED', message } })
  }
})

router.patch('/:id', requireAuth, requireRole(['admin']), writeActionLimiter, async (req, res) => {
  try {
    const data = await updateStaff(req.tenantDb!, Number(req.params.id), req.body)
    await appendAuditLog(req.tenantDb!, {
      action: 'staff_updated',
      module: 'staff',
      actor_name: req.auth?.name || 'Unknown',
      actor_role: req.auth?.role || 'unknown',
      target: data.name,
      metadata: `ID=${data.id}`,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update staff'
    res.status(500).json({ error: { code: 'STAFF_UPDATE_FAILED', message } })
  }
})

router.delete('/:id', requireAuth, requireRole(['admin']), writeActionLimiter, async (req, res) => {
  try {
    await deleteStaff(req.tenantDb!, Number(req.params.id))
    await appendAuditLog(req.tenantDb!, {
      action: 'staff_deleted',
      module: 'staff',
      actor_name: req.auth?.name || 'Unknown',
      actor_role: req.auth?.role || 'unknown',
      target: `Staff ID ${req.params.id}`,
      metadata: '',
    })
    res.json({ data: { success: true } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete staff'
    res.status(500).json({ error: { code: 'STAFF_DELETE_FAILED', message } })
  }
})

export default router

import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { writeActionLimiter } from '../middleware/rateLimit'
import { validateBody, validateQuery } from '../middleware/validation'
import { staffTaskCreateSchema, staffTaskListQuerySchema, staffTaskStatusUpdateSchema } from '../validation/schemas'
import { createStaffTask, listStaffTasks, updateStaffTaskStatus } from '../services/tasksService'
import { appendAuditLog } from '../services/auditLogService'

const router = Router()
const taskRoles = ['admin', 'hod'] as const

router.get('/', requireAuth, requireRole(['admin', 'hod', 'teacher', 'accountant', 'receptionist']), validateQuery(staffTaskListQuerySchema), async (req, res) => {
  try {
    const data = await listStaffTasks(req.tenantDb!, {
      page: Number(req.query.page || 1),
      per_page: Math.min(100, Number(req.query.per_page || 100)),
      staff_id: req.query.staff_id ? Number(req.query.staff_id) : undefined,
      status: req.query.status ? String(req.query.status) : undefined,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list staff tasks'
    res.status(500).json({ error: { code: 'TASK_LIST_FAILED', message } })
  }
})

router.post('/', requireAuth, requireRole([...taskRoles]), writeActionLimiter, validateBody(staffTaskCreateSchema), async (req, res) => {
  try {
    const data = await createStaffTask(req.tenantDb!, req.body)
    await appendAuditLog(req.tenantDb!, {
      action: 'staff_task_created',
      module: 'hr',
      actor_name: req.auth?.name || 'Unknown',
      actor_role: req.auth?.role || 'unknown',
      target: data.title,
      metadata: `staff_id=${data.staff_id} priority=${data.priority}`,
    })
    res.status(201).json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create staff task'
    res.status(500).json({ error: { code: 'TASK_CREATE_FAILED', message } })
  }
})

router.patch('/:id/status', requireAuth, requireRole([...taskRoles]), writeActionLimiter, validateBody(staffTaskStatusUpdateSchema), async (req, res) => {
  try {
    const data = await updateStaffTaskStatus(req.tenantDb!, Number(req.params.id), req.body.status)
    await appendAuditLog(req.tenantDb!, {
      action: 'staff_task_status_updated',
      module: 'hr',
      actor_name: req.auth?.name || 'Unknown',
      actor_role: req.auth?.role || 'unknown',
      target: data.title,
      metadata: `status=${data.status}`,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update staff task'
    res.status(500).json({ error: { code: 'TASK_STATUS_UPDATE_FAILED', message } })
  }
})

export default router

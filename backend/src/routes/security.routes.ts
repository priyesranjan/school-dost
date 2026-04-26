import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { writeActionLimiter } from '../middleware/rateLimit'
import { validateBody, validateQuery } from '../middleware/validation'
import { securityPolicyUpdateSchema, securitySessionsListQuerySchema } from '../validation/schemas'
import {
  getOrCreateSecurityPolicy,
  listSecuritySessions,
  revokeSecuritySession,
  updateSecurityPolicy,
} from '../services/securityService'
import { appendAuditLog } from '../services/auditLogService'

const router = Router()
const adminRoles = ['admin'] as const

router.get('/policy', requireAuth, requireRole([...adminRoles]), async (req, res) => {
  try {
    const data = await getOrCreateSecurityPolicy(req.tenantDb!)
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load security policy'
    res.status(500).json({ error: { code: 'SECURITY_POLICY_LOAD_FAILED', message } })
  }
})

router.put(
  '/policy',
  requireAuth,
  requireRole([...adminRoles]),
  writeActionLimiter,
  validateBody(securityPolicyUpdateSchema),
  async (req, res) => {
    try {
      const data = await updateSecurityPolicy(req.tenantDb!, req.body, req.auth?.name || null)
      await appendAuditLog(req.tenantDb!, {
        action: 'security_policy_updated',
        module: 'settings',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: 'Security Policy',
        metadata: `session_timeout_hours=${data.session_timeout_hours} enforce_ip_allowlist=${data.enforce_ip_allowlist}`,
      })
      res.json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update security policy'
      res.status(500).json({ error: { code: 'SECURITY_POLICY_UPDATE_FAILED', message } })
    }
  },
)

router.get('/sessions', requireAuth, requireRole([...adminRoles]), validateQuery(securitySessionsListQuerySchema), async (req, res) => {
  try {
    const data = await listSecuritySessions(req.tenantDb!, {
      active_only: req.query.active_only === undefined ? undefined : Boolean(req.query.active_only),
      role: req.query.role ? String(req.query.role) : undefined,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load sessions'
    res.status(500).json({ error: { code: 'SECURITY_SESSIONS_LOAD_FAILED', message } })
  }
})

router.post('/sessions/:id/revoke', requireAuth, requireRole([...adminRoles]), writeActionLimiter, async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isFinite(id) || id <= 0) {
    res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Invalid session id' } })
    return
  }
  try {
    const data = await revokeSecuritySession(req.tenantDb!, id)
    await appendAuditLog(req.tenantDb!, {
      action: 'security_session_revoked',
      module: 'settings',
      actor_name: req.auth?.name || 'Unknown',
      actor_role: req.auth?.role || 'unknown',
      target: data.email,
      metadata: `session_id=${data.session_id ?? ''} ip=${data.ip_address ?? ''}`,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to revoke session'
    res.status(500).json({ error: { code: 'SECURITY_SESSION_REVOKE_FAILED', message } })
  }
})

export default router

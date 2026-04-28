import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { writeActionLimiter } from '../middleware/rateLimit'
import { getInstitutionProfile, upsertInstitutionProfile } from '../services/institutionProfileService'
import { appendAuditLog } from '../services/auditLogService'

const router = Router()

router.get('/profile', async (req, res) => {
  try {
    const data = await getInstitutionProfile(req.tenantDb!)
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load institution profile'
    res.status(500).json({ error: { code: 'INSTITUTION_PROFILE_LOAD_FAILED', message } })
  }
})

router.put('/profile', requireAuth, requireRole(['admin']), writeActionLimiter, async (req, res) => {
  try {
    const data = await upsertInstitutionProfile(req.tenantDb!, req.body)
    await appendAuditLog(req.tenantDb!, {
      action: 'institution_profile_updated',
      module: 'settings',
      actor_name: req.auth?.name || 'Unknown',
      actor_role: req.auth?.role || 'unknown',
      target: String((data as any).name || 'Institution Profile'),
      metadata: `slug=${(data as any).slug || req.tenantSlug || ''}`,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save institution profile'
    res.status(500).json({ error: { code: 'INSTITUTION_PROFILE_SAVE_FAILED', message } })
  }
})

export default router

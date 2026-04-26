import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { getEnterpriseAnalyticsOverview } from '../services/analyticsService'

function parseDays(value: unknown, fallback: number) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback
  return Math.min(365, Math.max(7, Math.floor(parsed)))
}

const router = Router()

router.get('/overview', requireAuth, requireRole(['admin', 'accountant', 'hod']), async (req, res) => {
  try {
    const data = await getEnterpriseAnalyticsOverview(req.tenantDb!, parseDays(req.query.days, 30))
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load analytics overview'
    res.status(500).json({ error: { code: 'ANALYTICS_OVERVIEW_FAILED', message } })
  }
})

export default router
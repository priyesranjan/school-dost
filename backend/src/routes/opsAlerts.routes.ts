import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { getOpsAlertsSnapshot } from '../services/opsAlertsService'

function parseDays(value: unknown, fallback: number) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback
  return Math.min(365, Math.max(7, Math.floor(parsed)))
}

function parseLimit(value: unknown, fallback: number) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback
  return Math.min(500, Math.max(10, Math.floor(parsed)))
}

const router = Router()

router.get('/', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const data = await getOpsAlertsSnapshot(req.tenantDb!, {
      days: parseDays(req.query.days, 7),
      limit: parseLimit(req.query.limit, 200),
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load ops alerts'
    res.status(500).json({ error: { code: 'OPS_ALERTS_FETCH_FAILED', message } })
  }
})

export default router
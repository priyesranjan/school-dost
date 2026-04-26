import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { validateBody, validateQuery } from '../middleware/validation'
import {
  webhookDeliveryListQuerySchema,
  webhookSubscriptionCreateSchema,
  webhookSubscriptionUpdateSchema,
} from '../validation/schemas'
import {
  WEBHOOK_EVENT_CATALOG,
  createWebhookSubscription,
  listWebhookDeliveries,
  listWebhookSubscriptions,
  sendTestWebhookSubscription,
  updateWebhookSubscription,
} from '../services/webhookService'
import { appendAuditLog } from '../services/auditLogService'

const router = Router()

function parseId(value: unknown) {
  const raw = Array.isArray(value) ? value[0] : value
  const id = Number(raw)
  return Number.isFinite(id) && id > 0 ? Math.floor(id) : null
}

router.get('/catalog', requireAuth, requireRole(['admin']), async (_req, res) => {
  res.json({ data: { events: WEBHOOK_EVENT_CATALOG } })
})

router.get('/', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const data = await listWebhookSubscriptions(req.tenantDb!)
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list webhook subscriptions'
    res.status(500).json({ error: { code: 'WEBHOOK_LIST_FAILED', message } })
  }
})

router.post(
  '/',
  requireAuth,
  requireRole(['admin']),
  validateBody(webhookSubscriptionCreateSchema),
  async (req, res) => {
    try {
      const data = await createWebhookSubscription(req.tenantDb!, req.body)
      await appendAuditLog(req.tenantDb!, {
        action: 'webhook_subscription_created',
        module: 'settings',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: data.name,
        metadata: `url=${data.url} active=${data.active} events=${data.events.join(',')}`,
      })
      res.status(201).json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create webhook subscription'
      res.status(500).json({ error: { code: 'WEBHOOK_CREATE_FAILED', message } })
    }
  },
)

router.patch(
  '/:id',
  requireAuth,
  requireRole(['admin']),
  validateBody(webhookSubscriptionUpdateSchema),
  async (req, res) => {
    const id = parseId(req.params.id)
    if (!id) {
      res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Invalid webhook subscription id' } })
      return
    }

    try {
      const data = await updateWebhookSubscription(req.tenantDb!, id, req.body)
      await appendAuditLog(req.tenantDb!, {
        action: 'webhook_subscription_updated',
        module: 'settings',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: data.name,
        metadata: `id=${id} active=${data.active} events=${data.events.join(',')}`,
      })
      res.json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update webhook subscription'
      res.status(500).json({ error: { code: 'WEBHOOK_UPDATE_FAILED', message } })
    }
  },
)

router.post('/:id/test', requireAuth, requireRole(['admin']), async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) {
    res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Invalid webhook subscription id' } })
    return
  }

  try {
    const data = await sendTestWebhookSubscription(req.tenantDb!, id, req.tenant?.slug || req.tenantSlug, req.auth?.name)
    await appendAuditLog(req.tenantDb!, {
      action: 'webhook_test_sent',
      module: 'settings',
      actor_name: req.auth?.name || 'Unknown',
      actor_role: req.auth?.role || 'unknown',
      target: `webhook_id=${id}`,
      metadata: `event_id=${data.event_id}`,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send webhook test event'
    res.status(500).json({ error: { code: 'WEBHOOK_TEST_FAILED', message } })
  }
})

router.get(
  '/deliveries',
  requireAuth,
  requireRole(['admin']),
  validateQuery(webhookDeliveryListQuerySchema),
  async (req, res) => {
    try {
      const query = req.query as {
        page?: number
        per_page?: number
        subscription_id?: number
        status?: 'pending' | 'success' | 'failed'
        event_type?: string
      }
      const data = await listWebhookDeliveries(req.tenantDb!, {
        page: query.page || 1,
        per_page: Math.min(100, query.per_page || 50),
        subscription_id: query.subscription_id,
        status: query.status,
        event_type: query.event_type,
      })
      res.json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to list webhook deliveries'
      res.status(500).json({ error: { code: 'WEBHOOK_DELIVERY_LIST_FAILED', message } })
    }
  },
)

export default router

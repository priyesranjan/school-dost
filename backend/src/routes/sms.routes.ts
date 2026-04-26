import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { writeActionLimiter } from '../middleware/rateLimit'
import { validateBody } from '../middleware/validation'
import { smsBulkSendSchema, smsSendSchema } from '../validation/schemas'
import { listSmsLogs, sendBulkSmsMessages, sendSmsMessage } from '../services/smsService'
import { appendAuditLog } from '../services/auditLogService'
import { dispatchWebhookEvent } from '../services/webhookService'

function parsePage(value: unknown, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback
}

function parsePerPage(value: unknown, fallback: number) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback
  return Math.min(100, Math.floor(parsed))
}

function queueWebhook(task: unknown) {
  void Promise.resolve(task).catch(() => {})
}

const senderRoles = ['admin', 'accountant', 'teacher', 'receptionist', 'hod'] as any
const router = Router()

router.post(
  '/send',
  requireAuth,
  requireRole(senderRoles),
  writeActionLimiter,
  validateBody(smsSendSchema),
  async (req, res) => {
    try {
      const data = await sendSmsMessage(req.tenantDb!, req.body)
      await appendAuditLog(req.tenantDb!, {
        action: 'message_sent',
        module: 'communications',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: data.phone,
        metadata: `channel=${data.channel} status=${data.status} type=${data.type}`,
      })
      queueWebhook(dispatchWebhookEvent(req.tenantDb!, {
        type: data.status === 'sent' ? 'communications.sms.sent' : 'communications.sms.failed',
        tenant_slug: req.tenant?.slug || req.tenantSlug || req.auth?.tenantSlug || null,
        data: {
          message: data,
          actor: {
            name: req.auth?.name || 'Unknown',
            role: req.auth?.role || 'unknown',
          },
        },
      }))
      res.json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send message'
      res.status(500).json({ error: { code: 'SMS_SEND_FAILED', message } })
    }
  },
)

router.post(
  '/send-bulk',
  requireAuth,
  requireRole(senderRoles),
  writeActionLimiter,
  validateBody(smsBulkSendSchema),
  async (req, res) => {
    try {
      const data = await sendBulkSmsMessages(req.tenantDb!, req.body)
      await appendAuditLog(req.tenantDb!, {
        action: 'message_campaign_sent',
        module: 'communications',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: `${data.length} recipient(s)`,
        metadata: `channel=${req.body.channel || 'sms'} type=${req.body.type || 'campaign'}`,
      })
      for (const item of data) {
        queueWebhook(dispatchWebhookEvent(req.tenantDb!, {
          type: item.status === 'sent' ? 'communications.sms.sent' : 'communications.sms.failed',
          tenant_slug: req.tenant?.slug || req.tenantSlug || req.auth?.tenantSlug || null,
          data: {
            message: item,
            actor: {
              name: req.auth?.name || 'Unknown',
              role: req.auth?.role || 'unknown',
            },
          },
        }))
      }
      res.json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send campaign'
      res.status(500).json({ error: { code: 'SMS_BULK_SEND_FAILED', message } })
    }
  },
)

router.get('/logs', requireAuth, requireRole(senderRoles), async (req, res) => {
  try {
    const data = await listSmsLogs(req.tenantDb!, {
      page: parsePage(req.query.page, 1),
      per_page: parsePerPage(req.query.per_page, 50),
      status: req.query.status ? (String(req.query.status) as any) : undefined,
      channel: req.query.channel ? (String(req.query.channel) as any) : undefined,
      type: req.query.type ? (String(req.query.type) as any) : undefined,
      phone: req.query.phone ? String(req.query.phone) : undefined,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list message logs'
    res.status(500).json({ error: { code: 'SMS_LOGS_FAILED', message } })
  }
})

export default router

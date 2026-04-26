import { createHmac, randomUUID } from 'node:crypto'
import type { PrismaClient } from '@prisma/client'

export const WEBHOOK_EVENT_CATALOG = [
  {
    key: 'fees.payment.recorded',
    label: 'Fee Payment Recorded',
    description: 'Fires whenever a fee payment is recorded for a student.',
  },
  {
    key: 'accounting.expense.created',
    label: 'Expense Created',
    description: 'Fires after an expense entry is posted to the accounting ledger.',
  },
  {
    key: 'accounting.expense.deleted',
    label: 'Expense Deleted',
    description: 'Fires after an expense entry is removed from the accounting ledger.',
  },
  {
    key: 'communications.sms.sent',
    label: 'Message Sent',
    description: 'Fires after an SMS or WhatsApp message is delivered successfully.',
  },
  {
    key: 'communications.sms.failed',
    label: 'Message Failed',
    description: 'Fires after an SMS or WhatsApp send attempt fails.',
  },
  {
    key: 'hr.payroll.generated',
    label: 'Payroll Generated',
    description: 'Fires when monthly payroll is generated or refreshed for staff.',
  },
  {
    key: 'hr.payroll.paid',
    label: 'Payroll Paid',
    description: 'Fires when a payroll record is marked as paid.',
  },
  {
    key: 'hr.leave.requested',
    label: 'Leave Requested',
    description: 'Fires when a staff leave request is submitted into the HR queue.',
  },
  {
    key: 'hr.leave.reviewed',
    label: 'Leave Reviewed',
    description: 'Fires when an HR approver updates a leave request decision.',
  },
  {
    key: 'hr.appraisal.published',
    label: 'Appraisal Published',
    description: 'Fires when a staff performance appraisal is published.',
  },
  {
    key: 'inventory.purchase_order.created',
    label: 'Purchase Order Created',
    description: 'Fires when a new purchase order is raised for inventory procurement.',
  },
  {
    key: 'inventory.purchase_order.received',
    label: 'Purchase Order Received',
    description: 'Fires when a purchase order is received into stock.',
  },
  {
    key: 'academic.assignment.created',
    label: 'Assignment Created',
    description: 'Fires when a teacher or academic lead creates a new assignment.',
  },
  {
    key: 'academic.assignment.submitted',
    label: 'Assignment Submitted',
    description: 'Fires when a student submits work for an assignment.',
  },
  {
    key: 'system.webhook.test',
    label: 'Test Event',
    description: 'Manual test event for validating endpoint connectivity and signatures.',
  },
] as const

type WebhookHeaders = Record<string, string>

type WebhookEventPayload = {
  id?: string
  type: string
  tenant_slug?: string | null
  occurred_at?: string
  data: Record<string, unknown>
}

function sanitizeHeaders(headers: unknown): WebhookHeaders {
  if (!headers || typeof headers !== 'object' || Array.isArray(headers)) return {}
  const sanitized: WebhookHeaders = {}
  for (const [key, value] of Object.entries(headers as Record<string, unknown>)) {
    if (typeof value === 'string') {
      sanitized[key] = value
    }
  }
  return sanitized
}

function maskSecret(secret: string) {
  if (!secret) return ''
  if (secret.length <= 4) return '****'
  return `${'*'.repeat(Math.max(4, secret.length - 4))}${secret.slice(-4)}`
}

function mapSubscription(row: any) {
  return {
    id: Number(row.id),
    name: row.name,
    url: row.url,
    events: Array.isArray(row.events) ? row.events : [],
    active: Boolean(row.active),
    timeout_ms: Number(row.timeoutMs),
    headers: sanitizeHeaders(row.headers),
    failure_count: Number(row.failureCount || 0),
    last_success_at: row.lastSuccessAt ? row.lastSuccessAt.toISOString() : null,
    last_failure_at: row.lastFailureAt ? row.lastFailureAt.toISOString() : null,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
    secret_hint: maskSecret(row.secret || ''),
  }
}

function mapDelivery(row: any) {
  return {
    id: Number(row.id),
    subscription_id: Number(row.subscriptionId),
    subscription_name: row.subscription?.name || null,
    event_type: row.eventType,
    attempt: Number(row.attempt),
    status: row.status,
    response_status: row.responseStatus ?? null,
    response_body: row.responseBody ?? null,
    error: row.error ?? null,
    delivered_at: row.deliveredAt ? row.deliveredAt.toISOString() : null,
    created_at: row.createdAt.toISOString(),
  }
}

function normalizeEvents(events: string[]) {
  return [...new Set(events.map((value) => value.trim()).filter(Boolean))]
}

function eventMatchesPattern(pattern: string, eventType: string) {
  if (pattern === '*') return true
  if (pattern.endsWith('*')) {
    return eventType.startsWith(pattern.slice(0, -1))
  }
  return pattern === eventType
}

function matchesSubscription(events: string[], eventType: string) {
  return events.some((pattern) => eventMatchesPattern(pattern, eventType))
}

function normalizeEvent(input: WebhookEventPayload) {
  return {
    id: input.id || randomUUID(),
    type: input.type,
    tenant_slug: input.tenant_slug || null,
    occurred_at: input.occurred_at || new Date().toISOString(),
    data: input.data,
  }
}

function buildSignature(secret: string, timestamp: string, body: string) {
  const digest = createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex')
  return `sha256=${digest}`
}

function truncateText(value: string | null | undefined, max = 4000) {
  if (!value) return null
  return value.length > max ? value.slice(0, max) : value
}

async function requestWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

async function deliverToSubscription(
  db: PrismaClient,
  subscription: any,
  event: ReturnType<typeof normalizeEvent>,
) {
  const timestamp = new Date().toISOString()
  const body = JSON.stringify(event)
  const customHeaders = sanitizeHeaders(subscription.headers)
  const headers: WebhookHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'ERP-School-Webhooks/1.0',
    'X-ERP-School-Event': event.type,
    'X-ERP-School-Timestamp': timestamp,
    'X-ERP-School-Signature': buildSignature(subscription.secret, timestamp, body),
    ...customHeaders,
  }

  const delivery = await (db as any).webhookDelivery.create({
    data: {
      subscriptionId: subscription.id,
      eventType: event.type,
      status: 'pending',
      requestHeaders: headers,
      requestBody: event,
    },
  })

  const deliveryId = Number(delivery.id)
  headers['X-ERP-School-Delivery-Id'] = String(deliveryId)

  try {
    const response = await requestWithTimeout(
      subscription.url,
      {
        method: 'POST',
        headers,
        body,
      },
      Math.max(1000, Number(subscription.timeoutMs || 5000)),
    )
    const responseBody = truncateText(await response.text())
    const status = response.ok ? 'success' : 'failed'

    await (db as any).webhookDelivery.update({
      where: { id: delivery.id },
      data: {
        status,
        requestHeaders: headers,
        responseStatus: response.status,
        responseBody,
        error: response.ok ? null : `Endpoint returned ${response.status}`,
        deliveredAt: response.ok ? new Date() : null,
      },
    })

    await (db as any).webhookSubscription.update({
      where: { id: subscription.id },
      data: response.ok
        ? {
            failureCount: 0,
            lastSuccessAt: new Date(),
          }
        : {
            failureCount: { increment: 1 },
            lastFailureAt: new Date(),
          },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook delivery failed'
    await (db as any).webhookDelivery.update({
      where: { id: delivery.id },
      data: {
        status: 'failed',
        requestHeaders: headers,
        error: truncateText(message, 500),
      },
    })
    await (db as any).webhookSubscription.update({
      where: { id: subscription.id },
      data: {
        failureCount: { increment: 1 },
        lastFailureAt: new Date(),
      },
    })
  }
}

export async function listWebhookSubscriptions(db: PrismaClient) {
  const rows = await (db as any).webhookSubscription.findMany({
    orderBy: [{ createdAt: 'desc' }],
  })
  return rows.map(mapSubscription)
}

export async function createWebhookSubscription(
  db: PrismaClient,
  input: {
    name: string
    url: string
    events: string[]
    active?: boolean
    timeout_ms?: number
    secret?: string
    headers?: Record<string, string>
  },
) {
  const row = await (db as any).webhookSubscription.create({
    data: {
      name: input.name.trim(),
      url: input.url.trim(),
      events: normalizeEvents(input.events),
      active: input.active ?? true,
      timeoutMs: input.timeout_ms ?? 5000,
      secret: (input.secret || randomUUID()).trim(),
      headers: sanitizeHeaders(input.headers),
    },
  })
  return mapSubscription(row)
}

export async function updateWebhookSubscription(
  db: PrismaClient,
  id: number,
  input: {
    name?: string
    url?: string
    events?: string[]
    active?: boolean
    timeout_ms?: number
    secret?: string
    headers?: Record<string, string>
  },
) {
  const data: Record<string, unknown> = {}
  if (typeof input.name === 'string') data.name = input.name.trim()
  if (typeof input.url === 'string') data.url = input.url.trim()
  if (Array.isArray(input.events)) data.events = normalizeEvents(input.events)
  if (typeof input.active === 'boolean') data.active = input.active
  if (typeof input.timeout_ms === 'number') data.timeoutMs = input.timeout_ms
  if (typeof input.secret === 'string') data.secret = input.secret.trim()
  if (input.headers) data.headers = sanitizeHeaders(input.headers)

  const row = await (db as any).webhookSubscription.update({
    where: { id: BigInt(id) },
    data,
  })
  return mapSubscription(row)
}

export async function listWebhookDeliveries(
  db: PrismaClient,
  input: {
    page: number
    per_page: number
    subscription_id?: number
    status?: 'pending' | 'success' | 'failed'
    event_type?: string
  },
) {
  const where = {
    ...(input.subscription_id ? { subscriptionId: BigInt(input.subscription_id) } : {}),
    ...(input.status ? { status: input.status } : {}),
    ...(input.event_type ? { eventType: input.event_type } : {}),
  }

  const [rows, total] = await Promise.all([
    (db as any).webhookDelivery.findMany({
      where,
      include: {
        subscription: {
          select: { name: true },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
      skip: (input.page - 1) * input.per_page,
      take: input.per_page,
    }),
    (db as any).webhookDelivery.count({ where }),
  ])

  return {
    items: rows.map(mapDelivery),
    total,
    page: input.page,
    per_page: input.per_page,
  }
}

export async function dispatchWebhookEvent(db: PrismaClient, input: WebhookEventPayload) {
  const event = normalizeEvent(input)
  const subscriptions = await (db as any).webhookSubscription.findMany({
    where: { active: true },
    orderBy: [{ createdAt: 'asc' }],
  })

  const matched = subscriptions.filter((subscription: any) =>
    matchesSubscription(Array.isArray(subscription.events) ? subscription.events : [], event.type),
  )

  await Promise.all(matched.map((subscription: any) => deliverToSubscription(db, subscription, event)))
  return { delivered_to: matched.length, event_id: event.id }
}

export async function sendTestWebhookSubscription(
  db: PrismaClient,
  id: number,
  tenantSlug?: string | null,
  actorName?: string | null,
) {
  const subscription = await (db as any).webhookSubscription.findUnique({
    where: { id: BigInt(id) },
  })

  if (!subscription) {
    throw new Error('Webhook subscription not found')
  }

  const event = normalizeEvent({
    type: 'system.webhook.test',
    tenant_slug: tenantSlug || null,
    data: {
      message: 'ERP School webhook connectivity test',
      actor_name: actorName || 'Unknown',
    },
  })

  await deliverToSubscription(db, subscription, event)
  return { event_id: event.id }
}

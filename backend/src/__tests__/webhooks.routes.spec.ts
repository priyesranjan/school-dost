import { describe, it, expect, beforeEach, vi } from 'vitest'
import request from 'supertest'
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset } from 'vitest-mock-extended'

vi.mock('../services/webhookService', () => ({
  WEBHOOK_EVENT_CATALOG: [
    { key: 'fees.payment.recorded', label: 'Fee Payment Recorded', description: 'Payment event' },
  ],
  listWebhookSubscriptions: vi.fn(),
  createWebhookSubscription: vi.fn(),
  updateWebhookSubscription: vi.fn(),
  listWebhookDeliveries: vi.fn(),
  sendTestWebhookSubscription: vi.fn(),
}))

vi.mock('../services/auditLogService', () => ({
  appendAuditLog: vi.fn(),
}))

vi.mock('../services/authTokenService', () => ({
  verifyAuthToken: vi.fn((token: string) => {
    if (token === 'admin_token') {
      return {
        sub: '1',
        name: 'Admin',
        role: 'admin',
        email: 'admin@school.com',
        tenantSlug: 'demo',
        isRoot: false,
      }
    }
    if (token === 'teacher_token') {
      return {
        sub: '2',
        name: 'Teacher',
        role: 'teacher',
        email: 'teacher@school.com',
        tenantSlug: 'demo',
        isRoot: false,
      }
    }
    throw new Error('Invalid token')
  }),
}))

import * as webhookServiceMock from '../services/webhookService'
import webhooksRoutes from '../routes/webhooks.routes'

const prismaMock = mockDeep<PrismaClient>()

const app = express()
app.use(express.json())
app.use((req, _res, next) => {
  req.tenantDb = prismaMock
  req.tenantSlug = 'demo'
  req.tenant = {
    id: 'tenant_1',
    slug: 'demo',
    name: 'Demo School',
    dbName: 'tenant_demo',
    dbHost: 'localhost',
    dbPort: 5432,
    status: 'active',
    plan: 'premium',
    institutionCode: '001',
  }
  next()
})
app.use('/api/webhooks', webhooksRoutes)

describe('Webhook API Routes', () => {
  beforeEach(() => {
    mockReset(prismaMock)
    vi.clearAllMocks()
  })

  it('should require auth for catalog', async () => {
    const res = await request(app).get('/api/webhooks/catalog')
    expect(res.status).toBe(401)
    expect(res.body.error.code).toBe('UNAUTHORIZED')
  })

  it('should forbid non-admin users', async () => {
    const res = await request(app).get('/api/webhooks').set('Authorization', 'Bearer teacher_token')
    expect(res.status).toBe(403)
    expect(res.body.error.code).toBe('FORBIDDEN')
  })

  it('should create webhook subscriptions', async () => {
    const subscription = {
      id: 1,
      name: 'Finance ERP',
      url: 'https://example.com/hooks/finance',
      events: ['fees.payment.recorded'],
      active: true,
      timeout_ms: 5000,
      headers: {},
      failure_count: 0,
      last_success_at: null,
      last_failure_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      secret_hint: '********ABCD',
    }
    vi.mocked(webhookServiceMock.createWebhookSubscription).mockResolvedValueOnce(subscription)

    const res = await request(app).post('/api/webhooks').set('Authorization', 'Bearer admin_token').send({
      name: 'Finance ERP',
      url: 'https://example.com/hooks/finance',
      events: ['fees.payment.recorded'],
      timeout_ms: 5000,
    })

    expect(res.status).toBe(201)
    expect(res.body.data).toEqual(subscription)
    expect(webhookServiceMock.createWebhookSubscription).toHaveBeenCalledOnce()
  })

  it('should reject invalid create payloads', async () => {
    const res = await request(app).post('/api/webhooks').set('Authorization', 'Bearer admin_token').send({
      name: '',
      url: 'not-a-url',
      events: [],
    })

    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('INVALID_REQUEST')
  })

  it('should clamp delivery pagination from validated query', async () => {
    vi.mocked(webhookServiceMock.listWebhookDeliveries).mockResolvedValueOnce({
      items: [],
      total: 0,
      page: 1,
      per_page: 100,
    })

    const res = await request(app)
      .get('/api/webhooks/deliveries?per_page=999&event_type=fees.payment.recorded')
      .set('Authorization', 'Bearer admin_token')

    expect(res.status).toBe(200)
    expect(webhookServiceMock.listWebhookDeliveries).toHaveBeenCalledWith(prismaMock, {
      page: 1,
      per_page: 100,
      subscription_id: undefined,
      status: undefined,
      event_type: 'fees.payment.recorded',
    })
  })

  it('should send a test event to a subscription', async () => {
    vi.mocked(webhookServiceMock.sendTestWebhookSubscription).mockResolvedValueOnce({
      event_id: 'evt_123',
    })

    const res = await request(app).post('/api/webhooks/4/test').set('Authorization', 'Bearer admin_token')

    expect(res.status).toBe(200)
    expect(res.body.data).toEqual({ event_id: 'evt_123' })
    expect(webhookServiceMock.sendTestWebhookSubscription).toHaveBeenCalledWith(prismaMock, 4, 'demo', 'Admin')
  })
})

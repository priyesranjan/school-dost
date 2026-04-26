import { describe, it, expect, beforeEach, vi } from 'vitest'
import request from 'supertest'
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset } from 'vitest-mock-extended'

vi.mock('../services/smsService', () => ({
  sendSmsMessage: vi.fn(),
  sendBulkSmsMessages: vi.fn(),
  listSmsLogs: vi.fn(),
}))

vi.mock('../services/auditLogService', () => ({
  appendAuditLog: vi.fn(),
}))

vi.mock('../services/webhookService', () => ({
  dispatchWebhookEvent: vi.fn(),
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
    if (token === 'parent_token') {
      return {
        sub: '2',
        name: 'Parent',
        role: 'parent',
        email: 'parent@school.com',
        tenantSlug: 'demo',
        isRoot: false,
      }
    }
    throw new Error('Invalid token')
  }),
}))

import * as smsServiceMock from '../services/smsService'
import smsRoutes from '../routes/sms.routes'

const prismaMock = mockDeep<PrismaClient>()

const app = express()
app.use(express.json())
app.use((req, _res, next) => {
  req.tenantDb = prismaMock
  next()
})
app.use('/api/sms', smsRoutes)

describe('SMS API Routes', () => {
  beforeEach(() => {
    mockReset(prismaMock)
    vi.clearAllMocks()
  })

  it('should return 401 when token is missing', async () => {
    const res = await request(app).get('/api/sms/logs')
    expect(res.status).toBe(401)
    expect(res.body.error.code).toBe('UNAUTHORIZED')
  })

  it('should return 403 when role cannot send messages', async () => {
    const res = await request(app).post('/api/sms/send').set('Authorization', 'Bearer parent_token').send({
      phone: '9876543210',
      message: 'Hello',
    })

    expect(res.status).toBe(403)
    expect(res.body.error.code).toBe('FORBIDDEN')
  })

  it('should reject invalid send payloads', async () => {
    const res = await request(app).post('/api/sms/send').set('Authorization', 'Bearer admin_token').send({
      phone: '123',
      message: '',
    })

    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('INVALID_REQUEST')
  })

  it('should call send service for valid payloads', async () => {
    const log = {
      id: 1,
      phone: '9876543210',
      student_name: 'Aarav',
      message: 'Hello',
      type: 'general',
      status: 'sent',
      sent_at: new Date().toISOString(),
      channel: 'whatsapp',
      template_id: null,
      provider_message_id: null,
      error: null,
    }
    vi.mocked(smsServiceMock.sendSmsMessage).mockResolvedValueOnce(log)

    const res = await request(app).post('/api/sms/send').set('Authorization', 'Bearer admin_token').send({
      phone: '9876543210',
      student_name: 'Aarav',
      message: 'Hello',
      channel: 'whatsapp',
    })

    expect(res.status).toBe(200)
    expect(res.body.data).toEqual(log)
    expect(smsServiceMock.sendSmsMessage).toHaveBeenCalledOnce()
  })

  it('should call list service with clamped pagination', async () => {
    vi.mocked(smsServiceMock.listSmsLogs).mockResolvedValueOnce({
      items: [],
      total: 0,
      page: 1,
      per_page: 100,
    })

    const res = await request(app)
      .get('/api/sms/logs?per_page=999&channel=sms')
      .set('Authorization', 'Bearer admin_token')

    expect(res.status).toBe(200)
    expect(smsServiceMock.listSmsLogs).toHaveBeenCalledWith(prismaMock, {
      page: 1,
      per_page: 100,
      status: undefined,
      channel: 'sms',
      type: undefined,
      phone: undefined,
    })
  })
})

import { describe, it, expect, beforeEach, vi } from 'vitest'
import request from 'supertest'
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset } from 'vitest-mock-extended'

vi.mock('../services/opsAlertsService', () => ({
  getOpsAlertsSnapshot: vi.fn(),
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

import * as opsAlertsServiceMock from '../services/opsAlertsService'
import opsAlertsRoutes from '../routes/opsAlerts.routes'

const prismaMock = mockDeep<PrismaClient>()

const app = express()
app.use(express.json())
app.use((req, _res, next) => {
  req.tenantDb = prismaMock
  next()
})
app.use('/api/ops-alerts', opsAlertsRoutes)

describe('Ops Alerts API Routes', () => {
  beforeEach(() => {
    mockReset(prismaMock)
    vi.clearAllMocks()
  })

  it('should return 401 when token is missing', async () => {
    const res = await request(app).get('/api/ops-alerts')
    expect(res.status).toBe(401)
    expect(res.body.error.code).toBe('UNAUTHORIZED')
  })

  it('should return 403 for non-admin role', async () => {
    const res = await request(app).get('/api/ops-alerts').set('Authorization', 'Bearer teacher_token')
    expect(res.status).toBe(403)
    expect(res.body.error.code).toBe('FORBIDDEN')
  })

  it('should clamp query args and return snapshot', async () => {
    vi.mocked(opsAlertsServiceMock.getOpsAlertsSnapshot).mockResolvedValueOnce({
      generated_at: new Date().toISOString(),
      period_days: 365,
      alerts: [],
      stats: {
        total: 0,
        critical: 0,
        warning: 0,
        info: 0,
        top_source: 'none',
        top_source_count: 0,
      },
    })

    const res = await request(app)
      .get('/api/ops-alerts?days=999&limit=9999')
      .set('Authorization', 'Bearer admin_token')

    expect(res.status).toBe(200)
    expect(opsAlertsServiceMock.getOpsAlertsSnapshot).toHaveBeenCalledWith(prismaMock, {
      days: 365,
      limit: 500,
    })
    expect(res.body.data.period_days).toBe(365)
  })
})
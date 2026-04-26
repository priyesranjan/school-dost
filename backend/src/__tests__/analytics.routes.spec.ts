import { describe, it, expect, beforeEach, vi } from 'vitest'
import request from 'supertest'
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset } from 'vitest-mock-extended'

vi.mock('../services/analyticsService', () => ({
  getEnterpriseAnalyticsOverview: vi.fn(),
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

import * as analyticsServiceMock from '../services/analyticsService'
import analyticsRoutes from '../routes/analytics.routes'

const prismaMock = mockDeep<PrismaClient>()

const app = express()
app.use(express.json())
app.use((req, _res, next) => {
  req.tenantDb = prismaMock
  next()
})
app.use('/api/analytics', analyticsRoutes)

describe('Analytics API Routes', () => {
  beforeEach(() => {
    mockReset(prismaMock)
    vi.clearAllMocks()
  })

  it('should return 401 when token is missing', async () => {
    const res = await request(app).get('/api/analytics/overview')
    expect(res.status).toBe(401)
    expect(res.body.error.code).toBe('UNAUTHORIZED')
  })

  it('should return 403 for role without report access', async () => {
    const res = await request(app).get('/api/analytics/overview').set('Authorization', 'Bearer teacher_token')
    expect(res.status).toBe(403)
    expect(res.body.error.code).toBe('FORBIDDEN')
  })

  it('should call service and clamp days query', async () => {
    vi.mocked(analyticsServiceMock.getEnterpriseAnalyticsOverview).mockResolvedValueOnce({
      period_days: 365,
      generated_at: new Date().toISOString(),
      kpis: {
        students_active: 0,
        fees_collected: 0,
        fees_pending: 0,
        fee_recovery_rate: 0,
        attendance_rate: 0,
        exam_average_score: 0,
      },
      trends: {
        fees_by_month: [],
        attendance_by_day: [],
        exam_performance_by_subject: [],
      },
      class_analytics: [],
      risk_students: [],
    })

    const res = await request(app)
      .get('/api/analytics/overview?days=999')
      .set('Authorization', 'Bearer admin_token')

    expect(res.status).toBe(200)
    expect(analyticsServiceMock.getEnterpriseAnalyticsOverview).toHaveBeenCalledOnce()
    expect(analyticsServiceMock.getEnterpriseAnalyticsOverview).toHaveBeenCalledWith(prismaMock, 365)
    expect(res.body.data.period_days).toBe(365)
  })
})
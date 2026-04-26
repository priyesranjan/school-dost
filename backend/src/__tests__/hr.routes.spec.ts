import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset } from 'vitest-mock-extended'

vi.mock('../services/hrService', () => ({
  getHrSummary: vi.fn(),
  listLeaveRequests: vi.fn(),
  createLeaveRequest: vi.fn(),
  reviewLeaveRequest: vi.fn(),
  cancelLeaveRequest: vi.fn(),
  listAppraisals: vi.fn(),
  createAppraisal: vi.fn(),
  updateAppraisal: vi.fn(),
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
        name: 'Admin User',
        role: 'admin',
        email: 'admin@school.com',
        tenantSlug: 'demo',
        isRoot: false,
      }
    }
    if (token === 'hod_token') {
      return {
        sub: '2',
        name: 'Dr. Ramesh Gupta',
        role: 'hod',
        email: 'hod@school.com',
        tenantSlug: 'demo',
        isRoot: false,
      }
    }
    if (token === 'teacher_token') {
      return {
        sub: '3',
        name: 'Priya Sharma',
        role: 'teacher',
        email: 'teacher@school.com',
        tenantSlug: 'demo',
        isRoot: false,
      }
    }
    if (token === 'accountant_token') {
      return {
        sub: '4',
        name: 'Accountant',
        role: 'accountant',
        email: 'accounts@school.com',
        tenantSlug: 'demo',
        isRoot: false,
      }
    }
    throw new Error('Invalid token')
  }),
}))

import * as hrServiceMock from '../services/hrService'
import hrRoutes from '../routes/hr.routes'

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
app.use('/api/hr', hrRoutes)

describe('HR API Routes', () => {
  beforeEach(() => {
    mockReset(prismaMock)
    vi.clearAllMocks()
  })

  it('should require auth for summary', async () => {
    const res = await request(app).get('/api/hr/summary')
    expect(res.status).toBe(401)
    expect(res.body.error.code).toBe('UNAUTHORIZED')
  })

  it('should forbid non-HR roles from leave listing', async () => {
    const res = await request(app).get('/api/hr/leave-requests').set('Authorization', 'Bearer accountant_token')
    expect(res.status).toBe(403)
    expect(res.body.error.code).toBe('FORBIDDEN')
  })

  it('should create leave requests for teachers', async () => {
    vi.mocked(hrServiceMock.createLeaveRequest).mockResolvedValueOnce({
      id: 5,
      staff_name: 'Priya Sharma',
      leave_type: 'Sick Leave',
      status: 'pending',
      start_date: '2026-04-28',
      end_date: '2026-04-29',
    } as any)

    const res = await request(app)
      .post('/api/hr/leave-requests')
      .set('Authorization', 'Bearer teacher_token')
      .send({
        leave_type: 'Sick Leave',
        start_date: '2026-04-28',
        end_date: '2026-04-29',
        reason: 'Medical observation',
      })

    expect(res.status).toBe(201)
    expect(res.body.data.leave_type).toBe('Sick Leave')
  })

  it('should review leave requests for HR admins', async () => {
    vi.mocked(hrServiceMock.reviewLeaveRequest).mockResolvedValueOnce({
      id: 5,
      staff_name: 'Priya Sharma',
      leave_type: 'Sick Leave',
      status: 'approved',
    } as any)

    const res = await request(app)
      .post('/api/hr/leave-requests/5/review')
      .set('Authorization', 'Bearer hod_token')
      .send({
        status: 'approved',
        decision_note: 'Approved for recovery period',
      })

    expect(res.status).toBe(200)
    expect(res.body.data.status).toBe('approved')
  })

  it('should validate appraisal list queries', async () => {
    vi.mocked(hrServiceMock.listAppraisals).mockResolvedValueOnce({
      items: [],
      total: 0,
      page: 1,
      per_page: 100,
    })

    const res = await request(app)
      .get('/api/hr/appraisals?status=published&per_page=999')
      .set('Authorization', 'Bearer admin_token')

    expect(res.status).toBe(200)
    expect(hrServiceMock.listAppraisals).toHaveBeenCalledWith(prismaMock, {
      staff_id: undefined,
      status: 'published',
      page: 1,
      per_page: 100,
    }, expect.any(Object))
  })

  it('should create appraisals for HR admins', async () => {
    vi.mocked(hrServiceMock.createAppraisal).mockResolvedValueOnce({
      id: 9,
      staff_name: 'Priya Sharma',
      review_period: 'Q1 2026',
      overall_rating: 4.6,
      status: 'published',
    } as any)

    const res = await request(app)
      .post('/api/hr/appraisals')
      .set('Authorization', 'Bearer admin_token')
      .send({
        staff_id: 1,
        review_period: 'Q1 2026',
        review_date: '2026-04-27',
        overall_rating: 4.6,
        strengths: 'Great classroom consistency',
        status: 'published',
      })

    expect(res.status).toBe(201)
    expect(res.body.data.status).toBe('published')
  })
})

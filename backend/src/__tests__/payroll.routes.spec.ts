import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset } from 'vitest-mock-extended'

vi.mock('../services/payrollService', () => ({
  getPayrollSummary: vi.fn(),
  listPayrollProfiles: vi.fn(),
  upsertPayrollProfile: vi.fn(),
  generatePayrollMonth: vi.fn(),
  listPayrollRecords: vi.fn(),
  markPayrollRecordPaid: vi.fn(),
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
    if (token === 'accountant_token') {
      return {
        sub: '2',
        name: 'Accountant',
        role: 'accountant',
        email: 'accounts@school.com',
        tenantSlug: 'demo',
        isRoot: false,
      }
    }
    if (token === 'teacher_token') {
      return {
        sub: '3',
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

import * as payrollServiceMock from '../services/payrollService'
import payrollRoutes from '../routes/payroll.routes'

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
app.use('/api/payroll', payrollRoutes)

describe('Payroll API Routes', () => {
  beforeEach(() => {
    mockReset(prismaMock)
    vi.clearAllMocks()
  })

  it('should require auth for payroll summary', async () => {
    const res = await request(app).get('/api/payroll/summary')
    expect(res.status).toBe(401)
    expect(res.body.error.code).toBe('UNAUTHORIZED')
  })

  it('should forbid non-finance roles', async () => {
    const res = await request(app).get('/api/payroll/profiles').set('Authorization', 'Bearer teacher_token')
    expect(res.status).toBe(403)
    expect(res.body.error.code).toBe('FORBIDDEN')
  })

  it('should save payroll profiles', async () => {
    const profile = {
      id: 1,
      staff_id: 2,
      staff_name: 'Ravi Kumar',
      role: 'teacher',
      department: 'Science',
      staff_status: 'active',
      base_salary: 50000,
      allowances: 5000,
      deductions: 1000,
      net_salary: 54000,
      payment_method: 'bank_transfer',
      bank_name: 'SBI',
      bank_account_no: '1234567890',
      ifsc_code: 'SBIN0001234',
      pan_number: 'ABCDE1234F',
      notes: null,
      updated_at: new Date().toISOString(),
    }
    vi.mocked(payrollServiceMock.upsertPayrollProfile).mockResolvedValueOnce(profile)

    const res = await request(app)
      .put('/api/payroll/profiles/2')
      .set('Authorization', 'Bearer accountant_token')
      .send({
        base_salary: 50000,
        allowances: 5000,
        deductions: 1000,
        payment_method: 'bank_transfer',
      })

    expect(res.status).toBe(200)
    expect(res.body.data).toEqual(profile)
    expect(payrollServiceMock.upsertPayrollProfile).toHaveBeenCalledWith(prismaMock, 2, expect.any(Object))
  })

  it('should generate payroll for a month', async () => {
    const report = {
      month: '2026-04',
      total_staff: 10,
      created: 8,
      updated: 1,
      skipped_no_profile: 1,
      locked_paid: 0,
      items: [],
    }
    vi.mocked(payrollServiceMock.generatePayrollMonth).mockResolvedValueOnce(report)

    const res = await request(app)
      .post('/api/payroll/generate')
      .set('Authorization', 'Bearer admin_token')
      .send({ month: '2026-04' })

    expect(res.status).toBe(201)
    expect(res.body.data).toEqual(report)
  })

  it('should list payroll records with validated query', async () => {
    vi.mocked(payrollServiceMock.listPayrollRecords).mockResolvedValueOnce({
      items: [],
      total: 0,
      page: 1,
      per_page: 100,
    })

    const res = await request(app)
      .get('/api/payroll/records?month=2026-04&per_page=999&status=pending')
      .set('Authorization', 'Bearer accountant_token')

    expect(res.status).toBe(200)
    expect(payrollServiceMock.listPayrollRecords).toHaveBeenCalledWith(prismaMock, {
      month: '2026-04',
      status: 'pending',
      page: 1,
      per_page: 100,
    })
  })

  it('should mark payroll records as paid', async () => {
    const record = {
      id: 4,
      staff_id: 2,
      staff_name: 'Ravi Kumar',
      role: 'teacher',
      department: 'Science',
      staff_status: 'active',
      month: '2026-04',
      base_salary: 50000,
      allowances: 5000,
      deductions: 1000,
      gross_pay: 55000,
      net_pay: 54000,
      status: 'paid',
      payment_reference: 'UTR-901',
      paid_at: new Date().toISOString(),
      generated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      notes: null,
    }
    vi.mocked(payrollServiceMock.markPayrollRecordPaid).mockResolvedValueOnce(record)

    const res = await request(app)
      .post('/api/payroll/records/4/mark-paid')
      .set('Authorization', 'Bearer admin_token')
      .send({ payment_reference: 'UTR-901' })

    expect(res.status).toBe(200)
    expect(res.body.data).toEqual(record)
    expect(payrollServiceMock.markPayrollRecordPaid).toHaveBeenCalledWith(prismaMock, 4, expect.any(Object))
  })
})

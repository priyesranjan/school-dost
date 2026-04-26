import { describe, it, expect, beforeEach, vi } from 'vitest'
import request from 'supertest'
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset } from 'vitest-mock-extended'

// Mock the services that the router uses
vi.mock('../services/feesService', () => ({
  createFeeStructure: vi.fn(),
  listFeeStructures: vi.fn(),
  createFeePayment: vi.fn(),
  listFeePayments: vi.fn(),
}))

vi.mock('../services/auditLogService', () => ({
  appendAuditLog: vi.fn(),
}))

vi.mock('../services/webhookService', () => ({
  dispatchWebhookEvent: vi.fn(),
}))

// Mock the token verified payload
vi.mock('../services/authTokenService', () => ({
  verifyAuthToken: vi.fn((token: string) => {
    if (token === 'admin_token') {
      return { id: 1, phone: '1234', role: 'admin', name: 'Admin', iat: 0, exp: 999 }
    }
    if (token === 'parent_token') {
      return { id: 2, phone: '5678', role: 'parent', name: 'Parent', iat: 0, exp: 999 }
    }
    throw new Error('Invalid token')
  }),
}))

// We need to provide req.tenantDb since it's injected before the routes
import * as feesServiceMock from '../services/feesService'
import feesRoutes from '../routes/fees.routes'

const prismaMock = mockDeep<PrismaClient>()

const app = express()
app.use(express.json())
app.use((req, res, next) => {
  req.tenantDb = prismaMock
  next()
})
app.use('/api/fees', feesRoutes)

// Helper to disable express' default error HTML
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(500).json({ error: err.message })
})

describe('Fees API Routes', () => {
  beforeEach(() => {
    mockReset(prismaMock)
    vi.clearAllMocks()
  })

  describe('GET /api/fees/structures', () => {
    it('should return 401 if missing auth token', async () => {
      const res = await request(app).get('/api/fees/structures')
      expect(res.status).toBe(401)
      expect(res.body.error.code).toBe('UNAUTHORIZED')
    })

    it('should call listFeeStructures if authenticated', async () => {
      vi.mocked(feesServiceMock.listFeeStructures).mockResolvedValueOnce({
        items: [],
        total: 0,
        page: 1,
        per_page: 20,
      })

      const res = await request(app).get('/api/fees/structures').set('Authorization', 'Bearer admin_token')

      expect(res.status).toBe(200)
      expect(feesServiceMock.listFeeStructures).toHaveBeenCalledOnce()
    })
  })

  describe('POST /api/fees/structures', () => {
    it('should return 403 if user is not admin or accountant', async () => {
      const res = await request(app).post('/api/fees/structures').set('Authorization', 'Bearer parent_token').send({
        name: 'Fee1',
        class_name: 'Grade 1',
        amount: 100,
        due_date: '2026-06-01',
        academic_year: '2026',
      })

      expect(res.status).toBe(403)
      expect(res.body.error.code).toBe('FORBIDDEN')
    })

    it('should reject structurally invalid payloads with 400', async () => {
      const res = await request(app)
        .post('/api/fees/structures')
        .set('Authorization', 'Bearer admin_token')
        .send({ name: 'Valid Name', amount: 'NotANumber' }) // Invalid amount type and missing fields

      expect(res.status).toBe(400)
      expect(res.body.error.code).toBe('INVALID_REQUEST')
    })

    it('should pass and call createFeeStructure on valid payload', async () => {
      const mockResult = {
        id: 1,
        name: 'Fee1',
        class_name: 'Grade 1',
        amount: 100,
        due_date: '2026-06-01',
        academic_year: '2026',
      }

      vi.mocked(feesServiceMock.createFeeStructure).mockResolvedValueOnce(mockResult)

      const res = await request(app).post('/api/fees/structures').set('Authorization', 'Bearer admin_token').send({
        name: 'Fee1',
        class_name: 'Grade 1',
        amount: 100,
        due_date: '2026-06-01',
        academic_year: '2026',
      })

      expect(res.status).toBe(200)
      expect(res.body.data).toEqual(mockResult)
      expect(feesServiceMock.createFeeStructure).toHaveBeenCalledOnce()
    })
  })
})

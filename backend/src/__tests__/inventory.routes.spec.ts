import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset } from 'vitest-mock-extended'

vi.mock('../services/inventoryService', () => ({
  getInventorySummary: vi.fn(),
  listVendors: vi.fn(),
  createVendor: vi.fn(),
  listInventoryItems: vi.fn(),
  createInventoryItem: vi.fn(),
  updateInventoryItem: vi.fn(),
  listPurchaseOrders: vi.fn(),
  createPurchaseOrder: vi.fn(),
  approvePurchaseOrder: vi.fn(),
  receivePurchaseOrder: vi.fn(),
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

import * as inventoryServiceMock from '../services/inventoryService'
import inventoryRoutes from '../routes/inventory.routes'

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
app.use('/api/inventory', inventoryRoutes)

describe('Inventory API Routes', () => {
  beforeEach(() => {
    mockReset(prismaMock)
    vi.clearAllMocks()
  })

  it('should require auth for summary', async () => {
    const res = await request(app).get('/api/inventory/summary')
    expect(res.status).toBe(401)
    expect(res.body.error.code).toBe('UNAUTHORIZED')
  })

  it('should forbid non-finance roles', async () => {
    const res = await request(app).get('/api/inventory/items').set('Authorization', 'Bearer teacher_token')
    expect(res.status).toBe(403)
    expect(res.body.error.code).toBe('FORBIDDEN')
  })

  it('should create vendors', async () => {
    const vendor = {
      id: 1,
      name: 'Stationery House',
      contact_name: 'Neha',
      phone: '9876543210',
      email: 'ops@stationery.test',
      address: null,
      gstin: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    vi.mocked(inventoryServiceMock.createVendor).mockResolvedValueOnce(vendor)

    const res = await request(app)
      .post('/api/inventory/vendors')
      .set('Authorization', 'Bearer admin_token')
      .send({
        name: 'Stationery House',
        contact_name: 'Neha',
        phone: '9876543210',
        email: 'ops@stationery.test',
      })

    expect(res.status).toBe(201)
    expect(res.body.data).toEqual(vendor)
  })

  it('should create purchase orders', async () => {
    const po = {
      id: 3,
      po_number: 'PO-202604-001',
      vendor_id: 1,
      vendor_name: 'Stationery House',
      order_date: '2026-04-26',
      expected_date: '2026-04-30',
      status: 'draft',
      total_amount: 12500,
      notes: null,
      approved_at: null,
      received_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: [],
    }
    vi.mocked(inventoryServiceMock.createPurchaseOrder).mockResolvedValueOnce(po)

    const res = await request(app)
      .post('/api/inventory/purchase-orders')
      .set('Authorization', 'Bearer accountant_token')
      .send({
        vendor_id: 1,
        expected_date: '2026-04-30',
        items: [{ inventory_item_id: 10, quantity: 5, unit_price: 2500 }],
      })

    expect(res.status).toBe(201)
    expect(res.body.data).toEqual(po)
  })

  it('should validate purchase order list queries', async () => {
    vi.mocked(inventoryServiceMock.listPurchaseOrders).mockResolvedValueOnce({
      items: [],
      total: 0,
      page: 1,
      per_page: 100,
    })

    const res = await request(app)
      .get('/api/inventory/purchase-orders?status=approved&per_page=999')
      .set('Authorization', 'Bearer admin_token')

    expect(res.status).toBe(200)
    expect(inventoryServiceMock.listPurchaseOrders).toHaveBeenCalledWith(prismaMock, {
      status: 'approved',
      page: 1,
      per_page: 100,
    })
  })

  it('should approve purchase orders', async () => {
    vi.mocked(inventoryServiceMock.approvePurchaseOrder).mockResolvedValueOnce({
      id: 3,
      po_number: 'PO-202604-001',
      status: 'approved',
    } as any)

    const res = await request(app)
      .post('/api/inventory/purchase-orders/3/approve')
      .set('Authorization', 'Bearer admin_token')

    expect(res.status).toBe(200)
    expect(inventoryServiceMock.approvePurchaseOrder).toHaveBeenCalledWith(prismaMock, 3)
  })

  it('should receive purchase orders', async () => {
    vi.mocked(inventoryServiceMock.receivePurchaseOrder).mockResolvedValueOnce({
      id: 3,
      po_number: 'PO-202604-001',
      status: 'received',
    } as any)

    const res = await request(app)
      .post('/api/inventory/purchase-orders/3/receive')
      .set('Authorization', 'Bearer admin_token')

    expect(res.status).toBe(200)
    expect(inventoryServiceMock.receivePurchaseOrder).toHaveBeenCalledWith(prismaMock, 3)
  })
})

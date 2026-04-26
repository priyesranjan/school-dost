import { describe, it, expect, beforeEach, vi } from 'vitest'
import request from 'supertest'
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset } from 'vitest-mock-extended'

vi.mock('../services/accountingService', () => ({
  createBankAccount: vi.fn(),
  createBankReconciliationEntry: vi.fn(),
  createExpense: vi.fn(),
  createManualJournal: vi.fn(),
  deleteExpense: vi.fn(),
  getAccountingSummary: vi.fn(),
  getTrialBalance: vi.fn(),
  listBankAccounts: vi.fn(),
  listBankReconciliationEntries: vi.fn(),
  listExpenses: vi.fn(),
  listLedgerAccounts: vi.fn(),
  listLedgerEntries: vi.fn(),
  matchBankReconciliationEntry: vi.fn(),
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

import * as accountingServiceMock from '../services/accountingService'
import accountingRoutes from '../routes/accounting.routes'

const prismaMock = mockDeep<PrismaClient>()

const app = express()
app.use(express.json())
app.use((req, _res, next) => {
  req.tenantDb = prismaMock
  next()
})
app.use('/api/accounting', accountingRoutes)

describe('Accounting API Routes', () => {
  beforeEach(() => {
    mockReset(prismaMock)
    vi.clearAllMocks()
  })

  it('should return 401 when token is missing', async () => {
    const res = await request(app).get('/api/accounting/summary')
    expect(res.status).toBe(401)
    expect(res.body.error.code).toBe('UNAUTHORIZED')
  })

  it('should return 403 for non-finance roles', async () => {
    const res = await request(app).get('/api/accounting/summary').set('Authorization', 'Bearer teacher_token')
    expect(res.status).toBe(403)
    expect(res.body.error.code).toBe('FORBIDDEN')
  })

  it('should reject invalid expense payloads', async () => {
    const res = await request(app).post('/api/accounting/expenses').set('Authorization', 'Bearer admin_token').send({
      title: '',
      amount: -1,
    })

    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('INVALID_REQUEST')
  })

  it('should create expenses with valid payloads', async () => {
    const expense = {
      id: 1,
      title: 'Electricity Bill',
      category: 'utilities',
      amount: 45000,
      date: '2026-04-26',
      vendor_or_staff: 'Utility Board',
      payment_method: 'bank_transfer',
      reference_no: 'TXN1',
      notes: null,
      created_at: new Date().toISOString(),
    }
    vi.mocked(accountingServiceMock.createExpense).mockResolvedValueOnce(expense)

    const res = await request(app).post('/api/accounting/expenses').set('Authorization', 'Bearer admin_token').send({
      title: 'Electricity Bill',
      category: 'utilities',
      amount: 45000,
      date: '2026-04-26',
      vendor_or_staff: 'Utility Board',
      payment_method: 'bank_transfer',
      reference_no: 'TXN1',
    })

    expect(res.status).toBe(201)
    expect(res.body.data).toEqual(expense)
    expect(accountingServiceMock.createExpense).toHaveBeenCalledOnce()
  })

  it('should call ledger listing with pagination', async () => {
    vi.mocked(accountingServiceMock.listLedgerEntries).mockResolvedValueOnce({
      items: [],
      total: 0,
      page: 1,
      per_page: 100,
    })

    const res = await request(app)
      .get('/api/accounting/ledger?per_page=999&source_type=expense')
      .set('Authorization', 'Bearer admin_token')

    expect(res.status).toBe(200)
    expect(accountingServiceMock.listLedgerEntries).toHaveBeenCalledWith(prismaMock, {
      page: 1,
      per_page: 100,
      account_id: undefined,
      source_type: 'expense',
    })
  })

  it('should load trial balance', async () => {
    vi.mocked(accountingServiceMock.getTrialBalance).mockResolvedValueOnce({
      items: [],
      total_debit: 1000,
      total_credit: 1000,
      balanced: true,
    } as any)

    const res = await request(app)
      .get('/api/accounting/trial-balance?from=2026-04-01&to=2026-04-30')
      .set('Authorization', 'Bearer admin_token')

    expect(res.status).toBe(200)
    expect(accountingServiceMock.getTrialBalance).toHaveBeenCalledWith(prismaMock, {
      from: '2026-04-01',
      to: '2026-04-30',
    })
  })

  it('should create bank accounts', async () => {
    vi.mocked(accountingServiceMock.createBankAccount).mockResolvedValueOnce({
      id: 1,
      account_name: 'Operations Account',
      bank_name: 'SBI',
      account_number: '1234',
      opening_balance: 500000,
    } as any)

    const res = await request(app)
      .post('/api/accounting/bank-accounts')
      .set('Authorization', 'Bearer admin_token')
      .send({
        account_name: 'Operations Account',
        bank_name: 'SBI',
        account_number: '1234',
        opening_balance: 500000,
      })

    expect(res.status).toBe(201)
    expect(res.body.data.account_name).toBe('Operations Account')
  })

  it('should create bank reconciliation entries', async () => {
    vi.mocked(accountingServiceMock.createBankReconciliationEntry).mockResolvedValueOnce({
      id: 4,
      bank_account_id: 1,
      description: 'Bank charge',
      amount: 250,
      direction: 'outflow',
      matched: false,
    } as any)

    const res = await request(app)
      .post('/api/accounting/bank-reconciliation')
      .set('Authorization', 'Bearer admin_token')
      .send({
        bank_account_id: 1,
        transaction_date: '2026-04-27',
        description: 'Bank charge',
        amount: 250,
        direction: 'outflow',
      })

    expect(res.status).toBe(201)
    expect(res.body.data.amount).toBe(250)
  })

  it('should create manual journals', async () => {
    vi.mocked(accountingServiceMock.createManualJournal).mockResolvedValueOnce({
      journal_id: 'manual-journal-1',
      entry_date: '2026-04-27',
      description: 'Bank fee adjustment',
      amount: 250,
      entries: [
        { id: 8, account_id: 5, debit: 250, credit: 0 },
        { id: 9, account_id: 2, debit: 0, credit: 250 },
      ],
    } as any)

    const res = await request(app)
      .post('/api/accounting/manual-journals')
      .set('Authorization', 'Bearer admin_token')
      .send({
        entry_date: '2026-04-27',
        description: 'Bank fee adjustment',
        debit_account_id: 5,
        credit_account_id: 2,
        amount: 250,
      })

    expect(res.status).toBe(201)
    expect(accountingServiceMock.createManualJournal).toHaveBeenCalledWith(prismaMock, {
      entry_date: '2026-04-27',
      description: 'Bank fee adjustment',
      debit_account_id: 5,
      credit_account_id: 2,
      amount: 250,
    })
  })

  it('should match bank reconciliation entries', async () => {
    vi.mocked(accountingServiceMock.matchBankReconciliationEntry).mockResolvedValueOnce({
      id: 4,
      matched: true,
      ledger_entry_id: 12,
    } as any)

    const res = await request(app)
      .post('/api/accounting/bank-reconciliation/4/match')
      .set('Authorization', 'Bearer admin_token')
      .send({
        ledger_entry_id: 12,
        matched: true,
      })

    expect(res.status).toBe(200)
    expect(accountingServiceMock.matchBankReconciliationEntry).toHaveBeenCalledWith(prismaMock, 4, {
      ledger_entry_id: 12,
      matched: true,
    })
  })
})

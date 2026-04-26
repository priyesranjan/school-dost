import { beforeEach, describe, expect, it } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset } from 'vitest-mock-extended'
import { createManualJournal, getTrialBalance, matchBankReconciliationEntry } from '../services/accountingService'

const prismaMock = mockDeep<PrismaClient>()

describe('accountingService', () => {
  beforeEach(() => {
    mockReset(prismaMock)
  })

  it('should compute balanced trial balance totals', async () => {
    prismaMock.ledgerAccount.findMany.mockResolvedValueOnce([
      {
        id: 1n,
        code: '1000',
        name: 'Cash',
        type: 'asset',
        entries: [{ debit: 500, credit: 0 }, { debit: 0, credit: 100 }],
      },
      {
        id: 2n,
        code: '4000',
        name: 'Income',
        type: 'income',
        entries: [{ debit: 0, credit: 400 }],
      },
    ] as never)
    prismaMock.ledgerAccount.upsert.mockResolvedValue({} as never)

    const result = await getTrialBalance(prismaMock)

    expect(result.total_debit).toBe(500)
    expect(result.total_credit).toBe(500)
    expect(result.balanced).toBe(true)
  })

  it('should mark reconciliation entries matched and stamp the bank account', async () => {
    ;(prismaMock as any).bankReconciliationEntry.update.mockResolvedValueOnce({
      id: 4n,
      bankAccountId: 3n,
      ledgerEntryId: 12n,
      transactionDate: new Date('2026-04-27'),
      description: 'Bank charge',
      referenceNo: null,
      amount: 250,
      direction: 'outflow',
      matched: true,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      bankAccount: { accountName: 'Operations Account' },
      ledgerEntry: { description: 'Utilities: Bank charge' },
    } as never)
    ;(prismaMock as any).bankAccount.update.mockResolvedValueOnce({} as never)

    const result = await matchBankReconciliationEntry(prismaMock, 4, {
      ledger_entry_id: 12,
      matched: true,
    })

    expect(result.matched).toBe(true)
    expect((prismaMock as any).bankAccount.update).toHaveBeenCalled()
  })

  it('should create balanced manual journals', async () => {
    prismaMock.ledgerAccount.upsert.mockResolvedValue({} as never)
    prismaMock.$transaction.mockImplementation(async (callback: any) => callback(prismaMock))
    prismaMock.ledgerAccount.findMany.mockResolvedValueOnce([
      { id: 1n, code: '1000', name: 'Cash', type: 'asset' },
      { id: 2n, code: '5000', name: 'Expenses', type: 'expense' },
    ] as never)
    prismaMock.ledgerEntry.createMany.mockResolvedValueOnce({ count: 2 } as never)
    prismaMock.ledgerEntry.findMany.mockResolvedValueOnce([
      {
        id: 10n,
        accountId: 2n,
        entryDate: new Date('2026-04-27'),
        description: 'Bank fee adjustment',
        debit: 250,
        credit: 0,
        sourceType: 'manual_journal',
        sourceId: 'manual-journal-1',
        createdAt: new Date(),
        account: { code: '5000', name: 'Expenses', type: 'expense' },
      },
      {
        id: 11n,
        accountId: 1n,
        entryDate: new Date('2026-04-27'),
        description: 'Bank fee adjustment',
        debit: 0,
        credit: 250,
        sourceType: 'manual_journal',
        sourceId: 'manual-journal-1',
        createdAt: new Date(),
        account: { code: '1000', name: 'Cash', type: 'asset' },
      },
    ] as never)

    const result = await createManualJournal(prismaMock, {
      entry_date: '2026-04-27',
      description: 'Bank fee adjustment',
      debit_account_id: 2,
      credit_account_id: 1,
      amount: 250,
    })

    expect(result.entries).toHaveLength(2)
    expect(prismaMock.ledgerEntry.createMany).toHaveBeenCalled()
  })
})

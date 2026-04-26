import { Prisma, type PrismaClient } from '@prisma/client'

type ExpensePaymentMethod = 'cash' | 'bank_transfer' | 'cheque' | 'card' | 'upi'
type BankEntryDirection = 'inflow' | 'outflow'

const DEFAULT_ACCOUNTS = [
  { code: '1000', name: 'Cash on Hand', type: 'asset' },
  { code: '1010', name: 'Bank Account', type: 'asset' },
  { code: '1100', name: 'Fee Receivables', type: 'asset' },
  { code: '4000', name: 'Fee Income', type: 'income' },
  { code: '5000', name: 'Operating Expenses', type: 'expense' },
] as const

function toDecimal(value: number | string) {
  return new Prisma.Decimal(value)
}

function toNumber(value: unknown) {
  return Number(value || 0)
}

function mapExpense(row: any) {
  return {
    id: Number(row.id),
    title: row.title,
    category: row.category,
    amount: Number(row.amount),
    date: row.date.toISOString().slice(0, 10),
    vendor_or_staff: row.vendorOrStaff,
    payment_method: row.paymentMethod,
    reference_no: row.referenceNo,
    notes: row.notes,
    created_at: row.createdAt.toISOString(),
  }
}

function mapAccount(row: any) {
  return {
    id: Number(row.id),
    code: row.code,
    name: row.name,
    type: row.type,
    is_system: row.isSystem,
  }
}

function mapLedgerEntry(row: any) {
  return {
    id: Number(row.id),
    account_id: Number(row.accountId),
    account_code: row.account?.code,
    account_name: row.account?.name,
    account_type: row.account?.type,
    entry_date: row.entryDate.toISOString().slice(0, 10),
    description: row.description,
    debit: Number(row.debit),
    credit: Number(row.credit),
    source_type: row.sourceType,
    source_id: row.sourceId,
    created_at: row.createdAt.toISOString(),
  }
}

function buildJournalGroupId() {
  return `manual-journal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function mapBankAccount(row: any) {
  return {
    id: Number(row.id),
    account_name: row.accountName,
    bank_name: row.bankName,
    account_number: row.accountNumber,
    ifsc_code: row.ifscCode ?? null,
    opening_balance: Number(row.openingBalance),
    notes: row.notes ?? null,
    last_reconciled_at: row.lastReconciledAt ? row.lastReconciledAt.toISOString() : null,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  }
}

function mapBankReconciliationEntry(row: any) {
  return {
    id: Number(row.id),
    bank_account_id: Number(row.bankAccountId),
    bank_account_name: row.bankAccount?.accountName ?? null,
    ledger_entry_id: row.ledgerEntryId ? Number(row.ledgerEntryId) : null,
    ledger_entry_description: row.ledgerEntry?.description ?? null,
    transaction_date: row.transactionDate.toISOString().slice(0, 10),
    description: row.description,
    reference_no: row.referenceNo ?? null,
    amount: Number(row.amount),
    direction: row.direction,
    matched: Boolean(row.matched),
    notes: row.notes ?? null,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  }
}

function assetAccountCodeForPayment(method: ExpensePaymentMethod) {
  return method === 'cash' ? '1000' : '1010'
}

export async function ensureDefaultLedgerAccounts(db: PrismaClient) {
  for (const account of DEFAULT_ACCOUNTS) {
    await (db as any).ledgerAccount.upsert({
      where: { code: account.code },
      update: {
        name: account.name,
        type: account.type,
        isSystem: true,
      },
      create: {
        code: account.code,
        name: account.name,
        type: account.type,
        isSystem: true,
      },
    })
  }
}

async function findAccountByCode(db: any, code: string) {
  const account = await db.ledgerAccount.findUnique({ where: { code } })
  if (!account) throw new Error(`Ledger account ${code} is not configured`)
  return account
}

export async function createExpense(
  db: PrismaClient,
  input: {
    title: string
    category: string
    amount: number
    date: string
    vendor_or_staff?: string | null
    payment_method: ExpensePaymentMethod
    reference_no?: string | null
    notes?: string | null
  },
) {
  await ensureDefaultLedgerAccounts(db)

  const amount = toDecimal(input.amount)
  return db.$transaction(async (tx) => {
    const expense = await (tx as any).expense.create({
      data: {
        title: input.title,
        category: input.category,
        amount,
        date: new Date(input.date),
        vendorOrStaff: input.vendor_or_staff || null,
        paymentMethod: input.payment_method,
        referenceNo: input.reference_no || null,
        notes: input.notes || null,
      },
    })

    const expenseAccount = await findAccountByCode(tx as any, '5000')
    const assetAccount = await findAccountByCode(tx as any, assetAccountCodeForPayment(input.payment_method))
    const sourceId = String(expense.id)
    const description = `${input.category}: ${input.title}`

    await (tx as any).ledgerEntry.createMany({
      data: [
        {
          accountId: expenseAccount.id,
          entryDate: new Date(input.date),
          description,
          debit: amount,
          credit: toDecimal(0),
          sourceType: 'expense',
          sourceId,
        },
        {
          accountId: assetAccount.id,
          entryDate: new Date(input.date),
          description,
          debit: toDecimal(0),
          credit: amount,
          sourceType: 'expense',
          sourceId,
        },
      ],
    })

    return mapExpense(expense)
  })
}

export async function createManualJournal(
  db: PrismaClient,
  input: {
    entry_date: string
    description: string
    reference_no?: string | null
    debit_account_id: number
    credit_account_id: number
    amount: number
    notes?: string | null
  },
) {
  await ensureDefaultLedgerAccounts(db)

  if (input.debit_account_id === input.credit_account_id) {
    throw new Error('Debit and credit accounts must be different')
  }

  const amount = toDecimal(input.amount)
  const entryDate = new Date(input.entry_date)
  const sourceId = buildJournalGroupId()
  const description = input.reference_no
    ? `${input.description.trim()} (${input.reference_no.trim()})`
    : input.description.trim()

  return db.$transaction(async (tx) => {
    const accounts = await (tx as any).ledgerAccount.findMany({
      where: {
        id: {
          in: [BigInt(input.debit_account_id), BigInt(input.credit_account_id)],
        },
      },
      select: {
        id: true,
        code: true,
        name: true,
        type: true,
      },
    })

    if (accounts.length !== 2) {
      throw new Error('One or more ledger accounts were not found')
    }

    await (tx as any).ledgerEntry.createMany({
      data: [
        {
          accountId: BigInt(input.debit_account_id),
          entryDate,
          description,
          debit: amount,
          credit: toDecimal(0),
          sourceType: 'manual_journal',
          sourceId,
        },
        {
          accountId: BigInt(input.credit_account_id),
          entryDate,
          description,
          debit: toDecimal(0),
          credit: amount,
          sourceType: 'manual_journal',
          sourceId,
        },
      ],
    })

    const rows = await (tx as any).ledgerEntry.findMany({
      where: {
        sourceType: 'manual_journal',
        sourceId,
      },
      include: {
        account: true,
      },
      orderBy: [{ id: 'asc' }],
    })

    return {
      journal_id: sourceId,
      entry_date: input.entry_date,
      description: input.description.trim(),
      reference_no: input.reference_no || null,
      notes: input.notes || null,
      amount: input.amount,
      entries: rows.map(mapLedgerEntry),
    }
  })
}

export async function deleteExpense(db: PrismaClient, id: number) {
  await db.$transaction(async (tx) => {
    await (tx as any).ledgerEntry.deleteMany({ where: { sourceType: 'expense', sourceId: String(id) } })
    await (tx as any).expense.delete({ where: { id: BigInt(id) } })
  })
}

export async function listExpenses(
  db: PrismaClient,
  input: {
    page: number
    per_page: number
    category?: string
    from?: string
    to?: string
  },
) {
  const where = {
    ...(input.category ? { category: input.category } : {}),
    ...(input.from || input.to
      ? {
          date: {
            ...(input.from ? { gte: new Date(input.from) } : {}),
            ...(input.to ? { lte: new Date(input.to) } : {}),
          },
        }
      : {}),
  }

  const [rows, total] = await Promise.all([
    (db as any).expense.findMany({
      where,
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      skip: (input.page - 1) * input.per_page,
      take: input.per_page,
    }),
    (db as any).expense.count({ where }),
  ])

  return {
    items: rows.map(mapExpense),
    total,
    page: input.page,
    per_page: input.per_page,
  }
}

export async function listLedgerAccounts(db: PrismaClient) {
  await ensureDefaultLedgerAccounts(db)
  const rows = await (db as any).ledgerAccount.findMany({ orderBy: [{ code: 'asc' }] })
  return rows.map(mapAccount)
}

export async function listLedgerEntries(
  db: PrismaClient,
  input: {
    page: number
    per_page: number
    account_id?: number
    source_type?: string
  },
) {
  await ensureDefaultLedgerAccounts(db)
  const where = {
    ...(input.account_id ? { accountId: BigInt(input.account_id) } : {}),
    ...(input.source_type ? { sourceType: input.source_type } : {}),
  }

  const [rows, total] = await Promise.all([
    (db as any).ledgerEntry.findMany({
      where,
      include: { account: true },
      orderBy: [{ entryDate: 'desc' }, { createdAt: 'desc' }],
      skip: (input.page - 1) * input.per_page,
      take: input.per_page,
    }),
    (db as any).ledgerEntry.count({ where }),
  ])

  return {
    items: rows.map(mapLedgerEntry),
    total,
    page: input.page,
    per_page: input.per_page,
  }
}

export async function getTrialBalance(
  db: PrismaClient,
  input?: {
    from?: string
    to?: string
  },
) {
  await ensureDefaultLedgerAccounts(db)
  const where = input?.from || input?.to
    ? {
        entryDate: {
          ...(input?.from ? { gte: new Date(input.from) } : {}),
          ...(input?.to ? { lte: new Date(input.to) } : {}),
        },
      }
    : {}

  const rows = await (db as any).ledgerAccount.findMany({
    include: {
      entries: {
        where,
      },
    },
    orderBy: [{ code: 'asc' }],
  })

  let totalDebit = 0
  let totalCredit = 0
  const items = rows.map((row: any) => {
    const debit = row.entries.reduce((sum: number, entry: any) => sum + Number(entry.debit || 0), 0)
    const credit = row.entries.reduce((sum: number, entry: any) => sum + Number(entry.credit || 0), 0)
    totalDebit += debit
    totalCredit += credit
    return {
      account_id: Number(row.id),
      code: row.code,
      name: row.name,
      type: row.type,
      debit,
      credit,
      net: debit - credit,
    }
  })

  return {
    items,
    total_debit: totalDebit,
    total_credit: totalCredit,
    balanced: Math.abs(totalDebit - totalCredit) < 0.0001,
  }
}

export async function listBankAccounts(db: PrismaClient) {
  const rows = await (db as any).bankAccount.findMany({
    orderBy: [{ bankName: 'asc' }, { accountName: 'asc' }],
  })
  return rows.map(mapBankAccount)
}

export async function createBankAccount(
  db: PrismaClient,
  input: {
    account_name: string
    bank_name: string
    account_number: string
    ifsc_code?: string | null
    opening_balance?: number | null
    notes?: string | null
  },
) {
  const row = await (db as any).bankAccount.create({
    data: {
      accountName: input.account_name.trim(),
      bankName: input.bank_name.trim(),
      accountNumber: input.account_number.trim(),
      ifscCode: input.ifsc_code || null,
      openingBalance: toDecimal(input.opening_balance || 0),
      notes: input.notes || null,
    },
  })
  return mapBankAccount(row)
}

export async function listBankReconciliationEntries(
  db: PrismaClient,
  input: {
    bank_account_id?: number
    matched?: boolean
    page: number
    per_page: number
  },
) {
  const where = {
    ...(input.bank_account_id ? { bankAccountId: BigInt(input.bank_account_id) } : {}),
    ...(input.matched !== undefined ? { matched: input.matched } : {}),
  }

  const [rows, total] = await Promise.all([
    (db as any).bankReconciliationEntry.findMany({
      where,
      include: {
        bankAccount: true,
        ledgerEntry: true,
      },
      orderBy: [{ transactionDate: 'desc' }, { createdAt: 'desc' }],
      skip: (input.page - 1) * input.per_page,
      take: input.per_page,
    }),
    (db as any).bankReconciliationEntry.count({ where }),
  ])

  return {
    items: rows.map(mapBankReconciliationEntry),
    total,
    page: input.page,
    per_page: input.per_page,
  }
}

export async function createBankReconciliationEntry(
  db: PrismaClient,
  input: {
    bank_account_id: number
    transaction_date: string
    description: string
    reference_no?: string | null
    amount: number
    direction: BankEntryDirection
    notes?: string | null
  },
) {
  const row = await (db as any).bankReconciliationEntry.create({
    data: {
      bankAccountId: BigInt(input.bank_account_id),
      transactionDate: new Date(input.transaction_date),
      description: input.description.trim(),
      referenceNo: input.reference_no || null,
      amount: toDecimal(input.amount),
      direction: input.direction,
      notes: input.notes || null,
    },
    include: {
      bankAccount: true,
      ledgerEntry: true,
    },
  })
  return mapBankReconciliationEntry(row)
}

export async function matchBankReconciliationEntry(
  db: PrismaClient,
  id: number,
  input: {
    ledger_entry_id?: number | null
    matched: boolean
  },
) {
  const row = await (db as any).bankReconciliationEntry.update({
    where: { id: BigInt(id) },
    data: {
      ledgerEntryId: input.ledger_entry_id ? BigInt(input.ledger_entry_id) : null,
      matched: input.matched,
    },
    include: {
      bankAccount: true,
      ledgerEntry: true,
    },
  })

  if (input.matched) {
    await (db as any).bankAccount.update({
      where: { id: row.bankAccountId },
      data: {
        lastReconciledAt: new Date(),
      },
    })
  }

  return mapBankReconciliationEntry(row)
}

export async function getAccountingSummary(db: PrismaClient) {
  const [feeAgg, expenseAgg, expenseByCategory, bankAgg] = await Promise.all([
    db.feePayment.aggregate({
      _sum: {
        paidAmount: true,
        dueAmount: true,
        totalAmount: true,
      },
    }),
    (db as any).expense.aggregate({
      _sum: {
        amount: true,
      },
    }),
    (db as any).expense.groupBy({
      by: ['category'],
      _sum: {
        amount: true,
      },
      orderBy: {
        category: 'asc',
      },
    }),
    (db as any).bankReconciliationEntry.groupBy({
      by: ['matched'],
      _count: { _all: true },
    }),
  ])

  const feesCollected = toNumber(feeAgg._sum.paidAmount)
  const feesPending = toNumber(feeAgg._sum.dueAmount)
  const totalExpenses = toNumber(expenseAgg._sum.amount)

  return {
    fees_collected: feesCollected,
    fees_pending: feesPending,
    total_invoiced: toNumber(feeAgg._sum.totalAmount),
    total_expenses: totalExpenses,
    net_profit: feesCollected - totalExpenses,
    unreconciled_bank_entries: Number(bankAgg.find((row: any) => row.matched === false)?._count?._all || 0),
    expense_by_category: expenseByCategory.map((row: any) => ({
      category: row.category,
      amount: Number(row._sum.amount || 0),
    })),
  }
}

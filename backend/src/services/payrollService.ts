import type { PrismaClient } from '@prisma/client'

function toMonthString(value: Date) {
  const year = value.getUTCFullYear()
  const month = String(value.getUTCMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

function parseMonth(value?: string | null) {
  const raw = value || new Date().toISOString().slice(0, 7)
  const [year, month] = raw.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0))
}

function asNumber(value: unknown) {
  const numeric = Number(value || 0)
  return Number.isFinite(numeric) ? numeric : 0
}

function mapPayrollProfile(row: any) {
  const baseSalary = asNumber(row.baseSalary)
  const allowances = asNumber(row.allowances)
  const deductions = asNumber(row.deductions)
  const netSalary = Math.max(0, baseSalary + allowances - deductions)

  return {
    id: row.id ? Number(row.id) : null,
    staff_id: Number(row.staffMember.id),
    staff_name: row.staffMember.name,
    role: row.staffMember.role,
    department: row.staffMember.department,
    staff_status: row.staffMember.status,
    base_salary: baseSalary,
    allowances,
    deductions,
    net_salary: netSalary,
    payment_method: row.paymentMethod ?? null,
    bank_name: row.bankName ?? null,
    bank_account_no: row.bankAccountNo ?? null,
    ifsc_code: row.ifscCode ?? null,
    pan_number: row.panNumber ?? null,
    notes: row.notes ?? null,
    updated_at: row.updatedAt ? row.updatedAt.toISOString() : null,
  }
}

function mapPayrollRecord(row: any) {
  return {
    id: Number(row.id),
    staff_id: Number(row.staffMember.id),
    staff_name: row.staffMember.name,
    role: row.staffMember.role,
    department: row.staffMember.department,
    staff_status: row.staffMember.status,
    month: toMonthString(row.month),
    base_salary: asNumber(row.baseSalary),
    allowances: asNumber(row.allowances),
    deductions: asNumber(row.deductions),
    gross_pay: asNumber(row.grossPay),
    net_pay: asNumber(row.netPay),
    status: row.status,
    payment_reference: row.paymentReference ?? null,
    paid_at: row.paidAt ? row.paidAt.toISOString() : null,
    generated_at: row.generatedAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
    notes: row.notes ?? null,
  }
}

export async function listPayrollProfiles(db: PrismaClient) {
  const rows = await (db as any).staffMember.findMany({
    include: {
      payrollProfile: true,
    },
    orderBy: [{ name: 'asc' }],
  })

  return rows.map((row: any) =>
    row.payrollProfile
      ? mapPayrollProfile({
          ...row.payrollProfile,
          staffMember: row,
        })
      : {
          id: null,
          staff_id: Number(row.id),
          staff_name: row.name,
          role: row.role,
          department: row.department,
          staff_status: row.status,
          base_salary: 0,
          allowances: 0,
          deductions: 0,
          net_salary: 0,
          payment_method: null,
          bank_name: null,
          bank_account_no: null,
          ifsc_code: null,
          pan_number: null,
          notes: null,
          updated_at: null,
        },
  )
}

export async function upsertPayrollProfile(
  db: PrismaClient,
  staffId: number,
  input: {
    base_salary: number
    allowances?: number
    deductions?: number
    payment_method?: string | null
    bank_name?: string | null
    bank_account_no?: string | null
    ifsc_code?: string | null
    pan_number?: string | null
    notes?: string | null
  },
) {
  const staffMember = await (db as any).staffMember.findUnique({
    where: { id: BigInt(staffId) },
  })

  if (!staffMember) {
    throw new Error('Staff member not found')
  }

  const row = await (db as any).payrollProfile.upsert({
    where: { staffMemberId: BigInt(staffId) },
    create: {
      staffMemberId: BigInt(staffId),
      baseSalary: input.base_salary,
      allowances: input.allowances ?? 0,
      deductions: input.deductions ?? 0,
      paymentMethod: input.payment_method ?? null,
      bankName: input.bank_name ?? null,
      bankAccountNo: input.bank_account_no ?? null,
      ifscCode: input.ifsc_code ?? null,
      panNumber: input.pan_number ?? null,
      notes: input.notes ?? null,
    },
    update: {
      baseSalary: input.base_salary,
      allowances: input.allowances ?? 0,
      deductions: input.deductions ?? 0,
      paymentMethod: input.payment_method ?? null,
      bankName: input.bank_name ?? null,
      bankAccountNo: input.bank_account_no ?? null,
      ifscCode: input.ifsc_code ?? null,
      panNumber: input.pan_number ?? null,
      notes: input.notes ?? null,
    },
  })

  return mapPayrollProfile({
    ...row,
    staffMember,
  })
}

export async function generatePayrollMonth(
  db: PrismaClient,
  input: {
    month: string
    staff_ids?: number[]
  },
) {
  const month = parseMonth(input.month)
  const staffIds = input.staff_ids?.map((value) => BigInt(value))

  const staffMembers = await (db as any).staffMember.findMany({
    where: {
      status: {
        in: ['active', 'on_leave'],
      },
      ...(staffIds?.length ? { id: { in: staffIds } } : {}),
    },
    include: {
      payrollProfile: true,
    },
    orderBy: [{ name: 'asc' }],
  })

  let created = 0
  let updated = 0
  let skipped_no_profile = 0
  let locked_paid = 0

  const items = []

  for (const staffMember of staffMembers) {
    const profile = staffMember.payrollProfile
    if (!profile) {
      skipped_no_profile += 1
      continue
    }

    const baseSalary = asNumber(profile.baseSalary)
    const allowances = asNumber(profile.allowances)
    const deductions = asNumber(profile.deductions)
    const grossPay = baseSalary + allowances
    const netPay = Math.max(0, grossPay - deductions)

    const existing = await (db as any).payrollRecord.findFirst({
      where: {
        staffMemberId: staffMember.id,
        month,
      },
    })

    let row
    if (!existing) {
      created += 1
      row = await (db as any).payrollRecord.create({
        data: {
          staffMemberId: staffMember.id,
          payrollProfileId: profile.id,
          month,
          baseSalary,
          allowances,
          deductions,
          grossPay,
          netPay,
          status: 'pending',
        },
      })
    } else if (existing.status === 'paid') {
      locked_paid += 1
      continue
    } else {
      updated += 1
      row = await (db as any).payrollRecord.update({
        where: { id: existing.id },
        data: {
          payrollProfileId: profile.id,
          baseSalary,
          allowances,
          deductions,
          grossPay,
          netPay,
          status: 'pending',
        },
      })
    }

    items.push(
      mapPayrollRecord({
        ...row,
        staffMember,
      }),
    )
  }

  return {
    month: toMonthString(month),
    total_staff: staffMembers.length,
    created,
    updated,
    skipped_no_profile,
    locked_paid,
    items,
  }
}

export async function listPayrollRecords(
  db: PrismaClient,
  input: {
    month?: string
    status?: 'pending' | 'paid'
    page: number
    per_page: number
  },
) {
  const month = parseMonth(input.month)
  const where = {
    month,
    ...(input.status ? { status: input.status } : {}),
  }

  const [rows, total] = await Promise.all([
    (db as any).payrollRecord.findMany({
      where,
      include: {
        staffMember: true,
      },
      orderBy: [{ staffMember: { name: 'asc' } }],
      skip: (input.page - 1) * input.per_page,
      take: input.per_page,
    }),
    (db as any).payrollRecord.count({ where }),
  ])

  return {
    items: rows.map(mapPayrollRecord),
    total,
    page: input.page,
    per_page: input.per_page,
  }
}

export async function getPayrollSummary(db: PrismaClient, monthInput?: string) {
  const month = parseMonth(monthInput)
  const records = await (db as any).payrollRecord.findMany({
    where: { month },
  })

  const configuredProfiles = await (db as any).payrollProfile.count()
  const totalStaff = await (db as any).staffMember.count({
    where: {
      status: {
        in: ['active', 'on_leave'],
      },
    },
  })

  const grossTotal = records.reduce((sum: number, row: any) => sum + asNumber(row.grossPay), 0)
  const netTotal = records.reduce((sum: number, row: any) => sum + asNumber(row.netPay), 0)
  const pendingRecords = records.filter((row: any) => row.status === 'pending').length
  const paidRecords = records.filter((row: any) => row.status === 'paid').length

  return {
    month: toMonthString(month),
    total_staff: totalStaff,
    configured_profiles: configuredProfiles,
    generated_records: records.length,
    pending_records: pendingRecords,
    paid_records: paidRecords,
    gross_total: grossTotal,
    net_total: netTotal,
  }
}

export async function markPayrollRecordPaid(
  db: PrismaClient,
  id: number,
  input: {
    payment_reference?: string | null
    notes?: string | null
  },
) {
  const row = await (db as any).payrollRecord.update({
    where: { id: BigInt(id) },
    data: {
      status: 'paid',
      paidAt: new Date(),
      paymentReference: input.payment_reference ?? null,
      notes: input.notes ?? null,
    },
    include: {
      staffMember: true,
    },
  })

  return mapPayrollRecord(row)
}

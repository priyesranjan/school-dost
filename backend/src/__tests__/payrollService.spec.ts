import { beforeEach, describe, expect, it } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset } from 'vitest-mock-extended'
import { generatePayrollMonth } from '../services/payrollService'

const prismaMock = mockDeep<PrismaClient>()

describe('payrollService generatePayrollMonth', () => {
  beforeEach(() => {
    mockReset(prismaMock)
  })

  it('should create payroll records for active staff with profiles', async () => {
    prismaMock.staffMember.findMany.mockResolvedValueOnce([
      {
        id: 1n,
        name: 'Asha Rao',
        role: 'teacher',
        department: 'Mathematics',
        status: 'active',
        payrollProfile: {
          id: 7n,
          baseSalary: 40000,
          allowances: 5000,
          deductions: 2000,
        },
      },
    ] as never)
    prismaMock.payrollRecord.findFirst.mockResolvedValueOnce(null as never)
    prismaMock.payrollRecord.create.mockResolvedValueOnce({
      id: 11n,
      staffMemberId: 1n,
      payrollProfileId: 7n,
      month: new Date('2026-04-01T00:00:00.000Z'),
      baseSalary: 40000,
      allowances: 5000,
      deductions: 2000,
      grossPay: 45000,
      netPay: 43000,
      status: 'pending',
      paymentReference: null,
      paidAt: null,
      generatedAt: new Date('2026-04-26T00:00:00.000Z'),
      updatedAt: new Date('2026-04-26T00:00:00.000Z'),
      notes: null,
    } as never)

    const result = await generatePayrollMonth(prismaMock, { month: '2026-04' })

    expect(result.created).toBe(1)
    expect(result.updated).toBe(0)
    expect(result.skipped_no_profile).toBe(0)
    expect(result.locked_paid).toBe(0)
    expect(result.items[0]).toMatchObject({
      staff_name: 'Asha Rao',
      gross_pay: 45000,
      net_pay: 43000,
      status: 'pending',
    })
  })

  it('should skip locked paid payroll records', async () => {
    prismaMock.staffMember.findMany.mockResolvedValueOnce([
      {
        id: 2n,
        name: 'Ravi Kumar',
        role: 'teacher',
        department: 'Science',
        status: 'active',
        payrollProfile: {
          id: 8n,
          baseSalary: 50000,
          allowances: 3000,
          deductions: 500,
        },
      },
    ] as never)
    prismaMock.payrollRecord.findFirst.mockResolvedValueOnce({
      id: 12n,
      status: 'paid',
    } as never)

    const result = await generatePayrollMonth(prismaMock, { month: '2026-04' })

    expect(result.created).toBe(0)
    expect(result.updated).toBe(0)
    expect(result.locked_paid).toBe(1)
    expect(prismaMock.payrollRecord.update).not.toHaveBeenCalled()
  })
})

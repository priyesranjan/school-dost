import { beforeEach, describe, expect, it } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset } from 'vitest-mock-extended'
import { cancelLeaveRequest, reviewLeaveRequest } from '../services/hrService'

const prismaMock = mockDeep<PrismaClient>()

describe('hrService', () => {
  beforeEach(() => {
    mockReset(prismaMock)
  })

  it('should sync staff to on_leave when a leave request is approved for today', async () => {
    const today = new Date().toISOString().slice(0, 10)

    prismaMock.leaveRequest.update.mockResolvedValueOnce({
      id: 3n,
      staffMemberId: 7n,
      leaveType: 'Medical',
      startDate: new Date(today),
      endDate: new Date(today),
      reason: null,
      decisionNote: 'Approved',
      status: 'approved',
      requestedAt: new Date(),
      decidedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      staffMember: {
        id: 7n,
        name: 'Priya Sharma',
        role: 'teacher',
        department: 'Mathematics',
      },
      requestedByUser: { name: 'Priya Sharma' },
      approvedByUser: { name: 'Admin User' },
    } as never)

    prismaMock.leaveRequest.findFirst.mockResolvedValueOnce({ id: 3n } as never)
    prismaMock.staffMember.update.mockResolvedValueOnce({} as never)

    const result = await reviewLeaveRequest(
      prismaMock,
      3,
      { status: 'approved', decision_note: 'Approved' },
      { sub: '1' } as any,
    )

    expect(result.status).toBe('approved')
    expect(prismaMock.staffMember.update).toHaveBeenCalledWith({
      where: { id: 7n },
      data: { status: 'on_leave' },
    })
  })

  it('should restore staff to active when cancelling leave without any other active approved window', async () => {
    prismaMock.leaveRequest.findUnique.mockResolvedValueOnce({
      id: 3n,
      staffMember: { id: 7n },
      requestedByUser: { name: 'Priya Sharma' },
      approvedByUser: null,
    } as never)

    prismaMock.staffMember.findFirst.mockResolvedValueOnce({
      id: 7n,
      name: 'Priya Sharma',
      email: 'teacher@school.com',
    } as never)

    prismaMock.leaveRequest.update.mockResolvedValueOnce({
      id: 3n,
      staffMemberId: 7n,
      leaveType: 'Medical',
      startDate: new Date('2026-04-27'),
      endDate: new Date('2026-04-28'),
      reason: null,
      decisionNote: null,
      status: 'cancelled',
      requestedAt: new Date(),
      decidedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      staffMember: {
        id: 7n,
        name: 'Priya Sharma',
        role: 'teacher',
        department: 'Mathematics',
      },
      requestedByUser: { name: 'Priya Sharma' },
      approvedByUser: null,
    } as never)

    prismaMock.leaveRequest.findFirst.mockResolvedValueOnce(null as never)
    prismaMock.staffMember.update.mockResolvedValueOnce({} as never)

    const result = await cancelLeaveRequest(
      prismaMock,
      3,
      { role: 'teacher', name: 'Priya Sharma', email: 'teacher@school.com' } as any,
    )

    expect(result.status).toBe('cancelled')
    expect(prismaMock.staffMember.update).toHaveBeenCalledWith({
      where: { id: 7n },
      data: { status: 'active' },
    })
  })
})

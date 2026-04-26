import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset } from 'vitest-mock-extended'
import { receivePurchaseOrder } from '../services/inventoryService'

const prismaMock = mockDeep<PrismaClient>()

describe('inventoryService receivePurchaseOrder', () => {
  beforeEach(() => {
    mockReset(prismaMock)
    prismaMock.$transaction.mockImplementation(async (callback: any) => callback(prismaMock as any))
  })

  it('should increment stock and mark purchase order as received', async () => {
    prismaMock.purchaseOrder.findUnique.mockResolvedValueOnce({
      id: 3n,
      poNumber: 'PO-202604-001',
      vendorId: 1n,
      orderDate: new Date('2026-04-26T00:00:00.000Z'),
      expectedDate: new Date('2026-04-30T00:00:00.000Z'),
      status: 'approved',
      totalAmount: 12500,
      notes: null,
      approvedAt: new Date('2026-04-26T08:00:00.000Z'),
      receivedAt: null,
      createdAt: new Date('2026-04-26T07:00:00.000Z'),
      updatedAt: new Date('2026-04-26T07:00:00.000Z'),
      vendor: { name: 'Stationery House' },
      lines: [
        {
          id: 11n,
          inventoryItemId: 7n,
          quantity: 5,
          unitPrice: 2500,
          lineTotal: 12500,
          inventoryItem: { sku: 'LAB-001', name: 'Microscope' },
        },
      ],
    } as never)
    prismaMock.inventoryItem.update.mockResolvedValue({} as never)
    prismaMock.purchaseOrder.update.mockResolvedValueOnce({
      id: 3n,
      poNumber: 'PO-202604-001',
      vendorId: 1n,
      orderDate: new Date('2026-04-26T00:00:00.000Z'),
      expectedDate: new Date('2026-04-30T00:00:00.000Z'),
      status: 'received',
      totalAmount: 12500,
      notes: null,
      approvedAt: new Date('2026-04-26T08:00:00.000Z'),
      receivedAt: new Date('2026-04-27T09:00:00.000Z'),
      createdAt: new Date('2026-04-26T07:00:00.000Z'),
      updatedAt: new Date('2026-04-27T09:00:00.000Z'),
      vendor: { name: 'Stationery House' },
      lines: [
        {
          id: 11n,
          inventoryItemId: 7n,
          quantity: 5,
          unitPrice: 2500,
          lineTotal: 12500,
          inventoryItem: { sku: 'LAB-001', name: 'Microscope' },
        },
      ],
    } as never)

    const result = await receivePurchaseOrder(prismaMock, 3)

    expect(prismaMock.inventoryItem.update).toHaveBeenCalledWith({
      where: { id: 7n },
      data: {
        currentStock: { increment: 5 },
        unitCost: 2500,
      },
    })
    expect(result.status).toBe('received')
    expect(result.items[0]).toMatchObject({
      inventory_item_id: 7,
      quantity: 5,
      line_total: 12500,
    })
  })

  it('should reject unapproved purchase orders', async () => {
    prismaMock.purchaseOrder.findUnique.mockResolvedValueOnce({
      id: 4n,
      status: 'draft',
      lines: [],
      vendor: { name: 'Stationery House' },
    } as never)

    await expect(receivePurchaseOrder(prismaMock, 4)).rejects.toThrow('Purchase order must be approved before receipt')
  })
})

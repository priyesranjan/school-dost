import type { PrismaClient } from '@prisma/client'

function asNumber(value: unknown) {
  const parsed = Number(value || 0)
  return Number.isFinite(parsed) ? parsed : 0
}

function roundMoney(value: number) {
  return Number(value.toFixed(2))
}

function mapVendor(row: any) {
  return {
    id: Number(row.id),
    name: row.name,
    contact_name: row.contactName ?? null,
    phone: row.phone ?? null,
    email: row.email ?? null,
    address: row.address ?? null,
    gstin: row.gstin ?? null,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  }
}

function mapInventoryItem(row: any) {
  return {
    id: Number(row.id),
    sku: row.sku,
    name: row.name,
    category: row.category,
    unit: row.unit,
    current_stock: Number(row.currentStock),
    reorder_level: Number(row.reorderLevel),
    unit_cost: row.unitCost == null ? null : asNumber(row.unitCost),
    stock_value: row.unitCost == null ? 0 : roundMoney(Number(row.currentStock) * asNumber(row.unitCost)),
    location: row.location ?? null,
    notes: row.notes ?? null,
    vendor_id: row.vendorId ? Number(row.vendorId) : null,
    vendor_name: row.vendor?.name ?? null,
    low_stock: Number(row.currentStock) <= Number(row.reorderLevel),
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  }
}

function mapPurchaseOrder(row: any) {
  return {
    id: Number(row.id),
    po_number: row.poNumber,
    vendor_id: Number(row.vendorId),
    vendor_name: row.vendor?.name ?? null,
    order_date: row.orderDate.toISOString().slice(0, 10),
    expected_date: row.expectedDate ? row.expectedDate.toISOString().slice(0, 10) : null,
    status: row.status,
    total_amount: asNumber(row.totalAmount),
    notes: row.notes ?? null,
    approved_at: row.approvedAt ? row.approvedAt.toISOString() : null,
    received_at: row.receivedAt ? row.receivedAt.toISOString() : null,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
    items: Array.isArray(row.lines)
      ? row.lines.map((line: any) => ({
          id: Number(line.id),
          inventory_item_id: Number(line.inventoryItemId),
          sku: line.inventoryItem?.sku ?? null,
          item_name: line.inventoryItem?.name ?? null,
          quantity: Number(line.quantity),
          unit_price: asNumber(line.unitPrice),
          line_total: asNumber(line.lineTotal),
        }))
      : [],
  }
}

function monthKey(date: Date) {
  return `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}

async function buildPoNumber(db: PrismaClient, date: Date) {
  const prefix = `PO-${monthKey(date)}`
  const count = await (db as any).purchaseOrder.count({
    where: {
      poNumber: {
        startsWith: prefix,
      },
    },
  })
  return `${prefix}-${String(count + 1).padStart(3, '0')}`
}

export async function getInventorySummary(db: PrismaClient) {
  const [items, vendors, pendingOrders] = await Promise.all([
    (db as any).inventoryItem.findMany({
      select: {
        id: true,
        currentStock: true,
        reorderLevel: true,
        unitCost: true,
      },
    }),
    (db as any).vendor.count(),
    (db as any).purchaseOrder.count({
      where: {
        status: {
          in: ['draft', 'approved'],
        },
      },
    }),
  ])

  const lowStockItems = items.filter((item: any) => Number(item.currentStock) <= Number(item.reorderLevel)).length
  const stockValue = roundMoney(
    items.reduce((sum: number, item: any) => sum + Number(item.currentStock) * asNumber(item.unitCost), 0),
  )

  return {
    total_items: items.length,
    low_stock_items: lowStockItems,
    vendor_count: vendors,
    pending_purchase_orders: pendingOrders,
    stock_value: stockValue,
  }
}

export async function listVendors(db: PrismaClient) {
  const rows = await (db as any).vendor.findMany({
    orderBy: [{ name: 'asc' }],
  })
  return rows.map(mapVendor)
}

export async function createVendor(
  db: PrismaClient,
  input: {
    name: string
    contact_name?: string | null
    phone?: string | null
    email?: string | null
    address?: string | null
    gstin?: string | null
  },
) {
  const row = await (db as any).vendor.create({
    data: {
      name: input.name.trim(),
      contactName: input.contact_name || null,
      phone: input.phone || null,
      email: input.email || null,
      address: input.address || null,
      gstin: input.gstin || null,
    },
  })
  return mapVendor(row)
}

export async function listInventoryItems(db: PrismaClient) {
  const rows = await (db as any).inventoryItem.findMany({
    include: {
      vendor: {
        select: { name: true },
      },
    },
    orderBy: [{ name: 'asc' }],
  })
  return rows.map(mapInventoryItem)
}

export async function createInventoryItem(
  db: PrismaClient,
  input: {
    sku: string
    name: string
    category: string
    unit?: string
    current_stock?: number
    reorder_level?: number
    unit_cost?: number | null
    location?: string | null
    notes?: string | null
    vendor_id?: number | null
  },
) {
  const row = await (db as any).inventoryItem.create({
    data: {
      sku: input.sku.trim(),
      name: input.name.trim(),
      category: input.category.trim(),
      unit: (input.unit || 'unit').trim(),
      currentStock: input.current_stock ?? 0,
      reorderLevel: input.reorder_level ?? 0,
      unitCost: input.unit_cost ?? null,
      location: input.location || null,
      notes: input.notes || null,
      vendorId: input.vendor_id ? BigInt(input.vendor_id) : null,
    },
    include: {
      vendor: {
        select: { name: true },
      },
    },
  })
  return mapInventoryItem(row)
}

export async function updateInventoryItem(
  db: PrismaClient,
  id: number,
  input: {
    sku?: string
    name?: string
    category?: string
    unit?: string
    current_stock?: number
    reorder_level?: number
    unit_cost?: number | null
    location?: string | null
    notes?: string | null
    vendor_id?: number | null
  },
) {
  const data: Record<string, unknown> = {}
  if (typeof input.sku === 'string') data.sku = input.sku.trim()
  if (typeof input.name === 'string') data.name = input.name.trim()
  if (typeof input.category === 'string') data.category = input.category.trim()
  if (typeof input.unit === 'string') data.unit = input.unit.trim()
  if (typeof input.current_stock === 'number') data.currentStock = input.current_stock
  if (typeof input.reorder_level === 'number') data.reorderLevel = input.reorder_level
  if (input.unit_cost !== undefined) data.unitCost = input.unit_cost
  if (input.location !== undefined) data.location = input.location
  if (input.notes !== undefined) data.notes = input.notes
  if (input.vendor_id !== undefined) data.vendorId = input.vendor_id ? BigInt(input.vendor_id) : null

  const row = await (db as any).inventoryItem.update({
    where: { id: BigInt(id) },
    data,
    include: {
      vendor: {
        select: { name: true },
      },
    },
  })
  return mapInventoryItem(row)
}

export async function listPurchaseOrders(
  db: PrismaClient,
  input: {
    status?: 'draft' | 'approved' | 'received' | 'cancelled'
    page: number
    per_page: number
  },
) {
  const where = input.status ? { status: input.status } : {}
  const [rows, total] = await Promise.all([
    (db as any).purchaseOrder.findMany({
      where,
      include: {
        vendor: {
          select: { name: true },
        },
        lines: {
          include: {
            inventoryItem: {
              select: {
                sku: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
      skip: (input.page - 1) * input.per_page,
      take: input.per_page,
    }),
    (db as any).purchaseOrder.count({ where }),
  ])

  return {
    items: rows.map(mapPurchaseOrder),
    total,
    page: input.page,
    per_page: input.per_page,
  }
}

export async function createPurchaseOrder(
  db: PrismaClient,
  input: {
    vendor_id: number
    order_date?: string
    expected_date?: string | null
    notes?: string | null
    items: Array<{
      inventory_item_id: number
      quantity: number
      unit_price: number
    }>
  },
) {
  const vendor = await (db as any).vendor.findUnique({
    where: { id: BigInt(input.vendor_id) },
  })
  if (!vendor) {
    throw new Error('Vendor not found')
  }

  const itemIds = input.items.map((item) => BigInt(item.inventory_item_id))
  const inventoryItems = await (db as any).inventoryItem.findMany({
    where: {
      id: { in: itemIds },
    },
    select: {
      id: true,
      sku: true,
      name: true,
    },
  })
  if (inventoryItems.length !== input.items.length) {
    throw new Error('One or more inventory items could not be found')
  }

  const orderDate = input.order_date ? new Date(input.order_date) : new Date()
  const poNumber = await buildPoNumber(db, orderDate)
  const lineData = input.items.map((item) => ({
    inventoryItemId: BigInt(item.inventory_item_id),
    quantity: item.quantity,
    unitPrice: item.unit_price,
    lineTotal: roundMoney(item.quantity * item.unit_price),
  }))
  const totalAmount = roundMoney(lineData.reduce((sum, item) => sum + Number(item.lineTotal), 0))

  const row = await (db as any).purchaseOrder.create({
    data: {
      poNumber,
      vendorId: BigInt(input.vendor_id),
      orderDate,
      expectedDate: input.expected_date ? new Date(input.expected_date) : null,
      notes: input.notes || null,
      totalAmount,
      lines: {
        create: lineData,
      },
    },
    include: {
      vendor: {
        select: { name: true },
      },
      lines: {
        include: {
          inventoryItem: {
            select: {
              sku: true,
              name: true,
            },
          },
        },
      },
    },
  })

  return mapPurchaseOrder(row)
}

export async function approvePurchaseOrder(db: PrismaClient, id: number) {
  const existing = await (db as any).purchaseOrder.findUnique({
    where: { id: BigInt(id) },
    include: {
      vendor: {
        select: { name: true },
      },
      lines: {
        include: {
          inventoryItem: {
            select: { sku: true, name: true },
          },
        },
      },
    },
  })

  if (!existing) {
    throw new Error('Purchase order not found')
  }
  if (existing.status === 'received' || existing.status === 'cancelled') {
    throw new Error('Purchase order can no longer be approved')
  }

  const row = await (db as any).purchaseOrder.update({
    where: { id: BigInt(id) },
    data: {
      status: 'approved',
      approvedAt: new Date(),
    },
    include: {
      vendor: {
        select: { name: true },
      },
      lines: {
        include: {
          inventoryItem: {
            select: { sku: true, name: true },
          },
        },
      },
    },
  })

  return mapPurchaseOrder(row)
}

export async function receivePurchaseOrder(db: PrismaClient, id: number) {
  return await (db as any).$transaction(async (tx: any) => {
    const existing = await tx.purchaseOrder.findUnique({
      where: { id: BigInt(id) },
      include: {
        vendor: {
          select: { name: true },
        },
        lines: {
          include: {
            inventoryItem: {
              select: { sku: true, name: true },
            },
          },
        },
      },
    })

    if (!existing) {
      throw new Error('Purchase order not found')
    }
    if (existing.status === 'received') {
      throw new Error('Purchase order has already been received')
    }
    if (existing.status !== 'approved') {
      throw new Error('Purchase order must be approved before receipt')
    }

    for (const line of existing.lines) {
      await tx.inventoryItem.update({
        where: { id: line.inventoryItemId },
        data: {
          currentStock: {
            increment: Number(line.quantity),
          },
          unitCost: line.unitPrice,
        },
      })
    }

    const row = await tx.purchaseOrder.update({
      where: { id: BigInt(id) },
      data: {
        status: 'received',
        receivedAt: new Date(),
      },
      include: {
        vendor: {
          select: { name: true },
        },
        lines: {
          include: {
            inventoryItem: {
              select: { sku: true, name: true },
            },
          },
        },
      },
    })

    return mapPurchaseOrder(row)
  })
}

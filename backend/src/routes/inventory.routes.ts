import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { writeActionLimiter } from '../middleware/rateLimit'
import { validateBody, validateQuery } from '../middleware/validation'
import {
  inventoryItemCreateSchema,
  inventoryItemUpdateSchema,
  purchaseOrderCreateSchema,
  purchaseOrderListQuerySchema,
  vendorCreateSchema,
} from '../validation/schemas'
import {
  approvePurchaseOrder,
  createInventoryItem,
  createPurchaseOrder,
  createVendor,
  getInventorySummary,
  listInventoryItems,
  listPurchaseOrders,
  listVendors,
  receivePurchaseOrder,
  updateInventoryItem,
} from '../services/inventoryService'
import { appendAuditLog } from '../services/auditLogService'
import { dispatchWebhookEvent } from '../services/webhookService'

const router = Router()
const operationsRoles = ['admin', 'accountant'] as any

function parseId(value: unknown) {
  const raw = Array.isArray(value) ? value[0] : value
  const id = Number(raw)
  return Number.isFinite(id) && id > 0 ? Math.floor(id) : null
}

function queueWebhook(task: unknown) {
  void Promise.resolve(task).catch(() => {})
}

router.get('/summary', requireAuth, requireRole(operationsRoles), async (req, res) => {
  try {
    const data = await getInventorySummary(req.tenantDb!)
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load inventory summary'
    res.status(500).json({ error: { code: 'INVENTORY_SUMMARY_FAILED', message } })
  }
})

router.get('/vendors', requireAuth, requireRole(operationsRoles), async (req, res) => {
  try {
    const data = await listVendors(req.tenantDb!)
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list vendors'
    res.status(500).json({ error: { code: 'VENDOR_LIST_FAILED', message } })
  }
})

router.post('/vendors', requireAuth, requireRole(operationsRoles), writeActionLimiter, validateBody(vendorCreateSchema), async (req, res) => {
  try {
    const data = await createVendor(req.tenantDb!, req.body)
    await appendAuditLog(req.tenantDb!, {
      action: 'vendor_created',
      module: 'operations',
      actor_name: req.auth?.name || 'Unknown',
      actor_role: req.auth?.role || 'unknown',
      target: data.name,
      metadata: `phone=${data.phone || '-'} email=${data.email || '-'}`,
    })
    res.status(201).json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create vendor'
    res.status(500).json({ error: { code: 'VENDOR_CREATE_FAILED', message } })
  }
})

router.get('/items', requireAuth, requireRole(operationsRoles), async (req, res) => {
  try {
    const data = await listInventoryItems(req.tenantDb!)
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list inventory items'
    res.status(500).json({ error: { code: 'INVENTORY_ITEM_LIST_FAILED', message } })
  }
})

router.post('/items', requireAuth, requireRole(operationsRoles), writeActionLimiter, validateBody(inventoryItemCreateSchema), async (req, res) => {
  try {
    const data = await createInventoryItem(req.tenantDb!, req.body)
    await appendAuditLog(req.tenantDb!, {
      action: 'inventory_item_created',
      module: 'operations',
      actor_name: req.auth?.name || 'Unknown',
      actor_role: req.auth?.role || 'unknown',
      target: `${data.name} (${data.sku})`,
      metadata: `category=${data.category} stock=${data.current_stock}`,
    })
    res.status(201).json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create inventory item'
    res.status(500).json({ error: { code: 'INVENTORY_ITEM_CREATE_FAILED', message } })
  }
})

router.patch('/items/:id', requireAuth, requireRole(operationsRoles), writeActionLimiter, validateBody(inventoryItemUpdateSchema), async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) {
    res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Invalid inventory item id' } })
    return
  }

  try {
    const data = await updateInventoryItem(req.tenantDb!, id, req.body)
    await appendAuditLog(req.tenantDb!, {
      action: 'inventory_item_updated',
      module: 'operations',
      actor_name: req.auth?.name || 'Unknown',
      actor_role: req.auth?.role || 'unknown',
      target: `${data.name} (${data.sku})`,
      metadata: `stock=${data.current_stock} reorder_level=${data.reorder_level}`,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update inventory item'
    res.status(500).json({ error: { code: 'INVENTORY_ITEM_UPDATE_FAILED', message } })
  }
})

router.get('/purchase-orders', requireAuth, requireRole(operationsRoles), validateQuery(purchaseOrderListQuerySchema), async (req, res) => {
  try {
    const query = req.query as {
      status?: 'draft' | 'approved' | 'received' | 'cancelled'
      page?: number
      per_page?: number
    }
    const data = await listPurchaseOrders(req.tenantDb!, {
      status: query.status,
      page: query.page || 1,
      per_page: Math.min(100, query.per_page || 50),
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list purchase orders'
    res.status(500).json({ error: { code: 'PURCHASE_ORDER_LIST_FAILED', message } })
  }
})

router.post('/purchase-orders', requireAuth, requireRole(operationsRoles), writeActionLimiter, validateBody(purchaseOrderCreateSchema), async (req, res) => {
  try {
    const data = await createPurchaseOrder(req.tenantDb!, req.body)
    await appendAuditLog(req.tenantDb!, {
      action: 'purchase_order_created',
      module: 'operations',
      actor_name: req.auth?.name || 'Unknown',
      actor_role: req.auth?.role || 'unknown',
      target: data.po_number,
      metadata: `vendor=${data.vendor_name || '-'} total=${data.total_amount}`,
    })
    queueWebhook(dispatchWebhookEvent(req.tenantDb!, {
      type: 'inventory.purchase_order.created',
      tenant_slug: req.tenant?.slug || req.tenantSlug || req.auth?.tenantSlug || null,
      data: {
        purchase_order: data,
        actor: {
          name: req.auth?.name || 'Unknown',
          role: req.auth?.role || 'unknown',
        },
      },
    }))
    res.status(201).json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create purchase order'
    res.status(500).json({ error: { code: 'PURCHASE_ORDER_CREATE_FAILED', message } })
  }
})

router.post('/purchase-orders/:id/approve', requireAuth, requireRole(operationsRoles), writeActionLimiter, async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) {
    res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Invalid purchase order id' } })
    return
  }

  try {
    const data = await approvePurchaseOrder(req.tenantDb!, id)
    await appendAuditLog(req.tenantDb!, {
      action: 'purchase_order_approved',
      module: 'operations',
      actor_name: req.auth?.name || 'Unknown',
      actor_role: req.auth?.role || 'unknown',
      target: data.po_number,
      metadata: `status=${data.status}`,
    })
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to approve purchase order'
    res.status(500).json({ error: { code: 'PURCHASE_ORDER_APPROVE_FAILED', message } })
  }
})

router.post('/purchase-orders/:id/receive', requireAuth, requireRole(operationsRoles), writeActionLimiter, async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) {
    res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Invalid purchase order id' } })
    return
  }

  try {
    const data = await receivePurchaseOrder(req.tenantDb!, id)
    await appendAuditLog(req.tenantDb!, {
      action: 'purchase_order_received',
      module: 'operations',
      actor_name: req.auth?.name || 'Unknown',
      actor_role: req.auth?.role || 'unknown',
      target: data.po_number,
      metadata: `status=${data.status} total=${data.total_amount}`,
    })
    queueWebhook(dispatchWebhookEvent(req.tenantDb!, {
      type: 'inventory.purchase_order.received',
      tenant_slug: req.tenant?.slug || req.tenantSlug || req.auth?.tenantSlug || null,
      data: {
        purchase_order: data,
        actor: {
          name: req.auth?.name || 'Unknown',
          role: req.auth?.role || 'unknown',
        },
      },
    }))
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to receive purchase order'
    res.status(500).json({ error: { code: 'PURCHASE_ORDER_RECEIVE_FAILED', message } })
  }
})

export default router

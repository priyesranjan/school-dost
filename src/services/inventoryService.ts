import api from './api'

export interface InventorySummary {
  total_items: number
  low_stock_items: number
  vendor_count: number
  pending_purchase_orders: number
  stock_value: number
}

export interface InventoryVendor {
  id: number
  name: string
  contact_name: string | null
  phone: string | null
  email: string | null
  address: string | null
  gstin: string | null
  created_at: string
  updated_at: string
}

export interface InventoryItemRecord {
  id: number
  sku: string
  name: string
  category: string
  unit: string
  current_stock: number
  reorder_level: number
  unit_cost: number | null
  stock_value: number
  location: string | null
  notes: string | null
  vendor_id: number | null
  vendor_name: string | null
  low_stock: boolean
  created_at: string
  updated_at: string
}

export interface PurchaseOrderLineRecord {
  id: number
  inventory_item_id: number
  sku: string | null
  item_name: string | null
  quantity: number
  unit_price: number
  line_total: number
}

export interface PurchaseOrderRecord {
  id: number
  po_number: string
  vendor_id: number
  vendor_name: string | null
  order_date: string
  expected_date: string | null
  status: 'draft' | 'approved' | 'received' | 'cancelled'
  total_amount: number
  notes: string | null
  approved_at: string | null
  received_at: string | null
  created_at: string
  updated_at: string
  items: PurchaseOrderLineRecord[]
}

export const inventoryService = {
  async getSummary() {
    const res = await api.get('/inventory/summary')
    return res.data.data as InventorySummary
  },

  async listVendors() {
    const res = await api.get('/inventory/vendors')
    return res.data.data as InventoryVendor[]
  },

  async createVendor(payload: {
    name: string
    contact_name?: string | null
    phone?: string | null
    email?: string | null
    address?: string | null
    gstin?: string | null
  }) {
    const res = await api.post('/inventory/vendors', payload)
    return res.data.data as InventoryVendor
  },

  async listItems() {
    const res = await api.get('/inventory/items')
    return res.data.data as InventoryItemRecord[]
  },

  async createItem(payload: {
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
  }) {
    const res = await api.post('/inventory/items', payload)
    return res.data.data as InventoryItemRecord
  },

  async updateItem(
    id: number,
    payload: {
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
    const res = await api.patch(`/inventory/items/${id}`, payload)
    return res.data.data as InventoryItemRecord
  },

  async listPurchaseOrders(params?: { status?: string; page?: number; per_page?: number }) {
    const res = await api.get('/inventory/purchase-orders', { params })
    return res.data.data as {
      items: PurchaseOrderRecord[]
      total: number
      page: number
      per_page: number
    }
  },

  async createPurchaseOrder(payload: {
    vendor_id: number
    order_date?: string
    expected_date?: string | null
    notes?: string | null
    items: Array<{
      inventory_item_id: number
      quantity: number
      unit_price: number
    }>
  }) {
    const res = await api.post('/inventory/purchase-orders', payload)
    return res.data.data as PurchaseOrderRecord
  },

  async approvePurchaseOrder(id: number) {
    const res = await api.post(`/inventory/purchase-orders/${id}/approve`)
    return res.data.data as PurchaseOrderRecord
  },

  async receivePurchaseOrder(id: number) {
    const res = await api.post(`/inventory/purchase-orders/${id}/receive`)
    return res.data.data as PurchaseOrderRecord
  },
}

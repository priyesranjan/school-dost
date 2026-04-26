<template>
  <div class="space-y-8 animate-fade-in-up">
    <div class="relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-xl shadow-gray-100 dark:border dark:border-gray-800 dark:bg-gray-800/50 dark:shadow-none">
      <div class="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div class="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
            Inventory & Procurement
          </div>
          <h1 class="mt-3 text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            Stock <span class="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Operations Console</span>
          </h1>
          <p class="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            Manage vendor relationships, stock levels, and purchase orders from one operations workspace.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <AppButton variant="secondary" @click="showVendorModal = true">Add Vendor</AppButton>
          <AppButton variant="secondary" @click="openCreateItem">Add Item</AppButton>
          <AppButton @click="openCreatePo" :disabled="!vendors.length || !items.length">New Purchase Order</AppButton>
        </div>
      </div>
      <div class="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber-50/70 blur-3xl dark:bg-amber-900/10"></div>
    </div>

    <div class="grid grid-cols-2 gap-5 xl:grid-cols-5">
      <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800/50">
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">SKUs</p>
        <p class="mt-2 text-3xl font-black text-gray-900 dark:text-white">{{ summary.total_items }}</p>
      </div>
      <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800/50">
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Low Stock</p>
        <p class="mt-2 text-3xl font-black text-rose-600 dark:text-rose-400">{{ summary.low_stock_items }}</p>
      </div>
      <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800/50">
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Vendors</p>
        <p class="mt-2 text-3xl font-black text-gray-900 dark:text-white">{{ summary.vendor_count }}</p>
      </div>
      <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800/50">
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Open POs</p>
        <p class="mt-2 text-3xl font-black text-amber-600 dark:text-amber-400">{{ summary.pending_purchase_orders }}</p>
      </div>
      <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800/50">
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Stock Value</p>
        <p class="mt-2 text-3xl font-black text-emerald-600 dark:text-emerald-400">{{ formatCurrency(summary.stock_value) }}</p>
      </div>
    </div>

    <AppCard :no-padding="true" class="overflow-hidden border-none shadow-xl">
      <div class="flex items-center justify-between border-b border-gray-100 bg-gray-50/60 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/20">
        <div>
          <h2 class="text-lg font-black text-gray-900 dark:text-white">Inventory Items</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Live stock levels with reorder signals and vendor mapping.</p>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="bg-gray-50/30 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:bg-gray-900/30">
              <th class="px-6 py-4">Item</th>
              <th class="px-6 py-4">Category</th>
              <th class="px-6 py-4">Stock</th>
              <th class="px-6 py-4">Reorder Level</th>
              <th class="px-6 py-4">Vendor</th>
              <th class="px-6 py-4">Value</th>
              <th class="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
            <tr v-for="item in items" :key="item.id">
              <td class="px-6 py-4">
                <p class="font-black text-gray-900 dark:text-white">{{ item.name }}</p>
                <p class="text-xs text-gray-400">{{ item.sku }} · {{ item.unit }}</p>
              </td>
              <td class="px-6 py-4 text-gray-700 dark:text-gray-300">{{ item.category }}</td>
              <td class="px-6 py-4">
                <span :class="item.low_stock ? 'text-rose-600 dark:text-rose-400' : 'text-gray-900 dark:text-white'" class="font-black">
                  {{ item.current_stock }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-700 dark:text-gray-300">{{ item.reorder_level }}</td>
              <td class="px-6 py-4 text-gray-700 dark:text-gray-300">{{ item.vendor_name || 'Unassigned' }}</td>
              <td class="px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400">{{ formatCurrency(item.stock_value) }}</td>
              <td class="px-6 py-4 text-right">
                <AppButton size="sm" variant="secondary" @click="openEditItem(item)">Edit</AppButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <EmptyState v-if="!items.length" title="No inventory items yet" message="Create stock items first, then raise purchase orders against them." class="py-16" />
    </AppCard>

    <div class="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
      <AppCard :no-padding="true" class="overflow-hidden border-none shadow-xl">
        <div class="flex items-center justify-between border-b border-gray-100 bg-gray-50/60 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/20">
          <div>
            <h2 class="text-lg font-black text-gray-900 dark:text-white">Vendor Register</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Operational contacts for supplies and replenishment.</p>
          </div>
        </div>
        <div class="divide-y divide-gray-50 dark:divide-gray-700/50">
          <div v-for="vendor in vendors" :key="vendor.id" class="px-6 py-4">
            <p class="font-black text-gray-900 dark:text-white">{{ vendor.name }}</p>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ vendor.contact_name || 'No contact set' }} · {{ vendor.phone || 'No phone' }}
            </p>
            <p class="text-xs text-gray-400">{{ vendor.email || 'No email' }}</p>
          </div>
        </div>
        <EmptyState v-if="!vendors.length" title="No vendors yet" message="Create the vendor register before procurement starts." class="py-16" />
      </AppCard>

      <AppCard :no-padding="true" class="overflow-hidden border-none shadow-xl">
        <div class="flex flex-col gap-4 border-b border-gray-100 bg-gray-50/60 px-6 py-4 md:flex-row md:items-center md:justify-between dark:border-gray-700 dark:bg-gray-800/20">
          <div>
            <h2 class="text-lg font-black text-gray-900 dark:text-white">Purchase Orders</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Approve procurement and receive goods directly into stock.</p>
          </div>
          <select v-model="poStatusFilter" class="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
            <option value="">All statuses</option>
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
            <option value="received">Received</option>
          </select>
        </div>
        <div class="divide-y divide-gray-50 dark:divide-gray-700/50">
          <div v-for="po in purchaseOrders" :key="po.id" class="px-6 py-5">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div class="flex items-center gap-3">
                  <p class="font-black text-gray-900 dark:text-white">{{ po.po_number }}</p>
                  <span :class="statusClass(po.status)" class="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                    {{ po.status }}
                  </span>
                </div>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ po.vendor_name || 'Unknown vendor' }} · {{ po.items.length }} line item(s)</p>
                <p class="mt-1 text-xs text-gray-400">Expected {{ po.expected_date || 'TBD' }} · Total {{ formatCurrency(po.total_amount) }}</p>
              </div>
              <div class="flex flex-wrap gap-2">
                <AppButton v-if="po.status === 'draft'" size="sm" variant="secondary" @click="approvePo(po.id)">Approve</AppButton>
                <AppButton v-if="po.status === 'approved'" size="sm" @click="receivePo(po.id)">Receive Goods</AppButton>
              </div>
            </div>
            <div class="mt-3 flex flex-wrap gap-2">
              <span v-for="line in po.items" :key="line.id" class="rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-200">
                {{ line.item_name || line.sku }} × {{ line.quantity }}
              </span>
            </div>
          </div>
        </div>
        <EmptyState v-if="!purchaseOrders.length" title="No purchase orders yet" message="Create the first purchase order once vendors and items are ready." class="py-16" />
      </AppCard>
    </div>

    <AppModal v-model="showVendorModal" title="Add Vendor" size="md">
      <form class="space-y-4" @submit.prevent="saveVendor">
        <AppInput v-model="vendorForm.name" label="Vendor Name" required />
        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="vendorForm.contact_name" label="Contact Name" />
          <AppInput v-model="vendorForm.phone" label="Phone" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="vendorForm.email" type="email" label="Email" />
          <AppInput v-model="vendorForm.gstin" label="GSTIN" />
        </div>
        <AppInput v-model="vendorForm.address" type="textarea" label="Address" />
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showVendorModal = false">Cancel</AppButton>
          <AppButton @click="saveVendor" :loading="savingVendor">Save Vendor</AppButton>
        </div>
      </template>
    </AppModal>

    <AppModal v-model="showItemModal" :title="editingItemId ? 'Edit Inventory Item' : 'Add Inventory Item'" size="lg">
      <form class="space-y-4" @submit.prevent="saveItem">
        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="itemForm.sku" label="SKU" required />
          <AppInput v-model="itemForm.name" label="Item Name" required />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="itemForm.category" label="Category" required />
          <AppInput v-model="itemForm.unit" label="Unit" />
        </div>
        <div class="grid grid-cols-3 gap-4">
          <AppInput v-model="itemForm.current_stock" type="number" label="Current Stock" />
          <AppInput v-model="itemForm.reorder_level" type="number" label="Reorder Level" />
          <AppInput v-model="itemForm.unit_cost" type="number" label="Unit Cost" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="itemForm.location" label="Location" />
          <AppInput v-model="itemForm.vendor_id" type="select" label="Vendor">
            <option value="">Unassigned</option>
            <option v-for="vendor in vendors" :key="vendor.id" :value="String(vendor.id)">{{ vendor.name }}</option>
          </AppInput>
        </div>
        <AppInput v-model="itemForm.notes" type="textarea" label="Notes" />
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showItemModal = false">Cancel</AppButton>
          <AppButton @click="saveItem" :loading="savingItem">Save Item</AppButton>
        </div>
      </template>
    </AppModal>

    <AppModal v-model="showPoModal" title="Create Purchase Order" size="lg">
      <form class="space-y-4" @submit.prevent="savePurchaseOrder">
        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="poForm.vendor_id" type="select" label="Vendor" required>
            <option value="" disabled>Select vendor</option>
            <option v-for="vendor in vendors" :key="vendor.id" :value="String(vendor.id)">{{ vendor.name }}</option>
          </AppInput>
          <AppInput v-model="poForm.expected_date" type="date" label="Expected Delivery" />
        </div>
        <AppInput v-model="poForm.notes" type="textarea" label="Notes" />
        <div class="space-y-3 rounded-2xl border border-gray-100 p-4 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <p class="text-sm font-black text-gray-900 dark:text-white">Line Items</p>
            <AppButton size="sm" variant="secondary" @click="addPoLine">Add Line</AppButton>
          </div>
          <div v-for="(line, index) in poForm.items" :key="index" class="grid grid-cols-[1.7fr,0.7fr,0.8fr,auto] gap-3">
            <AppInput v-model="line.inventory_item_id" type="select" label="Item">
              <option value="" disabled>Select item</option>
              <option v-for="item in items" :key="item.id" :value="String(item.id)">{{ item.name }} ({{ item.sku }})</option>
            </AppInput>
            <AppInput v-model="line.quantity" type="number" label="Qty" />
            <AppInput v-model="line.unit_price" type="number" label="Unit Price" />
            <div class="flex items-end">
              <AppButton size="sm" variant="ghost" @click="removePoLine(index)">Remove</AppButton>
            </div>
          </div>
        </div>
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showPoModal = false">Cancel</AppButton>
          <AppButton @click="savePurchaseOrder" :loading="savingPo">Create PO</AppButton>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useToastStore } from '@/stores/toast'
import {
  inventoryService,
  type InventoryItemRecord,
  type InventorySummary,
  type InventoryVendor,
  type PurchaseOrderRecord,
} from '@/services/inventoryService'

const toast = useToastStore()

const summary = reactive<InventorySummary>({
  total_items: 0,
  low_stock_items: 0,
  vendor_count: 0,
  pending_purchase_orders: 0,
  stock_value: 0,
})
const vendors = ref<InventoryVendor[]>([])
const items = ref<InventoryItemRecord[]>([])
const purchaseOrders = ref<PurchaseOrderRecord[]>([])
const poStatusFilter = ref('')

const showVendorModal = ref(false)
const showItemModal = ref(false)
const showPoModal = ref(false)
const savingVendor = ref(false)
const savingItem = ref(false)
const savingPo = ref(false)
const editingItemId = ref<number | null>(null)

const vendorForm = reactive({
  name: '',
  contact_name: '',
  phone: '',
  email: '',
  address: '',
  gstin: '',
})

const itemForm = reactive({
  sku: '',
  name: '',
  category: '',
  unit: 'unit',
  current_stock: '0',
  reorder_level: '0',
  unit_cost: '',
  location: '',
  vendor_id: '',
  notes: '',
})

const poForm = reactive({
  vendor_id: '',
  expected_date: '',
  notes: '',
  items: [{ inventory_item_id: '', quantity: '1', unit_price: '' }],
})

async function loadSummary() {
  Object.assign(summary, await inventoryService.getSummary())
}

async function loadVendors() {
  vendors.value = await inventoryService.listVendors()
}

async function loadItems() {
  items.value = await inventoryService.listItems()
}

async function loadPurchaseOrders() {
  const data = await inventoryService.listPurchaseOrders({
    status: poStatusFilter.value || undefined,
    page: 1,
    per_page: 100,
  })
  purchaseOrders.value = data.items
}

async function refreshAll() {
  try {
    await Promise.all([loadSummary(), loadVendors(), loadItems(), loadPurchaseOrders()])
  } catch {
    toast.error('Failed to load inventory workspace')
  }
}

function resetVendorForm() {
  Object.assign(vendorForm, {
    name: '',
    contact_name: '',
    phone: '',
    email: '',
    address: '',
    gstin: '',
  })
}

async function saveVendor() {
  if (!vendorForm.name.trim()) return
  savingVendor.value = true
  try {
    await inventoryService.createVendor({
      name: vendorForm.name,
      contact_name: vendorForm.contact_name || null,
      phone: vendorForm.phone || null,
      email: vendorForm.email || null,
      address: vendorForm.address || null,
      gstin: vendorForm.gstin || null,
    })
    showVendorModal.value = false
    resetVendorForm()
    toast.success('Vendor saved')
    await refreshAll()
  } catch {
    toast.error('Failed to save vendor')
  } finally {
    savingVendor.value = false
  }
}

function resetItemForm() {
  Object.assign(itemForm, {
    sku: '',
    name: '',
    category: '',
    unit: 'unit',
    current_stock: '0',
    reorder_level: '0',
    unit_cost: '',
    location: '',
    vendor_id: '',
    notes: '',
  })
}

function openCreateItem() {
  editingItemId.value = null
  resetItemForm()
  showItemModal.value = true
}

function openEditItem(item: InventoryItemRecord) {
  editingItemId.value = item.id
  Object.assign(itemForm, {
    sku: item.sku,
    name: item.name,
    category: item.category,
    unit: item.unit,
    current_stock: String(item.current_stock),
    reorder_level: String(item.reorder_level),
    unit_cost: item.unit_cost == null ? '' : String(item.unit_cost),
    location: item.location || '',
    vendor_id: item.vendor_id == null ? '' : String(item.vendor_id),
    notes: item.notes || '',
  })
  showItemModal.value = true
}

async function saveItem() {
  if (!itemForm.sku.trim() || !itemForm.name.trim() || !itemForm.category.trim()) return
  savingItem.value = true
  try {
    const payload = {
      sku: itemForm.sku,
      name: itemForm.name,
      category: itemForm.category,
      unit: itemForm.unit || 'unit',
      current_stock: Number(itemForm.current_stock || 0),
      reorder_level: Number(itemForm.reorder_level || 0),
      unit_cost: itemForm.unit_cost === '' ? null : Number(itemForm.unit_cost),
      location: itemForm.location || null,
      vendor_id: itemForm.vendor_id === '' ? null : Number(itemForm.vendor_id),
      notes: itemForm.notes || null,
    }
    if (editingItemId.value) {
      await inventoryService.updateItem(editingItemId.value, payload)
      toast.success('Inventory item updated')
    } else {
      await inventoryService.createItem(payload)
      toast.success('Inventory item created')
    }
    showItemModal.value = false
    await refreshAll()
  } catch {
    toast.error(editingItemId.value ? 'Failed to update inventory item' : 'Failed to create inventory item')
  } finally {
    savingItem.value = false
  }
}

function resetPoForm() {
  Object.assign(poForm, {
    vendor_id: '',
    expected_date: '',
    notes: '',
    items: [{ inventory_item_id: '', quantity: '1', unit_price: '' }],
  })
}

function openCreatePo() {
  resetPoForm()
  showPoModal.value = true
}

function addPoLine() {
  poForm.items.push({ inventory_item_id: '', quantity: '1', unit_price: '' })
}

function removePoLine(index: number) {
  if (poForm.items.length === 1) return
  poForm.items.splice(index, 1)
}

async function savePurchaseOrder() {
  if (!poForm.vendor_id) return
  savingPo.value = true
  try {
    await inventoryService.createPurchaseOrder({
      vendor_id: Number(poForm.vendor_id),
      expected_date: poForm.expected_date || null,
      notes: poForm.notes || null,
      items: poForm.items.map((line) => ({
        inventory_item_id: Number(line.inventory_item_id),
        quantity: Number(line.quantity),
        unit_price: Number(line.unit_price),
      })),
    })
    showPoModal.value = false
    toast.success('Purchase order created')
    await refreshAll()
  } catch {
    toast.error('Failed to create purchase order')
  } finally {
    savingPo.value = false
  }
}

async function approvePo(id: number) {
  try {
    await inventoryService.approvePurchaseOrder(id)
    toast.success('Purchase order approved')
    await refreshAll()
  } catch {
    toast.error('Failed to approve purchase order')
  }
}

async function receivePo(id: number) {
  try {
    await inventoryService.receivePurchaseOrder(id)
    toast.success('Goods received into stock')
    await refreshAll()
  } catch {
    toast.error('Failed to receive purchase order')
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0)
}

function statusClass(status: PurchaseOrderRecord['status']) {
  if (status === 'received') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
  if (status === 'approved') return 'bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-300'
  return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
}

watch(poStatusFilter, () => {
  void loadPurchaseOrders()
})

onMounted(() => {
  void refreshAll()
})
</script>

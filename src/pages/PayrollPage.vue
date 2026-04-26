<template>
  <div class="space-y-8 animate-fade-in-up">
    <div class="relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-xl shadow-gray-100 dark:border dark:border-gray-800 dark:bg-gray-800/50 dark:shadow-none">
      <div class="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div class="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
            Payroll Control
          </div>
          <h1 class="mt-3 text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            Salary <span class="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Operations Hub</span>
          </h1>
          <p class="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            Configure salary structures, generate monthly runs, and track payout execution for staff.
          </p>
        </div>
        <div class="flex flex-wrap items-end gap-3">
          <AppInput v-model="selectedMonth" type="month" label="Payroll Month" />
          <AppButton variant="secondary" @click="refreshDashboard" :loading="payrollStore.loading">Refresh</AppButton>
          <AppButton @click="handleGenerate" :loading="generating">Generate Payroll</AppButton>
        </div>
      </div>
      <div class="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-50/70 blur-3xl dark:bg-emerald-900/10"></div>
    </div>

    <div class="grid grid-cols-2 gap-5 xl:grid-cols-4">
      <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800/50">
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Configured Profiles</p>
        <p class="mt-2 text-3xl font-black text-gray-900 dark:text-white">{{ payrollStore.summary?.configured_profiles || 0 }}</p>
      </div>
      <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800/50">
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Generated Records</p>
        <p class="mt-2 text-3xl font-black text-emerald-600 dark:text-emerald-400">{{ payrollStore.summary?.generated_records || 0 }}</p>
      </div>
      <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800/50">
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Pending Payouts</p>
        <p class="mt-2 text-3xl font-black text-amber-600 dark:text-amber-400">{{ payrollStore.summary?.pending_records || 0 }}</p>
      </div>
      <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800/50">
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Net Payroll</p>
        <p class="mt-2 text-3xl font-black text-teal-600 dark:text-teal-400">{{ formatCurrency(payrollStore.summary?.net_total || 0) }}</p>
      </div>
    </div>

    <AppCard :no-padding="true" class="overflow-hidden border-none shadow-xl">
      <div class="flex items-center justify-between border-b border-gray-100 bg-gray-50/60 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/20">
        <div>
          <h2 class="text-lg font-black text-gray-900 dark:text-white">Salary Profiles</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Each staff member needs a configured pay profile before payroll can be generated.</p>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="bg-gray-50/30 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:bg-gray-900/30">
              <th class="px-6 py-4">Staff Member</th>
              <th class="px-6 py-4">Role</th>
              <th class="px-6 py-4">Base Salary</th>
              <th class="px-6 py-4">Allowances</th>
              <th class="px-6 py-4">Deductions</th>
              <th class="px-6 py-4">Net Salary</th>
              <th class="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
            <tr v-for="profile in payrollStore.profiles" :key="profile.staff_id">
              <td class="px-6 py-4">
                <p class="font-black text-gray-900 dark:text-white">{{ profile.staff_name }}</p>
                <p class="text-xs text-gray-400">{{ profile.department }}</p>
              </td>
              <td class="px-6 py-4">
                <span class="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  {{ profile.role }}
                </span>
              </td>
              <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">{{ formatCurrency(profile.base_salary) }}</td>
              <td class="px-6 py-4 text-emerald-600 dark:text-emerald-400">{{ formatCurrency(profile.allowances) }}</td>
              <td class="px-6 py-4 text-rose-600 dark:text-rose-400">{{ formatCurrency(profile.deductions) }}</td>
              <td class="px-6 py-4 font-black text-teal-600 dark:text-teal-400">{{ formatCurrency(profile.net_salary) }}</td>
              <td class="px-6 py-4 text-right">
                <AppButton size="sm" variant="secondary" @click="openProfileModal(profile)">
                  {{ profile.id ? 'Edit' : 'Configure' }}
                </AppButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <EmptyState v-if="!payrollStore.profiles.length" title="No staff profiles yet" message="Staff records will appear here when the HR directory is available." class="py-16" />
    </AppCard>

    <AppCard :no-padding="true" class="overflow-hidden border-none shadow-xl">
      <div class="flex flex-col gap-4 border-b border-gray-100 bg-gray-50/60 px-6 py-4 md:flex-row md:items-center md:justify-between dark:border-gray-700 dark:bg-gray-800/20">
        <div>
          <h2 class="text-lg font-black text-gray-900 dark:text-white">Monthly Payroll Records</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Track payout readiness and lock each payment once it has been released.</p>
        </div>
        <select v-model="recordsStatusFilter" class="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="bg-gray-50/30 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:bg-gray-900/30">
              <th class="px-6 py-4">Staff Member</th>
              <th class="px-6 py-4">Gross</th>
              <th class="px-6 py-4">Net</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4">Reference</th>
              <th class="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
            <tr v-for="record in payrollStore.records" :key="record.id">
              <td class="px-6 py-4">
                <p class="font-black text-gray-900 dark:text-white">{{ record.staff_name }}</p>
                <p class="text-xs text-gray-400">{{ record.department }} · {{ summaryMonthLabel }}</p>
              </td>
              <td class="px-6 py-4 text-gray-900 dark:text-white">{{ formatCurrency(record.gross_pay) }}</td>
              <td class="px-6 py-4 font-black text-teal-600 dark:text-teal-400">{{ formatCurrency(record.net_pay) }}</td>
              <td class="px-6 py-4">
                <span :class="record.status === 'paid' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'" class="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                  {{ record.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-500 dark:text-gray-400">{{ record.payment_reference || '-' }}</td>
              <td class="px-6 py-4 text-right">
                <AppButton v-if="record.status !== 'paid'" size="sm" @click="openPayoutModal(record)">Mark Paid</AppButton>
                <span v-else class="text-xs font-semibold text-gray-400">Settled {{ formatDate(record.paid_at) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <EmptyState v-if="!payrollStore.records.length" title="No payroll records for this month" message="Generate the payroll month after salary profiles are configured." class="py-16" />
    </AppCard>

    <AppModal v-model="showProfileModal" title="Payroll Profile" size="md">
      <form class="space-y-4" @submit.prevent="saveProfile">
        <div class="rounded-2xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
          {{ profileForm.staff_name }}
        </div>
        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="profileForm.base_salary" type="number" label="Base Salary" required />
          <AppInput v-model="profileForm.allowances" type="number" label="Allowances" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="profileForm.deductions" type="number" label="Deductions" />
          <AppInput v-model="profileForm.payment_method" label="Payment Method" placeholder="bank_transfer" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="profileForm.bank_name" label="Bank Name" />
          <AppInput v-model="profileForm.bank_account_no" label="Bank Account" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="profileForm.ifsc_code" label="IFSC Code" />
          <AppInput v-model="profileForm.pan_number" label="PAN Number" />
        </div>
        <AppInput v-model="profileForm.notes" type="textarea" label="Notes" />
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showProfileModal = false">Cancel</AppButton>
          <AppButton @click="saveProfile" :loading="payrollStore.loading">Save Profile</AppButton>
        </div>
      </template>
    </AppModal>

    <AppModal v-model="showPayoutModal" title="Mark Payroll as Paid" size="sm">
      <form class="space-y-4" @submit.prevent="savePayout">
        <div class="rounded-2xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
          {{ payoutForm.staff_name }} · {{ summaryMonthLabel }}
        </div>
        <AppInput v-model="payoutForm.payment_reference" label="Payment Reference" placeholder="UTR / Voucher / Bank Ref" />
        <AppInput v-model="payoutForm.notes" type="textarea" label="Notes" />
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showPayoutModal = false">Cancel</AppButton>
          <AppButton @click="savePayout" :loading="payrollStore.loading">Confirm Payment</AppButton>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { usePayrollStore } from '@/stores/payroll'
import type { PayrollProfileRecord, PayrollRecord } from '@/types'

const payrollStore = usePayrollStore()

function currentMonth() {
  return new Date().toISOString().slice(0, 7)
}

const selectedMonth = ref(currentMonth())
const recordsStatusFilter = ref('')
const generating = ref(false)
const showProfileModal = ref(false)
const showPayoutModal = ref(false)
const activeStaffId = ref<number | null>(null)
const activeRecordId = ref<number | null>(null)

const profileForm = reactive({
  staff_name: '',
  base_salary: '0',
  allowances: '0',
  deductions: '0',
  payment_method: '',
  bank_name: '',
  bank_account_no: '',
  ifsc_code: '',
  pan_number: '',
  notes: '',
})

const payoutForm = reactive({
  staff_name: '',
  payment_reference: '',
  notes: '',
})

const summaryMonthLabel = computed(() => payrollStore.summary?.month || selectedMonth.value)

async function refreshDashboard() {
  await payrollStore.loadDashboard(
    selectedMonth.value,
    (recordsStatusFilter.value || undefined) as 'pending' | 'paid' | undefined,
  )
}

async function handleGenerate() {
  generating.value = true
  try {
    await payrollStore.generateMonth(selectedMonth.value)
    await refreshDashboard()
  } finally {
    generating.value = false
  }
}

function openProfileModal(profile: PayrollProfileRecord) {
  activeStaffId.value = profile.staff_id
  profileForm.staff_name = profile.staff_name
  profileForm.base_salary = String(profile.base_salary || 0)
  profileForm.allowances = String(profile.allowances || 0)
  profileForm.deductions = String(profile.deductions || 0)
  profileForm.payment_method = profile.payment_method || ''
  profileForm.bank_name = profile.bank_name || ''
  profileForm.bank_account_no = profile.bank_account_no || ''
  profileForm.ifsc_code = profile.ifsc_code || ''
  profileForm.pan_number = profile.pan_number || ''
  profileForm.notes = profile.notes || ''
  showProfileModal.value = true
}

async function saveProfile() {
  if (!activeStaffId.value) return
  await payrollStore.saveProfile(activeStaffId.value, {
    base_salary: Number(profileForm.base_salary || 0),
    allowances: Number(profileForm.allowances || 0),
    deductions: Number(profileForm.deductions || 0),
    payment_method: profileForm.payment_method || null,
    bank_name: profileForm.bank_name || null,
    bank_account_no: profileForm.bank_account_no || null,
    ifsc_code: profileForm.ifsc_code || null,
    pan_number: profileForm.pan_number || null,
    notes: profileForm.notes || null,
  })
  showProfileModal.value = false
  await refreshDashboard()
}

function openPayoutModal(record: PayrollRecord) {
  activeRecordId.value = record.id
  payoutForm.staff_name = record.staff_name
  payoutForm.payment_reference = record.payment_reference || ''
  payoutForm.notes = record.notes || ''
  showPayoutModal.value = true
}

async function savePayout() {
  if (!activeRecordId.value) return
  await payrollStore.markPaid(activeRecordId.value, {
    payment_reference: payoutForm.payment_reference || null,
    notes: payoutForm.notes || null,
  })
  showPayoutModal.value = false
  await refreshDashboard()
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0)
}

function formatDate(value: string | null) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  })
}

watch([selectedMonth, recordsStatusFilter], () => {
  void refreshDashboard()
})

onMounted(() => {
  void refreshDashboard()
})
</script>

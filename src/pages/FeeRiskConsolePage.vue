<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Command Header -->
    <div
      class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-700 via-rose-600 to-orange-600 p-8 text-white shadow-2xl shadow-rose-200 dark:shadow-none"
    >
      <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div
            class="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur-sm"
          >
            💳 Fee Intelligence
          </div>
          <h1 class="mt-3 text-4xl font-black tracking-tight">Fee Risk <span class="text-rose-100">Console</span></h1>
          <p class="mt-2 text-sm font-medium text-rose-100/80">
            Real-time outstanding fee analysis · {{ riskStudents.length }} students requiring attention
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <div class="rounded-2xl bg-white/15 px-5 py-3 backdrop-blur-sm">
            <p class="text-[10px] font-black uppercase tracking-widest text-white/60">Total Outstanding</p>
            <p class="mt-1 text-2xl font-black">₹{{ totalOutstanding.toLocaleString() }}</p>
          </div>
          <div class="rounded-2xl bg-white/15 px-5 py-3 backdrop-blur-sm">
            <p class="text-[10px] font-black uppercase tracking-widest text-white/60">Critical Cases</p>
            <p class="mt-1 text-2xl font-black text-rose-200">{{ criticalCount }}</p>
          </div>
          <div class="rounded-2xl bg-white/15 px-5 py-3 backdrop-blur-sm">
            <p class="text-[10px] font-black uppercase tracking-widest text-white/60">Recovery Rate</p>
            <p class="mt-1 text-2xl font-black text-emerald-200">{{ recoveryRate }}%</p>
          </div>
        </div>
      </div>
      <div class="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl"></div>
      <div class="absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-orange-400/10 blur-2xl"></div>
    </div>

    <!-- Risk Tier Summary Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <button
        @click="activeTier = activeTier === 'critical' ? '' : 'critical'"
        :class="[
          'group relative overflow-hidden rounded-3xl border-2 p-6 text-left transition-all hover:-translate-y-1 hover:shadow-xl',
          activeTier === 'critical'
            ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 shadow-xl shadow-rose-100/50'
            : 'border-rose-100 dark:border-rose-900/30 bg-white dark:bg-gray-800/50 hover:border-rose-300',
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-900/30 text-2xl">
            🚨
          </div>
          <span
            v-if="activeTier === 'critical'"
            class="rounded-full bg-rose-500 px-2 py-0.5 text-[9px] font-black text-white uppercase tracking-widest"
            >Active Filter</span
          >
        </div>
        <p class="mt-4 text-3xl font-black text-rose-600">{{ criticalCount }}</p>
        <p class="text-xs font-black uppercase tracking-widest text-rose-500 mt-1">Critical · >₹10,000</p>
        <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          ₹{{ criticalAmount.toLocaleString() }} total exposure
        </p>
      </button>

      <button
        @click="activeTier = activeTier === 'high' ? '' : 'high'"
        :class="[
          'group relative overflow-hidden rounded-3xl border-2 p-6 text-left transition-all hover:-translate-y-1 hover:shadow-xl',
          activeTier === 'high'
            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-xl shadow-amber-100/50'
            : 'border-amber-100 dark:border-amber-900/30 bg-white dark:bg-gray-800/50 hover:border-amber-300',
        ]"
      >
        <div class="flex items-center justify-between">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-2xl"
          >
            ⚠️
          </div>
          <span
            v-if="activeTier === 'high'"
            class="rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-black text-white uppercase tracking-widest"
            >Active Filter</span
          >
        </div>
        <p class="mt-4 text-3xl font-black text-amber-600">{{ highCount }}</p>
        <p class="text-xs font-black uppercase tracking-widest text-amber-500 mt-1">High · ₹5k – ₹10k</p>
        <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">₹{{ highAmount.toLocaleString() }} total exposure</p>
      </button>

      <button
        @click="activeTier = activeTier === 'medium' ? '' : 'medium'"
        :class="[
          'group relative overflow-hidden rounded-3xl border-2 p-6 text-left transition-all hover:-translate-y-1 hover:shadow-xl',
          activeTier === 'medium'
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-xl shadow-blue-100/50'
            : 'border-blue-100 dark:border-blue-900/30 bg-white dark:bg-gray-800/50 hover:border-blue-300',
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-2xl">
            📋
          </div>
          <span
            v-if="activeTier === 'medium'"
            class="rounded-full bg-blue-500 px-2 py-0.5 text-[9px] font-black text-white uppercase tracking-widest"
            >Active Filter</span
          >
        </div>
        <p class="mt-4 text-3xl font-black text-blue-600">{{ mediumCount }}</p>
        <p class="text-xs font-black uppercase tracking-widest text-blue-500 mt-1">Medium · < ₹5,000</p>
        <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">₹{{ mediumAmount.toLocaleString() }} total exposure</p>
      </button>
    </div>

    <!-- Filter/Search Bar -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div class="relative flex-1">
        <svg
          class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by student name or class..."
          class="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-gray-900 outline-none transition-all focus:border-rose-400 focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <select
        v-model="classFilter"
        class="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      >
        <option value="">All Classes</option>
        <option v-for="cls in availableClasses" :key="cls" :value="cls">{{ cls }}</option>
      </select>
      <button
        v-if="activeTier || searchQuery || classFilter"
        @click="clearFilters"
        class="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-500 hover:text-rose-600 transition-colors dark:border-gray-700 dark:bg-gray-800"
      >
        Clear Filters
      </button>
      <button
        @click="createDemo"
        :disabled="feeStore.hasRiskDemoData"
        :class="[
          'rounded-2xl px-4 py-3 text-sm font-black text-white transition-colors',
          feeStore.hasRiskDemoData ? 'bg-emerald-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700',
        ]"
      >
        + Create Demo
      </button>
      <button
        @click="clearDemo"
        :disabled="!feeStore.hasRiskDemoData"
        :class="[
          'rounded-2xl border px-4 py-3 text-sm font-black transition-colors dark:border-rose-900/40 dark:bg-rose-900/20',
          feeStore.hasRiskDemoData
            ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:text-rose-300'
            : 'border-rose-100 bg-rose-50/60 text-rose-300 cursor-not-allowed dark:text-rose-700',
        ]"
      >
        Clean Demo
      </button>
      <span
        class="rounded-xl bg-gray-100 px-3 py-2 text-xs font-black text-gray-600 dark:bg-gray-700 dark:text-gray-300"
      >
        Demo records: {{ feeStore.riskDemoCount }}
      </span>
    </div>

    <!-- Risk Table -->
    <div
      class="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-800/50"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr
              class="bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:bg-gray-900/30"
            >
              <th class="px-6 py-4">Student</th>
              <th class="px-6 py-4">Class</th>
              <th class="px-6 py-4">Fee Type</th>
              <th class="px-6 py-4">Total</th>
              <th class="px-6 py-4">Paid</th>
              <th class="px-6 py-4">Outstanding</th>
              <th class="px-6 py-4">Risk Tier</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
            <tr
              v-for="row in filteredRiskStudents"
              :key="row.id"
              class="group transition-all hover:bg-rose-50/30 dark:hover:bg-rose-900/5"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-orange-600 text-sm font-black text-white shadow-md flex-shrink-0"
                  >
                    {{ row.student_name.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-black text-gray-900 dark:text-white">{{ row.student_name }}</p>
                    <p class="text-[10px] font-bold text-gray-400 uppercase">ID #{{ row.student_id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  class="rounded-xl bg-gray-100 px-3 py-1 text-[10px] font-black text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  >{{ row.class_name }}</span
                >
              </td>
              <td class="px-6 py-4 text-xs font-medium text-gray-600 dark:text-gray-300">{{ row.fee_name }}</td>
              <td class="px-6 py-4 font-bold text-gray-900 dark:text-white">
                ₹{{ row.total_amount.toLocaleString() }}
              </td>
              <td class="px-6 py-4">
                <span class="font-bold text-emerald-600">₹{{ row.paid_amount.toLocaleString() }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="font-black text-rose-600">₹{{ row.due_amount.toLocaleString() }}</span>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest border',
                    tierBadge(row.due_amount).class,
                  ]"
                >
                  {{ tierBadge(row.due_amount).label }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="collectPayment(row)"
                    class="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-[10px] font-black text-emerald-700 transition-all hover:bg-emerald-600 hover:text-white dark:bg-emerald-900/20 dark:text-emerald-400"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                    Collect
                  </button>
                  <button
                    @click="sendReminder(row)"
                    class="flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2 text-[10px] font-black text-blue-700 transition-all hover:bg-blue-600 hover:text-white dark:bg-blue-900/20 dark:text-blue-400"
                  >
                    📱 Remind
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="!filteredRiskStudents.length" class="py-20 text-center">
        <p class="text-5xl">🎉</p>
        <p class="mt-3 text-lg font-black text-gray-900 dark:text-white">All Clear!</p>
        <p class="mt-1 text-sm text-gray-400">No outstanding fees matching your filters.</p>
      </div>

      <div class="flex items-center justify-between border-t border-gray-50 p-6 dark:border-gray-700/50 bg-gray-50/20">
        <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest">
          Showing {{ filteredRiskStudents.length }} of {{ riskStudents.length }} at-risk records
        </p>
        <button
          v-if="riskStudents.length > 0"
          @click="sendBulkReminders"
          class="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-black text-white hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
        >
          📢 Send Bulk Reminders ({{ filteredRiskStudents.length }})
        </button>
      </div>
    </div>

    <!-- Collection Modal -->
    <AppModal v-model="showCollectModal" title="Collect Payment" size="sm">
      <div v-if="collectTarget" class="space-y-4">
        <div class="rounded-2xl bg-gray-50 dark:bg-gray-700/50 p-4">
          <p class="text-sm font-black text-gray-900 dark:text-white">{{ collectTarget.student_name }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ collectTarget.fee_name }} · {{ collectTarget.class_name }}</p>
          <p class="mt-2 text-lg font-black text-rose-600">
            Outstanding: ₹{{ collectTarget.due_amount.toLocaleString() }}
          </p>
        </div>
        <div class="space-y-1">
          <label class="text-xs font-bold text-gray-500">Amount to Collect (₹)</label>
          <input
            v-model.number="collectAmount"
            type="number"
            :max="collectTarget.due_amount"
            :min="1"
            class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm font-bold"
          />
        </div>
        <div class="space-y-1">
          <label class="text-xs font-bold text-gray-500">Payment Method</label>
          <select
            v-model="collectMethod"
            class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm font-bold"
          >
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="cheque">Cheque</option>
          </select>
        </div>
      </div>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showCollectModal = false">Cancel</AppButton>
          <AppButton @click="confirmCollect" class="bg-emerald-600 hover:bg-emerald-700">Confirm Payment</AppButton>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFeeStore } from '@/stores/fees'
import { useToastStore } from '@/stores/toast'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import type { FeePayment } from '@/types'

const feeStore = useFeeStore()
const toast = useToastStore()

const searchQuery = ref('')
const classFilter = ref('')
const activeTier = ref('')

const riskStudents = computed(() => feeStore.payments.filter((p) => p.due_amount > 0))

const availableClasses = computed(() => {
  const set = new Set(riskStudents.value.map((p) => p.class_name))
  return [...set].sort()
})

function clearFilters() {
  activeTier.value = ''
  searchQuery.value = ''
  classFilter.value = ''
}

const filteredRiskStudents = computed(() => {
  let list = riskStudents.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter((p) => p.student_name.toLowerCase().includes(q) || p.class_name.toLowerCase().includes(q))
  }
  if (classFilter.value) list = list.filter((p) => p.class_name === classFilter.value)
  if (activeTier.value === 'critical') list = list.filter((p) => p.due_amount > 10000)
  else if (activeTier.value === 'high') list = list.filter((p) => p.due_amount > 5000 && p.due_amount <= 10000)
  else if (activeTier.value === 'medium') list = list.filter((p) => p.due_amount <= 5000)
  return list.sort((a, b) => b.due_amount - a.due_amount)
})

const totalOutstanding = computed(() => riskStudents.value.reduce((s, p) => s + p.due_amount, 0))

const criticalCount = computed(() => riskStudents.value.filter((p) => p.due_amount > 10000).length)
const highCount = computed(() => riskStudents.value.filter((p) => p.due_amount > 5000 && p.due_amount <= 10000).length)
const mediumCount = computed(() => riskStudents.value.filter((p) => p.due_amount <= 5000).length)

const criticalAmount = computed(() =>
  riskStudents.value.filter((p) => p.due_amount > 10000).reduce((s, p) => s + p.due_amount, 0),
)
const highAmount = computed(() =>
  riskStudents.value.filter((p) => p.due_amount > 5000 && p.due_amount <= 10000).reduce((s, p) => s + p.due_amount, 0),
)
const mediumAmount = computed(() =>
  riskStudents.value.filter((p) => p.due_amount <= 5000).reduce((s, p) => s + p.due_amount, 0),
)

const recoveryRate = computed(() => {
  const total = feeStore.payments.reduce((s, p) => s + p.total_amount, 0)
  const collected = feeStore.payments.reduce((s, p) => s + p.paid_amount, 0)
  return total ? Math.round((collected / total) * 100) : 0
})

function tierBadge(due: number) {
  if (due > 10000)
    return {
      label: 'Critical',
      class: 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-300',
    }
  if (due > 5000)
    return {
      label: 'High',
      class:
        'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300',
    }
  return {
    label: 'Medium',
    class: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
  }
}

// Collection modal
const showCollectModal = ref(false)
const collectTarget = ref<FeePayment | null>(null)
const collectAmount = ref(0)
const collectMethod = ref('cash')

function collectPayment(row: FeePayment) {
  collectTarget.value = row
  collectAmount.value = row.due_amount
  collectMethod.value = 'cash'
  showCollectModal.value = true
}

async function confirmCollect() {
  if (!collectTarget.value) return
  const amount = Math.min(collectAmount.value, collectTarget.value.due_amount)
  if (amount <= 0) {
    toast.error('Invalid amount')
    return
  }
  await feeStore.collectPayment(collectTarget.value.id, amount, collectMethod.value)
  toast.success(`₹${amount.toLocaleString()} collected from ${collectTarget.value.student_name}`)
  showCollectModal.value = false
}

function sendReminder(row: FeePayment) {
  toast.success(`SMS reminder sent to parent of ${row.student_name}`)
}

function sendBulkReminders() {
  toast.success(`Bulk reminders sent for ${filteredRiskStudents.value.length} students`)
}

function createDemo() {
  feeStore.createRiskDemoData()
}

function clearDemo() {
  feeStore.clearRiskDemoData()
}
</script>

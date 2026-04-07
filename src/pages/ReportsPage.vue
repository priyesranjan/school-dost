<template>
  <div class="space-y-6">
    <!-- Tabs -->
    <div class="flex gap-1 rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        :class="[
          'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors',
          activeTab === tab.key ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Daily Collection Report -->
    <template v-if="activeTab === 'collection'">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From</label>
            <input v-model="dateFrom" type="date" class="rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To</label>
            <input v-model="dateTo" type="date" class="rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>
        <AppButton v-if="filteredCollections.length" variant="secondary" @click="exportFeeCollection(filteredCollections)">
          ⬇ Export CSV
        </AppButton>
      </div>

      <!-- Summary -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Total Collected" :value="collectionStats.collected" icon="💰" icon-bg="bg-green-50" value-color="text-green-700" :is-currency="true" />
        <StatCard title="Transactions" :value="collectionStats.count" icon="📝" icon-bg="bg-blue-50" />
        <StatCard title="Average Payment" :value="collectionStats.average" icon="📊" icon-bg="bg-purple-50" :is-currency="true" />
      </div>

      <AppCard title="Collection Details" :no-padding="true">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Date</th>
                <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Student</th>
                <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Fee</th>
                <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Method</th>
                <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Receipt</th>
                <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-right">Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-gray-700">
              <tr v-for="p in filteredCollections" :key="p.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-700/50">
                <td class="px-6 py-3 text-gray-600 dark:text-gray-300">{{ p.payment_date }}</td>
                <td class="px-6 py-3">
                  <p class="font-medium text-gray-900 dark:text-white">{{ p.student_name }}</p>
                  <p class="text-xs text-gray-400 dark:text-gray-500">{{ p.class_name }}</p>
                </td>
                <td class="px-6 py-3 text-gray-600 dark:text-gray-300">{{ p.fee_name }}</td>
                <td class="px-6 py-3">
                  <span class="capitalize text-gray-600 dark:text-gray-300">{{ p.payment_method?.replace('_', ' ') }}</span>
                </td>
                <td class="px-6 py-3 text-gray-500 dark:text-gray-400 font-mono text-xs">{{ p.receipt_number }}</td>
                <td class="px-6 py-3 text-right font-semibold text-green-700">₹{{ p.paid_amount.toLocaleString('en-IN') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <EmptyState v-if="!filteredCollections.length" title="No collections" message="No payments found for the selected date range" />
      </AppCard>
    </template>

    <!-- Pending Fees Report -->
    <template v-if="activeTab === 'pending'">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Total Pending" :value="feeStore.totalPending" icon="⚠️" icon-bg="bg-red-50" value-color="text-red-600" :is-currency="true" />
        <StatCard title="Unpaid Students" :value="unpaidCount" icon="👤" icon-bg="bg-amber-50" />
        <StatCard title="Partial Payments" :value="partialCount" icon="⏳" icon-bg="bg-yellow-50" />
      </div>

      <div class="flex justify-end">
        <AppButton v-if="feeStore.duePayments.length" variant="secondary" @click="exportPendingFees(feeStore.duePayments)">
          ⬇ Export CSV
        </AppButton>
      </div>

      <AppCard title="Pending Fee Details" :no-padding="true">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Student</th>
                <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Class</th>
                <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Fee</th>
                <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-right">Total</th>
                <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-right">Paid</th>
                <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-right">Due</th>
                <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-gray-700">
              <tr v-for="p in feeStore.duePayments" :key="p.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-700/50">
                <td class="px-6 py-3 font-medium text-gray-900 dark:text-white">{{ p.student_name }}</td>
                <td class="px-6 py-3 text-gray-600 dark:text-gray-300">{{ p.class_name }}</td>
                <td class="px-6 py-3 text-gray-600 dark:text-gray-300">{{ p.fee_name }}</td>
                <td class="px-6 py-3 text-right text-gray-900 dark:text-white">₹{{ p.total_amount.toLocaleString('en-IN') }}</td>
                <td class="px-6 py-3 text-right text-green-700">₹{{ p.paid_amount.toLocaleString('en-IN') }}</td>
                <td class="px-6 py-3 text-right font-semibold text-red-600">₹{{ p.due_amount.toLocaleString('en-IN') }}</td>
                <td class="px-6 py-3">
                  <StatusBadge :color="p.status === 'partial' ? 'yellow' : 'red'">
                    {{ p.status === 'partial' ? 'Partial' : 'Unpaid' }}
                  </StatusBadge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <EmptyState v-if="!feeStore.duePayments.length" title="All clear!" message="No pending fees" />
      </AppCard>
    </template>

    <!-- Attendance Report -->
    <template v-if="activeTab === 'attendance'">
      <div class="flex items-center gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
          <input v-model="attDate" type="date" class="rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-center">
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ attStats.total }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Total</p>
        </div>
        <div class="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30 p-4 text-center">
          <p class="text-2xl font-bold text-green-700 dark:text-green-400">{{ attStats.present }}</p>
          <p class="text-xs text-green-600 dark:text-green-500">Present</p>
        </div>
        <div class="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 p-4 text-center">
          <p class="text-2xl font-bold text-red-700 dark:text-red-400">{{ attStats.absent }}</p>
          <p class="text-xs text-red-600 dark:text-red-500">Absent</p>
        </div>
        <div class="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30 p-4 text-center">
          <p class="text-2xl font-bold text-amber-700 dark:text-amber-400">{{ attStats.late }}</p>
          <p class="text-xs text-amber-600 dark:text-amber-500">Late</p>
        </div>
      </div>

      <div class="flex justify-end">
        <AppButton v-if="dateAttendance.length" variant="secondary" @click="exportAttendance(dateAttendance)">
          ⬇ Export CSV
        </AppButton>
      </div>

      <AppCard title="Attendance Records" :no-padding="true">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Roll No</th>
                <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Student</th>
                <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-gray-700">
              <tr v-for="r in dateAttendance" :key="r.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-700/50">
                <td class="px-6 py-3 text-gray-600 dark:text-gray-300">{{ r.roll_number }}</td>
                <td class="px-6 py-3 font-medium text-gray-900 dark:text-white">{{ r.student_name }}</td>
                <td class="px-6 py-3">
                  <StatusBadge :color="r.status === 'present' ? 'green' : r.status === 'absent' ? 'red' : 'yellow'">
                    {{ r.status }}
                  </StatusBadge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <EmptyState v-if="!dateAttendance.length" title="No records" message="No attendance marked for this date" />
      </AppCard>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFeeStore } from '@/stores/fees'
import { useAttendanceStore } from '@/stores/attendance'
import { exportFeeCollection, exportPendingFees, exportAttendance } from '@/utils/export'
import StatCard from '@/components/ui/StatCard.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const feeStore = useFeeStore()
const attendanceStore = useAttendanceStore()

const activeTab = ref('collection')
const tabs = [
  { key: 'collection', label: 'Daily Collection' },
  { key: 'pending', label: 'Pending Fees' },
  { key: 'attendance', label: 'Attendance' },
]

// Collection Report
const today = new Date().toISOString().split('T')[0]
const dateFrom = ref('2026-03-01')
const dateTo = ref(today)

const filteredCollections = computed(() => {
  return feeStore.payments
    .filter((p) => p.payment_date && p.paid_amount > 0)
    .filter((p) => {
      if (!p.payment_date) return false
      return p.payment_date >= dateFrom.value && p.payment_date <= dateTo.value
    })
    .sort((a, b) => (b.payment_date || '').localeCompare(a.payment_date || ''))
})

const collectionStats = computed(() => {
  const payments = filteredCollections.value
  const collected = payments.reduce((sum, p) => sum + p.paid_amount, 0)
  return {
    collected,
    count: payments.length,
    average: payments.length ? Math.round(collected / payments.length) : 0,
  }
})

// Pending
const unpaidCount = computed(() => feeStore.duePayments.filter((p) => p.status === 'unpaid').length)
const partialCount = computed(() => feeStore.duePayments.filter((p) => p.status === 'partial').length)

// Attendance
const attDate = ref(today)
const dateAttendance = computed(() =>
  attendanceStore.records.filter((r) => r.date === attDate.value)
)
const attStats = computed(() => {
  const records = dateAttendance.value
  return {
    total: records.length,
    present: records.filter((r) => r.status === 'present').length,
    absent: records.filter((r) => r.status === 'absent').length,
    late: records.filter((r) => r.status === 'late').length,
  }
})
</script>

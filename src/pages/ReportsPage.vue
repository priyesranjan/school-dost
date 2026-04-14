<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Premium Header -->
    <div
      class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-600 p-8 shadow-2xl shadow-teal-200/50 dark:shadow-none"
    >
      <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div
            class="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm"
          >
            📊 Analytics &amp; Reporting
          </div>
          <h1 class="mt-3 text-4xl font-black tracking-tight text-white drop-shadow">
            System <span class="text-teal-100">Reports</span>
          </h1>
          <p class="mt-1 text-sm font-medium text-white/70">
            Fee collections, attendance records, P&amp;L statements, and class-wise analytics.
          </p>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div class="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm border border-white/20 text-center">
            <p class="text-xl font-black text-white">₹{{ (feeStore.totalCollected / 1000).toFixed(0) }}k</p>
            <p class="text-[9px] font-black uppercase tracking-widest text-white/60">Collected</p>
          </div>
          <div class="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm border border-white/20 text-center">
            <p class="text-xl font-black text-white">{{ feeStore.duePayments.length }}</p>
            <p class="text-[9px] font-black uppercase tracking-widest text-white/60">Pending</p>
          </div>
          <div class="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm border border-white/20 text-center">
            <p class="text-xl font-black text-white">
              {{ netProfit >= 0 ? '+' : '' }}₹{{ (Math.abs(netProfit) / 1000).toFixed(0) }}k
            </p>
            <p class="text-[9px] font-black uppercase tracking-widest text-white/60">Net P&amp;L</p>
          </div>
        </div>
      </div>
      <div class="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/5 blur-2xl"></div>
    </div>

    <!-- Tab Pills -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        :class="[
          'rounded-2xl px-5 py-2.5 text-sm font-black transition-all',
          activeTab === tab.key
            ? 'bg-teal-600 text-white shadow-lg shadow-teal-200 dark:shadow-none'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700',
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
            <input
              v-model="dateFrom"
              type="date"
              class="rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To</label>
            <input
              v-model="dateTo"
              type="date"
              class="rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <AppButton
          v-if="filteredCollections.length"
          variant="secondary"
          @click="exportFeeCollection(filteredCollections)"
        >
          ⬇ Export CSV
        </AppButton>
      </div>

      <!-- Summary -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Collected"
          :value="collectionStats.collected"
          icon="💰"
          icon-bg="bg-green-50"
          value-color="text-green-700"
          :is-currency="true"
        />
        <StatCard title="Transactions" :value="collectionStats.count" icon="📝" icon-bg="bg-blue-50" />
        <StatCard
          title="Average Payment"
          :value="collectionStats.average"
          icon="📊"
          icon-bg="bg-purple-50"
          :is-currency="true"
        />
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
                  <span class="capitalize text-gray-600 dark:text-gray-300">{{
                    p.payment_method?.replace('_', ' ')
                  }}</span>
                </td>
                <td class="px-6 py-3 text-gray-500 dark:text-gray-400 font-mono text-xs">{{ p.receipt_number }}</td>
                <td class="px-6 py-3 text-right font-semibold text-green-700">
                  ₹{{ p.paid_amount.toLocaleString('en-IN') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <EmptyState
          v-if="!filteredCollections.length"
          title="No collections"
          message="No payments found for the selected date range"
        />
      </AppCard>
    </template>

    <!-- Pending Fees Report -->
    <template v-if="activeTab === 'pending'">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Pending"
          :value="feeStore.totalPending"
          icon="⚠️"
          icon-bg="bg-red-50"
          value-color="text-red-600"
          :is-currency="true"
        />
        <StatCard title="Unpaid Students" :value="unpaidCount" icon="👤" icon-bg="bg-amber-50" />
        <StatCard title="Partial Payments" :value="partialCount" icon="⏳" icon-bg="bg-yellow-50" />
      </div>

      <div class="flex justify-end">
        <AppButton
          v-if="feeStore.duePayments.length"
          variant="secondary"
          @click="exportPendingFees(feeStore.duePayments)"
        >
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
                <td class="px-6 py-3 text-right text-gray-900 dark:text-white">
                  ₹{{ p.total_amount.toLocaleString('en-IN') }}
                </td>
                <td class="px-6 py-3 text-right text-green-700">₹{{ p.paid_amount.toLocaleString('en-IN') }}</td>
                <td class="px-6 py-3 text-right font-semibold text-red-600">
                  ₹{{ p.due_amount.toLocaleString('en-IN') }}
                </td>
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
          <input
            v-model="attDate"
            type="date"
            class="rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-center">
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ attStats.total }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Total</p>
        </div>
        <div
          class="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30 p-4 text-center"
        >
          <p class="text-2xl font-bold text-green-700 dark:text-green-400">{{ attStats.present }}</p>
          <p class="text-xs text-green-600 dark:text-green-500">Present</p>
        </div>
        <div class="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 p-4 text-center">
          <p class="text-2xl font-bold text-red-700 dark:text-red-400">{{ attStats.absent }}</p>
          <p class="text-xs text-red-600 dark:text-red-500">Absent</p>
        </div>
        <div
          class="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30 p-4 text-center"
        >
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
    <!-- Profit & Loss Statement Report -->
    <template v-if="activeTab === 'pnl'">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Revenue (Fees)"
          :value="totalRevenue"
          icon="📈"
          icon-bg="bg-green-50"
          value-color="text-green-600"
          :is-currency="true"
        />
        <StatCard
          title="Total Outflow (Expenses)"
          :value="accStore.totalExpenses"
          icon="📉"
          icon-bg="bg-rose-50"
          value-color="text-rose-600"
          :is-currency="true"
        />
        <StatCard
          title="Net Profit/Loss"
          :value="netProfit"
          icon="🏛️"
          :icon-bg="netProfit >= 0 ? 'bg-emerald-50' : 'bg-red-50'"
          :value-color="netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'"
          :is-currency="true"
        />
      </div>

      <AppCard title="Expense Distribution by Category" class="mt-6">
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <div
            v-for="(amount, cat) in expenseDist"
            :key="cat"
            class="rounded-xl border border-gray-100 bg-gray-50/50 p-4 text-center dark:border-gray-700 dark:bg-gray-800/50"
          >
            <p class="text-[10px] font-black uppercase text-gray-500">{{ cat }}</p>
            <p class="mt-1 text-lg font-black text-gray-900 dark:text-white">₹{{ amount.toLocaleString('en-IN') }}</p>
          </div>
        </div>
      </AppCard>
    </template>

    <!-- Class Analytics Tab -->
    <template v-if="activeTab === 'analytics'">
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="item in classAnalytics"
          :key="item.class_name"
          class="group overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-800/50"
        >
          <div class="flex items-center justify-between">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-lg font-black text-teal-600 shadow-inner dark:bg-teal-900/30 dark:text-teal-400"
            >
              {{ item.class_name.replace('Class ', '') }}
            </div>
            <span
              class="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-black text-teal-600 dark:bg-teal-900/30 dark:text-teal-400"
            >
              {{ item.students }} students
            </span>
          </div>
          <h3 class="mt-4 text-base font-black text-gray-900 dark:text-white">{{ item.class_name }}</h3>

          <div class="mt-3 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-gray-500">Attendance Rate</span>
              <span
                :class="[
                  'font-black',
                  item.attendance >= 85
                    ? 'text-emerald-600'
                    : item.attendance >= 70
                      ? 'text-amber-600'
                      : 'text-rose-600',
                ]"
              >
                {{ item.attendance }}%
              </span>
            </div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
              <div
                class="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-700"
                :style="{ width: item.attendance + '%' }"
              ></div>
            </div>
            <div class="flex items-center justify-between text-xs mt-2">
              <span class="font-bold text-gray-500">Fee Recovery</span>
              <span
                :class="[
                  'font-black',
                  item.feeRecovery >= 80
                    ? 'text-emerald-600'
                    : item.feeRecovery >= 50
                      ? 'text-amber-600'
                      : 'text-rose-600',
                ]"
              >
                {{ item.feeRecovery }}%
              </span>
            </div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
              <div
                class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                :style="{ width: item.feeRecovery + '%' }"
              ></div>
            </div>
          </div>

          <div class="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-4 dark:border-gray-700">
            <div>
              <p class="text-[10px] font-black uppercase text-gray-400">Outstanding</p>
              <p class="mt-0.5 text-sm font-black text-rose-600">₹{{ item.outstanding.toLocaleString('en-IN') }}</p>
            </div>
            <div>
              <p class="text-[10px] font-black uppercase text-gray-400">Collected</p>
              <p class="mt-0.5 text-sm font-black text-emerald-600">₹{{ item.collected.toLocaleString('en-IN') }}</p>
            </div>
          </div>
        </div>
      </div>
      <EmptyState
        v-if="!classAnalytics.length"
        title="No class data"
        message="Add students and mark attendance to see analytics"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFeeStore } from '@/stores/fees'
import { useAttendanceStore } from '@/stores/attendance'
import { useAccountingStore } from '@/stores/accounting'
import { useStudentStore } from '@/stores/students'
import { exportFeeCollection, exportPendingFees, exportAttendance } from '@/utils/export'
import StatCard from '@/components/ui/StatCard.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const feeStore = useFeeStore()
const attendanceStore = useAttendanceStore()
const accStore = useAccountingStore()
const studentStore = useStudentStore()

const activeTab = ref('collection')
const tabs = [
  { key: 'collection', label: '💰 Daily Collection' },
  { key: 'pending', label: '⚠️ Pending Fees' },
  { key: 'attendance', label: '📋 Attendance' },
  { key: 'pnl', label: '📈 P&L Statement' },
  { key: 'analytics', label: '🏫 Class Analytics' },
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
const dateAttendance = computed(() => attendanceStore.records.filter((r) => r.date === attDate.value))
const attStats = computed(() => {
  const records = dateAttendance.value
  return {
    total: records.length,
    present: records.filter((r) => r.status === 'present').length,
    absent: records.filter((r) => r.status === 'absent').length,
    late: records.filter((r) => r.status === 'late').length,
  }
})

// Profit & Loss
const totalRevenue = computed(() => feeStore.totalCollected)
const expenseDist = computed(() => {
  const dist: Record<string, number> = {}
  accStore.expenses.forEach((e) => {
    dist[e.category] = (dist[e.category] || 0) + e.amount
  })
  return dist
})
const netProfit = computed(() => totalRevenue.value - accStore.totalExpenses)

// Class Analytics
const classAnalytics = computed(() => {
  return studentStore.classes
    .map((cls) => {
      const students = studentStore.students.filter((s) => s.class_name === cls)
      const clsPayments = feeStore.payments.filter((p) => p.class_name === cls)
      const collected = clsPayments.reduce((sum, p) => sum + p.paid_amount, 0)
      const outstanding = clsPayments.reduce((sum, p) => sum + p.due_amount, 0)
      const total = collected + outstanding
      const feeRecovery = total > 0 ? Math.round((collected / total) * 100) : 0
      const attRecords = attendanceStore.records.filter((r) => {
        const s = studentStore.students.find((x) => x.id === r.student_id)
        return s?.class_name === cls
      })
      const presentCount = attRecords.filter((r) => r.status === 'present').length
      const attendance = attRecords.length > 0 ? Math.round((presentCount / attRecords.length) * 100) : 85
      return { class_name: cls, students: students.length, attendance, feeRecovery, collected, outstanding }
    })
    .sort((a, b) => a.class_name.localeCompare(b.class_name))
})
</script>

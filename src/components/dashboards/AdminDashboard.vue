<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Welcome Header -->
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white capitalize">
          Welcome back, <span class="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">{{ authStore.user?.role }}</span>! 👋
        </h1>
        <p class="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
          {{ currentDate }} · <span class="font-bold text-gray-700 dark:text-gray-300">{{ authStore.user?.name }}</span>, here's the school's overview.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          📅 Academic Calendar
        </button>
        <router-link to="/settings" class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-lg shadow-primary-200 transition-all hover:bg-primary-700 hover:shadow-primary-300 dark:shadow-none">
          ⚙️
        </router-link>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Students"
        :value="studentStore.students.length"
        icon="👨‍🎓"
        icon-bg="bg-blue-100/50 dark:bg-blue-900/20"
        value-color="text-blue-700 dark:text-blue-400"
        :trend="5"
      />
      <StatCard
        title="Fees Collected"
        :value="feeStore.totalCollected"
        icon="💰"
        icon-bg="bg-green-100/50 dark:bg-green-900/20"
        value-color="text-green-700 dark:text-green-400"
        :is-currency="true"
        :trend="12"
      />
      <StatCard
        title="Pending Fees"
        :value="feeStore.totalPending"
        icon="⚠️"
        icon-bg="bg-amber-100/50 dark:bg-amber-900/20"
        value-color="text-amber-700 dark:text-amber-400"
        :is-currency="true"
      />
      <StatCard
        title="Attendance Rate"
        :value="attendanceStore.todayStats.percentage + '%'"
        icon="📊"
        icon-bg="bg-purple-100/50 dark:bg-purple-900/20"
        value-color="text-purple-700 dark:text-purple-400"
        :subtitle="`${attendanceStore.todayStats.present} students present today`"
      />
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- Fee Collection Chart Area -->
      <AppCard title="Fee Collection Trends" class="lg:col-span-2 overflow-hidden shadow-sm dark:bg-gray-800/50">
        <template #header>
          <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            <span class="inline-block h-2 w-2 rounded-full bg-primary-500"></span> Expected Collection
          </div>
        </template>
        <div class="mt-6 space-y-6">
          <div class="flex items-end gap-3 h-56 px-2">
            <div v-for="(month, i) in chartData" :key="i" class="group relative flex flex-1 flex-col items-center gap-2">
              <div class="w-full rounded-t-xl bg-gray-100 dark:bg-gray-700 relative overflow-hidden h-full group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                <div 
                  class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-xl transition-all duration-700 ease-out" 
                  :style="{ height: (month.collected / maxChart * 100) + '%' }"
                >
                  <div class="absolute top-2 w-full text-center text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    {{ Math.round(month.collected / 1000) }}k
                  </div>
                </div>
                <!-- Expected marker -->
                <div 
                  class="absolute inset-x-2 border-t-2 border-dashed border-primary-300 transition-all duration-500"
                  :style="{ bottom: (month.value / maxChart * 100) + '%' }"
                ></div>
              </div>
              <span class="text-[10px] font-bold uppercase tracking-tighter text-gray-400 group-hover:text-primary-500 transition-colors">{{ month.label }}</span>
            </div>
          </div>
          <div class="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
            <div class="flex items-center gap-6 text-xs font-medium text-gray-500 dark:text-gray-400">
              <span class="flex items-center gap-2">
                <span class="h-3 w-3 rounded bg-gradient-to-tr from-primary-600 to-primary-400"></span> 
                Collected
              </span>
              <span class="flex items-center gap-2">
                <span class="h-0.5 w-4 border-t-2 border-dashed border-primary-300"></span> 
                Target
              </span>
            </div>
            <button class="text-xs font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400">
              View Breakdown →
            </button>
          </div>
        </div>
      </AppCard>

      <!-- Today's Attendance Visual -->
      <AppCard title="Today's Attendance" class="flex flex-col justify-between shadow-sm dark:bg-gray-800/50">
        <div class="flex-1 flex flex-col items-center justify-center py-6">
          <div class="relative h-48 w-48">
            <!-- Circular Progress -->
            <svg class="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                class="text-gray-100 dark:text-gray-700"
                stroke-width="10"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
              <circle
                :class="attendanceStore.todayStats.percentage >= 90 ? 'text-green-500' : 'text-amber-500'"
                stroke-width="10"
                :stroke-dasharray="2 * Math.PI * 40"
                :stroke-dashoffset="2 * Math.PI * 40 * (1 - attendanceStore.todayStats.percentage / 100)"
                stroke-linecap="round"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
                class="transition-all duration-1000 ease-out"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-4xl font-black text-gray-900 dark:text-white">{{ attendanceStore.todayStats.percentage }}%</span>
              <span class="text-xs font-bold uppercase tracking-widest text-gray-400">Present</span>
            </div>
          </div>
          
          <div class="mt-8 grid w-full grid-cols-2 gap-4">
            <div class="rounded-2xl bg-gray-50 p-4 dark:bg-gray-700/30">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Present</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ attendanceStore.todayStats.present }}</p>
            </div>
            <div class="rounded-2xl bg-gray-50 p-4 dark:bg-gray-700/30">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Absent</p>
              <p class="text-xl font-bold text-red-500">{{ (attendanceStore.todayStats.total || studentStore.students.length) - attendanceStore.todayStats.present }}</p>
            </div>
          </div>
        </div>
      </AppCard>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <router-link
        v-for="action in quickActions"
        :key="action.path"
        :to="action.path"
        class="group flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-5 text-center transition-all hover:border-primary-100 hover:shadow-xl hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-900"
      >
        <div :class="['flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-transform group-hover:scale-110 group-hover:rotate-6', action.bg]">
          {{ action.icon }}
        </div>
        <div>
          <p class="text-sm font-bold text-gray-900 dark:text-white">{{ action.title }}</p>
          <p class="mt-0.5 text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase">{{ action.desc }}</p>
        </div>
      </router-link>
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <!-- Recent Payments -->
      <AppCard title="Recent Transactions" :no-padding="true" class="shadow-sm dark:bg-gray-800/50">
        <template #header>
          <button class="text-xs font-bold text-primary-600 hover:text-primary-700">All Transactions →</button>
        </template>
        <div class="divide-y divide-gray-50 dark:divide-gray-700/50">
          <div
            v-for="payment in recentPayments"
            :key="payment.id"
            class="group flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors dark:hover:bg-gray-700/30"
          >
            <div class="flex items-center gap-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-lg font-bold text-green-700 dark:bg-green-900/20 dark:text-green-400">
                {{ payment.student_name.charAt(0) }}
              </div>
              <div>
                <p class="text-sm font-bold text-gray-900 dark:text-white">{{ payment.student_name }}</p>
                <p class="mt-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">{{ payment.fee_name }} · <span class="bg-gray-100 px-1 rounded text-[10px] font-bold uppercase dark:bg-gray-700">{{ payment.class_name }}</span></p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-black text-green-600">₹{{ payment.paid_amount.toLocaleString('en-IN') }}</p>
              <p class="mt-0.5 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{{ formatRelativeDate(payment.payment_date) }}</p>
            </div>
          </div>
        </div>
        <EmptyState v-if="!recentPayments.length" title="No payments yet" message="Payments will appear here" />
      </AppCard>

      <!-- Fee Alerts -->
      <AppCard title="Priority Due Fees" :no-padding="true" class="shadow-sm dark:bg-gray-800/50">
        <template #header>
          <StatusBadge color="red">{{ feeStore.duePayments.length }} pending</StatusBadge>
        </template>
        <div class="divide-y divide-gray-50 dark:divide-gray-700/50">
          <div
            v-for="alert in feeAlerts"
            :key="alert.id"
            class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors dark:hover:bg-gray-700/30"
          >
            <div class="flex items-center gap-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-lg font-bold text-red-700 dark:bg-red-900/20 dark:text-red-400">
                {{ alert.student_name.charAt(0) }}
              </div>
              <div>
                <p class="text-sm font-bold text-gray-900 dark:text-white">{{ alert.student_name }}</p>
                <p class="mt-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">{{ alert.fee_name }} · <span class="bg-gray-100 px-1 rounded text-[10px] font-bold uppercase dark:bg-gray-700">{{ alert.class_name }}</span></p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-black text-red-600">₹{{ alert.due_amount.toLocaleString('en-IN') }}</p>
              <StatusBadge :color="alert.status === 'partial' ? 'yellow' : 'red'">
                {{ alert.status === 'partial' ? 'Partial' : 'Unpaid' }}
              </StatusBadge>
            </div>
          </div>
        </div>
        <EmptyState v-if="!feeAlerts.length" title="No alerts" message="All fees are collected!" />
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useStudentStore } from '@/stores/students'
import { useFeeStore } from '@/stores/fees'
import { useAttendanceStore } from '@/stores/attendance'
import StatCard from '@/components/ui/StatCard.vue'
import AppCard from '@/components/ui/AppCard.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const authStore = useAuthStore()
const studentStore = useStudentStore()
const feeStore = useFeeStore()
const attendanceStore = useAttendanceStore()

const currentDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

const quickActions = [
  { title: 'Add Student', desc: 'New Registration', path: '/students', icon: '👨‍🎓', bg: 'bg-blue-100/50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' },
  { title: 'Collect Fee', desc: 'New Payment', path: '/fees', icon: '💳', bg: 'bg-green-100/50 text-green-600 dark:bg-green-900/20 dark:text-green-400' },
  { title: 'Attendance', desc: 'Daily Marking', path: '/attendance', icon: '📋', bg: 'bg-purple-100/50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' },
  { title: 'Notice Board', desc: 'Post Update', path: '/notices', icon: '📢', bg: 'bg-amber-100/50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' },
]

const recentPayments = computed(() =>
  feeStore.payments
    .filter((p) => p.status === 'paid' || p.status === 'partial')
    .sort((a, b) => (b.payment_date || '').localeCompare(a.payment_date || ''))
    .slice(0, 5)
)

const feeAlerts = computed(() =>
  feeStore.duePayments.sort((a, b) => b.due_amount - a.due_amount).slice(0, 5)
)

const formatRelativeDate = (dateStr?: string | null) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  return dateStr
}

const chartData = computed(() => {
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  const monthMap: Record<string, number> = {
    Oct: 10, Nov: 11, Dec: 12, Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  }
  const collectedPerMonth: Record<string, number> = {}

  for (const p of feeStore.payments) {
    const dateStr = p.payment_date
    if (dateStr) {
      const m = parseInt(dateStr.split('-')[1], 10)
      const label = months.find((mo) => monthMap[mo] === m)
      if (label) {
        collectedPerMonth[label] = (collectedPerMonth[label] || 0) + p.paid_amount
      }
    }
  }

  const avgTotal = feeStore.structures.length
    ? feeStore.structures.reduce((s, f) => s + f.amount, 0)
    : 150000

  return months.map((label) => ({
    label,
    value: avgTotal * 0.9, // Mock target as 90% of structural average for visualization
    collected: collectedPerMonth[label] || (Math.random() * 50000 + 40000), // Adding some mock variety if empty
  }))
})

const maxChart = computed(() => Math.max(...chartData.value.map((d) => Math.max(d.value, d.collected)), 1))
</script>

<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Family Oversight Header -->
    <div class="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 p-8 text-white shadow-2xl shadow-emerald-200 dark:shadow-none">
      <div class="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div class="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
            👨‍👩‍👧‍👦 Guardian Portal
          </div>
          <h1 class="mt-3 text-4xl font-black tracking-tight">
            Family Overview, <span class="text-emerald-100 underline decoration-emerald-200/50 decoration-wavy">{{ authStore.user?.name.split(' ')[0] }}</span> 
          </h1>
          <p class="mt-2 text-sm font-medium text-emerald-100/80">
            {{ currentDate }} · Monitoring your children's excellence.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <AppButton variant="secondary" class="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md">
            📨 Support Desk
          </AppButton>
          <router-link to="/fees" class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-xl transition-transform hover:scale-110 active:scale-95">
            💳
          </router-link>
        </div>
      </div>
      <!-- Decorative Background Elements -->
      <div class="absolute -right-16 -top-16 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute -bottom-24 -left-20 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl"></div>
    </div>

    <!-- Aggregate Stats Row -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Fees Due"
        :value="feeStore.totalPending"
        icon="💰"
        icon-bg="bg-red-50 text-red-600 dark:bg-red-900/20"
        value-color="text-red-600 dark:text-red-400"
        :is-currency="true"
        subtitle="Next settlement: 15 April"
      />
      
      <!-- Ward Attendance Gauge -->
      <div class="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-100 transition-all hover:-translate-y-1 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-800/50 dark:shadow-none">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Ward Attendance</p>
            <p class="mt-1 text-3xl font-black text-gray-900 dark:text-white">{{ attendanceStore.todayStats.percentage }}%</p>
            <p class="mt-1 text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Ward: Aarav Patel</p>
          </div>
          <div class="relative h-20 w-20">
            <svg class="h-full w-full -rotate-90" viewBox="0 0 36 36">
              <defs>
                <linearGradient id="parentAttGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#10b981" />
                  <stop offset="100%" stop-color="#06b6d4" />
                </linearGradient>
              </defs>
              <path class="text-gray-100 dark:text-gray-700" stroke-width="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path stroke="url(#parentAttGradient)" stroke-width="3.5" :stroke-dasharray="`${attendanceStore.todayStats.percentage}, 100`" stroke-linecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center text-[10px] font-black text-emerald-600 dark:text-emerald-400">
              {{ attendanceStore.todayStats.percentage }}%
            </div>
          </div>
        </div>
      </div>

      <StatCard
        title="Active Enrollments"
        :value="studentStore.classes.length"
        icon="👨‍🎓"
        icon-bg="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
        value-color="text-emerald-700 dark:text-emerald-400"
        subtitle="Current Academic Session"
      />
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <!-- Recent Fee Ledger (Premium Polish) -->
      <AppCard title="Recent Transactions" :no-padding="true" :glass="true">
        <div class="divide-y divide-gray-50 dark:divide-gray-700/50">
           <div v-for="i in 3" :key="i" class="group flex items-center justify-between px-6 py-5 transition-all hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10">
              <div class="flex items-center gap-4">
                 <div class="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-emerald-50 text-emerald-600 shadow-inner group-hover:scale-110 transition-transform dark:bg-emerald-900/30 dark:text-emerald-400">
                   💰
                 </div>
                 <div>
                    <p class="text-sm font-black text-gray-900 dark:text-white">Quarterly Tuition Fee</p>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">12 March 2026 · <span class="text-emerald-600">PAID</span></p>
                 </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-black text-emerald-600">₹12,400</p>
                <button class="text-[9px] font-black uppercase text-gray-400 hover:text-emerald-600 transition-colors">Receipt #{{ 4520 + i }}</button>
              </div>
           </div>
        </div>
        <div class="bg-gray-50/50 p-4 dark:bg-gray-900/20">
           <button class="w-full text-center text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-all">
             Export Financial Statement ⤵
           </button>
        </div>
      </AppCard>

      <!-- Modern Notice Alerts -->
      <AppCard title="Institutional Updates" :glass="true">
        <div class="space-y-6">
          <div v-for="i in 2" :key="i" class="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white/40 p-5 transition-all hover:bg-white hover:shadow-xl dark:border-gray-700/50 dark:bg-gray-800/20">
             <div class="flex items-center gap-3 mb-2">
                <span class="rounded-[0.5rem] bg-amber-100 px-2 py-0.5 text-[9px] font-black text-amber-700 uppercase tracking-widest dark:bg-amber-900/40 dark:text-amber-400">Important</span>
                <span class="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Yesterday</span>
             </div>
             <p class="text-sm font-black text-gray-900 dark:text-white leading-snug group-hover:text-emerald-600 transition-colors">School bus timings adjusted for upcoming summer workshops...</p>
             <div class="absolute -right-2 -bottom-2 h-12 w-12 rounded-full bg-emerald-50 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-emerald-900/20"></div>
          </div>
          <AppButton variant="secondary" class="w-full border-dashed">View All Announcements</AppButton>
        </div>
      </AppCard>
    </div>

    <!-- Quick Actions Console -->
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <button v-for="action in parentActions" :key="action.label" class="group relative flex flex-col items-center gap-3 overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white p-6 transition-all hover:-translate-y-2 hover:border-emerald-100 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800/80">
           <div :class="['flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-inner transition-all group-hover:scale-110 group-hover:rotate-6', action.bg]">
              {{ action.icon }}
           </div>
           <p class="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white">{{ action.label }}</p>
           <div class="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50/0 to-emerald-50/30 opacity-0 transition-opacity group-hover:opacity-100 dark:from-emerald-900/0 dark:to-emerald-900/10"></div>
        </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useFeeStore } from '@/stores/fees'
import { useAttendanceStore } from '@/stores/attendance'
import { useStudentStore } from '@/stores/students'
import StatCard from '@/components/ui/StatCard.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const authStore = useAuthStore()
const feeStore = useFeeStore()
const attendanceStore = useAttendanceStore()
const studentStore = useStudentStore()

const currentDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

const parentActions = [
  { label: 'Pay Dues', icon: '💳', bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30' },
  { label: 'Report Cards', icon: '📊', bg: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' },
  { label: 'Help Desk', icon: '💬', bg: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30' },
  { label: 'Bus Tracking', icon: '🚌', bg: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30' },
]
</script>

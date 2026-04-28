<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Welcome Header -->
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Departmental Oversight, <span class="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">{{ authStore.user?.name.split(' ')[0] }}</span> 🏛️
        </h1>
        <p class="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
          {{ currentDate }} · Monitoring academic excellence across the department.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          📄 Annual Report
        </button>
        <router-link to="/reports" class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600 text-white shadow-lg shadow-amber-200 transition-all hover:bg-amber-700 hover:shadow-amber-300 dark:shadow-none">
          📊
        </router-link>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Faculty"
        value="45"
        icon="👨‍🏫"
        icon-bg="bg-blue-100/50 dark:bg-blue-900/20"
        value-color="text-blue-700 dark:text-blue-400"
      />
      <div class="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Dept Attendance</p>
            <p class="mt-1 text-2xl font-black text-gray-900 dark:text-white">{{ attendanceStore.todayStats.percentage }}%</p>
          </div>
          <div class="relative h-12 w-12">
            <svg class="h-full w-full -rotate-90" viewBox="0 0 36 36">
              <path class="text-gray-100 dark:text-gray-700" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="text-green-500" stroke-width="3" :stroke-dasharray="`${attendanceStore.todayStats.percentage}, 100`" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
          </div>
        </div>
      </div>
      <StatCard
        title="Modules Under Oversight"
        :value="studentStore.classes.length"
        icon="📋"
        icon-bg="bg-purple-100/50 dark:bg-purple-900/20"
        value-color="text-purple-700 dark:text-purple-400"
      />
      <StatCard
        title="Pending Approvals"
        value="12"
        icon="⚠️"
        icon-bg="bg-red-100/50 dark:bg-red-900/20"
        value-color="text-red-600 dark:text-red-400"
      />
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- Faculty Activity Feed -->
      <AppCard title="Recent Faculty Activity" class="lg:col-span-2 shadow-sm dark:bg-gray-800/50">
        <div class="mt-4 space-y-6">
           <div v-for="i in 4" :key="i" class="flex gap-4 group cursor-pointer">
              <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700 font-bold dark:bg-primary-900/20 dark:text-primary-400">
                 {{ ['PS', 'RV', 'NS', 'VK'][i-1] }}
              </div>
              <div class="flex-1 border-b border-gray-50 pb-4 last:border-0 dark:border-gray-700/50">
                 <p class="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors dark:text-white">
                    {{ ['Priya Sharma', 'Ramesh Verma', 'Neha Singh', 'Vikram Kumar'][i-1] }} 
                    <span class="font-normal text-gray-500">marked attendance for</span> 
                    Class {{ ['XC', 'XIIA', 'IXB', 'XIB'][i-1] }}
                 </p>
                 <p class="text-[10px] font-medium text-gray-400 uppercase mt-1">15 minutes ago</p>
              </div>
           </div>
           <div class="flex justify-center pt-2">
              <button class="text-xs font-bold text-gray-400 hover:text-primary-600">Load More Activity</button>
           </div>
        </div>
      </AppCard>

      <!-- Departmental Actions -->
      <AppCard title="Departmental Tools" class="shadow-sm dark:bg-gray-800/50">
        <div class="space-y-4">
           <router-link
              v-for="action in hodActions"
              :key="action.label"
              :to="action.path"
              class="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-primary-100 hover:shadow-lg hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-800"
            >
              <div :class="['flex h-12 w-12 items-center justify-center rounded-xl text-xl transition-transform group-hover:scale-110', action.bg]">
                {{ action.icon }}
              </div>
              <div class="text-left">
                <p class="text-sm font-bold text-gray-900 dark:text-white">{{ action.label }}</p>
                <p class="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase">{{ action.desc }}</p>
              </div>
            </router-link>
        </div>
      </AppCard>
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

const hodActions = [
  { label: 'Academic Reports', desc: 'Faculty Performance', path: '/reports', icon: '📊', bg: 'bg-amber-100 text-amber-600' },
  { label: 'Dept Timetable', desc: 'Staff Schedule', path: '/timetable', icon: '📅', bg: 'bg-blue-100 text-blue-600' },
  { label: 'Leave Requests', desc: '14 Pending', path: '/hr-operations', icon: '📝', bg: 'bg-purple-100 text-purple-600' },
  { label: 'Dept Notices', desc: 'Internal Updates', path: '/notices', icon: '🔊', bg: 'bg-green-100 text-green-600' },
]
</script>

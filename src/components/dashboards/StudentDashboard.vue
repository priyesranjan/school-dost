<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Learning-Centric Welcome Header -->
    <div class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 p-8 text-white shadow-2xl shadow-indigo-200 dark:shadow-none">
      <div class="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div class="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
            ✨ Academic Journey
          </div>
          <h1 class="mt-3 text-4xl font-black tracking-tight">
            Keep it up, <span class="text-indigo-100 underline decoration-indigo-200/50 decoration-wavy">{{ authStore.user?.name.split(' ')[0] }}</span>! 🚀
          </h1>
          <p class="mt-2 text-sm font-medium text-indigo-100/80">
            {{ currentDate }} · You're doing amazing today!
          </p>
        </div>
        <div class="flex items-center gap-3">
          <AppButton variant="secondary" class="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md">
            📚 Study Desk
          </AppButton>
          <router-link to="/calendar" class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-xl transition-transform hover:scale-110 active:scale-95">
            📅
          </router-link>
        </div>
      </div>
      <!-- Decorative Background Elements -->
      <div class="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl"></div>
    </div>

    <!-- Stats & Progress Row -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <!-- High-Fidelity Attendance Gauge -->
      <div class="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-100 transition-all hover:-translate-y-1 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-800/50 dark:shadow-none">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Monthly Presence</p>
            <p class="mt-1 text-4xl font-black text-gray-900 dark:text-white">{{ attendanceStore.todayStats.percentage }}%</p>
            <div class="mt-2 flex items-center gap-2">
              <span class="flex h-2 w-2 rounded-full bg-green-500"></span>
              <p class="text-[10px] font-bold text-green-600 uppercase">On Excellent Track</p>
            </div>
          </div>
          <div class="relative h-24 w-24 drop-shadow-xl">
             <svg class="h-full w-full -rotate-90" viewBox="0 0 36 36">
               <defs>
                 <linearGradient id="attGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                   <stop offset="0%" stop-color="#4f46e5" />
                   <stop offset="100%" stop-color="#9333ea" />
                 </linearGradient>
               </defs>
               <path class="text-gray-100 dark:text-gray-700" stroke-width="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
               <path stroke="url(#attGradient)" stroke-width="3.5" :stroke-dasharray="`${attendanceStore.todayStats.percentage}, 100`" stroke-linecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
             </svg>
             <div class="absolute inset-0 flex items-center justify-center text-xs font-black text-indigo-600 dark:text-indigo-400">
               {{ attendanceStore.todayStats.percentage }}%
             </div>
          </div>
        </div>
      </div>

      <StatCard
        title="Active Courses"
        :value="studentStore.classes.length"
        icon="📖"
        icon-bg="bg-amber-50 text-amber-600 dark:bg-amber-900/20"
        value-color="text-amber-700 dark:text-amber-400"
        subtitle="Across 5 departments"
      />
      <StatCard
        title="Fees Remaining"
        :value="feeStore.totalPending"
        icon="💳"
        icon-bg="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20"
        value-color="text-indigo-700 dark:text-indigo-400"
        :is-currency="true"
        subtitle="Settlement due in 8 days"
      />
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <!-- Modern Timetable Layout -->
      <AppCard title="Today's Learning Path" :glass="true">
        <div class="mt-6 space-y-8 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-700/50">
          <div v-for="(item, i) in studentSchedule" :key="i" class="relative pl-12 group">
            <!-- Timeline Node -->
            <div :class="[
              'absolute left-4 top-1.5 h-4 w-4 rounded-full border-[3px] border-white dark:border-gray-800 transition-all duration-500 group-hover:scale-125',
              item.isNow ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]' : 'bg-gray-200 dark:bg-gray-600'
            ]"></div>

            <div class="flex items-center justify-between rounded-2xl border border-gray-50 bg-white/50 p-4 transition-all hover:bg-white hover:shadow-xl dark:border-gray-700/30 dark:bg-gray-800/30">
              <div class="flex items-center gap-4">
                <div class="text-left min-w-[70px]">
                  <p class="text-[10px] font-black uppercase text-gray-400 tracking-tighter">{{ item.time }}</p>
                  <p class="text-[9px] font-bold text-gray-500">60 MINS</p>
                </div>
                <div class="h-8 w-px bg-gray-100 dark:bg-gray-700"></div>
                <div>
                  <p class="text-sm font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{{ item.subject }}</p>
                  <p class="text-[10px] font-bold text-gray-400 uppercase">Prof. {{ item.teacher }} · {{ item.room }}</p>
                </div>
              </div>
              <div v-if="item.isNow" class="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-black text-green-600 uppercase animate-pulse dark:bg-green-900/30">
                Current
              </div>
            </div>
          </div>
          <button class="w-full rounded-2xl border-2 border-dashed border-gray-100 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 transition-all hover:border-indigo-200 hover:text-indigo-500 dark:border-gray-700 dark:hover:border-indigo-900">
            Download Weekly Digital Timetable
          </button>
        </div>
      </AppCard>

      <!-- Interactive Notice Board -->
      <AppCard title="Campus Announcements" :glass="true">
        <div class="space-y-6">
          <div v-for="i in 3" :key="i" class="relative overflow-hidden rounded-2xl border border-gray-100 bg-white/40 p-4 transition-all hover:bg-white dark:border-gray-700/50 dark:bg-gray-800/20">
             <div class="flex items-center justify-between mb-2">
                <span :class="[
                  'rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-widest',
                  i === 1 ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'
                ]">
                  {{ i === 1 ? 'Urgent' : 'General' }}
                </span>
                <span class="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">March 24, 2026</span>
             </div>
             <p class="text-sm font-bold text-gray-900 dark:text-white leading-snug">Spring Semester Course Evaluation Survey is now live...</p>
             <button class="mt-3 flex items-center gap-1 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:gap-2 transition-all">
                Read Full Entry <span>→</span>
             </button>
          </div>
          <AppButton variant="secondary" class="w-full">Open Notice Archives</AppButton>
        </div>
      </AppCard>
    </div>

    <!-- Personalized Career/Action Grid -->
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <button v-for="action in studentActions" :key="action.label" class="group relative flex flex-col items-center gap-3 overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-6 transition-all hover:-translate-y-2 hover:border-indigo-100 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800/80">
           <div :class="['flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-inner transition-all group-hover:scale-110 group-hover:rotate-6', action.bg]">
              {{ action.icon }}
           </div>
           <div class="text-center">
              <p class="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white">{{ action.label }}</p>
              <p class="mt-0.5 text-[9px] font-bold uppercase text-gray-400 opacity-0 transition-opacity group-hover:opacity-100">{{ action.desc }}</p>
           </div>
           <!-- Hover Gradient Overlay -->
           <div class="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50/0 to-indigo-50/30 opacity-0 transition-opacity group-hover:opacity-100 dark:from-indigo-900/0 dark:to-indigo-900/10"></div>
        </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useStudentStore } from '@/stores/students'
import { useFeeStore } from '@/stores/fees'
import { useAttendanceStore } from '@/stores/attendance'
import StatCard from '@/components/ui/StatCard.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
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

const studentSchedule = [
  { time: '09:00 AM', subject: 'History of Art', teacher: 'Dawson', room: 'Art Studio', isNow: false },
  { time: '10:00 AM', subject: 'Mathematics (Calculus)', teacher: 'Smith', room: '102', isNow: true },
  { time: '11:15 AM', subject: 'Chemistry', teacher: 'White', room: 'Science Lab 2', isNow: false },
  { time: '01:00 PM', subject: 'English Literature', teacher: 'Green', room: 'Library', isNow: false },
]

const studentActions = [
  { label: 'Exam Results', desc: 'Check Grades', icon: '📝', bg: 'bg-green-50 text-green-600 dark:bg-green-900/30' },
  { label: 'Weekly Schedule', desc: 'Timetable', icon: '📅', bg: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' },
  { label: 'Learning Hub', desc: 'Materials', icon: '📚', bg: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30' },
  { label: 'Settings', desc: 'Preferences', icon: '⚙️', bg: 'bg-gray-50 text-gray-600 dark:bg-gray-900/30' },
]
</script>

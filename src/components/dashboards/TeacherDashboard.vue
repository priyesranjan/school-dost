<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Educator Focus Header -->
    <div class="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-rose-600 via-rose-500 to-amber-600 p-8 text-white shadow-2xl shadow-rose-200 dark:shadow-none">
      <div class="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div class="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
            🍎 Academic Lead
          </div>
          <h1 class="mt-3 text-4xl font-black tracking-tight">
            Hello, <span class="text-rose-100 underline decoration-rose-200/50 decoration-wavy">Teacher {{ authStore.user?.name.split(' ')[0] }}</span>!
          </h1>
          <p class="mt-2 text-sm font-medium text-rose-100/80">
            {{ currentDate }} · Ready to inspire your students today?
          </p>
        </div>
        <div class="flex items-center gap-3">
          <AppButton variant="secondary" class="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md">
            📋 Full Class List
          </AppButton>
          <router-link to="/attendance" class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-rose-600 shadow-xl transition-transform hover:scale-110 active:scale-95">
            ✔️
          </router-link>
        </div>
      </div>
      <!-- Decorative Background Elements -->
      <div class="absolute -right-12 -top-12 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-rose-400/20 blur-3xl"></div>
    </div>

    <!-- Stats & Overview Row -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Students Managed"
        :value="studentStore.students.length"
        icon="👨‍🏫"
        icon-bg="bg-rose-50 text-rose-600 dark:bg-rose-900/20"
        value-color="text-rose-700 dark:text-rose-400"
        subtitle="Across all active classes"
      />
      <StatCard
        title="Class Presence"
        :value="attendanceStore.todayStats.percentage + '%'"
        icon="✅"
        icon-bg="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
        value-color="text-emerald-700 dark:text-emerald-400"
        :subtitle="`${attendanceStore.todayStats.present} students present now`"
      />
      <StatCard
        title="Sessions Today"
        :value="mockSchedule.length"
        icon="📝"
        icon-bg="bg-amber-50 text-amber-600 dark:bg-amber-900/20"
        value-color="text-amber-700 dark:text-amber-400"
        subtitle="2 sessions remaining"
      />
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- High-Fidelity Schedule Timeline -->
      <AppCard title="Instructional Timeline" class="lg:col-span-2 shadow-xl" :glass="true">
        <div class="mt-6 space-y-8 relative before:absolute before:left-10 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-700/50">
          <div v-for="(item, i) in mockSchedule" :key="i" class="relative pl-16 group">
            <!-- Timeline Node -->
            <div :class="[
              'absolute left-8 top-2 h-4 w-4 rounded-full border-[3px] border-white dark:border-gray-800 transition-all duration-300 group-hover:scale-125',
              item.isNow ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)]' : 'bg-gray-200 dark:bg-gray-600'
            ]"></div>
            
            <div class="flex items-center justify-between rounded-2xl border border-gray-50 bg-white/50 p-5 transition-all hover:bg-white hover:shadow-xl dark:border-gray-700/30 dark:bg-gray-800/30">
              <div class="flex items-center gap-6">
                <div class="text-left min-w-[70px]">
                  <p class="text-[10px] font-black uppercase text-gray-400 tracking-tighter">{{ item.time }}</p>
                  <p class="text-[9px] font-bold text-rose-500">{{ item.duration }} ACTIVE</p>
                </div>
                <div class="h-10 w-px bg-gray-100 dark:bg-gray-700"></div>
                <div>
                  <p class="text-sm font-black text-gray-900 dark:text-white group-hover:text-rose-600 transition-colors">{{ item.subject }}</p>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ item.class_name }} · Room {{ item.room }}</p>
                </div>
              </div>
              <div v-if="item.isNow" class="rounded-full bg-rose-50 px-3 py-1.5 text-[10px] font-black text-rose-600 uppercase animate-pulse dark:bg-rose-900/30">
                Live Now
              </div>
            </div>
          </div>
          
          <div class="flex justify-center border-t border-gray-50 pt-6 dark:border-gray-700/50">
            <AppButton variant="secondary" class="text-[10px] font-black uppercase tracking-widest">Download Full Schedule</AppButton>
          </div>
        </div>
      </AppCard>

      <!-- Contextual Teaching Tools -->
      <div class="space-y-6">
        <AppCard title="Teaching Tools" :glass="true">
          <div class="grid grid-cols-1 gap-4">
            <router-link
              v-for="action in quickActions"
              :key="action.path"
              :to="action.path"
              class="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white/60 p-4 transition-all hover:-translate-y-1 hover:border-rose-100 hover:bg-white hover:shadow-xl dark:border-gray-700 dark:bg-gray-800/40"
            >
              <div :class="['flex h-12 w-12 items-center justify-center rounded-xl text-xl shadow-inner transition-transform group-hover:rotate-12 group-hover:scale-110', action.bg]">
                {{ action.icon }}
              </div>
              <div class="text-left">
                <p class="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white">{{ action.title }}</p>
                <p class="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase">{{ action.desc }}</p>
              </div>
            </router-link>
          </div>
          <div class="mt-6 rounded-2xl bg-rose-50 p-4 dark:bg-rose-900/20">
            <div class="flex items-center gap-2 mb-1">
              <p class="text-[10px] font-black text-rose-700 dark:text-rose-400 uppercase tracking-widest">Teacher Productivity Tip</p>
            </div>
            <p class="text-[11px] text-rose-600 dark:text-rose-300 leading-relaxed font-medium">Submitting attendance within the first 15 minutes of class improves record accuracy by 40%.</p>
          </div>
        </AppCard>

        <!-- Dynamic Staff Notices -->
        <AppCard title="Staff Notices" :glass="true">
           <div class="space-y-4">
              <div v-for="i in 2" :key="i" class="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white/40 p-4 transition-all hover:bg-white dark:border-gray-700/50 dark:bg-gray-800/20">
                <div class="flex items-center justify-between mb-2">
                  <span class="rounded-[0.5rem] bg-rose-50 px-2 py-0.5 text-[9px] font-black text-rose-600 uppercase tracking-widest dark:bg-rose-900/40 dark:text-rose-400">Meeting</span>
                  <span class="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">2h ago</span>
                </div>
                <h4 class="text-xs font-black text-gray-900 group-hover:text-rose-600 transition-colors dark:text-white">Annual Exam Guidelines Review</h4>
                <div class="absolute -right-2 -bottom-2 h-10 w-10 rounded-full bg-rose-50 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-rose-900/20"></div>
              </div>
              <button class="w-full text-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-rose-600 transition-all pt-2">Notice Archive →</button>
           </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useStudentStore } from '@/stores/students'
import { useAttendanceStore } from '@/stores/attendance'
import StatCard from '@/components/ui/StatCard.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const authStore = useAuthStore()
const studentStore = useStudentStore()
const attendanceStore = useAttendanceStore()

const currentDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

const quickActions = [
  { title: 'Mark Attendance', desc: 'Class XC · Lab 1', path: '/attendance', icon: '📋', bg: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' },
  { title: 'Update Grades', desc: 'Mid-term results', path: '/exams', icon: '📝', bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { title: 'Send SMS', desc: 'Parent Broadcast', path: '/sms', icon: '📤', bg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' },
  { title: 'Notice Board', desc: 'Staff Updates', path: '/notices', icon: '📢', bg: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
]

const mockSchedule = [
  { time: '09:00 AM', duration: '45m', subject: 'Mathematics', class_name: 'Class XC', room: '102', isNow: false },
  { time: '10:00 AM', duration: '45m', subject: 'Physics', class_name: 'Class XIIA', room: 'Lab 1', isNow: true },
  { time: '11:30 AM', duration: '45m', subject: 'Chemistry', class_name: 'Class IXB', room: '105', isNow: false },
  { time: '01:15 PM', duration: '45m', subject: 'Advanced Algebra', class_name: 'Class XIIA', room: '102', isNow: false },
]
</script>

<template>
  <div class="space-y-8 animate-fade-in-up">
    <div class="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sky-600 via-indigo-500 to-violet-600 p-8 text-white shadow-2xl shadow-sky-200 dark:shadow-none">
      <div class="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div class="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
            🛎️ Front Desk
          </div>
          <h1 class="mt-3 text-4xl font-black tracking-tight">
            Welcome, <span class="text-sky-100 underline decoration-sky-200/50 decoration-wavy">{{ displayName }}</span>!
          </h1>
          <p class="mt-2 text-sm font-medium text-sky-100/80">
            {{ currentDate }} · Manage admissions, documents, and day-to-day reception flow.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <AppButton variant="secondary" class="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md">
            New Admission
          </AppButton>
          <router-link to="/students" class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-xl transition-transform hover:scale-110 active:scale-95">
            ✚
          </router-link>
        </div>
      </div>
      <div class="absolute -right-12 -top-12 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl"></div>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Students in System"
        :value="studentStore.students.length"
        icon="🎓"
        icon-bg="bg-sky-50 text-sky-600 dark:bg-sky-900/20"
        value-color="text-sky-700 dark:text-sky-400"
        subtitle="Available for lookup and admission support"
      />
      <StatCard
        title="Open Follow-ups"
        :value="notifStore.unreadCount"
        icon="📣"
        icon-bg="bg-violet-50 text-violet-600 dark:bg-violet-900/20"
        value-color="text-violet-700 dark:text-violet-400"
        subtitle="Alerts that still need attention"
      />
      <StatCard
        title="Documents Ready"
        :value="4"
        icon="🪪"
        icon-bg="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
        value-color="text-emerald-700 dark:text-emerald-400"
        subtitle="ID cards, certificates, and letters"
      />
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <AppCard title="Reception Workflow" class="lg:col-span-2 shadow-xl" :glass="true">
        <div class="mt-6 space-y-4">
          <div v-for="step in workflow" :key="step.title" class="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white/70 p-4 dark:border-gray-700 dark:bg-gray-800/40">
            <div :class="['flex h-12 w-12 items-center justify-center rounded-2xl text-xl', step.badge]">{{ step.icon }}</div>
            <div class="flex-1">
              <p class="text-sm font-black text-gray-900 dark:text-white">{{ step.title }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ step.desc }}</p>
            </div>
            <router-link :to="step.path" class="rounded-full bg-gray-900 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-transform hover:scale-105 dark:bg-white dark:text-gray-900">
              Open
            </router-link>
          </div>
        </div>
      </AppCard>

      <AppCard title="Front Desk Notes" :glass="true">
        <div class="space-y-4">
          <div class="rounded-2xl bg-sky-50 p-4 dark:bg-sky-900/20">
            <p class="text-[10px] font-black uppercase tracking-widest text-sky-700 dark:text-sky-300">Today’s priority</p>
            <p class="mt-1 text-sm font-medium text-sky-800 dark:text-sky-100">Keep admission paperwork, fee receipts, and identity documents up to date.</p>
          </div>
          <div class="rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/50">
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Quick lookup</p>
            <p class="mt-1 text-sm font-medium text-gray-700 dark:text-gray-200">Use student records for attendance, contact details, and guardian communication.</p>
          </div>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useStudentStore } from '@/stores/students'
import { useNotificationStore } from '@/stores/notifications'
import AppCard from '@/components/ui/AppCard.vue'
import StatCard from '@/components/ui/StatCard.vue'
import AppButton from '@/components/ui/AppButton.vue'

const authStore = useAuthStore()
const studentStore = useStudentStore()
const notifStore = useNotificationStore()

const currentDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const displayName = computed(() => authStore.user?.name?.split(' ')[0] || 'Receptionist')

const workflow = [
  { icon: '📝', title: 'Admissions Queue', desc: 'Track new enquiries and create admissions quickly.', path: '/students', badge: 'bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300' },
  { icon: '🪪', title: 'ID Cards & Certificates', desc: 'Issue school documents for verified students.', path: '/id-cards', badge: 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300' },
  { icon: '💬', title: 'Parent Communication', desc: 'Coordinate follow-ups and routine messages.', path: '/parent-communication', badge: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300' },
  { icon: '📢', title: 'Notice Board', desc: 'Publish front-office notices and updates.', path: '/notices', badge: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300' },
]
</script>

<template>
  <div class="space-y-6">
    <section class="overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-primary-600 dark:text-primary-400">
            Role-based landing
          </p>
          <h1 class="mt-2 text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            {{ roleTitle }}
          </h1>
          <p class="mt-2 max-w-3xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            {{ roleDescription }}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <span class="rounded-full bg-primary-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
            {{ roleLabel }}
          </span>
          <span class="rounded-full bg-gray-100 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 dark:bg-gray-700 dark:text-gray-300">
            {{ authStore.user?.name || 'School user' }}
          </span>
        </div>
      </div>
    </section>

    <component :is="currentComponent" :key="currentRole" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AdminDashboard from '@/components/dashboards/AdminDashboard.vue'
import TeacherDashboard from '@/components/dashboards/TeacherDashboard.vue'
import StudentDashboard from '@/components/dashboards/StudentDashboard.vue'
import ParentDashboard from '@/components/dashboards/ParentDashboard.vue'
import HodDashboard from '@/components/dashboards/HodDashboard.vue'
import AccountantDashboard from '@/components/dashboards/AccountantDashboard.vue'
import ReceptionistDashboard from '@/components/dashboards/ReceptionistDashboard.vue'

const authStore = useAuthStore()

const currentRole = computed(() => authStore.user?.role || 'admin')

const roleProfiles: Record<string, { title: string; label: string; description: string }> = {
  admin: {
    title: 'Principal Dashboard',
    label: 'Principal',
    description: 'Full institution control with academic, operational, and policy-level visibility across the school.',
  },
  accountant: {
    title: 'Finance Dashboard',
    label: 'Accountant',
    description: 'Fee collection, dues, ledgers, and financial follow-up for the current school tenant.',
  },
  receptionist: {
    title: 'Front Desk Dashboard',
    label: 'Receptionist',
    description: 'Admissions, student lookup, documents, and day-to-day front office coordination.',
  },
  teacher: {
    title: 'Teacher Dashboard',
    label: 'Teacher',
    description: 'Classroom work, attendance, assignments, and learning flow designed for teachers.',
  },
  hod: {
    title: 'HOD Dashboard',
    label: 'Department Head',
    description: 'Academic oversight, department tracking, and curriculum-level coordination.',
  },
  parent: {
    title: 'Parent Dashboard',
    label: 'Parent',
    description: 'Ward progress, attendance, fee status, notices, and calendar visibility.',
  },
  student: {
    title: 'Student Dashboard',
    label: 'Student',
    description: 'Your personal academic view with attendance, assignments, timetable, and notices.',
  },
}

const roleTitle = computed(() => roleProfiles[currentRole.value]?.title || 'Dashboard')
const roleLabel = computed(() => roleProfiles[currentRole.value]?.label || 'User')
const roleDescription = computed(() => roleProfiles[currentRole.value]?.description || 'Your dashboard is tailored to your current access level.')

const currentComponent = computed(() => {
  switch (currentRole.value) {
    case 'admin':
      return AdminDashboard
    case 'accountant':
      return AccountantDashboard
    case 'receptionist':
      return ReceptionistDashboard
    case 'teacher':
      return TeacherDashboard
    case 'student':
      return StudentDashboard
    case 'parent':
      return ParentDashboard
    case 'hod':
      return HodDashboard
    default:
      return AdminDashboard
  }
})
</script>

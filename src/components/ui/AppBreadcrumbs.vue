<template>
  <nav v-if="crumbs.length > 1" class="flex items-center gap-1.5 text-sm">
    <template v-for="(crumb, i) in crumbs" :key="crumb.path">
      <router-link
        v-if="i < crumbs.length - 1"
        :to="crumb.path"
        class="text-gray-400 hover:text-primary-600 transition-colors"
      >
        {{ crumb.label }}
      </router-link>
      <span v-else class="font-medium text-gray-700 dark:text-gray-200">{{ crumb.label }}</span>
      <svg
        v-if="i < crumbs.length - 1"
        class="h-3.5 w-3.5 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  students: 'Students',
  'student-detail': 'Student Profile',
  fees: 'Fees',
  attendance: 'Attendance',
  exams: 'Exams & Grades',
  calendar: 'Academic Calendar',
  reports: 'Reports',
  sms: 'SMS',
  settings: 'Settings',
  profile: 'My Profile',
  'id-cards': 'ID Cards',
  certificates: 'Certificates',
  notices: 'Notices',
  timetable: 'Class Timetable',
  'audit-logs': 'Audit Logs',
  'ops-alerts': 'Ops Alerts',
  'verify-certificate': 'Verify Certificate',
}

const crumbs = computed(() => {
  const result: { label: string; path: string }[] = [
    { label: 'Dashboard', path: '/' },
  ]

  const name = route.name as string
  if (name && name !== 'dashboard') {
    // Handle nested routes like student-detail → Students > Student Profile
    if (name === 'student-detail') {
      result.push({ label: 'Students', path: '/students' })
    }
    result.push({
      label: routeLabels[name] || (route.meta.title as string) || name,
      path: route.path,
    })
  }

  return result
})
</script>

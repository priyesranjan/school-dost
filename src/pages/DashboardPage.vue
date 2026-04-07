<template>
  <div>
    <component :is="currentComponent" />
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

const authStore = useAuthStore()

const currentComponent = computed(() => {
  const role = authStore.user?.role
  switch (role) {
    case 'admin':
    case 'accountant':
    case 'receptionist':
      return AdminDashboard
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

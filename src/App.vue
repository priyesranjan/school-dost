<template>
  <div id="app">
    <component :is="layout">
      <ErrorBoundary>
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </ErrorBoundary>
    </component>
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import SuperAdminLayout from '@/layouts/SuperAdminLayout.vue'
import PublicLayout from '@/layouts/PublicLayout.vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'
import ErrorBoundary from '@/components/ui/ErrorBoundary.vue'

const route = useRoute()
const layout = computed(() => {
  if (route.meta.layout === 'public') return PublicLayout
  if (route.meta.layout === 'auth') return AuthLayout
  if (route.meta.layout === 'superadmin') return SuperAdminLayout
  return AppLayout
})
</script>

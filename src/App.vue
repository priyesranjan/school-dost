<template>
  <div id="app">
    <div
      class="fixed right-4 top-4 z-[60] rounded-full border px-4 py-2 text-xs font-semibold shadow-lg backdrop-blur-md"
      :class="isOfflineMode
        ? 'border-amber-200 bg-amber-50 text-amber-900 shadow-amber-500/10 dark:border-amber-900/50 dark:bg-amber-900/30 dark:text-amber-100'
        : 'border-emerald-200 bg-emerald-50 text-emerald-900 shadow-emerald-500/10 dark:border-emerald-900/50 dark:bg-emerald-900/30 dark:text-emerald-100'"
    >
      <button class="flex items-center gap-3" @click="toggleOfflineMode">
        <span
          class="inline-flex h-2 w-2 rounded-full"
          :class="isOfflineMode ? 'bg-amber-500' : 'bg-emerald-500'"
        />
        <span>{{ isOfflineMode ? 'Offline demo mode' : 'Live backend mode' }}</span>
        <span class="font-black underline decoration-dotted underline-offset-2">
          {{ isOfflineMode ? 'Switch to live' : 'Switch to demo' }}
        </span>
      </button>
    </div>
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
import { useSettingsStore } from '@/stores/settings'

const route = useRoute()
const settingsStore = useSettingsStore()

const isOfflineMode = computed(() => settingsStore.settings.offline_mode)
const layout = computed(() => {
  if (route.meta.layout === 'public') return PublicLayout
  if (route.meta.layout === 'auth') return AuthLayout
  if (route.meta.layout === 'superadmin') return SuperAdminLayout
  return AppLayout
})

function toggleOfflineMode() {
  settingsStore.updateSettings({ offline_mode: !settingsStore.settings.offline_mode })
}
</script>

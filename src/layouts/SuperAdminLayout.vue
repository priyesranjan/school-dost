<template>
  <div class="flex h-screen overflow-hidden bg-gray-950">
    <!-- Super Admin Sidebar -->
    <aside class="fixed inset-y-0 left-0 z-30 flex w-72 flex-col bg-gray-900 border-r border-gray-800 lg:static">
      <!-- Platform Identity -->
      <div class="flex h-16 items-center gap-3 border-b border-gray-800 px-6">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white font-black text-sm shadow-lg shadow-violet-500/30"
        >
          ⚡
        </div>
        <div>
          <h1 class="text-sm font-black text-white tracking-tight">ERP Platform</h1>
          <p class="text-[9px] font-black text-violet-400 uppercase tracking-[0.25em]">Super Admin Console</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          :class="[
            'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-200 group',
            isActive(item.path)
              ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30'
              : 'text-gray-400 hover:bg-gray-800/80 hover:text-white',
          ]"
        >
          <span class="text-lg">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
          <span
            v-if="item.badge"
            class="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-violet-500 px-1.5 text-[10px] font-black text-white"
          >
            {{ item.badge }}
          </span>
        </router-link>
      </nav>

      <!-- Operator Info -->
      <div class="border-t border-gray-800 p-4">
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-900/50 text-violet-400 font-black text-sm ring-2 ring-violet-500/30"
          >
            {{ auth.user?.name?.charAt(0) || 'S' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-white truncate">{{ auth.user?.name || 'Super Admin' }}</p>
            <p class="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Platform Operator</p>
          </div>
          <button
            @click="auth.logout()"
            class="rounded-lg p-2 text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-colors"
            title="Logout"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <header
        class="flex h-16 items-center justify-between border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl px-8"
      >
        <h2 class="text-lg font-black text-white tracking-tight">{{ pageTitle }}</h2>
        <div class="flex items-center gap-4">
          <span class="text-xs font-bold text-gray-500">{{ formattedDate }}</span>
          <div
            class="flex h-8 items-center gap-2 rounded-full bg-violet-500/10 px-4 text-[10px] font-black text-violet-400 uppercase tracking-widest"
          >
            <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Platform Online
          </div>
        </div>
      </header>
      <main class="flex-1 overflow-y-auto p-8 text-gray-100">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTenantsStore } from '@/stores/tenants'

const route = useRoute()
const auth = useAuthStore()
const tenantsStore = useTenantsStore()

const pageTitle = computed(() => (route.meta.title as string) || 'Platform Console')
const formattedDate = computed(() =>
  new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
)

const menuItems = computed(() => [
  { name: 'superadmin-dashboard', label: 'Platform Overview', path: '/superadmin', icon: '📊' },
  {
    name: 'institutions',
    label: 'Institutions',
    path: '/superadmin/institutions',
    icon: '🏛️',
    badge: tenantsStore.tenants.length,
  },
  { name: 'onboarding', label: 'Onboard New', path: '/superadmin/onboard', icon: '🚀' },
])

function isActive(path: string) {
  if (path === '/superadmin') return route.path === '/superadmin'
  return route.path.startsWith(path)
}
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 print:h-auto print:overflow-visible print:bg-white">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 lg:static lg:translate-x-0 print:hidden',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <!-- Logo -->
      <div class="flex h-16 items-center gap-3 border-b border-gray-100 dark:border-gray-700 px-6">
        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-sm">
          SE
        </div>
        <div>
          <h1 class="text-base font-semibold text-gray-900 dark:text-white">School ERP</h1>
          <p class="text-[11px] text-gray-400 dark:text-gray-500">Management System</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto px-3 py-4">
        <ul class="space-y-1">
          <li v-for="item in menuItems" :key="item.name">
            <router-link
              :to="item.path"
              :class="[
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive(item.path)
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white',
              ]"
              @click="sidebarOpen = false"
            >
              <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
              <span>{{ item.label }}</span>
              <span
                v-if="item.badge"
                class="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-danger-500 px-1.5 text-[10px] font-semibold text-white"
              >
                {{ item.badge }}
              </span>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- User -->
      <div class="border-t border-gray-100 dark:border-gray-700 p-4">
        <div class="flex items-center gap-3">
          <router-link to="/profile" class="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold text-sm hover:ring-2 hover:ring-primary-300 transition-all">
            {{ auth.user?.name?.charAt(0) || 'A' }}
          </router-link>
          <div class="flex-1 min-w-0">
            <router-link to="/profile" class="text-sm font-medium text-gray-900 dark:text-white truncate hover:text-primary-600 block">{{ auth.user?.name || 'Admin' }}</router-link>
            <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ auth.user?.role || 'admin' }}</p>
          </div>
          <button
            @click="auth.logout()"
            class="relative z-50 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Logout"
          >
            <LogoutIcon class="h-4 w-4 pointer-events-none" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Overlay for mobile -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-20 bg-black/30 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Main content -->
    <div class="flex flex-1 flex-col overflow-hidden print:overflow-visible print:block">
      <!-- Top navbar -->
      <header class="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 lg:px-8 print:hidden">
        <div class="flex items-center gap-4">
          <button
            @click="sidebarOpen = !sidebarOpen"
            class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            <MenuIcon class="h-5 w-5" />
          </button>
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ pageTitle }}</h2>
            <AppBreadcrumbs />
          </div>
        </div>
        <div class="flex items-center gap-3">
          <!-- Dark mode toggle -->
          <button
            @click="toggleDark()"
            class="rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <svg v-if="!isDark" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
            <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
          </button>

          <!-- Notification Bell -->
          <div class="relative">
            <button
              @click="notifOpen = !notifOpen"
              class="relative rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Notifications"
              :aria-expanded="notifOpen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span
                v-if="notifStore.unreadCount"
                class="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-danger-500 px-1 text-[10px] font-semibold text-white"
              >
                {{ notifStore.unreadCount }}
              </span>
            </button>

            <!-- Dropdown -->
            <div
              v-if="notifOpen"
              ref="notifRef"
              class="absolute right-0 top-full mt-2 w-80 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-50"
            >
              <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 px-4 py-3">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                <button
                  v-if="notifStore.unreadCount"
                  @click="notifStore.markAllRead()"
                  class="text-xs text-primary-600 hover:underline"
                >
                  Mark all read
                </button>
              </div>
              <div class="max-h-80 overflow-y-auto divide-y divide-gray-50">
                <div
                  v-for="n in notifStore.visibleNotifications.slice(0, 8)"
                  :key="n.id"
                  :class="[
                    'flex gap-3 px-4 py-3 transition-colors cursor-pointer',
                    n.read ? 'bg-white dark:bg-gray-800' : 'bg-primary-50/40 dark:bg-primary-900/20',
                  ]"
                  @click="notifStore.markAsRead(n.id)"
                >
                  <div :class="[
                    'mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs',
                    n.type === 'payment' ? 'bg-green-100 text-green-700' :
                    n.type === 'fee_due' ? 'bg-red-100 text-red-700' :
                    n.type === 'attendance' ? 'bg-purple-100 text-purple-700' :
                    n.type === 'student' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  ]">
                    {{ n.type === 'payment' ? '💰' : n.type === 'fee_due' ? '⚠️' : n.type === 'attendance' ? '📋' : n.type === 'student' ? '👨‍🎓' : '⚙️' }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ n.title }}</p>
                      <span
                        v-if="n.type === 'system'"
                        class="rounded px-1.5 py-0.5 text-[10px] font-semibold"
                        :class="n.severity === 'critical' ? 'bg-red-100 text-red-700' : n.severity === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'"
                      >
                        {{ n.severity || 'info' }}
                      </span>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ n.message }}</p>
                    <p class="text-[10px] text-gray-400 mt-0.5">{{ notifStore.timeAgo(n.timestamp) }}</p>
                    <div v-if="n.type === 'system'" class="mt-1 flex items-center gap-3 text-[11px]">
                      <button
                        class="text-primary-600 hover:underline"
                        @click.stop="notifStore.acknowledge(n.id)"
                      >
                        Acknowledge
                      </button>
                      <button
                        class="text-gray-500 hover:underline"
                        @click.stop="notifStore.snooze(n.id, 60)"
                      >
                        Snooze 1h
                      </button>
                    </div>
                  </div>
                  <span v-if="!n.read" class="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary-500"></span>
                </div>
              </div>
              <div v-if="!notifStore.visibleNotifications.length" class="px-4 py-6 text-center text-sm text-gray-400">
                No notifications
              </div>
            </div>
          </div>

          <span class="text-sm text-gray-500">{{ formattedDate }}</span>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-4 lg:p-8 dark:text-gray-100 print:overflow-visible print:p-0 print:block">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useFeeStore } from '@/stores/fees'
import { useNotificationStore } from '@/stores/notifications'
import { useDarkMode } from '@/composables/useDarkMode'
import AppBreadcrumbs from '@/components/ui/AppBreadcrumbs.vue'

const route = useRoute()
const auth = useAuthStore()
const feeStore = useFeeStore()
const notifStore = useNotificationStore()
const { isDark, toggle: toggleDark } = useDarkMode()
const sidebarOpen = ref(false)
const notifOpen = ref(false)
const notifRef = ref<HTMLElement | null>(null)

// Close notification dropdown on outside click
function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (notifOpen.value && notifRef.value && !notifRef.value.contains(target)) {
    notifOpen.value = false
  }
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

const pageTitle = computed(() => (route.meta.title as string) || 'Dashboard')

const formattedDate = computed(() => {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

// Simple inline SVG icon components
const DashboardIcon = { render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', 'stroke-width': '1.5', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' })] ) }
const StudentIcon = { render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', 'stroke-width': '1.5', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5' })] ) }
const FeeIcon = { render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', 'stroke-width': '1.5', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z' })] ) }
const AttendanceIcon = { render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', 'stroke-width': '1.5', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })] ) }
const ReportIcon = { render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', 'stroke-width': '1.5', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' })] ) }
const SmsIcon = { render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', 'stroke-width': '1.5', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z' })] ) }
const SettingsIcon = { render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', 'stroke-width': '1.5', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z' }), h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })] ) }
const ExamIcon = { render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', 'stroke-width': '1.5', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25' })] ) }
const CalendarIcon = { render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', 'stroke-width': '1.5', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5' })] ) }
const IdCardIcon = { render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', 'stroke-width': '1.5', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M3.75 6.75A2.25 2.25 0 016 4.5h12a2.25 2.25 0 012.25 2.25v10.5A2.25 2.25 0 0118 19.5H6a2.25 2.25 0 01-2.25-2.25V6.75z' }), h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M8.25 10.5h.008v.008H8.25V10.5zm0 0a1.875 1.875 0 110 3.75 1.875 1.875 0 010-3.75zm4.5 0h3.75m-3.75 3h3.75m-8.25 2.25h8.25' })] ) }
const CertificateIcon = { render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', 'stroke-width': '1.5', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M19.5 14.25v-8.25a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6v12a2.25 2.25 0 002.25 2.25h5.379a1.5 1.5 0 001.06-.44l5.871-5.871a1.5 1.5 0 00.44-1.06z' }), h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12.75 3.75v4.5a1.5 1.5 0 001.5 1.5h4.5' })] ) }
const NoticeIcon = { render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', 'stroke-width': '1.5', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M10.34 3.94c.09-.542.56-.94 1.11-.94h1.1c.55 0 1.02.398 1.11.94l.213 1.281c.062.374.312.686.644.869.073.04.147.083.22.128.325.196.72.257 1.076.124l1.217-.456a1.125 1.125 0 011.369.49l.648 1.123a1.125 1.125 0 01-.26 1.431l-1.004.827c-.292.24-.437.613-.43.992v.255c-.007.378.138.75.43.99l1.004.828c.424.35.534.954.26 1.43l-.648 1.123a1.125 1.125 0 01-1.369.491l-1.217-.456a1.875 1.875 0 00-1.076.124 6.52 6.52 0 01-.22.128c-.332.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-1.1c-.55 0-1.02-.398-1.11-.94l-.213-1.281a1.875 1.875 0 00-.644-.87 6.57 6.57 0 01-.22-.127 1.875 1.875 0 00-1.076-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-.647-1.124a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992v-.255a1.875 1.875 0 00-.43-.99L3.32 8.257a1.125 1.125 0 01-.26-1.43l.648-1.124a1.125 1.125 0 011.369-.49l1.217.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.213-1.281z' }), h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 12h6m-6 3h3m-3-6h6' })] ) }
const TimetableIcon = { render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', 'stroke-width': '1.5', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M8.25 6.75h7.5M8.25 10.5h7.5M8.25 14.25h4.5M6 3.75h12A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75z' })] ) }
const AuditIcon = { render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', 'stroke-width': '1.5', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M7.5 3.75h9A2.25 2.25 0 0118.75 6v12A2.25 2.25 0 0116.5 20.25h-9A2.25 2.25 0 015.25 18V6A2.25 2.25 0 017.5 3.75z' }), h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M8.25 8.25h7.5m-7.5 3h7.5m-7.5 3h4.5' })] ) }
const AlertIcon = { render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', 'stroke-width': '1.5', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 9v3.75m0 3.75h.007v.008H12v-.008z' }), h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M10.29 3.86L1.82 18a2.25 2.25 0 001.93 3.375h16.5A2.25 2.25 0 0022.18 18L13.71 3.86a2.25 2.25 0 00-3.42 0z' })] ) }
const MenuIcon = { render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', 'stroke-width': '1.5', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' })] ) }
const LogoutIcon = { render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', 'stroke-width': '1.5', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9' })] ) }

const allMenuItems = [
  { name: 'dashboard', label: 'Dashboard', path: '/', icon: DashboardIcon },
  { name: 'students', label: 'Students', path: '/students', icon: StudentIcon },
  { name: 'fees', label: 'Fees', path: '/fees', icon: FeeIcon, badge: feeStore.duePayments.length || undefined },
  { name: 'attendance', label: 'Attendance', path: '/attendance', icon: AttendanceIcon },
  { name: 'exams', label: 'Exams & Grades', path: '/exams', icon: ExamIcon },
  { name: 'calendar', label: 'Calendar', path: '/calendar', icon: CalendarIcon },
  { name: 'reports', label: 'Reports', path: '/reports', icon: ReportIcon },
  { name: 'timetable', label: 'Timetable', path: '/timetable', icon: TimetableIcon },
  { name: 'notices', label: 'Notices', path: '/notices', icon: NoticeIcon },
  { name: 'id-cards', label: 'ID Cards', path: '/id-cards', icon: IdCardIcon },
  { name: 'certificates', label: 'Certificates', path: '/certificates', icon: CertificateIcon },
  { name: 'audit-logs', label: 'Audit Logs', path: '/audit-logs', icon: AuditIcon },
  { name: 'ops-alerts', label: 'Ops Alerts', path: '/ops-alerts', icon: AlertIcon },
  { name: 'sms', label: 'SMS', path: '/sms', icon: SmsIcon },
  { name: 'settings', label: 'Settings', path: '/settings', icon: SettingsIcon },
]

const menuItems = computed(() =>
  allMenuItems.filter((item) => auth.canAccess(item.name))
)

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

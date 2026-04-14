<template>
  <div class="space-y-8">
    <!-- Platform Stats -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="group relative overflow-hidden rounded-3xl border border-gray-800 bg-gray-900/50 p-6 transition-all hover:border-gray-700 hover:shadow-2xl hover:shadow-violet-500/5"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{{ stat.label }}</p>
            <p class="mt-2 text-3xl font-black text-white">{{ stat.value }}</p>
            <p v-if="stat.sub" class="mt-1 text-xs font-bold text-gray-400">{{ stat.sub }}</p>
          </div>
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl" :class="stat.bg">
            {{ stat.icon }}
          </div>
        </div>
        <div class="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r" :class="stat.bar"></div>
      </div>
    </div>

    <div
      v-if="syncMessage || tenantsStore.usingFallbackData"
      class="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-3 text-xs font-bold text-amber-300"
    >
      {{ syncMessage || 'Showing cached institution data until the live platform sync succeeds.' }}
    </div>

    <!-- Tenants Overview + Recent Activity -->
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- Recent Institutions -->
      <div class="lg:col-span-2 rounded-3xl border border-gray-800 bg-gray-900/50 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-sm font-black text-white uppercase tracking-widest">Recent Institutions</h3>
          <router-link
            to="/superadmin/institutions"
            class="text-[10px] font-black text-violet-400 uppercase tracking-widest hover:underline"
            >View All →</router-link
          >
        </div>
        <div class="space-y-3">
          <div
            v-for="tenant in recentTenants"
            :key="tenant.id"
            class="flex items-center gap-4 rounded-2xl border border-gray-800/50 bg-gray-800/30 p-4 transition-all hover:border-gray-700 hover:bg-gray-800/50"
          >
            <div
              class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-700/50 text-lg font-black text-white"
            >
              {{ tenant.name.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-white truncate">{{ tenant.name }}</p>
              <p class="text-xs text-gray-500">{{ tenant.city }}, {{ tenant.state }} · {{ tenant.admin_email }}</p>
            </div>
            <div class="text-right">
              <span
                :class="[
                  'inline-flex rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest',
                  tenant.subscription_status === 'active'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : tenant.subscription_status === 'trial'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-red-500/10 text-red-400',
                ]"
              >
                {{ tenant.subscription_status }}
              </span>
              <p class="mt-1 text-[10px] text-gray-600">{{ tenant.total_students }} students</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="space-y-6">
        <div class="rounded-3xl border border-gray-800 bg-gray-900/50 p-6">
          <h3 class="text-sm font-black text-white uppercase tracking-widest mb-4">Quick Actions</h3>
          <div class="space-y-3">
            <router-link
              to="/superadmin/onboard"
              class="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all"
            >
              🚀 <span>Onboard New Institution</span>
            </router-link>
            <router-link
              to="/superadmin/institutions"
              class="flex items-center gap-3 rounded-2xl border border-gray-700 px-4 py-3 text-sm font-bold text-gray-300 hover:bg-gray-800 transition-all"
            >
              🏛️ <span>Manage Institutions</span>
            </router-link>
          </div>
        </div>

        <!-- Subscription Breakdown -->
        <div class="rounded-3xl border border-gray-800 bg-gray-900/50 p-6">
          <h3 class="text-sm font-black text-white uppercase tracking-widest mb-4">Subscriptions</h3>
          <div class="space-y-3">
            <div v-for="plan in planBreakdown" :key="plan.name" class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="h-3 w-3 rounded-full" :class="plan.color"></div>
                <span class="text-xs font-bold text-gray-400">{{ plan.name }}</span>
              </div>
              <span class="text-sm font-black text-white">{{ plan.count }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTenantsStore } from '@/stores/tenants'
import {
  extractApiErrorMessage,
  superadminService,
  type PlatformStats,
} from '@/services/superadminService'

const tenantsStore = useTenantsStore()
const liveStats = ref<PlatformStats | null>(null)
const syncMessage = ref('')

async function loadDashboard() {
  syncMessage.value = ''

  const [statsResult, tenantsResult] = await Promise.allSettled([
    superadminService.getPlatformStats(),
    tenantsStore.fetchTenants(),
  ])

  if (statsResult.status === 'fulfilled') {
    liveStats.value = statsResult.value
  }

  if (tenantsResult.status === 'rejected') {
    syncMessage.value =
      tenantsStore.tenants.length > 0
        ? 'Live tenant sync failed, so this view is using cached institution data.'
        : extractApiErrorMessage(tenantsResult.reason, 'Live tenant sync failed.')
  } else if (statsResult.status === 'rejected') {
    syncMessage.value = extractApiErrorMessage(statsResult.reason, 'Live platform stats are unavailable.')
  }
}

onMounted(loadDashboard)

const stats = computed(() => {
  const s = liveStats.value
  return [
    {
      label: 'Total Institutions',
      value: s ? s.total : tenantsStore.tenants.length,
      icon: '🏛️',
      bg: 'bg-violet-500/10',
      bar: 'from-violet-500 to-fuchsia-500',
      sub: `${s ? s.active : tenantsStore.activeTenants.length} active`,
    },
    {
      label: 'Students Across Platform',
      value: (s ? s.totalStudents : tenantsStore.totalStudentsAcross).toLocaleString('en-IN'),
      icon: '👨‍🎓',
      bg: 'bg-blue-500/10',
      bar: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Staff Across Platform',
      value: (s ? s.totalStaff : tenantsStore.totalStaffAcross).toLocaleString('en-IN'),
      icon: '👤',
      bg: 'bg-emerald-500/10',
      bar: 'from-emerald-500 to-teal-500',
    },
    {
      label: 'Trial Institutions',
      value: s ? s.trial : tenantsStore.trialTenants.length,
      icon: '⏳',
      bg: 'bg-amber-500/10',
      bar: 'from-amber-500 to-orange-500',
      sub: 'Pending conversion',
    },
  ]
})

const recentTenants = computed(() =>
  [...tenantsStore.tenants]
    .sort((a, b) => new Date(b.onboarded_at).getTime() - new Date(a.onboarded_at).getTime())
    .slice(0, 5),
)

const planBreakdown = computed(() => {
  const plans: Record<'trial' | 'basic' | 'standard' | 'premium' | 'enterprise', number> = {
    trial: 0,
    basic: 0,
    standard: 0,
    premium: 0,
    enterprise: 0,
  }
  tenantsStore.tenants.forEach((t) => {
    plans[t.subscription_plan]++
  })
  return [
    { name: 'Enterprise', count: plans.enterprise, color: 'bg-fuchsia-500' },
    { name: 'Premium', count: plans.premium, color: 'bg-violet-500' },
    { name: 'Standard', count: plans.standard, color: 'bg-blue-500' },
    { name: 'Basic', count: plans.basic, color: 'bg-emerald-500' },
    { name: 'Trial', count: plans.trial, color: 'bg-amber-500' },
  ]
})
</script>

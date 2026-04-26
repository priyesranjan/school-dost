<template>
  <div v-if="tenant" class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-3 dark:border-gray-700 dark:bg-gray-900">
      <div class="flex items-center gap-3">
        <button @click="$router.push('/superadmin/institutions')" class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg">
          {{ tenant.name.charAt(0) }}
        </div>
        <div>
          <h1 class="font-black text-gray-900 dark:text-white">{{ tenant.name }}</h1>
          <p class="text-xs text-gray-500">{{ tenant.city }}, {{ tenant.state }} · {{ tenant.type }}</p>
        </div>
      </div>
      <StatusPill :status="tenant.subscription_status" />
    </div>

    <!-- Tabs -->
    <div class="flex border-b-2 border-gray-200 bg-white rounded-t-xl dark:border-gray-700 dark:bg-gray-900 overflow-x-auto">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
        :class="['px-5 py-3 text-[11px] font-bold uppercase tracking-wider border-b-2 -mb-[2px] whitespace-nowrap transition-all',
          activeTab === tab.id
            ? 'text-blue-700 border-blue-600 dark:text-blue-400 dark:border-blue-400'
            : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800']">
        {{ tab.icon }} {{ tab.label }}
      </button>
    </div>

    <div class="rounded-b-xl border border-t-0 border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">

      <!-- ===== TAB: OVERVIEW ===== -->
      <div v-if="activeTab === 'overview'" class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Students" :value="String(tenant.total_students)" color="blue" icon="🎓" />
        <StatCard label="Total Staff" :value="String(tenant.total_staff)" color="emerald" icon="👩‍🏫" />
        <StatCard label="Monthly Bill" :value="monthlyBillDisplay" color="amber" icon="💰" />
        <StatCard label="Days Left" :value="String(daysRemaining)" :color="daysRemaining <= 3 ? 'red' : daysRemaining <= 7 ? 'amber' : 'green'" icon="⏳" />
        <div class="col-span-2 sm:col-span-4 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 text-sm space-y-2">
          <div class="flex justify-between"><span class="text-gray-500">Admin</span><span class="font-semibold">{{ tenant.admin_name }}</span></div>
          <div class="flex justify-between"><span class="text-gray-500">Email</span><span class="font-semibold">{{ tenant.admin_email }}</span></div>
          <div class="flex justify-between"><span class="text-gray-500">Onboarded</span><span class="font-semibold">{{ fmtDate(tenant.onboarded_at) }}</span></div>
          <div class="flex justify-between"><span class="text-gray-500">Trial Ends</span><span class="font-semibold">{{ tenant.trial_ends_at ? fmtDate(tenant.trial_ends_at) : '—' }}</span></div>
          <div class="flex justify-between"><span class="text-gray-500">Sub Ends</span><span class="font-semibold">{{ tenant.subscription_end ? fmtDate(tenant.subscription_end) : '—' }}</span></div>
        </div>
      </div>

      <!-- ===== TAB: SUBSCRIPTION ===== -->
      <div v-if="activeTab === 'subscription'" class="space-y-5">
        <!-- Status Banner -->
        <div :class="['rounded-xl p-4 border-2', statusBannerClass]">
          <div class="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p class="text-xs font-bold uppercase tracking-wider opacity-70">Subscription Status</p>
              <p class="text-2xl font-black mt-0.5">{{ statusLabel }}</p>
              <p class="text-sm mt-1 opacity-80">
                <span v-if="tenant.subscription_status === 'trial'">Trial ends: <strong>{{ tenant.trial_ends_at ? fmtDate(tenant.trial_ends_at) : '—' }}</strong> · <strong>{{ daysRemaining }} days</strong> remaining</span>
                <span v-else-if="tenant.subscription_status === 'active'">Subscription valid until: <strong>{{ tenant.subscription_end ? fmtDate(tenant.subscription_end) : '—' }}</strong> · <strong>{{ daysRemaining }} days</strong> remaining</span>
                <span v-else-if="tenant.subscription_status === 'expired'">Expired on <strong>{{ tenant.trial_ends_at ? fmtDate(tenant.trial_ends_at) : '—' }}</strong>. School is <strong>BLOCKED</strong>.</span>
                <span v-else>Account suspended. School cannot access the system.</span>
              </p>
            </div>
            <StatusPill :status="tenant.subscription_status" size="lg" />
          </div>
        </div>

        <!-- Pricing Calculator -->
        <div class="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <p class="text-xs font-bold uppercase tracking-wider text-amber-700 mb-3">💰 Monthly Bill Calculator</p>
          <div class="flex items-center gap-4 flex-wrap">
            <div class="text-center">
              <p class="text-3xl font-black text-amber-700">{{ monthlyBillDisplay }}</p>
              <p class="text-xs text-amber-600 mt-0.5">{{ tenant.total_students }} students/month</p>
            </div>
            <div class="flex-1 min-w-[200px]">
              <p class="text-xs font-bold text-amber-800">Applied Tier: <span class="text-amber-600">{{ billResult.tier.label }}</span></p>
              <p class="text-xs text-amber-700 mt-0.5">{{ billResult.tier.description }}</p>
            </div>
          </div>
          <!-- Pricing tiers reference -->
          <div class="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            <div v-for="tier in pricingTiers" :key="tier.label"
              :class="['rounded-lg border p-2 text-center text-xs', billResult.tier.label === tier.label ? 'border-amber-500 bg-amber-100 dark:bg-amber-900/40' : 'border-amber-200 dark:border-amber-800']">
              <p class="font-bold text-amber-800 dark:text-amber-400">{{ tier.label }}</p>
              <p class="text-amber-600 dark:text-amber-500">
                {{ tier.ratePerStudent !== null ? '₹' + tier.ratePerStudent + '/student' : 'Contact Us' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Action Controls -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-700">
          <div class="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 rounded-t-xl">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">⚙️ SuperAdmin Controls</p>
          </div>
          <div class="p-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

            <!-- Start Trial -->
            <div class="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
              <p class="text-xs font-bold text-blue-700 mb-2">▶ Start / Reset Trial</p>
              <div class="flex gap-2">
                <input v-model.number="trialDays" type="number" min="1" max="90"
                  class="w-20 rounded border border-blue-300 bg-white px-2 py-1 text-xs dark:border-blue-700 dark:bg-gray-800 dark:text-white" />
                <span class="text-xs text-blue-600 self-center">days</span>
                <button @click="doActivateTrial" class="flex-1 rounded bg-blue-600 px-3 py-1 text-xs font-bold text-white hover:bg-blue-700">Activate</button>
              </div>
            </div>

            <!-- Extend Trial -->
            <div class="rounded-lg border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-800 dark:bg-cyan-900/20">
              <p class="text-xs font-bold text-cyan-700 mb-2">⏰ Extend Trial</p>
              <div class="flex gap-1.5 flex-wrap">
                <button v-for="d in [3, 7, 15, 30]" :key="d" @click="doExtendTrial(d)"
                  class="rounded bg-cyan-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-cyan-700">+{{ d }}d</button>
              </div>
            </div>

            <!-- Upgrade Plan -->
            <div class="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-900/20">
              <p class="text-xs font-bold text-emerald-700 mb-2">⬆ Upgrade / Set Plan</p>
              <div class="flex gap-2 flex-wrap">
                <select v-model="upgradePlanVal" class="flex-1 rounded border border-emerald-300 bg-white px-2 py-1 text-xs dark:border-emerald-700 dark:bg-gray-800 dark:text-white">
                  <option value="basic">Starter (0-500)</option>
                  <option value="standard">Growth (501-1000)</option>
                  <option value="premium">Scale (1001-2000)</option>
                  <option value="enterprise">Enterprise</option>
                </select>
                <select v-model.number="upgradeMonths" class="w-20 rounded border border-emerald-300 bg-white px-2 py-1 text-xs dark:border-emerald-700 dark:bg-gray-800 dark:text-white">
                  <option :value="1">1 mo</option>
                  <option :value="3">3 mo</option>
                  <option :value="6">6 mo</option>
                  <option :value="12">12 mo</option>
                </select>
                <button @click="doUpgradePlan" class="rounded bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-700">Set</button>
              </div>
            </div>

            <!-- Renew Subscription -->
            <div class="rounded-lg border border-indigo-200 bg-indigo-50 p-3 dark:border-indigo-800 dark:bg-indigo-900/20">
              <p class="text-xs font-bold text-indigo-700 mb-2">♻ Renew Subscription</p>
              <div class="flex gap-1.5 flex-wrap">
                <button v-for="m in [1, 3, 6, 12]" :key="m" @click="doRenew(m)"
                  class="rounded bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-indigo-700">+{{ m }}mo</button>
              </div>
            </div>

            <!-- Suspend -->
            <div class="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
              <p class="text-xs font-bold text-red-700 mb-2">🔴 Suspend / Block</p>
              <div class="flex gap-2">
                <button @click="doSuspend" class="flex-1 rounded bg-red-600 px-3 py-1 text-xs font-bold text-white hover:bg-red-700">Suspend Now</button>
                <button @click="doExpire" class="flex-1 rounded bg-gray-600 px-3 py-1 text-xs font-bold text-white hover:bg-gray-700">Mark Expired</button>
              </div>
            </div>

            <!-- Reactivate -->
            <div class="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
              <p class="text-xs font-bold text-green-700 mb-2">✅ Reactivate</p>
              <button @click="doActivate" class="w-full rounded bg-green-600 px-3 py-1 text-xs font-bold text-white hover:bg-green-700">Reactivate School</button>
            </div>

          </div>
        </div>

        <!-- Subscription Audit History -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-700">
          <div class="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 rounded-t-xl">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">📋 Subscription History</p>
          </div>
          <div class="divide-y divide-gray-50 dark:divide-gray-800">
            <div v-if="!history.length" class="p-6 text-center text-sm text-gray-400">No history yet.</div>
            <div v-for="ev in history" :key="ev.id" class="flex items-start gap-3 px-4 py-3">
              <span class="mt-0.5 text-base">{{ eventIcon(ev.action) }}</span>
              <div class="flex-1">
                <p class="text-xs font-bold text-gray-800 dark:text-white capitalize">{{ ev.action.replace(/_/g, ' ') }}</p>
                <p class="text-xs text-gray-500 mt-0.5">{{ ev.note }}</p>
              </div>
              <div class="text-right">
                <p class="text-[10px] text-gray-400">{{ fmtDatetime(ev.performed_at) }}</p>
                <p class="text-[10px] text-gray-500 font-bold">{{ ev.performed_by }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

  <div v-else class="flex items-center justify-center py-20">
    <p class="text-gray-400">Institution not found.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTenantsStore } from '@/stores/tenants'
import { useToastStore } from '@/stores/toast'
import { SUBSCRIPTION_PRICING, TRIAL_DAYS_DEFAULT, calcMonthlyBill } from '@/types'

const route = useRoute()
const router = useRouter()
const tenantStore = useTenantsStore()
const toast = useToastStore()

const slug = computed(() => route.params.slug as string)
const tenant = computed(() => tenantStore.tenants.find((t) => t.slug === slug.value || t.id === slug.value))

// ── Inline mini-components (no template strings) ────────────────

const StatusPill = {
  props: { status: String, size: { type: String, default: 'sm' } },
  setup(props: any) {
    return () => {
      const cfg: Record<string, { label: string; cls: string }> = {
        active:    { label: 'Active',    cls: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
        trial:     { label: 'Trial',     cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
        expired:   { label: 'Expired',   cls: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
        suspended: { label: 'Suspended', cls: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
      }
      const c = cfg[props.status] ?? cfg.suspended
      const sizeClass = props.size === 'lg' ? 'px-4 py-1.5 text-sm' : 'px-2.5 py-0.5 text-[10px]'
      return h('span', { class: `rounded-full font-black uppercase tracking-wider ${sizeClass} ${c.cls}` }, c.label)
    }
  },
}

const StatCard = {
  props: { label: String, value: String, color: String, icon: String },
  setup(props: any) {
    return () => {
      const colorMap: Record<string, string> = {
        blue: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
        emerald: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800',
        amber: 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800',
        green: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
        red: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
      }
      return h('div', { class: `rounded-xl border p-4 text-center ${colorMap[props.color] ?? colorMap.blue}` }, [
        h('div', { class: 'text-2xl mb-1' }, props.icon),
        h('p', { class: 'text-2xl font-black text-gray-800 dark:text-white' }, props.value),
        h('p', { class: 'text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-0.5' }, props.label),
      ])
    }
  },
}

// ── Tabs ───────────────────────────────────────────────────────
const activeTab = ref('subscription')
const tabs = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'subscription', label: 'Subscription', icon: '💳' },
]

// ── Computed ───────────────────────────────────────────────────
const daysRemaining = computed(() => {
  if (!tenant.value) return 0
  return tenantStore.getDaysRemaining(tenant.value)
})

const billResult = computed(() => calcMonthlyBill(tenant.value?.total_students ?? 0))
const monthlyBillDisplay = computed(() => {
  const r = billResult.value
  return r.amount !== null ? '₹' + r.amount.toLocaleString('en-IN') : 'Contact Us'
})

const history = computed(() => tenant.value?.subscription_history ?? [])
const pricingTiers = SUBSCRIPTION_PRICING

const statusLabel = computed(() => {
  const m: Record<string, string> = {
    active: '✅ Active Subscription',
    trial: '🟡 Trial Period',
    expired: '🔴 Expired',
    suspended: '⛔ Suspended',
  }
  return m[tenant.value?.subscription_status ?? ''] ?? 'Unknown'
})

const statusBannerClass = computed(() => {
  const m: Record<string, string> = {
    active: 'bg-green-50 border-green-300 text-green-900 dark:bg-green-900/20 dark:border-green-700 dark:text-green-200',
    trial: 'bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-200',
    expired: 'bg-red-50 border-red-300 text-red-900 dark:bg-red-900/20 dark:border-red-700 dark:text-red-200',
    suspended: 'bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200',
  }
  return m[tenant.value?.subscription_status ?? ''] ?? m.suspended
})

// ── Form state ─────────────────────────────────────────────────
const trialDays = ref(TRIAL_DAYS_DEFAULT)
const upgradePlanVal = ref<'basic' | 'standard' | 'premium' | 'enterprise'>('basic')
const upgradeMonths = ref(12)

// ── Actions ────────────────────────────────────────────────────
function doActivateTrial() {
  if (!tenant.value) return
  if (!confirm(`Start a ${trialDays.value}-day trial for ${tenant.value.name}?`)) return
  tenantStore.activateTrial(tenant.value.id, trialDays.value)
  toast.success(`${trialDays.value}-day trial activated for ${tenant.value.name}`)
}

function doExtendTrial(days: number) {
  if (!tenant.value) return
  tenantStore.extendTrial(tenant.value.id, days)
  toast.success(`Trial extended by ${days} days`)
}

function doUpgradePlan() {
  if (!tenant.value) return
  tenantStore.upgradePlan(tenant.value.id, upgradePlanVal.value, upgradeMonths.value)
  toast.success(`Plan upgraded to ${upgradePlanVal.value} for ${upgradeMonths.value} months`)
}

function doRenew(months: number) {
  if (!tenant.value) return
  tenantStore.renewSubscription(tenant.value.id, months)
  toast.success(`Subscription renewed for ${months} months`)
}

function doSuspend() {
  if (!tenant.value) return
  if (!confirm(`Suspend ${tenant.value.name}? They will be blocked immediately.`)) return
  tenantStore.suspendTenant(tenant.value.id)
  toast.success(`${tenant.value.name} suspended`)
}

function doExpire() {
  if (!tenant.value) return
  if (!confirm(`Mark ${tenant.value.name} as expired?`)) return
  tenantStore.expireTenant(tenant.value.id)
  toast.success(`${tenant.value.name} marked as expired`)
}

async function doActivate() {
  if (!tenant.value) return
  await tenantStore.activateTenant(tenant.value.id)
  toast.success(`${tenant.value.name} reactivated`)
}

// ── Helpers ────────────────────────────────────────────────────
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function fmtDatetime(iso: string) {
  return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function eventIcon(action: string): string {
  const m: Record<string, string> = {
    trial_started: '▶️',
    trial_extended: '⏰',
    plan_upgraded: '⬆️',
    subscription_renewed: '♻️',
    suspended: '🔴',
    activated: '✅',
    expired: '💀',
  }
  return m[action] ?? '📌'
}
</script>

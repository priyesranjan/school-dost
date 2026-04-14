<template>
  <div class="space-y-8">
    <!-- Back -->
    <router-link
      to="/superadmin/institutions"
      class="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
    >
      ← Back to Institutions
    </router-link>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-24">
      <svg class="h-8 w-8 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
      <p class="text-red-400 font-bold">{{ error }}</p>
      <button
        @click="loadTenant"
        class="mt-4 rounded-xl border border-red-500/30 px-6 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
      >
        Retry
      </button>
    </div>

    <template v-else-if="tenant">
      <!-- Hero Header -->
      <div class="relative overflow-hidden rounded-3xl border border-gray-800 bg-gray-900/50 p-8">
        <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r" :class="statusBar"></div>
        <div class="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex items-center gap-5">
            <div
              class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-2xl font-black text-white shadow-lg shadow-violet-500/30"
            >
              {{ tenant.name.charAt(0) }}
            </div>
            <div>
              <h1 class="text-2xl font-black text-white">{{ tenant.name }}</h1>
              <p class="mt-0.5 text-sm text-gray-400">
                {{ tenant.type }} · {{ tenant.board || 'N/A' }} · {{ tenant.city }}, {{ tenant.state }}
              </p>
              <p class="mt-1 font-mono text-xs text-gray-600">{{ tenant.slug }}.yourerp.com</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span
              :class="[
                'inline-flex rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest',
                statusBadge,
              ]"
            >
              {{ tenant.status }}
            </span>
            <button
              v-if="tenant.status !== 'suspended'"
              @click="doSuspend"
              :disabled="actionLoading"
              class="rounded-xl border border-red-500/30 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              Suspend
            </button>
            <button
              v-else
              @click="doActivate"
              :disabled="actionLoading"
              class="rounded-xl border border-emerald-500/30 px-4 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/10 transition-colors disabled:opacity-50"
            >
              Reactivate
            </button>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex items-center border-b border-gray-800">
        <button
          v-for="tab in ['Overview', 'Maintenance & Backups']"
          :key="tab"
          @click="activeTab = tab"
          :class="[
            'px-8 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2',
            activeTab === tab
              ? 'border-violet-500 text-white bg-violet-500/5'
              : 'border-transparent text-gray-500 hover:text-gray-300',
          ]"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Overview Tab -->
      <div v-if="activeTab === 'Overview'" class="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <!-- Stats Row -->
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div v-for="s in statCards" :key="s.label" class="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{{ s.label }}</p>
            <p class="mt-2 text-2xl font-black text-white">{{ s.value }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <!-- Institutional Info -->
          <div class="space-y-6">
            <div class="rounded-3xl border border-gray-800 bg-gray-900/50 p-6 space-y-4">
              <h2 class="text-xs font-black uppercase tracking-widest text-gray-400">Subscription</h2>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-[10px] text-gray-500 uppercase tracking-widest">Plan</p>
                  <p class="mt-1 text-sm font-black text-violet-400 uppercase">{{ tenant.plan }}</p>
                </div>
                <div>
                  <p class="text-[10px] text-gray-500 uppercase tracking-widest">Status</p>
                  <p
                    class="mt-1 text-sm font-black"
                    :class="
                      tenant.status === 'active'
                        ? 'text-emerald-400'
                        : tenant.status === 'trial'
                          ? 'text-amber-400'
                          : 'text-red-400'
                    "
                  >
                    {{ tenant.status }}
                  </p>
                </div>
                <div v-if="tenant.trialEndsAt">
                  <p class="text-[10px] text-gray-500 uppercase tracking-widest">Trial Ends</p>
                  <p class="mt-1 text-sm font-bold text-white">{{ fmtDate(tenant.trialEndsAt) }}</p>
                </div>
                <div>
                  <p class="text-[10px] text-gray-500 uppercase tracking-widest">Onboarded</p>
                  <p class="mt-1 text-sm font-bold text-white">{{ fmtDate(tenant.createdAt) }}</p>
                </div>
              </div>
            </div>

            <div class="rounded-3xl border border-gray-800 bg-gray-900/50 p-6 space-y-4">
              <h2 class="text-xs font-black uppercase tracking-widest text-gray-400">Administrator</h2>
              <div class="flex items-center gap-3">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-700/50 text-sm font-black text-white"
                >
                  {{ tenant.adminName?.charAt(0) || '?' }}
                </div>
                <div>
                  <p class="text-sm font-bold text-white">{{ tenant.adminName }}</p>
                  <p class="text-xs text-gray-400">{{ tenant.adminEmail }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Audit Log -->
          <div class="rounded-3xl border border-gray-800 bg-gray-900/50 p-6 space-y-4">
            <h2 class="text-xs font-black uppercase tracking-widest text-gray-400">Activity Log</h2>
            <div v-if="auditLog.length === 0" class="py-8 text-center text-xs text-gray-600">No audit entries yet.</div>
            <div class="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <div
                v-for="entry in auditLog"
                :key="entry.id"
                class="relative flex gap-4 rounded-2xl border border-gray-800/50 bg-gray-800/30 p-4"
              >
                <div
                  class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm"
                  :class="auditIcon(entry.action).bg"
                >
                  {{ auditIcon(entry.action).icon }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-white">{{ entry.action }}</p>
                  <p v-if="entry.notes" class="mt-0.5 text-[11px] text-gray-500 truncate">{{ entry.notes }}</p>
                  <p class="mt-1 text-[10px] text-gray-600">
                    {{ entry.performedBy }} · {{ fmtDate(entry.performedAt || entry.createdAt) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Maintenance Tab -->
      <div
        v-if="activeTab === 'Maintenance & Backups'"
        class="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500"
      >
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <!-- Control Panel -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Backups Card -->
            <div class="rounded-3xl border border-gray-800 bg-gray-900/50 p-6 space-y-6">
              <div class="flex items-center justify-between">
                <h2 class="text-xs font-black uppercase tracking-widest text-gray-400">Data Preservation</h2>
                <div class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
              <p class="text-xs text-gray-500 leading-relaxed">
                Create a full database snapshot. This includes all students, staff, and financial records.
              </p>
              <button
                @click="takeBackup"
                :disabled="actionLoading"
                class="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-violet-500/20 hover:bg-violet-500 transition-all disabled:opacity-50"
              >
                <span v-if="actionLoading && lastAction === 'backup'">🔄 Processing...</span>
                <span v-else>🛡️ Backup Database Now</span>
              </button>
            </div>

            <!-- Demo Tools Card -->
            <div class="rounded-3xl border border-gray-800 bg-gray-900/50 p-6 space-y-6">
              <h2 class="text-xs font-black uppercase tracking-widest text-gray-400">Development Tools</h2>
              <div class="space-y-4">
                <button
                  @click="seedDemo"
                  :disabled="actionLoading"
                  class="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800 px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-300 hover:bg-gray-700 transition-all disabled:opacity-50"
                >
                  🌱 Seed Sample Data
                </button>
                <button
                  @click="purgeData"
                  :disabled="actionLoading"
                  class="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/5 px-6 py-4 text-xs font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                >
                  💀 Force Wipe Data
                </button>
              </div>
            </div>
          </div>

          <!-- Backup History -->
          <div class="lg:col-span-2 rounded-3xl border border-gray-800 bg-gray-900/50 p-6 space-y-6">
            <h2 class="text-xs font-black uppercase tracking-widest text-gray-400 px-2">Institutional Snapshots</h2>

            <div class="overflow-hidden rounded-2xl border border-gray-800">
              <table class="w-full text-left text-xs">
                <thead class="bg-gray-800/50 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  <tr>
                    <th class="px-6 py-4">Snapshot ID</th>
                    <th class="px-6 py-4">Size</th>
                    <th class="px-6 py-4">Status</th>
                    <th class="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-800">
                  <tr v-for="b in backups" :key="b.id" class="group hover:bg-white/5 transition-colors">
                    <td class="px-6 py-4">
                      <p class="font-bold text-gray-200">{{ fmtDateTime(b.createdAt) }}</p>
                      <p class="mt-0.5 font-mono text-[10px] text-gray-600">{{ b.fileName.split('/').pop() }}</p>
                    </td>
                    <td class="px-6 py-4 text-gray-400">{{ formatSize(b.fileSize) }}</td>
                    <td class="px-6 py-4">
                      <span
                        :class="[
                          'rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter',
                          b.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400',
                        ]"
                      >
                        {{ b.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button
                        v-if="b.status === 'success'"
                        @click="restoreFrom(b)"
                        :disabled="actionLoading"
                        class="rounded-lg bg-gray-800 px-4 py-2 font-black uppercase tracking-widest text-violet-400 transition-all hover:bg-violet-600 hover:text-white disabled:opacity-50"
                      >
                        Restore
                      </button>
                    </td>
                  </tr>
                  <tr v-if="backups.length === 0">
                    <td colspan="4" class="px-6 py-12 text-center text-gray-600 italic">
                      No backups found for this institution.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import { useToastStore } from '@/stores/toast'
import { extractApiErrorMessage } from '@/services/superadminService'

const route = useRoute()
const toast = useToastStore()

const loading = ref(true)
const error = ref('')
const actionLoading = ref(false)
const lastAction = ref('')
const activeTab = ref('Overview')

const tenant = ref<any>(null)
const auditLog = ref<any[]>([])
const backups = ref<any[]>([])

async function loadTenant() {
  loading.value = true
  error.value = ''
  try {
    const res = await api.get(`/superadmin/tenants/${route.params.id}`)
    const data = res.data?.data
    tenant.value = data?.tenant ?? data
    auditLog.value = Array.isArray(data?.auditLogs) ? data.auditLogs : Array.isArray(data?.auditLog) ? data.auditLog : []

    // Fetch backups separately
    await loadBackups()
  } catch (e) {
    error.value = extractApiErrorMessage(e, 'Failed to load institution')
  } finally {
    loading.value = false
  }
}

async function loadBackups() {
  try {
    const res = await api.get(`/backups/${route.params.id}`)
    backups.value = res.data?.data || []
  } catch (e) {
    console.warn('Failed to load backups', e)
  }
}

onMounted(loadTenant)

async function doSuspend() {
  if (!confirm(`Suspend ${tenant.value?.name}? Their users will lose access immediately.`)) return
  actionLoading.value = true
  try {
    await api.post(`/superadmin/tenants/${route.params.id}/suspend`)
    tenant.value.status = 'suspended'
    toast.warning(`${tenant.value.name} suspended`)
  } catch (e) {
    toast.error(extractApiErrorMessage(e, 'Failed to suspend'))
  } finally {
    actionLoading.value = false
  }
}

async function doActivate() {
  actionLoading.value = true
  try {
    await api.post(`/superadmin/tenants/${route.params.id}/activate`)
    tenant.value.status = 'active'
    toast.success(`${tenant.value.name} reactivated`)
  } catch (e) {
    toast.error(extractApiErrorMessage(e, 'Failed to reactivate'))
  } finally {
    actionLoading.value = false
  }
}

// ── Maintenance Actions ─────────────────────────────────────────────

async function seedDemo() {
  if (!confirm('Populate with demo data? This is for testing only.')) return
  actionLoading.value = true
  lastAction.value = 'seed'
  try {
    // We need to pass the tenant-slug for requireSchoolContext
    await api.post(
      '/maintenance/seed-demo',
      {},
      {
        headers: { 'x-tenant-slug': tenant.value.slug },
      },
    )
    toast.success('Institution seeded with sample records.')
    await loadTenant()
  } catch (e) {
    toast.error(extractApiErrorMessage(e, 'Seeding failed'))
  } finally {
    actionLoading.value = false
  }
}

async function purgeData() {
  if (!confirm('DANGER: This will WIPE ALL transactional data for this institution. Are you absolutely certain?'))
    return
  if (!confirm('FINAL WARNING: This action cannot be undone unless you have a backup.')) return
  actionLoading.value = true
  lastAction.value = 'purge'
  try {
    await api.post(
      '/maintenance/clear-data',
      {},
      {
        headers: { 'x-tenant-slug': tenant.value.slug },
      },
    )
    toast.warning('All institutional records have been cleared.')
    await loadTenant()
  } catch (e) {
    toast.error(extractApiErrorMessage(e, 'Purge failed'))
  } finally {
    actionLoading.value = false
  }
}

async function takeBackup() {
  actionLoading.value = true
  lastAction.value = 'backup'
  try {
    await api.post(`/backups/${route.params.id}`)
    toast.success('Snapshot created successfully.')
    await loadBackups()
  } catch (e) {
    toast.error(extractApiErrorMessage(e, 'Backup failed'))
  } finally {
    actionLoading.value = false
  }
}

async function restoreFrom(backup: any) {
  if (!confirm(`Restore to snapshot from ${fmtDateTime(backup.createdAt)}?`)) return
  if (!confirm('DANGER: This will OVERWRITE the current database with the backup data.')) return
  actionLoading.value = true
  lastAction.value = 'restore'
  try {
    await api.post(`/backups/${route.params.id}/restore/${backup.id}`)
    toast.success('Database restored successfully.')
    await loadTenant()
  } catch (e) {
    toast.error(extractApiErrorMessage(e, 'Restore failed'))
  } finally {
    actionLoading.value = false
  }
}

// ── Helpers ─────────────────────────────────────────────────────────

const statusBadge = computed(() => {
  if (!tenant.value) return ''
  const s = tenant.value.status
  if (s === 'active') return 'bg-emerald-500/10 text-emerald-400'
  if (s === 'trial') return 'bg-amber-500/10 text-amber-400'
  return 'bg-red-500/10 text-red-400'
})

const statusBar = computed(() => {
  if (!tenant.value) return ''
  const s = tenant.value.status
  if (s === 'active') return 'from-emerald-500 to-teal-500'
  if (s === 'trial') return 'from-amber-500 to-orange-500'
  return 'from-red-500 to-rose-500'
})

const statCards = computed(() =>
  tenant.value
    ? [
        { label: 'Total Students', value: (tenant.value.totalStudents ?? 0).toLocaleString('en-IN') },
        { label: 'Total Staff', value: (tenant.value.totalStaff ?? 0).toLocaleString('en-IN') },
        { label: 'Plan', value: (tenant.value.plan ?? 'N/A').toUpperCase() },
        { label: 'Inst. Code', value: tenant.value.institutionCode || 'N/A' },
      ]
    : [],
)

function fmtDate(iso: string | undefined): string {
  if (!iso) return 'N/A'
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function fmtDateTime(iso: string | undefined): string {
  if (!iso) return 'N/A'
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatSize(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function auditIcon(action: string): { icon: string; bg: string } {
  if (action === 'ONBOARD') return { icon: '🚀', bg: 'bg-violet-500/10' }
  if (action === 'SUSPEND') return { icon: '🔴', bg: 'bg-red-500/10' }
  if (action === 'ACTIVATE') return { icon: '✅', bg: 'bg-emerald-500/10' }
  if (action === 'PLAN_CHANGE') return { icon: '⚡', bg: 'bg-amber-500/10' }
  if (action.includes('backup')) return { icon: '🛡️', bg: 'bg-indigo-500/10' }
  if (action.includes('maintenance')) return { icon: '🛠️', bg: 'bg-amber-500/10' }
  return { icon: '📋', bg: 'bg-gray-700/50' }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.2);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 92, 246, 0.4);
}
</style>

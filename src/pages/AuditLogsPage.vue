<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
      <StatCard title="Total Logs" :value="auditStore.logs.length" icon="🧾" icon-bg="bg-blue-50" />
      <StatCard title="Date Range Events" :value="rangeCount" icon="📅" icon-bg="bg-green-50" />
      <StatCard title="Top Actor Events" :value="topActorCount" icon="👤" icon-bg="bg-amber-50" />
      <StatCard title="Visible Rows" :value="filteredLogs.length" icon="🔎" icon-bg="bg-purple-50" />
    </div>

    <div
      class="rounded-lg border p-3 text-sm"
      :class="integrity.ok ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300' : 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-300'"
    >
      <p>
        {{ integrity.ok ? 'Audit signature chain is valid.' : 'Audit chain integrity issue detected.' }}
      </p>
      <p v-if="!integrity.ok" class="mt-1 text-xs">{{ integrity.issues[0] }}</p>
    </div>

    <AppCard title="Audit Log Register" :no-padding="true">
      <div class="flex flex-col gap-3 border-b border-gray-100 dark:border-gray-700 p-4 sm:flex-row sm:items-end">
        <div class="sm:w-64">
          <AppInput v-model="moduleFilter" type="select" label="Module">
            <option value="">All Modules</option>
            <option value="notices">Notices</option>
            <option value="timetable">Timetable</option>
            <option value="certificates">Certificates</option>
          </AppInput>
        </div>
        <div class="sm:w-64">
          <AppInput v-model="search" label="Search" placeholder="Action, target, actor" />
        </div>
        <div class="sm:w-44">
          <AppInput v-model="fromDate" type="date" label="From" />
        </div>
        <div class="sm:w-44">
          <AppInput v-model="toDate" type="date" label="To" />
        </div>
        <div class="sm:ml-auto">
          <div class="flex items-center gap-2">
            <AppButton variant="secondary" @click="exportCsv">Export CSV</AppButton>
            <AppButton variant="secondary" @click="printReport">Print Report</AppButton>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="border-y border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <th class="px-4 py-2 font-medium text-gray-500 dark:text-gray-400">When</th>
              <th class="px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Module</th>
              <th class="px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Action</th>
              <th class="px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Actor</th>
              <th class="px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Target</th>
              <th class="px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Metadata</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-700">
            <tr v-for="l in pagedLogs" :key="l.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-700/50">
              <td class="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">{{ l.created_at }}</td>
              <td class="px-4 py-2 text-gray-600 dark:text-gray-300">{{ l.module }}</td>
              <td class="px-4 py-2 font-medium text-gray-900 dark:text-white">{{ l.action }}</td>
              <td class="px-4 py-2 text-gray-600 dark:text-gray-300">{{ l.actor_name }} ({{ l.actor_role }})</td>
              <td class="px-4 py-2 text-gray-600 dark:text-gray-300">{{ l.target }}</td>
              <td class="px-4 py-2 text-gray-600 dark:text-gray-300">{{ renderMetadata(l.metadata) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="filteredLogs.length" class="flex items-center justify-between border-t border-gray-100 p-3 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <div class="flex items-center gap-2">
          <AppButton size="sm" variant="secondary" :disabled="currentPage <= 1" @click="currentPage -= 1">Prev</AppButton>
          <AppButton size="sm" variant="secondary" :disabled="currentPage >= totalPages" @click="currentPage += 1">Next</AppButton>
        </div>
      </div>
      <EmptyState v-if="!filteredLogs.length" title="No audit logs" message="No entries match your filter" />
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAuditStore } from '@/stores/audit'
import { useToastStore } from '@/stores/toast'
import { exportToCsv } from '@/utils/export'
import StatCard from '@/components/ui/StatCard.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const auditStore = useAuditStore()
const toast = useToastStore()
const auth = useAuthStore()

const moduleFilter = ref('')
const search = ref('')
const fromDate = ref('')
const toDate = ref('')
const currentPage = ref(1)
const pageSize = 25

const integrity = computed(() => auditStore.verifyIntegrity())

function parseDate(value: string) {
  const ts = Date.parse(value)
  if (!Number.isNaN(ts)) return new Date(ts)
  return null
}

function inRange(value: string) {
  const dt = parseDate(value)
  if (!dt) return false
  if (fromDate.value) {
    const from = new Date(`${fromDate.value}T00:00:00`)
    if (dt < from) return false
  }
  if (toDate.value) {
    const to = new Date(`${toDate.value}T23:59:59`)
    if (dt > to) return false
  }
  return true
}

const filteredLogs = computed(() => {
  const q = search.value.trim().toLowerCase()
  return auditStore.logs.filter((l) => {
    if (moduleFilter.value && l.module !== moduleFilter.value) return false
    if ((fromDate.value || toDate.value) && !inRange(l.created_at)) return false
    if (!q) return true
    return [l.action, l.actor_name, l.target, l.metadata].some((v) => v.toLowerCase().includes(q))
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredLogs.value.length / pageSize)))
const pagedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredLogs.value.slice(start, start + pageSize)
})

const canViewMetadata = computed(() => auth.user?.role === 'admin')

function renderMetadata(value: string) {
  if (canViewMetadata.value) return value
  return '[Restricted]'
}

const rangeCount = computed(() => filteredLogs.value.length)

const topActorCount = computed(() => {
  if (!filteredLogs.value.length) return 0
  const freq = new Map<string, number>()
  for (const row of filteredLogs.value) {
    freq.set(row.actor_name, (freq.get(row.actor_name) || 0) + 1)
  }
  return Math.max(...freq.values())
})

const topActorName = computed(() => {
  if (!filteredLogs.value.length) return 'N/A'
  const freq = new Map<string, number>()
  for (const row of filteredLogs.value) {
    freq.set(row.actor_name, (freq.get(row.actor_name) || 0) + 1)
  }
  let best = 'N/A'
  let bestCount = 0
  for (const [name, count] of freq.entries()) {
    if (count > bestCount) {
      best = name
      bestCount = count
    }
  }
  return best
})

watch([moduleFilter, search, fromDate, toDate], () => {
  currentPage.value = 1
})

watch(totalPages, (val) => {
  if (currentPage.value > val) currentPage.value = val
})

function exportCsv() {
  const rows = filteredLogs.value
  if (!rows.length) {
    toast.warning('No logs to export')
    return
  }

  const header = ['created_at', 'module', 'action', 'actor_name', 'actor_role', 'target', 'metadata']
  const body = rows.map((r) => [r.created_at, r.module, r.action, r.actor_name, r.actor_role, r.target, renderMetadata(r.metadata)])
  exportToCsv('audit_logs', header, body)
}

function printReport() {
  if (!filteredLogs.value.length) {
    toast.warning('No logs to print')
    return
  }

  const rowsHtml = filteredLogs.value
    .map(
      (r) => `<tr><td>${r.created_at}</td><td>${r.module}</td><td>${r.action}</td><td>${r.actor_name}</td><td>${r.target}</td><td>${r.hash}</td></tr>`,
    )
    .join('')

  const w = window.open('', '_blank')
  if (!w) {
    toast.warning('Popup blocked. Please allow popups to print.')
    return
  }

  w.document.write(`
    <html>
      <head>
        <title>Audit Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 16px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
          th { background: #f3f4f6; }
          .meta { margin-bottom: 12px; }
        </style>
      </head>
      <body>
        <h2>ERP Audit Report</h2>
        <div class="meta">Generated at: ${new Date().toLocaleString()}</div>
        <div class="meta">Integrity: ${integrity.value.ok ? 'VALID' : 'CHECK FAILED'}</div>
        <div class="meta">Top actor: ${topActorName.value} (${topActorCount.value} events)</div>
        <table>
          <thead>
            <tr>
              <th>When</th>
              <th>Module</th>
              <th>Action</th>
              <th>Actor</th>
              <th>Target</th>
              <th>Hash</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </body>
    </html>
  `)
  w.document.close()
  w.focus()
  w.print()
}
</script>

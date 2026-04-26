<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
      <StatCard title="System Alerts" :value="systemAlerts.length" icon="🚨" icon-bg="bg-red-50" />
      <StatCard title="Critical (7d)" :value="criticalCount7d" icon="⛔" icon-bg="bg-rose-50" />
      <StatCard title="MTTA (min)" :value="mttaMinutes" icon="⏱" icon-bg="bg-amber-50" />
      <StatCard title="SLA Compliance %" :value="slaCompliancePct" icon="✅" icon-bg="bg-emerald-50" />
    </div>

    <div class="rounded-2xl border border-sky-100 bg-sky-50/60 p-4 dark:border-sky-900/40 dark:bg-sky-900/10">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-xs font-black uppercase tracking-widest text-sky-700 dark:text-sky-300">Ops Intelligence Mode</p>
          <p class="mt-1 text-sm font-medium text-sky-900 dark:text-sky-100">
            {{ isLiveMode ? 'Live backend alerts' : 'Local fallback alerts' }}
          </p>
          <p class="text-xs text-sky-700/80 dark:text-sky-300/80">
            Window: last {{ livePeriodDays }} days
            <span v-if="liveGeneratedAtLabel"> · Updated {{ liveGeneratedAtLabel }}</span>
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span
            :class="[
              'rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest',
              isLiveMode
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
            ]"
          >
            {{ liveLoading ? 'Refreshing' : isLiveMode ? 'API Live' : 'Fallback' }}
          </span>
          <AppButton size="sm" variant="secondary" :disabled="liveLoading" @click="refreshLiveAlerts">
            Refresh
          </AppButton>
        </div>
      </div>
      <p v-if="liveError" class="mt-2 text-xs font-medium text-amber-700 dark:text-amber-300">{{ liveError }}</p>
    </div>

    <AppCard title="Weekly Analytics">
      <p class="mb-3 text-xs text-gray-500 dark:text-gray-400">Top source: {{ topSourceLabel }}</p>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <p class="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Severity Trend (7d)</p>
          <ul class="space-y-1 text-sm text-gray-600 dark:text-gray-300">
            <li v-for="s in severityTrend" :key="s.severity" class="flex items-center justify-between">
              <span class="capitalize">{{ s.severity }}</span>
              <span class="font-medium">{{ s.count }}</span>
            </li>
          </ul>
        </div>
        <div>
          <p class="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Source Trend (Top 5, 7d)</p>
          <ul class="space-y-1 text-sm text-gray-600 dark:text-gray-300">
            <li v-for="s in sourceTrend" :key="s.source" class="flex items-center justify-between">
              <span class="truncate">{{ s.source }}</span>
              <span class="font-medium">{{ s.count }}</span>
            </li>
          </ul>
        </div>
        <div>
          <p class="mb-2 text-sm font-semibold text-gray-900 dark:text-white">SLA Response Buckets</p>
          <ul class="space-y-1 text-sm text-gray-600 dark:text-gray-300">
            <li v-for="b in responseBuckets" :key="b.label" class="flex items-center justify-between">
              <span>{{ b.label }}</span>
              <span class="font-medium">{{ b.count }}</span>
            </li>
          </ul>
          <p class="mt-3 text-xs text-rose-600 dark:text-rose-300">Breaches (7d): {{ slaBreachCount }}</p>
        </div>
      </div>
    </AppCard>

    <AppCard title="Ops Alerts" :no-padding="true">
      <div class="flex flex-col gap-3 border-b border-gray-100 p-4 dark:border-gray-700 sm:flex-row sm:items-end">
        <div class="sm:w-56">
          <AppInput v-model="severityFilter" type="select" label="Severity">
            <option value="">All</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </AppInput>
        </div>
        <div class="sm:w-56">
          <AppInput v-model="stateFilter" type="select" label="State">
            <option value="">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="snoozed">Snoozed</option>
          </AppInput>
        </div>
        <div class="sm:w-64">
          <AppInput v-model="query" label="Search" placeholder="Title or message" />
        </div>
        <div class="sm:ml-auto">
          <div class="flex items-center gap-2">
            <AppButton size="sm" variant="secondary" :disabled="!selectedIds.length" @click="ackSelected">Acknowledge Selected</AppButton>
            <AppButton size="sm" variant="secondary" :disabled="!selectedIds.length" @click="snoozeSelected(60)">Snooze 1h</AppButton>
            <AppButton size="sm" variant="secondary" @click="exportFiltered">Export</AppButton>
            <AppButton size="sm" variant="secondary" @click="exportWeeklySummary">Weekly Summary</AppButton>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="border-y border-gray-100 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50">
              <th class="px-4 py-2"><input type="checkbox" :checked="allSelected" @change="toggleSelectAll" /></th>
              <th class="px-4 py-2 font-medium text-gray-500 dark:text-gray-400">When</th>
              <th class="px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Severity</th>
              <th class="px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Title</th>
              <th class="px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Source</th>
              <th class="px-4 py-2 font-medium text-gray-500 dark:text-gray-400">State</th>
              <th class="px-4 py-2 font-medium text-gray-500 dark:text-gray-400">SLA</th>
              <th class="px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Ack At</th>
              <th class="px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-700">
            <tr v-for="n in filteredAlerts" :key="n.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-700/50">
              <td class="px-4 py-2"><input type="checkbox" :checked="selectedIds.includes(n.id)" @change="toggleSelect(n.id)" /></td>
              <td class="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">{{ new Date(n.timestamp).toLocaleString() }}</td>
              <td class="px-4 py-2">
                <span class="rounded px-1.5 py-0.5 text-[10px] font-semibold" :class="severityClass(n.severity)">{{ n.severity || 'info' }}</span>
              </td>
              <td class="px-4 py-2">
                <p class="font-medium text-gray-900 dark:text-white">{{ n.title }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ n.message }}</p>
              </td>
              <td class="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">{{ n.source_key || '-' }}</td>
              <td class="px-4 py-2 text-xs text-gray-600 dark:text-gray-300">{{ alertState(n) }}</td>
              <td class="px-4 py-2 text-xs" :class="isSlaBreached(n) ? 'text-rose-600 dark:text-rose-300' : 'text-emerald-600 dark:text-emerald-300'">
                {{ slaStatusLabel(n) }}
              </td>
              <td class="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">{{ n.acknowledged_at ? new Date(n.acknowledged_at).toLocaleString() : '-' }}</td>
              <td class="px-4 py-2">
                <div class="flex items-center gap-2 text-xs">
                  <button class="text-primary-600 hover:underline" @click="ack(n.id)">Acknowledge</button>
                  <button class="text-gray-500 hover:underline" @click="snoozeSingle(n.id, 60)">Snooze</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between border-t border-gray-100 p-3 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ selectedIds.length }} selected</p>
        <AppButton size="sm" variant="secondary" @click="clearResolved">Clear Read Alerts</AppButton>
      </div>

      <EmptyState v-if="!filteredAlerts.length" title="No alerts" message="No ops alerts match your filters" />
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useNotificationStore, type Notification } from '@/stores/notifications'
import { useSettingsStore } from '@/stores/settings'
import { useToastStore } from '@/stores/toast'
import { opsAlertsService } from '@/services/opsAlertsService'
import { exportToCsv } from '@/utils/export'
import type { OpsAlertItem } from '@/types'
import AppCard from '@/components/ui/AppCard.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import StatCard from '@/components/ui/StatCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const notifStore = useNotificationStore()
const settingsStore = useSettingsStore()
const toast = useToastStore()

const severityFilter = ref('')
const stateFilter = ref('')
const query = ref('')
const selectedIds = ref<number[]>([])
const liveAlerts = ref<OpsAlertItem[]>([])
const liveLoading = ref(false)
const liveError = ref<string | null>(null)
const liveGeneratedAt = ref<string | null>(null)
const livePeriodDays = ref(7)
const runtimeState = ref<Record<number, { read: boolean; muted_until: string | null; acknowledged_at: string | null }>>({})
const clearedIds = ref<number[]>([])
let refreshHandle: ReturnType<typeof setInterval> | null = null

const isLiveMode = computed(() => liveAlerts.value.length > 0)

function normalizeSystemAlert(alert: {
  id: number
  title: string
  message: string
  read: boolean
  timestamp: string
  severity?: string | null
  source_key?: string | null
  muted_until?: string | null
  acknowledged_at?: string | null
}): OpsAlertItem {
  const severity = alert.severity === 'critical' || alert.severity === 'warning' || alert.severity === 'info'
    ? alert.severity
    : 'info'

  return {
    id: alert.id,
    type: 'system',
    title: alert.title,
    message: alert.message,
    read: Boolean(alert.read),
    timestamp: alert.timestamp,
    severity,
    source_key: alert.source_key || null,
    muted_until: alert.muted_until || null,
    acknowledged_at: alert.acknowledged_at || null,
  }
}

const fallbackAlerts = computed(() =>
  notifStore.notifications
    .filter((n) => n.type === 'system')
    .map((n) => normalizeSystemAlert(n as Notification)),
)

const baseAlerts = computed(() => (isLiveMode.value ? liveAlerts.value : fallbackAlerts.value))

const systemAlerts = computed(() => {
  return baseAlerts.value
    .map((n) => {
      const override = runtimeState.value[n.id]
      if (!override) return n
      return {
        ...n,
        read: override.read,
        muted_until: override.muted_until,
        acknowledged_at: override.acknowledged_at,
      }
    })
    .filter((n) => !clearedIds.value.includes(n.id))
})

const liveGeneratedAtLabel = computed(() => {
  if (!liveGeneratedAt.value) return ''
  return new Date(liveGeneratedAt.value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
})

async function loadLiveAlerts() {
  liveLoading.value = true
  liveError.value = null
  try {
    const response = await opsAlertsService.getSnapshot(7, 200)
    liveAlerts.value = (response.data.alerts || []).map((item) => normalizeSystemAlert(item))
    liveGeneratedAt.value = response.data.generated_at
    livePeriodDays.value = response.data.period_days

    const idSet = new Set(liveAlerts.value.map((a) => a.id))
    runtimeState.value = Object.fromEntries(
      Object.entries(runtimeState.value).filter(([id]) => idSet.has(Number(id))),
    )
    clearedIds.value = clearedIds.value.filter((id) => idSet.has(id))
  } catch {
    liveAlerts.value = []
    liveGeneratedAt.value = null
    liveError.value = 'Unable to load backend ops alerts right now. Using local alerts.'
  } finally {
    liveLoading.value = false
  }
}

async function refreshLiveAlerts() {
  await loadLiveAlerts()
}

function applyRuntime(ids: number[], kind: 'ack' | 'snooze', minutes = 60) {
  const now = new Date().toISOString()
  const muteUntil = kind === 'snooze' ? new Date(Date.now() + minutes * 60000).toISOString() : null

  for (const id of ids) {
    const current = runtimeState.value[id] || { read: false, muted_until: null, acknowledged_at: null }
    runtimeState.value[id] = {
      read: true,
      muted_until: muteUntil ?? current.muted_until,
      acknowledged_at: current.acknowledged_at || now,
    }
  }
}

onMounted(() => {
  void loadLiveAlerts()
  refreshHandle = setInterval(() => {
    void loadLiveAlerts()
  }, 120000)
})

onUnmounted(() => {
  if (refreshHandle) {
    clearInterval(refreshHandle)
    refreshHandle = null
  }
})

const slaTargetsMinutes = computed<Record<'critical' | 'warning' | 'info', number>>(() => ({
  critical: normalizePolicyMinutes(settingsStore.settings.sla_critical_minutes, 15),
  warning: normalizePolicyMinutes(settingsStore.settings.sla_warning_minutes, 60),
  info: normalizePolicyMinutes(settingsStore.settings.sla_info_minutes, 240),
}))

const unreadSystemCount = computed(() => systemAlerts.value.filter((n) => !n.read).length)
const windowStart = computed(() => Date.now() - 7 * 24 * 60 * 60 * 1000)
const alerts7d = computed(() => systemAlerts.value.filter((n) => new Date(n.timestamp).getTime() >= windowStart.value))

const criticalCount7d = computed(() => alerts7d.value.filter((n) => n.severity === 'critical').length)

const severityTrend = computed(() => {
  const counts = { critical: 0, warning: 0, info: 0 }
  for (const a of alerts7d.value) {
    const sev = a.severity || 'info'
    counts[sev] += 1
  }
  return [
    { severity: 'critical', count: counts.critical },
    { severity: 'warning', count: counts.warning },
    { severity: 'info', count: counts.info },
  ]
})

const sourceTrend = computed(() => {
  const freq = new Map<string, number>()
  for (const a of alerts7d.value) {
    const key = a.source_key || 'unknown'
    freq.set(key, (freq.get(key) || 0) + 1)
  }
  return [...freq.entries()]
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
})

const topSourceLabel = computed(() => sourceTrend.value[0]?.source || 'none')
const topSourceCount = computed(() => sourceTrend.value[0]?.count || 0)

const mttaMinutes = computed(() => {
  const resolved = alerts7d.value.filter((a) => a.acknowledged_at)
  if (!resolved.length) return 0
  const totalMs = resolved.reduce((sum, a) => sum + (new Date(a.acknowledged_at as string).getTime() - new Date(a.timestamp).getTime()), 0)
  return Math.max(0, Math.round(totalMs / resolved.length / 60000))
})

function alertSeverity(n: (typeof systemAlerts.value)[number]) {
  return (n.severity || 'info') as 'critical' | 'warning' | 'info'
}

function elapsedMinutes(n: (typeof systemAlerts.value)[number]) {
  const start = new Date(n.timestamp).getTime()
  const end = n.acknowledged_at ? new Date(n.acknowledged_at).getTime() : Date.now()
  return Math.max(0, Math.round((end - start) / 60000))
}

function isSlaBreached(n: (typeof systemAlerts.value)[number]) {
  const target = slaTargetsMinutes.value[alertSeverity(n)]
  return elapsedMinutes(n) > target
}

function slaStatusLabel(n: (typeof systemAlerts.value)[number]) {
  const target = slaTargetsMinutes.value[alertSeverity(n)]
  const elapsed = elapsedMinutes(n)
  const state = isSlaBreached(n) ? 'Breach' : 'Within SLA'
  return `${state} (${elapsed}/${target}m)`
}

const slaBreachCount = computed(() => alerts7d.value.filter((n) => isSlaBreached(n)).length)
const slaCompliancePct = computed(() => {
  if (!alerts7d.value.length) return 100
  const good = alerts7d.value.length - slaBreachCount.value
  return Math.max(0, Math.min(100, Math.round((good / alerts7d.value.length) * 100)))
})

const responseBuckets = computed(() => {
  const resolved = alerts7d.value.filter((n) => n.acknowledged_at)
  const criticalCap = slaTargetsMinutes.value.critical
  const warningCap = Math.max(criticalCap + 1, slaTargetsMinutes.value.warning)
  const infoCap = Math.max(warningCap + 1, slaTargetsMinutes.value.info)
  let withinCritical = 0
  let withinWarning = 0
  let withinInfo = 0
  let aboveInfo = 0

  for (const n of resolved) {
    const minutes = elapsedMinutes(n)
    if (minutes <= criticalCap) withinCritical += 1
    else if (minutes <= warningCap) withinWarning += 1
    else if (minutes <= infoCap) withinInfo += 1
    else aboveInfo += 1
  }

  return [
    { label: `<= ${criticalCap}m`, count: withinCritical },
    { label: `${criticalCap + 1}m - ${warningCap}m`, count: withinWarning },
    { label: `${warningCap + 1}m - ${infoCap}m`, count: withinInfo },
    { label: `> ${infoCap}m`, count: aboveInfo },
  ]
})

function normalizePolicyMinutes(value: number | string, fallback: number) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.max(1, Math.round(parsed))
}

function alertState(n: (typeof systemAlerts.value)[number]) {
  if (n.muted_until && Date.now() < new Date(n.muted_until).getTime()) return 'Snoozed'
  return n.read ? 'Read' : 'Unread'
}

function severityClass(severity: string | undefined) {
  if (severity === 'critical') return 'bg-red-100 text-red-700'
  if (severity === 'warning') return 'bg-amber-100 text-amber-700'
  return 'bg-blue-100 text-blue-700'
}

const filteredAlerts = computed(() => {
  const q = query.value.trim().toLowerCase()
  return systemAlerts.value.filter((n) => {
    if (severityFilter.value && (n.severity || 'info') !== severityFilter.value) return false
    if (stateFilter.value) {
      const state = alertState(n).toLowerCase()
      if (stateFilter.value === 'snoozed' && state !== 'snoozed') return false
      if (stateFilter.value === 'read' && state !== 'read') return false
      if (stateFilter.value === 'unread' && state !== 'unread') return false
    }
    if (!q) return true
    return [n.title, n.message, n.source_key || ''].some((v) => v.toLowerCase().includes(q))
  })
})

const allSelected = computed(() => filteredAlerts.value.length > 0 && filteredAlerts.value.every((n) => selectedIds.value.includes(n.id)))

function toggleSelect(id: number) {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter((x) => x !== id)
  } else {
    selectedIds.value = [...selectedIds.value, id]
  }
}

function toggleSelectAll(event: Event) {
  const checked = (event.target as HTMLInputElement).checked
  if (!checked) {
    selectedIds.value = []
    return
  }
  selectedIds.value = filteredAlerts.value.map((n) => n.id)
}

function ack(id: number) {
  if (isLiveMode.value) {
    applyRuntime([id], 'ack')
    return
  }
  notifStore.acknowledge(id)
}

function snoozeSingle(id: number, minutes: number) {
  if (isLiveMode.value) {
    applyRuntime([id], 'snooze', minutes)
    return
  }
  notifStore.snooze(id, minutes)
}

function ackSelected() {
  if (!selectedIds.value.length) return
  if (isLiveMode.value) {
    applyRuntime(selectedIds.value, 'ack')
  } else {
    notifStore.acknowledgeMany(selectedIds.value)
  }
  toast.success('Selected alerts acknowledged')
}

function snoozeSelected(minutes: number) {
  if (!selectedIds.value.length) return
  if (isLiveMode.value) {
    applyRuntime(selectedIds.value, 'snooze', minutes)
  } else {
    notifStore.snoozeMany(selectedIds.value, minutes)
  }
  toast.success(`Selected alerts snoozed for ${minutes} minutes`)
}

function clearResolved() {
  if (isLiveMode.value) {
    const readIds = systemAlerts.value.filter((n) => n.read).map((n) => n.id)
    if (readIds.length === 0) {
      toast.warning('No read alerts to clear')
      return
    }
    clearedIds.value = [...new Set([...clearedIds.value, ...readIds])]
    selectedIds.value = selectedIds.value.filter((id) => !readIds.includes(id))
    toast.success('Read alerts hidden from current snapshot')
    return
  }

  notifStore.clearReadSystemAlerts()
  selectedIds.value = []
  toast.success('Read alerts cleared')
}

function exportFiltered() {
  if (!filteredAlerts.value.length) {
    toast.warning('No alerts to export')
    return
  }
  const header = ['timestamp', 'severity', 'title', 'message', 'source_key', 'state', 'sla_status']
  const rows = filteredAlerts.value.map((n) => [
    n.timestamp,
    n.severity || 'info',
    n.title,
    n.message,
    n.source_key || '-',
    alertState(n),
    slaStatusLabel(n),
  ])
  exportToCsv('ops_alerts', header, rows)
}

function exportWeeklySummary() {
  const header = ['metric', 'value']
  const rows: (string | number)[][] = [
    ['alerts_7d_total', alerts7d.value.length],
    ['alerts_7d_critical', criticalCount7d.value],
    ['alerts_7d_unread', unreadSystemCount.value],
    ['mtta_minutes', mttaMinutes.value],
    ['sla_compliance_pct', slaCompliancePct.value],
    ['sla_breach_count', slaBreachCount.value],
    ['sla_policy_version', settingsStore.settings.sla_policy_version],
    ['sla_policy_updated_at', settingsStore.settings.sla_policy_updated_at],
    ['sla_target_critical_minutes', slaTargetsMinutes.value.critical],
    ['sla_target_warning_minutes', slaTargetsMinutes.value.warning],
    ['sla_target_info_minutes', slaTargetsMinutes.value.info],
    ['top_source', topSourceLabel.value],
    ['top_source_count', topSourceCount.value],
  ]

  for (const s of severityTrend.value) {
    rows.push([`severity_${s.severity}`, s.count])
  }
  for (const s of sourceTrend.value) {
    rows.push([`source_${s.source}`, s.count])
  }
  for (const b of responseBuckets.value) {
    rows.push([`response_bucket_${b.label}`, b.count])
  }

  exportToCsv('ops_alerts_weekly_summary', header, rows)
}
</script>

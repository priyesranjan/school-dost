<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-gray-900 dark:text-white">Smart Alerts Engine</h1>
        <p class="text-sm text-gray-500 mt-1">
          Automated rule-based alerts. Configure thresholds and review active triggers.
        </p>
      </div>
      <button
        @click="addCustomAlert"
        class="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-black text-white hover:bg-primary-700 transition-colors flex items-center gap-2"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Alert Rule
      </button>
    </div>

    <!-- Active Alert Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div class="rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 p-4">
        <p class="text-2xl font-black text-red-600">{{ criticalAlerts.length }}</p>
        <p class="text-xs font-bold text-red-400 uppercase tracking-wide mt-0.5">Critical</p>
      </div>
      <div class="rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 p-4">
        <p class="text-2xl font-black text-amber-600">{{ warningAlerts.length }}</p>
        <p class="text-xs font-bold text-amber-400 uppercase tracking-wide mt-0.5">Warnings</p>
      </div>
      <div class="rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 p-4">
        <p class="text-2xl font-black text-blue-600">{{ infoAlerts.length }}</p>
        <p class="text-xs font-bold text-blue-400 uppercase tracking-wide mt-0.5">Info</p>
      </div>
      <div class="rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 p-4">
        <p class="text-2xl font-black text-green-600">{{ acknowledgedCount }}</p>
        <p class="text-xs font-bold text-green-400 uppercase tracking-wide mt-0.5">Resolved</p>
      </div>
    </div>

    <!-- Active Alerts Feed -->
    <div class="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <h2 class="text-base font-black text-gray-900 dark:text-white">Active Alerts</h2>
        <div class="flex gap-2">
          <button
            v-for="f in ['all', 'critical', 'warning', 'info']"
            :key="f"
            @click="activeFilter = f"
            :class="[
              'rounded-lg px-3 py-1.5 text-xs font-bold transition-colors',
              activeFilter === f
                ? 'bg-primary-600 text-white'
                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700',
            ]"
          >
            {{ f.charAt(0).toUpperCase() + f.slice(1) }}
          </button>
        </div>
      </div>

      <div class="divide-y divide-gray-50 dark:divide-gray-700">
        <div v-if="filteredActiveAlerts.length === 0" class="py-12 text-center text-sm text-gray-400">
          No active alerts matching filter.
        </div>
        <div
          v-for="alert in filteredActiveAlerts"
          :key="alert.id"
          :class="[
            'flex gap-4 px-6 py-4 transition-colors',
            alert.acknowledged ? 'opacity-50' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30',
          ]"
        >
          <!-- Icon -->
          <div
            :class="[
              'mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-lg',
              alert.severity === 'critical'
                ? 'bg-red-100 dark:bg-red-900/30'
                : alert.severity === 'warning'
                  ? 'bg-amber-100 dark:bg-amber-900/30'
                  : 'bg-blue-100 dark:bg-blue-900/30',
            ]"
          >
            {{ alert.icon }}
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <p class="text-sm font-bold text-gray-900 dark:text-white">{{ alert.title }}</p>
              <span
                :class="[
                  'rounded-full px-2 py-0.5 text-[10px] font-black uppercase',
                  alert.severity === 'critical'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : alert.severity === 'warning'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                ]"
                >{{ alert.severity }}</span
              >
              <span
                v-if="alert.acknowledged"
                class="rounded-full px-2 py-0.5 text-[10px] font-black uppercase bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                >resolved</span
              >
            </div>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{{ alert.description }}</p>
            <p class="mt-1 text-[11px] text-gray-400">{{ alert.category }} · {{ alert.triggeredAt }}</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 flex-shrink-0">
            <button
              v-if="!alert.acknowledged"
              @click="acknowledge(alert.id)"
              class="rounded-xl bg-green-100 dark:bg-green-900/30 px-3 py-1.5 text-xs font-black text-green-700 dark:text-green-400 hover:bg-green-200 transition-colors"
            >
              Resolve
            </button>
            <button
              v-if="!alert.acknowledged"
              @click="snooze(alert.id)"
              class="rounded-xl bg-gray-100 dark:bg-gray-700 px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors"
            >
              Snooze 1h
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Alert Rules Config -->
    <div class="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <h2 class="text-base font-black text-gray-900 dark:text-white">Alert Rules</h2>
        <p class="text-xs text-gray-400 mt-0.5">Configure when alerts automatically trigger.</p>
      </div>

      <div class="divide-y divide-gray-50 dark:divide-gray-700">
        <div v-for="rule in alertRules" :key="rule.id" class="flex items-center gap-4 px-6 py-4">
          <div :class="['flex h-10 w-10 items-center justify-center rounded-xl text-lg', rule.iconBg]">
            {{ rule.icon }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-gray-900 dark:text-white">{{ rule.name }}</p>
            <p class="text-xs text-gray-400">{{ rule.description }}</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <span>Threshold:</span>
              <input
                v-model="rule.threshold"
                type="number"
                class="w-16 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 px-2 py-1 text-xs text-center focus:outline-none focus:border-primary-500"
                :min="rule.thresholdMin"
                :max="rule.thresholdMax"
              />
              <span>{{ rule.unit }}</span>
            </div>
            <!-- Toggle -->
            <button
              @click="rule.enabled = !rule.enabled"
              :class="[
                'relative h-6 w-11 flex-shrink-0 rounded-full transition-colors',
                rule.enabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700',
              ]"
            >
              <span
                :class="[
                  'absolute top-0.5 left-0.5 h-5 w-5 transform rounded-full bg-white shadow transition-transform',
                  rule.enabled ? 'translate-x-5' : 'translate-x-0',
                ]"
              />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Alert History Chart-like Summary -->
    <div class="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <h2 class="text-base font-black text-gray-900 dark:text-white mb-4">Alert History (Last 7 Days)</h2>
      <div class="flex items-end gap-2 h-24">
        <div v-for="(day, i) in historyBars" :key="i" class="flex-1 flex flex-col items-center gap-1">
          <div class="w-full flex flex-col justify-end gap-px" style="height: 80px">
            <div
              :style="{ height: day.critical * 4 + 'px' }"
              class="w-full rounded-sm bg-red-400 transition-all min-h-[2px]"
            ></div>
            <div
              :style="{ height: day.warning * 4 + 'px' }"
              class="w-full rounded-sm bg-amber-400 transition-all min-h-[2px]"
            ></div>
          </div>
          <span class="text-[10px] text-gray-400">{{ day.label }}</span>
        </div>
      </div>
      <div class="flex items-center gap-4 mt-3">
        <span class="flex items-center gap-1.5 text-xs text-gray-500"
          ><span class="h-3 w-3 rounded-sm bg-red-400 inline-block"></span>Critical</span
        >
        <span class="flex items-center gap-1.5 text-xs text-gray-500"
          ><span class="h-3 w-3 rounded-sm bg-amber-400 inline-block"></span>Warning</span
        >
      </div>
    </div>

    <div
      v-if="showRuleModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      @click.self="showRuleModal = false"
    >
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-lg font-black text-gray-900 dark:text-white">New Alert Rule</h2>
            <p class="mt-1 text-xs text-gray-400">Create a dashboard rule that can be tuned and toggled with the rest.</p>
          </div>
          <button class="rounded-lg px-2 py-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" @click="showRuleModal = false">
            x
          </button>
        </div>
        <form class="mt-5 space-y-4" @submit.prevent="saveCustomRule">
          <div>
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Rule Name</label>
            <input
              v-model="customRule.name"
              class="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold outline-none focus:border-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              placeholder="Transport route exception"
              required
            />
          </div>
          <div>
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Category</label>
            <input
              v-model="customRule.category"
              class="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold outline-none focus:border-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              placeholder="Operations"
              required
            />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Threshold</label>
              <input
                v-model.number="customRule.threshold"
                type="number"
                min="1"
                class="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold outline-none focus:border-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Unit</label>
              <input
                v-model="customRule.unit"
                class="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold outline-none focus:border-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                placeholder="events"
              />
            </div>
          </div>
          <div>
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Description</label>
            <textarea
              v-model="customRule.description"
              rows="3"
              class="mt-1 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium outline-none focus:border-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              placeholder="Describe when operators should review this condition."
            ></textarea>
          </div>
          <div class="flex justify-end gap-3">
            <button type="button" class="rounded-xl bg-gray-100 px-4 py-2 text-sm font-black text-gray-600 dark:bg-gray-700 dark:text-gray-200" @click="showRuleModal = false">
              Cancel
            </button>
            <button type="submit" class="rounded-xl bg-primary-600 px-4 py-2 text-sm font-black text-white hover:bg-primary-700">
              Save Rule
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { useStudentStore } from '@/stores/students'
import { useFeeStore } from '@/stores/fees'
import { useAttendanceStore } from '@/stores/attendance'
import { useExamStore } from '@/stores/exams'
import { useToastStore } from '@/stores/toast'
import { loadFromStorage, saveToStorage } from '@/utils/storage'

const studentStore = useStudentStore()
const feeStore = useFeeStore()
const attendanceStore = useAttendanceStore()
const examStore = useExamStore()
const toast = useToastStore()

const activeFilter = ref('all')
const acknowledgedCount = ref(0)
const snoozedIds = ref(new Set<number>())

interface AlertRule {
  id: number
  name: string
  description: string
  icon: string
  iconBg: string
  enabled: boolean
  threshold: number
  thresholdMin: number
  thresholdMax: number
  unit: string
  custom?: boolean
  category?: string
}

const savedCustomRules = loadFromStorage<AlertRule[]>('custom_alert_rules') || []
const showRuleModal = ref(false)
const customRule = reactive({
  name: '',
  category: '',
  threshold: 1,
  unit: 'events',
  description: '',
})

// ---- Alert Rules ----
const alertRules = reactive<AlertRule[]>([
  {
    id: 1,
    name: 'Low Attendance Alert',
    description: 'Trigger when student attendance falls below threshold',
    icon: '📋',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
    enabled: true,
    threshold: 75,
    thresholdMin: 50,
    thresholdMax: 95,
    unit: '%',
  },
  {
    id: 2,
    name: 'Fee Overdue Alert',
    description: 'Trigger when fee payment is overdue beyond threshold days',
    icon: '💰',
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    enabled: true,
    threshold: 30,
    thresholdMin: 7,
    thresholdMax: 90,
    unit: 'days',
  },
  {
    id: 3,
    name: 'Low Exam Score Alert',
    description: 'Trigger when student average score drops below threshold',
    icon: '📝',
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    enabled: true,
    threshold: 50,
    thresholdMin: 30,
    thresholdMax: 70,
    unit: '%',
  },
  {
    id: 4,
    name: 'New Enrollment',
    description: 'Notify when a new student is enrolled',
    icon: '👨‍🎓',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    enabled: true,
    threshold: 1,
    thresholdMin: 1,
    thresholdMax: 1,
    unit: '',
  },
  {
    id: 5,
    name: 'Staff Absence Alert',
    description: 'Trigger when a staff member is absent for consecutive days',
    icon: '👤',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    enabled: false,
    threshold: 3,
    thresholdMin: 1,
    thresholdMax: 10,
    unit: 'days',
  },
  {
    id: 6,
    name: 'Exam Results Published',
    description: 'Notify when exam results are entered for a class',
    icon: '🎓',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    enabled: true,
    threshold: 1,
    thresholdMin: 1,
    thresholdMax: 1,
    unit: '',
  },
  ...savedCustomRules,
])

// ---- Auto-generated alerts from live data ----
interface Alert {
  id: number
  title: string
  description: string
  severity: 'critical' | 'warning' | 'info'
  category: string
  icon: string
  triggeredAt: string
  acknowledged: boolean
  snoozedUntil?: number
}

const alerts = ref<Alert[]>([])

// Generate alerts from live store data
function buildAlerts(): Alert[] {
  const list: Alert[] = []
  let idCounter = 1

  const attRule = alertRules.find((r) => r.id === 1)
  if (attRule?.enabled) {
    for (const student of studentStore.students) {
      const recs = attendanceStore.records.filter((r) => r.student_id === student.id)
      if (!recs.length) continue
      const present = recs.filter((r) => r.status === 'present').length
      const pct = Math.round((present / recs.length) * 100)
      if (pct < attRule.threshold) {
        list.push({
          id: idCounter++,
          title: `Low Attendance – ${student.name}`,
          description: `${student.name} (${student.class_name}) has ${pct}% attendance, below the ${attRule.threshold}% threshold.`,
          severity: pct < 60 ? 'critical' : 'warning',
          category: 'Attendance',
          icon: '📋',
          triggeredAt: 'Today',
          acknowledged: false,
        })
      }
    }
  }

  const feeRule = alertRules.find((r) => r.id === 2)
  if (feeRule?.enabled) {
    for (const p of feeStore.payments) {
      if (p.status === 'unpaid' && p.due_amount > 0) {
        list.push({
          id: idCounter++,
          title: `Fee Overdue – ${p.student_name}`,
          description: `₹${p.due_amount.toLocaleString('en-IN')} pending for ${p.fee_name}. No payment recorded.`,
          severity: p.due_amount > 10000 ? 'critical' : 'warning',
          category: 'Fees',
          icon: '💰',
          triggeredAt: 'Today',
          acknowledged: false,
        })
      }
    }
  }

  const examRule = alertRules.find((r) => r.id === 3)
  if (examRule?.enabled) {
    const studentResults: Record<number, { total: number; count: number; name: string; class: string }> = {}
    for (const r of examStore.results) {
      if (!studentResults[r.student_id]) {
        studentResults[r.student_id] = { total: 0, count: 0, name: r.student_name, class: r.class_name }
      }
      studentResults[r.student_id].total += (r.marks_obtained / r.max_marks) * 100
      studentResults[r.student_id].count++
    }
    for (const [, data] of Object.entries(studentResults)) {
      const avg = Math.round(data.total / data.count)
      if (avg < examRule.threshold) {
        list.push({
          id: idCounter++,
          title: `Low Academic Score – ${data.name}`,
          description: `${data.name} (${data.class}) has average score of ${avg}%, below the ${examRule.threshold}% threshold.`,
          severity: avg < 40 ? 'critical' : 'warning',
          category: 'Academics',
          icon: '📝',
          triggeredAt: 'This Week',
          acknowledged: false,
        })
      }
    }
  }

  // Info alerts for noteworthy things
  const newStudents = studentStore.students.filter((s) => {
    const admDate = new Date(s.admission_date)
    const daysDiff = Math.floor((Date.now() - admDate.getTime()) / 86400000)
    return daysDiff <= 7
  })
  if (newStudents.length > 0) {
    list.push({
      id: idCounter++,
      title: `${newStudents.length} New Enrollment${newStudents.length > 1 ? 's' : ''} This Week`,
      description:
        newStudents
          .slice(0, 3)
          .map((s) => s.name)
          .join(', ') + (newStudents.length > 3 ? ' and more...' : ''),
      severity: 'info',
      category: 'Enrollment',
      icon: '👨‍🎓',
      triggeredAt: 'This Week',
      acknowledged: false,
    })
  }

  return list
}

alerts.value = buildAlerts()

const criticalAlerts = computed(() => alerts.value.filter((a) => a.severity === 'critical' && !a.acknowledged))
const warningAlerts = computed(() => alerts.value.filter((a) => a.severity === 'warning' && !a.acknowledged))
const infoAlerts = computed(() => alerts.value.filter((a) => a.severity === 'info' && !a.acknowledged))

const filteredActiveAlerts = computed(() => {
  const now = Date.now()
  const visible = alerts.value.filter((a) => !a.snoozedUntil || a.snoozedUntil < now)
  if (activeFilter.value === 'all') return visible.slice(0, 30)
  return visible.filter((a) => a.severity === activeFilter.value).slice(0, 30)
})

function acknowledge(id: number) {
  const a = alerts.value.find((a) => a.id === id)
  if (a) {
    a.acknowledged = true
    acknowledgedCount.value++
  }
  toast.success('Alert resolved')
}

function snooze(id: number) {
  const a = alerts.value.find((a) => a.id === id)
  if (a) {
    a.snoozedUntil = Date.now() + 3600000
  }
  toast.warning('Alert snoozed for 1 hour')
}

function addCustomAlert() {
  Object.assign(customRule, {
    name: '',
    category: '',
    threshold: 1,
    unit: 'events',
    description: '',
  })
  showRuleModal.value = true
}

function saveCustomRule() {
  if (!customRule.name.trim() || !customRule.category.trim()) {
    toast.warning('Rule name and category are required')
    return
  }
  alertRules.push({
    id: Date.now(),
    name: customRule.name.trim(),
    description: customRule.description.trim() || `Manual monitoring rule for ${customRule.category.trim()}.`,
    icon: '⚙',
    iconBg: 'bg-slate-100 dark:bg-slate-900/30',
    enabled: true,
    threshold: customRule.threshold || 1,
    thresholdMin: 1,
    thresholdMax: 999,
    unit: customRule.unit.trim(),
    custom: true,
    category: customRule.category.trim(),
  })
  saveToStorage(
    'custom_alert_rules',
    alertRules.filter((rule) => rule.custom),
  )
  alerts.value = buildAlerts()
  showRuleModal.value = false
  toast.success('Alert rule created')
}

watch(
  alertRules,
  () => {
    saveToStorage(
      'custom_alert_rules',
      alertRules.filter((rule) => rule.custom),
    )
    alerts.value = buildAlerts()
  },
  { deep: true },
)

// ---- History bars ---- (demo data)
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const historyBars = days.map((label, i) => ({
  label,
  critical: Math.floor(Math.random() * 5) + (i === 3 ? 8 : 0),
  warning: Math.floor(Math.random() * 8) + 2,
}))
</script>

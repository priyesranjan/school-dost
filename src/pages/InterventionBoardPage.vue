<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-gray-900 dark:text-white">Intervention Board</h1>
        <p class="text-sm text-gray-500 mt-1">At-risk students flagged by attendance, fees and academic performance.</p>
      </div>
      <div class="flex items-center gap-3">
        <select
          v-model="riskFilter"
          class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 focus:border-primary-500 focus:outline-none"
        >
          <option value="">All Risk Levels</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
        </select>
        <select
          v-model="classFilter"
          class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 focus:border-primary-500 focus:outline-none"
        >
          <option value="">All Classes</option>
          <option v-for="cls in classes" :key="cls" :value="cls">{{ cls }}</option>
        </select>
      </div>
    </div>

    <div class="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-900/40 dark:bg-indigo-900/10">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-xs font-black uppercase tracking-widest text-indigo-700 dark:text-indigo-300">Risk Engine Mode</p>
          <p class="mt-1 text-sm font-medium text-indigo-900 dark:text-indigo-100">
            {{ apiRisks.length ? 'Live backend risk model' : 'Local fallback risk model' }}
          </p>
          <p class="text-xs text-indigo-700/80 dark:text-indigo-300/80">
            Window: last {{ liveRiskWindowDays }} days
            <span v-if="liveRiskUpdatedAtLabel"> · Updated {{ liveRiskUpdatedAtLabel }}</span>
          </p>
        </div>
        <button
          class="rounded-xl border border-indigo-200 bg-white px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
          :disabled="liveRiskLoading"
          @click="refreshLiveRisk"
        >
          {{ liveRiskLoading ? 'Refreshing...' : 'Refresh' }}
        </button>
      </div>
      <p v-if="liveRiskError" class="mt-2 text-xs font-medium text-amber-700 dark:text-amber-300">{{ liveRiskError }}</p>
    </div>

    <!-- Summary Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div class="rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 p-4">
        <p class="text-2xl font-black text-red-600">{{ criticalCount }}</p>
        <p class="text-xs font-bold text-red-400 mt-0.5 uppercase tracking-wide">Critical</p>
      </div>
      <div
        class="rounded-2xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 p-4"
      >
        <p class="text-2xl font-black text-orange-600">{{ highCount }}</p>
        <p class="text-xs font-bold text-orange-400 mt-0.5 uppercase tracking-wide">High Risk</p>
      </div>
      <div class="rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 p-4">
        <p class="text-2xl font-black text-amber-600">{{ mediumCount }}</p>
        <p class="text-xs font-bold text-amber-400 mt-0.5 uppercase tracking-wide">Medium Risk</p>
      </div>
      <div class="rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 p-4">
        <p class="text-2xl font-black text-green-600">{{ resolvedCount }}</p>
        <p class="text-xs font-bold text-green-400 mt-0.5 uppercase tracking-wide">Actioned</p>
      </div>
    </div>

    <!-- Risk Cards -->
    <div
      v-if="filteredRisks.length === 0"
      class="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 py-16 text-center"
    >
      <p class="text-4xl mb-3">🎉</p>
      <p class="text-base font-bold text-gray-900 dark:text-white">No students flagged for intervention</p>
      <p class="text-sm text-gray-400 mt-1">All students meet attendance and academic thresholds.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="risk in filteredRisks"
        :key="risk.studentId"
        :class="[
          'rounded-2xl border bg-white dark:bg-gray-800 p-5 transition-shadow hover:shadow-lg',
          risk.level === 'critical'
            ? 'border-red-200 dark:border-red-800/50'
            : risk.level === 'high'
              ? 'border-orange-200 dark:border-orange-800/50'
              : 'border-amber-200 dark:border-amber-800/50',
        ]"
      >
        <!-- Card Header -->
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div
              :class="[
                'h-11 w-11 rounded-xl flex items-center justify-center font-black text-lg text-white',
                risk.level === 'critical' ? 'bg-red-500' : risk.level === 'high' ? 'bg-orange-500' : 'bg-amber-500',
              ]"
            >
              {{ risk.name.charAt(0) }}
            </div>
            <div>
              <p class="text-sm font-black text-gray-900 dark:text-white">{{ risk.name }}</p>
              <p class="text-xs text-gray-400">{{ risk.class_name }} · {{ risk.roll }}</p>
            </div>
          </div>
          <span
            :class="[
              'rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide',
              risk.level === 'critical'
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                : risk.level === 'high'
                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
            ]"
            >{{ risk.level }}</span
          >
        </div>

        <!-- Risk Score Bar -->
        <div class="mt-4">
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs font-bold text-gray-500">Risk Score</span>
            <span class="text-xs font-black text-gray-900 dark:text-white">{{ risk.score }}/100</span>
          </div>
          <div class="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700">
            <div
              :class="[
                'h-2 rounded-full transition-all',
                risk.level === 'critical' ? 'bg-red-500' : risk.level === 'high' ? 'bg-orange-500' : 'bg-amber-400',
              ]"
              :style="{ width: risk.score + '%' }"
            />
          </div>
        </div>

        <!-- Risk Factors -->
        <div class="mt-4 space-y-2">
          <div
            v-for="factor in risk.factors"
            :key="factor.key"
            class="flex items-center gap-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 px-3 py-2"
          >
            <span class="text-sm">{{ factor.icon }}</span>
            <p class="text-xs text-gray-700 dark:text-gray-300 flex-1">{{ factor.text }}</p>
            <span :class="['text-[10px] font-black', factor.severity === 'high' ? 'text-red-500' : 'text-amber-500']">
              {{ factor.badge }}
            </span>
          </div>
        </div>

        <!-- Action Row -->
        <div class="mt-4 flex items-center gap-2">
          <select
            v-model="assignedActionMap[risk.studentId]"
            class="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 py-2 text-xs font-medium focus:outline-none focus:border-primary-500"
          >
            <option value="">Assign Action...</option>
            <option value="parent_meeting">Parent Meeting</option>
            <option value="counselling">Counselling Session</option>
            <option value="fee_reminder">Send Fee Reminder</option>
            <option value="extra_classes">Extra Classes</option>
            <option value="warning_letter">Warning Letter</option>
          </select>
          <button
            @click="markActioned(risk.studentId)"
            :disabled="!assignedActionMap[risk.studentId]"
            :class="[
              'rounded-xl px-3 py-2 text-xs font-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
              actionedIds.has(risk.studentId)
                ? 'bg-green-100 text-green-700'
                : 'bg-primary-600 text-white hover:bg-primary-700',
            ]"
          >
            {{ actionedIds.has(risk.studentId) ? '✓ Done' : 'Act' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Quick View Drawer -->
    <QuickViewDrawer :is-open="drawerOpen" type="student" :item-id="drawerStudentId" @close="drawerOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStudentStore } from '@/stores/students'
import { useFeeStore } from '@/stores/fees'
import { useAttendanceStore } from '@/stores/attendance'
import { useExamStore } from '@/stores/exams'
import { analyticsService } from '@/services/analyticsService'
import type { EnterpriseAnalyticsOverview } from '@/types'
import QuickViewDrawer from '@/components/ui/QuickViewDrawer.vue'

const studentStore = useStudentStore()
const feeStore = useFeeStore()
const attendanceStore = useAttendanceStore()
const examStore = useExamStore()

const riskFilter = ref('')
const classFilter = ref('')
const actionedIds = ref(new Set<number>())
const assignedActionMap = ref<Record<number, string>>({})
const drawerOpen = ref(false)
const drawerStudentId = ref(0)
const riskSnapshot = ref<EnterpriseAnalyticsOverview | null>(null)
const liveRiskLoading = ref(false)
const liveRiskError = ref<string | null>(null)
const liveRiskUpdatedAt = ref<string | null>(null)
const liveRiskWindowDays = ref(30)

const classes = computed(() => [...new Set(studentStore.students.map((s) => s.class_name))].sort())

interface RiskFactor {
  key: string
  icon: string
  text: string
  badge: string
  severity: 'high' | 'medium'
}
interface RiskEntry {
  studentId: number
  name: string
  class_name: string
  roll: string
  score: number
  level: 'critical' | 'high' | 'medium'
  factors: RiskFactor[]
}

const localRisks = computed((): RiskEntry[] => {
  const risks: RiskEntry[] = []

  for (const student of studentStore.students) {
    const factors: RiskFactor[] = []
    let score = 0

    // --- Attendance factor ---
    const att = attendanceStore.records.filter((r) => r.student_id === student.id)
    if (att.length > 0) {
      const present = att.filter((r) => r.status === 'present').length
      const pct = Math.round((present / att.length) * 100)
      if (pct < 60) {
        score += 50
        factors.push({
          key: 'att',
          icon: '📋',
          text: `Attendance critically low: ${pct}%`,
          badge: `${pct}%`,
          severity: 'high',
        })
      } else if (pct < 75) {
        score += 30
        factors.push({
          key: 'att',
          icon: '📋',
          text: `Attendance below threshold: ${pct}%`,
          badge: `${pct}%`,
          severity: 'medium',
        })
      }
    }

    // --- Fee factor ---
    const fees = feeStore.payments.filter((p) => p.student_id === student.id)
    const totalDue = fees.reduce((s, f) => s + f.due_amount, 0)
    const totalAmt = fees.reduce((s, f) => s + f.total_amount, 0)
    if (totalAmt > 0) {
      const overduePct = Math.round((totalDue / totalAmt) * 100)
      if (overduePct >= 80) {
        score += 35
        factors.push({
          key: 'fee',
          icon: '💰',
          text: `Fee overdue: ₹${totalDue.toLocaleString('en-IN')} pending`,
          badge: `${overduePct}%`,
          severity: 'high',
        })
      } else if (overduePct >= 40) {
        score += 20
        factors.push({
          key: 'fee',
          icon: '💰',
          text: `Partial fee: ₹${totalDue.toLocaleString('en-IN')} pending`,
          badge: `${overduePct}%`,
          severity: 'medium',
        })
      }
    }

    // --- Academic factor ---
    const results = examStore.results.filter((r) => r.student_id === student.id)
    if (results.length > 0) {
      const avgPct = results.reduce((s, r) => s + (r.marks_obtained / r.max_marks) * 100, 0) / results.length
      if (avgPct < 40) {
        score += 40
        factors.push({
          key: 'exam',
          icon: '📝',
          text: `Average score: ${Math.round(avgPct)}% — critical`,
          badge: `${Math.round(avgPct)}%`,
          severity: 'high',
        })
      } else if (avgPct < 60) {
        score += 20
        factors.push({
          key: 'exam',
          icon: '📝',
          text: `Average score: ${Math.round(avgPct)}% — below average`,
          badge: `${Math.round(avgPct)}%`,
          severity: 'medium',
        })
      }
    }

    if (factors.length === 0) continue

    const level: RiskEntry['level'] = score >= 70 ? 'critical' : score >= 45 ? 'high' : 'medium'

    risks.push({
      studentId: student.id,
      name: student.name,
      class_name: student.class_name,
      roll: student.roll_number,
      score: Math.min(score, 100),
      level,
      factors,
    })
  }

  return risks.sort((a, b) => b.score - a.score)
})

const liveRiskUpdatedAtLabel = computed(() => {
  if (!liveRiskUpdatedAt.value) return ''
  return new Date(liveRiskUpdatedAt.value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
})

function mapRiskLevel(score: number): RiskEntry['level'] {
  if (score >= 85) return 'critical'
  if (score >= 60) return 'high'
  return 'medium'
}

const apiRisks = computed((): RiskEntry[] => {
  const rows = riskSnapshot.value?.risk_students || []
  return rows
    .map((row) => {
      const factors: RiskFactor[] = []

      if (row.fee_due_amount > 0) {
        factors.push({
          key: 'fee',
          icon: '💰',
          text: `Fee pending: ₹${Math.round(row.fee_due_amount).toLocaleString('en-IN')}`,
          badge: `₹${Math.round(row.fee_due_amount).toLocaleString('en-IN')}`,
          severity: row.fee_due_amount > 12000 ? 'high' : 'medium',
        })
      }

      if (row.absent_days > 0) {
        factors.push({
          key: 'att',
          icon: '📋',
          text: `Absences in window: ${row.absent_days} day(s)`,
          badge: `${row.absent_days}d`,
          severity: row.absent_days >= 5 ? 'high' : 'medium',
        })
      }

      if (row.exam_average_score !== null) {
        factors.push({
          key: 'exam',
          icon: '📝',
          text: `Exam average: ${Math.round(row.exam_average_score)}%`,
          badge: `${Math.round(row.exam_average_score)}%`,
          severity: row.exam_average_score < 45 ? 'high' : 'medium',
        })
      }

      if (factors.length === 0) {
        factors.push({
          key: 'risk',
          icon: '⚠️',
          text: `Risk model score: ${row.risk_score}/100`,
          badge: `${row.risk_score}`,
          severity: row.risk_score >= 75 ? 'high' : 'medium',
        })
      }

      return {
        studentId: row.student_id,
        name: row.student_name,
        class_name: row.class_name,
        roll: '-',
        score: row.risk_score,
        level: mapRiskLevel(row.risk_score),
        factors,
      }
    })
    .sort((a, b) => b.score - a.score)
})

const allRisks = computed(() => (apiRisks.value.length ? apiRisks.value : localRisks.value))

const filteredRisks = computed(() => {
  return allRisks.value.filter((r) => {
    if (riskFilter.value && r.level !== riskFilter.value) return false
    if (classFilter.value && r.class_name !== classFilter.value) return false
    return true
  })
})

const criticalCount = computed(() => allRisks.value.filter((r) => r.level === 'critical').length)
const highCount = computed(() => allRisks.value.filter((r) => r.level === 'high').length)
const mediumCount = computed(() => allRisks.value.filter((r) => r.level === 'medium').length)
const resolvedCount = ref(0)

async function loadLiveRisk() {
  liveRiskLoading.value = true
  liveRiskError.value = null
  try {
    const response = await analyticsService.getOverview(30)
    riskSnapshot.value = response.data
    liveRiskUpdatedAt.value = response.data.generated_at
    liveRiskWindowDays.value = response.data.period_days
  } catch {
    riskSnapshot.value = null
    liveRiskUpdatedAt.value = null
    liveRiskError.value = 'Unable to load backend risk analytics. Showing local model.'
  } finally {
    liveRiskLoading.value = false
  }
}

async function refreshLiveRisk() {
  await loadLiveRisk()
}

function markActioned(id: number) {
  if (actionedIds.value.has(id)) return
  actionedIds.value.add(id)
  resolvedCount.value++
}

onMounted(() => {
  void loadLiveRisk()
})
</script>

<template>
  <div class="py-2">
    <div v-if="events.length === 0" class="py-10 text-center text-sm text-gray-400">
      No activity recorded yet for {{ entityName }}.
    </div>

    <div v-else class="relative">
      <!-- Vertical line -->
      <div class="absolute left-5 top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-gray-800"></div>

      <div v-for="(event, idx) in events" :key="idx" class="relative flex gap-4 pb-5 last:pb-0">
        <!-- Icon dot -->
        <div
          :class="[
            'relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm border-2 border-white dark:border-gray-900',
            event.color,
          ]"
        >
          {{ event.icon }}
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0 pt-1">
          <div class="flex items-start justify-between gap-2">
            <p class="text-sm font-bold text-gray-900 dark:text-white leading-tight">{{ event.title }}</p>
            <span class="text-[11px] font-semibold text-gray-400 whitespace-nowrap flex-shrink-0">{{
              event.timeAgo
            }}</span>
          </div>
          <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{{ event.description }}</p>
          <span
            v-if="event.badge"
            :class="[
              'mt-1.5 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-black',
              event.badgeClass,
            ]"
          >
            {{ event.badge }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAttendanceStore } from '@/stores/attendance'
import { useFeeStore } from '@/stores/fees'
import { useExamStore } from '@/stores/exams'
import { useNoticeStore } from '@/stores/notices'

const props = defineProps<{
  entityType: 'student' | 'staff'
  entityId: number
  entityName: string
}>()

const attendanceStore = useAttendanceStore()
const feeStore = useFeeStore()
const examStore = useExamStore()
const noticeStore = useNoticeStore()

interface TimelineEvent {
  date: string
  icon: string
  title: string
  description: string
  color: string
  badge?: string
  badgeClass?: string
  timeAgo: string
}

function timeAgo(dateStr: string): string {
  const then = new Date(dateStr).getTime()
  const now = Date.now()
  const diff = now - then
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

const events = computed((): TimelineEvent[] => {
  const list: TimelineEvent[] = []

  if (props.entityType === 'student') {
    // Attendance events
    const attRecords = attendanceStore.records
      .filter((r) => r.student_id === props.entityId)
      .slice(-10)
      .reverse()

    for (const r of attRecords) {
      const colorMap = {
        present: 'bg-green-100 text-green-600',
        absent: 'bg-red-100 text-red-600',
        late: 'bg-amber-100 text-amber-600',
      }
      const badgeMap = {
        present: 'bg-green-100 text-green-700',
        absent: 'bg-red-100 text-red-700',
        late: 'bg-amber-100 text-amber-700',
      }
      list.push({
        date: r.date,
        icon: r.status === 'present' ? '✅' : r.status === 'absent' ? '❌' : '⏰',
        title: 'Attendance',
        description: `Marked ${r.status} on ${new Date(r.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}`,
        color: colorMap[r.status],
        badge: r.status.toUpperCase(),
        badgeClass: badgeMap[r.status],
        timeAgo: timeAgo(r.date + 'T09:00:00'),
      })
    }

    // Fee payments
    const feePayments = feeStore.payments
      .filter((p) => p.student_id === props.entityId && p.payment_date)
      .slice(-5)
      .reverse()

    for (const p of feePayments) {
      list.push({
        date: p.payment_date!,
        icon: '💰',
        title: 'Fee Payment',
        description: `₹${p.paid_amount.toLocaleString('en-IN')} paid for ${p.fee_name}`,
        color: 'bg-emerald-100 text-emerald-600',
        badge: p.status === 'paid' ? 'CLEARED' : 'PARTIAL',
        badgeClass: p.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700',
        timeAgo: timeAgo(p.payment_date! + 'T10:00:00'),
      })
    }

    // Exam results
    const examResults = examStore.results
      .filter((r) => r.student_id === props.entityId)
      .slice(-5)
      .reverse()

    for (const r of examResults) {
      const pct = Math.round((r.marks_obtained / r.max_marks) * 100)
      list.push({
        date: examStore.exams.find((e) => e.id === r.exam_id)?.date || '2026-01-01',
        icon: '📝',
        title: `${r.exam_name} – ${r.subject}`,
        description: `Scored ${r.marks_obtained}/${r.max_marks} (${pct}%)`,
        color:
          pct >= 80
            ? 'bg-blue-100 text-blue-600'
            : pct >= 60
              ? 'bg-indigo-100 text-indigo-600'
              : 'bg-rose-100 text-rose-600',
        badge: r.grade,
        badgeClass:
          pct >= 80
            ? 'bg-blue-100 text-blue-700'
            : pct >= 60
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-rose-100 text-rose-700',
        timeAgo: timeAgo((examStore.exams.find((e) => e.id === r.exam_id)?.date || '2026-01-01') + 'T08:00:00'),
      })
    }
  }

  if (props.entityType === 'staff') {
    // Staff attendance
    const staffAtt = attendanceStore.staffRecords
      .filter((r) => r.staff_id === props.entityId)
      .slice(-8)
      .reverse()

    for (const r of staffAtt) {
      const colorMap = {
        present: 'bg-green-100 text-green-600',
        absent: 'bg-red-100 text-red-600',
        on_leave: 'bg-blue-100 text-blue-600',
      }
      const badgeMap = {
        present: 'bg-green-100 text-green-700',
        absent: 'bg-red-100 text-red-700',
        on_leave: 'bg-blue-100 text-blue-700',
      }
      list.push({
        date: r.date,
        icon: r.status === 'present' ? '✅' : r.status === 'absent' ? '❌' : '🏖️',
        title: 'Attendance',
        description: `${r.status === 'on_leave' ? 'On Leave' : r.status.charAt(0).toUpperCase() + r.status.slice(1)} – ${new Date(r.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}`,
        color: colorMap[r.status],
        badge: r.status.toUpperCase().replace('_', ' '),
        badgeClass: badgeMap[r.status],
        timeAgo: timeAgo(r.date + 'T09:00:00'),
      })
    }
  }

  // Sort all events newest first
  return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 20)
})
</script>

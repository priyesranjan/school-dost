<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" @click="$emit('close')" />
  </Transition>

  <!-- Drawer Panel -->
  <Transition name="slide-right">
    <div
      v-if="isOpen"
      class="fixed right-0 top-0 z-50 h-full w-full max-w-[480px] bg-white dark:bg-gray-900 shadow-2xl flex flex-col overflow-hidden"
    >
      <!-- Header -->
      <div class="relative bg-gradient-to-br from-primary-600 to-primary-700 p-6 flex gap-4 items-start">
        <button
          @click="$emit('close')"
          class="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Avatar -->
        <div
          class="h-16 w-16 flex-shrink-0 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center overflow-hidden"
        >
          <img
            v-if="item?.profile_photo_url"
            :src="item.profile_photo_url"
            class="h-full w-full object-cover"
            :alt="item?.name"
          />
          <span v-else class="text-2xl font-black text-white">{{ item?.name?.charAt(0) }}</span>
        </div>

        <div class="flex-1 min-w-0 pr-8">
          <h2 class="text-xl font-black text-white truncate">{{ item?.name }}</h2>
          <p class="text-sm text-white/80 mt-0.5">{{ subtitle }}</p>
          <div class="flex items-center gap-2 mt-2">
            <span
              :class="[
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-black',
                item?.status === 'active' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200',
              ]"
            >
              {{ item?.status === 'active' ? 'Active' : item?.status === 'on_leave' ? 'On Leave' : 'Inactive' }}
            </span>
            <span
              v-if="riskLevel"
              :class="['inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-black', riskBadgeClass]"
            >
              {{ riskLevel }} Risk
            </span>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'flex-1 px-4 py-3 text-xs font-black uppercase tracking-widest transition-colors',
            activeTab === tab.key
              ? 'border-b-2 border-primary-500 text-primary-600 bg-white dark:bg-gray-800'
              : 'text-gray-400 hover:text-gray-600',
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Body (scrollable) -->
      <div class="flex-1 overflow-y-auto p-5 space-y-5">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'">
          <div class="grid grid-cols-2 gap-3">
            <InfoBlock icon="📞" label="Phone" :value="item?.phone || '—'" />
            <InfoBlock icon="📧" label="Email" :value="item?.email || '—'" />

            <!-- Student specific -->
            <template v-if="type === 'student'">
              <InfoBlock icon="🎓" label="Class" :value="studentItem?.class_name + ' – ' + studentItem?.section" />
              <InfoBlock icon="🔖" label="Roll No" :value="studentItem?.roll_number || '—'" />
              <InfoBlock icon="👤" label="Parent" :value="studentItem?.parent_name || '—'" />
              <InfoBlock icon="📍" label="Address" :value="studentItem?.address || '—'" :wide="true" />
              <InfoBlock icon="📅" label="Admitted" :value="formatDate(studentItem?.admission_date)" />
            </template>

            <!-- Staff specific -->
            <template v-if="type === 'staff'">
              <InfoBlock icon="🏢" label="Department" :value="staffItem?.department || '—'" />
              <InfoBlock icon="👔" label="Role" :value="capitalize(staffItem?.role || '')" />
              <InfoBlock icon="📅" label="Joined" :value="formatDate(staffItem?.join_date)" />
              <InfoBlock icon="📍" label="Address" :value="staffItem?.address || '—'" :wide="true" />
            </template>
          </div>

          <!-- Fee Summary for students -->
          <div
            v-if="type === 'student' && feeSummary"
            class="mt-5 rounded-2xl border border-gray-100 dark:border-gray-700 p-4"
          >
            <p class="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Fee Status</p>
            <div class="grid grid-cols-3 gap-3">
              <div class="text-center">
                <p class="text-lg font-black text-gray-900 dark:text-white">₹{{ formatMoney(feeSummary.paid) }}</p>
                <p class="text-[11px] text-green-600 font-bold">Paid</p>
              </div>
              <div class="text-center">
                <p class="text-lg font-black text-amber-600">₹{{ formatMoney(feeSummary.pending) }}</p>
                <p class="text-[11px] text-amber-600 font-bold">Pending</p>
              </div>
              <div class="text-center">
                <p class="text-lg font-black text-gray-900 dark:text-white">₹{{ formatMoney(feeSummary.total) }}</p>
                <p class="text-[11px] text-gray-400 font-bold">Total</p>
              </div>
            </div>
            <div class="mt-3 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700">
              <div
                class="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all"
                :style="{ width: feeSummary.total ? (feeSummary.paid / feeSummary.total) * 100 + '%' : '0%' }"
              />
            </div>
          </div>

          <!-- Attendance snapshot for students -->
          <div
            v-if="type === 'student' && attendanceSummary"
            class="mt-3 rounded-2xl border border-gray-100 dark:border-gray-700 p-4"
          >
            <p class="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Attendance (Last 30 days)</p>
            <div class="grid grid-cols-4 gap-2 text-center">
              <div>
                <p
                  class="text-xl font-black"
                  :class="attendanceSummary.percentage >= 75 ? 'text-green-600' : 'text-red-500'"
                >
                  {{ attendanceSummary.percentage }}%
                </p>
                <p class="text-[11px] text-gray-400 font-bold">Rate</p>
              </div>
              <div>
                <p class="text-xl font-black text-green-600">{{ attendanceSummary.present }}</p>
                <p class="text-[11px] text-gray-400 font-bold">Present</p>
              </div>
              <div>
                <p class="text-xl font-black text-red-500">{{ attendanceSummary.absent }}</p>
                <p class="text-[11px] text-gray-400 font-bold">Absent</p>
              </div>
              <div>
                <p class="text-xl font-black text-amber-500">{{ attendanceSummary.late }}</p>
                <p class="text-[11px] text-gray-400 font-bold">Late</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Timeline Tab -->
        <div v-if="activeTab === 'timeline'">
          <ActivityTimeline :entity-type="type" :entity-id="itemId" :entity-name="item?.name || ''" />
        </div>

        <!-- Exams Tab (student only) -->
        <div v-if="activeTab === 'exams' && type === 'student'">
          <div v-if="examResults.length === 0" class="py-12 text-center text-sm text-gray-400">
            No exam results found.
          </div>
          <div
            v-for="r in examResults"
            :key="r.id"
            class="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800 last:border-0"
          >
            <div>
              <p class="text-sm font-bold text-gray-900 dark:text-white">{{ r.subject }}</p>
              <p class="text-xs text-gray-400">{{ r.exam_name }}</p>
            </div>
            <div class="text-right">
              <p :class="['text-lg font-black', gradeColor(r.grade)]">{{ r.grade }}</p>
              <p class="text-xs text-gray-400">{{ r.marks_obtained }}/{{ r.max_marks }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="border-t border-gray-100 dark:border-gray-800 p-4 flex gap-3 bg-white dark:bg-gray-900">
        <router-link
          :to="`/${type}s/${itemId}`"
          class="flex-1 rounded-xl bg-primary-600 px-4 py-3 text-center text-sm font-black text-white hover:bg-primary-700 transition-colors"
          @click="$emit('close')"
        >
          View Full Profile
        </router-link>
        <button
          class="rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          @click="$emit('send-sms', itemId)"
        >
          Send SMS
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useStudentStore } from '@/stores/students'
import { useStaffStore } from '@/stores/staff'
import { useFeeStore } from '@/stores/fees'
import { useAttendanceStore } from '@/stores/attendance'
import { useExamStore } from '@/stores/exams'
import ActivityTimeline from './ActivityTimeline.vue'

// ----------------------------- Inner component ----------------------------- //
const InfoBlock = {
  props: ['icon', 'label', 'value', 'wide'],
  template: `
    <div :class="['rounded-xl bg-gray-50 dark:bg-gray-800 p-3', wide ? 'col-span-2' : '']">
      <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{{ icon }} {{ label }}</p>
      <p class="text-sm font-semibold text-gray-900 dark:text-white break-words">{{ value }}</p>
    </div>
  `,
}

// ----------------------------- Props ----------------------------- //
const props = defineProps<{
  isOpen: boolean
  type: 'student' | 'staff'
  itemId: number
}>()
defineEmits<{ close: []; 'send-sms': [id: number] }>()

// ----------------------------- Stores ----------------------------- //
const studentStore = useStudentStore()
const staffStore = useStaffStore()
const feeStore = useFeeStore()
const attendanceStore = useAttendanceStore()
const examStore = useExamStore()

// ----------------------------- Tabs ----------------------------- //
const studentTabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'exams', label: 'Exams' },
]
const staffTabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'timeline', label: 'Timeline' },
]
const tabs = computed(() => (props.type === 'student' ? studentTabs : staffTabs))
const activeTab = ref('overview')
watch(
  () => props.itemId,
  () => (activeTab.value = 'overview'),
)

// ----------------------------- Data ----------------------------- //
const studentItem = computed(() => studentStore.students.find((s) => s.id === props.itemId))
const staffItem = computed(() => staffStore.staffMembers.find((s) => s.id === props.itemId))
const item = computed(() => (props.type === 'student' ? studentItem.value : staffItem.value))

const subtitle = computed(() => {
  if (props.type === 'student') {
    return `${studentItem.value?.class_name} · Section ${studentItem.value?.section}`
  }
  return `${staffItem.value?.role?.toUpperCase()} · ${staffItem.value?.department}`
})

// Fee summary for students
const feeSummary = computed(() => {
  if (props.type !== 'student') return null
  const payments = feeStore.payments.filter((p) => p.student_id === props.itemId)
  if (!payments.length) return null
  const paid = payments.reduce((s, p) => s + p.paid_amount, 0)
  const total = payments.reduce((s, p) => s + p.total_amount, 0)
  return { paid, pending: total - paid, total }
})

// Attendance summary
const attendanceSummary = computed(() => {
  if (props.type !== 'student') return null
  const records = attendanceStore.records.filter((r) => r.student_id === props.itemId)
  if (!records.length) return null
  const present = records.filter((r) => r.status === 'present').length
  const absent = records.filter((r) => r.status === 'absent').length
  const late = records.filter((r) => r.status === 'late').length
  const total = records.length
  return { present, absent, late, percentage: total ? Math.round((present / total) * 100) : 0 }
})

// Exam results
const examResults = computed(() => {
  if (props.type !== 'student') return []
  return examStore.results.filter((r) => r.student_id === props.itemId).slice(0, 8)
})

// Risk level (simple rule: high if attendance <60% OR large pending fees)
const riskLevel = computed(() => {
  if (props.type !== 'student') return null
  const att = attendanceSummary.value
  const fee = feeSummary.value
  if (att && att.percentage < 60) return 'High'
  if (fee && fee.pending > fee.total * 0.5) return 'High'
  if (att && att.percentage < 75) return 'Medium'
  if (fee && fee.pending > 0) return 'Medium'
  return null
})
const riskBadgeClass = computed(() => {
  if (riskLevel.value === 'High') return 'bg-red-500/20 text-red-200'
  if (riskLevel.value === 'Medium') return 'bg-amber-500/20 text-amber-200'
  return 'bg-green-500/20 text-green-200'
})

// ----------------------------- Helpers ----------------------------- //
function formatDate(d?: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
function formatMoney(n: number) {
  return n.toLocaleString('en-IN')
}
function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
function gradeColor(g: string) {
  if (g === 'A+' || g === 'A') return 'text-green-600'
  if (g === 'B+' || g === 'B') return 'text-blue-600'
  if (g === 'C') return 'text-amber-500'
  return 'text-red-500'
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>

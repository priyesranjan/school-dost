<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Premium Header -->
    <div
      class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 p-8 shadow-2xl shadow-violet-200/50 dark:shadow-none"
    >
      <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div
            class="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm"
          >
            🎓 Academic Year-End
          </div>
          <h1 class="mt-3 text-4xl font-black tracking-tight text-white drop-shadow">
            Student <span class="text-violet-200">Promotion</span>
          </h1>
          <p class="mt-1 text-sm font-medium text-white/70">
            Promote students to next classes, issue Transfer Certificates, and manage academic transitions.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <div class="rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-sm border border-white/20 text-center">
            <p class="text-2xl font-black text-white">{{ eligibleCount }}</p>
            <p class="text-[10px] font-black uppercase tracking-widest text-white/60">Eligible</p>
          </div>
          <AppButton
            @click="openBulkPromote"
            class="h-[48px] rounded-2xl bg-white px-8 text-sm font-black text-violet-600 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            ⚡ Bulk Promote
          </AppButton>
        </div>
      </div>
      <div class="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/5 blur-2xl"></div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 gap-5 lg:grid-cols-4">
      <div
        class="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-800/50"
      >
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Active</p>
        <p class="mt-1 text-3xl font-black text-gray-900 dark:text-white">{{ activeStudents.length }}</p>
        <div
          class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-lg dark:bg-gray-800"
        >
          👨‍🎓
        </div>
      </div>
      <div
        class="relative overflow-hidden rounded-3xl border border-violet-100 bg-violet-50/40 p-6 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-violet-900/30 dark:bg-violet-900/10"
      >
        <p class="text-[10px] font-black uppercase tracking-widest text-violet-500/70">Class 10 (Graduating)</p>
        <p class="mt-1 text-3xl font-black text-violet-700 dark:text-violet-400">{{ class10Count }}</p>
        <div
          class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-lg dark:bg-violet-900/30"
        >
          🏆
        </div>
      </div>
      <div
        class="relative overflow-hidden rounded-3xl border border-emerald-100 bg-emerald-50/40 p-6 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-emerald-900/30 dark:bg-emerald-900/10"
      >
        <p class="text-[10px] font-black uppercase tracking-widest text-emerald-500/70">Selected for Promotion</p>
        <p class="mt-1 text-3xl font-black text-emerald-700 dark:text-emerald-400">{{ selectedCount }}</p>
        <div
          class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-lg dark:bg-emerald-900/30"
        >
          ⬆️
        </div>
      </div>
      <div
        class="relative overflow-hidden rounded-3xl border border-rose-100 bg-rose-50/40 p-6 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-rose-900/30 dark:bg-rose-900/10"
      >
        <p class="text-[10px] font-black uppercase tracking-widest text-rose-500/70">TC Candidates</p>
        <p class="mt-1 text-3xl font-black text-rose-700 dark:text-rose-400">{{ class10Count }}</p>
        <div
          class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-lg dark:bg-rose-900/30"
        >
          📄
        </div>
      </div>
    </div>

    <!-- Promotion Notes Banner -->
    <div
      class="rounded-2xl border border-violet-200 bg-violet-50/60 p-4 flex items-start gap-3 dark:border-violet-900/30 dark:bg-violet-900/10"
    >
      <span class="text-xl mt-0.5">ℹ️</span>
      <div>
        <p class="text-sm font-black text-violet-900 dark:text-violet-200">How Promotion Works</p>
        <p class="text-xs text-violet-700/70 dark:text-violet-300/60 mt-0.5">
          Classes advance by one level (Class 6 → Class 7, ..., Class 9 → Class 10). Class 10 students should receive a
          Transfer Certificate (TC) and will be marked inactive. Select students from each class group and click
          "Promote Class".
        </p>
      </div>
    </div>

    <!-- Class-wise Groups -->
    <div
      v-for="group in classGroups"
      :key="group.className"
      class="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800/50"
    >
      <!-- Class Header -->
      <div
        :class="['flex items-center justify-between border-b border-gray-100 p-6 dark:border-gray-700', group.bgHeader]"
      >
        <div class="flex items-center gap-4">
          <div
            :class="[
              'flex h-12 w-12 items-center justify-center rounded-2xl text-2xl font-black text-white shadow-lg',
              group.headerColor,
            ]"
          >
            {{ group.className.replace('Class ', '') }}
          </div>
          <div>
            <h3 class="text-base font-black text-gray-900 dark:text-white">
              {{ group.className }}
              <span
                v-if="group.isGraduating"
                class="ml-2 rounded-full bg-violet-100 px-2.5 py-0.5 text-[10px] font-black text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
                >Graduating Year</span
              >
            </h3>
            <p class="text-xs text-gray-400 mt-0.5">
              {{ group.students.length }} student{{ group.students.length !== 1 ? 's' : '' }} · Promotes to:
              <span class="font-bold text-gray-600 dark:text-gray-300">{{ group.promoteTarget }}</span>
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="selectAllInClass(group.className)"
            class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-600 transition-all hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 dark:border-gray-700 dark:bg-gray-800 active:scale-95"
          >
            Select All
          </button>
          <AppButton
            :class="[
              'text-[10px] font-black uppercase tracking-widest',
              group.isGraduating ? 'bg-rose-500 hover:bg-rose-600' : 'bg-violet-600 hover:bg-violet-700',
            ]"
            @click="group.isGraduating ? openTcModal(group.students) : promoteClass(group.className, group.students)"
            :disabled="classSelectedCount(group.className) === 0"
          >
            {{ group.isGraduating ? '📄 Issue TC' : '⬆️ Promote Class' }} ({{ classSelectedCount(group.className) }})
          </AppButton>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr
              class="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50/30 dark:bg-gray-900/20"
            >
              <th class="px-6 py-3 w-12">
                <input
                  type="checkbox"
                  :checked="classSelectedCount(group.className) === group.students.length && group.students.length > 0"
                  @change="toggleClassAll(group.className, group.students)"
                  class="rounded border-gray-300"
                />
              </th>
              <th class="px-6 py-3">Student</th>
              <th class="px-6 py-3">Roll No</th>
              <th class="px-6 py-3">Section</th>
              <th class="px-6 py-3">Attendance</th>
              <th class="px-6 py-3">Fee Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
            <tr
              v-for="s in group.students"
              :key="s.id"
              :class="[
                'group transition-colors cursor-pointer',
                selectedIds.has(s.id)
                  ? 'bg-violet-50/50 dark:bg-violet-900/10'
                  : 'hover:bg-gray-50/50 dark:hover:bg-gray-700/20',
              ]"
              @click="toggleSelect(s.id)"
            >
              <td class="px-6 py-4 w-12" @click.stop>
                <input
                  type="checkbox"
                  :checked="selectedIds.has(s.id)"
                  @change="toggleSelect(s.id)"
                  class="rounded border-gray-300"
                />
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    :class="[
                      'flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black text-white shadow-md',
                      group.headerColor,
                    ]"
                  >
                    {{ s.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-black text-gray-900 dark:text-white">{{ s.name }}</p>
                    <p class="text-[10px] text-gray-400">{{ s.parent_name }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">{{ s.roll_number }}</td>
              <td class="px-6 py-4">
                <span
                  class="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-black text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  >Sec {{ s.section }}</span
                >
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="h-2 w-20 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                    <div
                      class="h-full rounded-full bg-emerald-500"
                      :style="{ width: studentAttendance(s.id) + '%' }"
                    ></div>
                  </div>
                  <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400"
                    >{{ studentAttendance(s.id) }}%</span
                  >
                </div>
              </td>
              <td class="px-6 py-4">
                <span :class="['rounded-full px-2.5 py-1 text-[10px] font-black', feeStatusStyle(s.id)]">
                  {{ feeStatusLabel(s.id) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Bulk Promote Modal -->
    <AppModal v-model="showBulkModal" title="Bulk Promotion" size="md">
      <div class="space-y-5 p-1">
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">From Class</label>
          <SmartDropdown
            v-model="bulkFrom"
            :options="promotableClassOptions"
            placeholder="Select class to promote..."
            :searchable="false"
          />
        </div>
        <div v-if="bulkFrom" class="rounded-2xl bg-violet-50 p-4 dark:bg-violet-900/20">
          <p class="text-sm font-bold text-violet-800 dark:text-violet-200">
            {{ bulkStudentCount }} students in {{ bulkFrom }} will be promoted to
            <strong>{{ nextClass(bulkFrom) }}</strong>
          </p>
        </div>
      </div>
      <template #footer>
        <div class="flex items-center justify-end gap-3 p-1">
          <AppButton variant="secondary" @click="showBulkModal = false">Cancel</AppButton>
          <AppButton @click="handleBulkPromote" :loading="promoting" class="bg-violet-600 hover:bg-violet-700">
            Promote All {{ bulkStudentCount }} Students
          </AppButton>
        </div>
      </template>
    </AppModal>

    <!-- TC Modal -->
    <AppModal v-model="showTcModal" title="Issue Transfer Certificates" size="md">
      <div class="space-y-4 p-1">
        <div class="rounded-2xl bg-rose-50 p-4 dark:bg-rose-900/20">
          <p class="text-sm font-bold text-rose-800 dark:text-rose-200">
            <strong>{{ tcStudents.length }}</strong> student{{ tcStudents.length !== 1 ? 's' : '' }} will be marked as
            <strong>inactive</strong> and issued a TC.
          </p>
        </div>
        <div class="max-h-48 overflow-y-auto space-y-2 rounded-2xl border border-gray-100 p-3 dark:border-gray-700">
          <div v-for="s in tcStudents" :key="s.id" class="flex items-center gap-3">
            <div
              class="h-7 w-7 rounded-lg bg-rose-100 flex items-center justify-center text-xs font-black text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
            >
              {{ s.name.charAt(0) }}
            </div>
            <span class="text-sm font-bold text-gray-900 dark:text-white">{{ s.name }}</span>
            <span class="ml-auto text-xs text-gray-400">{{ s.roll_number }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex items-center justify-end gap-3 p-1">
          <AppButton variant="secondary" @click="showTcModal = false">Cancel</AppButton>
          <AppButton @click="handleIssueTc" :loading="promoting" class="bg-rose-500 hover:bg-rose-600">
            Issue TC & Mark Inactive
          </AppButton>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStudentStore } from '@/stores/students'
import { useFeeStore } from '@/stores/fees'
import { useAttendanceStore } from '@/stores/attendance'
import { useToastStore } from '@/stores/toast'
import type { Student } from '@/types'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import SmartDropdown from '@/components/ui/SmartDropdown.vue'
import type { DropdownOption } from '@/components/ui/SmartDropdown.vue'

const studentStore = useStudentStore()
const feeStore = useFeeStore()
const attendanceStore = useAttendanceStore()
const toast = useToastStore()

const selectedIds = ref(new Set<number>())
const promoting = ref(false)

const activeStudents = computed(() => studentStore.students.filter((s) => s.status === 'active'))
const class10Count = computed(() => activeStudents.value.filter((s) => s.class_name === 'Class 10').length)
const selectedCount = computed(() => selectedIds.value.size)
const eligibleCount = computed(() => activeStudents.value.filter((s) => s.class_name !== 'Class 10').length)

const CLASS_ORDER = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']

function nextClass(cls: string): string {
  const idx = CLASS_ORDER.indexOf(cls)
  if (idx === -1 || idx === CLASS_ORDER.length - 1) return 'Graduation (TC)'
  return CLASS_ORDER[idx + 1]
}

const classGroups = computed(() => {
  const headerColors: Record<string, string> = {
    'Class 6': 'bg-sky-500',
    'Class 7': 'bg-teal-500',
    'Class 8': 'bg-indigo-500',
    'Class 9': 'bg-violet-600',
    'Class 10': 'bg-rose-600',
  }
  const bgHeaders: Record<string, string> = {
    'Class 6': 'bg-sky-50/50 dark:bg-sky-900/10',
    'Class 7': 'bg-teal-50/50 dark:bg-teal-900/10',
    'Class 8': 'bg-indigo-50/50 dark:bg-indigo-900/10',
    'Class 9': 'bg-violet-50/50 dark:bg-violet-900/10',
    'Class 10': 'bg-rose-50/50 dark:bg-rose-900/10',
  }
  return CLASS_ORDER.map((cls) => ({
    className: cls,
    students: activeStudents.value.filter((s) => s.class_name === cls),
    promoteTarget: nextClass(cls),
    isGraduating: cls === 'Class 10',
    headerColor: headerColors[cls] || 'bg-gray-500',
    bgHeader: bgHeaders[cls] || '',
  })).filter((g) => g.students.length > 0)
})

function toggleSelect(id: number) {
  const set = new Set(selectedIds.value)
  if (set.has(id)) set.delete(id)
  else set.add(id)
  selectedIds.value = set
}

function selectAllInClass(cls: string) {
  const set = new Set(selectedIds.value)
  activeStudents.value.filter((s) => s.class_name === cls).forEach((s) => set.add(s.id))
  selectedIds.value = set
}

function toggleClassAll(cls: string, students: Student[]) {
  const set = new Set(selectedIds.value)
  const clsIds = students.map((s) => s.id)
  const allSelected = clsIds.every((id) => set.has(id))
  if (allSelected) clsIds.forEach((id) => set.delete(id))
  else clsIds.forEach((id) => set.add(id))
  selectedIds.value = set
}

function classSelectedCount(cls: string): number {
  return activeStudents.value.filter((s) => s.class_name === cls && selectedIds.value.has(s.id)).length
}

// Attendance proxy (estimated from store records or default 85%)
function studentAttendance(id: number): number {
  const records = attendanceStore.records.filter((r) => r.student_id === id)
  if (!records.length) return 85
  const present = records.filter((r) => r.status === 'present').length
  return Math.round((present / records.length) * 100)
}

// Fee status
function feeStatusLabel(id: number): string {
  const dues = feeStore.payments.filter((p) => p.student_id === id)
  if (!dues.length) return 'No Fees'
  if (dues.every((p) => p.status === 'paid')) return 'Cleared'
  if (dues.some((p) => p.status === 'unpaid')) return 'Pending'
  return 'Partial'
}
function feeStatusStyle(id: number): string {
  const label = feeStatusLabel(id)
  if (label === 'Cleared') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
  if (label === 'Pending') return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
  if (label === 'Partial') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
  return 'bg-gray-100 text-gray-500'
}

// Promote a specific class
async function promoteClass(className: string, students: Student[]) {
  const toPromote = students.filter((s) => selectedIds.value.has(s.id))
  if (!toPromote.length) {
    toast.warning('Select students first')
    return
  }
  promoting.value = true
  const target = nextClass(className)
  for (const s of toPromote) {
    await studentStore.updateStudent(s.id, { class_name: target })
    const set = new Set(selectedIds.value)
    set.delete(s.id)
    selectedIds.value = set
  }
  promoting.value = false
  toast.success(`${toPromote.length} students promoted to ${target}`)
}

// Bulk Promote Modal
const showBulkModal = ref(false)
const bulkFrom = ref('')

const promotableClassOptions = computed<DropdownOption[]>(() =>
  CLASS_ORDER.filter((c) => c !== 'Class 10' && activeStudents.value.some((s) => s.class_name === c)).map((c) => ({
    value: c,
    label: `${c} → ${nextClass(c)}`,
    icon: '⬆️',
  })),
)

const bulkStudentCount = computed(() =>
  bulkFrom.value ? activeStudents.value.filter((s) => s.class_name === bulkFrom.value).length : 0,
)

function openBulkPromote() {
  bulkFrom.value = ''
  showBulkModal.value = true
}

async function handleBulkPromote() {
  if (!bulkFrom.value) {
    toast.warning('Select a class first')
    return
  }
  promoting.value = true
  const students = activeStudents.value.filter((s) => s.class_name === bulkFrom.value)
  const target = nextClass(bulkFrom.value)
  for (const s of students) {
    await studentStore.updateStudent(s.id, { class_name: target })
  }
  promoting.value = false
  showBulkModal.value = false
  toast.success(`${students.length} students promoted to ${target}`)
}

// TC Modal
const showTcModal = ref(false)
const tcStudents = ref<Student[]>([])

function openTcModal(students: Student[]) {
  tcStudents.value = students.filter((s) => selectedIds.value.has(s.id))
  if (!tcStudents.value.length) {
    toast.warning('Select students to issue TC')
    return
  }
  showTcModal.value = true
}

async function handleIssueTc() {
  promoting.value = true
  for (const s of tcStudents.value) {
    await studentStore.updateStudent(s.id, { status: 'inactive' })
    const set = new Set(selectedIds.value)
    set.delete(s.id)
    selectedIds.value = set
  }
  promoting.value = false
  showTcModal.value = false
  toast.success(`TC issued for ${tcStudents.value.length} student${tcStudents.value.length !== 1 ? 's' : ''}`)
}
</script>

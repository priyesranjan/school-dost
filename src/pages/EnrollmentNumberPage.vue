<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Header -->
    <div
      class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-700 via-purple-800 to-slate-900 p-8 shadow-2xl shadow-indigo-400/30 dark:shadow-none"
    >
      <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div
            class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm"
          >
            🪪 Student Identity Engine
          </div>
          <h1 class="mt-3 text-4xl font-black tracking-tight text-white drop-shadow">
            Enrollment <span class="text-indigo-300">Numbers</span>
          </h1>
          <p class="mt-1 text-sm font-medium text-white/60">
            Structured registration numbers auto-generated on admission.
          </p>
          <!-- Format breakdown -->
          <div class="mt-4 flex flex-wrap items-center gap-1">
            <div
              v-for="seg in formatSegments"
              :key="seg.label"
              class="flex items-center rounded-xl px-3 py-1.5 backdrop-blur-sm border border-white/10"
              :class="seg.bg"
            >
              <div class="text-center">
                <p class="text-base font-black tracking-widest text-white">{{ seg.example }}</p>
                <p class="text-[9px] font-black uppercase tracking-widest text-white/50">{{ seg.label }}</p>
              </div>
            </div>
            <div class="flex items-center gap-1 pl-2">
              <span class="text-white/30 text-lg font-black">→</span>
              <span
                class="rounded-xl bg-white/10 px-3 py-1.5 text-sm font-black text-white tracking-widest border border-white/20"
              >
                {{ sampleEnrollment }}
              </span>
            </div>
          </div>
        </div>
        <div class="flex flex-col items-start gap-3 lg:items-end">
          <div class="flex items-center gap-3">
            <div class="rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-sm border border-white/10 text-center">
              <p class="text-3xl font-black text-white">{{ totalWithEnrollment }}</p>
              <p class="text-[9px] font-black uppercase tracking-widest text-white/50">Enrolled</p>
            </div>
            <div class="rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-sm border border-white/10 text-center">
              <p class="text-3xl font-black text-amber-300">{{ totalMissing }}</p>
              <p class="text-[9px] font-black uppercase tracking-widest text-white/50">Missing No.</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <AppButton
              v-if="totalMissing > 0"
              @click="backfillAll"
              class="rounded-2xl bg-amber-400 px-5 py-2.5 text-sm font-black text-amber-900 shadow-xl hover:bg-amber-300"
            >
              ⚡ Auto-fill Missing ({{ totalMissing }})
            </AppButton>
            <AppButton
              @click="showConfigModal = true"
              class="rounded-2xl bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-black text-white hover:bg-white/20"
            >
              ⚙ Format Config
            </AppButton>
          </div>
        </div>
      </div>
      <div class="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div class="relative flex-1 max-w-sm">
        <svg
          class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Name, enrollment no, roll..."
          class="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <select
        v-model="classFilter"
        class="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-black uppercase tracking-widest text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      >
        <option value="">All Classes</option>
        <option v-for="cls in studentStore.classes" :key="cls" :value="cls">{{ cls }}</option>
      </select>
      <select
        v-model="yearFilter"
        class="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-black uppercase tracking-widest text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      >
        <option value="">All Years</option>
        <option v-for="yr in admissionYears" :key="yr" :value="yr">Admitted {{ yr }}</option>
      </select>
      <div class="ml-auto flex items-center gap-2">
        <span class="text-[10px] font-black uppercase text-gray-400">{{ filteredStudents.length }} records</span>
      </div>
    </div>

    <!-- Table -->
    <AppCard :no-padding="true" class="shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr
              class="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50/50 dark:bg-gray-800/50"
            >
              <th class="px-6 py-4">Student</th>
              <th class="px-6 py-4">Enrollment Number</th>
              <th class="px-6 py-4">
                <div class="flex flex-wrap gap-1 items-center">
                  <span class="text-indigo-500">YY</span><span>·</span> <span class="text-teal-500">CCC</span
                  ><span>·</span> <span class="text-amber-500">III</span><span>·</span>
                  <span class="text-rose-500">NNNN</span>
                </div>
              </th>
              <th class="px-6 py-4">Class · Section</th>
              <th class="px-6 py-4">Admission Date</th>
              <th class="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
            <tr
              v-for="student in filteredStudents"
              :key="student.id"
              class="group hover:bg-indigo-50/20 dark:hover:bg-indigo-900/10 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-black text-white shadow-md"
                  >
                    {{ student.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-black text-gray-900 dark:text-white">{{ student.name }}</p>
                    <p class="text-[10px] text-gray-400">Roll: {{ student.roll_number }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div v-if="student.enrollment_no" class="flex items-center gap-2">
                  <button
                    @click="copyNo(student.enrollment_no!)"
                    class="group/copy flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-1.5 text-sm font-black text-indigo-700 transition-all hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 active:scale-95"
                  >
                    <span class="tracking-widest">{{ formatEnrollmentNo(student.enrollment_no) }}</span>
                    <svg
                      class="h-3.5 w-3.5 opacity-0 transition-opacity group-hover/copy:opacity-60"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2.5"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
                <span v-else class="flex items-center gap-1.5 text-xs text-amber-600 font-bold">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  Not assigned
                </span>
              </td>
              <!-- Segment breakdown -->
              <td class="px-6 py-4">
                <div v-if="student.enrollment_no" class="flex items-center gap-1 text-xs font-black">
                  <span class="rounded-lg bg-indigo-50 px-2 py-0.5 text-indigo-600 dark:bg-indigo-900/20">{{
                    student.enrollment_no.slice(0, 2)
                  }}</span>
                  <span class="text-gray-300 dark:text-gray-600">·</span>
                  <span class="rounded-lg bg-teal-50 px-2 py-0.5 text-teal-700 dark:bg-teal-900/20">{{
                    student.enrollment_no.slice(2, 5)
                  }}</span>
                  <span class="text-gray-300 dark:text-gray-600">·</span>
                  <span class="rounded-lg bg-amber-50 px-2 py-0.5 text-amber-700 dark:bg-amber-900/20">{{
                    student.enrollment_no.slice(5, 8)
                  }}</span>
                  <span class="text-gray-300 dark:text-gray-600">·</span>
                  <span class="rounded-lg bg-rose-50 px-2 py-0.5 text-rose-600 dark:bg-rose-900/20">{{
                    student.enrollment_no.slice(8)
                  }}</span>
                </div>
                <span v-else class="text-[10px] text-gray-300">—</span>
              </td>
              <td class="px-6 py-4">
                <p class="font-bold text-gray-900 dark:text-white">{{ student.class_name }}</p>
                <p class="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Sec {{ student.section }}</p>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{{ student.admission_date }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    @click="regenerate(student)"
                    class="rounded-xl bg-indigo-50 px-3 py-1.5 text-[10px] font-black text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/20 transition-all active:scale-95"
                  >
                    ↻ Regenerate
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <EmptyState
        v-if="!filteredStudents.length"
        title="No students found"
        message="Adjust your filters or add students first"
      />
    </AppCard>

    <!-- Class Summary Cards -->
    <div>
      <h2 class="mb-4 text-sm font-black uppercase tracking-widest text-gray-400">Class-wise Enrollment Summary</h2>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div
          v-for="cls in classSummary"
          :key="cls.name"
          class="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800/50"
        >
          <p class="text-xs font-black uppercase tracking-widest text-gray-400">{{ cls.name }}</p>
          <p class="mt-1 text-3xl font-black text-gray-900 dark:text-white">{{ cls.count }}</p>
          <p class="mt-1 text-[10px] text-gray-400">{{ cls.withNo }} numbered · {{ cls.missing }} missing</p>
          <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
            <div
              class="h-full rounded-full bg-indigo-500 transition-all"
              :style="{ width: cls.count > 0 ? Math.round((cls.withNo / cls.count) * 100) + '%' : '0%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Config Modal -->
    <AppModal v-model="showConfigModal" title="Enrollment Number Format" size="md">
      <div class="space-y-6 p-1">
        <!-- Visual diagram -->
        <div class="rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 p-6">
          <p class="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-3">Current Format</p>
          <div class="flex flex-wrap items-center gap-2">
            <div
              v-for="seg in formatSegments"
              :key="seg.label"
              class="flex flex-col items-center rounded-2xl px-4 py-2.5"
              :class="seg.bg"
            >
              <span class="text-xl font-black text-white tracking-widest">{{ seg.example }}</span>
              <span class="text-[9px] font-black uppercase text-white/60 mt-0.5">{{ seg.label }}</span>
            </div>
          </div>
          <p class="mt-4 text-xs font-bold text-indigo-600 dark:text-indigo-300">
            Sample: <strong>{{ sampleEnrollment }}</strong> ({{
              formatEnrollmentNo(sampleEnrollment.replace(/-/g, ''))
            }})
          </p>
        </div>

        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400"
              >Institution Code <span class="text-amber-500">(III)</span></label
            >
            <AppInput v-model="configForm.institution_code" placeholder="001" maxlength="3" />
            <p class="text-[10px] text-gray-400">
              1–3 digit unique code for your institution. Stays constant for all enrollment numbers.
            </p>
          </div>
        </div>

        <div
          class="rounded-2xl border border-gray-100 dark:border-gray-700 p-4 text-xs text-gray-500 dark:text-gray-400 space-y-2"
        >
          <p class="font-black uppercase tracking-widest text-gray-400 text-[10px]">Format Legend</p>
          <div class="grid grid-cols-2 gap-2">
            <div class="flex gap-2">
              <span class="font-black text-indigo-500">YY</span> Last 2 digits of admission year
            </div>
            <div class="flex gap-2"><span class="font-black text-teal-500">CCC</span> Class grade (006 = Class 6)</div>
            <div class="flex gap-2">
              <span class="font-black text-amber-500">III</span> Institution code (you set this)
            </div>
            <div class="flex gap-2"><span class="font-black text-rose-500">NNNN</span> Auto-increment sequence</div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex items-center justify-end gap-3 p-1">
          <AppButton variant="secondary" @click="showConfigModal = false">Cancel</AppButton>
          <AppButton @click="saveConfig" class="bg-indigo-600 hover:bg-indigo-700 shadow-lg"
            >Save Configuration</AppButton
          >
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useStudentStore } from '@/stores/students'
import { useSettingsStore } from '@/stores/settings'
import { useToastStore } from '@/stores/toast'
import { generateEnrollmentNo, formatEnrollmentNo, getAdmissionYY, getClassCode } from '@/utils/enrollmentNumber'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const studentStore = useStudentStore()
const settingsStore = useSettingsStore()
const toast = useToastStore()

const searchQuery = ref('')
const classFilter = ref('')
const yearFilter = ref('')

// Format segment display
const formatSegments = computed(() => {
  const inst = (settingsStore.settings.institution_code || '001').replace(/\D/g, '').padStart(3, '0').slice(-3)
  const now = new Date()
  const yy = String(now.getFullYear()).slice(-2)
  return [
    { label: 'Admission Year', example: yy, bg: 'bg-indigo-500/80' },
    { label: 'Class Code', example: '006', bg: 'bg-teal-500/80' },
    { label: 'Institution', example: inst, bg: 'bg-amber-500/80' },
    { label: 'Sequence', example: '0001', bg: 'bg-rose-500/80' },
  ]
})

const sampleEnrollment = computed(() => {
  const inst = settingsStore.settings.institution_code || '001'
  return generateEnrollmentNo(new Date().toISOString().slice(0, 10), 'Class 6', inst, 1)
})

// Filters
const admissionYears = computed(() => {
  const years = new Set(studentStore.students.map((s) => `20${getAdmissionYY(s.admission_date)}`))
  return Array.from(years).sort().reverse()
})

const filteredStudents = computed(() => {
  let list = studentStore.students
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      (s) => s.name.toLowerCase().includes(q) || (s.enrollment_no || '').includes(q) || s.roll_number.includes(q),
    )
  }
  if (classFilter.value) list = list.filter((s) => s.class_name === classFilter.value)
  if (yearFilter.value) list = list.filter((s) => `20${getAdmissionYY(s.admission_date)}` === yearFilter.value)
  return list
})

const totalWithEnrollment = computed(() => studentStore.students.filter((s) => !!s.enrollment_no).length)
const totalMissing = computed(() => studentStore.students.filter((s) => !s.enrollment_no).length)

const classSummary = computed(() => {
  return studentStore.classes.map((cls) => {
    const inClass = studentStore.students.filter((s) => s.class_name === cls)
    return {
      name: cls,
      count: inClass.length,
      withNo: inClass.filter((s) => !!s.enrollment_no).length,
      missing: inClass.filter((s) => !s.enrollment_no).length,
    }
  })
})

// Actions
function copyNo(raw: string) {
  navigator.clipboard
    .writeText(raw)
    .then(() => {
      toast.success('Copied: ' + raw)
    })
    .catch(() => toast.info(raw))
}

const globalSeq = computed(() =>
  studentStore.students.reduce((max, s) => {
    const n = s.enrollment_no ? parseInt(s.enrollment_no.slice(8)) : 0
    return Math.max(max, n)
  }, 0),
)

function regenerate(student: { id: number; enrollment_no?: string; admission_date: string; class_name: string }) {
  const inst = settingsStore.settings.institution_code || '001'
  const seq = globalSeq.value + 1
  const newNo = generateEnrollmentNo(student.admission_date, student.class_name, inst, seq)
  studentStore.updateStudent(student.id, { enrollment_no: newNo } as any)
  toast.success(`Regenerated: ${formatEnrollmentNo(newNo)}`)
}

function backfillAll() {
  const inst = settingsStore.settings.institution_code || '001'
  let seq = globalSeq.value
  studentStore.students.forEach((s) => {
    if (!s.enrollment_no) {
      seq++
      studentStore.updateStudent(s.id, {
        enrollment_no: generateEnrollmentNo(s.admission_date, s.class_name, inst, seq),
      } as any)
    }
  })
  toast.success('All enrollment numbers assigned!')
}

// Config modal
const showConfigModal = ref(false)
const configForm = reactive({
  institution_code: settingsStore.settings.institution_code || '001',
})

function saveConfig() {
  const clean = configForm.institution_code.replace(/\D/g, '').slice(-3).padStart(3, '0')
  settingsStore.updateSettings({ institution_code: clean })
  configForm.institution_code = clean
  showConfigModal.value = false
  toast.success('Enrollment format saved. Institution code: ' + clean)
}
</script>

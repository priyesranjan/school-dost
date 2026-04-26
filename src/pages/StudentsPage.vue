<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Action-Oriented Directorate Header -->
    <div class="relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-xl shadow-gray-100 dark:border dark:border-gray-800 dark:bg-gray-800/50 dark:shadow-none">
      <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div class="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary-600 dark:bg-primary-900/30">
            📊 Student Directorate
          </div>
          <h1 class="mt-3 text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            Academic <span class="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">Member Portal</span>
          </h1>
          <p class="mt-1 text-sm font-medium text-gray-400">
            Lifecycle management and identity verification for the student body.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <input ref="csvInputRef" type="file" accept=".csv,text/csv" class="hidden" @change="handleImportStudents" />
          <AppButton
            variant="secondary"
            @click="downloadImportTemplate"
            class="h-[48px] border-none bg-gray-50 px-6 font-black text-gray-600 hover:bg-gray-100 dark:bg-gray-700/50 dark:text-gray-300"
          >
            CSV Template
          </AppButton>
          <AppButton
            variant="secondary"
            @click="openImportPicker"
            :loading="importInFlight"
            class="h-[48px] border-none bg-gray-50 px-6 font-black text-gray-600 hover:bg-gray-100 dark:bg-gray-700/50 dark:text-gray-300"
          >
            Bulk Import
          </AppButton>
          <AppButton variant="secondary" @click="handleExportStudents" class="h-[48px] border-none bg-gray-50 px-6 font-black text-gray-600 hover:bg-gray-100 dark:bg-gray-700/50 dark:text-gray-300">
            ⬇ Data Export
          </AppButton>
          <AppButton @click="openAddModal" class="h-[48px] px-8 shadow-2xl shadow-primary-200 dark:shadow-none">
            + New Admission
          </AppButton>
        </div>
      </div>
      <!-- Background Decorative -->
      <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-50/50 blur-3xl dark:bg-primary-900/10"></div>
    </div>

    <!-- Live Census Matrix -->
    <div class="grid grid-cols-2 gap-6 lg:grid-cols-4">
      <div v-for="stat in summaryStats" :key="stat.label" 
           class="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-800/50">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">{{ stat.label }}</p>
            <p :class="['mt-1 text-3xl font-black tracking-tight', stat.color]">{{ stat.val }}</p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-xl shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-6 dark:bg-gray-900">
            {{ stat.icon }}
          </div>
        </div>
        <!-- Micro-chart placeholder -->
        <div class="mt-4 h-1 w-full overflow-hidden rounded-full bg-gray-50 dark:bg-white/5">
           <div :class="['h-full transition-all duration-1000', stat.barColor]" :style="{ width: stat.progress + '%' }"></div>
        </div>
      </div>
    </div>

    <AppCard v-if="importReport" class="border-none shadow-xl">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-primary-500">Student Import Report</p>
          <h2 class="mt-2 text-2xl font-black tracking-tight text-gray-900 dark:text-white">Latest CSV run</h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            We imported {{ importReport.summary.created }} records and flagged {{ importReport.summary.failed + importReport.summary.skipped }} rows for review.
          </p>
        </div>
        <div class="grid min-w-[280px] grid-cols-2 gap-3 text-sm">
          <div class="rounded-2xl bg-emerald-50 px-4 py-3 dark:bg-emerald-900/20">
            <p class="text-[10px] font-black uppercase tracking-widest text-emerald-600">Created</p>
            <p class="mt-1 text-2xl font-black text-emerald-700 dark:text-emerald-300">{{ importReport.summary.created }}</p>
          </div>
          <div class="rounded-2xl bg-sky-50 px-4 py-3 dark:bg-sky-900/20">
            <p class="text-[10px] font-black uppercase tracking-widest text-sky-600">Rows Read</p>
            <p class="mt-1 text-2xl font-black text-sky-700 dark:text-sky-300">{{ importReport.summary.total_rows }}</p>
          </div>
          <div class="rounded-2xl bg-amber-50 px-4 py-3 dark:bg-amber-900/20">
            <p class="text-[10px] font-black uppercase tracking-widest text-amber-600">Skipped</p>
            <p class="mt-1 text-2xl font-black text-amber-700 dark:text-amber-300">{{ importReport.summary.skipped }}</p>
          </div>
          <div class="rounded-2xl bg-rose-50 px-4 py-3 dark:bg-rose-900/20">
            <p class="text-[10px] font-black uppercase tracking-widest text-rose-600">Failed</p>
            <p class="mt-1 text-2xl font-black text-rose-700 dark:text-rose-300">{{ importReport.summary.failed }}</p>
          </div>
        </div>
      </div>
      <div v-if="importReport.issues.length" class="mt-5 rounded-2xl border border-amber-100 bg-amber-50/70 p-4 dark:border-amber-900/40 dark:bg-amber-900/10">
        <p class="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-300">Rows Needing Attention</p>
        <ul class="mt-3 space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <li v-for="issue in importReport.issues.slice(0, 6)" :key="`${issue.row}-${issue.code}-${issue.roll_number || 'na'}`">
            Row {{ issue.row }}: {{ issue.message }}
          </li>
        </ul>
      </div>
    </AppCard>

    <!-- Integrated Search & Discovery Hub -->
    <AppCard :no-padding="true" class="overflow-hidden border-none shadow-2xl">
      <div class="flex flex-col gap-4 bg-gray-50/50 p-6 sm:flex-row sm:items-center dark:bg-gray-800/30">
        <div class="relative flex-1 group">
          <div class="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
            <svg class="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="studentStore.searchQuery"
            type="text"
            placeholder="Identity scan: name, roll, or parent..."
            class="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-14 pr-4 text-sm font-black text-gray-900 outline-none transition-all focus:ring-4 focus:ring-primary-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div class="flex items-center gap-3">
          <select
            v-model="studentStore.classFilter"
            class="rounded-2xl border border-gray-200 bg-white px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-700 outline-none transition-all hover:border-primary-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="">All Academic Blocks</option>
            <option v-for="cls in studentStore.classes" :key="cls" :value="cls">{{ cls }}</option>
          </select>
          <button class="flex h-[56px] w-[56px] items-center justify-center rounded-2xl border border-gray-200 bg-white text-xl transition-all hover:scale-105 active:scale-95 dark:border-gray-700 dark:bg-gray-900">
            ÔÜí
          </button>
        </div>
      </div>

      <!-- High-Fidelity Member Ledger -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="bg-gray-50/20 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:bg-gray-900/30">
              <th class="px-8 py-4 cursor-pointer group" @click="toggleSort('name')">
                Profile Spectrum <span class="ml-1 transition-transform group-hover:translate-x-1">{{ sortIcon('name') }}</span>
              </th>
              <th class="px-6 py-4 cursor-pointer group" @click="toggleSort('roll_number')">
                Identity Hash {{ sortIcon('roll_number') }}
              </th>
              <th class="px-6 py-4 cursor-pointer group" @click="toggleSort('class_name')">
                Placement {{ sortIcon('class_name') }}
              </th>
              <th class="px-6 py-4">Parental Registry</th>
              <th class="px-6 py-4 cursor-pointer group text-center" @click="toggleSort('status')">
                Lifecycle {{ sortIcon('status') }}
              </th>
              <th class="px-8 py-4 text-right">Management</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
            <tr v-for="student in sortedStudents" :key="student.id" 
                @click="$router.push('/students/' + student.id)"
                class="group cursor-pointer transition-all hover:bg-primary-50/30 dark:hover:bg-primary-900/5 hover:shadow-sm">
              <td class="px-8 py-5">
                <div class="flex items-center gap-4">
                  <div class="relative h-12 w-12 flex-shrink-0">
                    <img
                      v-if="student.profile_photo_url"
                      :src="student.profile_photo_url"
                      class="h-full w-full rounded-2xl object-cover shadow-lg transition-transform group-hover:scale-110"
                    />
                    <div v-else class="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 text-sm font-black text-white shadow-lg transition-transform group-hover:scale-110">
                      {{ student.name.charAt(0) }}
                    </div>
                    <div v-if="student.status === 'active'" class="absolute -right-1.5 -top-1.5 h-4 w-4 rounded-full border-4 border-white bg-emerald-500 dark:border-gray-800"></div>
                  </div>
                  <div>
                    <p class="font-black text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{{ student.name }}</p>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Student-ID: 2026-{{ 1000 + student.id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-5">
                <span class="rounded-xl bg-gray-100 px-3 py-1.5 text-[10px] font-black text-gray-600 shadow-inner dark:bg-gray-800 dark:text-gray-400">
                  #{{ student.roll_number }}
                </span>
              </td>
              <td class="px-6 py-5">
                <p class="font-black text-gray-900 dark:text-white">{{ student.class_name }}</p>
                <p class="text-[10px] font-black uppercase text-primary-500 tracking-widest">Section {{ student.section }}</p>
              </td>
              <td class="px-6 py-5">
                <p class="text-xs font-black text-gray-900 dark:text-gray-200">{{ student.parent_name }}</p>
                <p class="text-[10px] font-bold text-gray-400">{{ student.phone }}</p>
              </td>
              <td class="px-6 py-5 text-center">
                <div :class="['inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm', 
                              student.status === 'active' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600']">
                  {{ student.status }}
                </div>
              </td>
              <td class="px-8 py-5 text-right">
                <div class="flex items-center justify-end gap-2">
                   <button @click.stop="openEditModal(student)" class="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 transition-all hover:scale-110 hover:border-primary-100 hover:text-primary-600 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button @click.stop="confirmDelete(student)" class="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-400 transition-all hover:scale-110 hover:bg-rose-600 hover:text-white dark:bg-rose-900/20">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination footer -->
      <div class="flex items-center justify-between border-t border-gray-50 p-6 dark:border-gray-700/50 bg-gray-50/20">
         <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest">
            Showing {{ sortedStudents.length }} of {{ studentStore.filteredStudents.length }} Candidates
         </p>
         <AppPagination
            v-if="studentStore.totalPages > 1"
            v-model="studentStore.currentPage"
            :total-pages="studentStore.totalPages"
            :total="studentStore.filteredStudents.length"
            :per-page="studentStore.perPage"
         />
      </div>

      <EmptyState v-if="!studentStore.filteredStudents.length" 
                  title="Database Silent" 
                  message="Refine your discovery parameters or initialize a new enrollment protocol." 
                  class="py-20">
        <template #action>
          <AppButton @click="openAddModal" shadow="xl">+ Start Enrollment</AppButton>
        </template>
      </EmptyState>
    </AppCard>

    <!-- Professional Enrollment Modal -->
    <AppModal v-model="showModal" :title="isEditing ? 'Update Student Profile' : 'New Admission'" size="lg">
      <form @submit.prevent="handleSubmit" class="p-2 space-y-6">

        <!-- STEP 1: Phone Lookup (ALWAYS FIRST) -->
        <div class="space-y-2 rounded-2xl border-2 border-primary-100 bg-primary-50/30 p-4 dark:border-primary-900/30 dark:bg-primary-900/10">
          <div class="flex items-center justify-between">
            <label class="text-[10px] font-black uppercase tracking-widest text-primary-700 dark:text-primary-400">📱 Guardian Phone (lookup existing parent)</label>
            <span v-if="parentLookupStatus === 'found'" class="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-black text-emerald-700">
              ✓ Existing Parent Found — details auto-filled!
            </span>
            <span v-else-if="parentLookupStatus === 'new'" class="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[9px] font-black text-blue-700">
              ✨ New Parent Profile
            </span>
          </div>
          <AppInput
            v-model="form.phone"
            type="tel"
            maxlength="10"
            placeholder="Enter 10-digit mobile number first..."
            required
            :error="formErrors.phone"
            @input="handlePhoneLookup"
            class="font-black text-lg h-[52px] border-2 focus:border-primary-400"
          />
          <p class="text-[9px] text-gray-400 italic">Type number to auto-discover an existing parent in the system</p>
        </div>

        <!-- STEP 2: Parent Details (auto-filled if found) -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div :class="['space-y-2 transition-all', parentLookupStatus === 'found' ? 'opacity-70' : '']">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Guardian Name *
              <span v-if="parentLookupStatus === 'found'" class="ml-1 text-emerald-600">(auto-filled)</span>
            </label>
            <AppInput v-model="form.parent_name" placeholder="Legal Guardian Name" required :error="formErrors.parent_name" class="font-bold" />
          </div>
          <div :class="['space-y-2 transition-all', parentLookupStatus === 'found' ? 'opacity-70' : '']">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Guardian Email
              <span v-if="parentLookupStatus === 'found'" class="ml-1 text-emerald-600">(auto-filled)</span>
            </label>
            <AppInput v-model="form.email" type="email" placeholder="parent@email.com" class="font-bold" />
          </div>
          <div :class="['space-y-2 col-span-2 transition-all', parentLookupStatus === 'found' ? 'opacity-70' : '']">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Residential Address
              <span v-if="parentLookupStatus === 'found'" class="ml-1 text-emerald-600">(auto-filled)</span>
            </label>
            <AppInput v-model="form.address" type="textarea" placeholder="Full permanent address..." :rows="2" />
          </div>
        </div>

        <!-- STEP 3: Student Details -->
        <div class="border-t border-gray-100 pt-4 dark:border-gray-700">
          <p class="mb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Student Information</p>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Student Name *</label>
              <AppInput v-model="form.name" placeholder="Student Full Name" required :error="formErrors.name" class="font-bold" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Roll Number *</label>
              <AppInput v-model="form.roll_number" placeholder="2026-X-001" required :error="formErrors.roll_number" class="font-bold" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Class *</label>
              <AppInput v-model="form.class_name" type="select" required :error="formErrors.class_name" class="font-bold">
                <option value="" disabled>Select class...</option>
                <option v-for="cls in classStore.classNames" :key="cls" :value="cls">{{ cls }}</option>
              </AppInput>
              <p v-if="!classStore.classNames.length" class="text-xs text-amber-500 font-semibold">
                ⚠️ No classes defined. Go to <strong>Class Management</strong> to add classes first.
              </p>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Section</label>
              <AppInput v-model="form.section" type="select" class="font-bold">
                <option v-for="sec in selectedClassSections" :key="sec.value" :value="sec.value">{{ sec.label }}</option>
              </AppInput>
            </div>
          </div>
        </div>

      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3 p-2">
          <AppButton variant="secondary" @click="showModal = false" class="border-none">Dismiss</AppButton>
          <AppButton @click="handleSubmit" :loading="studentStore.loading" class="px-10 shadow-2xl shadow-primary-200">
            {{ isEditing ? 'Update Student' : 'Finalize Admission' }}
          </AppButton>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import type { Student, StudentImportReport } from '@/types'
import { useStudentStore } from '@/stores/students'
import { useClassStore } from '@/stores/classes'
import { useToastStore } from '@/stores/toast'
import { useTableSort } from '@/composables/useTableSort'
import { exportStudentList, exportToCsv } from '@/utils/export'
import { sanitizeObject } from '@/utils/sanitize'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppPagination from '@/components/ui/AppPagination.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const studentStore = useStudentStore()
const classStore = useClassStore()
const toast = useToastStore()
const paginatedRef = computed(() => studentStore.paginatedStudents)
const { toggleSort, sortedItems: sortedStudents, sortIcon } = useTableSort(paginatedRef)

const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const deleteTarget = ref<Student | null>(null)
const parentLookupStatus = ref<'none' | 'found' | 'new'>('none')
const csvInputRef = ref<HTMLInputElement | null>(null)
const importReport = ref<StudentImportReport | null>(null)
const importInFlight = ref(false)


// High-fidelity Census Stats
const summaryStats = computed(() => [
  { label: 'Total Enrolled', val: Array.isArray(studentStore.students) ? studentStore.students.length : 0, icon: '👨‍🎓', color: 'text-gray-900', barColor: 'bg-primary-500', progress: 100 },
  { label: 'Verified Active', val: Array.isArray(studentStore.students) ? studentStore.students.filter(s => s.status === 'active').length : 0, icon: '✅', color: 'text-emerald-600', barColor: 'bg-emerald-500', progress: 85 },
  { label: 'New Admissions', val: 12, icon: '✨', color: 'text-indigo-600', barColor: 'bg-indigo-500', progress: 40 },
  { label: 'Document Alerts', val: 3, icon: '⚠️', color: 'text-rose-600', barColor: 'bg-rose-500', progress: 10 }
])

const defaultForm = {
  name: '',
  roll_number: '',
  class_name: '',
  section: 'A',
  parent_name: '',
  phone: '',
  email: '',
  address: '',
  admission_date: new Date().toISOString().split('T')[0],
  status: 'active' as const,
}

const form = reactive({ ...defaultForm })
const formErrors = reactive({ name: '', roll_number: '', class_name: '', parent_name: '', phone: '' })

// Parent auto-fill lookup: fires when phone field changes
function handlePhoneLookup() {
  if (isEditing.value) return
  const phone = form.phone.replace(/\D/g, '')
  if (phone.length < 10) {
    parentLookupStatus.value = 'none'
    return
  }
  const existing = Array.isArray(studentStore.students)
    ? studentStore.students.find((s) => s.phone === phone)
    : null
  if (existing) {
    parentLookupStatus.value = 'found'
    form.parent_name = existing.parent_name || form.parent_name
    form.email = existing.email || form.email
    form.address = existing.address || form.address
    toast.show('info', `✓ Parent found: ${existing.parent_name}. Details auto-filled!`)
  } else {
    parentLookupStatus.value = 'new'
  }
}

// Dynamic sections based on selected class from Class Management
const selectedClassSections = computed(() => {
  const cls = classStore.classes.find((c) => c.name === form.class_name)
  if (cls && cls.sections.length) {
    return cls.sections.map((s) => ({ value: s.name, label: `Section ${s.name}` }))
  }
  return [
    { value: 'A', label: 'Section A' },
    { value: 'B', label: 'Section B' },
    { value: 'C', label: 'Section C' },
  ]
})

// Reset section when class changes
watch(() => form.class_name, () => { form.section = 'A' })

onMounted(() => {
  void studentStore.fetchStudents()
})

function resetForm() {
  Object.assign(form, defaultForm)
  Object.keys(formErrors).forEach((k) => (formErrors[k as keyof typeof formErrors] = ''))
  parentLookupStatus.value = 'none'
}

function openAddModal() {
  resetForm()
  isEditing.value = false
  editingId.value = null
  parentLookupStatus.value = 'none'
  showModal.value = true
}

function openEditModal(student: Student) {
  resetForm()
  isEditing.value = true
  editingId.value = student.id
  Object.assign(form, {
    name: student.name,
    roll_number: student.roll_number,
    class_name: student.class_name,
    section: student.section,
    parent_name: student.parent_name,
    phone: student.phone,
    email: student.email,
    address: student.address,
    admission_date: student.admission_date,
    status: student.status,
  })
  showModal.value = true
}

function validate(): boolean {
  let valid = true
  Object.keys(formErrors).forEach((k) => (formErrors[k as keyof typeof formErrors] = ''))

  if (!form.name.trim()) { formErrors.name = 'Name is required'; valid = false }
  if (!form.roll_number.trim()) { formErrors.roll_number = 'Roll is required'; valid = false }
  if (!form.class_name) { formErrors.class_name = 'Class is required'; valid = false }
  if (!form.parent_name.trim()) { formErrors.parent_name = 'Guardian is required'; valid = false }
  if (!form.phone.trim()) { formErrors.phone = 'Phone is required'; valid = false }
  else if (!/^\d{10}$/.test(form.phone.trim())) { formErrors.phone = 'Invalid phone'; valid = false }

  if (form.roll_number) {
    const dup = studentStore.students.find(
      (s) => s.roll_number === form.roll_number.trim() && s.id !== editingId.value
    )
    if (dup) { formErrors.roll_number = 'DUPLICATE_ROLL'; valid = false }
  }

  return valid
}

async function handleSubmit() {
  if (!validate()) {
    toast.warning('Registry data verification failed.')
    return
  }

  try {
    const cleanData = sanitizeObject({ ...form })
    if (isEditing.value && editingId.value) {
      await studentStore.updateStudent(editingId.value, cleanData)
    } else {
      await studentStore.addStudent(cleanData)
    }
    showModal.value = false
    toast.success('Protocol synchronization complete.')
  } catch {
    // Error handled in store
  }
}

function confirmDelete(student: Student) {
  deleteTarget.value = student
  showDeleteModal.value = true
}

async function handleDelete() {
  if (deleteTarget.value) {
    await studentStore.deleteStudent(deleteTarget.value.id)
    showDeleteModal.value = false
    deleteTarget.value = null
  }
}

function handleExportStudents() {
  exportStudentList(studentStore.filteredStudents)
  toast.success('Census data exported successfully.')
}

function openImportPicker() {
  csvInputRef.value?.click()
}

function downloadImportTemplate() {
  exportToCsv(
    'student_import_template',
    ['Name', 'Roll No', 'Class', 'Section', 'Parent Name', 'Phone', 'Email', 'Admission Date'],
    [['Aarav Sharma', '2026001', 'Class 10', 'A', 'Rajesh Sharma', '9876543210', 'aarav@school.com', '2026-04-26']],
  )
  toast.success('Student import template downloaded.')
}

async function handleImportStudents() {
  const file = csvInputRef.value?.files?.[0]
  if (!file) return

  importInFlight.value = true
  try {
    const text = await file.text()
    importReport.value = await studentStore.importStudentsCsv(text)
  } catch {
    // Store handles toast
  } finally {
    importInFlight.value = false
    if (csvInputRef.value) {
      csvInputRef.value.value = ''
    }
  }
}
</script>

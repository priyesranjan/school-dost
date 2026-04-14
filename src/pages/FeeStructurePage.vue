<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Premium Header -->
    <div
      class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-8 shadow-2xl shadow-amber-200/50 dark:shadow-none"
    >
      <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div
            class="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm"
          >
            🏛️ Fee Architecture
          </div>
          <h1 class="mt-3 text-4xl font-black tracking-tight text-white drop-shadow">
            Fee Structure <span class="text-amber-100">Manager</span>
          </h1>
          <p class="mt-1 text-sm font-medium text-white/70">
            Define fee types, set class-wise amounts, due dates, and assign fees to students.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="activeTab = 'assign'"
            :class="[
              'h-[48px] rounded-2xl px-6 text-sm font-black transition-all',
              activeTab === 'assign'
                ? 'bg-white text-amber-600 shadow-lg'
                : 'border-2 border-white/30 text-white hover:bg-white/10',
            ]"
          >
            Assign Fees
          </button>
          <button
            @click="() => openAddModal()"
            class="h-[48px] rounded-2xl bg-white px-8 text-sm font-black text-amber-600 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            + New Structure
          </button>
        </div>
      </div>
      <div class="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/5 blur-2xl"></div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 gap-5 lg:grid-cols-4">
      <div
        v-for="stat in statsRow"
        :key="stat.label"
        :class="[
          'relative overflow-hidden rounded-3xl border p-6 transition-all hover:-translate-y-1 hover:shadow-xl',
          stat.border,
          stat.bg,
        ]"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest opacity-60">{{ stat.label }}</p>
            <p :class="['mt-1 text-3xl font-black tracking-tight', stat.text]">
              <span v-if="stat.prefix" class="text-xl">{{ stat.prefix }}</span
              >{{ stat.value.toLocaleString('en-IN') }}
            </p>
          </div>
          <div :class="['flex h-12 w-12 items-center justify-center rounded-2xl text-xl shadow-inner', stat.iconBg]">
            {{ stat.icon }}
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Pills -->
    <div class="flex gap-1 rounded-2xl bg-gray-100 p-1 dark:bg-gray-800 w-fit">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        :class="[
          'rounded-xl px-6 py-2.5 text-sm font-black transition-all',
          activeTab === tab.key
            ? 'bg-white text-gray-900 shadow-md dark:bg-gray-700 dark:text-white'
            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300',
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Fee Structures Tab -->
    <template v-if="activeTab === 'structures'">
      <!-- Class Group Cards -->
      <div
        v-for="cls in classGroups"
        :key="cls.name"
        class="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800/50"
      >
        <div
          class="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900/30"
        >
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-lg dark:bg-amber-900/30">
              🎓
            </div>
            <div>
              <h3 class="text-sm font-black text-gray-900 dark:text-white">{{ cls.name }}</h3>
              <p class="text-[10px] font-bold text-gray-400">
                {{ cls.items.length }} fee type{{ cls.items.length !== 1 ? 's' : '' }} · Total ₹{{
                  cls.total.toLocaleString('en-IN')
                }}/yr
              </p>
            </div>
          </div>
          <button
            @click="openAddModal(cls.name)"
            class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-amber-600 transition-all hover:bg-amber-100 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-400 active:scale-95"
          >
            + Add Fee
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-transparent">
                <th class="px-6 py-3">Fee Type</th>
                <th class="px-6 py-3">Due Date</th>
                <th class="px-6 py-3">Academic Year</th>
                <th class="px-6 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
              <tr
                v-for="s in cls.items"
                :key="s.id"
                class="group transition-colors hover:bg-amber-50/30 dark:hover:bg-amber-900/5"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="h-8 w-8 rounded-xl bg-amber-100 flex items-center justify-center text-sm dark:bg-amber-900/30"
                    >
                      {{ feeIcons[s.name] || '💰' }}
                    </div>
                    <span class="font-bold text-gray-900 dark:text-white">{{ s.name }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-gray-600 dark:text-gray-300">{{ s.due_date }}</td>
                <td class="px-6 py-4">
                  <span
                    class="rounded-full bg-primary-50 px-2.5 py-1 text-[10px] font-black text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
                    >{{ s.academic_year }}</span
                  >
                </td>
                <td class="px-6 py-4 text-right font-black text-gray-900 dark:text-white">
                  ₹{{ s.amount.toLocaleString('en-IN') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <EmptyState
        v-if="!feeStore.structures.length"
        title="No fee structures defined"
        message="Add your first fee structure to get started"
      />
    </template>

    <!-- Assign Fees Tab -->
    <template v-if="activeTab === 'assign'">
      <AppCard title="Assign Fee to Student" class="shadow-sm">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Filter by Class</label>
            <select
              v-model="assignClassFilter"
              class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-bold text-gray-700 outline-none focus:border-amber-300 focus:ring-4 focus:ring-amber-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Classes</option>
              <option v-for="cls in studentStore.classes" :key="cls" :value="cls">{{ cls }}</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Filter by Fee Type</label>
            <select
              v-model="assignFeeFilter"
              class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-bold text-gray-700 outline-none focus:border-amber-300 focus:ring-4 focus:ring-amber-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Fees</option>
              <option v-for="s in feeStore.structures" :key="s.id" :value="String(s.id)">
                {{ s.name }} - {{ s.class_name }}
              </option>
            </select>
          </div>
          <div class="flex items-end">
            <AppButton
              @click="openBulkAssign"
              class="w-full bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-200 dark:shadow-none"
            >
              ⚡ Bulk Assign to Class
            </AppButton>
          </div>
        </div>
      </AppCard>

      <AppCard :no-padding="true" class="shadow-sm overflow-hidden">
        <div class="border-b border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
          <h3 class="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">
            Student Fee Assignment
          </h3>
          <p class="text-[10px] font-bold text-gray-400 mt-0.5">{{ filteredAssignStudents.length }} students shown</p>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr
                class="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50/30 dark:bg-gray-900/30"
              >
                <th class="px-6 py-3">Student</th>
                <th class="px-6 py-3">Class</th>
                <th class="px-6 py-3">Current Fees</th>
                <th class="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
              <tr
                v-for="s in filteredAssignStudents"
                :key="s.id"
                class="group hover:bg-amber-50/20 dark:hover:bg-amber-900/5 transition-colors"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-black text-white shadow-md"
                    >
                      {{ s.name.charAt(0) }}
                    </div>
                    <div>
                      <p class="font-black text-gray-900 dark:text-white">{{ s.name }}</p>
                      <p class="text-[10px] text-gray-400">#{{ s.roll_number }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span
                    class="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  >
                    {{ s.class_name }}
                  </span>
                </td>
                <td class="px-6 py-4 text-gray-500 dark:text-gray-400">
                  {{ studentPaymentCount(s.id) }} fee{{ studentPaymentCount(s.id) !== 1 ? 's' : '' }} assigned
                </td>
                <td class="px-6 py-4">
                  <button
                    @click="openAssignModal(s)"
                    class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-amber-600 transition-all hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400 active:scale-95"
                  >
                    Assign Fee
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <EmptyState
          v-if="!filteredAssignStudents.length"
          title="No students found"
          message="Adjust filters to see students"
        />
      </AppCard>
    </template>

    <!-- Add Structure Modal -->
    <AppModal v-model="showAddModal" title="Create Fee Structure" size="md">
      <form @submit.prevent="handleAddStructure" class="space-y-5 p-1">
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Fee Type Name *</label>
          <SmartDropdown
            v-model="addForm.name"
            :options="feeTypeOptions"
            placeholder="Select or type fee name..."
            :searchable="true"
          />
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Applicable Class *</label>
          <SmartDropdown
            v-model="addForm.class_name"
            :options="classOptions"
            placeholder="Select class..."
            :searchable="false"
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Amount (₹) *</label>
            <AppInput v-model.number="addForm.amount" type="number" placeholder="15000" :min="0" required />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Due Date *</label>
            <AppInput v-model="addForm.due_date" type="date" required />
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Academic Year</label>
          <AppInput v-model="addForm.academic_year" placeholder="2025-26" />
        </div>
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3 p-1">
          <AppButton variant="secondary" @click="showAddModal = false">Cancel</AppButton>
          <AppButton
            @click="handleAddStructure"
            class="bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-200 dark:shadow-none"
          >
            Create Structure
          </AppButton>
        </div>
      </template>
    </AppModal>

    <!-- Assign Fee Modal -->
    <AppModal v-model="showAssignModal" :title="`Assign Fee — ${assignTarget?.name}`" size="md">
      <form @submit.prevent="handleAssignFee" class="space-y-5 p-1">
        <div class="rounded-2xl bg-amber-50 p-4 dark:bg-amber-900/20">
          <p class="text-sm font-black text-gray-900 dark:text-white">{{ assignTarget?.name }}</p>
          <p class="text-xs text-gray-400 mt-0.5">{{ assignTarget?.class_name }} · {{ assignTarget?.roll_number }}</p>
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Fee Structure *</label>
          <SmartDropdown
            v-model="assignStructureId"
            :options="relevantStructureOptions"
            placeholder="Choose fee to assign..."
            :searchable="true"
          />
        </div>
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3 p-1">
          <AppButton variant="secondary" @click="showAssignModal = false">Cancel</AppButton>
          <AppButton @click="handleAssignFee" class="bg-amber-500 hover:bg-amber-600">Assign Fee</AppButton>
        </div>
      </template>
    </AppModal>

    <!-- Bulk Assign Modal -->
    <AppModal v-model="showBulkModal" title="Bulk Assign Fees to Class" size="md">
      <div class="space-y-5 p-1">
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Target Class *</label>
          <SmartDropdown
            v-model="bulkClass"
            :options="studentStore.classes.map((c) => ({ value: c, label: c, icon: '🎓' }))"
            placeholder="Select class..."
            :searchable="false"
          />
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400"
            >Fee Structure to Assign *</label
          >
          <SmartDropdown
            v-model="bulkStructureId"
            :options="
              feeStore.structures.map((s) => ({
                value: String(s.id),
                label: `${s.name} — ₹${s.amount.toLocaleString('en-IN')}`,
                description: s.class_name,
              }))
            "
            placeholder="Choose fee..."
            :searchable="true"
          />
        </div>
        <div v-if="bulkClass" class="rounded-2xl bg-gray-50 p-4 dark:bg-gray-800">
          <p class="text-sm font-bold text-gray-600 dark:text-gray-300">
            Will assign to <span class="font-black text-gray-900 dark:text-white">{{ bulkStudentCount }}</span> students
            in {{ bulkClass }}
          </p>
        </div>
      </div>
      <template #footer>
        <div class="flex items-center justify-end gap-3 p-1">
          <AppButton variant="secondary" @click="showBulkModal = false">Cancel</AppButton>
          <AppButton @click="handleBulkAssign" :loading="bulkLoading" class="bg-amber-500 hover:bg-amber-600">
            Assign to All {{ bulkStudentCount }} Students
          </AppButton>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useFeeStore } from '@/stores/fees'
import { useStudentStore } from '@/stores/students'
import { useToastStore } from '@/stores/toast'
import type { Student, FeeStructure } from '@/types'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import SmartDropdown from '@/components/ui/SmartDropdown.vue'
import type { DropdownOption } from '@/components/ui/SmartDropdown.vue'

const feeStore = useFeeStore()
const studentStore = useStudentStore()
const toast = useToastStore()

const activeTab = ref<'structures' | 'assign'>('structures')
const tabs: Array<{ key: 'structures' | 'assign'; label: string }> = [
  { key: 'structures', label: '📋 Fee Structures' },
  { key: 'assign', label: '🎯 Assign to Students' },
]

const feeIcons: Record<string, string> = {
  'Tuition Fee': '📚',
  'Lab Fee': '🔬',
  'Transport Fee': '🚌',
  'Annual Fee': '🗓️',
  'Exam Fee': '📝',
  'Sports Fee': '⚽',
  'Library Fee': '📖',
  'Development Fee': '🏗️',
}

// Stats
const statsRow = computed(() => [
  {
    label: 'Total Fee Types',
    value: new Set(feeStore.structures.map((s) => s.name)).size,
    icon: '🏷️',
    bg: 'bg-white dark:bg-gray-800/50',
    border: 'border-gray-100 dark:border-gray-800',
    text: 'text-gray-900 dark:text-white',
    iconBg: 'bg-amber-50 dark:bg-amber-900/30',
    prefix: '',
  },
  {
    label: 'Total Structures',
    value: feeStore.structures.length,
    icon: '📋',
    bg: 'bg-amber-50/40 dark:bg-amber-900/10',
    border: 'border-amber-100 dark:border-amber-800/30',
    text: 'text-amber-700 dark:text-amber-400',
    iconBg: 'bg-amber-100 dark:bg-amber-800/30',
    prefix: '',
  },
  {
    label: 'Max Annual Fee',
    value: Math.max(...feeStore.structures.map((s) => s.amount), 0),
    icon: '📈',
    bg: 'bg-white dark:bg-gray-800/50',
    border: 'border-gray-100 dark:border-gray-800',
    text: 'text-gray-900 dark:text-white',
    iconBg: 'bg-orange-50 dark:bg-orange-900/30',
    prefix: '₹',
  },
  {
    label: 'Total Assigned',
    value: feeStore.payments.length,
    icon: '✅',
    bg: 'bg-emerald-50/40 dark:bg-emerald-900/10',
    border: 'border-emerald-100 dark:border-emerald-800/30',
    text: 'text-emerald-700 dark:text-emerald-400',
    iconBg: 'bg-emerald-100 dark:bg-emerald-800/30',
    prefix: '',
  },
])

// Class group view
const classGroups = computed(() => {
  const groups = new Map<string, FeeStructure[]>()
  feeStore.structures.forEach((s) => {
    if (!groups.has(s.class_name)) groups.set(s.class_name, [])
    groups.get(s.class_name)!.push(s)
  })
  return Array.from(groups.entries())
    .map(([name, items]) => ({
      name,
      items,
      total: items.reduce((sum: number, i: FeeStructure) => sum + i.amount, 0),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
})

// Assign tab
const assignClassFilter = ref('')
const assignFeeFilter = ref('')

const filteredAssignStudents = computed(() => {
  let s = studentStore.students.filter((s) => s.status === 'active')
  if (assignClassFilter.value) s = s.filter((x) => x.class_name === assignClassFilter.value)
  return s.sort((a, b) => a.name.localeCompare(b.name))
})

function studentPaymentCount(id: number) {
  return feeStore.payments.filter((p) => p.student_id === id).length
}

// Add Structure Modal
const showAddModal = ref(false)
const addForm = reactive({ name: '', class_name: '', amount: 0, due_date: '', academic_year: '2025-26' })

const feeTypeOptions: DropdownOption[] = [
  { value: 'Tuition Fee', label: 'Tuition Fee', icon: '📚' },
  { value: 'Lab Fee', label: 'Lab Fee', icon: '🔬' },
  { value: 'Transport Fee', label: 'Transport Fee', icon: '🚌' },
  { value: 'Annual Fee', label: 'Annual Fee', icon: '🗓️' },
  { value: 'Exam Fee', label: 'Exam Fee', icon: '📝' },
  { value: 'Sports Fee', label: 'Sports Fee', icon: '⚽' },
  { value: 'Library Fee', label: 'Library Fee', icon: '📖' },
  { value: 'Development Fee', label: 'Development Fee', icon: '🏗️' },
]

const classOptions = computed<DropdownOption[]>(() => [
  { value: 'All Classes', label: 'All Classes', icon: '🏫' },
  ...studentStore.classes.map((c) => ({ value: c, label: c, icon: '🎓' })),
])

function openAddModal(presetClass?: string) {
  addForm.name = ''
  addForm.class_name = presetClass || ''
  addForm.amount = 0
  addForm.due_date = ''
  addForm.academic_year = '2025-26'
  showAddModal.value = true
}

function handleAddStructure() {
  if (!addForm.name || !addForm.class_name || !addForm.amount || !addForm.due_date) {
    toast.warning('Please fill all required fields')
    return
  }
  feeStore.addStructure({ ...addForm })
  showAddModal.value = false
}

// Assign Modal
const showAssignModal = ref(false)
const assignTarget = ref<Student | null>(null)
const assignStructureId = ref('')

const relevantStructureOptions = computed<DropdownOption[]>(() => {
  if (!assignTarget.value) return []
  return feeStore.structures
    .filter((s) => s.class_name === assignTarget.value!.class_name || s.class_name === 'All Classes')
    .map((s) => ({
      value: String(s.id),
      label: s.name,
      description: `₹${s.amount.toLocaleString('en-IN')} — due ${s.due_date}`,
      icon: feeIcons[s.name] || '💰',
    }))
})

function openAssignModal(student: Student) {
  assignTarget.value = student
  assignStructureId.value = ''
  showAssignModal.value = true
}

function handleAssignFee() {
  if (!assignTarget.value || !assignStructureId.value) {
    toast.warning('Please select a fee structure')
    return
  }
  feeStore.assignFee(
    assignTarget.value.id,
    assignTarget.value.name,
    assignTarget.value.class_name,
    Number(assignStructureId.value),
  )
  showAssignModal.value = false
}

// Bulk Assign Modal
const showBulkModal = ref(false)
const bulkClass = ref('')
const bulkStructureId = ref('')
const bulkLoading = ref(false)

const bulkStudentCount = computed(() =>
  bulkClass.value
    ? studentStore.students.filter((s) => s.status === 'active' && s.class_name === bulkClass.value).length
    : 0,
)

function openBulkAssign() {
  bulkClass.value = assignClassFilter.value || ''
  bulkStructureId.value = ''
  showBulkModal.value = true
}

async function handleBulkAssign() {
  if (!bulkClass.value || !bulkStructureId.value) {
    toast.warning('Please select a class and fee structure')
    return
  }
  bulkLoading.value = true
  const students = studentStore.students.filter((s) => s.status === 'active' && s.class_name === bulkClass.value)
  let assigned = 0
  for (const s of students) {
    const already = feeStore.payments.find((p) => {
      const struct = feeStore.structures.find((x) => x.id === Number(bulkStructureId.value))
      return p.student_id === s.id && struct && p.fee_name === struct.name
    })
    if (!already) {
      feeStore.assignFee(s.id, s.name, s.class_name, Number(bulkStructureId.value))
      assigned++
    }
  }
  await new Promise((r) => setTimeout(r, 400))
  bulkLoading.value = false
  showBulkModal.value = false
  toast.success(`Assigned fee to ${assigned} students in ${bulkClass.value}`)
}
</script>

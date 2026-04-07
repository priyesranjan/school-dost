<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Action-Oriented Academic Header -->
    <div class="relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-xl shadow-gray-100 dark:border dark:border-gray-800 dark:bg-gray-800/50 dark:shadow-none">
      <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div class="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary-600 dark:bg-primary-900/30">
            📑 Attendance Registry
          </div>
          <h1 class="mt-3 text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            Daily <span class="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">Class Ledger</span>
          </h1>
          <p class="mt-1 text-sm font-medium text-gray-400">
            Mark and monitor student presence for the current academic session.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-4">
          <div class="space-y-1.5">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Target Date</label>
            <div class="relative">
              <input
                v-model="attendanceStore.selectedDate"
                type="date"
                class="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 text-sm font-bold text-gray-700 outline-none transition-all focus:border-primary-300 focus:bg-white focus:ring-4 focus:ring-primary-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-primary-900/20"
              />
            </div>
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Department/Class</label>
            <select
              v-model="selectedClass"
              class="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 text-sm font-bold text-gray-700 outline-none transition-all focus:border-primary-300 focus:bg-white focus:ring-4 focus:ring-primary-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-primary-900/20"
            >
              <option value="">Choose Class...</option>
              <option v-for="cls in studentStore.classes" :key="cls" :value="cls">{{ cls }}</option>
            </select>
          </div>
          <AppButton 
            class="h-[42px] px-8 shadow-lg shadow-primary-200 dark:shadow-none" 
            @click="saveAttendance" 
            :loading="saving"
          >
            Finalize Attendance
          </AppButton>
        </div>
      </div>
      <!-- Background Accents -->
      <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-50/50 blur-3xl dark:bg-primary-900/10"></div>
    </div>

    <!-- Live Analytics Dashboard -->
    <div class="grid grid-cols-2 gap-6 lg:grid-cols-4">
      <div v-for="stat in summaryStats" :key="stat.label" 
           :class="['group relative overflow-hidden rounded-3xl border p-6 transition-all hover:-translate-y-1 hover:shadow-xl', stat.border, stat.bg]">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest opacity-60">{{ stat.label }}</p>
            <p :class="['mt-1 text-3xl font-black tracking-tight', stat.text]">{{ stat.value }}</p>
          </div>
          <div :class="['flex h-12 w-12 items-center justify-center rounded-2xl text-xl shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-6', stat.iconBg]">
            {{ stat.icon }}
          </div>
        </div>
        <!-- Progress Bar -->
        <div class="mt-4 h-1 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
           <div :class="['h-full transition-all duration-1000', stat.barColor]" :style="{ width: `${(stat.value / stats.total) * 100}%` }"></div>
        </div>
      </div>
    </div>

    <!-- Attendance marking console -->
    <AppCard :no-padding="true" class="overflow-hidden shadow-2xl">
      <!-- Toolbar -->
      <div class="flex flex-col gap-4 border-b border-gray-100 bg-gray-50/50 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700 dark:bg-gray-800/50">
        <div>
          <h3 class="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">Student Roster</h3>
          <p class="text-[10px] font-bold text-gray-400 uppercase">{{ classStudents.length }} Candidates Found</p>
        </div>
        <div class="flex gap-2">
          <button @click="markAll('present')" class="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 transition-all hover:bg-emerald-100 active:scale-95 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400">
            ✓ All Present
          </button>
          <button @click="markAll('absent')" class="rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-rose-600 transition-all hover:bg-rose-100 active:scale-95 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400">
            ✕ All Absent
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="bg-gray-50/30 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:bg-gray-900/30">
              <th class="px-8 py-4">ID / Roll</th>
              <th class="px-8 py-4">Student Profile</th>
              <th class="px-8 py-4">Current Class</th>
              <th class="px-8 py-4 text-center">Action Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
            <tr v-for="student in classStudents" :key="student.id" 
                class="group transition-colors hover:bg-primary-50/30 dark:hover:bg-primary-900/5">
              <td class="px-8 py-5">
                <span class="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-black text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  #{{ student.roll_number }}
                </span>
              </td>
              <td class="px-8 py-5">
                <div class="flex items-center gap-4">
                  <div class="relative">
                    <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 text-xs font-black text-white shadow-lg transition-transform group-hover:scale-110">
                      {{ student.name.charAt(0) }}
                    </div>
                    <div v-if="attendanceMap[student.id] === 'present'" class="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-gray-800"></div>
                  </div>
                  <div>
                    <p class="font-black text-gray-900 dark:text-white">{{ student.name }}</p>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Student ID: 2026-{{ 1000 + student.id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-8 py-5 text-xs font-bold text-gray-500 dark:text-gray-400">
                {{ student.class_name }} <span class="mx-1 text-gray-300">|</span> <span class="text-primary-600">SEC-{{ student.section }}</span>
              </td>
              <td class="px-8 py-5">
                <div class="flex justify-center">
                  <div class="inline-flex rounded-2xl bg-gray-100 p-1.5 shadow-inner dark:bg-gray-900">
                    <button
                      v-for="opt in statusOptions"
                      :key="opt.id"
                      @click="setStatus(student.id, opt.id as any)"
                      :class="[
                        'rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300',
                        attendanceMap[student.id] === opt.id
                          ? `${opt.activeClass} shadow-lg scale-105`
                          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                      ]"
                    >
                      {{ opt.label }}
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <EmptyState v-if="!classStudents.length" 
                  title="Initialize Roster" 
                  message="Please select a classroom department to begin marking attendance." 
                  class="py-20" />
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { useStudentStore } from '@/stores/students'
import { useAttendanceStore } from '@/stores/attendance'
import { useToastStore } from '@/stores/toast'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const studentStore = useStudentStore()
const attendanceStore = useAttendanceStore()
const toast = useToastStore()

const selectedClass = ref('')
const saving = ref(false)
const attendanceMap = reactive<Record<number, 'present' | 'absent' | 'late'>>({})

const statusOptions = [
  { id: 'present', label: 'Present', activeClass: 'bg-emerald-500 text-white' },
  { id: 'absent', label: 'Absent', activeClass: 'bg-rose-500 text-white' },
  { id: 'late', label: 'Late', activeClass: 'bg-amber-500 text-white' }
]

const classStudents = computed(() => {
  let students = studentStore.students.filter((s) => s.status === 'active')
  if (selectedClass.value) {
    students = students.filter((s) => s.class_name === selectedClass.value)
  }
  return students.sort((a, b) => a.roll_number.localeCompare(b.roll_number))
})

// Analytics logic
const stats = computed(() => {
  const values = classStudents.value.map((s) => attendanceMap[s.id] || 'present')
  return {
    total: values.length || 1,
    present: values.filter((v) => v === 'present').length,
    absent: values.filter((v) => v === 'absent').length,
    late: values.filter((v) => v === 'late').length,
  }
})

const summaryStats = computed(() => [
  { label: 'Total Enrolled', value: stats.value.total, icon: '👨‍🎓', bg: 'bg-white', border: 'border-gray-100', text: 'text-gray-900', iconBg: 'bg-gray-50', barColor: 'bg-primary-500' },
  { label: 'Present', value: stats.value.present, icon: '✅', bg: 'bg-emerald-50/30', border: 'border-emerald-100', text: 'text-emerald-600', iconBg: 'bg-emerald-50', barColor: 'bg-emerald-500' },
  { label: 'Absent', value: stats.value.absent, icon: '✕', bg: 'bg-rose-50/30', border: 'border-rose-100', text: 'text-rose-600', iconBg: 'bg-rose-50', barColor: 'bg-rose-500' },
  { label: 'Late Arrivals', value: stats.value.late, icon: '🕒', bg: 'bg-amber-50/30', border: 'border-amber-100', text: 'text-amber-600', iconBg: 'bg-amber-50', barColor: 'bg-amber-500' },
])

// Automatic initialization
watch(classStudents, (students) => {
  students.forEach((s) => {
    if (!attendanceMap[s.id]) attendanceMap[s.id] = 'present'
  })
}, { immediate: true })

function setStatus(studentId: number, status: 'present' | 'absent' | 'late') {
  attendanceMap[studentId] = status
}

function markAll(status: 'present' | 'absent' | 'late') {
  classStudents.value.forEach((s) => {
    attendanceMap[s.id] = status
  })
}

async function saveAttendance() {
  if (!classStudents.value.length) {
    toast.warning('No selection made. Please choose a class first.')
    return
  }

  saving.value = true
  try {
    const records = classStudents.value.map((s) => ({
      student_id: s.id,
      student_name: s.name,
      roll_number: s.roll_number,
      status: attendanceMap[s.id] || ('present' as const),
    }))
    attendanceStore.markAttendance(records)
    toast.success(`Registry finalized for ${selectedClass.value}`)
  } finally {
    saving.value = false
  }
}
</script>

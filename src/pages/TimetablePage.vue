<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Schedule Logistics Header -->
    <div class="relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-xl shadow-gray-100 dark:border dark:border-gray-800 dark:bg-gray-800/50 dark:shadow-none">
      <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div class="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:bg-indigo-900/30">
            📅 Academic Logistics
          </div>
          <h1 class="mt-3 text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            Institutional <span class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Time Ledger</span>
          </h1>
          <p class="mt-1 text-sm font-medium text-gray-400">
            Coordinate classroom resources, faculty allocations, and session timing.
          </p>
        </div>
        <div class="flex items-center gap-4">
           <div v-for="stat in summaryStats" :key="stat.title" class="hidden sm:block text-right">
              <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">{{ stat.title }}</p>
              <p class="text-xl font-black text-gray-900 dark:text-white">{{ stat.value }}</p>
           </div>
        </div>
      </div>
      <!-- Background Accents -->
      <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-50/50 blur-3xl dark:bg-indigo-900/10"></div>
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- Slot Configuration Console -->
      <div class="lg:col-span-2 space-y-8">
        <AppCard title="Session Architect" class="shadow-2xl overflow-visible">
          <template #header-actions>
            <span class="text-[10px] font-black uppercase tracking-widest text-primary-500">New Entry</span>
          </template>
          <form @submit.prevent="handleAdd" class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <AppInput v-model="form.class_name" type="select" label="Target Class" required class="font-bold">
              <option value="">Select class...</option>
              <option v-for="cls in studentStore.classes" :key="cls" :value="cls">{{ cls }}</option>
            </AppInput>
            <AppInput v-model="form.day" type="select" label="Day of Week" required class="font-bold">
              <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
            </AppInput>
            <div class="grid grid-cols-2 gap-4">
               <AppInput v-model="form.period" label="Slot ID" placeholder="e.g. P1" required class="font-bold" />
               <AppInput v-model="form.subject" label="Subject Domain" placeholder="Physics" required class="font-bold" />
            </div>
            <AppInput v-model="form.teacher" label="Faculty Member" placeholder="Assign teacher..." required class="font-bold" />
            
            <div class="sm:col-span-2 grid grid-cols-2 gap-6 bg-gray-50/50 p-4 rounded-2xl dark:bg-gray-900/30">
              <AppInput v-model="form.start_time" type="time" label="Commencement" required />
              <AppInput v-model="form.end_time" type="time" label="Conclusion" required />
            </div>

            <div class="sm:col-span-2 flex items-center justify-between">
              <label class="flex items-center gap-3 cursor-pointer group">
                <div class="relative flex h-5 w-5 items-center justify-center rounded-md border-2 border-gray-200 transition-all group-hover:border-primary-400 dark:border-gray-700">
                  <input v-model="form.send_sms" type="checkbox" class="peer absolute h-full w-full opacity-0" />
                  <div class="h-2 w-2 rounded-sm bg-primary-500 scale-0 transition-transform peer-checked:scale-100"></div>
                </div>
                <span class="text-xs font-bold text-gray-500 group-hover:text-gray-700 transition-colors">Broadcast update to Guardians via SMS</span>
              </label>
              <AppButton type="submit" shadow="large">Deploy Slot</AppButton>
            </div>
          </form>
        </AppCard>

        <!-- Dynamic Timeline Registry -->
        <AppCard :no-padding="true" class="shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between border-b border-gray-50 bg-gray-50/30 px-8 py-6 dark:border-gray-700 dark:bg-gray-800/30">
             <div>
                <h3 class="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">Active Schedule Registry</h3>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{{ sortedEntries.length }} Verified Allocations</p>
             </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead>
                <tr class="bg-gray-50/10 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <th class="px-8 py-4">Placement</th>
                  <th class="px-8 py-4">Temporal Coordinates</th>
                  <th class="px-8 py-4">Curriculum</th>
                  <th class="px-8 py-4">Faculty</th>
                  <th class="px-8 py-4 text-right">Management</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
                <tr v-for="e in sortedEntries" :key="e.id" 
                    class="group transition-all hover:bg-indigo-50/30 dark:hover:bg-indigo-900/5">
                  <td class="px-8 py-5">
                    <p class="font-black text-gray-900 dark:text-white">{{ e.class_name }}</p>
                    <p class="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{{ e.day }}</p>
                  </td>
                  <td class="px-8 py-5">
                    <div class="flex items-center gap-3">
                       <span class="rounded-lg bg-gray-100 px-2.5 py-1 text-[10px] font-black text-gray-500 dark:bg-gray-800">{{ e.period }}</span>
                       <span class="text-xs font-bold text-gray-400">{{ e.start_time }} — {{ e.end_time }}</span>
                    </div>
                  </td>
                  <td class="px-8 py-5 font-black text-gray-700 dark:text-gray-300 uppercase tracking-tighter">{{ e.subject }}</td>
                  <td class="px-8 py-5">
                    <div class="flex items-center gap-2">
                       <div class="h-6 w-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-[8px] font-black text-white shadow-md">
                          {{ e.teacher.charAt(0) }}
                       </div>
                       <span class="text-xs font-bold text-gray-600 dark:text-gray-400">{{ e.teacher }}</span>
                    </div>
                  </td>
                  <td class="px-8 py-5 text-right">
                    <div class="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button @click="openEdit(e.id)" class="rounded-xl p-2 text-gray-400 hover:bg-white hover:text-indigo-600 shadow-sm border border-transparent hover:border-gray-100 dark:hover:bg-gray-800">
                         <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button @click="timetableStore.deleteEntry(e.id)" class="rounded-xl p-2 text-gray-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20">
                         <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <EmptyState v-if="!timetableStore.entries.length" title="Timetable Silent" message="Initialize the academic schedule by adding your first slot." />
        </AppCard>
      </div>

      <!-- Import Side Panel -->
      <div class="space-y-8">
        <AppCard title="Bulk Sync Engine" class="shadow-xl">
          <div class="space-y-6">
            <div class="rounded-2xl bg-indigo-50/50 p-4 dark:bg-indigo-900/10">
              <p class="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2">Schema Protocol</p>
              <code class="text-[9px] block bg-white p-2 rounded-lg border border-indigo-100 dark:bg-gray-900 dark:border-gray-800">
                class, day, period, subject, teacher, start, end
              </code>
            </div>
            
            <div class="group relative flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50/50 py-10 transition-all hover:border-primary-300 hover:bg-white dark:border-gray-800 dark:bg-gray-900/30">
              <input
                ref="csvInputRef"
                type="file"
                accept=".csv,text/csv"
                class="absolute h-full w-full cursor-pointer opacity-0"
              />
              <div class="text-3xl mb-2 group-hover:scale-125 transition-transform">📂</div>
              <p class="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-primary-600">Universal CSV Upload</p>
            </div>

            <div class="space-y-4">
               <label class="flex items-center gap-3 cursor-pointer group">
                <div class="relative flex h-5 w-5 items-center justify-center rounded-md border-2 border-gray-100 transition-all group-hover:border-primary-400 dark:border-gray-800">
                  <input v-model="importSendSms" type="checkbox" class="peer absolute h-full w-full opacity-0" />
                  <div class="h-2 w-2 rounded-sm bg-primary-500 scale-0 transition-transform peer-checked:scale-100"></div>
                </div>
                <span class="text-xs font-bold text-gray-500 group-hover:text-gray-700">Trigger Genesis SMS Broadast</span>
              </label>
              <AppButton class="w-full h-[48px] shadow-xl" @click="handleImportCsv">Initiate Batch Import</AppButton>
            </div>

            <div v-if="importReport" class="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-900/30 dark:bg-emerald-900/10">
              <h4 class="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-3">Sync Synopsis</h4>
              <div class="space-y-1 text-xs font-bold text-emerald-800 dark:text-emerald-400">
                <p>Allocations Built: {{ importReport.added }}</p>
                <p v-if="importReport.classConflicts.length" class="text-rose-600 underline">Room Conflicts DETECTED ({{ importReport.classConflicts.length }})</p>
                <p v-if="importReport.teacherConflicts.length" class="text-rose-600 underline">Faculty Overlaps DETECTED ({{ importReport.teacherConflicts.length }})</p>
              </div>
            </div>
          </div>
        </AppCard>
      </div>
    </div>

    <!-- Edit Modal Overhaul -->
    <AppModal v-model="showEditModal" title="Update Session Logistics" size="md">
      <form @submit.prevent="handleUpdate" class="p-2 grid grid-cols-1 gap-6 sm:grid-cols-2">
         <AppInput v-model="editForm.class_name" type="select" label="Target Class" required class="font-bold">
           <option v-for="cls in studentStore.classes" :key="cls" :value="cls">{{ cls }}</option>
         </AppInput>
         <AppInput v-model="editForm.day" type="select" label="Day Assignment" required class="font-bold">
           <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
         </AppInput>
         <AppInput v-model="editForm.period" label="Session ID" required class="font-bold" />
         <AppInput v-model="editForm.subject" label="Subject Domain" required class="font-bold" />
         <AppInput v-model="editForm.teacher" label="Assigned Faculty" required class="font-bold sm:col-span-2" />
         <div class="sm:col-span-2 grid grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-2xl dark:bg-gray-900/30">
           <AppInput v-model="editForm.start_time" type="time" label="Genesis" required />
           <AppInput v-model="editForm.end_time" type="time" label="Termination" required />
         </div>
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3 p-2">
          <AppButton variant="secondary" @click="showEditModal = false" class="border-none">Dismiss</AppButton>
          <AppButton @click="handleUpdate" shadow="large">Commit Synchronized Update</AppButton>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useTimetableStore } from '@/stores/timetable'
import { useStudentStore } from '@/stores/students'
import { useSmsStore } from '@/stores/sms'
import { useToastStore } from '@/stores/toast'
import StatCard from '@/components/ui/StatCard.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const timetableStore = useTimetableStore()
const studentStore = useStudentStore()
const smsStore = useSmsStore()
const toast = useToastStore()

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const dayIndex: Record<string, number> = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 }

// High-fidelity Summary Stats
const summaryStats = computed(() => [
  { title: "Total Allocations", value: timetableStore.entries.length },
  { title: "Active Venues", value: timetableStore.classes.length },
  { title: "Network Comms", value: smsStore.logs.filter((l) => l.type === 'schedule').length }
])

const form = reactive({
  class_name: '',
  day: 'Monday' as 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday',
  period: 'P1',
  subject: '',
  teacher: '',
  start_time: '09:00',
  end_time: '09:45',
  send_sms: true,
})

const showEditModal = ref(false)
const editingId = ref<number | null>(null)
const csvInputRef = ref<HTMLInputElement | null>(null)
const importSendSms = ref(false)
const importReport = ref<{
  totalRows: number
  added: number
  classConflicts: string[]
  teacherConflicts: string[]
  invalidRows: string[]
} | null>(null)
const editForm = reactive({
  class_name: '',
  day: 'Monday' as 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday',
  period: '',
  subject: '',
  teacher: '',
  start_time: '09:00',
  end_time: '09:45',
})

const sortedEntries = computed(() =>
  [...timetableStore.entries].sort((a, b) => {
    if (a.class_name !== b.class_name) return a.class_name.localeCompare(b.class_name)
    if (a.day !== b.day) return dayIndex[a.day] - dayIndex[b.day]
    return a.period.localeCompare(b.period)
  })
)

function handleAdd() {
  if (!form.class_name || !form.subject.trim() || !form.teacher.trim() || !form.period.trim()) {
    toast.warning('Logic fragmentation: Please populate mandatory parameters.')
    return
  }

  timetableStore.addEntry(
    {
      class_name: form.class_name,
      day: form.day,
      period: form.period.trim(),
      subject: form.subject.trim(),
      teacher: form.teacher.trim(),
      start_time: form.start_time,
      end_time: form.end_time,
    },
    form.send_sms
  )

  toast.success('Session temporal lock initiated.')
  form.subject = ''
  form.teacher = ''
}

function openEdit(id: number) {
  const entry = timetableStore.entries.find((e) => e.id === id)
  if (!entry) return
  editingId.value = id
  Object.assign(editForm, {
    class_name: entry.class_name,
    day: entry.day,
    period: entry.period,
    subject: entry.subject,
    teacher: entry.teacher,
    start_time: entry.start_time,
    end_time: entry.end_time,
  })
  showEditModal.value = true
}

function handleUpdate() {
  if (!editingId.value) return
  const ok = timetableStore.updateEntry(editingId.value, {
    class_name: editForm.class_name,
    day: editForm.day,
    period: editForm.period.trim(),
    subject: editForm.subject.trim(),
    teacher: editForm.teacher.trim(),
    start_time: editForm.start_time,
    end_time: editForm.end_time,
  })
  if (ok) {
    toast.success('Ledger revision synchronized.')
    showEditModal.value = false
    editingId.value = null
  }
}

async function handleImportCsv() {
  const file = csvInputRef.value?.files?.[0]
  if (!file) {
    toast.warning('Batch input failure: No file stream detected.')
    return
  }

  try {
    const text = await file.text()
    importReport.value = timetableStore.importFromCsv(text, importSendSms.value)
    if (csvInputRef.value) csvInputRef.value.value = ''
    toast.success('Batch synchronization logic executed.')
  } catch {
    toast.error('Batch integration error: Terminal failure.')
  }
}
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-10 animate-fade-in-up print:m-0 print:p-0">
    <!-- Main UI (Hidden during print via scoped style below) -->
    <div class="space-y-10 print:hidden">
      <!-- Sophisticated Header -->
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div class="space-y-2">
          <h1 class="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Identity Records Matrix</h1>
          <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Manage and issue high-fidelity institutional credentials.
          </p>
        </div>
        
        <div class="flex flex-wrap items-center gap-4 bg-white p-2 rounded-3xl shadow-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
          <div class="flex items-center gap-4 px-4 py-2 border-r border-gray-100 dark:border-gray-700">
             <div class="flex flex-col">
                <span class="text-[10px] font-black uppercase text-primary-600 tracking-tighter">Academic Block</span>
                <select v-model="classFilter" class="bg-transparent text-sm font-black text-gray-900 dark:text-white focus:outline-none cursor-pointer">
                   <option value="">All Blocks</option>
                   <option v-for="cls in studentStore.classes" :key="cls" :value="cls">{{ cls }}</option>
                </select>
             </div>
             <div class="h-8 w-px bg-gray-100 dark:bg-gray-700 mx-2"></div>
             <div class="flex flex-col">
                <span class="text-[10px] font-black uppercase text-amber-600 tracking-tighter">Issue Stream</span>
                <select v-model="issueMode" class="bg-transparent text-sm font-black text-gray-900 dark:text-white focus:outline-none cursor-pointer">
                   <option value="id">Student ID</option>
                   <option value="bus">Bus Pass</option>
                </select>
             </div>
          </div>
          <div class="flex gap-4 px-2">
            <AppButton variant="secondary" size="sm" class="rounded-2xl border-none bg-gray-50 text-gray-600 hover:bg-gray-100" @click="toggleAll">
               {{ allSelected ? 'Deselect Block' : 'Select Class Block' }}
            </AppButton>
            <AppButton variant="primary" size="sm" class="rounded-2xl px-8 shadow-xl shadow-primary-200" @click="printCards">
               Output {{ issueMode === 'id' ? 'IDs' : 'Passes' }} ({{ selectedIds.length }})
            </AppButton>
          </div>
        </div>
      </div>

      <!-- Member Registry Card -->
      <AppCard title="Institutional Registry" :no-padding="true" class="border-none shadow-2xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                <th class="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-gray-400">Select</th>
                <th class="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-gray-400">Member Identity</th>
                <th class="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-gray-400">Identity Hash (Roll)</th>
                <th class="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-gray-400">Academic Placement</th>
                <th class="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-gray-400">Parental Registry</th>
                <th class="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
              <tr v-for="s in filteredStudents" :key="s.id" 
                  class="group hover:bg-indigo-50/30 dark:hover:bg-indigo-900/5 transition-all">
                <td class="px-8 py-4">
                  <input v-model="selectedIds" :value="s.id" type="checkbox" 
                         class="h-5 w-5 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                </td>
                <td class="px-8 py-4">
                  <div class="flex items-center gap-4 cursor-pointer" @click="openPreview(s)">
                    <div class="h-10 w-10 relative">
                      <img v-if="s.profile_photo_url" :src="s.profile_photo_url" alt="" class="h-full w-full rounded-2xl object-cover shadow-sm group-hover:scale-110 transition-transform" />
                      <div v-else class="flex h-full w-full items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 text-xs font-black">{{ s.name.charAt(0) }}</div>
                      <div class="absolute -bottom-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <p class="font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{{ s.name }}</p>
                      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter italic">Verified Member</p>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-4">
                  <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg text-[10px] font-mono font-black text-gray-600 dark:text-gray-400">
                    REF:{{ s.roll_number }}
                  </span>
                </td>
                <td class="px-8 py-4">
                  <div class="flex items-center gap-2">
                     <div class="h-1.5 w-1.5 rounded-full bg-indigo-400"></div>
                     <p class="text-xs font-black text-gray-700 dark:text-gray-300">{{ s.class_name }} · {{ s.section }}</p>
                  </div>
                </td>
                <td class="px-8 py-4">
                  <p class="text-[10px] font-bold text-gray-900 dark:text-white tracking-widest">{{ s.phone }}</p>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{{ s.parent_name }}</p>
                </td>
                <td class="px-8 py-4 text-right">
                  <AppButton variant="secondary" size="xs" class="rounded-xl border-none bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4" @click="openPreview(s)">
                    Visualize
                  </AppButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <EmptyState v-if="!filteredStudents.length" title="No members detected" message="Adjust your identity filters to visualize records." />
      </AppCard>

      <!-- Individual Preview Modal -->
      <AppModal v-model="previewActive" :title="`Identity Visualization: ${previewStudent?.name}`" size="md">
        <div class="flex flex-col items-center py-10 space-y-10 bg-gray-50/50 dark:bg-gray-900/10 rounded-3xl border border-gray-100 dark:border-gray-800">
          <div class="flex gap-4 bg-white dark:bg-gray-800 p-1.5 rounded-2xl shadow-inner border border-gray-100 dark:border-gray-700 mb-4 transition-all">
             <button @click="issueMode = 'id'" :class="['px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all', issueMode === 'id' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50']">Member ID</button>
             <button @click="issueMode = 'bus'" :class="['px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all', issueMode === 'bus' ? 'bg-amber-500 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50']">Bus Pass</button>
          </div>

          <div class="transition-all transform hover:scale-[1.02]">
            <IdCard v-if="previewStudent && issueMode === 'id'" :student="previewStudent" class="shadow-2xl" />
            <BusPass v-if="previewStudent && issueMode === 'bus'" :student="previewStudent" routeNo="A-12" stopName="Central Plaza Hub" />
          </div>
          
          <div class="flex gap-4">
             <AppButton variant="secondary" @click="previewActive = false" class="rounded-2xl border-none font-black text-xs px-8 h-12 uppercase tracking-widest">
                Close
             </AppButton>
             <AppButton @click="printSingle" class="rounded-2xl font-black text-xs px-10 h-12 uppercase tracking-widest shadow-2xl" :class="issueMode === 'id' ? 'bg-indigo-600' : 'bg-amber-500 shadow-amber-100'">
                Output {{ issueMode === 'id' ? 'Identity' : 'Bus Pass' }}
             </AppButton>
          </div>
        </div>
        <template #footer>
           <div class="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              <div :class="['h-2 w-2 rounded-full animate-pulse', issueMode === 'id' ? 'bg-indigo-500' : 'bg-amber-500']"></div>
              {{ issueMode === 'id' ? 'Identity System Ready' : 'Logistic System Ready' }}
           </div>
        </template>
      </AppModal>
    </div>

    <!-- BULLETPROOF PRINT ENGINE (TELEPORTED TO BODY AT ROOT) -->
    <Teleport to="body">
       <div v-if="isPrinting" id="id-print-area" class="bg-white !m-0 !p-10 fixed inset-0 z-[9999] overflow-y-scroll print:overflow-visible">
         <div v-if="issueMode === 'id'" class="grid grid-cols-2 gap-x-8 gap-y-12">
           <div v-for="s in selectedStudentsForPrint" :key="s.id" class="flex justify-center items-center break-inside-avoid">
             <IdCard :student="s" />
           </div>
         </div>
         <div v-if="issueMode === 'bus'" class="grid grid-cols-2 gap-x-8 gap-y-12">
           <div v-for="s in selectedStudentsForPrint" :key="s.id" class="flex justify-center items-center break-inside-avoid">
             <BusPass :student="s" routeNo="A-12" stopName="Central Plaza Hub" />
           </div>
         </div>
       </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import { useStudentStore } from '@/stores/students'
import { useToastStore } from '@/stores/toast'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import IdCard from '@/components/common/IdCard.vue'
import BusPass from '@/components/common/BusPass.vue'

const studentStore = useStudentStore()
const toast = useToastStore()

const classFilter = ref('')
const issueMode = ref<'id' | 'bus'>('id')
const selectedIds = ref<number[]>([])

const previewActive = ref(false)
const previewStudent = ref<any>(null)
const isPrinting = ref(false)
const printIds = ref<number[]>([])

const filteredStudents = computed(() => {
  if (!classFilter.value) return studentStore.students
  return studentStore.students.filter((s) => s.class_name === classFilter.value)
})

const selectedStudentsForPrint = computed(() => {
  return studentStore.students.filter((s) => printIds.value.includes(s.id))
})

const allSelected = computed(() =>
  filteredStudents.value.length > 0 && filteredStudents.value.every((s) => selectedIds.value.includes(s.id))
)

function toggleAll() {
  if (allSelected.value) {
    selectedIds.value = selectedIds.value.filter((id) => !filteredStudents.value.some((s) => s.id === id))
    return
  }
  const set = new Set(selectedIds.value)
  filteredStudents.value.forEach((s) => set.add(s.id))
  selectedIds.value = Array.from(set)
}

function openPreview(student: any) {
  previewStudent.value = student
  previewActive.value = true
}

async function triggerPrint(ids: number[]) {
  printIds.value = ids
  isPrinting.value = true
  
  // Wait for Vue to render the teleported print area and for the browser to paint it
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 400))

  // Use requestAnimationFrame to ensure layout is complete before print
  await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))

  window.print()

  // Cleanup: give the browser a tick after print() returns before removing the DOM
  await nextTick()
  isPrinting.value = false
  printIds.value = []
}

function printSingle() {
  if (!previewStudent.value) return
  triggerPrint([previewStudent.value.id])
}

function printCards() {
  if (!selectedIds.value.length) {
    toast.warning('Member selection required for identity output.')
    return
  }
  triggerPrint([...selectedIds.value])
}
</script>

<style>
/* GLOBAL PRINT Hider - Force all layout containers to vanish */
@media print {
  /* HIDE EVERYTHING EXCEPT THE TELEPORTED ENGINE */
  #app, 
  header, 
  aside, 
  main,
  .print\:hidden {
    display: none !important;
  }

  /* RESET BODY FOR PAPER OUTPUT */
  body {
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
    height: auto !important;
    overflow: visible !important;
    display: block !important;
  }

  /* SHOW ONLY THE PRINT AREA */
  #id-print-area {
    display: block !important;
    visibility: visible !important;
    position: static !important;
    /* Reset all inset values set by Tailwind's inset-0 (top/right/bottom/left: 0) */
    top: auto !important;
    right: auto !important;
    bottom: auto !important;
    left: auto !important;
    width: 100% !important;
    height: auto !important;
    min-height: unset !important;
    /* Critical: allow full content to flow onto multiple print pages */
    overflow: visible !important;
    z-index: auto !important;
    padding: 0 !important;
    background: white !important;
  }

  .break-inside-avoid {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
  }

  @page {
    size: A4;
    margin: 10mm;
  }
}
</style>

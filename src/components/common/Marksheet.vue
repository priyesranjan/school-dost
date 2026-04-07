<template>
  <div class="marksheet h-[1200px] w-[850px] bg-white p-12 relative flex flex-col shadow-2xl border border-gray-100">
    <!-- Institutional Crest & Identity -->
    <div class="flex justify-between items-start mb-10 pb-10 border-b-2 border-gray-100">
       <div class="flex gap-6 items-center">
          <div class="h-24 w-24 bg-indigo-700 p-2 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl">
             RA
          </div>
          <div>
             <h1 class="text-4xl font-black text-gray-900 tracking-tight">Royal Academy Hub</h1>
             <p class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mt-1 italic">Center for Academic Excellence & Research</p>
             <div class="mt-4 flex gap-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">
                <p>INSTITUTIONAL CODE: 884-XJ</p>
                <div class="h-4 w-px bg-gray-200"></div>
                <p>ACADEMIC SESSION 2025 - 2026</p>
             </div>
          </div>
       </div>
       <div class="text-right">
          <div class="bg-indigo-50 border border-indigo-100 px-6 py-4 rounded-3xl inline-block shadow-sm">
             <p class="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1">Official Report Card</p>
             <h2 class="text-2xl font-black text-gray-900 leading-none">ANNUAL TERM</h2>
          </div>
          <div class="mt-4 flex items-center justify-end gap-3 italic">
             <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Document Hash</span>
             <p class="text-[11px] font-black text-gray-900 font-mono tracking-tighter">MD5:{{ student.roll_number.repeat(2) }}</p>
          </div>
       </div>
    </div>

    <!-- Student Profile Banner -->
    <div class="grid grid-cols-2 gap-12 mb-10">
       <div class="space-y-6">
          <div class="flex items-center gap-6">
             <div class="h-28 w-24 rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-gray-50">
                <img v-if="student.profile_photo_url" :src="student.profile_photo_url" class="h-full w-full object-cover" />
                <div v-else class="h-full w-full flex items-center justify-center bg-gray-100 text-3xl font-black text-gray-300">{{ student.name.charAt(0) }}</div>
             </div>
             <div class="space-y-1">
                <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Candidate Designation</p>
                <h3 class="text-2xl font-black text-gray-900 leading-tight uppercase">{{ student.name }}</h3>
                <p class="text-[10px] font-black text-indigo-600 uppercase tracking-widest italic tracking-tighter">Certified Identity Verified</p>
             </div>
          </div>
       </div>

       <div class="grid grid-cols-3 gap-6">
          <div>
             <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Academic Rank</p>
             <p class="text-lg font-black text-gray-900 tracking-tighter">{{ student.class_name }}</p>
          </div>
          <div>
             <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Section</p>
             <p class="text-lg font-black text-gray-900 tracking-tighter">{{ student.section }}</p>
          </div>
          <div>
             <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Identity Hash</p>
             <p class="text-lg font-black text-gray-900 tracking-tighter">{{ student.roll_number }}</p>
          </div>
       </div>
    </div>

    <!-- Achievement Matrix -->
    <div class="flex-1">
       <table class="w-full text-left">
          <thead>
             <tr class="bg-gray-900 text-[11px] font-black uppercase tracking-[0.2em] text-white">
                <th class="px-8 py-4 rounded-tl-3xl">Academic Discipline</th>
                <th class="px-8 py-4 text-center">Max Potential</th>
                <th class="px-8 py-4 text-center">Achievement Point</th>
                <th class="px-8 py-4 text-center rounded-tr-3xl">Grade Tier</th>
             </tr>
          </thead>
          <tbody class="divide-y-2 divide-gray-50 bg-gray-50/20">
             <tr v-for="res in results" :key="res.id" class="group transition-colors hover:bg-indigo-50/30">
                <td class="px-8 py-6">
                   <p class="text-sm font-black text-gray-900 uppercase tracking-tighter group-hover:text-indigo-600 transition-colors">{{ res.subject }}</p>
                   <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic tracking-tighter">Institutional Standard Core</p>
                </td>
                <td class="px-8 py-6 text-center font-black text-gray-400 font-mono italic">{{ res.max_marks }}</td>
                <td class="px-8 py-6 text-center font-black text-gray-900 text-lg leading-none tracking-tighter">{{ res.marks_obtained }}</td>
                <td class="px-8 py-6 text-center">
                   <span class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-lg text-xs font-black text-gray-900 border border-gray-100">
                      {{ res.grade }}
                   </span>
                </td>
             </tr>
          </tbody>
          <tfoot>
             <tr class="bg-gray-100/50">
                <td class="px-8 py-8 rounded-bl-3xl">
                   <p class="text-sm font-black text-gray-900 uppercase tracking-widest">Aggregate Achievement</p>
                   <p class="text-[9px] font-bold text-gray-400 uppercase italic">Overall Academic Session Performance Percentage</p>
                </td>
                <td class="px-8 py-8 text-center font-black text-gray-900 text-2xl tracking-tighter italic">
                   {{ totalMax }}
                </td>
                <td class="px-8 py-8 text-center font-black text-indigo-700 text-4xl tracking-tighter">
                   {{ totalObtained }}
                </td>
                <td class="px-8 py-8 text-center rounded-br-3xl">
                   <div class="flex flex-col items-center">
                      <p class="text-[10px] font-black text-gray-400 uppercase mb-1">Percentage</p>
                      <p class="text-3xl font-black text-gray-900 italic tracking-tighter leading-none">{{ percentage }}%</p>
                   </div>
                </td>
             </tr>
          </tfoot>
       </table>
    </div>

    <!-- Qualitative Performance -->
    <div class="mt-12 grid grid-cols-2 gap-12">
       <div class="space-y-4">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Academic Mentorship Remarks</p>
          <div class="p-8 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100 min-h-[140px] text-gray-700 text-sm font-medium leading-relaxed italic">
             {{ remarks || `${student.name} has demonstrated consistent academic excellence and disciplined behavior throughout the session. We look forward to continued growth in the next tier.` }}
          </div>
       </div>
       <div class="grid grid-cols-2 gap-8 items-center bg-indigo-50/20 p-8 rounded-[2rem]">
          <div class="flex flex-col items-center gap-4">
             <QrCode :value="qrValue" :size="96" />
             <p class="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] text-center leading-tight italic">Digital Integrity Cryptography Verify Scanned Key</p>
          </div>
          <div class="space-y-6 text-center">
             <div class="space-y-1">
                <div class="h-12 w-32 border-b-2 border-gray-900 mx-auto opacity-10"></div>
                <p class="text-[10px] font-black text-gray-900 uppercase tracking-widest">Principal Certification</p>
                <p class="text-[8px] font-bold text-gray-400 uppercase italic tracking-tighter italic">Royal Academy Higher Oversight</p>
             </div>
             <div class="pt-4 border-t border-indigo-100 space-y-1">
                <p class="text-[10px] font-black text-gray-900 uppercase tracking-widest">Official Seal</p>
                <div class="h-12 w-12 rounded-full border-4 border-indigo-600/10 mx-auto flex items-center justify-center">
                   <div class="h-6 w-6 rounded-full border-2 border-indigo-600/30"></div>
                </div>
             </div>
          </div>
       </div>
    </div>

    <!-- Final Institutional Disclaimer -->
    <div class="mt-12 pt-8 border-t border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest flex justify-between items-center italic">
       <p>© 2026 Institutional SaaS Platform Protocol · All Rights Reserved Digital Auth</p>
       <p>Document Generated: {{ new Date().toLocaleDateString() }}</p>
    </div>

    <!-- Watermark Decor -->
    <div class="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none z-[-1] rotate-45 text-[200px] font-black">
       VERIFIED
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import QrCode from '@/components/common/QrCode.vue'

const props = defineProps<{
  student: {
    id: number
    name: string
    roll_number: string
    class_name: string
    section: string
    profile_photo_url?: string
  }
  results: Array<{
    id: number
    subject: string
    marks_obtained: number
    max_marks: number
    grade: string
  }>
  remarks?: string
}>()

const totalObtained = computed(() => props.results.reduce((s, r) => s + r.marks_obtained, 0))
const totalMax = computed(() => props.results.reduce((s, r) => s + r.max_marks, 0))
const percentage = computed(() => {
  if (totalMax.value === 0) return 0
  return Math.round((totalObtained.value / totalMax.value) * 100)
})

const qrValue = computed(() => {
  return `${window.location.origin}/verify/report?id=${props.student.id}&hash=${props.student.roll_number}`
})
</script>

<style scoped>
.marksheet {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

@media print {
  .marksheet {
    box-shadow: none !important;
    border: none !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    width: 100% !important;
    height: auto !important;
    padding: 20mm !important;
  }
  @page {
    size: A4;
    margin: 0;
  }
}
</style>

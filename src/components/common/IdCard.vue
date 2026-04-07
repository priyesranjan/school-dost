<template>
  <div class="id-card-container relative w-[350px] h-[220px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex group transition-all duration-500 hover:shadow-primary-200/50">
    <!-- Brand Siding -->
    <div class="w-6 bg-gradient-to-b from-primary-600 via-indigo-600 to-purple-700 relative">
       <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_0%,white,transparent)]"></div>
    </div>

    <!-- Identity Body -->
    <div class="flex-1 flex flex-col p-4 relative">
       <!-- Card Header -->
       <div class="flex justify-between items-start mb-3">
          <div class="space-y-0.5">
             <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">Institutional ID</h3>
             <p class="text-xs font-black text-gray-900 tracking-tight">Royal Academy ERP</p>
          </div>
          <div class="h-8 w-8 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
             <span class="text-[10px] font-black text-indigo-600">RE</span>
          </div>
       </div>

       <!-- Bio Section -->
       <div class="flex gap-4 items-center flex-1">
          <div class="relative">
             <div class="h-20 w-20 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-gray-50">
                <img v-if="student.profile_photo_url" :src="student.profile_photo_url" class="h-full w-full object-cover" />
                <div v-else class="h-full w-full flex items-center justify-center bg-primary-50 text-2xl font-black text-primary-700">
                   {{ student.name.charAt(0) }}
                </div>
             </div>
             <!-- Verification Pulse -->
             <div class="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                <div class="h-1.5 w-1.5 bg-white rounded-full animate-pulse"></div>
             </div>
          </div>

          <div class="flex-1 space-y-2">
             <div>
                <p class="text-[9px] font-black uppercase tracking-widest text-gray-400">Student Identity</p>
                <h2 class="text-base font-black text-gray-900 leading-tight">{{ student.name }}</h2>
             </div>
             
             <div class="grid grid-cols-2 gap-x-2 gap-y-1">
                <div>
                   <p class="text-[8px] font-bold text-gray-400 uppercase">Class/Sec</p>
                   <p class="text-[10px] font-black text-gray-800">{{ student.class_name }} - {{ student.section }}</p>
                </div>
                <div>
                   <p class="text-[8px] font-bold text-gray-400 uppercase">Roll Number</p>
                   <p class="text-[10px] font-black text-gray-800">#{{ student.roll_number }}</p>
                </div>
             </div>
          </div>
       </div>

       <!-- Card Footer -->
       <div class="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
          <div class="flex items-center gap-2">
             <div class="text-[8px] font-bold text-gray-400 leading-none">
                <p class="mb-0.5 uppercase">Emergency Contact</p>
                <p class="text-indigo-600 font-black">+91 {{ student.phone }}</p>
             </div>
          </div>
          
          <div class="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
             <QrCode :value="qrValue" :size="24" />
             <span class="text-[8px] font-black text-gray-500 uppercase tracking-tighter">Verified</span>
          </div>
       </div>
    </div>

    <!-- Print Only Cut Lines (Optional visual cue) -->
    <div class="absolute top-0 right-0 p-2 print:hidden">
       <span class="text-[8px] font-black text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">PREVIEW MODE</span>
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
    phone: string
    parent_name: string
    profile_photo_url?: string
    admission_date: string
  }
}>()

const qrValue = computed(() => {
  return `${window.location.origin}/students/${props.student.id}/verify`
})
</script>

<style scoped>
.id-card-container {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

@media print {
  .id-card-container {
    box-shadow: none !important;
    border: 1px solid #f3f4f6 !important;
  }
}
</style>

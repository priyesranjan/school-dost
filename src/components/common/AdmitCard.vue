<template>
  <div class="admit-card relative w-[450px] h-[300px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col group transition-all duration-500">
    <!-- Institutional Header -->
    <div class="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-4 text-white">
       <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
             <div class="h-10 w-10 bg-white/20 rounded-xl backdrop-blur-md flex items-center justify-center border border-white/30">
                <span class="text-xs font-black">RE</span>
             </div>
             <div>
                <h3 class="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Examination Entry Pass</h3>
                <p class="text-xs font-black tracking-tight">Royal Academy Institutional Hub</p>
             </div>
          </div>
          <div class="text-right">
             <p class="text-[10px] font-black uppercase tracking-widest opacity-60 italic">Official Record</p>
             <p class="text-[10px] font-black uppercase tracking-widest">Session 2025-26</p>
          </div>
       </div>
    </div>

    <!-- Candidate Matrix -->
    <div class="flex-1 flex p-5 gap-6">
       <!-- Biometric Asset -->
       <div class="flex flex-col gap-3">
          <div class="h-28 w-24 rounded-2xl overflow-hidden border-4 border-gray-50 shadow-lg bg-gray-50">
             <img v-if="student.profile_photo_url" :src="student.profile_photo_url" class="h-full w-full object-cover" />
             <div v-else class="h-full w-full flex items-center justify-center bg-indigo-50 text-3xl font-black text-indigo-700 uppercase">
                {{ student.name.charAt(0) }}
             </div>
          </div>
          <div class="flex flex-col items-center">
             <div class="bg-emerald-500 rounded-full h-2 w-2 animate-pulse mb-1"></div>
             <span class="text-[8px] font-black text-gray-400 uppercase tracking-widest">Verified</span>
          </div>
       </div>

       <!-- Data Stream -->
       <div class="flex-1 space-y-4">
          <div class="border-b border-gray-50 pb-2">
             <p class="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 italic mb-1">Candidate Profile</p>
             <h2 class="text-lg font-black text-gray-900 leading-none truncate">{{ student.name }}</h2>
          </div>

          <div class="grid grid-cols-2 gap-4">
             <div>
                <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest">Academic Target</p>
                <p class="text-xs font-black text-indigo-600">{{ student.class_name }} · {{ student.section }}</p>
             </div>
             <div>
                <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest">Identity Hash</p>
                <p class="text-xs font-black text-gray-900">#{{ student.roll_number }}</p>
             </div>
             <div>
                <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest">Registry ID</p>
                <p class="text-[10px] font-bold text-gray-700 font-mono italic">REF-{{ 2000 + student.id }}</p>
             </div>
             <div class="flex items-center gap-2">
                <QrCode :value="qrValue" :size="32" />
                <span class="text-[8px] font-bold text-gray-400 leading-none">Scan to Unlock<br/>Digital Auth</span>
             </div>
          </div>
       </div>
    </div>

    <!-- Administrative Footer -->
    <div class="px-5 py-3 border-t border-gray-50 flex items-center justify-between text-gray-400 italic bg-gray-50/50">
       <div class="space-y-0.5">
          <p class="text-[8px] leading-tight font-black uppercase">Institutional Principal Signature</p>
          <div class="h-6 w-24 border-b border-gray-200"></div>
       </div>
       <div class="text-right">
          <p class="text-[10px] font-black text-gray-900 tracking-tighter not-italic uppercase mb-0.5">Examination Hub A-102</p>
          <p class="text-[8px] font-bold uppercase tracking-widest leading-none">Security Protocol Active</p>
       </div>
    </div>

    <!-- Instructions Watermark (Optional decoration) -->
    <div class="absolute top-[50%] right-[-100px] text-[80px] font-black text-gray-100/50 rotate-45 select-none pointer-events-none group-hover:scale-110 transition-transform">
       CREDENTIAL
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
}>()

const qrValue = computed(() => {
  return `${window.location.origin}/verify/admit?id=${props.student.id}`
})
</script>

<style scoped>
.admit-card {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

@media print {
  .admit-card {
    box-shadow: none !important;
    border: 1px solid #f3f4f6 !important;
  }
}
</style>

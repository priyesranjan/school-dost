<template>
  <div class="certificate h-[850px] w-[1200px] bg-white p-20 relative flex flex-col items-center shadow-2xl border-[12px] border-double border-indigo-900 overflow-hidden select-none">
    <!-- Institutional Crest & Header -->
    <div class="flex flex-col items-center gap-6 mb-12">
       <div class="h-28 w-28 bg-indigo-900 p-4 rounded-3xl flex items-center justify-center text-white text-4xl font-black shadow-2xl rotate-3">
          RA
       </div>
       <div class="text-center space-y-2">
          <h1 class="text-6xl font-black text-indigo-900 tracking-tight uppercase leading-none">Royal Academy Hub</h1>
          <p class="text-sm font-black uppercase tracking-[0.6em] text-gray-400 italic">Institutional Excellence & Graduate Protocol</p>
       </div>
    </div>

    <!-- Credential Title -->
    <div class="mb-12 text-center">
       <div class="inline-block px-12 py-3 bg-indigo-50 border-y-2 border-indigo-200 text-indigo-800 text-3xl font-black uppercase tracking-[0.3em] font-serif shadow-sm">
          {{ title }}
       </div>
    </div>

    <!-- Certificate Flux Body -->
    <div class="flex-1 w-full text-center space-y-12 px-12">
       <p class="text-xl font-medium text-gray-500 italic font-serif">This academic credential is hereby awarded to</p>
       
       <div class="space-y-4">
          <h2 class="text-6xl font-black text-gray-900 underline decoration-indigo-200 decoration-8 underline-offset-8 uppercase tracking-tight">
             {{ studentName }}
          </h2>
          <p class="text-lg font-black text-gray-400 uppercase tracking-widest italic">
             Academic Block: {{ className }} · Identity Hash: #{{ rollNumber }}
          </p>
       </div>

       <div class="max-w-4xl mx-auto text-2xl leading-relaxed text-gray-700 font-serif italic border-x-4 border-indigo-50/50 px-12 py-8">
          <slot></slot>
       </div>
    </div>

    <!-- Credential Signatories & Auth -->
    <div class="w-full flex items-end justify-between mt-20 px-12">
       <!-- Digital Auth Cryptography -->
       <div class="flex items-center gap-6 p-6 bg-gray-50/50 border border-gray-100 rounded-[2.5rem]">
          <div class="bg-white p-2 rounded-2xl shadow-xl">
             <QrCode :value="qrValue" :size="100" />
          </div>
          <div>
             <p class="text-[10px] font-black text-indigo-900 uppercase tracking-[0.2em] mb-1">Verify Authenticity</p>
             <p class="text-[9px] font-bold text-gray-400 leading-tight uppercase font-mono break-all max-w-[200px]">
                SIGNATURE HASH:<br/>{{ rollNumber.repeat(4).substring(0, 32) }}
             </p>
             <div class="mt-2 flex items-center gap-2">
                <div class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span class="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Protocol Active</span>
             </div>
          </div>
       </div>

       <!-- Official Directives -->
       <div class="flex gap-20 text-center">
          <div class="space-y-2">
             <div class="h-10 w-48 border-b-2 border-gray-900 opacity-10 mx-auto"></div>
             <p class="text-[10px] font-black text-gray-900 uppercase tracking-widest italic">Institutional Registrar</p>
             <p class="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Verified Official</p>
          </div>
          <div class="space-y-2 relative">
             <div class="h-10 w-48 border-b-2 border-gray-900 opacity-10 mx-auto"></div>
             <p class="text-[10px] font-black text-gray-900 uppercase tracking-widest italic">Principal Oversight</p>
             <p class="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Higher Authority Certified</p>
             <!-- Official Seal Overlay -->
             <div class="absolute -top-12 -right-8 h-24 w-24 rounded-full border-[10px] border-indigo-600/10 rotate-12 flex items-center justify-center opacity-50 select-none pointer-events-none">
                <div class="text-[10px] font-black text-indigo-900 text-center uppercase leading-none">OFFICIAL<br/>SEAL<br/>2026</div>
             </div>
          </div>
       </div>
    </div>

    <!-- Background Matrix (Optional aesthetic decoration) -->
    <div class="absolute -top-20 -left-20 h-64 w-64 bg-indigo-50 rounded-full blur-[100px] z-[-1]"></div>
    <div class="absolute -bottom-20 -right-20 h-96 w-96 bg-indigo-50 rounded-full blur-[120px] z-[-1]"></div>
    <div class="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none z-[-1] tracking-[2em] text-[150px] font-black rotate-45">
       INSTITUTIONAL
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import QrCode from '@/components/common/QrCode.vue'

const props = defineProps<{
  title: string
  studentName: string
  className: string
  rollNumber: string
  certificateNo: string
}>()

const qrValue = computed(() => {
  return `${window.location.origin}/verify/cert?no=${props.certificateNo}`
})
</script>

<style scoped>
.certificate {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

@media print {
  .certificate {
    box-shadow: none !important;
    border: 12px double #1e1b4b !important;
    width: 100% !important;
    height: auto !important;
    padding: 20mm !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>

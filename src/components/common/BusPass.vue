<template>
  <div class="bus-pass relative w-[450px] h-[280px] bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col group border border-slate-800">
    <!-- Transport Header -->
    <div class="bg-gradient-to-r from-amber-500 to-orange-600 p-4 text-white">
       <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
             <div class="h-10 w-10 bg-white/20 rounded-xl backdrop-blur-md flex items-center justify-center border border-white/30 text-xl">
                🚌
             </div>
             <div>
                <h3 class="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Institutional Logistic Access</h3>
                <p class="text-xs font-black tracking-tight uppercase">Institutional Bus Pass</p>
             </div>
          </div>
          <div class="text-right">
             <p class="text-[10px] font-black uppercase tracking-widest opacity-60">Session 25-26</p>
             <p class="text-[10px] font-black uppercase">Valid Unit: Term 1</p>
          </div>
       </div>
    </div>

    <!-- Logistic Matrix -->
    <div class="flex-1 flex p-5 gap-6 bg-slate-900">
       <!-- Passenger Asset -->
       <div class="flex flex-col items-center gap-3">
          <div class="h-28 w-24 rounded-2xl overflow-hidden border-4 border-slate-800 shadow-xl bg-slate-800">
             <img v-if="student.profile_photo_url" :src="student.profile_photo_url" class="h-full w-full object-cover" />
             <div v-else class="h-full w-full flex items-center justify-center text-3xl font-black text-slate-700 uppercase">
                {{ student.name.charAt(0) }}
             </div>
          </div>
          <div class="flex items-center gap-2">
             <div class="h-2 w-2 rounded-full bg-amber-400 animate-pulse shadow-glow shadow-amber-400/50"></div>
             <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Route</span>
          </div>
       </div>

       <!-- Data Stream -->
       <div class="flex-1 flex flex-col justify-between">
          <div>
             <h2 class="text-lg font-black text-white leading-none truncate mb-1">{{ student.name }}</h2>
             <p class="text-[10px] font-black text-amber-500 uppercase tracking-widest">{{ student.class_name }} · #{{ student.roll_number }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4 bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
             <div>
                <p class="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Route Vector</p>
                <p class="text-xs font-black text-white">ROUTE-{{ routeNo }}</p>
             </div>
             <div>
                <p class="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Departure Point</p>
                <p class="text-[10px] font-black text-white truncate">{{ stopName }}</p>
             </div>
             <div class="flex items-center gap-2 col-span-2 mt-1">
                <div class="h-1 flex-1 bg-slate-700 rounded-full overflow-hidden">
                   <div class="h-full bg-gradient-to-r from-amber-500 to-orange-500 w-[70%]"></div>
                </div>
                <span class="text-[8px] font-black text-slate-500 uppercase">Logistic Verified</span>
             </div>
          </div>
       </div>
    </div>

    <!-- Safety Footer -->
    <div class="px-5 py-3 border-t border-slate-800 flex items-center justify-between text-slate-500 bg-slate-950/50">
       <div>
          <p class="text-[8px] font-black uppercase tracking-widest mb-0.5">Emergency Protocol</p>
          <p class="text-[10px] font-black text-amber-500">{{ student.phone }}</p>
       </div>
       <div class="text-right">
          <QrCode :value="qrValue" :size="24" color="#f59e0b" />
       </div>
    </div>

    <!-- Decorative Glow -->
    <div class="absolute -bottom-10 -right-10 h-32 w-32 bg-amber-500/10 rounded-full blur-3xl"></div>
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
    phone: string
    profile_photo_url?: string
  }
  routeNo: string
  stopName: string
}>()

const qrValue = computed(() => {
  return `${window.location.origin}/verify/bus?id=${props.student.id}&route=${props.routeNo}`
})
</script>

<style scoped>
.bus-pass {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

@media print {
  .bus-pass {
    box-shadow: none !important;
    border: none !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>

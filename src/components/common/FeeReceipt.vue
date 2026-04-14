<template>
  <div
    class="receipt-container w-[210mm] bg-white p-16 shadow-2xl border-4 border-double border-gray-100 flex flex-col gap-10 relative overflow-hidden"
  >
    <!-- Institutional Watermark -->
    <div class="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
      <span class="text-[12rem] font-black rotate-[-35deg] uppercase">OFFICIAL</span>
    </div>

    <!-- Header Block -->
    <div class="flex justify-between items-start border-b-2 border-gray-900 pb-8 relative z-10">
      <div class="space-y-2">
        <h1 class="text-3xl font-black text-gray-900 tracking-tighter uppercase">Institutional Fee Receipt</h1>
        <p class="text-xs font-bold text-gray-400 tracking-[0.3em] uppercase">Royal Academy of Excellence</p>
      </div>
      <div class="text-right">
        <p class="text-xs font-black text-gray-400 uppercase tracking-widest">Receipt Sequence</p>
        <p class="text-xl font-black text-indigo-600">#{{ payment.receipt_number || 'TRN-9981' }}</p>
      </div>
    </div>

    <!-- Identity & Context -->
    <div class="grid grid-cols-2 gap-12 relative z-10">
      <div class="space-y-4">
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Billed To Member</p>
          <h2 class="text-xl font-black text-gray-900">{{ payment.student_name }}</h2>
          <p class="text-sm font-bold text-gray-500 uppercase tracking-tighter">{{ payment.class_name }}</p>
        </div>
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Member Roll</p>
          <p class="text-sm font-mono font-black text-gray-700">
            STD/{{ 2025 + (payment.student_id % 10) }}/0{{ payment.student_id }}
          </p>
        </div>
      </div>
      <div class="space-y-4 text-right">
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Transaction Date</p>
          <p class="text-sm font-black text-gray-900">{{ payment.payment_date || '07 April 2026' }}</p>
        </div>
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Payment Protocol</p>
          <span
            class="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-gray-600"
          >
            {{ payment.payment_method?.replace('_', ' ') || 'UPI TRANSFER' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Financial Ledger -->
    <div class="flex-1 relative z-10">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b-2 border-gray-900">
            <th class="py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              Description of Fee Component
            </th>
            <th class="py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              Ledger Amount
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 italic">
          <tr>
            <td class="py-6">
              <p class="text-sm font-black text-gray-900">{{ payment.fee_name }}</p>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                Academic Session 2025-26 · Term Phase 1
              </p>
            </td>
            <td class="py-6 text-right font-black text-gray-900 text-lg">
              ₹{{ payment.total_amount.toLocaleString('en-IN') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Totals & Balance -->
    <div class="grid grid-cols-2 gap-12 border-t-2 border-gray-900 pt-8 relative z-10">
      <div class="space-y-4">
        <div class="bg-gray-50 flex flex-col items-center justify-center py-6 rounded-2xl border border-gray-100">
          <QrCode :value="qrValue" :size="80" />
          <p class="mt-3 text-[8px] font-black uppercase tracking-widest text-gray-400">Scan to Verify Transaction</p>
        </div>
      </div>
      <div class="space-y-2">
        <div class="flex justify-between items-center text-sm font-bold text-gray-400 uppercase tracking-widest">
          <span>Total Invoice</span>
          <span>₹{{ payment.total_amount.toLocaleString('en-IN') }}</span>
        </div>
        <div class="flex justify-between items-center py-2 border-y border-gray-50">
          <span class="text-xs font-black text-emerald-600 uppercase">Amount Settled</span>
          <span class="text-xl font-black text-emerald-600">₹{{ payment.paid_amount.toLocaleString('en-IN') }}</span>
        </div>
        <div class="flex justify-between items-center pt-2">
          <span class="text-xs font-black text-rose-500 uppercase">Balance Outstanding</span>
          <span class="text-sm font-black text-rose-500">₹{{ payment.due_amount.toLocaleString('en-IN') }}</span>
        </div>
      </div>
    </div>

    <!-- Footer Security -->
    <div class="mt-10 pt-10 border-t border-gray-100 grid grid-cols-2 gap-4 relative z-10">
      <div>
        <p class="text-[8px] font-bold text-gray-400 uppercase leading-relaxed max-w-[250px]">
          This is a digitally generated institutional receipt. No physical signature is required for official
          verification. Security ID: {{ payment.id }}HASH-{{ payment.receipt_number }}
        </p>
      </div>
      <div class="text-right space-y-1">
        <p class="text-sm font-black text-gray-900 italic">Auth Registrar</p>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Institutional Finance Hub</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import QrCode from '@/components/common/QrCode.vue'

const props = defineProps<{
  payment: {
    id: number
    student_id: number
    student_name: string
    class_name: string
    fee_name: string
    total_amount: number
    paid_amount: number
    due_amount: number
    status: string
    payment_date?: string | null
    receipt_number?: string | null
    payment_method?: string | null
  }
}>()

const qrValue = computed(() => {
  return `${window.location.origin}/verify/receipt/${props.payment.receipt_number || props.payment.id}`
})
</script>

<style scoped>
.receipt-container {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

@media print {
  .receipt-container {
    box-shadow: none !important;
    border: 4px border-double #111827 !important;
  }
}
</style>

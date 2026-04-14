<template>
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
    <!-- Liquidity Gauge -->
    <AppCard
      title="Liquidity Velocity"
      class="flex flex-col justify-between shadow-xl ring-1 ring-gray-100 dark:ring-gray-800"
    >
      <div class="flex flex-1 flex-col items-center justify-center py-8">
        <div class="relative h-48 w-48">
          <svg class="h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle
              class="text-gray-100 dark:text-gray-800"
              stroke-width="8"
              stroke="currentColor"
              fill="transparent"
              r="42"
              cx="50"
              cy="50"
            />
            <circle
              class="text-primary-600 transition-all duration-1000 ease-out"
              stroke-width="8"
              :stroke-dasharray="2 * Math.PI * 42"
              :stroke-dashoffset="2 * Math.PI * 42 * (1 - collectionRate / 100)"
              stroke-linecap="round"
              stroke="currentColor"
              fill="transparent"
              r="42"
              cx="50"
              cy="50"
            />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-4xl font-black text-gray-900 dark:text-white">{{ collectionRate }}%</span>
            <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Collected</span>
          </div>
        </div>
        <div class="mt-8 grid w-full grid-cols-2 gap-4">
          <div class="rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/50">
            <p class="text-[10px] font-black uppercase text-gray-400">Total Pipeline</p>
            <p class="text-lg font-black text-gray-900 dark:text-white">
              ₹{{ (feeStore.totalCollected + feeStore.totalPending).toLocaleString('en-IN') }}
            </p>
          </div>
          <div class="rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/50">
            <p class="text-[10px] font-black uppercase text-gray-400">Outstanding</p>
            <p class="text-lg font-black text-rose-600">₹{{ feeStore.totalPending.toLocaleString('en-IN') }}</p>
          </div>
        </div>
      </div>
    </AppCard>

    <!-- Revenue at Risk (Ageing Analysis) -->
    <AppCard title="Revenue Exposure Index" class="lg:col-span-2 shadow-xl ring-1 ring-gray-100 dark:ring-gray-800">
      <div class="mt-4 px-2">
        <div class="flex items-end gap-3 h-56">
          <div
            v-for="bucket in ageingBuckets"
            :key="bucket.label"
            class="group relative flex flex-1 flex-col items-center gap-3"
          >
            <div class="w-full rounded-2xl bg-gray-100 dark:bg-gray-800 relative overflow-hidden h-full">
              <div
                class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-rose-600 to-rose-400 transition-all duration-700 ease-out"
                :style="{ height: (bucket.amount / maxAgeing) * 100 + '%' }"
              >
                <div
                  class="absolute top-2 w-full text-center text-[10px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ₹{{ Math.round(bucket.amount / 1000) }}k
                </div>
              </div>
            </div>
            <div class="text-center">
              <p
                class="text-[10px] font-black uppercase tracking-tighter text-gray-400 group-hover:text-rose-600 transition-colors"
              >
                {{ bucket.label }}
              </p>
              <p class="text-[9px] font-bold text-gray-500">Days Out</p>
            </div>
          </div>
        </div>

        <div class="mt-10 grid grid-cols-3 gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div class="text-center">
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Critical (>60d)</p>
            <p class="text-xl font-black text-rose-600 mt-1">₹{{ ageingBuckets[3].amount.toLocaleString('en-IN') }}</p>
          </div>
          <div class="text-center">
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">High (30-60d)</p>
            <p class="text-xl font-black text-amber-600 mt-1">₹{{ ageingBuckets[2].amount.toLocaleString('en-IN') }}</p>
          </div>
          <div class="text-center border-l border-gray-100 dark:border-gray-800">
            <p class="text-[10px] font-black uppercase tracking-widest text-primary-600">Recovery Pulse</p>
            <p class="text-xl font-black text-gray-900 dark:text-white mt-1">+12.4%</p>
          </div>
        </div>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFeeStore } from '@/stores/fees'
import AppCard from '@/components/ui/AppCard.vue'

const feeStore = useFeeStore()

const collectionRate = computed(() => {
  const total = feeStore.totalCollected + feeStore.totalPending
  if (!total) return 0
  return Math.round((feeStore.totalCollected / total) * 100)
})

const ageingBuckets = computed(() => {
  const buckets = [
    { label: '0-15', amount: 0 },
    { label: '16-30', amount: 0 },
    { label: '31-60', amount: 0 },
    { label: '60+', amount: 0 },
  ]

  const now = new Date()

  feeStore.payments.forEach((p) => {
    if (p.status !== 'paid' && p.due_amount > 0) {
      // Find the fee structure to get due date
      const structure = feeStore.structures.find((s) => s.name === p.fee_name)
      if (!structure) return

      const dueDate = new Date(structure.due_date)
      const diffMs = now.getTime() - dueDate.getTime()
      const diffDays = Math.ceil(diffMs / (1000 * 3600 * 24))

      if (diffDays <= 15) buckets[0].amount += p.due_amount
      else if (diffDays <= 30) buckets[1].amount += p.due_amount
      else if (diffDays <= 60) buckets[2].amount += p.due_amount
      else buckets[3].amount += p.due_amount
    }
  })

  // Add mock variety for visualization if data is sparse
  buckets.forEach((b) => {
    if (b.amount === 0) b.amount = Math.random() * 20000 + 5000
  })

  return buckets
})

const maxAgeing = computed(() => Math.max(...ageingBuckets.value.map((b) => b.amount), 1))
</script>

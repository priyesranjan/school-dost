<template>
  <div class="space-y-8 animate-fade-in-up">
    <div class="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-600 p-8 text-white shadow-2xl shadow-emerald-200 dark:shadow-none">
      <div class="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div class="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
            💳 Finance Lead
          </div>
          <h1 class="mt-3 text-4xl font-black tracking-tight">
            Welcome, <span class="text-emerald-100 underline decoration-emerald-200/50 decoration-wavy">{{ displayName }}</span>!
          </h1>
          <p class="mt-2 text-sm font-medium text-emerald-100/80">
            {{ currentDate }} · Track collections, dues, and financial follow-ups from one place.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <AppButton variant="secondary" class="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md">
            Review Dues
          </AppButton>
          <router-link to="/fees" class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-xl transition-transform hover:scale-110 active:scale-95">
            ₹
          </router-link>
        </div>
      </div>
      <div class="absolute -right-12 -top-12 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl"></div>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Fee Collected"
        :value="feeStore.totalCollected"
        :isCurrency="true"
        icon="₹"
        icon-bg="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
        value-color="text-emerald-700 dark:text-emerald-400"
        :subtitle="`${collectionRate}% of total receivables`"
      />
      <StatCard
        title="Outstanding Dues"
        :value="feeStore.totalPending"
        :isCurrency="true"
        icon="⏳"
        icon-bg="bg-amber-50 text-amber-600 dark:bg-amber-900/20"
        value-color="text-amber-700 dark:text-amber-400"
        subtitle="Needs follow-up this cycle"
      />
      <StatCard
        title="Active Students"
        :value="studentStore.students.length"
        icon="👨‍🎓"
        icon-bg="bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20"
        value-color="text-cyan-700 dark:text-cyan-400"
        subtitle="Linked to fee records"
      />
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <AppCard title="Collection Overview" class="lg:col-span-2 shadow-xl" :glass="true">
        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <div class="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 dark:border-emerald-900/40 dark:bg-emerald-900/20">
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">This month</p>
            <p class="mt-2 text-2xl font-black text-emerald-800 dark:text-emerald-100">₹{{ feeStore.totalCollected.toLocaleString('en-IN') }}</p>
            <p class="mt-1 text-xs text-emerald-700/80 dark:text-emerald-200/80">Collections already recorded in the ledger.</p>
          </div>
          <div class="rounded-2xl border border-amber-100 bg-amber-50/60 p-5 dark:border-amber-900/40 dark:bg-amber-900/20">
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">Follow-up queue</p>
            <p class="mt-2 text-2xl font-black text-amber-800 dark:text-amber-100">₹{{ feeStore.totalPending.toLocaleString('en-IN') }}</p>
            <p class="mt-1 text-xs text-amber-700/80 dark:text-amber-200/80">Prioritize reminders and payment escalation.</p>
          </div>
        </div>

        <div class="mt-6 space-y-4">
          <div v-for="action in quickActions" :key="action.path" class="flex items-center justify-between rounded-2xl border border-gray-100 bg-white/70 p-4 dark:border-gray-700 dark:bg-gray-800/40">
            <div>
              <p class="text-sm font-black text-gray-900 dark:text-white">{{ action.title }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ action.desc }}</p>
            </div>
            <router-link :to="action.path" class="rounded-full bg-gray-900 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-transform hover:scale-105 dark:bg-white dark:text-gray-900">
              Open
            </router-link>
          </div>
        </div>
      </AppCard>

      <AppCard title="Financial Snapshot" :glass="true">
        <div class="space-y-4">
          <div class="rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/50">
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Collection rate</p>
            <p class="mt-1 text-3xl font-black text-gray-900 dark:text-white">{{ collectionRate }}%</p>
          </div>
          <div class="rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/50">
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Risk level</p>
            <p class="mt-1 text-lg font-black text-amber-600">Monitor high-value pending fees</p>
          </div>
          <div class="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-900/20">
            <p class="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-300">Recommended next step</p>
            <p class="mt-1 text-sm font-medium text-emerald-800 dark:text-emerald-100">Send reminders before the next collection cycle begins.</p>
          </div>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useStudentStore } from '@/stores/students'
import { useFeeStore } from '@/stores/fees'
import AppCard from '@/components/ui/AppCard.vue'
import StatCard from '@/components/ui/StatCard.vue'
import AppButton from '@/components/ui/AppButton.vue'

const authStore = useAuthStore()
const studentStore = useStudentStore()
const feeStore = useFeeStore()

const currentDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const displayName = computed(() => authStore.user?.name?.split(' ')[0] || 'Accountant')

const collectionRate = computed(() => {
  const total = feeStore.totalCollected + feeStore.totalPending
  if (!total) return 0
  return Math.round((feeStore.totalCollected / total) * 100)
})

const quickActions = [
  { title: 'Open Fee Register', desc: 'Review dues and payment history', path: '/fees' },
  { title: 'Ledger & Expenses', desc: 'Check reconciled spend and cash flow', path: '/expenses' },
  { title: 'Financial Reports', desc: 'Export month-end summaries', path: '/reports' },
  { title: 'Message Parents', desc: 'Send payment reminders', path: '/sms' },
]
</script>

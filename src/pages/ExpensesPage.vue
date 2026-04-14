<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Financial Header -->
    <div
      class="relative overflow-hidden rounded-[2rem] bg-emerald-50 p-8 shadow-xl shadow-emerald-100/50 dark:border dark:border-emerald-900/30 dark:bg-gray-800/80 dark:shadow-none"
    >
      <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div
            class="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
          >
            💸 Accounting & Ledgers
          </div>
          <h1 class="mt-3 text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            Expense
            <span class="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Management</span>
          </h1>
          <p class="mt-1 text-sm font-medium text-emerald-600/70 dark:text-emerald-300/60">
            Log, categorize, and track operational outflows across the institution.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <AppButton
            @click="openModal"
            class="h-[48px] px-8 shadow-2xl shadow-emerald-200 dark:shadow-none bg-emerald-600 hover:bg-emerald-700"
          >
            + Log Expense
          </AppButton>
        </div>
      </div>
      <!-- Background Decorative -->
      <div
        class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-100/40 blur-3xl dark:bg-emerald-900/20"
      ></div>
    </div>

    <!-- Live Census Matrix -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div
        class="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-800/50"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Capital Outflow</p>
            <p class="mt-1 text-3xl font-black tracking-tight text-rose-600 dark:text-rose-400">
              ₹{{ accStore.totalExpenses.toLocaleString('en-IN') }}
            </p>
          </div>
          <div
            class="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-xl shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-6 dark:bg-rose-900/30"
          >
            📉
          </div>
        </div>
      </div>
      <div
        class="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-800/50"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Transactions</p>
            <p class="mt-1 text-3xl font-black tracking-tight text-gray-900 dark:text-white">
              {{ accStore.expenses.length }}
            </p>
          </div>
          <div
            class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-xl shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-6 dark:bg-gray-800"
          >
            🧾
          </div>
        </div>
      </div>
      <div
        class="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-800/50"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Top Spend Category</p>
            <p class="mt-1 text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400 capitalize">
              {{ topCategory || 'N/A' }}
            </p>
          </div>
          <div
            class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-xl shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-6 dark:bg-emerald-900/30"
          >
            📊
          </div>
        </div>
      </div>
    </div>

    <!-- Ledger Table -->
    <AppCard :no-padding="true" class="overflow-hidden border-none shadow-2xl">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr
              class="bg-gray-50/20 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:bg-gray-900/30"
            >
              <th class="px-8 py-4">Transaction Details</th>
              <th class="px-6 py-4">Category</th>
              <th class="px-6 py-4">Beneficiary</th>
              <th class="px-8 py-4 text-right">Amount Outflow</th>
              <th class="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
            <tr
              v-for="e in accStore.expenses"
              :key="e.id"
              class="group transition-all hover:bg-emerald-50/30 dark:hover:bg-emerald-900/5"
            >
              <td class="px-8 py-5">
                <p class="font-black text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  {{ e.title }}
                </p>
                <div class="flex flex-wrap gap-2 mt-1">
                  <span class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{{ e.date }}</span>
                  <span
                    v-if="e.reference_no"
                    class="text-[10px] font-black text-emerald-500 uppercase tracking-tighter mix-blend-multiply dark:mix-blend-lighten"
                    >REF: {{ e.reference_no }}</span
                  >
                </div>
              </td>
              <td class="px-6 py-5">
                <span
                  :class="[
                    'inline-flex px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest shadow-sm border',
                    categoryColor(e.category),
                  ]"
                >
                  {{ e.category }}
                </span>
              </td>
              <td class="px-6 py-5">
                <p class="text-xs font-black text-gray-900 dark:text-gray-200">
                  {{ e.vendor_or_staff || 'Direct Account' }}
                </p>
                <p class="text-[10px] font-bold text-gray-400 uppercase">{{ e.payment_method.replace('_', ' ') }}</p>
              </td>
              <td class="px-8 py-5 text-right flex-col justify-center">
                <p class="text-lg font-black text-rose-600">-₹{{ e.amount.toLocaleString('en-IN') }}</p>
              </td>
              <td class="px-6 py-5 text-center">
                <button
                  @click.stop="confirmDelete(e)"
                  class="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition-all hover:scale-110 hover:bg-rose-100 hover:text-rose-600 dark:bg-gray-800 dark:hover:bg-rose-900/40 dark:hover:text-rose-400"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2.5"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <EmptyState v-if="!accStore.expenses.length" title="Clean Ledger" message="No expenses logged yet." />
    </AppCard>

    <!-- Modal Form -->
    <AppModal v-model="showModal" title="Authorize Expense Outflow" size="md">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <AppInput
          v-model="form.title"
          label="Expense Title / Description"
          placeholder="e.g. March Electricity Bill"
          required
          class="font-bold"
        />

        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="form.amount" type="number" label="Amount (₹)" required class="font-bold" />
          <AppInput v-model="form.category" type="select" label="Ledger Category" required class="font-bold">
            <option value="salary">Salary & Payroll</option>
            <option value="maintenance">Maintenance</option>
            <option value="utilities">Utilities & Bills</option>
            <option value="supplies">Supplies & Equipment</option>
            <option value="events">School Events</option>
            <option value="other">Other/Miscellaneous</option>
          </AppInput>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="form.date" type="date" label="Transaction Date" required class="font-bold" />
          <AppInput v-model="form.payment_method" type="select" label="Mode of Outflow" required class="font-bold">
            <option value="cash">Cash</option>
            <option value="bank_transfer">Bank Transfer (IMPS/NEFT)</option>
            <option value="cheque">Cheque</option>
            <option value="card">Credit/Debit Card</option>
          </AppInput>
        </div>

        <AppInput
          v-model="form.vendor_or_staff"
          label="Beneficiary / Vendor"
          placeholder="Who received this money?"
          class="font-bold"
        />
        <AppInput
          v-model="form.reference_no"
          label="Reference No (Txn ID / Cheque No)"
          placeholder="Optional"
          class="font-bold"
        />
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showModal = false">Cancel</AppButton>
          <AppButton @click="handleSubmit" class="bg-emerald-600 hover:bg-emerald-700">Commit Expense</AppButton>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useAccountingStore, type ExpenseRecord, type ExpenseCategory } from '@/stores/accounting'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const accStore = useAccountingStore()

const showModal = ref(false)
const form = reactive({
  title: '',
  category: 'other' as ExpenseCategory,
  amount: '' as unknown as number,
  date: new Date().toISOString().split('T')[0],
  vendor_or_staff: '',
  payment_method: 'bank_transfer' as ExpenseRecord['payment_method'],
  reference_no: '',
})

const topCategory = computed(() => {
  if (!accStore.expenses.length) return ''
  const sums = accStore.expenses.reduce(
    (acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount
      return acc
    },
    {} as Record<string, number>,
  )
  return Object.keys(sums).reduce((a, b) => (sums[a] > sums[b] ? a : b))
})

function categoryColor(cat: string) {
  const map: Record<string, string> = {
    salary: 'bg-purple-50 text-purple-700 border-purple-100',
    maintenance: 'bg-amber-50 text-amber-700 border-amber-100',
    utilities: 'bg-blue-50 text-blue-700 border-blue-100',
    supplies: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    events: 'bg-rose-50 text-rose-700 border-rose-100',
    other: 'bg-gray-50 text-gray-700 border-gray-100',
  }
  return map[cat] || map.other
}

function openModal() {
  Object.assign(form, {
    title: '',
    category: 'other',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    vendor_or_staff: '',
    payment_method: 'bank_transfer',
    reference_no: '',
  })
  showModal.value = true
}

function handleSubmit() {
  if (!form.title || !form.amount || !form.category) return

  accStore.addExpense({
    title: form.title,
    category: form.category,
    amount: Number(form.amount),
    date: form.date,
    vendor_or_staff: form.vendor_or_staff,
    payment_method: form.payment_method,
    reference_no: form.reference_no,
  })

  showModal.value = false
}

function confirmDelete(e: ExpenseRecord) {
  if (confirm(`Are you sure you want to delete this outflow record: ${e.title}?`)) {
    accStore.deleteExpense(e.id)
  }
}
</script>

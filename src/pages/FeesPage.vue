<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Financial Overview Stats -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="stat in [
          {
            label: 'Total Revenue',
            val: feeStore.totalCollected,
            icon: '💰',
            color: 'text-green-600',
            bg: 'bg-green-50/50 dark:bg-green-900/20',
            isCurrency: true,
          },
          {
            label: 'Outstanding Dues',
            val: feeStore.totalPending,
            icon: '⏳',
            color: 'text-amber-600',
            bg: 'bg-amber-50/50 dark:bg-amber-900/20',
            isCurrency: true,
          },
          {
            label: 'Late Fees Collected',
            val: 4500,
            icon: '⚠️',
            color: 'text-red-500',
            bg: 'bg-red-50/50 dark:bg-red-900/20',
            isCurrency: true,
          },
          {
            label: 'Recovery Rate',
            val: '92%',
            icon: '📈',
            color: 'text-blue-600',
            bg: 'bg-blue-50/50 dark:bg-blue-900/20',
          },
        ]"
        :key="stat.label"
        class="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-800/50"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">{{ stat.label }}</p>
            <p :class="['mt-1 text-2xl font-black', stat.color]">
              {{ stat.isCurrency ? '₹' + stat.val.toLocaleString('en-IN') : stat.val }}
            </p>
          </div>
          <div :class="['flex h-12 w-12 items-center justify-center rounded-xl text-xl shadow-inner', stat.bg]">
            {{ stat.icon }}
          </div>
        </div>
      </div>
    </div>

    <!-- Modern Tab Navigation -->
    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <div class="inline-flex gap-1 rounded-2xl bg-gray-100 p-1.5 dark:bg-gray-800">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'relative rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all duration-300',
              activeTab === tab.key
                ? 'bg-white text-primary-600 shadow-md dark:bg-gray-700 dark:text-primary-400'
                : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300',
            ]"
          >
            {{ tab.label }}
            <span
              v-if="tab.count"
              class="ml-2 rounded-full bg-primary-100 px-2 py-0.5 text-[9px] dark:bg-primary-900/40"
              >{{ tab.count }}</span
            >
          </button>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-if="activeTab === 'payments'"
            @click="feeStore.createRiskDemoData()"
            :disabled="feeStore.hasRiskDemoData"
            :class="[
              'rounded-xl px-3 py-2 text-xs font-black transition-colors',
              feeStore.hasRiskDemoData
                ? 'bg-emerald-200 text-emerald-700 cursor-not-allowed dark:bg-emerald-900/30 dark:text-emerald-500'
                : 'bg-emerald-600 text-white hover:bg-emerald-700',
            ]"
          >
            + Create Demo
          </button>
          <button
            v-if="activeTab === 'payments'"
            @click="feeStore.clearRiskDemoData()"
            :disabled="!feeStore.hasRiskDemoData"
            :class="[
              'rounded-xl border px-3 py-2 text-xs font-black transition-colors',
              feeStore.hasRiskDemoData
                ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-300'
                : 'border-rose-100 bg-rose-50/70 text-rose-300 cursor-not-allowed dark:border-rose-900/20 dark:bg-rose-900/10 dark:text-rose-700',
            ]"
          >
            Clean Demo
          </button>
          <span
            v-if="activeTab === 'payments'"
            class="rounded-xl bg-gray-100 px-3 py-2 text-[11px] font-black text-gray-600 dark:bg-gray-700 dark:text-gray-300"
          >
            Demo: {{ feeStore.riskDemoCount }}
          </span>
          <AppButton
            v-if="activeTab === 'payments'"
            @click="showCollectModal = true"
            class="shadow-xl shadow-primary-200"
          >
            + Collect New Payment
          </AppButton>
        </div>
        <AppButton
          v-if="activeTab === 'structures'"
          @click="showStructureModal = true"
          class="shadow-xl shadow-primary-200"
        >
          + New Fee Structure
        </AppButton>
      </div>

      <!-- Content Area -->
      <transition name="page" mode="out-in">
        <div :key="activeTab">
          <!-- Payments Tab -->
          <AppCard
            v-if="activeTab === 'payments'"
            :no-padding="true"
            class="overflow-hidden border-none shadow-xl shadow-gray-200/50 dark:shadow-none"
          >
            <div class="flex flex-col gap-4 bg-gray-50/50 p-6 dark:bg-gray-800/20 sm:flex-row sm:items-center">
              <div class="relative flex-1">
                <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2.5"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  v-model="feeStore.searchQuery"
                  type="text"
                  placeholder="Refine by student or receipt..."
                  class="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm font-medium transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-gray-700 dark:bg-gray-800"
                />
              </div>
              <select
                v-model="feeStore.statusFilter"
                class="rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-bold text-gray-700 transition-all focus:border-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="">All Status</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead>
                  <tr class="border-y border-gray-50 bg-gray-50/30 dark:bg-gray-800/20 dark:border-gray-700/50">
                    <th class="px-8 py-4 font-black uppercase tracking-widest text-[10px] text-gray-400">
                      Payer Details
                    </th>
                    <th class="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-gray-400">
                      Fee Category
                    </th>
                    <th class="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-gray-400 text-right">
                      Invoice Bal
                    </th>
                    <th class="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-gray-400 text-right">
                      Settled
                    </th>
                    <th class="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-gray-400 text-right">
                      Pending
                    </th>
                    <th class="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-gray-400">Status</th>
                    <th class="px-8 py-4 font-black uppercase tracking-widest text-[10px] text-gray-400 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
                  <tr
                    v-for="payment in feeStore.filteredPayments"
                    :key="payment.id"
                    class="group hover:bg-primary-50/30 dark:hover:bg-primary-900/10 transition-all"
                  >
                    <td class="px-8 py-5">
                      <div class="flex items-center gap-4">
                        <div
                          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-xs font-black dark:bg-gray-700"
                        >
                          {{ payment.student_name.charAt(0) }}
                        </div>
                        <div>
                          <p class="font-bold text-gray-900 dark:text-white">{{ payment.student_name }}</p>
                          <p class="text-[10px] font-medium text-gray-400 uppercase">{{ payment.class_name }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-5">
                      <span
                        class="rounded-lg bg-primary-50 px-2 py-1 text-[10px] font-black uppercase text-primary-600 dark:bg-primary-900/20"
                        >{{ payment.fee_name }}</span
                      >
                    </td>
                    <td class="px-6 py-5 text-right font-black text-gray-900 dark:text-white">
                      ₹{{ payment.total_amount.toLocaleString('en-IN') }}
                    </td>
                    <td class="px-6 py-5 text-right font-black text-green-600">
                      ₹{{ payment.paid_amount.toLocaleString('en-IN') }}
                    </td>
                    <td
                      class="px-6 py-5 text-right font-black"
                      :class="payment.due_amount > 0 ? 'text-red-500' : 'text-gray-400'"
                    >
                      ₹{{ payment.due_amount.toLocaleString('en-IN') }}
                    </td>
                    <td
                      class="px-6 py-5 border-l-4"
                      :class="payment.due_amount > 0 ? 'border-amber-400' : 'border-green-400'"
                    >
                      <StatusBadge :color="statusColor(payment.status)">{{ payment.status }}</StatusBadge>
                    </td>
                    <td class="px-8 py-5 text-right">
                      <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          v-if="payment.status !== 'paid'"
                          @click="openQuickPay(payment)"
                          class="rounded-xl p-2 text-primary-600 hover:bg-white dark:hover:bg-gray-800 shadow-sm border border-transparent hover:border-gray-100"
                        >
                          💰
                        </button>
                        <button
                          v-if="payment.receipt_number"
                          @click="viewReceipt(payment)"
                          class="rounded-xl p-2 text-gray-400 hover:bg-white dark:hover:bg-gray-800 shadow-sm border border-transparent hover:border-gray-100"
                        >
                          📄
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <EmptyState
              v-if="!feeStore.filteredPayments.length"
              title="No matching entries"
              message="Try broader keywords or reset filters."
            />
          </AppCard>

          <!-- Due List Tab -->
          <AppCard
            v-if="activeTab === 'due'"
            title="Outstanding Due Ledger"
            :no-padding="true"
            class="overflow-hidden border-none shadow-xl shadow-gray-200/50 dark:shadow-none"
          >
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead>
                  <tr class="border-y border-gray-50 bg-red-50/20 dark:bg-red-900/10 dark:border-gray-700/50">
                    <th class="px-8 py-4 font-black uppercase tracking-widest text-[10px] text-gray-400">Late Payer</th>
                    <th class="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-gray-400">
                      Collection Group
                    </th>
                    <th
                      class="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-red-500 text-right animate-pulse"
                    >
                      Critical Dues
                    </th>
                    <th class="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-gray-400 text-right">
                      Action Required
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
                  <tr
                    v-for="payment in feeStore.duePayments"
                    :key="payment.id"
                    class="hover:bg-red-50/30 dark:hover:bg-red-900/10 transition-all"
                  >
                    <td class="px-8 py-5">
                      <p class="font-bold text-gray-900 dark:text-white">{{ payment.student_name }}</p>
                      <p class="text-[10px] font-medium text-gray-400 uppercase tracking-tight">
                        {{ payment.class_name }}
                      </p>
                    </td>
                    <td class="px-6 py-5">
                      <span
                        class="rounded-lg bg-gray-100 px-2 py-1 text-[10px] font-black uppercase text-gray-600 dark:bg-gray-700"
                        >{{ payment.fee_name }}</span
                      >
                    </td>
                    <td class="px-6 py-5 text-right font-black text-red-500">
                      ₹{{ payment.due_amount.toLocaleString('en-IN') }}
                    </td>
                    <td class="px-6 py-5 text-right">
                      <AppButton size="sm" @click="openQuickPay(payment)" variant="danger">Settle Ledger</AppButton>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <EmptyState
              v-if="!feeStore.duePayments.length"
              title="High Liquidity!"
              message="All outstanding dues have been recovered."
            />
          </AppCard>

          <!-- Fee Structures Tab -->
          <AppCard
            v-if="activeTab === 'structures'"
            :no-padding="true"
            class="overflow-hidden border-none shadow-xl shadow-gray-200/50 dark:shadow-none"
          >
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead>
                  <tr class="border-y border-gray-50 bg-gray-50/30 dark:bg-gray-800/20 dark:border-gray-700/50">
                    <th class="px-8 py-4 font-black uppercase tracking-widest text-[10px] text-gray-400">
                      Scheme Name
                    </th>
                    <th class="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-gray-400">
                      Eligibility
                    </th>
                    <th class="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-gray-400 text-right">
                      Standard Rate
                    </th>
                    <th class="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-gray-400">Deadline</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
                  <tr
                    v-for="s in feeStore.structures"
                    :key="s.id"
                    class="hover:bg-primary-50/30 dark:hover:bg-primary-900/10 transition-all"
                  >
                    <td class="px-8 py-5 font-bold text-gray-900 dark:text-white">{{ s.name }}</td>
                    <td class="px-6 py-5 text-gray-600 dark:text-gray-300">{{ s.class_name }}</td>
                    <td class="px-6 py-5 text-right font-black text-gray-900 dark:text-white">
                      ₹{{ s.amount.toLocaleString('en-IN') }}
                    </td>
                    <td class="px-6 py-5">
                      <p class="text-sm font-bold text-gray-700 dark:text-gray-300">{{ s.due_date }}</p>
                      <p class="text-[10px] font-medium text-gray-400 uppercase">{{ s.academic_year }} SESSION</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </AppCard>
        </div>
      </transition>
    </div>

    <!-- Collection Modals (Modern Polish) -->
    <AppModal v-model="showCollectModal" title="Recovery Console" size="md">
      <form @submit.prevent="handleCollect" class="space-y-6">
        <AppInput
          v-model="collectForm.studentSearch"
          label="Search Student Record"
          placeholder="Begin typing name..."
          :error="collectErrors.student"
        />

        <div
          v-if="collectForm.studentSearch && matchedDuePayments.length"
          class="space-y-2 rounded-2xl border border-gray-100 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800/50"
        >
          <button
            v-for="p in matchedDuePayments"
            :key="p.id"
            type="button"
            @click="selectPaymentForCollection(p)"
            class="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-all hover:bg-white dark:hover:bg-gray-700 shadow-sm border border-transparent hover:border-gray-100"
          >
            <div>
              <p class="font-bold text-gray-900 dark:text-white">{{ p.student_name }}</p>
              <p class="text-[10px] font-bold text-primary-500 uppercase">
                {{ p.fee_name }} · Due: ₹{{ p.due_amount.toLocaleString('en-IN') }}
              </p>
            </div>
            <StatusBadge :color="p.status === 'partial' ? 'yellow' : 'red'">{{ p.status }}</StatusBadge>
          </button>
        </div>

        <div
          v-if="selectedPayment"
          class="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-400 p-5 text-white shadow-lg shadow-primary-100"
        >
          <p class="text-[10px] font-black uppercase tracking-widest opacity-80 text-white">Active Ledger Selection</p>
          <div class="mt-2 flex items-center justify-between">
            <p class="text-lg font-black">{{ selectedPayment.student_name }}</p>
            <p class="text-xl font-bold bg-white/20 px-3 py-1 rounded-xl backdrop-blur-sm">
              ₹{{ selectedPayment.due_amount.toLocaleString('en-IN') }}
            </p>
          </div>
          <p class="mt-1 text-xs font-medium opacity-90">
            {{ selectedPayment.fee_name }} for {{ selectedPayment.class_name }}
          </p>
        </div>

        <AppInput
          v-model="collectForm.amount"
          label="Settlement Amount (₹)"
          type="number"
          placeholder="Enter collection amount"
          required
          :error="collectErrors.amount"
        />
        <AppInput v-model="collectForm.method" type="select" label="Transaction Protocol" required>
          <option value="cash">💵 Physical Cash</option>
          <option value="upi">📲 Instant UPI</option>
          <option value="bank_transfer">🏛️ Bank Wire</option>
          <option value="cheque">📄 Security Cheque</option>
        </AppInput>
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showCollectModal = false">Abort</AppButton>
          <AppButton @click="handleCollect" class="px-8 shadow-large shadow-primary-200">Settle Transaction</AppButton>
        </div>
      </template>
    </AppModal>

    <!-- Quick Pay Polish -->
    <AppModal v-model="showQuickPayModal" title="Instant Settlement" size="sm">
      <div v-if="quickPayTarget" class="space-y-6">
        <div class="rounded-2xl bg-gradient-to-br from-red-600 to-red-400 p-6 text-white shadow-xl shadow-red-100">
          <p class="text-[10px] font-black uppercase tracking-widest opacity-80">Outstanding Balance</p>
          <p class="mt-1 text-2xl font-black">₹{{ quickPayTarget.due_amount.toLocaleString('en-IN') }}</p>
          <p class="mt-4 text-xs font-bold leading-relaxed opacity-90">
            Settling ledger for <span class="underline decoration-wavy">{{ quickPayTarget.student_name }}</span
            ><br />
            ({{ quickPayTarget.fee_name }})
          </p>
        </div>
        <AppInput
          v-model="quickPayAmount"
          label="Collection Value (₹)"
          type="number"
          :placeholder="`Max: ${quickPayTarget.due_amount}`"
        />
        <AppInput v-model="quickPayMethod" type="select" label="Payment Gateway">
          <option value="cash">💵 Cash</option>
          <option value="upi">📲 UPI</option>
          <option value="bank_transfer">🏛️ Bank</option>
          <option value="cheque">📄 Cheque</option>
        </AppInput>
      </div>
      <template #footer>
        <div class="flex items-center justify-end gap-3 w-full">
          <AppButton variant="secondary" @click="showQuickPayModal = false" class="flex-1">Cancel</AppButton>
          <AppButton @click="handleQuickPay" class="flex-1 shadow-lg shadow-primary-200">Collect</AppButton>
        </div>
      </template>
    </AppModal>

    <!-- Add Structure Modal -->
    <AppModal v-model="showStructureModal" title="Add Fee Structure" size="md">
      <form @submit.prevent="handleAddStructure" class="space-y-4">
        <AppInput v-model="structureForm.name" label="Fee Name" placeholder="e.g. Tuition Fee" required />
        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="structureForm.class_name" label="Class" placeholder="e.g. Class 10" required />
          <AppInput v-model="structureForm.amount" label="Amount (₹)" type="number" placeholder="15000" required />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="structureForm.due_date" label="Due Date" type="date" required />
          <AppInput v-model="structureForm.academic_year" label="Academic Year" placeholder="2025-26" required />
        </div>
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showStructureModal = false">Cancel</AppButton>
          <AppButton @click="handleAddStructure">Add Structure</AppButton>
        </div>
      </template>
    </AppModal>

    <!-- Receipt Modal -->
    <AppModal v-model="showReceiptModal" title="Payment Receipt" size="md">
      <div v-if="receiptData" class="space-y-6" id="receipt">
        <div class="text-center border-b border-gray-200 dark:border-gray-700 pb-4">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">School ERP</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Fee Payment Receipt</p>
        </div>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div
            v-for="field in [
              { l: 'Receipt No', v: receiptData.receipt_number },
              { l: 'Date', v: receiptData.payment_date },
              { l: 'Student Name', v: receiptData.student_name },
              { l: 'Class', v: receiptData.class_name },
            ]"
            :key="field.l"
          >
            <p class="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest">{{ field.l }}</p>
            <p class="font-black text-gray-900 dark:text-white">{{ field.v }}</p>
          </div>
        </div>
        <div class="rounded-2xl bg-gray-50 dark:bg-gray-800 p-6">
          <table class="w-full text-sm">
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr
                v-for="row in [
                  { l: 'Fee Type', v: receiptData.fee_name, c: 'text-gray-900 dark:text-white' },
                  { l: 'Total Amount', v: '₹' + receiptData.total_amount.toLocaleString('en-IN'), c: 'text-gray-900' },
                  {
                    l: 'Amount Paid',
                    v: '₹' + receiptData.paid_amount.toLocaleString('en-IN'),
                    c: 'text-green-600 font-black',
                  },
                  {
                    l: 'Balance Due',
                    v: '₹' + receiptData.due_amount.toLocaleString('en-IN'),
                    c: receiptData.due_amount > 0 ? 'text-red-600 font-black' : 'text-gray-400',
                  },
                ]"
                :key="row.l"
              >
                <td class="py-3 text-xs font-black uppercase text-gray-400">{{ row.l }}</td>
                <td :class="['py-3 text-right font-bold', row.c]">{{ row.v }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="text-xs font-bold text-gray-400 text-center uppercase tracking-widest">
          Payment Method:
          <span class="text-gray-900 dark:text-white">{{ receiptData.payment_method?.replace('_', ' ') }}</span>
        </div>
      </div>
      <template #footer>
        <div class="flex items-center justify-end gap-3 w-full">
          <AppButton variant="secondary" @click="showReceiptModal = false" class="flex-1">Close</AppButton>
          <AppButton @click="handlePrintReceipt" class="flex-1 shadow-xl shadow-primary-200"
            >Print Professional Receipt</AppButton
          >
        </div>
      </template>
    </AppModal>

    <!-- BULLETPROOF PRINT ENGINE (TELEPORTED TO BODY AT ROOT) -->
    <Teleport to="body">
      <div
        id="receipt-print-engine"
        class="bg-white pointer-events-none opacity-0 -z-50 absolute left-0 top-0 w-full print:opacity-100 print:static print:z-auto print:mt-0 print:pt-0 flex justify-center"
      >
        <div v-if="receiptData" class="py-10 px-10 w-full max-w-3xl">
          <FeeReceipt :payment="receiptData" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { FeePayment } from '@/types'
import { useFeeStore } from '@/stores/fees'
import { useStudentStore } from '@/stores/students'
import { useToastStore } from '@/stores/toast'
import { useSmsStore } from '@/stores/sms'
import { useSettingsStore } from '@/stores/settings'
import StatCard from '@/components/ui/StatCard.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import FeeReceipt from '@/components/common/FeeReceipt.vue'
import { nextTick } from 'vue'

const feeStore = useFeeStore()
const studentStore = useStudentStore()
const toast = useToastStore()
const smsStore = useSmsStore()
const settingsStore = useSettingsStore()

const activeTab = ref('payments')
const isPrinting = ref(false)
const tabs = computed(() => [
  { key: 'payments', label: 'Payments', count: feeStore.payments.length },
  { key: 'due', label: 'Due List', count: feeStore.duePayments.length },
  { key: 'structures', label: 'Structures', count: null },
])

const showCollectModal = ref(false)
const selectedPayment = ref<FeePayment | null>(null)
const collectForm = reactive({ studentSearch: '', amount: '', method: 'cash' })
const collectErrors = reactive({ student: '', amount: '' })

const matchedDuePayments = computed(() => {
  if (!collectForm.studentSearch) return []
  const q = collectForm.studentSearch.toLowerCase()
  return feeStore.duePayments.filter((p) => p.student_name.toLowerCase().includes(q)).slice(0, 5)
})

function selectPaymentForCollection(payment: FeePayment) {
  selectedPayment.value = payment
  collectForm.studentSearch = payment.student_name
  collectForm.amount = String(payment.due_amount)
}

function handleCollect() {
  collectErrors.student = ''
  collectErrors.amount = ''

  if (!selectedPayment.value) {
    collectErrors.student = 'Select student record'
    return
  }
  const amt = Number(collectForm.amount)
  if (!amt || amt <= 0) {
    collectErrors.amount = 'Enter valid value'
    return
  }
  if (amt > selectedPayment.value.due_amount) {
    collectErrors.amount = 'Exceeds balance'
    return
  }

  feeStore.collectPayment(selectedPayment.value.id, amt, collectForm.method)

  if (settingsStore.settings.auto_sms_on_payment && selectedPayment.value) {
    const student = studentStore.students.find((s) => s.id === selectedPayment.value!.student_id)
    const phone = student?.phone || ''
    const p = feeStore.payments.find((fp) => fp.id === selectedPayment.value!.id)
    smsStore.sendPaymentSms(
      phone,
      selectedPayment.value.student_name,
      amt,
      selectedPayment.value.fee_name,
      p?.receipt_number || '',
      p?.due_amount || 0,
    )
  }

  showCollectModal.value = false
  selectedPayment.value = null
  collectForm.studentSearch = ''
  collectForm.amount = ''
}

const showQuickPayModal = ref(false)
const quickPayTarget = ref<FeePayment | null>(null)
const quickPayAmount = ref('')
const quickPayMethod = ref('cash')

function openQuickPay(payment: FeePayment) {
  quickPayTarget.value = payment
  quickPayAmount.value = String(payment.due_amount)
  quickPayMethod.value = 'cash'
  showQuickPayModal.value = true
}

function handleQuickPay() {
  if (!quickPayTarget.value) return
  const amt = Number(quickPayAmount.value)
  if (!amt || amt <= 0) {
    toast.warning('Enter valid value')
    return
  }
  if (amt > quickPayTarget.value.due_amount) {
    toast.warning('Exceeds balance')
    return
  }

  feeStore.collectPayment(quickPayTarget.value.id, amt, quickPayMethod.value)

  if (settingsStore.settings.auto_sms_on_payment) {
    const student = studentStore.students.find((s) => s.id === quickPayTarget.value!.student_id)
    const phone = student?.phone || ''
    const p = feeStore.payments.find((fp) => fp.id === quickPayTarget.value!.id)
    smsStore.sendPaymentSms(
      phone,
      quickPayTarget.value.student_name,
      amt,
      quickPayTarget.value.fee_name,
      p?.receipt_number || '',
      p?.due_amount || 0,
    )
  }

  showQuickPayModal.value = false
}

const showStructureModal = ref(false)
const structureForm = reactive({ name: '', class_name: '', amount: '', due_date: '', academic_year: '2025-26' })
function handleAddStructure() {
  if (!structureForm.name || !structureForm.class_name || !structureForm.amount) {
    toast.warning('Fields required')
    return
  }
  feeStore.addStructure({
    name: structureForm.name,
    class_name: structureForm.class_name,
    amount: Number(structureForm.amount),
    due_date: structureForm.due_date,
    academic_year: structureForm.academic_year,
  })
  showStructureModal.value = false
  Object.assign(structureForm, { name: '', class_name: '', amount: '', due_date: '', academic_year: '2025-26' })
}

const showReceiptModal = ref(false)
const receiptData = ref<FeePayment | null>(null)
function viewReceipt(payment: FeePayment) {
  receiptData.value = payment
  showReceiptModal.value = true
}
async function handlePrintReceipt() {
  if (!receiptData.value) return
  isPrinting.value = true

  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 500))

  window.print()

  // Clean up lock state, but leave content in buffer for asynchronous spoolers
  isPrinting.value = false
}

function statusColor(status: string) {
  const map: Record<string, 'green' | 'yellow' | 'red'> = { paid: 'green', partial: 'yellow', unpaid: 'red' }
  return map[status] || 'gray'
}
</script>

<style>
@media print {
  /* HIDE EVERYTHING EXCEPT THE TELEPORTED ENGINE */
  #app,
  header,
  aside,
  main,
  [role='dialog'],
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
  #receipt-print-engine {
    display: block !important;
    visibility: visible !important;
    position: static !important;
    top: auto !important;
    right: auto !important;
    bottom: auto !important;
    left: auto !important;
    width: 100% !important;
    height: auto !important;
    min-height: unset !important;
    overflow: visible !important;
    z-index: auto !important;
    padding: 0 !important;
    margin: 0 !important;
    background: white !important;
    opacity: 1 !important;
  }

  @page {
    size: A4;
    margin: 10mm;
  }
}
</style>

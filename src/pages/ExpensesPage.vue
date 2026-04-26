<template>
  <div class="space-y-8 animate-fade-in-up">
    <div
      class="relative overflow-hidden rounded-[2rem] bg-emerald-50 p-8 shadow-xl shadow-emerald-100/50 dark:border dark:border-emerald-900/30 dark:bg-gray-800/80 dark:shadow-none"
    >
      <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div
            class="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
          >
            Accounting and Ledgers
          </div>
          <h1 class="mt-3 text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            Expense
            <span class="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Management</span>
          </h1>
          <p class="mt-1 text-sm font-medium text-emerald-700/80 dark:text-emerald-300/70">
            Log, categorize, and track operational outflows across the institution.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <AppButton
            @click="openJournalModal"
            variant="secondary"
            class="h-[48px] px-6"
          >
            + Manual Journal
          </AppButton>
          <AppButton
            @click="openModal"
            class="h-[48px] bg-emerald-600 px-8 shadow-2xl shadow-emerald-200 hover:bg-emerald-700 dark:shadow-none"
          >
            + Log Expense
          </AppButton>
        </div>
      </div>
      <div
        class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-100/40 blur-3xl dark:bg-emerald-900/20"
      ></div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div
        class="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-800/50"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Capital Outflow</p>
            <p class="mt-1 text-3xl font-black tracking-tight text-rose-600 dark:text-rose-400">
              Rs {{ accStore.totalExpenses.toLocaleString('en-IN') }}
            </p>
          </div>
          <div
            class="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-sm font-black text-rose-600 shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-6 dark:bg-rose-900/30 dark:text-rose-300"
          >
            OUT
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
            class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-sm font-black text-gray-700 shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-6 dark:bg-gray-800 dark:text-gray-200"
          >
            TXN
          </div>
        </div>
      </div>

      <div
        class="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-800/50"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Top Spend Category</p>
            <p class="mt-1 text-2xl font-black tracking-tight text-emerald-600 capitalize dark:text-emerald-400">
              {{ topCategory || 'N/A' }}
            </p>
          </div>
          <div
            class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-sm font-black text-emerald-600 shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-6 dark:bg-emerald-900/30 dark:text-emerald-300"
          >
            TOP
          </div>
        </div>
      </div>

      <div
        class="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-800/50"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Unreconciled Bank Lines</p>
            <p class="mt-1 text-3xl font-black tracking-tight text-amber-600 dark:text-amber-400">
              {{ accStore.summary?.unreconciled_bank_entries || 0 }}
            </p>
          </div>
          <div
            class="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-sm font-black text-amber-600 shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-6 dark:bg-amber-900/30 dark:text-amber-300"
          >
            BNK
          </div>
        </div>
      </div>
    </div>

    <AppCard :no-padding="true" class="overflow-hidden border-none shadow-2xl">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="bg-gray-50/20 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:bg-gray-900/30">
              <th class="px-8 py-4">Transaction Details</th>
              <th class="px-6 py-4">Category</th>
              <th class="px-6 py-4">Beneficiary</th>
              <th class="px-8 py-4 text-right">Amount Outflow</th>
              <th class="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
            <tr
              v-for="expense in accStore.expenses"
              :key="expense.id"
              class="group transition-all hover:bg-emerald-50/30 dark:hover:bg-emerald-900/5"
            >
              <td class="px-8 py-5">
                <p class="font-black text-gray-900 transition-colors group-hover:text-emerald-600 dark:text-white">
                  {{ expense.title }}
                </p>
                <div class="mt-1 flex flex-wrap gap-2">
                  <span class="text-[10px] font-bold uppercase tracking-tighter text-gray-400">{{ expense.date }}</span>
                  <span
                    v-if="expense.reference_no"
                    class="text-[10px] font-black uppercase tracking-tighter text-emerald-500"
                  >
                    REF: {{ expense.reference_no }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-5">
                <span
                  :class="[
                    'inline-flex rounded-md border px-2.5 py-1 text-[9px] font-black uppercase tracking-widest shadow-sm',
                    categoryColor(expense.category),
                  ]"
                >
                  {{ expense.category }}
                </span>
              </td>
              <td class="px-6 py-5">
                <p class="text-xs font-black text-gray-900 dark:text-gray-200">
                  {{ expense.vendor_or_staff || 'Direct Account' }}
                </p>
                <p class="text-[10px] font-bold uppercase text-gray-400">
                  {{ expense.payment_method.replace('_', ' ') }}
                </p>
              </td>
              <td class="px-8 py-5 text-right">
                <p class="text-lg font-black text-rose-600">-Rs {{ expense.amount.toLocaleString('en-IN') }}</p>
              </td>
              <td class="px-6 py-5 text-center">
                <button
                  @click.stop="confirmDelete(expense)"
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

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1.9fr]">
      <AppCard title="Chart of Accounts">
        <div class="space-y-3">
          <div
            v-for="account in accStore.ledgerAccounts"
            :key="account.id"
            class="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 dark:border-gray-700 dark:bg-gray-800/40"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-xs font-black uppercase tracking-widest text-gray-400">{{ account.code }}</p>
                <p class="mt-1 text-sm font-black text-gray-900 dark:text-white">{{ account.name }}</p>
              </div>
              <span
                :class="[
                  'inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest',
                  accountTypeColor(account.type),
                ]"
              >
                {{ account.type }}
              </span>
            </div>
          </div>
          <EmptyState
            v-if="!accStore.ledgerAccounts.length"
            title="No accounts yet"
            message="Ledger accounts will appear after backend sync."
          />
        </div>
      </AppCard>

      <AppCard title="Recent Journal Entries" :no-padding="true" class="overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="bg-gray-50/40 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th class="px-6 py-4">Date</th>
                <th class="px-6 py-4">Ledger Account</th>
                <th class="px-6 py-4">Description</th>
                <th class="px-6 py-4 text-right">Debit</th>
                <th class="px-6 py-4 text-right">Credit</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
              <tr
                v-for="entry in accStore.ledgerEntries"
                :key="entry.id"
                class="transition-all hover:bg-gray-50/50 dark:hover:bg-gray-800/40"
              >
                <td class="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                  {{ entry.entry_date }}
                </td>
                <td class="px-6 py-4">
                  <p class="text-sm font-black text-gray-900 dark:text-white">{{ entry.account_name || 'Ledger' }}</p>
                  <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {{ entry.account_code }} {{ entry.account_type ? '- ' + entry.account_type : '' }}
                  </p>
                </td>
                <td class="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  {{ entry.description }}
                </td>
                <td class="px-6 py-4 text-right text-sm font-black text-emerald-600">
                  {{ entry.debit ? `Rs ${entry.debit.toLocaleString('en-IN')}` : '--' }}
                </td>
                <td class="px-6 py-4 text-right text-sm font-black text-rose-600">
                  {{ entry.credit ? `Rs ${entry.credit.toLocaleString('en-IN')}` : '--' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <EmptyState
          v-if="!accStore.ledgerEntries.length"
          title="No journal entries"
          message="Expense postings will create double-entry journal records here."
        />
      </AppCard>
    </div>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1.9fr]">
      <AppCard title="Bank Accounts">
        <template #actions>
          <AppButton size="sm" variant="secondary" @click="openBankAccountModal">Add Account</AppButton>
        </template>
        <div class="space-y-3">
          <div
            v-for="account in accStore.bankAccounts"
            :key="account.id"
            class="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 dark:border-gray-700 dark:bg-gray-800/40"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-sm font-black text-gray-900 dark:text-white">{{ account.account_name }}</p>
                <p class="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {{ account.bank_name }} · {{ account.account_number }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-sm font-black text-emerald-600">Rs {{ account.opening_balance.toLocaleString('en-IN') }}</p>
                <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {{ account.last_reconciled_at ? 'Reconciled' : 'Not reconciled' }}
                </p>
              </div>
            </div>
          </div>
          <EmptyState
            v-if="!accStore.bankAccounts.length"
            title="No bank accounts"
            message="Add a bank account to start reconciliation."
          />
        </div>
      </AppCard>

      <AppCard title="Trial Balance" :no-padding="true" class="overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="bg-gray-50/40 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th class="px-6 py-4">Account</th>
                <th class="px-6 py-4">Type</th>
                <th class="px-6 py-4 text-right">Debit</th>
                <th class="px-6 py-4 text-right">Credit</th>
                <th class="px-6 py-4 text-right">Net</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
              <tr v-for="row in accStore.trialBalance" :key="row.account_id">
                <td class="px-6 py-4">
                  <p class="text-sm font-black text-gray-900 dark:text-white">{{ row.name }}</p>
                  <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">{{ row.code }}</p>
                </td>
                <td class="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">{{ row.type }}</td>
                <td class="px-6 py-4 text-right text-sm font-black text-emerald-600">{{ row.debit ? `Rs ${row.debit.toLocaleString('en-IN')}` : '--' }}</td>
                <td class="px-6 py-4 text-right text-sm font-black text-rose-600">{{ row.credit ? `Rs ${row.credit.toLocaleString('en-IN')}` : '--' }}</td>
                <td class="px-6 py-4 text-right text-sm font-black text-gray-900 dark:text-white">{{ row.net ? `Rs ${row.net.toLocaleString('en-IN')}` : '--' }}</td>
              </tr>
            </tbody>
            <tfoot v-if="accStore.trialBalanceTotals" class="bg-gray-50/40">
              <tr>
                <td class="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500" colspan="2">
                  {{ accStore.trialBalanceTotals.balanced ? 'Balanced' : 'Out of balance' }}
                </td>
                <td class="px-6 py-4 text-right text-sm font-black text-emerald-600">Rs {{ accStore.trialBalanceTotals.total_debit.toLocaleString('en-IN') }}</td>
                <td class="px-6 py-4 text-right text-sm font-black text-rose-600">Rs {{ accStore.trialBalanceTotals.total_credit.toLocaleString('en-IN') }}</td>
                <td class="px-6 py-4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <EmptyState
          v-if="!accStore.trialBalance.length"
          title="No trial balance yet"
          message="Ledger activity will appear here after backend sync."
        />
      </AppCard>
    </div>

    <AppCard title="Bank Reconciliation" :no-padding="true" class="overflow-hidden border-none shadow-2xl">
      <div class="flex items-center justify-between gap-4 bg-gray-50/40 px-6 py-4">
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Statement lines matched against ledger activity</p>
        <AppButton size="sm" variant="secondary" @click="openBankLineModal">Add Statement Line</AppButton>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="bg-gray-50/20 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:bg-gray-900/30">
              <th class="px-8 py-4">Bank Entry</th>
              <th class="px-6 py-4">Bank Account</th>
              <th class="px-6 py-4">Direction</th>
              <th class="px-6 py-4">Matched Ledger</th>
              <th class="px-8 py-4 text-right">Amount</th>
              <th class="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
            <tr v-for="entry in accStore.bankReconciliationEntries" :key="entry.id">
              <td class="px-8 py-5">
                <p class="font-black text-gray-900 dark:text-white">{{ entry.description }}</p>
                <div class="mt-1 flex flex-wrap gap-2">
                  <span class="text-[10px] font-bold uppercase tracking-tighter text-gray-400">{{ entry.transaction_date }}</span>
                  <span v-if="entry.reference_no" class="text-[10px] font-black uppercase tracking-tighter text-emerald-500">REF: {{ entry.reference_no }}</span>
                </div>
              </td>
              <td class="px-6 py-5 text-xs font-black text-gray-700 dark:text-gray-200">{{ entry.bank_account_name || '--' }}</td>
              <td class="px-6 py-5">
                <span :class="entry.direction === 'inflow' ? 'inline-flex rounded-md border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-700' : 'inline-flex rounded-md border border-rose-100 bg-rose-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-rose-700'">
                  {{ entry.direction }}
                </span>
              </td>
              <td class="px-6 py-5">
                <p class="text-xs font-black text-gray-900 dark:text-gray-200">{{ entry.ledger_entry_description || 'Unmatched' }}</p>
                <p class="text-[10px] font-bold uppercase text-gray-400">{{ entry.matched ? 'Matched' : 'Pending review' }}</p>
              </td>
              <td class="px-8 py-5 text-right">
                <p :class="entry.direction === 'inflow' ? 'text-lg font-black text-emerald-600' : 'text-lg font-black text-rose-600'">
                  {{ entry.direction === 'inflow' ? '+' : '-' }}Rs {{ entry.amount.toLocaleString('en-IN') }}
                </p>
              </td>
              <td class="px-6 py-5 text-center">
                <AppButton
                  size="sm"
                  variant="secondary"
                  @click="openMatchModal(entry)"
                  :loading="accStore.saving"
                >
                  {{ entry.matched ? 'Update Match' : 'Match Ledger' }}
                </AppButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <EmptyState v-if="!accStore.bankReconciliationEntries.length" title="No statement lines" message="Import or add bank statement lines to reconcile them here." />
    </AppCard>

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
          <AppInput v-model="form.amount" type="number" label="Amount (Rs)" required class="font-bold" />
          <AppInput v-model="form.category" type="select" label="Ledger Category" required class="font-bold">
            <option value="salary">Salary and Payroll</option>
            <option value="maintenance">Maintenance</option>
            <option value="utilities">Utilities and Bills</option>
            <option value="supplies">Supplies and Equipment</option>
            <option value="events">School Events</option>
            <option value="other">Other or Miscellaneous</option>
          </AppInput>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="form.date" type="date" label="Transaction Date" required class="font-bold" />
          <AppInput v-model="form.payment_method" type="select" label="Mode of Outflow" required class="font-bold">
            <option value="cash">Cash</option>
            <option value="bank_transfer">Bank Transfer (IMPS/NEFT)</option>
            <option value="cheque">Cheque</option>
            <option value="card">Credit or Debit Card</option>
            <option value="upi">UPI</option>
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
          <AppButton variant="secondary" @click="showModal = false" :disabled="accStore.saving">Cancel</AppButton>
          <AppButton
            @click="handleSubmit"
            class="bg-emerald-600 hover:bg-emerald-700"
            :loading="accStore.saving"
          >
            Commit Expense
          </AppButton>
        </div>
      </template>
    </AppModal>

    <AppModal v-model="showBankAccountModal" title="Add Bank Account" size="md">
      <form @submit.prevent="handleBankAccountSubmit" class="space-y-6">
        <AppInput v-model="bankAccountForm.account_name" label="Account Name" required class="font-bold" />
        <AppInput v-model="bankAccountForm.bank_name" label="Bank Name" required class="font-bold" />
        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="bankAccountForm.account_number" label="Account Number" required class="font-bold" />
          <AppInput v-model="bankAccountForm.ifsc_code" label="IFSC Code" class="font-bold" />
        </div>
        <AppInput v-model="bankAccountForm.opening_balance" type="number" label="Opening Balance" class="font-bold" />
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showBankAccountModal = false" :disabled="accStore.saving">Cancel</AppButton>
          <AppButton @click="handleBankAccountSubmit" :loading="accStore.saving">Create Account</AppButton>
        </div>
      </template>
    </AppModal>

    <AppModal v-model="showBankLineModal" title="Add Bank Statement Line" size="md">
      <form @submit.prevent="handleBankLineSubmit" class="space-y-6">
        <AppInput v-model="bankLineForm.bank_account_id" type="select" label="Bank Account" required class="font-bold">
          <option value="">Select Account</option>
          <option v-for="account in accStore.bankAccounts" :key="account.id" :value="String(account.id)">
            {{ account.bank_name }} - {{ account.account_name }}
          </option>
        </AppInput>
        <AppInput v-model="bankLineForm.description" label="Description" required class="font-bold" />
        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="bankLineForm.transaction_date" type="date" label="Transaction Date" required class="font-bold" />
          <AppInput v-model="bankLineForm.amount" type="number" label="Amount" required class="font-bold" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="bankLineForm.direction" type="select" label="Direction" required class="font-bold">
            <option value="inflow">Inflow</option>
            <option value="outflow">Outflow</option>
          </AppInput>
          <AppInput v-model="bankLineForm.reference_no" label="Reference No" class="font-bold" />
        </div>
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showBankLineModal = false" :disabled="accStore.saving">Cancel</AppButton>
          <AppButton @click="handleBankLineSubmit" :loading="accStore.saving">Add Line</AppButton>
        </div>
      </template>
    </AppModal>

    <AppModal v-model="showJournalModal" title="Post Manual Journal" size="md">
      <form @submit.prevent="handleJournalSubmit" class="space-y-6">
        <AppInput v-model="journalForm.description" label="Description" required class="font-bold" />
        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="journalForm.entry_date" type="date" label="Entry Date" required class="font-bold" />
          <AppInput v-model="journalForm.amount" type="number" label="Amount" required class="font-bold" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="journalForm.debit_account_id" type="select" label="Debit Account" required class="font-bold">
            <option value="">Select Debit Account</option>
            <option v-for="account in accStore.ledgerAccounts" :key="`dr-${account.id}`" :value="String(account.id)">
              {{ account.code }} - {{ account.name }}
            </option>
          </AppInput>
          <AppInput v-model="journalForm.credit_account_id" type="select" label="Credit Account" required class="font-bold">
            <option value="">Select Credit Account</option>
            <option v-for="account in accStore.ledgerAccounts" :key="`cr-${account.id}`" :value="String(account.id)">
              {{ account.code }} - {{ account.name }}
            </option>
          </AppInput>
        </div>
        <AppInput v-model="journalForm.reference_no" label="Reference No" class="font-bold" />
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showJournalModal = false" :disabled="accStore.saving">Cancel</AppButton>
          <AppButton @click="handleJournalSubmit" :loading="accStore.saving">Post Journal</AppButton>
        </div>
      </template>
    </AppModal>

    <AppModal v-model="showMatchModal" title="Match Bank Line" size="md">
      <form @submit.prevent="handleMatchSubmit" class="space-y-6">
        <div v-if="selectedBankEntry" class="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 dark:border-gray-700 dark:bg-gray-800/40">
          <p class="text-sm font-black text-gray-900 dark:text-white">{{ selectedBankEntry.description }}</p>
          <p class="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {{ selectedBankEntry.transaction_date }} - {{ selectedBankEntry.direction }} - Rs {{ selectedBankEntry.amount.toLocaleString('en-IN') }}
          </p>
        </div>
        <AppInput v-model="matchForm.ledger_entry_id" type="select" label="Ledger Entry" class="font-bold">
          <option value="">Leave unmatched</option>
          <option v-for="entry in ledgerMatchOptions" :key="entry.id" :value="String(entry.id)">
            {{ entry.entry_date }} - {{ entry.account_code }} - {{ entry.description }} - Rs {{ (entry.debit || entry.credit).toLocaleString('en-IN') }}
          </option>
        </AppInput>
      </form>
      <template #footer>
        <div class="flex items-center justify-between gap-3">
          <AppButton
            v-if="selectedBankEntry?.matched"
            variant="secondary"
            @click="handleUnmatch"
            :loading="accStore.saving"
          >
            Unmatch
          </AppButton>
          <div class="ml-auto flex items-center gap-3">
            <AppButton variant="secondary" @click="showMatchModal = false" :disabled="accStore.saving">Cancel</AppButton>
            <AppButton @click="handleMatchSubmit" :loading="accStore.saving">Save Match</AppButton>
          </div>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAccountingStore, type ExpenseRecord, type ExpenseCategory } from '@/stores/accounting'
import type { AccountingBankReconciliationEntry, AccountingLedgerEntry } from '@/services/accountingService'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const accStore = useAccountingStore()

const showModal = ref(false)
const showBankAccountModal = ref(false)
const showBankLineModal = ref(false)
const showJournalModal = ref(false)
const showMatchModal = ref(false)
const selectedBankEntry = ref<AccountingBankReconciliationEntry | null>(null)
const form = reactive({
  title: '',
  category: 'other' as ExpenseCategory,
  amount: '' as unknown as number,
  date: new Date().toISOString().split('T')[0],
  vendor_or_staff: '',
  payment_method: 'bank_transfer' as ExpenseRecord['payment_method'],
  reference_no: '',
})
const bankAccountForm = reactive({
  account_name: '',
  bank_name: '',
  account_number: '',
  ifsc_code: '',
  opening_balance: '' as unknown as number,
})
const bankLineForm = reactive({
  bank_account_id: '',
  transaction_date: new Date().toISOString().split('T')[0],
  description: '',
  amount: '' as unknown as number,
  direction: 'outflow' as 'inflow' | 'outflow',
  reference_no: '',
})
const journalForm = reactive({
  entry_date: new Date().toISOString().split('T')[0],
  description: '',
  amount: '' as unknown as number,
  debit_account_id: '',
  credit_account_id: '',
  reference_no: '',
})
const matchForm = reactive({
  ledger_entry_id: '',
})

const topCategory = computed(() => accStore.topExpenseCategory)
const ledgerMatchOptions = computed(() =>
  accStore.ledgerEntries.filter((entry) => isLedgerAmountCompatible(entry, selectedBankEntry.value)),
)

onMounted(() => {
  void accStore.refresh()
})

function categoryColor(category: string) {
  const map: Record<string, string> = {
    salary: 'bg-purple-50 border-purple-100 text-purple-700',
    maintenance: 'bg-amber-50 border-amber-100 text-amber-700',
    utilities: 'bg-blue-50 border-blue-100 text-blue-700',
    supplies: 'bg-indigo-50 border-indigo-100 text-indigo-700',
    events: 'bg-rose-50 border-rose-100 text-rose-700',
    other: 'bg-gray-50 border-gray-100 text-gray-700',
  }
  return map[category] || map.other
}

function accountTypeColor(type: string) {
  const map: Record<string, string> = {
    asset: 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
    liability: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    income: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    expense: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    equity: 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  }
  return map[type] || map.asset
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

function openBankAccountModal() {
  Object.assign(bankAccountForm, {
    account_name: '',
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    opening_balance: '',
  })
  showBankAccountModal.value = true
}

function openBankLineModal() {
  Object.assign(bankLineForm, {
    bank_account_id: '',
    transaction_date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    direction: 'outflow',
    reference_no: '',
  })
  showBankLineModal.value = true
}

function openJournalModal() {
  Object.assign(journalForm, {
    entry_date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    debit_account_id: '',
    credit_account_id: '',
    reference_no: '',
  })
  showJournalModal.value = true
}

function openMatchModal(entry: AccountingBankReconciliationEntry) {
  selectedBankEntry.value = entry
  Object.assign(matchForm, {
    ledger_entry_id: entry.ledger_entry_id ? String(entry.ledger_entry_id) : '',
  })
  showMatchModal.value = true
}

function isLedgerAmountCompatible(entry: AccountingLedgerEntry, bankEntry: AccountingBankReconciliationEntry | null) {
  if (!bankEntry) return true
  const amount = bankEntry.amount
  if (bankEntry.direction === 'inflow') return Math.abs(entry.debit - amount) < 0.0001
  return Math.abs(entry.credit - amount) < 0.0001
}

async function handleSubmit() {
  if (!form.title || !form.amount || !form.category) return

  try {
    await accStore.addExpense({
      title: form.title,
      category: form.category,
      amount: Number(form.amount),
      date: form.date,
      vendor_or_staff: form.vendor_or_staff,
      payment_method: form.payment_method,
      reference_no: form.reference_no,
    })
    showModal.value = false
  } catch {
    // Store handles the toast and keeps the form values for retry.
  }
}

async function confirmDelete(expense: ExpenseRecord) {
  if (confirm(`Are you sure you want to delete this outflow record: ${expense.title}?`)) {
    await accStore.deleteExpense(expense.id)
  }
}

async function handleBankAccountSubmit() {
  if (!bankAccountForm.account_name || !bankAccountForm.bank_name || !bankAccountForm.account_number) return
  try {
    await accStore.addBankAccount({
      account_name: bankAccountForm.account_name,
      bank_name: bankAccountForm.bank_name,
      account_number: bankAccountForm.account_number,
      ifsc_code: bankAccountForm.ifsc_code || null,
      opening_balance: Number(bankAccountForm.opening_balance || 0),
    })
    showBankAccountModal.value = false
  } catch {}
}

async function handleBankLineSubmit() {
  if (!bankLineForm.bank_account_id || !bankLineForm.description || !bankLineForm.amount) return
  try {
    await accStore.addBankReconciliationEntry({
      bank_account_id: Number(bankLineForm.bank_account_id),
      transaction_date: bankLineForm.transaction_date,
      description: bankLineForm.description,
      amount: Number(bankLineForm.amount),
      direction: bankLineForm.direction,
      reference_no: bankLineForm.reference_no || null,
    })
    showBankLineModal.value = false
  } catch {}
}

async function handleJournalSubmit() {
  if (!journalForm.description || !journalForm.amount || !journalForm.debit_account_id || !journalForm.credit_account_id) return
  try {
    await accStore.addManualJournal({
      entry_date: journalForm.entry_date,
      description: journalForm.description,
      amount: Number(journalForm.amount),
      debit_account_id: Number(journalForm.debit_account_id),
      credit_account_id: Number(journalForm.credit_account_id),
      reference_no: journalForm.reference_no || null,
    })
    showJournalModal.value = false
  } catch {}
}

async function handleMatchSubmit() {
  if (!selectedBankEntry.value) return
  try {
    await accStore.matchBankReconciliationEntry(selectedBankEntry.value.id, {
      matched: Boolean(matchForm.ledger_entry_id),
      ledger_entry_id: matchForm.ledger_entry_id ? Number(matchForm.ledger_entry_id) : null,
    })
    showMatchModal.value = false
    selectedBankEntry.value = null
  } catch {}
}

async function handleUnmatch() {
  if (!selectedBankEntry.value) return
  try {
    await accStore.matchBankReconciliationEntry(selectedBankEntry.value.id, {
      matched: false,
      ledger_entry_id: null,
    })
    showMatchModal.value = false
    selectedBankEntry.value = null
  } catch {}
}
</script>

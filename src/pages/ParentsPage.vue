<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          👨‍👩‍👧‍👦 Parent & Guardian
          <span class="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">Management</span>
        </h1>
        <p class="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
          {{ allParents.length }} registered families · {{ studentsWithMultipleChildren.length }} families with multiple
          wards
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="sendBulkSms"
          class="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          📱 Bulk SMS
        </button>
        <button
          @click="showAddModal = true"
          class="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-200 transition-all hover:bg-primary-700 hover:scale-105 dark:shadow-none"
        >
          + Add Parent
        </button>
      </div>
    </div>

    <!-- Stats Summary -->
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-800/50"
      >
        <div class="flex items-center gap-3">
          <div
            :class="[
              'flex h-11 w-11 items-center justify-center rounded-xl text-xl transition-transform group-hover:scale-110',
              stat.bg,
            ]"
          >
            {{ stat.icon }}
          </div>
          <div>
            <p class="text-2xl font-black text-gray-900 dark:text-white">{{ stat.value }}</p>
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div class="relative flex-1">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"
            />
          </svg>
        </div>
        <input
          v-model="search"
          type="text"
          placeholder="Search by parent name, phone, email or student name..."
          class="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <select
        v-model="classFilter"
        class="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
      >
        <option value="">All Classes</option>
        <option v-for="cls in classes" :key="cls" :value="cls">{{ cls }}</option>
      </select>
      <select
        v-model="feeFilter"
        class="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
      >
        <option value="">All Fee Status</option>
        <option value="due">Has Dues</option>
        <option value="paid">Fully Paid</option>
      </select>
    </div>

    <!-- Parents Table -->
    <div
      class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800/50"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-50 bg-gray-50/80 dark:border-gray-700 dark:bg-gray-900/30">
              <th class="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                Parent / Guardian
              </th>
              <th class="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                Contact
              </th>
              <th class="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                Ward(s)
              </th>
              <th class="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                Fee Status
              </th>
              <th class="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Login</th>
              <th class="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
            <tr
              v-for="parent in filteredParents"
              :key="parent.phone"
              class="group transition-colors hover:bg-primary-50/20 dark:hover:bg-primary-900/5"
            >
              <!-- Parent Name -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 text-sm font-black text-primary-700 dark:from-primary-900/30 dark:to-primary-800/30 dark:text-primary-400"
                  >
                    {{ parent.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="font-black text-gray-900 dark:text-white">{{ parent.name }}</p>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {{ parent.children.length }} ward{{ parent.children.length > 1 ? 's' : '' }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Contact -->
              <td class="px-6 py-4">
                <p class="font-semibold text-gray-900 dark:text-white">{{ parent.phone }}</p>
                <p class="text-xs text-gray-400 break-all">{{ parent.email }}</p>
              </td>

              <!-- Wards -->
              <td class="px-6 py-4">
                <div class="space-y-1">
                  <div v-for="child in parent.children" :key="child.id" class="flex items-center gap-1.5">
                    <router-link
                      :to="`/students/${child.id}`"
                      class="text-xs font-bold text-primary-600 hover:text-primary-700 hover:underline transition-colors"
                    >
                      {{ child.name }}
                    </router-link>
                    <span
                      class="rounded-full bg-gray-100 px-1.5 py-0.5 text-[9px] font-black text-gray-500 dark:bg-gray-700"
                      >{{ child.class_name }}-{{ child.section }}</span
                    >
                  </div>
                </div>
              </td>

              <!-- Fee Status -->
              <td class="px-6 py-4">
                <div v-if="parent.totalDue > 0">
                  <p class="text-sm font-black text-red-600">₹{{ parent.totalDue.toLocaleString('en-IN') }}</p>
                  <p class="text-[10px] font-bold text-red-400 uppercase">Outstanding</p>
                </div>
                <div v-else>
                  <span
                    class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                  >
                    ✓ Cleared
                  </span>
                </div>
              </td>

              <!-- Login -->
              <td class="px-6 py-4">
                <div class="space-y-0.5">
                  <p class="text-[10px] font-mono text-gray-500 dark:text-gray-400">parent@school.com</p>
                  <span
                    class="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-black text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                  >
                    🔑 parent123
                  </span>
                </div>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="openEdit(parent)"
                    class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-all hover:bg-primary-100 hover:text-primary-600 dark:bg-gray-700 dark:text-gray-400"
                    title="Edit Parent"
                  >
                    ✏️
                  </button>
                  <button
                    @click="sendSms(parent)"
                    class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-all hover:bg-blue-100 hover:text-blue-600 dark:bg-gray-700 dark:text-gray-400"
                    title="Send SMS"
                  >
                    📱
                  </button>
                  <router-link
                    v-if="parent.totalDue > 0"
                    to="/fees"
                    class="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 transition-all hover:bg-red-100 hover:text-red-700 dark:bg-red-900/20"
                    title="Collect Fee"
                    >💳</router-link
                  >
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="!filteredParents.length" class="py-16 text-center">
        <div
          class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl dark:bg-gray-700"
        >
          👨‍👩‍👧‍👦
        </div>
        <p class="mt-4 text-base font-black text-gray-900 dark:text-white">No Parents Found</p>
        <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filters</p>
      </div>

      <!-- Table Footer -->
      <div
        v-if="filteredParents.length"
        class="border-t border-gray-50 bg-gray-50/50 px-6 py-3 dark:border-gray-700 dark:bg-gray-900/20"
      >
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Showing {{ filteredParents.length }} of {{ allParents.length }} families
        </p>
      </div>
    </div>

    <!-- Add / Edit Parent Modal -->
    <Teleport to="body">
      <div
        v-if="showEditModal || showAddModal"
        class="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
        @click.self="closeModals"
      >
        <div
          class="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl dark:bg-gray-900 overflow-hidden animate-scale-in"
        >
          <!-- Modal Header -->
          <div class="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-800">
            <div>
              <h2 class="text-lg font-black text-gray-900 dark:text-white">
                {{ showAddModal ? '+ Add New Parent' : '✏️ Edit Parent Details' }}
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                {{
                  showAddModal
                    ? "Enter the parent's phone number to search & auto-link their ward(s)"
                    : 'Update guardian details. All wards sharing this number will be updated.'
                }}
              </p>
            </div>
            <button
              @click="closeModals"
              class="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
            >
              ✕
            </button>
          </div>

          <div class="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            <!-- ── STEP 1: Phone lookup (Add mode) / Phone display (Edit mode) ── -->
            <div>
              <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">
                📱 Phone Number <span class="text-primary-500">*</span>
                <span v-if="showAddModal" class="ml-1 font-medium text-gray-400 normal-case tracking-normal"
                  >(Unique ID — used to find linked wards)</span
                >
              </label>
              <div class="relative">
                <input
                  v-model="editForm.phone"
                  type="tel"
                  maxlength="10"
                  :readonly="showEditModal"
                  @input="onPhoneLookup"
                  :class="[
                    'w-full rounded-xl border px-4 py-3 text-sm font-bold transition-all',
                    showEditModal
                      ? 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800'
                      : 'border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white',
                    phoneMatchState === 'found' ? 'border-emerald-400 bg-emerald-50/30' : '',
                    phoneMatchState === 'not-found' ? 'border-amber-300 bg-amber-50/30' : '',
                  ]"
                  placeholder="Enter 10-digit mobile number"
                />
                <!-- Lookup badge -->
                <div
                  v-if="editForm.phone.length >= 10 && showAddModal"
                  class="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <span
                    v-if="phoneMatchState === 'found'"
                    class="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-700"
                    >✓ Found</span
                  >
                  <span
                    v-else-if="phoneMatchState === 'not-found'"
                    class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-700"
                    >⚠ No match</span
                  >
                </div>
              </div>

              <!-- Phone lock notice in edit mode -->
              <p v-if="showEditModal" class="mt-1.5 text-[10px] text-gray-400">
                🔒 Phone number is the unique ID — cannot be changed directly. Edit via Students page.
              </p>
            </div>

            <!-- ── Auto-matched wards (Add mode phone lookup result) ── -->
            <div
              v-if="showAddModal && phoneMatchedStudents.length"
              class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800/30 dark:bg-emerald-900/10"
            >
              <p class="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-3">
                ✅ Auto-linked Ward(s) Found
              </p>
              <div class="space-y-2">
                <div
                  v-for="s in phoneMatchedStudents"
                  :key="s.id"
                  class="flex items-center gap-3 rounded-xl bg-white border border-emerald-100 p-3 dark:bg-gray-800 dark:border-emerald-900/30"
                >
                  <div
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-sm font-black text-emerald-700 dark:bg-emerald-900/30"
                  >
                    {{ s.name.charAt(0) }}
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-black text-gray-900 dark:text-white">{{ s.name }}</p>
                    <p class="text-[10px] text-gray-500">
                      {{ s.class_name }}-{{ s.section }} · Roll #{{ s.roll_number }}
                    </p>
                  </div>
                  <span class="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-black text-emerald-700"
                    >LINKED</span
                  >
                </div>
              </div>
              <p class="mt-2 text-[10px] text-emerald-600">
                Parent details will be applied to {{ phoneMatchedStudents.length }} student record(s).
              </p>
            </div>

            <!-- ── No match: manual student select ── -->
            <div
              v-if="showAddModal && editForm.phone.length >= 10 && !phoneMatchedStudents.length"
              class="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/30 dark:bg-amber-900/10"
            >
              <p class="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-3">
                ⚠ No existing student found — Manually link ward
              </p>
              <select
                v-model="editForm.linked_student_id"
                class="w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm font-medium focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                <option :value="null">Select a student to link...</option>
                <option v-for="s in studentStore.students" :key="s.id" :value="s.id">
                  {{ s.name }} — {{ s.class_name }}-{{ s.section }} ({{ s.roll_number }})
                </option>
              </select>
            </div>

            <!-- ── Edit mode: show all current linked wards ── -->
            <div
              v-if="showEditModal && editLinkedStudents.length"
              class="rounded-2xl border border-blue-100 bg-blue-50/40 p-4 dark:border-blue-900/20 dark:bg-blue-900/5"
            >
              <p class="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3">
                Linked Ward(s) — Matched by Phone
              </p>
              <div class="space-y-2">
                <div
                  v-for="s in editLinkedStudents"
                  :key="s.id"
                  class="flex items-center gap-3 rounded-xl bg-white border border-blue-100 p-3 dark:bg-gray-800 dark:border-blue-900/20"
                >
                  <div
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-black text-blue-700 dark:bg-blue-900/30"
                  >
                    {{ s.name.charAt(0) }}
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-black text-gray-900 dark:text-white">{{ s.name }}</p>
                    <p class="text-[10px] text-gray-500">
                      {{ s.class_name }}-{{ s.section }} · Roll #{{ s.roll_number }}
                    </p>
                  </div>
                  <router-link :to="`/students/${s.id}`" class="text-[10px] font-bold text-blue-600 hover:underline"
                    >View →</router-link
                  >
                </div>
              </div>
            </div>

            <!-- ── Parent / Guardian Name ── -->
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5"
                  >Parent / Guardian Name *</label
                >
                <input
                  v-model="editForm.name"
                  type="text"
                  class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Full Name"
                />
              </div>
              <div>
                <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Email</label>
                <input
                  v-model="editForm.email"
                  type="email"
                  class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5"
                  >Occupation</label
                >
                <input
                  v-model="editForm.occupation"
                  type="text"
                  class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="e.g. Business"
                />
              </div>
              <div class="col-span-2">
                <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5"
                  >Address</label
                >
                <input
                  v-model="editForm.address"
                  type="text"
                  class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Full address"
                />
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-1">
              <button
                @click="closeModals"
                class="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                @click="saveParent"
                :disabled="!canSave"
                :class="[
                  'flex-1 rounded-xl py-3 text-sm font-bold text-white transition-all',
                  canSave
                    ? 'bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-200 hover:scale-[1.02] dark:shadow-none'
                    : 'bg-gray-300 cursor-not-allowed dark:bg-gray-700',
                ]"
              >
                {{ showAddModal ? '+ Add Parent' : '✓ Save Changes' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- SMS Modal -->
    <Teleport to="body">
      <div
        v-if="showSmsModal"
        class="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
        @click.self="showSmsModal = false"
      >
        <div
          class="relative w-full max-w-md rounded-3xl bg-white shadow-2xl dark:bg-gray-900 overflow-hidden animate-scale-in"
        >
          <div class="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-800">
            <div>
              <h2 class="text-lg font-black text-gray-900 dark:text-white">📱 Send SMS</h2>
              <p class="text-xs text-gray-500 mt-0.5">To {{ smsTarget?.name }} · {{ smsTarget?.phone }}</p>
            </div>
            <button
              @click="showSmsModal = false"
              class="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800"
            >
              ✕
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2"
                >Select Template</label
              >
              <div class="space-y-2">
                <button
                  v-for="tmpl in smsTemplates"
                  :key="tmpl.label"
                  @click="smsMessage = tmpl.message"
                  class="w-full rounded-xl border border-gray-100 p-3 text-left hover:border-primary-200 hover:bg-primary-50/30 transition-colors dark:border-gray-700 dark:hover:bg-primary-900/10"
                >
                  <p class="text-xs font-black text-gray-800 dark:text-white">{{ tmpl.label }}</p>
                  <p class="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{{ tmpl.message }}</p>
                </button>
              </div>
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Message</label>
              <textarea
                v-model="smsMessage"
                rows="3"
                class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 resize-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              ></textarea>
              <p class="mt-1 text-[10px] text-gray-400">{{ smsMessage.length }}/160 chars</p>
            </div>
            <div class="flex gap-3">
              <button
                @click="showSmsModal = false"
                class="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                @click="confirmSendSms"
                class="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-all hover:scale-[1.02]"
              >
                Send SMS →
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { useStudentStore } from '@/stores/students'
import { useFeeStore } from '@/stores/fees'
import { useToastStore } from '@/stores/toast'

const studentStore = useStudentStore()
const feeStore = useFeeStore()
const toast = useToastStore()

const search = ref('')
const classFilter = ref('')
const feeFilter = ref('')
const showEditModal = ref(false)
const showAddModal = ref(false)
const showSmsModal = ref(false)
const smsTarget = ref<{ name: string; phone: string } | null>(null)
const smsMessage = ref('')

// ── Phone lookup state ──
type MatchState = '' | 'found' | 'not-found'
const phoneMatchState = ref<MatchState>('')

const editForm = reactive({
  name: '',
  phone: '',
  email: '',
  address: '',
  occupation: '',
  linked_student_id: null as number | null,
  _originalPhone: '' as string,
})

// Students auto-matched by phone (Add mode)
const phoneMatchedStudents = computed(() => {
  if (!showAddModal.value || editForm.phone.length < 10) return []
  return studentStore.students.filter((s) => s.phone === editForm.phone)
})

// Students linked in Edit mode (by originalPhone)
const editLinkedStudents = computed(() => {
  if (!showEditModal.value || !editForm._originalPhone) return []
  return studentStore.students.filter((s) => s.phone === editForm._originalPhone)
})

// Watch phone input → update match state
function onPhoneLookup() {
  if (!showAddModal.value) return
  if (editForm.phone.length < 10) {
    phoneMatchState.value = ''
    return
  }
  const matched = studentStore.students.filter((s) => s.phone === editForm.phone)
  if (matched.length) {
    phoneMatchState.value = 'found'
    // Auto-fill name from student's parent_name
    if (!editForm.name) editForm.name = matched[0].parent_name
    if (!editForm.email) editForm.email = matched[0].email || ''
    if (!editForm.address) editForm.address = matched[0].address || ''
  } else {
    phoneMatchState.value = 'not-found'
  }
}

// Save button enabled?
const canSave = computed(() => {
  if (!editForm.name || editForm.phone.length < 10) return false
  if (showAddModal.value) {
    // Must have matched students OR a manually selected student
    return phoneMatchedStudents.value.length > 0 || editForm.linked_student_id !== null
  }
  return true // Edit mode always saveable if name + phone
})

// ──────────────────────────────────────────────────────────────────
// Derive parent list from student records (group by parent name + phone)
// ──────────────────────────────────────────────────────────────────
const allParents = computed(() => {
  const map = new Map<
    string,
    {
      name: string
      phone: string
      email: string
      address: string
      children: typeof studentStore.students
      totalDue: number
    }
  >()

  for (const student of studentStore.students) {
    const key = student.phone // Group by parent phone number
    if (!map.has(key)) {
      map.set(key, {
        name: student.parent_name,
        phone: student.phone,
        email: student.email || '',
        address: student.address || '',
        children: [],
        totalDue: 0,
      })
    }
    const parent = map.get(key)!
    parent.children.push(student)

    // Aggregate pending fees for this parent's wards
    const dues = feeStore.duePayments.filter((p) => p.student_id === student.id)
    parent.totalDue += dues.reduce((sum, d) => sum + d.due_amount, 0)
  }

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
})

const studentsWithMultipleChildren = computed(() => allParents.value.filter((p) => p.children.length > 1))

const classes = computed(() => studentStore.classes)

const filteredParents = computed(() => {
  let result = allParents.value
  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.children.some((c) => c.name.toLowerCase().includes(q)),
    )
  }
  if (classFilter.value) {
    result = result.filter((p) => p.children.some((c) => c.class_name === classFilter.value))
  }
  if (feeFilter.value === 'due') result = result.filter((p) => p.totalDue > 0)
  if (feeFilter.value === 'paid') result = result.filter((p) => p.totalDue === 0)
  return result
})

// ──────────────────────────────────────────────────────────────────
// Stats
// ──────────────────────────────────────────────────────────────────
const stats = computed(() => [
  {
    icon: '👨‍👩‍👧‍👦',
    label: 'Total Families',
    value: allParents.value.length,
    bg: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20',
  },
  {
    icon: '⚠️',
    label: 'Families with Dues',
    value: allParents.value.filter((p) => p.totalDue > 0).length,
    bg: 'bg-red-50 text-red-600 dark:bg-red-900/20',
  },
  {
    icon: '✅',
    label: 'All Paid',
    value: allParents.value.filter((p) => p.totalDue === 0).length,
    bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20',
  },
  {
    icon: '👨‍👩‍👧',
    label: 'Multiple Wards',
    value: studentsWithMultipleChildren.value.length,
    bg: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20',
  },
])

// ──────────────────────────────────────────────────────────────────
// Edit / Add Parent
// ──────────────────────────────────────────────────────────────────
function openEdit(parent: (typeof allParents.value)[0]) {
  Object.assign(editForm, {
    name: parent.name,
    phone: parent.phone,
    email: parent.email,
    address: parent.address || '',
    occupation: '',
    linked_student_id: null,
    _originalPhone: parent.phone,
  })
  phoneMatchState.value = ''
  showEditModal.value = true
}

function closeModals() {
  showEditModal.value = false
  showAddModal.value = false
  phoneMatchState.value = ''
  Object.assign(editForm, {
    name: '',
    phone: '',
    email: '',
    address: '',
    occupation: '',
    linked_student_id: null,
    _originalPhone: '',
  })
}

function saveParent() {
  if (!editForm.name.trim() || editForm.phone.length < 10) {
    toast.error('Name and a valid 10-digit phone are required')
    return
  }

  if (showAddModal.value) {
    const matched = studentStore.students.filter((s) => s.phone === editForm.phone)
    if (matched.length) {
      // Phone matched → update parent_name on all matched students
      for (const s of matched) {
        studentStore.updateStudent(s.id, {
          parent_name: editForm.name,
          phone: editForm.phone,
          email: editForm.email,
          address: editForm.address,
        })
      }
      toast.success(`Parent linked to ${matched.length} student record(s) via phone!`)
    } else if (editForm.linked_student_id) {
      // No phone match → use manually selected student
      studentStore.updateStudent(editForm.linked_student_id, {
        parent_name: editForm.name,
        phone: editForm.phone,
        email: editForm.email,
        address: editForm.address,
      })
      toast.success('Parent added and manually linked to student!')
    } else {
      toast.error('No student matched or selected — cannot save')
      return
    }
  } else {
    // Edit: update all students sharing original phone
    const targets = studentStore.students.filter((s) => s.phone === editForm._originalPhone)
    for (const s of targets) {
      studentStore.updateStudent(s.id, {
        parent_name: editForm.name,
        email: editForm.email,
        address: editForm.address,
      })
    }
    toast.success(`Updated guardian for ${targets.length} ward(s) successfully!`)
  }
  closeModals()
}

// ──────────────────────────────────────────────────────────────────
// SMS
// ──────────────────────────────────────────────────────────────────
const smsTemplates = [
  {
    label: '💳 Fee Due Reminder',
    message:
      'Dear Parent, your ward has outstanding fees. Please clear dues at the earliest. Contact: admin@school.com',
  },
  {
    label: '📢 Important Notice',
    message: 'Dear Parent, please check the school notice board for important updates regarding your ward.',
  },
  {
    label: '📊 Result Ready',
    message: "Dear Parent, your ward's examination results are now available in the parent portal.",
  },
  {
    label: '🎉 General Update',
    message: 'Dear Parent, thank you for your continued support. Please visit the school portal for updates.',
  },
]

function sendSms(parent: (typeof allParents.value)[0]) {
  smsTarget.value = { name: parent.name, phone: parent.phone }
  smsMessage.value =
    parent.totalDue > 0
      ? `Dear ${parent.name}, your ward has pending fees of ₹${parent.totalDue.toLocaleString('en-IN')}. Please clear dues at the earliest.`
      : 'Dear Parent, this is an important update from the school. Please check the parent portal for details.'
  showSmsModal.value = true
}

function confirmSendSms() {
  toast.success(`SMS sent to ${smsTarget.value?.name} (${smsTarget.value?.phone})`)
  showSmsModal.value = false
  smsMessage.value = ''
}

function sendBulkSms() {
  const dueParents = allParents.value.filter((p) => p.totalDue > 0)
  if (!dueParents.length) {
    toast.show('info', 'No parents with pending dues found')
    return
  }
  toast.success(`Bulk SMS sent to ${dueParents.length} families with outstanding fees!`)
}
</script>

<style scoped>
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-scale-in {
  animation: scaleIn 0.25s ease-out forwards;
}
</style>

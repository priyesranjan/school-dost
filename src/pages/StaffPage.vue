<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Action-Oriented Directorate Header -->
    <div
      class="relative overflow-hidden rounded-[2rem] bg-indigo-50 p-8 shadow-xl shadow-indigo-100/50 dark:border dark:border-indigo-900/30 dark:bg-gray-800/80 dark:shadow-none"
    >
      <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div
            class="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
          >
            👥 Human Resources
          </div>
          <h1 class="mt-3 text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            Staff &
            <span class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
              >Faculty Directorate</span
            >
          </h1>
          <p class="mt-1 text-sm font-medium text-indigo-600/70 dark:text-indigo-300/60">
            Administrative lifecycle control and departmental allocation.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <AppButton
            @click="openAddModal"
            class="h-[48px] px-8 shadow-2xl shadow-indigo-200 dark:shadow-none bg-indigo-600 hover:bg-indigo-700"
          >
            + Onboard Staff
          </AppButton>
        </div>
      </div>
      <!-- Background Decorative -->
      <div
        class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-100/40 blur-3xl dark:bg-indigo-900/20"
      ></div>
    </div>

    <!-- Live Census Matrix -->
    <div class="grid grid-cols-2 gap-6 lg:grid-cols-4">
      <div
        class="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-800/50"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Headcount</p>
            <p class="mt-1 text-3xl font-black tracking-tight text-gray-900 dark:text-white">
              {{ staffStore.staffMembers.length }}
            </p>
          </div>
          <div
            class="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-6 dark:bg-indigo-900/30"
          >
            👥
          </div>
        </div>
      </div>
      <div
        class="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-800/50"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Active Faculty</p>
            <p class="mt-1 text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
              {{ activeTeachersCount }}
            </p>
          </div>
          <div
            class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-xl shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-6 dark:bg-emerald-900/30"
          >
            👩‍🏫
          </div>
        </div>
      </div>
    </div>

    <!-- Integrated Search & Discovery Hub -->
    <AppCard :no-padding="true" class="overflow-hidden border-none shadow-2xl">
      <div class="flex flex-col gap-4 bg-gray-50/50 p-6 sm:flex-row sm:items-center dark:bg-gray-800/30">
        <div class="relative flex-1 group">
          <div class="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
            <svg
              class="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            v-model="staffStore.searchQuery"
            type="text"
            placeholder="Staff directory search: name, phone, department..."
            class="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-14 pr-4 text-sm font-black text-gray-900 outline-none transition-all focus:ring-4 focus:ring-indigo-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-200 dark:focus:border-indigo-500"
          />
        </div>
        <div class="flex items-center gap-3">
          <select
            v-model="staffStore.roleFilter"
            class="rounded-2xl border border-gray-200 bg-white px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-700 outline-none transition-all hover:border-indigo-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="">All Roles</option>
            <option value="teacher">Teachers</option>
            <option value="admin">Administrators</option>
            <option value="principal">Principals</option>
            <option value="staff">General Staff</option>
          </select>
        </div>
      </div>

      <!-- High-Fidelity Ledger -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr
              class="bg-gray-50/20 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:bg-gray-900/30"
            >
              <th class="px-8 py-4">Identity Matrix</th>
              <th class="px-6 py-4">Departmental Tier</th>
              <th class="px-6 py-4">Contact Relay</th>
              <th class="px-6 py-4">Lifecycle State</th>
              <th class="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
            <tr
              v-for="s in staffStore.filteredStaff"
              :key="s.id"
              @click="$router.push(`/staff/${s.id}`)"
              class="group cursor-pointer transition-all hover:bg-indigo-50/30 dark:hover:bg-indigo-900/5"
            >
              <td class="px-8 py-5">
                <div class="flex items-center gap-4">
                  <div class="relative h-12 w-12 flex-shrink-0">
                    <img
                      v-if="s.profile_photo_url"
                      :src="s.profile_photo_url"
                      class="h-full w-full rounded-2xl object-cover shadow-lg transition-transform group-hover:scale-110"
                    />
                    <div
                      v-else
                      class="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-black text-white shadow-lg transition-transform group-hover:scale-110"
                    >
                      {{ s.name.charAt(0) }}
                    </div>
                    <div
                      v-if="s.status === 'active'"
                      class="absolute -right-1.5 -top-1.5 h-4 w-4 rounded-full border-4 border-white bg-emerald-500 dark:border-gray-800"
                    ></div>
                    <div
                      v-else-if="s.status === 'on_leave'"
                      class="absolute -right-1.5 -top-1.5 h-4 w-4 rounded-full border-4 border-white bg-amber-500 dark:border-gray-800"
                    ></div>
                  </div>
                  <div>
                    <p class="font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                      {{ s.name }}
                    </p>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                      Emp-ID: EMP{{ 1000 + s.id }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-5">
                <p class="font-black text-gray-900 dark:text-white">{{ s.department }}</p>
                <p class="text-[10px] font-black uppercase text-indigo-500 tracking-widest">{{ s.role }}</p>
              </td>
              <td class="px-6 py-5">
                <p class="text-xs font-black text-gray-900 dark:text-gray-200">{{ s.phone }}</p>
                <p class="text-[10px] font-bold text-gray-400">{{ s.email || 'N/A' }}</p>
              </td>
              <td class="px-6 py-5">
                <div
                  :class="[
                    'inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm',
                    s.status === 'active'
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                      : s.status === 'on_leave'
                        ? 'bg-amber-50 border-amber-100 text-amber-600'
                        : 'bg-rose-50 border-rose-100 text-rose-600',
                  ]"
                >
                  {{ s.status }}
                </div>
              </td>
              <td class="px-8 py-5 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click.stop="openQuickView(s.id)"
                    class="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 transition-all hover:scale-110 hover:border-primary-100 hover:text-primary-600 shadow-sm dark:bg-gray-800 dark:border-gray-700"
                    title="Quick View"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2.5"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2.5"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                  <button
                    @click.stop="openEditModal(s)"
                    class="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 transition-all hover:scale-110 hover:border-indigo-100 hover:text-indigo-600 shadow-sm dark:bg-gray-800 dark:border-gray-700"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2.5"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    @click.stop="confirmDelete(s)"
                    class="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-400 transition-all hover:scale-110 hover:bg-rose-600 hover:text-white dark:bg-rose-900/20"
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
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between border-t border-gray-50 p-6 dark:border-gray-700/50 bg-gray-50/20">
        <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest">
          Showing {{ staffStore.filteredStaff.length }} Personnel
        </p>
      </div>
      <EmptyState
        v-if="!staffStore.filteredStaff.length"
        title="No Faculty Found"
        message="Could not find any personnel matching that filter."
      />
    </AppCard>

    <!-- Modal Form -->
    <AppModal v-model="showModal" :title="editingId ? 'Update Official Registry' : 'Onboard Employee'" size="md">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <AppInput v-model="form.name" label="Legal Full Name" required class="font-bold" />

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="block text-xs font-bold text-gray-500">Authorization Role *</label>
            <SmartDropdown
              v-model="form.role"
              :options="
                [
                  { value: 'teacher', label: 'Teacher / Faculty', icon: '👩‍🏫', description: 'Classroom educator' },
                  { value: 'admin', label: 'Administrator', icon: '🛡️', description: 'Institution management' },
                  { value: 'principal', label: 'Head / Principal', icon: '🎓', description: 'Head of institution' },
                  { value: 'staff', label: 'Support Staff', icon: '🛠️', description: 'General operations' },
                ] as DropdownOption[]
              "
              :searchable="false"
            />
          </div>
          <AppInput
            v-model="form.department"
            label="Assigned Department"
            required
            placeholder="e.g. Science"
            class="font-bold"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="form.phone" type="tel" label="Communication Network" required class="font-bold" />
          <AppInput v-model="form.email" type="email" label="Digital Relay (Optional)" class="font-bold" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="form.join_date" type="date" label="Date of Induction" required class="font-bold" />
          <AppInput v-model="form.status" type="select" label="Lifecycle State" required class="font-bold">
            <option value="active">Active Duty</option>
            <option value="on_leave">Leave of Absence</option>
            <option value="inactive">Terminated / Inactive</option>
          </AppInput>
        </div>
        <AppInput
          v-model="form.address"
          label="Residential Coordinates"
          type="text"
          class="font-bold"
          placeholder="Optional Address Block"
        />
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showModal = false">Abort</AppButton>
          <AppButton @click="handleSubmit">{{ editingId ? 'Update Records' : 'Execute Hire' }}</AppButton>
        </div>
      </template>
    </AppModal>

    <!-- Quick View Drawer -->
    <QuickViewDrawer :is-open="quickViewOpen" :item-id="quickViewStaffId" type="staff" @close="quickViewOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useStaffStore, type StaffMember } from '@/stores/staff'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import QuickViewDrawer from '@/components/ui/QuickViewDrawer.vue'
import SmartDropdown from '@/components/ui/SmartDropdown.vue'
import type { DropdownOption } from '@/components/ui/SmartDropdown.vue'

const staffStore = useStaffStore()

onMounted(() => {
  staffStore.fetchStaff()
})

const quickViewOpen = ref(false)
const quickViewStaffId = ref(0)

function openQuickView(id: number) {
  quickViewStaffId.value = id
  quickViewOpen.value = true
}

const activeTeachersCount = computed(
  () => staffStore.staffMembers.filter((s) => s.role === 'teacher' && s.status === 'active').length,
)

const showModal = ref(false)
const editingId = ref<number | null>(null)

const form = reactive({
  name: '',
  role: 'teacher' as any,
  department: '',
  phone: '',
  email: '',
  join_date: new Date().toISOString().split('T')[0],
  status: 'active' as any,
  address: '',
})

function openAddModal() {
  editingId.value = null
  Object.assign(form, {
    name: '',
    role: 'teacher',
    department: '',
    phone: '',
    email: '',
    join_date: new Date().toISOString().split('T')[0],
    status: 'active',
    address: '',
  })
  showModal.value = true
}

function openEditModal(staff: StaffMember) {
  editingId.value = staff.id
  Object.assign(form, { ...staff })
  form.address = form.address || ''
  form.email = form.email || ''
  showModal.value = true
}

function handleSubmit() {
  if (!form.name || !form.role || !form.department || !form.phone || !form.join_date) return

  if (editingId.value) {
    staffStore.updateStaff(editingId.value, { ...form })
  } else {
    staffStore.addStaff({ ...form })
  }
  showModal.value = false
}

function confirmDelete(staff: StaffMember) {
  if (confirm(`Are you absolutely positive you want to revoke ${staff.name}'s registry access?`)) {
    staffStore.deleteStaff(staff.id)
  }
}
</script>

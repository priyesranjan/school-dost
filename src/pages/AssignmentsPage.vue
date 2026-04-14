<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Academic Header -->
    <div
      class="relative overflow-hidden rounded-[2rem] bg-indigo-50 p-8 shadow-xl shadow-indigo-100/50 dark:border dark:border-indigo-900/30 dark:bg-gray-800/80 dark:shadow-none"
    >
      <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div
            class="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
          >
            📚 Academic Workflow
          </div>
          <h1 class="mt-3 text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            Daily
            <span class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
              >Assignments</span
            >
          </h1>
          <p class="mt-1 text-sm font-medium text-indigo-600/70 dark:text-indigo-300/60">
            Distribute classwork, track deadlines, and monitor student academic progression.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <AppButton
            v-if="canBroadcast"
            @click="openModal"
            class="h-[48px] px-8 shadow-2xl shadow-indigo-200 dark:shadow-none bg-indigo-600 hover:bg-indigo-700"
          >
            + Broadcast Assignment
          </AppButton>
        </div>
      </div>
      <div
        class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-100/40 blur-3xl dark:bg-indigo-900/20"
      ></div>
    </div>

    <!-- Active Tasks Matrix -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-3">
      <div
        class="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-800/50"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Assignments</p>
            <p class="mt-1 text-3xl font-black tracking-tight text-gray-900 dark:text-white">
              {{ assignStore.assignments.length }}
            </p>
          </div>
          <div
            class="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl shadow-inner dark:bg-indigo-900/30"
          >
            📓
          </div>
        </div>
      </div>
      <div
        class="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-emerald-50/30 p-6 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-emerald-900/30 dark:bg-emerald-900/10"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-emerald-600/70 dark:text-emerald-400">
              Active & Pending
            </p>
            <p class="mt-1 text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
              {{ activeCount }}
            </p>
          </div>
          <div
            class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-xl shadow-inner dark:bg-emerald-800/50"
          >
            ⏳
          </div>
        </div>
      </div>
      <div
        class="group relative overflow-hidden rounded-3xl border border-rose-100 bg-rose-50/30 p-6 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-rose-900/30 dark:bg-rose-900/10"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-rose-600/70 dark:text-rose-400">
              Overdue Tasks
            </p>
            <p class="mt-1 text-3xl font-black tracking-tight text-rose-600 dark:text-rose-400">{{ overdueCount }}</p>
          </div>
          <div
            class="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-xl shadow-inner dark:bg-rose-800/50"
          >
            ⚠️
          </div>
        </div>
      </div>
    </div>

    <!-- Active Feed -->
    <AppCard title="Homework Ledger" :no-padding="true" class="shadow-sm border-none shadow-2xl">
      <div class="divide-y divide-gray-50 dark:divide-gray-700/50">
        <div
          v-for="a in assignStore.assignments"
          :key="a.id"
          class="p-6 transition-all hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
        >
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div class="flex items-center gap-3 mb-1">
                <span
                  :class="[
                    'px-2 py-0.5 rounded-[0.5rem] uppercase tracking-widest font-black text-[9px] border',
                    a.status === 'active'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : a.status === 'completed'
                        ? 'bg-gray-100 text-gray-500 border-gray-200'
                        : 'bg-rose-50 text-rose-600 border-rose-100',
                  ]"
                >
                  {{ a.status }}
                </span>
                <span class="text-[10px] font-bold text-gray-400 tracking-widest uppercase"
                  >Target: {{ a.class_name }}</span
                >
              </div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">{{ a.title }}</h3>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300 mt-1">{{ a.description }}</p>

              <div class="flex items-center gap-4 mt-3">
                <div
                  class="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg"
                >
                  <span>🏷️</span> {{ a.subject }}
                </div>
                <div
                  class="flex items-center gap-1.5 text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-900/30 px-2 py-1 rounded-lg"
                >
                  <span>🕒</span> Due: {{ formatRelativeDate(a.due_date) }}
                </div>
                <div
                  class="text-[10px] font-bold text-gray-400 tracking-tighter uppercase pl-2 border-l border-gray-200 dark:border-gray-700"
                >
                  BY: {{ a.teacher_name || 'Admin' }}
                </div>
              </div>
            </div>

            <!-- Resolution Actions -->
            <div class="flex items-center gap-2">
              <AppButton
                v-if="a.status !== 'completed'"
                size="sm"
                variant="secondary"
                @click="assignStore.updateStatus(a.id, 'completed')"
                class="bg-gray-50 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 border-gray-200"
              >
                Mark Complete
              </AppButton>
              <button
                v-if="canBroadcast"
                @click="confirmDelete(a.id)"
                class="h-9 w-9 flex items-center justify-center rounded-xl bg-rose-50 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors"
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
          </div>
        </div>
      </div>
      <EmptyState
        v-if="!assignStore.assignments.length"
        title="No Active Assignments"
        message="The academic ledger is currently clean."
      />
    </AppCard>

    <!-- Broadcaster Modal -->
    <AppModal v-model="showModal" title="Broadcast Assignment Workflow" size="md">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <AppInput
          v-model="form.title"
          label="Assignment Blueprint Title"
          placeholder="e.g. Chapter 4 Equations"
          required
          class="font-bold"
        />
        <AppInput
          v-model="form.description"
          type="textarea"
          label="Detailed Instructions"
          placeholder="Read pages X to Y..."
          class="font-bold"
          :rows="3"
        />

        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="form.class_name" type="select" label="Target Cohort / Class" required class="font-bold">
            <option value="">Select Target...</option>
            <option v-for="c in timetableStore.classes" :key="c" :value="c">{{ c }}</option>
          </AppInput>
          <AppInput v-model="form.subject" label="Academic Subject" required placeholder="Physics" class="font-bold" />
        </div>

        <div class="grid grid-cols-1 gap-4">
          <AppInput
            v-model="form.due_date"
            type="date"
            label="Deadline / Due Date"
            required
            class="font-bold border-rose-200 focus:border-rose-500 focus:ring-rose-500"
          />
        </div>
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showModal = false">Cancel</AppButton>
          <AppButton @click="handleSubmit" class="bg-indigo-600 hover:bg-indigo-700">Broadcast Now</AppButton>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useAssignmentsStore } from '@/stores/assignments'
import { useTimetableStore } from '@/stores/timetable'
import { useAuthStore } from '@/stores/auth'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const assignStore = useAssignmentsStore()
const timetableStore = useTimetableStore()
const authStore = useAuthStore()

const canBroadcast = computed(() => ['admin', 'teacher', 'principal'].includes(authStore.user?.role || ''))
const activeCount = computed(() => assignStore.assignments.filter((a) => a.status === 'active').length)
const overdueCount = computed(() => assignStore.assignments.filter((a) => a.status === 'overdue').length)

const showModal = ref(false)
const form = reactive({
  title: '',
  description: '',
  class_name: '',
  subject: '',
  due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
})

function formatRelativeDate(dateStr: string) {
  const date = new Date(dateStr)
  const today = new Date()
  const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 3600 * 24))
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff === -1) return 'Yesterday'
  if (diff < 0) return `${Math.abs(diff)} days ago`
  return `In ${diff} days`
}

function openModal() {
  Object.assign(form, {
    title: '',
    description: '',
    class_name: '',
    subject: '',
    due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  })
  showModal.value = true
}

function handleSubmit() {
  if (!form.title || !form.class_name || !form.subject || !form.due_date) return

  assignStore.addAssignment({
    title: form.title,
    description: form.description,
    class_name: form.class_name,
    subject: form.subject,
    due_date: form.due_date,
    teacher_name: authStore.user?.name,
  })
  showModal.value = false
}

function confirmDelete(id: number) {
  if (confirm('Delete this homework broadcast?')) {
    assignStore.deleteAssignment(id)
  }
}
</script>

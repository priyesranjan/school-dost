<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Premium Header -->
    <div
      class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-700 via-slate-800 to-gray-900 p-8 shadow-2xl shadow-slate-400/30 dark:shadow-none"
    >
      <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div
            class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm"
          >
            🏫 Academic Structure
          </div>
          <h1 class="mt-3 text-4xl font-black tracking-tight text-white drop-shadow">
            Class <span class="text-slate-300">Management</span>
          </h1>
          <p class="mt-1 text-sm font-medium text-white/60">
            Add classes, manage sections, assign class teachers, and set room allocations.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <!-- Summary Chips -->
          <div class="flex gap-3">
            <div class="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm border border-white/10 text-center">
              <p class="text-2xl font-black text-white">{{ classStore.classes.length }}</p>
              <p class="text-[9px] font-black uppercase tracking-widest text-white/50">Classes</p>
            </div>
            <div class="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm border border-white/10 text-center">
              <p class="text-2xl font-black text-white">{{ totalSections }}</p>
              <p class="text-[9px] font-black uppercase tracking-widest text-white/50">Sections</p>
            </div>
            <div class="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm border border-white/10 text-center">
              <p class="text-2xl font-black text-white">{{ classStore.totalCapacity }}</p>
              <p class="text-[9px] font-black uppercase tracking-widest text-white/50">Capacity</p>
            </div>
          </div>
          <AppButton
            @click="openAddModal"
            class="h-[48px] rounded-2xl bg-white px-8 text-sm font-black text-slate-800 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            + New Class
          </AppButton>
        </div>
      </div>
      <div class="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl"></div>
      <div class="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/5 blur-2xl"></div>
    </div>

    <!-- Search + Filter Bar -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative max-w-xs">
        <svg
          class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search classes or teachers..."
          class="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm font-medium text-gray-700 outline-none transition-all focus:border-slate-400 focus:ring-4 focus:ring-slate-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div class="flex items-center gap-2">
        <button
          v-for="v in ['grid', 'table']"
          :key="v"
          @click="viewMode = v as any"
          :class="[
            'rounded-xl p-2.5 transition-all',
            viewMode === v
              ? 'bg-slate-700 text-white shadow-md'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400',
          ]"
        >
          <svg v-if="v === 'grid'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
          <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Grid View -->
    <div v-if="viewMode === 'grid'" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="cls in filteredClasses"
        :key="cls.id"
        :class="[
          'group relative overflow-hidden rounded-3xl border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800/50',
          colorBorder(cls.color),
        ]"
      >
        <!-- Color Bar -->
        <div :class="['h-2 w-full', colorBar(cls.color)]"></div>

        <div class="p-6">
          <!-- Header Row -->
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div
                :class="[
                  'flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-black text-white shadow-xl',
                  colorBg(cls.color),
                ]"
              >
                {{ cls.grade }}
              </div>
              <div>
                <h3 class="text-lg font-black text-gray-900 dark:text-white">{{ cls.name }}</h3>
                <p class="text-xs font-bold text-gray-400">{{ cls.academic_year }}</p>
              </div>
            </div>
            <!-- Actions -->
            <div class="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                @click="openEditModal(cls)"
                class="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 transition-colors"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                @click="confirmDelete(cls)"
                class="rounded-xl p-2 text-gray-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 transition-colors"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Stats Row -->
          <div class="mt-4 grid grid-cols-3 gap-2">
            <div :class="['rounded-2xl p-3 text-center', colorLight(cls.color)]">
              <p class="text-lg font-black" :class="colorText(cls.color)">{{ studentCount(cls.name) }}</p>
              <p class="text-[10px] font-black uppercase text-gray-400">Students</p>
            </div>
            <div class="rounded-2xl bg-gray-50 dark:bg-gray-700/50 p-3 text-center">
              <p class="text-lg font-black text-gray-900 dark:text-white">{{ cls.sections.length }}</p>
              <p class="text-[10px] font-black uppercase text-gray-400">Sections</p>
            </div>
            <div class="rounded-2xl bg-gray-50 dark:bg-gray-700/50 p-3 text-center">
              <p class="text-lg font-black text-gray-900 dark:text-white">{{ totalClassCapacity(cls) }}</p>
              <p class="text-[10px] font-black uppercase text-gray-400">Capacity</p>
            </div>
          </div>

          <!-- Sections Pills -->
          <div class="mt-4 flex flex-wrap gap-1.5">
            <span
              v-for="sec in cls.sections"
              :key="sec.id"
              :class="[
                'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black ',
                colorLight(cls.color),
                colorText(cls.color),
              ]"
            >
              Sec {{ sec.name }}
              <span class="opacity-60">· {{ sec.capacity }}</span>
              <button
                @click="openRemoveSection(cls, sec)"
                class="ml-0.5 rounded-full hover:bg-black/10 p-0.5 transition-colors"
                title="Remove section"
              >
                <svg class="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
            <button
              @click="openAddSection(cls)"
              :class="[
                'rounded-full border-2 border-dashed px-2.5 py-0.5 text-[10px] font-black transition-all hover:border-solid',
                colorBorderDashed(cls.color),
                colorText(cls.color),
              ]"
            >
              + Section
            </button>
          </div>

          <!-- Footer -->
          <div class="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4 dark:border-gray-700">
            <div
              class="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-xs font-black text-gray-600 dark:bg-gray-700 dark:text-gray-300"
            >
              {{ cls.class_teacher.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="truncate text-xs font-black text-gray-700 dark:text-gray-300">{{ cls.class_teacher }}</p>
              <p class="text-[10px] text-gray-400">{{ cls.room || 'Room TBA' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Class Card -->
      <button
        @click="openAddModal"
        class="group flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-gray-200 bg-transparent p-10 transition-all hover:border-slate-400 hover:bg-slate-50/50 dark:border-gray-700 dark:hover:border-slate-500 dark:hover:bg-slate-900/20"
      >
        <div
          class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-2xl transition-transform group-hover:scale-110 dark:bg-gray-800"
        >
          ＋
        </div>
        <p class="text-sm font-black text-gray-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
          New Class
        </p>
      </button>
    </div>

    <!-- Table View -->
    <AppCard v-else :no-padding="true" class="shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr
              class="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50/50 dark:bg-gray-800/50"
            >
              <th class="px-6 py-4">Class</th>
              <th class="px-6 py-4">Sections</th>
              <th class="px-6 py-4">Class Teacher</th>
              <th class="px-6 py-4">Room</th>
              <th class="px-6 py-4 text-center">Students</th>
              <th class="px-6 py-4 text-center">Capacity</th>
              <th class="px-6 py-4 text-center">Fill %</th>
              <th class="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
            <tr
              v-for="cls in filteredClasses"
              :key="cls.id"
              class="group hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    :class="[
                      'flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black text-white shadow-md',
                      colorBg(cls.color),
                    ]"
                  >
                    {{ cls.grade }}
                  </div>
                  <div>
                    <p class="font-black text-gray-900 dark:text-white">{{ cls.name }}</p>
                    <p class="text-[10px] text-gray-400">{{ cls.academic_year }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="sec in cls.sections"
                    :key="sec.id"
                    :class="[
                      'rounded-full px-2 py-0.5 text-[10px] font-black',
                      colorLight(cls.color),
                      colorText(cls.color),
                    ]"
                  >
                    {{ sec.name }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">{{ cls.class_teacher }}</td>
              <td class="px-6 py-4 text-gray-500 dark:text-gray-400">{{ cls.room || '—' }}</td>
              <td class="px-6 py-4 text-center font-black text-gray-900 dark:text-white">
                {{ studentCount(cls.name) }}
              </td>
              <td class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">{{ totalClassCapacity(cls) }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-center gap-2">
                  <div class="h-2 w-16 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                    <div
                      :class="['h-full rounded-full', fillColor(cls)]"
                      :style="{ width: fillPercent(cls) + '%' }"
                    ></div>
                  </div>
                  <span class="text-xs font-bold text-gray-500">{{ fillPercent(cls) }}%</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    @click="openAddSection(cls)"
                    :class="[
                      'rounded-xl border px-3 py-1.5 text-[10px] font-black transition-all active:scale-95',
                      colorBorder(cls.color),
                      colorText(cls.color),
                    ]"
                  >
                    + Sec
                  </button>
                  <button
                    @click="openEditModal(cls)"
                    class="rounded-xl bg-gray-100 px-3 py-1.5 text-[10px] font-black text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 transition-all active:scale-95"
                  >
                    Edit
                  </button>
                  <button
                    @click="confirmDelete(cls)"
                    class="rounded-xl bg-rose-50 px-3 py-1.5 text-[10px] font-black text-rose-600 hover:bg-rose-100 dark:bg-rose-900/20 transition-all active:scale-95"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <EmptyState
        v-if="!filteredClasses.length"
        title="No classes found"
        message="Add a new class or adjust your search"
      />
    </AppCard>

    <!-- ─── Add / Edit Class Modal ─── -->
    <AppModal v-model="showModal" :title="isEditing ? `Edit ${editTarget?.name}` : 'Add New Class'" size="md">
      <form @submit.prevent="handleSave" class="space-y-5 p-1">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Class Name *</label>
            <AppInput v-model="form.name" placeholder="Class 11" required />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Grade Number *</label>
            <AppInput v-model.number="form.grade" type="number" placeholder="11" :min="1" :max="12" required />
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Class Teacher</label>
          <AppInput v-model="form.class_teacher" placeholder="Mr. / Ms. Full Name" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Room / Block</label>
            <AppInput v-model="form.room" placeholder="Block A - 101" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Academic Year</label>
            <AppInput v-model="form.academic_year" placeholder="2025-26" />
          </div>
        </div>
        <!-- Color Picker -->
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Class Color Theme</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="c in colorOptions"
              :key="c.key"
              type="button"
              @click="form.color = c.key"
              :class="[
                'h-8 w-8 rounded-xl transition-all',
                c.bg,
                form.color === c.key ? 'ring-2 ring-offset-2 ring-gray-500 scale-110' : 'hover:scale-105',
              ]"
              :title="c.label"
            ></button>
          </div>
        </div>
        <!-- Sections (add mode only shows initial sections) -->
        <div v-if="!isEditing" class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Initial Sections</label>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="s in ['A', 'B', 'C', 'D']"
              :key="s"
              class="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 transition-all hover:border-slate-400 has-[:checked]:border-slate-600 has-[:checked]:bg-slate-50 dark:border-gray-700 dark:has-[:checked]:bg-slate-800"
            >
              <input type="checkbox" :value="s" v-model="form.initialSections" class="accent-slate-600" />
              <span class="text-sm font-bold text-gray-700 dark:text-gray-300">Section {{ s }}</span>
            </label>
          </div>
        </div>
        <div v-if="!isEditing" class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Capacity Per Section</label>
          <AppInput v-model.number="form.capacityPerSection" type="number" placeholder="40" :min="1" />
        </div>
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3 p-1">
          <AppButton variant="secondary" @click="showModal = false">Cancel</AppButton>
          <AppButton @click="handleSave" class="bg-slate-700 hover:bg-slate-800 shadow-lg">
            {{ isEditing ? 'Save Changes' : 'Create Class' }}
          </AppButton>
        </div>
      </template>
    </AppModal>

    <!-- ─── Add Section Modal ─── -->
    <AppModal v-model="showSectionModal" :title="`Add Section — ${sectionTarget?.name}`" size="sm">
      <form @submit.prevent="handleAddSection" class="space-y-4 p-1">
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Section Name *</label>
          <AppInput v-model="sectionForm.name" placeholder="D, E, Science..." required />
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Seating Capacity</label>
          <AppInput v-model.number="sectionForm.capacity" type="number" placeholder="40" :min="1" />
        </div>
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3 p-1">
          <AppButton variant="secondary" @click="showSectionModal = false">Cancel</AppButton>
          <AppButton @click="handleAddSection" :class="`${colorBgBtn(sectionTarget?.color || 'slate')}`"
            >Add Section</AppButton
          >
        </div>
      </template>
    </AppModal>

    <!-- ─── Delete Confirm Modal ─── -->
    <AppModal v-model="showDeleteModal" title="Delete Class" size="sm">
      <div class="space-y-4 p-1">
        <div class="rounded-2xl bg-rose-50 p-4 dark:bg-rose-900/20">
          <p class="text-sm font-bold text-rose-800 dark:text-rose-200">
            You are about to delete <strong>{{ deleteTarget?.name }}</strong
            >.
          </p>
        </div>
        <div
          v-if="deleteTarget && studentCount(deleteTarget.name) > 0"
          class="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/30 dark:bg-amber-900/20"
        >
          <span class="text-xl">⚠️</span>
          <p class="text-sm text-amber-800 dark:text-amber-200">
            <strong
              >{{ studentCount(deleteTarget.name) }} student{{
                studentCount(deleteTarget.name) !== 1 ? 's' : ''
              }}</strong
            >
            are currently assigned to this class. Their class will be cleared. Reassign them after deletion.
          </p>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone.</p>
      </div>
      <template #footer>
        <div class="flex items-center justify-end gap-3 p-1">
          <AppButton variant="secondary" @click="showDeleteModal = false">Cancel</AppButton>
          <AppButton @click="handleDelete" class="bg-rose-600 hover:bg-rose-700">Delete Class</AppButton>
        </div>
      </template>
    </AppModal>

    <!-- ─── Remove Section Confirm ─── -->
    <AppModal v-model="showRemoveSectionModal" title="Remove Section" size="sm">
      <div class="space-y-3 p-1">
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Remove <strong>Section {{ removeSectionTarget?.section.name }}</strong> from
          <strong>{{ removeSectionTarget?.cls.name }}</strong
          >?
        </p>
        <p class="text-xs text-gray-400">
          Students in this section will still belong to the class, but the section label will be removed.
        </p>
      </div>
      <template #footer>
        <div class="flex items-center justify-end gap-3 p-1">
          <AppButton variant="secondary" @click="showRemoveSectionModal = false">Cancel</AppButton>
          <AppButton @click="handleRemoveSection" class="bg-rose-600 hover:bg-rose-700">Remove Section</AppButton>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useClassStore, type ClassRecord, type ClassSection } from '@/stores/classes'
import { useStudentStore } from '@/stores/students'
import { useToastStore } from '@/stores/toast'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const classStore = useClassStore()
const studentStore = useStudentStore()
const toast = useToastStore()

const searchQuery = ref('')
const viewMode = ref<'grid' | 'table'>('grid')

onMounted(() => {
  void classStore.fetchClasses()
})

const totalSections = computed(() => classStore.classes.reduce((s, c) => s + c.sections.length, 0))

const filteredClasses = computed(() => {
  const q = searchQuery.value.toLowerCase()
  if (!q) return classStore.sortedClasses
  return classStore.sortedClasses.filter(
    (c) =>
      c.name.toLowerCase().includes(q) || c.class_teacher.toLowerCase().includes(q) || c.room.toLowerCase().includes(q),
  )
})

function studentCount(className: string): number {
  return studentStore.students.filter((s) => s.class_name === className).length
}

function totalClassCapacity(cls: ClassRecord): number {
  return cls.sections.reduce((s, sec) => s + sec.capacity, 0)
}

function fillPercent(cls: ClassRecord): number {
  const cap = totalClassCapacity(cls)
  if (!cap) return 0
  return Math.min(100, Math.round((studentCount(cls.name) / cap) * 100))
}

function fillColor(cls: ClassRecord): string {
  const p = fillPercent(cls)
  if (p >= 90) return 'bg-rose-500'
  if (p >= 70) return 'bg-amber-500'
  return 'bg-emerald-500'
}

// ── Color helpers ──
const colorMap: Record<
  string,
  { bg: string; light: string; text: string; border: string; borderDash: string; bgBtn: string; bar: string }
> = {
  sky: {
    bg: 'bg-sky-500',
    light: 'bg-sky-50 dark:bg-sky-900/20',
    text: 'text-sky-700 dark:text-sky-400',
    border: 'border-sky-200 dark:border-sky-800/30',
    borderDash: 'border-sky-300 dark:border-sky-700',
    bgBtn: 'bg-sky-500 hover:bg-sky-600',
    bar: 'bg-sky-500',
  },
  teal: {
    bg: 'bg-teal-500',
    light: 'bg-teal-50 dark:bg-teal-900/20',
    text: 'text-teal-700 dark:text-teal-400',
    border: 'border-teal-200 dark:border-teal-800/30',
    borderDash: 'border-teal-300 dark:border-teal-700',
    bgBtn: 'bg-teal-500 hover:bg-teal-600',
    bar: 'bg-teal-500',
  },
  indigo: {
    bg: 'bg-indigo-500',
    light: 'bg-indigo-50 dark:bg-indigo-900/20',
    text: 'text-indigo-700 dark:text-indigo-400',
    border: 'border-indigo-200 dark:border-indigo-800/30',
    borderDash: 'border-indigo-300 dark:border-indigo-700',
    bgBtn: 'bg-indigo-500 hover:bg-indigo-600',
    bar: 'bg-indigo-500',
  },
  violet: {
    bg: 'bg-violet-600',
    light: 'bg-violet-50 dark:bg-violet-900/20',
    text: 'text-violet-700 dark:text-violet-400',
    border: 'border-violet-200 dark:border-violet-800/30',
    borderDash: 'border-violet-300 dark:border-violet-700',
    bgBtn: 'bg-violet-600 hover:bg-violet-700',
    bar: 'bg-violet-500',
  },
  rose: {
    bg: 'bg-rose-500',
    light: 'bg-rose-50 dark:bg-rose-900/20',
    text: 'text-rose-700 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-800/30',
    borderDash: 'border-rose-300 dark:border-rose-700',
    bgBtn: 'bg-rose-500 hover:bg-rose-600',
    bar: 'bg-rose-500',
  },
  amber: {
    bg: 'bg-amber-500',
    light: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800/30',
    borderDash: 'border-amber-300 dark:border-amber-700',
    bgBtn: 'bg-amber-500 hover:bg-amber-600',
    bar: 'bg-amber-500',
  },
  emerald: {
    bg: 'bg-emerald-500',
    light: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800/30',
    borderDash: 'border-emerald-300 dark:border-emerald-700',
    bgBtn: 'bg-emerald-500 hover:bg-emerald-600',
    bar: 'bg-emerald-500',
  },
  slate: {
    bg: 'bg-slate-600',
    light: 'bg-slate-50 dark:bg-slate-800/40',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700',
    borderDash: 'border-slate-400 dark:border-slate-500',
    bgBtn: 'bg-slate-600 hover:bg-slate-700',
    bar: 'bg-slate-500',
  },
}
const fallback = colorMap['slate']
const colorBg = (c?: string) => (colorMap[c!] || fallback).bg
const colorLight = (c?: string) => (colorMap[c!] || fallback).light
const colorText = (c?: string) => (colorMap[c!] || fallback).text
const colorBorder = (c?: string) => (colorMap[c!] || fallback).border
const colorBorderDashed = (c?: string) => (colorMap[c!] || fallback).borderDash
const colorBgBtn = (c?: string) => (colorMap[c!] || fallback).bgBtn
const colorBar = (c?: string) => (colorMap[c!] || fallback).bar

const colorOptions = Object.entries(colorMap).map(([key, v]) => ({ key, label: key, bg: v.bg }))

// ── Add / Edit Modal ──
const showModal = ref(false)
const isEditing = ref(false)
const editTarget = ref<ClassRecord | null>(null)

const form = reactive({
  name: '',
  grade: 0,
  class_teacher: '',
  room: '',
  academic_year: '2025-26',
  color: 'sky',
  initialSections: ['A'] as string[],
  capacityPerSection: 40,
})

function openAddModal() {
  isEditing.value = false
  editTarget.value = null
  Object.assign(form, {
    name: '',
    grade: 0,
    class_teacher: '',
    room: '',
    academic_year: '2025-26',
    color: 'sky',
    initialSections: ['A'],
    capacityPerSection: 40,
  })
  showModal.value = true
}

function openEditModal(cls: ClassRecord) {
  isEditing.value = true
  editTarget.value = cls
  Object.assign(form, {
    name: cls.name,
    grade: cls.grade,
    class_teacher: cls.class_teacher,
    room: cls.room,
    academic_year: cls.academic_year,
    color: cls.color,
    initialSections: [],
    capacityPerSection: 40,
  })
  showModal.value = true
}

async function handleSave() {
  if (!form.name.trim() || !form.grade) {
    toast.warning('Class name and grade are required')
    return
  }
  if (isEditing.value && editTarget.value) {
    await classStore.updateClass(editTarget.value.id, {
      name: form.name.trim(),
      grade: form.grade,
      class_teacher: form.class_teacher,
      room: form.room,
      academic_year: form.academic_year,
      color: form.color,
    })
  } else {
    try {
      await classStore.addClass({
        name: form.name.trim(),
        grade: form.grade,
        class_teacher: form.class_teacher,
        room: form.room,
        academic_year: form.academic_year,
        color: form.color,
        sections:
          form.initialSections.length > 0
            ? form.initialSections.map((s, i) => ({
                id: Date.now() + i,
                name: s,
                capacity: form.capacityPerSection || 40,
              }))
            : [{ id: Date.now(), name: 'A', capacity: form.capacityPerSection || 40 }],
      })
    } catch {
      return
    }
  }
  showModal.value = false
}

// ── Add Section Modal ──
const showSectionModal = ref(false)
const sectionTarget = ref<ClassRecord | null>(null)
const sectionForm = reactive({ name: '', capacity: 40 })

function openAddSection(cls: ClassRecord) {
  sectionTarget.value = cls
  sectionForm.name = ''
  sectionForm.capacity = 40
  showSectionModal.value = true
}

async function handleAddSection() {
  if (!sectionTarget.value || !sectionForm.name.trim()) {
    toast.warning('Enter a section name')
    return
  }
  await classStore.addSection(sectionTarget.value.id, sectionForm.name.trim(), sectionForm.capacity || 40)
  showSectionModal.value = false
}

// ── Remove Section ──
const showRemoveSectionModal = ref(false)
const removeSectionTarget = ref<{ cls: ClassRecord; section: ClassSection } | null>(null)

function openRemoveSection(cls: ClassRecord, sec: ClassSection) {
  removeSectionTarget.value = { cls, section: sec }
  showRemoveSectionModal.value = true
}

async function handleRemoveSection() {
  if (!removeSectionTarget.value) return
  await classStore.removeSection(removeSectionTarget.value.cls.id, removeSectionTarget.value.section.id)
  showRemoveSectionModal.value = false
}

// ── Delete Modal ──
const showDeleteModal = ref(false)
const deleteTarget = ref<ClassRecord | null>(null)

function confirmDelete(cls: ClassRecord) {
  deleteTarget.value = cls
  showDeleteModal.value = true
}

async function handleDelete() {
  if (!deleteTarget.value) return
  await classStore.deleteClass(deleteTarget.value.id)
  showDeleteModal.value = false
}
</script>

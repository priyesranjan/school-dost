<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog as="div" class="relative z-[100]" @close="close">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-md transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel
            class="mx-auto max-w-2xl transform divide-y divide-gray-100 overflow-hidden rounded-[2rem] bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black/5 transition-all dark:divide-gray-700"
          >
            <div class="relative">
              <svg
                class="pointer-events-none absolute left-6 top-5 h-6 w-6 text-gray-400"
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
                ref="inputRef"
                type="text"
                class="h-16 w-full border-0 bg-transparent pl-16 pr-6 text-lg font-medium text-gray-900 placeholder:text-gray-400 focus:ring-0 dark:text-white"
                placeholder="Search students, staff or commands... (Ctrl+K)"
                v-model="query"
                @keydown.down.prevent="onArrowDown"
                @keydown.up.prevent="onArrowUp"
                @keydown.enter="onEnter"
              />
            </div>

            <div v-if="filteredResults.length > 0" class="max-h-96 scroll-py-3 overflow-y-auto p-3">
              <div v-for="(group, gIdx) in groupedResults" :key="group.title">
                <h3 class="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  {{ group.title }}
                </h3>
                <ul class="space-y-1">
                  <li
                    v-for="(item, iIdx) in group.items"
                    :key="item.id"
                    @click="selectItem(item)"
                    @mouseenter="activeIndex = item.globalIdx"
                    :class="[
                      'group flex cursor-pointer items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-200',
                      activeIndex === item.globalIdx ? 'bg-primary-50 dark:bg-primary-900/20' : '',
                    ]"
                  >
                    <div
                      :class="[
                        'flex h-10 w-10 items-center justify-center rounded-xl text-lg shadow-inner',
                        item.bg || 'bg-gray-50 dark:bg-gray-700',
                      ]"
                    >
                      {{ item.icon }}
                    </div>
                    <div class="flex-1">
                      <p
                        :class="[
                          'text-sm font-bold',
                          activeIndex === item.globalIdx ? 'text-primary-600' : 'text-gray-900 dark:text-white',
                        ]"
                      >
                        {{ item.title }}
                      </p>
                      <p class="text-xs text-gray-400">{{ item.subtitle }}</p>
                    </div>
                    <span
                      v-if="activeIndex === item.globalIdx"
                      class="text-[10px] font-black uppercase tracking-widest text-primary-400"
                      >Enter ⏎</span
                    >
                  </li>
                </ul>
              </div>
            </div>

            <div v-if="query !== '' && filteredResults.length === 0" class="px-6 py-14 text-center sm:px-14">
              <div class="mx-auto h-12 w-12 text-gray-400">🔍</div>
              <p class="mt-4 text-sm text-gray-900 dark:text-white">No results found for "{{ query }}"</p>
              <p class="mt-2 text-xs text-gray-500">
                Try searching for a student name, staff member, or a module like "Fees".
              </p>
            </div>

            <div class="bg-gray-50/50 dark:bg-gray-900/20 px-6 py-3 flex items-center justify-between">
              <div class="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span class="flex items-center gap-1.5"
                  ><kbd class="rounded border border-gray-200 bg-white px-1.5 dark:border-gray-700 dark:bg-gray-800"
                    >↑↓</kbd
                  >
                  Navigate</span
                >
                <span class="flex items-center gap-1.5"
                  ><kbd class="rounded border border-gray-200 bg-white px-1.5 dark:border-gray-700 dark:bg-gray-800"
                    >ESC</kbd
                  >
                  Close</span
                >
              </div>
              <div class="text-[10px] font-black text-primary-500 uppercase tracking-widest">
                Premium Command Center
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useStudentStore } from '@/stores/students'
import { useStaffStore } from '@/stores/staff'

const isOpen = ref(false)
const query = ref('')
const activeIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)
const router = useRouter()

const studentStore = useStudentStore()
const staffStore = useStaffStore()

const items = computed(() => {
  const menuItems = [
    {
      id: 'm1',
      title: 'Dashboard',
      subtitle: 'System Overview',
      path: '/',
      icon: '📊',
      type: 'command',
      bg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30',
    },
    {
      id: 'm2',
      title: 'Attendance',
      subtitle: 'Manage Registry',
      path: '/attendance',
      icon: '📋',
      type: 'command',
      bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30',
    },
    {
      id: 'm3',
      title: 'Fee Collection',
      subtitle: 'Finance & Payments',
      path: '/fees',
      icon: '💰',
      type: 'command',
      bg: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30',
    },
    {
      id: 'm4',
      title: 'Staff Directory',
      subtitle: 'Faculty Management',
      path: '/staff',
      icon: '👤',
      type: 'command',
      bg: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30',
    },
    {
      id: 'm5',
      title: 'Settings',
      subtitle: 'System Configuration',
      path: '/settings',
      icon: '⚙️',
      type: 'command',
      bg: 'bg-gray-50 text-gray-600 dark:bg-gray-900/30',
    },
  ]

  const students = studentStore.students.map((s) => ({
    id: `s${s.id}`,
    title: s.name,
    subtitle: `Student · ${s.class_name} · ${s.roll_number}`,
    phone: s.phone,
    path: `/students/${s.id}`,
    icon: '👨‍🎓',
    type: 'student',
  }))

  const staff = staffStore.staffMembers.map((s) => ({
    id: `st${s.id}`,
    title: s.name,
    subtitle: `Faculty · ${s.role} · ${s.department}`,
    phone: s.phone,
    path: `/staff/${s.id}`,
    icon: '🏢',
    type: 'staff',
  }))

  return [...menuItems, ...students, ...staff]
})

const filteredResults = computed(() => {
  if (query.value === '') return items.value.filter((i) => i.type === 'command')
  const q = query.value.toLowerCase()
  return items.value.filter(
    (i) =>
      i.title.toLowerCase().includes(q) ||
      i.subtitle.toLowerCase().includes(q) ||
      (i as any).phone?.toLowerCase().includes(q),
  )
})

const groupedResults = computed(() => {
  const results = filteredResults.value.map((item, idx) => ({ ...item, globalIdx: idx }))
  const groups: Record<string, any[]> = {}

  results.forEach((item) => {
    const typeLabel = item.type === 'command' ? 'Commands' : item.type === 'student' ? 'Students' : 'Staff'
    if (!groups[typeLabel]) groups[typeLabel] = []
    groups[typeLabel].push(item)
  })

  return Object.entries(groups).map(([title, items]) => ({ title, items }))
})

function onArrowDown() {
  activeIndex.value = (activeIndex.value + 1) % filteredResults.value.length
}

function onArrowUp() {
  activeIndex.value = (activeIndex.value - 1 + filteredResults.value.length) % filteredResults.value.length
}

function onEnter() {
  const item = filteredResults.value[activeIndex.value]
  if (item) selectItem(item)
}

function selectItem(item: any) {
  router.push(item.path)
  close()
}

function close() {
  isOpen.value = false
  query.value = ''
  activeIndex.value = 0
}

function open() {
  isOpen.value = true
  nextTick(() => inputRef.value?.focus())
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
    e.preventDefault()
    if (isOpen.value) close()
    else open()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})

defineExpose({ open, close })
</script>

<template>
  <div class="relative" ref="containerRef">
    <!-- Trigger / Selected display -->
    <div
      @click="toggleOpen"
      :class="[
        'flex min-h-[42px] w-full cursor-pointer items-center gap-2 flex-wrap rounded-xl border px-3 py-2 text-sm transition-all',
        isOpen
          ? 'border-primary-500 ring-2 ring-primary-500/20 bg-white dark:bg-gray-800'
          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-300',
      ]"
    >
      <!-- Multi-select chips -->
      <template v-if="multiple && Array.isArray(modelValue) && modelValue.length > 0">
        <span
          v-for="val in modelValue"
          :key="val"
          class="inline-flex items-center gap-1 rounded-lg bg-primary-100 dark:bg-primary-900/40 px-2 py-0.5 text-xs font-bold text-primary-700 dark:text-primary-300"
        >
          {{ labelOf(val) }}
          <button @click.stop="remove(val)" class="text-primary-400 hover:text-primary-700">
            <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
        <span v-if="multiple && (modelValue as string[]).length === 0" class="text-gray-400 text-sm">{{
          placeholder
        }}</span>
      </template>

      <!-- Single value display -->
      <template v-else-if="!multiple">
        <span v-if="modelValue" class="flex-1 text-gray-900 dark:text-white font-medium">{{
          labelOf(modelValue as string)
        }}</span>
        <span v-else class="flex-1 text-gray-400">{{ placeholder }}</span>
      </template>

      <template v-else>
        <span class="flex-1 text-gray-400">{{ placeholder }}</span>
      </template>

      <div class="ml-auto flex items-center gap-1">
        <button
          v-if="clearable && hasValue"
          @click.stop="clearAll"
          class="rounded p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <svg
          :class="['h-4 w-4 text-gray-400 transition-transform', isOpen ? 'rotate-180' : '']"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <!-- Dropdown panel -->
    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="absolute z-50 mt-1 w-full rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl overflow-hidden"
      >
        <!-- Search input -->
        <div v-if="searchable" class="border-b border-gray-50 dark:border-gray-700 p-2">
          <div class="relative">
            <svg
              class="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
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
              ref="searchRef"
              v-model="searchQuery"
              type="text"
              class="w-full rounded-xl border-0 bg-gray-50 dark:bg-gray-700 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              :placeholder="searchPlaceholder || 'Search...'"
              @keydown.down.prevent="moveHighlight(1)"
              @keydown.up.prevent="moveHighlight(-1)"
              @keydown.enter.prevent="selectHighlighted"
              @keydown.esc="close"
            />
          </div>
        </div>

        <!-- Options list -->
        <div
          class="max-h-60 overflow-y-auto py-1"
          @keydown.down.prevent="moveHighlight(1)"
          @keydown.up.prevent="moveHighlight(-1)"
        >
          <template v-if="groupedOptions.length > 0">
            <template v-for="group in groupedOptions" :key="group.label">
              <div
                v-if="group.label"
                class="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 border-t border-gray-50 dark:border-gray-700 first:border-0"
              >
                {{ group.label }}
              </div>
              <div
                v-for="(opt, idx) in group.items"
                :key="opt.value"
                @click="select(opt.value)"
                @mouseenter="highlightedIdx = opt.globalIdx"
                :class="[
                  'flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                  isSelected(opt.value)
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : highlightedIdx === opt.globalIdx
                      ? 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
                ]"
              >
                <span v-if="opt.icon" class="text-base">{{ opt.icon }}</span>
                <span class="flex-1 font-medium">{{ opt.label }}</span>
                <span v-if="opt.description" class="text-xs text-gray-400">{{ opt.description }}</span>
                <svg
                  v-if="isSelected(opt.value)"
                  class="h-4 w-4 text-primary-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </template>
          </template>
          <div v-else class="px-4 py-6 text-center text-sm text-gray-400">No options found</div>
        </div>

        <!-- Footer hint -->
        <div
          v-if="multiple"
          class="border-t border-gray-50 dark:border-gray-700 px-4 py-2 flex items-center justify-between"
        >
          <span class="text-xs text-gray-400">{{ Array.isArray(modelValue) ? modelValue.length : 0 }} selected</span>
          <button v-if="hasValue" @click.stop="clearAll" class="text-xs text-rose-500 hover:text-rose-600 font-bold">
            Clear all
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

export interface DropdownOption {
  value: string
  label: string
  description?: string
  icon?: string
  group?: string
}

const props = withDefaults(
  defineProps<{
    modelValue: string | string[]
    options: DropdownOption[]
    placeholder?: string
    searchable?: boolean
    multiple?: boolean
    clearable?: boolean
    searchPlaceholder?: string
  }>(),
  {
    placeholder: 'Select...',
    searchable: true,
    multiple: false,
    clearable: true,
  },
)

const emit = defineEmits<{ 'update:modelValue': [val: string | string[]] }>()

const isOpen = ref(false)
const searchQuery = ref('')
const highlightedIdx = ref(-1)
const containerRef = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)

function close() {
  isOpen.value = false
  searchQuery.value = ''
}
function toggleOpen() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => searchRef.value?.focus())
  }
}

const hasValue = computed(() => {
  if (Array.isArray(props.modelValue)) return props.modelValue.length > 0
  return !!props.modelValue
})

// Flatten all options with globalIdx for keyboard nav
const allOptions = computed(() => props.options.map((o, i) => ({ ...o, globalIdx: i })))

const filteredAll = computed(() => {
  if (!searchQuery.value) return allOptions.value
  const q = searchQuery.value.toLowerCase()
  return allOptions.value.filter((o) => o.label.toLowerCase().includes(q) || o.description?.toLowerCase().includes(q))
})

// Group filtered options
const groupedOptions = computed(() => {
  const groups: { label: string; items: typeof filteredAll.value }[] = []
  const seen = new Map<string, number>()
  for (const opt of filteredAll.value) {
    const grp = opt.group || ''
    if (!seen.has(grp)) {
      seen.set(grp, groups.length)
      groups.push({ label: grp, items: [] })
    }
    groups[seen.get(grp)!].items.push(opt)
  }
  return groups
})

function labelOf(val: string): string {
  return props.options.find((o) => o.value === val)?.label ?? val
}

function isSelected(val: string): boolean {
  if (Array.isArray(props.modelValue)) return props.modelValue.includes(val)
  return props.modelValue === val
}

function select(val: string) {
  if (props.multiple) {
    const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    if (current.includes(val)) {
      emit(
        'update:modelValue',
        current.filter((v) => v !== val),
      )
    } else {
      emit('update:modelValue', [...current, val])
    }
  } else {
    emit('update:modelValue', val)
    close()
  }
}

function remove(val: string) {
  if (Array.isArray(props.modelValue)) {
    emit(
      'update:modelValue',
      props.modelValue.filter((v) => v !== val),
    )
  }
}

function clearAll() {
  emit('update:modelValue', props.multiple ? [] : '')
}

function moveHighlight(dir: number) {
  const max = filteredAll.value.length - 1
  if (max < 0) return
  highlightedIdx.value = Math.max(0, Math.min(max, highlightedIdx.value + dir))
}

function selectHighlighted() {
  const opt = filteredAll.value.find((o) => o.globalIdx === highlightedIdx.value)
  if (opt) select(opt.value)
}

function handleOutside(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    close()
  }
}
onMounted(() => document.addEventListener('mousedown', handleOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleOutside))
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>

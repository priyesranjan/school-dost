<template>
  <div class="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 px-4 py-3">
    <p class="text-sm text-gray-500 dark:text-gray-400">
      Showing {{ startItem }}–{{ endItem }} of {{ total }}
    </p>
    <div class="flex items-center gap-1">
      <button
        @click="$emit('update:modelValue', modelValue - 1)"
        :disabled="modelValue <= 1"
        class="rounded-lg px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="$emit('update:modelValue', page)"
        :class="[
          'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
          page === modelValue
            ? 'bg-primary-600 text-white'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
        ]"
      >
        {{ page }}
      </button>
      <button
        @click="$emit('update:modelValue', modelValue + 1)"
        :disabled="modelValue >= totalPages"
        class="rounded-lg px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: number
  totalPages: number
  total: number
  perPage: number
}>()

defineEmits<{ (e: 'update:modelValue', val: number): void }>()

const startItem = computed(() => (props.modelValue - 1) * props.perPage + 1)
const endItem = computed(() => Math.min(props.modelValue * props.perPage, props.total))

const visiblePages = computed(() => {
  const pages: number[] = []
  const start = Math.max(1, props.modelValue - 2)
  const end = Math.min(props.totalPages, start + 4)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})
</script>

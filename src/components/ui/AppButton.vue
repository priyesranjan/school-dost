<template>
  <button
    :type="type"
    :disabled="loading || disabled"
    :class="[
      'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 hover-lift',
      sizeClass,
      variantClass,
    ]"
  >
    <svg v-if="loading" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    size?: 'xs' | 'sm' | 'md' | 'lg'
    type?: 'button' | 'submit'
    loading?: boolean
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    loading: false,
    disabled: false,
  },
)

const sizeClass = computed(() => {
  const map = {
    xs: 'px-2.5 py-1 text-[11px]',
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
  }
  return map[props.size]
})

const variantClass = computed(() => {
  const map = {
    primary:
      'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-lg shadow-primary-200 dark:shadow-none',
    secondary:
      'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-primary-400 shadow-sm',
    danger:
      'bg-danger-500 text-white hover:bg-danger-600 focus:ring-danger-500 shadow-lg shadow-danger-200 dark:shadow-none',
    ghost:
      'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white focus:ring-primary-300',
  }
  return map[props.variant]
})
</script>

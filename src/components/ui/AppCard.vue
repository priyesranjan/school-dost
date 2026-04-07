<template>
  <div
    class="rounded-2xl transition-all duration-300"
    :class="[
      glass ? 'glass-card' : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 shadow-sm',
      hover && 'hover:-translate-y-1 hover:shadow-xl'
    ]"
  >
    <div v-if="title || $slots.header" class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 px-6 py-4">
      <h3 v-if="title" class="text-base font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
      <slot name="header" />
    </div>
    <div :class="['px-6 py-4', noPadding ? '!p-0' : '']">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  noPadding?: boolean
  hover?: boolean
  glass?: boolean
}>(), {
  noPadding: false,
  hover: false,
  glass: false,
})
</script>

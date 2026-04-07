<template>
  <div class="animate-pulse" role="status" aria-label="Loading">
    <!-- Table skeleton -->
    <template v-if="type === 'table'">
      <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div class="border-b border-gray-100 dark:border-gray-700 px-6 py-4">
          <div class="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div v-for="i in rows" :key="i" class="flex items-center gap-4 border-b border-gray-50 dark:border-gray-700/50 px-6 py-4">
          <div class="h-3 flex-1 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-3 w-20 rounded bg-gray-100 dark:bg-gray-600"></div>
          <div class="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </template>

    <!-- Cards skeleton -->
    <template v-else-if="type === 'cards'">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="i in rows" :key="i" class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div class="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700 mb-3"></div>
          <div class="h-6 w-16 rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
          <div class="h-2 w-28 rounded bg-gray-100 dark:bg-gray-600"></div>
        </div>
      </div>
    </template>

    <!-- Text lines skeleton -->
    <template v-else>
      <div class="space-y-3">
        <div v-for="i in rows" :key="i" :class="['h-3 rounded bg-gray-200 dark:bg-gray-700', i % 2 === 0 ? 'w-3/4' : 'w-full']"></div>
      </div>
    </template>

    <span class="sr-only">Loading...</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  type?: 'table' | 'cards' | 'text'
  rows?: number
}>(), { type: 'text', rows: 5 })
</script>

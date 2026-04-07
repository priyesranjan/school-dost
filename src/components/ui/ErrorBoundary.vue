<template>
  <slot v-if="!hasError" />
  <div v-else class="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
    <div class="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl">💥</div>
    <h2 class="text-xl font-bold text-gray-900 dark:text-white">Something went wrong</h2>
    <p class="max-w-md text-sm text-gray-500 dark:text-gray-400">
      An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
    </p>
    <p v-if="errorMessage" class="max-w-md rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-2 font-mono text-xs text-red-600 dark:text-red-400">
      {{ errorMessage }}
    </p>
    <button
      @click="recover"
      class="mt-2 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
    >
      Refresh Page
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const errorMessage = ref('')

onErrorCaptured((err: Error) => {
  hasError.value = true
  errorMessage.value = err.message || 'Unknown error'
  console.error('[ErrorBoundary]', err)
  return false // prevent propagation
})

function recover() {
  window.location.reload()
}
</script>

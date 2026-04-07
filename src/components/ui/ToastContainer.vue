<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-2">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg min-w-[320px] max-w-[420px]',
          classes[toast.type],
        ]"
      >
        <div :class="['flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full', iconBg[toast.type]]">
          <span class="text-xs">{{ icons[toast.type] }}</span>
        </div>
        <p class="flex-1 text-sm font-medium">{{ toast.message }}</p>
        <button @click="store.remove(toast.id)" class="ml-2 text-gray-400 hover:text-gray-600">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToastStore } from '@/stores/toast'

const store = useToastStore()
const toasts = computed(() => store.toasts)

const classes: Record<string, string> = {
  success: 'bg-success-50 border-green-200 text-green-800',
  error: 'bg-danger-50 border-red-200 text-red-800',
  warning: 'bg-warning-50 border-amber-200 text-amber-800',
  info: 'bg-primary-50 border-blue-200 text-blue-800',
}

const iconBg: Record<string, string> = {
  success: 'bg-green-100 text-green-600',
  error: 'bg-red-100 text-red-600',
  warning: 'bg-amber-100 text-amber-600',
  info: 'bg-blue-100 text-blue-600',
}

const icons: Record<string, string> = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'i',
}
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease;
}
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>

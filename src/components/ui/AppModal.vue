<template>
  <teleport to="body">
    <transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-40 flex items-start justify-center pt-[10vh] px-4"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <div class="fixed inset-0 bg-black/40" @click="close" />
        <div
          ref="modalRef"
          :class="[
            'relative w-full rounded-xl bg-white dark:bg-gray-800 shadow-2xl',
            sizeClass,
          ]"
          @keydown.escape="close"
          tabindex="-1"
        >
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 px-6 py-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
            <button
              @click="close"
              class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Close dialog"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="max-h-[60vh] overflow-y-auto px-6 py-4">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="border-t border-gray-100 dark:border-gray-700 px-6 py-4">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title: string
  size?: 'sm' | 'md' | 'lg'
}>(), { size: 'md' })

const emit = defineEmits<{ (e: 'update:modelValue', val: boolean): void }>()

const modalRef = ref<HTMLElement | null>(null)

function close() {
  emit('update:modelValue', false)
}

// Auto-focus modal when opened
watch(() => props.modelValue, (open) => {
  if (open) {
    nextTick(() => modalRef.value?.focus())
  }
})

const sizeClass = computed(() => {
  const map = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' }
  return map[props.size]
})
</script>

<style scoped>
.modal-enter-active { transition: all 0.25s ease; }
.modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .relative, .modal-leave-to .relative {
  transform: translateY(-20px) scale(0.95);
}
</style>

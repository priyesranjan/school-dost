<template>
  <Transition name="sticky-bar">
    <div v-if="isDirty" class="fixed bottom-0 left-0 right-0 z-30 print:hidden" :style="{ left: offsetLeft }">
      <div
        class="mx-auto flex items-center justify-between gap-4 bg-gray-900 dark:bg-gray-950 px-6 py-4 shadow-2xl border-t border-gray-800"
      >
        <div class="flex items-center gap-3">
          <span class="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
          <p class="text-sm font-bold text-white">Unsaved changes</p>
          <p v-if="changesCount" class="text-xs text-gray-400">
            {{ changesCount }} field{{ changesCount > 1 ? 's' : '' }} modified
          </p>
        </div>

        <div class="flex items-center gap-3">
          <slot name="extra-actions" />

          <button
            v-if="showReset"
            @click="$emit('reset')"
            :disabled="saving"
            class="rounded-xl border border-gray-700 px-4 py-2.5 text-sm font-bold text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Reset
          </button>
          <button
            @click="$emit('cancel')"
            :disabled="saving"
            class="rounded-xl border border-gray-700 px-4 py-2.5 text-sm font-bold text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Discard
          </button>
          <button
            @click="$emit('save')"
            :disabled="saving"
            class="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-black text-white hover:bg-primary-500 transition-colors shadow-lg shadow-primary-900/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg v-if="saving" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ saving ? 'Saving...' : saveLabel }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    isDirty: boolean
    saving?: boolean
    saveLabel?: string
    showReset?: boolean
    changesCount?: number
    offsetLeft?: string
  }>(),
  {
    saving: false,
    saveLabel: 'Save Changes',
    showReset: true,
    changesCount: 0,
    offsetLeft: '0',
  },
)

defineEmits<{ save: []; cancel: []; reset: [] }>()
</script>

<style scoped>
.sticky-bar-enter-active,
.sticky-bar-leave-active {
  transition:
    transform 0.25s cubic-bezier(0.32, 0.72, 0, 1),
    opacity 0.25s ease;
}
.sticky-bar-enter-from,
.sticky-bar-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Toast } from '@/types'

let toastId = 0

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])

  function show(type: Toast['type'], message: string, duration = 4000) {
    const id = ++toastId
    toasts.value.push({ id, type, message, duration })
    if (duration > 0) {
      setTimeout(() => remove(id), duration)
    }
  }

  function remove(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function success(message: string) {
    show('success', message)
  }

  function error(message: string) {
    show('error', message, 6000)
  }

  function warning(message: string) {
    show('warning', message)
  }

  return { toasts, show, remove, success, error, warning }
})

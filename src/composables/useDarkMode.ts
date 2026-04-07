import { ref, watch } from 'vue'

// Read immediately to prevent flash of light mode
const saved = localStorage.getItem('erp_dark_mode')
const isDark = ref(saved === 'true')
if (isDark.value) document.documentElement.classList.add('dark')

export function useDarkMode() {
  function applyClass() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  function toggle() {
    isDark.value = !isDark.value
    localStorage.setItem('erp_dark_mode', String(isDark.value))
    applyClass()
  }

  watch(isDark, applyClass)

  return { isDark, toggle }
}

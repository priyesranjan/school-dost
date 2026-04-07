import { ref, computed, type Ref, type ComputedRef } from 'vue'

type SortDirection = 'asc' | 'desc' | null

export function useTableSort<T>(items: Ref<T[]> | ComputedRef<T[]>) {
  const sortKey = ref<string | null>(null)
  const sortDir = ref<SortDirection>(null)

  function toggleSort(key: string) {
    if (sortKey.value === key) {
      if (sortDir.value === 'asc') sortDir.value = 'desc'
      else if (sortDir.value === 'desc') { sortKey.value = null; sortDir.value = null }
      else sortDir.value = 'asc'
    } else {
      sortKey.value = key
      sortDir.value = 'asc'
    }
  }

  const sortedItems = computed(() => {
    const arr = [...items.value]
    if (!sortKey.value || !sortDir.value) return arr
    const key = sortKey.value
    const dir = sortDir.value === 'asc' ? 1 : -1
    return arr.sort((a, b) => {
      const va = (a as Record<string, unknown>)[key]
      const vb = (b as Record<string, unknown>)[key]
      if (va == null && vb == null) return 0
      if (va == null) return 1
      if (vb == null) return -1
      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir
      return String(va).localeCompare(String(vb)) * dir
    })
  })

  function sortIcon(key: string) {
    if (sortKey.value !== key) return '↕'
    return sortDir.value === 'asc' ? '↑' : '↓'
  }

  return { sortKey, sortDir, toggleSort, sortedItems, sortIcon }
}

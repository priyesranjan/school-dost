import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { loadFromStorage, saveToStorage } from '@/utils/storage'
import type { StaffTask } from '@/types'
import { getOfflineMode } from '@/utils/runtimeConfig'
import { tasksService } from '@/services/tasksService'

const demoTasks: StaffTask[] = [
  {
    id: 1,
    staff_id: 1,
    title: 'Annual Curriculum Review',
    description: 'Review and update the Mathematics curriculum for the next academic year.',
    priority: 'high',
    status: 'in_progress',
    due_date: '2026-05-15',
    created_at: '2026-04-01',
  },
  {
    id: 2,
    staff_id: 1,
    title: 'Inventory Audit',
    description: 'Audit geometry toolkits in Lab B.',
    priority: 'medium',
    status: 'completed',
    due_date: '2026-04-05',
    created_at: '2026-03-25',
  },
  {
    id: 3,
    staff_id: 2,
    title: 'Science Fair Coordination',
    description: 'Lead the organization committee for the Inter-School Science Fair.',
    priority: 'high',
    status: 'pending',
    due_date: '2026-06-10',
    created_at: '2026-04-05',
  },
]

export const useTaskStore = defineStore('tasks', () => {
  const saved = loadFromStorage<StaffTask[]>('staff_tasks')
  const tasks = ref<StaffTask[]>(saved || demoTasks)
  const loading = ref(false)

  watch(tasks, (val) => saveToStorage('staff_tasks', val), { deep: true })

  function shouldUseLocalMode() {
    return getOfflineMode() || !localStorage.getItem('auth_token')
  }

  async function fetchTasks(params?: { staff_id?: number; status?: StaffTask['status'] }) {
    if (shouldUseLocalMode()) return
    loading.value = true
    try {
      const res = await tasksService.getAll({ page: 1, per_page: 100, ...params })
      const incoming = res.items || res
      if (params?.staff_id) {
        tasks.value = [...tasks.value.filter((task) => task.staff_id !== params.staff_id), ...incoming]
      } else {
        tasks.value = incoming
      }
    } finally {
      loading.value = false
    }
  }

  async function addTask(payload: Omit<StaffTask, 'id' | 'created_at'>) {
    if (!shouldUseLocalMode()) {
      const task = await tasksService.create(payload)
      tasks.value.unshift(task)
      return
    }
    tasks.value.unshift({
      id: Date.now(),
      created_at: new Date().toISOString().split('T')[0],
      ...payload,
    })
  }

  async function updateTaskStatus(id: number, status: StaffTask['status']) {
    if (!shouldUseLocalMode()) {
      const updated = await tasksService.updateStatus(id, status)
      const idx = tasks.value.findIndex((t) => t.id === id)
      if (idx !== -1) tasks.value[idx] = updated
      return
    }
    const task = tasks.value.find((t) => t.id === id)
    if (task) task.status = status
  }

  return {
    tasks,
    loading,
    fetchTasks,
    addTask,
    updateTaskStatus,
  }
})

import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { loadFromStorage, saveToStorage } from '@/utils/storage'
import type { StaffTask } from '@/types'

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

  watch(tasks, (val) => saveToStorage('staff_tasks', val), { deep: true })

  function addTask(payload: Omit<StaffTask, 'id' | 'created_at'>) {
    tasks.value.unshift({
      id: Date.now(),
      created_at: new Date().toISOString().split('T')[0],
      ...payload,
    })
  }

  function updateTaskStatus(id: number, status: StaffTask['status']) {
    const task = tasks.value.find((t) => t.id === id)
    if (task) task.status = status
  }

  return {
    tasks,
    addTask,
    updateTaskStatus,
  }
})

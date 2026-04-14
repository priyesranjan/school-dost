import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { loadFromStorage, saveToStorage } from '@/utils/storage'
import { useAuditStore } from './audit'

export interface Assignment {
  id: number
  title: string
  description?: string
  subject: string
  class_name: string
  teacher_name?: string
  due_date: string
  status: 'active' | 'completed' | 'overdue'
}

const demoAssignments: Assignment[] = [
  {
    id: 1,
    title: 'Chapter 4: Algebra Exercises',
    subject: 'Mathematics',
    class_name: 'Class 10',
    due_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    status: 'active',
    teacher_name: 'Priya Sharma',
  },
  {
    id: 2,
    title: 'Chemical Bonding Lab Report',
    subject: 'Science',
    class_name: 'Class 10',
    due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    status: 'active',
    teacher_name: 'Ravi Kumar',
  },
  {
    id: 3,
    title: 'Essay on Climate Change',
    subject: 'English',
    class_name: 'Class 9',
    due_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    status: 'overdue',
    teacher_name: 'Meera Das',
  },
]

export const useAssignmentsStore = defineStore('assignments', () => {
  const auditStore = useAuditStore()
  const saved = loadFromStorage<Assignment[]>('assignments')
  const assignments = ref<Assignment[]>(saved || demoAssignments)

  watch(assignments, (val) => saveToStorage('assignments', val), { deep: true })

  const activeAssignments = computed(() => assignments.value.filter((a) => a.status === 'active'))

  function getAssignmentsForClass(className: string) {
    return assignments.value.filter((a) => a.class_name === className)
  }

  function addAssignment(payload: Omit<Assignment, 'id' | 'status'>) {
    const record: Assignment = { id: Date.now(), status: 'active', ...payload }
    assignments.value.unshift(record)
    auditStore.addLog({
      action: 'assignment_posted',
      module: 'academic',
      actor_name: payload.teacher_name || 'Teacher',
      actor_role: 'teacher',
      target: payload.title,
      metadata: `Class: ${payload.class_name} | Subject: ${payload.subject}`,
    })
  }

  function updateStatus(id: number, status: Assignment['status']) {
    const idx = assignments.value.findIndex((a) => a.id === id)
    if (idx !== -1) {
      assignments.value[idx].status = status
    }
  }

  function deleteAssignment(id: number) {
    assignments.value = assignments.value.filter((a) => a.id !== id)
  }

  return {
    assignments,
    activeAssignments,
    getAssignmentsForClass,
    addAssignment,
    updateStatus,
    deleteAssignment,
  }
})

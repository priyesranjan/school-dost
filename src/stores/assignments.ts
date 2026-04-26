import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { AssignmentRecord, AssignmentSubmissionRecord, ClassroomResourceRecord, PaginationParams } from '@/types'
import { assignmentsService } from '@/services/assignmentsService'
import { loadFromStorage, saveToStorage } from '@/utils/storage'
import { useToastStore } from './toast'

const demoAssignments: AssignmentRecord[] = [
  {
    id: 1,
    title: 'Chapter 4: Algebra Exercises',
    description: 'Solve the worksheet set and write step-by-step working for each problem.',
    subject: 'Mathematics',
    class_name: 'Class 10',
    due_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    resource_url: 'https://example.test/algebra-worksheet.pdf',
    status: 'active',
    teacher_name: 'Priya Sharma',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    submission_count: 0,
    my_submission: null,
  },
  {
    id: 2,
    title: 'Chemical Bonding Lab Report',
    description: 'Submit your observations from the lab and include the safety checklist.',
    subject: 'Science',
    class_name: 'Class 10',
    due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    resource_url: null,
    status: 'active',
    teacher_name: 'Ravi Kumar',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    submission_count: 0,
    my_submission: null,
  },
  {
    id: 3,
    title: 'Essay on Climate Change',
    description: 'Write a 600-word essay with three practical interventions.',
    subject: 'English',
    class_name: 'Class 9',
    due_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    resource_url: 'https://example.test/climate-reading',
    status: 'overdue',
    teacher_name: 'Meera Das',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    submission_count: 0,
    my_submission: null,
  },
]

function replaceAssignment(assignments: AssignmentRecord[], updated: AssignmentRecord) {
  const index = assignments.findIndex((item) => item.id === updated.id)
  if (index === -1) {
    assignments.unshift(updated)
    return
  }
  assignments.splice(index, 1, updated)
}

export const useAssignmentsStore = defineStore('assignments', () => {
  const toast = useToastStore()
  const saved = loadFromStorage<AssignmentRecord[]>('assignments_cache')
  const assignments = ref<AssignmentRecord[]>(saved || demoAssignments)
  const loading = ref(false)
  const submissionsByAssignment = ref<Record<number, AssignmentSubmissionRecord[]>>({})
  const resources = ref<ClassroomResourceRecord[]>([])

  watch(assignments, (value) => saveToStorage('assignments_cache', value), { deep: true })

  const activeAssignments = computed(() => assignments.value.filter((assignment) => assignment.status === 'active'))
  const overdueAssignments = computed(() => assignments.value.filter((assignment) => assignment.status === 'overdue'))

  function getAssignmentsForClass(className: string) {
    return assignments.value.filter((assignment) => assignment.class_name === className)
  }

  async function loadAssignments(params?: PaginationParams & { class_name?: string; status?: 'active' | 'completed' | 'archived' }) {
    loading.value = true
    try {
      const data = await assignmentsService.list({
        page: params?.page || 1,
        per_page: params?.per_page || 100,
        class_name: params?.class_name,
        status: params?.status,
      })
      assignments.value = data.items
      return data
    } catch (error) {
      toast.error('Failed to load assignments')
      return {
        items: assignments.value,
        total: assignments.value.length,
        page: 1,
        per_page: assignments.value.length || 100,
      }
    } finally {
      loading.value = false
    }
  }

  async function addAssignment(payload: {
    title: string
    description?: string | null
    class_name: string
    subject: string
    due_date: string
    resource_url?: string | null
  }) {
    loading.value = true
    try {
      const record = await assignmentsService.create(payload)
      assignments.value.unshift(record)
      toast.success('Assignment published')
      return record
    } catch (error) {
      toast.error('Failed to publish assignment')
      throw new Error('Failed to publish assignment')
    } finally {
      loading.value = false
    }
  }

  async function loadResources(params?: PaginationParams & { class_name?: string; subject?: string; resource_type?: ClassroomResourceRecord['resource_type'] }) {
    loading.value = true
    try {
      const data = await assignmentsService.listResources({
        page: params?.page || 1,
        per_page: params?.per_page || 100,
        class_name: params?.class_name,
        subject: params?.subject,
        resource_type: params?.resource_type,
      })
      resources.value = data.items
      return data
    } catch (error) {
      toast.error('Failed to load classroom resources')
      return {
        items: resources.value,
        total: resources.value.length,
        page: 1,
        per_page: resources.value.length || 100,
      }
    } finally {
      loading.value = false
    }
  }

  async function addResource(payload: {
    title: string
    description?: string | null
    class_name: string
    subject: string
    resource_type: ClassroomResourceRecord['resource_type']
    url: string
    assignment_id?: number | null
  }) {
    loading.value = true
    try {
      const record = await assignmentsService.createResource(payload)
      resources.value.unshift(record)
      toast.success('Classroom resource published')
      return record
    } catch (error) {
      toast.error('Failed to publish classroom resource')
      throw new Error('Failed to publish classroom resource')
    } finally {
      loading.value = false
    }
  }

  async function updateStatus(id: number, status: 'active' | 'completed' | 'archived') {
    loading.value = true
    try {
      const record = await assignmentsService.updateStatus(id, status)
      replaceAssignment(assignments.value, record)
      toast.success('Assignment updated')
      return record
    } catch (error) {
      toast.error('Failed to update assignment')
      throw new Error('Failed to update assignment')
    } finally {
      loading.value = false
    }
  }

  async function deleteAssignment(id: number) {
    loading.value = true
    try {
      await assignmentsService.remove(id)
      assignments.value = assignments.value.filter((assignment) => assignment.id !== id)
      delete submissionsByAssignment.value[id]
      toast.success('Assignment deleted')
    } catch (error) {
      toast.error('Failed to delete assignment')
      throw new Error('Failed to delete assignment')
    } finally {
      loading.value = false
    }
  }

  async function submitAssignment(
    id: number,
    payload: {
      submission_text?: string | null
      attachment_url?: string | null
    },
  ) {
    loading.value = true
    try {
      const submission = await assignmentsService.submit(id, payload)
      const existing = assignments.value.find((assignment) => assignment.id === id)
      if (existing) {
        const hadSubmission = Boolean(existing.my_submission)
        replaceAssignment(assignments.value, {
          ...existing,
          my_submission: submission,
          submission_count: hadSubmission ? existing.submission_count : existing.submission_count + 1,
        })
      }
      const current = submissionsByAssignment.value[id] || []
      const index = current.findIndex((item) => item.id === submission.id)
      if (index === -1) {
        submissionsByAssignment.value[id] = [submission, ...current]
      } else {
        current.splice(index, 1, submission)
        submissionsByAssignment.value[id] = [...current]
      }
      toast.success('Assignment submitted')
      return submission
    } catch (error) {
      toast.error('Failed to submit assignment')
      throw new Error('Failed to submit assignment')
    } finally {
      loading.value = false
    }
  }

  async function loadSubmissions(assignmentId: number) {
    loading.value = true
    try {
      const items = await assignmentsService.listSubmissions(assignmentId)
      submissionsByAssignment.value = {
        ...submissionsByAssignment.value,
        [assignmentId]: items,
      }
      return items
    } catch (error) {
      toast.error('Failed to load assignment submissions')
      throw new Error('Failed to load assignment submissions')
    } finally {
      loading.value = false
    }
  }

  async function reviewSubmission(
    assignmentId: number,
    submissionId: number,
    payload: {
      status?: 'submitted' | 'reviewed' | 'returned'
      feedback?: string | null
      score?: number | null
    },
  ) {
    loading.value = true
    try {
      const submission = await assignmentsService.reviewSubmission(assignmentId, submissionId, payload)
      const current = submissionsByAssignment.value[assignmentId] || []
      const index = current.findIndex((item) => item.id === submission.id)
      if (index === -1) {
        submissionsByAssignment.value[assignmentId] = [submission, ...current]
      } else {
        current.splice(index, 1, submission)
        submissionsByAssignment.value[assignmentId] = [...current]
      }
      if (submission.user_role === 'student') {
        const existing = assignments.value.find((assignment) => assignment.id === assignmentId)
        if (existing?.my_submission?.id === submission.id) {
          replaceAssignment(assignments.value, {
            ...existing,
            my_submission: submission,
          })
        }
      }
      toast.success('Submission reviewed')
      return submission
    } catch (error) {
      toast.error('Failed to review submission')
      throw new Error('Failed to review submission')
    } finally {
      loading.value = false
    }
  }

  if (localStorage.getItem('auth_token')) {
    void loadAssignments()
  }

  return {
    assignments,
    resources,
    loading,
    activeAssignments,
    overdueAssignments,
    submissionsByAssignment,
    getAssignmentsForClass,
    loadAssignments,
    addAssignment,
    loadResources,
    addResource,
    updateStatus,
    deleteAssignment,
    submitAssignment,
    loadSubmissions,
    reviewSubmission,
  }
})

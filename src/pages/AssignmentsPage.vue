<template>
  <div class="space-y-8 animate-fade-in-up">
    <div
      class="relative overflow-hidden rounded-[2rem] bg-indigo-50 p-8 shadow-xl shadow-indigo-100/50 dark:border dark:border-indigo-900/30 dark:bg-gray-800/80 dark:shadow-none"
    >
      <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div
            class="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
          >
            Academic Workflow
          </div>
          <h1 class="mt-3 text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            Assignment Workspace
          </h1>
          <p class="mt-1 text-sm font-medium text-indigo-600/70 dark:text-indigo-300/60">
            Publish classwork, track submissions, and keep deadlines visible for every learner.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <AppButton variant="secondary" :loading="assignStore.loading" @click="refreshAssignments">Refresh</AppButton>
          <AppButton
            v-if="canBroadcast"
            variant="secondary"
            @click="openResourceModal"
          >
            New Resource
          </AppButton>
          <AppButton
            v-if="canBroadcast"
            @click="openCreateModal"
            class="h-[48px] px-8 bg-indigo-600 hover:bg-indigo-700"
          >
            New Assignment
          </AppButton>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <div class="rounded-3xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-800/50">
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Assignments</p>
        <p class="mt-2 text-3xl font-black text-gray-900 dark:text-white">{{ assignStore.assignments.length }}</p>
      </div>
      <div class="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-6 dark:border-emerald-900/30 dark:bg-emerald-900/10">
        <p class="text-[10px] font-black uppercase tracking-widest text-emerald-600/70 dark:text-emerald-400">Active</p>
        <p class="mt-2 text-3xl font-black text-emerald-600 dark:text-emerald-400">{{ activeCount }}</p>
      </div>
      <div class="rounded-3xl border border-rose-100 bg-rose-50/40 p-6 dark:border-rose-900/30 dark:bg-rose-900/10">
        <p class="text-[10px] font-black uppercase tracking-widest text-rose-600/70 dark:text-rose-400">Overdue</p>
        <p class="mt-2 text-3xl font-black text-rose-600 dark:text-rose-400">{{ overdueCount }}</p>
      </div>
      <div class="rounded-3xl border border-indigo-100 bg-indigo-50/40 p-6 dark:border-indigo-900/30 dark:bg-indigo-900/10">
        <p class="text-[10px] font-black uppercase tracking-widest text-indigo-600/70 dark:text-indigo-400">
          Submitted Work
        </p>
        <p class="mt-2 text-3xl font-black text-indigo-600 dark:text-indigo-400">{{ submissionVolume }}</p>
      </div>
    </div>

    <AppCard title="Assignment Queue" class="shadow-sm border-none shadow-2xl">
      <div class="grid grid-cols-1 gap-4 px-6 pt-6 md:grid-cols-3">
        <AppInput v-model="filters.class_name" type="select" label="Class">
          <option value="">All Classes</option>
          <option v-for="className in timetableStore.classes" :key="className" :value="className">{{ className }}</option>
        </AppInput>
        <AppInput v-model="filters.status" type="select" label="Status">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </AppInput>
        <div class="flex items-end gap-3">
          <AppButton @click="refreshAssignments" :loading="assignStore.loading">Apply Filters</AppButton>
          <AppButton variant="secondary" @click="clearFilters">Reset</AppButton>
        </div>
      </div>

      <div class="mt-6 divide-y divide-gray-50 dark:divide-gray-700/50">
        <div
          v-for="assignment in assignStore.assignments"
          :key="assignment.id"
          class="p-6 transition-all hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
        >
          <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span :class="statusPillClass(assignment.status)">
                  {{ assignment.status }}
                </span>
                <span class="rounded-lg bg-indigo-50 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                  {{ assignment.class_name }}
                </span>
                <span class="rounded-lg bg-gray-100 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                  {{ assignment.subject }}
                </span>
              </div>

              <h3 class="mt-3 text-xl font-black text-gray-900 dark:text-white">{{ assignment.title }}</h3>
              <p v-if="assignment.description" class="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {{ assignment.description }}
              </p>
              <a
                v-if="assignment.resource_url"
                :href="assignment.resource_url"
                target="_blank"
                rel="noreferrer"
                class="mt-3 inline-flex text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                Open teacher resource
              </a>

              <div class="mt-4 flex flex-wrap items-center gap-3 text-xs font-bold text-gray-500 dark:text-gray-400">
                <span>Due {{ formatRelativeDate(assignment.due_date) }}</span>
                <span>Teacher: {{ assignment.teacher_name || 'Academic Team' }}</span>
                <span v-if="canBroadcast">{{ assignment.submission_count }} submissions</span>
              </div>

              <div
                v-if="assignment.my_submission"
                class="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 dark:border-emerald-900/30 dark:bg-emerald-900/10"
              >
                <div class="flex flex-wrap items-center gap-2">
                  <span class="rounded-lg bg-emerald-100 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    {{ assignment.my_submission.status }}
                  </span>
                  <span class="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    Submitted {{ formatDateTime(assignment.my_submission.submitted_at) }}
                  </span>
                  <span v-if="assignment.my_submission.score !== null" class="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-300">
                    Score {{ assignment.my_submission.score }}
                  </span>
                </div>
                <p v-if="assignment.my_submission.submission_text" class="mt-2 text-sm text-gray-700 dark:text-gray-200">
                  {{ assignment.my_submission.submission_text }}
                </p>
                <p v-if="assignment.my_submission.feedback" class="mt-2 text-sm text-emerald-700 dark:text-emerald-300">
                  Feedback: {{ assignment.my_submission.feedback }}
                </p>
                <a
                  v-if="assignment.my_submission.attachment_url"
                  :href="assignment.my_submission.attachment_url"
                  target="_blank"
                  rel="noreferrer"
                  class="mt-2 inline-flex text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                  View submitted attachment
                </a>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2 xl:justify-end">
              <AppButton
                v-if="canSubmit"
                size="sm"
                @click="openSubmissionModal(assignment)"
              >
                {{ assignment.my_submission ? 'Update Submission' : 'Submit Work' }}
              </AppButton>
              <AppButton
                v-if="canBroadcast"
                size="sm"
                variant="secondary"
                @click="openReviewModal(assignment)"
              >
                Review Submissions
              </AppButton>
              <AppButton
                v-if="canBroadcast && assignment.status === 'active'"
                size="sm"
                variant="secondary"
                @click="markCompleted(assignment.id)"
              >
                Mark Completed
              </AppButton>
              <button
                v-if="canBroadcast"
                class="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-500 transition-colors hover:bg-rose-600 hover:text-white"
                @click="confirmDelete(assignment.id)"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <EmptyState
        v-if="!assignStore.assignments.length"
        title="No Assignments Yet"
        message="This workspace is clear right now."
        class="py-16"
      />
    </AppCard>

    <AppCard title="Classroom Resource Library" class="shadow-sm border-none shadow-2xl">
      <div class="grid grid-cols-1 gap-4 px-6 pt-6 md:grid-cols-4">
        <AppInput v-model="resourceFilters.class_name" type="select" label="Class">
          <option value="">All Classes</option>
          <option v-for="className in timetableStore.classes" :key="`resource-${className}`" :value="className">{{ className }}</option>
        </AppInput>
        <AppInput v-model="resourceFilters.subject" label="Subject" />
        <AppInput v-model="resourceFilters.resource_type" type="select" label="Type">
          <option value="">All Types</option>
          <option value="document">Document</option>
          <option value="worksheet">Worksheet</option>
          <option value="video">Video</option>
          <option value="link">Link</option>
        </AppInput>
        <div class="flex items-end gap-3">
          <AppButton @click="refreshResources" :loading="assignStore.loading">Apply</AppButton>
          <AppButton variant="secondary" @click="clearResourceFilters">Reset</AppButton>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-1 gap-4 px-6 pb-6 md:grid-cols-2 xl:grid-cols-3">
        <div
          v-for="resource in assignStore.resources"
          :key="resource.id"
          class="rounded-3xl border border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-800/40"
        >
          <div class="flex flex-wrap items-center gap-2">
            <span class="rounded-lg bg-indigo-50 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
              {{ resource.class_name }}
            </span>
            <span class="rounded-lg bg-gray-100 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:bg-gray-700 dark:text-gray-300">
              {{ resource.resource_type }}
            </span>
          </div>
          <h3 class="mt-3 text-lg font-black text-gray-900 dark:text-white">{{ resource.title }}</h3>
          <p class="mt-1 text-xs font-bold uppercase tracking-widest text-gray-400">{{ resource.subject }}</p>
          <p v-if="resource.description" class="mt-3 text-sm text-gray-600 dark:text-gray-300">
            {{ resource.description }}
          </p>
          <p v-if="resource.assignment_title" class="mt-3 text-xs font-bold text-gray-500 dark:text-gray-400">
            Linked assignment: {{ resource.assignment_title }}
          </p>
          <div class="mt-4 flex items-center justify-between gap-3">
            <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {{ resource.published_by_name || 'Academic Team' }}
            </p>
            <a
              :href="resource.url"
              target="_blank"
              rel="noreferrer"
              class="inline-flex rounded-xl bg-indigo-600 px-3 py-2 text-xs font-black text-white hover:bg-indigo-700"
            >
              Open Resource
            </a>
          </div>
        </div>
      </div>

      <EmptyState
        v-if="!assignStore.resources.length"
        title="No resources yet"
        message="Publish notes, worksheets, and links for classes here."
        class="py-12"
      />
    </AppCard>

    <AppModal v-model="showCreateModal" title="Create Assignment" size="md">
      <form class="space-y-5" @submit.prevent="saveAssignment">
        <AppInput v-model="createForm.title" label="Title" required />
        <AppInput v-model="createForm.description" type="textarea" label="Instructions" :rows="4" />
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <AppInput v-model="createForm.class_name" type="select" label="Class" required>
            <option value="">Select Class</option>
            <option v-for="className in timetableStore.classes" :key="className" :value="className">{{ className }}</option>
          </AppInput>
          <AppInput v-model="createForm.subject" label="Subject" required />
        </div>
        <AppInput v-model="createForm.due_date" type="date" label="Due Date" required />
        <AppInput v-model="createForm.resource_url" label="Assignment Resource URL" placeholder="https://..." />
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showCreateModal = false">Cancel</AppButton>
          <AppButton :loading="assignStore.loading" @click="saveAssignment">Publish</AppButton>
        </div>
      </template>
    </AppModal>

    <AppModal v-model="showResourceModal" title="Publish Classroom Resource" size="md">
      <form class="space-y-5" @submit.prevent="saveResource">
        <AppInput v-model="resourceForm.title" label="Title" required />
        <AppInput v-model="resourceForm.description" type="textarea" label="Description" :rows="4" />
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <AppInput v-model="resourceForm.class_name" type="select" label="Class" required>
            <option value="">Select Class</option>
            <option v-for="className in timetableStore.classes" :key="`resource-form-${className}`" :value="className">{{ className }}</option>
          </AppInput>
          <AppInput v-model="resourceForm.subject" label="Subject" required />
        </div>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <AppInput v-model="resourceForm.resource_type" type="select" label="Type" required>
            <option value="document">Document</option>
            <option value="worksheet">Worksheet</option>
            <option value="video">Video</option>
            <option value="link">Link</option>
          </AppInput>
          <AppInput v-model="resourceForm.assignment_id" type="select" label="Link Assignment">
            <option value="">Standalone Resource</option>
            <option v-for="assignment in assignStore.assignments" :key="`assignment-link-${assignment.id}`" :value="String(assignment.id)">
              {{ assignment.title }}
            </option>
          </AppInput>
        </div>
        <AppInput v-model="resourceForm.url" label="Resource URL" placeholder="https://..." required />
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showResourceModal = false">Cancel</AppButton>
          <AppButton :loading="assignStore.loading" @click="saveResource">Publish Resource</AppButton>
        </div>
      </template>
    </AppModal>

    <AppModal v-model="showSubmissionModal" title="Submit Assignment" size="md">
      <div v-if="activeSubmissionAssignment" class="space-y-5">
        <div class="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/30">
          <p class="text-sm font-black text-gray-900 dark:text-white">{{ activeSubmissionAssignment.title }}</p>
          <p class="mt-1 text-xs font-bold text-gray-500 dark:text-gray-400">
            {{ activeSubmissionAssignment.subject }} · Due {{ activeSubmissionAssignment.due_date }}
          </p>
        </div>
        <AppInput v-model="submissionForm.submission_text" type="textarea" label="Submission Notes" :rows="5" />
        <AppInput
          v-model="submissionForm.attachment_url"
          label="Attachment URL"
          placeholder="https://..."
        />
      </div>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showSubmissionModal = false">Cancel</AppButton>
          <AppButton :loading="assignStore.loading" @click="saveSubmission">Submit</AppButton>
        </div>
      </template>
    </AppModal>

    <AppModal v-model="showReviewModal" title="Review Submissions" size="lg">
      <div v-if="activeReviewAssignment" class="space-y-5">
        <div class="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/30">
          <p class="text-sm font-black text-gray-900 dark:text-white">{{ activeReviewAssignment.title }}</p>
          <p class="mt-1 text-xs font-bold text-gray-500 dark:text-gray-400">
            {{ activeReviewAssignment.submission_count }} submissions received
          </p>
        </div>

        <div v-if="reviewSubmissions.length" class="space-y-4">
          <div
            v-for="submission in reviewSubmissions"
            :key="submission.id"
            class="rounded-2xl border border-gray-100 p-4 dark:border-gray-700"
          >
            <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <p class="text-sm font-black text-gray-900 dark:text-white">{{ submission.user_name }}</p>
                  <span class="rounded-lg bg-gray-100 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                    {{ submission.status }}
                  </span>
                </div>
                <p class="mt-1 text-xs font-bold text-gray-500 dark:text-gray-400">
                  Submitted {{ formatDateTime(submission.submitted_at) }}
                </p>
              </div>
              <a
                v-if="submission.attachment_url"
                :href="submission.attachment_url"
                target="_blank"
                rel="noreferrer"
                class="text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                Open attachment
              </a>
            </div>

            <p v-if="submission.submission_text" class="mt-3 text-sm text-gray-700 dark:text-gray-200">
              {{ submission.submission_text }}
            </p>

            <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <AppInput v-model="reviewDraft(submission).status" type="select" label="Status">
                <option value="submitted">Submitted</option>
                <option value="reviewed">Reviewed</option>
                <option value="returned">Returned</option>
              </AppInput>
              <AppInput v-model="reviewDraft(submission).score" label="Score" type="number" />
              <AppInput v-model="reviewDraft(submission).feedback" label="Feedback" type="textarea" :rows="3" class="md:col-span-3" />
            </div>

            <div class="mt-4 flex justify-end">
              <AppButton size="sm" :loading="assignStore.loading" @click="saveReview(submission)">
                Save Review
              </AppButton>
            </div>
          </div>
        </div>

        <EmptyState
          v-else
          title="No submissions yet"
          message="Students have not uploaded work for this assignment yet."
          class="py-12"
        />
      </div>
      <template #footer>
        <div class="flex items-center justify-end">
          <AppButton variant="secondary" @click="showReviewModal = false">Close</AppButton>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import type { AssignmentRecord, AssignmentSubmissionRecord } from '@/types'
import { useAssignmentsStore } from '@/stores/assignments'
import { useTimetableStore } from '@/stores/timetable'
import { useAuthStore } from '@/stores/auth'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const assignStore = useAssignmentsStore()
const timetableStore = useTimetableStore()
const authStore = useAuthStore()

const canBroadcast = computed(() => ['admin', 'teacher', 'hod'].includes(authStore.user?.role || ''))
const canSubmit = computed(() => authStore.user?.role === 'student')
const activeCount = computed(() => assignStore.assignments.filter((assignment) => assignment.status === 'active').length)
const overdueCount = computed(() => assignStore.assignments.filter((assignment) => assignment.status === 'overdue').length)
const submissionVolume = computed(() =>
  assignStore.assignments.reduce((total, assignment) => total + assignment.submission_count, 0),
)

const filters = reactive({
  class_name: '',
  status: '',
})
const resourceFilters = reactive({
  class_name: '',
  subject: '',
  resource_type: '',
})

const showCreateModal = ref(false)
const showSubmissionModal = ref(false)
const showReviewModal = ref(false)
const showResourceModal = ref(false)
const activeSubmissionAssignment = ref<AssignmentRecord | null>(null)
const activeReviewAssignment = ref<AssignmentRecord | null>(null)

const createForm = reactive({
  title: '',
  description: '',
  class_name: '',
  subject: '',
  due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  resource_url: '',
})

const submissionForm = reactive({
  submission_text: '',
  attachment_url: '',
})
const resourceForm = reactive({
  title: '',
  description: '',
  class_name: '',
  subject: '',
  resource_type: 'document' as 'document' | 'worksheet' | 'video' | 'link',
  assignment_id: '',
  url: '',
})

const reviewDrafts = ref<Record<number, { status: 'submitted' | 'reviewed' | 'returned'; score: string; feedback: string }>>({})

const reviewSubmissions = computed(() => {
  if (!activeReviewAssignment.value) return []
  return assignStore.submissionsByAssignment[activeReviewAssignment.value.id] || []
})

function statusPillClass(status: AssignmentRecord['status']) {
  if (status === 'completed') {
    return 'rounded-lg bg-gray-100 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:bg-gray-700 dark:text-gray-300'
  }
  if (status === 'overdue') {
    return 'rounded-lg bg-rose-50 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-rose-600 dark:bg-rose-900/30 dark:text-rose-300'
  }
  if (status === 'archived') {
    return 'rounded-lg bg-amber-50 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-amber-600 dark:bg-amber-900/30 dark:text-amber-300'
  }
  return 'rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300'
}

function formatRelativeDate(dateStr: string) {
  const target = new Date(dateStr)
  const today = new Date()
  target.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  const diff = Math.round((target.getTime() - today.getTime()) / 86400000)
  if (diff === 0) return 'today'
  if (diff === 1) return 'tomorrow'
  if (diff === -1) return 'yesterday'
  if (diff < 0) return `${Math.abs(diff)} days ago`
  return `in ${diff} days`
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

async function refreshAssignments() {
  await assignStore.loadAssignments({
    page: 1,
    per_page: 100,
    class_name: filters.class_name || undefined,
    status: (filters.status || undefined) as 'active' | 'completed' | 'archived' | undefined,
  })
}

async function refreshResources() {
  await assignStore.loadResources({
    page: 1,
    per_page: 100,
    class_name: resourceFilters.class_name || undefined,
    subject: resourceFilters.subject || undefined,
    resource_type: (resourceFilters.resource_type || undefined) as 'document' | 'worksheet' | 'video' | 'link' | undefined,
  })
}

function clearFilters() {
  filters.class_name = ''
  filters.status = ''
  void refreshAssignments()
}

function clearResourceFilters() {
  resourceFilters.class_name = ''
  resourceFilters.subject = ''
  resourceFilters.resource_type = ''
  void refreshResources()
}

function openCreateModal() {
  createForm.title = ''
  createForm.description = ''
  createForm.class_name = ''
  createForm.subject = ''
  createForm.due_date = new Date(Date.now() + 86400000).toISOString().split('T')[0]
  createForm.resource_url = ''
  showCreateModal.value = true
}

function openResourceModal() {
  resourceForm.title = ''
  resourceForm.description = ''
  resourceForm.class_name = ''
  resourceForm.subject = ''
  resourceForm.resource_type = 'document'
  resourceForm.assignment_id = ''
  resourceForm.url = ''
  showResourceModal.value = true
}

async function saveAssignment() {
  if (!createForm.title || !createForm.class_name || !createForm.subject || !createForm.due_date) return
  await assignStore.addAssignment({
    title: createForm.title,
    description: createForm.description || null,
    class_name: createForm.class_name,
    subject: createForm.subject,
    due_date: createForm.due_date,
    resource_url: createForm.resource_url || null,
  })
  showCreateModal.value = false
  await refreshAssignments()
}

async function saveResource() {
  if (!resourceForm.title || !resourceForm.class_name || !resourceForm.subject || !resourceForm.url) return
  await assignStore.addResource({
    title: resourceForm.title,
    description: resourceForm.description || null,
    class_name: resourceForm.class_name,
    subject: resourceForm.subject,
    resource_type: resourceForm.resource_type,
    assignment_id: resourceForm.assignment_id ? Number(resourceForm.assignment_id) : null,
    url: resourceForm.url,
  })
  showResourceModal.value = false
  await refreshResources()
}

function openSubmissionModal(assignment: AssignmentRecord) {
  activeSubmissionAssignment.value = assignment
  submissionForm.submission_text = assignment.my_submission?.submission_text || ''
  submissionForm.attachment_url = assignment.my_submission?.attachment_url || ''
  showSubmissionModal.value = true
}

async function saveSubmission() {
  if (!activeSubmissionAssignment.value) return
  await assignStore.submitAssignment(activeSubmissionAssignment.value.id, {
    submission_text: submissionForm.submission_text || null,
    attachment_url: submissionForm.attachment_url || null,
  })
  showSubmissionModal.value = false
  await refreshAssignments()
}

async function openReviewModal(assignment: AssignmentRecord) {
  activeReviewAssignment.value = assignment
  showReviewModal.value = true
  reviewDrafts.value = {}
  await assignStore.loadSubmissions(assignment.id)
}

function reviewDraft(submission: AssignmentSubmissionRecord) {
  if (!reviewDrafts.value[submission.id]) {
    reviewDrafts.value[submission.id] = {
      status: submission.status,
      score: submission.score === null ? '' : String(submission.score),
      feedback: submission.feedback || '',
    }
  }
  return reviewDrafts.value[submission.id]
}

async function saveReview(submission: AssignmentSubmissionRecord) {
  if (!activeReviewAssignment.value) return
  const draft = reviewDraft(submission)
  await assignStore.reviewSubmission(activeReviewAssignment.value.id, submission.id, {
    status: draft.status,
    score: draft.score === '' ? null : Number(draft.score),
    feedback: draft.feedback || null,
  })
  await assignStore.loadSubmissions(activeReviewAssignment.value.id)
}

async function markCompleted(id: number) {
  await assignStore.updateStatus(id, 'completed')
  await refreshAssignments()
}

async function confirmDelete(id: number) {
  if (!window.confirm('Delete this assignment?')) return
  await assignStore.deleteAssignment(id)
}

onMounted(async () => {
  await refreshAssignments()
  await refreshResources()
})
</script>

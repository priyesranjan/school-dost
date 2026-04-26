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
            People Operations
          </div>
          <h1 class="mt-3 text-4xl font-black tracking-tight text-gray-900 dark:text-white">HR Operations</h1>
          <p class="mt-1 text-sm font-medium text-indigo-600/70 dark:text-indigo-300/60">
            Manage leave approvals, track current absences, and keep performance reviews in one place.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <AppButton variant="secondary" :loading="loading" @click="loadWorkspace">Refresh</AppButton>
          <AppButton @click="openLeaveModal">Request Leave</AppButton>
          <AppButton v-if="canManageHr" @click="openAppraisalModal()">New Appraisal</AppButton>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
      <div class="rounded-3xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-800/50">
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Pending Leave</p>
        <p class="mt-2 text-3xl font-black text-gray-900 dark:text-white">{{ summary.pending_leave_requests }}</p>
      </div>
      <div class="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-6 dark:border-emerald-900/30 dark:bg-emerald-900/10">
        <p class="text-[10px] font-black uppercase tracking-widest text-emerald-600/70 dark:text-emerald-400">Approved Leave</p>
        <p class="mt-2 text-3xl font-black text-emerald-600 dark:text-emerald-400">{{ summary.approved_leave_requests }}</p>
      </div>
      <div class="rounded-3xl border border-amber-100 bg-amber-50/40 p-6 dark:border-amber-900/30 dark:bg-amber-900/10">
        <p class="text-[10px] font-black uppercase tracking-widest text-amber-600/70 dark:text-amber-400">Currently Away</p>
        <p class="mt-2 text-3xl font-black text-amber-600 dark:text-amber-400">{{ summary.staff_currently_on_leave }}</p>
      </div>
      <div class="rounded-3xl border border-indigo-100 bg-indigo-50/40 p-6 dark:border-indigo-900/30 dark:bg-indigo-900/10">
        <p class="text-[10px] font-black uppercase tracking-widest text-indigo-600/70 dark:text-indigo-400">Published Reviews</p>
        <p class="mt-2 text-3xl font-black text-indigo-600 dark:text-indigo-400">{{ summary.published_appraisals }}</p>
      </div>
      <div class="rounded-3xl border border-gray-200 bg-gray-50/70 p-6 dark:border-gray-700 dark:bg-gray-900/20">
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Draft Reviews</p>
        <p class="mt-2 text-3xl font-black text-gray-700 dark:text-gray-200">{{ summary.draft_appraisals }}</p>
      </div>
    </div>

    <AppCard title="Leave Desk" class="shadow-sm border-none shadow-2xl">
      <div class="grid grid-cols-1 gap-4 px-6 pt-6 md:grid-cols-4">
        <AppInput v-if="canManageHr" v-model="leaveFilters.staff_id" type="select" label="Staff">
          <option value="">All Staff</option>
          <option v-for="member in staffOptions" :key="member.id" :value="String(member.id)">{{ member.name }}</option>
        </AppInput>
        <AppInput v-model="leaveFilters.status" type="select" label="Leave Status">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </AppInput>
        <div class="flex items-end gap-3 md:col-span-2">
          <AppButton @click="loadLeaveRequests" :loading="loading">Apply Filters</AppButton>
          <AppButton variant="secondary" @click="resetLeaveFilters">Reset</AppButton>
        </div>
      </div>

      <div class="mt-6 overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50/40 dark:border-gray-700 dark:bg-gray-800/40">
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Staff</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Leave Window</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Type</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Reason</th>
              <th class="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
            <tr v-for="item in leaveRequests" :key="item.id">
              <td class="px-6 py-4">
                <p class="font-black text-gray-900 dark:text-white">{{ item.staff_name || 'Unlinked staff' }}</p>
                <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">{{ item.department || item.staff_role || 'Staff' }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="font-bold text-gray-800 dark:text-gray-200">{{ item.start_date }} to {{ item.end_date }}</p>
                <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">{{ item.duration_days }} day(s)</p>
              </td>
              <td class="px-6 py-4 font-bold text-gray-700 dark:text-gray-200">{{ item.leave_type }}</td>
              <td class="px-6 py-4">
                <span :class="leaveStatusClass(item.status)">{{ item.status }}</span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                <div class="max-w-[280px] truncate">{{ item.reason || 'No note attached' }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="flex justify-end gap-2">
                  <AppButton
                    v-if="canManageHr && (item.status === 'pending' || item.status === 'approved')"
                    size="sm"
                    variant="secondary"
                    @click="openLeaveReviewModal(item)"
                  >
                    Review
                  </AppButton>
                  <AppButton
                    v-if="!canManageHr && item.status === 'pending'"
                    size="sm"
                    variant="secondary"
                    @click="cancelLeave(item.id)"
                  >
                    Cancel
                  </AppButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <EmptyState
        v-if="!leaveRequests.length"
        title="No leave records"
        message="Leave activity will appear here once requests start flowing."
        class="py-16"
      />
    </AppCard>

    <AppCard title="Performance Appraisals" class="shadow-sm border-none shadow-2xl">
      <div class="grid grid-cols-1 gap-4 px-6 pt-6 md:grid-cols-4">
        <AppInput v-if="canManageHr" v-model="appraisalFilters.staff_id" type="select" label="Staff">
          <option value="">All Staff</option>
          <option v-for="member in staffOptions" :key="member.id" :value="String(member.id)">{{ member.name }}</option>
        </AppInput>
        <AppInput v-model="appraisalFilters.status" type="select" label="Review Status">
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </AppInput>
        <div class="flex items-end gap-3 md:col-span-2">
          <AppButton @click="loadAppraisals" :loading="loading">Apply Filters</AppButton>
          <AppButton variant="secondary" @click="resetAppraisalFilters">Reset</AppButton>
        </div>
      </div>

      <div class="mt-6 overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50/40 dark:border-gray-700 dark:bg-gray-800/40">
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Staff</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Review Cycle</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Rating</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Reviewer</th>
              <th class="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
            <tr v-for="item in appraisals" :key="item.id">
              <td class="px-6 py-4">
                <p class="font-black text-gray-900 dark:text-white">{{ item.staff_name || 'Unlinked staff' }}</p>
                <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">{{ item.department || item.staff_role || 'Staff' }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="font-bold text-gray-800 dark:text-gray-200">{{ item.review_period }}</p>
                <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">{{ item.review_date }}</p>
              </td>
              <td class="px-6 py-4">
                <span class="rounded-lg bg-indigo-50 px-2 py-1 text-xs font-black text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                  {{ item.overall_rating.toFixed(1) }} / 5
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="appraisalStatusClass(item.status)">{{ item.status }}</span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{{ item.reviewer_name || 'System' }}</td>
              <td class="px-6 py-4">
                <div class="flex justify-end gap-2">
                  <AppButton v-if="canManageHr" size="sm" variant="secondary" @click="openAppraisalModal(item)">Edit</AppButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <EmptyState
        v-if="!appraisals.length"
        title="No appraisals recorded"
        message="Performance reviews will appear here once the first cycle is published."
        class="py-16"
      />
    </AppCard>

    <AppModal v-model="showLeaveModal" title="Leave Request" size="md">
      <form class="space-y-5" @submit.prevent="saveLeaveRequest">
        <AppInput v-if="canManageHr" v-model="leaveForm.staff_id" type="select" label="Staff Member">
          <option value="">Select Staff</option>
          <option v-for="member in staffOptions" :key="member.id" :value="String(member.id)">{{ member.name }}</option>
        </AppInput>
        <AppInput v-model="leaveForm.leave_type" type="select" label="Leave Type">
          <option value="Sick Leave">Sick Leave</option>
          <option value="Casual Leave">Casual Leave</option>
          <option value="Emergency Leave">Emergency Leave</option>
          <option value="Conference Leave">Conference Leave</option>
          <option value="Unpaid Leave">Unpaid Leave</option>
        </AppInput>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <AppInput v-model="leaveForm.start_date" type="date" label="Start Date" />
          <AppInput v-model="leaveForm.end_date" type="date" label="End Date" />
        </div>
        <AppInput v-model="leaveForm.reason" type="textarea" label="Reason" :rows="4" />
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showLeaveModal = false">Cancel</AppButton>
          <AppButton :loading="loading" @click="saveLeaveRequest">Submit Request</AppButton>
        </div>
      </template>
    </AppModal>

    <AppModal v-model="showLeaveReviewModal" title="Review Leave Request" size="md">
      <div v-if="selectedLeaveRequest" class="space-y-5">
        <div class="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/30">
          <p class="text-sm font-black text-gray-900 dark:text-white">{{ selectedLeaveRequest.staff_name }}</p>
          <p class="mt-1 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            {{ selectedLeaveRequest.leave_type }} · {{ selectedLeaveRequest.start_date }} to {{ selectedLeaveRequest.end_date }}
          </p>
        </div>
        <AppInput v-model="leaveReviewForm.status" type="select" label="Decision">
          <option value="approved">Approve</option>
          <option value="rejected">Reject</option>
          <option value="completed">Mark Completed</option>
        </AppInput>
        <AppInput v-model="leaveReviewForm.decision_note" type="textarea" label="Decision Note" :rows="4" />
      </div>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showLeaveReviewModal = false">Close</AppButton>
          <AppButton :loading="loading" @click="saveLeaveReview">Save Decision</AppButton>
        </div>
      </template>
    </AppModal>

    <AppModal v-model="showAppraisalModal" :title="editingAppraisalId ? 'Edit Appraisal' : 'Create Appraisal'" size="lg">
      <form class="space-y-5" @submit.prevent="saveAppraisal">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <AppInput v-model="appraisalForm.staff_id" type="select" label="Staff Member">
            <option value="">Select Staff</option>
            <option v-for="member in staffOptions" :key="member.id" :value="String(member.id)">{{ member.name }}</option>
          </AppInput>
          <AppInput v-model="appraisalForm.review_period" label="Review Period" placeholder="Q1 2026" />
        </div>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <AppInput v-model="appraisalForm.review_date" type="date" label="Review Date" />
          <AppInput v-model="appraisalForm.overall_rating" type="number" label="Overall Rating" />
          <AppInput v-model="appraisalForm.status" type="select" label="Status">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </AppInput>
        </div>
        <AppInput v-model="appraisalForm.strengths" type="textarea" label="Strengths" :rows="3" />
        <AppInput v-model="appraisalForm.improvement_areas" type="textarea" label="Improvement Areas" :rows="3" />
        <AppInput v-model="appraisalForm.goals" type="textarea" label="Goals & Next Steps" :rows="3" />
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showAppraisalModal = false">Cancel</AppButton>
          <AppButton :loading="loading" @click="saveAppraisal">{{ editingAppraisalId ? 'Update Review' : 'Save Review' }}</AppButton>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import type { HrSummary, LeaveRequestRecord, StaffAppraisalRecord } from '@/types'
import { hrService } from '@/services/hrService'
import { useToastStore } from '@/stores/toast'
import { useAuthStore } from '@/stores/auth'
import { useStaffStore } from '@/stores/staff'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const toast = useToastStore()
const authStore = useAuthStore()
const staffStore = useStaffStore()

const canManageHr = computed(() => ['admin', 'hod'].includes(authStore.user?.role || ''))
const staffOptions = computed(() => [...staffStore.staffMembers].sort((a, b) => a.name.localeCompare(b.name)))

const loading = ref(false)
const summary = reactive<HrSummary>({
  pending_leave_requests: 0,
  approved_leave_requests: 0,
  staff_currently_on_leave: 0,
  published_appraisals: 0,
  draft_appraisals: 0,
})
const leaveRequests = ref<LeaveRequestRecord[]>([])
const appraisals = ref<StaffAppraisalRecord[]>([])

const leaveFilters = reactive({
  staff_id: '',
  status: '',
})

const appraisalFilters = reactive({
  staff_id: '',
  status: '',
})

const showLeaveModal = ref(false)
const showLeaveReviewModal = ref(false)
const showAppraisalModal = ref(false)
const selectedLeaveRequest = ref<LeaveRequestRecord | null>(null)
const editingAppraisalId = ref<number | null>(null)

const leaveForm = reactive({
  staff_id: '',
  leave_type: 'Sick Leave',
  start_date: new Date().toISOString().split('T')[0],
  end_date: new Date().toISOString().split('T')[0],
  reason: '',
})

const leaveReviewForm = reactive({
  status: 'approved' as 'approved' | 'rejected' | 'completed',
  decision_note: '',
})

const appraisalForm = reactive({
  staff_id: '',
  review_period: '',
  review_date: new Date().toISOString().split('T')[0],
  overall_rating: '4.0',
  strengths: '',
  improvement_areas: '',
  goals: '',
  status: 'draft' as 'draft' | 'published',
})

function leaveStatusClass(status: LeaveRequestRecord['status']) {
  if (status === 'approved') return 'rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300'
  if (status === 'pending') return 'rounded-lg bg-amber-50 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-amber-600 dark:bg-amber-900/30 dark:text-amber-300'
  if (status === 'completed') return 'rounded-lg bg-indigo-50 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300'
  return 'rounded-lg bg-rose-50 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-rose-600 dark:bg-rose-900/30 dark:text-rose-300'
}

function appraisalStatusClass(status: StaffAppraisalRecord['status']) {
  if (status === 'published') return 'rounded-lg bg-indigo-50 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300'
  return 'rounded-lg bg-gray-100 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:bg-gray-700 dark:text-gray-300'
}

async function loadSummary() {
  Object.assign(summary, await hrService.getSummary())
}

async function loadLeaveRequests() {
  const data = await hrService.listLeaveRequests({
    page: 1,
    per_page: 100,
    staff_id: leaveFilters.staff_id ? Number(leaveFilters.staff_id) : undefined,
    status: (leaveFilters.status || undefined) as LeaveRequestRecord['status'] | undefined,
  })
  leaveRequests.value = data.items
}

async function loadAppraisals() {
  const data = await hrService.listAppraisals({
    page: 1,
    per_page: 100,
    staff_id: appraisalFilters.staff_id ? Number(appraisalFilters.staff_id) : undefined,
    status: (appraisalFilters.status || undefined) as StaffAppraisalRecord['status'] | undefined,
  })
  appraisals.value = data.items
}

async function loadWorkspace() {
  loading.value = true
  try {
    if (canManageHr.value) {
      await staffStore.fetchStaff({ page: 1, per_page: 200 })
    }
    await Promise.all([loadSummary(), loadLeaveRequests(), loadAppraisals()])
  } catch {
    toast.error('Failed to load HR workspace')
  } finally {
    loading.value = false
  }
}

function resetLeaveFilters() {
  leaveFilters.staff_id = ''
  leaveFilters.status = ''
  void loadLeaveRequests()
}

function resetAppraisalFilters() {
  appraisalFilters.staff_id = ''
  appraisalFilters.status = ''
  void loadAppraisals()
}

function openLeaveModal() {
  leaveForm.staff_id = ''
  leaveForm.leave_type = 'Sick Leave'
  leaveForm.start_date = new Date().toISOString().split('T')[0]
  leaveForm.end_date = new Date().toISOString().split('T')[0]
  leaveForm.reason = ''
  showLeaveModal.value = true
}

async function saveLeaveRequest() {
  loading.value = true
  try {
    await hrService.createLeaveRequest({
      staff_id: canManageHr.value && leaveForm.staff_id ? Number(leaveForm.staff_id) : undefined,
      leave_type: leaveForm.leave_type,
      start_date: leaveForm.start_date,
      end_date: leaveForm.end_date,
      reason: leaveForm.reason || null,
    })
    toast.success('Leave request submitted')
    showLeaveModal.value = false
    await loadWorkspace()
  } catch {
    toast.error('Failed to submit leave request')
  } finally {
    loading.value = false
  }
}

function openLeaveReviewModal(item: LeaveRequestRecord) {
  selectedLeaveRequest.value = item
  leaveReviewForm.status = item.status === 'approved' ? 'completed' : 'approved'
  leaveReviewForm.decision_note = item.decision_note || ''
  showLeaveReviewModal.value = true
}

async function saveLeaveReview() {
  if (!selectedLeaveRequest.value) return
  loading.value = true
  try {
    await hrService.reviewLeaveRequest(selectedLeaveRequest.value.id, {
      status: leaveReviewForm.status,
      decision_note: leaveReviewForm.decision_note || null,
    })
    toast.success('Leave request updated')
    showLeaveReviewModal.value = false
    await loadWorkspace()
  } catch {
    toast.error('Failed to update leave request')
  } finally {
    loading.value = false
  }
}

async function cancelLeave(id: number) {
  loading.value = true
  try {
    await hrService.cancelLeaveRequest(id)
    toast.success('Leave request cancelled')
    await loadWorkspace()
  } catch {
    toast.error('Failed to cancel leave request')
  } finally {
    loading.value = false
  }
}

function openAppraisalModal(item?: StaffAppraisalRecord) {
  editingAppraisalId.value = item?.id || null
  appraisalForm.staff_id = item ? String(item.staff_id) : ''
  appraisalForm.review_period = item?.review_period || ''
  appraisalForm.review_date = item?.review_date || new Date().toISOString().split('T')[0]
  appraisalForm.overall_rating = item ? String(item.overall_rating) : '4.0'
  appraisalForm.strengths = item?.strengths || ''
  appraisalForm.improvement_areas = item?.improvement_areas || ''
  appraisalForm.goals = item?.goals || ''
  appraisalForm.status = item?.status || 'draft'
  showAppraisalModal.value = true
}

async function saveAppraisal() {
  if (!appraisalForm.staff_id) {
    toast.warning('Please choose a staff member')
    return
  }

  loading.value = true
  try {
    const payload = {
      staff_id: Number(appraisalForm.staff_id),
      review_period: appraisalForm.review_period,
      review_date: appraisalForm.review_date,
      overall_rating: Number(appraisalForm.overall_rating),
      strengths: appraisalForm.strengths || null,
      improvement_areas: appraisalForm.improvement_areas || null,
      goals: appraisalForm.goals || null,
      status: appraisalForm.status,
    }

    if (editingAppraisalId.value) {
      await hrService.updateAppraisal(editingAppraisalId.value, payload)
      toast.success('Appraisal updated')
    } else {
      await hrService.createAppraisal(payload)
      toast.success('Appraisal created')
    }

    showAppraisalModal.value = false
    await loadWorkspace()
  } catch {
    toast.error(editingAppraisalId.value ? 'Failed to update appraisal' : 'Failed to create appraisal')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadWorkspace()
})
</script>

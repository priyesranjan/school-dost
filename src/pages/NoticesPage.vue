<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Draft" :value="noticeStore.draftNotices.length" icon="📝" icon-bg="bg-blue-50" />
        <StatCard title="Approved" :value="noticeStore.approvedNotices.length" icon="✅" icon-bg="bg-green-50" />
        <StatCard title="Rejected" :value="noticeStore.rejectedNotices.length" icon="↩" icon-bg="bg-rose-50" />
      </div>
      <AppButton @click="showModal = true">+ Create Notice</AppButton>
    </div>

    <AppCard title="Notice Board" :no-padding="true">
      <div class="divide-y divide-gray-50 dark:divide-gray-700">
        <div v-for="n in noticeStore.notices" :key="n.id" class="px-6 py-4">
          <div class="flex flex-wrap items-center gap-2">
            <p class="text-base font-semibold text-gray-900 dark:text-white">{{ n.title }}</p>
            <StatusBadge :color="n.audience === 'all' ? 'blue' : 'yellow'">
              {{ n.audience === 'all' ? 'All Classes' : n.class_name }}
            </StatusBadge>
            <StatusBadge :color="n.status === 'draft' ? 'gray' : n.status === 'approved' ? 'yellow' : n.status === 'scheduled' ? 'blue' : n.status === 'rejected' ? 'red' : 'green'">
              {{ n.status }}
            </StatusBadge>
            <StatusBadge v-if="n.sms_sent" color="green">SMS Sent</StatusBadge>
          </div>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">{{ n.message }}</p>
          <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">{{ n.created_at }} · by {{ n.created_by }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Revision {{ n.revision_no }}</p>
          <p v-if="n.approved_by" class="text-xs text-gray-500 dark:text-gray-400">Approved by {{ n.approved_by }} on {{ n.approved_at }}</p>
          <p v-if="n.rejected_by" class="text-xs text-rose-600 dark:text-rose-300">Rejected by {{ n.rejected_by }} on {{ n.rejected_at }}</p>
          <p v-if="n.review_comment" class="text-xs text-gray-500 dark:text-gray-400">Comment: {{ n.review_comment }}</p>
          <p v-if="n.publish_at" class="text-xs text-gray-500 dark:text-gray-400">Scheduled for {{ n.publish_at }}</p>
          <div class="mt-3 flex flex-wrap gap-2">
            <AppButton
              v-if="n.status === 'draft' && noticeStore.canApprove(auth.user?.role)"
              size="sm"
              variant="secondary"
              @click="handleApprove(n.id)"
            >
              Approve
            </AppButton>
            <AppButton
              v-if="n.status === 'draft' && noticeStore.canApprove(auth.user?.role)"
              size="sm"
              variant="secondary"
              @click="openReviewModal(n.id, 'reject')"
            >
              Reject
            </AppButton>
            <AppButton
              v-if="n.status === 'draft'"
              size="sm"
              variant="secondary"
              @click="openEditModal(n.id)"
            >
              Edit Draft
            </AppButton>
            <AppButton
              v-if="n.status === 'approved' && noticeStore.canPublish(auth.user?.role)"
              size="sm"
              @click="handlePublishNotice(n.id)"
            >
              Publish
            </AppButton>
            <AppButton
              v-if="n.status === 'rejected'"
              size="sm"
              variant="secondary"
              @click="openReviewModal(n.id, 'rework')"
            >
              Submit Rework
            </AppButton>
            <AppButton
              v-if="n.status === 'approved' && noticeStore.canPublish(auth.user?.role)"
              size="sm"
              variant="secondary"
              @click="openScheduleModal(n.id)"
            >
              Schedule
            </AppButton>
          </div>
        </div>
      </div>
      <EmptyState v-if="!noticeStore.notices.length" title="No notices" message="Create your first notice" />
    </AppCard>

    <AppModal v-model="showModal" title="Create Notice Draft" size="md">
      <form @submit.prevent="handleCreate" class="space-y-4">
        <AppInput v-model="form.title" label="Title" placeholder="e.g. Holiday Notice" required />
        <AppInput v-model="form.message" type="textarea" label="Message" :rows="4" required />
        <AppInput v-model="form.audience" type="select" label="Audience" required>
          <option value="all">All Classes</option>
          <option value="class">Specific Class</option>
        </AppInput>
        <AppInput v-if="form.audience === 'class'" v-model="form.class_name" type="select" label="Class" required>
          <option v-for="cls in studentStore.classes" :key="cls" :value="cls">{{ cls }}</option>
        </AppInput>
        <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <input v-model="form.send_sms" type="checkbox" class="h-4 w-4 rounded border-gray-300" />
          Send SMS when publishing
        </label>
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showModal = false">Cancel</AppButton>
          <AppButton @click="handleCreate">Save Draft</AppButton>
        </div>
      </template>
    </AppModal>

    <AppModal v-model="showScheduleModal" title="Schedule Notice" size="sm">
      <form @submit.prevent="handleSchedule" class="space-y-4">
        <AppInput v-model="scheduleAt" type="datetime-local" label="Publish At" required />
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showScheduleModal = false">Cancel</AppButton>
          <AppButton @click="handleSchedule">Schedule</AppButton>
        </div>
      </template>
    </AppModal>

    <AppModal v-model="showReviewModal" :title="reviewMode === 'reject' ? 'Reject Notice' : 'Submit Rework'" size="sm">
      <form @submit.prevent="handleReviewAction" class="space-y-4">
        <AppInput
          v-model="reviewComment"
          type="textarea"
          :label="reviewMode === 'reject' ? 'Rejection Comment' : 'Rework Summary'"
          :rows="4"
          required
        />
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showReviewModal = false">Cancel</AppButton>
          <AppButton @click="handleReviewAction">{{ reviewMode === 'reject' ? 'Reject' : 'Resubmit' }}</AppButton>
        </div>
      </template>
    </AppModal>

    <AppModal v-model="showEditModal" title="Edit Draft Notice" size="md">
      <form @submit.prevent="handleSaveDraftEdit" class="space-y-4">
        <AppInput v-model="editForm.title" label="Title" required />
        <AppInput v-model="editForm.message" type="textarea" label="Message" :rows="4" required />
        <AppInput v-model="editForm.audience" type="select" label="Audience" required>
          <option value="all">All Classes</option>
          <option value="class">Specific Class</option>
        </AppInput>
        <AppInput v-if="editForm.audience === 'class'" v-model="editForm.class_name" type="select" label="Class" required>
          <option v-for="cls in studentStore.classes" :key="cls" :value="cls">{{ cls }}</option>
        </AppInput>
        <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <input v-model="editForm.send_sms" type="checkbox" class="h-4 w-4 rounded border-gray-300" />
          Send SMS when publishing
        </label>
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showEditModal = false">Cancel</AppButton>
          <AppButton @click="handleSaveDraftEdit">Save Draft</AppButton>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNoticeStore } from '@/stores/notices'
import { useStudentStore } from '@/stores/students'
import { useToastStore } from '@/stores/toast'
import StatCard from '@/components/ui/StatCard.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const auth = useAuthStore()
const toast = useToastStore()
const studentStore = useStudentStore()
const noticeStore = useNoticeStore()

const showModal = ref(false)
const showScheduleModal = ref(false)
const showReviewModal = ref(false)
const showEditModal = ref(false)
const schedulingNoticeId = ref<number | null>(null)
const reviewNoticeId = ref<number | null>(null)
const editingNoticeId = ref<number | null>(null)
const reviewMode = ref<'reject' | 'rework'>('reject')
const scheduleAt = ref('')
const reviewComment = ref('')
const form = reactive({
  title: '',
  message: '',
  audience: 'all' as 'all' | 'class',
  class_name: '',
  send_sms: true,
})

const editForm = reactive({
  title: '',
  message: '',
  audience: 'all' as 'all' | 'class',
  class_name: '',
  send_sms: true,
})

onMounted(() => {
  noticeStore.startAutoPublish()
})

function handleCreate() {
  if (!form.title.trim() || !form.message.trim()) {
    toast.warning('Please enter title and message')
    return
  }
  if (form.audience === 'class' && !form.class_name) {
    toast.warning('Please select a class')
    return
  }

  noticeStore.createNotice(
    {
      title: form.title.trim(),
      message: form.message.trim(),
      audience: form.audience,
      class_name: form.audience === 'class' ? form.class_name : null,
      created_by: auth.user?.name || 'Admin',
      send_sms_on_publish: form.send_sms,
    }
  )

  showModal.value = false
  form.title = ''
  form.message = ''
  form.audience = 'all'
  form.class_name = ''
  form.send_sms = true
}

function handleApprove(id: number) {
  if (!auth.user) return
  noticeStore.approveNotice(id, auth.user.name)
}

function handlePublishNotice(id: number) {
  noticeStore.publishNotice(id, form.send_sms)
}

function openScheduleModal(id: number) {
  schedulingNoticeId.value = id
  scheduleAt.value = ''
  showScheduleModal.value = true
}

function openReviewModal(id: number, mode: 'reject' | 'rework') {
  reviewNoticeId.value = id
  reviewMode.value = mode
  reviewComment.value = ''
  showReviewModal.value = true
}

function handleSchedule() {
  if (!schedulingNoticeId.value || !scheduleAt.value) {
    toast.warning('Please choose a schedule date and time')
    return
  }
  const ok = noticeStore.scheduleNotice(schedulingNoticeId.value, scheduleAt.value)
  if (!ok) {
    toast.warning('Schedule time must be in the future')
    return
  }
  showScheduleModal.value = false
  schedulingNoticeId.value = null
}

function openEditModal(id: number) {
  const notice = noticeStore.notices.find((n) => n.id === id)
  if (!notice || notice.status !== 'draft') return
  editingNoticeId.value = id
  editForm.title = notice.title
  editForm.message = notice.message
  editForm.audience = notice.audience
  editForm.class_name = notice.class_name || ''
  editForm.send_sms = notice.send_sms_on_publish
  showEditModal.value = true
}

function handleSaveDraftEdit() {
  if (!editingNoticeId.value || !auth.user) return
  if (!editForm.title.trim() || !editForm.message.trim()) {
    toast.warning('Please enter title and message')
    return
  }
  if (editForm.audience === 'class' && !editForm.class_name) {
    toast.warning('Please select a class')
    return
  }

  const ok = noticeStore.updateDraftNotice(
    editingNoticeId.value,
    {
      title: editForm.title,
      message: editForm.message,
      audience: editForm.audience,
      class_name: editForm.audience === 'class' ? editForm.class_name : null,
      send_sms_on_publish: editForm.send_sms,
    },
    auth.user.name,
  )

  if (!ok) {
    toast.warning('Only draft notices can be edited')
    return
  }

  showEditModal.value = false
  editingNoticeId.value = null
}

function handleReviewAction() {
  if (!reviewNoticeId.value || !reviewComment.value.trim() || !auth.user) {
    toast.warning('Please enter a comment')
    return
  }

  if (reviewMode.value === 'reject') {
    const ok = noticeStore.rejectNotice(reviewNoticeId.value, auth.user.name, reviewComment.value)
    if (!ok) {
      toast.warning('Unable to reject notice')
      return
    }
  } else {
    const ok = noticeStore.resubmitRejectedNotice(reviewNoticeId.value, auth.user.name, reviewComment.value)
    if (!ok) {
      toast.warning('Unable to resubmit notice')
      return
    }
  }

  showReviewModal.value = false
  reviewNoticeId.value = null
  reviewComment.value = ''
}
</script>

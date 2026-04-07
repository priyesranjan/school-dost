import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Notice } from '@/types'
import { loadFromStorage, saveToStorage } from '@/utils/storage'
import { useSmsStore } from './sms'
import { useStudentStore } from './students'
import { useToastStore } from './toast'
import { useAuditStore } from './audit'

const demoNotices: Notice[] = [
  {
    id: 1,
    title: 'Parent-Teacher Meeting',
    message: 'PTM will be held on Saturday at 10:00 AM in school auditorium.',
    audience: 'all',
    class_name: null,
    created_at: '2026-04-01',
    created_by: 'Admin User',
    status: 'published',
    approved_by: 'Admin User',
    approved_at: '2026-04-01',
    rejected_by: null,
    rejected_at: null,
    review_comment: null,
    revision_no: 1,
    approved_title: 'Parent-Teacher Meeting',
    approved_message: 'PTM will be held on Saturday at 10:00 AM in school auditorium.',
    publish_at: null,
    published_at: '2026-04-01',
    send_sms_on_publish: true,
    sms_sent: true,
  },
]

const approvalMatrix = {
  approve: ['admin', 'teacher'],
  publish: ['admin', 'receptionist'],
} as const

export const useNoticeStore = defineStore('notices', () => {
  const smsStore = useSmsStore()
  const studentStore = useStudentStore()
  const toast = useToastStore()
  const auditStore = useAuditStore()
  const saved = loadFromStorage<Notice[]>('notices')
  const notices = ref<Notice[]>((saved || demoNotices).map((n) => ({
    ...n,
    rejected_by: n.rejected_by || null,
    rejected_at: n.rejected_at || null,
    review_comment: n.review_comment || null,
    revision_no: n.revision_no || 1,
    approved_title: n.approved_title || null,
    approved_message: n.approved_message || null,
  })))
  let schedulerId: number | null = null

  watch(notices, (val) => saveToStorage('notices', val), { deep: true })

  const latestNotices = computed(() => notices.value.slice(0, 5))

  const draftNotices = computed(() => notices.value.filter((n) => n.status === 'draft'))
  const approvedNotices = computed(() => notices.value.filter((n) => n.status === 'approved'))
  const scheduledNotices = computed(() => notices.value.filter((n) => n.status === 'scheduled'))
  const publishedNotices = computed(() => notices.value.filter((n) => n.status === 'published'))
  const rejectedNotices = computed(() => notices.value.filter((n) => n.status === 'rejected'))

  function canApprove(role: string | undefined) {
    if (!role) return false
    return approvalMatrix.approve.includes(role as 'admin' | 'teacher')
  }

  function canPublish(role: string | undefined) {
    if (!role) return false
    return approvalMatrix.publish.includes(role as 'admin' | 'receptionist')
  }

  function createNotice(payload: Omit<Notice, 'id' | 'created_at' | 'sms_sent' | 'status' | 'approved_by' | 'approved_at' | 'rejected_by' | 'rejected_at' | 'review_comment' | 'revision_no' | 'approved_title' | 'approved_message' | 'publish_at' | 'published_at'>) {
    const notice: Notice = {
      ...payload,
      id: Date.now(),
      created_at: new Date().toISOString().split('T')[0],
      status: 'draft',
      approved_by: null,
      approved_at: null,
      rejected_by: null,
      rejected_at: null,
      review_comment: null,
      revision_no: 1,
      approved_title: null,
      approved_message: null,
      publish_at: null,
      published_at: null,
      sms_sent: false,
    }

    notices.value.unshift(notice)
    auditStore.addLog({
      action: 'notice_created',
      module: 'notices',
      actor_name: payload.created_by,
      actor_role: 'unknown',
      target: notice.title,
      metadata: `Audience: ${notice.audience}${notice.class_name ? ` (${notice.class_name})` : ''}`,
    })
    toast.success('Notice saved as draft')
  }

  function approveNotice(id: number, approverName: string) {
    const notice = notices.value.find((n) => n.id === id)
    if (!notice || notice.status !== 'draft') return
    notice.status = 'approved'
    notice.approved_by = approverName
    notice.approved_at = new Date().toISOString().split('T')[0]
    notice.rejected_by = null
    notice.rejected_at = null
    notice.review_comment = null
    notice.approved_title = notice.title
    notice.approved_message = notice.message
    auditStore.addLog({
      action: 'notice_approved',
      module: 'notices',
      actor_name: approverName,
      actor_role: 'approver',
      target: notice.title,
      metadata: `Approved on ${notice.approved_at}`,
    })
    toast.success('Notice approved')
  }

  function rejectNotice(id: number, reviewerName: string, comment: string) {
    const notice = notices.value.find((n) => n.id === id)
    if (!notice || notice.status !== 'draft') return false
    const trimmed = comment.trim()
    if (!trimmed) return false
    notice.status = 'rejected'
    notice.rejected_by = reviewerName
    notice.rejected_at = new Date().toISOString().split('T')[0]
    notice.review_comment = trimmed
    auditStore.addLog({
      action: 'notice_rejected',
      module: 'notices',
      actor_name: reviewerName,
      actor_role: 'approver',
      target: notice.title,
      metadata: `Comment: ${trimmed}`,
    })
    toast.warning('Notice rejected and sent for rework')
    return true
  }

  function resubmitRejectedNotice(id: number, actorName: string, reworkNote: string) {
    const notice = notices.value.find((n) => n.id === id)
    if (!notice || notice.status !== 'rejected') return false
    const trimmed = reworkNote.trim()
    if (!trimmed) return false
    notice.status = 'draft'
    notice.revision_no += 1
    notice.review_comment = `Rework update: ${trimmed}`
    notice.rejected_by = null
    notice.rejected_at = null
    notice.approved_title = null
    notice.approved_message = null
    auditStore.addLog({
      action: 'notice_resubmitted',
      module: 'notices',
      actor_name: actorName,
      actor_role: 'author',
      target: notice.title,
      metadata: `Revision ${notice.revision_no}: ${trimmed}`,
    })
    toast.success('Notice resubmitted for approval')
    return true
  }

  function publishNotice(id: number, sendSmsOverride?: boolean) {
    const notice = notices.value.find((n) => n.id === id)
    if (!notice || (notice.status !== 'approved' && notice.status !== 'scheduled')) return

    const sendSms = typeof sendSmsOverride === 'boolean' ? sendSmsOverride : notice.send_sms_on_publish

    if (sendSms) {
      const targets = notice.audience === 'all'
        ? studentStore.students
        : studentStore.students.filter((s) => s.class_name === notice.class_name)

      for (const s of targets) {
          smsStore.sendNoticeSms(
            s.phone,
            s.name,
            notice.approved_title || notice.title,
            notice.approved_message || notice.message,
          )
      }
      notice.sms_sent = true
    }

    notice.status = 'published'
    notice.published_at = new Date().toISOString().slice(0, 16)
    notice.publish_at = null
    auditStore.addLog({
      action: 'notice_published',
      module: 'notices',
      actor_name: notice.approved_by || notice.created_by,
      actor_role: 'publisher',
      target: notice.title,
      metadata: sendSms ? 'Published with SMS' : 'Published without SMS',
    })
    toast.success('Notice published')
  }

  function scheduleNotice(id: number, publishAt: string) {
    const notice = notices.value.find((n) => n.id === id)
    if (!notice || notice.status !== 'approved') return false
    if (!publishAt) return false
    if (new Date(publishAt).getTime() <= Date.now()) return false
    notice.status = 'scheduled'
    notice.publish_at = publishAt
    auditStore.addLog({
      action: 'notice_scheduled',
      module: 'notices',
      actor_name: notice.approved_by || notice.created_by,
      actor_role: 'publisher',
      target: notice.title,
      metadata: `Scheduled for ${publishAt}`,
    })
    toast.success('Notice scheduled')
    return true
  }

  function processScheduledNotices() {
    const now = Date.now()
    const due = notices.value.filter((n) => n.status === 'scheduled' && n.publish_at && new Date(n.publish_at).getTime() <= now)
    for (const n of due) {
      publishNotice(n.id)
    }
  }

  function startAutoPublish() {
    if (schedulerId !== null) return
    processScheduledNotices()
    schedulerId = window.setInterval(() => {
      processScheduledNotices()
    }, 30000)
  }

  function updateDraftNotice(id: number, updates: Pick<Notice, 'title' | 'message' | 'audience' | 'class_name' | 'send_sms_on_publish'>, actorName: string) {
    const notice = notices.value.find((n) => n.id === id)
    if (!notice) return false
    if (notice.status !== 'draft') return false

    notice.title = updates.title.trim()
    notice.message = updates.message.trim()
    notice.audience = updates.audience
    notice.class_name = updates.class_name
    notice.send_sms_on_publish = updates.send_sms_on_publish

    auditStore.addLog({
      action: 'notice_draft_updated',
      module: 'notices',
      actor_name: actorName,
      actor_role: 'author',
      target: notice.title,
      metadata: `Draft updated before approval (rev ${notice.revision_no})`,
    })
    return true
  }

  return {
    notices,
    latestNotices,
    draftNotices,
    approvedNotices,
    scheduledNotices,
    publishedNotices,
    rejectedNotices,
    canApprove,
    canPublish,
    createNotice,
    approveNotice,
    rejectNotice,
    resubmitRejectedNotice,
    publishNotice,
    scheduleNotice,
    processScheduledNotices,
    startAutoPublish,
    updateDraftNotice,
  }
})

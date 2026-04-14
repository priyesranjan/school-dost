import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { SmsLog } from '@/types'
import { useToastStore } from './toast'
import { saveToStorage, loadFromStorage } from '@/utils/storage'

export const useSmsStore = defineStore('sms', () => {
  const toast = useToastStore()
  const channelOptions = ['sms', 'whatsapp'] as const
  const templates = [
    {
      id: 'fee_due_v1',
      label: 'Fee Due Reminder',
      body: 'Dear parent, {{student}} has pending fee of Rs {{amount}}. Please clear by {{dueDate}}. - {{school}}',
    },
    {
      id: 'payment_receipt_v1',
      label: 'Payment Receipt',
      body: 'Payment received: Rs {{amount}} for {{student}}. Receipt: {{receipt}}. Thank you. - {{school}}',
    },
    {
      id: 'attendance_alert_v1',
      label: 'Attendance Alert',
      body: '{{student}} was marked absent today. Please contact class teacher for details. - {{school}}',
    },
  ] as const

  const demoLogs: SmsLog[] = [
    {
      id: 1,
      phone: '9876543210',
      student_name: 'Aarav Sharma',
      message: 'Payment of Rs 15,000 received for Tuition Fee. Receipt: RCP-2026-001. Thank you!',
      type: 'payment',
      status: 'sent',
      sent_at: '2026-04-02 10:30',
      channel: 'sms',
    },
    {
      id: 2,
      phone: '9876543211',
      student_name: 'Priya Patel',
      message: 'Payment of Rs 8,000 received for Tuition Fee. Balance due: Rs 7,000. Receipt: RCP-2026-002.',
      type: 'payment',
      status: 'sent',
      sent_at: '2026-04-01 14:15',
      channel: 'whatsapp',
    },
    {
      id: 3,
      phone: '9876543212',
      student_name: 'Rohan Gupta',
      message: 'Reminder: Tuition Fee of Rs 13,000 is due for Rohan Gupta (Class 9). Please pay before 15-Apr-2026.',
      type: 'due_reminder',
      status: 'sent',
      sent_at: '2026-04-01 09:00',
      channel: 'sms',
    },
    {
      id: 4,
      phone: '9876543214',
      student_name: 'Karan Mehta',
      message: 'Reminder: Tuition Fee of Rs 11,000 is due for Karan Mehta (Class 8). Please pay before 15-Apr-2026.',
      type: 'due_reminder',
      status: 'sent',
      sent_at: '2026-04-01 09:00',
      channel: 'whatsapp',
    },
    {
      id: 5,
      phone: '9876543216',
      student_name: 'Arjun Kumar',
      message: 'Reminder: Tuition Fee of Rs 9,000 is due for Arjun Kumar (Class 7). Please pay before 15-Apr-2026.',
      type: 'due_reminder',
      status: 'failed',
      sent_at: '2026-04-01 09:01',
      channel: 'sms',
    },
  ]
  const savedLogs = loadFromStorage<SmsLog[]>('sms_logs')
  const logs = ref<SmsLog[]>(savedLogs || [...demoLogs])
  const preferredChannel = ref<'sms' | 'whatsapp'>('whatsapp')
  const sending = ref(false)

  watch(logs, (val) => saveToStorage('sms_logs', val), { deep: true })

  const sentCount = computed(() => logs.value.filter((l) => l.status === 'sent').length)
  const failedCount = computed(() => logs.value.filter((l) => l.status === 'failed').length)
  const whatsappCount = computed(
    () => logs.value.filter((l) => (l.channel || 'sms') === 'whatsapp' && l.status === 'sent').length,
  )
  const smsCount = computed(
    () => logs.value.filter((l) => (l.channel || 'sms') === 'sms' && l.status === 'sent').length,
  )

  function templateById(templateId: string) {
    return templates.find((t) => t.id === templateId)
  }

  function applyTemplate(templateId: string, vars: Record<string, string>) {
    const tpl = templateById(templateId)
    if (!tpl) return ''
    let out: string = tpl.body
    for (const [key, val] of Object.entries(vars)) {
      out = out.replaceAll(`{{${key}}}`, val)
    }
    return out
  }

  function sendPaymentSms(
    phone: string,
    studentName: string,
    amount: number,
    feeName: string,
    receiptNumber: string,
    balance: number,
    channel: 'sms' | 'whatsapp' = preferredChannel.value,
  ) {
    const balanceText = balance > 0 ? ` Balance due: Rs ${balance.toLocaleString('en-IN')}.` : ''
    const message = `Payment of Rs ${amount.toLocaleString('en-IN')} received for ${feeName}. Receipt: ${receiptNumber}.${balanceText} Thank you!`

    const log: SmsLog = {
      id: Date.now(),
      phone,
      student_name: studentName,
      message,
      type: 'payment',
      status: 'sent',
      sent_at: new Date().toLocaleString('en-IN'),
      channel,
      template_id: 'payment_receipt_v1',
    }
    logs.value.unshift(log)
    toast.success(`${channel === 'whatsapp' ? 'WhatsApp' : 'SMS'} sent to ${phone}`)
    return log
  }

  function sendDueReminder(
    phone: string,
    studentName: string,
    amount: number,
    feeName: string,
    className: string,
    dueDate: string,
    channel: 'sms' | 'whatsapp' = preferredChannel.value,
  ) {
    const message = `Reminder: ${feeName} of Rs ${amount.toLocaleString('en-IN')} is due for ${studentName} (${className}). Please pay before ${dueDate}.`

    const log: SmsLog = {
      id: Date.now(),
      phone,
      student_name: studentName,
      message,
      type: 'due_reminder',
      status: 'sent',
      sent_at: new Date().toLocaleString('en-IN'),
      channel,
      template_id: 'fee_due_v1',
    }
    logs.value.unshift(log)
    toast.success(`Due reminder sent via ${channel === 'whatsapp' ? 'WhatsApp' : 'SMS'} to ${phone}`)
    return log
  }

  function sendBulkDueReminders(
    reminders: {
      phone: string
      studentName: string
      amount: number
      feeName: string
      className: string
      dueDate: string
    }[],
    channel: 'sms' | 'whatsapp' = preferredChannel.value,
  ) {
    sending.value = true
    let sentOk = 0
    for (const r of reminders) {
      sendDueReminder(r.phone, r.studentName, r.amount, r.feeName, r.className, r.dueDate, channel)
      sentOk++
    }
    sending.value = false
    toast.success(`${sentOk} due reminders sent via ${channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}`)
  }

  function sendCustomSms(
    phone: string,
    studentName: string,
    message: string,
    channel: 'sms' | 'whatsapp' = preferredChannel.value,
    templateId?: string,
  ) {
    const log: SmsLog = {
      id: Date.now(),
      phone,
      student_name: studentName,
      message,
      type: 'general',
      status: 'sent',
      sent_at: new Date().toLocaleString('en-IN'),
      channel,
      template_id: templateId,
    }
    logs.value.unshift(log)
    toast.success(`${channel === 'whatsapp' ? 'WhatsApp' : 'SMS'} sent to ${phone}`)
    return log
  }

  function sendTemplateMessage(
    phone: string,
    studentName: string,
    templateId: string,
    vars: Record<string, string>,
    channel: 'sms' | 'whatsapp' = preferredChannel.value,
  ) {
    const message = applyTemplate(templateId, vars)
    if (!message) {
      toast.warning('Template not found')
      return null
    }
    return sendCustomSms(phone, studentName, message, channel, templateId)
  }

  function sendCampaign(
    recipients: { phone: string; studentName: string }[],
    message: string,
    channel: 'sms' | 'whatsapp' = preferredChannel.value,
    templateId?: string,
  ) {
    if (!recipients.length) {
      toast.warning('No recipients selected')
      return
    }
    sending.value = true
    recipients.forEach((r) => {
      sendCustomSms(r.phone, r.studentName, message, channel, templateId)
    })
    sending.value = false
    toast.success(`Campaign sent to ${recipients.length} recipients via ${channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}`)
  }

  function sendNoticeSms(phone: string, studentName: string, title: string, message: string) {
    const log: SmsLog = {
      id: Date.now(),
      phone,
      student_name: studentName,
      message: `NOTICE: ${title} - ${message}`,
      type: 'notice',
      status: 'sent',
      sent_at: new Date().toLocaleString('en-IN'),
      channel: preferredChannel.value,
    }
    logs.value.unshift(log)
    return log
  }

  function sendScheduleSms(phone: string, studentName: string, message: string) {
    const log: SmsLog = {
      id: Date.now(),
      phone,
      student_name: studentName,
      message,
      type: 'schedule',
      status: 'sent',
      sent_at: new Date().toLocaleString('en-IN'),
      channel: preferredChannel.value,
    }
    logs.value.unshift(log)
    return log
  }

  function setPreferredChannel(channel: 'sms' | 'whatsapp') {
    preferredChannel.value = channel
  }

  return {
    logs,
    sending,
    templates,
    channelOptions,
    preferredChannel,
    sentCount,
    failedCount,
    whatsappCount,
    smsCount,
    setPreferredChannel,
    applyTemplate,
    sendPaymentSms,
    sendDueReminder,
    sendBulkDueReminders,
    sendCustomSms,
    sendTemplateMessage,
    sendCampaign,
    sendNoticeSms,
    sendScheduleSms,
  }
})

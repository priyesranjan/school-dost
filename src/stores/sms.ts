import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { SmsLog } from '@/types'
import { useToastStore } from './toast'
import { saveToStorage, loadFromStorage } from '@/utils/storage'

export const useSmsStore = defineStore('sms', () => {
  const toast = useToastStore()
  const demoLogs: SmsLog[] = [
    { id: 1, phone: '9876543210', student_name: 'Aarav Sharma', message: 'Payment of ₹15,000 received for Tuition Fee. Receipt: RCP-2026-001. Thank you!', type: 'payment', status: 'sent', sent_at: '2026-04-02 10:30' },
    { id: 2, phone: '9876543211', student_name: 'Priya Patel', message: 'Payment of ₹8,000 received for Tuition Fee. Balance due: ₹7,000. Receipt: RCP-2026-002.', type: 'payment', status: 'sent', sent_at: '2026-04-01 14:15' },
    { id: 3, phone: '9876543212', student_name: 'Rohan Gupta', message: 'Reminder: Tuition Fee of ₹13,000 is due for Rohan Gupta (Class 9). Please pay before 15-Apr-2026.', type: 'due_reminder', status: 'sent', sent_at: '2026-04-01 09:00' },
    { id: 4, phone: '9876543214', student_name: 'Karan Mehta', message: 'Reminder: Tuition Fee of ₹11,000 is due for Karan Mehta (Class 8). Please pay before 15-Apr-2026.', type: 'due_reminder', status: 'sent', sent_at: '2026-04-01 09:00' },
    { id: 5, phone: '9876543216', student_name: 'Arjun Kumar', message: 'Reminder: Tuition Fee of ₹9,000 is due for Arjun Kumar (Class 7). Please pay before 15-Apr-2026.', type: 'due_reminder', status: 'failed', sent_at: '2026-04-01 09:01' },
  ]
  const savedLogs = loadFromStorage<SmsLog[]>('sms_logs')
  const logs = ref<SmsLog[]>(savedLogs || [...demoLogs])
  const sending = ref(false)

  watch(logs, (val) => saveToStorage('sms_logs', val), { deep: true })

  const sentCount = computed(() => logs.value.filter((l) => l.status === 'sent').length)
  const failedCount = computed(() => logs.value.filter((l) => l.status === 'failed').length)

  function sendPaymentSms(phone: string, studentName: string, amount: number, feeName: string, receiptNumber: string, balance: number) {
    const balanceText = balance > 0 ? ` Balance due: ₹${balance.toLocaleString('en-IN')}.` : ''
    const message = `Payment of ₹${amount.toLocaleString('en-IN')} received for ${feeName}. Receipt: ${receiptNumber}.${balanceText} Thank you!`

    const log: SmsLog = {
      id: Date.now(),
      phone,
      student_name: studentName,
      message,
      type: 'payment',
      status: 'sent',
      sent_at: new Date().toLocaleString('en-IN'),
    }
    logs.value.unshift(log)
    toast.success(`SMS sent to ${phone}`)
    return log
  }

  function sendDueReminder(phone: string, studentName: string, amount: number, feeName: string, className: string, dueDate: string) {
    const message = `Reminder: ${feeName} of ₹${amount.toLocaleString('en-IN')} is due for ${studentName} (${className}). Please pay before ${dueDate}.`

    const log: SmsLog = {
      id: Date.now(),
      phone,
      student_name: studentName,
      message,
      type: 'due_reminder',
      status: 'sent',
      sent_at: new Date().toLocaleString('en-IN'),
    }
    logs.value.unshift(log)
    toast.success(`Due reminder sent to ${phone}`)
    return log
  }

  function sendBulkDueReminders(reminders: { phone: string; studentName: string; amount: number; feeName: string; className: string; dueDate: string }[]) {
    sending.value = true
    let sentOk = 0
    for (const r of reminders) {
      sendDueReminder(r.phone, r.studentName, r.amount, r.feeName, r.className, r.dueDate)
      sentOk++
    }
    sending.value = false
    toast.success(`${sentOk} due reminders sent`)
  }

  function sendCustomSms(phone: string, studentName: string, message: string) {
    const log: SmsLog = {
      id: Date.now(),
      phone,
      student_name: studentName,
      message,
      type: 'general',
      status: 'sent',
      sent_at: new Date().toLocaleString('en-IN'),
    }
    logs.value.unshift(log)
    toast.success(`SMS sent to ${phone}`)
    return log
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
    }
    logs.value.unshift(log)
    return log
  }

  return {
    logs,
    sending,
    sentCount,
    failedCount,
    sendPaymentSms,
    sendDueReminder,
    sendBulkDueReminders,
    sendCustomSms,
    sendNoticeSms,
    sendScheduleSms,
  }
})

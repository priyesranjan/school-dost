<template>
  <div class="space-y-6">
    <!-- Stats -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Sent"
        :value="smsStore.sentCount"
        icon="✉️"
        icon-bg="bg-green-50"
        value-color="text-green-700"
      />
      <StatCard
        title="WhatsApp Sent"
        :value="smsStore.whatsappCount"
        icon="💬"
        icon-bg="bg-emerald-50"
        value-color="text-emerald-700"
      />
      <StatCard title="SMS Sent" :value="smsStore.smsCount" icon="📱" icon-bg="bg-sky-50" value-color="text-sky-700" />
      <StatCard title="Failed" :value="smsStore.failedCount" icon="⚠️" icon-bg="bg-red-50" value-color="text-red-600" />
    </div>

    <AppCard title="Communication Command Center">
      <div class="grid gap-4 lg:grid-cols-3">
        <AppInput v-model="compose.channel" type="select" label="Delivery Channel">
          <option value="whatsapp">WhatsApp API</option>
          <option value="sms">SMS</option>
        </AppInput>
        <AppInput v-model="compose.templateId" type="select" label="Template">
          <option value="">Custom message</option>
          <option v-for="tpl in smsStore.templates" :key="tpl.id" :value="tpl.id">{{ tpl.label }}</option>
        </AppInput>
        <AppInput v-model="compose.targetScope" type="select" label="Audience Scope">
          <option value="single">Single recipient</option>
          <option value="due">All pending due students</option>
        </AppInput>
      </div>
      <div class="mt-4 rounded-2xl border border-gray-100 bg-gray-50/70 p-4 dark:border-gray-700 dark:bg-gray-800/70">
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-500">Template Preview</p>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-200">{{ templatePreview }}</p>
      </div>
      <div class="mt-4 grid gap-4 lg:grid-cols-2">
        <AppInput
          v-model="sendForm.phone"
          label="Phone Number"
          placeholder="10-digit number"
          :disabled="compose.targetScope === 'due'"
          required
        />
        <AppInput
          v-model="sendForm.student_name"
          label="Student Name"
          placeholder="Enter name"
          :disabled="compose.targetScope === 'due'"
          required
        />
      </div>
      <div class="mt-4">
        <AppInput
          v-model="sendForm.message"
          label="Message"
          type="textarea"
          placeholder="Type your message..."
          :rows="3"
          required
        />
        <p class="mt-2 text-xs text-gray-400">{{ sendForm.message.length }} characters</p>
      </div>
      <div class="mt-5 flex flex-wrap gap-3">
        <AppButton @click="handleSend" :loading="smsStore.sending">
          Send {{ compose.channel === 'whatsapp' ? 'WhatsApp' : 'SMS' }}
        </AppButton>
        <AppButton variant="secondary" @click="sendAllDueReminders" :loading="smsStore.sending">
          Send Due Reminders ({{ pendingDueCount }})
        </AppButton>
      </div>
    </AppCard>

    <!-- Actions -->
    <div
      class="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/50 px-4 py-3 text-sm dark:border-emerald-900/50 dark:bg-emerald-900/10"
    >
      <p class="font-semibold text-emerald-700 dark:text-emerald-300">
        WhatsApp-first mode is active for communication workflows.
      </p>
      <p class="text-xs text-emerald-700/80 dark:text-emerald-300/80">Fallback: SMS</p>
    </div>

    <!-- SMS Log -->
    <AppCard title="Communication Log" :no-padding="true">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Student</th>
              <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Phone</th>
              <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Channel</th>
              <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Message</th>
              <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Type</th>
              <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
              <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Sent At</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-700">
            <tr v-for="log in smsStore.logs" :key="log.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-700/50">
              <td class="px-6 py-3 font-medium text-gray-900 dark:text-white">{{ log.student_name }}</td>
              <td class="px-6 py-3 text-gray-600 dark:text-gray-300">{{ log.phone }}</td>
              <td class="px-6 py-3">
                <StatusBadge :color="(log.channel || 'sms') === 'whatsapp' ? 'green' : 'blue'">
                  {{ (log.channel || 'sms') === 'whatsapp' ? 'WhatsApp' : 'SMS' }}
                </StatusBadge>
              </td>
              <td class="px-6 py-3 text-gray-600 dark:text-gray-300 max-w-xs truncate" :title="log.message">
                {{ log.message }}
              </td>
              <td class="px-6 py-3">
                <StatusBadge :color="typeColor(log.type)">{{ typeLabel(log.type) }}</StatusBadge>
              </td>
              <td class="px-6 py-3">
                <StatusBadge :color="log.status === 'sent' ? 'green' : log.status === 'failed' ? 'red' : 'yellow'">
                  {{ log.status }}
                </StatusBadge>
              </td>
              <td class="px-6 py-3 text-gray-500 dark:text-gray-400 text-xs">{{ log.sent_at }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <EmptyState
        v-if="!smsStore.logs.length"
        title="No messages sent yet"
        message="Send your first campaign notification"
      />
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import { useSmsStore } from '@/stores/sms'
import { useFeeStore } from '@/stores/fees'
import { useStudentStore } from '@/stores/students'
import StatCard from '@/components/ui/StatCard.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const smsStore = useSmsStore()
const feeStore = useFeeStore()
const studentStore = useStudentStore()

const compose = reactive({
  channel: smsStore.preferredChannel,
  templateId: '',
  targetScope: 'single' as 'single' | 'due',
})
const sendForm = reactive({ phone: '', student_name: '', message: '' })

const pendingDueCount = computed(() => feeStore.duePayments.length)
const templatePreview = computed(() => {
  if (!compose.templateId) return sendForm.message || 'Write a custom message or select a template.'
  return smsStore.applyTemplate(compose.templateId, {
    student: sendForm.student_name || 'Aarav Sharma',
    amount: '12,500',
    dueDate: '15-Apr-2026',
    school: 'School ERP',
    receipt: 'RCP-2026-009',
  })
})

watch(
  () => compose.channel,
  (channel) => {
    smsStore.setPreferredChannel(channel)
  },
)

watch(
  () => compose.templateId,
  (templateId) => {
    if (!templateId) return
    sendForm.message = smsStore.applyTemplate(templateId, {
      student: sendForm.student_name || 'Aarav Sharma',
      amount: '12,500',
      dueDate: '15-Apr-2026',
      school: 'School ERP',
      receipt: 'RCP-2026-009',
    })
  },
)

function handleSend() {
  if (compose.targetScope === 'due') {
    const recipients = feeStore.duePayments
      .map((p) => {
        const student = studentStore.students.find((s) => s.id === p.student_id)
        return {
          phone: student?.phone || '',
          studentName: p.student_name,
        }
      })
      .filter((r) => r.phone)

    if (compose.templateId) {
      recipients.forEach((r) => {
        smsStore.sendTemplateMessage(
          r.phone,
          r.studentName,
          compose.templateId,
          {
            student: r.studentName,
            amount: '12,500',
            dueDate: '15-Apr-2026',
            school: 'School ERP',
            receipt: 'RCP-2026-009',
          },
          compose.channel,
        )
      })
    } else {
      smsStore.sendCampaign(recipients, sendForm.message, compose.channel)
    }
    return
  }

  if (!sendForm.phone || !sendForm.message) return
  if (compose.templateId) {
    smsStore.sendTemplateMessage(
      sendForm.phone,
      sendForm.student_name || 'Parent',
      compose.templateId,
      {
        student: sendForm.student_name || 'Student',
        amount: '12,500',
        dueDate: '15-Apr-2026',
        school: 'School ERP',
        receipt: 'RCP-2026-009',
      },
      compose.channel,
    )
  } else {
    smsStore.sendCustomSms(sendForm.phone, sendForm.student_name || 'Parent', sendForm.message, compose.channel)
  }

  sendForm.phone = ''
  sendForm.student_name = ''
  sendForm.message = ''
}

function sendAllDueReminders() {
  const reminders = feeStore.duePayments
    .map((p) => {
      const student = studentStore.students.find((s) => s.id === p.student_id)
      return {
        phone: student?.phone || '',
        studentName: p.student_name,
        amount: p.due_amount,
        feeName: p.fee_name,
        className: p.class_name,
        dueDate: '15-Apr-2026',
      }
    })
    .filter((r) => r.phone)
  smsStore.sendBulkDueReminders(reminders, compose.channel)
}

function typeColor(type: string) {
  const map: Record<string, 'green' | 'blue' | 'yellow' | 'gray'> = {
    payment: 'green',
    due_reminder: 'yellow',
    attendance: 'blue',
    general: 'gray',
    notice: 'blue',
    schedule: 'yellow',
  }
  return map[type] || 'gray'
}

function typeLabel(type: string) {
  const map: Record<string, string> = {
    payment: 'Payment',
    due_reminder: 'Reminder',
    attendance: 'Attendance',
    general: 'General',
    notice: 'Notice',
    schedule: 'Schedule',
  }
  return map[type] || type
}
</script>

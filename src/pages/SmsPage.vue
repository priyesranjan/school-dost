<template>
  <div class="space-y-6">
    <!-- Stats -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard title="Total Sent" :value="smsStore.sentCount" icon="✉️" icon-bg="bg-green-50" value-color="text-green-700" />
      <StatCard title="Failed" :value="smsStore.failedCount" icon="⚠️" icon-bg="bg-red-50" value-color="text-red-600" />
      <StatCard title="Pending Reminders" :value="pendingDueCount" icon="📢" icon-bg="bg-amber-50" />
    </div>

    <!-- Actions -->
    <div class="flex flex-col gap-3 sm:flex-row">
      <AppButton @click="showSendModal = true">Send SMS</AppButton>
      <AppButton variant="secondary" @click="sendAllDueReminders" :loading="smsStore.sending">
        Send All Due Reminders ({{ pendingDueCount }})
      </AppButton>
    </div>

    <!-- SMS Log -->
    <AppCard title="SMS Log" :no-padding="true">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Student</th>
              <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Phone</th>
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
              <td class="px-6 py-3 text-gray-600 dark:text-gray-300 max-w-xs truncate" :title="log.message">{{ log.message }}</td>
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
      <EmptyState v-if="!smsStore.logs.length" title="No SMS sent yet" message="Send your first SMS notification" />
    </AppCard>

    <!-- Send SMS Modal -->
    <AppModal v-model="showSendModal" title="Send SMS" size="md">
      <form @submit.prevent="handleSend" class="space-y-4">
        <AppInput v-model="sendForm.phone" label="Phone Number" placeholder="10-digit number" required />
        <AppInput v-model="sendForm.student_name" label="Student Name" placeholder="Enter name" required />
        <AppInput v-model="sendForm.message" label="Message" type="textarea" placeholder="Type your message..." :rows="3" required />
        <p class="text-xs text-gray-400">{{ sendForm.message.length }} characters</p>
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showSendModal = false">Cancel</AppButton>
          <AppButton @click="handleSend">Send SMS</AppButton>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useSmsStore } from '@/stores/sms'
import { useFeeStore } from '@/stores/fees'
import { useStudentStore } from '@/stores/students'
import StatCard from '@/components/ui/StatCard.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const smsStore = useSmsStore()
const feeStore = useFeeStore()
const studentStore = useStudentStore()

const showSendModal = ref(false)
const sendForm = reactive({ phone: '', student_name: '', message: '' })

const pendingDueCount = computed(() => feeStore.duePayments.length)

function handleSend() {
  if (!sendForm.phone || !sendForm.message) return
  smsStore.sendCustomSms(sendForm.phone, sendForm.student_name, sendForm.message)
  showSendModal.value = false
  sendForm.phone = ''
  sendForm.student_name = ''
  sendForm.message = ''
}

function sendAllDueReminders() {
  const reminders = feeStore.duePayments.map((p) => {
    const student = studentStore.students.find((s) => s.id === p.student_id)
    return {
      phone: student?.phone || '',
      studentName: p.student_name,
      amount: p.due_amount,
      feeName: p.fee_name,
      className: p.class_name,
      dueDate: '15-Apr-2026',
    }
  }).filter((r) => r.phone)
  smsStore.sendBulkDueReminders(reminders)
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

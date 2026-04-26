<template>
  <div class="space-y-8 animate-fade-in-up">
    <div
      class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-700 via-teal-600 to-cyan-700 p-8 text-white shadow-2xl shadow-teal-200 dark:shadow-none"
    >
      <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div
            class="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur-sm"
          >
            Parent Relations Control
          </div>
          <h1 class="mt-3 text-4xl font-black tracking-tight">Communication Hub</h1>
          <p class="mt-2 text-sm font-medium text-teal-100/90">
            WhatsApp-first outreach to {{ totalParents }} parent contacts
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <button
            @click="activeTab = 'compose'"
            :class="[
              'rounded-2xl px-5 py-3 text-sm font-black transition-all',
              activeTab === 'compose'
                ? 'bg-white text-teal-700 shadow-xl'
                : 'bg-white/20 backdrop-blur-sm hover:bg-white/30',
            ]"
          >
            Compose
          </button>
          <button
            @click="activeTab = 'history'"
            :class="[
              'rounded-2xl px-5 py-3 text-sm font-black transition-all',
              activeTab === 'history'
                ? 'bg-white text-teal-700 shadow-xl'
                : 'bg-white/20 backdrop-blur-sm hover:bg-white/30',
            ]"
          >
            History
          </button>
          <button
            @click="activeTab = 'templates'"
            :class="[
              'rounded-2xl px-5 py-3 text-sm font-black transition-all',
              activeTab === 'templates'
                ? 'bg-white text-teal-700 shadow-xl'
                : 'bg-white/20 backdrop-blur-sm hover:bg-white/30',
            ]"
          >
            Templates
          </button>
        </div>
      </div>
      <div class="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
      <StatCard title="Parents" :value="totalParents" icon="👨‍👩‍👧" icon-bg="bg-cyan-50" value-color="text-cyan-700" />
      <StatCard
        title="Sent"
        :value="smsStore.sentCount"
        icon="✉️"
        icon-bg="bg-emerald-50"
        value-color="text-emerald-700"
      />
      <StatCard
        title="WhatsApp"
        :value="smsStore.whatsappCount"
        icon="💬"
        icon-bg="bg-green-50"
        value-color="text-green-700"
      />
      <StatCard title="SMS" :value="smsStore.smsCount" icon="📱" icon-bg="bg-blue-50" value-color="text-blue-700" />
      <StatCard
        title="Failed"
        :value="smsStore.failedCount"
        icon="⚠️"
        icon-bg="bg-rose-50"
        value-color="text-rose-700"
      />
      <StatCard
        title="Scheduled"
        :value="scheduledCampaigns.length"
        icon="⏳"
        icon-bg="bg-amber-50"
        value-color="text-amber-700"
      />
    </div>

    <template v-if="activeTab === 'compose'">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div class="space-y-6 lg:col-span-3">
          <div
            class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800/50"
          >
            <h3 class="mb-6 text-lg font-black text-gray-900 dark:text-white">New Campaign</h3>

            <div class="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="space-y-1">
                <label class="text-xs font-black uppercase tracking-widest text-gray-500">Delivery Channel</label>
                <select
                  v-model="composeChannel"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold dark:border-gray-600 dark:bg-gray-700"
                >
                  <option value="whatsapp">WhatsApp API</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="text-xs font-black uppercase tracking-widest text-gray-500">Template</label>
                <select
                  v-model="selectedTemplate"
                  @change="applyTemplate"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold dark:border-gray-600 dark:bg-gray-700"
                >
                  <option value="">Custom Message</option>
                  <option v-for="t in templateCards" :key="t.id" :value="t.id">{{ t.name }}</option>
                </select>
              </div>
            </div>

            <div class="mb-5 space-y-3">
              <label class="text-xs font-black uppercase tracking-widest text-gray-500">Target Audience</label>
              <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <button
                  v-for="aud in audiences"
                  :key="aud.value"
                  @click="selectedAudience = aud.value"
                  :class="[
                    'rounded-2xl border-2 p-3 text-center transition-all',
                    selectedAudience === aud.value
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                      : 'border-gray-100 dark:border-gray-700 hover:border-teal-200',
                  ]"
                >
                  <div class="mb-1 text-xl">{{ aud.icon }}</div>
                  <p class="text-[10px] font-black text-gray-700 dark:text-gray-300">{{ aud.label }}</p>
                  <p class="text-[10px] text-gray-400">{{ aud.count }}</p>
                </button>
              </div>
            </div>

            <div v-if="selectedAudience === 'class'" class="mb-5 space-y-1">
              <label class="text-xs font-black uppercase tracking-widest text-gray-500">Target Class</label>
              <select
                v-model="targetClass"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="">Select Class</option>
                <option v-for="cls in availableClasses" :key="cls" :value="cls">{{ cls }}</option>
              </select>
            </div>

            <div
              class="mb-5 rounded-2xl border border-gray-100 bg-gray-50/60 p-4 dark:border-gray-700 dark:bg-gray-700/40"
            >
              <p class="text-[10px] font-black uppercase tracking-widest text-gray-500">Quick Journeys</p>
              <div class="mt-3 flex flex-wrap gap-2">
                <button
                  v-for="journey in journeys"
                  :key="journey.id"
                  @click="applyJourney(journey.id)"
                  class="rounded-xl border border-teal-100 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest text-teal-700 hover:bg-teal-50 dark:border-teal-900/40 dark:bg-gray-800 dark:text-teal-300"
                >
                  {{ journey.label }}
                </button>
              </div>
            </div>

            <div class="space-y-1">
              <div class="flex items-center justify-between">
                <label class="text-xs font-black uppercase tracking-widest text-gray-500">Message Body</label>
                <span :class="['text-[10px] font-bold', messageBody.length > 140 ? 'text-amber-500' : 'text-gray-400']"
                  >{{ messageBody.length }} / 160</span
                >
              </div>
              <textarea
                v-model="messageBody"
                rows="5"
                placeholder="Type your campaign message here..."
                class="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-teal-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              ></textarea>
            </div>

            <div class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="space-y-1">
                <label class="text-xs font-black uppercase tracking-widest text-gray-500">Schedule (Optional)</label>
                <input
                  v-model="scheduledAt"
                  type="datetime-local"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <div class="flex items-end">
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  <span class="font-bold text-teal-600">{{ recipientCount }}</span> recipients will receive this
                  message.
                </p>
              </div>
            </div>

            <div class="mt-5 flex items-center justify-between gap-4">
              <button
                @click="clearCompose"
                class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                Clear
              </button>
              <button
                @click="sendMessage"
                :disabled="!messageBody.trim() || recipientCount === 0"
                class="flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-black text-white shadow-lg shadow-teal-200 transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-none"
              >
                {{ scheduledAt ? 'Schedule' : 'Send' }} {{ composeChannel === 'whatsapp' ? 'WhatsApp' : 'SMS' }}
              </button>
            </div>
          </div>
        </div>

        <div class="space-y-4 lg:col-span-2">
          <div
            class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800/50"
          >
            <h4 class="mb-4 text-sm font-black text-gray-900 dark:text-white">Recent Activity</h4>
            <div class="max-h-[360px] space-y-3 overflow-y-auto">
              <div
                v-for="log in recentLogs"
                :key="log.id"
                class="flex items-start gap-3 rounded-2xl bg-gray-50 p-3 dark:bg-gray-700/50"
              >
                <div
                  :class="[
                    'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-sm',
                    log.status === 'sent' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-rose-100 dark:bg-rose-900/30',
                  ]"
                >
                  {{ log.status === 'sent' ? '✓' : '✗' }}
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <p class="truncate text-xs font-black text-gray-900 dark:text-white">{{ log.student_name }}</p>
                    <span
                      class="rounded-full bg-gray-200 px-2 py-0.5 text-[9px] font-black uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                    >
                      {{ (log.channel || 'sms') === 'whatsapp' ? 'WA' : 'SMS' }}
                    </span>
                  </div>
                  <p class="mt-0.5 line-clamp-2 text-[10px] text-gray-500 dark:text-gray-400">{{ log.message }}</p>
                  <p class="mt-1 text-[10px] font-bold text-gray-400">{{ log.sent_at }}</p>
                </div>
              </div>
              <div v-if="!recentLogs.length" class="py-8 text-center text-sm text-gray-400">No messages yet</div>
            </div>
          </div>

          <div
            class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800/50"
          >
            <h4 class="mb-4 text-sm font-black text-gray-900 dark:text-white">Scheduled Queue</h4>
            <div class="space-y-3">
              <div
                v-for="job in scheduledCampaigns.slice(0, 5)"
                :key="job.id"
                class="rounded-2xl border border-gray-100 px-4 py-3 dark:border-gray-700"
              >
                <div class="flex items-center justify-between">
                  <p class="text-xs font-black text-gray-900 dark:text-white">
                    {{ job.channel === 'whatsapp' ? 'WhatsApp' : 'SMS' }} · {{ job.recipients }} recipients
                  </p>
                  <span class="text-[10px] font-bold uppercase text-amber-600">Scheduled</span>
                </div>
                <p class="mt-1 line-clamp-2 text-[10px] text-gray-500 dark:text-gray-400">{{ job.message }}</p>
                <p class="mt-1 text-[10px] font-bold text-gray-400">{{ job.when }}</p>
              </div>
              <p v-if="!scheduledCampaigns.length" class="text-xs text-gray-400">No scheduled campaigns yet.</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-if="activeTab === 'history'">
      <div
        class="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800/50"
      >
        <div class="flex flex-col gap-3 border-b border-gray-50 p-5 dark:border-gray-700 sm:flex-row sm:items-center">
          <div class="relative flex-1">
            <input
              v-model="historySearch"
              placeholder="Search by parent or text..."
              class="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-3 pr-3 text-sm focus:border-teal-400 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <select
            v-model="historyTypeFilter"
            class="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-bold dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="">All Types</option>
            <option value="payment">Payment</option>
            <option value="due_reminder">Reminder</option>
            <option value="general">General</option>
            <option value="notice">Notice</option>
          </select>
          <select
            v-model="historyChannelFilter"
            class="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-bold dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="">All Channels</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="sms">SMS</option>
          </select>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr
                class="bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:bg-gray-900/30"
              >
                <th class="px-6 py-3">Recipient</th>
                <th class="px-6 py-3">Channel</th>
                <th class="px-6 py-3">Message</th>
                <th class="px-6 py-3">Type</th>
                <th class="px-6 py-3">Status</th>
                <th class="px-6 py-3">Sent At</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
              <tr
                v-for="log in filteredHistory"
                :key="log.id"
                class="transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/30"
              >
                <td class="px-6 py-3">
                  <p class="font-bold text-gray-900 dark:text-white">{{ log.student_name }}</p>
                  <p class="text-[10px] text-gray-400">{{ log.phone }}</p>
                </td>
                <td class="px-6 py-3">
                  <span
                    class="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-black uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-100"
                  >
                    {{ (log.channel || 'sms') === 'whatsapp' ? 'WhatsApp' : 'SMS' }}
                  </span>
                </td>
                <td class="max-w-xs px-6 py-3">
                  <p class="truncate text-gray-600 dark:text-gray-300">{{ log.message }}</p>
                </td>
                <td class="px-6 py-3">
                  <span
                    :class="[
                      'inline-flex rounded-full px-2 py-0.5 text-[9px] font-black uppercase',
                      typeColor(log.type),
                    ]"
                    >{{ log.type }}</span
                  >
                </td>
                <td class="px-6 py-3">
                  <span
                    :class="[
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase',
                      log.status === 'sent'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
                    ]"
                  >
                    {{ log.status }}
                  </span>
                </td>
                <td class="px-6 py-3 text-xs text-gray-500 dark:text-gray-400">{{ log.sent_at }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="!filteredHistory.length" class="py-16 text-center text-sm text-gray-400">No messages found</div>
      </div>
    </template>

    <template v-if="activeTab === 'templates'">
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="t in templateCards"
          :key="t.id"
          class="group relative cursor-pointer overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-800/50"
          @click="useTemplate(t)"
        >
          <div class="flex items-start justify-between">
            <span class="text-3xl">{{ t.icon }}</span>
            <span :class="['rounded-full px-2 py-0.5 text-[9px] font-black uppercase', typeColor(t.type)]">{{
              t.type
            }}</span>
          </div>
          <h4 class="mt-3 text-sm font-black text-gray-900 dark:text-white">{{ t.name }}</h4>
          <p class="mt-2 line-clamp-3 text-xs text-gray-500 dark:text-gray-400">{{ t.body }}</p>
          <div class="mt-4 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              @click.stop="useTemplate(t)"
              class="rounded-xl bg-teal-600 px-4 py-2 text-[10px] font-black text-white hover:bg-teal-700"
            >
              Use Template
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStudentStore } from '@/stores/students'
import { useSmsStore } from '@/stores/sms'
import { useFeeStore } from '@/stores/fees'
import { useToastStore } from '@/stores/toast'
import StatCard from '@/components/ui/StatCard.vue'

type AudienceMode = 'all' | 'class' | 'pending' | 'inactive'

const studentStore = useStudentStore()
const smsStore = useSmsStore()
const feeStore = useFeeStore()
const toast = useToastStore()

const activeTab = ref<'compose' | 'history' | 'templates'>('compose')
const selectedAudience = ref<AudienceMode>('all')
const composeChannel = ref<'sms' | 'whatsapp'>('whatsapp')
const targetClass = ref('')
const selectedTemplate = ref('')
const messageBody = ref('')
const scheduledAt = ref('')
const historySearch = ref('')
const historyTypeFilter = ref('')
const historyChannelFilter = ref('')

const scheduledCampaigns = ref<
  Array<{ id: number; when: string; recipients: number; channel: 'sms' | 'whatsapp'; message: string }>
>([])

const availableClasses = computed(() => [...new Set(studentStore.students.map((s) => s.class_name))].sort())

const parentContacts = computed(() => {
  const map = new Map<
    string,
    { phone: string; studentName: string; className: string; status: 'active' | 'inactive' }
  >()
  studentStore.students.forEach((s) => {
    if (!map.has(s.phone)) {
      map.set(s.phone, { phone: s.phone, studentName: s.name, className: s.class_name, status: s.status })
    }
  })
  return Array.from(map.values())
})

const pendingParentPhones = computed(() => {
  const byStudentId = new Map(studentStore.students.map((s) => [s.id, s.phone]))
  return new Set(feeStore.duePayments.map((p) => byStudentId.get(p.student_id) || '').filter((p) => p))
})

const recipientList = computed(() => {
  if (selectedAudience.value === 'class') {
    if (!targetClass.value) return []
    return parentContacts.value.filter((p) => p.className === targetClass.value)
  }
  if (selectedAudience.value === 'pending') {
    return parentContacts.value.filter((p) => pendingParentPhones.value.has(p.phone))
  }
  if (selectedAudience.value === 'inactive') {
    return parentContacts.value.filter((p) => p.status === 'inactive')
  }
  return parentContacts.value
})

const totalParents = computed(() => parentContacts.value.length)
const recipientCount = computed(() => recipientList.value.length)
const recentLogs = computed(() => [...smsStore.logs].slice(0, 10))

onMounted(() => {
  void smsStore.fetchLogs()
})

const audiences = computed<Array<{ value: AudienceMode; label: string; icon: string; count: number }>>(() => [
  { value: 'all', label: 'All Parents', icon: '👨‍👩‍👧', count: parentContacts.value.length },
  {
    value: 'class',
    label: 'By Class',
    icon: '🏫',
    count: targetClass.value ? parentContacts.value.filter((p) => p.className === targetClass.value).length : 0,
  },
  {
    value: 'pending',
    label: 'Fee Due',
    icon: '💸',
    count: parentContacts.value.filter((p) => pendingParentPhones.value.has(p.phone)).length,
  },
  {
    value: 'inactive',
    label: 'Inactive',
    icon: '🔴',
    count: parentContacts.value.filter((p) => p.status === 'inactive').length,
  },
])

const journeys = [
  { id: 'due', label: 'Fee Due Journey' },
  { id: 'attendance', label: 'Attendance Alert' },
  { id: 'exam', label: 'Exam Reminder' },
] as const

const templateCards = computed(() => {
  const icons: Record<string, string> = {
    fee_due_v1: '💰',
    payment_receipt_v1: '🧾',
    attendance_alert_v1: '📊',
  }
  return smsStore.templates.map((t) => ({
    id: t.id,
    name: t.label,
    type: t.id.includes('fee') ? 'due_reminder' : t.id.includes('attendance') ? 'notice' : 'payment',
    icon: icons[t.id] || '📨',
    body: t.body,
  }))
})

const filteredHistory = computed(() => {
  let list = [...smsStore.logs]
  if (historySearch.value) {
    const q = historySearch.value.toLowerCase()
    list = list.filter((l) => l.student_name.toLowerCase().includes(q) || l.message.toLowerCase().includes(q))
  }
  if (historyTypeFilter.value) {
    list = list.filter((l) => l.type === historyTypeFilter.value)
  }
  if (historyChannelFilter.value) {
    list = list.filter((l) => (l.channel || 'sms') === historyChannelFilter.value)
  }
  return list
})

function typeColor(type: string) {
  const map: Record<string, string> = {
    payment: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    due_reminder: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    general: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
    notice: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    schedule: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  }
  return map[type] || 'bg-gray-100 text-gray-700'
}

function templateMessageFor(templateId: string) {
  return smsStore.applyTemplate(templateId, {
    student: recipientList.value[0]?.studentName || 'Student',
    amount: '12,500',
    dueDate: '15-Apr-2026',
    school: 'School ERP',
    receipt: 'RCP-2026-101',
  })
}

function applyTemplate() {
  if (!selectedTemplate.value) return
  messageBody.value = templateMessageFor(selectedTemplate.value)
}

function useTemplate(t: { id: string }) {
  selectedTemplate.value = t.id
  applyTemplate()
  activeTab.value = 'compose'
}

function applyJourney(journeyId: 'due' | 'attendance' | 'exam') {
  if (journeyId === 'due') {
    selectedAudience.value = 'pending'
    selectedTemplate.value = 'fee_due_v1'
  } else if (journeyId === 'attendance') {
    selectedAudience.value = 'class'
    selectedTemplate.value = 'attendance_alert_v1'
  } else {
    selectedAudience.value = 'all'
    selectedTemplate.value = ''
    messageBody.value =
      'Reminder: Upcoming exams start next week. Please ensure your ward is prepared and present on time.'
    return
  }
  applyTemplate()
}

function clearCompose() {
  selectedTemplate.value = ''
  messageBody.value = ''
  scheduledAt.value = ''
}

function sendMessage() {
  if (!messageBody.value.trim() || recipientCount.value === 0) return

  if (scheduledAt.value) {
    scheduledCampaigns.value.unshift({
      id: Date.now(),
      when: new Date(scheduledAt.value).toLocaleString('en-IN'),
      recipients: recipientCount.value,
      channel: composeChannel.value,
      message: messageBody.value,
    })
    toast.success(`Campaign scheduled for ${new Date(scheduledAt.value).toLocaleString('en-IN')}`)
    clearCompose()
    return
  }

  const recipients = recipientList.value.map((r) => ({
    phone: r.phone,
    studentName: r.studentName,
  }))

  smsStore.sendCampaign(recipients, messageBody.value, composeChannel.value, selectedTemplate.value || undefined)
  clearCompose()
}
</script>

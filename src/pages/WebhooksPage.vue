<template>
  <div class="space-y-8 animate-fade-in-up">
    <div
      class="relative overflow-hidden rounded-[2rem] bg-cyan-50 p-8 shadow-xl shadow-cyan-100/50 dark:border dark:border-cyan-900/30 dark:bg-gray-800/80 dark:shadow-none"
    >
      <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div
            class="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300"
          >
            Integrations and API Events
          </div>
          <h1 class="mt-3 text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            Webhook
            <span class="bg-gradient-to-r from-cyan-600 to-sky-600 bg-clip-text text-transparent">Control Center</span>
          </h1>
          <p class="mt-1 text-sm font-medium text-cyan-700/80 dark:text-cyan-300/70">
            Push fee, accounting, and communication events into external finance stacks, CRMs, and automation tools.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <AppButton variant="secondary" :disabled="loading" @click="refreshAll">Refresh</AppButton>
          <AppButton @click="resetForm" class="bg-cyan-600 hover:bg-cyan-700">
            {{ editingId ? 'New Endpoint' : 'Reset Form' }}
          </AppButton>
        </div>
      </div>
      <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-100/40 blur-3xl dark:bg-cyan-900/20"></div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-4">
      <div class="rounded-3xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-800/50">
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Active Endpoints</p>
        <p class="mt-1 text-3xl font-black text-cyan-600 dark:text-cyan-400">{{ activeCount }}</p>
      </div>
      <div class="rounded-3xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-800/50">
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Endpoints With Failures</p>
        <p class="mt-1 text-3xl font-black text-rose-600 dark:text-rose-400">{{ failingSubscriptions }}</p>
      </div>
      <div class="rounded-3xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-800/50">
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Successful Deliveries</p>
        <p class="mt-1 text-3xl font-black text-emerald-600 dark:text-emerald-400">{{ successDeliveries }}</p>
      </div>
      <div class="rounded-3xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-800/50">
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Failed Deliveries</p>
        <p class="mt-1 text-3xl font-black text-amber-600 dark:text-amber-400">{{ failedDeliveries }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1.9fr]">
      <AppCard :title="editingId ? 'Edit Webhook Endpoint' : 'Register Webhook Endpoint'">
        <form class="space-y-5" @submit.prevent="handleSave">
          <AppInput v-model="form.name" label="Endpoint Name" placeholder="Finance ERP - Production" required />
          <AppInput v-model="form.url" label="Destination URL" placeholder="https://example.com/hooks/erp" required />

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AppInput v-model="form.timeout_ms" type="number" label="Timeout (ms)" />
            <AppInput
              v-model="form.secret"
              label="Signing Secret"
              :placeholder="editingId ? 'Leave blank to keep existing secret' : 'Optional - auto generated if blank'"
            />
          </div>

          <div class="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 dark:border-gray-700 dark:bg-gray-800/40">
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="text-sm font-black text-gray-900 dark:text-white">Subscribed Events</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Pick the business events this endpoint should receive.</p>
              </div>
              <label class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                <input v-model="form.active" type="checkbox" class="h-4 w-4 rounded border-gray-300" />
                Active
              </label>
            </div>

            <div class="mt-4 grid grid-cols-1 gap-3">
              <button
                v-for="event in catalog"
                :key="event.key"
                type="button"
                @click="toggleEvent(event.key)"
                :class="[
                  'rounded-2xl border p-4 text-left transition-all',
                  form.events.includes(event.key)
                    ? 'border-cyan-500 bg-cyan-50 shadow-sm dark:bg-cyan-900/20'
                    : 'border-gray-100 bg-white hover:border-cyan-200 dark:border-gray-700 dark:bg-gray-900/30',
                ]"
              >
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="text-sm font-black text-gray-900 dark:text-white">{{ event.label }}</p>
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ event.description }}</p>
                    <p class="mt-2 text-[10px] font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-300">
                      {{ event.key }}
                    </p>
                  </div>
                  <span
                    :class="[
                      'rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest',
                      form.events.includes(event.key)
                        ? 'bg-cyan-600 text-white'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300',
                    ]"
                  >
                    {{ form.events.includes(event.key) ? 'Enabled' : 'Off' }}
                  </span>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Custom Headers (JSON)</label>
            <textarea
              v-model="form.headers_json"
              rows="5"
              class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              placeholder='{"X-Partner-Key":"abc123","X-Environment":"production"}'
            ></textarea>
            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
              These headers are sent with every delivery in addition to the ERP signing headers.
            </p>
          </div>

          <div class="flex items-center justify-end gap-3">
            <AppButton variant="secondary" type="button" @click="resetForm">Cancel</AppButton>
            <AppButton type="submit" :loading="saving" class="bg-cyan-600 hover:bg-cyan-700">
              {{ editingId ? 'Save Changes' : 'Create Endpoint' }}
            </AppButton>
          </div>
        </form>
      </AppCard>

      <AppCard title="Registered Endpoints">
        <div class="space-y-4">
          <div
            v-for="subscription in subscriptions"
            :key="subscription.id"
            class="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/40"
          >
            <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <p class="text-base font-black text-gray-900 dark:text-white">{{ subscription.name }}</p>
                  <span
                    :class="[
                      'rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest',
                      subscription.active
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
                    ]"
                  >
                    {{ subscription.active ? 'Active' : 'Paused' }}
                  </span>
                  <span
                    v-if="subscription.failure_count"
                    class="rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                  >
                    Failures {{ subscription.failure_count }}
                  </span>
                </div>
                <p class="mt-2 break-all text-sm font-medium text-cyan-700 dark:text-cyan-300">{{ subscription.url }}</p>
                <div class="mt-3 flex flex-wrap gap-2">
                  <span
                    v-for="eventKey in subscription.events"
                    :key="`${subscription.id}-${eventKey}`"
                    class="rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300"
                  >
                    {{ eventKey }}
                  </span>
                </div>
                <div class="mt-4 grid grid-cols-1 gap-3 text-xs text-gray-500 dark:text-gray-400 sm:grid-cols-2">
                  <p>Timeout: {{ subscription.timeout_ms }} ms</p>
                  <p>Secret: {{ subscription.secret_hint }}</p>
                  <p>Last success: {{ formatStamp(subscription.last_success_at) }}</p>
                  <p>Last failure: {{ formatStamp(subscription.last_failure_at) }}</p>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <AppButton size="sm" variant="secondary" @click="editSubscription(subscription)">Edit</AppButton>
                <AppButton size="sm" variant="secondary" @click="runTest(subscription.id)">Send Test</AppButton>
                <AppButton
                  size="sm"
                  :variant="subscription.active ? 'secondary' : 'primary'"
                  @click="toggleSubscription(subscription)"
                >
                  {{ subscription.active ? 'Pause' : 'Activate' }}
                </AppButton>
              </div>
            </div>
          </div>

          <EmptyState
            v-if="!subscriptions.length"
            title="No webhook endpoints"
            message="Register your first integration endpoint to begin streaming ERP events outward."
          />
        </div>
      </AppCard>
    </div>

    <AppCard title="Recent Delivery Log" :no-padding="true" class="overflow-hidden">
      <div class="flex flex-col gap-3 border-b border-gray-100 p-4 dark:border-gray-700 sm:flex-row sm:items-end">
        <div class="sm:w-72">
          <AppInput v-model="deliverySubscriptionId" type="select" label="Endpoint">
            <option value="">All Endpoints</option>
            <option v-for="subscription in subscriptions" :key="subscription.id" :value="String(subscription.id)">
              {{ subscription.name }}
            </option>
          </AppInput>
        </div>
        <div class="sm:w-48">
          <AppInput v-model="deliveryStatus" type="select" label="Status">
            <option value="">All Statuses</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </AppInput>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="bg-gray-50/40 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:bg-gray-900/30">
              <th class="px-6 py-4">When</th>
              <th class="px-6 py-4">Endpoint</th>
              <th class="px-6 py-4">Event</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4">Response</th>
              <th class="px-6 py-4">Error</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
            <tr
              v-for="delivery in filteredDeliveries"
              :key="delivery.id"
              class="transition-all hover:bg-gray-50/50 dark:hover:bg-gray-800/40"
            >
              <td class="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">{{ formatStamp(delivery.created_at) }}</td>
              <td class="px-6 py-4">
                <p class="font-black text-gray-900 dark:text-white">{{ delivery.subscription_name || 'Webhook' }}</p>
                <p class="text-[10px] uppercase tracking-widest text-gray-400">Attempt {{ delivery.attempt }}</p>
              </td>
              <td class="px-6 py-4 text-xs font-black uppercase tracking-widest text-cyan-700 dark:text-cyan-300">
                {{ delivery.event_type }}
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest',
                    deliveryStatusClass(delivery.status),
                  ]"
                >
                  {{ delivery.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-xs text-gray-600 dark:text-gray-300">
                {{ delivery.response_status || '--' }}
              </td>
              <td class="px-6 py-4 text-xs text-rose-600 dark:text-rose-300">
                {{ delivery.error || '--' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <EmptyState
        v-if="!filteredDeliveries.length"
        title="No delivery records"
        message="Webhook delivery activity will appear here after the first outgoing event."
      />
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppInput from '@/components/ui/AppInput.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useToastStore } from '@/stores/toast'
import {
  webhooksService,
  type WebhookDeliveryRecord,
  type WebhookEventCatalogItem,
  type WebhookSubscriptionPayload,
  type WebhookSubscriptionRecord,
} from '@/services/webhooksService'

const toast = useToastStore()

const loading = ref(false)
const saving = ref(false)
const editingId = ref<number | null>(null)
const catalog = ref<WebhookEventCatalogItem[]>([])
const subscriptions = ref<WebhookSubscriptionRecord[]>([])
const deliveries = ref<WebhookDeliveryRecord[]>([])
const deliverySubscriptionId = ref('')
const deliveryStatus = ref('')

const form = reactive({
  name: '',
  url: '',
  timeout_ms: 5000,
  secret: '',
  active: true,
  events: [] as string[],
  headers_json: '',
})

const activeCount = computed(() => subscriptions.value.filter((item) => item.active).length)
const failingSubscriptions = computed(() => subscriptions.value.filter((item) => item.failure_count > 0).length)
const successDeliveries = computed(() => deliveries.value.filter((item) => item.status === 'success').length)
const failedDeliveries = computed(() => deliveries.value.filter((item) => item.status === 'failed').length)

const filteredDeliveries = computed(() => {
  return deliveries.value.filter((delivery) => {
    if (deliverySubscriptionId.value && String(delivery.subscription_id) !== deliverySubscriptionId.value) return false
    if (deliveryStatus.value && delivery.status !== deliveryStatus.value) return false
    return true
  })
})

function formatStamp(value: string | null) {
  if (!value) return 'Never'
  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function deliveryStatusClass(status: WebhookDeliveryRecord['status']) {
  if (status === 'success') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
  if (status === 'failed') return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
  return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
}

function toggleEvent(eventKey: string) {
  if (form.events.includes(eventKey)) {
    form.events = form.events.filter((value) => value !== eventKey)
  } else {
    form.events = [...form.events, eventKey]
  }
}

function resetForm() {
  editingId.value = null
  form.name = ''
  form.url = ''
  form.timeout_ms = 5000
  form.secret = ''
  form.active = true
  form.events = []
  form.headers_json = ''
}

function parseHeadersInput() {
  if (!form.headers_json.trim()) return undefined
  const parsed = JSON.parse(form.headers_json) as Record<string, string>
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Custom headers must be a JSON object')
  }
  return parsed
}

function populateForm(subscription: WebhookSubscriptionRecord) {
  editingId.value = subscription.id
  form.name = subscription.name
  form.url = subscription.url
  form.timeout_ms = subscription.timeout_ms
  form.secret = ''
  form.active = subscription.active
  form.events = [...subscription.events]
  form.headers_json = Object.keys(subscription.headers || {}).length ? JSON.stringify(subscription.headers, null, 2) : ''
}

async function loadSubscriptions() {
  subscriptions.value = await webhooksService.listSubscriptions()
}

async function loadDeliveries() {
  const response = await webhooksService.listDeliveries({ page: 1, per_page: 50 })
  deliveries.value = response.items
}

async function loadCatalog() {
  const response = await webhooksService.getCatalog()
  catalog.value = response.events
}

async function refreshAll() {
  loading.value = true
  try {
    await Promise.all([loadCatalog(), loadSubscriptions(), loadDeliveries()])
  } catch {
    toast.error('Failed to load webhook data')
  } finally {
    loading.value = false
  }
}

async function handleSave() {
  if (!form.name.trim() || !form.url.trim() || !form.events.length) {
    toast.warning('Name, URL, and at least one event are required')
    return
  }

  saving.value = true
  try {
    const payload: WebhookSubscriptionPayload = {
      name: form.name.trim(),
      url: form.url.trim(),
      events: [...form.events],
      active: form.active,
      timeout_ms: Number(form.timeout_ms) || 5000,
      headers: parseHeadersInput(),
    }
    if (form.secret.trim()) payload.secret = form.secret.trim()

    if (editingId.value) {
      await webhooksService.updateSubscription(editingId.value, payload)
      toast.success('Webhook endpoint updated')
    } else {
      await webhooksService.createSubscription(payload)
      toast.success('Webhook endpoint created')
    }

    resetForm()
    await Promise.all([loadSubscriptions(), loadDeliveries()])
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save webhook endpoint'
    toast.error(message)
  } finally {
    saving.value = false
  }
}

function editSubscription(subscription: WebhookSubscriptionRecord) {
  populateForm(subscription)
}

async function toggleSubscription(subscription: WebhookSubscriptionRecord) {
  try {
    await webhooksService.updateSubscription(subscription.id, {
      active: !subscription.active,
    })
    toast.success(subscription.active ? 'Webhook paused' : 'Webhook activated')
    await loadSubscriptions()
  } catch {
    toast.error('Failed to update webhook status')
  }
}

async function runTest(id: number) {
  try {
    await webhooksService.sendTest(id)
    toast.success('Webhook test event dispatched')
    await loadDeliveries()
  } catch {
    toast.error('Failed to send test event')
  }
}

onMounted(() => {
  void refreshAll()
})
</script>

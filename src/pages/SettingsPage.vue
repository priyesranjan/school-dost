<template>
  <div class="space-y-6">
    <!-- Tabs -->
    <div class="flex gap-1 rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        :class="[
          'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors',
          activeTab === tab.key ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- School Info -->
    <template v-if="activeTab === 'school'">
      <AppCard title="School Information">
        <form @submit.prevent="saveSchoolInfo" class="space-y-4">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AppInput v-model="schoolForm.school_name" label="School Name" required />
            <AppInput v-model="schoolForm.principal_name" label="Principal Name" required />
            <AppInput v-model="schoolForm.school_phone" label="Phone" type="tel" />
            <AppInput v-model="schoolForm.school_email" label="Email" type="email" />
            <AppInput v-model="schoolForm.academic_year" label="Academic Year" placeholder="2025-26" />
          </div>
          <AppInput v-model="schoolForm.school_address" label="Address" type="textarea" :rows="2" />

          <div class="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
            <div class="flex items-center justify-between">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">Ops SLA Policy</p>
              <span class="text-xs text-gray-500 dark:text-gray-400">Last updated: {{ new Date(schoolForm.sla_policy_updated_at).toLocaleString() }}</span>
            </div>
            <p v-if="!canManageSlaPolicy" class="text-xs text-amber-600 dark:text-amber-300">Only admin can modify SLA policy. Values shown are read-only.</p>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <AppInput v-model="schoolForm.sla_critical_minutes" type="number" label="Critical SLA (minutes)" :disabled="!canManageSlaPolicy" />
              <AppInput v-model="schoolForm.sla_warning_minutes" type="number" label="Warning SLA (minutes)" :disabled="!canManageSlaPolicy" />
              <AppInput v-model="schoolForm.sla_info_minutes" type="number" label="Info SLA (minutes)" :disabled="!canManageSlaPolicy" />
              <AppInput v-model="schoolForm.sla_policy_version" label="Policy Version" placeholder="v1" :disabled="!canManageSlaPolicy" />
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-xs text-gray-500 dark:text-gray-400">Presets:</span>
              <AppButton size="sm" variant="secondary" :disabled="!canManageSlaPolicy" @click="applySlaPreset('strict')">Strict (10/30/120)</AppButton>
              <AppButton size="sm" variant="secondary" :disabled="!canManageSlaPolicy" @click="applySlaPreset('standard')">Standard (15/60/240)</AppButton>
              <AppButton size="sm" variant="secondary" :disabled="!canManageSlaPolicy" @click="applySlaPreset('relaxed')">Relaxed (30/120/480)</AppButton>
            </div>
          </div>

          <div class="flex justify-end">
            <AppButton type="submit">Save Settings</AppButton>
          </div>
        </form>
      </AppCard>
    </template>

    <!-- SMS Settings -->
    <template v-if="activeTab === 'sms'">
      <AppCard title="SMS Configuration">
        <form @submit.prevent="saveSmsSettings" class="space-y-4">
          <div class="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">Enable SMS Notifications</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Send SMS for payments and due reminders</p>
            </div>
            <button
              type="button"
              role="switch"
              :aria-checked="smsForm.sms_enabled"
              @click="smsForm.sms_enabled = !smsForm.sms_enabled"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                smsForm.sms_enabled ? 'bg-primary-600' : 'bg-gray-300',
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 rounded-full bg-white transition-transform',
                  smsForm.sms_enabled ? 'translate-x-6' : 'translate-x-1',
                ]"
              />
            </button>
          </div>

          <div v-if="smsForm.sms_enabled" class="space-y-4">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <AppInput v-model="smsForm.sms_api_key" label="SMS API Key" placeholder="Enter API key" />
              <AppInput v-model="smsForm.sms_sender_id" label="Sender ID" placeholder="SCHOOL" />
            </div>

            <div class="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">2Factor OTP</p>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Enable OTP Login</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Require OTP at sign in</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  :aria-checked="smsForm.otp_enabled"
                  @click="smsForm.otp_enabled = !smsForm.otp_enabled"
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    smsForm.otp_enabled ? 'bg-primary-600' : 'bg-gray-300',
                  ]"
                >
                  <span
                    :class="[
                      'inline-block h-4 w-4 rounded-full bg-white transition-transform',
                      smsForm.otp_enabled ? 'translate-x-6' : 'translate-x-1',
                    ]"
                  />
                </button>
              </div>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <AppInput v-model="smsForm.otp_mode" type="select" label="OTP Mode">
                  <option value="demo">Demo</option>
                  <option value="api">API (2Factor)</option>
                </AppInput>
                <AppInput v-model="smsForm.twofactor_api_key" label="2Factor API Key" placeholder="Enter 2Factor key" />
                <AppInput v-model="smsForm.twofactor_template_login" label="Login OTP Template" placeholder="Your OTP is {{otp}}" />
              </div>
            </div>

            <div class="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">Cloudflare R2 Storage</p>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Enable R2 Uploads</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Use R2 for photos and documents</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  :aria-checked="smsForm.r2_enabled"
                  @click="smsForm.r2_enabled = !smsForm.r2_enabled"
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    smsForm.r2_enabled ? 'bg-primary-600' : 'bg-gray-300',
                  ]"
                >
                  <span
                    :class="[
                      'inline-block h-4 w-4 rounded-full bg-white transition-transform',
                      smsForm.r2_enabled ? 'translate-x-6' : 'translate-x-1',
                    ]"
                  />
                </button>
              </div>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <AppInput v-model="smsForm.r2_mode" type="select" label="R2 Mode">
                  <option value="demo">Demo</option>
                  <option value="api">API (Signed Upload)</option>
                </AppInput>
                <AppInput v-model="smsForm.r2_bucket" label="R2 Bucket" placeholder="school-erp-assets" />
                <AppInput v-model="smsForm.r2_public_base_url" label="R2 Public URL" placeholder="https://cdn.example.com" />
              </div>
            </div>

            <div class="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">Audit Signature</p>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <AppInput v-model="smsForm.audit_signature_mode" type="select" label="Signature Mode">
                  <option value="local">Local (Demo)</option>
                  <option value="api">API (Server Signed)</option>
                </AppInput>
                <AppInput
                  v-model="smsForm.audit_signature_endpoint"
                  label="Signature Endpoint"
                  placeholder="/api/audit/sign"
                />
              </div>
            </div>

            <div class="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
              <div class="flex items-center justify-between">
                <p class="text-sm font-semibold text-gray-900 dark:text-white">Integration Readiness</p>
                <span class="text-xs" :class="isReadyForApi ? 'text-emerald-600 dark:text-emerald-300' : 'text-amber-600 dark:text-amber-300'">
                  {{ isReadyForApi ? 'Ready' : 'Action Required' }}
                </span>
              </div>
              <ul class="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                <li v-for="check in readinessChecks" :key="check.key" class="flex items-center justify-between">
                  <span>{{ check.message }}</span>
                  <span :class="check.ok ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'">
                    {{ check.ok ? 'OK' : 'Missing' }}
                  </span>
                </li>
              </ul>
              <div class="pt-2">
                <AppButton size="sm" variant="secondary" :disabled="probingEndpoints" @click="handleRunEndpointChecks">
                  {{ probingEndpoints ? 'Checking...' : 'Run Live Endpoint Checks' }}
                </AppButton>
              </div>
              <ul v-if="endpointChecks.length" class="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                <li v-for="check in endpointChecks" :key="check.key" class="flex items-center justify-between gap-4">
                  <span class="truncate">{{ check.label }} ({{ check.url }})</span>
                  <span :class="check.ok ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'">
                    {{ check.ok ? check.message : check.message }}
                  </span>
                </li>
              </ul>
              <div class="border-t border-gray-100 pt-3 dark:border-gray-700">
                <div class="mb-2 flex items-center justify-between">
                  <p class="text-xs font-medium text-gray-700 dark:text-gray-200">Circuit Breaker Status</p>
                  <div class="flex items-center gap-2">
                    <AppButton size="sm" variant="secondary" @click="refreshCircuits">Refresh</AppButton>
                    <AppButton size="sm" variant="secondary" @click="resetCircuits">Reset All</AppButton>
                  </div>
                </div>
                <ul v-if="circuitStates.length" class="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                  <li v-for="c in circuitStates" :key="c.key" class="flex items-center justify-between gap-3">
                    <span>{{ c.key }} (fails: {{ c.failures }})</span>
                    <div class="flex items-center gap-2">
                      <span :class="c.status === 'open' ? 'text-rose-600 dark:text-rose-300' : c.status === 'half_open' ? 'text-amber-600 dark:text-amber-300' : 'text-emerald-600 dark:text-emerald-300'">
                        {{
                          c.status === 'open' && c.openedAt
                            ? `Open (${Math.max(0, Math.ceil((c.cooldownMs - (nowTs - c.openedAt)) / 1000))}s)`
                            : c.status === 'half_open'
                              ? 'Half-Open (probe)'
                              : 'Closed'
                        }}
                      </span>
                      <AppButton size="sm" variant="secondary" @click="resetCircuit(c.key)">Reset</AppButton>
                    </div>
                  </li>
                </ul>
                <p v-else class="text-xs text-gray-500 dark:text-gray-400">No circuit records yet.</p>
                <div class="mt-3 border-t border-gray-100 pt-3 dark:border-gray-700">
                  <p class="mb-2 text-xs font-medium text-gray-700 dark:text-gray-200">Recent Circuit Events</p>
                  <ul v-if="circuitEvents.length" class="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                    <li v-for="e in circuitEvents" :key="e.id" class="flex items-center justify-between gap-3">
                      <span class="truncate">{{ e.key }} · {{ e.type }} · {{ e.detail }}</span>
                      <span class="text-gray-500 dark:text-gray-400">{{ formatEventTime(e.createdAt) }}</span>
                    </li>
                  </ul>
                  <p v-else class="text-xs text-gray-500 dark:text-gray-400">No circuit events yet.</p>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Auto SMS on Payment</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Send receipt SMS when fee is collected</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  :aria-checked="smsForm.auto_sms_on_payment"
                  @click="smsForm.auto_sms_on_payment = !smsForm.auto_sms_on_payment"
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    smsForm.auto_sms_on_payment ? 'bg-primary-600' : 'bg-gray-300',
                  ]"
                >
                  <span
                    :class="[
                      'inline-block h-4 w-4 rounded-full bg-white transition-transform',
                      smsForm.auto_sms_on_payment ? 'translate-x-6' : 'translate-x-1',
                    ]"
                  />
                </button>
              </div>

              <div class="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Auto SMS on Due</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Send reminder when fee is overdue</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  :aria-checked="smsForm.auto_sms_on_due"
                  @click="smsForm.auto_sms_on_due = !smsForm.auto_sms_on_due"
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    smsForm.auto_sms_on_due ? 'bg-primary-600' : 'bg-gray-300',
                  ]"
                >
                  <span
                    :class="[
                      'inline-block h-4 w-4 rounded-full bg-white transition-transform',
                      smsForm.auto_sms_on_due ? 'translate-x-6' : 'translate-x-1',
                    ]"
                  />
                </button>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <AppButton type="submit">Save SMS Settings</AppButton>
          </div>
        </form>
      </AppCard>
    </template>

    <!-- Users & Roles -->
    <template v-if="activeTab === 'users'">
      <AppCard :no-padding="true">
        <div class="flex items-center justify-between p-4">
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ settingsStore.users.length }} users</p>
          <AppButton size="sm" @click="openAddUserModal">+ Add User</AppButton>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-y border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Name</th>
                <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Email</th>
                <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Role</th>
                <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Last Login</th>
                <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-gray-700">
              <tr v-for="user in settingsStore.users" :key="user.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-700/50">
                <td class="px-6 py-3">
                  <div class="flex items-center gap-3">
                    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                      {{ user.name.charAt(0) }}
                    </div>
                    <span class="font-medium text-gray-900 dark:text-white">{{ user.name }}</span>
                  </div>
                </td>
                <td class="px-6 py-3 text-gray-600 dark:text-gray-300">{{ user.email }}</td>
                <td class="px-6 py-3">
                  <StatusBadge :color="roleColor(user.role)">{{ user.role }}</StatusBadge>
                </td>
                <td class="px-6 py-3">
                  <StatusBadge :color="user.status === 'active' ? 'green' : 'red'">{{ user.status }}</StatusBadge>
                </td>
                <td class="px-6 py-3 text-gray-500 dark:text-gray-400 text-xs">{{ user.last_login || 'Never' }}</td>
                <td class="px-6 py-3">
                  <div class="flex items-center gap-1">
                    <button @click="editUser(user)" class="rounded p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600" title="Edit">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button v-if="user.id !== 1" @click="settingsStore.deleteUser(user.id)" class="rounded p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600" title="Delete">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </AppCard>

      <!-- Add/Edit User Modal -->
      <AppModal v-model="showUserModal" :title="editingUser ? 'Edit User' : 'Add User'" size="md">
        <form @submit.prevent="handleSaveUser" class="space-y-4">
          <AppInput v-model="userForm.name" label="Full Name" required />
          <AppInput v-model="userForm.email" label="Email" type="email" required />
          <AppInput v-model="userForm.role" type="select" label="Role" required>
            <option value="admin">Admin</option>
            <option value="accountant">Accountant</option>
            <option value="teacher">Teacher</option>
            <option value="receptionist">Receptionist</option>
          </AppInput>
          <AppInput v-model="userForm.status" type="select" label="Status">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </AppInput>
        </form>
        <template #footer>
          <div class="flex items-center justify-end gap-3">
            <AppButton variant="secondary" @click="showUserModal = false">Cancel</AppButton>
            <AppButton @click="handleSaveUser">{{ editingUser ? 'Save' : 'Add User' }}</AppButton>
          </div>
        </template>
      </AppModal>
    </template>

    <template v-if="activeTab === 'data'">
      <AppCard title="Data Operations">
        <div class="space-y-5">
          <div class="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <p class="text-sm font-semibold text-gray-900 dark:text-white">Snapshot Export</p>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Download complete ERP local data as JSON backup.</p>
            <div class="mt-3 flex items-center justify-between">
              <span class="text-xs text-gray-500 dark:text-gray-400">Schema Version: v{{ schemaVersion }}</span>
              <AppButton size="sm" @click="handleExportSnapshot">Export Backup</AppButton>
            </div>
          </div>

          <div class="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
            <p class="text-sm font-semibold text-gray-900 dark:text-white">Snapshot Import</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">Upload backup file and choose merge or full replace mode.</p>
            <AppInput v-model="importMode" type="select" label="Import Mode">
              <option value="merge">Merge into existing data</option>
              <option value="replace">Replace all existing ERP data</option>
            </AppInput>
            <input ref="snapshotFileInput" type="file" accept="application/json" class="block w-full text-sm text-gray-600 dark:text-gray-300" @change="handleSnapshotPicked" />
            <div class="flex justify-end">
              <AppButton variant="secondary" @click="handleImportSnapshot">Import Backup</AppButton>
            </div>
          </div>
        </div>
      </AppCard>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import type { UserRole } from '@/types'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import { useToastStore } from '@/stores/toast'
import { useAuditStore } from '@/stores/audit'
import { evaluateIntegrationReadiness } from '@/services/integrationReadinessService'
import { SCHEMA_VERSION, downloadErpSnapshot, importErpSnapshot, type ErpSnapshot } from '@/services/dataMigrationService'
import { runIntegrationEndpointProbes, type EndpointProbeResult } from '@/services/integrationProbeService'
import {
  clearAllCircuitBreakers,
  clearCircuitBreaker,
  getCircuitBreakersSnapshot,
  getCircuitEventsSnapshot,
  type CircuitBreakerEvent,
  type CircuitBreakerState,
} from '@/services/circuitBreakerService'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'

const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const toast = useToastStore()
const auditStore = useAuditStore()
const canManageSlaPolicy = computed(() => authStore.user?.role === 'admin')

const activeTab = ref('school')
const tabs = [
  { key: 'school', label: 'School Info' },
  { key: 'sms', label: 'SMS Settings' },
  { key: 'users', label: 'Users & Roles' },
  { key: 'data', label: 'Data Ops' },
]

// School Info Form
const schoolForm = reactive({ ...settingsStore.settings })
onMounted(() => {
  Object.assign(schoolForm, settingsStore.settings)
  refreshCircuits()
  circuitTicker = window.setInterval(() => {
    nowTs.value = Date.now()
    refreshCircuits()
  }, 5000)
})

onUnmounted(() => {
  if (circuitTicker !== null) {
    window.clearInterval(circuitTicker)
    circuitTicker = null
  }
})

function saveSchoolInfo() {
  const critical = normalizePositiveMinutes(schoolForm.sla_critical_minutes, settingsStore.settings.sla_critical_minutes)
  const warning = normalizePositiveMinutes(schoolForm.sla_warning_minutes, settingsStore.settings.sla_warning_minutes)
  const info = normalizePositiveMinutes(schoolForm.sla_info_minutes, settingsStore.settings.sla_info_minutes)
  const existingPolicy = {
    critical: settingsStore.settings.sla_critical_minutes,
    warning: settingsStore.settings.sla_warning_minutes,
    info: settingsStore.settings.sla_info_minutes,
    version: settingsStore.settings.sla_policy_version,
  }
  const nextPolicy = {
    critical: canManageSlaPolicy.value ? critical : existingPolicy.critical,
    warning: canManageSlaPolicy.value ? warning : existingPolicy.warning,
    info: canManageSlaPolicy.value ? info : existingPolicy.info,
    version: canManageSlaPolicy.value
      ? String(schoolForm.sla_policy_version || settingsStore.settings.sla_policy_version || 'v1').trim()
      : existingPolicy.version,
  }
  const policyChanged =
    nextPolicy.critical !== existingPolicy.critical ||
    nextPolicy.warning !== existingPolicy.warning ||
    nextPolicy.info !== existingPolicy.info ||
    nextPolicy.version !== existingPolicy.version
  const savedAt = policyChanged ? new Date().toISOString() : settingsStore.settings.sla_policy_updated_at

  settingsStore.updateSettings({
    school_name: schoolForm.school_name,
    school_address: schoolForm.school_address,
    school_phone: schoolForm.school_phone,
    school_email: schoolForm.school_email,
    principal_name: schoolForm.principal_name,
    academic_year: schoolForm.academic_year,
    sla_critical_minutes: nextPolicy.critical,
    sla_warning_minutes: nextPolicy.warning,
    sla_info_minutes: nextPolicy.info,
    sla_policy_version: nextPolicy.version,
    sla_policy_updated_at: savedAt,
  })

  schoolForm.sla_critical_minutes = nextPolicy.critical
  schoolForm.sla_warning_minutes = nextPolicy.warning
  schoolForm.sla_info_minutes = nextPolicy.info
  schoolForm.sla_policy_version = nextPolicy.version
  schoolForm.sla_policy_updated_at = savedAt

  if (policyChanged) {
    const actorName = authStore.user?.name || 'Settings Operator'
    const actorRole = authStore.user?.role || 'admin'
    void auditStore.addLog({
      action: 'sla_policy_updated',
      module: 'settings',
      actor_name: actorName,
      actor_role: actorRole,
      target: 'Ops SLA Policy',
      metadata: `from c:${existingPolicy.critical}/w:${existingPolicy.warning}/i:${existingPolicy.info}/${existingPolicy.version} to c:${nextPolicy.critical}/w:${nextPolicy.warning}/i:${nextPolicy.info}/${nextPolicy.version}`,
    })
  }
}

function normalizePositiveMinutes(value: string | number, fallback: number) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.max(1, Math.round(parsed))
}

function applySlaPreset(mode: 'strict' | 'standard' | 'relaxed') {
  if (!canManageSlaPolicy.value) return

  if (mode === 'strict') {
    schoolForm.sla_critical_minutes = 10
    schoolForm.sla_warning_minutes = 30
    schoolForm.sla_info_minutes = 120
  } else if (mode === 'standard') {
    schoolForm.sla_critical_minutes = 15
    schoolForm.sla_warning_minutes = 60
    schoolForm.sla_info_minutes = 240
  } else {
    schoolForm.sla_critical_minutes = 30
    schoolForm.sla_warning_minutes = 120
    schoolForm.sla_info_minutes = 480
  }
}

// SMS Form
const smsForm = reactive({
  sms_enabled: settingsStore.settings.sms_enabled,
  sms_api_key: settingsStore.settings.sms_api_key,
  sms_sender_id: settingsStore.settings.sms_sender_id,
  auto_sms_on_payment: settingsStore.settings.auto_sms_on_payment,
  auto_sms_on_due: settingsStore.settings.auto_sms_on_due,
  otp_enabled: settingsStore.settings.otp_enabled,
  otp_mode: settingsStore.settings.otp_mode,
  twofactor_api_key: settingsStore.settings.twofactor_api_key,
  twofactor_template_login: settingsStore.settings.twofactor_template_login,
  r2_enabled: settingsStore.settings.r2_enabled,
  r2_mode: settingsStore.settings.r2_mode,
  r2_bucket: settingsStore.settings.r2_bucket,
  r2_public_base_url: settingsStore.settings.r2_public_base_url,
  audit_signature_mode: settingsStore.settings.audit_signature_mode,
  audit_signature_endpoint: settingsStore.settings.audit_signature_endpoint,
})

function saveSmsSettings() {
  settingsStore.updateSettings({ ...smsForm })
}

const readinessChecks = computed(() => evaluateIntegrationReadiness(smsForm as unknown as typeof settingsStore.settings))
const isReadyForApi = computed(() => readinessChecks.value.every((c) => c.ok))
const probingEndpoints = ref(false)
const endpointChecks = ref<EndpointProbeResult[]>([])
const circuitStates = ref<CircuitBreakerState[]>([])
const circuitEvents = ref<CircuitBreakerEvent[]>([])
const nowTs = ref(Date.now())
let circuitTicker: number | null = null

function refreshCircuits() {
  circuitStates.value = getCircuitBreakersSnapshot()
  circuitEvents.value = getCircuitEventsSnapshot(8)
}

function resetCircuits() {
  clearAllCircuitBreakers()
  refreshCircuits()
  auditStore.addLog({
    action: 'circuit_reset_all',
    module: 'audit',
    actor_name: 'Settings Operator',
    actor_role: 'admin',
    target: 'All Circuit Breakers',
    metadata: 'Reset all circuit breakers from settings',
  })
  toast.success('Circuit breakers reset')
}

function resetCircuit(key: string) {
  clearCircuitBreaker(key)
  refreshCircuits()
  auditStore.addLog({
    action: 'circuit_reset_single',
    module: 'audit',
    actor_name: 'Settings Operator',
    actor_role: 'admin',
    target: key,
    metadata: 'Reset single circuit breaker from settings',
  })
  toast.success(`Circuit reset: ${key}`)
}

function formatEventTime(ts: number) {
  return new Date(ts).toLocaleTimeString()
}

async function handleRunEndpointChecks() {
  probingEndpoints.value = true
  try {
    endpointChecks.value = await runIntegrationEndpointProbes(smsForm as unknown as typeof settingsStore.settings)
    refreshCircuits()
    const failed = endpointChecks.value.filter((x) => !x.ok).length
    auditStore.addLog({
      action: 'integration_endpoint_checks',
      module: 'audit',
      actor_name: 'Settings Operator',
      actor_role: 'admin',
      target: 'Integration Readiness',
      metadata: failed ? `${failed} endpoint checks failed` : 'All endpoint checks passed',
    })
    if (failed) {
      toast.warning(`${failed} endpoint checks failed`)
    } else {
      toast.success('All endpoint checks passed')
    }
  } catch {
    toast.error('Endpoint checks failed to run')
  } finally {
    probingEndpoints.value = false
  }
}

const schemaVersion = SCHEMA_VERSION
const importMode = ref<'merge' | 'replace'>('merge')
const snapshotFileInput = ref<HTMLInputElement | null>(null)
const selectedSnapshot = ref<ErpSnapshot | null>(null)

function handleExportSnapshot() {
  downloadErpSnapshot()
}

async function handleSnapshotPicked(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) {
    selectedSnapshot.value = null
    return
  }

  try {
    const text = await file.text()
    selectedSnapshot.value = JSON.parse(text) as ErpSnapshot
    toast.success('Backup file loaded')
  } catch {
    selectedSnapshot.value = null
    toast.error('Invalid backup file')
  }
}

function handleImportSnapshot() {
  if (!selectedSnapshot.value) {
    toast.warning('Please choose a backup file first')
    return
  }

  try {
    const result = importErpSnapshot(selectedSnapshot.value, importMode.value)
    toast.success(`Imported ${result.imported_keys} keys (schema v${result.schema_version})`)
    window.location.reload()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Import failed'
    toast.error(message)
  }
}

// Users
const showUserModal = ref(false)
const editingUser = ref<UserRole | null>(null)
const userForm = reactive({ name: '', email: '', role: 'teacher' as UserRole['role'], status: 'active' as UserRole['status'] })

function openAddUserModal() {
  editingUser.value = null
  Object.assign(userForm, { name: '', email: '', role: 'teacher', status: 'active' })
  showUserModal.value = true
}

function editUser(user: UserRole) {
  editingUser.value = user
  Object.assign(userForm, { name: user.name, email: user.email, role: user.role, status: user.status })
  showUserModal.value = true
}

function handleSaveUser() {
  if (!userForm.name || !userForm.email) return
  if (editingUser.value) {
    settingsStore.updateUser(editingUser.value.id, { ...userForm })
  } else {
    settingsStore.addUser({ ...userForm })
  }
  showUserModal.value = false
  editingUser.value = null
  Object.assign(userForm, { name: '', email: '', role: 'teacher', status: 'active' })
}

function roleColor(role: string) {
  const map: Record<string, 'blue' | 'green' | 'yellow' | 'gray'> = { admin: 'blue', accountant: 'green', teacher: 'yellow', receptionist: 'gray' }
  return map[role] || 'gray'
}
</script>

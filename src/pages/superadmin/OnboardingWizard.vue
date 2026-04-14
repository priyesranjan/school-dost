<template>
  <div class="mx-auto max-w-3xl space-y-8">
    <!-- Progress Steps -->
    <div class="flex items-center justify-center gap-0">
      <div v-for="(step, idx) in steps" :key="idx" class="flex items-center">
        <div
          :class="[
            'flex h-10 w-10 items-center justify-center rounded-full text-sm font-black transition-all',
            currentStep > idx
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
              : currentStep === idx
                ? 'bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30 scale-110'
                : 'bg-gray-800 text-gray-500',
          ]"
        >
          <span v-if="currentStep > idx">✓</span>
          <span v-else>{{ idx + 1 }}</span>
        </div>
        <div
          v-if="idx < steps.length - 1"
          :class="['h-0.5 w-16 transition-colors', currentStep > idx ? 'bg-emerald-500' : 'bg-gray-800']"
        ></div>
      </div>
    </div>
    <p class="text-center text-sm font-bold text-gray-400">{{ steps[currentStep] }}</p>

    <!-- Step 1: Institution Info -->
    <div v-if="currentStep === 0" class="rounded-3xl border border-gray-800 bg-gray-900/50 p-8 space-y-6">
      <h3 class="text-lg font-black text-white">Institution Identity</h3>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label class="block text-xs font-bold text-gray-400 mb-1.5">Institution Name *</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="e.g., Delhi Public School"
            class="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none"
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-400 mb-1.5">Type *</label>
          <select
            v-model="form.type"
            class="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none"
          >
            <option value="school">School (K-12)</option>
            <option value="college">College / University</option>
            <option value="coaching">Coaching Institute</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-400 mb-1.5">Board / Affiliation</label>
          <input
            v-model="form.board"
            type="text"
            placeholder="e.g., CBSE, ICSE, State Board"
            class="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none"
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-400 mb-1.5">City *</label>
          <input
            v-model="form.city"
            type="text"
            placeholder="e.g., New Delhi"
            class="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none"
          />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-xs font-bold text-gray-400 mb-1.5">State *</label>
          <input
            v-model="form.state"
            type="text"
            placeholder="e.g., Delhi"
            class="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none"
          />
        </div>
      </div>
    </div>

    <!-- Step 2: Admin Credentials -->
    <div v-if="currentStep === 1" class="rounded-3xl border border-gray-800 bg-gray-900/50 p-8 space-y-6">
      <h3 class="text-lg font-black text-white">Admin Credentials</h3>
      <p class="text-xs text-gray-500">
        These credentials will be used by the institution's admin to access their ERP dashboard.
      </p>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label class="block text-xs font-bold text-gray-400 mb-1.5">Admin Name *</label>
          <input
            v-model="form.admin_name"
            type="text"
            placeholder="e.g., Dr. Rakesh Kumar"
            class="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none"
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-400 mb-1.5">Admin Email *</label>
          <input
            v-model="form.admin_email"
            type="email"
            placeholder="e.g., admin@dps.edu"
            class="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none"
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-400 mb-1.5">Admin Phone *</label>
          <input
            v-model="form.admin_phone"
            type="tel"
            placeholder="e.g., 9876543210"
            class="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none"
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-400 mb-1.5">Auto-Generated Password</label>
          <div class="flex items-center gap-2">
            <input
              :value="generatedPassword"
              type="text"
              readonly
              class="flex-1 rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-sm text-violet-400 font-mono"
            />
            <button
              @click="regeneratePassword"
              class="rounded-xl border border-gray-700 p-3 text-gray-400 hover:bg-gray-800 transition-colors"
            >
              🔄
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 3: Plan Selection -->
    <div v-if="currentStep === 2" class="rounded-3xl border border-gray-800 bg-gray-900/50 p-8 space-y-6">
      <h3 class="text-lg font-black text-white">Subscription Plan</h3>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button
          v-for="plan in plans"
          :key="plan.key"
          @click="form.plan = plan.key"
          :class="[
            'flex flex-col items-center gap-3 rounded-2xl border p-6 transition-all hover:scale-105',
            form.plan === plan.key
              ? 'border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/20'
              : 'border-gray-700 bg-gray-800/30 hover:border-gray-600',
          ]"
        >
          <span class="text-3xl">{{ plan.icon }}</span>
          <span class="text-sm font-black text-white">{{ plan.name }}</span>
          <span class="text-lg font-black" :class="form.plan === plan.key ? 'text-violet-400' : 'text-gray-400'">{{
            plan.price
          }}</span>
          <span class="text-[10px] text-gray-500">{{ plan.desc }}</span>
        </button>
      </div>
    </div>

    <!-- Step 4: Review & Confirm -->
    <div v-if="currentStep === 3" class="rounded-3xl border border-gray-800 bg-gray-900/50 p-8 space-y-6">
      <h3 class="text-lg font-black text-white">Review & Confirm</h3>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div class="space-y-4">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-500">Institution</p>
            <p class="text-lg font-black text-white">{{ form.name }}</p>
            <p class="text-xs text-gray-400">{{ form.type }} · {{ form.board || 'N/A' }}</p>
          </div>
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-500">Location</p>
            <p class="text-sm text-gray-300">{{ form.city }}, {{ form.state }}</p>
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-500">Admin</p>
            <p class="text-sm font-bold text-white">{{ form.admin_name }}</p>
            <p class="text-xs text-gray-400">{{ form.admin_email }}</p>
          </div>
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-500">Plan</p>
            <p class="text-sm font-bold text-violet-400 uppercase">{{ form.plan }}</p>
          </div>
        </div>
      </div>
      <div class="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4">
        <p class="text-xs font-bold text-emerald-400">✅ On confirmation, the following will be auto-created:</p>
        <ul class="mt-2 space-y-1 text-xs text-emerald-300/70">
          <li>• Tenant account with isolated data namespace</li>
          <li>• Admin user with generated credentials</li>
          <li>• Default school settings & brand configuration</li>
        </ul>
      </div>

      <div
        class="mt-4 flex items-center gap-3 rounded-2xl border border-violet-500/30 bg-violet-500/5 p-5 transition-all hover:bg-violet-500/10 cursor-pointer"
        @click="form.seed_demo = !form.seed_demo"
      >
        <input
          type="checkbox"
          v-model="form.seed_demo"
          class="h-5 w-5 rounded border-gray-700 bg-gray-800 text-violet-600 focus:ring-violet-500"
          @click.stop
        />
        <div class="flex-1 min-w-0">
          <p class="text-xs font-black text-white uppercase tracking-widest">Seed Institution with Sample Data</p>
          <p class="mt-1 text-[11px] text-gray-500 leading-relaxed">
            Populate the dashboard with demo students, staff, and records for immediate exploration. Highly recommended
            for trial accounts.
          </p>
        </div>
        <div class="shrink-0 text-2xl">🌱</div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex items-center justify-between">
      <button
        v-if="currentStep > 0"
        @click="currentStep--"
        class="rounded-xl border border-gray-700 px-6 py-3 text-sm font-bold text-gray-400 hover:bg-gray-800 transition-colors"
      >
        ← Back
      </button>
      <div v-else></div>

      <button
        v-if="currentStep < 3"
        @click="nextStep"
        :disabled="!canProceed"
        :class="[
          'rounded-xl px-8 py-3 text-sm font-bold text-white transition-all',
          canProceed
            ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40'
            : 'bg-gray-700 cursor-not-allowed opacity-50',
        ]"
      >
        Continue →
      </button>
      <button
        v-else
        @click="handleOnboard"
        :disabled="provisioning"
        :class="[
          'rounded-xl px-8 py-3 text-sm font-black text-white shadow-lg transition-all',
          provisioning
            ? 'bg-gray-700 cursor-not-allowed opacity-60'
            : 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/20 hover:shadow-emerald-500/40',
        ]"
      >
        <span v-if="provisioning" class="flex items-center gap-2">
          <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Provisioning…
        </span>
        <span v-else>🚀 Provision Institution</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTenantsStore } from '@/stores/tenants'
import { useToastStore } from '@/stores/toast'
import type { InstitutionProfile } from '@/types'
import { extractApiErrorMessage } from '@/services/superadminService'

const router = useRouter()
const tenantsStore = useTenantsStore()
const toast = useToastStore()
const provisioning = ref(false)

const currentStep = ref(0)
const steps = ['Institution Identity', 'Admin Credentials', 'Subscription Plan', 'Review & Confirm']

const form = reactive({
  name: '',
  type: 'school' as InstitutionProfile['type'],
  board: '',
  city: '',
  state: '',
  admin_name: '',
  admin_email: '',
  admin_phone: '',
  plan: 'standard' as InstitutionProfile['subscription_plan'],
  seed_demo: false,
})

const generatedPassword = ref(generatePassword())

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function regeneratePassword() {
  generatedPassword.value = generatePassword()
}

const plans = [
  { key: 'trial' as const, name: 'Free Trial', price: '₹0', icon: '⏳', desc: '14-day trial' },
  { key: 'basic' as const, name: 'Basic', price: '₹999/mo', icon: '🏫', desc: 'Up to 200 students' },
  { key: 'standard' as const, name: 'Standard', price: '₹2,499/mo', icon: '🏛️', desc: 'Up to 1000 students' },
  { key: 'premium' as const, name: 'Premium', price: '₹4,999/mo', icon: '🏆', desc: 'Unlimited' },
]

const canProceed = computed(() => {
  if (currentStep.value === 0) return form.name && form.city && form.state
  if (currentStep.value === 1) return form.admin_name && form.admin_email && form.admin_phone
  if (currentStep.value === 2) return form.plan
  return true
})

function nextStep() {
  if (canProceed.value && currentStep.value < 3) currentStep.value++
}

async function handleOnboard() {
  provisioning.value = true
  try {
    const { provision } = await tenantsStore.onboardInstitution({
      name: form.name,
      type: form.type,
      city: form.city,
      state: form.state,
      board: form.board,
      admin_name: form.admin_name,
      admin_email: form.admin_email,
      admin_phone: form.admin_phone,
      plan: form.plan,
      admin_password: generatedPassword.value,
      seed_demo: form.seed_demo,
    })

    toast.success(
      `${form.name} provisioned! URL: ${provision.subdomain} - Admin: ${provision.adminCredentials.email} / ${provision.adminCredentials.password}`,
    )
    await router.push('/superadmin/institutions')
  } catch (error) {
    toast.error(extractApiErrorMessage(error, 'Provisioning failed'))
  } finally {
    provisioning.value = false
  }
}
</script>

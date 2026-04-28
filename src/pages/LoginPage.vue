<template>
  <div class="w-full">
    <AppCard :glass="true" class="p-2 shadow-2xl sm:p-4">
      <div class="mb-10 text-center">
        <div
          class="animate-hover-pulse mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-primary-400 text-3xl font-black text-white shadow-xl shadow-primary-200 dark:shadow-none"
        >
          SE
        </div>
        <h1 class="text-3xl font-black tracking-tight text-gray-900 dark:text-white">School ERP</h1>
        <p class="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">Secure access to your academic hub</p>
      </div>

      <div class="space-y-6">
        <div
          class="rounded-2xl border border-primary-100 bg-primary-50/50 p-5 text-center text-sm dark:border-primary-900/30 dark:bg-primary-900/10"
        >
          <p class="text-[10px] font-black uppercase tracking-widest text-primary-600">Live Role Login</p>
          <p class="mt-2 leading-relaxed text-gray-600 dark:text-gray-400">Enter user ID and password to continue.</p>
        </div>

        <form class="space-y-4" @submit.prevent="handleManualLogin">
          <AppInput
            v-model="form.email"
            label="User ID / Email"
            type="email"
            placeholder="admin@school.test"
            required
            :error="errors.email"
          />
          <AppInput
            v-model="form.password"
            label="Password"
            type="password"
            placeholder="Enter password"
            required
            :error="errors.password"
          />

          <div class="flex items-center justify-between gap-3 text-xs">
            <label class="inline-flex items-center gap-2 font-bold text-gray-500 dark:text-gray-400">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              Remember me
            </label>
            <button type="button" class="font-black text-primary-600 hover:text-primary-700" @click="showForgotHelp">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            :disabled="auth.loading"
            class="h-12 w-full rounded-xl bg-primary-600 text-base font-black text-white shadow-lg shadow-primary-500/20 transition-all hover:bg-primary-700 disabled:cursor-wait disabled:opacity-60"
          >
            {{ auth.loading ? 'Signing in...' : 'Login' }}
          </button>
        </form>

        <div class="flex items-center gap-3">
          <div class="h-px flex-1 bg-gray-100 dark:bg-gray-700"></div>
          <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Quick Roles</span>
          <div class="h-px flex-1 bg-gray-100 dark:bg-gray-700"></div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="account in roleAccounts"
            :key="account.email"
            type="button"
            :data-role="account.role"
            :disabled="auth.loading"
            class="group flex min-h-20 flex-col items-center justify-center gap-1 rounded-xl border border-gray-100 p-3 text-center transition-all hover:border-primary-200 hover:bg-primary-50/40 disabled:cursor-wait disabled:opacity-60 dark:border-gray-700 dark:hover:bg-primary-900/10"
            @click="handleRoleLogin(account)"
          >
            <span class="text-sm font-bold capitalize text-gray-900 group-hover:text-primary-600 dark:text-white">
              {{ account.role }}
            </span>
            <span class="w-full truncate text-[9px] font-medium uppercase text-gray-400">
              {{ account.email }}
            </span>
          </button>
        </div>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import AppInput from '@/components/ui/AppInput.vue'
import AppCard from '@/components/ui/AppCard.vue'

const auth = useAuthStore()
const toast = useToastStore()

const rememberedEmail = localStorage.getItem('remembered_login_email') || 'admin@school.test'
const form = reactive({
  email: rememberedEmail,
  password: '',
})
const errors = reactive({
  email: '',
  password: '',
})
const rememberMe = ref(Boolean(localStorage.getItem('remembered_login_email')))

const roleAccounts = [
  { role: 'superadmin', email: 'superadmin@platform.test', password: 'test123' },
  { role: 'admin', email: 'admin@school.test', password: 'test123' },
  { role: 'accountant', email: 'accountant@school.test', password: 'test123' },
  { role: 'teacher', email: 'teacher@school.test', password: 'test123' },
  { role: 'receptionist', email: 'reception@school.test', password: 'test123' },
  { role: 'student', email: 'student@school.test', password: 'test123' },
  { role: 'parent', email: 'parent@school.test', password: 'test123' },
  { role: 'hod', email: 'hod@school.test', password: 'test123' },
] as const

async function handleRoleLogin(account: (typeof roleAccounts)[number]) {
  form.email = account.email
  form.password = account.password
  await submitLogin()
}

async function handleManualLogin() {
  await submitLogin()
}

async function submitLogin() {
  errors.email = ''
  errors.password = ''
  const email = form.email.trim()
  const password = form.password.trim()

  if (!email) {
    errors.email = 'User ID is required'
    return
  }
  if (!password) {
    errors.password = 'Password is required'
    return
  }

  localStorage.removeItem('dev_tenant_slug')
  localStorage.removeItem('remembered_login_slug')

  if (rememberMe.value) {
    localStorage.setItem('remembered_login_email', email)
  } else {
    localStorage.removeItem('remembered_login_email')
  }

  await auth.loginWithPassword(email, password)
}

function showForgotHelp() {
  toast.info('For test accounts, use password: test123')
}
</script>

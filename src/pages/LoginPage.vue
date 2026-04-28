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
  toast.info('Please contact your administrator to reset your password.')
}
</script>

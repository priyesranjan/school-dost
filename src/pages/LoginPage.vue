<template>
  <div class="w-full">
    <AppCard :glass="true" class="p-2 sm:p-4 shadow-2xl">
      <!-- Logo & Header -->
      <div class="mb-10 text-center">
        <div
          class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-primary-400 text-white text-3xl font-black shadow-xl shadow-primary-200 dark:shadow-none animate-hover-pulse"
        >
          SE
        </div>
        <h1 class="text-3xl font-black tracking-tight text-gray-900 dark:text-white">School ERP</h1>
        <p class="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">Secure access to your academic hub</p>
      </div>

      <!-- Step 1: Credentials -->
      <form v-if="step === 'credentials'" @submit.prevent="handleLogin" class="space-y-6">
        <div class="space-y-4">
          <AppInput
            v-model="form.email"
            label="Email Address"
            type="email"
            placeholder="admin@school.com"
            required
            :error="errors.email"
          />
          <AppInput
            v-model="form.password"
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            :error="errors.password"
          />
          <AppInput v-model="form.otpChannel" label="OTP Channel" type="select">
            <option value="sms">SMS OTP (2Factor)</option>
            <option value="whatsapp">WhatsApp OTP</option>
          </AppInput>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AppButton type="submit" :loading="auth.loading" class="w-full h-12 text-base"> 
            Request OTP 
          </AppButton>
          <AppButton 
            variant="secondary" 
            type="button" 
            :loading="auth.loading" 
            @click="handleDirectLogin" 
            class="w-full h-12 text-base border-2 border-primary-200"
          > 
            Direct Login 
          </AppButton>
        </div>
      </form>

      <!-- Step 2: OTP -->
      <form v-else @submit.prevent="handleVerifyOtp" class="space-y-6">
        <div
          class="rounded-2xl border border-primary-100 bg-primary-50/50 dark:border-primary-900/30 dark:bg-primary-900/10 p-5 text-sm text-center"
        >
          <p class="font-bold text-primary-800 dark:text-primary-300 uppercase tracking-widest text-[10px]">
            OTP Verification
          </p>
          <p class="mt-2 text-[10px] font-black uppercase tracking-widest text-primary-600">
            Channel: {{ form.otpChannel === 'whatsapp' ? 'WhatsApp' : 'SMS' }}
          </p>
          <p class="mt-2 text-gray-600 dark:text-gray-400 leading-relaxed">
            We've sent a 6-digit code to <br />
            <span class="font-bold text-gray-900 dark:text-white">{{ auth.pendingOtp?.destination_masked }}</span>
          </p>
          <div class="mt-4 flex items-center justify-center gap-2">
            <span class="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></span>
            <p class="text-[10px] font-black text-primary-600 uppercase">Expires in {{ countdown }}s</p>
          </div>
          <div v-if="auth.pendingOtp?.demo_otp" class="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-700/50 rounded-xl">
            <p class="text-[10px] font-black text-yellow-800 dark:text-yellow-600 uppercase mb-1">Debug OTP</p>
            <p class="text-2xl font-black text-yellow-900 dark:text-yellow-500 tracking-[0.2em]">{{ auth.pendingOtp.demo_otp }}</p>
          </div>
        </div>

        <AppInput
          v-model="form.otp"
          label="Verification Code"
          placeholder="000000"
          required
          class="text-center tracking-[1em] font-black text-lg"
          :error="errors.otp"
        />

        <div class="grid grid-cols-2 gap-3">
          <AppButton variant="secondary" type="button" @click="goBack" class="h-12">Cancel</AppButton>
          <AppButton type="submit" :loading="auth.loading" class="h-12">Verify</AppButton>
        </div>

        <button
          type="button"
          class="w-full text-xs font-bold uppercase tracking-widest text-primary-600 hover:text-primary-700 disabled:text-gray-400"
          :disabled="countdown > 0"
          @click="handleResendOtp"
        >
          Resend Code
        </button>
      </form>

      <!-- Demo Help -->
      <div class="mt-10 border-t border-gray-100 dark:border-gray-700/50 pt-8">
        <p class="text-center text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Quick Demo Access</p>
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="u in auth.demoUsers"
            :key="u.email"
            type="button"
            @click="useDemoUser(u.email, u.password)"
            class="group flex flex-col items-center gap-1 rounded-xl border border-gray-100 dark:border-gray-700 p-3 text-center transition-all hover:border-primary-200 hover:bg-primary-50/30 dark:hover:bg-primary-900/10"
          >
            <span class="text-sm font-bold text-gray-900 dark:text-white capitalize group-hover:text-primary-600">{{
              u.role
            }}</span>
            <span class="text-[9px] font-medium text-gray-400 uppercase truncate w-full">{{
              u.email.split('@')[0]
            }}</span>
          </button>
        </div>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'

const auth = useAuthStore()

const step = ref<'credentials' | 'otp'>('credentials')
const form = reactive({
  email: 'admin@school.com',
  password: 'admin123',
  otp: '',
  otpChannel: 'sms' as 'sms' | 'whatsapp',
})
const errors = reactive({ email: '', password: '', otp: '' })
const tick = ref(0)

const countdown = computed(() => {
  const _ = tick.value
  return Math.max(0, auth.otpExpiresIn)
})

let timerId: number | null = null

onMounted(() => {
  timerId = window.setInterval(() => {
    tick.value++
  }, 1000)
})

onBeforeUnmount(() => {
  if (timerId !== null) window.clearInterval(timerId)
})

function useDemoUser(email: string, password: string) {
  form.email = email
  form.password = password
}

async function handleLogin() {
  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = 'Email is required'
    return
  }
  if (!form.password) {
    errors.password = 'Password is required'
    return
  }

  auth.setOtpChannel(form.otpChannel)
  const ok = await auth.beginLogin(form.email, form.password, form.otpChannel)
  if (ok) {
    step.value = 'otp'
    form.otp = ''
  }
}

async function handleDirectLogin() {
  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = 'Email is required'
    return
  }
  if (!form.password) {
    errors.password = 'Password is required'
    return
  }

  await auth.loginWithPassword(form.email, form.password)
}

async function handleVerifyOtp() {
  errors.otp = ''
  if (!form.otp || form.otp.length !== 6) {
    errors.otp = 'Enter 6-digit OTP'
    return
  }

  await auth.verifyLoginOtp(form.otp)
}

async function handleResendOtp() {
  if (countdown.value > 0) return
  await auth.resendOtp()
}

function goBack() {
  step.value = 'credentials'
  form.otp = ''
  auth.clearPendingOtp()
}
</script>

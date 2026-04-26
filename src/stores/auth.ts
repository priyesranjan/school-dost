import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '@/router'
import { useToastStore } from './toast'
import { rolePermissions, type Role } from '@/constants/permissions'
import { twoFactorService } from '@/services/twoFactorService'
import { getOtpMode } from '@/utils/runtimeConfig'
import { CircuitOpenError } from '@/services/circuitBreakerService'
import type { AuthUser, OtpChallenge } from '@/types'

// Demo users for login
const demoUsers: { email: string; password: string; name: string; role: Role; phone: string; tenant_id?: string }[] = [
  {
    email: 'priyesranjan@gmail.com',
    password: 'admin123',
    name: 'Priyes Ranjan',
    role: 'superadmin',
    phone: '9288075422',
    // superadmin has no tenant_id — manages all schools
  },
  {
    email: 'superadmin@platform.com',
    password: 'super123',
    name: 'Platform Operator',
    role: 'superadmin',
    phone: '9876543200',
  },
  // School: Delhi Public School (tenant_dps) — 450 students, Premium plan
  { email: 'admin@school.com',       password: 'admin123',   name: 'Admin User',       role: 'admin',        phone: '9876543201', tenant_id: 'tenant_dps' },
  { email: 'accountant@school.com',  password: 'acc123',     name: 'Ramesh Verma',     role: 'accountant',   phone: '9876543202', tenant_id: 'tenant_dps' },
  { email: 'teacher@school.com',     password: 'teach123',   name: 'Priya Sharma',     role: 'teacher',      phone: '9876543203', tenant_id: 'tenant_dps' },
  { email: 'reception@school.com',   password: 'rec123',     name: 'Neha Singh',       role: 'receptionist', phone: '9876543204', tenant_id: 'tenant_dps' },
  { email: 'student@school.com',     password: 'student123', name: 'Aarav Patel',      role: 'student',      phone: '9876543205', tenant_id: 'tenant_dps' },
  { email: 'parent@school.com',      password: 'parent123',  name: 'Vijay Patel',      role: 'parent',       phone: '9876543206', tenant_id: 'tenant_dps' },
  { email: 'hod@school.com',         password: 'hod123',     name: 'Dr. Ramesh Gupta', role: 'hod',          phone: '9876543207', tenant_id: 'tenant_dps' },
  // School: Bright Future Academy (tenant_bright) — 180 students, Trial expiring in 4 days
  { email: 'admin@brightfuture.in',  password: 'admin123',   name: 'Rajesh Agarwal',   role: 'admin',        phone: '9876543210', tenant_id: 'tenant_bright' },
  // School: KV No.1 Ranchi (tenant_kvno1) — expired school
  { email: 'principal@kvno1.edu.in', password: 'admin123',   name: 'R.K. Sharma',      role: 'admin',        phone: '9876543220', tenant_id: 'tenant_kvno1' },
]

function toAuthUser(data: (typeof demoUsers)[number]): AuthUser {
  return {
    name: data.name,
    role: data.role,
    email: data.email,
    phone: data.phone,
    tenant_id: data.tenant_id,  // ← pass tenant_id so subscription card shows correct school
  }
}

export const useAuthStore = defineStore('auth', () => {
  const toast = useToastStore()

  // Restore from localStorage (with safe parse)
  const savedUser = localStorage.getItem('auth_user')
  let parsedUser: AuthUser | null = null
  try {
    parsedUser = savedUser ? JSON.parse(savedUser) : null
  } catch {
    localStorage.removeItem('auth_user')
  }
  const user = ref<AuthUser | null>(parsedUser)
  const pendingUser = ref<AuthUser | null>(null)
  const pendingOtp = ref<OtpChallenge | null>(null)
  const otpChannel = ref<'sms' | 'whatsapp'>('sms')
  const loading = ref(false)

  const isAdmin = computed(() => user.value?.role === 'admin')
  const otpExpiresIn = computed(() => {
    if (!pendingOtp.value) return 0
    const diff = pendingOtp.value.expires_at - Date.now()
    return diff > 0 ? Math.ceil(diff / 1000) : 0
  })

  function canAccess(routeName: string): boolean {
    if (!user.value) return false
    const perms = rolePermissions[user.value.role]
    return perms ? perms.includes(routeName) : false
  }

  async function beginLogin(email: string, password: string, channel: 'sms' | 'whatsapp' = otpChannel.value) {
    loading.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      if (!email || !password) {
        toast.error('Please enter email and password')
        return false
      }

      // Check demo users — reject unknown credentials
      const demoUser = demoUsers.find((u) => u.email === email && u.password === password)
      if (!demoUser) {
        toast.error('Invalid email or password')
        return false
      }
      const authUser = toAuthUser(demoUser)
      pendingUser.value = authUser
      otpChannel.value = channel
      const challenge = await twoFactorService.sendLoginOtp(authUser.phone, channel)
      pendingOtp.value = challenge

      if (challenge.demo_otp) {
        toast.show(
          'info',
          `${channel === 'whatsapp' ? 'WhatsApp' : 'SMS'} OTP sent to ${challenge.destination_masked}. Use ${challenge.demo_otp} in demo mode.`,
        )
      } else if (getOtpMode() === 'demo') {
        toast.show(
          'info',
          `${channel === 'whatsapp' ? 'WhatsApp' : 'SMS'} OTP sent to ${challenge.destination_masked}. Check demo_otp in API response.`,
        )
      } else {
        toast.success(`${channel === 'whatsapp' ? 'WhatsApp' : 'SMS'} OTP sent to ${challenge.destination_masked}`)
      }
      return true
    } catch (error) {
      if (error instanceof CircuitOpenError) {
        const waitSec = Math.ceil(error.retryAfterMs / 1000)
        toast.warning(`OTP service is cooling down. Try again in ${waitSec}s.`)
        return false
      }
      toast.error('Could not start login. Please try again.')
      return false
    } finally {
      loading.value = false
    }
  }

  async function verifyLoginOtp(otp: string) {
    if (!pendingOtp.value || !pendingUser.value) {
      toast.warning('Please start login again')
      return false
    }

    loading.value = true
    try {
      const result = await twoFactorService.verifyOtp(pendingOtp.value.session_id, otp)
      if (!result.ok) {
        toast.error('Invalid or expired OTP')
        return false
      }

      // In API mode the backend returns real tokens; in demo mode use a placeholder.
      const token = result.access_token || 'demo-token-' + Date.now()
      const refreshToken = result.refresh_token || null
      const resolvedUser = result.user || pendingUser.value
      if (!resolvedUser) {
        toast.error('Login session could not be resolved')
        return false
      }

      localStorage.setItem('auth_token', token)
      if (refreshToken) localStorage.setItem('refresh_token', refreshToken)
      localStorage.setItem('auth_user', JSON.stringify(resolvedUser))
      
      if (resolvedUser.tenant_slug) {
        localStorage.setItem('dev_tenant_slug', resolvedUser.tenant_slug)
      } else {
        localStorage.removeItem('dev_tenant_slug')
      }
      user.value = resolvedUser
      toast.success(`Welcome back, ${resolvedUser.name}!`)
      pendingOtp.value = null
      pendingUser.value = null
      router.push(resolvedUser.role === 'superadmin' ? { name: 'superadmin-dashboard' } : { name: 'dashboard' })
      return true
    } catch (error) {
      if (error instanceof CircuitOpenError) {
        const waitSec = Math.ceil(error.retryAfterMs / 1000)
        toast.warning(`OTP verification service is cooling down. Try again in ${waitSec}s.`)
        return false
      }
      toast.error('OTP verification failed')
      return false
    } finally {
      loading.value = false
    }
  }

  async function loginWithPassword(email: string, password: string) {
    loading.value = true
    try {
      const result = await twoFactorService.loginDirect(email, password)
      if (!result.ok) {
        toast.error('Invalid email or password')
        return false
      }

      const token = result.access_token as string
      const refreshToken = result.refresh_token || null
      const resolvedUser = result.user
      if (!token || !resolvedUser) {
        toast.error('Login response was incomplete')
        return false
      }

      localStorage.setItem('auth_token', token)
      if (refreshToken) localStorage.setItem('refresh_token', refreshToken)
      localStorage.setItem('auth_user', JSON.stringify(resolvedUser))
      
      if (resolvedUser.tenant_slug) {
        localStorage.setItem('dev_tenant_slug', resolvedUser.tenant_slug)
      } else {
        localStorage.removeItem('dev_tenant_slug')
      }
      user.value = resolvedUser
      
      toast.success(`Logged in successfully. Welcome back, ${resolvedUser.name}!`)
      router.push(resolvedUser.role === 'superadmin' ? { name: 'superadmin-dashboard' } : { name: 'dashboard' })
      return true
    } catch (error) {
      toast.error('Login failed. Please check your credentials.')
      return false
    } finally {
      loading.value = false
    }
  }

  async function resendOtp() {
    if (!pendingUser.value) {
      toast.warning('Please start login again')
      return false
    }
    try {
      const challenge = await twoFactorService.sendLoginOtp(pendingUser.value.phone, otpChannel.value)
      pendingOtp.value = challenge
      if (challenge.demo_otp) {
        toast.show(
          'info',
          `New ${otpChannel.value === 'whatsapp' ? 'WhatsApp' : 'SMS'} OTP sent to ${challenge.destination_masked}. Use ${challenge.demo_otp} in demo mode.`,
        )
      } else {
        toast.success(
          `${otpChannel.value === 'whatsapp' ? 'WhatsApp' : 'SMS'} OTP resent to ${challenge.destination_masked}`,
        )
      }
      return true
    } catch (error) {
      if (error instanceof CircuitOpenError) {
        const waitSec = Math.ceil(error.retryAfterMs / 1000)
        toast.warning(`OTP resend is cooling down. Try again in ${waitSec}s.`)
        return false
      }
      toast.error('Unable to resend OTP')
      return false
    }
  }

  function setOtpChannel(channel: 'sms' | 'whatsapp') {
    otpChannel.value = channel
  }

  function clearPendingOtp() {
    pendingOtp.value = null
    pendingUser.value = null
  }

  // Backward-compatible alias
  async function login(email: string, password: string) {
    return beginLogin(email, password)
  }

  function logout() {
    const refreshToken = localStorage.getItem('refresh_token')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('auth_user')
    user.value = null
    clearPendingOtp()
    // Best-effort server-side revocation in API mode (fire-and-forget)
    if (refreshToken && getOtpMode() === 'api') {
      import('@/services/api').then(({ default: api }) => {
        api.post('/auth/logout', { refresh_token: refreshToken }).catch(() => {})
      })
    }
    router.push({ name: 'login' })
    toast.success('Logged out successfully')
  }

  return {
    user,
    loading,
    isAdmin,
    canAccess,
    pendingOtp,
    otpChannel,
    otpExpiresIn,
    beginLogin,
    verifyLoginOtp,
    loginWithPassword,
    resendOtp,
    setOtpChannel,
    clearPendingOtp,
    login,
    logout,
    demoUsers,
  }
})

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
const demoUsers: { email: string; password: string; name: string; role: Role; phone: string }[] = [
  { email: 'admin@school.com', password: 'admin123', name: 'Admin User', role: 'admin', phone: '9876543201' },
  { email: 'accountant@school.com', password: 'acc123', name: 'Ramesh Verma', role: 'accountant', phone: '9876543202' },
  { email: 'teacher@school.com', password: 'teach123', name: 'Priya Sharma', role: 'teacher', phone: '9876543203' },
  { email: 'reception@school.com', password: 'rec123', name: 'Neha Singh', role: 'receptionist', phone: '9876543204' },
  { email: 'student@school.com', password: 'student123', name: 'Aarav Patel', role: 'student', phone: '9876543205' },
  { email: 'parent@school.com', password: 'parent123', name: 'Vijay Patel', role: 'parent', phone: '9876543206' },
  { email: 'hod@school.com', password: 'hod123', name: 'Dr. Ramesh Gupta', role: 'hod', phone: '9876543207' },
]

function toAuthUser(data: (typeof demoUsers)[number]): AuthUser {
  return {
    name: data.name,
    role: data.role,
    email: data.email,
    phone: data.phone,
  }
}

export const useAuthStore = defineStore('auth', () => {
  const toast = useToastStore()

  // Restore from localStorage (with safe parse)
  const savedUser = localStorage.getItem('auth_user')
  let parsedUser: AuthUser | null = null
  try { parsedUser = savedUser ? JSON.parse(savedUser) : null } catch { localStorage.removeItem('auth_user') }
  const user = ref<AuthUser | null>(parsedUser)
  const pendingUser = ref<AuthUser | null>(null)
  const pendingOtp = ref<OtpChallenge | null>(null)
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

  async function beginLogin(email: string, password: string) {
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
      const challenge = await twoFactorService.sendLoginOtp(authUser.phone)
      pendingOtp.value = challenge

      if (challenge.demo_otp) {
        toast.show('info', `OTP sent to ${challenge.destination_masked}. Use ${challenge.demo_otp} in demo mode.`)
      } else if (getOtpMode() === 'demo') {
        toast.show('info', `OTP sent to ${challenge.destination_masked}. Check demo_otp in API response.`)
      } else {
        toast.success(`OTP sent to ${challenge.destination_masked}`)
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
      const token = result.access_token || ('demo-token-' + Date.now())
      const refreshToken = result.refresh_token || null
      const resolvedUser = result.user || pendingUser.value

      localStorage.setItem('auth_token', token)
      if (refreshToken) localStorage.setItem('refresh_token', refreshToken)
      localStorage.setItem('auth_user', JSON.stringify(resolvedUser))
      user.value = resolvedUser
      toast.success(`Welcome back, ${resolvedUser!.name}!`)
      pendingOtp.value = null
      pendingUser.value = null
      router.push({ name: 'dashboard' })
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

  async function resendOtp() {
    if (!pendingUser.value) {
      toast.warning('Please start login again')
      return false
    }
    try {
      const challenge = await twoFactorService.sendLoginOtp(pendingUser.value.phone)
      pendingOtp.value = challenge
      if (challenge.demo_otp) {
        toast.show('info', `New OTP sent to ${challenge.destination_masked}. Use ${challenge.demo_otp} in demo mode.`)
      } else {
        toast.success(`OTP resent to ${challenge.destination_masked}`)
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
    otpExpiresIn,
    beginLogin,
    verifyLoginOtp,
    resendOtp,
    clearPendingOtp,
    login,
    logout,
    demoUsers,
  }
})

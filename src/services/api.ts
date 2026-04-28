import axios from 'axios'
import router from '@/router'
import type { InternalAxiosRequestConfig } from 'axios'
import { getOfflineMode } from '@/utils/runtimeConfig'

const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim()

const api = axios.create({
  baseURL: configuredBaseUrl || '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  if (getOfflineMode()) {
    return Promise.reject(new axios.AxiosError('Offline mode is enabled. Live API calls are disabled.', 'ERR_OFFLINE_MODE', config))
  }
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // Multi-tenancy: send slug so backend resolves the correct tenant DB.
  // Production uses subdomain; dev/Postman uses this header fallback.
  const slug = (() => {
    const parts = window.location.hostname.split('.')
    if (parts.length >= 3) return parts[0] // subdomain in prod
    return localStorage.getItem('dev_tenant_slug') || import.meta.env.VITE_TENANT_SLUG || ''
  })()
  if (slug) config.headers['X-Tenant-Slug'] = slug
  return config
})

// Track in-flight refresh to avoid concurrent refresh storms
let refreshPromise: Promise<string | null> | null = null

type ApiRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
  skipAuthRefresh?: boolean
  skipLogoutOnAuthFailure?: boolean
}

async function tryRefreshToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) return null
    try {
      const refreshUrl = configuredBaseUrl ? `${configuredBaseUrl.replace(/\/$/, '')}/auth/refresh` : '/api/auth/refresh'
    const tenantSlug = localStorage.getItem('dev_tenant_slug') || ''
    const res = await axios.post(
      refreshUrl,
      { refresh_token: refreshToken },
      tenantSlug ? { headers: { 'X-Tenant-Slug': tenantSlug } } : undefined,
    )
    const { access_token, refresh_token: newRefresh } = res.data?.data || {}
    if (!access_token) return null
    localStorage.setItem('auth_token', access_token)
    if (newRefresh) localStorage.setItem('refresh_token', newRefresh)
    return access_token as string
  } catch {
    return null
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = (error.config || {}) as ApiRequestConfig
    if (error.code === 'ERR_OFFLINE_MODE') {
      return Promise.reject(error)
    }
    if (error.response?.status === 401 && originalRequest.skipAuthRefresh) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      // Share a single refresh attempt across concurrent requests
      if (!refreshPromise) {
        refreshPromise = tryRefreshToken().finally(() => {
          refreshPromise = null
        })
      }
      const newToken = await refreshPromise
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      }
      if (originalRequest.skipLogoutOnAuthFailure) {
        return Promise.reject(error)
      }
      // Refresh failed — clear session and redirect to login
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('auth_user')
      router.push({ name: 'login' })
    } else if (error.response?.status >= 500) {
      const { useToastStore } = await import('@/stores/toast')
      const toast = useToastStore()
      toast.error('A server error occurred. Please try again later.')
    }
    return Promise.reject(error)
  },
)

export default api

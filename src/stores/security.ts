import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SecurityPolicyRecord, SecuritySessionRecord } from '@/types'
import { securityService } from '@/services/securityService'
import { useToastStore } from './toast'

export const useSecurityStore = defineStore('security', () => {
  const toast = useToastStore()
  const policy = ref<SecurityPolicyRecord | null>(null)
  const sessions = ref<SecuritySessionRecord[]>([])
  const loading = ref(false)

  async function loadPolicy() {
    loading.value = true
    try {
      policy.value = await securityService.getPolicy()
      return policy.value
    } catch (error) {
      toast.error('Failed to load security policy')
      throw error
    } finally {
      loading.value = false
    }
  }

  async function savePolicy(payload: Parameters<typeof securityService.updatePolicy>[0]) {
    loading.value = true
    try {
      policy.value = await securityService.updatePolicy(payload)
      toast.success('Security policy saved')
      return policy.value
    } catch (error) {
      toast.error('Failed to save security policy')
      throw error
    } finally {
      loading.value = false
    }
  }

  async function loadSessions(params?: { active_only?: boolean; role?: string }) {
    loading.value = true
    try {
      const data = await securityService.listSessions(params)
      sessions.value = data.items
      return data
    } catch (error) {
      toast.error('Failed to load active sessions')
      throw error
    } finally {
      loading.value = false
    }
  }

  async function revokeSession(id: number) {
    loading.value = true
    try {
      const data = await securityService.revokeSession(id)
      const idx = sessions.value.findIndex((item) => item.id === id)
      if (idx !== -1) sessions.value[idx] = data
      toast.success('Session revoked')
      return data
    } catch (error) {
      toast.error('Failed to revoke session')
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    policy,
    sessions,
    loading,
    loadPolicy,
    savePolicy,
    loadSessions,
    revokeSession,
  }
})

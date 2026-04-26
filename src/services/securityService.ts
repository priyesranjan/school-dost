import api from './api'
import type { SecurityPolicyRecord, SecuritySessionRecord } from '@/types'

export const securityService = {
  async getPolicy() {
    const res = await api.get('/security/policy')
    return res.data.data as SecurityPolicyRecord
  },

  async updatePolicy(payload: {
    password_min_length: number
    require_uppercase: boolean
    require_lowercase: boolean
    require_number: boolean
    require_special_char: boolean
    session_timeout_hours: number
    allow_concurrent_sessions: boolean
    enforce_ip_allowlist: boolean
    ip_allowlist: string[]
    two_factor_required_admins: boolean
  }) {
    const res = await api.put('/security/policy', payload)
    return res.data.data as SecurityPolicyRecord
  },

  async listSessions(params?: { active_only?: boolean; role?: string }) {
    const res = await api.get('/security/sessions', { params })
    return res.data.data as { items: SecuritySessionRecord[]; total: number }
  },

  async revokeSession(id: number) {
    const res = await api.post(`/security/sessions/${id}/revoke`)
    return res.data.data as SecuritySessionRecord
  },
}

import axios from 'axios'
import api from './api'
import type { InstitutionProfile } from '@/types'

const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim()
const baseUrl = configuredBaseUrl || '/api'

export const institutionService = {
  async getProfile(slug?: string) {
    const headers = slug ? { 'X-Tenant-Slug': slug } : undefined
    const res = slug
      ? await axios.get(`${baseUrl.replace(/\/$/, '')}/institution/profile`, { headers })
      : await api.get('/institution/profile')
    return res.data.data as InstitutionProfile | null
  },

  async saveProfile(data: InstitutionProfile) {
    const res = await api.put('/institution/profile', data)
    return res.data.data as InstitutionProfile
  },
}

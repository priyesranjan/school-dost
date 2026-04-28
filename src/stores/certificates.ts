import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Certificate } from '@/types'
import { loadFromStorage, saveToStorage } from '@/utils/storage'
import { useToastStore } from './toast'
import { certificateService } from '@/services/certificateService'
import { getOfflineMode } from '@/utils/runtimeConfig'

const demoCertificates: Certificate[] = [
  {
    id: 1,
    certificate_no: 'TC-2026-0001',
    student_id: 8,
    student_name: 'Ishita Joshi',
    class_name: 'Class 7',
    type: 'tc',
    issue_date: '2026-03-20',
    reason: 'Parent transfer',
    issued_by: 'Admin User',
    status: 'issued',
  },
]

function nextCertificateNo(type: Certificate['type'], count: number): string {
  const prefix = type === 'tc' ? 'TC' : 'CC'
  const seq = String(count + 1).padStart(4, '0')
  return `${prefix}-${new Date().getFullYear()}-${seq}`
}

export const useCertificateStore = defineStore('certificates', () => {
  const toast = useToastStore()
  const saved = loadFromStorage<Certificate[]>('certificates')
  const certificates = ref<Certificate[]>(saved || demoCertificates)
  const loading = ref(false)

  watch(certificates, (val) => saveToStorage('certificates', val), { deep: true })

  const tcCertificates = computed(() => certificates.value.filter((c) => c.type === 'tc'))
  const characterCertificates = computed(() => certificates.value.filter((c) => c.type === 'character'))

  function shouldUseLocalMode() {
    return getOfflineMode() || !localStorage.getItem('auth_token')
  }

  async function fetchCertificates(params?: { student_id?: number; type?: 'tc' | 'character' }) {
    if (shouldUseLocalMode()) return
    loading.value = true
    try {
      const res = await certificateService.getAll({ page: 1, per_page: 100, ...params })
      certificates.value = res.items || res
    } catch {
      toast.error('Failed to load certificates')
    } finally {
      loading.value = false
    }
  }

  async function issueCertificate(payload: Omit<Certificate, 'id' | 'certificate_no' | 'status'>) {
    const certificateNo = nextCertificateNo(payload.type, certificates.value.length)

    if (!shouldUseLocalMode()) {
      loading.value = true
      try {
        const cert = await certificateService.issue({
          certificate_no: certificateNo,
          student_id: payload.student_id,
          type: payload.type,
          issue_date: payload.issue_date,
          issued_by: payload.issued_by,
          reason: payload.reason || null,
          conduct: payload.conduct || null,
        })
        certificates.value.unshift(cert)
        toast.success(`${payload.type === 'tc' ? 'Transfer' : 'Character'} certificate issued`)
        return cert
      } catch {
        toast.error('Failed to issue certificate')
        throw new Error('Certificate issue failed')
      } finally {
        loading.value = false
      }
    }

    const cert: Certificate = {
      ...payload,
      id: Date.now(),
      certificate_no: certificateNo,
      status: 'issued',
    }
    certificates.value.unshift(cert)
    toast.success(`${payload.type === 'tc' ? 'Transfer' : 'Character'} certificate issued`)
    return cert
  }

  return {
    certificates,
    loading,
    tcCertificates,
    characterCertificates,
    fetchCertificates,
    issueCertificate,
  }
})

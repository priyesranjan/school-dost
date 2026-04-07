import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Certificate } from '@/types'
import { loadFromStorage, saveToStorage } from '@/utils/storage'
import { useToastStore } from './toast'

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

  watch(certificates, (val) => saveToStorage('certificates', val), { deep: true })

  const tcCertificates = computed(() => certificates.value.filter((c) => c.type === 'tc'))
  const characterCertificates = computed(() => certificates.value.filter((c) => c.type === 'character'))

  function issueCertificate(payload: Omit<Certificate, 'id' | 'certificate_no' | 'status'>) {
    const cert: Certificate = {
      ...payload,
      id: Date.now(),
      certificate_no: nextCertificateNo(payload.type, certificates.value.length),
      status: 'issued',
    }
    certificates.value.unshift(cert)
    toast.success(`${payload.type === 'tc' ? 'Transfer' : 'Character'} certificate issued`)
    return cert
  }

  return {
    certificates,
    tcCertificates,
    characterCertificates,
    issueCertificate,
  }
})

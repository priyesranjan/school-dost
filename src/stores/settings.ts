import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { SchoolSettings, UserRole } from '@/types'
import { useToastStore } from './toast'
import { saveToStorage, loadFromStorage } from '@/utils/storage'

const defaultSettings: SchoolSettings = {
  school_name: 'Delhi Public School',
  school_address: '123 Education Lane, New Delhi - 110001',
  school_phone: '011-2345-6789',
  school_email: 'info@dps-school.edu',
  principal_name: 'Dr. Rakesh Kumar',
  academic_year: '2025-26',
  institution_code: '001',
  brand_color: '#4f46e5',
  offline_mode: false,
  sms_enabled: true,
  sms_api_key: 'demo-api-key-xxxxx',
  sms_sender_id: 'SCHOOL',
  auto_sms_on_payment: true,
  auto_sms_on_due: true,
  otp_enabled: true,
  otp_mode: 'api',
  twofactor_api_key: '',
  twofactor_template_login: 'Your OTP is {{otp}}',
  r2_enabled: false,
  r2_mode: 'api',
  r2_public_base_url: '',
  r2_bucket: '',
  audit_signature_mode: 'api',
  audit_signature_endpoint: '/api/audit/sign',
  sla_critical_minutes: 15,
  sla_warning_minutes: 60,
  sla_info_minutes: 240,
  sla_policy_version: 'v1',
  sla_policy_updated_at: '2026-04-02T00:00:00.000Z',
}

const demoUsers: UserRole[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@school.com',
    role: 'admin',
    status: 'active',
    last_login: '2026-04-02 09:00',
  },
  {
    id: 2,
    name: 'Sunita Sharma',
    email: 'sunita@school.com',
    role: 'accountant',
    status: 'active',
    last_login: '2026-04-01 14:30',
  },
  {
    id: 3,
    name: 'Priya Verma',
    email: 'priya@school.com',
    role: 'teacher',
    status: 'active',
    last_login: '2026-03-31 08:45',
  },
  {
    id: 4,
    name: 'Rahul Singh',
    email: 'rahul@school.com',
    role: 'receptionist',
    status: 'active',
    last_login: '2026-04-02 08:30',
  },
  {
    id: 5,
    name: 'Meera Gupta',
    email: 'meera@school.com',
    role: 'teacher',
    status: 'inactive',
    last_login: '2026-02-15 10:00',
  },
]

export const useSettingsStore = defineStore('settings', () => {
  const toast = useToastStore()
  const savedSettings = loadFromStorage<SchoolSettings>('settings')
  const savedUsers = loadFromStorage<UserRole[]>('settings_users')
  const settings = ref<SchoolSettings>({ ...defaultSettings, ...(savedSettings || {}) })
  const users = ref<UserRole[]>(savedUsers || [...demoUsers])
  const loading = ref(false)

  watch(settings, (val) => saveToStorage('settings', val), { deep: true })
  watch(users, (val) => saveToStorage('settings_users', val), { deep: true })

  function updateSettings(data: Partial<SchoolSettings>) {
    Object.assign(settings.value, data)
    toast.success('Settings saved')
  }

  function addUser(data: Omit<UserRole, 'id' | 'last_login'>) {
    const exists = users.value.find((u) => u.email === data.email)
    if (exists) {
      toast.warning('A user with this email already exists')
      return
    }
    users.value.push({ ...data, id: Date.now(), last_login: null })
    toast.success('User added')
  }

  function updateUser(id: number, data: Partial<UserRole>) {
    const idx = users.value.findIndex((u) => u.id === id)
    if (idx !== -1) {
      users.value[idx] = { ...users.value[idx], ...data }
      toast.success('User updated')
    }
  }

  function deleteUser(id: number) {
    users.value = users.value.filter((u) => u.id !== id)
    toast.success('User removed')
  }

  return {
    settings,
    users,
    loading,
    updateSettings,
    addUser,
    updateUser,
    deleteUser,
  }
})

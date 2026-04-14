import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { loadFromStorage, saveToStorage } from '@/utils/storage'
import { useToastStore } from './toast'
import { staffService } from '@/services/staffService'

export type StaffRole = 'teacher' | 'admin' | 'principal' | 'staff'
export interface StaffMember {
  id: number
  name: string
  role: StaffRole
  department: string
  phone: string
  email?: string
  address?: string
  join_date: string
  status: 'active' | 'inactive' | 'on_leave'
  profile_photo_url?: string
}

const USE_DEMO = false

const demoStaff: StaffMember[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'teacher',
    department: 'Mathematics',
    phone: '+91 98765 43210',
    email: 'priya.s@school.edu',
    join_date: '2022-04-10',
    status: 'active',
  },
  {
    id: 2,
    name: 'Ravi Kumar',
    role: 'teacher',
    department: 'Science',
    phone: '+91 98765 43211',
    email: 'ravi.k@school.edu',
    join_date: '2023-01-15',
    status: 'active',
  },
  {
    id: 3,
    name: 'Meera Das',
    role: 'teacher',
    department: 'English',
    phone: '+91 98765 43212',
    email: 'meera.d@school.edu',
    join_date: '2021-08-01',
    status: 'active',
  },
  {
    id: 4,
    name: 'Dr. Anil Verma',
    role: 'principal',
    department: 'Administration',
    phone: '+91 98765 43213',
    email: 'director@school.edu',
    join_date: '2015-05-20',
    status: 'active',
  },
]

export const useStaffStore = defineStore('staff', () => {
  const toast = useToastStore()
  const saved = loadFromStorage<StaffMember[]>('staff')
  const staffMembers = ref<StaffMember[]>(saved || (USE_DEMO ? demoStaff : []))
  const loading = ref(false)

  watch(staffMembers, (val) => saveToStorage('staff', val), { deep: true })

  const activeTeachers = computed(() =>
    staffMembers.value
      .filter((s) => s.role === 'teacher' && s.status === 'active')
      .sort((a, b) => a.name.localeCompare(b.name)),
  )

  const filteredStaff = ref<StaffMember[]>([])
  const searchQuery = ref('')
  const roleFilter = ref('')

  watch(
    [staffMembers, searchQuery, roleFilter],
    () => {
      let result = staffMembers.value
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        result = result.filter(
          (s) => s.name.toLowerCase().includes(q) || s.department.toLowerCase().includes(q) || s.phone.includes(q),
        )
      }
      if (roleFilter.value) {
        result = result.filter((s) => s.role === roleFilter.value)
      }
      filteredStaff.value = result
    },
    { immediate: true },
  )

  async function fetchStaff(params?: any) {
    if (USE_DEMO) return
    loading.value = true
    try {
      const res = await staffService.getAll(params || { search: searchQuery.value, role: roleFilter.value })
      staffMembers.value = res.items || res
    } catch {
      toast.error('Failed to load staff records')
    } finally {
      loading.value = false
    }
  }

  async function addStaff(payload: Omit<StaffMember, 'id'>) {
    if (USE_DEMO) {
      const record: StaffMember = { id: Date.now(), ...payload }
      staffMembers.value.unshift(record)
      toast.success('Staff onboarded (Demo Mode)')
      return
    }
    loading.value = true
    try {
      const data = await staffService.create(payload)
      staffMembers.value.unshift(data)
      toast.success('Staff onboarded successfully')
    } catch {
      toast.error('Failed to onboard staff')
    } finally {
      loading.value = false
    }
  }

  async function updateStaff(id: number, payload: Partial<Omit<StaffMember, 'id'>>) {
    if (USE_DEMO) {
      const idx = staffMembers.value.findIndex((s) => s.id === id)
      if (idx !== -1) {
        staffMembers.value[idx] = { ...staffMembers.value[idx], ...payload }
        toast.success('Staff updated (Demo Mode)')
      }
      return
    }
    loading.value = true
    try {
      const data = await staffService.update(id, payload)
      const idx = staffMembers.value.findIndex((s) => s.id === id)
      if (idx !== -1) staffMembers.value[idx] = data
      toast.success('Staff records updated')
    } catch {
      toast.error('Failed to update staff records')
    } finally {
      loading.value = false
    }
  }

  async function deleteStaff(id: number) {
    if (USE_DEMO) {
      staffMembers.value = staffMembers.value.filter((s) => s.id !== id)
      toast.success('Staff removed (Demo Mode)')
      return
    }
    try {
      await staffService.delete(id)
      staffMembers.value = staffMembers.value.filter((s) => s.id !== id)
      toast.success('Staff removed successfully')
    } catch {
      toast.error('Failed to delete staff member')
    }
  }

  return {
    staffMembers,
    loading,
    activeTeachers,
    filteredStaff,
    searchQuery,
    roleFilter,
    fetchStaff,
    addStaff,
    updateStaff,
    deleteStaff,
  }
})

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useToastStore } from './toast'
import { saveToStorage, loadFromStorage } from '@/utils/storage'
import { classService } from '@/services/classService'
import { getOfflineMode } from '@/utils/runtimeConfig'

export interface ClassSection {
  id: number
  name: string // 'A', 'B', 'C'
  capacity: number
}

export interface ClassRecord {
  id: number
  name: string // 'Class 6', 'Class 7', ...
  grade: number // 6, 7, 8, 9, 10
  sections: ClassSection[]
  class_teacher: string
  academic_year: string
  room: string
  color: string // tailwind color key for display
  created_at: string
}

const defaultClasses: ClassRecord[] = [
  {
    id: 1,
    name: 'Class 6',
    grade: 6,
    sections: [
      { id: 1, name: 'A', capacity: 40 },
      { id: 2, name: 'B', capacity: 40 },
    ],
    class_teacher: 'Mr. Arjun Mishra',
    academic_year: '2025-26',
    room: 'Block A - 101',
    color: 'sky',
    created_at: '2025-04-01',
  },
  {
    id: 2,
    name: 'Class 7',
    grade: 7,
    sections: [
      { id: 3, name: 'A', capacity: 40 },
      { id: 4, name: 'B', capacity: 40 },
    ],
    class_teacher: 'Ms. Kavita Sharma',
    academic_year: '2025-26',
    room: 'Block A - 201',
    color: 'teal',
    created_at: '2025-04-01',
  },
  {
    id: 3,
    name: 'Class 8',
    grade: 8,
    sections: [
      { id: 5, name: 'A', capacity: 42 },
      { id: 6, name: 'B', capacity: 42 },
    ],
    class_teacher: 'Mr. Deepak Rao',
    academic_year: '2025-26',
    room: 'Block B - 102',
    color: 'indigo',
    created_at: '2025-04-01',
  },
  {
    id: 4,
    name: 'Class 9',
    grade: 9,
    sections: [
      { id: 7, name: 'A', capacity: 45 },
      { id: 8, name: 'B', capacity: 45 },
      { id: 9, name: 'C', capacity: 45 },
    ],
    class_teacher: 'Ms. Nisha Verma',
    academic_year: '2025-26',
    room: 'Block B - 202',
    color: 'violet',
    created_at: '2025-04-01',
  },
  {
    id: 5,
    name: 'Class 10',
    grade: 10,
    sections: [
      { id: 10, name: 'A', capacity: 45 },
      { id: 11, name: 'B', capacity: 45 },
      { id: 12, name: 'C', capacity: 45 },
    ],
    class_teacher: 'Mr. Sanjay Tiwari',
    academic_year: '2025-26',
    room: 'Block C - 101',
    color: 'rose',
    created_at: '2025-04-01',
  },
]

export const useClassStore = defineStore('classes', () => {
  const toast = useToastStore()
  const saved = loadFromStorage<ClassRecord[]>('class_records')
  const classes = ref<ClassRecord[]>(saved || [...defaultClasses])
  const loading = ref(false)

  watch(classes, (val) => saveToStorage('class_records', val), { deep: true })

  const sortedClasses = computed(() => [...classes.value].sort((a, b) => a.grade - b.grade))

  const totalCapacity = computed(() =>
    classes.value.reduce((sum, c) => sum + c.sections.reduce((s, sec) => s + sec.capacity, 0), 0),
  )

  const classNames = computed(() => sortedClasses.value.map((c) => c.name))

  function shouldUseLocalMode() {
    return getOfflineMode() || !localStorage.getItem('auth_token')
  }

  async function fetchClasses(params?: { search?: string; academic_year?: string }) {
    if (shouldUseLocalMode()) return
    loading.value = true
    try {
      const res = await classService.getAll({ page: 1, per_page: 100, ...params })
      classes.value = res.items || res
    } catch {
      toast.error('Failed to load classes')
    } finally {
      loading.value = false
    }
  }

  async function addClass(data: Omit<ClassRecord, 'id' | 'created_at'>): Promise<ClassRecord> {
    const exists = classes.value.find((c) => c.name.toLowerCase() === data.name.toLowerCase())
    if (exists) {
      toast.warning(`Class "${data.name}" already exists`)
      throw new Error('Duplicate class')
    }

    if (!shouldUseLocalMode()) {
      loading.value = true
      try {
        const record = await classService.create(data)
        classes.value.push(record)
        toast.success(`${data.name} created`)
        return record
      } catch {
        toast.error('Failed to create class')
        throw new Error('Class create failed')
      } finally {
        loading.value = false
      }
    }

    const newClass: ClassRecord = {
      ...data,
      id: Date.now(),
      created_at: new Date().toISOString().split('T')[0],
    }
    classes.value.push(newClass)
    toast.success(`${data.name} created`)
    return newClass
  }

  async function updateClass(id: number, data: Partial<Omit<ClassRecord, 'id' | 'created_at'>>) {
    const idx = classes.value.findIndex((c) => c.id === id)
    if (idx === -1) return

    if (!shouldUseLocalMode()) {
      loading.value = true
      try {
        const updated = await classService.update(id, {
          name: data.name,
          grade: data.grade,
          class_teacher: data.class_teacher,
          academic_year: data.academic_year,
          room: data.room,
          color: data.color,
        })
        classes.value[idx] = updated
        toast.success('Class updated')
      } catch {
        toast.error('Failed to update class')
      } finally {
        loading.value = false
      }
      return
    }

    classes.value[idx] = { ...classes.value[idx], ...data }
    toast.success('Class updated')
  }

  async function deleteClass(id: number) {
    if (!shouldUseLocalMode()) {
      try {
        await classService.delete(id)
        classes.value = classes.value.filter((c) => c.id !== id)
        toast.success('Class deleted')
      } catch {
        toast.error('Failed to delete class')
      }
      return
    }

    classes.value = classes.value.filter((c) => c.id !== id)
    toast.success('Class deleted')
  }

  async function addSection(classId: number, sectionName: string, capacity: number) {
    const cls = classes.value.find((c) => c.id === classId)
    if (!cls) return
    const exists = cls.sections.find((s) => s.name.toUpperCase() === sectionName.toUpperCase())
    if (exists) {
      toast.warning(`Section ${sectionName} already exists`)
      return
    }

    if (!shouldUseLocalMode()) {
      try {
        const updated = await classService.addSection(classId, { name: sectionName.trim(), capacity })
        const idx = classes.value.findIndex((c) => c.id === classId)
        if (idx !== -1) classes.value[idx] = updated
        toast.success(`Section ${sectionName} added to ${cls.name}`)
      } catch {
        toast.error('Failed to add section')
      }
      return
    }

    cls.sections.push({ id: Date.now(), name: sectionName.toUpperCase(), capacity })
    toast.success(`Section ${sectionName} added to ${cls.name}`)
  }

  async function removeSection(classId: number, sectionId: number) {
    const cls = classes.value.find((c) => c.id === classId)
    if (!cls) return
    if (cls.sections.length <= 1) {
      toast.warning('Cannot delete the last section')
      return
    }

    if (!shouldUseLocalMode()) {
      try {
        const updated = await classService.deleteSection(classId, sectionId)
        const idx = classes.value.findIndex((c) => c.id === classId)
        if (idx !== -1) classes.value[idx] = updated
        toast.success('Section removed')
      } catch {
        toast.error('Failed to remove section')
      }
      return
    }

    cls.sections = cls.sections.filter((s) => s.id !== sectionId)
    toast.success('Section removed')
  }

  async function updateSectionCapacity(classId: number, sectionId: number, capacity: number) {
    const cls = classes.value.find((c) => c.id === classId)
    if (!cls) return
    const sec = cls.sections.find((s) => s.id === sectionId)
    if (sec) {
      if (!shouldUseLocalMode()) {
        try {
          const updated = await classService.updateSection(sectionId, { capacity })
          const idx = classes.value.findIndex((c) => c.id === classId)
          if (idx !== -1) classes.value[idx] = updated
          toast.success('Capacity updated')
        } catch {
          toast.error('Failed to update capacity')
        }
        return
      }
      sec.capacity = capacity
      toast.success('Capacity updated')
    }
  }

  return {
    classes,
    loading,
    sortedClasses,
    totalCapacity,
    classNames,
    fetchClasses,
    addClass,
    updateClass,
    deleteClass,
    addSection,
    removeSection,
    updateSectionCapacity,
  }
})

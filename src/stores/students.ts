import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Student, PaginationParams } from '@/types'
import { studentService } from '@/services/studentService'
import { useToastStore } from './toast'
import { saveToStorage, loadFromStorage } from '@/utils/storage'

// Demo data for development
const demoStudents: Student[] = [
  { id: 1, name: 'Aarav Sharma', roll_number: '2024001', class_name: 'Class 10', section: 'A', parent_name: 'Rajesh Sharma', phone: '9876543210', email: 'rajesh@email.com', address: '12 MG Road, Delhi', admission_date: '2024-04-01', status: 'active' },
  { id: 2, name: 'Priya Patel', roll_number: '2024002', class_name: 'Class 10', section: 'A', parent_name: 'Suresh Patel', phone: '9876543211', email: 'suresh@email.com', address: '45 Station Road, Mumbai', admission_date: '2024-04-01', status: 'active' },
  { id: 3, name: 'Rohan Gupta', roll_number: '2024003', class_name: 'Class 9', section: 'B', parent_name: 'Amit Gupta', phone: '9876543212', email: 'amit@email.com', address: '78 Park Street, Kolkata', admission_date: '2024-04-02', status: 'active' },
  { id: 4, name: 'Ananya Singh', roll_number: '2024004', class_name: 'Class 9', section: 'A', parent_name: 'Vikram Singh', phone: '9876543213', email: 'vikram@email.com', address: '23 Civil Lines, Jaipur', admission_date: '2024-04-02', status: 'active' },
  { id: 5, name: 'Karan Mehta', roll_number: '2024005', class_name: 'Class 8', section: 'A', parent_name: 'Deepak Mehta', phone: '9876543214', email: 'deepak@email.com', address: '56 Mall Road, Shimla', admission_date: '2024-04-03', status: 'active' },
  { id: 6, name: 'Sneha Reddy', roll_number: '2024006', class_name: 'Class 8', section: 'B', parent_name: 'Ravi Reddy', phone: '9876543215', email: 'ravi@email.com', address: '89 Tank Bund, Hyderabad', admission_date: '2024-04-03', status: 'active' },
  { id: 7, name: 'Arjun Kumar', roll_number: '2024007', class_name: 'Class 7', section: 'A', parent_name: 'Manoj Kumar', phone: '9876543216', email: 'manoj@email.com', address: '34 Gandhi Nagar, Chennai', admission_date: '2024-04-04', status: 'active' },
  { id: 8, name: 'Ishita Joshi', roll_number: '2024008', class_name: 'Class 7', section: 'A', parent_name: 'Sanjay Joshi', phone: '9876543217', email: 'sanjay@email.com', address: '67 Lake Road, Pune', admission_date: '2024-04-04', status: 'inactive' },
  { id: 9, name: 'Dev Nair', roll_number: '2024009', class_name: 'Class 6', section: 'A', parent_name: 'Krishna Nair', phone: '9876543218', email: 'krishna@email.com', address: '12 Beach Road, Kochi', admission_date: '2024-04-05', status: 'active' },
  { id: 10, name: 'Meera Iyer', roll_number: '2024010', class_name: 'Class 6', section: 'B', parent_name: 'Ramesh Iyer', phone: '9876543219', email: 'ramesh@email.com', address: '45 Temple Street, Bengaluru', admission_date: '2024-04-05', status: 'active' },
  { id: 11, name: 'Aditya Verma', roll_number: '2024011', class_name: 'Class 10', section: 'B', parent_name: 'Pankaj Verma', phone: '9876543220', email: 'pankaj@email.com', address: '78 Civil Lines, Lucknow', admission_date: '2024-04-06', status: 'active' },
  { id: 12, name: 'Riya Chopra', roll_number: '2024012', class_name: 'Class 9', section: 'A', parent_name: 'Rahul Chopra', phone: '9876543221', email: 'rahul@email.com', address: '23 Sector 17, Chandigarh', admission_date: '2024-04-06', status: 'active' },
]

const USE_DEMO = true

export const useStudentStore = defineStore('students', () => {
  const toast = useToastStore()
  const saved = loadFromStorage<Student[]>('students')
  const students = ref<Student[]>(saved || (USE_DEMO ? [...demoStudents] : []))
  const loading = ref(false)
  const total = ref(students.value.length)

  // Persist on changes
  watch(students, (val) => saveToStorage('students', val), { deep: true })
  const currentPage = ref(1)
  const perPage = ref(10)
  const searchQuery = ref('')
  const classFilter = ref('')

  const filteredStudents = computed(() => {
    let result = students.value
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.roll_number.toLowerCase().includes(q) ||
          s.parent_name.toLowerCase().includes(q) ||
          s.phone.includes(q)
      )
    }
    if (classFilter.value) {
      result = result.filter((s) => s.class_name === classFilter.value)
    }
    return result
  })

  const paginatedStudents = computed(() => {
    const start = (currentPage.value - 1) * perPage.value
    return filteredStudents.value.slice(start, start + perPage.value)
  })

  const totalPages = computed(() => Math.ceil(filteredStudents.value.length / perPage.value))

  const classes = computed(() => {
    const set = new Set(students.value.map((s) => s.class_name))
    return Array.from(set).sort()
  })

  async function fetchStudents(params?: PaginationParams) {
    if (USE_DEMO) return
    loading.value = true
    try {
      const res = await studentService.getAll(params || { page: currentPage.value, per_page: perPage.value, search: searchQuery.value })
      students.value = res.data
      total.value = res.total || res.data.length
    } catch {
      toast.error('Failed to load students')
    } finally {
      loading.value = false
    }
  }

  async function addStudent(data: Omit<Student, 'id'>) {
    if (USE_DEMO) {
      const newStudent = { ...data, id: Date.now() } as Student
      students.value.unshift(newStudent)
      total.value = students.value.length
      toast.success('Student added successfully')
      return newStudent
    }
    loading.value = true
    try {
      const res = await studentService.create(data)
      students.value.unshift(res.data)
      total.value++
      toast.success('Student added successfully')
      return res.data
    } catch {
      toast.error('Failed to add student')
      throw new Error('Failed to add student')
    } finally {
      loading.value = false
    }
  }

  async function updateStudent(id: number, data: Partial<Student>) {
    if (USE_DEMO) {
      const idx = students.value.findIndex((s) => s.id === id)
      if (idx !== -1) {
        students.value[idx] = { ...students.value[idx], ...data }
        toast.success('Student updated successfully')
      }
      return
    }
    loading.value = true
    try {
      const res = await studentService.update(id, data)
      const idx = students.value.findIndex((s) => s.id === id)
      if (idx !== -1) students.value[idx] = res.data
      toast.success('Student updated successfully')
    } catch {
      toast.error('Failed to update student')
      throw new Error('Failed to update student')
    } finally {
      loading.value = false
    }
  }

  async function deleteStudent(id: number) {
    if (USE_DEMO) {
      students.value = students.value.filter((s) => s.id !== id)
      total.value = students.value.length
      toast.success('Student removed successfully')
      return
    }
    try {
      await studentService.delete(id)
      students.value = students.value.filter((s) => s.id !== id)
      total.value--
      toast.success('Student removed successfully')
    } catch {
      toast.error('Failed to delete student')
    }
  }

  return {
    students,
    loading,
    total,
    currentPage,
    perPage,
    searchQuery,
    classFilter,
    filteredStudents,
    paginatedStudents,
    totalPages,
    classes,
    fetchStudents,
    addStudent,
    updateStudent,
    deleteStudent,
  }
})

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Student, PaginationParams } from '@/types'
import { studentService } from '@/services/studentService'
import { useToastStore } from './toast'
import { saveToStorage, loadFromStorage } from '@/utils/storage'
import { generateEnrollmentNo } from '@/utils/enrollmentNumber'

// Demo data for development
const demoStudents: Student[] = [
  {
    id: 1,
    name: 'Aarav Sharma',
    first_name: 'Aarav',
    middle_name: '',
    last_name: 'Sharma',
    roll_number: '2024001',
    class_name: 'Class 10',
    section: 'A',
    parent_name: 'Rajesh Sharma',
    phone: '9876543210',
    email: 'aarav@email.com',
    address: '12 MG Road, Delhi',
    admission_date: '2024-04-01',
    status: 'active',
    date_of_birth: '2008-06-15',
    gender: 'Male',
    blood_group: 'B+',
    nationality: 'Indian',
    religion: 'Hindu',
    category: 'General',
    mother_tongue: 'Hindi',
    aadhar_number: '1234-5678-9012',
    fee_no: 'FN-001',
    stream: 'Science',
    fee_group: 'Group A',
    academic_year: '2024-25',
    date_of_joining: '2024-04-01',
    father_name: 'Rajesh Sharma',
    father_occupation: 'Business',
    father_qualification: 'MBA',
    father_phone: '9876543210',
    father_email: 'rajesh@email.com',
    father_annual_income: '1200000',
    mother_name: 'Sunita Sharma',
    mother_occupation: 'Teacher',
    mother_qualification: 'M.Ed',
    mother_phone: '9876543290',
    mother_email: 'sunita@email.com',
    current_address: '12 MG Road',
    current_city: 'New Delhi',
    current_state: 'Delhi',
    current_pincode: '110001',
    current_country: 'India',
    permanent_address: '12 MG Road',
    permanent_city: 'New Delhi',
    permanent_state: 'Delhi',
    permanent_pincode: '110001',
    permanent_country: 'India',
    same_as_current: true,
    previous_school: 'DPS R.K. Puram',
    previous_class: 'Class 9',
    transport_mode: 'School Bus',
    bus_route: 'Route 5 - South Delhi',
    emergency_contact_name: 'Rajesh Sharma',
    emergency_contact_phone: '9876543210',
    emergency_relation: 'Father',
    bank_name: 'SBI',
    bank_account_no: '30123456789',
    ifsc_code: 'SBIN0001234',
  },
  {
    id: 2,
    name: 'Priya Patel',
    first_name: 'Priya',
    middle_name: '',
    last_name: 'Patel',
    roll_number: '2024002',
    class_name: 'Class 10',
    section: 'A',
    parent_name: 'Suresh Patel',
    phone: '9876543211',
    email: 'priya@email.com',
    address: '45 Station Road, Mumbai',
    admission_date: '2024-04-01',
    status: 'active',
    date_of_birth: '2008-09-22',
    gender: 'Female',
    blood_group: 'O+',
    nationality: 'Indian',
    religion: 'Hindu',
    category: 'OBC',
    mother_tongue: 'Gujarati',
    fee_no: 'FN-002',
    stream: 'Commerce',
    fee_group: 'Group A',
    academic_year: '2024-25',
    date_of_joining: '2024-04-01',
    father_name: 'Suresh Patel',
    father_occupation: 'Engineer',
    father_phone: '9876543211',
    mother_name: 'Meena Patel',
    mother_occupation: 'Homemaker',
    mother_phone: '9876543291',
    current_address: '45 Station Road',
    current_city: 'Mumbai',
    current_state: 'Maharashtra',
    current_pincode: '400001',
    current_country: 'India',
    same_as_current: true,
    permanent_address: '45 Station Road',
    permanent_city: 'Mumbai',
    permanent_state: 'Maharashtra',
    permanent_pincode: '400001',
    permanent_country: 'India',
    transport_mode: 'Private',
    emergency_contact_name: 'Suresh Patel',
    emergency_contact_phone: '9876543211',
    emergency_relation: 'Father',
  },
  {
    id: 3,
    name: 'Rohan Gupta',
    first_name: 'Rohan',
    middle_name: 'Kumar',
    last_name: 'Gupta',
    roll_number: '2024003',
    class_name: 'Class 9',
    section: 'B',
    parent_name: 'Amit Gupta',
    phone: '9876543212',
    email: 'rohan@email.com',
    address: '78 Park Street, Kolkata',
    admission_date: '2024-04-02',
    status: 'active',
    date_of_birth: '2009-03-10',
    gender: 'Male',
    blood_group: 'A+',
    nationality: 'Indian',
    religion: 'Hindu',
    category: 'General',
    mother_tongue: 'Bengali',
    fee_no: 'FN-003',
    academic_year: '2024-25',
    father_name: 'Amit Gupta',
    father_occupation: 'Doctor',
    father_phone: '9876543212',
    mother_name: 'Kavita Gupta',
    mother_phone: '9876543292',
    current_address: '78 Park Street',
    current_city: 'Kolkata',
    current_state: 'West Bengal',
    current_pincode: '700016',
    current_country: 'India',
    same_as_current: true,
    permanent_address: '78 Park Street',
    permanent_city: 'Kolkata',
    permanent_state: 'West Bengal',
    permanent_pincode: '700016',
    permanent_country: 'India',
    transport_mode: 'School Bus',
    bus_route: 'Route 3 - Park Street',
  },
  {
    id: 4,
    name: 'Ananya Singh',
    first_name: 'Ananya',
    last_name: 'Singh',
    roll_number: '2024004',
    class_name: 'Class 9',
    section: 'A',
    parent_name: 'Vikram Singh',
    phone: '9876543213',
    email: 'ananya@email.com',
    address: '23 Civil Lines, Jaipur',
    admission_date: '2024-04-02',
    status: 'active',
    date_of_birth: '2009-11-05',
    gender: 'Female',
    blood_group: 'AB+',
    nationality: 'Indian',
    religion: 'Hindu',
    category: 'General',
    mother_tongue: 'Hindi',
    fee_no: 'FN-004',
    academic_year: '2024-25',
    father_name: 'Vikram Singh',
    father_occupation: 'Advocate',
    father_phone: '9876543213',
    mother_name: 'Pooja Singh',
    mother_phone: '9876543293',
    current_address: '23 Civil Lines',
    current_city: 'Jaipur',
    current_state: 'Rajasthan',
    current_pincode: '302001',
    current_country: 'India',
    same_as_current: true,
    permanent_address: '23 Civil Lines',
    permanent_city: 'Jaipur',
    permanent_state: 'Rajasthan',
    permanent_pincode: '302001',
    permanent_country: 'India',
  },
  {
    id: 5,
    name: 'Karan Mehta',
    first_name: 'Karan',
    last_name: 'Mehta',
    roll_number: '2024005',
    class_name: 'Class 8',
    section: 'A',
    parent_name: 'Deepak Mehta',
    phone: '9876543214',
    email: 'karan@email.com',
    address: '56 Mall Road, Shimla',
    admission_date: '2024-04-03',
    status: 'active',
    date_of_birth: '2010-01-18',
    gender: 'Male',
    blood_group: 'B-',
    nationality: 'Indian',
    religion: 'Hindu',
    category: 'General',
    mother_tongue: 'Hindi',
    fee_no: 'FN-005',
    academic_year: '2024-25',
    father_name: 'Deepak Mehta',
    father_phone: '9876543214',
    mother_name: 'Ritu Mehta',
    mother_phone: '9876543294',
    current_address: '56 Mall Road',
    current_city: 'Shimla',
    current_state: 'Himachal Pradesh',
    current_pincode: '171001',
    current_country: 'India',
    same_as_current: true,
    permanent_address: '56 Mall Road',
    permanent_city: 'Shimla',
    permanent_state: 'Himachal Pradesh',
    permanent_pincode: '171001',
    permanent_country: 'India',
    transport_mode: 'Walking',
  },
  {
    id: 6,
    name: 'Sneha Reddy',
    first_name: 'Sneha',
    last_name: 'Reddy',
    roll_number: '2024006',
    class_name: 'Class 8',
    section: 'B',
    parent_name: 'Ravi Reddy',
    phone: '9876543215',
    email: 'sneha@email.com',
    address: '89 Tank Bund, Hyderabad',
    admission_date: '2024-04-03',
    status: 'active',
    date_of_birth: '2010-07-25',
    gender: 'Female',
    blood_group: 'O-',
    nationality: 'Indian',
    religion: 'Hindu',
    category: 'OBC',
    mother_tongue: 'Telugu',
    fee_no: 'FN-006',
    academic_year: '2024-25',
    father_name: 'Ravi Reddy',
    father_phone: '9876543215',
    mother_name: 'Lakshmi Reddy',
    mother_phone: '9876543295',
    current_address: '89 Tank Bund',
    current_city: 'Hyderabad',
    current_state: 'Telangana',
    current_pincode: '500001',
    current_country: 'India',
    same_as_current: true,
    permanent_address: '89 Tank Bund',
    permanent_city: 'Hyderabad',
    permanent_state: 'Telangana',
    permanent_pincode: '500001',
    permanent_country: 'India',
  },
  {
    id: 7,
    name: 'Arjun Kumar',
    first_name: 'Arjun',
    last_name: 'Kumar',
    roll_number: '2024007',
    class_name: 'Class 7',
    section: 'A',
    parent_name: 'Manoj Kumar',
    phone: '9876543216',
    email: 'arjun@email.com',
    address: '34 Gandhi Nagar, Chennai',
    admission_date: '2024-04-04',
    status: 'active',
    date_of_birth: '2011-02-14',
    gender: 'Male',
    blood_group: 'A-',
    nationality: 'Indian',
    religion: 'Hindu',
    category: 'SC',
    mother_tongue: 'Tamil',
    fee_no: 'FN-007',
    academic_year: '2024-25',
    father_name: 'Manoj Kumar',
    father_phone: '9876543216',
    mother_name: 'Selvi Kumar',
    mother_phone: '9876543296',
    current_address: '34 Gandhi Nagar',
    current_city: 'Chennai',
    current_state: 'Tamil Nadu',
    current_pincode: '600001',
    current_country: 'India',
    same_as_current: true,
    permanent_address: '34 Gandhi Nagar',
    permanent_city: 'Chennai',
    permanent_state: 'Tamil Nadu',
    permanent_pincode: '600001',
    permanent_country: 'India',
  },
  {
    id: 8,
    name: 'Ishita Joshi',
    first_name: 'Ishita',
    last_name: 'Joshi',
    roll_number: '2024008',
    class_name: 'Class 7',
    section: 'A',
    parent_name: 'Sanjay Joshi',
    phone: '9876543217',
    email: 'ishita@email.com',
    address: '67 Lake Road, Pune',
    admission_date: '2024-04-04',
    status: 'inactive',
    date_of_birth: '2011-12-01',
    gender: 'Female',
    blood_group: 'B+',
    nationality: 'Indian',
    religion: 'Hindu',
    category: 'General',
    mother_tongue: 'Marathi',
    fee_no: 'FN-008',
    academic_year: '2024-25',
    father_name: 'Sanjay Joshi',
    father_phone: '9876543217',
    mother_name: 'Archana Joshi',
    mother_phone: '9876543297',
    current_address: '67 Lake Road',
    current_city: 'Pune',
    current_state: 'Maharashtra',
    current_pincode: '411001',
    current_country: 'India',
    same_as_current: true,
    permanent_address: '67 Lake Road',
    permanent_city: 'Pune',
    permanent_state: 'Maharashtra',
    permanent_pincode: '411001',
    permanent_country: 'India',
  },
  {
    id: 9,
    name: 'Dev Nair',
    first_name: 'Dev',
    last_name: 'Nair',
    roll_number: '2024009',
    class_name: 'Class 6',
    section: 'A',
    parent_name: 'Krishna Nair',
    phone: '9876543218',
    email: 'dev@email.com',
    address: '12 Beach Road, Kochi',
    admission_date: '2024-04-05',
    status: 'active',
    date_of_birth: '2012-05-30',
    gender: 'Male',
    blood_group: 'O+',
    nationality: 'Indian',
    religion: 'Hindu',
    category: 'General',
    mother_tongue: 'Malayalam',
    fee_no: 'FN-009',
    academic_year: '2024-25',
    father_name: 'Krishna Nair',
    father_phone: '9876543218',
    mother_name: 'Divya Nair',
    mother_phone: '9876543298',
    current_address: '12 Beach Road',
    current_city: 'Kochi',
    current_state: 'Kerala',
    current_pincode: '682001',
    current_country: 'India',
    same_as_current: true,
    permanent_address: '12 Beach Road',
    permanent_city: 'Kochi',
    permanent_state: 'Kerala',
    permanent_pincode: '682001',
    permanent_country: 'India',
  },
  {
    id: 10,
    name: 'Meera Iyer',
    first_name: 'Meera',
    last_name: 'Iyer',
    roll_number: '2024010',
    class_name: 'Class 6',
    section: 'B',
    parent_name: 'Ramesh Iyer',
    phone: '9876543219',
    email: 'meera@email.com',
    address: '45 Temple Street, Bengaluru',
    admission_date: '2024-04-05',
    status: 'active',
    date_of_birth: '2012-08-12',
    gender: 'Female',
    blood_group: 'AB-',
    nationality: 'Indian',
    religion: 'Hindu',
    category: 'General',
    mother_tongue: 'Kannada',
    fee_no: 'FN-010',
    academic_year: '2024-25',
    father_name: 'Ramesh Iyer',
    father_phone: '9876543219',
    mother_name: 'Padma Iyer',
    mother_phone: '9876543299',
    current_address: '45 Temple Street',
    current_city: 'Bengaluru',
    current_state: 'Karnataka',
    current_pincode: '560001',
    current_country: 'India',
    same_as_current: true,
    permanent_address: '45 Temple Street',
    permanent_city: 'Bengaluru',
    permanent_state: 'Karnataka',
    permanent_pincode: '560001',
    permanent_country: 'India',
  },
  {
    id: 11,
    name: 'Aditya Verma',
    first_name: 'Aditya',
    last_name: 'Verma',
    roll_number: '2024011',
    class_name: 'Class 10',
    section: 'B',
    parent_name: 'Pankaj Verma',
    phone: '9876543220',
    email: 'aditya@email.com',
    address: '78 Civil Lines, Lucknow',
    admission_date: '2024-04-06',
    status: 'active',
    date_of_birth: '2008-10-08',
    gender: 'Male',
    blood_group: 'A+',
    nationality: 'Indian',
    religion: 'Hindu',
    category: 'General',
    mother_tongue: 'Hindi',
    fee_no: 'FN-011',
    academic_year: '2024-25',
    father_name: 'Pankaj Verma',
    father_phone: '9876543220',
    mother_name: 'Neeta Verma',
    mother_phone: '9876543300',
    current_address: '78 Civil Lines',
    current_city: 'Lucknow',
    current_state: 'Uttar Pradesh',
    current_pincode: '226001',
    current_country: 'India',
    same_as_current: true,
    permanent_address: '78 Civil Lines',
    permanent_city: 'Lucknow',
    permanent_state: 'Uttar Pradesh',
    permanent_pincode: '226001',
    permanent_country: 'India',
  },
  {
    id: 12,
    name: 'Riya Chopra',
    first_name: 'Riya',
    last_name: 'Chopra',
    roll_number: '2024012',
    class_name: 'Class 9',
    section: 'A',
    parent_name: 'Rahul Chopra',
    phone: '9876543221',
    email: 'riya@email.com',
    address: '23 Sector 17, Chandigarh',
    admission_date: '2024-04-06',
    status: 'active',
    date_of_birth: '2009-04-17',
    gender: 'Female',
    blood_group: 'B+',
    nationality: 'Indian',
    religion: 'Sikh',
    category: 'General',
    mother_tongue: 'Punjabi',
    fee_no: 'FN-012',
    academic_year: '2024-25',
    father_name: 'Rahul Chopra',
    father_phone: '9876543221',
    mother_name: 'Simran Chopra',
    mother_phone: '9876543301',
    current_address: '23 Sector 17',
    current_city: 'Chandigarh',
    current_state: 'Chandigarh',
    current_pincode: '160017',
    current_country: 'India',
    same_as_current: true,
    permanent_address: '23 Sector 17',
    permanent_city: 'Chandigarh',
    permanent_state: 'Chandigarh',
    permanent_pincode: '160017',
    permanent_country: 'India',
  },
]

const USE_DEMO = false

export const useStudentStore = defineStore('students', () => {
  const toast = useToastStore()
  const saved = loadFromStorage<Student[]>('students')
  const savedArr = Array.isArray(saved) ? saved : []
  const students = ref<Student[]>(savedArr.length ? savedArr : (USE_DEMO ? [...demoStudents] : []))
  const loading = ref(false)
  const total = ref(students.value.length)

  // Backfill enrollment numbers for any student that doesn't have one yet
  const DEFAULT_INST = '001'
  let globalSeq = Array.isArray(students.value) ? students.value.reduce((max, s) => {
    const n = s.enrollment_no ? parseInt(s.enrollment_no.slice(8)) : 0
    return Math.max(max, n)
  }, 0) : 0
  if (Array.isArray(students.value)) {
    students.value = students.value.map((s) => {
      if (!s.enrollment_no) {
        globalSeq++
        return { ...s, enrollment_no: generateEnrollmentNo(s.admission_date, s.class_name, DEFAULT_INST, globalSeq) }
      }
      return s
    })
  }

  // Persist on changes
  watch(students, (val) => saveToStorage('students', val), { deep: true })
  const currentPage = ref(1)
  const perPage = ref(10)
  const searchQuery = ref('')
  const classFilter = ref('')

  const filteredStudents = computed(() => {
    const list = Array.isArray(students.value) ? students.value : []
    let result = list
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.roll_number.toLowerCase().includes(q) ||
          (s.enrollment_no || '').toLowerCase().includes(q) ||
          s.parent_name.toLowerCase().includes(q) ||
          s.phone.includes(q),
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
    const list = Array.isArray(students.value) ? students.value : []
    const set = new Set(list.map((s) => s.class_name))
    return Array.from(set).sort()
  })


  async function fetchStudents(params?: PaginationParams) {
    if (USE_DEMO) return
    loading.value = true
    try {
      const res = await studentService.getAll(
        params || { page: currentPage.value, per_page: perPage.value, search: searchQuery.value },
      )
      // API returns { data: Student[] } — guard against unexpected shapes
      const rows = Array.isArray(res.data) ? res.data : []
      students.value = rows
      total.value = (res as any).total || rows.length
    } catch {
      toast.error('Failed to load students')
    } finally {
      loading.value = false
    }
  }

  async function addStudent(data: Omit<Student, 'id'>) {
    // Auto-generate enrollment number if not provided
    const inst = DEFAULT_INST
    globalSeq++
    const enrollment_no =
      data.enrollment_no || generateEnrollmentNo(data.admission_date, data.class_name, inst, globalSeq)

    if (USE_DEMO) {
      const newStudent = { ...data, enrollment_no, id: Date.now() } as Student
      students.value.unshift(newStudent)
      total.value = students.value.length
      toast.success('Student added successfully')
      return newStudent
    }
    loading.value = true
    try {
      const res = await studentService.create({ ...data, enrollment_no })
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

  async function fetchStudentById(id: number) {
    if (USE_DEMO) return students.value.find((s) => s.id === id)
    loading.value = true
    try {
      const res = await studentService.getById(id)
      return res.data
    } catch {
      toast.error('Failed to load student profile')
      return null
    } finally {
      loading.value = false
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
    fetchStudentById,
    addStudent,
    updateStudent,
    deleteStudent,
  }
})

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { AttendanceRecord, StaffAttendanceRecord } from '@/types'
import { useToastStore } from './toast'
import { saveToStorage, loadFromStorage } from '@/utils/storage'
import api from '@/services/api'
import { getOtpMode } from '@/utils/runtimeConfig'

const demoStaffAttendance: StaffAttendanceRecord[] = [
  { id: 1, staff_id: 1, staff_name: 'Priya Sharma', date: '2026-04-01', status: 'present' },
  { id: 2, staff_id: 1, staff_name: 'Priya Sharma', date: '2026-04-02', status: 'present' },
  { id: 3, staff_id: 1, staff_name: 'Priya Sharma', date: '2026-04-03', status: 'on_leave' },
  { id: 4, staff_id: 1, staff_name: 'Priya Sharma', date: '2026-04-04', status: 'present' },
  { id: 5, staff_id: 2, staff_name: 'Ravi Kumar', date: '2026-04-01', status: 'present' },
  { id: 6, staff_id: 2, staff_name: 'Ravi Kumar', date: '2026-04-02', status: 'absent' },
]

export const useAttendanceStore = defineStore('attendance', () => {
  const toast = useToastStore()
  const saved = loadFromStorage<AttendanceRecord[]>('attendance')
  const savedStaff = loadFromStorage<StaffAttendanceRecord[]>('staff_attendance')

  const records = ref<AttendanceRecord[]>(saved || [])
  const staffRecords = ref<StaffAttendanceRecord[]>(savedStaff || demoStaffAttendance)

  const loading = ref(false)
  const selectedDate = ref(new Date().toISOString().split('T')[0])
  const selectedClass = ref('')

  watch(records, (val) => saveToStorage('attendance', val), { deep: true })
  watch(staffRecords, (val) => saveToStorage('staff_attendance', val), { deep: true })

  const todayStats = computed(() => {
    const today = records.value.filter((r) => r.date === selectedDate.value)
    const present = today.filter((r) => r.status === 'present').length
    const absent = today.filter((r) => r.status === 'absent').length
    const late = today.filter((r) => r.status === 'late').length
    const total = today.length
    return { present, absent, late, total, percentage: total ? Math.round((present / total) * 100) : 0 }
  })

  async function fetchByDate(date: string) {
    if (getOtpMode() !== 'api') return
    loading.value = true
    try {
      const res = await api.get('/attendance', { params: { date, per_page: 200 } })
      const items: AttendanceRecord[] = res.data?.data?.items || []
      const otherDates = records.value.filter((r) => r.date !== date)
      records.value = [...otherDates, ...items]
    } catch {
      // Silently fall back
    } finally {
      loading.value = false
    }
  }

  async function markAttendance(
    studentRecords: {
      student_id: number
      student_name: string
      roll_number: string
      status: 'present' | 'absent' | 'late'
    }[],
  ) {
    const date = selectedDate.value
    loading.value = true
    try {
      if (getOtpMode() === 'api') {
        const payload = studentRecords.map((s) => ({ student_id: s.student_id, date, status: s.status }))
        await api.post('/attendance/bulk', { records: payload })
      }
      const studentIds = new Set(studentRecords.map((s) => s.student_id))
      records.value = records.value.filter((r) => r.date !== date || !studentIds.has(r.student_id))
      const newRecords: AttendanceRecord[] = studentRecords.map((s, i) => ({
        id: Date.now() + i,
        student_id: s.student_id,
        student_name: s.student_name,
        roll_number: s.roll_number,
        date,
        status: s.status,
      }))
      records.value.push(...newRecords)
      toast.success(`Attendance marked for ${studentRecords.length} students`)
    } catch {
      toast.error('Failed to save attendance.')
    } finally {
      loading.value = false
    }
  }

  function markStaffAttendance(id: number, name: string, date: string, status: StaffAttendanceRecord['status']) {
    staffRecords.value = staffRecords.value.filter((r) => !(r.staff_id === id && r.date === date))
    staffRecords.value.push({
      id: Date.now(),
      staff_id: id,
      staff_name: name,
      date,
      status,
    })
  }

  return {
    records,
    staffRecords,
    loading,
    selectedDate,
    selectedClass,
    todayStats,
    fetchByDate,
    markAttendance,
    markStaffAttendance,
  }
})

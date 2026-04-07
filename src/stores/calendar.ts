import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { CalendarEvent } from '@/types'
import { saveToStorage, loadFromStorage } from '@/utils/storage'
import api from '@/services/api'
import { getOtpMode } from '@/utils/runtimeConfig'

const demoEvents: CalendarEvent[] = [
  { id: 1, title: 'Independence Day', date: '2025-08-15', end_date: null, type: 'holiday', description: 'National Holiday — School Closed' },
  { id: 2, title: 'Unit Test 1 — Mathematics', date: '2025-07-21', end_date: null, type: 'exam', description: 'Class 8, 9, 10' },
  { id: 3, title: 'Unit Test 1 — Science', date: '2025-07-23', end_date: null, type: 'exam', description: 'Class 8, 9, 10' },
  { id: 4, title: 'Parent-Teacher Meeting', date: '2025-08-02', end_date: null, type: 'pta', description: 'All classes — 10AM to 1PM' },
  { id: 5, title: 'Annual Sports Day', date: '2025-11-15', end_date: null, type: 'sports', description: 'Full day event at school grounds' },
  { id: 6, title: 'Diwali Holidays Begin', date: '2025-10-18', end_date: null, type: 'holiday', description: 'School resumes 28 Oct' },
  { id: 7, title: 'Diwali Holidays End', date: '2025-10-27', end_date: null, type: 'holiday', description: 'School resumes 28 Oct' },
  { id: 8, title: 'Mid-Term Exams Begin', date: '2025-09-15', end_date: null, type: 'exam', description: 'All classes' },
  { id: 9, title: 'Mid-Term Exams End', date: '2025-09-22', end_date: null, type: 'exam', description: 'All classes' },
  { id: 10, title: 'Republic Day', date: '2025-01-26', end_date: null, type: 'holiday', description: 'Flag hoisting ceremony — 8AM' },
  { id: 11, title: 'Annual Day Celebration', date: '2025-12-20', end_date: null, type: 'event', description: 'Cultural programme and prize distribution' },
  { id: 12, title: 'Summer Vacation Begins', date: '2025-05-10', end_date: null, type: 'holiday', description: 'School resumes 1 Jul' },
  { id: 13, title: 'School Reopens', date: '2025-07-01', end_date: null, type: 'event', description: 'New academic year 2025-26' },
  { id: 14, title: 'Teachers Day', date: '2025-09-05', end_date: null, type: 'event', description: 'Special assembly and celebration' },
  { id: 15, title: 'Christmas', date: '2025-12-25', end_date: null, type: 'holiday', description: 'School Closed' },
]

export const useCalendarStore = defineStore('calendar', () => {
  const savedEvents = loadFromStorage<CalendarEvent[]>('calendar_events')
  const events = ref<CalendarEvent[]>(savedEvents || [...demoEvents])

  // Persist to localStorage
  watch(events, (val) => saveToStorage('calendar_events', val), { deep: true })

  // Computed
  const eventTypes = ['holiday', 'exam', 'event', 'pta', 'sports'] as const
  const upcomingEvents = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return events.value
      .filter((e) => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 10)
  })

  function addEvent(data: Omit<CalendarEvent, 'id'>) {
    if (getOtpMode() === 'api') {
      api.post('/calendar', {
        title: data.title,
        date: data.date,
        end_date: data.end_date,
        type: data.type,
        description: data.description,
      }).then((res) => {
        events.value.push(res.data.data)
      }).catch(() => {})
      return
    }
    const id = events.value.length ? Math.max(...events.value.map((e) => e.id)) + 1 : 1
    events.value.push({ id, ...data })
  }

  function deleteEvent(id: number) {
    if (getOtpMode() === 'api') {
      api.delete(`/calendar/${id}`).then(() => {
        events.value = events.value.filter((e) => e.id !== id)
      }).catch(() => {})
      return
    }
    events.value = events.value.filter((e) => e.id !== id)
  }

  async function fetchEvents(params?: { from?: string; to?: string; type?: string }) {
    if (getOtpMode() !== 'api') return
    try {
      const res = await api.get('/calendar', { params: { per_page: 200, ...params } })
      const items: CalendarEvent[] = res.data?.data?.items || []
      events.value = items
    } catch {
      // fall back to local data
    }
  }

  function getEventsForMonth(year: number, month: number) {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`
    return events.value.filter((e) => e.date.startsWith(prefix))
  }

  function getEventsForDate(dateStr: string) {
    return events.value.filter((e) => e.date === dateStr)
  }

  return {
    events,
    eventTypes,
    upcomingEvents,
    addEvent,
    deleteEvent,
    fetchEvents,
    getEventsForMonth,
    getEventsForDate,
  }
})

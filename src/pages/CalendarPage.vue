<template>
  <div class="space-y-6">
    <!-- Stats -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
      <StatCard title="Total Events" :value="calendarStore.events.length" icon="📅" icon-bg="bg-blue-50" />
      <StatCard title="Holidays" :value="calendarStore.events.filter(e => e.type === 'holiday').length" icon="🎉" icon-bg="bg-red-50" />
      <StatCard title="Exams" :value="calendarStore.events.filter(e => e.type === 'exam').length" icon="📝" icon-bg="bg-amber-50" />
      <StatCard title="Upcoming" :value="calendarStore.upcomingEvents.length" icon="⏳" icon-bg="bg-green-50" />
    </div>

    <!-- Controls -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3">
        <button @click="prevMonth" class="rounded-lg border border-gray-300 dark:border-gray-600 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" aria-label="Previous month">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white min-w-[180px] text-center">{{ monthName }} {{ currentYear }}</h3>
        <button @click="nextMonth" class="rounded-lg border border-gray-300 dark:border-gray-600 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" aria-label="Next month">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
        <button @click="goToToday" class="ml-2 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          Today
        </button>
      </div>
      <div class="flex items-center gap-2">
        <select v-model="typeFilter" class="rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="">All Types</option>
          <option value="holiday">Holidays</option>
          <option value="exam">Exams</option>
          <option value="event">Events</option>
          <option value="pta">PTA Meeting</option>
          <option value="sports">Sports</option>
        </select>
        <AppButton @click="showEventModal = true">+ Add Event</AppButton>
      </div>
    </div>

    <!-- Calendar Grid -->
    <AppCard :no-padding="true">
      <div class="grid grid-cols-7">
        <!-- Day headers -->
        <div v-for="day in dayNames" :key="day" class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 py-3 text-center text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
          {{ day }}
        </div>
        <!-- Calendar cells -->
        <div
          v-for="(cell, idx) in calendarCells"
          :key="idx"
          :class="[
            'min-h-[100px] border-b border-r border-gray-100 dark:border-gray-700 p-1.5 transition-colors',
            cell.isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-800/50',
            cell.isToday ? 'ring-2 ring-inset ring-primary-400' : '',
          ]"
        >
          <div class="flex items-center justify-between px-1">
            <span :class="['text-xs font-medium', cell.isCurrentMonth ? (cell.isToday ? 'text-primary-700 dark:text-primary-400 font-bold' : 'text-gray-700 dark:text-gray-300') : 'text-gray-300 dark:text-gray-600']">
              {{ cell.day }}
            </span>
          </div>
          <div class="mt-1 space-y-0.5">
            <div
              v-for="event in cell.events"
              :key="event.id"
              :class="['cursor-pointer truncate rounded px-1.5 py-0.5 text-[10px] font-medium leading-4', eventColor(event.type)]"
              :title="event.title + (event.description ? ' — ' + event.description : '')"
              @click="selectedEvent = event"
            >
              {{ event.title }}
            </div>
          </div>
        </div>
      </div>
    </AppCard>

    <!-- Upcoming Events List -->
    <AppCard title="Upcoming Events">
      <div class="divide-y divide-gray-50 dark:divide-gray-700">
        <div v-for="event in calendarStore.upcomingEvents" :key="event.id" class="flex items-start gap-4 py-3">
          <div :class="['mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-sm', eventBgColor(event.type)]">
            {{ eventEmoji(event.type) }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ event.title }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ event.description }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ formatDate(event.date) }}</p>
            <StatusBadge :color="typeColor(event.type)">{{ event.type }}</StatusBadge>
          </div>
        </div>
        <EmptyState v-if="!calendarStore.upcomingEvents.length" title="No upcoming events" message="Add events to see them here" />
      </div>
    </AppCard>

    <!-- Event Detail Modal -->
    <AppModal v-model="showDetail" :title="selectedEvent?.title || 'Event'" size="sm">
      <template v-if="selectedEvent">
        <div class="space-y-3">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Date</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ formatDate(selectedEvent.date) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Type</p>
            <StatusBadge :color="typeColor(selectedEvent.type)">{{ selectedEvent.type }}</StatusBadge>
          </div>
          <div v-if="selectedEvent.description">
            <p class="text-sm text-gray-500 dark:text-gray-400">Description</p>
            <p class="text-gray-900 dark:text-white">{{ selectedEvent.description }}</p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex items-center justify-between">
          <button
            @click="handleDeleteEvent"
            class="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          >
            Delete
          </button>
          <AppButton variant="secondary" @click="showDetail = false">Close</AppButton>
        </div>
      </template>
    </AppModal>

    <!-- Add Event Modal -->
    <AppModal v-model="showEventModal" title="Add Event" size="md">
      <form @submit.prevent="handleAddEvent" class="space-y-4">
        <AppInput v-model="eventForm.title" label="Event Title" placeholder="e.g. Parent-Teacher Meeting" required />
        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="eventForm.date" label="Date" type="date" required />
          <AppInput v-model="eventForm.type" type="select" label="Type" required>
            <option value="holiday">Holiday</option>
            <option value="exam">Exam</option>
            <option value="event">Event</option>
            <option value="pta">PTA Meeting</option>
            <option value="sports">Sports</option>
          </AppInput>
        </div>
        <AppInput v-model="eventForm.description" label="Description" placeholder="Optional description" />
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showEventModal = false">Cancel</AppButton>
          <AppButton @click="handleAddEvent">Add Event</AppButton>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import type { CalendarEvent } from '@/types'
import { useCalendarStore } from '@/stores/calendar'
import { useToastStore } from '@/stores/toast'
import StatCard from '@/components/ui/StatCard.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const calendarStore = useCalendarStore()
const toast = useToastStore()

const today = new Date()
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())
const typeFilter = ref('')
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const monthName = computed(() =>
  new Date(currentYear.value, currentMonth.value).toLocaleString('en-US', { month: 'long' })
)

function prevMonth() {
  if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value-- }
  else currentMonth.value--
}
function nextMonth() {
  if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++ }
  else currentMonth.value++
}
function goToToday() {
  currentMonth.value = today.getMonth()
  currentYear.value = today.getFullYear()
}

interface CalendarCell {
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  dateStr: string
  events: CalendarEvent[]
}

const calendarCells = computed(() => {
  const cells: CalendarCell[] = []
  const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay()
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
  const daysInPrevMonth = new Date(currentYear.value, currentMonth.value, 0).getDate()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  let monthEvents = calendarStore.getEventsForMonth(currentYear.value, currentMonth.value)
  if (typeFilter.value) monthEvents = monthEvents.filter((e) => e.type === typeFilter.value)

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i
    cells.push({ day: d, isCurrentMonth: false, isToday: false, dateStr: '', events: [] })
  }
  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({
      day: d,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      dateStr,
      events: monthEvents.filter((e) => e.date === dateStr),
    })
  }
  // Next month leading days
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, isCurrentMonth: false, isToday: false, dateStr: '', events: [] })
  }
  return cells
})

// Event details
const selectedEvent = ref<CalendarEvent | null>(null)
const showDetail = computed({
  get: () => !!selectedEvent.value,
  set: (v) => { if (!v) selectedEvent.value = null },
})

function handleDeleteEvent() {
  if (selectedEvent.value) {
    calendarStore.deleteEvent(selectedEvent.value.id)
    selectedEvent.value = null
    toast.success('Event deleted')
  }
}

// Add Event
const showEventModal = ref(false)
const eventForm = reactive({ title: '', date: '', type: 'event', description: '' })

function handleAddEvent() {
  if (!eventForm.title || !eventForm.date) {
    toast.warning('Please fill required fields')
    return
  }
  calendarStore.addEvent({
    title: eventForm.title,
    date: eventForm.date,
    end_date: null,
    type: eventForm.type as CalendarEvent['type'],
    description: eventForm.description,
  })
  showEventModal.value = false
  eventForm.title = ''
  eventForm.date = ''
  eventForm.type = 'event'
  eventForm.description = ''
  toast.success('Event added')
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function eventColor(type: string) {
  const map: Record<string, string> = {
    holiday: 'bg-red-100 text-red-700',
    exam: 'bg-amber-100 text-amber-700',
    event: 'bg-blue-100 text-blue-700',
    pta: 'bg-purple-100 text-purple-700',
    sports: 'bg-green-100 text-green-700',
  }
  return map[type] || 'bg-gray-100 text-gray-700'
}

function eventBgColor(type: string) {
  const map: Record<string, string> = {
    holiday: 'bg-red-50 text-red-600',
    exam: 'bg-amber-50 text-amber-600',
    event: 'bg-blue-50 text-blue-600',
    pta: 'bg-purple-50 text-purple-600',
    sports: 'bg-green-50 text-green-600',
  }
  return map[type] || 'bg-gray-50 text-gray-600'
}

function eventEmoji(type: string) {
  const map: Record<string, string> = { holiday: '🎉', exam: '📝', event: '📌', pta: '👨‍👩‍👧', sports: '🏅' }
  return map[type] || '📅'
}

function typeColor(type: string): 'red' | 'yellow' | 'blue' | 'green' {
  const map: Record<string, 'red' | 'yellow' | 'blue' | 'green'> = { holiday: 'red', exam: 'yellow', event: 'blue', pta: 'blue', sports: 'green' }
  return map[type] || 'blue'
}
</script>

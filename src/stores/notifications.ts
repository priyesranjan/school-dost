import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { loadFromStorage, saveToStorage } from '@/utils/storage'
import { NOTIFICATION_EVENT } from '@/services/operationsAlertService'

export interface Notification {
  id: number
  type: 'payment' | 'attendance' | 'student' | 'fee_due' | 'system'
  title: string
  message: string
  read: boolean
  timestamp: string
  severity?: 'info' | 'warning' | 'critical'
  source_key?: string | null
  muted_until?: string | null
  acknowledged_at?: string | null
}

const demoNotifications: Notification[] = [
  { id: 1, type: 'payment', title: 'Payment Received', message: 'Aarav Sharma paid ₹15,000 for Tuition Fee', read: false, timestamp: new Date().toISOString() },
  { id: 2, type: 'fee_due', title: 'Fee Overdue', message: '4 students have overdue fees this month', read: false, timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 3, type: 'attendance', title: 'Attendance Alert', message: 'Class 10-A has 3 absent students today', read: false, timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: 4, type: 'student', title: 'New Admission', message: 'Riya Chopra enrolled in Class 9-A', read: true, timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 5, type: 'system', title: 'Backup Complete', message: 'Daily data backup completed successfully', read: true, timestamp: new Date(Date.now() - 172800000).toISOString() },
]

export const useNotificationStore = defineStore('notifications', () => {
  const saved = loadFromStorage<Notification[]>('notifications')

  function normalize(list: Notification[]) {
    return list.map((n) => ({
      ...n,
      severity: n.severity || (n.type === 'system' ? 'info' : undefined),
      source_key: typeof n.source_key === 'undefined' ? null : n.source_key,
      muted_until: typeof n.muted_until === 'undefined' ? null : n.muted_until,
      acknowledged_at: typeof n.acknowledged_at === 'undefined' ? null : n.acknowledged_at,
    }))
  }

  const notifications = ref<Notification[]>(normalize(saved || [...demoNotifications]))

  watch(notifications, (val) => saveToStorage('notifications', val), { deep: true })

  function syncFromStorage() {
    const latest = loadFromStorage<Notification[]>('notifications')
    if (latest) {
      notifications.value = normalize(latest)
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener(NOTIFICATION_EVENT, syncFromStorage)
  }

  const visibleNotifications = computed(() => {
    const now = Date.now()
    return notifications.value.filter((n) => {
      if (!n.muted_until) return true
      return now >= new Date(n.muted_until).getTime()
    })
  })

  const unreadCount = computed(() => visibleNotifications.value.filter((n) => !n.read).length)

  function addNotification(type: Notification['type'], title: string, message: string) {
    notifications.value.unshift({
      id: Date.now(),
      type,
      title,
      message,
      read: false,
      timestamp: new Date().toISOString(),
      severity: type === 'system' ? 'info' : undefined,
      source_key: null,
      muted_until: null,
      acknowledged_at: null,
    })
  }

  function markAsRead(id: number) {
    const n = notifications.value.find((n) => n.id === id)
    if (!n) return
    if (!n.read) {
      n.read = true
      n.acknowledged_at = new Date().toISOString()
      return
    }
    n.read = true
  }

  function acknowledge(id: number) {
    markAsRead(id)
  }

  function acknowledgeMany(ids: number[]) {
    const idSet = new Set(ids)
    notifications.value.forEach((n) => {
      if (!idSet.has(n.id)) return
      if (!n.read) {
        n.read = true
        n.acknowledged_at = new Date().toISOString()
      } else {
        n.read = true
      }
    })
  }

  function snooze(id: number, minutes = 60) {
    const n = notifications.value.find((x) => x.id === id)
    if (!n) return
    n.muted_until = new Date(Date.now() + minutes * 60000).toISOString()
    if (!n.read) {
      n.acknowledged_at = new Date().toISOString()
    }
    n.read = true
  }

  function snoozeMany(ids: number[], minutes = 60) {
    const idSet = new Set(ids)
    const until = new Date(Date.now() + minutes * 60000).toISOString()
    notifications.value.forEach((n) => {
      if (idSet.has(n.id)) {
        n.muted_until = until
        if (!n.read) {
          n.acknowledged_at = new Date().toISOString()
        }
        n.read = true
      }
    })
  }

  function clearReadSystemAlerts() {
    notifications.value = notifications.value.filter((n) => !(n.type === 'system' && n.read))
  }

  function markAllRead() {
    notifications.value.forEach((n) => {
      if (!n.read) {
        n.acknowledged_at = new Date().toISOString()
      }
      n.read = true
    })
  }

  function remove(id: number) {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  function timeAgo(timestamp: string): string {
    const diff = Date.now() - new Date(timestamp).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    return `${days}d ago`
  }

  return {
    notifications,
    visibleNotifications,
    unreadCount,
    addNotification,
    markAsRead,
    acknowledge,
    acknowledgeMany,
    snooze,
    snoozeMany,
    clearReadSystemAlerts,
    markAllRead,
    remove,
    timeAgo,
    syncFromStorage,
  }
})

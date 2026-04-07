import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { TimetableEntry } from '@/types'
import { loadFromStorage, saveToStorage } from '@/utils/storage'
import { useSmsStore } from './sms'
import { useStudentStore } from './students'
import { useToastStore } from './toast'
import { useAuditStore } from './audit'

const demoEntries: TimetableEntry[] = [
  { id: 1, class_name: 'Class 10', day: 'Monday', period: 'P1', subject: 'Mathematics', teacher: 'Priya Sharma', start_time: '09:00', end_time: '09:45' },
  { id: 2, class_name: 'Class 10', day: 'Monday', period: 'P2', subject: 'Science', teacher: 'Ravi Kumar', start_time: '09:50', end_time: '10:35' },
  { id: 3, class_name: 'Class 9', day: 'Tuesday', period: 'P1', subject: 'English', teacher: 'Meera Das', start_time: '09:00', end_time: '09:45' },
]

export const useTimetableStore = defineStore('timetable', () => {
  const smsStore = useSmsStore()
  const studentStore = useStudentStore()
  const toast = useToastStore()
  const auditStore = useAuditStore()
  const saved = loadFromStorage<TimetableEntry[]>('timetable')
  const entries = ref<TimetableEntry[]>(saved || demoEntries)

  watch(entries, (val) => saveToStorage('timetable', val), { deep: true })

  const classes = computed(() => Array.from(new Set(entries.value.map((e) => e.class_name))).sort())

  function toMinutes(hhmm: string): number {
    const [h, m] = hhmm.split(':').map(Number)
    return h * 60 + m
  }

  function hasTeacherClash(payload: Omit<TimetableEntry, 'id'>, excludeId?: number): boolean {
    const start = toMinutes(payload.start_time)
    const end = toMinutes(payload.end_time)
    return entries.value.some((e) => {
      if (excludeId && e.id === excludeId) return false
      if (e.teacher !== payload.teacher || e.day !== payload.day) return false
      const eStart = toMinutes(e.start_time)
      const eEnd = toMinutes(e.end_time)
      return start < eEnd && end > eStart
    })
  }

  function hasClassClash(payload: Omit<TimetableEntry, 'id'>, excludeId?: number): boolean {
    const start = toMinutes(payload.start_time)
    const end = toMinutes(payload.end_time)
    return entries.value.some((e) => {
      if (excludeId && e.id === excludeId) return false
      if (e.class_name !== payload.class_name || e.day !== payload.day) return false
      const eStart = toMinutes(e.start_time)
      const eEnd = toMinutes(e.end_time)
      return start < eEnd && end > eStart
    })
  }

  function addEntry(payload: Omit<TimetableEntry, 'id'>, sendSms: boolean) {
    if (hasClassClash(payload)) {
      toast.warning('Class timetable conflict: overlapping slot exists')
      return
    }
    if (hasTeacherClash(payload)) {
      toast.warning('Teacher clash: selected teacher has another class at this time')
      return
    }

    const record: TimetableEntry = { id: Date.now(), ...payload }
    entries.value.push(record)
    auditStore.addLog({
      action: 'timetable_entry_added',
      module: 'timetable',
      actor_name: 'System User',
      actor_role: 'staff',
      target: `${payload.class_name} ${payload.day} ${payload.period}`,
      metadata: `${payload.subject} by ${payload.teacher}`,
    })

    if (sendSms) {
      const targets = studentStore.students.filter((s) => s.class_name === payload.class_name)
      const msg = `TIMETABLE UPDATE: ${payload.class_name} ${payload.day} ${payload.period} - ${payload.subject} (${payload.start_time}-${payload.end_time})`
      for (const s of targets) {
        smsStore.sendScheduleSms(s.phone, s.name, msg)
      }
    }

    toast.success('Timetable entry saved')
  }

  function updateEntry(id: number, payload: Omit<TimetableEntry, 'id'>) {
    const index = entries.value.findIndex((e) => e.id === id)
    if (index === -1) return false
    if (hasClassClash(payload, id)) {
      toast.warning('Class timetable conflict: overlapping slot exists')
      return false
    }
    if (hasTeacherClash(payload, id)) {
      toast.warning('Teacher clash: selected teacher has another class at this time')
      return false
    }
    entries.value[index] = { id, ...payload }
    auditStore.addLog({
      action: 'timetable_entry_updated',
      module: 'timetable',
      actor_name: 'System User',
      actor_role: 'staff',
      target: `${payload.class_name} ${payload.day} ${payload.period}`,
      metadata: `${payload.subject} by ${payload.teacher}`,
    })
    toast.success('Timetable entry updated')
    return true
  }

  function deleteEntry(id: number) {
    const existing = entries.value.find((e) => e.id === id)
    entries.value = entries.value.filter((e) => e.id !== id)
    if (existing) {
      auditStore.addLog({
        action: 'timetable_entry_deleted',
        module: 'timetable',
        actor_name: 'System User',
        actor_role: 'staff',
        target: `${existing.class_name} ${existing.day} ${existing.period}`,
        metadata: `${existing.subject} by ${existing.teacher}`,
      })
    }
    toast.success('Timetable entry deleted')
  }

  function importFromCsv(csvText: string, sendSms: boolean) {
    const lines = csvText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)

    const report = {
      totalRows: 0,
      added: 0,
      classConflicts: [] as string[],
      teacherConflicts: [] as string[],
      invalidRows: [] as string[],
    }

    if (!lines.length) return report

    const hasHeader = /class_name|day|period|subject|teacher|start_time|end_time/i.test(lines[0])
    const rows = hasHeader ? lines.slice(1) : lines
    report.totalRows = rows.length

    const validDays = new Set(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])

    for (let i = 0; i < rows.length; i++) {
      const raw = rows[i]
      const cols = raw.split(',').map((c) => c.trim())
      if (cols.length < 7) {
        report.invalidRows.push(`Row ${i + 1}: Expected 7 columns`)
        continue
      }

      const [class_name, dayRaw, period, subject, teacher, start_time, end_time] = cols
      const day = dayRaw as TimetableEntry['day']
      if (!class_name || !period || !subject || !teacher || !start_time || !end_time) {
        report.invalidRows.push(`Row ${i + 1}: Missing required values`)
        continue
      }
      if (!validDays.has(day)) {
        report.invalidRows.push(`Row ${i + 1}: Invalid day '${dayRaw}'`)
        continue
      }
      if (!/^\d{2}:\d{2}$/.test(start_time) || !/^\d{2}:\d{2}$/.test(end_time)) {
        report.invalidRows.push(`Row ${i + 1}: Invalid time format (HH:MM)`)
        continue
      }

      const payload: Omit<TimetableEntry, 'id'> = {
        class_name,
        day,
        period,
        subject,
        teacher,
        start_time,
        end_time,
      }

      if (hasClassClash(payload)) {
        report.classConflicts.push(`Row ${i + 1}: ${class_name} ${day} overlaps existing slot`)
        continue
      }
      if (hasTeacherClash(payload)) {
        report.teacherConflicts.push(`Row ${i + 1}: ${teacher} has clash on ${day}`)
        continue
      }

      entries.value.push({ id: Date.now() * 1000 + i, ...payload })
      report.added++

      if (sendSms) {
        const targets = studentStore.students.filter((s) => s.class_name === payload.class_name)
        const msg = `TIMETABLE UPDATE: ${payload.class_name} ${payload.day} ${payload.period} - ${payload.subject} (${payload.start_time}-${payload.end_time})`
        for (const s of targets) {
          smsStore.sendScheduleSms(s.phone, s.name, msg)
        }
      }
    }

    toast.success(`Import complete: ${report.added}/${report.totalRows} rows added`)
    auditStore.addLog({
      action: 'timetable_csv_import',
      module: 'timetable',
      actor_name: 'System User',
      actor_role: 'staff',
      target: 'CSV Import',
      metadata: `Rows: ${report.totalRows}, Added: ${report.added}, ClassConflicts: ${report.classConflicts.length}, TeacherConflicts: ${report.teacherConflicts.length}, Invalid: ${report.invalidRows.length}`,
    })
    return report
  }

  return {
    entries,
    classes,
    addEntry,
    updateEntry,
    deleteEntry,
    importFromCsv,
  }
})

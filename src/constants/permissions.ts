export type Role = 'admin' | 'accountant' | 'teacher' | 'receptionist' | 'student' | 'parent' | 'hod'

/**
 * Role-Based Access Control — Strict Hierarchy
 * ─────────────────────────────────────────────
 * Admin        → Full platform control (all modules + security + settings)
 * HOD          → Department head: academic oversight + reports (NO security tools)
 * Teacher      → Classroom scope: students, attendance, exams, timetable (NO reports, NO fees)
 * Accountant   → Financial scope: fees, reports, SMS (NO students, NO security tools)
 * Receptionist → Front desk: student intake, fees, ID cards, certificates, SMS
 * Parent       → Ward monitoring: view fees, attendance, exams, calendar, notices
 * Student      → Personal only: view own attendance, exams, calendar, notices
 */
export const rolePermissions: Record<Role, string[]> = {
  // ─── Full Access ───────────────────────────────────────────
  admin: ['dashboard', 'students', 'student-detail', 'fees', 'attendance', 'exams', 'calendar', 'reports', 'sms', 'settings', 'profile', 'id-cards', 'certificates', 'notices', 'timetable', 'audit-logs', 'ops-alerts'],

  // ─── Department Oversight ──────────────────────────────────
  hod: ['dashboard', 'students', 'student-detail', 'attendance', 'exams', 'calendar', 'reports', 'profile', 'timetable', 'notices'],

  // ─── Classroom Scope ───────────────────────────────────────
  teacher: ['dashboard', 'students', 'student-detail', 'attendance', 'exams', 'calendar', 'profile', 'timetable', 'notices'],

  // ─── Financial Scope ───────────────────────────────────────
  accountant: ['dashboard', 'fees', 'reports', 'sms', 'profile'],

  // ─── Front Desk ────────────────────────────────────────────
  receptionist: ['dashboard', 'students', 'student-detail', 'fees', 'sms', 'profile', 'id-cards', 'certificates', 'notices'],

  // ─── Ward Monitoring ───────────────────────────────────────
  parent: ['dashboard', 'attendance', 'exams', 'calendar', 'fees', 'profile', 'timetable', 'notices'],

  // ─── Personal Only ─────────────────────────────────────────
  student: ['dashboard', 'attendance', 'exams', 'calendar', 'profile', 'timetable', 'notices'],
}


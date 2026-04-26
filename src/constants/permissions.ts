export type Role = 'superadmin' | 'admin' | 'accountant' | 'teacher' | 'receptionist' | 'student' | 'parent' | 'hod'

/**
 * Role-Based Access Control — Strict Hierarchy
 * ─────────────────────────────────────────────
 * SuperAdmin   → Platform operator: onboard institutions, manage subscriptions
 * Admin        → Full institution control (all modules + security + settings)
 * HOD          → Department head: academic oversight + reports (NO security tools)
 * Teacher      → Classroom scope: students, attendance, exams, timetable (NO reports, NO fees)
 * Accountant   → Financial scope: fees, reports, SMS (NO students, NO security tools)
 * Receptionist → Front desk: student intake, fees, ID cards, certificates, SMS
 * Parent       → Ward monitoring: view fees, attendance, exams, calendar, notices
 * Student      → Personal only: view own attendance, exams, calendar, notices
 */
export const rolePermissions: Record<Role, string[]> = {
  // ─── Platform Operator ─────────────────────────────────────
  superadmin: ['superadmin-dashboard', 'institutions', 'onboarding', 'platform-settings'],

  // ─── Full Institution Access ───────────────────────────────
  admin: [
    'dashboard',
    'students',
    'student-detail',
    'parents',
    'staff',
    'hr-operations',
    'staff-detail',
    'fees',
    'expenses',
    'payroll',
    'inventory',
    'attendance',
    'assignments',
    'exams',
    'calendar',
    'reports',
    'sms',
    'settings',
    'profile',
    'id-cards',
    'certificates',
    'notices',
    'timetable',
    'audit-logs',
    'ops-alerts',
    'institution-profile',
    'intervention-board',
    'alerts-engine',
    'fee-risk-console',
    'parent-communication',
    'webhooks',
    'fee-structure',
    'student-promotion',
    'class-management',
    'enrollment-numbers',
  ],

  // ─── Department Oversight ──────────────────────────────────
  hod: [
    'dashboard',
    'students',
    'student-detail',
    'parents',
    'staff',
    'hr-operations',
    'staff-detail',
    'attendance',
    'hr-operations',
    'assignments',
    'exams',
    'calendar',
    'reports',
    'profile',
    'timetable',
    'notices',
    'intervention-board',
    'alerts-engine',
    'parent-communication',
    'class-management',
    'enrollment-numbers',
  ],

  // ─── Classroom Scope ───────────────────────────────────────
  teacher: [
    'dashboard',
    'students',
    'student-detail',
    'parents',
    'attendance',
    'assignments',
    'exams',
    'calendar',
    'profile',
    'timetable',
    'notices',
    'parent-communication',
  ],

  // ─── Financial Scope ───────────────────────────────────────
  accountant: ['dashboard', 'fees', 'expenses', 'payroll', 'inventory', 'reports', 'sms', 'profile', 'fee-risk-console', 'fee-structure'],

  // ─── Front Desk ────────────────────────────────────────────
  receptionist: [
    'dashboard',
    'students',
    'student-detail',
    'parents',
    'fees',
    'sms',
    'profile',
    'id-cards',
    'certificates',
    'notices',
    'fee-risk-console',
    'parent-communication',
    'student-promotion',
  ],

  // ─── Ward Monitoring ───────────────────────────────────────
  parent: ['dashboard', 'attendance', 'assignments', 'exams', 'calendar', 'fees', 'profile', 'timetable', 'notices'],

  // ─── Personal Only ─────────────────────────────────────────
  student: ['dashboard', 'attendance', 'assignments', 'exams', 'calendar', 'profile', 'timetable', 'notices'],
}

import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { rolePermissions } from '@/constants/permissions'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { layout: 'auth' },
  },
  // ═══════════════════════════════════════════════════════════
  // Super Admin Routes
  // ═══════════════════════════════════════════════════════════
  {
    path: '/superadmin',
    name: 'superadmin-dashboard',
    component: () => import('@/pages/superadmin/SuperAdminDashboard.vue'),
    meta: { title: 'Platform Overview', layout: 'superadmin' },
  },
  {
    path: '/superadmin/institutions',
    name: 'institutions',
    component: () => import('@/pages/superadmin/InstitutionsListPage.vue'),
    meta: { title: 'All Institutions', layout: 'superadmin' },
  },
  {
    path: '/superadmin/onboard',
    name: 'onboarding',
    component: () => import('@/pages/superadmin/OnboardingWizard.vue'),
    meta: { title: 'Onboard New Institution', layout: 'superadmin' },
  },
  {
    path: '/superadmin/institutions/:id',
    name: 'tenant-detail',
    component: () => import('@/pages/superadmin/TenantDetailPage.vue'),
    meta: { title: 'Institution Detail', layout: 'superadmin' },
  },
  // ═══════════════════════════════════════════════════════════
  // Public Website (No Auth Required)
  // ═══════════════════════════════════════════════════════════
  {
    path: '/site/:slug',
    name: 'public-website',
    component: () => import('@/pages/PublicWebsitePage.vue'),
    meta: { title: 'Institution Website', layout: 'public' },
  },
  // ═══════════════════════════════════════════════════════════
  // School/College ERP Routes
  // ═══════════════════════════════════════════════════════════
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/pages/DashboardPage.vue'),
    meta: { title: 'Dashboard' },
  },
  {
    path: '/institution-profile',
    name: 'institution-profile',
    component: () => import('@/pages/InstitutionProfilePage.vue'),
    meta: { title: 'Institution Profile' },
  },
  {
    path: '/students',
    name: 'students',
    component: () => import('@/pages/StudentsPage.vue'),
    meta: { title: 'Students' },
  },
  {
    path: '/students/:id',
    name: 'student-detail',
    component: () => import('@/pages/StudentDetailPage.vue'),
    meta: { title: 'Student Profile' },
  },
  {
    path: '/parents',
    name: 'parents',
    component: () => import('@/pages/ParentsPage.vue'),
    meta: { title: 'Parent & Guardian Management' },
  },
  {
    path: '/staff',
    name: 'staff',
    component: () => import('@/pages/StaffPage.vue'),
    meta: { title: 'Staff & Faculty' },
  },
  {
    path: '/staff/:id',
    name: 'staff-detail',
    component: () => import('@/pages/StaffDetailPage.vue'),
    meta: { title: 'Staff Profile' },
  },
  {
    path: '/fees',
    name: 'fees',
    component: () => import('@/pages/FeesPage.vue'),
    meta: { title: 'Fees' },
  },
  {
    path: '/attendance',
    name: 'attendance',
    component: () => import('@/pages/AttendancePage.vue'),
    meta: { title: 'Attendance' },
  },
  {
    path: '/exams',
    name: 'exams',
    component: () => import('@/pages/ExamsPage.vue'),
    meta: { title: 'Exams & Grades' },
  },
  {
    path: '/assignments',
    name: 'assignments',
    component: () => import('@/pages/AssignmentsPage.vue'),
    meta: { title: 'Assignments' },
  },
  {
    path: '/expenses',
    name: 'expenses',
    component: () => import('@/pages/ExpensesPage.vue'),
    meta: { title: 'Expenses & Ledger' },
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: () => import('@/pages/CalendarPage.vue'),
    meta: { title: 'Academic Calendar' },
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import('@/pages/ReportsPage.vue'),
    meta: { title: 'Reports' },
  },
  {
    path: '/sms',
    name: 'sms',
    component: () => import('@/pages/SmsPage.vue'),
    meta: { title: 'SMS Notifications' },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/pages/SettingsPage.vue'),
    meta: { title: 'Settings' },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/pages/ProfilePage.vue'),
    meta: { title: 'My Profile' },
  },
  {
    path: '/id-cards',
    name: 'id-cards',
    component: () => import('@/pages/IdCardsPage.vue'),
    meta: { title: 'ID Cards' },
  },
  {
    path: '/certificates',
    name: 'certificates',
    component: () => import('@/pages/CertificatesPage.vue'),
    meta: { title: 'Certificates' },
  },
  {
    path: '/notices',
    name: 'notices',
    component: () => import('@/pages/NoticesPage.vue'),
    meta: { title: 'Notices' },
  },
  {
    path: '/timetable',
    name: 'timetable',
    component: () => import('@/pages/TimetablePage.vue'),
    meta: { title: 'Class Timetable' },
  },
  {
    path: '/audit-logs',
    name: 'audit-logs',
    component: () => import('@/pages/AuditLogsPage.vue'),
    meta: { title: 'Audit Logs' },
  },
  {
    path: '/ops-alerts',
    name: 'ops-alerts',
    component: () => import('@/pages/OpsAlertsPage.vue'),
    meta: { title: 'Ops Alerts' },
  },
  {
    path: '/intervention-board',
    name: 'intervention-board',
    component: () => import('@/pages/InterventionBoardPage.vue'),
    meta: { title: 'Intervention Board' },
  },
  {
    path: '/alerts-engine',
    name: 'alerts-engine',
    component: () => import('@/pages/AlertsEnginePage.vue'),
    meta: { title: 'Smart Alerts Engine' },
  },
  {
    path: '/fee-risk-console',
    name: 'fee-risk-console',
    component: () => import('@/pages/FeeRiskConsolePage.vue'),
    meta: { title: 'Fee Risk Console' },
  },
  {
    path: '/parent-communication',
    name: 'parent-communication',
    component: () => import('@/pages/ParentCommunicationPage.vue'),
    meta: { title: 'Parent Communication Hub' },
  },
  {
    path: '/fee-structure',
    name: 'fee-structure',
    component: () => import('@/pages/FeeStructurePage.vue'),
    meta: { title: 'Fee Structure Manager' },
  },
  {
    path: '/student-promotion',
    name: 'student-promotion',
    component: () => import('@/pages/StudentPromotionPage.vue'),
    meta: { title: 'Student Promotion' },
  },
  {
    path: '/class-management',
    name: 'class-management',
    component: () => import('@/pages/ClassManagementPage.vue'),
    meta: { title: 'Class Management' },
  },
  {
    path: '/enrollment-numbers',
    name: 'enrollment-numbers',
    component: () => import('@/pages/EnrollmentNumberPage.vue'),
    meta: { title: 'Enrollment Numbers' },
  },
  {
    path: '/verify-certificate',
    name: 'verify-certificate',
    component: () => import('@/pages/CertificateVerifyPage.vue'),
    meta: { title: 'Verify Certificate', layout: 'auth' },
  },
  {
    path: '/parent-portal',
    name: 'parent-portal',
    component: () => import('@/pages/ParentPortalPage.vue'),
    meta: { title: 'Parent Portal', layout: 'auth' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: { title: 'Page Not Found' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('auth_token')
  const publicRoutes = new Set(['login', 'not-found', 'verify-certificate', 'parent-portal', 'public-website'])

  if (!publicRoutes.has(String(to.name)) && !token) {
    next({ name: 'login' })
  } else if (to.name === 'login' && token) {
    // Smart redirect based on role
    const savedUser = localStorage.getItem('auth_user')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser) as { role: string }
        if (user.role === 'superadmin') {
          next({ name: 'superadmin-dashboard' })
          return
        }
      } catch {
        /* fall through */
      }
    }
    next({ name: 'dashboard' })
  } else if (token && to.name && !publicRoutes.has(String(to.name))) {
    // RBAC check
    const savedUser = localStorage.getItem('auth_user')
    if (savedUser) {
      let user: { role: string } | null = null
      try {
        user = JSON.parse(savedUser)
      } catch {
        localStorage.removeItem('auth_user')
        next({ name: 'login' })
        return
      }
      if (!user) {
        next({ name: 'login' })
        return
      }
      const perms = rolePermissions[user.role as keyof typeof rolePermissions] || []
      if (!perms.includes(String(to.name))) {
        // Redirect superadmin to their dashboard, others to theirs
        if (user.role === 'superadmin') {
          next({ name: 'superadmin-dashboard' })
        } else {
          next({ name: 'dashboard' })
        }
        return
      }
    }
    next()
  } else {
    next()
  }
})

export default router

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
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/pages/DashboardPage.vue'),
    meta: { title: 'Dashboard' },
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
  const publicRoutes = new Set(['login', 'not-found', 'verify-certificate', 'parent-portal'])

  if (!publicRoutes.has(String(to.name)) && !token) {
    next({ name: 'login' })
  } else if (to.name === 'login' && token) {
    next({ name: 'dashboard' })
  } else if (token && to.name && !publicRoutes.has(String(to.name))) {
    // RBAC check
    const savedUser = localStorage.getItem('auth_user')
    if (savedUser) {
      let user: { role: string } | null = null
      try { user = JSON.parse(savedUser) } catch { localStorage.removeItem('auth_user'); next({ name: 'login' }); return }
      if (!user) { next({ name: 'login' }); return }
      const perms = rolePermissions[user.role as keyof typeof rolePermissions] || []
      if (!perms.includes(String(to.name))) {
        next({ name: 'dashboard' })
        return
      }
    }
    next()
  } else {
    next()
  }
})

export default router

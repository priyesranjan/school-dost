<template>
  <div class="animate-fade-in-up">
    <!-- Welcome Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Welcome back, <span class="text-primary-600 dark:text-primary-400">{{ authStore.user?.name || 'Principal' }}</span
        >!
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ currentDate }} &middot; Here's the principal overview of the school.
      </p>
    </div>

    <!-- ===== Subscription Validity Card ===== -->
    <div v-if="subscription" :class="['mb-6 rounded-2xl border-2 p-4 transition-all', subCardClass]">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <!-- Left: Title + Status -->
        <div class="flex items-center gap-3">
          <div :class="['flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl', subIconBg]">
            {{ subIcon }}
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider" :class="subTextMuted">Software License</p>
            <p class="text-lg font-black" :class="subTextColor">{{ subStatusLabel }}</p>
            <p class="text-xs mt-0.5" :class="subTextMuted">
              <span v-if="subscription.subscription_status === 'trial'">
                🆓 Free Trial &middot; Ends <strong>{{ fmtDate(subscription.trial_ends_at) }}</strong>
              </span>
              <span v-else-if="subscription.subscription_status === 'active'">
                ✅ Valid Until <strong>{{ fmtDate(subscription.subscription_end) }}</strong>
              </span>
              <span v-else-if="subscription.subscription_status === 'expired'">
                ❌ Expired on <strong>{{ fmtDate(subscription.trial_ends_at || subscription.subscription_end) }}</strong>
              </span>
              <span v-else>⛔ Account Suspended</span>
            </p>
          </div>
        </div>

        <!-- Center: Days remaining ring -->
        <div class="flex items-center gap-4">
          <div class="relative h-20 w-20">
            <svg class="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle class="opacity-20" :stroke="subRingColor" stroke-width="10" fill="transparent" r="40" cx="50" cy="50" />
              <circle
                :stroke="subRingColor"
                stroke-width="10"
                :stroke-dasharray="2 * Math.PI * 40"
                :stroke-dashoffset="2 * Math.PI * 40 * (1 - Math.min(subDaysLeft / subTotalDays, 1))"
                stroke-linecap="round"
                fill="transparent"
                r="40" cx="50" cy="50"
                class="transition-all duration-700"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-lg font-black" :class="subTextColor">{{ subDaysLeft }}</span>
              <span class="text-[9px] font-bold uppercase" :class="subTextMuted">days</span>
            </div>
          </div>
          <div class="space-y-1">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider" :class="subTextMuted">Plan</p>
              <p class="font-black capitalize" :class="subTextColor">{{ subscription.subscription_plan }}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider" :class="subTextMuted">Monthly Bill</p>
              <p class="font-black" :class="subTextColor">{{ monthlyBillDisplay }}</p>
            </div>
          </div>
        </div>

        <!-- Right: CTA -->
        <div class="flex flex-col gap-2">
          <p class="text-xs font-bold" :class="subTextColor">
            {{ subDaysLeft <= 3 ? '🚨 URGENT: Renew immediately!' : subDaysLeft <= 7 ? '⚠️ Renew soon to avoid disruption' : '📞 Contact admin for renewal' }}
          </p>
          <a
            href="mailto:support@schooldost.in?subject=Subscription Renewal"
            :class="['rounded-xl px-4 py-2 text-center text-xs font-black text-white transition-all hover:scale-105', subBtnColor]"
          >
            {{ subscription.subscription_status === 'expired' ? '🔓 Renew Now' : '📧 Contact for Renewal' }}
          </a>
          <p class="text-[10px] text-center" :class="subTextMuted">support@schooldost.in</p>
        </div>
      </div>

      <!-- Expiry progress bar -->
      <div class="mt-3">
        <div class="flex justify-between text-[10px] font-bold mb-1" :class="subTextMuted">
          <span>Validity Progress</span>
          <span>{{ Math.min(Math.round((subDaysLeft / subTotalDays) * 100), 100) }}% remaining</span>
        </div>
        <div class="h-2 rounded-full bg-black/10 overflow-hidden">
          <div
            :class="['h-full rounded-full transition-all duration-700', subProgressColor]"
            :style="{ width: Math.min((subDaysLeft / subTotalDays) * 100, 100) + '%' }"
          />
        </div>
      </div>
    </div>

    <div class="flex gap-6">
      <!-- ===== Main Content ===== -->
      <div class="flex-1 min-w-0 space-y-6">
        <!-- Stat Cards Row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            class="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4"
          >
            <div
              class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30"
            >
              <svg class="h-7 w-7 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ studentStore.students.length.toLocaleString() }}
              </p>
            </div>
          </div>
          <div
            class="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4"
          >
            <div
              class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30"
            >
              <svg class="h-7 w-7 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Teachers</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ teacherCount }}</p>
            </div>
          </div>
          <div
            class="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4"
          >
            <div
              class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
            >
              <svg class="h-7 w-7 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Working Staff</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ staffCount }}</p>
            </div>
          </div>
          <div
            class="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4"
          >
            <div
              class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30"
            >
              <svg class="h-7 w-7 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">This Month Events</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ thisMonthEventCount }}</p>
            </div>
          </div>
        </div>

        <!-- Attendance Donut Charts Row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Student Attendance -->
          <div class="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">Student Attendance</h3>
            <div class="flex items-center justify-center">
              <div class="relative h-40 w-40">
                <svg class="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    class="text-red-200 dark:text-red-900/40"
                    stroke-width="12"
                    stroke="currentColor"
                    fill="transparent"
                    r="38"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    class="text-green-500 transition-all duration-700"
                    stroke-width="12"
                    :stroke-dasharray="2 * Math.PI * 38"
                    :stroke-dashoffset="2 * Math.PI * 38 * (1 - studentAttendance.presentPct / 100)"
                    stroke-linecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="38"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <span class="text-2xl font-bold text-gray-900 dark:text-white"
                    >{{ studentAttendance.presentPct }}%</span
                  >
                </div>
              </div>
            </div>
            <div class="mt-4 flex justify-center gap-6 text-sm text-gray-600 dark:text-gray-300">
              <span class="flex items-center gap-2"
                ><span class="h-3 w-3 rounded-full bg-green-500"></span> Present: {{ studentAttendance.present }}</span
              >
              <span class="flex items-center gap-2"
                ><span class="h-3 w-3 rounded-full bg-red-400"></span> Absent: {{ studentAttendance.absent }}</span
              >
            </div>
          </div>
          <!-- Teachers Attendance -->
          <div class="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">Teachers Attendance</h3>
            <div class="flex items-center justify-center">
              <div class="relative h-40 w-40">
                <svg class="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    class="text-red-200 dark:text-red-900/40"
                    stroke-width="12"
                    stroke="currentColor"
                    fill="transparent"
                    r="38"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    class="text-blue-500 transition-all duration-700"
                    stroke-width="12"
                    :stroke-dasharray="2 * Math.PI * 38"
                    :stroke-dashoffset="2 * Math.PI * 38 * (1 - teacherAttendance.presentPct / 100)"
                    stroke-linecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="38"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <span class="text-2xl font-bold text-gray-900 dark:text-white"
                    >{{ teacherAttendance.presentPct }}%</span
                  >
                </div>
              </div>
            </div>
            <div class="mt-4 flex justify-center gap-6 text-sm text-gray-600 dark:text-gray-300">
              <span class="flex items-center gap-2"
                ><span class="h-3 w-3 rounded-full bg-blue-500"></span> Present: {{ teacherAttendance.present }}</span
              >
              <span class="flex items-center gap-2"
                ><span class="h-3 w-3 rounded-full bg-red-400"></span> Absent: {{ teacherAttendance.absent }}</span
              >
            </div>
          </div>
          <!-- Staff Attendance -->
          <div class="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">Staff Attendance</h3>
            <div class="flex items-center justify-center">
              <div class="relative h-40 w-40">
                <svg class="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    class="text-red-200 dark:text-red-900/40"
                    stroke-width="12"
                    stroke="currentColor"
                    fill="transparent"
                    r="38"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    class="text-purple-500 transition-all duration-700"
                    stroke-width="12"
                    :stroke-dasharray="2 * Math.PI * 38"
                    :stroke-dashoffset="2 * Math.PI * 38 * (1 - staffAttendanceData.presentPct / 100)"
                    stroke-linecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="38"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <span class="text-2xl font-bold text-gray-900 dark:text-white"
                    >{{ staffAttendanceData.presentPct }}%</span
                  >
                </div>
              </div>
            </div>
            <div class="mt-4 flex justify-center gap-6 text-sm text-gray-600 dark:text-gray-300">
              <span class="flex items-center gap-2"
                ><span class="h-3 w-3 rounded-full bg-purple-500"></span> Present:
                {{ staffAttendanceData.present }}</span
              >
              <span class="flex items-center gap-2"
                ><span class="h-3 w-3 rounded-full bg-red-400"></span> Absent: {{ staffAttendanceData.absent }}</span
              >
            </div>
          </div>
        </div>

        <!-- Student Directory Table -->
        <div
          class="rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div class="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">Student Directory</h3>
            <router-link
              to="/students"
              class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
              >View All &rarr;</router-link
            >
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-gray-50 dark:bg-gray-700/50 text-left">
                  <th class="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Student Name</th>
                  <th class="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Parents Names</th>
                  <th class="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Phone</th>
                  <th class="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Class</th>
                  <th class="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Grade</th>
                  <th class="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Fee Status</th>
                  <th class="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
                <tr
                  v-for="student in directoryStudents"
                  :key="student.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <td class="px-5 py-3">
                    <div class="flex items-center gap-3">
                      <div
                        class="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-bold text-primary-700 dark:text-primary-300"
                      >
                        {{ student.name.charAt(0) }}
                      </div>
                      <span class="font-medium text-gray-900 dark:text-white">{{ student.name }}</span>
                    </div>
                  </td>
                  <td class="px-5 py-3 text-gray-600 dark:text-gray-400">{{ student.parent_name || '-' }}</td>
                  <td class="px-5 py-3 text-gray-600 dark:text-gray-400">{{ student.phone || '-' }}</td>
                  <td class="px-5 py-3 text-gray-600 dark:text-gray-400">{{ student.class_name }}</td>
                  <td class="px-5 py-3">
                    <span
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                      :class="getStudentGrade(student.id).color"
                    >
                      {{ getStudentGrade(student.id).grade }}
                    </span>
                  </td>
                  <td class="px-5 py-3">
                    <span
                      class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold"
                      :class="getStudentFeeStatus(student.id).color"
                    >
                      {{ getStudentFeeStatus(student.id).label }}
                    </span>
                  </td>
                  <td class="px-5 py-3">
                    <router-link
                      :to="`/students/${student.id}`"
                      class="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium text-xs"
                    >
                      View
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Fees Collection Bar Chart -->
        <div class="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">Fees Collection</h3>
            <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span class="flex items-center gap-2"><span class="h-3 w-3 rounded bg-blue-500"></span> Total Fee</span>
              <span class="flex items-center gap-2"
                ><span class="h-3 w-3 rounded bg-green-500"></span> Collected Fee</span
              >
            </div>
          </div>
          <div class="flex items-end gap-8 h-52 px-4">
            <div v-for="(q, idx) in quarterlyFees" :key="idx" class="flex-1 flex items-end gap-2 h-full">
              <div class="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <span class="text-[10px] font-bold text-gray-400">{{ formatK(q.total) }}</span>
                <div
                  class="w-full rounded-t-lg bg-blue-500 transition-all duration-700"
                  :style="{ height: (q.total / maxFee) * 100 + '%', minHeight: '4px' }"
                ></div>
              </div>
              <div class="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <span class="text-[10px] font-bold text-gray-400">{{ formatK(q.collected) }}</span>
                <div
                  class="w-full rounded-t-lg bg-green-500 transition-all duration-700"
                  :style="{ height: (q.collected / maxFee) * 100 + '%', minHeight: '4px' }"
                ></div>
              </div>
            </div>
          </div>
          <div class="flex justify-around mt-3 text-xs font-medium text-gray-500 dark:text-gray-400">
            <span v-for="(q, idx) in quarterlyFees" :key="idx">{{ q.label }}</span>
          </div>
        </div>
      </div>

      <!-- ===== Right Sidebar ===== -->
      <div class="hidden xl:block w-80 shrink-0 space-y-6">
        <!-- Calendar Widget -->
        <div class="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">{{ calendarMonthYear }}</h3>
            <div class="flex gap-1">
              <button
                @click="calMonth--"
                class="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                @click="calMonth++"
                class="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <div class="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400 uppercase mb-1">
            <span v-for="d in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="d">{{ d }}</span>
          </div>
          <div class="grid grid-cols-7 gap-1">
            <div
              v-for="(day, i) in calendarDays"
              :key="i"
              class="h-8 flex items-center justify-center text-xs rounded-lg mx-auto"
              :class="[
                !day
                  ? ''
                  : day.isToday
                    ? 'bg-primary-600 text-white font-bold w-8'
                    : day.hasEvent
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 font-medium w-8'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-8',
              ]"
            >
              {{ day?.date || '' }}
            </div>
          </div>
          <router-link
            to="/calendar"
            class="mt-4 block w-full rounded-lg bg-primary-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
          >
            View Calendar
          </router-link>
        </div>

        <!-- Upcoming Activities -->
        <div class="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">Upcoming Activities</h3>
          <div class="space-y-3">
            <div
              v-for="event in upcomingActivities"
              :key="event.id"
              class="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30"
            >
              <div
                class="shrink-0 h-12 w-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex flex-col items-center justify-center"
              >
                <span class="text-sm font-bold text-primary-700 dark:text-primary-300 leading-none">{{
                  getEventDay(event.date)
                }}</span>
                <span class="text-[10px] text-primary-500 dark:text-primary-400 uppercase leading-none mt-0.5">{{
                  getEventMonth(event.date)
                }}</span>
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ event.title }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 capitalize">{{ event.type }}</p>
              </div>
            </div>
            <div v-if="!upcomingActivities.length" class="text-center py-4 text-sm text-gray-400">
              No upcoming activities
            </div>
          </div>
        </div>

        <!-- Class Wise Performance -->
        <div class="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">Class Wise Performance</h3>
          <div class="flex items-center justify-center">
            <div class="relative h-36 w-36">
              <svg class="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  class="text-gray-200 dark:text-gray-700"
                  stroke-width="14"
                  stroke="currentColor"
                  fill="transparent"
                  r="36"
                  cx="50"
                  cy="50"
                />
                <circle
                  class="text-green-500 transition-all duration-700"
                  stroke-width="14"
                  :stroke-dasharray="2 * Math.PI * 36"
                  :stroke-dashoffset="2 * Math.PI * 36 * (1 - classPerformance.goodPct / 100)"
                  stroke-linecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="36"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-xl font-bold text-gray-900 dark:text-white">{{ classPerformance.goodPct }}%</span>
                <span class="text-[10px] text-gray-500 font-medium">Good</span>
              </div>
            </div>
          </div>
          <div class="mt-4 space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400">Attendance Average</span>
              <span class="font-bold text-gray-900 dark:text-white">{{ attendanceStore.todayStats.percentage }}%</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400">Edu. Grade Average</span>
              <span class="font-bold text-gray-900 dark:text-white">{{ classPerformance.avgGrade }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div class="grid grid-cols-2 gap-3">
            <router-link
              v-for="action in quickActions"
              :key="action.path"
              :to="action.path"
              class="group flex flex-col items-center gap-2 rounded-xl border border-gray-100 dark:border-gray-700 p-3 text-center transition-all hover:border-primary-200 hover:shadow-md hover:-translate-y-0.5 dark:hover:border-primary-800"
            >
              <div
                :class="[
                  'flex h-10 w-10 items-center justify-center rounded-xl text-lg transition-transform group-hover:scale-110',
                  action.bg,
                ]"
              >
                {{ action.icon }}
              </div>
              <p class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ action.title }}</p>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useStudentStore } from '@/stores/students'
import { useFeeStore } from '@/stores/fees'
import { useAttendanceStore } from '@/stores/attendance'
import { useStaffStore } from '@/stores/staff'
import { useCalendarStore } from '@/stores/calendar'
import { useExamStore } from '@/stores/exams'
import { useTenantsStore } from '@/stores/tenants'
import { calcMonthlyBill } from '@/types'

const authStore = useAuthStore()
const studentStore = useStudentStore()
const feeStore = useFeeStore()
const attendanceStore = useAttendanceStore()
const staffStore = useStaffStore()
const calendarStore = useCalendarStore()
const examStore = useExamStore()
const tenantStore = useTenantsStore()

// ── Subscription info for this school ────────────────────
const subscription = computed(() => {
  const tenantId = authStore.user?.tenant_id
  if (tenantId) return tenantStore.tenants.find((t) => t.id === tenantId) ?? null
  // Demo fallback: if no tenant_id (local dev), show first school tenant
  if (authStore.user?.role !== 'superadmin') {
    return tenantStore.tenants.find((t) => t.subscription_status !== undefined) ?? null
  }
  return null // superadmin sees no card
})

const subDaysLeft = computed(() => subscription.value ? tenantStore.getDaysRemaining(subscription.value) : 0)

// Total days in the subscription/trial period for progress bar
const subTotalDays = computed(() => {
  const s = subscription.value
  if (!s) return 15
  if (s.subscription_status === 'trial') {
    // trial is always 15 days total
    return 15
  }
  // For active: calculate span from onboarded_at to subscription_end
  if (s.subscription_end && s.onboarded_at) {
    const start = new Date(s.onboarded_at).getTime()
    const end = new Date(s.subscription_end).getTime()
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 30
  }
  return 30
})

const monthlyBillDisplay = computed(() => {
  const r = calcMonthlyBill(subscription.value?.total_students ?? 0)
  return r.amount !== null ? '₹' + r.amount.toLocaleString('en-IN') + '/mo' : 'Contact Us'
})

function fmtDate(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Visual variants based on status
const subStatus = computed(() => subscription.value?.subscription_status ?? 'active')
const subStatusLabel = computed(() => {
  const m: Record<string, string> = {
    active: '✅ Active Subscription',
    trial: '🟡 Trial Period Active',
    expired: '🔴 Subscription Expired',
    suspended: '⛔ Account Suspended',
  }
  return m[subStatus.value] ?? 'Unknown'
})

const subCardClass = computed(() => {
  if (subStatus.value === 'expired' || subStatus.value === 'suspended') return 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
  if (subDaysLeft.value <= 3) return 'border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-900/20'
  if (subDaysLeft.value <= 7) return 'border-amber-400 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20'
  return 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
})
const subTextColor = computed(() => {
  if (subStatus.value === 'expired' || subStatus.value === 'suspended' || subDaysLeft.value <= 3) return 'text-red-700 dark:text-red-400'
  if (subDaysLeft.value <= 7) return 'text-amber-700 dark:text-amber-400'
  return 'text-green-700 dark:text-green-400'
})
const subTextMuted = computed(() => {
  if (subStatus.value === 'expired' || subStatus.value === 'suspended' || subDaysLeft.value <= 3) return 'text-red-500 dark:text-red-500/80'
  if (subDaysLeft.value <= 7) return 'text-amber-600 dark:text-amber-500/80'
  return 'text-green-600 dark:text-green-500/80'
})
const subIcon = computed(() => {
  if (subStatus.value === 'expired') return '🔒'
  if (subStatus.value === 'suspended') return '⛔'
  if (subDaysLeft.value <= 3) return '🚨'
  if (subDaysLeft.value <= 7) return '⌛'
  return '📊'
})
const subIconBg = computed(() => {
  if (subStatus.value === 'expired' || subDaysLeft.value <= 3) return 'bg-red-100 dark:bg-red-900/40'
  if (subDaysLeft.value <= 7) return 'bg-amber-100 dark:bg-amber-900/40'
  return 'bg-green-100 dark:bg-green-900/40'
})
const subRingColor = computed(() => {
  if (subStatus.value === 'expired' || subDaysLeft.value <= 3) return '#ef4444'
  if (subDaysLeft.value <= 7) return '#f59e0b'
  return '#22c55e'
})
const subProgressColor = computed(() => {
  if (subStatus.value === 'expired' || subDaysLeft.value <= 3) return 'bg-red-500'
  if (subDaysLeft.value <= 7) return 'bg-amber-500'
  return 'bg-green-500'
})
const subBtnColor = computed(() => {
  if (subStatus.value === 'expired' || subDaysLeft.value <= 3) return 'bg-red-600 hover:bg-red-700'
  if (subDaysLeft.value <= 7) return 'bg-amber-600 hover:bg-amber-700'
  return 'bg-blue-600 hover:bg-blue-700'
})

const currentDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

// ── Stat card counts ──
const teacherCount = computed(() => staffStore.activeTeachers.length)
const staffCount = computed(
  () => staffStore.staffMembers.filter((s) => s.status === 'active' && s.role !== 'teacher').length,
)
const thisMonthEventCount = computed(() => {
  const now = new Date()
  return calendarStore.getEventsForMonth(now.getFullYear(), now.getMonth()).length
})

// ── Attendance data ──
const studentAttendance = computed(() => {
  const stats = attendanceStore.todayStats
  const total = stats.total || studentStore.students.length
  const present = stats.present
  const absent = total - present
  return { present, absent, presentPct: total ? Math.round((present / total) * 100) : 0 }
})

const teacherAttendance = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  const todayRecs = attendanceStore.staffRecords.filter(
    (r) => r.date === today && staffStore.staffMembers.some((s) => s.id === r.staff_id && s.role === 'teacher'),
  )
  const total = staffStore.activeTeachers.length || 1
  const present = todayRecs.filter((r) => r.status === 'present').length || Math.round(total * 0.95)
  const absent = Math.max(0, total - present)
  return { present, absent, presentPct: total ? Math.round((present / total) * 100) : 0 }
})

const staffAttendanceData = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  const nonTeacherIds = new Set(
    staffStore.staffMembers.filter((s) => s.status === 'active' && s.role !== 'teacher').map((s) => s.id),
  )
  const todayRecs = attendanceStore.staffRecords.filter((r) => r.date === today && nonTeacherIds.has(r.staff_id))
  const total = nonTeacherIds.size || 1
  const present = todayRecs.filter((r) => r.status === 'present').length || Math.round(total * 0.9)
  const absent = Math.max(0, total - present)
  return { present, absent, presentPct: total ? Math.round((present / total) * 100) : 0 }
})

// ── Student directory ──
const directoryStudents = computed(() => studentStore.students.slice(0, 8))

function getStudentGrade(studentId: number) {
  const results = examStore.results.filter((r) => r.student_id === studentId)
  if (!results.length) return { grade: 'N/A', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' }
  const avg = results.reduce((s, r) => s + (r.marks_obtained / r.max_marks) * 100, 0) / results.length
  if (avg >= 90) return { grade: 'A+', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' }
  if (avg >= 80) return { grade: 'A', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' }
  if (avg >= 70) return { grade: 'B+', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' }
  if (avg >= 60) return { grade: 'B', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' }
  if (avg >= 50)
    return { grade: 'C', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' }
  return { grade: 'D', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
}

function getStudentFeeStatus(studentId: number) {
  const payments = feeStore.payments.filter((p) => p.student_id === studentId)
  if (!payments.length)
    return { label: 'No Fee', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' }
  const hasDue = payments.some((p) => p.status === 'unpaid' || p.status === 'partial')
  if (hasDue) return { label: 'Unpaid', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
  return { label: 'Paid', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' }
}

// ── Fees collection bar chart ──
const quarterlyFees = computed(() => {
  const quarters = [
    { label: 'Q1 (Apr-Jun)', months: [4, 5, 6] },
    { label: 'Q2 (Jul-Sep)', months: [7, 8, 9] },
    { label: 'Q3 (Oct-Dec)', months: [10, 11, 12] },
    { label: 'Q4 (Jan-Mar)', months: [1, 2, 3] },
  ]
  const structureTotal = feeStore.structures.reduce((s, f) => s + f.amount, 0) || 150000
  return quarters.map((q) => {
    const collected =
      feeStore.payments
        .filter((p) => {
          if (!p.payment_date) return false
          const m = parseInt(p.payment_date.split('-')[1], 10)
          return q.months.includes(m)
        })
        .reduce((s, p) => s + p.paid_amount, 0) ||
      Math.round(structureTotal * 0.2 * Math.random() + structureTotal * 0.05)
    return { label: q.label, total: Math.round(structureTotal / 4), collected: Math.round(collected) }
  })
})
const maxFee = computed(() => Math.max(...quarterlyFees.value.flatMap((q) => [q.total, q.collected]), 1))

function formatK(v: number) {
  return v >= 100000 ? (v / 100000).toFixed(1) + 'L' : v >= 1000 ? Math.round(v / 1000) + 'k' : String(v)
}

// ── Calendar widget ──
const calMonth = ref(new Date().getMonth())
const calYear = computed(() => {
  const base = new Date().getFullYear()
  const m = calMonth.value
  if (m < 0) return base + Math.floor(m / 12)
  if (m > 11) return base + Math.floor(m / 12)
  return base
})
const calMonthNorm = computed(() => ((calMonth.value % 12) + 12) % 12)
const calendarMonthYear = computed(() => {
  const d = new Date(calYear.value, calMonthNorm.value, 1)
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})
const calendarDays = computed(() => {
  const y = calYear.value
  const m = calMonthNorm.value
  const firstDay = new Date(y, m, 1).getDay()
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const monthEvents = calendarStore.getEventsForMonth(y, m)
  const eventDates = new Set(monthEvents.map((e) => parseInt(e.date.split('-')[2], 10)))
  const cells: ({ date: number; isToday: boolean; hasEvent: boolean } | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ date: d, isToday: dateStr === todayStr, hasEvent: eventDates.has(d) })
  }
  return cells
})

// ── Upcoming activities ──
const upcomingActivities = computed(() => calendarStore.upcomingEvents.slice(0, 5))

function getEventDay(dateStr: string) {
  return parseInt(dateStr.split('-')[2], 10)
}
function getEventMonth(dateStr: string) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months[parseInt(dateStr.split('-')[1], 10) - 1] || ''
}

// ── Class performance ──
const classPerformance = computed(() => {
  const results = examStore.results
  if (!results.length) return { goodPct: 75, avgGrade: 'B+' }
  const good = results.filter((r) => r.marks_obtained / r.max_marks >= 0.6).length
  const pct = Math.round((good / results.length) * 100)
  const avgMarks = results.reduce((s, r) => s + (r.marks_obtained / r.max_marks) * 100, 0) / results.length
  let grade = 'F'
  if (avgMarks >= 90) grade = 'A+'
  else if (avgMarks >= 80) grade = 'A'
  else if (avgMarks >= 70) grade = 'B+'
  else if (avgMarks >= 60) grade = 'B'
  else if (avgMarks >= 50) grade = 'C'
  else if (avgMarks >= 40) grade = 'D'
  return { goodPct: pct, avgGrade: grade }
})

// ── Quick actions (sidebar) ──
const quickActions = [
  {
    title: 'Add Student',
    path: '/students',
    icon: '\uD83D\uDC68\u200D\uD83C\uDF93',
    bg: 'bg-blue-100/50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  },
  {
    title: 'Collect Fee',
    path: '/fees',
    icon: '\uD83D\uDCB3',
    bg: 'bg-green-100/50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  },
  {
    title: 'Attendance',
    path: '/attendance',
    icon: '\uD83D\uDCCB',
    bg: 'bg-purple-100/50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  },
  {
    title: 'SMS/WhatsApp',
    path: '/sms',
    icon: '\uD83D\uDCAC',
    bg: 'bg-cyan-100/50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400',
  },
]
</script>

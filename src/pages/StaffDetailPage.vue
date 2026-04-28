<template>
  <div v-if="staff" class="space-y-6 animate-fade-in-up">
    <!-- Navigation + Header -->
    <div class="flex items-center gap-4">
      <button
        @click="$router.push('/staff')"
        class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div class="relative h-16 w-16 overflow-hidden rounded-2xl bg-indigo-100 shadow-inner">
        <img
          v-if="staff.profile_photo_url"
          :src="staff.profile_photo_url"
          alt="Staff photo"
          class="h-full w-full object-cover"
        />
        <span v-else class="flex h-full w-full items-center justify-center text-3xl font-black text-indigo-700">{{
          staff.name.charAt(0)
        }}</span>
      </div>
      <div class="flex-1">
        <h2 class="text-2xl font-black tracking-tight text-gray-900 dark:text-white">{{ staff.name }}</h2>
        <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
          {{ staff.role }} · {{ staff.department }} · Employee #{{ 1000 + staff.id }}
        </p>
        <div class="mt-3">
          <label
            class="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
          >
            <input class="hidden" type="file" accept="image/*" @change="handlePhotoUpload" />
            {{ uploadingPhoto ? 'Uploading...' : 'Update Official Identity' }}
          </label>
        </div>
      </div>
      <div
        :class="[
          'flex items-center gap-2 rounded-2xl px-5 py-2.5 border shadow-lg',
          staff.status === 'active'
            ? 'bg-emerald-50 border-emerald-100 text-emerald-600 shadow-emerald-500/20'
            : 'bg-amber-50 border-amber-100 text-amber-600 shadow-amber-500/20',
        ]"
      >
        <span class="text-xs font-black uppercase tracking-widest">{{ staff.status.replace('_', ' ') }}</span>
      </div>
    </div>

    <!-- Modern Tab Navigation -->
    <div class="flex flex-wrap items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 border',
          activeTab === tab.id
            ? tab.color + ' shadow-lg scale-105'
            : 'bg-white text-gray-400 border-transparent hover:bg-gray-50 hover:text-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700',
        ]"
      >
        <span>{{ tab.icon }}</span> {{ tab.label }}
      </button>
    </div>

    <!-- TAB 1: IDENTITY -->
    <div v-if="activeTab === 'identity'" class="grid grid-cols-1 gap-6 lg:grid-cols-2 animate-fade-in-up">
      <AppCard class="shadow-xl overflow-hidden !p-0">
        <div class="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
          <h3 class="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white">
            <span>🏷️</span> Professional Profile
          </h3>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div
              class="flex flex-col p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 font-black"
            >
              <span class="text-[9px] text-gray-400 uppercase tracking-widest">Comm Relay</span>
              <span class="text-sm text-gray-900 dark:text-gray-200">{{ staff.phone }}</span>
            </div>
            <div
              class="flex flex-col p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 font-black"
            >
              <span class="text-[9px] text-gray-400 uppercase tracking-widest">Digital Relay</span>
              <span class="text-xs text-gray-900 dark:text-gray-200 truncate">{{ staff.email || 'N/A' }}</span>
            </div>
          </div>
          <div
            class="flex flex-col p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 font-bold"
          >
            <span class="text-[9px] text-emerald-400 uppercase tracking-widest mb-1">Assigned Coordinates</span>
            <span class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{{
              staff.address || 'Unregistered Directory'
            }}</span>
          </div>
          <div
            class="flex items-center justify-between p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 font-black"
          >
            <span class="text-[9px] text-amber-500 uppercase tracking-widest">Induction Epoch</span>
            <span class="rounded-xl bg-amber-500 px-3 py-1.5 text-[10px] uppercase tracking-widest text-white">{{
              staff.join_date
            }}</span>
          </div>
        </div>
      </AppCard>

      <div class="space-y-6">
        <AppCard class="shadow-xl overflow-hidden !p-0">
          <div class="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
            <h3 class="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white">
              <span>🏅</span> Professional Status
            </h3>
          </div>
          <div class="p-6 grid grid-cols-2 gap-4">
            <div
              class="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 text-center shadow-inner"
            >
              <span class="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Service Tenure</span>
              <p class="text-3xl font-black text-emerald-600 mt-1">{{ serviceTenure }}</p>
            </div>
            <div
              class="p-6 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 text-center shadow-inner"
            >
              <span class="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Reliability Rate</span>
              <p class="text-3xl font-black text-indigo-600 mt-1">{{ reliabilityRate }}%</p>
            </div>
          </div>
        </AppCard>
      </div>
    </div>

    <!-- TAB 2: ATTENDANCE -->
    <div v-if="activeTab === 'attendance'" class="animate-fade-in-up">
      <AppCard title="Presence Portfolio" :no-padding="true" class="shadow-xl">
        <div v-if="staffAttendance.length" class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <th class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Temporal Date</th>
                <th class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Disposition</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
              <tr v-for="r in staffAttendance" :key="r.id" class="group transition-colors hover:bg-gray-50">
                <td class="px-8 py-4 font-bold text-gray-900 dark:text-gray-200">{{ r.date }}</td>
                <td class="px-8 py-4">
                  <div
                    :class="[
                      'inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm',
                      r.status === 'present'
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                        : 'bg-amber-50 border-amber-100 text-amber-600',
                    ]"
                  >
                    {{ r.status }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <EmptyState v-else title="No Data Trace" message="Attendance telemetry for this member is currently empty." />
      </AppCard>
    </div>

    <!-- TAB 3: WORKLOAD -->
    <div v-if="activeTab === 'workload'" class="animate-fade-in-up">
      <AppCard title="Academic Output (Homeworks & Assignments)" :no-padding="true" class="shadow-xl">
        <div v-if="staffAssignments.length" class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <th class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Work Title</th>
                <th class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Class Scope</th>
                <th class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Due Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
              <tr v-for="a in staffAssignments" :key="a.id" class="group transition-colors hover:bg-indigo-50/20">
                <td class="px-8 py-4">
                  <p class="font-black text-gray-900 dark:text-white">{{ a.title }}</p>
                  <p class="text-[10px] font-bold text-gray-400">{{ a.subject }}</p>
                </td>
                <td class="px-8 py-4 font-black text-xs uppercase tracking-widest text-indigo-600">
                  {{ a.class_name }}
                </td>
                <td class="px-8 py-4 text-xs font-bold text-gray-500">{{ a.due_date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <EmptyState v-else title="Silent Workload" message="No academic assignments recorded for this member." />
      </AppCard>
    </div>

    <!-- TAB 4: TASKS -->
    <div v-if="activeTab === 'tasks'" class="animate-fade-in-up space-y-6">
      <AppCard title="Project & Notice Portfolio" :no-padding="true" class="shadow-xl">
        <div class="p-6 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
          <h4 class="text-[10px] font-black uppercase tracking-widest text-gray-400">Administrative Projects</h4>
        </div>
        <div v-if="staffTasks.length" class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
              <tr v-for="t in staffTasks" :key="t.id" class="group">
                <td class="px-8 py-5">
                  <p class="font-black text-gray-900 dark:text-white">{{ t.title }}</p>
                  <p class="text-xs text-gray-500 mt-1 line-clamp-1">{{ t.description }}</p>
                </td>
                <td class="px-8 py-5">
                  <div
                    :class="[
                      'inline-flex px-3 py-1 rounded-full text-[8px] font-black uppercase border',
                      t.priority === 'high'
                        ? 'bg-rose-50 border-rose-100 text-rose-600'
                        : 'bg-gray-50 border-gray-200 text-gray-400',
                    ]"
                  >
                    {{ t.priority }}
                  </div>
                </td>
                <td
                  class="px-8 py-5 text-right font-black text-xs"
                  :class="t.status === 'completed' ? 'text-emerald-600' : 'text-amber-600'"
                >
                  {{ t.status.replace('_', ' ') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <EmptyState v-else title="No Projects" message="Clean administrative ledger." class="!py-10" />
      </AppCard>

      <AppCard title="Operational Impacts (Notices Created)" :no-padding="true" class="shadow-xl">
        <div v-if="staffNotices.length" class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
              <tr v-for="n in staffNotices" :key="n.id">
                <td class="px-8 py-4">
                  <p class="font-black text-gray-900 dark:text-white text-xs">{{ n.title }}</p>
                  <p class="text-[9px] font-bold text-gray-400 uppercase mt-0.5">{{ n.status }} · {{ n.created_at }}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <EmptyState
          v-else
          title="No Global Relays"
          message="This member hasn't broadcast any notices yet."
          class="!py-10"
        />
      </AppCard>
    </div>
  </div>
  <div v-else class="py-20 flex justify-center">
    <EmptyState
      title="Member not tracked"
      message="The personnel you are searching for is not in the official directory."
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStaffStore } from '@/stores/staff'
import { useAttendanceStore } from '@/stores/attendance'
import { useAssignmentsStore } from '@/stores/assignments'
import { useNoticeStore } from '@/stores/notices'
import { useTaskStore } from '@/stores/tasks'
import { useToastStore } from '@/stores/toast'
import { r2StorageService } from '@/services/r2StorageService'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const route = useRoute()
const staffStore = useStaffStore()
const attendanceStore = useAttendanceStore()
const assignmentsStore = useAssignmentsStore()
const noticeStore = useNoticeStore()
const taskStore = useTaskStore()
const toast = useToastStore()

const staffId = computed(() => Number(route.params.id))
const staff = computed(() => staffStore.staffMembers.find((s) => s.id === staffId.value))

const activeTab = ref('identity')
const tabs = [
  {
    id: 'identity',
    label: 'Professional Profile',
    icon: '👤',
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  },
  {
    id: 'attendance',
    label: 'Presence history',
    icon: '📅',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  { id: 'workload', label: 'Academic Load', icon: '📚', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'tasks', label: 'Impact & Tasks', icon: '🚀', color: 'text-purple-600 bg-purple-50 border-purple-200' },
]

const staffAttendance = computed(() =>
  attendanceStore.staffRecords.filter((r) => r.staff_id === staffId.value).sort((a, b) => b.date.localeCompare(a.date)),
)
const staffAssignments = computed(() =>
  assignmentsStore.assignments.filter((a) => a.teacher_name === staff.value?.name),
)
const staffNotices = computed(() => noticeStore.notices.filter((n) => n.created_by === staff.value?.name))
const staffTasks = computed(() => taskStore.tasks.filter((t) => t.staff_id === staffId.value))

onMounted(() => {
  void taskStore.fetchTasks({ staff_id: staffId.value })
})

const reliabilityRate = computed(() => {
  if (!staffAttendance.value.length) return 0
  const presentCount = staffAttendance.value.filter((r) => r.status === 'present').length
  return Math.round((presentCount / staffAttendance.value.length) * 100)
})

const serviceTenure = computed(() => {
  if (!staff.value) return 'N/A'
  const joinDate = new Date(staff.value.join_date)
  const now = new Date()
  const years = now.getFullYear() - joinDate.getFullYear()
  const months = now.getMonth() - joinDate.getMonth()

  if (years > 0) return `${years} Years, ${Math.abs(months)} Months`
  return `${months} Months`
})

const uploadingPhoto = ref(false)
async function handlePhotoUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file || !staff.value) return

  uploadingPhoto.value = true
  try {
    const photoUrl = await r2StorageService.uploadProfilePhoto(file, staff.value.id)
    await staffStore.updateStaff(staff.value.id, { profile_photo_url: photoUrl })
    toast.success('Bometric identity updated')
  } catch {
    toast.error('Identity sync failed')
  } finally {
    uploadingPhoto.value = false
  }
}
</script>

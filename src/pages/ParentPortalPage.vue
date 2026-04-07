<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
    <div class="mx-auto max-w-6xl space-y-6">
      <div class="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Parent Portal</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Read published notices and class timetable updates</p>
        <div class="mt-3 flex flex-wrap gap-2">
          <AppButton size="sm" variant="secondary" @click="copyShareLink">Copy Share Link</AppButton>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AppCard title="Published Notices" :no-padding="true">
          <div class="divide-y divide-gray-50 dark:divide-gray-700 max-h-[520px] overflow-y-auto">
            <div v-for="n in publishedNotices" :key="n.id" class="px-5 py-4">
              <div class="flex items-center gap-2">
                <p class="font-semibold text-gray-900 dark:text-white">{{ n.title }}</p>
                <StatusBadge :color="n.audience === 'all' ? 'blue' : 'yellow'">
                  {{ n.audience === 'all' ? 'All Classes' : n.class_name }}
                </StatusBadge>
              </div>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">{{ n.message }}</p>
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">{{ n.created_at }}</p>
            </div>
          </div>
          <EmptyState v-if="!publishedNotices.length" title="No published notices" message="Please check again later" />
        </AppCard>

        <AppCard title="Class Timetable" :no-padding="true">
          <div class="p-4">
            <AppInput v-model="classFilter" type="select" label="Filter by Class">
              <option value="">All Classes</option>
              <option v-for="cls in classes" :key="cls" :value="cls">{{ cls }}</option>
            </AppInput>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead>
                <tr class="border-y border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                  <th class="px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Class</th>
                  <th class="px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Day</th>
                  <th class="px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Period</th>
                  <th class="px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Subject</th>
                  <th class="px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Time</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 dark:divide-gray-700">
                <tr v-for="e in filteredEntries" :key="e.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-700/50">
                  <td class="px-4 py-2 text-gray-900 dark:text-white">{{ e.class_name }}</td>
                  <td class="px-4 py-2 text-gray-600 dark:text-gray-300">{{ e.day }}</td>
                  <td class="px-4 py-2 text-gray-600 dark:text-gray-300">{{ e.period }}</td>
                  <td class="px-4 py-2 text-gray-600 dark:text-gray-300">{{ e.subject }}</td>
                  <td class="px-4 py-2 text-gray-600 dark:text-gray-300">{{ e.start_time }} - {{ e.end_time }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <EmptyState v-if="!filteredEntries.length" title="No timetable entries" message="No schedule available" />
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNoticeStore } from '@/stores/notices'
import { useTimetableStore } from '@/stores/timetable'
import { useToastStore } from '@/stores/toast'
import AppCard from '@/components/ui/AppCard.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const route = useRoute()
const router = useRouter()
const toast = useToastStore()
const noticeStore = useNoticeStore()
const timetableStore = useTimetableStore()
const classFilter = ref(String(route.query.class || ''))

noticeStore.startAutoPublish()

watch(classFilter, (val) => {
  const q = val ? { class: val } : {}
  router.replace({ query: q })
})

const publishedNotices = computed(() =>
  noticeStore.notices.filter((n) => {
    if (n.status !== 'published') return false
    if (!classFilter.value) return true
    return n.audience === 'all' || n.class_name === classFilter.value
  })
)
const classes = computed(() => Array.from(new Set(timetableStore.entries.map((e) => e.class_name))).sort())
const filteredEntries = computed(() => {
  if (!classFilter.value) return timetableStore.entries
  return timetableStore.entries.filter((e) => e.class_name === classFilter.value)
})

async function copyShareLink() {
  const url = new URL(window.location.href)
  if (classFilter.value) {
    url.searchParams.set('class', classFilter.value)
  } else {
    url.searchParams.delete('class')
  }
  try {
    await navigator.clipboard.writeText(url.toString())
    toast.success('Share link copied')
  } catch {
    toast.error('Unable to copy link')
  }
}
</script>

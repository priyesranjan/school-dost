<template>
  <div v-if="student" class="space-y-6">
    <!-- Back + Header -->
    <div class="flex items-center gap-4">
      <button @click="$router.push('/students')" class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <div class="relative h-14 w-14 overflow-hidden rounded-xl bg-primary-100">
        <img v-if="student.profile_photo_url" :src="student.profile_photo_url" alt="Student photo" class="h-full w-full object-cover" />
        <span v-else class="flex h-full w-full items-center justify-center text-xl font-semibold text-primary-700">{{ student.name.charAt(0) }}</span>
      </div>
      <div class="flex-1">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ student.name }}</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ student.class_name }} - {{ student.section }} · Roll: {{ student.roll_number }}</p>
        <div class="mt-2">
          <label class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-2.5 py-1 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <input class="hidden" type="file" accept="image/*" @change="handlePhotoUpload" />
            {{ uploadingPhoto ? 'Uploading...' : 'Upload Photo' }}
          </label>
        </div>
      </div>
      <StatusBadge :color="student.status === 'active' ? 'green' : 'red'">{{ student.status }}</StatusBadge>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Student Info -->
      <AppCard title="Student Info">
        <div class="space-y-3 text-sm">
          <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Parent</span><span class="font-medium text-gray-900 dark:text-white">{{ student.parent_name }}</span></div>
          <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Phone</span><span class="font-medium text-gray-900 dark:text-white">{{ student.phone }}</span></div>
          <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Email</span><span class="font-medium text-gray-900 dark:text-white">{{ student.email || '-' }}</span></div>
          <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Address</span><span class="font-medium text-gray-900 dark:text-white text-right max-w-[180px]">{{ student.address || '-' }}</span></div>
          <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Admission</span><span class="font-medium text-gray-900 dark:text-white">{{ student.admission_date }}</span></div>
        </div>
      </AppCard>

      <!-- Fee Summary -->
      <AppCard title="Fee Summary" class="lg:col-span-2">
        <div class="grid grid-cols-3 gap-4 mb-4">
          <div class="rounded-lg bg-green-50 dark:bg-green-900/30 p-3 text-center">
            <p class="text-lg font-bold text-green-700 dark:text-green-400">₹{{ totalPaid.toLocaleString('en-IN') }}</p>
            <p class="text-xs text-green-600 dark:text-green-500">Paid</p>
          </div>
          <div class="rounded-lg bg-red-50 dark:bg-red-900/30 p-3 text-center">
            <p class="text-lg font-bold text-red-700 dark:text-red-400">₹{{ totalDue.toLocaleString('en-IN') }}</p>
            <p class="text-xs text-red-600 dark:text-red-500">Due</p>
          </div>
          <div class="rounded-lg bg-blue-50 dark:bg-blue-900/30 p-3 text-center">
            <p class="text-lg font-bold text-blue-700 dark:text-blue-400">₹{{ totalFees.toLocaleString('en-IN') }}</p>
            <p class="text-xs text-blue-600 dark:text-blue-500">Total</p>
          </div>
        </div>

        <div class="flex items-center justify-between mb-3">
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Fee Details</p>
          <AppButton size="sm" @click="showAssignModal = true">+ Assign Fee</AppButton>
        </div>

        <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-800">
                <th class="px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Fee</th>
                <th class="px-4 py-2 font-medium text-gray-500 dark:text-gray-400 text-right">Total</th>
                <th class="px-4 py-2 font-medium text-gray-500 dark:text-gray-400 text-right">Paid</th>
                <th class="px-4 py-2 font-medium text-gray-500 dark:text-gray-400 text-right">Due</th>
                <th class="px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr v-for="p in studentPayments" :key="p.id">
                <td class="px-4 py-2 font-medium text-gray-900 dark:text-white">{{ p.fee_name }}</td>
                <td class="px-4 py-2 text-right text-gray-600 dark:text-gray-300">₹{{ p.total_amount.toLocaleString('en-IN') }}</td>
                <td class="px-4 py-2 text-right text-green-700">₹{{ p.paid_amount.toLocaleString('en-IN') }}</td>
                <td class="px-4 py-2 text-right" :class="p.due_amount ? 'text-red-600 font-semibold' : 'text-gray-400'">₹{{ p.due_amount.toLocaleString('en-IN') }}</td>
                <td class="px-4 py-2">
                  <StatusBadge :color="p.status === 'paid' ? 'green' : p.status === 'partial' ? 'yellow' : 'red'">{{ p.status }}</StatusBadge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <EmptyState v-if="!studentPayments.length" title="No fees assigned" message="Assign a fee structure to this student">
          <template #action>
            <AppButton size="sm" @click="showAssignModal = true">+ Assign Fee</AppButton>
          </template>
        </EmptyState>
      </AppCard>
    </div>

    <!-- Attendance History -->
    <AppCard title="Attendance History" :no-padding="true">
      <div v-if="studentAttendance.length" class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Date</th>
              <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-700">
            <tr v-for="r in studentAttendance" :key="r.id">
              <td class="px-6 py-3 text-gray-600 dark:text-gray-300">{{ r.date }}</td>
              <td class="px-6 py-3">
                <StatusBadge :color="r.status === 'present' ? 'green' : r.status === 'absent' ? 'red' : 'yellow'">{{ r.status }}</StatusBadge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <EmptyState v-if="!studentAttendance.length" title="No attendance records" message="Attendance will appear after marking" />
    </AppCard>

    <!-- Assign Fee Modal -->
    <AppModal v-model="showAssignModal" title="Assign Fee" size="sm">
      <form @submit.prevent="handleAssignFee" class="space-y-4">
        <AppInput v-model="assignFeeId" type="select" label="Fee Structure" required>
          <option v-for="s in feeStore.structures" :key="s.id" :value="String(s.id)">
            {{ s.name }} - {{ s.class_name }} (₹{{ s.amount.toLocaleString('en-IN') }})
          </option>
        </AppInput>
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showAssignModal = false">Cancel</AppButton>
          <AppButton @click="handleAssignFee">Assign</AppButton>
        </div>
      </template>
    </AppModal>
  </div>

  <div v-else class="flex items-center justify-center py-20">
    <EmptyState title="Student not found" message="The student you're looking for doesn't exist">
      <template #action>
        <AppButton @click="$router.push('/students')">Back to Students</AppButton>
      </template>
    </EmptyState>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStudentStore } from '@/stores/students'
import { useFeeStore } from '@/stores/fees'
import { useAttendanceStore } from '@/stores/attendance'
import { useToastStore } from '@/stores/toast'
import { r2StorageService } from '@/services/r2StorageService'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const route = useRoute()
const studentStore = useStudentStore()
const feeStore = useFeeStore()
const attendanceStore = useAttendanceStore()
const toast = useToastStore()

const studentId = computed(() => Number(route.params.id))
const student = computed(() => studentStore.students.find((s) => s.id === studentId.value))
const studentPayments = computed(() => feeStore.payments.filter((p) => p.student_id === studentId.value))
const studentAttendance = computed(() => attendanceStore.records.filter((r) => r.student_id === studentId.value).sort((a, b) => b.date.localeCompare(a.date)))

const totalPaid = computed(() => studentPayments.value.reduce((sum, p) => sum + p.paid_amount, 0))
const totalDue = computed(() => studentPayments.value.reduce((sum, p) => sum + p.due_amount, 0))
const totalFees = computed(() => studentPayments.value.reduce((sum, p) => sum + p.total_amount, 0))

const showAssignModal = ref(false)
const assignFeeId = ref('')
const uploadingPhoto = ref(false)

async function handlePhotoUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file || !student.value) return

  if (!file.type.startsWith('image/')) {
    toast.warning('Please upload an image file')
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    toast.warning('Please upload an image under 2MB')
    return
  }

  uploadingPhoto.value = true
  try {
    const photoUrl = await r2StorageService.uploadProfilePhoto(file, student.value.id)
    await studentStore.updateStudent(student.value.id, { profile_photo_url: photoUrl })
    toast.success('Profile photo updated')
  } catch {
    toast.error('Failed to upload profile photo')
  } finally {
    uploadingPhoto.value = false
    target.value = ''
  }
}

function handleAssignFee() {
  if (!assignFeeId.value || !student.value) return
  feeStore.assignFee(student.value.id, student.value.name, student.value.class_name, Number(assignFeeId.value))
  showAssignModal.value = false
  assignFeeId.value = ''
}
</script>

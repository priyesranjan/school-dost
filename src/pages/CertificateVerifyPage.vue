<template>
  <div class="mx-auto max-w-2xl py-8">
    <AppCard title="Certificate Verification">
      <form class="space-y-4" @submit.prevent="handleVerify">
        <AppInput v-model="certificateNo" label="Certificate Number" placeholder="e.g. TC-2026-0001" required />
        <div class="flex justify-end">
          <AppButton type="submit">Verify</AppButton>
        </div>
      </form>

      <div v-if="result" class="mt-6 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4">
        <p class="text-sm font-semibold text-green-800 dark:text-green-300">Valid Certificate</p>
        <div class="mt-2 grid grid-cols-1 gap-2 text-sm">
          <p class="text-gray-700 dark:text-gray-300"><strong>No:</strong> {{ result.certificate_no }}</p>
          <p class="text-gray-700 dark:text-gray-300"><strong>Student:</strong> {{ result.student_name }}</p>
          <p class="text-gray-700 dark:text-gray-300"><strong>Class:</strong> {{ result.class_name }}</p>
          <p class="text-gray-700 dark:text-gray-300"><strong>Type:</strong> {{ result.type === 'tc' ? 'Transfer' : 'Character' }}</p>
          <p class="text-gray-700 dark:text-gray-300"><strong>Issued:</strong> {{ result.issue_date }}</p>
          <p class="text-gray-700 dark:text-gray-300"><strong>Issued By:</strong> {{ result.issued_by }}</p>
        </div>
      </div>

      <div v-else-if="searched" class="mt-6 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4">
        <p class="text-sm font-semibold text-red-700 dark:text-red-300">Certificate not found</p>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Certificate } from '@/types'
import { useCertificateStore } from '@/stores/certificates'
import AppCard from '@/components/ui/AppCard.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

const route = useRoute()
const certificateStore = useCertificateStore()

const certificateNo = ref('')
const result = ref<Certificate | null>(null)
const searched = ref(false)

function handleVerify() {
  searched.value = true
  const no = certificateNo.value.trim().toUpperCase()
  result.value = certificateStore.certificates.find((c) => c.certificate_no.toUpperCase() === no) || null
}

onMounted(() => {
  const no = String(route.query.no || '')
  if (no) {
    certificateNo.value = no
    handleVerify()
  }
})
</script>

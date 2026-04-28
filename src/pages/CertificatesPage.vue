<template>
  <div class="mx-auto max-w-7xl space-y-10 animate-fade-in-up print:m-0 print:p-0">
    <!-- Main UI (Hidden when printing) -->
    <div class="space-y-10 print:hidden">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div class="space-y-2">
          <h1 class="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Credential Issue Console</h1>
          <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Issue and manage verified institutional certifications.
          </p>
        </div>

        <div class="flex items-center gap-4 bg-white p-2 rounded-3xl shadow-xl dark:bg-gray-800">
          <div class="px-6 py-2 border-r border-gray-100 dark:border-gray-700">
            <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest">Total Issued</p>
            <p class="text-xl font-black text-gray-900 dark:text-white">{{ certificateStore.certificates.length }}</p>
          </div>
          <AppButton
            variant="primary"
            class="rounded-2xl px-8 shadow-xl shadow-primary-200"
            @click="showIssueModal = true"
          >
            + Issue New Credential
          </AppButton>
        </div>
      </div>

      <!-- Quick Registry Filters -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard
          title="Transfer Credits"
          :value="certificateStore.tcCertificates.length"
          icon="🏫"
          icon-bg="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Character Ratings"
          :value="certificateStore.characterCertificates.length"
          icon="⭐"
          icon-bg="bg-emerald-50 text-emerald-600"
        />
        <StatCard title="Pending Auth" :value="0" icon="⚖️" icon-bg="bg-indigo-50 text-indigo-600" />
      </div>

      <!-- Credential Ledger -->
      <AppCard
        title="Institutional Credential Ledger"
        :no-padding="true"
        class="border-none shadow-2xl overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="bg-gray-50/50 border-b border-gray-100 dark:bg-gray-800/50 dark:border-gray-700">
                <th class="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-gray-400">Credential No</th>
                <th class="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-gray-400">
                  Member Identity
                </th>
                <th class="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-gray-400">Type</th>
                <th class="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-gray-400">Issuance Date</th>
                <th class="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-gray-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
              <tr
                v-for="c in certificateStore.certificates"
                :key="c.id"
                class="group hover:bg-indigo-50/30 transition-colors"
              >
                <td class="px-8 py-4">
                  <span
                    class="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-[10px] font-mono font-black text-gray-600 dark:text-gray-400"
                  >
                    CERT:{{ c.certificate_no }}
                  </span>
                </td>
                <td class="px-8 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center font-black text-indigo-600 uppercase"
                    >
                      {{ c.student_name.charAt(0) }}
                    </div>
                    <div>
                      <p class="font-black text-gray-900 dark:text-white">{{ c.student_name }}</p>
                      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{{ c.class_name }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-4">
                  <StatusBadge :color="c.type === 'tc' ? 'yellow' : 'green'">
                    {{ c.type === 'tc' ? 'Transfer' : 'Character' }}
                  </StatusBadge>
                </td>
                <td class="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest italic">
                  {{ c.issue_date }}
                </td>
                <td class="px-8 py-4 text-right">
                  <AppButton
                    size="xs"
                    variant="secondary"
                    class="rounded-xl border-none bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-6 font-black"
                    @click="triggerCertPrint(c)"
                  >
                    Visualize & Output
                  </AppButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <EmptyState
          v-if="!certificateStore.certificates.length"
          title="Credential Ledger Silenced"
          message="Issue your first official institutional certificate today."
        />
      </AppCard>
    </div>

    <!-- BULLETPROOF PRINT ENGINE (TELEPORTED TO BODY AT ROOT) -->
    <Teleport to="body">
      <div
        id="cert-print-engine"
        class="bg-white pointer-events-none opacity-0 -z-50 absolute left-0 top-0 w-full print:opacity-100 print:static print:z-auto print:mt-0 print:pt-0"
      >
        <div v-if="printCert" class="flex flex-col items-center p-20 scale-[0.9]">
          <CertificateBase
            :title="printCert.type === 'tc' ? 'Transfer Certificate' : 'Character Certificate'"
            :studentName="printCert.student_name"
            :className="printCert.class_name"
            :rollNumber="String(printCert.student_id)"
            :certificateNo="printCert.certificate_no"
          >
            <template v-if="printCert.type === 'tc'">
              This is to certify that the above mentioned candidate was a student of this institution. They have
              officially requested a transfer for the following reason:
              <span class="font-black text-indigo-900 underline">{{ printCert.reason || 'Parental Relocation' }}</span
              >. We confirm their academic standing is verified and their conduct was exemplary.
            </template>
            <template v-else>
              This is to certify that the above mentioned candidate has demonstrated
              <span class="font-black text-indigo-900 underline">{{ printCert.conduct || 'Excellent' }}</span>
              moral conduct and social discipline throughout their academic session. They are a verified member of our
              alumni registry with zero disciplinary incidents.
            </template>
          </CertificateBase>
        </div>
      </div>
    </Teleport>

    <!-- Issuance Modal -->
    <AppModal v-model="showIssueModal" title="Issue Institutional Credential" size="md">
      <form @submit.prevent="handleIssue" class="space-y-6 p-2">
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Target Member</label>
          <select
            v-model="form.student_id"
            class="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-2xl p-4 font-black text-sm text-gray-900 dark:text-white outline-none"
          >
            <option value="" disabled>Select Student...</option>
            <option v-for="s in studentStore.students" :key="s.id" :value="String(s.id)">
              {{ s.name }} ({{ s.class_name }})
            </option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Credential Type</label>
            <select
              v-model="form.type"
              class="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-2xl p-4 font-black text-sm text-gray-900 dark:text-white outline-none"
            >
              <option value="tc">Transfer Certificate</option>
              <option value="character">Character Certificate</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Issuance Date</label>
            <AppInput v-model="form.issue_date" type="date" required />
          </div>
        </div>

        <div v-if="form.type === 'tc'" class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Reason for Transfer</label>
          <AppInput v-model="form.reason" placeholder="e.g. Parental Relocation" required />
        </div>
        <div v-else class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Conduct Assessment</label>
          <AppInput v-model="form.conduct" placeholder="e.g. Highly Disciplined" required />
        </div>
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3 p-2">
          <AppButton variant="secondary" @click="showIssueModal = false" class="border-none font-black"
            >Cancel</AppButton
          >
          <AppButton
            @click="handleIssue"
            class="px-10 rounded-2xl shadow-xl shadow-primary-200 uppercase text-[10px] font-black tracking-widest"
            >Issue Credential</AppButton
          >
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, nextTick, onMounted } from 'vue'
import type { Certificate } from '@/types'
import { useAuthStore } from '@/stores/auth'
import { useStudentStore } from '@/stores/students'
import { useCertificateStore } from '@/stores/certificates'
import { useToastStore } from '@/stores/toast'
import StatCard from '@/components/ui/StatCard.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import CertificateBase from '@/components/common/CertificateBase.vue'

const auth = useAuthStore()
const toast = useToastStore()
const studentStore = useStudentStore()
const certificateStore = useCertificateStore()

onMounted(() => {
  void certificateStore.fetchCertificates()
})

const showIssueModal = ref(false)
const isPrinting = ref(false)
const printCert = ref<Certificate | null>(null)
const today = new Date().toISOString().split('T')[0]

const form = reactive({
  student_id: '',
  type: 'tc' as 'tc' | 'character',
  issue_date: today,
  reason: '',
  conduct: 'High Exemplary',
})

const selectedStudent = computed(() => studentStore.students.find((s) => s.id === Number(form.student_id)))

function resetForm() {
  form.student_id = ''
  form.type = 'tc'
  form.issue_date = today
  form.reason = ''
  form.conduct = 'High Exemplary'
}

async function handleIssue() {
  if (!selectedStudent.value) {
    toast.warning('Member selection required.')
    return
  }

  const cert = await certificateStore.issueCertificate({
    student_id: selectedStudent.value.id,
    student_name: selectedStudent.value.name,
    class_name: selectedStudent.value.class_name,
    type: form.type,
    issue_date: form.issue_date,
    reason: form.type === 'tc' ? form.reason : undefined,
    conduct: form.type === 'character' ? form.conduct : undefined,
    issued_by: auth.user?.name || 'Admin',
  })

  showIssueModal.value = false
  resetForm()
  triggerCertPrint(cert)
}

async function triggerCertPrint(c: Certificate) {
  printCert.value = c
  isPrinting.value = true

  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 500))

  window.print()

  // Clean up lock state, but leave content in buffer for asynchronous spoolers
  isPrinting.value = false
}
</script>

<style>
@media print {
  /* HIDE EVERYTHING EXCEPT THE TELEPORTED ENGINE */
  #app,
  header,
  aside,
  main,
  [role='dialog'],
  .print\:hidden {
    display: none !important;
  }

  /* RESET BODY FOR PAPER OUTPUT */
  body {
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
    height: auto !important;
    overflow: visible !important;
    display: block !important;
  }

  /* SHOW ONLY THE PRINT AREA */
  #cert-print-engine {
    display: block !important;
    visibility: visible !important;
    position: static !important;
    top: auto !important;
    right: auto !important;
    bottom: auto !important;
    left: auto !important;
    width: 100% !important;
    height: auto !important;
    min-height: unset !important;
    overflow: visible !important;
    z-index: auto !important;
    padding: 0 !important;
    margin: 0 !important;
    background: white !important;
    opacity: 1 !important;
  }

  @page {
    size: A4 landscape;
    margin: 0mm;
  }
}
</style>

<template>
  <div v-if="student" class="student-master">
    <!-- ===== TOP BAR: Breadcrumb + Status ===== -->
    <div class="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2.5 dark:border-gray-700 dark:bg-gray-900">
      <div class="flex items-center gap-2 text-xs text-gray-500">
        <button @click="$router.push('/students')" class="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span class="cursor-pointer hover:text-primary-600" @click="$router.push('/')">Home</span>
        <span class="text-gray-300">/</span>
        <span class="cursor-pointer hover:text-primary-600" @click="$router.push('/students')">Students</span>
        <span class="text-gray-300">/</span>
        <span class="font-bold text-gray-800 dark:text-white">{{ student.name }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span :class="['rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider', student.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">{{ student.status }}</span>
        <span class="rounded bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">{{ student.enrollment_no || 'No Enrollment' }}</span>
      </div>
    </div>

    <!-- ===== MAIN LAYOUT ===== -->
    <div class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr]">
      <!-- LEFT SIDEBAR -->
      <div class="space-y-3">
        <!-- Photo Card -->
        <div class="rounded-lg border border-gray-200 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-900">
          <div class="mx-auto h-40 w-40 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800">
            <img v-if="student.profile_photo_url" :src="student.profile_photo_url" alt="Student Photo" class="h-full w-full object-cover" />
            <div v-else class="flex h-full w-full items-center justify-center text-4xl font-black text-primary-400">{{ student.name.charAt(0) }}</div>
          </div>
          <label class="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded bg-blue-600 px-3 py-1.5 text-[10px] font-bold uppercase text-white hover:bg-blue-700">
            <input class="hidden" type="file" accept="image/*" @change="handlePhotoUpload" />
            {{ uploadingPhoto ? 'Uploading...' : 'Upload Photo' }}
          </label>
        </div>

        <!-- Quick Info -->
        <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <div class="border-b border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
            <p class="text-[10px] font-bold uppercase tracking-wider text-gray-500">Quick Info</p>
          </div>
          <div class="divide-y divide-gray-50 text-xs dark:divide-gray-800">
            <div v-for="info in quickInfo" :key="info.label" class="flex justify-between px-3 py-2">
              <span class="text-gray-500">{{ info.label }}</span>
              <span :class="['font-bold', info.color || 'text-gray-800 dark:text-white']">{{ info.val || '-' }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-2">
          <button @click="printProfile" class="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-700">
            🖨️ Print Profile
          </button>
          <button @click="sendEmail" class="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700">
            ✉️ Send Email
          </button>
          <button @click="deleteStudentConfirm" class="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700">
            🗑️ Delete Student
          </button>
        </div>
      </div>

      <!-- RIGHT AREA: Tabs + Forms -->
      <div class="space-y-0">
        <!-- Tabs -->
        <div class="flex flex-wrap border-b-2 border-gray-200 bg-white rounded-t-lg overflow-hidden dark:border-gray-700 dark:bg-gray-900">
          <button
            v-for="tab in formTabs" :key="tab.id"
            @click="switchTab(tab.id)"
            :class="['relative px-4 py-3 text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 -mb-[2px]',
              activeFormTab === tab.id
                ? 'text-blue-700 border-blue-600 bg-blue-50/60 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-400'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800']"
          >
            <span class="mr-1">{{ tab.icon }}</span>{{ tab.label }}
          </button>
        </div>

        <!-- Form Content -->
        <div class="rounded-b-lg border border-t-0 border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">

          <!-- Shared Edit/Save/Cancel bar -->
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-sm font-bold text-gray-800 dark:text-white">{{ currentTabLabel }}</h3>
            <div class="flex items-center gap-2">
              <button v-if="!editMode && activeFormTab !== 'academics' && activeFormTab !== 'fees' && activeFormTab !== 'certificates'" type="button" @click="startEdit" class="rounded bg-blue-600 px-3 py-1.5 text-[10px] font-bold uppercase text-white hover:bg-blue-700">Edit</button>
              <button v-if="editMode" type="button" :disabled="saving" @click="saveForm" class="rounded bg-green-600 px-3 py-1.5 text-[10px] font-bold uppercase text-white hover:bg-green-700 disabled:opacity-60">{{ saving ? 'Saving...' : 'Save' }}</button>
              <button v-if="editMode" type="button" :disabled="saving" @click="cancelEdit" class="rounded bg-gray-400 px-3 py-1.5 text-[10px] font-bold uppercase text-white hover:bg-gray-500 disabled:opacity-60">Cancel</button>
            </div>
          </div>

          <!-- TAB 1: Personal Information -->
          <div v-if="activeFormTab === 'student'" class="animate-fade-in-up">
            <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormField label="Admission No" :value="form.enrollment_no" :edit="editMode" v-model="form.enrollment_no" />
              <FormField label="Fee No" :value="form.fee_no" :edit="editMode" v-model="form.fee_no" />
              <FormField label="Student Name *" :value="form.name" :edit="editMode" v-model="form.name" />
              <FormField label="Roll Number" :value="form.roll_number" :edit="editMode" v-model="form.roll_number" />
              <FormField label="Class *" :value="form.class_name" :edit="editMode" v-model="form.class_name" type="select" :options="classOptions" />
              <FormField label="Section" :value="form.section" :edit="editMode" v-model="form.section" type="select" :options="sectionOptions" />
              <FormField label="Date of Birth" :value="form.date_of_birth" :edit="editMode" v-model="form.date_of_birth" type="date" />
              <FormField label="Gender" :value="form.gender" :edit="editMode" v-model="form.gender" type="select" :options="genderOptions" />
              <FormField label="Blood Group" :value="form.blood_group" :edit="editMode" v-model="form.blood_group" type="select" :options="bloodGroupOptions" />
              <FormField label="Nationality" :value="form.nationality" :edit="editMode" v-model="form.nationality" />
              <FormField label="Religion" :value="form.religion" :edit="editMode" v-model="form.religion" />
              <FormField label="Category" :value="form.category" :edit="editMode" v-model="form.category" type="select" :options="categoryOptions" />
              <FormField label="Caste" :value="form.caste" :edit="editMode" v-model="form.caste" />
              <FormField label="Mother Tongue" :value="form.mother_tongue" :edit="editMode" v-model="form.mother_tongue" />
              <FormField label="Aadhar Number" :value="form.aadhar_number" :edit="editMode" v-model="form.aadhar_number" />
              <FormField label="Email" :value="form.email" :edit="editMode" v-model="form.email" type="email" />
              <FormField label="Phone" :value="form.phone" :edit="editMode" v-model="form.phone" />
              <FormField label="Status" :value="form.status" :edit="editMode" v-model="form.status" type="select" :options="statusOptions" />
              <FormField label="Admission Date" :value="form.admission_date" :edit="editMode" v-model="form.admission_date" type="date" />
              <FormField label="Academic Year" :value="form.academic_year" :edit="editMode" v-model="form.academic_year" />
              <FormField label="Stream" :value="form.stream" :edit="editMode" v-model="form.stream" />
            </div>
          </div>

          <!-- TAB 2: Parent / Guardian -->
          <div v-if="activeFormTab === 'parent'" class="animate-fade-in-up space-y-6">
            <div>
              <p class="mb-3 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">👨 Father's Details</p>
              <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormField label="Father's Name" :value="form.father_name" :edit="editMode" v-model="form.father_name" />
                <FormField label="Occupation" :value="form.father_occupation" :edit="editMode" v-model="form.father_occupation" />
                <FormField label="Qualification" :value="form.father_qualification" :edit="editMode" v-model="form.father_qualification" />
                <FormField label="Phone" :value="form.father_phone" :edit="editMode" v-model="form.father_phone" />
                <FormField label="Email" :value="form.father_email" :edit="editMode" v-model="form.father_email" type="email" />
                <FormField label="Aadhar No" :value="form.father_aadhar" :edit="editMode" v-model="form.father_aadhar" />
                <FormField label="Annual Income" :value="form.father_annual_income" :edit="editMode" v-model="form.father_annual_income" />
              </div>
            </div>
            <hr class="border-gray-100 dark:border-gray-800" />
            <div>
              <p class="mb-3 text-xs font-bold uppercase tracking-wider text-pink-700 dark:text-pink-400">👩 Mother's Details</p>
              <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormField label="Mother's Name" :value="form.mother_name" :edit="editMode" v-model="form.mother_name" />
                <FormField label="Occupation" :value="form.mother_occupation" :edit="editMode" v-model="form.mother_occupation" />
                <FormField label="Qualification" :value="form.mother_qualification" :edit="editMode" v-model="form.mother_qualification" />
                <FormField label="Phone" :value="form.mother_phone" :edit="editMode" v-model="form.mother_phone" />
                <FormField label="Email" :value="form.mother_email" :edit="editMode" v-model="form.mother_email" type="email" />
                <FormField label="Aadhar No" :value="form.mother_aadhar" :edit="editMode" v-model="form.mother_aadhar" />
              </div>
            </div>
            <hr class="border-gray-100 dark:border-gray-800" />
            <div>
              <p class="mb-3 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">🛡️ Guardian / Emergency Contact</p>
              <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormField label="Guardian Name" :value="form.guardian_name" :edit="editMode" v-model="form.guardian_name" />
                <FormField label="Relation" :value="form.guardian_relation" :edit="editMode" v-model="form.guardian_relation" />
                <FormField label="Phone" :value="form.guardian_phone" :edit="editMode" v-model="form.guardian_phone" />
                <FormField label="Occupation" :value="form.guardian_occupation" :edit="editMode" v-model="form.guardian_occupation" />
                <FormField label="Emergency Contact Name" :value="form.emergency_contact_name" :edit="editMode" v-model="form.emergency_contact_name" />
                <FormField label="Emergency Phone" :value="form.emergency_contact_phone" :edit="editMode" v-model="form.emergency_contact_phone" />
              </div>
            </div>
          </div>

          <!-- TAB 3: Address -->
          <div v-if="activeFormTab === 'address'" class="animate-fade-in-up space-y-5">
            <div>
              <p class="mb-3 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">Current Address</p>
              <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                <div class="sm:col-span-2 lg:col-span-3">
                  <FormField label="Address Line" :value="form.current_address" :edit="editMode" v-model="form.current_address" />
                </div>
                <FormField label="City" :value="form.current_city" :edit="editMode" v-model="form.current_city" />
                <FormField label="State" :value="form.current_state" :edit="editMode" v-model="form.current_state" />
                <FormField label="Pincode" :value="form.current_pincode" :edit="editMode" v-model="form.current_pincode" />
                <FormField label="Country" :value="form.current_country" :edit="editMode" v-model="form.current_country" />
              </div>
            </div>
            <hr class="border-gray-100 dark:border-gray-800" />
            <div>
              <div class="mb-3 flex items-center justify-between">
                <p class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Permanent Address</p>
                <label v-if="editMode" class="flex cursor-pointer items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <input type="checkbox" v-model="form.same_as_current" @change="copyCurrent" class="rounded border-gray-300 text-blue-600" />
                  Same as Current
                </label>
              </div>
              <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                <div class="sm:col-span-2 lg:col-span-3">
                  <FormField label="Address Line" :value="form.permanent_address" :edit="editMode" v-model="form.permanent_address" />
                </div>
                <FormField label="City" :value="form.permanent_city" :edit="editMode" v-model="form.permanent_city" />
                <FormField label="State" :value="form.permanent_state" :edit="editMode" v-model="form.permanent_state" />
                <FormField label="Pincode" :value="form.permanent_pincode" :edit="editMode" v-model="form.permanent_pincode" />
                <FormField label="Country" :value="form.permanent_country" :edit="editMode" v-model="form.permanent_country" />
              </div>
            </div>
          </div>

          <!-- TAB 4: Additional Details -->
          <div v-if="activeFormTab === 'additional'" class="animate-fade-in-up">
            <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              <div class="sm:col-span-2">
                <FormField label="Previous School" :value="form.previous_school" :edit="editMode" v-model="form.previous_school" />
              </div>
              <FormField label="Previous Class" :value="form.previous_class" :edit="editMode" v-model="form.previous_class" />
              <FormField label="TC Number" :value="form.tc_number" :edit="editMode" v-model="form.tc_number" />
              <FormField label="Transport Mode" :value="form.transport_mode" :edit="editMode" v-model="form.transport_mode" type="select" :options="transportOptions" />
              <FormField label="Bus Route" :value="form.bus_route" :edit="editMode" v-model="form.bus_route" />
              <FormField label="Hostel Name" :value="form.hostel_name" :edit="editMode" v-model="form.hostel_name" />
              <div class="sm:col-span-2">
                <FormField label="Medical Conditions" :value="form.medical_conditions" :edit="editMode" v-model="form.medical_conditions" />
              </div>
              <FormField label="Allergies" :value="form.allergies" :edit="editMode" v-model="form.allergies" />
              <FormField label="Bank Name" :value="form.bank_name" :edit="editMode" v-model="form.bank_name" />
              <FormField label="Account Number" :value="form.bank_account_no" :edit="editMode" v-model="form.bank_account_no" />
              <FormField label="IFSC Code" :value="form.ifsc_code" :edit="editMode" v-model="form.ifsc_code" />
              <FormField label="Scholarship Name" :value="form.scholarship_name" :edit="editMode" v-model="form.scholarship_name" />
              <FormField label="Scholarship Amount" :value="form.scholarship_amount ? String(form.scholarship_amount) : ''" :edit="editMode" v-model="scholarshipAmountStr" />
            </div>
            <div class="mt-4">
              <label class="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-500">Remarks / Notes</label>
              <textarea v-if="editMode" v-model="form.notes" rows="3" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white" placeholder="Add any notes..."></textarea>
              <div v-else class="min-h-[50px] rounded-lg bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">{{ form.notes || 'No notes added.' }}</div>
            </div>
          </div>

          <!-- TAB 5: Academics (read-only) -->
          <div v-if="activeFormTab === 'academics'" class="animate-fade-in-up">
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
              <div class="rounded-lg bg-green-50 border border-green-200 p-3 text-center"><p class="text-xl font-black text-green-700">{{ presentCount }}</p><p class="text-[10px] font-bold uppercase text-green-600">Present</p></div>
              <div class="rounded-lg bg-red-50 border border-red-200 p-3 text-center"><p class="text-xl font-black text-red-700">{{ absentCount }}</p><p class="text-[10px] font-bold uppercase text-red-600">Absent</p></div>
              <div class="rounded-lg bg-amber-50 border border-amber-200 p-3 text-center"><p class="text-xl font-black text-amber-700">{{ lateCount }}</p><p class="text-[10px] font-bold uppercase text-amber-600">Late</p></div>
              <div class="rounded-lg bg-blue-50 border border-blue-200 p-3 text-center"><p class="text-xl font-black text-blue-700">{{ attendancePercentage }}%</p><p class="text-[10px] font-bold uppercase text-blue-600">Overall</p></div>
            </div>
            <p class="text-xs text-gray-400 text-center">Attendance & exam records are view-only on this tab.</p>
          </div>

          <!-- TAB 6: Fees -->
          <div v-if="activeFormTab === 'fees'" class="animate-fade-in-up">
            <div class="flex items-center justify-between mb-4">
              <p class="text-sm font-bold text-gray-700 dark:text-gray-300">Fee Assignments</p>
              <button @click="showAssignModal = true" class="rounded bg-blue-600 px-3 py-1.5 text-[10px] font-bold uppercase text-white hover:bg-blue-700">+ Assign Fee</button>
            </div>
            <div class="grid grid-cols-3 gap-3 mb-4">
              <div class="rounded-lg bg-green-50 p-3 text-center"><p class="text-lg font-black text-green-700">₹{{ totalPaid.toLocaleString('en-IN') }}</p><p class="text-[10px] text-green-600">Paid</p></div>
              <div class="rounded-lg bg-red-50 p-3 text-center"><p class="text-lg font-black text-red-700">₹{{ totalDue.toLocaleString('en-IN') }}</p><p class="text-[10px] text-red-600">Due</p></div>
              <div class="rounded-lg bg-blue-50 p-3 text-center"><p class="text-lg font-black text-blue-700">₹{{ totalFees.toLocaleString('en-IN') }}</p><p class="text-[10px] text-blue-600">Total</p></div>
            </div>
            <div v-if="studentPayments.length" class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table class="w-full text-left text-sm">
                <thead><tr class="border-b bg-gray-50 dark:bg-gray-800"><th class="px-4 py-2 text-[10px] font-bold uppercase text-gray-500">Fee</th><th class="px-4 py-2 text-right text-[10px] font-bold uppercase text-gray-500">Total</th><th class="px-4 py-2 text-right text-[10px] font-bold uppercase text-gray-500">Paid</th><th class="px-4 py-2 text-right text-[10px] font-bold uppercase text-gray-500">Due</th><th class="px-4 py-2 text-center text-[10px] font-bold uppercase text-gray-500">Status</th></tr></thead>
                <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
                  <tr v-for="p in studentPayments" :key="p.id" class="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td class="px-4 py-2 font-semibold text-gray-800 dark:text-white">{{ p.fee_name }}</td>
                    <td class="px-4 py-2 text-right text-gray-600">₹{{ p.total_amount.toLocaleString('en-IN') }}</td>
                    <td class="px-4 py-2 text-right font-bold text-green-600">₹{{ p.paid_amount.toLocaleString('en-IN') }}</td>
                    <td class="px-4 py-2 text-right font-bold" :class="p.due_amount ? 'text-red-600' : 'text-gray-400'">₹{{ p.due_amount.toLocaleString('en-IN') }}</td>
                    <td class="px-4 py-2 text-center"><span :class="['rounded px-2 py-0.5 text-[10px] font-bold uppercase', p.status === 'paid' ? 'bg-green-100 text-green-700' : p.status === 'partial' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700']">{{ p.status }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="rounded-lg bg-gray-50 p-6 text-center text-sm text-gray-500 dark:bg-gray-800">No fees assigned yet.</div>
          </div>

          <!-- TAB 7: Certificates -->
          <div v-if="activeFormTab === 'certificates'" class="animate-fade-in-up">
            <div class="mb-4 flex items-center justify-between">
              <div>
                <p class="text-sm font-bold text-gray-800 dark:text-white">Issued Certificates</p>
                <p class="text-xs text-gray-500 mt-0.5">Transfer & Character certificates for this student</p>
              </div>
              <button @click="showIssueCertModal = true" class="flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-[10px] font-bold uppercase text-white hover:bg-amber-700">
                🏅 Issue Certificate
              </button>
            </div>

            <!-- Stats row -->
            <div class="grid grid-cols-3 gap-3 mb-5">
              <div class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-center dark:border-amber-800 dark:bg-amber-900/20">
                <p class="text-2xl font-black text-amber-700 dark:text-amber-400">{{ studentCertificates.length }}</p>
                <p class="text-[10px] font-bold uppercase text-amber-600">Total Issued</p>
              </div>
              <div class="rounded-lg border border-blue-200 bg-blue-50 p-3 text-center dark:border-blue-800 dark:bg-blue-900/20">
                <p class="text-2xl font-black text-blue-700 dark:text-blue-400">{{ studentCertificates.filter(c => c.type === 'tc').length }}</p>
                <p class="text-[10px] font-bold uppercase text-blue-600">Transfer Cert</p>
              </div>
              <div class="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-center dark:border-emerald-800 dark:bg-emerald-900/20">
                <p class="text-2xl font-black text-emerald-700 dark:text-emerald-400">{{ studentCertificates.filter(c => c.type === 'character').length }}</p>
                <p class="text-[10px] font-bold uppercase text-emerald-600">Character Cert</p>
              </div>
            </div>

            <!-- Certificates table -->
            <div v-if="studentCertificates.length" class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table class="w-full text-left text-sm">
                <thead>
                  <tr class="border-b bg-gray-50 dark:bg-gray-800">
                    <th class="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">Certificate No</th>
                    <th class="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">Type</th>
                    <th class="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">Issue Date</th>
                    <th class="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">Reason</th>
                    <th class="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">Issued By</th>
                    <th class="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-500 text-center">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
                  <tr v-for="cert in studentCertificates" :key="cert.id" class="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td class="px-4 py-2.5">
                      <span class="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">{{ cert.certificate_no }}</span>
                    </td>
                    <td class="px-4 py-2.5">
                      <span :class="['rounded px-2 py-0.5 text-[10px] font-bold uppercase', cert.type === 'tc' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300']">
                        {{ cert.type === 'tc' ? 'Transfer' : 'Character' }}
                      </span>
                    </td>
                    <td class="px-4 py-2.5 text-gray-600 dark:text-gray-300">{{ cert.issue_date }}</td>
                    <td class="px-4 py-2.5 text-gray-600 dark:text-gray-300 max-w-[200px] truncate">{{ cert.reason || '-' }}</td>
                    <td class="px-4 py-2.5 text-gray-600 dark:text-gray-300">{{ cert.issued_by || '-' }}</td>
                    <td class="px-4 py-2.5 text-center">
                      <span :class="['rounded px-2 py-0.5 text-[10px] font-bold uppercase', cert.status === 'issued' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600']">
                        {{ cert.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-else class="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-10 text-center dark:border-gray-700 dark:bg-gray-800">
              <div class="text-4xl mb-2">🏅</div>
              <p class="text-sm font-bold text-gray-600 dark:text-gray-400">No Certificates Issued</p>
              <p class="text-xs text-gray-400 mt-1">Click "Issue Certificate" to generate a Transfer or Character certificate.</p>
              <button @click="showIssueCertModal = true" class="mt-4 rounded-lg bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700">Issue First Certificate</button>
            </div>
          </div>

      </div>
    </div>
  </div>

    <!-- Assign Fee Modal -->
    <AppModal v-model="showAssignModal" title="Assign Fee" size="sm">
      <form @submit.prevent="handleAssignFee" class="space-y-4">
        <AppInput v-model="assignFeeId" type="select" label="Fee Structure" required>
          <option v-for="s in feeStore.structures" :key="s.id" :value="String(s.id)">{{ s.name }} - {{ s.class_name }} (₹{{ s.amount.toLocaleString('en-IN') }})</option>
        </AppInput>
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showAssignModal = false">Cancel</AppButton>
          <AppButton @click="handleAssignFee">Assign</AppButton>
        </div>
      </template>
    </AppModal>

    <!-- Issue Certificate Modal -->
    <AppModal v-model="showIssueCertModal" title="Issue Certificate" size="sm">
      <form @submit.prevent="handleIssueCert" class="space-y-4">
        <AppInput v-model="certForm.type" type="select" label="Certificate Type" required>
          <option value="tc">Transfer Certificate (TC)</option>
          <option value="character">Character Certificate</option>
        </AppInput>
        <AppInput v-model="certForm.reason" label="Reason" placeholder="e.g. Parent transfer, Migration..." />
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="showIssueCertModal = false">Cancel</AppButton>
          <AppButton @click="handleIssueCert">Issue Certificate</AppButton>
        </div>
      </template>
    </AppModal>
  </div>

  <div v-else class="flex items-center justify-center py-20">
    <EmptyState title="Student not found" message="The student you're looking for doesn't exist or is still loading...">
      <template #action>
        <AppButton @click="$router.push('/students')">Back to Students</AppButton>
      </template>
    </EmptyState>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Student } from '@/types'
import { useStudentStore } from '@/stores/students'
import { useFeeStore } from '@/stores/fees'
import { useAttendanceStore } from '@/stores/attendance'
import { useClassStore } from '@/stores/classes'
import { useCertificateStore } from '@/stores/certificates'
import { useToastStore } from '@/stores/toast'
import { r2StorageService } from '@/services/r2StorageService'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

// ─────────────────────────────────────────────────
// FormField — uses h() render function ONLY
// Template strings need Vue runtime compiler which
// is NOT included in Vite's default ESM bundle.
// ─────────────────────────────────────────────────
const FormField = {
  name: 'FormField',
  props: {
    label: String,
    modelValue: [String, Number],
    value: { type: String, default: '' },
    edit: Boolean,
    type: { type: String, default: 'text' },
    options: { type: Array as () => { label: string; value: string }[], default: () => [] },
  },
  emits: ['update:modelValue'],
  setup(props: any, { emit }: any) {
    return () => {
      const labelEl = h(
        'label',
        { class: 'mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400' },
        props.label,
      )

      let inputEl: ReturnType<typeof h>

      if (!props.edit) {
        inputEl = h(
          'div',
          { class: 'min-h-[34px] rounded border border-gray-100 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white' },
          props.value || '-',
        )
      } else if (props.type === 'select') {
        const optionEls = [
          h('option', { value: '' }, '-- Select --'),
          ...(props.options || []).map((o: any) =>
            h('option', { value: o.value }, o.label),
          ),
        ]
        inputEl = h(
          'select',
          {
            value: props.modelValue,
            class: 'w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white',
            onChange: (e: Event) =>
              emit('update:modelValue', (e.target as HTMLSelectElement).value),
          },
          optionEls,
        )
      } else {
        inputEl = h('input', {
          type: props.type || 'text',
          value: props.modelValue ?? '',
          class: 'w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white',
          onInput: (e: Event) =>
            emit('update:modelValue', (e.target as HTMLInputElement).value),
        })
      }

      return h('div', [labelEl, inputEl])
    }
  },
}

// ─────────────────────────────────────────────────
// Core Setup
// ─────────────────────────────────────────────────
const route = useRoute()
const router = useRouter()
const studentStore = useStudentStore()
const feeStore = useFeeStore()
const attendanceStore = useAttendanceStore()
const classStore = useClassStore()
const certStore = useCertificateStore()
const toast = useToastStore()

const studentId = computed(() => Number(route.params.id))
const student = computed(() => studentStore.students.find((s) => s.id === studentId.value))

const studentPayments = computed(() => feeStore.payments.filter((p) => p.student_id === studentId.value))
const totalPaid = computed(() => studentPayments.value.reduce((sum, p) => sum + p.paid_amount, 0))
const totalDue = computed(() => studentPayments.value.reduce((sum, p) => sum + p.due_amount, 0))
const totalFees = computed(() => studentPayments.value.reduce((sum, p) => sum + p.total_amount, 0))

// Certificates for this student
const studentCertificates = computed(() =>
  certStore.certificates.filter((c) => c.student_id === studentId.value)
    .sort((a, b) => b.issue_date.localeCompare(a.issue_date))
)

const studentAttendance = computed(() =>
  attendanceStore.records.filter((r) => r.student_id === studentId.value),
)
const presentCount = computed(() => studentAttendance.value.filter((r) => r.status === 'present').length)
const absentCount = computed(() => studentAttendance.value.filter((r) => r.status === 'absent').length)
const lateCount = computed(() => studentAttendance.value.filter((r) => r.status === 'late').length)
const attendancePercentage = computed(() => {
  const total = studentAttendance.value.length
  return total > 0 ? Math.round((presentCount.value / total) * 100) : 0
})

const quickInfo = computed(() => [
  { label: 'Admission No', val: student.value?.enrollment_no },
  { label: 'Roll No', val: student.value?.roll_number },
  { label: 'Class', val: student.value ? `${student.value.class_name} - ${student.value.section}` : '' },
  { label: 'DOB', val: student.value?.date_of_birth },
  { label: 'Gender', val: student.value?.gender },
  { label: 'Blood Group', val: student.value?.blood_group, color: 'text-red-600' },
  { label: 'Attendance', val: `${attendancePercentage.value}%`, color: attendancePercentage.value >= 75 ? 'text-green-600' : 'text-red-600' },
])

// ─────────────────────────────────────────────────
// Tabs
// ─────────────────────────────────────────────────
const activeFormTab = ref('student')
const formTabs = [
  { id: 'student', label: 'Personal Info', icon: '📋' },
  { id: 'parent', label: 'Guardians', icon: '👨‍👩‍👧' },
  { id: 'address', label: 'Address', icon: '🏠' },
  { id: 'additional', label: 'Additional', icon: '📎' },
  { id: 'academics', label: 'Academics', icon: '🎓' },
  { id: 'certificates', label: 'Certificates', icon: '🏅' },
  { id: 'fees', label: 'Fees', icon: '💰' },
]
const currentTabLabel = computed(() => formTabs.find((t) => t.id === activeFormTab.value)?.label || '')

function switchTab(id: string) {
  if (editMode.value) {
    const ok = window.confirm('You have unsaved changes. Switch tabs and discard?')
    if (!ok) return
    cancelEdit()
  }
  activeFormTab.value = id
}

// ─────────────────────────────────────────────────
// Edit Form — ALL fields pre-declared so Vue 3
// tracks them from start (required for reactivity).
// ─────────────────────────────────────────────────
const editMode = ref(false)
const saving = ref(false)
const uploadingPhoto = ref(false)
const showAssignModal = ref(false)
const assignFeeId = ref('')
const showIssueCertModal = ref(false)
const certForm = reactive({ type: 'tc' as 'tc' | 'character', reason: '' })

// Every field declared upfront — Vue 3 only tracks existing reactive properties
const form = reactive<Record<string, any>>({
  name: '', first_name: '', middle_name: '', last_name: '',
  enrollment_no: '', roll_number: '', class_name: '', section: '', status: 'active',
  date_of_birth: '', gender: '', blood_group: '', nationality: '', religion: '',
  category: '', caste: '', mother_tongue: '', aadhar_number: '',
  fee_no: '', stream: '', fee_group: '', academic_year: '',
  admission_date: '', date_of_joining: '', email: '', phone: '',
  father_name: '', father_occupation: '', father_qualification: '',
  father_phone: '', father_email: '', father_aadhar: '', father_annual_income: '',
  mother_name: '', mother_occupation: '', mother_qualification: '',
  mother_phone: '', mother_email: '', mother_aadhar: '',
  guardian_name: '', guardian_relation: '', guardian_phone: '',
  guardian_occupation: '', guardian_address: '',
  current_address: '', current_city: '', current_state: '',
  current_pincode: '', current_country: 'India',
  permanent_address: '', permanent_city: '', permanent_state: '',
  permanent_pincode: '', permanent_country: 'India',
  same_as_current: false,
  previous_school: '', previous_class: '', tc_number: '',
  transport_mode: '', bus_route: '', hostel_name: '',
  medical_conditions: '', allergies: '',
  emergency_contact_name: '', emergency_contact_phone: '', emergency_relation: '',
  bank_name: '', bank_account_no: '', ifsc_code: '',
  scholarship_name: '', scholarship_amount: 0,
  notes: '', signature_url: '',
})

const scholarshipAmountStr = computed({
  get: () => (form.scholarship_amount ? String(form.scholarship_amount) : ''),
  set: (v: string) => { form.scholarship_amount = Number(v) || 0 },
})

function buildFormFromStudent(s: Student): Record<string, any> {
  return {
    name: s.name || '',
    first_name: (s as any).first_name || '',
    middle_name: (s as any).middle_name || '',
    last_name: (s as any).last_name || '',
    enrollment_no: (s as any).enrollment_no || '',
    roll_number: s.roll_number || '',
    class_name: s.class_name || '',
    section: s.section || '',
    status: s.status || 'active',
    date_of_birth: (s as any).date_of_birth || '',
    gender: (s as any).gender || '',
    blood_group: (s as any).blood_group || '',
    nationality: (s as any).nationality || '',
    religion: (s as any).religion || '',
    category: (s as any).category || '',
    caste: (s as any).caste || '',
    mother_tongue: (s as any).mother_tongue || '',
    aadhar_number: (s as any).aadhar_number || '',
    fee_no: (s as any).fee_no || '',
    stream: (s as any).stream || '',
    fee_group: (s as any).fee_group || '',
    academic_year: (s as any).academic_year || '',
    admission_date: s.admission_date || '',
    date_of_joining: (s as any).date_of_joining || '',
    email: s.email || '',
    phone: s.phone || '',
    father_name: (s as any).father_name || '',
    father_occupation: (s as any).father_occupation || '',
    father_qualification: (s as any).father_qualification || '',
    father_phone: (s as any).father_phone || '',
    father_email: (s as any).father_email || '',
    father_aadhar: (s as any).father_aadhar || '',
    father_annual_income: (s as any).father_annual_income || '',
    mother_name: (s as any).mother_name || '',
    mother_occupation: (s as any).mother_occupation || '',
    mother_qualification: (s as any).mother_qualification || '',
    mother_phone: (s as any).mother_phone || '',
    mother_email: (s as any).mother_email || '',
    mother_aadhar: (s as any).mother_aadhar || '',
    guardian_name: (s as any).guardian_name || s.parent_name || '',
    guardian_relation: (s as any).guardian_relation || '',
    guardian_phone: (s as any).guardian_phone || s.phone || '',
    guardian_occupation: (s as any).guardian_occupation || '',
    guardian_address: (s as any).guardian_address || s.address || '',
    current_address: (s as any).current_address || s.address || '',
    current_city: (s as any).current_city || '',
    current_state: (s as any).current_state || '',
    current_pincode: (s as any).current_pincode || '',
    current_country: (s as any).current_country || 'India',
    permanent_address: (s as any).permanent_address || '',
    permanent_city: (s as any).permanent_city || '',
    permanent_state: (s as any).permanent_state || '',
    permanent_pincode: (s as any).permanent_pincode || '',
    permanent_country: (s as any).permanent_country || 'India',
    same_as_current: (s as any).same_as_current ?? false,
    previous_school: (s as any).previous_school || '',
    previous_class: (s as any).previous_class || '',
    tc_number: (s as any).tc_number || '',
    transport_mode: (s as any).transport_mode || '',
    bus_route: (s as any).bus_route || '',
    hostel_name: (s as any).hostel_name || '',
    medical_conditions: (s as any).medical_conditions || '',
    allergies: (s as any).allergies || '',
    emergency_contact_name: (s as any).emergency_contact_name || '',
    emergency_contact_phone: (s as any).emergency_contact_phone || '',
    emergency_relation: (s as any).emergency_relation || '',
    bank_name: (s as any).bank_name || '',
    bank_account_no: (s as any).bank_account_no || '',
    ifsc_code: (s as any).ifsc_code || '',
    scholarship_name: (s as any).scholarship_name || '',
    scholarship_amount: (s as any).scholarship_amount || 0,
    notes: (s as any).notes || '',
    signature_url: (s as any).signature_url || '',
  }
}

// Sync form when student data arrives (immediate on mount, also after API fetch)
watch(student, (s) => { if (s && !saving.value) Object.assign(form, buildFormFromStudent(s)) }, { immediate: true })

onMounted(async () => {
  void feeStore.fetchFees()
  void certStore.fetchCertificates({ student_id: studentId.value })
  if (!student.value) {
    const fetched = await studentStore.fetchStudentById(studentId.value)
    if (fetched) {
      if (!studentStore.students.find((s) => s.id === fetched.id)) {
        studentStore.students.push(fetched)
      }
      Object.assign(form, buildFormFromStudent(fetched))
    }
  } else {
    Object.assign(form, buildFormFromStudent(student.value))
  }
})

function startEdit() {
  if (student.value) Object.assign(form, buildFormFromStudent(student.value))
  editMode.value = true
}

function cancelEdit() {
  if (saving.value) return
  editMode.value = false
  if (student.value) Object.assign(form, buildFormFromStudent(student.value))
}

async function saveForm() {
  if (!student.value) return
  saving.value = true
  const updates: Partial<Student> = {}
  const src = student.value as Record<string, any>
  for (const key of Object.keys(form)) {
    if (form[key] !== (src[key] ?? '')) {
      ;(updates as Record<string, any>)[key] = form[key]
    }
  }
  try {
    await studentStore.updateStudent(student.value.id, updates)
    editMode.value = false
    toast.success('Student profile updated successfully!')
  } catch {
    toast.error('Failed to update student profile.')
  } finally {
    saving.value = false
  }
}

function copyCurrent() {
  if (form.same_as_current) {
    form.permanent_address = form.current_address
    form.permanent_city = form.current_city
    form.permanent_state = form.current_state
    form.permanent_pincode = form.current_pincode
    form.permanent_country = form.current_country
  }
}

// ─────────────────────────────────────────────────
// Dropdown Options
// ─────────────────────────────────────────────────
const classOptions = computed(() =>
  classStore.classNames.map((c) => ({ label: c, value: c })),
)
const sectionOptions = computed(() => {
  const cls = classStore.classes.find((c) => c.name === form.class_name)
  return cls?.sections?.length
    ? cls.sections.map((s: any) => ({ label: `Section ${s.name}`, value: s.name }))
    : ['A', 'B', 'C', 'D'].map((s) => ({ label: `Section ${s}`, value: s }))
})
const genderOptions = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
]
const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((b) => ({ label: b, value: b }))
const categoryOptions = ['General', 'OBC', 'SC', 'ST', 'EWS'].map((c) => ({ label: c, value: c }))
const statusOptions = [{ label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }]
const transportOptions = ['Bus', 'Van', 'Own Vehicle', 'Walking', 'Other'].map((t) => ({ label: t, value: t }))

// ─────────────────────────────────────────────────
// Actions
// ─────────────────────────────────────────────────
async function handlePhotoUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file || !student.value) return
  if (!file.type.startsWith('image/')) { toast.warning('Please upload an image file'); return }
  if (file.size > 2 * 1024 * 1024) { toast.warning('Image must be under 2MB'); return }
  uploadingPhoto.value = true
  try {
    const photoUrl = await r2StorageService.uploadProfilePhoto(file, student.value.id)
    await studentStore.updateStudent(student.value.id, { profile_photo_url: photoUrl })
    toast.success('Photo updated')
  } catch {
    toast.error('Failed to upload photo')
  } finally {
    uploadingPhoto.value = false
    target.value = ''
  }
}

async function handleAssignFee() {
  if (!assignFeeId.value || !student.value) return
  await feeStore.assignFee(student.value.id, student.value.name, student.value.class_name, Number(assignFeeId.value))
  showAssignModal.value = false
  assignFeeId.value = ''
}

  async function handleIssueCert() {
    if (!student.value) return
  await certStore.issueCertificate({
      student_id: student.value.id,
    student_name: student.value.name,
    class_name: student.value.class_name,
    type: certForm.type,
    issue_date: new Date().toISOString().split('T')[0],
    reason: certForm.reason.trim(),
    issued_by: 'Admin',
  })
  showIssueCertModal.value = false
  certForm.reason = ''
  certForm.type = 'tc'
  // Switch to certificates tab to show the freshly issued cert
  activeFormTab.value = 'certificates'
  }

function sendEmail() {
  if (!student.value?.email) { toast.warning('Student email not available'); return }
  window.open(`mailto:${student.value.email}`, '_self')
}

async function deleteStudentConfirm() {
  if (!student.value) return
  const ok = window.confirm(`Delete ${student.value.name}? This cannot be undone.`)
  if (!ok) return
  await studentStore.deleteStudent(student.value.id)
  router.push('/students')
}

function printProfile() { window.print() }
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.25s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
@media print {
  button, label[class*='cursor-pointer'] { display: none !important; }
}
</style>

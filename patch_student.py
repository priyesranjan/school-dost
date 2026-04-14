import os

filepath = r'c:\Priyes\ERP-School\src\pages\StudentDetailPage.vue'
with open(filepath, 'r', encoding='utf-8') as f:
    orig = f.read()

# 1. Replace "Student Info" Card
student_info_old = """      <!-- Student Info -->
      <AppCard title="Student Info">
        <div class="space-y-3 text-sm">
          <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Parent</span><span class="font-medium text-gray-900 dark:text-white">{{ student.parent_name }}</span></div>
          <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Phone</span><span class="font-medium text-gray-900 dark:text-white">{{ student.phone }}</span></div>
          <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Email</span><span class="font-medium text-gray-900 dark:text-white">{{ student.email || '-' }}</span></div>
          <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Address</span><span class="font-medium text-gray-900 dark:text-white text-right max-w-[180px]">{{ student.address || '-' }}</span></div>
          <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Admission</span><span class="font-medium text-gray-900 dark:text-white">{{ student.admission_date }}</span></div>
        </div>
      </AppCard>"""

student_info_new = """      <!-- Guardian Registry -->
      <AppCard title="Guardian Registry" class="shadow-xl">
        <div class="space-y-4">
          <div class="flex flex-col rounded-2xl bg-gray-50 p-5 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
            <span class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Primary Authority</span>
            <span class="text-xl font-black tracking-tight text-gray-900 dark:text-white">{{ student.parent_name }}</span>
          </div>
          <div class="grid grid-cols-2 gap-4 px-2">
             <div class="flex flex-col space-y-1">
               <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Comm Network</span>
               <span class="text-sm font-bold text-gray-900 dark:text-gray-200">{{ student.phone }}</span>
             </div>
             <div class="flex flex-col space-y-1">
               <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Digital Relay</span>
               <span class="text-xs font-bold text-gray-900 dark:text-gray-200 truncate">{{ student.email || 'N/A' }}</span>
             </div>
          </div>
          <div class="flex flex-col border-t border-gray-100 dark:border-gray-800 pt-4 px-2">
            <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Residential Coordinates</span>
            <span class="text-sm font-bold text-gray-700 dark:text-gray-300 leading-relaxed">{{ student.address || 'Unregistered Directory' }}</span>
          </div>
          <div class="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4 px-2">
            <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Enrollment Epoch</span>
            <span class="rounded-xl bg-indigo-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:bg-indigo-900/30">{{ student.admission_date }}</span>
          </div>
        </div>
      </AppCard>"""

if student_info_old in orig:
    orig = orig.replace(student_info_old, student_info_new)

# 2. Extract Attendance Card and group with Certificates
attendance_old = """    <!-- Attendance History -->
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
    </AppCard>"""

certs_grid = """    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Attendance History -->
      <AppCard title="Attendance Matrix" :no-padding="true" class="shadow-xl h-full">
        <div v-if="studentAttendance.length" class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <th class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Temporal Date</th>
                <th class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Lifecycle Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
              <tr v-for="r in studentAttendance" :key="r.id" class="group hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <td class="px-8 py-4 font-bold text-gray-900 dark:text-gray-200">{{ r.date }}</td>
                <td class="px-8 py-4">
                   <div :class="['inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm', 
                                 r.status === 'present' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                                 r.status === 'absent' ? 'bg-rose-50 border-rose-100 text-rose-600' : 
                                 'bg-amber-50 border-amber-100 text-amber-600']">
                     {{ r.status }}
                   </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <EmptyState v-if="!studentAttendance.length" title="Metrics Silent" message="Attendance telemetry initializing..." />
      </AppCard>

      <!-- Academic Credentials -->
      <AppCard title="Authenticity Ledger" :no-padding="true" class="shadow-xl h-full">
        <div v-if="studentCertificates.length" class="overflow-x-auto">
           <table class="w-full text-left text-sm">
             <thead>
               <tr class="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                 <th class="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Document ID Hash</th>
                 <th class="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Classification</th>
               </tr>
             </thead>
             <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
               <tr v-for="c in studentCertificates" :key="c.id" class="group hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                 <td class="px-8 py-4">
                    <p class="font-mono text-xs font-black text-indigo-600 dark:text-indigo-400">{{ c.certificate_number }}</p>
                    <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Issued: {{ c.issue_date }}</p>
                 </td>
                 <td class="px-8 py-4">
                    <span class="rounded-xl bg-gray-100 px-3 py-1.5 text-[10px] font-black uppercase text-gray-600 dark:bg-gray-800">{{ c.type }}</span>
                 </td>
               </tr>
             </tbody>
           </table>
        </div>
        <EmptyState v-else title="Empty Ledger" message="No verified academic credentials found for this candidate." />
      </AppCard>
    </div>

    <!-- Academic Performance -->
    <AppCard title="Excellence Performance Records" :no-padding="true" class="shadow-xl">
      <div v-if="studentResults.length" class="overflow-x-auto">
        <table class="w-full text-left text-sm">
           <thead>
             <tr class="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
               <th class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Exam Cycle Focus</th>
               <th class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Knowledge Domain</th>
               <th class="px-8 py-4 text-[10px] text-right font-black uppercase tracking-widest text-gray-400">Achieved Scale</th>
               <th class="px-8 py-4 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">Points Grade</th>
             </tr>
           </thead>
           <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
             <tr v-for="r in studentResults" :key="r.id" class="group hover:bg-emerald-50/20 dark:hover:bg-emerald-900/5 transition-colors">
               <td class="px-8 py-5">
                   <p class="font-black text-gray-900 dark:text-white">{{ r.exam_name }}</p>
               </td>
               <td class="px-8 py-5 uppercase text-xs tracking-widest font-black text-gray-500">{{ r.subject }}</td>
               <td class="px-8 py-5 text-right">
                  <span class="font-black text-lg tracking-tight text-gray-900 dark:text-white">{{ r.marks_obtained }}</span>
                  <span class="text-xs font-bold text-gray-400 mix-blend-multiply dark:mix-blend-screen ml-1">/ {{ r.max_marks }}</span>
               </td>
               <td class="px-8 py-5 text-center">
                  <div :class="['inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-inner', 
                               r.grade.includes('A') ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600']">
                     {{ r.grade }} Rank
                  </div>
               </td>
             </tr>
           </tbody>
        </table>
      </div>
      <EmptyState v-else title="Performance Unknown" message="No verified examination records available." />
    </AppCard>
"""

if attendance_old in orig:
    orig = orig.replace(attendance_old, certs_grid)

script_imports_old = """import { useAttendanceStore } from '@/stores/attendance'"""
script_imports_new = """import { useAttendanceStore } from '@/stores/attendance'
import { useCertificateStore } from '@/stores/certificates'
import { useExamStore } from '@/stores/exams'"""

if script_imports_old in orig:
    orig = orig.replace(script_imports_old, script_imports_new)

store_init_old = """const attendanceStore = useAttendanceStore()"""
store_init_new = """const attendanceStore = useAttendanceStore()
const certStore = useCertificateStore()
const examStore = useExamStore()"""

if store_init_old in orig:
    orig = orig.replace(store_init_old, store_init_new)

computed_old = """const studentAttendance = computed(() => attendanceStore.records.filter((r) => r.student_id === studentId.value).sort((a, b) => b.date.localeCompare(a.date)))"""
computed_new = """const studentAttendance = computed(() => attendanceStore.records.filter((r) => r.student_id === studentId.value).sort((a, b) => b.date.localeCompare(a.date)))
const studentCertificates = computed(() => certStore.certificates.filter((c) => c.student_id === studentId.value))
const studentResults = computed(() => examStore.results.filter((r) => r.student_id === studentId.value))"""

if computed_old in orig:
    orig = orig.replace(computed_old, computed_new)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(orig)

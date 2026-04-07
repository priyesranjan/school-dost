<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Academic Achievement Header -->
    <div class="relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-xl shadow-gray-100 dark:border dark:border-gray-800 dark:bg-gray-800/50 dark:shadow-none">
      <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div class="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-purple-600 dark:bg-purple-900/30">
            📊 Examination Portal
          </div>
          <h1 class="mt-3 text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            Academic <span class="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Excellence Hub</span>
          </h1>
          <p class="mt-1 text-sm font-medium text-gray-400">
            Schedule assessments, record performance, and analyze student growth.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <StatCard 
            title="Avg Performance" 
            :value="overallAvg + '%'" 
            icon="🎯" 
            icon-bg="bg-amber-50 text-amber-600" 
            class="hidden sm:flex border-none shadow-none"
          />
          <AppButton v-if="activeTab === 'schedule'" @click="showExamModal = true" class="shadow-lg shadow-primary-200 dark:shadow-none">
            + Schedule New Exam
          </AppButton>
        </div>
      </div>
      <!-- Background Accents -->
      <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-50/50 blur-3xl dark:bg-purple-900/10"></div>
    </div>

    <!-- Stats Matrix -->
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard v-for="stat in summaryStats" :key="stat.title" v-bind="stat" class="hover:-translate-y-1 transition-transform" />
    </div>

    <!-- Premium Tab Navigation -->
    <div class="flex items-center justify-between">
      <div class="inline-flex gap-1 rounded-2xl bg-gray-100 p-1.5 dark:bg-gray-900">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'rounded-xl px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300',
            activeTab === tab.key 
              ? 'bg-white text-gray-900 shadow-md scale-105 dark:bg-gray-800 dark:text-white' 
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Phase Content Transitions -->
    <Transition name="fade" mode="out-in">
      <div :key="activeTab">
        <!-- Exam Schedule Tab -->
        <template v-if="activeTab === 'schedule'">
          <AppCard :no-padding="true" class="overflow-hidden shadow-2xl">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead>
                  <tr class="bg-gray-50/30 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:bg-gray-900/30">
                    <th class="px-8 py-4">Assessment Name</th>
                    <th class="px-8 py-4">Subject Core</th>
                    <th class="px-8 py-4">Class Target</th>
                    <th class="px-8 py-4">Session Date</th>
                    <th class="px-8 py-4 text-right">Scale</th>
                    <th class="px-8 py-4">Progression</th>
                    <th class="px-8 py-4 text-right">Management</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
                  <tr v-for="exam in examStore.exams" :key="exam.id" 
                      class="group transition-colors hover:bg-primary-50/30 dark:hover:bg-primary-900/5">
                    <td class="px-8 py-5">
                      <div class="flex items-center gap-3">
                        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 shadow-inner dark:bg-purple-900/20">
                          📜
                        </div>
                        <span class="font-black text-gray-900 dark:text-white">{{ exam.name }}</span>
                      </div>
                    </td>
                    <td class="px-8 py-5 font-bold text-gray-500 uppercase tracking-tighter">{{ exam.subject }}</td>
                    <td class="px-8 py-5">
                      <span class="rounded-lg bg-gray-100 px-2 py-0.5 text-[10px] font-black uppercase text-gray-500 dark:bg-gray-800">
                        {{ exam.class_name }}
                      </span>
                    </td>
                    <td class="px-8 py-5 text-gray-500 font-medium">{{ exam.date }}</td>
                    <td class="px-8 py-5 text-right font-black text-gray-900 dark:text-white">{{ exam.max_marks }}</td>
                    <td class="px-8 py-5">
                      <div class="flex items-center gap-2">
                        <div class="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800/50">
                          <div class="h-full bg-emerald-500 transition-all duration-1000" 
                               :style="{ width: `${(examStore.getExamResults(exam.id).length / studentStore.students.length) * 100}%` }"></div>
                        </div>
                        <span class="text-[9px] font-black uppercase text-emerald-600">{{ examStore.getExamResults(exam.id).length }} Entries</span>
                      </div>
                    </td>
                    <td class="px-8 py-5 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <button @click="openMarksEntry(exam)" class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-all hover:scale-110 hover:bg-indigo-600 hover:text-white dark:bg-indigo-900/20" title="Input Performance">
                          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button @click="viewResults(exam)" class="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-all hover:scale-110 hover:bg-emerald-600 hover:text-white dark:bg-emerald-900/20" title="Visualize Analytics">
                          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <EmptyState v-if="!examStore.exams.length" title="Assessment Registry Empty" message="No pending exams scheduled for this term." />
          </AppCard>
        </template>

        <!-- Marks Entry Interface -->
        <template v-if="activeTab === 'marks'">
          <div class="space-y-6">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between bg-gray-50/50 p-6 rounded-3xl dark:bg-gray-800/30">
              <div class="flex-1 max-w-md space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Assessment Domain</label>
                <select v-model="selectedExamId" class="w-full rounded-2xl border border-gray-100 bg-white px-5 py-3 text-sm font-black text-gray-900 outline-none transition-all focus:ring-4 focus:ring-primary-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                  <option :value="0">Search active assessments...</option>
                  <option v-for="exam in examStore.exams" :key="exam.id" :value="exam.id">
                    {{ exam.name }} — {{ exam.subject }} ({{ exam.class_name }})
                  </option>
                </select>
              </div>
              <AppButton v-if="selectedExamId && marksEntries.length" 
                         variant="primary" size="lg" shadow="xl"
                         @click="saveMarks">
                Finalize & Update Roster
              </AppButton>
            </div>

            <AppCard v-if="selectedExam" :no-padding="true" class="shadow-2xl">
              <div class="flex items-center justify-between px-8 py-6 border-b border-gray-50 bg-white dark:bg-gray-800">
                <div>
                  <h3 class="text-lg font-black text-gray-900 dark:text-white">{{ selectedExam.name }}</h3>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ selectedExam.class_name }} · Scale: {{ selectedExam.max_marks }} Marks</p>
                </div>
                <div class="flex items-center gap-2 rounded-xl bg-purple-50 px-4 py-2 dark:bg-purple-900/20">
                  <span class="text-xs font-black text-purple-600">Grading System: Standard K-12</span>
                </div>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                  <thead>
                    <tr class="bg-gray-50/30 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:bg-gray-900/30">
                      <th class="px-8 py-4">Candidate Identification</th>
                      <th class="px-8 py-4">Score Achievement</th>
                      <th class="px-8 py-4 text-center">Grade Assignment</th>
                      <th class="px-8 py-4 text-center">Performance Indicator</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
                    <tr v-for="entry in marksEntries" :key="entry.studentId" class="group hover:bg-primary-50/30 transition-colors">
                      <td class="px-8 py-5">
                        <div class="flex items-center gap-4">
                          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-[10px] font-black text-gray-500">
                            #{{ entry.rollNumber }}
                          </span>
                          <div>
                            <p class="font-black text-gray-900 dark:text-white">{{ entry.studentName }}</p>
                            <p class="text-[9px] font-bold text-gray-400 uppercase">ID: STD-{{ 2000 + entry.studentId }}</p>
                          </div>
                        </div>
                      </td>
                      <td class="px-8 py-5">
                        <div class="flex items-center gap-3">
                          <input
                            :value="entry.marks"
                            type="number"
                            :max="selectedExam.max_marks"
                            min="0"
                            class="w-24 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm font-black text-gray-900 outline-none transition-all focus:border-primary-300 focus:bg-white focus:ring-4 focus:ring-primary-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                            @input="updateMarks(entry, Number(($event.target as HTMLInputElement).value))"
                          />
                          <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">/ {{ selectedExam.max_marks }} pts</p>
                        </div>
                      </td>
                      <td class="px-8 py-5 text-center">
                        <div :class="['inline-flex h-10 w-10 items-center justify-center rounded-xl text-xs font-black shadow-lg shadow-gray-100 dark:shadow-none', gradeBackground(entry.grade)]">
                          {{ entry.grade }}
                        </div>
                      </td>
                      <td class="px-8 py-5">
                         <div class="flex items-center justify-center gap-1.5">
                            <span v-for="i in 5" :key="i" 
                                  :class="['h-1 w-4 rounded-full transition-all duration-500', 
                                           (entry.marks / selectedExam.max_marks * 5) >= i ? 'bg-emerald-500' : 'bg-gray-100 dark:bg-gray-800']"></span>
                         </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <EmptyState v-if="!marksEntries.length" title="No Candidates" message="Select an active assessment to begin performance entry." class="py-12" />
            </AppCard>
          </div>
        </template>

        <!-- Performance Analytics Tab -->
        <template v-if="activeTab === 'results'">
          <div class="space-y-8">
            <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div v-for="avg in examStore.classAverage" :key="avg.examId" 
                   class="group relative overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-800/50">
                <div class="flex items-center justify-between mb-4">
                   <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl dark:bg-indigo-900/20">📈</div>
                   <div class="text-right">
                      <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Class Mean</p>
                      <p :class="['text-3xl font-black tracking-tighter', avg.average >= 60 ? 'text-emerald-600' : 'text-rose-600']">{{ avg.average }}%</p>
                   </div>
                </div>
                <h4 class="text-sm font-black text-gray-900 dark:text-white truncate">{{ avg.examName }}</h4>
                <p class="text-[10px] font-bold text-gray-400 uppercase mb-4">{{ avg.subject }}</p>
                <div class="h-1.5 w-full rounded-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
                   <div class="h-full bg-indigo-600 transition-all duration-1000" :style="{ width: `${avg.average}%` }"></div>
                </div>
              </div>
            </div>

            <AppCard title="Performance Ledger" :no-padding="true" class="shadow-2xl">
              <!-- Filter Bar -->
              <div class="flex flex-wrap items-center gap-4 border-b border-gray-50 p-6 bg-gray-50/30 dark:border-gray-700 dark:bg-gray-900/30">
                 <select v-model="resultExamFilter" class="rounded-xl border border-gray-100 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-900 outline-none hover:border-primary-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                    <option value="">All Assessment Cycles</option>
                    <option v-for="name in examStore.examNames" :key="name" :value="name">{{ name }}</option>
                 </select>
                 <select v-model="resultSubjectFilter" class="rounded-xl border border-gray-100 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-900 outline-none hover:border-primary-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                    <option value="">All Academic Disciplines</option>
                    <option v-for="sub in examStore.subjects" :key="sub" :value="sub">{{ sub }}</option>
                 </select>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                  <thead>
                    <tr class="bg-gray-50/30 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:bg-gray-900/30">
                      <th class="px-8 py-4">Student Profile</th>
                      <th class="px-8 py-4">Cycle</th>
                      <th class="px-8 py-4">Subject</th>
                      <th class="px-8 py-4 text-right">Raw Score</th>
                      <th class="px-8 py-4 text-center">Achievement</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
                    <tr v-for="r in filteredResults" :key="r.id" class="group hover:bg-emerald-50/20 transition-colors">
                      <td class="px-8 py-5">
                        <div class="flex items-center gap-4">
                          <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-400 to-indigo-500 text-xs font-black text-white shadow-lg">
                            {{ r.student_name.charAt(0) }}
                          </div>
                          <div>
                            <p class="font-black text-gray-900 dark:text-white">{{ r.student_name }}</p>
                            <p class="text-[10px] font-bold text-gray-400 uppercase">{{ r.class_name }}</p>
                          </div>
                        </div>
                      </td>
                      <td class="px-8 py-5 text-xs font-bold text-gray-500 dark:text-gray-400">{{ r.exam_name }}</td>
                      <td class="px-8 py-5 text-xs font-black text-gray-900 dark:text-white uppercase tracking-tighter">{{ r.subject }}</td>
                      <td class="px-8 py-5 text-right font-black text-indigo-600">{{ r.marks_obtained }}<span class="text-gray-300 mx-1">/</span>{{ r.max_marks }}</td>
                      <td class="px-8 py-5">
                         <div class="flex flex-col items-center gap-1">
                            <span :class="['rounded-full px-2 py-0.5 text-[9px] font-black uppercase text-white shadow-md', gradeBackground(r.grade)]">{{ r.grade }}</span>
                            <span class="text-[9px] font-black text-gray-400">{{ Math.round(r.marks_obtained / r.max_marks * 100) }}%</span>
                         </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <EmptyState v-if="!filteredResults.length" title="Data Visualization Silent" message="Complete score entry to unlock deep dive analytics." class="py-16" />
            </AppCard>
          </div>
        </template>

        <!-- Admit Card Registry Tab -->
        <template v-if="activeTab === 'admit'">
          <div class="space-y-6">
            <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
              <div class="flex flex-wrap items-center gap-4">
                <div class="space-y-1">
                  <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest">Academic Block</p>
                  <select v-model="passClassFilter" class="bg-gray-50 text-sm font-black text-gray-900 dark:bg-gray-900 dark:text-white px-4 py-2 rounded-xl outline-none">
                    <option value="">All Blocks</option>
                    <option v-for="cls in studentStore.classes" :key="cls" :value="cls">{{ cls }}</option>
                  </select>
                </div>
                <div class="h-8 w-px bg-gray-100 dark:bg-gray-700"></div>
                <div class="space-y-1">
                   <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest">Target Selection</p>
                   <p class="text-xs font-black text-indigo-600 uppercase">{{ selectedPassIds.length }} Candidates Identified</p>
                </div>
              </div>
              <div class="flex gap-3">
                 <AppButton variant="secondary" size="sm" class="rounded-xl border-none font-black" @click="togglePassSelection">
                    {{ selectedPassIds.length === filteredPassStudents.length ? 'Deselect All' : 'Select All' }}
                 </AppButton>
                 <AppButton variant="primary" size="sm" class="rounded-xl px-8 shadow-xl shadow-indigo-100" @click="printAdmitCards">
                    Print Selected Passes ({{ selectedPassIds.length }})
                 </AppButton>
              </div>
            </div>

            <AppCard title="Candidate Eligibility Matrix" :no-padding="true" class="shadow-2xl overflow-hidden text-left">
              <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                  <thead>
                    <tr class="bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:bg-gray-900/30 text-left">
                      <th class="px-8 py-4">Auth</th>
                      <th class="px-8 py-4">Candidate Identity</th>
                      <th class="px-8 py-4">Placement</th>
                      <th class="px-8 py-4">Identity Hash</th>
                      <th class="px-8 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
                    <tr v-for="s in filteredPassStudents" :key="s.id" class="group hover:bg-indigo-50/30 transition-colors">
                      <td class="px-8 py-5">
                        <input v-model="selectedPassIds" :value="s.id" type="checkbox" class="h-5 w-5 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                      </td>
                      <td class="px-8 py-5">
                         <div class="flex items-center gap-3">
                            <div class="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center font-black text-indigo-600 uppercase">{{ s.name.charAt(0) }}</div>
                            <p class="font-black text-gray-900 dark:text-white">{{ s.name }}</p>
                         </div>
                      </td>
                      <td class="px-8 py-5">
                         <span class="text-xs font-bold text-gray-500 uppercase tracking-tighter">{{ s.class_name }} · {{ s.section }}</span>
                      </td>
                      <td class="px-8 py-5 font-mono text-xs text-gray-400 font-bold italic">{{ s.roll_number }}</td>
                      <td class="px-8 py-5 text-right">
                         <div class="flex items-center justify-end gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                            <div class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            Cleared
                         </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <EmptyState v-if="!filteredPassStudents.length" title="No candidates identified" message="Adjust your filters to reveal candidate records." />
            </AppCard>
          </div>
        </template>

        <!-- Academic Ledger Tab (Marksheets) -->
        <template v-if="activeTab === 'marksheet'">
          <div class="space-y-6 text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
             <div class="h-24 w-24 bg-white shadow-2xl rounded-3xl mx-auto flex items-center justify-center text-4xl mb-6">📜</div>
             <h2 class="text-2xl font-black text-gray-900 tracking-tight">Academic Achievement Ledger</h2>
             <p class="max-w-md mx-auto text-gray-400 font-medium">Issue high-fidelity marksheets for completed assessment cycles. Verify results before finalizing the ledger.</p>
             
             <div class="mt-10 max-w-sm mx-auto space-y-4">
                <select v-model="reportClassFilter" class="w-full bg-white border border-gray-200 rounded-[1.5rem] px-6 py-4 font-black text-sm outline-none shadow-xl shadow-gray-100 dark:bg-gray-800 dark:border-gray-700">
                   <option value="">Select Academic Block</option>
                   <option v-for="cls in studentStore.classes" :key="cls" :value="cls">{{ cls }}</option>
                </select>
                <AppButton :disabled="!reportClassFilter" variant="primary" size="lg" class="w-full rounded-[1.5rem] py-8 text-lg shadow-2xl shadow-indigo-100" @click="printClassMarksheets">
                   Generate Class Bulk Ledger
                </AppButton>
             </div>
          </div>
        </template>
      </div>
    </Transition>

    <!-- BULLETPROOF PRINT ENGINE (TELEPORTED TO BODY AT ROOT) -->
    <Teleport to="body">
       <div v-if="isPrinting" id="academic-print-engine" class="bg-white !p-0 !m-0 fixed inset-0 z-[9999] overflow-y-scroll print:overflow-visible">
          <!-- Admit Card Stream -->
          <div v-if="printType === 'admit'" class="grid grid-cols-2 gap-x-6 gap-y-10 p-10">
             <div v-for="s in printStudents" :key="s.id" class="flex justify-center break-inside-avoid">
                <AdmitCard :student="s" />
             </div>
          </div>
 
          <!-- Marksheet Stream (Large format) -->
          <div v-if="printType === 'marksheet'" class="flex flex-col items-center p-10">
             <div v-for="s in printStudents" :key="s.id" class="break-after-page mb-20 last:mb-0">
                <Marksheet :student="s" :results="examStore.getStudentResults(s.id)" />
             </div>
          </div>
       </div>
    </Teleport>

    <!-- Professional Schedule Modal -->
    <AppModal v-model="showExamModal" title="Schedule Assessment" size="md" class="dark:border dark:border-gray-800">
      <div class="p-2 space-y-6">
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Assessment Identity</label>
          <AppInput v-model="examForm.name" placeholder="e.g. Annual Term Graduation Exam" required class="font-bold" />
        </div>
        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Discipline</label>
            <AppInput v-model="examForm.subject" placeholder="e.g. Advanced Mathematics" required class="font-bold" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Class Block</label>
            <AppInput v-model="examForm.class_name" type="select" required class="font-bold">
              <optgroup label="Primary">
                <option value="Class 6">Class 6</option>
                <option value="Class 7">Class 7</option>
                <option value="Class 8">Class 8</option>
              </optgroup>
              <optgroup label="Secondary">
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
              </optgroup>
            </AppInput>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Session Date</label>
            <AppInput v-model="examForm.date" type="date" required class="font-bold" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Maximum Scale</label>
            <AppInput v-model="examForm.max_marks" type="number" placeholder="100" required class="font-bold" />
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex items-center justify-end gap-4 p-2">
          <AppButton variant="secondary" @click="showExamModal = false" class="border-none hover:bg-gray-100">Dismiss</AppButton>
          <AppButton @click="handleScheduleExam" class="px-8 shadow-xl shadow-primary-100">Establish Schedule</AppButton>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import type { Exam } from '@/types'
import { useExamStore } from '@/stores/exams'
import { useStudentStore } from '@/stores/students'
import { useToastStore } from '@/stores/toast'
import StatCard from '@/components/ui/StatCard.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import AdmitCard from '@/components/common/AdmitCard.vue'
import Marksheet from '@/components/common/Marksheet.vue'

const examStore = useExamStore()
const studentStore = useStudentStore()
const toast = useToastStore()

const activeTab = ref('schedule')
const tabs = [
  { key: 'schedule', label: 'Cycle Schedule' },
  { key: 'marks', label: 'Score Entry' },
  { key: 'admit', label: 'Review Admit Cards' },
  { key: 'marksheet', label: 'Issue Marksheets' },
  { key: 'results', label: 'Excellence Matrix' },
]

// High-fidelity stats
const summaryStats = computed(() => [
  { title: "Assessment Cycles", value: examStore.exams.length, icon: "📋", iconBg: "bg-indigo-50 text-indigo-600" },
  { title: "Scores Recorded", value: examStore.results.length, icon: "🖊️", iconBg: "bg-emerald-50 text-emerald-600" },
  { title: "Verified Subjects", value: examStore.subjects.length, icon: "📚", iconBg: "bg-purple-50 text-purple-600" },
  { title: "Hub Average", value: overallAvg.value + "%", icon: "💎", iconBg: "bg-rose-50 text-rose-600" },
])

const overallAvg = computed(() => {
  if (!examStore.results.length) return 0
  const total = examStore.results.reduce((s, r) => s + (r.marks_obtained / r.max_marks) * 100, 0)
  return Math.round(total / examStore.results.length)
})

// Exam Scheduling
const showExamModal = ref(false)
const examForm = reactive({
  name: '', subject: '', class_name: '', date: '', max_marks: '50', academic_year: '2025-26',
})

function handleScheduleExam() {
  if (!examForm.name || !examForm.subject || !examForm.class_name || !examForm.date) {
    toast.warning('Registry incomplete. Please populate all mandatory fields.')
    return
  }
  examStore.addExam({
    name: examForm.name,
    subject: examForm.subject,
    class_name: examForm.class_name,
    date: examForm.date,
    max_marks: Number(examForm.max_marks) || 100,
    academic_year: examForm.academic_year,
  })
  showExamModal.value = false
  toast.success('Assessment cycle successfully established.')
  Object.assign(examForm, { name: '', subject: '', class_name: '', date: '', max_marks: '100' })
}

// Marks Management
const selectedExamId = ref(0)
const selectedExam = computed(() => examStore.exams.find((e) => e.id === selectedExamId.value) || null)

interface MarksEntry {
  studentId: number
  studentName: string
  rollNumber: string
  className: string
  marks: number
  grade: string
}

const marksEntries = ref<MarksEntry[]>([])

watch(selectedExamId, (id) => {
  if (!id) { marksEntries.value = []; return }
  const exam = examStore.exams.find((e) => e.id === id)
  if (!exam) return

  const classStudents = studentStore.students
    .filter((s) => s.class_name === exam.class_name && s.status === 'active')
    .sort((a, b) => a.roll_number.localeCompare(b.roll_number))

  marksEntries.value = classStudents.map((s) => {
    const existing = examStore.results.find((r) => r.exam_id === id && r.student_id === s.id)
    return {
      studentId: s.id,
      studentName: s.name,
      rollNumber: s.roll_number,
      className: s.class_name,
      marks: existing?.marks_obtained || 0,
      grade: existing?.grade || 'F',
    }
  })
})

function updateMarks(entry: MarksEntry, value: number) {
  if (!selectedExam.value) return
  entry.marks = Math.min(Math.max(0, value || 0), selectedExam.value.max_marks)
  const pct = (entry.marks / selectedExam.value.max_marks) * 100
  entry.grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B+' : pct >= 60 ? 'B' : pct >= 50 ? 'C' : pct >= 40 ? 'D' : 'F'
}

function saveMarks() {
  if (!selectedExamId.value) return
  const entries = marksEntries.value.map((e) => ({
    studentId: e.studentId,
    studentName: e.studentName,
    className: e.className,
    marks: e.marks,
  }))
  examStore.bulkAddResults(selectedExamId.value, entries)
  toast.success('Roster scores permanently committed to registry.')
}

function openMarksEntry(exam: Exam) {
  activeTab.value = 'marks'
  selectedExamId.value = exam.id
}

function viewResults(exam: Exam) {
  activeTab.value = 'results'
  resultExamFilter.value = exam.name
}

// Admit Card Issuance
const passClassFilter = ref('')
const selectedPassIds = ref<number[]>([])

const filteredPassStudents = computed(() => {
  if (!passClassFilter.value) return studentStore.students
  return studentStore.students.filter(s => s.class_name === passClassFilter.value)
})

function togglePassSelection() {
  if (selectedPassIds.value.length === filteredPassStudents.value.length) {
    selectedPassIds.value = []
  } else {
    selectedPassIds.value = filteredPassStudents.value.map(s => s.id)
  }
}

// Marksheet Issuance
const reportClassFilter = ref('')

// "IRONCLAD" PRINT ENGINE STATE
const isPrinting = ref(false)
const printType = ref<'admit' | 'marksheet' | null>(null)
const printStudents = ref<any[]>([])

async function triggerAcademicPrint(type: 'admit' | 'marksheet', ids: number[]) {
  printType.value = type
  printStudents.value = studentStore.students.filter(s => ids.includes(s.id))
  isPrinting.value = true
  
  // Wait for Vue to render the teleported print area and for the browser to paint it
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 400))

  // Use requestAnimationFrame to ensure layout is complete before print
  await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
  
  window.print()
  
  // Cleanup: give the browser a tick after print() returns before removing the DOM
  await nextTick()
  isPrinting.value = false
  printType.value = null
  printStudents.value = []
}

function printAdmitCards() {
  if (!selectedPassIds.value.length) {
    toast.warning('Candidate selection required for admit issuance.')
    return
  }
  triggerAcademicPrint('admit', [...selectedPassIds.value])
}

function printClassMarksheets() {
  const ids = studentStore.students
    .filter(s => s.class_name === reportClassFilter.value)
    .map(s => s.id)
  
  if (!ids.length) {
    toast.warning('No academic records found for this block.')
    return
  }
  triggerAcademicPrint('marksheet', ids)
}

// Analytics Filter
const resultExamFilter = ref('')
const resultSubjectFilter = ref('')

const filteredResults = computed(() => {
  let res = examStore.results
  if (resultExamFilter.value) res = res.filter((r) => r.exam_name === resultExamFilter.value)
  if (resultSubjectFilter.value) res = res.filter((r) => r.subject === resultSubjectFilter.value)
  return res.sort((a, b) => b.marks_obtained - a.marks_obtained)
})

function gradeBackground(grade: string): string {
  if (grade === 'A+' || grade === 'A') return 'bg-emerald-500 text-emerald-100'
  if (grade === 'B+' || grade === 'B') return 'bg-indigo-500 text-indigo-100'
  if (grade === 'C' || grade === 'D') return 'bg-amber-500 text-amber-100'
  return 'bg-rose-500 text-rose-100'
}
</script>

<style>
/* GLOBAL ACADEMIC PRINT PROTOCOL */
@media print {
  /* HIDE EVERYTHING EXCEPT THE TELEPORTED ENGINE */
  #app, 
  header, 
  aside, 
  main,
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
  #academic-print-engine {
    display: block !important;
    visibility: visible !important;
    position: static !important;
    /* Reset all inset values set by Tailwind's inset-0 */
    top: auto !important;
    right: auto !important;
    bottom: auto !important;
    left: auto !important;
    width: 100% !important;
    height: auto !important;
    min-height: unset !important;
    /* Allow full content to flow onto multiple print pages */
    overflow: visible !important;
    z-index: auto !important;
    padding: 0 !important;
    background: white !important;
  }

  .break-inside-avoid {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
  }

  .break-after-page {
    break-after: page !important;
    page-break-after: always !important;
  }

  @page {
    size: A4;
    margin: 10mm;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

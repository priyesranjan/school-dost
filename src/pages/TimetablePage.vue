<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Schedule Logistics Header -->
    <div
      class="relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-xl shadow-gray-100 dark:border dark:border-gray-800 dark:bg-gray-800/50 dark:shadow-none"
    >
      <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div
            class="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:bg-indigo-900/30"
          >
            📅 Academic Logistics
          </div>
          <h1 class="mt-3 text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            Institutional
            <span class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
              >Time Ledger</span
            >
          </h1>
          <p class="mt-1 text-sm font-medium text-gray-400">
            Coordinate classroom resources, faculty allocations, and session timing.
          </p>
        </div>
        <div class="flex items-center gap-4">
          <div v-for="stat in summaryStats" :key="stat.title" class="hidden sm:block text-right">
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">{{ stat.title }}</p>
            <p class="text-xl font-black text-gray-900 dark:text-white">{{ stat.value }}</p>
          </div>
        </div>
      </div>
      <!-- Background Accents -->
      <div
        class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-50/50 blur-3xl dark:bg-indigo-900/10"
      ></div>
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
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <Transition name="fade" mode="out-in">
      <div :key="activeTab" class="w-full">
        <template v-if="activeTab === 'management'">
          <div class="space-y-8">
            <div class="grid grid-cols-1 gap-8 xl:grid-cols-5 items-start">
              <!-- Left Column: Architect & CSV -->
              <div class="xl:col-span-2 space-y-8">
                <AppCard title="Session Architect" class="shadow-2xl overflow-visible">
                  <template #header-actions>
                    <span class="text-[10px] font-black uppercase tracking-widest text-primary-500">New Entry</span>
                  </template>
                  <form @submit.prevent="handleAdd" class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <AppInput v-model="form.class_name" type="select" label="Target Class" required class="font-bold">
                      <option value="">Select class...</option>
                      <option v-for="cls in studentStore.classes" :key="cls" :value="cls">{{ cls }}</option>
                    </AppInput>
                    <AppInput v-model="form.day" type="select" label="Day of Week" required class="font-bold">
                      <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
                    </AppInput>
                    <div class="grid grid-cols-2 gap-4">
                      <AppInput
                        v-model="form.period"
                        label="Slot ID"
                        placeholder="e.g. P1"
                        required
                        class="font-bold"
                      />
                      <AppInput
                        v-model="form.subject"
                        label="Subject Domain"
                        placeholder="Physics"
                        required
                        class="font-bold"
                      />
                    </div>
                    <AppInput v-model="form.teacher" type="select" label="Faculty Member" required class="font-bold">
                      <option value="">Assign teacher...</option>
                      <option v-for="t in staffStore.activeTeachers" :key="t.id" :value="t.name">
                        {{ t.name }} ({{ t.department }})
                      </option>
                    </AppInput>

                    <div class="sm:col-span-2 grid grid-cols-2 gap-6 bg-gray-50/50 p-4 rounded-2xl dark:bg-gray-900/30">
                      <AppInput v-model="form.start_time" type="time" label="Commencement" required />
                      <AppInput v-model="form.end_time" type="time" label="Conclusion" required />
                    </div>

                    <div class="sm:col-span-2 flex items-center justify-between">
                      <label class="flex items-center gap-3 cursor-pointer group">
                        <div
                          class="relative flex h-5 w-5 items-center justify-center rounded-md border-2 border-gray-200 transition-all group-hover:border-primary-400 dark:border-gray-700"
                        >
                          <input
                            v-model="form.send_sms"
                            type="checkbox"
                            class="peer absolute h-full w-full opacity-0"
                          />
                          <div
                            class="h-2 w-2 rounded-sm bg-primary-500 scale-0 transition-transform peer-checked:scale-100"
                          ></div>
                        </div>
                        <span class="text-xs font-bold text-gray-500 group-hover:text-gray-700 transition-colors"
                          >Broadcast update to Guardians via SMS</span
                        >
                      </label>
                      <AppButton type="submit" shadow="large">Deploy Slot</AppButton>
                    </div>
                  </form>
                </AppCard>
                <AppCard title="Bulk Sync Engine" class="shadow-xl">
                  <div class="space-y-6">
                    <div class="rounded-2xl bg-indigo-50/50 p-4 dark:bg-indigo-900/10">
                      <p class="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2">
                        Schema Protocol
                      </p>
                      <code
                        class="text-[9px] block bg-white p-2 rounded-lg border border-indigo-100 dark:bg-gray-900 dark:border-gray-800"
                      >
                        class, day, period, subject, teacher, start, end
                      </code>
                    </div>

                    <div
                      class="group relative flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50/50 py-10 transition-all hover:border-primary-300 hover:bg-white dark:border-gray-800 dark:bg-gray-900/30"
                    >
                      <input
                        ref="csvInputRef"
                        type="file"
                        accept=".csv,text/csv"
                        class="absolute h-full w-full cursor-pointer opacity-0"
                      />
                      <div class="text-3xl mb-2 group-hover:scale-125 transition-transform">📂</div>
                      <p
                        class="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-primary-600"
                      >
                        Universal CSV Upload
                      </p>
                    </div>

                    <div class="space-y-4">
                      <label class="flex items-center gap-3 cursor-pointer group">
                        <div
                          class="relative flex h-5 w-5 items-center justify-center rounded-md border-2 border-gray-100 transition-all group-hover:border-primary-400 dark:border-gray-800"
                        >
                          <input
                            v-model="importSendSms"
                            type="checkbox"
                            class="peer absolute h-full w-full opacity-0"
                          />
                          <div
                            class="h-2 w-2 rounded-sm bg-primary-500 scale-0 transition-transform peer-checked:scale-100"
                          ></div>
                        </div>
                        <span class="text-xs font-bold text-gray-500 group-hover:text-gray-700"
                          >Trigger Genesis SMS Broadast</span
                        >
                      </label>
                      <AppButton class="w-full h-[48px] shadow-xl" @click="handleImportCsv"
                        >Initiate Batch Import</AppButton
                      >
                    </div>

                    <div
                      v-if="importReport"
                      class="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-900/30 dark:bg-emerald-900/10"
                    >
                      <h4 class="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-3">
                        Sync Synopsis
                      </h4>
                      <div class="space-y-1 text-xs font-bold text-emerald-800 dark:text-emerald-400">
                        <p>Allocations Built: {{ importReport.added }}</p>
                        <p v-if="importReport.classConflicts.length" class="text-rose-600 underline">
                          Room Conflicts DETECTED ({{ importReport.classConflicts.length }})
                        </p>
                        <p v-if="importReport.teacherConflicts.length" class="text-rose-600 underline">
                          Faculty Overlaps DETECTED ({{ importReport.teacherConflicts.length }})
                        </p>
                      </div>
                    </div>
                  </div>
                </AppCard>
              </div>

              <!-- Right Column: Live Visual Grid -->
              <div class="xl:col-span-3 space-y-8 sticky top-8">
                <AppCard
                  v-if="form.class_name"
                  title="Real-Time Calendar Sync"
                  :no-padding="true"
                  class="shadow-2xl overflow-hidden border border-indigo-100 dark:border-indigo-900/30"
                >
                  <div class="overflow-x-auto p-4 bg-indigo-50/10 dark:bg-gray-900/10">
                    <table class="w-full text-center border-collapse text-sm">
                      <thead>
                        <tr>
                          <th
                            class="border border-white dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-4 font-black uppercase text-gray-400 tracking-widest text-[10px]"
                          >
                            Day / Session
                          </th>
                          <th
                            v-for="p in formUniquePeriods"
                            :key="p"
                            class="border border-white dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-3 font-black uppercase text-gray-900 dark:text-white tracking-widest text-[10px]"
                          >
                            {{ p }}
                          </th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-white dark:divide-gray-800 bg-white dark:bg-gray-800/20">
                        <tr v-for="day in days" :key="day">
                          <th
                            class="border border-white bg-indigo-50/50 p-3 font-black uppercase tracking-widest text-[10px] text-indigo-700 dark:border-gray-800 dark:bg-indigo-900/20 dark:text-indigo-400 shadow-sm"
                          >
                            {{ day }}
                          </th>
                          <td
                            v-for="p in formUniquePeriods"
                            :key="p"
                            class="border border-gray-50 p-2 dark:border-gray-800/50 transition-colors h-24 align-middle bg-gray-50/30 hover:bg-gray-100/50 dark:bg-gray-900/10 dark:hover:bg-gray-800/40"
                          >
                            <div
                              v-if="getFormGridEntry(day, p)"
                              class="flex flex-col items-center justify-center space-y-1 p-2 w-full h-full rounded-2xl transition-all cursor-pointer group"
                            >
                              <span
                                class="rounded-xl bg-indigo-500 group-hover:bg-indigo-600 px-3 py-1 text-[10px] font-black text-white uppercase break-words text-center w-full shadow-lg shadow-indigo-200 dark:shadow-none"
                                >{{ getFormGridEntry(day, p)?.subject }}</span
                              >
                              <span class="text-[10px] font-bold text-gray-700 dark:text-gray-300 mt-1">{{
                                getFormGridEntry(day, p)?.teacher
                              }}</span>
                              <span
                                class="text-[9px] font-black text-indigo-400 mt-1 uppercase tracking-tighter mix-blend-multiply dark:mix-blend-lighten"
                                >{{ getFormGridEntry(day, p)?.start_time }} -
                                {{ getFormGridEntry(day, p)?.end_time }}</span
                              >
                            </div>
                            <div
                              v-else
                              class="text-gray-300 dark:text-gray-700 text-[10px] font-black uppercase tracking-widest mix-blend-multiply opacity-40"
                            >
                              + Open
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </AppCard>
                <EmptyState
                  v-else
                  title="Visualizer Standby"
                  message="Select an Academic Block inside the Session Architect to instantly trigger the 2D Real-Time Calendar Sync layer."
                  class="bg-gradient-to-br from-indigo-50/30 to-white rounded-[2.5rem] shadow-none py-28 border-2 border-dashed border-indigo-100 dark:bg-gray-800/10 dark:border-gray-800"
                />
              </div>
            </div>

            <!-- Bottom Full Width Registry -->
            <div class="w-full mt-6">
              <AppCard title="Active Schedule Registry" :no-padding="true" class="shadow-2xl overflow-hidden">
                <div
                  class="flex items-center justify-between border-b border-gray-50 bg-gray-50/30 px-8 py-6 dark:border-gray-700 dark:bg-gray-800/30"
                >
                  <div>
                    <h3 class="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">
                      Active Schedule Registry
                    </h3>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                      {{ sortedEntries.length }} Verified Allocations
                    </p>
                  </div>
                </div>
                <div class="overflow-x-auto">
                  <table class="w-full text-left text-sm">
                    <thead>
                      <tr class="bg-gray-50/10 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <th class="px-8 py-4">Placement</th>
                        <th class="px-8 py-4">Temporal Coordinates</th>
                        <th class="px-8 py-4">Curriculum</th>
                        <th class="px-8 py-4">Faculty</th>
                        <th class="px-8 py-4 text-right">Management</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
                      <tr
                        v-for="e in sortedEntries"
                        :key="e.id"
                        class="group transition-all hover:bg-indigo-50/30 dark:hover:bg-indigo-900/5"
                      >
                        <td class="px-8 py-5">
                          <p class="font-black text-gray-900 dark:text-white">{{ e.class_name }}</p>
                          <p class="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{{ e.day }}</p>
                        </td>
                        <td class="px-8 py-5">
                          <div class="flex items-center gap-3">
                            <span
                              class="rounded-lg bg-gray-100 px-2.5 py-1 text-[10px] font-black text-gray-500 dark:bg-gray-800"
                              >{{ e.period }}</span
                            >
                            <span class="text-xs font-bold text-gray-400">{{ e.start_time }} — {{ e.end_time }}</span>
                          </div>
                        </td>
                        <td class="px-8 py-5 font-black text-gray-700 dark:text-gray-300 uppercase tracking-tighter">
                          {{ e.subject }}
                        </td>
                        <td class="px-8 py-5">
                          <div class="flex items-center gap-2">
                            <div
                              class="h-6 w-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-[8px] font-black text-white shadow-md"
                            >
                              {{ e.teacher.charAt(0) }}
                            </div>
                            <span class="text-xs font-bold text-gray-600 dark:text-gray-400">{{ e.teacher }}</span>
                          </div>
                        </td>
                        <td class="px-8 py-5 text-right">
                          <div
                            class="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <button
                              @click="openEdit(e.id)"
                              class="rounded-xl p-2 text-gray-400 hover:bg-white hover:text-indigo-600 shadow-sm border border-transparent hover:border-gray-100 dark:hover:bg-gray-800"
                            >
                              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2.5"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              @click="timetableStore.deleteEntry(e.id)"
                              class="rounded-xl p-2 text-gray-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20"
                            >
                              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2.5"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <EmptyState
                  v-if="!timetableStore.entries.length"
                  title="Timetable Silent"
                  message="Initialize the academic schedule by adding your first slot."
                />
              </AppCard>
            </div>
          </div>
        </template>

        <!-- Live Preview Tab -->
        <template v-if="activeTab === 'preview'">
          <div class="space-y-6">
            <div
              class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700"
            >
              <div class="flex flex-wrap items-center gap-4">
                <div class="space-y-1">
                  <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest">Academic Block</p>
                  <select
                    v-model="previewClass"
                    class="bg-gray-50 text-sm font-black text-gray-900 dark:bg-gray-900 dark:text-white px-4 py-2 rounded-xl outline-none"
                  >
                    <option value="">Select Target Class...</option>
                    <option v-for="cls in studentStore.classes" :key="cls" :value="cls">{{ cls }}</option>
                  </select>
                </div>
              </div>
              <div>
                <AppButton
                  :disabled="!previewClass"
                  variant="primary"
                  size="sm"
                  class="rounded-xl px-8 shadow-xl shadow-indigo-100 max-sm:w-full"
                  @click="triggerPrint"
                >
                  Visualize & Output Ledger
                </AppButton>
              </div>
            </div>

            <AppCard v-if="previewClass" :no-padding="true" class="shadow-2xl overflow-hidden">
              <div class="overflow-x-auto p-4">
                <table class="w-full text-center border-collapse text-sm">
                  <thead>
                    <tr>
                      <th
                        class="border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50 p-4 font-black uppercase text-gray-400 tracking-widest text-[10px]"
                      >
                        Day / Session
                      </th>
                      <th
                        v-for="p in uniquePeriods"
                        :key="p"
                        class="border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50 p-4 font-black uppercase text-gray-900 dark:text-white tracking-widest text-[10px]"
                      >
                        {{ p }}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    <tr v-for="day in days" :key="day">
                      <th
                        class="border border-gray-200 bg-indigo-50/30 p-4 font-black uppercase tracking-widest text-[10px] text-indigo-700 dark:border-gray-700 dark:bg-indigo-900/10 dark:text-indigo-400"
                      >
                        {{ day }}
                      </th>
                      <td
                        v-for="p in uniquePeriods"
                        :key="p"
                        class="border border-gray-200 p-2 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors h-24 align-middle"
                      >
                        <div
                          v-if="getGridEntry(day, p)"
                          class="flex flex-col items-center justify-center space-y-1 p-2 w-full h-full"
                        >
                          <span
                            class="rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-[10px] font-black text-gray-900 dark:text-white uppercase break-words text-center w-full shadow-inner"
                            >{{ getGridEntry(day, p)?.subject }}</span
                          >
                          <span class="text-[10px] font-bold text-gray-500">{{ getGridEntry(day, p)?.teacher }}</span>
                          <span class="text-[9px] font-black text-indigo-400 mt-1 uppercase tracking-tighter"
                            >{{ getGridEntry(day, p)?.start_time }} - {{ getGridEntry(day, p)?.end_time }}</span
                          >
                        </div>
                        <div
                          v-else
                          class="text-gray-200 dark:text-gray-700 text-[10px] font-black uppercase tracking-widest"
                        >
                          Slot Empty
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </AppCard>
            <EmptyState
              v-else
              title="No Target Class Selected"
              message="Choose an academic block to render its timetable grid."
            />
          </div>
        </template>
      </div>
    </Transition>

    <!-- BULLETPROOF PRINT ENGINE (TELEPORTED TO BODY AT ROOT) -->
    <Teleport to="body">
      <div
        id="timetable-print-engine"
        class="bg-white pointer-events-none opacity-0 -z-50 absolute left-0 top-0 w-full print:opacity-100 print:static print:z-auto print:mt-0 print:pt-0"
      >
        <div v-if="previewClass" class="p-10 w-full max-w-5xl mx-auto flex flex-col items-center">
          <div class="mb-8 text-center text-black">
            <h2 class="text-2xl font-black uppercase tracking-widest">Master Time Ledger</h2>
            <h3 class="text-xl font-bold mt-2 uppercase tracking-tighter text-gray-600">
              Class Block: {{ previewClass }}
            </h3>
          </div>
          <table class="w-full text-center border-collapse border-2 border-black text-xs text-black shadow-none">
            <thead>
              <tr>
                <th class="border-2 border-black bg-gray-100 p-4 font-black uppercase tracking-widest text-[10px]">
                  Day / Time
                </th>
                <th
                  v-for="p in uniquePeriods"
                  :key="p"
                  class="border-2 border-black bg-gray-100 p-4 font-black uppercase tracking-widest text-[10px] max-w-[100px]"
                >
                  {{ p }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="day in days" :key="day">
                <th class="border-2 border-black bg-gray-50 p-4 font-black uppercase tracking-widest text-[10px]">
                  {{ day }}
                </th>
                <td
                  v-for="p in uniquePeriods"
                  :key="p"
                  class="border-2 border-black p-2 h-28 max-w-[120px] align-middle"
                >
                  <div
                    v-if="getGridEntry(day, p)"
                    class="flex flex-col items-center space-y-1 h-full w-full justify-center"
                  >
                    <span class="font-black uppercase text-[11px] leading-tight break-words w-full px-1 text-black">{{
                      getGridEntry(day, p)?.subject
                    }}</span>
                    <span class="font-bold text-[10px] break-words w-full text-gray-700">{{
                      getGridEntry(day, p)?.teacher
                    }}</span>
                    <span
                      class="text-[9px] font-black border-t border-gray-300 w-full pt-1 mt-1 uppercase tracking-tighter text-gray-500"
                      >{{ getGridEntry(day, p)?.start_time }} - {{ getGridEntry(day, p)?.end_time }}</span
                    >
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="mt-8 flex justify-between w-full text-[10px] font-black uppercase tracking-widest text-gray-400">
            <span>Generated by System Administrator</span>
            <span>Academic Session: Current</span>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Edit Modal Overhaul -->
    <AppModal v-model="showEditModal" title="Update Session Logistics" size="md">
      <form @submit.prevent="handleUpdate" class="p-2 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <AppInput v-model="editForm.class_name" type="select" label="Target Class" required class="font-bold">
          <option v-for="cls in studentStore.classes" :key="cls" :value="cls">{{ cls }}</option>
        </AppInput>
        <AppInput v-model="editForm.day" type="select" label="Day Assignment" required class="font-bold">
          <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
        </AppInput>
        <AppInput v-model="editForm.period" label="Session ID" required class="font-bold" />
        <AppInput v-model="editForm.subject" label="Subject Domain" required class="font-bold" />
        <AppInput v-model="editForm.teacher" label="Assigned Faculty" required class="font-bold sm:col-span-2" />
        <div class="sm:col-span-2 grid grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-2xl dark:bg-gray-900/30">
          <AppInput v-model="editForm.start_time" type="time" label="Genesis" required />
          <AppInput v-model="editForm.end_time" type="time" label="Termination" required />
        </div>
      </form>
      <template #footer>
        <div class="flex items-center justify-end gap-3 p-2">
          <AppButton variant="secondary" @click="showEditModal = false" class="border-none">Dismiss</AppButton>
          <AppButton @click="handleUpdate" shadow="large">Commit Synchronized Update</AppButton>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useTimetableStore } from '@/stores/timetable'
import { useStudentStore } from '@/stores/students'
import { useSmsStore } from '@/stores/sms'
import { useStaffStore } from '@/stores/staff'
import { useToastStore } from '@/stores/toast'
import StatCard from '@/components/ui/StatCard.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

import { nextTick } from 'vue'

const activeTab = ref('management')
const tabs = [
  { key: 'management', label: 'Management Console' },
  { key: 'preview', label: 'Live Previews' },
]

const formUniquePeriods = computed(() => {
  if (!form.class_name) return []
  const entriesList = timetableStore.entries.filter((e) => e.class_name === form.class_name)
  const periodsSet = new Set(entriesList.map((e) => e.period))
  return Array.from(periodsSet).sort()
})

function getFormGridEntry(day: string, period: string) {
  return timetableStore.entries.find((e) => e.class_name === form.class_name && e.day === day && e.period === period)
}

const previewClass = ref('')
const isPrinting = ref(false)

const uniquePeriods = computed(() => {
  if (!previewClass.value) return []
  const entriesList = timetableStore.entries.filter((e) => e.class_name === previewClass.value)
  const periodsSet = new Set(entriesList.map((e) => e.period))
  return Array.from(periodsSet).sort()
})

function getGridEntry(day: string, period: string) {
  return timetableStore.entries.find((e) => e.class_name === previewClass.value && e.day === day && e.period === period)
}

async function triggerPrint() {
  if (!previewClass.value) return
  isPrinting.value = true

  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 500))

  window.print()

  isPrinting.value = false
}

const timetableStore = useTimetableStore()
const studentStore = useStudentStore()
const staffStore = useStaffStore()
const smsStore = useSmsStore()
const toast = useToastStore()

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const dayIndex: Record<string, number> = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 }

// High-fidelity Summary Stats
const summaryStats = computed(() => [
  { title: 'Total Allocations', value: timetableStore.entries.length },
  { title: 'Active Venues', value: timetableStore.classes.length },
  { title: 'Network Comms', value: smsStore.logs.filter((l) => l.type === 'schedule').length },
])

const form = reactive({
  class_name: '',
  day: 'Monday' as 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday',
  period: 'P1',
  subject: '',
  teacher: '',
  start_time: '09:00',
  end_time: '09:45',
  send_sms: true,
})

const showEditModal = ref(false)
const editingId = ref<number | null>(null)
const csvInputRef = ref<HTMLInputElement | null>(null)
const importSendSms = ref(false)
const importReport = ref<{
  totalRows: number
  added: number
  classConflicts: string[]
  teacherConflicts: string[]
  invalidRows: string[]
} | null>(null)
const editForm = reactive({
  class_name: '',
  day: 'Monday' as 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday',
  period: '',
  subject: '',
  teacher: '',
  start_time: '09:00',
  end_time: '09:45',
})

const sortedEntries = computed(() =>
  [...timetableStore.entries].sort((a, b) => {
    if (a.class_name !== b.class_name) return a.class_name.localeCompare(b.class_name)
    if (a.day !== b.day) return dayIndex[a.day] - dayIndex[b.day]
    return a.period.localeCompare(b.period)
  }),
)

function handleAdd() {
  if (!form.class_name || !form.subject.trim() || !form.teacher.trim() || !form.period.trim()) {
    toast.warning('Logic fragmentation: Please populate mandatory parameters.')
    return
  }

  timetableStore.addEntry(
    {
      class_name: form.class_name,
      day: form.day,
      period: form.period.trim(),
      subject: form.subject.trim(),
      teacher: form.teacher.trim(),
      start_time: form.start_time,
      end_time: form.end_time,
    },
    form.send_sms,
  )

  toast.success('Session temporal lock initiated.')
  form.subject = ''
  form.teacher = ''
}

function openEdit(id: number) {
  const entry = timetableStore.entries.find((e) => e.id === id)
  if (!entry) return
  editingId.value = id
  Object.assign(editForm, {
    class_name: entry.class_name,
    day: entry.day,
    period: entry.period,
    subject: entry.subject,
    teacher: entry.teacher,
    start_time: entry.start_time,
    end_time: entry.end_time,
  })
  showEditModal.value = true
}

function handleUpdate() {
  if (!editingId.value) return
  const ok = timetableStore.updateEntry(editingId.value, {
    class_name: editForm.class_name,
    day: editForm.day,
    period: editForm.period.trim(),
    subject: editForm.subject.trim(),
    teacher: editForm.teacher.trim(),
    start_time: editForm.start_time,
    end_time: editForm.end_time,
  })
  if (ok) {
    toast.success('Ledger revision synchronized.')
    showEditModal.value = false
    editingId.value = null
  }
}

async function handleImportCsv() {
  const file = csvInputRef.value?.files?.[0]
  if (!file) {
    toast.warning('Batch input failure: No file stream detected.')
    return
  }

  try {
    const text = await file.text()
    importReport.value = timetableStore.importFromCsv(text, importSendSms.value)
    if (csvInputRef.value) csvInputRef.value.value = ''
    toast.success('Batch synchronization logic executed.')
  } catch {
    toast.error('Batch integration error: Terminal failure.')
  }
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
  #timetable-print-engine {
    display: block !important;
    visibility: visible !important;
    position: static !important;
    /* Reset inset */
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
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  table {
    page-break-inside: avoid;
  }

  @page {
    size: A4 landscape;
    margin: 10mm;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>

import os

filepath = r'c:\Priyes\ERP-School\src\pages\TimetablePage.vue'
with open(filepath, 'r', encoding='utf-8') as f:
    orig = f.read()

# 1. Start replacement
start_str = """          <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">

      <!-- Slot Configuration Console -->"""

end_str = """    </div>
  </template>
  
  <!-- Live Preview Tab -->"""

start_idx = orig.find(start_str)
end_idx = orig.find(end_str)

if start_idx == -1 or end_idx == -1:
    print(f"Could not find start ({start_idx}) or end bounds ({end_idx}).")
    exit(1)

old_mgmt = orig[start_idx:end_idx]

# Extract AppCard blocks
import re
architect_card = re.search(r'(<AppCard title="Session Architect"[\s\S]*?</AppCard>)', old_mgmt).group(1)
registry_card = re.search(r'(<AppCard :no-padding="true"[\s\S]*?</AppCard>)', old_mgmt).group(1)
import_card = re.search(r'(<AppCard title="Bulk Sync Engine"[\s\S]*?</AppCard>)', old_mgmt).group(1)

new_mgmt = f"""          <div class="space-y-8">
             <div class="grid grid-cols-1 gap-8 xl:grid-cols-5 items-start">
               <!-- Left Column: Architect & CSV -->
               <div class="xl:col-span-2 space-y-8">
                 {architect_card}
                 {import_card}
               </div>

               <!-- Right Column: Live Visual Grid -->
               <div class="xl:col-span-3 space-y-8 sticky top-8">
                 <AppCard v-if="form.class_name" title="Real-Time Calendar Sync" :no-padding="true" class="shadow-2xl overflow-hidden border border-indigo-100 dark:border-indigo-900/30">
                   <div class="overflow-x-auto p-4 bg-indigo-50/10 dark:bg-gray-900/10">
                      <table class="w-full text-center border-collapse text-sm">
                        <thead>
                            <tr>
                              <th class="border border-white dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-4 font-black uppercase text-gray-400 tracking-widest text-[10px]">Day / Session</th>
                              <th v-for="p in formUniquePeriods" :key="p" class="border border-white dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-3 font-black uppercase text-gray-900 dark:text-white tracking-widest text-[10px]">
                                {{{{ p }}}}
                              </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-white dark:divide-gray-800 bg-white dark:bg-gray-800/20">
                            <tr v-for="day in days" :key="day">
                              <th class="border border-white bg-indigo-50/50 p-3 font-black uppercase tracking-widest text-[10px] text-indigo-700 dark:border-gray-800 dark:bg-indigo-900/20 dark:text-indigo-400 shadow-sm">
                                  {{{{ day }}}}
                              </th>
                              <td v-for="p in formUniquePeriods" :key="p" class="border border-gray-50 p-2 dark:border-gray-800/50 transition-colors h-24 align-middle bg-gray-50/30 hover:bg-gray-100/50 dark:bg-gray-900/10 dark:hover:bg-gray-800/40">
                                  <div v-if="getFormGridEntry(day, p)" class="flex flex-col items-center justify-center space-y-1 p-2 w-full h-full rounded-2xl transition-all cursor-pointer group">
                                    <span class="rounded-xl bg-indigo-500 group-hover:bg-indigo-600 px-3 py-1 text-[10px] font-black text-white uppercase break-words text-center w-full shadow-lg shadow-indigo-200 dark:shadow-none">{{{{ getFormGridEntry(day, p)?.subject }}}}</span>
                                    <span class="text-[10px] font-bold text-gray-700 dark:text-gray-300 mt-1">{{{{ getFormGridEntry(day, p)?.teacher }}}}</span>
                                    <span class="text-[9px] font-black text-indigo-400 mt-1 uppercase tracking-tighter mix-blend-multiply dark:mix-blend-lighten">{{{{ getFormGridEntry(day, p)?.start_time }}}} - {{{{ getFormGridEntry(day, p)?.end_time }}}}</span>
                                  </div>
                                  <div v-else class="text-gray-300 dark:text-gray-700 text-[10px] font-black uppercase tracking-widest mix-blend-multiply opacity-40">+ Open</div>
                              </td>
                            </tr>
                        </tbody>
                      </table>
                   </div>
                 </AppCard>
                 <EmptyState v-else title="Visualizer Standby" message="Select an Academic Block inside the Session Architect to instantly trigger the 2D Real-Time Calendar Sync layer." class="bg-gradient-to-br from-indigo-50/30 to-white rounded-[2.5rem] shadow-none py-28 border-2 border-dashed border-indigo-100 dark:bg-gray-800/10 dark:border-gray-800" />
               </div>
             </div>

             <!-- Bottom Full Width Registry -->
             <div class="w-full mt-6">
                {registry_card.replace('<AppCard :no-padding="true"', '<AppCard title="Active Schedule Registry" :no-padding="true"')}
             </div>
"""

orig = orig.replace(old_mgmt, new_mgmt)

script_vars = """
const formUniquePeriods = computed(() => {
  if (!form.class_name) return []
  const entriesList = timetableStore.entries.filter(e => e.class_name === form.class_name)
  const periodsSet = new Set(entriesList.map(e => e.period))
  return Array.from(periodsSet).sort()
})

function getFormGridEntry(day: string, period: string) {
  return timetableStore.entries.find(e => e.class_name === form.class_name && e.day === day && e.period === period)
}
"""

if "const formUniquePeriods" not in orig:
    orig = orig.replace('const previewClass = ref(\'\')', script_vars + '\nconst previewClass = ref(\'\')')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(orig)

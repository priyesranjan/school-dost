"""
Apply ALL StudentDetailPage.vue fixes in one clean pass:
1. Add h to vue import
2. Replace FormField template string with h() render function
3. Initialize form with all fields pre-declared (fix Vue reactivity)
4. Fix onMounted to populate form after fetch
5. Fix watch to not gatekeep on editMode
6. Fix startEdit to rebuild form before entering edit mode
"""

with open(r'c:\Priyes\ERP-School\src\pages\StudentDetailPage.vue', 'r', encoding='utf-8') as f:
    content = f.read()

# ─── Fix 1: Add h to import ─────────────────────────────────────────────────
content = content.replace(
    "import { ref, computed, reactive, watch, onMounted } from 'vue'",
    "import { ref, computed, reactive, watch, onMounted, h } from 'vue'"
)

# ─── Fix 2: Replace FormField template string with h() render fn ─────────────
old_ff_start = "// ====================\n// FormField Inline Component\n// ===================="
new_ff = r"""// ====================
// FormField — uses h() render function (NO template: string)
// Template strings require Vue runtime compiler, excluded from Vite ESM builds.
// ====================
const FormField = {
  name: 'FormField',
  props: {
    label: String,
    modelValue: [String, Number],
    value: String,
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
          ...(props.options || []).map((o: any) => h('option', { value: o.value }, o.label)),
        ]
        inputEl = h(
          'select',
          {
            value: props.modelValue,
            class: 'w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white',
            onChange: (e: Event) => emit('update:modelValue', (e.target as HTMLSelectElement).value),
          },
          optionEls,
        )
      } else {
        inputEl = h('input', {
          type: props.type || 'text',
          value: props.modelValue ?? '',
          class: 'w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white',
          onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value),
        })
      }
      return h('div', [labelEl, inputEl])
    }
  },
}"""

# Find and replace the entire old FormField block
import re
old_ff_pattern = re.compile(
    r'// ====================\s*\n// FormField Inline Component\s*\n// ====================\s*\nconst FormField = \{.*?\n\}',
    re.DOTALL
)
if old_ff_pattern.search(content):
    content = old_ff_pattern.sub(new_ff, content)
    print("OK: FormField replaced")
else:
    print("WARN: FormField pattern not found, trying alternate...")
    # fallback: find by const FormField = { ... template: `...` }
    alt = re.compile(r'const FormField = \{.*?template:.*?`,\s*\}', re.DOTALL)
    if alt.search(content):
        content = alt.sub(new_ff, content)
        print("OK: FormField replaced via fallback")
    else:
        print("ERROR: Could not match FormField block!")

# ─── Fix 3: Initialize form with ALL fields pre-declared ─────────────────────
old_form_init = "const form = reactive<Record<string, any>>(student.value ? buildFormFromStudent(student.value) : {})"
new_form_init = """// ALL fields MUST be pre-declared so Vue 3 tracks them from the start.
// If form starts as reactive({}), Object.assign updates won't trigger re-renders.
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
  current_address: '', current_city: '', current_state: '', current_pincode: '', current_country: 'India',
  permanent_address: '', permanent_city: '', permanent_state: '', permanent_pincode: '', permanent_country: 'India',
  same_as_current: false,
  previous_school: '', previous_class: '', tc_number: '',
  transport_mode: '', bus_route: '', hostel_name: '',
  medical_conditions: '', allergies: '',
  emergency_contact_name: '', emergency_contact_phone: '', emergency_relation: '',
  bank_name: '', bank_account_no: '', ifsc_code: '',
  scholarship_name: '', scholarship_amount: 0,
  guardian_contacts: [] as GuardianContactForm[],
  additional_details: [] as AdditionalDetailForm[],
  notes: '', signature_url: '',
})"""

if old_form_init in content:
    content = content.replace(old_form_init, new_form_init)
    print("OK: form initialization fixed")
else:
    print("WARN: form init pattern not found (may already be fixed)")

# ─── Fix 4: Fix onMounted ───────────────────────────────────────────────────
old_onmounted = """onMounted(async () => {
  if (!student.value) {
    const fetched = await studentStore.fetchStudentById(studentId.value)
    if (fetched && !studentStore.students.find((s) => s.id === fetched.id)) {
      studentStore.students.push(fetched)
    }
  }
})"""
new_onmounted = """onMounted(async () => {
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
})"""
if old_onmounted in content:
    content = content.replace(old_onmounted, new_onmounted)
    print("OK: onMounted fixed")
else:
    print("WARN: onMounted pattern not found")

# ─── Fix 5: Fix watch to not block on editMode ──────────────────────────────
old_watch = """watch(
  student,
  (s) => {
    if (s && !editMode.value) {
      Object.assign(form, buildFormFromStudent(s))
    }
  },
  { immediate: true },
)"""
new_watch = """watch(
  student,
  (s) => {
    if (s && !saving.value) {
      Object.assign(form, buildFormFromStudent(s))
    }
  },
  { immediate: true },
)"""
if old_watch in content:
    content = content.replace(old_watch, new_watch)
    print("OK: watch fixed")
else:
    print("WARN: watch pattern not found")

# ─── Fix 6: Fix startEdit to rebuild form first ──────────────────────────────
old_start_edit = """function startEdit() {
  editMode.value = true
}"""
new_start_edit = """function startEdit() {
  if (student.value) Object.assign(form, buildFormFromStudent(student.value))
  editMode.value = true
}"""
if old_start_edit in content:
    content = content.replace(old_start_edit, new_start_edit)
    print("OK: startEdit fixed")
else:
    print("WARN: startEdit pattern not found")

# ─── Save ────────────────────────────────────────────────────────────────────
with open(r'c:\Priyes\ERP-School\src\pages\StudentDetailPage.vue', 'w', encoding='utf-8') as f:
    f.write(content)

print("\nALL DONE. Verification:")
print("  template: string present?", "template: `" in content)
print("  h imported?", ", h }" in content or ", h," in content)
print("  form pre-declared?", "same_as_current: false" in content)
print("  startEdit rebuilds?", "buildFormFromStudent(student.value)" in content and "startEdit" in content)

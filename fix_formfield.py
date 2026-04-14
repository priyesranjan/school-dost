import re

with open(r'c:\Priyes\ERP-School\src\pages\StudentDetailPage.vue', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add h to the vue import
old_import = "import { ref, computed, reactive, watch, onMounted } from 'vue'"
new_import = "import { ref, computed, reactive, watch, onMounted, h } from 'vue'"
if old_import in content:
    content = content.replace(old_import, new_import)
    print('Import updated: h added')
elif new_import in content:
    print('Import already has h')
else:
    print('WARNING: Could not find vue import line')

# 2. Replace the entire FormField block using regex
# Match from "const FormField = {" to closing "}" followed by blank line
old_pattern = re.compile(
    r'// ====================\s*\n// FormField Inline Component\s*\n// ====================\s*\n'
    r'const FormField = \{.*?template:.*?\},?\s*\}',
    re.DOTALL
)

new_formfield = '''// ====================
// FormField Inline Component — uses h() render fn (no template string)
// Template strings need Vue runtime compiler which is not in Vite ESM builds.
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

      let inputEl
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
            h('option', { key: o.value, value: o.value }, o.label),
          ),
        ]
        inputEl = h(
          'select',
          {
            value: props.modelValue,
            class:
              'w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white',
            onChange: (e: Event) =>
              emit('update:modelValue', (e.target as HTMLSelectElement).value),
          },
          optionEls,
        )
      } else {
        inputEl = h('input', {
          type: props.type || 'text',
          value: props.modelValue ?? '',
          class:
            'w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white',
          onInput: (e: Event) =>
            emit('update:modelValue', (e.target as HTMLInputElement).value),
        })
      }

      return h('div', [labelEl, inputEl])
    }
  },
}'''

match = old_pattern.search(content)
if match:
    content = content[:match.start()] + new_formfield + content[match.end():]
    print('FormField block replaced successfully')
else:
    # Fallback: try simpler pattern
    simple_pattern = re.compile(r'const FormField = \{.*?template:.*?`,\s*\}', re.DOTALL)
    match2 = simple_pattern.search(content)
    if match2:
        content = content[:match2.start()] + new_formfield + content[match2.end():]
        print('FormField replaced via fallback pattern')
    else:
        print('ERROR: Could not match FormField block')
        idx = content.find('const FormField')
        print('FormField found at index:', idx)
        print('Snippet:', repr(content[idx:idx+300]) if idx != -1 else 'NOT FOUND')

with open(r'c:\Priyes\ERP-School\src\pages\StudentDetailPage.vue', 'w', encoding='utf-8') as f:
    f.write(content)
print('File saved.')

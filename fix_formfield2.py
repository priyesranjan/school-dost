"""
Fix StudentDetailPage.vue:
1. Add `h` to the vue import
2. Replace the FormField `template: \`...\`` with a render function using h()

This script finds the exact line ranges by searching for known marker lines.
"""

with open(r'c:\Priyes\ERP-School\src\pages\StudentDetailPage.vue', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# ─── Fix 1: add h to import ─────────────────────────────────────────────────
for i, line in enumerate(lines):
    if "import { ref, computed, reactive, watch, onMounted } from 'vue'" in line:
        lines[i] = line.replace(
            "import { ref, computed, reactive, watch, onMounted } from 'vue'",
            "import { ref, computed, reactive, watch, onMounted, h } from 'vue'"
        )
        print(f"✓ Import fixed at line {i+1}")
        break
else:
    # Already has h?
    for i, line in enumerate(lines):
        if "from 'vue'" in line and 'import' in line:
            print(f"Vue import found at line {i+1}: {line.strip()}")
            if ', h }' not in line and ', h,' not in line:
                lines[i] = line.replace("} from 'vue'", ", h } from 'vue'")
                print(f"✓ Added h to existing import at line {i+1}")
            break

# ─── Fix 2: replace FormField ────────────────────────────────────────────────
# Find start: "const FormField = {"
# Find end:   the closing "}," that ends the component object (after template string)

start_line = None
end_line = None

for i, line in enumerate(lines):
    if 'const FormField = {' in line and start_line is None:
        start_line = i
    if start_line is not None and i > start_line:
        # The old template closes with:  `  `,\n  }\n
        # Look for the line that is just "}" or "}," AFTER we've seen "template:"
        stripped = line.strip()
        if stripped in ('}', '},'):
            end_line = i
            break

if start_line is None or end_line is None:
    print(f"ERROR: Could not find FormField block. start={start_line} end={end_line}")
    for i, l in enumerate(lines[1215:1250], start=1216):
        print(f"{i}: {l.rstrip()}")
else:
    print(f"✓ FormField block found: lines {start_line+1}–{end_line+1}")
    print(f"  Start: {lines[start_line].rstrip()}")
    print(f"  End:   {lines[end_line].rstrip()}")

    new_block = [
        '// ====================\n',
        '// FormField Inline Component — uses h() render fn, NOT template string\n',
        '// Template strings require Vue runtime compiler, which is excluded from\n',
        '// Vite ESM builds. Always use h() for inline components in .vue files.\n',
        '// ====================\n',
        'const FormField = {\n',
        "  name: 'FormField',\n",
        '  props: {\n',
        '    label: String,\n',
        '    modelValue: [String, Number],\n',
        '    value: String,\n',
        '    edit: Boolean,\n',
        "    type: { type: String, default: 'text' },\n",
        '    options: { type: Array as () => { label: string; value: string }[], default: () => [] },\n',
        '  },\n',
        "  emits: ['update:modelValue'],\n",
        '  setup(props: any, { emit }: any) {\n',
        '    return () => {\n',
        '      const labelEl = h(\n',
        "        'label',\n",
        "        { class: 'mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400' },\n",
        '        props.label,\n',
        '      )\n',
        '\n',
        '      let inputEl\n',
        '      if (!props.edit) {\n',
        '        inputEl = h(\n',
        "          'div',\n",
        "          { class: 'min-h-[34px] rounded border border-gray-100 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white' },\n",
        "          props.value || '-',\n",
        '        )\n',
        "      } else if (props.type === 'select') {\n",
        '        const optionEls = [\n',
        "          h('option', { value: '' }, '-- Select --'),\n",
        '          ...(props.options || []).map((o: any) =>\n',
        "            h('option', { key: o.value, value: o.value }, o.label),\n",
        '          ),\n',
        '        ]\n',
        '        inputEl = h(\n',
        "          'select',\n",
        '          {\n',
        '            value: props.modelValue,\n',
        "            class: 'w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white',\n",
        '            onChange: (e: Event) =>\n',
        '              emit(\'update:modelValue\', (e.target as HTMLSelectElement).value),\n',
        '          },\n',
        '          optionEls,\n',
        '        )\n',
        '      } else {\n',
        "        inputEl = h('input', {\n",
        "          type: props.type || 'text',\n",
        "          value: props.modelValue ?? '',\n",
        "          class: 'w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white',\n",
        '          onInput: (e: Event) =>\n',
        "            emit('update:modelValue', (e.target as HTMLInputElement).value),\n",
        '        })\n',
        '      }\n',
        '\n',
        '      return h(\'div\', [labelEl, inputEl])\n',
        '    }\n',
        '  },\n',
        '}\n',
    ]

    # Also remove the section comment lines just before "const FormField"
    # (lines like "// =====\n// FormField Inline Component\n// =====\n")
    actual_start = start_line
    for j in range(start_line - 1, max(start_line - 5, 0), -1):
        if lines[j].strip().startswith('//'):
            actual_start = j
        else:
            break

    lines = lines[:actual_start] + new_block + lines[end_line + 1:]
    print(f"✓ FormField replaced (was lines {actual_start+1}–{end_line+1})")

with open(r'c:\Priyes\ERP-School\src\pages\StudentDetailPage.vue', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('✓ File saved successfully')

# Verify
with open(r'c:\Priyes\ERP-School\src\pages\StudentDetailPage.vue', 'r', encoding='utf-8') as f:
    verify = f.read()

if 'template: `' in verify:
    print('WARNING: template string still found in file!')
else:
    print('✓ Verified: no template strings remain in FormField')

if "h } from 'vue'" in verify or ", h," in verify:
    print('✓ Verified: h is imported')
else:
    print('WARNING: h not found in imports')

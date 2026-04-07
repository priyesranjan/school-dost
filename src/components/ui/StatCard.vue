<template>
  <div class="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 animate-fade-in-up">
    <!-- Decorative background pulse -->
    <div :class="['absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10 blur-2xl transition-all duration-500 group-hover:scale-150', iconBg]"></div>
    
    <div class="relative flex items-center justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{{ title }}</p>
        <div class="mt-1 flex items-baseline gap-2">
          <p :class="['text-3xl font-extrabold tracking-tight', valueColor, valueColor === 'text-gray-900' ? 'dark:text-white' : '']">
            {{ displayValue }}
          </p>
        </div>
        <p v-if="subtitle" class="mt-1 text-xs font-medium text-gray-400 dark:text-gray-500">{{ subtitle }}</p>
      </div>
      
      <div :class="['flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner transition-transform duration-500 group-hover:rotate-12', iconBg]">
        <slot name="icon">
          <span class="text-2xl transform transition-transform duration-300 group-hover:scale-110">{{ icon }}</span>
        </slot>
      </div>
    </div>
    
    <div v-if="trend !== undefined" class="relative mt-4 flex items-center gap-2">
      <div :class="['flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold', trend >= 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400']">
        <span>{{ trend >= 0 ? '↑' : '↓' }}</span>
        <span>{{ Math.abs(trend) }}%</span>
      </div>
      <span class="text-[10px] font-medium text-gray-400 dark:text-gray-500">vs last month</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  title: string
  value: number | string
  subtitle?: string
  icon?: string
  iconBg?: string
  valueColor?: string
  trend?: number
  isCurrency?: boolean
}>(), {
  icon: '📊',
  iconBg: 'bg-blue-50',
  valueColor: 'text-gray-900',
  isCurrency: false,
})

const displayValue = computed(() => {
  if (props.isCurrency && typeof props.value === 'number') {
    return '₹' + props.value.toLocaleString('en-IN')
  }
  if (typeof props.value === 'number') {
    return props.value.toLocaleString('en-IN')
  }
  return props.value
})
</script>

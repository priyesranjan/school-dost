<template>
  <qrcode-vue :value="value" :size="size" level="H" />
</template>

<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'

defineProps({
  value: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    default: 100,
  },
})
</script>

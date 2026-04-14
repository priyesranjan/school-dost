<template>
  <div class="min-h-screen">
    <slot />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import ToastContainer from '@/components/ui/ToastContainer.vue'
</script>

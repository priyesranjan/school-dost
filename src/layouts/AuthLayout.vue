<template>
  <div class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-950 p-4">
    <!-- Premium Background Decor -->
    <div class="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-primary-100/50 blur-3xl dark:bg-primary-900/20 animate-hover-pulse"></div>
    <div class="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-purple-100/50 blur-3xl dark:bg-purple-900/20"></div>
    
    <div class="relative z-10 w-full max-w-md animate-fade-in-up">
      <slot />
      
      <div class="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest">
        <router-link to="/parent-portal" class="text-gray-400 transition-colors hover:text-primary-600 dark:hover:text-primary-400">
          Parent Portal
        </router-link>
        <span class="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
        <router-link to="/verify-certificate" class="text-gray-400 transition-colors hover:text-primary-600 dark:hover:text-primary-400">
          Verify Certificate
        </router-link>
      </div>
    </div>
  </div>
</template>

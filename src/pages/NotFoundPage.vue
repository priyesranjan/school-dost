<template>
  <div class="flex h-full items-center justify-center">
    <div class="text-center">
      <p class="text-7xl font-bold text-gray-200 dark:text-gray-700">404</p>
      <h1 class="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">Page Not Found</h1>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">The page you're looking for doesn't exist or has been moved.</p>
      <router-link
        to="/"
        class="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        Back to Dashboard
      </router-link>
    </div>
  </div>
</template>

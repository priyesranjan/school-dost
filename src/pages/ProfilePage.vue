<template>
  <div class="mx-auto max-w-4xl space-y-10 animate-fade-in-up">
    <!-- Premium Biometric Identity Header -->
    <div
      class="relative overflow-hidden rounded-[2.5rem] bg-white p-1 dark:bg-gray-800 shadow-2xl shadow-gray-200/50 border border-gray-100 dark:border-gray-700 dark:shadow-none"
    >
      <div class="absolute inset-x-0 top-0 h-48 bg-gradient-to-br from-primary-600 via-indigo-600 to-purple-700">
        <div
          class="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,1),transparent)]"
        ></div>
        <!-- Decorative grid -->
        <div
          class="absolute inset-0 opacity-10"
          style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 20px 20px"
        ></div>
      </div>

      <div class="relative z-10 px-10 pt-28 pb-10 flex flex-col md:flex-row items-center gap-10 md:items-end">
        <div class="group relative">
          <div
            class="h-40 w-40 overflow-hidden rounded-[2rem] border-8 border-white dark:border-gray-800 bg-white shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <img
              v-if="auth.user?.profile_photo_url"
              :src="auth.user.profile_photo_url"
              alt="Identity Avatar"
              class="h-full w-full object-cover"
            />
            <div
              v-else
              class="flex h-full w-full items-center justify-center text-5xl font-black text-primary-700 bg-gradient-to-br from-primary-50 to-indigo-50"
            >
              {{ auth.user?.name?.charAt(0) || 'U' }}
            </div>
          </div>
          <!-- Photo Sync Trigger -->
          <label
            class="absolute -bottom-2 -right-2 cursor-pointer rounded-2xl bg-white p-3 text-primary-600 shadow-xl border border-gray-100 hover:bg-primary-50 transition-all hover:-translate-y-1"
          >
            <input type="file" class="hidden" accept="image/*" @change="handleProfilePhotoUpload" />
            <svg v-if="!uploadingPhoto" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div
              v-else
              class="h-6 w-6 animate-spin rounded-full border-3 border-primary-600 border-t-transparent"
            ></div>
          </label>
        </div>

        <div class="text-center md:text-left flex-1 space-y-3">
          <div class="flex flex-col md:flex-row md:items-center gap-4">
            <h2 class="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{{ auth.user?.name }}</h2>
            <div
              :class="[
                'px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm',
                roleColorStyles(auth.user?.role || ''),
              ]"
            >
              {{ auth.user?.role }} Access Level
            </div>
          </div>
          <p
            class="text-sm font-bold text-gray-400 flex items-center justify-center md:justify-start gap-3 uppercase tracking-widest"
          >
            <span
              class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-200 animate-pulse"
            ></span>
            System Integrity Verified · UID: 8820-{{ auth.user?.role?.charAt(0).toUpperCase() }}
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <!-- Logic & Security Col -->
      <div class="lg:col-span-2 space-y-10">
        <!-- Identity Protocol -->
        <AppCard title="Identity Protocol" :hover="true" class="border-none shadow-2xl">
          <form @submit.prevent="handleUpdateProfile" class="space-y-8 p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-2 md:col-span-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400"
                  >Formal Legal Identity</label
                >
                <AppInput v-model="profileForm.name" placeholder="Johnathan Doe" class="font-black text-lg" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Communication Node</label>
                <AppInput
                  v-model="profileForm.email"
                  type="email"
                  placeholder="node@institutional.edu"
                  class="font-bold"
                />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Secure Direct Line</label>
                <AppInput v-model="profileForm.phone" type="tel" placeholder="+91 00000 00000" class="font-bold" />
              </div>
            </div>
            <div class="flex justify-end pt-4">
              <AppButton type="submit" class="px-10 h-[52px] shadow-2xl shadow-primary-200"
                >Sync Master Profile</AppButton
              >
            </div>
          </form>
        </AppCard>

        <!-- Access Key Rotation -->
        <AppCard title="Credential Rotation" class="border-none shadow-2xl overflow-hidden">
          <template #header-actions>
            <span class="text-[10px] font-black text-rose-500 uppercase tracking-widest">Critical Security</span>
          </template>
          <form @submit.prevent="handleChangePassword" class="space-y-8 p-4">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Existing Auth String</label>
              <AppInput
                v-model="passwordForm.current"
                type="password"
                placeholder="••••••••••••"
                :error="pwErrors.current"
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/50 p-6 rounded-3xl dark:bg-gray-900/30">
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">New Secret Key</label>
                <AppInput
                  v-model="passwordForm.newPw"
                  type="password"
                  placeholder="••••••••••••"
                  :error="pwErrors.newPw"
                />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Verify Secret</label>
                <AppInput
                  v-model="passwordForm.confirm"
                  type="password"
                  placeholder="••••••••••••"
                  :error="pwErrors.confirm"
                />
              </div>
            </div>
            <div class="flex justify-end pt-2">
              <AppButton
                type="submit"
                variant="secondary"
                class="border-none bg-gray-100 font-black text-gray-600 hover:bg-gray-200"
                >Rotate Access Keys</AppButton
              >
            </div>
          </form>
        </AppCard>
      </div>

      <!-- Oversight & Demo Column -->
      <div class="space-y-10">
        <!-- Session State -->
        <div class="bg-gradient-to-br from-gray-900 to-black p-8 rounded-[2.5rem] text-white shadow-2xl">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-[10px] font-black uppercase tracking-widest text-gray-400">Session Status</h3>
            <div class="flex h-3 w-3 items-center justify-center">
              <div class="absolute h-3 w-3 rounded-full bg-emerald-500 animate-ping opacity-20"></div>
              <div class="h-2 w-2 rounded-full bg-emerald-500"></div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p class="text-[9px] font-black text-gray-500 uppercase tracking-tighter mb-1">Active Address</p>
              <p class="text-xs font-mono truncate">IPV6::A4F2:9912:00X1</p>
            </div>
            <AppButton
              variant="danger"
              @click="auth.logout()"
              class="w-full h-[52px] bg-rose-600 border-none shadow-2xl shadow-rose-900/40 font-black tracking-widest uppercase text-xs"
            >
              Terminate Access
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { r2StorageService } from '@/services/r2StorageService'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'

const auth = useAuthStore()
const toast = useToastStore()
const uploadingPhoto = ref(false)

const profileForm = reactive({
  name: auth.user?.name || '',
  email: auth.user?.email || 'admin@school-erp.io',
  phone: '9988776655',
})

const passwordForm = reactive({
  current: '',
  newPw: '',
  confirm: '',
})

const pwErrors = reactive({ current: '', newPw: '', confirm: '' })

function handleUpdateProfile() {
  if (profileForm.name.trim()) {
    if (auth.user) {
      auth.user.name = profileForm.name.trim()
      localStorage.setItem('auth_user', JSON.stringify(auth.user))
    }
    toast.success('Identity synchronization successful.')
  }
}

function handleChangePassword() {
  pwErrors.current = ''
  pwErrors.newPw = ''
  pwErrors.confirm = ''

  if (!passwordForm.current) {
    pwErrors.current = 'Authentication required.'
    return
  }
  if (!passwordForm.newPw || passwordForm.newPw.length < 6) {
    pwErrors.newPw = 'Entropy insufficient (Min 6).'
    return
  }
  if (passwordForm.newPw !== passwordForm.confirm) {
    pwErrors.confirm = 'Sequence mismatch.'
    return
  }

  toast.success('Credential rotation complete.')
  passwordForm.current = ''
  passwordForm.newPw = ''
  passwordForm.confirm = ''
}

async function handleProfilePhotoUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file || !auth.user) return

  if (!file.type.startsWith('image/')) {
    toast.warning('Invalid stream: Image required.')
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    toast.warning('Payload error: Max 2MB.')
    return
  }

  uploadingPhoto.value = true
  try {
    const photoUrl = await r2StorageService.uploadProfilePhoto(file, 0)
    auth.user.profile_photo_url = photoUrl
    localStorage.setItem('auth_user', JSON.stringify(auth.user))
    toast.success('Profile optics updated.')
  } catch {
    toast.error('Optics synchronization failed.')
  } finally {
    uploadingPhoto.value = false
    target.value = ''
  }
}

function roleColorStyles(role: string) {
  const map: Record<string, string> = {
    admin: 'bg-indigo-50 border-indigo-100 text-indigo-600',
    accountant: 'bg-emerald-50 border-emerald-100 text-emerald-600',
    teacher: 'bg-rose-50 border-rose-100 text-rose-600',
    receptionist: 'bg-amber-50 border-amber-100 text-amber-600',
    student: 'bg-blue-50 border-blue-100 text-blue-600',
    parent: 'bg-teal-50 border-teal-100 text-teal-600',
  }
  return map[role.toLowerCase()] || 'bg-gray-50 border-gray-100 text-gray-600'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 class="text-xl font-black text-white">All Institutions</h3>
        <p class="text-xs text-gray-500">{{ tenantsStore.tenants.length }} institutions onboarded</p>
      </div>
      <div class="flex items-center gap-3">
        <input
          v-model="search"
          type="text"
          placeholder="Search institutions..."
          class="rounded-xl border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
        />
        <router-link
          to="/superadmin/onboard"
          class="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all"
        >
          + Onboard
        </router-link>
      </div>
    </div>

    <div
      v-if="loadMessage"
      class="rounded-2xl border px-5 py-3 text-xs font-bold"
      :class="
        tenantsStore.tenants.length > 0
          ? 'border-amber-500/20 bg-amber-500/5 text-amber-300'
          : 'border-red-500/20 bg-red-500/5 text-red-300'
      "
    >
      {{ loadMessage }}
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-3xl border border-gray-800 bg-gray-900/50">
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="border-b border-gray-800 bg-gray-800/30">
            <th class="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Institution</th>
            <th class="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Type</th>
            <th class="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Location</th>
            <th class="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Admin</th>
            <th class="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Plan</th>
            <th class="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Status</th>
            <th class="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Students</th>
            <th class="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-800/50">
          <tr v-for="t in filteredTenants" :key="t.id" class="transition-colors hover:bg-gray-800/30">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-700/50 text-sm font-black text-white"
                >
                  {{ t.name.charAt(0) }}
                </div>
                <div>
                  <p class="font-bold text-white">{{ t.name }}</p>
                  <p class="text-[10px] text-gray-500">{{ t.slug }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span
                class="rounded-lg bg-gray-800 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-gray-400"
                >{{ t.type }}</span
              >
            </td>
            <td class="px-6 py-4 text-gray-400">{{ t.city }}, {{ t.state }}</td>
            <td class="px-6 py-4">
              <p class="text-sm text-gray-300">{{ t.admin_name }}</p>
              <p class="text-[10px] text-gray-500">{{ t.admin_email }}</p>
            </td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest',
                  t.subscription_plan === 'premium'
                    ? 'bg-violet-500/10 text-violet-400'
                    : t.subscription_plan === 'enterprise'
                      ? 'bg-fuchsia-500/10 text-fuchsia-400'
                    : t.subscription_plan === 'standard'
                      ? 'bg-blue-500/10 text-blue-400'
                      : t.subscription_plan === 'basic'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-amber-500/10 text-amber-400',
                ]"
                >{{ t.subscription_plan }}</span
              >
            </td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest',
                  t.subscription_status === 'active'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : t.subscription_status === 'trial'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-red-500/10 text-red-400',
                ]"
                >{{ t.subscription_status }}</span
              >
            </td>
            <td class="px-6 py-4 text-gray-300 font-bold">{{ t.total_students }}</td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <router-link
                  :to="`/superadmin/institutions/${t.id}`"
                  class="rounded-lg px-3 py-1 text-[10px] font-bold text-violet-400 border border-violet-500/20 hover:bg-violet-500/10 transition-colors"
                  >View</router-link
                >
                <button
                  v-if="t.subscription_status === 'active'"
                  @click="handleSuspend(t.id)"
                  :disabled="actionTenantId === t.id"
                  class="rounded-lg px-3 py-1 text-[10px] font-bold text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-colors"
                >
                  Suspend
                </button>
                <button
                  v-else
                  @click="handleActivate(t.id)"
                  :disabled="actionTenantId === t.id"
                  class="rounded-lg px-3 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 transition-colors"
                >
                  Activate
                </button>
                <a
                  v-if="t.slug"
                  :href="'/site/' + t.slug"
                  target="_blank"
                  class="rounded-lg px-3 py-1 text-[10px] font-bold text-blue-400 border border-blue-500/20 hover:bg-blue-500/10 transition-colors"
                  >View Site</a
                >
                <button
                  @click="handleDelete(t.id)"
                  :disabled="actionTenantId === t.id"
                  class="rounded-lg px-3 py-1 text-[10px] font-bold text-rose-300 border border-rose-500/20 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="loading">
            <td colspan="8" class="px-6 py-8 text-center text-xs font-bold text-gray-500">Syncing institutions...</td>
          </tr>
          <tr v-else-if="filteredTenants.length === 0">
            <td colspan="8" class="px-6 py-8 text-center text-xs font-bold text-gray-500">
              No institutions matched this search.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTenantsStore } from '@/stores/tenants'
import { useToastStore } from '@/stores/toast'
import { extractApiErrorMessage } from '@/services/superadminService'

const tenantsStore = useTenantsStore()
const toast = useToastStore()
const search = ref('')
const loading = ref(false)
const actionTenantId = ref('')
const loadMessage = ref('')

async function loadTenants() {
  loading.value = true
  loadMessage.value = ''
  try {
    await tenantsStore.fetchTenants()
  } catch (error) {
    loadMessage.value =
      tenantsStore.tenants.length > 0
        ? 'Live sync failed, so this table is showing cached institution data.'
        : extractApiErrorMessage(error, 'Failed to load institutions.')
  } finally {
    loading.value = false
  }
}

async function handleSuspend(id: string) {
  const tenant = tenantsStore.tenants.find((item) => item.id === id)
  actionTenantId.value = id
  try {
    await tenantsStore.suspendTenant(id)
    toast.warning(`${tenant?.name || 'Institution'} has been suspended`)
  } catch (error) {
    toast.error(extractApiErrorMessage(error, 'Failed to suspend institution.'))
  } finally {
    actionTenantId.value = ''
  }
}

async function handleActivate(id: string) {
  const tenant = tenantsStore.tenants.find((item) => item.id === id)
  actionTenantId.value = id
  try {
    await tenantsStore.activateTenant(id)
    toast.success(`${tenant?.name || 'Institution'} has been activated`)
  } catch (error) {
    toast.error(extractApiErrorMessage(error, 'Failed to activate institution.'))
  } finally {
    actionTenantId.value = ''
  }
}

async function handleDelete(id: string) {
  const tenant = tenantsStore.tenants.find((item) => item.id === id)
  const name = tenant?.name || 'this institution'
  const confirmed = window.confirm(`Delete ${name}? This removes it from the superadmin institution list.`)
  if (!confirmed) return

  actionTenantId.value = id
  try {
    await tenantsStore.deleteTenant(id)
    toast.success(`${name} has been deleted`)
  } catch (error) {
    toast.error(extractApiErrorMessage(error, 'Failed to delete institution.'))
  } finally {
    actionTenantId.value = ''
  }
}

onMounted(loadTenants)

const filteredTenants = computed(() => {
  if (!search.value) return tenantsStore.tenants
  const q = search.value.toLowerCase()
  return tenantsStore.tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(q) || t.city.toLowerCase().includes(q) || t.admin_email.toLowerCase().includes(q),
  )
})
</script>

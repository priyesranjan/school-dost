<template>
  <div class="space-y-8">
    <!-- Hero Header -->
    <div
      class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-white shadow-2xl shadow-primary-500/20"
    >
      <div
        class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2MmgxMnptMC04VjIwSDI0djJoMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"
      ></div>
      <div class="relative flex flex-col items-center gap-6 sm:flex-row">
        <!-- Logo Upload -->
        <div class="group relative">
          <div
            class="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl bg-white/20 backdrop-blur-sm ring-4 ring-white/30 shadow-2xl"
          >
            <img
              v-if="institution.profile.logo_url"
              :src="institution.profile.logo_url"
              class="h-full w-full object-cover"
            />
            <span v-else class="text-4xl font-black">{{ institution.profile.name.charAt(0) }}</span>
          </div>
          <label
            class="absolute inset-0 flex cursor-pointer items-center justify-center rounded-3xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <span class="text-xs font-bold">{{ uploadingField === 'logo_url' ? 'Uploading...' : 'Upload Logo' }}</span>
            <input
              type="file"
              accept="image/*"
              class="hidden"
              :disabled="uploadingField === 'logo_url'"
              @change="handleLogoUpload"
            />
          </label>
        </div>
        <div class="flex-1 text-center sm:text-left">
          <h1 class="text-2xl font-black tracking-tight">{{ institution.profile.name }}</h1>
          <p v-if="institution.profile.motto" class="mt-1 text-sm font-medium text-white/70 italic">
            "{{ institution.profile.motto }}"
          </p>
          <div class="mt-3 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <span
              class="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest"
            >
              {{ institution.profile.type }}
            </span>
            <span
              v-if="institution.profile.board_affiliation"
              class="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest"
            >
              {{ institution.profile.board_affiliation }}
            </span>
            <span
              class="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-200"
            >
              Est. {{ institution.profile.established_year }}
            </span>
          </div>
        </div>
        <div class="text-center">
          <div
            :class="[
              'rounded-2xl px-4 py-2 text-[10px] font-black uppercase tracking-widest',
              institution.profile.public_website_enabled
                ? 'bg-emerald-500/20 text-emerald-200'
                : 'bg-red-500/20 text-red-200',
            ]"
          >
            Website {{ institution.profile.public_website_enabled ? 'Live' : 'Off' }}
          </div>
          <a
            v-if="institution.profile.public_website_enabled"
            :href="'/site/' + institution.profile.slug"
            target="_blank"
            class="mt-2 block text-[10px] text-white/60 hover:text-white underline"
          >
            View Public Site →
          </a>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        :class="[
          'flex-1 rounded-lg px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-all',
          activeTab === tab.key
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-400 hover:text-gray-600',
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Basic Information -->
    <template v-if="activeTab === 'basic'">
      <div class="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm">
        <h3 class="text-lg font-black text-gray-900 dark:text-white mb-6">Basic Information</h3>
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1">Institution Name</label>
            <input
              v-model="form.name"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1">Type</label>
            <select
              v-model="form.type"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
            >
              <option value="school">School</option>
              <option value="college">College</option>
              <option value="university">University</option>
              <option value="coaching">Coaching</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1">Motto / Tagline</label>
            <input
              v-model="form.motto"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
              placeholder="Knowledge is Power"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1">Established Year</label>
            <input
              v-model.number="form.established_year"
              type="number"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1">Board Affiliation</label>
            <input
              v-model="form.board_affiliation"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
              placeholder="CBSE / ICSE / State Board"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1">UDISE Code</label>
            <input
              v-model="form.udise_code"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <button
            @click="saveProfile"
            class="rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </template>

    <!-- Contact & Address -->
    <template v-if="activeTab === 'contact'">
      <div class="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm">
        <h3 class="text-lg font-black text-gray-900 dark:text-white mb-6">Contact & Address</h3>
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-gray-500 mb-1">Full Address</label>
            <textarea
              v-model="form.address"
              rows="2"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
            ></textarea>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1">City</label>
            <input
              v-model="form.city"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1">State</label>
            <input
              v-model="form.state"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1">Pincode</label>
            <input
              v-model="form.pincode"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1">Phone</label>
            <input
              v-model="form.phone"
              type="tel"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1">Website URL</label>
            <input
              v-model="form.website_url"
              type="url"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
              placeholder="https://..."
            />
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <button
            @click="saveProfile"
            class="rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </template>

    <!-- Leadership -->
    <template v-if="activeTab === 'leadership'">
      <div class="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm">
        <h3 class="text-lg font-black text-gray-900 dark:text-white mb-6">Principal / Director</h3>
        <div class="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
          <div class="group relative">
            <div
              class="flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-700 ring-4 ring-gray-200 dark:ring-gray-600 shadow-xl"
            >
              <img v-if="form.principal_photo_url" :src="form.principal_photo_url" class="h-full w-full object-cover" />
              <span v-else class="text-4xl text-gray-400">👤</span>
            </div>
            <label
              class="absolute inset-0 flex cursor-pointer items-center justify-center rounded-3xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold"
            >
              {{ uploadingField === 'principal_photo_url' ? 'Uploading...' : 'Upload' }}
              <input
                type="file"
                accept="image/*"
                class="hidden"
                :disabled="uploadingField === 'principal_photo_url'"
                @change="handlePrincipalPhotoUpload"
              />
            </label>
          </div>
          <div class="flex-1 space-y-4 w-full">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="block text-xs font-bold text-gray-500 mb-1">Name</label>
                <input
                  v-model="form.principal_name"
                  class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 mb-1">Designation</label>
                <input
                  v-model="form.principal_designation"
                  class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 mb-1">Principal's Message</label>
              <textarea
                v-model="form.principal_message"
                rows="4"
                class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
                placeholder="A message from the principal..."
              ></textarea>
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <button
            @click="saveProfile"
            class="rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </template>

    <!-- Social & Website -->
    <template v-if="activeTab === 'social'">
      <div class="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm">
        <h3 class="text-lg font-black text-gray-900 dark:text-white mb-6">Social Media & Public Website</h3>

        <!-- Public Website Toggle -->
        <div class="flex items-center justify-between rounded-2xl border border-gray-200 dark:border-gray-700 p-5 mb-6">
          <div>
            <p class="text-sm font-black text-gray-900 dark:text-white">Public Website</p>
            <p class="text-xs text-gray-500">Enable a beautiful, auto-generated public page for your institution</p>
            <p v-if="institution.profile.public_website_enabled" class="mt-1 text-xs text-primary-600 font-bold">
              Live at: /site/{{ institution.profile.slug }}
            </p>
          </div>
          <button
            @click="togglePublicWebsite()"
            :class="[
              'relative inline-flex h-7 w-12 items-center rounded-full transition-colors',
              institution.profile.public_website_enabled ? 'bg-primary-600' : 'bg-gray-300',
            ]"
          >
            <span
              :class="[
                'inline-block h-5 w-5 rounded-full bg-white transition-transform shadow-sm',
                institution.profile.public_website_enabled ? 'translate-x-6' : 'translate-x-1',
              ]"
            />
          </button>
        </div>

        <!-- Website Theme Selector -->
        <div
          v-if="institution.profile.public_website_enabled"
          class="rounded-2xl border border-gray-200 dark:border-gray-700 p-5 mb-6"
        >
          <p class="text-sm font-black text-gray-900 dark:text-white mb-1">Website Theme</p>
          <p class="text-xs text-gray-500 mb-4">Choose a visual style for your public website</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              v-for="theme in websiteThemes"
              :key="theme.key"
              @click="form.website_theme = theme.key"
              :class="[
                'relative rounded-2xl border-2 p-4 text-left transition-all',
                form.website_theme === theme.key
                  ? 'border-primary-500 ring-2 ring-primary-500/20 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300',
              ]"
            >
              <div class="flex items-center gap-3 mb-3">
                <div class="flex gap-1.5">
                  <span
                    v-for="c in theme.colors"
                    :key="c"
                    class="h-5 w-5 rounded-full border border-gray-200 shadow-sm"
                    :style="{ background: c }"
                  ></span>
                </div>
                <div
                  v-if="form.website_theme === theme.key"
                  class="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-white"
                >
                  <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p class="text-sm font-black text-gray-900 dark:text-white">{{ theme.name }}</p>
              <p class="text-[11px] text-gray-500 mt-0.5">{{ theme.description }}</p>
              <div
                class="mt-3 h-16 rounded-lg overflow-hidden"
                :style="{ background: 'linear-gradient(135deg, ' + theme.colors[0] + ', ' + theme.colors[2] + ')' }"
              >
                <div class="h-full flex items-center justify-center">
                  <div class="flex items-center gap-2">
                    <div class="h-6 w-6 rounded bg-white/20"></div>
                    <div class="space-y-1">
                      <div class="h-1.5 w-16 rounded-full bg-white/40"></div>
                      <div class="h-1 w-10 rounded-full" :style="{ background: theme.colors[1] }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1">📘 Facebook</label>
            <input
              v-model="form.social_facebook"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
              placeholder="https://facebook.com/..."
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1">📸 Instagram</label>
            <input
              v-model="form.social_instagram"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1">🐦 Twitter / X</label>
            <input
              v-model="form.social_twitter"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
              placeholder="https://x.com/..."
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1">📺 YouTube</label>
            <input
              v-model="form.social_youtube"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
              placeholder="https://youtube.com/..."
            />
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <button
            @click="saveProfile"
            class="rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </template>

    <!-- Website Content -->
    <template v-if="activeTab === 'websiteContent'">
      <div
        class="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm space-y-8"
      >
        <div>
          <h3 class="text-lg font-black text-gray-900 dark:text-white mb-1">Public Website Content</h3>
          <p class="text-xs text-gray-500">
            Update hero text, section copy and image URLs used on your public website.
          </p>
          <div class="mt-3 flex justify-end">
            <button
              @click="resetWebsiteContent"
              class="rounded-lg border border-rose-300 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              Reset All Website Content
            </button>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
          <div class="flex items-center justify-between">
            <p class="text-sm font-black text-gray-900 dark:text-white">Easy Website Builder Widgets</p>
            <span class="text-[11px] font-bold text-gray-400">No code needed</span>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-xs font-bold text-gray-500 mb-1">WhatsApp Number</label>
              <input
                v-model="form.website_whatsapp_number"
                class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm"
                placeholder="919876543210"
              />
              <p class="mt-1 text-[10px] text-gray-400">Add country code without + for quick chat button.</p>
            </div>
            <div class="grid grid-cols-1 gap-2">
              <label
                class="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3"
              >
                <span class="text-xs font-bold text-gray-600 dark:text-gray-300">Show Floating WhatsApp Button</span>
                <input v-model="form.website_show_whatsapp_button" type="checkbox" class="h-4 w-4" />
              </label>
              <label
                class="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3"
              >
                <span class="text-xs font-bold text-gray-600 dark:text-gray-300">Show Social Media Scroll</span>
                <input v-model="form.website_show_social_ticker" type="checkbox" class="h-4 w-4" />
              </label>
              <label
                class="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3"
              >
                <span class="text-xs font-bold text-gray-600 dark:text-gray-300">Show Notice Board Section</span>
                <input v-model="form.website_show_notice_board" type="checkbox" class="h-4 w-4" />
              </label>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1">Feature Images Strip</label>
            <textarea
              :value="featureImagesText()"
              @input="updateFeatureImages(($event.target as HTMLTextAreaElement).value)"
              rows="4"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm"
              placeholder="One image URL per line"
            ></textarea>
            <div class="mt-2 flex items-center justify-end">
              <label
                class="inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-[11px] font-bold text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {{ uploadingField === 'website_feature_images' ? 'Uploading...' : 'Upload Feature Images' }}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  class="hidden"
                  :disabled="uploadingField === 'website_feature_images'"
                  @change="handleFeatureImagesUpload"
                />
              </label>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-gray-500 mb-1">Hero Title</label>
            <input
              v-model="form.website_hero_title"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
              placeholder="Empowering Future Leaders"
            />
          </div>
          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-gray-500 mb-1">Hero Subtitle</label>
            <textarea
              v-model="form.website_hero_subtitle"
              rows="3"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
              placeholder="One-line welcome or summary shown in the hero section"
            ></textarea>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1">Primary CTA Button Text</label>
            <input
              v-model="form.website_primary_cta_text"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
              placeholder="Apply for Admission"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1">Secondary CTA Button Text</label>
            <input
              v-model="form.website_secondary_cta_text"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
              placeholder="Explore More"
            />
          </div>
          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-gray-500 mb-1">Hero Image URL</label>
            <div class="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
              <input
                v-model="form.website_hero_image_url"
                type="url"
                class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
                placeholder="https://..."
              />
              <label
                class="inline-flex items-center justify-center rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 text-xs font-bold text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {{ uploadingField === 'website_hero_image_url' ? 'Uploading...' : 'Upload to R2' }}
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  :disabled="uploadingField === 'website_hero_image_url'"
                  @change="uploadImageAndBind($event, 'website_hero_image_url')"
                />
              </label>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1">About Section Title</label>
            <input
              v-model="form.website_about_title"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
              placeholder="Shaping Tomorrow's Leaders"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1">About Image URL</label>
            <div class="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
              <input
                v-model="form.website_about_image_url"
                type="url"
                class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
                placeholder="https://..."
              />
              <label
                class="inline-flex items-center justify-center rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 text-xs font-bold text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {{ uploadingField === 'website_about_image_url' ? 'Uploading...' : 'Upload to R2' }}
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  :disabled="uploadingField === 'website_about_image_url'"
                  @change="uploadImageAndBind($event, 'website_about_image_url')"
                />
              </label>
            </div>
          </div>
          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-gray-500 mb-1">About Section Description</label>
            <textarea
              v-model="form.website_about_description"
              rows="5"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
              placeholder="Detailed introduction shown in About section"
            ></textarea>
          </div>
          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-gray-500 mb-1">Principal Message (Website)</label>
            <textarea
              v-model="form.principal_message"
              rows="4"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
              placeholder="Principal message shown on website"
            ></textarea>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1">Facilities Section Title</label>
            <input
              v-model="form.website_facilities_title"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
              placeholder="World-Class Facilities"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1">Why Choose Us Section Title</label>
            <input
              v-model="form.website_why_choose_title"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
              placeholder="Excellence in Every Dimension"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1">Gallery Section Title</label>
            <input
              v-model="form.website_gallery_title"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
              placeholder="Campus Life"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1">Contact Section Title</label>
            <input
              v-model="form.website_contact_title"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
              placeholder="We'd Love to Hear From You"
            />
          </div>

          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-gray-500 mb-1">Campus Gallery Image URLs</label>
            <textarea
              :value="galleryImagesText()"
              @input="updateGalleryImages(($event.target as HTMLTextAreaElement).value)"
              rows="6"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none"
              placeholder="One URL per line (or comma-separated)"
            ></textarea>
            <div class="mt-2 flex items-center justify-between gap-3">
              <p class="text-[11px] text-gray-500">Tip: add 6-8 images for the best layout.</p>
              <label
                class="inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-[11px] font-bold text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {{ uploadingField === 'website_gallery_images' ? 'Uploading...' : 'Upload Gallery Images' }}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  class="hidden"
                  :disabled="uploadingField === 'website_gallery_images'"
                  @change="handleGalleryUpload"
                />
              </label>
            </div>
          </div>

          <div class="sm:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-4">
            <div class="flex items-center justify-between">
              <p class="text-sm font-black text-gray-900 dark:text-white">Facilities Content Manager</p>
              <div class="flex gap-2">
                <button
                  @click="addFacilityItem"
                  class="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Add
                </button>
                <button
                  @click="resetFacilityItems"
                  class="rounded-lg border border-amber-300 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-50"
                >
                  Reset
                </button>
              </div>
            </div>

            <div
              v-for="(item, idx) in form.website_facilities"
              :key="'facility-' + idx"
              class="rounded-xl border border-gray-200 dark:border-gray-700 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              <div>
                <label class="block text-[11px] font-bold text-gray-500 mb-1">Title</label>
                <input
                  v-model="item.title"
                  class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm"
                  placeholder="Facility title"
                />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-gray-500 mb-1">Category</label>
                <input
                  v-model="item.category"
                  class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm"
                  placeholder="Category"
                />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-[11px] font-bold text-gray-500 mb-1">Description</label>
                <textarea
                  v-model="item.description"
                  rows="2"
                  class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm"
                  placeholder="Description"
                ></textarea>
              </div>
              <div class="sm:col-span-2 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2">
                <input
                  v-model="item.image"
                  type="url"
                  class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm"
                  placeholder="Image URL"
                />
                <label
                  class="inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-xs font-bold text-gray-700 cursor-pointer hover:bg-gray-50"
                >
                  {{ uploadingField === `website_facilities_${idx}` ? 'Uploading...' : 'Upload' }}
                  <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    :disabled="uploadingField === `website_facilities_${idx}`"
                    @change="uploadFacilityImage(idx, $event)"
                  />
                </label>
                <button
                  @click="deleteFacilityItem(idx)"
                  class="rounded-lg border border-rose-300 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div class="sm:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-4">
            <div class="flex items-center justify-between">
              <p class="text-sm font-black text-gray-900 dark:text-white">Campus / Club Media Manager</p>
              <div class="flex gap-2">
                <button
                  @click="addCampusMediaItem"
                  class="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Add
                </button>
                <button
                  @click="resetCampusMediaItems"
                  class="rounded-lg border border-amber-300 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-50"
                >
                  Reset
                </button>
              </div>
            </div>

            <div
              v-for="(item, idx) in form.website_campus_media"
              :key="'campus-' + idx"
              class="rounded-xl border border-gray-200 dark:border-gray-700 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              <div>
                <label class="block text-[11px] font-bold text-gray-500 mb-1">Title</label>
                <input
                  v-model="item.title"
                  class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm"
                  placeholder="Media title"
                />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-gray-500 mb-1">Description</label>
                <input
                  v-model="item.description"
                  class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm"
                  placeholder="Short description"
                />
              </div>
              <div class="sm:col-span-2 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2">
                <input
                  v-model="item.image"
                  type="url"
                  class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm"
                  placeholder="Image URL"
                />
                <label
                  class="inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-xs font-bold text-gray-700 cursor-pointer hover:bg-gray-50"
                >
                  {{ uploadingField === `website_campus_media_${idx}` ? 'Uploading...' : 'Upload' }}
                  <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    :disabled="uploadingField === `website_campus_media_${idx}`"
                    @change="uploadCampusMediaImage(idx, $event)"
                  />
                </label>
                <button
                  @click="deleteCampusMediaItem(idx)"
                  class="rounded-lg border border-rose-300 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div class="sm:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-4">
            <div class="flex items-center justify-between">
              <p class="text-sm font-black text-gray-900 dark:text-white">Article Views Manager</p>
              <div class="flex gap-2">
                <button
                  @click="addArticleItem"
                  class="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Add
                </button>
                <button
                  @click="resetArticleItems"
                  class="rounded-lg border border-amber-300 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-50"
                >
                  Reset
                </button>
              </div>
            </div>

            <div
              v-for="(item, idx) in form.website_articles"
              :key="'article-' + idx"
              class="rounded-xl border border-gray-200 dark:border-gray-700 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              <div>
                <label class="block text-[11px] font-bold text-gray-500 mb-1">Title</label>
                <input
                  v-model="item.title"
                  class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm"
                  placeholder="Article title"
                />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-gray-500 mb-1">Category</label>
                <input
                  v-model="item.category"
                  class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm"
                  placeholder="Category"
                />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-gray-500 mb-1">Views</label>
                <input
                  v-model.number="item.views"
                  type="number"
                  min="0"
                  class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-gray-500 mb-1">Published At</label>
                <input
                  v-model="item.published_at"
                  type="date"
                  class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm"
                />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-[11px] font-bold text-gray-500 mb-1">Excerpt</label>
                <textarea
                  v-model="item.excerpt"
                  rows="2"
                  class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm"
                  placeholder="Short summary"
                ></textarea>
              </div>
              <div class="sm:col-span-2 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2">
                <input
                  v-model="item.image"
                  type="url"
                  class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm"
                  placeholder="Image URL"
                />
                <label
                  class="inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-xs font-bold text-gray-700 cursor-pointer hover:bg-gray-50"
                >
                  {{ uploadingField === `website_articles_${idx}` ? 'Uploading...' : 'Upload' }}
                  <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    :disabled="uploadingField === `website_articles_${idx}`"
                    @change="uploadArticleImage(idx, $event)"
                  />
                </label>
                <button
                  @click="deleteArticleItem(idx)"
                  class="rounded-lg border border-rose-300 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <button
            @click="resetWebsiteContent"
            class="rounded-xl border border-rose-300 px-6 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all"
          >
            Reset
          </button>
          <button
            @click="saveProfile"
            class="rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all"
          >
            Save Website Content
          </button>
        </div>
      </div>
    </template>

    <!-- Sticky Save Bar -->
    <StickyActionBar
      :is-dirty="isDirty"
      :saving="isSaving"
      save-label="Save Profile"
      :show-reset="true"
      @save="saveProfile"
      @cancel="discardChanges"
      @reset="discardChanges"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useInstitutionStore } from '@/stores/institution'
import { useTenantsStore } from '@/stores/tenants'
import { saveToStorage } from '@/utils/storage'
import { useToastStore } from '@/stores/toast'
import { r2StorageService } from '@/services/r2StorageService'
import type { WebsiteFacilityItem, WebsiteCampusMediaItem, WebsiteArticleItem } from '@/types'
import StickyActionBar from '@/components/ui/StickyActionBar.vue'

const institution = useInstitutionStore()
const tenantsStore = useTenantsStore()
const toast = useToastStore()
const activeTab = ref('basic')
const uploadingField = ref<string | null>(null)
const isSaving = ref(false)
let savedSnapshot = JSON.stringify({ ...institution.profile })

const isDirty = computed(() => JSON.stringify(form) !== savedSnapshot)
const tabs = [
  { key: 'basic', label: 'Basic Info' },
  { key: 'contact', label: 'Contact' },
  { key: 'leadership', label: 'Leadership' },
  { key: 'social', label: 'Social & Website' },
  { key: 'websiteContent', label: 'Website Content' },
]

const form = reactive({ ...institution.profile })

const defaultFacilities: WebsiteFacilityItem[] = [
  {
    title: 'Library',
    description: 'A vibrant hub of knowledge with thousands of books and digital resources.',
    category: 'Academic',
    image: 'https://picsum.photos/seed/erp-library/900/600',
  },
  {
    title: 'Science Laboratories',
    description: 'Modern physics, chemistry and biology labs with safety standards.',
    category: 'Academic',
    image: 'https://picsum.photos/seed/erp-labs/900/600',
  },
  {
    title: 'Tech-Savvy Classrooms',
    description: 'Smart classrooms with interactive digital teaching tools.',
    category: 'Technology',
    image: 'https://picsum.photos/seed/erp-classroom/900/600',
  },
  {
    title: 'Sports Complex',
    description: 'Indoor and outdoor sports infrastructure for all-round fitness.',
    category: 'Sports',
    image: 'https://picsum.photos/seed/erp-sports/900/600',
  },
  {
    title: 'Dance & Music Studio',
    description: 'Creative performing arts spaces with dedicated instruments.',
    category: 'Arts',
    image: 'https://picsum.photos/seed/erp-music/900/600',
  },
  {
    title: 'Medical Room',
    description: 'On-campus first aid and wellness support for students.',
    category: 'Health',
    image: 'https://picsum.photos/seed/erp-medical/900/600',
  },
]

const defaultCampusMedia: WebsiteCampusMediaItem[] = [
  { title: 'Art & Craft', description: 'Creative expression', image: 'https://picsum.photos/seed/erp-art/900/700' },
  {
    title: 'Sports Day',
    description: 'Annual competitions',
    image: 'https://picsum.photos/seed/erp-sportsday/900/700',
  },
  {
    title: 'Annual Day',
    description: 'Cultural celebrations',
    image: 'https://picsum.photos/seed/erp-annualday/900/700',
  },
  {
    title: 'Science Fair',
    description: 'Innovation showcase',
    image: 'https://picsum.photos/seed/erp-sciencefair/900/700',
  },
  {
    title: 'Reading Club',
    description: 'Literary exploration',
    image: 'https://picsum.photos/seed/erp-reading/900/700',
  },
  {
    title: 'Award Ceremony',
    description: 'Celebrating excellence',
    image: 'https://picsum.photos/seed/erp-awards/900/700',
  },
  {
    title: 'Eco Club',
    description: 'Environmental awareness',
    image: 'https://picsum.photos/seed/erp-ecoclub/900/700',
  },
  { title: 'Music Fest', description: 'Performing arts', image: 'https://picsum.photos/seed/erp-musicfest/900/700' },
]

const defaultFeatureImages: string[] = [
  'https://picsum.photos/seed/erp-feature-1/1200/720',
  'https://picsum.photos/seed/erp-feature-2/1200/720',
  'https://picsum.photos/seed/erp-feature-3/1200/720',
]

const defaultArticles: WebsiteArticleItem[] = [
  {
    title: 'How We Build Future-Ready Learners',
    excerpt: 'A look at how project-based learning and mentoring shape confident, creative students.',
    image: 'https://picsum.photos/seed/erp-article-1/1200/700',
    category: 'Academics',
    views: 1280,
    published_at: new Date().toISOString(),
  },
  {
    title: 'Inside Our Innovation Labs',
    excerpt: 'Students explore robotics, coding, and experiments through guided curiosity sessions.',
    image: 'https://picsum.photos/seed/erp-article-2/1200/700',
    category: 'Innovation',
    views: 940,
    published_at: new Date().toISOString(),
  },
]

function ensureWebsiteCollections() {
  if (!Array.isArray(form.website_facilities) || !form.website_facilities.length) {
    form.website_facilities = defaultFacilities.map((item) => ({ ...item }))
  }
  if (!Array.isArray(form.website_campus_media) || !form.website_campus_media.length) {
    form.website_campus_media = defaultCampusMedia.map((item) => ({ ...item }))
  }
  if (!Array.isArray(form.website_feature_images)) {
    form.website_feature_images = []
  }
  if (!Array.isArray(form.website_articles) || !form.website_articles.length) {
    form.website_articles = defaultArticles.map((item) => ({ ...item }))
  }
  if (typeof form.website_whatsapp_number !== 'string') {
    form.website_whatsapp_number = ''
  }
  if (typeof form.website_show_whatsapp_button !== 'boolean') {
    form.website_show_whatsapp_button = true
  }
  if (typeof form.website_show_social_ticker !== 'boolean') {
    form.website_show_social_ticker = true
  }
  if (typeof form.website_show_notice_board !== 'boolean') {
    form.website_show_notice_board = true
  }
}

function getCurrentTenant() {
  return tenantsStore.tenants.find(
    (t) =>
      t.id === institution.profile.id ||
      t.slug === institution.profile.slug ||
      t.admin_email === institution.profile.admin_email,
  )
}

function syncToTenantProfile(payload: typeof form) {
  const tenant = getCurrentTenant()
  if (!tenant) return
  const normalized = { ...payload, id: tenant.id, slug: tenant.slug }
  saveToStorage(`institution_${tenant.id}`, normalized)
}

onMounted(() => {
  Object.assign(form, institution.profile)

  const tenant = getCurrentTenant()
  if (!tenant) return

  const tenantProfile = tenantsStore.getInstitutionProfile(tenant.id)
  if (tenantProfile) {
    Object.assign(form, tenantProfile)
    Object.assign(institution.profile, tenantProfile)
  }

  ensureWebsiteCollections()
  savedSnapshot = JSON.stringify({ ...form })
})

const websiteThemes = [
  {
    key: 'professional' as const,
    name: 'Professional',
    description: 'Navy & Gold — elegant, premium school look',
    colors: ['#0f2557', '#c8a951', '#091638'],
  },
  {
    key: 'standard1' as const,
    name: 'Standard 1',
    description: 'Emerald & Amber — fresh, vibrant, modern feel',
    colors: ['#166534', '#d97706', '#0a3d1e'],
  },
  {
    key: 'premium' as const,
    name: 'Premium',
    description: 'Meridian-inspired warm red + deep blue premium design',
    colors: ['#b91c1c', '#f59e0b', '#0f172a'],
  },
]

function saveProfile() {
  isSaving.value = true
  form.website_gallery_images = parseImageList(form.website_gallery_images)
  form.website_feature_images = parseImageList(form.website_feature_images)
  ensureWebsiteCollections()
  institution.updateProfile({ ...form })
  syncToTenantProfile(form)
  savedSnapshot = JSON.stringify({ ...form })
  isSaving.value = false
  toast.success('Profile saved')
}

function discardChanges() {
  Object.assign(form, JSON.parse(savedSnapshot))
  ensureWebsiteCollections()
}

function resetWebsiteContent() {
  form.website_hero_title = ''
  form.website_hero_subtitle = ''
  form.website_hero_image_url = ''
  form.website_about_title = ''
  form.website_about_description = ''
  form.website_about_image_url = ''
  form.website_primary_cta_text = ''
  form.website_secondary_cta_text = ''
  form.website_facilities_title = ''
  form.website_why_choose_title = ''
  form.website_gallery_title = ''
  form.website_contact_title = ''
  form.website_whatsapp_number = ''
  form.website_show_whatsapp_button = true
  form.website_show_social_ticker = true
  form.website_show_notice_board = true
  form.website_gallery_images = []
  form.website_feature_images = defaultFeatureImages.slice()
  form.website_facilities = defaultFacilities.map((item) => ({ ...item }))
  form.website_campus_media = defaultCampusMedia.map((item) => ({ ...item }))
  form.website_articles = defaultArticles.map((item) => ({ ...item }))
  toast.success('Website content reset to defaults')
}

function addFacilityItem() {
  form.website_facilities.push({ title: '', description: '', category: 'General', image: '' })
}

function deleteFacilityItem(index: number) {
  form.website_facilities.splice(index, 1)
}

function resetFacilityItems() {
  form.website_facilities = defaultFacilities.map((item) => ({ ...item }))
  toast.success('Facilities reset')
}

function addCampusMediaItem() {
  form.website_campus_media.push({ title: '', description: '', image: '' })
}

function deleteCampusMediaItem(index: number) {
  form.website_campus_media.splice(index, 1)
}

function resetCampusMediaItems() {
  form.website_campus_media = defaultCampusMedia.map((item) => ({ ...item }))
  toast.success('Campus media reset')
}

function addArticleItem() {
  form.website_articles.push({
    title: '',
    excerpt: '',
    image: '',
    category: 'General',
    views: 0,
    published_at: new Date().toISOString().slice(0, 10),
  })
}

function deleteArticleItem(index: number) {
  form.website_articles.splice(index, 1)
}

function resetArticleItems() {
  form.website_articles = defaultArticles.map((item) => ({ ...item }))
  toast.success('Articles reset')
}

function togglePublicWebsite() {
  institution.togglePublicWebsite()
  form.public_website_enabled = institution.profile.public_website_enabled
  syncToTenantProfile(form)
}

function handleLogoUpload(e: Event) {
  uploadImageAndBind(e, 'logo_url')
}

function handlePrincipalPhotoUpload(e: Event) {
  uploadImageAndBind(e, 'principal_photo_url')
}

async function uploadImageAndBind(
  e: Event,
  field: 'logo_url' | 'principal_photo_url' | 'website_hero_image_url' | 'website_about_image_url',
) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    toast.warning('Please select an image file')
    input.value = ''
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.warning('Max upload size is 5MB')
    input.value = ''
    return
  }

  const tenant = getCurrentTenant()
  const tenantId = tenant?.id || institution.profile.id || 'tenant_default'

  uploadingField.value = field
  try {
    const url = await r2StorageService.uploadInstitutionImage(file, tenantId, field)
    form[field] = url
    if (field === 'logo_url') {
      institution.profile.logo_url = url
    }
    if (field === 'principal_photo_url') {
      institution.profile.principal_photo_url = url
    }
    toast.success('Image uploaded successfully')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    toast.error(message)
  } finally {
    uploadingField.value = null
    input.value = ''
  }
}

function parseImageList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean)
  }
  if (typeof value === 'string') {
    return value
      .split(/\r?\n|,/)
      .map((v) => v.trim())
      .filter(Boolean)
  }
  return []
}

function galleryImagesText() {
  return parseImageList(form.website_gallery_images).join('\n')
}

function updateGalleryImages(raw: string) {
  form.website_gallery_images = parseImageList(raw)
}

function featureImagesText() {
  return parseImageList(form.website_feature_images).join('\n')
}

function updateFeatureImages(raw: string) {
  form.website_feature_images = parseImageList(raw)
}

async function handleGalleryUpload(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files || [])
  if (!files.length) return

  const tenant = getCurrentTenant()
  const tenantId = tenant?.id || institution.profile.id || 'tenant_default'

  uploadingField.value = 'website_gallery_images'
  try {
    const uploaded: string[] = []
    for (const [index, file] of files.entries()) {
      if (!file.type.startsWith('image/')) continue
      if (file.size > 5 * 1024 * 1024) continue
      const url = await r2StorageService.uploadInstitutionImage(file, tenantId, `gallery-${index + 1}`)
      uploaded.push(url)
    }

    form.website_gallery_images = [...parseImageList(form.website_gallery_images), ...uploaded]
    toast.success(`${uploaded.length} image(s) uploaded`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gallery upload failed'
    toast.error(message)
  } finally {
    uploadingField.value = null
    input.value = ''
  }
}

async function handleFeatureImagesUpload(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files || [])
  if (!files.length) return

  const tenant = getCurrentTenant()
  const tenantId = tenant?.id || institution.profile.id || 'tenant_default'

  uploadingField.value = 'website_feature_images'
  try {
    const uploaded: string[] = []
    for (const [index, file] of files.entries()) {
      if (!file.type.startsWith('image/')) continue
      if (file.size > 5 * 1024 * 1024) continue
      const url = await r2StorageService.uploadInstitutionImage(file, tenantId, `feature-${index + 1}`)
      uploaded.push(url)
    }

    form.website_feature_images = [...parseImageList(form.website_feature_images), ...uploaded]
    toast.success(`${uploaded.length} feature image(s) uploaded`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Feature image upload failed'
    toast.error(message)
  } finally {
    uploadingField.value = null
    input.value = ''
  }
}

async function uploadFacilityImage(index: number, e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const tenant = getCurrentTenant()
  const tenantId = tenant?.id || institution.profile.id || 'tenant_default'

  uploadingField.value = `website_facilities_${index}`
  try {
    const url = await r2StorageService.uploadInstitutionImage(file, tenantId, `facility-${index + 1}`)
    form.website_facilities[index].image = url
    toast.success('Facility image uploaded')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    toast.error(message)
  } finally {
    uploadingField.value = null
    input.value = ''
  }
}

async function uploadCampusMediaImage(index: number, e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const tenant = getCurrentTenant()
  const tenantId = tenant?.id || institution.profile.id || 'tenant_default'

  uploadingField.value = `website_campus_media_${index}`
  try {
    const url = await r2StorageService.uploadInstitutionImage(file, tenantId, `campus-media-${index + 1}`)
    form.website_campus_media[index].image = url
    toast.success('Campus media image uploaded')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    toast.error(message)
  } finally {
    uploadingField.value = null
    input.value = ''
  }
}

async function uploadArticleImage(index: number, e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const tenant = getCurrentTenant()
  const tenantId = tenant?.id || institution.profile.id || 'tenant_default'

  uploadingField.value = `website_articles_${index}`
  try {
    const url = await r2StorageService.uploadInstitutionImage(file, tenantId, `article-${index + 1}`)
    form.website_articles[index].image = url
    toast.success('Article image uploaded')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    toast.error(message)
  } finally {
    uploadingField.value = null
    input.value = ''
  }
}
</script>

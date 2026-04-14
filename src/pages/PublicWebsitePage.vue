<template>
  <div class="min-h-screen overflow-x-hidden font-sans bg-white" ref="pageRef" :style="themeVars">
    <!-- Not Found -->
    <div v-if="!tenant" class="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div class="text-center max-w-md mx-auto">
        <div
          class="mx-auto h-24 w-24 rounded-3xl bg-[--c-primary]/10 flex items-center justify-center text-5xl mb-6"
          :style="{ background: tc.primaryBg10 }"
        >
          🏛️
        </div>
        <h1 class="text-3xl font-black text-slate-900">Institution Not Found</h1>
        <p class="mt-3 text-slate-500">
          The institution you're looking for doesn't exist or their website hasn't been enabled.
        </p>
        <router-link
          to="/login"
          class="mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-bold text-white shadow-xl transition-all"
          :style="{ background: tc.primary }"
          >← Back to Login</router-link
        >
      </div>
    </div>

    <template v-else>
      <!-- ══════════════════════════════════════════════════════════ -->
      <!-- TOP CONTACT BAR                                          -->
      <!-- ══════════════════════════════════════════════════════════ -->
      <div class="text-white/80 text-xs hidden sm:block relative z-[60]" :style="{ background: tc.dark }">
        <div class="mx-auto max-w-7xl flex items-center justify-between px-6 py-2">
          <div class="flex items-center gap-6">
            <span
              v-if="profile?.phone"
              class="flex items-center gap-1.5 transition-colors cursor-pointer"
              :class="'hover:text-[' + tc.secondary + ']'"
            >
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              {{ profile.phone }}
            </span>
            <span
              v-if="profile?.email || tenant.admin_email"
              class="flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {{ profile?.email || tenant.admin_email }}
            </span>
            <span v-if="profile?.address" class="flex items-center gap-1.5 text-white/50">
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {{ profile.city }}, {{ profile.state }}
            </span>
          </div>
          <div class="flex items-center gap-3">
            <a
              v-if="profile?.social_facebook"
              :href="profile.social_facebook"
              target="_blank"
              rel="noopener noreferrer"
              class="flex h-6 w-6 items-center justify-center rounded bg-white/10 hover:bg-white/20 transition-all"
            >
              <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
            </a>
            <a
              v-if="profile?.social_instagram"
              :href="profile.social_instagram"
              target="_blank"
              rel="noopener noreferrer"
              class="flex h-6 w-6 items-center justify-center rounded bg-white/10 hover:bg-white/20 transition-all"
            >
              <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
                />
              </svg>
            </a>
            <a
              v-if="profile?.social_twitter"
              :href="profile.social_twitter"
              target="_blank"
              rel="noopener noreferrer"
              class="flex h-6 w-6 items-center justify-center rounded bg-white/10 hover:bg-white/20 transition-all"
            >
              <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
              </svg>
            </a>
            <a
              v-if="profile?.social_youtube"
              :href="profile.social_youtube"
              target="_blank"
              rel="noopener noreferrer"
              class="flex h-6 w-6 items-center justify-center rounded bg-white/10 hover:bg-white/20 transition-all"
            >
              <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                />
              </svg>
            </a>
            <span class="ml-2 h-4 w-px bg-white/20"></span>
            <router-link to="/login" class="flex items-center gap-1.5 hover:text-white transition-colors font-semibold">
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Login / Portal
            </router-link>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════════════ -->
      <!-- NAVBAR                                                   -->
      <!-- ══════════════════════════════════════════════════════════ -->
      <nav
        :class="[
          'fixed left-0 right-0 z-50 transition-all duration-500',
          scrolled ? 'top-0 shadow-lg' : 'top-0 sm:top-[36px] backdrop-blur-md',
        ]"
        :style="
          scrolled ? { background: '#fff', borderBottom: '1px solid #f1f5f9' } : { background: tc.primary + 'f0' }
        "
      >
        <div class="mx-auto flex h-16 sm:h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-12">
          <div class="flex items-center gap-3">
            <div
              v-if="profile?.logo_url"
              :class="[
                'overflow-hidden shadow-lg transition-all',
                scrolled ? 'h-10 w-10 sm:h-11 sm:w-11 rounded-lg' : 'h-11 w-11 sm:h-12 sm:w-12 rounded-xl',
              ]"
              :style="
                scrolled
                  ? { boxShadow: '0 0 0 2px ' + tc.primary + '33' }
                  : { boxShadow: '0 0 0 2px ' + tc.secondary + '4d' }
              "
            >
              <img :src="profile.logo_url" class="h-full w-full object-cover" alt="Logo" />
            </div>
            <div
              v-else
              :class="[
                'flex items-center justify-center font-black text-sm shadow-lg transition-all',
                scrolled
                  ? 'h-10 w-10 sm:h-11 sm:w-11 rounded-lg text-white'
                  : 'h-11 w-11 sm:h-12 sm:w-12 rounded-xl text-white',
              ]"
              :style="{ background: scrolled ? tc.primary : 'rgba(255,255,255,0.15)' }"
            >
              {{ tenant.name.charAt(0) }}
            </div>
            <div class="hidden sm:block">
              <p
                :class="[
                  'text-sm font-extrabold tracking-tight leading-tight transition-colors',
                  scrolled ? 'text-slate-900' : 'text-white',
                ]"
              >
                {{ tenant.name }}
              </p>
              <p class="text-[10px] font-semibold transition-colors" :style="{ color: tc.secondary }">
                {{ profile?.board_affiliation || 'Excellence in Education' }}
              </p>
            </div>
          </div>
          <div class="hidden items-center gap-0.5 lg:flex">
            <a
              v-for="link in navLinks"
              :key="link.href"
              :href="link.href"
              :class="[
                'relative px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em] rounded-md transition-all group',
                scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-white hover:bg-white/10',
              ]"
            >
              {{ link.label }}
              <span
                class="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 rounded-full transition-all group-hover:w-4/5"
                :style="{ background: tc.secondary }"
              ></span>
            </a>
            <a
              href="#admissions"
              class="ml-4 rounded-md px-6 py-2.5 text-[11px] font-extrabold uppercase tracking-widest transition-all shadow-md hover:shadow-lg hover:scale-[1.03]"
              :style="{ background: tc.secondary, color: tc.ctaText }"
            >
              {{ primaryCtaText }}
            </a>
          </div>
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="lg:hidden rounded-lg p-2"
            :class="scrolled ? 'text-slate-900' : 'text-white'"
          >
            <svg v-if="!mobileMenuOpen" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <!-- Mobile menu -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            v-if="mobileMenuOpen"
            class="lg:hidden bg-white border-t border-slate-100 shadow-2xl px-4 py-3 space-y-1"
          >
            <a
              v-for="link in navLinks"
              :key="link.href"
              :href="link.href"
              @click="mobileMenuOpen = false"
              class="block rounded-lg px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >{{ link.label }}</a
            >
            <a
              href="#admissions"
              @click="mobileMenuOpen = false"
              class="block rounded-lg px-4 py-3 text-sm font-bold text-center mt-2"
              :style="{ background: tc.secondary, color: tc.ctaText }"
              >{{ primaryCtaText }} →</a
            >
            <router-link
              to="/login"
              @click="mobileMenuOpen = false"
              class="block rounded-lg px-4 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors sm:hidden"
              >Staff / Admin Login</router-link
            >
          </div>
        </transition>
      </nav>

      <!-- ══════════════════════════════════════════════════════════ -->
      <!-- HERO SLIDER SECTION                                      -->
      <!-- ══════════════════════════════════════════════════════════ -->
      <section class="relative min-h-[85vh] sm:min-h-screen overflow-hidden">
        <!-- Slide backgrounds -->
        <div class="absolute inset-0">
          <transition-group name="hero-slide" tag="div" class="relative h-full w-full">
            <div
              v-for="(slide, i) in heroSlides"
              :key="i"
              v-show="activeSlide === i"
              class="absolute inset-0"
              :style="{ background: slide.bg }"
            >
              <div class="absolute inset-0" :style="{ background: slide.overlay }"></div>
            </div>
          </transition-group>
        </div>

        <!-- Pattern overlay -->
        <div
          class="absolute inset-0 opacity-[0.03]"
          style="
            background-image: url(&quot;data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 0h1v40H0zM39 0h1v40h-1zM0 0h40v1H0zM0 39h40v1H0z'/%3E%3C/g%3E%3C/svg%3E&quot;);
          "
        ></div>
        <!-- Accent top line -->
        <div
          class="absolute top-0 left-0 right-0 h-1 z-20"
          :style="{ background: 'linear-gradient(to right, transparent, ' + tc.secondary + ', transparent)' }"
        ></div>

        <div class="relative z-10 flex items-center justify-center min-h-[85vh] sm:min-h-screen">
          <div class="mx-auto max-w-6xl px-4 sm:px-6 w-full">
            <div class="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <!-- Left content -->
              <div class="flex-1 text-center lg:text-left text-white pt-24 sm:pt-0">
                <div
                  class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 animate-slide-up"
                  :style="{ background: tc.secondary + '26', border: '1px solid ' + tc.secondary + '40' }"
                >
                  <div class="h-2 w-2 rounded-full animate-pulse" :style="{ background: tc.secondary }"></div>
                  <span class="text-[10px] font-extrabold uppercase tracking-[0.25em]" :style="{ color: tc.secondary }"
                    >Warm Welcome To</span
                  >
                </div>

                <h1
                  class="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight leading-[1.08] animate-slide-up animation-delay-100"
                >
                  {{ heroTitle }}
                </h1>

                <p
                  v-if="heroSubtitle"
                  class="mt-4 text-lg sm:text-xl font-medium text-white/50 italic animate-slide-up animation-delay-200"
                >
                  "{{ heroSubtitle }}"
                </p>

                <div
                  class="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-2 animate-slide-up animation-delay-300"
                >
                  <span
                    v-if="profile?.board_affiliation"
                    class="rounded-md backdrop-blur-sm px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em]"
                    :style="{
                      background: tc.secondary + '1a',
                      border: '1px solid ' + tc.secondary + '40',
                      color: tc.secondary,
                    }"
                  >
                    {{ profile.board_affiliation }}
                  </span>
                  <span
                    class="rounded-md bg-white/8 backdrop-blur-sm px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] border border-white/10 text-white/70"
                  >
                    Est. {{ profile?.established_year || 'N/A' }}
                  </span>
                  <span
                    class="rounded-md bg-white/8 backdrop-blur-sm px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] border border-white/10 text-white/70"
                  >
                    📍 {{ tenant.city }}, {{ tenant.state }}
                  </span>
                </div>

                <div
                  class="mt-8 flex flex-col sm:flex-row items-center gap-3 sm:justify-center lg:justify-start animate-slide-up animation-delay-400"
                >
                  <a
                    href="#admissions"
                    class="rounded-md w-full sm:w-auto px-8 py-3.5 text-sm font-extrabold shadow-xl transition-all hover:scale-[1.03] hover:shadow-2xl text-center"
                    :style="{ background: tc.secondary, color: tc.ctaText }"
                  >
                    {{ primaryCtaText }} →
                  </a>
                  <a
                    href="#about"
                    class="rounded-md border-2 border-white/20 w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-white/80 hover:bg-white/10 hover:text-white transition-all text-center"
                  >
                    {{ secondaryCtaText }}
                  </a>
                </div>
              </div>

              <!-- Right: School Emblem -->
              <div class="hidden lg:flex shrink-0 items-center justify-center animate-float">
                <div class="relative">
                  <div
                    class="absolute -inset-6 rounded-full blur-2xl"
                    :style="{ background: tc.secondary + '1a' }"
                  ></div>
                  <div
                    v-if="heroVisual"
                    class="relative h-56 w-56 overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl shadow-2xl"
                    :style="{ boxShadow: '0 0 0 4px ' + tc.secondary + '33' }"
                  >
                    <img :src="heroVisual" class="h-full w-full object-cover" alt="Institution" />
                  </div>
                  <div
                    v-else
                    class="relative flex h-56 w-56 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-xl text-7xl font-black shadow-2xl text-white"
                    :style="{ boxShadow: '0 0 0 4px ' + tc.secondary + '33' }"
                  >
                    {{ tenant.name.charAt(0) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Slide indicators -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          <button
            v-for="(_, i) in heroSlides"
            :key="i"
            @click="activeSlide = i"
            :class="[
              'h-2 rounded-full transition-all duration-500',
              activeSlide === i ? 'w-8' : 'w-2 bg-white/30 hover:bg-white/50',
            ]"
            :style="activeSlide === i ? { background: tc.secondary } : {}"
          />
        </div>

        <!-- Slide arrows -->
        <button
          @click="prevSlide"
          class="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white/60 hover:bg-white/20 hover:text-white transition-all"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          @click="nextSlide"
          class="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white/60 hover:bg-white/20 hover:text-white transition-all"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>

      <!-- ══════════════════════════════════════════════════════════ -->
      <!-- ANNOUNCEMENT TICKER                                      -->
      <!-- ══════════════════════════════════════════════════════════ -->
      <div v-if="publicNotices.length" class="overflow-hidden relative z-30" :style="{ background: tc.secondary }">
        <div class="flex items-center">
          <div
            class="shrink-0 px-5 sm:px-6 py-3 flex items-center gap-2 z-10 shadow-lg"
            :style="{ background: tc.primary }"
          >
            <span class="h-2 w-2 rounded-full bg-red-400 animate-pulse"></span>
            <span class="text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.15em] text-white whitespace-nowrap"
              >Latest News</span
            >
          </div>
          <div class="overflow-hidden flex-1">
            <div class="animate-marquee whitespace-nowrap py-3 flex gap-10">
              <span
                v-for="(n, idx) in tickerNotices"
                :key="'ticker-' + idx"
                class="inline-flex items-center gap-2 text-xs sm:text-sm font-bold"
                :style="{ color: tc.ctaText }"
              >
                <span class="h-1.5 w-1.5 rounded-full shrink-0" :style="{ background: tc.ctaText + '66' }"></span>
                {{ n.title }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showSocialTicker && socialLinks.length" class="overflow-hidden border-y border-slate-100 bg-white">
        <div class="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2 sm:px-6">
          <span class="shrink-0 text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400"
            >Social Media Scroll</span
          >
          <div class="overflow-hidden flex-1">
            <div class="animate-marquee whitespace-nowrap flex items-center gap-8">
              <a
                v-for="(social, idx) in socialTickerItems"
                :key="'social-scroll-' + idx"
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                <span>{{ social.icon }}</span>
                <span>{{ social.label }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════════════ -->
      <!-- STATS COUNTER BAR                                        -->
      <!-- ══════════════════════════════════════════════════════════ -->
      <section ref="statsRef" class="relative z-20" :style="{ background: tc.primary }">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <div class="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            <div v-for="stat in stats" :key="stat.label" class="flex flex-col items-center py-8 sm:py-10 group">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xl sm:text-2xl">{{ stat.icon }}</span>
              </div>
              <p class="text-2xl sm:text-4xl font-black text-white tabular-nums">
                <span>{{ statsVisible ? stat.value : '0' }}</span
                ><span :style="{ color: tc.secondary }">+</span>
              </p>
              <p class="mt-1 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.25em] text-white/40">
                {{ stat.label }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════════════ -->
      <!-- ABOUT / WELCOME SECTION                                  -->
      <!-- ══════════════════════════════════════════════════════════ -->
      <section id="about" class="py-16 sm:py-24 bg-white">
        <div class="mx-auto max-w-6xl px-4 sm:px-6">
          <div class="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            <!-- Left: Principal Photo -->
            <div class="shrink-0 w-full lg:w-auto">
              <div class="relative max-w-sm mx-auto lg:mx-0">
                <div
                  class="absolute -top-4 -left-4 w-full h-full rounded-2xl"
                  :style="{ border: '2px solid ' + tc.secondary + '4d' }"
                ></div>
                <div class="relative overflow-hidden rounded-2xl bg-slate-100 shadow-2xl aspect-[3/4] max-h-[420px]">
                  <img v-if="aboutImage" :src="aboutImage" class="h-full w-full object-cover" alt="Institution" />
                  <div
                    v-else
                    class="flex h-full w-full items-center justify-center text-8xl text-white/20"
                    :style="{ background: 'linear-gradient(135deg, ' + tc.primary + ', ' + tc.primaryLight + ')' }"
                  >
                    👤
                  </div>
                </div>
                <div
                  class="absolute -bottom-5 -right-5 sm:-bottom-6 sm:-right-6 text-white rounded-xl px-5 py-3 sm:px-6 sm:py-4 shadow-xl"
                  :style="{ background: tc.primary }"
                >
                  <p class="text-sm sm:text-base font-black">{{ profile?.principal_name || 'The Principal' }}</p>
                  <p class="text-[10px] sm:text-xs font-semibold" :style="{ color: tc.secondary }">
                    {{ profile?.principal_designation || 'Principal' }}
                  </p>
                </div>
                <div
                  class="absolute -top-2 -right-2 h-8 w-8 rounded-tr-lg"
                  :style="{ borderTop: '4px solid ' + tc.secondary, borderRight: '4px solid ' + tc.secondary }"
                ></div>
              </div>
            </div>

            <!-- Right: Text -->
            <div class="flex-1 mt-6 lg:mt-0">
              <div
                class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4"
                :style="{ background: tc.primaryBg10 }"
              >
                <div class="h-1.5 w-1.5 rounded-full" :style="{ background: tc.secondary }"></div>
                <span class="text-[10px] font-extrabold uppercase tracking-[0.2em]" :style="{ color: tc.primary }"
                  >About Our Institution</span
                >
              </div>
              <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {{ aboutTitle }}
              </h2>
              <div class="mt-2 h-1 w-12 rounded-full" :style="{ background: tc.secondary }"></div>

              <p class="mt-6 text-sm sm:text-base text-slate-600 leading-relaxed">
                {{ aboutDescription }}
              </p>
              <p class="mt-4 text-sm sm:text-base text-slate-500 leading-relaxed">
                Whether it is through academics, sports, arts or community engagement, we aim to enable and equip our
                students to realize their potential and make meaningful contributions to society.
              </p>

              <div class="mt-8 flex flex-wrap gap-4">
                <div class="flex items-center gap-3 bg-slate-50 rounded-lg px-4 py-3">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-lg text-lg"
                    :style="{ background: tc.primaryBg10 }"
                  >
                    🎓
                  </div>
                  <div>
                    <p class="text-xs font-black text-slate-900">Academic Excellence</p>
                    <p class="text-[10px] text-slate-500">Result-oriented approach</p>
                  </div>
                </div>
                <div class="flex items-center gap-3 bg-slate-50 rounded-lg px-4 py-3">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-lg text-lg"
                    :style="{ background: tc.secondaryBg10 }"
                  >
                    🏅
                  </div>
                  <div>
                    <p class="text-xs font-black text-slate-900">Holistic Growth</p>
                    <p class="text-[10px] text-slate-500">Beyond textbooks</p>
                  </div>
                </div>
              </div>

              <a
                href="#facilities"
                class="mt-8 inline-flex items-center gap-2 text-sm font-bold transition-colors group"
                :style="{ color: tc.primary }"
              >
                Explore Our Campus
                <svg
                  class="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════════════ -->
      <!-- FACILITIES / INFRASTRUCTURE                              -->
      <!-- ══════════════════════════════════════════════════════════ -->
      <section id="facilities" class="py-16 sm:py-24 bg-slate-50">
        <div class="mx-auto max-w-6xl px-4 sm:px-6">
          <div class="text-center mb-12 sm:mb-16">
            <div
              class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4"
              :style="{ background: tc.primaryBg10 }"
            >
              <div class="h-1.5 w-1.5 rounded-full" :style="{ background: tc.secondary }"></div>
              <span class="text-[10px] font-extrabold uppercase tracking-[0.2em]" :style="{ color: tc.primary }"
                >Campus Infrastructure</span
              >
            </div>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              {{ facilitiesTitle }}
            </h2>
            <div class="mt-3 mx-auto h-1 w-12 rounded-full" :style="{ background: tc.secondary }"></div>
            <p class="mt-4 text-sm text-slate-500 max-w-2xl mx-auto">
              Our campus is equipped with state-of-the-art infrastructure designed to provide the best learning
              experience.
            </p>
          </div>

          <div class="relative">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              <div
                v-for="(facility, i) in visibleFacilities"
                :key="i"
                class="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
              >
                <div class="relative h-48 sm:h-52 overflow-hidden">
                  <img
                    :src="facility.image"
                    :alt="facility.title"
                    class="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div class="absolute bottom-4 left-4 right-4">
                    <h3 class="text-lg sm:text-xl font-black text-white drop-shadow-lg">{{ facility.title }}</h3>
                  </div>
                  <div
                    class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-6"
                    :style="{ background: tc.primary + 'cc' }"
                  >
                    <p
                      class="text-sm text-white/90 text-center leading-relaxed transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                    >
                      {{ facility.description }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center justify-between px-5 py-3 bg-white">
                  <span class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{{
                    facility.category
                  }}</span>
                  <div
                    :class="[
                      'h-6 w-6 rounded-full flex items-center justify-center text-xs transition-all',
                      facility.dotColor,
                    ]"
                    :style="{ '--hover-bg': tc.secondary }"
                  >
                    →
                  </div>
                </div>
              </div>
            </div>

            <div v-if="facilities.length > 6" class="mt-8 text-center">
              <button
                @click="showAllFacilities = !showAllFacilities"
                class="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all"
                :style="{ background: tc.primary }"
              >
                {{ showAllFacilities ? 'Show Less' : 'View All Facilities' }}
                <svg
                  :class="['h-4 w-4 transition-transform', showAllFacilities ? 'rotate-180' : '']"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section v-if="featureImages.length" id="feature-images" class="py-14 sm:py-20 bg-white">
        <div class="mx-auto max-w-6xl px-4 sm:px-6">
          <div class="mb-8 text-center">
            <div
              class="inline-flex items-center gap-2 rounded-full px-4 py-1.5"
              :style="{ background: tc.primaryBg10 }"
            >
              <div class="h-1.5 w-1.5 rounded-full" :style="{ background: tc.secondary }"></div>
              <span class="text-[10px] font-extrabold uppercase tracking-[0.2em]" :style="{ color: tc.primary }"
                >Feature Images</span
              >
            </div>
          </div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="(img, index) in featureImages"
              :key="'feature-' + index"
              class="group overflow-hidden rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <img
                :src="img"
                alt="Feature"
                class="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════════════ -->
      <!-- WHY CHOOSE US                                            -->
      <!-- ══════════════════════════════════════════════════════════ -->
      <section class="py-16 sm:py-24 relative overflow-hidden" :style="{ background: tc.primary }">
        <div
          class="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.04] blur-[120px]"
          :style="{ background: tc.secondary }"
        ></div>
        <div
          class="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-white opacity-[0.03] blur-[100px]"
        ></div>

        <div class="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div class="text-center mb-12 sm:mb-16">
            <div class="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 mb-4">
              <div class="h-1.5 w-1.5 rounded-full" :style="{ background: tc.secondary }"></div>
              <span class="text-[10px] font-extrabold uppercase tracking-[0.2em]" :style="{ color: tc.secondary }"
                >Why Choose Us</span
              >
            </div>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {{ whyChooseTitle }}
            </h2>
            <div class="mt-3 mx-auto h-1 w-12 rounded-full" :style="{ background: tc.secondary }"></div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            <div
              v-for="(feature, i) in features"
              :key="i"
              class="group relative rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 sm:p-8 hover:bg-white/10 transition-all duration-500"
              :style="{ '--hover-border': tc.secondary + '33' }"
            >
              <div
                class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent to-transparent transition-all duration-500"
                :style="{ '--via': tc.secondary + '80' }"
              ></div>
              <div
                class="flex h-14 w-14 items-center justify-center rounded-xl text-2xl group-hover:scale-110 transition-all"
                :style="{ background: tc.secondary + '26' }"
              >
                {{ feature.icon }}
              </div>
              <h3 class="mt-5 text-base sm:text-lg font-black text-white">{{ feature.title }}</h3>
              <p
                class="mt-2 text-xs sm:text-sm text-white/40 leading-relaxed group-hover:text-white/60 transition-colors"
              >
                {{ feature.description }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════════════ -->
      <!-- CAMPUS LIFE GALLERY                                      -->
      <!-- ══════════════════════════════════════════════════════════ -->
      <section id="gallery" class="py-16 sm:py-24 bg-white">
        <div class="mx-auto max-w-6xl px-4 sm:px-6">
          <div class="text-center mb-12 sm:mb-16">
            <div
              class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4"
              :style="{ background: tc.primaryBg10 }"
            >
              <div class="h-1.5 w-1.5 rounded-full" :style="{ background: tc.secondary }"></div>
              <span class="text-[10px] font-extrabold uppercase tracking-[0.2em]" :style="{ color: tc.primary }"
                >Life at Campus</span
              >
            </div>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              {{ galleryTitle }}
            </h2>
            <div class="mt-3 mx-auto h-1 w-12 rounded-full" :style="{ background: tc.secondary }"></div>
            <p class="mt-4 text-sm text-slate-500 max-w-2xl mx-auto">
              A vibrant ecosystem where learning extends beyond classrooms.
            </p>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            <div
              v-for="(item, i) in campusLife"
              :key="i"
              :class="['group relative overflow-hidden rounded-xl cursor-pointer', item.span]"
            >
              <div class="w-full h-full min-h-[140px] sm:min-h-[180px]">
                <img
                  :src="item.image"
                  :alt="item.title"
                  class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div
                class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col items-center justify-center p-4"
                :style="{ background: tc.primary + 'b3' }"
              >
                <span class="text-3xl mb-2">{{ item.icon }}</span>
                <p class="text-sm font-black text-white text-center">{{ item.title }}</p>
                <p class="text-[10px] text-white/60 text-center mt-1">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════════════ -->
      <!-- ACHIEVEMENTS                                             -->
      <!-- ══════════════════════════════════════════════════════════ -->
      <section class="py-16 sm:py-24 bg-slate-50">
        <div class="mx-auto max-w-6xl px-4 sm:px-6">
          <div class="text-center mb-12 sm:mb-16">
            <div
              class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4"
              :style="{ background: tc.primaryBg10 }"
            >
              <div class="h-1.5 w-1.5 rounded-full" :style="{ background: tc.secondary }"></div>
              <span class="text-[10px] font-extrabold uppercase tracking-[0.2em]" :style="{ color: tc.primary }"
                >Achievements</span
              >
            </div>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Our <span :style="{ color: tc.primary }">Accolades</span>
            </h2>
            <div class="mt-3 mx-auto h-1 w-12 rounded-full" :style="{ background: tc.secondary }"></div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            <div
              v-for="(ach, i) in achievements"
              :key="i"
              class="group flex items-start gap-4 rounded-2xl bg-white border border-slate-100 p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-400"
              :style="{ '--hover-border': tc.secondary + '33' }"
            >
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl group-hover:scale-110 transition-transform"
                :style="{ background: 'linear-gradient(135deg, ' + tc.secondary + '33, ' + tc.secondary + '0d)' }"
              >
                {{ ach.icon }}
              </div>
              <div>
                <h3
                  class="text-sm font-black text-slate-900 transition-colors"
                  :style="{ '--hover-color': tc.primary }"
                >
                  {{ ach.title }}
                </h3>
                <p class="mt-1 text-xs text-slate-500 leading-relaxed">{{ ach.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════════════ -->
      <!-- NOTICES / ANNOUNCEMENTS                                  -->
      <!-- ══════════════════════════════════════════════════════════ -->
      <section v-if="showNoticeBoard && publicNotices.length" id="notices" class="py-16 sm:py-24 bg-white">
        <div class="mx-auto max-w-6xl px-4 sm:px-6">
          <div class="text-center mb-12 sm:mb-14">
            <div
              class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4"
              :style="{ background: tc.primaryBg10 }"
            >
              <div class="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></div>
              <span class="text-[10px] font-extrabold uppercase tracking-[0.2em]" :style="{ color: tc.primary }"
                >Notice Board</span
              >
            </div>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Latest <span :style="{ color: tc.primary }">Announcements</span>
            </h2>
            <div class="mt-3 mx-auto h-1 w-12 rounded-full" :style="{ background: tc.secondary }"></div>
            <p class="mt-4 text-sm text-slate-500 max-w-xl mx-auto">
              Important updates and announcements from {{ tenant.name }}
            </p>
          </div>
          <div class="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="n in publicNotices"
              :key="n.id"
              class="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-400"
            >
              <div
                class="h-1 w-full opacity-0 group-hover:opacity-100 transition-opacity"
                :style="{ background: 'linear-gradient(to right, ' + tc.primary + ', ' + tc.secondary + ')' }"
              ></div>
              <div class="p-5 sm:p-6">
                <div class="flex items-start gap-4">
                  <div
                    class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl transition-all group-hover:scale-110"
                    :style="{ background: tc.primaryBg10 }"
                  >
                    📢
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-2">
                      <span
                        :class="[
                          'rounded-md px-2.5 py-0.5 text-[8px] font-extrabold uppercase tracking-widest',
                          n.audience === 'all' ? 'bg-slate-100 text-slate-700' : 'bg-amber-50 text-amber-700',
                        ]"
                        >{{ n.audience === 'all' ? 'All Students' : n.class_name }}</span
                      >
                    </div>
                    <h3
                      class="text-sm font-black text-slate-900 leading-snug transition-colors"
                      :style="{ '--hover-color': tc.primary }"
                    >
                      {{ n.title }}
                    </h3>
                    <p class="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-3">{{ n.message }}</p>
                    <p class="mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {{ n.published_at || n.created_at }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-if="websiteArticles.length" id="articles" class="py-16 sm:py-24 bg-slate-50">
        <div class="mx-auto max-w-6xl px-4 sm:px-6">
          <div class="mb-12 text-center sm:mb-14">
            <div
              class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4"
              :style="{ background: tc.primaryBg10 }"
            >
              <div class="h-1.5 w-1.5 rounded-full" :style="{ background: tc.secondary }"></div>
              <span class="text-[10px] font-extrabold uppercase tracking-[0.2em]" :style="{ color: tc.primary }"
                >Article Views</span
              >
            </div>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Insights & <span :style="{ color: tc.primary }">Stories</span>
            </h2>
            <div class="mt-3 mx-auto h-1 w-12 rounded-full" :style="{ background: tc.secondary }"></div>
          </div>
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <article
              v-for="(article, idx) in websiteArticles"
              :key="'article-view-' + idx"
              class="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <img
                :src="article.image"
                alt="Article"
                class="h-44 w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div class="p-5">
                <div class="mb-2 flex items-center justify-between">
                  <span
                    class="rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-slate-700"
                    >{{ article.category }}</span
                  >
                  <span class="text-[10px] font-bold text-slate-400"
                    >👁 {{ article.views.toLocaleString('en-IN') }}</span
                  >
                </div>
                <h3 class="text-sm font-black text-slate-900 leading-snug">{{ article.title }}</h3>
                <p class="mt-2 line-clamp-3 text-xs text-slate-500">{{ article.excerpt }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════════════ -->
      <!-- CONTACT                                                  -->
      <!-- ══════════════════════════════════════════════════════════ -->
      <section id="contact" class="py-16 sm:py-24 bg-slate-50">
        <div class="mx-auto max-w-6xl px-4 sm:px-6">
          <div class="text-center mb-12 sm:mb-16">
            <div
              class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4"
              :style="{ background: tc.primaryBg10 }"
            >
              <div class="h-1.5 w-1.5 rounded-full" :style="{ background: tc.secondary }"></div>
              <span class="text-[10px] font-extrabold uppercase tracking-[0.2em]" :style="{ color: tc.primary }"
                >Get In Touch</span
              >
            </div>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              {{ contactTitle }}
            </h2>
            <div class="mt-3 mx-auto h-1 w-12 rounded-full" :style="{ background: tc.secondary }"></div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                v-for="(card, i) in contactCards"
                :key="i"
                class="group rounded-xl bg-white border border-slate-100 p-6 shadow-sm hover:shadow-lg transition-all duration-400"
              >
                <div
                  class="flex h-12 w-12 items-center justify-center rounded-xl text-xl mb-4 group-hover:scale-110 transition-all"
                  :style="{ background: tc.primaryBg10 }"
                >
                  {{ card.icon }}
                </div>
                <p class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">{{ card.title }}</p>
                <p class="text-sm font-bold text-slate-900 leading-relaxed">{{ card.value }}</p>
              </div>
              <div
                class="group rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-400"
                :style="{ background: tc.primary }"
              >
                <div
                  class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-xl mb-4 group-hover:scale-110 transition-all"
                >
                  🕘
                </div>
                <p class="text-[10px] font-extrabold uppercase tracking-widest mb-1" :style="{ color: tc.secondary }">
                  Working Hours
                </p>
                <p class="text-sm font-bold text-white leading-relaxed">Mon - Sat: 8:00 AM - 3:00 PM</p>
                <p class="text-xs text-white/40 mt-1">Sunday & Public Holidays: Closed</p>
              </div>
            </div>

            <div
              class="rounded-xl overflow-hidden bg-slate-200 border border-slate-200 shadow-sm min-h-[280px] relative group"
            >
              <div
                class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
                :style="{ background: 'linear-gradient(135deg, ' + tc.primary + '0d, ' + tc.secondary + '0d)' }"
              >
                <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md text-3xl mb-4">
                  📍
                </div>
                <p class="text-base font-black text-slate-800">{{ tenant.name }}</p>
                <p class="text-sm text-slate-500 mt-2 max-w-xs">
                  {{ profile?.address || 'Campus Address' }}, {{ profile?.city || tenant.city }},
                  {{ profile?.state || tenant.state }} {{ profile?.pincode || '' }}
                </p>
                <a
                  v-if="profile?.address"
                  :href="
                    'https://maps.google.com/?q=' +
                    encodeURIComponent(
                      (profile.address || '') + ' ' + (profile.city || '') + ' ' + (profile.state || ''),
                    )
                  "
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-4 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-bold text-white transition-all shadow-md"
                  :style="{ background: tc.primary }"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  View on Google Maps
                </a>
              </div>
            </div>
          </div>

          <div v-if="hasSocial" class="mt-10 flex items-center justify-center gap-3">
            <a
              v-for="social in socialLinks"
              :key="social.url"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-200 text-lg shadow-sm hover:shadow-md hover:scale-110 transition-all duration-300"
            >
              {{ social.icon }}
            </a>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════════════ -->
      <!-- ADMISSIONS FORM                                          -->
      <!-- ══════════════════════════════════════════════════════════ -->
      <section id="admissions" class="relative py-16 sm:py-24 lg:py-28 overflow-hidden">
        <div
          class="absolute inset-0"
          :style="{
            background: 'linear-gradient(135deg, ' + tc.dark + ', ' + tc.primary + ', ' + tc.primaryLight + ')',
          }"
        ></div>
        <div
          class="absolute top-0 left-0 right-0 h-1"
          :style="{ background: 'linear-gradient(to right, transparent, ' + tc.secondary + ', transparent)' }"
        ></div>
        <div
          class="absolute bottom-0 left-0 right-0 h-1"
          :style="{ background: 'linear-gradient(to right, transparent, ' + tc.secondary + ', transparent)' }"
        ></div>
        <div
          class="absolute top-20 right-20 w-64 h-64 rounded-full opacity-5 blur-[100px]"
          :style="{ background: tc.secondary }"
        ></div>

        <div class="relative mx-auto max-w-2xl px-4 sm:px-6">
          <div class="text-center text-white mb-10 sm:mb-12">
            <div
              class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4"
              :style="{ background: tc.secondary + '26', border: '1px solid ' + tc.secondary + '33' }"
            >
              <div class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <span class="text-[10px] font-extrabold uppercase tracking-[0.2em]" :style="{ color: tc.secondary }"
                >Admissions Open</span
              >
            </div>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Begin Your Journey <span class="text-white/50">With Us</span>
            </h2>
            <div class="mt-3 mx-auto h-1 w-12 rounded-full" :style="{ background: tc.secondary }"></div>
            <p class="mt-4 text-xs sm:text-sm text-white/40 px-4">
              Fill out the form and our admissions team will get back within 24 hours.
            </p>
          </div>

          <div
            v-if="submitted"
            class="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-10 sm:p-12 text-center text-white animate-scale-in"
          >
            <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/20 text-4xl mb-6">
              ✅
            </div>
            <h3 class="text-xl sm:text-2xl font-black">Thank You!</h3>
            <p class="mt-3 text-sm text-white/60">
              Your inquiry has been submitted. We'll contact you within 24 hours.
            </p>
            <button
              @click="resetSubmission"
              class="mt-8 rounded-md px-8 py-3 text-sm font-bold transition-all"
              :style="{
                background: tc.secondary + '33',
                border: '1px solid ' + tc.secondary + '4d',
                color: tc.secondary,
              }"
            >
              Submit Another
            </button>
          </div>

          <form
            v-else
            @submit.prevent="handleSubmitInquiry"
            class="rounded-2xl bg-white/8 backdrop-blur-xl border border-white/12 p-6 sm:p-8 lg:p-10 shadow-2xl"
          >
            <div class="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2">
              <div>
                <label class="block text-[10px] font-extrabold uppercase tracking-widest text-white/50 mb-2"
                  >Student Name *</label
                >
                <input
                  v-model="inquiry.student_name"
                  required
                  class="w-full rounded-md border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none backdrop-blur-sm transition-colors"
                  :style="{ '--focus-border': tc.secondary + '66', '--focus-ring': tc.secondary + '33' }"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label class="block text-[10px] font-extrabold uppercase tracking-widest text-white/50 mb-2"
                  >Parent/Guardian *</label
                >
                <input
                  v-model="inquiry.parent_name"
                  required
                  class="w-full rounded-md border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none backdrop-blur-sm transition-colors"
                  placeholder="Parent name"
                />
              </div>
              <div>
                <label class="block text-[10px] font-extrabold uppercase tracking-widest text-white/50 mb-2"
                  >Phone *</label
                >
                <input
                  v-model="inquiry.phone"
                  type="tel"
                  required
                  class="w-full rounded-md border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none backdrop-blur-sm transition-colors"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label class="block text-[10px] font-extrabold uppercase tracking-widest text-white/50 mb-2"
                  >Email</label
                >
                <input
                  v-model="inquiry.email"
                  type="email"
                  class="w-full rounded-md border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none backdrop-blur-sm transition-colors"
                  placeholder="email@example.com"
                />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-[10px] font-extrabold uppercase tracking-widest text-white/50 mb-2"
                  >Class Applying For *</label
                >
                <input
                  v-model="inquiry.class_applying"
                  required
                  class="w-full rounded-md border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none backdrop-blur-sm transition-colors"
                  placeholder="e.g., Class 5, Nursery"
                />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-[10px] font-extrabold uppercase tracking-widest text-white/50 mb-2"
                  >Message</label
                >
                <textarea
                  v-model="inquiry.message"
                  rows="3"
                  class="w-full rounded-md border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none backdrop-blur-sm resize-none transition-colors"
                  placeholder="Any questions..."
                ></textarea>
              </div>
            </div>
            <button
              type="submit"
              class="group mt-7 w-full rounded-md py-4 text-sm font-extrabold shadow-xl transition-all hover:shadow-2xl hover:scale-[1.02]"
              :style="{ background: tc.secondary, color: tc.ctaText }"
            >
              <span class="flex items-center justify-center gap-2">
                Submit Admission Inquiry
                <svg
                  class="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </form>
        </div>
      </section>

      <a
        v-if="showWhatsappButton && whatsappLink"
        :href="whatsappLink"
        target="_blank"
        rel="noopener noreferrer"
        class="fixed bottom-6 right-6 z-[80] inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black text-white shadow-2xl transition-transform hover:scale-105"
        style="background: #25d366"
      >
        💬 WhatsApp
      </a>

      <!-- ══════════════════════════════════════════════════════════ -->
      <!-- FOOTER                                                   -->
      <!-- ══════════════════════════════════════════════════════════ -->
      <footer class="text-slate-400" :style="{ background: tc.dark }">
        <div
          class="h-1 w-full"
          :style="{
            background: 'linear-gradient(to right, ' + tc.primary + ', ' + tc.secondary + ', ' + tc.primary + ')',
          }"
        ></div>

        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-14 sm:py-20">
          <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <!-- Brand -->
            <div class="lg:col-span-1">
              <div class="flex items-center gap-3 mb-5">
                <div
                  v-if="profile?.logo_url"
                  class="h-12 w-12 overflow-hidden rounded-lg bg-white/10"
                  :style="{ boxShadow: '0 0 0 2px ' + tc.secondary + '33' }"
                >
                  <img :src="profile.logo_url" class="h-full w-full object-cover" alt="Logo" />
                </div>
                <div
                  v-else
                  class="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-white font-black"
                  :style="{ boxShadow: '0 0 0 2px ' + tc.secondary + '33' }"
                >
                  {{ tenant.name.charAt(0) }}
                </div>
                <div>
                  <p class="text-sm font-black text-white leading-tight">{{ tenant.name }}</p>
                  <p class="text-[10px] uppercase tracking-widest" :style="{ color: tc.secondary }">
                    {{ tenant.city }}, {{ tenant.state }}
                  </p>
                </div>
              </div>
              <p class="text-sm leading-relaxed text-slate-400 mb-5">
                {{
                  (
                    profile?.principal_message || 'Committed to excellence in education and holistic development.'
                  ).substring(0, 150)
                }}{{ profile?.principal_message && profile.principal_message.length > 150 ? '...' : '' }}
              </p>
              <div v-if="hasSocial" class="flex gap-2">
                <a
                  v-for="social in socialLinks"
                  :key="social.url"
                  :href="social.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-all"
                >
                  {{ social.icon }}
                </a>
              </div>
              <div
                v-if="profile?.board_affiliation"
                class="mt-5 rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 inline-block"
              >
                <p class="text-[9px] text-slate-500 uppercase tracking-widest">Affiliated to</p>
                <p class="text-xs font-bold text-white">{{ profile.board_affiliation }}</p>
              </div>
            </div>

            <!-- Quick Links -->
            <div>
              <h4 class="text-[10px] font-extrabold uppercase tracking-[0.25em] mb-5" :style="{ color: tc.secondary }">
                Quick Links
              </h4>
              <ul class="space-y-3">
                <li v-for="link in footerLinks" :key="link.label">
                  <a
                    :href="link.href"
                    class="group flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    <svg
                      class="h-3 w-3 text-slate-600 transition-colors"
                      :style="{ '--hover-color': tc.secondary }"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                    {{ link.label }}
                  </a>
                </li>
                <li>
                  <router-link
                    to="/login"
                    class="group flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    <svg class="h-3 w-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                    Staff / Admin Login
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/parent-portal"
                    class="group flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    <svg class="h-3 w-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                    Parent Portal
                  </router-link>
                </li>
              </ul>
            </div>

            <!-- Recent Notices -->
            <div>
              <h4 class="text-[10px] font-extrabold uppercase tracking-[0.25em] mb-5" :style="{ color: tc.secondary }">
                Recent Notices
              </h4>
              <div v-if="publicNotices.length" class="space-y-4">
                <div
                  v-for="n in publicNotices.slice(0, 3)"
                  :key="n.id"
                  class="group cursor-pointer border-l-2 border-white/10 pl-3 transition-colors"
                  :style="{ '--hover-border': tc.secondary }"
                >
                  <p
                    class="text-xs font-bold text-slate-300 group-hover:text-white transition-colors leading-snug line-clamp-2"
                  >
                    {{ n.title }}
                  </p>
                  <p class="mt-1 text-[10px] text-slate-600 uppercase tracking-wider">
                    {{ n.published_at || n.created_at }}
                  </p>
                </div>
              </div>
              <p v-else class="text-sm text-slate-600 italic">No recent notices.</p>
            </div>

            <!-- Contact -->
            <div>
              <h4 class="text-[10px] font-extrabold uppercase tracking-[0.25em] mb-5" :style="{ color: tc.secondary }">
                Contact Us
              </h4>
              <ul class="space-y-4">
                <li v-if="profile?.phone" class="flex items-start gap-3">
                  <span
                    class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-sm"
                    >📞</span
                  >
                  <div>
                    <p class="text-[9px] text-slate-600 uppercase tracking-widest mb-0.5">Phone</p>
                    <p class="text-sm text-slate-300">{{ profile.phone }}</p>
                  </div>
                </li>
                <li v-if="profile?.email || tenant.admin_email" class="flex items-start gap-3">
                  <span
                    class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-sm"
                    >✉️</span
                  >
                  <div>
                    <p class="text-[9px] text-slate-600 uppercase tracking-widest mb-0.5">Email</p>
                    <p class="text-sm text-slate-300 break-all">{{ profile?.email || tenant.admin_email }}</p>
                  </div>
                </li>
                <li v-if="profile?.address" class="flex items-start gap-3">
                  <span
                    class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-sm"
                    >📍</span
                  >
                  <div>
                    <p class="text-[9px] text-slate-600 uppercase tracking-widest mb-0.5">Address</p>
                    <p class="text-sm text-slate-300 leading-relaxed">
                      {{ profile.address }}, {{ profile.city }}, {{ profile.state }} {{ profile.pincode }}
                    </p>
                  </div>
                </li>
                <li v-if="profile?.udise_code" class="flex items-start gap-3">
                  <span
                    class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-sm"
                    >🏫</span
                  >
                  <div>
                    <p class="text-[9px] text-slate-600 uppercase tracking-widest mb-0.5">U-DISE Code</p>
                    <p class="text-sm text-slate-300 font-mono">{{ profile.udise_code }}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Footer Stats -->
        <div class="border-t border-white/5">
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-6">
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div class="flex flex-wrap gap-6">
                <div class="flex items-center gap-2">
                  <span class="text-lg">👨‍🎓</span>
                  <div>
                    <p class="text-xs font-black text-white">{{ tenant.total_students || '450' }}+</p>
                    <p class="text-[9px] text-slate-600 uppercase tracking-widest">Students</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-lg">👩‍🏫</span>
                  <div>
                    <p class="text-xs font-black text-white">{{ tenant.total_staff || '30' }}+</p>
                    <p class="text-[9px] text-slate-600 uppercase tracking-widest">Faculty</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-lg">🏆</span>
                  <div>
                    <p class="text-xs font-black text-white">Est. {{ profile?.established_year || '2000' }}</p>
                    <p class="text-[9px] text-slate-600 uppercase tracking-widest">Founded</p>
                  </div>
                </div>
              </div>
              <a
                href="#admissions"
                class="rounded-md px-5 py-2.5 text-[10px] font-extrabold uppercase tracking-widest transition-all hover:scale-105 shadow-lg"
                :style="{ background: tc.secondary, color: tc.ctaText }"
                >{{ primaryCtaText }} →</a
              >
            </div>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="border-t border-white/5">
          <div
            class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-4 flex flex-col items-center justify-between gap-2 sm:flex-row"
          >
            <p class="text-[10px] text-slate-600">
              © {{ new Date().getFullYear() }} <span class="text-slate-500 font-bold">{{ tenant.name }}</span
              >. All rights reserved.
            </p>
            <div class="flex items-center gap-4">
              <span class="text-[10px] text-slate-600"
                >Powered by <span class="font-bold text-slate-500">EduERP Platform</span></span
              >
              <span class="h-1 w-1 rounded-full bg-slate-800"></span>
              <span class="text-[10px] text-slate-600 cursor-pointer hover:text-slate-400 transition-colors"
                >Privacy Policy</span
              >
              <span class="h-1 w-1 rounded-full bg-slate-800"></span>
              <span class="text-[10px] text-slate-600 cursor-pointer hover:text-slate-400 transition-colors"
                >Terms of Use</span
              >
            </div>
          </div>
        </div>
      </footer>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTenantsStore } from '@/stores/tenants'
import { useNoticeStore } from '@/stores/notices'
import type { TenantSummary, InstitutionProfile } from '@/types'

const route = useRoute()
const tenantsStore = useTenantsStore()
const noticeStore = useNoticeStore()

const tenant = ref<TenantSummary | null>(null)
const profile = ref<InstitutionProfile | null>(null)
const submitted = ref(false)
const scrolled = ref(false)
const mobileMenuOpen = ref(false)
const pageRef = ref<HTMLElement | null>(null)
const statsRef = ref<HTMLElement | null>(null)
const statsVisible = ref(false)
const showAllFacilities = ref(false)
const activeSlide = ref(0)
let slideInterval: ReturnType<typeof setInterval> | null = null

const inquiry = reactive({ student_name: '', parent_name: '', phone: '', email: '', class_applying: '', message: '' })

function resetForm() {
  Object.assign(inquiry, { student_name: '', parent_name: '', phone: '', email: '', class_applying: '', message: '' })
}

function resetSubmission() {
  submitted.value = false
  resetForm()
}

// ═══════════════════════════════════════════════════
// THEME SYSTEM (driven by admin profile setting)
// ═══════════════════════════════════════════════════

const activeTheme = computed(() => profile.value?.website_theme || 'professional')

interface ThemeColors {
  primary: string
  primaryLight: string
  secondary: string
  dark: string
  ctaText: string
  primaryBg10: string
  secondaryBg10: string
}

const tc = computed<ThemeColors>(() => {
  if (activeTheme.value === 'premium') {
    return {
      primary: '#b91c1c',
      primaryLight: '#dc2626',
      secondary: '#f59e0b',
      dark: '#0f172a',
      ctaText: '#0f172a',
      primaryBg10: 'rgba(185,28,28,0.08)',
      secondaryBg10: 'rgba(245,158,11,0.10)',
    }
  }
  if (activeTheme.value === 'standard1') {
    return {
      primary: '#166534',
      primaryLight: '#15803d',
      secondary: '#d97706',
      dark: '#052e16',
      ctaText: '#052e16',
      primaryBg10: 'rgba(22,101,52,0.08)',
      secondaryBg10: 'rgba(217,119,6,0.08)',
    }
  }
  // Professional (default)
  return {
    primary: '#0f2557',
    primaryLight: '#1a3a7a',
    secondary: '#c8a951',
    dark: '#091638',
    ctaText: '#0f2557',
    primaryBg10: 'rgba(15,37,87,0.08)',
    secondaryBg10: 'rgba(200,169,81,0.08)',
  }
})

const themeVars = computed(() => ({
  '--c-primary': tc.value.primary,
  '--c-secondary': tc.value.secondary,
  '--c-dark': tc.value.dark,
}))

// Hero slides adapt to theme
const heroSlides = computed(() => {
  if (activeTheme.value === 'premium') {
    return [
      {
        bg: 'linear-gradient(135deg, #0f172a, #b91c1c, #dc2626)',
        overlay: 'radial-gradient(ellipse at top right, rgba(245,158,11,0.18), transparent 60%)',
      },
      {
        bg: 'linear-gradient(135deg, #111827, #991b1b, #b91c1c)',
        overlay: 'radial-gradient(ellipse at bottom left, rgba(245,158,11,0.16), transparent 55%)',
      },
      {
        bg: 'linear-gradient(135deg, #1f2937, #b91c1c, #7f1d1d)',
        overlay: 'radial-gradient(ellipse at center, rgba(255,255,255,0.05), transparent 60%)',
      },
    ]
  }
  if (activeTheme.value === 'standard1') {
    return [
      {
        bg: 'linear-gradient(135deg, #052e16, #166534, #15803d)',
        overlay: 'radial-gradient(ellipse at top right, rgba(217,119,6,0.12), transparent 60%)',
      },
      {
        bg: 'linear-gradient(135deg, #064e24, #166534, #14532d)',
        overlay: 'radial-gradient(ellipse at bottom left, rgba(217,119,6,0.10), transparent 50%)',
      },
      {
        bg: 'linear-gradient(135deg, #052e16, #15803d, #166534)',
        overlay: 'radial-gradient(ellipse at center, rgba(255,255,255,0.04), transparent 60%)',
      },
    ]
  }
  return [
    {
      bg: 'linear-gradient(135deg, #0a1628, #0f2557, #1a3a7a)',
      overlay: 'radial-gradient(ellipse at top right, rgba(200,169,81,0.12), transparent 60%)',
    },
    {
      bg: 'linear-gradient(135deg, #0d1f4a, #142d6b, #0f2557)',
      overlay: 'radial-gradient(ellipse at bottom left, rgba(200,169,81,0.10), transparent 50%)',
    },
    {
      bg: 'linear-gradient(135deg, #091638, #0f2557, #1e4088)',
      overlay: 'radial-gradient(ellipse at center, rgba(255,255,255,0.04), transparent 60%)',
    },
  ]
})

// ═══════════════════════════════════════════════════

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#facilities', label: 'Facilities' },
  { href: '#feature-images', label: 'Features' },
  { href: '#gallery', label: 'Campus Life' },
  { href: '#articles', label: 'Articles' },
  { href: '#notices', label: 'Notices' },
  { href: '#contact', label: 'Contact' },
  { href: '#admissions', label: 'Admissions' },
]

function nextSlide() {
  activeSlide.value = (activeSlide.value + 1) % heroSlides.value.length
  restartSlideTimer()
}
function prevSlide() {
  activeSlide.value = (activeSlide.value - 1 + heroSlides.value.length) % heroSlides.value.length
  restartSlideTimer()
}
function restartSlideTimer() {
  if (slideInterval) clearInterval(slideInterval)
  slideInterval = setInterval(() => {
    activeSlide.value = (activeSlide.value + 1) % heroSlides.value.length
  }, 5000)
}

onMounted(() => {
  const slug = route.params.slug as string
  const found = tenantsStore.getTenantBySlug(slug)
  if (found) {
    tenant.value = found
    profile.value = tenantsStore.getInstitutionProfile(found.id)
  }
  window.addEventListener('scroll', handleScroll)

  slideInterval = setInterval(() => {
    activeSlide.value = (activeSlide.value + 1) % heroSlides.value.length
  }, 5000)

  if (statsRef.value) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          statsVisible.value = true
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(statsRef.value)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (slideInterval) clearInterval(slideInterval)
})

function handleScroll() {
  scrolled.value = window.scrollY > 50
}

const stats = computed(() => [
  { icon: '👨‍🎓', value: tenant.value?.total_students || 450, label: 'Students' },
  { icon: '👩‍🏫', value: tenant.value?.total_staff || 30, label: 'Faculty Members' },
  {
    icon: '📅',
    value: profile.value?.established_year ? new Date().getFullYear() - profile.value.established_year : 20,
    label: 'Years of Excellence',
  },
  { icon: '💻', value: 100, label: 'Digital Campus' },
])

const heroTitle = computed(() => profile.value?.website_hero_title || tenant.value?.name || 'Welcome')
const heroSubtitle = computed(() => profile.value?.website_hero_subtitle || profile.value?.motto || '')
const heroVisual = computed(() => profile.value?.website_hero_image_url || profile.value?.logo_url || '')
const primaryCtaText = computed(() => profile.value?.website_primary_cta_text || 'Apply for Admission')
const secondaryCtaText = computed(() => profile.value?.website_secondary_cta_text || 'Explore More')
const aboutTitle = computed(() => profile.value?.website_about_title || "Shaping Tomorrow's Leaders")
const aboutDescription = computed(
  () =>
    profile.value?.website_about_description ||
    profile.value?.principal_message ||
    'At our institution, we are committed to nurturing young minds and shaping them into confident, responsible and compassionate global citizens. With a comprehensive holistic curriculum, ultra-modern facilities and a team of steadfast educators, we establish an atmosphere where creativity, curiosity and character thrive.',
)
const aboutImage = computed(() => profile.value?.website_about_image_url || profile.value?.principal_photo_url || '')
const facilitiesTitle = computed(() => profile.value?.website_facilities_title || 'World-Class Facilities')
const whyChooseTitle = computed(() => profile.value?.website_why_choose_title || 'Excellence in Every Dimension')
const galleryTitle = computed(() => profile.value?.website_gallery_title || 'Campus Life')
const contactTitle = computed(() => profile.value?.website_contact_title || "We'd Love to Hear From You")

const defaultFacilities = [
  {
    icon: '📚',
    title: 'Library',
    description:
      'A vibrant hub of knowledge with thousands of books, journals, and digital resources fostering a culture of reading and research.',
    image: 'https://picsum.photos/seed/erp-library/900/600',
    category: 'Academic',
    dotColor: 'bg-blue-100 text-blue-600',
  },
  {
    icon: '🔬',
    title: 'Science Laboratories',
    description:
      'State-of-the-art physics, chemistry, and biology labs equipped with modern apparatus, safety measures, and experiment kits.',
    image: 'https://picsum.photos/seed/erp-labs/900/600',
    category: 'Academic',
    dotColor: 'bg-purple-100 text-purple-600',
  },
  {
    icon: '💻',
    title: 'Tech-Savvy Classrooms',
    description:
      'Smart classrooms with interactive panels, projectors, and digital tools making teaching-learning process student-centric and multi-dimensional.',
    image: 'https://picsum.photos/seed/erp-classroom/900/600',
    category: 'Technology',
    dotColor: 'bg-cyan-100 text-cyan-600',
  },
  {
    icon: '🏃',
    title: 'Sports Complex',
    description:
      'Multi-sport facilities including playground, indoor courts, athletics track, and equipment for overall fitness and competitive sports.',
    image: 'https://picsum.photos/seed/erp-sports/900/600',
    category: 'Sports',
    dotColor: 'bg-green-100 text-green-600',
  },
  {
    icon: '🎭',
    title: 'Activity Room',
    description:
      'The Activity Room supports holistic development of children by enhancing physical, cognitive, emotional and social skills through engaging activities.',
    image: 'https://picsum.photos/seed/erp-activity/900/600',
    category: 'Co-Curricular',
    dotColor: 'bg-amber-100 text-amber-600',
  },
  {
    icon: '🎵',
    title: 'Dance & Music Studio',
    description:
      'Dedicated spaces where students immerse themselves in the performing arts and discover their creative potential. Equipped with professional instruments.',
    image: 'https://picsum.photos/seed/erp-music/900/600',
    category: 'Arts',
    dotColor: 'bg-rose-100 text-rose-600',
  },
  {
    icon: '🛡️',
    title: 'CCTV & Safety',
    description:
      'Complete CCTV surveillance across campus with 24/7 monitoring, fire safety systems, and trained security personnel for a safe environment.',
    image: 'https://picsum.photos/seed/erp-safety/900/600',
    category: 'Safety',
    dotColor: 'bg-slate-100 text-slate-600',
  },
  {
    icon: '🚌',
    title: 'Transport',
    description:
      'GPS-enabled fleet of school buses covering all major routes with trained drivers, attendants, and real-time tracking for parents.',
    image: 'https://picsum.photos/seed/erp-transport/900/600',
    category: 'Transport',
    dotColor: 'bg-indigo-100 text-indigo-600',
  },
  {
    icon: '🏥',
    title: 'Medical Room',
    description:
      'Fully equipped medical room with first-aid facilities and periodic health check-ups for all students by qualified medical professionals.',
    image: 'https://picsum.photos/seed/erp-medical/900/600',
    category: 'Health',
    dotColor: 'bg-red-100 text-red-600',
  },
]

const facilities = computed(() => {
  const custom = profile.value?.website_facilities || []
  if (!custom.length) return defaultFacilities
  return defaultFacilities.map((item, index) => {
    const source = custom[index]
    if (!source) return item
    return {
      ...item,
      title: source.title || item.title,
      description: source.description || item.description,
      category: source.category || item.category,
      image: source.image || item.image,
    }
  })
})

const visibleFacilities = computed(() => (showAllFacilities.value ? facilities.value : facilities.value.slice(0, 6)))

const features = [
  {
    icon: '📚',
    title: 'Academic Excellence',
    description:
      'Rigorous curriculum designed to foster critical thinking, creativity, and a lifelong love for learning with proven results.',
  },
  {
    icon: '🏆',
    title: 'Holistic Development',
    description:
      'Sports, arts, music, and leadership programs that develop well-rounded individuals ready for the future.',
  },
  {
    icon: '💻',
    title: 'Digital Campus',
    description: 'Smart classrooms, e-learning tools, and an integrated ERP system for seamless academic management.',
  },
  {
    icon: '🛡️',
    title: 'Safe Environment',
    description:
      'CCTV-monitored campus with strict safety protocols ensuring a secure and nurturing learning environment.',
  },
  {
    icon: '👨‍🏫',
    title: 'Expert Faculty',
    description: 'Highly qualified and dedicated educators passionate about teaching, mentoring, and nurturing talent.',
  },
  {
    icon: '🌍',
    title: 'Global Exposure',
    description:
      'Student exchange programs, international competitions, and global perspectives preparing world citizens.',
  },
]

const defaultCampusLife = [
  {
    icon: '🎨',
    title: 'Art & Craft',
    description: 'Creative expression',
    image: 'https://picsum.photos/seed/erp-art/900/700',
    span: 'col-span-1 row-span-1',
  },
  {
    icon: '⚽',
    title: 'Sports Day',
    description: 'Annual competitions',
    image: 'https://picsum.photos/seed/erp-sportsday/900/700',
    span: 'col-span-1 sm:col-span-1 row-span-1 sm:row-span-2',
  },
  {
    icon: '🎭',
    title: 'Annual Day',
    description: 'Cultural celebrations',
    image: 'https://picsum.photos/seed/erp-annualday/900/700',
    span: 'col-span-1 row-span-1',
  },
  {
    icon: '🔬',
    title: 'Science Fair',
    description: 'Innovation showcase',
    image: 'https://picsum.photos/seed/erp-sciencefair/900/700',
    span: 'col-span-1 row-span-1',
  },
  {
    icon: '📖',
    title: 'Reading Club',
    description: 'Literary exploration',
    image: 'https://picsum.photos/seed/erp-reading/900/700',
    span: 'col-span-1 row-span-1',
  },
  {
    icon: '🏅',
    title: 'Award Ceremony',
    description: 'Celebrating excellence',
    image: 'https://picsum.photos/seed/erp-awards/900/700',
    span: 'col-span-2 sm:col-span-1 row-span-1',
  },
  {
    icon: '🌱',
    title: 'Eco Club',
    description: 'Environmental awareness',
    image: 'https://picsum.photos/seed/erp-ecoclub/900/700',
    span: 'col-span-1 row-span-1',
  },
  {
    icon: '🎵',
    title: 'Music Fest',
    description: 'Performing arts',
    image: 'https://picsum.photos/seed/erp-musicfest/900/700',
    span: 'col-span-1 row-span-1',
  },
]

const campusLife = computed(() => {
  const customMedia = profile.value?.website_campus_media || []
  if (customMedia.length) {
    return defaultCampusLife.map((item, index) => {
      const source = customMedia[index]
      if (!source) return item
      return {
        ...item,
        title: source.title || item.title,
        description: source.description || item.description,
        image: source.image || item.image,
      }
    })
  }

  const custom = profile.value?.website_gallery_images || []
  if (!custom.length) return defaultCampusLife
  return defaultCampusLife.map((item, index) => ({
    ...item,
    image: custom[index] || item.image,
  }))
})

const achievements = [
  {
    icon: '🏆',
    title: '100% Board Results',
    description: 'Consistent outstanding performance in board examinations with distinction holders every year.',
  },
  {
    icon: '🥇',
    title: 'Sports Champions',
    description: 'Multiple state and national level victories in athletics, cricket, basketball, and other sports.',
  },
  {
    icon: '🎓',
    title: 'Top University Placements',
    description: 'Alumni placed in premier institutions like IITs, NITs, AIIMS, and leading universities globally.',
  },
  {
    icon: '🔬',
    title: 'Science Olympiad Winners',
    description: 'Regular winners at National Science Olympiad, Math Olympiad, and other academic competitions.',
  },
  {
    icon: '🎭',
    title: 'Cultural Excellence',
    description: 'Awards in inter-school cultural fests, debate competitions, and performing arts events.',
  },
  {
    icon: '🌿',
    title: 'Green Campus Award',
    description:
      'Recognized for sustainability initiatives, eco-friendly practices, and environmental awareness programs.',
  },
]

const contactCards = computed(() => [
  {
    icon: '📍',
    title: 'Visit Us',
    value: `${profile.value?.address || 'Campus'}, ${profile.value?.city || tenant.value?.city}, ${profile.value?.state || tenant.value?.state}`,
  },
  { icon: '📞', title: 'Call Us', value: profile.value?.phone || 'Contact available soon' },
  { icon: '✉️', title: 'Email Us', value: profile.value?.email || tenant.value?.admin_email || 'info@institution.edu' },
])

const hasSocial = computed(
  () =>
    profile.value?.social_facebook ||
    profile.value?.social_instagram ||
    profile.value?.social_twitter ||
    profile.value?.social_youtube,
)

const showWhatsappButton = computed(() => profile.value?.website_show_whatsapp_button !== false)
const showSocialTicker = computed(() => profile.value?.website_show_social_ticker !== false)
const showNoticeBoard = computed(() => profile.value?.website_show_notice_board !== false)

const whatsappLink = computed(() => {
  const raw = (profile.value?.website_whatsapp_number || '').trim()
  if (!raw) return ''
  const normalized = raw.replace(/[^\d]/g, '')
  if (!normalized) return ''
  return `https://wa.me/${normalized}`
})

const socialLinks = computed(() => {
  const links: { icon: string; label: string; url: string }[] = []
  if (profile.value?.social_facebook) links.push({ icon: '📘', label: 'Facebook', url: profile.value.social_facebook })
  if (profile.value?.social_instagram)
    links.push({ icon: '📸', label: 'Instagram', url: profile.value.social_instagram })
  if (profile.value?.social_twitter) links.push({ icon: '🐦', label: 'X / Twitter', url: profile.value.social_twitter })
  if (profile.value?.social_youtube) links.push({ icon: '📺', label: 'YouTube', url: profile.value.social_youtube })
  return links
})

const socialTickerItems = computed(() => {
  const base = socialLinks.value
  return [...base, ...base]
})

const featureImages = computed(() => {
  const list = profile.value?.website_feature_images || []
  return list.filter(Boolean).slice(0, 9)
})

const websiteArticles = computed(() => {
  const list = profile.value?.website_articles || []
  return list.filter((a) => !!a.title && !!a.excerpt && !!a.image).slice(0, 6)
})

function handleSubmitInquiry() {
  if (!tenant.value) return
  tenantsStore.submitInquiry({ tenant_id: tenant.value.id, ...inquiry })
  submitted.value = true
}

const publicNotices = computed(() =>
  noticeStore.notices
    .filter((n) => n.status === 'published')
    .sort((a, b) => (b.published_at || b.created_at).localeCompare(a.published_at || a.created_at))
    .slice(0, 6),
)

const tickerNotices = computed(() => [...publicNotices.value, ...publicNotices.value])

const footerLinks = [
  { href: '#about', label: 'About Us' },
  { href: '#facilities', label: 'Facilities' },
  { href: '#feature-images', label: 'Feature Images' },
  { href: '#articles', label: 'Articles' },
  { href: '#gallery', label: 'Campus Life' },
  { href: '#notices', label: 'Notice Board' },
  { href: '#contact', label: 'Contact' },
  { href: '#admissions', label: 'Admissions' },
]
</script>

<style scoped>
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
.animate-slide-up {
  animation: slideUp 0.7s ease-out both;
}
.animate-scale-in {
  animation: scaleIn 0.5s ease-out forwards;
}
.animate-marquee {
  animation: marquee 30s linear infinite;
}

.animation-delay-100 {
  animation-delay: 100ms;
}
.animation-delay-200 {
  animation-delay: 200ms;
}
.animation-delay-300 {
  animation-delay: 300ms;
}
.animation-delay-400 {
  animation-delay: 400ms;
}

/* Hero slide transitions */
.hero-slide-enter-active {
  transition: opacity 1s ease-in-out;
}
.hero-slide-leave-active {
  transition: opacity 1s ease-in-out;
  position: absolute;
  inset: 0;
}
.hero-slide-enter-from {
  opacity: 0;
}
.hero-slide-leave-to {
  opacity: 0;
}

/* Form focus states using CSS vars */
input:focus,
textarea:focus {
  border-color: var(--c-secondary, #c8a951) !important;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--c-secondary, #c8a951) 20%, transparent) !important;
}
</style>

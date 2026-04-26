import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { TenantSummary, InstitutionProfile, AdmissionInquiry, SubscriptionEvent } from '@/types'
import { calcMonthlyBill, TRIAL_DAYS_DEFAULT } from '@/types'
import { saveToStorage, loadFromStorage } from '@/utils/storage'
import {
  buildTenantSlug,
  normalizeTenantList,
  superadminService,
  type ProvisionTenantResult,
} from '@/services/superadminService'

const today = () => new Date().toISOString().split('T')[0]

function addDays(fromDate: string | undefined, days: number): string {
  const base = fromDate ? new Date(fromDate) : new Date()
  if (isNaN(base.getTime())) base.setTime(Date.now())
  base.setDate(base.getDate() + days)
  return base.toISOString().split('T')[0]
}

function addMonths(months: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() + months)
  return d.toISOString().split('T')[0]
}

function makeEvent(
  action: SubscriptionEvent['action'],
  note?: string,
  extra?: Partial<SubscriptionEvent>,
): SubscriptionEvent {
  return {
    id: Date.now().toString(),
    action,
    performed_by: 'SuperAdmin',
    performed_at: new Date().toISOString(),
    note,
    ...extra,
  }
}

const demoTenants: TenantSummary[] = [
  {
    id: 'tenant_dps',
    slug: 'delhi-public-school',
    name: 'Delhi Public School',
    type: 'school',
    city: 'New Delhi',
    state: 'Delhi',
    subscription_plan: 'premium',
    subscription_status: 'active',
    admin_email: 'admin@school.com',
    admin_name: 'Admin User',
    total_students: 450,
    total_staff: 32,
    onboarded_at: '2026-01-15T00:00:00.000Z',
    logo_url: '',
    subscription_end: addDays(undefined, 45),
    subscription_history: [
      makeEvent('trial_started', '15-day trial started on onboarding', { days_added: 15 }),
      makeEvent('plan_upgraded', 'Upgraded to Premium - 12 months', { plan: 'premium' }),
    ],
  },
  {
    id: 'tenant_sxc',
    slug: 'st-xaviers-college',
    name: "St. Xavier's College",
    type: 'college',
    city: 'Mumbai',
    state: 'Maharashtra',
    subscription_plan: 'standard',
    subscription_status: 'active',
    admin_email: 'principal@stxaviers.edu',
    admin_name: "Fr. Thomas D'Souza",
    total_students: 2800,
    total_staff: 120,
    onboarded_at: '2026-02-01T00:00:00.000Z',
    logo_url: '',
    subscription_end: addDays(undefined, 12),
    subscription_history: [makeEvent('plan_upgraded', 'Standard plan activated', { plan: 'standard' })],
  },
  {
    id: 'tenant_bright',
    slug: 'bright-future-academy',
    name: 'Bright Future Academy',
    type: 'coaching',
    city: 'Kota',
    state: 'Rajasthan',
    subscription_plan: 'trial',
    subscription_status: 'trial',
    admin_email: 'admin@brightfuture.in',
    admin_name: 'Rajesh Agarwal',
    total_students: 180,
    total_staff: 15,
    onboarded_at: '2026-03-20T00:00:00.000Z',
    logo_url: '',
    trial_ends_at: addDays(undefined, 4),
    subscription_history: [makeEvent('trial_started', '15-day trial activated', { days_added: 15 })],
  },
  {
    id: 'tenant_kvno1',
    slug: 'kv-no1-ranchi',
    name: 'KV No.1 Ranchi',
    type: 'school',
    city: 'Ranchi',
    state: 'Jharkhand',
    subscription_plan: 'trial',
    subscription_status: 'expired',
    admin_email: 'principal@kvno1.edu.in',
    admin_name: 'R.K. Sharma',
    total_students: 320,
    total_staff: 25,
    onboarded_at: '2026-03-01T00:00:00.000Z',
    logo_url: '',
    trial_ends_at: addDays(undefined, -3),
    subscription_history: [
      makeEvent('trial_started', '15-day trial', { days_added: 15 }),
      makeEvent('expired', 'Trial period ended'),
    ],
  },
]

export const useTenantsStore = defineStore('tenants', () => {
  const saved = loadFromStorage<TenantSummary[]>('platform_tenants')
  const savedInquiries = loadFromStorage<AdmissionInquiry[]>('admission_inquiries')
  const tenants = ref<TenantSummary[]>(saved || [...demoTenants])
  const inquiries = ref<AdmissionInquiry[]>(savedInquiries || [])
  const loading = ref(false)
  const usingFallbackData = ref(!saved)
  const lastSyncAt = ref<string | null>(saved ? new Date().toISOString() : null)

  watch(tenants, (val) => saveToStorage('platform_tenants', val), { deep: true })
  watch(inquiries, (val) => saveToStorage('admission_inquiries', val), { deep: true })

  const activeTenants = computed(() => tenants.value.filter((t) => t.subscription_status === 'active'))
  const trialTenants = computed(() => tenants.value.filter((t) => t.subscription_status === 'trial'))
  const totalStudentsAcross = computed(() => tenants.value.reduce((s, t) => s + t.total_students, 0))
  const totalStaffAcross = computed(() => tenants.value.reduce((s, t) => s + t.total_staff, 0))

  function saveInstitutionProfile(
    tenant: Pick<TenantSummary, 'id' | 'slug' | 'name' | 'type' | 'city' | 'state' | 'admin_email' | 'admin_name'>,
    data: {
      board: string
      plan: InstitutionProfile['subscription_plan']
    },
  ) {
    const subscriptionStatus = data.plan === 'trial' ? 'trial' : 'active'

    const institutionProfile: InstitutionProfile = {
      id: tenant.id,
      slug: tenant.slug,
      name: tenant.name,
      type: tenant.type,
      logo_url: '',
      address: '',
      city: tenant.city,
      state: tenant.state,
      pincode: '',
      phone: '',
      email: tenant.admin_email,
      website_url: '',
      board_affiliation: data.board,
      udise_code: '',
      principal_name: tenant.admin_name,
      principal_photo_url: '',
      principal_designation: 'Principal',
      principal_message: '',
      established_year: new Date().getFullYear(),
      motto: '',
      social_facebook: '',
      social_instagram: '',
      social_twitter: '',
      social_youtube: '',
      public_website_enabled: false,
      website_theme: 'professional',
      website_hero_title: '',
      website_hero_subtitle: '',
      website_hero_image_url: '',
      website_about_title: '',
      website_about_description: '',
      website_about_image_url: '',
      website_gallery_images: [],
      website_primary_cta_text: '',
      website_secondary_cta_text: '',
      website_facilities_title: '',
      website_why_choose_title: '',
      website_gallery_title: '',
      website_contact_title: '',
      website_facilities: [],
      website_campus_media: [],
      website_whatsapp_number: '',
      website_show_whatsapp_button: true,
      website_show_social_ticker: true,
      website_show_notice_board: true,
      website_feature_images: [],
      website_articles: [],
      subscription_plan: data.plan,
      subscription_status: subscriptionStatus,
      onboarded_at: new Date().toISOString(),
      admin_email: tenant.admin_email,
      admin_name: tenant.admin_name,
      total_students: 0,
      total_staff: 0,
    }

    saveToStorage(`institution_${tenant.id}`, institutionProfile)
  }

  async function fetchTenants(): Promise<TenantSummary[]> {
    loading.value = true
    try {
      const liveTenants = await superadminService.listTenants()
      tenants.value = liveTenants
      usingFallbackData.value = false
      lastSyncAt.value = new Date().toISOString()
      return liveTenants
    } catch (error) {
      usingFallbackData.value = true
      throw error
    } finally {
      loading.value = false
    }
  }

  async function onboardInstitution(data: {
    name: string
    type: InstitutionProfile['type']
    city: string
    state: string
    board: string
    admin_name: string
    admin_email: string
    admin_phone: string
    plan: InstitutionProfile['subscription_plan']
    admin_password: string
    seed_demo?: boolean
  }): Promise<{ tenant: TenantSummary; provision: ProvisionTenantResult }> {
    loading.value = true

    try {
      const slug = buildTenantSlug(data.name)
      const provision = await superadminService.provisionTenant({
        name: data.name,
        slug,
        type: data.type,
        board: data.board,
        city: data.city,
        state: data.state,
        adminName: data.admin_name,
        adminEmail: data.admin_email,
        adminPhone: data.admin_phone,
        adminPassword: data.admin_password,
        plan: data.plan,
        seedDemo: data.seed_demo,
      })

      let tenant =
        tenants.value.find((item) => item.id === provision.tenantId || item.slug === provision.slug) ||
        ({
          id: provision.tenantId,
          slug: provision.slug,
          name: data.name,
          type: data.type,
          city: data.city,
          state: data.state,
          subscription_plan: data.plan,
          subscription_status: data.plan === 'trial' ? 'trial' : 'active',
          admin_email: data.admin_email,
          admin_name: data.admin_name,
          total_students: 0,
          total_staff: 0,
          onboarded_at: new Date().toISOString(),
          logo_url: '',
        } satisfies TenantSummary)

      try {
        const liveTenants = await superadminService.listTenants()
        tenants.value = liveTenants
        usingFallbackData.value = false
        lastSyncAt.value = new Date().toISOString()
        tenant = liveTenants.find((item) => item.id === provision.tenantId || item.slug === provision.slug) || tenant
      } catch {
        tenants.value = [tenant, ...tenants.value.filter((item) => item.id !== tenant.id)]
        usingFallbackData.value = true
      }

      saveInstitutionProfile(tenant, {
        board: data.board,
        plan: tenant.subscription_plan,
      })

      return { tenant, provision }
    } finally {
      loading.value = false
    }
  }

  async function suspendTenant(id: string) {
    loading.value = true
    try {
      await superadminService.suspendTenant(id)
      const t = tenants.value.find((t) => t.id === id)
      if (t) {
        t.subscription_status = 'suspended'
        if (!t.subscription_history) t.subscription_history = []
        t.subscription_history.unshift(makeEvent('suspended', 'Manually suspended by SuperAdmin'))
      }
    } finally {
      loading.value = false
    }
  }

  async function activateTenant(id: string) {
    loading.value = true
    try {
      await superadminService.activateTenant(id)
      const t = tenants.value.find((t) => t.id === id)
      if (t) {
        t.subscription_status = 'active'
        if (t.subscription_plan === 'trial') t.subscription_plan = 'basic'
        if (!t.subscription_history) t.subscription_history = []
        t.subscription_history.unshift(makeEvent('activated', 'Reactivated by SuperAdmin'))
      }
    } finally {
      loading.value = false
    }
  }

  // ── New subscription control actions ────────────────────────

  function activateTrial(id: string, days: number = TRIAL_DAYS_DEFAULT) {
    const t = tenants.value.find((t) => t.id === id)
    if (!t) return
    t.subscription_status = 'trial'
    t.subscription_plan = 'trial'
    t.trial_ends_at = addDays(undefined, days)
    if (!t.subscription_history) t.subscription_history = []
    t.subscription_history.unshift(makeEvent('trial_started', `${days}-day trial activated`, { days_added: days }))
  }

  function extendTrial(id: string, days: number) {
    const t = tenants.value.find((t) => t.id === id)
    if (!t) return
    t.trial_ends_at = addDays(t.trial_ends_at, days)
    if (t.subscription_status === 'expired') t.subscription_status = 'trial'
    if (!t.subscription_history) t.subscription_history = []
    t.subscription_history.unshift(makeEvent('trial_extended', `Trial extended by ${days} days`, { days_added: days }))
  }

  function upgradePlan(id: string, plan: TenantSummary['subscription_plan'], months: number) {
    const t = tenants.value.find((t) => t.id === id)
    if (!t) return
    t.subscription_plan = plan
    t.subscription_status = 'active'
    t.subscription_end = addMonths(months)
    if (!t.subscription_history) t.subscription_history = []
    t.subscription_history.unshift(makeEvent('plan_upgraded', `Plan set to ${plan} for ${months} months`, { plan }))
  }

  function renewSubscription(id: string, months: number) {
    const t = tenants.value.find((t) => t.id === id)
    if (!t) return
    // Extend from existing end date or from today
    const base = t.subscription_end && new Date(t.subscription_end) > new Date() ? t.subscription_end : undefined
    const newEnd = base ? (() => { const d = new Date(base); d.setMonth(d.getMonth() + months); return d.toISOString().split('T')[0] })() : addMonths(months)
    t.subscription_end = newEnd
    t.subscription_status = 'active'
    if (!t.subscription_history) t.subscription_history = []
    t.subscription_history.unshift(makeEvent('subscription_renewed', `Renewed for ${months} months`))
  }

  function expireTenant(id: string) {
    const t = tenants.value.find((t) => t.id === id)
    if (!t) return
    t.subscription_status = 'expired'
    if (!t.subscription_history) t.subscription_history = []
    t.subscription_history.unshift(makeEvent('expired', 'Manually marked as expired by SuperAdmin'))
  }

  function getDaysRemaining(t: TenantSummary): number {
    const endDate = t.subscription_status === 'trial' ? t.trial_ends_at : t.subscription_end
    if (!endDate) return 0
    const diff = new Date(endDate).getTime() - Date.now()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  function getMonthlyBill(t: TenantSummary) {
    return calcMonthlyBill(t.total_students)
  }

  function getTenantBySlug(slug: string): TenantSummary | undefined {
    return tenants.value.find((t) => t.slug === slug)
  }

  function getInstitutionProfile(tenantId: string): InstitutionProfile | null {
    return loadFromStorage<InstitutionProfile>(`institution_${tenantId}`)
  }

  function submitInquiry(inquiry: Omit<AdmissionInquiry, 'id' | 'status' | 'submitted_at'>) {
    inquiries.value.push({
      ...inquiry,
      id: Date.now(),
      status: 'new',
      submitted_at: new Date().toISOString(),
    })
  }

  function getInquiriesForTenant(tenantId: string) {
    return inquiries.value.filter((i) => i.tenant_id === tenantId)
  }

  /** Replace the in-memory list with normalized data returned from the real API. */
  function setTenantsFromApi(apiTenants: unknown[]) {
    const items = Array.isArray(apiTenants) ? apiTenants : []
    if (items.length === 0) {
      tenants.value = []
    } else if ('subscription_plan' in (items[0] as Record<string, unknown>)) {
      tenants.value = items as TenantSummary[]
    } else {
      tenants.value = normalizeTenantList(items as Parameters<typeof normalizeTenantList>[0])
    }
    usingFallbackData.value = false
    lastSyncAt.value = new Date().toISOString()
  }

  return {
    tenants,
    inquiries,
    loading,
    usingFallbackData,
    lastSyncAt,
    activeTenants,
    trialTenants,
    totalStudentsAcross,
    totalStaffAcross,
    fetchTenants,
    onboardInstitution,
    suspendTenant,
    activateTenant,
    activateTrial,
    extendTrial,
    upgradePlan,
    renewSubscription,
    expireTenant,
    getDaysRemaining,
    getMonthlyBill,
    setTenantsFromApi,
    getTenantBySlug,
    getInstitutionProfile,
    submitInquiry,
    getInquiriesForTenant,
  }
})

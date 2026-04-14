import api from './api'
import type { InstitutionProfile, TenantSummary } from '@/types'

type TenantPlan = InstitutionProfile['subscription_plan']
type BackendTenantPlan = Exclude<TenantPlan, 'trial'>
type TenantStatus = TenantSummary['subscription_status']

interface SuperadminStatsPayload {
  totalTenants?: number
  activeTenants?: number
  trialTenants?: number
  suspendedTenants?: number
  totalStudentsAcross?: number
  totalStaffAcross?: number
}

interface BackendTenantSummary {
  id: string
  slug: string
  name: string
  type: TenantSummary['type']
  city: string
  state: string
  plan: BackendTenantPlan
  status: TenantStatus
  adminName: string
  adminEmail: string
  totalStudents?: number | null
  totalStaff?: number | null
  createdAt: string
}

interface ProvisionTenantPayload {
  name: string
  slug: string
  type: TenantSummary['type']
  board?: string
  city: string
  state: string
  adminName: string
  adminEmail: string
  adminPhone: string
  adminPasswordPlain: string
  plan: BackendTenantPlan
  seedDemo: boolean
}

export interface PlatformStats {
  total: number
  active: number
  trial: number
  suspended: number
  totalStudents: number
  totalStaff: number
}

export interface ProvisionTenantInput {
  name: string
  slug: string
  type: TenantSummary['type']
  board?: string
  city: string
  state: string
  adminName: string
  adminEmail: string
  adminPhone: string
  adminPassword: string
  plan: TenantPlan
  seedDemo?: boolean
}

export interface ProvisionTenantResult {
  tenantId: string
  slug: string
  dbName: string
  subdomain: string
  adminCredentials: {
    email: string
    password: string
  }
}

type ApiError = {
  message?: string
  response?: {
    data?: {
      message?: string
      error?: {
        message?: string
      }
    }
  }
}

export function buildTenantSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40)
}

export function normalizeTenantPlan(plan: BackendTenantPlan, status: TenantStatus): TenantPlan {
  if (status === 'trial' && plan === 'basic') {
    return 'trial'
  }

  return plan
}

export function toProvisionPlan(plan: TenantPlan): BackendTenantPlan {
  return plan === 'trial' ? 'basic' : plan
}

export function normalizeTenantSummary(tenant: BackendTenantSummary): TenantSummary {
  return {
    id: tenant.id,
    slug: tenant.slug,
    name: tenant.name,
    type: tenant.type,
    city: tenant.city,
    state: tenant.state,
    subscription_plan: normalizeTenantPlan(tenant.plan, tenant.status),
    subscription_status: tenant.status,
    admin_email: tenant.adminEmail,
    admin_name: tenant.adminName,
    total_students: Number(tenant.totalStudents ?? 0),
    total_staff: Number(tenant.totalStaff ?? 0),
    onboarded_at: tenant.createdAt,
    logo_url: '',
  }
}

export function normalizeTenantList(tenants: BackendTenantSummary[]): TenantSummary[] {
  return tenants.map(normalizeTenantSummary)
}

export function normalizePlatformStats(stats: SuperadminStatsPayload | null | undefined): PlatformStats {
  return {
    total: Number(stats?.totalTenants ?? 0),
    active: Number(stats?.activeTenants ?? 0),
    trial: Number(stats?.trialTenants ?? 0),
    suspended: Number(stats?.suspendedTenants ?? 0),
    totalStudents: Number(stats?.totalStudentsAcross ?? 0),
    totalStaff: Number(stats?.totalStaffAcross ?? 0),
  }
}

export function extractApiErrorMessage(error: unknown, fallback: string): string {
  const apiError = error as ApiError
  return apiError.response?.data?.error?.message || apiError.response?.data?.message || apiError.message || fallback
}

export const superadminService = {
  async getPlatformStats(): Promise<PlatformStats> {
    const response = await api.get('/superadmin/stats')
    return normalizePlatformStats(response.data?.data)
  },

  async listTenants(): Promise<TenantSummary[]> {
    const response = await api.get('/superadmin/tenants')
    const tenants = Array.isArray(response.data?.data) ? response.data.data : []
    return normalizeTenantList(tenants)
  },

  async provisionTenant(input: ProvisionTenantInput): Promise<ProvisionTenantResult> {
    const payload: ProvisionTenantPayload = {
      name: input.name,
      slug: input.slug || buildTenantSlug(input.name),
      type: input.type,
      board: input.board || undefined,
      city: input.city,
      state: input.state,
      adminName: input.adminName,
      adminEmail: input.adminEmail,
      adminPhone: input.adminPhone,
      adminPasswordPlain: input.adminPassword,
      plan: toProvisionPlan(input.plan),
      seedDemo: Boolean(input.seedDemo),
    }

    const response = await api.post('/superadmin/tenants/provision', payload)
    return response.data?.data as ProvisionTenantResult
  },

  async suspendTenant(id: string): Promise<void> {
    await api.post(`/superadmin/tenants/${id}/suspend`)
  },

  async activateTenant(id: string): Promise<void> {
    await api.post(`/superadmin/tenants/${id}/activate`)
  },
}

import { describe, expect, it } from 'vitest'
import {
  buildTenantSlug,
  extractApiErrorMessage,
  normalizePlatformStats,
  normalizeTenantSummary,
  toProvisionPlan,
} from '@/services/superadminService'

describe('superadminService helpers', () => {
  it('normalizes trial tenants from backend billing data', () => {
    expect(
      normalizeTenantSummary({
        id: 'tenant_1',
        slug: 'alpha-academy',
        name: 'Alpha Academy',
        type: 'school',
        city: 'Delhi',
        state: 'Delhi',
        plan: 'basic',
        status: 'trial',
        adminName: 'Admin User',
        adminEmail: 'admin@alpha.test',
        totalStudents: 0,
        totalStaff: 0,
        createdAt: '2026-04-14T00:00:00.000Z',
      }),
    ).toMatchObject({
      subscription_plan: 'trial',
      subscription_status: 'trial',
      admin_email: 'admin@alpha.test',
      admin_name: 'Admin User',
    })
  })

  it('keeps enterprise tenants distinct in the UI model', () => {
    expect(
      normalizeTenantSummary({
        id: 'tenant_2',
        slug: 'enterprise-campus',
        name: 'Enterprise Campus',
        type: 'college',
        city: 'Mumbai',
        state: 'Maharashtra',
        plan: 'enterprise',
        status: 'active',
        adminName: 'Ops Lead',
        adminEmail: 'ops@enterprise.test',
        totalStudents: 4200,
        totalStaff: 240,
        createdAt: '2026-04-14T00:00:00.000Z',
      }).subscription_plan,
    ).toBe('enterprise')
  })

  it('maps backend stats payloads into dashboard stats', () => {
    expect(
      normalizePlatformStats({
        totalTenants: 12,
        activeTenants: 8,
        trialTenants: 2,
        suspendedTenants: 2,
        totalStudentsAcross: 6400,
        totalStaffAcross: 510,
      }),
    ).toEqual({
      total: 12,
      active: 8,
      trial: 2,
      suspended: 2,
      totalStudents: 6400,
      totalStaff: 510,
    })
  })

  it('maps trial plan selection to the backend provision plan and extracts nested API errors', () => {
    expect(toProvisionPlan('trial')).toBe('basic')
    expect(buildTenantSlug('Delhi Public School!')).toBe('delhi-public-school')
    expect(
      extractApiErrorMessage(
        {
          response: {
            data: {
              error: {
                message: 'Slug already exists',
              },
            },
          },
        },
        'Fallback message',
      ),
    ).toBe('Slug already exists')
  })
})

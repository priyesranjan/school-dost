import { describe, it, expect, beforeEach, vi } from 'vitest'
import request from 'supertest'
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset } from 'vitest-mock-extended'

vi.mock('../services/securityService', () => ({
  getOrCreateSecurityPolicy: vi.fn(),
  updateSecurityPolicy: vi.fn(),
  listSecuritySessions: vi.fn(),
  revokeSecuritySession: vi.fn(),
  getSecurityPolicyEnforcement: vi.fn().mockResolvedValue({
    enforce_ip_allowlist: false,
    ip_allowlist: [],
    session_timeout_hours: 168,
  }),
}))

vi.mock('../services/auditLogService', () => ({
  appendAuditLog: vi.fn(),
}))

vi.mock('../services/authTokenService', () => ({
  verifyAuthToken: vi.fn((token: string) => {
    if (token === 'admin_token') {
      return {
        sub: '1',
        name: 'Admin',
        role: 'admin',
        email: 'admin@school.com',
        tenantSlug: 'demo',
        isRoot: false,
      }
    }
    if (token === 'teacher_token') {
      return {
        sub: '2',
        name: 'Teacher',
        role: 'teacher',
        email: 'teacher@school.com',
        tenantSlug: 'demo',
        isRoot: false,
      }
    }
    throw new Error('Invalid token')
  }),
}))

import * as securityServiceMock from '../services/securityService'
import securityRoutes from '../routes/security.routes'

const prismaMock = mockDeep<PrismaClient>()

const app = express()
app.use(express.json())
app.use((req, _res, next) => {
  req.tenantDb = prismaMock
  req.tenantSlug = 'demo'
  next()
})
app.use('/api/security', securityRoutes)

describe('Security API Routes', () => {
  beforeEach(() => {
    mockReset(prismaMock)
    vi.clearAllMocks()
  })

  it('should load the security policy for admins', async () => {
    vi.mocked(securityServiceMock.getOrCreateSecurityPolicy).mockResolvedValueOnce({
      password_min_length: 12,
      enforce_ip_allowlist: false,
    } as any)

    const res = await request(app).get('/api/security/policy').set('Authorization', 'Bearer admin_token')

    expect(res.status).toBe(200)
    expect(res.body.data.password_min_length).toBe(12)
  })

  it('should reject non-admin access to security policy', async () => {
    const res = await request(app).get('/api/security/policy').set('Authorization', 'Bearer teacher_token')

    expect(res.status).toBe(403)
    expect(res.body.error.code).toBe('FORBIDDEN')
  })

  it('should update the security policy', async () => {
    vi.mocked(securityServiceMock.updateSecurityPolicy).mockResolvedValueOnce({
      password_min_length: 14,
      session_timeout_hours: 48,
      enforce_ip_allowlist: true,
    } as any)

    const res = await request(app)
      .put('/api/security/policy')
      .set('Authorization', 'Bearer admin_token')
      .send({
        password_min_length: 14,
        require_uppercase: true,
        require_lowercase: true,
        require_number: true,
        require_special_char: false,
        session_timeout_hours: 48,
        allow_concurrent_sessions: false,
        enforce_ip_allowlist: true,
        ip_allowlist: ['127.0.0.1'],
        two_factor_required_admins: true,
      })

    expect(res.status).toBe(200)
    expect(securityServiceMock.updateSecurityPolicy).toHaveBeenCalled()
  })

  it('should list security sessions', async () => {
    vi.mocked(securityServiceMock.listSecuritySessions).mockResolvedValueOnce({
      items: [{ id: 1, email: 'admin@school.com' }],
      total: 1,
    } as any)

    const res = await request(app).get('/api/security/sessions?active_only=true').set('Authorization', 'Bearer admin_token')

    expect(res.status).toBe(200)
    expect(res.body.data.total).toBe(1)
  })

  it('should revoke a security session', async () => {
    vi.mocked(securityServiceMock.revokeSecuritySession).mockResolvedValueOnce({
      id: 1,
      email: 'admin@school.com',
      session_id: 'abc',
      ip_address: '127.0.0.1',
    } as any)

    const res = await request(app)
      .post('/api/security/sessions/1/revoke')
      .set('Authorization', 'Bearer admin_token')

    expect(res.status).toBe(200)
    expect(res.body.data.session_id).toBe('abc')
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset } from 'vitest-mock-extended'

vi.mock('../services/classesService', () => ({
  listClasses: vi.fn(),
  createClass: vi.fn(),
  updateClass: vi.fn(),
  deleteClass: vi.fn(),
  addClassSection: vi.fn(),
  updateClassSection: vi.fn(),
  deleteClassSection: vi.fn(),
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
    if (token === 'hod_token') {
      return {
        sub: '2',
        name: 'HOD',
        role: 'hod',
        email: 'hod@school.com',
        tenantSlug: 'demo',
        isRoot: false,
      }
    }
    if (token === 'teacher_token') {
      return {
        sub: '3',
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

import * as classesServiceMock from '../services/classesService'
import classesRoutes from '../routes/classes.routes'

const prismaMock = mockDeep<PrismaClient>()

const app = express()
app.use(express.json())
app.use((req, _res, next) => {
  req.tenantDb = prismaMock
  req.tenantSlug = 'demo'
  req.tenant = {
    id: 'tenant_1',
    slug: 'demo',
    name: 'Demo School',
    dbName: 'tenant_demo',
    dbHost: 'localhost',
    dbPort: 5432,
    status: 'active',
    plan: 'premium',
    institutionCode: '001',
  }
  next()
})
app.use('/api/classes', classesRoutes)

const classRecord = {
  id: 1,
  name: 'Class 11',
  grade: 11,
  class_teacher: 'Ms. Rao',
  academic_year: '2025-26',
  room: 'Block C - 201',
  color: 'emerald',
  created_at: '2026-04-27',
  updated_at: '2026-04-27T00:00:00.000Z',
  sections: [{ id: 10, name: 'A', capacity: 40 }],
}

describe('Class Management API Routes', () => {
  beforeEach(() => {
    mockReset(prismaMock)
    vi.clearAllMocks()
  })

  it('requires auth for listing classes', async () => {
    const res = await request(app).get('/api/classes')
    expect(res.status).toBe(401)
    expect(res.body.error.code).toBe('UNAUTHORIZED')
  })

  it('lists classes for authenticated users', async () => {
    vi.mocked(classesServiceMock.listClasses).mockResolvedValueOnce({
      items: [classRecord],
      total: 1,
      page: 1,
      per_page: 100,
    })

    const res = await request(app).get('/api/classes?search=rao').set('Authorization', 'Bearer teacher_token')

    expect(res.status).toBe(200)
    expect(res.body.data.items).toEqual([classRecord])
    expect(classesServiceMock.listClasses).toHaveBeenCalledWith(prismaMock, {
      page: 1,
      per_page: 100,
      search: 'rao',
      academic_year: undefined,
    })
  })

  it('allows admins to create classes', async () => {
    vi.mocked(classesServiceMock.createClass).mockResolvedValueOnce(classRecord)

    const res = await request(app).post('/api/classes').set('Authorization', 'Bearer admin_token').send({
      name: 'Class 11',
      grade: 11,
      class_teacher: 'Ms. Rao',
      academic_year: '2025-26',
      room: 'Block C - 201',
      color: 'emerald',
      sections: [{ name: 'A', capacity: 40 }],
    })

    expect(res.status).toBe(201)
    expect(res.body.data).toEqual(classRecord)
  })

  it('forbids teachers from creating classes', async () => {
    const res = await request(app).post('/api/classes').set('Authorization', 'Bearer teacher_token').send({
      name: 'Class 11',
      grade: 11,
      academic_year: '2025-26',
      sections: [{ name: 'A', capacity: 40 }],
    })

    expect(res.status).toBe(403)
    expect(res.body.error.code).toBe('FORBIDDEN')
  })

  it('allows HODs to add sections', async () => {
    vi.mocked(classesServiceMock.addClassSection).mockResolvedValueOnce({
      ...classRecord,
      sections: [...classRecord.sections, { id: 11, name: 'B', capacity: 42 }],
    })

    const res = await request(app)
      .post('/api/classes/1/sections')
      .set('Authorization', 'Bearer hod_token')
      .send({ name: 'B', capacity: 42 })

    expect(res.status).toBe(201)
    expect(res.body.data.sections).toHaveLength(2)
    expect(classesServiceMock.addClassSection).toHaveBeenCalledWith(prismaMock, 1, { name: 'B', capacity: 42 })
  })

  it('removes sections', async () => {
    vi.mocked(classesServiceMock.deleteClassSection).mockResolvedValueOnce(classRecord)

    const res = await request(app)
      .delete('/api/classes/1/sections/11')
      .set('Authorization', 'Bearer admin_token')

    expect(res.status).toBe(200)
    expect(classesServiceMock.deleteClassSection).toHaveBeenCalledWith(prismaMock, 1, 11)
  })
})

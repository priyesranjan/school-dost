import { beforeEach, describe, expect, it, vi } from 'vitest'
import express from 'express'
import request from 'supertest'
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset } from 'vitest-mock-extended'

vi.mock('../services/studentsService', () => ({
  createStudent: vi.fn(),
  listStudents: vi.fn(),
  getStudent: vi.fn(),
  updateStudent: vi.fn(),
  deleteStudent: vi.fn(),
  importStudentsFromCsv: vi.fn(),
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

import * as studentsServiceMock from '../services/studentsService'
import studentsRoutes from '../routes/students.routes'

const prismaMock = mockDeep<PrismaClient>()

const app = express()
app.use(express.json())
app.use((req, _res, next) => {
  req.tenantDb = prismaMock
  next()
})
app.use('/api/students', studentsRoutes)

describe('Students API Routes', () => {
  beforeEach(() => {
    mockReset(prismaMock)
    vi.clearAllMocks()
  })

  it('should require auth for student import', async () => {
    const res = await request(app).post('/api/students/import').send({ csv_text: 'name,roll_number' })
    expect(res.status).toBe(401)
    expect(res.body.error.code).toBe('UNAUTHORIZED')
  })

  it('should forbid unauthorized roles from importing students', async () => {
    const res = await request(app)
      .post('/api/students/import')
      .set('Authorization', 'Bearer teacher_token')
      .send({ csv_text: 'name,roll_number,class_name,section,parent_name,phone\nAarav,1,Class 10,A,Raj,9876543210' })

    expect(res.status).toBe(403)
    expect(res.body.error.code).toBe('FORBIDDEN')
  })

  it('should reject invalid import payloads', async () => {
    const res = await request(app)
      .post('/api/students/import')
      .set('Authorization', 'Bearer admin_token')
      .send({ csv_text: '' })

    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('INVALID_REQUEST')
  })

  it('should import students from CSV payloads', async () => {
    const report = {
      summary: { total_rows: 2, created: 1, skipped: 1, failed: 0 },
      students: [
        {
          id: 1,
          name: 'Aarav Sharma',
          roll_number: '2026001',
          class_name: 'Class 10',
          section: 'A',
          parent_name: 'Rajesh Sharma',
          phone: '9876543210',
          email: 'aarav@school.com',
          address: null,
          admission_date: '2026-04-26',
          status: 'active',
        },
      ],
      issues: [
        {
          row: 3,
          code: 'STUDENT_ALREADY_EXISTS',
          message: 'Student with same roll/class/section or enrollment already exists',
          student_name: 'Duplicate Student',
          roll_number: '2026001',
        },
      ],
    } as any
    vi.mocked(studentsServiceMock.importStudentsFromCsv).mockResolvedValueOnce(report)

    const res = await request(app)
      .post('/api/students/import')
      .set('Authorization', 'Bearer admin_token')
      .send({
        csv_text:
          'name,roll_number,class_name,section,parent_name,phone,email,admission_date\n' +
          'Aarav Sharma,2026001,Class 10,A,Rajesh Sharma,9876543210,aarav@school.com,2026-04-26',
      })

    expect(res.status).toBe(201)
    expect(res.body.data).toEqual(report)
    expect(studentsServiceMock.importStudentsFromCsv).toHaveBeenCalledOnce()
  })
})

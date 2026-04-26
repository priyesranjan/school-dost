import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset } from 'vitest-mock-extended'

vi.mock('../services/assignmentService', () => ({
  listAssignments: vi.fn(),
  listClassroomResources: vi.fn(),
  createAssignment: vi.fn(),
  createClassroomResource: vi.fn(),
  updateAssignmentStatus: vi.fn(),
  deleteAssignment: vi.fn(),
  listAssignmentSubmissions: vi.fn(),
  upsertAssignmentSubmission: vi.fn(),
  reviewAssignmentSubmission: vi.fn(),
}))

vi.mock('../services/auditLogService', () => ({
  appendAuditLog: vi.fn(),
}))

vi.mock('../services/webhookService', () => ({
  dispatchWebhookEvent: vi.fn(),
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
    if (token === 'student_token') {
      return {
        sub: '3',
        name: 'Student',
        role: 'student',
        email: 'student@school.com',
        tenantSlug: 'demo',
        isRoot: false,
      }
    }
    throw new Error('Invalid token')
  }),
}))

import * as assignmentServiceMock from '../services/assignmentService'
import assignmentsRoutes from '../routes/assignments.routes'

const prismaMock = mockDeep<PrismaClient>()

const app = express()
app.use(express.json())
app.use((req, _res, next) => {
  req.tenantDb = prismaMock
  req.tenantSlug = 'demo'
  next()
})
app.use('/api/assignments', assignmentsRoutes)

describe('Assignments API Routes', () => {
  beforeEach(() => {
    mockReset(prismaMock)
    vi.clearAllMocks()
  })

  it('should require auth for assignments list', async () => {
    const res = await request(app).get('/api/assignments')
    expect(res.status).toBe(401)
    expect(res.body.error.code).toBe('UNAUTHORIZED')
  })

  it('should create assignments for academic roles', async () => {
    vi.mocked(assignmentServiceMock.createAssignment).mockResolvedValueOnce({
      id: 1,
      title: 'Essay',
      class_name: 'Class 10',
      subject: 'English',
      due_date: '2026-04-30',
      status: 'active',
    } as any)

    const res = await request(app)
      .post('/api/assignments')
      .set('Authorization', 'Bearer teacher_token')
      .send({
        title: 'Essay',
        description: 'Draft a reflective essay',
        class_name: 'Class 10',
        subject: 'English',
        due_date: '2026-04-30',
      })

    expect(res.status).toBe(201)
    expect(res.body.data.title).toBe('Essay')
  })

  it('should validate assignment list queries', async () => {
    vi.mocked(assignmentServiceMock.listAssignments).mockResolvedValueOnce({
      items: [],
      total: 0,
      page: 1,
      per_page: 100,
    })

    const res = await request(app)
      .get('/api/assignments?status=completed&per_page=999')
      .set('Authorization', 'Bearer student_token')

    expect(res.status).toBe(200)
    expect(assignmentServiceMock.listAssignments).toHaveBeenCalledWith(prismaMock, {
      page: 1,
      per_page: 100,
      class_name: undefined,
      status: 'completed',
    }, expect.any(Object))
  })

  it('should list classroom resources', async () => {
    vi.mocked(assignmentServiceMock.listClassroomResources).mockResolvedValueOnce({
      items: [{ id: 1, title: 'Chapter Notes' }],
      total: 1,
      page: 1,
      per_page: 50,
    } as any)

    const res = await request(app)
      .get('/api/assignments/resources?class_name=Class%2010&resource_type=document')
      .set('Authorization', 'Bearer student_token')

    expect(res.status).toBe(200)
    expect(assignmentServiceMock.listClassroomResources).toHaveBeenCalledWith(prismaMock, {
      page: 1,
      per_page: 50,
      class_name: 'Class 10',
      subject: undefined,
      resource_type: 'document',
    })
  })

  it('should create classroom resources for academic roles', async () => {
    vi.mocked(assignmentServiceMock.createClassroomResource).mockResolvedValueOnce({
      id: 2,
      title: 'Worksheet Pack',
      class_name: 'Class 9',
      subject: 'Science',
      resource_type: 'worksheet',
    } as any)

    const res = await request(app)
      .post('/api/assignments/resources')
      .set('Authorization', 'Bearer teacher_token')
      .send({
        title: 'Worksheet Pack',
        class_name: 'Class 9',
        subject: 'Science',
        resource_type: 'worksheet',
        url: 'https://example.test/worksheet.pdf',
      })

    expect(res.status).toBe(201)
    expect(res.body.data.title).toBe('Worksheet Pack')
  })

  it('should allow students to submit assignments', async () => {
    vi.mocked(assignmentServiceMock.upsertAssignmentSubmission).mockResolvedValueOnce({
      id: 9,
      assignment_id: 4,
      status: 'submitted',
    } as any)

    const res = await request(app)
      .post('/api/assignments/4/submissions')
      .set('Authorization', 'Bearer student_token')
      .send({
        submission_text: 'Uploaded my work.',
        attachment_url: 'https://example.test/submissions/4',
      })

    expect(res.status).toBe(201)
    expect(res.body.data.id).toBe(9)
  })

  it('should forbid teachers from using student submission endpoint', async () => {
    const res = await request(app)
      .post('/api/assignments/4/submissions')
      .set('Authorization', 'Bearer teacher_token')
      .send({
        submission_text: 'Uploaded my work.',
      })

    expect(res.status).toBe(403)
    expect(res.body.error.code).toBe('FORBIDDEN')
  })

  it('should review submissions for academic roles', async () => {
    vi.mocked(assignmentServiceMock.reviewAssignmentSubmission).mockResolvedValueOnce({
      id: 3,
      assignment_id: 1,
      status: 'reviewed',
    } as any)

    const res = await request(app)
      .patch('/api/assignments/1/submissions/3/review')
      .set('Authorization', 'Bearer admin_token')
      .send({
        status: 'reviewed',
        feedback: 'Strong work',
        score: 92,
      })

    expect(res.status).toBe(200)
    expect(res.body.data.status).toBe('reviewed')
  })
})

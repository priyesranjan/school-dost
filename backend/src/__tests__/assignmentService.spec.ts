import { beforeEach, describe, expect, it } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset } from 'vitest-mock-extended'
import {
  createClassroomResource,
  reviewAssignmentSubmission,
  upsertAssignmentSubmission,
} from '../services/assignmentService'

const prismaMock = mockDeep<PrismaClient>()

describe('assignmentService', () => {
  beforeEach(() => {
    mockReset(prismaMock)
  })

  it('should create or update assignment submissions for a student', async () => {
    prismaMock.assignment.findUnique.mockResolvedValueOnce({
      id: 4n,
      title: 'Essay',
      status: 'active',
    } as never)
    prismaMock.assignmentSubmission.upsert.mockResolvedValueOnce({
      id: 7n,
      assignmentId: 4n,
      userId: 3n,
      userName: 'Aarav Patel',
      userRole: 'student',
      status: 'submitted',
      submissionText: 'My final draft',
      attachmentUrl: 'https://example.test/essay',
      feedback: null,
      score: null,
      submittedAt: new Date('2026-04-26T10:00:00.000Z'),
      updatedAt: new Date('2026-04-26T10:00:00.000Z'),
    } as never)

    const result = await upsertAssignmentSubmission(
      prismaMock,
      4,
      {
        submission_text: 'My final draft',
        attachment_url: 'https://example.test/essay',
      },
      {
        sub: '3',
        name: 'Aarav Patel',
        role: 'student',
      } as any,
    )

    expect(result).toMatchObject({
      id: 7,
      assignment_id: 4,
      user_name: 'Aarav Patel',
      status: 'submitted',
    })
    expect(prismaMock.assignmentSubmission.upsert).toHaveBeenCalled()
  })

  it('should reject submissions for archived assignments', async () => {
    prismaMock.assignment.findUnique.mockResolvedValueOnce({
      id: 4n,
      title: 'Essay',
      status: 'archived',
    } as never)

    await expect(
      upsertAssignmentSubmission(
        prismaMock,
        4,
        {
          submission_text: 'Late upload',
        },
        {
          sub: '3',
          name: 'Aarav Patel',
          role: 'student',
        } as any,
      ),
    ).rejects.toThrow('Archived assignments cannot accept submissions')
  })

  it('should review assignment submissions', async () => {
    prismaMock.assignmentSubmission.findUnique.mockResolvedValueOnce({
      id: 9n,
      assignmentId: 4n,
    } as never)
    prismaMock.assignmentSubmission.update.mockResolvedValueOnce({
      id: 9n,
      assignmentId: 4n,
      userId: 3n,
      userName: 'Aarav Patel',
      userRole: 'student',
      status: 'reviewed',
      submissionText: 'My final draft',
      attachmentUrl: null,
      feedback: 'Nicely structured',
      score: 94,
      submittedAt: new Date('2026-04-26T10:00:00.000Z'),
      updatedAt: new Date('2026-04-26T12:30:00.000Z'),
    } as never)

    const result = await reviewAssignmentSubmission(prismaMock, 4, 9, {
      status: 'reviewed',
      feedback: 'Nicely structured',
      score: 94,
    })

    expect(result).toMatchObject({
      id: 9,
      assignment_id: 4,
      status: 'reviewed',
      score: 94,
    })
  })

  it('should create classroom resources', async () => {
    ;(prismaMock as any).classroomResource.create.mockResolvedValueOnce({
      id: 11n,
      title: 'Term 1 Revision Deck',
      description: null,
      className: 'Class 10',
      subject: 'Mathematics',
      resourceType: 'document',
      url: 'https://example.test/revision.pdf',
      assignmentId: null,
      publishedByName: 'Teacher',
      createdAt: new Date('2026-04-27T10:00:00.000Z'),
      updatedAt: new Date('2026-04-27T10:00:00.000Z'),
      assignment: null,
    } as never)

    const result = await createClassroomResource(
      prismaMock,
      {
        title: 'Term 1 Revision Deck',
        class_name: 'Class 10',
        subject: 'Mathematics',
        resource_type: 'document',
        url: 'https://example.test/revision.pdf',
      },
      {
        name: 'Teacher',
      } as any,
    )

    expect(result).toMatchObject({
      id: 11,
      title: 'Term 1 Revision Deck',
      class_name: 'Class 10',
      resource_type: 'document',
    })
  })
})

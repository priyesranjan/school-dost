import { beforeEach, describe, expect, it } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset } from 'vitest-mock-extended'
import { importStudentsFromCsv } from '../services/studentsService'

const prismaMock = mockDeep<PrismaClient>()

describe('studentsService importStudentsFromCsv', () => {
  beforeEach(() => {
    mockReset(prismaMock)
  })

  it('should import valid CSV rows with exported headers', async () => {
    prismaMock.student.create.mockResolvedValueOnce({
      id: 1n,
      name: 'Aarav Sharma',
      firstName: null,
      middleName: null,
      lastName: null,
      rollNumber: '2026001',
      className: 'Class 10',
      section: 'A',
      status: 'active',
      dateOfBirth: null,
      gender: null,
      bloodGroup: null,
      nationality: 'Indian',
      religion: null,
      category: null,
      caste: null,
      motherTongue: null,
      aadharNumber: null,
      enrollmentNo: null,
      feeNo: null,
      stream: null,
      feeGroup: null,
      academicYear: null,
      admissionDate: new Date('2026-04-26T00:00:00.000Z'),
      dateOfJoining: null,
      email: 'aarav@school.com',
      phone: '9876543210',
      parentName: 'Rajesh Sharma',
      fatherName: null,
      fatherOccupation: null,
      fatherQualification: null,
      fatherPhone: null,
      fatherEmail: null,
      fatherAadhar: null,
      fatherAnnualIncome: null,
      motherName: null,
      motherOccupation: null,
      motherQualification: null,
      motherPhone: null,
      motherEmail: null,
      motherAadhar: null,
      guardianName: null,
      guardianRelation: null,
      guardianPhone: null,
      guardianOccupation: null,
      guardianAddress: null,
      guardianContacts: null,
      address: null,
      currentAddress: null,
      currentCity: null,
      currentState: null,
      currentPincode: null,
      currentCountry: null,
      permanentAddress: null,
      permanentCity: null,
      permanentState: null,
      permanentPincode: null,
      permanentCountry: null,
      sameAsCurrent: null,
      previousSchool: null,
      previousClass: null,
      tcNumber: null,
      transportMode: null,
      busRoute: null,
      hostelName: null,
      medicalConditions: null,
      allergies: null,
      emergencyContactName: null,
      emergencyContactPhone: null,
      emergencyRelation: null,
      bankName: null,
      bankAccountNo: null,
      ifscCode: null,
      scholarshipName: null,
      scholarshipAmount: null,
      additionalDetails: null,
      notes: null,
      profilePhotoUrl: null,
      signatureUrl: null,
      parentUserId: null,
      createdAt: new Date('2026-04-26T00:00:00.000Z'),
      updatedAt: new Date('2026-04-26T00:00:00.000Z'),
    } as never)

    const result = await importStudentsFromCsv(prismaMock, {
      csv_text:
        'Name,Roll No,Class,Section,Parent Name,Phone,Email,Admission Date\n' +
        'Aarav Sharma,2026001,Class 10,A,Rajesh Sharma,9876543210,aarav@school.com,2026-04-26',
    })

    expect(result.summary).toEqual({ total_rows: 1, created: 1, skipped: 0, failed: 0 })
    expect(result.students).toHaveLength(1)
    expect(result.students[0]?.name).toBe('Aarav Sharma')
    expect(result.issues).toEqual([])
  })

  it('should return an invalid header issue when required columns are missing', async () => {
    const result = await importStudentsFromCsv(prismaMock, {
      csv_text: 'Name,Phone\nAarav Sharma,9876543210',
    })

    expect(result.summary.created).toBe(0)
    expect(result.issues[0]).toMatchObject({
      row: 1,
      code: 'INVALID_HEADER',
    })
    expect(prismaMock.student.create).not.toHaveBeenCalled()
  })
})

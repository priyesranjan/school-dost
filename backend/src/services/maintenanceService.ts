import { type PrismaClient } from '@prisma/client'
import { createStudent } from './studentsService'
import { createStaff } from './staffService'

export async function clearTenantData(db: PrismaClient) {
  // Order matters for foreign keys
  await db.attendanceRecord.deleteMany({})
  await db.feePayment.deleteMany({})
  await db.feeStructure.deleteMany({})
  await db.certificate.deleteMany({})
  await db.examResult.deleteMany({})
  await db.timetableEntry.deleteMany({})
  await db.notice.deleteMany({})
  await db.student.deleteMany({})
  await db.staffMember.deleteMany({})
}

export async function seedDemoData(db: PrismaClient) {
  // 1. First clear to ensure idempotency
  await clearTenantData(db)

  // 2. Seed Staff
  const staff = [
    {
      name: 'Dr. Sarah Wilson',
      role: 'principal',
      department: 'Administration',
      phone: '9876543210',
      email: 'sarah.w@school.edu',
      join_date: '2020-01-15',
      status: 'active',
    },
    {
      name: 'Mr. Rajesh Kumar',
      role: 'teacher',
      department: 'Mathematics',
      phone: '9876543211',
      email: 'rajesh.k@school.edu',
      join_date: '2021-06-01',
      status: 'active',
    },
    {
      name: 'Ms. Priya Sharma',
      role: 'teacher',
      department: 'Science',
      phone: '9876543212',
      email: 'priya.s@school.edu',
      join_date: '2022-03-10',
      status: 'active',
    },
    {
      name: 'Mr. Amit Singh',
      role: 'admin',
      department: 'Accounts',
      phone: '9876543213',
      email: 'amit.s@school.edu',
      join_date: '2019-11-20',
      status: 'active',
    },
  ]

  for (const s of staff) {
    await createStaff(db, s)
  }

  // 3. Seed Students
  const students = [
    {
      name: 'Aarav Sharma',
      first_name: 'Aarav',
      last_name: 'Sharma',
      roll_number: '101',
      class_name: '10-A',
      section: 'A',
      parent_name: 'Deepak Sharma',
      phone: '9288011223',
      admission_date: '2023-04-01',
      status: 'active',
      blood_group: 'O+',
      religion: 'Hindu',
    },
    {
      name: 'Isha Patel',
      first_name: 'Isha',
      last_name: 'Patel',
      roll_number: '102',
      class_name: '10-A',
      section: 'A',
      parent_name: 'Mahesh Patel',
      phone: '9288011224',
      admission_date: '2023-04-01',
      status: 'active',
      blood_group: 'A+',
      religion: 'Hindu',
    },
    {
      name: 'Vihaan Verma',
      first_name: 'Vihaan',
      last_name: 'Verma',
      roll_number: '201',
      class_name: '9-B',
      section: 'B',
      parent_name: 'Suresh Verma',
      phone: '9288011225',
      admission_date: '2023-04-05',
      status: 'active',
      blood_group: 'B+',
      religion: 'Hindu',
    },
    {
      name: 'Ananya Gupta',
      first_name: 'Ananya',
      last_name: 'Gupta',
      roll_number: '202',
      class_name: '9-B',
      section: 'B',
      parent_name: 'Alok Gupta',
      phone: '9288011226',
      admission_date: '2023-04-06',
      status: 'active',
      blood_group: 'AB+',
      religion: 'Hindu',
    },
    {
      name: 'Kabir Singh',
      first_name: 'Kabir',
      last_name: 'Singh',
      roll_number: '301',
      class_name: '11-C',
      section: 'C',
      parent_name: 'Harman Singh',
      phone: '9288011227',
      admission_date: '2023-04-10',
      status: 'active',
      blood_group: 'O-',
      religion: 'Sikh',
    },
  ]

  for (const st of students) {
    await createStudent(db, st)
  }

  // 4. Seed Fee Structures
  await db.feeStructure.createMany({
    data: [
      {
        name: 'Annual Tuition Fee',
        className: '10-A',
        amount: 45000,
        dueDate: new Date('2024-05-15'),
        academicYear: '2024-25',
      },
      {
        name: 'Annual Tuition Fee',
        className: '9-B',
        amount: 42000,
        dueDate: new Date('2024-05-15'),
        academicYear: '2024-25',
      },
      {
        name: 'Transport Fee (Qt 1)',
        className: '10-A',
        amount: 5000,
        dueDate: new Date('2024-04-30'),
        academicYear: '2024-25',
      },
    ],
  })

  // 5. Seed Attendance for today
  const allStudents = await db.student.findMany()
  await db.attendanceRecord.createMany({
    data: allStudents.map((s) => ({
      studentId: s.id,
      date: new Date(),
      status: Math.random() > 0.1 ? 'present' : 'absent',
    })),
  })

  // 6. Notices
  await db.notice.create({
    data: {
      title: 'Annual Sports Meet 2024',
      message: 'The annual sports meet will be held from April 20th to 25th.',
      audience: 'all',
      status: 'published',
      publishedAt: new Date(),
    },
  })
}

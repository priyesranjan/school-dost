import { prisma } from '../db/prisma'

function calcGrade(marks: number, maxMarks: number): string {
  const pct = (marks / maxMarks) * 100
  if (pct >= 90) return 'A+'
  if (pct >= 80) return 'A'
  if (pct >= 70) return 'B+'
  if (pct >= 60) return 'B'
  if (pct >= 50) return 'C'
  if (pct >= 40) return 'D'
  return 'F'
}

export async function createExam(input: {
  name: string
  class_name: string
  subject: string
  date: string
  max_marks: number
  academic_year: string
}) {
  const row = await prisma.exam.create({
    data: {
      name: input.name,
      className: input.class_name,
      subject: input.subject,
      date: new Date(input.date),
      maxMarks: input.max_marks,
      academicYear: input.academic_year,
    },
  })
  return {
    id: Number(row.id),
    name: row.name,
    class_name: row.className,
    subject: row.subject,
    date: row.date.toISOString().slice(0, 10),
    max_marks: row.maxMarks,
    academic_year: row.academicYear,
  }
}

export async function listExams(input: {
  page: number
  per_page: number
  class_name?: string
  academic_year?: string
}) {
  const where = {
    ...(input.class_name ? { className: input.class_name } : {}),
    ...(input.academic_year ? { academicYear: input.academic_year } : {}),
  }
  const [rows, total] = await Promise.all([
    prisma.exam.findMany({
      where,
      orderBy: [{ date: 'asc' }],
      skip: (input.page - 1) * input.per_page,
      take: input.per_page,
    }),
    prisma.exam.count({ where }),
  ])
  return {
    items: rows.map((row) => ({
      id: Number(row.id),
      name: row.name,
      class_name: row.className,
      subject: row.subject,
      date: row.date.toISOString().slice(0, 10),
      max_marks: row.maxMarks,
      academic_year: row.academicYear,
    })),
    total,
    page: input.page,
    per_page: input.per_page,
  }
}

export async function deleteExam(id: number) {
  await prisma.exam.delete({ where: { id: BigInt(id) } })
}

export async function upsertExamResult(input: {
  exam_id: number
  student_id: number
  marks_obtained: number
}) {
  const exam = await prisma.exam.findUnique({ where: { id: BigInt(input.exam_id) } })
  if (!exam) throw new Error('Exam not found')
  const grade = calcGrade(input.marks_obtained, exam.maxMarks)

  const row = await prisma.examResult.upsert({
    where: { examId_studentId: { examId: BigInt(input.exam_id), studentId: BigInt(input.student_id) } },
    update: { marksObtained: input.marks_obtained, grade },
    create: {
      examId: BigInt(input.exam_id),
      studentId: BigInt(input.student_id),
      marksObtained: input.marks_obtained,
      grade,
    },
    include: { student: { select: { name: true, className: true } } },
  })

  return {
    id: Number(row.id),
    exam_id: Number(row.examId),
    student_id: Number(row.studentId),
    student_name: row.student.name,
    class_name: row.student.className,
    marks_obtained: row.marksObtained,
    max_marks: exam.maxMarks,
    grade: row.grade,
    remarks: row.remarks,
  }
}

export async function listExamResults(examId: number) {
  const rows = await prisma.examResult.findMany({
    where: { examId: BigInt(examId) },
    include: {
      student: { select: { name: true, className: true, rollNumber: true } },
      exam: { select: { maxMarks: true, name: true, subject: true } },
    },
    orderBy: [{ marksObtained: 'desc' }],
  })
  return rows.map((row) => ({
    id: Number(row.id),
    exam_id: Number(row.examId),
    exam_name: row.exam.name,
    subject: row.exam.subject,
    student_id: Number(row.studentId),
    student_name: row.student.name,
    roll_number: row.student.rollNumber,
    class_name: row.student.className,
    marks_obtained: row.marksObtained,
    max_marks: row.exam.maxMarks,
    grade: row.grade,
    remarks: row.remarks,
  }))
}

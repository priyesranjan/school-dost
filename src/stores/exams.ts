import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Exam, ExamResult } from '@/types'
import { useToastStore } from './toast'
import { saveToStorage, loadFromStorage } from '@/utils/storage'
import api from '@/services/api'
import { getOtpMode } from '@/utils/runtimeConfig'

const demoExams: Exam[] = [
  { id: 1, name: 'Unit Test 1', class_name: 'Class 10', subject: 'Mathematics', date: '2026-04-10', max_marks: 50, academic_year: '2025-26' },
  { id: 2, name: 'Unit Test 1', class_name: 'Class 10', subject: 'Science', date: '2026-04-11', max_marks: 50, academic_year: '2025-26' },
  { id: 3, name: 'Unit Test 1', class_name: 'Class 10', subject: 'English', date: '2026-04-12', max_marks: 50, academic_year: '2025-26' },
  { id: 4, name: 'Unit Test 1', class_name: 'Class 9', subject: 'Mathematics', date: '2026-04-10', max_marks: 50, academic_year: '2025-26' },
  { id: 5, name: 'Mid-Term', class_name: 'Class 10', subject: 'Mathematics', date: '2026-06-15', max_marks: 100, academic_year: '2025-26' },
  { id: 6, name: 'Mid-Term', class_name: 'Class 10', subject: 'Science', date: '2026-06-16', max_marks: 100, academic_year: '2025-26' },
]

const demoResults: ExamResult[] = [
  { id: 1, exam_id: 1, exam_name: 'Unit Test 1', student_id: 1, student_name: 'Aarav Sharma', class_name: 'Class 10', subject: 'Mathematics', marks_obtained: 45, max_marks: 50, grade: 'A+', remarks: 'Excellent' },
  { id: 2, exam_id: 1, exam_name: 'Unit Test 1', student_id: 2, student_name: 'Priya Patel', class_name: 'Class 10', subject: 'Mathematics', marks_obtained: 38, max_marks: 50, grade: 'A', remarks: 'Good' },
  { id: 3, exam_id: 1, exam_name: 'Unit Test 1', student_id: 11, student_name: 'Aditya Verma', class_name: 'Class 10', subject: 'Mathematics', marks_obtained: 42, max_marks: 50, grade: 'A+', remarks: 'Very Good' },
  { id: 4, exam_id: 2, exam_name: 'Unit Test 1', student_id: 1, student_name: 'Aarav Sharma', class_name: 'Class 10', subject: 'Science', marks_obtained: 40, max_marks: 50, grade: 'A', remarks: 'Good' },
  { id: 5, exam_id: 2, exam_name: 'Unit Test 1', student_id: 2, student_name: 'Priya Patel', class_name: 'Class 10', subject: 'Science', marks_obtained: 35, max_marks: 50, grade: 'B+', remarks: 'Satisfactory' },
  { id: 6, exam_id: 3, exam_name: 'Unit Test 1', student_id: 1, student_name: 'Aarav Sharma', class_name: 'Class 10', subject: 'English', marks_obtained: 43, max_marks: 50, grade: 'A+', remarks: 'Excellent' },
  { id: 7, exam_id: 4, exam_name: 'Unit Test 1', student_id: 3, student_name: 'Rohan Gupta', class_name: 'Class 9', subject: 'Mathematics', marks_obtained: 30, max_marks: 50, grade: 'B', remarks: 'Needs improvement' },
  { id: 8, exam_id: 4, exam_name: 'Unit Test 1', student_id: 4, student_name: 'Ananya Singh', class_name: 'Class 9', subject: 'Mathematics', marks_obtained: 47, max_marks: 50, grade: 'A+', remarks: 'Outstanding' },
  { id: 9, exam_id: 4, exam_name: 'Unit Test 1', student_id: 12, student_name: 'Riya Chopra', class_name: 'Class 9', subject: 'Mathematics', marks_obtained: 41, max_marks: 50, grade: 'A', remarks: 'Good' },
]

function calculateGrade(marks: number, maxMarks: number): string {
  const pct = (marks / maxMarks) * 100
  if (pct >= 90) return 'A+'
  if (pct >= 80) return 'A'
  if (pct >= 70) return 'B+'
  if (pct >= 60) return 'B'
  if (pct >= 50) return 'C'
  if (pct >= 40) return 'D'
  return 'F'
}

export const useExamStore = defineStore('exams', () => {
  const toast = useToastStore()
  const savedExams = loadFromStorage<Exam[]>('exams')
  const savedResults = loadFromStorage<ExamResult[]>('exam_results')
  const exams = ref<Exam[]>(savedExams || [...demoExams])
  const results = ref<ExamResult[]>(savedResults || [...demoResults])
  const loading = ref(false)

  watch(exams, (val) => saveToStorage('exams', val), { deep: true })
  watch(results, (val) => saveToStorage('exam_results', val), { deep: true })

  const examNames = computed(() => [...new Set(exams.value.map((e) => e.name))].sort())

  const subjects = computed(() => [...new Set(exams.value.map((e) => e.subject))].sort())

  function addExam(data: Omit<Exam, 'id'>) {
    if (getOtpMode() === 'api') {
      loading.value = true
      api.post('/exams', {
        name: data.name,
        class_name: data.class_name,
        subject: data.subject,
        date: data.date,
        max_marks: data.max_marks,
        academic_year: data.academic_year,
      }).then((res) => {
        exams.value.unshift(res.data.data)
        toast.success('Exam scheduled')
      }).catch(() => {
        toast.error('Failed to schedule exam')
      }).finally(() => { loading.value = false })
      return
    }
    exams.value.push({ ...data, id: Date.now() })
    toast.success('Exam scheduled')
  }

  function deleteExam(id: number) {
    if (getOtpMode() === 'api') {
      loading.value = true
      api.delete(`/exams/${id}`).then(() => {
        exams.value = exams.value.filter((e) => e.id !== id)
        results.value = results.value.filter((r) => r.exam_id !== id)
        toast.success('Exam removed')
      }).catch(() => {
        toast.error('Failed to remove exam')
      }).finally(() => { loading.value = false })
      return
    }
    exams.value = exams.value.filter((e) => e.id !== id)
    results.value = results.value.filter((r) => r.exam_id !== id)
    toast.success('Exam removed')
  }

  async function fetchExams(params?: { class_name?: string; academic_year?: string }) {
    if (getOtpMode() !== 'api') return
    loading.value = true
    try {
      const res = await api.get('/exams', { params: { per_page: 200, ...params } })
      exams.value = res.data?.data?.items || []
    } catch {
      // silently fall back to local
    } finally {
      loading.value = false
    }
  }

  async function fetchResultsForExam(examId: number) {
    if (getOtpMode() !== 'api') return
    loading.value = true
    try {
      const res = await api.get(`/exams/${examId}/results`)
      const items: ExamResult[] = (res.data?.data?.results || []).map((r: any) => ({
        ...r,
        exam_name: r.exam_name,
      }))
      // Replace results for this exam only
      results.value = [...results.value.filter((r) => r.exam_id !== examId), ...items]
    } catch {
      // fall back to local
    } finally {
      loading.value = false
    }
  }

  function addResult(examId: number, studentId: number, studentName: string, className: string, marks: number) {
    const exam = exams.value.find((e) => e.id === examId)
    if (!exam) return

    if (getOtpMode() === 'api') {
      api.post('/exams/results', { exam_id: examId, student_id: studentId, marks_obtained: marks })
        .then((res) => {
          const data = res.data.data
          const existing = results.value.find((r) => r.exam_id === examId && r.student_id === studentId)
          if (existing) {
            existing.marks_obtained = data.marks_obtained
            existing.grade = data.grade
          } else {
            results.value.push({ ...data, exam_name: exam.name })
          }
          toast.success('Marks recorded')
        }).catch(() => toast.error('Failed to record marks'))
      return
    }

    const existing = results.value.find((r) => r.exam_id === examId && r.student_id === studentId)
    if (existing) {
      existing.marks_obtained = marks
      existing.grade = calculateGrade(marks, exam.max_marks)
      toast.success('Marks updated')
      return
    }

    results.value.push({
      id: Date.now(),
      exam_id: examId,
      exam_name: exam.name,
      student_id: studentId,
      student_name: studentName,
      class_name: className,
      subject: exam.subject,
      marks_obtained: marks,
      max_marks: exam.max_marks,
      grade: calculateGrade(marks, exam.max_marks),
      remarks: '',
    })
    toast.success('Marks recorded')
  }

  function bulkAddResults(examId: number, entries: { studentId: number; studentName: string; className: string; marks: number }[]) {
    const exam = exams.value.find((e) => e.id === examId)
    if (!exam) return

    for (const entry of entries) {
      const existing = results.value.find((r) => r.exam_id === examId && r.student_id === entry.studentId)
      if (existing) {
        existing.marks_obtained = entry.marks
        existing.grade = calculateGrade(entry.marks, exam.max_marks)
      } else {
        results.value.push({
          id: Date.now() * 1000 + Math.floor(Math.random() * 1000),
          exam_id: examId,
          exam_name: exam.name,
          student_id: entry.studentId,
          student_name: entry.studentName,
          class_name: entry.className,
          subject: exam.subject,
          marks_obtained: entry.marks,
          max_marks: exam.max_marks,
          grade: calculateGrade(entry.marks, exam.max_marks),
          remarks: '',
        })
      }
    }
    toast.success(`Marks entered for ${entries.length} students`)
  }

  function getStudentResults(studentId: number) {
    return results.value.filter((r) => r.student_id === studentId)
  }

  function getExamResults(examId: number) {
    return results.value
      .filter((r) => r.exam_id === examId)
      .sort((a, b) => b.marks_obtained - a.marks_obtained)
  }

  const classAverage = computed(() => {
    const byExam: Record<number, { total: number; count: number; name: string; subject: string }> = {}
    for (const r of results.value) {
      if (!byExam[r.exam_id]) byExam[r.exam_id] = { total: 0, count: 0, name: r.exam_name, subject: r.subject }
      byExam[r.exam_id].total += (r.marks_obtained / r.max_marks) * 100
      byExam[r.exam_id].count++
    }
    return Object.entries(byExam).map(([id, data]) => ({
      examId: Number(id),
      examName: data.name,
      subject: data.subject,
      average: Math.round(data.total / data.count),
    }))
  })

  return {
    exams,
    results,
    loading,
    examNames,
    subjects,
    addExam,
    deleteExam,
    fetchExams,
    fetchResultsForExam,
    addResult,
    bulkAddResults,
    getStudentResults,
    getExamResults,
    classAverage,
  }
})

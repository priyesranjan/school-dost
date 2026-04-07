/**
 * Export data to CSV and trigger download
 */
export function exportToCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((cell) => {
          let str = String(cell)
          // Guard against CSV formula injection
          if (/^[=+\-@\t\r]/.test(str)) str = "'" + str
          // Escape quotes and wrap in quotes if contains comma
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`
          }
          return str
        })
        .join(',')
    ),
  ].join('\n')

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * Export fee collection report
 */
export function exportFeeCollection(payments: { student_name: string; class_name: string; fee_name: string; paid_amount: number; payment_date: string | null; payment_method: string | null; receipt_number: string | null }[]) {
  const headers = ['Student Name', 'Class', 'Fee Type', 'Amount Paid', 'Date', 'Method', 'Receipt No']
  const rows = payments.map((p) => [
    p.student_name,
    p.class_name,
    p.fee_name,
    p.paid_amount,
    p.payment_date || '-',
    p.payment_method?.replace('_', ' ') || '-',
    p.receipt_number || '-',
  ])
  exportToCsv('fee_collection_report', headers, rows)
}

/**
 * Export pending fees report
 */
export function exportPendingFees(payments: { student_name: string; class_name: string; fee_name: string; total_amount: number; paid_amount: number; due_amount: number; status: string }[]) {
  const headers = ['Student Name', 'Class', 'Fee Type', 'Total Amount', 'Paid', 'Due Amount', 'Status']
  const rows = payments.map((p) => [
    p.student_name,
    p.class_name,
    p.fee_name,
    p.total_amount,
    p.paid_amount,
    p.due_amount,
    p.status,
  ])
  exportToCsv('pending_fees_report', headers, rows)
}

/**
 * Export student list
 */
export function exportStudentList(students: { name: string; roll_number: string; class_name: string; section: string; parent_name: string; phone: string; email: string; status: string }[]) {
  const headers = ['Name', 'Roll No', 'Class', 'Section', 'Parent Name', 'Phone', 'Email', 'Status']
  const rows = students.map((s) => [
    s.name,
    s.roll_number,
    s.class_name,
    s.section,
    s.parent_name,
    s.phone,
    s.email,
    s.status,
  ])
  exportToCsv('student_list', headers, rows)
}

/**
 * Export attendance report
 */
export function exportAttendance(records: { roll_number: string; student_name: string; date: string; status: string }[]) {
  const headers = ['Roll No', 'Student Name', 'Date', 'Status']
  const rows = records.map((r) => [r.roll_number, r.student_name, r.date, r.status])
  exportToCsv('attendance_report', headers, rows)
}

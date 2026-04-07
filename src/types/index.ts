export interface Student {
  id: number
  name: string
  roll_number: string
  class_name: string
  section: string
  parent_name: string
  phone: string
  email: string
  address: string
  admission_date: string
  status: 'active' | 'inactive'
  profile_photo_url?: string
}

export interface AuthUser {
  name: string
  role: 'admin' | 'accountant' | 'teacher' | 'receptionist' | 'student' | 'parent' | 'hod'
  email: string
  phone: string
  profile_photo_url?: string
}

export interface OtpChallenge {
  session_id: string
  destination_masked: string
  expires_at: number
  demo_otp?: string
}

export interface FeeStructure {
  id: number
  name: string
  class_name: string
  amount: number
  due_date: string
  academic_year: string
}

export interface FeePayment {
  id: number
  student_id: number
  student_name: string
  class_name: string
  fee_name: string
  total_amount: number
  paid_amount: number
  due_amount: number
  status: 'paid' | 'partial' | 'unpaid'
  payment_date: string | null
  payment_method: 'cash' | 'upi' | 'bank_transfer' | 'cheque' | null
  receipt_number: string | null
}

export interface AttendanceRecord {
  id: number
  student_id: number
  student_name: string
  roll_number: string
  date: string
  status: 'present' | 'absent' | 'late'
}

export interface DashboardStats {
  total_students: number
  total_fees_collected: number
  pending_fees: number
  attendance_today: number
  recent_payments: FeePayment[]
  fee_alerts: FeePayment[]
}

export interface ApiResponse<T> {
  data: T
  message?: string
  total?: number
  page?: number
  per_page?: number
}

export interface PaginationParams {
  page: number
  per_page: number
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface Toast {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

export interface SmsLog {
  id: number
  phone: string
  student_name: string
  message: string
  type: 'payment' | 'due_reminder' | 'attendance' | 'general' | 'notice' | 'schedule'
  status: 'sent' | 'failed' | 'pending'
  sent_at: string
}

export interface Notice {
  id: number
  title: string
  message: string
  audience: 'all' | 'class'
  class_name: string | null
  created_at: string
  created_by: string
  status: 'draft' | 'approved' | 'scheduled' | 'published' | 'rejected'
  approved_by: string | null
  approved_at: string | null
  rejected_by: string | null
  rejected_at: string | null
  review_comment: string | null
  revision_no: number
  approved_title: string | null
  approved_message: string | null
  publish_at: string | null
  published_at: string | null
  send_sms_on_publish: boolean
  sms_sent: boolean
}

export interface TimetableEntry {
  id: number
  class_name: string
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'
  period: string
  subject: string
  teacher: string
  start_time: string
  end_time: string
}

export interface AuditLog {
  id: number
  action: string
  module: 'notices' | 'timetable' | 'auth' | 'settings' | 'certificates' | 'students' | 'fees' | 'audit'
  actor_name: string
  actor_role: string
  target: string
  metadata: string
  created_at: string
  prev_hash: string
  hash: string
  signature_version: number
}

export interface SchoolSettings {
  school_name: string
  school_address: string
  school_phone: string
  school_email: string
  principal_name: string
  academic_year: string
  sms_enabled: boolean
  sms_api_key: string
  sms_sender_id: string
  auto_sms_on_payment: boolean
  auto_sms_on_due: boolean
  otp_enabled: boolean
  otp_mode: 'demo' | 'api'
  twofactor_api_key: string
  twofactor_template_login: string
  r2_enabled: boolean
  r2_mode: 'demo' | 'api'
  r2_public_base_url: string
  r2_bucket: string
  audit_signature_mode: 'local' | 'api'
  audit_signature_endpoint: string
  sla_critical_minutes: number
  sla_warning_minutes: number
  sla_info_minutes: number
  sla_policy_version: string
  sla_policy_updated_at: string
}

export interface UserRole {
  id: number
  name: string
  email: string
  role: 'admin' | 'accountant' | 'teacher' | 'receptionist' | 'student' | 'parent' | 'hod'
  status: 'active' | 'inactive'
  last_login: string | null
}

export interface Exam {
  id: number
  name: string
  class_name: string
  subject: string
  date: string
  max_marks: number
  academic_year: string
}

export interface ExamResult {
  id: number
  exam_id: number
  exam_name: string
  student_id: number
  student_name: string
  class_name: string
  subject: string
  marks_obtained: number
  max_marks: number
  grade: string
  remarks: string
}

export interface CalendarEvent {
  id: number
  title: string
  date: string
  end_date: string | null
  type: 'holiday' | 'exam' | 'event' | 'pta' | 'sports'
  description: string
}

export interface Certificate {
  id: number
  certificate_no: string
  student_id: number
  student_name: string
  class_name: string
  type: 'tc' | 'character'
  issue_date: string
  reason?: string
  conduct?: string
  issued_by: string
  status: 'issued' | 'draft'
}

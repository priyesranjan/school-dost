export interface WebsiteArticleItem {
  title: string
  excerpt: string
  image: string
  category: string
  views: number
  published_at: string
}

export interface GuardianContact {
  name: string
  relation: string
  phone: string
  occupation?: string
  address?: string
}

export interface AdditionalDetail {
  label: string
  value: string
}

export interface Student {
  id: number
  name: string
  roll_number: string
  enrollment_no?: string
  class_name: string
  section: string
  parent_name: string
  phone: string
  email: string
  address: string
  admission_date: string
  status: 'active' | 'inactive'
  profile_photo_url?: string
  // Student Details (Entab-style)
  first_name?: string
  middle_name?: string
  last_name?: string
  date_of_birth?: string
  gender?: 'Male' | 'Female' | 'Other'
  blood_group?: string
  nationality?: string
  religion?: string
  category?: string
  caste?: string
  mother_tongue?: string
  aadhar_number?: string
  fee_no?: string
  stream?: string
  fee_group?: string
  academic_year?: string
  date_of_joining?: string
  // Parent/Guardian Info
  father_name?: string
  father_occupation?: string
  father_qualification?: string
  father_phone?: string
  father_email?: string
  father_aadhar?: string
  father_annual_income?: string
  mother_name?: string
  mother_occupation?: string
  mother_qualification?: string
  mother_phone?: string
  mother_email?: string
  mother_aadhar?: string
  guardian_name?: string
  guardian_relation?: string
  guardian_phone?: string
  guardian_occupation?: string
  guardian_address?: string
  guardian_contacts?: GuardianContact[]
  // Address Details
  current_address?: string
  current_city?: string
  current_state?: string
  current_pincode?: string
  current_country?: string
  permanent_address?: string
  permanent_city?: string
  permanent_state?: string
  permanent_pincode?: string
  permanent_country?: string
  same_as_current?: boolean
  // Additional Details
  previous_school?: string
  previous_class?: string
  tc_number?: string
  transport_mode?: string
  bus_route?: string
  hostel_name?: string
  medical_conditions?: string
  allergies?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  emergency_relation?: string
  // More Info
  bank_name?: string
  bank_account_no?: string
  ifsc_code?: string
  scholarship_name?: string
  scholarship_amount?: number
  sibling_ids?: number[]
  additional_details?: AdditionalDetail[]
  notes?: string
  signature_url?: string
}

export interface AuthUser {
  name: string
  role: 'superadmin' | 'admin' | 'accountant' | 'teacher' | 'receptionist' | 'student' | 'parent' | 'hod'
  email: string
  phone: string
  profile_photo_url?: string
  tenant_id?: string
}

export interface OtpChallenge {
  session_id: string
  destination_masked: string
  expires_at: number
  demo_otp?: string
  channel?: 'sms' | 'whatsapp'
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

export interface StaffAttendanceRecord {
  id: number
  staff_id: number
  staff_name: string
  date: string
  status: 'present' | 'absent' | 'on_leave'
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
  channel?: 'sms' | 'whatsapp'
  template_id?: string
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
  module:
    | 'notices'
    | 'timetable'
    | 'auth'
    | 'settings'
    | 'certificates'
    | 'students'
    | 'fees'
    | 'audit'
    | 'finance'
    | 'academic'
    | 'hr'
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
  institution_code: string
  brand_color: string
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

export interface StaffTask {
  id: number
  staff_id: number
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed'
  due_date: string
  created_at: string
}

// ═══════════════════════════════════════════════════════════════
// SaaS Multi-Tenant Types
// ═══════════════════════════════════════════════════════════════

export interface InstitutionProfile {
  id: string
  slug: string
  name: string
  type: 'school' | 'college' | 'university' | 'coaching'
  logo_url: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  email: string
  website_url: string
  board_affiliation: string
  udise_code: string
  principal_name: string
  principal_photo_url: string
  principal_designation: string
  principal_message: string
  established_year: number
  motto: string
  social_facebook: string
  social_instagram: string
  social_twitter: string
  social_youtube: string
  public_website_enabled: boolean
  website_theme: 'professional' | 'standard1' | 'premium'
  website_hero_title: string
  website_hero_subtitle: string
  website_hero_image_url: string
  website_about_title: string
  website_about_description: string
  website_about_image_url: string
  website_gallery_images: string[]
  website_primary_cta_text: string
  website_secondary_cta_text: string
  website_facilities_title: string
  website_why_choose_title: string
  website_gallery_title: string
  website_contact_title: string
  website_facilities: WebsiteFacilityItem[]
  website_campus_media: WebsiteCampusMediaItem[]
  website_whatsapp_number: string
  website_show_whatsapp_button: boolean
  website_show_social_ticker: boolean
  website_show_notice_board: boolean
  website_feature_images: string[]
  website_articles: WebsiteArticleItem[]
  subscription_plan: 'trial' | 'basic' | 'standard' | 'premium' | 'enterprise'
  subscription_status: 'active' | 'trial' | 'suspended' | 'expired'
  onboarded_at: string
  admin_email: string
  admin_name: string
  total_students: number
  total_staff: number
}

export interface WebsiteFacilityItem {
  title: string
  description: string
  category: string
  image: string
}

export interface WebsiteCampusMediaItem {
  title: string
  description: string
  image: string
}

export interface TenantSummary {
  id: string
  slug: string
  name: string
  type: InstitutionProfile['type']
  city: string
  state: string
  subscription_plan: InstitutionProfile['subscription_plan']
  subscription_status: InstitutionProfile['subscription_status']
  admin_email: string
  admin_name: string
  total_students: number
  total_staff: number
  onboarded_at: string
  logo_url: string
}

export interface AdmissionInquiry {
  id: number
  tenant_id: string
  student_name: string
  parent_name: string
  phone: string
  email: string
  class_applying: string
  message: string
  status: 'new' | 'contacted' | 'enrolled' | 'rejected'
  submitted_at: string
}

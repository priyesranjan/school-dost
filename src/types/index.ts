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

export interface StudentImportIssue {
  row: number
  code: string
  message: string
  student_name: string | null
  roll_number: string | null
}

export interface StudentImportReport {
  summary: {
    total_rows: number
    created: number
    skipped: number
    failed: number
  }
  students: Student[]
  issues: StudentImportIssue[]
}

export interface AssignmentSubmissionRecord {
  id: number
  assignment_id: number
  user_id: number
  user_name: string
  user_role: string
  status: 'submitted' | 'reviewed' | 'returned'
  submission_text: string | null
  attachment_url: string | null
  feedback: string | null
  score: number | null
  submitted_at: string
  updated_at: string
}

export interface AssignmentRecord {
  id: number
  title: string
  description: string | null
  subject: string
  class_name: string
  due_date: string
  resource_url: string | null
  status: 'active' | 'completed' | 'overdue' | 'archived'
  teacher_name: string | null
  created_at: string
  updated_at: string
  submission_count: number
  my_submission: AssignmentSubmissionRecord | null
}

export interface ClassroomResourceRecord {
  id: number
  title: string
  description: string | null
  class_name: string
  subject: string
  resource_type: 'document' | 'worksheet' | 'video' | 'link'
  url: string
  assignment_id: number | null
  assignment_title: string | null
  published_by_name: string | null
  created_at: string
  updated_at: string
}

export interface AuthUser {
  name: string
  role: 'superadmin' | 'admin' | 'accountant' | 'teacher' | 'receptionist' | 'student' | 'parent' | 'hod'
  email: string
  phone: string
  profile_photo_url?: string
  tenant_id?: string
  tenant_slug?: string
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

export interface AnalyticsKpis {
  students_active: number
  fees_collected: number
  fees_pending: number
  fee_recovery_rate: number
  attendance_rate: number
  exam_average_score: number
}

export interface AnalyticsFeesByMonth {
  month: string
  collected: number
  due: number
  transactions: number
}

export interface AnalyticsAttendanceByDay {
  date: string
  present: number
  absent: number
  late: number
  attendance_rate: number
}

export interface AnalyticsExamSubjectPerformance {
  subject: string
  avg_percentage: number
  exams_count: number
  attempts: number
}

export interface AnalyticsClassMetric {
  class_name: string
  students: number
  collected: number
  outstanding: number
  fee_recovery_rate: number
  attendance_rate: number
  exam_average_score: number
}

export interface AnalyticsRiskStudent {
  student_id: number
  student_name: string
  class_name: string
  fee_due_amount: number
  absent_days: number
  last_payment_date: string | null
  exam_average_score: number | null
  risk_score: number
  risk_level: 'low' | 'medium' | 'high'
}

export interface EnterpriseAnalyticsOverview {
  period_days: number
  generated_at: string
  kpis: AnalyticsKpis
  trends: {
    fees_by_month: AnalyticsFeesByMonth[]
    attendance_by_day: AnalyticsAttendanceByDay[]
    exam_performance_by_subject: AnalyticsExamSubjectPerformance[]
  }
  class_analytics: AnalyticsClassMetric[]
  risk_students: AnalyticsRiskStudent[]
}

export interface OpsAlertItem {
  id: number
  type: 'system'
  title: string
  message: string
  read: boolean
  timestamp: string
  severity: 'critical' | 'warning' | 'info'
  source_key: string | null
  muted_until: string | null
  acknowledged_at: string | null
}

export interface OpsAlertsSnapshot {
  generated_at: string
  period_days: number
  alerts: OpsAlertItem[]
  stats: {
    total: number
    critical: number
    warning: number
    info: number
    top_source: string
    top_source_count: number
  }
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
  type: 'payment' | 'due_reminder' | 'attendance' | 'general' | 'notice' | 'schedule' | 'campaign' | 'otp'
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

export interface SecurityPolicyRecord {
  id: number
  password_min_length: number
  require_uppercase: boolean
  require_lowercase: boolean
  require_number: boolean
  require_special_char: boolean
  session_timeout_hours: number
  allow_concurrent_sessions: boolean
  enforce_ip_allowlist: boolean
  ip_allowlist: string[]
  two_factor_required_admins: boolean
  updated_by_name: string | null
  created_at: string
  updated_at: string
}

export interface SecuritySessionRecord {
  id: number
  session_id: string | null
  user_sub: string
  name: string
  role: string
  email: string
  ip_address: string | null
  user_agent: string | null
  last_seen_at: string | null
  created_at: string
  expires_at: string
  revoked_at: string | null
  is_active: boolean
}

export interface UserRole {
  id: number
  name: string
  email: string
  role: 'admin' | 'accountant' | 'teacher' | 'receptionist' | 'student' | 'parent' | 'hod'
  status: 'active' | 'inactive'
  last_login: string | null
}

export interface PayrollProfileRecord {
  id: number | null
  staff_id: number
  staff_name: string
  role: string
  department: string
  staff_status: 'active' | 'inactive' | 'on_leave'
  base_salary: number
  allowances: number
  deductions: number
  net_salary: number
  payment_method: string | null
  bank_name: string | null
  bank_account_no: string | null
  ifsc_code: string | null
  pan_number: string | null
  notes: string | null
  updated_at: string | null
}

export interface PayrollRecord {
  id: number
  staff_id: number
  staff_name: string
  role: string
  department: string
  staff_status: 'active' | 'inactive' | 'on_leave'
  month: string
  base_salary: number
  allowances: number
  deductions: number
  gross_pay: number
  net_pay: number
  status: 'pending' | 'paid'
  payment_reference: string | null
  paid_at: string | null
  generated_at: string
  updated_at: string
  notes: string | null
}

export interface PayrollSummary {
  month: string
  total_staff: number
  configured_profiles: number
  generated_records: number
  pending_records: number
  paid_records: number
  gross_total: number
  net_total: number
}

export interface PayrollGenerationReport {
  month: string
  total_staff: number
  created: number
  updated: number
  skipped_no_profile: number
  locked_paid: number
  items: PayrollRecord[]
}

export interface HrSummary {
  pending_leave_requests: number
  approved_leave_requests: number
  staff_currently_on_leave: number
  published_appraisals: number
  draft_appraisals: number
}

export interface LeaveRequestRecord {
  id: number
  staff_id: number
  staff_name: string | null
  staff_role: string | null
  department: string | null
  leave_type: string
  start_date: string
  end_date: string
  duration_days: number
  reason: string | null
  decision_note: string | null
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed'
  requested_by_name: string | null
  approved_by_name: string | null
  requested_at: string
  decided_at: string | null
  created_at: string
  updated_at: string
}

export interface StaffAppraisalRecord {
  id: number
  staff_id: number
  staff_name: string | null
  staff_role: string | null
  department: string | null
  reviewer_name: string | null
  review_period: string
  review_date: string
  overall_rating: number
  strengths: string | null
  improvement_areas: string | null
  goals: string | null
  status: 'draft' | 'published'
  published_at: string | null
  created_at: string
  updated_at: string
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
  // Subscription lifecycle
  trial_ends_at?: string
  subscription_end?: string
  subscription_history?: SubscriptionEvent[]
}

export interface SubscriptionEvent {
  id: string
  action: 'trial_started' | 'trial_extended' | 'plan_upgraded' | 'subscription_renewed' | 'suspended' | 'activated' | 'expired'
  performed_by: string
  performed_at: string
  note?: string
  days_added?: number
  plan?: string
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

// ================================================================
// Subscription Pricing — Per student / month (tiered)
// ================================================================
export interface SubscriptionPricingTier {
  label: string
  minStudents: number
  maxStudents: number | null  // null = unlimited
  ratePerStudent: number | null  // null = Contact Us
  description: string
}

export const SUBSCRIPTION_PRICING: SubscriptionPricingTier[] = [
  { label: 'Starter',    minStudents: 0,    maxStudents: 500,  ratePerStudent: 15, description: '0–500 students @ ₹15/student/month' },
  { label: 'Growth',     minStudents: 501,  maxStudents: 1000, ratePerStudent: 12, description: '501–1000 students @ ₹12/student/month' },
  { label: 'Scale',      minStudents: 1001, maxStudents: 2000, ratePerStudent: 10, description: '1001–2000 students @ ₹10/student/month' },
  { label: 'Enterprise', minStudents: 2001, maxStudents: null, ratePerStudent: null, description: '2000+ students — Contact Us' },
]

export function calcMonthlyBill(students: number): { amount: number | null; tier: SubscriptionPricingTier } {
  const tier = SUBSCRIPTION_PRICING.find(
    (t) => students >= t.minStudents && (t.maxStudents === null || students <= t.maxStudents)
  ) ?? SUBSCRIPTION_PRICING[SUBSCRIPTION_PRICING.length - 1]
  return {
    amount: tier.ratePerStudent !== null ? students * tier.ratePerStudent : null,
    tier,
  }
}

export const TRIAL_DAYS_DEFAULT = 15

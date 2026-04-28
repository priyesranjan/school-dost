import { z } from 'zod'

const dayEnum = z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
const attendanceStatusEnum = z.enum(['present', 'absent', 'late'])
const paymentMethodEnum = z.enum(['cash', 'upi', 'bank_transfer', 'cheque'])
const certificateTypeEnum = z.enum(['tc', 'character'])
const smsTypeEnum = z.enum(['payment', 'due_reminder', 'attendance', 'general', 'notice', 'schedule', 'campaign', 'otp'])
const deliveryChannelEnum = z.enum(['sms', 'whatsapp'])
const expensePaymentMethodEnum = z.enum(['cash', 'bank_transfer', 'cheque', 'card', 'upi'])
const webhookDeliveryStatusEnum = z.enum(['pending', 'success', 'failed'])
const staffTaskPriorityEnum = z.enum(['low', 'medium', 'high'])
const staffTaskStatusEnum = z.enum(['pending', 'in_progress', 'completed'])
const payrollStatusEnum = z.enum(['pending', 'paid'])
const purchaseOrderStatusEnum = z.enum(['draft', 'approved', 'received', 'cancelled'])
const bankEntryDirectionEnum = z.enum(['inflow', 'outflow'])
const leaveRequestStatusEnum = z.enum(['pending', 'approved', 'rejected', 'cancelled', 'completed'])
const appraisalStatusEnum = z.enum(['draft', 'published'])
const assignmentWorkflowStatusEnum = z.enum(['active', 'completed', 'archived'])
const assignmentSubmissionStatusEnum = z.enum(['submitted', 'reviewed', 'returned'])
const classroomResourceTypeEnum = z.enum(['document', 'worksheet', 'video', 'link'])
const webhookEventsSchema = z.array(z.string().min(1).max(80)).min(1).max(50)
const webhookHeadersSchema = z.record(z.string().min(1).max(100), z.string().max(500)).optional()
const payrollMonthSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'month must be in YYYY-MM format')

export const otpSendSchema = z.object({
  phone: z.string().min(8),
  purpose: z.literal('login'),
  channel: z.enum(['sms', 'whatsapp']).optional(),
})

export const otpVerifySchema = z.object({
  session_id: z.string().min(3),
  otp: z.string().min(4).max(8),
})

export const refreshTokenSchema = z.object({
  refresh_token: z.string().min(20),
})

export const logoutSchema = z.object({
  refresh_token: z.string().min(20),
})

export const securityPolicyUpdateSchema = z.object({
  password_min_length: z.number().int().min(8).max(64),
  require_uppercase: z.boolean(),
  require_lowercase: z.boolean(),
  require_number: z.boolean(),
  require_special_char: z.boolean(),
  session_timeout_hours: z.number().int().min(1).max(24 * 30),
  allow_concurrent_sessions: z.boolean(),
  enforce_ip_allowlist: z.boolean(),
  ip_allowlist: z.array(z.string().min(3).max(120)).max(100),
  two_factor_required_admins: z.boolean(),
})

export const securitySessionsListQuerySchema = z.object({
  active_only: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((value) => {
      if (value === undefined) return undefined
      if (typeof value === 'boolean') return value
      return value.toLowerCase() === 'true'
    }),
  role: z.string().min(1).max(40).optional(),
})

export const smsSendSchema = z.object({
  phone: z.string().min(8).max(20),
  student_name: z.string().max(120).optional(),
  message: z.string().min(1).max(1000),
  type: smsTypeEnum.optional(),
  channel: deliveryChannelEnum.optional(),
  template_id: z.string().max(120).optional(),
})

export const smsBulkSendSchema = z.object({
  recipients: z
    .array(
      z.object({
        phone: z.string().min(8).max(20),
        student_name: z.string().max(120).optional(),
      }),
    )
    .min(1)
    .max(500),
  message: z.string().min(1).max(1000),
  type: smsTypeEnum.optional(),
  channel: deliveryChannelEnum.optional(),
  template_id: z.string().max(120).optional(),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const r2SignUploadSchema = z.object({
  object_key: z
    .string()
    .min(3)
    .max(1024)
    .regex(
      /^[\w\-./]+$/,
      'object_key may only contain alphanumeric characters, hyphens, underscores, dots, and forward slashes',
    )
    .refine((v) => !v.includes('..'), 'object_key must not contain path traversal sequences'),
  content_type: z.string().min(3).max(255),
})

export const noticeCreateSchema = z
  .object({
    title: z.string().min(2),
    message: z.string().min(2),
    audience: z.enum(['all', 'class']),
    class_name: z.string().min(1).nullable().optional(),
    send_sms: z.boolean().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.audience === 'class' && !val.class_name) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'class_name is required when audience=class' })
    }
  })

export const timetableCreateSchema = z.object({
  class_name: z.string().min(1),
  day: dayEnum,
  period: z.string().min(1),
  subject: z.string().min(1),
  teacher: z.string().min(1),
  start_time: z.string().min(4),
  end_time: z.string().min(4),
  send_sms: z.boolean().optional(),
})

export const auditSignSchema = z.object({
  id: z.number(),
  action: z.string().min(1),
  module: z.string().min(1),
  actor_name: z.string().min(1),
  actor_role: z.string().min(1),
  target: z.string().min(1),
  metadata: z.string(),
  created_at: z.string().min(8),
  prev_hash: z.string().min(1),
  signature_version: z.number().int(),
})

export const studentCreateSchema = z.object({
  name: z.string().min(1),
  roll_number: z.string().min(1),
  class_name: z.string().min(1),
  section: z.string().min(1),
  parent_name: z.string().min(1),
  phone: z.string().min(8),
  admission_date: z.string().min(8),
  email: z.string().email().nullable().optional(),
  address: z.string().nullable().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  parent_user_id: z.number().int().positive().nullable().optional(),
})

export const studentImportSchema = z.object({
  csv_text: z.string().min(1).max(2_000_000),
  skip_duplicates: z.boolean().optional(),
})

export const assignmentCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(4000).nullable().optional(),
  subject: z.string().min(1).max(120),
  class_name: z.string().min(1).max(120),
  due_date: z.string().min(8),
  resource_url: z.string().url().max(500).nullable().optional(),
})

export const assignmentListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  per_page: z.coerce.number().int().positive().optional(),
  class_name: z.string().min(1).max(120).optional(),
  status: assignmentWorkflowStatusEnum.optional(),
})

export const assignmentStatusUpdateSchema = z.object({
  status: assignmentWorkflowStatusEnum,
})

export const assignmentSubmissionCreateSchema = z.object({
  submission_text: z.string().max(4000).nullable().optional(),
  attachment_url: z.string().url().max(500).nullable().optional(),
})

export const classroomResourceCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(4000).nullable().optional(),
  class_name: z.string().min(1).max(120),
  subject: z.string().min(1).max(120),
  resource_type: classroomResourceTypeEnum,
  url: z.string().url().max(500),
  assignment_id: z.number().int().positive().nullable().optional(),
})

export const classroomResourceListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  per_page: z.coerce.number().int().positive().optional(),
  class_name: z.string().min(1).max(120).optional(),
  subject: z.string().min(1).max(120).optional(),
  resource_type: classroomResourceTypeEnum.optional(),
})

const classSectionInputSchema = z.object({
  name: z.string().min(1).max(40),
  capacity: z.number().int().positive().max(500),
})

export const classCreateSchema = z.object({
  name: z.string().min(1).max(120),
  grade: z.number().int().min(1).max(99),
  class_teacher: z.string().max(160).nullable().optional(),
  academic_year: z.string().min(4).max(20),
  room: z.string().max(120).nullable().optional(),
  color: z.string().min(1).max(40).optional(),
  sections: z.array(classSectionInputSchema).min(1).max(30),
})

export const classUpdateSchema = z
  .object({
    name: z.string().min(1).max(120).optional(),
    grade: z.number().int().min(1).max(99).optional(),
    class_teacher: z.string().max(160).nullable().optional(),
    academic_year: z.string().min(4).max(20).optional(),
    room: z.string().max(120).nullable().optional(),
    color: z.string().min(1).max(40).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided',
  })

export const classSectionCreateSchema = classSectionInputSchema

export const classSectionUpdateSchema = z
  .object({
    name: z.string().min(1).max(40).optional(),
    capacity: z.number().int().positive().max(500).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided',
  })

export const assignmentSubmissionReviewSchema = z
  .object({
    status: assignmentSubmissionStatusEnum.optional(),
    feedback: z.string().max(4000).nullable().optional(),
    score: z.number().min(0).max(100).nullable().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided',
  })

export const certificateIssueSchema = z.object({
  certificate_no: z.string().min(1),
  student_id: z.number().int().positive(),
  type: certificateTypeEnum,
  issue_date: z.string().min(8),
  issued_by: z.string().min(1).optional(),
  reason: z.string().nullable().optional(),
  conduct: z.string().nullable().optional(),
})

export const feeStructureCreateSchema = z.object({
  name: z.string().min(1),
  class_name: z.string().min(1),
  amount: z.number().positive(),
  due_date: z.string().min(8),
  academic_year: z.string().min(4),
})

export const feePaymentCreateSchema = z.object({
  student_id: z.number().int().positive(),
  fee_structure_id: z.number().int().positive().nullable().optional(),
  total_amount: z.number().nonnegative(),
  paid_amount: z.number().nonnegative(),
  payment_method: paymentMethodEnum.nullable().optional(),
  payment_date: z.string().nullable().optional(),
})

export const feePaymentCollectSchema = z.object({
  amount: z.number().positive(),
  payment_method: paymentMethodEnum,
  payment_date: z.string().nullable().optional(),
})

export const expenseCreateSchema = z.object({
  title: z.string().min(1).max(200),
  category: z.string().min(1).max(80),
  amount: z.number().positive(),
  date: z.string().min(8),
  vendor_or_staff: z.string().max(160).nullable().optional(),
  payment_method: expensePaymentMethodEnum,
  reference_no: z.string().max(120).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
})

export const manualJournalCreateSchema = z.object({
  entry_date: z.string().min(8),
  description: z.string().min(1).max(240),
  reference_no: z.string().max(120).nullable().optional(),
  debit_account_id: z.number().int().positive(),
  credit_account_id: z.number().int().positive(),
  amount: z.number().positive(),
  notes: z.string().max(1000).nullable().optional(),
})

export const bankAccountCreateSchema = z.object({
  account_name: z.string().min(1).max(160),
  bank_name: z.string().min(1).max(160),
  account_number: z.string().min(4).max(60),
  ifsc_code: z.string().max(40).nullable().optional(),
  opening_balance: z.number().nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
})

export const bankReconciliationCreateSchema = z.object({
  bank_account_id: z.number().int().positive(),
  transaction_date: z.string().min(8),
  description: z.string().min(1).max(240),
  reference_no: z.string().max(120).nullable().optional(),
  amount: z.number().positive(),
  direction: bankEntryDirectionEnum,
  notes: z.string().max(1000).nullable().optional(),
})

export const bankReconciliationMatchSchema = z.object({
  ledger_entry_id: z.number().int().positive().nullable().optional(),
  matched: z.boolean(),
})

export const trialBalanceQuerySchema = z.object({
  from: z.string().min(8).optional(),
  to: z.string().min(8).optional(),
})

export const vendorCreateSchema = z.object({
  name: z.string().min(1).max(160),
  contact_name: z.string().max(160).nullable().optional(),
  phone: z.string().max(40).nullable().optional(),
  email: z.string().email().max(160).nullable().optional(),
  address: z.string().max(500).nullable().optional(),
  gstin: z.string().max(40).nullable().optional(),
})

export const inventoryItemCreateSchema = z.object({
  sku: z.string().min(1).max(80),
  name: z.string().min(1).max(160),
  category: z.string().min(1).max(80),
  unit: z.string().min(1).max(30).optional(),
  current_stock: z.number().int().nonnegative().optional(),
  reorder_level: z.number().int().nonnegative().optional(),
  unit_cost: z.number().nonnegative().nullable().optional(),
  location: z.string().max(160).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
  vendor_id: z.number().int().positive().nullable().optional(),
})

export const inventoryItemUpdateSchema = z
  .object({
    sku: z.string().min(1).max(80).optional(),
    name: z.string().min(1).max(160).optional(),
    category: z.string().min(1).max(80).optional(),
    unit: z.string().min(1).max(30).optional(),
    current_stock: z.number().int().nonnegative().optional(),
    reorder_level: z.number().int().nonnegative().optional(),
    unit_cost: z.number().nonnegative().nullable().optional(),
    location: z.string().max(160).nullable().optional(),
    notes: z.string().max(1000).nullable().optional(),
    vendor_id: z.number().int().positive().nullable().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided',
  })

export const purchaseOrderCreateSchema = z.object({
  vendor_id: z.number().int().positive(),
  order_date: z.string().min(8).optional(),
  expected_date: z.string().min(8).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
  items: z
    .array(
      z.object({
        inventory_item_id: z.number().int().positive(),
        quantity: z.number().int().positive(),
        unit_price: z.number().nonnegative(),
      }),
    )
    .min(1)
    .max(100),
})

export const purchaseOrderListQuerySchema = z.object({
  status: purchaseOrderStatusEnum.optional(),
  page: z.coerce.number().int().positive().optional(),
  per_page: z.coerce.number().int().positive().optional(),
})

export const payrollProfileUpsertSchema = z.object({
  base_salary: z.number().nonnegative(),
  allowances: z.number().nonnegative().optional(),
  deductions: z.number().nonnegative().optional(),
  payment_method: z.string().max(40).nullable().optional(),
  bank_name: z.string().max(120).nullable().optional(),
  bank_account_no: z.string().max(60).nullable().optional(),
  ifsc_code: z.string().max(40).nullable().optional(),
  pan_number: z.string().max(40).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
})

export const payrollGenerateSchema = z.object({
  month: payrollMonthSchema,
  staff_ids: z.array(z.number().int().positive()).max(500).optional(),
})

export const payrollMarkPaidSchema = z.object({
  payment_reference: z.string().max(120).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
})

export const payrollSummaryQuerySchema = z.object({
  month: payrollMonthSchema.optional(),
})

export const payrollRecordsListQuerySchema = z.object({
  month: payrollMonthSchema.optional(),
  status: payrollStatusEnum.optional(),
  page: z.coerce.number().int().positive().optional(),
  per_page: z.coerce.number().int().positive().optional(),
})

export const leaveRequestCreateSchema = z.object({
  staff_id: z.number().int().positive().optional(),
  leave_type: z.string().min(1).max(80),
  start_date: z.string().min(8),
  end_date: z.string().min(8),
  reason: z.string().max(2000).nullable().optional(),
})

export const leaveRequestListQuerySchema = z.object({
  staff_id: z.coerce.number().int().positive().optional(),
  status: leaveRequestStatusEnum.optional(),
  page: z.coerce.number().int().positive().optional(),
  per_page: z.coerce.number().int().positive().optional(),
})

export const leaveRequestReviewSchema = z.object({
  status: z.enum(['approved', 'rejected', 'completed']),
  decision_note: z.string().max(2000).nullable().optional(),
})

export const appraisalCreateSchema = z.object({
  staff_id: z.number().int().positive(),
  review_period: z.string().min(1).max(120),
  review_date: z.string().min(8),
  overall_rating: z.number().min(0).max(5),
  strengths: z.string().max(4000).nullable().optional(),
  improvement_areas: z.string().max(4000).nullable().optional(),
  goals: z.string().max(4000).nullable().optional(),
  status: appraisalStatusEnum.optional(),
})

export const appraisalUpdateSchema = z
  .object({
    review_period: z.string().min(1).max(120).optional(),
    review_date: z.string().min(8).optional(),
    overall_rating: z.number().min(0).max(5).optional(),
    strengths: z.string().max(4000).nullable().optional(),
    improvement_areas: z.string().max(4000).nullable().optional(),
    goals: z.string().max(4000).nullable().optional(),
    status: appraisalStatusEnum.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided',
  })

export const appraisalListQuerySchema = z.object({
  staff_id: z.coerce.number().int().positive().optional(),
  status: appraisalStatusEnum.optional(),
  page: z.coerce.number().int().positive().optional(),
  per_page: z.coerce.number().int().positive().optional(),
})

export const staffTaskCreateSchema = z.object({
  staff_id: z.number().int().positive(),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).nullable().optional(),
  priority: staffTaskPriorityEnum,
  status: staffTaskStatusEnum.optional(),
  due_date: z.string().min(8),
})

export const staffTaskStatusUpdateSchema = z.object({
  status: staffTaskStatusEnum,
})

export const staffTaskListQuerySchema = z.object({
  staff_id: z.coerce.number().int().positive().optional(),
  status: staffTaskStatusEnum.optional(),
  page: z.coerce.number().int().positive().optional(),
  per_page: z.coerce.number().int().positive().optional(),
})

export const webhookSubscriptionCreateSchema = z.object({
  name: z.string().min(1).max(120),
  url: z.string().url().max(500),
  events: webhookEventsSchema,
  active: z.boolean().optional(),
  timeout_ms: z.number().int().min(1000).max(30000).optional(),
  secret: z.string().min(8).max(200).optional(),
  headers: webhookHeadersSchema,
})

export const webhookSubscriptionUpdateSchema = z
  .object({
    name: z.string().min(1).max(120).optional(),
    url: z.string().url().max(500).optional(),
    events: webhookEventsSchema.optional(),
    active: z.boolean().optional(),
    timeout_ms: z.number().int().min(1000).max(30000).optional(),
    secret: z.string().min(8).max(200).optional(),
    headers: webhookHeadersSchema,
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided',
  })

export const webhookDeliveryListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  per_page: z.coerce.number().int().positive().optional(),
  subscription_id: z.coerce.number().int().positive().optional(),
  status: webhookDeliveryStatusEnum.optional(),
  event_type: z.string().min(1).max(80).optional(),
})

export const attendanceBulkCreateSchema = z.object({
  records: z
    .array(
      z.object({
        student_id: z.number().int().positive(),
        date: z.string().min(8),
        status: attendanceStatusEnum,
      }),
    )
    .min(1)
    .max(200),
})

export const attendanceCreateSchema = z.object({
  student_id: z.number().int().positive(),
  date: z.string().min(8),
  status: attendanceStatusEnum,
})

export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  per_page: z.coerce.number().int().positive().optional(),
})

const calendarEventTypeEnum = z.enum(['holiday', 'exam', 'event', 'pta', 'sports'])

export const calendarEventCreateSchema = z.object({
  title: z.string().min(1).max(200),
  date: z.string().min(8),
  end_date: z.string().nullable().optional(),
  type: calendarEventTypeEnum,
  description: z.string().max(500).nullable().optional(),
})

export const examCreateSchema = z.object({
  name: z.string().min(1),
  class_name: z.string().min(1),
  subject: z.string().min(1),
  date: z.string().min(8),
  max_marks: z.number().int().positive().max(1000),
  academic_year: z.string().min(4),
})

export const examResultUpsertSchema = z.object({
  exam_id: z.number().int().positive(),
  student_id: z.number().int().positive(),
  marks_obtained: z.number().int().nonnegative(),
})

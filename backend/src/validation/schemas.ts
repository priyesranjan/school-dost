import { z } from 'zod'

const dayEnum = z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
const attendanceStatusEnum = z.enum(['present', 'absent', 'late'])
const paymentMethodEnum = z.enum(['cash', 'upi', 'bank_transfer', 'cheque'])
const certificateTypeEnum = z.enum(['tc', 'character'])

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
  parent_user_id: z.number().int().positive().nullable().optional(),
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

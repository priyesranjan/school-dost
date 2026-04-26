import type { PrismaClient } from '@prisma/client'

export type SmsLogType = 'payment' | 'due_reminder' | 'attendance' | 'general' | 'notice' | 'schedule' | 'campaign' | 'otp'
export type DeliveryChannel = 'sms' | 'whatsapp'
export type SmsDeliveryStatus = 'pending' | 'sent' | 'failed'

export type SmsSendInput = {
  phone: string
  student_name?: string
  message: string
  type?: SmsLogType
  channel?: DeliveryChannel
  template_id?: string
}

export type SmsBulkSendInput = {
  recipients: Array<{
    phone: string
    student_name?: string
  }>
  message: string
  type?: SmsLogType
  channel?: DeliveryChannel
  template_id?: string
}

type ProviderDispatchResult = {
  status: SmsDeliveryStatus
  providerMessageId?: string | null
  providerResponse?: Record<string, unknown> | null
  error?: string | null
}

function normalizePhone(phone: string) {
  return phone.replace(/\s+/g, '').trim()
}

function mapSmsLog(row: any) {
  return {
    id: Number(row.id),
    phone: row.phone,
    student_name: row.studentName || '',
    message: row.message,
    type: row.type,
    status: row.status,
    sent_at: (row.sentAt || row.createdAt).toISOString(),
    channel: row.channel,
    template_id: row.templateId,
    provider_message_id: row.providerMessageId,
    error: row.error,
  }
}

function providerUrlFor(channel: DeliveryChannel) {
  if (channel === 'whatsapp') {
    return process.env.WHATSAPP_PROVIDER_WEBHOOK_URL || process.env.COMMS_PROVIDER_WEBHOOK_URL || ''
  }
  return process.env.SMS_PROVIDER_WEBHOOK_URL || process.env.COMMS_PROVIDER_WEBHOOK_URL || ''
}

function providerApiKeyFor(channel: DeliveryChannel) {
  if (channel === 'whatsapp') {
    return process.env.WHATSAPP_PROVIDER_API_KEY || process.env.COMMS_PROVIDER_API_KEY || ''
  }
  return process.env.SMS_PROVIDER_API_KEY || process.env.COMMS_PROVIDER_API_KEY || ''
}

async function parseProviderResponse(response: Response): Promise<Record<string, unknown>> {
  const text = await response.text()
  if (!text) return {}
  try {
    return JSON.parse(text) as Record<string, unknown>
  } catch {
    return { raw: text }
  }
}

function extractProviderMessageId(payload: Record<string, unknown>) {
  const candidates = [payload.id, payload.message_id, payload.messageId, payload.sid, payload.reference]
  const found = candidates.find((value) => typeof value === 'string' && value.trim().length > 0)
  return typeof found === 'string' ? found : null
}

async function dispatchToProvider(input: {
  phone: string
  student_name?: string
  message: string
  type: SmsLogType
  channel: DeliveryChannel
  template_id?: string
}): Promise<ProviderDispatchResult> {
  const providerUrl = providerUrlFor(input.channel)

  if (!providerUrl) {
    return {
      status: 'sent',
      providerMessageId: `demo_${input.channel}_${Date.now()}`,
      providerResponse: { mode: 'demo', channel: input.channel },
    }
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
    const apiKey = providerApiKeyFor(input.channel)
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`

    const response = await fetch(providerUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        to: input.phone,
        phone: input.phone,
        channel: input.channel,
        message: input.message,
        type: input.type,
        student_name: input.student_name || '',
        template_id: input.template_id || null,
      }),
    })

    const providerResponse = await parseProviderResponse(response)
    if (!response.ok) {
      return {
        status: 'failed',
        providerResponse,
        error: `Provider returned ${response.status}`,
      }
    }

    return {
      status: 'sent',
      providerMessageId: extractProviderMessageId(providerResponse),
      providerResponse,
    }
  } catch (error) {
    return {
      status: 'failed',
      providerResponse: null,
      error: error instanceof Error ? error.message : 'Provider dispatch failed',
    }
  }
}

export async function sendSmsMessage(db: PrismaClient, input: SmsSendInput) {
  const channel = input.channel || 'sms'
  const type = input.type || 'general'
  const phone = normalizePhone(input.phone)

  const pending = await (db as any).smsLog.create({
    data: {
      phone,
      studentName: input.student_name || null,
      message: input.message,
      type,
      channel,
      status: 'pending',
      templateId: input.template_id || null,
    },
  })

  const result = await dispatchToProvider({
    phone,
    student_name: input.student_name,
    message: input.message,
    type,
    channel,
    template_id: input.template_id,
  })

  const updated = await (db as any).smsLog.update({
    where: { id: pending.id },
    data: {
      status: result.status,
      sentAt: result.status === 'sent' ? new Date() : null,
      providerMessageId: result.providerMessageId || null,
      providerResponse: result.providerResponse || undefined,
      error: result.error || null,
    },
  })

  return mapSmsLog(updated)
}

export async function sendBulkSmsMessages(db: PrismaClient, input: SmsBulkSendInput) {
  const logs = []
  for (const recipient of input.recipients) {
    logs.push(
      await sendSmsMessage(db, {
        phone: recipient.phone,
        student_name: recipient.student_name,
        message: input.message,
        type: input.type || 'campaign',
        channel: input.channel || 'sms',
        template_id: input.template_id,
      }),
    )
  }
  return logs
}

export async function listSmsLogs(
  db: PrismaClient,
  input: {
    page: number
    per_page: number
    status?: SmsDeliveryStatus
    channel?: DeliveryChannel
    type?: SmsLogType
    phone?: string
  },
) {
  const where = {
    ...(input.status ? { status: input.status } : {}),
    ...(input.channel ? { channel: input.channel } : {}),
    ...(input.type ? { type: input.type } : {}),
    ...(input.phone ? { phone: { contains: normalizePhone(input.phone), mode: 'insensitive' as const } } : {}),
  }

  const [rows, total] = await Promise.all([
    (db as any).smsLog.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }],
      skip: (input.page - 1) * input.per_page,
      take: input.per_page,
    }),
    (db as any).smsLog.count({ where }),
  ])

  return {
    items: rows.map(mapSmsLog),
    total,
    page: input.page,
    per_page: input.per_page,
  }
}

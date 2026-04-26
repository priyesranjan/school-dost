import api from './api'

export interface WebhookEventCatalogItem {
  key: string
  label: string
  description: string
}

export interface WebhookSubscriptionRecord {
  id: number
  name: string
  url: string
  events: string[]
  active: boolean
  timeout_ms: number
  headers: Record<string, string>
  failure_count: number
  last_success_at: string | null
  last_failure_at: string | null
  created_at: string
  updated_at: string
  secret_hint: string
}

export interface WebhookDeliveryRecord {
  id: number
  subscription_id: number
  subscription_name: string | null
  event_type: string
  attempt: number
  status: 'pending' | 'success' | 'failed'
  response_status: number | null
  response_body: string | null
  error: string | null
  delivered_at: string | null
  created_at: string
}

export interface WebhookSubscriptionPayload {
  name: string
  url: string
  events: string[]
  active?: boolean
  timeout_ms?: number
  secret?: string
  headers?: Record<string, string>
}

export const webhooksService = {
  async getCatalog() {
    const res = await api.get('/webhooks/catalog')
    return res.data.data as { events: WebhookEventCatalogItem[] }
  },

  async listSubscriptions() {
    const res = await api.get('/webhooks')
    return res.data.data as WebhookSubscriptionRecord[]
  },

  async createSubscription(payload: WebhookSubscriptionPayload) {
    const res = await api.post('/webhooks', payload)
    return res.data.data as WebhookSubscriptionRecord
  },

  async updateSubscription(id: number, payload: Partial<WebhookSubscriptionPayload>) {
    const res = await api.patch(`/webhooks/${id}`, payload)
    return res.data.data as WebhookSubscriptionRecord
  },

  async sendTest(id: number) {
    const res = await api.post(`/webhooks/${id}/test`)
    return res.data.data as { event_id: string }
  },

  async listDeliveries(params?: {
    page?: number
    per_page?: number
    subscription_id?: number
    status?: 'pending' | 'success' | 'failed'
    event_type?: string
  }) {
    const res = await api.get('/webhooks/deliveries', { params })
    return res.data.data as {
      items: WebhookDeliveryRecord[]
      total: number
      page: number
      per_page: number
    }
  },
}

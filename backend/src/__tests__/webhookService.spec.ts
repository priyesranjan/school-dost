import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset } from 'vitest-mock-extended'
import { dispatchWebhookEvent } from '../services/webhookService'

const prismaMock = mockDeep<PrismaClient>()

describe('webhookService', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    mockReset(prismaMock)
    global.fetch = vi.fn()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it('should dispatch matching wildcard subscriptions', async () => {
    prismaMock.webhookSubscription.findMany.mockResolvedValue([
      {
        id: 1n,
        name: 'Finance Hook',
        url: 'https://example.com/hooks',
        secret: 'supersecret123',
        events: ['fees.*'],
        active: true,
        headers: null,
        timeoutMs: 2000,
        failureCount: 0,
        lastSuccessAt: null,
        lastFailureAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any,
    ])
    prismaMock.webhookDelivery.create.mockResolvedValue({ id: 101n } as any)
    prismaMock.webhookDelivery.update.mockResolvedValue({} as any)
    prismaMock.webhookSubscription.update.mockResolvedValue({} as any)
    vi.mocked(global.fetch).mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }))

    const result = await dispatchWebhookEvent(prismaMock, {
      type: 'fees.payment.recorded',
      tenant_slug: 'demo',
      data: { receipt_number: 'RCPT-1' },
    })

    expect(result.delivered_to).toBe(1)
    expect(prismaMock.webhookDelivery.create).toHaveBeenCalledOnce()
    expect(global.fetch).toHaveBeenCalledOnce()
  })

  it('should ignore subscriptions that do not match the event type', async () => {
    prismaMock.webhookSubscription.findMany.mockResolvedValue([
      {
        id: 2n,
        name: 'Comms Hook',
        url: 'https://example.com/comms',
        secret: 'supersecret123',
        events: ['communications.*'],
        active: true,
        headers: null,
        timeoutMs: 2000,
        failureCount: 0,
        lastSuccessAt: null,
        lastFailureAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any,
    ])

    const result = await dispatchWebhookEvent(prismaMock, {
      type: 'fees.payment.recorded',
      tenant_slug: 'demo',
      data: { receipt_number: 'RCPT-2' },
    })

    expect(result.delivered_to).toBe(0)
    expect(prismaMock.webhookDelivery.create).not.toHaveBeenCalled()
    expect(global.fetch).not.toHaveBeenCalled()
  })
})

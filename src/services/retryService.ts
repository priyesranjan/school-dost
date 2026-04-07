export interface RetryOptions {
  retries: number
  initialDelayMs: number
  maxDelayMs: number
  backoffMultiplier: number
  jitterRatio?: number
  shouldRetry?: (error: unknown, attempt: number) => boolean
}

const defaultOptions: RetryOptions = {
  retries: 2,
  initialDelayMs: 300,
  maxDelayMs: 2000,
  backoffMultiplier: 2,
  jitterRatio: 0.2,
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function applyJitter(delay: number, ratio: number) {
  const jitter = delay * ratio
  const min = Math.max(0, delay - jitter)
  const max = delay + jitter
  return Math.round(min + Math.random() * (max - min))
}

function defaultRetryPolicy(error: unknown) {
  const maybe = error as { response?: { status?: number }; code?: string }

  if (maybe?.code === 'ECONNABORTED' || maybe?.code === 'ERR_NETWORK') return true
  const status = maybe?.response?.status
  if (!status) return true
  return status >= 500 || status === 429
}

export function shouldRetryHttpStatus(status: number) {
  return status >= 500 || status === 429 || status === 408
}

export async function executeWithRetry<T>(action: () => Promise<T>, options?: Partial<RetryOptions>): Promise<T> {
  const cfg: RetryOptions = { ...defaultOptions, ...options }
  let delay = cfg.initialDelayMs

  for (let attempt = 0; attempt <= cfg.retries; attempt += 1) {
    try {
      return await action()
    } catch (error) {
      const canRetry = attempt < cfg.retries && (cfg.shouldRetry ? cfg.shouldRetry(error, attempt + 1) : defaultRetryPolicy(error))
      if (!canRetry) {
        throw error
      }
      const waitMs = applyJitter(delay, cfg.jitterRatio || 0)
      await sleep(waitMs)
      delay = Math.min(Math.round(delay * cfg.backoffMultiplier), cfg.maxDelayMs)
    }
  }

  throw new Error('Retry exhausted')
}

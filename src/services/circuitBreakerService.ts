import { emitSystemNotification } from './operationsAlertService'

export interface CircuitBreakerState {
  key: string
  failures: number
  openedAt: number | null
  halfOpenedAt: number | null
  status: 'closed' | 'open' | 'half_open'
  cooldownMs: number
  threshold: number
}

export interface CircuitBreakerEvent {
  id: number
  key: string
  type: 'opened' | 'half_open' | 'closed' | 'reset' | 'reset_all'
  createdAt: number
  detail: string
}

interface EscalationState {
  key: string
  lastEscalatedAt: number
}

export interface CircuitBreakerOptions {
  threshold: number
  cooldownMs: number
  shouldTrip?: (error: unknown) => boolean
}

const STORAGE_KEY = 'erp_circuit_breakers'
const EVENTS_KEY = 'erp_circuit_breaker_events'
const ESCALATION_KEY = 'erp_circuit_escalations'
const MAX_EVENTS = 200
const ESCALATION_WINDOW_MS = 10 * 60 * 1000
const OPEN_EVENTS_THRESHOLD = 3

const defaults: CircuitBreakerOptions = {
  threshold: 3,
  cooldownMs: 60000,
}

const halfOpenLocks = new Set<string>()

function readStates(): Record<string, CircuitBreakerState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, CircuitBreakerState>) : {}
  } catch {
    return {}
  }
}

function writeStates(states: Record<string, CircuitBreakerState>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(states))
}

function readEvents(): CircuitBreakerEvent[] {
  try {
    const raw = localStorage.getItem(EVENTS_KEY)
    return raw ? (JSON.parse(raw) as CircuitBreakerEvent[]) : []
  } catch {
    return []
  }
}

function writeEvents(events: CircuitBreakerEvent[]) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events.slice(0, MAX_EVENTS)))
}

function readEscalations(): Record<string, EscalationState> {
  try {
    const raw = localStorage.getItem(ESCALATION_KEY)
    return raw ? (JSON.parse(raw) as Record<string, EscalationState>) : {}
  } catch {
    return {}
  }
}

function writeEscalations(data: Record<string, EscalationState>) {
  localStorage.setItem(ESCALATION_KEY, JSON.stringify(data))
}

function maybeEmitEscalation(key: string) {
  const now = Date.now()
  const events = readEvents().filter((e) => e.key === key && e.type === 'opened' && now - e.createdAt <= ESCALATION_WINDOW_MS)
  if (events.length < OPEN_EVENTS_THRESHOLD) return

  const escalations = readEscalations()
  const prev = escalations[key]
  if (prev && now - prev.lastEscalatedAt <= ESCALATION_WINDOW_MS) return

  escalations[key] = { key, lastEscalatedAt: now }
  writeEscalations(escalations)
  emitSystemNotification(
    'Service Instability Alert',
    `${key} circuit opened ${events.length} times in the last ${Math.floor(ESCALATION_WINDOW_MS / 60000)} minutes.`,
    {
      severity: 'critical',
      sourceKey: `circuit:${key}:instability`,
      dedupWindowMs: ESCALATION_WINDOW_MS,
    },
  )
}

function pushEvent(key: string, type: CircuitBreakerEvent['type'], detail: string) {
  const events = readEvents()
  events.unshift({
    id: Date.now() * 1000 + Math.floor(Math.random() * 1000),
    key,
    type,
    createdAt: Date.now(),
    detail,
  })
  writeEvents(events)
  if (type === 'opened') {
    maybeEmitEscalation(key)
  }
}

function getState(key: string, options?: Partial<CircuitBreakerOptions>): CircuitBreakerState {
  const cfg = { ...defaults, ...options }
  const states = readStates()
  const existing = states[key]
  if (existing) {
    if (!existing.status) existing.status = existing.openedAt ? 'open' : 'closed'
    if (typeof existing.halfOpenedAt === 'undefined') existing.halfOpenedAt = null
    existing.cooldownMs = cfg.cooldownMs
    existing.threshold = cfg.threshold
    states[key] = existing
    writeStates(states)
    return existing
  }

  const created: CircuitBreakerState = {
    key,
    failures: 0,
    openedAt: null,
    halfOpenedAt: null,
    status: 'closed',
    cooldownMs: cfg.cooldownMs,
    threshold: cfg.threshold,
  }
  states[key] = created
  writeStates(states)
  return created
}

function updateState(state: CircuitBreakerState) {
  const states = readStates()
  states[state.key] = state
  writeStates(states)
}

function resetState(key: string) {
  const states = readStates()
  delete states[key]
  writeStates(states)
}

export class CircuitOpenError extends Error {
  retryAfterMs: number

  constructor(message: string, retryAfterMs: number) {
    super(message)
    this.name = 'CircuitOpenError'
    this.retryAfterMs = retryAfterMs
  }
}

function shouldDefaultTrip(error: unknown) {
  const maybe = error as { response?: { status?: number }; status?: number; code?: string }
  const status = maybe?.status || maybe?.response?.status
  if (status === 400 || status === 401 || status === 403 || status === 404 || status === 422) return false
  if (maybe?.code === 'ERR_CANCELED') return false
  return true
}

function isOpen(state: CircuitBreakerState) {
  if (!state.openedAt) return false
  return Date.now() - state.openedAt < state.cooldownMs
}

function retryAfterMs(state: CircuitBreakerState) {
  if (!state.openedAt) return 0
  const elapsed = Date.now() - state.openedAt
  return Math.max(0, state.cooldownMs - elapsed)
}

function moveToOpen(state: CircuitBreakerState, detail: string) {
  const wasOpen = state.status === 'open'
  state.status = 'open'
  state.openedAt = Date.now()
  state.halfOpenedAt = null
  updateState(state)
  if (!wasOpen) {
    pushEvent(state.key, 'opened', detail)
  }
}

function moveToHalfOpen(state: CircuitBreakerState) {
  state.status = 'half_open'
  state.halfOpenedAt = Date.now()
  state.openedAt = null
  updateState(state)
  pushEvent(state.key, 'half_open', 'Cooldown elapsed, allowing recovery probe')
}

function moveToClosed(state: CircuitBreakerState, detail: string) {
  state.status = 'closed'
  state.failures = 0
  state.openedAt = null
  state.halfOpenedAt = null
  updateState(state)
  pushEvent(state.key, 'closed', detail)
}

export async function runWithCircuitBreaker<T>(
  key: string,
  action: () => Promise<T>,
  options?: Partial<CircuitBreakerOptions>,
): Promise<T> {
  const cfg = { ...defaults, ...options }
  const state = getState(key, cfg)

  if (state.status === 'open') {
    if (isOpen(state)) {
      const wait = retryAfterMs(state)
      throw new CircuitOpenError(`Service temporarily unavailable (${key})`, wait)
    }
    moveToHalfOpen(state)
  }

  if (state.status === 'half_open') {
    if (halfOpenLocks.has(key)) {
      throw new CircuitOpenError(`Service recovery in progress (${key})`, 1000)
    }
    halfOpenLocks.add(key)

    try {
      const result = await action()
      moveToClosed(state, 'Half-open probe succeeded')
      return result
    } catch (error) {
      const shouldTrip = cfg.shouldTrip ? cfg.shouldTrip(error) : shouldDefaultTrip(error)
      if (shouldTrip) {
        state.failures = Math.max(state.failures + 1, state.threshold)
        moveToOpen(state, `Half-open probe failed (${state.failures}/${state.threshold})`)
      }
      throw error
    } finally {
      halfOpenLocks.delete(key)
    }
  }

  try {
    const result = await action()
    if (state.failures > 0) {
      moveToClosed(state, 'Service recovered and circuit closed')
    }
    return result
  } catch (error) {
    const shouldTrip = cfg.shouldTrip ? cfg.shouldTrip(error) : shouldDefaultTrip(error)
    if (shouldTrip) {
      state.failures += 1
      if (state.failures >= state.threshold) {
        moveToOpen(state, `Failure threshold reached (${state.failures}/${state.threshold})`)
      } else {
        updateState(state)
      }
    }
    throw error
  }
}

export function getCircuitBreakersSnapshot() {
  return Object.values(readStates())
}

export function clearCircuitBreaker(key: string) {
  resetState(key)
  pushEvent(key, 'reset', 'Circuit reset by operator')
}

export function clearAllCircuitBreakers() {
  writeStates({})
  pushEvent('all', 'reset_all', 'All circuits reset by operator')
}

export function getCircuitEventsSnapshot(limit = 20) {
  return readEvents().slice(0, limit)
}

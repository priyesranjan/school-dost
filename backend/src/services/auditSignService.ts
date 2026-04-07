import { createHmac } from 'node:crypto'
import { env } from '../config/env'

type AuditSignPayload = {
  id: number
  action: string
  module: string
  actor_name: string
  actor_role: string
  target: string
  metadata: string
  created_at: string
  prev_hash: string
  signature_version: number
}

function signatureInput(entry: AuditSignPayload) {
  return [
    entry.id,
    entry.action,
    entry.module,
    entry.actor_name,
    entry.actor_role,
    entry.target,
    entry.metadata,
    entry.created_at,
    entry.prev_hash,
    entry.signature_version,
    env.auditSigningSalt,
  ].join('|')
}

export function signAuditPayload(payload: AuditSignPayload) {
  return createHmac('sha256', env.auditSigningSalt)
    .update(signatureInput(payload))
    .digest('hex')
}

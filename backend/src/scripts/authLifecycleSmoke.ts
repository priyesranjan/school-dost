/* eslint-disable no-console */

type ApiError = {
  error?: {
    code?: string
    message?: string
  }
}

const apiBase = process.env.API_BASE_URL || 'http://localhost:8080'

async function postJson<T>(path: string, body: unknown, headers?: Record<string, string>) {
  const res = await fetch(`${apiBase}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    body: JSON.stringify(body),
  })

  const text = await res.text()
  const payload = text ? (JSON.parse(text) as T & ApiError) : ({} as T & ApiError)

  return { ok: res.ok, status: res.status, payload }
}

function requireCondition(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

async function main() {
  const phone = `98765${Math.floor(Math.random() * 89999 + 10000)}`

  const send = await postJson<{ data?: { session_id?: string } }>('/api/auth/otp/send', {
    phone,
    purpose: 'login',
  })
  requireCondition(send.ok, `otp/send failed: ${JSON.stringify(send.payload)}`)
  const sessionId = send.payload.data?.session_id
  requireCondition(sessionId, 'otp/send missing session_id')

  const verify = await postJson<{ data?: { access_token?: string; refresh_token?: string } }>('/api/auth/otp/verify', {
    session_id: sessionId,
    otp: '123456',
  })
  requireCondition(verify.ok, `otp/verify failed: ${JSON.stringify(verify.payload)}`)
  const accessToken = verify.payload.data?.access_token
  const refreshToken1 = verify.payload.data?.refresh_token
  requireCondition(accessToken, 'otp/verify missing access_token')
  requireCondition(refreshToken1, 'otp/verify missing refresh_token')

  const rotate = await postJson<{ data?: { access_token?: string; refresh_token?: string } }>('/api/auth/refresh', {
    refresh_token: refreshToken1,
  })
  requireCondition(rotate.ok, `auth/refresh failed: ${JSON.stringify(rotate.payload)}`)
  const refreshToken2 = rotate.payload.data?.refresh_token
  requireCondition(refreshToken2, 'auth/refresh missing rotated refresh_token')

  const reuseAttempt = await postJson('/api/auth/refresh', { refresh_token: refreshToken1 })
  requireCondition(!reuseAttempt.ok, 'reusing refresh token unexpectedly succeeded')
  requireCondition(
    reuseAttempt.payload.error?.code === 'TOKEN_REUSE_DETECTED',
    `expected TOKEN_REUSE_DETECTED, got: ${JSON.stringify(reuseAttempt.payload)}`,
  )

  const secondTokenAttempt = await postJson('/api/auth/refresh', { refresh_token: refreshToken2 })
  requireCondition(!secondTokenAttempt.ok, 'second token should be revoked after reuse detection')
  requireCondition(
    secondTokenAttempt.payload.error?.code === 'TOKEN_REUSE_DETECTED' ||
      secondTokenAttempt.payload.error?.code === 'INVALID_REFRESH_TOKEN',
    `expected TOKEN_REUSE_DETECTED or INVALID_REFRESH_TOKEN, got: ${JSON.stringify(secondTokenAttempt.payload)}`,
  )

  const logoutAll = await postJson<{ data?: { revoked_count?: number } }>(
    '/api/auth/logout-all',
    {},
    { Authorization: `Bearer ${accessToken}` },
  )
  requireCondition(logoutAll.ok, `auth/logout-all failed: ${JSON.stringify(logoutAll.payload)}`)

  console.log(
    JSON.stringify(
      {
        data: {
          pass: true,
          phone,
          checks: {
            otp_send: true,
            otp_verify: true,
            refresh_rotate: true,
            reuse_detection: true,
            logout_all: true,
          },
        },
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : 'Auth lifecycle smoke test failed'
  console.error(JSON.stringify({ error: { code: 'AUTH_SMOKE_TEST_FAILED', message } }, null, 2))
  process.exit(1)
})

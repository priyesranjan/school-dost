import dotenv from 'dotenv'

dotenv.config()

const required = ['DATABASE_URL'] as const

function ensure(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

function isWeakSecret(value: string, fallbackHints: string[]) {
  const normalized = value.trim().toLowerCase()
  return fallbackHints.some((hint) => normalized.includes(hint))
}

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env variable: ${key}`)
  }
}

const nodeEnv = process.env.NODE_ENV || 'development'
const jwtSecret = process.env.JWT_SECRET || 'change-me-jwt-secret'
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'change-me-refresh-secret'
const auditSigningSalt = process.env.AUDIT_SIGNING_SALT || 'backend-signing-salt'

if (nodeEnv === 'production') {
  ensure(jwtSecret.length >= 24, 'JWT_SECRET must be at least 24 characters in production')
  ensure(jwtRefreshSecret.length >= 24, 'JWT_REFRESH_SECRET must be at least 24 characters in production')
  ensure(auditSigningSalt.length >= 24, 'AUDIT_SIGNING_SALT must be at least 24 characters in production')
  ensure(!isWeakSecret(jwtSecret, ['change-me', 'jwt-secret']), 'JWT_SECRET uses an insecure default-like value')
  ensure(!isWeakSecret(jwtRefreshSecret, ['change-me', 'refresh-secret']), 'JWT_REFRESH_SECRET uses an insecure default-like value')
  ensure(!isWeakSecret(auditSigningSalt, ['backend-signing-salt', 'change-me']), 'AUDIT_SIGNING_SALT uses an insecure default-like value')
}

export const env = {
  nodeEnv,
  port: Number(process.env.PORT || 8080),
  databaseUrl: process.env.DATABASE_URL as string,
  r2: {
    accountId: process.env.R2_ACCOUNT_ID || '',
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    bucket: process.env.R2_BUCKET || '',
    publicBaseUrl: process.env.R2_PUBLIC_BASE_URL || '',
    signExpiresSeconds: Number(process.env.R2_SIGN_EXPIRES_SECONDS || 300),
  },
  auditSigningSalt,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '12h',
  jwtRefreshSecret,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  refreshRevokedRetentionDays: Number(process.env.REFRESH_REVOKED_RETENTION_DAYS || 30),
}

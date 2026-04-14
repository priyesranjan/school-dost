import { cleanupRefreshTokens } from '../services/refreshTokenService'
import { prisma } from '../db/prisma'

async function main() {
  const result = await cleanupRefreshTokens(prisma)
  console.log(JSON.stringify({ data: result }, null, 2))
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : 'Refresh token cleanup failed'
  console.error(JSON.stringify({ error: { code: 'REFRESH_TOKEN_CLEANUP_FAILED', message } }, null, 2))
  process.exit(1)
})

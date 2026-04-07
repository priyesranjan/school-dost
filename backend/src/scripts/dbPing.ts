import { dbPing, pool } from '../db/pool'

async function main() {
  const row = await dbPing()
  console.log('DB ping success:', row)
  await pool.end()
}

main().catch(async (error) => {
  console.error('DB ping failed:', error)
  await pool.end()
  process.exit(1)
})

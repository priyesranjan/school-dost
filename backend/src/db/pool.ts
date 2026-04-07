import { Pool } from 'pg'
import { env } from '../config/env'

export const pool = new Pool({
  connectionString: env.databaseUrl,
})

export async function dbPing() {
  const result = await pool.query('SELECT now() AS server_time, current_database() AS db, current_user AS db_user')
  return result.rows[0]
}

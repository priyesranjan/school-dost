import 'dotenv/config'
import { getPlatformPrisma } from '../db/platformPool'

async function check() {
  const db = getPlatformPrisma()
  const admins = await db.superAdmin.findMany({
    select: { email: true, isRoot: true, phone: true },
  })
  console.log('--- Current SuperAdmins ---')
  admins.forEach((a: any) => console.log(`- ${a.email} [${a.phone}] (Root: ${a.isRoot})`))
  process.exit(0)
}

check()

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { getPlatformPrisma } from '../db/platformPool'

async function verify() {
  const platformDb = getPlatformPrisma()

  console.log('--- Root SuperAdmin Verification ---')

  // 1. Check Root Identity in DB
  const rootEmail = 'priyesranjan@gmail.com'
  const rootUser = await (platformDb as any).superAdmin.findUnique({
    where: { email: rootEmail },
  })

  if (!rootUser) {
    console.error('FAILED: Root user not found in database.')
    process.exit(1)
  }

  console.log('SUCCESS: Root user found in database.')
  console.log('User Details:', {
    email: rootUser.email,
    name: rootUser.name,
    phone: rootUser.phone,
    isRoot: rootUser.isRoot,
  })

  if (rootUser.phone !== '9288075422') {
    console.error('FAILED: phone number mismatch.')
    process.exit(1)
  }

  console.log('SUCCESS: isRoot flag is true.')

  // 2. Check a normal demo phone
  const demoPhone = '9876543201' // Normal admin
  const demoUserLookup = await (platformDb as any).superAdmin.findUnique({
    where: { phone: demoPhone },
  })

  if (demoUserLookup) {
    console.log('Normal SuperAdmin exists:', demoUserLookup.email)
    if (demoUserLookup.isRoot === true) {
      console.error('FAILED: Normal SuperAdmin is marked as root!')
      process.exit(1)
    }
  } else {
    console.log('Normal SuperAdmin (9876543201) does not exist yet (Expected for clean seed).')
  }

  process.exit(0)
}

verify().catch((err) => {
  console.error(err)
  process.exit(1)
})

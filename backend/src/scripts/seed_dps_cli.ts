import { PrismaClient } from '@prisma/client'
import { seedDemoData } from '../services/maintenanceService.js'
import dotenv from 'dotenv'

dotenv.config()

async function main() {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.error('DATABASE_URL not found in .env')
    process.exit(1)
  }

  console.log('Connecting to database...')
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: dbUrl
      }
    }
  })

  try {
    console.log('Seeding demo data for Delhi Public School...')
    await seedDemoData(prisma)
    console.log('Seeding completed successfully!')

    const studentCount = await prisma.student.count()
    const staffCount = await prisma.staffMember.count()
    console.log(`Verified: ${studentCount} students and ${staffCount} staff members.`)
  } catch (error) {
    console.error('Seeding failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()

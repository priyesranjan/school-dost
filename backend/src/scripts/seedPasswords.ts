import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../services/authTokenService.js'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  const users = [
    { email: 'admin@school.com', role: 'admin', name: 'Admin User' },
    { email: 'teacher@school.com', role: 'teacher', name: 'Teacher User' },
    { email: 'student@school.com', role: 'student', name: 'Student User' },
    { email: 'accountant@school.com', role: 'accountant', name: 'Accountant User' },
    { email: 'hod@school.com', role: 'hod', name: 'HOD User' },
    { email: 'reception@school.com', role: 'receptionist', name: 'Reception User' },
    { email: 'parent@school.com', role: 'parent', name: 'Parent User' },
    { email: 'priyesranjan@gmail.com', role: 'superadmin', name: 'Priyes Ranjan' }
  ]

  const passHash = await hashPassword('admin123')
  const rootHash = await hashPassword('root123')

  console.log('Seeding passwords...')

  for (const u of users) {
    const hash = u.email === 'priyesranjan@gmail.com' ? rootHash : passHash
    
    // Check if it's a SuperAdmin or regular User
    if (u.role === 'superadmin') {
       try {
         await (prisma as any).superAdmin.upsert({
           where: { email: u.email },
           update: { passwordHash: hash },
           create: { email: u.email, name: u.name, passwordHash: hash, isRoot: true }
         })
       } catch (e) {
         console.log(`Note: SuperAdmin ${u.email} update skipped or failed (might be in tenant DB).`)
       }
       continue; // Skip User table upsert for superadmin
    }

    await prisma.user.upsert({
      where: { email: u.email },
      update: { passwordHash: hash, role: u.role as any },
      create: { 
        email: u.email, 
        name: u.name, 
        role: u.role as any, 
        passwordHash: hash,
        status: 'active'
      }
    })
  }

  console.log('Successfully set passwords for demo users.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'
import { env } from '../config/env'
import { getPlatformPrisma } from '../db/platformPool'
import { directUpload, getDownloadStream } from './r2StorageService'

const execAsync = promisify(exec)

export async function createTenantBackup(tenantId: string, performer: string) {
  const platformDb = getPlatformPrisma()
  const tenant = await (platformDb as any).tenant.findUnique({ where: { id: tenantId } })
  if (!tenant) throw new Error('Tenant not found')

  const dbName = tenant.dbName
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const fileName = `backup-${tenant.slug}-${timestamp}.sql`
  const localPath = path.join(process.cwd(), 'temp', fileName)

  // Ensure temp dir exists
  if (!fs.existsSync(path.join(process.cwd(), 'temp'))) {
    fs.mkdirSync(path.join(process.cwd(), 'temp'))
  }

  try {
    // 1. Run pg_dump
    // PGPASSWORD=... pg_dump -h localhost -U user -d dbname > file.sql
    const dumpCmd = `set PGPASSWORD=${env.tenantDbPass} && pg_dump -h ${tenant.dbHost} -p ${tenant.dbPort} -U ${env.tenantDbUser} -d ${dbName} -F c -f "${localPath}"`

    await execAsync(dumpCmd)

    // 2. Upload to R2
    const fileBuffer = fs.readFileSync(localPath)
    const objectKey = `backups/${tenant.slug}/${fileName}`
    await directUpload(objectKey, fileBuffer, 'application/octet-stream')

    // 3. Record in platform DB
    const backupEntry = await (platformDb as any).backup.create({
      data: {
        tenantId: tenant.id,
        fileName: objectKey,
        fileSize: BigInt(fileBuffer.length),
        status: 'success',
      },
    })

    return backupEntry
  } catch (error) {
    const backupEntry = await (platformDb as any).backup.create({
      data: {
        tenantId: tenant.id,
        fileName: `failed-${fileName}`,
        fileSize: BigInt(0),
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    })
    throw error
  } finally {
    // Cleanup local file
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath)
    }
  }
}

export async function restoreTenantBackup(tenantId: string, backupId: number) {
  const platformDb = getPlatformPrisma()
  const tenant = await (platformDb as any).tenant.findUnique({ where: { id: tenantId } })
  const backup = await (platformDb as any).backup.findUnique({ where: { id: BigInt(backupId) } })

  if (!tenant || !backup) throw new Error('Tenant or Backup not found')

  const localPath = path.join(process.cwd(), 'temp', `restore-${Date.now()}.sql`)

  try {
    // 1. Download from R2
    const stream = await getDownloadStream(backup.fileName)
    if (!stream) throw new Error('Failed to get download stream from R2')

    // Write stream to local file
    const writeStream = fs.createWriteStream(localPath)
    // @ts-ignore - Body is a web stream or node stream
    if (stream.pipe) {
      // @ts-ignore
      stream.pipe(writeStream)
      await new Promise((resolve) => writeStream.on('finish', resolve))
    } else {
      // @ts-ignore
      const reader = stream.getReader()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        writeStream.write(value)
      }
      writeStream.end()
      await new Promise((resolve) => writeStream.on('finish', resolve))
    }

    // 2. Clear current DB (safety first, though pg_restore -c also works)
    // For a cleaner restore, we drop and recreate the DB
    const adminConn = `postgresql://${env.tenantDbUser}:${encodeURIComponent(env.tenantDbPass)}@${tenant.dbHost}:${tenant.dbPort}/postgres`
    const dropCmd = `set PGPASSWORD=${env.tenantDbPass} && psql -h ${tenant.dbHost} -p ${tenant.dbPort} -U ${env.tenantDbUser} -d postgres -c "DROP DATABASE IF EXISTS \\"${tenant.dbName}\\" WITH (FORCE);"`
    const createCmd = `set PGPASSWORD=${env.tenantDbPass} && psql -h ${tenant.dbHost} -p ${tenant.dbPort} -U ${env.tenantDbUser} -d postgres -c "CREATE DATABASE \\"${tenant.dbName}\\";"`

    await execAsync(dropCmd)
    await execAsync(createCmd)

    // 3. Run pg_restore
    const restoreCmd = `set PGPASSWORD=${env.tenantDbPass} && pg_restore -h ${tenant.dbHost} -p ${tenant.dbPort} -U ${env.tenantDbUser} -d ${tenant.dbName} "${localPath}"`
    await execAsync(restoreCmd)

    return { success: true }
  } finally {
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath)
    }
  }
}

export async function listTenantBackups(tenantId: string) {
  const platformDb = getPlatformPrisma()
  return (platformDb as any).backup.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
  })
}

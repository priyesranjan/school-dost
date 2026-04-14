import api from './api'
import { getR2Mode } from '@/utils/runtimeConfig'
import { executeWithRetry } from './retryService'
import { runWithCircuitBreaker } from './circuitBreakerService'

function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export const r2StorageService = {
  async uploadProfilePhoto(file: File, studentId: number): Promise<string> {
    const safeName = sanitizeFileName(file.name)
    return uploadFileWithSignedUrl(file, `students/${studentId}/profile-${Date.now()}-${safeName}`)
  },

  async uploadInstitutionImage(file: File, tenantId: string, tag = 'asset'): Promise<string> {
    const safeTenant = sanitizePathSegment(tenantId || 'default')
    const safeTag = sanitizePathSegment(tag)
    const safeName = sanitizeFileName(file.name)
    return uploadFileWithSignedUrl(file, `institutions/${safeTenant}/${safeTag}-${Date.now()}-${safeName}`)
  },
}

function sanitizePathSegment(input: string): string {
  return (
    input
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'file'
  )
}

function sanitizeFileName(fileName: string): string {
  const dot = fileName.lastIndexOf('.')
  const base = dot > 0 ? fileName.slice(0, dot) : fileName
  const ext = dot > 0 ? fileName.slice(dot + 1).toLowerCase() : 'jpg'
  const safeBase = sanitizePathSegment(base)
  const safeExt = ext.replace(/[^a-z0-9]+/g, '') || 'jpg'
  return `${safeBase}.${safeExt}`
}

async function uploadFileWithSignedUrl(file: File, objectKey: string): Promise<string> {
  const mode = getR2Mode()
  if (mode !== 'api') {
    return toDataUrl(file)
  }

  const contentType = file.type || 'application/octet-stream'
  try {
    const signRes = await runWithCircuitBreaker(
      'r2_sign',
      () =>
        executeWithRetry(
          () =>
            api.post(
              '/storage/r2/sign-upload',
              {
                object_key: objectKey,
                content_type: contentType,
              },
              {
                // Upload signing can fail in mixed local/API setups; do not cascade to app logout.
                skipAuthRefresh: true,
                skipLogoutOnAuthFailure: true,
              },
            ),
          { retries: 2, initialDelayMs: 350 },
        ),
      { threshold: 3, cooldownMs: 60000 },
    )

    const { upload_url: uploadUrl, public_url: publicUrl } = signRes.data.data

    await runWithCircuitBreaker(
      'r2_upload',
      () =>
        executeWithRetry(
          async () => {
            const response = await fetch(uploadUrl, {
              method: 'PUT',
              headers: { 'Content-Type': contentType },
              body: file,
            })
            if (!response.ok) {
              throw new Error(`R2 upload failed (${response.status})`)
            }
          },
          { retries: 2, initialDelayMs: 500 },
        ),
      { threshold: 3, cooldownMs: 60000 },
    )

    return String(publicUrl)
  } catch (error) {
    const status = (error as { response?: { status?: number } })?.response?.status
    if (status === 404 || status === 401) {
      // If backend sign endpoint is unavailable or auth token is not accepted,
      // keep uploads working in local/demo mode.
      return toDataUrl(file)
    }
    throw error
  }
}

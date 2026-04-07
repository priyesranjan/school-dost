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
    const mode = getR2Mode()

    if (mode === 'api') {
      const signRes = await runWithCircuitBreaker(
        'r2_sign',
        () =>
          executeWithRetry(
            () =>
              api.post('/storage/r2/sign-upload', {
                object_key: `students/${studentId}/profile-${Date.now()}-${file.name}`,
                content_type: file.type,
              }),
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
                headers: { 'Content-Type': file.type },
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

      return publicUrl as string
    }

    return toDataUrl(file)
  },
}

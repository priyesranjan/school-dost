import { Router } from 'express'
import { requireAuth , requireRole } from '../middleware/auth'
import { signedUploadLimiter } from '../middleware/rateLimit'
import { validateBody } from '../middleware/validation'
import { r2SignUploadSchema } from '../validation/schemas'
import { signUploadUrl } from '../services/r2StorageService'

const router = Router()

router.post('/r2/sign-upload', requireAuth, requireRole(['superadmin', 'admin', 'hod', 'teacher']), signedUploadLimiter, validateBody(r2SignUploadSchema), async (req, res) => {
  const body = req.body as { object_key: string; content_type: string }
  try {
    const data = await signUploadUrl(body.object_key.trim(), body.content_type.trim())
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to sign upload URL'
    res.status(500).json({ error: { code: 'R2_SIGN_UPLOAD_FAILED', message } })
  }
})

export default router

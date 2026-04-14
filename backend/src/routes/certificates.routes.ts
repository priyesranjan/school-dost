import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { writeActionLimiter } from '../middleware/rateLimit'
import { validateBody } from '../middleware/validation'
import { certificateIssueSchema } from '../validation/schemas'
import { issueCertificate, verifyCertificateByNumber } from '../services/certificateService'
import { appendAuditLog } from '../services/auditLogService'

const router = Router()

router.get('/verify', async (req, res) => {
  const certNo = String(req.query.no || '').trim()
  if (!certNo) {
    res
      .status(400)
      .json({ error: { code: 'INVALID_REQUEST', message: 'Certificate number query param `no` is required' } })
    return
  }
  try {
    const data = await verifyCertificateByNumber(req.tenantDb!, certNo)
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to verify certificate'
    res.status(500).json({ error: { code: 'CERT_VERIFY_FAILED', message } })
  }
})

router.post(
  '/issue',
  requireAuth,
  requireRole(['admin']),
  writeActionLimiter,
  validateBody(certificateIssueSchema),
  async (req, res) => {
    const body = req.body as {
      certificate_no: string
      student_id: number
      type: 'tc' | 'character'
      issue_date: string
      issued_by?: string
      reason?: string | null
      conduct?: string | null
    }
    try {
      const data = await issueCertificate(req.tenantDb!, {
        certificate_no: body.certificate_no.trim(),
        student_id: body.student_id,
        type: body.type,
        issue_date: body.issue_date.trim(),
        issued_by: String(body.issued_by || req.auth?.name || '').trim(),
        reason: body.reason ? body.reason.trim() : null,
        conduct: body.conduct ? body.conduct.trim() : null,
      })
      await appendAuditLog(req.tenantDb!, {
        action: 'certificate_issued',
        module: 'certificates',
        actor_name: req.auth?.name || 'Unknown',
        actor_role: req.auth?.role || 'unknown',
        target: data.certificate_no,
        metadata: `type=${data.type} student_id=${data.student_id}`,
      })
      res.json({ data })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to issue certificate'
      res.status(500).json({ error: { code: 'CERT_ISSUE_FAILED', message } })
    }
  },
)

export default router

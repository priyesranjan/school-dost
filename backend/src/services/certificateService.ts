import { prisma } from '../db/prisma'

export async function issueCertificate(input: {
  certificate_no: string
  student_id: number
  type: 'tc' | 'character'
  issue_date: string
  issued_by: string
  reason?: string | null
  conduct?: string | null
}) {
  const cert = await prisma.certificate.create({
    data: {
      certificateNo: input.certificate_no,
      studentId: BigInt(input.student_id),
      type: input.type,
      issueDate: new Date(input.issue_date),
      issuedBy: input.issued_by,
      reason: input.reason || null,
      conduct: input.conduct || null,
      status: 'issued',
    },
  })

  return {
    id: Number(cert.id),
    certificate_no: cert.certificateNo,
    student_id: Number(cert.studentId),
    type: cert.type,
    issue_date: cert.issueDate.toISOString().slice(0, 10),
    issued_by: cert.issuedBy,
    status: cert.status,
  }
}

export async function verifyCertificateByNumber(certificateNo: string) {
  const cert = await prisma.certificate.findUnique({
    where: { certificateNo },
    include: {
      student: {
        select: {
          name: true,
          className: true,
        },
      },
    },
  })

  if (!cert) {
    return {
      valid: false,
      certificate_no: certificateNo,
    }
  }

  return {
    valid: cert.status === 'issued',
    certificate_no: cert.certificateNo,
    student_name: cert.student.name,
    class_name: cert.student.className,
    type: cert.type,
    issue_date: cert.issueDate.toISOString().slice(0, 10),
    issued_by: cert.issuedBy,
  }
}

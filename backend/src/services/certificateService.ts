import type { PrismaClient } from '@prisma/client'

export async function issueCertificate(
  db: PrismaClient,
  input: {
    certificate_no: string
    student_id: number
    type: 'tc' | 'character'
    issue_date: string
    issued_by: string
    reason?: string | null
    conduct?: string | null
  },
) {
  const cert = await db.certificate.create({
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
    include: {
      student: {
        select: {
          name: true,
          className: true,
        },
      },
    },
  })

  return mapCertificateToFrontend(cert)
}

function mapCertificateToFrontend(cert: any) {
  return {
    id: Number(cert.id),
    certificate_no: cert.certificateNo,
    student_id: Number(cert.studentId),
    student_name: cert.student?.name || '',
    class_name: cert.student?.className || '',
    type: cert.type,
    issue_date: cert.issueDate.toISOString().slice(0, 10),
    reason: cert.reason || undefined,
    conduct: cert.conduct || undefined,
    issued_by: cert.issuedBy,
    status: cert.status,
  }
}

export async function listCertificates(
  db: PrismaClient,
  input: {
    page: number
    per_page: number
    student_id?: number
    type?: 'tc' | 'character'
  },
) {
  const where: any = {
    ...(input.student_id ? { studentId: BigInt(input.student_id) } : {}),
    ...(input.type ? { type: input.type } : {}),
  }

  const [rows, total] = await Promise.all([
    db.certificate.findMany({
      where,
      include: {
        student: {
          select: {
            name: true,
            className: true,
          },
        },
      },
      orderBy: [{ issueDate: 'desc' }, { createdAt: 'desc' }],
      skip: (input.page - 1) * input.per_page,
      take: input.per_page,
    }),
    db.certificate.count({ where }),
  ])

  return {
    items: rows.map(mapCertificateToFrontend),
    total,
    page: input.page,
    per_page: input.per_page,
  }
}

export async function verifyCertificateByNumber(db: PrismaClient, certificateNo: string) {
  const cert = await db.certificate.findUnique({
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

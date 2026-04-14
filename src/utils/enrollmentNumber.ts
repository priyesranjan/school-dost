/**
 * Enrollment Number Generator
 *
 * Format: YY(2) + CLASS_CODE(3) + INST_CODE(3) + SEQ(4) = 12 digits
 *
 * Example: Student in Class 6 admitted April 2026 at institution "001", seq 1
 *   26  006  001  0001  →  260060010001
 *   ↑    ↑    ↑    ↑
 *   YY  CCC  III  NNNN
 *
 * Inspired by Bihar Engineering University format: 23155134001
 *   23 = admission year · 155 = branch · 134 = college · 001 = seq
 */

/** Extract 2-digit year from an admission date string (YYYY-MM-DD) */
export function getAdmissionYY(admissionDate: string): string {
  try {
    const year = new Date(admissionDate).getFullYear()
    if (isNaN(year)) throw new Error()
    return String(year).slice(-2)
  } catch {
    return String(new Date().getFullYear()).slice(-2)
  }
}

/** Extract 3-digit class code from a class name.
 *  "Class 6" → "006", "Class 10" → "010", "Class 12" → "012"
 *  Custom names without a number → "000"
 */
export function getClassCode(className: string): string {
  const match = className.match(/\d+/)
  if (match) {
    return String(parseInt(match[0], 10)).padStart(3, '0')
  }
  return '000'
}

/** Zero-pad and truncate institution code to exactly 3 digits */
export function normalizeInstitutionCode(code: string): string {
  const digits = code.replace(/\D/g, '').slice(-3)
  return digits.padStart(3, '0')
}

/**
 * Generate a structured enrollment number.
 * @param admissionDate  ISO date string "YYYY-MM-DD"
 * @param className      Class name e.g. "Class 6", "Class 10"
 * @param institutionCode 1-3 digit institution code (e.g. "001")
 * @param sequence       Auto-incrementing number for this batch
 * @returns 12-char string e.g. "260060010001"
 */
export function generateEnrollmentNo(
  admissionDate: string,
  className: string,
  institutionCode: string,
  sequence: number,
): string {
  const yy = getAdmissionYY(admissionDate)
  const ccc = getClassCode(className)
  const iii = normalizeInstitutionCode(institutionCode)
  const nnnn = String(Math.max(1, sequence)).padStart(4, '0')
  return `${yy}${ccc}${iii}${nnnn}`
}

/**
 * Format a raw 12-char enrollment number for human-readable display.
 * "260060010001" → "26-006-001-0001"
 */
export function formatEnrollmentNo(raw: string): string {
  if (raw.length === 12) {
    return `${raw.slice(0, 2)}-${raw.slice(2, 5)}-${raw.slice(5, 8)}-${raw.slice(8)}`
  }
  return raw
}

/**
 * Break down an enrollment number into its meaning.
 */
export function parseEnrollmentNo(raw: string): {
  year: string
  classCode: string
  institutionCode: string
  sequence: string
} | null {
  if (raw.length !== 12) return null
  return {
    year: `20${raw.slice(0, 2)}`,
    classCode: raw.slice(2, 5),
    institutionCode: raw.slice(5, 8),
    sequence: raw.slice(8),
  }
}

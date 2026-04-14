import { Prisma, type PrismaClient } from '@prisma/client'

/**
 * Standard mapper to convert Prisma Student model to Frontend Student Type
 */
function mapStudentToFrontend(row: any) {
  return {
    id: Number(row.id),
    name: row.name,
    first_name: row.firstName,
    middle_name: row.middleName,
    last_name: row.lastName,
    roll_number: row.rollNumber,
    class_name: row.className,
    section: row.section,
    status: row.status,
    date_of_birth: row.dateOfBirth ? row.dateOfBirth.toISOString().slice(0, 10) : null,
    gender: row.gender,
    blood_group: row.bloodGroup,
    nationality: row.nationality,
    religion: row.religion,
    category: row.category,
    caste: row.caste,
    mother_tongue: row.motherTongue,
    aadhar_number: row.aadharNumber,
    enrollment_no: row.enrollmentNo,
    fee_no: row.feeNo,
    stream: row.stream,
    fee_group: row.feeGroup,
    academic_year: row.academicYear,
    admission_date: row.admissionDate ? row.admissionDate.toISOString().slice(0, 10) : null,
    date_of_joining: row.dateOfJoining ? row.dateOfJoining.toISOString().slice(0, 10) : null,
    email: row.email,
    phone: row.phone,
    parent_name: row.parentName,
    father_name: row.fatherName,
    father_occupation: row.fatherOccupation,
    father_qualification: row.fatherQualification,
    father_phone: row.fatherPhone,
    father_email: row.fatherEmail,
    father_aadhar: row.fatherAadhar,
    father_annual_income: row.fatherAnnualIncome,
    mother_name: row.motherName,
    mother_occupation: row.motherOccupation,
    mother_qualification: row.motherQualification,
    mother_phone: row.motherPhone,
    mother_email: row.motherEmail,
    mother_aadhar: row.motherAadhar,
    guardian_name: row.guardianName,
    guardian_relation: row.guardianRelation,
    guardian_phone: row.guardianPhone,
    guardian_occupation: row.guardianOccupation,
    guardian_address: row.guardianAddress,
    guardian_contacts: row.guardianContacts,
    address: row.address,
    current_address: row.currentAddress,
    current_city: row.currentCity,
    current_state: row.currentState,
    current_pincode: row.currentPincode,
    current_country: row.currentCountry,
    permanent_address: row.permanentAddress,
    permanent_city: row.permanentCity,
    permanent_state: row.permanentState,
    permanent_pincode: row.permanentPincode,
    permanent_country: row.permanentCountry,
    same_as_current: row.sameAsCurrent,
    previous_school: row.previousSchool,
    previous_class: row.previousClass,
    tc_number: row.tcNumber,
    transport_mode: row.transportMode,
    bus_route: row.busRoute,
    hostel_name: row.hostelName,
    medical_conditions: row.medicalConditions,
    allergies: row.allergies,
    emergency_contact_name: row.emergencyContactName,
    emergency_contact_phone: row.emergencyContactPhone,
    emergency_relation: row.emergencyRelation,
    bank_name: row.bankName,
    bank_account_no: row.bankAccountNo,
    ifsc_code: row.ifscCode,
    scholarship_name: row.scholarshipName,
    scholarship_amount: row.scholarshipAmount ? Number(row.scholarshipAmount) : 0,
    additional_details: row.additionalDetails,
    notes: row.notes,
    profile_photo_url: row.profilePhotoUrl,
    signature_url: row.signatureUrl,
    parent_user_id: row.parentUserId ? Number(row.parentUserId) : null,
  }
}

export async function createStudent(db: PrismaClient, input: any) {
  try {
    const data: any = {
      name: input.name,
      firstName: input.first_name,
      middleName: input.middle_name,
      lastName: input.last_name,
      rollNumber: input.roll_number,
      className: input.class_name,
      section: input.section,
      status: input.status || 'active',
      parentName: input.parent_name || input.father_name || '',
      admissionDate: new Date(input.admission_date || Date.now()),
    }

    // Optional fields mapping
    if (input.date_of_birth) data.dateOfBirth = new Date(input.date_of_birth)
    if (input.gender) data.gender = input.gender
    if (input.blood_group) data.bloodGroup = input.blood_group
    if (input.phone) data.phone = input.phone
    if (input.email) data.email = input.email
    if (input.enrollment_no) data.enrollmentNo = input.enrollment_no
    if (input.address) data.address = input.address

    // Parent/Father
    if (input.father_name) data.fatherName = input.father_name
    if (input.mother_name) data.motherName = input.mother_name

    // Complex objects
    if (input.guardian_contacts) data.guardianContacts = input.guardian_contacts
    if (input.additional_details) data.additionalDetails = input.additional_details

    const row = await db.student.create({ data })
    return { ok: true as const, data: mapStudentToFrontend(row) }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return {
        ok: false as const,
        code: 'STUDENT_ALREADY_EXISTS',
        message: 'Student with same roll/class/section or enrollment already exists',
      }
    }
    throw error
  }
}

export async function updateStudent(db: PrismaClient, id: number, input: any) {
  const data: any = {}

  // Mapping frontend keys to Prisma keys
  const fieldMap: Record<string, string> = {
    name: 'name',
    first_name: 'firstName',
    middle_name: 'middleName',
    last_name: 'lastName',
    roll_number: 'rollNumber',
    class_name: 'className',
    section: 'section',
    status: 'status',
    gender: 'gender',
    blood_group: 'bloodGroup',
    nationality: 'nationality',
    religion: 'religion',
    category: 'category',
    caste: 'caste',
    mother_tongue: 'motherTongue',
    aadhar_number: 'aadharNumber',
    enrollment_no: 'enrollmentNo',
    fee_no: 'feeNo',
    stream: 'stream',
    fee_group: 'feeGroup',
    academic_year: 'academicYear',
    email: 'email',
    phone: 'phone',
    parent_name: 'parentName',
    father_name: 'fatherName',
    father_occupation: 'fatherOccupation',
    father_qualification: 'fatherQualification',
    father_phone: 'fatherPhone',
    father_email: 'fatherEmail',
    father_aadhar: 'fatherAadhar',
    father_annual_income: 'fatherAnnualIncome',
    mother_name: 'motherName',
    mother_occupation: 'motherOccupation',
    mother_qualification: 'motherQualification',
    mother_phone: 'motherPhone',
    mother_email: 'motherEmail',
    mother_aadhar: 'motherAadhar',
    guardian_name: 'guardianName',
    guardian_relation: 'guardianRelation',
    guardian_phone: 'guardianPhone',
    guardian_occupation: 'guardianOccupation',
    guardian_address: 'guardianAddress',
    address: 'address',
    current_address: 'currentAddress',
    current_city: 'currentCity',
    current_state: 'currentState',
    current_pincode: 'currentPincode',
    current_country: 'currentCountry',
    permanent_address: 'permanentAddress',
    permanent_city: 'permanentCity',
    permanent_state: 'permanentState',
    permanent_pincode: 'permanentPincode',
    permanent_country: 'permanentCountry',
    same_as_current: 'sameAsCurrent',
    previous_school: 'previousSchool',
    previous_class: 'previousClass',
    tc_number: 'tcNumber',
    transport_mode: 'transportMode',
    bus_route: 'busRoute',
    hostel_name: 'hostelName',
    medical_conditions: 'medicalConditions',
    allergies: 'allergies',
    emergency_contact_name: 'emergencyContactName',
    emergency_contact_phone: 'emergencyContactPhone',
    emergency_relation: 'emergencyRelation',
    bank_name: 'bankName',
    bank_account_no: 'bankAccountNo',
    ifsc_code: 'ifscCode',
    scholarship_name: 'scholarshipName',
    notes: 'notes',
    profile_photo_url: 'profilePhotoUrl',
    signature_url: 'signatureUrl',
  }

  for (const [key, val] of Object.entries(input)) {
    if (fieldMap[key]) {
      data[fieldMap[key]] = val
    }
  }

  // Date handling
  if (input.date_of_birth) data.dateOfBirth = new Date(input.date_of_birth)
  if (input.admission_date) data.admissionDate = new Date(input.admission_date)
  if (input.date_of_joining) data.dateOfJoining = new Date(input.date_of_joining)

  // Decimal handling
  if (input.scholarship_amount !== undefined) data.scholarshipAmount = new Prisma.Decimal(input.scholarship_amount)

  // JSON handling
  if (input.guardian_contacts) data.guardianContacts = input.guardian_contacts
  if (input.additional_details) data.additionalDetails = input.additional_details

  const row = await db.student.update({
    where: { id },
    data,
  })
  return mapStudentToFrontend(row)
}

export async function getStudent(db: PrismaClient, id: number) {
  const row = await db.student.findUnique({
    where: { id },
  })
  return row ? mapStudentToFrontend(row) : null
}

export async function deleteStudent(db: PrismaClient, id: number) {
  await db.student.delete({ where: { id } })
}

export async function listStudents(
  db: PrismaClient,
  input: {
    page: number
    per_page: number
    search?: string
    class_name?: string
    status?: string
  },
) {
  const where: any = {
    ...(input.class_name ? { className: input.class_name } : {}),
    ...(input.status ? { status: input.status as any } : {}),
    ...(input.search
      ? {
          OR: [
            { name: { contains: input.search, mode: 'insensitive' as const } },
            { rollNumber: { contains: input.search, mode: 'insensitive' as const } },
            { parentName: { contains: input.search, mode: 'insensitive' as const } },
            { phone: { contains: input.search, mode: 'insensitive' as const } },
            { enrollmentNo: { contains: input.search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  }

  const [rows, total] = await Promise.all([
    db.student.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }],
      skip: (input.page - 1) * input.per_page,
      take: input.per_page,
    }),
    db.student.count({ where }),
  ])

  return {
    items: rows.map(mapStudentToFrontend),
    total,
    page: input.page,
    per_page: input.per_page,
  }
}

CREATE TYPE "PayrollStatus" AS ENUM ('pending', 'paid');

CREATE TABLE "PayrollProfile" (
    "id" BIGSERIAL NOT NULL,
    "staffMemberId" BIGINT NOT NULL,
    "baseSalary" DECIMAL(12,2) NOT NULL,
    "allowances" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "deductions" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "paymentMethod" TEXT,
    "bankName" TEXT,
    "bankAccountNo" TEXT,
    "ifscCode" TEXT,
    "panNumber" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PayrollProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PayrollRecord" (
    "id" BIGSERIAL NOT NULL,
    "staffMemberId" BIGINT NOT NULL,
    "payrollProfileId" BIGINT,
    "month" TIMESTAMP(3) NOT NULL,
    "baseSalary" DECIMAL(12,2) NOT NULL,
    "allowances" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "deductions" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "grossPay" DECIMAL(12,2) NOT NULL,
    "netPay" DECIMAL(12,2) NOT NULL,
    "status" "PayrollStatus" NOT NULL DEFAULT 'pending',
    "paymentReference" TEXT,
    "paidAt" TIMESTAMP(3),
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "PayrollRecord_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PayrollProfile_staffMemberId_key" ON "PayrollProfile"("staffMemberId");
CREATE INDEX "PayrollProfile_staffMemberId_idx" ON "PayrollProfile"("staffMemberId");

CREATE UNIQUE INDEX "PayrollRecord_staffMemberId_month_key" ON "PayrollRecord"("staffMemberId", "month");
CREATE INDEX "PayrollRecord_month_idx" ON "PayrollRecord"("month");
CREATE INDEX "PayrollRecord_status_idx" ON "PayrollRecord"("status");
CREATE INDEX "PayrollRecord_staffMemberId_status_idx" ON "PayrollRecord"("staffMemberId", "status");

ALTER TABLE "PayrollProfile"
ADD CONSTRAINT "PayrollProfile_staffMemberId_fkey"
FOREIGN KEY ("staffMemberId") REFERENCES "StaffMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PayrollRecord"
ADD CONSTRAINT "PayrollRecord_staffMemberId_fkey"
FOREIGN KEY ("staffMemberId") REFERENCES "StaffMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PayrollRecord"
ADD CONSTRAINT "PayrollRecord_payrollProfileId_fkey"
FOREIGN KEY ("payrollProfileId") REFERENCES "PayrollProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

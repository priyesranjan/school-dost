-- CreateEnum
CREATE TYPE "public"."LeaveRequestStatus" AS ENUM ('pending', 'approved', 'rejected', 'cancelled', 'completed');

-- CreateEnum
CREATE TYPE "public"."AppraisalStatus" AS ENUM ('draft', 'published');

-- CreateTable
CREATE TABLE "public"."LeaveRequest" (
    "id" BIGSERIAL NOT NULL,
    "staffMemberId" BIGINT NOT NULL,
    "requestedByUserId" BIGINT,
    "approvedByUserId" BIGINT,
    "leaveType" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "decisionNote" TEXT,
    "status" "public"."LeaveRequestStatus" NOT NULL DEFAULT 'pending',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaveRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StaffAppraisal" (
    "id" BIGSERIAL NOT NULL,
    "staffMemberId" BIGINT NOT NULL,
    "reviewerUserId" BIGINT,
    "reviewPeriod" TEXT NOT NULL,
    "reviewDate" TIMESTAMP(3) NOT NULL,
    "overallRating" DECIMAL(3,2) NOT NULL,
    "strengths" TEXT,
    "improvementAreas" TEXT,
    "goals" TEXT,
    "status" "public"."AppraisalStatus" NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffAppraisal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LeaveRequest_staffMemberId_idx" ON "public"."LeaveRequest"("staffMemberId");

-- CreateIndex
CREATE INDEX "LeaveRequest_status_idx" ON "public"."LeaveRequest"("status");

-- CreateIndex
CREATE INDEX "LeaveRequest_startDate_endDate_idx" ON "public"."LeaveRequest"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "LeaveRequest_requestedByUserId_idx" ON "public"."LeaveRequest"("requestedByUserId");

-- CreateIndex
CREATE INDEX "LeaveRequest_approvedByUserId_idx" ON "public"."LeaveRequest"("approvedByUserId");

-- CreateIndex
CREATE INDEX "StaffAppraisal_staffMemberId_idx" ON "public"."StaffAppraisal"("staffMemberId");

-- CreateIndex
CREATE INDEX "StaffAppraisal_status_idx" ON "public"."StaffAppraisal"("status");

-- CreateIndex
CREATE INDEX "StaffAppraisal_reviewDate_idx" ON "public"."StaffAppraisal"("reviewDate");

-- CreateIndex
CREATE INDEX "StaffAppraisal_reviewerUserId_idx" ON "public"."StaffAppraisal"("reviewerUserId");

-- AddForeignKey
ALTER TABLE "public"."LeaveRequest" ADD CONSTRAINT "LeaveRequest_staffMemberId_fkey"
FOREIGN KEY ("staffMemberId") REFERENCES "public"."StaffMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeaveRequest" ADD CONSTRAINT "LeaveRequest_requestedByUserId_fkey"
FOREIGN KEY ("requestedByUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeaveRequest" ADD CONSTRAINT "LeaveRequest_approvedByUserId_fkey"
FOREIGN KEY ("approvedByUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StaffAppraisal" ADD CONSTRAINT "StaffAppraisal_staffMemberId_fkey"
FOREIGN KEY ("staffMemberId") REFERENCES "public"."StaffMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StaffAppraisal" ADD CONSTRAINT "StaffAppraisal_reviewerUserId_fkey"
FOREIGN KEY ("reviewerUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "public"."AssignmentWorkflowStatus" AS ENUM ('active', 'completed', 'archived');

-- CreateEnum
CREATE TYPE "public"."AssignmentSubmissionStatus" AS ENUM ('submitted', 'reviewed', 'returned');

-- CreateTable
CREATE TABLE "public"."Assignment" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "subject" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "public"."AssignmentWorkflowStatus" NOT NULL DEFAULT 'active',
    "teacherName" TEXT,
    "createdByUserId" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AssignmentSubmission" (
    "id" BIGSERIAL NOT NULL,
    "assignmentId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,
    "userName" TEXT NOT NULL,
    "userRole" TEXT NOT NULL,
    "status" "public"."AssignmentSubmissionStatus" NOT NULL DEFAULT 'submitted',
    "submissionText" TEXT,
    "attachmentUrl" TEXT,
    "feedback" TEXT,
    "score" DECIMAL(5,2),
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssignmentSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Assignment_className_idx" ON "public"."Assignment"("className");

-- CreateIndex
CREATE INDEX "Assignment_subject_idx" ON "public"."Assignment"("subject");

-- CreateIndex
CREATE INDEX "Assignment_status_idx" ON "public"."Assignment"("status");

-- CreateIndex
CREATE INDEX "Assignment_dueDate_idx" ON "public"."Assignment"("dueDate");

-- CreateIndex
CREATE INDEX "Assignment_createdByUserId_idx" ON "public"."Assignment"("createdByUserId");

-- CreateIndex
CREATE INDEX "AssignmentSubmission_assignmentId_idx" ON "public"."AssignmentSubmission"("assignmentId");

-- CreateIndex
CREATE INDEX "AssignmentSubmission_userId_idx" ON "public"."AssignmentSubmission"("userId");

-- CreateIndex
CREATE INDEX "AssignmentSubmission_status_idx" ON "public"."AssignmentSubmission"("status");

-- CreateIndex
CREATE INDEX "AssignmentSubmission_submittedAt_idx" ON "public"."AssignmentSubmission"("submittedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentSubmission_assignmentId_userId_key" ON "public"."AssignmentSubmission"("assignmentId", "userId");

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_createdByUserId_fkey"
FOREIGN KEY ("createdByUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_assignmentId_fkey"
FOREIGN KEY ("assignmentId") REFERENCES "public"."Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

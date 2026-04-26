-- CreateEnum
CREATE TYPE "ClassroomResourceType" AS ENUM ('document', 'worksheet', 'video', 'link');

-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN "resourceUrl" TEXT;

-- CreateTable
CREATE TABLE "ClassroomResource" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "className" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "resourceType" "ClassroomResourceType" NOT NULL,
    "url" TEXT NOT NULL,
    "assignmentId" BIGINT,
    "publishedByName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassroomResource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClassroomResource_className_idx" ON "ClassroomResource"("className");

-- CreateIndex
CREATE INDEX "ClassroomResource_subject_idx" ON "ClassroomResource"("subject");

-- CreateIndex
CREATE INDEX "ClassroomResource_resourceType_idx" ON "ClassroomResource"("resourceType");

-- CreateIndex
CREATE INDEX "ClassroomResource_assignmentId_idx" ON "ClassroomResource"("assignmentId");

-- AddForeignKey
ALTER TABLE "ClassroomResource" ADD CONSTRAINT "ClassroomResource_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

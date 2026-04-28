CREATE TABLE "StaffTask" (
  "id" BIGSERIAL PRIMARY KEY,
  "staffId" BIGINT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "priority" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "dueDate" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StaffTask_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "StaffMember"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "StaffTask_staffId_idx" ON "StaffTask"("staffId");
CREATE INDEX "StaffTask_status_idx" ON "StaffTask"("status");
CREATE INDEX "StaffTask_priority_idx" ON "StaffTask"("priority");
CREATE INDEX "StaffTask_dueDate_idx" ON "StaffTask"("dueDate");

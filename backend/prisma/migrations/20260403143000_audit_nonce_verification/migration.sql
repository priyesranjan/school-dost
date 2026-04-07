ALTER TABLE "AuditLog" ADD COLUMN "auditNonce" BIGINT;

CREATE INDEX IF NOT EXISTS "AuditLog_auditNonce_idx" ON "AuditLog"("auditNonce");

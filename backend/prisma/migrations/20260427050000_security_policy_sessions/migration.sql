-- CreateTable
CREATE TABLE "SecurityPolicy" (
    "id" BIGSERIAL NOT NULL,
    "passwordMinLength" INTEGER NOT NULL DEFAULT 8,
    "requireUppercase" BOOLEAN NOT NULL DEFAULT false,
    "requireLowercase" BOOLEAN NOT NULL DEFAULT true,
    "requireNumber" BOOLEAN NOT NULL DEFAULT false,
    "requireSpecialChar" BOOLEAN NOT NULL DEFAULT false,
    "sessionTimeoutHours" INTEGER NOT NULL DEFAULT 168,
    "allowConcurrentSessions" BOOLEAN NOT NULL DEFAULT true,
    "enforceIpAllowlist" BOOLEAN NOT NULL DEFAULT false,
    "ipAllowlist" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "twoFactorRequiredAdmins" BOOLEAN NOT NULL DEFAULT false,
    "updatedByName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SecurityPolicy_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "RefreshToken"
ADD COLUMN "sessionId" TEXT,
ADD COLUMN "userAgent" TEXT,
ADD COLUMN "ipAddress" TEXT,
ADD COLUMN "lastSeenAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "RefreshToken_sessionId_idx" ON "RefreshToken"("sessionId");

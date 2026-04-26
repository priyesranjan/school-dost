-- CreateEnum
CREATE TYPE "SmsLogType" AS ENUM ('payment', 'due_reminder', 'attendance', 'general', 'notice', 'schedule', 'campaign', 'otp');

-- CreateEnum
CREATE TYPE "SmsDeliveryStatus" AS ENUM ('pending', 'sent', 'failed');

-- CreateEnum
CREATE TYPE "DeliveryChannel" AS ENUM ('sms', 'whatsapp');

-- CreateTable
CREATE TABLE "SmsLog" (
    "id" BIGSERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "studentName" TEXT,
    "message" TEXT NOT NULL,
    "type" "SmsLogType" NOT NULL DEFAULT 'general',
    "status" "SmsDeliveryStatus" NOT NULL DEFAULT 'pending',
    "channel" "DeliveryChannel" NOT NULL DEFAULT 'sms',
    "templateId" TEXT,
    "providerMessageId" TEXT,
    "providerResponse" JSONB,
    "error" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmsLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SmsLog_phone_idx" ON "SmsLog"("phone");

-- CreateIndex
CREATE INDEX "SmsLog_type_idx" ON "SmsLog"("type");

-- CreateIndex
CREATE INDEX "SmsLog_status_idx" ON "SmsLog"("status");

-- CreateIndex
CREATE INDEX "SmsLog_channel_idx" ON "SmsLog"("channel");

-- CreateIndex
CREATE INDEX "SmsLog_sentAt_idx" ON "SmsLog"("sentAt");

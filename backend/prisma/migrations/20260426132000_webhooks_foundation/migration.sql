CREATE TYPE "WebhookDeliveryStatus" AS ENUM ('pending', 'success', 'failed');

CREATE TABLE "WebhookSubscription" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "events" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "headers" JSONB,
    "timeoutMs" INTEGER NOT NULL DEFAULT 5000,
    "failureCount" INTEGER NOT NULL DEFAULT 0,
    "lastSuccessAt" TIMESTAMP(3),
    "lastFailureAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebhookSubscription_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WebhookDelivery" (
    "id" BIGSERIAL NOT NULL,
    "subscriptionId" BIGINT NOT NULL,
    "eventType" TEXT NOT NULL,
    "attempt" INTEGER NOT NULL DEFAULT 1,
    "status" "WebhookDeliveryStatus" NOT NULL DEFAULT 'pending',
    "requestHeaders" JSONB,
    "requestBody" JSONB NOT NULL,
    "responseStatus" INTEGER,
    "responseBody" TEXT,
    "error" TEXT,
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebhookDelivery_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "WebhookSubscription_active_idx" ON "WebhookSubscription"("active");
CREATE INDEX "WebhookSubscription_lastSuccessAt_idx" ON "WebhookSubscription"("lastSuccessAt");
CREATE INDEX "WebhookSubscription_lastFailureAt_idx" ON "WebhookSubscription"("lastFailureAt");

CREATE INDEX "WebhookDelivery_subscriptionId_createdAt_idx" ON "WebhookDelivery"("subscriptionId", "createdAt");
CREATE INDEX "WebhookDelivery_eventType_createdAt_idx" ON "WebhookDelivery"("eventType", "createdAt");
CREATE INDEX "WebhookDelivery_status_idx" ON "WebhookDelivery"("status");

ALTER TABLE "WebhookDelivery"
ADD CONSTRAINT "WebhookDelivery_subscriptionId_fkey"
FOREIGN KEY ("subscriptionId") REFERENCES "WebhookSubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

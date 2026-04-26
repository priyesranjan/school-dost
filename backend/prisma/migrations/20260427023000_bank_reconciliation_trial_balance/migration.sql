-- CreateEnum
CREATE TYPE "public"."BankEntryDirection" AS ENUM ('inflow', 'outflow');

-- CreateTable
CREATE TABLE "public"."BankAccount" (
    "id" BIGSERIAL NOT NULL,
    "accountName" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "ifscCode" TEXT,
    "openingBalance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "lastReconciledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BankReconciliationEntry" (
    "id" BIGSERIAL NOT NULL,
    "bankAccountId" BIGINT NOT NULL,
    "ledgerEntryId" BIGINT,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "referenceNo" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "direction" "public"."BankEntryDirection" NOT NULL,
    "matched" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankReconciliationEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BankAccount_bankName_idx" ON "public"."BankAccount"("bankName");

-- CreateIndex
CREATE INDEX "BankAccount_accountName_idx" ON "public"."BankAccount"("accountName");

-- CreateIndex
CREATE INDEX "BankReconciliationEntry_bankAccountId_idx" ON "public"."BankReconciliationEntry"("bankAccountId");

-- CreateIndex
CREATE INDEX "BankReconciliationEntry_ledgerEntryId_idx" ON "public"."BankReconciliationEntry"("ledgerEntryId");

-- CreateIndex
CREATE INDEX "BankReconciliationEntry_matched_idx" ON "public"."BankReconciliationEntry"("matched");

-- CreateIndex
CREATE INDEX "BankReconciliationEntry_transactionDate_idx" ON "public"."BankReconciliationEntry"("transactionDate");

-- AddForeignKey
ALTER TABLE "public"."BankReconciliationEntry" ADD CONSTRAINT "BankReconciliationEntry_bankAccountId_fkey"
FOREIGN KEY ("bankAccountId") REFERENCES "public"."BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BankReconciliationEntry" ADD CONSTRAINT "BankReconciliationEntry_ledgerEntryId_fkey"
FOREIGN KEY ("ledgerEntryId") REFERENCES "public"."LedgerEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

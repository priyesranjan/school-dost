UPDATE "Tenant"
SET "dbName" = 'tenant_' || regexp_replace("slug", '[^a-z0-9]+', '_', 'g')
WHERE "dbName" IS NULL
   OR "dbName" = current_database()
   OR "dbName" NOT LIKE 'tenant_%';

CREATE UNIQUE INDEX IF NOT EXISTS "Tenant_dbName_key" ON "Tenant"("dbName");

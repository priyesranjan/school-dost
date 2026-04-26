SELECT 'CREATE DATABASE erp_platform'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'erp_platform')\gexec

SELECT 'CREATE DATABASE tenant_delhi_public_school'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'tenant_delhi_public_school')\gexec

# Coolify Deployment Guide

This repo is ready for a two-service Coolify deployment:

1. `frontend`  
   Vite app built into a static Nginx container from the root `Dockerfile`
2. `backend`  
   Express + Prisma app built from `backend/Dockerfile`

## Recommended topology

- `frontend`: `https://app.yourdomain.com`
- `backend`: `https://api.yourdomain.com`
- PostgreSQL:
  - either a managed database
  - or a Coolify Postgres service

## Frontend service

- Build source: repository root
- Dockerfile path: `Dockerfile`
- Port: `80`

### Frontend build envs

Set these in Coolify for the frontend service:

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_OTP_MODE=api
VITE_R2_MODE=api
VITE_AUDIT_SIGNATURE_MODE=api
VITE_AUDIT_SIGNATURE_ENDPOINT=https://api.yourdomain.com/api/audit/sign
```

Optional:

```env
VITE_TENANT_SLUG=delhi-public-school
```

Only use `VITE_TENANT_SLUG` if you are deploying a single-tenant branded frontend.  
For subdomain-based multi-tenant routing, leave it empty.

## Backend service

- Build source: `backend`
- Dockerfile path: `Dockerfile`
- Port: `8080`

The backend container automatically runs:

```sh
npx prisma migrate deploy
node dist/server.js
```

### Required backend envs

```env
NODE_ENV=production
PORT=8080

DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/TENANT_DB?schema=public
PLATFORM_DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/PLATFORM_DB?schema=public
PLATFORM_DB_ADMIN_URL=postgresql://USER:PASSWORD@HOST:5432/postgres

TENANT_DB_USER=USER
TENANT_DB_PASS=PASSWORD

JWT_SECRET=replace-with-strong-secret-at-least-24-chars
JWT_REFRESH_SECRET=replace-with-strong-secret-at-least-24-chars
AUDIT_SIGNING_SALT=replace-with-strong-secret-at-least-24-chars

ALLOWED_ORIGINS=https://app.yourdomain.com
JWT_EXPIRES_IN=12h
JWT_REFRESH_EXPIRES_IN=7d
REFRESH_REVOKED_RETENTION_DAYS=30
```

### Optional integrations

```env
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
R2_PUBLIC_BASE_URL=
R2_SIGN_EXPIRES_SECONDS=300

SMS_PROVIDER_API_KEY=
SMS_PROVIDER_WEBHOOK_URL=
WHATSAPP_PROVIDER_API_KEY=
WHATSAPP_PROVIDER_WEBHOOK_URL=
COMMS_PROVIDER_API_KEY=
COMMS_PROVIDER_WEBHOOK_URL=
```

## Platform database notes

This project uses:

- a `platform` database for tenant registry and platform auth metadata
- separate tenant databases for school data

That means production provisioning should already have:

1. the platform database created
2. tenant rows present in the platform DB
3. tenant databases created and migrated

If you are doing a first live test for one school only, the simplest route is:

1. create `erp_platform`
2. create one tenant DB
3. run platform init/provisioning scripts
4. point frontend at backend

## Health checks

Frontend:

- `/healthz`

Backend:

- `/api/health`
- `/api/db/ping`

## First deployment checklist

1. Deploy database
2. Deploy backend with production envs
3. Confirm backend health at `/api/health`
4. Deploy frontend with `VITE_API_BASE_URL`
5. Set `ALLOWED_ORIGINS` on backend to the frontend domain
6. Verify login, assignments, webhooks, payroll, accounting, and security settings

## Android / mobile note

For the Flutter app in production, use:

```text
https://api.yourdomain.com/api
```

as the backend base URL on the login screen.

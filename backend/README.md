# ERP Backend Bootstrap

This backend bootstrap provides:

- `GET /api/health` for service readiness.
- `GET /api/db/ping` for database connectivity checks.
- `POST /api/auth/otp/send` for OTP challenge creation.
- `POST /api/auth/otp/verify` for OTP verification and token response.
- `POST /api/auth/refresh` for access-token rotation with refresh token.
- `POST /api/auth/logout` for refresh-token revocation.
- `POST /api/auth/logout-all` to revoke all active sessions for the current user.
- `GET /api/auth/sessions` to list refresh-token sessions for the current user.
- `POST /api/auth/sessions/:session_id/revoke` to revoke one session by id.
- `POST /api/storage/r2/sign-upload` for Cloudflare R2 signed uploads.
- `POST /api/notices` to create notices.
- `POST /api/timetable/entries` to create timetable entries.
- `POST /api/audit/sign` to sign audit payloads.
- `POST /api/students` to create students.
- `POST /api/certificates/issue` to issue certificates.
- `GET /api/certificates/verify?no=...` to verify certificate numbers.
- `POST /api/fees/structures` to create fee structures.
- `POST /api/fees/payments` to record fee payments.
- `POST /api/attendance` to create attendance records.
- `GET /api/students` to list students (filters + pagination).
- `GET /api/notices` to list notices (filters + pagination).
- `GET /api/timetable/entries` to list timetable entries.
- `GET /api/fees/structures` to list fee structures.
- `GET /api/fees/payments` to list fee payments.
- `GET /api/attendance` to list attendance records.
- `GET /api/dashboard/summary` to fetch dashboard aggregates.
- `GET /api/audit/logs` to list audit entries (metadata masked for non-admin roles).
- `GET /api/audit/verify` to validate audit hash-chain integrity (admin only).
- A standalone `db:ping` script for CI/CD and terminal verification.
- Prisma schema and migration workflow for PostgreSQL.

## Quick Start

1. Copy env template:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Start in dev mode:

```bash
npm run dev
```

4. Test DB directly:

```bash
npm run db:ping
```

5. Generate Prisma client and apply migrations:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init_erp_core
```

## Production Build

```bash
npm run build
npm start
```

## OTP API (Demo)

Send OTP challenge:

```bash
curl -X POST http://localhost:8080/api/auth/otp/send \
	-H "Content-Type: application/json" \
	-d '{"phone":"9876543201","purpose":"login"}'
```

Verify OTP (demo OTP is `123456`):

```bash
curl -X POST http://localhost:8080/api/auth/otp/verify \
	-H "Content-Type: application/json" \
	-d '{"session_id":"otp_xxx","otp":"123456"}'
```

## Database URL

Use your project database URL in `.env`:

```env
DATABASE_URL=postgresql://project1_user:StrongPass%40123@91.108.111.194:5555/kgnox_db?sslmode=disable
```

R2 configuration in `.env`:

```env
R2_ACCOUNT_ID=5c4ce3f441e1aba0ff794665e17df31b
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET=kgnox
R2_PUBLIC_BASE_URL=
R2_SIGN_EXPIRES_SECONDS=300
JWT_SECRET=change-me-jwt-secret
JWT_EXPIRES_IN=12h
JWT_REFRESH_SECRET=change-me-jwt-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
REFRESH_REVOKED_RETENTION_DAYS=30
```

Production guardrails:

- `JWT_SECRET`, `JWT_REFRESH_SECRET`, and `AUDIT_SIGNING_SALT` must be strong (min 24 chars).
- Startup fails in production if insecure default-like values are detected.

## R2 Sign Upload API

```bash
curl -X POST http://localhost:8080/api/storage/r2/sign-upload \
	-H "Content-Type: application/json" \
	-d '{"object_key":"students/12/profile-1712067654-photo.jpg","content_type":"image/jpeg"}'
```

## Auth Note

Most write APIs require a bearer token from `POST /api/auth/otp/verify`:

```text
Authorization: Bearer <token>
```

Refresh access token:

```bash
curl -X POST http://localhost:8080/api/auth/refresh \
	-H "Content-Type: application/json" \
	-d '{"refresh_token":"<refresh_token>"}'
```

Logout (revoke refresh token):

```bash
curl -X POST http://localhost:8080/api/auth/logout \
	-H "Content-Type: application/json" \
	-d '{"refresh_token":"<refresh_token>"}'
```

Logout all active sessions (requires bearer token):

```bash
curl -X POST http://localhost:8080/api/auth/logout-all \
	-H "Authorization: Bearer <token>"
```

List current sessions:

```bash
curl -X GET http://localhost:8080/api/auth/sessions \
	-H "Authorization: Bearer <token>"
```

Revoke one session:

```bash
curl -X POST http://localhost:8080/api/auth/sessions/<session_id>/revoke \
	-H "Authorization: Bearer <token>"
```

Audit logs (role-aware masking):

```bash
curl -X GET "http://localhost:8080/api/audit/logs?page=1&per_page=50" \
	-H "Authorization: Bearer <token>"
```

Audit chain verification (admin):

```bash
curl -X GET http://localhost:8080/api/audit/verify \
	-H "Authorization: Bearer <admin-token>"
```

Refresh token maintenance cleanup:

```bash
npm run tokens:cleanup
```

This job deletes expired tokens and old revoked tokens based on `REFRESH_REVOKED_RETENTION_DAYS`.

Auth lifecycle smoke test:

```bash
npm run test:auth-smoke
```

Optionally point to a different backend base URL:

```bash
API_BASE_URL=http://localhost:8080 npm run test:auth-smoke
```

Automated maintenance workflow:

- Added GitHub Actions workflow at `.github/workflows/backend-maintenance.yml`.
- Runs weekly and supports manual dispatch to execute `npm run tokens:cleanup`.
- Requires repository secrets: `BACKEND_DATABASE_URL`, `BACKEND_JWT_SECRET`, `BACKEND_JWT_REFRESH_SECRET`, `BACKEND_AUDIT_SIGNING_SALT`.

## Validation and Rate Limits

- Request bodies are validated using Zod on write and auth endpoints.
- OTP and signed-upload endpoints are protected by per-window rate limits.
- General write actions use a write-rate limiter to reduce abuse bursts.

## Protected Endpoint Examples

Create student:

```bash
curl -X POST http://localhost:8080/api/students \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer <token>" \
	-d '{"name":"Test Student","roll_number":"R12345","class_name":"Class 9","section":"A","parent_name":"Parent Test","phone":"9876500000","admission_date":"2026-04-03"}'
```

Issue certificate:

```bash
curl -X POST http://localhost:8080/api/certificates/issue \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer <token>" \
	-d '{"certificate_no":"TC-2026-0001","student_id":1,"type":"tc","issue_date":"2026-04-03","issued_by":"Admin User"}'
```

Create fee structure:

```bash
curl -X POST http://localhost:8080/api/fees/structures \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer <token>" \
	-d '{"name":"Tuition Q1","class_name":"Class 9","amount":15000,"due_date":"2026-04-30","academic_year":"2026-27"}'
```

Record fee payment:

```bash
curl -X POST http://localhost:8080/api/fees/payments \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer <token>" \
	-d '{"student_id":1,"fee_structure_id":1,"total_amount":15000,"paid_amount":5000,"payment_method":"upi","payment_date":"2026-04-03"}'
```

Create attendance:

```bash
curl -X POST http://localhost:8080/api/attendance \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer <token>" \
	-d '{"student_id":1,"date":"2026-04-03","status":"present"}'
```

List students (paginated):

```bash
curl -X GET "http://localhost:8080/api/students?page=1&per_page=20" \
	-H "Authorization: Bearer <token>"
```

Dashboard summary:

```bash
curl -X GET "http://localhost:8080/api/dashboard/summary" \
	-H "Authorization: Bearer <token>"
```

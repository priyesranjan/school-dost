# School ERP Backend API Contract (Phase 2)

This contract defines backend endpoints required for OTP authentication, Cloudflare R2 storage uploads, certificate verification, and audit signing.

## 0. Platform Health

### OPTIONS /api/health
Lightweight endpoint reachability probe used by Settings > Integration Readiness.

Response:
```json
{
  "data": {
    "status": "ok"
  }
}
```

## 1. OTP Authentication (2Factor)

### POST /api/auth/otp/send
Send OTP for login.

Request:
```json
{
  "phone": "9876543201",
  "purpose": "login"
}
```

Response:
```json
{
  "data": {
    "session_id": "otp_1712067654123_123",
    "destination_masked": "******3201",
    "expires_at": 1712067954123
  }
}
```

### POST /api/auth/otp/verify
Verify OTP against a challenge.

Request:
```json
{
  "session_id": "otp_1712067654123_123",
  "otp": "123456"
}
```

Response:
```json
{
  "data": {
    "verified": true,
    "token": "jwt-token-here",
    "user": {
      "name": "Admin User",
      "role": "admin",
      "email": "admin@school.com",
      "phone": "9876543201",
      "profile_photo_url": "https://cdn.example.com/users/admin.png"
    }
  }
}
```

## 2. Cloudflare R2 Signed Upload

### POST /api/storage/r2/sign-upload
Generate signed upload URL for profile photos/documents.

Request:
```json
{
  "object_key": "students/12/profile-1712067654-photo.jpg",
  "content_type": "image/jpeg"
}
```

Response:
```json
{
  "data": {
    "upload_url": "https://<signed-r2-put-url>",
    "public_url": "https://cdn.school.com/students/12/profile-1712067654-photo.jpg"
  }
}
```

## 3. Certificate Verification

### GET /api/certificates/verify?no=TC-2026-0001
Public endpoint for QR verification.

Response:
```json
{
  "data": {
    "valid": true,
    "certificate_no": "TC-2026-0001",
    "student_name": "Ishita Joshi",
    "class_name": "Class 7",
    "type": "tc",
    "issue_date": "2026-03-20",
    "issued_by": "Admin User"
  }
}
```

## 4. Notices and Timetable Broadcast

### POST /api/notices
Create notice and optionally broadcast SMS.

Request:
```json
{
  "title": "Holiday",
  "message": "School closed tomorrow",
  "audience": "class",
  "class_name": "Class 10",
  "send_sms": true
}
```

## 5. Audit Signature

### POST /api/audit/sign
Sign an audit log payload server-side. Used when `audit_signature_mode=api`.

Request:
```json
{
  "id": 1712067654123123,
  "action": "notice_published",
  "module": "notices",
  "actor_name": "Admin User",
  "actor_role": "admin",
  "target": "Holiday Notice",
  "metadata": "Published with SMS",
  "created_at": "2026-04-02T09:12:00.000Z",
  "prev_hash": "a1b2c3d4",
  "signature_version": 1
}
```

Response:
```json
{
  "data": {
    "hash": "server-computed-hash"
  }
}
```

### POST /api/timetable/entries
Create timetable slot and optionally send SMS schedule alert.

Request:
```json
{
  "class_name": "Class 10",
  "day": "Monday",
  "period": "P2",
  "subject": "Science",
  "teacher": "Ravi Kumar",
  "start_time": "09:50",
  "end_time": "10:35",
  "send_sms": true
}
```

## Error Format
All endpoints should return consistent error envelope:
```json
{
  "error": {
    "code": "INVALID_OTP",
    "message": "OTP is invalid or expired"
  }
}
```

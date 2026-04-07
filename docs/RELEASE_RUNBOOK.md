# Release Runbook

## Pre-Release Checklist
- Run `npm run phase:validate`.
- Verify OTP mode and R2 mode settings for target environment.
- Verify audit signature mode and endpoint.
- Export backup snapshot from Settings > Data Ops.

## Staging Verification
- Login OTP flow works in configured mode.
- Profile upload works in configured R2 mode.
- Notices approve/reject/rework and publish flow works.
- Audit integrity status is valid.
- Parent portal renders published notices/timetable.

## Production Cutover
- Deploy frontend bundle.
- Set environment variables and API routing.
- Smoke test admin, teacher, accountant, receptionist roles.

## Rollback
- Revert to previous frontend build artifact.
- Restore latest backup snapshot for demo/local persistence if needed.

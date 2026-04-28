# Mobile Deployment Checklist

- Configure `API_BASE_URL` per environment using `--dart-define`.
- Add Firebase Android app and place `google-services.json` under `android/app`.
- Enable Firebase Auth, Firestore, Storage, Cloud Messaging, Crashlytics, Analytics, and Performance.
- Deploy `docs/firestore.rules` after replacing role claims with production custom claims.
- Configure Android signing, package name, version code, and Play Store track.
- Verify tenant isolation headers on every protected REST request.
- Test login for admin, principal, HOD, teacher, accountant, receptionist, parent, and student.
- Test offline attendance queue, sync retry, and conflict handling.
- Test FCM foreground, background, terminated, topic, and deep-link flows.
- Test payment success, failure, retry, and receipt download flows.
- Run `flutter analyze`, `flutter test`, and an Android release build before shipping.

# 🚀 ADVANCED MASTER PROMPT - Teachmint++ School ERP Mobile App

## 1. CORE PRODUCT VISION
Build a **School Operating System mobile app** where every user sees a different app experience based on their role (SuperAdmin, School Admin, HOD, Teacher, Accountant, Receptionist, Parent, Student). It must feel Premium, Fast, Secure, Modern, and Enterprise-grade.

## 2. TECH STACK
- Flutter latest stable
- Firebase Auth, Firestore, Storage, FCM, Crashlytics, Analytics
- Dio for REST APIs
- Riverpod / Bloc for state management
- GoRouter for navigation
- Flutter Secure Storage
- Hive / Isar for offline cache
- Clean Architecture + Feature-first structure

## 3. PROJECT STRUCTURE
```text
lib/
 ├── app/
 ├── core/ (config, constants, error, network, security, storage, theme, permissions, notifications, analytics, utils)
 ├── features/ (auth, dashboard, attendance, timetable, assignments, fees, etc.)
 ├── shared/ (widgets, layouts, cards, loaders, empty_states, form_fields)
 └── main.dart
```

## 4. UI/UX DESIGN SYSTEM
- Clean SaaS dashboard look, Dark + Light mode, Glassmorphism cards.
- Primary: Indigo / Purple gradient.

## 5. SECURITY & TENANT FLOW
- JWT interceptor, Refresh token flow, Tenant ID header, Device binding, Encrypted local storage.
- Every request includes `Authorization: Bearer <token>`, `X-Tenant-ID`, `X-Device-ID`.

## 6. OFFLINE-FIRST & CAPABILITIES
- Cache dashboard data, offline attendance marking, offline assignment drafts, auto-sync.
- Advanced Notification Architecture (FCM, deep linking, role-wise targeting).

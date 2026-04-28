# School ERP - Zero-Trust Role-Based Access Control (RBAC) Architecture

## Overview
This platform employs a **Zero-Trust MNC-Grade Security Architecture** designed to seamlessly isolate and protect user data based strictly on roles (`superadmin`, `admin`, `accountant`, `teacher`, `receptionist`, `student`, `parent`, `hod`). 

## 1. Frontend Security (Vue 3 / UI Layer)
- **Dynamic Dashboards**: `src/pages/DashboardPage.vue` automatically loads a sub-dashboard component based on the user's role (e.g., `AdminDashboard.vue` vs `StudentDashboard.vue`). Unauthorized users simply do not have the code rendered to access privileged actions.
- **Route Injection & Guards**: `src/router/index.ts` works in tandem with `src/constants/permissions.ts` to actively filter out and block unpermitted routes. If a Student manually navigates to `/fees`, the frontend kicks them out. 
- **Sidebar Filtering**: Only menu groups applicable to a user's role are rendered in the DOM (`src/layouts/AppLayout.vue`).

## 2. Backend Security (Node / Express / Database Layer)
The frontend guards are purely supplementary. Real protection takes place on the backend.
- **Token Verification**: Every API call includes a JWT token. This token explicitly contains the user's unmodifiable Role and Tenant.
- **Route Validation (`requireRole`)**: Within controllers, we secure the API endpoints so that forged client requests fail. 
  - Example: `router.get('/', requireAuth, requireRole(['admin', 'teacher', 'receptionist', 'hod']), async (req, res) => ...)`
  - If a manipulated request arrives without the accepted roles, `backend/src/middleware/auth.ts` intercepts it and throws a `403 Forbidden` response.

## 3. Mobile App (Flutter) - MNC-Grade Foundation
- **Clean Architecture Structure**: Feature-first folders under `mobile_flutter/lib` (`app`, `core`, `features`, `shared`).
- **Role-Based Navigation Engine**: `core/permissions/permission_engine.dart` generates tabs based on role permissions, not hardcoded UI logic.
- **Secure Session Manager**: `core/security/session_manager.dart` stores JWT, tenant slug, and base URL in `flutter_secure_storage`.
- **Tenant-Aware Login**: `features/auth/login_screen.dart` captures tenant slug + API base URL, then authenticates via `AuthRepository`.
- **Router Guarding**: `app/router.dart` uses `GoRouter` + `Riverpod` to redirect between splash, login, and dashboard.
- **Role Dashboards + UI Kit**: `features/dashboard/role_dashboards` + shared widgets (`shared/cards`, `shared/widgets`) provide premium dashboard scaffolds and reusable cards.

## Future Checklist for Adding a New Role:
1. **Types**: Add role to `Role` type in `src/constants/permissions.ts`.
2. **Permissions Array**: Populate the list of views allowed for the role in `src/constants/permissions.ts`.
3. **Dashboards**: Create a `NewRoleDashboard.vue` and inject it in `src/pages/DashboardPage.vue`.
4. **Backend Routes**: Ensure any newly created backend endpoints explicitly apply `requireRole([ ...allowed ])`. 

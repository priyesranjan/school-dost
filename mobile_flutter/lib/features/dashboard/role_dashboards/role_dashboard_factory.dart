import 'package:flutter/material.dart';
import '../../../core/permissions/app_permissions.dart';
import 'accountant_dashboard.dart';
import 'admin_dashboard.dart';
import 'hod_dashboard.dart';
import 'parent_dashboard.dart';
import 'principal_dashboard.dart';
import 'receptionist_dashboard.dart';
import 'student_dashboard.dart';
import 'superadmin_dashboard.dart';
import 'teacher_dashboard.dart';

class RoleDashboardFactory {
  static Widget forRole(String role) {
    switch (role) {
      case AppRoles.superadmin:
        return const SuperadminDashboard();
      case AppRoles.admin:
        return const AdminDashboard();
      case AppRoles.principal:
        return const PrincipalDashboard();
      case AppRoles.hod:
        return const HodDashboard();
      case AppRoles.teacher:
        return const TeacherDashboard();
      case AppRoles.receptionist:
        return const ReceptionistDashboard();
      case AppRoles.parent:
        return const ParentDashboard();
      case AppRoles.student:
        return const StudentDashboard();
      case AppRoles.accountant:
        return const AccountantDashboard();
      default:
        return const AdminDashboard();
    }
  }
}

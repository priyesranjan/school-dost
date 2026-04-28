import 'package:flutter/material.dart';
import 'app_permissions.dart';

class AppNavItem {
  const AppNavItem({
    required this.id,
    required this.label,
    required this.icon,
    required this.activeIcon,
    required this.requiredPermissions,
  });

  final String id;
  final String label;
  final IconData icon;
  final IconData activeIcon;
  final List<String> requiredPermissions;
}

const Map<String, List<String>> roleTabOrder = {
  AppRoles.teacher: [
    'home',
    'attendance',
    'timetable',
    'assignments',
    'profile',
  ],
  AppRoles.parent: ['home', 'fees', 'progress', 'notices', 'profile'],
  AppRoles.student: ['home', 'classes', 'assignments', 'results', 'profile'],
  AppRoles.accountant: ['home', 'fees', 'ledger', 'expenses', 'reports'],
  AppRoles.principal: ['home', 'students', 'staff', 'academics', 'reports'],
  AppRoles.admin: ['home', 'students', 'staff', 'academics', 'reports'],
  AppRoles.hod: ['home', 'attendance', 'assignments', 'reports', 'profile'],
  AppRoles.receptionist: ['home', 'students', 'fees', 'profile'],
  AppRoles.superadmin: ['home', 'reports', 'students', 'staff', 'profile'],
};

const List<AppNavItem> appNavItems = [
  AppNavItem(
    id: 'home',
    label: 'Home',
    icon: Icons.space_dashboard_outlined,
    activeIcon: Icons.space_dashboard,
    requiredPermissions: [AppPermissions.home],
  ),
  AppNavItem(
    id: 'classes',
    label: 'Classes',
    icon: Icons.class_outlined,
    activeIcon: Icons.class_,
    requiredPermissions: [AppPermissions.classes],
  ),
  AppNavItem(
    id: 'attendance',
    label: 'Attendance',
    icon: Icons.event_available_outlined,
    activeIcon: Icons.event_available,
    requiredPermissions: [AppPermissions.attendance],
  ),
  AppNavItem(
    id: 'assignments',
    label: 'Assignments',
    icon: Icons.assignment_outlined,
    activeIcon: Icons.assignment,
    requiredPermissions: [AppPermissions.assignments],
  ),
  AppNavItem(
    id: 'resources',
    label: 'Resources',
    icon: Icons.folder_outlined,
    activeIcon: Icons.folder,
    requiredPermissions: [AppPermissions.resources],
  ),
  AppNavItem(
    id: 'results',
    label: 'Results',
    icon: Icons.grade_outlined,
    activeIcon: Icons.grade,
    requiredPermissions: [AppPermissions.results],
  ),
  AppNavItem(
    id: 'fees',
    label: 'Fees',
    icon: Icons.payments_outlined,
    activeIcon: Icons.payments,
    requiredPermissions: [AppPermissions.fees],
  ),
  AppNavItem(
    id: 'ledger',
    label: 'Ledger',
    icon: Icons.menu_book_outlined,
    activeIcon: Icons.menu_book,
    requiredPermissions: [AppPermissions.ledger],
  ),
  AppNavItem(
    id: 'expenses',
    label: 'Expenses',
    icon: Icons.receipt_long_outlined,
    activeIcon: Icons.receipt_long,
    requiredPermissions: [AppPermissions.expenses],
  ),
  AppNavItem(
    id: 'timetable',
    label: 'Timetable',
    icon: Icons.calendar_month_outlined,
    activeIcon: Icons.calendar_month,
    requiredPermissions: [AppPermissions.timetable],
  ),
  AppNavItem(
    id: 'students',
    label: 'Students',
    icon: Icons.people_outline,
    activeIcon: Icons.people,
    requiredPermissions: [AppPermissions.students],
  ),
  AppNavItem(
    id: 'staff',
    label: 'Staff',
    icon: Icons.badge_outlined,
    activeIcon: Icons.badge,
    requiredPermissions: [AppPermissions.staff],
  ),
  AppNavItem(
    id: 'academics',
    label: 'Academics',
    icon: Icons.school_outlined,
    activeIcon: Icons.school,
    requiredPermissions: [AppPermissions.academics],
  ),
  AppNavItem(
    id: 'progress',
    label: 'Progress',
    icon: Icons.trending_up_outlined,
    activeIcon: Icons.trending_up,
    requiredPermissions: [AppPermissions.progress],
  ),
  AppNavItem(
    id: 'notices',
    label: 'Notices',
    icon: Icons.notifications_outlined,
    activeIcon: Icons.notifications,
    requiredPermissions: [AppPermissions.notices],
  ),
  AppNavItem(
    id: 'reports',
    label: 'Reports',
    icon: Icons.bar_chart_outlined,
    activeIcon: Icons.bar_chart,
    requiredPermissions: [AppPermissions.reports],
  ),
  AppNavItem(
    id: 'profile',
    label: 'Profile',
    icon: Icons.person_outline,
    activeIcon: Icons.person,
    requiredPermissions: [AppPermissions.profile],
  ),
];

class PermissionEngine {
  static List<AppNavItem> tabsForRole(String role) {
    return tabsForPermissions(
      role: role,
      permissions: rolePermissions[role] ?? const <String>[],
    );
  }

  static List<AppNavItem> tabsForPermissions({
    required String role,
    required List<String> permissions,
  }) {
    final configuredTabs = roleTabOrder[role];
    final filtered = appNavItems.where((tab) {
      return tab.requiredPermissions.isEmpty ||
          tab.requiredPermissions.any(permissions.contains);
    }).toList();

    if (configuredTabs == null || configuredTabs.isEmpty) {
      return filtered.take(5).toList();
    }

    final ordered = <AppNavItem>[];
    for (final tabId in configuredTabs) {
      final match = filtered.where((tab) => tab.id == tabId);
      if (match.isNotEmpty) {
        ordered.add(match.first);
      }
    }

    if (ordered.isEmpty) {
      return filtered.take(5).toList();
    }

    return ordered.take(5).toList();
  }
}

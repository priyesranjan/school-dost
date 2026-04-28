import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/services.dart';
import '../../core/permissions/app_permissions.dart';
import '../../core/permissions/permission_engine.dart';
import '../../core/security/session_manager.dart';
import '../../shared/layouts/app_scaffold.dart';
import '../../shared/layouts/role_based_bottom_nav.dart';
import '../../shared/widgets/search_command_sheet.dart';
import 'feature_placeholder_screen.dart';
import 'role_dashboards/role_dashboard_factory.dart';

class DashboardShell extends ConsumerStatefulWidget {
  const DashboardShell({super.key});

  @override
  ConsumerState<DashboardShell> createState() => _DashboardShellState();
}

class _DashboardShellState extends ConsumerState<DashboardShell> {
  int _index = 0;

  void _openCommandSearch(List<AppNavItem> tabs) {
    showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      builder: (context) => SearchCommandSheet(
        commands: tabs.map((tab) => tab.label).toList(),
        onSelected: (label) {
          final index = tabs.indexWhere((tab) => tab.label == label);
          Navigator.of(context).pop();
          if (index >= 0) {
            HapticFeedback.selectionClick();
            setState(() => _index = index);
          }
        },
      ),
    );
  }

  Widget _buildTab(String tabId, String role) {
    switch (tabId) {
      case 'home':
        return RoleDashboardFactory.forRole(role);
      case 'attendance':
        return const FeaturePlaceholderScreen(
          title: 'Attendance',
          message: 'Mark daily attendance and review trends here.',
          icon: Icons.event_available,
        );
      case 'timetable':
        return const FeaturePlaceholderScreen(
          title: 'Timetable',
          message: 'View today\'s schedule and upcoming classes.',
          icon: Icons.calendar_month,
        );
      case 'assignments':
        return const FeaturePlaceholderScreen(
          title: 'Assignments',
          message: 'Track assignments, deadlines, and reviews.',
          icon: Icons.assignment,
        );
      case 'fees':
        return const FeaturePlaceholderScreen(
          title: 'Fees',
          message: 'Manage fee plans, dues, and receipts.',
          icon: Icons.payments,
        );
      case 'ledger':
        return const FeaturePlaceholderScreen(
          title: 'Ledger',
          message: 'Audit fee ledger entries and outstanding balances.',
          icon: Icons.menu_book,
        );
      case 'expenses':
        return const FeaturePlaceholderScreen(
          title: 'Expenses',
          message: 'Track operational expenses and approvals.',
          icon: Icons.receipt_long,
        );
      case 'students':
        return const FeaturePlaceholderScreen(
          title: 'Students',
          message: 'Access student profiles, attendance, and records.',
          icon: Icons.people,
        );
      case 'staff':
        return const FeaturePlaceholderScreen(
          title: 'Staff',
          message: 'Manage staff profiles and HR operations.',
          icon: Icons.badge,
        );
      case 'academics':
        return const FeaturePlaceholderScreen(
          title: 'Academics',
          message: 'Maintain academic structure and curriculum.',
          icon: Icons.school,
        );
      case 'progress':
        return const FeaturePlaceholderScreen(
          title: 'Progress',
          message: 'Monitor academic progress and report cards.',
          icon: Icons.trending_up,
        );
      case 'notices':
        return const FeaturePlaceholderScreen(
          title: 'Notices',
          message: 'Stay updated with school announcements.',
          icon: Icons.notifications,
        );
      case 'results':
        return const FeaturePlaceholderScreen(
          title: 'Results',
          message: 'Check exam results and performance analytics.',
          icon: Icons.grade,
        );
      case 'classes':
        return const FeaturePlaceholderScreen(
          title: 'Classes',
          message: 'Access class schedules and assignments.',
          icon: Icons.class_,
        );
      case 'reports':
        return const FeaturePlaceholderScreen(
          title: 'Reports',
          message: 'Download institution performance reports.',
          icon: Icons.bar_chart,
        );
      case 'profile':
        return const FeaturePlaceholderScreen(
          title: 'Profile',
          message: 'Update personal details and preferences.',
          icon: Icons.person,
        );
      default:
        return const FeaturePlaceholderScreen(
          title: 'Module',
          message: 'This module is being configured.',
          icon: Icons.widgets,
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    final sessionAsync = ref.watch(sessionProvider);

    return sessionAsync.when(
      data: (session) {
        if (session == null) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        final effectivePermissions = session.permissions.isNotEmpty
            ? session.permissions
            : rolePermissions[session.role] ?? const <String>[];
        final tabs = PermissionEngine.tabsForPermissions(
          role: session.role,
          permissions: effectivePermissions,
        );
        if (tabs.isEmpty) {
          return const Scaffold(
            body: Center(child: Text('No modules available for this role.')),
          );
        }
        if (_index >= tabs.length) {
          _index = 0;
        }

        final tabScreens = tabs
            .map((tab) => _buildTab(tab.id, session.role))
            .toList();

        return AppScaffold(
          title: tabs[_index].label,
          actions: [
            IconButton(
              tooltip: 'Search',
              icon: const Icon(Icons.search),
              onPressed: () => _openCommandSearch(tabs),
            ),
            IconButton(
              tooltip: 'Logout',
              icon: const Icon(Icons.logout, color: Colors.redAccent),
              onPressed: () => ref.read(sessionProvider.notifier).logout(),
            ),
          ],
          body: IndexedStack(index: _index, children: tabScreens),
          bottomNavigationBar: RoleBasedBottomNav(
            items: tabs,
            selectedIndex: _index,
            onDestinationSelected: (idx) {
              HapticFeedback.selectionClick();
              setState(() => _index = idx);
            },
          ),
        );
      },
      loading: () =>
          const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (e, st) => Scaffold(body: Center(child: Text('Error: $e'))),
    );
  }
}

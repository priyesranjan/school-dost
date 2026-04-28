import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_flutter/core/permissions/app_permissions.dart';
import 'package:mobile_flutter/core/permissions/permission_engine.dart';

void main() {
  test(
    'every school role receives a dedicated permission-filtered tab set',
    () {
      const schoolRoles = [
        AppRoles.admin,
        AppRoles.principal,
        AppRoles.hod,
        AppRoles.teacher,
        AppRoles.accountant,
        AppRoles.receptionist,
        AppRoles.parent,
        AppRoles.student,
      ];

      for (final role in schoolRoles) {
        final tabs = PermissionEngine.tabsForPermissions(
          role: role,
          permissions: rolePermissions[role] ?? const [],
        );

        expect(tabs, isNotEmpty, reason: '$role should have visible tabs');
        expect(
          tabs.first.id,
          'home',
          reason: '$role should start on dashboard',
        );
      }
    },
  );

  test('permissions decide visible modules even for a known role', () {
    final tabs = PermissionEngine.tabsForPermissions(
      role: AppRoles.teacher,
      permissions: const [
        AppPermissions.home,
        AppPermissions.attendance,
        AppPermissions.profile,
      ],
    );

    expect(tabs.map((tab) => tab.id), ['home', 'attendance', 'profile']);
  });
}

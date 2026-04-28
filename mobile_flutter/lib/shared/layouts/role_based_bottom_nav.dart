import 'package:flutter/material.dart';

import '../../core/permissions/permission_engine.dart';

class RoleBasedBottomNav extends StatelessWidget {
  const RoleBasedBottomNav({
    super.key,
    required this.items,
    required this.selectedIndex,
    required this.onDestinationSelected,
  });

  final List<AppNavItem> items;
  final int selectedIndex;
  final ValueChanged<int> onDestinationSelected;

  @override
  Widget build(BuildContext context) {
    return NavigationBar(
      selectedIndex: selectedIndex,
      onDestinationSelected: onDestinationSelected,
      destinations: items
          .map(
            (tab) => NavigationDestination(
              icon: Icon(tab.icon),
              selectedIcon: Icon(tab.activeIcon),
              label: tab.label,
            ),
          )
          .toList(),
    );
  }
}

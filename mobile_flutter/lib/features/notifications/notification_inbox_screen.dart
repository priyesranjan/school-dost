import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/notifications/notification_providers.dart';
import '../../shared/empty_states/empty_state_widget.dart';
import '../../shared/widgets/notification_tile.dart';

class NotificationInboxScreen extends ConsumerWidget {
  const NotificationInboxScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final service = ref.watch(notificationServiceProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Notifications')),
      body: FutureBuilder(
        future: service.loadInbox(),
        builder: (context, snapshot) {
          final items = snapshot.data ?? const [];
          if (items.isEmpty) {
            return const EmptyStateWidget(
              title: 'No notifications',
              message: 'Important school alerts will appear here.',
              icon: Icons.notifications_none,
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.all(12),
            itemBuilder: (context, index) =>
                NotificationTile(notification: items[index], onTap: () {}),
            separatorBuilder: (_, _) => const Divider(height: 1),
            itemCount: items.length,
          );
        },
      ),
    );
  }
}

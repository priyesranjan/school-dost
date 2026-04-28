import 'package:flutter/material.dart';

import '../../core/notifications/app_notification.dart';

class NotificationTile extends StatelessWidget {
  const NotificationTile({
    super.key,
    required this.notification,
    required this.onTap,
  });

  final AppNotification notification;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final color = notification.isEmergency
        ? Colors.red
        : Theme.of(context).colorScheme.primary;
    return ListTile(
      onTap: onTap,
      leading: CircleAvatar(
        backgroundColor: color.withValues(alpha: 0.12),
        child: Icon(Icons.notifications, color: color),
      ),
      title: Text(
        notification.title,
        style: TextStyle(
          fontWeight: notification.isRead ? FontWeight.w600 : FontWeight.w900,
        ),
      ),
      subtitle: Text(notification.body),
      trailing: notification.isRead
          ? null
          : const Icon(Icons.circle, size: 10, color: Colors.blue),
    );
  }
}

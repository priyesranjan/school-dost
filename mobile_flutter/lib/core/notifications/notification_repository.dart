import 'app_notification.dart';

abstract class NotificationRepository {
  Future<List<AppNotification>> inbox();

  Future<void> markRead(String notificationId);

  Future<void> markAllRead();
}

class InMemoryNotificationRepository implements NotificationRepository {
  InMemoryNotificationRepository([List<AppNotification>? seed])
    : _items = seed ?? const [];

  List<AppNotification> _items;

  @override
  Future<List<AppNotification>> inbox() async => List.unmodifiable(_items);

  @override
  Future<void> markAllRead() async {
    _items = _items.map(_copyAsRead).toList();
  }

  @override
  Future<void> markRead(String notificationId) async {
    _items = _items
        .map((item) => item.id == notificationId ? _copyAsRead(item) : item)
        .toList();
  }

  AppNotification _copyAsRead(AppNotification item) {
    return AppNotification(
      id: item.id,
      tenantId: item.tenantId,
      title: item.title,
      body: item.body,
      type: item.type,
      priority: item.priority,
      deepLink: item.deepLink,
      createdAt: item.createdAt,
      isRead: true,
    );
  }
}

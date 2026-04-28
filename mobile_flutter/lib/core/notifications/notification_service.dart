import 'app_notification.dart';
import 'local_notification_service.dart';
import 'notification_preferences.dart';
import 'notification_repository.dart';

class NotificationService {
  const NotificationService({
    required NotificationRepository repository,
    required LocalNotificationService localNotifications,
  }) : _repository = repository,
       _localNotifications = localNotifications;

  final NotificationRepository _repository;
  final LocalNotificationService _localNotifications;

  Future<List<AppNotification>> loadInbox() => _repository.inbox();

  bool canShowForegroundAlert(
    AppNotification notification,
    NotificationPreferences preferences,
  ) {
    return _localNotifications.shouldDisplay(
      notification,
      preferences,
      DateTime.now(),
    );
  }
}

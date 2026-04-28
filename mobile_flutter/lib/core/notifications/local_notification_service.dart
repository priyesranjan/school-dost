import 'app_notification.dart';
import 'notification_preferences.dart';

class LocalNotificationService {
  const LocalNotificationService();

  bool shouldDisplay(
    AppNotification notification,
    NotificationPreferences preferences,
    DateTime now,
  ) {
    if (!preferences.enabled) return false;
    if (notification.isEmergency && preferences.emergencyBypassesQuietHours) {
      return true;
    }
    if (!preferences.quietHoursEnabled) return true;

    final start = preferences.quietHoursStartHour;
    final end = preferences.quietHoursEndHour;
    final hour = now.hour;

    if (start > end) {
      return !(hour >= start || hour < end);
    }
    return !(hour >= start && hour < end);
  }
}

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../security/session_manager.dart';
import 'local_notification_service.dart';
import 'notification_repository.dart';
import 'notification_service.dart';

final notificationRepositoryProvider = Provider<NotificationRepository>(
  (ref) => InMemoryNotificationRepository(),
);

final localNotificationServiceProvider = Provider(
  (ref) => const LocalNotificationService(),
);

final notificationServiceProvider = Provider(
  (ref) => NotificationService(
    repository: ref.watch(notificationRepositoryProvider),
    localNotifications: ref.watch(localNotificationServiceProvider),
  ),
);

final fcmTokenStorageProvider = Provider(
  (ref) => ref.watch(secureStorageServiceProvider),
);

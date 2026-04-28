import 'app_notification.dart';

class DeepLinkHandler {
  const DeepLinkHandler();

  String routeFor(AppNotification notification) {
    if (notification.deepLink.isNotEmpty) {
      return notification.deepLink;
    }

    switch (notification.type) {
      case AppNotificationType.feeDue:
        return '/fees/details';
      case AppNotificationType.paymentSuccess:
      case AppNotificationType.paymentFailed:
        return '/fees/receipt';
      case AppNotificationType.newAssignment:
      case AppNotificationType.assignmentDeadline:
        return '/assignments';
      case AppNotificationType.attendanceAbsent:
        return '/attendance';
      case AppNotificationType.examSchedule:
      case AppNotificationType.resultPublished:
        return '/exams';
      case AppNotificationType.teacherNotice:
      case AppNotificationType.holidayNotice:
      case AppNotificationType.disciplineAlert:
      case AppNotificationType.transportAlert:
      case AppNotificationType.emergencyAlert:
      case AppNotificationType.systemAlert:
        return '/notifications';
    }
  }
}

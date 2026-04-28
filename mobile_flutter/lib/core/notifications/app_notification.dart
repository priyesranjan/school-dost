enum AppNotificationType {
  attendanceAbsent,
  feeDue,
  paymentSuccess,
  paymentFailed,
  newAssignment,
  assignmentDeadline,
  examSchedule,
  resultPublished,
  teacherNotice,
  holidayNotice,
  disciplineAlert,
  transportAlert,
  emergencyAlert,
  systemAlert,
}

enum AppNotificationPriority { low, normal, high, emergency }

class AppNotification {
  const AppNotification({
    required this.id,
    required this.tenantId,
    required this.title,
    required this.body,
    required this.type,
    required this.priority,
    required this.deepLink,
    required this.createdAt,
    required this.isRead,
  });

  final String id;
  final String tenantId;
  final String title;
  final String body;
  final AppNotificationType type;
  final AppNotificationPriority priority;
  final String deepLink;
  final DateTime createdAt;
  final bool isRead;

  bool get isEmergency => priority == AppNotificationPriority.emergency;
}

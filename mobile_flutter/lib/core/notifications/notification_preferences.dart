class NotificationPreferences {
  const NotificationPreferences({
    required this.enabled,
    required this.quietHoursEnabled,
    required this.quietHoursStartHour,
    required this.quietHoursEndHour,
    required this.emergencyBypassesQuietHours,
  });

  final bool enabled;
  final bool quietHoursEnabled;
  final int quietHoursStartHour;
  final int quietHoursEndHour;
  final bool emergencyBypassesQuietHours;

  static const defaults = NotificationPreferences(
    enabled: true,
    quietHoursEnabled: false,
    quietHoursStartHour: 22,
    quietHoursEndHour: 7,
    emergencyBypassesQuietHours: true,
  );
}

class AppPermissions {
  static const String home = 'home.view';
  static const String classes = 'classes.view';
  static const String assignments = 'assignments.view';
  static const String resources = 'resources.view';
  static const String results = 'results.view';
  static const String fees = 'fees.view';
  static const String ledger = 'ledger.view';
  static const String expenses = 'expenses.view';
  static const String timetable = 'timetable.view';
  static const String attendance = 'attendance.view';
  static const String students = 'students.view';
  static const String staff = 'staff.view';
  static const String academics = 'academics.view';
  static const String progress = 'progress.view';
  static const String notices = 'notices.view';
  static const String reports = 'reports.view';
  static const String profile = 'profile.view';
  static const String settings = 'settings.view';
}

class AppRoles {
  static const String superadmin = 'superadmin';
  static const String admin = 'admin';
  static const String principal = 'principal';
  static const String hod = 'hod';
  static const String teacher = 'teacher';
  static const String accountant = 'accountant';
  static const String receptionist = 'receptionist';
  static const String parent = 'parent';
  static const String student = 'student';
}

const Map<String, List<String>> rolePermissions = {
  AppRoles.superadmin: [
    AppPermissions.home,
    AppPermissions.reports,
    AppPermissions.students,
    AppPermissions.staff,
    AppPermissions.academics,
    AppPermissions.profile,
  ],
  AppRoles.admin: [
    AppPermissions.home,
    AppPermissions.students,
    AppPermissions.staff,
    AppPermissions.academics,
    AppPermissions.reports,
    AppPermissions.profile,
  ],
  AppRoles.principal: [
    AppPermissions.home,
    AppPermissions.students,
    AppPermissions.staff,
    AppPermissions.academics,
    AppPermissions.attendance,
    AppPermissions.fees,
    AppPermissions.notices,
    AppPermissions.reports,
    AppPermissions.profile,
  ],
  AppRoles.hod: [
    AppPermissions.home,
    AppPermissions.assignments,
    AppPermissions.attendance,
    AppPermissions.reports,
    AppPermissions.profile,
  ],
  AppRoles.teacher: [
    AppPermissions.home,
    AppPermissions.assignments,
    AppPermissions.timetable,
    AppPermissions.attendance,
    AppPermissions.profile,
  ],
  AppRoles.accountant: [
    AppPermissions.home,
    AppPermissions.fees,
    AppPermissions.ledger,
    AppPermissions.expenses,
    AppPermissions.reports,
    AppPermissions.profile,
  ],
  AppRoles.receptionist: [
    AppPermissions.home,
    AppPermissions.students,
    AppPermissions.fees,
    AppPermissions.profile,
  ],
  AppRoles.parent: [
    AppPermissions.home,
    AppPermissions.fees,
    AppPermissions.progress,
    AppPermissions.notices,
    AppPermissions.profile,
  ],
  AppRoles.student: [
    AppPermissions.home,
    AppPermissions.classes,
    AppPermissions.assignments,
    AppPermissions.results,
    AppPermissions.profile,
  ],
};

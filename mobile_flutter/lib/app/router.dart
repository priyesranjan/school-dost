import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../core/security/session_manager.dart';
import '../features/auth/login_screen.dart';
import '../features/attendance/attendance_marking_screen.dart';
import '../features/assignments/assignment_details_screen.dart';
import '../features/assignments/assignment_list_screen.dart';
import '../features/communication/notice_details_screen.dart';
import '../features/dashboard/dashboard_shell.dart';
import '../features/exams/exam_result_screen.dart';
import '../features/fees/fee_details_screen.dart';
import '../features/fees/payment_screen.dart';
import '../features/notifications/notification_inbox_screen.dart';
import '../features/settings/offline_sync_screen.dart';
import '../features/settings/settings_screen.dart';

// Create a shell router structure for dynamic role checking
final routerProvider = Provider<GoRouter>((ref) {
  final sessionState = ref.watch(sessionProvider);

  return GoRouter(
    initialLocation: '/splash',
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) =>
            const Scaffold(body: Center(child: CircularProgressIndicator())),
      ),
      GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
      GoRoute(
        path: '/dashboard',
        builder: (context, state) => const DashboardShell(),
      ),
      GoRoute(
        path: '/attendance',
        builder: (context, state) => const AttendanceMarkingScreen(),
      ),
      GoRoute(
        path: '/fees/details',
        builder: (context, state) => const FeeDetailsScreen(),
      ),
      GoRoute(
        path: '/fees/payment',
        builder: (context, state) => const PaymentScreen(),
      ),
      GoRoute(
        path: '/assignments',
        builder: (context, state) => const AssignmentListScreen(),
      ),
      GoRoute(
        path: '/assignments/details',
        builder: (context, state) => const AssignmentDetailsScreen(),
      ),
      GoRoute(
        path: '/exams',
        builder: (context, state) => const ExamResultScreen(),
      ),
      GoRoute(
        path: '/notifications',
        builder: (context, state) => const NotificationInboxScreen(),
      ),
      GoRoute(
        path: '/notices/details',
        builder: (context, state) => const NoticeDetailsScreen(),
      ),
      GoRoute(
        path: '/settings',
        builder: (context, state) => const SettingsScreen(),
      ),
      GoRoute(
        path: '/sync',
        builder: (context, state) => const OfflineSyncScreen(),
      ),
    ],
    redirect: (context, state) {
      if (sessionState is AsyncLoading) return '/splash';

      final session = sessionState.value;
      final goingToLogin = state.uri.toString() == '/login';

      if (session == null && !goingToLogin) {
        return '/login';
      }
      if (session != null && goingToLogin) {
        return '/dashboard';
      }
      if (session != null && state.uri.toString() == '/splash') {
        return '/dashboard';
      }
      return null;
    },
  );
});

import 'package:flutter/widgets.dart';

class AppLifecycleObserver extends WidgetsBindingObserver {
  AppLifecycleObserver({this.onResumed, this.onPaused});

  final VoidCallback? onResumed;
  final VoidCallback? onPaused;

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      onResumed?.call();
    }
    if (state == AppLifecycleState.paused ||
        state == AppLifecycleState.inactive) {
      onPaused?.call();
    }
  }
}

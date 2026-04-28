import 'package:flutter/material.dart';
import '../../shared/empty_states/empty_state_widget.dart';

class FeaturePlaceholderScreen extends StatelessWidget {
  const FeaturePlaceholderScreen({
    super.key,
    required this.title,
    required this.message,
    required this.icon,
  });

  final String title;
  final String message;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return EmptyStateWidget(title: title, message: message, icon: icon);
  }
}

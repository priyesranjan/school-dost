import 'package:flutter/material.dart';

class AttendanceRing extends StatelessWidget {
  const AttendanceRing({super.key, required this.percent, required this.label});

  final double percent;
  final String label;

  @override
  Widget build(BuildContext context) {
    final normalized = percent.clamp(0, 100) / 100;
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0, end: normalized),
      duration: const Duration(milliseconds: 700),
      builder: (context, value, _) {
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox(
              height: 92,
              width: 92,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  CircularProgressIndicator(
                    value: value,
                    strokeWidth: 9,
                    strokeCap: StrokeCap.round,
                  ),
                  Text(
                    '${(value * 100).round()}%',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),
            Text(label, style: Theme.of(context).textTheme.labelLarge),
          ],
        );
      },
    );
  }
}

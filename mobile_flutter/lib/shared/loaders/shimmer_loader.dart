import 'package:flutter/material.dart';

class ShimmerBox extends StatelessWidget {
  const ShimmerBox({
    super.key,
    this.height = 120,
    this.width = double.infinity,
  });

  final double height;
  final double width;

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: -1, end: 2),
      duration: const Duration(milliseconds: 1400),
      curve: Curves.easeInOut,
      builder: (context, value, child) {
        return Container(
          height: height,
          width: width,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            gradient: LinearGradient(
              begin: Alignment(-1, 0),
              end: Alignment(1, 0),
              stops: [value - 0.4, value, value + 0.4],
              colors: [
                Colors.grey.withValues(alpha: 0.15),
                Colors.grey.withValues(alpha: 0.3),
                Colors.grey.withValues(alpha: 0.15),
              ],
            ),
          ),
        );
      },
      onEnd: () {},
    );
  }
}

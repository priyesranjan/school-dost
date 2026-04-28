import 'package:flutter/material.dart';

class QuickAction {
  const QuickAction({
    required this.label,
    required this.icon,
    required this.onTap,
  });

  final String label;
  final IconData icon;
  final VoidCallback onTap;
}

class QuickActionGrid extends StatelessWidget {
  const QuickActionGrid({super.key, required this.actions});

  final List<QuickAction> actions;

  @override
  Widget build(BuildContext context) {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 4,
      mainAxisSpacing: 10,
      crossAxisSpacing: 10,
      children: actions
          .map(
            (action) => InkWell(
              borderRadius: BorderRadius.circular(16),
              onTap: action.onTap,
              child: Ink(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  color: Theme.of(
                    context,
                  ).colorScheme.primary.withValues(alpha: 0.08),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(action.icon),
                    const SizedBox(height: 6),
                    Text(
                      action.label,
                      textAlign: TextAlign.center,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: Theme.of(context).textTheme.labelSmall,
                    ),
                  ],
                ),
              ),
            ),
          )
          .toList(),
    );
  }
}

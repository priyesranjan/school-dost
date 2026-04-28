import 'package:flutter/material.dart';

class FeeDueCard extends StatelessWidget {
  const FeeDueCard({
    super.key,
    required this.amount,
    required this.dueLabel,
    required this.onPay,
  });

  final String amount;
  final String dueLabel;
  final VoidCallback onPay;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        gradient: const LinearGradient(
          colors: [Color(0xFFFFF7ED), Color(0xFFFFFBEB)],
        ),
        border: Border.all(
          color: const Color(0xFFF59E0B).withValues(alpha: 0.25),
        ),
      ),
      child: Row(
        children: [
          const Icon(Icons.payments, color: Color(0xFFF59E0B), size: 34),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  amount,
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.w800,
                  ),
                ),
                Text(dueLabel),
              ],
            ),
          ),
          FilledButton(onPressed: onPay, child: const Text('Pay')),
        ],
      ),
    );
  }
}

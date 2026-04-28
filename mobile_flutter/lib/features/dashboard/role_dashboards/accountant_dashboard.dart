import 'package:flutter/material.dart';
import '../../../shared/cards/insight_card.dart';
import '../../../shared/cards/metric_card.dart';
import '../../../shared/widgets/section_header.dart';

class AccountantDashboard extends StatelessWidget {
  const AccountantDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        InsightCard(
          title: 'Collections stabilized',
          subtitle: 'Rs 1.2M collected today. 3 high-risk accounts flagged.',
          icon: Icons.account_balance_wallet,
          color: Colors.green,
        ),
        const SizedBox(height: 20),
        const SectionHeader(title: 'Finance Pulse'),
        const SizedBox(height: 12),
        GridView.count(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: 2,
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          childAspectRatio: 1.1,
          children: const [
            MetricCard(
              label: 'Today Collection',
              value: 'Rs 1.2M',
              icon: Icons.payments,
              color: Colors.teal,
            ),
            MetricCard(
              label: 'Pending Dues',
              value: 'Rs 4.1M',
              icon: Icons.warning_amber,
              color: Colors.orange,
            ),
            MetricCard(
              label: 'Fee Risk',
              value: '18',
              icon: Icons.report_gmailerrorred,
              color: Colors.red,
            ),
            MetricCard(
              label: 'Expenses',
              value: 'Rs 320k',
              icon: Icons.receipt_long,
              color: Colors.blue,
            ),
          ],
        ),
        const SizedBox(height: 20),
        const SectionHeader(title: 'Recent Transactions'),
        const SizedBox(height: 12),
        InsightCard(
          title: 'Salary batch due',
          subtitle: 'Payroll approvals pending for April cycle.',
          icon: Icons.payments_outlined,
          color: Colors.purple,
        ),
      ],
    );
  }
}

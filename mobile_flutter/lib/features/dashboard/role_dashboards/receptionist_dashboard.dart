import 'package:flutter/material.dart';
import '../../../shared/cards/insight_card.dart';
import '../../../shared/cards/metric_card.dart';
import '../../../shared/widgets/section_header.dart';

class ReceptionistDashboard extends StatelessWidget {
  const ReceptionistDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        InsightCard(
          title: 'Front Office Desk',
          subtitle: 'Admissions, enquiries, visitors, and quick fee support.',
          icon: Icons.support_agent,
          color: Colors.blue,
        ),
        const SizedBox(height: 20),
        const SectionHeader(title: 'Today'),
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
              label: 'Enquiries',
              value: '14',
              icon: Icons.contact_phone,
              color: Colors.blue,
            ),
            MetricCard(
              label: 'Visitors',
              value: '22',
              icon: Icons.how_to_reg,
              color: Colors.teal,
            ),
            MetricCard(
              label: 'Receipts',
              value: '8',
              icon: Icons.receipt,
              color: Colors.green,
            ),
            MetricCard(
              label: 'Callbacks',
              value: '5',
              icon: Icons.phone_callback,
              color: Colors.orange,
            ),
          ],
        ),
        const SizedBox(height: 20),
        const SectionHeader(title: 'Follow Ups'),
        const SizedBox(height: 12),
        InsightCard(
          title: 'Admission pipeline',
          subtitle: '6 parents need document verification reminders.',
          icon: Icons.fact_check,
          color: Colors.indigo,
        ),
      ],
    );
  }
}

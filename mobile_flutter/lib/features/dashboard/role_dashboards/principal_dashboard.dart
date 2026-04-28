import 'package:flutter/material.dart';
import '../../../shared/cards/insight_card.dart';
import '../../../shared/cards/metric_card.dart';
import '../../../shared/widgets/section_header.dart';

class PrincipalDashboard extends StatelessWidget {
  const PrincipalDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        InsightCard(
          title: 'Principal Overview',
          subtitle: 'Monitor academics, discipline, staff, fees, and alerts.',
          icon: Icons.account_balance,
          color: Colors.indigo,
        ),
        const SizedBox(height: 20),
        const SectionHeader(title: 'School Health'),
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
              label: 'Attendance',
              value: '94%',
              icon: Icons.event_available,
              color: Colors.green,
            ),
            MetricCard(
              label: 'Fee Collection',
              value: '82%',
              icon: Icons.payments,
              color: Colors.orange,
            ),
            MetricCard(
              label: 'Staff Tasks',
              value: '17',
              icon: Icons.task_alt,
              color: Colors.teal,
            ),
            MetricCard(
              label: 'Alerts',
              value: '5',
              icon: Icons.warning_amber,
              color: Colors.redAccent,
            ),
          ],
        ),
        const SizedBox(height: 20),
        const SectionHeader(title: 'Leadership Focus'),
        const SizedBox(height: 12),
        InsightCard(
          title: 'Academic performance',
          subtitle: 'Class 10 science results need department review.',
          icon: Icons.auto_graph,
          color: Colors.purple,
        ),
        const SizedBox(height: 12),
        InsightCard(
          title: 'Admissions pipeline',
          subtitle: '12 new enquiries are pending principal approval.',
          icon: Icons.person_add_alt,
          color: Colors.blue,
        ),
      ],
    );
  }
}

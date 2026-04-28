import 'package:flutter/material.dart';
import '../../../shared/cards/insight_card.dart';
import '../../../shared/cards/metric_card.dart';
import '../../../shared/widgets/section_header.dart';

class AdminDashboard extends StatelessWidget {
  const AdminDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        InsightCard(
          title: 'Institution Pulse',
          subtitle: 'Admissions are up 8% this month with stable attendance.',
          icon: Icons.auto_graph,
          color: Colors.indigo,
        ),
        const SizedBox(height: 20),
        const SectionHeader(title: 'Key Metrics'),
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
              label: 'Students',
              value: '1,284',
              icon: Icons.people,
              color: Colors.indigo,
            ),
            MetricCard(
              label: 'Staff',
              value: '92',
              icon: Icons.badge,
              color: Colors.teal,
            ),
            MetricCard(
              label: 'Fee Collected',
              value: 'Rs 4.8M',
              icon: Icons.payments,
              color: Colors.orange,
            ),
            MetricCard(
              label: 'Attendance',
              value: '94%',
              icon: Icons.event_available,
              color: Colors.green,
            ),
          ],
        ),
        const SizedBox(height: 20),
        const SectionHeader(title: 'Operational Alerts'),
        const SizedBox(height: 12),
        InsightCard(
          title: 'Fee Risk Cluster',
          subtitle: '18 students have pending dues beyond 30 days.',
          icon: Icons.warning_amber,
          color: Colors.amber,
        ),
        const SizedBox(height: 12),
        InsightCard(
          title: 'Transport Coverage',
          subtitle: 'Bus route 4 needs maintenance approval.',
          icon: Icons.directions_bus,
          color: Colors.blue,
        ),
      ],
    );
  }
}

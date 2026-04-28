import 'package:flutter/material.dart';
import '../../../shared/cards/insight_card.dart';
import '../../../shared/cards/metric_card.dart';
import '../../../shared/widgets/section_header.dart';

class SuperadminDashboard extends StatelessWidget {
  const SuperadminDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        InsightCard(
          title: 'Platform Command Center',
          subtitle: 'Manage tenant schools, plans, platform health, and risk.',
          icon: Icons.admin_panel_settings,
          color: Colors.deepPurple,
        ),
        const SizedBox(height: 20),
        const SectionHeader(title: 'Platform Metrics'),
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
              label: 'Schools',
              value: '24',
              icon: Icons.apartment,
              color: Colors.deepPurple,
            ),
            MetricCard(
              label: 'Active Users',
              value: '18.6K',
              icon: Icons.groups,
              color: Colors.indigo,
            ),
            MetricCard(
              label: 'MRR',
              value: 'Rs 8.2M',
              icon: Icons.workspace_premium,
              color: Colors.amber,
            ),
            MetricCard(
              label: 'Alerts',
              value: '3',
              icon: Icons.health_and_safety,
              color: Colors.redAccent,
            ),
          ],
        ),
        const SizedBox(height: 20),
        const SectionHeader(title: 'Tenant Operations'),
        const SizedBox(height: 12),
        InsightCard(
          title: 'Provisioning Queue',
          subtitle: '2 schools are waiting for storage verification.',
          icon: Icons.cloud_sync,
          color: Colors.blue,
        ),
        const SizedBox(height: 12),
        InsightCard(
          title: 'Isolation Health',
          subtitle: 'All active schools are assigned to isolated schemas.',
          icon: Icons.verified_user,
          color: Colors.green,
        ),
      ],
    );
  }
}

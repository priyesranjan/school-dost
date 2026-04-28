import 'package:flutter/material.dart';
import '../../../shared/cards/insight_card.dart';
import '../../../shared/cards/metric_card.dart';
import '../../../shared/widgets/section_header.dart';

class HodDashboard extends StatelessWidget {
  const HodDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        InsightCard(
          title: 'Department Overview',
          subtitle: 'Track teachers, attendance, assignments, and performance.',
          icon: Icons.school,
          color: Colors.teal,
        ),
        const SizedBox(height: 20),
        const SectionHeader(title: 'Department Metrics'),
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
              label: 'Teachers',
              value: '18',
              icon: Icons.badge,
              color: Colors.teal,
            ),
            MetricCard(
              label: 'Classes',
              value: '42',
              icon: Icons.class_,
              color: Colors.indigo,
            ),
            MetricCard(
              label: 'Attendance',
              value: '93%',
              icon: Icons.event_available,
              color: Colors.green,
            ),
            MetricCard(
              label: 'Pending Reviews',
              value: '9',
              icon: Icons.rate_review,
              color: Colors.orange,
            ),
          ],
        ),
        const SizedBox(height: 20),
        const SectionHeader(title: 'Academic Watchlist'),
        const SizedBox(height: 12),
        InsightCard(
          title: 'Assignment Lag',
          subtitle: 'Class 9B has 11 pending notebook reviews.',
          icon: Icons.assignment_late,
          color: Colors.amber,
        ),
      ],
    );
  }
}

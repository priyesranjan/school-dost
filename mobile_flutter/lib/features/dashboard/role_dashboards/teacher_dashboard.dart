import 'package:flutter/material.dart';
import '../../../shared/cards/insight_card.dart';
import '../../../shared/cards/metric_card.dart';
import '../../../shared/widgets/section_header.dart';

class TeacherDashboard extends StatelessWidget {
  const TeacherDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        InsightCard(
          title: 'Good morning, Priya',
          subtitle:
              'Your first class starts at 9:00 AM. 2 quick tasks pending.',
          icon: Icons.wb_sunny,
          color: Colors.orange,
        ),
        const SizedBox(height: 20),
        const SectionHeader(title: 'Today at a Glance'),
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
              label: 'Classes',
              value: '5',
              icon: Icons.calendar_month,
              color: Colors.indigo,
            ),
            MetricCard(
              label: 'Assignments',
              value: '12',
              icon: Icons.assignment,
              color: Colors.teal,
            ),
            MetricCard(
              label: 'Pending Reviews',
              value: '7',
              icon: Icons.rate_review,
              color: Colors.pink,
            ),
            MetricCard(
              label: 'Attendance',
              value: '98%',
              icon: Icons.event_available,
              color: Colors.green,
            ),
          ],
        ),
        const SizedBox(height: 20),
        const SectionHeader(title: 'Intervention Watchlist'),
        const SizedBox(height: 12),
        InsightCard(
          title: '3 students need attention',
          subtitle: 'Low attendance and pending submissions flagged.',
          icon: Icons.visibility,
          color: Colors.redAccent,
        ),
      ],
    );
  }
}

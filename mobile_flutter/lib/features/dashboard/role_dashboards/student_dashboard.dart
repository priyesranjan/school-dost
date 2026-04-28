import 'package:flutter/material.dart';
import '../../../shared/cards/insight_card.dart';
import '../../../shared/cards/metric_card.dart';
import '../../../shared/widgets/section_header.dart';

class StudentDashboard extends StatelessWidget {
  const StudentDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        InsightCard(
          title: 'Keep the streak alive',
          subtitle: '2 assignments due this week. Plan ahead.',
          icon: Icons.rocket_launch,
          color: Colors.indigo,
        ),
        const SizedBox(height: 20),
        const SectionHeader(title: 'Today Overview'),
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
              value: '6',
              icon: Icons.calendar_month,
              color: Colors.teal,
            ),
            MetricCard(
              label: 'Assignments',
              value: '4',
              icon: Icons.assignment,
              color: Colors.orange,
            ),
            MetricCard(
              label: 'Results',
              value: 'A-',
              icon: Icons.grade,
              color: Colors.green,
            ),
            MetricCard(
              label: 'Attendance',
              value: '95%',
              icon: Icons.event_available,
              color: Colors.blue,
            ),
          ],
        ),
        const SizedBox(height: 20),
        const SectionHeader(title: 'Study Focus'),
        const SizedBox(height: 12),
        InsightCard(
          title: 'Science lab prep',
          subtitle: 'Review chapters 3-5 before Friday lab.',
          icon: Icons.science,
          color: Colors.purple,
        ),
      ],
    );
  }
}

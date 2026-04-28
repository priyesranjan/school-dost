import 'package:flutter/material.dart';
import '../../../shared/cards/insight_card.dart';
import '../../../shared/cards/metric_card.dart';
import '../../../shared/widgets/section_header.dart';

class ParentDashboard extends StatelessWidget {
  const ParentDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        InsightCard(
          title: 'Aarav is on track',
          subtitle: 'Attendance is steady, and results improved this term.',
          icon: Icons.star,
          color: Colors.indigo,
        ),
        const SizedBox(height: 20),
        const SectionHeader(title: 'Student Snapshot'),
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
              value: '93%',
              icon: Icons.event_available,
              color: Colors.green,
            ),
            MetricCard(
              label: 'Fee Due',
              value: 'Rs 2,500',
              icon: Icons.payments,
              color: Colors.orange,
            ),
            MetricCard(
              label: 'Upcoming Exams',
              value: '2',
              icon: Icons.quiz,
              color: Colors.teal,
            ),
            MetricCard(
              label: 'Notices',
              value: '3',
              icon: Icons.notifications,
              color: Colors.pink,
            ),
          ],
        ),
        const SizedBox(height: 20),
        const SectionHeader(title: 'Urgent Alerts'),
        const SizedBox(height: 12),
        InsightCard(
          title: 'Transport fee reminder',
          subtitle: 'Due in 3 days. Pay now to avoid late fees.',
          icon: Icons.warning_amber,
          color: Colors.amber,
        ),
      ],
    );
  }
}

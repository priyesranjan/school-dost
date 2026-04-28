import 'package:flutter/material.dart';

import '../../shared/cards/assignment_card.dart';

class AssignmentListScreen extends StatelessWidget {
  const AssignmentListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Assignments')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          AssignmentCard(
            title: 'Algebra worksheet',
            subject: 'Math',
            deadline: 'Today',
            status: 'Open',
          ),
          AssignmentCard(
            title: 'Science lab notes',
            subject: 'Science',
            deadline: 'Friday',
            status: 'Draft',
          ),
        ],
      ),
    );
  }
}

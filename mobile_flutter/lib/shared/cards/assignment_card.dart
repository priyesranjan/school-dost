import 'package:flutter/material.dart';

class AssignmentCard extends StatelessWidget {
  const AssignmentCard({
    super.key,
    required this.title,
    required this.subject,
    required this.deadline,
    required this.status,
  });

  final String title;
  final String subject;
  final String deadline;
  final String status;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: const Icon(Icons.assignment),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w800)),
        subtitle: Text('$subject · Due $deadline'),
        trailing: Chip(label: Text(status)),
      ),
    );
  }
}

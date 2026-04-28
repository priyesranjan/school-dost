import 'package:flutter/material.dart';

class TimetableCard extends StatelessWidget {
  const TimetableCard({
    super.key,
    required this.time,
    required this.subject,
    required this.room,
  });

  final String time;
  final String subject;
  final String room;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      leading: const CircleAvatar(child: Icon(Icons.schedule)),
      title: Text(subject, style: const TextStyle(fontWeight: FontWeight.w800)),
      subtitle: Text(room),
      trailing: Text(time, style: const TextStyle(fontWeight: FontWeight.w700)),
    );
  }
}

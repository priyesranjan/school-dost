import 'package:flutter/material.dart';

class AttendanceMarkingScreen extends StatelessWidget {
  const AttendanceMarkingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Mark Attendance')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          FilledButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.done_all),
            label: const Text('Bulk Present'),
          ),
          const SizedBox(height: 12),
          ...List.generate(
            8,
            (index) => Card(
              child: SwitchListTile(
                value: index != 2,
                onChanged: (_) {},
                title: Text('Student ${index + 1}'),
                subtitle: Text(
                  index == 2 ? 'Absent reason required' : 'Present',
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

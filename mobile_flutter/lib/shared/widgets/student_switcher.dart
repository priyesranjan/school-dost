import 'package:flutter/material.dart';

class StudentSwitcher extends StatelessWidget {
  const StudentSwitcher({
    super.key,
    required this.students,
    required this.selectedStudentId,
    required this.onChanged,
  });

  final Map<String, String> students;
  final String selectedStudentId;
  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) {
    return DropdownButtonFormField<String>(
      initialValue: selectedStudentId,
      decoration: const InputDecoration(
        labelText: 'Student',
        border: OutlineInputBorder(),
      ),
      items: students.entries
          .map(
            (entry) =>
                DropdownMenuItem(value: entry.key, child: Text(entry.value)),
          )
          .toList(),
      onChanged: (value) {
        if (value != null) onChanged(value);
      },
    );
  }
}

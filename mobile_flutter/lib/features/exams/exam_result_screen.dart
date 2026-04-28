import 'package:flutter/material.dart';

class ExamResultScreen extends StatelessWidget {
  const ExamResultScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Exam Results')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          Card(
            child: ListTile(
              title: Text('Term 1 Summary'),
              subtitle: Text('Grade A- · 87% aggregate'),
              trailing: Icon(Icons.picture_as_pdf),
            ),
          ),
        ],
      ),
    );
  }
}

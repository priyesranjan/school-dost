import 'package:flutter/material.dart';

class AssignmentDetailsScreen extends StatelessWidget {
  const AssignmentDetailsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Assignment Details')),
      body: const Padding(
        padding: EdgeInsets.all(16),
        child: Card(
          child: ListTile(
            leading: Icon(Icons.upload_file),
            title: Text('Submission Workspace'),
            subtitle: Text(
              'Upload files, review remarks, and track deadline status.',
            ),
          ),
        ),
      ),
    );
  }
}

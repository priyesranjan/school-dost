import 'package:flutter/material.dart';

class NoticeDetailsScreen extends StatelessWidget {
  const NoticeDetailsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Card(
            child: ListTile(
              leading: Icon(Icons.campaign),
              title: Text('Notice Details'),
              subtitle: Text(
                'Role-wise announcements and attachments appear here.',
              ),
            ),
          ),
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';

class OfflineSyncScreen extends StatelessWidget {
  const OfflineSyncScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Offline Sync')),
      body: const Center(
        child: Card(
          child: Padding(
            padding: EdgeInsets.all(20),
            child: Text(
              'Pending offline requests and sync conflicts appear here.',
            ),
          ),
        ),
      ),
    );
  }
}

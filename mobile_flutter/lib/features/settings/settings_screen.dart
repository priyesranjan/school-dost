import 'package:flutter/material.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        children: const [
          SwitchListTile(
            value: true,
            onChanged: null,
            title: Text('Biometric login'),
            subtitle: Text('Enable after device credential setup'),
          ),
          SwitchListTile(
            value: false,
            onChanged: null,
            title: Text('Quiet hours'),
            subtitle: Text('Emergency alerts can bypass quiet hours'),
          ),
        ],
      ),
    );
  }
}

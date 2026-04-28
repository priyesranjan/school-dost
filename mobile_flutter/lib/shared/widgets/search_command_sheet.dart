import 'package:flutter/material.dart';

class SearchCommandSheet extends StatelessWidget {
  const SearchCommandSheet({
    super.key,
    required this.commands,
    required this.onSelected,
  });

  final List<String> commands;
  final ValueChanged<String> onSelected;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const TextField(
            autofocus: true,
            decoration: InputDecoration(
              prefixIcon: Icon(Icons.search),
              hintText: 'Search modules, students, staff...',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 12),
          ...commands.map(
            (command) => ListTile(
              leading: const Icon(Icons.bolt),
              title: Text(command),
              onTap: () => onSelected(command),
            ),
          ),
        ],
      ),
    );
  }
}

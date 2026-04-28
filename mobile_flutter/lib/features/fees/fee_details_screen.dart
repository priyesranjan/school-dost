import 'package:flutter/material.dart';

import '../../shared/cards/fee_due_card.dart';

class FeeDetailsScreen extends StatelessWidget {
  const FeeDetailsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Fee Details')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          FeeDueCard(
            amount: 'Rs 2,500',
            dueLabel: 'Due by 30 April',
            onPay: () {},
          ),
          const SizedBox(height: 16),
          const Card(
            child: ListTile(
              leading: Icon(Icons.receipt_long),
              title: Text('Ledger History'),
              subtitle: Text('Receipts, concessions, and pending dues'),
            ),
          ),
        ],
      ),
    );
  }
}

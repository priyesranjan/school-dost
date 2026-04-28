import 'package:flutter/material.dart';

class PaymentScreen extends StatelessWidget {
  const PaymentScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Payment')),
      body: Center(
        child: FilledButton.icon(
          onPressed: () {},
          icon: const Icon(Icons.lock),
          label: const Text('Start Secure Payment'),
        ),
      ),
    );
  }
}

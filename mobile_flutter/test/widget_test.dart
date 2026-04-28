import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:mobile_flutter/features/auth/login_screen.dart';

void main() {
  testWidgets('shows mobile login shell', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(child: MaterialApp(home: LoginScreen())),
    );
    await tester.pump(const Duration(milliseconds: 100));

    expect(find.text('Teachmint++'), findsOneWidget);
    expect(find.text('Sign In'), findsOneWidget);
  });
}

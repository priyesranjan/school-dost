import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:mobile_flutter/main.dart';

void main() {
  testWidgets('shows mobile login shell when there is no saved session', (WidgetTester tester) async {
    SharedPreferences.setMockInitialValues({});

    await tester.pumpWidget(const ErpSchoolMobileApp());
    await tester.pumpAndSettle();

    expect(find.text('ERP School Mobile'), findsOneWidget);
    expect(find.text('Sign In'), findsOneWidget);
  });
}

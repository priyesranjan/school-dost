import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';

void main() {
  runApp(const ErpSchoolMobileApp());
}

class ErpSchoolMobileApp extends StatefulWidget {
  const ErpSchoolMobileApp({super.key});

  @override
  State<ErpSchoolMobileApp> createState() => _ErpSchoolMobileAppState();
}

class _ErpSchoolMobileAppState extends State<ErpSchoolMobileApp> {
  AppSession? _session;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _restoreSession();
  }

  Future<void> _restoreSession() async {
    final session = await SessionStore.load();
    if (!mounted) return;
    setState(() {
      _session = session;
      _loading = false;
    });
  }

  Future<void> _handleLogin(AppSession session) async {
    await SessionStore.save(session);
    if (!mounted) return;
    setState(() {
      _session = session;
    });
  }

  Future<void> _handleLogout() async {
    await SessionStore.clear();
    if (!mounted) return;
    setState(() {
      _session = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ERP School Mobile',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF4F46E5)),
        useMaterial3: true,
      ),
      home: _loading
          ? const Scaffold(body: Center(child: CircularProgressIndicator()))
          : _session == null
              ? LoginScreen(onLogin: _handleLogin)
              : MobileShell(session: _session!, onLogout: _handleLogout),
    );
  }
}

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key, required this.onLogin});

  final Future<void> Function(AppSession session) onLogin;

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _baseUrlController = TextEditingController(text: 'http://10.0.2.2:4000/api');
  final _tenantController = TextEditingController(text: 'demo');
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _loading = false;

  @override
  void dispose() {
    _baseUrlController.dispose();
    _tenantController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    FocusScope.of(context).unfocus();
    setState(() => _loading = true);
    try {
      final api = MobileApiClient(
        baseUrl: _baseUrlController.text.trim(),
        tenantSlug: _tenantController.text.trim(),
      );
      final session = await api.login(
        email: _emailController.text.trim(),
        password: _passwordController.text,
      );
      await widget.onLogin(session);
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(error.toString().replaceFirst('Exception: ', ''))),
      );
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: Colors.indigo.shade50,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      'Android App · Flutter',
                      style: TextStyle(
                        color: Colors.indigo.shade700,
                        fontWeight: FontWeight.w800,
                        fontSize: 12,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'ERP School Mobile',
                    style: TextStyle(fontSize: 32, fontWeight: FontWeight.w800),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Sign in with your tenant slug and school account to access assignments, resources, fees, and timetable on Android.',
                    style: TextStyle(color: Colors.grey.shade700, height: 1.4),
                  ),
                  const SizedBox(height: 24),
                  TextField(
                    controller: _baseUrlController,
                    decoration: const InputDecoration(
                      labelText: 'Backend API Base URL',
                      hintText: 'http://10.0.2.2:4000/api',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _tenantController,
                          decoration: const InputDecoration(
                            labelText: 'Tenant Slug',
                            border: OutlineInputBorder(),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: TextField(
                          controller: _emailController,
                          decoration: const InputDecoration(
                            labelText: 'Email',
                            border: OutlineInputBorder(),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _passwordController,
                    obscureText: true,
                    decoration: const InputDecoration(
                      labelText: 'Password',
                      border: OutlineInputBorder(),
                    ),
                    onSubmitted: (_) => _submit(),
                  ),
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      onPressed: _loading ? null : _submit,
                      child: _loading
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Text('Sign In'),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Tip: on the Android emulator, use 10.0.2.2 for your local machine.',
                    style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class MobileShell extends StatefulWidget {
  const MobileShell({super.key, required this.session, required this.onLogout});

  final AppSession session;
  final Future<void> Function() onLogout;

  @override
  State<MobileShell> createState() => _MobileShellState();
}

class _MobileShellState extends State<MobileShell> {
  late final MobileApiClient _api;
  int _index = 0;
  late Future<MobileBundle> _bundleFuture;

  @override
  void initState() {
    super.initState();
    _api = MobileApiClient.fromSession(widget.session);
    _bundleFuture = _api.fetchBundle();
  }

  Future<void> _refresh() async {
    setState(() {
      _bundleFuture = _api.fetchBundle();
    });
    await _bundleFuture;
  }

  Future<void> _openUrl(String url) async {
    final uri = Uri.tryParse(url);
    if (uri == null) return;
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  @override
  Widget build(BuildContext context) {
    final tabs = ['Home', 'Assignments', 'Resources', 'Fees', 'Timetable'];
    return Scaffold(
      appBar: AppBar(
        title: Text(tabs[_index]),
        actions: [
          IconButton(
            tooltip: 'Refresh',
            onPressed: _refresh,
            icon: const Icon(Icons.refresh),
          ),
          PopupMenuButton<String>(
            onSelected: (value) async {
              if (value == 'logout') {
                await widget.onLogout();
              }
            },
            itemBuilder: (context) => [
              PopupMenuItem<String>(
                value: 'profile',
                enabled: false,
                child: Text('${widget.session.userName} · ${widget.session.role}'),
              ),
              const PopupMenuItem<String>(
                value: 'logout',
                child: Text('Logout'),
              ),
            ],
          ),
        ],
      ),
      body: FutureBuilder<MobileBundle>(
        future: _bundleFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return _ErrorState(message: snapshot.error.toString(), onRetry: _refresh);
          }
          final bundle = snapshot.data!;
          return RefreshIndicator(
            onRefresh: _refresh,
            child: IndexedStack(
              index: _index,
              children: [
                _DashboardView(bundle: bundle),
                _AssignmentsView(items: bundle.assignments, onOpenLink: _openUrl),
                _ResourcesView(items: bundle.resources, onOpenLink: _openUrl),
                _FeesView(items: bundle.feeStructures),
                _TimetableView(items: bundle.timetable),
              ],
            ),
          );
        },
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (value) => setState(() => _index = value),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.space_dashboard_outlined), selectedIcon: Icon(Icons.space_dashboard), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.assignment_outlined), selectedIcon: Icon(Icons.assignment), label: 'Assignments'),
          NavigationDestination(icon: Icon(Icons.folder_outlined), selectedIcon: Icon(Icons.folder), label: 'Resources'),
          NavigationDestination(icon: Icon(Icons.payments_outlined), selectedIcon: Icon(Icons.payments), label: 'Fees'),
          NavigationDestination(icon: Icon(Icons.calendar_month_outlined), selectedIcon: Icon(Icons.calendar_month), label: 'Timetable'),
        ],
      ),
    );
  }
}

class _DashboardView extends StatelessWidget {
  const _DashboardView({required this.bundle});

  final MobileBundle bundle;

  @override
  Widget build(BuildContext context) {
    final cards = [
      _MetricCardData('Assignments', '${bundle.assignments.length}', Icons.assignment, Colors.indigo),
      _MetricCardData('Resources', '${bundle.resources.length}', Icons.folder, Colors.teal),
      _MetricCardData('Fee Plans', '${bundle.feeStructures.length}', Icons.payments, Colors.orange),
      _MetricCardData('Periods', '${bundle.timetable.length}', Icons.calendar_month, Colors.pink),
    ];

    return ListView(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.all(16),
      children: [
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: LinearGradient(colors: [Colors.indigo.shade500, Colors.indigo.shade700]),
            borderRadius: BorderRadius.circular(24),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Mobile Command Center', style: TextStyle(color: Colors.white70, fontWeight: FontWeight.w700)),
              const SizedBox(height: 8),
              const Text(
                'Keep school operations and classroom work close at hand.',
                style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w800),
              ),
              const SizedBox(height: 12),
              Text(
                '${bundle.assignments.where((item) => item.status == 'active').length} active assignments · ${bundle.resources.length} shared resources',
                style: const TextStyle(color: Colors.white70),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        GridView.builder(
          shrinkWrap: true,
          itemCount: cards.length,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            childAspectRatio: 1.25,
          ),
          itemBuilder: (context, index) => _MetricCard(data: cards[index]),
        ),
        const SizedBox(height: 16),
        const Text('Upcoming Assignment Deadlines', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
        const SizedBox(height: 12),
        ...bundle.assignments.take(4).map(
          (item) => Card(
            child: ListTile(
              title: Text(item.title),
              subtitle: Text('${item.subject} · ${item.className}'),
              trailing: Text(item.dueDate),
            ),
          ),
        ),
      ],
    );
  }
}

class _AssignmentsView extends StatelessWidget {
  const _AssignmentsView({required this.items, required this.onOpenLink});

  final List<AssignmentItem> items;
  final Future<void> Function(String url) onOpenLink;

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.all(16),
      itemCount: items.length,
      separatorBuilder: (_, _) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final item = items[index];
        return Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    _Pill(text: item.status, color: Colors.indigo),
                    _Pill(text: item.className, color: Colors.teal),
                    _Pill(text: item.subject, color: Colors.grey),
                  ],
                ),
                const SizedBox(height: 12),
                Text(item.title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
                if (item.description.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  Text(item.description),
                ],
                const SizedBox(height: 12),
                Text('Due ${item.dueDate} · ${item.submissionCount} submissions'),
                if (item.resourceUrl != null) ...[
                  const SizedBox(height: 12),
                  OutlinedButton.icon(
                    onPressed: () => onOpenLink(item.resourceUrl!),
                    icon: const Icon(Icons.open_in_new),
                    label: const Text('Open Resource'),
                  ),
                ],
              ],
            ),
          ),
        );
      },
    );
  }
}

class _ResourcesView extends StatelessWidget {
  const _ResourcesView({required this.items, required this.onOpenLink});

  final List<ResourceItem> items;
  final Future<void> Function(String url) onOpenLink;

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.all(16),
      itemCount: items.length,
      separatorBuilder: (_, _) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final item = items[index];
        return Card(
          child: ListTile(
            contentPadding: const EdgeInsets.all(16),
            title: Text(item.title, style: const TextStyle(fontWeight: FontWeight.w800)),
            subtitle: Padding(
              padding: const EdgeInsets.only(top: 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('${item.subject} · ${item.className} · ${item.resourceType}'),
                  if (item.description.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    Text(item.description),
                  ],
                  if (item.assignmentTitle != null) ...[
                    const SizedBox(height: 8),
                    Text('Linked to ${item.assignmentTitle}'),
                  ],
                ],
              ),
            ),
            trailing: IconButton(
              onPressed: () => onOpenLink(item.url),
              icon: const Icon(Icons.open_in_new),
            ),
          ),
        );
      },
    );
  }
}

class _FeesView extends StatelessWidget {
  const _FeesView({required this.items});

  final List<FeeStructureItem> items;

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.all(16),
      itemCount: items.length,
      separatorBuilder: (_, _) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final item = items[index];
        return Card(
          child: ListTile(
            contentPadding: const EdgeInsets.all(16),
            title: Text(item.name, style: const TextStyle(fontWeight: FontWeight.w800)),
            subtitle: Text('${item.className} · Due ${item.dueDate}\n${item.academicYear}'),
            trailing: Text(
              'Rs ${item.amount.toStringAsFixed(0)}',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
            ),
          ),
        );
      },
    );
  }
}

class _TimetableView extends StatelessWidget {
  const _TimetableView({required this.items});

  final List<TimetableItem> items;

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.all(16),
      itemCount: items.length,
      separatorBuilder: (_, _) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final item = items[index];
        return Card(
          child: ListTile(
            contentPadding: const EdgeInsets.all(16),
            leading: CircleAvatar(child: Text(item.day.substring(0, 1))),
            title: Text('${item.subject} · ${item.period}', style: const TextStyle(fontWeight: FontWeight.w800)),
            subtitle: Text('${item.className}\n${item.teacher} · ${item.startTime}-${item.endTime}'),
          ),
        );
      },
    );
  }
}

class _ErrorState extends StatelessWidget {
  const _ErrorState({required this.message, required this.onRetry});

  final String message;
  final Future<void> Function() onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.cloud_off, size: 48),
            const SizedBox(height: 12),
            Text(
              message.replaceFirst('Exception: ', ''),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            FilledButton(onPressed: onRetry, child: const Text('Try Again')),
          ],
        ),
      ),
    );
  }
}

class _Pill extends StatelessWidget {
  const _Pill({required this.text, required this.color});

  final String text;
  final MaterialColor color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: color.shade50,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        text,
        style: TextStyle(color: color.shade700, fontWeight: FontWeight.w700, fontSize: 11),
      ),
    );
  }
}

class _MetricCard extends StatelessWidget {
  const _MetricCard({required this.data});

  final _MetricCardData data;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: data.color.shade50,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(data.icon, color: data.color.shade700),
          const Spacer(),
          Text(data.label, style: TextStyle(color: data.color.shade700, fontWeight: FontWeight.w700)),
          const SizedBox(height: 4),
          Text(data.value, style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w800)),
        ],
      ),
    );
  }
}

class _MetricCardData {
  const _MetricCardData(this.label, this.value, this.icon, this.color);

  final String label;
  final String value;
  final IconData icon;
  final MaterialColor color;
}

class SessionStore {
  static const _key = 'erp_school_mobile_session';

  static Future<void> save(AppSession session) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_key, jsonEncode(session.toJson()));
  }

  static Future<AppSession?> load() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_key);
    if (raw == null || raw.isEmpty) return null;
    return AppSession.fromJson(jsonDecode(raw) as Map<String, dynamic>);
  }

  static Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_key);
  }
}

class MobileApiClient {
  MobileApiClient({
    required String baseUrl,
    required this.tenantSlug,
    this.token,
  }) : baseUrl = _normalizeBaseUrl(baseUrl);

  factory MobileApiClient.fromSession(AppSession session) {
    return MobileApiClient(
      baseUrl: session.baseUrl,
      tenantSlug: session.tenantSlug,
      token: session.accessToken,
    );
  }

  final String baseUrl;
  final String tenantSlug;
  final String? token;

  static String _normalizeBaseUrl(String value) {
    final trimmed = value.trim().replaceAll(RegExp(r'/$'), '');
    return trimmed.endsWith('/api') ? trimmed : '$trimmed/api';
  }

  Future<AppSession> login({required String email, required String password}) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Tenant-Slug': tenantSlug,
      },
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );

    final payload = jsonDecode(response.body) as Map<String, dynamic>;
    if (response.statusCode >= 400) {
      final error = (payload['error'] as Map<String, dynamic>?)?['message']?.toString() ?? 'Login failed';
      throw Exception(error);
    }

    final data = payload['data'] as Map<String, dynamic>;
    final user = data['user'] as Map<String, dynamic>;

    return AppSession(
      baseUrl: baseUrl,
      tenantSlug: tenantSlug,
      accessToken: data['access_token']?.toString() ?? '',
      refreshToken: data['refresh_token']?.toString() ?? '',
      userName: user['name']?.toString() ?? '',
      role: user['role']?.toString() ?? '',
      email: user['email']?.toString() ?? '',
    );
  }

  Future<MobileBundle> fetchBundle() async {
    final results = await Future.wait([
      _getItems('/assignments'),
      _getItems('/assignments/resources'),
      _getItems('/fees/structures'),
      _getItems('/timetable/entries'),
    ]);

    return MobileBundle(
      assignments: results[0].map((item) => AssignmentItem.fromJson(item as Map<String, dynamic>)).toList(),
      resources: results[1].map((item) => ResourceItem.fromJson(item as Map<String, dynamic>)).toList(),
      feeStructures: results[2].map((item) => FeeStructureItem.fromJson(item as Map<String, dynamic>)).toList(),
      timetable: results[3].map((item) => TimetableItem.fromJson(item as Map<String, dynamic>)).toList(),
    );
  }

  Future<List<dynamic>> _getItems(String path) async {
    final response = await http.get(Uri.parse('$baseUrl$path'), headers: _headers());
    final payload = jsonDecode(response.body) as Map<String, dynamic>;
    if (response.statusCode >= 400) {
      final error = (payload['error'] as Map<String, dynamic>?)?['message']?.toString() ?? 'Request failed';
      throw Exception(error);
    }
    final data = payload['data'];
    if (data is Map<String, dynamic>) {
      final items = data['items'];
      if (items is List) return items;
    }
    if (data is List) return data;
    return <dynamic>[];
  }

  Map<String, String> _headers() {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${token ?? ''}',
      'X-Tenant-Slug': tenantSlug,
    };
  }
}

class AppSession {
  const AppSession({
    required this.baseUrl,
    required this.tenantSlug,
    required this.accessToken,
    required this.refreshToken,
    required this.userName,
    required this.role,
    required this.email,
  });

  final String baseUrl;
  final String tenantSlug;
  final String accessToken;
  final String refreshToken;
  final String userName;
  final String role;
  final String email;

  Map<String, dynamic> toJson() => {
        'baseUrl': baseUrl,
        'tenantSlug': tenantSlug,
        'accessToken': accessToken,
        'refreshToken': refreshToken,
        'userName': userName,
        'role': role,
        'email': email,
      };

  factory AppSession.fromJson(Map<String, dynamic> json) {
    return AppSession(
      baseUrl: json['baseUrl']?.toString() ?? '',
      tenantSlug: json['tenantSlug']?.toString() ?? '',
      accessToken: json['accessToken']?.toString() ?? '',
      refreshToken: json['refreshToken']?.toString() ?? '',
      userName: json['userName']?.toString() ?? '',
      role: json['role']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
    );
  }
}

class MobileBundle {
  const MobileBundle({
    required this.assignments,
    required this.resources,
    required this.feeStructures,
    required this.timetable,
  });

  final List<AssignmentItem> assignments;
  final List<ResourceItem> resources;
  final List<FeeStructureItem> feeStructures;
  final List<TimetableItem> timetable;
}

class AssignmentItem {
  const AssignmentItem({
    required this.title,
    required this.description,
    required this.subject,
    required this.className,
    required this.dueDate,
    required this.status,
    required this.submissionCount,
    this.resourceUrl,
  });

  final String title;
  final String description;
  final String subject;
  final String className;
  final String dueDate;
  final String status;
  final int submissionCount;
  final String? resourceUrl;

  factory AssignmentItem.fromJson(Map<String, dynamic> json) {
    return AssignmentItem(
      title: json['title']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      subject: json['subject']?.toString() ?? '',
      className: json['class_name']?.toString() ?? '',
      dueDate: json['due_date']?.toString() ?? '',
      status: json['status']?.toString() ?? '',
      submissionCount: (json['submission_count'] as num?)?.toInt() ?? 0,
      resourceUrl: json['resource_url']?.toString(),
    );
  }
}

class ResourceItem {
  const ResourceItem({
    required this.title,
    required this.description,
    required this.className,
    required this.subject,
    required this.resourceType,
    required this.url,
    this.assignmentTitle,
  });

  final String title;
  final String description;
  final String className;
  final String subject;
  final String resourceType;
  final String url;
  final String? assignmentTitle;

  factory ResourceItem.fromJson(Map<String, dynamic> json) {
    return ResourceItem(
      title: json['title']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      className: json['class_name']?.toString() ?? '',
      subject: json['subject']?.toString() ?? '',
      resourceType: json['resource_type']?.toString() ?? '',
      url: json['url']?.toString() ?? '',
      assignmentTitle: json['assignment_title']?.toString(),
    );
  }
}

class FeeStructureItem {
  const FeeStructureItem({
    required this.name,
    required this.className,
    required this.amount,
    required this.dueDate,
    required this.academicYear,
  });

  final String name;
  final String className;
  final double amount;
  final String dueDate;
  final String academicYear;

  factory FeeStructureItem.fromJson(Map<String, dynamic> json) {
    return FeeStructureItem(
      name: json['name']?.toString() ?? '',
      className: json['class_name']?.toString() ?? '',
      amount: (json['amount'] as num?)?.toDouble() ?? 0,
      dueDate: json['due_date']?.toString() ?? '',
      academicYear: json['academic_year']?.toString() ?? '',
    );
  }
}

class TimetableItem {
  const TimetableItem({
    required this.className,
    required this.day,
    required this.period,
    required this.subject,
    required this.teacher,
    required this.startTime,
    required this.endTime,
  });

  final String className;
  final String day;
  final String period;
  final String subject;
  final String teacher;
  final String startTime;
  final String endTime;

  factory TimetableItem.fromJson(Map<String, dynamic> json) {
    return TimetableItem(
      className: json['class_name']?.toString() ?? '',
      day: json['day']?.toString() ?? '',
      period: json['period']?.toString() ?? '',
      subject: json['subject']?.toString() ?? '',
      teacher: json['teacher']?.toString() ?? '',
      startTime: json['start_time']?.toString() ?? '',
      endTime: json['end_time']?.toString() ?? '',
    );
  }
}

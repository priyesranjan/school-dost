import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/config/app_config.dart';
import '../../core/permissions/app_permissions.dart';
import '../../core/security/session_manager.dart';
import 'data/auth_repository.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _baseUrlController = TextEditingController(
    text: AppConfig.current.apiBaseUrl,
  );
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _loading = false;

  @override
  void dispose() {
    _baseUrlController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _loginWithPassword() async {
    setState(() => _loading = true);
    try {
      final repo = AuthRepository();
      final session = await repo.login(
        baseUrl: _baseUrlController.text.trim(),
        email: _emailController.text.trim(),
        password: _passwordController.text,
      );
      await ref.read(sessionProvider.notifier).login(session);
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(error.toString())));
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  Future<void> _loginDemo(String role) async {
    final session = AppSession(
      baseUrl: _baseUrlController.text.trim(),
      tenantId: role == 'superadmin' ? '' : 'demo-school',
      tenantSlug: role == 'superadmin' ? '' : 'demo-school',
      accessToken: 'demo',
      refreshToken: 'demo',
      userName: 'Demo ${_roleLabel(role)}',
      role: role,
      email: '$role@school',
      permissions: rolePermissions[role] ?? const [],
      offlineDemo: true,
    );
    await ref.read(sessionProvider.notifier).login(session);
  }

  String _roleLabel(String role) {
    return role
        .split('_')
        .map(
          (part) => part.isEmpty
              ? part
              : '${part[0].toUpperCase()}${part.substring(1)}',
        )
        .join(' ');
  }

  @override
  Widget build(BuildContext context) {
    const demoRoles = [
      'superadmin',
      'principal',
      'admin',
      'hod',
      'teacher',
      'accountant',
      'receptionist',
      'parent',
      'student',
    ];

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Teachmint++',
                  style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Text(
                  'Login with user ID and password. School is detected automatically.',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).hintColor,
                  ),
                ),
                const SizedBox(height: 24),
                TextField(
                  controller: _baseUrlController,
                  decoration: const InputDecoration(
                    labelText: 'API Base URL',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _emailController,
                  decoration: const InputDecoration(
                    labelText: 'User ID / Email',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _passwordController,
                  obscureText: true,
                  decoration: const InputDecoration(
                    labelText: 'Password',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 24),
                FilledButton(
                  onPressed: _loading ? null : _loginWithPassword,
                  child: _loading
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('Sign In'),
                ),
                const SizedBox(height: 24),
                const Text(
                  'All Roles Demo Login:',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 12,
                  runSpacing: 8,
                  children: demoRoles
                      .map(
                        (role) => OutlinedButton(
                          onPressed: () => _loginDemo(role),
                          child: Text(_roleLabel(role)),
                        ),
                      )
                      .toList(),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

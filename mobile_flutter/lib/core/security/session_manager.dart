import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../constants/storage_keys.dart';
import '../storage/secure_storage_service.dart';

class AppSession {
  final String baseUrl;
  final String tenantId;
  final String tenantSlug;
  final String accessToken;
  final String refreshToken;
  final String userName;
  final String role;
  final String email;
  final List<String> permissions;
  final bool offlineDemo;

  const AppSession({
    required this.baseUrl,
    required this.tenantId,
    required this.tenantSlug,
    required this.accessToken,
    required this.refreshToken,
    required this.userName,
    required this.role,
    required this.email,
    required this.permissions,
    required this.offlineDemo,
  });

  Map<String, dynamic> toJson() => {
    'baseUrl': baseUrl,
    'tenantId': tenantId,
    'tenantSlug': tenantSlug,
    'accessToken': accessToken,
    'refreshToken': refreshToken,
    'userName': userName,
    'role': role,
    'email': email,
    'permissions': permissions,
    'offlineDemo': offlineDemo,
  };

  factory AppSession.fromJson(Map<String, dynamic> json) {
    final rawPermissions = json['permissions'];
    return AppSession(
      baseUrl: json['baseUrl']?.toString() ?? '',
      tenantId:
          json['tenantId']?.toString() ?? json['tenant_id']?.toString() ?? '',
      tenantSlug: json['tenantSlug']?.toString() ?? '',
      accessToken: json['accessToken']?.toString() ?? '',
      refreshToken: json['refreshToken']?.toString() ?? '',
      userName: json['userName']?.toString() ?? '',
      role: json['role']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      permissions: rawPermissions is List
          ? rawPermissions.map((item) => item.toString()).toList()
          : const [],
      offlineDemo: json['offlineDemo'] as bool? ?? false,
    );
  }
}

final secureStorageProvider = Provider((ref) => const FlutterSecureStorage());

final secureStorageServiceProvider = Provider(
  (ref) => SecureStorageService(ref.watch(secureStorageProvider)),
);

class SessionNotifier extends AsyncNotifier<AppSession?> {
  SecureStorageService get _storage => ref.read(secureStorageServiceProvider);

  @override
  Future<AppSession?> build() async {
    try {
      final raw = await _storage.read(StorageKeys.session);
      if (raw == null || raw.isEmpty) {
        return null;
      }
      return AppSession.fromJson(jsonDecode(raw));
    } catch (_) {
      return null;
    }
  }

  Future<void> login(AppSession session) async {
    state = const AsyncValue.loading();
    await _storage.write(StorageKeys.session, jsonEncode(session.toJson()));
    await _storage.write(StorageKeys.accessToken, session.accessToken);
    await _storage.write(StorageKeys.refreshToken, session.refreshToken);
    await _storage.write(StorageKeys.tenantId, session.tenantId);
    if (session.tenantSlug.isNotEmpty) {
      await _storage.write(StorageKeys.tenantSlug, session.tenantSlug);
    } else {
      await _storage.delete(StorageKeys.tenantSlug);
    }
    await _storage.write(StorageKeys.baseUrl, session.baseUrl);
    state = AsyncValue.data(session);
  }

  Future<void> logout() async {
    state = const AsyncValue.loading();
    await _storage.delete(StorageKeys.session);
    await _storage.delete(StorageKeys.accessToken);
    await _storage.delete(StorageKeys.refreshToken);
    await _storage.delete(StorageKeys.tenantId);
    await _storage.delete(StorageKeys.tenantSlug);
    await _storage.delete(StorageKeys.baseUrl);
    state = const AsyncValue.data(null);
  }
}

final sessionProvider = AsyncNotifierProvider<SessionNotifier, AppSession?>(
  SessionNotifier.new,
);

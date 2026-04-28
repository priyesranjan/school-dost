import 'package:dio/dio.dart';
import '../../../core/security/session_manager.dart';

class AuthRepository {
  String _normalizeBaseUrl(String value) {
    final trimmed = value.trim().replaceAll(RegExp(r'/$'), '');
    return trimmed.endsWith('/api') ? trimmed : '$trimmed/api';
  }

  Future<AppSession> login({
    required String baseUrl,
    required String email,
    required String password,
  }) async {
    final dio = Dio(
      BaseOptions(
        baseUrl: _normalizeBaseUrl(baseUrl),
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    try {
      final response = await dio.post(
        '/auth/login',
        data: {'email': email, 'password': password},
      );

      final payload = response.data as Map<String, dynamic>;
      final data = payload['data'] as Map<String, dynamic>;
      final user = data['user'] as Map<String, dynamic>;
      final rawPermissions = user['permissions'] ?? data['permissions'];

      return AppSession(
        baseUrl: _normalizeBaseUrl(baseUrl),
        tenantId: user['tenant_id']?.toString() ?? '',
        tenantSlug: user['tenant_slug']?.toString() ?? '',
        accessToken: data['access_token']?.toString() ?? '',
        refreshToken: data['refresh_token']?.toString() ?? '',
        userName: user['name']?.toString() ?? '',
        role: user['role']?.toString() ?? '',
        email: user['email']?.toString() ?? email,
        permissions: rawPermissions is List
            ? rawPermissions.map((item) => item.toString()).toList()
            : const [],
        offlineDemo: false,
      );
    } on DioException catch (error) {
      final payload = error.response?.data;
      if (payload is Map<String, dynamic>) {
        final message = (payload['error'] as Map<String, dynamic>?)?['message']
            ?.toString();
        if (message != null && message.isNotEmpty) {
          throw Exception(message);
        }
      }
      throw Exception('Login failed. Please check your user ID and password.');
    }
  }
}

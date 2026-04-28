import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../config/app_config.dart';
import '../constants/storage_keys.dart';
import '../error/app_exception.dart';
import '../security/device_identity_service.dart';
import '../security/session_manager.dart';
import '../storage/secure_storage_service.dart';

final apiClientProvider = Provider<ApiClient>((ref) {
  final storage = ref.watch(secureStorageServiceProvider);
  return ApiClient(
    secureStorage: storage,
    deviceIdentityService: DeviceIdentityService(storage),
  );
});

class ApiClient {
  final Dio dio;
  final SecureStorageService secureStorage;
  final DeviceIdentityService deviceIdentityService;
  bool _isRefreshing = false;

  ApiClient({
    required this.secureStorage,
    required this.deviceIdentityService,
    String? baseUrl,
  }) : dio = Dio(
         BaseOptions(
           baseUrl: baseUrl ?? AppConfig.current.apiBaseUrl,
           connectTimeout: const Duration(seconds: 15),
           receiveTimeout: const Duration(seconds: 15),
           headers: {
             'Content-Type': 'application/json',
             'Accept': 'application/json',
           },
         ),
       ) {
    _initializeInterceptors();
  }

  void _initializeInterceptors() {
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await secureStorage.read(StorageKeys.accessToken);
          final tenantId = await secureStorage.read(StorageKeys.tenantId);
          final tenantSlug = await secureStorage.read(StorageKeys.tenantSlug);
          final deviceId = await deviceIdentityService.getOrCreateDeviceId();

          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          if (tenantId != null && tenantId.isNotEmpty) {
            options.headers['X-Tenant-ID'] = tenantId;
          }
          if (tenantSlug != null && tenantSlug.isNotEmpty) {
            options.headers['X-Tenant-Slug'] = tenantSlug;
          }
          if (deviceId.isNotEmpty) {
            options.headers['X-Device-ID'] = deviceId;
          }

          return handler.next(options);
        },
        onError: (DioException e, handler) async {
          final shouldRefresh =
              e.response?.statusCode == 401 &&
              e.requestOptions.path != '/auth/refresh' &&
              e.requestOptions.extra['retried'] != true;

          if (shouldRefresh && await _refreshToken()) {
            final retryOptions = e.requestOptions;
            retryOptions.extra['retried'] = true;
            final token = await secureStorage.read(StorageKeys.accessToken);
            if (token != null && token.isNotEmpty) {
              retryOptions.headers['Authorization'] = 'Bearer $token';
            }
            try {
              final response = await dio.fetch<dynamic>(retryOptions);
              return handler.resolve(response);
            } on DioException catch (retryError) {
              return handler.reject(retryError);
            }
          }

          return handler.next(e);
        },
      ),
    );
  }

  Future<bool> _refreshToken() async {
    if (_isRefreshing) return false;
    _isRefreshing = true;
    try {
      final refreshToken = await secureStorage.read(StorageKeys.refreshToken);
      if (refreshToken == null || refreshToken.isEmpty) {
        return false;
      }

      final response = await Dio(dio.options).post<Map<String, dynamic>>(
        '/auth/refresh',
        data: {'refresh_token': refreshToken},
      );
      final data = response.data?['data'];
      if (data is! Map<String, dynamic>) return false;

      final accessToken = data['access_token']?.toString();
      final rotatedRefreshToken = data['refresh_token']?.toString();
      if (accessToken == null || accessToken.isEmpty) return false;

      await secureStorage.write(StorageKeys.accessToken, accessToken);
      if (rotatedRefreshToken != null && rotatedRefreshToken.isNotEmpty) {
        await secureStorage.write(
          StorageKeys.refreshToken,
          rotatedRefreshToken,
        );
      }
      return true;
    } finally {
      _isRefreshing = false;
    }
  }

  AppException mapDioError(DioException error) {
    final payload = error.response?.data;
    if (payload is Map<String, dynamic>) {
      final errorBody = payload['error'];
      if (errorBody is Map<String, dynamic>) {
        return NetworkException(
          errorBody['message']?.toString() ?? 'Request failed',
          code: errorBody['code']?.toString(),
          statusCode: error.response?.statusCode,
        );
      }
    }

    return NetworkException(
      error.message ?? 'Network request failed',
      statusCode: error.response?.statusCode,
    );
  }
}

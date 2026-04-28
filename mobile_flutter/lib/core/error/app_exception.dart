class AppException implements Exception {
  const AppException(this.message, {this.code, this.statusCode});

  final String message;
  final String? code;
  final int? statusCode;

  @override
  String toString() => message;
}

class NetworkException extends AppException {
  const NetworkException(super.message, {super.code, super.statusCode});
}

class AuthException extends AppException {
  const AuthException(super.message, {super.code, super.statusCode});
}

class PermissionDeniedException extends AppException {
  const PermissionDeniedException(super.message, {super.code});
}

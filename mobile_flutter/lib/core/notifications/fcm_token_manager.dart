import '../constants/storage_keys.dart';
import '../storage/secure_storage_service.dart';

class FcmTokenManager {
  const FcmTokenManager(this._storage);

  final SecureStorageService _storage;

  Future<void> persistToken(String token) {
    return _storage.write(StorageKeys.fcmToken, token);
  }

  Future<String?> currentToken() => _storage.read(StorageKeys.fcmToken);
}

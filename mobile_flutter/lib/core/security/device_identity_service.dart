import 'dart:math';

import '../constants/storage_keys.dart';
import '../storage/secure_storage_service.dart';

class DeviceIdentityService {
  const DeviceIdentityService(this._storage);

  final SecureStorageService _storage;

  Future<String> getOrCreateDeviceId() async {
    final existing = await _storage.read(StorageKeys.deviceId);
    if (existing != null && existing.isNotEmpty) {
      return existing;
    }

    final random = Random.secure();
    final bytes = List<int>.generate(16, (_) => random.nextInt(256));
    final id = bytes
        .map((byte) => byte.toRadixString(16).padLeft(2, '0'))
        .join();
    final deviceId = 'device_$id';
    await _storage.write(StorageKeys.deviceId, deviceId);
    return deviceId;
  }
}

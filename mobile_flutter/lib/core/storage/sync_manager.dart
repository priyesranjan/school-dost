import '../network/api_client.dart';
import 'connectivity_watcher.dart';
import 'offline_queue_service.dart';

class SyncManager {
  const SyncManager({
    required OfflineQueueService queue,
    required ConnectivityWatcher connectivity,
    required ApiClient apiClient,
  }) : _queue = queue,
       _connectivity = connectivity,
       _apiClient = apiClient;

  final OfflineQueueService _queue;
  final ConnectivityWatcher _connectivity;
  final ApiClient _apiClient;

  Future<int> syncPending() async {
    if (!await _connectivity.isOnline) return 0;
    final pendingItems = await _queue.pending();
    var synced = 0;

    for (final item in pendingItems) {
      await _send(item);
      await _queue.remove(item.id);
      synced += 1;
    }

    return synced;
  }

  Future<void> _send(OfflineQueueItem item) {
    switch (item.method) {
      case OfflineRequestMethod.get:
        return _apiClient.dio.get<dynamic>(item.path).then((_) {});
      case OfflineRequestMethod.post:
        return _apiClient.dio
            .post<dynamic>(item.path, data: item.payload)
            .then((_) {});
      case OfflineRequestMethod.put:
        return _apiClient.dio
            .put<dynamic>(item.path, data: item.payload)
            .then((_) {});
      case OfflineRequestMethod.patch:
        return _apiClient.dio
            .patch<dynamic>(item.path, data: item.payload)
            .then((_) {});
      case OfflineRequestMethod.delete:
        return _apiClient.dio
            .delete<dynamic>(item.path, data: item.payload)
            .then((_) {});
    }
  }
}

enum OfflineRequestMethod { get, post, put, patch, delete }

class OfflineQueueItem {
  const OfflineQueueItem({
    required this.id,
    required this.method,
    required this.path,
    required this.payload,
    required this.createdAt,
    this.tenantId,
  });

  final String id;
  final OfflineRequestMethod method;
  final String path;
  final Map<String, dynamic> payload;
  final DateTime createdAt;
  final String? tenantId;
}

class OfflineQueueService {
  final List<OfflineQueueItem> _items = [];

  Future<void> enqueue(OfflineQueueItem item) async {
    _items.add(item);
  }

  Future<List<OfflineQueueItem>> pending() async {
    return List.unmodifiable(_items);
  }

  Future<void> remove(String id) async {
    _items.removeWhere((item) => item.id == id);
  }
}

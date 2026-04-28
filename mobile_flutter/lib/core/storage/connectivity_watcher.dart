import 'dart:async';

class ConnectivityWatcher {
  final _controller = StreamController<bool>.broadcast();

  Stream<bool> get onlineChanges => _controller.stream;

  Future<bool> get isOnline async => true;

  void setOnlineForTest(bool value) {
    _controller.add(value);
  }

  Future<void> dispose() async {
    await _controller.close();
  }
}

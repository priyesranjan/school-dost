enum ConflictResolution { keepLocal, keepRemote, merge }

class ConflictResolver {
  const ConflictResolver();

  ConflictResolution resolve({
    required DateTime localUpdatedAt,
    required DateTime remoteUpdatedAt,
  }) {
    if (localUpdatedAt.isAfter(remoteUpdatedAt)) {
      return ConflictResolution.keepLocal;
    }
    return ConflictResolution.keepRemote;
  }
}

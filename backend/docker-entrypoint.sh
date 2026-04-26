#!/bin/sh
set -eu

echo "[backend] Running Prisma migrations..."
npx prisma migrate deploy

if [ "${INIT_PLATFORM_ON_BOOT:-false}" = "true" ]; then
  echo "[backend] Initializing platform metadata..."
  node dist/scripts/initPlatformDev.js
fi

echo "[backend] Starting server..."
exec node dist/server.js

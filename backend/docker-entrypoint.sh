#!/bin/sh
set -eu

echo "[backend] Running Prisma migrations..."
npx prisma migrate deploy

echo "[backend] Starting server..."
exec node dist/server.js

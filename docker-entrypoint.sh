#!/bin/sh
set -e

echo "Waiting for database to be ready..."
retries=0
max_retries=30
until pnpm db:migrate; do
  retries=$((retries + 1))
  if [ "$retries" -ge "$max_retries" ]; then
    echo "Could not run migrations after $max_retries attempts. Exiting."
    exit 1
  fi
  echo "Database not ready (attempt $retries/$max_retries), retrying in 3s..."
  sleep 3
done

echo "Migrations complete. Starting application..."
exec pnpm start

#!/bin/sh

echo "⏳ Waiting for PostgreSQL at $DB_HOST:5432..."

while ! nc -z "$DB_HOST" 5432; do
  sleep 1
done

echo "✅ PostgreSQL is up - starting app"

exec "$@"

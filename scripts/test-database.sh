#!/usr/bin/env bash
set -euo pipefail
: "${TEST_DATABASE_URL:?Provide a disposable local PostgreSQL TEST_DATABASE_URL}"
node -e 'const u = new URL(process.env.TEST_DATABASE_URL); if (!["127.0.0.1", "localhost", "[::1]"].includes(u.hostname)) throw new Error("Database tests only run against localhost");'
existing=$(psql "$TEST_DATABASE_URL" -XAtqc "select count(*) from pg_tables where schemaname in ('public','auth','storage')")
if [ "$existing" != "0" ]; then
  echo "Refusing to run migrations against a nonempty database." >&2
  exit 1
fi
psql "$TEST_DATABASE_URL" -Xq -v ON_ERROR_STOP=1 -f tests/sql/bootstrap.sql
for migration in supabase/migrations/*.sql; do
  psql "$TEST_DATABASE_URL" -Xq -v ON_ERROR_STOP=1 -f "$migration"
done
psql "$TEST_DATABASE_URL" -Xq -v ON_ERROR_STOP=1 -f tests/sql/security.sql

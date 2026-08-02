#!/usr/bin/env bash
# Pruebas de seguridad de la base de datos (whitelist + RLS + sellado).
# Levanta un Postgres efímero, aplica el stub de auth + las migraciones
# reales y corre supabase/tests/99_rls_tests.sql. Requiere postgresql 16.
set -euo pipefail

PG_BIN="$(ls -d /usr/lib/postgresql/*/bin 2>/dev/null | sort -V | tail -1)"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORK="$(mktemp -d)"
PORT=54329

cleanup() {
  "$PG_BIN/pg_ctl" -D "$WORK/data" stop -m immediate >/dev/null 2>&1 || true
  rm -rf "$WORK"
}
trap cleanup EXIT

echo "→ Iniciando Postgres efímero…"
"$PG_BIN/initdb" -D "$WORK/data" -U postgres --auth=trust >/dev/null
"$PG_BIN/pg_ctl" -D "$WORK/data" -o "-p $PORT -k $WORK -c listen_addresses=''" \
  -l "$WORK/pg.log" start >/dev/null

PSQL=("$PG_BIN/psql" -v ON_ERROR_STOP=1 -h "$WORK" -p "$PORT" -U postgres -d postgres -q)

echo "→ Stub de auth (simula Supabase)…"
"${PSQL[@]}" -f "$ROOT/supabase/tests/00_stub_auth.sql"

echo "→ Aplicando migraciones reales…"
for f in "$ROOT"/supabase/migrations/*.sql; do
  echo "   · $(basename "$f")"
  "${PSQL[@]}" -f "$f"
done

echo "→ Corriendo pruebas de seguridad…"
"${PSQL[@]}" -f "$ROOT/supabase/tests/99_rls_tests.sql"

echo "✔ Base de datos verificada: whitelist, RLS y sellado funcionan."

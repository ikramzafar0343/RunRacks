#!/bin/bash
set -euo pipefail

DATA="${PGDATA:-/var/lib/postgresql/data}"
PRIMARY_HOST="${PRIMARY_HOST:-postgres}"
PRIMARY_PORT="${PRIMARY_PORT:-5432}"

until pg_isready -h "$PRIMARY_HOST" -p "$PRIMARY_PORT" -U "${POSTGRES_USER:-runracks_admin}"; do
  echo "waiting for primary $PRIMARY_HOST"
  sleep 2
done

if [ ! -s "$DATA/PG_VERSION" ]; then
  echo "running basebackup from primary"
  rm -rf "$DATA"/*
  PGPASSWORD=replicator_dev pg_basebackup \
    -h "$PRIMARY_HOST" \
    -p "$PRIMARY_PORT" \
    -U replicator \
    -D "$DATA" \
    -Fp -Xs -P -R
  chmod 700 "$DATA"
fi

exec docker-entrypoint.sh postgres \
  -c hot_standby=on \
  -c primary_conninfo="host=${PRIMARY_HOST} port=${PRIMARY_PORT} user=replicator password=replicator_dev"

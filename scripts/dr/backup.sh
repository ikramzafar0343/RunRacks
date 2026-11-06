#!/usr/bin/env bash
# Archive a logical dump + note WAL archive path. Not a fake success claim.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT_DIR="${DR_OUT_DIR:-$ROOT/ops/evidence/backups}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$OUT_DIR"

PRIMARY_URL="${DATABASE_URL:-postgresql://runracks_admin:runracks_admin_dev@127.0.0.1:5432/runracks}"
DUMP="$OUT_DIR/runracks-$STAMP.sql.gz"

echo "dumping $PRIMARY_URL -> $DUMP"
pg_dump "$PRIMARY_URL" | gzip > "$DUMP"

cat > "$OUT_DIR/last-backup.json" <<EOF
{
  "createdAt": "$STAMP",
  "dumpPath": "$DUMP",
  "walArchiveHint": "Backend docker volume runracks_wal",
  "note": "Logical dump plus WAL archive volume; restore drill measures RPO/RTO"
}
EOF
echo "backup ok: $DUMP"

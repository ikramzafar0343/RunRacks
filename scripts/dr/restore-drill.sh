#!/usr/bin/env bash
# Restore last dump into a throwaway Postgres container; record measured RTO.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
EVIDENCE="$ROOT/ops/evidence"
BACKUP_META="$EVIDENCE/backups/last-backup.json"
mkdir -p "$EVIDENCE"

if [[ ! -f "$BACKUP_META" ]]; then
  echo "No backup metadata. Run scripts/dr/backup.sh first." >&2
  exit 1
fi

DUMP="$(node -e "console.log(JSON.parse(require('fs').readFileSync(process.argv[1],'utf8')).dumpPath)" "$BACKUP_META")"
if [[ ! -f "$DUMP" ]]; then
  echo "Dump missing: $DUMP" >&2
  exit 1
fi

START="$(date +%s)"
NAME="runracks-dr-drill-$$"
docker rm -f "$NAME" >/dev/null 2>&1 || true
docker run -d --name "$NAME" \
  -e POSTGRES_PASSWORD=drill \
  -e POSTGRES_USER=drill \
  -e POSTGRES_DB=runracks \
  -p 55432:5432 \
  postgres:16-alpine >/dev/null

for i in $(seq 1 60); do
  if docker exec "$NAME" pg_isready -U drill -d runracks >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

gunzip -c "$DUMP" | docker exec -i "$NAME" psql -U drill -d runracks >/dev/null
END="$(date +%s)"
ELAPSED=$((END - START))
RECOVERED_TO="$(node -e "console.log(JSON.parse(require('fs').readFileSync(process.argv[1],'utf8')).createdAt)" "$BACKUP_META")"

cat > "$EVIDENCE/dr-last-drill.json" <<EOF
{
  "ranAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "elapsedSeconds": $ELAPSED,
  "recoveredToBackupStamp": "$RECOVERED_TO",
  "method": "pg_dump restore into ephemeral container",
  "rpoNote": "RPO is the age of the dump/WAL used; not a hardcoded SLA",
  "rtoNote": "RTO is elapsedSeconds from this drill only"
}
EOF

docker rm -f "$NAME" >/dev/null
echo "restore drill ok in ${ELAPSED}s → $EVIDENCE/dr-last-drill.json"

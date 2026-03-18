#!/usr/bin/env bash
# Nightly PostgreSQL backup → S3-compatible storage
#
# Exports all alert data from PostgreSQL as CSV, compresses it, and syncs to
# an S3-compatible bucket (e.g. AWS S3, Wasabi, MinIO).
#
# Usage:  ./nightly-backup.sh
# Cron:   0 3 * * * /path/to/nightly-backup.sh >> /var/log/geodash-backup.log 2>&1

set -euo pipefail

BACKUP_DIR="/tmp/geodash-backup"
DATE=$(date +%Y-%m-%d)
CONTAINER="geodash-postgres"
S3_BUCKET="${BACKUP_S3_BUCKET:?Set BACKUP_S3_BUCKET environment variable (e.g. s3://my-backup-bucket)}"
AWS_PROFILE="${BACKUP_AWS_PROFILE:-default}"

echo "[$(date -Iseconds)] Starting nightly backup..."

rm -rf "$BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# Export alert events
docker exec "$CONTAINER" psql -U geodash -d geodash \
  -c "COPY (SELECT * FROM alerts WHERE ts > now() - INTERVAL '30 days' ORDER BY ts DESC) TO STDOUT WITH CSV HEADER" \
  > "$BACKUP_DIR/alerts-${DATE}.csv"

# Export snapshots
docker exec "$CONTAINER" psql -U geodash -d geodash \
  -c "COPY (SELECT * FROM snapshots WHERE ts > now() - INTERVAL '30 days' ORDER BY ts DESC) TO STDOUT WITH CSV HEADER" \
  > "$BACKUP_DIR/snapshots-${DATE}.csv"

# Full pg_dump for disaster recovery
docker exec "$CONTAINER" pg_dump -U geodash -d geodash --clean --if-exists \
  > "$BACKUP_DIR/geodash-full-${DATE}.sql"

# Compress
cd "$BACKUP_DIR"
tar czf "geodash-backup-${DATE}.tar.gz" *.csv *.sql

# Upload to S3-compatible storage
aws s3 cp "geodash-backup-${DATE}.tar.gz" \
  "${S3_BUCKET}/backups/geodash-backup-${DATE}.tar.gz" \
  --profile "$AWS_PROFILE"

# Cleanup
rm -rf "$BACKUP_DIR"

echo "[$(date -Iseconds)] Backup complete: geodash-backup-${DATE}.tar.gz uploaded"

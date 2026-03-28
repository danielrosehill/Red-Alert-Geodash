#!/usr/bin/env bash
# Nightly InfluxDB backup → S3-compatible storage
#
# Exports all alert data from InfluxDB as CSV, compresses it, and syncs to
# an S3-compatible bucket (e.g. AWS S3, Wasabi, MinIO).
#
# Usage:  ./nightly-backup.sh
# Cron:   0 3 * * * /path/to/nightly-backup.sh >> /var/log/geodash-backup.log 2>&1

set -euo pipefail

BACKUP_DIR="/tmp/geodash-backup"
DATE=$(date +%Y-%m-%d)
CONTAINER="${INFLUXDB_CONTAINER:-geodash-influxdb}"
BUCKET="${INFLUX_BUCKET:-redalerts}"
ORG="${INFLUX_ORG:-geodash}"
TOKEN="${INFLUX_TOKEN:-geodash-dev-token}"
S3_BUCKET="${BACKUP_S3_BUCKET:?Set BACKUP_S3_BUCKET environment variable (e.g. s3://my-backup-bucket)}"
AWS_PROFILE="${BACKUP_AWS_PROFILE:-default}"

echo "[$(date -Iseconds)] Starting nightly backup..."

rm -rf "$BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# Export alert events
docker exec "$CONTAINER" influx query \
  "from(bucket:\"$BUCKET\") |> range(start: -30d) |> filter(fn: (r) => r._measurement == \"alert\")" \
  --org "$ORG" --token "$TOKEN" --raw \
  > "$BACKUP_DIR/alerts-${DATE}.csv"

# Export snapshots
docker exec "$CONTAINER" influx query \
  "from(bucket:\"$BUCKET\") |> range(start: -30d) |> filter(fn: (r) => r._measurement == \"snapshot\")" \
  --org "$ORG" --token "$TOKEN" --raw \
  > "$BACKUP_DIR/snapshots-${DATE}.csv"

# Compress
cd "$BACKUP_DIR"
tar czf "geodash-backup-${DATE}.tar.gz" *.csv

# Upload to S3-compatible storage
aws s3 cp "geodash-backup-${DATE}.tar.gz" \
  "${S3_BUCKET}/backups/geodash-backup-${DATE}.tar.gz" \
  --profile "$AWS_PROFILE"

# Cleanup
rm -rf "$BACKUP_DIR"

echo "[$(date -Iseconds)] Backup complete: geodash-backup-${DATE}.tar.gz uploaded"

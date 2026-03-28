#!/usr/bin/env bash
# Start Red Alert Geodash dashboard via Docker Compose
set -e
cd "$(dirname "$0")"

echo "Starting Red Alert Geodash..."
echo "  Dashboard: http://localhost:${GEODASH_PORT:-8083}"
echo "  InfluxDB:  http://localhost:${INFLUXDB_PORT:-8086}"
echo ""

docker compose up --build -d

echo ""
echo "Running. View logs with: docker compose logs -f geodash"

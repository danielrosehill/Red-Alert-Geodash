# Red Alert Geodash — User Guide

Real-time dashboard for Israel's Pikud HaOref (Homefront Command) rocket and situation alerts, displayed on interactive maps with polygon overlays.

## Accessing the Dashboard

| Page | URL | Description |
|------|-----|-------------|
| Live Dashboard | `/` or `/dashboard` | Main view with multiple map panels (country, regional, city detail) |
| History | `/history` | Historical alert timeline with playback scrubber |
| News | `/news` | Aggregated news feed from Times of Israel and JNS |
| TV Mode | `/tv` | Single full-screen map optimised for TV displays (Samsung Tizen compatible) |
| Alerts + News | `/alerts-news` | Combined alert log and news feed |
| Settings | `/settings` | Configure monitoring area and notification preferences |

After starting with `docker compose up --build -d`, the dashboard is available at `http://localhost:8083`.

## Live Dashboard

The main dashboard shows multiple map panels, each centred on a different region. When alerts come in:

- **Red polygons** appear over affected areas for active threats (rockets, UAVs, infiltration)
- **Orange polygons** indicate pre-warnings
- **Green polygons** flash briefly when an all-clear is issued, then fade after 60 seconds
- **Local alerts** for the configured area (default: Jerusalem South) trigger an audio alarm and visual flash

The dashboard polls the backend every 3 seconds for new alerts.

### Alert Colour Key

| Colour | Meaning |
|--------|---------|
| Red | Active threat — rockets, missiles, UAVs, infiltration, earthquakes, hazmat, terror |
| Orange | Pre-warning — alerts expected soon |
| Green | All clear — event has ended |

## History Page

The history page shows a timeline of all alerts recorded during the current day. Use the playback scrubber at the bottom to step through alert snapshots over time. Each snapshot shows exactly which areas were under alert at that moment.

Data is pulled from InfluxDB, which stores both individual alert events and full payload snapshots.

## News Page

Displays the latest articles from:
- Times of Israel
- JNS (Jewish News Syndicate)

Articles are fetched server-side and sorted by publication date.

## TV Mode

A single full-screen map view designed for always-on displays. Shows the country-wide map with alert polygons. No navigation chrome — just the map and alerts.

Compatible with Samsung Tizen TV browsers and similar embedded web views.

## Data & Backups

Alert data is stored in InfluxDB with unlimited retention. A sample backup script is provided in `scripts/nightly-backup.sh` that exports data and uploads to S3-compatible storage.

See [Data Structure](data-structure.md) for technical details on the schema and backup format.

## API Endpoints

All endpoints return JSON.

| Endpoint | Description |
|----------|-------------|
| `GET /api/alerts` | Current active alerts (from in-memory cache, updated every 3s) |
| `GET /api/alerts/enriched` | Alerts with calculated fields (% active, time since last, monitored areas) |
| `GET /api/history` | Today's full alert history from Oref (cached 15s) |
| `GET /api/polygons` | Area polygon coordinates for map overlays |
| `GET /api/alert-log?minutes=60&area=...` | Query stored alert events from InfluxDB |
| `GET /api/alert-snapshots?minutes=30` | Query stored snapshots for timeline playback |
| `GET /api/alert-log/stats` | Stats with enriched fields (time since last alert, % areas active) |
| `GET /api/monitored-areas` | Status of configured monitored areas (Jerusalem, Tel Aviv, etc.) |
| `GET /api/format-samples` | List daily Oref API format captures |
| `GET /api/format-samples/{date}` | View a specific day's raw API capture |
| `GET /api/news` | Aggregated news feed |
| `GET /api/health` | Health check |

## Deployment

The dashboard runs as two Docker containers:

| Container | Purpose | Port |
|-----------|---------|------|
| `geodash-app` | FastAPI backend + static frontend | 8083 (host) → 8765 (container) |
| `geodash-influxdb` | InfluxDB time-series database | 8086 |

To redeploy after changes:

```bash
docker compose up --build -d
```

## Troubleshooting

**No alerts showing**: Check that the backend container is running (`docker ps`) and look at logs (`docker logs geodash-app --tail 50`). The Oref API is geo-restricted to Israel — the server must have an Israeli IP.

**Poller errors in logs**: The Oref API occasionally returns unexpected formats. The backend handles both array and single-object responses. If you see persistent errors, check the raw API response.

**InfluxDB not recording**: Verify the InfluxDB container is running and check that your `INFLUX_TOKEN` environment variable matches what was set during InfluxDB initialisation.

# Red Alert Geodash

Real-time dashboard for Israel's Homefront Command (Pikud HaOref) rocket and situation alerts, displayed on interactive maps with polygon overlays covering 1,450 alert areas.

> **This application only works when hosted from an Israeli IP address.** The Oref alert API is geo-restricted to Israel. The backend must run from an Israeli server or through a proxy with an Israeli exit node.

## Disclaimer

**This is not an official Home Front Command (Pikud HaOref) resource.**

Do not rely on this dashboard as your primary alert or emergency preparedness tool. Always use the official Red Alert app and follow Pikud HaOref instructions. This dashboard is intended to make it easier to visualize what is happening across Israel from the public Red Alert feed, providing a country-level situational awareness view.

The developer assumes no responsibility for missed alerts, incorrect data, or any decisions made based on information displayed by this dashboard. In an emergency, follow official instructions from Pikud HaOref and local authorities.

## Screenshots

### Live Dashboard — Active Alert (Red Alert banner with affected areas)
![Red Alert Active](screenshots/image(2).png)

### Live Dashboard — Multi-Map View (country, Jerusalem surroundings, city detail)
![Dashboard Overview](screenshots/image(12).png)

### Live Dashboard — All Clear Status with Recent Alert History
![Dashboard All Clear](screenshots/image(8).png)

### Live Dashboard — Annotated UI (monitoring area, navigation, alert panel)
![Dashboard Annotated](screenshots/image(6).png)

### TV Mode — Full-Screen Map with Alert Ticker (Samsung Tizen compatible)
![TV Mode](screenshots/image(11).png)

### TV Mode — Hostile Aircraft Alert with Area Ticker
![TV Alert](screenshots/image(3).png)

### Alerts + News — Combined View (recent alerts with live news feed)
![Alerts and News](screenshots/image.png)

### News Feed — Card Layout with Source Badges
![News Feed](screenshots/image(1).png)

### Recent Alerts Panel — Detailed Alert Log with Timestamps
![Alert Log](screenshots/image(9).png)

### Mobile/Tablet — Responsive Dashboard with Alert Feed
![Mobile View](screenshots/image(10).png)

### Settings — Monitoring Area and Notification Preferences
![Settings](screenshots/image(4).png)

## Features

- **Live multi-map view** — Country overview, regional, and city-detail maps updating every 3 seconds
- **Polygon overlays** — 1,450 alert areas drawn as colour-coded polygons (red = active threat, orange = pre-warning, green = all clear)
- **Local area monitoring** — Configure your area to receive audio siren and text-to-speech announcements
- **Alert history** — Timeline playback with scrubber showing how alerts evolved through the day
- **News feed** — Aggregated headlines from Times of Israel and JNS
- **TV mode** — Full-screen single map optimised for always-on TV displays (Samsung Tizen compatible)
- **InfluxDB storage** — Time-series persistence for alert history, timeline replay, and latency analytics
- **Test alerts** — Inject test alerts to verify your setup without affecting stored data

## Architecture

- **Backend**: FastAPI (Python 3.12) with background poller fetching Oref alerts every 3 seconds
- **Database**: InfluxDB 2.7 for time-series alert storage and timeline playback
- **Frontend**: Vanilla HTML/JS with Leaflet maps — no build step required
- **Deployment**: Docker Compose (two containers: app + InfluxDB)

## Pages

| Page | URL | Description |
|------|-----|-------------|
| Live Dashboard | `/` or `/dashboard` | Main view with multiple map panels |
| History | `/history` | Historical alert timeline with playback scrubber |
| News | `/news` | Aggregated news feed |
| TV Mode | `/tv` | Single full-screen map for TV displays |
| Alerts + News | `/alerts-news` | Combined alert log and news view |
| Settings | `/settings` | Configure monitoring area and notifications |

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Server with an Israeli IP address (required for Oref API access)

### 1. Clone and configure

```bash
git clone https://github.com/danielrosehill/Red-Alert-Geodash-20260312.git
cd Red-Alert-Geodash-20260312
```

### 2. Configure environment

Copy the example environment file and edit as needed:

```bash
cp .env.example .env
```

Edit `.env` to set your own InfluxDB credentials and any other preferences.

### 3. Start the stack

```bash
docker compose up --build -d
```

The dashboard will be available at `http://localhost:8083`.

InfluxDB UI is available at `http://localhost:8086` with the credentials you set in `.env`.

### 4. View logs

```bash
docker compose logs -f geodash
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `INFLUX_URL` | `http://influxdb:8086` | InfluxDB connection URL |
| `INFLUX_TOKEN` | *(set in .env)* | InfluxDB admin token |
| `INFLUX_ORG` | `geodash` | InfluxDB organisation |
| `INFLUX_BUCKET` | `redalerts` | InfluxDB bucket name |
| `POLL_INTERVAL` | `3` | Seconds between Oref API polls |

### Monitored Areas

The backend tracks alert status for configurable areas (set in `backend/server.py` under `MONITORED_AREAS`). Defaults:

- Jerusalem South
- Tel Aviv Centre
- Haifa
- Beer Sheva

## Alert Categories

| Category | Colour | Meaning |
|----------|--------|---------|
| 1-4 | Red | Rockets and missiles |
| 7-12 | Red | UAVs, infiltration, earthquakes, tsunamis, hazmat, terror |
| 13 | Green | All clear (event ended) |
| 14 | Orange | Pre-warning |
| 15-28 | — | Drills (ignored by dashboard) |

## API Endpoints

All endpoints return JSON.

| Endpoint | Description |
|----------|-------------|
| `GET /api/alerts` | Current active alerts |
| `GET /api/alerts/enriched` | Alerts with calculated fields (% active, time since last) |
| `GET /api/history` | Today's alert history from Oref |
| `GET /api/polygons` | Area polygon coordinates for map overlays |
| `GET /api/translations` | Hebrew-to-English area name translations |
| `GET /api/alert-log?minutes=60` | Query stored alert events from InfluxDB |
| `GET /api/alert-snapshots?minutes=30` | Query stored snapshots for timeline playback |
| `GET /api/alert-log/stats` | Stats with enriched fields |
| `GET /api/monitored-areas` | Status of configured monitored areas |
| `GET /api/news` | Aggregated news feed |
| `GET /api/health` | Health check |

## Backups

A sample backup script is provided in `scripts/nightly-backup.sh`. It exports alert data from InfluxDB as CSV and uploads to S3-compatible storage. Edit the variables at the top of the script to match your own storage configuration.

## Data Sources

- **Polygon data**: 1,450 area boundaries from the [`amitfin/oref_alert`](https://github.com/amitfin/oref_alert) Home Assistant integration
- **Alert data**: Pikud HaOref public API (geo-restricted to Israel)
- **News feeds**: Times of Israel and JNS RSS feeds

## Geo-Restriction

All Oref API endpoints are geo-restricted to Israel. If you deploy this outside Israel, the backend will not receive any alert data. You would need to route API requests through a proxy with an Israeli exit node.

## License

MIT

## Author

Daniel Rosehill ([danielrosehill.com](https://danielrosehill.com))

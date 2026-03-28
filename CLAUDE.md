# Red Alert Geodash

Real-time alert visualization dashboard for Israel's Home Front Command (Pikud HaOref) public alert feed. Part of the [Red Alert Monitoring Stack](https://github.com/danielrosehill/Red-Alert-Monitoring-Stack).

## Architecture

- **Backend**: Python 3.12 FastAPI server (`backend/server.py`) polling HFC API every 3s
- **Frontend**: Vanilla JS/HTML/CSS, Leaflet maps, no build step
- **Database**: InfluxDB 2.x for time-series alert storage and timeline playback
- **Deployment**: Docker Compose — port 8083

## Key Files

| Path | Purpose |
|------|---------|
| `backend/server.py` | FastAPI backend, InfluxDB integration, Oref poller |
| `www/dashboard.html` | Main live dashboard (multi-map view) |
| `www/static/dashboard.js` | Dashboard logic: maps, alerts, polling, overlays |
| `www/static/components.js` | Shared header/footer, clocks, Shabbat times, TTS toggle |
| `www/history.html` | Historical alert timeline playback page |
| `www/news.html` | News feed page |
| `www/tv.html` | TV-optimized single map view |
| `www/settings.html` | User settings page |
| `research/area_to_polygon.json` | 1,450 area polygon coordinates |
| `docker-compose.yml` | Docker Compose config |
| `docs/data-structure.md` | Oref API payloads, InfluxDB schema |
| `docs/user-guide.md` | End-user documentation |

## Pages

- `/` — Main live dashboard (country map, Jerusalem wide, Jerusalem city detail)
- `/history` — Historical alert timeline with playback scrubber
- `/news` — Aggregated news feed (Times of Israel, JNS)
- `/tv` — Single-map TV-optimized view (Samsung Tizen compatible)
- `/mobile` — Mobile-responsive view
- `/tablet` — Tablet-optimized layout
- `/settings` — User preferences
- `/alerts-news` — Combined alert log and news feed

## Stack Integration

When deployed as part of the Red Alert Monitoring Stack:
- Set `OREF_PROXY_URL=http://oref-proxy:8764` to read alerts from the shared proxy instead of polling Oref directly
- Shares the `redalert` Docker network with other stack services
- InfluxDB config is passed via environment variables

When deployed standalone:
- Polls Oref directly (no proxy needed)
- Runs its own InfluxDB instance via docker-compose.yml

## Configuration

All settings are via environment variables (see `.env.example`):
- `INFLUX_URL`, `INFLUX_TOKEN`, `INFLUX_ORG`, `INFLUX_BUCKET` — InfluxDB connection
- `POLL_INTERVAL` — Alert polling interval in seconds (default: 3)
- `OREF_PROXY_URL` — Optional: read from proxy instead of direct Oref polling
- `GEODASH_PORT` — Dashboard port (default: 8083)

## Alert Categories

- **RED** (cat 1-4, 7-12): Active threats — rockets, UAVs, infiltration
- **ORANGE** (cat 14): Pre-warning
- **GREEN** (cat 13): All clear (fades after 60s)
- Categories 15-28: Drills (ignored)

## Development

No build step needed. Edit files in `www/` and `backend/`, then `docker compose up --build -d`. Cache-bust by incrementing `?v=N` query params on script tags.

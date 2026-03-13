# Red Alert Geodash

Real-time alert visualization dashboard for Israel's Home Front Command (Pikud HaOref) public alert feed.

## Architecture

- **Backend**: Python FastAPI server (`backend/server.py`) polling HFC API every 3s
- **Frontend**: Vanilla JS/HTML/CSS, Leaflet maps, no build step
- **Storage**: InfluxDB for alert history
- **Deployment**: Docker Compose on `ubuntuvm` (Tailscale) — port 8083

## Key Files

- `www/static/components.js` — Shared header/footer, clocks, Shabbat times, TTS toggle
- `www/static/dashboard.js` — Main dashboard logic: maps, alerts, polling, overlays
- `www/dashboard.html` — Desktop dashboard layout
- `www/tablet.html` — Tablet-optimized layout
- `www/settings.html` — User settings page
- `backend/server.py` — API server, HFC polling, InfluxDB writes

## Deployment

The app runs on `ubuntuvm` via Tailscale in a Docker container. Use `/deploy` slash command.

- **Private repo on VM**: `/home/daniel/repos/github/RE_Geodash_Private`
- **This public repo and the private repo are NOT connected** — files must be copied manually via scp
- Container: `geodash-app` (port 8083 -> 8765)
- InfluxDB: `geodash-influxdb` (port 8086, localhost only)

## Alert Categories

Hebrew titles from HFC are authoritative. English labels are derived via substring matching in `SHORT_TITLE_RULES` (dashboard.js). Key groupings:
- Shelter instructions (`היכנסו למרחב המוגן`, `התרעת קדם`, etc.) are unified as "Get To Shelter"
- Post-event statuses are grouped into "All Clear", "Leave Shelter", "Stay Near Shelter"

## TTS Modes

Three modes stored in `localStorage['geodash-tts-mode']`:
- `chatty` — announces all alerts nationwide
- `local` — only local area alerts + mass alerts (50+ nationwide)
- `off` — no speech

## Development

No build step needed. Edit files in `www/` and `backend/`, then deploy. Cache-bust by incrementing `?v=N` query params on script tags.

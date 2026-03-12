# Data Structure Reference

This document describes the data stored by Red Alert Geodash, covering the Oref API payloads, InfluxDB schema, and the backup format.

## Oref API Payloads

The backend polls the Pikud HaOref (Israel Homefront Command) API every 3 seconds.

### Active Alerts Endpoint

**URL**: `https://www.oref.org.il/WarningMessages/alert/alerts.json`

Returns either an **array** of alert objects or a **single object** (e.g. for all-clear messages).

#### Array format (normal active alerts)

```json
[
  {
    "data": "תל אביב - מרכז העיר",
    "category": 1,
    "title": "ירי רקטות וטילים",
    "alertDate": "2026-03-10 14:22:05"
  }
]
```

#### Single-object format (e.g. all-clear, category 10/13)

```json
{
  "id": "134177346860000000",
  "cat": "10",
  "title": "ניתן לצאת מהמרחב המוגן אך יש להישאר בקרבתו",
  "data": ["אביבים", "ברעם", "חורפיש"],
  "desc": "באזורים הבאים ניתן לצאת מהמרחב המוגן, אך יש להישאר בקרבתו."
}
```

The backend normalizes this into per-area alert dicts before processing.

### History Endpoint

**URL**: `https://www.oref.org.il/WarningMessages/alert/History/AlertsHistory.json`

Returns an array of historical alerts for the current day:

```json
[
  {
    "data": "אזור תעשייה אשקלון",
    "category": 1,
    "title": "ירי רקטות וטילים",
    "alertDate": "2026-03-10 14:22:05"
  }
]
```

### Alternative History Endpoint

**URL**: `https://alerts-history.oref.org.il/Shared/Ajax/GetAlarmsHistory.aspx?lang=he&mode=1`

Same structure but uses ISO-style dates (`2026-03-10T14:22:05`) and may include a `category_desc` field.

### Alert Categories

| Category | Colour | Meaning |
|----------|--------|---------|
| 1-4 | Red | Rockets and missiles |
| 7-12 | Red | UAVs, infiltration, earthquakes, tsunamis, hazmat, terror |
| 13 | Green | All clear (event ended) |
| 14 | Orange | Pre-warning |
| 15-28 | — | Drills (ignored by the dashboard) |

### Typical Alert Sequence

A typical event follows this pattern:
1. **Pre-warning (cat 14)** — "In the coming minutes, alerts are expected in your area"
2. **Active alert (cat 1)** — arrives ~2-3 minutes after pre-warning
3. **All clear (cat 13)** — arrives ~10 minutes after the active alert

## InfluxDB Schema

**Database**: InfluxDB 2.7
**Organisation**: configurable (default: `geodash`)
**Bucket**: configurable (default: `redalerts`)
**Retention**: Unlimited (no expiry set)

### Measurement: `alert`

One point per area per poll cycle. Written when alerts are active or transitioning to empty.

| Field/Tag | Type | Description |
|-----------|------|-------------|
| `area` | tag | Area name in Hebrew (e.g. "תל אביב - מרכז העיר") |
| `title` | tag | Alert title in Hebrew |
| `category` | field (int) | Alert category number |
| `alert_date` | field (string) | Original timestamp from Oref |
| `source` | field (string) | `"backfill"` for historical imports, absent for live data |
| `_time` | timestamp | UTC time of ingestion (live) or original event time (backfill) |

### Measurement: `snapshot`

Full payload snapshot for timeline replay. One point per poll cycle when alerts are active.

| Field/Tag | Type | Description |
|-----------|------|-------------|
| `count` | field (int) | Number of alerts in this snapshot |
| `payload` | field (string) | JSON-encoded array of all alert objects |
| `_time` | timestamp | UTC time of capture |

### Data Volume

Alert data is very small. Typical sizes:

- **Active conflict day**: ~3,000 alert events, ~2 MB in InfluxDB
- **Quiet day**: Near zero (only snapshots written on state transitions)
- **30-day retention**: Typically under 50 MB

## Backup Format

The provided backup script (`scripts/nightly-backup.sh`) exports data as CSV from InfluxDB and stores as compressed tarballs to S3-compatible storage.

Each tarball contains:
- `alerts-YYYY-MM-DD.csv` — All alert events from the last 30 days
- `snapshots-YYYY-MM-DD.csv` — All snapshot payloads from the last 30 days

The CSV uses InfluxDB's annotated CSV format (with `#group`, `#datatype`, `#default` headers).

### Restoring from Backup

```bash
# Download and extract
aws s3 cp s3://your-bucket/backups/geodash-backup-2026-03-10.tar.gz . --profile your-profile
tar xzf geodash-backup-2026-03-10.tar.gz

# Import back to InfluxDB
docker cp alerts-2026-03-10.csv geodash-influxdb:/tmp/
docker exec geodash-influxdb influx write \
  --bucket redalerts --org geodash --token "$INFLUX_TOKEN" \
  --format csv --file /tmp/alerts-2026-03-10.csv
```

## Geo-Restriction Note

All Oref API endpoints are geo-restricted to Israel. The backend must run from an Israeli IP or through a proxy with an Israeli exit node.

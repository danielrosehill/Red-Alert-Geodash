# Background Polling Resource Usage

This document estimates the cumulative compute cost of the two background polling loops running in the geodash-app container.

## 1. Oref Alert Poller

| Property | Value |
|---|---|
| Interval | Every 3 seconds |
| Request | Single HTTPS GET to `oref.org.il/WarningMessages/alert/alerts.json` |
| Response size | 0 bytes (no alerts) to ~50 KB (mass alert event) |
| Typical response | Empty string or small JSON array, < 1 KB |
| Processing per cycle | JSON parse, hash comparison, optional InfluxDB write |
| Requests/day | ~28,800 |

### Estimated resource usage

| Resource | Estimate |
|---|---|
| CPU per cycle | < 1 ms (HTTP roundtrip is I/O-bound, not CPU-bound) |
| CPU/day | ~30 seconds cumulative |
| RAM (steady state) | ~2-5 MB (httpx connection pool, in-memory alert cache, polygon data) |
| Bandwidth/day | ~30-100 MB outbound (mostly TLS overhead on small responses) |
| Bandwidth during mass alerts | Up to ~500 MB/day if sustained large payloads |

## 2. Telegram Bot Poller (Long Polling)

| Property | Value |
|---|---|
| Method | `getUpdates` with `timeout=30` (long poll) |
| Behavior | Connection held open server-side for up to 30s; returns immediately when a message arrives |
| Requests/day (idle) | ~2,880 (one every ~30s when no messages) |
| Requests/day (active chat) | Slightly more — returns immediately per message, then re-polls |
| Response size | Empty array (idle) or ~1-2 KB per message |
| Processing per cycle | JSON parse, command dispatch, optional sendMessage call |

### Estimated resource usage

| Resource | Estimate |
|---|---|
| CPU per cycle | < 0.5 ms |
| CPU/day | < 5 seconds cumulative |
| RAM (steady state) | < 1 MB (subscriber set, state dicts) |
| Bandwidth/day | ~5-10 MB (mostly TLS handshake overhead) |
| Outbound per notification | ~1-2 KB per subscriber per message |

## Combined Totals

| Resource | Both pollers combined |
|---|---|
| CPU/day | < 1 minute cumulative |
| RAM (steady state) | ~5-10 MB total above baseline |
| Bandwidth/day (quiet) | ~40-110 MB |
| Bandwidth/day (active alerts) | Up to ~600 MB |
| Open connections | 2 persistent (one to Oref, one to Telegram API) |

## Context

The geodash-app container baseline is roughly:
- **~50-80 MB RAM** (Python 3.12 + FastAPI + uvicorn + InfluxDB client + polygon data)
- The two pollers add negligible overhead on top of this

For comparison, a single browser tab viewing the dashboard generates more traffic (polling `/api/alerts` every 3s + map tiles) than both background pollers combined.

## Scaling Note — Telegram Subscribers

Notification broadcasts are sequential (one `sendMessage` per subscriber). At scale:

| Subscribers | Time to broadcast | Bandwidth per alert |
|---|---|---|
| 1-10 | < 1 second | < 20 KB |
| 100 | ~5-10 seconds | ~200 KB |
| 1,000 | ~1-2 minutes | ~2 MB |

Telegram rate limits bots to ~30 messages/second to individual chats, so >30 subscribers would naturally throttle. If this ever becomes an issue, Telegram supports broadcasting to channels (unlimited subscribers, single API call) as an alternative.

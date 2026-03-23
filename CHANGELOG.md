# Changelog

## v2.2 (2026-03-23)

### New Features
- **Hebrew date** displayed in header via Hebcal API
- **Shabbat times** — candle lighting and havdalah shown on Fridays/Saturdays (Jerusalem)
- **Display settings** — toggle Hebrew date and Shabbat times on/off via Settings page
- **Alert counter in footer** with type breakdown dropdown showing counts by alert category
- **Israel border outline** drawn on all map views (black polyline)
- **Gregorian date** in header (e.g. "Sun, 23 Mar")
- **HFC (Home Front Command) status** indicator in footer
- **Auto-refresh on new deployment** — clients poll `/api/version` and reload when static files change
- **Fullscreen button** in header for distraction-free viewing

### Improvements
- **Header decluttered** — Display mode and TV channel links moved into compact dropdown menus
- **Footer redesigned** — alert counter (center), attribution line, HFC status
- **Responsive layout** — header/clocks flex-wrap on small screens, body allows overflow
- **Default monitoring area** changed from Jerusalem South to Jerusalem Center

## v2 (2026-03-18)

### New Features
- **News ticker** on the main dashboard showing live headlines
- **Map view** — dedicated single-map page (`/map`)
- **Mobile view** — optimised layout for small screens (`/mobile`)
- **Tablet view** — tablet-friendly layout (`/tablet`)
- **National severity levels** — alert severity now calculated based on active alert count (e.g. low, moderate, high, critical)
- **Improved status translations** — clearer alert type labels with better Hebrew-to-English mappings

### Improvements
- **Responsive scaling** — dashboard adapts to large screens, TVs, and different display sizes
- **Tighter map zoom** — Israel country map trimmed to cut out Lebanon/Sinai; Jerusalem maps tightened
- **Locked map panning** — maps no longer accidentally pan on touch/scroll
- **Bigger clock** and refresh button in navigation bar
- **Better alert history** — entries grouped by time and category, showing full area names
- **Error handling** on history page to prevent silent crashes

### Bug Fixes
- Fixed all-clear (category 13) incorrectly overriding pre-warnings (category 14)
- Replaced emojis with CSS dots and plain text for Raspberry Pi / limited-font compatibility

## v1 (2026-03-01)

- Initial open-source release
- Live multi-map dashboard with polygon overlays for 1,450 alert areas
- Alert history timeline with playback scrubber
- News feed aggregation (Times of Israel, JNS)
- TV mode for always-on displays
- InfluxDB time-series storage
- Docker Compose deployment

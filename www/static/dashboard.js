/**
 * Red Alert Geodash — Real-time alert map dashboard
 */

// ── Auth Check (no-op on local Docker deployment) ───────────────────────────

fetch('/api/check-auth').catch(() => {});

// ── Translations ──────────────────────────────────────────────────────────────

let areaTranslations = {};

async function loadTranslations() {
    try {
        const resp = await fetch("/api/translations");
        if (resp.ok) areaTranslations = await resp.json();
    } catch (e) {
        console.warn("Could not load translations:", e);
    }
}

function translateArea(hebrewName) {
    if (!hebrewName) return hebrewName;
    return areaTranslations[hebrewName] || hebrewName;
}

const TITLE_TRANSLATIONS = {
    "ירי רקטות וטילים": "Rockets & Missiles",
    "חדירת כלי טיס עוין": "Hostile Aircraft Intrusion",
    "חדירת כלי טיס": "Aircraft Intrusion",
    "חדירת מחבלים": "Terrorist Infiltration",
    "רעידת אדמה": "Earthquake",
    "צונאמי": "Tsunami",
    "חומרים מסוכנים": "Hazardous Materials",
    "אירוע רדיולוגי": "Radiological Event",
    "התרעת קדם": "Pre-Warning",
    "ירי רקטות": "Rocket Fire",
    "טיל בליסטי": "Ballistic Missile",
    "כלי טיס עוין": "Hostile Aircraft",
    "היכנסו למרחב המוגן": "Enter Protected Space",
    "היכנס למרחב המוגן": "Enter Protected Space",
    "הגיעו למרחב המוגן": "Reach Protected Space",
    "התרחקו מהחוף": "Move Away From Shore",
    "סיום שהייה בסמיכות למרחב המוגן": "End Shelter Proximity",
    "יש לשהות בסמיכות למרחב המוגן": "Stay Near Protected Space",
    "ניתן לצאת מהמרחב המוגן אך יש להישאר בקרבתו": "May Leave Shelter - Stay Nearby",
    "מגן אך יש להישאר בקרבתו": "Shield - Stay Nearby",
    "בדקות הקרובות צפויות להתקבל התרעות באזורך": "Early Warning - Alerts Expected Shortly",
    "האירוע הסתיים": "All Clear - Event Concluded",
};

function translateTitle(hebrewTitle) {
    if (!hebrewTitle) return hebrewTitle;
    if (TITLE_TRANSLATIONS[hebrewTitle]) return TITLE_TRANSLATIONS[hebrewTitle];
    for (const [he, en] of Object.entries(TITLE_TRANSLATIONS)) {
        if (hebrewTitle.includes(he) || he.includes(hebrewTitle.replace(/\.\.\./g, ''))) {
            return en;
        }
    }
    return hebrewTitle;
}

// ── Configuration ──────────────────────────────────────────────────────────────

const POLL_INTERVAL = 15000;
const GREEN_DURATION = 60000;
const TILE_URL = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const TILE_ATTR = '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>';

const JERUSALEM_CENTER = [31.78, 35.22];
const JERUSALEM_WIDE_CENTER = [31.75, 35.10];
const ISRAEL_CENTER = [31.5, 35.0];

// Local area monitoring — Hebrew keys, English display names
const AREA_OPTIONS = [
    { he: "\u05d9\u05e8\u05d5\u05e9\u05dc\u05d9\u05dd - \u05d3\u05e8\u05d5\u05dd", en: "South" },
    { he: "\u05d9\u05e8\u05d5\u05e9\u05dc\u05d9\u05dd - \u05de\u05e8\u05db\u05d6", en: "Center" },
    { he: "\u05d9\u05e8\u05d5\u05e9\u05dc\u05d9\u05dd - \u05e6\u05e4\u05d5\u05df", en: "North" },
    { he: "\u05d9\u05e8\u05d5\u05e9\u05dc\u05d9\u05dd - \u05de\u05e2\u05e8\u05d1", en: "West" },
    { he: "\u05d9\u05e8\u05d5\u05e9\u05dc\u05d9\u05dd - \u05de\u05d6\u05e8\u05d7", en: "East" },
    { he: "\u05d9\u05e8\u05d5\u05e9\u05dc\u05d9\u05dd - \u05db\u05e4\u05e8 \u05e2\u05e7\u05d1", en: "Kafr Aqab" },
    { he: "\u05d9\u05e8\u05d5\u05e9\u05dc\u05d9\u05dd - \u05d0\u05d6\u05d5\u05e8 \u05ea\u05e2\u05e9\u05d9\u05d9\u05d4 \u05e2\u05d8\u05e8\u05d5\u05ea", en: "Atarot" },
];

// Default to saved preference or Jerusalem South
const savedArea = localStorage.getItem("geodash-local-area");
let LOCAL_AREA = savedArea || AREA_OPTIONS[0].he;

const CATEGORY_COLORS = {
    1: "#e94560", 2: "#e94560", 3: "#e94560", 4: "#e94560",
    6: "#e94560",
    7: "#e94560", 8: "#e94560", 9: "#e94560", 10: "#e94560",
    11: "#e94560", 12: "#e94560",
    14: "#ff9800",
    13: "#4ecca3",
};

const CATEGORY_LABELS = {
    1: "🚀 Rockets", 2: "🛩️ Drone", 3: "☣️ Chemical", 4: "⚠️ Warning",
    6: "🛩️ Hostile Aircraft",
    7: "🌍 Earthquake", 8: "🌍 Earthquake", 9: "☢️ CBRNE", 10: "🔫 Infiltration",
    11: "🌊 Tsunami", 12: "⚠️ Hazmat", 13: "✅ All Clear", 14: "⏳ Early Warning",
};

// Polygons are invisible by default — no outlines shown
const DEFAULT_STYLE = {
    color: "transparent",
    weight: 0,
    fillColor: "transparent",
    fillOpacity: 0,
};

// ── State ──────────────────────────────────────────────────────────────────────

let polygonData = {};
let areaLayers = {};
let areaTimers = {};
let areaCenters = {};
let currentAlerts = new Map();
let localAlertActive = false;
let localAlertMinTimer = null; // minimum display timer
const LOCAL_ALERT_MIN_DURATION = 30000; // 30 seconds minimum display
let audioCtx = null;
let cache_alerts_raw = [];

// Alert history feed — keeps last 50 entries
let alertHistory = [];
const MAX_HISTORY = 50;


// ── Audio ──────────────────────────────────────────────────────────────────────

function getAudioCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function isAudioEnabled() {
    return localStorage.getItem('geodash-audio') !== 'false';
}

function isSpeechEnabled() {
    return localStorage.getItem('geodash-speech') !== 'false';
}

function playRedAlertTone() {
    if (!isAudioEnabled()) return;
    const ctx = getAudioCtx();
    const now = ctx.currentTime;
    for (let i = 0; i < 3; i++) {
        const offset = i * 0.8;
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'square';
        osc1.frequency.value = 880;
        gain1.gain.value = 0.3;
        osc1.connect(gain1).connect(ctx.destination);
        osc1.start(now + offset);
        osc1.stop(now + offset + 0.35);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'square';
        osc2.frequency.value = 660;
        gain2.gain.value = 0.3;
        osc2.connect(gain2).connect(ctx.destination);
        osc2.start(now + offset + 0.4);
        osc2.stop(now + offset + 0.75);
    }
}

function playWarningTone() {
    if (!isAudioEnabled()) return;
    const ctx = getAudioCtx();
    const now = ctx.currentTime;
    for (let i = 0; i < 3; i++) {
        const offset = i * 0.5;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 520;
        gain.gain.setValueAtTime(0.25, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.3);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.35);
    }
}

function speakAlert(message) {
    if (!isSpeechEnabled()) return;
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 0.9;
        utterance.volume = 1;
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    }
}

// ── Local Area Alert ──────────────────────────────────────────────────────────

function playAllClearTone() {
    if (!isAudioEnabled()) return;
    const ctx = getAudioCtx();
    const now = ctx.currentTime;
    // Pleasant ascending chime
    const notes = [523, 659, 784]; // C5, E5, G5
    for (let i = 0; i < notes.length; i++) {
        const offset = i * 0.25;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = notes[i];
        gain.gain.setValueAtTime(0.2, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.5);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.6);
    }
}

function showLocalAlert(type, title) {
    const overlay = document.getElementById('local-alert-overlay');
    const text = document.getElementById('local-alert-text');
    overlay.classList.remove('active-red', 'active-warning', 'active-allclear');

    const areaEn = getEnglishName(LOCAL_AREA);

    if (type === 'red') {
        text.textContent = `RED ALERT \u2014 ${title}`;
        overlay.classList.add('active-red');
        playRedAlertTone();
        setTimeout(() => {
            speakAlert(`Red alert. ${title}. Jerusalem ${areaEn}. Take shelter immediately.`);
        }, 2500);
    } else if (type === 'warning') {
        text.textContent = `WARNING \u2014 ${title}`;
        overlay.classList.add('active-warning');
        playWarningTone();
        setTimeout(() => {
            speakAlert(`Warning. ${title}. Jerusalem ${areaEn}. Be prepared.`);
        }, 1800);
    } else if (type === 'allclear') {
        text.textContent = `ALL CLEAR \u2014 Event Concluded`;
        overlay.classList.add('active-allclear');
        playAllClearTone();
        setTimeout(() => {
            speakAlert(`All clear. The event in Jerusalem ${areaEn} has concluded. You may leave the shelter.`);
        }, 1000);
    }

    localAlertActive = true;

    // Enforce minimum display duration
    if (localAlertMinTimer) clearTimeout(localAlertMinTimer);
    localAlertMinTimer = setTimeout(() => {
        localAlertMinTimer = null;
        // If alert already cleared by backend, hide now
        if (!currentAlerts.has(LOCAL_AREA)) {
            hideLocalAlert();
        }
    }, LOCAL_ALERT_MIN_DURATION);
}

function dismissLocalAlert() {
    const overlay = document.getElementById('local-alert-overlay');
    overlay.classList.remove('active-red', 'active-warning', 'active-allclear');
    localAlertActive = false;
    if (localAlertMinTimer) {
        clearTimeout(localAlertMinTimer);
        localAlertMinTimer = null;
    }
}

function hideLocalAlert() {
    // Respect minimum display duration — don't hide too early
    if (localAlertMinTimer) return; // timer still running, will hide when it fires
    const overlay = document.getElementById('local-alert-overlay');
    overlay.classList.remove('active-red', 'active-warning', 'active-allclear');
    localAlertActive = false;
}

// Clock handled by components.js renderHeader()

// ── Refresh Button ────────────────────────────────────────────────────────────

document.getElementById('refresh-btn').addEventListener('click', () => {
    window.location.reload();
});

// ── Test Alert Buttons ────────────────────────────────────────────────────────

async function sendTestAlert(category, duration) {
    const clearBtn = document.getElementById('test-clear-btn');
    try {
        const title = category === 1 ? 'ירי רקטות וטילים'
            : category === 14 ? 'בדקות הקרובות צפויות להתקבל התרעות באזורך'
            : 'האירוע הסתיים';
        const resp = await fetch('/api/test-alert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ area: LOCAL_AREA, category, title, duration }),
        });
        if (resp.ok) {
            clearBtn.style.display = 'inline-block';
            setTimeout(() => {
                clearBtn.style.display = 'none';
            }, duration * 1000);
            pollAlerts();
        }
    } catch (e) {
        console.error('Failed to send test alert:', e);
    }
}

document.getElementById('test-red-btn').addEventListener('click', () => sendTestAlert(1, 30));
document.getElementById('test-warning-btn').addEventListener('click', () => sendTestAlert(14, 30));
document.getElementById('test-allclear-btn').addEventListener('click', () => {
    // All-clear shows the overlay directly (no backend injection needed)
    showLocalAlert('allclear', 'האירוע הסתיים');
});

document.getElementById('test-clear-btn').addEventListener('click', async () => {
    try {
        await fetch('/api/test-alert', { method: 'DELETE' });
    } catch (e) {
        console.error('Failed to clear test alerts:', e);
    }
    document.getElementById('test-clear-btn').style.display = 'none';
    pollAlerts();
});

// ── Alert Dismiss ────────────────────────────────────────────────────────────

document.getElementById('local-alert-dismiss').addEventListener('click', () => {
    dismissLocalAlert();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && localAlertActive) {
        dismissLocalAlert();
    }
});

// ── Maps (3 maps: country, jerusalem wide, jerusalem city) ────────────────────

const mapJerusalem = L.map("map-jerusalem", {
    zoomControl: false, attributionControl: false,
}).setView(JERUSALEM_CENTER, 13);

const mapJerusalemWide = L.map("map-jerusalem-wide", {
    zoomControl: false, attributionControl: false,
}).setView(JERUSALEM_WIDE_CENTER, 10);

const mapCountry = L.map("map-country", {
    zoomControl: false, attributionControl: false,
}).setView(ISRAEL_CENTER, 8);

L.tileLayer(TILE_URL, { attribution: TILE_ATTR }).addTo(mapJerusalem);
L.tileLayer(TILE_URL, { attribution: TILE_ATTR }).addTo(mapJerusalemWide);
L.tileLayer(TILE_URL, { attribution: TILE_ATTR }).addTo(mapCountry);

const legend = L.control({ position: "bottomleft" });
legend.onAdd = function () {
    const div = L.DomUtil.create("div", "legend");
    div.innerHTML = `
        <div class="legend-item"><div class="legend-swatch" style="background:#e94560"></div> Active Alert</div>
        <div class="legend-item"><div class="legend-swatch" style="background:#ff9800"></div> Pre-Warning</div>
        <div class="legend-item"><div class="legend-swatch" style="background:#4ecca3"></div> All Clear</div>
    `;
    return div;
};
legend.addTo(mapCountry);

// ── Polygon Loading ────────────────────────────────────────────────────────────

function getPolygonCenter(coords) {
    let latSum = 0, lngSum = 0, count = 0;
    for (const ring of coords) {
        for (const pt of (Array.isArray(ring[0]) ? ring : [ring])) {
            if (Array.isArray(pt) && pt.length === 2) {
                latSum += pt[0];
                lngSum += pt[1];
                count++;
            }
        }
    }
    return count > 0 ? [latSum / count, lngSum / count] : null;
}

async function loadPolygons() {
    const resp = await fetch("/api/polygons");
    if (!resp.ok) { console.error('API error', resp.status); return; }
    polygonData = await resp.json();

    for (const [name, coords] of Object.entries(polygonData)) {
        const countryPoly = L.polygon(coords, { ...DEFAULT_STYLE }).addTo(mapCountry);
        const jerusalemWidePoly = L.polygon(coords, { ...DEFAULT_STYLE }).addTo(mapJerusalemWide);
        const jerusalemPoly = L.polygon(coords, { ...DEFAULT_STYLE }).addTo(mapJerusalem);

        countryPoly.bindTooltip(name, { sticky: true, direction: "top" });
        jerusalemWidePoly.bindTooltip(name, { sticky: true, direction: "top" });
        jerusalemPoly.bindTooltip(name, { sticky: true, direction: "top" });

        areaLayers[name] = {
            country: countryPoly,
            jerusalemWide: jerusalemWidePoly,
            jerusalem: jerusalemPoly,
        };

        const center = getPolygonCenter(coords);
        if (center) areaCenters[name] = center;
    }
}

// ── Alert Processing ───────────────────────────────────────────────────────────

function setAreaStyle(name, color, fillOpacity) {
    const layers = areaLayers[name];
    if (!layers) return;

    const style = {
        color: color === "transparent" ? "transparent" : color,
        weight: color === "transparent" ? 0 : 2,
        fillColor: color,
        fillOpacity: fillOpacity,
    };

    layers.country.setStyle(style);
    layers.jerusalemWide.setStyle(style);
    layers.jerusalem.setStyle(style);

    if (color !== "transparent") {
        layers.country.bringToFront();
        layers.jerusalemWide.bringToFront();
        layers.jerusalem.bringToFront();
    }
}

function flashArea(name) {
    const layers = areaLayers[name];
    if (!layers) return;

    let on = true;
    const interval = setInterval(() => {
        const opacity = on ? 0.6 : 0.15;
        layers.country.setStyle({ fillOpacity: opacity });
        layers.jerusalemWide.setStyle({ fillOpacity: opacity });
        layers.jerusalem.setStyle({ fillOpacity: opacity });
        on = !on;
    }, 500);

    if (!areaLayers[name]._flashInterval) {
        areaLayers[name]._flashInterval = interval;
    }
}

function stopFlash(name) {
    if (areaLayers[name] && areaLayers[name]._flashInterval) {
        clearInterval(areaLayers[name]._flashInterval);
        delete areaLayers[name]._flashInterval;
    }
}

// ── Alert History Feed ────────────────────────────────────────────────────────

function addToHistory(area, category, title, alert_type) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Jerusalem', hour12: false,
        hour: '2-digit', minute: '2-digit',
    });

    alertHistory.unshift({
        time: timeStr,
        area: area,
        category: category,
        label: (alert_type === 'test' ? 'TEST ' : '') + (CATEGORY_LABELS[category] || `Cat ${category}`),
        title: title,
        alert_type: alert_type,
    });

    if (alertHistory.length > MAX_HISTORY) {
        alertHistory.length = MAX_HISTORY;
    }
}

function renderAlertFeed() {
    const feed = document.getElementById('alert-feed');
    if (!feed) return;

    if (alertHistory.length === 0) {
        feed.innerHTML = '<div class="no-alerts">No recent alerts</div>';
        return;
    }

    feed.innerHTML = alertHistory.map(entry => {
        const catClass = entry.category === 13 ? 'cat-13' : entry.category === 14 ? 'cat-14' : '';
        return `<div class="alert-item">
            <span class="alert-time">${entry.time}</span>
            <span class="alert-type ${catClass}">${escapeHtml(entry.label)}</span>
            <div class="alert-area">${escapeHtml(translateArea(entry.area))}</div>
        </div>`;
    }).join('');
}

function processAlerts(alerts) {
    const newAlerts = new Map();

    for (const alert of alerts) {
        const { data: area, category, title, alertDate, alert_type } = alert;
        newAlerts.set(area, { category, title, alertDate, alert_type });
    }

    // Check if local area alert has cleared — announce all-clear via TTS
    if (localAlertActive && !newAlerts.has(LOCAL_AREA)) {
        hideLocalAlert();
        speakAlert('All clear. The event in your area has concluded.');
    }

    // Track new areas for history feed
    const newAreas = [];

    for (const [area, info] of currentAlerts) {
        if (!newAlerts.has(area)) {
            stopFlash(area);
            setAreaStyle(area, "#4ecca3", 0.4);
            if (areaTimers[area]) clearTimeout(areaTimers[area]);
            areaTimers[area] = setTimeout(() => {
                setAreaStyle(area, "transparent", 0);
                delete areaTimers[area];
            }, GREEN_DURATION);
        }
    }

    for (const [area, info] of newAlerts) {
        const color = CATEGORY_COLORS[info.category] || "#e94560";
        const isNew = !currentAlerts.has(area);

        if (isNew) {
            newAreas.push({ area, category: info.category, title: info.title, alert_type: info.alert_type });
        }

        if (info.category === 13) {
            stopFlash(area);
            setAreaStyle(area, "#4ecca3", 0.4);
            if (areaTimers[area]) clearTimeout(areaTimers[area]);
            areaTimers[area] = setTimeout(() => {
                setAreaStyle(area, "transparent", 0);
                delete areaTimers[area];
            }, GREEN_DURATION);

            if (isNew && area === LOCAL_AREA) {
                showLocalAlert('allclear', info.title);
            }
        } else if (info.category === 14) {
            stopFlash(area);
            if (areaTimers[area]) { clearTimeout(areaTimers[area]); delete areaTimers[area]; }
            setAreaStyle(area, "#ff9800", 0.45);

            if (isNew && area === LOCAL_AREA) {
                showLocalAlert('warning', info.title);
            }
        } else {
            if (areaTimers[area]) { clearTimeout(areaTimers[area]); delete areaTimers[area]; }
            setAreaStyle(area, color, 0.6);
            flashArea(area);

            if (isNew && area === LOCAL_AREA) {
                showLocalAlert('red', info.title);
            }
        }
    }

    currentAlerts = newAlerts;

    // Add new alerts to history feed
    for (const entry of newAreas) {
        addToHistory(entry.area, entry.category, entry.title, entry.alert_type);
    }
    if (newAreas.length > 0) {
        renderAlertFeed();
    }

    // TTS for nationwide alerts (excludes local area which has its own TTS)
    if (newAreas.length > 0 && isSpeechEnabled()) {
        const nonLocalNew = newAreas.filter(e => e.area !== LOCAL_AREA && e.category !== 13 && e.category !== 14);
        if (nonLocalNew.length > 0) {
            const areaNames = nonLocalNew.slice(0, 5).map(e => translateArea(e.area)).join(', ');
            const more = nonLocalNew.length > 5 ? ` and ${nonLocalNew.length - 5} more` : '';
            const msg = `${nonLocalNew.length} alert${nonLocalNew.length > 1 ? 's' : ''} across Israel, including ${areaNames}${more}.`;
            // Delay to avoid overlapping with local area TTS
            setTimeout(() => speakAlert(msg), localAlertActive ? 6000 : 500);
        }
        // TTS for all-clear events nationwide
        const allClearNew = newAreas.filter(e => e.category === 13);
        if (allClearNew.length > 0 && nonLocalNew.length === 0) {
            const clearNames = allClearNew.slice(0, 3).map(e => translateArea(e.area)).join(', ');
            speakAlert(`All clear in ${clearNames}.`);
        }
    }

    // Update monitoring status
    const monStatus = document.getElementById('monitoring-status');
    if (newAlerts.has(LOCAL_AREA)) {
        const localInfo = newAlerts.get(LOCAL_AREA);
        if (localInfo.category !== 13) {
            monStatus.textContent = CATEGORY_LABELS[localInfo.category] || localInfo.title;
            monStatus.style.color = CATEGORY_COLORS[localInfo.category] || '#e94560';
        } else {
            monStatus.textContent = 'All clear';
            monStatus.style.color = '#7eddb8';
        }
    } else {
        monStatus.textContent = 'All clear';
        monStatus.style.color = '#7eddb8';
    }

    const activeCount = [...newAlerts.values()].filter(
        a => a.category !== 13 && a.category !== 14
    ).length;

    const countEl = document.getElementById("alert-count");
    if (activeCount > 0) {
        countEl.textContent = `${activeCount} active`;
        countEl.classList.add("active");
    } else {
        countEl.classList.remove("active");
    }

    // Auto-zoom country map to active alerts
    autoZoomToAlerts(newAlerts);

    // Update the alert flash bar
    updateFlashBar(newAlerts);
}

// ── Auto-Zoom ──────────────────────────────────────────────────────────────

let mapIsAutoZoomed = false;
const MAP_DEFAULT_CENTER = ISRAEL_CENTER;
const MAP_DEFAULT_ZOOM = 8;

function autoZoomToAlerts(alerts) {
    const activeAreas = [];
    for (const [area, info] of alerts) {
        if (info.category !== 13 && info.category !== 14 && info.category < 15) {
            if (areaCenters[area]) activeAreas.push(areaCenters[area]);
        }
    }

    if (activeAreas.length > 0) {
        const bounds = L.latLngBounds(activeAreas);
        // Pad bounds so polygons aren't at the edge
        mapCountry.fitBounds(bounds.pad(0.5), { maxZoom: 12, animate: true, duration: 0.8 });
        mapIsAutoZoomed = true;
    } else if (mapIsAutoZoomed) {
        // Return to default view when alerts clear
        mapCountry.setView(MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM, { animate: true, duration: 0.8 });
        mapIsAutoZoomed = false;
    }
}


// ── Alert Flash Bar ─────────────────────────────────────────────────────────

function updateFlashBar(alerts) {
    const bar = document.getElementById('alert-flash-bar');
    const label = document.getElementById('flashbar-label');
    const text = document.getElementById('flashbar-text');
    const count = document.getElementById('flashbar-count');
    if (!bar) return;

    bar.classList.remove('alert-active', 'warning-active', 'allclear-active');

    // Categorize active alerts (exclude drills 15-28)
    const redAlerts = [];
    const warnings = [];
    const allClears = [];

    for (const [area, info] of alerts) {
        if (info.category >= 15) continue;
        if (info.category === 13) {
            allClears.push(area);
        } else if (info.category === 14) {
            warnings.push({ area, title: info.title });
        } else {
            redAlerts.push({ area, title: info.title, category: info.category });
        }
    }

    if (redAlerts.length > 0) {
        bar.classList.add('alert-active');
        // Group by type for "by type" display
        const byType = {};
        for (const a of redAlerts) {
            const typeLabel = translateTitle(a.title) || CATEGORY_LABELS[a.category] || 'Alert';
            byType[typeLabel] = (byType[typeLabel] || 0) + 1;
        }
        const typeSummary = Object.entries(byType).map(([t, n]) => `${t}: ${n}`).join(' · ');

        // Count alerts in user's local area
        const localCount = redAlerts.filter(a => a.area === LOCAL_AREA).length;
        const localText = localCount > 0 ? ` | Your area: ${localCount}` : '';

        label.textContent = 'ACTIVE ALERTS';
        text.textContent = typeSummary;
        count.textContent = `All Israel: ${redAlerts.length}${localText}`;
    } else if (warnings.length > 0) {
        bar.classList.add('warning-active');
        const areaNames = warnings.map(a => translateArea(a.area)).join(' · ');
        label.textContent = 'PRE-WARNING';
        text.textContent = areaNames;
        count.textContent = `${warnings.length} area${warnings.length > 1 ? 's' : ''}`;
    } else if (allClears.length > 0) {
        bar.classList.add('allclear-active');
        label.textContent = 'ALL CLEAR';
        text.textContent = allClears.map(a => translateArea(a)).join(' · ');
    } else {
        label.textContent = 'LIVE';
        text.textContent = 'No active alerts';
    }
}

// escapeHtml provided by components.js

// ── Polling ────────────────────────────────────────────────────────────────────

async function pollAlerts() {
    const statusEl = document.getElementById("status-indicator");
    const payloadDot = document.getElementById("payload-dot");

    try {
        const resp = await fetch("/api/alerts");
        if (!resp.ok) { console.error('API error', resp.status); return; }
        const data = await resp.json();
        cache_alerts_raw = data;

        processAlerts(data);

        statusEl.classList.remove("error");
        payloadDot.classList.add("flash");
        setTimeout(() => payloadDot.classList.remove("flash"), 600);
    } catch (err) {
        console.error("Poll error:", err);
        statusEl.classList.add("error");
    }
}

// ── Init ───────────────────────────────────────────────────────────────────────

function getEnglishName(hebrewArea) {
    const match = AREA_OPTIONS.find(a => a.he === hebrewArea);
    return match ? match.en : hebrewArea;
}

function buildAreaSelector() {
    const container = document.getElementById("area-selector");
    if (!container) return;

    container.innerHTML = "";
    for (let i = 0; i < AREA_OPTIONS.length; i++) {
        const opt = AREA_OPTIONS[i];
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "local-area";
        radio.id = `area-${i}`;
        radio.value = opt.he;
        radio.checked = opt.he === LOCAL_AREA;

        const label = document.createElement("label");
        label.htmlFor = `area-${i}`;
        label.textContent = opt.en;

        radio.addEventListener("change", () => {
            LOCAL_AREA = opt.he;
            localStorage.setItem("geodash-local-area", opt.he);
            // Update area name display
            const areaName = document.getElementById('monitoring-area-name');
            if (areaName) areaName.textContent = `Jerusalem — ${opt.en}`;
            // Update monitoring status immediately
            const monStatus = document.getElementById('monitoring-status');
            monStatus.textContent = 'All clear';
            monStatus.style.color = '#7eddb8';
            // Re-evaluate current alerts for the new area
            if (cache_alerts_raw.length > 0) {
                processAlerts(cache_alerts_raw);
            }
        });

        container.appendChild(radio);
        container.appendChild(label);
    }
}

async function init() {
    await loadTranslations();
    buildAreaSelector();

    // Set initial monitoring area name and status
    const areaNameEl = document.getElementById('monitoring-area-name');
    if (areaNameEl) {
        areaNameEl.textContent = `Jerusalem — ${getEnglishName(LOCAL_AREA)}`;
    }
    const monStatus = document.getElementById('monitoring-status');
    if (monStatus) {
        monStatus.textContent = 'All clear';
    }

    await loadPolygons();
    await pollAlerts();

    // Force Leaflet to recalculate map sizes after everything loads
    const resizeMaps = () => {
        mapCountry.invalidateSize();
        mapJerusalemWide.invalidateSize();
        mapJerusalem.invalidateSize();
    };
    resizeMaps();
    setTimeout(resizeMaps, 200);
    setTimeout(resizeMaps, 1000);
    window.addEventListener('resize', resizeMaps);
    setInterval(pollAlerts, POLL_INTERVAL);

    // Load recent history from API — deduplicate consecutive same-area alerts
    try {
        const resp = await fetch("/api/alert-log?minutes=4320");
        if (resp.ok) {
            const history = await resp.json();
            // history is newest-first from API; reverse to process oldest-first
            const sorted = history.slice(0, 500).reverse();
            // Track last seen category per area to collapse repeated polls
            const lastSeen = new Map();
            for (const entry of sorted) {
                const key = `${entry.area}|${entry.category}`;
                if (lastSeen.has(key)) {
                    // Same area+category still active — skip duplicate
                    const prev = lastSeen.get(key);
                    const gap = new Date(entry.ts) - new Date(prev.ts);
                    if (gap < 120000) { // within 2 min = same event
                        lastSeen.set(key, entry);
                        continue;
                    }
                }
                lastSeen.set(key, entry);

                const ts = new Date(entry.ts);
                const timeStr = ts.toLocaleTimeString('en-GB', {
                    timeZone: 'Asia/Jerusalem', hour12: false,
                    hour: '2-digit', minute: '2-digit',
                });
                alertHistory.push({
                    time: timeStr,
                    area: entry.area,
                    category: entry.category,
                    label: CATEGORY_LABELS[entry.category] || `Cat ${entry.category}`,
                    title: entry.title,
                });
            }
            // Sort newest first
            alertHistory.sort((a, b) => b.time > a.time ? 1 : -1);
            if (alertHistory.length > MAX_HISTORY) alertHistory.length = MAX_HISTORY;
            renderAlertFeed();
        }
    } catch (e) {
        console.error("Failed to load alert history:", e);
    }

    document.addEventListener('click', () => { getAudioCtx(); }, { once: true });
}

init();

/**
 * Red Alert Geodash — Shared header/footer components
 * Include this before page-specific scripts.
 */

// ── Shared CSS (injected into <head>) ──────────────────────────────────────

const COMPONENT_CSS = `
/* ── Header ──────────────────────────────────────────── */
.geodash-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 12px;
    background: #16213e;
    border-bottom: 2px solid #0f3460;
    flex-shrink: 0;
    max-width: 100vw;
    overflow: hidden;
    position: sticky;
    top: 0;
    z-index: 2000;
}

.geodash-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
}

.geodash-header-icon {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    flex-shrink: 0;
}

.geodash-header h1 {
    font-size: 1rem;
    color: #7eddb8;
    margin: 0;
    white-space: nowrap;
}

.geodash-refresh-btn {
    background: none;
    border: 1px solid #0f3460;
    color: #aab;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 0.78rem;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    flex-shrink: 0;
}
.geodash-refresh-btn:hover { color: #7eddb8; border-color: #7eddb8; }

.geodash-nav {
    display: flex;
    gap: 2px;
    background: #0f3460;
    border-radius: 6px;
    padding: 2px;
}

.geodash-nav a {
    color: #ccd;
    padding: 5px 12px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.5px;
    text-decoration: none;
    transition: all 0.2s;
    white-space: nowrap;
}

.geodash-nav a.active {
    background: #7eddb8;
    color: #1a1a2e;
}

.geodash-nav a:not(.active):hover {
    color: #fff;
}

.geodash-clocks {
    display: flex;
    gap: 0;
    align-items: center;
    flex-shrink: 0;
}

.geodash-clock-separator {
    color: #334;
    font-size: 1.2rem;
    font-weight: 300;
    margin: 0 10px;
}

.geodash-clock-block.utc .geodash-clock-label {
    color: #2a7a4a;
}

.geodash-clock-block.utc .geodash-clock-time {
    color: #3a9a5a;
    font-size: 1rem;
    font-weight: 500;
}

.geodash-clock-block {
    display: flex;
    align-items: baseline;
    gap: 5px;
    font-variant-numeric: tabular-nums;
}

.geodash-clock-label {
    color: #bbc;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
}

.geodash-clock-time {
    color: #7eddb8;
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: 1px;
}

.geodash-shabbat {
    display: flex;
    align-items: baseline;
    gap: 5px;
    font-variant-numeric: tabular-nums;
}

.geodash-shabbat-label {
    color: #b8a060;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.geodash-shabbat-time {
    color: #d4b870;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.geodash-nav-separator {
    color: #334;
    font-size: 1rem;
    font-weight: 300;
    margin: 0 6px;
    user-select: none;
}

.geodash-ext-links {
    display: flex;
    gap: 3px;
}

.geodash-ext-link {
    color: #aab;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 4px;
    text-decoration: none;
    border: 1px solid #1a3a6e;
    transition: all 0.2s;
    white-space: nowrap;
}

.geodash-ext-link:hover {
    color: #7eddb8;
    border-color: #7eddb8;
}

.geodash-tts-toggle {
    color: #aab;
    font-size: 0.78rem;
    padding: 4px 10px;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid #1a3a6e;
    background: none;
    transition: all 0.2s;
    line-height: 1;
    white-space: nowrap;
}

.geodash-tts-toggle:hover {
    border-color: #7eddb8;
}

.geodash-tts-toggle.tts-chatty {
    color: #7eddb8;
    border-color: #7eddb8;
}

.geodash-tts-toggle.tts-local {
    color: #d4b870;
    border-color: #d4b870;
}

.geodash-tts-toggle.tts-off {
    color: #665;
    opacity: 0.6;
}

@media (max-width: 1200px) {
    .geodash-header { padding: 4px 8px; gap: 6px; }
    .geodash-header-left { gap: 6px; }
    .geodash-nav a { padding: 4px 8px; font-size: 0.72rem; }
    .geodash-ext-link { padding: 3px 6px; font-size: 0.72rem; }
    .geodash-clock-time { font-size: 1rem; }
    .geodash-header h1 { font-size: 0.9rem; }
    .geodash-nav-separator { margin: 0 3px; font-size: 0.9rem; }
    .geodash-clock-separator { margin: 0 6px; font-size: 1rem; }
}

/* ── Footer ──────────────────────────────────────────── */
.geodash-footer {
    padding: 6px 16px;
    border-top: 1px solid #0f3460;
    font-size: 0.7rem;
    color: #556;
    text-align: center;
    flex-shrink: 0;
    background: #16213e;
    direction: rtl;
}

.geodash-footer a {
    color: #667;
    text-decoration: none;
}

.geodash-footer .motto {
    color: #7eddb8;
    font-weight: 700;
    font-size: 0.85rem;
    letter-spacing: 1px;
}
`;

// ── Inject CSS ─────────────────────────────────────────────────────────────

(function injectComponentCSS() {
    const style = document.createElement('style');
    style.textContent = COMPONENT_CSS;
    document.head.appendChild(style);
})();

// ── Header Component ───────────────────────────────────────────────────────

// TTS mode helpers — 3 modes: chatty, local, off
const TTS_MODES = ['chatty', 'local', 'off'];
const TTS_MODE_LABELS = { chatty: '🔊 All', local: '🔉 Local', off: '🔇 Off' };
const TTS_MODE_TITLES = {
    chatty: 'TTS: Chatty — announces all alerts nationwide',
    local: 'TTS: Local — your area + mass alerts (50+)',
    off: 'TTS: Off',
};
const TTS_MODE_CLASSES = { chatty: 'tts-chatty', local: 'tts-local', off: 'tts-off' };

function getTtsMode() {
    const mode = localStorage.getItem('geodash-tts-mode');
    // Migrate old boolean setting
    if (!mode) {
        const oldSpeech = localStorage.getItem('geodash-speech');
        if (oldSpeech === 'false') return 'off';
        return 'chatty'; // old default was on = chatty
    }
    return TTS_MODES.includes(mode) ? mode : 'local';
}

function setTtsMode(mode) {
    localStorage.setItem('geodash-tts-mode', mode);
    // Keep legacy key in sync for audio tone logic
    localStorage.setItem('geodash-speech', mode !== 'off' ? 'true' : 'false');
}

function renderHeader(activePage) {
    const sep = '<span class="geodash-nav-separator">|</span>';

    // Pages
    const pageLinks = [
        { href: '/history', label: 'HISTORY', id: 'history' },
        { href: '/news', label: 'NEWS', id: 'news' },
        { href: '/alerts-news', label: 'ALERTS+NEWS', id: 'alerts-news' },
    ];

    // Display type
    const displayLinks = [
        { href: '/', label: '🖥 Web', id: 'live' },
        { href: '/tablet', label: '📱 Tablet', id: 'tablet' },
        { href: '/tv', label: '📺 TV', id: 'tv' },
    ];

    // TV links
    const tvLinks = [
        { href: 'https://www.oref.org.il/eng', label: 'HFC' },
        { href: 'https://www.kan.org.il/live/', label: '📺 KAN' },
        { href: 'https://video.i24news.tv/live/brightcove/en', label: '📺 i24' },
    ];

    const makeNav = (links) => links.map(p =>
        `<a href="${p.href}" class="${p.id === activePage ? 'active' : ''}">${p.label}</a>`
    ).join('');

    const pagesHtml = makeNav(pageLinks);
    const displayHtml = makeNav(displayLinks);

    const tvLinksHtml = tvLinks.map(l =>
        `<a href="${l.href}" target="_blank" rel="noopener" class="geodash-ext-link">${l.label}</a>`
    ).join('');

    const ttsMode = getTtsMode();
    const ttsBtnHtml = `<button class="geodash-tts-toggle ${TTS_MODE_CLASSES[ttsMode]}" id="tts-toggle-btn" title="${TTS_MODE_TITLES[ttsMode]}">${TTS_MODE_LABELS[ttsMode]}</button>`;

    const settingsHtml = `<a href="/settings" class="${activePage === 'settings' ? 'active' : ''}">⚙</a>`;

    const el = document.getElementById('geodash-header');
    if (!el) return;

    el.className = 'geodash-header';
    el.innerHTML = `
        <div class="geodash-header-left">
            <button class="geodash-refresh-btn" id="header-refresh-btn" title="Refresh page">↻</button>
            <img src="/static/icon.png" alt="" class="geodash-header-icon">
            <h1>Red Alert Geodash</h1>
            <nav class="geodash-nav">${pagesHtml}</nav>
            ${sep}
            <nav class="geodash-nav">${displayHtml}</nav>
            ${sep}
            <div class="geodash-ext-links">${tvLinksHtml}</div>
            ${sep}
            ${ttsBtnHtml}
            ${sep}
            <nav class="geodash-nav">${settingsHtml}</nav>
        </div>
        <div class="geodash-clocks">
            <div class="geodash-shabbat" id="shabbat-times"></div>
            <span class="geodash-clock-separator" id="shabbat-separator" style="display:none">|</span>
            <div class="geodash-clock-block">
                <span class="geodash-clock-label">Israel</span>
                <span class="geodash-clock-time" id="clock-local">--:--</span>
            </div>
            <span class="geodash-clock-separator">|</span>
            <div class="geodash-clock-block utc">
                <span class="geodash-clock-label">UTC</span>
                <span class="geodash-clock-time" id="clock-utc">--:--</span>
            </div>
        </div>
    `;

    // Refresh button
    document.getElementById('header-refresh-btn').addEventListener('click', () => {
        window.location.reload();
    });

    // Start clock
    function updateClock() {
        const now = new Date();
        const cl = document.getElementById('clock-local');
        const cu = document.getElementById('clock-utc');
        if (cl) cl.textContent = now.toLocaleTimeString('en-GB', {
            timeZone: 'Asia/Jerusalem', hour12: false, hour: '2-digit', minute: '2-digit',
        });
        if (cu) cu.textContent = now.toLocaleTimeString('en-GB', {
            timeZone: 'UTC', hour12: false, hour: '2-digit', minute: '2-digit',
        });
    }
    updateClock();
    setInterval(updateClock, 1000);

    // TTS mode cycle handler: chatty -> local -> off -> chatty
    const ttsBtn = document.getElementById('tts-toggle-btn');
    if (ttsBtn) {
        ttsBtn.addEventListener('click', () => {
            const current = getTtsMode();
            const idx = TTS_MODES.indexOf(current);
            const next = TTS_MODES[(idx + 1) % TTS_MODES.length];
            setTtsMode(next);
            ttsBtn.textContent = TTS_MODE_LABELS[next];
            ttsBtn.className = `geodash-tts-toggle ${TTS_MODE_CLASSES[next]}`;
            ttsBtn.title = TTS_MODE_TITLES[next];
            if (next === 'off') window.speechSynthesis?.cancel();
        });
    }

    // Fetch Shabbat times from Hebcal
    fetchShabbatTimes();
}

// ── Shabbat Times (Hebcal API) ──────────────────────────────────────────────

let _shabbatCache = null;

async function fetchShabbatTimes() {
    const container = document.getElementById('shabbat-times');
    const separator = document.getElementById('shabbat-separator');
    if (!container) return;

    // Use cache if fresh (fetched within last hour)
    if (_shabbatCache && (Date.now() - _shabbatCache.ts < 3600000)) {
        renderShabbatTimes(_shabbatCache.data);
        return;
    }

    try {
        // Jerusalem geonameid=281184
        const resp = await fetch('https://www.hebcal.com/shabbat?cfg=json&geonameid=281184&M=on');
        if (!resp.ok) return;
        const data = await resp.json();
        _shabbatCache = { data, ts: Date.now() };
        renderShabbatTimes(data);
    } catch (e) {
        console.warn('Could not fetch Shabbat times:', e);
    }
}

function renderShabbatTimes(data) {
    const container = document.getElementById('shabbat-times');
    const separator = document.getElementById('shabbat-separator');
    if (!container || !data || !data.items) return;

    let candles = null;
    let havdalah = null;
    let parashat = null;

    for (const item of data.items) {
        if (item.category === 'candles') candles = item;
        if (item.category === 'havdalah') havdalah = item;
        if (item.category === 'parashat') parashat = item;
    }

    if (!candles) return;

    const candleTime = new Date(candles.date).toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Jerusalem', hour12: false, hour: '2-digit', minute: '2-digit',
    });
    const havdalahTime = havdalah ? new Date(havdalah.date).toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Jerusalem', hour12: false, hour: '2-digit', minute: '2-digit',
    }) : null;

    let html = `<span class="geodash-shabbat-label">🕯</span>`;
    html += `<span class="geodash-shabbat-time">${candleTime}</span>`;
    if (havdalahTime) {
        html += `<span class="geodash-shabbat-label" style="margin-left:6px">✨</span>`;
        html += `<span class="geodash-shabbat-time">${havdalahTime}</span>`;
    }

    container.innerHTML = html;
    container.title = parashat ? `${parashat.title} | Candles: ${candleTime}${havdalahTime ? ' | Havdalah: ' + havdalahTime : ''}` : `Candles: ${candleTime}`;
    if (separator) separator.style.display = '';
}

// ── Footer Component ───────────────────────────────────────────────────────

function renderFooter() {
    const el = document.getElementById('geodash-footer');
    if (!el) return;

    el.className = 'geodash-footer';
    el.innerHTML = `<span class="motto">ביחד ננצח 🇮🇱</span> · <a href="/settings">Settings</a> · v1.8.0`;
}

// ── Relative Time Helper ───────────────────────────────────────────────────

function relativeTime(dateStr) {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr);
        const now = new Date();
        const diffMs = now - d;
        const diffMin = Math.floor(diffMs / 60000);
        const diffHr = Math.floor(diffMs / 3600000);
        const diffDay = Math.floor(diffMs / 86400000);

        if (diffMin < 1) return 'Just now';
        if (diffMin < 60) return `${diffMin}m ago`;
        if (diffHr < 24) return `${diffHr}h ago`;
        if (diffDay < 7) return `${diffDay}d ago`;
        return d.toLocaleDateString('en-GB', { timeZone: 'Asia/Jerusalem', day: '2-digit', month: '2-digit' });
    } catch {
        return dateStr;
    }
}

// ── Shared Helpers ─────────────────────────────────────────────────────────

function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}

function escapeAttr(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

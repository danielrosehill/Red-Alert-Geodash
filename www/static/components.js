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
    padding: clamp(8px, 0.8vh, 20px) clamp(16px, 1.5vw, 40px);
    background: #16213e;
    border-bottom: 2px solid #0f3460;
    flex-shrink: 0;
}

.geodash-header-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.geodash-header-icon {
    width: clamp(28px, 2.5vw, 48px);
    height: clamp(28px, 2.5vw, 48px);
    border-radius: 6px;
    flex-shrink: 0;
}

.geodash-header h1 {
    font-size: clamp(1.2rem, 1.4vw, 2rem);
    color: #7eddb8;
    margin: 0;
}

.geodash-nav {
    display: flex;
    gap: 2px;
    background: #0f3460;
    border-radius: 6px;
    padding: 2px;
}

.geodash-nav a {
    color: #ccd;
    padding: clamp(7px, 0.6vh, 14px) clamp(18px, 1.2vw, 32px);
    border-radius: 4px;
    font-size: clamp(0.88rem, 1vw, 1.4rem);
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 1px;
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
}

.geodash-clock-separator {
    color: #334;
    font-size: 1.4rem;
    font-weight: 300;
    margin: 0 14px;
}

.geodash-clock-block.utc .geodash-clock-label {
    color: #2a7a4a;
}

.geodash-clock-block.utc .geodash-clock-time {
    color: #3a9a5a;
    font-size: clamp(1.4rem, 1.8vw, 2.6rem);
    font-weight: 600;
}

.geodash-clock-block {
    display: flex;
    align-items: baseline;
    gap: 6px;
    font-variant-numeric: tabular-nums;
}

.geodash-clock-label {
    color: #bbc;
    font-size: clamp(0.78rem, 0.9vw, 1.3rem);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
}

.geodash-clock-time {
    color: #7eddb8;
    font-size: clamp(2.2rem, 2.8vw, 4rem);
    font-weight: 800;
    letter-spacing: 2px;
}

.geodash-refresh-btn {
    font-size: 1.1rem;
}

.geodash-nav-separator {
    color: #334;
    font-size: 1.2rem;
    font-weight: 300;
    margin: 0 8px;
    user-select: none;
}

.geodash-ext-links {
    display: flex;
    gap: 4px;
}

.geodash-ext-link {
    color: #aab;
    font-size: clamp(0.82rem, 0.9vw, 1.3rem);
    font-weight: 600;
    padding: clamp(5px, 0.5vh, 12px) clamp(12px, 1vw, 24px);
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
    font-size: clamp(1.1rem, 1.3vw, 2rem);
    padding: clamp(5px, 0.5vh, 12px) clamp(10px, 0.8vw, 20px);
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid #1a3a6e;
    background: none;
    transition: all 0.2s;
    line-height: 1;
}

.geodash-tts-toggle:hover {
    border-color: #7eddb8;
}

.geodash-tts-toggle.tts-on {
    color: #7eddb8;
    border-color: #7eddb8;
}

.geodash-tts-toggle.tts-off {
    color: #665;
    opacity: 0.6;
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

function renderHeader(activePage) {
    const sep = '<span class="geodash-nav-separator">|</span>';

    // Pages
    const pageLinks = [
        { href: '/', label: 'HOME', id: 'live' },
        { href: '/map', label: 'MAP', id: 'map' },
        { href: '/history', label: 'HISTORY', id: 'history' },
        { href: '/news', label: 'NEWS', id: 'news' },
        { href: '/alerts-news', label: 'ALERTS+NEWS', id: 'alerts-news' },
    ];

    // Display type
    const displayLinks = [
        { href: '/', label: 'Web', id: 'live' },
        { href: '/mobile', label: 'Mobile', id: 'mobile' },
        { href: '/tablet', label: 'Tablet', id: 'tablet' },
        { href: '/tv', label: 'TV', id: 'tv' },
    ];

    // TV links
    const tvLinks = [
        { href: 'https://www.oref.org.il/eng', label: 'HFC' },
        { href: 'https://www.kan.org.il/live/', label: 'KAN' },
        { href: 'https://video.i24news.tv/live/brightcove/en', label: 'i24' },
    ];

    const makeNav = (links) => links.map(p =>
        `<a href="${p.href}" class="${p.id === activePage ? 'active' : ''}">${p.label}</a>`
    ).join('');

    const pagesHtml = makeNav(pageLinks);
    const displayHtml = makeNav(displayLinks);

    const tvLinksHtml = tvLinks.map(l =>
        `<a href="${l.href}" target="_blank" rel="noopener" class="geodash-ext-link">${l.label}</a>`
    ).join('');

    const speechOn = localStorage.getItem('geodash-speech') !== 'false';
    const ttsClass = speechOn ? 'tts-on' : 'tts-off';
    const ttsIcon = speechOn ? '\u25B6' : '\u25A0';
    const ttsTitle = speechOn ? 'TTS: ON (click to disable)' : 'TTS: OFF (click to enable)';
    const ttsBtnHtml = `<button class="geodash-tts-toggle ${ttsClass}" id="tts-toggle-btn" title="${ttsTitle}">${ttsIcon}</button>`;

    const refreshHtml = `<a href="#" class="geodash-refresh-btn" onclick="event.preventDefault();window.location.reload();" title="Refresh page">↻</a>`;
    const settingsHtml = `<a href="/settings" class="${activePage === 'settings' ? 'active' : ''}">⚙</a>`;

    const el = document.getElementById('geodash-header');
    if (!el) return;

    el.className = 'geodash-header';
    el.innerHTML = `
        <div class="geodash-header-left">
            <a href="/" style="display:flex;align-items:center;gap:10px;text-decoration:none">
                <img src="/static/icon.png" alt="" class="geodash-header-icon">
                <h1>Red Alert Geodash</h1>
            </a>
            <nav class="geodash-nav">${pagesHtml}</nav>
            ${sep}
            <nav class="geodash-nav">${displayHtml}</nav>
            ${sep}
            <div class="geodash-ext-links">${tvLinksHtml}</div>
            ${sep}
            ${ttsBtnHtml}
            ${sep}
            <nav class="geodash-nav">${refreshHtml}${settingsHtml}</nav>
        </div>
        <div class="geodash-clocks">
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

    // TTS toggle handler
    const ttsBtn = document.getElementById('tts-toggle-btn');
    if (ttsBtn) {
        ttsBtn.addEventListener('click', () => {
            const isOn = localStorage.getItem('geodash-speech') !== 'false';
            const newState = !isOn;
            localStorage.setItem('geodash-speech', newState ? 'true' : 'false');
            ttsBtn.textContent = newState ? '\u25B6' : '\u25A0';
            ttsBtn.className = `geodash-tts-toggle ${newState ? 'tts-on' : 'tts-off'}`;
            ttsBtn.title = newState ? 'TTS: ON (click to disable)' : 'TTS: OFF (click to enable)';
            if (!newState) window.speechSynthesis?.cancel();
        });
    }
}

// ── Footer Component ───────────────────────────────────────────────────────

function renderFooter() {
    const el = document.getElementById('geodash-footer');
    if (!el) return;

    el.className = 'geodash-footer';
    el.innerHTML = `<span class="motto">ביחד ננצח</span> · <a href="/settings">Settings</a> · v1.7.0`;
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

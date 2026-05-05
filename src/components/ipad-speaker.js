/**
 * iPad Speaker View — auto-follows the main presenter via SSE.
 * Mirrors the Mac's S-key speaker view layout (notes-left + slide thumbs
 * right + synced timer) but works as a standalone URL on a remote device.
 *
 * URL: /?ipad-speaker
 *   Listens to /api/sync for { h, v, f, id, title } messages
 *   broadcasted by the main presenter when it changes slides.
 */
import { SPEAKER_NOTES } from './speaker-notes.js';

let slideOrder = [];          // Array of { id, title } in DOM order
let lang = 'de';
let currentH = 0;
let currentSlideId = null;
let sseSource = null;
let timerSec = 0;
let timerRunning = false;
let timerTarget = 900;        // 15 min
let timerInterval = null;

export async function initIpadSpeakerView() {
  document.title = 'Speaker View — Roodsaz Kolloquium';
  // Wipe any existing body content from the deck attempt
  document.body.innerHTML = '';
  document.body.classList.add('ipad-speaker-mode');

  injectStyles();
  await fetchSlideManifest();
  renderLayout();
  attachEventHandlers();
  connectSSE();
  startTimer();
  // Render initial state from the manifest (h=0)
  renderForIndex(0, 0, -1, slideOrder[0]?.id);
}

/**
 * Fetch the deck's HTML once to extract the ordered list of slide IDs +
 * H2 titles. The SSE messages give us the index `h`; this lets us map
 * `h → id` for the SPEAKER_NOTES lookup.
 */
async function fetchSlideManifest() {
  try {
    const res = await fetch('/?embed=manifest', { cache: 'no-store' });
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const sections = doc.querySelectorAll('.reveal .slides > section[id]');
    let countedRunningIdx = 0;
    slideOrder = Array.from(sections).map(sec => {
      const id = sec.id;
      // Only the language-specific span text — H2 contains both .lang-de
      // and .lang-en, taking textContent of the H2 concatenates them.
      const titleDE = sec.querySelector('h2 .lang-de')?.textContent.trim();
      const titleEN = sec.querySelector('h2 .lang-en')?.textContent.trim();
      const title = { de: titleDE || id, en: titleEN || titleDE || id };
      const counted = sec.getAttribute('data-visibility') !== 'uncounted';
      const countedIdx = counted ? ++countedRunningIdx : null;
      return { id, title, counted, countedIdx };
    });
  } catch (e) {
    console.warn('[iPad-Speaker] manifest fetch failed:', e);
  }
}

function countedTotal() {
  return slideOrder.filter(s => s.counted).length;
}

function renderLayout() {
  const root = document.createElement('div');
  root.id = 'ipad-speaker-root';
  root.innerHTML = `
    <header>
      <div class="header-left">
        <span class="indicator" id="connection-indicator">📡 Verbinde…</span>
        <button class="header-btn" id="lang-btn">${lang.toUpperCase()}</button>
      </div>
      <div class="header-center">
        <span class="slide-num" id="slide-num">— / —</span>
      </div>
      <div class="header-right">
        <span class="timer" id="timer-display" title="Tippen zum Starten/Stoppen">00:00 / 15:00</span>
      </div>
    </header>
    <main>
      <section class="notes-pane">
        <div class="slide-title-bar" id="slide-title">—</div>
        <div class="notes-content" id="notes-content"></div>
      </section>
      <aside class="slide-pane">
        <div class="slide-card current">
          <div class="slide-card-label">Aktuelle Folie</div>
          <div class="slide-iframe-wrap">
            <iframe id="current-iframe" src="about:blank"></iframe>
          </div>
        </div>
        <div class="slide-card upcoming">
          <div class="slide-card-label">Nächste Folie</div>
          <div class="slide-iframe-wrap">
            <iframe id="upcoming-iframe" src="about:blank"></iframe>
          </div>
        </div>
      </aside>
    </main>
  `;
  document.body.appendChild(root);
}

function attachEventHandlers() {
  document.getElementById('lang-btn').addEventListener('click', () => {
    lang = lang === 'de' ? 'en' : 'de';
    document.getElementById('lang-btn').textContent = lang.toUpperCase();
    renderNotes(currentSlideId);
  });

  document.getElementById('timer-display').addEventListener('click', () => {
    timerRunning = !timerRunning;
    document.getElementById('timer-display').classList.toggle('running', timerRunning);
  });
}

function connectSSE() {
  if (sseSource) sseSource.close();
  const indicator = document.getElementById('connection-indicator');

  sseSource = new EventSource('/api/sync');
  sseSource.addEventListener('open', () => {
    indicator.textContent = '📡 Verbunden';
    indicator.classList.remove('disconnected');
    indicator.classList.add('connected');
  });
  sseSource.onmessage = (evt) => {
    try {
      const data = JSON.parse(evt.data);
      if (typeof data.h === 'number') {
        renderForIndex(data.h, data.v ?? 0, data.f ?? -1, data.id);
      }
    } catch { /* ignore parse */ }
  };
  sseSource.onerror = () => {
    indicator.textContent = '📡 Getrennt — neuer Versuch …';
    indicator.classList.remove('connected');
    indicator.classList.add('disconnected');
    sseSource.close();
    setTimeout(connectSSE, 3000);
  };
}

function renderForIndex(h, v, f, id) {
  currentH = h;
  // Resolve slide ID — prefer the broadcaster's id field, else look up by index
  const resolvedId = id || slideOrder[h]?.id || null;
  currentSlideId = resolvedId;

  const total = slideOrder.length;
  const meta = slideOrder[h];
  const slideNum = meta?.counted
    ? `${meta.countedIdx} / ${countedTotal()}`
    : (lang === 'de' ? 'Backup' : 'Backup');
  document.getElementById('slide-num').textContent = total ? slideNum : '— / —';

  const titleEl = document.getElementById('slide-title');
  titleEl.textContent = meta?.title?.[lang] || meta?.title?.de || resolvedId || '—';

  // Iframes — only update if hash changed (avoid full reload on every fragment).
  // Reveal is configured with hashOneBasedIndex: true, so URL hashes are
  // 1-based — convert from 0-based deck index `h` to `h+1` for the URL.
  const cIframe = document.getElementById('current-iframe');
  const uIframe = document.getElementById('upcoming-iframe');
  const hashH = h + 1;                                // 1-based for URL
  const upcomingHashH = (h + 1 < total) ? hashH + 1 : hashH;
  const currentSrc = `/?embed=slide#/${hashH}/${v}/${f}`;
  const upcomingSrc = `/?embed=slide#/${upcomingHashH}/0/-1`;
  if (!cIframe.src.endsWith(currentSrc)) cIframe.src = currentSrc;
  if (!uIframe.src.endsWith(upcomingSrc)) uIframe.src = upcomingSrc;

  renderNotes(resolvedId);
}

function renderNotes(slideId) {
  const container = document.getElementById('notes-content');
  if (!slideId) {
    container.innerHTML = '<p class="empty">Keine Folie aktiv.</p>';
    return;
  }
  const note = SPEAKER_NOTES[slideId];
  if (!note) {
    container.innerHTML = `<p class="empty">Keine Notizen für <code>${slideId}</code>.</p>`;
    return;
  }
  container.innerHTML = buildNoteHTML(note, lang);
}

function buildNoteHTML(note, lang) {
  let html = '';
  if (note.time) html += `<p class="time">⏱ ${note.time}</p>`;
  if (note.bullets?.[lang]) {
    html += `<h4>${lang === 'de' ? 'Stichpunkte' : 'Bullets'}</h4><ul>`;
    for (const b of note.bullets[lang]) html += `<li>${b}</li>`;
    html += '</ul>';
  }
  if (note.script?.[lang]) {
    html += `<h4>${lang === 'de' ? 'Skript' : 'Script'}</h4>`;
    html += `<p class="script">${note.script[lang]}</p>`;
  }
  if (note.dataCallouts?.length) {
    html += `<h4>${lang === 'de' ? 'Wichtige Zahlen' : 'Key Numbers'}</h4><ul>`;
    for (const c of note.dataCallouts) html += `<li class="callout">${c}</li>`;
    html += '</ul>';
  }
  if (note.questions?.length) {
    html += `<h4>${lang === 'de' ? 'Mögliche Fragen' : 'Anticipated Questions'}</h4>`;
    for (const qa of note.questions) {
      html += `<p class="qa-q"><strong>F:</strong> ${qa.q[lang]}</p>`;
      html += `<p class="qa-a"><strong>A:</strong> ${qa.a[lang]}</p>`;
    }
  }
  if (note.transition?.[lang]) {
    html += `<p class="transition">→ ${note.transition[lang]}</p>`;
  }
  return html;
}

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!timerRunning) return;
    timerSec++;
    updateTimerDisplay();
  }, 1000);
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const el = document.getElementById('timer-display');
  if (!el) return;
  const m = Math.floor(timerSec / 60).toString().padStart(2, '0');
  const s = (timerSec % 60).toString().padStart(2, '0');
  const tm = Math.floor(timerTarget / 60).toString().padStart(2, '0');
  el.textContent = `${m}:${s} / ${tm}:00`;
  el.classList.toggle('overtime', timerSec >= timerTarget);
  el.classList.toggle('warning', timerSec >= timerTarget * 0.9 && timerSec < timerTarget);
}

function injectStyles() {
  const style = document.createElement('style');
  style.id = 'ipad-speaker-styles';
  style.textContent = `
    body.ipad-speaker-mode {
      margin: 0; padding: 0;
      background: #0a0a14; color: #e2e8f0;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      overflow: hidden;
      height: 100vh; width: 100vw;
      -webkit-text-size-adjust: 100%;
    }
    body.ipad-speaker-mode * { box-sizing: border-box; }

    #ipad-speaker-root {
      display: flex; flex-direction: column;
      height: 100vh; width: 100vw;
    }

    /* HEADER */
    #ipad-speaker-root > header {
      display: grid; grid-template-columns: 1fr auto 1fr;
      align-items: center;
      padding: 0.5rem 1rem;
      background: rgba(20, 20, 35, 0.95);
      border-bottom: 2px solid #E2001A;
      flex-shrink: 0;
    }
    .header-left { display: flex; gap: 0.6rem; align-items: center; justify-self: start; }
    .header-center { justify-self: center; }
    .header-right { display: flex; gap: 0.6rem; align-items: center; justify-self: end; }

    .indicator {
      background: #555; color: #fff;
      padding: 0.25rem 0.7rem;
      border-radius: 14px;
      font-size: 0.8rem; font-weight: 500;
      transition: background 0.3s;
    }
    .indicator.connected { background: #00C9A7; }
    .indicator.disconnected { background: #E2001A; }

    .header-btn {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.3);
      color: #e2e8f0;
      padding: 0.25rem 0.7rem;
      border-radius: 14px;
      font-size: 0.85rem; font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    .header-btn:active { background: rgba(255,255,255,0.1); }

    .timer {
      font-variant-numeric: tabular-nums;
      font-weight: 700;
      font-size: 1.6rem;
      cursor: pointer;
      padding: 0.2rem 0.7rem;
      border-radius: 8px;
      color: #e2e8f0;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
    }
    .timer.running { color: #00C9A7; }
    .timer.warning { color: #FFB800; }
    .timer.overtime { color: #E2001A; animation: ipad-pulse 1s infinite; }

    .slide-num {
      font-variant-numeric: tabular-nums;
      font-size: 1rem; color: #888;
      font-weight: 500;
    }

    /* MAIN */
    #ipad-speaker-root > main {
      flex: 1;
      display: grid;
      grid-template-columns: 60% 40%;
      overflow: hidden;
      min-height: 0;
    }

    /* NOTES PANE */
    .notes-pane {
      display: flex; flex-direction: column;
      overflow: hidden;
      border-right: 1px solid rgba(255,255,255,0.08);
    }
    .slide-title-bar {
      flex-shrink: 0;
      padding: 0.7rem 1.2rem;
      font-size: 1.15rem; font-weight: 700;
      color: #E2001A;
      background: rgba(0,0,0,0.3);
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .notes-content {
      flex: 1;
      padding: 0.8rem 1.2rem 1.5rem;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      font-size: 0.95rem;
      line-height: 1.55;
    }
    .notes-content h4 {
      color: #E2001A;
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin: 1.1rem 0 0.4rem;
      font-weight: 700;
    }
    .notes-content h4:first-child { margin-top: 0; }
    .notes-content ul { padding-left: 1.4rem; margin: 0.4rem 0; }
    .notes-content li { margin: 0.25rem 0; color: #cbd5e1; }
    .notes-content p { margin: 0.4rem 0; }
    .notes-content .time { color: #888; font-size: 0.85rem; margin-top: 0; }
    .notes-content .script {
      font-style: italic;
      line-height: 1.7;
      color: #e2e8f0;
      background: rgba(255,255,255,0.03);
      padding: 0.7rem 0.9rem;
      border-left: 3px solid #4C9AFF;
      border-radius: 4px;
    }
    .notes-content .callout {
      color: #FFB800; font-weight: 600;
    }
    .notes-content .qa-q {
      color: #4C9AFF; margin: 0.5em 0 0.15em;
      font-weight: 500;
    }
    .notes-content .qa-a {
      color: #94a3b8; margin: 0 0 0.6em 1em; font-size: 0.9em;
    }
    .notes-content .transition {
      color: #4C9AFF;
      padding: 0.5rem 0.7rem;
      margin-top: 1rem;
      border-left: 3px solid #4C9AFF;
      background: rgba(76,154,255,0.06);
      border-radius: 4px;
      font-style: italic;
    }
    .notes-content .empty {
      color: #555; font-style: italic; text-align: center; padding: 2rem;
    }
    .notes-content code {
      background: rgba(255,255,255,0.08);
      padding: 0.1em 0.3em;
      border-radius: 3px;
      font-size: 0.85em;
    }

    /* SLIDE PANE */
    .slide-pane {
      display: flex; flex-direction: column;
      padding: 0.6rem;
      gap: 0.6rem;
      overflow: hidden;
    }
    .slide-card {
      display: flex; flex-direction: column;
      background: #fff;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0,0,0,0.4);
    }
    .slide-card.current { flex: 1.4; }
    .slide-card.upcoming { flex: 1; opacity: 0.9; }
    .slide-card-label {
      padding: 0.35rem 0.7rem;
      background: rgba(20,20,35,0.95);
      color: #E2001A;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .slide-iframe-wrap {
      flex: 1;
      position: relative;
      background: #fff;
      overflow: hidden;
    }
    .slide-iframe-wrap iframe {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      border: 0;
    }

    @keyframes ipad-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.45; }
    }

    /* Hint at the bottom for first-time use */
    .notes-content .empty::after {
      content: 'Wenn Sie auf dem Mac eine Folie ändern, aktualisiert sich diese Ansicht automatisch.';
      display: block;
      margin-top: 0.8rem;
      font-size: 0.85rem;
      color: #666;
    }
  `;
  document.head.appendChild(style);
}

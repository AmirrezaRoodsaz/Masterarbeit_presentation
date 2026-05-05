/**
 * iPad Speaker View — auto-follows the main presenter via SSE.
 *
 * URL: /?ipad-speaker
 * Layout: full-width notes panel (no slide thumbnails).
 * SSE channels:
 *   /api/sync  — slide position { h, v, f, id, title }
 *   /api/timer — presentation timer { seconds, running, target, warning, overtime }
 *
 * Both channels replay the last known state to new clients on connect,
 * so the iPad shows the current slide + current timer immediately even
 * if the Mac hasn't broadcast since the iPad opened.
 */
import { SPEAKER_NOTES } from './speaker-notes.js';

let slideOrder = [];     // [{ id, title{de,en}, counted, countedIdx }]
let lang = 'de';
let currentSlideId = null;
let sseSync = null;
let sseTimer = null;

export async function initIpadSpeakerView() {
  document.title = 'Speaker View — Roodsaz Kolloquium';
  document.body.innerHTML = '';
  document.body.classList.add('ipad-speaker-mode');

  injectStyles();
  await fetchSlideManifest();
  renderLayout();
  attachEventHandlers();
  connectSSE();
  // Render initial placeholder until first SSE message arrives
  renderForIndex(0, 0, -1, slideOrder[0]?.id);
}

async function fetchSlideManifest() {
  try {
    const res = await fetch('/?embed=manifest', { cache: 'no-store' });
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const sections = doc.querySelectorAll('.reveal .slides > section[id]');
    let countedRunningIdx = 0;
    slideOrder = Array.from(sections).map(sec => {
      const id = sec.id;
      // Read DE / EN spans separately — h2.textContent would concatenate them.
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
        <span class="last-sync" id="last-sync" title="Letzte Aktualisierung vom Mac">—</span>
        <button class="header-btn" id="lang-btn">${lang.toUpperCase()}</button>
      </div>
      <div class="header-center">
        <span class="slide-num" id="slide-num">— / —</span>
      </div>
      <div class="header-right">
        <span class="timer" id="timer-display">00:00 / 15:00</span>
      </div>
    </header>
    <main>
      <div class="slide-title-bar" id="slide-title">—</div>
      <div class="notes-content" id="notes-content"></div>
    </main>
  `;
  document.body.appendChild(root);
}

function attachEventHandlers() {
  document.getElementById('lang-btn').addEventListener('click', () => {
    lang = lang === 'de' ? 'en' : 'de';
    document.getElementById('lang-btn').textContent = lang.toUpperCase();
    renderNotes(currentSlideId);
    // Re-render slide-num + title in the new language too
    const meta = slideOrder.find(s => s.id === currentSlideId);
    if (meta) {
      document.getElementById('slide-title').textContent = meta.title[lang] || meta.id;
    }
  });
}

function connectSSE() {
  const indicator = document.getElementById('connection-indicator');

  // /api/sync — slide position
  if (sseSync) sseSync.close();
  sseSync = new EventSource('/api/sync');
  sseSync.addEventListener('open', () => {
    indicator.textContent = '📡 Verbunden';
    indicator.classList.remove('disconnected');
    indicator.classList.add('connected');
  });
  sseSync.onmessage = (evt) => {
    try {
      const data = JSON.parse(evt.data);
      if (typeof data.h === 'number') {
        renderForIndex(data.h, data.v ?? 0, data.f ?? -1, data.id);
        markSync('slide');
      }
    } catch { /* ignore */ }
  };
  sseSync.onerror = () => {
    indicator.textContent = '📡 Getrennt — neuer Versuch …';
    indicator.classList.remove('connected');
    indicator.classList.add('disconnected');
    sseSync.close();
    setTimeout(() => connectSSE(), 3000);
  };

  // /api/timer — synced timer from the Mac
  if (sseTimer) sseTimer.close();
  sseTimer = new EventSource('/api/timer');
  sseTimer.onmessage = (evt) => {
    try {
      const data = JSON.parse(evt.data);
      updateTimer(data);
      markSync('timer');
    } catch { /* ignore */ }
  };
  // Don't reconnect timer separately; sync's reconnect handles network
}

function renderForIndex(h, v, f, id) {
  const resolvedId = id || slideOrder[h]?.id || null;
  currentSlideId = resolvedId;

  const total = slideOrder.length;
  const meta = slideOrder[h];
  const slideNum = meta?.counted
    ? `${meta.countedIdx} / ${countedTotal()}`
    : 'Backup';
  document.getElementById('slide-num').textContent = total ? slideNum : '— / —';

  const titleEl = document.getElementById('slide-title');
  titleEl.textContent = meta?.title?.[lang] || meta?.title?.de || resolvedId || '—';

  renderNotes(resolvedId);
}

function renderNotes(slideId) {
  const container = document.getElementById('notes-content');
  if (!slideId) {
    container.innerHTML = '<p class="empty">Keine Folie aktiv. Wenn Sie auf dem Mac eine Folie ändern, aktualisiert sich diese Ansicht automatisch.</p>';
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

function markSync(kind) {
  const el = document.getElementById('last-sync');
  if (!el) return;
  const now = new Date();
  const t = now.toTimeString().slice(0, 8);
  el.textContent = `↻ ${kind} ${t}`;
  el.classList.add('flash');
  setTimeout(() => el.classList.remove('flash'), 350);
}

function updateTimer(state) {
  const el = document.getElementById('timer-display');
  if (!el) return;
  const sec = state.seconds || 0;
  const target = state.target || 900;
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  const tm = Math.floor(target / 60).toString().padStart(2, '0');
  el.textContent = `${m}:${s} / ${tm}:00`;
  el.classList.toggle('running', !!state.running && !state.overtime);
  el.classList.toggle('warning', !!state.warning);
  el.classList.toggle('overtime', !!state.overtime);
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

    .last-sync {
      font-size: 0.7rem;
      color: #888;
      font-variant-numeric: tabular-nums;
      transition: color 0.3s;
    }
    .last-sync.flash { color: #00C9A7; }

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
      padding: 0.2rem 0.7rem;
      border-radius: 8px;
      color: #888;
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

    /* MAIN — full-width notes, no slide thumbnails */
    #ipad-speaker-root > main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-height: 0;
    }
    .slide-title-bar {
      flex-shrink: 0;
      padding: 0.8rem 1.5rem;
      font-size: 1.35rem; font-weight: 700;
      color: #E2001A;
      background: rgba(0,0,0,0.3);
      border-bottom: 1px solid rgba(255,255,255,0.08);
      line-height: 1.3;
    }
    .notes-content {
      flex: 1;
      padding: 1rem 1.8rem 2rem;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      font-size: 1.05rem;
      line-height: 1.6;
      max-width: 1100px;
      margin: 0 auto;
      width: 100%;
    }
    .notes-content h4 {
      color: #E2001A;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      margin: 1.4rem 0 0.5rem;
      font-weight: 700;
    }
    .notes-content h4:first-child { margin-top: 0.5rem; }
    .notes-content ul { padding-left: 1.5rem; margin: 0.5rem 0; }
    .notes-content li { margin: 0.35rem 0; color: #cbd5e1; }
    .notes-content p { margin: 0.5rem 0; }
    .notes-content .time { color: #888; font-size: 0.9rem; margin-top: 0; }
    .notes-content .script {
      font-style: italic;
      line-height: 1.75;
      color: #e2e8f0;
      background: rgba(255,255,255,0.03);
      padding: 0.9rem 1.1rem;
      border-left: 3px solid #4C9AFF;
      border-radius: 4px;
      font-size: 1.08rem;
    }
    .notes-content .callout {
      color: #FFB800; font-weight: 600;
    }
    .notes-content .qa-q {
      color: #4C9AFF; margin: 0.7em 0 0.2em;
      font-weight: 500;
    }
    .notes-content .qa-a {
      color: #94a3b8; margin: 0 0 0.8em 1em; font-size: 0.95em;
    }
    .notes-content .transition {
      color: #4C9AFF;
      padding: 0.6rem 0.9rem;
      margin-top: 1.2rem;
      border-left: 3px solid #4C9AFF;
      background: rgba(76,154,255,0.06);
      border-radius: 4px;
      font-style: italic;
    }
    .notes-content .empty {
      color: #555; font-style: italic; text-align: center; padding: 3rem 1rem;
      font-size: 1rem;
    }
    .notes-content code {
      background: rgba(255,255,255,0.08);
      padding: 0.1em 0.3em;
      border-radius: 3px;
      font-size: 0.9em;
    }

    @keyframes ipad-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.45; }
    }
  `;
  document.head.appendChild(style);
}

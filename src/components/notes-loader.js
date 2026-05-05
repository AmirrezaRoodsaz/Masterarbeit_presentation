/**
 * Notes Loader — injects speaker notes into Reveal.js slides.
 * Gated behind URL parameters:
 *   ?presenter    — inject notes + enable S key for Speaker View
 *   ?print-notes  — render printable notes page
 *   ?follow       — auto-sync slide position via SSE + show visible notes panel
 */
import { SPEAKER_NOTES } from './speaker-notes.js';
import { getTimerState } from './shell.js';

let deck = null;
let sseSource = null;
let notesPanel = null;
let speakerWindow = null;

/**
 * Initialize notes system. Call after deck.initialize().
 */
export function initNotesLoader(deckInstance) {
  deck = deckInstance;
  const params = new URLSearchParams(window.location.search);

  // Mode 1: Print notes — replaces entire page
  if (params.has('print-notes')) {
    renderPrintNotes();
    return;
  }

  // Mode 2: Presenter — inject <aside class="notes">
  if (params.has('presenter')) {
    injectNotes();
  }

  // Listen for speaker view open (from keyboard/gamepad binding)
  // Only in presenter mode (not follow mode)
  if (params.has('presenter') && !params.has('follow')) {
    document.addEventListener('open-speaker-view', () => openCustomSpeakerView());
  }

  // Mode 3: Follow — SSE auto-sync + always-visible notes panel
  if (params.has('follow')) {
    initFollowMode();
    // Notes panel is always on — no key press needed
    createNotesPanel();
  }

  // Always broadcast slide + fragment changes if we're the main presenter (no ?follow)
  if (!params.has('follow')) {
    deck.on('slidechanged', () => broadcastSlide());
    deck.on('fragmentshown', () => broadcastSlide());
    deck.on('fragmenthidden', () => broadcastSlide());
    // Broadcast initial position
    setTimeout(() => broadcastSlide(), 500);
  }

  // Gamepad scroll → scroll speaker view notes panel
  document.addEventListener('gamepad-scroll-notes', (e) => {
    const delta = e.detail?.delta || 0;
    if (!delta) return;

    // Scroll the speaker view popup (if open). Reveal's structure has
    // changed across versions: try the inner notes container first
    // (most reliable scroller), then the outer panel, then the window
    // itself as a final fallback.
    if (speakerWindow && !speakerWindow.closed) {
      try {
        const doc = speakerWindow.document;
        const candidates = [
          doc.querySelector('#speaker-controls-notes .value'),
          doc.getElementById('speaker-controls-notes'),
          doc.getElementById('speaker-controls'),
        ].filter(Boolean);

        let scrolled = false;
        for (const el of candidates) {
          // Only scroll an element that can actually scroll
          if (el.scrollHeight > el.clientHeight + 1) {
            el.scrollBy({ top: delta, behavior: 'auto' });
            scrolled = true;
            break;
          }
        }
        if (!scrolled) {
          // Fallback: scroll the popup window itself
          speakerWindow.scrollBy({ top: delta, behavior: 'auto' });
        }
      } catch { /* cross-origin or closed */ }
    }

    // Also scroll the follow-mode notes panel (if visible)
    if (notesPanel) {
      notesPanel.scrollBy({ top: delta, behavior: 'auto' });
    }
  });
}

/**
 * Open the Reveal.js Speaker View and inject custom "notes-left" layout.
 * Captures the popup window reference by temporarily wrapping window.open.
 */
function openCustomSpeakerView() {
  const origOpen = window.open;
  let speakerWin = null;

  window.open = function (...args) {
    speakerWin = origOpen.apply(this, args);
    return speakerWin;
  };

  const notesPlugin = deck.getPlugin('notes');
  if (notesPlugin && typeof notesPlugin.open === 'function') {
    notesPlugin.open();
  }

  window.open = origOpen;

  if (speakerWin && !speakerWin.closed) {
    speakerWindow = speakerWin;
    injectSpeakerViewLayout(speakerWin);
    initTimerSync(speakerWin);
  }
}

/**
 * Inject custom CSS + resizable layout into the speaker view popup window.
 * Layout: notes on the left, current slide top-right, upcoming bottom-right.
 * Three-dot drag handles allow resizing both the horizontal and vertical splits.
 */
function injectSpeakerViewLayout(win) {
  const inject = () => {
    try {
      const doc = win.document;
      if (!doc || !doc.body) { setTimeout(inject, 100); return; }

      // Inject custom layout CSS
      const style = doc.createElement('style');
      style.textContent = `
        /* Custom layout: Notes left (bigger), slides stacked right */
        body[data-speaker-layout="notes-left"] #speaker-controls {
          position: absolute;
          top: 0;
          left: 0;
          width: 75%;
          height: 100%;
          font-size: 1.25em;
          padding-top: 10px;
          overflow-y: auto;
        }
        body[data-speaker-layout="notes-left"] #current-slide {
          position: absolute;
          top: 0;
          left: 75%;
          width: 25%;
          height: 55%;
          padding: 6px;
        }
        body[data-speaker-layout="notes-left"] #upcoming-slide {
          position: absolute;
          top: 55%;
          left: 75%;
          width: 25%;
          height: 45%;
          padding: 6px;
        }
        /* Dark theme for notes panel */
        body[data-speaker-layout="notes-left"] {
          background: #1a1a2e;
          color: #e2e8f0;
        }
        body[data-speaker-layout="notes-left"] .speaker-controls-time {
          border-bottom-color: rgba(255,255,255,0.15);
        }
        body[data-speaker-layout="notes-left"] .speaker-controls-time .label,
        body[data-speaker-layout="notes-left"] .speaker-controls-notes .label {
          color: #E2001A;
        }
        body[data-speaker-layout="notes-left"] .speaker-controls-notes .value {
          font-size: 1.1em;
          line-height: 1.6;
        }
        body[data-speaker-layout="notes-left"] .overlay-element {
          background: rgba(30, 30, 50, 0.9);
          color: #ccc;
        }
        body[data-speaker-layout="notes-left"] #speaker-layout {
          right: auto;
          left: 10px;
        }

        /* ─── Resize handles ─── */
        .resize-handle {
          position: absolute;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .resize-handle::after {
          content: '⋮⋮';
          letter-spacing: 2px;
          color: rgba(255,255,255,0.35);
          font-size: 14px;
          pointer-events: none;
        }
        .resize-handle:hover::after,
        .resize-handle.dragging::after {
          color: rgba(255,255,255,0.7);
        }

        /* Vertical handle — between notes (left) and slides (right) */
        .resize-handle-v {
          top: 0;
          width: 10px;
          height: 100%;
          cursor: col-resize;
        }
        .resize-handle-v::after {
          content: '⋮';
          font-size: 18px;
        }
        .resize-handle-v:hover,
        .resize-handle-v.dragging {
          background: rgba(226,0,26,0.25);
        }

        /* Horizontal handle — between current and upcoming slide */
        .resize-handle-h {
          width: 100%;
          height: 10px;
          cursor: row-resize;
        }
        .resize-handle-h::after {
          content: '⋯';
          font-size: 18px;
          letter-spacing: 0;
        }
        .resize-handle-h:hover,
        .resize-handle-h.dragging {
          background: rgba(226,0,26,0.25);
        }

        /* Prevent iframe from stealing mouse during drag */
        body.resizing iframe {
          pointer-events: none !important;
        }

        /* Hide the built-in timer — we use the main app's synced timer */
        .speaker-controls-time .timer,
        .speaker-controls-time .pacing-title,
        .speaker-controls-time .pacing,
        .speaker-controls-time .reset-button { display: none !important; }

        .synced-timer {
          font-size: 2.4em;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
          color: #e2e8f0;
          margin: 0.15em 0 0.3em;
        }
        .synced-timer.paused { opacity: 0.45; }
        .synced-timer.warning { color: #FFB800; }
        .synced-timer.overtime { color: #E2001A; }
      `;
      doc.head.appendChild(style);

      // Add "Notes Left" to the layout dropdown
      const dropdown = doc.querySelector('.speaker-layout-dropdown');
      if (dropdown && !dropdown.querySelector('option[value="notes-left"]')) {
        const option = doc.createElement('option');
        option.value = 'notes-left';
        option.textContent = 'Notes Left';
        dropdown.appendChild(option);
      }

      // Set the layout
      doc.body.setAttribute('data-speaker-layout', 'notes-left');
      if (dropdown) dropdown.value = 'notes-left';
      const label = doc.querySelector('.speaker-layout-label');
      if (label) label.innerHTML = 'Layout: Notes Left';

      // ─── Create resize handles ───
      const handleV = doc.createElement('div');
      handleV.className = 'resize-handle resize-handle-v';
      doc.body.appendChild(handleV);

      const handleH = doc.createElement('div');
      handleH.className = 'resize-handle resize-handle-h';
      doc.body.appendChild(handleH);

      const notesEl = doc.getElementById('speaker-controls');
      const currentEl = doc.getElementById('current-slide');
      const upcomingEl = doc.getElementById('upcoming-slide');

      // State: initial split ratios
      let splitX = 0.75;   // notes width fraction
      let splitY = 0.55;   // current-slide height fraction (of right column)

      function applyLayout() {
        const rightW = 1 - splitX;

        notesEl.style.width = (splitX * 100) + '%';
        currentEl.style.left = (splitX * 100) + '%';
        currentEl.style.width = (rightW * 100) + '%';
        currentEl.style.height = (splitY * 100) + '%';
        upcomingEl.style.left = (splitX * 100) + '%';
        upcomingEl.style.width = (rightW * 100) + '%';
        upcomingEl.style.top = (splitY * 100) + '%';
        upcomingEl.style.height = ((1 - splitY) * 100) + '%';

        // Position handles
        handleV.style.left = (splitX * 100) + '%';
        handleV.style.marginLeft = '-5px';
        handleH.style.top = (splitY * 100) + '%';
        handleH.style.left = (splitX * 100) + '%';
        handleH.style.width = (rightW * 100) + '%';
        handleH.style.marginTop = '-5px';
      }

      applyLayout();

      // ─── Drag logic ───
      let dragging = null; // 'v' or 'h'

      handleV.addEventListener('mousedown', (e) => {
        e.preventDefault();
        dragging = 'v';
        handleV.classList.add('dragging');
        doc.body.classList.add('resizing');
      });

      handleH.addEventListener('mousedown', (e) => {
        e.preventDefault();
        dragging = 'h';
        handleH.classList.add('dragging');
        doc.body.classList.add('resizing');
      });

      doc.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        if (dragging === 'v') {
          splitX = Math.max(0.3, Math.min(0.85, e.clientX / win.innerWidth));
        } else {
          splitY = Math.max(0.2, Math.min(0.85, e.clientY / win.innerHeight));
        }
        applyLayout();
      });

      doc.addEventListener('mouseup', () => {
        if (!dragging) return;
        handleV.classList.remove('dragging');
        handleH.classList.remove('dragging');
        doc.body.classList.remove('resizing');
        dragging = null;
      });

    } catch {
      setTimeout(inject, 200);
    }
  };

  setTimeout(inject, 500);
}

/**
 * Sync the main page timer with the speaker view.
 * The built-in timer is hidden via CSS. We insert our own element
 * and drive it exclusively from the main page's timer-sync events.
 */
function initTimerSync(win) {
  let timerEl = null;

  const ensureElement = () => {
    if (timerEl) return true;
    try {
      if (win.closed) return false;
      const doc = win.document;
      const timeSection = doc.querySelector('.speaker-controls-time');
      if (!timeSection) return false;
      timerEl = doc.createElement('div');
      timerEl.className = 'synced-timer paused';
      timerEl.textContent = '00:00';
      timeSection.appendChild(timerEl);
      // Push current state
      updateDisplay(getTimerState());
      return true;
    } catch { return false; }
  };

  const updateDisplay = (state) => {
    if (!timerEl) return;
    const s = state.seconds;
    const mins = Math.floor(s / 60).toString().padStart(2, '0');
    const secs = (s % 60).toString().padStart(2, '0');
    timerEl.textContent = `${mins}:${secs}`;
    timerEl.classList.toggle('paused', !state.running);
    timerEl.classList.toggle('warning', state.warning || false);
    timerEl.classList.toggle('overtime', state.overtime || false);
  };

  document.addEventListener('timer-sync', (e) => {
    if (ensureElement()) updateDisplay(e.detail);
  });

  // Retry element creation until speaker view is ready
  const retry = setInterval(() => {
    if (win.closed) { clearInterval(retry); return; }
    if (ensureElement()) clearInterval(retry);
  }, 300);
}

/**
 * Inject <aside class="notes"> into each slide section from SPEAKER_NOTES data.
 */
function injectNotes() {
  const isEnglish = document.body.classList.contains('lang-en');
  const lang = isEnglish ? 'en' : 'de';

  for (const [slideId, note] of Object.entries(SPEAKER_NOTES)) {
    const section = document.getElementById(slideId);
    if (!section) continue;

    // Build notes HTML
    const html = buildNoteHTML(note, lang);
    const aside = document.createElement('aside');
    aside.className = 'notes';
    aside.innerHTML = html;
    section.appendChild(aside);
  }

  // Re-inject on language change
  document.addEventListener('toggle-language', () => {
    document.querySelectorAll('aside.notes').forEach(n => n.remove());
    injectNotes();
  });
}

/**
 * Build the HTML content for a single slide's notes.
 */
function buildNoteHTML(note, lang) {
  let html = '';

  // Time marker
  if (note.time) {
    html += `<p style="color:#888;font-size:0.85em;">⏱ ${note.time}</p>`;
  }

  // Bullet points
  if (note.bullets && note.bullets[lang]) {
    html += '<ul>';
    for (const bullet of note.bullets[lang]) {
      html += `<li>${bullet}</li>`;
    }
    html += '</ul>';
  }

  // Full script
  if (note.script && note.script[lang]) {
    html += `<hr><p><strong>${lang === 'de' ? 'Skript' : 'Script'}:</strong></p>`;
    html += `<p style="font-style:italic;">${note.script[lang]}</p>`;
  }

  // Data callouts
  if (note.dataCallouts && note.dataCallouts.length > 0) {
    html += `<p><strong>${lang === 'de' ? 'Wichtige Zahlen' : 'Key Numbers'}:</strong></p><ul>`;
    for (const callout of note.dataCallouts) {
      html += `<li style="color:#E2001A;font-weight:600;">${callout}</li>`;
    }
    html += '</ul>';
  }

  // Anticipated questions
  if (note.questions && note.questions.length > 0) {
    html += `<p><strong>${lang === 'de' ? 'Mögliche Fragen' : 'Anticipated Questions'}:</strong></p>`;
    for (const qa of note.questions) {
      html += `<p style="margin:0.3em 0;"><strong>Q:</strong> ${qa.q[lang]}</p>`;
      html += `<p style="margin:0.3em 0 0.8em;color:#666;"><strong>A:</strong> ${qa.a[lang]}</p>`;
    }
  }

  // Transition
  if (note.transition && note.transition[lang]) {
    html += `<hr><p style="color:#4C9AFF;">→ ${note.transition[lang]}</p>`;
  }

  return html;
}

/**
 * Create a visible notes panel at the bottom of the viewport.
 * Used on iPad where Speaker View popup doesn't work.
 */
function createNotesPanel() {
  if (!deck) return;

  notesPanel = document.createElement('div');
  notesPanel.id = 'notes-panel';
  notesPanel.innerHTML = `
    <div class="notes-panel-header">
      <span class="notes-panel-title">Speaker Notes</span>
      <span class="notes-panel-time"></span>
    </div>
    <div class="notes-panel-content"></div>
  `;
  document.body.appendChild(notesPanel);

  // Add class to body for CSS targeting (fallback for :has() on older Safari)
  document.body.classList.add('has-notes-panel');

  // Inject panel styles
  const style = document.createElement('style');
  style.textContent = `
    #notes-panel {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      max-height: 35vh;
      background: rgba(10, 10, 20, 0.95);
      backdrop-filter: blur(12px);
      color: #e2e8f0;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 0.85rem;
      line-height: 1.5;
      z-index: 9998;
      overflow-y: auto;
      border-top: 2px solid #E2001A;
      padding: 0;
      -webkit-overflow-scrolling: touch;
    }
    .notes-panel-header {
      position: sticky;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 1rem;
      background: rgba(20, 20, 35, 0.98);
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .notes-panel-title {
      font-weight: 600;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #E2001A;
    }
    .notes-panel-time {
      font-size: 0.75rem;
      color: #888;
    }
    .notes-panel-content {
      padding: 0.75rem 1rem 1rem;
    }
    .notes-panel-content ul {
      margin: 0.3rem 0;
      padding-left: 1.2rem;
    }
    .notes-panel-content li {
      margin: 0.2rem 0;
    }
    .notes-panel-content hr {
      border: none;
      border-top: 1px solid rgba(255,255,255,0.1);
      margin: 0.5rem 0;
    }
    .notes-panel-content p {
      margin: 0.3rem 0;
    }
    /* Shrink Reveal viewport to make room for notes panel */
    body:has(#notes-panel) .reveal,
    body.has-notes-panel .reveal {
      height: 65vh !important;
    }
  `;
  document.head.appendChild(style);

  // Update on slide change
  updateNotesPanel();
  deck.on('slidechanged', () => updateNotesPanel());
  document.addEventListener('toggle-language', () => updateNotesPanel());
}

/**
 * Update the visible notes panel with current slide's notes.
 */
function updateNotesPanel() {
  if (!notesPanel || !deck) return;

  const currentSlide = deck.getCurrentSlide();
  if (!currentSlide) return;

  const slideId = currentSlide.id;
  const note = SPEAKER_NOTES[slideId];
  const contentEl = notesPanel.querySelector('.notes-panel-content');
  const timeEl = notesPanel.querySelector('.notes-panel-time');

  if (!note) {
    contentEl.innerHTML = '<p style="color:#666;">—</p>';
    timeEl.textContent = '';
    return;
  }

  const isEnglish = document.body.classList.contains('lang-en');
  const lang = isEnglish ? 'en' : 'de';

  contentEl.innerHTML = buildNoteHTML(note, lang);
  timeEl.textContent = note.time || '';
}

/**
 * Render a full-page printable notes view.
 */
function renderPrintNotes() {
  const isEnglish = document.body.classList.contains('lang-en');
  const lang = isEnglish ? 'en' : 'de';

  // Hide normal presentation
  document.getElementById('app-shell').style.display = 'none';

  const container = document.createElement('div');
  container.id = 'print-notes-container';
  container.innerHTML = `
    <style>
      #print-notes-container {
        font-family: 'Inter', system-ui, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
        color: #1a1a2e;
        background: white;
      }
      .print-header {
        text-align: center;
        border-bottom: 2px solid #E2001A;
        padding-bottom: 1rem;
        margin-bottom: 2rem;
      }
      .print-header h1 { font-size: 1.5rem; margin: 0; }
      .print-header p { color: #666; margin: 0.3rem 0; }
      .print-slide {
        page-break-inside: avoid;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 1.2rem;
        margin-bottom: 1.5rem;
      }
      .print-slide-header {
        display: flex;
        align-items: baseline;
        gap: 0.8rem;
        margin-bottom: 0.8rem;
        border-bottom: 1px solid #eee;
        padding-bottom: 0.5rem;
      }
      .print-slide-num {
        background: #E2001A;
        color: white;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.9rem;
        flex-shrink: 0;
      }
      .print-slide-title {
        font-weight: 600;
        font-size: 1.1rem;
      }
      .print-time {
        margin-left: auto;
        color: #888;
        font-size: 0.85rem;
        white-space: nowrap;
      }
      .print-slide ul { margin: 0.5rem 0; padding-left: 1.5rem; }
      .print-slide li { margin: 0.3rem 0; }
      .print-script {
        background: #f8f9fa;
        border-left: 3px solid #4C9AFF;
        padding: 0.8rem;
        margin: 0.8rem 0;
        font-style: italic;
        font-size: 0.95rem;
        line-height: 1.6;
      }
      .print-callouts {
        color: #E2001A;
        font-weight: 600;
      }
      .print-questions {
        background: #fff8e1;
        border-left: 3px solid #FFB800;
        padding: 0.8rem;
        margin: 0.8rem 0;
      }
      .print-transition {
        color: #4C9AFF;
        font-style: italic;
        margin-top: 0.5rem;
      }
      .print-section-divider {
        text-align: center;
        font-size: 1.2rem;
        font-weight: 700;
        color: #E2001A;
        margin: 2rem 0 1rem;
        padding: 0.5rem;
        background: #fef2f2;
        border-radius: 4px;
      }
      @media print {
        #print-notes-container { padding: 0; }
        .print-slide { border: 1px solid #ccc; }
        .print-section-divider { page-break-before: always; }
      }
    </style>
    <div class="print-header">
      <h1>Speaker Notes — SOH Elektrofahrzeuge</h1>
      <p>Amirreza Roodsaz · Masterarbeit Kolloquium · 6. Mai 2026</p>
      <p style="font-size:0.85rem;">15 Minuten · ~19 Hauptfolien + ~14 Backup</p>
    </div>
  `;

  // Collect slide IDs in order from the DOM
  const allSlides = document.querySelectorAll('.reveal .slides > section[id]');
  let slideNum = 0;
  let lastSection = '';

  for (const section of allSlides) {
    const slideId = section.id;
    const note = SPEAKER_NOTES[slideId];
    if (!note) continue;

    slideNum++;
    const currentSection = section.getAttribute('data-section') || '';

    // Section divider
    if (currentSection !== lastSection && currentSection !== 'backup') {
      const sectionLabels = {
        opening: 'Einleitung / Introduction',
        motivation: 'Motivation',
        theory: 'Theorie / Theory',
        method: 'Methodik / Methodology',
        results: 'Ergebnisse / Results',
        discussion: 'Diskussion / Discussion',
        flowcharts: 'Diagramme / Diagrams',
        conclusion: 'Fazit / Conclusion',
      };
      container.innerHTML += `<div class="print-section-divider">${sectionLabels[currentSection] || currentSection}</div>`;
      lastSection = currentSection;
    }

    if (currentSection === 'backup' && lastSection !== 'backup') {
      container.innerHTML += `<div class="print-section-divider">Backup Slides</div>`;
      lastSection = 'backup';
    }

    // Get slide title
    const h2 = section.querySelector('h2');
    let title = '';
    if (h2) {
      const langSpan = h2.querySelector(`.lang-${lang}`);
      title = langSpan ? langSpan.textContent : h2.textContent;
    }

    let slideHTML = `
      <div class="print-slide">
        <div class="print-slide-header">
          <div class="print-slide-num">${slideNum}</div>
          <div class="print-slide-title">${title}</div>
          ${note.time ? `<div class="print-time">⏱ ${note.time}</div>` : ''}
        </div>
    `;

    // Bullets
    if (note.bullets && note.bullets[lang]) {
      slideHTML += '<ul>';
      for (const b of note.bullets[lang]) {
        slideHTML += `<li>${b}</li>`;
      }
      slideHTML += '</ul>';
    }

    // Script
    if (note.script && note.script[lang]) {
      slideHTML += `<div class="print-script">${note.script[lang]}</div>`;
    }

    // Data callouts
    if (note.dataCallouts && note.dataCallouts.length > 0) {
      slideHTML += '<div class="print-callouts"><strong>📊 ';
      slideHTML += lang === 'de' ? 'Wichtige Zahlen:' : 'Key Numbers:';
      slideHTML += '</strong><ul>';
      for (const c of note.dataCallouts) {
        slideHTML += `<li>${c}</li>`;
      }
      slideHTML += '</ul></div>';
    }

    // Questions
    if (note.questions && note.questions.length > 0) {
      slideHTML += '<div class="print-questions">';
      slideHTML += `<strong>${lang === 'de' ? 'Mögliche Fragen:' : 'Anticipated Questions:'}</strong>`;
      for (const qa of note.questions) {
        slideHTML += `<p style="margin:0.3em 0;"><strong>Q:</strong> ${qa.q[lang]}</p>`;
        slideHTML += `<p style="margin:0 0 0.6em;color:#555;"><strong>A:</strong> ${qa.a[lang]}</p>`;
      }
      slideHTML += '</div>';
    }

    // Transition
    if (note.transition && note.transition[lang]) {
      slideHTML += `<div class="print-transition">→ ${note.transition[lang]}</div>`;
    }

    slideHTML += '</div>';
    container.innerHTML += slideHTML;
  }

  document.body.appendChild(container);
}

/**
 * SSE follow mode — auto-sync slide position from main presenter.
 */
function initFollowMode() {
  if (!deck) return;

  // Add follow-mode indicator
  const indicator = document.createElement('div');
  indicator.id = 'follow-indicator';
  indicator.style.cssText = 'position:fixed;top:12px;right:12px;background:#E2001A;color:white;padding:6px 14px;border-radius:20px;font-size:0.85rem;font-weight:600;z-index:9999;opacity:0.9;pointer-events:none;';
  indicator.textContent = '📡 Follow Mode';
  document.body.appendChild(indicator);

  // Connect to SSE
  connectSSE();
}

function connectSSE() {
  if (sseSource) sseSource.close();

  sseSource = new EventSource('/api/sync');
  sseSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.h !== undefined && deck) {
        // Navigate to exact slide + fragment position
        deck.slide(data.h, data.v ?? 0, data.f ?? -1);
      }
    } catch { /* ignore parse errors */ }
  };

  sseSource.onerror = () => {
    // Reconnect after 3 seconds
    sseSource.close();
    setTimeout(connectSSE, 3000);
  };
}

/**
 * Broadcast current slide + fragment position to SSE server.
 * Uses {h, v, f} indices so the follower can sync fragments too.
 */
function broadcastSlide() {
  if (!deck) return;
  const indices = deck.getIndices(); // { h, v, f }
  fetch('/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ h: indices.h, v: indices.v, f: indices.f ?? -1 }),
  }).catch(() => { /* SSE server not available — silent fail */ });
}

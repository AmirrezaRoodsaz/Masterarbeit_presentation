/**
 * Navigation Shell — sidebar, section navigation, progress bar
 */
import { createIcons, BookOpen, Zap, Beaker, Wrench, BarChart3, MessageSquare, Target, QrCode, Languages, Timer, Monitor, Presentation, Settings, Workflow, Download } from 'lucide';
import { getSettings } from './settings-store.js';

// Section definitions matching the Phase 20 slide structure (15-min budget, 21 main slides)
// Indices match DOM order; uncounted slides (charging, resistance, failure, intersystem,
// community, uncertainty, flowchart-gallery, backups) are NOT listed in main sidebar
// but remain reachable via the backup dropdown.
const SECTIONS = [
  { id: 'opening', label: 'Einleitung', label_en: 'Introduction', icon: 'book-open', slideIndex: 0, subs: [
    { label: 'Titel', label_en: 'Title', slideIndex: 0 },
    { label: 'Roadmap', label_en: 'Roadmap', slideIndex: 1 },
  ]},
  { id: 'motivation', label: 'Motivation', label_en: 'Motivation', icon: 'zap', slideIndex: 2, subs: [
    { label: 'Problem', label_en: 'Problem', slideIndex: 2 },
    { label: 'Lücke & Beitrag', label_en: 'Gap & Contribution', slideIndex: 3 },
  ]},
  { id: 'theory', label: 'Theorie', label_en: 'Theory', icon: 'beaker', slideIndex: 4, subs: [
    { label: 'Batterie-Grundlagen', label_en: 'Battery Basics', slideIndex: 4 },
    { label: 'SOH-Definitionen', label_en: 'SOH Definitions', slideIndex: 5 },
  ]},
  { id: 'method', label: 'Methodik', label_en: 'Methodology', icon: 'wrench', slideIndex: 6, subs: [
    { label: 'Diagnosesysteme', label_en: 'Diagnostic Tools', slideIndex: 6 },
    { label: 'Messprotokoll', label_en: 'Test Protocol', slideIndex: 7 },
    { label: 'Entladung & Ladung', label_en: 'Discharge & Charging', slideIndex: 8 },
    { label: 'Fahrzeuge (MEB)', label_en: 'Vehicles (MEB)', slideIndex: 10 },
    { label: 'SOH-Pipeline', label_en: 'SOH Pipeline', slideIndex: 11 },
  ]},
  { id: 'results', label: 'Ergebnisse', label_en: 'Results', icon: 'bar-chart-3', slideIndex: 12, subs: [
    { label: 'Methodenvergleich', label_en: 'Method Comparison', slideIndex: 12 },
    { label: 'Reproduzierbarkeit', label_en: 'Reproducibility', slideIndex: 13 },
    { label: 'Temperatureffekt', label_en: 'Temperature Effect', slideIndex: 14 },
    { label: 'ICA/DVA', label_en: 'ICA/DVA', slideIndex: 18 },
    { label: 'Demo (Pro)', label_en: 'Demo (Pro)', slideIndex: 20 },
    { label: 'Demo (Easy)', label_en: 'Demo (Easy)', slideIndex: 21 },
  ]},
  { id: 'discussion', label: 'Diskussion & Fazit', label_en: 'Discussion & Conclusion', icon: 'target', slideIndex: 22, subs: [
    { label: 'Stärken & Reflexion', label_en: 'Strengths & Reflection', slideIndex: 22 },
    { label: 'Kernaussage', label_en: 'Core Finding', slideIndex: 24 },
    { label: 'Ausblick', label_en: 'Outlook', slideIndex: 25 },
    { label: 'Danke', label_en: 'Thanks', slideIndex: 26 },
  ]},
  { id: 'flowcharts', label: 'Diagramme (Q&A)', label_en: 'Diagrams (Q&A)', icon: 'workflow', slideIndex: 27, subs: [
    { label: 'Galerie', label_en: 'Gallery', slideIndex: 27 },
  ]},
];

export function initShell(deck) {
  buildSidebar(deck);
  initTimer();
  initLanguage();

  // Update active section on slide change
  deck.on('slidechanged', () => updateActiveSection(deck));
  updateActiveSection(deck);

}

function buildSidebar(deck) {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  // Header with logos
  const header = sidebar.querySelector('.sidebar-header');
  header.innerHTML = `
    <div class="sidebar-logos">
      <img src="/assets/images/logos/Institut_Logo.png" alt="Institut für Elektromobilität" class="sidebar-logo">
    </div>
  `;

  // Navigation entries with subsections
  const nav = sidebar.querySelector('.sidebar-nav');
  nav.innerHTML = SECTIONS.map(section => `
    <div class="nav-group" data-section="${section.id}">
      <button class="nav-item" data-section="${section.id}" data-slide-index="${section.slideIndex}" title="${section.label}">
        <i data-lucide="${section.icon}"></i>
        <span class="nav-label">
          <span class="lang-de">${section.label}</span>
          <span class="lang-en" hidden>${section.label_en}</span>
        </span>
      </button>
      <div class="nav-subs">
        ${section.subs.map(sub => `
          <button class="nav-sub-item" data-slide-index="${sub.slideIndex}">
            <span class="lang-de">${sub.label}</span>
            <span class="lang-en" hidden>${sub.label_en}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `).join('');

  // Footer controls
  const footer = sidebar.querySelector('.sidebar-footer');
  footer.innerHTML = `
    <div class="sidebar-controls">
      <button id="btn-qr" class="control-btn" title="QR Code Hub (Q)">
        <i data-lucide="qr-code"></i>
      </button>
      <button id="btn-export" class="control-btn" title="Export (PDF / PPTX)">
        <i data-lucide="download"></i>
      </button>
      <button id="btn-lang" class="control-btn" title="Sprache / Language (L)">
        <i data-lucide="languages"></i>
        <span class="lang-indicator">DE</span>
      </button>
      <button id="btn-mode" class="control-btn" title="Präsentationsmodus (D)">
        <i data-lucide="presentation"></i>
      </button>
      <button id="btn-timer" class="control-btn" title="Timer (T)">
        <i data-lucide="timer"></i>
        <span id="timer-display" class="timer-display" hidden>00:00</span>
      </button>
      <button id="btn-settings" class="control-btn" title="Einstellungen (,)">
        <i data-lucide="settings"></i>
      </button>
    </div>
    <div class="slide-counter">
      <span id="slide-current">1</span> / <span id="slide-total">1</span>
    </div>
  `;

  // Bind click events (section headers + sub-items)
  nav.querySelectorAll('.nav-item, .nav-sub-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.slideIndex);
      deck.slide(idx);
    });
  });

  // Defense mode exit tab (visible only in defense/presentation mode)
  const exitTab = document.createElement('button');
  exitTab.id = 'defense-exit-tab';
  exitTab.className = 'defense-exit-tab';
  exitTab.setAttribute('aria-label', 'Exit presentation mode');
  exitTab.innerHTML = '&#x276F;'; // ❯
  exitTab.addEventListener('click', toggleDefenseMode);
  document.body.appendChild(exitTab);

  // Mode toggle
  document.getElementById('btn-mode')?.addEventListener('click', toggleDefenseMode);

  // Timer toggle
  document.getElementById('btn-timer')?.addEventListener('click', toggleTimer);

  // Language toggle
  document.getElementById('btn-lang')?.addEventListener('click', toggleLanguage);

  // Settings
  document.getElementById('btn-settings')?.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('toggle-settings'));
  });

  // Export modal
  document.getElementById('btn-export')?.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('toggle-export-modal'));
  });

  // Initialize Lucide icons
  createIcons({
    icons: { BookOpen, Zap, Beaker, Wrench, BarChart3, MessageSquare, Target, QrCode, Languages, Timer, Monitor, Presentation, Settings, Workflow, Download },
  });

  // Update slide counter
  updateSlideCounter(deck);
  deck.on('slidechanged', () => updateSlideCounter(deck));
}

function updateActiveSection(deck) {
  const currentSlide = deck.getCurrentSlide();
  if (!currentSlide) return;

  const currentSection = currentSlide.getAttribute('data-section');
  const currentSlideIndex = deck.getSlidePastCount();

  // Toggle active section + expand/collapse subsections
  document.querySelectorAll('.nav-group').forEach(group => {
    const isActive = group.dataset.section === currentSection;
    group.classList.toggle('expanded', isActive);
    group.querySelector('.nav-item').classList.toggle('active', isActive);
  });

  // Highlight active sub-item
  document.querySelectorAll('.nav-sub-item').forEach(sub => {
    sub.classList.toggle('active', parseInt(sub.dataset.slideIndex) === currentSlideIndex);
  });
}

function updateSlideCounter(deck) {
  const current = document.getElementById('slide-current');
  const total = document.getElementById('slide-total');
  if (current) current.textContent = deck.getSlidePastCount() + 1;
  if (total) total.textContent = deck.getTotalSlides();
}

// === Defense / Browse Mode ===
export function toggleDefenseMode() {
  document.body.classList.toggle('defense-mode');
  const isDefense = document.body.classList.contains('defense-mode');
  sessionStorage.setItem('defense-mode', isDefense);

  // Trigger Reveal.js layout recalculation
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 350);
}

// === Timer ===
let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;

function initTimer() {
  // Defense mode is controlled via the D key or settings default.
  // Don't auto-restore from sessionStorage — it can get stale and hide the sidebar.
}

/** Broadcast timer state to any listening speaker view popups */
function broadcastTimerState() {
  const ts = getSettings();
  document.dispatchEvent(new CustomEvent('timer-sync', {
    detail: {
      seconds: timerSeconds,
      running: timerRunning,
      warning: timerSeconds >= ts.display.timerWarning && timerSeconds < ts.display.timerTarget,
      overtime: timerSeconds >= ts.display.timerTarget,
    },
  }));
}

export function getTimerState() {
  const ts = getSettings();
  return {
    seconds: timerSeconds,
    running: timerRunning,
    warning: timerSeconds >= ts.display.timerWarning && timerSeconds < ts.display.timerTarget,
    overtime: timerSeconds >= ts.display.timerTarget,
  };
}

export function toggleTimer() {
  const display = document.getElementById('timer-display');
  if (!display) return;

  if (timerRunning) {
    clearInterval(timerInterval);
    timerRunning = false;
    display.classList.remove('running');
    broadcastTimerState();
  } else {
    display.hidden = false;
    timerRunning = true;
    display.classList.add('running');
    timerInterval = setInterval(() => {
      timerSeconds++;
      const mins = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
      const secs = (timerSeconds % 60).toString().padStart(2, '0');
      display.textContent = `${mins}:${secs}`;

      // Warning and overtime from settings
      const ts = getSettings();
      if (timerSeconds >= ts.display.timerTarget) {
        display.classList.add('overtime');
      } else if (timerSeconds >= ts.display.timerWarning) {
        display.classList.add('warning');
      }

      broadcastTimerState();
    }, 1000);
    broadcastTimerState();
  }
}

// === Language Toggle ===
export function toggleLanguage() {
  const isEnglish = document.body.classList.toggle('lang-en');
  sessionStorage.setItem('lang', isEnglish ? 'en' : 'de');

  // Update sidebar indicator
  const indicator = document.querySelector('.lang-indicator');
  if (indicator) indicator.textContent = isEnglish ? 'EN' : 'DE';
}

function initLanguage() {
  // Restore from session, or use settings default
  const stored = sessionStorage.getItem('lang');
  const s = getSettings();
  const lang = stored || s.display.defaultLanguage || 'de';

  if (lang === 'en') {
    document.body.classList.add('lang-en');
    const indicator = document.querySelector('.lang-indicator');
    if (indicator) indicator.textContent = 'EN';
  }

  // Listen for toggle event from input-manager
  document.addEventListener('toggle-language', toggleLanguage);
}


/**
 * Navigation Shell — sidebar, section navigation, progress bar
 */
import { createIcons, BookOpen, Zap, Beaker, Wrench, BarChart3, MessageSquare, Target, QrCode, Languages, Timer, Monitor, Presentation, Settings } from 'lucide';
import { getSettings } from './settings-store.js';

// Section definitions matching the slide structure
const SECTIONS = [
  { id: 'opening', label: 'Einleitung', label_en: 'Introduction', icon: 'book-open', slideIndex: 0, subs: [
    { label: 'Titel', label_en: 'Title', slideIndex: 0 },
    { label: 'Roadmap', label_en: 'Roadmap', slideIndex: 1 },
  ]},
  { id: 'motivation', label: 'Motivation', label_en: 'Motivation', icon: 'zap', slideIndex: 2, subs: [
    { label: 'Problem', label_en: 'Problem', slideIndex: 2 },
    { label: 'Lücke', label_en: 'Gap', slideIndex: 3 },
    { label: 'Beiträge', label_en: 'Contributions', slideIndex: 4 },
  ]},
  { id: 'theory', label: 'Theorie', label_en: 'Theory', icon: 'beaker', slideIndex: 5, subs: [
    { label: 'Batterie-Grundlagen', label_en: 'Battery Basics', slideIndex: 5 },
    { label: 'SOH-Definitionen', label_en: 'SOH Definitions', slideIndex: 6 },
  ]},
  { id: 'method', label: 'Methodik', label_en: 'Methodology', icon: 'wrench', slideIndex: 7, subs: [
    { label: 'Diagnosesysteme', label_en: 'Diagnostic Tools', slideIndex: 7 },
    { label: 'Messprotokoll', label_en: 'Test Protocol', slideIndex: 8 },
    { label: 'Fahrzeuge', label_en: 'Vehicles', slideIndex: 9 },
    { label: 'SOH-Pipeline', label_en: 'SOH Pipeline', slideIndex: 10 },
  ]},
  { id: 'results', label: 'Ergebnisse', label_en: 'Results', icon: 'bar-chart-3', slideIndex: 11, subs: [
    { label: 'Methodenvergleich', label_en: 'Method Comparison', slideIndex: 11 },
    { label: 'Reproduzierbarkeit', label_en: 'Reproducibility', slideIndex: 12 },
    { label: 'Temperatureffekt', label_en: 'Temperature Effect', slideIndex: 13 },
    { label: 'Innenwiderstand', label_en: 'Resistance', slideIndex: 14 },
    { label: 'Fehlerfall', label_en: 'Failure Case', slideIndex: 15 },
    { label: 'Live-Demo', label_en: 'Live Demo', slideIndex: 16 },
  ]},
  { id: 'discussion', label: 'Diskussion', label_en: 'Discussion', icon: 'message-square', slideIndex: 17, subs: [
    { label: 'Stärken & Grenzen', label_en: 'Strengths & Limits', slideIndex: 17 },
    { label: 'Unsicherheitsbudget', label_en: 'Uncertainty Budget', slideIndex: 18 },
  ]},
  { id: 'conclusion', label: 'Fazit', label_en: 'Conclusion', icon: 'target', slideIndex: 19, subs: [
    { label: 'Kernaussage', label_en: 'Core Finding', slideIndex: 19 },
    { label: 'Ausblick', label_en: 'Outlook', slideIndex: 20 },
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

  // Initialize Lucide icons
  createIcons({
    icons: { BookOpen, Zap, Beaker, Wrench, BarChart3, MessageSquare, Target, QrCode, Languages, Timer, Monitor, Presentation, Settings },
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

export function toggleTimer() {
  const display = document.getElementById('timer-display');
  if (!display) return;

  if (timerRunning) {
    clearInterval(timerInterval);
    timerRunning = false;
    display.classList.remove('running');
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
    }, 1000);
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

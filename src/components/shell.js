/**
 * Navigation Shell — sidebar, section navigation, progress bar
 */
import { createIcons, BookOpen, Zap, Beaker, Wrench, BarChart3, MessageSquare, Target, QrCode, Languages, Timer, Monitor, Presentation, Settings } from 'lucide';
import { getSettings } from './settings-store.js';

// Section definitions matching the slide structure
const SECTIONS = [
  { id: 'opening', label: 'Einleitung', label_en: 'Introduction', icon: 'book-open', slideIndex: 0 },
  { id: 'motivation', label: 'Motivation', label_en: 'Motivation', icon: 'zap', slideIndex: 2 },
  { id: 'theory', label: 'Theorie', label_en: 'Theory', icon: 'beaker', slideIndex: 5 },
  { id: 'method', label: 'Methodik', label_en: 'Methodology', icon: 'wrench', slideIndex: 7 },
  { id: 'results', label: 'Ergebnisse', label_en: 'Results', icon: 'bar-chart-3', slideIndex: 11 },
  { id: 'discussion', label: 'Diskussion', label_en: 'Discussion', icon: 'message-square', slideIndex: 17 },
  { id: 'conclusion', label: 'Fazit', label_en: 'Conclusion', icon: 'target', slideIndex: 19 },
];

export function initShell(deck) {
  buildSidebar(deck);
  initTimer();

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

  // Navigation entries
  const nav = sidebar.querySelector('.sidebar-nav');
  nav.innerHTML = SECTIONS.map((section, i) => `
    <button class="nav-item" data-section="${section.id}" data-slide-index="${section.slideIndex}" title="${section.label}">
      <i data-lucide="${section.icon}"></i>
      <span class="nav-label">
        <span class="lang-de">${section.label}</span>
        <span class="lang-en" hidden>${section.label_en}</span>
      </span>
    </button>
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

  // Bind click events
  nav.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.slideIndex);
      deck.slide(idx);
    });
  });

  // Mode toggle
  document.getElementById('btn-mode')?.addEventListener('click', toggleDefenseMode);

  // Timer toggle
  document.getElementById('btn-timer')?.addEventListener('click', toggleTimer);

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
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === currentSection);
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
  // Restore defense mode from session
  if (sessionStorage.getItem('defense-mode') === 'true') {
    document.body.classList.add('defense-mode');
  }
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


import Reveal from 'reveal.js';
import RevealNotes from 'reveal.js/plugin/notes/notes.esm.js';
import { initShell } from './components/shell.js';
import { initInputManager } from './components/input-manager.js';
import { initSettingsModal } from './components/settings-modal.js';
import { initQrHub } from './components/qr-hub.js';
import { getSettings } from './components/settings-store.js';
import { initCharts } from './components/charts.js';

// KaTeX — local import (offline-first, no CDN)
import renderMathInElement from 'katex/contrib/auto-render';
import 'katex/dist/katex.min.css';

// Reveal.js core styles
import 'reveal.js/dist/reveal.css';

// Initialize Reveal.js
const deck = Reveal({
  hash: true,
  hashOneBasedIndex: true,
  transition: 'fade',
  transitionSpeed: 'default',
  embedded: true,          // Don't take over <body>; stay inside #main-area
  controls: false,        // Custom nav shell replaces these
  progress: false,        // Custom progress bar
  slideNumber: false,     // Custom display
  center: false,          // We manage layout ourselves
  width: 1920,
  height: 1080,
  margin: 0,
  minScale: 0.2,
  maxScale: 1.5,
  plugins: [RevealNotes],
});

// Disable Reveal.js built-in keyboard for keys we manage ourselves
const s = getSettings();

deck.initialize().then(() => {
  console.log('Reveal.js initialized');

  // Initialize UI shell first (sidebar, input, settings, QR)
  initShell(deck);
  initInputManager(deck);
  initSettingsModal();
  initQrHub();
  updateProgressBar();

  // Render KaTeX equations (offline, no CDN) — after UI is ready
  try {
    renderMathInElement(deck.getSlidesElement(), {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
      ],
      throwOnError: false,
    });
    deck.layout();
  } catch (err) {
    console.warn('KaTeX auto-render failed:', err);
  }

  // Render D3.js charts (results slides 12–15)
  initCharts().catch(err => console.warn('D3 charts init failed:', err));

  // Apply default display settings
  if (s.display.defaultMode === 'defense') {
    document.body.classList.add('defense-mode');
  }
});

// Custom progress bar
function updateProgressBar() {
  const bar = document.getElementById('progress-bar');
  const sectionTitle = document.getElementById('section-title');
  if (!bar) return;

  const total = deck.getTotalSlides();
  const current = deck.getSlidePastCount() + 1;
  const percent = (current / total) * 100;
  bar.style.width = `${percent}%`;

  // Update section title
  const currentSlide = deck.getCurrentSlide();
  if (currentSlide && sectionTitle) {
    const section = currentSlide.getAttribute('data-section') || '';
    sectionTitle.textContent = section;
  }
}

deck.on('slidechanged', updateProgressBar);

export { deck };

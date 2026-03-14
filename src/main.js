import Reveal from 'reveal.js';
import RevealNotes from 'reveal.js/plugin/notes/notes.esm.js';
import RevealMath from 'reveal.js/plugin/math/math.esm.js';
import { initShell } from './components/shell.js';
import { initInputManager } from './components/input-manager.js';
import { initSettingsModal } from './components/settings-modal.js';
import { getSettings } from './components/settings-store.js';

// Reveal.js core styles
import 'reveal.js/dist/reveal.css';

// Initialize Reveal.js
const deck = Reveal({
  hash: true,
  hashOneBasedIndex: true,
  transition: 'fade',
  transitionSpeed: 'default',
  controls: false,        // Custom nav shell replaces these
  progress: false,        // Custom progress bar
  slideNumber: false,     // Custom display
  center: false,          // We manage layout ourselves
  width: 1920,
  height: 1080,
  margin: 0,
  minScale: 0.2,
  maxScale: 1.5,
  plugins: [RevealNotes, RevealMath.KaTeX],
});

// Disable Reveal.js built-in keyboard for keys we manage ourselves
const s = getSettings();

deck.initialize().then(() => {
  console.log('Reveal.js initialized');
  initShell(deck);
  initInputManager(deck);
  initSettingsModal();
  updateProgressBar();

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

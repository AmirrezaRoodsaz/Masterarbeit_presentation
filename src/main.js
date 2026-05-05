// Phase 21: iPad speaker view — short-circuit before any Reveal init.
// URL `?ipad-speaker` opens a standalone follower view that mirrors the
// Mac S-key speaker layout (notes-left + slide-thumbs-right + timer)
// and auto-syncs via SSE.
const _earlyParams = new URLSearchParams(window.location.search);
const _isIpadSpeaker = _earlyParams.has('ipad-speaker');
if (_isIpadSpeaker) {
  import('./components/ipad-speaker.js').then(m => m.initIpadSpeakerView());
}

import Reveal from 'reveal.js';
import RevealNotes from 'reveal.js/plugin/notes/notes.esm.js';
import { initShell } from './components/shell.js';
import { initInputManager } from './components/input-manager.js';
import { initSettingsModal } from './components/settings-modal.js';
import { initQrHub } from './components/qr-hub.js';
import { getSettings } from './components/settings-store.js';
import { initCharts } from './components/charts.js';
import { initAnimations } from './components/animations.js';
import { initDemoEmbed } from './components/demo-embed.js';
import { initFlowchartGallery } from './components/flowchart-gallery.js';
import { initNotesLoader } from './components/notes-loader.js';
import { initExporter } from './components/exporter.js';
import QrCreator from 'qr-creator';
import gsap from 'gsap';

// KaTeX — local import (offline-first, no CDN)
import renderMathInElement from 'katex/contrib/auto-render';
import 'katex/dist/katex.min.css';

// Reveal.js core styles
import 'reveal.js/dist/reveal.css';

// `?embed=slide` — used by iPad speaker view iframes. Loads the deck
// without sidebar/controls. Add the body class before Reveal initializes
// so the layout is correct from the first paint.
if (_earlyParams.has('embed')) {
  document.documentElement.classList.add('embed-slide');
  document.body && document.body.classList.add('embed-slide');
}

// Auto-enable presenter mode if no mode params are set
if (!window.location.search.includes('presenter') &&
    !window.location.search.includes('print-notes') &&
    !window.location.search.includes('follow') &&
    !window.location.search.includes('receiver') &&
    !window.location.search.includes('embed')) {
  const url = new URL(window.location);
  url.searchParams.set('presenter', '');
  window.location.replace(url);
}

// Don't initialize Reveal in iPad speaker mode — the page is repainted
// by the dynamic ipad-speaker module above.
let deck = null;
if (!_isIpadSpeaker) {

const s = getSettings();

// Initialize Reveal.js
deck = Reveal({
  hash: true,
  hashOneBasedIndex: true,
  transition: 'fade',
  transitionSpeed: 'default',
  embedded: true,
  controls: false,
  progress: false,
  slideNumber: false,
  center: false,
  width: 1920,
  height: 1080,
  margin: 0,
  minScale: 0.2,
  maxScale: 1.5,
  keyboard: false,
  touch: false,
  plugins: [RevealNotes],
});

deck.initialize().then(() => {
  console.log('Reveal.js initialized');

  // Initialize UI shell (sidebar, input, settings, QR)
  initShell(deck);
  initInputManager(deck);
  initSettingsModal();
  initQrHub();

  // Render KaTeX equations (lightweight, both modes)
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

  updateProgressBar();

  initCharts().catch(err => console.warn('D3 charts init failed:', err));
  initAnimations(deck);
  initDemoEmbed().catch(err => console.warn('Demo embed init failed:', err));
  initFlowchartGallery().catch(err => console.warn('Flowchart gallery init failed:', err));
  initNotesLoader(deck);
  initExporter(deck);

  // Title slide QR code
  try {
    const qrCanvas = document.getElementById('title-qr-canvas');
    const qrWrap = document.getElementById('title-qr');
    if (qrCanvas && qrWrap) {
      let qrUrl = window.location.origin;
      const renderQR = () => {
        QrCreator.render({ text: qrUrl, radius: 0.4, ecLevel: 'M', fill: getComputedStyle(document.body).getPropertyValue('--text-primary').trim() || '#e2e8f0', background: 'transparent', size: 140 }, qrCanvas);
      };
      const isReceiver = /[?&]receiver\b/.test(window.location.search);
      fetch('/local-ip.json').then(r => r.json()).then(d => { if (d.ip) qrUrl = `http://${d.ip}:3000`; }).catch(() => {}).finally(() => {
        renderQR();
        const qrAnim = !isReceiver && getSettings().display.animationsEnabled !== false;
        gsap.to(qrWrap, { opacity: 1, duration: qrAnim ? 2 : 0, delay: qrAnim ? 1.5 : 0, ease: 'power2.inOut' });
      });
      new MutationObserver(() => renderQR()).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }
  } catch (err) { console.warn('Title QR failed:', err); }

  // Speaker view iframes: hide sidebar + UI chrome so previews show only slides
  if (/[?&]receiver\b/.test(window.location.search)) {
    document.body.classList.add('defense-mode');
    // Hide progress bar, section title, defense-exit tab
    const hide = (sel) => { const el = document.querySelector(sel); if (el) el.style.display = 'none'; };
    hide('#progress-container');
    hide('#section-title');
    hide('.defense-exit-tab');
  }

  // Apply default display settings
  if (s.display.defaultMode === 'defense') {
    document.body.classList.add('defense-mode');
  }
});

// Custom swipe handler — swipe right = forward, swipe left = backward
(function initSwipe() {
  let startX = 0;
  const THRESHOLD = 50;

  document.addEventListener('touchstart', (e) => {
    startX = e.changedTouches[0].clientX;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) < THRESHOLD) return;
    if (dx > 0) deck.next();
    else deck.prev();
  }, { passive: true });
})();

// Custom progress bar
function updateProgressBar() {
  const bar = document.getElementById('progress-bar');
  const car = document.getElementById('progress-car');
  const sectionTitle = document.getElementById('section-title');
  if (!bar) return;

  const total = deck.getTotalSlides();
  const current = deck.getSlidePastCount() + 1;
  const percent = (current / total) * 100;
  bar.style.width = `${percent}%`;

  // Move the car to the progress position
  if (car) {
    car.style.left = `${percent}%`;
  }

  // Update section title with language-aware labels
  const currentSlide = deck.getCurrentSlide();
  if (currentSlide && sectionTitle) {
    const section = currentSlide.getAttribute('data-section') || '';
    const labels = {
      opening:    { de: 'Einleitung',   en: 'Introduction' },
      motivation: { de: 'Motivation',   en: 'Motivation' },
      theory:     { de: 'Theorie',      en: 'Theory' },
      method:     { de: 'Methodik',     en: 'Methodology' },
      results:    { de: 'Ergebnisse',   en: 'Results' },
      discussion: { de: 'Diskussion',   en: 'Discussion' },
      flowcharts: { de: 'Diagramme',    en: 'Diagrams' },
      conclusion: { de: 'Fazit',        en: 'Conclusion' },
    };
    const l = labels[section];
    if (l) {
      const isEn = document.documentElement.lang === 'en';
      sectionTitle.innerHTML =
        `<span class="lang-de"${isEn ? ' hidden' : ''}>${l.de}</span>` +
        `<span class="lang-en"${isEn ? '' : ' hidden'}>${l.en}</span>`;
    } else {
      sectionTitle.textContent = section;
    }
  }
}

deck.on('slidechanged', updateProgressBar);

// Easter egg: honk when clicking the car
const progressCar = document.getElementById('progress-car');
if (progressCar) {
  const hornSound = new Audio('assets/audio/horn.mp3');
  progressCar.addEventListener('click', () => {
    hornSound.currentTime = 0;
    hornSound.play();
    // Little bounce animation
    progressCar.style.transform = 'translateX(-50%) scaleX(-1) scale(1.3)';
    setTimeout(() => {
      progressCar.style.transform = 'translateX(-50%) scaleX(-1) scale(1)';
    }, 200);
  });
}

// Zoomable image — continuous hero zoom from original position to center
(function initImageZoom() {
  // Create backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'zoom-backdrop';
  document.body.appendChild(backdrop);

  let activeClone = null;
  let activeSource = null;

  function openZoom(el) {
    if (activeClone) return;
    activeSource = el;

    // Get original position
    const rect = el.getBoundingClientRect();

    // Create clone at exact original position
    const clone = document.createElement('div');
    clone.className = 'zoom-clone';
    clone.style.top = rect.top + 'px';
    clone.style.left = rect.left + 'px';
    clone.style.width = rect.width + 'px';
    clone.style.height = rect.height + 'px';

    // Clone content: image or chart SVG
    if (el.tagName === 'IMG') {
      const cloneImg = document.createElement('img');
      cloneImg.src = el.src;
      clone.appendChild(cloneImg);
    } else {
      // Clone the entire container (chart with SVG)
      clone.innerHTML = el.innerHTML;
    }
    document.body.appendChild(clone);

    // Hide original
    el.style.visibility = 'hidden';

    activeClone = clone;

    // Force reflow then animate to center
    clone.offsetHeight;
    backdrop.classList.add('active');

    // Target: charts get wider, images stay narrower
    const isChart = !el.tagName || el.tagName !== 'IMG';
    const targetW = isChart ? Math.min(window.innerWidth * 0.75, 1200) : Math.min(window.innerWidth * 0.45, 600);
    const targetH = window.innerHeight * 0.85;
    const targetLeft = (window.innerWidth - targetW) / 2;
    const targetTop = (window.innerHeight - targetH) / 2;

    clone.style.top = targetTop + 'px';
    clone.style.left = targetLeft + 'px';
    clone.style.width = targetW + 'px';
    clone.style.height = targetH + 'px';
    clone.style.padding = '1rem';
  }

  function closeZoom() {
    if (!activeClone || !activeSource) return;

    // Animate back to original position
    const rect = activeSource.getBoundingClientRect();
    activeClone.style.top = rect.top + 'px';
    activeClone.style.left = rect.left + 'px';
    activeClone.style.width = rect.width + 'px';
    activeClone.style.height = rect.height + 'px';
    activeClone.style.padding = '0.25rem 0';

    backdrop.classList.remove('active');

    const clone = activeClone;
    const source = activeSource;
    activeClone = null;
    activeSource = null;

    // Remove clone after animation ends
    setTimeout(() => {
      source.style.visibility = '';
      clone.remove();
    }, 450);
  }

  backdrop.addEventListener('click', closeZoom);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeClone) closeZoom();
  });

  document.querySelectorAll('.zoomable-image').forEach(img => {
    img.addEventListener('click', () => openZoom(img));
  });
})();

} // end of !_isIpadSpeaker guard

export { deck };

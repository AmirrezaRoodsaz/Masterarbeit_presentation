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
import QrCreator from 'qr-creator';
import gsap from 'gsap';

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
  keyboard: false,         // Custom input-manager handles all keys
  plugins: [RevealNotes],
});

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

  // GSAP animations (pipeline slide 11 + fragment enhancements)
  initAnimations(deck);

  // Streamlit demo embed (slide 17 — iframe or video fallback)
  initDemoEmbed().catch(err => console.warn('Demo embed init failed:', err));

  // Flowchart gallery (slide 20 — diagram selector)
  initFlowchartGallery().catch(err => console.warn('Flowchart gallery init failed:', err));

  // Title slide QR code
  try {
    const qrCanvas = document.getElementById('title-qr-canvas');
    const qrWrap = document.getElementById('title-qr');
    if (qrCanvas && qrWrap) {
      let qrUrl = window.location.origin;
      const renderQR = () => {
        QrCreator.render({ text: qrUrl, radius: 0.4, ecLevel: 'M', fill: getComputedStyle(document.body).getPropertyValue('--text-primary').trim() || '#e2e8f0', background: 'transparent', size: 140 }, qrCanvas);
      };
      fetch('/local-ip.json').then(r => r.json()).then(d => { if (d.ip) qrUrl = `http://${d.ip}:3000`; }).catch(() => {}).finally(() => {
        renderQR();
        gsap.to(qrWrap, { opacity: 1, duration: 3, delay: 5, ease: 'power2.inOut' });
      });
      // Re-render QR when theme changes
      new MutationObserver(() => renderQR()).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }
  } catch (err) { console.warn('Title QR failed:', err); }

  // Apply default display settings
  if (s.display.defaultMode === 'defense') {
    document.body.classList.add('defense-mode');
  }
});

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

export { deck };

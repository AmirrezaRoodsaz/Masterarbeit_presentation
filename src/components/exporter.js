/**
 * Exporter — PDF and PPTX export via html2canvas + jsPDF / PptxGenJS.
 * Captures each slide in its final fragment state (light theme),
 * shows a progress overlay, and downloads the result.
 * Libraries are lazy-loaded on first export to keep initial bundle small.
 */
import gsap from 'gsap';

import { createIcons, FileText, FileSliders, X } from 'lucide';

let deck = null;
let exporting = false;
let modalEl = null;
let isOpen = false;

export function initExporter(deckInstance) {
  deck = deckInstance;
  createExportModal();
  document.addEventListener('toggle-export-modal', toggleExportModal);
}

// === Export Modal ===

function toggleExportModal() {
  if (exporting) return;
  isOpen ? closeExportModal() : openExportModal();
}

function openExportModal() {
  if (!modalEl) return;
  isOpen = true;
  modalEl.classList.add('open');
}

function closeExportModal() {
  if (!modalEl) return;
  isOpen = false;
  modalEl.classList.remove('open');
}

function createExportModal() {
  modalEl = document.createElement('div');
  modalEl.id = 'export-modal';
  modalEl.className = 'export-modal-overlay';

  modalEl.innerHTML = `
    <div class="export-modal-panel">
      <div class="export-modal-header">
        <h2>Export</h2>
        <button class="export-modal-close" id="export-modal-close" title="Schließen (Esc)">
          <i data-lucide="x"></i>
        </button>
      </div>
      <div class="export-modal-body">
        <button class="export-option" id="export-opt-pdf">
          <i data-lucide="file-text"></i>
          <div class="export-option-text">
            <span class="export-option-title">PDF</span>
            <span class="export-option-desc">Alle Folien als PDF-Dokument exportieren</span>
          </div>
        </button>
        <button class="export-option" id="export-opt-pptx">
          <i data-lucide="file-sliders"></i>
          <div class="export-option-text">
            <span class="export-option-title">PowerPoint</span>
            <span class="export-option-desc">Alle Folien als PPTX-Datei exportieren</span>
          </div>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modalEl);

  // Bind events
  modalEl.querySelector('#export-modal-close').addEventListener('click', closeExportModal);
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeExportModal();
  });
  modalEl.querySelector('#export-opt-pdf').addEventListener('click', () => {
    closeExportModal();
    exportPresentation('pdf');
  });
  modalEl.querySelector('#export-opt-pptx').addEventListener('click', () => {
    closeExportModal();
    exportPresentation('pptx');
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (!isOpen || exporting) return;
    if (e.key === 'Escape') { e.preventDefault(); closeExportModal(); }
  });

  // Render icons
  createIcons({ icons: { FileText, FileSliders, X } });
}

/**
 * Main export flow:
 * 1. Show overlay with progress bar
 * 2. Save current state (slide index, theme, defense mode)
 * 3. Switch to light theme + defense mode (hide sidebar)
 * 4. For each slide: show all fragments → capture screenshot
 * 5. Assemble into PDF or PPTX
 * 6. Restore original state
 * 7. Trigger download
 */
export async function exportPresentation(format = 'pdf') {
  if (exporting || !deck) return;
  exporting = true;

  const totalSlides = deck.getTotalSlides();
  const overlay = createOverlay(format, totalSlides);
  document.body.appendChild(overlay);

  // Save current state
  const savedIndices = deck.getIndices();
  const wasDefenseMode = document.body.classList.contains('defense-mode');
  const wasLightTheme = document.body.classList.contains('light-theme');

  try {
    // Switch to export mode: light theme + defense mode (no sidebar)
    if (!wasDefenseMode) document.body.classList.add('defense-mode');
    if (!wasLightTheme) document.body.classList.add('light-theme');

    // Hide elements that shouldn't appear in export
    const hideSelectors = [
      '#progress-container', '#section-title', '.defense-exit-tab',
      '#timer-display', '.slide-counter',
    ];
    const hidden = hideSelectors.map(sel => {
      const el = document.querySelector(sel);
      if (el) { const prev = el.style.display; el.style.display = 'none'; return { el, prev }; }
      return null;
    }).filter(Boolean);

    // Lazy-load html2canvas (keeps initial bundle small)
    const { default: html2canvas } = await import('html2canvas');

    // Wait for theme transition
    await sleep(500);
    window.dispatchEvent(new Event('resize'));
    await sleep(300);

    // Disable all animations and show everything in final state
    gsap.globalTimeline.clear();
    deck.configure({ fragments: false }); // makes all fragments visible

    // Force all fragments to full opacity and reset GSAP inline transforms
    document.querySelectorAll('.reveal .fragment').forEach(el => {
      gsap.set(el, { opacity: 1, y: 0, x: 0, scale: 1 });
    });

    // Restore cycle diagram segments/icons
    document.querySelectorAll('.cycle-segment[data-segment], .cycle-icon-g[data-segment]').forEach(el => {
      gsap.set(el, { opacity: 1, filter: 'none' });
    });

    // Pipeline timeline → final state
    const pipelineEl = document.getElementById('gsap-pipeline');
    if (pipelineEl) {
      pipelineEl.querySelectorAll('[style]').forEach(el => {
        gsap.set(el, { opacity: 1, scale: 1, y: 0, x: 0 });
      });
    }

    // Discharge gauge → final position
    const gn = document.getElementById('gauge-needle');
    if (gn) gn.setAttribute('transform', 'rotate(495 180 180)');

    await sleep(500);

    // Capture all slides
    const captures = [];
    for (let i = 0; i < totalSlides; i++) {
      updateOverlay(overlay, i + 1, totalSlides);

      // Navigate to slide
      deck.slide(i);
      await sleep(300);

      // Force current slide content visible (GSAP inline overrides)
      const slide = deck.getCurrentSlide();
      if (slide) {
        slide.querySelectorAll('.fragment, [style*="opacity"]').forEach(el => {
          gsap.set(el, { opacity: 1, y: 0, x: 0, scale: 1 });
        });
      }

      // Handle demo slides — show placeholder instead of iframe
      const demoContainer = slide?.querySelector('.demo-container');
      let placeholder = null;
      if (demoContainer) {
        const iframe = demoContainer.querySelector('iframe');
        if (iframe) iframe.style.display = 'none';
        placeholder = document.createElement('div');
        placeholder.className = 'export-demo-placeholder';
        placeholder.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:center;height:100%;
            background:#f8f9fa;border:2px dashed #ccc;border-radius:8px;color:#666;
            font-size:1.2rem;font-family:Inter,system-ui,sans-serif;flex-direction:column;gap:0.5rem;">
            <span style="font-size:2rem;">🖥️</span>
            <span>Live Demo — Streamlit App</span>
            <span style="font-size:0.85rem;color:#999;">Interactive demo available during presentation</span>
          </div>
        `;
        placeholder.style.cssText = 'position:absolute;inset:0;z-index:10;';
        demoContainer.style.position = 'relative';
        demoContainer.appendChild(placeholder);
      }

      await sleep(300);

      // Capture with html2canvas
      const revealEl = document.querySelector('.reveal');
      const canvas = await html2canvas(revealEl, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        width: revealEl.offsetWidth,
        height: revealEl.offsetHeight,
      });

      captures.push(canvas);

      // Clean up placeholder
      if (placeholder) {
        placeholder.remove();
        const iframe = demoContainer?.querySelector('iframe');
        if (iframe) iframe.style.display = '';
      }
    }

    // Assemble output
    updateOverlayStatus(overlay, format === 'pdf' ? 'Generating PDF...' : 'Generating PPTX...');

    if (format === 'pdf') {
      await buildPDF(captures);
    } else {
      await buildPPTX(captures);
    }

    // Wait for browser to process the download, then reload to reset GSAP state
    overlay.remove();
    exporting = false;
    setTimeout(() => window.location.reload(), 2000);

  } catch (err) {
    console.error('Export failed:', err);
    setTimeout(() => window.location.reload(), 1000);
  }
}

// === PDF Builder ===

async function buildPDF(canvases) {
  const { jsPDF } = await import('jspdf');
  // Landscape 16:9
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [254, 143] });

  for (let i = 0; i < canvases.length; i++) {
    if (i > 0) pdf.addPage([254, 143], 'landscape');
    const imgData = canvases[i].toDataURL('image/jpeg', 0.92);
    pdf.addImage(imgData, 'JPEG', 0, 0, 254, 143);
  }

  pdf.save('SOH_Presentation_Roodsaz.pdf');
}

// === PPTX Builder ===

async function buildPPTX(canvases) {
  const { default: PptxGenJS } = await import('pptxgenjs');
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'WIDE', width: 13.33, height: 7.5 });
  pptx.layout = 'WIDE';
  pptx.author = 'Amirreza Roodsaz';
  pptx.title = 'SOH Elektrofahrzeuge — Masterarbeit Kolloquium';

  for (const canvas of canvases) {
    const slide = pptx.addSlide();
    const imgData = canvas.toDataURL('image/png');
    slide.addImage({ data: imgData, x: 0, y: 0, w: '100%', h: '100%' });
  }

  const blob = await pptx.write({ outputType: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'SOH_Presentation_Roodsaz.pptx';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// === UI Helpers ===

function createOverlay(format, totalSlides) {
  const overlay = document.createElement('div');
  overlay.id = 'export-overlay';
  overlay.innerHTML = `
    <div class="export-progress-modal">
      <div class="export-progress-title">Exporting ${format.toUpperCase()}</div>
      <div class="export-status">Preparing slides...</div>
      <div class="export-progress-bar">
        <div class="export-progress-fill" style="width: 0%"></div>
      </div>
      <div class="export-counter">0 / ${totalSlides}</div>
    </div>
  `;
  return overlay;
}

function updateOverlay(overlay, current, total) {
  const pct = Math.round((current / total) * 100);
  const fill = overlay.querySelector('.export-progress-fill');
  const counter = overlay.querySelector('.export-counter');
  const status = overlay.querySelector('.export-status');
  if (fill) fill.style.width = pct + '%';
  if (counter) counter.textContent = `${current} / ${total}`;
  if (status) status.textContent = `Capturing slide ${current}...`;
}

function updateOverlayStatus(overlay, text) {
  const status = overlay.querySelector('.export-status');
  const fill = overlay.querySelector('.export-progress-fill');
  if (status) status.textContent = text;
  if (fill) fill.style.width = '100%';
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

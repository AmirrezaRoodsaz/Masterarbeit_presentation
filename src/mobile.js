// =====================================================================
// Mobile Companion — render layer
// =====================================================================
// Renders MOBILE_SLIDES into the page. No Reveal/D3/GSAP imports.
// Wires theme + language toggles, ToC scroll-spy, back-to-top, QR overlay.
// =====================================================================

import { MOBILE_SLIDES } from './mobile-content.js';
import renderMathInElement from 'katex/contrib/auto-render';
import 'katex/dist/katex.min.css';
import QrCreator from 'qr-creator';

const PREFS_KEY = 'mobile-companion-prefs';

// ── Preferences ────────────────────────────────────────────────────────
function loadPrefs() {
  try {
    const stored = JSON.parse(localStorage.getItem(PREFS_KEY) ?? '{}');
    return {
      theme: stored.theme ?? 'auto',     // 'auto' | 'light' | 'dark'
      lang: stored.lang ?? 'de',         // 'de'   | 'en'
    };
  } catch {
    return { theme: 'auto', lang: 'de' };
  }
}

function savePrefs(prefs) {
  try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); }
  catch { /* private mode — silent */ }
}

const urlParams = new URLSearchParams(window.location.search);
const prefs = loadPrefs();
if (urlParams.get('lang')) prefs.lang = urlParams.get('lang');
if (urlParams.get('theme')) prefs.theme = urlParams.get('theme');

// ── Helpers ────────────────────────────────────────────────────────────
const t = (val, lang) =>
  val == null ? '' : (typeof val === 'string' ? val : (val[lang] ?? val.de ?? val.en ?? ''));

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

function applyTheme(theme) {
  document.body.classList.remove('theme-light', 'theme-dark');
  if (theme === 'light') document.body.classList.add('theme-light');
  else if (theme === 'dark') document.body.classList.add('theme-dark');
  else if (theme === 'auto') {
    const dark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    if (!dark) document.body.classList.add('theme-light');
  }
}

// ── Slide renderers (dispatch table) ───────────────────────────────────
const renderers = {
  hero: renderHero,
  standard: renderStandard,
  stats: renderStats,
  'vehicle-cards': renderVehicleCards,
  list: renderList,
};

function renderHero(s, lang) {
  const kicker = s.kicker ? `<span class="kicker">${escape(t(s.kicker, lang))}</span>` : '';
  const subtitle = s.subtitle ? `<p class="subtitle">${escape(t(s.subtitle, lang))}</p>` : '';
  const qaInvite = s.qaInvite ? `<div class="qa-invite">${escape(t(s.qaInvite, lang))}</div>` : '';

  let meta = '';
  if (s.meta) {
    const advisors = (s.meta.advisors ?? []).map((a) => `<div>${escape(t(a, lang))}</div>`).join('');
    meta = `<div class="meta">
      ${s.meta.author ? `<div class="author">${escape(s.meta.author)}</div>` : ''}
      ${s.meta.institution ? `<div>${escape(t(s.meta.institution, lang))}</div>` : ''}
      ${advisors}
      ${s.meta.date ? `<div class="date">${escape(s.meta.date)}</div>` : ''}
    </div>`;
  }

  let ack = '';
  if (s.acknowledgments) {
    const items = s.acknowledgments.list.map((a) =>
      `<li><strong>${escape(a.name)}</strong> · ${escape(t(a.role, lang))}</li>`
    ).join('');
    ack = `<div class="ack">
      <h3>${escape(t(s.acknowledgments.label, lang))}</h3>
      <ul>${items}</ul>
    </div>`;
  }

  return `<article class="slide hero" id="${s.id}">
    ${kicker}
    <h2>${escape(t(s.headline, lang))}</h2>
    ${subtitle}
    ${qaInvite}
    ${ack}
    ${meta}
  </article>`;
}

function renderStandard(s, lang) {
  const kicker = `<span class="kicker">Folie ${s.slideNumber} · <span class="num">${escape(t(s.section, lang))}</span></span>`;
  const body = t(s.body, lang); // HTML — trusted (we wrote it)
  const takeaway = s.takeaway
    ? `<div class="takeaway"><span class="takeaway-label">${lang === 'de' ? 'Kernaussage' : 'Takeaway'}</span>${escape(t(s.takeaway, lang))}</div>`
    : '';
  return `<article class="slide standard" id="${s.id}">
    ${kicker}
    <h2>${escape(t(s.headline, lang))}</h2>
    ${body}
    ${takeaway}
  </article>`;
}

function renderStats(s, lang) {
  const kicker = `<span class="kicker">Folie ${s.slideNumber} · <span class="num">${escape(t(s.section, lang))}</span></span>`;
  const claim = s.claim ? `<div class="claim">${t(s.claim, lang)}</div>` : '';
  const stats = (s.stats ?? []).map((stat) => {
    const tone = stat.tone ? ` ${stat.tone}` : '';
    return `<div class="stat">
      <div class="stat-value${tone}">${escape(stat.value)}</div>
      <div>
        <div class="stat-label">${escape(t(stat.label, lang))}</div>
        ${stat.sub ? `<div class="stat-sublabel">${escape(t(stat.sub, lang))}</div>` : ''}
      </div>
    </div>`;
  }).join('');
  return `<article class="slide stats" id="${s.id}">
    ${kicker}
    <h2>${escape(t(s.headline, lang))}</h2>
    ${claim}
    <div class="stat-row">${stats}</div>
  </article>`;
}

function renderVehicleCards(s, lang) {
  const kicker = `<span class="kicker">Folie ${s.slideNumber} · <span class="num">${escape(t(s.section, lang))}</span></span>`;

  const headlineMetric = s.headlineMetric ? `<div class="headline-metric">
    <span class="headline-num">${escape(s.headlineMetric.num)}</span>
    <span class="headline-text">${escape(t(s.headlineMetric.text, lang))}</span>
  </div>` : '';

  const primaryBadges = (s.primary?.badges ?? []).map((b) => {
    const cls = b.accent ? 'badge accent' : 'badge';
    return `<span class="${cls}">${escape(t(b.text, lang))}</span>`;
  }).join('');
  const primary = s.primary ? `<div class="vehicle-card primary">
    <div class="v-label">${escape(t(s.primary.label, lang))}</div>
    <div class="v-name">${escape(s.primary.name)}</div>
    <div class="badges">${primaryBadges}</div>
  </div>` : '';

  let diag = '';
  if (s.diagSystems) {
    const rows = s.diagSystems.systems.map((d) => `<div class="diag-row">
      <span class="diag-dot" style="background:${d.color}"></span>
      ${escape(d.name)}
      <span class="diag-role">${d.em ? `<em>${escape(t(d.role, lang))}</em>` : escape(t(d.role, lang))}</span>
    </div>`).join('');
    diag = `<div class="vehicle-card">
      <h3>${escape(t(s.diagSystems.heading, lang))}</h3>
      ${rows}
    </div>`;
  }

  let verif = '';
  if (s.verification) {
    const cards = s.verification.cards.map((v) => `<div class="verif">
      <div class="verif-name">${escape(v.name)}</div>
      <div class="verif-stats">${escape(v.stats)}</div>
      ${v.note ? `<div class="verif-note"><em>${escape(t(v.note, lang))}</em></div>` : ''}
    </div>`).join('');
    verif = `<div class="vehicle-card">
      <h3>${escape(t(s.verification.heading, lang))}</h3>
      ${cards}
    </div>`;
  }

  return `<article class="slide vehicle-cards" id="${s.id}">
    ${kicker}
    <h2>${escape(t(s.headline, lang))}</h2>
    ${headlineMetric}
    ${primary}
    ${diag}
    ${verif}
  </article>`;
}

function renderList(s, lang) {
  const kicker = `<span class="kicker">Folie ${s.slideNumber} · <span class="num">${escape(t(s.section, lang))}</span></span>`;
  const items = (s.items ?? []).map((item) => `<div class="agenda-item">
    <div class="agenda-num">${escape(item.num)}</div>
    <div class="agenda-text">
      <div class="agenda-title">${escape(t(item.title, lang))}</div>
      <div class="agenda-desc">${escape(t(item.desc, lang))}</div>
    </div>
  </div>`).join('');
  return `<article class="slide list" id="${s.id}">
    ${kicker}
    <h2>${escape(t(s.headline, lang))}</h2>
    ${items}
  </article>`;
}

// ── Nav + ToC ──────────────────────────────────────────────────────────
function buildNavBar(lang, theme) {
  const navBrand = lang === 'de' ? 'SOH <span class="accent">Kolloquium</span> · Roodsaz'
                                 : 'SOH <span class="accent">Colloquium</span> · Roodsaz';
  const langLabel = lang === 'de' ? 'EN' : 'DE';
  const themeIcon = theme === 'light' ? '☀' : theme === 'dark' ? '☾' : '🌓';
  const chartsLabel = lang === 'de' ? 'Diagramme' : 'Charts';
  return `
    <span class="nav-brand">${navBrand}</span>
    <button class="nav-btn" type="button" id="gallery-toggle" aria-label="${chartsLabel}">${chartsLabel}</button>
    <button class="nav-btn" type="button" id="qr-toggle" aria-label="QR Codes">QR</button>
    <button class="nav-btn" type="button" id="lang-toggle" aria-label="${lang === 'de' ? 'Switch to English' : 'Wechsel zu Deutsch'}">${langLabel}</button>
    <button class="nav-btn" type="button" id="theme-toggle" aria-label="Theme">${themeIcon}</button>
  `;
}

// Map a slide → stable section key (German section name as canonical id).
// Title and Thanks get their own keys so they appear as distinct chips.
function sectionKeyOf(s) {
  if (s.id === 'title') return '__title';
  if (s.id === 'thanks') return '__thanks';
  return t(s.section, 'de');
}

function sectionLabelOf(s, lang) {
  if (s.id === 'title') return lang === 'de' ? 'Titel' : 'Title';
  if (s.id === 'thanks') return lang === 'de' ? 'Danke' : 'Thanks';
  return t(s.section, lang);
}

function buildTocChips(slides, lang) {
  const seen = new Set();
  const chips = [];
  for (const s of slides) {
    const key = sectionKeyOf(s);
    if (seen.has(key)) continue;
    seen.add(key);
    chips.push({ key, target: s.id, label: sectionLabelOf(s, lang) });
  }
  return chips.map((c) =>
    `<button class="toc-chip" data-target="#${escape(c.target)}" data-section-key="${escape(c.key)}" type="button">${escape(c.label)}</button>`
  ).join('');
}

// ── KaTeX render ───────────────────────────────────────────────────────
function renderMath(root) {
  try {
    renderMathInElement(root, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
      ],
      throwOnError: false,
    });
  } catch (err) {
    console.warn('[mobile] KaTeX render failed:', err);
  }
}

// ── Render orchestrator ────────────────────────────────────────────────
function render(prefs) {
  const main = document.getElementById('mobile-app');
  const navBar = document.querySelector('.nav-bar');
  const toc = document.querySelector('.toc-inner');

  if (!main || !navBar || !toc) {
    console.error('[mobile] required mount nodes missing');
    return;
  }

  applyTheme(prefs.theme);

  navBar.innerHTML = buildNavBar(prefs.lang, prefs.theme);
  toc.innerHTML = buildTocChips(MOBILE_SLIDES, prefs.lang);
  main.innerHTML = MOBILE_SLIDES.map((s) => {
    const fn = renderers[s.type];
    if (!fn) {
      console.warn('[mobile] no renderer for type:', s.type);
      return '';
    }
    return fn(s, prefs.lang);
  }).join('');

  // Tag each rendered article with its section-key so scroll-spy can map back.
  MOBILE_SLIDES.forEach((s) => {
    const el = main.querySelector(`#${CSS.escape(s.id)}`);
    if (el) el.dataset.sectionKey = sectionKeyOf(s);
  });

  renderMath(main);

  const firstChip = toc.querySelector('.toc-chip');
  if (firstChip) firstChip.classList.add('current');

  document.documentElement.lang = prefs.lang;
}

// ── Scroll-spy ─────────────────────────────────────────────────────────
// Each <article class="slide"> carries data-section-key set during render.
// On scroll, find the chip whose section-key matches the visible slide.
let scrollObserver = null;
function setupScrollSpy() {
  if (scrollObserver) scrollObserver.disconnect();
  const slides = [...document.querySelectorAll('.slide')];
  const chips = [...document.querySelectorAll('.toc-chip')];
  const chipByKey = Object.fromEntries(chips.map((c) => [c.dataset.sectionKey, c]));

  scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const key = e.target.dataset.sectionKey;
        const active = chipByKey[key];
        if (!active) return;
        chips.forEach((c) => c.classList.toggle('current', c === active));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  slides.forEach((s) => scrollObserver.observe(s));
}

// ── QR overlay ─────────────────────────────────────────────────────────
let detectedIP = null;

async function fetchLocalIP() {
  try {
    const res = await fetch('/local-ip.json');
    const data = await res.json();
    if (data.ip) { detectedIP = data.ip; return; }
  } catch { /* fall through */ }
  const host = window.location.hostname;
  if (host && host !== 'localhost' && host !== '127.0.0.1') detectedIP = host;
}

function getQrEntries() {
  const ip = detectedIP || window.location.hostname || 'localhost';
  return [
    { id: 'slides',   name: 'Kolloquium',                url: `http://${ip}:3000` },
    { id: 'soh-pro',  name: 'SOH Tool (Pro)',            url: `http://${ip}:8501` },
    { id: 'soh-easy', name: 'SOH Tool (Easy)',           url: `http://${ip}:8000` },
    { id: 'thesis',   name: 'Masterarbeit Bericht (PDF)', url: `${window.location.origin}/thesis.pdf` },
    { id: 'github',   name: 'GitHub',                    url: 'https://github.com/simeonkt/MA-Amirreza-VehicleSohTesting' },
  ];
}

let qrOverlayEl = null;
function buildQrOverlay() {
  qrOverlayEl = document.createElement('div');
  qrOverlayEl.className = 'qr-overlay';
  qrOverlayEl.setAttribute('hidden', '');
  qrOverlayEl.innerHTML = `
    <div class="qr-panel">
      <div class="qr-header">
        <h2>Links &amp; QR-Codes</h2>
        <button class="qr-close" type="button" aria-label="Schließen">×</button>
      </div>
      <div class="qr-grid"></div>
      <p class="qr-hint">Tippe auf einen QR-Code, um den Link direkt zu öffnen.</p>
    </div>
  `;
  document.body.appendChild(qrOverlayEl);

  qrOverlayEl.addEventListener('click', (e) => {
    if (e.target === qrOverlayEl) closeQrOverlay();
  });
  qrOverlayEl.querySelector('.qr-close').addEventListener('click', closeQrOverlay);
}

function fillQrGrid() {
  const grid = qrOverlayEl.querySelector('.qr-grid');
  const entries = getQrEntries();
  grid.innerHTML = entries.map((e) => `
    <a class="qr-card" href="${escape(e.url)}" target="_blank" rel="noopener">
      <canvas class="qr-canvas" data-id="${escape(e.id)}" width="160" height="160"></canvas>
      <span class="qr-label">${escape(e.name)}</span>
      <span class="qr-url">${escape(e.url.replace(/^https?:\/\//, ''))}</span>
    </a>
  `).join('');

  // Fill canvases via qr-creator
  const fillColor = getComputedStyle(document.body).getPropertyValue('--text-primary').trim() || '#f0f0f0';
  entries.forEach((e) => {
    const canvas = grid.querySelector(`canvas[data-id="${e.id}"]`);
    if (!canvas) return;
    QrCreator.render({ text: e.url, radius: 0.4, ecLevel: 'M', fill: fillColor, background: 'transparent', size: 320 }, canvas);
  });
}

function openQrOverlay() {
  if (!qrOverlayEl) buildQrOverlay();
  fillQrGrid();
  qrOverlayEl.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}

function closeQrOverlay() {
  if (!qrOverlayEl) return;
  qrOverlayEl.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

// ── Diagram gallery overlay ────────────────────────────────────────────
const GALLERY_CATEGORIES = [
  { key: 'flowcharts',   label: { de: 'Flussdiagramme',     en: 'Flowcharts' },             path: '/assets/diagrams/flowcharts/' },
  { key: 'architecture', label: { de: 'Softwarearchitektur', en: 'Software Architecture' }, path: '/assets/diagrams/architecture/' },
];

let galleryOverlayEl = null;
let galleryData = null;
let galleryActiveCat = 'flowcharts';
let galleryLightboxEl = null;

async function loadGalleryData() {
  if (galleryData) return galleryData;
  try {
    const res = await fetch('/assets/data/diagrams.json');
    galleryData = await res.json();
  } catch (err) {
    console.warn('[mobile] gallery data fetch failed:', err);
    galleryData = { flowcharts: [], architecture: [] };
  }
  return galleryData;
}

function buildGalleryOverlay() {
  galleryOverlayEl = document.createElement('div');
  galleryOverlayEl.className = 'gallery-overlay';
  galleryOverlayEl.setAttribute('hidden', '');
  galleryOverlayEl.innerHTML = `
    <div class="gallery-panel">
      <div class="gallery-header">
        <h2 class="gallery-title">${prefs.lang === 'de' ? 'Diagramme' : 'Diagrams'}</h2>
        <button class="gallery-close" type="button" aria-label="Schließen">×</button>
      </div>
      <div class="gallery-tabs"></div>
      <div class="gallery-grid"></div>
    </div>
  `;
  document.body.appendChild(galleryOverlayEl);

  galleryOverlayEl.addEventListener('click', (e) => {
    if (e.target === galleryOverlayEl) closeGalleryOverlay();
  });
  galleryOverlayEl.querySelector('.gallery-close').addEventListener('click', closeGalleryOverlay);
  galleryOverlayEl.querySelector('.gallery-tabs').addEventListener('click', (e) => {
    const btn = e.target.closest('.gallery-tab');
    if (btn) renderGalleryGrid(btn.dataset.cat);
  });
  galleryOverlayEl.querySelector('.gallery-grid').addEventListener('click', (e) => {
    const card = e.target.closest('.gallery-card');
    if (card) openLightbox(card.dataset.cat, parseInt(card.dataset.idx, 10));
  });
}

function renderGalleryTabs() {
  const tabs = galleryOverlayEl.querySelector('.gallery-tabs');
  tabs.innerHTML = GALLERY_CATEGORIES.map((cat) => `
    <button class="gallery-tab ${cat.key === galleryActiveCat ? 'active' : ''}" type="button" data-cat="${cat.key}">
      ${escape(t(cat.label, prefs.lang))}
      <span class="gallery-tab-count">${(galleryData[cat.key] ?? []).length}</span>
    </button>
  `).join('');
}

function renderGalleryGrid(catKey) {
  galleryActiveCat = catKey;
  const cat = GALLERY_CATEGORIES.find((c) => c.key === catKey);
  const items = galleryData[catKey] ?? [];
  renderGalleryTabs();
  const grid = galleryOverlayEl.querySelector('.gallery-grid');
  grid.innerHTML = items.map((item, i) => {
    const labelKey = prefs.lang === 'en' ? 'label_en' : 'label';
    return `<button class="gallery-card" type="button" data-cat="${escape(catKey)}" data-idx="${i}">
      <div class="gallery-thumb">
        <img src="${escape(cat.path + item.file)}" alt="${escape(item[labelKey] ?? item.label)}" loading="lazy" />
      </div>
      <div class="gallery-card-label">
        <span class="gallery-num">${String(i + 1).padStart(2, '0')}</span>
        <span class="gallery-name">${escape(item[labelKey] ?? item.label)}</span>
      </div>
    </button>`;
  }).join('');
}

function openGalleryOverlay() {
  if (!galleryOverlayEl) buildGalleryOverlay();
  loadGalleryData().then(() => {
    galleryOverlayEl.querySelector('.gallery-title').textContent = prefs.lang === 'de' ? 'Diagramme' : 'Diagrams';
    renderGalleryGrid(galleryActiveCat);
  });
  galleryOverlayEl.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}

function closeGalleryOverlay() {
  if (!galleryOverlayEl) return;
  galleryOverlayEl.setAttribute('hidden', '');
  closeLightbox();
  document.body.style.overflow = '';
}

function openLightbox(catKey, idx) {
  const cat = GALLERY_CATEGORIES.find((c) => c.key === catKey);
  const item = galleryData?.[catKey]?.[idx];
  if (!cat || !item) return;
  if (!galleryLightboxEl) {
    galleryLightboxEl = document.createElement('div');
    galleryLightboxEl.className = 'gallery-lightbox';
    galleryLightboxEl.setAttribute('hidden', '');
    galleryLightboxEl.innerHTML = `
      <button class="lightbox-close" type="button" aria-label="Schließen">×</button>
      <div class="lightbox-stage"><img alt="" /></div>
      <div class="lightbox-caption"></div>
    `;
    document.body.appendChild(galleryLightboxEl);
    galleryLightboxEl.addEventListener('click', (e) => {
      if (e.target === galleryLightboxEl || e.target.classList.contains('lightbox-close')) closeLightbox();
    });
  }
  const labelKey = prefs.lang === 'en' ? 'label_en' : 'label';
  const label = item[labelKey] ?? item.label;
  galleryLightboxEl.querySelector('img').src = cat.path + item.file;
  galleryLightboxEl.querySelector('img').alt = label;
  galleryLightboxEl.querySelector('.lightbox-caption').textContent = `${String(idx + 1).padStart(2, '0')} · ${label}`;
  galleryLightboxEl.removeAttribute('hidden');
}

function closeLightbox() {
  if (galleryLightboxEl) galleryLightboxEl.setAttribute('hidden', '');
}

// ── Click handlers (delegated) ─────────────────────────────────────────
function wireDelegates() {
  document.addEventListener('click', (ev) => {
    const target = ev.target.closest('[data-target], #lang-toggle, #theme-toggle, #qr-toggle, #gallery-toggle, .back-top');
    if (!target) return;

    if (target.id === 'lang-toggle') {
      prefs.lang = prefs.lang === 'de' ? 'en' : 'de';
      savePrefs(prefs);
      const y = window.scrollY;
      render(prefs);
      setupScrollSpy();
      window.scrollTo({ top: y, behavior: 'instant' });
      return;
    }

    if (target.id === 'theme-toggle') {
      const cycle = { auto: 'light', light: 'dark', dark: 'auto' };
      prefs.theme = cycle[prefs.theme] ?? 'auto';
      savePrefs(prefs);
      const y = window.scrollY;
      render(prefs);
      setupScrollSpy();
      window.scrollTo({ top: y, behavior: 'instant' });
      return;
    }

    if (target.id === 'qr-toggle') {
      openQrOverlay();
      return;
    }

    if (target.id === 'gallery-toggle') {
      openGalleryOverlay();
      return;
    }

    if (target.classList?.contains('back-top')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetSel = target.dataset?.target;
    if (targetSel) {
      ev.preventDefault();
      document.querySelector(targetSel)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Escape key — close lightbox first, then overlays
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (galleryLightboxEl && !galleryLightboxEl.hasAttribute('hidden')) { closeLightbox(); return; }
    if (galleryOverlayEl && !galleryOverlayEl.hasAttribute('hidden')) { closeGalleryOverlay(); return; }
    if (qrOverlayEl && !qrOverlayEl.hasAttribute('hidden')) closeQrOverlay();
  });
}

// ── Back-to-top visibility ─────────────────────────────────────────────
function wireBackToTop() {
  const btn = document.querySelector('.back-top');
  if (!btn) return;
  const onScroll = () => btn.classList.toggle('visible', window.scrollY > 600);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── Boot ───────────────────────────────────────────────────────────────
async function boot() {
  fetchLocalIP(); // fire and forget — used when QR overlay opens
  render(prefs);
  setupScrollSpy();
  wireDelegates();
  wireBackToTop();

  window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', () => {
    if (prefs.theme === 'auto') applyTheme('auto');
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

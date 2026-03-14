/**
 * Flowchart Gallery — two-column thumbnail grid with click-to-zoom lightbox.
 * Loads pre-rendered SVGs from /assets/diagrams/.
 */

const CATEGORIES = [
  { key: 'flowcharts', label: 'Flussdiagramme', label_en: 'Flowcharts', path: '/assets/diagrams/flowcharts/' },
  { key: 'architecture', label: 'Softwarearchitektur', label_en: 'Software Architecture', path: '/assets/diagrams/architecture/' },
];

let data = null;
let lightbox = null;

export async function initFlowchartGallery() {
  const container = document.getElementById('flowchart-gallery');
  if (!container) return;

  const res = await fetch('/assets/data/diagrams.json');
  data = await res.json();

  container.innerHTML = '';

  // Category tabs
  const tabBar = document.createElement('div');
  tabBar.className = 'fg-tab-bar';

  // Grid container
  const grid = document.createElement('div');
  grid.className = 'fg-grid';

  let activeCategory = 'flowcharts';

  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'fg-tab';
    btn.dataset.cat = cat.key;
    btn.innerHTML = `
      <span class="lang-de">${cat.label}</span>
      <span class="lang-en" hidden>${cat.label_en}</span>
      <span class="fg-tab-count">${data[cat.key].length}</span>
    `;
    tabBar.appendChild(btn);
  });

  container.appendChild(tabBar);
  container.appendChild(grid);

  function renderGrid(catKey) {
    activeCategory = catKey;
    const cat = CATEGORIES.find(c => c.key === catKey);
    const items = data[catKey];
    if (!cat || !items) return;

    // Update tab active state
    tabBar.querySelectorAll('.fg-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === catKey);
    });

    grid.innerHTML = items.map((item, i) => `
      <button class="fg-card" data-cat="${catKey}" data-idx="${i}">
        <div class="fg-thumb">
          <img src="${cat.path}${item.file}" alt="${item.label}" loading="lazy" />
        </div>
        <div class="fg-label">
          <span class="fg-number">${String(i + 1).padStart(2, '0')}</span>
          <span class="lang-de">${item.label}</span>
          <span class="lang-en" hidden>${item.label_en}</span>
        </div>
      </button>
    `).join('');
  }

  // Tab click
  tabBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.fg-tab');
    if (btn) renderGrid(btn.dataset.cat);
  });

  // Card click → lightbox
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.fg-card');
    if (!card) return;
    const cat = CATEGORIES.find(c => c.key === card.dataset.cat);
    const item = data[card.dataset.cat][parseInt(card.dataset.idx)];
    if (cat && item) openLightbox(cat, item);
  });

  // Create lightbox (once)
  createLightbox();

  // Initial render
  renderGrid('flowcharts');
}

function createLightbox() {
  lightbox = document.createElement('div');
  lightbox.className = 'fg-lightbox';
  lightbox.hidden = true;
  lightbox.innerHTML = `
    <div class="fg-lightbox-backdrop"></div>
    <div class="fg-lightbox-content">
      <div class="fg-lightbox-header">
        <span class="fg-lightbox-title"></span>
        <button class="fg-lightbox-close" title="Schließen">&times;</button>
      </div>
      <div class="fg-lightbox-viewer"></div>
    </div>
  `;
  document.body.appendChild(lightbox);

  // Close on backdrop click or close button
  lightbox.querySelector('.fg-lightbox-backdrop').addEventListener('click', closeLightbox);
  lightbox.querySelector('.fg-lightbox-close').addEventListener('click', closeLightbox);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) {
      e.stopPropagation();
      closeLightbox();
    }
  });
}

function openLightbox(cat, item) {
  const isEn = document.body.classList.contains('lang-en');
  lightbox.querySelector('.fg-lightbox-title').textContent = isEn ? item.label_en : item.label;
  lightbox.querySelector('.fg-lightbox-viewer').innerHTML =
    `<img src="${cat.path}${item.file}" alt="${item.label}" />`;
  lightbox.hidden = false;
  // Trigger animation on next frame
  requestAnimationFrame(() => lightbox.classList.add('open'));
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  // Wait for animation to finish before hiding
  setTimeout(() => { lightbox.hidden = true; }, 260);
}

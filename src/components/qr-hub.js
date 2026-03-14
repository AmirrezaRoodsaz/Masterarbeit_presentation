/**
 * QR Code Hub — modal overlay with scannable QR codes for audience interaction.
 * Press Q or click the QR button in the sidebar to toggle.
 *
 * Uses qr-creator (Nimiq) to render QR codes on canvas elements.
 * Auto-detects local IP for dynamic app URLs.
 */
import QrCreator from 'qr-creator';
import { createIcons, X, Activity, Zap, Monitor, Github, FileText, Wifi, WifiOff, Edit3 } from 'lucide';

// ── QR Config ───────────────────────────────────────────────

let detectedIP = null;

async function fetchLocalIP() {
  // start.py writes public/local-ip.json with the detected LAN IP
  try {
    const res = await fetch('/local-ip.json');
    const data = await res.json();
    if (data.ip) {
      detectedIP = data.ip;
      return;
    }
  } catch { /* file not found — starter app hasn't run yet */ }

  // Fallback: use hostname if accessed via IP directly
  const host = window.location.hostname;
  if (host && host !== 'localhost' && host !== '127.0.0.1') {
    detectedIP = host;
  }
}

function getIP() {
  return customIP || detectedIP || 'localhost';
}

function getQrEntries() {
  const ip = getIP();

  return [
    { id: 'slides',    name: 'Kolloquium',               url: `http://${ip}:3000`,    icon: 'monitor',   type: 'dynamic' },
    { id: 'soh-pro',   name: 'SOH Tool (Pro)',            url: `http://${ip}:8501`,    icon: 'activity',  type: 'dynamic' },
    { id: 'soh-easy',  name: 'SOH Tool (Easy)',           url: `http://${ip}:8000`,    icon: 'zap',       type: 'dynamic' },
    { id: 'thesis',    name: 'Masterarbeit Bericht PDF',  url: '/thesis.pdf',          icon: 'file-text', type: 'static' },
    { id: 'github',    name: 'GitHub',                    url: 'https://github.com/AmirrezaRoodsaz', icon: 'github', type: 'static' },
  ];
}

// Layout: which entries go in each row (by id)
const LAYOUT_ROWS = [
  ['slides'],               // Row 1: Kolloquium centered
  ['soh-pro', 'soh-easy'],  // Row 2: Pro + Easy side by side
  ['thesis'],               // Row 3: Masterarbeit PDF centered
  ['github'],               // Row 4: GitHub centered
];

// ── State ───────────────────────────────────────────────────

let modalEl = null;
let isOpen = false;
let zoomedEntry = null;   // null = grid view, entry object = zoomed single QR
let customIP = null;      // user override for IP

// ── Init ────────────────────────────────────────────────────

export async function initQrHub() {
  await fetchLocalIP();
  createModalDOM();

  // Listen for toggle event from input-manager
  document.addEventListener('toggle-qr-hub', toggleQrHub);

  // Sidebar button click
  document.getElementById('btn-qr')?.addEventListener('click', toggleQrHub);
}

export function toggleQrHub() {
  if (isOpen) closeQrHub();
  else openQrHub();
}

function openQrHub() {
  if (!modalEl) return;
  isOpen = true;
  zoomedEntry = null;
  modalEl.classList.add('open');
  renderContent();
  document.dispatchEvent(new CustomEvent('qr-hub-open'));
}

function closeQrHub() {
  if (!modalEl) return;
  isOpen = false;
  zoomedEntry = null;
  modalEl.classList.remove('open');
  document.dispatchEvent(new CustomEvent('qr-hub-close'));
}

// ── DOM ─────────────────────────────────────────────────────

function createModalDOM() {
  modalEl = document.createElement('div');
  modalEl.id = 'qr-hub-modal';
  modalEl.className = 'qr-overlay';

  modalEl.innerHTML = `
    <div class="qr-panel">
      <div class="qr-header">
        <h2>QR Code Hub</h2>
        <div class="qr-ip-info">
          <span class="qr-ip-badge" id="qr-ip-badge">
            <i data-lucide="wifi"></i>
            <span id="qr-ip-text"></span>
          </span>
          <button class="qr-ip-edit" id="qr-ip-edit" title="IP manuell setzen">
            <i data-lucide="edit-3"></i>
          </button>
        </div>
        <button class="qr-close" id="qr-close" title="Schließen (Esc)">
          <i data-lucide="x"></i>
        </button>
      </div>
      <div class="qr-body" id="qr-body"></div>
    </div>
  `;

  document.body.appendChild(modalEl);

  // Close handlers
  modalEl.querySelector('#qr-close').addEventListener('click', closeQrHub);
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeQrHub();
  });

  // IP edit
  modalEl.querySelector('#qr-ip-edit').addEventListener('click', promptIPEdit);

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      if (zoomedEntry) {
        // Back to grid
        zoomedEntry = null;
        renderContent();
      } else {
        closeQrHub();
      }
    }
  });
}

// ── Render ──────────────────────────────────────────────────

function renderContent() {
  const body = modalEl.querySelector('#qr-body');
  if (!body) return;

  const entries = getQrEntries();

  // Update IP display
  const ipText = modalEl.querySelector('#qr-ip-text');
  const ipBadge = modalEl.querySelector('#qr-ip-badge');
  const currentIP = getIP();
  if (ipText) ipText.textContent = currentIP;
  if (ipBadge) {
    const isLocal = currentIP === 'localhost' || currentIP === '127.0.0.1';
    ipBadge.className = `qr-ip-badge ${isLocal ? 'local' : 'network'}`;
  }

  if (zoomedEntry) {
    renderZoomed(body, zoomedEntry);
  } else {
    renderGrid(body, entries);
  }

  // Re-create Lucide icons in the new DOM
  createIcons({ icons: { X, Activity, Zap, Monitor, Github, FileText, Wifi, WifiOff, Edit3 } });
}

function renderGrid(body, entries) {
  const rowsHTML = LAYOUT_ROWS.map(rowIds => {
    const cols = rowIds.length;
    const cards = rowIds
      .map(id => entries.find(e => e.id === id))
      .filter(Boolean)
      .map(e => cardHTML(e))
      .join('');
    return `<div class="qr-row qr-row-${cols}">${cards}</div>`;
  }).join('');

  body.innerHTML = rowsHTML;

  // Render QR codes into canvases
  entries.forEach(entry => {
    const canvas = body.querySelector(`#qr-canvas-${entry.id}`);
    if (canvas) renderQR(canvas, resolveURL(entry), 200);
  });

  // Bind click → zoom
  body.querySelectorAll('.qr-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.entryId;
      const entry = entries.find(e => e.id === id);
      if (entry) {
        zoomedEntry = entry;
        renderContent();
      }
    });
  });
}

function renderZoomed(body, entry) {
  const url = resolveURL(entry);

  body.innerHTML = `
    <div class="qr-zoomed">
      <div class="qr-zoomed-card">
        <div class="qr-zoomed-canvas-wrap">
          <canvas id="qr-canvas-zoomed"></canvas>
        </div>
        <h3 class="qr-zoomed-name">${entry.name}</h3>
        <p class="qr-zoomed-url">${url}</p>
        <p class="qr-zoomed-hint">Klicken oder ESC zum Zurückkehren</p>
      </div>
    </div>
  `;

  // Render large QR
  const canvas = body.querySelector('#qr-canvas-zoomed');
  if (canvas) renderQR(canvas, url, 400);

  // Click anywhere in zoomed view → back to grid
  body.querySelector('.qr-zoomed').addEventListener('click', () => {
    zoomedEntry = null;
    renderContent();
  });
}

function cardHTML(entry) {
  return `
    <div class="qr-card" data-entry-id="${entry.id}" tabindex="0">
      <div class="qr-card-canvas-wrap">
        <canvas id="qr-canvas-${entry.id}"></canvas>
      </div>
      <div class="qr-card-info">
        <i data-lucide="${entry.icon}"></i>
        <span class="qr-card-name">${entry.name}</span>
      </div>
      <span class="qr-card-url">${resolveURL(entry)}</span>
    </div>
  `;
}

// ── QR Rendering ────────────────────────────────────────────

function renderQR(canvas, text, size) {
  QrCreator.render({
    text,
    radius: 0.4,
    ecLevel: 'H',
    fill: '#E2001A',      // HSBoRed
    background: '#1a1a2e', // bg-surface
    size,
  }, canvas);
}

function resolveURL(entry) {
  if (entry.type === 'static') {
    // For relative paths, build full URL
    if (entry.url.startsWith('/')) {
      return `${window.location.origin}${entry.url}`;
    }
    return entry.url;
  }
  // Dynamic: use custom IP if set
  if (customIP) {
    const urlObj = new URL(entry.url);
    urlObj.hostname = customIP;
    return urlObj.toString();
  }
  return entry.url;
}

// ── IP Edit ─────────────────────────────────────────────────

function promptIPEdit() {
  const current = getIP();
  const input = prompt('IP-Adresse eingeben (z.B. 192.168.1.42):', current);
  if (input !== null && input.trim()) {
    customIP = input.trim();
    renderContent();
  }
}

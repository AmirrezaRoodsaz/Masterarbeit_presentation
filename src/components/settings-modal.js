/**
 * Settings Modal — tabbed overlay for configuring input and display preferences.
 */
import { getSettings, updateSettings, resetSettings, ACTION_LABELS, formatKey, GAMEPAD_BUTTON_NAMES, getDefaults } from './settings-store.js';
import { createIcons, Keyboard, Monitor, Gamepad2, Settings, X, RotateCcw } from 'lucide';

let modalEl = null;
let isOpen = false;
let activeTab = 'keyboard';
let listeningFor = null; // { category, key } when capturing a new binding

export function initSettingsModal() {
  createModalDOM();
  document.addEventListener('toggle-settings', toggleSettings);

  // Gamepad live state for the UI
  document.addEventListener('gamepad-state', (e) => {
    if (isOpen && activeTab === 'gamepad') {
      updateGamepadLiveState(e.detail);
    }
  });

  document.addEventListener('gamepad-status', (e) => {
    if (isOpen && activeTab === 'gamepad') {
      updateGamepadConnectionStatus(e.detail);
    }
  });
}

function createModalDOM() {
  modalEl = document.createElement('div');
  modalEl.id = 'settings-modal';
  modalEl.className = 'settings-overlay';
  modalEl.innerHTML = `
    <div class="settings-panel">
      <div class="settings-header">
        <h2>
          <i data-lucide="settings" style="width:24px;height:24px;"></i>
          <span class="lang-de">Einstellungen</span>
          <span class="lang-en" hidden>Settings</span>
        </h2>
        <div class="settings-header-actions">
          <button class="settings-reset" id="settings-reset" title="Reset">
            <i data-lucide="rotate-ccw" style="width:16px;height:16px;"></i>
            <span>Reset</span>
          </button>
          <button class="settings-close" id="settings-close">
            <i data-lucide="x" style="width:20px;height:20px;"></i>
          </button>
        </div>
      </div>
      <div class="settings-tabs">
        <button class="settings-tab active" data-tab="keyboard">
          <i data-lucide="keyboard" style="width:16px;height:16px;"></i>
          <span class="lang-de">Tastatur</span>
          <span class="lang-en" hidden>Keyboard</span>
        </button>
        <button class="settings-tab" data-tab="presenter">
          <i data-lucide="monitor" style="width:16px;height:16px;"></i>
          <span>Presenter</span>
        </button>
        <button class="settings-tab" data-tab="gamepad">
          <i data-lucide="gamepad-2" style="width:16px;height:16px;"></i>
          <span>Gamepad</span>
        </button>
        <button class="settings-tab" data-tab="display">
          <i data-lucide="settings" style="width:16px;height:16px;"></i>
          <span class="lang-de">Anzeige</span>
          <span class="lang-en" hidden>Display</span>
        </button>
      </div>
      <div class="settings-body" id="settings-body">
        <!-- Content rendered dynamically -->
      </div>
    </div>
  `;
  document.body.appendChild(modalEl);

  // Event listeners
  modalEl.querySelector('#settings-close').addEventListener('click', closeSettings);
  modalEl.querySelector('#settings-reset').addEventListener('click', () => {
    resetSettings();
    renderTabContent();
  });
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeSettings();
  });

  // Tab switching
  modalEl.querySelectorAll('.settings-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activeTab = tab.dataset.tab;
      modalEl.querySelectorAll('.settings-tab').forEach(t => t.classList.toggle('active', t === tab));
      listeningFor = null;
      renderTabContent();
    });
  });

  // Global key listener for rebinding
  document.addEventListener('keydown', handleRebindKey);

  createIcons({ icons: { Keyboard, Monitor, Gamepad2, Settings, X, RotateCcw } });
}

export function toggleSettings() {
  if (isOpen) closeSettings();
  else openSettings();
}

function openSettings() {
  if (!modalEl) return;
  isOpen = true;
  modalEl.classList.add('open');
  renderTabContent();
  document.dispatchEvent(new CustomEvent('settings-modal-open'));
  // Re-render lucide icons in modal
  createIcons({ icons: { Keyboard, Monitor, Gamepad2, Settings, X, RotateCcw } });
}

function closeSettings() {
  if (!modalEl) return;
  isOpen = false;
  listeningFor = null;
  modalEl.classList.remove('open');
  document.dispatchEvent(new CustomEvent('settings-modal-close'));
}

// === Tab renderers ===

function renderTabContent() {
  const body = document.getElementById('settings-body');
  if (!body) return;

  switch (activeTab) {
    case 'keyboard': body.innerHTML = renderKeyboardTab(); break;
    case 'presenter': body.innerHTML = renderPresenterTab(); break;
    case 'gamepad': body.innerHTML = renderGamepadTab(); break;
    case 'display': body.innerHTML = renderDisplayTab(); break;
  }

  bindTabEvents();
}

function renderKeyboardTab() {
  const s = getSettings();
  const lang = s.display.defaultLanguage || 'de';
  let html = '<div class="bindings-list">';

  for (const [action, labels] of Object.entries(ACTION_LABELS.keyboard)) {
    const currentKey = s.keyboard[action] || '—';
    const isListening = listeningFor?.category === 'keyboard' && listeningFor?.key === action;
    html += `
      <div class="binding-row">
        <span class="binding-label">${labels[lang]}</span>
        <button class="key-binding-btn ${isListening ? 'listening' : ''}"
                data-category="keyboard" data-action="${action}">
          ${isListening ? '<span class="listening-text">...</span>' : formatKey(currentKey)}
        </button>
      </div>
    `;
  }

  html += '</div>';
  return html;
}

function renderPresenterTab() {
  const s = getSettings();
  const lang = s.display.defaultLanguage || 'de';
  let html = `
    <div class="setting-toggle">
      <label class="toggle-label">
        <span class="lang-de">Presenter-Fernbedienung aktivieren</span>
        <span class="lang-en" hidden>Enable presenter remote</span>
      </label>
      <label class="switch">
        <input type="checkbox" id="presenter-enabled" ${s.presenter.enabled ? 'checked' : ''}>
        <span class="slider"></span>
      </label>
    </div>
    <p class="setting-hint">
      <span class="lang-de">Die meisten Presenter senden Page ↓ / Page ↑ Tasten. Passen Sie die Zuordnung an Ihr Gerät an.</span>
      <span class="lang-en" hidden>Most presenters send Page Down / Page Up keys. Adjust the mapping to your device.</span>
    </p>
    <div class="bindings-list">
  `;

  for (const [action, labels] of Object.entries(ACTION_LABELS.presenter)) {
    const currentKey = s.presenter[action] || '—';
    if (action === 'enabled') continue;
    const isListening = listeningFor?.category === 'presenter' && listeningFor?.key === action;
    html += `
      <div class="binding-row">
        <span class="binding-label">${labels[lang]}</span>
        <button class="key-binding-btn ${isListening ? 'listening' : ''}"
                data-category="presenter" data-action="${action}">
          ${isListening ? '<span class="listening-text">...</span>' : formatKey(currentKey)}
        </button>
      </div>
    `;
  }

  html += '</div>';
  return html;
}

function renderGamepadTab() {
  const s = getSettings();
  const lang = s.display.defaultLanguage || 'de';
  let html = `
    <div class="setting-toggle">
      <label class="toggle-label">
        <span class="lang-de">Gamepad aktivieren</span>
        <span class="lang-en" hidden>Enable gamepad</span>
      </label>
      <label class="switch">
        <input type="checkbox" id="gamepad-enabled" ${s.gamepad.enabled ? 'checked' : ''}>
        <span class="slider"></span>
      </label>
    </div>
    <div id="gamepad-connection" class="gamepad-connection">
      <span class="badge ${s.gamepad.enabled ? 'warning' : ''}">
        <span class="lang-de">Kein Gamepad erkannt</span>
        <span class="lang-en" hidden>No gamepad detected</span>
      </span>
    </div>
    <div class="setting-toggle" style="margin-top:0.5rem;">
      <label class="toggle-label">
        <span class="lang-de">Stick-Navigation (linker Stick)</span>
        <span class="lang-en" hidden>Stick navigation (left stick)</span>
      </label>
      <label class="switch">
        <input type="checkbox" id="gamepad-sticknav" ${s.gamepad.stickNav ? 'checked' : ''}>
        <span class="slider"></span>
      </label>
    </div>
    <div class="setting-row">
      <label class="setting-label">Deadzone</label>
      <input type="range" id="gamepad-deadzone" min="0.1" max="0.8" step="0.05" value="${s.gamepad.deadzone}">
      <span id="gamepad-deadzone-value">${s.gamepad.deadzone}</span>
    </div>
    <div class="bindings-list" style="margin-top:1rem;">
  `;

  for (const [action, labels] of Object.entries(ACTION_LABELS.gamepad)) {
    const binding = s.gamepad[action];
    const isListening = listeningFor?.category === 'gamepad' && listeningFor?.key === action;
    const btnName = binding?.index !== undefined ? (GAMEPAD_BUTTON_NAMES[binding.index] || `Button ${binding.index}`) : '—';
    html += `
      <div class="binding-row">
        <span class="binding-label">${labels[lang]}</span>
        <button class="key-binding-btn gamepad-bind ${isListening ? 'listening' : ''}"
                data-category="gamepad" data-action="${action}">
          ${isListening ? '<span class="listening-text">...</span>' : btnName}
        </button>
      </div>
    `;
  }

  html += `
    </div>
    <div id="gamepad-live" class="gamepad-live" hidden>
      <h3>Live State</h3>
      <div id="gamepad-buttons-display" class="gamepad-buttons-display"></div>
    </div>
  `;
  return html;
}

function renderDisplayTab() {
  const s = getSettings();
  const timerMinutes = Math.floor(s.display.timerTarget / 60);
  const warningMinutes = Math.floor(s.display.timerWarning / 60);

  return `
    <div class="settings-form">
      <div class="setting-row">
        <label class="setting-label">
          <span class="lang-de">Standardmodus</span>
          <span class="lang-en" hidden>Default Mode</span>
        </label>
        <select id="display-mode" class="setting-select">
          <option value="browse" ${s.display.defaultMode === 'browse' ? 'selected' : ''}>Browse Mode</option>
          <option value="defense" ${s.display.defaultMode === 'defense' ? 'selected' : ''}>Defense Mode</option>
        </select>
      </div>
      <div class="setting-row">
        <label class="setting-label">
          <span class="lang-de">Standardsprache</span>
          <span class="lang-en" hidden>Default Language</span>
        </label>
        <select id="display-language" class="setting-select">
          <option value="de" ${s.display.defaultLanguage === 'de' ? 'selected' : ''}>Deutsch</option>
          <option value="en" ${s.display.defaultLanguage === 'en' ? 'selected' : ''}>English</option>
        </select>
      </div>
      <div class="setting-row">
        <label class="setting-label">
          <span class="lang-de">Timer-Ziel (Minuten)</span>
          <span class="lang-en" hidden>Timer Target (minutes)</span>
        </label>
        <input type="number" id="display-timer-target" class="setting-input" value="${timerMinutes}" min="1" max="120">
      </div>
      <div class="setting-row">
        <label class="setting-label">
          <span class="lang-de">Timer-Warnung bei (Minuten)</span>
          <span class="lang-en" hidden>Timer Warning at (minutes)</span>
        </label>
        <input type="number" id="display-timer-warning" class="setting-input" value="${warningMinutes}" min="1" max="120">
      </div>
    </div>
  `;
}

// === Event binding ===

function bindTabEvents() {
  // Key binding buttons
  document.querySelectorAll('.key-binding-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      const action = btn.dataset.action;

      if (listeningFor?.category === category && listeningFor?.key === action) {
        // Cancel listening
        listeningFor = null;
        renderTabContent();
        return;
      }

      listeningFor = { category, key: action };
      renderTabContent();

      // For gamepad bindings, start listening for gamepad button press
      if (category === 'gamepad') {
        listenForGamepadButton(action);
      }
    });
  });

  // Toggle switches
  document.getElementById('presenter-enabled')?.addEventListener('change', (e) => {
    updateSettings('presenter', 'enabled', e.target.checked);
  });

  document.getElementById('gamepad-enabled')?.addEventListener('change', (e) => {
    updateSettings('gamepad', 'enabled', e.target.checked);
  });

  document.getElementById('gamepad-sticknav')?.addEventListener('change', (e) => {
    updateSettings('gamepad', 'stickNav', e.target.checked);
  });

  // Deadzone slider
  document.getElementById('gamepad-deadzone')?.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    document.getElementById('gamepad-deadzone-value').textContent = val;
    updateSettings('gamepad', 'deadzone', val);
  });

  // Display settings
  document.getElementById('display-mode')?.addEventListener('change', (e) => {
    updateSettings('display', 'defaultMode', e.target.value);
  });

  document.getElementById('display-language')?.addEventListener('change', (e) => {
    updateSettings('display', 'defaultLanguage', e.target.value);
  });

  document.getElementById('display-timer-target')?.addEventListener('change', (e) => {
    updateSettings('display', 'timerTarget', parseInt(e.target.value) * 60);
  });

  document.getElementById('display-timer-warning')?.addEventListener('change', (e) => {
    updateSettings('display', 'timerWarning', parseInt(e.target.value) * 60);
  });
}

// === Key rebinding ===

function handleRebindKey(e) {
  if (!isOpen) return;

  // Escape closes modal (or cancels rebinding)
  if (e.key === 'Escape') {
    if (listeningFor) {
      listeningFor = null;
      renderTabContent();
    } else {
      closeSettings();
    }
    return;
  }

  if (!listeningFor) return;
  if (listeningFor.category === 'gamepad') return; // gamepad uses different listener

  e.preventDefault();
  e.stopPropagation();

  const key = e.key;
  updateSettings(listeningFor.category, listeningFor.key, key);
  listeningFor = null;
  renderTabContent();
}

// === Gamepad button rebinding ===

function listenForGamepadButton(action) {
  const check = () => {
    if (!listeningFor || listeningFor.key !== action) return;

    const gamepads = navigator.getGamepads();
    const gp = gamepads[0] || gamepads[1] || gamepads[2] || gamepads[3];
    if (!gp) {
      requestAnimationFrame(check);
      return;
    }

    for (let i = 0; i < gp.buttons.length; i++) {
      if (gp.buttons[i].pressed) {
        updateSettings('gamepad', action, { type: 'button', index: i });
        listeningFor = null;
        renderTabContent();
        return;
      }
    }

    requestAnimationFrame(check);
  };
  requestAnimationFrame(check);
}

// === Gamepad live state display ===

function updateGamepadLiveState(state) {
  const container = document.getElementById('gamepad-live');
  const display = document.getElementById('gamepad-buttons-display');
  if (!container || !display) return;

  container.hidden = false;

  let html = '<div class="gamepad-btn-grid">';
  state.buttons.forEach((btn, i) => {
    const name = GAMEPAD_BUTTON_NAMES[i] || `${i}`;
    html += `<div class="gamepad-btn-indicator ${btn.pressed ? 'pressed' : ''}">${name}</div>`;
  });
  html += '</div>';

  // Axes
  if (state.axes.length >= 2) {
    html += `<div class="gamepad-axes">L: ${state.axes[0].toFixed(2)}, ${state.axes[1].toFixed(2)}`;
    if (state.axes.length >= 4) {
      html += ` | R: ${state.axes[2].toFixed(2)}, ${state.axes[3].toFixed(2)}`;
    }
    html += '</div>';
  }

  display.innerHTML = html;
}

function updateGamepadConnectionStatus(detail) {
  const el = document.getElementById('gamepad-connection');
  if (!el) return;
  if (detail.connected) {
    el.innerHTML = `<span class="badge success">${detail.id}</span>`;
  } else {
    el.innerHTML = `<span class="badge warning"><span class="lang-de">Kein Gamepad erkannt</span><span class="lang-en" hidden>No gamepad detected</span></span>`;
  }
}

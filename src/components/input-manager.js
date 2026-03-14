/**
 * Input Manager — unified handler for keyboard, presenter remote, and gamepad.
 * Reads bindings from settings-store.js. Replaces hardcoded shortcuts in shell.js.
 */
import { getSettings } from './settings-store.js';
import { toggleDefenseMode, toggleTimer } from './shell.js';

let deck = null;
let gamepadRAF = null;
let lastGamepadButtons = [];
let lastStickTime = 0;
let settingsModalOpen = false;

// Track if settings modal is open (to suppress navigation)
document.addEventListener('settings-modal-open', () => { settingsModalOpen = true; });
document.addEventListener('settings-modal-close', () => { settingsModalOpen = false; });

export function initInputManager(revealDeck) {
  deck = revealDeck;
  initKeyboardHandler();
  initGamepadHandler();

  // Re-init when settings change
  document.addEventListener('settings-changed', () => {
    // Gamepad enable/disable
    const s = getSettings();
    if (s.gamepad.enabled && !gamepadRAF) {
      startGamepadPolling();
    }
    if (!s.gamepad.enabled && gamepadRAF) {
      cancelAnimationFrame(gamepadRAF);
      gamepadRAF = null;
    }
  });
}

// === Action dispatcher ===
function dispatch(action) {
  if (!deck) return;

  switch (action) {
    case 'nextSlide':
      deck.next();
      break;
    case 'prevSlide':
      deck.prev();
      break;
    case 'nextFragment':
      deck.next();
      break;
    case 'prevFragment':
      deck.prev();
      break;
    case 'firstSlide':
      deck.slide(0);
      break;
    case 'lastSlide':
      deck.slide(deck.getTotalSlides() - 1);
      break;
    case 'defenseMode':
      toggleDefenseMode();
      break;
    case 'timer':
      toggleTimer();
      break;
    case 'language':
      document.dispatchEvent(new CustomEvent('toggle-language'));
      break;
    case 'qrHub':
      document.dispatchEvent(new CustomEvent('toggle-qr-hub'));
      break;
    case 'settings':
      document.dispatchEvent(new CustomEvent('toggle-settings'));
      break;
    case 'blank':
      document.body.classList.toggle('blanked');
      break;
    case 'start':
      // Start presentation = enter defense mode if not already
      if (!document.body.classList.contains('defense-mode')) {
        toggleDefenseMode();
      }
      break;
    case 'nextSection': {
      // Jump to next section by finding the next data-section boundary
      const sections = getSectionSlideIndices();
      const current = deck.getSlidePastCount();
      const next = sections.find(i => i > current);
      if (next !== undefined) deck.slide(next);
      break;
    }
    case 'prevSection': {
      const sections = getSectionSlideIndices();
      const current = deck.getSlidePastCount();
      const prev = [...sections].reverse().find(i => i < current);
      if (prev !== undefined) deck.slide(prev);
      break;
    }
  }
}

function getSectionSlideIndices() {
  const slides = deck.getSlides();
  const indices = [];
  let lastSection = null;
  slides.forEach((slide, i) => {
    const section = slide.getAttribute('data-section');
    if (section && section !== lastSection) {
      indices.push(i);
      lastSection = section;
    }
  });
  return indices;
}

// === Keyboard + Presenter handler ===
function initKeyboardHandler() {
  document.addEventListener('keydown', (e) => {
    // Don't intercept if typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    // Don't intercept if settings modal is capturing keys for rebinding
    if (settingsModalOpen && e.target.closest('.key-binding-btn.listening')) return;

    const s = getSettings();
    const key = e.key;

    // Check keyboard bindings
    for (const [action, boundKey] of Object.entries(s.keyboard)) {
      if (key === boundKey || key.toLowerCase() === boundKey) {
        e.preventDefault();
        dispatch(action);
        return;
      }
    }

    // Check presenter bindings (if enabled)
    if (s.presenter.enabled) {
      for (const [action, boundKey] of Object.entries(s.presenter)) {
        if (action === 'enabled') continue;
        if (boundKey && (key === boundKey || key.toLowerCase() === boundKey)) {
          e.preventDefault();
          dispatch(action);
          return;
        }
      }
    }
  });
}

// === Gamepad handler ===
function initGamepadHandler() {
  const s = getSettings();
  if (s.gamepad.enabled) {
    startGamepadPolling();
  }

  // Listen for gamepad connect/disconnect
  window.addEventListener('gamepadconnected', (e) => {
    console.log(`Gamepad connected: ${e.gamepad.id}`);
    document.dispatchEvent(new CustomEvent('gamepad-status', { detail: { connected: true, id: e.gamepad.id } }));
    const settings = getSettings();
    if (settings.gamepad.enabled) startGamepadPolling();
  });

  window.addEventListener('gamepaddisconnected', (e) => {
    console.log(`Gamepad disconnected: ${e.gamepad.id}`);
    document.dispatchEvent(new CustomEvent('gamepad-status', { detail: { connected: false, id: e.gamepad.id } }));
  });
}

function startGamepadPolling() {
  if (gamepadRAF) return;
  pollGamepad();
}

function pollGamepad() {
  const s = getSettings();
  if (!s.gamepad.enabled) {
    gamepadRAF = null;
    return;
  }

  const gamepads = navigator.getGamepads();
  const gp = gamepads[0] || gamepads[1] || gamepads[2] || gamepads[3];

  if (gp) {
    // Dispatch live state for settings UI
    document.dispatchEvent(new CustomEvent('gamepad-state', {
      detail: {
        buttons: gp.buttons.map(b => ({ pressed: b.pressed, value: b.value })),
        axes: [...gp.axes],
      }
    }));

    // Check button presses (edge detection — only on press, not hold)
    const currentButtons = gp.buttons.map(b => b.pressed);

    for (const [action, binding] of Object.entries(s.gamepad)) {
      if (typeof binding !== 'object' || !binding || binding.type !== 'button') continue;
      const idx = binding.index;
      if (idx >= 0 && idx < currentButtons.length) {
        if (currentButtons[idx] && (!lastGamepadButtons[idx])) {
          dispatch(action);
        }
      }
    }

    // Stick navigation (left stick X axis)
    if (s.gamepad.stickNav) {
      const now = Date.now();
      const axisX = gp.axes[0] || 0;
      if (Math.abs(axisX) > s.gamepad.deadzone && now - lastStickTime > s.gamepad.repeatDelay) {
        if (axisX > s.gamepad.deadzone) dispatch('nextSlide');
        if (axisX < -s.gamepad.deadzone) dispatch('prevSlide');
        lastStickTime = now;
      }
    }

    lastGamepadButtons = currentButtons;
  }

  gamepadRAF = requestAnimationFrame(pollGamepad);
}

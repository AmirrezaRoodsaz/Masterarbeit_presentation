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
// Per-button debounce timestamps (ms). Phase 20: prevents bouncy
// gamepad buttons from registering twice in quick succession.
let lastButtonDispatchAt = [];
const BUTTON_DEBOUNCE_MS = 80;

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
    case 'firstSlide':
      deck.slide(0);
      break;
    case 'lastSlide': {
      // Phase 20: jump to slide-thanks (the last counted main slide).
      // flowchart-gallery + backups follow but should NOT be the
      // target of a "last slide" command during normal navigation.
      const target = document.getElementById('slide-thanks');
      if (target) {
        const sections = Array.from(document.querySelectorAll('.reveal .slides > section'));
        const idx = sections.indexOf(target);
        if (idx >= 0) {
          deck.slide(idx);
          break;
        }
      }
      // Fallback if slide-thanks isn't in the DOM
      deck.slide(deck.getTotalSlides() - 1);
      break;
    }
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
    case 'scrollNotesUp':
      document.dispatchEvent(new CustomEvent('gamepad-scroll-notes', { detail: { delta: -120 } }));
      break;
    case 'scrollNotesDown':
      document.dispatchEvent(new CustomEvent('gamepad-scroll-notes', { detail: { delta: 120 } }));
      break;
    case 'speakerView':
      document.dispatchEvent(new CustomEvent('open-speaker-view'));
      break;
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
      if (!boundKey) continue;
      if (key === boundKey || key.toLowerCase() === boundKey) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
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
          e.stopPropagation();
          e.stopImmediatePropagation();
          dispatch(action);
          return;
        }
      }
    }
  }, true); // capture phase — runs before Reveal/plugin handlers
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

    // Check button presses (edge detection — only on press, not hold).
    // Phase 20: also ensures each button index dispatches AT MOST ONE
    // action per frame and applies a per-button debounce so bouncy
    // hardware can't register two clicks on a single press.
    const currentButtons = gp.buttons.map(b => b.pressed);
    const now = Date.now();
    const firedThisFrame = new Set();

    for (const [action, binding] of Object.entries(s.gamepad)) {
      if (typeof binding !== 'object' || !binding || binding.type !== 'button') continue;
      const idx = binding.index;
      if (idx < 0 || idx >= currentButtons.length) continue;
      if (firedThisFrame.has(idx)) continue;

      const isPress = currentButtons[idx] && !lastGamepadButtons[idx];
      if (!isPress) continue;

      // Hardware debounce — ignore re-presses of the same button
      // within BUTTON_DEBOUNCE_MS of the previous dispatch.
      const lastAt = lastButtonDispatchAt[idx] || 0;
      if (now - lastAt < BUTTON_DEBOUNCE_MS) continue;

      firedThisFrame.add(idx);
      lastButtonDispatchAt[idx] = now;
      dispatch(action);
    }

    // Stick navigation (left stick X axis → slide nav)
    if (s.gamepad.stickNav) {
      const now = Date.now();
      const axisX = gp.axes[0] || 0;
      if (Math.abs(axisX) > s.gamepad.deadzone && now - lastStickTime > s.gamepad.repeatDelay) {
        if (axisX > s.gamepad.deadzone) dispatch('nextSlide');
        if (axisX < -s.gamepad.deadzone) dispatch('prevSlide');
        lastStickTime = now;
      }
    }

    // Stick scroll (left stick Y axis → scroll speaker notes)
    if (s.gamepad.stickScrollNotes) {
      const axisY = gp.axes[1] || 0;
      if (Math.abs(axisY) > s.gamepad.deadzone) {
        document.dispatchEvent(new CustomEvent('gamepad-scroll-notes', {
          detail: { delta: axisY * (s.gamepad.scrollSpeed || 80) },
        }));
      }
    }

    lastGamepadButtons = currentButtons;
  }

  gamepadRAF = requestAnimationFrame(pollGamepad);
}

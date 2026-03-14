/**
 * Settings Store — centralized settings with localStorage persistence.
 * All input handlers and display preferences read from here.
 */

const STORAGE_KEY = 'presentation-settings';

const DEFAULT_SETTINGS = {
  keyboard: {
    defenseMode: 'd',
    timer: 't',
    language: 'l',
    qrHub: 'q',
    settings: ',',
    nextSlide: 'ArrowRight',
    prevSlide: 'ArrowLeft',
    nextFragment: 'ArrowDown',
    prevFragment: 'ArrowUp',
    firstSlide: 'Home',
    lastSlide: 'End',
    blank: 'b',
  },
  presenter: {
    enabled: true,
    nextSlide: 'PageDown',
    prevSlide: 'PageUp',
    blank: '.',              // some presenters send period for blank
    start: 'F5',
  },
  gamepad: {
    enabled: false,
    nextSlide: { type: 'button', index: 0 },      // A / Cross
    prevSlide: { type: 'button', index: 1 },       // B / Circle
    nextSection: { type: 'button', index: 5 },     // RB / R1
    prevSection: { type: 'button', index: 4 },     // LB / L1
    defenseMode: { type: 'button', index: 3 },     // Y / Triangle
    timer: { type: 'button', index: 2 },           // X / Square
    stickNav: true,                                 // left stick for navigation
    deadzone: 0.3,
    repeatDelay: 400,                               // ms before stick-repeat
  },
  display: {
    defaultMode: 'browse',
    defaultLanguage: 'de',
    timerTarget: 1200,
    timerWarning: 1080,
  },
};

// Action labels for the settings UI
export const ACTION_LABELS = {
  keyboard: {
    defenseMode: { de: 'Präsentationsmodus', en: 'Defense Mode' },
    timer: { de: 'Timer ein/aus', en: 'Toggle Timer' },
    language: { de: 'Sprache wechseln', en: 'Toggle Language' },
    qrHub: { de: 'QR-Code Hub', en: 'QR Code Hub' },
    settings: { de: 'Einstellungen', en: 'Settings' },
    nextSlide: { de: 'Nächste Folie', en: 'Next Slide' },
    prevSlide: { de: 'Vorherige Folie', en: 'Previous Slide' },
    nextFragment: { de: 'Nächstes Fragment', en: 'Next Fragment' },
    prevFragment: { de: 'Vorheriges Fragment', en: 'Previous Fragment' },
    firstSlide: { de: 'Erste Folie', en: 'First Slide' },
    lastSlide: { de: 'Letzte Folie', en: 'Last Slide' },
    blank: { de: 'Bildschirm schwarz', en: 'Blank Screen' },
  },
  presenter: {
    nextSlide: { de: 'Nächste Folie', en: 'Next Slide' },
    prevSlide: { de: 'Vorherige Folie', en: 'Previous Slide' },
    blank: { de: 'Bildschirm schwarz', en: 'Blank Screen' },
    start: { de: 'Präsentation starten', en: 'Start Presentation' },
  },
  gamepad: {
    nextSlide: { de: 'Nächste Folie', en: 'Next Slide' },
    prevSlide: { de: 'Vorherige Folie', en: 'Previous Slide' },
    nextSection: { de: 'Nächster Abschnitt', en: 'Next Section' },
    prevSection: { de: 'Vorheriger Abschnitt', en: 'Previous Section' },
    defenseMode: { de: 'Präsentationsmodus', en: 'Defense Mode' },
    timer: { de: 'Timer ein/aus', en: 'Toggle Timer' },
  },
};

// Human-readable key names
export function formatKey(key) {
  const MAP = {
    ArrowRight: '→', ArrowLeft: '←', ArrowUp: '↑', ArrowDown: '↓',
    PageDown: 'Page ↓', PageUp: 'Page ↑',
    ' ': 'Space', Escape: 'Esc', Enter: 'Enter',
    Home: 'Home', End: 'End',
    F5: 'F5', F11: 'F11',
  };
  return MAP[key] || key.toUpperCase();
}

// Gamepad button names (standard mapping)
export const GAMEPAD_BUTTON_NAMES = [
  'A / ✕', 'B / ○', 'X / □', 'Y / △',
  'LB / L1', 'RB / R1', 'LT / L2', 'RT / R2',
  'Back / Share', 'Start / Options', 'L3', 'R3',
  'D-Pad ↑', 'D-Pad ↓', 'D-Pad ←', 'D-Pad →',
  'Guide',
];

let _settings = null;

function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) &&
      target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

export function getSettings() {
  if (_settings) return _settings;
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    _settings = stored ? deepMerge(DEFAULT_SETTINGS, stored) : { ...DEFAULT_SETTINGS };
  } catch {
    _settings = { ...DEFAULT_SETTINGS };
  }
  return _settings;
}

export function updateSettings(category, key, value) {
  const s = getSettings();
  if (s[category]) {
    s[category][key] = value;
  }
  _settings = s;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch { /* quota exceeded — ignore */ }
  document.dispatchEvent(new CustomEvent('settings-changed', { detail: { category, key, value } }));
}

export function resetSettings() {
  _settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  localStorage.removeItem(STORAGE_KEY);
  document.dispatchEvent(new CustomEvent('settings-changed', { detail: { category: 'all' } }));
}

export function getDefaults() {
  return DEFAULT_SETTINGS;
}

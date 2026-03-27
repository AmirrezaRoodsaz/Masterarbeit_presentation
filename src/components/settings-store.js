/**
 * Settings Store — centralized settings with localStorage persistence.
 * All input handlers and display preferences read from here.
 */

const STORAGE_KEY = 'presentation-settings';

const DEFAULT_SETTINGS = {
  keyboard: {
    nextSlide: 'ArrowRight',
    prevSlide: 'ArrowLeft',
    scrollNotesUp: 'ArrowUp',
    scrollNotesDown: 'ArrowDown',
    firstSlide: 'Home',
    lastSlide: 'End',
    defenseMode: 'd',
    timer: 't',
    language: 'l',
    qrHub: 'q',
    settings: ',',
    blank: 'b',
    speakerView: 's',
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
    nextSlide: { type: 'button', index: 13 },      // D-Pad ↓
    prevSlide: { type: 'button', index: 12 },       // D-Pad ↑
    scrollNotesUp: { type: 'button', index: 14 },   // D-Pad ←
    scrollNotesDown: { type: 'button', index: 15 }, // D-Pad →
    nextSection: { type: 'button', index: 5 },      // RB / R1
    prevSection: { type: 'button', index: 7 },      // RT / R2
    defenseMode: { type: 'button', index: 3 },      // Y / Triangle
    timer: { type: 'button', index: 0 },            // A / Cross
    language: { type: 'button', index: 1 },          // B / Circle
    qrHub: { type: 'button', index: 2 },             // X / Square
    settings: null,
    blank: null,
    firstSlide: { type: 'button', index: 6 },       // LT / L2
    lastSlide: { type: 'button', index: 4 },         // LB / L1
    speakerView: null,
    stickNav: true,                                 // left stick X axis for slide navigation
    stickScrollNotes: true,                         // left stick Y axis scrolls speaker notes
    scrollSpeed: 80,                                // pixels per frame when stick is pushed
    deadzone: 0.3,
    repeatDelay: 400,                               // ms before stick-repeat
  },
  display: {
    defaultMode: 'browse',
    defaultLanguage: 'de',
    theme: 'light',
    animationsEnabled: false,
    viewMode: 'auto',
    timerTarget: 1800,
    timerWarning: 1620,
  },
};

// Action labels for the settings UI
export const ACTION_LABELS = {
  keyboard: {
    nextSlide: { de: 'Nächste Folie', en: 'Next Slide' },
    prevSlide: { de: 'Vorherige Folie', en: 'Previous Slide' },
    scrollNotesUp: { de: 'Notizen hoch', en: 'Scroll Notes Up' },
    scrollNotesDown: { de: 'Notizen runter', en: 'Scroll Notes Down' },
    firstSlide: { de: 'Erste Folie', en: 'First Slide' },
    lastSlide: { de: 'Letzte Folie', en: 'Last Slide' },
    defenseMode: { de: 'Präsentationsmodus', en: 'Defense Mode' },
    timer: { de: 'Timer ein/aus', en: 'Toggle Timer' },
    language: { de: 'Sprache wechseln', en: 'Toggle Language' },
    qrHub: { de: 'QR-Code Hub', en: 'QR Code Hub' },
    settings: { de: 'Einstellungen', en: 'Settings' },
    blank: { de: 'Bildschirm schwarz', en: 'Blank Screen' },
    speakerView: { de: 'Speaker View öffnen', en: 'Open Speaker View' },
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
    scrollNotesUp: { de: 'Notizen hoch', en: 'Scroll Notes Up' },
    scrollNotesDown: { de: 'Notizen runter', en: 'Scroll Notes Down' },
    nextSection: { de: 'Nächster Abschnitt', en: 'Next Section' },
    prevSection: { de: 'Vorheriger Abschnitt', en: 'Previous Section' },
    defenseMode: { de: 'Präsentationsmodus', en: 'Defense Mode' },
    timer: { de: 'Timer ein/aus', en: 'Toggle Timer' },
    language: { de: 'Sprache wechseln', en: 'Toggle Language' },
    qrHub: { de: 'QR-Code Hub', en: 'QR Code Hub' },
    settings: { de: 'Einstellungen', en: 'Settings' },
    blank: { de: 'Bildschirm schwarz', en: 'Blank Screen' },
    firstSlide: { de: 'Erste Folie', en: 'First Slide' },
    lastSlide: { de: 'Letzte Folie', en: 'Last Slide' },
    speakerView: { de: 'Speaker View öffnen', en: 'Open Speaker View' },
  },
};

// Human-readable key names
export function formatKey(key) {
  if (!key) return '—';
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

/**
 * Demo Embed — Streamlit iframe with video fallback for slide 17.
 * Tries to load the Streamlit app; if unavailable, shows a pre-recorded video
 * or a placeholder message.
 */

const STREAMLIT_URL = 'http://localhost:8501';
const VIDEO_PATH = '/assets/demo/soh-tool-demo.mp4';

/**
 * Check if Streamlit is running by attempting a fetch.
 * Returns true if reachable, false otherwise.
 */
async function isStreamlitRunning() {
  try {
    await fetch(STREAMLIT_URL, { mode: 'no-cors', signal: AbortSignal.timeout(3000) });
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if the fallback video file exists.
 */
async function hasVideoFallback() {
  try {
    const res = await fetch(VIDEO_PATH, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false;
  }
}

function createIframe() {
  const iframe = document.createElement('iframe');
  iframe.src = STREAMLIT_URL;
  iframe.style.cssText = 'width:100%;height:100%;border:none;border-radius:8px;';
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('allow', 'clipboard-write');
  return iframe;
}

function createVideo() {
  const video = document.createElement('video');
  video.src = VIDEO_PATH;
  video.controls = true;
  video.style.cssText = 'width:100%;height:100%;border-radius:8px;background:#000;';
  video.setAttribute('preload', 'metadata');
  return video;
}

function createOfflineMessage() {
  const en = document.body.classList.contains('lang-en');
  const div = document.createElement('div');
  div.className = 'demo-placeholder';
  div.innerHTML = `
    <p style="font-size:1.4rem;color:var(--text-primary);margin-bottom:0.5rem;">
      ${en ? 'Streamlit app not running' : 'Streamlit-App nicht gestartet'}
    </p>
    <p style="color:var(--text-secondary);">
      ${en
        ? 'Start with: <code style="color:var(--accent)">streamlit run app.py --server.port 8501</code>'
        : 'Starten mit: <code style="color:var(--accent)">streamlit run app.py --server.port 8501</code>'}
    </p>
    <p class="demo-info" style="margin-top:1rem;">
      ${en ? 'No demo video available yet — record one for the fallback.' : 'Noch kein Demo-Video vorhanden — für den Fallback aufnehmen.'}
    </p>
  `;
  return div;
}

/**
 * Initialize the demo container on slide 17.
 * Priority: Streamlit iframe > pre-recorded video > offline message.
 */
export async function initDemoEmbed() {
  const container = document.getElementById('demo-container');
  if (!container) return;

  const [streamlitUp, videoExists] = await Promise.all([
    isStreamlitRunning(),
    hasVideoFallback(),
  ]);

  // Clear placeholder
  container.innerHTML = '';

  if (streamlitUp) {
    container.appendChild(createIframe());
  } else if (videoExists) {
    container.appendChild(createVideo());
  } else {
    container.appendChild(createOfflineMessage());
  }
}

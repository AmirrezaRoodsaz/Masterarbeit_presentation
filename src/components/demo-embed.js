/**
 * Demo Embed — Streamlit iframe for slide 17 (live demo only).
 * Shows the app if running, otherwise an offline message.
 */

const STREAMLIT_URL = 'http://localhost:8501';

async function isStreamlitRunning() {
  try {
    await fetch(STREAMLIT_URL, { mode: 'no-cors', signal: AbortSignal.timeout(3000) });
    return true;
  } catch {
    return false;
  }
}

function createIframe() {
  const iframe = document.createElement('iframe');
  iframe.src = STREAMLIT_URL;
  iframe.style.cssText = 'width:100%;height:100%;border:none;border-radius:8px;';
  iframe.setAttribute('allow', 'clipboard-write');
  return iframe;
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
  `;
  return div;
}

export async function initDemoEmbed() {
  const container = document.getElementById('demo-container');
  if (!container) return;

  const streamlitUp = await isStreamlitRunning();
  container.innerHTML = '';

  if (streamlitUp) {
    container.appendChild(createIframe());
  } else {
    container.appendChild(createOfflineMessage());
  }
}

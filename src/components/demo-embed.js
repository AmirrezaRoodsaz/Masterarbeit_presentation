/**
 * Demo Embed — Streamlit iframes on separate slides.
 * Each .demo-container[data-port] gets its own iframe or offline message.
 */

async function isAppRunning(port) {
  try {
    await fetch(`http://localhost:${port}`, { mode: 'no-cors', signal: AbortSignal.timeout(3000) });
    return true;
  } catch {
    return false;
  }
}

function createIframe(port) {
  const iframe = document.createElement('iframe');
  iframe.src = `http://localhost:${port}`;
  iframe.style.cssText = 'width:100%;height:100%;border:none;border-radius:8px;';
  iframe.setAttribute('allow', 'clipboard-write');
  return iframe;
}

function createOfflineMessage(port) {
  const en = document.body.classList.contains('lang-en');
  const div = document.createElement('div');
  div.className = 'demo-placeholder';
  div.innerHTML = `
    <p style="font-size:1.4rem;color:var(--text-primary);margin-bottom:0.5rem;">
      ${en ? 'App not running' : 'App nicht gestartet'}
    </p>
    <p style="color:var(--text-secondary);">
      ${en
        ? `Start with: <code style="color:var(--accent)">streamlit run app.py --server.port ${port}</code>`
        : `Starten mit: <code style="color:var(--accent)">streamlit run app.py --server.port ${port}</code>`}
    </p>
  `;
  return div;
}

export async function initDemoEmbed() {
  const containers = document.querySelectorAll('.demo-container[data-port]');
  if (!containers.length) return;

  for (const container of containers) {
    const port = container.dataset.port;
    const running = await isAppRunning(port);
    container.innerHTML = '';
    container.appendChild(running ? createIframe(port) : createOfflineMessage(port));
  }
}

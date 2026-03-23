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

function createFullscreenBtn(container) {
  const btn = document.createElement('button');
  btn.className = 'demo-fullscreen-btn';
  btn.title = 'Fullscreen';
  btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path class="fs-expand" d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
    <path class="fs-shrink" style="display:none" d="M4 14h3a2 2 0 0 1 2 2v3m4-19v3a2 2 0 0 0 2 2h3m-3 10v3m-6-3H4m16-6h-3a2 2 0 0 1-2-2V4"/>
  </svg>`;

  btn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  });

  container.addEventListener('fullscreenchange', () => {
    const isFs = document.fullscreenElement === container;
    btn.querySelector('.fs-expand').style.display = isFs ? 'none' : '';
    btn.querySelector('.fs-shrink').style.display = isFs ? '' : 'none';
  });

  return btn;
}

export async function initDemoEmbed() {
  const containers = document.querySelectorAll('.demo-container[data-port]');
  if (!containers.length) return;

  for (const container of containers) {
    const port = container.dataset.port;
    const running = await isAppRunning(port);
    container.innerHTML = '';
    container.style.position = 'relative';
    container.appendChild(running ? createIframe(port) : createOfflineMessage(port));
    container.appendChild(createFullscreenBtn(container));
  }
}

/**
 * Demo Embed — Streamlit iframes for slide 17 (Pro + Easy apps).
 * Tab switcher to toggle between the two apps.
 */

const APPS = [
  { id: 'pro',  label: 'SOH Tool (Pro)',  labelEn: 'SOH Tool (Pro)',  port: 8501 },
  { id: 'easy', label: 'SOH Tool (Easy)', labelEn: 'SOH Tool (Easy)', port: 8502 },
];

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
  const container = document.getElementById('demo-container');
  if (!container) return;

  // Check which apps are running
  const statuses = await Promise.all(APPS.map(app => isAppRunning(app.port)));

  container.innerHTML = '';

  // Tab bar
  const tabBar = document.createElement('div');
  tabBar.style.cssText = 'display:flex;gap:0.5rem;margin-bottom:0.75rem;';

  // Iframe panels
  const panels = document.createElement('div');
  panels.style.cssText = 'flex:1;position:relative;min-height:0;';

  APPS.forEach((app, i) => {
    // Tab button
    const btn = document.createElement('button');
    btn.textContent = app.label;
    btn.dataset.appId = app.id;
    btn.style.cssText = `
      padding:0.5rem 1.2rem;border:none;border-radius:6px 6px 0 0;cursor:pointer;
      font-family:var(--font-primary);font-size:0.9rem;font-weight:600;
      transition:all 150ms ease;
    `;
    tabBar.appendChild(btn);

    // Panel
    const panel = document.createElement('div');
    panel.dataset.panelId = app.id;
    panel.style.cssText = 'position:absolute;inset:0;display:none;';

    if (statuses[i]) {
      panel.appendChild(createIframe(app.port));
    } else {
      panel.appendChild(createOfflineMessage(app.port));
    }
    panels.appendChild(panel);
  });

  container.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;';
  container.appendChild(tabBar);
  container.appendChild(panels);

  // Tab switching logic
  function activateTab(appId) {
    tabBar.querySelectorAll('button').forEach(btn => {
      const active = btn.dataset.appId === appId;
      btn.style.background = active ? 'var(--accent)' : 'var(--bg-surface)';
      btn.style.color = active ? '#fff' : 'var(--text-secondary)';
    });
    panels.querySelectorAll('[data-panel-id]').forEach(panel => {
      panel.style.display = panel.dataset.panelId === appId ? 'block' : 'none';
    });
  }

  tabBar.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-app-id]');
    if (btn) activateTab(btn.dataset.appId);
  });

  // Activate first tab
  activateTab(APPS[0].id);
}

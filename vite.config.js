import { defineConfig } from 'vite';

/**
 * Sync plugin — supports both SSE (legacy follow mode) AND a plain polling
 * endpoint /api/state for the iPad speaker view.
 *
 * Why polling for iPad: Safari iOS over LAN has known issues buffering
 * EventSource streams (no flush until threshold, idle timeouts). Plain
 * HTTP GET every 500 ms is bulletproof.
 *
 * Channels:
 *   POST /api/sync   → update slide state {h, v, f, id, title}
 *   POST /api/timer  → update timer state {seconds, running, target, warning, overtime}
 *   GET  /api/sync   → SSE stream of slide state
 *   GET  /api/timer  → SSE stream of timer state
 *   GET  /api/state  → JSON snapshot of {sync, timer} — for polling clients
 */
function syncPlugin() {
  const state = {
    sync:  { h: 0, v: 0, f: -1, id: '', title: '' },
    timer: { seconds: 0, running: false, target: 900, warning: 810, overtime: false },
  };
  let syncRev = 0;
  let timerRev = 0;
  const sseClients = { sync: new Set(), timer: new Set() };

  function makeChannel(channel) {
    return function (req, res, next) {
      if (req.method === 'GET') {
        // SSE stream
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'X-Accel-Buffering': 'no',
        });
        res.write(`data: ${JSON.stringify(state[channel])}\n\n`);
        sseClients[channel].add(res);
        req.on('close', () => sseClients[channel].delete(res));
      } else if (req.method === 'POST') {
        let body = '';
        req.on('data', (c) => { body += c; });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            const merged = { ...state[channel], ...data };
            const before = JSON.stringify(state[channel]);
            const after  = JSON.stringify(merged);
            if (before !== after) {
              state[channel] = merged;
              if (channel === 'sync') syncRev++;
              else timerRev++;
              const msg = `data: ${after}\n\n`;
              for (const c of sseClients[channel]) c.write(msg);
            }
          } catch { /* ignore */ }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end('{"ok":true}');
        });
      } else {
        next();
      }
    };
  }

  return {
    name: 'sync-plugin',
    configureServer(server) {
      server.middlewares.use('/api/sync', makeChannel('sync'));
      server.middlewares.use('/api/timer', makeChannel('timer'));

      // Plain JSON polling endpoint — bulletproof for iPad / iPhone Safari
      server.middlewares.use('/api/state', (req, res, next) => {
        if (req.method !== 'GET') return next();
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(JSON.stringify({
          sync: state.sync,
          timer: state.timer,
          syncRev,
          timerRev,
          serverTime: Date.now(),
        }));
      });
    },
  };
}

export default defineConfig({
  root: '.',
  publicDir: 'public',
  plugins: [syncPlugin()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: 'index.html',
        mobile: 'mobile.html',
      },
    },
  },
});

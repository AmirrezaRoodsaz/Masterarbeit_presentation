import { defineConfig } from 'vite';

/**
 * Vite plugin: SSE sync middleware for iPad auto-follow mode.
 * GET  /api/sync → Server-Sent Events stream (receives slide position updates)
 * POST /api/sync → Broadcast current slide position to all connected clients
 */
/**
 * Generic SSE channel — clients subscribe to /api/<channel> via GET,
 * presenter posts state via POST. Each new GET client gets the last
 * known state replayed immediately. Used for /api/sync (slide
 * position) and /api/timer (presentation timer).
 */
function sseChannel(path, defaultState) {
  const clients = new Set();
  let lastState = { ...defaultState };
  return {
    path,
    middleware(req, res, next) {
      if (req.method === 'GET') {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
        });
        res.write(`data: ${JSON.stringify(lastState)}\n\n`);
        clients.add(res);
        req.on('close', () => clients.delete(res));
      } else if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            // Merge so partial updates are allowed
            lastState = { ...lastState, ...data };
            const msg = `data: ${JSON.stringify(lastState)}\n\n`;
            for (const client of clients) client.write(msg);
          } catch { /* ignore */ }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end('{"ok":true}');
        });
      } else {
        next();
      }
    },
  };
}

function sseSyncPlugin() {
  const clients = new Set();
  let lastState = { h: 0, v: 0, f: -1, id: '', title: '' };

  return {
    name: 'sse-sync',
    configureServer(server) {
      // /api/timer — presentation timer broadcast
      const timerCh = sseChannel('/api/timer', {
        seconds: 0, running: false, target: 900, warning: 810, overtime: false,
      });
      server.middlewares.use(timerCh.path, timerCh.middleware);

      server.middlewares.use('/api/sync', (req, res, next) => {
        if (req.method === 'GET') {
          // SSE stream
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
          });
          res.write(`data: ${JSON.stringify(lastState)}\n\n`);
          clients.add(res);
          req.on('close', () => clients.delete(res));
        } else if (req.method === 'POST') {
          // Receive slide + fragment position {h, v, f, id, title}
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              if (data.h !== undefined) {
                lastState = {
                  h: data.h,
                  v: data.v ?? 0,
                  f: data.f ?? -1,
                  id: data.id ?? '',
                  title: data.title ?? '',
                };
                const msg = `data: ${JSON.stringify(lastState)}\n\n`;
                for (const client of clients) {
                  client.write(msg);
                }
              }
            } catch { /* ignore parse errors */ }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end('{"ok":true}');
          });
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig({
  root: '.',
  publicDir: 'public',
  plugins: [sseSyncPlugin()],
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

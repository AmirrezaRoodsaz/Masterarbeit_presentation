import { defineConfig } from 'vite';

/**
 * Vite plugin: SSE sync middleware for iPad auto-follow mode.
 * GET  /api/sync → Server-Sent Events stream (receives slide position updates)
 * POST /api/sync → Broadcast current slide position to all connected clients
 */
function sseSyncPlugin() {
  const clients = new Set();
  let lastState = { h: 0, v: 0, f: -1 };

  return {
    name: 'sse-sync',
    configureServer(server) {
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
          // Receive slide + fragment position {h, v, f}
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              if (data.h !== undefined) {
                lastState = { h: data.h, v: data.v ?? 0, f: data.f ?? -1 };
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

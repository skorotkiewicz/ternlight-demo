import { buildCorpus } from './utils/corpus.js';
import { oddOneOut } from './utils/odd-one-out.js';
import { conceptCompass } from './utils/concept-compass.js';
import { buildJournal, closestLink, vibeLike } from './utils/fun-ideas.js';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';

// ponytail: zero-dep server. Each route just calls a function we already
// wrote — the UI is the only new thing. Swap to Vite + browser build for
// true on-device inference later.
const handlers = {
  '/api/corpus': ({ items, query, topK }) => buildCorpus(items).search(query, topK),
  '/api/odd': ({ items }) => oddOneOut(items),
  '/api/compass': ({ poleA, poleB, items }) => conceptCompass(poleA, poleB, items),
  '/api/journal': ({ entries, today }) => buildJournal(entries).mostLike(today),
  '/api/closest': ({ secret, guesses }) => closestLink(secret, guesses),
  '/api/vibe': ({ seed, catalog, topK }) => vibeLike(seed, catalog, topK),
};

const server = createServer(async (req, res) => {
  if (req.method === 'GET') {
    const rel = req.url === '/' ? './public/index.html' : `./public${req.url.split('?')[0]}`;
    try {
      const data = await readFile(new URL(rel, import.meta.url));
      const ext = rel.split('.').pop();
      const types = { html: 'text/html', js: 'text/javascript', css: 'text/css', svg: 'image/svg+xml', json: 'application/json', ico: 'image/x-icon' };
      res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
      return res.end(data);
    } catch {}
  }
  if (req.method === 'POST' && handlers[req.url]) {
    let body = '';
    for await (const c of req) body += c;
    try {
      const out = handlers[req.url](JSON.parse(body || '{}'));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(out));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: e.message }));
    }
  }
  res.writeHead(404).end('not found');
});

server.listen(3000, () => console.log('ternlight demo → http://localhost:3000'));

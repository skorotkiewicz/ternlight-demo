# ternlight

On-device semantic embeddings ([`@ternlight/base`](https://github.com/soycaporal/ternlight)) — 384-dim, WASM, no API calls. This repo is a small, playful toolkit built on top of it, plus a live web UI.

## Run

```bash
bun start        # serves the UI at http://localhost:3000
```

## What's inside

Six functions, each a thin wrapper over `embed` / `cosineSim`:

| Function | File | Does |
|---|---|---|
| `buildCorpus(items).search(q, k)` | `utils/corpus.js` | Embed a corpus once, query it repeatedly |
| `oddOneOut(items)` | `utils/odd-one-out.js` | Find the semantic outlier (game → anomaly detector) |
| `conceptCompass(poleA, poleB, items)` | `utils/concept-compass.js` | Project items onto an axis between two concepts |
| `buildJournal(entries).mostLike(today)` | `utils/fun-ideas.js` | "The day most like today" — zero-label reflection |
| `closestLink(secret, guesses)` | `utils/fun-ideas.js` | Party-game judge: who landed closest in meaning |
| `vibeLike(seed, catalog, k)` | `utils/fun-ideas.js` | "More like this," keeping your metadata |

`utils/demo.js` is a standalone script showing the primitives.

## Web UI

`server.js` exposes each function as a JSON endpoint and serves `public/index.html` — a tabbed UI with similarity bars, a compass track, and an odd-one-out badge. Inference runs server-side to avoid WASM-bundling; swap to the `@ternlight/base` browser build for fully client-side use.

## API

`POST` JSON to any route; all return JSON.

```
/api/corpus   { items[], query, topK }
/api/odd      { items[] }
/api/compass  { poleA, poleB, items[] }
/api/journal  { entries[{date,text}], today }
/api/closest  { secret, guesses[{player,guess}] }
/api/vibe     { seed, catalog[{title,...}], topK }
```

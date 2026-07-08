import { embed, cosineSim } from '@ternlight/base';

// ponytail: embed corpus once, reuse for many queries. Linear O(N*384) scan;
// fine to a few thousand docs. Swap for an ANN index if it grows past that.
export function buildCorpus(items, { topK = 5 } = {}) {
  const docs = items.map((it) =>
    typeof it === 'string'
      ? { text: it, meta: {}, v: embed(it) }
      : { text: it.text, meta: it.meta ?? {}, v: embed(it.text) }
  );
  return {
    get size() { return docs.length; },
    search(query, k = topK) {
      const q = embed(query);
      return docs
        .map((d) => ({ text: d.text, meta: d.meta, sim: cosineSim(q, d.v) }))
        .sort((a, b) => b.sim - a.sim)
        .slice(0, k);
    },
  };
}

if (import.meta.main) {
  const c = buildCorpus([
    'Reset your password',
    'Request a refund',
    'Track your delivery',
  ]);
  console.log('size', c.size);
  console.log(c.search('I forgot my password', 1));
}

import { embed, cosineSim } from '@ternlight/base';

// ponytail: outlier = item with the lowest average cosineSim to the rest.
// O(n^2*384); fine for short lists. Batch-embed once, not per pair.
export function oddOneOut(items) {
  if (items.length < 3) throw new Error('need at least 3 items');
  const docs = items.map((text) => ({ text, v: embed(text) }));
  const ranked = docs
    .map((d, i) => {
      let sum = 0, n = 0;
      for (let j = 0; j < docs.length; j++) {
        if (i === j) continue;
        sum += cosineSim(d.v, docs[j].v);
        n++;
      }
      return { text: d.text, score: sum / n };
    })
    .sort((a, b) => a.score - b.score);
  return { odd: ranked[0], ranked };
}

if (import.meta.main) {
  const r = oddOneOut(['pizza', 'burger', 'taco', 'python']);
  console.log('odd one out:', r.odd.text, '(avg sim', r.odd.score.toFixed(3) + ')');
  console.log(r.ranked.map((x) => `${x.text}:${x.score.toFixed(2)}`).join('  '));

  const xr = oddOneOut(['reset password', 'forgot login', 'refund', 'track order']); // → refund is the odd one out
  console.log(xr)
}

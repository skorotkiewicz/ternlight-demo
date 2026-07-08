import { embed, cosineSim } from '@ternlight/base';

// Project items onto an axis between two anchor concepts.
// pos in [-1, 1]: +1 = closest to poleA, -1 = closest to poleB.
// ponytail: embed the two poles + each item once; no per-pair re-embed.
export function conceptCompass(poleA, poleB, items) {
  const a = embed(poleA);
  const b = embed(poleB);
  return items
    .map((text) => {
      const v = embed(text);
      const sa = cosineSim(v, a);
      const sb = cosineSim(v, b);
      const pos = (sa - sb) / (sa + sb || 1); // +1 toward A, -1 toward B
      return { text, toward: pos >= 0 ? poleA : poleB, pos: +pos.toFixed(3) };
    })
    .sort((x, y) => y.pos - x.pos);
}

if (import.meta.main) {
  const items = [
    'a quiet cabin in the woods',
    'a rave in a warehouse',
    'a cozy bookshop',
    'a stadium concert',
  ];
  console.log(conceptCompass('calm solitude', 'loud chaos', items));
}

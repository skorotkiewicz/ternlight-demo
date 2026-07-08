import { embed, cosineSim, similar } from '@ternlight/base';
import { buildCorpus } from './corpus.js';

// One primitive: string → 384-dim L2-normalized Float32Array
const c = cosineSim(embed('reset my password'), embed('I forgot my password'));   // 0.88

// Nearest-neighbor search over a corpus
const s = similar('I want my money back', [
  'Refunds: how to get your money back',
  'Track the status of your delivery',
  'Update your billing address',
], { topK: 2 });
// → [{ text: 'Refunds: how to get your money back', sim: 0.70 },
//    { text: 'Update your billing address',         sim: 0.24 }]

// console.log(c)
// console.log(s)

const x = similar('I want my money back', [
  'Buy',
  'Fable',
  'Refund',
], { topK: 2 });
console.log(x)

const faq = buildCorpus([
  { text: 'Reset password', meta: { route: '/reset' } },
  { text: 'Request a refund', meta: { route: '/refund' } },
]);
const xs = faq.search('I forgot my password', 1); // → [{ text, meta:{route:'/reset'}, sim:0.88 }]
console.log(xs)

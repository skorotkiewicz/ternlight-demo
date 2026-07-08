import { embed, cosineSim } from '@ternlight/base';

// --- 3. "You from the past" journal -----------------------------------------
// Embed dated entries once, then find the day most like today.
export function buildJournal(entries) {
  const docs = entries.map((e) => ({ date: e.date ?? '', text: e.text, v: embed(e.text) }));
  return {
    mostLike(today, topK = 1) {
      const v = embed(today);
      return docs
        .map((d) => ({ date: d.date, text: d.text, sim: +cosineSim(v, d.v).toFixed(3) }))
        .sort((a, b) => b.sim - a.sim)
        .slice(0, topK);
    },
  };
}

// --- 4. Closest Link (live party game) --------------------------------------
// Secret word + player guesses; rank who landed closest in meaning.
export function closestLink(secret, guesses) {
  const s = embed(secret);
  return guesses
    .map((g) => ({ player: g.player, guess: g.guess, sim: +cosineSim(s, embed(g.guess)).toFixed(3) }))
    .sort((a, b) => b.sim - a.sim);
}

// --- 5. Vibe recommender ----------------------------------------------------
// "More like this" over a catalog of {title, ...meta}. Distinct from
// similar() because it keeps your metadata alongside the match.
export function vibeLike(seed, catalog, topK = 5) {
  const sv = embed(seed);
  return catalog
    .map((it) => ({ ...it, sim: +cosineSim(sv, embed(it.title)).toFixed(3) }))
    .sort((a, b) => b.sim - a.sim)
    .slice(0, topK);
}

if (import.meta.main) {
  console.log('--- journal ---');
  const j = buildJournal([
    { date: 'Mar 14', text: 'felt anxious about the demo, could not sleep' },
    { date: 'Apr 02', text: 'great day, shipped the feature, celebrated' },
  ]);
  console.log(j.mostLike('I am nervous about presenting tomorrow'));

  console.log('--- closest link ---');
  console.log(
    closestLink('ocean', [
      { player: 'A', guess: 'sea' },
      { player: 'B', guess: 'desk' },
      { player: 'C', guess: 'wave' },
    ])
  );

  console.log('--- vibe ---');
  console.log(
    vibeLike('cozy mystery novel', [
      { title: 'hard sci-fi epic', shelf: 'A1' },
      { title: 'a warm whodunit', shelf: 'B3' },
      { title: 'romantic comedy', shelf: 'C2' },
      { title: 'noir detective', shelf: 'B4' },
    ])
  );
}

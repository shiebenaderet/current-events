/* Duplicate ids, and why they were worse than invalid markup.
 *
 * spread_glosses.py allocates term-desc ids from a counter that runs across
 * pages. Re-running it restarted the counter, and inside gun-violence.html
 * and iran.html two different terms ended up sharing one id:
 *
 *   <span class="term" aria-describedby="term-desc-9003">background check</span>
 *   <span class="term" aria-describedby="term-desc-9003">silencers</span>
 *
 * An idref resolves to the FIRST matching element, so a screen reader
 * announced "silencers" with the definition of "background check". A
 * confidently wrong definition is worse than no definition, and it lands on
 * exactly the students the glosses exist for.
 *
 * Nothing caught it: 136 tests passed, every content gate was clean.
 * verify_invariants.py found it only because someone ran it by hand. These
 * two tests make it a standing gate instead.
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const PAGES = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'));

/** Every id on a page, in document order. */
function idsOf(html) {
  return [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
}

test('no page declares the same id twice', () => {
  for (const page of PAGES) {
    const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
    const seen = new Set();
    const dupes = new Set();
    for (const id of idsOf(html)) {
      if (seen.has(id)) dupes.add(id);
      seen.add(id);
    }
    assert.deepEqual([...dupes], [],
      `${page} declares duplicate id(s); an idref resolves to the first match`);
  }
});

test('every aria-describedby points at exactly one element that exists', () => {
  for (const page of PAGES) {
    const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
    const ids = idsOf(html);
    const counts = new Map();
    for (const id of ids) counts.set(id, (counts.get(id) || 0) + 1);

    for (const m of html.matchAll(/aria-describedby="([^"]+)"/g)) {
      // The attribute takes a space-separated list of idrefs.
      for (const ref of m[1].trim().split(/\s+/)) {
        const n = counts.get(ref) || 0;
        assert.notEqual(n, 0,
          `${page}: aria-describedby="${ref}" points at nothing`);
        assert.equal(n, 1,
          `${page}: aria-describedby="${ref}" is ambiguous — ${n} elements ` +
          `claim that id, so a screen reader reads the first one`);
      }
    }
  }
});

test('a gloss term and its definition agree on the id', () => {
  // The markup is a fixed pair, and the whole scheme depends on the two
  // halves matching. If they ever drift, the term describes someone else's
  // definition even without a duplicate id in sight.
  const PAIR = /<span class="term"[^>]*aria-describedby="(term-desc-\d+)"[^>]*>[\s\S]*?<\/span><span id="(term-desc-\d+)"\s+class="term-desc">/g;
  let pairs = 0;
  for (const page of PAGES) {
    const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
    for (const m of html.matchAll(PAIR)) {
      pairs++;
      assert.equal(m[1], m[2],
        `${page}: term points at ${m[1]} but its definition is ${m[2]}`);
    }
  }
  assert.ok(pairs > 20, `expected the glossed pairs to be found, saw ${pairs}`);
});

# Study Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a site-wide "Study Mode" toggle that adds reading support around the existing text — inline glosses and a persistent section frame — without changing a word of the prose.

**Architecture:** A `body.study-mode` class drives a pure-CSS gloss reveal (the definitions are already inline in the DOM, only `sr-only`-hidden). A small vanilla-JS module handles the two things CSS cannot: promoting "Key Word" boxes to inline glosses, and a fixed section bar fed by `IntersectionObserver`. All DOM changes are *injected* and marked `data-sm-injected`, never moved or rewritten, so toggle-off restores the original DOM exactly.

**Tech Stack:** Vanilla ES5-compatible JS, plain CSS, `node --test` (built-in, zero dependencies), Python 3 stdlib for structural checks. **No new runtime or build dependencies** — this repo has no `package.json` and that is deliberate.

**Spec:** `docs/plans/2026-08-28-study-mode-design.md`

## Global Constraints

- **Additive only.** No task may shorten, simplify, or reword existing prose. `G6` (`locate.py --diff`) must return `pattern: elaboration` with `terms_lost: []` on any page whose content changes.
- **Never inject inside a primary source.** The injector must not descend into `blockquote`, `q`, or `cite`. `S2` makes an in-quote insertion BLOCKING.
- **Button label is exactly `Study Mode`.** Not "Simplified", "Easier", or "Reading Support". This is a design requirement (stigma), not copy preference.
- **No new dependencies.** No `package.json`, no npm installs, no CDN scripts. Node's built-in `node:test` and Python 3 stdlib only.
- **ES5-compatible browser JS.** Match the existing `site.js` style: `var`, function declarations, no arrow functions or template literals in shipped browser code.
- **Progressive enhancement.** Every failure degrades to "less support", never to a broken or modified page.
- **`localStorage` key is `studyMode`**, values `'on'` / `'off'`, mirroring the existing `dyslexicFont` pattern.
- **Do not modify the dyslexia-font toggle.** Owner decision: leave as is.
- Commit after every task. Conventional-commit prefixes (`feat:`, `test:`, `docs:`), matching repo history.

---

### Task 1: Pure helpers for Study Mode

The three genuinely error-prone pieces of logic, isolated from the DOM so they can be unit-tested with no browser and no dependencies.

**Files:**
- Create: `study-mode.js`
- Create: `tools/study-mode.test.js`

**Interfaces:**
- Consumes: nothing (first task)
- Produces, exported via `module.exports` when required from node:
  - `firstSentence(text: string) -> string`
  - `termPattern(term: string) -> RegExp | null`
  - `hasProtectedAncestor(tagNames: string[]) -> boolean`
  - `resolveInitialState(urlValue: string|null, storedValue: string|null) -> 'on'|'off'`

- [ ] **Step 1: Write the failing test**

Create `tools/study-mode.test.js`:

```js
const { test } = require('node:test');
const assert = require('node:assert');
const SM = require('../study-mode.js');

test('firstSentence takes the first sentence', () => {
  assert.equal(
    SM.firstSentence('Congress writes the laws. The president carries them out.'),
    'Congress writes the laws.'
  );
});

test('firstSentence is not fooled by U.S.', () => {
  assert.equal(
    SM.firstSentence('The U.S. government has three parts, called branches. Each branch has a job.'),
    'The U.S. government has three parts, called branches.'
  );
});

test('firstSentence returns whole string when there is no terminal punctuation', () => {
  assert.equal(SM.firstSentence('No terminal punctuation here'), 'No terminal punctuation here');
});

test('firstSentence handles empty and null input', () => {
  assert.equal(SM.firstSentence(''), '');
  assert.equal(SM.firstSentence(null), '');
});

test('firstSentence collapses whitespace', () => {
  assert.equal(SM.firstSentence('  Two   spaces.  Next.  '), 'Two spaces.');
});

test('termPattern matches case-insensitively on a word boundary', () => {
  const re = SM.termPattern('poll tax');
  assert.ok(re.test('Poll tax was a fee some states charged'));
  assert.ok(re.test('Poll taxes in federal elections were banned'));
});

test('termPattern does not match inside a longer word', () => {
  const re = SM.termPattern('act');
  assert.equal(re.test('The factory closed'), false);
});

test('termPattern escapes regex metacharacters', () => {
  const re = SM.termPattern('U.S. (federal)');
  assert.ok(re.test('the U.S. (federal) courts'));
  assert.equal(re.test('the UXSX federal courts'), false);
});

test('termPattern returns null for empty input', () => {
  assert.equal(SM.termPattern(''), null);
  assert.equal(SM.termPattern('   '), null);
});

test('hasProtectedAncestor guards quoted spans', () => {
  assert.equal(SM.hasProtectedAncestor(['P', 'BLOCKQUOTE', 'DIV']), true);
  assert.equal(SM.hasProtectedAncestor(['SPAN', 'Q']), true);
  assert.equal(SM.hasProtectedAncestor(['CITE']), true);
  assert.equal(SM.hasProtectedAncestor(['blockquote']), true, 'case-insensitive');
});

test('hasProtectedAncestor allows ordinary prose', () => {
  assert.equal(SM.hasProtectedAncestor(['P', 'DIV', 'BODY']), false);
  assert.equal(SM.hasProtectedAncestor([]), false);
});

test('resolveInitialState prefers an explicit URL value', () => {
  assert.equal(SM.resolveInitialState('on', 'off'), 'on');
  assert.equal(SM.resolveInitialState('off', 'on'), 'off');
});

test('resolveInitialState falls back to the stored value', () => {
  assert.equal(SM.resolveInitialState(null, 'on'), 'on');
  assert.equal(SM.resolveInitialState('garbage', 'on'), 'on');
});

test('resolveInitialState defaults to off', () => {
  assert.equal(SM.resolveInitialState(null, null), 'off');
  assert.equal(SM.resolveInitialState('garbage', 'garbage'), 'off');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tools/study-mode.test.js`
Expected: FAIL — `Cannot find module '../study-mode.js'`

- [ ] **Step 3: Write the minimal implementation**

Create `study-mode.js`:

```js
/* Study Mode — additive reading support.
   Spec: docs/plans/2026-08-28-study-mode-design.md
   Adds glosses and a section frame around the text. Never rewrites prose. */
(function () {
  'use strict';

  /* ---- pure helpers (no DOM; unit-tested in tools/study-mode.test.js) ---- */

  // Abbreviations whose trailing period must not end a sentence. "U.S." is the
  // one that actually occurs in this corpus; the rest are cheap insurance.
  var ABBR = /(?:^|[\s(])(?:U\.S|Mr|Mrs|Ms|Dr|St|Jr|Sr|vs|etc|e\.g|i\.e|No|Inc|Gov|Sen|Rep|Prof)\.$/i;

  function firstSentence(text) {
    var t = String(text == null ? '' : text).trim().replace(/\s+/g, ' ');
    if (!t) return '';
    var re = /[.!?](?=\s|$)/g;
    var m;
    while ((m = re.exec(t)) !== null) {
      var cand = t.slice(0, m.index + 1);
      if (ABBR.test(cand)) continue;
      // A real sentence break is followed by end-of-text or a capitalised word.
      // (A length heuristic here cannot tell a short sentence from an abbreviation.)
      var rest = t.slice(m.index + 1).replace(/^\s+/, '');
      if (rest && !/^["'\u201c\u2018(]?[A-Z0-9]/.test(rest)) continue;
      return cand;
    }
    return t;
  }

  function termPattern(term) {
    var raw = String(term == null ? '' : term).trim();
    if (!raw) return null;
    var esc = raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // \b only means anything beside a word character. A term ending in ")" can
    // never satisfy a trailing \b before a space, so the boundaries are conditional.
    var lead = /^\w/.test(raw) ? '\\b' : '';
    var tail = /\w$/.test(raw) ? '(?:e?s)?\\b' : '';
    return new RegExp(lead + esc + tail, 'i');
  }

  var PROTECTED_TAGS = ['BLOCKQUOTE', 'Q', 'CITE'];

  function hasProtectedAncestor(tagNames) {
    if (!tagNames || !tagNames.length) return false;
    for (var i = 0; i < tagNames.length; i++) {
      if (PROTECTED_TAGS.indexOf(String(tagNames[i]).toUpperCase()) !== -1) return true;
    }
    return false;
  }

  function resolveInitialState(urlValue, storedValue) {
    if (urlValue === 'on' || urlValue === 'off') return urlValue;
    if (storedValue === 'on' || storedValue === 'off') return storedValue;
    return 'off';
  }

  var api = {
    firstSentence: firstSentence,
    termPattern: termPattern,
    hasProtectedAncestor: hasProtectedAncestor,
    resolveInitialState: resolveInitialState
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    window.StudyMode = api;
  }
})();
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test tools/study-mode.test.js`
Expected: PASS, 14 tests

- [ ] **Step 5: Commit**

```bash
git add study-mode.js tools/study-mode.test.js
git commit -m "feat: pure helpers for Study Mode, with unit tests"
```

---

### Task 2: State, toggle, and the `?study=` URL parameter

**Files:**
- Modify: `study-mode.js` (add the state layer to the existing IIFE)
- Modify: `site.js:17-27` (`initA11y`)
- Modify: `tools/study-mode.test.js` (add cases)

**Interfaces:**
- Consumes: `resolveInitialState` from Task 1
- Produces:
  - `window.StudyMode.apply(state: 'on'|'off') -> void` — sets/removes `body.study-mode`, updates the button's `.active` and `aria-pressed`
  - `window.StudyMode.toggle() -> void` — flips state, persists, re-runs the DOM layer
  - `window.StudyMode.init() -> void` — resolves initial state from URL then storage, then applies
  - `window.toggleStudyMode` — global alias for the inline `onclick`, matching `toggleDyslexic`

- [ ] **Step 1: Write the failing test**

Append to `tools/study-mode.test.js`:

```js
test('readStudyParam extracts on/off from a query string', () => {
  assert.equal(SM.readStudyParam('?study=on'), 'on');
  assert.equal(SM.readStudyParam('?a=1&study=off&b=2'), 'off');
  assert.equal(SM.readStudyParam('?study=ON'), 'on', 'case-insensitive');
});

test('readStudyParam returns null when absent or junk', () => {
  assert.equal(SM.readStudyParam(''), null);
  assert.equal(SM.readStudyParam('?other=1'), null);
  assert.equal(SM.readStudyParam('?study=banana'), null);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tools/study-mode.test.js`
Expected: FAIL — `SM.readStudyParam is not a function`

- [ ] **Step 3: Write the minimal implementation**

In `study-mode.js`, add before the `api` object:

```js
  // Parsed by hand rather than URLSearchParams so the helper is testable in
  // node without a DOM and works in the same browsers the rest of site.js targets.
  function readStudyParam(search) {
    var s = String(search == null ? '' : search);
    var m = s.match(/[?&]study=([^&#]*)/i);
    if (!m) return null;
    var v = decodeURIComponent(m[1]).toLowerCase();
    return (v === 'on' || v === 'off') ? v : null;
  }
```

Add `readStudyParam: readStudyParam` to the `api` object.

Then add the DOM state layer, guarded so requiring the file in node stays safe:

```js
  function applyState(state) {
    if (typeof document === 'undefined') return;
    var on = state === 'on';
    document.body.classList.toggle('study-mode', on);
    var btn = document.getElementById('studyModeToggle');
    if (btn) {
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    if (on) { buildLayer(); } else { teardownLayer(); }
  }

  function store(state) {
    try { localStorage.setItem('studyMode', state); } catch (e) { /* private mode: session-only */ }
  }

  function read() {
    try { return localStorage.getItem('studyMode'); } catch (e) { return null; }
  }

  function toggle() {
    var next = document.body.classList.contains('study-mode') ? 'off' : 'on';
    store(next);
    applyState(next);
  }

  function init() {
    if (typeof document === 'undefined') return;
    var state = resolveInitialState(readStudyParam(window.location.search), read());
    if (state === 'on') store(state);   // an explicit ?study=on persists onward
    applyState(state);
  }
```

`buildLayer` and `teardownLayer` arrive in Tasks 4 and 5. For this task only, add temporary no-op stubs so the file runs:

```js
  function buildLayer() { /* Tasks 4 and 5 */ }
  function teardownLayer() { /* Tasks 4 and 5 */ }
```

Add to the browser branch of the export:

```js
    window.StudyMode = api;
    api.apply = applyState;
    api.toggle = toggle;
    api.init = init;
    window.toggleStudyMode = toggle;
```

In `site.js`, at the end of `initA11y()` (after the `textSize` restore, currently line 27):

```js
    if (window.StudyMode && window.StudyMode.init) window.StudyMode.init();
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test tools/study-mode.test.js`
Expected: PASS, 16 tests

Run: `node --check study-mode.js && node --check site.js`
Expected: no output (both parse)

- [ ] **Step 5: Commit**

```bash
git add study-mode.js site.js tools/study-mode.test.js
git commit -m "feat: Study Mode state, toggle, and ?study= URL parameter"
```

---

### Task 3: The CSS gloss reveal

The highest-value change in the whole plan, and it is pure CSS. Every `.term` is already followed, inline and in the same sentence, by a `<span class="term-desc">` holding the same text — `sr-only`-hidden and wired to the term's `aria-describedby`. Study Mode un-hides an element that is already in the right place.

**Files:**
- Modify: `site.css` (append a new section at the end)

**Interfaces:**
- Consumes: `body.study-mode` from Task 2
- Produces: the `.sm-*` class vocabulary later tasks style against

- [ ] **Step 1: Add the CSS**

Append to `site.css`:

```css
/* ══ STUDY MODE ══════════════════════════════════════════════════════════
   Additive reading support. Reveals glosses that are already in the DOM and
   already read by screen readers; adds nothing to the prose itself.
   Spec: docs/plans/2026-08-28-study-mode-design.md */

.study-mode-toggle{
  display:inline-flex;align-items:center;gap:6px;
  padding:8px 14px;border:0;border-radius:4px;cursor:pointer;
  background:#333;color:#fff;
  font-family:-apple-system,sans-serif;font-size:.72rem;font-weight:700;
  letter-spacing:.03em;min-height:var(--ce-tap,44px);
}
.study-mode-toggle:hover{background:#222}
.study-mode-toggle.active{background:var(--accent,#a02c2c)}
.study-mode-toggle:focus-visible{outline:2px solid var(--accent,#a02c2c);outline-offset:2px}

/* Undo the sr-only clip so the definition renders inline, beside its term. */
body.study-mode .term-desc{
  position:static;width:auto;height:auto;
  padding:0;margin:0;overflow:visible;
  clip:auto;clip-path:none;white-space:normal;
  font-family:-apple-system,sans-serif;
  font-size:.84em;font-weight:400;line-height:1.5;
  color:var(--ink-light,#4a4a4a);
}
body.study-mode .term-desc::before{content:" — "}

/* The floating tooltip is redundant once the text is inline, and would
   otherwise cover the paragraph the reader is in. */
body.study-mode .term::after,
body.study-mode .term::before{display:none !important}
body.study-mode .term{border-bottom-style:solid;cursor:default}

/* Glosses promoted from a "Key Word" box (Task 4). */
body.study-mode .sm-gloss{
  font-family:-apple-system,sans-serif;
  font-size:.84em;color:var(--ink-light,#4a4a4a);
}
body.study-mode .sm-gloss::before{content:" — "}

/* Where a term occurs only inside a quotation, the gloss goes BESIDE the
   source, never inside it (S2). */
body.study-mode .sm-gloss-aside{
  margin:8px 0 0;padding:8px 12px;
  border-left:3px solid var(--accent,#a02c2c);
  font-family:-apple-system,sans-serif;
  font-size:.84rem;line-height:1.5;color:var(--ink-light,#4a4a4a);
}
```

- [ ] **Step 2: Verify by hand in a browser**

```bash
python3 -m http.server 8765
```

Open `http://localhost:8765/gun-violence.html` (18 `.term` glosses, the densest page).
In the console: `document.body.classList.add('study-mode')`

Expected: every dotted-underline term is now followed inline by " — definition"; no floating tooltips appear on hover; paragraphs reflow but nothing overlaps.
Then: `document.body.classList.remove('study-mode')` — the page returns to exactly its previous appearance.

- [ ] **Step 3: Commit**

```bash
git add site.css
git commit -m "feat: Study Mode CSS -- reveal inline glosses, style injected nodes"
```

---

### Task 4: The Key Word injector

The only DOM-manipulating code in the feature, and the only place an `S2` violation could originate.

**Files:**
- Modify: `study-mode.js` (replace the `buildLayer`/`teardownLayer` stubs)
- Modify: `tools/study-mode.test.js`

**Interfaces:**
- Consumes: `termPattern`, `hasProtectedAncestor` (Task 1); `body.study-mode` (Task 2)
- Produces:
  - `injectKeyWordGlosses() -> {injected: number, orphans: string[]}` — orphans are Key Word terms found nowhere in their section's prose (a free `V5` audit)
  - Every created node carries `data-sm-injected="1"`

- [ ] **Step 1: Write the failing test**

Append to `tools/study-mode.test.js`:

```js
test('keyWordFromBox parses the Key Word label', () => {
  assert.equal(SM.keyWordFromBox('Key Word: Poll tax'), 'Poll tax');
  assert.equal(SM.keyWordFromBox('Key Word:Midterm Penalty'), 'Midterm Penalty');
  assert.equal(SM.keyWordFromBox('  Key Word:  Judicial review  '), 'Judicial review');
});

test('keyWordFromBox returns null when the label is not a Key Word', () => {
  assert.equal(SM.keyWordFromBox('Did you know?'), null);
  assert.equal(SM.keyWordFromBox(''), null);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tools/study-mode.test.js`
Expected: FAIL — `SM.keyWordFromBox is not a function`

- [ ] **Step 3: Write the implementation**

Add the pure parser to `study-mode.js` and export it:

```js
  function keyWordFromBox(labelText) {
    var t = String(labelText == null ? '' : labelText).trim().replace(/\s+/g, ' ');
    var m = t.match(/^Key\s*Word\s*:\s*(.+)$/i);
    return m ? m[1].trim() : null;
  }
```

Then replace the `buildLayer` / `teardownLayer` stubs:

```js
  function ancestorTags(node, stopAt) {
    var tags = [], n = node;
    while (n && n !== stopAt) {
      if (n.tagName) tags.push(n.tagName);
      n = n.parentNode;
    }
    return tags;
  }

  // The first text node inside `root` that matches `re` and is not inside a
  // quotation, heading, citation, or the Key Word box itself.
  function findTarget(root, re, excludeBox) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var node, protectedHit = null;
    while ((node = walker.nextNode())) {
      if (!re.test(node.nodeValue)) continue;
      var tags = ancestorTags(node, root);
      if (excludeBox && excludeBox.contains(node)) continue;
      if (tags.indexOf('H1') !== -1 || tags.indexOf('H2') !== -1 ||
          tags.indexOf('H3') !== -1 || tags.indexOf('H4') !== -1) continue;
      if (node.parentNode && node.parentNode.classList &&
          node.parentNode.classList.contains('cite-inline')) continue;
      if (hasProtectedAncestor(tags)) {
        // Remember it, but keep looking for an unquoted occurrence first.
        if (!protectedHit) protectedHit = node;
        continue;
      }
      return { node: node, quoted: false };
    }
    return protectedHit ? { node: protectedHit, quoted: true } : null;
  }

  function quotedAncestor(node) {
    var n = node;
    while (n) {
      if (n.tagName && PROTECTED_TAGS.indexOf(n.tagName.toUpperCase()) !== -1) return n;
      n = n.parentNode;
    }
    return null;
  }

  function injectKeyWordGlosses() {
    var boxes = document.querySelectorAll('.vocab');
    var injected = 0, orphans = [];
    for (var i = 0; i < boxes.length; i++) {
      var box = boxes[i];
      if (box.getAttribute('data-sm-done')) continue;
      var label = box.querySelector('b');
      var defEl = box.querySelector('p');
      if (!label || !defEl) continue;
      var term = keyWordFromBox(label.textContent);
      if (!term) continue;
      var re = termPattern(term);
      if (!re) continue;

      var section = box.closest ? box.closest('.article, .sec-body, section, body') : null;
      if (!section) section = document.body;

      var hit = findTarget(section, re, box);
      if (!hit) { orphans.push(term); continue; }

      var text = defEl.textContent.trim();

      if (hit.quoted) {
        // S2: scaffolding goes AROUND a source, never inside it.
        var bq = quotedAncestor(hit.node);
        if (!bq || !bq.parentNode) { orphans.push(term); continue; }
        var aside = document.createElement('p');
        aside.className = 'sm-gloss-aside';
        aside.setAttribute('data-sm-injected', '1');
        aside.textContent = term + ' — ' + text;
        bq.parentNode.insertBefore(aside, bq.nextSibling);
      } else {
        var m = hit.node.nodeValue.match(re);
        var idx = hit.node.nodeValue.indexOf(m[0]);
        var after = hit.node.splitText(idx + m[0].length);
        var span = document.createElement('span');
        span.className = 'sm-gloss';
        span.setAttribute('data-sm-injected', '1');
        span.textContent = text;
        after.parentNode.insertBefore(span, after);
      }
      box.setAttribute('data-sm-done', '1');
      injected++;
    }
    return { injected: injected, orphans: orphans };
  }

  function teardownLayer() {
    if (typeof document === 'undefined') return;
    var nodes = document.querySelectorAll('[data-sm-injected]');
    for (var i = 0; i < nodes.length; i++) {
      var p = nodes[i].parentNode;
      if (p) { p.removeChild(nodes[i]); p.normalize(); }
    }
    var done = document.querySelectorAll('[data-sm-done]');
    for (var j = 0; j < done.length; j++) done[j].removeAttribute('data-sm-done');
  }

  function buildLayer() {
    if (typeof document === 'undefined') return;
    var r = injectKeyWordGlosses();
    if (window.location.search.indexOf('smdebug') !== -1 && r.orphans.length) {
      console.log('[study-mode] Key Word boxes with no match in prose (V5 orphans):', r.orphans);
    }
  }
```

Note `p.normalize()` in teardown: `splitText` leaves the paragraph's text in two nodes, and normalize re-joins them so toggle-off restores the original DOM exactly.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test tools/study-mode.test.js`
Expected: PASS, 18 tests

Run: `node --check study-mode.js`
Expected: no output

- [ ] **Step 5: Verify the S2 guard against real quoted content**

`immigration.html` carries the most quoted material on the site, including the attributed DHS statement.

```bash
python3 -m http.server 8765
```

Open `http://localhost:8765/immigration.html`, then in the console:

```js
document.body.classList.add('study-mode'); window.StudyMode.apply('on');
document.querySelectorAll('[data-sm-injected]').length;
// Assert ZERO injected nodes sit inside a quotation:
[...document.querySelectorAll('[data-sm-injected]')]
  .filter(n => n.closest('blockquote,q,cite')).length;   // MUST be 0
```

Expected: the last expression returns `0`. If it returns anything else, stop — that is an `S2` BLOCKING violation and the guard is wrong.

Then verify the round trip:

```js
const before = document.querySelector('.article').innerHTML;
window.StudyMode.apply('off'); window.StudyMode.apply('on'); window.StudyMode.apply('off');
document.querySelector('.article').innerHTML === before;   // MUST be true
```

- [ ] **Step 6: Commit**

```bash
git add study-mode.js tools/study-mode.test.js
git commit -m "feat: promote Key Word boxes to inline glosses; never inject inside a source"
```

---

### Task 5: The section bar

**Files:**
- Modify: `study-mode.js` (extend `buildLayer` / `teardownLayer`)
- Modify: `site.css` (append bar styles)

**Interfaces:**
- Consumes: `firstSentence` (Task 1); `buildLayer`/`teardownLayer` (Task 4)
- Produces: `#sm-bar`, a single fixed element carrying `data-sm-injected="1"`

- [ ] **Step 1: Add the CSS**

Append to `site.css`:

```css
#sm-bar{
  position:fixed;left:0;right:0;bottom:0;z-index:60;
  background:var(--ink,#1a1a1a);color:#f0ece4;
  font-family:-apple-system,sans-serif;font-size:.8rem;line-height:1.45;
  padding:10px 6vw;cursor:pointer;
  box-shadow:0 -4px 16px rgba(0,0,0,.18);
  display:flex;gap:10px;align-items:baseline;
}
#sm-bar .sm-bar-sec{font-weight:700;letter-spacing:.03em;opacity:.75;flex:0 0 auto}
#sm-bar .sm-bar-txt{flex:1 1 auto}
#sm-bar.is-open .sm-bar-txt{white-space:normal}
@media (max-width:640px){ #sm-bar{font-size:.76rem;padding:9px 5vw} }
```

The bar sits at the **bottom**, not the top: the site already has a sticky masthead and section-nav at the top, and a second fixed bar there would stack against them.

- [ ] **Step 2: Add the JS**

In `study-mode.js`:

```js
  var barObserver = null;

  function primerTextFor(secHead) {
    // The .before-read aside is the next sibling after its .sec-head.
    var n = secHead.nextElementSibling;
    while (n && !n.classList.contains('before-read')) {
      if (n.classList.contains('sec-head')) return null;
      n = n.nextElementSibling;
    }
    if (!n) return null;
    var ps = n.querySelectorAll('p');
    for (var i = 0; i < ps.length; i++) {
      if (ps[i].classList.contains('br-head')) continue;
      var clone = ps[i].cloneNode(true);
      var links = clone.querySelectorAll('a');          // strip "First: <link>" pointers
      for (var j = 0; j < links.length; j++) links[j].parentNode.removeChild(links[j]);
      var t = clone.textContent.replace(/\bFirst:\s*$/i, '').trim();
      if (t) return t;
    }
    return null;
  }

  function buildBar() {
    var heads = document.querySelectorAll('.sec-head');
    if (!heads.length || typeof IntersectionObserver === 'undefined') return;

    var bar = document.createElement('div');
    bar.id = 'sm-bar';
    bar.setAttribute('data-sm-injected', '1');
    bar.innerHTML = '<span class="sm-bar-sec"></span><span class="sm-bar-txt"></span>';
    bar.addEventListener('click', function () { bar.classList.toggle('is-open'); render(bar._full, bar._label); });
    document.body.appendChild(bar);

    function render(full, label) {
      if (!full) { bar.style.display = 'none'; return; }
      bar.style.display = 'flex';
      bar.querySelector('.sm-bar-sec').textContent = label || '';
      bar.querySelector('.sm-bar-txt').textContent =
        bar.classList.contains('is-open') ? full : firstSentence(full);
    }

    barObserver = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (!entries[i].isIntersecting) continue;
        var head = entries[i].target;
        var h = head.querySelector('h2, h3');
        bar._label = h ? h.textContent.trim().slice(0, 28) : '';
        bar._full = primerTextFor(head);
        render(bar._full, bar._label);
      }
    }, { rootMargin: '-10% 0px -70% 0px' });

    for (var k = 0; k < heads.length; k++) barObserver.observe(heads[k]);
  }
```

Extend `buildLayer` with `buildBar();` and `teardownLayer` with, before the node removal:

```js
    if (barObserver) { barObserver.disconnect(); barObserver = null; }
```

- [ ] **Step 3: Verify in a browser**

Open `http://localhost:8765/us-elections.html`, toggle Study Mode on, scroll.

Expected: a slim dark bar at the bottom showing the current section's name and the first sentence of its primer; the text changes as you scroll into a new section; tapping expands to the full primer and tapping again collapses it; sections without a primer hide the bar. Toggling off removes the bar entirely.

- [ ] **Step 4: Commit**

```bash
git add study-mode.js site.css
git commit -m "feat: Study Mode section bar driven by IntersectionObserver"
```

---

### Task 6: Add the button to all 8 pages

**Files:**
- Modify: `ai.html`, `climate-change.html`, `gun-violence.html`, `immigration.html`, `iran.html`, `space-race.html`, `ukraine.html`, `us-elections.html`

**Interfaces:**
- Consumes: `window.toggleStudyMode` (Task 2), `.study-mode-toggle` (Task 3)
- Produces: `#studyModeToggle` on every page

- [ ] **Step 1: Confirm the insertion point is uniform**

```bash
grep -n 'id="dyslexicToggle"' *.html | wc -l     # expect 8
grep -c 'src="site.js"' *.html                    # expect 1 each
```

- [ ] **Step 2: Insert the button and the script tag**

```bash
python3 - <<'PY'
import glob, re
PAGES = ['ai','climate-change','gun-violence','immigration',
         'iran','space-race','ukraine','us-elections']
BTN = ('  <button class="study-mode-toggle" id="studyModeToggle" '
       'onclick="toggleStudyMode()" aria-pressed="false" '
       'title="Show definitions and a section guide">💡 Study Mode</button>\n')
for p in PAGES:
    f = p + '.html'
    s = open(f, encoding='utf-8').read()
    if 'studyModeToggle' in s:
        print('  = %-20s already present' % f); continue
    m = re.search(r'[ \t]*<button class="dyslexic-toggle".*?</button>\n', s, re.S)
    assert m, f
    s = s[:m.end()] + BTN + s[m.end():]
    s = s.replace('<script src="site.js"></script>',
                  '<script src="study-mode.js"></script>\n<script src="site.js"></script>', 1)
    open(f, 'w', encoding='utf-8').write(s)
    print('  + %-20s button + script added' % f)
PY
```

`study-mode.js` must load **before** `site.js`, because `initA11y()` calls `window.StudyMode.init()`.

- [ ] **Step 3: Verify**

```bash
grep -c 'id="studyModeToggle"' *.html            # expect 1 on each of the 8
grep -c 'study-mode.js' *.html                    # expect 1 on each of the 8
python3 tools/verify_invariants.py HEAD           # div balance, ids, term counts unchanged
```

Expected: `verify_invariants` reports no change to `div-open`/`div-close` balance and no duplicate ids.

- [ ] **Step 4: Commit**

```bash
git add *.html
git commit -m "feat: add Study Mode button to all 8 topic pages"
```

---

### Task 7: Gloss backfill for `iran` and `space-race`

Both pages carry 5 glosses across 9 and 8 sections. Without this, Study Mode visibly does almost nothing there, which teaches students the button is not worth pressing.

**Files:**
- Modify: `iran.html`, `space-race.html`

**Interfaces:**
- Consumes: the existing `.term` / `.term-desc` markup contract
- Produces: ~6 new glossed terms per page

- [ ] **Step 1: Choose the terms**

Read each page's prose and pick load-bearing terms per `V1` — words the main claim depends on, or that recur. Candidates to confirm against the actual text, not assume:

- `iran`: *theocracy, supreme leader, sanctions, enrichment, morality police, conscription*
- `space-race`: *orbit, satellite, cosmonaut, lunar module, payload, contractor*

Skip any term already glossed. Verify each appears in the prose before writing a gloss for it — a gloss for an absent term is the `V5` orphan defect this feature exposes.

- [ ] **Step 2: Write each gloss to the existing markup contract**

Every gloss is exactly this shape, with `N` continuing that page's existing numbering:

```html
<span class="term" tabindex="0" data-def="DEFINITION" aria-describedby="term-desc-N">TERM</span><span id="term-desc-N" class="term-desc">DEFINITION</span>
```

`data-def` and the `.term-desc` text must be **identical strings** — the tooltip and the Study Mode inline gloss read from different places and must not diverge.

Gloss style follows `V3`: no dictionary syntax ("the act or process of…"), no circularity (the gloss must not contain the target's own stem), and an anchor to how the word is used in this passage. Per Rule E there is **no length or word-rarity limit** — glossing *ratify* using *treaty* is correct. Do not write toward baby language.

- [ ] **Step 3: Verify the additions are additive**

```bash
git stash
python3 -c "
import sys; sys.path.insert(0,'$HOME/.claude/skills/reading-intervention/scripts')
import locate
open('/tmp/iran_before.txt','w').write(locate.extract_html(open('iran.html').read())['prose'])
open('/tmp/sr_before.txt','w').write(locate.extract_html(open('space-race.html').read())['prose'])
"
git stash pop
python3 -c "
import sys, json; sys.path.insert(0,'$HOME/.claude/skills/reading-intervention/scripts')
import locate
for p,b in [('iran','/tmp/iran_before.txt'),('space-race','/tmp/sr_before.txt')]:
    n = locate.extract_html(open(p+'.html').read())['prose']
    d = locate.ceiling_diff(open(b).read(), n)
    print(p, d['pattern'], 'terms_lost=', d['terms_lost'])
"
```

Expected: `elaboration` and `terms_lost= []` for both. Anything else means content was lost — stop and fix.

- [ ] **Step 4: Verify counts and structure**

```bash
python3 tools/verify_invariants.py HEAD iran.html
python3 tools/verify_invariants.py HEAD space-race.html
```

Expected: `term` and `term-desc` counts both rise by the same amount; no duplicate ids; div balance unchanged.

- [ ] **Step 5: Commit**

```bash
git add iran.html space-race.html
git commit -m "feat: backfill inline glosses on iran and space-race"
```

---

### Task 8: Full regression and release

**Files:**
- Modify: `VERSION`, `CHANGELOG.md`, `README.md`

- [ ] **Step 1: Run every check**

```bash
node --test tools/study-mode.test.js
node --check study-mode.js && node --check site.js
python3 tools/verify_invariants.py HEAD
python3 tools/reading_time.py
for f in *.html; do node -e "
  const s=require('fs').readFileSync('$f','utf8');
  const o=(s.match(/<div/g)||[]).length, c=(s.match(/<\/div>/g)||[]).length;
  if(o!==c) { console.log('$f DIV IMBALANCE', o, c); process.exit(1); }
"; done; echo "div balance OK"
```

- [ ] **Step 2: Manual round-trip on all 8 pages**

For each page: load it, toggle Study Mode on, confirm glosses appear and the bar tracks sections, toggle off, confirm the page is visually identical to its initial state. Console must stay clean.

Then confirm the URL entry works: `us-elections.html?study=on` loads with Study Mode already active, and `?study=off` loads without it even if it was last left on.

- [ ] **Step 3: Bump the version and write the changelog**

Set `VERSION` to `3.7.0`. Add a `## [3.7.0] — 2026-08-28` entry to `CHANGELOG.md` above `## [3.6.0]`, covering: what Study Mode does and the `A1` reasoning for why it is additive rather than a text swap; the pure-CSS gloss reveal; the `S2` guard on the injector and how it was verified; the section bar; the `?study=` parameter and the fact that it sets a starting state, never a lock; the `iran`/`space-race` backfill with its `G6` result; and the v2 deferrals (read-aloud/TTS, writing slots, the remaining `.term`-vs-Key-Word split).

Add a short "Study Mode" note to `README.md` describing the button and the `?study=on` link form, so the Canvas-link option is discoverable.

- [ ] **Step 4: Commit**

```bash
git add VERSION CHANGELOG.md README.md
git commit -m "docs: document Study Mode; release v3.7.0"
```

---

## Self-Review

**Spec coverage.** Toggle + persistence → Task 2. CSS gloss reveal → Task 3. Key Word injector with the `S2` guard → Task 4. Section bar → Task 5. Button on 8 pages → Task 6. Gloss backfill → Task 7. `?study=` URL parameter → Task 2 (logic) and Task 8 Step 2 (verification). Error-handling table → `try/catch` in Task 2, early returns in Tasks 4 and 5, `IntersectionObserver` guard in Task 5. Testing section → Tasks 1, 4 Step 5, 7 Step 3, 8. **No gaps.**

**Placeholder scan.** No TBD/TODO. The only deliberately open item is Task 7 Step 1's term list, which is explicitly framed as candidates to confirm against the real prose — writing a fixed list here would invite glossing a word the page does not contain, which is the `V5` defect this feature exists to expose.

**Type consistency.** `firstSentence`, `termPattern`, `hasProtectedAncestor`, `resolveInitialState`, `readStudyParam`, `keyWordFromBox` are defined in Tasks 1–4 and referenced under those exact names throughout. `buildLayer`/`teardownLayer` are stubbed in Task 2 and filled in Tasks 4 and 5 — flagged in Task 2 so an executor reading tasks out of order is not surprised. `data-sm-injected` (removal marker) and `data-sm-done` (per-box idempotency guard) are distinct on purpose and used consistently.

**Known weakness, stated rather than hidden.** The `S2` guard is unit-tested as pure logic (`hasProtectedAncestor`) and verified by hand in a real browser against `immigration.html` (Task 4 Step 5), but there is no automated end-to-end DOM test, because adding jsdom would introduce the first npm dependency to a deliberately toolchain-free repo. If that trade ever stops being acceptable, the fix is a `tools/` Python check that parses each page with `html.parser` and asserts no Key Word term's first unquoted match resolves inside a `blockquote` — the same assertion, run without a browser.

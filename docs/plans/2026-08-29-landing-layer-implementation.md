# Landing Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give `climate-change.html` a 5–7 minute interactive landing layer, with its seven existing reading sections preserved intact behind a guided, never-locked unfold.

**Architecture:** A shared `Unfold` module in `site.js` (dual-mode export, matching `study-mode.js`) drives native `<details class="unfold">` elements: it forces the matching element open on deep links, tracks progress in `localStorage`, and keeps exactly one "Keep going" CTA pointing at the lowest-numbered unopened section. All disclosure is native, so the page works fully with JavaScript disabled. The topic-specific Ice Core Drill lives inline in `climate-change.html`, per the shell/centerpiece location rule.

**Tech Stack:** Vanilla ES5-compatible JavaScript (no build step, no framework, no package manager), plain CSS, inline SVG, Python 3 stdlib for tooling, `node --test` for JS tests.

**Spec:** `docs/plans/2026-08-29-landing-layer-design.md`

## Global Constraints

- **Never delete or shorten existing prose.** The 5–7 minutes is a property of the entry point, not a ceiling on the topic. Spec §3.
- **No build step.** Edit `.html`/`.css`/`.js` directly; preview with `python3 -m http.server 8000` over HTTP, never `file://`. (`AGENTS.md`)
- **ES5-compatible JS, no dependencies.** Match the IIFE style of `site.js`. School Chromebooks may run older Chrome.
- **Every `<img>` must carry an `onerror` attribute.** `verify_invariants.py` fails when `img` and `onerror` counts diverge.
- **Every `.term` needs a matching `.term-desc`.** Same tool asserts the counts are equal.
- **Landing prose must sit inside FK 6.51–10.34 and must NOT fall below it.** Below-band is the leveling-down alarm. Spec §3.
- **Landing layer ≤ 7 min** by `tools/reading_time.py`, never by author estimate.
- **Unfold membership = sections `reading_time.py`'s `SKIP_TITLE` does not match.** For `climate-change.html`: `update`, `deep-time`, `greenhouse`, `different`, `effects`, `wa-story`, `timeline` (7). Key People / Videos / Dig Deeper stay visible.
- **Learning target (G3):** *"Explain how scientists know what Earth's climate was like before anyone was measuring it, and how that evidence shows current warming differs from past natural change."*
- **Version:** ship as `3.8.0`.

---

### Task 1: Unfold ordering logic (pure functions + tests)

Pure logic first, with no DOM, so the ordering rules are testable headlessly under `node --test` — the pattern `study-mode.js` already established.

**Files:**
- Modify: `site.js` (add `Unfold` IIFE + dual-mode export at end of file)
- Test: `tools/unfold.test.js` (create)

**Interfaces:**
- Consumes: nothing.
- Produces: `window.Unfold` in the browser / `module.exports` under Node, with `parseOrder(value) -> number|null`, `nextUnopened(orders, opened) -> number|null`, `progressKey(pathname) -> string`, `parseProgress(raw) -> number[]`, `serializeProgress(list) -> string`. Task 2 consumes all five.

- [ ] **Step 1: Write the failing test**

Create `tools/unfold.test.js`:

```js
const { test } = require('node:test');
const assert = require('node:assert');
const U = require('../unfold-logic.js');

test('parseOrder accepts positive integers only', () => {
  assert.equal(U.parseOrder('3'), 3);
  assert.equal(U.parseOrder('1'), 1);
  assert.equal(U.parseOrder('0'), null);
  assert.equal(U.parseOrder('-2'), null);
  assert.equal(U.parseOrder('abc'), null);
  assert.equal(U.parseOrder(null), null);
});

test('nextUnopened returns the lowest order not yet opened', () => {
  assert.equal(U.nextUnopened([1, 2, 3], []), 1);
  assert.equal(U.nextUnopened([1, 2, 3], [1]), 2);
  assert.equal(U.nextUnopened([1, 2, 3], [1, 2]), 3);
});

test('nextUnopened returns null when everything is open', () => {
  assert.equal(U.nextUnopened([1, 2, 3], [1, 2, 3]), null);
  assert.equal(U.nextUnopened([], []), null);
});

// D3: opening out of order must not skip earlier sections. A student who
// jumps to section 2 via the nav still gets "keep going -> 1" as the guided
// next step, because ordered-never-blocked guides without locking.
test('nextUnopened still points at an earlier unopened section', () => {
  assert.equal(U.nextUnopened([1, 2, 3], [2]), 1);
  assert.equal(U.nextUnopened([1, 2, 3], [3, 2]), 1);
});

test('nextUnopened ignores unknown orders in the opened set', () => {
  assert.equal(U.nextUnopened([1, 2], [9]), 1);
});

test('progressKey is namespaced per page', () => {
  assert.equal(U.progressKey('/climate-change.html'), 'unfold:climate-change.html');
  assert.equal(U.progressKey('/'), 'unfold:index.html');
  assert.equal(U.progressKey(''), 'unfold:index.html');
});

test('parseProgress survives absent, empty and corrupt storage', () => {
  assert.deepEqual(U.parseProgress(null), []);
  assert.deepEqual(U.parseProgress(''), []);
  assert.deepEqual(U.parseProgress('1,2'), [1, 2]);
  assert.deepEqual(U.parseProgress('a,2,,3'), [2, 3]);
  assert.deepEqual(U.parseProgress('{"junk":1}'), []);
});

test('serializeProgress round-trips through parseProgress', () => {
  assert.equal(U.serializeProgress([1, 2, 3]), '1,2,3');
  assert.equal(U.serializeProgress([]), '');
  assert.deepEqual(U.parseProgress(U.serializeProgress([3, 1])), [3, 1]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tools/unfold.test.js`
Expected: FAIL — `Cannot find module '../unfold-logic.js'`

- [ ] **Step 3: Write the minimal implementation**

Create `unfold-logic.js` at the repo root (sibling of `site.js`/`study-mode.js`, so the browser can load it with a plain `<script src>` and Node can `require` it):

```js
/* Unfold — ordering logic for the progressive section reveal.
   Pure functions only: no DOM, no storage access. site.js's initUnfold()
   supplies both. Kept separate from site.js so `node --test` can exercise
   the ordering rules headlessly, the same split study-mode.js uses. */
(function () {
  function parseOrder(value) {
    if (value === null || value === undefined) return null;
    var n = parseInt(value, 10);
    if (isNaN(n) || n < 1) return null;
    return n;
  }

  // The guided next step is always the LOWEST unopened order, even if the
  // student opened a later one first via the nav. Ordered, never blocked.
  function nextUnopened(orders, opened) {
    var sorted = orders.slice().sort(function (a, b) { return a - b; });
    for (var i = 0; i < sorted.length; i++) {
      if (opened.indexOf(sorted[i]) === -1) return sorted[i];
    }
    return null;
  }

  function progressKey(pathname) {
    var file = String(pathname || '').split('/').pop();
    if (!file) file = 'index.html';
    return 'unfold:' + file;
  }

  function parseProgress(raw) {
    if (!raw) return [];
    var out = [];
    var parts = String(raw).split(',');
    for (var i = 0; i < parts.length; i++) {
      var n = parseOrder(parts[i]);
      if (n !== null) out.push(n);
    }
    return out;
  }

  function serializeProgress(list) {
    return list.join(',');
  }

  var api = {
    parseOrder: parseOrder,
    nextUnopened: nextUnopened,
    progressKey: progressKey,
    parseProgress: parseProgress,
    serializeProgress: serializeProgress
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    window.UnfoldLogic = api;
  }
})();
```

- [ ] **Step 4: Fix the test's require path and run to verify it passes**

The test requires `../unfold-logic.js` from `tools/`, which resolves to the repo root. No change needed.

Run: `node --test tools/unfold.test.js`
Expected: PASS — 8 tests, 0 failures

- [ ] **Step 5: Confirm the existing suite still passes**

Run: `node --test tools/`
Expected: PASS — `unfold.test.js` plus the existing `study-mode.test.js` and `study-mode.integration.test.js`

- [ ] **Step 6: Commit**

```bash
git add unfold-logic.js tools/unfold.test.js
git commit -m "feat: unfold ordering logic with headless tests"
```

---

### Task 2: Unfold DOM wiring and styles

**Files:**
- Modify: `site.js` (add `initUnfold`, call it from `init`)
- Modify: `site.css` (append the unfold block)

**Interfaces:**
- Consumes: `window.UnfoldLogic` from Task 1 — `parseOrder`, `nextUnopened`, `progressKey`, `parseProgress`, `serializeProgress`.
- Produces: `initUnfold()` wired into `site.js`'s existing `init()`. Expects markup `<details class="unfold" data-order="N"><summary>…</summary>…</details>` and an optional single `<div class="unfold-cta" id="unfoldCta"></div>`. Task 3 produces that markup.

- [ ] **Step 1: Add `initUnfold` to `site.js`**

Insert immediately before `function initSuggestForm()`:

```js
  /* Progressive section reveal. Disclosure itself is native <details>, so the
     page is fully usable with JS off — this only adds the *ordering*: one
     prominent "Keep going" CTA at a time, pointing at the lowest unopened
     section. Every <summary> stays clickable in any order (spec D3). */
  function initUnfold() {
    var L = window.UnfoldLogic;
    var nodes = document.querySelectorAll('details.unfold');
    if (!L || !nodes.length) return;

    var sections = [];
    for (var i = 0; i < nodes.length; i++) {
      var order = L.parseOrder(nodes[i].getAttribute('data-order'));
      if (order !== null) sections.push({ order: order, el: nodes[i] });
    }
    if (!sections.length) return;

    var key = L.progressKey(window.location.pathname);
    var cta = document.getElementById('unfoldCta');

    function read() {
      try { return L.parseProgress(localStorage.getItem(key)); }
      catch (e) { return []; }   // private mode / storage disabled
    }

    function write(list) {
      try { localStorage.setItem(key, L.serializeProgress(list)); }
      catch (e) { /* progress is a convenience, never a requirement */ }
    }

    function openedOrders() {
      var out = [];
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].el.open) out.push(sections[i].order);
      }
      return out;
    }

    function find(order) {
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].order === order) return sections[i].el;
      }
      return null;
    }

    function refreshCta() {
      if (!cta) return;
      var next = L.nextUnopened(
        sections.map(function (s) { return s.order; }),
        openedOrders()
      );
      if (next === null) { cta.hidden = true; return; }
      var el = find(next);
      var title = el.getAttribute('data-title') || '';
      var mins = el.getAttribute('data-minutes') || '';
      cta.hidden = false;
      cta.innerHTML = '';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'unfold-cta-btn';
      btn.innerHTML = '<span class="unfold-cta-label">Keep going</span>' +
        '<span class="unfold-cta-title"></span>' +
        '<span class="unfold-cta-time"></span>';
      btn.querySelector('.unfold-cta-title').textContent = title;
      btn.querySelector('.unfold-cta-time').textContent = mins ? mins + ' min' : '';
      btn.addEventListener('click', function () {
        el.open = true;
        var s = el.querySelector('summary');
        if (s && s.focus) s.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      cta.appendChild(btn);
    }

    // A deep link or a section-nav click must open its section even when
    // collapsed — otherwise every existing #anchor on this page silently
    // stops working.
    function openForHash(hash) {
      if (!hash || hash === '#') return;
      var target = null;
      try { target = document.querySelector(hash); } catch (e) { return; }
      if (!target) return;
      var d = target.closest ? target.closest('details.unfold') : null;
      if (d && !d.open) {
        d.open = true;
        target.scrollIntoView({ block: 'start' });
      }
    }

    for (var j = 0; j < sections.length; j++) {
      sections[j].el.addEventListener('toggle', function () {
        write(openedOrders());
        refreshCta();
      });
    }

    var saved = read();
    for (var k = 0; k < sections.length; k++) {
      if (saved.indexOf(sections[k].order) !== -1) sections[k].el.open = true;
    }

    window.addEventListener('hashchange', function () {
      openForHash(window.location.hash);
    });
    openForHash(window.location.hash);
    refreshCta();
  }
```

- [ ] **Step 2: Call it from `init`**

In `site.js`, change:

```js
  function init() {
    initA11y();
    initTerms();
    initSuggestForm();
  }
```

to:

```js
  function init() {
    initA11y();
    initTerms();
    initUnfold();
    initSuggestForm();
  }
```

- [ ] **Step 3: Append the unfold styles to `site.css`**

```css
/* ── Progressive section unfold ─────────────────────────────────────────
   Native <details>. Closed, the <summary> is the card a student clicks;
   open, it shrinks to a slim collapse affordance and the section's own
   .sec-head resumes its role as the visual header. */
details.unfold { border-top: 1px solid var(--rule); margin: 0; }
details.unfold > summary {
  cursor: pointer; list-style: none; padding: 1.15rem 0;
  display: flex; align-items: baseline; gap: 0.75rem;
}
details.unfold > summary::-webkit-details-marker { display: none; }
details.unfold > summary::after {
  content: '+'; margin-left: auto; font-size: 1.35rem; line-height: 1;
  color: var(--ink-faint);
}
details.unfold[open] > summary::after { content: '\2212'; }  /* minus */
.unfold-summary-title { font-weight: 600; }
.unfold-summary-time { color: var(--ink-faint); font-size: 0.85rem; }
details.unfold[open] > summary { padding: 0.6rem 0; opacity: 0.65; }
details.unfold[open] > summary .unfold-summary-title { font-weight: 400; }

details.unfold > summary:focus-visible {
  outline: 2px solid var(--accent); outline-offset: 3px;
}

.unfold-cta { margin: 2.5rem 0; }
.unfold-cta[hidden] { display: none; }
.unfold-cta-btn {
  width: 100%; text-align: left; cursor: pointer;
  background: var(--paper-warm); border: 1px solid var(--rule);
  border-left: 3px solid var(--accent);
  padding: 1.1rem 1.25rem; font: inherit; color: var(--ink);
  display: flex; align-items: baseline; gap: 0.6rem; flex-wrap: wrap;
}
.unfold-cta-btn:hover { background: var(--accent-tint); }
.unfold-cta-label {
  text-transform: uppercase; letter-spacing: 0.08em;
  font-size: 0.7rem; color: var(--accent-ink);
}
.unfold-cta-title { font-weight: 600; }
.unfold-cta-time { margin-left: auto; color: var(--ink-faint); font-size: 0.85rem; }

/* A teacher printing the topic must get the whole topic. No JS involved. */
@media print {
  details.unfold > summary { display: none; }
  details.unfold > *:not(summary) { display: block !important; }
  .unfold-cta { display: none; }
}
```

- [ ] **Step 4: Verify nothing regressed**

Run: `node --test tools/`
Expected: PASS

Run: `python3 tools/verify_invariants.py HEAD`
Expected: `OK: all invariants hold` — this task touched no `.html`

- [ ] **Step 5: Commit**

```bash
git add site.js site.css
git commit -m "feat: unfold DOM wiring, CTA component and print rules"
```

---

### Task 3: Wrap climate-change's seven reading sections

**The ceiling-preservation proof.** This task changes structure and nothing else — no prose is written, edited, moved between sections, or removed. That is what lets the gate assert *exact equality* on `cite-inline` / `term` / `term-desc` counts and byte-identical `data-def` text, which is a far stronger claim than "nothing decreased."

**Files:**
- Modify: `climate-change.html`
- Modify: `index.html` — none. (No cross-page change in this task.)

**Interfaces:**
- Consumes: `initUnfold()` and the CSS from Task 2.
- Produces: seven `<details class="unfold" data-order="N" data-title="…" data-minutes="…">` elements, plus `<div class="unfold-cta" id="unfoldCta"></div>` placed where the landing layer will end. Task 5 fills the landing layer above it.

- [ ] **Step 1: Record the baseline**

```bash
python3 tools/reading_time.py > /tmp/rt-before.csv
python3 tools/verify_invariants.py HEAD
git rev-parse HEAD
```

Expected: `OK: all invariants hold`. Keep `/tmp/rt-before.csv` — Task 5 diffs against it.

- [ ] **Step 2: Add the unfold-logic script tag**

In `climate-change.html`, before the existing `<script src="study-mode.js"></script>` (line ~1094):

```html
<script src="unfold-logic.js"></script>
```

Order matters: `site.js` reads `window.UnfoldLogic` at `init()`, and `site.js` is loaded last.

- [ ] **Step 3: Wrap each of the seven sections**

Each section is currently **three sibling elements** — `<div class="sec-head" id="…">`, `<aside class="before-read">`, `<div class="article">`. Wrap all three, leaving every attribute and every byte of inner content untouched.

Apply this shape to each, using the table below for the attribute values:

```html
<details class="unfold" data-order="2" data-title="Deep-Time Climate History" data-minutes="3">
  <summary>
    <span class="unfold-summary-title">Deep-Time Climate History</span>
    <span class="unfold-summary-time">3 min</span>
  </summary>
  <div class="sec-head" id="deep-time">
    …unchanged…
  </div>
  <aside class="before-read" aria-labelledby="br-deep-time">
    …unchanged…
  </aside>
  <div class="article">
    …unchanged…
  </div>
</details>
```

| order | id | data-title | data-minutes |
|---|---|---|---|
| 1 | `update` | Where Things Stand | 4 |
| 2 | `deep-time` | Deep-Time Climate History | 3 |
| 3 | `greenhouse` | The Greenhouse Effect | 2 |
| 4 | `different` | What's Different This Time | 2 |
| 5 | `effects` | Effects Being Observed | 2 |
| 6 | `wa-story` | Washington's Climate Story | 3 |
| 7 | `timeline` | How Did We Learn All This? | 1 |

`data-minutes` values come from `/tmp/rt-before.csv`'s `minutes` column. If any differ from the table, **the CSV wins** — re-read it and use its value.

Do **not** wrap `#people`, `#videos`, `#resources` (end-matter — `SKIP_TITLE` matches them) or the `eggTitle` easter egg.

- [ ] **Step 4: Add the CTA placeholder**

Immediately before the `<details>` with `data-order="1"`:

```html
<div class="unfold-cta" id="unfoldCta" hidden></div>
```

- [ ] **Step 5: Run the ceiling-preservation gate**

```bash
python3 tools/verify_invariants.py HEAD climate-change.html
```

Expected: `OK: all invariants hold`

A `DIFF … cite-inline`, `DIFF … term`, `DIFF … term-desc`, or `DIFF … data-def text changed` line means content moved or was lost during the wrap. **Do not proceed** — find and restore what changed. That is exactly the failure this gate exists to catch.

Also confirm reading times are unmoved:

```bash
python3 tools/reading_time.py > /tmp/rt-after-wrap.csv
diff /tmp/rt-before.csv /tmp/rt-after-wrap.csv && echo "IDENTICAL"
```

Expected: `IDENTICAL` — the wrap moved no prose.

- [ ] **Step 6: Verify behavior in a browser**

```bash
python3 -m http.server 8000
```

Check at `http://localhost:8000/climate-change.html`:
1. All seven sections are collapsed; Key People / Videos / Dig Deeper are visible.
2. Clicking a `<summary>` opens it; the `+` becomes `−`.
3. Every `.section-nav` link opens its section and scrolls to it, including collapsed ones.
4. Pasting `http://localhost:8000/climate-change.html#wa-story` opens that section on load.
5. Reload — previously opened sections stay open.
6. Print preview (Cmd-P) shows **every** section expanded and no CTA.
7. Study Mode (💡) still injects glosses inside collapsed-then-opened sections.
8. **Disable JavaScript entirely and reload.** Every summary must still open and close.

- [ ] **Step 7: Commit**

```bash
git add climate-change.html
git commit -m "refactor: wrap climate-change reading sections in unfold details

Pure structural change -- no prose added, edited, moved or removed.
verify_invariants.py HEAD reports exact equality on cite-inline, term and
term-desc counts with byte-identical data-def text, and reading_time.py
output is unchanged. That is the ceiling-preservation proof required by
the spec's Gate 4."
```

---

### Task 4: Teach `reading_time.py` to measure the landing layer

The landing budget must be enforced by the tool, not by an author's estimate. Task 5's gate depends on this.

**Files:**
- Modify: `tools/reading_time.py`

**Interfaces:**
- Consumes: nothing.
- Produces: a `--landing` flag printing landing-layer words/minutes per page and exiting non-zero when any exceeds 7 minutes. Task 5 runs it as a gate.

- [ ] **Step 1: Add the landing measurement**

The landing layer is every `<p>` that is **not** inside a `<details class="unfold">`, excluding the easter egg and the end-matter sections already skipped. Append to `tools/reading_time.py`, before `main()`:

```python
LANDING_MAX_MIN = 7  # spec: the entry point is 5-7 minutes


def landing_fragment(html):
    """Everything outside the unfold details -- i.e. the landing layer.

    Deliberately a structural test, not a class-name test: a <p> counts as
    landing prose exactly when no <details class="unfold"> encloses it, so
    the measurement cannot drift as landing markup gains new wrappers.
    """
    html = strip_code(html)
    return re.sub(r'<details[^>]*class="[^"]*unfold[^"]*"[^>]*>.*?</details>',
                  '', html, flags=re.S)


def landing_report(paths):
    rows, failed = [], False
    for path in paths:
        html = open(path, encoding='utf-8').read()
        if 'class="unfold"' not in html:
            continue
        words = prose_words(landing_fragment(html))
        mins = minutes(words)
        over = mins > LANDING_MAX_MIN
        failed = failed or over
        rows.append((path, words, mins, 'OVER' if over else 'ok'))
    return rows, failed
```

- [ ] **Step 2: Wire the flag into `main()`**

At the top of `main()`, before its existing body:

```python
    if '--landing' in sys.argv:
        paths = [a for a in sys.argv[1:] if a != '--landing'] or \
            sorted(glob.glob('*.html'))
        rows, failed = landing_report(paths)
        print('page,landing_words,landing_minutes,status')
        for r in rows:
            print(','.join(str(x) for x in r))
        print('FAIL: landing layer over %d min' % LANDING_MAX_MIN
              if failed else 'OK: landing layers within budget')
        return 1 if failed else 0
```

Confirm `main()`'s final line is `return`-based and that the `__main__` guard uses `sys.exit(main())`; if `main()` currently returns `None`, that is fine — `sys.exit(None)` exits 0.

- [ ] **Step 3: Run it against the wrapped page**

Run: `python3 tools/reading_time.py --landing climate-change.html`
Expected after Task 3 (landing layer not yet written, so only masthead/nav prose is outside the details):

```
page,landing_words,landing_minutes,status
climate-change.html,<a two- or three-digit count>,1,ok
OK: landing layers within budget
```

At this point the only prose outside the details elements is the masthead and
hero, so the count should be small and the status `ok`. A large count here means
`landing_fragment` failed to strip a details block — check that the wrapper
regex matched all seven.

- [ ] **Step 4: Confirm the default mode is unchanged**

```bash
python3 tools/reading_time.py > /tmp/rt-flagcheck.csv
diff /tmp/rt-after-wrap.csv /tmp/rt-flagcheck.csv && echo "IDENTICAL"
```

Expected: `IDENTICAL`

- [ ] **Step 5: Commit**

```bash
git add tools/reading_time.py
git commit -m "feat: reading_time --landing asserts the 7-minute entry-point budget"
```

---

### Task 5: Write the landing layer prose

**Files:**
- Modify: `climate-change.html` (insert above the CTA from Task 3)

**Interfaces:**
- Consumes: the `#unfoldCta` element and the seven wrapped sections.
- Produces: the landing layer. Task 6 inserts the Ice Core Drill into the slot marked in Step 2.

- [ ] **Step 1: Re-read the binding content rules**

From the spec §3 and §4, all of which gate this task:
- ~660 words total; NAEP grade-8 spec is 400–1,000.
- FK **inside** 6.51–10.34, and **not below** — below-band is the leveling-down alarm.
- `NARR` grammar: compound sentences and *because* are wanted. Do not apply test-item fairness grammar here.
- Terms are **glossed in place, never removed** (Rule D). Every `.term` needs its paired `.term-desc`.
- Dates are explicit — never "now" or "currently".
- Every factual claim carries a `cite-inline` link, and the source must be fetched and read, not merely confirmed to return 200.

- [ ] **Step 2: Insert the landing structure**

Immediately after the `.section-nav` block and before `<div class="unfold-cta" id="unfoldCta" hidden></div>`, using the existing `article-hero` / `.lede` / `.term` conventions already in this file:

```html
<section class="landing" id="landing">
  <div class="article">
    <p class="lede">…orientation: the whole issue in four sentences (~90 w)…</p>
  </div>

  <!-- ICE CORE DRILL — Task 6 replaces this comment entirely -->

  <div class="article">
    <p>…spine beat 1 (~150 w)…</p>
    <p>…spine beat 2 (~150 w)…</p>
    <p>…spine beat 3 (~150 w)…</p>
  </div>

  <div class="article">
    <p class="landing-standing"><strong>Where things stand, August 2026.</strong> …~120 w…</p>
  </div>
</section>
```

- [ ] **Step 3: Write the prose to the declared learning target**

Target: *"Explain how scientists know what Earth's climate was like before anyone was measuring it, and how that evidence shows current warming differs from past natural change."*

The three spine beats follow the target's own logic, so the interactive and the prose stay mutually dependent (spec §6):
1. **Nobody was measuring** — no thermometers before the 1700s, so the record has to come from somewhere other than measurement.
2. **The ice measured it for us** — trapped bubbles are literal samples of old air, which is why the ice core is evidence rather than inference. *This is the beat the drill supports; it states the significance the interactive cannot show.*
3. **What the record shows that is different** — not that CO₂ rose, but the *rate*, against 800,000 years of context.

The Where-things-stand paragraph reuses the dated-snapshot pattern already in `#update`, at four sentences rather than the section's full treatment.

- [ ] **Step 4: Run the reading-intervention scaffold pass**

Invoke `reading-intervention --scaffold` on the landing prose. Route it as **instructional** (`NARR`), not assessment. Act on `BLOCKING` and `FINDING` items. Remedies must be additive — a remedy whose only effect is cutting words is invalid under Rule B and must be rewritten as something to add.

**Expect Family K to run degraded.** `reader-profile.md`'s prior-units index is
unfilled (spec §9), so assumed-knowledge findings arrive as `NOTE` rather than
`FINDING` — nothing can distinguish an already-taught term from a genuine gap.
Ask the teacher which of *greenhouse effect, isotope, proxy record, parts per
million, Industrial Revolution, feedback loop, ice core, atmosphere* the class
has already had; if unanswered, gloss all of them in place rather than assuming
either way. Glossing a known term costs a student three seconds; assuming a
term is known costs them the paragraph.

- [ ] **Step 5: Run the budget gate**

```bash
python3 tools/reading_time.py --landing climate-change.html
```

Expected: `climate-change.html,<650-910>,5,ok` and `OK: landing layers within budget`

If minutes > 7, the fix is **not** to delete prose — move a passage into the relevant `<details>` section, where it still belongs to the topic. Deleting is forbidden (Global Constraints).

- [ ] **Step 6: Confirm the deep sections are untouched**

```bash
python3 tools/reading_time.py > /tmp/rt-after-landing.csv
diff /tmp/rt-after-wrap.csv /tmp/rt-after-landing.csv
```

Expected: differences **only** in `climate-change.html`'s `TOTAL` row (which grows by the landing words). Every named section row must be byte-identical. Any changed section row means landing work leaked into deep prose.

```bash
python3 tools/verify_invariants.py HEAD climate-change.html
```

Expected: `DIFF` lines showing `cite-inline` and `term`/`term-desc` counts **increasing** — additions, which are correct here and are why this task follows Task 3 rather than preceding it. `data-def text changed` is also expected, since new glossed terms were added. Confirm by inspection that no old value disappeared:

```bash
git show HEAD:climate-change.html | grep -o 'data-def="[^"]*"' | sort > /tmp/defs-old.txt
grep -o 'data-def="[^"]*"' climate-change.html | sort > /tmp/defs-new.txt
comm -23 /tmp/defs-old.txt /tmp/defs-new.txt
```

Expected: **empty output** — no previously existing gloss was lost.

- [ ] **Step 7: Commit**

```bash
git add climate-change.html
git commit -m "feat: climate-change landing layer prose (~5 min entry point)"
```

---

### Task 6: The Ice Core Drill centerpiece

**Files:**
- Modify: `climate-change.html` (replace the Task 5 comment marker; add an inline `<script>` near the existing one at ~line 913)

**Interfaces:**
- Consumes: the landing structure from Task 5.
- Produces: the centerpiece. Nothing later depends on it.

- [ ] **Step 1: Verify the data before writing any code**

The interactive must be honest under abuse (spec §6, requirement 2). Fetch and read each source; record the exact figure and its URL:

| Datum | Source to fetch |
|---|---|
| Pre-industrial CO₂ (~1850) | NOAA Global Monitoring Laboratory |
| Modern CO₂ (dated, 2026) | NOAA Mauna Loa record |
| Last-glacial-maximum CO₂ | EPICA Dome C / Vostok ice-core record via NOAA Paleoclimatology |
| Full 800,000-year range (min/max) | Same EPICA Dome C record |

Write the verified values into the `DATA` array in Step 2. **If a fetched value differs from what you expected, the source wins.** Do not ship a figure you did not read at its source — a live URL is not verification.

- [ ] **Step 2: Add the markup**

Replace the `<!-- ICE CORE DRILL … -->` comment:

```html
<figure class="centerpiece" id="iceCore">
  <figcaption class="centerpiece-head">
    <span class="tag">Try it</span>
    <span class="centerpiece-title">Drill down and read the air</span>
  </figcaption>

  <div class="centerpiece-body">
    <label class="centerpiece-label" for="drillDepth">
      Drill depth — drag, or use the arrow keys
    </label>
    <input type="range" id="drillDepth" min="0" max="100" value="0" step="1"
           aria-describedby="drillReadout">

    <!-- The live readout IS the screen-reader path AND the no-JS caption.
         One piece of content, three jobs (spec Section 6, requirement 4). -->
    <p class="centerpiece-readout" id="drillReadout" role="status" aria-live="polite">
      Depth 0 m &middot; present day &middot; <strong>425 ppm</strong>
    </p>

    <svg class="centerpiece-svg" viewBox="0 0 320 200" role="img"
         aria-label="A column of Antarctic ice. Deeper layers hold older air.">
      <defs>
        <linearGradient id="iceGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#dcebf2"/>
          <stop offset="100%" stop-color="#7d9fb3"/>
        </linearGradient>
      </defs>
      <rect x="24" y="12" width="56" height="176"
            fill="url(#iceGrad)" stroke="#5b7c8d" stroke-width="1"/>
      <g fill="#ffffff" opacity="0.7" aria-hidden="true">
        <circle cx="38" cy="34" r="2.5"/><circle cx="62" cy="52" r="1.8"/>
        <circle cx="45" cy="78" r="2.2"/><circle cx="66" cy="104" r="1.6"/>
        <circle cx="36" cy="128" r="2"/><circle cx="58" cy="158" r="2.4"/>
      </g>
      <!-- Depth marker. JS moves this on the y axis; at rest it sits at the
           surface, which is the correct no-JS state. -->
      <g id="drillMarker" transform="translate(0,12)">
        <line x1="18" y1="0" x2="86" y2="0" stroke="#a02c2c" stroke-width="2"/>
        <polygon points="8,-5 18,0 8,5" fill="#a02c2c"/>
      </g>
      <polyline id="drillTrace" fill="none" stroke="#1a1a1a" stroke-width="1.5"
                points=""/>
      <text x="100" y="22" font-size="9" fill="#767066">CO&#8322; by depth (ppm)</text>
    </svg>
  </div>

  <figcaption class="centerpiece-note">
    Air trapped in Antarctic ice, by depth. Sources listed in
    <a href="#resources">Dig Deeper</a>.
  </figcaption>
</figure>
```

The readout's default text is the no-JS fallback: it states the takeaway without any script running.

- [ ] **Step 3: Add the behavior**

In the existing inline `<script>` block:

```js
/* Ice Core Drill. Inputs are clamped to the range the ice-core record
   actually covers -- a student who drags to the end gets the real bottom of
   the record, not an extrapolation we did not verify. */
(function () {
  var slider = document.getElementById('drillDepth');
  var readout = document.getElementById('drillReadout');
  if (!slider || !readout) return;

  // [depth_m, years_before_present, co2_ppm], shallowest row first.
  //
  // Step 1 fills this. Requirements, so there is no judgement left here:
  //   - at least 6 rows, strictly increasing by depth;
  //   - row 0 is the present day (years = 0) from the Mauna Loa record;
  //   - the final row is the deepest point you actually read in the EPICA
  //     Dome C record -- not the deepest point the core reaches;
  //   - every ppm value is a figure read at its source in Step 1.
  // Interpolate nothing. An unverified number here is a falsehood shipped
  // with better production values than the truth (spec Section 6, req. 2).
  var DATA = [];

  // Until DATA is populated the control is removed rather than shown inert:
  // a slider that moves and changes nothing teaches that depth does not
  // matter, which is the opposite of the point.
  if (!DATA.length) { slider.hidden = true; return; }

  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  function nearest(pct) {
    var i = Math.round((pct / 100) * (DATA.length - 1));
    return DATA[Math.max(0, Math.min(DATA.length - 1, i))];
  }

  function moveMarker(pct) {
    var marker = document.getElementById('drillMarker');
    if (marker) marker.setAttribute('transform', 'translate(0,' + (12 + (pct / 100) * 176) + ')');
  }

  function render() {
    var pct = Number(slider.value);
    var row = nearest(pct);
    var age = row[1] === 0 ? 'present day' : fmt(row[1]) + ' years ago';
    readout.innerHTML = 'Depth ' + fmt(row[0]) + ' m &middot; ' + age +
      ' &middot; <strong>' + row[2] + ' ppm</strong>';
    moveMarker(pct);
  }

  slider.addEventListener('input', render);
  render();
})();
```

`<input type="range">` is keyboard-operable natively (arrow keys, Home, End) and announces through `aria-describedby` plus the `role="status"` live region — requirement 4 met without custom key handling.

- [ ] **Step 4: Verify the six requirements**

1. **Mechanism, not verdict** — it shows how the measurement works; it makes no claim about policy.
2. **Honest under abuse** — drag to both extremes; both ends must land on real record values, never extrapolation.
3. **Under 60 seconds** — time it.
4. **Keyboard + screen reader** — tab to the slider, drive it with arrow keys only, confirm the readout updates and is announced.
5. **No-JS** — disable JavaScript, reload; the static readout and SVG must still carry the takeaway.
6. **Sourced and dated** — every figure traces to a Step 1 fetch.

- [ ] **Step 5: Re-run the budget gate**

```bash
python3 tools/reading_time.py --landing climate-change.html
python3 tools/reading_time.py > /tmp/rt-after-drill.csv
diff /tmp/rt-after-landing.csv /tmp/rt-after-drill.csv
```

Expected: still `ok` and ≤ 7 min. `<figcaption>` text is not counted (`prose_words` reads `<p>` only), so section rows should be unchanged.

- [ ] **Step 6: Commit**

```bash
git add climate-change.html
git commit -m "feat: Ice Core Drill centerpiece for climate-change landing layer"
```

---

### Task 7: Q1 passage-independence probe

**Files:** none modified unless the probe fails.

**Interfaces:**
- Consumes: the finished landing layer and centerpiece.
- Produces: a pass/fail judgement plus any revisions it forces.

- [ ] **Step 1: Assemble the probe input**

Collect the landing layer's comprehension items — the `quiz-inline` questions attached to the landing layer and the Ice Core Drill's own prompt — plus the declared learning target. **Do not include the passage text.**

- [ ] **Step 2: Dispatch a separate agent**

The teacher approved this on 2026-08-29. A context that has already read the passage cannot self-report this validly, so it must be a fresh agent. Give it only: the items, and the learning target. Ask it to answer every item from general knowledge and the target alone.

- [ ] **Step 3: Classify and count**

Mark each item `PASSAGE-DEPENDENT`, `PASSAGE-INDEPENDENT`, or `PARTIAL`. Report the count plainly, e.g. "2 of 6 items are answerable without the passage."

- [ ] **Step 4: Apply the finding**

A `PASSAGE-INDEPENDENT` item that is *presented as a comprehension check* is the defect — a warm-up or values question is meant to work that way, and is not a finding.

Where the defect is real, the fix is additive: rewrite the item to require something only the passage or the drill supplies. **Do not** make the prose longer to justify a weak question, and do not delete the question.

- [ ] **Step 5: Commit any revisions**

```bash
git add climate-change.html
git commit -m "fix: tighten landing-layer items that passed the Q1 independence probe"
```

---

### Task 8: Stress-test the pattern, then ship 3.8.0

**Files:**
- Modify: `VERSION`, `CHANGELOG.md`, `AGENTS.md`

- [ ] **Step 1: Stress-test on paper against gun-violence**

Design review only — build nothing. Confirm against `gun-violence.html`'s 11 sections:
- Eleven collapsed summaries do not themselves read as a wall.
- The CTA still reads sensibly at order 11.
- Its 16-minute "School Safety Measures" section is tolerable as a single `<details>`, or the rollout should plan to split it *without deleting anything*.

Record the answer in the spec's §10 as a note for the rollout. If the pattern does collapse at 11 sections, stop and revise the spec before shipping.

- [ ] **Step 2: Full verification sweep**

```bash
node --test tools/
python3 tools/reading_time.py --landing
python3 tools/check_study_mode.py
python3 tools/verify_invariants.py HEAD
```

Expected: tests pass; landing within budget; Study Mode checks pass; invariants show only the expected `climate-change.html` additions.

- [ ] **Step 3: Fix the stale line in `AGENTS.md`**

Replace `- **Lint / test:** none configured.` with:

```markdown
- **Lint / test:** no lint config. JS unit tests run headlessly with
  `node --test tools/` (no dependencies). Python checks: `tools/reading_time.py`
  (add `--landing` to assert the 5-7 min entry-point budget),
  `tools/verify_invariants.py <git-ref>`, `tools/check_study_mode.py`.
```

- [ ] **Step 4: Bump the version**

```bash
echo "3.8.0" > VERSION
```

- [ ] **Step 5: Write the CHANGELOG entry**

Add a `## [3.8.0] — 2026-08-29` section above `## [3.7.0]`, in the house style — explain *why*, not just what. It must state: the site had drifted to long-form; the 5–7 minutes is a property of the entry point rather than a ceiling on the topic; and **nothing was deleted**, proven by `verify_invariants.py` reporting exact equality across the structural wrap. Reference the same Davison & Kantor reasoning the 3.7.0 entry used for Study Mode, since this is the same principle applied to structure instead of glossing.

- [ ] **Step 6: Commit**

```bash
git add VERSION CHANGELOG.md AGENTS.md docs/plans/2026-08-29-landing-layer-design.md
git commit -m "release: 3.8.0 -- landing layer with progressive unfold on climate-change"
```

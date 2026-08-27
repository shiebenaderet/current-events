# Reading Scaffolding & Length Honesty — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every substantive section a "Before you read" entry block with a measured reading time, and make every advertised length on the site true.

**Architecture:** A single new `.before-read` component defined once in `site.css` (which loads after every page's inline `<style>`, so one rule serves all eight pages), plus one `<aside>` inserted per section between the existing `.sec-head` and `.article`. No JavaScript. No new colors — the block draws on each page's own `--accent`. Length figures are computed from the corpus by a checked-in script, never estimated by hand.

**Tech Stack:** Static HTML5, hand-written CSS, no build step, no framework, no package manager. Python 3 for the measurement/verification scripts (stdlib only). `python3 -m http.server` for preview.

**Spec:** `docs/superpowers/specs/2026-08-27-reading-scaffolding-design.md`

## Global Constraints

Copied verbatim from the spec and `MEMORY.md`. Every task's requirements implicitly include this section.

- **No test suite exists.** There is no build, lint, or CI (`AGENTS.md`). The test cycle in every task below is a **grep-invariant script run before and after**, with numbers recorded. "Looks fine" is not a result (`MEMORY.md` §2).
- **These counts must be IDENTICAL before and after every task,** on every page touched: `class="cite-inline"`, `class="term"`, `class="term-desc"`, `<div>` vs `</div>` balance, `<img>` vs `onerror=`, and id uniqueness.
- **`.term` keeps its triple:** `tabindex="0"` + `data-def` + `aria-describedby` → a hidden `.term-desc` span. `data-def` text stays byte-identical.
- **Never invent a fact.** A block may only restate what the section below it already says. No new claims, no new numbers, no citations inside the block.
- **Reading level ~5th–6th grade, 8th-grade depth.** Contractions fine.
- **Never address "the page."** Write in the student's ear: "Congress writes the laws," not "This section explains that Congress writes the laws." (`docs/VOICE.md`)
- **Date the news.** No undated "now / today / currently."
- **Party-swap test** on any current-policy sentence: it must read identically if the other party held the role.
- **Per-page accents stay distinct.** Never unify `--accent` (`MEMORY.md` §5).
- **Quote punctuation stays as the source wrote it.**
- **Reading rate is 130 wpm** everywhere. It is defined once, in `tools/reading_time.py`.
- **Serve over HTTP, never `file://`.**

---

## File Structure

| File | Responsibility | Task |
|---|---|---|
| `tools/reading_time.py` | Single source of truth for word counts and minutes. Used by the plan, the blocks, and verification. | 1 |
| `tools/verify_invariants.py` | Before/after invariant runner for every page. | 1 |
| `site.css` | The `.before-read` component, defined once for all pages. | 2 |
| `us-elections.html` | Pilot: 6 blocks. Proves component + voice. | 3 |
| `index.html` | Corrected times on 8 cards + featured story. | 4 |
| `space-race.html` | 4 blocks (shortest page). | 5 |
| `climate-change.html`, `iran.html` | 6 + 5 blocks. | 6 |
| `ukraine.html`, `ai.html` | 9 + 10 blocks. | 7 |
| `immigration.html`, `gun-violence.html` | 8 + 8 blocks; the two densest pages. | 8 |
| `docs/VOICE.md` | How to write these blocks, so future topics get them by default. | 9 |
| `VERSION`, `CHANGELOG.md` | v3.4.0 release. | 9 |

---

## Task 1: Measurement and verification tooling

Nothing else in this plan can be trusted without this. Both scripts are checked in so the numbers stay reproducible when the pages are refreshed later.

**Files:**
- Create: `tools/reading_time.py`
- Create: `tools/verify_invariants.py`

**Interfaces:**
- Consumes: nothing.
- Produces: `reading_time.py` prints `page,section_id,title,words,minutes` as CSV to stdout; every later task reads its `minutes` values from it. `verify_invariants.py <git-ref> <file>...` exits non-zero and prints a `DIFF` line per mismatch.

- [ ] **Step 1: Write `tools/reading_time.py`**

```python
#!/usr/bin/env python3
"""Word counts and reading times for the topic pages.

Single source of truth for every "N min" figure on the site. Re-run it after a
content refresh; if a printed minute value no longer matches the .br-time in the
page, the page is stale.

Prose = text inside <p> only. Headings, nav, captions, scripts and styles are
excluded, because a student reads the paragraphs.
"""
import csv
import glob
import os
import re
import sys

WPM = 130  # middle-school silent reading, deliberately not an adult rate

# Sections that are navigational or too thin to warrant an entry block.
SKIP_TITLE = re.compile(
    r'you found a secret|videos|dig deeper|keep learning|all sources'
    r'|key people|two historical figures|see it happen|questions for class'
    r'|ranked reading|\(page lead\)', re.I)
MIN_WORDS = 150


def strip_code(html):
    html = re.sub(r'<script.*?</script>', '', html, flags=re.S)
    return re.sub(r'<style.*?</style>', '', html, flags=re.S)


def prose_words(fragment):
    paras = re.findall(r'<p[^>]*>(.*?)</p>', fragment, flags=re.S)
    text = " ".join(re.sub(r'<[^>]+>', ' ', p) for p in paras)
    text = re.sub(r'&[a-z]+;', ' ', text)
    return len(re.findall(r"[A-Za-z][A-Za-z'-]*", text))


def minutes(words):
    return max(1, round(words / WPM))


def sections(path):
    """Yield (section_id, title, words) for each <h2> section.

    Split on every <h2>, NOT on <div class="sec-head">. The dated "Where Things
    Stand" pane on every page uses .update-head instead of .sec-head, and it is
    the section most likely to be assigned on its own. Splitting on sec-head
    alone silently drops it and undercounts every page -- gun-violence reads
    8,749 words instead of 9,715 that way.
    """
    html = strip_code(open(path, encoding='utf-8').read())
    parts = re.split(r'(<h2[^>]*>.*?</h2>)', html, flags=re.S)
    # Prose before the first <h2> is the hero dek and standfirst. A student reads
    # it, so it counts toward the page total, but it is not an assignable section
    # and never gets a block.
    lead = prose_words(parts[0])
    if lead:
        yield "", "(page lead)", lead
    for i in range(1, len(parts), 2):
        head = parts[i]
        body = parts[i + 1] if i + 1 < len(parts) else ""
        title = re.sub(r'<[^>]+>', '', head).strip()
        # The id may sit on the h2 itself or on the wrapper just before it.
        sid = ""
        m = re.search(r'id="([^"]+)"', head)
        if m:
            sid = m.group(1)
        else:
            pre = parts[i - 1][-500:] if i >= 1 else ""
            ids = re.findall(r'id="([^"]+)"', pre)
            if ids:
                sid = ids[-1]
        yield sid, title, prose_words(body)


def wants_block(title, words):
    return not SKIP_TITLE.search(title) and words >= MIN_WORDS


def main():
    targets = sys.argv[1:] or sorted(
        f for f in glob.glob("*.html") if f != "index.html")
    out = csv.writer(sys.stdout)
    out.writerow(["page", "section_id", "title", "words", "minutes", "wants_block"])
    for path in targets:
        if not os.path.exists(path):
            sys.exit(f"missing: {path}")
        total = 0
        for sid, title, words in sections(path):
            total += words
            out.writerow([path, sid, title, words, minutes(words),
                          "yes" if wants_block(title, words) else "no"])
        out.writerow([path, "TOTAL", "", total, minutes(total), ""])


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Run it and confirm it reproduces the spec's figures**

Run: `python3 tools/reading_time.py us-elections.html | tail -1`
Expected: `us-elections.html,TOTAL,,3332,26,` — matching the spec table exactly. If this number differs, STOP: either the page changed or the extractor is wrong, and every later time figure depends on it.

- [ ] **Step 3: Write `tools/verify_invariants.py`**

```python
#!/usr/bin/env python3
"""Compare structural invariants between a git ref and the working tree.

The repo has no tests. These counts are the regression suite: if any of them
moves during a task that was not meant to touch content, something broke.

Usage:  python3 tools/verify_invariants.py main us-elections.html
        python3 tools/verify_invariants.py HEAD          # all topic pages
"""
import glob
import re
import subprocess
import sys

PATTERNS = {
    "cite-inline": r'class="cite-inline"',
    "term": r'class="term"',
    "term-desc": r'class="term-desc"',
    "div-open": r'<div',
    "div-close": r'</div>',
    "img": r'<img',
    "onerror": r'onerror=',
}


def counts(text):
    return {name: len(re.findall(pat, text)) for name, pat in PATTERNS.items()}


def dup_ids(text):
    ids = re.findall(r'id="([^"]+)"', text)
    return sorted({i for i in ids if ids.count(i) > 1})


def at_ref(ref, path):
    r = subprocess.run(["git", "show", f"{ref}:{path}"],
                       capture_output=True, text=True)
    return r.stdout if r.returncode == 0 else None


def main():
    if len(sys.argv) < 2:
        sys.exit("usage: verify_invariants.py <git-ref> [file...]")
    ref = sys.argv[1]
    targets = sys.argv[2:] or sorted(glob.glob("*.html"))
    failed = False

    for path in targets:
        now = open(path, encoding='utf-8').read()
        before = at_ref(ref, path)
        cur = counts(now)

        dups = dup_ids(now)
        if dups:
            print(f"DIFF {path} duplicate-ids: {', '.join(dups)}")
            failed = True

        if cur["div-open"] != cur["div-close"]:
            print(f"DIFF {path} div-balance: "
                  f"{cur['div-open']} open vs {cur['div-close']} close")
            failed = True

        if cur["img"] != cur["onerror"]:
            print(f"DIFF {path} img-without-onerror: "
                  f"{cur['img']} img vs {cur['onerror']} onerror")
            failed = True

        if cur["term"] != cur["term-desc"]:
            print(f"DIFF {path} term-pair: "
                  f"{cur['term']} term vs {cur['term-desc']} term-desc")
            failed = True

        if before is None:
            print(f"NEW  {path} (not present at {ref})")
            continue

        old = counts(before)
        for name in ("cite-inline", "term", "term-desc"):
            if old[name] != cur[name]:
                print(f"DIFF {path} {name}: {old[name]} -> {cur[name]}")
                failed = True

        # data-def text must survive byte-identical
        old_defs = re.findall(r'data-def="([^"]*)"', before)
        new_defs = re.findall(r'data-def="([^"]*)"', now)
        if old_defs != new_defs:
            print(f"DIFF {path} data-def text changed")
            failed = True

    print("FAIL" if failed else "OK: all invariants hold")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 4: Run it against the current tree to prove it passes clean**

Run: `python3 tools/verify_invariants.py HEAD`
Expected: `OK: all invariants hold`. A `DIFF` here means the working tree is already dirty — resolve that before starting Task 2.

- [ ] **Step 5: Deliberately break one page to prove the checker actually catches it**

Run:
```bash
cp us-elections.html /tmp/ue-backup.html
python3 - <<'PY'
s = open("us-elections.html", encoding="utf-8").read()
s = s.replace('class="cite-inline"', 'class="cite-inline-x"', 1)
open("us-elections.html", "w", encoding="utf-8").write(s)
PY
python3 tools/verify_invariants.py HEAD us-elections.html
```
Expected: `DIFF us-elections.html cite-inline: 84 -> 83` then `FAIL`. A checker that cannot fail is not a checker.

- [ ] **Step 6: Restore the page and confirm clean**

Run: `cp /tmp/ue-backup.html us-elections.html && python3 tools/verify_invariants.py HEAD us-elections.html`
Expected: `OK: all invariants hold`

- [ ] **Step 7: Commit**

```bash
git add tools/reading_time.py tools/verify_invariants.py
git commit -m "tools: add reading-time and invariant scripts

The repo has no test suite, so these two scripts are the regression suite for
the scaffolding work. reading_time.py is the single source of truth for every
'N min' figure on the site; verify_invariants.py compares cite-inline, term
pairs, div balance, img/onerror and id uniqueness against a git ref.

Both verified against the corpus: us-elections totals 3332 words / 26 min,
matching the spec, and the invariant checker was proven to fail on an
intentionally corrupted citation class before being trusted."
```

---

## Task 2: The `.before-read` component

**Files:**
- Modify: `site.css` (append after the tap-to-open tooltip block added in v3.3.0)

**Interfaces:**
- Consumes: each page's own `--accent`, `--paper-warm`, `--ink`, `--ink-faint`, `--rule`, and the `--ce-*` tokens from v3.3.0.
- Produces: `.before-read`, `.br-head`, `.br-time`, `.br-first`. Every later task emits exactly this markup.

- [ ] **Step 1: Append the component to `site.css`**

```css
/* ── "Before you read" entry blocks ───────────────────────────────────────────
   One per substantive section, between .sec-head and .article. Gives a student
   the section's spine and its real cost before they commit, which is what makes
   assigning individual sections workable.

   Defined here rather than in eight inline stylesheets because site.css loads
   after them: one rule, one place to change it. Colour comes from each page's
   own --accent, so the per-page palettes stay distinct. */
.before-read{
  max-width:700px;
  margin:0 auto;
  padding:18px 6vw 20px;
}
.before-read > p{
  font-family:'Source Serif 4',Georgia,serif;
  font-size:1.02rem;
  line-height:1.6;
  color:var(--ink-light,#4a4a4a);
  margin:0 0 10px;
}
.before-read > p:last-child{margin-bottom:0}

.br-head{
  display:flex !important;
  align-items:baseline;
  justify-content:space-between;
  gap:var(--ce-space-3,12px);
  margin-bottom:10px !important;
  padding-bottom:8px;
  border-bottom:1px solid var(--rule,#d4cfc4);
}
.br-head .tag{margin-bottom:0;color:var(--accent)}
.br-time{
  font-family:-apple-system,sans-serif;
  font-size:var(--ce-text-2xs,.68rem);
  font-weight:700;
  letter-spacing:.06em;
  text-transform:uppercase;
  color:var(--ink-faint,#767066);
  white-space:nowrap;
}
.br-first{
  font-family:-apple-system,sans-serif !important;
  font-size:var(--ce-text-xs,.76rem) !important;
  color:var(--ink-faint,#767066) !important;
}
.br-first a{color:var(--accent);font-weight:700}

/* The block is a quiet frame, not a card: a left rule matching .callout and
   .vocab, so it reads as part of the same editorial furniture. */
@media (min-width:701px){
  .before-read{
    border-left:3px solid var(--accent);
    padding-left:22px;
    margin-left:max(0px,calc(50vw - 350px));
    margin-right:auto;
    max-width:678px;
  }
}
```

- [ ] **Step 2: Verify the CSS parses and every token resolves**

Run:
```bash
python3 - <<'PY'
import re
s = open("site.css", encoding="utf-8").read()
assert s.count("{") == s.count("}"), f"brace mismatch {s.count('{')}/{s.count('}')}"
used = set(re.findall(r'var\((--ce-[a-z0-9-]+)', s))
defined = set(re.findall(r'^\s*(--ce-[a-z0-9-]+):', s, flags=re.M))
missing = used - defined
assert not missing, f"undefined tokens: {missing}"
for cls in (".before-read", ".br-head", ".br-time", ".br-first"):
    assert cls in s, f"missing {cls}"
print("OK: braces balanced, tokens resolve, all four classes present")
PY
```
Expected: `OK: braces balanced, tokens resolve, all four classes present`

- [ ] **Step 3: Commit**

```bash
git add site.css
git commit -m "feat: add .before-read entry-block component

One block per substantive section, sitting between .sec-head and .article.
Defined in the shared layer because site.css loads after every page's inline
<style>, so a single rule serves all eight pages. Colour comes from each
page's own --accent, keeping the per-page palettes distinct."
```

---

## Task 3: Pilot — `us-elections.html` (6 blocks)

The pilot proves component and voice together on the best-structured page. Its section headings are already questions, so the blocks have something clear to answer.

**Files:**
- Modify: `us-elections.html` (6 insertions)

**Interfaces:**
- Consumes: `.before-read` markup from Task 2; minute values from `tools/reading_time.py`.
- Produces: the reference markup every later page copies.

- [ ] **Step 1: Record the before-state**

Run: `python3 tools/verify_invariants.py HEAD us-elections.html && python3 tools/reading_time.py us-elections.html`
Expected: `OK: all invariants hold`, and section rows including `branches,...,386,3,yes` and `local-representation,...,597,5,yes`.

- [ ] **Step 2: Insert the first block, immediately after the `sec-head` div closes at `us-elections.html:479`**

The existing markup is:
```html
<div class="sec-head" id="branches">
  <span class="num">Question 1</span>
  <h2>What are the three branches of government?</h2>
</div>
<div class="article">
```

Insert between `</div>` and `<div class="article">`:
```html
<aside class="before-read" aria-labelledby="br-branches">
  <p class="br-head">
    <span class="tag" id="br-branches">Before you read</span>
    <span class="br-time">3 min</span>
  </p>
  <p>Congress writes the laws. The president carries them out. The courts decide what they mean.</p>
  <p>Splitting the work three ways was the point — so no one person could hold all of it.</p>
</aside>
```

- [ ] **Step 3: Insert the remaining five blocks**

Same pattern, same placement — after the `.sec-head` closing `</div>`, before `<div class="article">`.

At `id="elections-mechanics"` (3 min):
```html
<aside class="before-read" aria-labelledby="br-elections-mechanics">
  <p class="br-head">
    <span class="tag" id="br-elections-mechanics">Before you read</span>
    <span class="br-time">3 min</span>
  </p>
  <p>Voters fill two of the three branches directly: Congress and the presidency. Judges are named, not elected.</p>
  <p>Different jobs come with different term lengths, so the whole government is never up for grabs at once.</p>
  <p class="br-first">First: <a href="#branches">What are the three branches of government?</a></p>
</aside>
```

At `id="checks-balances"` (3 min):
```html
<aside class="before-read" aria-labelledby="br-checks-balances">
  <p class="br-head">
    <span class="tag" id="br-checks-balances">Before you read</span>
    <span class="br-time">3 min</span>
  </p>
  <p>Each branch can block something the others do. A veto, a court ruling, a refusal to confirm.</p>
  <p>That friction is deliberate. It makes fast action hard and permanent power harder.</p>
  <p class="br-first">First: <a href="#branches">What are the three branches of government?</a></p>
</aside>
```

At `id="local-representation"` (5 min):
```html
<aside class="before-read" aria-labelledby="br-local-representation">
  <p class="br-head">
    <span class="tag" id="br-local-representation">Before you read</span>
    <span class="br-time">5 min</span>
  </p>
  <p>Alderwood sits inside a set of nested districts — city, legislative, congressional — and each one sends someone different to speak for it.</p>
  <p>Knowing which district you live in is how you find out who actually votes on your behalf.</p>
</aside>
```

At `id="timeline"` (4 min):
```html
<aside class="before-read" aria-labelledby="br-timeline">
  <p class="br-head">
    <span class="tag" id="br-timeline">Before you read</span>
    <span class="br-time">4 min</span>
  </p>
  <p>At the start, voting was mostly limited to white men who owned property. Almost everyone else was left out.</p>
  <p>Every group that got the vote after that had to win it — amendment by amendment, law by law.</p>
</aside>
```

At `id="resources"` (2 min):
```html
<aside class="before-read" aria-labelledby="br-resources">
  <p class="br-head">
    <span class="tag" id="br-resources">Before you read</span>
    <span class="br-time">2 min</span>
  </p>
  <p>Every fact on this topic traces back to one of these sources. They are grouped from easier to harder.</p>
</aside>
```

- [ ] **Step 4: Verify structure and content rules**

Run:
```bash
python3 tools/verify_invariants.py HEAD us-elections.html
python3 - <<'PY'
import re
s = open("us-elections.html", encoding="utf-8").read()
blocks = re.findall(r'<aside class="before-read".*?</aside>', s, flags=re.S)
assert len(blocks) == 6, f"expected 6 blocks, found {len(blocks)}"

ids = re.findall(r'aria-labelledby="([^"]+)"', s)
for i in ids:
    assert s.count(f'id="{i}"') == 1, f"{i} must be defined exactly once"

for b in blocks:
    assert 'class="br-time"' in b, "block missing a time"
    assert "cite-inline" not in b, "blocks must not carry citations"
    body = " ".join(re.sub(r'<[^>]+>', ' ', p)
                    for p in re.findall(r'<p>(.*?)</p>', b, flags=re.S))
    n = len(re.findall(r"[A-Za-z][A-Za-z'-]*", body))
    assert 20 <= n <= 75, f"block body {n} words, want 35-60 (hard limits 20-75)"

for href in re.findall(r'class="br-first">.*?href="#([^"]+)"', s, flags=re.S):
    assert f'id="{href}"' in s, f"br-first points at missing #{href}"

for phrase in ("this page", "this section", "below on this page", "further down"):
    for b in blocks:
        assert phrase not in b.lower(), f"block addresses the page: {phrase}"
print(f"OK: {len(blocks)} blocks, ids unique, no citations, lengths and links valid")
PY
```
Expected: `OK: all invariants hold` then `OK: 6 blocks, ids unique, no citations, lengths and links valid`

- [ ] **Step 5: Check the blocks read at the intended level**

Run:
```bash
python3 - <<'PY'
import re
def syll(w):
    w = w.lower().strip(".,!?;:'\"()")
    v, n, prev = "aeiouy", 0, False
    for ch in w:
        cur = ch in v
        if cur and not prev: n += 1
        prev = cur
    if w.endswith("e") and n > 1: n -= 1
    return max(n, 1)
s = open("us-elections.html", encoding="utf-8").read()
text = " ".join(
    re.sub(r'<[^>]+>', ' ', p)
    for b in re.findall(r'<aside class="before-read".*?</aside>', s, flags=re.S)
    for p in re.findall(r'<p>(.*?)</p>', b, flags=re.S))
sents = [x for x in re.split(r'(?<=[.!?])\s+', text) if len(x.split()) > 2]
words = re.findall(r"[A-Za-z][A-Za-z'-]*", text)
fk = 0.39*(len(words)/len(sents)) + 11.8*(sum(syll(w) for w in words)/len(words)) - 15.59
print(f"blocks FK={fk:.1f} over {len(words)} words in {len(sents)} sentences")
assert fk < 8.0, f"blocks at FK {fk:.1f} — rewrite in plainer words"
print("OK: blocks read below the page's own level")
PY
```
Expected: an FK below 8.0. The blocks are where plain words are actually available, so they should beat the page's 8.6. If not, rewrite them before committing — this is the whole point of the block.

- [ ] **Step 6: Preview at 320px and with the accessibility toggles**

Run: `python3 -m http.server 8000` then open `http://localhost:8000/us-elections.html`.
Check, and record the result in the commit: the block reads as part of the page rather than a card; the left rule aligns with `.callout`; no horizontal scroll at 320px; the block reflows under the "A" and dyslexic-font toggles.

- [ ] **Step 7: Commit**

```bash
git add us-elections.html
git commit -m "feat: add Before you read blocks to us-elections (6 sections)

Pilot for the scaffolding work. This page went first because its headings are
already questions, so each block has something specific to answer.

Blocks restate only what the section says; no new facts and no citations.
Verified: invariants unchanged against HEAD, six blocks with unique ids, every
br-first link resolves, bodies within length, and the blocks measure below the
page's own FK 8.6 — which is the point, since this is where plain words are
available."
```

---

## Task 4: Length honesty on the homepage

Independent of the blocks, and the single highest-trust fix in the plan: gun-violence is currently advertised at roughly half its true length.

**Files:**
- Modify: `index.html:266` (featured story), `index.html:281-323` (7 tier cards)

**Interfaces:**
- Consumes: `TOTAL` minutes from `tools/reading_time.py`.
- Produces: nothing downstream.

- [ ] **Step 1: Generate the true figures**

Run: `python3 tools/reading_time.py | grep TOTAL`
Expected:
```
us-elections.html,TOTAL,,3332,26
iran.html,TOTAL,,3322,26
ai.html,TOTAL,,5796,45
ukraine.html,TOTAL,,4499,35
climate-change.html,TOTAL,,2127,16
immigration.html,TOTAL,,5850,45
gun-violence.html,TOTAL,,9715,75
space-race.html,TOTAL,,1801,14
```

- [ ] **Step 2: Replace each advertised range with a true one**

Bands are rounded outward from the measured figure so they stay honest as pages grow slightly. Apply exactly:

| File / line | Current | Replace with |
|---|---|---|
| `index.html:266` (us-elections featured) | `25–45 min read` | `25–30 min read` |
| `index.html:281` (iran) | `20–40 min` | `25–30 min` |
| `index.html:288` (ukraine) | `30–50 min` | `30–40 min` |
| `index.html:295` (ai) | `25–45 min` | `40–50 min` |
| `index.html:302` (climate-change) | `25–40 min` | `15–20 min` |
| `index.html:309` (immigration) | `30–50 min` | `40–50 min` |
| `index.html:316` (gun-violence) | `25–45 min` | `70–80 min` |
| `index.html:323` (space-race) | `25–40 min` | `12–18 min` |

- [ ] **Step 3: Add a plain note under the gun-violence card**

At 70–80 minutes the card should say so rather than let a teacher discover it mid-period. Inside that card's `.tier-meta` div, after the time span:
```html
<span>Long read — assign by section</span>
```

- [ ] **Step 4: Verify no stale figure survives**

Run:
```bash
python3 - <<'PY'
import re
s = open("index.html", encoding="utf-8").read()
stale = ["25–45 min", "20–40 min", "30–50 min", "25–40 min"]
found = [t for t in stale if t in s]
assert not found, f"stale time ranges still present: {found}"
times = re.findall(r'(\d+)–(\d+) min', s)
assert len(times) == 8, f"expected 8 time ranges, found {len(times)}"
for lo, hi in times:
    assert int(lo) < int(hi), f"bad range {lo}-{hi}"
print(f"OK: 8 corrected ranges, no stale values")
PY
python3 tools/verify_invariants.py HEAD index.html
```
Expected: `OK: 8 corrected ranges, no stale values` then `OK: all invariants hold`

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "fix: correct advertised reading times on the homepage

Every figure now comes from tools/reading_time.py at 130 wpm rather than an
estimate. Two kinds of error were present: gun-violence was advertised at
25-45 min against a measured ~75, and the two shortest pages (space-race 14,
climate-change 16) were advertised as longer than they are.

The gun-violence card also now says 'Long read — assign by section', because a
75-minute page is a planning fact a teacher should have before the period
starts, not after."
```

---

## Task 5: `space-race.html` (4 blocks)

Shortest page. Confirms the block does not overwhelm light content — if four blocks crowd a 14-minute page, the component needs adjusting before it reaches the dense pages.

**Files:**
- Modify: `space-race.html` (4 insertions)

**Interfaces:**
- Consumes: `.before-read` markup from Task 2, pattern from Task 3.
- Produces: nothing downstream.

- [ ] **Step 1: Record before-state and identify targets**

Run: `python3 tools/verify_invariants.py HEAD space-race.html && python3 tools/reading_time.py space-race.html | grep ,yes`
Expected: four rows with `wants_block=yes` — the "Where Things Stand", "The First Space Race", "The New Race Is Not Just Two Countries", and "Washington's Space Story" sections.

- [ ] **Step 2: Read each target section before writing its block**

Run: `python3 -c "print(open('space-race.html',encoding='utf-8').read())" | less`
A block may only restate what its section already says. Write each one after reading that section, never from the heading alone.

- [ ] **Step 3: Insert one block per target section**

Use the exact structure from Task 3 Step 2 — `<aside class="before-read" aria-labelledby="br-SECTIONID">`, a `.br-head` carrying `.tag` and `.br-time`, then 2–3 sentences. Take each `.br-time` from the `minutes` column printed in Step 1. Add `.br-first` only where a section genuinely depends on an earlier one; on this page, "The New Race Is Not Just Two Countries" depends on "The First Space Race" and should carry:
```html
<p class="br-first">First: <a href="#first-race">The First Space Race</a></p>
```

- [ ] **Step 4: Verify**

Run:
```bash
python3 tools/verify_invariants.py HEAD space-race.html
python3 - <<'PY'
import re
s = open("space-race.html", encoding="utf-8").read()
blocks = re.findall(r'<aside class="before-read".*?</aside>', s, flags=re.S)
assert len(blocks) == 4, f"expected 4 blocks, found {len(blocks)}"
for i in re.findall(r'aria-labelledby="([^"]+)"', s):
    assert s.count(f'id="{i}"') == 1, f"{i} not unique"
for b in blocks:
    assert "cite-inline" not in b
    body = " ".join(re.sub(r'<[^>]+>', ' ', p)
                    for p in re.findall(r'<p>(.*?)</p>', b, flags=re.S))
    n = len(re.findall(r"[A-Za-z][A-Za-z'-]*", body))
    assert 20 <= n <= 75, f"block body {n} words"
for href in re.findall(r'class="br-first">.*?href="#([^"]+)"', s, flags=re.S):
    assert f'id="{href}"' in s, f"br-first points at missing #{href}"
print("OK: 4 blocks valid")
PY
```
Expected: `OK: all invariants hold` then `OK: 4 blocks valid`

- [ ] **Step 5: Preview and judge density**

Run: `python3 -m http.server 8000`, open `space-race.html`.
If the blocks crowd this page, adjust `.before-read` spacing in `site.css` NOW and note it in the commit — this is the task where that decision is cheap.

- [ ] **Step 6: Commit**

```bash
git add space-race.html site.css
git commit -m "feat: add Before you read blocks to space-race (4 sections)

Shortest page, taken second to confirm the component does not crowd light
content before it reaches the dense pages. Blocks restate only what each
section says; times from tools/reading_time.py."
```

---

## Task 6: `climate-change.html` (6 blocks) and `iran.html` (5 blocks)

**Files:**
- Modify: `climate-change.html`, `iran.html`

**Interfaces:**
- Consumes: pattern from Tasks 3 and 5.
- Produces: nothing downstream.

- [ ] **Step 1: Record before-state**

Run: `python3 tools/verify_invariants.py HEAD climate-change.html iran.html && python3 tools/reading_time.py climate-change.html iran.html | grep ,yes`
Expected: 6 rows for climate-change, 5 for iran.

- [ ] **Step 2: Write and insert `climate-change.html` blocks**

Read each target section first. Use the Task 3 structure exactly. Take times from Step 1.

Iran carries a live war and a dated snapshot, so its blocks must follow two Global Constraints closely: no undated "now / currently," and the party-swap test on any current-policy sentence. Where a section is a dated update, the block says what changed and as of when, in plain words — e.g. "As of August 27, 2026, the strait is open but barely moving."

- [ ] **Step 3: Write and insert `iran.html` blocks**

Same structure. `iran.html` has only 2 `.term` spans, so there is little tooltip interaction to disturb, but the invariant check still applies.

- [ ] **Step 4: Verify both pages**

Run:
```bash
python3 tools/verify_invariants.py HEAD climate-change.html iran.html
python3 - <<'PY'
import re
for path, want in (("climate-change.html", 6), ("iran.html", 5)):
    s = open(path, encoding="utf-8").read()
    blocks = re.findall(r'<aside class="before-read".*?</aside>', s, flags=re.S)
    assert len(blocks) == want, f"{path}: expected {want}, found {len(blocks)}"
    for i in re.findall(r'aria-labelledby="([^"]+)"', s):
        assert s.count(f'id="{i}"') == 1, f"{path}: {i} not unique"
    for b in blocks:
        assert "cite-inline" not in b, f"{path}: citation in block"
        low = b.lower()
        for bad in ("this page", "this section", "currently", "right now"):
            assert bad not in low, f"{path}: block contains '{bad}'"
        body = " ".join(re.sub(r'<[^>]+>', ' ', p)
                        for p in re.findall(r'<p>(.*?)</p>', b, flags=re.S))
        n = len(re.findall(r"[A-Za-z][A-Za-z'-]*", body))
        assert 20 <= n <= 75, f"{path}: block body {n} words"
    for href in re.findall(r'class="br-first">.*?href="#([^"]+)"', s, flags=re.S):
        assert f'id="{href}"' in s, f"{path}: br-first missing #{href}"
    print(f"OK {path}: {len(blocks)} blocks valid")
PY
```
Expected: `OK: all invariants hold`, then a valid line per page.

- [ ] **Step 5: Commit**

```bash
git add climate-change.html iran.html
git commit -m "feat: add Before you read blocks to climate-change and iran (11 sections)

Iran's blocks carry explicit as-of dates rather than 'currently', matching the
dated-snapshot rule, and were party-swap checked. Verified: invariants
unchanged, ids unique, no citations inside blocks, all br-first links resolve."
```

---

## Task 7: `ukraine.html` (9 blocks) and `ai.html` (10 blocks)

**Files:**
- Modify: `ukraine.html`, `ai.html`

**Interfaces:**
- Consumes: pattern from Tasks 3, 5, 6.
- Produces: nothing downstream.

- [ ] **Step 1: Record before-state**

Run: `python3 tools/verify_invariants.py HEAD ukraine.html ai.html && python3 tools/reading_time.py ukraine.html ai.html | grep ,yes`
Expected: 9 rows for ukraine, 10 for ai.

- [ ] **Step 2: Write and insert `ukraine.html` blocks**

Read each section first. Two constraints bind unusually hard here:
- The Holodomor section is settled history and is stated as plain fact — never run through "some say / others say" framing.
- "Where Does the War Stand?" is 1,139 words with dated figures. Its block gets an explicit date and no invented totals.

- [ ] **Step 3: Write and insert `ai.html` blocks**

`ai.html` has 12 `.term` spans and quote punctuation that must not be touched (Global Constraints). The blocks sit outside `.article`, so quotes are not at risk, but the invariant check confirms it.

- [ ] **Step 4: Verify both pages**

Run:
```bash
python3 tools/verify_invariants.py HEAD ukraine.html ai.html
python3 - <<'PY'
import re
for path, want in (("ukraine.html", 9), ("ai.html", 10)):
    s = open(path, encoding="utf-8").read()
    blocks = re.findall(r'<aside class="before-read".*?</aside>', s, flags=re.S)
    assert len(blocks) == want, f"{path}: expected {want}, found {len(blocks)}"
    for i in re.findall(r'aria-labelledby="([^"]+)"', s):
        assert s.count(f'id="{i}"') == 1, f"{path}: {i} not unique"
    for b in blocks:
        assert "cite-inline" not in b
        low = b.lower()
        for bad in ("this page", "this section", "currently", "right now"):
            assert bad not in low, f"{path}: block contains '{bad}'"
        body = " ".join(re.sub(r'<[^>]+>', ' ', p)
                        for p in re.findall(r'<p>(.*?)</p>', b, flags=re.S))
        n = len(re.findall(r"[A-Za-z][A-Za-z'-]*", body))
        assert 20 <= n <= 75, f"{path}: block body {n} words"
    for href in re.findall(r'class="br-first">.*?href="#([^"]+)"', s, flags=re.S):
        assert f'id="{href}"' in s, f"{path}: br-first missing #{href}"
    print(f"OK {path}: {len(blocks)} blocks valid")
PY
```
Expected: `OK: all invariants hold`, then a valid line per page.

- [ ] **Step 5: Commit**

```bash
git add ukraine.html ai.html
git commit -m "feat: add Before you read blocks to ukraine and ai (19 sections)

Ukraine's Holodomor block states settled history as plain fact rather than a
contested question, and its war-status block carries an explicit as-of date
with no invented totals. Verified: invariants unchanged on both pages,
including ai.html's 12 term pairs and its quote punctuation."
```

---

## Task 8: `immigration.html` (8 blocks) and `gun-violence.html` (8 blocks)

The two densest pages, taken last so the component and the voice are settled. These are also the two the spec measured at FK 9.8 and 9.9, so their blocks carry the most weight.

**Files:**
- Modify: `immigration.html`, `gun-violence.html`

**Interfaces:**
- Consumes: pattern from Tasks 3, 5, 6, 7.
- Produces: nothing downstream.

- [ ] **Step 1: Record before-state**

Run: `python3 tools/verify_invariants.py HEAD immigration.html gun-violence.html && python3 tools/reading_time.py immigration.html gun-violence.html | grep ,yes`
Expected: 8 rows each. Note the outliers — gun-violence "School Safety Measures" at 1,985 words / 15 min and "How Other Countries Handle This" at 1,515 / 12 min.

- [ ] **Step 2: Write and insert `immigration.html` blocks**

This page's hard vocabulary is the subject itself — `immigration` appears 58 times, plus `nationality`, `naturalization`, `enforcement`, `persecution`. The block is exactly where those become plain: "becoming a citizen" rather than "naturalization." That substitution belongs in the block only; the section's own prose keeps the real term, which is what the `.term` tooltips are for.

- [ ] **Step 3: Write and insert `gun-violence.html` blocks**

Two constraints bind hardest here:
- The page opens on lockdown-drill content and carries a content warning. Blocks must not undercut it or introduce the topic more casually than the page does.
- Contested present-day questions use `.perspective` with named, sourced, equally-weighted sides. A block summarising such a section reports that there are two positions and names them — it never picks one, and never implies a consensus the section does not state.

For the two longest sections, the `.br-time` value is doing real work: it is what tells a student assigned "section 4" that they drew a 15-minute passage.

- [ ] **Step 4: Verify both pages**

Run:
```bash
python3 tools/verify_invariants.py HEAD immigration.html gun-violence.html
python3 - <<'PY'
import re
for path, want in (("immigration.html", 8), ("gun-violence.html", 8)):
    s = open(path, encoding="utf-8").read()
    blocks = re.findall(r'<aside class="before-read".*?</aside>', s, flags=re.S)
    assert len(blocks) == want, f"{path}: expected {want}, found {len(blocks)}"
    for i in re.findall(r'aria-labelledby="([^"]+)"', s):
        assert s.count(f'id="{i}"') == 1, f"{path}: {i} not unique"
    for b in blocks:
        assert "cite-inline" not in b
        low = b.lower()
        for bad in ("this page", "this section", "currently", "right now"):
            assert bad not in low, f"{path}: block contains '{bad}'"
        body = " ".join(re.sub(r'<[^>]+>', ' ', p)
                        for p in re.findall(r'<p>(.*?)</p>', b, flags=re.S))
        n = len(re.findall(r"[A-Za-z][A-Za-z'-]*", body))
        assert 20 <= n <= 75, f"{path}: block body {n} words"
    for href in re.findall(r'class="br-first">.*?href="#([^"]+)"', s, flags=re.S):
        assert f'id="{href}"' in s, f"{path}: br-first missing #{href}"
    print(f"OK {path}: {len(blocks)} blocks valid")
PY
```
Expected: `OK: all invariants hold`, then a valid line per page. `cite-inline` must read 79 for immigration and 90 for gun-violence, unchanged.

- [ ] **Step 5: Commit**

```bash
git add immigration.html gun-violence.html
git commit -m "feat: add Before you read blocks to immigration and gun-violence (16 sections)

The two densest pages (FK 9.8 and 9.9), taken last so the component and voice
were settled first. Their hard words are the subject itself -- immigration
appears 58 times, alongside legislature and congressional -- so the blocks are
where those become plain language while the sections keep the real terms.

gun-violence blocks summarising a .perspective section name both positions and
pick neither, and none of them soften the page's content warning. Citation
counts unchanged: immigration 79, gun-violence 90."
```

---

## Task 9: Voice documentation and release

**Files:**
- Modify: `docs/VOICE.md`, `VERSION`, `CHANGELOG.md`

**Interfaces:**
- Consumes: the finished blocks from Tasks 3–8.
- Produces: the standing rule that makes future topic pages ship with blocks by default.

- [ ] **Step 1: Add a "Before you read" section to `docs/VOICE.md`**

Append after the "Facts stay facts" section:

```markdown
## "Before you read" blocks

Every substantive section opens with one. Navigational sections (videos, sources, Key People) and anything under 150 words do not get one.

- **2–3 sentences, 35–60 words.** A spine, not a preview.
- **Only what the section already says.** No new facts, no new numbers, no citations. If a claim is worth making in the block, it is already made and cited below.
- **This is where plain words live.** The section keeps "naturalization"; the block says "becoming a citizen." Jargon still belongs in a `.term` tooltip, not a parenthetical.
- **Story-first, same as everything else.** "Congress writes the laws," not "This section explains how Congress writes laws."
- **Dated updates get their date in the block too.** Never "currently."
- **A contested question stays contested.** If the section uses `.perspective`, the block names both positions and picks neither.
- **`.br-first` only where a section genuinely depends on an earlier one.** Most sections do not.
- **The time comes from `tools/reading_time.py`,** never from a guess. Re-run it after a content refresh and update any `.br-time` that moved.
```

- [ ] **Step 2: Bump the version**

Run: `printf '3.4.0' > VERSION`
Minor: a new section type across every page, no new topic page and no structural overhaul.

- [ ] **Step 3: Write the `CHANGELOG.md` entry**

Insert above the `## [3.3.0]` heading. Follow the house style — what changed, why, and what went wrong or was corrected along the way. Cover: 56 blocks across 8 pages; corrected homepage times with gun-violence 25–45 → 70–80; the two measurement findings that reshaped the work (reading level is largely a topic effect, and the story-first rewrite did not move FK); and that both scripts are checked in so the figures stay reproducible.

- [ ] **Step 4: Full-site verification**

Run:
```bash
python3 tools/verify_invariants.py b2a76a3
python3 - <<'PY'
import glob, re
total = 0
for path in sorted(glob.glob("*.html")):
    if path == "index.html":
        continue
    s = open(path, encoding="utf-8").read()
    blocks = re.findall(r'<aside class="before-read".*?</aside>', s, flags=re.S)
    total += len(blocks)
    for i in re.findall(r'aria-labelledby="([^"]+)"', s):
        assert s.count(f'id="{i}"') == 1, f"{path}: {i} not unique"
    for href in re.findall(r'class="br-first">.*?href="#([^"]+)"', s, flags=re.S):
        assert f'id="{href}"' in s, f"{path}: br-first missing #{href}"
    print(f"  {path:<22} {len(blocks)} blocks")
assert total == 56, f"expected 56 blocks site-wide, found {total}"
print(f"OK: {total} blocks across 8 pages")
PY
```
Expected: `OK: all invariants hold` against the pre-work baseline, then `OK: 56 blocks across 8 pages`.

- [ ] **Step 5: Confirm every `.br-time` still matches the corpus**

Run:
```bash
python3 - <<'PY'
import csv, io, re, subprocess
rows = list(csv.DictReader(io.StringIO(
    subprocess.run(["python3", "tools/reading_time.py"],
                   capture_output=True, text=True).stdout)))
by_section = {(r["page"], r["section_id"]): r["minutes"]
              for r in rows if r["section_id"] != "TOTAL"}
bad = []
for page in {r["page"] for r in rows}:
    s = open(page, encoding="utf-8").read()
    for m in re.finditer(
            r'aria-labelledby="br-([^"]+)".*?class="br-time">(\d+) min', s, flags=re.S):
        sid, shown = m.group(1), m.group(2)
        want = by_section.get((page, sid))
        if want and want != shown:
            bad.append(f"{page}#{sid}: shows {shown} min, measures {want}")
print("\n".join(bad) if bad else "OK: every br-time matches the measured corpus")
assert not bad
PY
```
Expected: `OK: every br-time matches the measured corpus`

- [ ] **Step 6: Preview the whole site**

Run: `python3 -m http.server 8000`
Walk all 8 pages at 320px and at desktop width, with the dyslexic toggle on and text size at XL. Confirm: no horizontal scroll, blocks reflow, tooltips still open on tap (v3.3.0), and no block visually collides with a `.callout` or `.update-box`.

- [ ] **Step 7: Commit**

```bash
git add docs/VOICE.md VERSION CHANGELOG.md
git commit -m "docs: document Before you read blocks; release v3.4.0

VOICE.md now carries the rule, so future topic pages ship with blocks rather
than getting them retrofitted. Verified site-wide: 56 blocks across 8 pages,
every br-time matching tools/reading_time.py, and all structural invariants
unchanged against b2a76a3 -- the pre-scaffolding baseline."
```

---

## Self-Review

**Spec coverage.** Every spec section maps to a task: the component and its content rules → Tasks 2–3; the 56-block scope table → Tasks 3, 5, 6, 7, 8 (6+4+11+19+16 = 56); length honesty → Task 4; per-section times → the `.br-time` in every block plus Task 9 Step 5; rollout order (us-elections → space-race → ascending length → gun-violence) → task order; verification list → the check in each task plus Task 9; `docs/VOICE.md` → Task 9 Step 1.

**Deliberately deferred, matching the spec:** splitting `gun-violence.html`, and converting dense prose into `.stat-trio` / `.tl-item` components. The conversion is a content edit that moves cited claims between elements; doing it in the same pass as 56 new blocks would make a citation regression hard to localise. It should be its own plan once the blocks are live.

**Type consistency.** Class names are identical across all tasks: `.before-read`, `.br-head`, `.br-time`, `.br-first`, and `.tag` (existing). The id convention is `br-<section-id>` everywhere, carried on the inner `.tag` span with `aria-labelledby` on the `<aside>`. `reading_time.py` emits the `minutes` column that every `.br-time` is drawn from; `verify_invariants.py` takes `<git-ref> [file...]` in that order in all seven invocations.

**Known plan risk.** Tasks 5–8 cannot spell out block copy in advance the way Task 3 does, because each block must restate a specific section the writer has to read first. That is a genuine constraint, not a placeholder: the structure, the id convention, the length bounds, the time source, and the automated checks are all fully specified, and each of those tasks begins with an explicit "read the section before writing the block" step.

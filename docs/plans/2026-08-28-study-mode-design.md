# Study Mode — Design Document

**Date:** August 28, 2026
**Type:** New site-wide feature (runtime layer over all 8 topic pages)
**Files:** `site.js`, `site.css` (shared); `iran.html`, `space-race.html` (gloss backfill); all 8 topic pages (one button in the a11y cluster)

---

## Concept

A fourth control in the existing accessibility cluster, labelled **Study Mode**, that adds
reading support around the existing text without changing a word of it.

The request that produced this was "make the readings more accessible and engaging for lower
readers." The obvious build for that request — press a button, get shorter sentences and
simpler words — is the one thing this site must not ship. `A1` in the reading-intervention
catalogue classifies a text swap as a **modification disguised as an accommodation**: it hands
lower readers a thinner page while telling them it is the same lesson. Davison & Kantor (1982)
is the standing demonstration of the mechanism — shortening a sentence is usually accomplished
by deleting the connective that carried the meaning, so the readability score improves while
comprehension gets worse, for precisely the students the button was built for.

**Every element of this design is therefore additive.** Study Mode adds glosses, adds a
persistent section frame, and removes nothing. The page's vocabulary, causal connectives, and
concept count are byte-identical in both states, which is a property the `G6`
ceiling-preservation diff can mechanically verify rather than a promise in a document.

### The naming decision

The control says **Study Mode**, not "Simplified," "Easier," or "Reading Support." A control
that reads as remedial does not get pressed in a room full of peers, and the students who most
need it are the most sensitive to that. "Study Mode" is aspirational — strong readers turn it
on too, and that is exactly what removes the stigma. This is a design requirement, not a
copywriting preference: a correctly-built feature that nobody presses has failed.

### What this design deliberately does not do

- **No text swap, no parallel simplified version.** See above.
- **No read-aloud / TTS.** Deferred to v2. It is the right answer to a real gap (`A2`: every
  support on this site is meaning-side, while roughly 6 in 10 struggling adolescent readers
  also have word-level difficulty), but it is a separate subsystem with its own design.
- **No changes to the dyslexia-font toggle.** `do-not-recommend.md` records that
  dyslexia-specific fonts have no demonstrated comprehension benefit over a good plain font,
  and OpenDyslexic is currently the most prominent control in this cluster. Removing it is a
  separate decision for the project owner, out of scope here. Noted so it is not rediscovered
  as a finding later.

---

## Architecture

Three parts. Only one of them needs JavaScript.

### 1. State — matches the existing a11y pattern exactly

```
body.study-mode           CSS hook
localStorage.studyMode    'on' | 'off'    (mirrors the existing dyslexicFont key)
[data-sm-injected]        marks every node the injector created
```

Restored in `initA11y()` on every page load, so the setting follows a student across the site
the way text size and the dyslexia font already do. No new dependencies: `site.js` and
`site.css` are already loaded on all 8 pages.

One deliberate difference from its three neighbours. Text size and the font toggle are pure
presentation and can flip instantly. Study Mode injects DOM, so it runs once on toggle and once
on load, guarded by `data-sm-injected` so a double-fire cannot duplicate a gloss.

### 2. The gloss layer

Two gloss mechanisms exist on this site, applied inconsistently across pages:

| page | `.term` (inline) | Key Word box | sections |
|---|---|---|---|
| `gun-violence` | 18 | 0 | 10 |
| `immigration` | 16 | 9 | 10 |
| `ukraine` | 12 | 14 | 11 |
| `ai` | 11 | 15 | 10 |
| `climate-change` | 6 | 4 | 10 |
| `iran` | 2 | 3 | 9 |
| `space-race` | 2 | 3 | 8 |
| `us-elections` | 0 | 9 | 8 |

`V4` is explicit that a same-sentence gloss passes and a separated box is a finding. So
`gun-violence` does this the evidence-aligned way, `us-elections` does it the weaker way, and
most pages mix the two at random. **Study Mode is the fix, applied at runtime.**

**`.term` glosses require no JavaScript.** Each `.term` is already followed *immediately, in the
same sentence* by a `<span class="term-desc">` holding the same text, `sr-only`-hidden and wired
to the term's `aria-describedby`. Study Mode simply un-hides it:

```css
body.study-mode .term-desc{
  position:static; width:auto; height:auto; clip:auto;
  margin:0; overflow:visible;
  font-size:.86em; color:var(--ink-light);
}
body.study-mode .term-desc::before{ content:" — "; }
body.study-mode .term::after,
body.study-mode .term::before{ display:none; }   /* suppress now-redundant tooltip */
```

The definition is already in the right place; it was only ever hidden. Zero DOM risk and no
accessibility regression, because screen readers were already reading it.

**Key Word boxes are the only JavaScript.** For each `.vocab`, read its `<b>Key Word: X</b>` and
its `<p>` definition, find X's first occurrence in the containing section's prose, and inject a
sibling gloss span. The box itself does not move and is not rewritten.

The injector's hard rules:

1. **Never descend into `blockquote`, `q`, `cite`, or any `SRC` span.** `S2` makes an in-quote
   insertion BLOCKING. An automated gloss injector is exactly the tool that would drop a
   parenthetical inside a primary source. Where a term's only occurrence is inside a quote, the
   gloss renders beside the quotation instead, as a `<p class="sm-gloss-aside">` inserted as a
   *following sibling* of the `blockquote` — scaffolding goes *around* a source, never inside
   it.
2. **Never inject into a heading**, a `.cite-inline`, or the `.vocab` box it came from.
3. **No match is not an error.** Leave the box exactly as it is and move on.
4. **Idempotent.** Guarded by `data-sm-injected`; toggle-off removes exactly those nodes and
   nothing else.

Matching is case-insensitive on word boundaries, with a single simple-plural fallback.
Deliberately not fuzzy: a wrong match injects a definition next to the wrong word, which is
worse than no gloss.

**Useful side effect.** A Key Word box whose term never appears in its section's prose is
exactly `V5`'s orphan-gloss defect. The injector's no-match list is therefore a free `V5` audit,
and should be logged to the console in a debug flag rather than discarded. `us-elections`
already has at least one ("Key Word: Midterm Penalty," a concept label that appears nowhere in
the prose).

### 3. The section bar

Ten sticky primers would eat mobile viewport, and `body{overflow-x:hidden}` is set on every page
— the classic `position:sticky` breaker. So instead: **one fixed slim bar**.

An `IntersectionObserver` watches the `.sec-head` elements (all of which carry stable `id`s) and
shows the current section's primer, trimmed to its first sentence. Tap expands to the full
primer. `position:fixed` is unaffected by the `overflow-x` problem.

```
┌──────────────────────────────────────────────────┐
│ Elections  ·  Only one branch is filled by a      │
│               straight vote.                    ⌄ │
└──────────────────────────────────────────────────┘
```

The label on the left is the `.sec-head`'s own heading text, truncated — **not** a section
number. Sections carry stable `id`s but no numbering the bar could rely on, and inventing one
would disagree with the "Section 1 / Section 2" cross-references already written into the prose.

Content is cloned from the existing `.before-read` aside, whose structure is uniform across all
8 pages:

```html
<aside class="before-read" aria-labelledby="br-branches">
  <p class="br-head"><span class="tag">Before you read</span><span class="br-time">3 min</span></p>
  <p>Congress writes the laws. The president carries them out. …</p>
</aside>
```

The bar takes the first `<p>` that is not `.br-head`, then its first sentence. Some primers end
with a `First: <link>` pointer to a prerequisite section; the bar must take the first sentence
of the first content paragraph, which is never that pointer, and must strip any trailing anchor.
Nothing new is written: these primers already exist on all 8 pages and already measure below the reading level
of the page they sit on. A section with no primer shows no bar.

---

## Content work: gloss backfill

`iran` and `space-race` carry 5 glosses each across 9 and 8 sections. Study Mode would visibly
do almost nothing there, which teaches students the button is not worth pressing — a product
failure that would undermine the feature everywhere.

Backfill roughly 10–12 new `.term` glosses across those two pages, authored as ordinary `.term`
markup with the `data-def` / `aria-describedby` / `.term-desc` triple. They then light up
through the CSS path automatically **and** improve the page with Study Mode off.

Gloss authoring follows `V3`: no dictionary syntax ("the act or process of…"), no circularity
(the gloss must not contain the target's own stem), and an anchor to how the word is used in
this passage. Per Rule E, there is no gloss-length or word-rarity limit — glossing *ratify*
using *treaty* is correct, and pushing glosses toward baby language is the failure this whole
effort exists to prevent.

---

## Error handling

| Situation | Behaviour |
|---|---|
| `localStorage` unavailable (private mode) | Feature works for the session; persistence silently skipped. Never throws. |
| Page has no `.vocab` boxes | Injector returns early. CSS path still works. |
| Page has no `.before-read` primers | No section bar. Gloss layer unaffected. |
| Key Word term not found in prose | Box left untouched; logged to the `V5` orphan list. |
| Term found only inside a quotation | Margin gloss beside the quote. Never injected inside it. |
| `IntersectionObserver` unsupported | Bar is not created. Glosses still work. Progressive enhancement throughout. |
| Toggled twice rapidly | `data-sm-injected` guard makes the second call a no-op. |
| `?study=` carries a junk value | Ignored; falls back to the stored value. Never throws. |
| `?study=on` but student toggles off | Their toggle wins and persists. The parameter sets a starting state, never a lock. |

Every failure mode degrades to "less support," never to a broken page and never to a modified
one.

---

## Testing and verification

1. **`G6` ceiling-preservation diff** on `iran.html` and `space-race.html` before/after the
   backfill. Must return `pattern: elaboration` with `terms_lost: []`. This is the gate that
   proves the feature added support without removing content.
2. **`SRC`-span regression test.** Run the injector against `immigration.html` — the page with
   the most quoted material, including the attributed DHS statement — and assert zero injected
   nodes have a `blockquote` / `q` / `cite` ancestor. This is the test that keeps the feature
   from becoming an `S2` BLOCKING violation.
3. **Idempotency.** Toggle on → off → on; assert the DOM is byte-identical to a single toggle-on,
   and that toggle-off restores the original DOM exactly.
4. **Round-trip on all 8 pages.** No JS console errors; `node --check` on any modified script;
   existing quiz, points, easter-egg, and `.term` tap behaviour unaffected.
5. **Reading-level invariance.** `locate.py` FK on each page must be unchanged by the *feature*
   (it operates at runtime; only the backfill moves the number, and only upward or flat).
6. **Existing regression suite.** `tools/reading_time.py` and `tools/verify_invariants.py` after
   any content change, per the v3.4.0 convention.

---

## Entry via URL — `?study=on`

**Approved for v1.** A Canvas assignment link can carry `?study=on`, so a student arrives with
Study Mode already active rather than having to know the button exists.

```
initA11y():
  urlParam = new URLSearchParams(location.search).get('study')
  if urlParam is 'on' or 'off'   → use it, and write it to localStorage
  else                            → fall back to localStorage.studyMode
  else                            → off
```

An explicit `?study=on` wins over the stored value and persists, so the setting carries to the
next page the student visits without the parameter.

`?study=off` is deliberately **not** persisted — it applies to the page it is on and nothing
further. A persisting `off` would silently clear a student's saved Study Mode the moment they
opened one assessment link, stripping an accommodation they had chosen, with no signal that it
happened. That is exactly the harm the "starting state, never a lock" principle exists to
prevent. The cost is small and the right way round: a teacher who wants Study Mode off across a
multi-page assessment puts `?study=off` on each link.

**The property that makes this an accommodation rather than tracking: it sets a starting state,
never a locked one.** The button remains visible and live in the a11y cluster, so a student who
arrives with Study Mode on can turn it off in one tap, and their toggle wins from then on. The
parameter is also plainly visible in the address bar. Nothing about a student's setting is
recorded, transmitted, or readable by anyone else — `localStorage` is per-browser and never
leaves the device.

Both values are accepted. `?study=off` gives a link that guarantees the unscaffolded page for
that page load regardless of what the student last chose, which is what a reading assessment
wants — without permanently changing their setting.

Anything other than `on` or `off` is ignored and the stored value is used.

---

## Scope boundary — revised

**In:** the toggle and its persistence; the CSS gloss reveal; the Key Word injector; the section
bar; the `iran` / `space-race` gloss backfill; the `?study=` URL parameter; the button added to
all 8 pages.

**Out (v2 candidates):** read-aloud / TTS with sentence highlighting and stop points (`A2` /
Rule C); a writing slot (`Q7`/`Q8` — no page has one); the uneven `.term` vs. Key Word split on
the six pages not being backfilled; the dyslexia-font question (**owner decision: leave as is**);
and the open `us-elections` items from v3.5.0.

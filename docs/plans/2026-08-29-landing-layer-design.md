# Landing Layer — design

**Date:** 2026-08-29
**Status:** approved in brainstorming; implementation plan not yet written
**Target release:** 3.8.0 (minor — additive feature)
**Prototype topic:** `climate-change.html`

---

## 1. The problem, measured

The site's stated mission is a quick, engaging, accessible primer on an issue in
the news — 5–7 minutes of engagement per topic. Measured with the repo's own
`tools/reading_time.py` (130 wpm, prose inside `<p>` only), no page is close:

| Page | Words | Reading time | vs. 5–7 min target |
|---|---|---|---|
| gun-violence | 10,033 | **77 min** | 11× |
| ai | 6,177 | 48 min | 7× |
| immigration | 6,157 | 47 min | 7× |
| ukraine | 4,860 | 37 min | 5× |
| iran | 3,805 | 29 min | 4× |
| us-elections | 3,763 | 29 min | 4× |
| climate-change | 2,306 | 18 min | 3× |
| space-race | 2,181 | 17 min | 2.5× |

A single section of gun-violence ("School Safety Measures That Have Been Tried",
2,025 words / 16 min) is longer than the entire intended experience for the topic.

Length is only half the diagnosis. The whole interactive surface across eight
pages is 59 quizzes (`.quiz-inline` is one button opening a modal, placed *after*
a long prose run), plus timelines, videos, and `before-read` primers. Every one
of those is a **reading support** — apparatus that helps a student get *through*
prose. There are zero elements that teach by doing.

The drift: successive releases optimized the reading experience (Study Mode,
inline glosses, primers, reading-level work — all good craft) instead of
questioning whether reading should be the primary mode.

---

## 2. Decisions taken

Recorded so a later reader knows these were chosen, not defaulted into.

| # | Decision | Rationale |
|---|---|---|
| D1 | **Centerpiece mode varies by topic**, inside a fixed shell | Each topic has a different natural mode; a single template would force the wrong one. Bounded by the shell/centerpiece location rule (§5). |
| D2 | **One file per topic; deep sections unfold in place** | Preserves existing `#ids`, section-nav, Study Mode, Cmd-F, print, and all three verification tools. A chapter-page split would break all of them. |
| D3 | **Ordered, never blocked** | The prominent CTA always points at the next unopened section, but every `<summary>` and every nav link opens anything instantly. No gating. |
| D4 | **Landing prose is newly written**, not promoted from existing sections | Existing ledes were written as chapter openings and do not stand alone. |
| D5 | **Prototype on climate-change**, then roll out | Closest to target, already the editorial-redesign flagship, and its content contains the strongest natural centerpiece. |
| D6 | **Learning target (G3):** *"Explain how scientists know what Earth's climate was like before anyone was measuring it, and how that evidence shows current warming differs from past natural change."* | Epistemology-first. The Ice Core Drill *is* the target, so Q1 can pass honestly rather than by tuning. |

---

## 3. The guardrail collision, and why this design survives it

`reading-intervention/references/guardrails.md` Rule A forbids any
recommendation whose whole content is "make this shorter" or "make this
simpler." Rule B withholds any remedy that reduces word count without naming a
specific comprehension repair. The evidence: Beck, McKeown, Sinatra & Loxterman
(1991) revised social studies text for comprehensibility and the result was
**longer**; Davison & Kantor (1982) showed formula-driven shortening produces
*harder* text, because shortening a sentence usually deletes the connective
that carried the meaning.

Read naively, that refuses this entire initiative.

It does not, because of D2. Deep sections unfold in place and **nothing is
deleted**. The landing layer is a new sibling document, not a reduction of an
existing one. Under G6 (ceiling preservation) `terms_lost = 0`: all 2,306 words
of climate-change remain on the page, in their current order, with their
existing `data-def` glosses intact.

**The 5–7 minutes is a property of the entry point, not a ceiling on the topic.**

Had the design chosen "landing page + trim the article," or promoted-and-trimmed
prose, it would have been textbook leveling-down. This is the same position the
project already took publicly in the 3.7.0 changelog, where Study Mode was built
as a toggle rather than a "simplify" button, citing Davison & Kantor by name.

### Rules that bind the content

- **Rule A / bands.md — FK band is 6.51–10.34, and *below* band is the alarm
  that matters.** Landing prose must not drift low. "Accessible" must not become
  "dumbed down." Computed on scaffold spans only; implementation pinned to
  `locate.py v1` and never compared against another tool's number.
- **Rule C — no fixed-length chunking.** An earlier draft of this design
  proposed "an interactive beat every 2 minutes." That is withdrawn: it is a
  chunk-length rule, which Rule C prohibits against narrative prose and
  `bands.md` lists among deleted measures. Interactive beats go where the
  content has a natural turn; the count per page is whatever the topic wants.
- **Rule D — load-bearing term count prints with "Do not remove terms to lower
  this number."** The 5–8 pre-teach cap governs the lesson, never the passage.
- **Rule F — no percentages on the page.** Print lists, never rates.
- **Rule G — two grammars on one page.** Primer prose is `NARR`: compound
  sentences and the word *because* are wanted. Scored quiz/game items are
  `TASK`: Smarter Balanced fairness grammar. Applying the fairness rules to the
  primer would reproduce the Davison & Kantor failure by way of an equity
  document.
- **Mean sentence length is not a metric here.** Concrete hooks and punchy
  openings remain a house style preference; `bands.md` deletes sentence length
  as a measure ("Flesch-Kincaid wearing a different name"), so no tooling check
  may enforce it.

---

## 4. The landing layer

Always visible. Never wrapped in a disclosure element.

| Element | Budget | Notes |
|---|---|---|
| Hook headline + hero image | — | Concrete, not categorical. "Ice Remembers the Air", not "Understanding Climate Change" |
| Orientation — the issue in four sentences | ~90 w | Standalone; a student who reads only this has the gist |
| **Interactive centerpiece** | — | Carries an explanation prose would otherwise spend ~300 words on |
| Spine prose — 3 beats at natural turns | ~450 w | `NARR` grammar; causal connectives protected; terms glossed in place |
| Where things stand — dated snapshot | ~120 w | Reuses the existing dated-update pattern |
| Unfold CTA | — | "Keep going — Deep-Time Climate History (3 min)" |

**Total ≈ 660 words ≈ 5 min at 130 wpm.** That sits inside NAEP's grade-8
passage spec of 400–1,000 words (*2019 NAEP Reading Framework*, Exhibit 5,
p.31), so the budget is a citable convention rather than an author preference.

Read-time figures are reported as a **floor on time, not a prediction** —
rates are lower for children, older adults, and second-language readers.

---

## 5. Unfold mechanics, and the shell/centerpiece line

### Finding that sets the rule

`openQuiz` is copy-pasted into all eight topic pages. Each carries 7–13KB of
inline JS and 19–29KB of inline CSS (`climate-change.html`: 7,457 chars / 167
lines; `gun-violence.html`: 13,241 chars / 209 lines). The repo already has the
right structure — `site.css`, `site.js`, `study-mode.js` are shared — but the
quiz engine drifted into eight private copies.

**The location rule, which is also what bounds D1:** anything every topic has
goes in `site.js` / `site.css`. Only what is genuinely unique to one topic may
live inline. A centerpiece that starts wanting shared helpers is telling you it
belongs in the shell.

### Substrate: native `<details>`

```
[ LANDING — always visible, all-new content ]
  hero · orientation · centerpiece · spine · where things stand (~120 w)
  ┌────────────────────────────────────────┐
  │ Keep going — Where Things Stand  4 min │   ← the one prominent CTA
  └────────────────────────────────────────┘

<details class="unfold" data-order="1">   Where Things Stand          465 w
<details class="unfold" data-order="2">   Deep-Time Climate History   402 w
<details class="unfold" data-order="3">   The Greenhouse Effect       279 w
<details class="unfold" data-order="4">   What's Different This Time  197 w
<details class="unfold" data-order="5">   Effects Being Observed      204 w
<details class="unfold" data-order="6">   Washington's Climate Story  409 w
<details class="unfold" data-order="7">   How Did We Learn All This?  126 w

[ END MATTER — always visible, never wrapped ]
  Key People · Videos · Dig Deeper
```

### What gets wrapped, and what does not

Membership is not an editorial judgement — it is already encoded in
`tools/reading_time.py`'s `SKIP_TITLE` regex, which exists to exclude
navigational end-matter from primer blocks. The same rule governs the unfold:

- **Wrapped** — every section `SKIP_TITLE` does *not* match. For
  `climate-change.html` that is 7 sections, listed above, in their existing
  order with their existing `#ids`.
- **Not wrapped** — sections `SKIP_TITLE` matches (Key People, Videos, Dig
  Deeper). These are page furniture a student browses, not prose a student
  reads; collapsing them would hide the sources behind a click.
- **Not wrapped** — the `eggTitle` easter egg, which has its own reveal
  mechanism and no section title.

Reusing `SKIP_TITLE` means the rule cannot drift between the reading-time
figures on the page and the sections the unfold actually manages.

**Note on the landing's "Where things stand".** The ~120-word dated snapshot in
the landing layer is newly written (D4). The existing 465-word `#update`
section is *not* absorbed into it — it survives intact as unfold section 1.
The landing gives the current state in four sentences; the deep section gives
it in full.

| Requirement | How it is met |
|---|---|
| Works with zero JS | `<details>` is native disclosure. No JS → every section is an expandable accordion. JS only adds ordering. |
| Cmd-F finds deep content | Chrome and Firefox auto-expand closed `<details>` on find-in-page. Where unsupported, content is still in the DOM. |
| Deep links work | Shell JS forces the matching `<details open>` on load and on `hashchange`, so `#wa-story` and every section-nav link resolve as today. |
| Teachers can print | Print stylesheet forces all `<details>` open. One rule, no JS. |
| Study Mode still applies | It walks the DOM; collapsed content is present, so glosses inject normally. |

**Ordering layer** (shell JS, ~40 lines): exactly one "Keep going → *title*
(N min)" CTA is prominent at a time, pointing at the lowest-numbered unopened
section. Opening one advances it. Progress persists in `localStorage`, matching
the existing `dyslexicFont` / `textSize` convention in `site.js`. Every
`<summary>` stays clickable in any order (D3).

Section minutes on each `<summary>` come from `tools/reading_time.py`, the same
source that generates today's `.br-time` values.

### Quiz de-duplication — deferred, deliberately

An earlier draft put the eight-way `openQuiz` de-duplication in this release.
Withdrawn: it touches all eight pages before the prototype has proven anything,
and two global `openQuiz` definitions would collide mid-migration.

**Revised again during implementation planning (2026-08-29), after reading the
code.** `openQuiz` is not a standalone function. It sits in a graph with
`handleAnswer`, `addPoints`, `showToast` and `closeQuiz`, over shared
`pts` / `MAX_PTS` / `answeredQuizzes` state and per-page unlock copy
("Climate Detective") — roughly 75 lines, of which only the `quizzes` object is
genuinely per-page content. Extracting it needs a real config seam
(`Quiz.init({quizzes, maxPoints, unlockLabel})`), not a function move.

**The entire quiz extraction is therefore deferred to the rollout** (§10). It is
a moderate-risk refactor of a working points system, it delivers nothing
user-visible in 3.8.0, and the "no flag day" property that motivated doing one
page now is satisfied equally by doing all eight at once later. 3.8.0 leaves
every page's quiz code exactly as it is.

The location rule still stands and still bounds D1 — it simply gets applied to
the unfold shell in this release, and to the quiz engine in the next.

---

## 6. The centerpiece contract

### The rule that makes Q1 pass by construction

> **The interactive supplies the observation. The prose supplies the significance.**

Neither is complete alone. The Ice Core Drill shows that air from 1850 held
280ppm and today's holds 425; it cannot convey why 425 differs from every other
rise in the record. The prose cannot make a student feel the depth of 800,000
years. Built to that split, the passage-independence probe passes because the
halves genuinely need each other — not because the questions were tuned.

The failure mode this rules out: an interactive that restates a fact the prose
already stated. That is decoration.

### Six binding requirements

1. **Models a mechanism, never a verdict.**
2. **Honest under abuse.** A student who tries to break it hits real
   constraints. Inputs are clamped to the range the underlying data supports;
   we do not simulate physics we have not verified.
3. **A conclusion inside ~60 seconds, with replay value.**
4. **Keyboard-operable and screen-reader-narratable.** Every drag has arrow-key
   equivalents plus a live text readout of current state ("Depth 1,850 m ·
   128,000 years ago · 190 ppm"). That readout is also the no-JS caption, so
   the accessibility path and the fallback are the same content.
5. **Degrades to a static figure without JS**, captioned with the same takeaway.
6. **Every number sourced and dated** — fetched and read at source, not merely
   confirmed to return HTTP 200.

### Nonpartisanship, stated for interactives

- **A quiz may score facts. A game may never score a position.** No "build your
  ideal policy, here's your grade."
- On contested topics the interactive models the **constraint structure** —
  what the statute says, what the research measured, what geography forces —
  never a preference engine with a scoreboard.
- Where research is genuinely mixed, showing *that it is mixed*, with effect
  sizes and what went unstudied, is the honest interactive.

### Centerpiece per topic — illustrative, bounding D1

Only climate-change is built in 3.8.0. The rest are recorded to show the shell
holds them and the range is finite.

| Topic | Centerpiece | Mechanism taught |
|---|---|---|
| **climate-change** | **Ice Core Drill** — drag through a scaled ice column, read trapped-air CO₂ by depth | *How we know* — the measurement itself |
| ai | Train a Classifier — label ~10 examples, watch it succeed then fail on what you did not teach it | Learning from examples; where bias enters |
| space-race | Orbit or Crash — set angle and burn | Orbit is falling sideways fast enough to miss |
| immigration | The Line — pick a profile, walk the actual visa pathway with real caps | Why "just get in line" is a category error |
| us-elections | Electoral Math — allocate real EV counts, no party colors | Why votes weigh differently by state |
| iran | Chokepoint — route tankers through Hormuz | 21 miles, ~20% of world oil |
| gun-violence | Rates & Denominators — compare across countries and time, toggle per-capita vs. absolute | Why the denominator changes the story |
| ukraine | Control Over Time — dated, sourced map slider | Territory as a record, not an argument |

---

## 7. Build sequence and gates

Each gate must pass before the next step begins.

| # | Step | Gate |
|---|---|---|
| 0 | **Baseline.** Capture `verify_invariants.py HEAD` and `reading_time.py` output before any edit | Baseline recorded — the ceiling later steps are measured against |
| 1 | **The shell.** `Unfold` in `site.js` (dual-mode export, matching `study-mode.js`), `.unfold` + CTA + print CSS in `site.css`, `tools/unfold.test.js` | `node --test tools/` green; `climate-change.html` **with JS disabled** still shows every section |
| 2 | **Landing prose.** ~660 new words; `reading-intervention --scaffold` pass | FK inside 6.51–10.34 and **not below**; landing ≤ 7 min per `reading_time.py`, not per author estimate |
| 3 | **Ice Core Drill.** Inline in `climate-change.html`; EPICA/Vostok + Mauna Loa data | Fully keyboard-operable with live readout; static figure without JS; every figure fetched and read at source |
| 4 | **Wire the unfold.** Wrap the 7 reading sections (§5) | `verify_invariants.py HEAD` reports **zero deletions** — the ceiling-preservation proof; deep links, print, Study Mode, and Cmd-F all still work |
| 5 | **Q1 probe.** Separate agent, passage withheld, carrying only the questions + D6's target (**approved by the teacher 2026-08-29**) | Primer items are passage-dependent; centerpiece and prose are mutually required |
| 6 | **Stress-test on paper.** Check the pattern against gun-violence's 11 sections | Pattern does not collapse at 11 sections. Design review only; nothing built |
| 7 | **Ship.** `VERSION` → 3.8.0; CHANGELOG entry in house style (the *why*, not just the what) | — |

Gate 4 is the load-bearing one: `verify_invariants.py` diffing the working tree
against `HEAD` and reporting zero deletions is mechanical proof that the
restructure did not level down. It converts §3's central rule from a principle
into a command that fails loudly.

Gate 1's no-JS check runs *before* the centerpiece exists, deliberately. Testing
it afterward would let a regression hide behind "the interactive needs JS anyway."

---

## 8. Files changed

| File | Change |
|---|---|
| `unfold-logic.js` | **new** root-level module — pure ordering functions, dual-mode export so `node --test` can exercise them headlessly (the split `study-mode.js` established) |
| `site.js` | **new** `initUnfold()` — DOM wiring, deep-link forcing, `localStorage` progress |
| `site.css` | `.unfold` / `<summary>` styling, "Keep going" CTA, print rules |
| `climate-change.html` | Landing layer (new prose + Ice Core Drill); 7 reading sections wrapped in `<details>` |
| `tools/unfold.test.js` | **new** — ordering logic under `node --test` |
| `tools/reading_time.py` | Extend to assert the landing layer stays ≤ 7 min |
| `VERSION`, `CHANGELOG.md` | → `3.8.0` |
| `AGENTS.md` | One-line fix: it states "no tests configured", untrue since `tools/study-mode.test.js` landed |

---

## 9. Open items and degraded checks

`~/.claude/skills/reading-intervention/reader-profile.md` ships blank in every
field. Per Step 1 of that skill, the gap is named here rather than invented.

**Answerable now (curriculum-derived, not roster-derived):**

- **Prior-units index.** To reduce this to a sorting task, the load-bearing
  terms the climate landing prose will lean on are pre-listed for the teacher to
  move across the taught / not-yet-taught line: *greenhouse effect, isotope,
  proxy record, parts per million, Industrial Revolution, feedback loop, ice
  core, atmosphere*.
- Course / grade, sections.

**Deferred until section rosters are final** (it is 2026-08-29; the skill
forbids inventing a profile to close the gap):

| Blank field | Checks degraded |
|---|---|
| WIDA levels | Family V findings cannot be routed to the population they matter for |
| Comprehension-goal vs. decoding-goal IEP split | K- and V-family findings route identically for two populations needing opposite things — a decoding-goal student needs the *words* made accessible; a comprehension-goal student needs the *concept* supplied. Until set, the prose is written for both at once |
| Reading range / median | Band placement still prints, but with no class context to sit against |

Until the prior-units index above is filled, Family K (assumed knowledge) also
runs at `NOTE` rather than `FINDING`, because nothing can distinguish an
already-taught term from a genuine gap. That one is curriculum-derived, so it
is unblocked today — it is listed under "answerable now" rather than here.

**Verification risk (T4).** Washington State and Pacific Northwest claims are
HIGH risk under the skill's tiering, and every topic page has a "Washington's
… Story" section. Any WA figure reaching the landing layer needs lateral
verification against a different domain from the passage's own stated source.

---

## 10. Out of scope for 3.8.0

- The seven remaining topic pages (rollout follows, once the prototype validates)
- Centerpieces for any topic but climate-change
- **Any quiz-engine change at all** (§5). All eight pages keep their inline copies; the extraction, its config seam, and the de-duplication happen together in the rollout.
- Any change to existing deep-section prose. It moves inside a `<details>`
  wrapper and is otherwise untouched — that is what Gate 4 proves.

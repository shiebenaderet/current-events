# MEMORY.md — Working Instructions for `current-events`

Operating guide for editing this repo. Companion to three files that already exist and take
precedence on their own turf:

- **`README.md`** — what the site is, for visitors and contributors.
- **`AGENTS.md`** — dev-environment facts: how to preview, what doesn't exist (build/lint/test).
- **`docs/VOICE.md`** — the standing story-first editorial voice. **Read before any copy edit.**

This file is the working memory around them: the traps, the invariants, and the decisions whose
reasons live in the changelog rather than the code.

**What this is:** free, student-facing explainers on the background behind current events, for
8th-grade Social Studies at Alderwood Middle School. Live at `current.mrbsocialstudies.org`
(GitHub Pages, `CNAME`). CC BY 4.0. Current version: **3.4.0**.

---

## 1. Shape of the codebase

Eight topic pages plus a hub, at the repo root. No build step, package manager, lint, or tests.

```
index.html          hub / landing page
iran.html  ukraine.html  ai.html  us-elections.html  climate-change.html
immigration.html  gun-violence.html  space-race.html
site.css  site.js     shared ACCESSIBILITY layer only (v3.0.0)
fonts/               self-hosted OpenDyslexic (SIL OFL)
images/              flat asset directory
docs/plans/          design doc + implementation plan per effort
docs/VOICE.md        editorial voice
AGENTS.md  README.md  VERSION  CHANGELOG.md  CNAME  LICENSE
```

**The sharing split is deliberate and narrow.** As of v3.0.0 the accessibility layer — skip
link, A/A/A text-size controls, dyslexic toggle, suggest-form handler — lives in `site.css` /
`site.js`. **Everything else stays inline per page:** palettes, heroes, Leaflet maps, quizzes,
points engine, easter eggs. Do not migrate page-specific CSS/JS into the shared files.

v3.3.0 adds two narrow exceptions, both *vocabulary or floors* rather than page layout:

- **`--ce-*` design tokens** in `site.css` `:root` — type, spacing, radius, motion, and the
  44px tap floor. Namespaced so they cannot collide with a page's own `--accent` / `--ink` /
  `--paper`, which stay inline and stay distinct (§5). Reach for a token when adding shared
  chrome; page components still define their own sizes inline.
- **`.term.is-open`** — `site.css` loads *after* each page's inline `<style>`, so one shared
  rule drives the tap-to-open tooltip on all eight pages without editing eight stylesheets.

Component CSS extraction (`.article`, `.quiz`, the points engine) was **considered and
rejected** in the v3.3.0 audit: it would break the one-file-per-topic model this section
protects. If that tradeoff is ever revisited, it is its own effort, not a side effect.

v3.4.0 adds a third shared exception on the same grounds: **`.before-read`** (plus its
`.on-dark` variant) in `site.css`, driving the "Before you read" entry blocks on all eight
pages. Section markup is not uniform — blocks sit after `.sec-head`, `.update-head`, or
`.focus-head` depending on the page, and the dark panes need the `.on-dark` variant. Check
the target section's own markup before adding one.

**`tools/` is now the regression suite this repo otherwise lacks.** `reading_time.py` is the
single source of truth for every minute figure on the site; `verify_invariants.py <ref>`
compares citations, term pairs, div balance, img/onerror and id uniqueness against a git ref.
Run both after any content refresh — a refresh that changes section length silently
invalidates the `.br-time` labels.

Known tradeoff, already accepted: pages are no longer standalone one-file islands. Downloading
a page for offline use now also needs `site.css`, `site.js`, and `fonts/`. The homepage teacher
download line names all four; keep it accurate if the set changes.

A "site-wide" change still means editing eight files by hand. The pages have drifted — read the
target page's own markup before adding to it rather than copying a sibling's.

---

## 2. Preview and verification

**Serve over HTTP, never `file://`.** Pages pull Leaflet, Google Fonts, and YouTube from CDNs
and use relative `images/` paths; `file://` breaks them.

```bash
python3 -m http.server 8000    # from repo root, then browse localhost:8000
```

Under restricted egress, maps/fonts/videos may not render while local content and the quiz
system still work — don't misdiagnose that as a page bug.

There is no test suite. Structural regressions are caught with grep invariants, recorded as
before/after numbers. "Looks fine" is not a result.

```bash
# citation count — must not drop on a pass that wasn't meant to touch sources
grep -c 'class="cite-inline"' PAGE.html

# div balance
grep -o '<div' PAGE.html | wc -l ; grep -o '</div>' PAGE.html | wc -l

# duplicate ids (expect no output)
grep -o 'id="[^"]*"' PAGE.html | sort | uniq -d

# every image src resolves
grep -o 'src="images/[^"]*"' PAGE.html | sed 's/src="//;s/"//' | while read f; do
  [ -f "$f" ] || echo "MISSING: $f"; done

# every img has an onerror fallback
grep -c '<img' PAGE.html ; grep -c 'onerror=' PAGE.html
```

`grep -c` counts matching *lines*, not occurrences — fine here because these tags sit one per
line, but the `grep -o … | wc -l` form is the robust one if that ever changes.

On a rewrite or reading-level pass, additionally prove **quotes, citation hrefs, and `data-def`
text are byte-identical before and after** by diffing the extracted spans.

---

## 3. Editorial rules

`docs/VOICE.md` is authoritative on voice. The load-bearing points, plus what it doesn't cover:

1. **Story-first.** The second sentence is a consequence of the first, not another unconnected
   true statement. Open on people, events, objects. Give a thing its job before its dates.
2. **Never address "the page."** Write the rule in the student's ear — "Policy, not headlines,"
   not "This page is about policy, not headlines." Functional exceptions only: content warnings,
   Konami teacher tips, "the form does not store what you type," hero nonpartisanship/sourcing
   notes, and discussion questions that treat the explainer as a classroom object.
3. **Date the news.** Never undated "now / today / currently." Use "As of August 18, 2026."
   Historical "today" is fine when it can't read as a news ticker.
4. **Every factual claim carries an inline citation** — `<a class="cite-inline" …>` to the
   source supporting *that* claim, placed after the fact, not after a civics kicker. Prefer
   free-to-access sources; Wikipedia is a last resort.
5. **Verify citations by reading them.** A 200 is not verification. This repo shipped a stat
   cited to the wrong RAND report — caught only because someone opened both sources.
6. **Never invent totals.** Casualty, oil, retirement, ICE/TRAC, incident figures: prefer the
   last cited as-of date over a fresher-looking guess.
7. **Reading level ~5th–6th grade, 8th-grade depth.** Contractions fine. Jargon goes in a
   `.term` tooltip, not an inline parenthetical.
8. **Party-swap test** on current-policy prose: it should read identically if the other party
   held the role. Accuracy — not false balance — for settled history and science.
9. **Sitting officials belong in the dated update or the local-district section.** Key People
   are historical figures whose part in the story is settled.
10. **Quote punctuation stays as the source wrote it** (especially `ai.html`).
11. **Images: Wikimedia Commons only**, license and subject verified on the image's own Commons
    file page — never a search thumbnail. Real alt text; credit line matching that page's own
    markup. Nothing graphic or unsuitable for middle schoolers.
12. **Contested present-day questions** use the `.perspective` side-by-side: named, sourced,
    equally-weighted, word counts close (gun-violence held pairs to 51/55, 55/51, 59/59). Report
    both stated positions rather than picking. Settled history — Chinese Exclusion Act, the 1924
    quotas, Japanese American incarceration, the Holodomor, Bucha — is stated as plain fact and
    never run through `.perspective`.

---

## 4. Components

Names are shared; confirm local markup before reusing.

| Component | Notes |
|---|---|
| `.cite-inline` | inline source link; per-page count is a regression invariant |
| `.term` + `.term-desc` | tooltip. Needs `tabindex="0"`, `data-def`, **and** `aria-describedby` → a hidden `.term-desc` span. Omitting the pair ships a screen-reader regression. |
| `.vocab` | boxed vocabulary callout |
| `.update-box` / `.update-sources` | the dated "what's happening" pane |
| `.perspective` | contested-question side-by-side (rule 12) |
| `.tl-item` / `.tl-year` / `.tl-body` | history timeline; must stack on mobile |
| `.callout`, `.pull-quote`, `.stat`, `.stat-trio`, `.photo-break` | editorial furniture |
| quiz + points engine | inline per page: `quizModal`, `pointsDisplay`, `progressFill`, `eggModal`, `toast`, `unlockHint`, `MAX_PTS` |
| a11y (shared) | `.skip-link`, `.a11y-controls`, `.text-size-controls`, `.dyslexic-toggle` — in `site.css`/`site.js`, present on every page including the hub |

**Dyslexic font is scoped to reading text** — not maps, nav, buttons, or SVG. Keep it that way.
`prefers-reduced-motion` must stop the homepage ticker and decorative motion.

**Every `<img>` gets a fallback:** `onerror="this.style.display='none'"` for section images;
person photos swap in an emoji div via `onerror="this.outerHTML=…"`.

**`MAX_PTS` must equal the true count of quizzes + discoverable easter eggs.** Wrong twice
already. Recount when adding or removing either.

**Easter-egg handlers must bind to ids that exist** — three dead ones shipped in
`us-elections.html`. Check an egg isn't duplicating page content, and isn't leftover from
another page: a `ukraine.html` egg once held Shah-era Iran material from a copy-paste.

**Remove clone CSS.** New pages started from another page's file carry unused rules
(`.stat-pair`, `.gh-steps` were stripped from `space-race.html` in v3.1.0).

---

## 5. Per-page accents — all distinct, do not unify

```
index.html            #a02c2c   newsprint red (hub only)
iran.html             #245a8c   Persian lapis
ukraine.html          #2e6a9a   deeper sky
ai.html               #4a3f6b   violet/ink
us-elections.html     #1a2a52   navy/gold — deliberately NOT red/blue, to avoid an
                                accidental two-party visual cue
immigration.html      #2c6e6b
climate-change.html   #3d6b35
gun-violence.html     #5a6169
space-race.html       #8a5424
```

v3.0.0 moved Iran, Ukraine, and AI off the shared red so no two topic pages match.

Chrome: warm-newsprint editorial system. Site name **Current Events Explained** everywhere.
Sibling links in `masthead-top`; sticky `section-nav` is in-page `#` anchors **only**. New pages
follow that, get added to every sibling's masthead nav and to the homepage grid, and link to
Suggest a Topic. The Coming Soon rail is gone — replaced by the Suggest a Topic section
(prefilled school email, stores nothing) plus a GitHub issue template.

---

## 6. Process

Substantial efforts (new page, content refresh, site-wide pass):

1. Design doc → `docs/plans/YYYY-MM-DD-<slug>-design.md`
2. Implementation plan → `…-implementation.md`: numbered tasks, `- [ ]` steps, a **Global
   Constraints** block restating the editorial rules in play
3. Isolated worktree `.claude/worktrees/<slug>`, branch `worktree-<slug>`
4. Task-by-task execution with per-task review; ledger at `.superpowers/sdd/progress.md` with
   commit, review outcome, and verification numbers
5. Final whole-batch verification, independent of the implementer
6. Merge, bump `VERSION`, write the `CHANGELOG.md` entry

**3-persona review** before a page ships — an 8th-grade student, an 8th-grade teacher, a
UX/edtech developer, each reading the live page. Catches what greps can't: a points-accounting
bug, missing screen-reader wiring, a cold unwarned opening into lockdown-drill content, and the
jargon/nav problems fixed on `space-race.html` in v3.1.0.

**Pull before starting.** This working copy has already sat six commits behind live while local
edits piled up against files the remote had rewritten. `git fetch && git status -sb` first;
silent fetch output does not mean up to date.

---

## 7. Versioning

One site-wide SemVer in `VERSION`, bumped **once per finished effort**, never per commit, with a
matching `CHANGELOG.md` entry.

- **Major** — a new topic page, or a structural/design overhaul (v3.0.0: a11y floor + shared
  CSS/JS + Space Race)
- **Minor** — a full content refresh, or a new section
- **Patch** — small corrections; also site-wide voice passes (v3.1.1, v3.1.2)

Entries are substantive: what changed, why, and **what went wrong and how it was caught.** That
failure record is the most useful thing in the file — keep writing it.

---

## 8. Recurring failure modes

Each has actually shipped:

- Citation attached to a source that doesn't contain the claim.
- Undated "now / currently" instead of an explicit date.
- Stacked true sentences that never hand off — the voice failure `docs/VOICE.md` exists for.
- Student-facing "this page / below on this page" asides (one pointed *down* at an update that
  was actually *above*).
- Copy-paste bleed between pages (Iran content in a Ukraine easter egg; a Ukraine pull-quote
  duplicating the two sentences above it).
- Unused clone CSS carried into a new page.
- `MAX_PTS` out of sync with real quiz + egg count.
- Easter-egg handlers bound to nonexistent ids.
- Quote punctuation altered during a reading-level rewrite.
- `.term` spans without the `aria-describedby` / `.term-desc` pair.
- An `<img>` without an `onerror` fallback.
- Nav links in the wrong bar — sibling links belong in `masthead-top`, not `section-nav`.

---

## 9. Open issues

- ~~**Mobile overflow bug**~~ — fixed in v3.3.0. `body{overflow-x:hidden;overflow-wrap:break-word}`
  had been applied to only 2 of 9 pages; propagated to all 9.
- **Offline-use regression** — a downloaded page now needs `site.css`, `site.js`, `fonts/`.
  Accepted, but README's "download and host it yourself" option should stay honest about it.
- **Roadmap** — Space Race 2.0 shipped in v3.0.0. Next topics now come from Suggest a Topic
  submissions and the GitHub issue template rather than a fixed list.
- **Deferred from v3.4.0** — splitting `gun-violence.html` (77 min) would break Canvas links
  teachers already made; revisit after a term of classroom use. Converting dense prose into
  `.stat-trio`/`.tl-item` components is its own effort, since it moves cited claims between
  elements. The v3.3.0 font-size consolidation (62 → 61 applied values) folds into that pass.
- **Reading level is largely a topic effect, not a writing defect.** Measured FK runs 6.5
  (space-race) to 9.9 (gun-violence); the gap is driven by subject vocabulary (`immigration`
  58×, `legislature`, `congressional`). The v3.1.x story-first rewrite did **not** move it
  (iran 9.1 → 8.9, gun-violence 9.9 → 9.9). Do not re-attempt a site-wide FK target.
- `.DS_Store` files are untracked clutter; consider a `.gitignore` entry.

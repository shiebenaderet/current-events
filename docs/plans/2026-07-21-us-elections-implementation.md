# US Elections & Government Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new topic page, `us-elections.html`, from scratch, matching the established structure and conventions of `iran.html`/`ukraine.html`/`ai.html` — durable 3-branch civics content plus a live update-pane tied to the 2026 midterm elections — and link it into the site's index/nav. The defining constraint of this build, more than any prior page: strict nonpartisanship, verified by a dedicated test at write time, not just cited sources.

**Architecture:** Task 1 scaffolds the entire page shell (CSS palette, shared JS engine — quiz system, points, easter eggs — nav, hero, points bar, footer) by adapting the proven, working engine already used by the three existing topic pages, with content-section placeholders. Tasks 2–7 fill in content section by section, each adding to the shared quiz-data object as they go. Task 8 wires the new page into `index.html`'s nav/topic-grid. Task 9 is the nonpartisanship + full verification pass. This mirrors how a developer would extend a working template, not how a from-scratch greenfield build would normally be planned — reuse, not reinvention, is the goal for every piece of shared machinery.

**Tech Stack:** Plain HTML, no build step, no test runner. Verification is manual: grep checks, browser opens, citation-link clicks, and — unique to this page — a dedicated nonpartisanship read-through.

## Global Constraints

- Write all new prose at a 5th–6th grade reading level (project convention — see `README.md` contribution guidelines). Note: the site's actual existing register runs closer to grade 11–14 (flagged in the AI refresh's final review) — this new page should aim for the stated 5th–6th grade target genuinely, not default to the higher register just because neighboring pages do.
- Every factual claim gets an inline `<cite-link><a href="..." target="_blank">src</a></cite-link>` (matching `iran.html`/`ukraine.html`'s pattern — NOT `ai.html`'s footnote-list pattern, per the design doc's explicit decision) pointing to a real, currently-live, non-paywalled, nonpartisan source.
- **Nonpartisanship test, unique to this page and non-negotiable**: for every sentence touching current politics — which party controls what, any officeholder named, any characterization of an election outcome — ask explicitly: *would this sentence read the same if the parties currently holding each role were swapped?* If the answer is no, rewrite it as a genuinely structural statement. This applies to every task that writes prose, not just the update-pane task.
- Key People is scoped to historical/framer figures only — never current sitting officials, regardless of how carefully a bio might be worded (see the design doc's "Key People" section for the full reasoning — this is a deliberate, confirmed decision, not something to revisit mid-implementation).
- No predicting 2026 midterm outcomes. Historical patterns (e.g., the midterm-seat-loss pattern) are cited as general political-science knowledge, never as a forecast for this specific cycle.
- No detailed state-by-state results, polling data, or campaign-finance specifics — this page teaches structure and mechanics.
- Reuse the existing site's shared component patterns (`update-pane`, `mini-tl`, `stat-grid`, `vocab`, `callout`, `person-card`, `tl-item`, quiz/points/easter-egg engine) exactly as implemented on the existing pages — no new CSS component types, no new JS mechanics beyond what's needed to instantiate this page (a new quiz-data object, a new color palette).
- Re-verify every date/figure/name against a live, nonpartisan source at write time — the design doc's scoping research (including one already-caught, excluded fabricated fact) is a starting point, not copy-paste-ready content.

---

## Reference Files

- **Design doc:** `docs/plans/2026-07-21-us-elections-design.md`
- **New page:** `us-elections.html`
- **Reference pages (for exact markup/JS patterns to adapt):** `iran.html`, `ukraine.html` (both use `cite-link`, both have an `update-pane`)
- **Index page (add nav link + topic card):** `index.html`

## Known Source Starting Points (re-verify at write time — none of these are pre-approved facts)

| Fact | Source (starting point only) |
|---|---|
| Election Day Nov 3, 2026; House/Senate seat counts; governor's races | Congressional Research Service, Clerk of the House, Senate.gov, National Governors Association |
| Primary results, incumbent defeats (Cassidy, Cornyn, Massie flagged) | Ballotpedia's incumbent-defeat tracker, AP/NPR/PBS primary-results pages |
| 2025 redistricting (TX, CA, UT, NC, MO, OH) | Ballotpedia's redistricting tracker, SCOTUSblog (for the TX Supreme Court ruling specifically) |
| Retirement counts and notable names (Pelosi, Hoyer, McConnell, Durbin flagged) | Ballotpedia's retirement tracker (note: updates periodically, pin an "as of" date), NPR's tracker |
| Historical midterm seat-loss pattern (18 of 20 since 1946 flagged) | UCSB's American Presidency Project (has the actual data table) |
| **Excluded, already investigated and rejected:** a "Sen. Alan Armstrong (R-Okla.)" retirement | Did not reappear under a second, more careful search check and doesn't correspond to any real senator — do not use, do not re-search for it, it was a likely search-summarization artifact |

---

## Task 1: Scaffold the Page Shell

**Files:**
- Create: `us-elections.html`

**Context:** This task builds the entire page skeleton by adapting `iran.html`'s proven structure — CSS reset/variables/hero/nav/points-bar patterns, and the full shared JS engine (quiz system, points tracking, easter eggs, dyslexic-font toggle) — with a new, civics-appropriate color palette and empty/placeholder content sections that later tasks will fill in. This is the single largest task in the plan; treat it as "port a working template," not "design a new one."

- [ ] **Step 1: Read the reference structure directly**

Read `iran.html` in full (or at minimum: lines 1–120 for the CSS reset/variables/hero, the `<nav class="sticky-nav">` block, the points-bar `<div>`, and the two `<script>` blocks at the end — search for `<script>` to find them). You need to understand the exact, real markup to adapt — do not write this from memory or from the design doc's prose description alone.

- [ ] **Step 2: Create `us-elections.html` with the base HTML skeleton**

Start with:
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>US Elections & Government – Student Resource</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Nunito:wght@400;600;700;800;900&family=Source+Serif+4:wght@400;600&display=swap" rel="stylesheet">
<link href="https://fonts.cdnfonts.com/css/opendyslexic" rel="stylesheet">
<style>
/* ─── RESET & BASE ─── */
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Nunito',sans-serif;background:#fdf6ec;color:#2c2c2c;line-height:1.7;font-size:17px;overflow-x:hidden}
</style>
</head>
<body>
</body>
</html>
```

Note: this page does NOT need the Leaflet.js map library (`<link>`/`<script>` for `leaflet.min.css`/`leaflet.min.js`) unless a later task decides a map is genuinely useful (e.g., showing states with 2026 governor's races) — do not include it in this scaffold; a later task can add it if needed, following `iran.html`'s exact map-integration pattern as reference.

- [ ] **Step 3: Add a new CSS color palette**

Add CSS custom properties for a civics-appropriate palette — distinct from Iran's red/gold, Ukraine's blue/yellow, and AI's blue/purple, since this page needs its own visual identity. Suggested (adjust as needed, but keep them genuinely nonpartisan — avoid red/blue as the PRIMARY pairing, since that reads as a red-state/blue-state or two-party visual cue on an explicitly nonpartisan civics page; navy/gold/cream reads as "civic/patriotic" without a two-party binary):
```css
:root{
  --cream:#fdf6ec;--warm-white:#fffdf9;
  --navy:#1a2a52;--navy-l:#2d4270;--navy-ll:#e8ecf5;
  --gold:#b8860a;--gold-l:#d4a017;--gold-ll:#fef3db;
  --green:#1a6640;--green-l:#e8f5ee;
  --border:#e0d5c0;--mid:#666;
  --shadow:0 4px 20px rgba(0,0,0,.1);
}
```
Confirm this choice reads as civics/patriotic rather than partisan by checking it against the nonpartisanship spirit of this whole build — if in doubt, avoid red entirely as a section-accent color on this specific page, unlike Iran/Ukraine where red carries no such risk.

- [ ] **Step 4: Port the hero, sticky-nav, and points-bar structure**

Adapt `iran.html`'s hero/nav/points-bar markup (search the file for `<header class="hero">`, `<nav class="sticky-nav">`, and `<div class="points-bar">`) to this page — same structural pattern, new content:
- Hero: title "US Elections & How Government Works" (or similar — confirm against the design doc's framing), subtitle, hero-note with "Updated [DATE] · 8th Grade Social Studies · Earn points by answering quizzes!" (use the actual write date).
- Sticky-nav: anchor links for each of this page's sections (branches, checks-and-balances, how-a-bill-becomes-law, elections-mechanics, the update-pane, timeline, key-people, videos, resources) — plus, per this project's now-established convention (see the cross-page-navigation fix already applied to the other 3 pages), include a "🏠 All Topics" link to `index.html` and sibling links to `iran.html`, `ukraine.html`, `ai.html` from the START, not as a later retrofit.
- Points-bar: identical structural pattern to the reference page, no changes needed beyond the container existing.

- [ ] **Step 5: Port the full shared JS engine**

Copy `iran.html`'s two `<script>` blocks (search for `<script>` — should be two blocks near the end of the file, before `</body>`) into this new file. Adapt:
- The `quizzes` object: replace with an **empty object** for now (`const quizzes = {};`) — subsequent tasks will add entries as they build each section's quiz.
- `MAX_PTS`: set to match however many quizzes this page will ultimately have (this will need a final adjustment in the last content task or Task 9's verification pass — flag this with a comment for now, e.g. `const MAX_PTS = 0; // TODO: update once all quizzes are added` — this is an intentional, tracked placeholder, not a violation of the "no placeholders" rule, since it's explicitly flagged for a specific later step, not left silently wrong).
- Any Iran-specific easter-egg logic (e.g., Konami-code Easter eggs, flag-click animations tied to Iran-specific content) — keep the generic mechanism (the `KONAMI` array, `flagClicks` counter, `showToast` function) but do NOT port Iran-specific *content* inside those mechanisms (e.g., don't copy an Iran-flag-themed easter egg message) — leave the trigger mechanism in place with placeholder or genuinely page-appropriate content, to be decided/refined in a later task if this page gets its own easter egg.
- Confirm `openQuiz`, `showToast`, and the points-tracking logic are copied verbatim (they're topic-agnostic) — do not modify their internal logic.

- [ ] **Step 6: Add placeholder section containers**

Add empty (or single-sentence placeholder, e.g., `<p>[Content added in Task 2]</p>` — again, an explicitly tracked placeholder, not a silent gap) `<section class="s-card">` containers for each of: Section 1 (branches), Section 2 (checks and balances), Section 3 (bill to law), Section 4 (elections mechanics), the update-pane, History Timeline, Key People, Videos, Resources — matching each container's exact class/id naming convention from `iran.html` (e.g., `<section class="s-card" id="branches">`).

- [ ] **Step 7: Verify the shell loads and functions**

Run: `open us-elections.html` (or equivalent). Confirm: the page loads with no console errors, the hero/nav/points-bar render with the new palette, clicking a nav anchor scrolls to the corresponding (placeholder) section, the dyslexic-font toggle button works, and no broken image/asset references exist (this shell shouldn't reference any images yet — if the copied hero markup references an Iran-specific background image, replace it with a solid-color or gradient background for now, to be replaced with a real image in Task 2 or later, not left pointing at a nonexistent/wrong file).

- [ ] **Step 8: Commit**

```bash
git add us-elections.html
git commit -m "feat: scaffold US Elections page shell (CSS, JS engine, empty sections)"
```

---

## Task 2: Section 1 — The Three Branches of Government

**Files:**
- Modify: `us-elections.html` (the `#branches` placeholder section)

**Context:** Durable civics content — no current-events risk, but the section that sets up later references (Speaker of the House, Senate Majority Leader as generic roles) that the update-pane task will build on.

- [ ] **Step 1: Verify facts before writing**

Confirm structural facts about the three branches (this is settled civics, low research risk, but confirm exact figures like current House/Senate seat totals, term lengths) against a reputable civics reference (e.g., USA.gov, Congress.gov, or a nonpartisan civics-education source like iCivics or Annenberg Classroom).

- [ ] **Step 2: Write the section content**

Replace the `#branches` placeholder with real content, following `iran.html`'s Section 1 structural pattern (an `<h2>` with a `q-label` span, `s-body` div, `<p>` tags with `<strong>` emphasis and `cite-link` citations, at least one `.vocab` box). Cover:
- Executive branch: the President, enforces laws, one person, 4-year term.
- Legislative branch: Congress (House + Senate), makes laws.
- Judicial branch: federal courts (including the Supreme Court), interprets laws, decides if laws are constitutional.
- A `.vocab` box explaining "Speaker of the House" as a role (elected by House members, decides which bills come to the floor for a vote) — generic, no current name.
- A `.vocab` box explaining "Senate Majority Leader" as a role (leads the majority party in the Senate, controls the Senate floor schedule) — generic, no current name.

Apply the nonpartisanship test to every sentence: would it read the same regardless of which party holds each branch right now? This section should pass trivially since it's pure structure, but check anyway — don't skip the test just because the content feels "obviously safe."

- [ ] **Step 3: Add a quiz for this section**

Add one entry to the `quizzes` object (e.g., `q1`) testing a fact from this section (e.g., "which branch makes laws?"). Add the corresponding `<button class="quiz-btn" onclick="openQuiz('q1')">` at the end of the section's content, following the exact existing pattern.

- [ ] **Step 4: Verify**

Run: `open us-elections.html`, scroll to this section, confirm it renders correctly, click every citation link to confirm it resolves, click the quiz button to confirm it opens and functions.

- [ ] **Step 5: Commit**

```bash
git add us-elections.html
git commit -m "feat: add US Elections Section 1 — three branches of government"
```

---

## Task 3: Section 2 — Checks and Balances

**Files:**
- Modify: `us-elections.html` (the `#checks-balances` placeholder section)

**Context:** Concrete mechanism examples, framed entirely around structure, not tied to any current controversy.

- [ ] **Step 1: Verify facts before writing**

Confirm the specific mechanism facts (veto override threshold is 2/3 in both chambers; Senate confirms judicial/executive appointments; impeachment process — House impeaches with simple majority, Senate tries and convicts with 2/3) against a reputable civics reference.

- [ ] **Step 2: Write the section content**

Replace the `#checks-balances` placeholder, following the same structural pattern as Task 2. Cover, with a concrete example for each:
- President can veto a bill Congress passed.
- Congress can override a veto with a 2/3 vote in both chambers.
- Courts can rule a law unconstitutional (mention judicial review generically — Marbury v. Madison, 1803, is the classic, settled, nonpartisan historical example to cite here, not a current case).
- The Senate confirms presidential appointments, including federal judges.
- Congress can impeach and remove a President, judge, or other federal official.

Every example must be framed as mechanism ("this is how the check works"), never illustrated with a current, politically-live example — use the historical Marbury v. Madison example for judicial review specifically to keep this section entirely settled/historical rather than reaching for a recent, potentially divisive case.

Apply the nonpartisanship test to every sentence.

- [ ] **Step 3: Add a quiz for this section**

Add one entry to `quizzes` (e.g., `q2`) and the corresponding button.

- [ ] **Step 4: Verify**

Same as Task 2 Step 4, scoped to this section.

- [ ] **Step 5: Commit**

```bash
git add us-elections.html
git commit -m "feat: add US Elections Section 2 — checks and balances"
```

---

## Task 4: Section 3 — How a Bill Becomes a Law

**Files:**
- Modify: `us-elections.html` (the `#bill-to-law` placeholder section)

**Context:** The most purely mechanical, lowest-risk section in the plan — a fixed, well-documented process with no current-events dimension at all.

- [ ] **Step 1: Verify facts before writing**

Confirm the exact process steps (introduced → assigned to committee → committee markup/vote → floor debate and vote in originating chamber → sent to the other chamber, repeats → conference committee reconciles differing versions → both chambers vote on the reconciled bill → sent to President → President signs, vetoes, or takes no action for 10 days while Congress is in session (becomes law) or pocket-vetoes if Congress adjourns in that window) against Congress.gov or a similarly authoritative source.

- [ ] **Step 2: Write the section content**

Replace the `#bill-to-law` placeholder with the process, step by step, following the same structural pattern as prior sections. Consider a numbered or visually sequential presentation (e.g., reusing the `.tl-item`/timeline visual pattern for a *process* rather than a chronological history, if that renders well — check how it looks before committing to this vs. plain numbered `<p>` steps).

- [ ] **Step 3: Add a quiz for this section**

Add one entry to `quizzes` and the corresponding button.

- [ ] **Step 4: Verify**

Same pattern as prior tasks.

- [ ] **Step 5: Commit**

```bash
git add us-elections.html
git commit -m "feat: add US Elections Section 3 — how a bill becomes a law"
```

---

## Task 5: Section 4 — How Elections Actually Work

**Files:**
- Modify: `us-elections.html` (the `#elections-mechanics` placeholder section)

**Context:** This section sets up the structural grounding the update-pane (Task 6) depends on — specifically, the House-vs-Senate term-length/staggering explanation that makes "35 Senate seats, not 100" comprehensible.

- [ ] **Step 1: Verify facts before writing**

Confirm: primary vs. general election mechanics; the Electoral College (used only for President — brief, accurate, nonpartisan explanation of how it works, not a debate about whether it should exist); direct election for Congress and most other offices; House terms (2 years, entire chamber up every cycle) vs. Senate terms (6 years, staggered into three "classes" so roughly a third is up each cycle — confirm the "Class" terminology and mechanism precisely); why a midterm is called a "midterm" (falls at the two-year midpoint of a four-year presidential term).

- [ ] **Step 2: Write the section content**

Replace the `#elections-mechanics` placeholder, following the same structural pattern. This section should NOT mention the 2026 midterms' specific facts (seat counts, specific races) — that's the update-pane's job (Task 6). This section explains the durable MECHANISM (how staggered Senate terms work, in general, in any year) that the update-pane will later apply to 2026 specifically.

Include a `.vocab` box on "midterm election" itself.

Apply the nonpartisanship test — this section should be pure mechanism and should pass trivially, but check the Electoral College explanation specifically, since that's the one piece of election mechanics that sometimes attracts strong opinions; keep it to "here's how it works" (each state gets electors based on Congressional representation, a candidate needs 270 of 538 to win) without characterizing whether it's a good or bad system.

- [ ] **Step 3: Add a quiz for this section**

Add one entry to `quizzes` and the corresponding button.

- [ ] **Step 4: Verify**

Same pattern as prior tasks.

- [ ] **Step 5: Commit**

```bash
git add us-elections.html
git commit -m "feat: add US Elections Section 4 — how elections work"
```

---

## Task 6: The Update Pane — "Where Things Stand: The 2026 Midterms"

**Files:**
- Modify: `us-elections.html` (the `#update-pane` placeholder section)

**Context:** This is the highest-research-risk, highest-nonpartisanship-risk task in the plan. Read the design doc's "The Update Pane" section in full before starting — it has the complete content plan. This task also requires reading `iran.html`'s actual `update-pane`/`mini-tl` markup directly (search for `<div class="update-pane"` in that file) to copy the exact structural pattern, not just the design doc's prose description of it.

- [ ] **Step 1: Verify every fact in this section against a live, current, nonpartisan source — this is the most important verification step in the entire plan**

For each of the following, fetch a primary source directly and confirm the specific fact (per this project's established citation discipline: a live/200 URL is necessary but not sufficient — read what it actually says):
- Election Day 2026's exact date, and why the "Tuesday after the first Monday in November" rule exists historically.
- Exact House/Senate/governor's-race seat counts up for election in 2026 (design doc flags 435 House, 35 Senate — 33 regular + 2 special — 36+ governor's races; verify precisely, including WHY the 2 special Senate seats exist, per the design doc's flagged Rubio/Vance-vacancy framing).
- Which states held 2026 primaries so far and whether any sitting members of Congress lost their primaries (design doc flags Cassidy, Cornyn, Massie as research candidates — verify each independently; do NOT use the already-excluded "Alan Armstrong" fact under any circumstance).
- 2025 redistricting: which states, and the Texas/California contrast the design doc proposes (map → court → Supreme Court, vs. voter ballot measure) — verify the sequence and outcome precisely.
- Retirement counts and the 1-2 most notable names by tenure (design doc flags Pelosi, Hoyer, McConnell, Durbin as candidates) — verify current counts (trackers update; note the specific date you're citing "as of").
- The historical midterm-seat-loss pattern (design doc flags 18 of 20 since 1946, sourced to UCSB's American Presidency Project) — fetch this source directly and confirm the actual data table shows this.
- Who currently holds the presidency, House majority, Senate majority, Speaker of the House, and Senate Majority Leader roles, as of the actual write date.

- [ ] **Step 2: Build the update-pane structure**

Following `iran.html`'s exact `update-pane`/`mini-tl` markup pattern, build:
- A header with an Election-Day-countdown framing (not a "Day N" badge — see design doc).
- A `mini-tl` timeline with entries for: primaries/incumbent defeats, redistricting (the TX/CA contrast pair), retirements, and the Nov 3 Election Day entry itself with its seat counts.
- The "Who controls what, right now" fact block: clearly dated, stating party control of the presidency/House/Senate and naming the current Speaker/Majority Leader, followed by one paragraph connecting this to the midterms' stakes (tied back to Section 1's generic role explanations from Task 2).
- A `.vocab` box on the historical midterm pattern, framed explicitly as general political-science knowledge, not a 2026 prediction.

- [ ] **Step 3: Apply the nonpartisanship test to every single sentence in this section — do not skip this**

Read the entire update-pane section sentence by sentence. For each one touching current politics, ask explicitly: would this read the same if the parties currently holding each role were swapped? Rewrite anything that fails. This section carries the most nonpartisanship risk in the entire page — treat this step with the same rigor this project's other pages have given citation-accuracy checks.

- [ ] **Step 4: Verify**

Run: `open us-elections.html`, scroll to the update-pane, confirm it renders with the same visual quality as Iran/Ukraine's update-panes, click every citation link, and re-read the section one more time specifically for nonpartisanship (a second pass, after Step 3's first pass, since this is the section most worth double-checking).

- [ ] **Step 5: Commit**

```bash
git add us-elections.html
git commit -m "feat: add US Elections update-pane — 2026 midterms status"
```

---

## Task 7: History Timeline, Key People, Videos, Resources

**Files:**
- Modify: `us-elections.html` (the `#timeline`, `#key-people`, `#videos`, `#resources` placeholder sections)

**Context:** Four smaller, lower-risk sections bundled into one task since each is a straightforward instantiation of an existing, well-understood component pattern (`.tl-item` timeline, `.person-card` grid, video embeds, resource links) — none requires the deep research or nonpartisanship scrutiny of Tasks 5–6.

- [ ] **Step 1: Verify History Timeline facts**

Confirm the design doc's proposed entries (1787 Constitutional Convention, 1870 15th Amendment, 1920 19th Amendment, 1965 Voting Rights Act, 1971 26th Amendment) against a reputable civics/history source, including the honest note about the 15th Amendment's long, uneven enforcement — state this as a factual historical point (e.g., citing specific suppression mechanisms like literacy tests or poll taxes and when they were actually eliminated by the Voting Rights Act) without it reading as commentary on any current voting-rights debate.

- [ ] **Step 2: Build the History Timeline**

Following `iran.html`'s `.tl-item` pattern exactly, add each entry with a real citation.

- [ ] **Step 3: Research and select 2 Key People (historical/framer figures only — NOT current officials)**

Per the design doc's explicit, confirmed scoping decision: pick figures relevant to the Constitution's design or voting-rights history — e.g., a key framer (James Madison, often called the "Father of the Constitution," is a strong, settled, nonpartisan choice) and a Voting Rights Act-era figure (research and verify a specific, well-documented figure — do not guess, confirm via a reputable source). Do NOT include any current sitting official under any circumstance, even briefly, even as a "just one small mention" — this was a deliberate scope decision in the design doc, not an oversight to second-guess mid-implementation.

- [ ] **Step 4: Build the Key People section**

Following `iran.html`'s `.person-card`/`.portrait-ring` pattern, add each figure with a real photo (verify licensing — Wikimedia Commons CC/public domain, per this project's established image-sourcing discipline — do not fabricate or guess at a source, and do not force a citation for an image you can't confirm matches; if no verifiable portrait exists for a candidate figure, either find a different, verifiable figure or use this project's established honest-disclosure fallback pattern, per the precedent already set on this site).

- [ ] **Step 5: Build Videos and Resources sections**

Following `iran.html`'s existing patterns for embedded video/podcast content and ranked-resource lists. Source genuinely nonpartisan, reputable civics-education videos/resources (e.g., established civics-education nonprofits, C-SPAN's educational content, Annenberg Classroom, iCivics) — verify each source directly before including it, and specifically check that any video/resource itself is nonpartisan in its own framing, not just that its host organization has a neutral-sounding name.

- [ ] **Step 6: Add quiz(es) for the timeline/people sections if appropriate**

Following the pattern of prior tasks — 1-2 more `quizzes` entries covering timeline/Key People facts, with corresponding buttons.

- [ ] **Step 7: Verify all four sections**

Run: `open us-elections.html`, scroll through all four sections, click every citation/resource link, confirm images load correctly and match their captions, confirm any new quiz buttons function.

- [ ] **Step 8: Commit**

```bash
git add us-elections.html [any new image files]
git commit -m "feat: add US Elections history timeline, key people, videos, resources"
```

---

## Task 8: Wire the New Page into the Site

**Files:**
- Modify: `index.html`

**Context:** This is the same kind of mechanical integration task as the Iran/Ukraine/AI refresh's date-stamp tasks — following an established, already-correct pattern (the site-nav already correctly links to all 3 existing topics) rather than inventing new integration logic.

- [ ] **Step 1: Read the existing pattern directly**

Read `index.html`'s `<nav class="site-nav">` block and the topic-card grid (search for `topic-card` — the Iran/Ukraine/AI cards each follow an identical structural pattern) to see the exact markup to replicate.

- [ ] **Step 2: Add a nav link**

Add `<a href="us-elections.html">🗳️ US Elections</a>` (or similar — confirm emoji choice is genuinely neutral, a ballot box is a safe, established civics symbol) to the `site-nav`, following the existing pattern's exact formatting.

- [ ] **Step 3: Add a topic card**

Add a new topic-card block to the topic grid, following the exact structural pattern of the existing 3 cards (title, tags, description, date badge in the "📅 Updated [DATE]" format already standardized across all 3 existing cards, estimated reading time).

- [ ] **Step 4: Verify**

Run: `open index.html`, confirm the new nav link and topic card render correctly and that clicking either navigates to `us-elections.html` successfully.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add US Elections page to site nav and topic grid"
```

---

## Task 9: Full-Page Verification Pass (Including Dedicated Nonpartisanship Pass)

**Files:** None modified unless this step surfaces a real problem — verification only, except for the `MAX_PTS` fix flagged in Task 1.

- [ ] **Step 1: Fix the `MAX_PTS` placeholder from Task 1**

Count the actual number of quiz entries added across Tasks 2–7. Update `const MAX_PTS = 0;` (the intentionally-flagged Task 1 placeholder) to the real count. Confirm the points-bar UI correctly reflects this new max.

- [ ] **Step 2: Confirm no leftover placeholder content remains**

Run: `grep -n "\[Content added in Task\|TODO\|TBD\|placeholder" us-elections.html`
Expected: no matches (aside from the `MAX_PTS` comment already resolved in Step 1 — confirm that one specifically is gone too).

- [ ] **Step 3: Dedicated nonpartisanship read-through — the most important step in this task**

Read the ENTIRE page start to finish, specifically hunting for any sentence touching current politics. For each one, apply the test explicitly: would this read the same if the parties currently holding each role were swapped? Pay special attention to: the update-pane's "who controls what" fact block, any mention of specific incumbents who won/lost primaries, the redistricting discussion, and the historical midterm-pattern vocab box (confirm it's framed as historical knowledge, not a 2026 prediction). This should be a genuinely separate pass from any fact-checking already done — checking "is this true" and checking "is this neutral" are different questions and both need their own pass.

- [ ] **Step 4: Confirm Key People stays scoped correctly**

Run: `grep -n "person-card" us-elections.html` and manually confirm every entry is a historical/framer figure, not a current sitting official — re-confirm this explicitly even though Task 7 already scoped it this way, since this is a hard constraint worth double-checking at the final gate.

- [ ] **Step 5: Re-verify all citation links resolve**

Extract and check every `https://` URL in the file (same methodology established by the Iran/Ukraine and AI refresh plans: 3-retry for sandbox flakiness, cross-tool verification with WebFetch before concluding anything is dead, watch for sites that bot-block but are fine for real readers).

```bash
grep -oE 'href="https://[^"]+"' us-elections.html | sed -E 's/^[^:]+:href="//;s/"$//' | sort -u > /tmp/us-elections-links.txt
wc -l /tmp/us-elections-links.txt
while read -r url; do
  code=$(curl -s -o /dev/null -w "%{http_code}" -A "Mozilla/5.0" -L --max-time 10 "$url")
  echo "$code $url"
done < /tmp/us-elections-links.txt | sort -n
```

- [ ] **Step 6: Confirm every quiz functions and covers a fact still present on the page**

In the browser, click every quiz button added across Tasks 2–7. Confirm each question/answer displays correctly and references a fact that's still accurately stated on the page.

- [ ] **Step 7: Confirm reading level**

Spot-check several sections against the stated 5th–6th grade target (a quick Flesch-Kincaid check, or careful manual read for sentence complexity/vocabulary). Per the Global Constraints note, this page should genuinely aim for the stated target — flag (don't necessarily rewrite everything, use judgment) any section that reads notably harder than the rest.

- [ ] **Step 8: Confirm zero structural/CSS drift from the established site pattern**

Compare `us-elections.html`'s CSS class names and JS function signatures against `iran.html`'s — confirm this new page reuses the SAME class names for shared components (`update-pane`, `mini-tl`, `s-card`, `cite-link`, `vocab`, `callout`, `person-card`, `tl-item`, `quiz-btn`) rather than inventing parallel-but-different names, which would fragment the site's component system.

- [ ] **Step 9: Final commit if any fixes were needed**

```bash
git add us-elections.html index.html
git commit -m "fix: address verification-pass findings in US Elections page build"
```

If no fixes were needed beyond Step 1's `MAX_PTS` update, note that explicitly rather than leaving it ambiguous whether this step ran.

---

## Self-Review Notes

- **Spec coverage:** All design doc sections (page structure, update-pane content plan, history timeline, Key People scoping, sourcing/verification standard, out-of-scope list) map to Tasks 1–9. The design doc's most distinctive requirement — nonpartisanship as a first-class, dedicated verification concern — is threaded through every content task's steps (not just Task 9's final pass), since waiting until the very end to check this would be far more expensive to fix than catching it section-by-section.
- **Placeholder scan:** Task 1's two intentional placeholders (`MAX_PTS = 0` and the `[Content added in Task N]` section stubs) are both explicitly flagged with a specific resolution step in a later task (Task 9 Step 1 and Tasks 2–7's content-writing steps respectively) — neither is a silent gap. No other placeholders appear in the plan.
- **Type consistency:** N/A (no code interfaces — HTML/CSS/JS content only, no typed signatures). Class/ID names (`s-card`, `update-pane`, `mini-tl`, `cite-link`, `vocab`, `callout`, `person-card`, `portrait-ring`, `tl-item`, `quiz-btn`, `site-nav`, `topic-card`) are specified as "reuse `iran.html`'s exact pattern" throughout rather than reconstructed from memory, since this plan's core discipline is adaptation of proven, working markup — Task 8's `index.html` integration similarly instructs reading the existing pattern directly before writing, rather than guessing at the topic-card structure.

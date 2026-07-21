# US Elections & Government Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new topic page, `us-elections.html`, from scratch, matching the established structure and conventions of `iran.html`/`ukraine.html`/`ai.html` — durable 3-branch civics content plus a live update-pane tied to the 2026 midterm elections — and link it into the site's index/nav. The defining constraint of this build, more than any prior page: strict nonpartisanship, verified by a dedicated test at write time, not just cited sources.

**Architecture:** Task 1 scaffolds the entire page shell (CSS palette, shared JS engine — quiz system, points, easter eggs — nav, hero, points bar, footer) by adapting the proven, working engine already used by the three existing topic pages, with content-section placeholders. Tasks 2–8 fill in content section by section, each adding to the shared quiz-data object as they go — this includes Task 7, a locally-relevant section on Washington's 32nd Legislative District and 2nd Congressional District (added mid-session, after Alderwood Middle School's specific district representation was confirmed). **Task numbers reflect implementation ORDER, not final HTML position** — this matters because of a mid-session change: the update-pane's HTML position was moved (after Tasks 1-3 shipped) to sit first in `<main>`, immediately after the hero, matching Iran/Ukraine/AI's proven pattern where live "right now" content leads and durable background follows — the original order (three full civics sections before any current-events content) read like a textbook, not a current-events page, per direct project-owner feedback. Task 6 (the update-pane's actual CONTENT) still gets implemented after Tasks 2-4 (branches, elections, checks-and-balances) in this plan's sequence, since its content depends on facts those sections establish (e.g., referencing "the Speaker of the House" assumes Task 2 already explained the role) — only the update-pane's finished HTML PLACEMENT moved earlier, not the task execution order. Two custom SVG diagrams (three-branches, checks-and-balances triangle) were added directly to Tasks 2/4's sections by the controller, after the project owner flagged the page as too text-heavy — **a separate, later request for a dedicated real-photo-sourcing task (originally scoped as a Task 9) was proposed and then explicitly withdrawn by the project owner** ("we can skip the images"), so no such task exists in this plan; the two diagrams plus Key People's planned historical-figure portraits (Task 8) are this page's only visual content, by deliberate final decision. Task 9 wires the new page into `index.html`'s nav/topic-grid. Task 10 is the nonpartisanship + full verification pass. This mirrors how a developer would extend a working template, not how a from-scratch greenfield build would normally be planned — reuse, not reinvention, is the goal for every piece of shared machinery.

**Tech Stack:** Plain HTML, no build step, no test runner. Verification is manual: grep checks, browser opens, citation-link clicks, and — unique to this page — a dedicated nonpartisanship read-through.

## Global Constraints

- Write all new prose at a 5th–6th grade reading level (project convention — see `README.md` contribution guidelines). Note: the site's actual existing register runs closer to grade 11–14 (flagged in the AI refresh's final review) — this new page should aim for the stated 5th–6th grade target genuinely, not default to the higher register just because neighboring pages do.
- Every factual claim gets an inline `<cite-link><a href="..." target="_blank">src</a></cite-link>` (matching `iran.html`/`ukraine.html`'s pattern — NOT `ai.html`'s footnote-list pattern, per the design doc's explicit decision) pointing to a real, currently-live, non-paywalled, nonpartisan source.
- **Nonpartisanship test, unique to this page and non-negotiable**: for every sentence touching current politics — which party controls what, any officeholder named, any characterization of an election outcome — ask explicitly: *would this sentence read the same if the parties currently holding each role were swapped?* If the answer is no, rewrite it as a genuinely structural statement. This applies to every task that writes prose, not just the update-pane task.
- Key People is scoped to historical/framer figures only — never current sitting officials, regardless of how carefully a bio might be worded (see the design doc's "Key People" section for the full reasoning — this is a deliberate, confirmed decision, not something to revisit mid-implementation).
- No predicting 2026 midterm outcomes. Historical patterns (e.g., the midterm-seat-loss pattern) are cited as general political-science knowledge, never as a forecast for this specific cycle.
- No detailed state-by-state results, polling data, or campaign-finance specifics — this page teaches structure and mechanics. (This does NOT prohibit Task 7's candidate platform links, added mid-session — a link to a candidate's own campaign website/statement is a pointer to a primary source, not this page stating polling numbers or fundraising totals. If a genuine conflict between this constraint and Task 7's requirements ever seems to arise, this constraint's original intent — "don't turn this page into an election tracker" — governs; a single link per candidate to their own words is not a tracker.)
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
- Sticky-nav: anchor links for each of this page's sections. **Note, updated after a mid-session reorder:** at the time Task 1 was actually implemented, section order was `#branches`, `#checks-balances`, `#bill-to-law`, `#elections-mechanics`, the update-pane, `#timeline`, `#key-people`, `#videos`, `#resources` (matching this plan's original task order). After that shell shipped and both "three branches" and "checks and balances" content were written, the page was reordered per the project owner's request (see the current Task 3's context note, a few pages below in this document, for the full reasoning): `#elections-mechanics` moved to sit directly after `#branches`, `#checks-balances` moved to third position, and `#bill-to-law`'s empty placeholder (along with its now-unused `.n-bill` nav class) was deleted outright. The live file's actual current order is `#branches`, `#elections-mechanics`, `#checks-balances`, the update-pane, `#timeline`, `#key-people`, `#videos`, `#resources` — trust the live file over this historical description if the two ever disagree. Use short-form operational IDs consistently everywhere (not descriptive long forms) — plus, per this project's now-established convention (see the cross-page-navigation fix already applied to the other 3 pages), include a "🏠 All Topics" link to `index.html` and sibling links to `iran.html`, `ukraine.html`, `ai.html` from the START, not as a later retrofit.
- Points-bar: identical structural pattern to the reference page, no changes needed beyond the container existing.

- [ ] **Step 5: Port the full shared JS engine**

Copy `iran.html`'s two `<script>` blocks (search for `<script>` — should be two blocks near the end of the file, before `</body>`) into this new file. Adapt:
- The `quizzes` object: replace with an **empty object** for now (`const quizzes = {};`) — subsequent tasks will add entries as they build each section's quiz.
- `MAX_PTS`: set to match however many quizzes this page will ultimately have (this will need a final adjustment in the last content task or Task 10's verification pass — flag this with a comment for now, e.g. `const MAX_PTS = 0; // TODO: update once all quizzes are added` — this is an intentional, tracked placeholder, not a violation of the "no placeholders" rule, since it's explicitly flagged for a specific later step, not left silently wrong).
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

## Task 3: Section 2 — How Elections Actually Work (moved earlier, now ties directly back to Section 1)

**Files:**
- Modify: `us-elections.html` (the `#elections-mechanics` section — already relocated to sit directly after `#branches` and before `#checks-balances`; the HTML move itself is DONE, this task only needs to fill in the content)

**Context:** Reordered mid-session, after the project owner pointed out that "Elections" — half the page's own title — didn't appear until deep into the durable civics content. This section now sits second (right after the three branches), and its opening explicitly bridges back to Section 1: of the three branches just described, which ones are filled by election, how often, and why the judiciary is different. This section also sets up the structural grounding the update-pane (Task 6) depends on — specifically, the House-vs-Senate term-length/staggering explanation that makes "35 Senate seats, not 100" comprehensible. The old "How a Bill Becomes a Law" section (previously planned as Task 4) was cut from this plan entirely, per the project owner's explicit request — it was the most purely mechanical, least election-relevant section, and cutting it (before any content was written for it) tightens the page around its actual branches → elections → midterms-stakes thesis. Its empty placeholder container has already been removed from the HTML.

- [ ] **Step 1: Verify facts before writing**

Confirm: primary vs. general election mechanics; the Electoral College (used only for President — brief, accurate, nonpartisan explanation of how it works, not a debate about whether it should exist); direct election for Congress and most other offices; House terms (2 years, entire chamber up every cycle) vs. Senate terms (6 years, staggered into three "classes" so roughly a third is up each cycle — confirm the "Class" terminology and mechanism precisely); why a midterm is called a "midterm" (falls at the two-year midpoint of a four-year presidential term); which federal offices are filled by direct election of the people vs. indirect processes (the President is chosen via the Electoral College, not a direct national popular vote; federal judges — including Supreme Court justices — are NOT elected at all, they are nominated by the President and confirmed by the Senate, serving until retirement/death/impeachment rather than standing for reelection).

- [ ] **Step 2: Write the section content — the opening must explicitly bridge back to Section 1**

Replace the `#elections-mechanics` placeholder. Open with a direct callback to the three branches: something like "You just read about the three branches. Two of them are filled by people voters choose directly or indirectly. One of them isn't elected at all." Then cover, tying each back to a specific branch:
- **Legislative branch — fully elected, most often:** every U.S. House member serves a 2-year term and the entire chamber is up every election, including every midterm. Senators serve 6-year terms, staggered into three roughly-equal "classes," so only about a third of the Senate is up in any given cycle (this is the fact that makes "35 seats up in 2026, not 100" make sense later in the update-pane).
- **Executive branch — elected, but not by direct national popular vote:** the President is chosen via the Electoral College (each state gets electors based on its Congressional representation; a candidate needs 270 of 538 electoral votes to win) every 4 years — explain the mechanism plainly, take no position on whether this system is good or bad.
- **Judicial branch — not elected at all:** federal judges, including Supreme Court justices, are nominated by the President and confirmed by the Senate (tying back to Section 1's/Section 2's confirmation-power content), then generally serve for life (or until retirement/impeachment) rather than standing for reelection. This is a good, concrete answer to "why is the judiciary different from the other two" — no election ties it to current political control the way the other two branches are, which is exactly why courts are designed to be checked by confirmation power rather than direct voter turnover.
- Primary vs. general elections (a primary picks each party's nominee; the general election is between the parties' nominees and any independents, decided by voters).
- Why a "midterm" is called that (falls at the two-year midpoint of a 4-year presidential term) — include a `.vocab` box on this term specifically.

This section should still NOT mention the 2026 midterms' specific facts (seat counts, specific races, who's currently in charge) — that's the update-pane's job (Task 6, now positioned after Task 4/Checks and Balances). This section explains the durable MECHANISM, in general, in any year, that the update-pane will later apply to 2026 specifically.

Apply the nonpartisanship test to every sentence — this section should pass easily since it's structural, but check the Electoral College explanation specifically (the one piece of election mechanics that sometimes attracts strong opinions) and confirm the "judiciary isn't elected" framing doesn't imply any judgment about whether that's good or bad, just states it as a structural fact with its own reasoning (insulating judges from needing to win reelection).

- [ ] **Step 3: Add a quiz for this section**

Check the current `quizzes` object in the file FIRST before picking an ID — as of this reorder, `q1` (branches) and `q2` (checks and balances, built under the original numbering before this section moved) already exist. Use `q3` for this section's quiz (testing something like "which of the three branches is NOT filled by election?"), not `q2` — using `q2` would collide with the already-shipped checks-and-balances quiz.

- [ ] **Step 4: Verify**

Run: `open us-elections.html`, scroll to this section (now positioned second, right after Branches), confirm the opening sentence genuinely reads as a callback to Section 1 rather than a disconnected restart, confirm it renders correctly, click every citation link, click the quiz button to confirm it functions.

- [ ] **Step 5: Commit**

```bash
git add us-elections.html
git commit -m "feat: add US Elections Section 2 — how elections work, tied to branches"
```

---

## Task 4: Section 3 — Checks and Balances (renumbered, content unchanged from original build)

**Files:**
- Modify: `us-elections.html` (the `#checks-balances` section — already relocated to sit after `#elections-mechanics`)

**Context:** This task's actual civics content was already written and reviewed clean under the plan's original numbering (as "Task 3"). Nothing about the content changes — only its position (now third instead of second) and its `<h2>`'s "Question N" label (now "Question 3" instead of "Question 2", already updated directly in the HTML during the reorder). If you are an implementer picking up this task fresh: **check the file first** — this section's content likely already exists and is already correct; this task entry exists in the plan for completeness/traceability, not because new work is expected. Only take action if you find the section is genuinely still a placeholder (it should not be, as of this reorder).

- [ ] **Step 1: Confirm the section is already complete, not a placeholder**

Run: `grep -n "Content added in Task" us-elections.html` scoped to the `#checks-balances` region — if no match exists there and the section already has real content (veto, veto override, judicial review via Marbury v. Madison, Senate confirmation, impeachment — all cited), this task is already done. Confirm the `<h2>`'s `q-label` correctly reads "Question 3" (not "Question 2") given its new position. If everything checks out, skip to Step 2 (a lightweight re-verification), not a full rewrite.

- [ ] **Step 2: Re-verify (do not rewrite working, already-reviewed content)**

Run: `open us-elections.html`, scroll to this section (now third), confirm it still renders correctly in its new position, confirm its citation links still resolve, confirm its quiz (`q2`, from the original build) still functions and that `q2` remains uniquely assigned to this section (Task 3's elections-mechanics quiz was directed to use `q3` specifically to avoid colliding with this one — confirm that held).

- [ ] **Step 3: Commit only if you actually changed something**

```bash
git add us-elections.html
git commit -m "chore: renumber US Elections checks-and-balances section (Question 2 -> 3)"
```

If Step 1 and Step 2 found nothing to fix (content already correct, no quiz-ID collision), no commit is needed for this task — note that explicitly rather than creating an empty commit.

---

## Task 6: The Update Pane — "Where Things Stand: The 2026 Midterms"

*(Note: there is no "Task 5" in this plan — an artifact of the mid-session renumbering when "How Elections Actually Work" moved from an original Task 5 slot to become the current Task 3. Nothing was skipped; every task 1 through 11 that appears in this document is complete and accounted for.)*

**Files:**
- Modify: `us-elections.html` (the `#update-pane` section — **note:** its HTML position moved mid-session, after Task 3 shipped, from originally sitting after Checks and Balances to now sitting first in `<main>`, immediately after the hero, before `#branches`. Find it by its `id="update-pane"`, not by its position relative to other sections — the placeholder content inside is unchanged, only its location in the file moved.)

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
- Current exact House/Senate seat totals by party (needed to compute "how many seats to flip control") and, separately, which specific 2026 House/Senate races a nonpartisan election forecaster (Cook Political Report, Sabato's Crystal Ball, Inside Elections, or similar — verify which has current, live, citable 2026 ratings at write time) rates as most competitive. This is new, added mid-session per an explicit project-owner request — treat it with the same verification rigor as everything else in this step, not as a lower-priority add-on.

- [ ] **Step 2: Build the update-pane structure**

Following `iran.html`'s exact `update-pane`/`mini-tl` markup pattern, build:
- A header with an Election-Day-countdown framing (not a "Day N" badge — see design doc).
- A `mini-tl` timeline with entries for: primaries/incumbent defeats, redistricting (the TX/CA contrast pair), retirements, and the Nov 3 Election Day entry itself with its seat counts.
- The "Who controls what, right now" fact block: clearly dated, stating party control of the presidency/House/Senate and naming the current Speaker/Majority Leader, followed by one paragraph connecting this to the midterms' stakes (tied back to Section 1's generic role explanations from Task 2).
- A `.vocab` box on the historical midterm pattern, framed explicitly as general political-science knowledge, not a 2026 prediction.
- **A "balance of power" fact block, added mid-session per explicit project-owner request:** state the mechanical stakes of a chamber flipping control — how many net seats the out-of-power party would need to gain to take the House majority, and separately for the Senate (verify the exact current seat totals for each chamber at write time, and confirm the math for "seats needed to flip"). Then name the specific House and/or Senate races that nonpartisan election forecasters (e.g., the Cook Political Report, Sabato's Crystal Ball, Inside Elections — verify which of these, if any, has current, citable 2026 race ratings at write time) currently rate as most competitive ("toss-up" or equivalent rating) this cycle. **Critical framing requirement:** cite each race's competitiveness rating directly to the forecaster's own published rating — never characterize a race as competitive, safe, or likely-to-flip based on this page's own judgment. If no forecaster's current 2026 ratings can be found and verified live at write time, do not force this block in with stale or fabricated ratings — note the gap and flag it for the controller rather than guessing at which races are "close."

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

## Task 7: Local Section — "Who Represents Alderwood?" (Washington's 32nd Legislative District & 2nd Congressional District)

**Files:**
- Modify: `us-elections.html` (new section, positioned after Checks and Balances (`#checks-balances`) and before the History Timeline (`#timeline`) — **not** after the national update-pane, which moved to the top of the page mid-session; this local section's position is unaffected by that move)

**Context:** Approved mid-session as an addition to the original 9-task plan — a locally-relevant section naming the specific officials and 2026 races that directly affect this site's own students (Alderwood Middle School, in the Edmonds School District, WA). This is the highest-nonpartisanship-risk task in the plan alongside Task 6, for a different reason: every one of the confirmed local officeholders happens to currently belong to the same party, which is a plain fact of who represents this specific district, not an editorial choice — the framing discipline below exists specifically to keep it presented that way.

**Pre-verified facts from scoping research (starting point only — independently re-verify at write time, per this project's established discipline; three separate research passes already corroborated each other on the items below, but re-confirm before publishing, especially anything sourced only to secondary news coverage rather than an official government record):**

| Fact | Confirmed via | Confidence |
|---|---|---|
| Alderwood Middle School (1132 172nd St SW, Lynnwood, WA) sits in WA's 32nd Legislative District | Snohomish County Elections district map, leg.wa.gov district description | High |
| WA-32 current legislators: Sen. Jesse Salomon, Rep. Cindy Ryu (Pos. 1), Rep. Lauren Davis (Pos. 2) | leg.wa.gov official member roster (primary source, not a secondary aggregator) | High |
| Alderwood MS sits in WA's 2nd Congressional District | Boundary descriptions (Census Bureau CD118 map, district office content) | Moderate-high — the official live address-lookup tool (app.leg.wa.gov/DistrictFinder) did not render during research; spot-check this directly with the exact school address before publishing |
| WA-02 current representative: Rick Larsen | congress.gov | High |
| WA's two US Senate seats: Maria Cantwell (term to Jan 2031, next election 2030), Patty Murray (term to Jan 2029, next election 2028) — **neither seat is up in 2026** | senate.gov official roster; independently corroborated by FEC.gov's 2026 WA Senate page showing zero registered candidates | High |
| WA-32 State Senate seat (Salomon's) IS up in 2026; filed candidates: Jesse Salomon (incumbent), Cindy Ryu, Ira McBee | leg.wa.gov term-expiration roster (confirms the seat is up) + two independent, dated local news sources (HeraldNet, July 3 & July 8, 2026) for the candidate list | High |
| WA-32 House Position 1 (Ryu's former seat, now open since she's running for Senate) — 6 filed candidates: Chris Bloomquist, Will Chen, Jenna Nand, Danica Noble, Keith Scully, Lisa Rezac | HeraldNet ("Six candidates vie for open House seat") + individual campaign-announcement coverage | High |
| WA-32 House Position 2 (Davis's seat) — filed candidates: Lauren Davis (incumbent), Imraan Siddiqi | My Edmonds News + Ballotpedia cross-check | High |
| WA-02 US House (Larsen's seat) IS up in 2026 (all US House seats are); filed candidates: Rick Larsen (incumbent), Devin Hermanson, Tomas Scheel, Edwin Feller | Two independent, dated news sources (HeraldNet and goskagit.com, both July 2026) naming identical candidates | High |
| A rumored additional candidate ("Raymond Pelletti") for WA-02 — **explicitly excluded, uncorroborated by any dated primary source** | N/A — do not use | Excluded |
| WA's governor is NOT up for election in 2026 (WA governors serve on the presidential cycle: 2024, 2028) | sos.wa.gov, Ballotpedia | High |
| 5 of 9 Washington Supreme Court seats (nonpartisan judicial elections, Positions 1, 3, 4, 5, 7) ARE up in 2026 | Ballotpedia "Washington Supreme Court elections, 2026"; TVW's "2026 Video Voters' Guide" (produced with the WA Secretary of State) | High — but candidate-level detail for these 5 races was not researched in depth; verify at write time if this level of detail is included |
| Filing deadline for these races was May 8, 2026; the primary is August 4, 2026 | Local news coverage corroborating the filing-week reporting above | High |
| Confirmed nonpartisan/appropriate sources: TVW.org (Washington's public-affairs network, C-SPAN-style state coverage, live with a "2026 Video Voters' Guide") and Axios Seattle (axios.com/local/seattle, live, actively publishing 2026 political coverage) | Direct site verification | High — note Axios requires a free email registration for full article access (not a payment paywall, but worth being aware of as a minor access consideration for students) |
| Third named source, per the project owner's explicit request: My Edmonds News (myedmondsnews.com) — a local Edmonds-area news outlet, already used once during scoping research as a corroborating source for the WA-32 House Position 2 candidate list. Returns 403 to a raw `curl` check (same bot-blocking pattern already seen on TVW.org/Axios, not itself evidence of being dead) — verify liveness via WebFetch at write time, per Step 1 below | Used once already during scoping research; re-verify directly at write time | Not yet independently re-confirmed as live via a non-curl method — treat as unconfirmed until Step 1 checks it |
| Fourth named source, per the project owner's explicit request: KUOW (kuow.org) — Seattle-area NPR member station, already used once during scoping research as a corroborating source for the WA-32 State Senate candidate filing. Confirmed genuinely live via a direct `curl` check (returns 200, no bot-blocking, unlike the other three named local sources) | Used once already during scoping research; direct curl check returned 200 | High — the one named source with a clean liveness confirmation already in hand, though re-verify the specific article/page used still supports its claim, not just that the domain loads |
| Fifth named source, per the project owner's explicit request: Cascade PBS (cascadepbs.org, articles at cascadepbs.org/articles/) — a Pacific Northwest public-media news outlet, not yet used during any prior scoping research pass for this task (unlike the other four). Confirmed genuinely live via direct `curl` checks (both the homepage and `/articles/` return 200) | Confirmed live via direct curl checks only — content/topical fit not yet independently verified, since no prior research pass touched this source | Liveness confirmed; genuinely search this source for WA-32/WA-02-relevant coverage at write time rather than assuming a fit exists just because the domain is live |

- [ ] **Step 1: Re-verify every fact in the table above against a live, current, official-record source where possible**

Per this project's established citation discipline: a live/200 URL is necessary but not sufficient — read what it actually says. Prioritize official government sources (leg.wa.gov, senate.gov, congress.gov, sos.wa.gov, FEC.gov) over secondary news coverage wherever a direct fetch is possible; where an official source can't be rendered (the research above hit this with sos.wa.gov's certification PDF and pdc.wa.gov's JS-loaded candidate database — both blocked automated fetching, not necessarily unavailable to a real browser), corroborate via at least two independent, dated news sources before using a fact, exactly as the scoping research did. Specifically re-attempt the WA-02 district-boundary confirmation via `app.leg.wa.gov/DistrictFinder` with the school's exact address, since this is the one item flagged as only moderate-high confidence.

- [ ] **Step 2: Build the section — "Who Represents Alderwood?"**

Following the same structural pattern as this page's other sections (`s-card`, `s-header`, `cite-link` citations), build a section covering, in order:

1. A brief framing paragraph: every student lives in specific state and federal districts, and this section shows which ones cover this school specifically, and what's on their 2026 ballot.
2. **WA's 32nd Legislative District** — name the current State Senator and two State Representatives by role, no party shown (per the confirmed framing decision). For each of the three seats, state plainly whether it's up for election in 2026, and if so, list every filed candidate by name and party (party IS shown here, since a multi-candidate list makes it informational rather than emphasizing one party's dominance — this differs from the officeholder-naming convention above, which deliberately omits party; both conventions were separately confirmed with the project owner, apply each in its correct place). For the Position 1 entry specifically, include the one piece of connective context confirmed appropriate: state plainly that Representative Ryu is not seeking reelection to this seat because she's running for the Senate seat instead — do not repeat or reference this fact in the Senate entry itself, it belongs only here.
3. **WA's 2nd Congressional District** — same treatment: name the current US Representative by role (no party), state the seat is up (all US House seats are, every 2 years), list every filed candidate with party shown.
4. **WA's US Senate seats** — name both current Senators by role (no party), then state plainly and clearly that **neither seat is up for election in 2026** (Senate terms are staggered 6-year terms; briefly note when each seat's next election actually is, tying back to Task 3's generic explanation of staggered Senate terms — Task 3, not Task 5, since the elections-mechanics section moved earlier in the mid-session reorder). This is itself a useful, concrete civics lesson (not every office is on every ballot) — present it that way, not as a gap in coverage.

**Candidate platform links, added mid-session per explicit project-owner request:** for every filed candidate named in items 2 and 3 above (every race that IS up in 2026 — not the Senate seats, which have no candidates since no race exists), add one link to that candidate's own stated platform in their own words: their official campaign website if one exists, or an official candidate statement (e.g., from the WA Secretary of State's Voters' Guide, which lets every candidate state their own views) if no campaign site can be found. **This project explicitly does NOT characterize, summarize, or describe what any candidate has supported or would support** — that determination was made deliberately after discussing the risk directly with the project owner: describing a candidate's record/positions in this page's own words would require editorial choices about which votes/positions to mention and how to frame them, which is a fundamentally different (and higher) risk than the plain candidate-list facts elsewhere in this section, especially given one local race (LD-32 Senate) pits two sitting officials against each other. Only link to the candidate's OWN words — never a third-party article characterizing them. Every filed candidate gets the same treatment, format, and prominence regardless of incumbent/challenger status — if a specific candidate has no findable official website or candidate statement, say so plainly ("no campaign website found") rather than silently omitting that candidate's link or substituting a news article about them.
5. Optionally, if Step 1's re-verification confirms sufficient detail is available: a brief mention that 5 of Washington's 9 Supreme Court seats are also up in 2026 (nonpartisan judicial elections — note explicitly that WA Supreme Court races are nonpartisan by design, which makes this a genuinely lower-risk addition than the partisan races above). Do not force this in if the research doesn't support it cleanly — the 4 partisan-race entries above are the required core of this section.

Cite TVW.org, Axios Seattle, My Edmonds News, KUOW, and Cascade PBS for at least one claim each where a genuine fit exists (per the project owner's specific request to feature all five sources — do not force a citation to any of these five if it doesn't actually best support the specific claim; official-record sources still take priority for the harder facts like exact term-expiration dates). This is the final, complete named-source list for this task — do not add further sources without a new explicit request.

- [ ] **Step 3: Apply the nonpartisanship test to every single sentence in this section — do not skip this, and give it the same rigor as Task 6's update-pane**

Read the entire section sentence by sentence. Specifically check: does any sentence characterize the fact that most of these local races currently have no Republican filer (Senate race, House Position 1) as good, bad, notable-in-a-charged-way, or a sign of anything? The correct, confirmed framing is to state candidate lists plainly and let the reader observe the composition themselves, exactly the same way a race with candidates from multiple parties would be stated — do not add commentary like "notably" or "interestingly" or "despite" anywhere near a candidate list. Also re-confirm the Ryu/Salomon incumbent-vs-incumbent framing followed the confirmed decision: stated as plain fact in the Senate entry ("filed candidates: Jesse Salomon, Cindy Ryu, and Ira McBee"), with the connective "why is there an open House seat" context living only in the House Position 1 entry, not repeated or editorialized in the Senate entry. **Separately, re-confirm the candidate platform links** contain zero characterization anywhere near them — the link label itself should be purely mechanical ("[Name] — campaign website" or "[Name] — no campaign website found"), with no adjective or framing suggesting this page has assessed the quality, credibility, or substance of what any candidate's platform actually says.

- [ ] **Step 4: Add a quiz for this section**

Add one entry to `quizzes` (e.g., testing "which of Washington's two US Senate seats is up for election in 2026?" with the correct answer being "neither" — a good test of whether the staggered-term concept from Task 3 actually landed) and the corresponding button.

- [ ] **Step 5: Verify**

Run: `open us-elections.html`, scroll to this section, confirm it renders correctly, click every citation link (including every TVW.org, Axios Seattle, My Edmonds News, KUOW, and Cascade PBS link actually used) to confirm each resolves and genuinely supports its claim, click every candidate platform link to confirm each one actually goes to that specific candidate's own campaign site/statement (not a mismatched link, not a third-party article about them), click the quiz button to confirm it functions. Re-read the section one more time specifically for nonpartisanship (a second pass, separate from Step 3's first pass).

- [ ] **Step 6: Commit**

```bash
git add us-elections.html
git commit -m "feat: add local WA-32/WA-02 representation section to US Elections page"
```

---

## Task 8: History Timeline, Key People, Videos, Resources

**Files:**
- Modify: `us-elections.html` (the `#timeline`, `#key-people`, `#videos`, `#resources` placeholder sections)

**Context:** Four smaller, lower-risk sections bundled into one task since each is a straightforward instantiation of an existing, well-understood component pattern (`.tl-item` timeline, `.person-card` grid, video embeds, resource links) — none requires the deep research or nonpartisanship scrutiny of Tasks 3, 6, and 7 (elections mechanics, the national update-pane, and the local WA-32/WA-02 section).

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

**Add a curated "Keep up with the 2026 midterms" subsection to Resources, per an explicit mid-session project-owner request.** This is a genuinely new pattern for this site (no existing page has a dated, periodically-refreshed current-events links list) — scope it carefully: a short (3-5 item), explicitly dated list of recent, nonpartisan articles/videos covering the 2026 midterms and general civics topics, each cited with its actual publication date. Follow the exact same sourcing discipline as every other citation on this page — fetch each candidate item directly, confirm it's genuinely nonpartisan in its own framing (not just from a neutral-sounding outlet), and confirm it's still live and non-paywalled at write time. Label this subsection with a visible "as of [DATE]" marker so a future reader can tell at a glance whether the list has gone stale — this list will need periodic refreshing the same way the update-pane does, and should be flagged as a refresh candidate the next time this page gets revisited, the same way Iran/Ukraine/AI's date stamps get checked on their own refresh cycles. Do not force exactly 3-5 items if fewer genuinely-good, verified candidates exist — a shorter, all-verified list is better than a padded one.

- [ ] **Step 6: Add quiz(es) for the timeline/people sections if appropriate**

Following the pattern of prior tasks — 1-2 more `quizzes` entries covering timeline/Key People facts, with corresponding buttons.

- [ ] **Step 7: Verify all four sections**

Run: `open us-elections.html`, scroll through all four sections, click every citation/resource link (including every item in the new "Keep up with the 2026 midterms" subsection), confirm images load correctly and match their captions, confirm any new quiz buttons function, confirm the curated-links subsection shows a visible "as of [DATE]" marker.

- [ ] **Step 8: Commit**

```bash
git add us-elections.html [any new image files]
git commit -m "feat: add US Elections history timeline, key people, videos, resources"
```

---

## Task 9 has been renumbered — see Task 11 below

*(This slot intentionally left without its own task: what was originally planned here — a small, mechanical "add a nav link + a regular topic-card" integration — was superseded mid-session by a bigger, explicit project-owner request (make US Elections the site's Featured Story, replacing Iran, which demotes to the regular grid). That larger task is scoped as Task 11 below, and — per explicit project-owner instruction — is sequenced to run LAST, after Task 10's full verification pass, specifically so the live site's front page is never pointed at unfinished, unreviewed content, even temporarily in an isolated worktree.)*

---

## Task 10: Full-Page Verification Pass (Including Dedicated Nonpartisanship Pass)

**Files:** None modified unless this step surfaces a real problem — verification only, except for the `MAX_PTS` fix flagged in Task 1.

- [ ] **Step 1: Fix the `MAX_PTS` placeholder from Task 1**

Count the actual number of quiz entries added across Tasks 2–8. Update `const MAX_PTS = 0;` (the intentionally-flagged Task 1 placeholder) to the real count. Confirm the points-bar UI correctly reflects this new max.

- [ ] **Step 2: Confirm no leftover placeholder content remains**

Run: `grep -n "\[Content added in Task\|TODO\|TBD\|placeholder" us-elections.html`
Expected: no matches (aside from the `MAX_PTS` comment already resolved in Step 1 — confirm that one specifically is gone too).

- [ ] **Step 3: Dedicated nonpartisanship read-through — the most important step in this task**

Read the ENTIRE page start to finish, specifically hunting for any sentence touching current politics. For each one, apply the test explicitly: would this read the same if the parties currently holding each role were swapped? Pay special attention to: the update-pane's "who controls what" fact block, any mention of specific incumbents who won/lost primaries, the redistricting discussion, and the historical midterm-pattern vocab box (confirm it's framed as historical knowledge, not a 2026 prediction). Give Task 7's local WA-32/WA-02 section this same scrutiny at least as carefully as the national update-pane — specifically re-confirm no candidate list anywhere in that section carries commentary about its partisan composition (several of the confirmed local races currently have all-Democratic or single-Republican fields; the section must present these plainly, the same way it would present a genuinely mixed-field race), and re-confirm the Ryu/Salomon incumbent-vs-incumbent context appears only once, in the House Position 1 entry, not repeated or editorialized in the Senate entry. This should be a genuinely separate pass from any fact-checking already done — checking "is this true" and checking "is this neutral" are different questions and both need their own pass.

- [ ] **Step 4: Confirm Key People stays scoped correctly**

Run: `grep -n "person-card" us-elections.html` and manually confirm every entry is a historical/framer figure, not a current sitting official — re-confirm this explicitly even though Task 8 already scoped it this way, since this is a hard constraint worth double-checking at the final gate. Note this check does NOT apply to Task 7's local section, which correctly names current officials by design (in a fact-block/list format, not a `person-card`) — confirm the two sections aren't confused with each other during this check.

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

In the browser, click every quiz button added across Tasks 2–8. Confirm each question/answer displays correctly and references a fact that's still accurately stated on the page.

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

## Task 11: Wire the New Page into the Site — Featured Story Swap

**Files:**
- Modify: `index.html`

**Context:** This task runs LAST, only after Task 10's full verification pass is complete and clean — a deliberate, explicit project-owner instruction, so the site's actual front page is never pointed at unfinished or unreviewed content, even temporarily in an isolated worktree. This is a bigger task than a typical "add a nav link and a grid card" integration (which is what this slot was originally scoped as, before this request): `index.html`'s top of page is a distinct "Featured Story" hero block (its own large image, a "🔴 Active Story" badge, kicker text, tags, and an intro paragraph) — visually and structurally different from the smaller `topic-card` grid below it. Iran currently occupies this Featured Story slot (with a `"Most Recent · Updated July 2026"` flag-label). Per explicit project-owner request: US Elections takes over the Featured Story slot, and Iran moves down into the regular topic-card grid, matching Ukraine's and AI's existing card format exactly.

- [ ] **Step 1: Read both existing patterns directly**

Read `index.html`'s current Featured Story block (search for `<!-- ─── FEATURED: IRAN ─── -->` and the `featured-grid`/`featured-image-wrap`/`featured-badge`/`featured-content` structure) AND the regular topic-card grid pattern (search for `topic-card` — Ukraine's and AI's cards, `card-image`/`card-badge`/`card-body`/`card-kicker`/`card-tags`/`card-foot`). Do not reconstruct either pattern from memory or from this brief's prose — read the real, current markup for both.

- [ ] **Step 2: Build US Elections' new Featured Story block**

Replace the Iran featured block's content with US Elections', following the exact same structural pattern (do not invent new classes or restructure the block itself):
- A hero image: since this page's own design deliberately has no real photos (a mid-session decision — see Task 9's note above), source a genuinely fitting, neutral, verified image for THIS specific spot — reconsider whether the "no images" decision was meant to apply to this new use (the featured hero slot on the LANDING page, not the article page itself) or whether it should stay consistent. If uncertain, flag this explicitly for the project owner rather than assuming either way — do not silently break the "no images on this page" decision, and do not silently force a landing-page hero image treatment that clashes with it either.
- Badge: `"🔴 Active Story"` or similar, matching the format Iran currently uses (check the exact existing wording/emoji convention before choosing).
- Kicker: something like "US Government · Elections · Civics" (adjust to match the actual kicker-format convention of the other 3 topics).
- Title: matching the actual page's `<title>`/`<h1>` wording.
- Tags: 2-4 tags matching the established `tag-region`/`tag-topic`/`tag-level` convention (e.g., `United States`, `Government`, `Elections`, `⭐ All levels`).
- Intro paragraph: 2-3 sentences summarizing the page's actual content — durable civics (three branches, checks and balances, how elections work) plus the live 2026 midterms thread. Apply the nonpartisanship test to this paragraph too, the same as every other sentence on this page — a landing-page teaser is not exempt from that discipline.
- Flag-label: replace `"Most Recent · Updated July 2026"` with equivalent wording reflecting US Elections' own actual update date (should match whatever date got used throughout `us-elections.html`'s own hero/footer).
- Buttons: `"Read the Full Story →"` linking to `us-elections.html`, plus a second button (Iran's second button links to `#videos` — decide whether US Elections should link similarly to its own `#videos` section, or to something more fitting like `#update-pane`).

- [ ] **Step 3: Demote Iran into the regular topic-card grid**

Add a new `topic-card` entry for Iran into the grid (alongside Ukraine and AI), following the EXACT structural pattern of Ukraine's/AI's existing cards (read them directly, per Step 1) — same `card-image`/`card-badge`/`card-body`/`card-kicker`/`card-tags`/`card-foot` structure, same badge format (`"🔴 Live"` or similar, matching whichever badge-color convention the site uses per topic), same tags/description/date-badge/reading-time format. Do not simply copy-paste the old Featured Story content into the smaller card format without adapting it to fit — a `topic-card`'s description paragraph is shorter than a Featured Story's intro paragraph; write a genuinely appropriately-sized version, don't force-fit the longer text.

- [ ] **Step 4: Update the site-nav**

Add `<a href="us-elections.html">🗳️ US Elections</a>` (or similar — confirm the emoji choice is genuinely neutral; a ballot box is a safe, established civics symbol, already used elsewhere on this page) to the `site-nav`, following the existing pattern's exact formatting. Confirm Iran's existing nav link is untouched (it still needs to work, just no longer points at the Featured Story visually).

- [ ] **Step 5: Verify**

Run: `open index.html`. Confirm: the new Featured Story block renders correctly with a working image (or a deliberate, confirmed-intentional no-image treatment, per Step 2's flag), all its links resolve to `us-elections.html` correctly; Iran's new grid card renders correctly and matches Ukraine's/AI's visual weight exactly (not larger, not smaller, not missing an element the others have); the site-nav's new link resolves; nothing else on the page (Ukraine's card, AI's card, the "Coming Soon" section) was accidentally altered.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: make US Elections the site's Featured Story, demote Iran to topic grid"
```

---

## Self-Review Notes

- **Spec coverage:** All design doc sections (page structure, update-pane content plan, history timeline, Key People scoping, sourcing/verification standard, out-of-scope list) map to Tasks 1–11 (Task 9 is a redirect note, not a standalone task — see below). Two significant mid-session revisions to the original design doc's page structure, both approved directly by the project owner after Task 3 (checks and balances, in the ORIGINAL numbering) had already shipped: (1) "How Elections Actually Work" was moved from Section 4 to Section 2 (now Task 3 in the plan) and rewritten to explicitly bridge back to Section 1's three-branches content — since "Elections" is half the page's own title but originally didn't appear until deep into durable civics content; (2) "How a Bill Becomes a Law" (originally Task 4) was cut from the plan entirely, before any content was written for it, since it was the most purely mechanical, least election-relevant section and cutting it tightens the page around its branches → elections → midterms-stakes thesis. Task 7 (local WA-32/WA-02 representation section, including candidate platform links added in a second mid-session revision) is an out-of-plan addition, approved after the project owner identified their own school's specific legislative and congressional districts — not present in the original design doc, but scoped using the same rigor (three separate research passes, each corroborating the others via official government rosters and multiple independent dated news sources) and the same nonpartisanship discipline as every other content task. Task 6 also gained a "balance of power" fact block (seats-needed-to-flip-control, cited to nonpartisan election forecasters' own ratings) per the same round of mid-session requests. A THIRD round of mid-session revisions, after Task 3 (new numbering, elections mechanics) shipped: the project owner flagged the page as too text-heavy, leading to two controller-added custom SVG diagrams (three branches, checks-and-balances) directly in Tasks 2/4's sections, and a curated "Keep up with the 2026 midterms" links subsection added to Task 8's Resources step. A dedicated general-photo-sourcing task was briefly proposed (as a Task 9) and then explicitly withdrawn by the project owner in the very next message ("we can skip the images") — no such task exists in the final plan; the two diagrams plus Key People's planned historical-figure portraits are this page's only images, by deliberate final decision, not an oversight. Separately, the update-pane's HTML position moved to the top of the page (immediately after the hero) to match Iran/Ukraine/AI's proven current-events-first pattern — this changed the update-pane's PLACEMENT in the finished page, not the ORDER tasks are implemented in (Task 6 still gets built after Tasks 2-4, since its content depends on facts those sections establish). A FOURTH round of mid-session revisions, after the update-pane's content shipped: the original Task 9 ("add a nav link + a small topic-card") was superseded by a much bigger explicit request — make US Elections the site's Featured Story on `index.html`, replacing Iran, which demotes to the regular topic-card grid. This is now Task 11, deliberately sequenced to run LAST (after Task 10's full verification pass), per explicit project-owner instruction, so the live site's actual front page is never pointed at unfinished or unreviewed content. The design doc's most distinctive requirement — nonpartisanship as a first-class, dedicated verification concern — is threaded through every content task's steps (not just Task 10's final pass), since waiting until the very end to check this would be far more expensive to fix than catching it section-by-section — this discipline is exactly why the candidate-platform-links addition was scoped as "link to their own words only," not "describe what they'd support," after discussing the risk directly with the project owner, and why Task 11's own landing-page teaser paragraph is explicitly held to the same nonpartisanship test as every sentence inside `us-elections.html` itself.
- **Placeholder scan:** Task 1's two intentional placeholders (`MAX_PTS = 0` and the `[Content added in Task N]` section stubs) are both explicitly flagged with a specific resolution step in a later task (Task 10 Step 1 and Tasks 2–8's content-writing steps respectively) — neither is a silent gap. No other placeholders appear in the plan.
- **Type consistency:** N/A (no code interfaces — HTML/CSS/JS content only, no typed signatures). Class/ID names (`s-card`, `update-pane`, `mini-tl`, `cite-link`, `vocab`, `callout`, `person-card`, `portrait-ring`, `tl-item`, `quiz-btn`, `site-nav`, `topic-card`, `diagram-wrap`, `diagram-caption`, `featured-grid`, `featured-image-wrap`, `featured-content`) are specified as "reuse `iran.html`'s/`index.html`'s exact pattern" throughout rather than reconstructed from memory, since this plan's core discipline is adaptation of proven, working markup — Task 11's `index.html` integration similarly instructs reading BOTH the existing Featured Story pattern and the regular topic-card pattern directly before writing, rather than guessing at either structure, since the task now needs both (one to build, one to demote Iran into).

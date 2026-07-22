# Climate Change Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new topic page, `climate-change.html`, from scratch, matching the established structure and conventions of `iran.html`/`ukraine.html`/`ai.html`/`us-elections.html` — durable geological/earth-science climate content plus a live update-pane tied to current climate-linked events and Washington's climate-policy status — and wire it into the site's index/nav. The defining constraint of this build: a geological/deep-time framing (not a policy-first framing) for the durable content, with data-driven charts as the primary visual approach instead of relationship diagrams, and the same nonpartisanship discipline the site now applies everywhere current policy is discussed.

**Architecture:** Task 1 scaffolds the entire page shell (CSS palette, shared JS engine — quiz system, points, easter eggs — nav, hero, points bar, footer) by adapting the proven, working engine already used by the four existing topic pages, with content-section placeholders. Tasks 2–8 fill in content section by section, each adding to the shared quiz-data object as they go. Task 6 (the Washington's Climate Story local section) and Task 7 (the update-pane) are this plan's two highest-nonpartisanship-risk tasks, mirroring how the US Elections build treated its own local-representation section and update-pane — each gets its own dedicated nonpartisanship pass, not just a single pass saved for the end. Task 9 is the full-page verification pass. Task 10 wires the new page into `index.html` by converting the existing "Coming Soon" Climate card into a live `topic-card` — this task runs LAST, after Task 9's verification pass, so the live site never points at unreviewed content, exactly matching the ordering discipline the US Elections plan used for its own final wiring task. Unlike the US Elections build, this page does NOT touch `index.html`'s Featured Story slot — US Elections currently occupies that slot and this plan leaves it there untouched.

**Tech Stack:** Plain HTML, no build step, no test runner. Verification is manual: grep checks, browser opens, citation-link clicks, and dedicated nonpartisanship read-throughs on the two highest-risk tasks plus a final whole-page pass.

## Global Constraints

- Write all new prose at a 5th–6th grade reading level (project convention). Some sections (particularly the Washington policy sub-section, given its factual density — dollar figures, dates, comparative data) may land slightly higher; treat that as an acceptable trade-off already established on prior pages, not a defect, provided the content stays genuinely as simple as the subject allows.
- Every factual claim gets an inline `<cite-link><a href="..." target="_blank">src</a></cite-link>` (matching the site's established pattern, not a footnote-list pattern) pointing to a real, currently-live, non-paywalled, nonpartisan source.
- Fetch and read every source directly to confirm it supports the specific claim it's cited for — a live/200 URL is necessary but not sufficient. Prioritize primary/authoritative sources for data claims: NOAA, NASA, USGS, EIA (U.S. Energy Information Administration), and Washington's own Department of Ecology/Department of Commerce for state-specific data, over secondary news coverage wherever a direct fetch is possible.
- **Nonpartisanship test, non-negotiable wherever Washington's climate policy is discussed (primarily Task 6)**: for every sentence touching the Climate Commitment Act/gas tax's reception or impact, ask explicitly: *would this sentence read the same regardless of which party or officials are associated with it?* State facts, dates, and dollar figures plainly. Attribute any characterization of "impact" or "reception" to a named, dated source's own findings — never assert it directly as the page's own judgment. Avoid editorializing adjectives near policy descriptions.
- Key People is scoped to historical figures only — a climate-science pioneer tied to greenhouse-effect discovery and a paleoclimatologist/ice-core-record figure — never current sitting officials or currently-active scientists in a political-advocacy role, regardless of how carefully a bio might be worded.
- No detailed climate-model methodology or future-projection scenarios. The deep-time section is about *past* evidence (ice cores, sediment, tree rings), not forward-looking model output — this keeps the geological framing consistent throughout.
- No personal-action/behavior-change prescriptions ("5 things you can do to fight climate change"). The footprint sub-section explains the concept and Washington's comparative standing; it does not tell students what to do.
- No international climate-policy mechanics (COP summits, the inner workings of international agreements) beyond a brief History Timeline mention — this page's local angle is Washington State, not international climate diplomacy.
- Images: Wikimedia Commons only, verified license (public domain/CC) AND subject-match confirmed directly on the file's own Commons page (not just an embedding Wikipedia article) — this project's citation discipline applies to images as much as text. Use the site's established honest "no verifiable image found" fallback (a `.person-emoji-fallback` div, or an equivalent stated disclosure) rather than a forced or unverified image citation.
- Reuse the existing site's shared component patterns (`update-pane`, `mini-tl`, `stat-grid`, `vocab`, `callout`, `person-card`, `tl-item`, quiz/points/easter-egg engine) exactly as implemented on the existing pages — no new CSS component types beyond what a chart genuinely requires (see Task 3's note on chart implementation), no new JS mechanics beyond what's needed to instantiate this page (a new quiz-data object, a new color palette).
- Data-driven charts (line/bar/pie), not multi-node relationship diagrams, are this page's default visual approach — carrying forward the lesson from the US Elections build, where a 6-relationship, 3-node diagram needed 3 full redesigns (circles → rectangles with arrows → a plain data table) before it was legible, because crossing connector lines made in-diagram labels illegible no matter how the nodes were arranged. Any diagram that must show a *process* (e.g., the greenhouse effect) must stay to a simple 2-3 step linear flow, matching the US Elections page's redesigned three-branches diagram — never a diagram with more than 2 connecting lines between more than 2 nodes. If a task's own verification step finds a diagram is hard to read once actually rendered (not just in isolation), treat that as a real, fixable defect worth flagging to the controller rather than shipping it as-is.
- Re-verify every date/figure/name against a live, nonpartisan source at write time — the design doc's proposed facts (Keeling Curve start year, IPCC founding year, candidate Key People) are starting points, not copy-paste-ready content.

---

## Reference Files

- **Design doc:** `docs/plans/2026-07-22-climate-change-design.md`
- **New page:** `climate-change.html`
- **Reference pages (for exact markup/JS patterns to adapt):** `us-elections.html` (most recently built, closest structural analog — has an update-pane, a local-representation-style section, inline SVG diagrams, and a curated dated-links subsection, all patterns this page reuses), `iran.html` (original source of the shared component system)
- **Index page (convert the existing Climate "Coming Soon" card to a live topic-card):** `index.html`

## Worktree Setup

This build happens in an isolated git worktree, matching the pattern established for the US Elections build.

- [ ] **Step 1: Create the worktree and branch**

```bash
cd /Users/shiebenaderet/Developer/current-events
git worktree add .claude/worktrees/climate-change -b worktree-climate-change
```

- [ ] **Step 2: Confirm the worktree has this plan and design doc available**

```bash
ls .claude/worktrees/climate-change/docs/plans/2026-07-22-climate-change-design.md
ls .claude/worktrees/climate-change/docs/plans/2026-07-22-climate-change-implementation.md
```

Both should exist (they're on `main` already, and the new worktree branches from `main`). All subsequent tasks in this plan operate inside `.claude/worktrees/climate-change`, not the main working directory — every `git` command in every task below assumes you're already in that worktree directory.

---

## Task 1: Scaffold the Page Shell

**Files:**
- Create: `climate-change.html`

**Context:** This task builds the entire page skeleton by adapting `us-elections.html`'s proven structure — CSS reset/variables/hero/nav/points-bar patterns, and the full shared JS engine (quiz system, points tracking, easter eggs, dyslexic-font toggle) — with a new, earth-science-appropriate color palette and empty/placeholder content sections that later tasks will fill in. Treat this as "port a working template," not "design a new one."

- [ ] **Step 1: Read the reference structure directly**

Read `us-elections.html` in full, or at minimum: the CSS reset/variables/hero (search for `<header class="hero">`), the `<nav class="sticky-nav">` block, the points-bar `<div>`, and the two `<script>` blocks near the end (search for `<script>`). Read `us-elections.html`'s update-pane markup too (search for `id="update-pane"`) since Task 7 will need this pattern later, and its `diagram-wrap`/SVG pattern (search for `diagram-wrap`) since Task 3 may need it. Do not write any of this from memory or from this plan's prose description alone — read the real, current markup.

- [ ] **Step 2: Create `climate-change.html` with the base HTML skeleton**

Start with:
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Climate Change: What the Rocks and Ice Tell Us – Student Resource</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Nunito:wght@400;600;700;800;900&family=Source+Serif+4:wght@400;600&display=swap" rel="stylesheet">
<link href="https://fonts.cdnfonts.com/css/opendyslexic" rel="stylesheet">
<style>
/* ─── RESET & BASE ─── */
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Nunito',sans-serif;background:#f7f4ee;color:#2c2c2c;line-height:1.7;font-size:17px;overflow-x:hidden;overflow-wrap:break-word}
</style>
</head>
<body>
</body>
</html>
```

Note `overflow-wrap:break-word` is included from the start on `body` — the US Elections build found and fixed a real mobile-width overflow bug late in that build, root-caused to flex children defaulting to `min-width:auto` and forcing ancestors wider than the viewport, with `overflow-x:hidden` silently clipping text instead of showing a scrollbar. This page should not need to rediscover that bug: apply `min-width:0` to every flex child that pairs a fixed-size icon/dot with a text sibling as you build each component in later tasks (the `.s-header`, `.callout-body`, `.tl-content`, `.update-pane-header` equivalents) — do not wait for a bug report to add it.

This page does not need the Leaflet.js map library — no task in this plan calls for an interactive map.

- [ ] **Step 3: Add a new CSS color palette**

Add CSS custom properties for an earth-science-appropriate palette — distinct from Iran's red/gold, Ukraine's blue/yellow, AI's blue/purple, and US Elections' navy/gold/green. Suggested (adjust as needed, but keep the overall feel geological/ice/PNW-forest, not a red/blue political binary — this page carries far less palette risk than US Elections since it's not fundamentally about partisan politics, but the Washington policy sub-section still means avoiding colors strongly associated with either major party as primary accents):
```css
:root{
  --cream:#f7f4ee;--warm-white:#fffdf8;
  --slate:#2e3d49;--slate-l:#44586a;--slate-ll:#e7edf1;
  --ice:#5fa8c9;--ice-l:#8fc4dc;--ice-ll:#e3f2f8;
  --forest:#2f6b4f;--forest-l:#e5f0e8;
  --border:#ddd6c5;--mid:#666;
  --shadow:0 4px 20px rgba(0,0,0,.1);
}
```
`--slate` reads as rock/stone (geological framing), `--ice` as glacier/ice-core evidence, `--forest` as PNW forest — three distinct accent colors available for the page's sections, mirroring how US Elections used navy/gold/green as three distinct section accents.

- [ ] **Step 4: Port the hero, sticky-nav, and points-bar structure**

Adapt `us-elections.html`'s hero/nav/points-bar markup to this page:
- Hero: title "Climate Change: What the Rocks and Ice Tell Us", subtitle summarizing the page's actual angle (deep-time evidence, what's different now, Washington's own climate story), hero-note with "Updated [DATE] · 8th Grade Social Studies · Earn points by answering quizzes!" (use the actual write date).
- Sticky-nav: anchor links for each of this page's sections, in this order: `#update-pane` (or equivalent id — confirm against Step 2 of Task 7), `#deep-time`, `#greenhouse-effect`, `#whats-different`, `#effects`, `#washington-climate`, `#timeline`, `#key-people`, `#videos`, `#resources`. Include a "🏠 All Topics" link to `index.html` and sibling links to `iran.html`, `ukraine.html`, `ai.html`, `us-elections.html` from the start, per this site's established cross-page-navigation convention (do not treat this as a later retrofit).
- Points-bar: identical structural pattern to `us-elections.html`, no changes needed beyond the container existing.

- [ ] **Step 5: Port the full shared JS engine**

Copy `us-elections.html`'s two `<script>` blocks into this new file. Adapt:
- The `quizzes` object: replace with an empty object for now (`const quizzes = {};`) — subsequent tasks will add entries as they build each section's quiz.
- `MAX_PTS`: set to `const MAX_PTS = 0; // TODO: update once all quizzes are added (final verification pass)` — an intentional, explicitly-flagged placeholder resolved in Task 9's Step 1, not a silent gap.
- Confirm `openQuiz`, `showToast`, and the points-tracking logic are copied verbatim (they're topic-agnostic) — do not modify their internal logic.
- Any US-Elections-specific easter-egg content (e.g., anything tied to a ballot-box or election-specific flag-click theme) — keep the generic mechanism (the `KONAMI` array, `flagClicks` counter, `showToast` function) but do not port election-specific *content* inside those mechanisms. Leave the trigger mechanism in place; a later task can add page-appropriate easter-egg content if desired, but this is not required by this plan.

- [ ] **Step 6: Add placeholder section containers**

Add empty placeholder `<section class="s-card">` containers (with a single explicitly-tracked placeholder sentence, e.g. `<p>[Content added in Task 3]</p>`) for each of: the update-pane (Task 7), Deep-Time Climate History (Task 3), The Greenhouse Effect (Task 4), What's Different This Time (Task 5), Effects Being Observed (Task 5, same task — see Task 5's own note on why these two are bundled), Washington's Climate Story (Task 6), History Timeline (Task 8), Key People (Task 8), Videos (Task 8), Resources (Task 8) — matching each container's exact class/id naming convention from `us-elections.html` (e.g., `<section class="s-card" id="deep-time">`).

- [ ] **Step 7: Verify the shell loads and functions**

Run: `open climate-change.html`. Confirm: the page loads with no console errors, the hero/nav/points-bar render with the new palette, clicking a nav anchor scrolls to the corresponding (placeholder) section, the dyslexic-font toggle button works, and no broken image/asset references exist (this shell shouldn't reference any images yet).

- [ ] **Step 8: Commit**

```bash
git add climate-change.html
git commit -m "feat: scaffold Climate Change page shell (CSS, JS engine, empty sections)"
```

---

## Task 2: Section 1 — Deep-Time Climate History

**Files:**
- Modify: `climate-change.html` (the `#deep-time` placeholder section)

**Context:** The page's defining opening content — establishes the geological-evidence framing (ice cores, sediment layers, tree rings) before any current-events or policy content appears. This section's chart is the page's first visual anchor and sets the tone that this page leans on data, not relationship diagrams.

- [ ] **Step 1: Verify facts before writing**

Confirm, via direct fetch of a primary/authoritative source (NOAA's paleoclimatology program, NASA's climate science pages, or USGS):
- How ice cores work as a climate record (trapped air bubbles reveal past atmospheric composition; layer counting reveals age, similar to tree rings).
- At least one specific, well-documented ice-core record with real data (e.g., the Vostok or EPICA Dome C Antarctic ice cores, which cover several hundred thousand years) — confirm the actual time range and what it shows (natural glacial/interglacial temperature cycles).
- That Earth's climate has shifted between ice ages and warmer periods multiple times over its history, driven by known natural causes (Milankovitch orbital cycles, volcanic activity, solar output) — confirm this is stated accurately and isn't confused with human-caused modern warming (that contrast is Task 5's job, not this section's).

- [ ] **Step 2: Write the section content**

Replace the `#deep-time` placeholder with real content, following the established `s-card`/`s-header`/`s-body` pattern with `<p>` tags, `<strong>` emphasis, and `cite-link` citations. Cover:
- How scientists know about climate from before written records or instruments existed — ice cores, ocean/lake sediment layers, tree rings, coral records — introduced plainly as "climate proxies."
- At least one concrete, named ice-core record and what it reveals about natural glacial cycles over a genuinely long timescale (hundreds of thousands of years).
- The natural drivers of past climate shifts (orbital changes, volcanic activity, solar variation) stated factually, setting up Section 3's "what's different this time" contrast without yet making that comparison directly.

- [ ] **Step 3: Build a data chart of long-timescale temperature**

Build a simple inline SVG line chart (following the same "no external chart library" discipline as this site's inline-SVG diagrams) plotting estimated global temperature (or temperature anomaly) over a long timescale using real ice-core proxy data from the source(s) verified in Step 1. Keep the chart to a single line (or two lines at most, e.g. estimated temperature and CO2 concentration on a shared timeline) — this is a genuinely numeric, non-relational visual, so it does not carry the crossing-lines risk of a node diagram, but keep axis labels legible and give the chart its own `diagram-wrap`-equivalent container with a caption stating the exact data source and time range plotted.

- [ ] **Step 4: Add a quiz for this section**

Add one entry to the `quizzes` object (`q1`) testing a fact from this section (e.g., "how do scientists know what Earth's climate was like hundreds of thousands of years ago?"). Add the corresponding `<button class="quiz-btn" onclick="openQuiz('q1')">` at the end of the section's content.

- [ ] **Step 5: Verify**

Run: `open climate-change.html`, scroll to this section, confirm it renders correctly, confirm the chart's data points are legible and the axis labels/caption are readable, click every citation link to confirm it resolves and genuinely supports its claim, click the quiz button to confirm it opens and functions.

- [ ] **Step 6: Commit**

```bash
git add climate-change.html
git commit -m "feat: add Climate Change Section 1 — deep-time climate history"
```

---

## Task 3: Section 2 — The Greenhouse Effect

**Files:**
- Modify: `climate-change.html` (the `#greenhouse-effect` placeholder section)

**Context:** The basic mechanism, in plain terms. This section's diagram must stay a simple linear flow (2-3 steps) — this is the section most likely to tempt a more elaborate diagram, since "the greenhouse effect" is often illustrated with multiple arrows (sunlight in, some reflected, some absorbed, re-radiated, trapped by gases, etc.) — resist that temptation per this plan's Global Constraints note on diagram complexity.

- [ ] **Step 1: Verify facts before writing**

Confirm, via a primary source (NASA Climate, NOAA, or a nonpartisan science-education source):
- The basic greenhouse-effect mechanism: sunlight passes through the atmosphere and warms Earth's surface; the surface radiates heat back; certain gases (water vapor, carbon dioxide, methane) absorb and re-radiate some of that heat rather than letting it escape to space, keeping the planet warmer than it would otherwise be.
- That this effect is naturally occurring and necessary for a habitable Earth — without it, Earth would be far colder — before any content about it being altered by human activity (that's Section 3's job).
- The names and basic sources of the main greenhouse gases (CO2, methane, water vapor) at a level appropriate for 8th graders, without getting into radiative-forcing math.

- [ ] **Step 2: Write the section content**

Replace the `#greenhouse-effect` placeholder. Explain the mechanism in plain terms, explicitly framing it as "normally a good thing" (habitable planet) before pivoting to "here's why more of these gases changes the balance" — a simple setup for Section 3, not yet the full human-causation argument.

- [ ] **Step 3: Build a simple linear diagram**

Build a simple inline SVG diagram showing, at most, a 3-step linear flow: sunlight arriving → surface warming/re-radiating heat → greenhouse gases trapping some of that heat. Use the same visual language established on `us-elections.html`'s redesigned three-branches diagram (rounded boxes or simple icons connected by 1-2 arrows, generous label spacing, no more than 2-3 connecting lines total). Do NOT attempt to show reflection/absorption/multiple wavelength paths in the same diagram — if the science content needs that nuance, put it in the prose, not the diagram. Verify the rendered diagram (not just an isolated prototype) via a headless-browser screenshot or equivalent before committing, matching the verification rigor the US Elections build eventually settled on for its own diagrams.

- [ ] **Step 4: Add a quiz for this section**

Add `q2` to `quizzes` testing the basic mechanism (e.g., "what happens to heat that greenhouse gases absorb?"). Add the corresponding button.

- [ ] **Step 5: Verify**

Run: `open climate-change.html`, scroll to this section, confirm it renders correctly, confirm the diagram's labels are legible and don't overlap the connecting line(s), click every citation link, click the quiz button to confirm it functions.

- [ ] **Step 6: Commit**

```bash
git add climate-change.html
git commit -m "feat: add Climate Change Section 2 — the greenhouse effect"
```

---

## Task 4: Section 3 — What's Different This Time

**Files:**
- Modify: `climate-change.html` (the `#whats-different` placeholder section)

**Context:** This section makes the rate-of-change argument and the basic human-causation case — the pivot from "climate has changed before" (Section 1) and "here's the mechanism" (Section 2) to "here's what's actually different about today." This is the section most likely to brush against topics that get politically charged in other contexts (human causation of climate change) — apply the nonpartisanship test here even though the *scientific* consensus itself is not a matter of political framing on this page; the discipline is about avoiding characterizing any political party's or country's position, not about hedging the underlying science.

- [ ] **Step 1: Verify facts before writing**

Confirm, via a primary source (NASA Climate, NOAA):
- The rate-of-change contrast: past natural climate shifts (from Section 1's ice-core record) occurred over thousands of years; the current warming trend has occurred over roughly a century, with the most rapid changes in recent decades — confirm the actual comparative rates from a primary source, not an approximation.
- The Keeling Curve: what it is (continuous direct atmospheric CO2 measurement, started at Mauna Loa Observatory), when it started (verify the exact year — the design doc flags 1958 as a starting point, confirm independently), and what it shows (a steady, measurable rise in atmospheric CO2 concentration since direct measurement began).
- The basic case for human causation: the timing and pattern of CO2 rise correlating with fossil-fuel combustion since industrialization, stated as the scientific evidence, not as a debate to be adjudicated on this page.

- [ ] **Step 2: Write the section content**

Replace the `#whats-different` placeholder. Open with an explicit callback to Section 1: "You just read about natural climate shifts that happened over thousands of years. Here's what's different about the change happening right now." Cover the rate-of-change contrast and the Keeling Curve's direct-measurement evidence.

- [ ] **Step 3: Build a rate-of-change chart**

Build a simple inline SVG chart showing the Keeling Curve (CO2 concentration over time since 1958, from real, verified data) OR an annotated version of Section 1's Task 2 chart zoomed into the recent past to visually contrast the rate of change — pick whichever is more achievable with genuinely verified data at write time; do not force both if only one has clean, verifiable data readily available. This remains a line chart (no crossing-lines risk), consistent with this plan's chart-first visual approach.

- [ ] **Step 4: Add a quiz for this section**

Add `q3` to `quizzes` testing the rate-of-change concept (e.g., "about how long did past natural climate shifts take, compared to the change happening now?"). Add the corresponding button.

- [ ] **Step 5: Verify**

Run: `open climate-change.html`, scroll to this section, confirm the opening sentence genuinely reads as a callback to Section 1, confirm the chart renders legibly, click every citation link, click the quiz button to confirm it functions.

- [ ] **Step 6: Commit**

```bash
git add climate-change.html
git commit -m "feat: add Climate Change Section 3 — what's different this time"
```

---

## Task 5: Section 4 — Effects Being Observed (with PNW Examples Folded In)

**Files:**
- Modify: `climate-change.html` (the `#effects` placeholder section)

**Context:** Global effects, illustrated using Pacific Northwest-specific examples as the concrete, local evidence — per the approved design doc, this is a deliberate scope decision: PNW content (Cascade glacier retreat, wildfire smoke seasons, Puget Sound sea level) is folded in here as illustrating evidence for global patterns, NOT split into a separate local section. The dedicated "Washington's Climate Story" section (Task 6) is reserved specifically for the gas tax/energy-mix/footprint sub-topics — do not duplicate PNW glacier/wildfire/sea-level content into that section; it belongs here.

- [ ] **Step 1: Verify facts before writing**

Confirm, via primary sources (NOAA, NASA, USGS, and for PNW-specific facts: the National Park Service for Mount Rainier/North Cascades glacier data, Washington State Department of Ecology or a university research source for Puget Sound sea-level/wildfire-smoke trend data):
- At least one global effect with real, cited data: sea level rise (global average trend), shifts in extreme weather patterns (frequency/intensity trends, not any single specific event framed as definitively caused by climate change), or ecosystem impacts.
- A specific, verified PNW example: glacier retreat on Mount Rainier and/or Mount Baker (confirm actual measured retreat data, not an approximation), and/or Puget Sound sea-level trend data, and/or a verified trend in PNW wildfire smoke season length/frequency (confirm via a primary source, not a single news article's framing of one bad year).

- [ ] **Step 2: Write the section content**

Replace the `#effects` placeholder. Cover 2-3 global effects, each illustrated with a genuine PNW example woven directly into that effect's paragraph (not a separate "meanwhile in Washington" aside) — e.g., the sea-level-rise paragraph cites both a global figure and Puget Sound's own measured trend; the glacier/ice paragraph cites both global glacier-retreat data and Mount Rainier's/Mount Baker's specific measured retreat.

- [ ] **Step 3: Add a quiz for this section**

Add `q4` to `quizzes` testing a fact from this section (e.g., a specific measured PNW effect). Add the corresponding button.

- [ ] **Step 4: Verify**

Run: `open climate-change.html`, scroll to this section, confirm it renders correctly, confirm the PNW examples read as woven into the global-effects prose rather than a bolted-on aside, click every citation link, click the quiz button to confirm it functions.

- [ ] **Step 5: Commit**

```bash
git add climate-change.html
git commit -m "feat: add Climate Change Section 4 — effects being observed, with PNW examples"
```

---

## Task 6: Washington's Climate Story (Dedicated Local Section)

**Files:**
- Modify: `climate-change.html` (the `#washington-climate` placeholder section)

**Context:** This is the highest-nonpartisanship-risk task in this plan, mirroring how the US Elections build treated its own local-representation section — give it a dedicated nonpartisanship pass, not just reliance on the final Task 9 pass. Three sub-topics, all previously scoped in the approved design doc: the gas tax/Climate Commitment Act, Washington's electricity/energy mix, and a carbon-footprint comparison. This section deliberately does NOT include the glacier/wildfire/sea-level PNW examples — those belong in Task 5's Effects section; keep this section tightly scoped to its three named sub-topics.

- [ ] **Step 1: Research the Climate Commitment Act / gas tax sub-topic**

Fetch primary sources directly (Washington State Department of Ecology's official Climate Commitment Act pages, Washington State Legislature's own bill-tracking records, and — for reception/impact claims specifically — at least two independent, dated news sources, since "how it's been received" and "whether it's had a measurable impact" are exactly the kind of claims this project's citation discipline requires corroborating rather than asserting from a single source) to confirm:
- What the Climate Commitment Act (or "gas tax," confirm the precise official/common name and how the two relate — the Climate Commitment Act is a cap-and-invest program; confirm whether "gas tax" in casual usage refers to this program specifically or to a related, separate fuel tax, and be precise about which one this section describes) actually is, mechanically, in plain terms.
- When it took effect (confirm the exact year).
- Revenue raised to date (confirm the actual reported figure and its "as of" date — this will need re-verification at write time, not copy-pasted from this plan).
- What the revenue funds (confirm specific, real programs it's been directed toward — transportation, clean energy, etc.).
- Whether there have been any public votes, repeal attempts, or notable public reactions — state these as plain, dated facts (e.g., "a 2024 ballot measure to repeal it was voted on; voters [rejected/approved] it by [X]%, per [source]") without characterizing the outcome as good or bad news for anyone.
- Any claims about the program's "impact" (e.g., on gas prices, on emissions) must be attributed explicitly to a named, dated source's own findings — do not have the page assert impact directly, and do not average/synthesize conflicting claims from different sources into a single unattributed statement.

- [ ] **Step 2: Research Washington's electricity/energy mix sub-topic**

Fetch primary sources directly (U.S. Energy Information Administration's Washington state profile, and/or Washington State Department of Commerce) to confirm:
- Washington's actual electricity generation mix by source (hydropower, wind, solar, natural gas, nuclear, other) with real, dated percentages.
- The Columbia River hydropower system's role specifically (Grand Coulee Dam is a strong, genuinely distinctive PNW story — confirm its actual generation capacity/role in the state's mix, don't just assert it's "big").
- How Washington's mix compares to the U.S. national average, stated factually (e.g., "Washington gets a much larger share of its electricity from hydropower than most states" — confirm the actual comparative figures, don't approximate).

- [ ] **Step 3: Research the carbon-footprint sub-topic**

Fetch a primary source (EPA, EIA, or an academic/research source with a citable per-capita emissions dataset) to confirm:
- A plain-language definition of "carbon footprint" appropriate for 8th graders.
- Washington's actual per-capita carbon footprint/emissions figure and how it compares to the national average and to a few other named states — confirm the real, dated comparative data. Frame this factually and comparatively; do not frame it as a value judgment on individual Washingtonians' behavior (this section explains a fact about the state's aggregate energy/economic profile, largely driven by its energy mix from Step 2 — e.g., a state with heavy hydropower use will tend to have relatively lower per-capita electricity-related emissions than a state relying more on fossil fuels for power generation, which is a structural fact worth connecting back to Step 2's content, not a comment on individual choices).

- [ ] **Step 4: Build the section**

Following the established `s-card`/`s-header`/`s-body`/`vocab`/`cite-link` pattern, build "Washington's Climate Story" covering, in order: (1) the Climate Commitment Act/gas tax sub-topic, (2) Washington's electricity/energy mix sub-topic (with a pie or bar chart of the generation mix — a genuinely numeric, non-relational visual), (3) the carbon-footprint sub-topic, explicitly connecting it back to the energy-mix content from sub-topic 2.

- [ ] **Step 5: Apply the nonpartisanship test to every single sentence in this section — do not skip this**

Read the entire section sentence by sentence, specifically the Climate Commitment Act sub-topic (the highest-risk content in this section). For each sentence touching the policy's reception, impact, or any public vote/reaction: would this read the same regardless of which party or officials are associated with the policy? Check specifically for: editorializing adjectives near the policy description ("controversial," "successful," "unpopular" used as the page's own characterization rather than attributed to a named source); any framing that implies the page has taken a position on whether the policy is good or bad; any claim about "impact" that isn't explicitly attributed to a specific, named, dated source.

- [ ] **Step 6: Add a quiz for this section**

Add `q5` to `quizzes` testing a fact from this section (e.g., "what is Washington's largest source of electricity?"). Add the corresponding button.

- [ ] **Step 7: Verify**

Run: `open climate-change.html`, scroll to this section, confirm it renders correctly, confirm the energy-mix chart is legible, click every citation link (including any news sources cited for the Climate Commitment Act's reception) to confirm each resolves and genuinely supports its claim, click the quiz button to confirm it functions. Re-read the section one more time specifically for nonpartisanship (a second pass, separate from Step 5's first pass).

- [ ] **Step 8: Commit**

```bash
git add climate-change.html
git commit -m "feat: add Washington's Climate Story section (gas tax, energy mix, footprint)"
```

---

## Task 7: The Update Pane — "Where Things Stand"

**Files:**
- Modify: `climate-change.html` (the `#update-pane` section — build its content here; per Task 1's Step 4, its HTML should already sit first in `<main>`, immediately after the hero, matching every other page's pattern of live content leading and durable background following)

**Context:** This is the other highest-nonpartisanship-risk task in this plan, alongside Task 6. Read `us-elections.html`'s actual `update-pane`/`mini-tl` markup directly (search for `id="update-pane"` in that file) to copy the exact structural pattern.

- [ ] **Step 1: Verify every fact in this section against a live, current source**

For each of the following, fetch a primary source directly and confirm the specific fact (a live/200 URL is necessary but not sufficient — read what it actually says):
- Recent notable climate-linked events, both global and PNW-specific, with real dates: e.g., recent notable heat waves, floods, or wildfire seasons (global) and any recent PNW-specific event (wildfire season severity, drought, flooding) — verify each via a primary meteorological/scientific source (NOAA, NWS) or, where a specific event's occurrence is being cited, at least one dated, reputable news source corroborating the primary source's data.
- Washington's current climate-policy status: the Climate Commitment Act's current status (confirm whether any change has occurred since Task 6's research — the update-pane should reflect the state as of the actual write date, which may be more current than Task 6's research if time has passed between tasks), current state emissions targets and any published progress-against-target data (Washington State Department of Ecology should have this).
- Confirm the exact write date this section will use, and make sure every "as of" claim in this pane uses that same date consistently (per this project's established date-specificity discipline — never write "now" or "currently" without an explicit date attached).

- [ ] **Step 2: Build the update-pane structure**

Following `us-elections.html`'s exact `update-pane`/`mini-tl` markup pattern, build:
- A header framing this as a dated snapshot (not an open-ended "state of climate" claim — explicitly time-boxed, matching how the US Elections pane framed itself as "as of [date], before any 2026 votes are counted").
- A `mini-tl` timeline with entries for the recent climate-linked events verified in Step 1 (both global and PNW).
- A "Washington's climate policy, right now" fact block: the Climate Commitment Act's current status, revenue/target progress, stated plainly and dated, cross-referencing Task 6's Climate Commitment Act sub-topic for the fuller explanation (this pane gives the current snapshot; Task 6 gives the fuller "what is it and how's it been received" background — don't duplicate Task 6's full explanation here, just the current-status headline).

- [ ] **Step 3: Apply the nonpartisanship test to every single sentence in this section — do not skip this**

Read the entire update-pane sentence by sentence. For any sentence touching Washington's climate policy status: would this read the same regardless of which party or officials are associated with it? This section carries real nonpartisanship risk (state policy status) even though it's framed as a factual snapshot — treat this with the same rigor as Task 6's dedicated pass.

- [ ] **Step 4: Add a quiz for this section**

Add `q6` to `quizzes` testing a fact from this pane. Add the corresponding button.

- [ ] **Step 5: Verify**

Run: `open climate-change.html`, scroll to the update-pane, confirm it renders with the same visual quality as the other pages' update-panes, click every citation link, click the quiz button, and re-read the section one more time specifically for nonpartisanship (a second pass, after Step 3's first pass).

- [ ] **Step 6: Commit**

```bash
git add climate-change.html
git commit -m "feat: add Climate Change update-pane — where things stand"
```

---

## Task 8: History Timeline, Key People, Videos, Resources

**Files:**
- Modify: `climate-change.html` (the `#timeline`, `#key-people`, `#videos`, `#resources` placeholder sections)

**Context:** Four smaller, lower-risk sections bundled into one task since each is a straightforward instantiation of an existing, well-understood component pattern — none requires the deep research or nonpartisanship scrutiny of Tasks 6 and 7.

- [ ] **Step 1: Verify History Timeline facts**

Confirm each candidate entry (all flagged in the design doc as starting points, not pre-verified facts) against a reputable science-history source:
- 19th-century greenhouse-effect discovery — research and confirm the specific figure(s) and date(s) (Eunice Foote's 1856 experiments and/or Svante Arrhenius's 1896 calculations are both flagged as candidates — verify which is the more appropriate/well-documented entry, or include both with correct dates and correct, distinct credit for what each actually demonstrated; do not conflate their separate contributions into one blurred claim).
- The Keeling Curve's start (design doc flags 1958 — this may already be independently verified from Task 4's research; confirm it here too and reuse, don't re-research from scratch if Task 4 already nailed this down).
- The IPCC's founding (design doc flags 1988 — verify independently).
- The Paris Agreement (design doc flags 2015 — verify independently; per this plan's Global Constraints, this is the appropriate depth for this topic on this page — a brief, accurate timeline mention, not a deep dive into international climate-policy mechanics).

- [ ] **Step 2: Build the History Timeline**

Following `us-elections.html`'s `.tl-item` pattern exactly, add each verified entry with a real citation.

- [ ] **Step 3: Research and select 2 Key People (historical figures only)**

Per the design doc's confirmed scoping decision: one climate-science pioneer tied to greenhouse-effect discovery (a strong candidate is whichever figure Step 1 confirmed as the primary/best-documented greenhouse-effect discovery credit — Eunice Foote and/or Svante Arrhenius), and one paleoclimatologist or ice-core-record figure (research and verify a specific, well-documented figure tied to ice-core climate science — do not guess, confirm via a reputable source; a strong candidate category is a scientist associated with a major ice-core drilling program, e.g. Vostok or EPICA, but confirm a specific, real, well-documented individual rather than asserting an uncredited "scientists discovered" framing). Do NOT include any currently-active scientist in a political-advocacy role, and do NOT include any current sitting official under any circumstance — this is this site's established hard rule, not something to revisit mid-implementation.

- [ ] **Step 4: Build the Key People section**

Following `us-elections.html`'s `.person-card`/`.portrait-ring` pattern, add each figure with a real photo (verify licensing directly on the image's own Wikimedia Commons file page — public domain/CC, correct subject match — per this project's established image-sourcing discipline). If no verifiable portrait exists for a candidate figure, either find a different, verifiable figure or use this project's established honest-disclosure fallback pattern (a `.person-emoji-fallback` div plus a stated "we could not find a real photo of them that we were allowed to use" disclosure, matching the precedent already set on `iran.html`).

- [ ] **Step 5: Build Videos and Resources sections**

Following the established pattern for embedded video content and ranked-resource lists. Source genuinely nonpartisan, reputable science-education videos/resources (e.g., NASA Climate Kids, NOAA education resources, established science-education nonprofits) — verify each source directly before including it, and specifically check that any video/resource itself is nonpartisan in its own framing, not just that its host organization has a neutral-sounding or authoritative-sounding name.

**Add a curated "Keep up with climate news" subsection to Resources, matching the US Elections page's "Keep up with the 2026 midterms" pattern.** A short (3-5 item, fewer is fine if that's all that's genuinely verified), explicitly dated list of recent, nonpartisan articles/videos covering current climate science or Washington's climate policy specifically, each cited with its actual publication date. Follow the exact same sourcing discipline as every other citation on this page — fetch each candidate item directly, confirm it's genuinely nonpartisan in its own framing, confirm it's still live and non-paywalled at write time. Label this subsection with a visible "as of [DATE]" marker, flagged as a future refresh candidate the same way the update-pane and this same subsection on the US Elections page are.

- [ ] **Step 6: Verify all four sections**

Run: `open climate-change.html`, scroll through all four sections, click every citation/resource link (including every item in the "Keep up with climate news" subsection), confirm images load correctly and match their captions (or the honest-disclosure fallback displays correctly if no image was found), confirm any new quiz buttons function, confirm the curated-links subsection shows a visible "as of [DATE]" marker.

- [ ] **Step 7: Commit**

```bash
git add climate-change.html [any new image files]
git commit -m "feat: add Climate Change history timeline, key people, videos, resources"
```

---

## Task 9: Full-Page Verification Pass (Including Dedicated Nonpartisanship Pass)

**Files:** None modified unless this step surfaces a real problem — verification only, except for the `MAX_PTS` fix flagged in Task 1.

- [ ] **Step 1: Fix the `MAX_PTS` placeholder from Task 1**

Count the actual number of quiz entries added across Tasks 2–8 (this plan anticipates `q1` through `q6`, one per Task 2 through Task 7, but confirm the real count directly from the file rather than trusting this plan's arithmetic — Task 8 may or may not have added further quiz entries). Update `const MAX_PTS = 0;` to the real count. Confirm the points-bar UI correctly reflects this new max.

- [ ] **Step 2: Confirm no leftover placeholder content remains**

Run: `grep -n "\[Content added in Task\|TODO\|TBD\|placeholder" climate-change.html`
Expected: no matches (aside from the `MAX_PTS` comment already resolved in Step 1 — confirm that one specifically is gone too).

- [ ] **Step 3: Dedicated nonpartisanship read-through — the most important step in this task**

Read the ENTIRE page start to finish, specifically hunting for any sentence touching Washington's climate policy or any other content that could read as taking a political position. For each one, apply the test explicitly: would this read the same regardless of which party or officials are associated with it? Give the Washington's Climate Story section (Task 6) and the update-pane (Task 7) this same scrutiny at least as carefully as they already received in their own dedicated passes — this should be a genuinely separate, fresh read, not a rubber-stamp of Task 6/7's own self-review. Specifically re-confirm: no editorializing adjectives near the Climate Commitment Act's description; every "impact" or "reception" claim is attributed to a named, dated source; the update-pane's policy-status fact block reads as a neutral snapshot, not an argument for or against the policy.

- [ ] **Step 4: Confirm Key People stays scoped correctly**

Run: `grep -n "person-card" climate-change.html` and manually confirm every entry is a historical figure, not a current sitting official or currently-active political-advocacy figure — re-confirm this explicitly even though Task 8 already scoped it this way.

- [ ] **Step 5: Re-verify all citation links resolve**

Extract and check every `https://` URL in the file:

```bash
grep -oE 'href="https://[^"]+"' climate-change.html | sed -E 's/^[^:]+:href="//;s/"$//' | sort -u > /tmp/climate-change-links.txt
wc -l /tmp/climate-change-links.txt
while read -r url; do
  code=$(curl -s -o /dev/null -w "%{http_code}" -A "Mozilla/5.0" -L --max-time 10 "$url")
  echo "$code $url"
done < /tmp/climate-change-links.txt | sort -n
```

For anything that returns non-200 (especially 403), don't conclude it's dead — this project's established pattern is that some legitimate sites (government domains, some news sites) bot-block curl but work fine for real readers. Cross-check any non-200 result with a direct fetch tool before concluding anything is actually broken.

- [ ] **Step 6: Confirm every quiz functions and covers a fact still present on the page**

In the browser, click every quiz button added across Tasks 2–8. Confirm each question/answer displays correctly and references a fact that's still accurately stated on the page.

- [ ] **Step 7: Confirm reading level**

Spot-check several sections against the stated 5th–6th grade target (a quick Flesch-Kincaid check, or careful manual read for sentence complexity/vocabulary). Flag (don't necessarily rewrite everything, use judgment) any section that reads notably harder than the rest — the Washington's Climate Story section may run slightly higher given its factual density, which is an acceptable, expected trade-off per this plan's Global Constraints, not a defect to force-fix.

- [ ] **Step 8: Confirm zero structural/CSS drift from the established site pattern**

Compare `climate-change.html`'s CSS class names and JS function signatures against `us-elections.html`'s — confirm this new page reuses the SAME class names for shared components (`update-pane`, `mini-tl`, `s-card`, `cite-link`, `vocab`, `callout`, `person-card`, `tl-item`, `quiz-btn`, `diagram-wrap`, `diagram-caption`) rather than inventing parallel-but-different names, which would fragment the site's component system.

- [ ] **Step 9: Confirm mobile-width text does not clip**

Per this plan's Task 1 note, `min-width:0` should already be applied to every flex child pairing a fixed-size icon/dot with text (mirroring the real bug found and fixed late in the US Elections build). Confirm this was actually applied consistently: grep for every `display:flex` rule in the file's `<style>` block, and for each one that pairs a fixed-size element with a text sibling, confirm the text-holding child has `min-width:0`. If the local testing environment cannot reliably render below ~500px CSS viewport width (a real limitation hit during the US Elections build's own verification), do a careful code-level check rather than relying solely on a screenshot, and note in this task's completion report if a live device check is still needed.

- [ ] **Step 10: Final commit if any fixes were needed**

```bash
git add climate-change.html
git commit -m "fix: address verification-pass findings in Climate Change page build"
```

If no fixes were needed beyond Step 1's `MAX_PTS` update, note that explicitly rather than leaving it ambiguous whether this step ran.

---

## Task 10: Wire the New Page into the Site

**Files:**
- Modify: `index.html`

**Context:** This task runs LAST, only after Task 9's full verification pass is complete and clean — so the site's actual front page is never pointed at unfinished or unreviewed content, matching the exact ordering discipline the US Elections build used for its own final wiring task. Unlike that build, this task does NOT touch the Featured Story slot — US Elections currently occupies it and stays there; this task only converts the existing Climate "Coming Soon" card into a live topic-card and adds a nav link.

- [ ] **Step 1: Read the existing Climate "Coming Soon" card and a live card directly**

Read `index.html`'s current Climate card (search for `<!-- Card: Climate -->` — it currently reads `class="topic-card coming-soon fade-up delay-3"` with a `<div class="soon-overlay">`, a `card-image-placeholder` emoji, and a `badge-soon` badge reading "Coming Soon") AND at least one live card for comparison (search for `<!-- Card: AI & Society -->` or `<!-- Card: Iran -->` — both use `topic-card` without `coming-soon`, an `<a href=...>` wrapper instead of a `<div>`, a real `<img>` with an `onerror` fallback, and a `badge-live` badge). Do not reconstruct either pattern from memory — read the real, current markup for both.

- [ ] **Step 2: Convert the Climate card from "Coming Soon" to live**

Replace the existing Climate `<div class="topic-card coming-soon ...">` block with an `<a href="climate-change.html" class="topic-card fade-up delay-3" style="text-decoration:none;color:inherit">` wrapper, following the exact structural pattern of a live card:
- Remove the `coming-soon` class and the `<div class="soon-overlay"></div>` element entirely.
- Card image: either a real, verified Wikimedia Commons image appropriate for this topic (if one is sourced and verified during this task — check licensing directly on the Commons file page, same discipline as every other image on this site) with an `onerror` fallback to the existing `card-image-placeholder`/🌍 emoji treatment, or — if no image is sourced for this specific spot — keep the `card-image-placeholder`/🌍 treatment as the deliberate, permanent visual (not a "coming soon" placeholder, a genuine final choice), matching how `us-elections.html`'s own Featured Story slot was rebuilt with a gradient+emoji-then-later-a-real-photo pattern (see that page's own git history for the two-step precedent if useful context).
- Badge: replace `badge-soon`/"Coming Soon" with `badge-live` and a color-coded "Live" label (e.g., `🟢 Live`, matching the established pattern of each topic having its own badge-emoji color — confirm no other live card already uses whichever color you pick, to keep them visually distinct).
- Card body: update the `<h3>` title to match `climate-change.html`'s actual title, rewrite the description paragraph to an appropriately SHORT card-length version (not a copy-paste of any longer section intro), update `card-tags` to 2-3 tags fitting this page's actual content (e.g., `Global`, `Environment`, `Washington State`), update `card-foot` to show `📅 Updated [actual date]` and a realistic reading-time estimate (matching how other cards state theirs) instead of "🕐 Not yet published."

- [ ] **Step 3: Update the site-nav**

Add a nav link for Climate Change to the `site-nav` (search for `<nav class="site-nav">`), following the existing pattern's exact formatting (e.g., `<a href="climate-change.html">🌍 Climate</a>` or similar — confirm the emoji choice reads as neutral/topical, not tied to any advocacy framing). Confirm every existing nav link (US Elections, Iran, AI & Society, Ukraine) is untouched.

- [ ] **Step 4: Verify**

Run: `open index.html`. Confirm: the Climate card renders correctly as a live card (not "coming soon"), matches the other live cards' visual weight exactly (not larger, not smaller, not missing an element the others have), its link resolves to `climate-change.html` correctly; the site-nav's new link resolves; nothing else on the page (the Featured Story slot, other live cards, the remaining "Coming Soon" cards for Immigration/Gun Violence/Space Race) was accidentally altered.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: convert Climate Change from Coming Soon to a live topic-card"
```

---

## Self-Review Notes

- **Spec coverage:** All design doc sections (page structure items 1–10, nonpartisanship discipline, sourcing standards, reading level, out-of-scope list) map to Tasks 1–10 in this plan. The design doc's "Section 4 — Effects Being Observed" with PNW examples folded in (rather than split into a separate local section) is implemented as Task 5, with an explicit note directing implementers not to duplicate that content into Task 6's Washington's Climate Story section, which is reserved for the three sub-topics (gas tax, energy mix, footprint) the design doc scoped there specifically. The design doc's out-of-scope items (no international climate-policy mechanics beyond a timeline mention, no climate-model/future-projection content, no personal-behavior prescriptions) are carried into this plan's Global Constraints section so every task inherits them, not just the tasks that would obviously touch them.
- **Placeholder scan:** Task 1's two intentional placeholders (`MAX_PTS = 0` and the `[Content added in Task N]` section stubs) are both explicitly flagged with a specific resolution step in a later task (Task 9 Step 1, and Tasks 2–8's content-writing steps respectively) — neither is a silent gap. No other placeholders appear in this plan; every research step names specific candidate facts/figures/dates to verify rather than leaving anything as "TBD," and every deliberately-deferred decision (exact Key People names, exact palette hex values, whether to source a real image for the demoted-card Climate topic-card) is explicitly flagged as "confirm/decide at implementation time" rather than silently assumed.
- **Type consistency:** N/A (no code interfaces — HTML/CSS/JS content only, no typed signatures). Class/ID names (`s-card`, `update-pane`, `mini-tl`, `cite-link`, `vocab`, `callout`, `person-card`, `portrait-ring`, `tl-item`, `quiz-btn`, `site-nav`, `topic-card`, `diagram-wrap`, `diagram-caption`) are specified as "reuse `us-elections.html`'s/`index.html`'s exact pattern" throughout, consistent with the site's core discipline of adapting proven, working markup rather than inventing parallel systems. Quiz IDs are pre-assigned sequentially per task (`q1` Task 2, `q2` Task 3, `q3` Task 4, `q4` Task 5, `q5` Task 6, `q6` Task 7) to avoid the kind of quiz-ID collision the US Elections build had to catch and correct mid-build when its own section order was reshuffled — if this plan's task order changes during implementation, whoever makes that change is responsible for re-checking quiz-ID uniqueness directly against the live `quizzes` object, the same discipline the US Elections build eventually adopted after its own collision.

# Gun Violence & School Safety Policy Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new topic page, `gun-violence.html`, from scratch, matching the established structure and conventions of `immigration.html`/`iran.html`/`ukraine.html`/`ai.html`/`us-elections.html`/`climate-change.html` — a policy-and-prevention-first explainer running from the Second Amendment's landmark laws through today's school-safety measures and policy mechanics, a live update-pane, a Washington-specific policy section, and a distinctive international-comparison section — and wire it into the site's index/nav. This is likely the highest nonpartisanship-risk page built on this site to date; it reuses Immigration's differing-perspectives component (not a new one) for the update-pane's genuinely contested current policy questions, and introduces one new, non-negotiable content rule: a balanced-pair-or-nothing "Groups Working on This Issue" resources subsection.

**Architecture:** Task 1 scaffolds the page shell by adapting `immigration.html`'s proven structure (the most recently built, most refined reference implementation, including the `.term` tooltip component already built and proven). Tasks 2-5 build the durable content arc (Sections 1-4) in order. Task 6 builds the update-pane, including reusing the differing-perspectives component — this plan's single highest-risk task. Task 7 builds Washington's School Safety Story (a policy section, lower risk than Task 6 by design). Task 8 builds the international-comparison section (settled-fact content, no differing-perspectives treatment). Task 9 covers History Timeline, Key People, Videos, and the base Resources grid. Task 10 builds the "Groups Working on This Issue" balanced-pair subsection as its own task, given its non-negotiable composition rule. Task 11 sources at least one real, verified, non-graphic image per major section — built in from the start as its own task (unlike `immigration.html`, where this was added mid-build after the page was already text-heavy). Task 12 is a dedicated grade-level review pass — also built in from the start per explicit project-owner direction, rather than discovered as a gap after Task 14's initial ship the way it was on `immigration.html`. Task 13 is the full-page verification pass, including a fresh, independent nonpartisanship read-through of every section and a check that Tasks 10-12's groups/images/reading-level work all resolve correctly. Task 14 wires the new page into `index.html` and adds sibling-nav links across every other page — runs LAST, after Task 13 is clean, matching the exact ordering discipline every prior page build on this site has used.

**Tech Stack:** Plain HTML, no build step, no test runner. Verification is manual: grep checks, browser opens, citation-link clicks, and dedicated nonpartisanship read-throughs on Tasks 6 (update-pane/differing-perspectives), 7 (Washington policy section), 8 (international comparisons), and 10 (advocacy-groups balance), plus a final whole-page pass in Task 13.

## Global Constraints

- **Write all new prose at true 5th-6th grade reading level from the first draft** — short sentences (~12-15 words), one idea per sentence, plain vocabulary, jargon carried by `.term` inline tooltips (ported from `immigration.html` in Task 1) rather than left in prose as parentheticals. This is a first-draft requirement per the design doc, not deferred to Task 12's review pass — Task 12 exists to catch drift, not to do the simplification work for the first time. The update-pane's Part A/Part B content may land slightly higher given factual density, matching this site's standing accepted trade-off, but still prefer short sentences wherever content allows.
- Every factual claim gets an inline `<a class="cite-inline" href="..." target="_blank">src</a>` (confirm exact markup from `immigration.html` — do not assume, read the real file), pointing to a real, currently-live, non-paywalled source.
- Fetch and read every source directly to confirm it supports the specific claim it's cited for — a live/200 URL is necessary but not sufficient. Prioritize primary/authoritative sources: the CDC (gun-death statistics), the Congressional Research Service or a comparable nonpartisan federal research source (policy mechanics), an established, methodologically-transparent school-shooting tracking organization (incident counts — e.g., a university-affiliated database), and, for the international-comparison section, each country's own government sources or a comparable authoritative reference (not a U.S. advocacy group's summary of another country's law).
- **Default nonpartisanship discipline, non-negotiable everywhere on this page**: state facts, dates, and figures plainly. Attribute any characterization to a named, dated source's own findings — never assert it directly as the page's own judgment. Apply the party-swap/perspective-swap test to every sentence touching current or recent U.S. policy: *would this sentence read the same regardless of which political side, party, or administration is associated with it?*
- **Settled-fact exception to the above**: the scale/statistics section (built in Task 3, reordered to open the page in Task 3a), the Second Amendment/landmark-law history (built in Task 2, now follows the scale section per Task 3a's reorder), Section 3's school-safety-measures content (effectiveness claims attributed to a named study/source, not staged as a two-sided debate), and Section 8's international comparisons are all held to an *accuracy* standard, not a *balance* standard. A true statistic doesn't need "some say" hedging. Another country's actual law doesn't need a U.S.-partisan lens applied to it. Do NOT apply the party-swap test to these sections' core content — apply it only to genuinely live, present-day, contested U.S. policy questions (concentrated in Task 6's update-pane and touched briefly in Task 5's policy-mechanics content). **Note on page order after Task 3a**: `<main>`'s actual document order is now scale/stakes → Second Amendment/landmark laws → measures tried → policy today, NOT the "Section 1/2/3/4" numbering these constraints and later task descriptions use for historical/labeling convenience — that numbering refers to each task's own build order, not final document position. Confirm actual document order directly in the file rather than assuming from a "Section N" label.
- **The differing-perspectives component (Task 6 ONLY)**: reused verbatim from `immigration.html` — for genuinely contested present-day U.S. policy claims in the update-pane, present two or more named viewpoints side by side, each with its own real, verifiable citation. Equal visual weight, equal specificity, no side gets the last word. Scoped ONLY to Task 6's update-pane content — do not use it in Section 8 (international comparisons state facts, they don't stage a debate about whether the U.S. should adopt similar policies) or anywhere else on this page.
- **Suicide-data handling (Task 3 specifically)**: state the fact plainly and briefly (that a majority of U.S. gun deaths are suicides, not homicides), cited, with the 988 Suicide & Crisis Lifeline note placed immediately adjacent to that specific sentence/paragraph — not several paragraphs removed, not relegated to a general disclaimer elsewhere on the page. Phrase the crisis note supportively, not clinically. This is not the page's emotional center — keep it brief and move on to Section 4 (school safety measures) promptly.
- **"Groups Working on This Issue" composition rule (Task 10), non-negotiable**: if a gun-violence-prevention advocacy organization active in Washington is included, a gun-rights/Second Amendment advocacy organization active in Washington must be included alongside it, with equal visual treatment (same card size, same description length/specificity, same neutral descriptive tone). Each description states what that organization says it does, sourced from that organization's own materials — never a characterization from the opposing side. If a genuinely balanced pair cannot be found and verified, this subsection does not ship at all. There is no acceptable version of this subsection with only one side.
- **Image discipline (Task 11)**: Wikimedia Commons only, license (public domain/CC) AND subject match verified directly on the image's own Commons file page — never from an embedding article or search-result thumbnail. **Hard filter specific to this page**: images must be non-graphic and non-incident-specific — no depiction of an actual shooting scene, memorial, or victim. Favor policy/institutional imagery instead (a courtroom, a state capitol, a school security checkpoint, a press conference, a relevant landmark for the international section). If no compliant image can be verified for a section, use this site's established honest "no verifiable image found" fallback rather than force a non-compliant or unverified image.
- Key People (Task 9) is scoped to historical figures only — one figure tied to passing a landmark federal law, one figure tied to school-safety-policy advocacy/research — never a current sitting official or currently-active advocate/policymaker in either role, regardless of how carefully a bio might be worded.
- No incident-by-incident chronology of specific school shootings anywhere on this page — this page is policy-and-prevention-focused by deliberate design choice. A specific incident may be referenced factually only where directly relevant to a specific policy change (e.g., Columbine 1999's relationship to SRO/lockdown-drill adoption in the History Timeline), never narrated for its own sake.
- No detailed state-by-state comparison of every U.S. state's gun laws — Washington gets its own dedicated section (Task 7); no other state is individually profiled.
- No deep dive into an international-comparison country's broader criminal-justice or social-policy systems beyond what's directly relevant to that country's firearm regulation specifically (Task 8).
- No running, frequently-refreshed news ticker — the update-pane is a dated snapshot like every other page's, refreshed at future site updates, not a live feed.
- Re-verify every date/figure/name against a live, current, nonpartisan source at write time — the design doc's proposed facts and candidate figures/countries are starting points, not copy-paste-ready content.
- Apply this project's date-specificity discipline throughout: never write "now" or "currently" without an explicit date attached.
- Reuse the existing site's shared component patterns (`update-pane`, `mini-tl`, section-head/article markup, `stat-pair`/`stat-trio`, `pull-quote`, `cite-inline`, `vocab`, `callout`, `person-card`/`.person`, `tl-item`, `.term`, quiz/points/easter-egg engine) exactly as implemented on `immigration.html` — no new CSS component types beyond what's explicitly needed for the "Groups Working on This Issue" subsection (Task 10), which should still reuse the existing `.rc`/resource-card pattern rather than inventing a new one.

---

## Reference Files

- **Design doc:** `docs/plans/2026-07-26-gun-violence-design.md`
- **New page:** `gun-violence.html`
- **Primary reference page** (most recently built, most refined structural/CSS/JS reference, including the `.term` tooltip component and the differing-perspectives component): `immigration.html` — read this in full before starting Task 1.
- **Secondary reference** (Washington *policy* local-section precedent, since Immigration's Washington section was history/community-scoped, not policy-scoped): `climate-change.html`'s Washington's Climate Story sub-section.
- **Index page** (add a new live topic-card + nav link): `index.html`
- **Other pages needing a sibling-nav link added**: `iran.html`, `ukraine.html`, `climate-change.html`, `ai.html`, `us-elections.html`, `immigration.html`

---

## Task 1: Scaffold the Page Shell

**Files:**
- Create: `gun-violence.html`

**Context:** Builds the entire page skeleton by adapting `immigration.html`'s proven structure — CSS reset/variables/masthead/hero/nav/points-bar patterns, the full shared JS engine (quiz system, points tracking, easter eggs, dyslexic-font toggle, text-size controls), AND the `.term` tooltip CSS component and the `.perspectives`/`.perspective`/`.perspective-label` differing-perspectives CSS component — with a new, topic-appropriate color palette and empty/placeholder content sections. Treat this as "port a working template," not "design a new one." Unlike `immigration.html`'s own Task 1 (which had to discover its reference page lacked the points/quiz engine and improvise), `immigration.html` itself has everything this page needs already built and proven — port directly.

- [ ] **Step 1: Read the reference structure directly**

Read `immigration.html` in full: the CSS reset/variables/masthead/hero (search for `<header class="article-hero">` or this page's equivalent), the sticky `<nav class="section-nav">` block, the points-bar markup, the dark `.update-pane`/`.focus-pane` markup, the `.stat-pair`/`.stat-trio` markup, the `.pull-quote` markup, the `.cite-inline` markup, the `.term` tooltip CSS (search `.term{`) and its markup usage (search `class="term"`), the `.perspectives`/`.perspective`/`.perspective-label` CSS (search `.perspectives{`) and its markup usage, and the two `<script>` blocks near the end (quiz/points/easter-egg engine). Do not write any of this from memory — read the real, current markup.

- [ ] **Step 2: Create `gun-violence.html` with the base HTML skeleton**

Start with:
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Keeping Schools Safe: Gun Violence &amp; School Safety Policy – Student Resource</title>
<meta name="description" content="How school safety policy actually works in the U.S. — what's been tried, how law works today, and how other countries compare — explained for middle schoolers.">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&display=swap" rel="stylesheet">
<link href="https://fonts.cdnfonts.com/css/opendyslexic" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{overflow-x:hidden;overflow-wrap:break-word}
</style>
</head>
<body>
</body>
</html>
```

Confirm the exact font-family stack, reset rules, and `overflow-wrap:break-word`/`min-width:0` discipline directly against `immigration.html`'s real values (this plan's snippet is a starting shape, not a copy-paste-ready block — read the source first per Step 1). The title above ("Keeping Schools Safe") is a working title per the design doc; confirm or adjust the final wording at write time, but keep the policy-forward framing.

This page does not need Leaflet.js or any interactive map library.

- [ ] **Step 3: Add a new CSS color palette**

Add CSS custom properties for a palette distinct from every existing page's (Iran's red/gold, Ukraine's blue/yellow, AI's blue/purple, US Elections' navy/gold, Climate's slate/ice/forest, Immigration's teal/gold). Given this page's subject matter carries real palette risk (like Immigration and US Elections), avoid any color strongly associated with either major U.S. political party as a primary accent. A muted, institutional tone (e.g., a slate-blue or steel-gray primary accent, distinct from Immigration's teal) is a reasonable starting point — confirm the final choice reads as neutral before committing, the same visual gut-check `immigration.html`'s Task 1 used.

- [ ] **Step 4: Port the masthead, sticky-nav, and points-bar structure**

Adapt `immigration.html`'s masthead/nav/points-bar markup:
- Hero: title matching the confirmed page title, subtitle summarizing the actual angle (how school safety policy works, what's been tried, how the U.S. compares internationally — NOT an incident-focused subtitle), a dated hero-note with the actual write date.
- Sticky-nav: anchor links for each of this page's sections, in this order: `#update-pane` (or this page's equivalent id — confirm exact convention against Task 6's Step 2), `#second-amendment`, `#scale`, `#measures-tried`, `#policy-today`, `#washington-story`, `#international`, `#timeline`, `#key-people`, `#videos`, `#resources`. Include a "🏠 All Topics" link to `index.html` and sibling links to `iran.html`, `ukraine.html`, `climate-change.html`, `ai.html`, `us-elections.html`, `immigration.html` from the start (Task 14 later adds the REVERSE links on those six pages, not this page's own outbound links).
- Points-bar: identical structural pattern to `immigration.html`.

- [ ] **Step 5: Port the full shared JS engine**

Copy `immigration.html`'s two `<script>` blocks. Adapt:
- The `quizzes` object: replace with an empty object for now (`const quizzes = {};`).
- `MAX_PTS`: set to `const MAX_PTS = 0; // TODO: update once all quizzes are added (final verification pass)` — an intentional, explicitly-flagged placeholder resolved in Task 13's Step 1.
- Confirm `openQuiz`, `showToast`, and the points-tracking logic (including its `MAX_PTS > 0` guards, which `immigration.html`'s Task 1 had to add — confirm they're already present in the copied code, not lost in transcription) are copied verbatim.
- Do not port any Immigration-specific easter-egg *content* — keep the generic trigger mechanisms only.

- [ ] **Step 6: Port the `.term` tooltip and `.perspectives` differing-perspectives CSS components**

Copy both components' CSS verbatim from `immigration.html`, adapting only the CSS custom property names (`--accent`, `--ink`, `--ink-faint`, `--rule`, etc.) to match this page's own palette from Step 3 — do not change the structural/behavioral CSS (positioning, transitions, `:focus`/`:focus-visible` accessibility states). Add a dark-panel override for both components matching whatever this page's own dark update-pane class ends up being (confirm the class name from Step 4/7).

- [ ] **Step 7: Add placeholder section containers**

Add empty placeholder section containers (with a single explicitly-tracked placeholder sentence, e.g. `<p>[Content added in Task 2]</p>`) for each of: the update-pane (Task 6), Second Amendment & Landmark Laws (Task 2), Understanding the Scale (Task 3), School Safety Measures Tried (Task 4), How Policy Works Today (Task 5), Washington's School Safety Story (Task 7), How Other Countries Handle This (Task 8), History Timeline/Key People/Videos/Resources (Task 9), the "Groups Working on This Issue" subsection placeholder inside Resources (Task 10) — matching `immigration.html`'s exact section-container class/id naming convention.

- [ ] **Step 8: Verify the shell loads and functions**

Run: `open gun-violence.html`. Confirm: page loads with no console errors, masthead/nav/points-bar render with the new palette, palette reads as neutral (not politically tinted), clicking a nav anchor scrolls to the corresponding placeholder section, dyslexic-font toggle and text-size controls work, no broken image/asset references.

- [ ] **Step 9: Commit**

```bash
git add gun-violence.html
git commit -m "feat: scaffold Gun Violence page shell (CSS, JS engine, .term/.perspectives components, empty sections)"
```

---

## Task 2: Section 1 — The Second Amendment & Landmark Laws

**Files:**
- Modify: `gun-violence.html` (the `#second-amendment` placeholder section)

**Context:** Brief historical grounding, NOT the page's spine — per the design doc, this section moves quickly to Section 2. Covers the Second Amendment's actual text, how court interpretation has shifted (most notably *District of Columbia v. Heller*, 2008), and 3-4 landmark federal laws.

- [ ] **Step 1: Verify facts before writing**

Fetch and read directly (a live/200 URL is not sufficient):
- The Second Amendment's actual text, from a primary source (the National Archives' Constitution page or the Library of Congress).
- *District of Columbia v. Heller* (2008): confirm what the Supreme Court actually held (that the Second Amendment protects an individual right to possess a firearm for traditionally lawful purposes, unconnected with militia service — confirm this precisely from a primary/authoritative source, e.g. the Congressional Research Service or Oyez, not a secondary summary) and confirm it as a genuine interpretive shift from prior case law, stated as settled legal history (what the Court held, when) — not commentary on whether the shift was correct.
- The National Firearms Act (1934): confirm what it actually regulated (e.g., certain weapon categories, taxation/registration) via a primary source (ATF or the Congressional Research Service).
- The Gun Control Act (1968): confirm its actual provisions (e.g., federal licensing requirements for dealers, prohibited-purchaser categories) via a primary source.
- The Brady Handgun Violence Prevention Act (1993, background checks) and the 1994 federal assault weapons ban: confirm what each actually did, and confirm the assault weapons ban's 2004 expiration as a plain legislative fact (Congress did not renew it — confirm this framing is accurate and not itself a partisan characterization; state only that it expired per its own sunset provision).

- [ ] **Step 2: Write the section content**

Following `immigration.html`'s established `.sec-head`/`.article`/`.lede`/`.vocab`/`.callout`/`.term`/`cite-inline` markup pattern (confirm exact class names from Task 1's Step 1 read), write the section at true 5th-6th grade level from the first draft (~12-15 word sentences, one idea per sentence). Cover, in order: the Second Amendment's text, the *Heller* interpretive shift stated as settled history, then the four landmark laws in brief. Use `.term` tooltips for jargon (e.g., "background check," "federally licensed dealer") rather than inline parentheticals — do not write a parenthetical definition into the prose itself.

- [ ] **Step 3: Add a quiz for this section**

Add `q1` to the `quizzes` object testing a fact from this section (e.g., "What did the Supreme Court decide in *District of Columbia v. Heller*?"). Add the corresponding quiz-trigger button matching `immigration.html`'s exact markup.

- [ ] **Step 4: Verify**

Run: `open gun-violence.html`, scroll to this section, confirm it renders correctly with a working drop cap, confirm sentence lengths genuinely read short (spot-check word counts on 3-4 sentences), click every citation link to confirm it resolves and supports its claim, click the quiz button to confirm it functions.

- [ ] **Step 5: Commit**

```bash
git add gun-violence.html
git commit -m "feat: add Gun Violence Section 1 — the Second Amendment and landmark laws"
```

---

## Task 3: Section 2 — Understanding the Scale

**Files:**
- Modify: `gun-violence.html` (the `#scale` placeholder section)

**Context:** Durable statistical grounding — total annual U.S. gun deaths broken into categories (including the suicide-majority fact, handled per the Global Constraints' suicide-data rule), plus school-shooting-specific incident data. Establishes stakes before Section 3 moves into solutions. Does not editorialize about causes.

- [ ] **Step 1: Verify facts before writing**

Fetch and read directly:
- Total annual U.S. gun deaths and their breakdown by category (suicide, homicide, other) from the CDC's own published data (WISQARS or a comparable CDC data product) — confirm the actual current figures and their "as of" year, and confirm which category is the majority (design doc flags suicide as the majority — verify this independently, don't assume it's still true without checking the current data).
- School-shooting-specific incident data from an established, methodologically-transparent tracking source (e.g., a university-affiliated database such as the K-12 School Shooting Database or a comparable source — confirm the actual source's methodology is transparent and its data is genuinely current, not a stale or discontinued tracker).
- The 988 Suicide & Crisis Lifeline: confirm its current, correct contact information (phone number, text option if applicable) directly from a primary source (988lifeline.org or SAMHSA) — do not use a remembered or approximate number.

- [ ] **Step 2: Write the section content**

Write at true 5th-6th grade level. Structure: open with the overall annual gun-death figure and its breakdown by category, including the suicide-majority fact stated plainly and briefly (2-3 sentences, not a deep-dive) with the 988 crisis-resources note placed immediately adjacent in the same paragraph or the very next one — not several paragraphs removed, not deferred to a general disclaimer. Phrase the crisis note supportively (e.g., "If you or someone you know is struggling, help is available" framing) rather than clinically appended. Then cover school-shooting-specific incident data as its own, separate part of the section. Do not editorialize about causes anywhere in this section — state the numbers and move to Section 4.

- [ ] **Step 3: Apply the suicide-data handling check specifically**

Re-read the suicide-data sentences in isolation. Confirm: stated plainly and factually (not sensationalized, not minimized), the 988 note is genuinely adjacent (check the actual paragraph distance), the crisis note's tone is supportive, and this content does not become the section's emotional center — confirm the section as a whole spends comparable or more space on the school-shooting-incident data than on the suicide statistic.

- [ ] **Step 4: Add a quiz for this section**

Add `q2` testing a fact from this section (e.g., a school-safety-relevant statistic, not the suicide figure specifically, to keep the quiz itself focused on the page's core topic). Add the corresponding button.

- [ ] **Step 5: Verify**

Run: `open gun-violence.html`, scroll to this section, confirm it renders correctly, confirm the crisis-resources note displays clearly and is genuinely adjacent to the suicide-data sentence, click every citation link, click the quiz button.

- [ ] **Step 6: Commit**

```bash
git add gun-violence.html
git commit -m "feat: add Gun Violence Section 2 — understanding the scale"
```

---

## Task 3a: Reorder Sections 1-2 and Add Worsening-Trend Content

**Files:**
- Modify: `gun-violence.html` (swap the `#second-amendment` and `#scale` section positions in `<main>`; add new opening/closing content to each; add verified long-run trend data)

**Context:** Added mid-build per explicit project-owner direction, after reviewing Tasks 2-3's completed content. The project owner's reasoning: growing up with lockdown drills and persistent fear of school shootings is not a historical constant in American life, and the page should establish that fact and its weight before walking through the legal/historical framework that's part of how the country got here — and further, this isn't just "currently high," it's "gotten worse over time," a claim that needs its own verified data, not just the existing 2023-vs-2025 comparison (a 2-year window showing a *decline*, which cannot on its own support a multi-decade "worse over time" claim). This task does NOT change either section's core factual content from Tasks 2-3 (the Second Amendment/landmark-laws content and the gun-death/school-shooting statistics both stay as already verified and reviewed) — it reorders them, adds new bridging/framing content at the seams, and adds new, separately-sourced long-run trend data to Section 1.

- [ ] **Step 1: Verify long-run school-shooting trend data**

Fetch and read directly (do not reuse only the already-cited 2023/2025 figures — those show a recent 2-year window, not a long-run trend). Candidates to research: the K-12 School Shooting Database's own published trend analysis or downloadable dataset (it tracks incidents back to 1966, per Task 3's already-verified citation — confirm whether the database or a source citing it publishes a genuine multi-decade comparison, e.g., incidents-per-decade or a comparable measure); RAND's own trend analysis (RAND was already cited in Task 3 for the 2023 figure — check whether RAND's report includes a longer historical comparison); or a comparable authoritative source (e.g., a peer-reviewed study on long-run school-shooting trends). Confirm the actual shape of the trend — do not assume it is a clean, monotonic increase. If the verified data shows a more complicated pattern (e.g., a rise across recent decades with a partial recent decline — which the existing 2023→2025 numbers already hint at), state that complexity honestly rather than flattening it into a simple "always getting worse" narrative. This is settled-fact content held to an accuracy standard, same as the rest of Section 1/2's content — verify before asserting, per this project's standing sourcing discipline.

- [ ] **Step 2: Reorder the sections in the HTML**

Move the `#scale` section (currently second in `<main>`, built in Task 3) to appear BEFORE the `#second-amendment` section (currently first, built in Task 2). Update the sticky-nav's anchor order in `<nav class="section-nav">` to match the new order (scale link before second-amendment link). Do not change either section's internal content structure yet — that's Steps 3-4.

- [ ] **Step 3: Add new opening content to Section 1 (now `#scale`) and a closing bridge**

At the very start of the section (before the existing gun-death-statistics content from Task 3), add new opening content establishing that this level of school-shooting concern — lockdown drills, active-shooter drills, the general backdrop of fear — is not a historical constant in American life. State this as a framing observation, not an unsourced editorial claim — if a specific, verifiable fact supports it (e.g., a dated source on when lockdown/active-shooter drills became widespread in U.S. schools, which Task 9's History Timeline may also want later), cite it; otherwise frame it as an invitation to look at the data that follows, e.g., "Growing up with lockdown drills might feel normal. It hasn't always been this way. Here's what the numbers show." Insert the newly-verified long-run trend data from Step 1 into the school-shooting-incident subsection (already built in Task 3), presented alongside or immediately following the existing 2023/2025 figures — do not delete or contradict those figures, add the longer-run context around them. At the END of the section (after all of Task 3's existing content), add a short bridging paragraph or `<h3>` transition explicitly posing the question the next section will answer — e.g., "So how did the U.S. end up here? Part of the answer starts with one sentence written in 1791." — leading directly into Section 2's Second Amendment content.

- [ ] **Step 4: Add a new opening line to Section 2 (now `#second-amendment`)**

Adjust the section's own opening (the existing `.lede` paragraph from Task 2) so it reads as picking up the bridge question from Section 1's new closing, rather than as a cold open. This may be as light as changing the first sentence's framing (e.g., ensuring it explicitly connects to "how did we get here" rather than starting a fresh, disconnected thought) — do not rewrite the rest of the section's already-reviewed content.

- [ ] **Step 5: Verify the reorder didn't break anything**

Run: `open gun-violence.html`. Confirm: the nav anchors now scroll in the new order (scale section first, second-amendment section second), both sections still render their original Task 2/3 content correctly (nothing was accidentally dropped or duplicated during the move), the new bridge content at the seam reads naturally across the section boundary, the new long-run trend data is clearly cited and doesn't contradict the existing 2023/2025 figures, and both sections' existing quizzes (`q1`, `q2`) still function correctly regardless of section order (quiz IDs don't depend on document order, but confirm their trigger buttons are still in the right section after the move).

- [ ] **Step 6: Confirm citation and quote integrity after the reorder**

Count `cite-inline` occurrences before and after this task's edits — should increase only by the number of new citations added for the long-run trend data in Step 1/3, with zero citations lost from the move itself. Confirm no existing quote or citation from Tasks 2-3 was altered during the section swap (a pure move should leave existing markup byte-identical except for its position in the document).

- [ ] **Step 7: Commit**

```bash
git add gun-violence.html
git commit -m "feat: reorder Sections 1-2 (scale opens the page), add long-run trend data and bridge content"
```

---

## Task 3b: State-by-State Comparison Subsection

**Files:**
- Modify: `gun-violence.html` (add a new subsection inside the `#scale` section, after Task 3a's content)

**Context:** Added mid-build per explicit project-owner direction, after Task 3a's reorder was reviewed and approved. A new subsection inside the scale/stakes section covering two distinct, clearly-labeled state-level metrics — NOT a state-by-state legal/regulatory comparison (that stays out of scope; Washington's own laws remain covered only in Task 7's Washington's School Safety Story). This is the most visually complex component built on this site to date (a 50-state choropleth map, inline SVG, no external library) — budget real iteration time for legibility, not a quick add.

- [ ] **Step 1: Verify gun death rate per capita by state**

Fetch and read directly from the CDC's own published state-level data (WISQARS or a comparable CDC data product — if CDC's own domain is blocked for direct fetch, as it was in Task 3, use the same corroboration approach: cross-check via a source that cites CDC data directly, such as the Johns Hopkins Center for Gun Violence Solutions or KFF, both already used and verified elsewhere on this page). Confirm the actual current per-state rates (deaths per 100,000 people) for all 50 states and their "as of" year. Confirm Washington's specific rate and its national rank (e.g., "Washington ranks Nth out of 50 states, from lowest to highest" — confirm which direction the rank runs and state it unambiguously).

- [ ] **Step 2: Verify school-shooting incidents by state**

Fetch and read directly from the K-12 School Shooting Database's state-level breakdown (reuse the same source already verified in Task 3 — confirm it publishes a per-state count, not just a national total). Confirm Washington's specific incident count and where it falls relative to other states. Confirm the time period this count covers (a specific year or range — do not present an undated cumulative total as if it were a current snapshot).

- [ ] **Step 3: Build the gun-death-rate choropleth map**

Build a simplified (not photorealistic) inline SVG map of the United States, states rendered as simplified shapes (not requiring precise real-world geographic accuracy — a recognizable, simplified state-shape approximation is acceptable and consistent with "simplified," per the design doc), each colored on a light-to-dark scale (e.g., a single-hue scale from this page's palette, light for low rates, dark for high rates) corresponding to its verified per-capita gun death rate from Step 1. Include a visible legend explaining the color scale. Include an explicit, highlighted callout stating Washington's specific rate and rank in text (do not rely on the map alone to convey this — a reader should not have to visually parse the map to find Washington's number). Since this is more visually complex than any chart previously built on this site, verify it renders legibly at both desktop and mobile widths before finalizing — if full 50-state legibility at mobile width proves genuinely unachievable, a simplified regional grouping or a scrollable/zoomable treatment is an acceptable fallback, but only after a real attempt at the full map, not skipped preemptively.

- [ ] **Step 4: Build the school-shooting-incidents ranked table**

Build a simple ranked table (not a second map) showing a top-N list of states by school-shooting incident count from Step 2, with Washington's specific position included and visually distinguished (e.g., highlighted row) whether or not it falls within the top-N shown. Label this table explicitly as raw counts, not population-adjusted rates — the subsection's copy must make the distinction between this table and Step 3's per-capita map explicit and clear, so a reader doesn't conflate the two different metrics.

- [ ] **Step 5: Write the subsection's connecting prose**

At true 5th-6th grade level. Introduce the subsection (e.g., "How does Washington compare to other states?"), present the two metrics with clear sub-headings distinguishing them, and write the Washington-specific callouts for each. Do not editorialize about which states are "better" or "worse" — state the data plainly, matching the accuracy-not-balance standard already established for the rest of this section.

- [ ] **Step 6: Add a quiz for this subsection**

Add a quiz testing Washington's specific rank or count from this subsection (confirm the next available quiz ID directly from the file — this task runs after Task 3's `q2`, so likely `q2b` or the next sequential `qN`, whichever this plan's actual quiz-numbering convention has settled on by this point in the build — check the live `quizzes` object before assigning). Add the corresponding button.

- [ ] **Step 7: Verify**

Run: `open gun-violence.html`, scroll to this subsection, confirm the map renders legibly with a working legend, confirm Washington's rate/rank and incident count are both clearly stated in text (not just visually implied), confirm the two metrics are clearly distinguished from each other in the copy, click every citation link, click the quiz button. Confirm this subsection doesn't duplicate or contradict the national-level statistics already established earlier in Task 3's content.

- [ ] **Step 8: Commit**

```bash
git add gun-violence.html
git commit -m "feat: add state-by-state comparison subsection (gun death rate map + school-shooting table)"
```

---

## Task 4: Section 3 — School Safety Measures That Have Been Tried

**Files:**
- Modify: `gun-violence.html` (the `#measures-tried` placeholder section)

**Context:** Concrete, factual coverage of specific measures schools/districts have implemented. Effectiveness claims must be attributed to a named, dated source — this is a settled-fact-with-mixed-findings area, not a two-sided values debate, so it does NOT use the differing-perspectives component (per the design doc's explicit distinction, also stated in Global Constraints).

- [ ] **Step 1: Verify facts before writing**

Fetch and read directly, for each measure covered:
- Metal detectors: confirm actual adoption prevalence data (e.g., from a National Center for Education Statistics school-safety survey) and any effectiveness findings, attributed to their named source.
- School resource officers (SROs): confirm adoption prevalence and effectiveness research findings — this is a genuinely mixed-findings area (some research finds benefits, some finds limited or negative effects on school climate/discipline disparities) — attribute each specific finding to its named study/source rather than asserting a single verdict.
- Lockdown drills: confirm adoption prevalence and any research on their effectiveness or psychological effects on students, attributed to source.
- Threat-assessment programs: confirm what these programs actually do procedurally and any effectiveness research, attributed to source.
- Security-vestibule/access-control changes: confirm adoption data and any effectiveness findings, attributed to source.
- **School-climate/bullying-reduction programs (social-emotional learning, restorative justice, trauma-informed care) — added mid-build per a project-owner-supplied source**: fetch and read directly KQED's coverage (`https://www.kqed.org/mindshift/66493/a-leading-school-shootings-researcher-says-he-was-wrong`) of UCLA professor Ron Avi Astor's April 2026 public reversal of his own long-held theory that improving school climate/reducing bullying would prevent school shootings — confirm the article's actual claims directly (don't rely on a secondhand summary): Astor's prior position, the specific data he presented showing declining student weapon-carrying in California (2001-2024) alongside rising national school-shooting incidents over the same period, his revised view that shooters are primarily motivated by a desire for notoriety/media attention rather than local grievances (quote: "Their number one audience was the media"), and his resulting recommendation — media/social-media guidelines limiting perpetrator coverage and delaying manifesto publication, drawing an explicit comparison to contagion-effect research in suicide and terrorism prevention. If Astor's own underlying research/data (not just KQED's reporting on it) is findable and fetchable, verify the specific figures directly against his own published work rather than relying solely on the news article's characterization.

- [ ] **Step 2: Write the section content**

Write at true 5th-6th grade level. Cover each measure factually: what it is, how common it's become (with data), and what research says about it — explicitly attributed ("A [year] study by [organization] found..." rather than "Metal detectors work" or "Metal detectors don't work" stated as the page's own verdict). Where findings are genuinely mixed for a given measure, state that mixedness factually (e.g., "Researchers have found mixed results" followed by what specific studies found) rather than picking a favored interpretation.

**Include the Astor reversal as its own short passage or callout**, positioned appropriately relative to the school-climate content it revises (if school-climate/bullying-reduction programs are covered as a "measure tried," place this immediately after that coverage as a direct update to it; if none of the other measures cover school-climate programs directly, this stands as its own brief passage). State it as a genuine, notable event in the research literature — a leading researcher publicly changing his position based on new evidence — not as a settled final word on the topic (his reversal is itself one researcher's current view, attributed to him by name and date, not asserted as the page's own established fact). His media-coverage recommendation is a genuinely novel policy idea for this section — state it factually and attributed, and do NOT route it through the differing-perspectives component (that component is reserved exclusively for Task 6's update-pane; this is Task 4's settled-fact-with-attribution territory, consistent with how every other effectiveness claim in this section is handled).

- [ ] **Step 3: Add a quiz for this section**

Add `q3` testing a fact about one of the measures covered. Add the corresponding button.

- [ ] **Step 4: Verify**

Run: `open gun-violence.html`, scroll to this section, confirm every effectiveness claim carries a specific named-source attribution (not a bare assertion), click every citation link, click the quiz button.

- [ ] **Step 5: Commit**

```bash
git add gun-violence.html
git commit -m "feat: add Gun Violence Section 3 — school safety measures that have been tried"
```

---

## Task 5: Section 4 — How Policy Actually Works Today

**Files:**
- Modify: `gun-violence.html` (the `#policy-today` placeholder section)

**Context:** The federal/state authority split, with red-flag laws (extreme risk protection orders) as a concrete state-level mechanism example, described structurally without characterizing effectiveness or appropriateness. This section briefly touches current policy structure — apply the party-swap test here per Global Constraints, though the content itself (how authority is structurally divided, what a red-flag law procedurally does) is mechanical/structural, not itself a contested claim.

- [ ] **Step 1: Verify facts before writing**

Fetch and read directly:
- The actual federal/state authority split for firearm regulation — confirm what the federal government can and cannot regulate versus what's left to states, from a primary/authoritative source (the Congressional Research Service is a strong candidate, being explicitly nonpartisan and federally chartered for exactly this kind of explainer).
- Red-flag laws (extreme risk protection orders): confirm the general mechanism (who can petition a court, what the court can order, duration, renewal/appeal process) from a primary/authoritative source — describe this procedurally/structurally only, without characterizing whether such laws are effective or appropriate. (Washington's own specific red-flag law is covered in more detail in Task 7 — this section explains the general mechanism type, Task 7 covers Washington's specific implementation.)

- [ ] **Step 2: Write the section content**

Write at true 5th-6th grade level. Cover the federal/state split first (what's federal, what's state, in plain structural terms), then red-flag laws as a concrete example of a state-level mechanism — described procedurally (what happens, step by step) without any characterization of whether the mechanism is good, necessary, or overreaching.

- [ ] **Step 3: Apply the party-swap test to this section specifically**

Read the section back once specifically checking: does any sentence read differently depending on which party controls a given state or the federal government? Confirm no sentence implies red-flag laws (or their absence) are correct/incorrect, needed/unneeded.

- [ ] **Step 4: Add a quiz for this section**

Add `q4` testing the federal/state split or the red-flag-law mechanism. Add the corresponding button.

- [ ] **Step 5: Verify**

Run: `open gun-violence.html`, scroll to this section, confirm it renders correctly, click every citation link, click the quiz button.

- [ ] **Step 6: Commit**

```bash
git add gun-violence.html
git commit -m "feat: add Gun Violence Section 4 — how policy actually works today"
```

---

## Task 6: The Update Pane — "Where Things Stand" (Reusing the Differing-Perspectives Component)

**Files:**
- Modify: `gun-violence.html` (the `#update-pane` section — should already sit first in `<main>`, immediately after the hero, per Task 1's Step 7)

**Context: This is the single highest-risk task in this plan.** Two parts: Part A (structural status facts, same discipline as every other update-pane) and Part B (genuinely contested current policy questions, using the differing-perspectives component reused verbatim from `immigration.html` — NOT reinvented, NOT modified in its CSS/markup structure).

- [ ] **Step 1: Verify every Part A fact against a live, current source**

Fetch and read directly:
- Recent, dated incident-count data from the same established tracking source verified in Task 3's Step 1 (reuse that source, confirm the specific current-period count).
- Recent, dated legislative activity at the federal and/or state level — confirm at least one concrete, current example (a bill introduced/passed, a court ruling) stated neutrally: what happened, who did it (a legislature/court/administration in a structural sense) — never characterized as good or necessary.
- Confirm the exact write date this pane will use, and ensure every "as of" claim uses that same date consistently.

- [ ] **Step 2: Build the Part A structure**

Following `immigration.html`'s exact `update-pane`/`mini-tl` markup pattern, build a header framing this as a dated snapshot, then the Part A facts (incident-count data, legislative activity) each with its own citation and "as of" date.

- [ ] **Step 3: Research Part B — identify which contested questions have genuinely well-sourced differing positions**

For each candidate question from the design doc (assault-weapon ban proposals, arming/training teachers, minimum purchase age, red-flag law expansion), research whether two real, named, well-sourced, substantively differing positions actually exist and can be verified — fetch each candidate source directly, confirm it states that position in its own terms (not paraphrased from the opposing side's characterization). **Do not force all four candidates if research doesn't support two genuinely well-sourced, comparably substantive positions for a given one** — per the design doc, state a weakly-contested question plainly (Part A-style) instead, or omit it, rather than manufacture false balance between a well-sourced position and a weak one.

- [ ] **Step 4: Build the Part B differing-perspectives blocks**

For each contested question that cleared Step 3's bar, build a `.perspectives` block using the exact CSS/markup ported in Task 1's Step 6 — two `.perspective` divs, each with a `.perspective-label` naming the position/organization and a `<p>` stating that side's specific claim in its own terms with its own `cite-inline` citation. Both sides must have comparable length and specificity — if a rough word-count check shows one side notably longer or more detailed, revise until they're balanced.

- [ ] **Step 5: Apply the nonpartisanship test to every single sentence in this section — do not skip this**

Read the entire update-pane sentence by sentence, both Part A and Part B. For Part A: would this read the same regardless of which party/administration is associated with it? For each `.perspectives` block: confirm both sides have genuinely equal specificity and length; confirm neither side was written by paraphrasing the OTHER side's characterization of it; confirm no sentence outside a `.perspectives` block sneaks in an unattributed characterization of something that's actually contested.

- [ ] **Step 6: Add a quiz for this section**

Add `q5` testing a plain, uncontested fact from this pane (not a contested claim — a quiz needs one correct answer). Add the corresponding button.

- [ ] **Step 7: Verify**

Run: `open gun-violence.html`, scroll to the update-pane, confirm it renders with the same visual quality as every other page's update-pane, confirm every `.perspectives` block renders with genuinely equal-width, equal-treatment columns (check both desktop and the mobile breakpoint where columns should stack), click every citation link on both sides of every `.perspectives` block, click the quiz button, and re-read the entire section one more time specifically for nonpartisanship (a second, independent pass after Step 5's first pass).

- [ ] **Step 8: Commit**

```bash
git add gun-violence.html
git commit -m "feat: add Gun Violence update-pane, reusing the differing-perspectives component"
```

---

## Task 7: Washington's School Safety Story (Policy Local Section)

**Files:**
- Modify: `gun-violence.html` (the `#washington-story` placeholder section)

**Context:** A *policy* local section (like Climate's Washington's Climate Story), not a history/community section — this topic's natural local angle is what Washington has actually done. Lower risk than Task 6 by design, but still a real nonpartisanship-discipline task given it covers live state policy.

- [ ] **Step 1: Research Washington's red-flag law**

Fetch and read directly (Washington State Legislature's own bill-tracking records, or the Washington Attorney General's office, or a comparable primary source) to confirm: when Washington's Extreme Risk Protection Order law was enacted (confirm the exact year — do not assume), how it works procedurally in Washington specifically (who can petition, what a court can order, duration), and any notable, dated usage statistics if a primary source publishes them.

- [ ] **Step 2: Research Washington's school safety funding programs**

Fetch and read directly (Washington State Office of Superintendent of Public Instruction, or the Washington State Legislature) to confirm: what state-level funding programs exist for school safety (e.g., capital funding for security infrastructure, threat-assessment program funding) — confirm actual, current program names, funding amounts, and "as of" dates.

- [ ] **Step 3: Research any Washington-specific purchase-age or related requirement**

Fetch and read directly to confirm any Washington-specific firearm purchase-age or related requirement directly relevant to school safety policy (confirm the actual current law, not an outdated or proposed-but-not-passed provision).

- [ ] **Step 4: Build the section**

Following the established `.sec-head`/`.article`/`.vocab`/`.callout`/`cite-inline` pattern, write at true 5th-6th grade level, covering the three sub-topics from Steps 1-3 in order. State every date, mechanism, and dollar figure plainly. Attribute any claim about a policy's reception or effectiveness to a named, dated source — do not assert reception/effectiveness as the page's own judgment.

- [ ] **Step 5: Apply the nonpartisanship test to this section**

Read the section sentence by sentence: would each sentence touching Washington's red-flag law or funding programs read the same regardless of which party or officials are associated with it? Confirm no editorializing adjectives near any policy description.

- [ ] **Step 6: Add a quiz for this section**

Add `q6` testing a fact from this section. Add the corresponding button.

- [ ] **Step 7: Verify**

Run: `open gun-violence.html`, scroll to this section, confirm it renders correctly, click every citation link, click the quiz button, re-read once more for nonpartisanship (second pass).

- [ ] **Step 8: Commit**

```bash
git add gun-violence.html
git commit -m "feat: add Washington's School Safety Story section"
```

---

## Task 8: How Other Countries Handle This (International Comparison)

**Files:**
- Modify: `gun-violence.html` (the `#international` placeholder section)

**Context:** The page's distinctive hook, added per explicit project-owner direction. Structural, factual comparison of 3-4 countries — settled-fact content, held to an accuracy standard not a balance standard. Does NOT use the differing-perspectives component (per Global Constraints) and does NOT editorialize about which country's approach is "better."

- [ ] **Step 1: Research Australia**

Fetch and read directly, from an Australian government source or a comparable authoritative reference (not a U.S. advocacy group's summary): the 1996 National Firearms Agreement and mandatory buyback following the Port Arthur massacre (state the historical trigger event factually and briefly — this is describing another country's own policy history, not a U.S. incident, so it does not conflict with this page's no-incident-chronology constraint) — confirm what the law actually did, and, if a clear, well-documented before/after data point exists from an authoritative source (e.g., a peer-reviewed study or Australian government data on firearm deaths pre/post-1996), confirm and cite it factually.

- [ ] **Step 2: Research Japan**

Fetch and read directly, from a Japanese government source or comparable authoritative reference: Japan's firearm regulation structure (confirm it is genuinely near-total civilian restriction, and confirm the actual licensing process/requirements that do exist, since "near-total" is not "zero" — get this precise).

- [ ] **Step 3: Research Switzerland**

Fetch and read directly: Switzerland's firearm ownership rates and its distinct regulatory structure tied to its militia-based reserve military system — confirm this connection accurately (many popular claims about Switzerland's gun laws oversimplify the militia connection; verify the actual current civilian ownership/storage regulations from a Swiss government or comparable authoritative source, not a secondhand U.S. commentary piece).

- [ ] **Step 4: Research Canada**

Fetch and read directly, from a Canadian government source: Canada's firearm regulation structure as a comparative "middle ground" — confirm the actual current licensing/classification system.

- [ ] **Step 5: Build the section**

Following the established pattern, write at true 5th-6th grade level. For each of the four countries: state its actual law/regulatory structure factually, with citation, and — where a clear, well-documented data point exists — a factual outcome. **No editorializing about which approach is "better."** No "supporters of X policy point to this comparison" framing — that pattern belongs in Task 6's update-pane for genuinely live U.S. policy debates, not here. If research for any one country doesn't turn up a clean, well-documented data point, state the law/structure alone without forcing an outcome claim — an incomplete but accurate profile is better than a stretched one.

- [ ] **Step 6: Add a quiz for this section**

Add `q7` testing a fact about one of the four countries covered. Add the corresponding button.

- [ ] **Step 7: Verify**

Run: `open gun-violence.html`, scroll to this section, confirm it renders correctly, confirm no country's profile reads as editorializing about "better"/"worse," click every citation link, click the quiz button.

- [ ] **Step 8: Commit**

```bash
git add gun-violence.html
git commit -m "feat: add How Other Countries Handle This — international comparison section"
```

---

## Task 9: History Timeline, Key People, Videos, Resources (Base Grid)

**Files:**
- Modify: `gun-violence.html` (the `#timeline`, `#key-people`, `#videos`, `#resources` placeholder sections)

**Context:** Four sections bundled into one task, matching the pattern from prior page builds — none requires the deep research/nonpartisanship scrutiny of Tasks 6-8. This task builds the base Resources grid (standard nonpartisan/reputable sources plus the dated news subsection) but NOT the "Groups Working on This Issue" subsection, which is Task 10's own dedicated task given its non-negotiable composition rule.

- [ ] **Step 1: Verify History Timeline facts**

Pull entries from Sections 1-4's ALREADY-VERIFIED content (Tasks 2-5) — do not re-research independently. Candidate entries: the Second Amendment's ratification (1791), the National Firearms Act (1934), the Gun Control Act (1968), the Brady Act/assault weapons ban (1993/1994) and its 2004 expiration, *Heller* (2008). Additionally, per the design doc: Columbine (1999), stated as a policy-history inflection point ("after this event, schools began widely adopting [specific measures already covered in Task 4]") — confirm this framing stays policy-focused, not an incident narrative, and confirm the specific causal claim (which measures' adoption actually accelerated after 1999) against a real source rather than assuming it. Confirm every date matches EXACTLY what's already stated in its originating section.

- [ ] **Step 2: Build the History Timeline**

Following `immigration.html`'s `.tl-item` pattern exactly, add each verified entry with its citation (reusing the citation already established in its originating task where possible).

- [ ] **Step 3: Research and select 2 Key People (historical figures only)**

One figure genuinely central to passing one of Section 1's landmark laws (research and confirm via a primary/authoritative source — a sponsoring legislator or documented key advocate, not a guess from general familiarity). One figure tied to school-safety-policy advocacy or research (confirm via a primary/authoritative source that this figure is genuinely historical — deceased or no longer active in a politically-live advocacy/policy role — not a currently-active public figure in either capacity). Do NOT include any current sitting official or currently-active advocate under any circumstance.

- [ ] **Step 4: Build the Key People section**

Following `immigration.html`'s `.person`/portrait pattern, add each figure with a real photo verified directly on its own Wikimedia Commons file page (public domain/CC, correct subject match). If no verifiable portrait exists, use this project's established honest-disclosure fallback rather than an unverified/forced image.

- [ ] **Step 5: Build Videos and the base Resources grid**

Source genuinely nonpartisan, reputable educational videos/resources (e.g., PBS/NPR explainers, the Congressional Research Service's own materials, a university-affiliated research center's public materials). Given this page's subject matter, apply extra scrutiny: watch/read enough of each candidate to confirm its actual framing is neutral, not just that its source organization sounds reputable. Add a curated "Keep up with school safety policy news" subsection matching every other page's equivalent dated-links pattern — 3-5 items, each explicitly dated, fetched and confirmed live/non-paywalled/genuinely nonpartisan in its own framing, with a visible "as of [DATE]" marker.

Do NOT build the "Groups Working on This Issue" subsection in this task — leave a placeholder (`<p>[Groups subsection added in Task 10]</p>`) in the Resources section for Task 10 to fill in.

- [ ] **Step 6: Verify**

Run: `open gun-violence.html`, scroll through all sections, click every citation/resource link, confirm images load or the honest-disclosure fallback displays correctly, confirm any new quiz buttons function, confirm the curated-links subsection shows its "as of [DATE]" marker.

- [ ] **Step 7: Commit**

```bash
git add gun-violence.html
git commit -m "feat: add history timeline, key people, videos, base resources grid"
```

---

## Task 10: "Groups Working on This Issue" (Balanced-Pair Resources Subsection)

**Files:**
- Modify: `gun-violence.html` (the Resources section's placeholder from Task 9's Step 5)

**Context:** A dedicated task given this subsection's non-negotiable composition rule — ships as a genuinely balanced pair, or does not ship at all. Not cited elsewhere on the page as a factual source; framed explicitly as organizations students can look into further.

- [ ] **Step 1: Research candidate gun-violence-prevention organizations active in Washington**

Research and identify a genuine, Washington-based or Washington-active gun-violence-prevention advocacy organization. Fetch that organization's own materials (its own website's "about"/"mission" page) directly to write its description — do not source the description from a third party's characterization of the organization.

- [ ] **Step 2: Research candidate gun-rights/Second Amendment organizations active in Washington**

Research and identify a genuine, Washington-based or Washington-active gun-rights/Second Amendment advocacy organization. Fetch that organization's own materials directly for its description, same discipline as Step 1.

- [ ] **Step 3: Apply the composition and balance check**

Compare the two descriptions drafted in Steps 1-2: same card size/markup structure, comparable description length (a rough word-count check — if one is notably longer/more detailed, revise the shorter one, don't trim the longer one down to something less informative), same neutral descriptive tone (each states what that organization says it does, in factual terms — "advocates for stricter background check requirements" / "advocates for protecting Second Amendment rights," not "fights to keep kids safe" for one and a bare organizational description for the other). Apply the perspective-swap test: would each description read as evenhanded to a reader who supports the *other* organization?

- [ ] **Step 4: Build the subsection, or omit it**

If Step 3's check passes cleanly for a genuine, verified pair: build the subsection using the site's existing resource-card pattern (reuse `.rc` or equivalent — confirm exact class name from Task 9's resources grid), with both organizations presented with identical visual treatment. If Step 3's check does NOT pass — e.g., only one side has a genuine Washington-active organization with verifiable, citable materials, or the descriptions can't be brought into real balance — **omit this subsection entirely** and remove its placeholder rather than ship an unbalanced version. Document which outcome occurred in this task's commit message.

- [ ] **Step 5: Verify (if the subsection was built)**

Run: `open gun-violence.html`, scroll to Resources, confirm both organization cards render with identical visual weight, click both links to confirm they resolve to each organization's real site, re-read both descriptions once more specifically checking the perspective-swap test.

- [ ] **Step 6: Commit**

```bash
git add gun-violence.html
git commit -m "feat: add Groups Working on This Issue subsection (balanced pair)"
```

If the subsection was omitted per Step 4, use instead: `git commit -m "chore: omit Groups Working on This Issue subsection — no verified balanced pair found"` (only if there were actual file changes to commit, e.g., placeholder removal; if literally nothing changed, skip the commit and note this explicitly in the task's completion report).

---

## Task 11: Source Images for Every Major Section

**Files:**
- Modify: `gun-violence.html` (add `<img>` elements into Sections 1-4, the update-pane, Washington's story, the international-comparison section, and the History Timeline)
- Add: new image files under `images/`

**Context:** Built in from the start as its own task (unlike `immigration.html`, where this was discovered as a gap mid-build). Runs after all content is finalized (Tasks 2-10) so images can be matched to actual finished prose. **This page has a stronger image-selection constraint than any prior page on this site**: no graphic or incident-specific imagery (no shooting scenes, memorials, or victims) — hard filter, not a preference.

- [ ] **Step 1: Inventory which sections need images**

Read the full file as it stands after Task 10. Confirm which sections lack a real photo: Section 1, Section 2, Section 3, Section 4, the update-pane (optional per this page's design — Immigration's precedent treated its update-pane image as optional given already-dense factual content; apply the same judgment here), Washington's School Safety Story, the international-comparison section (likely wants one image per country or a subset), and the History Timeline. Key People (Task 9) already has portraits.

- [ ] **Step 2: Source and verify one image per section (minimum), applying the non-graphic hard filter**

For each section, search Wikimedia Commons for a compliant image. Candidate subjects (research and confirm real, existing, correctly-licensed files — do not assume any exist without checking):
- Section 1: the U.S. Capitol, a courtroom, or a historical photo directly tied to one of the landmark laws' signing (a bill-signing photo, if one exists and is correctly licensed — avoid any image of a weapon itself if a policy/institutional alternative exists).
- Section 2: a CDC or public-health-context image, or a data-visualization-appropriate image; avoid anything depicting an actual event or victim.
- Section 3: a school security checkpoint, a metal detector at an institutional entrance (not tied to a specific incident), a school resource officer in a general/generic context.
- Section 4: a state capitol building, a courtroom, or a legislative session photo.
- Washington's School Safety Story: the Washington State Capitol, or a Washington-specific institutional image.
- International comparison: for each country covered, a relevant landmark or government building (e.g., the Australian Parliament House, a relevant Japanese or Swiss or Canadian government building) rather than any weapon-related imagery.
- History Timeline: 2-3 images across timeline entries, reusing already-sourced images where a timeline entry duplicates a section's own subject, per this site's established economy-of-images pattern.

For every candidate: verify BOTH license (public domain or CC) AND subject match directly on the image's own Wikimedia Commons file page, AND apply the non-graphic/non-incident-specific filter as a hard pass/fail check before even evaluating license — if an image depicts a shooting scene, memorial, or victim, do not use it regardless of licensing.

- [ ] **Step 3: Download and add each verified image**

Download each verified image into `images/` with a descriptive kebab-case filename, respecting this project's known Wikimedia rate-limiting (25-90 second delays between sequential downloads).

- [ ] **Step 4: Insert each image into its section with a proper caption and citation**

Following `immigration.html`'s established `.photo-break`/`.photo-inline` visual patterns (confirm exact class names), add each image with a real, descriptive `alt` attribute, a visible caption stating what's shown and its source/license, and an `onerror` fallback matching this site's established pattern. Captions must be neutral and descriptive only — no editorializing.

- [ ] **Step 5: Verify**

Run: `open gun-violence.html`, scroll through the entire page, confirm every image loads (not broken), confirm every caption accurately describes what's shown, confirm zero images violate the non-graphic/non-incident-specific filter (a final, explicit re-check of this specific constraint), re-confirm every image's Commons license directly one more time before finalizing.

- [ ] **Step 6: Commit**

```bash
git add gun-violence.html images/
git commit -m "feat: source and add non-graphic policy/institutional images for every section"
```

---

## Task 11a: Opening Narrative Hook

**Files:**
- Modify: `gun-violence.html` (insert new content between the `.article-hero` and the `#update-pane` section)

**Context:** Added mid-build per explicit project-owner review of the fully-assembled page (after Task 11's images landed). The page currently goes: hero → update-pane (numbers) → Section 1's own lede (also numbers-first) — an abrupt, stats-first opening unlike every other page on this site, which opens with a genuine narrative/scene-setting moment before any citation-heavy content. This task inserts a short narrative passage to fix that, breaking this site's usual "update-pane comes first" convention deliberately for this one page.

- [ ] **Step 1: Read the existing drill reference**

Read Section 1's existing lede (search `id="scale"`) — it currently contains one sentence comparing lockdown/active-shooter drills to earlier generations' fire drills. This task expands that single sentence into a fuller opening scene placed BEFORE the update-pane, not a duplicate of it — Section 1's existing sentence can stay as-is (a callback/echo is fine), but do not delete or contradict it.

- [ ] **Step 2: Write the narrative passage**

Write 3-5 sentences at true 5th-6th grade level, placed in a new block between `</header>` (end of the hero) and the `<!-- ═══ UPDATE PANE ═══ -->` comment. Content: a plain, procedural, non-graphic description of what a lockdown or active-shooter drill actually involves — e.g., lights off, silence, locked/barricaded doors, staying away from windows, waiting for an all-clear. Matter-of-fact, not fear-mongering — describing the institutional practice itself, not narrating a threat or any violence. No citations or stat callouts in this passage — it is a scene-setting moment, not a claim requiring a source (the fact that drills are now common is already established with citations elsewhere on the page). End with a short pivot sentence into "this wasn't always the routine" or equivalent, leading naturally into the update-pane/Section 1 content that follows.

Use a distinct but consistent visual treatment — reuse the existing `.lede`-style typography or a comparable established pattern (check what's available in this page's CSS; do not invent a new component for a single short passage) so it reads as an intentional opening beat, not a stray paragraph.

- [ ] **Step 3: Verify tone and scope**

Re-read the passage in isolation. Confirm: no depiction of an actual attack, shooter, victim, or violence — only the drill procedure itself. Confirm it doesn't duplicate Section 1's existing sentence verbatim (should feel like an expansion/scene, not a repeat). Confirm it contains no citations (this is a deliberate exception to this page's usual "every factual claim is cited" rule, since this passage is scene-setting/procedural description, not a claim requiring a source — if it does end up asserting something citation-worthy, either add a citation or rephrase to avoid the claim).

- [ ] **Step 4: Verify**

Run: `open gun-violence.html`. Confirm the new passage renders between the hero and the update-pane, confirm it reads as a genuine narrative beat distinct from the stats that follow, confirm no HTML structure was broken by the insertion (div/tag balance).

- [ ] **Step 5: Commit**

```bash
git add gun-violence.html
git commit -m "feat: add opening narrative hook before the update-pane"
```

---

## Task 12: Dedicated Grade-Level Review Pass

**Files:**
- Modify: `gun-violence.html` (prose adjustments only — no structural changes)

**Context:** Built in from the start per explicit project-owner direction, rather than discovered as a gap after initial ship the way it was for `immigration.html` (which needed a full second rewrite pass, Task 15 in that plan, after its first pass was judged still too high). Since this page was written at true 5th-6th grade from the first draft (per Global Constraints), this task should find less to fix than Immigration's post-hoc pass did — but it is still required, not optional, per the design doc.

- [ ] **Step 1: Read the entire page and spot-check actual sentence length**

Read every content section (Tasks 2-10's prose) start to finish. For each section, spot-check 3-4 sentences by actually counting words — confirm the ~12-15 word target is genuinely being met, not just assumed from having "tried" to write short sentences in the first draft. Compile a specific list of any sentences that drifted longer than target, with their exact location (section, approximate line).

- [ ] **Step 2: Fix any drifted sentences**

For each sentence identified in Step 1: split into shorter sentences, preserving every citation and every direct quote's exact quoted span character-for-character (if a quote-bearing sentence needs restructuring, keep the quote's own text unchanged and only adjust the surrounding sentence — do not add or remove punctuation immediately adjacent to a quote mark without first checking what the original source's punctuation actually was in that exact position, learned from a real mistake made during the site's prior reading-level effort).

- [ ] **Step 3: Verify citation and quote integrity after any fixes**

If Step 2 made any changes: count `cite-inline` occurrences before and after this task's edits (compare against the file's state at the start of this task) — confirm identical. For any quote-bearing sentence that was touched, confirm the quoted span itself is unchanged from before this task's edits.

- [ ] **Step 4: Check `.term` tooltip usage**

Confirm jargon terms introduced in any section are consistently using `.term` tooltips (not inline parentheticals) where they recur — if Step 1's read surfaces any embedded parenthetical definition that should have been a tooltip, convert it now, using the exact same definition text if the term is already tooltipped elsewhere on the page.

- [ ] **Step 5: Confirm no hedging was introduced on settled-fact content**

Re-read Section 1 (landmark laws), Section 2 (scale statistics), Section 3 (measures-tried effectiveness attributions), and Section 8 (international comparisons) specifically — confirm none of Step 2's edits introduced softening language ("some say," "many believe") on content that should remain stated as plain, cited fact.

- [ ] **Step 6: Verify**

Run: `open gun-violence.html`, read through the whole page once more as a final human-readable check — does it genuinely read as noticeably simpler/shorter-sentenced than a typical adult-register explainer? Confirm no broken markup was introduced by any Step 2 edits (div/tag balance check).

- [ ] **Step 7: Commit**

```bash
git add gun-violence.html
git commit -m "fix: dedicated grade-level review pass — confirm/tighten sentences to 5th-6th grade target"
```

If Step 1 finds nothing needing fixes, commit is still required to document the pass occurred: use `git commit --allow-empty -m "chore: grade-level review pass — no drift found, page already meets target"` only if literally no file changes resulted; otherwise the normal commit above applies.

---

## Task 12a: Section-to-Section Transitions

**Files:**
- Modify: `gun-violence.html` (prose adjustments only — no structural changes, no new sections)

**Context:** Added after the project owner reviewed the fully-assembled, grade-level-tightened page and found the overall reading experience still doesn't flow: each section's own prose is fine individually, but the page reads as a set of disconnected mini-essays rather than one continuous argument. See the design doc's "Section-to-Section Transitions" subsection for the full rationale. The `#scale` → `#second-amendment` seam already works (it closes with a "how did we get here?" question that `#second-amendment`'s opening picks up) — that seam is the model for what a real transition looks like here, not a generic transition word or phrase.

**Scope:** add a genuine bridging beat at the seam of each of these transitions, in this order:
1. `#second-amendment` → `#measures-tried`
2. `#measures-tried` → `#policy-today`
3. `#policy-today` → `#washington-story` (this seam is a partial exception — `#washington-story` already opens by referencing the ERPO mechanism just covered in `#policy-today`; read it first and only strengthen it if it still reads as an abrupt handoff, don't duplicate work that's already done)
4. `#washington-story` → `#international`

The update-pane, `#timeline`, Key People, Videos, and Resources are explicitly OUT of scope for this task — the update-pane is a deliberate "current snapshot" interlude and the back-matter sections are naturally list-like, not narrative.

- [ ] **Step 1: Read each seam's current opening/closing sentences**

For each of the four transitions listed above, read the last 2-3 sentences of the earlier section and the first 2-3 sentences (the `<p class="lede">`) of the later section. Confirm in your own notes what specific thread (a question, a fact with an implication, an unresolved tension) could genuinely connect them — don't invent a connection that isn't actually there in the content.

- [ ] **Step 2: Add the bridging beat at each seam**

For each transition, make ONE of these two edits — whichever reads more naturally for that specific seam:
- (a) add a short sentence or clause to the END of the earlier section's final paragraph that sets up what's coming, or
- (b) add a short sentence or clause to the START of the later section's lede that references what was just covered.

Do not rewrite the rest of either section's content. Keep every added sentence at the page's 5th-6th grade target (~12-15 words). Do not touch any citation, quote, or `.term` tooltip in the process — if a paragraph you're editing contains a quote, edit only the non-quoted portion and leave the quoted span's exact text and adjacent punctuation untouched (same discipline as Task 12).

- [ ] **Step 3: Verify citation and quote integrity after edits**

Count `cite-inline` occurrences before and after this task's edits — confirm identical (no citation should be added, removed, or accidentally duplicated by this prose-only task). For any quote-bearing paragraph touched in Step 2, confirm the quoted span itself is byte-identical to before this task's edits.

- [ ] **Step 4: Verify**

Run: `open gun-violence.html` and read straight through from `#second-amendment` to `#international` in one pass. Confirm each of the four seams now reads as a continuous handoff rather than a cold start — you should be able to point to the specific sentence/clause that does the bridging at each seam. Check div/tag balance is unchanged.

- [ ] **Step 5: Commit**

```bash
git add gun-violence.html
git commit -m "feat: add section-to-section transitions from Measures Tried through International"
```

---

## Task 13: Full-Page Verification Pass (Including Dedicated Nonpartisanship Pass)

**Files:** None modified unless this step surfaces a real problem — verification only, except for the `MAX_PTS` fix flagged in Task 1.

- [ ] **Step 1: Fix the `MAX_PTS` placeholder from Task 1**

Count the actual number of quiz entries added across Tasks 2-9 (this plan anticipates `q1` through `q7`, but confirm the real count directly from the file). Update `const MAX_PTS = 0;` to the real count. Confirm the points-bar UI correctly reflects this new max.

- [ ] **Step 2: Confirm no leftover placeholder content remains**

Run: `grep -n "\[Content added in Task\|TODO\|TBD\|placeholder" gun-violence.html`
Expected: no matches (aside from the `MAX_PTS` comment already resolved in Step 1).

- [ ] **Step 3: Dedicated nonpartisanship read-through — the most important step in this task**

Read the ENTIRE page start to finish, in one continuous pass, specifically hunting for any sentence that could read as taking a political position. This must be a genuinely fresh, independent read — not a rubber-stamp of Tasks 5, 6, 7, and 8's own dedicated passes. For every sentence touching current or recent U.S. policy (concentrated in Task 6, touched in Task 5 and Task 7): would this read the same regardless of which party or administration is associated with it? For Task 6's `.perspectives` blocks specifically: re-confirm equal specificity and length on both sides, re-confirm neither side was written by paraphrasing the other's characterization. For Task 8's international comparisons: confirm no country's profile reads as an implicit endorsement or criticism relative to U.S. policy. For Task 10's "Groups Working on This Issue" subsection (if it was built): re-apply the perspective-swap test one more time, independently. For Sections 1, 2, and 3's settled-fact content: confirm accuracy without hedging, and confirm nothing was over-softened by Task 12's grade-level pass — over-softening is as real a failure mode as under-softening a genuinely contested claim.

- [ ] **Step 4: Confirm Key People stays scoped correctly**

Run: `grep -n "person-card\|class=\"person\"" gun-violence.html` and manually confirm both entries are historical figures, not current sitting officials or currently-active advocates.

- [ ] **Step 5: Confirm the differing-perspectives component didn't leak outside Task 6**

Run: `grep -n "perspectives\|perspective-label" gun-violence.html` and confirm every match is inside Task 6's update-pane section only.

- [ ] **Step 6: Confirm the suicide-data handling is still correct after all subsequent edits**

Re-read the scale/statistics section's suicide-data sentences one more time in the fully-assembled page (this section opens the page as of Task 3a's reorder — confirm its actual current section, don't assume "Section 2" — checking that nothing added in later tasks accidentally pushed the 988 crisis note further from its sentence, or altered its supportive tone).

- [ ] **Step 7: Re-verify all citation links resolve**

```bash
grep -oE 'href="https://[^"]+"' gun-violence.html | sed -E 's/^[^:]+:href="//;s/"$//' | sort -u > /tmp/gun-violence-links.txt
wc -l /tmp/gun-violence-links.txt
while read -r url; do
  code=$(curl -s -o /dev/null -w "%{http_code}" -A "Mozilla/5.0" -L --max-time 10 "$url")
  echo "$code $url"
done < /tmp/gun-violence-links.txt | sort -n
```
For non-200 results (especially 403), cross-check with a direct fetch tool before concluding anything is actually broken — this project's established pattern is that some legitimate government/news domains bot-block curl but work for real readers.

- [ ] **Step 8: Confirm every quiz functions and covers a fact still present on the page**

In the browser, click every quiz button. Confirm each question/answer displays correctly and references a fact still accurately stated on the page.

- [ ] **Step 9: Confirm reading level (cross-check against Task 12's own pass)**

Spot-check several sections one more time, independently of Task 12's own verification — this is a genuinely separate check, not a rubber-stamp. The update-pane's density is an accepted trade-off; flag (don't necessarily rewrite) anything else that still reads notably harder than the rest.

- [ ] **Step 10: Confirm zero structural/CSS drift from the established site pattern**

Compare `gun-violence.html`'s CSS class names and JS function signatures against `immigration.html`'s — confirm this page reuses the SAME class names for shared components. The two approved exceptions are `.perspectives`/`.perspective`/`.perspective-label` (reused, not new — confirm it's genuinely identical to Immigration's, not a modified variant) and `.term` (reused, not new). Confirm no other new component type was introduced beyond what the "Groups Working on This Issue" resource cards needed (which should reuse the existing `.rc` pattern, not invent one).

- [ ] **Step 11: Confirm all images resolve and comply with the non-graphic filter**

Run: `grep -oE 'src="images/[^"]+"' gun-violence.html` and confirm every referenced file exists in `images/`. Re-confirm, one final time, that no image depicts a shooting scene, memorial, or victim.

- [ ] **Step 12: Confirm mobile-width text does not clip, including the `.perspectives` and `.term` components**

Confirm `min-width:0` was applied consistently to flex children pairing fixed-size elements with text. Specifically check the `.perspectives` component's mobile media query (stacks the two columns vertically below 600px) and the `.term` tooltip's mobile behavior (stays on-screen at narrow widths).

- [ ] **Step 13: Final commit if any fixes were needed**

```bash
git add gun-violence.html
git commit -m "fix: address verification-pass findings in Gun Violence page build"
```

If no fixes were needed beyond Step 1's `MAX_PTS` update, note that explicitly rather than leaving it ambiguous whether this step ran.

---

## Task 14: Wire the New Page into the Site

**Files:**
- Modify: `index.html`
- Modify: `iran.html`, `ukraine.html`, `climate-change.html`, `ai.html`, `us-elections.html`, `immigration.html` (add a sibling-nav link to Gun Violence on each)

**Context:** This task runs LAST, only after Task 13's full verification pass is complete and clean.

- [ ] **Step 1: Read the existing Gun Violence "Coming Soon" entry and a live entry directly**

Read `index.html`'s current Gun Violence entry (search for "Gun Violence" — this entry was added during Immigration's own site-wiring task as a "Coming Soon" backfill; confirm its current exact markup) AND at least one live tier-card for comparison (search for `tier-card`). Do not reconstruct either pattern from memory — read the real, current markup.

- [ ] **Step 2: Convert the Gun Violence entry from "Coming Soon" to a live tier-card**

Remove the existing "Coming Soon" entry and add a new `<a href="gun-violence.html" class="tier-card">` entry following the exact structural pattern of a live card: a `tier-photo` (reuse an already-sourced image from Task 11 if one crops well at card size, following Immigration's precedent of reusing its hero image rather than sourcing a new one for this single use — otherwise source one new, compliant image specifically for this card), a `tier-kicker`, an `<h3>` matching the page's actual confirmed title, a short card-length description (not copy-pasted from any longer section), and a `tier-meta` showing reading time and "Updated [actual date]".

- [ ] **Step 3: Update the homepage's section-nav**

Add a nav link for Gun Violence to the homepage's sticky section-nav, following the existing pattern's exact formatting. Confirm every existing nav link is untouched.

- [ ] **Step 4: Add sibling-nav links on every other page**

On each of `iran.html`, `ukraine.html`, `climate-change.html`, `ai.html`, `us-elections.html`, `immigration.html`: add a link to `gun-violence.html` in that page's own sticky nav, alongside the existing sibling-topic links. **Verify this lands in the correct nav bar on each page** — a real bug occurred during Immigration's site-wiring task where a sibling link was added to the wrong nav bar on `climate-change.html` (an orphaned link in `section-nav` instead of `masthead-top`, later found and fixed in v2.5.1) — check each page's actual convention (some pages use `masthead-top` for sibling links, some use `section-nav` — this split is a known, documented site inconsistency, not something to unify in this task, but each page's link must land in whichever bar that specific page already uses for its other sibling links) before adding the new link, and confirm after adding it that it sits alongside the existing sibling links, not orphaned in the wrong bar.

- [ ] **Step 5: Verify**

Run: `open index.html`. Confirm: the Gun Violence card renders correctly as a live card, matches other live cards' visual weight, its link resolves; the homepage nav's new link resolves; nothing else on the page was accidentally altered. Then open each of the six other topic pages and confirm each one's sibling-nav now includes a working link to `gun-violence.html`, correctly placed in that page's own existing nav-link location (not a new orphaned line), and that no existing sibling link on any of those pages was broken in the process.

- [ ] **Step 6: Commit**

```bash
git add index.html iran.html ukraine.html climate-change.html ai.html us-elections.html immigration.html
git commit -m "feat: wire Gun Violence page into the site (homepage card, cross-page nav)"
```

---

## Task 15: Warmth & Engagement Pass

**Files:**
- Modify: `gun-violence.html` (prose adjustments and one new `.pull-quote` use — no structural/section changes, no new claims, no citation changes)

**Context:** Added after the project owner reviewed the fully-built, fully-wired page and found it doesn't have the warm, engaging feel of the site's other topic pages. See the design doc's "Warmth & Engagement Pass" subsection for the full diagnosis. This is a rhythm-and-tone pass on already-approved content, not new research: no new facts, no new sections, no reordering, no touching the update-pane or international-comparison sections (their clinical register is a deliberate nonpartisanship requirement, not a defect).

**Scope, in order:**

1. Rewrite 2-3 of the flattest, most methodology-focused `.callout` boxes into genuine "Worth Noticing" reveals — a surprising, concrete, human-stakes fact, matching the register of `immigration.html`'s callouts (e.g., its "the old system asked... the new system asked..." callout). Best candidates: the map-vs-table callout near `#scale` (~line 820, "The map and the table measure two different things...") and the federal/state "two-layer system" callout near `#policy-today` (~line 969). Do NOT touch the Astor "A Researcher Changes His Mind" callout — it already works. Keep every rewritten callout's existing citation(s) attached to the same claim; do not remove sourcing in the process of making a callout more engaging.
2. Introduce one real `.pull-quote` use (the CSS component already exists in this page but is never invoked in its content — confirm this yourself by checking the file before starting). Build it from a shortened excerpt of the James Brady story already written in full in Key People (~search `<h4>James Brady</h4>`), and place it near the landmark-laws section (`#second-amendment`) where it's thematically anchored. Key People keeps Brady's full bio as-is — the pull-quote is a short, standalone callback (a sentence or two, in his or a close paraphrase's voice, with an `.attrib` line), not a duplicate of the full bio.
3. Optional: add one additional short human-scale moment near `#measures-tried` or `#washington-story`, only if you find something genuinely well-sourced while reading through — do not manufacture one or stretch a citation to force this in.

- [ ] **Step 1: Read the current state of both target callouts and the Brady bio**

Read the map-vs-table callout, the two-layer-system callout, and the full James Brady bio in Key People, exactly as currently written. Confirm your read of what's flat about the two callouts and what's usable from Brady's story before editing.

- [ ] **Step 2: Rewrite the 2-3 selected callouts**

Keep the `.callout`/`<span class="tag">` structure and each callout's existing citation(s) intact. Change only the `<p>` content to lead with a concrete, surprising, human-stakes framing rather than a methodology explanation. Keep the page's 5th-6th grade reading level (~12-15 words/sentence).

- [ ] **Step 3: Add the `.pull-quote` near `#second-amendment`**

Use the exact `.pull-quote`/`.attrib` markup pattern already defined in this page's CSS (confirm the real class names and structure directly in the file — do not assume from memory). Content is a short excerpt/paraphrase drawn from the Brady bio already on this page, not a new unsourced claim.

- [ ] **Step 4: Verify citation and structural integrity**

Count `cite-inline` occurrences before and after this task's edits — confirm identical (no citation added, removed, or duplicated by this prose-only task, aside from whatever the pull-quote's `.attrib` may reference, which should point to a citation already used for Brady elsewhere on the page, not a new source). Check div/tag balance is unchanged aside from the intentional new `.pull-quote` block.

- [ ] **Step 5: Verify**

Run: `open gun-violence.html`. Read through `#second-amendment` and the two rewritten callouts. Confirm the pull-quote renders visually consistent with how `.pull-quote` looks/behaves on `immigration.html` or other pages that use it. Confirm nothing outside the touched callouts/pull-quote changed.

- [ ] **Step 6: Commit**

```bash
git add gun-violence.html
git commit -m "feat: warmth and engagement pass — human-stakes callouts and first pull-quote use"
```

---

## Task 16: Early Images & Update-Pane Vocabulary Grounding

**Files:**
- Modify: `gun-violence.html` (add images near the top of the page; add short grounding text in the update-pane — no citation changes, no section reordering, no content deletion)

**Context:** Added after the project owner opened the live page in a browser (post-Task 15) and found two related problems: the page's opening third (hero, narrative hook, update-pane, all of `#scale`) has no in-content images, and the update-pane opens with policy jargon like "red-flag laws" before `#policy-today` (further down the page) ever explains the underlying mechanism. See the design doc's "Early Images & Update-Pane Vocabulary" subsection for the full diagnosis.

**Scope:**

1. In the update-pane, find each contested question that uses a term the page hasn't taught yet by that point (start with the "Should more states adopt or expand red-flag laws?" question, which uses "extreme risk protection orders"/"red-flag laws" — confirm by reading the update-pane's full content whether any other question has the same issue). For each one, add one short, plain-language grounding sentence or clause immediately before the term's first use in that question — in addition to the existing `.term` tooltip, not a replacement for it. Do not remove or alter the tooltip itself, its `data-def` text, or the surrounding question structure.
2. Source and add a genuine, verified, non-graphic image to `#scale` (the stats/hex-map/table section), following this page's established image discipline: Wikimedia Commons only, license and subject verified directly on the image's own Commons file page, no incident/victim/memorial imagery — favor policy/institutional subject matter (e.g., a CDC building, a data/statistics-adjacent institutional photo, or similar).
3. Source and add a genuine, verified, non-graphic image to the update-pane, same discipline as above.
4. Attempt to source a genuine, verified, non-graphic image fitting the opening narrative hook (the lockdown-drill scene) — same discipline. If no compliant, verified image can be found that actually fits this specific placement without forcing a weak or borderline match, it is acceptable to skip this one placement only; Steps 2 and 3 are expected to ship regardless.
5. For every new image: use the same `.photo-break` (for section-level images) or an inline placement consistent with this page's existing image markup (confirm the exact pattern by reading how images were added in Task 11, rather than inventing new markup). Every new image needs real alt text describing its actual subject, and a caption/credit line crediting Wikimedia Commons and the license, matching this page's existing image-credit convention exactly.

- [ ] **Step 1: Read the update-pane's full current content and the existing image markup pattern**

Read the entire `#update-pane` block to identify every term needing grounding text (not just the red-flag example). Read Task 11's existing image markup elsewhere on the page (`.photo-break` usage, credit-line format) to match it exactly rather than inventing a new pattern.

- [ ] **Step 2: Add grounding text in the update-pane**

Add the short grounding sentence(s)/clause(s) identified in Step 1. Keep the page's 5th-6th grade reading level (~12-15 words/sentence). Do not touch any citation or the `.term` tooltip itself.

- [ ] **Step 3: Source and verify images for Scale and the update-pane**

For each image: find a candidate on Wikimedia Commons, open its own Commons file page directly (not a search thumbnail or an embedding article) to verify the license (public domain or CC) and confirm the subject matches what you intend to use it for. Reject and try again if either check fails. Confirm neither image is incident/victim/memorial imagery.

- [ ] **Step 4: Attempt the narrative-hook image**

Same sourcing/verification process as Step 3. If nothing suitable is found after a genuine attempt, skip this one placement and note it in your report — do not force a weak match.

- [ ] **Step 5: Add the image markup**

Insert each verified image using this page's existing `.photo-break` (or equivalent inline) markup pattern, with accurate alt text and a properly formatted Commons credit/license line.

- [ ] **Step 6: Verify citation and structural integrity**

Count `cite-inline` occurrences before and after — confirm unchanged (this task adds images and grounding prose, not new cited claims, so the count should not change unless the grounding text itself needs a citation — if it restates a fact already cited elsewhere on the page, it does not need a new citation of its own). Check div/tag balance is unchanged aside from the intentional new image blocks.

- [ ] **Step 7: Verify**

Run: `open gun-violence.html`. Confirm all new images render (no broken paths — the `onerror` fallback should not trigger), read the update-pane's grounding additions in context to confirm they genuinely help a first-time reader without feeling redundant with the tooltip, and confirm nothing else on the page changed.

- [ ] **Step 8: Commit**

```bash
git add gun-violence.html
git commit -m "feat: add early images and update-pane vocabulary grounding"
```

---

## Task 17: Persona Review Fixes

**Files:**
- Modify: `gun-violence.html` (lede content-note, MAX_PTS fix, aria-describedby wiring, update-pane trim, new discussion-questions block — no citation removal, no section reordering, no repositioning of the update-pane)

**Context:** Added after a 3-persona review (student, teacher, UX-focused edtech developer — each reading the live page independently, with no persona seeing the others' output) surfaced 5 concrete findings. See the design doc's "Persona Review Findings & Fixes" subsection for the full rationale behind each. This task fixes all 5 in one pass.

- [ ] **Step 1: Add a content note before the opening lede**

Read the current lede (`<p class="lede">The lights go off first...`). Immediately before it, add one short, calm sentence acknowledging the topic directly — not alarmist, matching the tone of the page's existing 988 crisis-note. Do not alter the lede itself.

- [ ] **Step 2: Fix the points-accounting bug**

Find `MAX_PTS` in the JS (search `MAX_PTS`). Count the true total obtainable points: 9 quizzes (`q1`-`q9`, each presumably worth 1 point — confirm the actual per-quiz point value in `addPoints()` calls, don't assume) plus the 3 discoverable easter eggs (hero-flag, stat-click-all, Konami code — confirm each egg's actual `addPoints()` call value). Set `MAX_PTS` to the correct true sum, not a guess. Confirm the progress bar and `unlockHint` logic still work correctly with the corrected total.

- [ ] **Step 3: Add `aria-describedby` to `.term` tooltips**

Read the current `.term` markup pattern (search `class="term"`) and its `data-def` attribute usage. Wire each `.term` span to an accessible description of its `data-def` text via `aria-describedby` (pointing at a visually-hidden element carrying the same text, or an equivalent standard accessible-name technique) — reuse the exact `data-def` text, do not rewrite or duplicate-with-drift. Since this pattern likely repeats for every `.term` instance on the page, implement it as a consistent, repeatable markup pattern (e.g., a hidden `<span>` immediately after each term with a unique `id` referenced by that term's `aria-describedby`) rather than one-off fixes.

- [ ] **Step 4: Trim the update-pane's perspectives density**

Read the update-pane's `.perspectives` blocks in full. Tighten each side's statement for length (shorter, punchier per-side statements; fewer total quoted clauses stacked in a row) without weakening the balance (equal visual weight, equal specificity between sides) or removing any citation. This is a length/density edit — do not change either side's actual position or add/remove a contested question.

- [ ] **Step 5: Add a discussion-questions block**

Add a short (3-5 question) open-ended discussion-question set near the Resources section, in the same spirit as the existing "While you watch, think about" video callout (reuse a similar `.callout` pattern rather than inventing new markup). Frame it explicitly for classroom/small-group use. Questions should be genuinely open-ended (no single correct answer), drawing on the page's actual content (e.g., referencing the differing-perspectives questions, the international comparison, or the measures-tried research).

- [ ] **Step 6: Verify citation and structural integrity**

Count `cite-inline` occurrences before and after — confirm unchanged (no citations removed by the update-pane trim). Check div/tag balance is unchanged aside from intentional new blocks (content-note, hidden description spans, discussion-questions block).

- [ ] **Step 7: Verify**

Run: `open gun-violence.html`. Confirm the content note reads calm and appropriate before the lede. Confirm the points math is internally consistent (manually trace: if a student answers all 9 quizzes and finds all 3 eggs, do they hit exactly `MAX_PTS` with no overflow or shortfall). Spot-check a `.term` span's `aria-describedby` wiring renders correctly (inspect the DOM or view source). Confirm the trimmed perspectives boxes still read balanced. Confirm the new discussion questions read naturally and reference real page content.

- [ ] **Step 8: Commit**

```bash
git add gun-violence.html
git commit -m "fix: persona-review fixes — lede framing, points accounting, tooltip a11y, perspectives density, discussion questions"
```

---

## Self-Review Notes

- **Spec coverage:** All design doc sections (page structure items 1-11, the update-pane's Part A/Part B split reusing the differing-perspectives component, nonpartisanship discipline, Washington's School Safety Story, the international-comparison section, Key People, the "Groups Working on This Issue" balanced-pair subsection, images with the non-graphic hard filter, sourcing standards, reading level with its required dedicated review task, out-of-scope list) map to Tasks 1-14 in this plan. The design doc's explicit requirement that images, advocacy groups, and grade-level review be *built in from the start* (not discovered as mid-build gaps, per the explicit lesson from Immigration's build) is reflected by Tasks 10, 11, and 12 existing as first-class tasks in this plan's original numbering, not inserted later.
- **Placeholder scan:** Task 1's two intentional placeholders (`MAX_PTS = 0` and the `[Content added in Task N]` section stubs, plus Task 9's specific `[Groups subsection added in Task 10]` stub) are all explicitly flagged with a specific resolution step in a later task (Task 13 Step 1, and Tasks 2-10's content-writing steps respectively) — none is a silent gap. Every deliberately-deferred decision (exact page title wording, exact Key People names, exact accent color, exact contested-question list for the differing-perspectives component, exact image subjects, exact advocacy-organization pair or the decision to omit that subsection) is explicitly flagged as "confirm/decide/research at implementation time" rather than silently assumed.
- **Type consistency:** N/A (no code interfaces — HTML/CSS/JS content only). Class/ID names are specified throughout as "confirm the exact name against `immigration.html`'s real markup" rather than asserted from memory. Quiz IDs are pre-assigned sequentially per task (`q1` Task 2 through `q7` Task 8) to avoid collisions; if task order changes during implementation, whoever makes that change is responsible for re-checking quiz-ID uniqueness directly against the live `quizzes` object.

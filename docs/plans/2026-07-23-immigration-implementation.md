# Immigration & U.S. Policy Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new topic page, `immigration.html`, from scratch, matching the established structure and conventions of `iran.html`/`ukraine.html`/`ai.html`/`us-elections.html`/`climate-change.html` — a history-first explainer ("A Nation of Immigrants") running from the colonial era through the 1965 Immigration and Nationality Act, then today's legal-process mechanics, a live update-pane, and a Washington-specific local-history section — and wire it into the site's index/nav. This is the highest nonpartisanship-risk page built on this site to date; it introduces one new, tightly-scoped component (a side-by-side differing-perspectives block) used only for genuinely contested present-day enforcement claims in the update-pane.

**Architecture:** Task 1 scaffolds the entire page shell by adapting `climate-change.html`'s proven structure (the most recently built, most refined reference implementation) — CSS palette, shared JS engine, nav, hero, points bar, footer — with content-section placeholders. Tasks 2–5 build the historical arc (Sections 1–4) in strict chronological order, each ending in the next. Task 6 builds Section 5 (today's legal mechanics + the ICE explainer). Task 7 builds the update-pane, including the new differing-perspectives component — this is this plan's single highest-risk task. Task 8 builds Washington's Immigration Story (the local section — lower risk than Task 7 by design, since it's scoped to history/community, not policy). Task 9 covers History Timeline, Key People, Videos, Resources. Task 10 sources at least one real, verified image per content section — added as a dedicated task because a page this long and text-heavy needs real visual breaks, not just Key People portraits. Task 11 is the full-page verification pass, including a fresh, independent nonpartisanship read-through of Tasks 2–8 and a check that Task 10's images all resolve and are properly licensed/captioned. Task 12 wires the new page into `index.html` and adds sibling-nav links across every other page — this task runs LAST, after Task 11's verification pass is clean, matching the exact ordering discipline every prior page build on this site has used.

**Tech Stack:** Plain HTML, no build step, no test runner. Verification is manual: grep checks, browser opens, citation-link clicks, and dedicated nonpartisanship read-throughs on Tasks 4 (quota era), 7 (update-pane/enforcement), and 8 (local section), plus a final whole-page pass in Task 11.

## Global Constraints

- Write all new prose at a 5th–6th grade reading level (project convention). The update-pane's Part A (backlog/statistics) and Part B (enforcement facts, differing-perspectives content) may land slightly higher given factual density and the need for precise, careful language — treated as an acceptable, expected trade-off, consistent with how Climate's Washington policy sub-section was treated, not a defect to force-fix.
- Every factual claim gets an inline `<cite-link><a href="..." target="_blank">src</a></cite-link>` (matching the site's established pattern), pointing to a real, currently-live, non-paywalled source.
- Fetch and read every source directly to confirm it supports the specific claim it's cited for — a live/200 URL is necessary but not sufficient. Prioritize primary/authoritative sources: U.S. Citizenship and Immigration Services (USCIS), Department of Homeland Security (DHS), the National Archives, the Migration Policy Institute (a widely-cited nonpartisan research organization), and Pew Research Center (nonpartisan, widely used for immigration statistics) — over secondary news coverage wherever a direct fetch is possible.
- **Default nonpartisanship discipline, non-negotiable everywhere on this page**: state facts, dates, and figures plainly. Attribute any characterization to a named, dated source's own findings — never assert it directly as the page's own judgment. Avoid editorializing adjectives near policy or enforcement descriptions. Apply the party-swap/perspective-swap test to every sentence touching current or recent policy: *would this sentence read the same regardless of which political side, party, or administration is associated with it?*
- **Settled-history exception to the above**: historical exclusionary policy (the Chinese Exclusion Act and other Asian exclusion laws in Task 3, the 1924 national-origins quota system in Task 4, Japanese American incarceration in Task 8) is named accurately per mainstream historical scholarship — "exclusionary," "discriminatory," and similar accurate descriptors are NOT editorializing when applied to settled historical fact, and must not be hedged with a "some historians say" qualifier they don't need. Do not apply the party-swap test to settled history — apply it only to genuinely live, present-day, contested policy questions. If a task's content is ambiguous about which category it falls into, treat it as contested (the stricter standard) rather than assuming settled-history treatment.
- **The new differing-perspectives component (Task 7 only)**: for genuinely contested present-day claims in the update-pane's enforcement content (Part B), present two or more named viewpoints side by side, each with its own real, verifiable citation. Equal visual weight, equal specificity, no side gets the last word or an unattributed "but critics say" aside. This component is scoped ONLY to Task 7's enforcement content — do not use it in any other section of this page, and do not introduce it as a new site-wide or cross-page component.
- Key People (Task 9) is scoped to historical figures only — one historically significant immigrant, one policy figure tied to the 1965 Immigration and Nationality Act — never a current sitting official or currently-active advocate/policymaker in either role, regardless of how carefully a bio might be worded. This is this site's established hard rule, not something to revisit mid-implementation.
- No international immigration/refugee-law content beyond a brief definitional mention (asylum vs. refugee status in Task 6) — this page's scope is U.S. immigration, matching every prior page's domestic focus.
- No state-level immigration policy content (e.g. "sanctuary" laws) anywhere on this page, including Task 8 — the Washington section is scoped to community/history only, per the approved design doc. If Task 8's research surfaces state-policy material, it is out of scope; do not include it even if well-sourced.
- No personal legal advice or "how to apply" walkthrough in Task 6 — explain how the system works conceptually, not a procedural guide for an actual applicant.
- No running, frequently-refreshed news ticker — the update-pane is a dated snapshot like every other page's, refreshed at future site updates, not a live feed.
- Images: Wikimedia Commons only, verified license (public domain/CC) AND subject-match confirmed directly on the file's own Commons page (not just an embedding Wikipedia article). Use the site's established honest "no verifiable image found" fallback (a `.person-emoji-fallback` div or equivalent stated disclosure) rather than a forced or unverified image citation.
- Reuse the existing site's shared component patterns (`update-pane`, `mini-tl`, `s-card`/`focus-pane` or `climate-change.html`'s equivalent naming, `stat-pair`/`stat-trio`, `pull-quote`, `cite-inline`, `vocab`, `callout`, `person-card`, `tl-item`, quiz/points/easter-egg engine) exactly as implemented on `climate-change.html` — no new CSS component types beyond the one differing-perspectives component this plan explicitly designs in Task 7.
- Re-verify every date/figure/name against a live, current, nonpartisan source at write time — the design doc's proposed facts and candidate figures are starting points, not copy-paste-ready content.
- Apply this project's date-specificity discipline throughout: never write "now" or "currently" without an explicit date attached, since pages are refreshed periodically and relative phrasing goes silently stale between refreshes.

---

## Reference Files

- **Design doc:** `docs/plans/2026-07-23-immigration-design.md`
- **New page:** `immigration.html`
- **Primary reference page** (most recently built, most refined structural/CSS reference): `climate-change.html` — read this in full before starting Task 1, not just referenced piecemeal per-task.
- **Secondary reference** (for its update-pane, local-section, and curated-dated-links patterns): `us-elections.html`
- **Index page** (add a new live topic-card + nav link): `index.html`
- **Other pages needing a sibling-nav link added** (per this site's established cross-page-navigation convention): `iran.html`, `ukraine.html`, `ai.html`, `us-elections.html`, `climate-change.html`

---

## Task 1: Scaffold the Page Shell

**Files:**
- Create: `immigration.html`

**Context:** This task builds the entire page skeleton by adapting `climate-change.html`'s proven structure — CSS reset/variables/hero/nav/points-bar patterns, and the full shared JS engine (quiz system, points tracking, easter eggs, dyslexic-font toggle, accessibility text-size controls) — with a new, topic-appropriate color palette and empty/placeholder content sections that later tasks will fill in. Treat this as "port a working template," not "design a new one."

- [ ] **Step 1: Read the reference structure directly**

Read `climate-change.html` in full: the CSS reset/variables/masthead/hero (search for `<header class="hero">` or this page's equivalent), the sticky `<nav class="section-nav">` block (confirm the actual class name used — it may differ slightly from `us-elections.html`'s `sticky-nav`, since `climate-change.html` is the more recently built reference), the points-bar markup, the dark `.focus-pane`/`.update-pane` markup (search for `focus-pane` and `update-pane`), the `.stat-pair`/`.stat-trio` markup, the `.pull-quote` markup, the `.cite-inline` markup, and the two `<script>` blocks near the end. Do not write any of this from memory or from this plan's prose description alone — read the real, current markup.

- [ ] **Step 2: Create `immigration.html` with the base HTML skeleton**

Start with:
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>A Nation of Immigrants: The Story of U.S. Immigration – Student Resource</title>
<meta name="description" content="How U.S. immigration policy came to be — from the colonial era to today's system — and what's happening right now, explained for middle schoolers.">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
<link href="https://fonts.cdnfonts.com/css/opendyslexic" rel="stylesheet">
<style>
/* ─── RESET & BASE ─── */
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{overflow-x:hidden;overflow-wrap:break-word}
</style>
</head>
<body>
</body>
</html>
```

Confirm the exact font-family stack and reset rules against what `climate-change.html` actually uses (it may include Nunito or a different sans-serif for utility text — copy its real values rather than the above placeholder, which only sketches the shape). Note `overflow-wrap:break-word` from the start — a real mobile-width overflow bug was found and fixed on a prior page build; every flex child pairing a fixed-size icon/dot with a text sibling must get `min-width:0` as you build each component in later tasks, not retrofitted after a bug report.

This page does not need the Leaflet.js map library — no task in this plan calls for an interactive map.

- [ ] **Step 3: Add a new CSS color palette**

Add CSS custom properties for a palette distinct from every existing page's (Iran's red/gold, Ukraine's blue/yellow, AI's blue/purple, US Elections' navy/gold/green, Climate's slate/ice/forest) and reusing the site's locked shared design tokens where the design system defines them globally (`--paper`, `--ink`, `--ink-light`, `--ink-faint`, `--rule`, `--rule-heavy` — confirm these exact token names and values directly from `climate-change.html`'s `:root` block rather than retyping them from memory here). For this page's own accent(s), avoid any color strongly associated with either major U.S. political party as a primary accent — this page carries real palette risk given its subject matter, more so than Climate's earth-tones. A muted, warm neutral-toned accent (e.g., a warm ochre/terracotta or a muted teal, distinct from red/blue) is a reasonable starting point; confirm the final choice reads as neutral before committing to it in Step 7's visual verification.

- [ ] **Step 4: Port the masthead, sticky-nav, and points-bar structure**

Adapt `climate-change.html`'s masthead/nav/points-bar markup to this page:
- Hero: title "A Nation of Immigrants", subtitle summarizing the page's actual angle (the long history behind today's immigration system, and where things stand now), a dated hero-note ("Updated [DATE] · 8th Grade Social Studies · Earn points by answering quizzes!" — use the actual write date).
- Sticky-nav: anchor links for each of this page's sections, in this order: `#update-pane` (or this page's equivalent id — confirm the exact id convention against Task 7's Step 2), `#colonial-era`, `#great-waves`, `#quota-era`, `#modern-system`, `#how-it-works-today`, `#washington-immigration`, `#timeline`, `#key-people`, `#videos`, `#resources`. Include a "🏠 All Topics" link to `index.html` and sibling links to `iran.html`, `ukraine.html`, `climate-change.html`, `ai.html`, `us-elections.html` from the start, per this site's established cross-page-navigation convention (do not treat this as a later retrofit — Task 12 will add the reverse links on those five pages, but this page's own outbound links belong here in Task 1).
- Points-bar: identical structural pattern to `climate-change.html`, no changes needed beyond the container existing.
- Accessibility controls: confirm `climate-change.html`'s dyslexic-font toggle and text-size controls are present in this port, not just the toggle button alone — per this project's standing requirement that these be pervasive across every page.

- [ ] **Step 5: Port the full shared JS engine**

Copy `climate-change.html`'s two `<script>` blocks into this new file. Adapt:
- The `quizzes` object: replace with an empty object for now (`const quizzes = {};`) — subsequent tasks will add entries as they build each section's quiz.
- `MAX_PTS`: set to `const MAX_PTS = 0; // TODO: update once all quizzes are added (final verification pass)` — an intentional, explicitly-flagged placeholder resolved in Task 11's Step 1, not a silent gap.
- Confirm `openQuiz`, `showToast`, and the points-tracking logic are copied verbatim (they're topic-agnostic) — do not modify their internal logic.
- Any Climate-specific easter-egg content (e.g., anything tied to an ice/glacier/forest theme) — keep the generic mechanism (any Konami-code array, click-counter mechanics, `showToast` function) but do not port topic-specific *content* inside those mechanisms. Leave the trigger mechanism in place; a later task can add page-appropriate easter-egg content if desired, but this is not required by this plan.

- [ ] **Step 6: Add placeholder section containers**

Add empty placeholder section containers (with a single explicitly-tracked placeholder sentence, e.g. `<p>[Content added in Task 2]</p>`) for each of: the update-pane (Task 7), Colonial Era & Early Immigration (Task 2), The Great Waves (Task 3), The Quota Era (Task 4), The Modern System Begins (Task 5), How Does Immigration Work Today? (Task 6), Washington's Immigration Story (Task 8), History Timeline (Task 9), Key People (Task 9), Videos (Task 9), Resources (Task 9) — matching each container's exact class/id naming convention from `climate-change.html` (e.g., whatever `climate-change.html` uses for its numbered content sections — confirm the exact class name, don't assume it's `s-card` without checking).

- [ ] **Step 7: Verify the shell loads and functions**

Run: `open immigration.html`. Confirm: the page loads with no console errors, the masthead/nav/points-bar render with the new palette, the palette reads as neutral (not accidentally tinted toward a red/blue political association — a quick visual gut-check, refined further if anything about it feels off once real content is in place), clicking a nav anchor scrolls to the corresponding (placeholder) section, the dyslexic-font toggle and text-size controls work, and no broken image/asset references exist (this shell shouldn't reference any images yet).

- [ ] **Step 8: Commit**

```bash
git add immigration.html
git commit -m "feat: scaffold Immigration page shell (CSS, JS engine, empty sections)"
```

---

## Task 2: Section 1 — Colonial Era & Early Immigration

**Files:**
- Modify: `immigration.html` (the `#colonial-era` placeholder section)

**Context:** The page's opening content, and the first place this page's nonpartisanship-adjacent discipline applies — not because colonial history is contested, but because the design doc requires two things to appear explicitly and without minimization: that Indigenous peoples already lived on this land before any immigration began, and that the transatlantic slave trade is named as forced migration in its own paragraph, not folded into the "waves of immigration" framing.

- [ ] **Step 1: Verify facts before writing**

Confirm, via direct fetch of a primary/authoritative source (the National Archives, the Library of Congress, or a National Park Service historical page):
- That Indigenous peoples inhabited this land for thousands of years before any European colonization began — confirm this is stated as clear, unhedged historical fact, not a caveat.
- The basic pattern of colonial-era voluntary immigration (predominantly from England, with other European populations arriving in smaller numbers) through the early republic period.
- The transatlantic slave trade's basic facts as forced migration to the American colonies/early United States — confirm actual figures (e.g., estimated numbers transported) from a primary/authoritative source, and confirm the terminology used (forced migration, enslavement) is accurate and not softened.

- [ ] **Step 2: Write the section content**

Replace the `#colonial-era` placeholder with real content, following the established content-section pattern with `<p>` tags, a drop-cap `.lede` opening paragraph, `<strong>` emphasis, and `cite-link`/`cite-inline` citations (confirm the exact citation-component class name from `climate-change.html`). Structure:
- Opens by establishing that Indigenous peoples already lived on this land — this must be the section's actual opening content, not a footnote appended after the immigration narrative has already started.
- Covers colonial-era voluntary immigration patterns.
- Gives the transatlantic slave trade its own explicit paragraph, stated plainly as forced migration, distinct from and not blended into the voluntary-immigration narrative surrounding it.

- [ ] **Step 3: Add a quiz for this section**

Add one entry to the `quizzes` object (`q1`) testing a fact from this section (e.g., "who already lived on this land before European colonization began?"). Add the corresponding quiz-trigger button matching `climate-change.html`'s exact button markup/class.

- [ ] **Step 4: Verify**

Run: `open immigration.html`, scroll to this section, confirm it renders correctly with a working drop cap, confirm the Indigenous-peoples framing genuinely appears as opening content (not buried), confirm the slave-trade paragraph reads as its own distinct point, click every citation link to confirm it resolves and genuinely supports its claim, click the quiz button to confirm it functions.

- [ ] **Step 5: Commit**

```bash
git add immigration.html
git commit -m "feat: add Immigration Section 1 — colonial era & early immigration"
```

---

## Task 3: Section 2 — The Great Waves (1840s–1920s)

**Files:**
- Modify: `immigration.html` (the `#great-waves` placeholder section)

**Context:** Covers Irish/German immigration, the Ellis Island era, and Angel Island/Chinese-Asian immigration including the Chinese Exclusion Act. Per this plan's Global Constraints, the exclusion-law content here is settled history — name it accurately (exclusionary, discriminatory) without hedging, and do not apply the party-swap test to it.

- [ ] **Step 1: Verify facts before writing**

Confirm, via primary sources (the National Archives, the Statue of Liberty–Ellis Island Foundation, National Park Service pages for Ellis Island and Angel Island):
- Irish immigration following the 1840s potato famine and German immigration in the same era — confirm approximate real figures and timeframes.
- The Ellis Island era: confirm the actual operating years (design doc flags 1892–1954 — verify independently), approximate total immigrants processed, and its role as the primary entry point for European immigration in this period.
- Angel Island: confirm the actual operating years (design doc flags 1910–1940 — verify independently) and its role as a primary entry/detention point for Asian immigration, particularly Chinese immigrants, on the West Coast.
- The Chinese Exclusion Act of 1882: confirm what it actually did (barred Chinese laborers from immigrating, the first major U.S. law to restrict immigration by nationality/ethnicity), and confirm at least one later Asian-exclusion-related law it's connected to (e.g., subsequent extensions, or the broader pattern of Asian exclusion that continued into the 1920s quota era covered in Task 4) — confirm via a primary source, and confirm the "exclusionary and discriminatory" characterization is how mainstream historical sources (including federal ones) describe it, not a characterization this page is introducing on its own.

- [ ] **Step 2: Write the section content**

Replace the `#great-waves` placeholder. Cover, in this order: Irish/German immigration and its causes; the Ellis Island era and what mass European immigration through it looked like; Angel Island and Chinese/Asian immigration; the Chinese Exclusion Act and the broader pattern of Asian exclusion, stated factually and accurately as discriminatory policy per the Global Constraints' settled-history exception — no hedging language, no "some say this was unfair" framing (state it as fact, cited).

- [ ] **Step 3: Add a quiz for this section**

Add `q2` to `quizzes` testing a fact from this section (e.g., "what was Ellis Island's role, and what was Angel Island's?"). Add the corresponding button.

- [ ] **Step 4: Verify**

Run: `open immigration.html`, scroll to this section, confirm it renders correctly, confirm the Chinese Exclusion Act content reads as stated historical fact rather than hedged or softened, click every citation link, click the quiz button to confirm it functions.

- [ ] **Step 5: Commit**

```bash
git add immigration.html
git commit -m "feat: add Immigration Section 2 — the great waves (1840s-1920s)"
```

---

## Task 4: Section 3 — The Quota Era (1924–1965)

**Files:**
- Modify: `immigration.html` (the `#quota-era` placeholder section)

**Context:** Covers the 1924 Immigration Act's national-origins quota system. This section requires the same settled-history accuracy discipline as Task 3's exclusion-law content — the quota system's explicit design intent (favoring Northern/Western Europe, restricting Southern/Eastern Europe, excluding Asian immigration almost entirely) is documented historical fact, stated plainly with citation, not softened into a vague "immigration was more limited then" framing.

- [ ] **Step 1: Verify facts before writing**

Confirm, via a primary source (the National Archives, the Department of State's Office of the Historian, or a comparable authoritative source):
- What the 1924 Immigration Act (also known as the Johnson-Reed Act) actually did: established numerical quotas by national origin, calculated to favor immigration from Northern and Western Europe and sharply restrict immigration from Southern and Eastern Europe, and effectively excluded immigration from Asia almost entirely.
- Confirm this design intent is documented in the historical record (not this page's own interpretation) — a primary/authoritative source should state the quota formula's actual favoring/restricting effect explicitly, not require this page to infer it.
- Confirm the quota system's actual end date connects cleanly to Task 5's 1965 Act (i.e., confirm the 1924 system remained the basic framework, with amendments, until 1965).

- [ ] **Step 2: Write the section content**

Replace the `#quota-era` placeholder. Explain what the 1924 Act did mechanically (numerical quotas by national origin) and its documented, explicit design intent (favoring/restricting specific origins, near-total Asian exclusion), stated as historical fact with citation. Close the section with a short bridge sentence explicitly setting up Task 5's 1965 Act as "the law that changed this system" — a genuine narrative handoff, not just two adjacent unrelated sections.

- [ ] **Step 3: Add a quiz for this section**

Add `q3` to `quizzes` testing a fact from this section (e.g., "what did the 1924 quota system do?"). Add the corresponding button.

- [ ] **Step 4: Apply the settled-history accuracy check**

Read this section specifically for hedging language that shouldn't be there — per this plan's Global Constraints, "designed to favor X and restrict Y" is accurate historical description, not editorializing, and should not be softened into something vaguer. Confirm no sentence understates the quota system's explicit discriminatory design.

- [ ] **Step 5: Verify**

Run: `open immigration.html`, scroll to this section, confirm it renders correctly, confirm the bridge sentence into Section 4 reads naturally, click every citation link, click the quiz button to confirm it functions.

- [ ] **Step 6: Commit**

```bash
git add immigration.html
git commit -m "feat: add Immigration Section 3 — the quota era (1924-1965)"
```

---

## Task 5: Section 4 — The Modern System Begins (1965)

**Files:**
- Modify: `immigration.html` (the `#modern-system` placeholder section)

**Context:** The hinge point of the historical arc — the Immigration and Nationality Act of 1965 (Hart-Celler Act), which abolished the national-origins quota system and introduced the framework (family reunification, employment-based categories, and others) that today's system is still built on. This section hands off directly into Task 6's "how it works today" content.

- [ ] **Step 1: Verify facts before writing**

Confirm, via a primary source (the National Archives, USCIS's own historical materials, or the Department of State's Office of the Historian):
- The Immigration and Nationality Act of 1965's actual name(s) (confirm "Hart-Celler Act" as the common alternate name) and its signing year/date.
- What it specifically changed: abolished the national-origins quota system from Task 4; introduced a new framework organized around family reunification and employment-based preferences (confirm the actual category structure it established, at a level appropriate for this page's later Task 6 detail).
- Confirm this Act is genuinely the direct ancestor of today's system (i.e., that the family/employment-based category framework it introduced is still recognizably the basis of the system Task 6 will describe) — this is the connective claim that makes the "hinge point" framing accurate rather than just a narrative convenience.

- [ ] **Step 2: Write the section content**

Replace the `#modern-system` placeholder. Explain what the 1965 Act changed and why it matters as the moment "history" hands off to "today's system." Close with a bridge sentence into Task 6 (e.g., explicitly naming that the next section explains how the system this Act created actually works today).

- [ ] **Step 3: Add a quiz for this section**

Add `q4` to `quizzes` testing a fact from this section (e.g., "what did the 1965 Immigration and Nationality Act replace?"). Add the corresponding button.

- [ ] **Step 4: Verify**

Run: `open immigration.html`, scroll to this section, confirm it renders correctly, confirm the section genuinely reads as the arc's hinge point (a callback to Task 4's quota system it replaced, and a forward bridge into Task 6), click every citation link, click the quiz button to confirm it functions.

- [ ] **Step 5: Commit**

```bash
git add immigration.html
git commit -m "feat: add Immigration Section 4 — the modern system begins (1965)"
```

---

## Task 6: Section 5 — How Does Immigration Work Today?

**Files:**
- Modify: `immigration.html` (the `#how-it-works-today` placeholder section)

**Context:** Durable legal-process mechanics: visa categories, the green card process, the citizenship path, asylum vs. refugee status, and a plain structural explainer of what ICE is and does. This ICE explainer is deliberately durable, non-dated content — it exists so Task 7's update-pane can reference "ICE" without re-explaining what it is, keeping the update-pane focused on dated facts rather than backstory.

- [ ] **Step 1: Verify facts before writing**

Confirm, via primary sources (USCIS's own official pages, DHS's official pages):
- Family-based and employment-based visa/green-card categories: confirm the actual current category structure (at a level appropriate for 8th graders — the major categories, not every subcategory) and how each leads toward a green card.
- The naturalization/citizenship path: confirm the actual current requirements (e.g., permanent residency duration, residency/physical-presence requirements, civics/English testing) from USCIS's own official page, not a secondary summary.
- Asylum vs. refugee status: confirm the actual legal distinction (the primary distinction is typically where the person applies from — refugee status is sought from outside the U.S., asylum from within the U.S. or at a port of entry — confirm this precisely from USCIS/DHS rather than approximating it) — this is a legal-definitional point, not a policy debate, and should be written as such.
- ICE: confirm its full name (Immigration and Customs Enforcement), that it was created in 2003 as part of the Department of Homeland Security's formation following the post-9/11 reorganization (confirm this exact history from DHS's own official page), and what its legal authority actually covers (immigration enforcement within U.S. borders, distinct from Customs and Border Protection's border-focused role — confirm this distinction accurately, since conflating the two agencies would be a real factual error, not just an imprecision).

- [ ] **Step 2: Write the section content**

Replace the `#how-it-works-today` placeholder. Cover, in order: visa categories and the green card process; the citizenship/naturalization path; asylum vs. refugee status as a legal distinction; a plain, neutral explainer of what ICE is, when it was created, and what its authority covers — written with the same plain-fact, no-editorializing discipline as the rest of this section, since this explainer sets the neutral baseline Task 7's more contested enforcement content builds on.

- [ ] **Step 3: Add a quiz for this section**

Add `q5` to `quizzes` testing a fact from this section (e.g., "what's the difference between asylum and refugee status?"). Add the corresponding button.

- [ ] **Step 4: Verify**

Run: `open immigration.html`, scroll to this section, confirm it renders correctly, confirm the ICE explainer reads as genuinely neutral (re-read it once specifically checking for any characterization, positive or negative, that isn't a plain statement of legal authority), click every citation link, click the quiz button to confirm it functions.

- [ ] **Step 5: Commit**

```bash
git add immigration.html
git commit -m "feat: add Immigration Section 5 — how immigration works today"
```

---

## Task 7: The Update Pane — "Where Things Stand" (Including the New Differing-Perspectives Component)

**Files:**
- Modify: `immigration.html` (the `#update-pane` section — build its content here; per Task 1's Step 6, its HTML should already sit first in `<main>`, immediately after the hero, matching every other page's pattern of live content leading and durable background following)

**Context: This is the single highest-risk task in this entire plan.** It has two distinct parts held to two different disciplines (per the design doc): Part A (structural status facts — same discipline as every prior page's update-pane) and Part B (enforcement/ICE content, including the new differing-perspectives component for genuinely contested claims). Read `climate-change.html`'s actual `update-pane`/`mini-tl` markup directly before starting (search for `update-pane` and `mini-tl` in that file) to copy the exact structural pattern for Part A; Part B's differing-perspectives component is new and is fully specified in Step 3 below.

- [ ] **Step 1: Verify every Part A fact against a live, current source**

For each of the following, fetch a primary source directly and confirm the specific fact (a live/200 URL is necessary but not sufficient — read what it actually says):
- Current annual legal immigration numbers: green cards issued per year, broken down by major category (family-based, employment-based, etc.) — confirm via USCIS or DHS's own published statistics, with the actual "as of" year clearly noted.
- Visa/green-card backlog: current wait times, confirmed via the U.S. Department of State's Visa Bulletin (the actual primary source for this data) or USCIS's own processing-time reporting — confirm at least one concrete example (e.g., a specific high-demand category/country pairing with a genuinely long wait) with real, current figures, not an approximation.
- Asylum case backlog: current pending caseload in immigration courts, confirmed via the Executive Office for Immigration Review (EOIR, part of the Department of Justice) or a comparable primary source — confirm the actual current figure and its "as of" date.
- Any major recent legal/policy change (a court ruling, legislation, or executive action) genuinely worth including — confirmed via a primary source (the court's own opinion/docket, the text of the legislation, or the executive action itself) and, where helpful for context, corroborated by at least one independent, dated news source. State what happened and who did it (a court/Congress/an administration), not whether it was good or necessary.

- [ ] **Step 2: Build the Part A structure**

Following `climate-change.html`'s exact `update-pane`/`mini-tl` markup pattern, build:
- A header framing this as a dated snapshot (not an open-ended claim — explicitly time-boxed, e.g. "as of [DATE]," matching how prior pages' panes framed themselves).
- A `mini-tl` timeline or fact-block layout (confirm which pattern `climate-change.html` actually uses) presenting the backlog/statistics facts verified in Step 1, each with its own citation and "as of" date.
- Any major recent legal/policy change, stated neutrally per this plan's Global Constraints (what happened, who did it, no verdict).

- [ ] **Step 3: Research Part B — enforcement/ICE content, including which specific claims are genuinely contested**

Fetch primary and reputable sources directly (DHS/ICE's own published enforcement statistics, and — for claims about effects, appropriateness, or impact specifically — named advocacy/research organizations representing different perspectives, e.g. organizations that generally support stricter enforcement and organizations that generally advocate for immigrants' rights, both cited by name and by their own actual published statements, not paraphrased from a secondhand summary):
- Confirm current, dated enforcement statistics (e.g., total enforcement actions, deportation figures, detention facility population) from ICE/DHS's own official reporting — these are Part A-style plain facts (numeric, sourced, not inherently contested) and should be stated plainly with citation, not run through the differing-perspectives component.
- Identify at least 1-2 genuinely contested claims worth covering — i.e., a specific point where named organizations or sources on different sides actually characterize the same underlying facts differently (for example: whether a specific enforcement approach or policy change has been effective, appropriate, or has caused a specific documented effect on communities). For each one, find and confirm a real, named, verifiable source articulating each side's actual position — do not paraphrase a side's position from memory or from the other side's characterization of it; go to that side's own stated position directly.
- If, after genuine research, you cannot find two real, well-sourced, clearly-articulated differing positions on a specific claim, do not force a differing-perspectives block — either state the claim plainly (if it turns out to be less contested than assumed) or omit that specific claim from this page entirely rather than manufacturing a false balance between a well-sourced position and a weakly-sourced one.

- [ ] **Step 4: Build the differing-perspectives CSS component**

This component doesn't exist yet anywhere on the site — build it now, scoped to this page only (per this plan's Global Constraints, do not add it as a shared/global component). Add CSS within `immigration.html`'s own `<style>` block:

```css
.perspectives{
  display:grid;grid-template-columns:1fr 1fr;gap:0;
  border:1px solid var(--rule);border-radius:4px;overflow:hidden;
  margin:20px 0;
}
.perspective{padding:18px 20px}
.perspective + .perspective{border-left:1px solid var(--rule)}
.perspective-label{
  font-family:-apple-system,sans-serif;font-size:.72rem;font-weight:800;
  letter-spacing:.08em;text-transform:uppercase;color:var(--ink-faint);
  margin-bottom:8px;
}
.perspective p{font-family:'Source Serif 4',Georgia,serif;font-size:.95rem;
  color:var(--ink-light);line-height:1.65;margin-bottom:8px}
.perspective p:last-of-type{margin-bottom:0}
.perspective .cite-inline{font-size:.8rem}
@media(max-width:600px){
  .perspectives{grid-template-columns:1fr}
  .perspective + .perspective{border-left:none;border-top:1px solid var(--rule)}
}
```

Confirm the exact token names (`--rule`, `--ink-faint`, `--ink-light`) against what's actually defined in this page's `:root` block from Task 1 — adjust if the real token names differ from this sketch. The two `.perspective` children must be visually identical in padding, font size, and treatment — neither side gets a background color, border weight, or type size the other doesn't, since any visual asymmetry here would undercut the equal-weight requirement as much as unequal word count would.

Markup pattern for each contested claim, matching the CSS above:
```html
<div class="perspectives">
  <div class="perspective">
    <div class="perspective-label">[Named position/group]</div>
    <p>[Specific claim, in their own terms]<cite-link><a href="..." target="_blank">[Source name]</a></cite-link></p>
  </div>
  <div class="perspective">
    <div class="perspective-label">[Named position/group]</div>
    <p>[Specific counter-claim, in their own terms]<cite-link><a href="..." target="_blank">[Source name]</a></cite-link></p>
  </div>
</div>
```

(Confirm `cite-link`'s exact tag/class name against `climate-change.html`'s real markup — this plan uses the name established in earlier site pages, but confirm it matches this page's own Task 1 port before using it here.)

- [ ] **Step 5: Build the Part B content**

Add plain enforcement statistics (Step 3's non-contested figures) using the same visual pattern as Part A. For each genuinely contested claim identified in Step 3, add a `.perspectives` block using the exact markup from Step 4, with real, verified, named sources on both sides.

- [ ] **Step 6: Apply the nonpartisanship test to every single sentence in this section — do not skip this**

Read the entire update-pane sentence by sentence, both Part A and Part B. For Part A and the plain-fact portion of Part B: would this read the same regardless of which party or administration is associated with it? For each `.perspectives` block specifically: confirm both sides have genuinely equal specificity and length (a rough word-count check is a reasonable proxy — if one side is meaningfully longer or more detailed than the other, that's a real finding to fix, not a stylistic quirk to leave alone); confirm neither side's framing was written by paraphrasing the *other* side's characterization of it (a common way "balance" quietly becomes unbalanced); confirm no sentence outside a `.perspectives` block sneaks in an unattributed characterization of a contested claim (i.e., confirm Part B's plain-fact statements are genuinely uncontested, not contested claims wearing plain-fact framing).

- [ ] **Step 7: Add a quiz for this section**

Add `q6` to `quizzes` testing a plain fact from this pane (e.g., a specific backlog or enforcement statistic — not a contested claim, since a quiz needs a single correct answer and a contested claim by definition doesn't have one). Add the corresponding button.

- [ ] **Step 8: Verify**

Run: `open immigration.html`, scroll to the update-pane, confirm it renders with the same visual quality as the other pages' update-panes, confirm every `.perspectives` block renders with genuinely equal-width, equal-treatment columns (check at both desktop and the `max-width:600px` mobile breakpoint, where columns stack), click every citation link on both sides of every `.perspectives` block, click the quiz button, and re-read the entire section one more time specifically for nonpartisanship (a second, independent pass, after Step 6's first pass).

- [ ] **Step 9: Commit**

```bash
git add immigration.html
git commit -m "feat: add Immigration update-pane, including new differing-perspectives component"
```

---

## Task 8: Washington's Immigration Story (Dedicated Local Section)

**Files:**
- Modify: `immigration.html` (the `#washington-immigration` placeholder section)

**Context:** Scoped to history and community, not state policy, per the approved design doc — deliberately the lower-risk of this plan's two dedicated-nonpartisanship-pass tasks (Task 7 is the higher-risk one). Still gets its own pass because it touches a genuinely sensitive historical topic (Japanese American incarceration) that requires the same settled-history accuracy discipline as Tasks 3 and 4, and because the design doc is explicit that state-level immigration *policy* is out of scope here — a real temptation this task's own research could wander into if not actively guarded against.

- [ ] **Step 1: Research Scandinavian immigration and settlement in Puget Sound**

Fetch a primary/authoritative source (a Washington State historical society, HistoryLink.org — Washington's own state history nonprofit resource — or a comparable authoritative regional-history source) to confirm:
- The actual scale and timeframe of Scandinavian immigration to the Puget Sound region (confirm real figures/dates, not an approximation).
- What drew Scandinavian immigrants specifically to this region (commonly cited factors include fishing, logging, and other regional industries — confirm this from a real source rather than assuming).

- [ ] **Step 2: Research Japanese American history in Washington, including WWII incarceration**

Fetch a primary/authoritative source (the National Archives, Densho — a Seattle-based nonprofit specifically dedicated to preserving Japanese American incarceration history, a strong candidate primary source for this specific claim — or the National Park Service) to confirm:
- The Japanese American community's presence and history in Washington State before World War II.
- Executive Order 9066 (1942) and its actual effect: the forced removal and incarceration of Japanese Americans, including U.S. citizens, in incarceration camps — confirm real, specific facts about Washington's own Japanese American community's experience (e.g., a specific camp Washington residents were sent to, such as Minidoka — confirm this specifically rather than describing the incarceration only in generic national terms) from a primary/authoritative source.
- Apply the same settled-history accuracy discipline as Tasks 3–4: this is documented historical fact, state it plainly and accurately (forced removal, incarceration, including of U.S. citizens) without hedging.

- [ ] **Step 3: Research refugee resettlement history in the Seattle area**

Fetch a primary/authoritative source (a Washington State or Seattle-area refugee resettlement organization's own historical materials, or a reputable regional-history source) to confirm:
- At least one specific, well-documented refugee resettlement wave in the Seattle area's history (candidates worth researching include Southeast Asian refugee resettlement following the Vietnam War, or other documented waves — confirm a real, specific, well-sourced example rather than a vague "Seattle has welcomed refugees" generalization).
- Confirm this content stays scoped to history/community (what happened, who arrived, when) and does not drift into current state refugee/immigration *policy* — if the research surfaces current policy material, exclude it per this plan's Global Constraints.

- [ ] **Step 4: Build the section**

Following the established content-section pattern with `cite-inline`/`cite-link` citations, build "Washington's Immigration Story" covering, in order: (1) Scandinavian immigration and Puget Sound settlement, (2) Japanese American history in Washington including WWII incarceration, (3) refugee resettlement history in the Seattle area. Keep each sub-topic squarely in historical/community territory — no state-policy content, per Step 3's explicit scope guard.

- [ ] **Step 5: Apply the settled-history and scope check to this section**

Read the entire section sentence by sentence. For the Japanese American incarceration content specifically: confirm it's stated plainly and accurately as forced removal and incarceration (settled history, no hedging needed). For the section as a whole: confirm nothing has drifted into current state immigration policy (a genuine risk this section's own research could introduce, since "how has Washington's relationship with immigrant communities evolved" naturally invites drifting toward current policy if not actively checked against the design doc's explicit scope boundary).

- [ ] **Step 6: Add a quiz for this section**

Add `q7` to `quizzes` testing a fact from this section (e.g., "what happened to Japanese Americans in Washington during World War II?"). Add the corresponding button.

- [ ] **Step 7: Verify**

Run: `open immigration.html`, scroll to this section, confirm it renders correctly, click every citation link to confirm each resolves and genuinely supports its claim, click the quiz button to confirm it functions. Re-read the section one more time specifically checking for any state-policy content that snuck in (a second pass, separate from Step 5's first pass).

- [ ] **Step 8: Commit**

```bash
git add immigration.html
git commit -m "feat: add Washington's Immigration Story section"
```

---

## Task 9: History Timeline, Key People, Videos, Resources

**Files:**
- Modify: `immigration.html` (the `#timeline`, `#key-people`, `#videos`, `#resources` placeholder sections)

**Context:** Four smaller sections bundled into one task since each is a straightforward instantiation of an existing, well-understood component pattern. Key People carries real risk (the hard historical-figures-only rule) but not the deep contested-claims research burden of Tasks 7–8.

- [ ] **Step 1: Verify History Timeline facts**

Pull entries from Sections 1–4's already-verified content (Tasks 2–5) — do not re-research from scratch; reuse the dates/facts already confirmed in those tasks. Candidate timeline entries, all already touched on in Tasks 2–5: colonial-era immigration begins; a specific date/figure from the 1840s Irish/German wave; Ellis Island opens (confirm exact year from Task 3); the Chinese Exclusion Act, 1882; Angel Island opens (confirm exact year from Task 3); the 1924 Immigration Act; the 1965 Immigration and Nationality Act. Confirm each entry's date against what was already verified in its originating task rather than re-deriving it independently (a mismatch between the timeline's date and the section's own stated date would be a real, avoidable defect).

- [ ] **Step 2: Build the History Timeline**

Following `climate-change.html`'s `.tl-item` pattern (confirm the exact class name from that file) exactly, add each entry with its citation (reusing the citation already established in its originating task where possible, rather than re-sourcing).

- [ ] **Step 3: Research and select 2 Key People (historical figures only)**

Per the design doc's confirmed scoping: one historically significant immigrant whose personal story illustrates one of the waves/eras from Tasks 2–4 (research and confirm a specific, well-documented figure — a strong starting point is someone connected to the Ellis Island or Angel Island era from Task 3, given how well-documented individual immigrant stories from that period tend to be, but confirm a specific real figure via a primary/authoritative source rather than assuming one), and one policy figure tied to the 1965 Immigration and Nationality Act (research and confirm a specific figure genuinely central to that law — e.g., a sponsoring legislator or a documented key advocate — via a primary/authoritative source; do not guess a name from general familiarity with the era). Do NOT include any currently-active public figure in either role, and do NOT include any current sitting official under any circumstance — this is this site's established hard rule.

- [ ] **Step 4: Build the Key People section**

Following `climate-change.html`'s `.person-card` pattern (confirm exact class name), add each figure with a real photo (verify licensing directly on the image's own Wikimedia Commons file page — public domain/CC, correct subject match — per this project's established image-sourcing discipline). If no verifiable portrait exists for a candidate figure, either find a different, verifiable figure or use this project's established honest-disclosure fallback pattern (a `.person-emoji-fallback` div plus a stated "we could not find a real photo of them that we were allowed to use" disclosure, matching the precedent set on `iran.html`).

- [ ] **Step 5: Build Videos and Resources sections**

Source genuinely nonpartisan, reputable educational videos/resources (e.g., National Archives educational content, PBS/NPR historical documentaries or explainers, USCIS's own educational materials, the Migration Policy Institute's research summaries) — verify each source directly before including it, and specifically check that any video/resource is nonpartisan in its own framing, not just that its host organization has a neutral-sounding name. Given this page's subject matter, apply extra scrutiny here: a video/article can be produced by a reputable-sounding organization while still advocating a specific position on current immigration policy — watch/read enough of each candidate to confirm its actual framing, not just its source's general reputation.

**Add a curated "Keep up with immigration policy news" subsection to Resources**, matching the US Elections/Climate pages' equivalent curated-dated-links pattern. A short (3-5 item, fewer is fine if that's all that's genuinely verified), explicitly dated list of recent, nonpartisan articles/videos covering current immigration policy, each cited with its actual publication date. Follow the exact same sourcing discipline as Task 7: fetch each candidate item directly, confirm it's genuinely nonpartisan in its own framing (not just source reputation), confirm it's still live and non-paywalled at write time. Label this subsection with a visible "as of [DATE]" marker, flagged as a future refresh candidate the same way the update-pane and this same subsection on other pages are.

- [ ] **Step 6: Verify all four sections**

Run: `open immigration.html`, scroll through all four sections, click every citation/resource link (including every item in the "Keep up with immigration policy news" subsection), confirm images load correctly and match their captions (or the honest-disclosure fallback displays correctly if no image was found), confirm any new quiz buttons function, confirm the curated-links subsection shows a visible "as of [DATE]" marker.

- [ ] **Step 7: Commit**

```bash
git add immigration.html [any new image files]
git commit -m "feat: add Immigration history timeline, key people, videos, resources"
```

---

## Task 10: Source Images for Every Section

**Files:**
- Modify: `immigration.html` (add `<img>` elements into each of Sections 1–5, the update-pane, Washington's Immigration Story, and History Timeline — every section that doesn't already have a real photo from Task 9's Key People portraits)
- Add: new image files under `images/` (or confirm the site's actual image directory convention — check where `climate-change.html`'s images live before assuming a path)

**Context:** By the end of Task 9, this page is entirely (or almost entirely) prose plus two Key People portraits — a genuinely text-heavy page given its length (7 content sections plus the update-pane and local section). This task adds at least one real, verified image to every content section, more than one where a natural fit exists (e.g., a distinct image for each of the "great waves" — Ellis Island AND Angel Island — rather than just one for the whole section). This task runs after all content is finalized (Tasks 2–9) so each image can be matched to the actual finished prose, sourced and captioned precisely, rather than guessed at before the section's final wording exists. It runs before Task 11's verification pass so that pass can also check these images (broken references, licensing, caption accuracy) as part of its normal sweep.

- [ ] **Step 1: Inventory which sections need images**

Read the full `immigration.html` file as it stands after Task 9. List every content section that does NOT yet contain a real photo: almost certainly Section 1 (Colonial Era), Section 2 (The Great Waves — likely wants two: Ellis Island and Angel Island), Section 3 (The Quota Era), Section 4 (The Modern System Begins/1965 Act), Section 5 (How Immigration Works Today), the update-pane, Washington's Immigration Story (likely wants two or three: Scandinavian settlement, Japanese American incarceration, refugee resettlement), and the History Timeline (per this site's established `.tl-img`-style pattern on other pages' timelines, if `climate-change.html`/`ukraine.html` use one — confirm the exact pattern name). Key People (Task 9) already has portraits and does not need additional sourcing here.

- [ ] **Step 2: Source and verify one image per section (minimum), more where natural**

For each section identified in Step 1, search Wikimedia Commons for a historically accurate, subject-matched image. Per this project's established, non-negotiable image discipline: verify BOTH the license (public domain or CC-licensed) AND the subject match directly on the image's own Wikimedia Commons file page — not from an embedding Wikipedia article, not from a general web image search. Candidate subjects (research and confirm real, existing, correctly-licensed files — do not assume any of these exist without checking):
- Section 1: a period-appropriate image of colonial-era arrival or Jamestown/Plymouth settlement (or, if a suitable one isn't found, an image related to the section's other content).
- Section 2: a real photo of Ellis Island's Great Hall or immigrants arriving there (this era is extremely well-documented photographically, so a real, well-known, correctly-licensed photo should exist), and separately a real photo of Angel Island's immigration station or detention barracks.
- Section 3: a period photo or the actual text/document image of the 1924 Immigration Act, or a relevant photo from that era (e.g., an immigration inspection station from the 1920s).
- Section 4: a photo from the 1965 Immigration and Nationality Act's signing (President Johnson signed this at the Statue of Liberty — a specific, well-documented, likely-photographed event; verify a real Commons file exists before assuming).
- Section 5: a contemporary, generic, non-political image illustrating a legal process step (e.g., a naturalization ceremony — these are commonly and neutrally photographed public events) — confirm the specific photo isn't tied to any identifiable current political figure or moment.
- Update-pane: if a suitable neutral image exists (e.g., a stock-style photo of an immigration court or a U.S. port of entry) — this is optional, given the update-pane's already dense factual content; do not force an image here if nothing suitably neutral and well-sourced turns up.
- Washington's Immigration Story: images tied to each sub-topic from Task 8 (a Puget Sound Scandinavian-community photo, a Minidoka incarceration camp photo — Densho and the National Archives both hold extensive verified photo archives for this specific subject, a strong place to start — and a Seattle-area refugee resettlement photo).
- History Timeline: per this site's established pattern, confirm whether timeline entries typically carry small inline images (`climate-change.html`/`ukraine.html`) and, if so, add at least 2-3 across the timeline's entries, prioritizing entries that don't already have a photo elsewhere on the page.

If no verifiably-licensed, subject-matched image can be found for a given slot after genuine search, use this project's established honest fallback (an emoji/gradient placeholder with a brief note, matching the precedent already set on `iran.html`, rather than a forced or unverified image) — do not stretch a loosely-related or unverified image into a slot just to satisfy "at least one image per section."

- [ ] **Step 3: Download and add each verified image**

Download each verified image into the site's established image directory (confirm the exact path convention from `climate-change.html` or another recently-built page rather than assuming `images/`). Use descriptive, kebab-case filenames consistent with this site's existing image-naming convention (check a few existing filenames in the images directory for the pattern). Respect this project's known Wikimedia rate-limiting behavior — space out sequential downloads (25–90 second delays between requests) rather than firing them in rapid succession, which has caused 429 errors on prior builds.

- [ ] **Step 4: Insert each image into its section with a proper caption and citation**

Following this page's established visual patterns (check for a `.photo-break`-equivalent full-width image style and/or the smaller inline/`.tl-img`-equivalent style already used elsewhere on the site — confirm the exact class names from `climate-change.html`/`ukraine.html` rather than inventing new markup) — for each image, add: the `<img>` with a real, descriptive `alt` attribute (not just the filename), a visible caption stating what the image shows and its source/license (e.g., "Ellis Island's Great Hall, c. 1920s. Photo: [photographer/collection if known], public domain / Wikimedia Commons"), and an `onerror` fallback matching this site's established pattern for a broken/missing image.

- [ ] **Step 5: Verify**

Run: `open immigration.html`, scroll through the entire page, confirm every new image loads (not a broken-image icon), confirm each image's caption accurately describes what's actually shown (a real risk if an image was sourced hastily — re-look at each image itself, not just its Commons page description, to confirm the caption matches what's visually in the photo), confirm no image's caption or alt text drifts into editorializing about the historical event depicted (a neutral, descriptive caption only — e.g., state what's shown and when, not an interpretation of it). Re-confirm every image's Commons file page license directly (not from memory of Step 2's research) one more time before finalizing.

- [ ] **Step 6: Commit**

```bash
git add immigration.html images/
git commit -m "feat: source and add images for every Immigration page section"
```

---

## Task 11: Full-Page Verification Pass (Including Dedicated Nonpartisanship Pass)

**Files:** None modified unless this step surfaces a real problem — verification only, except for the `MAX_PTS` fix flagged in Task 1.

- [ ] **Step 1: Fix the `MAX_PTS` placeholder from Task 1**

Count the actual number of quiz entries added across Tasks 2–9 (this plan anticipates `q1` through `q7`, but confirm the real count directly from the file rather than trusting this plan's arithmetic). Update `const MAX_PTS = 0;` to the real count. Confirm the points-bar UI correctly reflects this new max.

- [ ] **Step 2: Confirm no leftover placeholder content remains**

Run: `grep -n "\[Content added in Task\|TODO\|TBD\|placeholder" immigration.html`
Expected: no matches (aside from the `MAX_PTS` comment already resolved in Step 1 — confirm that one specifically is gone too).

- [ ] **Step 3: Dedicated nonpartisanship read-through — the most important step in this task**

Read the ENTIRE page start to finish, in one continuous pass, specifically hunting for any sentence that could read as taking a political position. This must be a genuinely fresh, independent read — not a rubber-stamp of Tasks 4, 7, and 8's own dedicated passes. For every sentence touching current or recent policy (concentrated in Task 7, but check the whole page): would this read the same regardless of which party or administration is associated with it? For Task 7's `.perspectives` blocks specifically: re-confirm equal specificity and length on both sides, re-confirm neither side was written by paraphrasing the other's characterization, re-confirm every non-`.perspectives` sentence in Part B is genuinely a plain, uncontested fact and not a contested claim stated as if it weren't. For Tasks 3, 4, and 8's settled-history content (exclusion laws, the quota system, Japanese American incarceration): confirm accuracy without hedging — verify nothing was *over*-softened in an overcorrection, which is as real a failure mode here as under-softening a genuinely contested claim.

- [ ] **Step 4: Confirm Key People stays scoped correctly**

Run: `grep -n "person-card" immigration.html` and manually confirm both entries are historical figures, not current sitting officials or currently-active public figures — re-confirm this explicitly even though Task 9 already scoped it this way.

- [ ] **Step 5: Confirm the differing-perspectives component didn't leak outside Task 7**

Run: `grep -n "perspectives\|perspective-label" immigration.html` and confirm every match is inside Task 7's update-pane section only. Per this plan's Global Constraints, this component must not appear anywhere else on the page.

- [ ] **Step 6: Re-verify all citation links resolve**

Extract and check every `https://` URL in the file:

```bash
grep -oE 'href="https://[^"]+"' immigration.html | sed -E 's/^[^:]+:href="//;s/"$//' | sort -u > /tmp/immigration-links.txt
wc -l /tmp/immigration-links.txt
while read -r url; do
  code=$(curl -s -o /dev/null -w "%{http_code}" -A "Mozilla/5.0" -L --max-time 10 "$url")
  echo "$code $url"
done < /tmp/immigration-links.txt | sort -n
```

For anything that returns non-200 (especially 403), don't conclude it's dead — this project's established pattern is that some legitimate sites (government domains, some news sites) bot-block curl but work fine for real readers. Cross-check any non-200 result with a direct fetch tool before concluding anything is actually broken.

- [ ] **Step 7: Confirm every quiz functions and covers a fact still present on the page**

In the browser, click every quiz button added across Tasks 2–9. Confirm each question/answer displays correctly and references a fact that's still accurately stated on the page.

- [ ] **Step 8: Confirm reading level**

Spot-check several sections against the stated 5th–6th grade target. Flag (don't necessarily rewrite everything, use judgment) any section that reads notably harder than the rest — the update-pane's Part A/Part B content may run slightly higher given factual density, which is an acceptable, expected trade-off per this plan's Global Constraints, not a defect to force-fix.

- [ ] **Step 9: Confirm zero structural/CSS drift from the established site pattern**

Compare `immigration.html`'s CSS class names and JS function signatures against `climate-change.html`'s — confirm this new page reuses the SAME class names for shared components rather than inventing parallel-but-different names, which would fragment the site's component system. The one deliberate, approved exception is the new `.perspectives`/`.perspective`/`.perspective-label` component from Task 7, which is new by design — confirm it's the *only* new component type introduced.

- [ ] **Step 10: Confirm mobile-width text does not clip, including the new perspectives component**

Confirm `min-width:0` was applied consistently to every flex child pairing a fixed-size element with text, per Task 1's note. Additionally, specifically check the `.perspectives` component at a sub-600px viewport width — confirm Task 7's Step 4 media query correctly stacks the two `.perspective` columns vertically rather than squeezing them side-by-side illegibly. If the local testing environment cannot reliably render below ~500px CSS viewport width, do a careful code-level check of the media query rather than relying solely on a screenshot, and note in this task's completion report if a live device check is still needed.

- [ ] **Step 11: Final commit if any fixes were needed**

```bash
git add immigration.html
git commit -m "fix: address verification-pass findings in Immigration page build"
```

If no fixes were needed beyond Step 1's `MAX_PTS` update, note that explicitly rather than leaving it ambiguous whether this step ran.

---

## Task 12: Wire the New Page into the Site

**Files:**
- Modify: `index.html`
- Modify: `iran.html`, `ukraine.html`, `climate-change.html`, `ai.html`, `us-elections.html` (add a sibling-nav link to Immigration on each)

**Context:** This task runs LAST, only after Task 11's full verification pass is complete and clean — so the site's actual front page and every existing page's nav are never pointed at unfinished or unreviewed content, matching the exact ordering discipline every prior page build on this site has used.

- [ ] **Step 1: Read the existing Immigration "Coming Soon" entry and a live entry directly**

Read `index.html`'s current Immigration entry (search for "Immigration" — confirm its current markup, whether it's a `topic-card coming-soon` pattern or the denser small-item-rail pattern the current homepage uses for its "Coming Soon" tier, per this site's now-current NYT-hierarchy homepage layout established in the v2.0.0 redesign) AND at least one live tier-two card for comparison (search for `tier-card` — confirm the exact live-card structure: `<a href="...">`, `tier-photo`/`img`, `tier-kicker`, `<h3>`, `<p>`, `tier-meta`). Do not reconstruct either pattern from memory — read the real, current markup, since the homepage's structure changed materially during this site's v2.0.0–v2.4.0 redesign and may not match older plans' descriptions of a `topic-card`/`coming-soon` pattern.

- [ ] **Step 2: Convert the Immigration entry from "Coming Soon" to a live tier-card**

Remove Immigration's existing small-item-rail "Coming Soon" entry and add a new `<a href="immigration.html" class="tier-card">` entry to the homepage's tier-two grid, following the exact structural pattern of a live card (e.g., the Climate Change or US Elections tier-card added during the redesign): a `tier-photo` with a real, verified Wikimedia Commons image if one is sourced during this task (checking licensing directly on the Commons file page, same discipline as every other image on this site) with an `onerror` gradient fallback, a `tier-kicker` line, an `<h3>` matching the page's actual title ("A Nation of Immigrants"), a short card-length description paragraph (not copy-pasted from any longer section), and a `tier-meta` showing reading time and "Updated [actual date]".

- [ ] **Step 3: Update the homepage's section-nav**

Add a nav link for Immigration to the homepage's sticky section-nav (search for the nav pattern used by the other five topic links), following the existing pattern's exact formatting. Confirm every existing nav link (Iran, Ukraine, Climate, AI, US Elections) is untouched.

- [ ] **Step 4: Add sibling-nav links on every other page**

On each of `iran.html`, `ukraine.html`, `climate-change.html`, `ai.html`, `us-elections.html`: add a link to `immigration.html` in that page's own sticky nav, alongside the existing sibling-topic links, per this site's established cross-page-navigation convention (every topic page links to every other live topic page, not just back to the homepage).

- [ ] **Step 5: Verify**

Run: `open index.html`. Confirm: the Immigration card renders correctly as a live card, matches the other live tier-two cards' visual weight exactly, its link resolves to `immigration.html` correctly; the homepage's nav's new link resolves; nothing else on the page was accidentally altered. Then open each of the five other topic pages and confirm each one's sticky nav now includes a working link to `immigration.html`, and that no existing sibling link on any of those pages was broken in the process.

- [ ] **Step 6: Commit**

```bash
git add index.html iran.html ukraine.html climate-change.html ai.html us-elections.html
git commit -m "feat: wire Immigration page into the site (homepage card, cross-page nav)"
```

---

## Self-Review Notes

- **Spec coverage:** All design doc sections (page structure items 1–10, the update-pane's Part A/Part B split, the nonpartisanship discipline including the new differing-perspectives component, Washington's Immigration Story, Key People, sourcing standards, reading level, out-of-scope list) map to Tasks 1–12 in this plan. The design doc's explicit scope guard against state-level immigration policy is carried into both Task 8 (Washington section) and the Global Constraints so every task inherits it, not just Task 8. The differing-perspectives component is fully specified (CSS, markup pattern, and scope constraint) in Task 7 rather than left as a vague "figure it out at implementation time" — Task 11 Step 5 verifies it didn't leak beyond its intended scope. Task 10 (image sourcing) was added after initial plan review, per explicit direction that a page this long needs real visual variety per section, not just Key People portraits — inserted after content is finalized (Task 9) so images can be matched to actual finished prose, and before verification (Task 11) so the verification pass also covers image licensing/captions/broken-reference checks.
- **Placeholder scan:** Task 1's two intentional placeholders (`MAX_PTS = 0` and the `[Content added in Task N]` section stubs) are both explicitly flagged with a specific resolution step in a later task (Task 11 Step 1, and Tasks 2–9's content-writing steps respectively) — neither is a silent gap. No other placeholders appear in this plan; every research step names specific candidate facts/figures/organizations to verify rather than leaving anything as "TBD," and every deliberately-deferred decision (exact Key People names, exact accent color, whether to source a real image for the Immigration homepage card, exact contested claims to cover in Task 7's differing-perspectives blocks, and the exact image subjects/sources for Task 10) is explicitly flagged as "confirm/decide/research at implementation time" rather than silently assumed.
- **Type consistency:** N/A (no code interfaces — HTML/CSS/JS content only, no typed signatures). Class/ID names are specified throughout as "confirm the exact name against `climate-change.html`'s real markup" rather than asserted from memory, since this plan's author has not read every line of `climate-change.html` firsthand and some exact naming (e.g., whether content sections use `s-card` or a different class name on the more recently rebuilt pages) may have drifted from the Climate plan's own naming — Task 1 Step 1 requires reading the real file before locking in any class names, and every subsequent task that references a shared class name flags it as "confirm the exact name" rather than treating this plan's guesses as ground truth. Quiz IDs are pre-assigned sequentially per task (`q1` Task 2 through `q7` Task 9) to avoid quiz-ID collisions; if task order changes during implementation, whoever makes that change is responsible for re-checking quiz-ID uniqueness directly against the live `quizzes` object.

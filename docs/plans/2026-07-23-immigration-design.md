# Immigration & U.S. Policy — Design Document

**Date:** July 23, 2026
**Type:** New page (from scratch — no existing content)
**Files:** `immigration.html` (new), `index.html` (add topic card + nav link + sibling-nav links on other pages)

---

## Concept

A new topic page, built directly in the site's now-locked editorial design system (see the design-tokens/component reference used by `iran.html`, `ukraine.html`, `climate-change.html`, `ai.html`, `us-elections.html`) — masthead, sticky section-nav, full-bleed hero, drop-cap lede sections, `.stat-pair`/`.stat-trio`, `.pull-quote`, `.cite-inline` citations, dark `.focus-pane`/`.update-pane` deep-dives, history timeline, Key People, quizzes/points/easter-egg JS engine, videos, resources.

**Title:** "A Nation of Immigrants" — leads with the history-first framing rather than a policy-debate framing.

**Core angle, confirmed with the project owner:** history-first. The page's throughline is the long American story of immigration — colonial era through today's system — with today's legal mechanics and current policy landscape presented as the *product* of that history, not the starting point. This gives the page a genuinely settled, low-risk narrative spine (history) before it has to touch anything currently contested (enforcement policy), the same way Climate led with geology before its Washington policy section.

**This is the highest nonpartisanship-risk page on the site to date** — higher than US Elections. Elections' risk was concentrated in "who currently holds power" facts; this page's risk is concentrated in describing *active, ongoing immigration enforcement* (ICE operations, detention, deportations, policy shifts), which is more directly and personally contested than midterm mechanics. See the dedicated **Nonpartisanship Discipline** section below — it introduces one genuinely new component (side-by-side differing perspectives) beyond this site's existing "state facts, attribute characterizations" rule.

---

## Page Structure

1. **Section 1 — Colonial Era & Early Immigration.** Establishes, honestly and explicitly, that Indigenous peoples already lived on this land before any immigration began — this framing must appear before any "nation of immigrants" narrative proceeds, not as an afterthought. Covers colonial-era voluntary immigration (largely from England and other parts of Europe) through the early republic. Names the transatlantic slave trade as its own explicit, clearly-labeled point — stated plainly as forced migration, not voluntary immigration, and not folded into the "waves of immigration" framing the rest of the section uses. Gets its own paragraph, not a passing clause, so it isn't minimized by the surrounding narrative's momentum.
2. **Section 2 — The Great Waves (1840s–1920s).** Irish and German immigration following the 1840s famine/political upheaval; the Ellis Island era (1892–1954) and the mass European immigration it processed; Angel Island (1910–1940) and Chinese/Asian immigration, including the Chinese Exclusion Act (1882) and later Asian exclusion laws — named factually as exclusionary and discriminatory (this is settled historical fact, not a contested characterization; every major historical source, including federal ones like the National Archives, describes it this way).
3. **Section 3 — The Quota Era (1924–1965).** The 1924 Immigration Act's national-origins quota system — what it did (capped immigration by country of origin, explicitly designed to favor Northern/Western Europe and restrict Southern/Eastern Europe, and to exclude Asian immigration almost entirely), stated as documented historical fact with citation, not editorialized. Sets up Section 4 as the resolution.
4. **Section 4 — The Modern System Begins (1965).** The Immigration and Nationality Act of 1965 (Hart-Celler Act): what it changed (abolished the national-origins quota system, introduced the framework — family reunification, employment-based, and other categories — that today's system is still built on). This is the hinge point of the whole historical arc — where "history" hands off to "how it works today."
5. **Section 5 — How Does Immigration Work Today?** Durable legal-process mechanics: family-based and employment-based visa categories, the green card process, the naturalization/citizenship path (including requirements), asylum vs. refugee status (the legal distinction, not a policy debate), and a plain, structural explainer of what ICE (Immigration and Customs Enforcement) is, when it was created (2003, as part of the Department of Homeland Security's formation post-9/11), and what its legal authority covers. This ICE explainer is deliberately placed here as durable, non-dated content — explains the *role* neutrally so the update-pane doesn't have to re-explain it while also trying to cover live, dated facts.
6. **Update-pane — "Where Things Stand."** The page's live/dated current-events hook (see dedicated section below).
7. **Washington's Immigration Story** (dedicated local section, playing the same role as Climate's "Washington's Climate Story" and Elections' district section). Historical immigrant communities and waves specific to Washington/Puget Sound (see dedicated section below).
8. **History Timeline.** Full arc pulling from Sections 1–4, in the standard `.tl-item` pattern.
9. **Key People.** Two profiles (see dedicated section below).
10. **Videos, Resources.** Standard pattern: 2 videos, a resources grid of nonpartisan/reputable sources, and a dated "Keep up with immigration policy news" curated-links subsection mirroring Elections' and Climate's equivalent subsections.

---

## The Update Pane: "Where Things Stand"

Reuses the `update-pane`/`mini-tl` markup already established across the site. Two distinct content types inside it, held to two different disciplines:

**Part A — Structural status facts** (same discipline as every prior page's update-pane: state facts, cite sources, no verdict):
- Current annual legal immigration numbers (green cards issued per year, by major category)
- Visa/green-card backlog: current wait times by category and country of origin (these vary enormously — e.g. family-based categories from high-demand countries can run into decades-long backlogs — stated factually with source and date)
- Asylum case backlog: current pending caseload in immigration courts, stated factually with source and date
- Any major recent legal/policy changes (court rulings, legislation, executive actions) stated neutrally: "a federal court ruled X," "Congress passed Y," "the administration announced Z" — describing what happened and who did it, not whether it was good or necessary

**Part B — Enforcement/ICE content** (the genuinely new discipline — see Nonpartisanship section below for the full pattern spec): dated, factual coverage of current immigration enforcement activity — e.g. enforcement numbers, detention facility capacity/conditions, deportation figures, notable documented incidents, workplace/community enforcement operations. For any claim that is *contested* (i.e., where reasonable people/named sources genuinely characterize the same facts differently — such as whether enforcement levels are appropriate, whether specific operations were justified, or the effects on communities), use the **side-by-side differing-perspectives component**. For claims that are not contested (e.g. a specific numeric enforcement statistic from a federal data source), state them plainly like Part A.

---

## Nonpartisanship Discipline

This page carries forward the site's established practice (state facts, attribute characterizations to a named source, no verdict — used on `us-elections.html` and `climate-change.html`'s Washington policy section) as the **default** discipline for the entire page. Section 1–5 (history and mechanics) and the Washington local section should need nothing beyond this default — they're settled historical/legal fact.

**One new component, scoped tightly:** a side-by-side "differing perspectives" pattern, used **only** within the update-pane's enforcement content (Part B above), for claims that are genuinely contested rather than settled. This is a deliberate scope decision, confirmed with the project owner — not a new site-wide or even page-wide component. Format: for a specific contested claim, present two (or more, if genuinely relevant) named viewpoints side by side, each with its own citation — e.g. "Some immigration enforcement officials and supporters of stricter policy argue [specific claim], citing [named source]. Immigrant-rights advocates and other critics argue [specific counter-claim], citing [named source]." Both sides get equal visual weight and equal specificity — no side gets the last word, longer treatment, or an unattributed "but critics say" aside tacked onto an otherwise one-sided paragraph.

**The party-swap/perspective-swap test**, applied to every sentence in the update-pane and every history section touching discrimination-coded history (Section 2's Asian exclusion content, Section 3's quota system): would this read the same regardless of which political side, party, or current administration is associated with it? For the historical exclusionary-policy content specifically, the test is different — those are settled facts named accurately by mainstream historical scholarship (the Chinese Exclusion Act *was* exclusionary; this is not a contested characterization needing a "some historians say" hedge) — so the discipline there is **accuracy to the historical record**, not both-sidesing settled history. The differing-perspectives component is reserved specifically for genuinely live, contested, present-day policy questions, not applied retroactively to history.

**Getting this right deserves its own dedicated review pass at implementation time**, separate from and in addition to the whole-page nonpartisanship review, the same way Elections' update-pane and local section each got dedicated passes.

---

## Washington's Immigration Story

Historical immigrant communities and waves specific to Washington/Puget Sound — deliberately scoped to **history and community, not state policy**, keeping this section's risk profile low (mirrors Climate's approach of separating a low-risk local-history angle from a higher-risk policy angle, which here lives entirely in the update-pane instead).

Candidate content (to be researched and verified at implementation time, not locked here):
- Scandinavian immigration and settlement in the Puget Sound region (a genuinely distinctive regional story)
- Asian American history in Washington, including the Japanese American community's WWII incarceration (Executive Order 9066) — a settled historical fact requiring the same accuracy-not-hedging discipline as Section 2's exclusion-law content
- Refugee resettlement history in the Seattle area (Washington has a well-documented history as a resettlement destination for multiple refugee waves over recent decades)

Every claim researched and verified against a primary/authoritative source at implementation time, per this project's standing sourcing discipline (see below).

---

## Key People

Two profiles, both historical figures — this site's hard rule (no current sitting officials, ever, in a `person-card`):

1. **A historically significant immigrant to the US**, whose personal story illustrates one of the waves/eras covered in the historical timeline (specific figure to be researched and verified at implementation time — should have a well-documented biography and a real, licensable Wikimedia Commons portrait).
2. **A policy figure tied to the 1965 Immigration and Nationality Act** — the law that created today's system, making this the natural "how the system was built" counterpart to the immigrant profile, mirroring US Elections' Madison (system-building) + Lewis (lived experience) pairing.

Both names confirmed against real, settled historical sourcing before being locked into content — same discipline as every prior Key People section on this site.

---

## Sourcing Standards

Same discipline as every prior page on this site: fetch and read every source directly to confirm it supports the specific claim it's cited for — a live/200 URL is not sufficient on its own. Prioritize primary/authoritative sources — U.S. Citizenship and Immigration Services (USCIS), Department of Homeland Security, the National Archives, the Migration Policy Institute (a widely-cited nonpartisan research organization), and Pew Research Center (nonpartisan, widely used for immigration statistics) — over secondary news coverage wherever a direct fetch is possible. For the update-pane's enforcement content specifically, both sides of any differing-perspectives pairing must cite a real, named, verifiable source — no side gets an unsourced assertion. Images: Wikimedia Commons only, verified license and subject-match confirmed directly on the file's own Commons page, with this site's established honest "no verifiable image found" fallback used rather than a forced or unverified citation.

---

## Reading Level

Target 5th–6th grade for durable core-content sections (history, legal-process mechanics), matching every prior page. The update-pane's Part A (backlog numbers, statistics) and Part B (enforcement facts, differing-perspectives content) may land slightly higher given factual density and the need for precise, careful language — treated as an acceptable, expected trade-off, consistent with how Climate's Washington policy sub-section was treated.

---

## Out of Scope (for this build)

- Immigration policy in other countries, international refugee law/UN frameworks beyond a brief definitional mention (asylum vs. refugee status) — this page's scope is U.S. immigration, matching every prior page's national/domestic focus.
- Detailed state-by-state comparison of state-level immigration policy (e.g. "sanctuary city/state" laws) — the Washington section is scoped to community/history, not state policy, per the project owner's explicit choice during brainstorming.
- Personal legal advice or a "how to apply" walkthrough — Section 5 explains how the system works conceptually, not a procedural guide for an actual applicant.
- A running, frequently-refreshed news ticker — the update-pane is a dated snapshot like every other page's, refreshed at future site updates, not a live feed.

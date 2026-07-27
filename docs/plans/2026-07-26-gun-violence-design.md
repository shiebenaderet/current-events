# Gun Violence & School Safety Policy — Design Document

**Date:** July 26, 2026
**Type:** New page (from scratch — no existing content)
**Files:** `gun-violence.html` (new), `index.html` (convert existing "Coming Soon" entry to a live topic card + nav link), `iran.html`/`ukraine.html`/`climate-change.html`/`ai.html`/`us-elections.html`/`immigration.html` (add a sibling-nav link on each)

---

## Concept

A new topic page, built directly in the site's now-locked editorial design system (see `immigration.html` as the primary structural reference — masthead, sticky section-nav, full-bleed hero, drop-cap lede sections, `.stat-pair`/`.stat-trio`, `.pull-quote`, `.cite-inline` citations, dark `.focus-pane`/`.update-pane` deep-dives, history timeline, Key People, quizzes/points/easter-egg JS engine, `.term` inline vocabulary tooltips, videos, resources).

**Core angle, confirmed with the project owner:** policy-and-prevention-first, not incident-first. The page's throughline is how school safety policy actually works — what's been tried, what current law allows and requires, and how the U.S.'s approach compares structurally to other countries' — rather than a chronology of shootings. This is a deliberate choice, discussed explicitly with the project owner before any structural work began, given the page directly concerns the safety of the same age group reading it. The project owner confirmed proceeding with this topic now (rather than deferring it) is the right call, provided it's handled with the same care as every other sensitive topic on this site.

**This is likely the highest nonpartisanship-risk page the site has built.** Gun policy is more directly, personally, and continuously politically contested in the U.S. than any topic covered so far — more so than immigration enforcement, which itself required inventing a new component. This page reuses that same component (the differing-perspectives block from `immigration.html`) rather than inventing a new pattern, since it already proved out under review. See the dedicated **Nonpartisanship Discipline** section below.

**A genuinely sensitive design decision, made explicitly with the project owner:** the page includes a factual section on the scale of U.S. gun deaths, which necessarily touches suicide (a majority of U.S. gun deaths are suicides, not homicides — a well-documented, frequently-surprising fact that reframes the whole topic). This is included, stated plainly and briefly, with a visible crisis-resources note (the 988 Suicide & Crisis Lifeline) attached — not as its own deep-dive, and not positioned as the page's emotional center. Omitting it entirely was considered and rejected, since it's directly relevant to understanding the actual scale of the topic and this site's established practice is to state real facts carefully rather than avoid them.

---

## Page Structure

1. **Section 1 — Understanding the Scale** (moved to open the page, per explicit project-owner direction after initial content review — see "Reordering Rationale" below). Durable statistical grounding using CDC/data-source figures — total annual U.S. gun deaths, broken into categories (this is where the suicide-majority fact appears, briefly, factually, with the 988 crisis-resources note placed immediately adjacent, not buried), and separately, school-shooting-specific incident data from an established tracking source. **Opens the page** with an explicit framing that lockdown drills and this level of school-shooting concern are not a historical constant in American life — genuinely new content, requiring its own verified long-run trend data (see "The Worsening-Trend Claim" below), not just the recent-year 2023-vs-2025 comparison already sourced. Closes with an explicit "how did we get here?" bridge into Section 2. This section does not editorialize about causes.
2. **Section 2 — The Second Amendment & Landmark Laws** (moved to follow Section 1, reframed as the answer to that section's closing "how did we get here?" question rather than the page's cold open). Covers: what the Second Amendment's text actually says; how its interpretation has shifted over time — most notably *District of Columbia v. Heller* (2008), a genuinely significant and recent shift in how courts read the amendment, stated as settled legal history (what the Court held, when), not as commentary on whether that shift was correct; then 3-4 landmark federal laws in brief — the National Firearms Act (1934), the Gun Control Act (1968), the Brady Handgun Violence Prevention Act and the 1994 federal assault weapons ban (and its 2004 expiration, stated as a plain legislative fact — a law existed, then it didn't, because Congress didn't renew it). Still brief historical grounding, not a deep constitutional-law treatment — the reorder changes its narrative role (answer, not cold open), not its scope or depth.

### Reordering Rationale (added after initial content review)

The project owner reviewed Sections 1-2 after they were built and requested the page open with scale/stakes instead of legal history — the reasoning: growing up with lockdown drills and a persistent fear of school shootings is not a historical constant in the U.S., and the page should establish that fact and its weight before walking through the legal/historical framework that's part of how the country got here. This is a genuine structural and emotional-arc change, not just a section-swap — Section 1 now needs to open with that explicit framing (not present in the original content) and close with a bridge question into Section 2, and Section 2's own opening needs to read as answering that question rather than beginning cold.

### The Worsening-Trend Claim

The project owner's framing explicitly asserts this is "something that's gotten worse over time," not just a currently-high level. This is a factual claim requiring its own verified long-run data — the school-shooting content already sourced during initial drafting only compares 2023 to 2025 (a two-year window, showing a *decline*, not a multi-decade trend), which is NOT sufficient to support a "gotten worse over time" claim on its own. The K-12 School Shooting Database (already the page's primary tracking source) tracks incidents back to 1966, which makes a genuine long-run comparison possible — implementation must fetch and verify actual multi-decade trend data (e.g., a per-decade or per-multi-year-period incident count, or a comparable long-run measure from RAND, the K-12 SSDB's own published trend analysis, or a similar authoritative source) before asserting the trend as fact. If the verified long-run data shows a more complicated pattern than a clean monotonic increase (e.g., a rise with a recent partial decline, which the existing 2023→2025 numbers already hint at), state that complexity honestly rather than flattening it into a simple "always getting worse" narrative — accuracy standard applies here exactly as it does everywhere else on this page.
3. **Section 3 — School Safety Measures That Have Been Tried**: concrete, factual coverage of specific measures schools/districts have implemented — metal detectors, school resource officers (SROs), lockdown drills, threat-assessment programs, security-vestibule/access-control changes. For any claim about a measure's effectiveness, attribute it to a named, dated study or organization rather than asserting it as the page's own judgment — this is an area where research findings are genuinely mixed by measure, and the page should reflect that mixedness factually rather than picking a favored intervention.
4. **Section 4 — How Policy Actually Works Today**: the federal/state authority split (what the federal government can and can't regulate versus what's left to states — a genuinely important structural fact, since much of the actual policy variation students will encounter is state-level), with red-flag laws (extreme risk protection orders) explained as a specific, concrete mechanism example of state-level policy in action — described structurally (what a red-flag law does, procedurally) without characterizing whether such laws are effective or appropriate.
5. **Update-pane — "Where Things Stand"** (the page's live/dated current-events hook; see dedicated section below).
6. **Washington's School Safety Story** (dedicated local section, playing the same role as Climate's and Immigration's Washington sections): Washington-specific school safety law and funding — e.g., Washington's own red-flag law history and timeline, state-level school safety funding programs, any Washington-specific purchase-age or related requirements — stated as plain policy fact, same nonpartisan discipline as this site's other local-policy sections (Climate's Washington's Climate Story sub-section is the closest precedent for a *policy*, not just history/community, local section).
7. **How Other Countries Handle This** (the page's distinctive hook, added per explicit project-owner direction mid-brainstorm): structural, factual comparison of 3-4 countries with genuinely different regulatory approaches — strong candidates: Australia (the 1996 National Firearms Agreement and mandatory buyback following the Port Arthur massacre), Japan (near-total civilian firearm restriction), Switzerland (comparatively high civilian gun ownership tied to its militia-based reserve system, but a very different regulatory structure than the U.S.), and Canada (a regulatory middle ground, geographically and culturally proximate to the U.S., making the comparison concrete for students). Each country's actual laws and, where a clear, well-documented before/after data point exists (e.g., Australia's post-1996 trends), factual outcomes — stated plainly with sources, with **no editorializing about which country's approach is "better"** and no side-by-side "supporters say / critics say" framing here (that pattern is reserved for the update-pane's genuinely live U.S. policy debates, not for describing other countries' settled law).
8. **History Timeline**: pulls dates already established in Sections 1-3 (the verified long-run trend data points from Section 1, 1934/1968/1994/2004/*Heller* 2008 from Section 2, plus a small number of major school-shooting-era inflection points if directly relevant to policy history — e.g., Columbine 1999 as the point after which SROs/lockdown drills became widespread, stated as a policy-history fact, not an incident narrative).
9. **Key People**: two historical figures only, per this site's hard, non-negotiable rule (no current sitting officials, ever). Candidates to research and verify at implementation time — one figure tied to a landmark law's passage, one figure tied to school-safety-policy advocacy or research, both confirmed as genuinely historical (not currently active in the role that would make them politically live) before being locked in.
10. **Videos, Resources**: standard pattern — videos, a resources grid of nonpartisan/reputable sources, and a dated "Keep up with school safety policy news" curated-links subsection mirroring every other page's equivalent. Also includes a new subsection, **"Groups Working on This Issue"** (see dedicated section below).
11. **Images**: at least one real, verified image per major section (see dedicated section below) — added as its own implementation task, not woven in ad hoc per-section the way earlier pages on this site initially did, following the lesson from Immigration's build that a dedicated image-sourcing pass works better once all section prose is finalized.

---

## The Update Pane: "Where Things Stand"

Reuses the `update-pane`/`mini-tl` markup already established across the site, and reuses Immigration's differing-perspectives component (`.perspectives`/`.perspective`/`.perspective-label`) — not a new component, the same one, applied under the same discipline.

**Part A — structural status facts** (same discipline as every other page's update-pane: state facts, cite sources, no verdict): recent dated incident-count data from an established, nonpartisan tracking source; recent, dated legislative activity at the federal and/or state level, stated neutrally (what was proposed/passed, by whom in a role sense — not characterized as good or necessary).

**Part B — genuinely contested current policy questions**, using the differing-perspectives component for each: candidate contested questions to research and confirm at implementation time (do not force all of these if research doesn't turn up two genuinely well-sourced, equally substantive positions for a given one) — assault-weapon ban proposals, arming/training teachers, minimum purchase age, red-flag law expansion. For each block actually included: two or more named, real, verifiable sources presented in their own stated terms, equal length/specificity, neither side paraphrased from the other's characterization of it. If a candidate question doesn't turn up two well-sourced positions, state whatever is genuinely uncontested plainly (Part A-style) or omit it — do not manufacture false balance.

---

## Nonpartisanship Discipline

Default discipline (state facts, attribute characterizations to a named source, no verdict) applies to the entire page — Sections 1-4, the Washington section, and the international-comparison section should need nothing beyond this default, since all of that content is either settled history, structural/legal fact, or another country's own settled law.

**The differing-perspectives component is reserved exclusively for the update-pane's Part B**, exactly as scoped on `immigration.html` — not used in the international comparison section (per the project owner's explicit choice: that section states facts about other countries plainly, it does not stage a debate about whether the U.S. should adopt similar policies), and not used to relitigate the settled historical content in Section 2 or the school-safety-measures content in Section 3 (effectiveness claims there are handled via attribution to a specific study/source, not a two-sided debate block, since "does this specific measure work" is a research question with a body of evidence to cite, not a values question with two legitimate sides the way "should teachers be armed" is).

**The party-swap/perspective-swap test** applies to every sentence in the update-pane and to Section 4's policy-mechanics content: would this read the same regardless of which party or officials are associated with it? Section 1's scale/statistics content (including the long-run trend data) and Section 7's international comparisons are settled-fact content and are held to an accuracy standard, not a balance standard — a true statistic doesn't need "some say" hedging, and another country's actual law doesn't need a U.S.-partisan lens applied to it.

**A dedicated, extra-careful pass on the suicide-data sentence(s) in Section 1** at implementation time: state the fact plainly, cite it, and confirm the adjacent crisis-resources note (988 Lifeline) is genuinely adjacent — not several paragraphs removed — and phrased supportively rather than clinically appended.

---

## Washington's School Safety Story

Washington-specific school safety law and funding — a *policy* local section (like Climate's Washington's Climate Story), not a history/community section (like Immigration's Washington's Immigration Story) — since this topic's natural local angle is what the state has actually done, not a historical community narrative. Candidate content, to be researched and verified at implementation time:
- Washington's own red-flag law (Extreme Risk Protection Order) — when enacted, how it works procedurally, stated factually.
- State-level school safety funding programs (capital funding for security infrastructure, threat-assessment program funding, etc.).
- Any Washington-specific firearm purchase-age or related requirement directly relevant to school safety policy.

Same nonpartisan discipline as Climate's Washington policy sub-section: dates, mechanisms, and dollar figures stated plainly; any claim about a policy's reception or effectiveness attributed to a named, dated source.

---

## Key People

Two profiles, both historical figures — this site's hard rule (no current sitting officials, ever, in a `person-card`):
1. A historical figure genuinely central to passing one of Section 1's landmark federal laws.
2. A historical figure tied to school-safety-policy advocacy or research (not a currently-active advocate or officeholder).

Both names researched and confirmed against real, settled historical sourcing before being locked into content — same discipline as every prior Key People section, including verified Wikimedia Commons portrait licensing or this site's established honest-disclosure fallback if no verifiable portrait exists.

---

## "Groups Working on This Issue" (Resources subsection)

Added per explicit project-owner direction. A small, deliberately balanced set of Washington-based or Washington-active organizations working on gun violence prevention and/or school safety, from genuinely different perspectives — placed in the Resources section (not the update-pane, and not cited elsewhere on the page as a source for any factual claim), framed explicitly as "organizations working on this issue" for students who want to learn more, not as evidence the article itself relies on.

**Composition rule, non-negotiable:** if a gun-violence-prevention advocacy organization is included, a gun-rights/Second Amendment advocacy organization active in Washington must be included alongside it, with equal visual treatment (same card size, same description length/specificity, same neutral descriptive tone — "this organization advocates for X" stated factually for both, never "this organization exists to spread X's dangerous view" for one and a neutral description for the other). Apply the same party-swap-style test used elsewhere on this site: would each organization's one-line description read as evenhanded if a reader who supports the *other* organization's position read it? Descriptions state what each group says it does, sourced from that group's own materials, not a characterization from the opposing side.

If, at implementation time, a genuinely balanced pair of Washington-active organizations cannot be found and verified, omit this subsection entirely rather than include an unbalanced set — do not ship one side without the other.

---

## Images

At least one real, verified image per major section (Sections 1-4, the update-pane, Washington's School Safety Story, the international-comparison section, and the History Timeline) — implemented as its own dedicated task after all page prose is finalized, mirroring `immigration.html`'s Task 10 (added mid-build there after the rest of the page was already text-heavy; built into this page's plan from the start instead). Same non-negotiable discipline as every image on this site: license (public domain or CC) and subject match verified directly on the image's own Wikimedia Commons file page, never from an embedding article or search-result thumbnail. Given this topic's sensitivity, images should be non-graphic and non-incident-specific by default — favor images of policy/institutional subjects (a courtroom, a state capitol, a school security checkpoint, a red-flag-law press conference, a foreign country's relevant landmark/context for the international section) over anything depicting an actual shooting scene, memorial, or victim — this is a stronger constraint on image selection than any prior page on this site has needed, and should be treated as a hard filter, not a preference, during sourcing.

---

## Sourcing Standards

Same discipline as every prior page: fetch and read every source directly to confirm it supports the specific claim it's cited for — a live/200 URL is not sufficient. Prioritize primary/authoritative sources: the CDC (for gun-death statistics), the Congressional Research Service or a comparable nonpartisan federal research source (for policy-mechanics content), an established, methodologically-transparent school-shooting tracking organization (e.g., a university-affiliated database) for incident counts, and, for the international-comparison section, each country's own government sources or a comparable authoritative reference (not a single U.S.-advocacy-group summary of another country's law). For the update-pane's Part B differing-perspectives content, both sides of any pairing must cite a real, named, verifiable source in that side's own words — no unsourced assertion on either side. Images: Wikimedia Commons only, verified license and subject-match confirmed directly on the file's own Commons page, with this site's established honest "no verifiable image found" fallback used rather than a forced or unverified citation.

---

## Reading Level

**Target true 5th–6th grade from the start** — short sentences (~12-15 words), one idea per sentence, plain vocabulary, jargon carried by `.term` inline tooltips (ported from `immigration.html`) rather than left in prose as parentheticals. This is stated as a first-draft requirement, not a follow-up pass: a site-wide audit after Immigration shipped found that pages written without this discipline from the start (`ai.html`, `ukraine.html`) needed a full second rewrite pass later to reach it, while pages that had it from the start didn't. Build this page to the target the first time.

The update-pane's Part A/Part B content may land slightly higher given factual density, matching this site's standing accepted trade-off for update-panes generally — but even there, prefer short sentences over long ones wherever the content allows it.

**A dedicated grade-level review pass is a required implementation task, not an assumption.** Per explicit project-owner direction, the implementation plan must include its own task — after all content sections are written — that rereads the entire page section by section, spot-checks actual sentence length against the ~12-15 word target, and fixes anything that drifted during drafting. Writing to the target from the start (above) reduces how much this pass needs to fix, but does not replace the pass itself; every prior page on this site that skipped a dedicated review step needed one added later anyway.

---

## Out of Scope (for this build)

- A chronological or incident-by-incident history of specific school shootings — this page is policy-and-prevention-focused by deliberate design choice, not an incident chronicle. Individual incidents may be referenced factually where directly relevant to a specific policy change (e.g., Columbine's relationship to SRO adoption), but this page does not narrate incidents for their own sake.
- Detailed state-by-state comparison of every U.S. state's gun laws — Washington gets its own dedicated section; other states are not individually profiled.
- A deep dive into the international comparison countries' broader criminal-justice or social-policy systems beyond what's directly relevant to their firearm regulation — e.g., Japan's broader criminal justice system is out of scope beyond what explains its firearm law specifically.
- Any use of the differing-perspectives component outside the update-pane's Part B, per the Nonpartisanship Discipline section above.
- An unbalanced "Groups Working on This Issue" subsection — either a genuinely balanced pair ships, or the subsection doesn't ship at all, per the composition rule above.
- A running, frequently-refreshed news ticker — the update-pane is a dated snapshot like every other page's, refreshed at future site updates, not a live feed.

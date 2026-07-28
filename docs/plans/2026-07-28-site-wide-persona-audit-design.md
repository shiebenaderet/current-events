# Site-Wide Persona Audit — Design Document

**Date:** July 28, 2026
**Type:** Cross-page fix pass (no new pages) — `iran.html`, `ukraine.html`, `climate-change.html`, `ai.html`, `us-elections.html`, `immigration.html`
**Related:** Follows the same persona-review method first used on `gun-violence.html` (Task 17 of `docs/plans/2026-07-26-gun-violence-implementation.md`)

---

## Concept

After `gun-violence.html`'s build, the project owner had it reviewed by three independent AI personas (an 8th-grade student, an 8th-grade social-studies teacher, and a UX-focused edtech developer) reading the live page with no persona seeing another's output. That surfaced 5 concrete, fixable findings (Task 17). The project owner then asked for the same three-lens review across the site's other six pages, followed by a consolidated, page-by-page fix plan.

This document records what the six audits found and what will be fixed. It intentionally does not re-litigate whether the persona-review method works — that was already validated on gun-violence.html.

## Method

Each page pair was reviewed by three fresh, independent subagents (one per persona), each given only the target page(s) plus a comparison page for context — never given another persona's output. Findings below are what recurred across personas/pages (treated as higher-confidence) versus what a single persona flagged on a single page (treated as a real but page-scoped finding).

## Site-Wide Findings (recur across multiple pages/personas)

### 1. Update-pane/"Situation Update" placed first, before any foundational content

Confirmed on 5 of 6 pages (iran, ukraine, ai, us-elections, immigration — climate-change has no comparable update-pane). Every student-persona review independently described this pattern as the point where they'd lose interest or feel lost, since dense current-events content (often the page's highest jargon density) is the first thing a reader sees, before any section has built foundational vocabulary or context.

**This exact problem was already fixed once, structurally, on `gun-violence.html`** via Task 16's vocabulary-grounding approach (adding short grounding clauses before jargon terms, without moving or restructuring the pane) — chosen over relocating the pane, since its top placement is an intentional narrative-hook design choice.

**Fix for this pass**: apply the same technique — NOT reordering — to the other five pages. Each page's update-pane gets audited for jargon/terms used before the page has explained them, and short grounding clauses are added at each point found. This is deliberately a smaller, safer fix than restructuring, matching the precedent already set and reviewed on gun-violence.html.

### 2. Missing `.text-size-controls` (A/A/A accessibility widget)

Present only on `immigration.html` and `gun-violence.html`. Missing on `iran.html`, `ukraine.html`, `climate-change.html`, `ai.html`, `us-elections.html`.

**Fix**: port `immigration.html`'s existing, working implementation (CSS block, `.a11y-controls` HTML wrapper with three `A` buttons, `setTextSize()` JS, `localStorage` persistence) verbatim to all 5 missing pages. This is a proven, working component being replicated, not a new design.

### 3. `.term` tooltips missing `aria-describedby` (screen-reader gap)

Present (fixed) only on `gun-violence.html`, via Task 17's new pattern: each `.term` span gets an `aria-describedby` pointing to an adjacent visually-hidden `.term-desc` span carrying the same text as `data-def`. Every other page that has a `.term` system at all (`iran.html`, `ukraine.html`, `ai.html`, `us-elections.html`, `immigration.html`) is missing this wiring. (`climate-change.html` has no `.term` system at all — see Finding 5.)

**Fix**: apply gun-violence.html's exact `aria-describedby`/`.term-desc` pattern to every `.term` span on the 5 affected pages — same technique, same markup shape, already proven and reviewed once.

### 4. `.tl-item` (History Timeline) missing mobile-stacking `@media` rule

Present on `immigration.html`, `us-elections.html`, `gun-violence.html`. Missing on `iran.html`, `ukraine.html`, `climate-change.html`, `ai.html` — their timelines stay a fixed-width flex row at all viewport widths, which will visibly cramp on a phone screen, worst on `ukraine.html` (17 entries) and `ai.html` (19 entries).

**Fix**: add the existing rule (`@media(max-width:600px){.tl-item{flex-direction:column;gap:6px}.tl-year{width:auto}}`, confirmed present verbatim on the three compliant pages) to the four missing pages.

### 5. `climate-change.html` is missing core components entirely — corrected understanding

A prior project memory incorrectly described `climate-change.html` as the flagship/most-advanced page in a site-wide editorial redesign. Direct file inspection during this audit found the opposite: it has only the redesign's visual/token layer (colors, `.lede` drop caps) and is missing `.term` tooltips, `.stat-trio`, `.focus-pane`, the entire points/quiz/easter-egg JS engine, and text-size controls — components every other newer page has. The intended flagship work lived in a prototype file (`climate-change-editorial-prototype.html`) that no longer exists anywhere in the repo; it was never merged. (Project memory has been corrected separately to reflect this — see `project_editorial_redesign` and `project_climate_change_page`.)

**Fix, scoped for this pass**: bring `climate-change.html` up to the other pages' component floor — add `.term` tooltips (with `aria-describedby` from the start, not retrofitted) for its existing bolded/jargon terms, add the points/quiz/egg engine (porting the proven pattern, not inventing a new one), and add text-size controls. This is the largest single-page fix in this plan. `.stat-trio`/`.focus-pane` are cosmetic upgrades, not accessibility/functionality gaps — they are explicitly OUT of scope for this pass (the page already uses `.stat-pair` adequately; a full visual rebuild is a separate future effort, not bundled into this accessibility/consistency pass).

## Page-Specific Findings (single-page, not site-wide patterns)

### `iran.html`
- **(Teacher)** The elementary-school-strike detail (153 civilians killed) is buried in one dense sentence in Section 1 with no separate callout or content note, understating its weight relative to how the page treats other heavy details elsewhere. **Fix**: give it its own short, appropriately-weighted callout, matching the page's existing content-note pattern used elsewhere.
- **(Teacher)** Two casualty-figure citations use Wikipedia as a source — acceptable as a rough proxy but not ideal for a page presented to parents/administrators. **Fix**: replace with a named primary tracker or NGO source if one can be verified to support the same figures; if not, leave as-is rather than force a weak citation swap.
- **(UX dev)** Cross-page nav omits a link to `climate-change.html` (other pages include it) — a stale sibling-nav gap. **Fix**: add the missing link, matching the site's existing cross-page-nav convention.
- **(UX dev)** Duplicate/near-identical `.hidden-egg`/`.hidden-section` CSS classes — dead redundancy. **Fix**: consolidate to whichever one is actually in use; delete the unused one.

### `ukraine.html`
- **(Teacher)** No "Think About It" pause after the Bucha passage, unlike nearly every other emotionally heavy passage on the page (including this page's own Holodomor section). **Fix**: add one, matching the page's existing prompt style.
- **(UX dev)** `.update-box` doesn't restyle `.stat-trio` for its dark background (unlike its `.stat-pair` handling) — currently avoided only because no update-box on this page uses a stat-trio; worth fixing so the gap doesn't surface later. **Fix**: add the missing dark-mode override, matching the existing `.stat-pair` pattern.

### `ai.html`
- **(Student + Teacher, converging)** The page is overloaded — 4 dark `.focus-pane` deep-dives plus a long timeline plus 4 podcast embeds is, per the student reviewer, "trying to be five articles at once," and the teacher confirms real curriculum gaps exist anyway: misinformation/deepfakes, job displacement, and academic integrity are all underweighted relative to how much space goes to Hinton's biography and the casino-auction anecdote. **Fix, scoped conservatively for this pass**: do not attempt a full content rebalance (too large for this fix-pass's scope) — instead, trim the two focus-panes the student found least essential (School, Agentic AI) for length only, and add one short new subsection on misinformation/academic-integrity stakes, sourced with the same rigor as the rest of the page. A fuller rebalance remains a candidate for a future dedicated content pass, not this one.
- **(Teacher)** The "more regulation" framing (via the Hinton quotes) has no counter-voice on regulation costs/tradeoffs, unlike the more rigorous balance shown elsewhere on the site (e.g., climate-change.html's Myers/Missik pairing). **Fix**: add one clearly-sourced counter-perspective on AI-regulation costs/tradeoffs near the existing Hinton content, matching the site's `.perspectives` pattern where appropriate.
- **(Teacher)** Several person photos are flagged in their own captions as unable to confirm exact provenance — an honest disclosure, but worth resolving if a verified alternative exists. **Fix**: attempt to source a verified replacement for each; if none can be confirmed, leave the existing honest disclosure as-is rather than force an unverified swap.

### `us-elections.html`
- **(UX dev)** SVG diagram hardcodes color hex values instead of referencing the page's CSS custom properties — cosmetic/maintainability nit only, not a rendering bug. **Fix**: optional, low priority — only fix if it can be done without risk to the diagram's visual correctness; otherwise explicitly deferred.
- No emotional-care or nonpartisanship findings — the teacher review found this page's balance discipline exemplary, no changes needed there.

### `immigration.html`
- **(UX dev)** The footer's Konami-code teaser hint (present on `us-elections.html` as a small `.secret-text` line) is missing here, making that egg undiscoverable without prior knowledge. **Fix**: add the same small teaser line, matching `us-elections.html`'s existing copy/placement pattern.
- **(Teacher)** Minor sharpening suggestion on the ICE-arrest `.perspectives` box: both DHS and the American Immigration Council are self-interested parties, but only AIC is explicitly labeled as advocacy-affiliated. **Fix**: add an equivalent brief neutral labeling note for DHS's side, matching how the page already labels AIC — a labeling-consistency fix, not a rebalancing of content.

## Explicitly Out of Scope for This Pass

- Any full visual/component rebuild beyond bringing pages up to the shared accessibility/functionality floor (Findings 2-5). `.stat-trio`/`.focus-pane` additions to `climate-change.html` beyond what's needed for parity are a separate future effort.
- Reordering any page's update-pane out of its top position — Finding 1's fix is grounding text only, matching the precedent set on gun-violence.html.
- `ai.html`'s full content rebalance (job displacement, misinformation deep coverage) beyond the one new subsection scoped above — flagged as a candidate for a future dedicated pass.
- Any change to citation counts, sourcing, or factual claims beyond what's explicitly listed above (new callouts/labels/subsections use citations already in scope or newly, genuinely sourced — not invented).
- `us-elections.html`'s SVG color-token refactor, unless it can be done with zero visual-regression risk.

## Sourcing & Discipline Carried Forward

All standing site-wide rules apply unchanged: nonpartisanship discipline (party-swap test on any current-policy content), date-specificity (no "now"/"currently" without an explicit date), citation-before-editorializing, and the established quote-punctuation-integrity rule (never alter punctuation immediately adjacent to a quoted span without checking the source's original punctuation first).

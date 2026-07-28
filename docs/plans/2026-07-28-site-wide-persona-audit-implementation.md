# Site-Wide Persona Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the findings from a 3-persona (student/teacher/UX-dev) review of `iran.html`, `ukraine.html`, `climate-change.html`, `ai.html`, `us-elections.html`, and `immigration.html` — bringing all six up to the same accessibility/functionality floor `gun-violence.html` already established, plus a handful of page-specific content fixes.

**Architecture:** Tasks 1-4 apply the three proven, mechanical shared-component fixes (text-size controls, `.term` `aria-describedby`, timeline mobile-stacking) to `iran.html`, `ukraine.html`, `ai.html`, and `us-elections.html` — one task per page, since each page's exact insertion points differ even though the fix pattern is identical. Task 5 does the same three fixes for `immigration.html` (which is missing only the `aria-describedby` piece, having text-size-controls and timeline-stacking already) plus its two page-specific findings. Task 6 is `climate-change.html`'s larger fix (adding `.term`, the points/quiz/egg engine, and text-size controls from scratch) — sequenced last, after the same patterns have been applied four times already on Tasks 1-4, so this task's implementer has maximum context on how the pattern should look. Tasks 7-9 handle the remaining page-specific findings on `iran.html`, `ukraine.html`, and `ai.html`. Task 10 is a full cross-page verification pass.

**Tech Stack:** Plain HTML/CSS/JS, no build step. Verification is manual: grep checks, browser opens, div/id-balance checks.

## Global Constraints

- **Every fix in this plan replicates an already-built, already-reviewed pattern — do not redesign.** The text-size-controls implementation exists verbatim on `immigration.html` (CSS block, `.a11y-controls` HTML, `setTextSize()` JS). The `.term`/`aria-describedby`/`.term-desc` pattern exists verbatim on `gun-violence.html`. The `.tl-item` mobile-stacking media query exists verbatim on `immigration.html`, `us-elections.html`, and `gun-violence.html`. Read the real, current markup from the source page directly before porting — do not reconstruct from memory or from this plan's prose description.
- **Never alter existing `data-def` text content** when adding `aria-describedby` wiring — the hidden `.term-desc` span's text must be byte-identical to the existing `data-def` attribute value on the same span.
- **Never introduce a duplicate `id` attribute.** Every new `.term-desc` span needs a genuinely unique `id` — check the full page's existing `id=` census before assigning new ones, don't assume a numbering scheme is safe without checking.
- **Content-note/callout additions must be genuinely sourced or genuinely content-neutral** (e.g., a "Think About It" prompt referencing only what's already on the page) — never introduce a new factual claim without a citation, and never invent a source.
- **Apply this project's standing nonpartisanship discipline** (party-swap test) to any new prose touching current policy, and this project's quote-punctuation-integrity rule (never alter punctuation immediately touching a quoted span without checking the original source's punctuation) to any edit near an existing quote.
- **Apply date-specificity discipline**: no "now"/"currently" without an explicit date, in any new prose.
- **Citation counts must not decrease** on any page as a result of this plan's edits — verify `cite-inline` (or that page's equivalent citation-link class) count before and after every task.
- Confirm each page's actual current `cite-inline`/citation class name and `.term` markup pattern directly from that file — some older pages may use slightly different class names than the newest pages; do not assume uniformity without checking.

---

## Reference Files

- **Design doc:** `docs/plans/2026-07-28-site-wide-persona-audit-design.md` — read this in full before starting; it has the complete rationale for every fix below.
- **Text-size-controls reference (working, proven implementation):** `immigration.html`
- **`.term`/`aria-describedby` reference (working, proven implementation):** `gun-violence.html`
- **`.tl-item` mobile-stacking reference (working, proven implementation):** `immigration.html`, `us-elections.html`, or `gun-violence.html`
- **Pages to modify:** `iran.html`, `ukraine.html`, `climate-change.html`, `ai.html`, `us-elections.html`, `immigration.html`

---

## Task 1: `iran.html` — Shared Component Fixes + Page-Specific Findings

**Files:**
- Modify: `iran.html`

- [ ] **Step 1: Read the reference implementations**

Read `immigration.html`'s text-size-controls (CSS, HTML wrapper, JS) and `.tl-item` mobile media query. Read `gun-violence.html`'s `.term`/`aria-describedby`/`.term-desc` pattern. Read `iran.html`'s own current `.term` markup, timeline markup, and footer/nav structure before making any changes.

- [ ] **Step 2: Add text-size controls**

Port `immigration.html`'s text-size-controls implementation verbatim (CSS block, `.a11y-controls` HTML wrapper with three `A` buttons, `setTextSize()` JS with `localStorage` persistence) into `iran.html`, placed consistent with where `immigration.html` places it (near the dyslexic-font toggle).

- [ ] **Step 3: Wire `aria-describedby` on all `.term` spans**

For every `.term` span in `iran.html`, add a unique-id hidden `.term-desc` span immediately after it (text byte-identical to that span's existing `data-def`) and point `aria-describedby` at it, matching `gun-violence.html`'s exact pattern. Check the full page's `id=` census first to guarantee no collisions.

- [ ] **Step 4: Add `.tl-item` mobile-stacking**

Add `@media(max-width:600px){.tl-item{flex-direction:column;gap:6px}.tl-year{width:auto}}` (confirm the exact rule from a reference page first) to `iran.html`'s CSS.

- [ ] **Step 5: Fix the buried elementary-school-strike detail**

Find the Section 1 sentence describing the elementary-school strike (153 civilians killed). Give it its own short, appropriately-weighted callout, matching this page's existing content-note/callout pattern used elsewhere on the page — do not change the underlying fact or citation, only its visual/structural presentation.

- [ ] **Step 6: Evaluate the two Wikipedia-sourced casualty citations**

Find the two casualty-figure citations currently pointing to Wikipedia. Attempt to find a named primary tracker or NGO source that supports the same figures. If found and verified, replace the citation. If not, leave as-is — do not force a weak substitution.

- [ ] **Step 7: Add the missing `climate-change.html` cross-page nav link**

Read `iran.html`'s current cross-page nav list and `ukraine.html`'s (which already includes the climate-change link) for the correct convention. Add the missing link to `iran.html`, matching placement/style exactly.

- [ ] **Step 8: Remove dead duplicate CSS**

Find the near-identical `.hidden-egg`/`.hidden-section` CSS classes. Confirm which one is actually referenced in the HTML/JS (grep for class usage, not just the CSS definition). Delete the unused one.

- [ ] **Step 9: Verify**

Count citation-link occurrences before/after (must be unchanged or increased, never decreased). Check div/tag balance. Check for duplicate `id` attributes across the whole file. Open `iran.html` in a browser, tab through several `.term` spans to confirm no visual regression, confirm text-size controls work, confirm the new callout renders correctly.

- [ ] **Step 10: Commit**

```bash
git add iran.html
git commit -m "fix: iran.html — text-size controls, term a11y wiring, timeline mobile-stacking, and 4 page-specific fixes"
```

---

## Task 2: `ukraine.html` — Shared Component Fixes + Page-Specific Findings

**Files:**
- Modify: `ukraine.html`

- [ ] **Step 1: Read the reference implementations and this page's current state**

Same as Task 1 Step 1, plus read `ukraine.html`'s Bucha passage and its Holodomor "Think About It" prompt (as the style model for the new one), and its `.update-box`/`.stat-pair` dark-mode override CSS (as the model for the new `.stat-trio` override).

- [ ] **Step 2: Add text-size controls** (same pattern as Task 1 Step 2, applied to `ukraine.html`)

- [ ] **Step 3: Wire `aria-describedby` on all `.term` spans** (same pattern as Task 1 Step 3, applied to `ukraine.html`)

- [ ] **Step 4: Add `.tl-item` mobile-stacking** (same pattern as Task 1 Step 4, applied to `ukraine.html` — note this page's timeline has 17 entries, the longest of the four pages in this batch, so this fix matters most here)

- [ ] **Step 5: Add a "Think About It" prompt after the Bucha passage**

Find the Bucha passage. Add a short, open-ended reflection prompt immediately after it, matching the style/tone of this page's existing Holodomor "Think About It" prompt.

- [ ] **Step 6: Add `.stat-trio` dark-mode override for `.update-box`**

Read the existing `.update-box .stat-pair` dark-mode CSS override. Add an equivalent `.update-box .stat-trio` override using the same color/contrast approach, so the gap doesn't surface if a future update ever adds a stat-trio inside an update-box.

- [ ] **Step 7: Verify** (same checklist as Task 1 Step 9, applied to `ukraine.html`)

- [ ] **Step 8: Commit**

```bash
git add ukraine.html
git commit -m "fix: ukraine.html — text-size controls, term a11y wiring, timeline mobile-stacking, and 2 page-specific fixes"
```

---

## Task 3: `ai.html` — Shared Component Fixes + Page-Specific Findings

**Files:**
- Modify: `ai.html`

**Context:** This page's content-scope fixes are deliberately conservative per the design doc — trim 2 focus-panes for length, add one new subsection, add one counter-perspective. Do NOT attempt a full content rebalance; that's explicitly out of scope for this task.

- [ ] **Step 1: Read the reference implementations and this page's current state**

Same pattern as prior tasks, plus read `ai.html`'s 4 `.focus-pane` sections in full (School, Animals, Hinton, Agentic AI) and its Hinton-quote regulation content, and check whether this site has an existing `.perspectives` two-column pattern to reuse (confirm on `immigration.html` or `gun-violence.html`) for the new counter-perspective.

- [ ] **Step 2: Add text-size controls** (same pattern as Task 1 Step 2, applied to `ai.html`)

- [ ] **Step 3: Wire `aria-describedby` on all `.term` spans** (same pattern as Task 1 Step 3, applied to `ai.html`)

- [ ] **Step 4: Add `.tl-item` mobile-stacking** (same pattern as Task 1 Step 4, applied to `ai.html` — this page's timeline has 19 entries, the longest on the site)

- [ ] **Step 5: Trim the "School" and "Agentic AI" focus-panes for length**

Read both in full. Tighten prose for length only — remove redundant examples/restatements, keep every citation, keep every distinct claim. Do not remove either focus-pane entirely; do not change any claim's substance.

- [ ] **Step 6: Add a new subsection on misinformation/academic-integrity stakes**

Research and write a short, genuinely-sourced new subsection covering AI-generated misinformation/deepfakes and/or academic-integrity stakes (cheating detection, using AI on homework) — matching this page's existing reading level and citation discipline. Place it where it fits the page's existing flow best (near the existing brief "does using AI to do your homework help you learn" mention, if that's still the best fit — confirm by reading current context).

- [ ] **Step 7: Add a counter-perspective on AI-regulation costs/tradeoffs**

Near the existing Hinton regulation content, add one clearly-sourced counter-perspective on regulation costs/tradeoffs, using the site's `.perspectives` two-column pattern if it fits this page's existing structure, or a clearly-labeled single addition if not. Must be genuinely sourced, not invented.

- [ ] **Step 8: Verify**

Same checklist as Task 1 Step 9, plus: confirm the trimmed focus-panes didn't lose any citation, confirm the new subsection and counter-perspective are each properly cited.

- [ ] **Step 9: Commit**

```bash
git add ai.html
git commit -m "fix: ai.html — text-size controls, term a11y wiring, timeline mobile-stacking, focus-pane trims, and 2 content additions"
```

---

## Task 4: `us-elections.html` — Shared Component Fixes

**Files:**
- Modify: `us-elections.html`

**Context:** This page already has `.tl-item` mobile-stacking. It's missing text-size-controls and `.term` `aria-describedby` only. The SVG color-token nit is optional/low-priority per the design doc.

- [ ] **Step 1: Read the reference implementations and this page's current state**

Same pattern as prior tasks. Confirm `.tl-item` mobile-stacking is genuinely already present (per the audit) before skipping that step.

- [ ] **Step 2: Add text-size controls** (same pattern as Task 1 Step 2, applied to `us-elections.html`)

- [ ] **Step 3: Wire `aria-describedby` on all `.term` spans** (same pattern as Task 1 Step 3, applied to `us-elections.html`)

- [ ] **Step 4 (optional): SVG diagram color-token refactor**

Only if it can be done with zero visual-regression risk: replace the checks-and-balances SVG diagram's hardcoded hex colors with references to this page's CSS custom properties. If there's any doubt about visual-regression risk, skip this step and note it in your report — it's explicitly optional.

- [ ] **Step 5: Verify**

Same checklist as Task 1 Step 9 (citation count, div/tag balance, duplicate-id check, browser open, tab-through of `.term` spans, text-size-control check).

- [ ] **Step 6: Commit**

```bash
git add us-elections.html
git commit -m "fix: us-elections.html — text-size controls and term a11y wiring"
```

---

## Task 5: `immigration.html` — `aria-describedby` + Page-Specific Findings

**Files:**
- Modify: `immigration.html`

**Context:** This page already has text-size-controls and `.tl-item` mobile-stacking. It's missing only `.term` `aria-describedby` wiring, plus two small page-specific findings.

- [ ] **Step 1: Read `gun-violence.html`'s `.term` pattern and this page's current `.term` markup, footer, and ICE-arrest `.perspectives` box**

- [ ] **Step 2: Wire `aria-describedby` on all `.term` spans** (same pattern as Task 1 Step 3, applied to `immigration.html` — confirm text-size-controls and timeline-stacking are genuinely already present before skipping those)

- [ ] **Step 3: Add the missing Konami-code footer teaser**

Read `us-elections.html`'s existing small `.secret-text` teaser line near its footer. Add an equivalent line to `immigration.html`'s footer, matching copy style/placement.

- [ ] **Step 4: Add a neutral labeling note for DHS in the ICE-arrest `.perspectives` box**

Read the existing box — AIC is currently labeled as an advocacy organization; DHS is not given an equivalent neutral label. Add a brief, evenhanded labeling note for DHS's side (e.g., noting it's the government agency whose own enforcement actions are being discussed), matching the tone/brevity of AIC's existing label. Do not change either side's actual quoted content or position.

- [ ] **Step 5: Verify**

Same checklist as Task 1 Step 9.

- [ ] **Step 6: Commit**

```bash
git add immigration.html
git commit -m "fix: immigration.html — term a11y wiring, Konami teaser, and DHS labeling consistency"
```

---

## Task 6: `climate-change.html` — Add `.term`, Points/Quiz/Egg Engine, and Text-Size Controls

**Files:**
- Modify: `climate-change.html`

**Context:** This is the largest task in this plan, sequenced last so its implementer has maximum context from having seen the same component patterns applied four times already (Tasks 1-4). This page currently has NONE of: `.term` tooltips, the points/quiz/egg JS engine, or text-size controls — it only has the redesign's visual/token layer and a simple inline toggle-quiz. Per the design doc, `.stat-trio`/`.focus-pane` are explicitly OUT of scope for this task — this is an accessibility/functionality floor fix, not a visual rebuild.

- [ ] **Step 1: Read the reference implementations in full**

Read `gun-violence.html`'s complete `.term`/`aria-describedby` CSS+JS+markup pattern, complete points/quiz/egg JS engine (quiz modal, `openQuiz`/`handleAnswer`/`addPoints`/`showToast`, easter eggs), and text-size-controls implementation. Read `climate-change.html`'s current simple inline toggle-quiz (`toggleQuiz()`/`answerQuiz()`) in full — this will be replaced, not left alongside the new system.

- [ ] **Step 2: Add text-size controls** (same pattern as Task 1 Step 2, applied to `climate-change.html`)

- [ ] **Step 3: Identify jargon terms currently handled via `.vocab` boxes and convert to `.term` tooltips where appropriate**

Read every existing `.vocab` callout box on this page (e.g., "Milankovitch cycles," "climate proxy"). For terms that are used inline in prose before their `.vocab` box appears, add a `.term` tooltip at first use (with `aria-describedby`/`.term-desc` from the start, matching `gun-violence.html`'s pattern exactly — do not add the tooltip without the aria wiring and retrofit it later). Keep the `.vocab` boxes as-is for their existing purpose (deeper explanation) — `.term` and `.vocab` can coexist, matching how other pages on the site use both.

- [ ] **Step 4: Port the points/quiz/egg JS engine**

Port `gun-violence.html`'s quiz-modal system (replacing this page's existing simple inline toggle-quiz — convert each existing quiz question into the modal-quiz format, preserving every question's exact text and correct answer), points bar, and at least the Konami-code easter egg (additional eggs like flag-click/stat-click are a nice-to-have if time allows, but the Konami code and points-bar/quiz-modal core are the minimum bar to match the site's standard). Set `MAX_PTS` correctly to match the true number of obtainable points (trace every `addPoints()` call, following the exact verification method used on `gun-violence.html`'s Task 13/17 — do not guess).

- [ ] **Step 5: Add `.tl-item` mobile-stacking** (same pattern as Task 1 Step 4, applied to `climate-change.html`)

- [ ] **Step 6: Verify**

Citation count before/after (must not decrease). Div/tag balance. Duplicate-id check (this task adds many new ids — quiz modal, term-desc spans — check carefully). Open in browser: confirm quizzes work end-to-end (open, answer, get feedback, points update), confirm text-size controls work, confirm `.term` tooltips work on hover/focus/tab, confirm the Konami code triggers correctly, confirm the old inline toggle-quiz system is fully removed (no leftover dead JS/CSS from it).

- [ ] **Step 7: Commit**

```bash
git add climate-change.html
git commit -m "feat: climate-change.html — add term tooltips, points/quiz/egg engine, and text-size controls to reach site component floor"
```

---

## Task 7: Full Cross-Page Verification Pass

**Files:**
- Verify only: `iran.html`, `ukraine.html`, `climate-change.html`, `ai.html`, `us-elections.html`, `immigration.html`

**Context:** After all six pages are fixed, this task is a fresh, independent pass confirming the whole batch is internally consistent and nothing regressed.

- [ ] **Step 1: Confirm component parity across all 6 pages**

For each page, confirm: text-size-controls present and functional, every `.term` span has a matching `aria-describedby`/`.term-desc` pair with byte-identical text to its `data-def`, `.tl-item` has the mobile-stacking media query (where the page has a timeline). Build a simple table of pass/fail per page/component and confirm all cells pass.

- [ ] **Step 2: Confirm no citation counts decreased on any page**

For each page, compare citation-link count against this task's starting commit for that page (from `git log`/`git diff` against the base each page's task started from). Confirm every page's count is unchanged or increased, never decreased.

- [ ] **Step 3: Confirm no duplicate `id` attributes on any page**

Run a full-document `id=` census on each of the 6 files. Confirm zero duplicates on each.

- [ ] **Step 4: Spot-check each page-specific fix**

Re-read each page-specific fix listed in the design doc (iran's callout + citation swap + nav link + dead-CSS removal; ukraine's Bucha prompt + stat-trio override; ai's focus-pane trims + 2 additions; us-elections' optional SVG fix; immigration's Konami teaser + DHS labeling) directly in the final file state, confirming each was actually applied as described.

- [ ] **Step 5: Nonpartisanship spot-check on new prose**

Re-read every new sentence/paragraph added across all 6 pages (the new callouts, the new subsection on ai.html, the new counter-perspective, the new labeling note) with the party-swap test in mind. Confirm nothing added in this pass introduces an unintended lean.

- [ ] **Step 6: Browser check**

Open each of the 6 pages. Confirm no visual regression, confirm text-size controls and `.term` tooltips work on each, confirm climate-change.html's new quiz/points system works end-to-end.

- [ ] **Step 7: Commit (if Step-1-6 surfaced any fixes)**

If this verification pass finds and fixes any issue, commit it with a clear message describing what was found and fixed. If nothing needed fixing, no commit is needed for this task — just document the clean pass in the task report.

---

## Self-Review Notes

- **Spec coverage**: every finding in the design doc (5 site-wide findings, plus all page-specific findings for iran/ukraine/ai/us-elections/immigration) maps to a task above. `climate-change.html`'s `.stat-trio`/`.focus-pane` additions are explicitly excluded per the design doc's stated out-of-scope list.
- **Placeholder scan**: no task contains a deferred/TBD step — every step has concrete instructions and a named reference file to port from.
- **Sequencing**: Tasks 1-4 (mechanical shared fixes) intentionally precede Task 6 (climate-change's larger build) per the project owner's explicit sequencing decision, so that pattern is well-proven before the largest task uses it. Task 5 (immigration) is placed after Task 4 since it needs only one of the three shared fixes. Task 7 (verification) runs last, after every content-touching task, matching this project's standing ordering discipline.

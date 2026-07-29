# Task 7 Report — Full Cross-Page Verification Pass

**Status:** DONE_WITH_CONCERNS
**Scope:** Fresh, independent verification pass over `iran.html`, `ukraine.html`, `climate-change.html`, `ai.html`, `us-elections.html`, `immigration.html` at HEAD `360844c`, per `.superpowers/sdd/task-7-brief.md` and the design doc `docs/plans/2026-07-28-site-wide-persona-audit-design.md`.

**Provenance note:** This worktree already contained a `task-7-report.md` and `task-8-report.md` from an unrelated prior project (an "Immigration update-pane / differing-perspectives component" build and a "Washington's Immigration Story" section — neither matches this batch's Task 7 brief). This appears to be the same kind of filename collision Task 1's report flagged for `task-1-report.md`. This file **replaces** that unrelated content with the real Task 7 (verification-pass) report; the prior content is preserved in git history if it's still needed elsewhere.

**One fix made and committed this pass** — see "Fix found and applied" below.

---

## Step 1 — Component-parity pass/fail table

| Page | text-size-controls | `.term` aria-describedby wired | `.tl-item` mobile-stacking |
|---|---|---|---|
| iran.html | PASS (byte-identical `.a11y-controls` markup) | PASS (2/2 spans wired, byte-identical `data-def`/`.term-desc` text) | PASS (verbatim media rule present) |
| ukraine.html | PASS | PASS (12/12 spans wired) | PASS |
| climate-change.html | PASS | PASS (6/6 spans wired — see fix below) | PASS |
| ai.html | PASS | PASS (12/12 spans wired) | PASS |
| us-elections.html | PASS | N/A — confirmed zero `.term` spans in body content (previously confirmed twice; re-confirmed this pass). Not a gap. | PASS |
| immigration.html | PASS | PASS (20/20 spans wired) | PASS |

All 6 pages carry **byte-identical** `.a11y-controls`/`.text-size-controls` HTML, `.term-desc` visually-hidden CSS, and `.tl-item` mobile media-query text — confirmed with direct string diffs, not just presence checks. This is strong evidence of a clean verbatim port, not independent reimplementations that happened to converge.

Every `.term` span across all 5 applicable pages also carries `tabindex="0"` (keyboard-focusable), confirmed by count match against total span count on each page.

`climate-change.html`'s `.stat-trio`/`.focus-pane` absence is confirmed intentional out-of-scope per the design doc (Finding 5) — not flagged as a gap.

## Step 2 — Citation counts (never decreased)

Compared `cite-inline` link counts (and, as a cross-check, all `target="_blank"` outbound links) against each page's actual pre-task base commit:

| Page | Base commit | cite-inline before → after | outbound links before → after |
|---|---|---|---|
| iran.html | `f5c0f31` | 61 → 62 | 118 → 119 |
| ukraine.html | `bf3918a` | 32 → 32 | 61 → 61 |
| ai.html | `1506c65` | 12 → 14 | 82 → 88 |
| us-elections.html | `868b27d` | 84 → 84 | 122 → 122 |
| immigration.html | `5ed273c` | 75 → 75 | 118 → 118 |
| climate-change.html | `214cc7f` | 35 → 35 | 46 → 46 |

All 6 pages: unchanged or increased, none decreased.

## Step 3 — Duplicate `id` census

Ran a full `id="..."` census on each of the 6 files. **Zero duplicates on every page.**

## Step 4 — Page-specific fix spot-checks (read directly in final file, not trusted from prior reports)

- **iran.html**
  - Elementary-school-strike callout: confirmed present at line 506, `<div class="callout"><span class="tag">A heavy early loss</span>...`, PBS-cited, includes the Israeli military's denial (balanced). PASS.
  - Wikipedia citation swap: **not swapped** — both casualty citations still point to Wikipedia. Confirmed this is a documented, compliant "leave as-is" outcome (Task 1's own report documents the WebFetch/WebSearch attempts and the brief's explicit "don't force a weak substitution" instruction). Not a regression, but noting it's an open opportunity if a future pass has search budget.
  - Cross-page nav link to `climate-change.html`: confirmed present (`<a href="climate-change.html">Climate Change</a>`). PASS.
  - `.hidden-egg`/`.hidden-section` dedup: confirmed only `.hidden-section` remains in both CSS and markup (3 usages); `.hidden-egg` fully removed. PASS.
- **ukraine.html**
  - Bucha "Think about it" prompt: confirmed present immediately after the Bucha passage and pull-quote, matching the page's existing prompt style. PASS.
  - `.update-box .stat-trio` dark-mode override: confirmed present (line 243-246). Per given context this predates the batch (git-blame confirmed separately) — verified present, not claimed as new.
- **ai.html**
  - Focus-pane trims: confirmed 4 focus-panes remain (`school`, `animals`, `hinton`, `agentic`) — School and Agentic AI were trimmed for length per the brief, not removed as panes (design doc's fix was explicitly length-trim, not deletion). Consistent with brief.
  - Misinformation/academic-integrity subsection: confirmed new subsection present ("Two problems that come with the territory" — cheating via generative AI + teens fooled by AI-deepfakes, both citing 2024/later Common Sense Media surveys). PASS.
  - Regulation counter-perspective: confirmed present inside the Hinton focus-pane (`.perspectives` block, lines 763-773) — Hinton's "regulate now" position paired with a Stanford SETR researcher counter-view on regulation costs/tradeoffs, each independently sourced and cited. Reflects the additional narrowing fix from commit `868b27d`. PASS.
- **us-elections.html**
  - SVG color-token refactor: confirmed still hardcoded hex, **not** refactored. Confirmed via Task 4's own report this was a deliberate, reasoned skip under the brief's explicit optionality clause (no token exists in `:root` for 3 of 9 SVG colors; refactoring would require inventing new tokens, which was out of the brief's stated zero-risk bar). Correctly deferred, not an oversight.
- **immigration.html**
  - Konami-code teaser: confirmed present (`💡 Teacher tip: Try the Konami code on this page ↑↑↓↓←→←→BA`), matching `us-elections.html`'s copy/placement pattern exactly. PASS.
  - DHS neutral-labeling note: confirmed present in the ICE-arrest `.perspectives` box — DHS's entry now opens with "DHS is the federal department that oversees ICE — the government agency whose own enforcement actions are the subject of this dispute," directly parallel to AIC's existing "immigrant-rights research and advocacy group" label. PASS.

## Step 5 — Nonpartisanship spot-check (party-swap test) on all new prose

Read each new passage directly in the final file:

- **iran.html callout** (153 civilians / girls' elementary school): attributes the death toll to Iran's own report and includes the Israeli military's denial in the same short callout. No unattributed editorializing. Clean.
- **ukraine.html Bucha "Think about it" prompt**: reflective/pedagogical framing ("why do journalists... keep documenting"), not a claim about any party or government's current policy. Foreign-conflict historical content, not U.S. domestic-partisan; reads clean regardless.
- **ai.html misinformation/academic-integrity subsection**: survey-statistic reporting (Common Sense Media, dated), no policy or partisan framing at all. Clean.
- **ai.html regulation counter-perspective**: Hinton's "regulate now" view and the Stanford SETR "regulate carefully" view are each given roughly equal length/specificity and cited to that side's own source (Hinton's podcast interview; the Stanford SETR 2025 report with a direct quote). Neither is filtered through the other's framing. A closing small-note flags that even AI researchers close to the field's founding (Fei-Fei Li) disagree — genuinely balanced, not token. Clean.
- **immigration.html DHS labeling sentence**: adds a structurally parallel, factual label ("the government department that oversees ICE... the agency whose own enforcement actions are the subject of this dispute") without characterizing DHS's credibility either way — matches AIC's equally neutral, factual label ("immigrant-rights research and advocacy group"). Both sides retain their own direct quotes/statistics with equal length and specificity. Clean.

No new lean introduced by any addition in this batch, read together.

## Step 6 — Browser check

**No browser or headless-browser tool was available anywhere in this session.** This limitation is stated honestly rather than claimed away: no interactive/visual confirmation of text-size-control clicks, `.term` tooltip hover/focus behavior, or climate-change.html's quiz/points/egg flow end-to-end was performed. In its place, the following **static/structural** verification was done, which is the strongest substitute available in this environment:

- Full document tag-balance check (Python `html.parser`-based) on all 6 files: **0 errors, empty stack at EOF** on every page — confirms no unclosed/mismatched tags from any of the batch's edits.
- `node --check` syntax validation on every inline `<script>` block across all 6 pages (8 script blocks total): **all pass**, including climate-change.html's new points/quiz/egg engine (2 script blocks).
- climate-change.html quiz wiring: all 8 `openQuiz('qN')` trigger calls (`q1`–`q8`) have a matching key in the `quizzes` object — no orphaned triggers, no unused quiz entries.
- climate-change.html points/localStorage engine: `setTextSize`, `openQuiz`, `showEgg`, `toggleDyslexic`, and `localStorage` persistence for both text-size and dyslexic-font settings all present and referenced consistently.
- All `.term` spans confirmed keyboard-focusable (`tabindex="0"`) on every applicable page.

**Recommend a follow-up manual browser pass** (open each of the 6 pages, click through text-size buttons, tab through a few `.term` spans, and click through climate-change.html's quiz end-to-end) once a browser tool becomes available in this environment — this report cannot substitute a genuine interactive check, only a rigorous static one.

## Fix found and applied

**climate-change.html — `data-def`/`.term-desc` text mismatch (byte-identity violation).** The brief's Step 1 explicitly requires `.term` spans' `data-def` attribute and their paired `.term-desc` span to be byte-identical. A script comparing all `.term` spans' `data-def` text against their linked `.term-desc` span text (matched by `aria-describedby` → `id`) found exactly one mismatch, on the `cap-and-invest` term (id `term-desc-5`): the `data-def` attribute used single/straight scare-quotes (`'cap'`, `'invest'`) while the visible `.term-desc` span used double straight quotes (`"cap"`, `"invest"`) — a copy/paste drift introduced when the two were authored together, not a pre-existing issue (this term didn't exist before Task 6). Every other `.term` span on all 6 pages (46 spans total) passed the byte-identity check cleanly.

**Fix:** edited the `data-def` attribute to use `&quot;` (matching the double-quote style used in the visible `.term-desc` text and consistent with the page's own later use of `"allowances"` in the same paragraph). Re-ran the comparison script after the edit: 0 mismatches remain across all 6 pages.

This is a screen-reader-facing accessibility text consistency issue (a screen-reader user tabbing to the term would hear a subtly different rendering of the quote characters than a sighted user hovering the tooltip would see) — minor but real, and exactly the kind of drift a fresh whole-batch pass is meant to catch.

## Verification performed (this pass)

- `.term`/`.term-desc` byte-identity check via a Python script matching `data-def` ↔ `aria-describedby`/`id` pairs across all 6 files (`html.unescape`-normalized comparison) — found and fixed 1 mismatch (above), 0 remaining.
- Full-document `id=` census, all 6 files: 0 duplicates.
- `cite-inline` and outbound-link (`target="_blank"`) counts, each page vs. its actual pre-task base commit: none decreased, 3 of 6 increased.
- Full HTML tag-balance parse (Python `html.parser`), all 6 files: 0 errors.
- `node --check` on all 8 inline `<script>` blocks across the 6 files: 0 syntax errors.
- Direct byte-for-byte comparison of the ported `.a11y-controls` HTML, `.term-desc` CSS, and `.tl-item` mobile media-query text across all 6 files: identical everywhere.
- Direct re-read (not trusted from prior task reports) of every page-specific fix listed in the design doc, in the final file state.
- Direct re-read of every new sentence/paragraph added by this batch, applying the party-swap test.

## Concerns (why DONE_WITH_CONCERNS, not DONE)

1. **Design-doc Finding 1 (update-pane grounding clauses) was never assigned to any task in this batch and was not implemented on any of the 5 applicable pages.** Checked all 6 task briefs (`task-1-brief.md` through `task-6-brief.md`) directly: none contain a step for auditing/adding jargon-grounding clauses to any update-pane, despite the design doc listing it as the *first* site-wide finding (confirmed on 5 of 6 pages by the original persona review) and explicitly citing gun-violence.html's Task 16 as the proven precedent technique to reuse. Spot-checked `iran.html`'s update-pane directly: it opens with dense terms ("Revolutionary Guard," "Strait of Hormuz," ceasefire mechanics) with no grounding clauses added at first use, consistent with the finding never having been addressed. This is a real gap between the design doc and the six task briefs that were actually written and executed — not a regression from this pass, and not something Task 7 (verification-only) is scoped to fix itself, but it should be flagged for the project owner as unresolved scope, likely needing its own follow-up task.
2. **iran.html's update-pane mini-timeline uses the literal label "Now"** (`<span class="mini-tl-date">Now</span>`, paired with "Fighting continues") as a timeline-entry date. This directly matches the project's own standing convention violation pattern (no "now"/"currently" without an explicit date). Confirmed via `git show f5c0f31:iran.html` that this predates Task 1 / this entire batch — it is not something this batch introduced, and it's outside this batch's assigned scope (none of the 6 task briefs touch update-pane mini-timeline content). Flagging for awareness, not claiming as a batch regression.
3. **iran.html's Wikipedia casualty citations remain unswapped.** Documented, compliant "leave as-is" per the brief's own instruction (Task 1 attempted a swap, hit WebFetch/WebSearch budget limits, correctly declined to force a weak substitution) — not a defect, but worth another attempt in a future pass with fresh search budget.
4. **No live/interactive browser verification was possible in this session** (no browser tool available at all, not just no headless Chrome). All Step 6 verification is static/structural, as detailed above. This should not be read as equivalent to an actual interactive pass — a follow-up manual check is recommended before treating the batch as fully closed.
5. This worktree contained stale, unrelated `task-7-report.md`/`task-8-report.md` content from a different project (noted above) — flagging in case the original content is still needed and was only supposed to live elsewhere.

## Commit

`data-def` byte-identity fix on `climate-change.html` committed as a standalone commit (see git log) — this is the only content change made by this verification pass; all other findings above were either confirmed-clean or flagged as pre-existing/out-of-scope rather than fixed.

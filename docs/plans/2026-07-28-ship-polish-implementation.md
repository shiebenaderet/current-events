# Ship-Readiness Visual Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the concrete image-coverage and visual-consistency gaps found in a site-wide audit — add missing images to `us-elections.html` (4 sections), `ukraine.html` (1 section), and `ai.html` (4 focus-panes), give `climate-change.html` its own distinct accent color, and port the graceful image-error-fallback pattern to every page that lacks it.

**Architecture:** Task 1 fixes `us-elections.html` (largest single-page gap: 4 sections, 4 new images). Task 2 fixes `ukraine.html` (1 new image). Task 3 fixes `ai.html` (4 new images across 4 focus-panes). Task 4 gives `climate-change.html` its own accent color (a CSS-token-only change). Task 5 ports the `onerror` fallback pattern to all 5 pages that lack it (a mechanical, low-risk pass that runs last so it also covers the images added in Tasks 1-3). Task 6 is a final cross-page verification pass.

**Tech Stack:** Plain HTML/CSS/JS, no build step. Verification is manual: grep checks, file-existence checks, div/tag balance, browser opens.

## Global Constraints

- **Image sourcing, non-negotiable**: Wikimedia Commons only. Verify license (public domain or CC) AND subject match directly on the image's own Commons file page — never from a search-result thumbnail or an embedding article. No incident-specific, graphic, or otherwise inappropriate imagery for a middle-school audience.
- Every new image gets real alt text describing its actual subject, and a caption/credit line crediting Wikimedia Commons and the license — match that specific page's own existing image-credit markup pattern exactly (read the page's existing images first; don't assume the pattern is identical across pages).
- Citation counts must not decrease on any page touched by this plan (none of these tasks should touch citations at all — this is a safety check, not an expected source of change).
- Div/tag balance and no duplicate `id`s on every page after edits.
- Every `src="images/...` path added or modified must point to a real file that exists in `/images` at commit time.
- This is an images-and-one-CSS-token pass — no prose, claim, or citation should be added or changed by any task in this plan, except where a new image's own caption/credit text is required.
- Apply this project's date-specificity discipline to any new text (captions/credits shouldn't need "now"/"currently" language, but if any incidental text is touched, the rule still applies).

---

## Reference Files

- **Design doc:** `docs/plans/2026-07-28-ship-polish-design.md`
- **`onerror` fallback pattern reference (working, proven implementation):** `immigration.html` and `gun-violence.html` — both variants exist (section-image `onerror="this.style.display='none'"` and person-photo `onerror="this.outerHTML='<div class=\'emoji-fallback\'>...</div>'"`). Read the real markup directly, don't assume from this description.
- **Pages to modify:** `us-elections.html`, `ukraine.html`, `ai.html`, `climate-change.html` (image/accent additions), plus `iran.html` (onerror port only, Task 5)

---

## Task 1: `us-elections.html` — Add Images to 4 Gap Sections

**Files:**
- Modify: `us-elections.html`

**Context:** This page has only 3 `<img>` tags total; `#branches`, `#elections-mechanics`, `#checks-balances`, and `#local-representation` all have zero images, unlike every other section on the site.

- [ ] **Step 1: Read the page's existing image markup pattern**

Read `us-elections.html`'s 3 existing `<img>` tags (in Timeline and Key People) to confirm the exact markup/caption/credit pattern this page uses before adding new images in the same style.

- [ ] **Step 2: Source and verify 4 images**

For each of the 4 gap sections, find a real, licensed, subject-appropriate Wikimedia Commons image:
- `#branches` — U.S. Capitol dome or Supreme Court building exterior (a real photo, complementing the section's existing SVG diagram, not duplicating it).
- `#elections-mechanics` — a real polling-place photo (voting booths, ballot drop box).
- `#checks-balances` — a Senate or House floor-in-session photo, or the Supreme Court's courtroom interior.
- `#local-representation` — the Washington State Legislative Building in Olympia (this repo already has `images/card-wa-capitol.jpg`, used on other pages — reuse it here if it genuinely fits; it's the same real building and directly relevant to this section's "who represents Alderwood" content) or a Snohomish/King County ballot-drop-box photo.

For each candidate, open its own Commons file page directly and confirm: license is public domain or CC, subject genuinely matches. Reject and find another if either check fails. These are starting-point suggestions, not mandates — substitute a different real, well-sourced subject if a better fit turns up.

- [ ] **Step 3: Add the image markup**

Insert each verified image into its section using this page's existing markup pattern (from Step 1), with accurate alt text and a properly formatted Commons credit/license line.

- [ ] **Step 4: Verify**

Confirm all 4 new images render (file exists at the referenced path). Confirm div/tag balance unchanged aside from the intentional new image blocks. Confirm no citation was added/removed.

- [ ] **Step 5: Commit**

```bash
git add us-elections.html
git commit -m "feat: add images to us-elections.html's 4 previously image-free sections"
```

---

## Task 2: `ukraine.html` — Add Image to `#empire` Section

**Files:**
- Modify: `ukraine.html`

**Context:** `#empire` (covering Shevchenko, serfdom, and the 1917-1921 independence period) is a pure three-paragraph text wall with no image, unlike every other section on this page.

- [ ] **Step 1: Read the page's existing image markup pattern**

Read `ukraine.html`'s existing `<img>` tags in nearby sections (e.g. `#roots`, `#holodomor`) to confirm the exact markup/caption/credit pattern.

- [ ] **Step 2: Source and verify one image**

Find a real, licensed, subject-appropriate Wikimedia Commons image related to Taras Shevchenko, Ukrainian serfdom, or the 1917-1921 independence period — a real historical photo or period painting, not a generic/unrelated stock image. Verify license and subject match directly on the image's own Commons file page.

- [ ] **Step 3: Add the image markup**

Insert into `#empire` using this page's existing pattern, with accurate alt text and credit line.

- [ ] **Step 4: Verify**

Confirm the image renders (file exists). Confirm div/tag balance and citation count unchanged aside from the intentional addition.

- [ ] **Step 5: Commit**

```bash
git add ukraine.html
git commit -m "feat: add image to ukraine.html's previously image-free #empire section"
```

---

## Task 3: `ai.html` — Add Images to 4 Focus-Panes

**Files:**
- Modify: `ai.html`

**Context:** `#school`, `#animals`, `#hinton`, and `#agentic` — four consecutive `.focus-pane` deep-dives — currently have zero images among them, the worst "text wall" stretch found on the site.

- [ ] **Step 1: Read the page's existing image markup pattern, including for dark `.focus-pane` backgrounds**

Read `ai.html`'s existing `<img>` tags elsewhere on the page (outside the focus-panes) to confirm the base pattern. Since `.focus-pane` has a dark background, also check whether this page (or `ukraine.html`'s `.focus-pane` Holodomor section, which does use a photo-break inside a dark panel) has an established convention for images inside dark panels — reuse that convention rather than inventing new CSS.

- [ ] **Step 2: Source and verify 4 images**

- `#school` — a classroom/student-with-device photo, matching the section's AI-and-schoolwork subject.
- `#animals` — a real photo from an animal-communication-research context (a research setting or an animal being studied, not a cartoon/illustration).
- `#hinton` — check first whether a Geoffrey Hinton portrait already exists elsewhere on this page (per this page's earlier build history) and could be reused here; if not available/appropriate, source a neural-network/AI-research-lab photo instead.
- `#agentic` — a real photo representing autonomous/agentic computing or robotics (not a sci-fi stock image).

Verify each candidate's license and subject match directly on its own Commons file page. These are starting-point suggestions — substitute a better-fitting real, well-sourced subject if one turns up.

- [ ] **Step 3: Add the image markup**

Insert each verified image into its respective focus-pane, following the dark-panel image convention identified in Step 1, with accurate alt text and credit line legible against the dark background.

- [ ] **Step 4: Verify**

Confirm all 4 images render (files exist). Confirm div/tag balance and citation count unchanged aside from the intentional additions. Confirm caption/credit text is legible against the dark `.focus-pane` background (check contrast against the existing dark-panel text-color CSS).

- [ ] **Step 5: Commit**

```bash
git add ai.html
git commit -m "feat: add images to ai.html's 4 previously image-free focus-panes"
```

---

## Task 4: `climate-change.html` — Give It a Distinct Accent Color

**Files:**
- Modify: `climate-change.html`

**Context:** This page currently shares the default red accent (`#a02c2c`) with `iran.html`/`ukraine.html`/`ai.html`, while `us-elections.html` (navy/gold), `immigration.html` (teal), and `gun-violence.html` (pewter) each have their own distinct accent. This is a CSS-token-only change — no layout, typography, or content changes.

- [ ] **Step 1: Read the page's current `--accent`/`--accent-ink` CSS custom properties**

Confirm the exact variable names and every place they're referenced (search `--accent` in the file) before changing the value, to ensure the new color propagates everywhere the old one did.

- [ ] **Step 2: Choose and apply a distinct green/earth-tone accent**

Pick a green/earth-tone accent color that fits the climate subject and doesn't collide with the site's existing 6 accents (red `#a02c2c`, navy/gold `#1a2a52`, teal `#2c6e6b`, pewter `#5a6169` — teal and green are close, so verify the new choice is visually distinct from `immigration.html`'s teal, not just numerically different). Update `--accent` and `--accent-ink` (or equivalent) to the new values. Do not touch any other CSS, layout, or content.

- [ ] **Step 3: Verify**

Open the page in a browser. Confirm the new accent renders consistently everywhere the old one did (nav, links, stat numbers, citation links, etc.) with no leftover hardcoded instances of the old red hex value anywhere in the file (grep for `#a02c2c` after the change — should be zero results, confirming the color was token-driven and not hardcoded anywhere).

- [ ] **Step 4: Commit**

```bash
git add climate-change.html
git commit -m "style: give climate-change.html its own distinct accent color"
```

---

## Task 5: Port `onerror` Image-Fallback Pattern to All 5 Remaining Pages

**Files:**
- Modify: `iran.html`, `ukraine.html`, `climate-change.html`, `ai.html`, `us-elections.html`

**Context:** Only `immigration.html` and `gun-violence.html` currently have graceful image-load-failure fallbacks. This task ports that pattern to the other 5 pages — including the new images added by Tasks 1-3, since this task runs last.

- [ ] **Step 1: Read the reference pattern**

Read `immigration.html`'s or `gun-violence.html`'s actual `onerror` markup for both variants: section/content images (`onerror="this.style.display='none'"`) and person/Key-People photos (`onerror="this.outerHTML='<div class=\'emoji-fallback\'>...</div>'"` with an appropriate emoji per person). Confirm the exact syntax directly from the file.

- [ ] **Step 2: Apply to every `<img>` tag on all 5 pages**

For `iran.html`, `ukraine.html`, `climate-change.html`, `ai.html`, and `us-elections.html`: add the appropriate `onerror` attribute to every `<img>` tag (including the new ones added by Tasks 1-3, if this task runs after them). Use the section-image variant for general content photos and the person-photo/emoji variant for Key People portraits — matching how `immigration.html`/`gun-violence.html` distinguish between the two, not a single one-size-fits-all choice. Pick a reasonable, on-topic emoji for each Key People photo's fallback (matching the pattern's existing examples, e.g. an appropriate symbol for that historical figure's role).

- [ ] **Step 3: Verify**

Grep each of the 5 files for `<img` and confirm every single occurrence now has an `onerror` attribute — zero `<img>` tags without one. Confirm div/tag balance unchanged aside from the added attributes (attributes don't add tags, so balance should be identical to before this task).

- [ ] **Step 4: Commit**

```bash
git add iran.html ukraine.html climate-change.html ai.html us-elections.html
git commit -m "fix: port graceful image-load-failure fallback to all remaining pages"
```

---

## Task 6: Final Cross-Page Verification Pass

**Files:**
- Verify only: `us-elections.html`, `ukraine.html`, `ai.html`, `climate-change.html`, `iran.html`

**Context:** Fresh, independent confirmation that all 5 touched pages are internally consistent and nothing regressed.

- [ ] **Step 1: Confirm every new/modified image file exists**

For all images added across Tasks 1-3, confirm the referenced file genuinely exists in `/images` (not just that the markup looks right).

- [ ] **Step 2: Confirm `onerror` coverage is complete**

Re-verify Task 5's claim: grep all 5 pages for `<img` without a matching `onerror` — should be zero results across all 5 files.

- [ ] **Step 3: Confirm climate-change.html's accent change is complete and consistent**

Grep the file for the old hex value — should be zero results. Open in a browser and spot-check the new accent renders on nav links, citation links, and stat numbers.

- [ ] **Step 4: Confirm no citation counts decreased on any of the 5 pages**

Compare each page's citation-link count against this task's starting commit for that page.

- [ ] **Step 5: Confirm no duplicate `id` attributes on any of the 5 pages**

Full-document `id=` census on each file.

- [ ] **Step 6: Browser check**

Open all 5 pages. Confirm no visual regression, confirm new images render and look appropriately placed/sized, confirm climate-change.html's new accent looks intentional and cohesive.

- [ ] **Step 7: Commit (if Steps 1-6 surfaced any fixes)**

If this verification pass finds and fixes any issue, commit it with a clear message. If nothing needed fixing, no commit needed — document the clean pass in the task report.

---

## Self-Review Notes

- **Spec coverage**: every gap identified in the design doc (4 gap sections on us-elections.html, 1 on ukraine.html, 4 on ai.html, climate-change.html's shared accent, the onerror-fallback gap on 5 pages) maps to a task above.
- **Placeholder scan**: no task contains a deferred/TBD step — every step has concrete instructions and named reference files to work from. Image subjects are explicitly flagged as starting-point suggestions to verify/refine at implementation time, not placeholders.
- **Sequencing**: Task 5 (onerror port) runs after Tasks 1-3 (new images) specifically so it also covers the newly-added images, avoiding a second pass.

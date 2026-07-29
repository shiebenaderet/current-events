# Ship-Readiness Visual Polish — Design Document

**Date:** July 28, 2026
**Type:** Cross-page fix pass (no new pages) — `us-elections.html`, `ukraine.html`, `ai.html`, `climate-change.html`, plus a small error-handling port to `iran.html`/`ukraine.html`/`climate-change.html`/`ai.html`/`us-elections.html`
**Related:** Follows directly from the `2026-07-28-site-wide-persona-audit` effort (v2.7.0) — this is a focused image-coverage and visual-consistency pass, not another persona review.

---

## Concept

The project owner asked for a final "does every page look great and ship-ready" pass, specifically calling out image coverage. A research audit (subagent, read-only, no edits) confirmed: no page has a broken or missing image file — every referenced image exists on disk. But four real, concrete gaps exist:

1. `us-elections.html` has only 3 `<img>` tags total; four of its main content sections (`#branches`, `#elections-mechanics`, `#checks-balances`, `#local-representation`) have zero images.
2. `ukraine.html`'s `#empire` section (Shevchenko, serfdom, 1917 independence — three paragraphs) is a pure text wall with no image, stat box, or callout, unlike every other section on that page.
3. `ai.html` has four consecutive image-free `.focus-pane` deep-dives (`#school`, `#animals`, `#hinton`, `#agentic`) — the single worst "text wall" stretch found on the site.
4. `climate-change.html` still uses the shared default red accent (`#a02c2c`), the same color as `iran.html`/`ukraine.html`/`ai.html` — while `us-elections.html`, `immigration.html`, and `gun-violence.html` each got a deliberate, distinct accent. This reads as unfinished, especially since `climate-change.html` was originally intended as this site's editorial-redesign reference page.

A fifth, non-visual but real gap: only `immigration.html` and `gun-violence.html` use an `onerror` fallback on their `<img>` tags (graceful degradation to a hidden element or emoji fallback if an image fails to load). The other five pages (`iran.html`, `ukraine.html`, `climate-change.html`, `ai.html`, `us-elections.html`) have no fallback — a broken image on any of them would show a broken-image icon to a visitor. This is cheap to fix and directly serves "ready to ship."

## Scope

**In scope:**
- Source and add genuine, verified, appropriately-licensed images for `us-elections.html`'s 4 gap sections, `ukraine.html`'s `#empire` section, and `ai.html`'s 4 focus-panes (9 new images total, following this site's established sourcing discipline: Wikimedia Commons, license + subject verified on the image's own file page, non-graphic/appropriate for the surrounding content).
- Give `climate-change.html` its own distinct accent color, chosen to fit the subject (a green/earth-tone direction fits climate content well and doesn't collide with any of the site's 6 other current accents).
- Port the `onerror` fallback pattern (already proven on `immigration.html`/`gun-violence.html`) to every `<img>` tag on `iran.html`, `ukraine.html`, `climate-change.html`, `ai.html`, and `us-elections.html`.

**Out of scope:**
- `climate-change.html`'s lower stat/callout-box density relative to peer pages — this is a content-density observation, not a broken/unfinished element, and reworking it would mean adding new prose/claims, which is a bigger and different kind of task than this visual-polish pass. Noted for a possible future content pass, not fixed here.
- Any content, citation, or claim changes on any page — this is images and one CSS variable, nothing else.
- Any change to pages/sections not named above.

## Image Sourcing Standards (carried forward from every prior page build on this site)

- Wikimedia Commons only. License (public domain or CC) and subject match verified directly on the image's own Commons file page — never from a search-result thumbnail or an embedding article.
- Favor real photographs over illustrations/diagrams where the subject allows it (a real Capitol photo over a generic icon).
- No incident-specific, graphic, or inappropriate imagery — matches the same non-graphic discipline used on `gun-violence.html`.
- Every new image gets real alt text describing its actual subject and a caption/credit line crediting Wikimedia Commons and the license, matching each page's own existing image-credit markup pattern exactly (confirm the pattern by reading that page's existing images, not by assuming uniformity across pages).

## Candidate Subjects (starting points, to be verified/refined at implementation time — not copy-paste-ready)

- `us-elections.html` `#branches` — U.S. Capitol dome or Supreme Court building exterior (the section already has an SVG diagram; a real photo complements rather than duplicates it).
- `us-elections.html` `#elections-mechanics` — a real polling-place photo (voting booths, ballot drop box) to ground the abstract primary/general/Electoral College explanation.
- `us-elections.html` `#checks-balances` — a Senate or House floor-in-session photo, or the Supreme Court's courtroom interior.
- `us-elections.html` `#local-representation` — the Washington State Legislative Building in Olympia (this site already has `card-wa-capitol.jpg`, used on `gun-violence.html`/`climate-change.html` — reuse is fine here if it fits, since it's the same real building relevant to this section's "who represents Alderwood" local-government content) or a Snohomish/King County ballot-drop-box photo.
- `ukraine.html` `#empire` — a 19th-century image related to Taras Shevchenko, Ukrainian serfdom, or the 1917-1921 independence period (a real historical photo/painting from the era, not a generic stock image).
- `ai.html` `#school` — a classroom/student-with-device photo (matches the section's "AI and schoolwork" subject).
- `ai.html` `#animals` — an animal-communication-research-adjacent photo (a research setting, an animal being studied, not a cartoon).
- `ai.html` `#hinton` — Geoffrey Hinton's own portrait already exists elsewhere on the page per prior builds; if not reusable here, a neural-network/AI-research-lab photo.
- `ai.html` `#agentic` — an image representing autonomous/agentic computing (a real robotics or automation photo, not a sci-fi stock image).

Implementer should treat every one of these as a starting hypothesis, not a final answer — verify each candidate is real, licensed, and genuinely fits before using it, and choose a different real subject if a candidate doesn't hold up.

## Accent Color for climate-change.html

Choose a distinct green/earth-tone accent (not colliding with the site's existing 6 accents: red `#a02c2c`, navy/gold `#1a2a52`, teal `#2c6e6b`, pewter `#5a6169`), applied the same way `us-elections.html`/`immigration.html`/`gun-violence.html` each define their own `--accent`/`--accent-ink` CSS custom properties — a token-level change, not a page redesign. Every other visual element (typography, layout, hero treatment) stays exactly as-is.

## Error-Handling Port

Read `immigration.html`'s or `gun-violence.html`'s actual `onerror` pattern directly (both section-image `onerror="this.style.display='none'"` and person-photo `onerror="this.outerHTML='<div class=\'emoji-fallback\'>...</div>'"` variants exist — use whichever variant matches each specific image's role on the target page, following that page's own existing convention for section images vs. person photos). Apply to every `<img>` tag on `iran.html`, `ukraine.html`, `climate-change.html`, `ai.html`, `us-elections.html` — including the new images added by this same effort.

## Verification Standards (carried forward)

- Citation counts must not decrease on any page (this pass shouldn't touch citations at all, but verify as a safety check).
- Div/tag balance and no duplicate `id`s, checked per page after edits.
- Every new/modified `<img>` tag's `src` path verified to point to a real file that exists in `/images`.

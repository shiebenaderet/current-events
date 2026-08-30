# AGENTS.md

## Cursor Cloud specific instructions

This repository is a **static website** — a collection of self-contained `.html` files served
as-is. There is **no build step, no package manager, no dependencies, no tests, and no lint
config** (confirmed: no `package.json`, `Makefile`, CI workflows, or git hooks). Development
means editing HTML/CSS/JS inside the `.html` files and viewing the result in a browser.
See `README.md` for the project overview and contribution guidelines.

### Services

There is a single "service": a static file server for local preview. GitHub Pages hosts the
production site, so any static server that serves the repo root reproduces production.

- **Run (dev preview):** serve the repo root over HTTP and open a browser.
  - `python3 -m http.server 8000` from the repo root, then browse `http://localhost:8000/`.
  - `index.html` is the landing hub; each topic is a flat page at the root
    (e.g. `iran.html`, `ukraine.html`, `climate-change.html`).
- **Build:** none. Do not look for a build command; there isn't one.
- **Lint / test:** no lint config, but there are tests and checks — run them.
  - `node --test tools/*.test.js` — JS unit + integration tests, no dependencies.
    The bare directory form (`node --test tools/`) fails on Node 26; use the glob.
  - `python3 tools/verify_invariants.py HEAD` — structural diff against a git ref.
    Asserts citation and gloss counts and that `data-def` text survives
    byte-identical. A pure restructure must report exact equality.
  - `python3 tools/reading_time.py --landing` — fails if any page's entry point
    exceeds seven minutes.
  - `python3 tools/check_study_mode.py` — verifies no gloss lands inside a quotation.

  Then still load the affected page(s) in a browser and exercise the interactive
  features (quizzes, the per-topic centrepiece, the section tiles) — the checks
  above cover structure and never appearance.

### Non-obvious notes

- **Always preview over HTTP, not `file://`.** Pages pull external resources (Google Fonts,
  Leaflet.js maps, YouTube embeds) and use relative asset paths under `images/`. Opening a
  file directly with `file://` can break relative paths and some features; serve over HTTP.
- **External CDN/network dependencies:** interactive maps (Leaflet), web fonts, and embedded
  YouTube videos load from third-party CDNs at runtime. If the environment has restricted
  egress, those specific widgets may fail to render even though the page and local content
  (text, `images/` assets) still work. Local content and the quiz/points system work offline.
- **Quizzes and "Discovery Points" are client-side JS** embedded in each page — no backend,
  no persistence server. Good target for a quick end-to-end sanity check of a topic page.
- **Versioning:** bump `VERSION` and add a `CHANGELOG.md` entry when finishing a content
  refresh or new topic page (see README "Versioning").

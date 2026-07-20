# Changelog

All notable changes to this site are documented here. Versioning follows the scheme in `current-events-README.md`'s **Versioning** section (site-wide `MAJOR.MINOR.PATCH`, bumped once per finished effort — see that section for what qualifies as each level).

## [1.1.1] — 2026-07-20

**Patch — docs and tooling, no page content changed.**

- Fixed `current-events-README.md`'s stale Topics table (Ukraine and AI were listed as "Planned" when both had been live since March 2026) and its File Structure section (described a `topic/index.html` folder layout that never matched the site's actual flat `iran.html`/`ukraine.html`/`ai.html` structure).
- Introduced this versioning system itself: `VERSION`, `CHANGELOG.md`, and the **Versioning** section in the README documenting what counts as Major/Minor/Patch and when to bump.

## [1.1.0] — 2026-07-20

**Minor — full content refresh of two existing pages.**

- Refreshed `iran.html` and `ukraine.html`'s "what's happening right now" content from stale March 2026 framing to July 2026, covering the ceasefire → peace deal → collapse arc (Iran) and the Feb–July 2026 negotiation timeline (Ukraine).
- Audited both pages' images and citation links, and fixed real problems found along the way:
  - A Mahsa Amini protest photo mislabeled as being from inside Tehran (it was a diaspora solidarity photo from Amsterdam), cited to a dead Wikimedia Commons URL.
  - A separate Mahsa Amini image used as her Key People "portrait" that was actually a photo of a protest sign, not a real photo of her — no free-licensed portrait of her exists, so the card now uses an honest fallback state with an explanatory note instead of a misleading photo.
  - Several dead or silently-broken citation links across both pages, including a CIA World Factbook citation that returned `200` but redirected to unrelated content after the Factbook was permanently discontinued in February 2026.
- Established a site-wide content rule: never use relative-time phrasing ("now," "currently," "as of now") to describe an evolving event's present status — always an explicit date, since pages are refreshed periodically and relative phrasing goes silently stale between refreshes. Applied retroactively across both refreshed pages.
- Full detail: `docs/plans/2026-07-17-iran-ukraine-refresh-design.md` and `docs/plans/2026-07-17-iran-ukraine-refresh-implementation.md`.

## [1.0.0] — 2026-03-08

**Baseline — first tracked version.** Versioning was introduced after this point; this entry retroactively documents the site's state going into it, reconstructed from git history rather than logged in real time.

- `iran.html` and `index.html` live since the project's initial commit (2026-03-01).
- `ukraine.html` and `ai.html` completed and shipped (2026-03-08), each with maps, timeline, quizzes/points system, Key People portraits, Videos & Resources sections, and topic-themed easter eggs.

---

_Format: each entry lists the version, date, and bump level (Major/Minor/Patch — see `current-events-README.md`), followed by what changed and, where it isn't obvious, why. Entries are written when a version bumps, not per-commit._

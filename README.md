# 📰 Current Events Explained

**Free, student-friendly explainers on the background behind current events — built for middle schoolers.**

Live site: [current.mrbsocialstudies.org](https://current.mrbsocialstudies.org)  
Made by: Shie Benaderet, 8th Grade Social Studies, Alderwood Middle School

Current version: **[v4.11.0](CHANGELOG.md)** · see [VERSION](VERSION) and [CHANGELOG.md](CHANGELOG.md) for release history

Every page opens on a short primer and a menu of tiles rather than a long scrolling article — see **[How a page is built](#how-a-page-is-built)** below. All eight topics are live and on the shared warm-newsprint design; accessibility controls, Study Mode, and reading support are shared across every page through `site.css` and `site.js`.

[`CHANGELOG.md`](CHANGELOG.md) is the release-by-release history. This README describes the site as it currently stands, so it changes when the site's shape does, not once per release.

---

## What is this?

This is a collection of student-facing HTML pages that explain major current events in accessible language for middle schoolers — especially students who read below grade level, have IEPs, or are multilingual learners.

Each topic page includes:
- 🗺️ **Interactive maps** (Leaflet.js, no API key needed)
- 📅 **Visual timelines** with images and source citations
- 🧠 **Embedded quizzes** with a points/unlock system
- 🥚 **Easter eggs** to reward curious students
- 📺 **Embedded YouTube videos**
- 📖 **Source citations on every fact**, linked to the original article
- 📰 **Curated resource links** organized by reading level

- ♿ **Accessibility controls** — skip link, text size, and a self-hosted OpenDyslexic option on every page
- 💡 **Study Mode** — a toggle that reveals inline word definitions and a section-tracking bar as you scroll; see below

Pages are plain HTML plus shared `site.css` / `site.js`. No build tools, no frameworks, no server required.

---

## How a page is built

A topic page is **not** a long scrolling article. It opens on a short primer
and a menu of tiles:

```
hero  ─────────────────────────────────────────────
primer          ~650 words, about 5 minutes, ONE interactive
                the only part everyone is expected to read
quiz            one question on the primer
─── tile menu ─────────────────────────────────────
  9–13 cards, each with a title and a reading time
  ·  opened      ✓  opened and quizzed
─── nothing renders below the menu ────────────────
```

Opening a tile closes the others and hides the hero, primer and menu, so **an
open card is the whole view**. Its sticky header reads *← Overview*, and every
card ends with the menu again. Each card is a `<details class="unfold">` with
a slug `id`, so any section can be linked directly:
`current.mrbsocialstudies.org/iran.html#where-things-stand`.

The homepage follows the same principle: each topic is named **once**, in one
set of cards. It deliberately has no second navigation — a duplicate nav is a
list of the same eight choices a student has already been given.

This shape exists so a page can be short at the door without being short on
content. **The 5–7 minutes is a property of the entry point, not a ceiling on
the topic** — deep sections keep every word. A request to "make this page
shorter" means *add a shorter door*, never *delete rooms*.

Full build order, gates and traps: [`docs/PLAYBOOK.md`](docs/PLAYBOOK.md).

---

## Topics

| Topic | Status | Page | Last content refresh |
|---|---|---|---|
| 🇮🇷 Understanding Iran | ✅ Live | `iran.html` | August 27, 2026 |
| 🇺🇦 The War in Ukraine | ✅ Live | `ukraine.html` | August 27, 2026 |
| 🤖 AI & Society | ✅ Live | `ai.html` | August 18, 2026 |
| 🗳️ US Elections & How Government Works | ✅ Live | `us-elections.html` | August 27, 2026 |
| 🌍 Climate Change | ✅ Live | `climate-change.html` | August 27, 2026 |
| 🗽 Immigration & U.S. Policy | ✅ Live | `immigration.html` | August 27, 2026 |
| 🔫 Gun Violence & School Safety | ✅ Live | `gun-violence.html` | August 18, 2026 |
| 🚀 Space Race 2.0 | ✅ Live | `space-race.html` | August 18, 2026 |

---

## File Structure

```
current-events/
│
├── index.html                   ← Landing page / topic hub
├── iran.html                    ← Iran topic page
├── ukraine.html                 ← Ukraine topic page
├── ai.html                      ← AI & Society topic page
├── us-elections.html            ← US Elections & Government topic page
├── climate-change.html          ← Climate Change topic page
├── immigration.html             ← Immigration & U.S. Policy topic page
├── gun-violence.html            ← Gun Violence & School Safety Policy topic page
├── space-race.html              ← Space Race 2.0 topic page
├── site.css                     ← Shared accessibility + reduced-motion CSS
├── site.js                      ← Shared text-size / OpenDyslexic controls
├── fonts/                       ← Self-hosted OpenDyslexic (OFL)
├── images/                      ← Shared image assets (portraits, hero photos)
├── tools/                       ← Checks and one-off maintenance scripts,
│                                   plus the test suite (see Checks below)
├── docs/VOICE.md                ← Standing voice note: how sentences sound
├── docs/PLAYBOOK.md             ← How a page is built, and what must pass
├── docs/LEARNING-TARGETS.md     ← The 60 learning targets, by page
├── docs/learning-targets.html   ← Browser version of the above (generated)
├── docs/plans/                  ← Design docs + implementation plans for each
│                                   topic build or content refresh
├── .github/ISSUE_TEMPLATE/      ← GitHub form for topic suggestions
├── VERSION                      ← Current site version (semver)
├── CHANGELOG.md                 ← Version history
├── CNAME                        ← Custom domain: current.mrbsocialstudies.org
├── README.md                    ← This file
└── LICENSE                      ← CC BY 4.0
```

Each topic is a flat `.html` file at the repo root, plus shared `site.css`, `site.js`, and `fonts/`. No build step. This changed from the project's original folder-per-topic plan once it became clear a flat structure was simpler to maintain for a small number of pages.

---

## Checks

Everything in `tools/` runs with no dependencies — Python 3 and Node, both
already on macOS. Run all of it before shipping:

```bash
node --test tools/*.test.js          # 139 tests: unfold, timelines, deep links,
                                     #   Study Mode, version stamps, tag parsing,
                                     #   unique ids and resolvable aria refs
python3 tools/check_voice.py         # undated "now", page-talk, missing primers
python3 tools/check_pane_contrast.py # every in-pane colour against WCAG AA
python3 tools/find_dead_css.py       # rules that can no longer match anything
python3 tools/check_study_mode.py    # no injected gloss lands inside a quotation
```

All of these should come back clean. `find_dead_css.py --apply` removes what
it finds.

One more is a *comparison*, not a standalone check — it takes a git ref and
reports any structural count that moved between there and the working tree:

```bash
python3 tools/verify_invariants.py main            # all topic pages
python3 tools/verify_invariants.py main iran.html  # or just one
```

Run it after any mechanical, site-wide edit. Citation counts, gloss counts,
`<div>` open/close balance and `onerror` handlers should all hold steady
unless you meant to change them — this is what catches an edit that a regex
applied 200 times slightly wrong.

**After bumping `VERSION`, always run `python3 tools/stamp_version.py`.** It
writes the build number into all nine footers and appends `?v=<version>` to
every local `css`/`js` reference. Skipping it ships a page whose footer still
claims the previous build and whose stylesheet a browser may serve from cache
— which looks exactly like a change that failed to deploy. The script is
idempotent; running it twice is safe.

The remaining scripts are one-off maintenance tools, not gates:
`shrink_images.py` (caps images by how they're displayed), `spread_glosses.py`
(glosses a term at first mention in every card), `lighten_panes.py`,
`reading_time.py`, and `htmltag.py` — a tag matcher that is *attribute-aware*,
which the obvious `<img\b[^>]*>` regex is not.

---

## How to Use This in Your Classroom

**Option 1 — Just link to it:**  
Share `current.mrbsocialstudies.org/iran` with students via Canvas, Google Classroom, Schoology, or a link in an email. Everything works in any modern browser including Chromebooks.

**Option 2 — Embed it:**  
If your district allows external iframes in your LMS:
```html
<iframe src="https://current.mrbsocialstudies.org/iran" width="100%" height="800px" style="border:none"></iframe>
```

**Option 3 — Download and host it yourself:**  
Download the topic `.html` file plus `site.css`, `site.js`, `fonts/`, and any `images/` it uses. Rename it, modify it, host it wherever you want. No attribution required (but appreciated!).

---

## Study Mode

Every topic page has a **💡 Study Mode** button in the accessibility controls fixed to the bottom-right corner of the screen, below the text-size buttons and the dyslexia-font toggle. It is in the same place on desktop and on a phone. Turning it on reveals the definition beside every glossed word right in the paragraph it appears in, and adds a small bar at the bottom of the screen that tracks which section you're reading and previews what it covers. It doesn't rewrite or shorten anything — it's the same article, with support turned on. Turning it back off returns the page to exactly how it looked before.

The setting is remembered across pages once a student turns it on, so it doesn't need to be re-enabled on every page they open next.

To send a student straight to a page with Study Mode already on — handy for a Canvas assignment link — add `?study=on` to the URL:
```
https://current.mrbsocialstudies.org/iran?study=on
```
`?study=off` works the same way in reverse, but only for that one page load — it does not turn off (or remember turning off) Study Mode for pages the student visits afterward. That's deliberate: a link a teacher shares once shouldn't be able to silently clear a setting a student saved for the rest of the site.

---

## Contributing

Pull requests are very welcome — especially from other Social Studies teachers who want to:
- Add a new topic page
- Fix an outdated fact or broken link
- Improve accessibility
- Write a companion version of a page in another language (none ships yet; plain-English vocabulary tooltips are the current MLL support)

**To suggest a topic:** use the [Suggest a Topic form](https://current.mrbsocialstudies.org/#suggest) on the homepage (it opens an email — nothing is stored on the site), or [open a GitHub issue](https://github.com/shiebenaderet/current-events/issues/new?template=topic-suggestion.md) with the topic-suggestion template.

**To report an issue:** [Open a GitHub Issue](https://github.com/shiebenaderet/current-events/issues/new)

### Contribution guidelines
- Each topic should be a flat `.html` file at the repo root (shared `site.css` / `site.js` / `fonts/` are required alongside it)
- Write for a reading level of approximately **5th–6th grade** (but content depth of 8th grade). Contractions are fine.
- **Let the story carry the facts.** The second sentence should be a consequence of the first. Open on people, events, and objects — not on a policy about how the explainer is written. Full standing note: [`docs/VOICE.md`](docs/VOICE.md).
- Do not write student-facing “this page / this section / further down this page” except functional notes (content warnings, Konami tips, “the form does not store what you type,” hero sourcing notes, classroom discussion questions).
- Every factual claim should have an inline source citation linked to the original article. Cite after the fact the source supports, not after a civics kicker. Prefer sources that are free to access (no paywalls). Wikipedia is a last resort.
- When describing the current state of an ongoing event (a war, negotiation, protest movement, etc.), use an explicit date ("As of August 27, 2026") rather than relative phrasing like "now," "today," "currently," or "right now" — pages are refreshed periodically, and relative phrasing goes silently stale between refreshes
- A weekly news pass should rewrite a page only when sourced developments actually overtake its dated snapshot. Update that page's **Last content refresh** date in the Topics table above; pages checked and left alone keep their previous date. Do not invent casualty, oil, retirement, ICE/TRAC, or incident totals. Prefer the last cited as-of date over a fresher-looking guess.
- Party-swap test on current-policy prose. Accuracy, not false balance, for settled history and science. Quote punctuation stays as the source wrote it.
- Images should be from Wikimedia Commons (CC-licensed or public domain) or original
- Building or converting a topic page? Read [`docs/PLAYBOOK.md`](docs/PLAYBOOK.md) first — the order of work, the gates, and the traps
- Every section belongs in a tile (`<details class="unfold">`) with a `data-title`, a `data-minutes`, and a slug `id` — see **[How a page is built](#how-a-page-is-built)**
- Shared component styling goes in `site.css`, which loads last, never copied into the eight inline stylesheets
- Run the checks before opening a PR — see **[Checks](#checks)** above
- Bump the version, run `tools/stamp_version.py`, and update `CHANGELOG.md` as part of finishing any content refresh or new topic page — see **Versioning** below

---

## Versioning

This project tracks one site-wide version in [`VERSION`](VERSION), following [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`), adapted for a content site rather than a library:

| Bump | When |
|---|---|
| **Major** | A new topic page ships, or a structural/design overhaul changes how the site works |
| **Minor** | A full content refresh of an existing page (e.g. bringing "what's happening now" up to date), or a new section added to an existing page |
| **Patch** | Small corrections — fixing a broken link, a typo, a mislabeled image, a stale date stamp |

The version bumps once per finished effort (e.g. once for an entire multi-task content refresh), not once per commit. Every bump gets a matching entry in [`CHANGELOG.md`](CHANGELOG.md) describing what changed and why. See `CHANGELOG.md`'s own header for the full format.

**Bumping `VERSION` is two steps, not one:** edit the file, then run
`python3 tools/stamp_version.py` to write the new build number into every
footer and cache-bust the shared stylesheet. The footer build number is there
so you can confirm at a glance which build a browser is actually showing you.

---

## License

[Creative Commons Attribution 4.0 (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/)

You are free to share and adapt this material for any purpose, including commercial use, as long as you give appropriate credit.

---

## Related Projects

- [Mr. B's Social Studies](https://mrbsocialstudies.org) — Main 8th grade American history curriculum site

---

*Built with plain HTML, CSS, and vanilla JavaScript. No frameworks, no dependencies, no build step. Hosted free on GitHub Pages.*

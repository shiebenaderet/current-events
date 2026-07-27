# 📰 Current Events Explained

**Free, student-friendly explainers on the background behind current events — built for middle schoolers.**

Live site: [current.mrbsocialstudies.org](https://current.mrbsocialstudies.org)  
Made by: Shie Benaderet, 8th Grade Social Studies, Alderwood Middle School

Current version: **[v2.6.0](CHANGELOG.md)** · see [VERSION](VERSION) and [CHANGELOG.md](CHANGELOG.md) for release history

The site-wide editorial visual redesign (a warm-newsprint look inspired by real newsroom design conventions — see the v2.0.0 changelog entry for detail) is complete as of v2.4.0. Every page is on the new design, including `immigration.html`, the first new topic built directly in it.

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

Everything is a single self-contained `.html` file. No build tools, no frameworks, no server required.

---

## Topics

| Topic | Status | Page | Last content refresh |
|---|---|---|---|
| 🇮🇷 Understanding Iran | ✅ Live (new design) | `iran.html` | July 2026 |
| 🇺🇦 The War in Ukraine | ✅ Live (new design) | `ukraine.html` | July 2026 |
| 🤖 AI & Society | ✅ Live (new design) | `ai.html` | March 2026 |
| 🗳️ US Elections & How Government Works | ✅ Live (new design) | `us-elections.html` | July 2026 |
| 🌍 Climate Change | ✅ Live (new design) | `climate-change.html` | July 2026 |
| 🗽 Immigration & U.S. Policy | ✅ Live (new design) | `immigration.html` | July 2026 |
| 🔫 Gun Violence & School Safety | 🚧 Planned | — | — |
| 🚀 Space Race 2.0 | 🚧 Planned | — | — |

---

## File Structure

```
current-events/
│
├── index.html                   ← Landing page / topic hub
├── iran.html                    ← Iran topic page (self-contained)
├── ukraine.html                 ← Ukraine topic page (self-contained)
├── ai.html                      ← AI & Society topic page (self-contained)
├── us-elections.html            ← US Elections & Government topic page (self-contained)
├── climate-change.html          ← Climate Change topic page (self-contained)
├── immigration.html             ← Immigration & U.S. Policy topic page (self-contained)
├── images/                      ← Shared image assets (portraits, hero photos)
├── docs/plans/                  ← Design docs + implementation plans for each
│                                   topic build or content refresh
├── VERSION                      ← Current site version (semver)
├── CHANGELOG.md                 ← Version history
├── CNAME                        ← Custom domain: current.mrbsocialstudies.org
├── README.md                    ← This file
└── LICENSE                      ← CC BY 4.0
```

Each topic is a single flat `.html` file at the repo root — not a per-topic folder. This changed from the project's original folder-per-topic plan once it became clear a flat structure was simpler to maintain for a small number of pages.

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
Each page is a single `.html` file. Download it, rename it, modify it, host it wherever you want. No attribution required (but appreciated!).

---

## Contributing

Pull requests are very welcome — especially from other Social Studies teachers who want to:
- Add a new topic page
- Fix an outdated fact or broken link
- Improve accessibility
- Translate content for multilingual learners
- Add sources in additional languages

**To suggest a topic or report an issue:** [Open a GitHub Issue](https://github.com/shiebenaderet/current-events/issues/new)

### Contribution guidelines
- Each topic should be a single self-contained `.html` file at the repo root
- Write for a reading level of approximately **5th–6th grade** (but content depth of 8th grade)
- Every factual claim should have an inline source citation linked to the original article
- When describing the current state of an ongoing event (a war, negotiation, protest movement, etc.), use an explicit date ("As of July 2026") rather than relative phrasing like "now" or "currently" — pages are refreshed periodically, and relative phrasing goes silently stale between refreshes
- Prefer sources that are free to access (no paywalls)
- Images should be from Wikimedia Commons (CC-licensed or public domain) or original
- Bump the version and update `CHANGELOG.md` as part of finishing any content refresh or new topic page — see **Versioning** below

---

## Versioning

This project tracks one site-wide version in [`VERSION`](VERSION), following [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`), adapted for a content site rather than a library:

| Bump | When |
|---|---|
| **Major** | A new topic page ships, or a structural/design overhaul changes how the site works |
| **Minor** | A full content refresh of an existing page (e.g. bringing "what's happening now" up to date), or a new section added to an existing page |
| **Patch** | Small corrections — fixing a broken link, a typo, a mislabeled image, a stale date stamp |

The version bumps once per finished effort (e.g. once for an entire multi-task content refresh), not once per commit. Every bump gets a matching entry in [`CHANGELOG.md`](CHANGELOG.md) describing what changed and why. See `CHANGELOG.md`'s own header for the full format.

---

## License

[Creative Commons Attribution 4.0 (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/)

You are free to share and adapt this material for any purpose, including commercial use, as long as you give appropriate credit.

---

## Related Projects

- [Mr. B's Social Studies](https://mrbsocialstudies.org) — Main 8th grade American history curriculum site

---

*Built with plain HTML, CSS, and vanilla JavaScript. No frameworks, no dependencies, no build step. Hosted free on GitHub Pages.*

# Changelog

All notable changes to this site are documented here. Versioning follows the scheme in `README.md`'s **Versioning** section (site-wide `MAJOR.MINOR.PATCH`, bumped once per finished effort — see that section for what qualifies as each level).

## [2.4.0] — 2026-07-23

**Minor — US Elections & Government page rebuilt; site-wide editorial redesign complete.**

- `us-elections.html` fully rebuilt in the same warm-newsprint editorial system as every other page — same civics content, sources, and citations as before, restyled: the three-branches diagram, the checks-and-balances data table (kept as a table, not reverted to an earlier circles/arrows draft), the 2026 midterms update-pane, the Alderwood-area district lookup (WA's 21st Legislative District / 1st Congressional District) with full candidate lists, a 5-entry voting-rights history timeline, Key People (James Madison, John Lewis), both videos, resources including the dated midterms-links subsection, and all 6 quizzes.
- Deliberately kept this page's own navy/gold accent color instead of the shared newsprint red used on every other page — the original build chose navy/gold specifically to avoid an accidental red/blue two-party visual cue, and that reasoning still holds under the new design system.
- Fixed three dead easter-egg code paths found during the rebuild: a stat-click handler, a timeline double-click reveal, and the 5pt/10pt point-unlock tiers all referenced DOM element IDs that didn't exist anywhere in the live page, so triggering them silently did nothing. Given real targets: the House/Senate stat-pair now reveals a sourced bonus fact about the House's fixed 435-seat cap versus the Senate's constitutionally-set size, and the timeline double-click reveals a sourced fact about the 17th Amendment (direct election of Senators). Adjusted the max achievable point total to match.
- Nonpartisanship discipline preserved exactly: officeholders named by role only, every candidate list shows party equally, all platform links go only to each candidate's own campaign site — no wording, dates, or numbers were refreshed as part of this restyle.
- **This completes the site-wide editorial redesign begun in v2.0.0.** Every page — `index.html`, `iran.html`, `climate-change.html`, `ukraine.html`, `ai.html`, and `us-elections.html` — is now on the unified warm-newsprint design system. Future new topics (Immigration, Gun Violence, Space Race) will be built directly in this system from the start.

## [2.3.0] — 2026-07-23

**Minor — AI & Society page rebuilt in the editorial design system.**

- `ai.html` fully rebuilt in the same warm-newsprint editorial system as `index.html`, `iran.html`, `climate-change.html`, and `ukraine.html` — same content, sources, and citations as before, restyled: all 4 deep-dive focus-panes (AI in Schools, AI and Animals, Geoffrey Hinton's Warning, Agentic AI), an 18-entry history timeline, 7 Key People, all quizzes, and all four easter eggs (a hidden binary-code message, a timeline pop-culture fact, a hover-all-portraits reward, and a Konami-code egg).
- Fixed a minor content redundancy found during the rebuild: the timeline's hidden-history easter egg referenced Geoffrey Hinton's Nobel Prize, which the page already covers in its own focus-pane — swapped for a different, still-sourced fact (the 1956 Dartmouth workshop where the term "artificial intelligence" was coined) so the egg stays a genuine surprise rather than a repeat of content already on the page.

## [2.2.0] — 2026-07-23

**Minor — Ukraine page rebuilt in the editorial design system.**

- `ukraine.html` fully rebuilt in the same warm-newsprint editorial system as `index.html`, `iran.html`, and `climate-change.html` — same content, sources, and citations as before (verified during the rebuild), restyled: the interactive Leaflet map (Kyiv + 10 site markers + Ukraine border), the full history arc (Kievan Rus' → the Russian Empire → the Holodomor deep-dive → independence → the Orange Revolution/Euromaidan → the 2022 invasion → where things stand now), a 15-entry history timeline, 4 Key People, 4 videos, 15 resources, all 8 quizzes, and the full points/easter-egg engine (flag-click, a "type UKRAINE" hidden-poem egg, a timeline triple-click egg, a hover-all-portraits egg). Nonpartisanship discipline preserved exactly as it was in the prior version — attribution/denial phrasing (e.g. Russia's denial of responsibility for Bucha, described alongside the evidence against it) was not softened or hardened during the rewrite, only restyled around.
- Fixed a real content bug found during the rebuild: the timeline's hidden-history easter egg contained leftover content from `iran.html` (1960s Shah-era material, unrelated to Ukraine — an old copy-paste error). Replaced with a real, sourced Ukraine fact: the 1954 transfer of Crimea from the Russian SFSR to the Ukrainian SSR under Khrushchev.
- Added Subresource Integrity (`integrity`/`crossorigin`) attributes to the Leaflet.js CDN tags, matching the hashes already verified and applied on `iran.html`.
- The Holodomor deep-dive section's full-bleed photo needed its own layout treatment: it's the first page to nest a breakout photo inside a dark inset panel (`.focus-pane`) rather than the plain article column, so the panel is now split around the image (heading → full-bleed photo → body text) with the dark background continuing unbroken behind it, instead of the photo either being squeezed into the panel's narrower text column or breaking out past the panel's own edges onto the page background.

## [2.1.0] — 2026-07-23

**Minor — Climate Change page ships; homepage topic grid fixed to show it and US Elections.**

- New page `climate-change.html`, built in the v2.0.0 editorial design system from the start (the first new topic to launch under it, rather than a retrofit of an older page). Deep-time framing led by ice-core evidence (EPICA Dome C's 800,000-year record, the Keeling Curve), the greenhouse effect, observed global/Pacific-Northwest effects, and a dedicated Washington's Climate Story section (the Climate Commitment Act, the state's electricity mix, its carbon footprint) — the section held to the same strict nonpartisanship discipline established on `us-elections.html`, including reporting two named experts' differing reads of the same emissions data rather than picking one. All content and citations verified against primary sources; several editorial-critique passes fixed redundant stat/paragraph pairs, tightened pull-quote usage to genuine excerpts rather than spoilers, and widened image variety.
- `index.html`: Climate Change moved out of "Coming Soon" (it had gone stale — the page was already live) and added to the topic grid alongside a new **US Elections & Government** card, which had been missing from the homepage entirely since that page shipped in v1.2.0 (linked only from the nav bar, with no card). Switched the topic grid from a hardcoded 3-column layout to a responsive `auto-fit` grid so it wraps cleanly regardless of how many live topics exist.
- Trimmed ~31 sourced-but-unused images from the climate build, left over from two earlier layout experiments (a snap-scroll card prototype and a margin-notes prototype) that were tried, critiqued, and superseded before landing on the final editorial design — only the 9 images actually referenced in the shipped page were kept.

## [2.0.0] — 2026-07-23

**Major — site-wide editorial visual redesign begins (homepage + Iran rebuilt).**

- New site-wide design system replacing the original card/pill/drop-shadow look: a warm-newsprint editorial identity fused from three real publications' documented conventions — NYT's headline-size hierarchy for front-page/homepage layout, The Atlantic's full-bleed hero-photo-behind-headline article treatment, The New Yorker's spare single-column reading body with drop caps opening each major section. Palette: off-white paper, near-black ink, a single restrained newsprint red used only for labels/rules/accents (never as a fill). Typography: Playfair Display (headlines) + Source Serif 4 (body) + system-sans (nav/labels/captions). Signature element carried through every page: a large drop cap opens the first paragraph of every major section, not just the page's very first paragraph.
- `index.html` rebuilt: replaced the equal-weight topic-card grid with an NYT-style hierarchy — one large Featured Story lead (full-bleed photo, biggest headline on the page), a 3-up medium tier for the other live topics, and a dense small-headline rail for Coming Soon/Planned topics. Site title changed from "Mr. B's World" to **"Current Events Explained"**, with a new subhead stating the site's actual purpose plainly (explaining the background behind the news, not just reporting it). All "back to main site"-style links (previously split between `ss8.mrbsocialstudies.org` and `mrbsocialstudies.org`) consolidated to point at `mrbsocialstudies.org` throughout.
- `iran.html` fully rebuilt in the new system — same content, sources, and citations as before (verified against the prior version during the rebuild), restyled: the 3-box "Where Things Stand Now" update-pane, the full history timeline, all 6 Key People, the Leaflet.js interactive map (Tehran/Persepolis/Isfahan/Shiraz markers + Iran outline), all 8 quizzes, and the full points/easter-egg engine (flag-click Farsi phrases, geography stat-click bonus, hidden 1960s timeline entry, Konami code) all preserved functionally. One deliberate change: the timeline's hidden-history easter egg, previously triggered by double-clicking an invisible spot near a vertical timeline line, is now an explicitly labeled (if unobtrusively styled) button — the new layout has no timeline spine element to hide a click target against, so it trades a bit of "secretness" for real discoverability.
- Added Subresource Integrity (`integrity`/`crossorigin`) attributes to the Leaflet.js CDN `<link>`/`<script>` tags on `iran.html` — a pre-existing gap (present before this redesign too), fixed opportunistically while the file was already being rebuilt.
- Ukraine, AI & Society, and US Elections pages are still on the pre-redesign visual system as of this release; each will get its own dedicated rebuild pass (not a blind CSS swap, given how differently each page's content is shaped) in follow-up releases.

## [1.2.0] — 2026-07-21

**Minor — new topic page added: US Elections & Government.**

- New page `us-elections.html`, built from scratch (fourth topic on the site, first not adapted from a prior draft) matching `iran.html`/`ukraine.html`/`ai.html`'s established structure: durable civics content (the three branches, how elections actually work, checks and balances) plus a live update-pane tied to the 2026 midterms, a local section naming the specific state legislative and congressional district that covers this school (Washington's 21st Legislative District / 1st Congressional District — corrected mid-build from an initially-misidentified 32nd/2nd via a direct U.S. Census Bureau geocoder cross-check), a history timeline (1787 Constitutional Convention through the 26th Amendment), two historical Key People profiles (James Madison, John Lewis — deliberately no current officials), two videos, and a resources section including a dated "Keep up with the 2026 midterms" curated-links subsection.
- This page's defining constraint, more than any prior page on this site: strict nonpartisanship, verified via a dedicated party-swap test applied per content section, not just as a final pass. Current officeholders are named by role only, never by party; filed-candidate lists show party for every candidate equally; candidate platform links go only to each candidate's own campaign site/statement, never a third-party characterization.
- Two custom inline-SVG/CSS diagrams: a three-branches relationship diagram (rectangular boxes with two arrows: "sends bills to," "appoints judges to") and a checks-and-balances comparison — the latter went through several rounds of visual iteration (circles → rectangles with arrows → a plain data table) before landing on the table format, which turned out to be the clearest way to present 5 distinct branch-to-branch checks without illegible crossing-line labels.
- `index.html`: US Elections takes over the site's Featured Story slot (previously Iran); Iran is demoted into the regular topic-card grid, matching Ukraine's/AI's card format exactly. Site-nav updated with a new "🗳️ US Elections" link.

## [1.1.5] — 2026-07-21

**Patch — real citation added for a previously-unverified image, no other content changed.**

- `ai.html`'s ENIAC photo (`images/early-computer.jpg`) had an honest "we could not confirm exactly where this photo came from" disclosure, added during the AI page's July 2026 refresh audit after no verifiable source could be found at the time. The site owner supplied the real source directly (a specific Wikimedia Commons file page); independently confirmed via two separate fetches (the first, via a Wikipedia article's `#/media/` fragment link, actually returned a DIFFERENT image's caption from the same article page — a real mismatch, caught by re-fetching the Commons file page directly rather than trusting the first result). Confirmed match: Glen Beck and Betty Snyder programming the ENIAC in Building 328 at the Ballistic Research Laboratory, c. 1947–1955, U.S. Army photo, public domain. Updated the `alt` text and caption to name the actual people and location, replacing the honest-but-now-outdated disclosure.

## [1.1.4] — 2026-07-20

**Patch — navigation fix, no CSS beyond two small reused-pattern additions.**

- `iran.html`, `ukraine.html`, and `ai.html` each have a `sticky-nav`, but it was entirely in-page (anchor links to sections like `#now`, `#timeline`) — none of the three linked back to `index.html` or to each other. A student landing directly on one topic page (via a shared link, bookmark, or search result) had no way to discover the site's other topics or return to the hub without editing the URL by hand. Added a "🏠 All Topics" link plus two sibling-topic links to the front of each page's existing `sticky-nav`, matching `index.html`'s own `site-nav` pattern (which already linked out to all three topics correctly). Reused existing CSS custom properties and pill classes already defined on each page (`.n-dark`/`.n-teal` on Ukraine and AI; two new small classes on Iran, `.n-hub`/`.n-sib`, using colors already defined via existing CSS variables) — no new colors introduced.
- Found and deliberately left unfixed: a pre-existing mobile-width horizontal-overflow bug (clips the hero headline and some nav pills on narrow screens) present on at least `ukraine.html` before this change — confirmed via a before/after screenshot comparison that it predates this fix and isn't something this patch worsened in kind, only added one more wrapped nav row on top of. Worth its own investigation across all three pages in a future pass.

## [1.1.3] — 2026-07-20

**Patch — link correction, no page content changed otherwise.**

- Updated stale references to the author's curriculum site. `README.md`'s Related Projects section pointed to a GitHub repo (`socialstudies8`) under two different link labels that both resolved to the same URL; replaced with a single entry pointing to the live site, [mrbsocialstudies.org](https://mrbsocialstudies.org). `index.html`'s About section similarly pointed its "American Yawp Jr." link at the same GitHub repo; updated to point at mrbsocialstudies.org. The separate, still-current `ss8.mrbsocialstudies.org` "main class site" link was left unchanged.

## [1.1.2] — 2026-07-20

**Patch — docs/tooling, no page content changed.**

- Renamed `current-events-README.md` to `README.md`. GitHub only auto-renders a repo's front page from a file literally named `README.md`, so the repo appeared to have no README even though the file existed with correct, up-to-date content. Renamed via `git mv` to preserve file history, and updated the two live self-references (this file's own File Structure diagram, and `CHANGELOG.md`'s pointers to the Versioning section) — the v1.1.1 entry below still refers to the file by its name at that time, since it's a historical record of what that patch actually did.

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

_Format: each entry lists the version, date, and bump level (Major/Minor/Patch — see `README.md`), followed by what changed and, where it isn't obvious, why. Entries are written when a version bumps, not per-commit._

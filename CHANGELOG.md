# Changelog

All notable changes to this site are documented here. Versioning follows the scheme in `README.md`'s **Versioning** section (site-wide `MAJOR.MINOR.PATCH`, bumped once per finished effort — see that section for what qualifies as each level).

## [3.3.0] — 2026-08-27

**Minor — touch/mobile accessibility floor and a shared token layer.** Structural only: no
prose, citation, or content edits. All nine pages' HTML changes total 13 CSS declarations;
`cite-inline`, `.term`/`.term-desc`, `<div>` balance, `<img>`/`onerror`, and id uniqueness
were captured before the pass and re-checked identical after it.

Driven by a `/edtech-ui-ux` audit of the live v3.2.0 site. Worth recording what the audit
did **not** find: no `#3B82F6`/gray-50 slop hexes, no blue→purple gradients, no Inter or
Roboto, no marketing jargon in the prose ("unlock" is quiz mechanics, "Revolutionary" is the
Islamic Revolution), a disciplined 4-value radius scale, and prose already at
`max-width:700px` / `line-height:1.75`. The newspaper look is a deliberate choice and stays;
the EdTech "warm, rounded, no gray" register was explicitly **not** applied, because the
broadsheet framing is what signals to a student that this is journalism to be read as a
source.

- **Vocabulary tooltips now open on tap.** `.term` revealed its definition only on `:hover` /
  `:focus`. Neither exists reliably on a touchscreen, so on a school tablet the students who
  most need a word defined were the least likely to ever see it — 75 terms across seven
  pages. `site.js` now toggles `.is-open` on tap, with one term open at a time, and closing
  on outside-tap, `Escape`, and scroll. The click is `preventDefault`-ed because several
  terms sit inside `<a>` resource cards, where the naive fix would have navigated away
  instead of defining the word. The `tabindex="0"` / `data-def` / `aria-describedby` →
  `.term-desc` triple is untouched; `data-def` text is byte-identical on all nine pages.
- **Mobile overflow guard propagated to all nine pages.** `body{overflow-x:hidden;
  overflow-wrap:break-word}` existed only on `gun-violence` and `immigration` — the fix had
  been written once and never carried across. This closes the "mobile overflow bug" that had
  been sitting open in the working notes.
- **Reduced-motion now covers page-local animation.** `site.css` had a
  `prefers-reduced-motion` block, but zero of the nine inline stylesheets did, so the
  wrong-answer `.shake`, toasts, progress fills, and photo transitions ran regardless of the
  setting. Broadened in the shared layer. `.shake` is neutralised rather than preserved: the
  answer is already marked in text and colour, so removing the movement loses no information.
- **Homepage lead story no longer scales on hover.** `transform:scale(1.02)` replaced with a
  badge colour shift, plus a `:focus-visible` outline the lead story previously lacked — a
  keyboard-navigation gain that came free with the fix.
- **A11y controls meet the 44px touch floor.** The A/A/A text-size buttons were 32×32px.
  They keep their 32px look via an invisible 44px `::after` hit area, with the cluster gap
  widened to 6px so the expanded areas cannot overlap into mis-taps. These are the
  accessibility controls themselves, so the students likeliest to need them include those
  with the least precise aim.
- **Shared `--ce-*` design tokens.** The audit counted **62 distinct `font-size` values**
  site-wide — seven of them between `.66rem` and `.82rem` — because eight self-contained
  pages each carry their own inline stylesheet and there was no shared scale to drift from.
  `site.css` now defines a namespaced type/spacing/radius/motion scale plus the tap floor,
  adopted within the shared layer. `--ce-*` cannot collide with a page's own `--accent` /
  `--ink` / `--paper`, which stay inline and stay distinct. This pass establishes the
  vocabulary; it does **not** yet collapse the count, which moves 62 → 61 (only the
  `.article p` reconciliation below). The scale exists to be adopted, and the eight inline
  stylesheets are swept in the reading-level effort rather than twice.
- **`.article p` reconciled.** Five pages set `1.18rem`, three (`gun-violence`,
  `immigration`, `us-elections` — the newest and longest) set `1.14rem`. Clone drift, not a
  decision. Standardised on the majority and larger value, `1.18rem`, which favours the
  below-grade-level readers the site names as its audience.

**What was considered and rejected.** Extracting shared component CSS (`.article`, `.quiz`,
the points engine) out of the eight inline stylesheets would collapse the 62-size problem at
its root, but it breaks the one-file-per-topic model the working notes protect deliberately.
Left alone; reopening it is its own effort, not a side effect of an accessibility pass. The
remaining font-size consolidation is staged to fold into the reading-level work rather than
sweeping eight stylesheets twice.

**How this was checked.** `site.js` was executed against all nine real pages in jsdom, not
inspected: nine behavioural assertions on the tooltip (open, toggle, single-open, outside
close, Escape, scroll, `preventDefault`, and the full accessibility wiring), plus text-size
and dyslexic-font toggles per page. 9/9 pages pass. Invariant counts were diffed against
`main` rather than eyeballed.

## [3.2.0] — 2026-08-27

**Minor — weekly news refresh on pages whose August 18 snapshots were overtaken.** Dated to August 27, 2026. Gun violence, Space Race, and AI were checked and left alone: no sourced development in that window was large enough to rewrite those snapshots. Casualty, ICE/TRAC fiscal-year, and front-line km² totals that were already cited were not reinvented.

- **Iran.** Hormuz is still a trickle, not a reopened strait. Kpler counted five confirmed crossings on August 25, down from more than 130 a day before the war (CNBC). Iran and Oman announced a temporary seven-mile shipping corridor and a mine-clearing project on August 26, while Iran said the waterway would not fully reopen until the United States met conditions from the expired June memorandum (Al Jazeera). Qatar's prime minister was in Tehran on August 27; President Trump said he had "no time schedule" for restarting talks (CNBC). The June 17 / August 17 peace-clock history stays.
- **Ukraine.** First-half 2026 Al Jazeera 622 / net 97 km² and ISW's August 1 ~38 km² July figure stay with their original as-of dates. ISW's August 23 assessment still finds no operational breakthrough; Russian forces were still trying to set up attacks on Slovyansk and the Donetsk Fortress Belt. Zelenskyy described a joint Ukraine–U.S.–Europe page of ideas (ceasefire, a third-party Donbas economic zone, NATO/EU roles) and a mediation window from the December 2026 G20 through summer 2027 (RTÉ, Aug. 25). The Kremlin questioned the economic-zone idea (RTÉ / ISW).
- **Elections.** Midterms countdown is **68 days** from August 27 to November 3, 2026. Cook's Senate Toss Up list is six races as of August 20, including Texas and Iowa, which Cook moved from Lean Republican (Cook ratings page). On August 25 Cook moved FL-14 and MI-10 from Lean Republican to Toss Up (Newsweek reporting Cook). House/Senate flip math and the 60 House / 11 Senate retirement counts were not reinvented.
- **Climate.** The August 1 emergency and 425,000-acre DNR figure stay as that day's count. On August 24, DNR's Thomas Kyle-Milward told KOMO the season was over 800,000 acres burned, with 15 large uncontained fires, the third-worst by acres since 2015, and firefighters likely working into October.
- **Immigration.** September 2026 Visa Bulletin: India EB-3 still January 1, 2014; India EB-2 still unavailable (Fragomen, citing the State Department chart). ICE's July 21 FYTD removal (356,389) and detention (65,765) figures stay. A later AP/PBS drop adds July's monthly arrest total: 49,571, up from 43,021 in June. TRAC's June 30 court backlog was not reinvented.
- **Homepage.** Ticker and featured-story countdown rewritten from the live snapshots.

**How this was checked.** Each new claim was read in the source, not trusted from a search snippet. Cook's Senate Toss Up count (6) was taken from Cook's own ratings page dated August 20. The House addition is reported as two named rating shifts rather than a guessed new toss-up total, because Cook's full House list is paywalled. The official State Department September bulletin URL is cited alongside Fragomen after a direct fetch of travel.state.gov timed out.

## [3.1.2] — 2026-08-18

**Patch — site-wide voice pass.** Applied the Space Race story-first rewrite to the rest of the live topics. Same facts, citations, and August 2026 snapshots. Cut student-facing "this page" asides, dated undated "now / today / right now" news framing, and connected stacked sentences so the story carries the facts.

- **Iran.** Dek now matches the 2026 war (a 60-day peace clock, not a 12-day 2025 war). The Section 1 line that still said "as of July 17, the two sides are still fighting" now follows the fighting through the August 17 deadline, cited to the same AP story already in the update pane. The Hormuz costing box connects to the spreading box instead of repeating "still barely moving." Why It Matters callouts hand off (oil → pump prices; partners → a war that's harder to stop; 70 years of U.S. choices → why American forces are already nearby).
- **Ukraine.** The Bucha pull-quote no longer copies the two sentences above it. Front-line 622 / 97 / 38 km² figures stay, with connective tissue. Peace-talks meetings get a bridge sentence. Headings and the "still developing" warning are dated to the August 18 snapshot.
- **AI.** Hero no longer stacks four disconnected claims. Stanford SETR is named without "later on this page." Wolf and Winthrop's "human element is irreplaceable" is dated to their April 2025 conversation. Quote punctuation is untouched.
- **Elections.** Control snapshot dated August 18, 2026. Cook Toss Up lists are Cook's ratings, not a classroom guess. Candidate links go to the candidate's own site. Madison and Lewis are history; sitting officials stay in the update and the local-district section.
- **Climate.** The June–July heat wave now hands off to Washington's fourth drought year and the August 1 wildfire emergency. Myers and Missik disagree about what the 0.5% drop *means*, not about the 96.1 million figure. CCA cents-per-gallon stays unsettled without "this page won't state one."
- **Immigration.** The two histories (choice vs. forced migration) are told as story. Both ICE stated positions are reported rather than picked. The system section is "how it is built." The enforcement pointer now sends students to the update *above* (it had said "below").
- **Gun violence.** Dek puts policy-not-headlines in the student's ear. The content note warns about the next paragraphs, not "this page." K-12 School Shooting Database counts are named without "this page uses." Brady and Kohl are history.
- **Homepage.** Iran card names the 2026 U.S.-Israel war. Immigration card names the August 2026 snapshot. Suggest-a-topic copy left as-is (it has to say the form doesn't store what you type).

Teacher Konami tips, hero nonpartisanship notes, and discussion questions that treat the explainer as a classroom object were left in place.

The standing story-first note for future updates is now in [`docs/VOICE.md`](docs/VOICE.md), and the README contribution guidelines point to it.

## [3.1.1] — 2026-08-18

**Patch — Space Race voice pass.** Rewrote `space-race.html` so paragraphs connect instead of stacking facts. Cut the "this page" asides that broke the story, gave Starliner a clear job-change before the dates, and matched the site's story-first tone (same facts, citations, and August 2026 snapshot).

## [3.1.0] — 2026-08-18

**Minor — leftover pass after v3.0.0: Suggest a Topic, August freshness on the remaining pages, Space Race reading-level pass, unused chrome removed.**

- **Suggest a Topic is now a first-class homepage section.** The empty Coming Soon rail stays gone. Students and teachers can send an idea with a short form that opens a prefilled school email (nothing is stored on the site) or use a GitHub issue template. Topic pages link to it from the masthead.
- **August freshness on Climate, Immigration, and Gun Violence.** Climate: Washington's August 1 wildfire emergency and burn ban, with DNR acreage from the governor's proclamation and NASA Earth Observatory for the July 31 "particularly dangerous situation" alert — replacing the April "fire officials expect" forecast. Immigration: August 2026 Visa Bulletin (India EB-3 still January 1, 2014; India EB-2 unavailable through the fiscal year), cited to Ogletree's table of the State Department chart. Gun Violence: Texas HB 3's armed-officer rule still unfinished as the 2026–27 year started (KXAN district check + Leander ISD's own August 5 update). Date stamps and stale-link notes moved to August 18. ICE and TRAC figures on Immigration keep their original July/June as-of dates; they were not re-invented.
- **Space Race 3-persona pass.** Nav no longer says "What's Happening Now." Jargon simplified (no "redesignates," "pathfinder," or "dissimilar redundancy"). Inline vocabulary + screen-reader definitions, classroom discussion questions, a dated-snapshot note, and a short "this is Social Studies, not rocket science" frame. Unused climate-clone CSS (`.stat-pair`, `.gh-steps`) removed from that page.
- **Cleanup.** Homepage teacher download line now names `site.css`, `site.js`, `fonts/`, and `images/`. Unused Coming Soon / planned-badge / small-item CSS removed from `index.html`. README no longer lists translation as if it already shipped.

## [3.0.0] — 2026-08-18

**Major — accessibility floor, shared CSS/JS, August freshness, chrome unification, and Space Race 2.0 ships.**

- **Accessibility.** Every page now has a skip link, A/A/A text-size controls (including the homepage), and a self-hosted OpenDyslexic webfont (`fonts/OpenDyslexic-Regular.woff2`, SIL OFL) instead of the cdnfonts stylesheet. The dyslexic font is scoped to reading text — not maps, nav, buttons, or SVG. `prefers-reduced-motion` stops the homepage ticker and other decorative motion.
- **Shared CSS/JS, still no build step.** Page-specific palettes, heroes, maps, and quizzes stay in each HTML file. Shared accessibility lives in `site.css` / `site.js`. Topic pages are no longer one-file islands; downloading a page for offline use also needs those two files plus `fonts/`.
- **Chrome unification.** All topic pages use the magazine masthead **Current Events Explained** (not "The Current Events Desk"). Sibling links live in `masthead-top`. Sticky `section-nav` is in-page `#` anchors only.
- **August freshness.** Homepage ticker rewritten from the live topics (no leftover March-era Iran strikes or "NEW" Ukraine/AI). US Elections stays the featured story and is no longer duplicated as a grid card. Midterms countdown is **77 days** from August 18 to November 3, 2026. House retirements: 60 as of August 2026; Senate: 11 as of July 2026 (not mixed with other "won't return" definitions). Iran lede/update: the June 17 60-day peace deadline expired August 17 with no deal (AP); Hormuz trickle of 3 vessels on August 16 and UAE missiles August 18 (CNBC). Ukraine: keeps first-half 2026 Al Jazeera 622 / net 97 km² and adds ISW's August 1 assessment (~38 km² July advance; spring-summer offensive, no operational breakthrough). Relative "Now" / "more than a week" phrasing removed from the Iran timeline.
- **Accents.** Iran moves to Persian lapis (`#245a8c`), Ukraine to deeper sky (`#2e6a9a`), AI to violet/ink (`#4a3f6b`), so they no longer share the default newsprint red with each other or with elections navy.
- **Climate density.** Washington's 51M / 96.1M emissions pair is now a trio (4th drought year). Greenhouse-effect section gets a 3-step restatement next to the existing diagram. No science claims rewritten.
- **AI rebalance.** School remains a focus pane. A sourced jobs/displacement section (Pew August 18, 2026: 71% of U.S. adults expect fewer jobs; February 2025 worker survey) is now part of the spine. "Talking to Animals Using AI" is demoted to further reading. Quotes and prior citations left intact.
- **New page `space-race.html`.** History of the first race (Sputnik, Gagarin, Apollo 11), a dated August 2026 Artemis snapshot (III as an Earth-orbit docking test; landing planned later), Washington's angle via Blue Origin in Kent (Boeing named carefully — Starliner is not built in Everett), historical Key People only, quizzes, videos, citations. Wired into the homepage grid (moved out of Coming Soon).

## [2.8.0] — 2026-07-29


**Minor — ship-readiness visual-polish pass: image-coverage gaps closed on three pages, climate-change.html gets its own accent color, graceful image-load-failure handling ported site-wide.**

- A final "does every page look ship-ready" pass, prompted specifically by image coverage, found four concrete gaps and fixed all of them: `us-elections.html` had only 3 `<img>` tags total, with four main content sections (`#branches`, `#elections-mechanics`, `#checks-balances`, `#local-representation`) entirely image-free — each now has a real, Wikimedia-Commons-sourced photo. `ukraine.html`'s `#empire` section (Shevchenko, serfdom, 1917 independence) was a pure text wall unlike every other section on the page — given an image. `ai.html` had four consecutive image-free deep-dives (`#school`, `#animals`, `#hinton`, `#agentic`), the site's worst text-wall stretch — each now illustrated. All nine new images verified individually on their own Wikimedia Commons file pages for license and subject match before use.
- `climate-change.html` moved off the shared default red accent (`#a02c2c`, still used by `iran.html`/`ukraine.html`/`ai.html`) onto its own distinct green/earth-tone accent (`#3d6b35`), matching the deliberate per-page accent treatment `us-elections.html`/`immigration.html`/`gun-violence.html` already have — closes a gap flagged as "reads unfinished," especially since this page was originally meant as the site's editorial-redesign reference. A reviewer follow-up caught and fixed a hero kicker-text contrast issue introduced by the new accent.
- Ported the graceful `onerror` image-load-failure fallback (previously only on `immigration.html`/`gun-violence.html`) to every `<img>` tag on `iran.html`, `ukraine.html`, `climate-change.html`, `ai.html`, and `us-elections.html` — including the nine images added by this same effort — so a failed image load degrades gracefully instead of showing a broken-image icon.
- A fresh, independent whole-batch verification pass (image-file existence, full `onerror` coverage, citation-count-unchanged, div balance, no duplicate ids, zero remaining old-accent-color references) confirmed all five touched pages clean with no regressions; no fixes were needed at verification time. That pass was static/structural only (grep, tag-balance, id-census) — no browser tool has been available in any session on this project, so visual rendering was not interactively confirmed and remains a standing limitation noted for future work.

## [2.7.0] — 2026-07-28

**Minor — Gun Violence & School Safety Policy page ships; site-wide 3-persona review pass fixes the other six pages.**

- New page `gun-violence.html` — "Keeping Schools Safe," the seventh topic on the site and the most nonpartisanship-sensitive page built to date. Built policy-and-prevention-first rather than incident-first: opens with a lockdown-drill narrative hook, then a dated update-pane reusing Immigration's differing-perspectives component for three genuinely contested current questions (assault-weapons ban, minimum purchase age, red-flag laws — each with named, equally-weighted DHS/AIC-style sourcing on both sides), scale/stakes data including a 50-state gun-death-rate choropleth map and a separate ranked school-shooting-incident table (Washington's rank called out on both), the Second Amendment and four landmark federal laws, school-safety measures actually tried (metal detectors, SROs, drills, threat assessment — including a UCLA researcher's on-record reversal of his own prior theory), how federal/state policy mechanics split, Washington's own extreme-risk-protection-order law and school-security funding, a four-country international comparison (Australia, Japan, Switzerland, Canada) held to an accuracy-not-balance standard as settled fact, a history timeline, two historical Key People (James Brady, Herb Kohl), a strictly balanced-pair "Groups Working on This Issue" resource section (one gun-violence-prevention org, one gun-rights org, identical treatment), and a closing discussion-question set for classroom use.
- Built through a 17-task plan with per-task review, three rounds of mid-build user-directed additions (a full section reorder to open with scale-of-the-problem rather than history, a 50-state comparison subsection, an opening narrative hook), and a closing round of fixes driven by an explicit 3-persona review (an AI roleplaying an 8th-grade student, an 8th-grade teacher, and a UX-focused edtech developer, each reading the live page independently) — which caught a genuine points-accounting bug (the max achievable score undercounted three discoverable easter eggs), a missing screen-reader wiring gap on the inline vocabulary tooltips, and a cold, unwarned opening into lockdown-drill content that a teacher reviewer flagged as needing a brief content note first.
- The 3-persona review method proved valuable enough to run against the rest of the site: `iran.html`, `ukraine.html`, `climate-change.html`, `ai.html`, `us-elections.html`, and `immigration.html` were each reviewed the same way and fixed in a follow-up 8-task pass. Ported text-size accessibility controls and the `.term` tooltip screen-reader wiring (`aria-describedby`) to every page that lacked them, added mobile-responsive stacking to every page's history timeline that was missing it, and brought `climate-change.html` up from having no interactive components at all to the site's full points/quiz/easter-egg engine (a gap traced back to an earlier planned visual-redesign prototype file that was never actually merged — corrected in project records). Page-specific fixes: a buried casualty detail on `iran.html` given its own callout, a reflection prompt added after `ukraine.html`'s Bucha passage, a new sourced misinformation/academic-integrity subsection and a regulation-tradeoffs counter-perspective added to `ai.html`, and a labeling-consistency fix on `immigration.html`'s DHS/AIC update-pane comparison.
- One real citation-accuracy bug was caught and fixed mid-effort: a school-shooting statistic on the Gun Violence page was cited to the wrong RAND report (one about school resource officers, which didn't contain the figures); corrected to the report that actually does.

## [2.6.0] — 2026-07-26

**Minor — site-wide reading-level pass on four pages, plus a new inline vocabulary-tooltip component ported everywhere.**

- A post-launch audit of `immigration.html` (comparing its two-pass reading-level work against the site's other five pages) found `ai.html` and `ukraine.html` were the furthest from the site's 5th–6th grade target — both predate the `.term` inline tooltip component introduced with Immigration, so jargon was defined inline via parentheticals (e.g. "the Bolsheviks (the communist revolutionaries who created the Soviet Union)"), which reliably bundles multiple ideas into one long sentence. `iran.html` and `us-elections.html` were already close to target and needed only light touch-ups.
- `ai.html` and `ukraine.html`: full reading-level rewrites, following the same process and integrity bar as Immigration's own rewrite — every direct quote, citation, and `.vocab` box verified byte-identical before and after (ukraine.html: 22 quotes independently re-verified, including sensitive Holodomor/wartime quotes; citations and vocab boxes confirmed unchanged on both pages). The `.term` tooltip component (hover- and keyboard-focus-triggered, ported from `immigration.html`) now carries the jargon that used to live in parentheticals — 12 tooltips added to each page.
- `iran.html` and `us-elections.html`: light touch-ups only — a handful of clearly-bundled em-dash sentences split, `.term` ported for site-wide consistency (with each page's own accent color, not a shared hardcoded one — `us-elections.html` keeps its deliberate navy/gold palette). `us-elections.html`'s two touched sentences (Speaker of the House, Senate Majority Leader) were independently verified against the party-swap nonpartisanship test; `iran.html`'s existing attribution language (e.g. "though the Israeli military denied being responsible") was verified character-for-character unchanged.
- One real mistake caught and fixed mid-effort: an early fix attempt on `ai.html` moved a period from outside to inside a closing quotation mark on three quotes, which turned out to still not match the original — the original quotes had no trailing punctuation at all, since they sat mid-sentence rather than at a sentence's end. The correct fix restructured the surrounding sentences so each quote could stay in its original grammatical position instead of forcing punctuation next to it.

## [2.5.1] — 2026-07-26

**Patch — fixed broken cross-page navigation on climate-change.html, introduced by v2.5.0's Immigration site-wiring.**

- A follow-up site-wide audit (reading level + navigation, run right after the Immigration launch) caught that the sibling-nav link added to `climate-change.html` in v2.5.0 had landed in the wrong nav bar — an orphaned `<a href="immigration.html">` sitting alone atop the in-page `section-nav`, while the actual sibling-links list in `masthead-top` never got Immigration added at all. Moved the link to the correct bar.
- The same audit also surfaced two larger, deliberately-deferred follow-ups, tracked for future work: (1) a site-wide inconsistency in where hub/sibling nav links live — older pages (`iran.html`, `ukraine.html`, `ai.html`, `us-elections.html`) put them in `section-nav`, while `climate-change.html`/`immigration.html` put them in `masthead-top` instead; every page still reaches every other page, just via a different location — and (2) a reading-level pass on `ai.html` and `ukraine.html`, ranked as the two pages furthest from the true 5th–6th grade bar `immigration.html` reached in its v2.5.0 build (both pages predate the `.term` tooltip component and currently carry jargon via inline parentheticals instead).

## [2.5.0] — 2026-07-26

**Minor — Immigration & U.S. Policy page ships, built directly in the editorial design system.**

- New page `immigration.html` — "A Nation of Immigrants," the sixth topic on the site and the first genuinely new topic since the site-wide editorial redesign completed. History-first structure: colonial-era immigration (with Indigenous peoples' prior presence and the transatlantic slave trade both stated explicitly, not folded into a "waves of immigration" narrative), the Great Waves (Ellis Island, Angel Island, the Chinese Exclusion Act), the 1924 national-origins quota system, the 1965 Immigration and Nationality Act, how the system works today (visa/green-card categories, naturalization, asylum vs. refugee status, and a neutral explainer of ICE's origin and legal authority), a dated update-pane, Washington's Immigration Story (Scandinavian settlement, Japanese American incarceration at Minidoka, Southeast Asian refugee resettlement via Camp Murray), a history timeline, two historical Key People (Irving Berlin, Emanuel Celler), videos, and resources.
- Built through a full 16-task plan with per-task review and a dedicated final verification pass — every citation independently fetched and confirmed to support its specific claim (one mid-build citation mismatch in the update-pane was caught and corrected before shipping, along with a 404'd link and two dead easter-egg code paths).
- Introduced one new, deliberately narrow-scoped component: a side-by-side "differing perspectives" block, used only for genuinely contested present-day claims in the update-pane's ICE-enforcement coverage (e.g., named, sourced, equally-weighted positions from DHS and the American Immigration Council on who is being arrested) — settled history elsewhere on the page (the Chinese Exclusion Act, the 1924 quota system, Japanese American incarceration) is stated as plain fact, not run through this component, since accuracy rather than false balance is the standard for settled history.
- Reading level went through two dedicated passes: an initial simplification plus inline vocabulary tooltips (hover- and keyboard-focus-triggered, for terms like green card, naturalization, and asylum), followed by a second, more aggressive rewrite to a genuine 5th–6th grade target after the first pass was judged still too advanced — every citation, direct quote, and tooltip definition was independently verified byte-identical before and after this second pass.
- `index.html`: Immigration moved from "Coming Soon" into the live topic grid (reusing its own hero image, an 1887 engraving of immigrants viewing the Statue of Liberty, rather than sourcing a duplicate asset); the vacated "Coming Soon" slot backfilled with the site's next two roadmap topics, Gun Violence & School Safety Policy and Space Race 2.0. All five other topic pages received a new cross-page nav link to Immigration.

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

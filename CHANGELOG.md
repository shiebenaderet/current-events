# Changelog

All notable changes to this site are documented here. Versioning follows the scheme in `README.md`'s **Versioning** section (site-wide `MAJOR.MINOR.PATCH`, bumped once per finished effort — see that section for what qualifies as each level).

## [4.1.0] — 2026-08-30

**Minor — every substantive section on the site can now be completed, and the progress bar counts to the right total.**

**Ten sections could be read in full and never earn a check.** The tile menu marks a card `·` when it has been opened and `✓` when its quiz has been answered, but a tile can only earn the check if its section has a quiz to key off. After 4.0.0, 31 of 85 tiles had none. Twenty-one of those are reference material — Key People, Videos, Sources, Keep Learning — which a student browses rather than works through, and the opened dot is the right signal for them. The other ten were real sections with real claims: five on ai, the dated *Where things stand* pane on iran, space-race and us-elections, ukraine's Holodomor, and iran's Hormuz update. Those now have quizzes, so every substantive section on all eight pages can be finished. Coverage is 64 of 85 tiles, and the 21 remaining are unquizzed by design.

**Each question asks for the section's claim, not a number from it.** A student who knows only that the topic exists should not be able to guess. The Hinton question turns on his leaving Google in 2023 rather than the Nobel a year later; the Pew question asks what a survey of expectations can and cannot tell you; the Holodomor question asks which detail makes a famine engineered rather than natural, and the answer is the sealed border, because weather does not seal borders. The three *Where things stand* panes are dated and volatile, so their questions ask what the snapshot claims rather than a figure that expires — iran's asks how the strait could be called "open and operating" in the same week three ships crossed it.

**The progress bar was counting against the wrong denominator.** `addPoints` clamps with `Math.min(pts + n, MAX_PTS)`, and on six of eight pages `MAX_PTS` was below the points a student could actually earn: immigration counted 9 against 13 available, ukraine 10 against 14, iran 10 against 13. The bar filled early and every point after that silently did nothing — including, on iran, three whole quizzes. `MAX_PTS` is now each page's real reachable total, quizzes plus bonus points, which also absorbs the new questions. No unlock threshold was stranded by the change.

**A defect the gates could not see.** The new buttons were first placed just before each section's closing tag, which made them direct children of `<details>` — outside `.focus-pane` and `.update-pane`, below the pane's background, and free of the `max-width` that centres everything inside it. Every check passed: valid HTML, balanced tags, correct section, working quiz. It was wrong on screen only. Parsing the pages and asking what each button's *parent element* actually was is what caught it, and all ten now sit in the same content box as the fifty-four buttons that came before them. This is the same lesson 4.0.0 recorded twice — the measurable things keep being right while the depicted things go wrong — and `docs/PLAYBOOK.md` now carries the check as a step rather than as a warning.

## [4.0.0] — 2026-08-29

**Major — the landing layer: every topic page now opens on a five-minute primer, with the rest behind a menu of cards.**

**What prompted it.** The site's mission is a quick, engaging primer on an issue in the news — five to seven minutes. Measured against that with `tools/reading_time.py`, not one page was close: gun-violence ran 77 minutes, ai 48, immigration 47, and even climate-change, the shortest substantial page, ran 18. A single section of gun-violence was longer than the entire intended experience for the topic. The homepage advertised the problem honestly: *70–80 min*, *40–50 min*, *30–40 min*. The pages had become good long-form articles, which is not what they were for.

Length was only half of it. The whole interactive surface across eight pages was 59 quiz buttons plus reading supports — before-you-read blocks, timelines, videos. Every one of those helps a student get *through* prose. Nothing let a student learn by doing. Successive releases had optimised the reading experience instead of asking whether reading should be the primary mode.

**What changed.** Each page keeps one file. A newly written primer of roughly 650 words sits on top, with one interactive centrepiece, and every existing section moves — untouched — into a native `<details>` card. Opening a card closes the others and hides the primer, so a card is the whole view rather than a stop on a long scroll; finishing one returns you to the menu with that tile marked. Nothing was deleted anywhere: **the five to seven minutes is a property of the entry point, not a ceiling on the topic.** That distinction is the whole design, and it is the same principle 3.7.0 applied to Study Mode — shortening prose usually deletes the connective tissue that carries the meaning (Davison & Kantor, 1982), so the fix is a shorter door, never a shorter room.

`tools/verify_invariants.py` proves it rather than promising it. Every page was wrapped as a pure structural change first and had to report exact equality on citation and gloss counts, with byte-identical `reading_time.py` output, before any primer was written.

**Reading level now follows commitment.** The class this is written for includes many students learning English and many reading well below grade level, and they all pass through the primer. So on every page the primer is now the plainest text on it, and difficulty rises with the reader's choice to go deeper. Where a first draft came out harder than the sections it introduced, the fix was always additive: on climate-change the primer went from FK 8.13 to 6.02 while getting *longer*, 559 words to 613. Plainer and longer is elaboration (Beck, McKeown, Sinatra & Loxterman, 1991); plainer and shorter would have been the failure that guardrail exists to prevent.

**Typography and contrast, site-wide.** Body text is now Atkinson Hyperlegible Next at 18px on a 1.75 line height, with `html { font-size: 100% }` so a reader's own browser setting wins. The dyslexia-font toggle was removed entirely: pooled *g* = −0.04 across 15 studies and 688 readers, with most children in those studies preferring Arial — it displaced real scaffolding with a typography change that felt like an intervention. Study Mode kept its inline word meanings, lost its section bar, and is now called what it does: **Word meanings**. `--ink-faint` was failing AA at 4.35:1 on warm paper across all nine pages — it carries captions, minute labels and photo credits — and is now 5.12:1. The full palette audit reports zero failures.

**Eight interactives, one per topic, each teaching a mechanism rather than a verdict.** Drag through 800,000 years of trapped air and watch CO₂ cross a ceiling it had never crossed. Run Washington's top-two primary on seven real candidates and watch five of them — four of them Democrats — drop out. Step through Artemis' finish line moving from 2024 to 2028. Teach a real nearest-neighbour classifier, then switch off every lemon and watch it confidently misname them. Pick a state and see its gun-death rate against the other forty-nine. Watch a year of fighting in Ukraine vanish against the territory already held. See the shipping lanes of Hormuz drawn to the same scale as the strait. Set your age and learn how old you were when a visa application still in the queue was filed.

Every figure in those was fetched and read at its source. Where a number could not be verified to that standard, the interactive was changed rather than the number invented — the gun-violence centrepiece was redesigned for exactly that reason.

**Corrections found along the way.** us-elections was describing a pre-primary world 25 days after the primary, listing seven candidates for a congressional seat when two had advanced, and citing a filing story for a claim about results. Its seat math no longer matched its own sources. Two hardcoded "68 days until Election Day" countdowns — one on the elections page, one in the homepage ticker — are now computed from the date, because a typed countdown is wrong every day after it is typed.

**Also:** the homepage shows how far a student has got on each topic; card time promises were rewritten from *70–80 min* to *5 min · more if you want it*; `tools/reading_time.py` gained a `--landing` gate that fails a build when an entry point exceeds seven minutes; `AGENTS.md` no longer claims the project has no tests.

## [3.7.0] — 2026-08-28

**Minor — Study Mode: a reading-support toggle, shipped site-wide across all 8 topic pages.**

**What it does, and why it's a toggle and not a "simplify" button.** A 💡 Study Mode button
in the fixed accessibility controls at the bottom-right of the screen — the same stack as the
text-size buttons and the dyslexia-font toggle, in the same place on desktop and phone —
reveals the definition of every glossed word inline, right next to the word,
and adds a small bar that tracks which section the student is reading and previews it.
Nothing about the article text itself changes — turning Study Mode off returns the page to
exactly what it looked like before. That distinction was a deliberate design choice, not an
afterthought: a "simplify the text" button would be a modification disguised as an
accommodation, quietly handing the students who need the most support a thinner version of
the same page. Shortening prose usually deletes the connective tissue that carries the
meaning between sentences (Davison & Kantor, 1982) — the readability score goes down while
comprehension gets *worse*, for exactly the students the button exists to help. Study Mode
adds support instead of removing content, which is why every gloss it reveals was already
sitting in the page before this feature existed.

**The gloss reveal is pure CSS.** Every `.term` on the site was already followed, inline, in
the same sentence, by a screen-reader-only `.term-desc` span wired to the term through
`aria-describedby` — the tooltip mechanism the site has shipped since its redesign. Study
Mode's CSS layer does exactly one thing to that markup: it un-hides an element that was
already there, in the sentence, in the right place. No JavaScript touches the DOM for this
part, no new element is created, and nothing about the page's accessibility tree changes —
the description was already programmatically associated with its term for screen-reader
users; Study Mode just makes it visible to everyone else too.

**The Key Word injector, and the guard that keeps it out of quotations.** "Key Word" boxes
(the `.vocab` sidebars) are a second source of definitions that don't have an inline
`.term`/`.term-desc` pair. Study Mode's injector finds each Key Word's first plain-prose
occurrence and splices its definition in beside it — but a term can just as easily first
occur inside somebody's quoted words, and scaffolding must never go inside a source. The
guard was originally written to protect `<blockquote>`, `<q>`, and `<cite>` — tags this site's
markup contains **zero** of. Every quotation here is either a `.pull-quote` div or bare quote
marks inline in ordinary prose, so the guard had to be extended to check for both, and quote
detection had to run over the *containing block's* full rendered text rather than one text
node at a time — a quotation can be split across nodes by an ordinary `<strong>` or `<a>`
sitting inside it. Verification surfaced two real exposures the tag-only guard would have
missed: `ai.html`'s "Computer Vision" occurs first inside a Geoffrey Hinton pull-quote
("...convinced all the people doing **computer vision** that what they were doing was
wrong..."), and `ukraine.html`'s "Coalition of the willing" occurs first inside an inline
quotation ("a group of **35 countries** called the 'coalition of the willing' met in Paris").
Both are now protected — the injector finds a safe container to place a sibling gloss beside
for one, and skips the term entirely when there's no safe container to attach to for the
other — and Task 8's integration harness (below) checks every injected node on every page for
exactly this failure mode, not just these two known cases.

**The injector also refuses to gloss a word the page already glosses.** A Key Word box can
name a word that is *also* an authored `.term` — 11 of the 55 do. For those, the injector's
first plain-prose match was the `.term` span itself: it split the text inside the span and
printed the same definition a second time, back to back with the one the CSS layer reveals,
underlined as if it were part of the term. Two more places are off-limits for the same
reason: a `.term-desc` (splicing a gloss into one rewrites the sentence a screen reader
announces for a *different* term) and a `.cite-inline` source label, which is not prose at
all. So: a match inside a `.term` ends the search and the box is recorded as **skipped** —
the student already gets that definition — while a match inside a `.term-desc` or
`.cite-inline` just isn't a legal site, and the walk keeps looking. All three are checked
against every ancestor of the matched text node, not only its immediate parent. Across the
corpus this moves 7 Key Words from *inline* to *skipped* (25 → 18 inline, 2 → 9 skipped);
orphans and the one sibling-aside are unchanged.

**Gloss text stops at the definition.** The injected text came from
`defEl.textContent.trim()`, which swallowed the `.cite-inline` anchor sitting inside the
Key Word's own paragraph — students read "…are the main ones.NASA", "…from proxies.NOAA",
"…generating electricity.U.S. EIA", and a bare "src" on `us-elections`. The definition is now
assembled from the paragraph's text nodes with each citation anchor dropped by node identity
(the same identity-based removal the section bar's primer derivation already used), never by
a regex over the joined string — so a definition that legitimately contains its own source's
name, like Artemis's "NASA's program to send astronauts back to the Moon", keeps it.

**The section bar.** Fixed to the *bottom* of the screen, not the top: the site already has a
sticky masthead and section-nav up there, and `body{overflow-x:hidden}` (needed elsewhere on
the page) breaks `position:sticky` for any descendant, so `position:fixed` was the only option
that actually stays put. An `IntersectionObserver` watches each section heading and swaps the
bar's text to that section's own "Before you read" primer as the student scrolls past it.

**`?study=on` / `?study=off`.** Either can be appended to any page URL to set the starting
state for that load. Only `on` is remembered for later pages — `off` deliberately is not. A
teacher's Canvas link is often the *last* Study Mode state a student's browser sees; if
`?study=off` persisted the way `?study=on` does, one assignment link with the parameter left
off by habit could silently clear a setting a student had turned on and relied on for the
rest of the site. `on` writes through to storage; `off` only ever applies to the page it's on.

**Gloss backfill: `iran` and `space-race`.** These two pages had noticeably fewer `.term`
tooltips than the rest of the corpus, so 6 new inline glosses were added to each (12 total) —
`retaliatory`, `ceasefire`, `memorandum`, `Ayatollah`, `currency`, and `Revolutionary Guard` on
`iran`; `satellite`, `capsule`, `crewed`, `commercial`, `lunar`, and `uncrewed` on
`space-race` — chosen for recurrence and narrative load-bearing weight, with terms already
covered by an existing Key Word box explicitly excluded to avoid double-glossing. The
`/reading-intervention` skill's G6 ceiling-preservation diff classifies both pages'
change as `elaboration` with `terms_lost: []` on both — the check that exists specifically to
catch a well-intentioned addition that accidentally deletes a concept while wrapping it.

**Dark-pane contrast fix.** `body.study-mode .term-desc` inherits `--ink-light` (`#4a4a4a`),
which measures only **1.96:1** against the `--ink` (`#1a1a1a`) background used by
`.update-pane`, `.update-box`, and `.focus-pane` — well under WCAG AA's 4.5:1 floor, and bad
enough to make roughly 25 pre-existing glossed terms across `ai`, `gun-violence`,
`immigration` (worst — 8 in one pane), `space-race`, and `ukraine` effectively invisible
inside those panes. The site's original tooltip CSS had already solved this same problem, per
page (e.g. `immigration.html`'s `.update-box .term::after{background:#fff;color:var(--ink)}`)
— this follows that existing precedent rather than inventing a new one: `.term-desc` inside a
dark pane now gets `#d8d2c8` instead, which measures **11.58:1** on `#1a1a1a`. The light-
background case is unchanged and still measures **8.42:1** (`#4a4a4a` on `--paper` `#fbf9f4`).
The two nodes Study Mode *injects* — `.sm-gloss` and `.sm-gloss-aside` — inherit the same
`--ink-light` and needed the same override: `space-race`'s "Artemis" gloss lands inside
`.update-pane` and measured the identical 1.96:1. Both now take `#d8d2c8` (11.58:1) inside a
dark pane, and the aside's left rule switches from `--accent` (a dark ink, invisible there)
to the `rgba(255,255,255,.35)` those panes already use for a divider.

**Two more keyboard/layout fixes on the same controls.** The Study Mode button's focus ring
was `outline:2px solid var(--accent)` while its own `.active` state sets
`background:var(--accent)` — the same colour, so a keyboard user saw **no** focus indicator
at all whenever the feature was on (1.00:1), and about 1.7:1 when it was off. It now uses the
white ring its neighbour `.dyslexic-toggle` already used: 12.63:1 on the inactive `#333`, and
5.76:1 on the lowest-contrast page accent. Separately, `#sm-bar` spans the full width at
`bottom:0` while `.a11y-controls` is fixed at `bottom:20px;right:20px` with a far higher
`z-index` — the controls sat on top of the bar's right end and the summary text ran
underneath them — and nothing reserved space for the bar, so it permanently covered the last
~40px of every page's footer. The bar now reserves the width of the control stack on the
right (tightened at the mobile breakpoint), the section label truncates instead of crowding
out the summary, and `body.study-mode` carries bottom padding so the bar never covers
content. The collapsed bar is also genuinely one line now: the base rule never set
`white-space:nowrap`, which left `#sm-bar.is-open .sm-bar-txt{white-space:normal}` overriding
nothing.

**Tap-to-open tooltips stand down in Study Mode.** `site.js`'s `.term` tap handler kept
toggling `.is-open` and calling `preventDefault()` while Study Mode's CSS hid the tooltip and
set `cursor:default` — a tap that visibly did nothing. The handler now returns early while
`body.study-mode` is on; the definition is already printed inline beside the word.

**Testing.** `tools/study-mode.test.js` unit-tests every pure helper (40 tests). A full
browser round-trip isn't possible in this environment, so `tools/study-mode.integration.test.js`
replaces it: a hand-rolled HTML parser and minimal DOM (node builtins only — no new
dependency) load each of the 8 real pages, run the actual `study-mode.js` source in a `vm`
sandbox against that DOM, and drive the real `apply('on')`/`apply('off')` lifecycle. For every
page it checks that nothing is injected before activation, that activation injects a gloss
and/or `#sm-bar` exactly where the page's own content warrants one, that **no injected node
ever descends from a `blockquote`/`q`/`cite`/`.pull-quote`** (verified as a real check, not a
tautology, by a negative control that disabled the guard and confirmed the harness catches
the resulting violation), that deactivation removes every injected node and restores the
page's serialized DOM to be byte-identical with its pre-activation state, and that activating
twice with no teardown between never double-injects. 40 assertions, all 8 pages, all passing.

**Deferred to v2.** Read-aloud / text-to-speech support; a writing slot (no page on the site
has one yet, Study Mode or otherwise); the 27 orphan Key Words the injector surfaced across
the corpus — glossary entries whose term never actually occurs in that page's own prose,
which is a pre-existing content gap Study Mode's own verification tooling made newly visible
rather than something this feature introduced; and the uneven `.term`-vs-Key-Word split that
remains on the six pages this cycle didn't backfill (`us-elections` has one inline `.term`
gloss against six Key Word orphans, for instance) — the site's own gloss mechanism is still
applied unevenly page to page, a limitation carried forward from v3.6.0 and not yet closed.

## [3.6.0] — 2026-08-28

**Minor — site-wide `/reading-intervention` sweep: 8 quiz items rewritten across 5 pages.**
Extends the v3.5.0 audit from `us-elections` to the whole corpus (37,574 words, 9 pages).

**What the sweep found.** The K5 primer-spoiler collision found on `us-elections` is
systematic, not local: the v3.4.0 "Before you read" blocks were written to preview each
section, the quiz banks were written earlier to test each section, and the two were never
checked against each other. 8 of 58 quiz items had their answer stated in the primer sitting
directly above them — in several cases word for word.

| page | items | what the primer gave away |
|---|---|---|
| `ukraine` | q1, q2, q3 | "largest country entirely inside Europe"; "a powerful state called Kievan Rus'"; Shevchenko writing in Ukrainian while banned |
| `space-race` | q1, q3 | Sputnik / Soviet Union / 1957 / orbit; "Blue Origin is headquartered in Kent" |
| `immigration` | q1 | "Indigenous nations had been across North America for thousands of years" |
| `gun-violence` | q7 | "approving Initiative 1491 in November 2016" |
| `iran` | q3 | "About half of Iranians are under 35" (vs. answer "About 50%") |

Every rewrite keeps the primer's fact **in the stem** and asks for something only the passage
supplies — Ukraine's western border countries, who founded Kievan Rus' and when, what
Shevchenko was born into, what ordinary people could actually do with Sputnik's signal, what
a Human Landing System is for, the Library of Congress's own word for colonization
("an invasion of territory"), and that extreme risk protection orders are a state-level tool
whose rules each state writes itself. No item was deleted and no item got easier; each now
tests one level deeper than it did.

**What the sweep cleared.** Worth recording so it is not re-litigated:

- **Zero myth-checklist findings site-wide.** `immigration` was the only page with triggers,
  and all four are correctly handled: both "empty land" uses *negate* the myth rather than
  assert it, the DHS "worst of the worst criminal illegal aliens" line is attributed inside a
  quotation with its source, and "Puyallup Assembly Center" / "Minidoka War Relocation Center"
  are the camps' proper names sitting beside an explicit Densho-sourced gloss on why
  historians say "incarceration camp" instead. That page had already done the work.
- **Zero images without alt text**, across all 9 pages.
- **`space-race` reads below band** (FK 6.48 against a 6.51 floor) — the direction `bands.md`
  calls the alarm that matters. Not a defect here: v3.4.0 already measured this as a *topic*
  effect (rockets are concrete), and the v3.1.x rewrite moved it 6.6 → 6.5. Left alone.

**Known limits of the scanner** (it is a locator, not a judge). It is blind to numeric answers
— `iran q3` was caught only because "About 50%" and "about half" happen to share a stopword,
and had to be re-added by hand. It also over-fires on the `"Before you read N min"` time label,
whose digits collide with numeric answers; that prefix is now stripped before matching.
`us-elections q2` and `gun-violence q9` are confirmed false positives: the first shares only
"House"/"Senate" and never the two-thirds figure, the second names a *different* initiative
(1491/2016 vs. 1639/2018).

**Still open across the corpus:** no page has a writing slot (Q7/Q8); `us-elections` has zero
`.term` tooltips while `gun-violence` has 18, so the site's own gloss mechanism is applied
unevenly; and the `us-elections` items from v3.5.0 remain open.

## [3.5.0] — 2026-08-28

**Minor — three scaffold repairs on `us-elections.html`, from a `/reading-intervention` audit.**
Additive only: 3,382 → 3,531 words, concepts 362 → 381, zero terms lost. The skill's own G6
ceiling-preservation diff classifies the change as `elaboration`, which is the point — the
Beck, McKeown, Sinatra & Loxterman (1991) result is that making social studies text more
comprehensible makes it *longer*, and any repair that shortened the page would have been
withheld by the suppression lint instead of shipped.

The audit ran clean on the prose itself. No causal gaps, no dangling referents (all 23
locator candidates resolved on adjudication — 21 against the preceding sentence, 2 against an
`<h3>` the extractor strips but a reader sees), no asserted-relevance anti-patterns, no
altered quotations. Flesch-Kincaid 9.51 → 9.56, in band (6.51–10.34) both times. Every finding
that survived was about the *apparatus* around the prose, not the prose.

- **The primer no longer answers its own quiz.** The "Before you read" block for Section 2
  states "Federal judges are never elected at all"; quiz `q3` asked "Which of the three
  branches of government is NOT filled by election at all?" — the primer supplied the answer
  verbatim before the reader reached the question. `q3` now gives that fact in the stem and
  asks what the setup is *for*, which is answered only in the judicial paragraph ("rule based
  on what the law actually says, without worrying about winning votes to keep their job").
  Distractors rewritten; "represent the voters who live in their district" is there because
  it is the actual misconception.

- **The Indian Citizenship Act, June 2, 1924, added to the voting-rights timeline.** The
  timeline ran 1787 → 1870 → 1920 → 1965 → 1971 with zero occurrences of `indigenous`,
  `native american`, `tribal`, `tribe`, or `1924` anywhere in the file. Washington's SB 5433
  (2015) makes tribal sovereignty curriculum a requirement in every K–12 classroom in the
  state, endorsed by all 29 federally recognized tribes. The new entry carries the Act's own
  words ("citizens of the United States") from the signed original at the National Archives,
  then the part that makes it belong in *this* timeline: citizenship did not come with a
  ballot, Arizona and New Mexico barred Native voters until 1948, and the fight ran into the
  1950s — the 15th Amendment's promise-then-withholding pattern happening a second time.
  Closes in the present tense (29 sovereign tribal governments in Washington today), because
  past-tense-only tribal subjects are the vanishing-Indian framing the myth checklist flags.

- **38 vs. 39 signers reconciled.** "38 delegates signed the finished Constitution" was
  correct and correctly cited — it matches the article's own National Archives source
  verbatim. But a student who checks anywhere else meets 39 and concludes the page is wrong.
  Added the clause the source carries and the page had dropped: George Read signed a second
  time for the absent John Dickinson, so the document holds 39 signatures and 38 signers.
  Two true numbers, one document, and a stated reason they differ.

**Verification.** Every new claim was fetched this run and matched as an exact substring, per
the skill's lateral-reading rule: the signed Indian Citizenship Act (NARA, image of the
original, approved June 2, 1924), NARA's *The Text Message* on the post-1924 state barriers,
NARA's *How Did It Happen?* for both signer counts, and OSPI's *John McCoy (lulilaš) Since
Time Immemorial* for the 29 tribes. The 26th Amendment's "fastest any amendment has ever been
ratified" remains **unverified** and is untouched.

**Still open on this page** (reported, not fixed): the Voting Rights Act entry describes
Section 5 preclearance in the past tense without noting it has not operated since *Shelby
County v. Holder* (2013); the two amendment quotations have no sourcing question; there is no
slot where a student writes about the text. The passage-independence probe (Q1) could not run
— it requires a declared learning target, and this page has none.

## [3.4.0] — 2026-08-27

**Minor — "Before you read" entry blocks on every substantial section, and honest reading
times.** 56 blocks across eight pages, ~2,400 new words against ~36,000 existing. No prose,
citation, or content edits: every `cite-inline`, `.term`/`.term-desc` pair, `<div>` balance,
`<img>`/`onerror` and id set was captured before the pass and re-verified identical against
`b2a76a3` after it.

**What the measurements changed.** The effort began from a reasonable hypothesis — the site
has no reading levels, so below-level readers are unserved — and measuring the corpus
corrected it twice.

First, reading level is largely a *topic* effect. Flesch-Kincaid across the pages ran 6.5
(space-race) to 9.9 (gun-violence) against a stated 5th–6th grade target, but the words
driving the gap are the subject itself: `immigration` appears 58 times, alongside
`nationality`, `naturalization`, `legislature`, `congressional`, `ammunition`. Space Race
scores 6.5 because rockets are concrete, not because it is better written. A site-wide FK-6
target would have fought the vocabulary the standards require, and lost.

Second, the v3.1.1/v3.1.2 story-first rewrite did **not** move reading level: Iran 9.1 → 8.9,
gun-violence 9.9 → 9.9, space-race 6.6 → 6.5. Voice and reading level are independent levers,
so "rewrite everything in the Space Race voice" was never going to be a reading-level
strategy. Recording that here so it is not re-attempted.

The lever is structure, not vocabulary — which also matched the reported classroom use:
sections are already assigned individually, the wall of text loses students at the on-ramp,
and students gravitate to timelines and quizzes over continuous prose.

- **The blocks.** One `<aside class="before-read">` per substantial section, between the
  section head and the article: 2–3 plain sentences, a measured reading time, and a "First:"
  link only where a section genuinely depends on an earlier one. Navigational sections
  (videos, sources, Key People) and anything under 150 words get none. Every block measures
  below the reading level of the page it sits on — the widest gaps are immigration (7.6
  against 9.8) and gun-violence (7.2 against 9.9), which is exactly where it matters most.
  The blocks are where "naturalization" becomes "becoming a citizen" while the section keeps
  the real term behind its `.term` tooltip.
- **Honest times.** Every figure now comes from `tools/reading_time.py` at 130 wpm. Two kinds
  of error were live: gun-violence was advertised at 25–45 min against a measured ~75, and
  the two shortest pages were advertised as *longer* than they are. Its homepage card now
  also says "Long read — assign by section", because a 75-minute page is a planning fact a
  teacher should have before the period, not after.
- **Tooling, checked in.** `tools/reading_time.py` is the single source of truth for every
  minute figure; `tools/verify_invariants.py` is the regression suite this repo otherwise
  lacks. Re-run both after a content refresh.
- **`.on-dark` block variant.** The dated "Situation Update" pane and the `.focus-pane`
  insets are dark on every page, so blocks there invert rather than rendering unreadable.

**What went wrong, and how it was caught.**

- **The section-splitter missed the most-assigned section on every page.** The first version
  of `reading_time.py` split on `<div class="sec-head">`, but the dated "Where Things Stand"
  pane uses `.update-head`. That silently dropped it, undercounting every page —
  gun-violence read 8,749 words instead of 9,715 — and yielded 48 blocks instead of 56.
  Caught by extracting the script from the plan and running it against the real corpus
  instead of trusting it. Splitting on `<h2>` fixes it.
- **Every `.br-time` was one minute short.** Labels were written from pre-block measurements,
  and then the blocks' own words pushed 24 of the 56 sections across a rounding boundary.
  Caught by the plan's own drift check, which compares each rendered label against a fresh
  measurement; corrected by iterating until it converged.
- **A block described the page to the student.** The Iran update block ended "This is the
  longest section on the page" — the same violation as "further down this page", which
  `docs/VOICE.md` exists to prevent. The minute label already carries that information.
- **The pilot passed the reading-level gate on a rounding edge.** First pass measured FK 7.99
  against a `< 8.0` threshold. Treated as a failure rather than a pass; splitting three
  compound sentences brought it to 6.71.
- **Two drafted blocks were wrong until the sections were actually read.** The elections
  block said voters fill two branches directly; the section's point is that only Congress is
  directly elected, the president comes through the Electoral College, and judges are not
  elected at all — the draft would have introduced the misconception the section exists to
  correct. And the Space Race Washington block nearly flattened "Boeing's Starliner is
  assembled in Florida, not Everett" into "Boeing builds spacecraft in Washington."

**Deferred, deliberately.** Splitting `gun-violence.html` (77 min) would break Canvas links
teachers have already made; revisit after a term of classroom use. Converting dense prose
into `.stat-trio`/`.tl-item` components is a content edit that moves cited claims between
elements, and doing it alongside 56 new blocks would make a citation regression hard to
localise — its own effort. The remaining font-size consolidation from v3.3.0 folds into that.

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

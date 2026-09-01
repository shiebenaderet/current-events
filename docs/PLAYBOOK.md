# Playbook — building or converting a page

Standing reference, alongside [`VOICE.md`](VOICE.md). VOICE governs how
sentences sound; this governs how a page is built and what must pass before
it ships. Written after converting all eight topic pages for v4.0.0, from
what actually went wrong rather than from what was planned, and extended as
later work found more of it.

Most of this is about topic pages; the homepage has its own short section
below.

Read [`VOICE.md`](VOICE.md) first. Nothing here overrides it.

---

## The shape every topic page has

```
hero  ─────────────────────────────────────────────
primer          ~650 words, 5 min, ONE interactive
                the only thing everyone reads
quiz            one question on the primer
─── tile menu ─────────────────────────────────────
  9-13 cards, ordered by data-order
  ·  opened      ✓  opened and quizzed
─── nothing renders below the menu ────────────────
```

Opening a card closes the others and hides the hero, primer and menu, so a
card is the whole view. Its sticky header says **← Overview**. Every card
ends with the menu again.

---

## The homepage has one rule: name each topic once

`index.html` is a door, not a page of its own, and it earns nothing by
repeating itself. For a while it listed the same eight topics three times — a
sticky nav, a scrolling ticker, and the cards — with GitHub linked four times
and the school site three, all above the first sentence a student would read.
That is **34 clickable choices** before any reading happens.

- **One list of topics.** The cards are it. A nav above them is a second copy
  of a menu the reader has not reached yet. (`.section-nav` is gone from the
  whole site; v4.0.0 removed it from the eight topic pages, v4.11.0 from here.)
- **Nothing above the fold moves.** The "Latest" strip used to scroll
  infinitely: unpausable from the keyboard, hard to read for exactly the
  students this site is for, and competing with the lead story for attention.
  It is now static, four headlines, and every entry is genuinely a headline —
  "contribute on GitHub" is a link, not news.
- **Teacher and developer links live in the footer**, where someone looking
  for them will look and a student will not trip over them.

When judging whether the homepage is too busy, count the choices rather than
describing the layout. `34 → 21` is an argument; "cleaner" is not.

---

## Order of work, and why it is this order

### 0 · Content review, before touching structure

Content first because section headings become tile titles, baked into
`data-title`. Convert first and a later refresh renames a section, and the
wrap has to be redone.

- Check every dated claim against its source. **Fetch and read it.** A live
  URL is not verification — us-elections cited a story headlined "Seven
  candidates seek District 1 congressional seat" for a claim about who won
  the primary. Real newspaper, right race, written three weeks too early.
- **Check the claims that sound like common knowledge too.** The us-elections
  primer said a ballot arrives on Election Day. Ballots go out 18 days
  earlier. Every other fact in that primer had been checked against a source;
  that one read like something everyone knows, so it never got looked up. No
  gate catches this — tests, invariants, budget and reading level all pass on
  a confident sentence that happens to be wrong. The category to watch is not
  "facts I am unsure of" but "facts I did not think to doubt".
- Anything whose expiry is a published date — an election, a deadline, a
  scheduled vote — is stale on that date. Look for those first.
- Scan for undated `now` / `currently` / `today` (VOICE forbids them).
- Scan for **positional references**: `chart above`, `next section`,
  `the update above`, `the story told above`. These are true on a scrolling
  page and false in a card model. Rewrite them to *name* the destination —
  "the 800,000-year chart in *Deep-Time Climate History*". A reference by
  section *number* survives if the tiles carry that number.

### 1 · Wrap the sections — a pure structural change, nothing else

```bash
python3 tools/reading_time.py > /tmp/before.csv     # baseline first
# wrap every section in <details class="unfold" data-order data-title data-minutes>
python3 tools/verify_invariants.py HEAD <page>      # must be exact equality
python3 tools/reading_time.py | diff /tmp/before.csv -   # must be identical
```

Doing this **before** writing the primer is what makes the proof possible.
`verify_invariants.py` asserts count *equality*, not non-decrease — so a
wrap alone must produce zero diff, which is a far stronger claim than
"nothing decreased". Once the primer adds citations and glosses, that exact
check is gone for good.

- `data-order` sets **tile order**, independent of position in the file.
  Put the current-events section first even if the narrative keeps it eighth.
- Reference material — Key People, Videos, Sources — gets
  `class="unfold unfold-extra"` and renders quieter. It is still wrapped:
  nothing may render below the menu.
- Remove `<nav class="section-nav">`. The tiles are the navigation, and a
  third copy of it is worse than none.
- Add `<script src="unfold-logic.js">` before `site.js`.

### 2 · Declare the learning target — before writing a word

**This is the decision that goes wrong.** On climate-change the target was
chosen because it suited a good interactive, and the primer became an
ice-core methodology lesson on a climate change page. The topic picks the
interactive, never the reverse.

Two tests for a target:

- **Does it survive the news?** A primer built on "the 2026 midterms"
  expires on November 4. One built on "how elections decide who holds power,
  using the midterms as the example" does not. Volatile facts belong in the
  dated update card; the primer holds what stays true.
- **Does the interactive serve it, or the other way round?**

### 3 · Write the primer

- **~650 words, 5 min.** Check with `--landing`, never by estimate.
- **Main point in paragraph one.** A student should not read two paragraphs
  before meeting the subject.
- **It must be the plainest text on the page** — below that page's
  deep-section FK median. Everyone reads the primer; only the committed read
  the rest, so difficulty should rise with commitment.
- **Every claim carries a citation, fetched this session.** If the page
  already states it with a source, reuse the exact source rather than
  introducing a competing one — and check the source supports *that* claim.
- Include the local hook. Rainier's glaciers, Blue Origin in Kent, LD-21,
  Alderwood's own districts. It is the difference between a topic and a
  place.
- Contested topics: describe, never judge. See the party-swap rule below.

**When a primer reads too hard, the fix is additive.** Shorter, commoner
words; more sentences *only where a connective is added*. A revision that
lowers the reading score by removing causal clauses is the Davison & Kantor
failure — the number improves and comprehension gets worse, for exactly the
students the revision was for.

> The check: **did the word count go UP?** Every successful pass here got
> plainer *and* longer. Climate-change went FK 8.13 → 6.02 while growing
> 559 → 613 words. Plainer and shorter would have been the failure.

### 4 · Build the interactive

One per page, in the primer. It must:

1. **Model a mechanism, never a verdict.** How a top-two primary cuts a
   field; how a nearest-neighbour classifier fails on what it was not shown.
   Never "build your ideal policy, here's your score."
2. **Use only figures fetched and read this session.** Where a number could
   not be verified, **change the interactive, not the number.** The
   gun-violence centrepiece was redesigned for exactly that reason.
3. **Be honest at the edges.** Clamp inputs to the range the data supports.
   Where a value is genuinely unknown — a withdrawn deadline with no
   replacement — show *nothing* rather than a plausible guess.
4. **Never rescale away the point.** If the shipping lanes look tiny, that
   is because they are tiny. Zero-based axes. No heat-map palettes on
   contested data, and party as a text label, never a bar colour.
5. **Be keyboard-operable**, with a live text readout that is simultaneously
   the screen-reader path and the no-JS fallback. One piece of content, three
   jobs.
6. **Carry both true facts** when there are two. A decade-long visa queue and
   1.3 million green cards a year are both real; showing one is choosing a
   side by omission.

Invented *demo* data for a method is fine, and say so — the AI classifier's
fruit are made up and the caption admits it. Inventing a *statistic* never is.

### 5 · Wire it up

- **Every substantive section gets a quiz.** A tile can only earn its ✓ if its
  section has one, so a section without a quiz can be read in full and still
  look unfinished. Reference tiles — Key People, Videos, Sources, Keep
  Learning — are the deliberate exception: they are browsed, not worked
  through, and the opened `·` is the right signal.
- `data-quiz` on each section that has one, so its tile can earn a ✓.
- `window.Unfold.markDone(id)` at the end of the page's `handleAnswer`.
- Ask for the section's **evidence, mechanism or specific case** — not its
  claim. "Test the claim, not recall" is good advice that sets a trap: the
  claim is what the learning target states, so a question built on it is
  answerable from the target alone. Q1 caught ten items that way, and eight
  of the ten were written in a single sitting by someone following that
  advice literally.
- **Four faults made 74 of 76 quizzes answerable with the article withheld**
  when Q1 first ran on 2026-08-30:
  1. **Absurd distractors** — "a music festival", "the Moon is further away
     than it used to be". Three eliminable options leave a question that
     tests nothing.
  2. **The correct answer was the longest, most specific option.** Length
     alone identified it in a dozen items.
  3. **The stem contained its own answer** — one asked what "12th" and
     "16th" were after stating both.
  4. **The question asked for the claim** (above).
- The construction that resists all four is a **2×2**: two variables, four
  combinations, all four plausible, all the same length. *Confirmed
  birthright citizenship / upheld TPS power · confirmed / limited · struck
  down / upheld · struck down / limited.* Nothing about the topic narrows
  that; only the section does.
- **Count where the correct answer sits.** Nobody had, and it was option B
  in 44 of 76 items — 58% from always picking B, with no reading at all. On
  ten quizzes written in one sitting it was B ten times out of ten. No gate
  here can see that: valid JS, valid HTML, every key pointing at a true
  statement.
- **Put the button inside the section's content box** — `.article`,
  `.focus-pane-inner` or `.update-pane-inner` — never as a direct child of
  the `<details>`. Outside it the button falls below the pane's background
  and loses the `max-width` that centres everything else. See the
  parent-element check in step 6.
- **`MAX_PTS` = the page's real reachable total** (quizzes + bonus points).
  `addPoints` clamps with `Math.min(pts + n, MAX_PTS)`, so a denominator
  that is too low fills the bar early and makes every later quiz award
  nothing. Six of eight pages were wrong this way before 4.1.0. Check any
  `pts >= N` unlock still sits under the new total.
- Homepage card: `data-parts="<tile count>"`, and rewrite the time promise to
  `5 min · more if you want it`.

### 5.5 · Run the reading-intervention pass on the deep sections

The primer gets this attention by default. The deep sections did not until
v4.2.0, and that is where the density lives.

```bash
# per section, not per page: a page-level average hides the bad section
python3 ~/.claude/skills/reading-intervention/scripts/locate.py <file> --json
```

**Strip `a.cite-inline` before measuring.** Citation links carry the outlet
name inline, and left in they are counted as prose — which inflates FK on
exactly the best-sourced sections. Leaving them in put 13 sections above the
band ceiling; excluding them, the real number is 5.

**Do not steer by the band.** Iran's *Where things stand* was the section a
reader called dense and hard to parse, and it measures in band at 8.47.
Eleven of the fifteen densest sections on the site are in or below band. FK
counts syllables and sentence length; a proper noun and a date are invisible
to it. What to look at instead, none of which is a score:

- **How many named entities and dates must a reader hold?** Print the list,
  never a rate (Rule F). Twenty place names each appearing once is the
  finding, and the remedy is to re-identify them or say what the list is
  *for* — never to delete them (Rule D).
- **Are consecutive events joined by anything but their dates?** That is C2,
  and a timeline is where it hides.
- **Below band is the alarm that matters**, not above. But check it: six of
  seven below-band sections here were false alarms with their connectives
  intact, and joining a stack of statistics would have manufactured
  causation.

**Every edit is additive, and G6 proves it.** Run `ceiling_diff` on the
section against its committed version. The pattern must come back
`elaboration` with no terms lost. A revision that came out shorter is the
Davison & Kantor failure, and G6 catches the small version too — rewriting
`shutdown` to `shut down` registered as a term lost and flipped the pattern
to MIXED. Restore the word form; do not argue with the gate.

**The score will often not move, and that is fine.** Adding an explanation
of a policy uses the policy's vocabulary. climate-change's *Washington's
Climate Story* went 12.50 to 12.52 while getting materially clearer. The
number is not the thing being improved.

**Fourteen of twenty flagged sections needed no edit.** Saying so is the
report. A locator flag is a place to look, not a verdict, and the
suppression lint exists to stop a finding that repairs nothing from reaching
the teacher.

### 5.9 · Stamp the version, or the change ships invisible

```bash
python3 tools/stamp_version.py     # after bumping VERSION, before committing
```

GitHub Pages serves `site.css` with `cache-control: max-age=600` and no
fingerprint in the filename, so a browser that already has the file keeps
using it. A change can be **live on the server and invisible in the browser
at the same time**, and nothing on the page says which you are looking at.
That is not hypothetical: the 4.4.0 timeline was correct on the server while
the page still rendered the old layout, and the only way to tell was to curl
the stylesheet.

The script appends `?v=<version>` to every local css/js reference — the part
that actually busts the cache — and writes `Build <version>` into each
footer so a person can confirm what they are looking at without devtools.
It is idempotent; `tools/version.test.js` fails if VERSION and the stamps
ever disagree.

**When someone reports that a shipped change is not there, check the stamp
in the footer first.** If it is behind, it is their cache and not your code.

### 6 · Gates — all of them, every time

```bash
node --test tools/*.test.js              # the glob; bare dir fails on Node 26
python3 tools/verify_invariants.py HEAD  # additions expected; check none LOST
python3 tools/reading_time.py --landing  # fails over 7 minutes
python3 tools/check_study_mode.py        # no gloss inside a quotation
```

`verify_invariants` will report DIFF once the primer lands — that is
expected. What matters is that nothing was **lost**:

```bash
git show HEAD:<page> | grep -o 'data-def="[^"]*"' | sort > /tmp/old.txt
grep -o 'data-def="[^"]*"' <page> | sort > /tmp/new.txt
comm -23 /tmp/old.txt /tmp/new.txt        # must be empty
```

**Ask what each new element's parent actually is.** Valid HTML in the right
section is not the same as correctly nested. Parse the page and print the
parent of anything you inserted, then compare it against the elements that
were already there:

```bash
# every quiz button should report the same parent class as its neighbours
python3 -c "from html.parser import HTMLParser; ..."   # see 4.1.0 in CHANGELOG
```

Ten buttons added in 4.1.0 passed every other check — valid markup, balanced
tags, right section, working quiz — while sitting outside the coloured pane
they belonged in, because they were children of `<details>` rather than of
`.update-pane-inner`. Comparing parents against the 54 existing buttons is
what found it.

Then load it in a browser, and **look at the interactive specifically**.

The checks read the HTML. None of them renders it, and none of them can see
whether a number is drawn in the right place. Every visual defect in the
v4.0.0 effort was caught by eye:

- two centrepieces shipped with **no CSS at all** — markup and behaviour
  present, stylesheet never written, every gate green
- the Hormuz lanes were drawn **across** the strait instead of through it.
  The geometry verified at exactly 21.000 nm and 2.000 nm, twice. A correct
  distance along the wrong axis is still wrong, and arithmetic cannot see it.

So the measurable things have been reliably right and the **depicted** things
have not. Verifying the numbers in an interactive is necessary and is not
sufficient: open it, click through every state, and ask whether the picture
says what the numbers say.

---

## Rules that cost something to learn

**Never shorten a page by deleting from it.** The 5–7 minutes is a property
of the entry point, not a ceiling on the topic. Deep sections keep every
word. A future instruction to "make this page shorter" means *add a shorter
door*, never *remove rooms*.

**The party-swap test governs framing, not facts.** "Republicans hold 218
seats" cannot survive a party swap and is simply true. "Clinging to a slim
majority" fails and must be rewritten. Hedging a true asymmetric fact to make
it swappable is the false balance VOICE already forbids.

**Separate durable from volatile.** "A majority picks the Speaker" is true
for decades; "Democrats need six seats" is true for weeks. Put them in one
paragraph and the durable half inherits the volatile half's expiry. Volatile
figures live in the dated update card, and only there.

**Prefer a stated fact to a derived one.** "R 218, D 212, 218 for a majority"
needs one dated refresh and lets the student subtract. "Democrats need 3"
needs the arithmetic to stay right too — and it was already wrong.

**Never type a countdown.** "68 days until Election Day" is correct the day
it is written and wrong every day after. Store the date; compute the rest.

**A test that fails after a structural change may be the test's assumption
that broke.** Two did here: one took the first `.term` in the document and
assumed it paired with `#term-desc-1`; another asserted glosses were injected
but was actually satisfied by the Study Mode bar carrying the same attribute.
Check what the assertion is *for* before changing the page to satisfy it.

**A character class that runs to a delimiter cannot match something that
nests.** `<img\b[^>]*>` stops at the `>` inside
`onerror="...<div class='x'>...</div>"`, so appending an attribute put it
inside the attribute value and produced a stray `</div>` on eight pages.
`@keyframes ticker\{[^}]*\}` stops at the `}` closing `0%{...}`, leaving
`100%{...}}` orphaned in the stylesheet. Same shape, different day. HTML tags
nest, and *every* at-rule (`@keyframes`, `@media`, `@supports`) contains a
block. Use `tools/htmltag.py` for tags; for CSS, count braces after editing.

**The cheap structural assertion catches what the test suite does not.** Both
bugs above passed 136 tests and every content gate. What found them was a
brace-balance count and a tag well-formedness walk — checks that know nothing
about this site, only about the shape of the file. When an edit is mechanical
and site-wide, assert the *structure* survived, not just the behaviour.

**A large "no match" is a statement about your candidates, not about the
world.** Four images scored 118-149 against every Commons candidate fetched,
which reads like "no source exists". The search terms had been written from
the *filenames*: `space-race-card.jpg` became "Saturn V Apollo launch", and
the file is Buzz Aldrin standing on the Moon. Looking at the four images and
writing the terms from what is in them changed the result. Before believing
a negative, check what it was compared against.

**Establish a matcher's thresholds with controls before trusting a number
from it -- and vary everything the real inputs vary.** A perceptual-hash
cutoff of 6, set by intuition, would have rejected genuine same-image pairs
scoring 8 and 11. Controls fixed that. But those controls varied only
*scale*, so they reported an empty gap between 11 and 98 and I called it the
thing that made the method trustworthy. Then a re-cropped, darker copy of
the Aldrin Moon photograph matched at **90**. Measured properly, the same
photograph moves 15-16 under a gamma change, 25-53 under brightness or
contrast, and 85 when darkened and cropped together; unrelated images sit at
121+. So: **under 11 is a match on the number; 15-100 is a candidate a
person must look at; 120+ is unrelated.** The band I had declared empty is
where nearly every re-hosted image actually lives. A check tells you about
what you tested it on, and nothing else.

**An id-allocating tool must derive its floor from the file, not a
constant.** `spread_glosses.py` opened with `next_id = 9000`, commented "far
above any existing term-desc id" — true on the first run, false on every one
after. The second run reissued ids the first had placed, so two different
terms shared `term-desc-9003`. Both carried `aria-describedby`, an idref
resolves to the *first* match, and a screen reader read "silencers" with the
definition of "background check". A confidently wrong definition is worse
than no definition, and it lands on exactly the students the glosses are for.
Any script that mints ids should start from `max(existing) + 1` on that page,
which also makes it idempotent.

**Do not recommend a dyslexia-specific font.** Pooled *g* = −0.04 across 15
studies and 688 readers; most children in them preferred Arial. See
`reading-intervention/references/do-not-recommend.md`.

---

## Styling: change it in site.css, not in eight files

Every topic page carries its own inline `<style>`, and `site.css` loads
**after** all of them. At equal specificity the later rule wins, so a shared
component value belongs in `site.css` and nowhere else.

This is not a preference. Eight copies drifted into two camps across 41
selector/property pairs before anyone noticed, because body text — the one
value that never drifted — kept every page looking right in a paragraph. And
editing eight copies is how the v4.0.0 Source Serif swap missed 32
declarations: two variants existed and only one was found.

Two traps when adding a rule there:

- **A media query adds no specificity.** An unscoped rule in `site.css` will
  override every page's `@media` rule for the same selector. That nearly
  capped the definition bubble at 240px on phones. Scope by breakpoint when
  the pages do.
- **A page rule with extra ancestors still wins.** `.update-pane .vocab p`
  beats `.update-box p` wherever both match. Check for selectors that end
  with yours before assuming yours applies.

## What Q1 can and cannot tell you

Q1 ran twice on 2026-08-30: once on the quizzes as they stood, then again
after rewriting the 26 worst. The headline barely moved — **74 of 76
answerable with the article withheld, then 70 of 76** — and the tiers
explain why.

| | round 1 | round 2 | round 3 |
|---|---|---|---|
| eliminable — no knowledge needed | 15 | 17 | **10** |
| answered by the learning target alone | 10 | **3** | 4 |
| general knowledge (prober-confounded) | 49 | 53 | 58 |
| required the passage | 2 | 3 | **4** |

**The rewrites worked on one tier and backfired on another.** Questions
answerable from the target alone fell from 10 to 3, which was the fault
worth fixing. But rewriting a question to ask for the section's real
evidence — a Supreme Court pair, Eunice Foote's cylinders, Kherson — makes
it a question about a documented fact, and the prober *knows documented
facts*. Four items moved from one failure mode into another.

**So the general-knowledge tier is not a scoreboard.** It says as much about
the prober as about the question: a large model has read far more than a
13-year-old, and it will answer nearly any well-posed factual question about
a well-documented topic. Treat that tier as an upper bound on what a very
well-informed reader could do, not as a defect count.

**The two tiers that ARE about construction** — eliminable distractors, and
questions the target answers — are the ones to act on, because they fail for
every student regardless of what they know. Those went 25 → 20.

**What actually creates passage-dependence.** Three items crossed from
answerable to genuinely requiring the section on the third run, and they
share a shape worth copying:

- **Close numeric options.** "About 9 / 14 / 22 / 31 percent" cannot be
  reached by reasoning about magnitude. "About 1 / 14 / 50 percent" can.
- **Parallel interpretive options.** If three options are factual disputes
  and one is an interpretive one, the interpretive one is the answer. Make
  all four interpretive.
- **Defeat the ordering heuristic.** Ship counts of "two-then-nine /
  three-then-five / five-then-three / six-then-eleven" beat "pick the
  smallest", which a single small option invites.

**Do not chase the headline number to zero.** Doing so would mean writing
questions about details so obscure that no outside knowledge could touch
them, which is a worse quiz, not a better one. The honest use of Q1 is to
find the items a student can beat *without knowing anything* — and to notice
when the answer is always B.

## Known gaps, as of v4.11.0

- **us-elections:** two Ballotpedia-cited claims are unverified (the Cassidy,
  Cornyn and Massie primary defeats); Ballotpedia cannot be fetched from a
  script. *(LD-21 results: resolved 2026-08-29 — see below.)*
- *(Resolved 2026-08-31: no image is silent any more — 74 credited, 9
  disclosed-unknown, 0 silent. `rumi` and `claude-lorius` resisted
  identification and now say so on the page rather than saying nothing.)*
- **Seven more say, in student-visible text, that the source could not be
  confirmed** (the ai.html portraits). That is an honest disclosure, not a
  silent gap, and it should not be counted with the nine above. Replacing
  them with credited images would be an improvement, not a correction.
- *(Resolved 2026-08-31: the three homepage card images. `ai-card`,
  `capitol-featured` and `ukraine-card` had no provenance in the repo, in git
  history, or in the files' own EXIF/XMP/IPTC. Replaced with Commons images
  whose licence was re-read from the API at fetch time, credited in the
  homepage footer — a card image cannot carry its own credit link, because
  it sits inside `<a class="tier-card">` and a nested `<a>` is invalid.)*
- **Three timelines carry no images** (ai, 19 entries; ukraine, 17;
  space-race, 8), and only 12 of 89 entries site-wide have one. Blocked on the
  licensing question above.
- **iran and ukraine timelines span millennia** (550 BCE and 882 AD), so any
  decade or era grouping needs editorial judgement, not an algorithm.
- **17 quiz items are still answerable without reading the passage.** Down
  from 74 of 76. See *What Q1 can and cannot tell you* above for why chasing
  this to zero is the wrong goal.

---

## Sources that resist being fetched

Several official sources refuse a plain fetcher, and each fails differently.
Knowing which is which saves guessing:

| Source | Symptom | What works |
|---|---|---|
| `sos.wa.gov` | HTTP 403 | send a browser `User-Agent` header |
| `clerk.house.gov` | HTTP 403 | not solved; use another source |
| Ballotpedia | 200, empty body | not solved; a person has to read it |
| `results.votewa.gov` | 200, empty shell | Angular app — fetch the data file instead |

A 403 is often just a missing User-Agent. An empty 200 means the content is
rendered by JavaScript, and no header fixes that — look for the data file the
app itself loads.

## Fetching Washington election results

`results.vote.wa.gov` archives through 2024 at
`/results/<YYYYMMDD>/legislativedistrict21.html` and is fetchable. Current
results moved to `results.votewa.gov`, an Angular app that serves an empty
shell to any fetcher — the per-race pages and the reports page are all
unreadable that way, and its API sits behind `/results/public/api`.

The way in is the full results workbook, linked from the election's
`/reports` page and served from `/cdn/results/<guid>/All Results_<guid>.xlsx`.
An `.xlsx` is a zip of XML, so `zipfile` plus `xml.etree` reads it with no
dependency — worth doing, in a repo that deliberately has none. Sheet 1 is
one row per choice:

```
Office Name | Contest ID | Ballot Name | Choice ID | Party | Total
```

It also carries rows a screenshot does not: `Ballots Cast`, `Over Votes` and
`Under Votes` per contest. **Under Votes is how many people returned a ballot
and left that race blank**, which is how the LD-21 finding turned up — a
same-party race skipped by 8.8% of voters against 2.6% for the
Democrat-versus-Republican race on the very same 33,190 ballots. Numbers like
that are not in the headline results and are worth looking for.
- **`gun-violence`'s "How other countries handle this" reads FK 10.82**,
  above the grade 6–8 band ceiling. It is an optional deep section, so this
  is a note rather than a defect.

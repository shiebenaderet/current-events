# Playbook — building or converting a topic page

Standing reference, alongside [`VOICE.md`](VOICE.md). VOICE governs how
sentences sound; this governs how a page is built and what must pass before
it ships. Written after converting all eight topic pages for v4.0.0, from
what actually went wrong rather than from what was planned.

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

## Order of work, and why it is this order

### 0 · Content review, before touching structure

Content first because section headings become tile titles, baked into
`data-title`. Convert first and a later refresh renames a section, and the
wrap has to be redone.

- Check every dated claim against its source. **Fetch and read it.** A live
  URL is not verification — us-elections cited a story headlined "Seven
  candidates seek District 1 congressional seat" for a claim about who won
  the primary. Real newspaper, right race, written three weeks too early.
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

- `data-quiz` on each section that has one, so its tile can earn a ✓.
- `window.Unfold.markDone(id)` at the end of the page's `handleAnswer`.
- One primer quiz. Ask for the primer's **claim**, not a number from it — a
  student who only knows the topic exists should not be able to answer.
- `MAX_PTS` += 1 for the new quiz.
- Homepage card: `data-parts="<tile count>"`, and rewrite the time promise to
  `5 min · more if you want it`.

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

Then load it in a browser. The checks cover structure and never appearance;
every visual bug in this effort was found by eye, not by tooling.

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

**Do not recommend a dyslexia-specific font.** Pooled *g* = −0.04 across 15
studies and 688 readers; most children in them preferred Arial. See
`reading-intervention/references/do-not-recommend.md`.

---

## Known gaps, as of v4.0.0

- **Quiz coverage is uneven.** ai has 5 quizzes for 13 tiles, iran 5 for 10.
  Those tiles can show "opened" but can never earn a ✓. Not wrong, but the
  progress signal is weaker on those pages than on climate-change (8 of 10).
- **us-elections:** two Ballotpedia-cited claims are unverified (the Cassidy,
  Cornyn and Massie primary defeats); Ballotpedia cannot be fetched from a
  script. *(LD-21 results: resolved 2026-08-29 — see below.)*

---

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

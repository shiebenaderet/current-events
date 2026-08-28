# SDD ledger — plan: docs/plans/2026-08-28-study-mode-implementation.md

Spec: docs/plans/2026-08-28-study-mode-design.md (read)
Branch: elections-scaffold-repairs (NOT main) @ 01d3919
Merge base vs main: 78c33cc
Note: no TodoWrite tool in this harness — this ledger is the sole progress record.

## Pre-flight scan

### Shared-file / interface pairs

| tasks | shared | produces → consumes | finding |
|---|---|---|---|
| T1→T2 | study-mode.js, tools/study-mode.test.js | resolveInitialState → init() | clean |
| T2→T4 | study-mode.js | buildLayer/teardownLayer stubs → real impls | clean; plan flags the stubs explicitly in T2 |
| T1→T4 | study-mode.js | termPattern, hasProtectedAncestor, PROTECTED_TAGS → injector | clean; same IIFE scope, PROTECTED_TAGS visible to T4's quotedAncestor |
| T1→T5 | study-mode.js | firstSentence → bar render | clean |
| T3→T5 | site.css | .sm-* vocabulary → #sm-bar rules | clean; appends only, no rule overlap |
| T2→T6 | site.js / 8 html | window.toggleStudyMode → onclick | clean |
| T3→T6 | site.css / 8 html | .study-mode-toggle → button class | clean |
| T6→T7 | iran.html, space-race.html | button insert → gloss insert | clean; strictly sequential, disjoint regions |
| T7→T3 | iran/space-race + site.css | .term/.term-desc → CSS reveal | clean |

### Per-task self-consistency

| task | tests vs code it specifies | finding |
|---|---|---|
| T1 | 14 assertions vs firstSentence/termPattern/hasProtectedAncestor/resolveInitialState | **2 DEFECTS — see rulings 1 and 2** |
| T2 | readStudyParam cases vs impl | clean (verified by inspection) |
| T3 | CSS only, manual verification step present | clean |
| T4 | keyWordFromBox cases vs impl | clean |
| T5 | no unit tests; browser verification only | acceptable — DOM/observer code, stated in plan self-review |
| T6 | anchors verified present on all 8 pages this run | clean |
| T7 | G6 gate + verify_invariants | clean |
| T8 | full regression | clean |

### Rulings

Ruling 1: T1's `firstSentence` guard `if (cand.length < 25 && ...) continue;` is wrong —
it makes the plan's own test `firstSentence('  Two   spaces.  Next.  ')` return
"Two spaces. Next." instead of "Two spaces.". Executed the plan's code this run to confirm.
Replaced the length heuristic with a sentence-start check: a break counts only when the
remaining text is empty or begins with a capital/digit (optionally after an opening quote).
Verified all 6 firstSentence cases pass. — Why: a length guard cannot distinguish a short
sentence from an abbreviation; capitalisation can, and ABBR already covers "Dr. King". —
Cost if wrong: a primer whose second sentence starts lowercase shows two sentences in the
section bar. Cosmetic, single surface.

Ruling 2: T1's `termPattern` appends `\b` unconditionally, so a term ending in a
non-word character can never match — the plan's own test `termPattern('U.S. (federal)')`
against "the U.S. (federal) courts" returns false. Confirmed by execution. Boundaries are
now conditional: leading `\b` only when the term starts with a word char, trailing
`(?:e?s)?\b` only when it ends with one. Verified all 6 termPattern cases pass. — Why: `\b`
between ")" and " " is not a boundary, so the assertion was unsatisfiable as written. —
Cost if wrong: a Key Word ending in punctuation could match a substring inside a longer
token. No such Key Word exists in the corpus today.

Ruling 3: Work proceeds on existing branch `elections-scaffold-repairs` rather than a new
worktree. — Why: already isolated from main (the skill's actual constraint), and Tasks 3-5
require serving these files to a browser for manual verification, which a nested worktree
complicates. — Cost if wrong: the branch name no longer describes its contents; flagged for
the finishing step, rename is free since nothing is pushed.

Ruling 4: index.html gets no Study Mode button (T6 covers 8 topic pages only) but does load
site.js, which calls window.StudyMode.init(). — Why: the plan's guard
`if (window.StudyMode && window.StudyMode.init)` already handles the absent module; index
has no .term, .before-read, or .sec-head to scaffold. — Cost if wrong: none; verified the
guard is present in the T2 text.

## Task log
Task 1: dispatched (haiku), BASE=29dde50
Task 1: implementer DONE (commit 7ece56c, 14/14 pass, node --check clean)
Task 1: review dispatched (sonnet) over 29dde50..7ece56c
Task 1: review SPEC OK / QUALITY approved. Reviewer raised 1 warning-item (is "U.S." really
  the only abbreviation in the corpus?). Controller resolved it: scanned all 56 .before-read
  primers -- U.S. is the ONLY mid-sentence abbreviation (ai, gun-violence, iran); ran the
  shipped firstSentence against all 56 primers, 0 bad splits. NOT a gap.
Task 1: complete (commits 29dde50..7ece56c, review clean)
Task 2: dispatched (haiku), BASE=7ece56c
Task 2: implementer DONE (commit 3110b0e, 16/16 pass)
Task 2: review dispatched (sonnet) over 7ece56c..3110b0e
Task 2: review SPEC OK / QUALITY approved. One Minor: init() persists only on 'on', so
  ?study=off applies to the current page but does not carry forward. Reviewer correctly noted
  this is verbatim from the brief, not an implementer deviation.

Ruling 5: KEEP the asymmetry (?study=on persists, ?study=off does not). The design spec's
  prose says both persist, so spec and code diverged -- but the spec's own governing principle
  is "sets a starting state, never a locked one." A persisting 'off' would silently clear a
  student's saved Study Mode after they open one assessment link, stripping an accommodation
  they chose, with no signal. That is the exact harm the principle exists to prevent, so the
  code is right and the spec prose was wrong. Corrected the spec to match and to say why.
  No fix round: the code needs no change. -- Cost if wrong: a teacher wanting Study Mode off
  across a multi-page assessment must put ?study=off on each link rather than only the first.
  Carried into Task 8 so the README documents actual behaviour.

Ruling 6: Tasks 3, 4 and 5 each specify a manual browser verification step (serve the site,
  open a page, drive the console). A dispatched subagent cannot do that. Implementers will
  perform every automatable check instead, and the browser round-trip is reassigned to Task 8
  Step 2, which already exists as a full manual pass over all 8 pages. For Task 4's S2
  guard specifically -- the one genuinely load-bearing manual assertion -- I will additionally
  build the automated DOM check the plan's own self-review names as the fallback, rather than
  leaving it to a human eyeball. -- Cost if wrong: a visual defect survives to the Task 8 pass
  instead of being caught one task earlier.
Task 2: complete (commits 7ece56c..3110b0e, review clean)
Task 3: dispatched (haiku), BASE=3110b0e
Task 3: implementer DONE (commit 8c1d986; braces 59/59, all 5 selector families present,
  all 8 sr-only properties overridden, specificity 0,2,1 > 0,1,0, 49 insertions 0 deletions)
Task 3: review dispatched (sonnet) over 3110b0e..8c1d986

Ruling 7: Task 4's `keyWordFromBox` regex is /^Key\s*Word\s*:\s*(.+)$/i -- COLON ONLY. Measured
  the real corpus this run: 55 Key Word labels exist site-wide and the plan's regex matches 7.
  Every page except us-elections uses an EM-DASH ("Key Word - Artificial Intelligence"), not a
  colon. As written Task 4 would deliver 13% of its value and do nothing at all on iran and
  space-race -- the two pages Task 7 exists to rescue, which would have quietly defeated the
  backfill too. Broadening the separator class to [:---] (colon, em-dash, en-dash, hyphen)
  matches all 55. Patching the brief's regex and adding em-dash test cases before dispatch.
  -- Why: a colon-only match was an unchecked assumption from reading one page. -- Cost if
  wrong: a vocab box whose label legitimately contains a leading dash could mis-split; none
  exists in the corpus (verified across all 55 labels).
  Measured effect of the fix: 36 glosses injected site-wide, 19 orphans.

Note (feeds Task 7 + final review): the 19 orphan Key Words are real V5 findings -- glossary
  entries whose term never appears in the page's prose. The spec predicted this audit would
  fall out of the injector for free; it did. Examples: us-elections "Midterm Penalty" and
  "Poll tax" (both appear only inside their own boxes), ai "Algorithm"/"Training Data",
  ukraine "Sovereignty". Not fixed here -- recorded for triage.
Task 3: review SPEC OK / QUALITY approved. sr-only override verified property-by-property
  (position/width/height/padding/margin/overflow/clip/white-space all reversed, no survivor);
  specificity 0,2,1 beats 0,1,0 without !important; identical .term-desc rule on 7 pages;
  us-elections has NO .term at all, so its entire Study Mode value comes from the Task 4
  injector -- which makes Ruling 7 load-bearing in both directions. Browser-render warning
  deferred to Task 8 per Ruling 6.
Task 3: complete (commits 3110b0e..8c1d986, review clean)
Task 4: dispatched (sonnet -- highest-risk task, S2 BLOCKING constraint), BASE=8c1d986
Task 4: implementer DONE_WITH_CONCERNS (commit a219e52, 20/20 tests, checker exit 0,
  28 inline / 0 aside / 27 orphans). Implementer raised a CRITICAL concern rather than
  silently fixing it -- correct call.

Ruling 8 (CRITICAL, load-bearing): The S2 guard protects nothing on this site. PROTECTED_TAGS
  is ['BLOCKQUOTE','Q','CITE'] and this site contains ZERO of all three tags across all 8
  pages -- verified by direct count. Quotations are marked up as <div class="pull-quote"> (9
  instances) and as quotation marks inside ordinary <p> prose. I wrote the guard against
  standard semantic HTML without checking how THIS site marks up quotations; the same
  blockquote/q/cite assumption is inherited from locate.py's extractor, which means locate.py
  has likewise never recognised a tagged source on this site.
  Measured real exposure on RENDERED text (a first pass over raw source reported 18 inline
  exposures; almost all were data-def="..." attribute values -- my measurement error, corrected
  before ruling):
    - ai.html "Computer Vision" -> first prose occurrence is inside a .pull-quote holding a
      verbatim Geoffrey Hinton quotation ("...all the people doing computer vision..."). The
      injector would write a definition into a living person's quoted words.
    - ukraine.html "Coalition of the willing" -> first prose occurrence is inside an inline
      quotation.
  Decision: extend protection on both axes -- (a) treat any ancestor with class "pull-quote"
  as a source container, (b) refuse to inject when the match offset sits inside a "..." or
  "..." span within its own text node. Entering the fix loop as round 1, resuming the original
  implementer. -- Why: injecting editorial matter into a quotation is the one defect this
  feature was explicitly forbidden to produce, and it is reachable today, not hypothetically.
  -- Cost if wrong: two Key Words (of 55) lose an inline gloss and fall back to their existing
  box, which is the status quo and harmless.
Task 4: fix round 1/5 dispatched (resume original implementer)
Task 4: fix round 1 complete (commit 8ff426a, 28/28 tests, checker exit 0).
  ai "Computer Vision" -> diverted to sibling aside after the pull-quote (no longer in the
  Hinton quote). ukraine "Coalition of the willing" -> skipped. Implementer also found a third
  case (ai "Artificial Intelligence (AI)" in a quoted citation title) and applied the rule
  uniformly rather than carving out an exception on its own authority -- correct restraint.
  Counts moved 28 inline -> 25 inline + 1 aside + 2 skipped.
  Open question for review: does isInsideQuoteMarks over-block? A controller spot-check found
  a passage where naive quote pairing mis-flags real prose ("...talk about \"AI.\" But what does
  it actually mean? Artificial intelligence is...") -- that was an artifact of the controller's
  own whole-document concatenation, and the implementer's per-text-node scope may not share it.
  Named explicitly in the review dispatch rather than assumed either way.
Task 4: full task review dispatched (opus -- safety-critical diff) over 8c1d986..HEAD
Task 4: review SPEC OK / QUALITY needs-work. Over-blocking verdict: CLEAN (13 adversarial
  cases; isInsideQuoteMarks is a toggle not a pairing, so the mispairing risk I raised does not
  exist -- my controller spot-check was an artifact of whole-document concatenation, as
  suspected). Reversibility and idempotency verified correct by code reading.
  Two Important findings, both entering fix round 2:
   (a) Quote guard hole -- a quotation split across text nodes by inline markup. Given
       <p>Dr. Smith said "the <strong>hydropower</strong> plan is dead."</p> the term's own text
       node contains no quote marks and has no .pull-quote ancestor, so it classifies as inline.
       Reviewer built the fault page and confirmed exit 0. Not live today (0 quotations cross
       node boundaries in the corpus) but ai.html:432 already uses bold-inside-quote elsewhere.
   (b) check_study_mode.py's S2 assertion is a TAUTOLOGY -- check_page re-tests the same
       expression find_target used to classify, so non-zero exit is structurally unreachable.
       The automated stand-in for the browser test cannot fail. Confirmed empirically by the
       reviewer against an injected genuine violation: still exit 0.
  Minors deferred: findTarget doesn't exclude .footnotes/.cap (ai "Artificial Intelligence (AI)"
  is skipped only because its first section-scoped match is a bibliography entry); gloss-into-
  gloss re-entry (0 collisions today); normalize() is deep.

Ruling 9: Finding (b) is the more serious of the two even though neither is live. A checker that
  cannot fail is worse than no checker -- it manufactures confidence, and it is the thing
  standing in for the browser test I cannot dispatch. Both (a) and (b) go to fix round 2.
  -- Why: (a) is the S2 constraint and its trigger is an ordinary authoring act (bolding a word
  inside a quote); (b) is the instrument that would have caught (a) and silently did not.
  -- Cost if wrong: the guard becomes slightly conservative and a handful more Key Words fall
  back to their existing boxes -- the status quo, and harmless.

Ruling 10: Also folding in the deferred Minor "indexOf(m[0]) vs m.index" inconsistency, against
  the skill's default that Minors never enter the loop. -- Why: it is a genuine latent
  correctness bug (a term twice in one text node injects at the wrong occurrence), it is one
  line, and it sits inside the exact lines round 2 already rewrites -- so it costs nothing now
  and needs its own round later. Reviewer measured 0 divergences in today's corpus.
  -- Cost if wrong: negligible; it is a strict correctness improvement.
Task 4: fix round 2/5 dispatched (resume original implementer)
Task 4: fix round 2 complete (commit d79b53b, 33/33 tests, both checker modes exit 0, counts
  unchanged at 25/1/2/27 -- confirming the fix closes a latent hole without altering any live
  classification).
  Controller verified independently, end-to-end through the real checker:
    - purpose-built FAULT page (term's only occurrence inside a quote split by <strong>)
      -> skipped: Hydropower, inline: 0   (guard refuses)
    - CONTROL page, byte-identical but unquoted
      -> inline: Hydropower                (glosses normally)
    Same term, same structure, differing only by quote marks, classification flips correctly.
  Note: my first fault-injection attempt was invalid -- the checker reads a hardcoded
  DEFAULT_PAGES list, so the temp file was never scanned and the 'inline ... Hydropower' line
  I saw came from the real page where Hydropower is legitimately unquoted. Exit 0 was correct.
  Re-tested via the checker's explicit page argument.
Task 4: scoped re-review dispatched (sonnet) over 8ff426a..d79b53b
Task 4: re-review -- Finding 1 ADDRESSED (block-level TreeWalker; reviewer built 4 further
  split shapes: <em>, <span class="term">, two-level nesting, and quote-marks opening in one
  child and closing in another -- all correctly skipped). Finding 2 ADDRESSED with a caveat.
  Finding 3 ADDRESSED (m.index used on both paths; indexOf(m[0]) gone). No new breakage;
  33/33 tests; counts unchanged 25/1/2/27 so the guard did not become more conservative.

Ruling 11: ACCEPT the checker's proven limitation rather than spend a third round on it. The
  reviewer fuzzed 1.5M+ (text, offset) pairs and proved that for straight quotes, regex
  nearest-neighbour pairing is exactly equivalent to toggle parity -- so the "independent"
  check is always a superset of the production classifier and can never contradict it. The
  violation path is therefore reachable only through --self-test's manufactured regression,
  not through a hand-crafted fault page against the unmodified checker.
  What the safety net DOES catch: pipeline regressions -- a wrong block offset, a lost call to
  the quote check, a find_target that stops consulting quotes. That is exactly the Finding 1
  class of bug, and --self-test demonstrates it catching precisely that.
  What it does NOT catch: an error in toggle-parity itself, since both methods agree there.
  -- Why accept: the two algorithms are genuinely distinct functions sharing no helper, the
  equivalence is proven rather than assumed, and a third algorithm would guard a case that has
  been mathematically excluded. -- Cost if wrong: if toggle parity is ever wrong for curly
  quotes (the proof covered straight quotes), no automated check would notice. Recorded so
  nobody later believes this checker is stronger than it is.
Task 4: complete (commits 8c1d986..d79b53b, 2 fix rounds, 3 findings addressed, 1 parked)
Task 5: dispatched (sonnet -- DOM + IntersectionObserver), BASE=d79b53b
Task 5: implementer DONE (commit 9684144, 38/38 tests, checker exit 0 counts unchanged,
  56/56 real primers produced sensible first sentences). Extracted a pure derivePrimerText()
  from the brief's inline derivation so the logic is unit-testable; behaviour identical.
  NOTE: Task 5 has NOT yet been code-reviewed -- see Ruling 12.

Ruling 12: On the user's explicit instruction, merged all 14 commits to main and pushed to
  origin BEFORE Task 5's code review and before Tasks 6-8. Verified the committed tree first:
  38/38 tests, both node --check clean, module requireable with no DOM, checker exit 0,
  site.css 65/65 braces, div balance clean on all 9 pages, and -- decisively -- no page loads
  study-mode.js and no page carries the button, so Study Mode is inert on the live site and
  the only student-visible change is the completed v3.5.0/v3.6.0 content work.
  -- Why: the user asked, and the publish risk is genuinely near-zero for dead code.
  -- Cost if wrong: if Task 5's pending review finds a defect, it ships as unreachable code on
  main and is fixed in a follow-up push; nothing a student can reach is affected.
Remaining work moved to branch `study-mode-wiring` -- Tasks 6-8 ARE student-facing (they add
  the button and load the script), so they get verified in a browser before any further push.
Task 5: review dispatched (sonnet) over d79b53b..9684144
Task 6: dispatched (sonnet -- student-facing, 8 files), BASE=9684144
Task 6: implementer DONE (commit f34211c, 9/9 checks). Controller re-verified independently:
  button present once on each of the 8 pages and absent from index.html; study-mode.js loads
  immediately before site.js on every page (adjacent line numbers, order correct everywhere);
  16 insertions total, 0 deletions, only the 8 html files touched.
Task 6: review dispatched (sonnet) over 9684144..f34211c
Task 7: dispatched (opus -- content authoring, judgment-heavy), BASE=f34211c
Task 5: review SPEC OK / QUALITY needs-work. Teardown and normal-cycle leak shape both clean.
  Two Important findings -> fix round 1:
   (a) buildBar() has no re-entrancy guard. injectKeyWordGlosses is idempotent (data-sm-done
       per box) but buildBar is not: a second buildLayer/apply('on') without an intervening
       teardown creates a SECOND #sm-bar and overwrites barObserver, permanently leaking the
       first IntersectionObserver. Not reachable via the toggle button (strictly alternating),
       but reachable through the exported api.apply.
   (b) derivePrimerText strips link text by global substring removal across the whole
       paragraph rather than removing the anchor node. Probe: paragraph 'AI AI is the topic.
       First: AI' with linkText 'AI' -> "is the topic." -- legitimate prose sharing the link's
       text is silently deleted. 0 real cases today (the First: link always sits in its own
       paragraph), so latent; but the implementer's "behaviour identical" claim is not strictly
       true and this is content-dependent, i.e. it breaks on a future primer, silently.
Task 5: fix round 1/5 dispatched (resume original implementer)
Task 6: review dispatched (sonnet) over 9684144..f34211c
Task 6: review SPEC OK / QUALITY approved. Button lands as the 3rd child of .a11y-controls on
  every page, beside text-size and the font toggle -- correct cluster, not orphaned. Handler
  window.toggleStudyMode assigned unconditionally at IIFE top level, bound before any click is
  possible. verify_invariants OK; no duplicate ids on any of the 9 pages; div balance unchanged.
  Minor (pre-existing, NOT introduced here, for final-review triage): the neighbouring
  dyslexic-toggle carries no aria-pressed at all, so the new button is more accessible than its
  sibling. The a11y cluster is internally inconsistent.
Task 6: complete (commits 9684144..f34211c, review clean)
Task 5: fix round 1 complete (commit c9b2fbe, 40/40 tests -- 2 new: shared-substring regression
  and a buildBar double-call leak test via a hand-rolled vm DOM stub, no new dependency).
  Checker exit 0, counts unchanged. 56/56 primer sweep byte-identical to pre-fix, confirming a
  latent-bug fix that alters no live output.
Task 5: scoped re-review dispatched (sonnet) over f34211c..c9b2fbe
Task 7: dispatched (opus -- content authoring), BASE=c9b2fbe
Task 5: re-review -- Finding 1 ADDRESSED (re-reviewer built its OWN vm-DOM stub, independent of
  the shipped test, and ran on->on->off->on: double-build blocked at 1 bar / 1 observer, and a
  real rebuild after teardown still works with the old observer properly disconnected. The
  shipped test genuinely exercises the leak rather than asserting a guard exists).
  Finding 2 ADDRESSED (derivePrimerText now joins a fragments array -- structural, no substring
  removal; the 'AI AI is the topic' case retains its prose; empty/whitespace/null/two-anchor
  cases all sane). Caller primerTextFor was updated in the same commit to produce the new
  shape -- verified, so no silent pure-function-only fix. No new breakage; 40/40; checker
  exit 0 counts unchanged; no page prose touched.

Ruling 13 (park, Minor): primerTextFor narrowed from querySelectorAll('a') (all descendants)
  to direct-child <a> elements only. A link nested inside <strong>/<em> within a primer content
  paragraph would no longer be stripped. Re-reviewer checked every before-read aside on all 9
  pages: no such nesting exists. -- Why park: not reachable in the corpus, and the structural
  fix it enables is worth more than the edge case it opens. -- Cost if wrong: a future primer
  that nests a link inside inline markup would show that link's text inside the section bar's
  first sentence. Cosmetic, single surface, and the 56-primer sweep would catch it.
Task 5: complete (commits d79b53b..c9b2fbe, 1 fix round, 2 findings addressed, 1 parked)
Task 7: implementer DONE (commit 38ce16f). 6 glosses per page, 12 total.
  iran term-desc-3..8: retaliatory, ceasefire, memorandum, Ayatollah, currency,
    Revolutionary Guard.  space-race term-desc-4..9: satellite, capsule, crewed,
    commercial, lunar, uncrewed.
  G6: iran elaboration terms_lost=[] 3486->3731 words; space-race elaboration terms_lost=[]
    1766->1959. All 17 data-def strings byte-identical to their .term-desc; ids unique.
  Raised 4 concerns, one of them a release blocker (see Ruling 14).

Ruling 14 (RELEASE BLOCKER, my defect): Task 3's CSS sets the Study Mode inline gloss to
  color:var(--ink-light) = #4a4a4a. The site's dark containers (.update-pane, .update-box,
  .focus-pane) use background:var(--ink) = #1a1a1a. Measured contrast 1.96:1 against WCAG AA's
  4.5:1 -- the glosses are effectively invisible. Scope: ~25 glossed terms across ai,
  gun-violence, immigration (the worst, 8 in its update-pane), space-race and ukraine. So on
  those panes the feature silently fails for exactly the students it exists to serve.
  The original design ALREADY solved this for the hover tooltip -- .update-box .term::after and
  .focus-pane .term::after both override to background:#fff;color:var(--ink) -- and my Study
  Mode CSS did not carry that precedent across. Folding the fix into Task 8 as a required
  Step 0 rather than opening a separate cycle, since it is CSS-only and Task 8 already reviews
  the release. -- Cost if wrong: a colour that reads oddly on one pane type; trivially
  adjustable and caught by the visual pass.
  Also noted from Task 7, not blocking: (a) a gloss whose text ends in "." placed on a
  sentence-final word yields ".." -- implementer avoided it by placement, no fix needed;
  (b) G6 flags terms_lost for a term appearing only ONCE, because extract_html concatenates
  gloss text onto the term -- a measurement artifact that constrained term choice (4 good
  candidates rejected: crackdown, hostage, cosmonaut, Soviets); (c) three space-race glosses
  land in one paragraph, two of them 9 words apart -- density worth an eyeball.
Task 7: review dispatched (sonnet) over c9b2fbe..38ce16f
Task 7: review SPEC OK / QUALITY approved. Reviewer ran an INDEPENDENT additive-only check
  (strip tags, strip gloss, difflib opcodes) -- all 9 touched lines show only `replace`, never
  insert/delete, so no prose was reworded or lost. G6 reproduced: both pages elaboration,
  terms_lost=[]. All 12 data-def/.term-desc pairs byte-identical. Confirmed none of the 12 new
  glosses sits inside a pull-quote OR inside a dark update-pane (so Ruling 14's contrast defect
  affects only the ~25 PRE-EXISTING .term spans, not the new work).
  Minor: the "lunar" gloss opens "Having to do with the Moon", close to the banned
  "of or relating to" dictionary-syntax pattern though not a literal match; redeemed by its
  second sentence. Weakest of the 12, not disqualifying. Deferred.
Task 7: complete (commits c9b2fbe..38ce16f, review clean, 1 minor deferred)
Task 8: dispatched (sonnet), BASE=38ce16f -- carries Ruling 14's contrast fix as Step 0,
  plus a DOM-stub integration harness standing in for the browser pass I cannot delegate.
Task 8: implementer DONE (commit 7ab18d9). Contrast fix #d8d2c8 on dark panes = 11.58:1;
  light-bg case unchanged 8.29:1. Integration harness tools/study-mode.integration.test.js,
  node builtins only, 40/40 assertions across all 8 pages (5 each) -- and verified NON-VACUOUS
  by a negative control: the implementer disabled the S2 quote guard, confirmed the harness
  then failed exactly where expected (ai "Computer Vision" landing inside the Hinton
  pull-quote), and restored the source diff-verified identical. That is the discipline this
  whole feature needed and it is now automated. Full regression clean. v3.7.0 released.
  Implementer correctly overrode a stale number in my dispatch: I said 19 orphan Key Words
  (a whole-page-scoped measurement of mine); the shipped code is section-scoped and the real
  figure is 27. It used 27 and documented the discrepancy rather than reproducing my error.
Task 8: review dispatched (sonnet) over 38ce16f..7ab18d9
Task 8: review SPEC OK / QUALITY approved. NEGATIVE CONTROL REPRODUCED INDEPENDENTLY: reviewer
  disabled all four quote guards in findTarget, ran the harness, got 39/40 with the expected
  failure on ai.html assertion 3 (injected SPAN descending from a pull-quote), restored, and
  diff-verified study-mode.js identical to HEAD, harness back to 40/40. The harness genuinely
  fails when the guard breaks -- not accepted on the implementer's word.
  Round-trip assertion confirmed full-fidelity (serializes every tag, attribute and text node;
  compared with assert.equal on the whole string) -- not lossy. Stub audited: only the one
  documented simplification, and the ancestor walk is independent of study-mode.js's own guard.
  Changelog orphan count 27 matches the tool exactly.
  Minor: changelog states the light-bg pair as #4a4a4a on #faf7f2 = 8.29:1. Real --paper is
  #fbf9f4; recomputed 8.42:1. Conclusion unaffected (both pass AA).

Ruling 15: The wrong paper hex is MINE -- I supplied #faf7f2 from memory in the Task 8 dispatch
  and the implementer faithfully carried it into the changelog. Fixing it in the final review's
  fix wave rather than leaving a factually wrong hex in a published changelog. -- Why: it is a
  documented claim a reader could check and find wrong, which costs more than the one-line fix.
  -- Cost if wrong: none; the corrected value is measured from the live pages.
Task 8: complete (commits 38ce16f..7ab18d9, review clean, 1 minor -> final fix wave)

ALL 8 TASKS COMPLETE. Dispatching final whole-branch review.

FINAL WHOLE-FEATURE REVIEW (opus, 16 commits): VERDICT NOT READY TO MERGE.
  Sound and measurably verified: the additive guarantee (G6 across all 8 pages = unchanged or
  elaboration, terms_lost=[] everywhere), quotation safety (0 injected nodes under any quote
  container), round-trip integrity (reviewer extended the harness to 3 full on/off cycles
  firing every observer callback + double-apply, 8/8 pages, no drift, no observer leak, could
  not break it), aria-pressed correctness, and NO screen-reader double-read regression.
  4 Critical + 3 Important cross-task defects, none visible to a per-task review:
   C1 DOUBLE GLOSS. findTarget excludes headings and .cite-inline but NOT .term/.term-desc.
      Controller confirmed: 11 Key Words are ALSO existing .term spans (climate-change 3,
      immigration 5, ukraine 2, ai 1), so the injector splits inside the .term and prints the
      definition twice back to back, underlined as if it were the term. THIS IS ALMOST
      CERTAINLY WHAT THE USER SAW.
   C2 Same missing guard, .term-desc variant: a gloss spliced mid-sentence into another term's
      aria-describedby target, so a screen-reader student hears a corrupted sentence.
   C3 defEl.textContent swallows the .cite-inline label -> "...are the main ones.NASA",
      "...from proxies.NOAA", and literal "src" on us-elections. Task 5's derivePrimerText
      strips anchors structurally; the parallel Task 4 path never got the same treatment.
   C4 The Task 8 contrast fix covers .term-desc only. .sm-gloss and .sm-gloss-aside keep
      #4a4a4a, and space-race's Artemis gloss lands in .update-pane -> 1.96:1, the exact
      failure Task 8 existed to fix.
   I5 Focus ring is accent-on-accent = invisible when active; the neighbouring dyslexic-toggle
      already solved this with outline:#fff.
   I6 #sm-bar (z-index 60) sits under .a11y-controls (z-index 9999) which overlaps its right
      end; and no body padding-bottom, so the bar permanently covers the last ~40px of every page.
   I7 README says the button is "in the header (and on mobile, in the menu)" -- it is in the
      fixed bottom-right stack and there is no menu entry.
  Deferred triage: all 5 previously-parked items confirmed fine to defer.
Final fix wave: ONE dispatch (opus) with all findings + Ruling 15's changelog hex.
Final fix wave: agent hit an opus session rate limit mid-work and died BEFORE committing, but
  after completing every fix including the last one (site.js tap handler). Controller verified
  the uncommitted tree independently -- 46/46 unit, 59/59 integration, checker exit 0,
  verify_invariants exit 0, no article prose changed, contrast override now covering
  .term-desc + .sm-gloss + .sm-gloss-aside on all three dark containers -- and committed on the
  agent's behalf as 45ad528. Counts moved inline 25->18 / skipped 2->9, exactly the 7 .term
  collisions becoming refusals.
Final fix wave: scoped re-review dispatched (sonnet -- opus rate-limited until 12:30pm PT)
Final fix wave re-review: ALL findings ADDRESSED, no new breakage.
  C1/C2 proved by driving the real DOM: climate-change "greenhouse gases" definition now
  appears EXACTLY ONCE; ai #term-desc-1 byte-identical after apply('on'), no splice.
  C3 definition text extracted structurally by node identity; us-elections gloss ends
  "...make this system work." with no citation label. C4 contrast recomputed independently:
  #d8d2c8 on #1a1a1a 11.58:1, #4a4a4a on the REAL --paper #fbf9f4 8.42:1, focus ring #fff on
  the lowest-contrast accent 5.76:1 -- all >= 4.5:1; site.css confirmed genuinely append-only
  (zero deleted/modified lines). I5/I6/I7 and all Minors addressed.
  REGRESSION TESTS PROVEN NON-VACUOUS: reviewer disabled both guard call sites, 6 integration
  tests failed (4 pages' ancestor guard + both named Critical render checks), restored, 59/59
  green. Skip-delta audited: the 7 are Backpropagation, Cossacks, Referendum, Green Card,
  Greenhouse Gas, Keeling Curve, Hydropower -- each a genuine .term in the same section as its
  Key Word box. National-Origins Quota correctly STAYS inline (its .term is in a different
  .article section; findTarget is section-scoped). No wrong-reason skips.
  Round-trip byte-identical on all 8 pages including the new skip path.

STATUS: feature code-complete, all 8 tasks + final review + fix wave reviewed clean.
REMAINING: human visual pass (bar on mobile, gloss density) -- never done, cannot be delegated.

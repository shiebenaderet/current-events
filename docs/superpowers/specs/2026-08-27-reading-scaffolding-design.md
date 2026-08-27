# Design — Reading Scaffolding & Length Honesty (Phases 3–4)

**Date:** 2026-08-27 · **Baseline:** v3.3.0 · **Approach:** A (structural scaffolding)

Follows the `/edtech-ui-ux` audit and the v3.3.0 touch/mobile floor. Supersedes the
original "reading levels" framing — see *What the measurements changed*.

---

## What the measurements changed

The effort began from a hypothesis: the site has no reading levels, so below-level readers
are unserved. Measuring the corpus corrected it twice, and both corrections narrow the work.

**1. Reading level is largely a topic effect, not a writing defect.**

| Page | Flesch-Kincaid | 4+ syllable words | Prose words |
|---|---|---|---|
| space-race | **6.5** | 1.0% | 1,801 |
| ai | 8.2 | — | 5,796 |
| ukraine | 8.6 | — | 4,499 |
| us-elections | 8.6 | — | 3,332 |
| iran | 9.0 | — | 3,321 |
| climate-change | 9.2 | — | 2,048 |
| immigration | **9.8** | 6.5% | 5,850 |
| gun-violence | **9.9** | 4.3% | 9,715 |

`docs/VOICE.md` targets ~5th–6th grade. Only Space Race is close. But the words driving the
gap are the subject itself: `immigration` (58×), `nationality`, `enforcement`, `persecution`
on one page; `legislature`, `legislation`, `congressional`, `ammunition` on the other. Space
Race scores 6.5 because rockets are concrete, not because it is better written. A site-wide
FK-6 target would fight the vocabulary the standards require, and lose.

**2. The story-first rewrite did not move reading level.** Measured across the v3.1.1/v3.1.2
rewrite commits: Iran 9.1 → 8.9, gun-violence 9.9 → 9.9, space-race 6.6 → 6.5. Voice work and
reading level are independent levers. "Rewrite everything in the Space Race voice" is
therefore not a reading-level strategy, and this design does not pretend otherwise.

Word counts throughout come from `tools/reading_time.py` (prose inside `<p>`, excluding
chart labels and figure captions caught inside section markup). That script is the single
source of truth for every minute figure on the site; hand counts will differ slightly and
should not be used.

**Conclusion.** The lever is not vocabulary. It is structure: a way in, honest lengths, and
prose chunked the way the visuals already are. That matches the reported classroom use —
sections are already assigned individually, the wall of text loses students at the on-ramp,
and students gravitate to timelines, maps, and quizzes over continuous prose.

---

## Goals

1. Every substantive section is **enterable**: a student can tell what it covers and what it
   costs them before committing.
2. Partial reading is **legitimate and supported**, because that is how the pages are already
   assigned.
3. Advertised times are **true**.
4. Dense expository prose becomes the visual furniture students already use.

**Non-goals.** No parallel simplified text (Approach B: doubles authoring, doubles weekly
refresh, and splits the class into a visible "easy version" track). No hide-by-default
disclosure (Approach C: below-level readers would get less content, not more accessible
content). No site-wide FK target. No change to citations, quotes, dated snapshots, or the
per-page accents.

---

## The component: "Before you read"

One block at the top of each substantive section, between `.sec-head` and `.article` —
the slot where `.lede` currently starts.

```html
<div class="sec-head" id="branches">
  <span class="num">Question 1</span>
  <h2>What are the three branches of government?</h2>
</div>

<aside class="before-read" aria-labelledby="br-branches">
  <p class="br-head" id="br-branches">
    <span class="tag">Before you read</span>
    <span class="br-time">4 min</span>
  </p>
  <p>Congress writes the laws. The president carries them out. The courts decide what
     they mean.</p>
  <p>No one branch can act alone — that was the whole point.</p>
  <p class="br-first">First: <a href="#where-things-stand">Where Things Stand</a></p>
</aside>

<div class="article">…unchanged…</div>
```

- `<aside>` — genuinely tangential to the prose, and it keeps the block out of the article's
  reading flow for screen readers while remaining reachable.
- `.tag` reuses the existing kicker idiom (`.callout`, `.vocab` already use it).
- `.br-first` appears **only** where a section genuinely depends on an earlier one. Most
  sections omit it. It is the reason the label is "Before you read" rather than "Key ideas."
- No new colors. Left-rule treatment matching `.callout` / `.vocab`, drawing on the page's
  own `--accent`, so each page keeps its distinct palette (working-notes §5).

**Content rules.** 2–3 sentences, ~35–60 words. Plain words even where the section's prose
cannot avoid the technical term — this block is where "naturalization" becomes "becoming a
citizen." Story-first per `docs/VOICE.md`: state the idea, not "this section will cover."
No citations in the block; it summarises claims that are cited below. Never introduce a fact
that does not appear in the section.

**It is a summary, not a substitute.** A student who reads only the blocks gets the spine of
the topic and knows it is a spine. That is an acceptable floor, and it is what makes the
block honest rather than remedial.

---

## Length honesty

Per-section word counts are measured, not estimated. At 130 wpm — a reasonable middle-school
silent-reading rate, and deliberately not an adult rate:

| Page | Prose words | Real | Currently advertised |
|---|---|---|---|
| gun-violence | 9,715 | **~75 min** | 25–45 min |
| immigration | 5,850 | ~45 min | 30–50 min |
| ai | 5,796 | ~45 min | 25–45 min |
| ukraine | 4,499 | ~35 min | 30–50 min |
| us-elections | 3,332 | ~26 min | 25–45 min |
| iran | 3,321 | ~26 min | 20–40 min |
| climate-change | 2,048 | ~16 min | 25–40 min |
| space-race | 1,801 | ~14 min | 25–40 min |

Two distinct errors: gun-violence is advertised at roughly half its true length, and the two
shortest pages are advertised as longer than they are. Both get corrected on the homepage
cards and in each page's hero meta.

Within-page imbalance is the sharper problem for a student told to "read section 4":

```
gun-violence  School Safety Measures      1,985w  ~15 min
              How Other Countries Handle  1,515w  ~12 min
              Understanding the Scale     1,377w  ~11 min
              Key People                    223w   ~2 min
```

The `.br-time` figure on each block fixes this, and the section nav gains the same number.

**Splitting `gun-violence.html` is explicitly deferred.** At 75 minutes it is the one page
that arguably needs it, but splitting changes URLs teachers have already linked from Canvas,
and the scaffolding may make it navigable enough. Revisit after a term of classroom use.

---

## Converting dense prose to existing components

Editing, not rewriting. Where a paragraph enumerates parallel items, it becomes the component
the page already has — `.stat-trio`, `.tl-item`, `.vocab`, `.perspective`. Candidates found
by measurement (longest sections with list-shaped prose):

- gun-violence → *School Safety Measures* (1,985w), *How Other Countries Handle This* (1,515w)
- immigration → *How Is the Immigration System Built?* (1,044w)
- iran → *Where Things Stand / Hormuz Talks* (1,076w)
- ukraine → *Where Does the War Stand?* (1,139w)

Constraint: **conversion moves words, it does not delete claims.** Every `cite-inline` in a
converted passage survives into the component. Citation counts per page are regression
invariants and must be identical before and after.

---

## Scope of the writing

A block is warranted where a section is substantive: excluding easter eggs, video lists,
source rails, Key People, and anything under 150 words, **56 blocks** across eight pages.

```
ai              10      ukraine          9      gun-violence     8
immigration      8      climate-change   6      us-elections     6
iran             5      space-race       4
```

At 35–60 words each that is roughly **2,500 new words site-wide, ~315 per page** — against
~36,000 words of existing prose. 37 sections are skipped as navigational or already short.

Each block is reusable outside the page: as a review sheet, a sub plan, a study guide, or
the recall prompts for a warm-up. That reuse is part of why this approach was chosen over a
parallel simplified track, which produces text usable only in place.

---

## Rollout

Per page, in this order — cheapest signal first, so value lands before the largest edits:

1. `us-elections.html` — 10 sections, well-structured, already question-headed. Proves the
   component and the voice of the blocks.
2. `space-race.html` — shortest; confirms the block does not overwhelm a light page.
3. Remaining six by ascending length, ending with `gun-violence.html`.

Homepage time corrections ship with step 1, since they are independent of the blocks.

---

## Verification

Beyond the standing invariants (`cite-inline`, `.term`/`.term-desc`, div balance,
`img`/`onerror`, id uniqueness — all must be unchanged):

- Every `.before-read` has a unique id wired to `aria-labelledby`.
- Block word count within 35–60; flag outliers.
- FK of the blocks themselves measured separately — the blocks *should* hit ~6, since they
  are where plain words are actually available.
- Every `.br-first` href resolves to an id on the same page.
- `.br-time` matches recomputed section word count ÷ 130, so drift is detectable later.
- Blocks render correctly under the dyslexic toggle and both enlarged text sizes, and at
  320px width.
- `docs/VOICE.md` gains a short section on writing these blocks, so future topics get them
  by default rather than retrofitted.

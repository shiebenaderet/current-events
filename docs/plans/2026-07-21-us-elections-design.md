# US Elections & How Government Works — Design Document

**Date:** July 21, 2026
**Type:** New page (from scratch — no existing content)
**Files:** `us-elections.html` (new), `index.html` (add topic card + nav link)

---

## Concept

A new topic page, matching the established structure and conventions of `iran.html`, `ukraine.html`, and `ai.html`: numbered explainer sections, a live "right now" update-pane, a history timeline, Key People, Videos, Resources, quizzes with a points/easter-egg system. Unlike the other three pages, this is built from scratch, not refreshed — there is no existing content to preserve or correct.

**Core angle, confirmed with the project owner:** a blend of durable 3-branch civics (content useful in any election year) plus a live thread tied to the actual 2026 midterm elections as the current-events hook. No special refresh-cadence pre-planning is needed — this page will be refreshed organically later, the same way the other three pages were, once its content goes stale.

**The defining constraint for this page, more so than any prior page on this site: strict nonpartisanship.** Every sentence touching current politics — including "who currently controls the presidency/House/Senate" — must be stated as plain, structural fact, never characterized as good, bad, at-risk, or a mandate. The test for every such sentence: *would this read the same regardless of which party currently holds power?* This is a harder bar than "cite your sources," and gets its own dedicated verification step (see Verification section below), separate from and in addition to this project's now-established primary-source-verification discipline.

**Scoping research was done in advance** (a research pass covering the 2026 midterm cycle's actual mechanics, primary results, redistricting, and retirements as of July 2026) to ground this design in real, current facts. That research already self-corrected one likely-fabricated fact (a "Sen. Alan Armstrong (R-Okla.)" retirement that didn't reappear under a second, more careful check and doesn't correspond to any real senator — excluded from this design entirely). Every fact used in this design is a **starting point for scoping, not pre-approved copy** — re-verified against a live, current, nonpartisan source at implementation time, exactly as every prior plan on this project has treated its own scoping research.

---

## Page Structure

Following the established site pattern (numbered "Question N" sections, Focus boxes as needed, timeline, Key People, Videos, Resources):

1. **Section 1 — "What are the three branches of government?"** Executive, Legislative, Judicial: what each does, who's in each, structurally. Include generic, role-based explanations of the Speaker of the House and Senate Majority Leader here (what the role's power is, not who currently holds it) — this sets up the update-pane's later "who holds it now" fact block without baking a current name into durable content.
2. **Section 2 — "Why doesn't any one branch have all the power?"** Checks and balances: concrete mechanism examples (President can veto; Congress can override with a 2/3 vote; courts can rule a law unconstitutional; the Senate confirms presidential appointments including judges; Congress can impeach). Framed entirely around mechanism, not tied to any current controversy or officeholder.
3. **Section 3 — "How does a bill become a law?"** The actual process: introduced → committee → floor vote in each chamber → conference committee if the two chambers' versions differ → presidential signature or veto → possible override. Durable and mechanical, no current-events tie-in needed or wanted.
4. **Section 4 — "How do elections actually work?"** Primaries vs. general elections; the Electoral College (president) vs. direct election (Congress and most other offices); why midterms are called "midterms" (they fall at the two-year midpoint of a four-year presidential term); House terms (2 years, all seats every cycle) vs. Senate terms (6 years, staggered into three roughly-equal "classes" so only about a third are up each cycle) — this is where the update-pane's "35 Senate seats, not 100" fact gets its structural grounding.
5. **Update pane — "Where Things Stand: The 2026 Midterms"** (see below — the live thread, positioned prominently, matching Iran/Ukraine's placement convention).
6. **History Timeline** — durable, settled expansions of democratic participation (see below).
7. **Key People** — historical/framer figures only (see below — this was a specific, deliberate scoping decision, not an oversight).
8. **Videos, Resources** — same format as the other three pages.

---

## The Update Pane: "Where Things Stand: The 2026 Midterms"

Reuses the exact `update-pane`/`mini-tl` markup already established by `iran.html`/`ukraine.html` — same component, civics-flavored content instead of conflict-flavored.

**Header framing:** not a "Day N" counter (there's no single start-event the way a war has an opening strike) — instead, an Election Day countdown/anchor framing, since November 3, 2026 is a genuinely concrete, motivating fixed date. Exact wording TBD at write time, but should read as "counting down to a known date," not an open-ended crisis.

**Mini-timeline entries** (all facts below are the research pass's findings — **re-verify every one against a live, nonpartisan, current source before writing**, per this page's Global Constraints):

- **Primaries running since March 2026** (Super Tuesday, then state-by-state through summer 2026). Mention, as a plain factual data point about how primaries function, that multiple sitting members of Congress lost their primaries this cycle (research flagged Bill Cassidy and John Cornyn in the Senate, several House members including Thomas Massie) — state this as "X incumbents lost primaries" without characterizing why, the same way a factual casualty count is stated without editorializing on a war's justification elsewhere on this site.
- **Redistricting, 2025**: six states redrew congressional maps in 2025 (research flagged Texas, California, Utah, North Carolina, Missouri, Ohio) — unusually high, since maps are normally redrawn only once per decade after the census. Use Texas (map → federal court blocked it → Supreme Court allowed it to proceed) and California (Proposition 50, a voter ballot measure) as a **contrasting pair illustrating two different mechanisms** for the same underlying process (legislature-and-courts vs. direct voter referendum) — present both as parallel examples of *how* redistricting can happen, not as commentary on either state's map.
- **Retirements**: cite the high retirement count as a factual data point (research flagged a March 2026 tally of 68 members not seeking reelection, described as the most since 2018 at that point in a cycle — re-verify this exact number and framing at write time, tracker counts update). Name at most 1-2 of the longest-tenured retirees purely by role/seniority/tenure-length (e.g., "a former Speaker of the House with decades in Congress"), never by characterizing their record or legacy.
- **Election Day, November 3, 2026**: all 435 House seats, 35 Senate seats (33 regular-cycle "Class II" seats plus 2 special elections — research flagged these as filling seats vacated when their occupants moved to executive-branch roles; verify this framing and the specific seats at write time), and roughly three dozen governor's races (research flagged 36 states + 3 territories — verify).

**"Who controls what, right now" fact block** (added per the project owner's explicit request, folded into the update-pane rather than given its own section): a clearly-dated snapshot stating which party holds the presidency, the House majority, and the Senate majority as of the page's write date, plus who currently holds the Speaker of the House and Senate Majority Leader roles. Followed by one paragraph connecting this to the midterms' stakes — tied back to Section 1's generic explanation of what these roles/chambers actually do (e.g., "the Speaker decides which bills come to a vote in the House — that's why which party controls the House matters this election"). **This fact block must pass the nonpartisanship test explicitly**: read it back and confirm it would read exactly the same if the two parties' current roles were swapped. No language implying the current arrangement is good, bad, fragile, deserved, or under threat — state it the same way the page states "the Speaker controls the House floor schedule."

**A `.vocab` box on the historical midterm pattern**: the well-documented pattern that the president's party has lost House seats in the large majority of midterms since 1946 (research flagged 18 of 20, citing UCSB's American Presidency Project as a nonpartisan academic source with the actual data table) — framed explicitly as **general, historical political-science knowledge**, not a prediction about 2026 specifically. Phrase this the way the page would phrase any other historical pattern (e.g., "political scientists have observed that...") rather than "this year will likely..."

---

## History Timeline

Durable, settled, nonpartisan expansions of democratic participation — no current-events risk, matching the depth/tone of the AI page's 1950–2024 historical arc:

- 1787 — Constitutional Convention
- 1870 — 15th Amendment (voting rights regardless of race — note honestly that enforcement was long and unevenly delayed, a factual historical point, not a current-events one)
- 1920 — 19th Amendment (women's suffrage)
- 1965 — Voting Rights Act
- 1971 — 26th Amendment (voting age lowered to 18)

Exact framing/citations TBD at write time, following the same footnote/citation conventions as the other three pages' timelines.

---

## Key People — Historical Figures Only (Deliberate Scope Decision)

**This section profiles framers/historical figures relevant to the Constitution's design and voting-rights history — explicitly NOT current sitting officials**, even though the update-pane names current officeholders in a plain factual mention. This is a deliberate distinction, not an oversight or inconsistency:

- A plain factual sentence ("the Speaker of the House is currently [name]") inside a dated, structural fact block carries essentially no framing risk — it's the same category of statement as citing a stat.
- A **Key People card** — this site's established format of a photo, a name, a role line, and a short bio paragraph, presented with the same visual weight given to figures like Zelenskyy or Geoffrey Hinton elsewhere on this site — is a fundamentally different kind of statement. Profiling a *current, sitting political figure* in that exact format risks reading as an endorsement or a target, regardless of how carefully the bio text itself is worded, simply because of the format's implicit "this person matters enough to feature" framing.

Confirmed with the project owner: default to historical figures only for this section (e.g., a key framer, a Voting Rights Act figure). If a future need for profiling current officeholders arises, that should be a separate, narrower decision — not something to fold into this page's initial build.

---

## Sourcing and Verification Standard

Same primary-source-verification discipline this project has now required twice after real caught problems on other pages (see the project's established convention: a live/200 URL is necessary but not sufficient — fetch and read the actual source to confirm it supports the specific claim, don't trust a search snippet or a plausible-sounding citation).

**Additional, page-specific verification step, required for this page only**: a dedicated **nonpartisanship read-through**, separate from and in addition to fact-checking. For every sentence touching current politics (which party controls what, any officeholder named, any characterization of an election outcome), ask explicitly: *would this sentence read the same if the parties currently holding each role were swapped?* If the answer is no — if the sentence would suddenly read as odd, defensive, or celebratory with the parties reversed — it fails this test and needs to be rewritten as a genuinely structural statement.

Every new factual claim gets a real, live, non-paywalled citation, using the `<cite-link><a href="..." target="_blank">src</a></cite-link>` inline pattern (matching `iran.html`/`ukraine.html` — the majority convention on this site, and the better fit for this page's update-pane-driven structure) rather than `ai.html`'s footnote-list pattern.

Written at a 5th–6th grade reading level, per the project's contribution guidelines — noting the final whole-branch review on the AI refresh flagged that the site's actual register runs closer to grade 11–14 throughout; this new page should aim for the stated target rather than inherit the higher register by default, since it has no existing prose to match.

---

## Explicitly Out of Scope

- Any characterization of a party, candidate, official, or election outcome as good, bad, right, wrong, deserved, or at-risk — anywhere on the page.
- Profiling current sitting officials in the Key People section (see above — a deliberate scope decision).
- Predicting 2026 midterm outcomes — historical patterns are cited as general knowledge, never as a forecast for this specific cycle.
- Detailed state-by-state election results, polling data, or campaign-finance specifics — this page teaches structure and mechanics, not a comprehensive election tracker.
- New CSS classes, structural/component changes beyond what's needed to instantiate the same page pattern already used by the other three topic pages, changes to the shared nav/points/easter-egg system beyond adding this page to it.

---

## Verification / Success Criteria

Same manual discipline as every prior page on this project (no test runner, plain HTML): grep checks for placeholder/stale content, browser read-throughs, citation-link clicks, quiz function checks, a byte-level CSS/script drift check against the other three pages' shared conventions (to confirm no accidental divergence in shared patterns).

**Nonpartisanship-specific success criterion, unique to this page**: every sentence touching current politics passes the "would this read the same with the parties swapped" test. This should be checked by a dedicated pass separate from the general read-through, and — given the sensitivity of this topic — should be treated with at least as much rigor as this project's citation-accuracy checks have been given on the last two pages.

**Overall success criteria**: the page teaches durable 3-branch civics a student could use to understand any election year, not just 2026; the update-pane gives it real current relevance without reading as commentary; every fact (including "who's currently in charge") is stated plainly and independently re-verified at write time; Key People stays confined to historical figures; the page integrates cleanly into the site's existing nav/index/points system exactly like the other three topic pages.

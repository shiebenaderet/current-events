# Voice

Standing editorial note for every future content refresh, new topic, and copy edit. `space-race.html` (v3.1.1) and the rest of the live topics (v3.1.2) are the model for voice. Dated “what’s happening” panes follow the v3.2.0 snapshot pattern: an explicit as-of date, sourced links, and no invented totals.

The usual failure is **voice, not facts**. True sentences stacked without handing off, or asides that talk about “the page,” break the story. Rewrite so **the story carries the facts**.

## Story-first

- The second sentence should be a consequence of the first, not a new unconnected true statement.
- Open on people, events, and objects (a beep, a cathedral, a lockdown drill) — not on a policy about how the explainer is written.
- Give a thing its job before its dates. (Starliner is a different capsule with a different job, *then* the missing launch date.)
- Cite after the fact the source supports, not after a civics kicker.

## Do not talk about “the page”

Cut student-facing “this page / this section / further down this page” except functional notes:

- content warnings
- Konami teacher tips
- “the form does not store what you type”
- hero nonpartisanship / sourcing notes
- discussion questions that treat the explainer as a classroom object

Write the rule in the student’s ear instead: “Policy, not headlines,” not “This page is about policy, not headlines.”

## Date the news

Never use undated “now / today / currently / right now” for an ongoing event. Use an explicit date (“As of August 27, 2026”). Historical “today” (a cathedral still standing a thousand years later) is fine if it cannot be mistaken for a news ticker.

Pages are refreshed periodically. Relative phrasing goes silently stale between refreshes.

## Facts stay facts

- Reading level: about 5th–6th grade, with 8th-grade depth. Contractions are fine.
- Every factual claim needs an inline citation to the original article. Prefer free-to-access sources. Wikipedia is a last resort.
- Do not invent casualty, oil, retirement, ICE/TRAC, or incident totals. Prefer the last cited as-of date over a fresher-looking guess.
- Party-swap test on current-policy prose: the sentence should read the same if the other party held the role. Accuracy, not false balance, for settled history and science.
- Quote punctuation stays as the source wrote it (especially `ai.html`).
- Sitting officials belong in the dated update (or the local-district section). Key People are historical figures whose part in the story is already settled.

## "Before you read" blocks

Every substantial section opens with one. Navigational sections (videos, sources, Key People) and anything under 150 words do not get one.

- **2–3 sentences, 35–60 words.** A spine, not a preview.
- **Only what the section already says.** No new facts, no new numbers, no citations. If a claim is worth making in the block, it is already made and cited below.
- **This is where plain words live.** The section keeps “naturalization”; the block says “becoming a citizen.” Jargon still belongs in a `.term` tooltip, not a parenthetical.
- **Story-first, same as everything else.** “Congress writes the laws,” not “This section explains how Congress writes laws.”
- **Never describe the page to the student.** “This is the longest section” is the same violation as “further down this page” — the minute label already carries it.
- **Dated updates get their date in the block too.** Never “currently.”
- **A contested question stays contested.** If the section uses `.perspective`, the block names both positions and picks neither. If researchers do not know yet, the block says so.
- **Settled history stays settled.** The Holodomor block states the famine as deliberate, because it was.
- **`.br-first` only where a section genuinely depends on an earlier one** — and not even then if the section's own opening line already says so.
- **The time comes from `tools/reading_time.py`,** never from a guess. Re-run it after a content refresh and update any `.br-time` that moved.

Blocks should measure below the page's own reading level; that is the whole point of them. Check with the FK snippet used in the v3.4.0 build before shipping a new one.

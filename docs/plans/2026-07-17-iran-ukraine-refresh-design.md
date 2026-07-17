# Iran & Ukraine "Right Now" Refresh — Design Document

**Date:** July 17, 2026
**Type:** Content update (no new template, no new sections/nav items)
**Files:** `iran.html`, `ukraine.html`

---

## Concept

Both pages have a dated "situation update" pane plus a "what's happening right now" section that were last written **March 8, 2026**. It is now **July 17, 2026** — over four months later. In that window:

- **Iran** went through a full ceasefire → peace memorandum → collapse arc that the page doesn't mention at all. The page's history timeline literally ends on the sentence "The situation is still unfolding," dated Feb–March 2026.
- **Ukraine** is still directionally accurate (no ceasefire, Donbas still the sticking point) but the specific facts, dates, and stats in the "peace talks so far" narrative are stale.

This is a **content refresh**, not a redesign. No new visual components, no new sections, no changes to nav, quizzes, timeline structure, or CSS. Every replaced block keeps the exact HTML class structure and visual pattern already in place (`update-pane`, `update-box`, `stat-grid`, `callout`, `vocab`, `cite-link`, `footnotes`) so the page's look is untouched — only the words, dates, numbers, and sources inside those existing containers change.

Sourcing standard stays consistent with the rest of the site: every factual claim gets an inline `cite-link` to a trusted news/reference source (Al Jazeera, CNN, Reuters, AP, CFR, CSIS, Wikipedia backed by cited primary reporting, etc.), written at a 5th–6th grade reading level per the project's contribution guidelines.

---

## Part 1 — Iran (`iran.html`)

### 1a. Update pane (`#update-week1`) — full replacement

**Current state:** A "Day 1 → Day 9" mini-timeline (Feb 28–Mar 8, 2026) plus three `update-box` cards (spreading / cost / reactions), all frozen at day 9 of the war.

**New state:** Replace the day-by-day mini-timeline with a **turning-points mini-timeline** — same `.mini-tl` markup, same dot-color pattern (red = war/escalation, gold = transition, blue = diplomacy, green = de-escalation/resolution attempt), but each entry is a major beat instead of a calendar day:

1. **Feb 28, 2026** — War begins (kept, one-line, links back to existing day-1 framing)
2. **Apr 8, 2026** — First ceasefire agreed (Pakistan-mediated)
3. **Jun 8, 2026** — Ceasefire strained by fresh IDF strikes on Tehran, Isfahan, Tabriz
4. **Jun 17, 2026** — Peace memorandum signed at the Palace of Versailles (Trump + Iranian President Pezeshkian), 60-day extension to negotiate final terms
5. **Jul 6–8, 2026** — Collapse: IRGC strikes tankers near Oman (incl. a Qatari LNG carrier), Strait of Hormuz shut down, US retaliatory strikes, Trump declares the ceasefire "over"
6. **Jul 2026 (current)** — Fragile re-escalation; Qatar and Pakistan trying to broker a return to talks

Update the header badge from "Day 9" to something like "4+ Months In" or "Ceasefire Collapsed," and the `update-pane-date` line to reflect today's framing (e.g., "Updated July 17, 2026 — after a ceasefire, a peace deal, and a collapse").

Rewrite the three `update-box` cards with the same headers/pattern but current content:

- **Box 1 ("How is the conflict spreading / where does it stand?")** — replace day-9 spread details with: current Hormuz status, which countries are currently involved, whether Lebanon/Gulf fronts are still active or quieted.
- **Box 2 ("What is it costing?")** — replace the day-9 stat grid (gas $3.41, +14%, 20%) with current oil-price and economic-impact figures tied to the July re-escalation; update casualty figures if more recent trusted totals exist, sourced.
- **Box 3 ("How are people reacting?")** — replace day-9 reactions with: the early-July public funeral for Khamenei, the fact his son/successor Mojtaba has still not appeared publicly, and the return of protests (retirees, workers, students) immediately after the funeral over economic hardship and the war.

Each box keeps its `details.update-sources` block, repointed to the new sources actually used.

### 1b. Section 1 "What is happening right now" (`#now`)

**Part 1 (Dec 2025–Jan 2026 protest wave):** Keep as-is — this is settled history and doesn't need new facts. Add one short bridging sentence noting that this same protest movement resurfaced in July 2026 after Khamenei's funeral (with a forward link/anchor to the update pane or a quick mention), so the section doesn't read as if the story stopped.

**Part 2 (currently "U.S. and Israel attack Iran," Feb–Mar 2026 framing):** Rewrite to summarize the full arc at a middle-school level: the strikes began Feb 28 → a ceasefire held for a couple of months → a peace deal was actually signed in June → it fell apart in July → the situation is tense and unresolved as of this update. Keep the existing casualty/damage facts that are still accurate (they're historical now, not "current"), just reframe them as "in the early days of the war" rather than as the present state.

Keep the existing "Something to think about" callout — it's still a good discussion prompt and doesn't depend on the date.

### 1c. History timeline (Question 4) — replace the placeholder ending

**Current state:** The timeline's last card is "🔴 February–March 2026 — U.S. and Israel Attack Iran," ending with the sentence *"Iran launched retaliatory strikes across the Middle East. The situation is still unfolding."*

**New state:** Keep that card (it's accurate as a description of the war's opening), but remove "The situation is still unfolding" and replace it with what actually happened next, then add one or two new timeline cards continuing the story:

- Update existing card's closing line to something like "Iran launched retaliatory strikes across the Middle East, opening a war that would last months." (removes the now-false implication that March was still "unfolding" in an open-ended way)
- **New card: Jun 17, 2026 — Peace Memorandum Signed at Versailles**
- **New card: Jul 2026 — Ceasefire Collapses, Fighting Resumes**

Same `.tl-item` / `.tl-dot` / `.tl-content` markup as existing entries. No quiz button needed on the new cards unless it fits naturally — check whether q7 (which asks about the *initial* framing of the operation) still makes sense sitting after these new cards; it should, since q7's question and answer are about how the operation was originally described, which remains true regardless of what happened later.

### 1d. Date stamps

Update every hard-coded "Updated March 2026" string to July 2026 (or the specific July date used), including: hero `.hero-note`, footer line, and the `update-pane-date` line already covered above. Also update the `.breaking` banner text at the top of the page (currently "March 8, 2026 — Day 9 of the U.S.-Israel war on Iran") to reflect current status instead of day 9.

### 1e. Quizzes — no changes

Verified q1, q7, q8 (the three tied to this content) test facts that remain true after the update (the 2026 crackdown death toll, how the operation was originally described, and pre-war US-Iran relations). No quiz text or answers need to change.

---

## Part 2 — Ukraine (`ukraine.html`)

### 2a. Section 7 "Where does the war stand today?" (`#now`) — targeted rewrite, not a rebuild

Keep the section's structure exactly (`Front lines` → `Peace talks so far` → `Biggest obstacle` → `Human cost` → `Global impact` → stat grid → footnotes). Update the content within each:

- **Peace talks so far:** Replace the January-Paris-only narrative with the fuller picture through July: February Geneva trilateral meetings, a June deadline that produced limited results, multiple POW exchanges (April–early June), brief pauses around Orthodox Easter and Victory Day, and Zelenskyy's June 4 open letter proposing an immediate frontline ceasefire and an "all-for-all" exchange. Keep the framing that Russia has continued to refuse a full ceasefire and that territory remains the core blocker — that hasn't changed.
- **Front lines / territory %:** Update the occupied-territory figure and reconstruction-cost estimate if current sourced numbers differ meaningfully from the March figures (~20% / ~$588B) — otherwise leave as-is rather than force a change with no real update behind it.
- **Human cost stat grid:** Refresh refugee/displaced-person figures to the most current UNHCR numbers available, sourced the same way as today (inline `cite-link` + footnote).
- **Global impact:** No structural change expected — Finland/Sweden/NATO framing is durable history, not time-sensitive.

### 2b. Timeline "2025–2026 Peace Negotiations Ongoing" card

Light touch, not a rewrite: add one clause of specificity (e.g., naming the Geneva trilateral talks and/or Zelenskyy's June 4 letter) so the card reflects that concrete things happened in this window, rather than only saying negotiations are "ongoing" in the abstract. Keep it to roughly the same length as the other timeline cards.

### 2c. Date stamps

Update "Updated March 2026" in the hero `.hero-note` and footer to July 2026.

### 2d. Quizzes — no changes expected

The Ukraine `#now` section doesn't currently have a quiz button tied directly to it (q7 there is the general timeline quiz). No quiz content changes anticipated; confirm during implementation that no quiz question hard-codes a March-specific stat that's being changed.

---

## Out of scope (confirmed with user)

- **AI & Society page (`ai.html`):** No dated "breaking now" claims exist on this page — it's conceptual/historical framing (what AI is, how it learns, key people, timeline). Not touched in this pass.
- **Ukraine's pre-2022 history sections, Iran's Questions 2/3/5, Key People, Videos, Resources:** Not time-sensitive, not touched.
- **New topic pages** (climate, immigration, etc.): Explicitly deferred to a follow-up conversation after this refresh ships.

---

## Sourcing plan

Facts for this refresh come from the research already gathered in-conversation, primarily:
- Wikipedia: "2026 Iran war," "2026 Iran war ceasefire," "Timeline of the 2026 Iran war," "2025–2026 Iranian protests," "Peace negotiations in the Russo-Ukrainian war (2022–present)," "2026 United States–Ukraine–Russia meetings in Geneva"
- Al Jazeera live blogs (Jul 1, Jul 10, Jul 13 "March to July" retrospective)
- CNN live coverage (Jul 4, Jul 5, Jul 9 — Khamenei funeral, ceasefire collapse)
- CSIS ("Unfinished Plan for Peace in Ukraine")
- NCRI Iran News in Brief (Jul 9, 11, 12, 14)

Implementation should re-verify each specific figure/date against a live source at write time and use the same trusted-source bar the rest of the site holds to (no paywalled-only sources, prefer sources students can actually click through and read).

---

## Success criteria

- No page contains a dangling "as of March 2026" or "still unfolding" claim that is now four months stale.
- Iran's update pane and Section 1 read as a coherent account of a war that had a ceasefire, a peace deal, and a collapse — not as if the story stopped at day 9.
- Ukraine's peace-talks narrative reflects what's actually happened Feb–July without changing the page's overall shape.
- Every new or changed factual claim has an inline source link, matching the site's existing citation density.
- Visual output is indistinguishable from the current page design — same colors, same components, same layout — because only content changed, not structure or CSS.

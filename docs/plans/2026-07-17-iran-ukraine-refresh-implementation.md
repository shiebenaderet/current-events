# Iran & Ukraine "Right Now" Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `iran.html` and `ukraine.html`'s "what's happening right now" content up to date as of July 17, 2026, and audit both pages' images and links for cropping, mislabeling, and dead-link problems — all without changing either page's visual design, CSS, or component structure.

**Architecture:** Content-only edits inside existing HTML containers (`update-pane`, `update-box`, `mini-tl`, `s-card`, `tl-item`, `stat-box`, `footnotes`, `portrait-inner`, `img-caption`). No new CSS classes, no new sections, no nav changes, no quiz changes. This is a content swap, not a rebuild — every step replaces text/attributes/links inside markup that already exists in the file. Two workstreams: (1) Tasks 1–9 refresh the stale "right now" content; (2) Tasks 10–12 audit images, links, and citations across both pages for accuracy problems independent of the date refresh. Task 13 is the final verification pass over both workstreams.

**Tech Stack:** Plain HTML, no build step. Verification is manual: grep for stale strings, open the file in a browser, check links resolve. There is no test runner in this repo — "tests" in this plan mean grep checks and visual spot-checks, not unit tests.

## Global Constraints

- Write all new prose at a 5th–6th grade reading level (project convention — see `current-events-README.md` contribution guidelines).
- Every new factual claim gets an inline `<cite-link><a href="..." target="_blank">src</a></cite-link>` (Iran page pattern) or a footnote reference (Ukraine page pattern) pointing to a real, currently-live, non-paywalled source.
- Do not modify CSS, nav structure, quiz definitions (`q1`–`q8` in Iran, quiz objects in Ukraine), the points/easter-egg system, or any section not named in this plan.
- Preserve exact existing class names and HTML structure in every replaced block — only the text/attributes inside change.
- Re-verify every date/figure against a live source at write time (the design doc's cited sources are a starting point, not a copy-paste source).
- Every image used on either page should have a source/attribution link nearby, matching the project's contribution guideline that images come from Wikimedia Commons (CC-licensed/public domain) or original photography — Task 12 closes gaps found in the existing pages, and any new image swapped in during Tasks 10–11 must carry its own real citation, not reuse a neighboring image's caption.

---

## Reference Files

- **Design doc:** `docs/plans/2026-07-17-iran-ukraine-refresh-design.md`
- **Iran page:** `iran.html`
- **Ukraine page:** `ukraine.html`
- **Index page (date stamps only):** `index.html`

## Known Source Starting Points (re-verify at write time)

| Fact | Source |
|---|---|
| Apr 8, 2026 ceasefire | Wikipedia "2026 Iran war ceasefire"; House of Commons Library CBP-10637 |
| Jun 8, 2026 fresh IDF strikes | Wikipedia "2026 Iran war" |
| Jun 17, 2026 Versailles peace memorandum | Wikipedia "2026 Iran war"; multiple news retrospectives |
| Jul 6–8, 2026 collapse (tanker strikes, Hormuz closure, ceasefire declared over) | CNN "July 9, 2026 — US-Iran ceasefire crumbles"; Al Jazeera "March to July: What's different" (2026/7/13) |
| Khamenei funeral (early July), Mojtaba not appearing publicly, protests resuming | CNN "July 4/5, 2026" live coverage; NCRI Iran News in Brief (Jul 9/11/12/14) |
| Ukraine: Feb Geneva trilateral, June deadline, POW exchanges, Zelenskyy's June 4 letter | Wikipedia "2026 United States–Ukraine–Russia meetings in Geneva"; "Peace negotiations in the Russo-Ukrainian war (2022–present)" |
| Ukraine territory/refugee/reconstruction stats | CSIS "Unfinished Plan for Peace in Ukraine"; UNHCR data.unhcr.org/en/situations/ukraine |

---

## Task 1: Iran — Rebuild the Update Pane Mini-Timeline

**Files:**
- Modify: `iran.html:694–753` (the `#update-week1` header and `.mini-tl` block)

**Context:** The current mini-timeline has 9 daily entries (Feb 28–Mar 8, 2026), each a `.mini-tl-item` with a colored `.mini-tl-dot` (`d-red`/`d-gold`/`d-blue`/`d-green` — these are the only 4 dot colors defined in CSS at `iran.html:569-570`). The header badge currently reads "Day 9" and the date line reads "Updated March 8, 2026 — Nine days after the first U.S.-Israel strikes on Iran (Feb 28)".

- [ ] **Step 1: Verify current facts before writing**

Run a search to confirm the exact dates and framing for: the Apr 8 ceasefire, the Jun 8 IDF strikes, the Jun 17 Versailles memorandum, and the Jul 6–8 collapse. Confirm whether, as of the actual write date, a new ceasefire/talks have resumed or the situation remains collapsed — write the final "current" entry to match reality at write time, not necessarily what's summarized in this plan's source table above.

- [ ] **Step 2: Replace the header badge and date line**

At `iran.html:700` replace:
```html
<span class="update-badge">Day 9</span>
```
with (exact wording depends on live status confirmed in Step 1 — if still unresolved use):
```html
<span class="update-badge">Ceasefire Collapsed</span>
```

At `iran.html:703` replace:
```html
<p class="update-pane-date">Updated March 8, 2026 — Nine days after the first U.S.-Israel strikes on Iran (Feb 28)</p>
```
with:
```html
<p class="update-pane-date">Updated July 2026 — after a ceasefire, a peace deal, and a collapse</p>
```
(Use the actual write date in place of "July 2026" if more specific.)

- [ ] **Step 3: Replace the 9-day mini-timeline with a 6-entry turning-points timeline**

Replace the entire `<div class="mini-tl">...</div>` block (`iran.html:706-752`, i.e. everything between `<!-- ── DAY-BY-DAY TIMELINE ── -->` and the closing `</div>` before `<div class="update-grid">`) with:

```html
  <!-- ── TURNING POINTS TIMELINE ── -->
  <div class="mini-tl">
    <div class="mini-tl-item">
      <div class="mini-tl-dot d-red"></div>
      <span class="mini-tl-date">Feb 28</span>
      <span class="mini-tl-text"><strong>War begins —</strong> U.S. and Israel launch strikes on Iran. Supreme Leader Khamenei is killed; his son Mojtaba is later named successor. <cite-link><a href="https://www.aljazeera.com/news/2026/2/28/world-reacts-to-us-israel-attack-on-iran-tehran-retaliation" target="_blank">src</a></cite-link></span>
    </div>
    <div class="mini-tl-item">
      <div class="mini-tl-dot d-gold"></div>
      <span class="mini-tl-date">Apr 8</span>
      <span class="mini-tl-text"><strong>First ceasefire —</strong> After five-plus weeks of fighting, the U.S. and Iran agree to a Pakistan-mediated ceasefire. <cite-link><a href="https://en.wikipedia.org/wiki/2026_Iran_war_ceasefire" target="_blank">src</a></cite-link></span>
    </div>
    <div class="mini-tl-item">
      <div class="mini-tl-dot d-blue"></div>
      <span class="mini-tl-date">Jun 8</span>
      <span class="mini-tl-text"><strong>Ceasefire strained —</strong> Israel strikes military sites in Tehran, Isfahan, and Tabriz, nearly reigniting the war. <cite-link><a href="https://en.wikipedia.org/wiki/2026_Iran_war" target="_blank">src</a></cite-link></span>
    </div>
    <div class="mini-tl-item">
      <div class="mini-tl-dot d-green"></div>
      <span class="mini-tl-date">Jun 17</span>
      <span class="mini-tl-text"><strong>Peace deal signed —</strong> At the Palace of Versailles, President Trump and Iran's President Pezeshkian sign a memorandum to end the war, with a 60-day window to negotiate final terms. <cite-link><a href="https://en.wikipedia.org/wiki/2026_Iran_war" target="_blank">src</a></cite-link></span>
    </div>
    <div class="mini-tl-item">
      <div class="mini-tl-dot d-red"></div>
      <span class="mini-tl-date">Jul 6&ndash;8</span>
      <span class="mini-tl-text"><strong>Collapse —</strong> Iran's Revolutionary Guard strikes commercial tankers near Oman and shuts down the Strait of Hormuz. The U.S. retaliates. President Trump declares the ceasefire "over." <cite-link><a href="https://www.cnn.com/2026/07/09/world/live-news/iran-war-trump" target="_blank">src</a></cite-link></span>
    </div>
    <div class="mini-tl-item">
      <div class="mini-tl-dot d-gold"></div>
      <span class="mini-tl-date">Now</span>
      <span class="mini-tl-text"><strong>Fragile and tense —</strong> Qatar and Pakistan are working to bring the U.S. and Iran back to the table, but no new ceasefire has been announced. <cite-link><a href="https://www.aljazeera.com/news/2026/7/13/march-to-july-whats-different-as-us-iran-fighting-escalates-again" target="_blank">src</a></cite-link></span>
    </div>
  </div>
```

Confirm the exact wording/dates against a live search before finalizing — do not commit this block verbatim without checking it against current reality at write time.

- [ ] **Step 4: Verify no leftover day-by-day references**

Run: `grep -n "Day [0-9]" iran.html`
Expected: no matches inside the update pane (the "Bonus" q7 quiz content and other unrelated day-numbering, if any, should be checked manually — none is expected).

- [ ] **Step 5: Open the file in a browser and visually check the mini-timeline**

Run: `open iran.html` (or equivalent) and scroll to the update pane. Confirm: 6 dots render in the colors red/gold/blue/green/red/gold, text wraps correctly, all `src` links open in a new tab and resolve to a real page (click each one).

- [ ] **Step 6: Commit**

```bash
git add iran.html
git commit -m "feat: rebuild Iran update pane with ceasefire-to-collapse arc"
```

---

## Task 2: Iran — Rewrite the Three Update-Box Cards

**Files:**
- Modify: `iran.html:756-928` (the three `.update-box` cards inside `.update-grid`)

**Context:** Each box (`How is the conflict spreading`, `How much is this costing`, `How are people reacting`) currently describes day-9 facts (Mar 8, 2026). Rewrite each to describe the current (July 2026) situation, keeping the exact same HTML structure: `h3` header, body `p` tags, one `.stat-grid` (box 2 only), one `.vocab` box (box 2 only), one `.callout.c-gold` "Think about it" box per card, and one `details.update-sources` block per card.

- [ ] **Step 1: Rewrite Box 1 — "How is the conflict spreading?"**

Replace the box's `<h3>` and all `<p>` tags between it and the `.callout` (currently `iran.html:759-780`) with content describing: whether the Gulf-state/Lebanon/Hormuz fronts from the opening days are still active or have quieted since the Apr 8 ceasefire; what specifically re-opened in the Jul 6–8 collapse (Hormuz shutdown, tanker strikes); which countries are currently involved as of the write date. Keep the existing `<strong>` emphasis pattern and `cite-link` format. Update the `.callout.c-gold` "Think about it" prompt only if the old one (about why Iran struck Gulf allies) no longer fits the new content — otherwise it can stay, since the underlying question is still relevant to a conflict that re-escalated along similar lines.

Update the `details.update-sources` list (`iran.html:790-798`) to list only the sources actually cited in the rewritten box.

- [ ] **Step 2: Rewrite Box 2 — "How much is this conflict costing?"**

Replace the intro paragraph, the `.stat-grid` (`iran.html:810-826`), the Strait of Hormuz paragraph, and the human-cost paragraph (`iran.html:806-841`) with current figures. Search for the current oil price, gas price, and any updated casualty/economic-impact figures tied to the July re-escalation. Use the same `.stat-box` markup:

```html
<div class="stat-grid" style="grid-template-columns:repeat(auto-fit,minmax(130px,1fr))">
  <div class="stat-box" style="background:rgba(255,255,255,.08)">
    <span class="stat-num" style="color:#f0b429">[VALUE]</span>
    <span class="stat-label" style="color:rgba(255,255,255,.6)">[LABEL]</span>
    <span class="stat-source" style="color:rgba(255,255,255,.35)">[SOURCE, DATE]</span>
  </div>
  <!-- repeat for 2-3 stats total, matching existing 3-stat pattern -->
</div>
```

Keep the `.vocab` "Strait of Hormuz" definition box (`iran.html:843-845`) as-is — it's a durable geography/vocab explainer, not a dated fact, unless the Hormuz situation has changed so much the definition itself needs adjusting (e.g., if it's no longer closed).

Update the `.callout.c-gold` prompt and the `details.update-sources` list to match new content and sources.

- [ ] **Step 3: Rewrite Box 3 — "How are people reacting?"**

Replace the content (`iran.html:872-908`) to cover: the early-July public funeral for Khamenei, Mojtaba's continued public absence, and the protests (retirees, workers, students) that resumed after the funeral over economic hardship, inflation, and the war. Keep the existing structure of splitting reactions by group (previously: inside Iran / in the U.S. / allies / critics / Gulf states / Yemen) — adapt which groups are covered based on what's actually newsworthy in July rather than forcing all the same categories. Update the `.callout.c-gold` prompt and `details.update-sources` list.

- [ ] **Step 4: Verify all three boxes render and all links resolve**

Run: `open iran.html`, scroll through all three update-box cards, click every `cite-link` and every link inside each `details.update-sources` block, confirm each opens a real, currently-live page (not a 404).

- [ ] **Step 5: Commit**

```bash
git add iran.html
git commit -m "feat: rewrite Iran update-box cards with July 2026 facts"
```

---

## Task 3: Iran — Update Section 1 "What Is Happening Right Now"

**Files:**
- Modify: `iran.html:955-1017` (Section 1 body, `#now`)

**Context:** Part 1 (Dec 2025–Jan 2026 protest wave, `iran.html:957-984`) is settled history and should not need factual changes. Part 2 (`iran.html:986-1016`) currently frames the war as if it just started and is open-ended.

- [ ] **Step 1: Add a bridging sentence to Part 1**

After the existing `.vocab` "Supreme Leader" box (`iran.html:982-984`) and before the "Part 2" `<h3>` (`iran.html:986`), add one short paragraph:

```html
    <p>
      This same protest movement came back in July 2026 — after Iran's government held a public funeral for the Supreme Leader killed earlier in the war, protesters returned to the streets over the same economic hardship that started it all. <cite-link><a href="[SOURCE URL]" target="_blank">src</a></cite-link>
    </p>
```

Fill in `[SOURCE URL]` with a verified live source for the July protest resumption (candidate: NCRI Iran News in Brief, or an Al Jazeera/CNN piece covering post-funeral protests — verify at write time).

- [ ] **Step 2: Rewrite Part 2 to summarize the full arc**

Replace the two `<p>` tags in Part 2 (`iran.html:988-996`) with a version that: states the strikes began Feb 28, notes a ceasefire followed within weeks, states a peace deal was signed in June, states it collapsed in July, and notes the situation remains tense and unresolved as of the page's update date. Keep the existing casualty/damage facts (3 American troops killed, 153 civilians reported killed at a school) but reframe them explicitly as things that happened "in the war's opening days" rather than presenting them as the current state. Keep the citation links to the PBS source for facts that source still supports; add new citations for anything not covered by the existing PBS link.

Do not alter the `.callout.c-gold` "Something to think about" box below it (`iran.html:998-1004`) — it remains a valid discussion prompt regardless of how the war has progressed.

- [ ] **Step 3: Verify the section reads coherently top to bottom**

Run: `open iran.html`, read Section 1 start to finish. Confirm there's no remaining sentence implying the war is only 9 days old or that "the situation is still unfolding" in the March sense — it should be clear the reader is getting an update as of July.

- [ ] **Step 4: Commit**

```bash
git add iran.html
git commit -m "feat: update Iran Section 1 to summarize full ceasefire-to-collapse arc"
```

---

## Task 4: Iran — Fix the History Timeline's Placeholder Ending

**Files:**
- Modify: `iran.html:1395-1410` (the "February–March 2026" timeline card and its close)

**Context:** This is the `.tl-item` inside the Question 4 history timeline (not the update pane's mini-timeline from Tasks 1–2). It currently ends with the sentence "The situation is still unfolding," which is now false — plenty has happened since.

- [ ] **Step 1: Update the existing card's closing sentence**

In the `.tl-desc` at `iran.html:1401-1404`, replace:
```html
            The United States and Israel launched major military strikes targeting Iran's nuclear facilities and military infrastructure. <cite-link><a href="https://www.pbs.org/newshour/classroom/daily-news-lessons/2026/03/what-we-know-about-the-us-israel-attacks-on-iran" target="_blank">src</a></cite-link>
            Iran's Supreme Leader Ayatollah Khamenei was killed. <cite-link><a href="https://www.pbs.org/newshour/classroom/daily-news-lessons/2026/03/what-we-know-about-the-us-israel-attacks-on-iran" target="_blank">src</a></cite-link>
            Iran launched retaliatory strikes across the Middle East. The situation is still unfolding.
```
with:
```html
            The United States and Israel launched major military strikes targeting Iran's nuclear facilities and military infrastructure. <cite-link><a href="https://www.pbs.org/newshour/classroom/daily-news-lessons/2026/03/what-we-know-about-the-us-israel-attacks-on-iran" target="_blank">src</a></cite-link>
            Iran's Supreme Leader Ayatollah Khamenei was killed. <cite-link><a href="https://www.pbs.org/newshour/classroom/daily-news-lessons/2026/03/what-we-know-about-the-us-israel-attacks-on-iran" target="_blank">src</a></cite-link>
            Iran launched retaliatory strikes across the Middle East, opening a war that would last for months.
```

- [ ] **Step 2: Add two new timeline cards after it**

After the closing `</div>` of that `.tl-item` and before the closing `</div><!-- end timeline -->` (`iran.html:1410-1412`), insert:

```html
      <!-- Versailles peace deal -->
      <div class="tl-item">
        <div class="tl-dot tl-gold"></div>
        <div class="tl-content">
          <div class="tl-year">June 17, 2026</div>
          <div class="tl-title">✍️ Peace Memorandum Signed at Versailles</div>
          <div class="tl-desc">
            After a ceasefire held for over two months, President Trump and Iran's President Pezeshkian signed a memorandum at the Palace of Versailles to end the war. <cite-link><a href="https://en.wikipedia.org/wiki/2026_Iran_war" target="_blank">src</a></cite-link>
          </div>
        </div>
      </div>

      <!-- Ceasefire collapse -->
      <div class="tl-item">
        <div class="tl-dot tl-red"></div>
        <div class="tl-content">
          <div class="tl-year">July 2026</div>
          <div class="tl-title">💥 Ceasefire Collapses</div>
          <div class="tl-desc">
            Iran's Revolutionary Guard struck commercial ships near Oman and shut down the Strait of Hormuz. The U.S. struck back, and the peace deal fell apart. <cite-link><a href="https://www.cnn.com/2026/07/09/world/live-news/iran-war-trump" target="_blank">src</a></cite-link>
          </div>
        </div>
      </div>
```

Confirmed: `tl-gold` and `tl-red` are real, already-used classes elsewhere in this same timeline (e.g. `iran.html:1188, 1251`), so the markup above uses the correct existing convention — no further class-name verification needed.

- [ ] **Step 3: Confirm the q7 quiz still makes sense in its new position**

Read the `.quiz-btn` for `q7` sitting right after the original card (`iran.html:1408`). Confirm it stays attached to the original February–March card (not the two new cards) since q7 asks about how the operation was *originally* described — that fact doesn't change. No edit needed if the button's position in the markup is unchanged; just confirm visually that it still reads naturally in place.

- [ ] **Step 4: Verify the timeline renders correctly**

Run: `open iran.html`, scroll to the Question 4 timeline, confirm all `.tl-item` entries render with correct dot colors and the new cards appear after the war-start card, before the closing hidden easter-egg div.

- [ ] **Step 5: Commit**

```bash
git add iran.html
git commit -m "feat: replace Iran timeline's unfolding-situation ending with real events"
```

---

## Task 5: Iran — Update All Date Stamps

**Files:**
- Modify: `iran.html:646, 667, 1762`
- Modify: `index.html:550, 566`

**Context:** Four hard-coded "March 2026" references remain in `iran.html`, plus two in `index.html`'s featured-Iran card. These are simple string swaps.

- [ ] **Step 1: Update the hero note**

At `iran.html:646`, replace:
```html
  <span class="hero-note">📚 8th Grade Social Studies · Updated March 2026 · Earn points by answering quizzes!</span>
```
with:
```html
  <span class="hero-note">📚 8th Grade Social Studies · Updated July 2026 · Earn points by answering quizzes!</span>
```

- [ ] **Step 2: Update the breaking-news banner headline**

At `iran.html:667`, replace:
```html
      <h3>March 8, 2026 — Day 9 of the U.S.-Israel war on Iran</h3>
```
with a headline matching the current status confirmed in Task 1 Step 1, e.g.:
```html
      <h3>July 2026 — Ceasefire Collapses as Fighting Resumes</h3>
```

Also check the paragraph immediately below this headline (`iran.html:668-675`) — it currently repeats day-9-specific stats (7 U.S. service members killed, 1,332 Iranians killed, gas prices) and links to `#update-week1`. Update these figures/framing to match the July status, keeping the same structure: 2-3 sentences of current summary, then the same two links (`↓ Read the 1-week situation update` — rename this anchor text since it's no longer "1-week"; and the PBS Classroom link).

- [ ] **Step 3: Update the footer**

At `iran.html:1762`, replace:
```html
  <p>Made for 8th grade Social Studies students · All links go to trusted news and educational sources · Updated March 2026</p>
```
with:
```html
  <p>Made for 8th grade Social Studies students · All links go to trusted news and educational sources · Updated July 2026</p>
```

- [ ] **Step 4: Update the index page's featured Iran card**

At `index.html:550`, replace:
```html
    <span class="flag-label">Most Recent · Updated March 2026</span>
```
with:
```html
    <span class="flag-label">Most Recent · Updated July 2026</span>
```

At `index.html:566`, replace:
```html
        <span>📅 Updated March 2026</span>
```
with:
```html
        <span>📅 Updated July 2026</span>
```

Also check `index.html`'s featured-Iran description paragraph (around line 576-578) and the ticker headlines array (around line 775-777, referencing "6,000+ killed" and the war's opening) — update only if they contain claims this refresh has changed (e.g., if a ticker line implies the war is still in its opening days). Leave ticker lines that are still accurate (like the AI/Ukraine ones) untouched.

- [ ] **Step 5: Verify no stale date strings remain**

Run: `grep -rn "March 2026\|March 8, 2026\|Day 9" iran.html index.html`
Expected: no matches (aside from historical mentions inside timeline cards describing what happened in March, e.g., "February–March 2026" as a timeline year label — those are correct as historical labels and should NOT be changed).

- [ ] **Step 6: Commit**

```bash
git add iran.html index.html
git commit -m "chore: update Iran date stamps from March to July 2026"
```

---

## Task 6: Ukraine — Rewrite the Peace Talks Narrative

**Files:**
- Modify: `ukraine.html:1193-1207` (the "Peace talks — so far" subsection inside Section 7, `#now`)

**Context:** This currently describes only the January 2026 Paris "coalition of the willing" meeting and a vague "as of March 2026" framing. It needs to reflect the fuller Feb–July picture while keeping the same structural beats: what's been tried, what's been agreed, what's still blocking a deal.

- [ ] **Step 1: Verify current facts before writing**

Search to confirm: the February Geneva trilateral meetings, what (if anything) came out of the June deadline, the POW exchange details (April–early June), the Easter/Victory Day pauses, and the exact content of Zelenskyy's June 4 open letter. Confirm whether anything has changed since (a new round of talks, a new proposal) as of the actual write date.

- [ ] **Step 2: Replace the three paragraphs**

Replace `ukraine.html:1195-1199`:
```html
    <p>Many countries have tried to end the war through <strong>peace negotiations</strong> — talks where both sides try to agree on a deal to stop the fighting. After President Trump took office in January 2025, the U.S. pushed hard for a deal. But it hasn't been easy.</p>

    <p>In January 2026, a group of <strong>35 countries</strong> — called the "coalition of the willing" — met in Paris. France and the United Kingdom said they would send troops to Ukraine to help keep the peace <em>if</em> a ceasefire is reached. The U.S. said it would back security guarantees for Ukraine and help monitor a truce.<sup class="fn"><a href="#s7-fn3" id="s7-ref3">[3]</a></sup></p>

    <p>President Zelenskyy said that about <strong>90% of a peace deal</strong> had been worked out in talks with the U.S. But the last 10% is the hardest part: <em>territory</em>. Russia wants to keep the land it has taken. Ukraine says it should not have to give up land that was seized by force. As of March 2026, Russia has refused calls for a ceasefire and has rejected direct negotiations with Zelenskyy.<sup class="fn"><a href="#s7-fn4" id="s7-ref4">[4]</a></sup></p>
```

with a version that keeps the same three-paragraph shape (general framing → what's been tried → what's still blocking it) but updates the middle paragraph to cover the Geneva trilateral talks and the broader 2026 negotiation timeline instead of only January's Paris meeting, and updates the final paragraph to reflect the June 4 Zelenskyy letter and the current (July) state of the territorial standoff. Keep the same footnote numbering convention — reuse `[3]` and `[4]` if the same footnotes still apply. Confirmed the current highest footnote in this section is `s7-fn6` (`ukraine.html:1265`), so any new source gets a new footnote starting at `s7-fn7`. Note the existing file already reuses one footnote from two locations (`s7-ref1` and `s7-ref1b` both point to `s7-fn1` — see `ukraine.html:1189` and `1217`) — that's an intentional existing pattern (shared source, two mentions), not an error to fix.

- [ ] **Step 3: Update the two `.vocab` boxes if needed**

Check `ukraine.html:1201-1207` ("Ceasefire" and "Coalition of the willing" definitions). These are durable vocabulary explainers and likely don't need changes — leave them as-is unless the rewritten paragraphs above no longer reference "coalition of the willing," in which case either keep the box (it's still valid general vocab) or remove it if it becomes disconnected from the surrounding text. Prefer keeping it.

- [ ] **Step 4: Verify footnote numbers still resolve**

Run: `grep -n 's7-fn\|s7-ref' ukraine.html`
Confirm every `id="s7-refN"` has a matching `<li id="s7-fnN">` in the footnotes list at the bottom of the section, and vice versa, with no gaps or duplicates introduced by the edit.

- [ ] **Step 5: Commit**

```bash
git add ukraine.html
git commit -m "feat: update Ukraine peace-talks narrative through July 2026"
```

---

## Task 7: Ukraine — Refresh Stats and Add Footnotes for New Sources

**Files:**
- Modify: `ukraine.html:1189, 1215-1246, 1258-1267` (front-line paragraph, human-cost paragraph, stat-grid, footnotes list)

**Context:** The territory percentage (~20%), refugee count (5.9M), displaced count (3.7M), and reconstruction cost ($588B) are all sourced to CSIS/UNHCR "2026" without a specific month. Check whether more current figures exist; if the war's territorial situation hasn't materially changed, these numbers likely don't need to change — but a check should happen, not an assumption.

- [ ] **Step 1: Verify current figures**

Search for the most recent UNHCR Ukraine refugee/displacement figures and the most recent territory-percentage estimate (e.g., from ISW or CSIS) as of the write date. Compare against the existing 20% / 5.9M / 3.7M / $588B figures.

- [ ] **Step 2: Update only the figures that have meaningfully changed**

If a figure has changed by more than a rounding difference, update it in both places it appears: the inline `<strong>` mention in the prose (`ukraine.html:1189` for territory, `1215-1217` for refugees/displaced/reconstruction) and the corresponding `.stat-box` in the stat-grid (`ukraine.html:1225-1246`). Keep the exact stat-box markup:

```html
<div class="stat-box s-red">
  <span class="stat-num">[VALUE]</span>
  <span class="stat-label">[LABEL — unchanged]</span>
  <span class="stat-source"><a href="[URL]" target="_blank" style="color:inherit">[SOURCE, YEAR]</a></span>
</div>
```

If no figure has meaningfully changed, leave all four stat-boxes and prose numbers exactly as they are — do not force a change with no real update behind it, per the design doc.

- [ ] **Step 3: Update the "front lines in 2026" paragraph's framing if needed**

`ukraine.html:1189-1191` currently says the war is now "four years" in and describes February 2026 as when Ukraine "actually captured more territory than Russia did — the first time that had happened in months." If more recent front-line developments (through July) are more relevant to highlight than the February data point, replace the February-specific sentence with a more current one, keeping the same footnote-citation pattern (`<sup class="fn">`). If nothing more notable has happened, this can stay as historical context within the "how did the front lines get to today" framing — but add one sentence bridging to the present ("as of July 2026, the front lines remain largely where they were in early 2026").

- [ ] **Step 4: Add any new footnotes needed**

If Step 2 or 3 introduced a new source URL, append a new `<li id="s7-fnN">` entry to the footnotes list at `ukraine.html:1258-1267`, following the existing numbering and format:
```html
<li id="s7-fnN"><a href="#s7-refN">^</a> "[Source title]," [Publisher], [Date]. <a href="[URL]" target="_blank">Link</a></li>
```

- [ ] **Step 5: Verify all footnote references still resolve**

Run: `grep -n 's7-fn\|s7-ref' ukraine.html`
Confirm every reference (`s7-refN`) has a matching footnote (`s7-fnN`) with no gaps or orphans.

- [ ] **Step 6: Verify all links resolve**

Run: `open ukraine.html`, scroll to Section 7, click every link in the prose, stat-grid, and footnotes. Confirm each resolves to a real, live page.

- [ ] **Step 7: Commit**

```bash
git add ukraine.html
git commit -m "chore: verify and refresh Ukraine war stats for July 2026"
```

---

## Task 8: Ukraine — Add Specificity to the Timeline's Negotiations Card

**Files:**
- Modify: `ukraine.html:1426-1433` (the "2025–2026 Peace Negotiations Ongoing" `.tl-item`)

**Context:** This card is still directionally accurate but generic. Per the design doc, this is a light touch — add one clause of specificity, not a rewrite.

- [ ] **Step 1: Update the card's description**

Replace `ukraine.html:1431`:
```html
          <p class="tl-desc">Multiple peace frameworks proposed by the US, EU, and UK-France. Territorial disputes — especially over Donbas and Crimea — remain the biggest obstacle to a deal.<sup class="fn"><a href="#tl-fn17" id="tl-ref17">[17]</a></sup></p>
```
with a version that names one concrete beat (e.g., the Geneva trilateral talks and/or Zelenskyy's June 4 open letter) while keeping the sentence count and length roughly the same as neighboring cards. Example shape (verify facts before finalizing):
```html
          <p class="tl-desc">Trilateral talks in Geneva and a Zelenskyy peace letter in June 2026 kept diplomacy alive, but territorial disputes — especially over Donbas and Crimea — remain the biggest obstacle to a deal.<sup class="fn"><a href="#tl-fn17" id="tl-ref17">[17]</a></sup></p>
```

- [ ] **Step 2: Update footnote 17 if the source list changed**

Check `ukraine.html:1457` (`<li id="tl-fn17">`). If the new sentence cites a source not already listed there, update the footnote to include it, following the existing multi-source format (see `tl-fn17`'s current two-source example).

- [ ] **Step 3: Commit**

```bash
git add ukraine.html
git commit -m "feat: add specificity to Ukraine timeline's negotiations card"
```

---

## Task 9: Ukraine — Update Date Stamps

**Files:**
- Modify: `ukraine.html:671, 1709`

**Context:** Two hard-coded "March 2026" references remain.

- [ ] **Step 1: Update the hero note**

At `ukraine.html:671`, replace:
```html
  <span class="hero-note">&#128218; 8th Grade Social Studies &middot; March 2026 &middot; Earn points by answering quizzes!</span>
```
with:
```html
  <span class="hero-note">&#128218; 8th Grade Social Studies &middot; July 2026 &middot; Earn points by answering quizzes!</span>
```

- [ ] **Step 2: Update the footer**

At `ukraine.html:1709`, replace:
```html
  <p>Made for 8th grade Social Studies students · All links go to trusted news and educational sources · Updated March 2026</p>
```
with:
```html
  <p>Made for 8th grade Social Studies students · All links go to trusted news and educational sources · Updated July 2026</p>
```

- [ ] **Step 3: Verify no stale date strings remain**

Run: `grep -n "March 2026" ukraine.html`
Expected: no matches (aside from historical timeline year labels like "2025–2026" describing past events, which are correct and should not change).

- [ ] **Step 4: Commit**

```bash
git add ukraine.html
git commit -m "chore: update Ukraine date stamps from March to July 2026"
```

---

## Task 10: Fix the Mislabeled Mahsa Amini Protest Photo (Iran)

**Files:**
- Modify: `iran.html:960-961, 1368-1371`
- Possibly replace: `images/mahsa-amini-protests.jpg`

**Context — already confirmed during planning, not a hypothesis to re-check:** `images/mahsa-amini-protests.jpg` is used twice — once with `alt="Protesters in Tehran streets"` (`iran.html:961`) and once with a caption reading "Protests on Enghelab Street, Tehran, 2022" that links to `https://commons.wikimedia.org/wiki/File:Mahsa_Amini_protests_in_Tehran,_Enghelab_Street_2.jpg` (`iran.html:1371`). Two problems were confirmed:

1. That exact Commons URL returns **HTTP 404** — the file doesn't exist there.
2. The actual downloaded image shows a European plaza (ornate multi-story stone buildings, arched windows) with crowds waving Iranian flags — this is **not a Tehran street scene**. A web search matched it to `File:Amsterdam Solidarity with Iran's People - Mahsa Amini demonstrations - Oct 2022.jpg` on Wikimedia Commons (a real, differently-titled file depicting Dam Square, Amsterdam, October 2022) — the architecture and crowd match that description closely.

This means the page currently tells students a real photo of an Amsterdam solidarity protest is a photo of a protest happening inside Iran, cited to a Commons file that no longer resolves. This needs a real fix, not a caption tweak that papers over it.

- [ ] **Step 1: Confirm the correct Commons file and its actual license/title**

Fetch `https://commons.wikimedia.org/wiki/File:Amsterdam_Solidarity_with_Iran's_People_-_Mahsa_Amini_demonstrations_-_Oct_2022.jpg` (URL-encode the apostrophe/spaces as needed) and confirm: this is the same photo currently saved as `images/mahsa-amini-protests.jpg` (compare visually), confirm its actual CC license, and get its real permanent Commons URL.

- [ ] **Step 2: Rewrite both usages with accurate labeling**

At `iran.html:960-961`, replace:
```html
      <img class="img-float" src="images/mahsa-amini-protests.jpg"
           alt="Protesters in Tehran streets" height="180"
```
with:
```html
      <img class="img-float" src="images/mahsa-amini-protests.jpg"
           alt="Iranian diaspora protesters in Amsterdam holding Iranian flags in solidarity" height="180"
```

At `iran.html:1368-1371`, replace:
```html
          <img class="tl-img" src="images/mahsa-amini-protests.jpg"
               alt="Protests in Tehran after Mahsa Amini's death" onerror="this.style.display='none'" style="max-height:180px">
          <div class="img-caption" style="border-radius:6px;margin-bottom:8px;font-size:.7rem">
            Protests on Enghelab Street, Tehran, 2022. <a href="https://commons.wikimedia.org/wiki/File:Mahsa_Amini_protests_in_Tehran,_Enghelab_Street_2.jpg" target="_blank">Wikimedia Commons (CC-BY-SA)</a>
```
with:
```html
          <img class="tl-img" src="images/mahsa-amini-protests.jpg"
               alt="Iranian diaspora protesters in Amsterdam holding Iranian flags in solidarity with Mahsa Amini protests" onerror="this.style.display='none'" style="max-height:180px">
          <div class="img-caption" style="border-radius:6px;margin-bottom:8px;font-size:.7rem">
            Solidarity protest in Amsterdam, October 2022 — protests over Mahsa Amini's death spread far beyond Iran. <a href="[VERIFIED COMMONS URL FROM STEP 1]" target="_blank">Wikimedia Commons (verify license from Step 1)</a>
```

Also update the surrounding prose sentence at `iran.html:963` ("It started when shopkeepers...") only if it currently implies this specific image is from inside Iran — check the sentence in context and adjust only if needed, since the surrounding text may already be generically about the protest movement rather than about this specific photo.

- [ ] **Step 3: Consider whether a real Tehran-street photo should replace this entirely**

If a genuine, correctly-licensed (CC/public domain) photo of the actual 2022 Tehran protests can be found on Wikimedia Commons (search `Category:Mahsa Amini protests` on Commons), downloading and swapping it in is preferable to keeping a diaspora photo where the section is specifically about protests *inside* Iran. If no suitable replacement is found quickly, the relabeled diaspora photo (Step 2) is an acceptable fix — just make sure the caption is honest about what it shows.

- [ ] **Step 4: Verify the fix**

Confirm the new/verified Commons link resolves (not 404), confirm the image (whichever is used) matches its caption, and confirm no other place in `iran.html` references the old broken URL: `grep -n "Mahsa_Amini_protests_in_Tehran,_Enghelab_Street_2" iran.html` should return no matches after the fix.

- [ ] **Step 5: Commit**

```bash
git add iran.html
git commit -m "fix: correct mislabeled Mahsa Amini protest photo and dead Commons citation"
```

---

## Task 11: Audit Portrait Cropping Across Both Pages

**Files:**
- Modify (only where a crop problem is confirmed): `iran.html` Key People section (`~1506-1596`), `ukraine.html` Key People section (`~1467-1520`)

**Context:** Both pages render portraits in a fixed 90×90px circle via `.portrait-inner img{width:100%;height:100%;object-fit:cover;object-position:center 20%}` (shared CSS class, same rule in both files — e.g. `iran.html:344`, `ukraine.html:336`). Two images already have manual per-image overrides fixing bad default crops: `mahsa-amini.jpg` (`style="object-position:center 15%"`, `iran.html:1553`) and `rumi.jpg` (`style="object-position:center 10%"`, `iran.html:1579`). Every other portrait uses the shared `center 20%` default with no override — this task checks whether any of those also need one.

Source image dimensions gathered during planning (width×height in px):

| Image | Dimensions | Notes from visual inspection during planning |
|---|---|---|
| `mosaddegh.jpg` | 209×292 | Head fills nearly the whole frame, positioned high — `center 20%` likely fine |
| `khomeini.jpg` | 800×792 | Near-square, head/turban in upper half, wide shoulders below — `center 20%` likely fine |
| `khamenei.jpg` | 500×656 | Head in upper third, standard portrait crop — `center 20%` likely fine |
| `soleimani.jpg` | 500×667 | Head in upper third, standard portrait crop — `center 20%` likely fine |
| `volodymyr-zelenskyy.jpg` | 500×677 | Waist-up shot, face in upper third — `center 20%` likely fine |
| `vladimir-putin.jpg` | 500×633 | Face fills most of frame near top — `center 20%` likely fine |
| `taras-shevchenko.jpg` | 500×864 | **Flag for review** — the source image includes a decorative bordered card mount around the actual photo; the face sits well below the top edge of the full frame (unlike the others where the head starts near pixel 0). A fixed 20%-from-top anchor may land in the blank border/mount area above his head rather than centering on his face. |
| `mykhailo-hrushevsky.jpg` | 500×784 | Head positioned roughly center-to-upper — likely fine, but check |

- [ ] **Step 1: Check `taras-shevchenko.jpg` specifically**

This is the one image flagged as a likely real problem. Calculate: with `object-position: center 20%` on a 500×864px source rendered into a 90×90px circle, the vertical crop window is roughly 90px tall sampled starting near `20% × 864 = ~173px` from the top, extending down. Compare that against where the actual face sits in the image (view the file directly to judge — the decorative card border and blank space likely occupy roughly the top 15-20% of the frame before the photo content starts). If the math suggests the crop window lands on the border/blank area or cuts off the top of his fur hat, add a per-image override.

- [ ] **Step 2: Add an override if needed**

If Step 1 confirms a problem, find the `<img src="images/taras-shevchenko.jpg"...>` tag (`ukraine.html:1501`) and add an inline `style="object-position:center [X]%"` attribute, following the exact pattern already used for `mahsa-amini.jpg`/`rumi.jpg` in `iran.html`. Pick the percentage by checking where the face actually falls (as a % of total image height) and iterating — open the file in a browser after each change to confirm the crop looks right, since this can't be reliably calculated in the abstract.

- [ ] **Step 3: Spot-check the remaining "likely fine" images**

For `mosaddegh.jpg`, `khomeini.jpg`, `khamenei.jpg`, `soleimani.jpg`, `volodymyr-zelenskyy.jpg`, `vladimir-putin.jpg`, and `mykhailo-hrushevsky.jpg`: open each page in a browser and visually compare the rendered 90×90 circle against the full source image. Confirm each crop shows a clearly recognizable, centered face with no obvious appendage-cutoff (e.g., cropping off the top of a hat, or off-centering badly to one side). Add a per-image `object-position` override for any that fail this check, following the same pattern as Step 2.

- [ ] **Step 4: Re-check `mahsa-amini.jpg`'s existing override for horizontal cropping**

The existing fix (`style="object-position:center 15%"`, `iran.html:1553`) only overrides the vertical anchor — the horizontal anchor stays `center`. But note: **this image is being replaced or relabeled entirely in Task 10**, since it's the same mislabeled Amsterdam-crowd photo. If Task 10 swaps in a different, correctly-sourced portrait image for Mahsa Amini's Key People card, that new image needs its own crop check from scratch (repeat Steps 1–3's process on it) rather than reusing the old `center 15%` value, which was tuned for the old (wrong) image.

- [ ] **Step 5: Commit**

```bash
git add iran.html ukraine.html
git commit -m "fix: correct portrait cropping for Key People images"
```

If no crop problems were confirmed beyond the already-known ones, note that in the commit message instead (`chore: audit Key People portrait cropping — no changes needed`) and skip the `git add` if nothing changed.

---

## Task 12: Audit Links, Sources, and Image Attribution Across Both Pages

**Files:**
- Modify (only where a problem is confirmed): `iran.html`, `ukraine.html`

**Context:** `iran.html` has 146 `target="_blank"` links and `ukraine.html` has 84 (230 total). Manually clicking all of them is impractical to spec as individual steps; this task uses a scripted check for dead links plus a targeted content check for two confirmed gaps found during planning.

**Confirmed gap #1 — hero-section images missing attribution:** Several large `.img-hero-section` images have no `img-caption`/Commons-source link at all, unlike the timeline images which do: `images/iran-protests-2019.jpg` (`iran.html:940`, has a caption but check whether it links to a source — verify at write time), `images/persepolis.jpg` (`iran.html:1032` as `.img-float`, and again at `iran.html:1192` as `.tl-img` — check if either usage has a source link), `images/haft-sin.jpg` (`iran.html:1101`), `images/abadan-refinery.jpg` (`iran.html:1429`), `images/qom-seminary.jpg` (`iran.html:1118`). The project's own contribution guidelines (`current-events-README.md`) state images should be from Wikimedia Commons or original, implying attribution is expected.

- [ ] **Step 1: Check each hero/float image listed above for missing attribution**

For each image path listed in "Confirmed gap #1," find every place it's used in `iran.html` and check whether an `img-caption` with a source link exists nearby. If a caption exists but has no link, or no caption exists at all, add one following the exact pattern used elsewhere on the page:
```html
  <div class="img-caption">[Short factual description of what the image shows]
    <a href="[Wikimedia Commons or original source URL]" target="_blank">[Source: Wikimedia Commons, CC-BY-SA]</a>
  </div>
```
Search Wikimedia Commons for the likely source of each image (search by filename-derived terms, e.g. "Persepolis ruins Iran," "Haft-sin Nowruz table," "Abadan oil refinery," "Qom seminary Iran") to find the actual attributable source — do not fabricate a source link; if no confident match is found, flag it for the user rather than inventing a citation.

- [ ] **Step 2: Run an automated dead-link check on both pages**

Extract all `https://` URLs from both files and check each for a live response:
```bash
grep -oE 'href="https://[^"]+"' iran.html ukraine.html | sed -E 's/^[^:]+:href="//;s/"$//' | sort -u > /tmp/all-links.txt
while read -r url; do
  code=$(curl -s -o /dev/null -w "%{http_code}" -A "Mozilla/5.0" -L --max-time 10 "$url")
  echo "$code $url"
done < /tmp/all-links.txt | sort -n
```
Review the output for any 404, 410, or connection-failure results. Note: some sites block scripted requests and will return a 403 even when the page is fine for a real browser — for any non-200 result, open the URL in a browser to confirm whether it's actually broken before treating it as a fix-needed item.

- [ ] **Step 3: Fix confirmed dead links**

For each URL confirmed dead in Step 2 (checked in an actual browser, not just by status code), find a working replacement covering the same fact — prefer the original publisher, fall back to an archive.org snapshot (`https://web.archive.org/web/2/[URL]`) only if no live replacement exists, matching the site's stated preference for sources students can actually read. Update the `href` in place; do not remove the citation entirely, since every factual claim on this site is expected to carry a source per the project's contribution guidelines.

- [ ] **Step 4: Spot-check that no source URL is paywalled**

For any source domain not already familiar from this plan (Al Jazeera, CNN, AP, Reuters, PBS, NPR, CSIS, CFR, Britannica, Wikipedia, UNHCR, Wikimedia Commons), open it and confirm the specific article/page is readable without a subscription — the project's contribution guidelines prefer free-to-access sources. Flag (don't necessarily replace) any paywalled source found among *pre-existing* links, since replacing historical citations is out of scope for this task unless the link is also dead.

- [ ] **Step 5: Commit**

```bash
git add iran.html ukraine.html
git commit -m "fix: repair dead links and add missing image attribution"
```

If no dead links or missing attributions were confirmed, use `chore: audit links and image attribution — no changes needed` instead and skip `git add` if nothing changed.

---

## Task 13: Full-Site Verification Pass

**Files:** None modified — verification only.

- [ ] **Step 1: Confirm no stale date/status strings remain anywhere touched**

Run: `grep -rn "March 2026\|March 8, 2026\|Day 9\|still unfolding" iran.html ukraine.html index.html`
Expected: no matches, except historical labels describing past events by their correct historical month (e.g. a timeline entry correctly labeled "February–March 2026" for something that happened then — those are fine; anything phrased as if March/day-9 is the *current* moment is not).

- [ ] **Step 2: Confirm the Task 10 fix is complete**

Run: `grep -n "Mahsa_Amini_protests_in_Tehran,_Enghelab_Street_2\|Enghelab Street" iran.html`
Expected: no matches (the broken citation and its "Enghelab Street, Tehran" claim should be fully gone, replaced by Task 10's accurate labeling).

- [ ] **Step 3: Re-run the dead-link check from Task 12 Step 2 once more**

Confirm every link changed across Tasks 1–13 now resolves (re-run the same `curl` loop scoped to just the new/changed URLs from this plan, or the full loop again if time allows).

- [ ] **Step 4: Read both updated sections start to finish as a student would**

Read Iran's update pane + Section 1 + timeline ending + Key People section, and Ukraine's Section 7 + timeline negotiations card + Key People section, straight through. Confirm the reading level stays consistent with the rest of the page (5th–6th grade prose, per the project's contribution guidelines) and that nothing reads as a jarring tense/date mismatch or an uncited claim.

- [ ] **Step 5: Confirm quizzes still function**

In the browser, click the quiz buttons for `q1`, `q7`, `q8` on the Iran page and confirm the questions/answers still display correctly and match content still present on the page (no quiz referencing a fact or section that was removed).

- [ ] **Step 6: Visually confirm portrait crops in a real browser**

Open both pages and look at every Key People portrait circle. Confirm each shows a recognizable, reasonably-centered face — this is the final check on Task 11's work, done with fresh eyes after all other changes are in place.

- [ ] **Step 7: Final commit if any fixes were needed**

If Steps 1–6 surfaced any small fixes, make them and commit:
```bash
git add iran.html ukraine.html index.html
git commit -m "fix: address verification-pass findings in Iran/Ukraine refresh"
```

If no fixes were needed, no commit is required for this task.

---

## Self-Review Notes

- **Spec coverage:** All design doc sections (1a–1e Iran, 2a–2d Ukraine, date stamps, out-of-scope confirmations) map to Tasks 1–9. The user's follow-up request (audit images for cropping, audit links/resources, cite all changes) maps to Tasks 10–12, which were scoped using concrete findings gathered during planning rather than left as open-ended "audit" instructions — specifically the confirmed Mahsa Amini image mislabel/dead citation (Task 10), the one confirmed cropping risk case on `taras-shevchenko.jpg` plus a systematic check process for the rest (Task 11), and the confirmed missing-attribution gap on hero images plus a scripted dead-link check (Task 12). Task 13 covers the design doc's "Success criteria" section plus verification of the new Task 10–12 work as a combined final pass.
- **Placeholder scan:** Steps requiring live-fact verification at write time are explicitly flagged as such ("verify before finalizing") rather than presented as settled facts to copy-paste — this is a deliberate acknowledgment that a July-dated war/diplomacy story must be re-checked at implementation time, not a TBD. Task 12 Step 1 explicitly instructs against fabricating a source link if none is found, rather than leaving a vague "add appropriate citation" instruction.
- **Type consistency:** N/A (no code interfaces in this plan — HTML content only). Class names (`mini-tl-dot`, `d-red`/`d-gold`/`d-blue`/`d-green`, `stat-box`, `tl-item`, `tl-dot`, `portrait-inner`, `img-caption`) are used consistently with what was directly confirmed in the files during planning (Task 4's `tl-gold`/`tl-red` classes and Task 11's `object-position` override pattern were both checked against the actual file content, not assumed).

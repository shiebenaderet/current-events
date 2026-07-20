# AI & Society Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `ai.html`'s "where is AI today" content current from its January 2025 (DeepSeek) ending to July 2026, add one new Focus box explaining agentic AI, and audit the page's links/images — all without changing the page's visual design, CSS, or component structure beyond the one approved new Focus box.

**Architecture:** Content-only edits inside existing HTML containers (`s-body`, `stat-grid`, `focus-pane`, `tl-item`, `vocab`, `footnotes`), plus one new `.focus-pane` block reusing the exact markup pattern of two existing Focus boxes on this page. No new CSS classes, no nav changes, no quiz-mechanic changes, no changes to the points/easter-egg system. Six tasks: Task 1 bridges Section 4 forward and refreshes its stat-grid; Task 2 adds the new agentic-AI Focus box; Task 3 replaces the timeline's placeholder 2026 card with real entries; Task 4 adds the safety/regulation bridge sentence; Task 5 updates date stamps on `ai.html` and `index.html`; Task 6 audits links and images; Task 7 is the final verification pass.

**Tech Stack:** Plain HTML, no build step. Verification is manual: grep for stale strings, open the file in a browser, check links resolve. There is no test runner in this repo — "tests" in this plan mean grep checks and visual spot-checks, not unit tests.

## Global Constraints

- Write all new prose at a 5th–6th grade reading level (project convention — see `current-events-README.md` contribution guidelines).
- Every new factual claim gets an inline `<sup class="fn"><a href="#PREFIX-fnN" id="PREFIX-refN">[N]</a></sup>` footnote (this page's citation pattern) pointing to a real, currently-live, non-paywalled source. Do not use Iran/Ukraine's `cite-link` pattern — it does not exist on this page.
- **Never use relative-time phrasing** ("now," "currently," "as of now," "the situation remains") to describe AI's present capabilities or the safety/regulation conversation's status — always an explicit date (e.g., "As of July 2026"). This applies from Task 1 onward, not as a retrofit.
- Do not modify CSS, nav structure, quiz definitions (`q1`–`q5` and any others), the points/easter-egg system, or any section not named in this plan.
- Preserve exact existing class names and HTML structure in every replaced block — only the text/attributes inside change, except for the one new Focus box explicitly approved in Task 2.
- Re-verify every date/figure against a live source at write time — the design doc's scoping research is a starting point, not a copy-paste source. Do not hardcode any specific model name, statistic, or date from that research without independently confirming it first.
- Do not include content from two categories explicitly excluded during design: chatbot-safety lawsuits involving minors, and AI-agent security-incident/controversy stories (e.g., any specific agent product flagged as carrying unresolved safety baggage). Stick to the general "AI that acts, not just chats" concept using a mainstream, uncontroversial example.
- Every image should have a source/attribution link nearby if it doesn't already, matching the project's contribution guideline that images come from Wikimedia Commons (CC-licensed/public domain), an official/press source, or original photography.

---

## Reference Files

- **Design doc:** `docs/plans/2026-07-20-ai-refresh-design.md`
- **AI page:** `ai.html`
- **Index page (date stamp only):** `index.html`

## Known Source Starting Points (re-verify at write time — none of these are pre-approved facts)

| Fact | Source (starting point only) |
|---|---|
| New frontier model generations, 2025–2026 (OpenAI/Anthropic/Google) | General AI-industry news coverage — re-verify specific names/dates before citing |
| Agentic AI becoming mainstream, named product features (browsing, form-filling, code execution) | General AI-industry news coverage — re-verify specific product/date, avoid any flagged as carrying safety controversy |
| EU AI Act compliance milestone landing near mid-2026 | European Commission / EU AI Act official coverage — re-verify exact date and scope before citing as a timeline fact |

---

## Task 1: Bridge Section 4 Forward and Refresh Its Stat-Grid

**Files:**
- Modify: `ai.html:962-982` (Section 4 body, after the DeepSeek paragraph, plus its `stat-grid`)

**Context:** Section 4 ("Where is AI today — and what can it do?") currently ends its historical narrative at the DeepSeek/Nvidia paragraph (`ai.html:962`, dated January 2025), then moves directly into generative-AI and hallucination material (`ai.html:984` onward) that stays accurate and must not be touched by this task. The `stat-grid` at `ai.html:966-982` has three 2023-vintage stats (100M ChatGPT users, 1.76T GPT-4 parameters, $100M+ training cost).

- [ ] **Step 1: Research and verify current facts before writing**

Search for: (a) what major new model generations OpenAI, Anthropic, and Google each released between January 2025 and July 2026, at a level of detail sufficient to write one generation-level sentence (not necessarily naming every release) — confirm this is genuinely a "steady, multi-lab progress" story and not something that's changed shape since the design doc was scoped; (b) a concrete, mainstream, non-controversial example of "agentic AI" (an AI system browsing, filling forms, writing/running code, or completing a multi-step task without a human doing each step) suitable for a bridging sentence here and fuller treatment in Task 2's Focus box; (c) 2–3 current statistics suitable to replace the stat-grid's three 2023 figures (candidates: current monthly active users across major chatbot products, a current capability/parameter benchmark figure, a current estimated frontier-training cost) — each from a real, citable, live source.

- [ ] **Step 2: Add the bridging paragraph(s) after the existing DeepSeek paragraph**

At `ai.html:962`, after the existing paragraph ending "...making it the fastest-growing consumer application in history.<sup class="fn"><a href="#s4-fn1" id="s4-ref1">[1]</a></sup></p>", insert one or two new `<p>` tags (let the actual prose decide the count — one if the two beats below combine naturally, two if they read better split) covering:

1. Continued acceleration since DeepSeek, framed at the generation level ("Since then, OpenAI, Anthropic, Google, and other companies have each released several new, more capable model generations" — adjust exact wording once Step 1's research is confirmed; do not name specific model version numbers unless a generation-level sentence genuinely can't convey the point without one).
2. A pivot into agentic AI as the more significant conceptual shift: AI systems that can now act on multi-step tasks (browsing, filling forms, writing/running code) rather than only answering chat questions — written to set up Task 2's Focus box without duplicating its full content (a sentence or two of framing here, not the same material repeated).

Cite each new claim with a footnote continuing this section's existing numbering — the current highest is `s4-fn3` (`ai.html:1045`), so new footnotes start at `s4-fn4`, following the exact existing format:
```html
<li id="s4-fnN"><a href="#s4-refN">^</a> "[Source title]," [Publisher], [Date]. <a href="[URL]" target="_blank">Link</a></li>
```

Use the date-specificity rule from the Global Constraints — anchor these new paragraphs to an explicit date range ("Since January 2025..." / "By mid-2026...") rather than "now" or "today."

- [ ] **Step 3: Replace the stat-grid's three figures**

Replace the three `.stat-box` entries at `ai.html:967-981` using Step 1's verified current statistics, keeping the exact existing markup pattern:
```html
<div class="stat-box s-COLOR" onclick="handleStatClick(this,'aitoday')">
  <span class="stat-num">[VALUE]</span>
  <span class="stat-label">[LABEL]</span>
  <span class="stat-source"><a href="[URL]" target="_blank" style="color:inherit">[SOURCE, DATE]</a></span>
</div>
```
Keep the same three color classes (`s-blue`, `s-purple`, `s-gold`) and the `onclick="handleStatClick(this,'aitoday')"` attribute unchanged — only the `stat-num`/`stat-label`/`stat-source` content and the citation URL change. If Step 1 can't confidently source a third statistic to the same standard as the other two, use 2 stat-boxes instead of 3 rather than forcing a weak third citation — do not delete the `stat-grid` container itself, just include fewer children.

- [ ] **Step 4: Verify no leftover "DeepSeek is the most recent thing" framing remains**

Read Section 4 start to finish in the file. Confirm the new bridging paragraph(s) read naturally after the DeepSeek paragraph and before the existing "Generative AI — machines that create" `<h3>` (`ai.html:984`) — there should be no sentence implying DeepSeek (Jan 2025) is the most recent development once the new paragraphs are added.

- [ ] **Step 5: Commit**

```bash
git add ai.html
git commit -m "feat: bridge AI page's Section 4 from Jan 2025 to July 2026"
```

---

## Task 2: Add New Focus Box — "AI That Takes Action"

**Files:**
- Modify: `ai.html` (insert after the existing Hinton Focus box, before the Timeline section — currently between `ai.html:1200` and `ai.html:1202`)

**Context:** This page has two existing Focus boxes using the darker, inline-styled gradient pattern (`#animals` at `ai.html:1097-1138`, `#hinton` at `ai.html:1141-1200`) — both use `class="focus-pane"` with inline `style="background:linear-gradient(135deg,#0f172a 0%,#1a1040 100%);color:#e2e8f0;border-radius:18px;padding:32px 28px;margin:32px auto;max-width:900px;box-shadow:0 8px 40px rgba(0,0,0,.35)"`, an icon + `h2`/subtitle header, a `podcast-embed` (optional — this new box doesn't need one, since it's not tied to a specific podcast episode), `h3` "Key takeaways"-style subheadings, prose paragraphs with `<strong>` lead-ins, a `.callout.c-gold` "Think about it" box, and a `.footnotes` list. A third, visually simpler Focus box (`#school` at `ai.html:1052-1094`) uses plain `class="focus-pane"` with no inline gradient styling. This task follows the **darker gradient pattern** (`#animals`/`#hinton`), matching the design doc's framing of this as a standalone conceptual explainer rather than a podcast-episode companion piece.

- [ ] **Step 1: Verify a concrete, uncontroversial agentic-AI example before writing**

Confirm (from Task 1 Step 1's research, or fresh research if needed): one mainstream, broadly-recognizable example of an AI agent completing a multi-step task (browsing, form-filling, or writing/running code) without a human doing each step — explicitly avoiding any specific product flagged as carrying a security-incident or safety-controversy angle per the Global Constraints. The concept ("AI that acts, not just chats") is what this box teaches; the example just needs to be concrete enough for an 8th grader to picture, not a specific brand endorsement.

- [ ] **Step 2: Insert the new Focus box**

After the closing `</div>` of the Hinton Focus box (`ai.html:1200`) and before the `<!-- ── Timeline ── -->` comment (`ai.html:1202`), insert:

```html
<!-- ── Focus: AI That Takes Action ── -->
<div id="agentic" class="focus-pane" style="background:linear-gradient(135deg,#0f172a 0%,#1a1040 100%);color:#e2e8f0;border-radius:18px;padding:32px 28px;margin:32px auto;max-width:900px;box-shadow:0 8px 40px rgba(0,0,0,.35)">
  <div class="focus-header" style="display:flex;align-items:center;gap:12px;margin-bottom:18px">
    <span style="font-size:2rem">🤖</span>
    <div>
      <h2 style="font-family:'Playfair Display',serif;font-size:1.4rem;margin:0;color:#fff">Focus: AI That Takes Action</h2>
      <p style="font-size:.85rem;color:rgba(255,255,255,.5);margin:0">From chatting to doing — the rise of "agentic" AI</p>
    </div>
  </div>

  <p style="margin-bottom:14px">[REPLACE: 1-2 sentences introducing the shift from "AI you talk to" to "AI that acts for you" — use Step 1's verified example. Cite with a footnote.]<sup class="fn"><a href="#aa-fn1" id="aa-ref1">[1]</a></sup></p>

  <div class="vocab" style="background:rgba(255,255,255,.06);border-radius:10px;padding:14px 16px;margin:14px 0">
    <strong>📖 Key Word: Agentic AI</strong> — [REPLACE: 5th-6th grade definition, e.g. "AI that can take multiple steps on its own to complete a task — like browsing a website, filling out a form, or writing and running code — instead of just answering one question at a time."]
  </div>

  <p style="margin-bottom:14px">[REPLACE: 1-2 more sentences explaining the concrete example from Step 1 in plain terms a middle schooler can picture.]<sup class="fn"><a href="#aa-fn2" id="aa-ref2">[2]</a></sup></p>

  <div class="callout c-gold" style="background:rgba(255,255,255,.06);border-color:rgba(245,158,11,.3)">
    <span class="callout-icon">🤔</span>
    <div class="callout-body">
      <h4 style="color:#f59e0b">Think about it</h4>
      <p style="color:rgba(255,255,255,.7)">[REPLACE: a discussion prompt about AI acting on its own — e.g. "If an AI can complete tasks for you without you watching each step, how do you know it did what you actually wanted? What could go wrong?"]</p>
    </div>
  </div>

  <div class="footnotes" style="border-top-color:rgba(255,255,255,.1)">
    <ol>
      <li id="aa-fn1" style="color:rgba(255,255,255,.45)"><a href="#aa-ref1" style="color:#82b1ff">^</a> [REPLACE: real source for the intro claim]</li>
      <li id="aa-fn2" style="color:rgba(255,255,255,.45)"><a href="#aa-ref2" style="color:#82b1ff">^</a> [REPLACE: real source for the example claim]</li>
    </ol>
  </div>
</div>
```

Replace every `[REPLACE: ...]` bracketed instruction with real, verified content and citations before committing — none of these bracketed placeholders may remain in the final file. Add or remove `<p>`/footnote entries if the actual content needs a different shape than this skeleton, as long as the overall structure (header, intro, vocab box, example, callout, footnotes) stays consistent with its two sibling Focus boxes.

- [ ] **Step 3: Verify the box renders correctly and matches its siblings**

Run: `open ai.html` (or equivalent), scroll to the new box between the Hinton Focus box and the Timeline section. Confirm: the dark gradient background, icon, header, vocab box, callout, and footnotes all render with the same visual weight and spacing as the `#animals` and `#hinton` boxes immediately above it. Click both footnote links, confirm they resolve to real, live pages.

- [ ] **Step 4: Verify no CSS drift**

Run: `git diff ai.html` and confirm the diff contains only the new `<div id="agentic"...>` block (plus Task 1's changes if not yet committed separately) — no changes to any `<style>` block, no new CSS class definitions anywhere in the file. This box uses only classes (`focus-pane`, `focus-header`, `vocab`, `callout`, `c-gold`, `callout-icon`, `callout-body`, `footnotes`) already defined in the page's existing `<style>` block — confirm each with `grep -n "\.focus-pane\|\.vocab\b\|\.callout\b" ai.html` before committing, rather than assuming.

- [ ] **Step 5: Commit**

```bash
git add ai.html
git commit -m "feat: add agentic AI Focus box to AI page"
```

---

## Task 3: Replace the Timeline's Placeholder 2026 Card

**Files:**
- Modify: `ai.html:1344-1350` (the placeholder `2026 — The Conversation Continues` `.tl-item`)

**Context:** The timeline's final card currently has no real content — a vague closing sentiment with zero dated facts:
```html
<div class="tl-item">
  <div class="tl-dot" style="background:#f59e0b"></div>
  <div class="tl-content">
    <h4>2026 — The Conversation Continues</h4>
    <p>AI is in your school, your phone, your doctor's office. The question is no longer "will AI change the world?" — it's "how do we make sure it changes it for the better?"</p>
  </div>
</div>
```
This sits immediately after the "2025 — Reasoning Models & Regulation" card (`ai.html:1336-1342`) and immediately before the `</div>` closing the timeline and the `q5` quiz button (`ai.html:1353`).

- [ ] **Step 1: Verify current facts before writing**

Confirm (from Task 1 Step 1's research, or fresh research if needed): (a) a specific point when agentic AI tools became a named, mainstream part of major AI products (not just a research concept) — with a real date; (b) the EU AI Act's compliance milestone that the design doc flagged as landing near mid-2026 — confirm its exact date and what it actually requires, since this is presented as a citable fact, not scoping color.

- [ ] **Step 2: Replace the placeholder card**

Replace the entire block quoted in Context above with 1 or 2 real, dated `.tl-item` entries (use 1 if a single date genuinely captures both beats, 2 if agentic AI's mainstreaming and the EU AI Act milestone are distinct enough to deserve separate cards — let Step 1's findings decide), following the exact existing markup pattern:

```html
<div class="tl-item">
  <div class="tl-dot" style="background:#f59e0b"></div>
  <div class="tl-content">
    <h4>[YEAR] — [REPLACE: real, specific headline]</h4>
    <p>[REPLACE: 1-2 sentences at 5th-6th grade level describing what actually happened]<sup class="fn"><a href="#tl-fn16" id="tl-ref16">[16]</a></sup></p>
  </div>
</div>
```

(Add a second `.tl-item` with `tl-fn17`/`tl-ref17` if using two entries.) Use the same `.tl-dot` color already used for the 2025 card (`#f59e0b`) for continuity, unless the specific new content clearly maps to a different existing color meaning used elsewhere in this timeline — check `grep -n "tl-dot" ai.html` for the established color convention before deciding.

Continue the timeline's footnote numbering from its current highest (`tl-fn15`, `ai.html:1371`) — new footnotes start at `tl-fn16` (and `tl-fn17` if a second entry is added), following the exact existing format:
```html
<li id="tl-fnN"><a href="#tl-refN">^</a> "[Source title]," [Publisher], [Date]. <a href="[URL]" target="_blank">[Link text]</a></li>
```

- [ ] **Step 3: Verify no leftover placeholder language remains**

Run: `grep -n "The Conversation Continues\|is no longer" ai.html`
Expected: no matches.

- [ ] **Step 4: Verify the timeline renders correctly and `q5` still functions**

Run: `open ai.html`, scroll to the Timeline section, confirm the new card(s) render with correct dot color and citation links that resolve. Click the `q5` quiz button (`ai.html:1353`) and confirm its question (about the 2024 Nobel Prize) still displays correctly — this task doesn't touch the 2024 card, but confirm directly rather than assuming proximity implies safety.

- [ ] **Step 5: Commit**

```bash
git add ai.html
git commit -m "feat: replace AI timeline's placeholder 2026 card with real events"
```

---

## Task 4: Add the Safety/Regulation Bridge Sentence

**Files:**
- Modify: `ai.html` (inside the existing Hinton Focus box, `~ai.html:1141-1200` — exact insertion point below)

**Context:** The existing Hinton material (interview quotes, hallucination/confabulation discussion, the "1% goes into safety" warning) is all dated to March 2025 and reads as the page's most recent word on AI safety. Per the design doc, this task adds **one bridging sentence only** — the existing Hinton content stays completely untouched otherwise.

- [ ] **Step 1: Verify the EU AI Act fact (if not already confirmed in Task 3)**

If Task 3 already verified the EU AI Act's 2026 milestone, reuse that same verified fact and date here rather than re-researching — the bridge sentence should describe the same real event, not a second, independently-sourced claim about a different regulation milestone.

- [ ] **Step 2: Insert the bridging sentence**

Inside the Hinton Focus box, after the last "Key insights from the interview" paragraph (the one ending "...I sort of believe both those things are quite plausible."<sup class="fn"><a href="#hf-fn1" id="hf-ref1e">[1]</a></sup></p>, at `ai.html:1169`) and before the `stat-grid` div (`ai.html:1171`), insert one new `<p>` tag:

```html
  <p style="margin-top:14px">[REPLACE: one sentence, at 5th-6th grade level, noting that Hinton's warnings didn't stay just talk — by [DATE], governments had started actually writing AI safety rules into law, e.g. the European Union's AI Act reaching a real enforcement milestone. Use an explicit date, not "now" or "since then" alone.]<sup class="fn"><a href="#hf-fn3" id="hf-ref3">[3]</a></sup></p>
```

Add the corresponding footnote to the Hinton box's existing footnotes list (`ai.html:1195-1198`), continuing its numbering — the current highest is `hf-fn2`, so this new footnote is `hf-fn3`:
```html
      <li id="hf-fn3" style="color:rgba(255,255,255,.45)"><a href="#hf-ref3" style="color:#82b1ff">^</a> [REPLACE: real source for the EU AI Act milestone claim]</li>
```

- [ ] **Step 3: Verify the sentence reads naturally and doesn't duplicate Task 1/3's content**

Read the Hinton box start to finish. Confirm the new sentence reads as a natural bridge after Hinton's own warnings, doesn't repeat Task 3's timeline-card wording verbatim (a related fact stated twice in different words is fine; identical sentences in two places is not), and doesn't expand into a second paragraph — this is meant to stay a light touch per the design doc.

- [ ] **Step 4: Commit**

```bash
git add ai.html
git commit -m "feat: bridge AI page's Hinton safety thread to 2026 regulation"
```

---

## Task 5: Update Date Stamps

**Files:**
- Modify: `ai.html:668, 1660`
- Modify: `index.html:635`

**Context:** Two hard-coded "March 2026" references remain in `ai.html`, plus one in `index.html`'s AI card.

- [ ] **Step 1: Update the hero note**

At `ai.html:668`, replace:
```html
  <span class="hero-note">📚 8th Grade Social Studies · Updated March 2026 · Earn points by answering quizzes!</span>
```
with:
```html
  <span class="hero-note">📚 8th Grade Social Studies · Updated July 2026 · Earn points by answering quizzes!</span>
```
(Use the actual write date in place of "July 2026" if more specific.)

- [ ] **Step 2: Update the footer**

At `ai.html:1660`, replace:
```html
  <p>Made for 8th grade Social Studies students · All links go to trusted news and educational sources · Updated March 2026</p>
```
with:
```html
  <p>Made for 8th grade Social Studies students · All links go to trusted news and educational sources · Updated July 2026</p>
```

- [ ] **Step 3: Update the index page's AI card date badge**

At `index.html:635`, replace:
```html
          <span>📅 March 2026</span>
```
with:
```html
          <span>📅 Updated July 2026</span>
```
(Match the exact wording style already used by the Iran and Ukraine cards on the same page — confirm with `grep -n "📅 Updated" index.html` that this matches their format, e.g. "Updated July 2026" vs. just "July 2026," before committing, since this card's existing format differs slightly from theirs and the design doc calls for closing that gap.)

- [ ] **Step 4: Verify no stale date strings remain**

Run: `grep -n "March 2026" ai.html index.html`
Expected: no matches in `ai.html`. In `index.html`, expected: no matches related to the AI card specifically — if other unrelated "March 2026" strings exist elsewhere on the index page (e.g., historical labels), leave them untouched; this task only concerns the AI card.

- [ ] **Step 5: Commit**

```bash
git add ai.html index.html
git commit -m "chore: update AI page date stamps from March to July 2026"
```

---

## Task 6: Audit Links and Images on the AI Page

**Files:**
- Modify (only where a problem is confirmed): `ai.html`

**Context:** Unlike Iran/Ukraine's audit tasks, this is a first-time check — no specific problem has been flagged on this page yet. Use the same proven methodology as the Iran/Ukraine plan's Task 12.

- [ ] **Step 1: Run an automated dead-link check**

Extract all `https://` URLs from the file and check each for a live response:
```bash
grep -oE 'href="https://[^"]+"' ai.html | sed -E 's/^[^:]+:href="//;s/"$//' | sort -u > /tmp/ai-links.txt
wc -l /tmp/ai-links.txt
while read -r url; do
  code=$(curl -s -o /dev/null -w "%{http_code}" -A "Mozilla/5.0" -L --max-time 10 "$url")
  echo "$code $url"
done < /tmp/ai-links.txt | sort -n
```
Review the output for any 404, 410, or connection-failure results. This sandbox has previously shown intermittent network flakiness producing false non-200s on a single-attempt check (documented in the Iran/Ukraine plan's Task 12 execution) — for any non-200 result, retry 2-3 times with short delays before concluding it's genuinely dead, then cross-verify with a second tool (WebFetch) before treating it as broken. Some sites (Britannica, CNN, Bloomberg, unrefugees.org were the previously-documented examples) block scripted requests and return 403 even when the page is fine for a real browser — check in an actual browser-equivalent tool before treating a 403 as broken.

- [ ] **Step 2: Fix confirmed dead links**

For each URL confirmed dead (checked via retry + cross-tool verification, not just one curl result), find a working replacement covering the same fact — prefer the original publisher, fall back to an archive.org snapshot (`https://web.archive.org/web/2/[URL]`) only if no live replacement exists. Update the `href` in place; do not remove the citation entirely.

- [ ] **Step 3: Visually spot-check images**

Open `ai.html` in a browser. Check: the hero chatbot screenshot (`images/ai-chatbot.jpg`, referenced at `ai.html:960`), all Key People portraits, and any other images on the page. For each, confirm: the image actually loads (no broken-image icon, no `onerror` fallback triggering), the image plausibly matches its `alt` text and any nearby caption, and — for any image lacking a nearby source/attribution link — check whether one should be added per the project's contribution guideline (images should be from Wikimedia Commons, an official/press source, or original). Do not assume a problem exists — this is a first-time check, not a hunt to justify pre-decided fixes.

- [ ] **Step 4: Fix only confirmed problems**

If Step 3 finds a genuinely broken or mislabeled image, fix it following the same discipline as the Iran/Ukraine plan's Task 10 (a real fix — correct labeling or a verified replacement — not a caption tweak that papers over a mismatch). If Step 3 finds a missing-attribution gap, add a citation following the exact pattern already used elsewhere on this page (see the `person-citation` pattern for Key People portraits, or the footnote pattern for other images) — search for the image's actual source before writing any attribution; do not fabricate one.

- [ ] **Step 5: Commit**

```bash
git add ai.html
git commit -m "fix: repair dead links and image issues found in AI page audit"
```

If no dead links or image problems were confirmed, use `chore: audit AI page links and images — no changes needed` instead and skip `git add` if nothing changed.

---

## Task 7: Full-Page Verification Pass

**Files:** None modified unless this step surfaces a real problem — verification only.

- [ ] **Step 1: Confirm no stale date/status strings remain**

Run: `grep -n "March 2026\|The Conversation Continues\|is no longer" ai.html index.html`
Expected: no matches, except historical labels correctly describing past events (e.g. "In 2024, he won the Nobel Prize" — a correct historical statement, not a stale "current" claim).

- [ ] **Step 2: Apply the date-specificity rule as an explicit check**

Run: `grep -noE '\b([Cc]urrently|as of now|[Rr]ight now|[Ff]or now|at this (point|time)|[Tt]he situation remains)\b' ai.html`
Read each match in context. If it describes AI's present capabilities or the safety/regulation conversation's status, fix it to use an explicit date, following the same convention already used elsewhere on this page after Tasks 1-4. If it's a fixed, non-evolving statement (e.g., a vocab-box definition unrelated to dated status), leave it.

- [ ] **Step 3: Re-run the dead-link check from Task 6 once more**

Confirm every link changed across Tasks 1-6 now resolves (re-run the same `curl` loop scoped to the new/changed URLs from this plan).

- [ ] **Step 4: Read the full refreshed content start to finish as a student would**

Read Section 4, the new Focus box, the timeline's new ending, and the Hinton box's new bridge sentence, straight through. Confirm the page reads as one coherent update from January 2025 through July 2026 with no jarring gap, no leftover vague placeholder, and consistent 5th-6th grade reading level throughout. Confirm nothing reads as if DeepSeek (Jan 2025) is still the most recent development.

- [ ] **Step 5: Confirm quizzes still function**

In the browser, click the quiz buttons for `q4` and `q5` (the ones tied to touched content) and confirm the questions/answers still display correctly and match content still present on the page.

- [ ] **Step 6: Confirm zero CSS/structural drift across all tasks combined**

Run a byte-level comparison of every `<style>` block between this plan's starting commit and the current tip:
```bash
git show <STARTING_COMMIT>:ai.html | sed -n '/<style/,/<\/style>/p' > /tmp/style-before.txt
sed -n '/<style/,/<\/style>/p' ai.html > /tmp/style-after.txt
diff /tmp/style-before.txt /tmp/style-after.txt
```
Expected: no output (identical). This is the single most decisive drift check from the Iran/Ukraine plan's final branch review — confirm it holds here too, across all 6 prior tasks combined, not just spot-checked per-task.

- [ ] **Step 7: Final commit if any fixes were needed**

If Steps 1-6 surfaced any small fixes, make them and commit:
```bash
git add ai.html index.html
git commit -m "fix: address verification-pass findings in AI refresh"
```
If no fixes were needed, no commit is required for this task.

---

## Self-Review Notes

- **Spec coverage:** All design doc sections (Section 4 bridge, new Focus box, timeline replacement, safety/regulation bridge, date stamps, link/image audit, verification) map to Tasks 1-7 one-to-one.
- **Placeholder scan:** Every step requiring a live-fact verification at write time is explicitly flagged as such ("verify before writing," "TBD," bracketed `[REPLACE: ...]` instructions inside code blocks) rather than presented as settled fact — this mirrors the Iran/Ukraine plan's approach to the same problem (a July-dated, fast-moving story that must be re-checked at implementation time). Task 2's Focus-box skeleton uses explicit `[REPLACE: ...]` markers precisely so no implementer could mistake the skeleton's placeholder text for real content to commit verbatim.
- **Type consistency:** N/A (no code interfaces — HTML content only). Class names (`focus-pane`, `focus-header`, `vocab`, `callout`, `c-gold`, `stat-box`, `tl-item`, `tl-dot`, `footnotes`) are used consistently with what was directly confirmed in the file during planning — the new Focus box's markup (Task 2) was copied from the actual `#hinton` box's real HTML, not reconstructed from memory or the design doc's prose description alone. Footnote-prefix numbering (`s4-fn4`, `aa-fn1`/`aa-fn2`, `tl-fn16`/`tl-fn17`, `hf-fn3`) was checked against the file's actual current highest number in each prefix family, not assumed.

# AI & Society Page Refresh — Design Document

**Date:** July 20, 2026
**Type:** Content update (no new template, no new sections/nav items — one new Focus box permitted, see below)
**Files:** `ai.html`

---

## Concept

`ai.html`'s historical narrative currently ends at **January 2025** ("DeepSeek released a competitive model cheaply, causing Nvidia's stock to drop $600B in a day") and its date stamps read "Updated March 2026." Between January 2025 and today (July 2026), AI capability continued advancing rapidly across multiple labs, but — unlike Iran/Ukraine's single dramatic ceasefire-to-collapse arc — there is no single equivalent "biggest story" moment to anchor an ending on. This is a story of steady, multi-front progress, not one event.

This refresh is **content-only**, following the same discipline as the Iran/Ukraine refresh: no new CSS classes, no nav changes, no quiz-mechanic changes, no changes to the points/easter-egg system. The one deliberate exception, confirmed with the project owner: **one new Focus box is permitted**, reusing the exact `.focus-pane` markup already used twice on this page (`#school`, and the Hinton/Godfather's Warning box) — justified because agentic AI is a genuine conceptual shift the existing page doesn't cover at all, matching the bar the two existing Focus boxes already set (each explains one distinct, self-contained idea).

Sourcing standard stays consistent with the rest of the site and with this page's existing citation density: every new factual claim gets an inline `<sup class="fn">` footnote (this page's citation pattern — distinct from Iran/Ukraine's `cite-link` pattern, but internally consistent with itself already) pointing to a real, live, non-paywalled source. Written at a 5th–6th grade reading level per the project's contribution guidelines.

**Scoping research was done in advance** (via a research pass covering Jan 2025–Jul 2026 AI news) to ground this design in real events rather than guesses. That research is a **starting point for scoping, not pre-approved copy** — every specific fact, date, and figure gets re-verified against a live source at implementation time, exactly as the Iran/Ukraine plan treated its own source table. The research also surfaced two categories of content deliberately **excluded** from this refresh: chatbot-safety lawsuits involving minors, and AI-agent security-incident stories (e.g., the "OpenClaw" agent ecosystem) — both real 2025–2026 stories, but not appropriate content for an 8th-grade page and not something requested.

---

## Section 4 ("Where is AI today — and what can it do?") — bridge forward, don't replace

**Current state:** Ends at the DeepSeek/Nvidia paragraph (Jan 2025), then pivots straight into generative AI and hallucination material that is still accurate and doesn't need to change. The `stat-grid` (100M ChatGPT users / 1.76T GPT-4 parameters / $100M+ training cost) is entirely 2023-vintage.

**New state:** Keep the existing DeepSeek paragraph as-is (it's good history, not something to rewrite). Immediately after it, add new paragraphs bridging forward to July 2026 — 1 paragraph if the two beats below combine naturally, 2 if they read better split; let the actual prose decide, don't force a specific count:

- Frame the 18-month gap as **continued acceleration**, at the level of "OpenAI, Anthropic, and Google (among others) each released several new, more capable model generations" — **generation-level framing, not an exhaustive product-name list** (a deliberate choice over a "model-race scoreboard" alternative, since the existing page's strength is explaining concepts through people and stories, not tracking brand names a 13-year-old has no reason to individually care about).
- Pivot from "models got better at the same things" into **agentic AI** as the more conceptually significant thread — AI systems that can now browse, fill out forms, write and run code, and complete multi-step tasks without a human doing each step, rather than only answering chat questions. This is the bridge into the new Focus box (below).

**Stat-grid:** replace the three 2023 figures with current equivalents. Exact numbers are **TBD at write time** — do not hardcode any specific figure from the scoping research without independently re-verifying it against a live, citable source first. Candidates worth checking at write time (not commitments): current monthly active users across major chatbot products, a current parameter-count or capability benchmark figure, current estimated frontier-training cost. If a clean 3-stat equivalent to the existing pattern can't be found, 2 stats is acceptable — do not force a third with a weak source.

---

## New Focus Box: "AI That Takes Action" (agentic AI)

**Placement:** After Section 4, following the same pattern as the two existing Focus boxes (`#school`, and the Hinton/Godfather's-Warning box) — same `.focus-pane` markup, same icon-header + 2–3-paragraph structure, same citation density as its neighbors (this page's Focus boxes are lighter on inline citation than its numbered sections; match that existing register rather than over-citing).

**Content:** Explain the shift from "AI you chat with" to "AI that acts for you" — a concrete, mainstream example (one that's broadly recognizable, not a niche or controversial one) showing an AI agent completing a multi-step task (e.g., browsing a website, filling in information, or writing and running code) without a person doing each individual step. Add a `.vocab` box defining "agentic AI," matching the existing GPT/LLM/Generative-AI/Hallucination vocab-box pattern already on this page.

**Explicitly avoid:** any of the specific agent products/ecosystems flagged during scoping research as carrying a security-incident or safety-controversy angle. The concept ("AI that acts, not just chats") is squarely in scope; specific products with unresolved safety baggage are not the example to reach for.

---

## Timeline — replace the placeholder 2026 card

**Current state:** The timeline's last card, `2026 — The Conversation Continues`, has no real content — it's a vague closing sentiment ("the question is no longer 'will AI change the world?'") with zero dated facts, functionally a placeholder despite looking like a real entry.

**New state:** Replace it with real, dated `.tl-item` entries (same markup/pattern as every other timeline card) — 1 entry if a single date genuinely captures the period, 2 if the agentic-AI shift and the regulation milestone below are distinct enough to deserve separate cards; let the actual research findings decide the count rather than forcing a specific number:

- A 2025 entry marking when agentic AI tools became a mainstream, named part of major AI products (not just a research concept) — exact framing/date TBD at write time.
- A 2026 entry tied to a genuinely concrete, near-"today" date — the scoping research flagged the EU AI Act's major compliance milestone as landing very close to this page's actual update date, which would give the timeline's ending real specificity instead of a vague sentiment. Verify the exact date and scope of that milestone before writing it as fact.

Both entries must carry real citations, following the timeline's existing footnote pattern (`tl-fnN`).

---

## Safety/Regulation Thread — light touch only

**Current state:** The existing Hinton interview material (hallucination/confabulation discussion, the "you don't store strings of words" callout) is all dated to 2025 and presented as the page's most recent word on AI safety concerns.

**New state:** Add **one bridging sentence** (not a new section, not a rewrite of the existing Hinton material, which stays exactly as-is) noting that the "AI could be dangerous" conversation continued past Hinton's 2025 warnings into actual regulation — specifically, tying it to the EU AI Act reaching a real enforcement milestone in 2026. This is deliberately minimal: the existing material remains the substantive safety content; this sentence just prevents the page from reading as if the conversation stopped in 2025.

---

## Date Stamps

Update every hard-coded "Updated March 2026" string to July 2026 (or the specific July date used at write time): hero `.hero-note` (`ai.html:668`) and footer (`ai.html:1660`). Same mechanical fix as Iran/Ukraine's Task 5/9.

Also update `index.html`'s AI card date badge (currently "📅 March 2026," flagged as a known, deliberate inconsistency in the Iran/Ukraine final branch review — this refresh is the intended moment to close that gap).

---

## Date-Specificity Rule — applied from the start

Unlike the Iran/Ukraine refresh (where this rule was introduced mid-plan via a verification-pass retrofit), this plan applies it as a Global Constraint from Task 1: never use relative-time phrasing ("now," "currently," "as of now") to describe AI's present capabilities or the state of the safety/regulation conversation — always an explicit date. This page will be refreshed again in the future, and relative phrasing goes stale silently between refreshes, exactly as it already did once here.

---

## Lightweight Link/Image Audit

Not because a specific problem has been found on this page yet (unlike Iran/Ukraine, where Task 10's audit was scoped around already-confirmed bugs) — this is a first-time check for `ai.html`, using the same proven methodology as Iran/Ukraine's Task 12:

- Extract every `https://` link from `ai.html`, curl-check each with the 3-retry-for-flaky-sandbox methodology already established, cross-verify any non-200 with a second tool (WebFetch) before concluding anything is genuinely dead.
- Visual spot-check the Key People portraits, the hero chatbot screenshot, and any other images on the page for obvious cropping or mislabeling problems (same visual-check discipline as Iran/Ukraine's Task 11, though without a specific flagged risk case to start from).
- Fix only confirmed problems — this is an audit, not an assumption that something is broken.

---

## Explicitly Out of Scope

- New quiz mechanics, new CSS, changes to the points/easter-egg system.
- The existing "AI & Your School" Focus box — already current enough not to need touching.
- The Key People section — no new person is being added in this refresh.
- Chatbot-safety lawsuits involving minors, and AI-agent security-incident stories (OpenClaw-style) — real current events in this window, but not appropriate content for this audience and not requested.
- A "model-race scoreboard" treatment naming every individual model release by brand/version — considered and explicitly rejected in favor of generation-level framing (see Section 4 above).

---

## Verification / Success Criteria

No test runner exists for this project (plain HTML, no build step) — "verification" means the same manual discipline as Iran/Ukraine:

- Grep for stale strings ("March 2026," "The Conversation Continues") after the refresh, confirming none remain outside correct historical labels.
- Open the page in a browser; read Section 4, the new Focus box, and the timeline's new entries start to finish, checking reading level, tense/date consistency, and that the page reads as one coherent update from January 2025 through July 2026 with no jarring gap or leftover vague placeholder.
- Click every new/changed citation link; confirm each resolves to a real, live, non-paywalled page.
- Confirm quiz buttons tied to touched content still reference facts present on the page after the edit: `q4` (Section 4, where new paragraphs are being inserted) and `q5` (its button sits immediately after the timeline's 2024/2025 cards, right before the placeholder 2026 card being replaced — `q5`'s own question is about the 2024 Nobel Prize, a fact this refresh doesn't touch, so it should be unaffected, but confirm this directly rather than assuming proximity implies safety).
- Visually confirm the new Focus box renders with no CSS drift, matching its two siblings' look exactly.
- Byte-level `<style>`/`<script>` diff check (the single most decisive drift check from the Iran/Ukraine final branch review) confirming zero structural change accumulated across the refresh.

**Success criteria:** the page reads as one coherent update from January 2025 through July 2026; the new Focus box explains agentic AI at the same quality bar as its two siblings; every new fact is cited to a real, independently-verified, live source; zero structural/CSS changes; `index.html`'s AI card date badge matches the page's own updated date stamp.

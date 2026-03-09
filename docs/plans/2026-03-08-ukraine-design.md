# Ukraine Page — Design Document

**Date:** March 8, 2026
**Template type:** Ongoing Conflict (new third template — between crisis and explainer)
**File:** `ukraine.html` (single self-contained HTML, no build tools)

---

## Concept

A history-driven explainer page about Ukraine for 8th graders. Unlike the Iran page (breaking crisis) or the AI page (evergreen explainer), this uses a new **ongoing conflict template** — the war is still happening, but the page is less "breaking news" and more "how did we get here, and where are we now?"

The core framing is **"Ukraine: How Did We Get Here?"** — deep history dive with the current war as the culmination, not the starting point. Students should understand *why* this conflict exists before they understand what's happening today.

The history backbone comes from Timothy Snyder's free Yale lecture series "The Making of Modern Ukraine," supplemented by PBS NewsHour Classroom, CFR backgrounders, Crash Course, and Holodomor-specific educational resources.

---

## Color Palette

| Role | Color | Hex |
|---|---|---|
| Primary (headers, nav, links) | Ukrainian blue | `#005BBB` |
| Accent (quizzes, easter eggs, focus boxes) | Sunflower yellow | `#FFD500` |
| Highlights, stats, warm accents | Amber | `#d4850a` |
| Hero background | Dark gradient | `#1a1a2e → #16213e` |
| Body background | Cream | `#fdf6ec` (same as Iran & AI) |

Blue/yellow signals Ukraine's national colors. The amber provides warmth for stat boxes and callouts without clashing.

---

## Banner Style

**New "Ongoing Conflict" banner** — amber/gold background:
- Not pulsing like Iran's red BREAKING banner (less urgent)
- Not as calm as AI's blue "Why This Matters Now" (this is an active war)
- Text: "This conflict is ongoing — last updated March 2026"
- Creates a **third template variant** reusable for other active-but-not-breaking situations

---

## Page Structure

### 1. "Ongoing Conflict" Banner
- Amber/gold background, dark text
- Hook: "The largest war in Europe since 1945 — and it started with a question about identity."
- Link to scroll to current section

### 2. Hero Section
- Dark gradient background (`#1a1a2e → #16213e`)
- 🇺🇦 emoji (clickable for easter egg)
- Title: "Ukraine: How Did We Get Here?"
- Subtitle: "A thousand years of history behind Europe's biggest war"
- Meta: "8th Grade Social Studies · March 2026 · Earn points by answering quizzes!"

### 3. Points Bar
- Same gamification system as Iran and AI (0–10 pts, progress bar, unlock hints)

### 4. Sticky Nav
- Blue/yellow pill buttons (same pattern, Ukrainian colors)
- Sections: Where Is It? · Ancient Roots · Empire & Revolution · Holodomor · Independence · Orange & Maidan · The Invasion · Where We Are Now · Timeline · People · Videos · Resources

### 5. Section 1: Where Is Ukraine?
- **Interactive Leaflet.js map** with 11 markers:
  - Kyiv (capital, Euromaidan, defended 2022)
  - Crimea (annexed 2014)
  - Donetsk (Donbas conflict since 2014)
  - Luhansk (separatist-held since 2014)
  - Mariupol (80-day siege, Azovstal)
  - Kherson (liberated Nov 2022)
  - Zaporizhzhia (nuclear plant, occupied)
  - Bucha (atrocities revealed April 2022)
  - Kerch Bridge (connects Crimea to Russia)
  - Odesa (Black Sea port, grain exports)
  - Kharkiv (second-largest city, near Russian border)
- Basic geography: size (largest country entirely in Europe), population, borders
- Why location matters: "stuck between" Russia and Europe
- Vocab: sovereignty, annexed, occupied territory
- Footnotes

### 6. Section 2: Ancient Roots (Brief)
- **Question:** "Where did Ukraine come from?"
- Kievan Rus' (~882) — Viking/Slavic state centered on Kyiv
- Why this matters now: Putin claims Ukraine and Russia are "one people" because of shared Kievan Rus' origins. Ukrainians say Kyiv was *their* capital first.
- Mongol invasion (1240) destroys Kyiv
- Cossacks and the Zaporizhzhian Sich — self-governing warrior communities
- Keep this SHORT — 2-3 paragraphs max, one callout box
- Vocab: Kievan Rus', Cossacks
- Footnotes
- Quiz button

### 7. Section 3: Empire, Revolution, and the Fight for Freedom
- **Question:** "Why couldn't Ukraine stay independent?"
- Russian Empire absorbs Ukraine (18th-19th century)
- Taras Shevchenko — poet/artist who wrote in Ukrainian when the language was banned
- Ukrainian People's Republic (1917-1918) — brief independence, crushed by Bolsheviks
- The pattern: Ukraine tries to be free → a bigger power takes over
- Vocab: empire, colonialism, self-determination
- Footnotes
- Quiz button

### 8. Focus Box: The Holodomor (1932-33)
- **Dark-themed focus pane** (same style as AI's focus boxes and Iran's update pane)
- This is the emotional and historical heart of the page
- Stalin's engineered famine — 3.5 to 7 million Ukrainians died
- Grain was seized from Ukrainian farms while people starved
- "Five Stalks of Grain" — the law that made it a crime to take even a few stalks of wheat from a collective farm
- Why this matters: Ukrainians see it as genocide; Russia has never fully acknowledged it
- Recognized as genocide by many countries (list a few)
- Embedded video: HREC educational video if available, or Crash Course segment
- "Think about it" discussion question: "The Holodomor was hidden from the world for decades. Why would a government try to cover up a famine it caused — and what happens when history gets erased?"
- Collapsible sources section
- Sources: HREC Education, University of Minnesota resource guide

### 9. Section 4: Independence and the New Ukraine (1991-2013)
- **Question:** "What happened when Ukraine finally became free?"
- Chernobyl (1986) — disaster that exposed Soviet incompetence, fueled independence movement
- 1991 independence referendum — 92% voted yes
- The early struggles: corruption, oligarchs, economic chaos
- The identity question: western Ukraine looks toward Europe, eastern Ukraine has closer ties to Russia
- Vocab: referendum, oligarch, corruption
- Footnotes
- Quiz button

### 10. Section 5: Orange Revolution & Euromaidan
- **Question:** "What were Ukrainians fighting for before the war?"
- Orange Revolution (2004) — mass protests against election fraud
- Euromaidan / Revolution of Dignity (2013-2014):
  - President Yanukovych rejects EU deal under Russian pressure
  - Hundreds of thousands protest on Maidan square in Kyiv
  - Government snipers kill over 100 protesters ("Heavenly Hundred")
  - Yanukovych flees to Russia
- Why this matters: this is the moment Putin decided Ukraine was "lost" to the West
- Vocab: revolution, protest, EU (European Union)
- Footnotes
- Quiz button

### 11. Section 6: The Invasion
- **Question:** "What happened on February 24, 2022 — and why?"
- Russia annexes Crimea (March 2014) — "little green men," fake referendum
- War in Donbas begins (April 2014) — Russia-backed separatists
- Feb 24, 2022: full-scale invasion — largest European conflict since WWII
- Key moments:
  - Battle of Kyiv (Feb-March 2022) — Russia fails to take the capital
  - Bucha massacre revealed (April 2022)
  - Siege of Mariupol / Azovstal (80+ days)
  - Kherson liberated (November 2022)
  - Zaporizhzhia nuclear plant occupied
- The human cost: stat grid with sourced figures
- Vocab: invasion, annexed, war crimes
- Footnotes
- Quiz button

### 12. Section 7: Where We Are Now (2025-2026)
- **Question:** "Where does the war stand today?"
- Current front lines (general description — don't try to be too precise since it changes)
- Peace negotiations: US, EU, UK-France frameworks
- Territorial disputes: Donbas remains the core obstacle
- Impact on Ukrainians: refugees (millions displaced), infrastructure destruction
- Impact globally: grain exports, energy prices, NATO expansion
- "Think about it" callout: What would a fair peace deal look like — and who gets to decide?
- Footnotes

### 13. Timeline
- Same vertical timeline style as Iran and AI pages
- Color-coded dots by era:
  - Ancient/medieval: `#6366f1` (indigo)
  - Empire/Soviet: `#005BBB` (Ukrainian blue)
  - Independence era: `#FFD500` (yellow)
  - War: `#dc2626` (red)
- 17 entries (see timeline in research)
- Double-click timeline line → hidden bonus: "Ukraine in Culture" (Shevchenko poetry, Ukrainian music, Eurovision, cultural resistance)
- Each entry sourced with links
- Quiz buttons at key points

### 14. Key People
- Same portrait-ring grid as Iran and AI
- CC-licensed Wikimedia Commons images
- People:
  - **Volodymyr Zelenskyy** — President of Ukraine, wartime leader, former comedian
  - **Vladimir Putin** — President of Russia, ordered the invasion
  - **Taras Shevchenko** — Poet and national hero, wrote in Ukrainian when the language was banned
  - **Mykhailo Hrushevsky** — Historian, first president of the Ukrainian People's Republic (1917)
- Each card: portrait, name, role, 2-3 sentence description, source citation
- Note: Kept to 4 people to avoid the Bandera controversy and keep focus on figures students need to know

### 15. Videos & Podcasts
- Embedded YouTube videos curated for 8th graders:
  - Crash Course World History #20: "Russia, the Kievan Rus, and the Mongols"
  - Crash Course European History #35: "Russian Revolution and Civil War"
  - PBS NewsHour Classroom Ukraine explainers
  - HREC Holodomor educational video (if available on YouTube)
  - Timothy Snyder lectures (linked with "Advanced" tag — these are college-level)
- Video tags (long/short) like Iran and AI pages
- Thinking prompts callout

### 16. Resources (Ranked Reading)
- Same resource grid with difficulty stars

**Easier:**
- Britannica Kids: Ukraine
- Britannica Kids: Russia-Ukraine War
- National Geographic Kids: Ukraine
- Ducksters: Ukraine Geography
- PBS NewsHour Classroom lessons

**Medium:**
- BBC Ukraine coverage
- NPR Ukraine explainers
- Facing History & Ourselves: Ukraine lesson plans
- Pulitzer Center: Contextualizing the Crisis in Ukraine

**Harder:**
- CFR: Ukraine — Conflict at the Crossroads of Europe and Russia
- Timothy Snyder: "The Making of Modern Ukraine" (Yale, YouTube)
- HREC Education: Holodomor resources
- Crash Course European History (relevant episodes)

---

## Easter Eggs (Ukraine-themed)

**IMPORTANT: Each page must use different triggers so students who find easter eggs on one page have to explore fresh on another.**

| Page | Hero emoji trigger | Secret key code | Timeline trigger | Stat box trigger |
|---|---|---|---|---|
| Iran | Click flag 5x | Konami (↑↑↓↓←→←→BA) | Double-click line | Click all stat boxes |
| AI | Click robot 5x | Konami (↑↑↓↓←→←→BA) | Double-click line | Click all stat boxes |
| **Ukraine** | Click flag **7x** | **UKRAINE** (type the word) | **Triple-click** any timeline date | **Hover** all people portraits in order |

### Ukraine Easter Eggs

| Trigger | Reward |
|---|---|
| Click 🇺🇦 hero emoji 7 times | "Sunflower" easter egg — fun fact about sunflowers as Ukraine's national flower + the story of the Ukrainian woman who gave sunflower seeds to a Russian soldier ("Put these in your pockets so flowers grow when you die here") |
| Type "UKRAINE" anywhere on the page | "Hidden Hero" modal — Taras Shevchenko poem excerpt in Ukrainian + English translation + brief bio of why he matters |
| Triple-click any timeline date text | Hidden bonus: Ukraine in Culture (Eurovision 2022 win, folk music, Shevchenko, bandura instrument, cultural resistance during war) |
| Hover all 4 people portraits in sequence (left to right) | Unlock bonus: "The Human Cost" — refugee and displacement statistics with context, stories of Ukrainian resilience |

**Future pages should also rotate triggers** — the goal is that students share discoveries with each other and each page feels like a fresh hunt.

---

## Sourcing Standards

- Same Wikipedia-style per-section footnotes as AI page
- Every factual claim gets a footnote reference
- Preferred sources: PBS, BBC, NPR, CFR, HREC, Britannica, Crash Course, Wikimedia Commons
- No unsourced statistics or claims
- All images from Wikimedia Commons (CC-licensed or public domain)
- **Holodomor section** verified against HREC and University of Minnesota resource guides
- Death toll figures use ranges when sources disagree (e.g., "3.5 to 7 million")

---

## Reusability (Ongoing Conflict Template)

This page establishes the **ongoing conflict template** distinct from both the crisis template (Iran) and the explainer template (AI):
- Amber "Ongoing Conflict" banner (not red, not blue)
- History-heavy structure with "where we are now" as culmination
- Interactive map (Leaflet.js)
- Focus Box for the Holodomor (deep dive into a critical historical event)
- Same design system (s-card, callouts, stat-grid, timeline, quiz, people-grid, resource-grid)
- Same gamification JS (points, quizzes, easter eggs)
- Same accessibility features (OpenDyslexic toggle, responsive design)

Future topics using this template: Israeli-Palestinian conflict, Kashmir, other long-running disputes.

---

## Key Source References

| Source | Role |
|---|---|
| Timothy Snyder, "The Making of Modern Ukraine" (Yale) | Historical backbone — lectures linked in Resources |
| PBS NewsHour Classroom | Student-friendly current coverage |
| CFR: Ukraine Backgrounder | Comprehensive overview for teacher reference |
| Crash Course World History #20 | Kievan Rus' / Mongols |
| Crash Course European History #35 | Russian Revolution / Ukrainian independence |
| HREC Education | Holodomor lesson plans and primary sources |
| Britannica Kids | Student-level overview |
| BBC / NPR | Ongoing war coverage |

---

## Reading Level Notes

Based on the reading level audit of the Iran and AI pages:
- Write at **5th-6th grade reading level** with **8th grade content depth**
- Define every term the first time it's used (vocab boxes)
- No jargon pile-ups — max one new term per sentence
- Use second person ("you") to keep students engaged
- Short sentences. Break up complex ideas across multiple paragraphs.
- Avoid: academic citation language, financial shorthand, diplomatic jargon, passive voice
- When quoting experts or officials, paraphrase in plain language first, then give the quote

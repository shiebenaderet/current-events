# Ukraine Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a self-contained `ukraine.html` explainer page about Ukraine's history and the ongoing war, following the same design system as `iran.html` and `ai.html` but using the new "ongoing conflict template" format.

**Architecture:** Single self-contained HTML file with embedded CSS and JS. Reuses the same component classes as Iran and AI (s-card, callouts, stat-grid, timeline, quiz system, people-grid, resource-grid) but with a blue/yellow Ukrainian color palette, amber "Ongoing Conflict" banner, and Leaflet.js interactive map. Wikipedia-style per-section footnotes. History-driven structure with "where we are now" as culmination.

**Tech Stack:** Plain HTML/CSS/JS, Leaflet.js for interactive map (CDN), Google Fonts (same set as Iran/AI), YouTube embeds for videos.

---

## Reference Files

- **Template to follow (crisis):** `/Users/shiebenaderet/Documents/GitHub/current-events/iran.html`
- **Template to follow (explainer):** `/Users/shiebenaderet/Documents/GitHub/current-events/ai.html`
- **Design doc:** `/Users/shiebenaderet/Documents/GitHub/current-events/docs/plans/2026-03-08-ukraine-design.md`
- **Index page (update at end):** `/Users/shiebenaderet/Documents/GitHub/current-events/index.html`

## Wikimedia Commons Images (CC-Licensed)

| Person | File | License |
|---|---|---|
| Volodymyr Zelenskyy | `File:Volodymyr_Zelensky_Official_portrait.jpg` | CC-BY-4.0 (Ukrainian government) |
| Vladimir Putin | `File:Vladimir_Putin_(2020-02-20).jpg` (from official large photos category) | CC-BY-4.0 (Kremlin) |
| Taras Shevchenko | `Category:Photographs_of_Taras_Shevchenko` (1858-1861 photograph) | Public domain (died 1861) |
| Mykhailo Hrushevsky | `Category:Mykhailo_Hrushevsky` (historical photograph) | Public domain (died 1934) |

Download images to `images/` folder for local use.

## YouTube Video Embeds

| Video | Role |
|---|---|
| Crash Course World History #20: Russia, the Kievan Rus, and the Mongols | Ancient roots |
| Crash Course European History #35: Russian Revolution and Civil War | Soviet era |
| PBS NewsHour Classroom: Ukraine conflict explainer | Current conflict |
| Search for HREC/Holodomor educational video on YouTube | Holodomor focus box |

Search for exact YouTube IDs during implementation and verify they work before embedding.

## Teacher-Provided Sources (use throughout)

These sources were specifically requested by the teacher. Integrate them as footnotes, stat sources, and resource links wherever relevant:

| Source | URL | Best used for |
|---|---|---|
| AP News — War by the numbers | `https://apnews.com/article/russia-ukraine-war-numbers-f023cd82917ccb29ad2dda54ea589249` | Stat grids, casualty/cost figures, Section 6 & 7 |
| UK Parliament — Conflict overview (CBP-9723) | `https://researchbriefings.files.parliament.uk/documents/CBP-9723/CBP-9723.pdf` | Background verification, Section 7, Resources (Harder) |
| BBC — Ukraine conflict article | `https://www.bbc.com/news/articles/c0l0k4389g2o` | Footnotes, Resources |
| Harvard HURI — War background | `https://war.huri.harvard.edu/background/` | Sections 2, 6 — addresses "one people" myth, 2014 origins, NATO question. Excellent for footnotes. |
| ISW ArcGIS StoryMap — Live front lines | `https://storymaps.arcgis.com/stories/36a7f6a6f5a9448496de641cf64bd375` | Link in Section 7 "Where We Are Now" — students can see actual front lines (updated daily). Resources (Harder). |
| CSIS — Russia-Ukraine War in 10 Charts | `https://www.csis.org/analysis/russia-ukraine-war-10-charts` | Hard data: ~1.2M Russian casualties, 20% territory occupied (~120,000 km²), $588B reconstruction cost, drone stats. Stat grids in Sections 6 & 7. Resources (Harder). |

---

## Task 1: Download Images & Create File Skeleton

**Files:**
- Create: `ukraine.html`
- Download to: `images/` (portrait images)

**Step 1:** Download portrait images from Wikimedia Commons to `images/` folder. Use the Wikimedia Commons API (`/w/api.php?action=query&titles=File:...&prop=imageinfo&iiprop=url&iiurlwidth=500&format=json`) to get correct thumbnail URLs, then download with `-A "Mozilla/5.0"` user agent header. Verify each downloaded file is actually an image (not HTML error page) using `file images/filename.jpg`.

**Step 2:** Create `ukraine.html` with the full `<head>` (including Leaflet.js CDN), CSS reset, variables, and all component styles. Copy the AI page's CSS structure but change the color palette to Ukrainian blue/yellow/amber.

**Key CSS variables:**
```css
:root{
  --cream:#fdf6ec;--warm-white:#fffdf9;
  --gold:#d4850a;--gold-l:#f0b429;--gold-ll:#fef3db;
  --blue:#005BBB;--blue-d:#003d7a;--blue-l:#e0efff;
  --green:#1a6640;--green-l:#e8f5ee;
  --yellow:#FFD500;--yellow-l:#fff8d6;
  --amber:#d4850a;
  --red:#dc2626;--red-l:#fde8e8;
  --border:#e8d5b7;--mid:#666;
  --shadow:0 4px 20px rgba(0,0,0,.1);
}
```

**Key CSS differences from Iran/AI:**
- Hero gradient: `#1a1a2e → #16213e` (dark blue)
- Primary color: `#005BBB` (Ukrainian blue)
- Accent: `#FFD500` (sunflower yellow)
- Highlight: `#d4850a` (amber)
- Banner: amber "Ongoing Conflict" instead of red BREAKING or blue "Why This Matters Now"
- Nav pills: blue/yellow tones
- All existing component CSS from AI page: s-card, callouts, stat-grid, vocab, timeline, quiz, people-grid, resource-grid, footnotes, focus-pane, toast, easter eggs, dyslexic toggle, responsive

**Include in `<head>`:**
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
```

**Step 3:** Add HTML skeleton: banner, hero, points bar, sticky nav, modals (quiz, egg, toast), empty `<main>`, dyslexic toggle. Follow the AI page pattern exactly.

**Banner content:**
- Amber background (`#d4850a`), white text
- "This conflict is ongoing — last updated March 2026"
- Hook: "The largest war in Europe since 1945 — and it started with a question about identity."

**Hero content:**
- 🇺🇦 emoji (clickable, `id="heroEmoji"`, `onclick="handleEmojiClick()"`)
- Title: "Ukraine: How Did We Get Here?"
- Subtitle: "A thousand years of history behind Europe's biggest war"
- Meta: "8th Grade Social Studies · March 2026 · Earn points by answering quizzes!"

**Sticky nav sections:**
```
Where? · Ancient Roots · Empire · Holodomor · Independence · Revolution · Invasion · Now · Timeline · People · Videos · Resources
```

**Step 4:** Commit.
```bash
git add ukraine.html images/volodymyr-zelenskyy.jpg images/vladimir-putin.jpg images/taras-shevchenko.jpg images/mykhailo-hrushevsky.jpg
git commit -m "feat: add Ukraine page skeleton with CSS, hero, banner, and nav"
```

---

## Task 2: Section 1 — Where Is Ukraine? (with Leaflet.js Map)

**Files:**
- Modify: `ukraine.html`

**Step 1:** Build Section 1 with an interactive Leaflet.js map and basic geography content.

**Map setup** (follow Iran page's Leaflet pattern exactly):
- Center: `[48.5, 33.0]`, zoom: `5`
- Tile layer: OpenStreetMap
- `scrollWheelZoom: false`

**Map markers (11 total):**
```javascript
const kyivIcon = L.divIcon({
  html:'<div style="background:#005BBB;color:white;border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;font-size:18px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3)">🏛️</div>',
  className:'',iconSize:[34,34],iconAnchor:[17,17]
});
L.marker([50.4547,30.5238],{icon:kyivIcon}).addTo(map)
  .bindPopup('<b>Kyiv</b><br>Capital of Ukraine<br>Defended against Russian assault in Feb-March 2022').openPopup();

const sites = [
  {pos:[44.9578,34.1095],name:'Crimea',desc:'Annexed by Russia in March 2014 via illegal referendum',emoji:'⚠️'},
  {pos:[48.0028,37.8053],name:'Donetsk',desc:'Center of Donbas conflict since 2014; Russia-backed separatists',emoji:'💥'},
  {pos:[48.5695,39.3286],name:'Luhansk',desc:'Eastern Donbas city; separatist-held since 2014',emoji:'💥'},
  {pos:[47.0951,37.5413],name:'Mariupol',desc:'Besieged for 80+ days in 2022; Azovstal became symbol of resistance',emoji:'🏭'},
  {pos:[46.6558,32.6178],name:'Kherson',desc:'Occupied early 2022; liberated November 2022',emoji:'🇺🇦'},
  {pos:[47.8229,35.1903],name:'Zaporizhzhia',desc:'Europe\'s largest nuclear plant; occupied by Russia',emoji:'☢️'},
  {pos:[50.5435,30.2120],name:'Bucha',desc:'Site of documented Russian atrocities against civilians (April 2022)',emoji:'🕯️'},
  {pos:[45.2786,36.5393],name:'Kerch Bridge',desc:'Bridge connecting Crimea to Russia; damaged by Ukrainian strikes',emoji:'🌉'},
  {pos:[46.4857,30.7438],name:'Odesa',desc:'Major Black Sea port; critical for grain exports',emoji:'⚓'},
  {pos:[49.9808,36.2527],name:'Kharkiv',desc:'Ukraine\'s second-largest city; near Russian border; constant bombardment',emoji:'🏙️'},
];
```

Also add a rough Ukraine border polygon (similar to Iran's `iranPoly`). Use approximate coordinates for Ukraine's outline.

**Section content must include:**
- The map (full width, `height:360px`)
- Basic geography: largest country entirely in Europe (~603,000 km²), population ~44 million (pre-war), borders Russia, Belarus, Poland, Slovakia, Hungary, Romania, Moldova
- Why location matters: Ukraine sits between Russia and the European Union — it's been pulled in both directions for centuries
- Vocab boxes: sovereignty, annexed, occupied territory
- Footnotes (verify geography stats with Britannica or CIA World Factbook)
- Quiz button

**Step 2:** Commit.
```bash
git add ukraine.html
git commit -m "feat: add Section 1 — Where Is Ukraine? with interactive map"
```

---

## Task 3: Section 2 — Ancient Roots (Brief)

**Files:**
- Modify: `ukraine.html`

**Step 1:** Build Section 2. Keep this SHORT — 2-3 paragraphs max plus one callout.

**Content must include:**
- Kievan Rus' (~882 AD) — a Viking/Slavic state centered on Kyiv; at its peak it was the largest state in medieval Europe
- Why this matters NOW: Putin has claimed Ukraine and Russia are "one people" because of shared Kievan Rus' origins. Ukrainians point out that Kyiv was *their* capital first — and that they've had their own language, culture, and identity for centuries.
- Mongol invasion (1240) destroys Kyiv — power shifts north to Moscow
- Cossacks and the Zaporizhzhian Sich (1500s-1700s) — self-governing warrior communities on the Dnipro River who fiercely defended their independence
- Callout box: "Putin's argument vs. Ukraine's response" — keep it balanced and factual
- Vocab: Kievan Rus', Cossacks
- Footnotes (verify with Britannica, Crash Course, Snyder)
- Quiz button

**Sources to cite:**
- Britannica: Kievan Rus'
- Crash Course World History #20
- Snyder lecture series (lecture 5)

**Step 2:** Commit.
```bash
git add ukraine.html
git commit -m "feat: add Section 2 — Ancient Roots"
```

---

## Task 4: Section 3 — Empire, Revolution, and the Fight for Freedom

**Files:**
- Modify: `ukraine.html`

**Step 1:** Build Section 3.

**Content must include:**
- Russian Empire absorbs Ukraine (18th-19th century) — Catherine the Great takes Crimea (1783), Ukrainian language and culture suppressed
- Taras Shevchenko (1814-1861) — poet/artist who wrote in Ukrainian when the Russian Empire banned the language. His poetry became a symbol of Ukrainian identity. Still the most important cultural figure in Ukraine.
- Ukrainian People's Republic (1917-1918) — brief independence after WWI/Russian Revolution, led by Mykhailo Hrushevsky. Crushed by Bolsheviks.
- The pattern: Ukraine tries to be free → a bigger power takes over. This has happened again and again across Ukrainian history.
- Vocab: empire, colonialism, self-determination
- Footnotes
- Quiz button

**Sources to cite:**
- Britannica: History of Ukraine
- Snyder lectures 6-7
- Crash Course European History #35

**Step 2:** Commit.
```bash
git add ukraine.html
git commit -m "feat: add Section 3 — Empire, Revolution, and the Fight for Freedom"
```

---

## Task 5: Focus Box — The Holodomor (1932-33)

**Files:**
- Modify: `ukraine.html`

**Step 1:** Build the Holodomor Focus Box using dark-themed focus-pane style (same as AI's focus boxes).

**Content must include:**
- What happened: Stalin's Soviet government seized grain from Ukrainian farms. People starved while food was exported. Borders were sealed so Ukrainians couldn't leave to find food.
- Scale: 3.5 to 7 million Ukrainians died (use a range because historians disagree on exact numbers)
- "Five Stalks of Grain" — the 1932 law that made it a crime punishable by death to take even a few stalks of wheat from a collective farm
- Why it happened: Stalin wanted to crush Ukrainian identity, break resistance to collectivization, and punish Ukraine for wanting independence
- Aftermath: The Holodomor was hidden from the world for decades. The Soviet government denied it happened.
- Recognition: Now recognized as genocide by many countries (Ukraine, USA, Canada, EU Parliament, others)
- Search YouTube for an embedded educational video about the Holodomor (HREC or similar). If none found, link to HREC resources instead.
- "Think about it" discussion question: "The Holodomor was hidden from the world for decades. Why would a government try to cover up a famine it caused — and what happens when history gets erased?"
- Collapsible sources section
- Stat grid: 3.5-7 million dead, 1932-33, recognized by 20+ countries

**Sources to verify and cite:**
- HREC Education (holodomor.ca)
- Britannica: Holodomor
- University of Minnesota Holodomor resource guide

**Step 2:** Commit.
```bash
git add ukraine.html
git commit -m "feat: add Focus Box — The Holodomor"
```

---

## Task 6: Section 4 — Independence and the New Ukraine (1991-2013)

**Files:**
- Modify: `ukraine.html`

**Step 1:** Build Section 4.

**Content must include:**
- Chernobyl (1986) — world's worst nuclear disaster, near Kyiv. Exposed Soviet government's incompetence and dishonesty (they tried to cover it up). Fueled the independence movement.
- 1991 independence referendum — 92% voted yes. Even in Crimea, a majority voted for independence.
- The early struggles: corruption, oligarchs (explain the term), economic chaos. Ukraine's GDP fell by 60% in the 1990s.
- The identity question: western Ukraine (historically tied to Poland/Austria) looks toward Europe; eastern Ukraine (historically tied to Russia) has closer ties to Moscow. This isn't a clean split — it's more of a gradient.
- Vocab: referendum, oligarch, corruption
- Footnotes
- Quiz button

**Sources to cite:**
- Britannica: Ukraine independence
- CFR backgrounder
- BBC

**Step 2:** Commit.
```bash
git add ukraine.html
git commit -m "feat: add Section 4 — Independence and the New Ukraine"
```

---

## Task 7: Section 5 — Orange Revolution & Euromaidan

**Files:**
- Modify: `ukraine.html`

**Step 1:** Build Section 5.

**Content must include:**
- Orange Revolution (2004): Presidential election rigged in favor of pro-Russia candidate Viktor Yanukovych. Hundreds of thousands protest in Kyiv wearing orange. New election held — pro-Western Viktor Yushchenko wins.
- Then: disappointment. Yushchenko's government struggles with corruption. In 2010, Yanukovych wins the presidency legitimately.
- Euromaidan / Revolution of Dignity (Nov 2013 - Feb 2014):
  - Yanukovych was about to sign a deal bringing Ukraine closer to the EU
  - Putin pressured him to reject it and align with Russia instead
  - Yanukovych backed out of the EU deal at the last minute
  - Hundreds of thousands of Ukrainians filled Maidan (Independence Square) in Kyiv
  - Protests lasted months through a brutal winter
  - Government snipers killed over 100 protesters — they're remembered as the "Heavenly Hundred"
  - Yanukovych fled to Russia in February 2014
- Why this matters: this is the moment Putin decided Ukraine was "lost" to the West — and it set the stage for everything that followed
- Vocab: revolution, protest, EU (European Union)
- Footnotes
- Quiz button

**Sources to cite:**
- BBC: Ukraine's Orange Revolution
- CFR: Ukraine timeline
- Snyder lecture 20

**Step 2:** Commit.
```bash
git add ukraine.html
git commit -m "feat: add Section 5 — Orange Revolution & Euromaidan"
```

---

## Task 8: Section 6 — The Invasion

**Files:**
- Modify: `ukraine.html`

**Step 1:** Build Section 6. This is the longest content section.

**Content must include:**
- Russia annexes Crimea (March 2014) — "little green men" (Russian soldiers without insignia) appeared overnight. A fake referendum was held. Russia declared Crimea part of Russia. The world condemned it but didn't stop it.
- War in Donbas begins (April 2014) — Russia-backed separatists seized government buildings in Donetsk and Luhansk. A war started that killed over 14,000 people by 2022.
- February 24, 2022: full-scale Russian invasion — 200,000+ troops from three directions. Largest military attack in Europe since WWII.
- Key moments:
  - Battle of Kyiv (Feb-March 2022) — Russia tried to take the capital in days. They failed. Ukrainian resistance was fierce. Zelenskyy refused to flee: "I need ammunition, not a ride."
  - Bucha massacre revealed (April 2022) — after Russian forces withdrew from suburbs of Kyiv, the world saw evidence of mass killings and torture of civilians
  - Siege of Mariupol / Azovstal (Feb-May 2022) — 80+ day siege. Ukrainian fighters held out in a massive steel plant. Eventually surrendered.
  - Kherson liberated (November 2022) — only regional capital recaptured by Ukraine
  - Zaporizhzhia nuclear plant — Europe's largest, occupied by Russia, ongoing safety concerns
- Stat grid: 200,000+ Russian troops, 14,000+ killed in Donbas war (2014-2022), largest European conflict since WWII
- Vocab: invasion, annexed, war crimes, sanctions
- Footnotes
- Quiz button

**Sources to cite:**
- BBC: Russia-Ukraine war timeline
- PBS NewsHour Classroom
- CFR: Ukraine conflict tracker
- Britannica: Russia-Ukraine war

**Step 2:** Commit.
```bash
git add ukraine.html
git commit -m "feat: add Section 6 — The Invasion"
```

---

## Task 9: Section 7 — Where We Are Now (2025-2026)

**Files:**
- Modify: `ukraine.html`

**Step 1:** Build Section 7. Search the web for current state of peace negotiations and war status as of March 2026.

**Content must include:**
- Current front lines (general description — approximate, since it changes)
- Peace negotiations: Search for latest on US/EU/UK-France frameworks, Abu Dhabi talks
- Territorial disputes: Donbas and Crimea remain the core obstacles
- The human cost:
  - Millions of Ukrainians displaced (search for latest UNHCR figure)
  - Infrastructure destruction
  - Children's education disrupted
- Global impact: grain exports disrupted, energy prices affected, NATO expansion (Finland and Sweden joined)
- "Think about it" callout: "What would a fair peace deal look like — and who gets to decide? Should Ukraine have to give up land that was taken by force?"
- Footnotes with current sources

**Sources:** Search web for latest reliable reporting on Ukraine peace talks, refugee numbers, and war status as of March 2026. Use BBC, Reuters, UNHCR, CFR.

**Step 2:** Commit.
```bash
git add ukraine.html
git commit -m "feat: add Section 7 — Where We Are Now"
```

---

## Task 10: Timeline (882-2026)

**Files:**
- Modify: `ukraine.html`

**Step 1:** Build vertical timeline using same tl-item/tl-dot/tl-content pattern. Color-code dots by era.

**Color scheme for dots:**
- Ancient/medieval (882-1240): `#6366f1` (indigo)
- Empire/Soviet (1552-1991): `#005BBB` (Ukrainian blue)
- Independence era (1991-2013): `#FFD500` (yellow)
- War (2014-2026): `#dc2626` (red)

**Timeline entries (17):**

| Year | Event | Dot Color |
|---|---|---|
| ~882 | Founding of Kievan Rus' — Viking/Slavic state centered on Kyiv | indigo |
| 1240 | Mongol invasion destroys Kyiv | indigo |
| 1552-1775 | Zaporizhzhian Sich — self-governing Cossack communities | indigo |
| 1783 | Russian Empire absorbs Crimea (Catherine the Great) | blue |
| 1917-1921 | Ukrainian People's Republic — brief independence, crushed by Bolsheviks | blue |
| 1932-1933 | Holodomor — Stalin's engineered famine kills 3.5-7 million | blue |
| 1941-1944 | WWII / Nazi occupation — ~7 million Ukrainian deaths | blue |
| 1986 | Chernobyl nuclear disaster | blue |
| 1991 | Ukrainian independence — 92% vote yes in referendum | yellow |
| 2004 | Orange Revolution — mass protests against election fraud | yellow |
| 2013-2014 | Euromaidan — Yanukovych flees, over 100 protesters killed | yellow |
| March 2014 | Russia annexes Crimea | red |
| April 2014 | War in Donbas begins — Russia-backed separatists | red |
| Feb 2022 | Full-scale Russian invasion — largest European conflict since WWII | red |
| April 2022 | Bucha massacre revealed | red |
| Nov 2022 | Kherson liberated — only regional capital recaptured | red |
| 2025-2026 | Peace negotiations ongoing — territorial disputes remain | red |

- Triple-click any timeline date → hidden bonus: "Ukraine in Culture" (Eurovision 2022 win, Shevchenko poetry, bandura instrument, cultural resistance)
- Each entry needs at least one footnote source
- Quiz button at key point

**Step 2:** Commit.
```bash
git add ukraine.html
git commit -m "feat: add Ukraine timeline (882-2026)"
```

---

## Task 11: Key People

**Files:**
- Modify: `ukraine.html`

**Step 1:** Build people-grid using same portrait-ring pattern as Iran/AI. Use downloaded images.

**People cards:**

| Person | Role | Key fact | Image |
|---|---|---|---|
| Volodymyr Zelenskyy | President of Ukraine | Former comedian and actor who became a wartime leader. Refused to flee Kyiv: "I need ammunition, not a ride." | `images/volodymyr-zelenskyy.jpg` |
| Vladimir Putin | President of Russia | Ordered the 2014 annexation of Crimea and the 2022 full-scale invasion. Claims Ukraine and Russia are "one people." | `images/vladimir-putin.jpg` |
| Taras Shevchenko | Poet & National Hero (1814-1861) | Wrote in Ukrainian when the Russian Empire banned the language. His poetry became a symbol of Ukrainian identity that endures today. | `images/taras-shevchenko.jpg` |
| Mykhailo Hrushevsky | First President of Ukraine (1917-1918) | Historian who led the Ukrainian People's Republic. Appears on Ukraine's 50 hryvnia banknote. | `images/mykhailo-hrushevsky.jpg` |

Each card needs a citation. Verify all role descriptions against Wikipedia/Britannica.

Hover all 4 portraits in sequence (left to right) → unlock "The Human Cost" easter egg with refugee statistics.

**Step 2:** Commit.
```bash
git add ukraine.html
git commit -m "feat: add Key People section with portraits"
```

---

## Task 12: Videos Section

**Files:**
- Modify: `ukraine.html`

**Step 1:** Build video grid. Search YouTube for exact video IDs and verify they work.

**Videos to embed:**
- Crash Course World History #20: "Russia, the Kievan Rus, and the Mongols" (search for ID)
- Crash Course European History #35: "Russian Revolution and Civil War" (search for ID)
- PBS NewsHour: Ukraine conflict explainer for students (search for best match)
- HREC or educational Holodomor video (search YouTube)

Use video-grid + video-wrap pattern from Iran/AI. Video tags (long/short).

Also link to Timothy Snyder's Yale playlist with an "Advanced" tag:
```html
<div class="callout c-gold">
  <span class="callout-icon">🎓</span>
  <div class="callout-body">
    <h4>Want to go deeper?</h4>
    <p>Professor Timothy Snyder's free Yale course "The Making of Modern Ukraine" is 23 lectures covering everything from Kievan Rus' to the 2022 invasion. It's college-level, but if you're up for a challenge, start with <a href="https://www.youtube.com/playlist?list=PLh9mgdi4rNewfxO7LhBoz_1Mx1MaO6sw_" target="_blank">Lecture 1</a>.</p>
  </div>
</div>
```

**Step 2:** Commit.
```bash
git add ukraine.html
git commit -m "feat: add Videos section"
```

---

## Task 13: Resources (Ranked Reading)

**Files:**
- Modify: `ukraine.html`

**Step 1:** Build resource-grid with difficulty-ranked cards. Same pattern as Iran/AI resources. Verify all URLs work.

**Easier:**
- Britannica Kids: Ukraine
- Britannica Kids: Russia-Ukraine War
- National Geographic Kids: Ukraine
- Ducksters: Ukraine Geography
- PBS NewsHour Classroom: Ukraine lessons

**Medium:**
- BBC: Ukraine coverage
- NPR: Ukraine explainers
- Facing History & Ourselves: Ukraine lesson plans
- Pulitzer Center: Contextualizing the Crisis in Ukraine
- HREC Education: Holodomor resources

**Harder:**
- CFR: Ukraine — Conflict at the Crossroads of Europe and Russia
- Timothy Snyder: "The Making of Modern Ukraine" (Yale, YouTube)
- Crash Course European History (relevant episodes)
- CFR Global Conflict Tracker: War in Ukraine

Color-coded tags by source type. Each card: tag, title, description, difficulty level.

**Step 2:** Commit.
```bash
git add ukraine.html
git commit -m "feat: add Resources section with ranked reading"
```

---

## Task 14: JavaScript — Quizzes, Points, Easter Eggs

**Files:**
- Modify: `ukraine.html`

**Step 1:** Add all JavaScript at the bottom of the page. Follow Iran/AI JS pattern but with Ukraine-themed content and UNIQUE easter egg triggers.

**Quiz questions (at least 6):**
1. After Section 1 (map): "Ukraine is the largest country entirely in which continent?" (Answer: Europe)
2. After Section 2 (ancient): "What medieval state was centered on the city of Kyiv?" (Answer: Kievan Rus')
3. After Section 3 (empire): "Why is the poet Taras Shevchenko so important to Ukrainians?" (Answer: He wrote in Ukrainian when the language was banned)
4. After Section 5 (Maidan): "What happened on Maidan square in 2013-2014?" (Answer: Hundreds of thousands protested, leading to the president fleeing)
5. After Section 6 (invasion): "What did Zelenskyy say when offered evacuation from Kyiv?" (Answer: "I need ammunition, not a ride")
6. After Timeline: "In what year did Ukraine vote for independence from the Soviet Union?" (Answer: 1991)

**Easter eggs (ALL DIFFERENT from Iran/AI):**

1. **Click 🇺🇦 hero emoji 7 times** → "Sunflower" modal:
   - Fun fact about sunflowers as Ukraine's national flower
   - The viral story: a Ukrainian woman told Russian soldiers "Put sunflower seeds in your pockets so flowers grow when you die here"
   - +1 point

2. **Type "UKRAINE" anywhere on the page** → "Hidden Hero" modal:
   - Taras Shevchenko poem excerpt in Ukrainian + English
   - Use his poem "Testament" (Заповіт) — "When I die, bury me / On a grave mound / Amid the wide-wide steppe / In my beloved Ukraine"
   - +1 point

3. **Triple-click any timeline date** → "Ukraine in Culture" modal:
   - Eurovision 2022 win (Kalush Orchestra, "Stefania")
   - Bandura — traditional Ukrainian stringed instrument
   - Vyshyvanka — embroidered shirts as symbols of identity
   - Cultural resistance during the war
   - +1 point

4. **Hover all 4 people portraits in left-to-right order** → "The Human Cost" modal:
   - Refugee statistics (search for latest UNHCR number)
   - Children's education disrupted
   - Stories of Ukrainian resilience
   - +1 point

**Also include:**
- Points system (0-10, same as Iran/AI)
- Dyslexic font toggle (same as Iran/AI, using localStorage)
- Toast notifications

**Implementation notes for unique triggers:**
- "Type UKRAINE": track keystrokes in sequence (like Konami but with letters U-K-R-A-I-N-E)
- "Triple-click timeline date": use `click` event with click-count tracking (3 clicks within 500ms)
- "Hover portraits in order": track `mouseenter` events on portrait elements, verify order matches left-to-right sequence

**Step 2:** Commit.
```bash
git add ukraine.html
git commit -m "feat: add quizzes, points system, and Ukraine-themed easter eggs"
```

---

## Task 15: Footer & Final Polish

**Files:**
- Modify: `ukraine.html`

**Step 1:** Add `</main>`, footer (same pattern as Iran/AI), and closing tags. Run through the full page and verify:
- All footnote links work (href matches id)
- All YouTube embeds load
- All images load (with onerror fallbacks)
- All external links open in new tabs
- Map loads and markers work
- Responsive layout works at mobile widths
- Dyslexic font toggle works
- Points system works
- All quizzes work
- All 4 easter eggs work (emoji clicks, type UKRAINE, triple-click date, hover portraits)

**Footer content:**
```html
<footer>
  <p>Made for 8th grade Social Studies students · All links go to trusted news and educational sources · Updated March 2026</p>
  <p style="margin-top:6px;font-size:.75rem">Images from Wikimedia Commons (public domain / CC-licensed) unless otherwise noted. This page is for educational purposes.</p>
  <p style="margin-top:10px;font-size:.78rem;background:#f0f0f0;display:inline-block;padding:8px 18px;border-radius:20px">
    🌐 <strong>Want to share this page?</strong> Host it free on
    <a href="https://pages.github.com" target="_blank" style="color:var(--blue)">GitHub Pages</a> ·
    <a href="https://app.netlify.com/drop" target="_blank" style="color:var(--blue)">Netlify Drop</a> · or
    <a href="https://sites.google.com" target="_blank" style="color:var(--blue)">Google Sites</a>
  </p>
  <p style="margin-top:6px;font-size:.75rem">💡 <strong>Teacher tip:</strong> Try typing a country name on this page...</p>
</footer>
```

**Step 2:** Commit.
```bash
git add ukraine.html
git commit -m "feat: complete Ukraine page with footer and polish"
```

---

## Task 16: Update Index Page

**Files:**
- Modify: `index.html`

**Step 1:** Update the index page:
- Change the Ukraine card from `coming-soon` to active (remove `.coming-soon` class, `soon-overlay`, change badge to "live")
- Make it a link to `ukraine.html`
- Add Ukraine to the sticky nav
- Update ticker headlines (add Ukraine-related headlines)
- Update the "coming soon" ticker entry to remove Ukraine

**Step 2:** Commit.
```bash
git add index.html
git commit -m "feat: update index page with live Ukraine link"
```

---

## Task 17: Final Review & Push

**Step 1:** Do a full read-through of `ukraine.html` checking:
- Every factual claim has a footnote
- Every footnote links to a reputable source
- No unsourced statistics
- Reading level is appropriate (5th-6th grade reading, 8th grade depth)
- No jargon pile-ups (max one new term per sentence)
- No broken links or images
- Map markers all have correct coordinates
- All 4 easter eggs use DIFFERENT triggers from Iran and AI pages

**Step 2:** Push everything.
```bash
git push
```

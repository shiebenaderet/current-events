# AI & Society Page — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a self-contained `ai.html` explainer page about artificial intelligence, following the same design system as `iran.html` but using the new "explainer template" format.

**Architecture:** Single self-contained HTML file with embedded CSS and JS. Reuses the same component classes as Iran (s-card, callouts, stat-grid, timeline, quiz system, people-grid, resource-grid) but with a blue/purple color palette and "Why This Matters Now" banner instead of breaking news. Wikipedia-style per-section footnotes.

**Tech Stack:** Plain HTML/CSS/JS, Leaflet not needed, Spotify embed iframes for podcasts, YouTube embeds for videos, Google Fonts (same set as Iran).

---

## Reference Files

- **Template to follow:** `/Users/shiebenaderet/Documents/GitHub/current-events/iran.html`
- **Design doc:** `/Users/shiebenaderet/Documents/GitHub/current-events/docs/plans/2026-03-08-ai-society-design.md`
- **Index page (update at end):** `/Users/shiebenaderet/Documents/GitHub/current-events/index.html`

## Podcast Embed URLs (Spotify)

| Podcast | Spotify Embed URL |
|---|---|
| Economist: AI Revolution Part 1 | `https://open.spotify.com/embed/episode/2IjlD4So4nUNiBEKAr1LWQ` |
| Economist: AI Revolution Part 2 | `https://open.spotify.com/embed/episode/03qqzrEdPlq8M9lBYnED1u` |
| Economist: AI Revolution Part 3 | `https://open.spotify.com/embed/episode/4adN2gVRkQctA55Q0xswiO` |
| Economist: AI Revolution Part 4 | `https://open.spotify.com/embed/episode/3fdapb2gIc8sfjGSlDqNWQ` |
| Economist: Geoffrey Hinton | `https://open.spotify.com/embed/episode/6VTTwWSdzwDAZsKy3I34YN` |
| Humane Tech: Talking With Animals | `https://open.spotify.com/embed/episode/2tCoKxrVVCUYhfi575XUID` |
| Humane Tech: Rethinking School | Search Spotify for exact ID — fallback to Apple Podcasts embed or humanetech.com link |

## Wikimedia Commons Images (CC-Licensed)

| Person | File | License |
|---|---|---|
| Alan Turing | `File:Alan Turing (1951) (crop).jpg` | Public domain |
| Geoffrey Hinton | `File:Geoffrey Hinton at 2024 Nobel Prize Conference 2.jpg` | CC-BY-4.0 |
| Fei-Fei Li | `File:Fei-Fei Li at AI for Good 2017.jpg` | CC-BY-2.0 |
| Yoshua Bengio | `File:Yoshua Bengio 2019 (cropped).jpg` | CC-BY-4.0 |
| Sam Altman | Emoji fallback 💼 (no CC images found in Commons category) | — |
| Timnit Gebru | `File:Timnit Gebru crop.jpg` | CC-BY-2.0 |
| Demis Hassabis | `File:Demis Hassabis Royal Society (3x4 cropped).jpg` | CC-BY-3.0 |

Download images to `images/` folder for local use. For Sam Altman, use the emoji fallback pattern already established in Iran's people grid.

---

## Task 1: Download Images & Create File Skeleton

**Files:**
- Create: `ai.html`
- Download to: `images/` (portrait images)

**Step 1:** Download portrait images from Wikimedia Commons to `images/` folder.

```bash
cd /Users/shiebenaderet/Documents/GitHub/current-events
# Turing
curl -sL "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Alan_Turing_%281951%29_%28crop%29.jpg/400px-Alan_Turing_%281951%29_%28crop%29.jpg" -o images/alan-turing.jpg
# Hinton
curl -sL "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Geoffrey_Hinton_at_2024_Nobel_Prize_Conference_2.jpg/400px-Geoffrey_Hinton_at_2024_Nobel_Prize_Conference_2.jpg" -o images/geoffrey-hinton.jpg
# Fei-Fei Li
curl -sL "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Fei-Fei_Li_at_AI_for_Good_2017.jpg/400px-Fei-Fei_Li_at_AI_for_Good_2017.jpg" -o images/fei-fei-li.jpg
# Yoshua Bengio
curl -sL "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Yoshua_Bengio_2019_%28cropped%29.jpg/400px-Yoshua_Bengio_2019_%28cropped%29.jpg" -o images/yoshua-bengio.jpg
# Timnit Gebru
curl -sL "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Timnit_Gebru_crop.jpg/400px-Timnit_Gebru_crop.jpg" -o images/timnit-gebru.jpg
# Demis Hassabis
curl -sL "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Demis_Hassabis_Royal_Society_%283x4_cropped%29.jpg/400px-Demis_Hassabis_Royal_Society_%283x4_cropped%29.jpg" -o images/demis-hassabis.jpg
```

**Step 2:** Create `ai.html` with the full `<head>`, CSS reset, variables, and all component styles. Use the Iran page as the template but change the color palette to blue/purple/amber. Include all component CSS: hero, points bar, banner, nav, s-card, callouts, stat-grid, vocab, timeline, quiz, people-grid, resource-grid, footnotes, focus boxes, toast, easter eggs, dyslexic toggle, responsive.

**Key CSS differences from Iran:**
- Hero gradient: `#0f172a → #1e1b4b` instead of mosque image
- Primary color: `#2563a8` (blue) instead of `#c0392b` (red)
- Accent: `#7c3aed` (purple)
- Highlight: `#f59e0b` (amber) instead of gold
- Banner: blue "Why This Matters Now" instead of red "BREAKING"
- Nav pills: blue/purple tones
- New CSS for `.footnotes` section at bottom of each s-card
- New CSS for `.podcast-embed` (Spotify iframe wrapper)

**New footnote CSS:**
```css
.footnotes{
  margin-top:20px;padding-top:14px;border-top:1px solid var(--border);
}
.footnotes ol{margin:0 0 0 20px;padding:0}
.footnotes li{font-size:.75rem;color:var(--mid);line-height:1.6;margin-bottom:4px}
.footnotes li a{color:var(--blue-l);font-weight:600}
sup.fn{font-size:.7rem;font-weight:700;color:var(--blue-l);cursor:pointer;margin:0 1px}
sup.fn a{color:var(--blue-l);text-decoration:none}
sup.fn a:hover{text-decoration:underline}
```

**New podcast embed CSS:**
```css
.podcast-embed{
  border-radius:12px;overflow:hidden;margin:14px 0;
  box-shadow:0 2px 10px rgba(0,0,0,.1);
}
.podcast-embed iframe{width:100%;border:none;border-radius:12px}
```

**Step 3:** Commit skeleton.

```bash
git add ai.html images/alan-turing.jpg images/geoffrey-hinton.jpg images/fei-fei-li.jpg images/yoshua-bengio.jpg images/timnit-gebru.jpg images/demis-hassabis.jpg
git commit -m "feat: add AI page skeleton with CSS and portrait images"
```

---

## Task 2: Hero, Banner, Points Bar, Nav

**Files:**
- Modify: `ai.html`

**Step 1:** Add the HTML body structure: easter egg modal, quiz modal, toast, hero section, points bar, "Why This Matters Now" banner, and sticky nav. Follow Iran's exact structure but with AI content.

**Hero content:**
- 🤖 emoji (clickable, id="heroEmoji")
- Title: "Understanding AI"
- Subtitle: "What it is, how it works, and why everyone's talking about it"
- Note: "📚 8th Grade Social Studies · March 2026 · Earn points by answering quizzes!"

**Banner content:**
- Blue background, "WHY THIS MATTERS NOW" badge
- Text: "Artificial intelligence is changing how we learn, work, create, and communicate — faster than almost anyone predicted. From chatbots writing essays to AI diagnosing diseases, this technology is reshaping everyday life. Understanding how it works is one of the most important things you can learn right now."

**Nav sections:**
- 🧠 What Is AI? · ⚡ How It Learns · 🚀 The Breakthrough · 💬 AI Today · 🏫 Focus: School · 🐋 Focus: Animals · ⚠️ Focus: Hinton · 📅 Timeline · 👥 Key People · 📺 Videos · 🔗 Resources

**Step 2:** Commit.

```bash
git add ai.html
git commit -m "feat: add AI page hero, banner, points bar, and nav"
```

---

## Task 3: Section 1 — What Is AI?

**Files:**
- Modify: `ai.html`

**Step 1:** Build Section 1 using s-card structure. Content focus: What AI actually is. Use Hinton's "neurons voting to go ping" explanation from the transcript. Explain the difference between AI and regular software.

**Content must include:**
- Callout: "This topic is constantly changing — check trusted sources for the latest."
- Hinton's explanation of neurons: brain cells "go ping," they vote, connection strengths change — that's learning
- Vocab: Artificial Intelligence, Neural Network, Algorithm
- Embedded Spotify player for Economist Part 1
- Quiz button (quiz about AI basics)
- Wikipedia-style footnotes at bottom of section

**Sources to verify and cite:**
- Hinton transcript (provided by user — use direct quotes)
- Economist Babbage Part 1 episode description
- Crash Course AI for supplementary definitions
- PBS/NPR for any additional claims

**Footnote format example:**
```html
<p>Brain cells sometimes "go ping," and other brain cells listen and vote on whether that cell should go ping.<sup class="fn"><a href="#s1-fn1" id="s1-ref1">[1]</a></sup></p>
...
<div class="footnotes">
  <ol>
    <li id="s1-fn1"><a href="#s1-ref1">^</a> Geoffrey Hinton, interview on <em>Babbage</em>, The Economist, March 12, 2025. <a href="https://shows.acast.com/theeconomistbabbage/episodes/geoffrey-hinton-ai-is-more-human-than-you-think" target="_blank">Link</a></li>
  </ol>
</div>
```

**Step 2:** Commit.

```bash
git add ai.html
git commit -m "feat: add Section 1 — What Is AI?"
```

---

## Task 4: Section 2 — How Does It Learn?

**Files:**
- Modify: `ai.html`

**Step 1:** Build Section 2. Content focus: How machines learn through neural networks, pattern matching, backpropagation.

**Content must include:**
- Hinton's "Paris - France + Italy = Rome" word vector example (from transcript)
- Hinton's "dogs are male, cats are female" analogy experiment (from transcript)
- Hinton's "She screamed him with the frying pan" — meaning from one example (from transcript)
- Backpropagation explained simply: "send signals backwards through the network to tell it how to change"
- Vocab: Backpropagation, Training Data, Pattern Recognition
- Embedded Spotify player for Economist Part 2
- Quiz button
- Footnotes

**Sources to verify and cite:**
- Hinton transcript (direct quotes)
- Economist Babbage Part 2 episode (machine learning, speech recognition, object recognition)
- Anil Ananthaswamy's "Why Machines Learn" (mentioned in Part 2)

**Step 2:** Commit.

```bash
git add ai.html
git commit -m "feat: add Section 2 — How Does It Learn?"
```

---

## Task 5: Section 3 — What Made It Take Off?

**Files:**
- Modify: `ai.html`

**Step 1:** Build Section 3. Content focus: The big data + GPU breakthrough, AlexNet 2012, Fei-Fei Li's ImageNet.

**Content must include:**
- AlexNet 2012 story from Hinton transcript: "two students, Alex Krizevsky and Ilya Sutskever... got about half the error rate of existing systems"
- The casino auction story: "$44 million... a senior VP at Google told me they were amazed they got it so cheaply"
- ImageNet and Fei-Fei Li's role (from Economist Part 3)
- GPUs: Krizevsky "managed to make Nvidia GPUs talk to each other" — compare to DeepSeek
- Stat grid: ImageNet images (14M+), AlexNet error rate reduction (~50%), Google acquisition price ($44M)
- Vocab: GPU, Dataset, Computer Vision
- Embedded Spotify player for Economist Part 3
- Quiz button
- Footnotes

**Sources to verify and cite:**
- Hinton transcript (direct quotes for AlexNet, auction)
- Economist Part 3 (Fei-Fei Li, datasets, hardware)
- Stanford HAI for ImageNet stats
- Verify: ImageNet had 14 million+ images — check original ImageNet paper or Stanford page

**Step 2:** Commit.

```bash
git add ai.html
git commit -m "feat: add Section 3 — What Made It Take Off?"
```

---

## Task 6: Section 4 — Where Is AI Now?

**Files:**
- Modify: `ai.html`

**Step 1:** Build Section 4. Content focus: ChatGPT, LLMs, generative AI, deepfakes — the current moment.

**Content must include:**
- Hinton's "little language model" from the 80s → today's LLMs
- The Continental Drift analogy from Hinton: "it was like that" — established researchers dismissing neural nets
- ChatGPT launch (Nov 2022) and rapid adoption
- DeepSeek and reasoning models (from Hinton: "they can produce strings of words that are their thinking")
- Hallucinations = confabulation: "most people have a completely wrong model of what memory is... you don't store any strings of words in your head"
- Stat grid: ChatGPT reached 100M users in 2 months (sourced), GPT-4 parameters (sourced), global AI market size (sourced)
- Vocab: Large Language Model (LLM), Generative AI, Hallucination/Confabulation
- Embedded Spotify player for Economist Part 4
- Quiz button
- Footnotes

**Sources to verify and cite:**
- Hinton transcript (direct quotes)
- Economist Part 4 (LLMs, deepfakes, generative AI)
- UBS/Reuters for ChatGPT 100M user stat
- Verify all statistics with primary sources before including

**Step 2:** Commit.

```bash
git add ai.html
git commit -m "feat: add Section 4 — Where Is AI Now?"
```

---

## Task 7: Focus Box — AI & Your School

**Files:**
- Modify: `ai.html`

**Step 1:** Build the Focus Box using dark-themed pane style (same as Iran's update pane). Content from Humane Tech episode 108.

**Content must include:**
- Embedded podcast player (Spotify or fallback to humanetech.com link)
- Key takeaways from Maryanne Wolf & Rebecca Winthrop:
  - Past tech in classrooms often failed (OECD study showed limited benefit of desktop computers)
  - Digital exposure affects attention and language development (JAMA study, Singapore research)
  - This moment is an opportunity: redesign schools around curiosity and human skills AI can't replicate
  - Human connection matters more than task completion
- "Think about it" callout: "Your generation is the first to go through school with AI tools that can write essays, summarize readings, and solve problems for you. Does using AI to do your homework help you learn — or does it skip the part where learning actually happens?"
- Footnotes with sources

**Sources to verify and cite:**
- Humane Tech episode page: https://www.humanetech.com/podcast/rethinking-school-in-the-age-of-ai
- OECD study on tech in classrooms (referenced in episode)
- JAMA study on screen time and language (referenced in episode)
- Linda Stone's "continuous partial attention" (referenced in episode)
- Byung-Chul Han "The Burnout Society" (referenced in episode)

**Step 2:** Commit.

```bash
git add ai.html
git commit -m "feat: add Focus Box — AI & Your School"
```

---

## Task 8: Focus Box — Talking to Animals Using AI

**Files:**
- Modify: `ai.html`

**Step 1:** Build Focus Box. Content from Humane Tech episode 67.

**Content must include:**
- Embedded Spotify player (episode ID: 2tCoKxrVVCUYhfi575XUID)
- Key takeaways from Aza Raskin / Earth Species Project:
  - Machine learning can decode patterns in animal communication
  - Within 12-36 months (from May 2023): synthesizing animal vocalizations indistinguishable from real ones
  - Applications: communicating with whales to prevent ship strikes, conservation
  - Ethical risks: poachers and ecotourism operators could exploit this
  - Gelada monkey vocalizations resemble human speech patterns
  - "Words and sounds that share connotations can also share shapes"
- "Think about it" callout: "If we could talk to animals, should we? What would it mean for conservation — and what could go wrong if the wrong people got access to this technology?"
- Footnotes

**Sources to verify and cite:**
- Humane Tech episode page: https://www.humanetech.com/podcast/talking-with-animals-using-ai
- Earth Species Project website for verification
- Nature/Science articles on animal communication AI if available

**Step 2:** Commit.

```bash
git add ai.html
git commit -m "feat: add Focus Box — Talking to Animals Using AI"
```

---

## Task 9: Focus Box — The Godfather's Warning (Geoffrey Hinton)

**Files:**
- Modify: `ai.html`

**Step 1:** Build Focus Box. Content from Hinton transcript.

**Content must include:**
- Embedded Spotify player (episode ID: 6VTTwWSdzwDAZsKy3I34YN)
- Career arc narrative: wanted to understand the brain → decades of dismissed work → AlexNet → Google → resigned → Nobel Prize
- Key quotes (verified from transcript):
  - On being dismissed: "It felt validating. It feels like all those years of doing something that people thought was nonsense were okay."
  - On hallucinations: "What that tells us is they're even more like us than we thought."
  - On memory: "You don't store any strings of words in your head... you make it up."
  - The cucumber experiment: hearing a faint word better after someone said it 5 minutes earlier
  - On safety: "It's probably 1% goes into safety... governments need to force them to work on safety."
  - On the future: "I sort of believe both those things are quite plausible" (AI solving problems AND AI taking over)
- Stat grid: Nobel Prize 2024, 40+ years of research, $44M Google acquisition
- "Think about it" callout: "Geoffrey Hinton helped create the technology behind modern AI — and then quit his job to warn people about it. When is it an inventor's responsibility to speak up about the risks of what they've built?"
- Footnotes

**Sources:** All quotes from user-provided transcript. Verify Nobel Prize details against nobelprize.org.

**Step 2:** Commit.

```bash
git add ai.html
git commit -m "feat: add Focus Box — The Godfather's Warning"
```

---

## Task 10: Timeline

**Files:**
- Modify: `ai.html`

**Step 1:** Build vertical timeline using same tl-item/tl-dot/tl-content pattern as Iran page. Color-code dots by era.

**Timeline entries (verify each date with a source):**

| Year | Event | Verify with |
|---|---|---|
| 1950 | Turing publishes "Computing Machinery and Intelligence" | Stanford Encyclopedia of Philosophy |
| 1957 | Frank Rosenblatt builds the Perceptron | Smithsonian / Cornell archives |
| 1969 | Minsky & Papert publish "Perceptrons" — first AI winter begins | MIT Press |
| 1986 | Hinton, Rumelhart & Williams publish backpropagation paper | Nature (1986) |
| 1997 | IBM Deep Blue beats world chess champion Garry Kasparov | IBM archives |
| 2009 | Neural nets beat standard speech recognition (Hinton's team) | Hinton transcript |
| 2011 | IBM Watson wins Jeopardy! | IBM / PBS |
| 2012 | AlexNet wins ImageNet — "the big bang of deep learning" | Hinton transcript / Stanford |
| 2013 | Hinton sells company to Google for $44M | Hinton transcript |
| 2014 | Ian Goodfellow invents GANs | Original paper |
| 2016 | DeepMind's AlphaGo beats world Go champion Lee Sedol | Nature / DeepMind |
| 2017 | Google publishes "Attention Is All You Need" — Transformer architecture | arXiv paper |
| 2020 | OpenAI releases GPT-3 | OpenAI blog |
| 2022 | ChatGPT launches — reaches 100M users in 2 months | UBS/Reuters |
| 2023 | GPT-4, Gemini, open-source LLMs, Humane Tech warns about AI | Multiple |
| 2024 | Hinton & Hopfield win Nobel Prize in Physics; Hassabis wins Chemistry Nobel | nobelprize.org |
| 2025 | DeepSeek, reasoning models, AI regulation debates | Multiple |
| 2026 | AI in schools, workplaces, and policy — the conversation continues | Current events |

- Double-click timeline line → hidden bonus: "AI in Pop Culture" (HAL 9000, Terminator, Ex Machina, Her, Wall-E)
- Quiz buttons at key points
- Each entry needs at least one footnote source

**Step 2:** Commit.

```bash
git add ai.html
git commit -m "feat: add AI timeline (1950-2026)"
```

---

## Task 11: Key People

**Files:**
- Modify: `ai.html`

**Step 1:** Build people-grid using same portrait-ring pattern as Iran. Use downloaded images.

**People cards:**

| Person | Role | Key fact | Image |
|---|---|---|---|
| Alan Turing | Father of Computer Science | Created the concept of a "universal machine" and the Turing Test (1950) | `images/alan-turing.jpg` |
| Geoffrey Hinton | "Godfather of AI" | Pioneered backpropagation & deep learning. Won 2024 Nobel Prize in Physics. | `images/geoffrey-hinton.jpg` |
| Fei-Fei Li | Computer Vision Pioneer | Created ImageNet — the massive dataset that proved neural networks could see. | `images/fei-fei-li.jpg` |
| Yoshua Bengio | Deep Learning Pioneer | Helped develop foundational ideas behind language models. Won 2018 Turing Award. | `images/yoshua-bengio.jpg` |
| Sam Altman | CEO of OpenAI | Leads the company behind ChatGPT, the AI tool that brought AI to the mainstream. | Emoji fallback 💼 |
| Timnit Gebru | AI Ethics Researcher | Studies bias and fairness in AI systems. Founded DAIR Institute after leaving Google. | `images/timnit-gebru.jpg` |
| Demis Hassabis | DeepMind Founder | Built AlphaGo and AlphaFold. Won 2024 Nobel Prize in Chemistry. | `images/demis-hassabis.jpg` |

Each card needs a citation. Verify all role descriptions against Wikipedia/university pages.

**Step 2:** Commit.

```bash
git add ai.html
git commit -m "feat: add Key People section with portraits"
```

---

## Task 12: Videos & Podcasts Section

**Files:**
- Modify: `ai.html`

**Step 1:** Build video/podcast grid. Include:

**YouTube videos (search for student-appropriate, verify URLs work):**
- Crash Course AI #1: What is AI?
- PBS/NPR explainers on AI for students
- 3Blue1Brown neural network explanation (if age-appropriate)
- TED-Ed on how AI learns

**Podcast embeds (all 7):**
- Economist Parts 1-4
- Economist Hinton interview
- Humane Tech: School
- Humane Tech: Animals

Use video-grid + video-wrap pattern from Iran. Podcast embeds use Spotify iframe (height 152px for compact, 352px for full).

**Step 2:** Commit.

```bash
git add ai.html
git commit -m "feat: add Videos & Podcasts section"
```

---

## Task 13: Resources (Ranked Reading)

**Files:**
- Modify: `ai.html`

**Step 1:** Build resource-grid with difficulty-ranked cards. Same pattern as Iran's resources.

**Resources to include (verify all URLs work):**

⭐ Easier:
- Crash Course AI (YouTube series)
- PBS NewsHour Classroom: AI lessons
- Code.org AI module
- Google "AI Experiments" interactive

⭐⭐ Medium:
- NPR: AI explainers
- BBC: AI coverage
- Vox: AI explained
- Center for Humane Technology podcast

⭐⭐⭐ Harder:
- The Economist: AI coverage
- Stanford HAI: AI Index Report
- MIT Technology Review: AI section
- 3Blue1Brown: Neural Networks (YouTube)

Color-coded tags by source type. Each card: tag, title, description, difficulty level.

**Step 2:** Commit.

```bash
git add ai.html
git commit -m "feat: add Resources section with ranked reading"
```

---

## Task 14: JavaScript — Quizzes, Points, Easter Eggs

**Files:**
- Modify: `ai.html`

**Step 1:** Add all JavaScript at the bottom of the page. Follow Iran's JS pattern exactly but with AI-themed content.

**Quiz questions (at least 5):**
1. After Section 1: "What is an artificial neural network inspired by?" (Answer: The human brain)
2. After Section 2: "In Hinton's example, what do you get when you take the pattern for 'Paris,' subtract 'France,' and add 'Italy'?" (Answer: Rome)
3. After Section 3: "What 2012 system proved neural networks could recognize images better than other AI?" (Answer: AlexNet)
4. After Section 4: "How quickly did ChatGPT reach 100 million users?" (Answer: About 2 months)
5. After Timeline: "What year did Geoffrey Hinton win the Nobel Prize in Physics?" (Answer: 2024)

**Easter eggs:**
1. Click 🤖 hero emoji 5 times → Modal: "01001000 01101001" ("Hi" in binary) + fun fact about binary
2. Konami code → "Turing Test" modal: "Can you tell if this paragraph was written by AI or a human?" + reveal
3. Double-click timeline line → Hidden section: AI in Pop Culture (HAL 9000, Terminator, Her, Wall-E)
4. Click all stat boxes in Section 4 → Unlock bonus about AI capabilities

**Also include:**
- Points system (0-10, same as Iran)
- Unlock boxes at 5pts and 10pts
- Dyslexic font toggle (same as Iran, using localStorage)
- Toast notifications

**Step 2:** Commit.

```bash
git add ai.html
git commit -m "feat: add quizzes, points system, and AI-themed easter eggs"
```

---

## Task 15: Footer & Final Polish

**Files:**
- Modify: `ai.html`

**Step 1:** Add footer (same pattern as Iran). Run through the full page and verify:
- All footnote links work (href matches id)
- All Spotify embeds load
- All images load (with onerror fallbacks)
- All external links open in new tabs
- Responsive layout works at mobile widths
- Dyslexic font toggle works
- Points system works
- All quizzes work
- Easter eggs work

**Step 2:** Commit.

```bash
git add ai.html
git commit -m "feat: complete AI page with footer and polish"
```

---

## Task 16: Update Index Page

**Files:**
- Modify: `index.html`

**Step 1:** Update the index page:
- Change the AI card from "coming-soon" to active (remove `.coming-soon` class, `soon-overlay`, change badge to "live")
- Add a link to `ai.html` in the card
- Add `ai.html` to the sticky nav
- Add AI headlines to the ticker
- Update the "Featured Story" if desired (or keep Iran as featured and add AI as second)

**Step 2:** Commit.

```bash
git add index.html
git commit -m "feat: update index page with live AI & Society link"
```

---

## Task 17: Final Review & Push

**Step 1:** Do a full read-through of `ai.html` checking:
- Every factual claim has a footnote
- Every footnote links to a reputable source
- No unsourced statistics
- Reading level is appropriate (5th-6th grade reading, 8th grade depth)
- No broken links or images

**Step 2:** Push everything.

```bash
git push
```

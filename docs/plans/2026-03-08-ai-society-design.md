# AI & Society Page — Design Document

**Date:** March 8, 2026
**Template type:** Explainer (reusable for immigration, elections, taxes, etc.)
**File:** `ai.html` (single self-contained HTML, no build tools)

---

## Concept

An interactive explainer page about artificial intelligence for 8th graders. Unlike the Iran page (crisis template with breaking news), this uses the **explainer template** — a calmer "explore a current topic" format suitable for ongoing trends rather than active conflicts.

The page backbone comes from The Economist's 4-part "Science That Built the AI Revolution" podcast series, supplemented by a Geoffrey Hinton interview (Economist) and two Center for Humane Technology episodes (AI & School, AI & Animals).

---

## Color Palette

| Role | Color | Hex |
|---|---|---|
| Primary (headers, nav, links) | Bright blue | `#2563a8` |
| Accent (quizzes, easter eggs, focus boxes) | Purple | `#7c3aed` |
| Highlights, stats, gold accents | Amber | `#f59e0b` |
| Hero background | Dark gradient | `#0f172a → #1e1b4b` |
| Body background | Cream | `#fdf6ec` (same as Iran) |

Blue/purple signals "technology/futuristic" vs Iran's warm red/gold/green.

---

## Banner Style

Replace the pulsing red "BREAKING" banner with a **"Why This Matters Now"** strip:
- Blue background instead of red
- No pulse animation — calmer but still prominent
- Short hook text + link to content
- Reusable across all explainer-template pages

---

## Page Structure

### 1. "Why This Matters Now" Banner
- Blue background, white text
- Hook: "AI is changing school, work, art, and science — and it's happening faster than anyone expected."
- Link to scroll down

### 2. Hero Section
- Dark gradient background (`#0f172a → #1e1b4b`), digital/tech feel
- 🤖 emoji (clickable for easter egg)
- Title: "Understanding AI"
- Subtitle: "What it is, how it works, and why everyone's talking about it"
- Meta: "8th Grade Social Studies · March 2026 · Earn points by answering quizzes!"

### 3. Points Bar
- Same gamification system as Iran (0–10 pts, progress bar, unlock hints)

### 4. Sticky Nav
- Blue/purple pill buttons (same pattern as Iran, different colors)
- Sections: Right Now · How It Works · The Breakthrough · Focus: School · Focus: Animals · Focus: Hinton · Timeline · People · Videos · Resources

### 5. Section 1: What Is AI?
- **Question:** "What actually IS artificial intelligence?"
- Content from Economist Part 1 + Hinton transcript
- Hinton's "neurons voting to go ping" explanation
- Vocab boxes: neural network, algorithm, artificial intelligence
- Embedded Economist Part 1 podcast player
- Inline citations on every fact
- Quiz button
- Hidden unlock section

### 6. Section 2: How Does It Learn?
- **Question:** "How does a machine actually learn things?"
- Content from Economist Part 2 + Hinton transcript
- "Paris - France + Italy = Rome" word vector example
- "Dogs are male, cats are female" analogy experiment
- "She screamed him with the frying pan" — meaning from context
- Backpropagation explained simply
- Embedded Economist Part 2 podcast player
- Inline citations
- Quiz button

### 7. Section 3: What Made It Take Off?
- **Question:** "What suddenly made AI so powerful?"
- Content from Economist Part 3 + Hinton transcript
- AlexNet 2012 — the big bang moment
- Big data + GPUs + the internet
- The casino auction story ($44M → "amazed they got it so cheaply")
- Fei-Fei Li's ImageNet
- Embedded Economist Part 3 podcast player
- Inline citations
- Quiz button

### 8. Section 4: Where Is AI Now?
- **Question:** "Where is AI today — and what can it do?"
- Content from Economist Part 4
- ChatGPT, LLMs, generative AI, deepfakes
- Stat grid: ChatGPT users, training costs, etc. (sourced figures)
- Continental drift analogy (from Hinton transcript)
- Embedded Economist Part 4 podcast player
- Inline citations
- Quiz button

### 9. Focus Box: AI & Your School
- **Dark-themed pane** (same style as Iran's 1-week update)
- Embedded Humane Tech podcast player (episode 108)
- Key takeaways from Maryanne Wolf & Rebecca Winthrop:
  - Past tech in classrooms often failed to improve outcomes (OECD data)
  - Digital exposure affects attention and language development
  - Opportunity to redesign schools around skills AI can't replicate
  - Human connection matters more than task completion
- "Think about it" discussion question
- Collapsible sources section

### 10. Focus Box: Talking to Animals Using AI
- **Dark-themed pane**
- Embedded Humane Tech podcast player (episode 67)
- Key takeaways from Aza Raskin / Earth Species Project:
  - AI decoding whale, monkey, and other animal communication
  - Within 12-36 months (from 2023): synthesizing animal vocalizations
  - Conservation applications (preventing ship strikes on whales)
  - Ethical risks (poachers, ecotourism manipulation)
- "Think about it" discussion question
- Collapsible sources section

### 11. Focus Box: The Godfather's Warning (Geoffrey Hinton)
- **Dark-themed pane**
- Embedded Economist podcast player (March 2025 interview)
- Key highlights from the transcript:
  - Career arc: ignored researcher → Nobel laureate → resigned from Google
  - "Hallucinations mean AI is even more like us than we thought"
  - The cucumber experiment (short-term memory)
  - "It's probably 1% goes into safety"
  - Best case (better healthcare, education) vs worst case (autonomous weapons, AI takeover)
- "Think about it" discussion question
- Collapsible sources section

### 12. Timeline
- Same vertical timeline style as Iran page
- Color-coded dots by era
- Key dates:
  - 1950: Turing's "Computing Machinery and Intelligence"
  - 1957: Perceptron (first artificial neural network)
  - 1980s: Backpropagation (Hinton, Rumelhart, Williams)
  - 1997: Deep Blue beats Kasparov at chess
  - 2011: IBM Watson wins Jeopardy!
  - 2012: AlexNet wins ImageNet competition
  - 2014: GANs (Goodfellow) — AI generates images
  - 2016: AlphaGo beats world Go champion
  - 2017: "Attention Is All You Need" — Transformer architecture
  - 2020: GPT-3 released
  - 2022: ChatGPT launches — AI goes mainstream
  - 2023: GPT-4, Gemini, open source LLMs explode
  - 2024: Hinton wins Nobel Prize in Physics
  - 2025: DeepSeek, reasoning models, AI regulation debates
  - 2026: Current state — AI in schools, workplaces, policy
- Each entry sourced with links
- Quiz buttons at key points
- Double-click timeline line → hidden bonus about AI in movies/pop culture

### 13. Key People
- Same portrait-ring grid as Iran page
- CC-licensed Wikimedia Commons images
- People:
  - **Alan Turing** — Father of computer science, the Turing Test
  - **Geoffrey Hinton** — Godfather of AI, Nobel laureate, backpropagation
  - **Fei-Fei Li** — ImageNet creator, computer vision pioneer
  - **Yoshua Bengio** — Deep learning pioneer, AI safety advocate
  - **Sam Altman** — CEO of OpenAI, ChatGPT
  - **Timnit Gebru** — AI ethics researcher, bias in AI
  - **Demis Hassabis** — DeepMind founder, AlphaFold
- Each card: portrait, name, role, 2-3 sentence description, source citation

### 14. Videos & Podcasts
- Embedded YouTube videos curated for 8th graders
- All podcast players embedded (Economist 4-part series, Hinton interview, 2 Humane Tech episodes)
- Video tags (long/short) like Iran page
- Thinking prompts callout

### 15. Resources (Ranked Reading)
- Same resource grid as Iran page with difficulty stars
- ⭐ Easier reading (PBS, Crash Course, Nat Geo Kids-level)
- ⭐⭐ Medium (NPR, BBC, NYT explainers)
- ⭐⭐⭐ Harder (Economist, academic sources, original papers)
- Color-coded tags by source
- Each card: source tag, title, description, difficulty level

---

## Easter Eggs (AI-themed)

| Trigger | Reward |
|---|---|
| Click 🤖 hero emoji 5 times | "Binary" easter egg modal — fun fact in binary |
| Konami code (↑↑↓↓←→←→BA) | "Turing Test" modal — can you tell if this text was written by AI? |
| Double-click timeline line | Hidden bonus: AI in movies & pop culture |
| Click all stat boxes in Section 4 | Unlock bonus content about AI capabilities |

---

## Sourcing Standards

- **Wikipedia-style footnotes:** Numbered superscript references in the text (e.g., `^[1]^`), with a numbered footnotes list at the bottom of each section card. Per-section, not page-bottom, so sources stay close to the content they support.
- **Every factual claim** gets a footnote reference
- **Preferred sources:** peer-reviewed research, PBS, NPR, BBC, Economist, Crash Course, university sources, Wikimedia Commons
- **No unsourced statistics or claims**
- **All images** from Wikimedia Commons (CC-licensed or public domain)
- **Podcast content** verified against transcripts and show notes
- **Focus Boxes** also use per-section footnotes
- **This footnote style should also be retrofitted to the Iran page** for consistency

---

## Reusability (Explainer Template)

This page establishes the **explainer template** distinct from the Iran crisis template:
- "Why This Matters Now" banner (blue, not red)
- Focus Boxes for deep dives into subtopics
- Embedded podcast/video players throughout
- Same design system (s-card, callouts, stat-grid, timeline, quiz, people-grid, resource-grid)
- Same gamification JS (points, quizzes, easter eggs)
- Same accessibility features (OpenDyslexic toggle, responsive design)

Future topics using this template: Immigration, Taxes, Elections, Climate Change.

---

## Podcast Sources

| Podcast | Episodes | Role |
|---|---|---|
| Economist Babbage: "The Science That Built the AI Revolution" | Parts 1-4 (Mar 2024) | Core history/science backbone |
| Economist Babbage: "Geoffrey Hinton: AI Is More Human Than You Think" | Mar 12, 2025 | Focus Box: The Godfather's Warning |
| Humane Tech: "Rethinking School in the Age of AI" | Ep 108, Apr 21, 2025 | Focus Box: AI & Your School |
| Humane Tech: "Talking With Animals Using AI" | Ep 67, May 4, 2023 | Focus Box: AI for Good? |

# 🌍 Mr. B's Current Events

**Free, student-friendly explainers on world events — built for middle schoolers.**

Live site: [current.mrbsocialstudies.org](https://current.mrbsocialstudies.org)  
Made by: Shie Benaderet, 8th Grade Social Studies, Alderwood Middle School

---

## What is this?

This is a collection of student-facing HTML pages that explain major current events in accessible language for middle schoolers — especially students who read below grade level, have IEPs, or are multilingual learners.

Each topic page includes:
- 🗺️ **Interactive maps** (Leaflet.js, no API key needed)
- 📅 **Visual timelines** with images and source citations
- 🧠 **Embedded quizzes** with a points/unlock system
- 🥚 **Easter eggs** to reward curious students
- 📺 **Embedded YouTube videos**
- 📖 **Source citations on every fact**, linked to the original article
- 📰 **Curated resource links** organized by reading level

Everything is a single self-contained `.html` file. No build tools, no frameworks, no server required.

---

## Topics

| Topic | Status | Folder |
|---|---|---|
| 🇮🇷 Understanding Iran | ✅ Live | `iran/` |
| 🇺🇦 The War in Ukraine | 🚧 Planned | — |
| 🤖 AI & Society | 🚧 Planned | — |
| 🌍 Climate Change | 🚧 Planned | — |
| 🗽 Immigration & U.S. Policy | 🚧 Planned | — |

---

## File Structure

```
current-events/
│
├── index.html          ← Landing page / topic hub
├── CNAME               ← custom domain: current.mrbsocialstudies.org
├── README.md           ← this file
├── LICENSE             ← CC BY 4.0
│
└── iran/
    └── index.html      ← Iran topic page (self-contained)
```

Each future topic gets its own folder with its own `index.html`.

---

## How to Use This in Your Classroom

**Option 1 — Just link to it:**  
Share `current.mrbsocialstudies.org/iran` with students via Canvas, Google Classroom, Schoology, or a link in an email. Everything works in any modern browser including Chromebooks.

**Option 2 — Embed it:**  
If your district allows external iframes in your LMS:
```html
<iframe src="https://current.mrbsocialstudies.org/iran" width="100%" height="800px" style="border:none"></iframe>
```

**Option 3 — Download and host it yourself:**  
Each page is a single `.html` file. Download it, rename it, modify it, host it wherever you want. No attribution required (but appreciated!).

---

## Contributing

Pull requests are very welcome — especially from other Social Studies teachers who want to:
- Add a new topic page
- Fix an outdated fact or broken link
- Improve accessibility
- Translate content for multilingual learners
- Add sources in additional languages

**To suggest a topic or report an issue:** [Open a GitHub Issue](https://github.com/shiebenaderet/current-events/issues/new)

### Contribution guidelines
- Each topic should be a single self-contained `.html` file in its own folder
- Write for a reading level of approximately **5th–6th grade** (but content depth of 8th grade)
- Every factual claim should have an inline source citation linked to the original article
- Prefer sources that are free to access (no paywalls)
- Images should be from Wikimedia Commons (CC-licensed or public domain) or original

---

## License

[Creative Commons Attribution 4.0 (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/)

You are free to share and adapt this material for any purpose, including commercial use, as long as you give appropriate credit.

---

## Related Projects

- [socialstudies8](https://github.com/shiebenaderet/socialstudies8) — Main 8th grade American history curriculum site
- [American Yawp Jr.](https://github.com/shiebenaderet/socialstudies8) — Free middle school adaptation of college-level U.S. history content

---

*Built with plain HTML, CSS, and vanilla JavaScript. No frameworks, no dependencies, no build step. Hosted free on GitHub Pages.*

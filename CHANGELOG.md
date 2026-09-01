# Changelog

All notable changes to this site are documented here. Versioning follows the scheme in `README.md`'s **Versioning** section (site-wide `MAJOR.MINOR.PATCH`, bumped once per finished effort — see that section for what qualifies as each level).

## [4.13.0] — 2026-08-31

**Minor — the three uncredited homepage images are properly sourced, and the count of uncredited images was wrong.**

`ai-card.jpg`, `capitol-featured.jpg` and `ukraine-card.jpg` had no attribution recoverable from the repo, from git history, or from the files' own EXIF, XMP, IPTC and comment segments — checked, not assumed. All three are replaced with Wikimedia Commons images whose **licence and author were re-read from the Commons API at fetch time**, so the credit line states what the API says rather than what a search result said a moment earlier:

| | image | credit |
|---|---|---|
| `capitol-featured.jpg` | U.S. Capitol west front | Beethoven, CC BY-SA 4.0 |
| `ukraine-card.jpg` | Independence Square, Kyiv | Anosmia, CC BY 2.0 |
| `ai-card.jpg` | Data centre server room | BalticServers.com, CC BY-SA 3.0 |

Credits sit in the homepage footer, not on the cards: a card image lives inside `<a class="tier-card">`, so a credit link within the card would be a nested `<a>` — invalid, and it would break the card as a link. `.img-credit` styling went into `site.css`, muted but selectable, linked, and above the AA contrast floor, because a credit nobody can read is not a credit.

The AI card's alt text changed with the image. It read *"Artificial intelligence concept"* and now describes what is actually in the photo — rows of servers, the kind of room AI runs in, which is also a truer thing to show a student than an abstraction.

Total homepage image weight fell from 663 KB to 557 KB.

### The count was wrong, and this is the third time this check has been

I have now reported the number of uncredited images on this site three times and been wrong twice.

- **v1 of the check** searched *forward* from each `<img>` and reported **28 uncredited**. On this site a credit sits at the END of its block, so every forward search ran past its own credit into the next person's entry. All 28 were fine. I called that finding "the most serious of the audit" before correcting it.
- **In correcting it** I said all 23 portraits carry author, licence and a Commons link. **That was also wrong.** Seven of the ai.html portraits carry `We could not confirm exactly where this photo came from` — an honest disclosure someone had already written, and not a credit.
- **v2 of the check** matched local filenames against Commons filenames and reported 9. Seven were false: `card-wa-capitol.jpg` is credited as `Washington_State_Capitol_Legislative_Building.jpg`, and no string-similarity rule connects those without also connecting things that must not be connected.

`tools/check_image_credits.py` is now written to read only what the page states, in a window that stops at the next `<img>` so an image can never inherit its neighbour's credit — the exact overrun behind v1. It reports three states, and the middle one is the reason it is worth having:

```
83 image(s): 67 credited · 7 disclosed-unknown · 9 silent
```

**Nine images state no source anywhere**: `claude-lorius`, `early-computer`, `immigrants-statue-of-liberty-1887`, `khamenei`, `neil-armstrong`, `rumi`, `soleimani`, `space-race-card`, `yuri-gagarin`. That is the real backlog, and it is six more than previously recorded. The seven disclosed-unknown are counted separately on purpose: lumping an honest disclosure in with an image nobody ever examined loses the distinction that decides what to do about each.

The lesson, recorded in the playbook: **a check that infers a relationship will invent one.** Both wrong versions guessed — at proximity, then at filenames. The version that works only reports what is written down.

## [4.12.0] — 2026-08-31

**Minor — repo documentation brought up to date, and a screen-reader defect it turned up.**

**README described a site that stopped existing in v4.0.0.** Its version line read v3.2.0 against a live v4.11.0, and its state paragraph was written append-only — a sentence per release — so it went stale every release and had simply stopped being updated. It is now a description of the site as it stands, which only changes when the site's shape does.

Three real gaps closed. **The card model was documented nowhere**: a contributor reading the README would picture a long scrolling article, which has not been true since v4.0.0. There is now a *How a page is built* section showing the primer/tile structure, the "an open card is the whole view" rule, deep links, and the one that matters most — *the 5–7 minutes is a property of the entry point, not a ceiling on the topic; a request to make a page shorter means add a shorter door, never delete rooms.* **`tools/` appeared in no file listing** despite being eight scripts and seven test files that gate every release; there is now a *Checks* section with the exact commands. **Nothing said that bumping `VERSION` without running `stamp_version.py` ships a footer still claiming the old build** — which is precisely how a browser cache once got misdiagnosed as a failed deploy.

`docs/PLAYBOOK.md` gained a section on the homepage (name each topic once; nothing above the fold moves), refreshed *Known gaps* from v4.2.0 to now, and three rules that each cost something to learn.

### The defect the documentation pass found

Writing the *Checks* section meant running every tool to confirm it did what I was about to claim. `verify_invariants.py` — which I had documented wrongly as a standalone gate when it is actually a diff against a git ref — reported **duplicate ids in `gun-violence.html` and `iran.html`**.

Not a cosmetic validity issue. Five ids were each claimed by two different terms, and both terms carried `aria-describedby` pointing at them. An idref resolves to the **first** matching element, so a screen reader announced **"silencers" with the definition of "background check"**, and "federally licensed dealers" with the definition of "militia". A confidently wrong definition is worse than no definition, and it lands on exactly the students the glosses exist for.

The cause: `spread_glosses.py` opened with `next_id = 9000`, commented *"far above any existing term-desc id"* — true the first time it ran and false every time after. A later run restarted the counter and reissued ids the earlier run had already placed.

Fixed in three places, because fixing only one would have left the trap armed:
- **The pages** — five glosses renumbered, each term now paired with its own definition.
- **The tool** — the counter now starts at `max(existing) + 1` *on that page*, so it cannot collide with its own previous output however many times it runs.
- **The suite** — `tools/ids.test.js` asserts no page declares an id twice, that every `aria-describedby` resolves to exactly one element, and that a term and its definition agree on the id. Verified as a real gate by running the assertions against the pre-fix pages out of git: four fire. **136 → 139 tests.**

Worth recording that 136 tests and every content gate passed while a screen reader was reading the wrong definition aloud. What found it was running a tool in order to describe it accurately.

## [4.11.0] — 2026-08-31

**Minor — the homepage stops asking students to choose 34 times before they read anything.**

**The front door presented the same eight topics three times.** A sticky `.section-nav` listed them, a scrolling ticker listed them again, and then the cards listed them a third time — with GitHub linked four times and the school site three, all above the first paragraph a student would actually read. Counting every link, button and control on the page: **34 clickable choices**.

**The nav is gone.** The cards one screen below *are* the navigation, so the nav was a duplicate of them with a third copy in between. It was also the last `.section-nav` on the site — v4.0.0 removed that markup from all eight topic pages and left `index.html` behind — so this finishes a migration rather than starting one. `tools/find_dead_css.py` then removed the six rules (`.gh`, `.section-nav`, `.suggest-alt`) that could no longer match.

**The ticker stopped moving but kept its headlines.** They are the one thing on the page that says *this was updated recently*, so the content stays as a static strip. Infinite-scrolling text is hard to read for exactly the students this site is for, it cannot be paused from the keyboard, and it was motion sitting above the fold competing with the lead story. It now shows four headlines rather than eight: a freshness signal, not a second navigation. The last two entries were dropped from the array outright, because "Suggest the next topic" and "contribute on GitHub" are not headlines — they are links that already exist further down the page.

**Teacher and developer links moved to the footer,** where someone looking for them will look and a student will not trip over them.

**34 clickable choices → 21.** Words on the page 692 → 666; the eight topics are now named once each.

**Also: three undated `now`s, dated.** `check_voice.py` was flagging them and they were real. Iran's *"the two sides are now shooting at each other again"* sat inside a timeline entry headed *Jul 6–8* — an anchor a reader who opens that card alone never sees; it now says *"by July 8 the two sides were shooting at each other again,"* which also stops the sentence rotting. Ukraine's *"these areas are now part of Russia"* never meant *at the time you are reading* — it meant *since the annexations*, and now says which and when. AI's was contrastive rather than a news claim, so it names the era instead.

### One thing worth writing down

Removing `@keyframes ticker{0%{...}100%{...}}` with `@keyframes ticker\{[^}]*\}` stopped at the **first** `}` — the one closing `0%{...}` — and left `100%{transform:translateX(-50%)}}` orphaned in the stylesheet as a rule with no selector. A brace-balance check on the inline `<style>` caught it immediately. `[^}]*` cannot match a nested block, and every at-rule (`@keyframes`, `@media`, `@supports`) contains one. This is the same shape as the `<img\b[^>]*>` bug in 4.10.0: a character-class-until-delimiter pattern applied to something that nests.

## [4.10.0] — 2026-08-31

**Minor — Angle 3: media quality. 10 MB of image weight removed, and a false alarm of my own corrected.**

**Images were shipping at up to twenty-two times their displayed size.** `james-madison.jpg` was 2465×3000 at 2.7 MB, displayed in a 110px circle. The site carried 23.7 MB of images and the homepage alone pulled 4.0 MB of card art with nothing deferred — on a classroom network, thirty students each fetching the same 4 MB before anyone reads a word.

`tools/shrink_images.py` caps each image by how it is actually used, at roughly 3× the display size so retina and larger text settings still look right: portraits 400px, homepage cards 1000px, hero backgrounds 1800px. **48 images resized, 23.7 MB → 13.7 MB**, homepage cards 4.0 MB → 1.9 MB, and Madison's portrait 2766 KB → 9 KB. Every image is now deferred with `loading="lazy"` except the hero — which matters more than usual here, because under the card model a closed card's photos are in the DOM and off screen, so a thirteen-card page was fetching all thirteen sets up front.

**11 podcast embeds had no `title`.** A screen reader announces an untitled iframe as "iframe", so ai.html offered eleven identical unlabelled objects in the reading order. Titles now say what each episode is. Three portraits had a bare name as alt text, which the heading beside them already says.

**All eight interactives check out** — styled, wired to their script, and carrying a text readout. The playbook records two centrepieces that once shipped with no CSS at all; that failure is not present now.

**A false alarm, corrected.** Mid-audit I reported 28 images published without attribution and called it the most serious finding — a real problem, since the commit that added them says "CC-licensed Wikimedia Commons portraits" and CC BY requires credit. It was wrong. My check searched only *forward* from each `<img>`, and a credit line sits at the END of its person block, so every search landed in the next person's entry. **All 23 portraits carry author, licence and a Commons link.** What survives is much smaller: three homepage-only card images (`ai-card`, `capitol-featured`, `ukraine-card`) with no credit traceable anywhere, which needs whoever added them rather than a guess.

**And a regression I caused and caught.** The first pass at lazy-loading used `<img\b[^>]*>`, which ends at the `>` inside `onerror="this.outerHTML='<div class=…>'"` — so the new attributes landed *inside* an attribute value and produced stray `</div>` on eight pages at once. No existing gate saw it; a well-formedness check did. `tools/htmltag.py` now walks tags tracking quote state, and four tests in `tools/htmltag.test.js` hold the property: every page well-formed, the naive pattern demonstrably failing on the real shape, the pages genuinely containing such attributes, and no deferred image having lost its fallback handler.

## [4.9.0] — 2026-08-31

**Minor — Angle 2 of the site audit: the standing editorial rules, checked and kept.**

**A scanner for the rules the project already made for itself.** `tools/check_voice.py` checks what a machine can check from `docs/VOICE.md` — undated "now / currently" on an ongoing event, prose that talks about the page, positional references broken by the card model, and substantial sections missing a "Before you read". It deliberately does not judge whether a second sentence follows from the first, or whether a source supports its claim.

It opened at 50 findings and **most were the scanner's fault, not the pages'.** "Sources for this section" is the label on a disclosure widget, not prose addressing the reader, and it alone accounted for 20 hits. Inside a single card, "the map below" is still the map below — only *cross-card* references break. VOICE explicitly allows historical "now" ("born in what is now Afghanistan") and a crisis line saying help is available right now. After teaching it those exemptions: 26 findings, then 19 fixed, and 3 left because they are correct as written.

**What was actually wrong, and fixed:**

- **Eight undated claims.** The gun-violence cluster was the clearest: four sentences saying a measure is "now nearly universal", each sitting immediately beside the 2021-22 figure that dates it exactly. The date was already there and simply was not being used.
- **Six places the prose talked about the page.** "This section puts real numbers to the problem" became "The numbers below come from federal health data."
- **Two positional references** that the card model had broken. ai pointed at podcast parts "embedded in each section above"; they are now named.
- **Three substantial sections with no "Before you read"** — 158 to 165 words, over VOICE's 150-word threshold and simply missed. The blocks were written from each section's existing text, and the tool refused one at 34 words because VOICE asks for 35–60.

**Three findings left alone on purpose.** A contrastive "researchers are now using AI", a "now" inside a dated timeline entry, and "Russia says these areas are now part of Russia" — reporting a claim. Changing those would be false precision.

**Nothing has gone stale, and every primer is still the plainest text on its page.** Four apparently-expired dated claims turned out to be source *titles*, not claims. All eight primers measure below their page's deep-section median: ai 6.51 against 7.83, gun-violence 6.13 against 9.96, climate 6.61 against 8.94.

**The largest finding was one the site created for itself.** Deep links (4.3.0) changed what "first mention" means: a term defined in card 2 and used in card 6 was fine when everyone arrived at the top, and is not fine when a teacher sends a student straight to card 6. **31 terms were in that state.** `tools/spread_glosses.py` now defines a term at its first mention in every card, reusing the page's own `data-def` so no definition is invented — 34 glosses added, 92 to 126 site-wide. Duplication rather than a glossary because reading-intervention V4 marks an end-of-document glossary as a finding and a same-sentence gloss as a pass.

Ten remain bare on purpose: proper nouns that do not need redefining at every mention (Geoffrey Hinton, the Keeling Curve, Sputnik 1) and words the surrounding sentence already carries.

**gun-violence's missing Key Word boxes were not a defect.** It has 21 inline glosses and zero `.vocab` callouts while other pages have both — but inline is the placement the research prefers, so the page is doing the right thing differently, not the wrong thing.

## [4.8.0] — 2026-08-31

**Minor — the Situation Update and focus panes are light. Angle 1 of the site audit is complete.**

**6,036 words were set light-on-dark**, including single sections of 1,302 words (iran) and 900 (gun-violence). A dark ground is fine for a short pull-out and poor for sustained reading, and these panes hold the longest volatile passages on the site — for a class with many students reading below grade level, that was the hardest surface in the worst place. It had also been reported directly: the panes read as "not great".

The panes stay distinct. They keep the eyebrow, the badge, the date line and their own warmer ground; they simply stop being inverted. Every combination on the new ground passes AA: ink 15.44:1, ink-light 7.86:1, ink-faint 5.12:1, and each page's accent between 6.4 and 8.4:1.

**Done mechanically, because 289 pane-scoped rules across seven inline stylesheets is exactly the shape of the v4.0.0 Source Serif miss** — two variants existed, one was found, 32 declarations survived. `tools/lighten_panes.py` maps by what a colour was *for* rather than by its literal value (ground, body, emphasis, faint, hairline, tinted fill), converted 155 rules, and the result is verified by asserting no light-on-dark colour survives inside a pane.

**Inline styles were the gap, and the contrast checker only found them once it resolved tokens.** A stylesheet sweep cannot see `style="..."` in markup, and fourteen inline colours had been chosen for the dark ground — landing at 1.1–2.9:1 after the flip, which is invisible text. The first version of `tools/check_pane_contrast.py` matched only literal hex and reported "0 checked, all pass", a check that examines nothing. Chasing `var()` through each page's palette found the rest, including `--gold-l` at 2.11:1 and then `--gold` at 2.89:1.

The gold labels now use `var(--accent)`, which is what iran, ai and ukraine already use for the same element — a contrast fix and a consistency fix in the same edit, which is what this audit is for.

**Angle 1 findings, all closed:**

| Finding | Resolution |
|---|---|
| Two unrelated timeline designs | One system at two weights (4.7.0) |
| 88 dead CSS rules, 9.9 KB | Removed; `.section-nav` had outlived its markup by nine pages |
| Jump strip hidden under the sticky card header | Offset by the measured summary height (4.6.0) |
| 6,036 words light-on-dark | Panes lightened |
| 14 inline colours assuming a dark ground | Fixed; a permanent checker added |
| 103 inline `style=` attributes | Examined: 37 appear exactly once and are local one-offs, not a system failure. The ones that mattered were the colour cases above. |
| climate-change and ukraine dated sections lack `update-pane` | Now cosmetic rather than structural — a light pane and a plain article section differ by an eyebrow and a tint |
| gun-violence: 21 glossed terms, zero Key Word boxes | Carried to Angle 2; adding them is writing content |

## [4.7.0] — 2026-08-31

**Minor — one timeline system, alternating on a centred spine, applied to both timeline components. Decade grouping removed.**

**The decade grouping is gone.** It put every event behind a closed disclosure, which is the opposite of what a timeline is for. Every event is visible again, and the jump strip is back to one stop per year. Four tests now pin that down so it does not quietly return.

**Alternation is back, and this time there is width for it.** The 4.4.0 attempt failed at about 30 characters a line, and the arithmetic explains both the failure and the fix: timelines sit inside `.article`, which is `max-width: 700px` **and** `padding: 22px 6vw`, so at a 1400px viewport the content box is only ~530px. Splitting that in two is hopeless.

So above 1180px the timeline now steps outside the prose column — negative margins cancel the 6vw padding and reclaim 190px a side, taking it to about 1080px. Each column then carries **53 characters**, against a ~55 optimum and an 80 ceiling. Negative margins rather than the usual `translateX(-50%)` full-bleed trick, because a transform on an ancestor stops `position: sticky` working and the jump strip inside is sticky.

Below 1180px there is no room for two columns and everything stacks on one side, which is also what print gets. On a 390px phone the card chrome was eating the measure down to 30 characters; tighter padding there brings it to about 34.

**The dots now sit on the line rather than beside it.** Stacked, the spine is at `left: 8px` and a 16px dot at `left: 0` centres on 8px. Alternating, the spine is at 50% and each dot's centre lands on the item's inner edge, which is the same line. `box-sizing: border-box` keeps the 3px border inside the 16px so it cannot shift the centre.

**Both timeline components now share one system.** `.tl-item` (the long historical timelines) and `.mini-tl-item` (the compact dated list inside a Situation Update pane) were two unrelated inventions; they are now one layout at two weights. That required taking layout ownership away from the page stylesheets, where `.mini-tl` is `display: flex` with a `gap` that would fight the 50%-width alternation and double up with the item margins.

**Also — 88 dead CSS rules removed**, 9.9 KB of stylesheet no browser could ever have used. Each named only classes with no markup on its own page. `.section-nav` was the worst: v4.0.0 deleted its markup from nine pages and left the rules on all nine, and it survived an earlier sweep only because two code comments mentioned it by name. `tools/find_dead_css.py` now does this properly — it strips comments before deciding, treats anything a script mentions as live, and refuses to touch a rule naming no class at all.

## [4.6.0] — 2026-08-31

**Minor — the jump strip stopped hiding under the card header, and dense timelines group into decades.**

**The jump strip was invisible, and it was my bug.** An open card's `<summary>` is `position: sticky; top: 0; z-index: 20` — it is the "← Overview" header. The jump strip was also `sticky; top: 0`, at `z-index: 5`, so it slid underneath and only its bottom edge showed. It now offsets itself by the summary's measured height rather than a guessed constant, because that height changes when a reader uses the A/A/A text-size control.

**Nineteen entries now group into seven decades.** A strip of nineteen year buttons restated the density it was added to relieve. Entries above a dozen are collected into decade groups that open and close, the first left open so the timeline still begins as a timeline rather than a menu of closed boxes. Clicking a jump button opens its decade before scrolling — a closed group cannot be scrolled to. Native `<details>`, so with JavaScript off there are no groups and the flat list is exactly what it was, and printing still gets every era.

**Only ai groups, and the reason is principled rather than accidental.** iran's timeline runs from *Around 550 BCE* and ukraine's from *~882 AD*. Decade buckets across a span like that would be mostly empty and occasionally hold a single event, which is worse than no grouping. So grouping applies only where the whole span is under 120 years: ai runs 1950–2026 and groups; the other two stay flat.

Those two want **named historical eras** — Kievan Rus', empire, Soviet, independence — and deciding where those breaks fall is an editorial judgement, not something to infer from dates. They stay flat until someone makes that call.

Label parsing had to cope with what is actually on the page: `Around 550 BCE`, `~882 AD`, `1951–1953`, `Early 1900s`, `Jun 17, 2026`. It takes the first three- or four-digit number and reads BCE as negative, so a 550 BCE entry is not filed as 550 AD.

**Nine new tests** (137 total), including three written after the fact for cases the first version got wrong: a millennia span must stay flat, BCE must not be read as AD, and messy-but-close labels must still group. Two of them caught bugs in the test double rather than the code — most usefully an `insertBefore` that ignored its reference node and silently reversed the decade groups to 1970s, 1960s, 1950s against perfectly good code.

## [4.5.1] — 2026-08-31

**Patch — the alternating timeline is gone. It made the cards unreadable, and the arithmetic says why.**

4.4.0 alternated timeline entries left and right of the spine from 900px up, following the reference layout. Reported back immediately: the cards were far too narrow, two or three words to a line.

The mistake was assuming the timeline sits in a wide container. It does not — every one of them is inside `.article`, which is `max-width: 700px`. A 50% column is 350px, and after the 42px gutter and the card's own padding the text ran at about **30 characters per line**. Alternation needs a container roughly twice as wide as the measure it wants to keep; a 700px reading column has no width to split.

Entries now run the full measure on one side of the spine: about 72 characters raw, capped to 62 by `.tl-body p`, which is inside the measured optimum rather than past it. The spine, the dots, the year tabs and the **Jump to** strip are unchanged — those were the parts that worked.

This also settles the readability question 4.4.0 raised and could not resolve on its own. A zig-zag reading order costs a struggling reader something; in a 700px column it was buying nothing at all.

## [4.5.0] — 2026-08-31

**Minor — a build number in every footer, and cache-busted assets, because a shipped change was live and invisible at the same time.**

**The 4.4.0 timeline was reported as missing from the live site. It was not missing.** `site.css` carried the new spine and jump strip and `site.js` carried `initTimelines`, both correct on the server. GitHub Pages serves those files with `cache-control: max-age=600` and no fingerprint in the filename, so a browser holding the old copy kept rendering the old layout — and nothing on the page said which build was in front of you. Diagnosing it needed a `curl` of the stylesheet, which is not a reasonable thing to ask of anyone looking at a web page.

**Two fixes, in one script so they cannot drift.** `tools/stamp_version.py` appends `?v=<version>` to every local css/js reference, which is the part that actually forces a fetch, and writes `Build 4.5.0` into every footer, which is how a person confirms it without opening devtools. It runs after a VERSION bump and is idempotent.

**Five tests hold it together** — VERSION is a semver triple, every page carries exactly one stamp, every stamp matches VERSION, every local asset reference is stamped with the current version, and no stamped reference points at a file that does not exist. Bumping VERSION without re-running the script now fails the suite rather than shipping silently.

`docs/PLAYBOOK.md` gains the rule that matters for next time: **when someone reports that a shipped change is not there, read the build number in the footer first.** If it is behind, it is a cache and not the code.

## [4.4.0] — 2026-08-31

**Minor — the long timelines get a spine and a way to skip along it.**

**The problem, measured.** Eight of the site's twelve timelines run to six entries or more: ai's *Through the decades* is 19, ukraine's *Through the ages* 17, iran's *How we got here* 15, gun-violence's *History timeline* 11. As a flat run of dated rows, a reader scrolling one had nothing to hold onto — no sense of where they were in it, and no way to jump ahead.

**What changed.** Entries now hang off a continuous vertical spine with a dot at each event and the year as a tab on the entry rather than a column the eye has to scan across to. From 900px up they alternate sides. Any timeline of six entries or more also gets a sticky **Jump to** strip built from its own years; clicking one scrolls to that event, and the strip tracks the scroll so the current entry stays marked — via `IntersectionObserver`, so there is no handler firing on every frame, and with `aria-current` so a screen reader gets the same information.

Below six entries there is no strip. A five-item timeline is on screen in a scroll or two, and the strip would be chrome for a problem nobody has.

**No markup changed.** `.tl-item > .tl-year + .tl-body` was already uniform across all twelve, so this is a restyle plus one enhancement, and with JavaScript off every timeline is still a dated list in document order.

**The trade-off, stated rather than buried.** Alternating sides makes the eye travel left-right-left, and for a class with many students reading below grade level or learning English that is load with no informational payoff. It is therefore applied only from 900px up, where two columns are wide enough to read as two columns; below that, in print, and on any narrow window, every entry stacks on one side in document order. The alternation is one clearly marked `@media` block in `site.css` and nothing else depends on it, so it can be switched off in one deletion.

**Seven new tests** cover the strip: one button per entry, nothing below the six-entry threshold, the threshold itself, the spine class on every timeline long or short, two timelines on one page kept separate (the wrappers genuinely differ — `#aiTimeline`, `#ukraineTimeline`, and on space-race the entries sit straight inside `.article`, so grouping is by parent node), an `aria-label` naming where each jump lands, and every entry observed. Writing them caught a bug in the test double rather than the code: its `className` setter replaced `classList._s` while `contains()` closed over the original set.

## [4.3.0] — 2026-08-31

**Minor — a direct link to any section, and the dense timeline given room to breathe.**

**Every card now has its own URL.** A teacher can hand one student one section:

    current.mrbsocialstudies.org/iran.html#where-things-stand
    current.mrbsocialstudies.org/ukraine.html#the-holodomor

Half of this already existed — `openForHash()` was written so the old anchors kept working after the card conversion, and it opens whatever card contains the hash target. What was missing is that none of the 85 `<details>` had an id of its own. Cryptic leftovers like `#hist` and `#update-week1` did work, but nobody was going to guess them. Ids are now slugged from each card's `data-title`, so the link reads as the thing it points at, and the old anchors still resolve.

The address bar also follows the open card, so the link can simply be copied from it, and each card carries a **Copy link to this section** button in its end-of-card menu for anyone who would not think to look at the URL. `replaceState`, not an assignment to `location.hash`: assigning it would push a history entry and jump the page, so three cards opened would take three Back presses to leave and the jump would fight the card's own scroll.

**Eleven duplicate ids removed, found while doing it.** The new slugs collided with dead `<div class="sec-head" id="videos">` anchors left behind when 4.0.0 deleted the section-nav markup. Duplicate ids are invalid, and `querySelector('#videos')` returns whichever comes first — the card on some pages, the inner div on others, which is how a deep link works in testing and fails in use. Nothing referenced any of them; the card keeps the id. Non-colliding legacy anchors are untouched in case one has been shared.

**The timeline was as dense as it looked.** `.mini-tl-text` carried no width cap, so inside a 900px pane it ran about **113 characters per line** — past the WCAG 80 ceiling and double the ~55 optimum — set at .86rem with 14px between entries. Three lines of small type at full pane width, stacked tight. It now takes a 64-character measure at .95rem with 24px between entries, and dates align to the first line rather than drifting on a wrapped one. `[Al Jazeera]` also stopped breaking across lines and stranding "Jazeera]" on its own, which read as a typo rather than a citation. No event, word or source was removed.

**Six new tests** cover the deep links: that a link opens the card it names and only that one, that opening writes the slug, that closing clears it, that a plain visit writes no history at all, and that every card on all eight pages has a unique linkable id. site.js is a browser IIFE with nothing exported, so they drive it against a small stand-in DOM — which caught a real defect: the first version of `syncHash` read `location.hash` to decide whether to clear it, which works in a browser and makes the logic untestable. It now tracks what it wrote.

## [4.2.1] — 2026-08-30

**Patch — a layout bug in the dark panes, and a second pass at the quizzes Q1 flagged.**

**"Where Things Stand" was rendering badly, and had been for a while.** Reported from a screenshot: the *Before you read* block sat as a narrow column jammed against the right edge of the pane with most of the pane empty. The cause dates from the commit that introduced the component, not from 4.2.0's type scale. `.before-read` positions itself with `margin-left: max(0px, calc(50vw - 350px))`, which lands its left edge on the centred 700px article column — correct for the 47 blocks in full-width sections, wrong for the 8 inside `.update-pane-inner` or `.focus-pane-inner`, because those parents are already centred and a viewport-relative margin inside them compounds. At 1900px the pane spans x=500–1400 and the rule adds 600px of left margin *inside* it: the block starts at x=1100 with 300px of pane remaining, about 32 characters per line. Fixed by container rather than by the `.on-dark` colour modifier, since the bug is about position and not colour. Inside a pane the block now starts at the pane's own edge with a 62-character measure — a 900px pane at 1.02rem would otherwise run ~110 characters, past the WCAG 80 ceiling and well past the ~55 optimum.

No gate could have caught it. It needs a viewport-relative length resolved inside an already-centred parent, which only happens when something renders.

**Sixteen more quizzes rewritten, and this time the probe moved.** The 4.2.0 pass fixed absurd distractors and left the deeper fault in place: the correct answer was still identifiable as *the sensible one*. Given three odd options and one reasonable one, a reader picks the reasonable one knowing nothing. This pass held every distractor to a stricter rule — each has to be something that is genuinely true of some situation, or a mechanism that really exists, just not the one the section reports.

| | round 1 | round 2 | round 3 |
|---|---|---|---|
| eliminable — needs no knowledge | 15 | 17 | **10** |
| answered by the learning target alone | 10 | 3 | 4 |
| general knowledge (prober-confounded) | 49 | 53 | 58 |
| required the passage | 2 | 3 | **4** |

Construction defects — the two tiers that fail for any student regardless of what they know — went **20 → 14**. Three items became genuinely passage-dependent, and they share a shape worth copying: Rainier's ice loss now offers 9/14/22/31 percent instead of 1/14/50, so magnitude reasoning cannot reach it; the two-analyst question now offers four real interpretive disagreements instead of one interpretation among three factual options; and the Hormuz ship counts now offer four small numbers including a reversed pair, so "pick the smallest" stops working.

One caveat on the comparison: round 3's prompt told the prober to be strict about its `basis` field and only claim elimination when it had really eliminated rather than known. That makes round 3's split more honest and slightly less comparable to round 2, so some of the eliminable→knowledge moves may be better self-reporting rather than a better question.

**One item left knowingly answerable.** Ukraine's "I need ammunition, not a ride" is among the most reported quotations of the war. Any rewrite that defeated a well-read prober would also defeat a student who simply followed the news, which is not an improvement.

## [4.2.0] — 2026-08-30

**Minor — a reading-intervention pass over all 60 deep sections, and one canonical type scale for all eight pages.**

**The complaint was right and the formula could not see it.** Iran's *Where things stand* was called out as dense and hard to parse. It measures **FK 8.47 — inside the grade 6–8 band**. A readability gate would pass it without comment, and of the fifteen densest sections on the site, eleven sit inside or below the band. What a reader is reacting to in that card is twenty place names that each appear once, ten dates in three formats, and seven events joined by nothing but their dates — none of which Flesch-Kincaid measures, because it counts syllables and sentence length and a proper noun is invisible to it.

**Corrected mid-analysis: the above-band count was mostly a measurement artifact.** The first pass fed each section to the locator with its citation links intact, so "src" and outlet names were counted as prose. That inflated the score on exactly the best-sourced sections. Excluding citations, sections above the band ceiling drop from **13 to 5**, four of those five sit within half a grade of the ceiling, and 47 of 60 sections are in band. The earlier figure is corrected here rather than quietly dropped, because it was reported.

**Every edit was additive, and every one was gated.** `ceiling_diff` (G6) ran on each revised section against its committed version, and each returned **ELABORATION with no terms lost**: iran +59 and +63 words, ai +63, us-elections +51 and +54, immigration +46, space-race +48, climate +61. G6 caught one real slip — rewriting `shutdown` to `shut down` and `reversed` to `reversing` registered as two terms lost and flipped the pattern to MIXED. They were morphological variants, but restoring both word forms cost one edit, and "it's only a variant" is what gets said right before something load-bearing goes.

**What actually changed.** Iran's timeline now names the three threads to follow and makes the 60-day clock traceable across three entries; its 1953 coup finally connects to the 1979 embassy seizure, with the trigger traced to the National Archives and the *motive* deliberately not asserted, because no source fetched this session supports it. ai's decade timeline says out loud what its own spine promised — backpropagation arrives seventeen years after the winter, AlexNet's idea is 55 years old. us-elections splits a paragraph that carried an election calendar and the top-two rule at once. immigration states why railroads and Scandinavian arrival belong in the same paragraph. climate-change makes cap-and-invest explain both of its halves in visible prose rather than leaving one inside a screen-reader-only gloss.

**Study Mode turns out to be two different texts, and one sentence proved it.** `.term-desc` is screen-reader-only by default and un-clipped inline by Study Mode, so a sentence with three glossed terms is one sentence in the default view and a 77-word run-on in Study Mode — the version screen-reader users get in every state. All 34 glossed sections score harder in Study Mode. That is **not a defect**: adding definitions is the elaboration the research calls for. But where three definitions landed inside a single list sentence, the three parallel items disappeared into it, so that list is now a list. Every span moved verbatim — 19 glosses, 20 description ids, 21 aria references, none lost.

**Not manufacturing findings is part of the work.** Of seven sections the below-band alarm flagged, six were false alarms on inspection: connectives present, short sentences doing deliberate work, or statistics whose joining would have manufactured causation `bands.md` explicitly warns against. Most of gun-violence's "heavy sentences" were the gloss artifact rather than prose. Three of four causal gaps on us-elections were source lists sitting next to prose. The 61-word sentence was two sentences merged by a citation marker. Fourteen of the twenty flagged sections needed no edit, and saying so is the report.

**One canonical type scale.** Eight pages each carry their own inline stylesheet, and the supporting scale had drifted into two camps — 41 selector/property pairs disagreed, headings a step smaller, timelines a step tighter, stat numbers a step shorter. Body text never drifted, which is why it was invisible in a paragraph and obvious around it. Resolved in `site.css`, which loads last and wins at equal specificity, rather than in eight copies — editing eight copies is how the Source Serif swap missed 32 declarations in 4.0.0. Canonical is the climate-change camp, the larger of the two, which is the right direction for this class.

Two things were fixed rather than merely unified. `.article-hero-inner` on three pages reserved 80px at the top for `.section-nav`, whose markup 4.0.0 deleted and whose CSS it left behind — 80px of empty space above the title for an element that does not render. And `.term::after` nearly became a regression: a media query adds no specificity, so an unscoped rule would have overridden every page's mobile rule and capped the definition bubble at 240px on phones. Scoping it by breakpoint exposed that only four pages pin that bubble so it cannot run off a narrow screen — the overflow 3.3.0 fixed, on half the pages. The other four now have it.

**Also:** `docs/LEARNING-TARGETS.md` drafts a learning target for all 60 substantive sections, awaiting review. Targets are what the G3 gate needs before Q1 — the passage-independence probe — can run, and Q1 is the check that decides whether any of this mattered: withhold the section, hand a separate model the target and the quiz questions, and count what it answers anyway. There are 76 quizzes on this site and none has been tested that way.

## [4.1.0] — 2026-08-30

**Minor — every substantive section on the site can now be completed, and the progress bar counts to the right total.**

**Ten sections could be read in full and never earn a check.** The tile menu marks a card `·` when it has been opened and `✓` when its quiz has been answered, but a tile can only earn the check if its section has a quiz to key off. After 4.0.0, 31 of 85 tiles had none. Twenty-one of those are reference material — Key People, Videos, Sources, Keep Learning — which a student browses rather than works through, and the opened dot is the right signal for them. The other ten were real sections with real claims: five on ai, the dated *Where things stand* pane on iran, space-race and us-elections, ukraine's Holodomor, and iran's Hormuz update. Those now have quizzes, so every substantive section on all eight pages can be finished. Coverage is 64 of 85 tiles, and the 21 remaining are unquizzed by design.

**Each question asks for the section's claim, not a number from it.** A student who knows only that the topic exists should not be able to guess. The Hinton question turns on his leaving Google in 2023 rather than the Nobel a year later; the Pew question asks what a survey of expectations can and cannot tell you; the Holodomor question asks which detail makes a famine engineered rather than natural, and the answer is the sealed border, because weather does not seal borders. The three *Where things stand* panes are dated and volatile, so their questions ask what the snapshot claims rather than a figure that expires — iran's asks how the strait could be called "open and operating" in the same week three ships crossed it.

**The progress bar was counting against the wrong denominator.** `addPoints` clamps with `Math.min(pts + n, MAX_PTS)`, and on six of eight pages `MAX_PTS` was below the points a student could actually earn: immigration counted 9 against 13 available, ukraine 10 against 14, iran 10 against 13. The bar filled early and every point after that silently did nothing — including, on iran, three whole quizzes. `MAX_PTS` is now each page's real reachable total, quizzes plus bonus points, which also absorbs the new questions. No unlock threshold was stranded by the change.

**A defect the gates could not see.** The new buttons were first placed just before each section's closing tag, which made them direct children of `<details>` — outside `.focus-pane` and `.update-pane`, below the pane's background, and free of the `max-width` that centres everything inside it. Every check passed: valid HTML, balanced tags, correct section, working quiz. It was wrong on screen only. Parsing the pages and asking what each button's *parent element* actually was is what caught it, and all ten now sit in the same content box as the fifty-four buttons that came before them. This is the same lesson 4.0.0 recorded twice — the measurable things keep being right while the depicted things go wrong — and `docs/PLAYBOOK.md` now carries the check as a step rather than as a warning.

## [4.0.0] — 2026-08-29

**Major — the landing layer: every topic page now opens on a five-minute primer, with the rest behind a menu of cards.**

**What prompted it.** The site's mission is a quick, engaging primer on an issue in the news — five to seven minutes. Measured against that with `tools/reading_time.py`, not one page was close: gun-violence ran 77 minutes, ai 48, immigration 47, and even climate-change, the shortest substantial page, ran 18. A single section of gun-violence was longer than the entire intended experience for the topic. The homepage advertised the problem honestly: *70–80 min*, *40–50 min*, *30–40 min*. The pages had become good long-form articles, which is not what they were for.

Length was only half of it. The whole interactive surface across eight pages was 59 quiz buttons plus reading supports — before-you-read blocks, timelines, videos. Every one of those helps a student get *through* prose. Nothing let a student learn by doing. Successive releases had optimised the reading experience instead of asking whether reading should be the primary mode.

**What changed.** Each page keeps one file. A newly written primer of roughly 650 words sits on top, with one interactive centrepiece, and every existing section moves — untouched — into a native `<details>` card. Opening a card closes the others and hides the primer, so a card is the whole view rather than a stop on a long scroll; finishing one returns you to the menu with that tile marked. Nothing was deleted anywhere: **the five to seven minutes is a property of the entry point, not a ceiling on the topic.** That distinction is the whole design, and it is the same principle 3.7.0 applied to Study Mode — shortening prose usually deletes the connective tissue that carries the meaning (Davison & Kantor, 1982), so the fix is a shorter door, never a shorter room.

`tools/verify_invariants.py` proves it rather than promising it. Every page was wrapped as a pure structural change first and had to report exact equality on citation and gloss counts, with byte-identical `reading_time.py` output, before any primer was written.

**Reading level now follows commitment.** The class this is written for includes many students learning English and many reading well below grade level, and they all pass through the primer. So on every page the primer is now the plainest text on it, and difficulty rises with the reader's choice to go deeper. Where a first draft came out harder than the sections it introduced, the fix was always additive: on climate-change the primer went from FK 8.13 to 6.02 while getting *longer*, 559 words to 613. Plainer and longer is elaboration (Beck, McKeown, Sinatra & Loxterman, 1991); plainer and shorter would have been the failure that guardrail exists to prevent.

**Typography and contrast, site-wide.** Body text is now Atkinson Hyperlegible Next at 18px on a 1.75 line height, with `html { font-size: 100% }` so a reader's own browser setting wins. The dyslexia-font toggle was removed entirely: pooled *g* = −0.04 across 15 studies and 688 readers, with most children in those studies preferring Arial — it displaced real scaffolding with a typography change that felt like an intervention. Study Mode kept its inline word meanings, lost its section bar, and is now called what it does: **Word meanings**. `--ink-faint` was failing AA at 4.35:1 on warm paper across all nine pages — it carries captions, minute labels and photo credits — and is now 5.12:1. The full palette audit reports zero failures.

**Eight interactives, one per topic, each teaching a mechanism rather than a verdict.** Drag through 800,000 years of trapped air and watch CO₂ cross a ceiling it had never crossed. Run Washington's top-two primary on seven real candidates and watch five of them — four of them Democrats — drop out. Step through Artemis' finish line moving from 2024 to 2028. Teach a real nearest-neighbour classifier, then switch off every lemon and watch it confidently misname them. Pick a state and see its gun-death rate against the other forty-nine. Watch a year of fighting in Ukraine vanish against the territory already held. See the shipping lanes of Hormuz drawn to the same scale as the strait. Set your age and learn how old you were when a visa application still in the queue was filed.

Every figure in those was fetched and read at its source. Where a number could not be verified to that standard, the interactive was changed rather than the number invented — the gun-violence centrepiece was redesigned for exactly that reason.

**Corrections found along the way.** us-elections was describing a pre-primary world 25 days after the primary, listing seven candidates for a congressional seat when two had advanced, and citing a filing story for a claim about results. Its seat math no longer matched its own sources. Two hardcoded "68 days until Election Day" countdowns — one on the elections page, one in the homepage ticker — are now computed from the date, because a typed countdown is wrong every day after it is typed.

**Also:** the homepage shows how far a student has got on each topic; card time promises were rewritten from *70–80 min* to *5 min · more if you want it*; `tools/reading_time.py` gained a `--landing` gate that fails a build when an entry point exceeds seven minutes; `AGENTS.md` no longer claims the project has no tests.

## [3.7.0] — 2026-08-28

**Minor — Study Mode: a reading-support toggle, shipped site-wide across all 8 topic pages.**

**What it does, and why it's a toggle and not a "simplify" button.** A 💡 Study Mode button
in the fixed accessibility controls at the bottom-right of the screen — the same stack as the
text-size buttons and the dyslexia-font toggle, in the same place on desktop and phone —
reveals the definition of every glossed word inline, right next to the word,
and adds a small bar that tracks which section the student is reading and previews it.
Nothing about the article text itself changes — turning Study Mode off returns the page to
exactly what it looked like before. That distinction was a deliberate design choice, not an
afterthought: a "simplify the text" button would be a modification disguised as an
accommodation, quietly handing the students who need the most support a thinner version of
the same page. Shortening prose usually deletes the connective tissue that carries the
meaning between sentences (Davison & Kantor, 1982) — the readability score goes down while
comprehension gets *worse*, for exactly the students the button exists to help. Study Mode
adds support instead of removing content, which is why every gloss it reveals was already
sitting in the page before this feature existed.

**The gloss reveal is pure CSS.** Every `.term` on the site was already followed, inline, in
the same sentence, by a screen-reader-only `.term-desc` span wired to the term through
`aria-describedby` — the tooltip mechanism the site has shipped since its redesign. Study
Mode's CSS layer does exactly one thing to that markup: it un-hides an element that was
already there, in the sentence, in the right place. No JavaScript touches the DOM for this
part, no new element is created, and nothing about the page's accessibility tree changes —
the description was already programmatically associated with its term for screen-reader
users; Study Mode just makes it visible to everyone else too.

**The Key Word injector, and the guard that keeps it out of quotations.** "Key Word" boxes
(the `.vocab` sidebars) are a second source of definitions that don't have an inline
`.term`/`.term-desc` pair. Study Mode's injector finds each Key Word's first plain-prose
occurrence and splices its definition in beside it — but a term can just as easily first
occur inside somebody's quoted words, and scaffolding must never go inside a source. The
guard was originally written to protect `<blockquote>`, `<q>`, and `<cite>` — tags this site's
markup contains **zero** of. Every quotation here is either a `.pull-quote` div or bare quote
marks inline in ordinary prose, so the guard had to be extended to check for both, and quote
detection had to run over the *containing block's* full rendered text rather than one text
node at a time — a quotation can be split across nodes by an ordinary `<strong>` or `<a>`
sitting inside it. Verification surfaced two real exposures the tag-only guard would have
missed: `ai.html`'s "Computer Vision" occurs first inside a Geoffrey Hinton pull-quote
("...convinced all the people doing **computer vision** that what they were doing was
wrong..."), and `ukraine.html`'s "Coalition of the willing" occurs first inside an inline
quotation ("a group of **35 countries** called the 'coalition of the willing' met in Paris").
Both are now protected — the injector finds a safe container to place a sibling gloss beside
for one, and skips the term entirely when there's no safe container to attach to for the
other — and Task 8's integration harness (below) checks every injected node on every page for
exactly this failure mode, not just these two known cases.

**The injector also refuses to gloss a word the page already glosses.** A Key Word box can
name a word that is *also* an authored `.term` — 11 of the 55 do. For those, the injector's
first plain-prose match was the `.term` span itself: it split the text inside the span and
printed the same definition a second time, back to back with the one the CSS layer reveals,
underlined as if it were part of the term. Two more places are off-limits for the same
reason: a `.term-desc` (splicing a gloss into one rewrites the sentence a screen reader
announces for a *different* term) and a `.cite-inline` source label, which is not prose at
all. So: a match inside a `.term` ends the search and the box is recorded as **skipped** —
the student already gets that definition — while a match inside a `.term-desc` or
`.cite-inline` just isn't a legal site, and the walk keeps looking. All three are checked
against every ancestor of the matched text node, not only its immediate parent. Across the
corpus this moves 7 Key Words from *inline* to *skipped* (25 → 18 inline, 2 → 9 skipped);
orphans and the one sibling-aside are unchanged.

**Gloss text stops at the definition.** The injected text came from
`defEl.textContent.trim()`, which swallowed the `.cite-inline` anchor sitting inside the
Key Word's own paragraph — students read "…are the main ones.NASA", "…from proxies.NOAA",
"…generating electricity.U.S. EIA", and a bare "src" on `us-elections`. The definition is now
assembled from the paragraph's text nodes with each citation anchor dropped by node identity
(the same identity-based removal the section bar's primer derivation already used), never by
a regex over the joined string — so a definition that legitimately contains its own source's
name, like Artemis's "NASA's program to send astronauts back to the Moon", keeps it.

**The section bar.** Fixed to the *bottom* of the screen, not the top: the site already has a
sticky masthead and section-nav up there, and `body{overflow-x:hidden}` (needed elsewhere on
the page) breaks `position:sticky` for any descendant, so `position:fixed` was the only option
that actually stays put. An `IntersectionObserver` watches each section heading and swaps the
bar's text to that section's own "Before you read" primer as the student scrolls past it.

**`?study=on` / `?study=off`.** Either can be appended to any page URL to set the starting
state for that load. Only `on` is remembered for later pages — `off` deliberately is not. A
teacher's Canvas link is often the *last* Study Mode state a student's browser sees; if
`?study=off` persisted the way `?study=on` does, one assignment link with the parameter left
off by habit could silently clear a setting a student had turned on and relied on for the
rest of the site. `on` writes through to storage; `off` only ever applies to the page it's on.

**Gloss backfill: `iran` and `space-race`.** These two pages had noticeably fewer `.term`
tooltips than the rest of the corpus, so 6 new inline glosses were added to each (12 total) —
`retaliatory`, `ceasefire`, `memorandum`, `Ayatollah`, `currency`, and `Revolutionary Guard` on
`iran`; `satellite`, `capsule`, `crewed`, `commercial`, `lunar`, and `uncrewed` on
`space-race` — chosen for recurrence and narrative load-bearing weight, with terms already
covered by an existing Key Word box explicitly excluded to avoid double-glossing. The
`/reading-intervention` skill's G6 ceiling-preservation diff classifies both pages'
change as `elaboration` with `terms_lost: []` on both — the check that exists specifically to
catch a well-intentioned addition that accidentally deletes a concept while wrapping it.

**Dark-pane contrast fix.** `body.study-mode .term-desc` inherits `--ink-light` (`#4a4a4a`),
which measures only **1.96:1** against the `--ink` (`#1a1a1a`) background used by
`.update-pane`, `.update-box`, and `.focus-pane` — well under WCAG AA's 4.5:1 floor, and bad
enough to make roughly 25 pre-existing glossed terms across `ai`, `gun-violence`,
`immigration` (worst — 8 in one pane), `space-race`, and `ukraine` effectively invisible
inside those panes. The site's original tooltip CSS had already solved this same problem, per
page (e.g. `immigration.html`'s `.update-box .term::after{background:#fff;color:var(--ink)}`)
— this follows that existing precedent rather than inventing a new one: `.term-desc` inside a
dark pane now gets `#d8d2c8` instead, which measures **11.58:1** on `#1a1a1a`. The light-
background case is unchanged and still measures **8.42:1** (`#4a4a4a` on `--paper` `#fbf9f4`).
The two nodes Study Mode *injects* — `.sm-gloss` and `.sm-gloss-aside` — inherit the same
`--ink-light` and needed the same override: `space-race`'s "Artemis" gloss lands inside
`.update-pane` and measured the identical 1.96:1. Both now take `#d8d2c8` (11.58:1) inside a
dark pane, and the aside's left rule switches from `--accent` (a dark ink, invisible there)
to the `rgba(255,255,255,.35)` those panes already use for a divider.

**Two more keyboard/layout fixes on the same controls.** The Study Mode button's focus ring
was `outline:2px solid var(--accent)` while its own `.active` state sets
`background:var(--accent)` — the same colour, so a keyboard user saw **no** focus indicator
at all whenever the feature was on (1.00:1), and about 1.7:1 when it was off. It now uses the
white ring its neighbour `.dyslexic-toggle` already used: 12.63:1 on the inactive `#333`, and
5.76:1 on the lowest-contrast page accent. Separately, `#sm-bar` spans the full width at
`bottom:0` while `.a11y-controls` is fixed at `bottom:20px;right:20px` with a far higher
`z-index` — the controls sat on top of the bar's right end and the summary text ran
underneath them — and nothing reserved space for the bar, so it permanently covered the last
~40px of every page's footer. The bar now reserves the width of the control stack on the
right (tightened at the mobile breakpoint), the section label truncates instead of crowding
out the summary, and `body.study-mode` carries bottom padding so the bar never covers
content. The collapsed bar is also genuinely one line now: the base rule never set
`white-space:nowrap`, which left `#sm-bar.is-open .sm-bar-txt{white-space:normal}` overriding
nothing.

**Tap-to-open tooltips stand down in Study Mode.** `site.js`'s `.term` tap handler kept
toggling `.is-open` and calling `preventDefault()` while Study Mode's CSS hid the tooltip and
set `cursor:default` — a tap that visibly did nothing. The handler now returns early while
`body.study-mode` is on; the definition is already printed inline beside the word.

**Testing.** `tools/study-mode.test.js` unit-tests every pure helper (40 tests). A full
browser round-trip isn't possible in this environment, so `tools/study-mode.integration.test.js`
replaces it: a hand-rolled HTML parser and minimal DOM (node builtins only — no new
dependency) load each of the 8 real pages, run the actual `study-mode.js` source in a `vm`
sandbox against that DOM, and drive the real `apply('on')`/`apply('off')` lifecycle. For every
page it checks that nothing is injected before activation, that activation injects a gloss
and/or `#sm-bar` exactly where the page's own content warrants one, that **no injected node
ever descends from a `blockquote`/`q`/`cite`/`.pull-quote`** (verified as a real check, not a
tautology, by a negative control that disabled the guard and confirmed the harness catches
the resulting violation), that deactivation removes every injected node and restores the
page's serialized DOM to be byte-identical with its pre-activation state, and that activating
twice with no teardown between never double-injects. 40 assertions, all 8 pages, all passing.

**Deferred to v2.** Read-aloud / text-to-speech support; a writing slot (no page on the site
has one yet, Study Mode or otherwise); the 27 orphan Key Words the injector surfaced across
the corpus — glossary entries whose term never actually occurs in that page's own prose,
which is a pre-existing content gap Study Mode's own verification tooling made newly visible
rather than something this feature introduced; and the uneven `.term`-vs-Key-Word split that
remains on the six pages this cycle didn't backfill (`us-elections` has one inline `.term`
gloss against six Key Word orphans, for instance) — the site's own gloss mechanism is still
applied unevenly page to page, a limitation carried forward from v3.6.0 and not yet closed.

## [3.6.0] — 2026-08-28

**Minor — site-wide `/reading-intervention` sweep: 8 quiz items rewritten across 5 pages.**
Extends the v3.5.0 audit from `us-elections` to the whole corpus (37,574 words, 9 pages).

**What the sweep found.** The K5 primer-spoiler collision found on `us-elections` is
systematic, not local: the v3.4.0 "Before you read" blocks were written to preview each
section, the quiz banks were written earlier to test each section, and the two were never
checked against each other. 8 of 58 quiz items had their answer stated in the primer sitting
directly above them — in several cases word for word.

| page | items | what the primer gave away |
|---|---|---|
| `ukraine` | q1, q2, q3 | "largest country entirely inside Europe"; "a powerful state called Kievan Rus'"; Shevchenko writing in Ukrainian while banned |
| `space-race` | q1, q3 | Sputnik / Soviet Union / 1957 / orbit; "Blue Origin is headquartered in Kent" |
| `immigration` | q1 | "Indigenous nations had been across North America for thousands of years" |
| `gun-violence` | q7 | "approving Initiative 1491 in November 2016" |
| `iran` | q3 | "About half of Iranians are under 35" (vs. answer "About 50%") |

Every rewrite keeps the primer's fact **in the stem** and asks for something only the passage
supplies — Ukraine's western border countries, who founded Kievan Rus' and when, what
Shevchenko was born into, what ordinary people could actually do with Sputnik's signal, what
a Human Landing System is for, the Library of Congress's own word for colonization
("an invasion of territory"), and that extreme risk protection orders are a state-level tool
whose rules each state writes itself. No item was deleted and no item got easier; each now
tests one level deeper than it did.

**What the sweep cleared.** Worth recording so it is not re-litigated:

- **Zero myth-checklist findings site-wide.** `immigration` was the only page with triggers,
  and all four are correctly handled: both "empty land" uses *negate* the myth rather than
  assert it, the DHS "worst of the worst criminal illegal aliens" line is attributed inside a
  quotation with its source, and "Puyallup Assembly Center" / "Minidoka War Relocation Center"
  are the camps' proper names sitting beside an explicit Densho-sourced gloss on why
  historians say "incarceration camp" instead. That page had already done the work.
- **Zero images without alt text**, across all 9 pages.
- **`space-race` reads below band** (FK 6.48 against a 6.51 floor) — the direction `bands.md`
  calls the alarm that matters. Not a defect here: v3.4.0 already measured this as a *topic*
  effect (rockets are concrete), and the v3.1.x rewrite moved it 6.6 → 6.5. Left alone.

**Known limits of the scanner** (it is a locator, not a judge). It is blind to numeric answers
— `iran q3` was caught only because "About 50%" and "about half" happen to share a stopword,
and had to be re-added by hand. It also over-fires on the `"Before you read N min"` time label,
whose digits collide with numeric answers; that prefix is now stripped before matching.
`us-elections q2` and `gun-violence q9` are confirmed false positives: the first shares only
"House"/"Senate" and never the two-thirds figure, the second names a *different* initiative
(1491/2016 vs. 1639/2018).

**Still open across the corpus:** no page has a writing slot (Q7/Q8); `us-elections` has zero
`.term` tooltips while `gun-violence` has 18, so the site's own gloss mechanism is applied
unevenly; and the `us-elections` items from v3.5.0 remain open.

## [3.5.0] — 2026-08-28

**Minor — three scaffold repairs on `us-elections.html`, from a `/reading-intervention` audit.**
Additive only: 3,382 → 3,531 words, concepts 362 → 381, zero terms lost. The skill's own G6
ceiling-preservation diff classifies the change as `elaboration`, which is the point — the
Beck, McKeown, Sinatra & Loxterman (1991) result is that making social studies text more
comprehensible makes it *longer*, and any repair that shortened the page would have been
withheld by the suppression lint instead of shipped.

The audit ran clean on the prose itself. No causal gaps, no dangling referents (all 23
locator candidates resolved on adjudication — 21 against the preceding sentence, 2 against an
`<h3>` the extractor strips but a reader sees), no asserted-relevance anti-patterns, no
altered quotations. Flesch-Kincaid 9.51 → 9.56, in band (6.51–10.34) both times. Every finding
that survived was about the *apparatus* around the prose, not the prose.

- **The primer no longer answers its own quiz.** The "Before you read" block for Section 2
  states "Federal judges are never elected at all"; quiz `q3` asked "Which of the three
  branches of government is NOT filled by election at all?" — the primer supplied the answer
  verbatim before the reader reached the question. `q3` now gives that fact in the stem and
  asks what the setup is *for*, which is answered only in the judicial paragraph ("rule based
  on what the law actually says, without worrying about winning votes to keep their job").
  Distractors rewritten; "represent the voters who live in their district" is there because
  it is the actual misconception.

- **The Indian Citizenship Act, June 2, 1924, added to the voting-rights timeline.** The
  timeline ran 1787 → 1870 → 1920 → 1965 → 1971 with zero occurrences of `indigenous`,
  `native american`, `tribal`, `tribe`, or `1924` anywhere in the file. Washington's SB 5433
  (2015) makes tribal sovereignty curriculum a requirement in every K–12 classroom in the
  state, endorsed by all 29 federally recognized tribes. The new entry carries the Act's own
  words ("citizens of the United States") from the signed original at the National Archives,
  then the part that makes it belong in *this* timeline: citizenship did not come with a
  ballot, Arizona and New Mexico barred Native voters until 1948, and the fight ran into the
  1950s — the 15th Amendment's promise-then-withholding pattern happening a second time.
  Closes in the present tense (29 sovereign tribal governments in Washington today), because
  past-tense-only tribal subjects are the vanishing-Indian framing the myth checklist flags.

- **38 vs. 39 signers reconciled.** "38 delegates signed the finished Constitution" was
  correct and correctly cited — it matches the article's own National Archives source
  verbatim. But a student who checks anywhere else meets 39 and concludes the page is wrong.
  Added the clause the source carries and the page had dropped: George Read signed a second
  time for the absent John Dickinson, so the document holds 39 signatures and 38 signers.
  Two true numbers, one document, and a stated reason they differ.

**Verification.** Every new claim was fetched this run and matched as an exact substring, per
the skill's lateral-reading rule: the signed Indian Citizenship Act (NARA, image of the
original, approved June 2, 1924), NARA's *The Text Message* on the post-1924 state barriers,
NARA's *How Did It Happen?* for both signer counts, and OSPI's *John McCoy (lulilaš) Since
Time Immemorial* for the 29 tribes. The 26th Amendment's "fastest any amendment has ever been
ratified" remains **unverified** and is untouched.

**Still open on this page** (reported, not fixed): the Voting Rights Act entry describes
Section 5 preclearance in the past tense without noting it has not operated since *Shelby
County v. Holder* (2013); the two amendment quotations have no sourcing question; there is no
slot where a student writes about the text. The passage-independence probe (Q1) could not run
— it requires a declared learning target, and this page has none.

## [3.4.0] — 2026-08-27

**Minor — "Before you read" entry blocks on every substantial section, and honest reading
times.** 56 blocks across eight pages, ~2,400 new words against ~36,000 existing. No prose,
citation, or content edits: every `cite-inline`, `.term`/`.term-desc` pair, `<div>` balance,
`<img>`/`onerror` and id set was captured before the pass and re-verified identical against
`b2a76a3` after it.

**What the measurements changed.** The effort began from a reasonable hypothesis — the site
has no reading levels, so below-level readers are unserved — and measuring the corpus
corrected it twice.

First, reading level is largely a *topic* effect. Flesch-Kincaid across the pages ran 6.5
(space-race) to 9.9 (gun-violence) against a stated 5th–6th grade target, but the words
driving the gap are the subject itself: `immigration` appears 58 times, alongside
`nationality`, `naturalization`, `legislature`, `congressional`, `ammunition`. Space Race
scores 6.5 because rockets are concrete, not because it is better written. A site-wide FK-6
target would have fought the vocabulary the standards require, and lost.

Second, the v3.1.1/v3.1.2 story-first rewrite did **not** move reading level: Iran 9.1 → 8.9,
gun-violence 9.9 → 9.9, space-race 6.6 → 6.5. Voice and reading level are independent levers,
so "rewrite everything in the Space Race voice" was never going to be a reading-level
strategy. Recording that here so it is not re-attempted.

The lever is structure, not vocabulary — which also matched the reported classroom use:
sections are already assigned individually, the wall of text loses students at the on-ramp,
and students gravitate to timelines and quizzes over continuous prose.

- **The blocks.** One `<aside class="before-read">` per substantial section, between the
  section head and the article: 2–3 plain sentences, a measured reading time, and a "First:"
  link only where a section genuinely depends on an earlier one. Navigational sections
  (videos, sources, Key People) and anything under 150 words get none. Every block measures
  below the reading level of the page it sits on — the widest gaps are immigration (7.6
  against 9.8) and gun-violence (7.2 against 9.9), which is exactly where it matters most.
  The blocks are where "naturalization" becomes "becoming a citizen" while the section keeps
  the real term behind its `.term` tooltip.
- **Honest times.** Every figure now comes from `tools/reading_time.py` at 130 wpm. Two kinds
  of error were live: gun-violence was advertised at 25–45 min against a measured ~75, and
  the two shortest pages were advertised as *longer* than they are. Its homepage card now
  also says "Long read — assign by section", because a 75-minute page is a planning fact a
  teacher should have before the period, not after.
- **Tooling, checked in.** `tools/reading_time.py` is the single source of truth for every
  minute figure; `tools/verify_invariants.py` is the regression suite this repo otherwise
  lacks. Re-run both after a content refresh.
- **`.on-dark` block variant.** The dated "Situation Update" pane and the `.focus-pane`
  insets are dark on every page, so blocks there invert rather than rendering unreadable.

**What went wrong, and how it was caught.**

- **The section-splitter missed the most-assigned section on every page.** The first version
  of `reading_time.py` split on `<div class="sec-head">`, but the dated "Where Things Stand"
  pane uses `.update-head`. That silently dropped it, undercounting every page —
  gun-violence read 8,749 words instead of 9,715 — and yielded 48 blocks instead of 56.
  Caught by extracting the script from the plan and running it against the real corpus
  instead of trusting it. Splitting on `<h2>` fixes it.
- **Every `.br-time` was one minute short.** Labels were written from pre-block measurements,
  and then the blocks' own words pushed 24 of the 56 sections across a rounding boundary.
  Caught by the plan's own drift check, which compares each rendered label against a fresh
  measurement; corrected by iterating until it converged.
- **A block described the page to the student.** The Iran update block ended "This is the
  longest section on the page" — the same violation as "further down this page", which
  `docs/VOICE.md` exists to prevent. The minute label already carries that information.
- **The pilot passed the reading-level gate on a rounding edge.** First pass measured FK 7.99
  against a `< 8.0` threshold. Treated as a failure rather than a pass; splitting three
  compound sentences brought it to 6.71.
- **Two drafted blocks were wrong until the sections were actually read.** The elections
  block said voters fill two branches directly; the section's point is that only Congress is
  directly elected, the president comes through the Electoral College, and judges are not
  elected at all — the draft would have introduced the misconception the section exists to
  correct. And the Space Race Washington block nearly flattened "Boeing's Starliner is
  assembled in Florida, not Everett" into "Boeing builds spacecraft in Washington."

**Deferred, deliberately.** Splitting `gun-violence.html` (77 min) would break Canvas links
teachers have already made; revisit after a term of classroom use. Converting dense prose
into `.stat-trio`/`.tl-item` components is a content edit that moves cited claims between
elements, and doing it alongside 56 new blocks would make a citation regression hard to
localise — its own effort. The remaining font-size consolidation from v3.3.0 folds into that.

## [3.3.0] — 2026-08-27

**Minor — touch/mobile accessibility floor and a shared token layer.** Structural only: no
prose, citation, or content edits. All nine pages' HTML changes total 13 CSS declarations;
`cite-inline`, `.term`/`.term-desc`, `<div>` balance, `<img>`/`onerror`, and id uniqueness
were captured before the pass and re-checked identical after it.

Driven by a `/edtech-ui-ux` audit of the live v3.2.0 site. Worth recording what the audit
did **not** find: no `#3B82F6`/gray-50 slop hexes, no blue→purple gradients, no Inter or
Roboto, no marketing jargon in the prose ("unlock" is quiz mechanics, "Revolutionary" is the
Islamic Revolution), a disciplined 4-value radius scale, and prose already at
`max-width:700px` / `line-height:1.75`. The newspaper look is a deliberate choice and stays;
the EdTech "warm, rounded, no gray" register was explicitly **not** applied, because the
broadsheet framing is what signals to a student that this is journalism to be read as a
source.

- **Vocabulary tooltips now open on tap.** `.term` revealed its definition only on `:hover` /
  `:focus`. Neither exists reliably on a touchscreen, so on a school tablet the students who
  most need a word defined were the least likely to ever see it — 75 terms across seven
  pages. `site.js` now toggles `.is-open` on tap, with one term open at a time, and closing
  on outside-tap, `Escape`, and scroll. The click is `preventDefault`-ed because several
  terms sit inside `<a>` resource cards, where the naive fix would have navigated away
  instead of defining the word. The `tabindex="0"` / `data-def` / `aria-describedby` →
  `.term-desc` triple is untouched; `data-def` text is byte-identical on all nine pages.
- **Mobile overflow guard propagated to all nine pages.** `body{overflow-x:hidden;
  overflow-wrap:break-word}` existed only on `gun-violence` and `immigration` — the fix had
  been written once and never carried across. This closes the "mobile overflow bug" that had
  been sitting open in the working notes.
- **Reduced-motion now covers page-local animation.** `site.css` had a
  `prefers-reduced-motion` block, but zero of the nine inline stylesheets did, so the
  wrong-answer `.shake`, toasts, progress fills, and photo transitions ran regardless of the
  setting. Broadened in the shared layer. `.shake` is neutralised rather than preserved: the
  answer is already marked in text and colour, so removing the movement loses no information.
- **Homepage lead story no longer scales on hover.** `transform:scale(1.02)` replaced with a
  badge colour shift, plus a `:focus-visible` outline the lead story previously lacked — a
  keyboard-navigation gain that came free with the fix.
- **A11y controls meet the 44px touch floor.** The A/A/A text-size buttons were 32×32px.
  They keep their 32px look via an invisible 44px `::after` hit area, with the cluster gap
  widened to 6px so the expanded areas cannot overlap into mis-taps. These are the
  accessibility controls themselves, so the students likeliest to need them include those
  with the least precise aim.
- **Shared `--ce-*` design tokens.** The audit counted **62 distinct `font-size` values**
  site-wide — seven of them between `.66rem` and `.82rem` — because eight self-contained
  pages each carry their own inline stylesheet and there was no shared scale to drift from.
  `site.css` now defines a namespaced type/spacing/radius/motion scale plus the tap floor,
  adopted within the shared layer. `--ce-*` cannot collide with a page's own `--accent` /
  `--ink` / `--paper`, which stay inline and stay distinct. This pass establishes the
  vocabulary; it does **not** yet collapse the count, which moves 62 → 61 (only the
  `.article p` reconciliation below). The scale exists to be adopted, and the eight inline
  stylesheets are swept in the reading-level effort rather than twice.
- **`.article p` reconciled.** Five pages set `1.18rem`, three (`gun-violence`,
  `immigration`, `us-elections` — the newest and longest) set `1.14rem`. Clone drift, not a
  decision. Standardised on the majority and larger value, `1.18rem`, which favours the
  below-grade-level readers the site names as its audience.

**What was considered and rejected.** Extracting shared component CSS (`.article`, `.quiz`,
the points engine) out of the eight inline stylesheets would collapse the 62-size problem at
its root, but it breaks the one-file-per-topic model the working notes protect deliberately.
Left alone; reopening it is its own effort, not a side effect of an accessibility pass. The
remaining font-size consolidation is staged to fold into the reading-level work rather than
sweeping eight stylesheets twice.

**How this was checked.** `site.js` was executed against all nine real pages in jsdom, not
inspected: nine behavioural assertions on the tooltip (open, toggle, single-open, outside
close, Escape, scroll, `preventDefault`, and the full accessibility wiring), plus text-size
and dyslexic-font toggles per page. 9/9 pages pass. Invariant counts were diffed against
`main` rather than eyeballed.

## [3.2.0] — 2026-08-27

**Minor — weekly news refresh on pages whose August 18 snapshots were overtaken.** Dated to August 27, 2026. Gun violence, Space Race, and AI were checked and left alone: no sourced development in that window was large enough to rewrite those snapshots. Casualty, ICE/TRAC fiscal-year, and front-line km² totals that were already cited were not reinvented.

- **Iran.** Hormuz is still a trickle, not a reopened strait. Kpler counted five confirmed crossings on August 25, down from more than 130 a day before the war (CNBC). Iran and Oman announced a temporary seven-mile shipping corridor and a mine-clearing project on August 26, while Iran said the waterway would not fully reopen until the United States met conditions from the expired June memorandum (Al Jazeera). Qatar's prime minister was in Tehran on August 27; President Trump said he had "no time schedule" for restarting talks (CNBC). The June 17 / August 17 peace-clock history stays.
- **Ukraine.** First-half 2026 Al Jazeera 622 / net 97 km² and ISW's August 1 ~38 km² July figure stay with their original as-of dates. ISW's August 23 assessment still finds no operational breakthrough; Russian forces were still trying to set up attacks on Slovyansk and the Donetsk Fortress Belt. Zelenskyy described a joint Ukraine–U.S.–Europe page of ideas (ceasefire, a third-party Donbas economic zone, NATO/EU roles) and a mediation window from the December 2026 G20 through summer 2027 (RTÉ, Aug. 25). The Kremlin questioned the economic-zone idea (RTÉ / ISW).
- **Elections.** Midterms countdown is **68 days** from August 27 to November 3, 2026. Cook's Senate Toss Up list is six races as of August 20, including Texas and Iowa, which Cook moved from Lean Republican (Cook ratings page). On August 25 Cook moved FL-14 and MI-10 from Lean Republican to Toss Up (Newsweek reporting Cook). House/Senate flip math and the 60 House / 11 Senate retirement counts were not reinvented.
- **Climate.** The August 1 emergency and 425,000-acre DNR figure stay as that day's count. On August 24, DNR's Thomas Kyle-Milward told KOMO the season was over 800,000 acres burned, with 15 large uncontained fires, the third-worst by acres since 2015, and firefighters likely working into October.
- **Immigration.** September 2026 Visa Bulletin: India EB-3 still January 1, 2014; India EB-2 still unavailable (Fragomen, citing the State Department chart). ICE's July 21 FYTD removal (356,389) and detention (65,765) figures stay. A later AP/PBS drop adds July's monthly arrest total: 49,571, up from 43,021 in June. TRAC's June 30 court backlog was not reinvented.
- **Homepage.** Ticker and featured-story countdown rewritten from the live snapshots.

**How this was checked.** Each new claim was read in the source, not trusted from a search snippet. Cook's Senate Toss Up count (6) was taken from Cook's own ratings page dated August 20. The House addition is reported as two named rating shifts rather than a guessed new toss-up total, because Cook's full House list is paywalled. The official State Department September bulletin URL is cited alongside Fragomen after a direct fetch of travel.state.gov timed out.

## [3.1.2] — 2026-08-18

**Patch — site-wide voice pass.** Applied the Space Race story-first rewrite to the rest of the live topics. Same facts, citations, and August 2026 snapshots. Cut student-facing "this page" asides, dated undated "now / today / right now" news framing, and connected stacked sentences so the story carries the facts.

- **Iran.** Dek now matches the 2026 war (a 60-day peace clock, not a 12-day 2025 war). The Section 1 line that still said "as of July 17, the two sides are still fighting" now follows the fighting through the August 17 deadline, cited to the same AP story already in the update pane. The Hormuz costing box connects to the spreading box instead of repeating "still barely moving." Why It Matters callouts hand off (oil → pump prices; partners → a war that's harder to stop; 70 years of U.S. choices → why American forces are already nearby).
- **Ukraine.** The Bucha pull-quote no longer copies the two sentences above it. Front-line 622 / 97 / 38 km² figures stay, with connective tissue. Peace-talks meetings get a bridge sentence. Headings and the "still developing" warning are dated to the August 18 snapshot.
- **AI.** Hero no longer stacks four disconnected claims. Stanford SETR is named without "later on this page." Wolf and Winthrop's "human element is irreplaceable" is dated to their April 2025 conversation. Quote punctuation is untouched.
- **Elections.** Control snapshot dated August 18, 2026. Cook Toss Up lists are Cook's ratings, not a classroom guess. Candidate links go to the candidate's own site. Madison and Lewis are history; sitting officials stay in the update and the local-district section.
- **Climate.** The June–July heat wave now hands off to Washington's fourth drought year and the August 1 wildfire emergency. Myers and Missik disagree about what the 0.5% drop *means*, not about the 96.1 million figure. CCA cents-per-gallon stays unsettled without "this page won't state one."
- **Immigration.** The two histories (choice vs. forced migration) are told as story. Both ICE stated positions are reported rather than picked. The system section is "how it is built." The enforcement pointer now sends students to the update *above* (it had said "below").
- **Gun violence.** Dek puts policy-not-headlines in the student's ear. The content note warns about the next paragraphs, not "this page." K-12 School Shooting Database counts are named without "this page uses." Brady and Kohl are history.
- **Homepage.** Iran card names the 2026 U.S.-Israel war. Immigration card names the August 2026 snapshot. Suggest-a-topic copy left as-is (it has to say the form doesn't store what you type).

Teacher Konami tips, hero nonpartisanship notes, and discussion questions that treat the explainer as a classroom object were left in place.

The standing story-first note for future updates is now in [`docs/VOICE.md`](docs/VOICE.md), and the README contribution guidelines point to it.

## [3.1.1] — 2026-08-18

**Patch — Space Race voice pass.** Rewrote `space-race.html` so paragraphs connect instead of stacking facts. Cut the "this page" asides that broke the story, gave Starliner a clear job-change before the dates, and matched the site's story-first tone (same facts, citations, and August 2026 snapshot).

## [3.1.0] — 2026-08-18

**Minor — leftover pass after v3.0.0: Suggest a Topic, August freshness on the remaining pages, Space Race reading-level pass, unused chrome removed.**

- **Suggest a Topic is now a first-class homepage section.** The empty Coming Soon rail stays gone. Students and teachers can send an idea with a short form that opens a prefilled school email (nothing is stored on the site) or use a GitHub issue template. Topic pages link to it from the masthead.
- **August freshness on Climate, Immigration, and Gun Violence.** Climate: Washington's August 1 wildfire emergency and burn ban, with DNR acreage from the governor's proclamation and NASA Earth Observatory for the July 31 "particularly dangerous situation" alert — replacing the April "fire officials expect" forecast. Immigration: August 2026 Visa Bulletin (India EB-3 still January 1, 2014; India EB-2 unavailable through the fiscal year), cited to Ogletree's table of the State Department chart. Gun Violence: Texas HB 3's armed-officer rule still unfinished as the 2026–27 year started (KXAN district check + Leander ISD's own August 5 update). Date stamps and stale-link notes moved to August 18. ICE and TRAC figures on Immigration keep their original July/June as-of dates; they were not re-invented.
- **Space Race 3-persona pass.** Nav no longer says "What's Happening Now." Jargon simplified (no "redesignates," "pathfinder," or "dissimilar redundancy"). Inline vocabulary + screen-reader definitions, classroom discussion questions, a dated-snapshot note, and a short "this is Social Studies, not rocket science" frame. Unused climate-clone CSS (`.stat-pair`, `.gh-steps`) removed from that page.
- **Cleanup.** Homepage teacher download line now names `site.css`, `site.js`, `fonts/`, and `images/`. Unused Coming Soon / planned-badge / small-item CSS removed from `index.html`. README no longer lists translation as if it already shipped.

## [3.0.0] — 2026-08-18

**Major — accessibility floor, shared CSS/JS, August freshness, chrome unification, and Space Race 2.0 ships.**

- **Accessibility.** Every page now has a skip link, A/A/A text-size controls (including the homepage), and a self-hosted OpenDyslexic webfont (`fonts/OpenDyslexic-Regular.woff2`, SIL OFL) instead of the cdnfonts stylesheet. The dyslexic font is scoped to reading text — not maps, nav, buttons, or SVG. `prefers-reduced-motion` stops the homepage ticker and other decorative motion.
- **Shared CSS/JS, still no build step.** Page-specific palettes, heroes, maps, and quizzes stay in each HTML file. Shared accessibility lives in `site.css` / `site.js`. Topic pages are no longer one-file islands; downloading a page for offline use also needs those two files plus `fonts/`.
- **Chrome unification.** All topic pages use the magazine masthead **Current Events Explained** (not "The Current Events Desk"). Sibling links live in `masthead-top`. Sticky `section-nav` is in-page `#` anchors only.
- **August freshness.** Homepage ticker rewritten from the live topics (no leftover March-era Iran strikes or "NEW" Ukraine/AI). US Elections stays the featured story and is no longer duplicated as a grid card. Midterms countdown is **77 days** from August 18 to November 3, 2026. House retirements: 60 as of August 2026; Senate: 11 as of July 2026 (not mixed with other "won't return" definitions). Iran lede/update: the June 17 60-day peace deadline expired August 17 with no deal (AP); Hormuz trickle of 3 vessels on August 16 and UAE missiles August 18 (CNBC). Ukraine: keeps first-half 2026 Al Jazeera 622 / net 97 km² and adds ISW's August 1 assessment (~38 km² July advance; spring-summer offensive, no operational breakthrough). Relative "Now" / "more than a week" phrasing removed from the Iran timeline.
- **Accents.** Iran moves to Persian lapis (`#245a8c`), Ukraine to deeper sky (`#2e6a9a`), AI to violet/ink (`#4a3f6b`), so they no longer share the default newsprint red with each other or with elections navy.
- **Climate density.** Washington's 51M / 96.1M emissions pair is now a trio (4th drought year). Greenhouse-effect section gets a 3-step restatement next to the existing diagram. No science claims rewritten.
- **AI rebalance.** School remains a focus pane. A sourced jobs/displacement section (Pew August 18, 2026: 71% of U.S. adults expect fewer jobs; February 2025 worker survey) is now part of the spine. "Talking to Animals Using AI" is demoted to further reading. Quotes and prior citations left intact.
- **New page `space-race.html`.** History of the first race (Sputnik, Gagarin, Apollo 11), a dated August 2026 Artemis snapshot (III as an Earth-orbit docking test; landing planned later), Washington's angle via Blue Origin in Kent (Boeing named carefully — Starliner is not built in Everett), historical Key People only, quizzes, videos, citations. Wired into the homepage grid (moved out of Coming Soon).

## [2.8.0] — 2026-07-29


**Minor — ship-readiness visual-polish pass: image-coverage gaps closed on three pages, climate-change.html gets its own accent color, graceful image-load-failure handling ported site-wide.**

- A final "does every page look ship-ready" pass, prompted specifically by image coverage, found four concrete gaps and fixed all of them: `us-elections.html` had only 3 `<img>` tags total, with four main content sections (`#branches`, `#elections-mechanics`, `#checks-balances`, `#local-representation`) entirely image-free — each now has a real, Wikimedia-Commons-sourced photo. `ukraine.html`'s `#empire` section (Shevchenko, serfdom, 1917 independence) was a pure text wall unlike every other section on the page — given an image. `ai.html` had four consecutive image-free deep-dives (`#school`, `#animals`, `#hinton`, `#agentic`), the site's worst text-wall stretch — each now illustrated. All nine new images verified individually on their own Wikimedia Commons file pages for license and subject match before use.
- `climate-change.html` moved off the shared default red accent (`#a02c2c`, still used by `iran.html`/`ukraine.html`/`ai.html`) onto its own distinct green/earth-tone accent (`#3d6b35`), matching the deliberate per-page accent treatment `us-elections.html`/`immigration.html`/`gun-violence.html` already have — closes a gap flagged as "reads unfinished," especially since this page was originally meant as the site's editorial-redesign reference. A reviewer follow-up caught and fixed a hero kicker-text contrast issue introduced by the new accent.
- Ported the graceful `onerror` image-load-failure fallback (previously only on `immigration.html`/`gun-violence.html`) to every `<img>` tag on `iran.html`, `ukraine.html`, `climate-change.html`, `ai.html`, and `us-elections.html` — including the nine images added by this same effort — so a failed image load degrades gracefully instead of showing a broken-image icon.
- A fresh, independent whole-batch verification pass (image-file existence, full `onerror` coverage, citation-count-unchanged, div balance, no duplicate ids, zero remaining old-accent-color references) confirmed all five touched pages clean with no regressions; no fixes were needed at verification time. That pass was static/structural only (grep, tag-balance, id-census) — no browser tool has been available in any session on this project, so visual rendering was not interactively confirmed and remains a standing limitation noted for future work.

## [2.7.0] — 2026-07-28

**Minor — Gun Violence & School Safety Policy page ships; site-wide 3-persona review pass fixes the other six pages.**

- New page `gun-violence.html` — "Keeping Schools Safe," the seventh topic on the site and the most nonpartisanship-sensitive page built to date. Built policy-and-prevention-first rather than incident-first: opens with a lockdown-drill narrative hook, then a dated update-pane reusing Immigration's differing-perspectives component for three genuinely contested current questions (assault-weapons ban, minimum purchase age, red-flag laws — each with named, equally-weighted DHS/AIC-style sourcing on both sides), scale/stakes data including a 50-state gun-death-rate choropleth map and a separate ranked school-shooting-incident table (Washington's rank called out on both), the Second Amendment and four landmark federal laws, school-safety measures actually tried (metal detectors, SROs, drills, threat assessment — including a UCLA researcher's on-record reversal of his own prior theory), how federal/state policy mechanics split, Washington's own extreme-risk-protection-order law and school-security funding, a four-country international comparison (Australia, Japan, Switzerland, Canada) held to an accuracy-not-balance standard as settled fact, a history timeline, two historical Key People (James Brady, Herb Kohl), a strictly balanced-pair "Groups Working on This Issue" resource section (one gun-violence-prevention org, one gun-rights org, identical treatment), and a closing discussion-question set for classroom use.
- Built through a 17-task plan with per-task review, three rounds of mid-build user-directed additions (a full section reorder to open with scale-of-the-problem rather than history, a 50-state comparison subsection, an opening narrative hook), and a closing round of fixes driven by an explicit 3-persona review (an AI roleplaying an 8th-grade student, an 8th-grade teacher, and a UX-focused edtech developer, each reading the live page independently) — which caught a genuine points-accounting bug (the max achievable score undercounted three discoverable easter eggs), a missing screen-reader wiring gap on the inline vocabulary tooltips, and a cold, unwarned opening into lockdown-drill content that a teacher reviewer flagged as needing a brief content note first.
- The 3-persona review method proved valuable enough to run against the rest of the site: `iran.html`, `ukraine.html`, `climate-change.html`, `ai.html`, `us-elections.html`, and `immigration.html` were each reviewed the same way and fixed in a follow-up 8-task pass. Ported text-size accessibility controls and the `.term` tooltip screen-reader wiring (`aria-describedby`) to every page that lacked them, added mobile-responsive stacking to every page's history timeline that was missing it, and brought `climate-change.html` up from having no interactive components at all to the site's full points/quiz/easter-egg engine (a gap traced back to an earlier planned visual-redesign prototype file that was never actually merged — corrected in project records). Page-specific fixes: a buried casualty detail on `iran.html` given its own callout, a reflection prompt added after `ukraine.html`'s Bucha passage, a new sourced misinformation/academic-integrity subsection and a regulation-tradeoffs counter-perspective added to `ai.html`, and a labeling-consistency fix on `immigration.html`'s DHS/AIC update-pane comparison.
- One real citation-accuracy bug was caught and fixed mid-effort: a school-shooting statistic on the Gun Violence page was cited to the wrong RAND report (one about school resource officers, which didn't contain the figures); corrected to the report that actually does.

## [2.6.0] — 2026-07-26

**Minor — site-wide reading-level pass on four pages, plus a new inline vocabulary-tooltip component ported everywhere.**

- A post-launch audit of `immigration.html` (comparing its two-pass reading-level work against the site's other five pages) found `ai.html` and `ukraine.html` were the furthest from the site's 5th–6th grade target — both predate the `.term` inline tooltip component introduced with Immigration, so jargon was defined inline via parentheticals (e.g. "the Bolsheviks (the communist revolutionaries who created the Soviet Union)"), which reliably bundles multiple ideas into one long sentence. `iran.html` and `us-elections.html` were already close to target and needed only light touch-ups.
- `ai.html` and `ukraine.html`: full reading-level rewrites, following the same process and integrity bar as Immigration's own rewrite — every direct quote, citation, and `.vocab` box verified byte-identical before and after (ukraine.html: 22 quotes independently re-verified, including sensitive Holodomor/wartime quotes; citations and vocab boxes confirmed unchanged on both pages). The `.term` tooltip component (hover- and keyboard-focus-triggered, ported from `immigration.html`) now carries the jargon that used to live in parentheticals — 12 tooltips added to each page.
- `iran.html` and `us-elections.html`: light touch-ups only — a handful of clearly-bundled em-dash sentences split, `.term` ported for site-wide consistency (with each page's own accent color, not a shared hardcoded one — `us-elections.html` keeps its deliberate navy/gold palette). `us-elections.html`'s two touched sentences (Speaker of the House, Senate Majority Leader) were independently verified against the party-swap nonpartisanship test; `iran.html`'s existing attribution language (e.g. "though the Israeli military denied being responsible") was verified character-for-character unchanged.
- One real mistake caught and fixed mid-effort: an early fix attempt on `ai.html` moved a period from outside to inside a closing quotation mark on three quotes, which turned out to still not match the original — the original quotes had no trailing punctuation at all, since they sat mid-sentence rather than at a sentence's end. The correct fix restructured the surrounding sentences so each quote could stay in its original grammatical position instead of forcing punctuation next to it.

## [2.5.1] — 2026-07-26

**Patch — fixed broken cross-page navigation on climate-change.html, introduced by v2.5.0's Immigration site-wiring.**

- A follow-up site-wide audit (reading level + navigation, run right after the Immigration launch) caught that the sibling-nav link added to `climate-change.html` in v2.5.0 had landed in the wrong nav bar — an orphaned `<a href="immigration.html">` sitting alone atop the in-page `section-nav`, while the actual sibling-links list in `masthead-top` never got Immigration added at all. Moved the link to the correct bar.
- The same audit also surfaced two larger, deliberately-deferred follow-ups, tracked for future work: (1) a site-wide inconsistency in where hub/sibling nav links live — older pages (`iran.html`, `ukraine.html`, `ai.html`, `us-elections.html`) put them in `section-nav`, while `climate-change.html`/`immigration.html` put them in `masthead-top` instead; every page still reaches every other page, just via a different location — and (2) a reading-level pass on `ai.html` and `ukraine.html`, ranked as the two pages furthest from the true 5th–6th grade bar `immigration.html` reached in its v2.5.0 build (both pages predate the `.term` tooltip component and currently carry jargon via inline parentheticals instead).

## [2.5.0] — 2026-07-26

**Minor — Immigration & U.S. Policy page ships, built directly in the editorial design system.**

- New page `immigration.html` — "A Nation of Immigrants," the sixth topic on the site and the first genuinely new topic since the site-wide editorial redesign completed. History-first structure: colonial-era immigration (with Indigenous peoples' prior presence and the transatlantic slave trade both stated explicitly, not folded into a "waves of immigration" narrative), the Great Waves (Ellis Island, Angel Island, the Chinese Exclusion Act), the 1924 national-origins quota system, the 1965 Immigration and Nationality Act, how the system works today (visa/green-card categories, naturalization, asylum vs. refugee status, and a neutral explainer of ICE's origin and legal authority), a dated update-pane, Washington's Immigration Story (Scandinavian settlement, Japanese American incarceration at Minidoka, Southeast Asian refugee resettlement via Camp Murray), a history timeline, two historical Key People (Irving Berlin, Emanuel Celler), videos, and resources.
- Built through a full 16-task plan with per-task review and a dedicated final verification pass — every citation independently fetched and confirmed to support its specific claim (one mid-build citation mismatch in the update-pane was caught and corrected before shipping, along with a 404'd link and two dead easter-egg code paths).
- Introduced one new, deliberately narrow-scoped component: a side-by-side "differing perspectives" block, used only for genuinely contested present-day claims in the update-pane's ICE-enforcement coverage (e.g., named, sourced, equally-weighted positions from DHS and the American Immigration Council on who is being arrested) — settled history elsewhere on the page (the Chinese Exclusion Act, the 1924 quota system, Japanese American incarceration) is stated as plain fact, not run through this component, since accuracy rather than false balance is the standard for settled history.
- Reading level went through two dedicated passes: an initial simplification plus inline vocabulary tooltips (hover- and keyboard-focus-triggered, for terms like green card, naturalization, and asylum), followed by a second, more aggressive rewrite to a genuine 5th–6th grade target after the first pass was judged still too advanced — every citation, direct quote, and tooltip definition was independently verified byte-identical before and after this second pass.
- `index.html`: Immigration moved from "Coming Soon" into the live topic grid (reusing its own hero image, an 1887 engraving of immigrants viewing the Statue of Liberty, rather than sourcing a duplicate asset); the vacated "Coming Soon" slot backfilled with the site's next two roadmap topics, Gun Violence & School Safety Policy and Space Race 2.0. All five other topic pages received a new cross-page nav link to Immigration.

## [2.4.0] — 2026-07-23

**Minor — US Elections & Government page rebuilt; site-wide editorial redesign complete.**

- `us-elections.html` fully rebuilt in the same warm-newsprint editorial system as every other page — same civics content, sources, and citations as before, restyled: the three-branches diagram, the checks-and-balances data table (kept as a table, not reverted to an earlier circles/arrows draft), the 2026 midterms update-pane, the Alderwood-area district lookup (WA's 21st Legislative District / 1st Congressional District) with full candidate lists, a 5-entry voting-rights history timeline, Key People (James Madison, John Lewis), both videos, resources including the dated midterms-links subsection, and all 6 quizzes.
- Deliberately kept this page's own navy/gold accent color instead of the shared newsprint red used on every other page — the original build chose navy/gold specifically to avoid an accidental red/blue two-party visual cue, and that reasoning still holds under the new design system.
- Fixed three dead easter-egg code paths found during the rebuild: a stat-click handler, a timeline double-click reveal, and the 5pt/10pt point-unlock tiers all referenced DOM element IDs that didn't exist anywhere in the live page, so triggering them silently did nothing. Given real targets: the House/Senate stat-pair now reveals a sourced bonus fact about the House's fixed 435-seat cap versus the Senate's constitutionally-set size, and the timeline double-click reveals a sourced fact about the 17th Amendment (direct election of Senators). Adjusted the max achievable point total to match.
- Nonpartisanship discipline preserved exactly: officeholders named by role only, every candidate list shows party equally, all platform links go only to each candidate's own campaign site — no wording, dates, or numbers were refreshed as part of this restyle.
- **This completes the site-wide editorial redesign begun in v2.0.0.** Every page — `index.html`, `iran.html`, `climate-change.html`, `ukraine.html`, `ai.html`, and `us-elections.html` — is now on the unified warm-newsprint design system. Future new topics (Immigration, Gun Violence, Space Race) will be built directly in this system from the start.

## [2.3.0] — 2026-07-23

**Minor — AI & Society page rebuilt in the editorial design system.**

- `ai.html` fully rebuilt in the same warm-newsprint editorial system as `index.html`, `iran.html`, `climate-change.html`, and `ukraine.html` — same content, sources, and citations as before, restyled: all 4 deep-dive focus-panes (AI in Schools, AI and Animals, Geoffrey Hinton's Warning, Agentic AI), an 18-entry history timeline, 7 Key People, all quizzes, and all four easter eggs (a hidden binary-code message, a timeline pop-culture fact, a hover-all-portraits reward, and a Konami-code egg).
- Fixed a minor content redundancy found during the rebuild: the timeline's hidden-history easter egg referenced Geoffrey Hinton's Nobel Prize, which the page already covers in its own focus-pane — swapped for a different, still-sourced fact (the 1956 Dartmouth workshop where the term "artificial intelligence" was coined) so the egg stays a genuine surprise rather than a repeat of content already on the page.

## [2.2.0] — 2026-07-23

**Minor — Ukraine page rebuilt in the editorial design system.**

- `ukraine.html` fully rebuilt in the same warm-newsprint editorial system as `index.html`, `iran.html`, and `climate-change.html` — same content, sources, and citations as before (verified during the rebuild), restyled: the interactive Leaflet map (Kyiv + 10 site markers + Ukraine border), the full history arc (Kievan Rus' → the Russian Empire → the Holodomor deep-dive → independence → the Orange Revolution/Euromaidan → the 2022 invasion → where things stand now), a 15-entry history timeline, 4 Key People, 4 videos, 15 resources, all 8 quizzes, and the full points/easter-egg engine (flag-click, a "type UKRAINE" hidden-poem egg, a timeline triple-click egg, a hover-all-portraits egg). Nonpartisanship discipline preserved exactly as it was in the prior version — attribution/denial phrasing (e.g. Russia's denial of responsibility for Bucha, described alongside the evidence against it) was not softened or hardened during the rewrite, only restyled around.
- Fixed a real content bug found during the rebuild: the timeline's hidden-history easter egg contained leftover content from `iran.html` (1960s Shah-era material, unrelated to Ukraine — an old copy-paste error). Replaced with a real, sourced Ukraine fact: the 1954 transfer of Crimea from the Russian SFSR to the Ukrainian SSR under Khrushchev.
- Added Subresource Integrity (`integrity`/`crossorigin`) attributes to the Leaflet.js CDN tags, matching the hashes already verified and applied on `iran.html`.
- The Holodomor deep-dive section's full-bleed photo needed its own layout treatment: it's the first page to nest a breakout photo inside a dark inset panel (`.focus-pane`) rather than the plain article column, so the panel is now split around the image (heading → full-bleed photo → body text) with the dark background continuing unbroken behind it, instead of the photo either being squeezed into the panel's narrower text column or breaking out past the panel's own edges onto the page background.

## [2.1.0] — 2026-07-23

**Minor — Climate Change page ships; homepage topic grid fixed to show it and US Elections.**

- New page `climate-change.html`, built in the v2.0.0 editorial design system from the start (the first new topic to launch under it, rather than a retrofit of an older page). Deep-time framing led by ice-core evidence (EPICA Dome C's 800,000-year record, the Keeling Curve), the greenhouse effect, observed global/Pacific-Northwest effects, and a dedicated Washington's Climate Story section (the Climate Commitment Act, the state's electricity mix, its carbon footprint) — the section held to the same strict nonpartisanship discipline established on `us-elections.html`, including reporting two named experts' differing reads of the same emissions data rather than picking one. All content and citations verified against primary sources; several editorial-critique passes fixed redundant stat/paragraph pairs, tightened pull-quote usage to genuine excerpts rather than spoilers, and widened image variety.
- `index.html`: Climate Change moved out of "Coming Soon" (it had gone stale — the page was already live) and added to the topic grid alongside a new **US Elections & Government** card, which had been missing from the homepage entirely since that page shipped in v1.2.0 (linked only from the nav bar, with no card). Switched the topic grid from a hardcoded 3-column layout to a responsive `auto-fit` grid so it wraps cleanly regardless of how many live topics exist.
- Trimmed ~31 sourced-but-unused images from the climate build, left over from two earlier layout experiments (a snap-scroll card prototype and a margin-notes prototype) that were tried, critiqued, and superseded before landing on the final editorial design — only the 9 images actually referenced in the shipped page were kept.

## [2.0.0] — 2026-07-23

**Major — site-wide editorial visual redesign begins (homepage + Iran rebuilt).**

- New site-wide design system replacing the original card/pill/drop-shadow look: a warm-newsprint editorial identity fused from three real publications' documented conventions — NYT's headline-size hierarchy for front-page/homepage layout, The Atlantic's full-bleed hero-photo-behind-headline article treatment, The New Yorker's spare single-column reading body with drop caps opening each major section. Palette: off-white paper, near-black ink, a single restrained newsprint red used only for labels/rules/accents (never as a fill). Typography: Playfair Display (headlines) + Source Serif 4 (body) + system-sans (nav/labels/captions). Signature element carried through every page: a large drop cap opens the first paragraph of every major section, not just the page's very first paragraph.
- `index.html` rebuilt: replaced the equal-weight topic-card grid with an NYT-style hierarchy — one large Featured Story lead (full-bleed photo, biggest headline on the page), a 3-up medium tier for the other live topics, and a dense small-headline rail for Coming Soon/Planned topics. Site title changed from "Mr. B's World" to **"Current Events Explained"**, with a new subhead stating the site's actual purpose plainly (explaining the background behind the news, not just reporting it). All "back to main site"-style links (previously split between `ss8.mrbsocialstudies.org` and `mrbsocialstudies.org`) consolidated to point at `mrbsocialstudies.org` throughout.
- `iran.html` fully rebuilt in the new system — same content, sources, and citations as before (verified against the prior version during the rebuild), restyled: the 3-box "Where Things Stand Now" update-pane, the full history timeline, all 6 Key People, the Leaflet.js interactive map (Tehran/Persepolis/Isfahan/Shiraz markers + Iran outline), all 8 quizzes, and the full points/easter-egg engine (flag-click Farsi phrases, geography stat-click bonus, hidden 1960s timeline entry, Konami code) all preserved functionally. One deliberate change: the timeline's hidden-history easter egg, previously triggered by double-clicking an invisible spot near a vertical timeline line, is now an explicitly labeled (if unobtrusively styled) button — the new layout has no timeline spine element to hide a click target against, so it trades a bit of "secretness" for real discoverability.
- Added Subresource Integrity (`integrity`/`crossorigin`) attributes to the Leaflet.js CDN `<link>`/`<script>` tags on `iran.html` — a pre-existing gap (present before this redesign too), fixed opportunistically while the file was already being rebuilt.
- Ukraine, AI & Society, and US Elections pages are still on the pre-redesign visual system as of this release; each will get its own dedicated rebuild pass (not a blind CSS swap, given how differently each page's content is shaped) in follow-up releases.

## [1.2.0] — 2026-07-21

**Minor — new topic page added: US Elections & Government.**

- New page `us-elections.html`, built from scratch (fourth topic on the site, first not adapted from a prior draft) matching `iran.html`/`ukraine.html`/`ai.html`'s established structure: durable civics content (the three branches, how elections actually work, checks and balances) plus a live update-pane tied to the 2026 midterms, a local section naming the specific state legislative and congressional district that covers this school (Washington's 21st Legislative District / 1st Congressional District — corrected mid-build from an initially-misidentified 32nd/2nd via a direct U.S. Census Bureau geocoder cross-check), a history timeline (1787 Constitutional Convention through the 26th Amendment), two historical Key People profiles (James Madison, John Lewis — deliberately no current officials), two videos, and a resources section including a dated "Keep up with the 2026 midterms" curated-links subsection.
- This page's defining constraint, more than any prior page on this site: strict nonpartisanship, verified via a dedicated party-swap test applied per content section, not just as a final pass. Current officeholders are named by role only, never by party; filed-candidate lists show party for every candidate equally; candidate platform links go only to each candidate's own campaign site/statement, never a third-party characterization.
- Two custom inline-SVG/CSS diagrams: a three-branches relationship diagram (rectangular boxes with two arrows: "sends bills to," "appoints judges to") and a checks-and-balances comparison — the latter went through several rounds of visual iteration (circles → rectangles with arrows → a plain data table) before landing on the table format, which turned out to be the clearest way to present 5 distinct branch-to-branch checks without illegible crossing-line labels.
- `index.html`: US Elections takes over the site's Featured Story slot (previously Iran); Iran is demoted into the regular topic-card grid, matching Ukraine's/AI's card format exactly. Site-nav updated with a new "🗳️ US Elections" link.

## [1.1.5] — 2026-07-21

**Patch — real citation added for a previously-unverified image, no other content changed.**

- `ai.html`'s ENIAC photo (`images/early-computer.jpg`) had an honest "we could not confirm exactly where this photo came from" disclosure, added during the AI page's July 2026 refresh audit after no verifiable source could be found at the time. The site owner supplied the real source directly (a specific Wikimedia Commons file page); independently confirmed via two separate fetches (the first, via a Wikipedia article's `#/media/` fragment link, actually returned a DIFFERENT image's caption from the same article page — a real mismatch, caught by re-fetching the Commons file page directly rather than trusting the first result). Confirmed match: Glen Beck and Betty Snyder programming the ENIAC in Building 328 at the Ballistic Research Laboratory, c. 1947–1955, U.S. Army photo, public domain. Updated the `alt` text and caption to name the actual people and location, replacing the honest-but-now-outdated disclosure.

## [1.1.4] — 2026-07-20

**Patch — navigation fix, no CSS beyond two small reused-pattern additions.**

- `iran.html`, `ukraine.html`, and `ai.html` each have a `sticky-nav`, but it was entirely in-page (anchor links to sections like `#now`, `#timeline`) — none of the three linked back to `index.html` or to each other. A student landing directly on one topic page (via a shared link, bookmark, or search result) had no way to discover the site's other topics or return to the hub without editing the URL by hand. Added a "🏠 All Topics" link plus two sibling-topic links to the front of each page's existing `sticky-nav`, matching `index.html`'s own `site-nav` pattern (which already linked out to all three topics correctly). Reused existing CSS custom properties and pill classes already defined on each page (`.n-dark`/`.n-teal` on Ukraine and AI; two new small classes on Iran, `.n-hub`/`.n-sib`, using colors already defined via existing CSS variables) — no new colors introduced.
- Found and deliberately left unfixed: a pre-existing mobile-width horizontal-overflow bug (clips the hero headline and some nav pills on narrow screens) present on at least `ukraine.html` before this change — confirmed via a before/after screenshot comparison that it predates this fix and isn't something this patch worsened in kind, only added one more wrapped nav row on top of. Worth its own investigation across all three pages in a future pass.

## [1.1.3] — 2026-07-20

**Patch — link correction, no page content changed otherwise.**

- Updated stale references to the author's curriculum site. `README.md`'s Related Projects section pointed to a GitHub repo (`socialstudies8`) under two different link labels that both resolved to the same URL; replaced with a single entry pointing to the live site, [mrbsocialstudies.org](https://mrbsocialstudies.org). `index.html`'s About section similarly pointed its "American Yawp Jr." link at the same GitHub repo; updated to point at mrbsocialstudies.org. The separate, still-current `ss8.mrbsocialstudies.org` "main class site" link was left unchanged.

## [1.1.2] — 2026-07-20

**Patch — docs/tooling, no page content changed.**

- Renamed `current-events-README.md` to `README.md`. GitHub only auto-renders a repo's front page from a file literally named `README.md`, so the repo appeared to have no README even though the file existed with correct, up-to-date content. Renamed via `git mv` to preserve file history, and updated the two live self-references (this file's own File Structure diagram, and `CHANGELOG.md`'s pointers to the Versioning section) — the v1.1.1 entry below still refers to the file by its name at that time, since it's a historical record of what that patch actually did.

## [1.1.1] — 2026-07-20

**Patch — docs and tooling, no page content changed.**

- Fixed `current-events-README.md`'s stale Topics table (Ukraine and AI were listed as "Planned" when both had been live since March 2026) and its File Structure section (described a `topic/index.html` folder layout that never matched the site's actual flat `iran.html`/`ukraine.html`/`ai.html` structure).
- Introduced this versioning system itself: `VERSION`, `CHANGELOG.md`, and the **Versioning** section in the README documenting what counts as Major/Minor/Patch and when to bump.

## [1.1.0] — 2026-07-20

**Minor — full content refresh of two existing pages.**

- Refreshed `iran.html` and `ukraine.html`'s "what's happening right now" content from stale March 2026 framing to July 2026, covering the ceasefire → peace deal → collapse arc (Iran) and the Feb–July 2026 negotiation timeline (Ukraine).
- Audited both pages' images and citation links, and fixed real problems found along the way:
  - A Mahsa Amini protest photo mislabeled as being from inside Tehran (it was a diaspora solidarity photo from Amsterdam), cited to a dead Wikimedia Commons URL.
  - A separate Mahsa Amini image used as her Key People "portrait" that was actually a photo of a protest sign, not a real photo of her — no free-licensed portrait of her exists, so the card now uses an honest fallback state with an explanatory note instead of a misleading photo.
  - Several dead or silently-broken citation links across both pages, including a CIA World Factbook citation that returned `200` but redirected to unrelated content after the Factbook was permanently discontinued in February 2026.
- Established a site-wide content rule: never use relative-time phrasing ("now," "currently," "as of now") to describe an evolving event's present status — always an explicit date, since pages are refreshed periodically and relative phrasing goes silently stale between refreshes. Applied retroactively across both refreshed pages.
- Full detail: `docs/plans/2026-07-17-iran-ukraine-refresh-design.md` and `docs/plans/2026-07-17-iran-ukraine-refresh-implementation.md`.

## [1.0.0] — 2026-03-08

**Baseline — first tracked version.** Versioning was introduced after this point; this entry retroactively documents the site's state going into it, reconstructed from git history rather than logged in real time.

- `iran.html` and `index.html` live since the project's initial commit (2026-03-01).
- `ukraine.html` and `ai.html` completed and shipped (2026-03-08), each with maps, timeline, quizzes/points system, Key People portraits, Videos & Resources sections, and topic-themed easter eggs.

---

_Format: each entry lists the version, date, and bump level (Major/Minor/Patch — see `README.md`), followed by what changed and, where it isn't obvious, why. Entries are written when a version bumps, not per-commit._

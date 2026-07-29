# Task 1 Report — Add Images to us-elections.html's 4 Gap Sections

**Status:** DONE
**Commit:** `8963596` (base: `fa3c005`)
**Branch:** `worktree-ship-polish`

## Summary

Added one real, Wikimedia-Commons-sourced image to each of the four previously
image-free sections of `us-elections.html`: `#branches`, `#elections-mechanics`,
`#checks-balances`, `#local-representation`. The page went from 3 `<img>` tags
to 7.

## Step 1 — Existing markup pattern

Read the page's 3 pre-existing `<img>` tags before touching anything:
- Timeline style (`.tl-body`): bare `<img>` + `<div class="cap">` (centered, `.tl-body img`/`.tl-body .cap` CSS scoped to timeline only).
- Person-card style (`#peopleGrid .person`): `<img>` + name/role/paragraph + `<div class="src">` with `Source:` / `Photo:` links.

Neither pattern is usable for a stand-alone photo inside a plain `.article` div (outside the timeline or person grid) — `us-elections.html` had no such pattern of its own. `gun-violence.html` and `climate-change.html` both already solve this exact problem with a `.photo-inline.clearfix` wrapper (float-right image + `.cap` caption, stacking full-width on mobile). I ported that CSS block (unchanged) into `us-elections.html`'s `<style>` section, immediately after the timeline CSS, so this page now shares the same inline-photo idiom as its siblings — this CSS block already exists identically in two other pages, so it's a de facto site convention, not a one-off invention.

## Step 2 — Sourcing (all verified on the image's own Commons file page)

| Section | Image | File | Author | License |
|---|---|---|---|---|
| `#branches` | U.S. Capitol, west side | `images/us-capitol-west.jpg` | Martin Falbisoner | CC BY-SA 3.0 |
| `#elections-mechanics` | WA ballot drop box, Black Lake Fire Station, Olympia (2020) | `images/wa-ballot-drop-box.jpg` | Joe Mabel | CC BY-SA 4.0 |
| `#checks-balances` | Supreme Court courtroom interior | `images/supreme-court-interior.jpg` | Timothy R. Johnson / Jerry Goldman | CC BY-SA 3.0 |
| `#local-representation` | WA State Legislative Building, Olympia | `images/card-wa-capitol.jpg` (**reused**, pre-existing file) | — | CC BY-SA 3.0 (already verified; same file used on `gun-violence.html` and `climate-change.html`) |

Deviations from the design doc's starting-point suggestions, with reasoning:
- **`#elections-mechanics`**: chose a real Washington ballot drop box over a generic voting-booth photo. Washington is vote-by-mail, so a drop box is the factually accurate "how elections actually work" image for this specific audience — a generic in-person voting-booth photo would actually have been less accurate for this page's Alderwood/WA context. Rejected one initial candidate (`Example_voting_booth_from_USA_(Connecticut).jpg`) after verification showed it was a museum display piece, not a real polling place in use.
- **`#checks-balances`**: chose the Supreme Court courtroom interior over a Senate/House floor photo, and placed it directly above the "Check 3: Courts can rule a law unconstitutional" paragraph (judicial review / *Marbury v. Madison*), so the photo sits next to the exact content it illustrates rather than at the top of a section covering all five checks generically.
- **`#local-representation`**: confirmed `images/card-wa-capitol.jpg` was a genuine fit (per brief's suggestion) and reused it rather than sourcing a new file — same real building, directly relevant to the section's "who represents Alderwood" state-legislature content, and already used with an identical CC BY-SA 3.0 credit line on two sibling pages.

One resolution caveat: all three Supreme Court courtroom-interior candidates found on Commons (photography inside the courtroom is normally restricted) top out around 500×420–536×420px — noticeably lower-res than the other new images. Verified this is sufficient for the page's `.photo-inline` display width (44% of column, ~280–320px rendered) and proceeded; flagging in case a higher-res alternative is preferred later.

`images/us-capitol-west.jpg` and `images/wa-ballot-drop-box.jpg` were downloaded at full Commons resolution (5.7MB / 12.4MB) and resized to 1200px-wide JPEGs (193KB / 328KB) with `sips` to match this site's existing image file-size range (~400KB–1.3MB); `supreme-court-interior.jpg` was already small (177KB) at source resolution.

## Step 3 — Markup added

Each insertion uses the ported `.photo-inline clearfix` wrapper with `onerror="this.style.display='none'"` (matching the section-image `onerror` variant used on `#timeline`'s John Lewis image, since these are section photos, not person-card photos):

```html
<div class="photo-inline clearfix">
  <img src="images/..." alt="..." onerror="this.style.display='none'">
  <div class="cap">... <a href="https://commons.wikimedia.org/wiki/File:..." target="_blank">Wikimedia Commons (CC ...)</a></div>
</div>
```

## Step 4 — Verification

- All 4 image `src` paths confirmed to point to existing files (`ls`/`file` checked).
- Div count balanced: 170 opening `<div>` / 170 closing `</div>` (post-edit).
- No duplicate `id` attributes (checked via `sort | uniq -d`, zero output).
- Citation count (`cite-inline` occurrences) unchanged: 92 before (`fa3c005`) and 92 after — confirms zero citations added or removed.
- `git diff --stat fa3c005 -- us-elections.html` shows purely additive change: `27 insertions(+), 0 deletions(-)`.
- New caption text checked against site discipline: no partisan content (party-swap test trivially passes — none of the four captions name a party or make a political claim), sentence length and vocabulary consistent with the page's existing 5th–6th grade level, no "now"/"currently" language (used explicit framing like "photographed in 2020" instead).

## Step 5 — Commit

```
8963596 feat: add images to us-elections.html's 4 previously image-free sections
 4 files changed, 27 insertions(+)
 create mode 100644 images/supreme-court-interior.jpg
 create mode 100644 images/us-capitol-west.jpg
 create mode 100644 images/wa-ballot-drop-box.jpg
```

## Concerns for reviewer

1. Supreme Court courtroom-interior image is lower resolution (500×285) than the site's other images — display-adequate at current CSS sizing but worth a second look if the design later wants a larger/full-width treatment for this photo.
2. `WebSearch` tool hit its session budget partway through sourcing; I fell back to `WebFetch` against known/likely Commons file and category URLs (verifying each candidate directly on its own file page as required) rather than broad search — this worked but took more iterations/guesses at exact file names than a search-first flow would have.

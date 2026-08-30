# Readability Overhaul — design

**Date:** 2026-08-29
**Status:** approved in brainstorming; implementation plan not yet written
**Scope:** all 9 pages (8 topics + `index.html`), `site.css`
**Source of inspiration:** a teacher-supplied stylesheet built on the Braille
Institute's Atkinson Hyperlegible design system

---

## 1. The ask, stated exactly

> "I don't want to lose the entire feel of my site, we've worked hard on it,
> but I do want to improve the readability and flow specifically with the
> fonts, colors, spacing, etc."

So: **adopt the system, not the skin.** The accessibility architecture of the
supplied stylesheet is taken wholesale. Its visual identity is not — the warm
newsprint palette, the per-topic accents, Playfair Display headlines and the
drop-cap motif all survive unchanged.

This also serves the class described by the teacher on 2026-08-29: many
students learning English, many reading well below 8th grade. See
[[project-landing-layer]] for the reading-level gradient this pairs with.

---

## 2. What the audit found

### Class collisions (would silently restyle existing markup)

| Class | Existing uses | Disposition |
|---|---|---|
| `.callout` | **72** | Do NOT take the source sheet's `.callout`. The site's own callout styling stays; only its spacing is re-expressed in the new scale. |
| `.skip-link` | 9 | Site's own already works. Take only the focus-visible improvement. |

The other 40 class names in the source sheet do not appear on this site.

### Contrast, current palette

Every token pair was measured. **One real failure, on all nine pages:**

| Pair | Ratio | Verdict |
|---|---|---|
| `--ink-faint` #767066 on `--paper-warm` #f5f1e8 | **4.35:1** | FAILS AA (needs 4.5) |
| `--ink-faint` #767066 on `--paper` #fbf9f4 | 4.66:1 | passes, no margin |

`--ink-faint` carries captions, the "N min" labels, photo credits and meta
text — the small type a struggling reader most needs to be able to read.

**Fix:** `--ink-faint` → **`#6b655c`** (5.48:1 on paper, 5.12:1 on warm).
About 3% darker; still reads as faint; clears AA with margin everywhere.

Everything else in the current palette already passes, most at AAA.

### Contrast, the source sheet

Contrast-solid. Every pair it actually uses lands AAA. Its one failing
combination — yellow as text on white, 1.46:1 — is one it never uses.
Not a reason to reject it; simply not adopted, because the palette isn't.

---

## 3. Adopt

Taken from the source sheet, essentially as written:

| Thing | Value | Why it is not negotiable |
|---|---|---|
| Body font | `'Atkinson Hyperlegible Next', 'Atkinson Hyperlegible', Arial, sans-serif` | Character disambiguation. Replaces Source Serif 4 for prose. |
| Base size | `1.125rem` (18px) | WCAG AAA floor is 16px |
| Line height | `1.75` | WCAG 2.2 SC 1.4.8 floor is 1.5 |
| Root sizing | `html { font-size: 100% }` | Respects the reader's own browser setting. Critical for low vision. |
| Letter spacing | `0.01em` on body | Aids character distinction |
| Type scale | `--text-xs` … `--text-4xl` | Replaces ad-hoc sizes |
| Spacing scale | `--space-xs` … `--space-3xl` | Replaces ad-hoc margins |
| Focus ring | 3px solid, 3px offset | Current site has thinner, inconsistent rings |
| Visited links | distinct colour | Real navigation aid, currently absent |
| Print | expand `href` after links | A teacher handing out paper gets working citations |
| Responsive type | step down at 768px / 480px | Currently ad-hoc per page |

---

## 4. Adapt

**`--max-content-width`: 72ch → `64ch`.** `bands.md` puts the ceiling at 80
characters (WCAG 2.2 SC 1.4.8) but the *measured* optimum at ~55 (Dyson &
Haselgrove 2001). 72ch is legal but at the loose end, and this site is being
tuned for readers below grade level. 64ch splits the difference toward the
evidence.

**The universal reset is scoped, not global.** The source sheet opens with
`*, *::before, *::after { margin: 0; padding: 0 }`. Dropped onto nine built
pages that already have their own spacing, that detonates every layout. The
new scale is applied deliberately, element by element, not by wiping first.

**`@import` becomes a `<link>`.** An `@import` inside `site.css` blocks
rendering: the browser must fetch and parse the stylesheet before it even
discovers the font request. These pages already link Google Fonts in
`<head>`; Atkinson joins them there, with `preconnect`.

---

## 5. Add — a gap in the source sheet

The supplied stylesheet has `scroll-behavior: smooth`, six `transition`
declarations and a `translateY` hover lift, and **no `prefers-reduced-motion`
block anywhere.** For a student with vestibular sensitivity that is the one
thing on a page capable of causing physical symptoms. An accessibility-first
sheet should not ship without it, so this overhaul adds:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 6. Do not adopt

Two of these would reverse decisions already made deliberately.

| Rejected | Why |
|---|---|
| Braille Institute yellow/navy palette | The warm newsprint and per-topic accents (climate green, elections navy/gold) are the site's identity |
| Cards with `border-radius` + `box-shadow` + hover `translateY` | The editorial redesign explicitly **replaced** "rounded cards, drop shadows, colored pill nav". See [[project-editorial-redesign]]. Re-adding them undoes that work. |
| `h2 { border-bottom: 4px solid yellow; display: inline-block }` | Fights the existing `.sec-head` component |
| `.nav` dark bar with yellow brand | Replaces the masthead, which is the site's identity |
| Source sheet's `.callout` | 72 existing uses (§2) |

**Kept explicitly:** Playfair Display headlines, the `.lede` drop cap on every
major section, warm paper `#fbf9f4`, all eight per-topic accent themes.

---

## 7. Token consolidation

Right now `--paper`, `--ink`, `--accent` and the whole type scale are
duplicated in **nine separate inline `<style>` blocks**. That is why every
site-wide visual change is a nine-way edit, and it is the reason this
overhaul is expensive.

This pass lifts the **shared** tokens into `site.css` and leaves only what is
genuinely per-topic inline:

```
site.css   :root { paper, ink, ink-light, ink-faint, rule, rule-heavy,
                   type scale, spacing scale, line heights, radius, focus }

page       :root { --accent, --accent-ink, --accent-tint }   /* 3 lines */
```

After this, changing the site's body size is one edit rather than nine.

---

## 8. Verification

| Gate | Command |
|---|---|
| No content lost | `python3 tools/verify_invariants.py HEAD` — zero deletions across all 9 pages |
| Reading times unmoved | `tools/reading_time.py` output byte-identical (CSS cannot change word counts; any diff means markup was touched) |
| Landing budget held | `tools/reading_time.py --landing` |
| Study Mode intact | `python3 tools/check_study_mode.py` |
| JS unaffected | `node --test tools/*.test.js` |
| Contrast | re-run the audit script; zero failures across all 9 pages |
| Line length | measured chars-per-line ≤ 80, target ~64 |

A CSS-only change that moves `reading_time.py` output is a red flag: it means
markup changed when it should not have.

---

## 9. Sequencing

The landing-layer work ([[project-landing-layer]]) is mid-flight on branch
`landing-layer`, committed clean at `446a27b`. Approved but unbuilt there:
the section tiles with completion checks, a primer quiz, and the Ice Core
Drill.

**This overhaul proceeds on the same branch.** It touches `site.css` and
`climate-change.html`, the two files the landing layer is actively changing;
doing it on a parallel branch guarantees a three-way conflict in both. The
teacher's stated order — overhaul first, then resume the articles — is
preserved as task order within the branch, not as branch topology.

**Version.** A site-wide body-font change is visible on every page of the
site. This likely warrants `4.0.0` rather than folding into `3.8.0`. Decided
at ship time, not here.

---

## 10. Out of scope

- Any change to prose. This is CSS, tokens, and the font stack.
- The eight inline `openQuiz` copies (still deferred, see the landing-layer spec)
- `index.html`'s layout — it gets the tokens and the font, not a redesign

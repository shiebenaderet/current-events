# Design — Touch/Mobile Floor + Shared Token Layer (Phases 1–2)

**Date:** 2026-08-27 · **Branch:** `worktree-ux-floor` · **Baseline:** v3.2.0 (`b2a76a3`)

Source: `/edtech-ui-ux` audit of the live site, 2026-08-27. Phases 3 (reading levels) and
4 (length honesty) are deliberately **out of scope** — they go to `/brainstorm` after this ships.

---

## Problem

The audit came back clean on anti-slop grounds: no slop hexes, no slop fonts, no
blue→purple gradients, no marketing jargon, a 4-value radius scale, real semantic HTML, and
prose set at `max-width:700px` / `line-height:1.75`. The broadsheet register is a genuine
point of view and is **kept**.

What fails is not the aesthetic. It is whether the page works for a 13-year-old on a school
tablet. Five defects, all measured from the code:

| # | Defect | Measured |
|---|---|---|
| 1 | `.term` definitions revealed only via `:hover` / `:focus` | 75 terms, 7 pages |
| 2 | `body{overflow-x:hidden}` guard present on only 2 of 9 pages | 7 pages missing |
| 3 | Page-local animation bypasses `prefers-reduced-motion` | 0 of 9 pages guard inline |
| 4 | A11y text-size buttons are 32×32px | below the 44px floor |
| 5 | 62 distinct `font-size` values site-wide | threshold is ~4 |

Defect 1 is the most consequential. The students who most need a word defined are on the
devices where the definition is least likely to appear. Screen readers *are* already served
via `aria-describedby` + hidden `.term-desc`; it is specifically touch that fails.

---

## Decisions

**D1 — Keep the newspaper register.** The skill's "warm palette, rounded, no gray" EdTech
rules are **not** applied. The broadsheet look does pedagogical work: it signals "this is
journalism, treat it as a source." Duolingo-ifying it would cost the credibility that makes
the site useful in a Social Studies classroom. Stated exception, per the skill's own
instruction to say so out loud.

**D2 — Keep the emoji hero easter eggs.** `🗳/🇮🇷/🤖` are play, not affordances. The
anti-slop "never emoji as UI chrome" rule targets emoji *replacing* an interface control;
no function is lost if a student never taps these.

**D3 — `.term` becomes tap-to-toggle, hover retained.** Add a click handler in `site.js`
toggling `.is-open`. Hover still works on desktop; touch now works everywhere. The existing
`tabindex="0"` / `data-def` / `aria-describedby` triple is **not** altered — MEMORY.md §8
lists breaking that pair as a recurring shipped regression.

**D4 — Tokens only; no component extraction.** MEMORY.md §1 states the sharing split is
"deliberate and narrow" and that page-specific CSS "stays inline per page." A `:root` scale
of custom properties is *vocabulary*, not page-specific CSS, so it belongs in `site.css`
without violating that rule. Per-page `--accent` palettes stay inline and stay distinct (§5).

The component-extraction half of the original Phase 2 proposal (pulling `.article`, `.quiz`,
`.term` CSS into shared files) is **blocked by convention and not done.** Reopening it is a
separate decision for the user, not a side effect of this pass.

**D5 — Token adoption is additive this pass.** Tokens are defined and adopted in `site.css`
plus the two prose values that actually disagree between pages (`.article p` is `1.14rem`
on some pages, `1.18rem` on others). A full 62→8 sweep across eight inline stylesheets is
mechanical but high-diff; it is staged behind the reading-level work so it can be folded into
that pass rather than run twice.

---

## Non-goals

- No content, copy, or citation edits. Citation counts are regression invariants (§2).
- No reading-level differentiation — that is Phase 3, after `/brainstorm`.
- No change to per-page accents (§5), voice (`docs/VOICE.md`), or the points/quiz engine.

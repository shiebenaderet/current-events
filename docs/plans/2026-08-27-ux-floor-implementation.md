# Implementation — UX Floor (Phases 1–2)

**Branch:** `worktree-ux-floor` · **Design:** `2026-08-27-ux-floor-design.md`

## Global Constraints

Restating the editorial/structural rules in play (MEMORY.md §3, §4, §8):

- **No copy, content, or citation edits.** `cite-inline` counts per page are invariants.
- **`.term` keeps its triple:** `tabindex="0"` + `data-def` + `aria-describedby` → hidden
  `.term-desc`. Breaking the pair is a listed recurring regression. `data-def` text must stay
  byte-identical.
- **Dyslexic font stays scoped to reading text** — never maps, nav, buttons, or SVG.
- **Per-page accents stay distinct** (§5). No unification of `--accent`.
- **`MAX_PTS`, quiz ids, and egg handlers untouched** this pass.
- **Every `<img>` keeps its `onerror` fallback.**
- Verify with the §2 grep invariants, before/after. "Looks fine" is not a result.

## Baseline (captured pre-edit)

```
page                  cite  term  term-desc  div  /div  img  onerror
ai.html                 16    12    12       309   309   13    13
climate-change.html     38     6     6       165   165    8     8
gun-violence.html       90    20    20       204   204   16    16
immigration.html        79    20    20       195   195   15    15
index.html               0     0     0        52    52    8     8
iran.html               66     2     2       261   261   14    14
space-race.html         15     3     3       132   132    7     7
ukraine.html            36    12    12       261   261   10    10
us-elections.html       84     0     0       172   172    7     7
```
Duplicate ids: none. Distinct font-sizes: 62. Pages with overflow guard: 2/9.

---

## Task 1 — Tap-to-open vocabulary tooltips  *(Defect 1, severity high)*

- [ ] 1.1 `site.css`: add `.term.is-open::after/::before` mirroring the `:hover`/`:focus`
      reveal, so the shared layer drives visibility. Add `touch-action:manipulation`.
- [ ] 1.2 `site.js`: `initTerms()` — delegated `click` on `.term`; toggle `.is-open`;
      close any other open term; `Escape` closes; outside-tap closes. No markup change.
- [ ] 1.3 Verify: `term` and `term-desc` counts unchanged on all 9 pages; `data-def`
      text diffs byte-identical.

## Task 2 — Propagate mobile overflow guard  *(Defect 2, severity high)*

- [ ] 2.1 Add `body{overflow-x:hidden;overflow-wrap:break-word}` to the 7 pages missing it:
      `ai`, `climate-change`, `index`, `iran`, `space-race`, `ukraine`, `us-elections`.
      Match the exact declaration already in `gun-violence.html:12` / `immigration.html:12`.
- [ ] 2.2 Verify: 9/9 pages carry the guard; div balance unchanged.

## Task 3 — Reduced-motion floor for page-local animation  *(Defect 3, severity medium)*

- [ ] 3.1 `site.css`: broaden the existing `prefers-reduced-motion` block to neutralize
      page-local decorative motion generically (`.toast`, `.progress-fill`, confetti/egg
      animation, hero image transitions) rather than per-page selectors.
- [ ] 3.2 `index.html`: remove `transform:scale(1.02)` hover on `.lead-story` (anti-slop
      "never hover:scale"); replace with a non-motion affordance.
- [ ] 3.3 Verify: reduced-motion rules cover every page-local `animation:` declaration.

## Task 4 — 44px touch targets on a11y controls  *(Defect 4, severity low)*

- [ ] 4.1 `site.css`: keep the 32px visual size, add an invisible 44px hit area via
      `::after` on `.text-size-controls button`. Ensure ~8px separation between adjacent
      targets so the expanded areas do not overlap.
- [ ] 4.2 Verify: no interactive control below 44px effective target.

## Task 5 — Shared design tokens  *(Defect 5, severity medium — partial by D5)*

- [ ] 5.1 `site.css`: define a `:root` token scale — type (1.25 modular), spacing, radius,
      motion. Namespaced `--ce-*` so it cannot collide with per-page `--accent`/`--ink`.
- [ ] 5.2 Adopt tokens within `site.css` itself (a11y layer + text-size steps).
- [ ] 5.3 Reconcile the one real cross-page disagreement: `.article p` `1.14rem` vs
      `1.18rem`. Pick one, apply to both, record which pages changed.
- [ ] 5.4 Document in MEMORY.md §1 that `--ce-*` tokens are shared vocabulary and that
      component CSS still stays inline per page.
- [ ] 5.5 Verify: distinct font-size count drops; no page-specific CSS moved to shared.

## Task 6 — Whole-batch verification

- [ ] 6.1 Re-run every §2 invariant; diff against baseline table above.
- [ ] 6.2 Serve over HTTP; exercise a term tooltip on a touch-emulated viewport at 320px.
- [ ] 6.3 Bump `VERSION` → 3.3.0 (minor: structural a11y/design change, no new page).
- [ ] 6.4 `CHANGELOG.md` entry: what changed, why, and what the audit caught.

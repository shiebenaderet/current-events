# Ledger — UX Floor (Phases 1–2) · v3.3.0

Branch `worktree-ux-floor` off `main` @ `b2a76a3` (v3.2.0).
Plan: `docs/plans/2026-08-27-ux-floor-{design,implementation}.md`

| Task | Outcome | Verification |
|---|---|---|
| 1 · Tap-to-open tooltips | done | 9/9 behavioural assertions in jsdom against real page markup; 75 term/term-desc pairs unchanged; `data-def` byte-identical on all 9 pages |
| 2 · Overflow guard | done | 2/9 → **9/9** pages carry `overflow-x:hidden;overflow-wrap:break-word` |
| 3 · Reduced motion | done | shared block now covers `.shake`, toast, progress-fill, photo transitions, `.term` pseudo-elements; `scale(1.02)` 1 → **0** |
| 4 · 44px touch targets | done | A/A/A buttons keep 32px visual, gain 44px `::after` hit area; cluster gap 2px → 6px; dyslexic toggle `min-height:44px` |
| 5 · Design tokens | partial by design (D5) | 21 `--ce-*` tokens defined + adopted in shared layer; `.article p` 1.14/1.18 → **1.18** on 3 pages; applied font-size values 62 → 61 |
| 6 · Verification | done | all §2 invariants identical to `main`; VERSION 3.3.0; CHANGELOG entry written |

## Numbers

```
overflow guard        2/9  -> 9/9
hover:scale             1  -> 0
.article p values       2  -> 1   (1.18rem)
applied font-sizes     62  -> 61  (bulk sweep staged to Phase 3)
--ce-* tokens           0  -> 21
tooltip tap support   none -> all 75 terms, 7 pages
```

Unchanged vs `main` on all 9 pages: `cite-inline`, `.term`, `.term-desc`, `<div>`/`</div>`
balance, `<img>`/`onerror`, id uniqueness. HTML diff is 13 CSS declarations, zero content.

## Deliberate non-actions

- **Newspaper register kept.** EdTech "warm/rounded/no-gray" not applied — the broadsheet
  framing is what signals "journalism, read as a source" to a student. Stated exception.
- **Emoji hero easter eggs kept.** Play, not affordances; nothing lost if never tapped.
- **Component CSS extraction rejected.** Would break the one-file-per-topic model that
  MEMORY.md §1 protects. Its own effort if ever revisited.

## Next

Phases 3 (reading levels) and 4 (length honesty) go to `/brainstorm` before any code.
Open question carried in: which differentiation model — summary-first, two-track prose, or
progressive disclosure. The 62→61 font-size sweep folds into whichever ships.

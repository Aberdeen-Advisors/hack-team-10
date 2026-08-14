# Brand fonts

Poppins (SIL Open Font License), Roboto (SIL OFL), Montserrat (SIL OFL) — all freely
redistributable. `aberdeen_brand.pick_font()` checks this folder first, so a fresh clone
renders in the real brand fonts instead of silently falling back to Calibri and Arial.

- **Poppins** — CURRENT system, headings *and* body (`SKILL.md` §3)
- **Roboto** — QUALS system body copy
- **Montserrat** — heading fallback if Poppins is unavailable

Roboto ships upstream only as a variable font now; it exposes 18 named instances, so weights
resolve. Static Roboto is no longer published in `google/fonts`.

To install locally (Windows, no admin): select all, right-click, Install for current user.

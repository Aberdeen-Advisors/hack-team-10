# Agent instructions

The instruction files that drive the Aberdeen pursuit-intelligence agent, plus the brand module
they build with. The three `.md` files split the job three ways: one says what to do, one says
how it should look, one says what it should say. `aberdeen_brand.py` is the executable half of
the second.

| File | What it does |
|---|---|
| [`AGENT_WORKFLOW.md`](AGENT_WORKFLOW.md) | **Process.** The agent's operating instructions — a four-step pipeline that takes a target company, matches it against the CRM and revenue data, assesses what Aberdeen has done for them before, gathers competitor and earnings-signal research, and produces a Point of View deck. Also lists the data sources, the controlled vocabulary that outputs must use, and the guardrails (notably: the CRM's `Fake Data` sheet is fabricated test data and must never reach an output). |
| [`SKILL.md`](SKILL.md) | **Form.** The Aberdeen brand and document system — colour tokens with the role each one plays, typography and font-fallback rules, exact slide geometry for six document classes, a nine-pattern layout library for client decks, python-pptx recipes, a mandatory visual-QA loop, and voice rules. Despite the generic filename, this is the brand guide; read it before building any Aberdeen-branded deliverable. |
| [`AberdeenOfferings.md`](AberdeenOfferings.md) | **Substance.** The offering taxonomy and credential inventory — six capabilities, five sellable service areas, the healthcare service lines, the Epic practice detail, 20 healthcare engagements plus cross-industry partner quals, the client roster, and an honest offering-to-credential map showing which offerings can be sold with proof and which cannot. |
| [`aberdeen_brand.py`](aberdeen_brand.py) | **The executable brand system.** The python-pptx module `SKILL.md` §5 imports from: colour tokens, the font-fallback chain, and the measured slide geometry, with builders for qual pages and the one-page POV, a `check_bounds()` geometry gate, and PNG/PDF export for the visual check. Import it rather than re-deriving geometry by hand. |
| [`requirements.txt`](requirements.txt) | **Python dependencies for the module** — `python-pptx` to build decks, `openpyxl` / `python-docx` / `PyMuPDF` to read the source workbooks, documents and filings, `Pillow` for logo placement, `rapidfuzz` for target matching, and `pywin32` on Windows for the PNG and PDF export the visual-QA step needs. |

## Notes on layout

- **`SKILL.md` is kept flat here, alongside the other two.** It carries valid Agent Skill
  frontmatter (`name: aberdeen-brand`), so it could live at `skills/aberdeen-brand/SKILL.md`
  instead. It is flat for two reasons: `AberdeenOfferings.md` refers to it as a bare
  `SKILL.md` and it refers back the same way, so keeping them siblings is what makes those
  references resolve; and skill auto-discovery would need `.claude/skills/aberdeen-brand/`
  anyway, which a subfolder here would not provide. To install it as a live skill rather
  than as reference documentation, copy it to `.claude/skills/aberdeen-brand/SKILL.md`.
- **`AGENT_WORKFLOW.md` originally referred to the other two with a `Quals/` prefix** (e.g.
  `Quals/SKILL.md`, and `Aberdeen Content/Quals/…` in its frontmatter). Those describe the
  authors' local OneDrive layout, not this folder — here all three files are siblings.
  Those sibling file references were adjusted to bare `SKILL.md` and `AberdeenOfferings.md`
  so they resolve in this flat folder layout; `Quals/` as a *source directory* (the §0 data
  source registry, the credential searches in §3) is left as written.
- **Module path references were flattened the same way.** `SKILL.md` §5 and
  `AGENT_WORKFLOW.md` (frontmatter and the §0 registry) pointed at `toolkit/aberdeen_brand.py`
  and `toolkit/requirements.txt`, which again describes the authors' local layout. Both files
  sit here as siblings, so those references were adjusted to bare `aberdeen_brand.py` and
  `requirements.txt`, including the install lines in the two files' own headers.
- **Files these documents reference that are not in this repo:** `AI Use Policy - Draft 0.4`,
  the source `.pptx` decks, the `.xlsx` CRM and qual trackers, `aberdeen_logo.png`, and
  `PII-MAPPING.local.md` (the real-name mapping behind the `PartnerN` tokens, held outside the
  shared library by design — see `AGENT_WORKFLOW.md` §8). `aberdeen_brand.py` used to be on
  this list; it is now present, and the geometry in `SKILL.md` §4.6 no longer has to be
  re-derived by hand.
- The Q2 2026 earnings releases that `AGENT_WORKFLOW.md` §0 calls the "signal corpus" are in
  this repo under [`client-data/`](../client-data), which is where the §0 registry now points.

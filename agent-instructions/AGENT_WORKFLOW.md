---
name: aberdeen-pursuit-workflow
description: >
  Operating instructions for the Aberdeen pursuit-intelligence agent. Use whenever asked to
  research, qualify, or build a point of view for a target account, prospect, or existing
  client. Runs a four-step pipeline: intake targets, assess Aberdeen's prior work and revenue
  history, synthesize competitor and signal research, then produce a branded Point of View.
  Triggers on: "assess this target", "should we pursue", "build a POV", "pursuit brief",
  "account research", "who do we know at", "what have we done for", "competitor landscape".
version: 1.0
last_verified: 081426
governs: process
companions:
  - "Aberdeen Content/Quals/SKILL.md — form: brand, layout, geometry, voice"
  - "Aberdeen Content/Quals/AberdeenOfferings.md — substance: offerings, service areas, credentials"
---

# Aberdeen Pursuit Intelligence — Agent Workflow

**CONFIDENTIAL · Aberdeen Advisors · 2026.** This workflow reads client revenue, pipeline and
relationship data. All of it is **Level 3** under `AI Use Policy - Draft 0.4` — *"strictly
prohibited from any external AI tools, including personal paid accounts."* Work locally or
inside the Microsoft tenant boundary. Never paste account, revenue, or contact detail into an
external model.

**Division of labour across the three instruction files:**

| File | Governs | Use it for |
|---|---|---|
| `AGENT_WORKFLOW.md` (this) | **Process** | What to do, in what order, with which sources |
| `Quals/SKILL.md` | **Form** | Colours, fonts, slide geometry, layout patterns, voice |
| `Quals/AberdeenOfferings.md` | **Substance** | Offering names, service areas, credentials to cite |

---

## 0. Data source registry

Base path: `C:\Users\FarazSyed\Aberdeen Advisors LLC\TENacious AI - Documents\TENacious AI\`

| Source | Path | Provides | Notes |
|---|---|---|---|
| **CRM** | `Materials - .../CRM draft 1.xlsx` → `Active Accounts` | 43-field account record, 30 real accounts | **Often locked by Excel.** Copy to a temp path and read the copy. |
| **Controlled vocab** | same file → `Drop Downs` | Legal values for Status, Industry, Size, Geography, Owner, Strength | **Use these exact strings.** Never invent a value. |
| **Competitor provenance** | same file → `Competitor Sources` | Per-account Q2 status, whether competitors were named, source basis, source URL | Already carries a provenance discipline — preserve it |
| **Pipeline** | same file → `Sheet4` | Named opportunities with dollar values | Client · Service Offering · Value Found · Notes |
| **⚠ Synthetic** | same file → `Fake Data` | 1,000 fabricated rows (JPMorgan, Walmart, Amazon…) | **NEVER treat as real.** Test fixture only. See §5. |
| **Revenue** | `Aberdeen Content/Aberdeen_Sales_by_Customer_2026 1.xlsx` | 2026-thru-8/6 vs 2025 by account, with delta | Has a `QA Check` sheet; row 38 is `TOTAL` — exclude from per-account loops |
| **Credentials** | `Aberdeen Content/Quals/` | Qual decks, healthcare tracker, ERP/partner quals, Epic Qual | See `AberdeenOfferings.md` §7–§8 |
| **Signal corpus** | `Materials - .../*.pdf`, `*.html` | Q2 2026 earnings releases: Alphabet, Arkema, Centene, Constellation, Core Natural Resources, Cornerstone, Dauch, Krispy Kreme, LPL, Loma Linda, Novant, CPK, LSF | Primary-source signal evidence |

**Revenue baseline (verified 081426):** 2026 thru 8/6 = **$23,378,978** · 2025 same period =
**$17,695,338** · delta **+$5,683,640 (+32%)** across 30 accounts.

---

## 1. Controlled vocabulary — use exactly

Taken from the `Drop Downs` sheet. Any value you write into a CRM-shaped output must be one of
these.

**Account Status:** Prospect · Active Client · Former Client · Target · Other

**Industry (14):** Financial Services · Healthcare & Life Sciences · Technology & Software ·
Professional Services · Consumer & Retail · Manufacturing & Industrial · Energy & Utilities ·
Real Estate & Construction · Transportation & Logistics · Media & Telecommunications ·
Education · Government & Public Sector · Nonprofit & Associations · Agriculture & Food

**Size:** Small — Revenue < $50M and < 250 employees · Mid-Market — Revenue $50M–<$250M or
250–999 · Large — Revenue $250M–<$1B or 1,000–4,999 · Enterprise — Revenue ≥ $1B or ≥ 5,000

**Geography:** US — Nationwide · US — Northeast · US — Midwest · US — South · US — West ·
India · Europe · Global · Other

**Relationship Owner:** Kavir Naik · David Wise · Philip Read · Alakh Patel · Simon Huleatt ·
Marco Oropeza · Other

**Relationship Strength:** Strong · Developing · At Risk · New

> **Three competing industry taxonomies exist.** This CRM list (14), the Premier Health slide
> list (14, different members — has Private Equity, Infrastructure, Public Sector, Life
> Sciences split out), and the CoE strategy sectors (Financial Services / Energy & Industrials
> / Professional Services). **For CRM-shaped output use this list.** For client-facing decks
> use the Premier Health list. Flag the mismatch in your output rather than silently mapping.

---

## 2. Step 1 — Intake targets

**Input:** one or more company names from the user, in any form.

**Procedure:**

1. **Normalise the name.** Strip suffixes (Inc, LLC, Corporation, Companies), then fuzzy-match
   against the CRM `Account` column and the revenue file with `rapidfuzz` at ≥ 85 ratio.
   Report the match and the score; do not silently substitute.
2. **Classify the match** into exactly one bucket — this determines the whole downstream path:

   | Bucket | Test | Path |
   |---|---|---|
   | **Existing client, growing** | In revenue file, 2026 > 2025 | Expansion / cross-sell play |
   | **Existing client, declining** | In revenue file, 2026 < 2025 | Retention play — lead with risk, not new scope |
   | **Dormant / churned** | 2025 revenue, **zero** 2026 | Win-back play. Currently: Centene, Cornerstone Care, Krispy Kreme, Runnvation, SYDKIMYL |
   | **New this year** | 2026 revenue, no 2025 | Land-and-expand. Currently 13 accounts incl. Constellation, Orgill, Patterson, Loma Linda, Medquest, Mosaic |
   | **In CRM, no revenue** | In `Active Accounts`, absent from revenue file | Prospect / Target — qualify first |
   | **Unknown** | No match anywhere | Cold. Requires external research; say so plainly |
3. **Capture the ask.** What does the user actually want — a pursuit decision, a meeting prep,
   a POV deck, or a credential pull? Do not build a deck if they asked a question.
4. **Do not proceed on a wrong match.** If the best fuzzy score is 60–85, ask which account
   they meant. Below 60, treat as Unknown.

**Output contract:** a resolved target list, each with `{input_name, matched_name, match_score,
bucket, crm_row_present, revenue_2026, revenue_2025, delta}`.

**Quality gate:** every target has a bucket, and every match ≥ 85 or explicitly flagged.

---

## 3. Step 2 — Assess prior Aberdeen work

**Input:** the resolved target list. **Sources:** revenue file, `Quals/`, CRM `Sheet4`.

**Procedure:**

1. **Revenue trajectory.** Pull 2026, 2025, delta and percent change. State the direction in
   words — a 32% firm-level increase with a specific account down 19% is the interesting fact,
   not the absolute number.
2. **Engagement history.** Search `Quals/` for the account. Check `AberdeenOfferings.md` §7
   (20 healthcare engagements), §8 (ERP and partner quals), §9 (client roster), and the
   past-engagement examples folder (Constellation, JCP, Nordstrom, Patterson, Sysco, Walmart).
   For each hit, record what was delivered and any quantified outcome.
3. **Open pipeline.** Check `Sheet4` for named opportunities against this account, with value.
4. **Relationship position.** From the CRM: `Relationship Owner`, `Relationship Strength`,
   `Key Contacts`, `Decision Makers`, `Executive Sponsorship`, `Last Interaction`. Most fields
   are empty on most accounts — **report the gap as a finding**, do not fabricate a name.
5. **Select credentials.** Pick the 2–3 strongest proof points for the target's sector and
   likely need, preferring quantified ones. Check the §10 offering→credential map: if the row
   says **Thin**, you may sell the capability but must not imply a track record.

**Output contract:** per target — revenue trajectory, prior engagements with outcomes, open
pipeline value, named relationship owner and strength, 2–3 selected credentials with the
source file each came from.

**Quality gate:** every credential cited traces to a real file. Every empty CRM field is
reported as empty, never filled with a plausible guess.

---

## 4. Step 3 — Synthesize competitor and signal research

**Input:** the resolved target list. **Sources:** `Competitor Sources` sheet, the Materials
PDFs/HTML, CRM competitor columns, plus web research where permitted.

**Procedure:**

1. **Start with `Competitor Sources`.** It already records, per account: `Q2 Status`, `Were 4
   competitors named in Q2?`, `Competitor-source basis`, `Primary source URL`. Read it before
   doing any new research — much of the work is done, and it tells you the evidentiary basis.
2. **Read the primary source.** If a Q2 2026 earnings release exists in Materials for this
   account, read it. Extract, with a page or section reference: strategic priorities in
   management's own words, stated headwinds, technology or transformation initiatives,
   leadership changes, M&A activity, capital allocation signals.
3. **Honour the coverage limits.** Most accounts show *"No public Q2 filing"* — private
   companies do not file. When that is the case, say so and name what you used instead. Do not
   present a competitor-profile aggregator as equivalent to a filing.
4. **Competitive landscape.** Populate `Top Competitor 1–4` and `Competitive Landscape (other
   firms)`. Distinguish two different questions and never merge them:
   - *the target's* market competitors (from filings and market data)
   - *Aberdeen's* competitors for the work — per the CoE strategy session, the real threat is
     **Regional Boutiques** (Slalom, West Monroe, Protiviti) and **Pure-Play AI shops**, not
     the Big-4
5. **Extract buying signals.** Map each to the Aberdeen offering it triggers, using
   `AberdeenOfferings.md` §2 and §5. Weight by recency — a Q2 2026 filing outranks a 2025
   article. Cite the source for every signal.
6. **Tag provenance on every claim:** `filing` · `press release` · `aggregator` · `CRM` ·
   `inference`. An inference must be labelled as one.

**Output contract:** per target — 3–6 evidenced signals each mapped to an offering, the
target's competitor set, Aberdeen's likely rivals for the work, and a provenance tag on every
line.

**Quality gate:** no signal without a source. No competitor named without a basis. Coverage
gaps stated, not glossed.

---

## 5. Step 4 — Create the Point of View

**Input:** everything above. **Form governed by `Quals/SKILL.md`. Substance by
`AberdeenOfferings.md`.**

Build on the **Premier Health pattern** (`SKILL.md` §4.5): 10.00 × 5.62 in, CURRENT system,
Poppins, teal top rule, client logo bottom-left and Aberdeen logo bottom-right.

**Recommended slide sequence:**

| # | Slide | Pattern | Content |
|---|---|---|---|
| 1 | Title | `Title_Light` | `[Client] & Aberdeen Advisors` + purpose + date |
| 2 | Proposed topics | Custom | What this conversation covers |
| 3 | Re-introduction | §4.5 **A + B** | Six capabilities and 14 industries, **relevant ones in Signal Cyan `#03CBFF` bold** |
| 4 | Focus / credibility | §4.5 **C + D + E** | Five service areas, firm profile, client logo grid with the relevant subset in a dashed amber box |
| 5 | What we understand | §4.5 **F** | The target's situation from Step 3, in their own words from the filing |
| 6 | Topics for deeper conversation | §4.5 **F** | 3–6 topics, each a bold cyan lead-in plus description, drawn from the signal→offering mapping |
| 7–n | Per-topic | §4.5 **H** | **Aberdeen Capabilities** left, **Select Aberdeen Experience** right — the latter from Step 2 |
| n+1 | Bringing it together | Custom | Recap and proposed next step |
| n+2 | Credential appendix | §4.1 qual pages | Anonymised quals, one engagement per page |

**Hard rules:**

- **Every capability claim on a left-hand column needs a credential in the right-hand column.**
  If §10 rates that offering **Thin**, either pick a different topic or state the capability
  without implying delivery history.
- **Use the Signal Cyan highlight mechanic** rather than deleting non-relevant items — it shows
  breadth and focus at once.
- **Anonymise credentials by default:** *"Client is a [size] [sector] [type]…"* with the scale
  figure. Name a client only where approval exists.
- **Mark the deck `PROVISIONAL — PENDING REVIEW`** until a human approves it. The AI Use Policy
  requires it: output *"must be provisional and require explicit human review and approval
  before finalization."*
- **No unsourced percentages.** Every number traces to a file or a filing.

**Output contract:** a `.pptx` at `Aberdeen_[Client]_POV_2026_v[N].pptx` (date suffixes
**MMDDYY**), plus a one-page written summary listing every source used and every open question.

---

## 6. Guardrails

1. **The `Fake Data` sheet is fabricated.** 1,000 rows of JPMorgan Chase, Walmart, Amazon,
   UnitedHealth and similar, with invented owners and relationship strengths. It exists to test
   the schema. If a target matches only there, it is **Unknown**. Never cite it, never let it
   into an output, never let its 1,000 rows dominate a "top accounts" calculation.
2. **Level 3 data stays local.** Revenue, pipeline, contacts, engagement detail. No external
   model, no external API, no exceptions.
3. **The revenue file has a `TOTAL` row and a validation note row.** Exclude both from
   per-account loops or your totals double-count.
4. **`CRM draft 1.xlsx` is frequently locked** by Excel. Copy to a temp path and read the copy;
   do not attempt to write to the original while it is open.
5. **Empty is a finding, not a gap to fill.** Most CRM accounts have 9–10 of 43 fields
   populated. `Key Contacts`, `Decision Makers`, `Executive Sponsorship`, `Last Interaction`
   and `Next step` are largely blank. Report them empty. Fabricating a decision-maker name is
   the single worst failure mode available here.
6. **Three industry taxonomies are live.** Use the CRM list for CRM output, the Premier Health
   list for client decks, and flag the conflict.
7. **No delivered AI credential exists yet** (`AberdeenOfferings.md` §10). Do not imply one.
   CARES and "Building Trusted AI at Enterprise Scale" are frameworks, not engagements.
8. **Human-in-the-loop before anything leaves the building.** No outreach sent, no deck
   delivered, no proposal issued without explicit approval.

---

## 7. Self-check before returning

1. Every target resolved to a bucket, with the match score shown?
2. Every credential cited traceable to a real file?
3. Every signal carrying a source and a provenance tag?
4. Every empty CRM field reported as empty rather than filled?
5. Nothing from `Fake Data` anywhere in the output?
6. Revenue figures exclude the `TOTAL` and validation rows?
7. Capability claims each paired with a credential, or explicitly marked as unproven?
8. Deck on the right canvas, correct system, fonts set explicitly, brand colours by role?
9. Marked **PROVISIONAL — PENDING REVIEW**?
10. Open questions listed rather than quietly resolved by assumption?

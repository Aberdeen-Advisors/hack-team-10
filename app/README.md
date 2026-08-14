# Pursuit Intelligence — the app

The working application for the challenge in the [root README](../README.md): identify
high-potential accounts, detect buying signals, map decision-makers and Aberdeen
relationships, recommend offerings and credentials, and generate tailored outreach.

It is built entirely from what is already in this repo — the three instruction files in
[`agent-instructions/`](../agent-instructions) and the 13 documents in
[`client-data/`](../client-data). No CRM, revenue, pipeline or engagement-library data was
available here, and the app reports those as gaps rather than filling them.

## Running it

Open **`pursuit-intelligence.html`** in a browser. That is a single self-contained file —
no server, no build step, no install.

To work on the source instead, serve this folder and open `index.html`:

```bash
python -m http.server 8777
```

`index.html` loads the same code as separate files. Rebuild the single-file version with
`python build.py` after editing.

## What's here

| File | What it is |
|---|---|
| `pursuit-intelligence.html` | The app as one self-contained file. This is the one to open. |
| `index.html` | Source entry point — loads the CSS and the four scripts separately. |
| `styles.css` | The CURRENT brand system from [`SKILL.md`](../agent-instructions/SKILL.md) §2.1 as CSS tokens. |
| `data-aberdeen.js` | Offering taxonomy, credential inventory with §10 proof ratings, and the 13 account records. |
| `data-signals.js` | 59 buying signals extracted from `client-data/`, each with evidence, a source reference and a provenance tag. |
| `data-investments.js` | 38 forward investments — where each company is diverting capital in coming quarters — each mapped to the Aberdeen service area that can sell against it, or honestly marked context-only. |
| `app.js` | Scoring, the four views, and the outreach generator. |
| `build.py` | Inlines the CSS and scripts into `pursuit-intelligence.html`. |

## The Investment Radar (lead view)

The opening view answers one question per company: **where is the money going next quarter?**
Every initiative comes from the company's own quarterly release — amount, horizon, and
commitment status (committed / announced / exploratory) — and is mapped to the Aberdeen
service area from the About Aberdeen overview that can sell against it, with the §10 proof
badge shown unmodified. Pure financial engineering (buybacks, debt retirement) is kept
visible as context but never force-fit to an offering.

Companies are grouped to match the rollout plan: **Phase 1 — Aberdeen's book** (existing,
new-2026 and former clients) first, **Phase 2 — expansion universe** (no confirmed
relationship) second. Amounts stay in their filing currency; the app never totals across
currencies.

## How an account is scored

Three components, shown broken out on every account so the number can be argued with:

| Component | Max | Basis |
|---|---|---|
| Signal evidence | 40 | Count of evidenced signals, weighted up for technology-investment, data/AI, M&A and restructuring |
| Relationship position | 30 | The `AGENT_WORKFLOW.md` §2 bucket — a live engagement scores highest, a cold prospect lowest |
| Proof-strength fit | 30 | Mean `AberdeenOfferings.md` §10 rating across the offerings this account's signals trigger |

Accounts sort into **Pursue now** (≥72), **Develop** (≥52), **Qualify** (≥30) and **Monitor**.

Where an account has a live engagement, that offering outranks a more frequently triggered
one. Proposing from zero when Aberdeen is already inside reads as though the firm does not
know its own book — the failure mode `AGENT_WORKFLOW.md` §3.2 warns about.

## Guardrails it implements

These are the workflow's §6 guardrails expressed as behaviour, not as documentation:

- **No external calls.** Everything is embedded locally. The app makes zero network requests,
  so Level 3 data cannot leave the machine through it.
- **Empty is a finding.** CRM contact fields absent from this repo render as "not in repo —
  reported as a gap, not guessed". No decision-maker name is ever invented; the app offers
  buyer *roles* to go and map instead.
- **Proof ratings are never upgraded.** A `THIN` offering shows a THIN badge and an explicit
  "sell the capability — do not imply a track record" line.
- **Credentials are sector-checked.** A credential from outside the target's sector is
  labelled as cross-sector rather than presented as sector depth.
- **Every signal carries a source.** Provenance tag and page or section reference on each one.
- **Fuzzy matches are flagged.** Scores between 60–85 require confirmation before outreach;
  below 60 is treated as Unknown (§2.4).
- **All output is PROVISIONAL — PENDING REVIEW**, per AI Use Policy Draft 0.4.

## Findings worth reading before the demo

Three came out of building it:

1. **The Loma Linda file is not Loma Linda's financials.** It is a third-party market-news
   digest from July 2023 covering McCormick, Levi Strauss and Goodfellow. The account is real
   and is a 2026 new client; the *document* is unusable. The app shows this as a data-quality
   finding rather than silently dropping the account.
2. **"Cornerstone Building Brands" is not "Cornerstone Care."** The former is a CD&R-owned
   building-products manufacturer; the latter is the dormant Aberdeen account named in §2.
   The app scores the match at 55 and flags the collision so the records are not merged.
3. **Cornerstone Building Brands discloses a failed ERP go-live** as a material weakness in
   its 10-Q — assigned staff lacked the experience to complete UAT before going live, and an
   outside firm was retained to remediate. That is the most direct trigger for Large Program
   Assurance in the entire corpus, and it sits in a company with no Aberdeen relationship.

## Known gaps

The scoring leans on data this repo does not contain. With the CRM, the revenue file and the
pipeline sheet wired in, relationship position would come from real ownership and strength
values rather than the bucket alone, and decision-makers would resolve to actual people
instead of role guidance.

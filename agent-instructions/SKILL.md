---
name: aberdeen-brand
description: >
  Aberdeen Advisors brand system and document templates for producing client-ready
  marketing and credential material. Use this whenever creating, editing, or reviewing
  any Aberdeen-branded deliverable — PowerPoint decks, qualification ("qual") pages,
  client POVs, proposals, one-pagers, PDFs, or Word documents. Triggers on: "qual",
  "quals", "credential", "case study", "POV", "pitch deck", "proposal", "one-pager",
  "Aberdeen deck", "client-ready", or any request to build a .pptx / .pdf / .docx for
  Aberdeen Advisors. Contains verified colour tokens, typography with fallbacks, exact
  slide geometry for five document classes, a nine-pattern client-deck layout library,
  working python-pptx recipes, and voice rules.
version: 1.1
last_verified: 081426
companion: >
  AberdeenOfferings.md — the offering taxonomy, service areas, healthcare service lines,
  Epic practice detail and credential inventory. Use it as the content source; this file
  governs form, that file governs substance.
source_of_truth: >
  Theme XML and slide geometry extracted directly from AberdeenAdv_QUALS MASTER.pptx,
  Aberdeen_Quals.pptx, Customers Bank Partnership POV.pptx, NH_Sound Transit Scope
  Interest and Quals.pptx, Premier Health x Aberdeen Overview.pptx, Epic Qual.docx, and
  Aberdeen Advisors Townhall_2025_Q4.pptx.
changelog: >
  1.1 (081426) — added §4.5, the Premier Health client-overview layout library (nine
  patterns incl. the Signal Cyan highlight mechanic); recorded brand fonts now installed
  locally; added AberdeenOfferings.md as companion content source.
  1.0 (081426) — initial extraction.
---

# Aberdeen Advisors — Brand & Document System

Aberdeen Advisors LLC is a boutique management consulting firm (~150 people, Inc. 5000
#643). Deliverables are read by mid-market C-suite buyers and must look like a firm that
charges $900–$1,200/day and competes against Deloitte and Slalom. The aesthetic is
**flat, dense, navy-dominant, and confident** — never playful, never decorative.

> **Read this first:** Aberdeen has **two live brand systems**. Using the wrong one is the
> most common failure. Pick the system from the document class (§3) before choosing any
> colour or font.

---

## 1. The two brand systems

| | **CURRENT** (System B) | **QUALS** (System A) |
|---|---|---|
| Use for | New decks, client POVs, proposals, internal material | Qual pages / credential slides built on the existing quals master |
| Canvas | 13.33 × 7.50 in (client-facing) or 10.00 × 5.62 in (internal) | 10.00 × 5.62 in |
| Theme font | **Poppins** (major *and* minor) | **Roboto** (major *and* minor) |
| Layouts | Custom named — `Title_Dark`, `1/3_Teal`, `Text_Chart`… | Generic — `1_Title and Content`, `5_Title Slide`… |
| Dominant teal | Heritage `#44B0B1` | Signal `#03C0C1` |
| Body text | `#404040` | `#000000` |
| Found in | Customers Bank POV, Townhall Q4 2025 | QUALS MASTER, Aberdeen_Quals, NH_Sound Transit |

**Default to CURRENT** unless you are producing a qual page or extending an existing
quals deck. Never mix the two within one file.

---

## 2. Colour tokens

Every value below was read from theme XML. Each token says what it is *for* — pick by
role, not by eye.

### 2.1 Core — CURRENT system

| Token | Hex | Role and behaviour |
|---|---|---|
| **Deep Navy** | `#09375F` | The brand's anchor. Primary background for title and divider slides, header bands, footer bars. Authoritative, calm. Use it as the default dark surface. |
| **Dark Navy** | `#091C4D` | Deeper variant. Footer bars sitting on a navy slide, and the bottom of vertical gradients. Nearly black at small sizes. |
| **Navy Mid** | `#094E78` | Secondary fill. Second-level bars, alternating table bands, chart series 2. Reads as navy, not blue. |
| **Heritage Teal** | `#44B0B1` | Muted, dusty, sea-glass. **Recedes** against navy. The *surface* teal — large fills, section bars, card backgrounds, left accent rails, table header rows. Default for anything covering more than ~25% of the slide. |
| **Signal Teal** | `#03C0C1` | Vivid, near-electric cyan. **Advances** and pulls the eye. The *point* teal — KPI figures, one-word emphasis, icon strokes, data highlights, callout dots. Keep under ~10% of the slide on CURRENT material; above that it vibrates against navy and cheapens the page. |
| **Teal Light** | `#E7F5F5` | Barely-tinted panel fill. Card and callout backgrounds behind body copy. Always pair with `#404040` text. |
| **Amber** | `#F7CE01` | Highlight and callout label. Thin divider rules, "new"/"key" tags, single emphasised figures. Never as a large fill and never behind body text. |
| **Blue CTA** | `#027BCE` | Links and interactive affordances only. Do not use as a decorative fill — it reads as a hyperlink. |
| **White** | `#FFFFFF` | Light surface; text on navy or teal. |
| **Light Grey** | `#D1D4DD` | Dividers, table borders, 0.8pt rules. |
| **Body Text** | `#404040` | **All body copy.** This is `dk1` of the current theme and the single most-used text colour across every real deck. |
| **Dark Grey** | `#5F5F5F` | Secondary text, captions, source lines, footnotes. |

> **Correction:** `#262626` is widely cited as Aberdeen's body colour. It appears **zero
> times** in any real deck. Use `#404040`.

### 2.2 Accent ramp — CURRENT system

These are `accent2`–`accent6` of the live theme. They are **full palette members**, not
sparing-use status colours. Use them for chart series, category coding, and status.

| Token | Hex | Typical use |
|---|---|---|
| **Cyan** | `#03CBFF` | Chart series, data emphasis |
| **Green** | `#00A676` | Positive delta, on-track, growth |
| **Amber** | `#F7CE01` | Caution, watch-item, highlight |
| **Purple** | `#BD8CFF` | Fourth category, differentiation |
| **Red** | `#D85049` | Negative delta, risk, off-track |

Chart series order: Deep Navy → Heritage Teal → Cyan → Amber → Purple → Navy Mid.

### 2.3 QUALS system

Only when building on the quals master.

| Token | Hex | Role |
|---|---|---|
| **Signal Teal** | `#03C0C1` | `accent1`. Section bar fills and the "Client Sample" tag. |
| **Slate** | `#2D323D` | `accent4`. Top-right corner block and the service tag text. |
| **Blue** | `#027BCE` | `accent2`. Secondary accent. |
| **Navy** | `#094E78` | `accent3`. |
| **Gold** | `#DAA800` | `accent5`. Sparing highlight. |
| **Grey** | `#5F5F5F` | `accent6`. |
| **Orange** | `#F55801` | `dk2`. Rare — legacy accent. Avoid in new work. |
| **Black** | `#000000` | Titles and body copy in this system. |

### 2.4 Supporting neutrals seen in real client work

From the Customers Bank POV — a navy-to-pale blue ramp useful for layered diagrams:
`#185FA5` · `#2D4A6B` · `#41526D` · `#4A6080` · `#4C577F` · `#B0C4D8` · `#F7F7FC`

---

## 3. Typography

### 3.1 The critical constraint

**Poppins, Roboto, and Montserrat are frequently not installed** on Aberdeen machines.
PowerPoint then substitutes silently. The Customers Bank POV shows the damage — Tenorite on
120 text runs against Poppins' 9, baked into a saved production file.

> **Status on the CoE build machine (as of 081426): installed.** Poppins (Regular, Medium,
> SemiBold, Bold, Italic), Roboto (variable, 18 named instances) and Montserrat (Regular,
> SemiBold, Bold) are registered per-user under `%LOCALAPPDATA%\Microsoft\Windows\Fonts`.
> `pick_font()` now resolves to Poppins / Poppins / Roboto.
>
> **This does not fix it for anyone else.** Teammates, and anyone opening a deck on an
> un-provisioned machine, will still substitute. Firm-wide deployment via IT is the real fix.

**Therefore, regardless of what is installed locally: always set the font name explicitly on
every run.** Never rely on the theme default (`+mj-lt` / `+mn-lt`) — it resolves to whatever
the opening machine has, and the substitution is invisible in the file.

Declared fallback chains:

```
Headings:  Poppins  →  Montserrat  →  Calibri
Body:      Poppins  →  Calibri              (CURRENT system)
Body:      Roboto   →  Arial                (QUALS system)
```

When generating a file programmatically, write the **first available** font from the chain
and record which one you used in a comment or the document properties. Do not silently
downgrade.

### 3.2 Size ladder — observed, not aspirational

| Role | CURRENT | QUALS | Notes |
|---|---|---|---|
| Slide title | 24–32pt Bold | **20pt** | Qual titles are 20pt and single-line |
| Section header | 16–24pt SemiBold | 11pt Bold | Qual section bars are 11pt bold reversed on teal |
| Body copy | 11–14pt | **10pt** | Quals are dense; 10pt is the workhorse |
| Bullets / sub-points | 10–12pt | **7–9pt** | Quals go to 7pt for dense engagement detail |
| Tag / label | 8–10pt Bold | **7pt** | Service tag is 7pt right-aligned |
| Footer / caption | 7–8pt | 7pt | |
| Big stat | 40–72pt Bold | — | Single figure, Signal Teal or Amber |

Quals run genuinely small. Do not "improve" a qual by scaling text up — density is the
format's purpose, and a partner expects to fit a full engagement on one page.

---

## 4. Document classes

### 4.1 Qual page — the credential slide

**This is Aberdeen's house credential format.** Canvas **10.00 × 5.62 in**, QUALS system,
one engagement per slide, three fixed sections in a fixed order.

Exact geometry, in inches, from `AberdeenAdv_QUALS MASTER.pptx`:

```
 x     y     w     h
0.50  0.08  1.07  0.19   "Client Sample" tag        11pt, Signal Teal #03C0C1
0.50  0.31  9.00  0.34   TITLE                      20pt, Black, Roboto
8.27  0.34  1.24  0.34   service tag, RIGHT-aligned  7pt, Slate #2D323D
9.04  0.00  0.96  0.91   corner block               fill Slate #2D323D
9.52  0.04  0.42  0.42   logo mark (on the block)
0.50  0.76  9.02  0.36   BAR "Client Overview"      fill #03C0C1, 11pt Bold White
0.88  1.21  8.57  ~0.34  body copy                  10pt
0.50  1.67  9.02  0.36   BAR "Business Situation"   fill #03C0C1, 11pt Bold White
0.88  2.14  8.57  ~0.67  body copy                  10pt
0.50  2.90  9.02  0.36   BAR "Our Engagement"       fill #03C0C1, 11pt Bold White
0.88  3.35  8.65  ~1.30  body copy + bullets        10pt / 7–9pt
0.58  varies 0.20 0.20   bullet markers (square, teal)
8.89  5.28  0.14  0.13   slide number
```

Section bars run the **full 9.02" width in Signal Teal `#03C0C1`**. This is a deliberate
exception to the "Signal points, Heritage covers" rule in §2.1 — the quals master was
built that way and fidelity to the existing deck matters more than the general rule. On
**CURRENT** material, use Heritage `#44B0B1` for bars instead.

Body text sits at x=0.88, indented 0.38" from the bar's left edge at 0.50. Bars are
0.36" tall with 0.55" between the top of one bar and the top of the next when the body
block is single-line. Grow the gap as body copy grows; keep bar heights fixed.

The three sections answer, in order:

1. **Client Overview** — who they are, at scale. One or two sentences. Always includes
   size: employee count, revenue, footprint. *"Client is a regional healthcare provider
   with a network of hospitals, clinics, outpatient centers, and radiology centers. The
   organization employs more than 30,000 employees…"*
2. **Business Situation** — the pressure they were under, in their terms, not ours.
   Market disruption, competitive entrants, risk, legacy constraint.
3. **Our Engagement** — what Aberdeen did. Opens *"Aberdeen was engaged by…"* or
   *"Aberdeen was engaged to…"* then 2–5 bullets of concrete workstreams.

The service tag (top right) names the offering line — e.g. `Advisory - Strategy`,
`Advisory - IT Operating Model`, `Advisory - Quality Assurance`, `Advisory - Business
Partnerships`, `Epic Advisory & Build`. The `Client Sample` tag (top left) signals the
client is anonymised.

### 4.2 Client POV / proposal

Canvas **13.33 × 7.50 in**, CURRENT system, Poppins, named layouts.

Available named layouts on the current master:

`Title_Dark` · `Title_Light` · `Title_Image` · `Divider_Dark_Plain` · `Divider_Dark_Num` ·
`Divider_Light_Plain` · `Divider_Light_Num` · `1/3_Dark` · `1/3_Teal` · `Large Text Box` ·
`Double Text` · `Text_Chart` · `Standard_Chart` · `Title_Blank` · `Title_Subtitle_Blank` ·
`Blank` · `1 col w/ subtitle` · `1 col content`

Structure that works for a POV: `Title_Dark` → executive summary on `Large Text Box` →
`Divider_Dark_Num` per section → `Text_Chart` or `Double Text` for content → recommendation
on `1/3_Teal` → next steps on `Title_Light`.

### 4.3 Internal deck

Canvas **10.00 × 5.62 in**, CURRENT system, named layouts. Every slide carries:

- Teal left accent rail, 0.18" wide, full height
- Amber divider rule, 0.06" tall, under the header
- Dark navy footer bar, 0.4" tall, at y=5.10
- Footer text: `CONFIDENTIAL  ·  Aberdeen Advisors  ·  {year}` — 7pt White, Roboto
- Logo bottom-left at (0.29, 5.33), 0.73 × 0.16 in
- Slide number bottom-right, 8pt White

Qual pages do **not** carry the confidentiality footer — they carry only a slide number.

### 4.4 Written qual (Word / PDF)

Long-form narrative credential, used for GSA/federal responses (the source references
"SIN-relevant work"). Structure from `Epic Qual.docx`:

```
H1  Detailed description of [scope]-relevant work performed and results achieved
H2    Project Background / Purpose
H2    Goals / Objectives              → flat list, each a full outcome sentence
H2    Guiding Principles              → declarative, first-person-plural ("we will…")
H2    Scope
        In Scope                      → exhaustive list
        Out of Scope
H2    Key Performance Indicators
H2    Governance                      → committee structure
H2    Results Achieved                → quantified
```

Use `<Client>` as the anonymisation placeholder — that is the existing convention.

### 4.5 Client overview / capability deck — the Premier Health pattern

**Reference file:** `Premier Health x Aberdeen Overview.pptx` (28 slides). Canvas
**10.00 × 5.62 in**, CURRENT system, Poppins throughout, `Title_Blank` for most content
slides with everything composed as shapes. This is the strongest layout reference in the
Quals folder and the pattern to copy for capability, POV and client-overview decks.

**Slide furniture, every slide:**

```
 0.00, 0.05  full-width teal rule, ~0.02" tall, Heritage #44B0B1   <- the signature
 0.30, 0.22  TITLE, Poppins ~28-30pt, Deep Navy #09375F
 0.30, 0.68  subtitle / thesis line, Poppins ~16pt, Deep Navy
 0.30, 5.28  CLIENT logo (bottom-left)
 8.55, 5.24  Aberdeen logo (bottom-right)
 9.62, 5.30  slide number, 8pt grey
```

No confidentiality footer bar on this deck class — client logo left, Aberdeen logo right.
The teal top rule does the brand work instead of a navy header band.

**Pattern A — two cards flanking a logo medallion** (slide 3)
Left card `0.38, 1.55, 3.35 × 2.05`; right card `6.25, 1.55, 3.40 × 2.05`. Both white fill,
0.75pt Light Grey `#D1D4DD` border, no shadow. Centred white circle ~`4.15, 1.55, 1.65 sq`
holding the Aberdeen chevron, with a 1pt grey connector line and small dots joining each card
to the circle. Card headings are bold Deep Navy ~13pt with a short 1pt navy underline rule
directly beneath. Two-column bullet list inside the right card.

**Pattern B — the highlight mechanic** ← *the most useful thing in this deck*
A generic capability or industry list is tailored per client by rendering the relevant items
in **Signal Cyan `#03CBFF`, bold** and leaving the rest in regular Body `#404040`. Same list,
same slide, retargeted in seconds. On slide 3, Strategy & Transformation, Organizational &
Operational Efficiency, Platform Implementation & Modernization and Product & Application
Services are cyan; Healthcare is cyan in the industry column. Use this instead of deleting
non-relevant items — it signals breadth *and* focus at once.

**Pattern C — navy-header card** (slide 4)
Navy `#09375F` fill bar as the card header with White bold ~11pt text, white body beneath,
thin navy border around the whole card. Header copy reads as continuing prose across the three
cards: *"Our team of strategy and technology experts…"* / *"…provides services from strategy
to implementation to all industries"* / *"…advising a diverse set of Fortune 500 clients, PE
firms and leading companies."* Three cards, one sentence.

**Pattern D — service list with industry column strip** (slide 4)
Service areas as bold navy label + regular sub-service line, separated by dotted grey rules.
To the right, narrow vertical columns of rotated 90° industry labels in pale teal `#E7F5F5`,
with the active industry column filled Cyan `#03CBFF` and its label in white. Compact way to
say "this applies across industries, and yours especially."

**Pattern E — client logo grid with dashed highlight** (slide 4)
Logos on a regular grid, ~10 per row. The relevant subset is enclosed in a **dashed Amber
`#F7CE01` rectangle** with an italic label above it in a warm accent (*"Representative
healthcare clients"*). Honest and effective — shows the full roster while directing attention.

**Pattern F — three-band themed grouping** (slide 6)
Left column of navy `#09375F` blocks carrying a theme question in white bold, each ~2.35"
tall. Bands separated by dashed grey horizontal rules. Right side per band: a small schematic
icon, a thin numbered circle, then **bold Signal Cyan lead-in phrase followed by regular body
copy** — e.g. *"**Office of the CIO design & standup:** Building the structure, cadence, and
visibility…"*. Body is italic on this deck. Excellent for "here are the N things we should
discuss."

**Pattern G — quadrant wheel** (slide 14)
Four coloured quarter-circles around a central white circle holding a platform logo. Quadrant
colours: Heritage Teal `#44B0B1` (top-left), Blue `#027BCE` (top-right), Gold `#DAA800`
(bottom-left), Deep Navy `#09375F` (bottom-right). Each quadrant carries a white line icon,
and the matching corner text block has a **bold heading in that quadrant's colour** with
square bullets in the same colour. Thin grey cross-hairs extend from the wheel to the edges.
Use for a four-part capability model.

**Pattern H — capability + proof two-column** (slides 7, 9, 13, 19, 23)
Recurring structure: a thesis sentence under the title, then **"Aberdeen Capabilities"** left
and **"Select Aberdeen Experience"** right. This is the slide that pairs a claim with a
credential — pull the right-hand column from `AberdeenOfferings.md` §7–§8.

**Pattern I — progress dots** (slide 14)
Numbered circles 1–6 at top right, ~0.22" diameter, active one filled Deep Navy with a white
numeral, inactive outlined grey. Signals position within a multi-topic agenda.

> **Companion file:** `AberdeenOfferings.md` holds the actual offering taxonomy — six
> capabilities, five service areas, the healthcare service lines, the Epic practice detail,
> and the credential inventory extracted from this deck plus both qual trackers. Use it as the
> content source whenever you build with the patterns above; do not re-invent offering names.

---

## 5. Working recipes (python-pptx)

A ready module ships alongside this file: **`aberdeen_brand.py`**. Import it rather than
re-deriving geometry.

```python
from aberdeen_brand import (
    NAVY, NAVY_DARK, NAVY_MID, TEAL_HERITAGE, TEAL_SIGNAL, TEAL_LIGHT,
    AMBER, BLUE_CTA, WHITE, GREY_LIGHT, BODY, GREY_DARK, SLATE,
    new_qual_deck, add_qual_page, new_current_deck, add_title_slide,
    add_divider, add_footer, pick_font, swatch_page, export_pdf,
)

prs = new_qual_deck()                       # 10.00 x 5.62, QUALS system
add_qual_page(
    prs,
    title="Healthcare Transformation Office",
    service_tag="Advisory - Strategy",
    client_overview="Client is a regional healthcare provider ...",
    business_situation="With the extent of change occurring ...",
    engagement="Aberdeen was engaged to work closely with ...",
    engagement_bullets=[
        "Defined the strategy and framed the operating model",
        "Established governance across three workstreams",
    ],
)
prs.save("Aberdeen_Quals_HealthcareTMO_081426.pptx")
```

Rules the module enforces so you do not have to remember them:

- Fonts set explicitly on every run, resolved through the fallback chain
- `Inches()` for all geometry, never raw EMU
- Blank layout as the base, all elements placed programmatically for exact control
- No shadows, no 3D, no gradients unless the layout already carries one
- Text frames set to `word_wrap=True` with a 0.05" internal margin

### PDF export

Two paths. Prefer the first — it preserves the real layout.

1. **PowerPoint COM** (Office 16 is installed): `export_pdf("deck.pptx")` drives
   PowerPoint to save as PDF. Highest fidelity; Windows only; PowerPoint must be closed.
2. **`reportlab`** for documents authored directly as PDF (written quals, one-pagers).
   Use the same tokens and the 0.5" margin grid.

Always open and eyeball the PDF. Font substitution is invisible until you look.

---

## 6. Voice and tone

Derived from the real qual copy. Match it.

**Do:**
- Third person, past tense, factual. *"Aberdeen was engaged by the Chief Digital Officer to…"*
- Lead with the client's situation, not Aberdeen's capability
- Concrete scale: *"30,000 employees"*, *"$10B in revenue"*, *"one of the largest initiatives the organization has undertaken"*
- Name the buyer's role when it strengthens credibility: *"engaged by the Chief Digital Officer"*
- Plain verbs: framed, defined, designed, built, deployed, stood up, assessed, refined
- Anonymise as *"Client is a regional healthcare provider…"* and carry the sector in the tag

**Do not:**
- Use hype — "cutting-edge", "revolutionary", "world-class", "best-in-class", "leverage synergies"
- Claim outcomes without a number, or cite a percentage with no source
- Write in first person singular, or address the reader as "you" in a qual
- Use em-dash-heavy or exclamatory copy
- Name a client directly in a qual unless you have written approval

Positioning language, when needed: boutique speed and senior-practitioner delivery against
Big-4 cost and timelines. 2–6 week sprints, not 3–9 month programs. Fixed-fee where
possible. Never disparage a named competitor.

---

## 7. Compliance — non-negotiable

Governed by **`AI Use Policy - Draft 0.4`**.

- **All client data is Level 3** — *"strictly prohibited from any external AI tools,
  including personal paid accounts."* Do not paste client engagement content, names, or
  figures into an external LLM. Work locally, or inside the Microsoft tenant boundary.
- **Firm IP and trade secrets are Level 4** — no anonymisation workaround permitted.
- **Human-in-the-loop is mandatory.** AI-generated output *"must be provisional and
  require explicit human review and approval before finalization."* Mark drafts
  **PROVISIONAL — PENDING REVIEW** until a human signs off.
- Confidentiality footer on internal and client decks:
  `CONFIDENTIAL  ·  Aberdeen Advisors  ·  {year}`
- Client names in outward-facing material require approval. Default to anonymised.

## 8. File naming

`Aberdeen_[Topic]_[YYYY]_v[N].pptx` for versioned deliverables.
Date suffixes are **MMDDYY** with no separators — `081426`, never `20260814` or `2026-08-14`.

Logo: `C:\Users\FarazSyed\Documents\Aberdeen Data & AI COE\aberdeen_logo.png`
(2262 × 510 RGBA — teal chevron + navy wordmark). Never distort, recolour, or place on a
background that reduces legibility.

---

## 9. Self-check before declaring a deliverable done

1. Correct **system** for the document class? Not mixed?
2. Correct **canvas** — 10.00 × 5.62 or 13.33 × 7.50?
3. Font name set **explicitly** on every run, from the fallback chain?
4. Body text `#404040` (CURRENT) or `#000000` (QUALS) — not `#262626`?
5. Teal used per role — Heritage for surfaces, Signal for points (except qual bars)?
6. Logo present, undistorted, correct position for the class?
7. Footer and slide numbers on internal/client decks; slide number only on quals?
8. Qual pages carry all three sections in order, with a scale figure in Client Overview?
9. No hype language, no unsourced percentages, no unapproved client names?
10. Marked **PROVISIONAL** if not yet human-reviewed?
11. Opened the rendered file and **looked at it** — no overflow, no font substitution, no
    text colliding with the corner block?

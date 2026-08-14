/* ============================================================
   Aberdeen Pursuit Intelligence — Aberdeen-side knowledge base
   Source: hack-team-10/agent-instructions/AberdeenOfferings.md,
           AGENT_WORKFLOW.md, SKILL.md  (all facts trace to those files)
   Level 3 — local only. No external calls anywhere in this app.
   ============================================================ */

const ABERDEEN = {

  firm: {
    name: "Aberdeen Advisors",
    profile: [
      { label: "Team", value: "250+ (2026)", note: "2 in 2019 → 250+ in 2026" },
      { label: "Recognition", value: "Inc. 5000", note: "Top 20 fastest-growing tech services co. in US" },
      { label: "Model", value: "Virtual-first", note: "HQ Chicago · offshore engineering Hyderabad" },
      { label: "Revenue 2026 (thru 8/6)", value: "$23.4M", note: "+32% vs 2025 same period ($17.7M), 30 accounts" },
    ],
    positioning: "Boutique speed and senior-practitioner delivery against Big-4 cost and timelines. 2–6 week sprints, not 3–9 month programs.",
    aberdeenRivals: "Per the CoE strategy session: the real competitive threat is Regional Boutiques (Slalom, West Monroe, Protiviti) and Pure-Play AI shops — not the Big-4.",
  },

  capabilities: [
    "Strategy & Transformation",
    "Deal Enablement & Growth",
    "Organizational & Operational Efficiency",
    "Financial Transparency",
    "Platform Implementation & Modernization",
    "Product & Application Services",
  ],

  industries: [
    "Construction", "Consumer Products", "Education", "Financial Services",
    "Healthcare", "Infrastructure", "Life Sciences", "Manufacturing",
    "Private Equity", "Public Sector", "Real Estate", "Retail",
    "Technology", "Transportation",
  ],

  /* The five sellable service areas + proof strength from AberdeenOfferings.md §10.
     Strength ratings are NEVER upgraded in this app — honesty mechanic. */
  offerings: [
    {
      id: "tso",
      name: "Technology Strategy & Operations",
      subServices: "Strategic Planning · Product Mgmt. · Value Tracking",
      strength: "MODERATE",
      proofNote: "3 Growth Strategy engagements + portfolio management content.",
    },
    {
      id: "itfm",
      name: "IT Financial Mgmt. & Optimization",
      subServices: "Cost Transparency · FP&A · Cost Transformation",
      strength: "THIN",
      proofNote: "Capability asserted, proof indirect (global sourcing business case; Orgill IT financial model). Sell the capability — do not imply a track record.",
    },
    {
      id: "aidata",
      name: "Technology Future-Proofing (AI & Data)",
      subServices: "AI & Data Readiness · Governance · Transformation",
      strength: "MODERATE",
      proofNote: "Delivered BI/MDM/data-platform work; ONE live AI engagement (Arkema KM Copilot & Energy Mgmt, Clear Lake) — citable as in progress, never as a delivered outcome.",
    },
    {
      id: "lpa",
      name: "Large Program Assurance, Delivery & Change",
      subServices: "EHR · ERP · Digital Transformations",
      strength: "STRONG",
      proofNote: "8 EHR/Epic credentials with quantified outcomes; ERP credentials cross-industry incl. brand-name retail.",
    },
    {
      id: "ma",
      name: "M&A Enablement",
      subServices: "IT Due Diligence · Integration Planning · Value Creation",
      strength: "STRONG",
      proofNote: "4 credentials spanning provider and PE, $4B transaction to <$50M — buy-side diligence and post-merger execution.",
    },
  ],

  /* Credential inventory highlights — anonymised per house convention
     ("Client is a [size] [sector] [type]…"). From AberdeenOfferings.md §7–§8. */
  credentials: [
    { id: "epic18", offering: "lpa", sector: "Healthcare",
      text: "Epic Foundations implementation of 18 modules over 12 months, achieving 9 stars", clientType: "Payvider", band: "$1B–$5B", quantified: true },
    { id: "apprat", offering: "lpa", sector: "Healthcare",
      text: "Application rationalization strategy & execution after Epic implementation — $50M+ savings over 5 years", clientType: "Provider", band: "$500M–$999M", quantified: true },
    { id: "dmo4b", offering: "ma", sector: "Healthcare",
      text: "Stood up a digital management office to guide post-merger IT integration planning in a $4B transaction", clientType: "Provider", band: "$5B+", quantified: true },
    { id: "pedd", offering: "ma", sector: "Private Equity",
      text: "IT due diligence for acquisition of an independent dermatology practice operator", clientType: "Private Equity", band: "$50–500M", quantified: false },
    { id: "ocio", offering: "tso", sector: "Healthcare",
      text: "Business case and operating model for global sourcing transformation across all IT towers (Apps, Infra, Data, Cyber)", clientType: "Provider", band: "$10B+", quantified: false },
    { id: "digstrat", offering: "tso", sector: "Healthcare",
      text: "Built and rolled out digital strategy — patient access, digital operations, community health — incl. cross-functional operating model", clientType: "Payvider", band: "$1B–$5B", quantified: false },
    { id: "pbicockpit", offering: "aidata", sector: "Healthcare",
      text: "Power BI analytics cockpit for all in-flight projects and requested demand across 4 source systems", clientType: "Provider", band: "$5B+", quantified: false },
    { id: "mdm", offering: "aidata", sector: "Healthcare",
      text: "Data Governance and MDM strategy using Azure Fabric, Informatica MDM, and Databricks", clientType: "Payvider", band: "$1B–$5B", quantified: false },
    { id: "arkemalive", offering: "aidata", sector: "Manufacturing",
      text: "KM Copilot & Energy Management engagement (Clear Lake) — Phase 1 kickoff Nov 2025, tech discovery Aug 2026. IN FLIGHT — cite as in progress only", clientType: "Specialty chemicals", band: "Enterprise", quantified: false, inFlight: true },
    { id: "walmarterp", offering: "lpa", sector: "Retail",
      text: "Led ERP transformation at the world's largest retailer — finance and supply chain for food manufacturing across Central America, Mexico and a US greenfield plant", clientType: "Retail", band: "Enterprise", quantified: false },
    { id: "unilever", offering: "lpa", sector: "Consumer Products",
      text: "SAP supply chain across European manufacturing units; global procurement delivering ~$2.5M/year spend impact", clientType: "Consumer goods", band: "Enterprise", quantified: true },
    { id: "commconn", offering: "tso", sector: "Healthcare",
      text: "Refined Community Connect expansion into a new state — provider group onboarding reduced from 6 to 3 months", clientType: "Provider", band: "$5B+", quantified: true },
    { id: "erphcm", offering: "lpa", sector: "Healthcare",
      text: "ERP & HCM platform strategy and selection incl. program design, activation, implementation assurance", clientType: "Payvider", band: "$1B–$5B", quantified: false },
    { id: "supchain", offering: "aidata", sector: "Healthcare",
      text: "Supply chain dashboards improving order funnel visibility, customer experience and SLA performance", clientType: "Provider", band: "$5B+", quantified: false },
  ],

  /* Account records for the 13 companies in the signal corpus.
     Buckets follow AGENT_WORKFLOW.md §2. Relationship facts come ONLY from
     the instruction files — where the repo has no CRM/revenue data, fields
     are null and the app reports the gap ("empty is a finding", §6.5). */
  accounts: [
    {
      id: "arkema", name: "Arkema", industry: "Manufacturing & Industrial",
      bucket: "existing-live", play: "Expansion — build on the live engagement",
      liveEngagementOffering: "aidata",
      matchNote: { score: 100, basis: "Named in AGENT_WORKFLOW.md §0 as a synced engagement library (Arkema — KM Copilot & Energy Management)." },
      relationship: {
        status: "Active Client — engagement in flight",
        engagement: "KM Copilot & Energy Management (Clear Lake). Phase 1 kickoff Nov 2025; tech discovery Aug 2026.",
        owner: null, strengthField: null, contacts: null, lastInteraction: null,
        note: "Engagement facts from AGENT_WORKFLOW.md. Owner, strength and contacts live in the CRM, which is not in this repo — reported as unavailable, not guessed.",
      },
      rosterEvidence: "On the client roster (AberdeenOfferings.md §9).",
    },
    {
      id: "centene", name: "Centene Corporation", industry: "Healthcare & Life Sciences",
      bucket: "dormant", play: "Win-back — lead with what changed since we left",
      matchNote: { score: 100, basis: "Named in AGENT_WORKFLOW.md §2 as dormant/churned (2025 revenue, zero 2026) and on the client roster." },
      relationship: {
        status: "Former client — dormant in 2026",
        engagement: null, owner: null, strengthField: null, contacts: null, lastInteraction: null,
        note: "Dormancy is documented; engagement history and contacts are in the CRM/Quals tracker, not in this repo.",
      },
      rosterEvidence: "On the client roster, healthcare group (§9).",
    },
    {
      id: "krispykreme", name: "Krispy Kreme", industry: "Consumer & Retail",
      bucket: "dormant", play: "Win-back — re-open with a cost/turnaround angle",
      matchNote: { score: 100, basis: "Named in AGENT_WORKFLOW.md §2 as dormant/churned and on the client roster." },
      relationship: {
        status: "Former client — dormant in 2026",
        engagement: null, owner: null, strengthField: null, contacts: null, lastInteraction: null,
        note: "Prior engagement detail lives in the Quals tracker, not in this repo.",
      },
      rosterEvidence: "On the client roster (§9).",
    },
    {
      id: "constellation", name: "Constellation Energy", industry: "Energy & Utilities",
      bucket: "new-2026", play: "Land-and-expand — deepen a first-year relationship",
      matchNote: { score: 100, basis: "CONFIRMED against the CRM account list (081426): the account is \"Constellation Energy Generation LLC\", the merchant-generation subsidiary that files these results. Earlier 88-score flag is resolved." },
      relationship: {
        status: "New client in 2026 — identity confirmed",
        engagement: null, owner: null, strengthField: null, contacts: null, lastInteraction: null,
        note: "Identity confirmed; owner, strength and contacts still require the CRM's populated fields.",
      },
      rosterEvidence: "\"Constellation\" evidenced in engagement folders / past-engagement examples (§9).",
    },
    {
      id: "novant", name: "Novant Health", industry: "Healthcare & Life Sciences",
      bucket: "roster-active", play: "Expand — healthcare is Aberdeen's credential stronghold",
      matchNote: { score: 100, basis: "Named on the client roster as a representative healthcare client (§9)." },
      relationship: {
        status: "Roster client — 2026 revenue status not in this repo",
        engagement: null, owner: null, strengthField: null, contacts: null, lastInteraction: null,
        note: "Roster presence is documented; current revenue trajectory requires the revenue file (not in repo).",
      },
      rosterEvidence: "Representative healthcare client on the roster slide (§9).",
    },
    {
      id: "lpl", name: "LPL Financial", industry: "Financial Services",
      bucket: "roster-active", play: "Expand — Financial Services is CoE priority sector #1",
      matchNote: { score: 100, basis: "Named on the client roster (§9)." },
      relationship: {
        status: "Roster client — 2026 revenue status not in this repo",
        engagement: null, owner: null, strengthField: null, contacts: null, lastInteraction: null,
        note: "Roster presence documented; trajectory and owner require the CRM/revenue file.",
      },
      rosterEvidence: "On the client roster (§9).",
    },
    {
      id: "alphabet", name: "Alphabet (Google)", industry: "Technology & Software",
      bucket: "roster-active", play: "Targeted expansion — scope a beachhead, not the enterprise",
      matchNote: { score: 100, basis: "CONFIRMED against the CRM account list (081426): \"Google\" is a named account. Identity is settled; the open question is SCOPE — nothing says which Google organisation or what was delivered, and the scale sits well outside Aberdeen's mid-market motion.", flagged: true },
      relationship: {
        status: "Roster client — scope of relationship unknown from this repo",
        engagement: null, owner: null, strengthField: null, contacts: null, lastInteraction: null,
        note: "Roster shows the logo; nothing in this repo says what was delivered or for which Google org.",
      },
      rosterEvidence: "On the client roster (§9).",
    },
    {
      id: "core", name: "Core Natural Resources", industry: "Energy & Utilities",
      bucket: "cold", play: "Cold — no Aberdeen relationship (earlier roster match was wrong)",
      matchNote: { score: 0, basis: "RESOLVED AGAINST THE CRM ACCOUNT LIST (081426): the Aberdeen account abbreviated \"Core\" on the roster slide is CORE COVERS, a spa/hot-tub cover manufacturer — not Core Natural Resources, the Appalachian coal producer whose filing is in client-data/. Two unrelated companies. The §2.4 flag was correct to hold; the answer is no relationship.", flagged: true },
      relationship: {
        status: "No Aberdeen relationship — distinct from the CRM account 'Core Covers'",
        engagement: null, owner: null, strengthField: null, contacts: null, lastInteraction: null,
        note: "Keep these records separate. Core Covers is the client; Core Natural Resources is a cold prospect that happens to share a first word.",
      },
      rosterEvidence: "None. The roster's \"Core\" is Core Covers.",
    },
    {
      id: "cornerstone", name: "Cornerstone Building Brands", industry: "Manufacturing & Industrial",
      bucket: "prospect", play: "Qualify — near-name collision with a different dormant account",
      matchNote: { score: 55, basis: "CONFIRMED against the CRM account list (081426): the Aberdeen account is \"Cornerstone Care\", a community health provider — a DIFFERENT company from Cornerstone Building Brands, the CD&R-owned building-products manufacturer whose 10-Q is in client-data/. Below the 60 threshold → treated as a new prospect, collision flagged so no one merges the records.", flagged: true },
      relationship: {
        status: "No documented Aberdeen relationship",
        engagement: null, owner: null, strengthField: null, contacts: null, lastInteraction: null,
        note: "Not on the roster. The similarly-named \"Cornerstone Care\" is a former client — keep the records separate.",
      },
      rosterEvidence: "None.",
    },
    {
      id: "cpk", name: "Chesapeake Utilities Corporation", industry: "Energy & Utilities",
      bucket: "prospect", play: "Qualify — fits CoE priority sector #2 (Energy & Industrials)",
      matchNote: { score: 0, basis: "No match. CONFIRMED against the CRM account list (081426) — and note the near-miss: the CRM holds \"Chesapeake Spice\", a seasoning blender, which is a DIFFERENT company. Cold prospect; Energy & Industrials is a CoE priority sector where credentials are thin — Arkema is the visible engagement.", flagged: true },
      relationship: {
        status: "No documented Aberdeen relationship",
        engagement: null, owner: null, strengthField: null, contacts: null, lastInteraction: null,
        note: "Do not merge with the CRM account 'Chesapeake Spice' — unrelated company, shared first word only.",
      },
      rosterEvidence: "None.",
    },
    {
      id: "dauch", name: "Dauch Corporation", industry: "Manufacturing & Industrial",
      bucket: "cold", play: "Cold — requires external research before pursuit",
      matchNote: { score: 0, basis: "No match anywhere in the instruction set. Per §2 this is Unknown — external research required; said plainly." },
      relationship: {
        status: "No documented Aberdeen relationship",
        engagement: null, owner: null, strengthField: null, contacts: null, lastInteraction: null, note: null,
      },
      rosterEvidence: "None.",
    },
    {
      id: "lsf", name: "Livestock Feeds Plc", industry: "Agriculture & Food",
      bucket: "cold", play: "Deprioritize — outside geographic focus",
      matchNote: { score: 0, basis: "No match. CONFIRMED against the CRM account list (081426) — and note the near-miss: the CRM holds \"Livestock Nutrition Center\", a US animal-feed business, which is a DIFFERENT company. This one is Nigerian-listed (figures in ₦'000); Aberdeen's geography vocabulary covers US regions, India, Europe and Global, with no African footprint documented.", flagged: true },
      relationship: {
        status: "No documented Aberdeen relationship",
        engagement: null, owner: null, strengthField: null, contacts: null, lastInteraction: null,
        note: "Do not merge with the CRM account 'Livestock Nutrition Center' — unrelated company on a different continent.",
      },
      rosterEvidence: "None.",
    },
    {
      id: "lomalinda", name: "Loma Linda University Health", industry: "Healthcare & Life Sciences",
      bucket: "new-2026", play: "Land-and-expand — but the signal document is unusable",
      matchNote: { score: 100, basis: "Named as a new-2026 account (AGENT_WORKFLOW.md §2) and on the healthcare roster (§9)." },
      relationship: {
        status: "New client in 2026",
        engagement: null, owner: null, strengthField: null, contacts: null, lastInteraction: null,
        note: "Relationship exists per the instruction files; detail requires the CRM.",
      },
      rosterEvidence: "On the healthcare roster (§9); listed among 2026 new accounts (§2).",
      dataQualityFlag: "The file named after Loma Linda in client-data/ is a third-party market-news digest from July 2023 — NOT their financials. No buying signals can be extracted for this account from this corpus.",
    },
  ],

  /* Decision-maker mapping: the CRM's Key Contacts / Decision Makers /
     Executive Sponsorship columns are empty on nearly every account and the
     CRM itself is not in this repo. Per guardrail §6.5 the app reports the
     gap and offers ROLE-level guidance only — never invented names. */
  buyerRolesByOffering: {
    tso:   ["CIO / CDIO", "COO", "Head of PMO / Portfolio"],
    itfm:  ["CFO", "CIO", "VP IT Finance"],
    aidata:["Chief Data / AI Officer", "CIO", "CISO (governance)", "Functional VP sponsoring the use case"],
    lpa:   ["CIO", "Program executive sponsor", "CHRO (HCM) / CFO (ERP)"],
    ma:    ["CFO", "Corp Dev / Strategy lead", "PE deal team / operating partner"],
  },

  guardrails: [
    "Level 3 — all account, revenue and relationship data stays local. No external model, no external API. This app makes zero network calls.",
    "Empty is a finding: CRM contact fields are reported as unavailable, never filled with a plausible guess. A fabricated decision-maker name is the single worst failure mode.",
    "Proof-strength badges come from AberdeenOfferings.md §10 and are never upgraded to flatter the page.",
    "Every signal carries a provenance tag (filing · press release · aggregator · CRM · inference) and a source reference.",
    "The CRM's Fake Data sheet (1,000 fabricated rows) is excluded by construction — this app was built without it.",
    "All generated outreach is PROVISIONAL — PENDING REVIEW. Nothing leaves the building without explicit human approval (AI Use Policy Draft 0.4).",
    "AI credentials are in flight, not delivered: Arkema KM Copilot & Energy Management is citable as in progress only. CARES and 'Building Trusted AI at Enterprise Scale' are frameworks, not engagements.",
    "Fuzzy matches between 60–85 are flagged for confirmation; below 60 treated as Unknown (workflow §2.4).",
  ],

  dataCoverage: {
    available: [
      "CRM account NAME list — 30 accounts, supplied 081426. Resolved four identity questions and exposed three near-miss name collisions (Core, Chesapeake, Livestock)",
      "Signal corpus: 13 public documents in client-data/ (12 usable, 1 flagged)",
      "Offering taxonomy, credential inventory and proof-strength map (AberdeenOfferings.md)",
      "Account classification facts and revenue baseline (AGENT_WORKFLOW.md)",
      "Brand system for generated collateral (SKILL.md)",
    ],
    missing: [
      "CRM 'Active Accounts' FIELD data (43 fields × 30 accounts) — the account names are now known, but Status, Industry, Size, Owner, Strength and the rest still live at the CoE base path",
      "Revenue file (2026 vs 2025 by account) — only the firm-level baseline is documented",
      "Pipeline sheet (named opportunities with values)",
      "Engagement libraries (kickoff decks, minutes) — local-only by policy, never committed",
      "Key Contacts / Decision Makers / Executive Sponsorship — largely blank in the CRM itself",
    ],
  },
};

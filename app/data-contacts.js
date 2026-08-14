/* ============================================================
   Aberdeen Pursuit Intelligence — researched decision-makers
   Populated by web-research agents on 08/14/26 from PUBLIC sources
   only (company leadership pages, press releases, SEC filings,
   business press). Verified against 2026-dated sources or live pages.

   NOT CRM data. The CRM's Key Contacts / Decision Makers /
   Executive Sponsorship fields remain reported as gaps — this is a
   separate, sourced research layer that never fills those in.

   No emails or phone numbers are collected, by design.
   `bringUp` ties each person to a signal or investment already in
   the app, so the opener is evidenced rather than generic.
   confidence: "verified-current" | "reconfirm" (source >6 months old)
   ============================================================ */

const CONTACTS = {

  alphabet: {
    researched: "researched 08/14/26",
    executives: [
      { name: "Anat Ashkenazi", title: "SVP & CFO, Alphabet and Google", usBased: true,
        confidence: "verified-current", source: "Alphabet Investor Relations, March 2026",
        bringUp: "Cost governance and ROI tracking on a capex program that doubled YoY to $44.9B in Q2 and turned free cash flow negative. She is publicly driving a cost-efficiency push against that spend." },
      { name: "Thomas Kurian", title: "CEO, Google Cloud", usBased: true,
        confidence: "verified-current", source: "Google Cloud Press Corner, 2026",
        bringUp: "Cloud grew 82% to $24.8B with enterprise AI adoption at ~90% of the Fortune 100 — the delivery-capacity conversation, and a route to Cloud's own enterprise customers." },
      { name: "Amin Vahdat", title: "Chief Technologist, AI Infrastructure", usBased: true,
        confidence: "verified-current", source: "Google, role created Dec 2025",
        bringUp: "The $70B raise earmarked for AI infrastructure and global compute — program delivery assurance ahead of the build-out." },
    ],
    notes: "No corporate CIO is publicly identified — Ben Fried left the role years ago and no successor has been named; aggregator listings showing him are stale. Scale mismatch with Aberdeen's mid-market motion: target a beachhead, not the enterprise.",
  },

  lpl: {
    researched: "researched 08/14/26",
    executives: [
      { name: "Greg Gates", title: "Group Managing Director, Chief Technology & Information Officer", usBased: true,
        confidence: "verified-current", source: "LPL.com leadership page, live 2026",
        bringUp: "The Commonwealth platform conversion completing in Q4 2026 against a public ~90% retention target, with onboarding delay named as a top risk in the release. Program assurance is the direct fit." },
      { name: "Matt Audette", title: "President & Chief Financial Officer", usBased: true,
        confidence: "verified-current", source: "LPL Investor Relations, 2026",
        bringUp: "He lowered the 2026 Core G&A outlook to $2,140–2,165M while absorbing acquisitions — technology cost transparency against a public commitment. As President he also owns operations, so he is one buyer for two conversations." },
      { name: "Wayne Bloom", title: "MD & CEO, Commonwealth Financial Network (LPL)", usBased: true,
        confidence: "verified-current", source: "LPL press release Aug 2025; RIABiz, July 2026",
        bringUp: "He leads the Commonwealth community through integration and has spoken publicly about the difficulty of the staff reductions — advisor-retention and change management around the conversion." },
    ],
    notes: "CEO is Rich Steinmeier. No standalone COO; Audette covers operations as President.",
  },

  constellation: {
    researched: "researched 08/14/26",
    executives: [
      { name: "Mike Koehler", title: "EVP & Chief Administration Officer", usBased: true,
        confidence: "verified-current", source: "constellationenergy.com executive profile, Aug 2026",
        bringUp: "Integrating two legacy IT estates post-Calpine, and standing up the new fleet-wide EFOF metric across a 55 GW portfolio. He is the functional IT/cyber/digital buyer — there is no titled CIO." },
      { name: "Shane Smith", title: "EVP & Chief Financial Officer", usBased: true,
        confidence: "verified-current", source: "Constellation 8-K Nov 2025, effective Jan 2026",
        bringUp: "Calpine integration costs rising to $84M a quarter, plus the $860M Brazos Valley divestiture closing by year-end. New in the seat since January — an early-tenure CFO is receptive to an outside read." },
      { name: "Daniel Eggers", title: "Senior EVP, Finance and Data Economy", usBased: true,
        confidence: "verified-current", source: "Constellation leadership page, Aug 2026",
        bringUp: "The 920 MW of new long-term PPAs with data-center and corporate buyers. His role was created for exactly this — commercial platform and contract-management capability." },
    ],
    notes: "Heavy churn around the $16.4B Calpine close: CFO changed hands in January, and Andrew Novotny moved from Calpine CEO to Special Advisor around 11 Aug 2026 — integration leadership is in flux, which is both an opening and a reason to confirm reporting lines first.",
  },

  novant: {
    researched: "researched 08/14/26",
    executives: [
      { name: "Onyeka Nchege", title: "EVP & Chief Digital and Information Officer", usBased: true,
        confidence: "verified-current", source: "novanthealth.org leadership page, Aug 2026",
        bringUp: "Capex up 50% to $277.7M in Q1 with projects entering service across 19 medical centers, plus the four-region operating model rolled out in 2025 — PMO and delivery governance. Aberdeen's healthcare credentials are strongest here." },
      { name: "Alice Pope", title: "EVP & Chief Financial Officer", usBased: true,
        confidence: "verified-current", source: "novanthealth.org leadership page, Aug 2026",
        bringUp: "Labor costs up 12.9% and other opex up 14.1% against a 3.0% operating margin — technology cost transparency with a quantifiable payback." },
      { name: "John Gizdic", title: "EVP & Chief Operating Officer", usBased: true,
        confidence: "reconfirm", source: "Novant newsroom, Feb 2025",
        bringUp: "The $172M four-year energy-efficiency program funded from the $839M Energy Services Agreement — third-party-operated, staged funding, and in need of independent delivery assurance." },
    ],
    notes: "Representative healthcare roster client — Aberdeen's credential stronghold. Feb 2025 operating-model redesign created four regions with regional presidents, relevant to any standardization program.",
  },

  centene: {
    researched: "researched 08/14/26",
    executives: [
      { name: "Susan Smith", title: "Chief Operating Officer", usBased: true,
        confidence: "reconfirm", source: "Centene press release, Nov 2023 (COO from Jan 2024)",
        bringUp: "She formally owns the enterprise transformation office, and the enterprise optimization program has $85–115M of third-party vendor spend budgeted for 2026. The budget already exists — this is the win-back entry point." },
      { name: "Andrew L. (Drew) Asher", title: "EVP & Chief Financial Officer", usBased: true,
        confidence: "verified-current", source: "SEC Form 10-Q certifications, Q2 FY2026",
        bringUp: "The path to an 'industry-leading cost structure' with $355–405M of severance in guidance, and per-member cost structures to right-size after a 40% drop in Marketplace membership." },
      { name: "Brian LeClaire", title: "EVP & Chief Information Officer", usBased: true,
        confidence: "reconfirm", source: "Centene press release, Dec 2022",
        bringUp: "Managing medical cost trend across 25.9M members — fundamentally a data and predictive-analytics problem. Reconfirm he is still in the seat first; no newer source found." },
    ],
    notes: "Former client, dormant in 2026. No single executive is publicly named as optimization program lead; CEO Sarah London frames it as restoring profitability.",
  },

  krispykreme: {
    researched: "researched 08/14/26",
    executives: [
      { name: "Raphael Duvivier", title: "Chief Financial Officer", usBased: true,
        confidence: "verified-current", source: "Appointment PR July 2025; SEC 8-K April 2026",
        bringUp: "Capex cut 70% in H1 against a 5.4x leverage target with $21.8M cash on hand — every remaining dollar is scrutinized, which is the case for cost transparency." },
      { name: "Nicola Steele", title: "Chief Operating Officer", usBased: true,
        confidence: "verified-current", source: "SEC 8-K Jan 2025; Form 4 filings 2026",
        bringUp: "The US logistics 3PL transition completed in April and the refranchising programme running to ~50% franchised by fiscal 2027 — carve-out execution and supply-chain systems integration." },
      { name: "Dave Skena", title: "Chief Growth Officer (owns omni-channel and digital)", usBased: true,
        confidence: "verified-current", source: "Krispy Kreme, since Jan 2025",
        bringUp: "Digital at 19.8% of retail sales and 448 delivery doors added in H1 — the growth investment inside a shrinking envelope, and the channel data behind it." },
    ],
    notes: "No CIO/CTO is publicly identified — former Global CIO Ben Hall has departed with no announced successor, a notable gap given the 2024 cyber incident. That vacancy is itself the opening: technology leadership capacity during a turnaround.",
  },

  cornerstone: {
    researched: "researched 08/14/26",
    executives: [
      { name: "Christian Storch", title: "Interim Chief Financial Officer", usBased: true,
        confidence: "verified-current", source: "cornerstonebuildingbrands.com leadership page, Aug 2026",
        bringUp: "Two unresolved material weaknesses — the failed Metal Solutions ERP go-live and the never-completed IT controls at Harvey and Mueller. An interim CFO stabilizing a distressed finance function is a natural buyer, and they are already paying an outside firm." },
      { name: "Gunner Smith", title: "Chief Executive Officer", usBased: true,
        confidence: "verified-current", source: "cornerstonebuildingbrands.com leadership page, Aug 2026",
        bringUp: "Adjusted EBITDA collapsed from $91.9M to $1.1M on tariffs and materials inflation, with footprint rationalization underway — cost takeout with board-level urgency." },
      { name: "Ram Manukonda", title: "Chief Information Officer", usBased: true,
        confidence: "reconfirm", source: "Professional data aggregators only — NOT on the company leadership page",
        bringUp: "SDLC governance rebuild after the ERP failure. Verify this person is still in the seat before any approach: the official leadership page lists no technology executive at all." },
    ],
    notes: "No permanent CFO as of 08/14/26; the search continues. Separately: this is NOT the dormant Aberdeen account 'Cornerstone Care' — keep the records apart.",
  },

  dauch: {
    researched: "researched 08/14/26",
    executives: [
      { name: "Christopher J. May", title: "EVP & Chief Financial Officer", usBased: true,
        confidence: "verified-current", source: "dauch.com leadership page, Aug 2026",
        bringUp: "$95–110M of synergy implementation payments and $115–150M of restructuring in 2026, against a public >$100M run-rate commitment — plus $5.03B of debt making duplicated IT spend expensive." },
      { name: "Michael J. Lynch", title: "President, Driveline", usBased: true,
        confidence: "verified-current", source: "dauch.com leadership page; Dowlais completion release, Feb 2026",
        bringUp: "Driveline absorbed GKN Automotive's sideshafts and ePowertrain business — operating-model and systems harmonization across the combined segment." },
      { name: "Markus Bannert", title: "President, Metal Forming", usBased: false,
        confidence: "verified-current", source: "dauch.com leadership page; Dowlais completion release, Feb 2026",
        bringUp: "As former GKN Automotive CEO he is the senior Dowlais-side executive — the integration counterpart for the segment realignment. US base unconfirmed." },
    ],
    notes: "Renamed from American Axle & Manufacturing after the Feb 2026 Dowlais close; HQ Detroit. No corporate CIO/CTO is publicly listed. No executive carries a formal integration-lead title — the labels here are inferred from remit, not announced.",
  },

  cpk: {
    researched: "researched 08/14/26",
    executives: [
      { name: "Abhijit (Abhi) Bhatwadekar", title: "VP & Chief Information Officer", usBased: true,
        confidence: "verified-current", source: "chpk.com leadership page, live Aug 2026",
        bringUp: "The $1.2B Florida Energy Pathway at day zero and a five-year capital program now above $2.2B — the technology and delivery-governance layer under a portfolio that size." },
      { name: "Jeff Sylvester", title: "Chief Financial Officer", usBased: true,
        confidence: "verified-current", source: "Chesapeake 8-K March 2026, effective 1 July 2026",
        bringUp: "Six weeks into the seat, funding growth through a $650M revolver and equity issuance while opex creep offsets half the margin gains. New CFOs buy outside reads." },
      { name: "Jeff Householder", title: "Chair, President & Chief Executive Officer", usBased: true,
        confidence: "verified-current", source: "Florida Energy Pathway announcement, July 2026",
        bringUp: "He is personally fronting the Florida Energy Pathway announcement and partner discussions are underway — no separate project sponsor has been named." },
    ],
    notes: "Longtime CFO Beth Cooper retired 30 June 2026 after 36 years — do not use her name in any account map. A Chief Transformation Officer was also appointed in early 2026.",
  },

  core: {
    researched: "researched 08/14/26",
    executives: [
      { name: "Mitesh Thakkar", title: "President & Chief Financial Officer", usBased: true,
        confidence: "verified-current", source: "Q2 2026 earnings release, 6 Aug 2026",
        bringUp: "The ~75%-of-FCF return framework and the per-ton cost programme — G&A and technology spend transparency to protect free cash flow." },
      { name: "Jimmy Brock", title: "Chairman & Chief Executive Officer", usBased: true,
        confidence: "verified-current", source: "Q2 2026 earnings release, 6 Aug 2026",
        bringUp: "The rare-earths and critical-minerals ambition surfacing in risk factors — business-case validation before capital commits, plus unfinished CONSOL/Arch integration synergies." },
    ],
    notes: "Correction to an earlier assumption: no INCOMING CEO has been named. The 'recently announced CEO transition' in the Q2 risk factors refers to Oct 2025, when Paul Lang departed and Brock stepped in. No CIO/CTO is publicly named at officer level. Aberdeen's roster match on 'Core' is still unconfirmed — resolve identity before any approach.",
  },

  arkema: {
    researched: "researched 08/14/26",
    executives: [
      { name: "Anthony (Tony) O'Donovan", title: "President & CEO, Arkema Inc. (Americas)", usBased: true,
        confidence: "reconfirm", source: "Arkema USA press release 2021; press coverage through Oct 2025",
        bringUp: "The most senior US executive, and Clear Lake sits in his region — the natural sponsor for extending the live KM Copilot and Energy Management work beyond its current scope." },
      { name: "Marie-José Donsion", title: "Chief Financial Officer, Arkema Group", usBased: false,
        confidence: "verified-current", source: "arkema.com Executive Committee page, live Aug 2026",
        bringUp: "The €600M capex ceiling and the fixed-cost-inflation offset target — where technology spend competes for room. France-based; approach through the US relationship." },
    ],
    notes: "Group CFO and CDO are France-based; O'Donovan is the senior US leader (Americas HQ, King of Prussia PA). Group CDO Frédéric Gauvard could not be confirmed in any source newer than ~2023 and is omitted rather than listed on stale evidence. Laurent Tellier became Group COO on 1 July 2026.",
  },

  lomalinda: {
    researched: "researched 08/14/26",
    executives: [
      { name: "DP (David P.) Harris", title: "SVP Enterprise IT & Chief Digital and Information Officer", usBased: true,
        confidence: "verified-current", source: "Becker's Hospital Review, April 2026",
        bringUp: "Newly permanent after serving as interim from January, leading a 400+ person IS organization and making AI use an expectation for his teams. A leader consolidating a new remit is the most receptive moment there is." },
      { name: "Angela Lalas", title: "CFO, LLUH Hospitals; EVP Finance", usBased: true,
        confidence: "verified-current", source: "Becker's CEO+CFO Roundtable 2026 speaker page",
        bringUp: "In seat since 2018 — the continuity counterpart to a changing IT organization." },
      { name: "Douglas Leeper", title: "VP Healthcare IT / CDIO, Health System", usBased: true,
        confidence: "verified-current", source: "lluh.org leadership page, Aug 2026",
        bringUp: "The health-system-level IT role under the new enterprise function — the operational counterpart to Harris." },
    ],
    notes: "This is the one account where research beat the document corpus: the file named for Loma Linda in client-data/ is an unusable 2023 news digest, so there are no filing-based signals — but the leadership transition is a real, dated opening. New client in 2026.",
  },

  lsf: {
    researched: "researched 08/14/26",
    executives: [
      { name: "Adegboyega Adedeji", title: "Managing Director / CEO", usBased: false,
        confidence: "verified-current", source: "livestockfeedsplc.com leadership page; NGX notice, July 2026",
        bringUp: "Listed for completeness only — the account sits outside Aberdeen's documented geographic footprint and is deprioritized." },
    ],
    notes: "Lagos-based, subsidiary of UAC of Nigeria. Included for corpus completeness, not as a pursuit target.",
  },
};

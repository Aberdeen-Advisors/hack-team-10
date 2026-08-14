/* ============================================================
   Aberdeen Pursuit Intelligence — application logic
   Zero network calls. All data is embedded locally (Level 3).
   ============================================================ */

"use strict";

/* ---------- lookups ---------- */
const offeringById = Object.fromEntries(ABERDEEN.offerings.map(o => [o.id, o]));
const offeringByName = Object.fromEntries(ABERDEEN.offerings.map(o => [o.name, o]));
const signalsByAccount = Object.fromEntries(SIGNALS.map(s => [s.accountId, s]));

const STRENGTH_PTS = { STRONG: 30, MODERATE: 20, THIN: 10, NONE: 0 };
const BUCKET_PTS = {
  "existing-live": 30, "roster-active": 22, "new-2026": 20,
  "dormant": 14, "flagged-match": 8, "prospect": 6, "cold": 0,
};
const BUCKET_LABEL = {
  "existing-live": "Active — engagement in flight",
  "roster-active": "Roster client",
  "new-2026": "New client (2026)",
  "dormant": "Dormant / churned",
  "flagged-match": "Unconfirmed match",
  "prospect": "Prospect",
  "cold": "Cold / unknown",
};
const HOT_CATEGORIES = new Set(["technology-investment", "data-AI", "M&A", "restructuring"]);

/* ---------- scoring (transparent, shown in the UI) ---------- */
function scoreAccount(acct) {
  const doc = signalsByAccount[acct.id];
  const sigs = (doc && !acct.dataQualityFlag) ? doc.signals : [];

  let signalScore = 0;
  sigs.forEach(s => { signalScore += HOT_CATEGORIES.has(s.category) ? 10 : 7; });
  signalScore = Math.min(40, signalScore);

  const relScore = BUCKET_PTS[acct.bucket] ?? 0;

  let proofFit = 0;
  if (sigs.length) {
    const pts = sigs.map(s => {
      const off = offeringByName[s.offering];
      return off ? STRENGTH_PTS[off.strength] : 0;
    });
    proofFit = Math.round(pts.reduce((a, b) => a + b, 0) / pts.length);
  }

  const total = signalScore + relScore + proofFit;
  const tier = total >= 72 ? ["pursue", "Pursue now"]
             : total >= 52 ? ["develop", "Develop"]
             : total >= 30 ? ["qualify", "Qualify"]
             : ["monitor", "Monitor"];
  return { signalScore, relScore, proofFit, total, tierClass: tier[0], tierLabel: tier[1], sigCount: sigs.length };
}

/* Rank the offerings a target's signals trigger.
   Signal count dominates, but proof strength breaks ties and a live
   engagement outranks both — proposing from zero when Aberdeen is already
   inside reads as though the firm does not know its own book (workflow §3.2). */
function rankOfferings(acct) {
  const doc = signalsByAccount[acct.id];
  if (!doc || acct.dataQualityFlag || !doc.signals.length) return [];
  const counts = {};
  doc.signals.forEach(s => { counts[s.offering] = (counts[s.offering] || 0) + 1; });
  return Object.entries(counts)
    .map(([name, n]) => {
      const off = offeringByName[name];
      if (!off) return null;
      const live = acct.liveEngagementOffering === off.id;
      return { off, n, live, rank: n * 10 + STRENGTH_PTS[off.strength] / 3 + (live ? 12 : 0) };
    })
    .filter(Boolean)
    .sort((a, b) => b.rank - a.rank);
}
const topOffering = acct => (rankOfferings(acct)[0] || {}).off || null;

/* Credential selection: prefer a credential from the target's own sector,
   then a quantified one. Cross-sector credentials are still shown — Aberdeen's
   ERP and M&A proof travels — but never ahead of a same-sector proof point. */
const SECTOR_AFFINITY = {
  "Healthcare & Life Sciences": ["Healthcare"],
  "Consumer & Retail": ["Retail", "Consumer Products"],
  "Manufacturing & Industrial": ["Manufacturing", "Consumer Products", "Retail"],
  "Energy & Utilities": ["Manufacturing"],
  "Agriculture & Food": ["Consumer Products", "Manufacturing"],
  "Financial Services": ["Private Equity"],
  "Technology & Software": [],
};

function pickCredentials(offeringId, industry, limit = 2) {
  const pref = SECTOR_AFFINITY[industry] || [];
  return ABERDEEN.credentials
    .filter(c => c.offering === offeringId)
    .map(c => {
      const idx = pref.indexOf(c.sector);
      return { c, aff: idx === -1 ? 99 : idx, sectorMatch: idx !== -1 };
    })
    .sort((x, y) => x.aff - y.aff || (y.c.quantified ? 1 : 0) - (x.c.quantified ? 1 : 0))
    .slice(0, limit);
}

/* ---------- helpers ---------- */
const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* Provenance tags — the workflow's rule that every claim names its source type. */
const PROV_TIP = {
  "filing": "Evidence from a regulatory filing (10-Q, interim financial statements, bond disclosure) — the strongest provenance tier.",
  "press release": "Evidence from the company's own earnings press release — company-authored disclosure.",
  "third-party digest": "A third-party news digest, not the company's own disclosure — weakest provenance; never used as a signal source.",
  "instruction file": "Sourced from Aberdeen's internal instruction files in this repo (workflow, offerings, brand system).",
  "inference": "An inference, not a sourced fact — labelled as such per the workflow's provenance rule.",
};
function provChip(p) {
  const cls = p === "filing" ? "filing" : p === "press release" ? "pressrelease"
            : p === "third-party digest" ? "digest" : p === "instruction file" ? "instruction" : "inference";
  return `<span class="chip ${cls}" data-tip="${esc(PROV_TIP[p] || "")}">${esc(p)}</span>`;
}

/* Priority tiers — what the pipeline score means for action. */
const TIER_TIP = {
  pursue: "Priority score 72+ of 100: strong signals, relationship position and proof alignment — act on it this quarter.",
  develop: "Score 52–71: real potential — build the relationship and sharpen the angle before proposing.",
  qualify: "Score 30–51: interesting but unconfirmed — qualify the identity or need before investing pursuit time.",
  monitor: "Score below 30: keep watching the filings; do not spend partner time yet.",
};
const tierChip = s => `<span class="tier ${s.tierClass}" data-tip="${esc(TIER_TIP[s.tierClass] || "")}">${s.tierLabel}</span>`;
/* Plain-language tooltips for the two badge systems. Proof wording follows
   AberdeenOfferings.md §10; status wording reflects the filing language. */
const STRENGTH_TIP = {
  STRONG: "Aberdeen's proof for this offering: multiple delivered engagements, at least one with a quantified outcome (AberdeenOfferings.md §10). Ratings are never upgraded.",
  MODERATE: "Aberdeen's proof for this offering: real but thin or adjacent evidence — frame credentials precisely. For AI & Data, the one live engagement (Arkema) is citable as in progress only.",
  THIN: "Aberdeen's proof for this offering: capability offered, but no delivery track record — sell the capability, never imply one.",
  NONE: "No evidence for this offering. Not for client-facing material — pick another topic.",
};
const STATUS_TIP = {
  committed: "The company's own filing shows this money already flowing or contractually locked in.",
  announced: "Publicly declared by the company, but not yet fully funded or approved.",
  exploratory: "An ambition surfacing in the filing (often only in risk factors) — no quantified plan yet.",
};
const badge = s => `<span class="badge ${s}" data-tip="${esc(STRENGTH_TIP[s] || "")}">${s}</span>`;
const sentimentCls = s => s === "up" ? "delta-up" : s === "down" ? "delta-down" : "delta-flat";

/* Lowercase a headline for mid-sentence use, but leave acronyms alone
   ("US logistics…" must not become "uS logistics…"). */
const midSentence = h =>
  /^[A-Z]{2}/.test(h) ? h : h.charAt(0).toLowerCase() + h.slice(1);

function emptyField(note) {
  return `<span class="empty-field">not in repo — reported as a gap, not guessed${note ? "" : ""}</span>`;
}

/* ============================================================
   VIEWS
   ============================================================ */
const main = document.getElementById("main");
let currentView = "dashboard";
let currentAccount = null;

function setView(view, acctId) {
  currentView = view; currentAccount = acctId || null;
  document.querySelectorAll(".tab").forEach(t =>
    t.classList.toggle("active", t.dataset.view === view));
  if (view === "invest") renderInvestments();
  else if (view === "dashboard" && !acctId) renderDashboard();
  else if (view === "dashboard" && acctId) renderAccount(acctId);
  else if (view === "sources") renderSources();
  window.scrollTo(0, 0);
}

document.getElementById("tabs").addEventListener("click", e => {
  const t = e.target.closest(".tab"); if (t) setView(t.dataset.view);
});

/* ---------- investment radar ---------- */
const ABERDEEN_BOOK = new Set(["existing-live", "roster-active", "new-2026", "dormant"]);
const TYPE_LABEL = {
  "tech-ai": "Tech & AI", "capital-program": "Capital program",
  "ma-integration": "M&A / integration", "restructuring": "Restructuring",
  "capital-returns": "Capital returns", "divestiture": "Divestiture",
};
const TYPE_TIP = {
  "tech-ai": "Investment in technology, data or AI capability.",
  "capital-program": "A capital or infrastructure program — major project spend.",
  "ma-integration": "M&A activity: acquisition, integration or conversion spend.",
  "restructuring": "Restructuring, reorganization or cost-program spend.",
  "capital-returns": "Capital returned to shareholders (buybacks, debt retirement) — context, not sellable work.",
  "divestiture": "A sale, carve-out or refranchising — separation work often follows.",
};

function invSortKey(acctId) {
  const items = INVESTMENTS[acctId] || [];
  return items.reduce((m, i) => Math.max(m, i.amountUSD || 0), 0);
}

function renderInvestmentItems(items, compact = false) {
  return items.map(i => {
    const off = i.offering ? offeringById[i.offering] : null;
    return `<div class="inv-item ${off ? "" : "ctx"}">
      <div class="row1">
        <span class="itype ${i.type}" data-tip="${esc(TYPE_TIP[i.type] || "")}">${TYPE_LABEL[i.type]}</span>
        <span class="init">${esc(i.initiative)}</span>
        <span class="istatus ${i.status}" data-tip="${esc(STATUS_TIP[i.status] || "")}">${i.status}</span>
        <span class="hzn">${esc(i.horizon)}</span>
        <span class="sig-src">${esc(i.sourceRef)}</span>
      </div>
      <div class="row1" style="margin-top:3px"><span class="amt">${esc(i.amount)}</span></div>
      <div class="angle">${off
        ? `&rarr; <b>${esc(off.name)}</b> ${badge(off.strength)} <span class="muted">${esc(i.angle)}</span>`
        : `<span class="muted">${esc(i.angle)}</span>`}</div>
      ${compact ? "" : `<div class="ev">${esc(i.evidence)}</div>`}
    </div>`;
  }).join("");
}

function renderInvestments() {
  const addr = id => (INVESTMENTS[id] || []).filter(i => i.offering);
  const book = ABERDEEN.accounts.filter(a => ABERDEEN_BOOK.has(a.bucket) && addr(a.id).length)
    .sort((x, y) => invSortKey(y.id) - invSortKey(x.id));
  const expansion = ABERDEEN.accounts.filter(a => !ABERDEEN_BOOK.has(a.bucket) && addr(a.id).length)
    .sort((x, y) => invSortKey(y.id) - invSortKey(x.id));

  const addressable = ABERDEEN.accounts.flatMap(a => addr(a.id));
  const committed = addressable.filter(i => i.status === "committed").length;
  const bookItems = book.reduce((n, a) => n + addr(a.id).length, 0);

  const card = a => {
    const items = addr(a.id);
    return `<div class="inv-card">
      <div class="inv-head" data-acct="${a.id}" tabindex="0" role="button" aria-label="Open pursuit brief for ${a.name}">
        <span class="nm">${esc(a.name)}</span>
        <span class="bk">${esc(BUCKET_LABEL[a.bucket])} · ${esc(a.industry)}</span>
        ${a.matchNote.flagged ? `<span class="flag" style="color:var(--amber);border-color:var(--amber)">confirm match</span>` : ""}
        <span class="cnt">${items.length} addressable · open brief →</span>
      </div>
      ${renderInvestmentItems(items, true)}
    </div>`;
  };

  main.innerHTML = `
    <h2 class="viewtitle">Investment radar</h2>
    <p class="viewsub">Capital being diverted in the coming quarters that Aberdeen can sell against — each initiative from the company's own
      quarterly release, mapped to a service area from the About Aberdeen overview. Only addressable initiatives appear here;
      context-only items (buybacks, debt retirement) and full evidence live in each account brief.</p>

    <div class="statrow" style="grid-template-columns:repeat(3,1fr)">
      <div class="stat"><div class="v">${addressable.length}</div><div class="l">Addressable initiatives</div></div>
      <div class="stat"><div class="v">${committed}</div><div class="l">Already committed</div></div>
      <div class="stat"><div class="v">${bookItems}</div><div class="l">In Aberdeen's existing book</div></div>
    </div>

    <div class="phasehead"><h3>Phase 1 — Aberdeen's book</h3>
      <span class="muted">existing, new-2026 and former clients: the rollout starts here</span></div>
    ${book.map(card).join("")}

    <div class="phasehead"><h3>Phase 2 — expansion universe</h3>
      <span class="muted">no confirmed relationship yet: qualify the match before pursuing</span></div>
    ${expansion.map(card).join("")}

    <p class="muted small" style="margin-top:10px">Proof badges from AberdeenOfferings.md §10, never upgraded.
      Companies without an addressable disclosure (incl. Loma Linda, whose signal document is unusable) appear in the Pipeline tab, not here.</p>
  `;

  main.querySelectorAll(".inv-head").forEach(h => {
    const open = () => setView("dashboard", h.dataset.acct);
    h.addEventListener("click", open);
    // Same rule as the pipeline rows: the header is the only route into the
    // brief, so it must work without a mouse.
    h.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
  });
}

/* ---------- dashboard ---------- */
function renderDashboard() {
  const rows = ABERDEEN.accounts
    .map(a => ({ a, s: scoreAccount(a) }))
    .sort((x, y) => y.s.total - x.s.total);

  const totalSignals = SIGNALS.reduce((n, d) => n + d.signals.length, 0);
  const pursue = rows.filter(r => r.s.tierClass === "pursue").length;
  const flagged = ABERDEEN.accounts.filter(a => a.matchNote.flagged || a.dataQualityFlag).length;

  main.innerHTML = `
    <h2 class="viewtitle">Account pipeline</h2>
    <p class="viewsub">All ${ABERDEEN.accounts.length} companies in the signal corpus, scored on detected buying signals,
      relationship position, and Aberdeen's proof strength for the offerings each signal triggers. Click a row for the full pursuit brief.</p>

    <div class="statrow" style="grid-template-columns:repeat(3,1fr)">
      <div class="stat"><div class="v">${totalSignals}</div><div class="l">Evidenced buying signals</div></div>
      <div class="stat"><div class="v">${pursue}</div><div class="l">Pursue-now accounts</div></div>
      <div class="stat"><div class="v">${flagged}</div><div class="l">Flagged for human confirmation</div></div>
    </div>

    <div class="table-scroll"><table class="accounts">
      <thead><tr>
        <th>Account</th><th>Industry</th><th>Relationship</th><th>Signals</th>
        <th>Leading offering</th><th>Score</th><th>Priority</th>
      </tr></thead>
      <tbody>
        ${rows.map(({ a, s }) => {
          const off = topOffering(a);
          return `<tr class="acct-row" data-acct="${a.id}" tabindex="0" role="button" aria-label="Open pursuit brief for ${a.name}">
            <td><div class="acct-name">${esc(a.name)}</div>
                ${a.matchNote.flagged ? `<span class="flag">match ${a.matchNote.score} — confirm</span>` : ""}
                ${a.dataQualityFlag ? `<span class="flag">signal doc unusable</span>` : ""}</td>
            <td class="small">${esc(a.industry)}</td>
            <td class="small">${esc(BUCKET_LABEL[a.bucket])}</td>
            <td>${s.sigCount || "<span class='muted'>0</span>"}</td>
            <td class="small">${off ? `${esc(off.name)} ${badge(off.strength)}` : "<span class='muted'>—</span>"}</td>
            <td><div class="scorebar-wrap">
              <div class="scorebar"><div style="width:${s.total}%;background:${s.total >= 72 ? "var(--green)" : s.total >= 52 ? "var(--teal-signal)" : s.total >= 30 ? "var(--amber)" : "var(--grey-dark)"}"></div></div>
              <span class="scoreval">${s.total}</span></div></td>
            <td>${tierChip(s)}</td>
          </tr>`;
        }).join("")}
      </tbody>
    </table></div>
    <p class="muted small" style="margin-top:10px">Score = signal evidence (0–40) + relationship position (0–30) + proof-strength fit (0–30).
      Proof ratings come from AberdeenOfferings.md §10 and are never upgraded. Accounts with flagged matches must be confirmed against the CRM before any outreach (workflow §2.4).</p>
  `;

  main.querySelectorAll(".acct-row").forEach(r =>
    {
      const open = () => setView("dashboard", r.dataset.acct);
      r.addEventListener("click", open);
      // Rows are the only route into a pursuit brief, so they must work without
      // a mouse. Enter and Space match native button behaviour.
      r.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
      });
    });
}

/* ---------- account detail ---------- */
function renderAccount(id) {
  const a = ABERDEEN.accounts.find(x => x.id === id);
  const doc = signalsByAccount[id];
  const s = scoreAccount(a);
  const rel = a.relationship;

  const usableSignals = (doc && !a.dataQualityFlag) ? doc.signals : [];
  const recs = rankOfferings(a);

  main.innerHTML = `
    <button class="backlink">&larr; Back to pipeline</button>

    <div class="acct-header">
      <h2>${esc(a.name)}</h2>
      <div class="meta">
        <span class="chip instruction">${esc(a.industry)}</span>
        ${tierChip(s)}
        <span class="muted">${esc(BUCKET_LABEL[a.bucket])}</span>
        ${a.matchNote.flagged ? `<span class="flag">MATCH ${a.matchNote.score} — HUMAN CONFIRMATION REQUIRED</span>` : ""}
      </div>
      <div class="playline">Play: <b>${esc(a.play)}</b></div>
    </div>

    ${a.dataQualityFlag ? `<div class="gap"><b>Data-quality finding:</b> ${esc(a.dataQualityFlag)}</div>` : ""}
    ${a.matchNote.flagged ? `<div class="gap"><b>Identity flag:</b> ${esc(a.matchNote.basis)}</div>` : ""}

    <div class="grid2">
      <div>
        ${(INVESTMENTS[id] || []).length ? `
        <div class="card">
          <h3>Forward investments — where the money is going</h3>
          ${renderInvestmentItems(INVESTMENTS[id])}
        </div>` : ""}

        <div class="card">
          <h3>Buying signals ${usableSignals.length ? `(${usableSignals.length})` : ""}</h3>
          ${usableSignals.length ? usableSignals.map(sig => `
            <div class="signal">
              <div class="sig-head">
                <span class="sig-title">${esc(sig.headline)}</span>
                ${provChip(sig.provenance)}
                <span class="sig-src">${esc(sig.sourceRef)}</span>
              </div>
              <div class="evidence">${esc(sig.evidence)}</div>
              ${sig.quote ? `<div class="quote">&ldquo;${esc(sig.quote)}&rdquo;</div>` : ""}
              <div class="maps">&rarr; triggers <b>${esc(sig.offering)}</b> ${offeringByName[sig.offering] ? badge(offeringByName[sig.offering].strength) : ""}<br>
                <span class="muted">${esc(sig.whyItMaps)}</span></div>
            </div>`).join("")
          : `<p class="muted">No usable signals in the corpus for this account. ${a.dataQualityFlag ? "The document carrying this account's name is not their financial data — see the flag above." : "No document in client-data/ covers this company."} Per the workflow: the coverage gap is stated, not glossed.</p>`}
          ${doc && doc.headwinds && doc.headwinds.length ? `
            <p class="small" style="margin-top:8px"><b style="color:var(--navy)">Stated headwinds:</b> ${doc.headwinds.map(esc).join(" · ")}</p>` : ""}
        </div>
      </div>

      <div>
        <div class="card">
          <h3>Recommended offerings &amp; credentials</h3>
          ${recs.length ? recs.map(({ off, n, live }) => {
            const creds = pickCredentials(off.id, a.industry);
            return `<div class="offer-rec"${live ? ` style="border-left:4px solid var(--teal-signal)"` : ""}>
              <div class="oh"><span class="oname">${esc(off.name)}</span> ${badge(off.strength)}
                <span class="muted small" data-tip="How many of this account's evidenced buying signals map to this offering — more signals, stronger fit.">${n} signal${n > 1 ? "s" : ""}</span>
                ${live ? `<span class="chip instruction">Aberdeen already delivering here</span>` : ""}</div>
              <div class="osub">${esc(off.subServices)}</div>
              <div class="small" style="margin-top:5px">${esc(off.proofNote)}</div>
              ${off.strength === "THIN" ? `<div class="small" style="color:var(--navy);margin-top:4px"><b>Honesty rule:</b> sell the capability — do not imply a track record.</div>` : ""}
              ${creds.map(({ c, sectorMatch }) => `<div class="cred">${esc(c.text)}
                ${c.inFlight ? `<span class="inflight"> · IN FLIGHT</span>` : ""}
                <div class="ct">${esc(c.clientType)} · ${esc(c.band)} · ${sectorMatch
                  ? `<b style="color:var(--navy)">same-sector proof (${esc(c.sector)})</b>`
                  : `cross-sector — ${esc(c.sector)} engagement, say so rather than implying sector depth`}</div></div>`).join("")}
            </div>`;
          }).join("")
          : `<p class="muted">No signal-driven recommendation available. Qualify the account before selecting offerings.</p>`}
        </div>

        <div class="card">
          <h3>Relationship &amp; decision-makers</h3>
          <dl class="kv">
            <dt>Status</dt><dd>${esc(rel.status)}</dd>
            <dt>Live engagement</dt><dd>${rel.engagement ? esc(rel.engagement) : emptyField()}</dd>
            <dt>Relationship owner</dt><dd>${rel.owner ? esc(rel.owner) : emptyField()}</dd>
            <dt>Strength</dt><dd>${rel.strengthField ? esc(rel.strengthField) : emptyField()}</dd>
            <dt>Key contacts</dt><dd>${rel.contacts ? esc(rel.contacts) : emptyField()}</dd>
            <dt>Last interaction</dt><dd>${rel.lastInteraction ? esc(rel.lastInteraction) : emptyField()}</dd>
            <dt>Roster evidence</dt><dd>${esc(a.rosterEvidence)}</dd>
          </dl>
          ${rel.note ? `<p class="muted small" style="margin-top:8px">${esc(rel.note)}</p>` : ""}
          <div class="gap" style="margin-top:10px"><b>Guardrail §6.5:</b> empty CRM fields are findings, not gaps to fill.
            Names are never invented. Owner and contact data require the CRM at the CoE base path.</div>
          ${recs.length ? `
          <p class="small" style="margin-top:4px"><b style="color:var(--navy)">Buyer roles to map for ${esc(recs[0].off.name)}</b>
            <span class="muted">(role guidance only — not actual people)</span></p>
          <div class="rolechips">${(ABERDEEN.buyerRolesByOffering[recs[0].off.id] || []).map(r => `<span class="rolechip">${esc(r)}</span>`).join("")}</div>` : ""}
        </div>
      </div>
    </div>

    <div class="card">
      <h3>Generate outreach</h3>
      <div class="controls">
        <div class="control"><label>Audience</label>
          <select id="oud">
            <option value="internal">Internal pursuit brief (partner + team)</option>
            <option value="email">Client outreach email (draft for partner)</option>
            <option value="meeting">First-meeting talking points</option>
          </select></div>
        <div class="control"><label>Offering focus</label>
          <select id="ofocus">
            ${recs.length ? recs.map((r, i) => `<option value="${r.off.id}" ${i === 0 ? "selected" : ""}>${esc(r.off.name)}</option>`).join("")
              : ABERDEEN.offerings.map(o => `<option value="${o.id}">${esc(o.name)}</option>`).join("")}
          </select></div>
        <button class="btn primary" id="genbtn">Generate draft</button>
        <button class="btn ghost" id="copybtn" style="display:none">Copy to clipboard</button>
      </div>
      <div id="draftwrap"></div>
    </div>
  `;

  main.querySelector(".backlink").addEventListener("click", () => setView("dashboard"));
  const genbtn = document.getElementById("genbtn");
  const copybtn = document.getElementById("copybtn");
  let lastDraft = "";

  genbtn.addEventListener("click", () => {
    const aud = document.getElementById("oud").value;
    const focusId = document.getElementById("ofocus").value;
    lastDraft = generateOutreach(a, doc, usableSignals, focusId, aud);
    document.getElementById("draftwrap").innerHTML = `
      <div class="provisional">&#9888; PROVISIONAL — PENDING REVIEW &middot; requires explicit human approval before anything leaves the building (AI Use Policy Draft 0.4)</div>
      <div class="draft">${esc(lastDraft)}</div>
      <div class="draft-meta">Generated locally from embedded data — no external model was called. Sources: ${doc ? esc(doc.docFile) : "instruction files only"}; AberdeenOfferings.md §2/§7–§10; AGENT_WORKFLOW.md §2.</div>`;
    copybtn.style.display = "";
  });
  copybtn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(lastDraft); copybtn.textContent = "Copied ✓"; }
    catch { copybtn.textContent = "Select & copy manually"; }
    setTimeout(() => copybtn.textContent = "Copy to clipboard", 1800);
  });
}

/* ---------- outreach generation (deterministic, template-driven, local) ---------- */
function generateOutreach(a, doc, sigs, focusId, audience) {
  const off = offeringById[focusId];
  const focusSigs = sigs.filter(s => s.offering === off.name);
  const useSigs = (focusSigs.length ? focusSigs : sigs).slice(0, 3);
  const creds = pickCredentials(off.id, a.industry);
  const today = "August 14, 2026";

  const sigLines = useSigs.map(s =>
    `  • ${s.headline} — ${s.evidence} [${s.provenance}: ${s.sourceRef}]`).join("\n");
  const credLines = creds.map(({ c, sectorMatch }) =>
    `  • ${c.text} (${c.clientType}, ${c.band})` +
    (c.inFlight ? " — IN PROGRESS, cite as in flight only" : "") +
    (sectorMatch ? "" : ` — CROSS-SECTOR (${c.sector}); present it as such`)).join("\n");
  const proofCaveat = off.strength === "THIN"
    ? `\nPROOF NOTE: this offering is rated THIN in the credential map. Sell the capability; do not imply a delivery track record.\n`
    : off.strength === "MODERATE"
    ? `\nPROOF NOTE: rated MODERATE — evidence is real but thin or adjacent. Frame credentials precisely.\n` : "";

  const relLine = a.relationship.engagement
    ? `Aberdeen is currently delivering at this account: ${a.relationship.engagement} Lead with continuity — a proposal written from zero reads as though the firm does not know its own book (workflow §3.2).`
    : a.bucket === "dormant"
    ? `Former client, dormant in 2026. This is a win-back: open with what has changed on their side since we last worked together, not with new scope.`
    : a.bucket === "roster-active" || a.bucket === "new-2026"
    ? `Existing roster relationship (${a.rosterEvidence}) — position as expansion, not introduction.`
    : `No documented relationship. This is a cold pursuit; the first goal is a qualified conversation, not a proposal.`;

  const matchWarn = a.matchNote.flagged
    ? `\n⚠ IDENTITY UNCONFIRMED (match score ${a.matchNote.score}): ${a.matchNote.basis} Confirm against the CRM before sending anything.\n` : "";

  if (audience === "internal") {
    return `PURSUIT BRIEF — ${a.name}
Prepared ${today} · Aberdeen Pursuit Intelligence · CONFIDENTIAL — Level 3
${matchWarn}
CLASSIFICATION: ${BUCKET_LABEL[a.bucket]} → ${a.play}

RELATIONSHIP POSITION
${relLine}
Relationship owner / contacts: not present in this repo — pull from CRM before pursuit. Do not fabricate names.

WHY NOW — EVIDENCED SIGNALS (${doc ? doc.period : "no filing in corpus"})
${sigLines || "  • No usable signals in the corpus. Qualify externally before investing pursuit time."}

RECOMMENDED ENTRY: ${off.name}
Sub-services: ${off.subServices}
Proof strength: ${off.strength} — ${off.proofNote}${proofCaveat}
CREDENTIALS TO CITE (anonymised per house convention)
${credLines || "  • None mapped — check Quals/ before claiming experience."}

PROPOSED NEXT STEP
${a.relationship.engagement
  ? "30-minute expansion conversation with the current engagement sponsor; bring the in-flight work as the proof point."
  : a.bucket === "dormant"
  ? "Relationship owner places a re-connect call referencing the specific Q2 development above; no deck until interest is confirmed."
  : "Partner-led qualification call. 2–6 week diagnostic sprint as the entry offer — boutique speed against Big-4 timelines."}

Open questions: CRM owner and strength; open pipeline value; approved-name status for credentials.
PROVISIONAL — PENDING REVIEW.`;
  }

  if (audience === "email") {
    const sig0 = useSigs[0];
    return `SUBJECT: ${a.name} — ${sig0 ? sig0.headline : off.name}

[DRAFT for the relationship owner to personalise. Recipient intentionally left blank — contact names are not in this repo and are never invented.]

Dear [Contact — from CRM],

${sig0 ? `One line in your latest results stood out to us: ${midSentence(sig0.headline)}. ${sig0.evidence}` : `We have been following ${a.name}'s recent results.`}${useSigs[1] ? `\n\nSet against ${midSentence(useSigs[1].headline)}, that points to decisions ahead which are difficult to staff from inside.` : ""}

${a.relationship.engagement
  ? `As you know, our team is already working with you on ${a.relationship.engagement.split(".")[0]}. The natural next conversation is how that foundation extends to ${off.name.toLowerCase()}.`
  : a.bucket === "dormant"
  ? `It has been some time since Aberdeen last worked with ${a.name}, and enough has changed on your side that a short reconnect feels worthwhile.`
  : `Aberdeen works with organizations at exactly this decision point.`}

Recent, relevant experience:
${creds.map(({ c }) => `  – ${c.text} (${c.clientType}, ${c.band})`).join("\n") || "  – [pull from Quals/]"}

Would a 30-minute conversation in the next two weeks be useful? We work in 2–6 week sprints with senior practitioners, not multi-quarter programs.

Best regards,
[Relationship owner — from CRM]
Aberdeen Advisors

---
PROVISIONAL — PENDING REVIEW. Human approval required before sending (AI Use Policy Draft 0.4).${matchWarn}`;
  }

  /* meeting talking points */
  return `FIRST-MEETING TALKING POINTS — ${a.name}
${today} · CONFIDENTIAL — Level 3 · PROVISIONAL — PENDING REVIEW
${matchWarn}
1. OPEN WITH THEIR SITUATION (their words, not ours)
${doc && doc.managementQuote ? `   Management framing: "${doc.managementQuote}"` : "   No management quote available in the corpus."}
${sigLines}

2. THE BRIDGE
   ${relLine}

3. WHAT WE'D PROPOSE EXPLORING — ${off.name}
   ${off.subServices}
   Positioning: boutique speed, senior practitioners, 2–6 week sprints. Never disparage a named competitor.
   Aberdeen's likely rivals for this work: Regional Boutiques (Slalom, West Monroe, Protiviti) and pure-play AI shops — differentiate on hands-on delivery.${proofCaveat}
4. PROOF POINTS (anonymised)
${credLines}

5. ASK
   Agreement on one narrow, dated next step — a diagnostic sprint or working session, not a proposal.

Reminders: no unsourced percentages; empty CRM fields stay empty; nothing leaves the building without human approval.`;
}

/* ---------- sources & guardrails ---------- */
function renderSources() {
  main.innerHTML = `
    <h2 class="viewtitle">Sources &amp; guardrails</h2>
    <p class="viewsub">Every claim in this tool traces to a document. This page is the registry — including the three documents that are not what their filenames suggest.</p>

    <div class="card">
      <h3>Signal corpus — client-data/ (${SIGNALS.length} documents)</h3>
      <div class="table-scroll"><table class="srcs">
        <thead><tr><th>Company</th><th>Document</th><th>Type</th><th>Period</th><th>Signals</th><th>Notes</th></tr></thead>
        <tbody>${SIGNALS.map(d => `<tr>
          <td><b>${esc(d.company)}</b></td>
          <td class="small">${esc(d.docFile)}</td>
          <td>${provChip(d.provenanceClass || (d.docType.includes("10-Q") ? "filing" : "press release"))}</td>
          <td class="small">${esc(d.period)}</td>
          <td>${d.signals.length}</td>
          <td class="small">${esc(d.notes || "")}</td></tr>`).join("")}
        </tbody>
      </table></div>
    </div>

    <div class="grid2">
      <div class="card">
        <h3>Data available to this build</h3>
        ${ABERDEEN.dataCoverage.available.map(x => `<div class="guardrail"><span style="color:var(--green);font-weight:700">&#10003;</span> ${esc(x)}</div>`).join("")}
      </div>
      <div class="card">
        <h3>Data NOT in this repo — reported, not guessed</h3>
        ${ABERDEEN.dataCoverage.missing.map(x => `<div class="guardrail"><span style="color:var(--amber);font-weight:700">&#9888;</span> ${esc(x)}</div>`).join("")}
      </div>
    </div>

    <div class="card">
      <h3>Guardrails honored (AGENT_WORKFLOW.md §6 · AI Use Policy Draft 0.4)</h3>
      ${ABERDEEN.guardrails.map((g, i) => `<div class="guardrail"><span class="gnum">${i + 1}</span><span>${esc(g)}</span></div>`).join("")}
    </div>
  `;
}

/* ---------- boot ---------- */
renderInvestments();

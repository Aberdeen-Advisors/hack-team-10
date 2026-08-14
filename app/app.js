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

function provChip(p) {
  const cls = p === "filing" ? "filing" : p === "press release" ? "pressrelease"
            : p === "third-party digest" ? "digest" : p === "instruction file" ? "instruction" : "inference";
  return `<span class="chip ${cls}">${esc(p)}</span>`;
}
const badge = s => `<span class="badge ${s}">${s}</span>`;
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
  if (view === "dashboard" && !acctId) renderDashboard();
  else if (view === "dashboard" && acctId) renderAccount(acctId);
  else if (view === "offerings") renderOfferings();
  else if (view === "sources") renderSources();
  window.scrollTo(0, 0);
}

document.getElementById("tabs").addEventListener("click", e => {
  const t = e.target.closest(".tab"); if (t) setView(t.dataset.view);
});

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

    <div class="statrow">
      <div class="stat"><div class="v">${ABERDEEN.accounts.length}</div><div class="l">Accounts assessed</div></div>
      <div class="stat"><div class="v">${totalSignals}</div><div class="l">Evidenced buying signals</div></div>
      <div class="stat"><div class="v">${pursue}</div><div class="l">Pursue-now accounts</div></div>
      <div class="stat"><div class="v">${flagged}</div><div class="l">Flagged for human confirmation</div></div>
    </div>

    <table class="accounts">
      <thead><tr>
        <th>Account</th><th>Industry</th><th>Relationship</th><th>Signals</th>
        <th>Leading offering</th><th>Score</th><th>Priority</th>
      </tr></thead>
      <tbody>
        ${rows.map(({ a, s }) => {
          const off = topOffering(a);
          return `<tr class="acct-row" data-acct="${a.id}">
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
            <td><span class="tier ${s.tierClass}">${s.tierLabel}</span></td>
          </tr>`;
        }).join("")}
      </tbody>
    </table>
    <p class="muted small" style="margin-top:10px">Score = signal evidence (0–40) + relationship position (0–30) + proof-strength fit (0–30).
      Proof ratings come from AberdeenOfferings.md §10 and are never upgraded. Accounts with flagged matches must be confirmed against the CRM before any outreach (workflow §2.4).</p>
  `;

  main.querySelectorAll(".acct-row").forEach(r =>
    r.addEventListener("click", () => setView("dashboard", r.dataset.acct)));
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
        <span class="tier ${s.tierClass}">${s.tierLabel}</span>
        <span class="muted">${esc(BUCKET_LABEL[a.bucket])}</span>
        ${a.matchNote.flagged ? `<span class="flag">MATCH ${a.matchNote.score} — HUMAN CONFIRMATION REQUIRED</span>` : ""}
      </div>
      <div class="playline">Play: <b>${esc(a.play)}</b></div>
    </div>

    ${a.dataQualityFlag ? `<div class="gap"><b>Data-quality finding:</b> ${esc(a.dataQualityFlag)}</div>` : ""}
    ${a.matchNote.flagged ? `<div class="gap"><b>Identity flag:</b> ${esc(a.matchNote.basis)}</div>` : ""}

    <div class="scorebreak">
      <div class="seg"><div class="n">${s.signalScore}<span class="muted">/40</span></div><div class="cap">Signal evidence</div></div>
      <div class="seg"><div class="n">${s.relScore}<span class="muted">/30</span></div><div class="cap">Relationship position</div></div>
      <div class="seg"><div class="n">${s.proofFit}<span class="muted">/30</span></div><div class="cap">Proof-strength fit</div></div>
      <div class="seg total"><div class="n">${s.total}</div><div class="cap">Priority score</div></div>
    </div>

    <div class="grid2">
      <div>
        ${doc ? `
        <div class="card">
          <h3>Financial snapshot &middot; ${esc(doc.period)}</h3>
          <div class="finrow">
            ${doc.keyFinancials.map(f => `
              <div class="fin"><div class="fl">${esc(f.label)}</div>
                <div class="fv">${esc(f.value)}</div>
                <div class="fd ${sentimentCls(f.sentiment)}">${esc(f.delta || "")}</div></div>`).join("")}
          </div>
          ${doc.managementQuote ? `<div class="signal" style="border-left-color:var(--amber);margin-top:10px;margin-bottom:0">
            <div class="quote" style="margin-top:0">&ldquo;${esc(doc.managementQuote)}&rdquo;</div></div>` : ""}
          <p class="muted small" style="margin-top:8px">Source: ${esc(doc.docFile)} (${esc(doc.docType)})</p>
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
                <span class="muted small">${n} signal${n > 1 ? "s" : ""}</span>
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

/* ---------- offerings view ---------- */
function renderOfferings() {
  main.innerHTML = `
    <h2 class="viewtitle">Offerings &amp; proof strength</h2>
    <p class="viewsub">The five sellable service areas with their §10 proof ratings, and the credential inventory each can draw on.
      Ratings are never upgraded — a THIN badge with an honest proof line beats a STRONG badge a buyer can puncture.</p>

    ${ABERDEEN.offerings.map(o => {
      const creds = ABERDEEN.credentials.filter(c => c.offering === o.id);
      return `<div class="card">
        <h3 style="display:flex;align-items:center;gap:10px;border-bottom:none;padding-bottom:0;text-transform:none;font-size:15px">
          ${esc(o.name)} ${badge(o.strength)}</h3>
        <div class="osub" style="margin-top:2px">${esc(o.subServices)}</div>
        <p class="small" style="margin:8px 0">${esc(o.proofNote)}</p>
        ${creds.map(c => `<div class="cred">${esc(c.text)} ${c.inFlight ? `<span class="inflight"> · IN FLIGHT</span>` : ""}
          <div class="ct">${esc(c.clientType)} · ${esc(c.band)} · sector: ${esc(c.sector)}${c.quantified ? " · quantified outcome" : ""}</div></div>`).join("")}
      </div>`;
    }).join("")}

    <div class="card">
      <h3>Six top-level capabilities &middot; fourteen industries</h3>
      <p class="small" style="margin-bottom:8px">On tailored material, relevant items are highlighted in Signal Cyan and the rest stay visible — breadth and focus at once (the Pattern B mechanic).</p>
      <div class="grid2">
        <div>${ABERDEEN.capabilities.map(c => `<div class="guardrail" style="border-bottom:1px dotted var(--grey-light)"><span style="color:var(--cyan);font-weight:700">&#9632;</span> ${esc(c)}</div>`).join("")}</div>
        <div class="rolechips" style="align-content:flex-start">${ABERDEEN.industries.map(i => `<span class="rolechip">${esc(i)}</span>`).join("")}</div>
      </div>
    </div>

    <div class="card">
      <h3>Firm profile</h3>
      <div class="finrow">
        ${ABERDEEN.firm.profile.map(f => `<div class="fin"><div class="fl">${esc(f.label)}</div><div class="fv" style="font-size:14px">${esc(f.value)}</div><div class="fd muted">${esc(f.note)}</div></div>`).join("")}
      </div>
      <p class="small" style="margin-top:10px">${esc(ABERDEEN.firm.positioning)}</p>
      <p class="small muted" style="margin-top:4px">${esc(ABERDEEN.firm.aberdeenRivals)}</p>
    </div>
  `;
}

/* ---------- sources & guardrails ---------- */
function renderSources() {
  main.innerHTML = `
    <h2 class="viewtitle">Sources &amp; guardrails</h2>
    <p class="viewsub">Every claim in this tool traces to a document. This page is the registry — including the three documents that are not what their filenames suggest.</p>

    <div class="card">
      <h3>Signal corpus — client-data/ (${SIGNALS.length} documents)</h3>
      <table class="srcs">
        <thead><tr><th>Company</th><th>Document</th><th>Type</th><th>Period</th><th>Signals</th><th>Notes</th></tr></thead>
        <tbody>${SIGNALS.map(d => `<tr>
          <td><b>${esc(d.company)}</b></td>
          <td class="small">${esc(d.docFile)}</td>
          <td>${provChip(d.provenanceClass || (d.docType.includes("10-Q") ? "filing" : "press release"))}</td>
          <td class="small">${esc(d.period)}</td>
          <td>${d.signals.length}</td>
          <td class="small">${esc(d.notes || "")}</td></tr>`).join("")}
        </tbody>
      </table>
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
renderDashboard();

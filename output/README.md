# Output

Generated deliverables. Nothing here is hand-authored source material.

| File | What it is |
|---|---|
| [`Aberdeen_Arkema_POV_2026_v1.md`](Aberdeen_Arkema_POV_2026_v1.md) | One-page Aberdeen Point of View on Arkema, covering what the Q2 2026 results say and which Aberdeen offerings they point to. |

The POV was generated from [`client-data/arkema-press-release-results-q2-2026.pdf`](../client-data/arkema-press-release-results-q2-2026.pdf)
(Arkema's second-quarter 2026 results press release, published 30 July 2026) using the three
instruction files in [`agent-instructions/`](../agent-instructions) — `AGENT_WORKFLOW.md` for
process, `SKILL.md` for voice and format, `AberdeenOfferings.md` for the offering taxonomy,
credential inventory and strength ratings.

Every factual claim about Arkema traces to that press release. Every offering name and proof
rating traces to `AberdeenOfferings.md`. No CRM, revenue, pipeline or relationship data was
available in this repository, so the document reports those as open questions rather than filling
them; no past Aberdeen engagement, outcome or contact at Arkema is asserted.

The filename follows the convention in `AGENT_WORKFLOW.md` §5 (`Aberdeen_[Client]_POV_2026_v[N]`)
and `SKILL.md` §8, with a `.md` extension in place of `.pptx`.

**The document is marked PROVISIONAL — PENDING REVIEW** and requires human review and approval
before any external use, per `SKILL.md` §7.

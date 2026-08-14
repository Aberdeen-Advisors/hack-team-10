"""Query the Aberdeen credential library.

Closes the join that AGENT_WORKFLOW.md Step 2.6 asks for ("select the 2-3 strongest proof
points") but that nothing implemented — until now an agent had to read the spreadsheet and
judge by eye, which is where unsupported claims creep in.

Reads About Aberdeen/AberdeenAdv_QUALS_MASTER_enhanced_081426.xlsx and returns credentials
ranked by proof strength, ready to drop into build_one_page_pov(topics=[...]).

Usage
-----
    from credentials import find, proof_line, coverage

    hits = find(industry="Healthcare & Life Sciences", service_area="M&A Enablement")
    print(proof_line(hits, limit=2))     # -> the topics[].proof string

    # honest answer when there is nothing
    hits = find(industry="Energy & Utilities")
    # -> [] , and proof_line() returns the no-evidence wording rather than inventing one

CLI
---
    py credentials.py --industry "Healthcare & Life Sciences" --service "M&A Enablement"
    py credentials.py --coverage
"""
from __future__ import annotations

import argparse
import glob
import io
import os
import sys

import openpyxl

if sys.platform == "win32" and hasattr(sys.stdout, "buffer"):
    try:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    except Exception:
        pass

_HERE = os.path.dirname(os.path.abspath(__file__))
_CANDIDATE_GLOBS = [
    os.path.join(_HERE, "..", "About Aberdeen", "AberdeenAdv_QUALS_MASTER_enhanced*.xlsx"),
    os.path.join(_HERE, "AberdeenAdv_QUALS_MASTER_enhanced*.xlsx"),
    os.path.join(_HERE, "..", "**", "AberdeenAdv_QUALS_MASTER_enhanced*.xlsx"),
]

STRENGTH_RANK = {"STRONG": 3, "MODERATE": 2, "THIN": 1, "": 0}


def library_path() -> str | None:
    """Newest enhanced quals workbook, or None."""
    found = []
    for g in _CANDIDATE_GLOBS:
        found += glob.glob(g, recursive=True)
    return max(found, key=os.path.getmtime) if found else None


def _load():
    p = library_path()
    if not p:
        raise FileNotFoundError(
            "No AberdeenAdv_QUALS_MASTER_enhanced*.xlsx found. Expected it in "
            "'About Aberdeen/'. Regenerate with: py toolkit/build_quals_enhanced.py"
        )
    ws = openpyxl.load_workbook(p, data_only=True)["Quals Master"]
    rows = list(ws.iter_rows(values_only=True))
    hdr = [str(c).strip() if c else "" for c in rows[0]]
    out = []
    for r in rows[1:]:
        d = {h: ("" if v is None else str(v).strip()) for h, v in zip(hdr, r)}
        if "not a qual" in d.get("Record Quality", "").lower():
            continue
        out.append(d)
    return out, p


def find(*, industry=None, service_area=None, capability=None,
         min_strength="THIN", require_outcome=False, exclude_duplicates=True, limit=None):
    """Credentials matching the filters, strongest first.

    min_strength     "STRONG" | "MODERATE" | "THIN"
    require_outcome  True -> only rows carrying a quantified outcome. Use this when the
                     credential will be shown to a client; a credential without a number is
                     an assertion, not proof.
    """
    recs, _ = _load()
    floor = STRENGTH_RANK.get(str(min_strength).upper(), 1)
    hits = []
    for d in recs:
        if exclude_duplicates and "duplicate" in d.get("Record Quality", "").lower():
            continue
        if industry and d.get("Industry", "") != industry:
            continue
        if service_area and d.get("Service Area", "") != service_area:
            continue
        if capability and d.get("Capability", "") != capability:
            continue
        if require_outcome and not d.get("Quantified Outcome"):
            continue
        if STRENGTH_RANK.get(d.get("Proof Strength", "").upper(), 0) < floor:
            continue
        hits.append(d)
    hits.sort(key=lambda d: (-STRENGTH_RANK.get(d.get("Proof Strength", "").upper(), 0),
                             0 if d.get("Quantified Outcome") else 1,
                             d.get("Title", "")))
    return hits[:limit] if limit else hits


def describe(d, anonymise=True):
    """One credential as a sentence, anonymised to client type + revenue band by default.

    SKILL.md section 4.1: name a client only where approval exists. The `External Use` column
    tracks that; until it says Y, stay anonymous.
    """
    bits = []
    ct, rev = d.get("Client Type", ""), d.get("Client Revenue Band", "")
    who = " ".join(x for x in [rev, ct] if x)
    title = d.get("Title", "").rstrip(".")
    if anonymise or d.get("External Use", "").upper() != "Y":
        bits.append(title + (" (%s)" % who if who else ""))
    else:
        bits.append(title)
    if d.get("Quantified Outcome"):
        bits.append("— " + d["Quantified Outcome"])
    return " ".join(bits)


def proof_line(hits, limit=2, anonymise=True):
    """The topics[].proof string for build_one_page_pov, or honest wording if empty.

    Never fabricates. An empty result returns the no-evidence sentence, which pairs with a
    THIN or NONE badge - see SKILL.md section 4.6.
    """
    if not hits:
        return ("Capability offered, no delivery history implied. No credential in the "
                "library matches this scope.")
    return "  ·  ".join(describe(h, anonymise) for h in hits[:limit])


def strength_for(hits):
    """Badge value implied by the evidence actually found. Do not override upward."""
    if not hits:
        return "NONE"
    quantified = sum(1 for h in hits if h.get("Quantified Outcome"))
    if quantified >= 2:
        return "STRONG"
    if quantified == 1:
        return "MODERATE"
    return "THIN"


def coverage():
    """Quals and quantified outcomes per capability, service area and industry."""
    recs, p = _load()
    live = [d for d in recs if "duplicate" not in d.get("Record Quality", "").lower()]
    out = {"source": os.path.basename(p), "total": len(live),
           "with_outcome": sum(1 for d in live if d.get("Quantified Outcome"))}
    for key, field in (("capability", "Capability"), ("service_area", "Service Area"),
                       ("industry", "Industry")):
        agg = {}
        for d in live:
            k = d.get(field) or "(unmapped)"
            a = agg.setdefault(k, {"quals": 0, "with_outcome": 0})
            a["quals"] += 1
            if d.get("Quantified Outcome"):
                a["with_outcome"] += 1
        out[key] = dict(sorted(agg.items(), key=lambda kv: -kv[1]["quals"]))
    return out


def _main():
    ap = argparse.ArgumentParser(description="Query the Aberdeen credential library.")
    ap.add_argument("--industry")
    ap.add_argument("--service", dest="service_area")
    ap.add_argument("--capability")
    ap.add_argument("--min-strength", default="THIN")
    ap.add_argument("--require-outcome", action="store_true")
    ap.add_argument("--limit", type=int, default=5)
    ap.add_argument("--coverage", action="store_true")
    a = ap.parse_args()

    if a.coverage:
        c = coverage()
        print("library: %s" % c["source"])
        print("quals: %d   with quantified outcome: %d (%.0f%%)\n"
              % (c["total"], c["with_outcome"], 100.0 * c["with_outcome"] / max(1, c["total"])))
        for key in ("capability", "service_area", "industry"):
            print(key.replace("_", " ").upper())
            for k, v in c[key].items():
                flag = "" if v["with_outcome"] >= 2 else ("  <- thin" if v["with_outcome"] == 0 else "")
                print("   %-46s %2d quals  %d w/outcome%s" % (k[:46], v["quals"], v["with_outcome"], flag))
            print()
        return

    hits = find(industry=a.industry, service_area=a.service_area, capability=a.capability,
                min_strength=a.min_strength, require_outcome=a.require_outcome, limit=a.limit)
    print("%d credential(s); implied badge: %s\n" % (len(hits), strength_for(hits)))
    for h in hits:
        print("  [%s] slide %-3s %s" % (h.get("Proof Strength", "?"), h.get("Slide", "?"), describe(h)))
    print("\nproof_line ->\n  %s" % proof_line(hits))


if __name__ == "__main__":
    _main()

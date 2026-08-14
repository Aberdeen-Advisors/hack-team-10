# Sample data: public financial documents

These are **publicly published financial documents** — quarterly earnings releases, press releases, public regulatory filings, and municipal-bond continuing-disclosure filings — collected to serve as realistic sample data for the hackathon app.

Every file here was published by the company itself (or by a newswire such as PRNewswire, Business Wire, or GlobeNewswire) for investors and the general public. Nothing in this folder is confidential.

> **Note on the folder name:** despite being called `client-data`, none of these are Aberdeen client documents or Aberdeen engagements. They are public filings and press releases from unrelated organizations, used purely as sample input while building.

Most of these cover **Q2 2026**. Four are different, and are flagged in the table below — worth knowing if you are writing code that assumes every document is a Q2 2026 earnings release.

## What's in here

| Company | Document type | Period | Filename |
|---|---|---|---|
| Alphabet (Google) | Quarterly earnings release | Q2 2026 (quarter ended 30 Jun 2026) | `2026q2-alphabet-earnings-release.pdf` |
| Arkema | Quarterly results press release | Q2 2026 | `arkema-press-release-results-q2-2026.pdf` |
| Centene Corporation | Quarterly results press release | Q2 2026 | `CENTENE CORPORATION REPORTS SECOND QUARTER 2026 RESULTS - Jul 28, 2026.pdf` |
| Constellation Energy | Quarterly earnings release | Q2 2026 | `Constellation Reports Second Quarter 2026 Results.pdf` |
| Core Natural Resources | Quarterly results press release | Q2 2026 | `Core Natural Resources Reports Second Quarter 2026 Results - Aug 6, 2026.pdf` |
| Chesapeake Utilities Corporation | Quarterly earnings release | Q2 2026 | `CPK+Q2+2026+Earnings+Release.pdf` |
| Dauch Corporation | Quarterly results press release | Q2 2026 | `Dauch Reports Second Quarter 2026 Financial Results.pdf` |
| Krispy Kreme | Quarterly results press release | Q2 2026 (quarter ended 28 Jun 2026) | `Krispy Kreme Reports Second Quarter 2026 Financial Results.pdf` |
| LPL Financial | Quarterly earnings release | Q2 2026 | `lpl_financial_q2_2026_earnings_release.pdf` |
| Cornerstone Building Brands | **SEC Form 10-Q** (full quarterly report, 51 pages) | **Q1 2026** (quarter ended 4 Apr 2026) | `Cornerstone report.pdf` |
| Livestock Feeds Plc (Nigeria) | **Unaudited interim financial statements** (49 pages) | **H1 2026** (six months ended 30 Jun 2026) | `LSF-UNAUDITED-FS-JUNE-2026.pdf` |
| McCormick, Levi Strauss, Goodfellow (third-party news digest) | **Weekly market & finance news roundup**, not a company's own results | **Week of 3–7 Jul, published 7 Jul 2023** | `Loma Linda University Health july 2026 release.html` |
| Novant Health, Inc. | **Combined-group financial and statistical report** (municipal-bond continuing disclosure, 10 pages) | **Q1 2026** (three months ended 31 Mar 2026) | `novant-health-q1-2026-combined-group-pkg.pdf` |

## The four files that aren't standard Q2 2026 earnings releases

- **`Cornerstone report.pdf`** — This is not a press release. It is Cornerstone Building Brands' full **SEC Form 10-Q**, a 51-page public regulatory filing covering the quarter ended **4 April 2026 (Q1 2026, not Q2)**. It includes financial statements, risk factors, and filed exhibits. Useful as a "long, dense document" test case.
- **`LSF-UNAUDITED-FS-JUNE-2026.pdf`** — Livestock Feeds Plc, a Nigerian company listed on the Nigerian Stock Exchange since 1978 and a subsidiary of UAC of Nigeria Plc. These are **unaudited interim financial statements** for the **six months** ended 30 June 2026, published under Nigeria SEC rules. Figures are in **Nigerian naira thousands (N'000)**, not US dollars — worth handling if you are parsing numbers.
- **`Loma Linda University Health july 2026 release.html`** — The filename is misleading. This is **not** Loma Linda University Health's own financial results. It is a general market-news newsletter (produced by a third party, Crescendo Interactive) that happens to be hosted on LLUH's charitable gift-planning website. The article covers Q2 earnings for McCormick, Levi Strauss, and Goodfellow plus Treasury yields and mortgage rates, and is dated **7 July 2023** — the "2026" in the filename is just the date the web page was saved. It is public, but it is a news digest about other companies, not a Loma Linda financial statement.
- **`novant-health-q1-2026-combined-group-pkg.pdf`** — Novant Health, Inc.'s **"Financial and Statistical Report, March 31, 2026 (Unaudited)"**, a 10-page filing for the **three months ended 31 March 2026 (Q1 2026, not Q2)**. It is not a corporate earnings release: Novant Health is a **not-for-profit** health system in North Carolina and South Carolina, and this is its **combined-group** report (Obligated Group plus Restricted Affiliates, with Unrestricted Affiliates and eliminations shown separately). Its MD&A states the purpose is "to provide information necessary to comply with continuing disclosure undertakings", i.e. it is published for holders of bonds issued by or for the benefit of Novant Health. Figures are in **thousands of US dollars**. Contains combined statements of revenues and expenses, combining balance sheets, cash flows, group statistics, a liquidity table, and MD&A.

## Formats

Twelve files are PDF; one (`Loma Linda University Health july 2026 release.html`) is a saved HTML web page. Several of the PDFs are print-to-PDF captures of investor-relations web pages, so they carry web furniture such as cookie banners, navigation menus, and social-share links in the extracted text. Expect to strip that out when parsing.

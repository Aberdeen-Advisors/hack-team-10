"""Inline styles.css + the JS files into a single self-contained page.

The Artifact host wraps the file in its own <!doctype>/<head>/<body>, so the
built file carries page content only — no <html>, <head> or <body> tags.

Brand fonts: the July 2025 slide template's font scheme is "Aberdeen Poppins"
(Poppins for both major and minor). The repo's fonts/ folder carries the TTFs;
when found, they are embedded as @font-face data URIs so the app renders in
true brand type on machines without Poppins installed. Adds ~1MB to the file.
"""
import base64
from pathlib import Path

here = Path(__file__).parent
read = lambda n: (here / n).read_text(encoding="utf-8")

# fonts/ lives at the repo root: ../fonts when built inside hack-team-10/app,
# ../hack-team-10/fonts when built from the sibling working folder.
FONT_WEIGHTS = [
    ("Poppins-Regular.ttf", 400, "normal"),
    ("Poppins-Medium.ttf", 500, "normal"),
    ("Poppins-SemiBold.ttf", 600, "normal"),
    ("Poppins-Bold.ttf", 700, "normal"),
    ("Poppins-Italic.ttf", 400, "italic"),
]

def font_faces():
    for cand in (here.parent / "fonts", here.parent / "hack-team-10" / "fonts"):
        if cand.is_dir():
            blocks = []
            for fname, weight, style in FONT_WEIGHTS:
                f = cand / fname
                if not f.is_file():
                    continue
                b64 = base64.b64encode(f.read_bytes()).decode("ascii")
                blocks.append(
                    "@font-face { font-family: 'Poppins'; "
                    f"font-weight: {weight}; font-style: {style}; "
                    "font-display: swap; "
                    f"src: url(data:font/ttf;base64,{b64}) format('truetype'); }}"
                )
            print(f"embedded {len(blocks)} Poppins faces from {cand}")
            return "\n".join(blocks) + "\n"
    print("WARNING: fonts/ not found — built file will rely on installed Poppins/Arial")
    return ""

body = read("index.html")
# Take everything between <body> and </body>, minus the script tags.
body = body.split("<body>", 1)[1].split("</body>", 1)[0]
for tag in ('  <script src="data-aberdeen.js"></script>\n',
            '  <script src="data-signals.js"></script>\n',
            '  <script src="data-investments.js"></script>\n',
            '  <script src="data-contacts.js"></script>\n',
            '  <script src="app.js"></script>\n'):
    body = body.replace(tag, "")

out = (
    # The Artifact host supplies its own <head>, but this file is also opened
    # directly and served over http.server, where a missing charset renders all
    # non-ASCII bytes as mojibake and a missing viewport blocks responsive
    # scaling. Browsers honour both anywhere in the first 1024 bytes and imply
    # the <head>; in the Artifact host they are harmless duplicates.
    '<meta charset="utf-8" />\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n'
    "<title>Aberdeen Pursuit Intelligence</title>\n"
    "<style>\n" + font_faces() + read("styles.css") + "\n</style>\n"
    + body.strip() + "\n"
    "<script>\n" + read("data-aberdeen.js") + "\n</script>\n"
    "<script>\n" + read("data-signals.js") + "\n</script>\n"
    "<script>\n" + read("data-investments.js") + "\n</script>\n"
    "<script>\n" + read("data-contacts.js") + "\n</script>\n"
    "<script>\n" + read("app.js") + "\n</script>\n"
)

dest = here / "pursuit-intelligence.html"
dest.write_text(out, encoding="utf-8")
print(f"wrote {dest}  ({len(out):,} bytes)")

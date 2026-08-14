"""Inline styles.css + the three JS files into a single self-contained page.

The Artifact host wraps the file in its own <!doctype>/<head>/<body>, so the
built file carries page content only — no <html>, <head> or <body> tags.
"""
from pathlib import Path

here = Path(__file__).parent
read = lambda n: (here / n).read_text(encoding="utf-8")

body = read("index.html")
# Take everything between <body> and </body>, minus the script tags.
body = body.split("<body>", 1)[1].split("</body>", 1)[0]
for tag in ('  <script src="data-aberdeen.js"></script>\n',
            '  <script src="data-signals.js"></script>\n',
            '  <script src="app.js"></script>\n'):
    body = body.replace(tag, "")

out = (
    "<title>Aberdeen Pursuit Intelligence</title>\n"
    "<style>\n" + read("styles.css") + "\n</style>\n"
    + body.strip() + "\n"
    "<script>\n" + read("data-aberdeen.js") + "\n</script>\n"
    "<script>\n" + read("data-signals.js") + "\n</script>\n"
    "<script>\n" + read("app.js") + "\n</script>\n"
)

dest = here / "pursuit-intelligence.html"
dest.write_text(out, encoding="utf-8")
print(f"wrote {dest}  ({len(out):,} bytes)")

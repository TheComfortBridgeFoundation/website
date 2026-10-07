#!/usr/bin/env python3
"""Weekly link check. Visits every external link in data/ and writes reports/link-report.md.
Never edits content: broken links are listed for a human to fix."""
import json, pathlib, re, sys, concurrent.futures as cf
import requests

ROOT = pathlib.Path(__file__).resolve().parent.parent
URL_RE = re.compile(r"https?://[^\s'\"<>)]+")
HEADERS = {"User-Agent": "ComfortBridgeLinkCheck/1.0 (+community education site)"}

def collect():
    urls = set()
    for f in (ROOT / "data").glob("*.json"):
        urls.update(u.rstrip(".,;") for u in URL_RE.findall(f.read_text(encoding="utf-8")))
    return sorted(u for u in urls if "{" not in u)

def check(url):
    try:
        r = requests.head(url, headers=HEADERS, timeout=20, allow_redirects=True)
        if r.status_code in (403, 405, 429) or r.status_code >= 500:
            r = requests.get(url, headers=HEADERS, timeout=25, allow_redirects=True, stream=True)
        moved = r.url.rstrip("/") != url.rstrip("/")
        return url, r.status_code, (r.url if moved else "")
    except requests.RequestException as e:
        return url, 0, type(e).__name__

def main():
    urls = collect()
    with cf.ThreadPoolExecutor(8) as ex:
        results = list(ex.map(check, urls))
    broken = [r for r in results if r[1] == 0 or r[1] >= 400]
    moved = [r for r in results if 200 <= r[1] < 400 and r[2]]
    lines = [f"# Link check\n", f"Checked {len(results)} links. Broken: {len(broken)}. Redirected: {len(moved)}.\n"]
    if broken:
        lines += ["\n## Broken (fix or replace)\n"] + [f"- {u}  (status {s or e})\n" for u, s, e in broken]
    if moved:
        lines += ["\n## Redirected (consider updating)\n"] + [f"- {u}\n  now: {e}\n" for u, s, e in moved]
    out = ROOT / "reports" / "link-report.md"
    out.parent.mkdir(exist_ok=True)
    out.write_text("".join(lines), encoding="utf-8")
    print("".join(lines))

if __name__ == "__main__":
    main()

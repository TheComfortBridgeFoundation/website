#!/usr/bin/env python3
"""Assemble site/index.html from src/ and data/. No dependencies beyond Python 3."""
import json, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data"

def load(name):
    return json.loads((DATA / name).read_text(encoding="utf-8"))

def main():
    site_data = {
        "content": load("content.json"),
        "resources": load("resources.json"),
        "config": load("config.json"),
        "chapters": load("chapters.json"),
        "events": load("events.json"),
        "cms": load("cms_hospices.json"),
    }
    blob = json.dumps(site_data, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    tpl = (ROOT / "src" / "index.template.html").read_text(encoding="utf-8")
    app = (ROOT / "src" / "app.js").read_text(encoding="utf-8")
    html = tpl.replace("{{SITE_DATA}}", blob).replace("{{APP_JS}}", app)
    out = ROOT / "site" / "index.html"
    out.parent.mkdir(exist_ok=True)
    out.write_text(html, encoding="utf-8")
    print(f"Built {out} ({len(html)//1024} KB)")

if __name__ == "__main__":
    main()

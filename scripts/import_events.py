#!/usr/bin/env python3
"""Import chapter events from a Google Sheet published as CSV (File > Share > Publish to web > CSV).
Set the sheet URL in the repository secret EVENTS_CSV_URL.
Columns: date (YYYY-MM-DD), time, title_en, title_es, title_vi, title_zh, place, city,
         description_en, description_es, description_vi, description_zh, link, chapter, publish (yes/no)"""
import csv, datetime, io, json, os, pathlib
import requests

ROOT = pathlib.Path(__file__).resolve().parent.parent

def langs(row, base):
    d = {l: (row.get(f"{base}_{l}") or "").strip() for l in ("en", "es", "vi", "zh")}
    return {k: v for k, v in d.items() if v}

def main():
    url = os.environ.get("EVENTS_CSV_URL")
    if not url:
        print("EVENTS_CSV_URL not set; skipping events import")
        return
    text = requests.get(url, timeout=30).text
    today = datetime.date.today().isoformat()
    events = []
    for row in csv.DictReader(io.StringIO(text)):
        row = {k.strip().lower(): (v or "").strip() for k, v in row.items() if k}
        if row.get("publish", "yes").lower() not in ("yes", "y", "true", "1"):
            continue
        date = row.get("date", "")
        try:
            datetime.date.fromisoformat(date)
        except ValueError:
            print("Skipping row with bad date:", row)
            continue
        if date < today or not row.get("title_en"):
            continue
        events.append({"date": date, "time": row.get("time", ""), "title": langs(row, "title"),
                       "description": langs(row, "description"), "place": row.get("place", ""),
                       "city": row.get("city", ""), "link": row.get("link", ""), "chapter": row.get("chapter", "tri-valley")})
    events.sort(key=lambda e: e["date"])
    path = ROOT / "data/events.json"
    if json.loads(path.read_text(encoding="utf-8")) != events:
        path.write_text(json.dumps(events, ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"Events updated: {len(events)} upcoming")
    else:
        print("No change in events")

if __name__ == "__main__":
    main()

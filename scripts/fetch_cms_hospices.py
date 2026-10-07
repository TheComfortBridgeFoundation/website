#!/usr/bin/env python3
"""Pull Medicare-certified hospices located in each chapter's counties from the CMS Provider
Data Catalog (Hospice - General Information, dataset yc9t-dgbk) and save data/cms_hospices.json.
The 'updated' date only changes when the list itself changes, so quiet weeks create no edits.
NOTE: field names are matched loosely because CMS occasionally renames columns. Check the
first run's output by hand."""
import datetime, json, pathlib, sys
import requests

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATASET = "yc9t-dgbk"
API = f"https://data.cms.gov/provider-data/api/1/datastore/query/{DATASET}/0"

def pick(row, *names):
    low = {k.lower(): v for k, v in row.items()}
    for n in names:
        for k, v in low.items():
            if k == n or k.startswith(n):
                if v not in (None, ""):
                    return str(v).strip()
    return ""

def fetch_state(state):
    rows, offset = [], 0
    while True:
        params = {"limit": 500, "offset": offset,
                  "conditions[0][property]": "state", "conditions[0][value]": state, "conditions[0][operator]": "="}
        r = requests.get(API, params=params, timeout=60)
        r.raise_for_status()
        batch = r.json().get("results", [])
        rows += batch
        if len(batch) < 500:
            return rows
        offset += 500

def main():
    chapters = json.loads((ROOT / "data/chapters.json").read_text(encoding="utf-8"))
    out_path = ROOT / "data/cms_hospices.json"
    current = json.loads(out_path.read_text(encoding="utf-8"))
    items = []
    for ch in chapters:
        counties = {c.upper() for c in ch.get("counties", [])}
        if not counties:
            continue
        for row in fetch_state(ch.get("state", "CA")):
            county = pick(row, "countyparish", "county").upper()
            if county not in counties:
                continue
            ccn = pick(row, "cms_certification_number", "ccn")
            city = pick(row, "citytown", "city").title()
            items.append({
                "name": pick(row, "facility_name", "provider_name").title(),
                "address": pick(row, "address_line_1", "address").title(),
                "city": city,
                "phone": pick(row, "telephone_number", "phone"),
                "ccn": ccn,
                "chapter": ch["id"],
                "url": f"https://www.medicare.gov/care-compare/details/hospice/{ccn}" if ccn else "",
            })
    if not items:
        print("No rows matched. Leaving data unchanged; check field names in the CMS dataset.", file=sys.stderr)
        return
    items.sort(key=lambda x: (x["city"], x["name"]))
    if items != current.get("items"):
        current["items"] = items
        current["updated"] = datetime.date.today().isoformat()
        out_path.write_text(json.dumps(current, ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"Updated: {len(items)} hospices")
    else:
        print("No change in CMS hospice list")

if __name__ == "__main__":
    main()

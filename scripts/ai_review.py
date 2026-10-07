#!/usr/bin/env python3
"""Weekly AI fact review.

For each official source in data/sources.json, fetches the page, sends it to the Claude API with the
matching English text from data/content.json, and asks only for changes the source clearly supports.
Accepted changes are applied to English and translated into Spanish, Vietnamese, and Chinese.
Everything lands in a pull request for a human to review; nothing is published automatically.

Needs the repository secret ANTHROPIC_API_KEY. Optional: CLAUDE_MODEL (see the models page at
https://docs.claude.com/en/docs/about-claude/models to pick a current model)."""
import html, json, os, pathlib, re, sys
import requests

ROOT = pathlib.Path(__file__).resolve().parent.parent
MODEL = os.environ.get("CLAUDE_MODEL", "claude-sonnet-5-5")
KEY = os.environ.get("ANTHROPIC_API_KEY")
LANGS = {"es": "Spanish", "vi": "Vietnamese", "zh": "Traditional Chinese (Taiwan/Hong Kong usage, as already used on the site)"}
MAX_SOURCE_CHARS = 60000

def claude(system, user, max_tokens=4000):
    r = requests.post("https://api.anthropic.com/v1/messages", timeout=180, headers={
        "x-api-key": KEY, "anthropic-version": "2023-06-01", "content-type": "application/json"},
        json={"model": MODEL, "max_tokens": max_tokens, "system": system,
              "messages": [{"role": "user", "content": user}]})
    r.raise_for_status()
    text = "".join(b.get("text", "") for b in r.json()["content"] if b.get("type") == "text")
    m = re.search(r"\{.*\}", text, re.S)
    return json.loads(m.group(0)) if m else {}

def page_text(url):
    raw = requests.get(url, timeout=60, headers={"User-Agent": "ComfortBridgeReview/1.0"}).text
    raw = re.sub(r"(?is)<(script|style|nav|footer|header).*?</\1>", " ", raw)
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", raw)))[:MAX_SOURCE_CHARS]

def get(obj, path):
    for p in path:
        obj = obj[p]
    return obj

def set_(obj, path, value):
    for p in path[:-1]:
        obj = obj[p]
    obj[path[-1]] = value

def leaves(obj, prefix):
    if isinstance(obj, str):
        yield prefix, obj
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from leaves(v, prefix + [i])
    elif isinstance(obj, dict):
        for k, v in obj.items():
            yield from leaves(v, prefix + [k])

def parse_path(p):
    return [int(x) if x.isdigit() else x for x in p.split(".")]

REVIEW_SYSTEM = """You fact-check a nonprofit's plain-language hospice education website against an official source.
Propose a change ONLY when the source clearly contradicts or updates the site text (a changed amount, date, statistic,
rule, name, or phone number). Do not rewrite for style. Keep the site's plain, warm, sentence-case voice and similar length.
Never add medical advice. If nothing needs to change, return no changes.
Respond with JSON only: {"changes":[{"path":"<exact path given>","current":"<exact current text>","proposed":"<new text>",
"reason":"<one sentence>","evidence":"<short quote from the source, under 25 words>"}]}"""

TRANSLATE_SYSTEM = """You update translations on a hospice education website for families. Given the old and new English text
and the existing translation, produce the updated translation: change only what the English change requires, keep the
existing wording and terminology elsewhere, keep any HTML tags exactly. Respond with JSON only: {"text":"..."}"""

def main():
    if not KEY:
        print("ANTHROPIC_API_KEY not set; skipping AI review")
        return
    content_path = ROOT / "data/content.json"
    T = json.loads(content_path.read_text(encoding="utf-8"))
    sources = json.loads((ROOT / "data/sources.json").read_text(encoding="utf-8"))
    report = ["# AI fact review\n", f"Model: {MODEL}\n"]
    applied = 0
    for src in sources:
        try:
            text = page_text(src["url"])
        except requests.RequestException as e:
            report.append(f"\n## {src['id']}\nCould not fetch {src['url']} ({e}). Check the link.\n")
            continue
        snippets = {}
        for p in src["paths"]:
            for path, s in leaves(get(T["en"], parse_path(p)), parse_path(p)):
                snippets[".".join(map(str, path))] = s
        user = (f"SOURCE ({src['url']}):\n{text}\n\nSITE TEXT TO CHECK (path: text). Topic: {src['note']}\n" +
                "\n".join(f"{k}: {v}" for k, v in snippets.items()))
        try:
            result = claude(REVIEW_SYSTEM, user)
        except Exception as e:
            report.append(f"\n## {src['id']}\nReview failed: {e}\n")
            continue
        changes = result.get("changes", [])
        report.append(f"\n## {src['id']} ({src['url']})\n")
        if not changes:
            report.append("No changes needed.\n")
        for ch in changes:
            key = ch.get("path", "")
            if key not in snippets or snippets[key] != ch.get("current"):
                report.append(f"- Skipped a suggestion for `{key}`: path or current text did not match exactly.\n")
                continue
            path = parse_path(key)
            old_en, new_en = ch["current"], ch["proposed"]
            set_(T["en"], path, new_en)
            translated = []
            for code, name in LANGS.items():
                try:
                    old_tr = get(T[code], path)
                    tr = claude(TRANSLATE_SYSTEM, f"Language: {name}\nOld English: {old_en}\nNew English: {new_en}\nExisting translation: {old_tr}", 1500).get("text")
                    if tr:
                        set_(T[code], path, tr)
                        translated.append(code)
                except Exception as e:
                    report.append(f"  - {code} translation failed for `{key}`: {e}. Update it by hand.\n")
            applied += 1
            report.append(f"- **`{key}`**\n  - Was: {old_en}\n  - Now: {new_en}\n  - Why: {ch.get('reason','')}\n"
                          f"  - Source says: \"{ch.get('evidence','')}\"\n  - Translated: {', '.join(translated) or 'none'}\n")
    content_path.write_text(json.dumps(T, ensure_ascii=False, indent=1), encoding="utf-8")
    report.insert(2, f"\n**{applied} change(s) applied.** Review every one against the source before merging. "
                     "Ask a native speaker to check changed translations.\n")
    out = ROOT / "reports/ai-review.md"
    out.parent.mkdir(exist_ok=True)
    out.write_text("".join(report), encoding="utf-8")
    print("".join(report))

if __name__ == "__main__":
    main()

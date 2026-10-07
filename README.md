# Comfort Bridge Foundation website

A plain-language hospice education site in English, Spanish, Vietnamese, and Chinese, with local chapter pages.
The live site is one self-contained file, `site/index.html`, built from the content in `data/`.

```
data/                  All site content (edit these, never site/index.html)
  content.json         Page text in all four languages
  resources.json       Resource directory
  config.json          Organization name, contact email, team photos
  chapters.json        Chapters and the counties they cover
  events.json          Upcoming events (filled by the weekly import)
  cms_hospices.json    Medicare-approved hospices (filled by the weekly import)
  sources.json         Official pages the weekly AI review checks against
src/                   Page template and app code
scripts/               Build and weekly update scripts
site/index.html        The built site that gets deployed
.github/workflows/     The weekly update job
docs/events-template.csv  Column layout for the events sheet
```

## 1. Put the site online

1. **Domain.** Buy the domain (for example comfortbridgefoundation.org) at Cloudflare Registrar, using a
   shared foundation login rather than a personal one.
2. **GitHub.** Create a GitHub account or organization for the foundation and a new repository, for example
   `comfortbridge/website`. Upload everything in this folder, keeping the folder structure.
3. **Cloudflare Pages.** In Cloudflare: Workers & Pages > Create > Pages > Connect to Git > pick the repository.
   - Framework preset: None
   - Build command: `python scripts/build.py`
   - Build output directory: `site`
4. **Custom domain.** In the Pages project: Custom domains > add `comfortbridgefoundation.org` and
   `www.comfortbridgefoundation.org`. DNS and HTTPS are set up automatically.
5. **Email (optional, recommended).** Cloudflare > Email > Email Routing: create
   `chapters@comfortbridgefoundation.org` forwarding to the chapter inbox, then change `email` in
   `data/config.json` to that address.
6. Open the live site on a phone and a laptop, switch through all four languages, and send one test form.

Every change merged into the `main` branch republishes the site within a minute or two.

## 2. Turn on the weekly update

In the repository: Settings > Secrets and variables > Actions.

| Name | Type | What it is |
|---|---|---|
| `ANTHROPIC_API_KEY` | Secret | Claude API key from console.anthropic.com, for the fact review |
| `EVENTS_CSV_URL` | Secret | Your events Google Sheet, published as CSV (File > Share > Publish to web > CSV) |
| `CLAUDE_MODEL` | Variable (optional) | Model name; defaults to the one in `scripts/ai_review.py` |

Also: Settings > Actions > General > Workflow permissions > allow GitHub Actions to create pull requests.

Every Monday the job:

1. **Checks every link** and opens an issue if any are broken.
2. **Refreshes the Medicare hospice list** for each chapter's counties from the CMS Provider Data Catalog.
3. **Imports events** from the Google Sheet (rows marked `publish = yes`, future dates only).
4. **Reviews facts** against the official pages in `data/sources.json` using Claude, applies only changes the
   source clearly supports, and translates them into Spanish, Vietnamese, and Chinese.
5. **Rebuilds the site** and opens a pull request titled "Weekly content update for review", with a report
   of every change and its source.

Nothing goes live until a reviewer opens that pull request, checks each change against the quoted source,
and clicks **Merge**. Weeks with no changes produce no pull request. Run it anytime from the Actions tab
(Weekly content update > Run workflow).

The first run: check the Medicare hospice list in `data/cms_hospices.json` by hand. CMS sometimes renames
data columns; if the list comes back empty, the script leaves the old data alone and says so in the log.

GitHub pauses scheduled jobs in repositories with no commits for 60 days. Merging the weekly pull requests
keeps it active.

## 3. Everyday edits

- **Text in any language:** edit `data/content.json` on GitHub (pencil icon), then commit. Keep the same keys
  in all four languages.
- **Add a resource:** add an entry to `data/resources.json` with a description in all four languages.
- **Add a team photo:** convert the photo to a data URI (any "image to base64" tool), paste it as the value
  for the person's id under `photos` in `data/config.json`.
- **Add a chapter:** add it to `data/chapters.json`, including its counties for the Medicare hospice list.
- **Build locally (optional):** `python scripts/build.py`, then open `site/index.html` in a browser.

## Costs

Domain about $10 to $20 a year. GitHub, Cloudflare Pages, and email forwarding are free. The weekly Claude
review typically costs a few dollars a month.

# Route Tracker — Context & Reference

This is the working reference for the "Apparel Supply Chain Route Tracker" widget on greenneurons.us (`#tracker` section, nav label "ROUTE TRACKER"). It shows shipping routes by origin country (Bangladesh, China, Korea, Japan, India) with transit times, risk levels, and live disruption alerts, plus a Fort Worth, TX last-mile routing panel.

## How it's wired together

Two Python scripts and a chain of launchers do the work. Nothing here needs a server — it's all static HTML, regenerated locally and pushed to GitHub, which Cloudflare picks up automatically.

```
tracker_fetch_and_deploy.bat
  → tracker_fetch.py --deploy
      1. Pulls headlines from 5 RSS feeds
      2. Scores them against keyword rules
      3. Merges results into tracker-data/disruptions.json
      4. Calls tracker_update.bat
          → tracker_update.py
              1. Reads disruptions.json
              2. Rewrites the alert HTML block in index.html
              3. Updates the "Last reviewed" date stamp
              4. Calls commit.ps1
                  → git add -A, commit, push to jennysiede/green-neurons-site
                      → Cloudflare's Git integration auto-deploys
```

Double-clicking `tracker_fetch_and_deploy.bat` runs the entire chain. You don't need to run the other pieces separately unless you're doing one step in isolation (see "Running pieces individually" below).

## File map

| File | Role |
|---|---|
| `tracker_fetch.py` | Fetches RSS, scores headlines, writes `tracker-data/disruptions.json` |
| `tracker_update.py` | Rebuilds the HTML alert block in `index.html` from the JSON, then deploys |
| `tracker_fetch_and_deploy.bat` | Double-click launcher: fetch + update + deploy, all in one |
| `tracker_update.bat` | Double-click launcher: rebuild HTML from existing JSON + deploy (no fetch) |
| `tracker-data/disruptions.json` | The data — current alert list, source of truth for what renders on the site |
| `tracker-data/fetch_log.txt` | Append-only log of every fetch run |
| `commit.bat` / `commit.ps1` / `commit.sh` | Three equivalent git add/commit/push helpers (CMD / PowerShell / bash) — `tracker_update.py` calls `commit.ps1` specifically |

## The data model — `disruptions.json`

```json
{
  "last_reviewed": "2026-07-13",
  "alerts": [
    {
      "id": "red-sea-suez",
      "level": "critical",
      "title": "Red Sea / Suez — Closed",
      "icon": "🚨",
      "body": "Houthi attacks ongoing since Nov 2023. 75% drop in Suez canal traffic...",
      "note": "→ Adds 10–14 days + significant cost uplift to affected routes.",
      "active": true
    }
  ],
  "notes": "Auto-updated by tracker_fetch.py. Manual alerts are preserved. Edit active:false to suppress any alert.",
  "last_fetch": "2026-07-13 12:56"
}
```

`level` is `"critical"` or `"warning"` and controls the color/badge styling on the site. `active: false` hides an alert without deleting it — useful for suppressing something manually without losing the record. Alerts written by the fetch script get an extra `auto_detected: true` and `last_signal` (date) field; hand-written alerts don't have `auto_detected`, which is exactly how the merge logic tells them apart (see below).

## `tracker_fetch.py` — where the signals come from

Five free RSS feeds, no API key needed:

- Reuters Business/Trade
- EIA Energy News (oil/energy — relevant to Hormuz, bunker fuel)
- USTR Trade News (US tariff actions)
- gCaptain Maritime News
- Splash247 Shipping News

Each headline+summary is checked against a fixed set of keyword rules, each mapping to one alert `id`:

| Rule id | Watches for | Level |
|---|---|---|
| `hormuz` | Strait of Hormuz / Iran blockade language | critical |
| `red-sea-suez` | Red Sea, Suez, Houthi, Bab el-Mandeb | critical |
| `canada-border` | US–Canada tariff/trade war, CUSMA/USMCA | warning |
| `china-tariff` | US–China tariffs, Section 301 | warning |
| `oil-price-spike` | Crude/Brent spikes, bunker fuel, surcharges | warning |
| `port-congestion` | US port delays, strikes, container backlog | warning |
| `panama-canal` | Panama Canal drought/restrictions | warning |

Matching is case-insensitive substring matching on title+summary — simple on purpose, tune the `RULES` list in `tracker_fetch.py` if a keyword set is too noisy or too quiet.

**Merge behavior (important):** every run merges into the existing JSON rather than overwriting it wholesale.
- Manual alerts (no `auto_detected` flag) are never touched by the script — safe to hand-write one directly in the JSON and it'll persist forever until you edit it yourself.
- An auto-detected alert that fires again gets its `body` and `last_signal` refreshed, `active` forced back to `true`.
- An auto-detected alert that *doesn't* re-fire this run is left in place as-is (it doesn't get deleted just because the feeds went quiet that day) — mute it manually by setting `active: false` if it's stale.

Flags: `--dry-run` prints what would be detected without writing anything or deploying; `--deploy` runs the fetch and then chains into `tracker_update.bat` automatically.

## `tracker_update.py` — turning JSON into the live page

Reads `disruptions.json` and regenerates everything between two sentinel comments in `index.html`:

```html
<!-- TRACKER-ALERTS-START -->
...generated alert divs...
<!-- TRACKER-ALERTS-END -->
```

**Don't delete those two comment lines from `index.html`** — the script searches for them by exact string match, and if they're missing it skips the HTML rewrite entirely (it'll warn you in the console but still proceed to the date-stamp step and deploy, so a missing sentinel fails silently-ish rather than crashing).

It also looks for a "Last reviewed: YYYY-MM-DD" string (or falls back to an "Updated Q# YYYY" pattern) elsewhere on the page and updates it to match `disruptions.json`'s `last_reviewed` field.

Flag: `--dry-run` prints the alert block it *would* write and exits — no file changes, no commit.

## Running pieces individually

- **Just want fresh signals pulled, without touching the live site yet?** Run `python tracker_fetch.py` (no flags) — updates the JSON only.
- **Hand-edited `disruptions.json` yourself and want the site to reflect it?** Run `tracker_update.bat` — rebuilds HTML from whatever's currently in the JSON and deploys, no fetch.
- **Just want to commit some unrelated repo change?** Use `commit.bat` / `commit.ps1` / `commit.sh` directly — same script, three shells, nothing tracker-specific about them.

## Deploy mechanics

`commit.ps1` does `git add -A`, prompts for a commit message (or timestamps one), commits, and prompts to push. Once pushed to `jennysiede/green-neurons-site` on GitHub, Cloudflare's Git integration (Workers Builds) picks it up and redeploys automatically — no manual `wrangler deploy` needed. Note that `gn-techpack` (a separate Cloudflare Workers project) also tracks this same repo, so it will rebuild too whenever you push, even for tracker-only changes. That's expected, not a bug.

## Adding a one-off manual alert

Open `tracker-data/disruptions.json` and add an entry without `auto_detected` or `last_signal` fields, e.g.:

```json
{
  "id": "my-manual-note",
  "level": "warning",
  "title": "Custom heads-up",
  "icon": "⚠",
  "body": "Whatever you want to say.",
  "note": "→ Optional follow-up line.",
  "active": true
}
```

Then run `tracker_update.bat` (not the fetch script) to push it live without triggering a new RSS pull.

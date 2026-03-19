# Tracker Ops — Supply Chain Disruption Feed

**Last updated:** 2026-03-19  
**Status:** Stable  
**Scope:** greenneurons.us supply chain tracker — fetch, update, deploy cycle

---

## File Map

```
green-neurons/
  tracker_fetch.py              # Fetches RSS → scores → updates disruptions.json
  tracker_update.py             # disruptions.json → injects HTML → index.html
  tracker_fetch_and_deploy.bat  # One-click: fetch + update + deploy
  tracker_update.bat            # One-click: update + deploy (no fetch)
  tracker-data/
    disruptions.json            # Source of truth for all alerts
    fetch_log.txt               # Auto-written by tracker_fetch.py
  commit.ps1                    # Git add -A + push → Cloudflare Pages
```

---

## Two-Script Chain

```
tracker_fetch.py
  → reads RSS feeds
  → scores against keyword rules
  → writes tracker-data/disruptions.json

tracker_update.py
  → reads disruptions.json
  → rebuilds alert block in index.html (between sentinel comments)
  → updates "Last reviewed" date stamp
  → optionally runs commit.ps1
```

---

## Sentinel Contract

`tracker_update.py` targets exactly this block in `index.html`:

```html
<!-- TRACKER-ALERTS-START -->
  ... generated alert HTML ...
<!-- TRACKER-ALERTS-END -->
```

**Do not remove or rename these comments.** The script will fail silently if sentinels are missing — alerts won't update but no error is thrown.

---

## Run Commands

| Intent | Command |
|---|---|
| Fetch + update JSON + deploy | `python tracker_fetch.py --deploy` |
| Fetch + update JSON only (review before deploy) | `python tracker_fetch.py` |
| Update HTML from existing JSON + deploy | `python tracker_update.py` |
| Preview fetch candidates, no file changes | `python tracker_fetch.py --dry-run` |
| One-click full cycle | double-click `tracker_fetch_and_deploy.bat` |

All commands run from `C:\Users\green\claude-work\green-neurons\`.

---

## Manual Alert Override

Edit `tracker-data/disruptions.json` directly to add, suppress, or edit an alert.

**Suppress without deleting:**
```json
{
  "id": "red-sea-suez",
  "active": false,
  ...
}
```

**Add a manual alert** — append to the `alerts` array:
```json
{
  "id": "your-id",
  "level": "warning",
  "icon": "⚠️",
  "title": "Short headline",
  "body": "One sentence. What happened, where, what it affects.",
  "note": "→ Operational implication for sourcing.",
  "active": true,
  "manual": true
}
```

`manual: true` flags it as curator-added so auto-fetch won't overwrite it.

Levels: `critical` / `warning` / `info`

---

## RSS Sources

Defined in `tracker_fetch.py` → `RSS_SOURCES` list:

| Source | Coverage |
|---|---|
| Reuters Business/Trade | General trade + tariff news |
| EIA Energy News | Oil price, Hormuz, energy disruptions |
| USTR Trade News | US tariff actions |
| gCaptain | Maritime / port disruptions |
| Splash247 | Shipping industry news |

**To add a source:** append to `RSS_SOURCES` in `tracker_fetch.py`:
```python
{
    "name": "Your Source Name",
    "url":  "https://example.com/feed/",
},
```

---

## "Last Reviewed" Date

`tracker_update.py` auto-updates this stamp in `index.html` on every run.  
Pattern it matches: `Last reviewed: YYYY-MM-DD`  
No manual intervention needed.

---

## Deploy Chain

```powershell
# Full manual cycle
python tracker_fetch.py
# review greenneurons.us or disruptions.json
python tracker_update.py
.\commit.ps1 "Update tracker alerts YYYY-MM-DD"
```

`commit.ps1` runs `git add -A` — picks up all changed files in the project folder.

---

## Related Vault Docs

- `01 architecture/greenneurons.us site-architecture.md` — single-page rationale, Cloudflare Pages deploy
- `04 intelligence-tools/intelligence-tools-strategy.md` — tracker positioning within the intelligence tools suite

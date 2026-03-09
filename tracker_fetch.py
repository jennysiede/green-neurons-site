#!/usr/bin/env python3
"""
tracker_fetch.py
----------------
Fetches shipping disruption signals from free public sources, scores them
for relevance, and auto-updates tracker-data/disruptions.json.

After running, double-click tracker_update.bat to push changes live,
OR run this script with --deploy to do it all in one shot.

Sources (all free, no API key required):
  - Reuters RSS  (trade/shipping news)
  - EIA RSS      (oil/energy news — Hormuz, oil price)
  - USTR RSS     (US tariff/trade actions)
  - MarineTraffic blog RSS (maritime disruptions)

Usage:
    python tracker_fetch.py            # fetch + update json only
    python tracker_fetch.py --deploy   # fetch + update json + deploy live
    python tracker_fetch.py --dry-run  # fetch + print candidates, no file changes
"""

import json
import subprocess
import sys
import re
import urllib.request
import xml.etree.ElementTree as ET
from datetime import date, datetime
from pathlib import Path

# ── Paths ──────────────────────────────────────────────────────────────
BASE_DIR  = Path(__file__).parent
DATA_FILE = BASE_DIR / "tracker-data" / "disruptions.json"
LOG_FILE  = BASE_DIR / "tracker-data" / "fetch_log.txt"

# ── RSS Sources ────────────────────────────────────────────────────────
RSS_SOURCES = [
    {
        "name": "Reuters Business/Trade",
        "url":  "https://feeds.reuters.com/reuters/businessNews",
    },
    {
        "name": "EIA Energy News",
        "url":  "https://www.eia.gov/rss/news.xml",
    },
    {
        "name": "USTR Trade News",
        "url":  "https://ustr.gov/about-us/policy-offices/press-office/press-releases/rss",
    },
    {
        "name": "gCaptain Maritime News",
        "url":  "https://gcaptain.com/feed/",
    },
    {
        "name": "Splash247 Shipping News",
        "url":  "https://splash247.com/feed/",
    },
]

# ── Keyword Rules → alert templates ───────────────────────────────────
# Each rule: keywords to match (any), severity level, alert template fields
RULES = [
    {
        "id":       "hormuz",
        "keywords": ["hormuz", "strait of hormuz", "iran strait", "persian gulf closure",
                     "iran blockade", "iran shipping"],
        "level":    "critical",
        "icon":     "🚨",
        "title":    "Strait of Hormuz — Disruption Detected",
        "body_prefix": "Hormuz disruption reported: ",
        "note":     "→ Affects all Persian Gulf origin routes. Bangladesh/Pakistan via Arabian Sea at risk. Monitor daily.",
    },
    {
        "id":       "red-sea-suez",
        "keywords": ["red sea", "suez", "houthi", "bab el-mandeb", "yemen shipping"],
        "level":    "critical",
        "icon":     "🚨",
        "title":    "Red Sea / Suez — Closed",
        "body_prefix": "",
        "note":     "→ Adds 10–14 days + significant cost uplift to affected routes.",
        "default_body": "Houthi attacks ongoing since Nov 2023. 75% drop in Suez canal traffic. All major carriers rerouted via Cape of Good Hope.",
    },
    {
        "id":       "canada-border",
        "keywords": ["canada tariff", "us-canada trade", "cusma", "usmca tariff",
                     "canada border", "canada trade war"],
        "level":    "warning",
        "icon":     "⚠",
        "title":    "Canada Border — Active",
        "body_prefix": "",
        "note":     "→ Route directly to US ports. Avoid Canadian transshipment hubs.",
        "default_body": "US–Canada trade war (Mar 4, 2025). 35% tariff on non-CUSMA goods as of Aug 1, 2025. Border delays and customs complexity.",
    },
    {
        "id":       "china-tariff",
        "keywords": ["china tariff", "us-china trade", "section 301", "china import duty",
                     "china trade war", "chinese goods tariff"],
        "level":    "warning",
        "icon":     "⚠",
        "title":    "US–China Tariffs — Active",
        "body_prefix": "Tariff update: ",
        "note":     "→ Verify current duty rates with your freight forwarder before placing China-origin orders.",
    },
    {
        "id":       "oil-price-spike",
        "keywords": ["oil price surge", "crude oil spike", "brent crude high",
                     "oil price record", "fuel surcharge increase", "bunker fuel"],
        "level":    "warning",
        "icon":     "⚠",
        "title":    "Oil Price Spike — Freight Cost Impact",
        "body_prefix": "Energy markets: ",
        "note":     "→ Expect carrier fuel surcharge increases. Lock in freight rates early where possible.",
    },
    {
        "id":       "port-congestion",
        "keywords": ["port congestion", "los angeles port", "long beach port", "port delay",
                     "container backlog", "port strike", "longshoremen strike",
                     "port shutdown", "port closure"],
        "level":    "warning",
        "icon":     "⚠",
        "title":    "US Port Congestion — Delays Reported",
        "body_prefix": "Port update: ",
        "note":     "→ Add buffer time for US West Coast arrivals. Consider East Coast routing via Savannah/Houston.",
    },
    {
        "id":       "panama-canal",
        "keywords": ["panama canal", "canal drought", "panama water level",
                     "canal transit restriction", "panama congestion"],
        "level":    "warning",
        "icon":     "⚠",
        "title":    "Panama Canal — Restrictions",
        "body_prefix": "",
        "note":     "→ Affects Asia → US East Coast routing. Allow additional transit time.",
        "default_body": "Canal capacity restrictions in effect. Transit delays and booking backlogs reported.",
    },
]


def log(msg: str):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    line = f"[{timestamp}] {msg}"
    print(line)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(line + "\n")


def fetch_rss(source: dict) -> list[dict]:
    """Fetch RSS feed, return list of {title, summary, link, published}."""
    items = []
    try:
        req = urllib.request.Request(
            source["url"],
            headers={"User-Agent": "GreenNeurons-TrackerBot/1.0"}
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            raw = resp.read()
        root = ET.fromstring(raw)

        # Handle both RSS 2.0 and Atom
        ns = {"atom": "http://www.w3.org/2005/Atom"}
        entries = root.findall(".//item") or root.findall(".//atom:entry", ns)

        for entry in entries[:20]:  # cap at 20 per source
            def text(tag):
                el = entry.find(tag) or entry.find(f"atom:{tag}", ns)
                return el.text.strip() if el is not None and el.text else ""

            items.append({
                "title":     text("title"),
                "summary":   text("description") or text("summary") or text("content"),
                "link":      text("link") or text("atom:link"),
                "published": text("pubDate") or text("published") or text("updated"),
                "source":    source["name"],
            })
    except Exception as e:
        log(f"  [WARN] Could not fetch {source['name']}: {e}")
    return items


def score_item(item: dict) -> list[str]:
    """Return list of matching rule IDs for a news item."""
    text = (item["title"] + " " + item["summary"]).lower()
    matched = []
    for rule in RULES:
        if any(kw in text for kw in rule["keywords"]):
            matched.append(rule["id"])
    return matched


def build_alert_from_rule(rule: dict, matching_items: list[dict]) -> dict:
    """Build a disruptions.json alert entry from a rule + matched headlines."""
    # Use most recent headline as body if rule has a body_prefix
    if rule.get("body_prefix") and matching_items:
        headline = matching_items[0]["title"]
        source   = matching_items[0]["source"]
        body = f"{rule['body_prefix']}{headline} (via {source})"
    else:
        body = rule.get("default_body", matching_items[0]["title"] if matching_items else "")

    return {
        "id":     rule["id"],
        "level":  rule["level"],
        "title":  rule["title"],
        "icon":   rule["icon"],
        "body":   body,
        "note":   rule["note"],
        "active": True,
        "auto_detected": True,
        "last_signal": str(date.today()),
    }


def load_existing() -> dict:
    if DATA_FILE.exists():
        with open(DATA_FILE, encoding="utf-8") as f:
            return json.load(f)
    return {"last_reviewed": str(date.today()), "alerts": []}


def merge_alerts(existing: list, detected: dict) -> list:
    """
    Merge detected alerts into existing list.
    - New detections: add as active
    - Existing manual alerts (no auto_detected): always preserve as-is
    - Existing auto alerts not re-detected today: keep but don't re-trigger
    - Re-detected auto alerts: update body with latest headline
    """
    result = []

    # Preserve all manual (non-auto) alerts unchanged
    for alert in existing:
        if not alert.get("auto_detected", False):
            result.append(alert)

    # Process auto-detected alerts
    existing_ids = {a["id"]: a for a in existing if a.get("auto_detected", False)}

    for rule_id, alert in detected.items():
        if rule_id in existing_ids:
            # Update existing auto alert with fresh body/date
            updated = existing_ids[rule_id].copy()
            updated["body"]         = alert["body"]
            updated["last_signal"]  = alert["last_signal"]
            updated["active"]       = True
            result.append(updated)
            existing_ids.pop(rule_id)
        else:
            # New detection — add it
            result.append(alert)

    # Preserve existing auto alerts that weren't re-detected (keep but don't update)
    for rule_id, alert in existing_ids.items():
        result.append(alert)

    return result


def run_deploy():
    bat = BASE_DIR / "tracker_update.bat"
    if bat.exists():
        log("Running tracker_update.bat to deploy...")
        subprocess.run([str(bat)], cwd=str(BASE_DIR))
    else:
        log("[WARN] tracker_update.bat not found — skipping deploy.")


def main():
    dry_run = "--dry-run" in sys.argv
    deploy  = "--deploy"  in sys.argv

    print("=" * 55)
    print("  Green Neurons — Tracker Fetch Script")
    print("=" * 55)

    # ── Fetch all RSS feeds ────────────────────────────────────────────
    all_items = []
    for source in RSS_SOURCES:
        log(f"Fetching: {source['name']}...")
        items = fetch_rss(source)
        log(f"  → {len(items)} items retrieved")
        all_items.extend(items)

    log(f"Total items fetched: {len(all_items)}")

    # ── Score items against rules ──────────────────────────────────────
    detected: dict[str, dict] = {}   # rule_id → alert
    rule_hits: dict[str, list] = {}  # rule_id → [matching items]

    for item in all_items:
        matched_ids = score_item(item)
        for rule_id in matched_ids:
            rule_hits.setdefault(rule_id, []).append(item)

    # Build alerts for each matched rule
    for rule in RULES:
        if rule["id"] in rule_hits:
            items = rule_hits[rule["id"]]
            alert = build_alert_from_rule(rule, items)
            detected[rule["id"]] = alert
            log(f"  [SIGNAL] {rule['id']} — {len(items)} matching headlines")

    if not detected:
        log("No new disruption signals detected.")
    else:
        log(f"{len(detected)} disruption signal(s) detected: {', '.join(detected.keys())}")

    if dry_run:
        print("\n[DRY RUN] Detected alerts (not written):\n")
        print(json.dumps(list(detected.values()), indent=2, ensure_ascii=False))
        return

    # ── Merge with existing json ───────────────────────────────────────
    existing_data = load_existing()
    merged = merge_alerts(existing_data.get("alerts", []), detected)

    output = {
        "last_reviewed": str(date.today()),
        "alerts":        merged,
        "notes":         "Auto-updated by tracker_fetch.py. Manual alerts are preserved. Edit active:false to suppress any alert.",
        "last_fetch":    str(datetime.now().strftime("%Y-%m-%d %H:%M")),
    }

    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    log(f"disruptions.json updated — {len(merged)} total alerts.")
    print(f"\n✓ disruptions.json updated. Review greenneurons.us after deploying.")

    if deploy:
        run_deploy()
    else:
        print("  Run tracker_update.bat (or add --deploy flag) to push live.")


if __name__ == "__main__":
    main()

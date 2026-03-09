#!/usr/bin/env python3
"""
tracker_update.py
-----------------
Reads tracker-data/disruptions.json, rebuilds the tracker alert section
in index.html, updates the "Last reviewed" date stamp, then runs commit.ps1
to deploy to Cloudflare Pages automatically.

Usage:
    python tracker_update.py              # update + auto-commit + deploy
    python tracker_update.py --dry-run   # preview HTML output only, no commit
"""

import json
import re
import subprocess
import sys
import os
from datetime import date
from pathlib import Path

# ── Paths ──────────────────────────────────────────────────────────────
BASE_DIR    = Path(__file__).parent
DATA_FILE   = BASE_DIR / "tracker-data" / "disruptions.json"
INDEX_FILE  = BASE_DIR / "index.html"
COMMIT_PS1  = BASE_DIR / "commit.ps1"

# ── Sentinel comments that wrap the alert block in index.html ──────────
ALERT_START = "<!-- TRACKER-ALERTS-START -->"
ALERT_END   = "<!-- TRACKER-ALERTS-END -->"

# ── Date sentinel in the tracker footnote ─────────────────────────────
DATE_PATTERN = re.compile(r"(Last reviewed:?\s*)[\d]{4}-[\d]{2}-[\d]{2}", re.IGNORECASE)
DATE_PATTERN_ALT = re.compile(r"(Updated\s+)(Q\d\s+\d{4})", re.IGNORECASE)


def load_data() -> dict:
    if not DATA_FILE.exists():
        sys.exit(f"[ERROR] Data file not found: {DATA_FILE}")
    with open(DATA_FILE, encoding="utf-8") as f:
        return json.load(f)


def build_alert_html(alerts: list) -> str:
    """Generate the inner HTML for the tracker alert div."""
    lines = [f'    <div class="tracker-alerts reveal" id="tracker-alerts">']
    active = [a for a in alerts if a.get("active", True)]

    if not active:
        lines.append('      <!-- No active disruptions -->')
    else:
        for alert in active:
            level = alert.get("level", "warning")
            icon  = alert.get("icon", "⚠")
            title = alert.get("title", "")
            body  = alert.get("body", "")
            note  = alert.get("note", "")

            lines.append(f'      <div class="tracker-alert {level}">')
            lines.append(f'        <div class="alert-label {level}">{icon} {title}</div>')
            lines.append(f'        <p class="alert-body">{body}</p>')
            if note:
                lines.append(f'        <p class="alert-note">{note}</p>')
            lines.append(f'      </div>')

    lines.append('    </div>')
    return "\n".join(lines)


def update_html(html: str, data: dict) -> str:
    today_str = data.get("last_reviewed", str(date.today()))

    # ── 1. Replace alert block between sentinel comments ──────────────
    pattern = re.compile(
        rf"{re.escape(ALERT_START)}.*?{re.escape(ALERT_END)}",
        re.DOTALL
    )
    new_block = f"{ALERT_START}\n{build_alert_html(data['alerts'])}\n    {ALERT_END}"

    if pattern.search(html):
        html = pattern.sub(new_block, html)
    else:
        print("[WARN] Sentinel comments not found in index.html.")
        print(f"       Add  {ALERT_START}  and  {ALERT_END}  around the tracker-alerts div.")
        print("       Skipping alert block update — date stamp only.")

    # ── 2. Update "Last reviewed" date if present ─────────────────────
    if DATE_PATTERN.search(html):
        html = DATE_PATTERN.sub(rf"\g<1>{today_str}", html)
        print(f"[OK]  Updated 'Last reviewed' date to {today_str}")
    elif DATE_PATTERN_ALT.search(html):
        # Fallback: replace "Updated Q1 2026" style strings
        quarter = f"Q{((date.today().month - 1) // 3) + 1} {date.today().year}"
        html = DATE_PATTERN_ALT.sub(rf"\g<1>{quarter}", html)
        print(f"[OK]  Updated quarter label to {quarter}")
    else:
        print(f"[WARN] No date pattern found in index.html — date not updated.")

    return html


def run_commit():
    """Run commit.ps1 via PowerShell."""
    if not COMMIT_PS1.exists():
        print(f"[WARN] commit.ps1 not found at {COMMIT_PS1} — skipping deploy.")
        return
    print("[...] Running commit.ps1 to deploy to Cloudflare...")
    result = subprocess.run(
        ["powershell.exe", "-ExecutionPolicy", "Bypass", "-File", str(COMMIT_PS1)],
        cwd=str(BASE_DIR),
        capture_output=True,
        text=True
    )
    if result.returncode == 0:
        print("[OK]  Deployed successfully.")
        if result.stdout.strip():
            print(result.stdout.strip())
    else:
        print(f"[ERROR] commit.ps1 failed (exit {result.returncode}):")
        print(result.stderr.strip() or result.stdout.strip())


def main():
    dry_run = "--dry-run" in sys.argv

    print("=" * 55)
    print("  Green Neurons — Tracker Update Script")
    print("=" * 55)

    # Load data
    data = load_data()
    active_count = sum(1 for a in data["alerts"] if a.get("active", True))
    print(f"[OK]  Loaded {len(data['alerts'])} alerts ({active_count} active) from disruptions.json")

    # Load index.html
    if not INDEX_FILE.exists():
        sys.exit(f"[ERROR] index.html not found: {INDEX_FILE}")
    html = INDEX_FILE.read_text(encoding="utf-8")

    # Build updated HTML
    updated_html = update_html(html, data)

    if dry_run:
        print("\n[DRY RUN] Changes preview (alert block only):\n")
        block_match = re.search(
            rf"{re.escape(ALERT_START)}.*?{re.escape(ALERT_END)}",
            updated_html, re.DOTALL
        )
        if block_match:
            print(block_match.group())
        print("\n[DRY RUN] No files written, no commit made.")
        return

    # Write updated index.html
    INDEX_FILE.write_text(updated_html, encoding="utf-8")
    print(f"[OK]  index.html updated.")

    # Deploy
    run_commit()
    print("\n✓ Tracker update complete.")


if __name__ == "__main__":
    main()

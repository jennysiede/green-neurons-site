#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# Green Neurons — Git Commit Script
# Usage: ./commit.sh "your commit message"
#   or just: ./commit.sh   (uses a timestamped default message)
# ─────────────────────────────────────────────────────────────

set -e
cd "$(dirname "$0")"

# Check git
if ! command -v git &>/dev/null; then
  echo "ERROR: git not found."
  exit 1
fi

# Status
echo
echo "── Current status ──────────────────────────────"
git status
echo "────────────────────────────────────────────────"
echo

# Commit message
if [ -z "$1" ]; then
  MSG="update $(date '+%Y-%m-%d %H:%M')"
else
  MSG="$1"
fi

# Stage all
git add -A

# Confirm
echo "About to commit: \"$MSG\""
echo
read -rp "Proceed? [Y/n]: " CONFIRM
if [[ "$CONFIRM" =~ ^[Nn]$ ]]; then
  echo "Aborted."
  exit 0
fi

git commit -m "$MSG"

echo
echo "── Commit complete ─────────────────────────────"
git log --oneline -5
echo "────────────────────────────────────────────────"
echo

# Optional push
read -rp "Push to remote now? [Y/n]: " DOPUSH
if [[ ! "$DOPUSH" =~ ^[Nn]$ ]]; then
  git push
  echo "Pushed."
fi

echo "Done."

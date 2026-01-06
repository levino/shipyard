#!/usr/bin/env bash
# Ralph Wiggum Loop - continuously runs Claude sessions
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$(dirname "$SCRIPT_DIR")"

while true; do
  echo "=== Ralph session starting ==="

  # Check for pending tasks
  pending=$(jq '[.tasks[] | select(.status == "pending" or .status == "in_progress")] | length' "$SCRIPT_DIR/tasks.json")
  if [[ "$pending" -eq 0 ]]; then
    echo "All tasks completed!"
    break
  fi

  echo "$pending tasks remaining"

  # Run Claude non-interactively with full permissions
  claude -p --dangerously-skip-permissions "Read these files and follow the instructions in PROMPT.md:
@$SCRIPT_DIR/PROMPT.md
@$SCRIPT_DIR/tasks.json
@$SCRIPT_DIR/learnings.md
@$SCRIPT_DIR/history.md"

  echo "=== Session complete, waiting 5s ==="
  sleep 5
done

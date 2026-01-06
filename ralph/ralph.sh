#!/usr/bin/env bash
# Ralph Wiggum - loop N times non-interactively
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$(dirname "$SCRIPT_DIR")"

for ((i=1; i<=$1; i++)); do
  # Run Claude non-interactively with full permissions
  claude -p --dangerously-skip-permissions "Read these files and follow the instructions in PROMPT.md:
@$SCRIPT_DIR/PROMPT.md
@$SCRIPT_DIR/tasks.json
@$SCRIPT_DIR/learnings.md
@$SCRIPT_DIR/history.md"
done

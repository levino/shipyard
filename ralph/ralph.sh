#!/usr/bin/env bash
# Ralph Wiggum - loop N times non-interactively
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$REPO_ROOT"

for ((i=1; i<=$1; i++)); do
  output=$(claude -p --dangerously-skip-permissions "Read these files and follow the instructions in PROMPT.md:
@$REPO_ROOT/CLAUDE.md
@$SCRIPT_DIR/PROMPT.md
@$SCRIPT_DIR/tasks.json
@$SCRIPT_DIR/learnings.md
@$SCRIPT_DIR/history.md")
  echo "$output"
  if echo "$output" | grep -q "<promise>COMPLETE</promise>"; then
    break
  fi
done

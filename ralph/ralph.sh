#!/usr/bin/env bash
# Ralph Wiggum Loop - runs Claude sessions N times
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: ./ralph.sh <number_of_loops>"
  exit 1
fi

LOOPS=$1
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$(dirname "$SCRIPT_DIR")"

for ((i=1; i<=LOOPS; i++)); do
  echo "=== Ralph session $i/$LOOPS ==="

  claude -p --dangerously-skip-permissions "Read these files and follow the instructions in PROMPT.md:
@$SCRIPT_DIR/PROMPT.md
@$SCRIPT_DIR/tasks.json
@$SCRIPT_DIR/learnings.md
@$SCRIPT_DIR/history.md"

  if [[ $i -lt $LOOPS ]]; then
    echo "=== Waiting 5s ==="
    sleep 5
  fi
done

echo "=== Done ==="

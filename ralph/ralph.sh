#!/usr/bin/env bash
# Ralph Wiggum - loop N times non-interactively
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$REPO_ROOT"

for ((i=1; i<=$1; i++)); do
  stdbuf -oL claude -p --verbose --dangerously-skip-permissions --output-format stream-json "Read these files and follow the instructions in PROMPT.md:
@$REPO_ROOT/CLAUDE.md
@$SCRIPT_DIR/PROMPT.md
@$SCRIPT_DIR/tasks.json
@$SCRIPT_DIR/learnings.md
@$SCRIPT_DIR/history.md" | stdbuf -oL jq -r --unbuffered 'select(.type == "assistant") | .message.content[]? | select(.type == "text") | .text // empty'
done

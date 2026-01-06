#!/usr/bin/env bash
# Ralph Wiggum - loop N times non-interactively
set -euo pipefail

# Check for required argument
if [[ $# -eq 0 ]] || ! [[ "$1" =~ ^[0-9]+$ ]]; then
  echo "Usage: ./ralph/ralph.sh <iterations>"
  echo ""
  echo "  <iterations>  Number of times to run the Claude loop (must be a positive integer)"
  echo ""
  echo "Example:"
  echo "  ./ralph/ralph.sh 5    # Run 5 iterations"
  echo "  ./ralph/ralph.sh 10   # Run 10 iterations"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$REPO_ROOT"

for ((i=1; i<=$1; i++)); do
  echo "=== Ralph iteration $i of $1 ==="

  output=$(stdbuf -oL claude -p --verbose --dangerously-skip-permissions --output-format stream-json "Read these files and follow the instructions in PROMPT.md:
@$REPO_ROOT/CLAUDE.md
@$SCRIPT_DIR/PROMPT.md
@$SCRIPT_DIR/tasks.json
@$SCRIPT_DIR/learnings.md
@$SCRIPT_DIR/history.md" | stdbuf -oL jq -r --unbuffered 'select(.type == "assistant") | .message.content[]? | select(.type == "text") | .text // empty' | tee /dev/stderr)

  # Check for completion signal
  if echo "$output" | grep -q '<promise>COMPLETE</promise>'; then
    echo ""
    echo "=== Ralph completed all tasks! Exiting loop. ==="
    exit 0
  fi
done

echo ""
echo "=== Ralph finished $1 iterations (tasks may still be pending) ==="

#!/usr/bin/env bash
# Ralph Wiggum - single interactive session
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$(dirname "$SCRIPT_DIR")"

# Run Claude interactively with full permissions
claude --dangerously-skip-permissions "Read these files and follow the instructions in PROMPT.md:
@CLAUDE.md
@$SCRIPT_DIR/PROMPT.md
@$SCRIPT_DIR/tasks.json
@$SCRIPT_DIR/learnings.md
@$SCRIPT_DIR/history.md"

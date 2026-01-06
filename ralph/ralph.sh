#!/usr/bin/env bash
#
# Ralph Wiggum Loop
# Continuously runs Claude sessions to work through tasks
#
# Usage: ./ralph/ralph.sh [options]
#   --interactive  Run one interactive session (you can talk to Claude)
#   --once         Run one autonomous session, then exit
#   --dry-run      Print what would be run without executing
#   --delay N      Wait N seconds between sessions (default: 5)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Defaults
DRY_RUN=false
RUN_ONCE=false
INTERACTIVE=false
DELAY=5

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --once)
      RUN_ONCE=true
      shift
      ;;
    --interactive)
      INTERACTIVE=true
      RUN_ONCE=true  # Interactive always runs once
      shift
      ;;
    --delay)
      DELAY="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
  echo -e "${BLUE}[RALPH]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[RALPH]${NC} $1"
}

log_warn() {
  echo -e "${YELLOW}[RALPH]${NC} $1"
}

log_error() {
  echo -e "${RED}[RALPH]${NC} $1"
}

# Check for pending tasks
check_pending_tasks() {
  local tasks_file="$SCRIPT_DIR/tasks.json"
  if [[ ! -f "$tasks_file" ]]; then
    log_error "tasks.json not found"
    return 1
  fi

  # Count pending and in_progress tasks
  local count
  count=$(jq '[.tasks[] | select(.status == "pending" or .status == "in_progress")] | length' "$tasks_file")

  if [[ "$count" -eq 0 ]]; then
    log_success "All tasks completed!"
    return 1
  fi

  log_info "Found $count pending/in_progress tasks"
  return 0
}

# Run a single Claude session
run_session() {
  local session_num=$1
  local prompt_file="$SCRIPT_DIR/PROMPT.md"

  log_info "Starting session #$session_num"
  log_info "$(date '+%Y-%m-%d %H:%M:%S')"

  if [[ "$DRY_RUN" == "true" ]]; then
    if [[ "$INTERACTIVE" == "true" ]]; then
      log_warn "[DRY RUN] Would execute: claude --prompt-file $prompt_file"
    else
      log_warn "[DRY RUN] Would execute: cat $prompt_file | claude --print"
    fi
    return 0
  fi

  cd "$REPO_ROOT"

  if [[ "$INTERACTIVE" == "true" ]]; then
    # Interactive mode - user can talk to Claude
    log_info "Starting interactive session. You can talk to Claude."
    log_info "Claude will read the Ralph prompt and work on tasks."
    echo ""
    if claude --prompt-file "$prompt_file"; then
      log_success "Interactive session completed"
      return 0
    else
      log_error "Interactive session failed"
      return 1
    fi
  else
    # Autonomous mode - pipe prompt to Claude
    if cat "$prompt_file" | claude --print; then
      log_success "Session #$session_num completed successfully"
      return 0
    else
      log_error "Session #$session_num failed"
      return 1
    fi
  fi
}

# Main loop
main() {
  log_info "Ralph Wiggum Loop starting..."
  log_info "Repository: $REPO_ROOT"

  if [[ "$DRY_RUN" == "true" ]]; then
    log_warn "DRY RUN MODE - no commands will be executed"
  fi

  if [[ "$INTERACTIVE" == "true" ]]; then
    log_info "Interactive mode - you will be able to talk to Claude"
  elif [[ "$RUN_ONCE" == "true" ]]; then
    log_info "Single autonomous session mode"
  else
    log_info "Continuous loop mode (delay: ${DELAY}s between sessions)"
  fi

  local session=0

  while true; do
    session=$((session + 1))

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Check if there are tasks to work on
    if ! check_pending_tasks; then
      log_info "No more tasks. Exiting."
      break
    fi

    # Run the session
    if ! run_session "$session"; then
      log_error "Session failed. Waiting before retry..."
      sleep "$DELAY"
      continue
    fi

    # Exit if running once
    if [[ "$RUN_ONCE" == "true" ]]; then
      log_info "Single session complete. Exiting."
      break
    fi

    # Wait before next session
    log_info "Waiting ${DELAY}s before next session..."
    sleep "$DELAY"
  done

  log_success "Ralph Wiggum Loop finished"
}

main

# Ralph Session Instructions

You are operating in a Ralph Wiggum loop. Each session you will:

1. **Read State**: Load the task list and history
2. **Pick Task**: Select the highest priority pending task (or continue an in_progress task)
3. **Work**: Make incremental progress on the task
4. **Update State**: Update tasks.json and append to history.md
5. **Commit**: Commit your changes with a descriptive message
6. **Exit**: End session cleanly so the loop can restart

## Your Workflow

### Step 1: Load Context

The following files are automatically sourced when you start (via @filename):
- `ralph/tasks.json` - Current task list
- `ralph/history.md` - Recent session history
- `ralph/learnings.md` - Permanent knowledge base (patterns, gotchas, tips)

Additionally, check:
- Recent git log (last 10 commits) - run `git log --oneline -10`

### Step 2: Select Task

Use your judgment to pick the **best** task to work on now. Consider:

1. **In-progress tasks first**: If a task is already `in_progress`, continue and complete it
2. **Dependencies**: Some tasks depend on others - do prerequisites first
3. **Priority**: Higher priority tasks are generally more important
4. **Logical ordering**: What makes sense to build first? (e.g., core infrastructure before features that use it)
5. **Context from history**: What was recently worked on? Does something naturally follow?

If no pending/in_progress tasks remain, report completion and exit.

### Step 3: Work on Task - COMPLETE IT FULLY

- Update task status to `in_progress` in tasks.json
- **Complete the task fully** - do not leave it half-done
- Follow the project's coding standards (see CLAUDE.md)
- Run tests to verify your work
- Only mark as `blocked` if you genuinely cannot proceed (missing info, external dependency, etc.)

### Step 4: Update State

After completing work:
- Update task status in `ralph/tasks.json`:
  - `completed` if done (set completedAt to current timestamp)
  - `in_progress` if more work needed
  - `blocked` if stuck
- Add notes about what was done
- Append session summary to `ralph/history.md` including:
  - What was done
  - **Tips for the next developer** - gotchas, things to watch out for, context that would help
  - Any decisions made and why
- Update `ralph/learnings.md` if you discovered something permanently useful:
  - Patterns that work well in this codebase
  - Common pitfalls and how to avoid them
  - Useful commands or workflows
  - Architectural insights

### Step 5: Commit Changes

- Stage and commit all changes
- Use descriptive commit messages
- Reference the task ID in the commit message

### Step 6: Exit

Print "RALPH_SESSION_COMPLETE" on its own line when done. This signals the loop to restart.

## Important Rules

- **One task, completed fully**: Pick one task and finish it completely before the session ends
- **Use judgment for task selection**: Consider dependencies, logical ordering, and what makes sense - not just priority numbers
- **Never leave tasks half-done**: If you start a task, finish it. Only mark as `blocked` if truly stuck.
- **Always commit**: Leave the codebase in a clean, working state
- **Run tests**: Verify your changes work before committing
- **Update history**: Document what you did for future sessions

## Testing Requirements (MANDATORY)

### Integration/E2E Tests - MUST ADD
For **every** new feature or functionality:
- Add Playwright E2E tests in the appropriate demo app (`apps/demos/*/tests/e2e/`)
- Tests MUST verify all functionality works correctly
- Tests MUST cover both happy paths and edge cases
- Tests MUST pass before marking a task as complete
- Run `npm run test:e2e` to verify all tests pass

### Unit Tests - SHOULD ADD
Add unit tests with Vitest when:
- Implementing utility functions or business logic
- Working with data transformations or parsing
- Creating reusable helpers or algorithms
- The logic is complex enough to benefit from isolated testing

Place unit tests next to the source files: `*.test.ts` or `*.spec.ts`

### Regression Testing
- Before completing any task, run the full test suite
- If existing tests fail, fix them as part of the task
- Never commit with failing tests

## Example Session Output

```
Reading ralph/tasks.json...
Found 3 pending tasks.
Selecting task: fix-footer-alignment (priority: high)
Updating task status to in_progress...

Working on task...
[... work happens ...]

Task completed. Updating tasks.json...
Appending to history.md...
Committing changes...

RALPH_SESSION_COMPLETE
```

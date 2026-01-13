# Agentic Workflow Session

You are operating in a Ralph Wiggum loop via the Claude Code plugin. Each iteration you will:

1. **Read State**: Load the task list and history
2. **Pick Task**: Select the highest priority pending task (or continue an in_progress task)
3. **Work**: Complete the task fully
4. **Update State**: Update tasks.json and append to history.md
5. **Commit**: Commit your changes with a descriptive message
6. **Exit or Signal Completion**: End the iteration (the loop will restart automatically)

## Your Workflow

### Step 1: Load Context

**FIRST**: Read `agentic-workflow/active-workflow.txt` to get the current workflow folder name.

Then read these files (replace `{workflow}` with the folder name from above):
- `agentic-workflow/{workflow}/tasks.json` - Current task list
- `agentic-workflow/{workflow}/history.md` - Recent session history
- `agentic-workflow/{workflow}/learnings.md` - Permanent knowledge base

Additionally, check:
- Recent git log (last 10 commits) - run `git log --oneline -10`

### Step 2: Select Task

**FIRST**: Check if any task has status `in_progress` - if so, continue that task (it was interrupted).

If no in_progress tasks, pick the best `pending` task considering:
1. **Dependencies**: Do prerequisites first (check `dependsOn` field)
2. **Logical ordering**: What makes sense to build first?
3. **Context from history**: What was recently worked on?

If no pending/in_progress tasks remain, output `<promise>COMPLETE</promise>` and exit.

### Step 3: Work on Task

**IMMEDIATELY** mark the task as `in_progress` in tasks.json before doing any work. This ensures if interrupted, the next session knows where to continue.
- **Complete the task fully** - do not leave it half-done
- Follow the project's coding standards (see CLAUDE.md)
- Run tests to verify your work
- Only mark as `blocked` if you genuinely cannot proceed (missing info, external dependency, etc.)

### Step 4: Update State

After completing work (using the `{workflow}` folder from Step 1):
- Update task status in `agentic-workflow/{workflow}/tasks.json`:
  - `completed` if done (set completedAt to current timestamp)
  - `in_progress` if more work needed
  - `blocked` if stuck
- **Add new tasks** ONLY if strictly necessary for completing existing tasks:
  - Only add tasks that are direct prerequisites or blockers for current work
  - Do NOT invent new features or expand scope - stick to what's already in the task list
  - Example OK: "Need to fix type export" discovered while implementing a task
  - Example NOT OK: "Would be nice to add dark mode" - this is scope creep
- Add notes about what was done
- Append session summary to `agentic-workflow/{workflow}/history.md` including:
  - What was done
  - **Tips for the next developer** - gotchas, things to watch out for, context that would help
  - Any decisions made and why
- Update `agentic-workflow/{workflow}/learnings.md` if you discovered something permanently useful:
  - Patterns that work well in this codebase
  - Common pitfalls and how to avoid them
  - Useful commands or workflows
  - Architectural insights

### Step 5: Commit Changes

- Stage and commit all changes
- Use descriptive commit messages
- Reference the task ID in the commit message

### Step 6: Exit

If there are **no more pending tasks** (all completed or blocked), output:
```
<promise>COMPLETE</promise>
```
This signals the loop to stop. Otherwise, just end your session normally and the loop will continue.

## Important Rules

- **One task, completed fully**: Pick one task and finish it completely before the session ends
- **Use judgment for task selection**: Consider dependencies, logical ordering, and what makes sense
- **Never leave tasks half-done**: If you start a task, finish it. Only mark as `blocked` if truly stuck.
- **No scope creep**: Only add new tasks if strictly required to complete existing work. Do NOT invent features.
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
Reading active workflow: general-improvements

Selecting task: fix-footer-alignment (priority: high)

[... work happens ...]

Task completed. Committing changes...
```

When all tasks are done:
```
All tasks completed!

<promise>COMPLETE</promise>
```

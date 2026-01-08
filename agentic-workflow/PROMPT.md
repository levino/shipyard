# Agentic Workflow Template

This is a template for creating new workflow folders. To create a new workflow:

1. Create a new folder: `agentic-workflow/<workflow-name>/`
2. Copy this structure into it:
   - `PROMPT.md` - Copy from an existing workflow and update paths
   - `tasks.json` - Create with your tasks
   - `history.md` - Empty file for session history
   - `learnings.md` - Empty file for permanent knowledge

3. Update all paths in PROMPT.md to reference `agentic-workflow/<workflow-name>/`

4. Run the workflow:
   ```
   /ralph-loop @agentic-workflow/<workflow-name>/PROMPT.md --completion-promise "COMPLETE" --max-iterations 20
   ```

## Existing Workflows

- `general-improvements/` - Documentation and bug fix improvements

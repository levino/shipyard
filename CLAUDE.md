# shipyard - Claude Development Guide

This is a monorepo for shipyard, a general-purpose page builder for Astro. This guide provides Claude with essential information for working effectively with this codebase.

## Project Overview

**shipyard** is an Astro-based page builder that provides reusable components and layouts for creating documentation sites, blogs, and demo applications. It's built as a monorepo using npm workspaces.

- **Demo**: https://i18n.demos.shipyard.levinkeller.de/en/
- **License**: MIT
- **Main Author**: Levin Keller (@levino)

## Repository Structure

```
├── apps/
│   ├── demo/           # Demo application showcasing shipyard features
│   └── docs/           # Documentation site
├── packages/
│   ├── base/           # Core shipyard components and layouts
│   ├── blog/           # Blog-specific components
│   └── docs/           # Documentation-specific components
├── package.json        # Root package.json with workspaces config
├── biome.json         # Biome formatting and linting config
└── README.md          # Basic project information
```

## Tech Stack

- **Framework**: Astro 5.x
- **Styling**: Tailwind CSS with DaisyUI
- **Language**: TypeScript (strict mode)
- **Package Manager**: npm with workspaces
- **Testing**: Playwright (E2E)
- **Formatting & Linting**: Biome (semiColons: asNeeded, singleQuote: true)
- **Git Hooks**: Husky with pre-commit biome check

## Development Workflow

### Prerequisites
Before working with this codebase, ensure you have:
- Node.js and npm installed

### Common Commands

```bash
# Install dependencies and run allowed lifecycle scripts (run from root)
npm run setup

# Run demo app in development mode
cd apps/demo
npm run dev

# Run docs app in development mode
cd apps/docs
npm run dev

# Build demo app
cd apps/demo
npm run build

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Check and fix linting/formatting issues
npx biome check --write

# Check linting/formatting without fixing
npx biome check
```

### Code Style Guidelines

For comprehensive coding conventions, see the [Code Style Guide](apps/docs/docs/en/contributing/code-style.md).

**Key tooling:**

1. **Formatting & Linting**: Use Biome (configured in `biome.json`)
   - Run `npx @biomejs/biome@2.2.3 check --write .` before committing

2. **TypeScript**: Strict mode enabled with Astro's strictest TypeScript config

3. **Testing**: Playwright E2E tests verify all features
   - Run `npm run test:e2e` before pushing

**Package Structure**: Each package in `packages/` exports:
- Main entry point (`src/index.ts`)
- Astro-specific exports (`src/astro.ts`)
- Component and layout exports

## Package Details

### @levino/shipyard-base
Core package providing:
- Base layouts (Page, Splash, Markdown, Footer)
- Navigation components (including LanguageSwitcher for i18n)
- Utility functions
- Global CSS
- Configuration schemas

### @levino/shipyard-blog
Blog functionality:
- BlogEntry and BlogIndex components
- Blog-specific layouts

### @levino/shipyard-docs
Documentation features:
- DocsEntry components
- Documentation layouts
- Sidebar navigation utilities

## Important Notes for Claude

1. **Monorepo Structure**: This is a workspace-based monorepo. When making changes, consider impact across packages and apps.

2. **Git Operations (Merge, Rebase, etc.)**: Before performing git operations like merge or rebase, always unshallow the git clone first:
   ```bash
   git fetch --unshallow origin
   ```
   GitHub Actions typically use shallow clones for performance, which prevents proper git operations.

3. **Peer Dependencies**: Packages use peer dependencies for Astro, Tailwind, and DaisyUI. Check `peerDependencies` in package.json files.

4. **Testing**: E2E tests are located in `apps/demo/tests/e2e/` using Playwright.

5. **Build Process**: Each app can be built independently. No global build command is configured.

6. **Changesets**: The project uses `@changesets/cli` for version management.

7. **Git Hooks**: Lefthook is configured to run `biome check --write` on pre-commit to automatically fix linting/formatting issues.

8. **IMPORTANT - Run Biome Before Committing**: Always run `npx @biomejs/biome@2.2.3 check --write .` before committing to ensure linting passes. The CI uses biome version 2.2.3, so use this exact version to avoid schema mismatches.

9. **NPM Scripts Security**: This project uses `@lavamoat/allow-scripts` to disable npm lifecycle scripts by default for security. Use `npm run setup` instead of `npm install` to install dependencies and run allowed scripts. The allowlist is configured in `package.json` under `lavamoat.allowScripts`.

10. **IMPORTANT - Run E2E Tests Before Pushing**: Always run `npm run test:e2e` from the repository root before pushing changes to ensure all E2E tests pass. This runs Playwright tests for all demo apps and catches regressions early.

## Working with Components

- Astro components are in `packages/*/astro/` directories
- TypeScript utilities are in `packages/*/src/` directories
- Components use Tailwind CSS with DaisyUI for styling
- Export components through index files for clean imports

## Development Best Practices

1. **Test Changes**: Run the demo app to verify changes work correctly
2. **Cross-Package Impact**: Consider how changes in base packages affect apps
3. **Type Safety**: Maintain strict TypeScript compliance
4. **Component Design**: Follow existing patterns for consistency
5. **Lint Before Pushing**: Always run `npx biome check --write` before pushing changes to ensure code passes linting and formatting checks
6. **Documentation**: Update relevant README files when adding features
7. **Documentation Updates**: Always update the docs package (apps/docs) when:
   - Adding new features or components
   - Changing configuration schemas or APIs
   - Modifying existing functionality that affects users
   - The docs app contains the actual shipyard documentation, not just demos
8. **Changesets**: Create a changeset using `npx changeset` when making changes that affect packages:
   - Use patch version for bug fixes and minor improvements (especially in 0.x.y versions)
   - Use minor version for new features (when above 1.0.0)
   - Use major version for breaking changes (when above 1.0.0)
   - **Write user-centric descriptions**: Focus on what users can now do, not what code was changed
     - ✅ Good: "You can now host multiple documentation sections with custom URL paths"
     - ❌ Bad: "Added `DocsConfig` interface with `routeBasePath` option"
   - Explain the benefit and use case, not the implementation details
9. **Testing Requirements**: All new features require extensive testing:
   - Add Playwright E2E tests for user-facing features (in `apps/demos/*/tests/e2e/`)
   - Add unit tests with Vitest when appropriate for utility functions and business logic
   - Tests should cover both happy paths and edge cases
   - Run `npm run test:e2e` to verify all tests pass before submitting changes
10. **Docusaurus Counterpart Demos**: All shipyard demos have a corresponding Docusaurus counterpart:
    - Docusaurus demos contain the same content as shipyard demos
    - They are used to compare the output/behavior of Docusaurus vs shipyard for identical data
    - When updating a shipyard demo, always update the corresponding Docusaurus demo to keep them in sync
    - This ensures accurate framework comparison and helps identify feature parity gaps

## Troubleshooting

- If build fails, check that all peer dependencies are properly installed
- For styling issues, verify Tailwind and DaisyUI are properly configured
- Use the demo app as a testing ground for package changes

## Ralph Wiggum Loop

This project uses the **Ralph Wiggum technique** for autonomous, iterative AI development. Ralph is a bash loop that repeatedly feeds prompts to Claude, allowing complex tasks to be completed across multiple sessions.

### What is Ralph Wiggum?

The Ralph Wiggum approach prioritizes **iteration over perfection**. Instead of trying to complete everything perfectly in one attempt, the loop allows Claude to:
- Pick up where the previous session left off
- Self-correct through multiple iterations
- Build incrementally with verification at each step

### Ralph Folder Structure

```
ralph/
├── PROMPT.md          # Session instructions for Claude
├── tasks.json         # Current task list (pending/in_progress/completed)
├── tasks.schema.json  # JSON schema for tasks
├── learnings.md       # Permanent knowledge base (patterns, gotchas)
├── history.md         # Session history log
├── ralph.sh           # Main loop script (runs N iterations)
└── ralph-once.sh      # Single iteration script
```

### Running Ralph

```bash
# Run N iterations
./ralph/ralph.sh 5

# Or use the Claude Code plugin command
/ralph-wiggum:ralph-loop
```

### Ralph Workflow (Each Session)

1. **Read State**: Load tasks.json, history.md, learnings.md
2. **Pick Task**: Select highest priority pending task (or continue in_progress)
3. **Work**: Complete the task fully, run tests
4. **Update State**: Update tasks.json, append to history.md
5. **Commit**: Commit changes with descriptive message
6. **Exit**: End session (loop restarts or stops if all tasks complete)

### Key Rules

- **One task per session**: Pick one task and finish it completely
- **No scope creep**: Only add tasks if strictly required for current work
- **Always commit**: Leave codebase in clean, working state
- **Run tests**: Verify changes work before committing
- **Update learnings**: Document useful patterns for future sessions

### Completion Signal

When all tasks are done, output `<promise>COMPLETE</promise>` to stop the loop.

### When to Use Ralph

**Good for:**
- Well-defined tasks with automatic verification (tests, linters)
- Multi-step implementations that can be broken into discrete tasks
- Overnight automation of development work

**Not ideal for:**
- Subjective decisions requiring human judgment
- Production debugging
- Exploratory research

---

*This file helps Claude understand the shipyard codebase structure and development workflow. Keep it updated as the project evolves.*

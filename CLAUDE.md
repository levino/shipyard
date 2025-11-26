# Shipyard - Claude Development Guide

This is a monorepo for Shipyard, a general-purpose page builder for Astro. This guide provides Claude with essential information for working effectively with this codebase.

## Project Overview

**Shipyard** is an Astro-based page builder that provides reusable components and layouts for creating documentation sites, blogs, and demo applications. It's built as a monorepo using npm workspaces.

- **Demo**: https://shipyard-demo.levinkeller.de
- **License**: MIT
- **Main Author**: Levin Keller (@levino)

## Repository Structure

```
├── apps/
│   ├── demo/           # Demo application showcasing Shipyard features
│   └── docs/           # Documentation site
├── packages/
│   ├── base/           # Core Shipyard components and layouts
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

1. **Formatting & Linting**: Use Biome (configured in `biome.json`)
   - Semicolons as needed
   - Single quotes for JavaScript
   - Import organization enabled
   - Special rules for `.astro`, `.svelte`, and `.vue` files

2. **Variable Naming**: Always use descriptive, full-word variable names
   - Never use single letters or abbreviations like `e`, `i`, `arr`, `obj`
   - Use meaningful names that describe the purpose: `entryValue`, `index`, `itemList`, `configObject`
   - Exception: Standard conventions like `i`/`j` in simple loop counters are acceptable only when context is obvious

3. **TypeScript**: Strict mode enabled with Astro's strict TypeScript config

4. **Astro Components**: Follow Astro's component conventions
   - Use `.astro` extension for Astro components
   - TypeScript for logic, CSS for styling within components

5. **Package Structure**: Each package in `packages/` exports:
   - Main entry point (`src/index.ts`)
   - Astro-specific exports (`src/astro.ts`)
   - Component and layout exports

## Package Details

### @levino/shipyard-base
Core package providing:
- Base layouts (Page, Splash, Footer)
- Navigation components
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

2. **Peer Dependencies**: Packages use peer dependencies for Astro, Tailwind, and DaisyUI. Check `peerDependencies` in package.json files.

3. **Testing**: E2E tests are located in `apps/demo/tests/e2e/` using Playwright.

4. **Build Process**: Each app can be built independently. No global build command is configured.

5. **Changesets**: The project uses `@changesets/cli` for version management.

6. **Git Hooks**: Lefthook is configured to run `biome check --write` on pre-commit to automatically fix linting/formatting issues.

7. **IMPORTANT - Run Biome Before Committing**: Always run `npx @biomejs/biome@2.2.3 check --write .` before committing to ensure linting passes. The CI uses biome version 2.2.3, so use this exact version to avoid schema mismatches.

8. **NPM Scripts Security**: This project uses `@lavamoat/allow-scripts` to disable npm lifecycle scripts by default for security. Use `npm run setup` instead of `npm install` to install dependencies and run allowed scripts. The allowlist is configured in `package.json` under `lavamoat.allowScripts`.

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
   - The docs app contains the actual Shipyard documentation, not just demos
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
10. **Docusaurus Counterpart Demos**: All Shipyard demos have a corresponding Docusaurus counterpart:
    - Docusaurus demos contain the same content as Shipyard demos
    - They are used to compare the output/behavior of Docusaurus vs Shipyard for identical data
    - When updating a Shipyard demo, always update the corresponding Docusaurus demo to keep them in sync
    - This ensures accurate framework comparison and helps identify feature parity gaps

## Troubleshooting

- If build fails, check that all peer dependencies are properly installed
- For styling issues, verify Tailwind and DaisyUI are properly configured
- Use the demo app as a testing ground for package changes

---

*This file helps Claude understand the Shipyard codebase structure and development workflow. Keep it updated as the project evolves.*

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
# Install dependencies (run from root)
npm install

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

2. **TypeScript**: Strict mode enabled with Astro's strict TypeScript config

3. **Astro Components**: Follow Astro's component conventions
   - Use `.astro` extension for Astro components
   - TypeScript for logic, CSS for styling within components

4. **Package Structure**: Each package in `packages/` exports:
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

6. **Git Hooks**: Husky is configured to run `biome check --write` on pre-commit to automatically fix linting/formatting issues.

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
5. **Documentation**: Update relevant README files when adding features

## Troubleshooting

- If build fails, check that all peer dependencies are properly installed
- For styling issues, verify Tailwind and DaisyUI are properly configured
- Use the demo app as a testing ground for package changes

---

*This file helps Claude understand the Shipyard codebase structure and development workflow. Keep it updated as the project evolves.*

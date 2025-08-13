# Copilot Instructions for Shipyard

## Project Overview

Shipyard is an Astro-based documentation and blog framework built with
TypeScript. It provides reusable layouts, components, and utilities for building
documentation sites with blogs.

## Key Architecture

- **Monorepo structure**: Uses npm workspaces with packages and apps
- **Packages**:
  - `@levino/shipyard-base`: Core layouts, components, and utilities
  - `@levino/shipyard-blog`: Blog-specific functionality
  - `@levino/shipyard-docs`: Documentation-specific functionality
- **Apps**:
  - `demo`: Example implementation showcasing the framework
  - `docs`: Documentation for the framework itself

## Code Style Guidelines

- **Functions**: Prefer functional programming style over OOP
- **Comments**: Should be minimal and only used when necessary (comments should
  be apologies)
- **File organization**: Group related functionality in appropriate directories
  (e.g., utilities in `tools/`)
- **Naming**: Use clear, concise names (e.g., `getTitle` instead of
  `constructPageTitle`)

## Testing Strategy

- **Unit tests**: For isolated utility functions using Vitest
- **Integration tests**: Using Playwright for end-to-end testing of the demo app
- **Regression tests**: Ensure fixes don't break in the future

## Development Workflow

1. Make minimal, surgical changes to address specific issues
2. Test changes early and iteratively
3. Use existing tools and frameworks rather than reinventing
4. Validate with both unit and integration tests
5. **Always add changeset information** using `npx changeset add` for any
   changes that affect packages

## Pull Request Workflow

- **Open PRs as "ready for review"** by default rather than draft status
- Only use draft status for PRs with significant blocking issues that need
  resolution before review
- Avoid unnecessary friction in the review process

## CI/CD

- Uses GitHub Actions for linting, formatting, unit tests, and e2e tests
- Deno for linting and formatting
- Node.js for building and testing

## Common Patterns

- **Title handling**: Use `getTitle(siteTitle, pageTitle)` from `tools/title.ts`
- **Layouts**: Extend base layouts for consistent structure
- **Navigation**: Use configuration-driven navigation system

## When Working on Issues

1. Understand the current implementation first
2. Look for existing patterns to follow
3. Make the smallest possible change that fixes the issue
4. Add appropriate tests (both unit and integration when applicable)
5. Update documentation if changes affect public APIs

## Playwright Testing

- Tests are in `apps/demo/tests/` directory (moved from root level)
- Tests run against the demo app production build using `npm run preview`
- Focus on testing user-facing functionality and regression prevention
- Include tests for title handling, navigation, and core features

## Changesets

- **Always create changeset files** for any package changes using
  `npx changeset add`
- Changeset files document changes for versioning and release notes
- Use appropriate semver levels: `patch` for bug fixes, `minor` for features,
  `major` for breaking changes
- **User-focused descriptions**: Write changeset descriptions for users of the
  Shipyard framework, not developers
- Keep descriptions concise (one line preferred) and focus on user-facing
  benefits or fixes
- Avoid mentioning internal file structure, testing details, or implementation
  specifics
- Specify which packages are affected by the changes

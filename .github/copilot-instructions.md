# Shipyard - Astro Page Builder

Shipyard is a general purpose page builder for Astro applications, organized as a monorepo with multiple apps and reusable packages. Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Environment Setup
- **Automatic Setup**: Dependencies and tools are pre-installed via `.github/copilot-setup-steps.yml`
- **Manual Setup** (if needed): Run `npm ci` -- takes 8-90 seconds (first install longer). NEVER CANCEL. Set timeout to 300+ seconds.
- The install process includes husky git hooks setup automatically.

### Building Applications
- Build demo app: `cd apps/demo && npm run build` -- takes 4 seconds. Set timeout to 60+ seconds.
- Build docs app: `cd apps/docs && npm run build` -- takes 4 seconds. Set timeout to 60+ seconds.
- Both apps build to `dist/` directory with static site generation.

### Running Applications in Development
- Demo app: `cd apps/demo && npm run dev` -- starts in 1 second on http://localhost:4321
- Docs app: `cd apps/docs && npm run dev` -- starts in 1 second on http://localhost:4321
- Both apps use `--host 0.0.0.0` for external access and support live reloading.

### Testing
- Run all tests: `npm run test --workspaces --if-present` -- takes <1 second
- Run docs package tests: `cd packages/docs && npx vitest run` -- takes 0.5 seconds, runs 6 tests
- Only packages/docs currently has tests (vitest testing sidebar entry helpers)

### Linting and Formatting (Deno Pre-installed)
- **Setup**: Deno 2.0.0 is automatically installed via setup steps (may fail due to network restrictions in some environments)
- Lint code: `deno lint` -- works if Deno is available
- Format code: `deno fmt` -- works if Deno is available  
- Check formatting: `deno fmt --check` -- used in CI
- **Fallback**: If Deno installation fails locally, CI environment will have proper access

## Validation After Changes

### Required Manual Testing
After making changes, ALWAYS perform these validation steps:

1. **Build Validation**: Build both applications and verify no errors
   ```bash
   cd apps/demo && npm run build
   cd ../docs && npm run build
   ```

2. **Development Server Testing**: Start each app and verify it responds
   ```bash
   cd apps/demo && npm run dev &
   curl -I http://localhost:4321/
   # Should return HTTP 308 redirect to /de
   kill %1
   
   cd apps/docs && npm run dev &
   curl -I http://localhost:4321/
   # Should return HTTP 308 redirect to /en  
   kill %1
   ```

3. **Test Suite**: Run existing tests to ensure no regressions
   ```bash
   cd packages/docs && npx vitest run
   # Should pass all 6 tests
   ```

## Critical Timing and Timeout Information

- **Environment Setup**: Dependencies pre-installed via setup steps, manual `npm ci` takes 8-90 seconds if needed
- **NEVER CANCEL** long-running builds if they appear to hang -- apps build in 4 seconds but allow 60+ seconds timeout
- Test runs are very fast (1 second) but allow 30+ seconds timeout for safety  
- Dev server startup is immediate (1 second) but allow 30+ seconds for initialization

## Project Structure and Key Locations

### Applications (`apps/`)
- `apps/demo/` - Demo Astro application showcasing Shipyard components
- `apps/docs/` - Documentation Astro application 
- Both use Astro 5.1.5+ with Tailwind CSS and DaisyUI

### Packages (`packages/`)
- `packages/base/` - Core Shipyard components (@levino/shipyard-base)
- `packages/blog/` - Blog-related components (@levino/shipyard-blog)  
- `packages/docs/` - Documentation components (@levino/shipyard-docs)

### Important Files
- `package.json` - Root workspace configuration with npm workspaces
- `deno.json` - Deno configuration for formatting and linting
- `.github/workflows/checks.yml` - CI pipeline (Node.js 20, Deno 2.0.0)
- `.github/workflows/changeset.yml` - Release management with Changesets
- `packages/docs/src/sidebarEntries.test.ts` - Only test file in repository

### Configuration Files
- Uses npm workspaces for monorepo management
- Husky for git hooks (installed during `npm ci`)
- Changesets for version management and releases
- TypeScript configuration in each app/package

## CI/CD Pipeline

The CI expects these commands to succeed:
- `deno lint` -- requires Deno 2.0.0
- `deno fmt --check` -- requires Deno 2.0.0  
- `npm ci` -- installs dependencies
- `npm run test --workspaces --if-present` -- runs tests

Always ensure changes pass these checks before committing.

## Common Development Scenarios

### Adding New Components
- Components go in `packages/base/astro/components/`
- Update exports in `packages/base/src/index.ts`
- Test in demo app: `apps/demo/src/`

### Modifying Documentation
- Content files in `apps/docs/src/pages/`
- Blog posts in `apps/docs/blog/`
- Test changes with `cd apps/docs && npm run dev`

### Package Development
- Work in respective `packages/*/src/` directories
- Test in apps by rebuilding packages: `npm run build` in package directory
- Add tests to `packages/docs/` (only package with test infrastructure)

## Quick Command Reference

Frequently used commands with exact timings from validation:

```bash
# Environment setup (automated via .github/copilot-setup-steps.yml)
# Manual setup if needed: npm ci             # 8-90 seconds (first time longer)

# Build applications  
cd apps/demo && npm run build            # 4 seconds
cd apps/docs && npm run build            # 4 seconds

# Development servers
cd apps/demo && npm run dev              # 1 second startup
cd apps/docs && npm run dev              # 1 second startup

# Testing
npm run test --workspaces --if-present   # <1 second
cd packages/docs && npx vitest run       # 1 second, 6 tests

# Preview built apps
cd apps/demo && npm run preview          # Preview static build
cd apps/docs && npm run preview          # Preview static build
```

## Troubleshooting

### Environment Setup Issues
- Dependencies are auto-installed via `.github/copilot-setup-steps.yml`
- If setup steps fail, manually run `npm ci` (takes 8-90 seconds)
- Deno installation may fail in restricted networks - this is expected and documented

### Deno Installation Issues
- Setup steps handle Deno installation automatically where network allows
- If `deno` commands fail, this is expected in restricted environments
- CI environment will have proper network access for Deno installation

### Build Failures
- Most builds complete in 4 seconds - if longer, check for missing dependencies
- Run `npm ci` manually if packages are missing after setup steps
- Check for TypeScript errors in build output

### Port Conflicts
- Both demo and docs apps use port 4321 by default
- Only run one app at a time in development
- Apps will show "Local http://localhost:4321/" and "Network http://[IP]:4321/" when ready

### Expected Output Patterns

**Successful npm ci output:**
```
> prepare
> husky install || true
husky - Git hooks installed
added 548 packages, and audited 555 packages in 8s
```

**Successful app build output:**
```
[build] 7 page(s) built in 2.58s
[build] Complete!
```

**Successful dev server startup:**
```
astro  v5.1.5 ready in 800ms
┃ Local    http://localhost:4321/
┃ Network  http://10.1.0.154:4321/
watching for file changes...
```

**Successful test run:**
```
✓ src/sidebarEntries.test.ts (6 tests) 5ms
Test Files  1 passed (1)
Tests  6 passed (6)
```
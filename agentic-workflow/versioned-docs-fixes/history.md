# Session History

## 2026-01-08 - Initial Setup

Created tasks to get the `feature/versioned-docs` branch ready for merge after resolving conflicts with main.

## 2026-01-08 - Session 1: fix-ci-workflow-paths

**Task completed**: Fixed CI workflow to use correct demo paths.

Changed `single-language` to `single-locale` in `.github/workflows/checks.yml` matrix (name and path fields).

## 2026-01-08 - Session 2: fix-build-errors

**Task completed**: Fixed all build errors.

The build was failing with `docsSchema.extend is not a function`. This happened because `docsSchema` had `.transform().refine()` applied, which returns a `ZodEffects` instead of `ZodObject`. `ZodEffects` doesn't have `.extend()`.

**Fix**: Extracted the base object schema (`docsSchemaBase`) before applying transforms. Created reusable `docsSchemaTransform` and `docsSchemaRefinement` that are applied to both `docsSchema` and `versionedDocsSchema`.

All 4 demos now build successfully: i18n, single-locale, versioned-docs, versioned-i18n.

# Funky Tests

Tests that need review to determine if the test or the code should be changed.

## multi-docs.spec.ts:78 - sidebar_position controls item order in guides

**Test:** `sidebar_position controls item order in guides`
**Location:** `apps/demos/i18n/tests/e2e/multi-docs.spec.ts:78`

**Problem:** The test expects sidebar items to be ordered by `sidebar_position` frontmatter:
- index.md (position 1) → first
- getting-started.md (position 2) → second
- advanced-techniques.md (position 3) → third

**Actual behavior:** The built sidebar shows:
1. `/en/guides/` (index)
2. `/en/guides/advanced-techniques`
3. `/en/guides/getting-started`

The sidebar appears to be sorting alphabetically instead of by `sidebar_position` for the guides docs instance.

**Investigation needed:**
1. Check if `sidebar_position` is being read correctly from standalone .md files (not nested in folders)
2. Check if the guides docs instance is configured correctly to respect `sidebar_position`
3. Compare with how the main docs instance handles `sidebar_position`

**Additional notes:**
- The test uses CSS selector `.drawer-side a[href*="/guides/"]` which should be converted to data-testid
- But the underlying behavior seems to be a bug, not a test issue

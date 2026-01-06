---
title: Code Style Guide
sidebar_position: 1
sidebar_label: Code Style
description: Comprehensive coding conventions for shipyard contributors
---

# Code Style Guide

This guide establishes the coding conventions for the shipyard project. It serves as the authoritative reference for code quality and consistency, ensuring that all contributors—whether human developers or AI assistants—follow the same patterns and practices.

## Purpose and Audience

This style guide is intended for:

- **New contributors** joining the shipyard project who need to understand expected coding patterns
- **AI assistants** (such as Claude) when helping with code changes and reviews
- **Maintainers** performing code reviews to ensure consistency
- **All developers** as a reference when making architectural or implementation decisions

By following these conventions, we maintain a codebase that is readable, maintainable, and consistent across all packages and applications.

## How to Use This Guide

Each section covers a specific aspect of the shipyard coding philosophy. When writing or reviewing code:

1. Refer to the relevant section for guidance on specific patterns
2. Follow the "Correct" examples and avoid the "Avoid" patterns
3. When in doubt, prioritize code clarity and consistency with existing patterns
4. Use the quick reference table below for a summary of key principles

## Quick Reference

| Topic | Key Point |
|-------|-----------|
| [Functional Programming](#functional-programming-principles) | Write pure functions with explicit inputs and outputs; avoid mutations and side effects |
| [Naming Conventions](#naming-conventions) | Use descriptive, full-word names that make code self-documenting |
| [Documentation Through Code](#documentation-through-code) | Let clear names and TypeScript types serve as documentation; avoid JSDoc comments |
| [Web Components and Native APIs](#web-components-and-native-apis) | Use custom elements and native browser APIs instead of frameworks for interactivity |
| [Integration Testing](#integration-testing-requirements) | Every feature requires meaningful tests using demo apps as fixtures |
| [Effect-TS Usage](#effect-ts-library-usage) | Use Effect for functional pipes, compositions, and option handling |
| [TypeScript Standards](#typescript-standards) | Write all code in strict TypeScript; types are living documentation |
| [Astro Content Loaders](#astro-content-loaders) | Use Astro content collections instead of direct file system access |

---

## Functional Programming Principles

shipyard follows functional programming principles to create predictable, testable, and maintainable code. These patterns are used throughout the codebase, particularly in utility functions and data transformations.

### Pure Functions

Write functions with explicit inputs and outputs that always return the same result for the same arguments. Pure functions have no side effects and do not depend on external state.

**Correct:**

```typescript
const createLeafNode = (key: string, doc: DocsData): TreeNode => ({
  key,
  label: doc.sidebarLabel ?? doc.title ?? key,
  href: doc.link !== false ? doc.path : undefined,
  position: doc.sidebarPosition ?? DEFAULT_POSITION,
  className: doc.sidebarClassName,
  children: {},
})
```

**Avoid:**

```typescript
let nodeCount = 0
let currentDoc: DocsData | null = null

const createLeafNode = (key: string, doc: DocsData): TreeNode => {
  nodeCount++ // Side effect: modifying external state
  currentDoc = doc // Side effect: mutating external variable
  return {
    key,
    label: doc.sidebarLabel ?? doc.title ?? key,
    // ...
  }
}
```

### Immutability

Avoid mutating function arguments or external state. Instead, create new data structures using spread operators, `Object.fromEntries`, or array methods that return new arrays.

**Correct:**

```typescript
const mergeNodeWithDoc = (node: TreeNode, doc: DocsData): TreeNode => ({
  ...node,
  label: doc.sidebarLabel ?? doc.title ?? node.label,
  href: doc.link !== false ? doc.path : node.href,
  position: doc.sidebarPosition ?? node.position,
  className: doc.sidebarClassName ?? node.className,
})

const insertAtPath = (
  root: Readonly<Record<string, TreeNode>>,
  pathParts: readonly string[],
  doc: DocsData,
): Readonly<Record<string, TreeNode>> => {
  // ...
  return { ...root, [head]: newNode } // Creates new object instead of mutating
}
```

**Avoid:**

```typescript
const mergeNodeWithDoc = (node: TreeNode, doc: DocsData): TreeNode => {
  node.label = doc.sidebarLabel ?? doc.title ?? node.label // Mutating input!
  node.href = doc.link !== false ? doc.path : node.href // Mutating input!
  return node
}

const insertAtPath = (
  root: Record<string, TreeNode>,
  pathParts: string[],
  doc: DocsData,
): Record<string, TreeNode> => {
  root[head] = newNode // Mutating input!
  return root
}
```

### Function Composition

Build complex functionality by composing smaller, focused functions. Each function should do one thing well, and larger operations should combine these smaller pieces.

**Correct:**

```typescript
// Small, focused functions
const parseDocPath = (id: string): readonly string[] => {
  const cleanId = id.replace(/\.[^/.]+$/, '')
  const parts = cleanId.split('/')
  const filename = parts[parts.length - 1]
  return filename === 'index' ? parts.slice(0, -1) : parts
}

const sortByPositionThenLabel = (
  nodes: readonly TreeNode[],
): readonly TreeNode[] =>
  [...nodes].sort((a, b) =>
    a.position !== b.position
      ? a.position - b.position
      : a.label.localeCompare(b.label),
  )

// Composed into larger operation
export const toSidebarEntries = (docs: readonly DocsData[]): Entry => {
  const rootTree = docs.reduce<Readonly<Record<string, TreeNode>>>(
    (acc, doc) => insertAtPath(acc, parseDocPath(doc.id), doc),
    {},
  )

  const sortedNodes = sortByPositionThenLabel(Object.values(rootTree))

  return Object.fromEntries(
    sortedNodes.map((node) => [node.key, treeNodeToEntry(node)]),
  )
}
```

**Avoid:**

```typescript
// One large function doing everything
export const toSidebarEntries = (docs: DocsData[]): Entry => {
  const result: Record<string, any> = {}

  for (const doc of docs) {
    // Parse path inline
    const cleanId = doc.id.replace(/\.[^/.]+$/, '')
    const parts = cleanId.split('/')
    // Insert logic inline
    let current = result
    for (const part of parts) {
      if (!current[part]) {
        current[part] = { children: {} }
      }
      current = current[part].children
    }
    // Sort logic mixed in
    // ... hundreds more lines
  }

  return result
}
```

### Side Effect Isolation

Keep side effects (I/O operations, API calls, DOM manipulation) at the boundaries of the application. In shipyard, this means:

- Pure TypeScript utility functions in `src/` directories handle data transformations
- Astro components (`.astro` files) handle I/O operations like fetching content and rendering

**Correct:**

```typescript
// Pure utility function (packages/docs/src/sidebarEntries.ts)
export const toSidebarEntries = (docs: readonly DocsData[]): Entry => {
  // Pure transformation - no I/O, no side effects
  const rootTree = docs.reduce(/* ... */)
  return Object.fromEntries(/* ... */)
}
```

```astro
---
// Astro component handles I/O at the boundary (packages/docs/astro/Layout.astro)
import { getCollection, render } from 'astro:content'
import { toSidebarEntries } from '../src/sidebarEntries'

// I/O happens here at the component boundary
const docs = await getCollection(collectionName)
const processedDocs = await Promise.all(docs.map(async (doc) => ({
  id: doc.id,
  title: doc.data.title,
  // ...
})))

// Pure function is called with the fetched data
const entries = toSidebarEntries(processedDocs)
---
```

**Avoid:**

```typescript
// Utility function that performs I/O
export const toSidebarEntries = async (collectionName: string): Promise<Entry> => {
  const docs = await getCollection(collectionName) // I/O inside utility!
  // ...
}
```

---

## Naming Conventions

Clear, descriptive names are essential for maintaining a readable codebase. Names should make code self-documenting, reducing the need for comments and making the codebase accessible to new contributors.

### Variable Names

Use descriptive, full-word names that convey the purpose of the variable. Names should be meaningful enough that a reader can understand the variable's role without additional context.

**Correct:**

```typescript
const normalizedCurrentPath = normalizePath(currentPath)
const sidebarLinks = page.locator('.drawer-side a')
const docsConfig = docsConfigs[normalizedBasePath]
const flattenedEntries = flattenSidebarEntries(sidebarEntries)
const currentIndex = flatPages.findIndex(/* ... */)
```

**Avoid:**

```typescript
const p = normalizePath(path) // Too short, unclear purpose
const sl = page.locator('.drawer-side a') // Abbreviation
const dc = docsConfigs[nbp] // Multiple unclear abbreviations
const fe = flattenSidebarEntries(se) // Cryptic names
const i = flatPages.findIndex(/* ... */) // Single letter for non-trivial use
```

### Function Names

Function names should describe what the function does or what it returns. Use verbs for functions that perform actions and noun phrases for functions that compute or return values.

**Correct:**

```typescript
// Verb phrases for actions
const normalizePath = (path: string): string => { /* ... */ }
const flattenSidebarEntries = (entries: Entry): FlattenedEntry[] => { /* ... */ }
const insertAtPath = (root, pathParts, doc) => { /* ... */ }

// Descriptive names for what is returned
const createLeafNode = (key: string, doc: DocsData): TreeNode => { /* ... */ }
const getPaginationInfo = (currentPath, sidebarEntries, allDocs) => { /* ... */ }
const sortByPositionThenLabel = (nodes: TreeNode[]): TreeNode[] => { /* ... */ }
```

**Avoid:**

```typescript
const norm = (p: string): string => { /* ... */ } // Unclear abbreviation
const process = (entries: Entry) => { /* ... */ } // Vague action
const doStuff = (root, parts, doc) => { /* ... */ } // Meaningless name
const handle = (key, doc) => { /* ... */ } // Generic, uninformative
```

### Prohibited Patterns

The following naming patterns are prohibited in the shipyard codebase:

- **Single-letter variable names** (except in allowed exceptions below)
- **Unclear abbreviations** like `cfg`, `opts`, `val`, `tmp`, `ret`
- **Generic names** like `data`, `item`, `thing`, `stuff`, `result` without context
- **Hungarian notation** like `strName`, `arrItems`, `objConfig`
- **Numbered variables** like `item1`, `item2`, `value3`

### Allowed Exceptions

Loop counters in simple, short iterations where the context is obvious:

```typescript
// Acceptable: Simple loop with obvious context
for (let index = 0; index < items.length; index++) {
  const item = items[index]
  // ...
}

// Also acceptable in very short, simple loops
nodes.forEach((node, index) => {
  result[index] = transform(node)
})
```

However, prefer descriptive names when the loop body is complex or when iterating over domain objects:

```typescript
// Preferred: Descriptive even in loops
for (const sidebarEntry of sidebarEntries) {
  processEntry(sidebarEntry)
}

flatPages.forEach((pageEntry, pageIndex) => {
  if (pageIndex > 0) {
    pageEntry.prev = flatPages[pageIndex - 1]
  }
})
```

### Self-Documenting Code

Names should make code self-documenting. When code reads like prose, comments become unnecessary.

**Self-documenting (no comment needed):**

```typescript
const isIndexPage =
  currentIndex === -1 &&
  currentDoc &&
  (docIdParts.length === 1 || lastIdPart === 'index' || lastIdPart === '')

if (isIndexPage) {
  // Handle index page pagination
}
```

**Needs refactoring (comment suggests unclear code):**

```typescript
// Check if this is an index page
const flag = idx === -1 && doc && (parts.length === 1 || lp === 'index' || lp === '')

if (flag) {
  // ...
}
```

When you feel the need to add a comment explaining what code does, consider whether better naming would eliminate that need.

---

## Documentation Through Code

shipyard follows a "documentation through code" philosophy. Rather than relying on comments that can become stale, we write code that documents itself through clear naming, strong typing, and explicit structure.

### No JSDoc Policy

JSDoc comments are not used in this project. Instead of documenting code with comments, we express intent through:

- **Clear, descriptive names** for variables, functions, and types
- **TypeScript type annotations** that describe data shapes and contracts
- **Small, focused functions** with single responsibilities
- **Explicit function signatures** with meaningful parameter and return types

### Why Comments Become Problematic

Comments often describe "what" the code does rather than "why," and they frequently become outdated as code evolves:

```typescript
// BAD: This comment duplicates what the code already says
// Get the sidebar label from the document, falling back to title, then key
const label = doc.sidebarLabel ?? doc.title ?? key
```

The code above already clearly expresses its logic. The comment adds no value and creates maintenance burden—if the logic changes, the comment must also be updated (but often is not).

### Alternatives to Comments

Instead of adding comments, improve the code itself:

**Use descriptive variable names:**

```typescript
// Instead of:
const l = doc.sidebarLabel ?? doc.title ?? key // label for sidebar

// Write:
const displayLabel = doc.sidebarLabel ?? doc.title ?? key
```

**Use TypeScript types to document structure:**

```typescript
// Types document the shape of data better than comments
interface TreeNode {
  readonly key: string
  readonly label: string
  readonly href?: string
  readonly position: number
  readonly className?: string
  readonly children: Readonly<Record<string, TreeNode>>
}
```

**Extract complex conditions into well-named variables:**

```typescript
// Instead of:
// Check if current page is an index page (not in sidebar, doc exists, id pattern matches)
if (currentIndex === -1 && currentDoc && (docIdParts.length === 1 || lastIdPart === 'index')) {

// Write:
const isIndexPage =
  currentIndex === -1 &&
  currentDoc &&
  (docIdParts.length === 1 || lastIdPart === 'index' || lastIdPart === '')

if (isIndexPage) {
```

**Use function extraction to name complex operations:**

```typescript
// Instead of inline logic with comments:
// Normalize path by removing trailing slashes except for root
const normalized = path === '/' ? path : path.replace(/\/+$/, '')

// Extract to a named function:
const normalizePath = (path: string): string => {
  if (path === '/') return path
  return path.replace(/\/+$/, '')
}

const normalized = normalizePath(path)
```

### When Comments May Be Appropriate

Comments are acceptable in limited circumstances:

1. **Explaining "why" not "what"**: When the reason for a particular approach is not obvious from the code itself

   ```typescript
   // Pagination must be computed BEFORE adding llms.txt to avoid including it in prev/next navigation
   const pagination = getPaginationInfo(Astro.url.pathname, entries, docs)
   ```

2. **External constraints or quirks**: When code works around a bug or limitation in an external library or API

   ```typescript
   // Astro Container API requires explicit await even for sync components
   const container = await AstroContainer.create()
   ```

3. **Complex algorithms**: When implementing a well-known algorithm where a reference would be helpful

4. **Regulatory or legal requirements**: When comments are required for compliance purposes

Even in these cases, prefer making the code as self-explanatory as possible first.

---

## Web Components and Native APIs

When building interactive features in shipyard, we use web components (custom elements) and native browser APIs rather than JavaScript frameworks. This approach aligns with Astro's philosophy of shipping minimal JavaScript and provides better performance and maintainability.

### Preferred Approach: Custom Elements

Web components and custom elements are the preferred approach for client-side interactivity. They integrate seamlessly with Astro's component model and require no additional runtime.

**Example from shipyard codebase:**

```astro
---
// LlmsTxtSidebarLabel.astro
interface Props {
  href: string
}

const { href } = Astro.props
---

<llms-txt-label data-href={href}>
  <span class="flex items-center justify-between gap-1">
    <a href={href}>llms.txt</a>
    <button
      type="button"
      class="btn btn-ghost btn-xs p-0.5"
      title="Copy URL to clipboard"
      aria-label="Copy URL to clipboard"
    >
      <!-- SVG icon -->
    </button>
  </span>
</llms-txt-label>

<script>
  class LlmsTxtLabel extends HTMLElement {
    connectedCallback() {
      const href = this.dataset.href
      if (!href) return

      const button = this.querySelector('button')
      if (!button) return

      button.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()

        const fullUrl = new URL(href, window.location.origin).toString()
        try {
          await navigator.clipboard.writeText(fullUrl)
          button.classList.add('text-success')
          setTimeout(() => button.classList.remove('text-success'), 1500)
        } catch (error) {
          console.error('Failed to copy URL:', error)
        }
      })
    }
  }

  customElements.define('llms-txt-label', LlmsTxtLabel)
</script>
```

### Framework Restrictions

Do not use the following for interactive components in shipyard:

- **React** / **Preact**
- **Svelte**
- **Vue**
- **jQuery**
- **Other JavaScript UI frameworks**

These frameworks add runtime overhead, increase bundle sizes, and complicate the build process. Astro's strength is shipping HTML with minimal JavaScript—frameworks work against this goal.

### Benefits of Native Browser APIs

Using web components and native APIs provides several advantages for shipyard:

1. **Smaller bundle sizes**: No framework runtime to ship to clients
2. **Better Astro integration**: Custom elements work naturally with Astro's HTML-first approach
3. **Progressive enhancement**: Components can work without JavaScript and enhance when it loads
4. **No hydration complexity**: Avoids the complexity of partial hydration strategies
5. **Future-proof**: Web standards are stable and widely supported
6. **Simpler debugging**: Browser DevTools understand native elements natively

### Creating Custom Elements in Astro

When creating interactive components in Astro:

1. **Define the component structure in the Astro template**:
   - Use a custom element tag name (must contain a hyphen)
   - Pass data via `data-*` attributes

2. **Add the script within the same `.astro` file**:
   - Define a class extending `HTMLElement`
   - Implement `connectedCallback()` for initialization
   - Register with `customElements.define()`

3. **Use native APIs for interactivity**:
   - `addEventListener` for events
   - `querySelector` / `querySelectorAll` for DOM queries
   - `classList` for class manipulation
   - `navigator.clipboard` for clipboard operations
   - `fetch` for network requests

**Pattern:**

```astro
---
interface Props {
  initialValue: string
}

const { initialValue } = Astro.props
---

<my-interactive-widget data-initial={initialValue}>
  <button type="button">Click me</button>
  <output></output>
</my-interactive-widget>

<script>
  class MyInteractiveWidget extends HTMLElement {
    connectedCallback() {
      const initialValue = this.dataset.initial
      const button = this.querySelector('button')
      const output = this.querySelector('output')

      if (!button || !output) return

      button.addEventListener('click', () => {
        output.textContent = `Value: ${initialValue}`
      })
    }
  }

  customElements.define('my-interactive-widget', MyInteractiveWidget)
</script>
```

### Consistency with Existing Patterns

If you encounter framework code already in the codebase, maintain consistency with those existing patterns within that specific area. However, for new interactive features, always prefer the web components approach described above.

---

## Integration Testing Requirements

Every feature in shipyard requires meaningful integration tests. Tests verify that features work correctly in real-world scenarios and catch regressions as the codebase evolves.

### Feature Completeness

A feature is not considered complete until it has tests that verify its behavior. This applies to:

- New components and layouts
- Configuration options
- Interactive features
- API changes
- Bug fixes (regression tests)

### Demo Apps as Test Fixtures

shipyard uses demo applications as both example usages and test fixtures. Demo apps in `apps/demos/` serve dual purposes:

1. **Documentation**: Show users how to use shipyard features
2. **Test fixtures**: Provide realistic content for E2E tests to verify

Tests run against built demo apps to verify that features work correctly in actual usage scenarios.

**Project structure:**

```
apps/demos/
  i18n/                    # Internationalization demo
    tests/e2e/            # E2E tests for this demo
      docs-plugin-features.spec.ts
      blog-plugin-features.spec.ts
      ...
  single-language/         # Single language demo
    tests/e2e/
      ...
  server-mode/            # SSR demo
    tests/e2e/
      ...
```

### Test Structure

Tests use Playwright and follow this structure:

```typescript
import { expect, test } from '@playwright/test'

test.describe('Feature Category', () => {
  test.describe('Specific Functionality', () => {
    test('describes expected behavior', async ({ page }) => {
      await page.goto('/en/docs/')

      // Arrange: Set up the test conditions
      const element = page.locator('.target-element')

      // Assert: Verify the expected behavior
      await expect(element).toBeAttached()
      await expect(element).toContainText('Expected content')
    })
  })
})
```

### Element Selection with Data Attributes

Use data attributes and semantic selectors to query markup in tests. This makes tests more resilient to styling changes.

**Correct:**

```typescript
// Data attributes and semantic selectors
const editLink = page.locator('a.edit-link')
const lastUpdated = page.locator('.last-updated')
const metadata = page.locator('.doc-metadata')
const sidebar = page.locator('.drawer-side ul.menu')

// Attribute selectors for specific elements
const docLink = page.locator('.drawer-side a[href="/en/docs/garden-beds"]')
const metaDescription = page.locator('meta[name="description"]')
```

**Avoid:**

```typescript
// Brittle text-based selection that breaks with content changes
const editLink = page.locator('a:has-text("Edit this page")')

// Overly specific selectors tied to implementation details
const link = page.locator('div > div > ul > li:nth-child(3) > a')

// Magic indices without context
const thirdItem = page.locator('a').nth(2)
```

### Testing Behavior, Not Implementation

Focus on testing what the feature does from a user perspective, not how it is implemented internally.

**Correct (testing behavior):**

```typescript
test('active page is highlighted in sidebar', async ({ page }) => {
  await page.goto('/en/docs/garden-beds')

  const activeLink = page.locator(
    '.drawer-side a[href="/en/docs/garden-beds"].font-medium.text-primary',
  )
  await expect(activeLink).toBeAttached()
})

test('sidebar_position controls item order', async ({ page }) => {
  await page.goto('/en/docs/sidebar-demo/')

  const sidebarLinks = page.locator(
    '.drawer-side a[href*="/en/docs/sidebar-demo/"]',
  )
  const hrefs: string[] = []
  const count = await sidebarLinks.count()
  for (let index = 0; index < count; index++) {
    const href = await sidebarLinks.nth(index).getAttribute('href')
    if (href && !href.endsWith('sidebar-demo/')) {
      hrefs.push(href)
    }
  }

  // custom-class (position 10) should come before custom-label (position 30)
  expect(hrefs[0]).toContain('custom-class')
  expect(hrefs[1]).toContain('custom-label')
})
```

**Avoid (testing implementation):**

```typescript
// Testing internal data structures instead of user-visible behavior
test('sidebar entries are sorted correctly', async () => {
  const entries = toSidebarEntries(docs)
  expect(entries['item1'].position).toBe(10)
  expect(entries['item2'].position).toBe(20)
})
```

### Running Tests

Run the full E2E test suite before pushing changes:

```bash
# From repository root
npm run test:e2e

# Or run tests for a specific demo
cd apps/demos/i18n
npx playwright test
```

---

## Effect-TS Library Usage

shipyard uses [Effect-TS](https://effect.website/) for functional programming utilities, particularly for array operations, option handling, and functional compositions. Effect provides a consistent, type-safe API for common operations.

### Purpose

Effect is used in shipyard for:

- **Functional array operations**: `Array.map`, `Array.findFirst`, `Array.filter`
- **Option handling**: Working with values that may or may not exist
- **Pipes and compositions**: Chaining operations in a readable, functional style

### Common Patterns

#### Array Operations

Use Effect's `Array` module for functional transformations:

```typescript
import { Array as EffectArray } from 'effect'

// Mapping over arrays
const processedDocs = await getCollection(collectionName)
  .then(
    EffectArray.map(async (doc) => ({
      id: doc.id,
      title: doc.data.title,
      path: getPath(doc.id),
    })),
  )
  .then((promises) => Promise.all(promises))
```

#### Finding Elements with Option

Use `Array.findFirst` with `Option.getOrUndefined` to safely find elements:

```typescript
import { Array as EffectArray, Option } from 'effect'

// Finding first matching element with safe fallback
const firstH1 = Option.getOrUndefined(
  EffectArray.findFirst(
    headings,
    ({ depth }) => depth === 1,
  ),
)

// Using the result with optional chaining
const title = firstH1?.text ?? defaultTitle
```

#### Combining with Nullish Coalescing

Effect's Option works well with TypeScript's nullish coalescing for fallback chains:

```typescript
const title =
  label ??
  title ??
  Option.getOrUndefined(
    EffectArray.findFirst(
      (await render(doc)).headings,
      ({ depth }) => depth === 1,
    ),
  )?.text ??
  id
```

### When to Use Effect

Use Effect patterns when:

- **Transforming collections**: Mapping, filtering, or reducing arrays
- **Handling optional values**: When a value may or may not exist and you need safe access
- **Composing operations**: When you need to chain multiple transformations

### Import Convention

Import Effect modules with clear aliases to avoid conflicts with native JavaScript:

```typescript
// Correct: Aliased import to avoid confusion with native Array
import { Array as EffectArray, Option } from 'effect'

// Then use:
EffectArray.map(items, transform)
EffectArray.findFirst(items, predicate)
Option.getOrUndefined(optionValue)
```

### Error Handling

Effect provides typed error handling through its `Either` and `Effect` types. When working with operations that can fail:

```typescript
import { Effect, Either } from 'effect'

// Effect's Either for explicit success/failure
const result = Either.try(() => JSON.parse(jsonString))

if (Either.isRight(result)) {
  // Handle success
  const parsed = result.right
} else {
  // Handle failure
  const error = result.left
}
```

### Asynchronous Workflows

For complex async workflows, Effect's `Effect` type can manage async operations with proper error handling:

```typescript
import { Effect } from 'effect'

const program = Effect.tryPromise({
  try: () => fetch(url).then((response) => response.json()),
  catch: (error) => new FetchError(error),
})
```

However, for simple async operations in shipyard, standard `async/await` with `Promise.all` is often sufficient and preferred for simplicity.

---

## TypeScript Standards

All code in shipyard must be written in TypeScript. TypeScript provides type safety, better tooling support, and serves as living documentation for the codebase.

### Strict Mode Required

shipyard uses Astro's strictest TypeScript configuration. The root `tsconfig.json` extends `astro/tsconfigs/strictest`, which enables:

- `strict: true` - Enables all strict type checking options
- `noUncheckedIndexedAccess: true` - Adds `undefined` to index signatures
- `exactOptionalPropertyTypes: true` - Distinguishes between `undefined` and missing properties
- Other strict checks for maximum type safety

This configuration catches many common errors at compile time rather than runtime.

### Types as Living Documentation

Types document the shape of data better than comments, and they stay in sync with the code automatically:

```typescript
// Interface documents the structure clearly
interface TreeNode {
  readonly key: string
  readonly label: string
  readonly href?: string
  readonly position: number
  readonly className?: string
  readonly children: Readonly<Record<string, TreeNode>>
}

// Function signature documents inputs and outputs
const createLeafNode = (key: string, doc: DocsData): TreeNode => ({
  // ...
})
```

When you need to understand what a function accepts or returns, look at its type signature first.

### Type Inference vs Explicit Types

TypeScript's type inference is powerful. Use it when the type is obvious from context:

**Let inference work:**

```typescript
// Inference: type is clearly string
const normalizedPath = path.replace(/\/+$/, '')

// Inference: type is obvious from the return
const items = [1, 2, 3].map((item) => item * 2)

// Inference: type is clear from the literal
const DEFAULT_POSITION = Number.POSITIVE_INFINITY
```

**Add explicit types when they add clarity:**

```typescript
// Explicit return type documents the contract
const createLeafNode = (key: string, doc: DocsData): TreeNode => ({
  // ...
})

// Explicit type for complex objects
const config: DocsConfig = {
  collectionName: 'docs',
  editUrl: 'https://github.com/...',
}

// Explicit type for function parameters
const processDoc = (doc: DocsData): ProcessedDoc => {
  // ...
}

// Explicit type for reduce accumulator
const rootTree = docs.reduce<Readonly<Record<string, TreeNode>>>(
  (acc, doc) => insertAtPath(acc, parseDocPath(doc.id), doc),
  {},
)
```

### Avoiding `any`

The `any` type defeats the purpose of TypeScript. Avoid it:

**Avoid:**

```typescript
const processData = (data: any) => {
  return data.someProperty // No type safety!
}

const items: any[] = fetchItems() // Loses all type information
```

**Use proper types instead:**

```typescript
// Use the actual type
const processData = (data: DocsData) => {
  return data.title
}

// Use generics when type varies
const processItems = <T>(items: T[], transform: (item: T) => T): T[] => {
  return items.map(transform)
}

// Use unknown for truly unknown data, then narrow
const parseJson = (jsonString: string): unknown => {
  return JSON.parse(jsonString)
}

const data = parseJson(input)
if (isDocsData(data)) {
  // Now TypeScript knows it's DocsData
  console.log(data.title)
}
```

### Type Guards

When working with unknown data, use type guards to narrow types safely:

```typescript
// Type guard function
const isDocsData = (value: unknown): value is DocsData => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value &&
    typeof (value as DocsData).id === 'string' &&
    typeof (value as DocsData).title === 'string'
  )
}

// Using the type guard
const processUnknownData = (data: unknown) => {
  if (isDocsData(data)) {
    // TypeScript knows data is DocsData here
    return data.title
  }
  throw new Error('Invalid data format')
}
```

### Readonly Types

Use `readonly` and `Readonly<T>` to enforce immutability at the type level:

```typescript
interface TreeNode {
  readonly key: string
  readonly label: string
  readonly children: Readonly<Record<string, TreeNode>>
}

const insertAtPath = (
  root: Readonly<Record<string, TreeNode>>,
  pathParts: readonly string[],
  doc: DocsData,
): Readonly<Record<string, TreeNode>> => {
  // ...
}
```

---

## Astro Content Loaders

shipyard uses Astro's content collections system for loading and processing content. Direct file system access should be avoided in favor of content loaders, which provide type safety, caching, and consistent processing.

### Avoid Direct File System Access

Do not use Node.js file system APIs (`fs`, `path`) to read content files directly:

**Avoid:**

```typescript
import { readFile } from 'fs/promises'
import { join } from 'path'

// Direct file access - don't do this for content
const content = await readFile(join(process.cwd(), 'docs', 'page.md'), 'utf-8')
const parsed = parseMarkdown(content)
```

### Use Content Collections

Instead, define content collections in `src/content.config.ts` and use Astro's content APIs:

**Correct:**

```typescript
// src/content.config.ts
import { defineCollection } from 'astro:content'
import { docsSchema } from '@levino/shipyard-docs'
import { blogSchema } from '@levino/shipyard-blog'
import { glob } from 'astro/loaders'

const docs = defineCollection({
  schema: docsSchema,
  loader: glob({ pattern: '**/*.md', base: './docs' }),
})

const blog = defineCollection({
  schema: blogSchema,
  loader: glob({ pattern: '**/*.md', base: './blog' }),
})

export const collections = { docs, blog }
```

**Using collections in components:**

```astro
---
import { getCollection, render } from 'astro:content'

// Fetch all docs
const docs = await getCollection('docs')

// Render a specific doc
const { Content, headings } = await render(docs[0])
---

<Content />
```

### Why Content Loaders Are Preferred

Content collections provide several advantages over direct file access:

1. **Type safety**: Schemas validate frontmatter at build time
2. **Automatic processing**: Markdown/MDX is parsed and rendered automatically
3. **Caching**: Astro caches processed content for faster builds
4. **Consistency**: All content goes through the same processing pipeline
5. **Integration**: Works seamlessly with Astro's routing and rendering

### Content Collection Patterns

#### Fetching Collections

```typescript
import { getCollection, getEntry } from 'astro:content'

// Get all entries in a collection
const allDocs = await getCollection('docs')

// Filter entries
const publishedDocs = await getCollection('docs', ({ data }) => {
  return data.draft !== true
})

// Get a specific entry by slug
const entry = await getEntry('docs', 'getting-started')
```

#### Rendering Content

```typescript
import { render } from 'astro:content'

const doc = await getEntry('docs', 'getting-started')
const { Content, headings } = await render(doc)

// Content is a renderable Astro component
// headings is an array of heading objects for table of contents
```

#### Processing Collection Data

```typescript
const docs = await getCollection('docs')

// Transform collection data
const processedDocs = docs.map((doc) => ({
  id: doc.id,
  title: doc.data.title,
  path: `/docs/${doc.id.replace(/\.md$/, '')}`,
  position: doc.data.sidebar_position ?? Infinity,
}))
```

### Exception Cases

Direct file system access may be appropriate in limited circumstances:

1. **Build-time scripts**: Tools that run outside Astro's build process
2. **Non-content files**: Configuration files, generated assets
3. **Custom loaders**: When implementing a custom content loader

Even in these cases, consider whether a content collection with a custom loader would be more appropriate.

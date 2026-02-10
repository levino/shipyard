---
title: Markdown Features
sidebar:
  position: 4
description: Learn about admonitions, code blocks, tabs, and other enhanced markdown features in shipyard
---

# Markdown Features

shipyard enhances standard markdown with features like admonitions, code block enhancements, tabs, and more. These features work automatically in all documentation and blog content — no additional configuration is needed.

---

## Admonitions

Admonitions (also called callouts) highlight important information with colored boxes. shipyard supports five types using the `:::` container directive syntax.

### Syntax

````markdown
:::note
This is a note. Use it for general information.
:::

:::tip
This is a tip. Use it for helpful advice.
:::

:::info
This is info. Use it for supplementary information.
:::

:::warning
This is a warning. Use it when users should be careful.
:::

:::danger
This is a danger notice. Use it for critical warnings.
:::
````

### Custom Titles

Add a custom title in square brackets after the type:

````markdown
:::note[Did you know?]
You can customize the title of any admonition.
:::

:::warning[Security Notice]
Always validate user input before processing.
:::
````

### Available Types

| Type | Color | Default Title | Use Case |
|------|-------|---------------|----------|
| `note` | Blue | Note | General information |
| `tip` | Green | Tip | Helpful advice |
| `info` | Cyan | Info | Supplementary details |
| `warning` | Yellow | Warning | Caution or potential issues |
| `danger` | Red | Danger | Critical warnings |

Admonitions follow DaisyUI's semantic color system, so they automatically adapt to your site's theme.

---

## Code Blocks

shipyard enhances code blocks with titles, line numbers, line highlighting, and magic comments.

### Syntax Highlighting

Standard fenced code blocks include syntax highlighting via Shiki:

````markdown
```javascript
function greet(name) {
  console.log(`Hello, ${name}!`)
}
```
````

### Code Block Titles

Add a `title` attribute to display a filename or description above the code block:

````markdown
```javascript title="src/utils/greet.js"
export function greet(name) {
  console.log(`Hello, ${name}!`)
}
```
````

### Line Numbers

Add `showLineNumbers` to display line numbers:

````markdown
```javascript showLineNumbers
function calculateSum(numbers) {
  let sum = 0
  for (const num of numbers) {
    sum += num
  }
  return sum
}
```
````

Start from a specific line number:

````markdown
```javascript showLineNumbers=10
const config = {
  theme: 'dark',
  language: 'en',
}
```
````

### Line Highlighting

Highlight specific lines using curly brace syntax in the code fence:

````markdown
```javascript {2,4-6}
function processData(data) {
  const validated = validate(data)       // highlighted
  const transformed = transform(validated)
  return {                               // lines 4-6 highlighted
    success: true,
    data: transformed,
  }
}
```
````

### Magic Comments

Use special comments to highlight lines without the comment appearing in the output:

````markdown
```javascript
function handleRequest(req, res) {
  // highlight-next-line
  const userId = req.params.id

  // highlight-start
  const user = await db.findUser(userId)
  if (!user) {
    return res.status(404).json({ error: 'Not found' })
  }
  // highlight-end

  res.json(user)
}
```
````

Supported comment syntaxes:

| Language | Single line | Block start | Block end |
|----------|------------|-------------|-----------|
| JavaScript/TypeScript | `// highlight-next-line` | `// highlight-start` | `// highlight-end` |
| Python | `# highlight-next-line` | `# highlight-start` | `# highlight-end` |
| Bash/Shell | `# highlight-next-line` | `# highlight-start` | `# highlight-end` |
| HTML | `<!-- highlight-next-line -->` | `<!-- highlight-start -->` | `<!-- highlight-end -->` |

### Combined Features

Combine titles, line numbers, and highlighting in a single code block:

````markdown
```typescript title="src/api/users.ts" showLineNumbers {3,7-9}
import { db } from './database'

export async function getUser(id: string) {
  const user = await db.users.findUnique({
    where: { id },
  })
  if (!user) {
    throw new NotFoundError('User not found')
  }
  return user
}
```
````

---

## npm2yarn

Code blocks with the `npm2yarn` meta string automatically show tabs for npm, yarn, and pnpm:

````markdown
```bash npm2yarn
npm install @levino/shipyard-base
```
````

This renders a tabbed code block where users can switch between package managers.

---

## Tabs

The `Tabs` and `TabItem` components let you group content into switchable tabs. Import them in MDX files:

```mdx
import { Tabs, TabItem } from '@levino/shipyard-base/components'

<Tabs items={['npm', 'yarn', 'pnpm']}>
  <TabItem value="npm">
    ```bash
    npm install my-package
    ```
  </TabItem>
  <TabItem value="yarn">
    ```bash
    yarn add my-package
    ```
  </TabItem>
  <TabItem value="pnpm">
    ```bash
    pnpm add my-package
    ```
  </TabItem>
</Tabs>
```

By default, each `Tabs` instance manages its own selected tab. To sync the selection across multiple tab groups, give them the same `groupId`.

---

## Collapsible Sections

Use the HTML `<details>` element for collapsible/expandable content:

```markdown
<details>
<summary>Click to expand</summary>

Hidden content goes here. You can include:
- Lists
- Code blocks
- Any other markdown content

</details>
```

---

## Tables

Standard markdown tables are supported with responsive horizontal scrolling on mobile:

```markdown
| Feature     | Status    | Notes                |
|-------------|-----------|----------------------|
| Admonitions | Supported | All five types       |
| Code Blocks | Supported | With enhancements    |
| Tables      | Supported | Responsive scrolling |
```

---

## Other Markdown Features

shipyard supports all standard markdown features:

- **Bold** and *italic* text
- ~~Strikethrough~~ text
- `Inline code`
- [Links](https://example.com) (internal and external)
- Ordered and unordered lists
- Task lists (`- [x]` and `- [ ]`)
- Blockquotes
- Images
- Horizontal rules
- Heading anchors (auto-generated)

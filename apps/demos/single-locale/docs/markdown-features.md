---
title: Markdown Features
description: Explore all the enhanced markdown features available in shipyard
sidebar:
  position: 50
tags:
  - markdown
  - documentation
---

# Markdown Features

shipyard supports enhanced markdown features that make your documentation richer and more interactive.

## Admonitions

Admonitions (also called callouts) are a great way to highlight important information:

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

### Custom Titles

You can add custom titles to admonitions:

:::note[Custom Title]
This note has a custom title instead of the default "Note".
:::

:::warning[Important Security Notice]
Always validate user input before processing.
:::

## Details (Collapsible Sections)

Use the HTML `<details>` element for collapsible content:

<details>
<summary>Click to expand</summary>

This content is hidden by default but can be revealed by clicking the summary.

You can include:
- Lists
- Code blocks
- Any other markdown content

</details>

## Code Blocks

Standard code blocks with syntax highlighting:

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet("shipyard");
```

### Code Block Titles

Add titles to code blocks to show filenames or descriptions:

```javascript title="src/utils/greet.js"
export function greet(name) {
  console.log(`Hello, ${name}!`);
}
```

```python title="greet.py"
def greet(name):
    print(f"Hello, {name}!")

greet("shipyard")
```

### Line Numbers

Display line numbers in code blocks:

```javascript showLineNumbers
function calculateSum(numbers) {
  let sum = 0;
  for (const num of numbers) {
    sum += num;
  }
  return sum;
}
```

Start from a custom line number:

```javascript showLineNumbers=10
// This code starts at line 10
const config = {
  theme: 'dark',
  language: 'en',
};
```

### Line Highlighting

Highlight specific lines using curly brace syntax:

```javascript {2,4-6}
function processData(data) {
  const validated = validate(data);  // This line is highlighted
  const transformed = transform(validated);
  return {                           // Lines 4-6 are highlighted
    success: true,
    data: transformed,
  };
}
```

### Magic Comments

Use comments to highlight lines without showing the comment:

```javascript
function handleRequest(req, res) {
  // highlight-next-line
  const userId = req.params.id;

  // highlight-start
  const user = await db.findUser(userId);
  if (!user) {
    return res.status(404).json({ error: 'Not found' });
  }
  // highlight-end

  res.json(user);
}
```

### Combined Features

Combine titles, line numbers, and highlighting:

```typescript title="src/api/users.ts" showLineNumbers {3,7-9}
import { db } from './database';

export async function getUser(id: string) {
  const user = await db.users.findUnique({
    where: { id },
  });
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
}
```

```css
.admonition {
  border-left: 4px solid var(--primary-color);
  padding: 1rem;
  margin: 1rem 0;
}
```

## Tables

| Feature | Status | Notes |
|---------|--------|-------|
| Admonitions | Supported | All types available |
| Code Blocks | Supported | With syntax highlighting |
| Tables | Supported | With horizontal scroll on mobile |
| Details | Supported | Native HTML element |

## Links and References

- [Internal link to installation](/docs/installation)
- [External link](https://astro.build)
- [Link to blog](/blog)

## Emphasis and Formatting

- **Bold text** for emphasis
- *Italic text* for subtle emphasis
- ~~Strikethrough~~ for deleted content
- `inline code` for technical terms
- [Links](https://example.com) for references

## Lists

### Unordered Lists

- First item
- Second item
  - Nested item
  - Another nested item
- Third item

### Ordered Lists

1. First step
2. Second step
   1. Sub-step A
   2. Sub-step B
3. Third step

### Task Lists

- [x] Completed task
- [ ] Pending task
- [ ] Another pending task

## Blockquotes

> This is a blockquote. Use it for quotes or to highlight important passages.
>
> Blockquotes can span multiple paragraphs.

## Images

Images can be added with standard markdown syntax:

```markdown
![Alt text](./image.png)
```

## Horizontal Rules

Use three dashes to create a horizontal rule:

---

## Conclusion

These markdown features help you create rich, interactive documentation that's easy to read and navigate.

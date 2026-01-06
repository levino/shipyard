import { describe, expect, it } from 'vitest'
import { extractFirstParagraph } from './fallbacks'

describe('extractFirstParagraph', () => {
  it('should extract a simple paragraph', () => {
    const body = 'This is the first paragraph.'
    expect(extractFirstParagraph(body)).toBe('This is the first paragraph.')
  })

  it('should extract first paragraph and ignore subsequent content', () => {
    const body = `This is the first paragraph.

This is the second paragraph.`
    expect(extractFirstParagraph(body)).toBe('This is the first paragraph.')
  })

  it('should skip headings and extract first paragraph', () => {
    const body = `# Main Heading

This is the first paragraph.

More content here.`
    expect(extractFirstParagraph(body)).toBe('This is the first paragraph.')
  })

  it('should skip multiple headings', () => {
    const body = `# Heading 1
## Heading 2
### Heading 3

First paragraph content.`
    expect(extractFirstParagraph(body)).toBe('First paragraph content.')
  })

  it('should combine multi-line paragraphs', () => {
    const body = `First line of paragraph.
Second line of same paragraph.
Third line.

Next paragraph.`
    expect(extractFirstParagraph(body)).toBe(
      'First line of paragraph. Second line of same paragraph. Third line.',
    )
  })

  it('should skip code blocks', () => {
    const body = `\`\`\`javascript
const code = 'example'
\`\`\`

Actual first paragraph.`
    expect(extractFirstParagraph(body)).toBe('Actual first paragraph.')
  })

  it('should skip images', () => {
    const body = `![Alt text](image.png)

First paragraph after image.`
    expect(extractFirstParagraph(body)).toBe('First paragraph after image.')
  })

  it('should skip list items', () => {
    const body = `- Item 1
- Item 2
* Item 3
1. Numbered item

First actual paragraph.`
    expect(extractFirstParagraph(body)).toBe('First actual paragraph.')
  })

  it('should skip blockquotes', () => {
    const body = `> This is a quote
> More quote

First paragraph.`
    expect(extractFirstParagraph(body)).toBe('First paragraph.')
  })

  it('should skip horizontal rules', () => {
    const body = `---

First paragraph.`
    expect(extractFirstParagraph(body)).toBe('First paragraph.')
  })

  it('should skip HTML comments', () => {
    const body = `<!-- This is a comment -->

First paragraph.`
    expect(extractFirstParagraph(body)).toBe('First paragraph.')
  })

  it('should return undefined for empty content', () => {
    expect(extractFirstParagraph('')).toBeUndefined()
  })

  it('should return undefined for content with only headings', () => {
    const body = `# Heading 1
## Heading 2`
    expect(extractFirstParagraph(body)).toBeUndefined()
  })

  it('should return undefined for content with only non-paragraph elements', () => {
    const body = `- List item
- Another item
> Quote

---

\`\`\`code\`\`\``
    expect(extractFirstParagraph(body)).toBeUndefined()
  })

  it('should handle content starting with paragraph directly', () => {
    const body = `Direct paragraph without preceding newlines.

Second paragraph.`
    expect(extractFirstParagraph(body)).toBe(
      'Direct paragraph without preceding newlines.',
    )
  })

  it('should handle mixed markdown elements before paragraph', () => {
    const body = `# Title

![Image](img.png)

> Quote

- List

Finally, the first paragraph.`
    expect(extractFirstParagraph(body)).toBe('Finally, the first paragraph.')
  })
})

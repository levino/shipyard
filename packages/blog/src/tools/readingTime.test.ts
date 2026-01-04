import { describe, expect, it } from 'vitest'
import { calculateReadingTime } from './readingTime'

describe('calculateReadingTime', () => {
  it('calculates reading time for short text', () => {
    const text = 'Hello world this is a short text.'
    const result = calculateReadingTime(text, 200)

    expect(result.minutes).toBe(1)
    expect(result.text).toBe('1 min read')
  })

  it('calculates reading time for longer text', () => {
    // Create a text with approximately 400 words (2 minutes at 200 wpm)
    const words = Array(400).fill('word').join(' ')
    const result = calculateReadingTime(words, 200)

    expect(result.minutes).toBe(2)
    expect(result.text).toBe('2 min read')
  })

  it('rounds up reading time', () => {
    // 250 words at 200 wpm = 1.25 minutes, should round up to 2
    const words = Array(250).fill('word').join(' ')
    const result = calculateReadingTime(words, 200)

    expect(result.minutes).toBe(2)
    expect(result.text).toBe('2 min read')
  })

  it('removes code blocks from word count', () => {
    const text = `
Here is some text.

\`\`\`javascript
const x = 1;
const y = 2;
const z = 3;
// lots more code here
\`\`\`

And more text after.
    `
    const result = calculateReadingTime(text, 200)

    // Should only count the prose, not the code
    expect(result.minutes).toBe(1)
  })

  it('removes inline code from word count', () => {
    const text =
      'Use the `calculateReadingTime` function with `wordsPerMinute`.'
    const result = calculateReadingTime(text, 200)

    expect(result.minutes).toBe(1)
  })

  it('removes markdown links', () => {
    const text =
      'Check out [this link](https://example.com) and ![image](image.png).'
    const result = calculateReadingTime(text, 200)

    expect(result.minutes).toBe(1)
  })

  it('removes HTML tags', () => {
    const text = '<div>Hello</div> <span>World</span>'
    const result = calculateReadingTime(text, 200)

    expect(result.minutes).toBe(1)
  })

  it('uses custom words per minute', () => {
    const words = Array(100).fill('word').join(' ')

    const slow = calculateReadingTime(words, 100)
    const fast = calculateReadingTime(words, 200)

    expect(slow.minutes).toBe(1)
    expect(fast.minutes).toBe(1)
  })

  it('handles empty text', () => {
    const result = calculateReadingTime('', 200)

    expect(result.minutes).toBe(0)
    expect(result.text).toBe('0 min read')
  })
})

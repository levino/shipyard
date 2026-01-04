import { describe, expect, it } from 'vitest'
import { parseCodeMeta } from './remarkCodeBlocks'

describe('parseCodeMeta', () => {
  it('returns empty object for undefined meta', () => {
    expect(parseCodeMeta(undefined)).toEqual({})
  })

  it('returns empty object for empty meta', () => {
    expect(parseCodeMeta('')).toEqual({})
  })

  it('parses title with double quotes', () => {
    const result = parseCodeMeta('title="example.js"')

    expect(result.title).toBe('example.js')
  })

  it('parses title with single quotes', () => {
    const result = parseCodeMeta("title='example.ts'")

    expect(result.title).toBe('example.ts')
  })

  it('parses showLineNumbers', () => {
    const result = parseCodeMeta('showLineNumbers')

    expect(result.showLineNumbers).toBe(true)
  })

  it('parses single line highlight', () => {
    const result = parseCodeMeta('{5}')

    expect(result.highlightLines).toEqual([5])
  })

  it('parses multiple line highlights', () => {
    const result = parseCodeMeta('{1,3,5}')

    expect(result.highlightLines).toEqual([1, 3, 5])
  })

  it('parses line range highlights', () => {
    const result = parseCodeMeta('{1-3}')

    expect(result.highlightLines).toEqual([1, 2, 3])
  })

  it('parses mixed line and range highlights', () => {
    const result = parseCodeMeta('{1,3-5,7}')

    expect(result.highlightLines).toEqual([1, 3, 4, 5, 7])
  })

  it('parses all options together', () => {
    const result = parseCodeMeta('title="app.tsx" showLineNumbers {1,3-5}')

    expect(result.title).toBe('app.tsx')
    expect(result.showLineNumbers).toBe(true)
    expect(result.highlightLines).toEqual([1, 3, 4, 5])
  })

  it('handles whitespace in highlight spec', () => {
    const result = parseCodeMeta('{1, 3 - 5, 7}')

    expect(result.highlightLines).toEqual([1, 3, 4, 5, 7])
  })

  it('ignores invalid line numbers', () => {
    const result = parseCodeMeta('{abc,def}')

    expect(result.highlightLines).toBeUndefined()
  })
})

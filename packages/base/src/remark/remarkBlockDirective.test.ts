import { remark } from 'remark'
import remarkHtml from 'remark-html'
import { describe, expect, it } from 'vitest'
import { remarkAdmonitions } from './remarkAdmonitions'
import { remarkBlockDirective } from './remarkBlockDirective'

const process = async (markdown: string): Promise<string> => {
  const result = await remark()
    .use(remarkBlockDirective)
    .use(remarkAdmonitions)
    .use(remarkHtml, { sanitize: false })
    .process(markdown)
  return String(result)
}

describe('remarkBlockDirective', () => {
  describe('German gender colon', () => {
    it('does not split paragraphs containing :innen', async () => {
      const input =
        'herzlicher Dank an die Organisator:innen vom **ADFC** und an alle Ordner:innen'
      const result = await process(input)
      expect(result).toContain('Organisator:innen')
      expect(result).toContain('Ordner:innen')
      expect(result).not.toContain('<div></div>')
    })

    it('preserves :innen inside a paragraph as plain text', async () => {
      const input = 'Liebe Anwohner:innen, willkommen.'
      const result = await process(input)
      expect(result).toContain('Liebe Anwohner:innen, willkommen.')
    })

    it('handles multiple gender colon variants in one paragraph', async () => {
      const input = 'Mitarbeiter:innen, Lehrer:innen und Schüler:innen.'
      const result = await process(input)
      expect(result).toContain(
        'Mitarbeiter:innen, Lehrer:innen und Schüler:innen.',
      )
      expect(result).not.toContain('<div></div>')
    })
  })

  describe('container directives', () => {
    it('still parses :::note admonitions', async () => {
      const input = ':::note\nThis is a note\n:::'
      const result = await process(input)
      expect(result).toContain('admonition')
      expect(result).toContain('admonition-note')
      expect(result).toContain('This is a note')
    })

    it('still parses :::warning with custom title', async () => {
      const input = ':::warning[Be Careful]\nWatch out\n:::'
      const result = await process(input)
      expect(result).toContain('admonition-warning')
      expect(result).toContain('Be Careful')
    })
  })

  describe('inline text directives', () => {
    it('does not consume :name as a directive', async () => {
      const input = 'Use :foo as a marker.'
      const result = await process(input)
      // Without text-directive support `:foo` stays as plain text.
      expect(result).toContain(':foo')
      expect(result).not.toContain('<div></div>')
    })
  })
})

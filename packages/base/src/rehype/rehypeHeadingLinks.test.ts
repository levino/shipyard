import { fromHtml } from 'hast-util-from-html'
import { toHtml } from 'hast-util-to-html'
import { unified } from 'unified'
import { VFile } from 'vfile'
import { describe, expect, it } from 'vitest'
import { rehypeHeadingLinks } from './rehypeHeadingLinks'

const run = async (html: string) => {
  const processor = unified().use(rehypeHeadingLinks)
  const tree = await processor.run(
    fromHtml(html, { fragment: true }),
    new VFile(),
  )
  return toHtml(tree)
}

describe('rehypeHeadingLinks', () => {
  it('links h2 to h4 to their own anchor', async () => {
    expect(await run('<h2>Getting started</h2><h4>Fine print</h4>')).toBe(
      '<h2 id="getting-started"><a href="#getting-started" class="heading-link">Getting started</a></h2>' +
        '<h4 id="fine-print"><a href="#fine-print" class="heading-link">Fine print</a></h4>',
    )
  })

  it('keeps existing ids and uses them as the link target', async () => {
    expect(await run('<h3 id="custom">Title</h3>')).toBe(
      '<h3 id="custom"><a href="#custom" class="heading-link">Title</a></h3>',
    )
  })

  it('creates the same slugs as Astro, including umlauts and duplicates', async () => {
    const html = await run(
      '<h2>Vorgaben fürs Angebot</h2><h2>Vorgaben fürs Angebot</h2>',
    )
    expect(html).toContain('href="#vorgaben-fürs-angebot"')
    expect(html).toContain('href="#vorgaben-fürs-angebot-1"')
  })

  it('keeps inline markup inside the link', async () => {
    expect(await run('<h2>Use <code>npm</code></h2>')).toBe(
      '<h2 id="use-npm"><a href="#use-npm" class="heading-link">Use <code>npm</code></a></h2>',
    )
  })

  it('leaves h1, h5 and h6 alone', async () => {
    expect(await run('<h1>Title</h1><h5>Small</h5>')).toBe(
      '<h1 id="title">Title</h1><h5 id="small">Small</h5>',
    )
  })

  it('does not nest links', async () => {
    expect(await run('<h2><a href="/x">Linked</a></h2>')).toBe(
      '<h2 id="linked"><a href="/x">Linked</a></h2>',
    )
  })
})

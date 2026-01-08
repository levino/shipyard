import type { Element, Root } from 'hast'
import { describe, expect, it } from 'vitest'
import { rehypeVersionLinks } from './rehypeVersionLinks'

// Helper to create a simple HAST tree with an anchor element
const createTree = (href: string): Root => ({
  type: 'root',
  children: [
    {
      type: 'element',
      tagName: 'a',
      properties: { href },
      children: [{ type: 'text', value: 'Link' }],
    },
  ],
})

// Helper to get the href from the tree after transformation
const getHref = (tree: Root): string | undefined => {
  const anchor = tree.children[0] as Element
  return anchor.properties?.href as string | undefined
}

describe('rehypeVersionLinks', () => {
  const defaultOptions = {
    routeBasePath: 'docs',
    currentVersion: 'v2',
    availableVersions: ['v1', 'v2'],
  }

  describe('external links', () => {
    it('should not modify http links', () => {
      const tree = createTree('http://example.com')
      rehypeVersionLinks(defaultOptions)(tree)
      expect(getHref(tree)).toBe('http://example.com')
    })

    it('should not modify https links', () => {
      const tree = createTree('https://example.com/page')
      rehypeVersionLinks(defaultOptions)(tree)
      expect(getHref(tree)).toBe('https://example.com/page')
    })

    it('should not modify mailto links', () => {
      const tree = createTree('mailto:test@example.com')
      rehypeVersionLinks(defaultOptions)(tree)
      expect(getHref(tree)).toBe('mailto:test@example.com')
    })

    it('should not modify tel links', () => {
      const tree = createTree('tel:+1234567890')
      rehypeVersionLinks(defaultOptions)(tree)
      expect(getHref(tree)).toBe('tel:+1234567890')
    })

    it('should not modify anchor links', () => {
      const tree = createTree('#section-id')
      rehypeVersionLinks(defaultOptions)(tree)
      expect(getHref(tree)).toBe('#section-id')
    })
  })

  describe('cross-version links', () => {
    it('should transform @version:/path syntax to versioned URL', () => {
      const tree = createTree('@v1:/installation')
      rehypeVersionLinks(defaultOptions)(tree)
      expect(getHref(tree)).toBe('/docs/v1/installation')
    })

    it('should handle cross-version links with leading slash', () => {
      const tree = createTree('@v1:/guide/intro')
      rehypeVersionLinks(defaultOptions)(tree)
      expect(getHref(tree)).toBe('/docs/v1/guide/intro')
    })

    it('should handle cross-version links without leading slash', () => {
      const tree = createTree('@v1:guide/intro')
      rehypeVersionLinks(defaultOptions)(tree)
      expect(getHref(tree)).toBe('/docs/v1/guide/intro')
    })

    it('should handle @latest cross-version links', () => {
      const tree = createTree('@latest:/getting-started')
      rehypeVersionLinks(defaultOptions)(tree)
      expect(getHref(tree)).toBe('/docs/latest/getting-started')
    })

    it('should handle nested paths in cross-version links', () => {
      const tree = createTree('@v2:/api/methods/create')
      rehypeVersionLinks(defaultOptions)(tree)
      expect(getHref(tree)).toBe('/docs/v2/api/methods/create')
    })

    it('should handle version with dots', () => {
      const options = {
        ...defaultOptions,
        availableVersions: ['1.0.0', '2.0.0'],
      }
      const tree = createTree('@1.0.0:/page')
      rehypeVersionLinks(options)(tree)
      expect(getHref(tree)).toBe('/docs/1.0.0/page')
    })
  })

  describe('auto-versioning absolute docs paths', () => {
    it('should add current version to unversioned absolute docs path', () => {
      const tree = createTree('/docs/installation')
      rehypeVersionLinks(defaultOptions)(tree)
      expect(getHref(tree)).toBe('/docs/v2/installation')
    })

    it('should add current version to nested unversioned path', () => {
      const tree = createTree('/docs/guide/advanced/topic')
      rehypeVersionLinks(defaultOptions)(tree)
      expect(getHref(tree)).toBe('/docs/v2/guide/advanced/topic')
    })

    it('should not modify already versioned absolute path', () => {
      const tree = createTree('/docs/v1/installation')
      rehypeVersionLinks(defaultOptions)(tree)
      expect(getHref(tree)).toBe('/docs/v1/installation')
    })

    it('should not modify path with current version', () => {
      const tree = createTree('/docs/v2/installation')
      rehypeVersionLinks(defaultOptions)(tree)
      expect(getHref(tree)).toBe('/docs/v2/installation')
    })

    it('should not modify path with latest alias', () => {
      const tree = createTree('/docs/latest/installation')
      rehypeVersionLinks(defaultOptions)(tree)
      expect(getHref(tree)).toBe('/docs/latest/installation')
    })
  })

  describe('relative links', () => {
    it('should not modify relative links starting with ./', () => {
      const tree = createTree('./other-page')
      rehypeVersionLinks(defaultOptions)(tree)
      expect(getHref(tree)).toBe('./other-page')
    })

    it('should not modify relative links starting with ../', () => {
      const tree = createTree('../parent/page')
      rehypeVersionLinks(defaultOptions)(tree)
      expect(getHref(tree)).toBe('../parent/page')
    })

    it('should not modify relative links without prefix', () => {
      const tree = createTree('sibling-page')
      rehypeVersionLinks(defaultOptions)(tree)
      expect(getHref(tree)).toBe('sibling-page')
    })
  })

  describe('non-docs absolute paths', () => {
    it('should not modify absolute paths outside docs base', () => {
      const tree = createTree('/about')
      rehypeVersionLinks(defaultOptions)(tree)
      expect(getHref(tree)).toBe('/about')
    })

    it('should not modify absolute paths to other sections', () => {
      const tree = createTree('/blog/post')
      rehypeVersionLinks(defaultOptions)(tree)
      expect(getHref(tree)).toBe('/blog/post')
    })
  })

  describe('custom routeBasePath', () => {
    it('should handle custom routeBasePath', () => {
      const options = {
        routeBasePath: 'guides',
        currentVersion: 'v2',
        availableVersions: ['v1', 'v2'],
      }
      const tree = createTree('/guides/installation')
      rehypeVersionLinks(options)(tree)
      expect(getHref(tree)).toBe('/guides/v2/installation')
    })

    it('should handle cross-version links with custom routeBasePath', () => {
      const options = {
        routeBasePath: 'api',
        currentVersion: 'v3',
        availableVersions: ['v2', 'v3'],
      }
      const tree = createTree('@v2:/endpoint')
      rehypeVersionLinks(options)(tree)
      expect(getHref(tree)).toBe('/api/v2/endpoint')
    })
  })

  describe('edge cases', () => {
    it('should handle empty href', () => {
      const tree: Root = {
        type: 'root',
        children: [
          {
            type: 'element',
            tagName: 'a',
            properties: { href: '' },
            children: [],
          },
        ],
      }
      rehypeVersionLinks(defaultOptions)(tree)
      expect(getHref(tree)).toBe('')
    })

    it('should handle anchor without href', () => {
      const tree: Root = {
        type: 'root',
        children: [
          {
            type: 'element',
            tagName: 'a',
            properties: {},
            children: [],
          },
        ],
      }
      rehypeVersionLinks(defaultOptions)(tree)
      expect(getHref(tree)).toBeUndefined()
    })

    it('should handle non-anchor elements', () => {
      const tree: Root = {
        type: 'root',
        children: [
          {
            type: 'element',
            tagName: 'div',
            properties: { href: '/docs/page' },
            children: [],
          },
        ],
      }
      rehypeVersionLinks(defaultOptions)(tree)
      // Should not modify non-anchor elements
      expect((tree.children[0] as Element).properties?.href).toBe('/docs/page')
    })

    it('should handle docs path that matches version name', () => {
      const options = {
        routeBasePath: 'docs',
        currentVersion: 'v2',
        availableVersions: ['v1', 'v2', 'beta'],
      }
      // Path starting with 'beta' which is a version
      const tree = createTree('/docs/beta/page')
      rehypeVersionLinks(options)(tree)
      expect(getHref(tree)).toBe('/docs/beta/page')
    })

    it('should handle index path', () => {
      const tree = createTree('/docs/index')
      rehypeVersionLinks(defaultOptions)(tree)
      expect(getHref(tree)).toBe('/docs/v2/index')
    })

    it('should handle root docs path', () => {
      const tree = createTree('/docs/')
      rehypeVersionLinks(defaultOptions)(tree)
      expect(getHref(tree)).toBe('/docs/v2/')
    })
  })

  describe('multiple links in tree', () => {
    it('should transform all links in the tree', () => {
      const tree: Root = {
        type: 'root',
        children: [
          {
            type: 'element',
            tagName: 'a',
            properties: { href: '/docs/page1' },
            children: [],
          },
          {
            type: 'element',
            tagName: 'p',
            properties: {},
            children: [
              {
                type: 'element',
                tagName: 'a',
                properties: { href: '@v1:/page2' },
                children: [],
              },
            ],
          },
          {
            type: 'element',
            tagName: 'a',
            properties: { href: 'https://external.com' },
            children: [],
          },
        ],
      }

      rehypeVersionLinks(defaultOptions)(tree)

      // First link auto-versioned
      expect((tree.children[0] as Element).properties?.href).toBe(
        '/docs/v2/page1',
      )
      // Nested link cross-version transformed
      expect(
        ((tree.children[1] as Element).children[0] as Element).properties?.href,
      ).toBe('/docs/v1/page2')
      // External link unchanged
      expect((tree.children[2] as Element).properties?.href).toBe(
        'https://external.com',
      )
    })
  })
})

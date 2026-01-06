import { remark } from 'remark'
import remarkHtml from 'remark-html'
import { describe, expect, it } from 'vitest'
import { remarkNpm2Yarn } from './remarkNpm2Yarn'

const process = async (markdown: string): Promise<string> => {
  const result = await remark()
    .use(remarkNpm2Yarn)
    .use(remarkHtml, { sanitize: false })
    .process(markdown)
  return String(result)
}

describe('remarkNpm2Yarn', () => {
  describe('npm install transformations', () => {
    it('transforms npm install to yarn add', async () => {
      const input = '```bash npm2yarn\nnpm install lodash\n```'
      const result = await process(input)
      expect(result).toContain('yarn add lodash')
    })

    it('transforms npm install to pnpm add', async () => {
      const input = '```bash npm2yarn\nnpm install lodash\n```'
      const result = await process(input)
      expect(result).toContain('pnpm add lodash')
    })

    it('transforms npm install (no packages) to yarn', async () => {
      const input = '```bash npm2yarn\nnpm install\n```'
      const result = await process(input)
      // yarn without arguments is just "yarn"
      expect(result).toContain('yarn\n')
      expect(result).toContain('pnpm install')
    })

    it('transforms --save-dev to yarn --dev', async () => {
      const input = '```bash npm2yarn\nnpm install --save-dev jest\n```'
      const result = await process(input)
      expect(result).toContain('yarn add --dev jest')
    })

    it('transforms -D to pnpm -D', async () => {
      const input = '```bash npm2yarn\nnpm install -D typescript\n```'
      const result = await process(input)
      expect(result).toContain('pnpm add -D typescript')
    })
  })

  describe('npm uninstall transformations', () => {
    it('transforms npm uninstall to yarn remove', async () => {
      const input = '```bash npm2yarn\nnpm uninstall lodash\n```'
      const result = await process(input)
      expect(result).toContain('yarn remove lodash')
    })

    it('transforms npm uninstall to pnpm remove', async () => {
      const input = '```bash npm2yarn\nnpm uninstall lodash\n```'
      const result = await process(input)
      expect(result).toContain('pnpm remove lodash')
    })
  })

  describe('npm run transformations', () => {
    it('transforms npm run to yarn script', async () => {
      const input = '```bash npm2yarn\nnpm run build\n```'
      const result = await process(input)
      expect(result).toContain('yarn build')
    })

    it('transforms npm run to pnpm script', async () => {
      const input = '```bash npm2yarn\nnpm run test\n```'
      const result = await process(input)
      expect(result).toContain('pnpm test')
    })
  })

  describe('npm ci transformations', () => {
    it('transforms npm ci to yarn install --frozen-lockfile', async () => {
      const input = '```bash npm2yarn\nnpm ci\n```'
      const result = await process(input)
      expect(result).toContain('yarn install --frozen-lockfile')
    })

    it('transforms npm ci to pnpm install --frozen-lockfile', async () => {
      const input = '```bash npm2yarn\nnpm ci\n```'
      const result = await process(input)
      expect(result).toContain('pnpm install --frozen-lockfile')
    })
  })

  describe('tabs structure', () => {
    it('creates tabs container with npm2yarn-tabs class', async () => {
      const input = '```bash npm2yarn\nnpm install lodash\n```'
      const result = await process(input)
      expect(result).toContain('class="npm2yarn-tabs"')
    })

    it('creates tab buttons for npm, yarn, pnpm', async () => {
      const input = '```bash npm2yarn\nnpm install lodash\n```'
      const result = await process(input)
      expect(result).toContain('data-tab="npm"')
      expect(result).toContain('data-tab="yarn"')
      expect(result).toContain('data-tab="pnpm"')
    })

    it('npm tab is active by default', async () => {
      const input = '```bash npm2yarn\nnpm install lodash\n```'
      const result = await process(input)
      expect(result).toContain('class="tab-button active" data-tab="npm"')
    })
  })

  describe('non-npm2yarn code blocks', () => {
    it('does not transform code blocks without npm2yarn meta', async () => {
      const input = '```bash\nnpm install lodash\n```'
      const result = await process(input)
      expect(result).not.toContain('npm2yarn-tabs')
      expect(result).toContain('npm install lodash')
    })

    it('does not transform non-bash code blocks with npm2yarn', async () => {
      const input = '```javascript npm2yarn\nconst x = 1\n```'
      const result = await process(input)
      expect(result).not.toContain('npm2yarn-tabs')
    })
  })

  describe('multiple commands', () => {
    it('transforms multiple npm commands in one block', async () => {
      const input =
        '```bash npm2yarn\nnpm install lodash\nnpm install react\n```'
      const result = await process(input)
      expect(result).toContain('yarn add lodash')
      expect(result).toContain('yarn add react')
      expect(result).toContain('pnpm add lodash')
      expect(result).toContain('pnpm add react')
    })
  })
})

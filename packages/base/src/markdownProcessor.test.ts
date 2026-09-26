import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { UnifiedResolvedOptions } from '@astrojs/markdown-remark'
import { unified } from '@astrojs/markdown-remark'
import { satteri } from '@astrojs/markdown-satteri'
import type { AstroConfig, AstroInlineConfig } from 'astro'
import { sync } from 'astro'
import { afterEach, describe, expect, test, vi } from 'vitest'
import shipyard from './index'
import type { Config } from './schemas/config'

const SHIPYARD_PLUGIN_COUNT = 3

interface ConfigUpdate {
  markdown?: {
    remarkPlugins?: unknown
    processor?: { name: string; options: UnifiedResolvedOptions }
  }
}

const baseConfig: Config = {
  title: 'Test',
  brand: 'Test',
  tagline: 'Test',
  navigation: {},
}

/**
 * Runs the integration's `astro:config:setup` hook against a fake Astro config
 * and returns whatever it passed to `updateConfig`, plus the logger it used.
 * Without a processor, the config gets Astro's default, as resolution does.
 */
const runConfigSetup = (
  processor: { name: string; options: object } = satteri(),
) => {
  const updates: ConfigUpdate[] = []
  const logger = { warn: vi.fn(), info: vi.fn(), error: vi.fn() }

  const integration = shipyard(baseConfig)
  const hook = integration.hooks['astro:config:setup']
  if (!hook) throw new Error('astro:config:setup hook missing')

  hook({
    updateConfig: (update: ConfigUpdate) => updates.push(update),
    config: { markdown: { processor } },
    logger,
  } as never)

  return { update: updates[0], logger }
}

describe('markdown processor', () => {
  test("replaces Astro's default processor with unified, without a warning", () => {
    const { update, logger } = runConfigSetup()

    expect(update?.markdown?.processor?.name).toBe(unified().name)
    expect(update?.markdown?.processor?.options.remarkPlugins).toHaveLength(
      SHIPYARD_PLUGIN_COUNT,
    )
    expect(logger.warn).not.toHaveBeenCalled()
  })

  test('does not use the deprecated markdown.remarkPlugins option', () => {
    const { update } = runConfigSetup()

    expect(update?.markdown).not.toHaveProperty('remarkPlugins')
  })

  test("keeps the user's own plugins on an existing unified processor", () => {
    const userPlugin = () => undefined
    const { update, logger } = runConfigSetup(
      unified({ remarkPlugins: [userPlugin] }),
    )

    const plugins = update?.markdown?.processor?.options.remarkPlugins
    expect(plugins).toHaveLength(SHIPYARD_PLUGIN_COUNT + 1)
    expect(plugins?.[0]).toBe(userPlugin)
    expect(logger.warn).not.toHaveBeenCalled()
  })

  test("carries over the user's other unified options", () => {
    const { update } = runConfigSetup(
      unified({ gfm: false, smartypants: false }),
    )

    expect(update?.markdown?.processor?.options.gfm).toBe(false)
    expect(update?.markdown?.processor?.options.smartypants).toBe(false)
  })

  test('leaves a configured satteri processor alone and warns', () => {
    const { update, logger } = runConfigSetup(
      satteri({ features: { directive: true } }),
    )

    expect(update).not.toHaveProperty('markdown')
    expect(logger.warn).toHaveBeenCalledOnce()
    expect(logger.warn.mock.calls[0]?.[0]).toContain('satteri')
  })

  test('leaves any other configured processor alone and warns', () => {
    const { update, logger } = runConfigSetup({ name: 'custom', options: {} })

    expect(update).not.toHaveProperty('markdown')
    expect(logger.warn).toHaveBeenCalledOnce()
    expect(logger.warn.mock.calls[0]?.[0]).toContain('custom')
  })
})

describe('markdown processor with the real Astro config', () => {
  let root: string | undefined

  afterEach(async () => {
    vi.restoreAllMocks()
    if (root) await rm(root, { recursive: true, force: true })
  })

  const resolveWithAstro = async (
    configured?: NonNullable<AstroInlineConfig['markdown']>['processor'],
  ) => {
    root = await mkdtemp(join(tmpdir(), 'shipyard-markdown-'))
    // Astro's console logger sends warnings to `console.info`, errors to `console.error`.
    const output = [
      vi.spyOn(console, 'info').mockImplementation(() => {}),
      vi.spyOn(console, 'error').mockImplementation(() => {}),
    ]
    let processor: AstroConfig['markdown']['processor'] | undefined

    await sync({
      root,
      markdown: configured ? { processor: configured } : {},
      logger: { entrypoint: 'astro/logger/console' },
      integrations: [
        shipyard(baseConfig),
        {
          name: 'processor-probe',
          hooks: {
            'astro:config:done': ({ config }) => {
              processor = config.markdown.processor
            },
          },
        },
      ],
    })

    const shipyardWarnings = output
      .flatMap((spy) => spy.mock.calls)
      .map(([message]) => String(message))
      .filter((message) => /\[(WARN|ERROR)\] \[shipyard\]/.test(message))
    return { processor, shipyardWarnings }
  }

  test('a site without markdown.processor builds warning-free on unified', async () => {
    const { processor, shipyardWarnings } = await resolveWithAstro()

    expect(shipyardWarnings).toEqual([])
    expect(processor?.name).toBe(unified().name)
  })

  test('an explicitly configured satteri processor survives', async () => {
    const { processor, shipyardWarnings } = await resolveWithAstro(
      satteri({ features: { directive: true } }),
    )

    expect(processor?.name).toBe(satteri().name)
    expect(shipyardWarnings).toHaveLength(1)
    expect(shipyardWarnings[0]).toContain('`satteri`')
  })
})

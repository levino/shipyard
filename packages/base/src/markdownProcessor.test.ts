import type { UnifiedResolvedOptions } from '@astrojs/markdown-remark'
import { unified } from '@astrojs/markdown-remark'
import { describe, expect, test, vi } from 'vitest'
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
  navigation: {},
}

/**
 * Runs the integration's `astro:config:setup` hook against a fake Astro config
 * and returns whatever it passed to `updateConfig`, plus the logger it used.
 */
const runConfigSetup = (astroConfig: Record<string, unknown> = {}) => {
  const updates: ConfigUpdate[] = []
  const logger = { warn: vi.fn(), info: vi.fn(), error: vi.fn() }

  const integration = shipyard(baseConfig)
  const hook = integration.hooks['astro:config:setup']
  if (!hook) throw new Error('astro:config:setup hook missing')

  hook({
    updateConfig: (update: ConfigUpdate) => updates.push(update),
    config: astroConfig,
    logger,
  } as never)

  return { update: updates[0], logger }
}

describe('markdown processor', () => {
  test('pins the unified processor so remark plugins run under Astro 7', () => {
    const { update } = runConfigSetup()

    expect(update?.markdown?.processor?.name).toBe(unified().name)
    expect(update?.markdown?.processor?.options.remarkPlugins).toHaveLength(
      SHIPYARD_PLUGIN_COUNT,
    )
  })

  test('does not use the deprecated markdown.remarkPlugins option', () => {
    const { update } = runConfigSetup()

    expect(update?.markdown).not.toHaveProperty('remarkPlugins')
  })

  test("keeps the user's own plugins on an existing unified processor", () => {
    const userPlugin = () => undefined
    const { update, logger } = runConfigSetup({
      markdown: { processor: unified({ remarkPlugins: [userPlugin] }) },
    })

    const plugins = update?.markdown?.processor?.options.remarkPlugins
    expect(plugins).toHaveLength(SHIPYARD_PLUGIN_COUNT + 1)
    expect(plugins?.[0]).toBe(userPlugin)
    expect(logger.warn).not.toHaveBeenCalled()
  })

  test("carries over the user's other unified options", () => {
    const { update } = runConfigSetup({
      markdown: { processor: unified({ gfm: false, smartypants: false }) },
    })

    expect(update?.markdown?.processor?.options.gfm).toBe(false)
    expect(update?.markdown?.processor?.options.smartypants).toBe(false)
  })

  test('warns and overrides when a non-unified processor is configured', () => {
    const { update, logger } = runConfigSetup({
      markdown: { processor: { name: 'satteri', options: {} } },
    })

    expect(logger.warn).toHaveBeenCalledOnce()
    expect(logger.warn.mock.calls[0][0]).toContain('satteri')
    expect(update?.markdown?.processor?.name).toBe(unified().name)
    expect(update?.markdown?.processor?.options.remarkPlugins).toHaveLength(
      SHIPYARD_PLUGIN_COUNT,
    )
  })
})

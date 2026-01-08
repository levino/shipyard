import { describe, expect, it } from 'vitest'
import { singleVersionSchema, versionConfigSchema } from './index'

describe('singleVersionSchema', () => {
  describe('valid configurations', () => {
    it('should accept minimal version config with only version field', () => {
      const result = singleVersionSchema.safeParse({
        version: 'v1.0',
      })
      expect(result.success).toBe(true)
      expect(result.data).toEqual({ version: 'v1.0' })
    })

    it('should accept version with label', () => {
      const result = singleVersionSchema.safeParse({
        version: 'v2.0',
        label: 'Version 2.0 (Latest)',
      })
      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        version: 'v2.0',
        label: 'Version 2.0 (Latest)',
      })
    })

    it('should accept version with custom path', () => {
      const result = singleVersionSchema.safeParse({
        version: '2.0.0',
        path: 'v2',
      })
      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        version: '2.0.0',
        path: 'v2',
      })
    })

    it('should accept version with unreleased banner', () => {
      const result = singleVersionSchema.safeParse({
        version: 'next',
        banner: 'unreleased',
      })
      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        version: 'next',
        banner: 'unreleased',
      })
    })

    it('should accept version with unmaintained banner', () => {
      const result = singleVersionSchema.safeParse({
        version: 'v1.0',
        banner: 'unmaintained',
      })
      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        version: 'v1.0',
        banner: 'unmaintained',
      })
    })

    it('should accept full configuration with all fields', () => {
      const config = {
        version: 'v2.0',
        label: 'Version 2.0',
        path: 'v2',
        banner: 'unreleased' as const,
      }
      const result = singleVersionSchema.safeParse(config)
      expect(result.success).toBe(true)
      expect(result.data).toEqual(config)
    })

    it('should accept various version string formats', () => {
      const formats = ['v1', 'v1.0', 'v1.0.0', '1.0', 'latest', 'next', 'beta']
      for (const version of formats) {
        const result = singleVersionSchema.safeParse({ version })
        expect(result.success).toBe(true)
        expect(result.data?.version).toBe(version)
      }
    })
  })

  describe('invalid configurations', () => {
    it('should reject empty object', () => {
      const result = singleVersionSchema.safeParse({})
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toContain('version')
    })

    it('should reject missing version field', () => {
      const result = singleVersionSchema.safeParse({
        label: 'Some Label',
      })
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].code).toBe('invalid_type')
    })

    it('should reject non-string version', () => {
      const result = singleVersionSchema.safeParse({
        version: 123,
      })
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toContain('version')
    })

    it('should reject invalid banner value', () => {
      const result = singleVersionSchema.safeParse({
        version: 'v1.0',
        banner: 'deprecated',
      })
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toContain('banner')
    })

    it('should reject non-string label', () => {
      const result = singleVersionSchema.safeParse({
        version: 'v1.0',
        label: 123,
      })
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toContain('label')
    })

    it('should reject non-string path', () => {
      const result = singleVersionSchema.safeParse({
        version: 'v1.0',
        path: ['v1'],
      })
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toContain('path')
    })
  })
})

describe('versionConfigSchema', () => {
  describe('valid configurations', () => {
    it('should accept minimal valid configuration', () => {
      const config = {
        current: 'v1.0',
        available: [{ version: 'v1.0' }],
      }
      const result = versionConfigSchema.safeParse(config)
      expect(result.success).toBe(true)
      expect(result.data?.current).toBe('v1.0')
      expect(result.data?.available).toHaveLength(1)
      expect(result.data?.deprecated).toEqual([])
    })

    it('should accept configuration with multiple versions', () => {
      const config = {
        current: 'v2.0',
        available: [
          { version: 'v2.0', label: 'Latest' },
          { version: 'v1.0', label: 'Legacy' },
        ],
      }
      const result = versionConfigSchema.safeParse(config)
      expect(result.success).toBe(true)
      expect(result.data?.available).toHaveLength(2)
    })

    it('should accept configuration with deprecated versions', () => {
      const config = {
        current: 'v2.0',
        available: [{ version: 'v2.0' }, { version: 'v1.0' }],
        deprecated: ['v1.0'],
      }
      const result = versionConfigSchema.safeParse(config)
      expect(result.success).toBe(true)
      expect(result.data?.deprecated).toEqual(['v1.0'])
    })

    it('should accept configuration with stable version', () => {
      const config = {
        current: 'latest',
        available: [{ version: 'latest', path: 'latest' }, { version: 'v2.0' }],
        stable: 'v2.0',
      }
      const result = versionConfigSchema.safeParse(config)
      expect(result.success).toBe(true)
      expect(result.data?.stable).toBe('v2.0')
    })

    it('should accept full configuration with all fields', () => {
      const config = {
        current: 'v2.0',
        available: [
          { version: 'v2.0', label: 'Version 2.0 (Latest)' },
          { version: 'v1.0', label: 'Version 1.0', banner: 'unmaintained' },
        ],
        deprecated: ['v1.0'],
        stable: 'v2.0',
      }
      const result = versionConfigSchema.safeParse(config)
      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        current: 'v2.0',
        available: [
          { version: 'v2.0', label: 'Version 2.0 (Latest)' },
          { version: 'v1.0', label: 'Version 1.0', banner: 'unmaintained' },
        ],
        deprecated: ['v1.0'],
        stable: 'v2.0',
      })
    })

    it('should default deprecated to empty array when not provided', () => {
      const config = {
        current: 'v1.0',
        available: [{ version: 'v1.0' }],
      }
      const result = versionConfigSchema.safeParse(config)
      expect(result.success).toBe(true)
      expect(result.data?.deprecated).toEqual([])
    })

    it('should allow empty deprecated array explicitly', () => {
      const config = {
        current: 'v1.0',
        available: [{ version: 'v1.0' }],
        deprecated: [],
      }
      const result = versionConfigSchema.safeParse(config)
      expect(result.success).toBe(true)
      expect(result.data?.deprecated).toEqual([])
    })
  })

  describe('invalid configurations', () => {
    it('should reject empty object', () => {
      const result = versionConfigSchema.safeParse({})
      expect(result.success).toBe(false)
    })

    it('should reject missing current field', () => {
      const result = versionConfigSchema.safeParse({
        available: [{ version: 'v1.0' }],
      })
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toContain('current')
    })

    it('should reject missing available field', () => {
      const result = versionConfigSchema.safeParse({
        current: 'v1.0',
      })
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toContain('available')
    })

    it('should reject empty available array', () => {
      const result = versionConfigSchema.safeParse({
        current: 'v1.0',
        available: [],
      })
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].code).toBe('too_small')
    })

    it('should reject non-string current', () => {
      const result = versionConfigSchema.safeParse({
        current: 123,
        available: [{ version: 'v1.0' }],
      })
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toContain('current')
    })

    it('should reject non-array available', () => {
      const result = versionConfigSchema.safeParse({
        current: 'v1.0',
        available: { version: 'v1.0' },
      })
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toContain('available')
    })

    it('should reject invalid version in available array', () => {
      const result = versionConfigSchema.safeParse({
        current: 'v1.0',
        available: [{ notVersion: 'v1.0' }],
      })
      expect(result.success).toBe(false)
    })

    it('should reject non-array deprecated', () => {
      const result = versionConfigSchema.safeParse({
        current: 'v1.0',
        available: [{ version: 'v1.0' }],
        deprecated: 'v0.9',
      })
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toContain('deprecated')
    })

    it('should reject non-string items in deprecated array', () => {
      const result = versionConfigSchema.safeParse({
        current: 'v1.0',
        available: [{ version: 'v1.0' }],
        deprecated: [123],
      })
      expect(result.success).toBe(false)
    })

    it('should reject non-string stable', () => {
      const result = versionConfigSchema.safeParse({
        current: 'v1.0',
        available: [{ version: 'v1.0' }],
        stable: 123,
      })
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toContain('stable')
    })
  })

  describe('edge cases', () => {
    it('should accept current version not in available list', () => {
      // This is a logical error but not a schema validation error
      const config = {
        current: 'v3.0',
        available: [{ version: 'v2.0' }, { version: 'v1.0' }],
      }
      const result = versionConfigSchema.safeParse(config)
      // Schema allows this - it's up to runtime logic to validate
      expect(result.success).toBe(true)
    })

    it('should accept deprecated version not in available list', () => {
      // This is a logical error but not a schema validation error
      const config = {
        current: 'v2.0',
        available: [{ version: 'v2.0' }],
        deprecated: ['v0.5'],
      }
      const result = versionConfigSchema.safeParse(config)
      // Schema allows this - it's up to runtime logic to validate
      expect(result.success).toBe(true)
    })

    it('should accept stable version not in available list', () => {
      // This is a logical error but not a schema validation error
      const config = {
        current: 'v2.0',
        available: [{ version: 'v2.0' }],
        stable: 'v1.0',
      }
      const result = versionConfigSchema.safeParse(config)
      // Schema allows this - it's up to runtime logic to validate
      expect(result.success).toBe(true)
    })

    it('should handle very long version strings', () => {
      const config = {
        current: `v${'1'.repeat(100)}`,
        available: [{ version: `v${'1'.repeat(100)}` }],
      }
      const result = versionConfigSchema.safeParse(config)
      expect(result.success).toBe(true)
    })

    it('should handle special characters in version strings', () => {
      const config = {
        current: 'v2.0-beta.1+build.123',
        available: [{ version: 'v2.0-beta.1+build.123' }],
      }
      const result = versionConfigSchema.safeParse(config)
      expect(result.success).toBe(true)
    })

    it('should handle unicode in label', () => {
      const config = {
        current: 'v1.0',
        available: [{ version: 'v1.0', label: '版本 1.0 🚀' }],
      }
      const result = versionConfigSchema.safeParse(config)
      expect(result.success).toBe(true)
      expect(result.data?.available[0].label).toBe('版本 1.0 🚀')
    })

    it('should handle many versions in available array', () => {
      const versions = Array.from({ length: 50 }, (_, i) => ({
        version: `v${50 - i}.0`,
      }))
      const config = {
        current: 'v50.0',
        available: versions,
      }
      const result = versionConfigSchema.safeParse(config)
      expect(result.success).toBe(true)
      expect(result.data?.available).toHaveLength(50)
    })

    it('should handle duplicate versions in available (schema allows, logic should check)', () => {
      const config = {
        current: 'v1.0',
        available: [{ version: 'v1.0' }, { version: 'v1.0' }],
      }
      const result = versionConfigSchema.safeParse(config)
      // Schema allows duplicates - runtime should handle
      expect(result.success).toBe(true)
    })
  })
})
